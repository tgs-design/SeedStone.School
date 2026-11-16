import { createSign, randomUUID } from 'node:crypto'

const SHEET_HEADERS = [
  'Enquiry ID',
  'Submission Date and Time',
  'Student Name',
  'Parent Name',
  'Mobile Number',
  'Interested Grade',
  'City',
  'Lead Status',
  'Submission Key',
]
const SHEET_NAME = 'Enquiries'
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(body))
}

function getRequestBody(request) {
  if (request.body && typeof request.body === 'object' && !Array.isArray(request.body)) return request.body
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body)
    } catch {
      return null
    }
  }
  return null
}

function validateEnquiry(data) {
  if (!data || typeof data !== 'object') return null
  const fields = ['studentName', 'parentName', 'mobile', 'grade', 'city']
  if (fields.some((field) => typeof data[field] !== 'string')) return null

  const enquiry = {
    studentName: data.studentName.trim(),
    parentName: data.parentName.trim(),
    mobile: data.mobile.trim(),
    grade: data.grade.trim(),
    city: data.city.trim(),
  }
  if (
    !enquiry.studentName ||
    enquiry.studentName.length > 100 ||
    !enquiry.parentName ||
    enquiry.parentName.length > 100 ||
    !/^(?:\+?91[\s-]?)?[6-9]\d{9}$/.test(enquiry.mobile) ||
    !/^Class [1-8]$/.test(enquiry.grade) ||
    !enquiry.city ||
    enquiry.city.length > 80
  ) return null

  return enquiry
}

function getCredentials() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const allowedOrigin = process.env.SEEDSTONE_ALLOWED_ORIGIN
  if (!email || !privateKey || !spreadsheetId || !allowedOrigin) return null
  return { email, privateKey, spreadsheetId, allowedOrigin }
}

