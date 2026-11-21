function sendJson(response, statusCode, body) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('X-Frame-Options', 'DENY')
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.end(JSON.stringify(body))
}

const requestCounts = new Map()

function isRateLimited(request) {
  const forwarded = request.headers['x-forwarded-for']
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : (request.headers['x-real-ip'] || request.socket?.remoteAddress || 'unknown')
  const now = Date.now()
  const minute = Math.floor(now / 60_000)
  const key = `${ip}:${minute}`
  const count = (requestCounts.get(key) || 0) + 1
  requestCounts.set(key, count)
  if (requestCounts.size > 200) {
    for (const existingKey of requestCounts.keys()) {
      if (!existingKey.endsWith(`:${minute}`)) requestCounts.delete(existingKey)
    }
  }
  return count > 20
}

function sendApiError(response, statusCode, code, message) {
  console.error('Enquiry API error:', { statusCode, code })
  return sendJson(response, statusCode, { success: false, code, message })
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
  const fields = ['studentName', 'parentName', 'mobile', 'grade', 'city']
  if (!data || fields.some((field) => typeof data[field] !== 'string')) return null
  if (Object.keys(data).some((field) => !fields.includes(field))) return null

  const enquiry = Object.fromEntries(fields.map((field) => [field, data[field].trim()]))
  if (Object.values(enquiry).some((value) =>
    Array.from(value).some((character) => {
      const code = character.charCodeAt(0)
      return code < 32 || code === 127
    }),
  )) return null
  enquiry.mobile = enquiry.mobile
    .replace(/[\s-]/g, '')
    .replace(/^\+91(?=[6-9]\d{9}$)/, '')
    .replace(/^91(?=[6-9]\d{9}$)/, '')
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

function getAppsScriptUrl() {
  try {
    const url = new URL(process.env.GOOGLE_APPS_SCRIPT_URL)
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'script.google.com' ||
      !/^\/(?:macros\/s\/[^/]+|a\/macros\/[^/]+\/s\/[^/]+)\/exec$/.test(url.pathname)
    ) return null
    return url.toString()
  } catch {
    return null
  }
}

function getUrlLocation(value) {
  try {
    const url = new URL(value)
    return { hostname: url.hostname, pathname: url.pathname }
  } catch {
    return { hostname: 'unknown', pathname: 'unknown' }
  }
}

