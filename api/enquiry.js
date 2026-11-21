function sendJson(response, statusCode, body) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(body))
}

function sendApiError(response, statusCode, code, message, diagnosticError) {
  console.error('Enquiry API error returned to frontend:', { statusCode, code, message })
  const body = { success: false, code, message }
  if (typeof diagnosticError === 'string') body.diagnosticError = diagnosticError
  return sendJson(response, statusCode, body)
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

  const enquiry = Object.fromEntries(fields.map((field) => [field, data[field].trim()]))
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
      signal: AbortSignal.timeout(25_000),
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
        `The Apps Script deployment returned HTTP ${appsScriptResponse.status}. Check its deployment access settings.`,
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
        'Apps Script returned an invalid response instead of JSON. Check the web app deployment.',
      )
    }

    if (!result || typeof result !== 'object' || Array.isArray(result) || result.success !== true) {
      const appsScriptMessage = typeof result?.message === 'string'
        ? sanitizeResponsePreview(result.message, enquiry, submissionKey).trim()
        : ''
      const diagnosticError = typeof result?.diagnosticError === 'string'
        ? sanitizeResponsePreview(result.diagnosticError, enquiry, submissionKey).trim()
        : ''
      return sendApiError(
        response,
        502,
        'APPS_SCRIPT_SUCCESS_NOT_CONFIRMED',
        appsScriptMessage || 'The enquiry could not be confirmed as saved. Please contact the school before retrying.',
        diagnosticError || undefined,
      )
    }

    if (!validEnquiryId) {
      return sendApiError(
        response,
        502,
        'APPS_SCRIPT_ENQUIRY_ID_MISSING',
        'Apps Script confirmed success but did not return an enquiry ID. The save could not be verified.',
      )
    }

    return sendJson(response, 201, { success: true, enquiryId: result.enquiryId.trim() })
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError'
    const errorMessage = error instanceof Error
      ? sanitizeResponsePreview(error.message, enquiry, submissionKey)
      : 'Unknown error'
    console.error('Apps Script enquiry request failed:', { errorName, errorMessage })
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