async function getAccessToken(email, privateKey) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
  const unsignedToken = [
    encode({ alg: 'RS256', typ: 'JWT' }),
    encode({
      iss: email,
      scope: SHEETS_SCOPE,
      aud: TOKEN_URL,
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  ].join('.')
  const signer = createSign('RSA-SHA256')
  signer.update(unsignedToken)
  const assertion = `${unsignedToken}.${signer.sign(privateKey, 'base64url')}`
  const tokenResponse = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  if (!tokenResponse.ok) throw new Error(`Google OAuth failed with HTTP ${tokenResponse.status}`)
  const token = await tokenResponse.json()
  if (typeof token.access_token !== 'string') throw new Error('Google OAuth response did not contain an access token')
  return token.access_token
}

async function sheetsRequest(accessToken, spreadsheetId, path, options = {}) {
  const response = await fetch(`${SHEETS_API}/${encodeURIComponent(spreadsheetId)}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) throw new Error(`Google Sheets API failed with HTTP ${response.status}`)
  return result
}

async function getSheetId(accessToken, spreadsheetId) {
  const result = await sheetsRequest(accessToken, spreadsheetId, '?fields=sheets.properties(sheetId,title)')
  const sheet = result.sheets?.find(({ properties }) => properties?.title === SHEET_NAME)
  if (sheet) return sheet.properties.sheetId

  const created = await sheetsRequest(accessToken, spreadsheetId, ':batchUpdate', {
    method: 'POST',
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] }),
  })
  const newSheet = created.replies?.[0]?.addSheet?.properties
  if (!Number.isInteger(newSheet?.sheetId)) throw new Error('Google Sheets did not create the Enquiries tab')
  return newSheet.sheetId
}

function sheetRange(range) {
  return `/values/${encodeURIComponent(`'${SHEET_NAME}'!${range}`)}`
}

async function getValues(accessToken, spreadsheetId, range) {
  const result = await sheetsRequest(accessToken, spreadsheetId, sheetRange(range))
  return result.values ?? []
}

async function ensureHeaders(accessToken, spreadsheetId) {
  const existing = await getValues(accessToken, spreadsheetId, 'A1:I1')
  const currentHeaders = existing[0] ?? []
  if (currentHeaders.length === 0) {
    await sheetsRequest(accessToken, spreadsheetId, `${sheetRange('A1:I1')}?valueInputOption=RAW`, {
      method: 'PUT',
      body: JSON.stringify({ values: [SHEET_HEADERS] }),
    })
    return
  }
  if (SHEET_HEADERS.slice(0, 8).some((header, index) => currentHeaders[index] !== header)) {
    throw new Error('The Enquiries tab has unexpected column headers')
  }
  if (currentHeaders[8] && currentHeaders[8] !== SHEET_HEADERS[8]) {
    throw new Error('The Enquiries tab has an unexpected submission-key column')
  }
  if (!currentHeaders[8]) {
    await sheetsRequest(accessToken, spreadsheetId, `${sheetRange('I1')}?valueInputOption=RAW`, {
      method: 'PUT',
      body: JSON.stringify({ values: [[SHEET_HEADERS[8]]] }),
    })
  }
}

async function findExistingSubmission(accessToken, spreadsheetId, submissionKey) {
  const keys = await getValues(accessToken, spreadsheetId, 'I2:I')
  const index = keys.findIndex((row) => row[0] === submissionKey)
  if (index < 0) return null

  const rowNumber = index + 2
  const row = (await getValues(accessToken, spreadsheetId, `A${rowNumber}:I${rowNumber}`))[0] ?? []
  return row
}

function isSameSubmission(row, enquiry, submissionKey) {
  return row[2] === enquiry.studentName &&
    row[3] === enquiry.parentName &&
    row[4] === enquiry.mobile &&
    row[5] === enquiry.grade &&
    row[6] === enquiry.city &&
    row[8] === submissionKey
}

async function saveEnquiry(accessToken, spreadsheetId, enquiry, submissionKey) {
  const existing = await findExistingSubmission(accessToken, spreadsheetId, submissionKey)
  if (existing) {
    if (!isSameSubmission(existing, enquiry, submissionKey)) {
      const error = new Error('This submission key was already used for different enquiry details')
      error.statusCode = 409
      throw error
    }
    return existing[0]
  }

  const enquiryId = `SS-${randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`
  const submittedAt = new Date().toISOString()
  const row = [
    enquiryId,
    submittedAt,
    enquiry.studentName,
    enquiry.parentName,
    enquiry.mobile,
    enquiry.grade,
    enquiry.city,
    'New',
    submissionKey,
  ]
  const appended = await sheetsRequest(accessToken, spreadsheetId, `${sheetRange('A:I')}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    body: JSON.stringify({ values: [row] }),
  })
  const updatedRange = appended.updates?.updatedRange
  if (appended.updates?.updatedRows !== 1 || typeof updatedRange !== 'string') {
    throw new Error('Google Sheets did not confirm an appended enquiry row')
  }

  const savedRow = (await getValues(accessToken, spreadsheetId, updatedRange))[0] ?? []
  if (row.some((value, index) => savedRow[index] !== value)) {
    throw new Error('The appended enquiry row did not match the submitted details')
  }
  return enquiryId
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { status: 'error', message: 'Use POST to submit an enquiry.' })
  }

  const credentials = getCredentials()
  if (!credentials) {
    return sendJson(response, 503, {
      status: 'error',
      message: 'The enquiry service is not configured. Please contact the school directly.',
    })
  }

  if (request.headers.origin !== credentials.allowedOrigin) {
    return sendJson(response, 403, { status: 'error', message: 'This enquiry request is not allowed.' })
  }

  const submissionKey = request.headers['idempotency-key']
  if (typeof submissionKey !== 'string' || !/^[0-9a-f-]{36}$/i.test(submissionKey)) {
    return sendJson(response, 400, { status: 'error', message: 'Refresh the page and submit your enquiry again.' })
  }

  const enquiry = validateEnquiry(getRequestBody(request))
  if (!enquiry) {
    return sendJson(response, 400, { status: 'error', message: 'Check the required enquiry details and try again.' })
  }

  try {
    const accessToken = await getAccessToken(credentials.email, credentials.privateKey)
    await getSheetId(accessToken, credentials.spreadsheetId)
    await ensureHeaders(accessToken, credentials.spreadsheetId)
    const enquiryId = await saveEnquiry(accessToken, credentials.spreadsheetId, enquiry, submissionKey)
    return sendJson(response, 201, { status: 'saved', enquiryId })
  } catch (error) {
    console.error('Enquiry save failed:', error instanceof Error ? error.message : 'Unknown error')
    const statusCode = error?.statusCode === 409 ? 409 : 502
    const message = statusCode === 409
      ? 'This submission could not be matched to the original enquiry. Contact the school before retrying.'
      : 'The enquiry service could not verify a saved row in the Sheet. Please contact the school before retrying.'
    return sendJson(response, statusCode, { status: 'error', message })
  }
}