function getSafeSuccessValue(result) {
  const value = result && typeof result === 'object' ? result.success : undefined
  if (value === true || value === false || value === null) return value
  if (value === undefined) return 'missing'
  if (typeof value === 'string' && /^(true|false)$/i.test(value)) return value
  return `[${typeof value}]`
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function sanitizeResponsePreview(text, enquiry, submissionKey) {
  let preview = text
  const sensitiveValues = [...Object.values(enquiry), submissionKey]

  for (const value of sensitiveValues) {
    if (typeof value !== 'string' || value.length < 2) continue
    const variants = [value, JSON.stringify(value).slice(1, -1)]
    try {
      variants.push(encodeURIComponent(value), encodeURI(value))
    } catch {
      // The raw and JSON-escaped values are still redacted.
    }

    for (const variant of variants) {
      if (variant.length >= 2) {
        preview = preview.replace(new RegExp(escapeRegExp(variant), 'gi'), '[redacted]')
      }
    }
  }

  preview = preview
    .replace(/https?:\/\/[^\s"'<>]+/gi, '[URL redacted]')
    .replace(/(?:\+?91[\s-]?)?[6-9]\d(?:[\s-]?\d){9}/g, '[phone redacted]')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[key redacted]')
    .replace(/\bSS-[A-Z0-9]{6,}\b/gi, '[enquiry ID redacted]')
  return Array.from(preview, (character) => {
    const code = character.charCodeAt(0)
    return code < 32 || code === 127 ? ' ' : character
  }).join('').slice(0, 200)
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendApiError(response, 405, 'METHOD_NOT_ALLOWED', 'Use POST to submit an enquiry.')
  }

  const contentType = request.headers['content-type']
  if (typeof contentType === 'string' && !/^application\/json(?:;|$)/i.test(contentType)) {
    return sendApiError(response, 415, 'INVALID_CONTENT_TYPE', 'Submit the enquiry form again.')
  }

  const contentLength = Number(request.headers['content-length'])
  if (Number.isFinite(contentLength) && contentLength > 16_384) {
    return sendApiError(response, 413, 'PAYLOAD_TOO_LARGE', 'Check the enquiry details and try again.')
  }

  const requestBody = getRequestBody(request)
  if (Buffer.byteLength(JSON.stringify(requestBody ?? {}), 'utf8') > 16_384) {
    return sendApiError(response, 413, 'PAYLOAD_TOO_LARGE', 'Check the enquiry details and try again.')
  }

  const allowedOrigin = process.env.SEEDSTONE_ALLOWED_ORIGIN
  const origin = request.headers.origin
  if (allowedOrigin && (typeof origin !== 'string' || origin !== allowedOrigin)) {
    return sendApiError(response, 403, 'ORIGIN_NOT_ALLOWED', 'This enquiry request is not allowed.')
  }

  if (isRateLimited(request)) {
    return sendApiError(response, 429, 'RATE_LIMITED', 'Please wait a moment before submitting another enquiry.')
  }

  const appsScriptUrl = getAppsScriptUrl()
  if (!appsScriptUrl) {
    return sendApiError(
      response,
      503,
      'APPS_SCRIPT_URL_MISSING_OR_INVALID',
      'The enquiry service is not configured. Please contact the school directly.',
    )
  }

  const submissionKey = request.headers['idempotency-key']
  if (typeof submissionKey !== 'string' || !/^[0-9a-f-]{36}$/i.test(submissionKey)) {
    return sendApiError(response, 400, 'INVALID_IDEMPOTENCY_KEY', 'Refresh the page and submit your enquiry again.')
  }

  const enquiry = validateEnquiry(getRequestBody(request))
  if (!enquiry) {
    return sendApiError(response, 400, 'INVALID_ENQUIRY', 'Check the required enquiry details and try again.')
  }

  try {
    const appsScriptResponse = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...enquiry, submissionKey }),
      redirect: 'follow',
      cache: 'no-store',
      signal: AbortSignal.timeout(55_000),
    })
    const responseText = await appsScriptResponse.text()
    let result = null
    let validJson = false
    try {
      result = JSON.parse(responseText)
      validJson = true
    } catch {
    }

    const configuredLocation = getUrlLocation(appsScriptUrl)
    const finalLocation = getUrlLocation(appsScriptResponse.url)
    const hasEnquiryId = Boolean(
      result &&
      typeof result === 'object' &&
      Object.prototype.hasOwnProperty.call(result, 'enquiryId'),
    )
    const validEnquiryId = typeof result?.enquiryId === 'string' && Boolean(result.enquiryId.trim())
    const diagnostics = {
      status: appsScriptResponse.status,
      ok: appsScriptResponse.ok,
      redirected: appsScriptResponse.redirected,
      configuredHostname: configuredLocation.hostname,
      configuredPathname: configuredLocation.pathname,
      finalResponseHostname: finalLocation.hostname,
      finalResponsePathname: finalLocation.pathname,
      contentType: appsScriptResponse.headers.get('content-type'),
      validJson,
      successValue: getSafeSuccessValue(result),
      enquiryIdExists: hasEnquiryId,
      enquiryIdValid: validEnquiryId,
    }
    console.info('Apps Script response diagnostics:', diagnostics)

    if (!appsScriptResponse.ok) {
      return sendApiError(
        response,
        502,
        'APPS_SCRIPT_HTTP_ERROR',
        'The enquiry could not be confirmed as saved. Your details have been kept for a safe retry.',
      )
    }

    if (!validJson) {
      console.error('Apps Script response was not valid JSON:', {
        ...diagnostics,
        sanitizedPreview: sanitizeResponsePreview(responseText, enquiry, submissionKey),
      })
      return sendApiError(
        response,
        502,
        'APPS_SCRIPT_INVALID_JSON',
        'The enquiry could not be confirmed as saved. Your details have been kept for a safe retry.',
      )
    }

    if (!result || typeof result !== 'object' || Array.isArray(result) || result.success !== true) {
      return sendApiError(
        response,
        502,
        'APPS_SCRIPT_SUCCESS_NOT_CONFIRMED',
        'The enquiry could not be confirmed as saved. Your details have been kept for a safe retry.',
      )
    }

    if (!validEnquiryId) {
      return sendApiError(
        response,
        502,
        'APPS_SCRIPT_ENQUIRY_ID_MISSING',
        'The enquiry could not be confirmed as saved. Your details have been kept for a safe retry.',
      )
    }

    return sendJson(response, 201, { success: true, enquiryId: result.enquiryId.trim() })
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError'
    console.error('Apps Script enquiry request failed:', { errorName })
    if (errorName === 'TimeoutError' || errorName === 'AbortError') {
      return sendApiError(
        response,
        504,
        'APPS_SCRIPT_TIMEOUT',
        'The enquiry service took too long to respond. Retry the same enquiry to safely check its status, or contact the school.',
      )
    }
    return sendApiError(
      response,
      502,
      'APPS_SCRIPT_FETCH_FAILED',
      'The enquiry service could not be reached. Please try again later or contact the school.',
    )
  }
}
