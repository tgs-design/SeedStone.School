import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import handler from './enquiry.js'

const originalFetch = globalThis.fetch
const originalAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL
const submissionKey = '123e4567-e89b-12d3-a456-426614174000'
const requestBody = {
  studentName: 'Test Student',
  parentName: 'Test Parent',
  mobile: '9876543210',
  grade: 'Class 1',
  city: 'Ahmedabad',
}

afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalAppsScriptUrl === undefined) delete process.env.GOOGLE_APPS_SCRIPT_URL
  else process.env.GOOGLE_APPS_SCRIPT_URL = originalAppsScriptUrl
})

function createResponse() {
  return {
    statusCode: 0,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value
    },
    end(bodyText) {
      this.body = JSON.parse(bodyText)
    },
  }
}

function createRequest() {
  return {
    method: 'POST',
    headers: { 'idempotency-key': submissionKey },
    body: requestBody,
  }
}

test('confirms a successful first submission with its saved enquiry ID', async () => {
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test-deployment/exec'
  globalThis.fetch = async () => ({
    status: 200,
    ok: true,
    redirected: false,
    url: 'https://script.google.com/macros/s/test-deployment/exec',
    headers: { get: () => 'application/json; charset=utf-8' },
    text: async () => JSON.stringify({ success: true, enquiryId: 'SS-ABC123DEF456' }),
  })
  const response = createResponse()

  await handler(createRequest(), response)

  assert.equal(response.statusCode, 201)
  assert.deepEqual(response.body, { success: true, enquiryId: 'SS-ABC123DEF456' })
})

test('follows Apps Script ContentService redirect and validates final JSON', async () => {
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test-deployment/exec'
  let fetchOptions
  const diagnostics = []
  const originalConsoleInfo = console.info
  globalThis.fetch = async (_url, options) => {
    fetchOptions = options
    return {
      status: 200,
      ok: true,
      redirected: true,
      url: 'https://script.googleusercontent.com/macros/echo?user_content_key=private',
      headers: { get: () => 'application/json; charset=utf-8' },
      text: async () => JSON.stringify({ success: true, enquiryId: 'SS-ABC123' }),
    }
  }
  const response = createResponse()

  console.info = (message, details) => diagnostics.push({ message, details })
  try {
    await handler(createRequest(), response)
  } finally {
    console.info = originalConsoleInfo
  }

  assert.equal(fetchOptions.redirect, 'follow')
  assert.equal(JSON.parse(fetchOptions.body).submissionKey, submissionKey)
  assert.equal(response.statusCode, 201)
  assert.deepEqual(response.body, { success: true, enquiryId: 'SS-ABC123' })
  assert.deepEqual(diagnostics[0], {
    message: 'Apps Script response diagnostics:',
    details: {
      status: 200,
      ok: true,
      redirected: true,
      configuredHostname: 'script.google.com',
      configuredPathname: '/macros/s/test-deployment/exec',
      finalResponseHostname: 'script.googleusercontent.com',
      finalResponsePathname: '/macros/echo',
      contentType: 'application/json; charset=utf-8',
      validJson: true,
      successValue: true,
      enquiryIdExists: true,
      enquiryIdValid: true,
    },
  })
})

test('rejects a success-shaped response with a final HTTP error status', async () => {
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test-deployment/exec'
  globalThis.fetch = async () => ({
    status: 500,
    ok: false,
    redirected: true,
    url: 'https://script.googleusercontent.com/macros/echo',
    headers: { get: () => 'application/json' },
    text: async () => JSON.stringify({ success: true, enquiryId: 'SS-ABC123' }),
  })
  const response = createResponse()
  const originalConsoleError = console.error
  console.error = () => {}

  try {
    await handler(createRequest(), response)
  } finally {
    console.error = originalConsoleError
  }

  assert.equal(response.statusCode, 502)
  assert.equal(response.body.success, false)
})

test('rejects invalid JSON returned by Apps Script', async () => {
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test-deployment/exec'
  const responseBody = `<html>Student ${requestBody.studentName}; Parent ${requestBody.parentName}; Mobile ${requestBody.mobile}; Key ${submissionKey}; URL https://script.googleusercontent.com/macros/echo?user_content_key=private</html>`
  const diagnostics = []
  const errors = []
  const originalConsoleInfo = console.info
  const originalConsoleError = console.error
  globalThis.fetch = async () => ({
    status: 200,
    ok: true,
    redirected: true,
    url: 'https://script.googleusercontent.com/macros/echo?user_content_key=private',
    headers: { get: () => 'text/html' },
    text: async () => responseBody,
  })
  const response = createResponse()
  console.info = (message, details) => diagnostics.push({ message, details })
  console.error = (message, details) => errors.push({ message, details })

  try {
    await handler(createRequest(), response)
  } finally {
    console.error = originalConsoleError
    console.info = originalConsoleInfo
  }

  assert.equal(response.statusCode, 502)
  assert.equal(response.body.success, false)
  assert.equal(response.body.code, 'APPS_SCRIPT_INVALID_JSON')
  assert.equal(diagnostics[0].details.finalResponseHostname, 'script.googleusercontent.com')
  assert.equal(diagnostics[0].details.finalResponsePathname, '/macros/echo')
  assert.equal(diagnostics[0].details.validJson, false)
  const previewLog = JSON.stringify({ diagnostics, errors })
  assert.ok(previewLog.includes('[redacted]'))
  assert.ok(!previewLog.includes(requestBody.studentName))
  assert.ok(!previewLog.includes(requestBody.parentName))
  assert.ok(!previewLog.includes(requestBody.mobile))
  assert.ok(!previewLog.includes(submissionKey))
  assert.ok(!previewLog.includes('user_content_key'))
})

test('returns the Apps Script failure message and logs its success value', async () => {
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test-deployment/exec'
  const diagnostics = []
  const originalConsoleInfo = console.info
  globalThis.fetch = async () => ({
    status: 200,
    ok: true,
    redirected: true,
    url: 'https://script.googleusercontent.com/macros/echo',
    headers: { get: () => 'application/json' },
    text: async () => JSON.stringify({
      success: false,
      message: 'The Admission Enquiries tab was not found.',
    }),
  })
  const response = createResponse()
  console.info = (message, details) => diagnostics.push({ message, details })

  try {
    await handler(createRequest(), response)
  } finally {
    console.info = originalConsoleInfo
  }

  assert.equal(response.statusCode, 502)
  assert.equal(response.body.code, 'APPS_SCRIPT_SUCCESS_NOT_CONFIRMED')
  assert.equal(response.body.message, 'The Admission Enquiries tab was not found.')
  assert.equal(diagnostics[0].details.successValue, false)
  assert.equal(diagnostics[0].details.enquiryIdExists, false)
})

test('forwards a sanitized Apps Script diagnostic without exposing submitted values', async () => {
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test-deployment/exec'
  globalThis.fetch = async () => ({
    status: 200,
    ok: true,
    redirected: true,
    url: 'https://script.googleusercontent.com/macros/echo',
    headers: { get: () => 'application/json' },
    text: async () => JSON.stringify({
      success: false,
      message: 'The enquiry could not be saved to the spreadsheet.',
      diagnosticError: `Failure for ${requestBody.studentName}, ${requestBody.parentName}, ${requestBody.mobile}, key ${submissionKey}`,
    }),
  })
  const response = createResponse()
  const originalConsoleError = console.error
  console.error = () => {}

  try {
    await handler(createRequest(), response)
  } finally {
    console.error = originalConsoleError
  }

  assert.equal(response.statusCode, 502)
  assert.equal(response.body.message, 'The enquiry could not be saved to the spreadsheet.')
  assert.equal(response.body.diagnosticError.includes(requestBody.studentName), false)
  assert.equal(response.body.diagnosticError.includes(requestBody.parentName), false)
  assert.equal(response.body.diagnosticError.includes(requestBody.mobile), false)
  assert.equal(response.body.diagnosticError.includes(submissionKey), false)
  assert.ok(response.body.diagnosticError.includes('[redacted]'))
})

test('does not confirm a success body without a non-empty enquiry ID', async () => {
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test-deployment/exec'
  globalThis.fetch = async () => ({
    status: 200,
    ok: true,
    redirected: true,
    url: 'https://script.googleusercontent.com/macros/echo',
    headers: { get: () => 'application/json' },
    text: async () => JSON.stringify({ success: true, enquiryId: ' ' }),
  })
  const response = createResponse()
  const originalConsoleError = console.error
  console.error = () => {}

  try {
    await handler(createRequest(), response)
  } finally {
    console.error = originalConsoleError
  }

  assert.equal(response.statusCode, 502)
  assert.equal(response.body.success, false)
})

test('retries the same submission key without appending a duplicate row', async () => {
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test-deployment/exec'
  const savedSubmissions = new Map()
  const forwardedKeys = []
  let appendedRows = 0
  globalThis.fetch = async (_url, options) => {
    const submission = JSON.parse(options.body)
    forwardedKeys.push(submission.submissionKey)
    let enquiryId = savedSubmissions.get(submission.submissionKey)
    if (!enquiryId) {
      enquiryId = 'SS-RETRY123'
      savedSubmissions.set(submission.submissionKey, enquiryId)
      appendedRows += 1
    }

    return {
      status: 200,
      ok: true,
      redirected: true,
      url: 'https://script.googleusercontent.com/macros/echo',
      headers: { get: () => 'application/json' },
      text: async () => JSON.stringify({ success: true, enquiryId }),
    }
  }

  const firstResponse = createResponse()
  const retryResponse = createResponse()
  await handler(createRequest(), firstResponse)
  await handler(createRequest(), retryResponse)

  assert.equal(firstResponse.statusCode, 201)
  assert.equal(retryResponse.statusCode, 201)
  assert.equal(firstResponse.body.enquiryId, retryResponse.body.enquiryId)
  assert.deepEqual(forwardedKeys, [submissionKey, submissionKey])
  assert.equal(appendedRows, 1)
})
