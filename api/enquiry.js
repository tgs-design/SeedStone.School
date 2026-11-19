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

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { success: false, message: 'Use POST to submit an enquiry.' })
  }

  const appsScriptUrl = getAppsScriptUrl()
  if (!appsScriptUrl) {
    return sendJson(response, 503, {
      success: false,
      message: 'The enquiry service is not configured. Please contact the school directly.',
    })
  }

  const submissionKey = request.headers['idempotency-key']
  if (typeof submissionKey !== 'string' || !/^[0-9a-f-]{36}$/i.test(submissionKey)) {
    return sendJson(response, 400, { success: false, message: 'Refresh the page and submit your enquiry again.' })
  }

  const enquiry = validateEnquiry(getRequestBody(request))
  if (!enquiry) {
    return sendJson(response, 400, { success: false, message: 'Check the required enquiry details and try again.' })
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
    let result
    try {
      result = JSON.parse(await appsScriptResponse.text())
    } catch {
      console.error('Apps Script response was not valid JSON:', {
        status: appsScriptResponse.status,
        redirected: appsScriptResponse.redirected,
        finalHost: getResponseHost(appsScriptResponse.url),
        contentType: appsScriptResponse.headers.get('content-type'),
      })
      return sendJson(response, 502, {
        success: false,
        message: 'Apps Script returned an invalid response instead of JSON. Check the web app deployment.',
      })
    }

    if (!appsScriptResponse.ok) {
      console.error('Apps Script returned a non-success HTTP response:', {
        status: appsScriptResponse.status,
        redirected: appsScriptResponse.redirected,
        finalHost: getResponseHost(appsScriptResponse.url),
        contentType: appsScriptResponse.headers.get('content-type'),
      })
      return sendJson(response, 502, {
        success: false,
        message: `The Apps Script deployment returned HTTP ${appsScriptResponse.status}. Check its deployment access settings.`,
      })
    }

    if (!result || typeof result !== 'object' || Array.isArray(result) || result.success !== true) {
      console.error('Apps Script did not confirm the enquiry save:', {
        status: appsScriptResponse.status,
        redirected: appsScriptResponse.redirected,
        finalHost: getResponseHost(appsScriptResponse.url),
        contentType: appsScriptResponse.headers.get('content-type'),
        responseKeys: result && typeof result === 'object' ? Object.keys(result) : [],
        successType: typeof result?.success,
        enquiryIdType: typeof result?.enquiryId,
      })
      return sendJson(response, 502, {
        success: false,
        message: 'The enquiry could not be confirmed as saved. Please contact the school before retrying.',
      })
    }

    if (typeof result.enquiryId !== 'string' || !result.enquiryId.trim()) {
      console.error('Apps Script success response did not contain a valid enquiry ID:', {
        status: appsScriptResponse.status,
        redirected: appsScriptResponse.redirected,
        finalHost: getResponseHost(appsScriptResponse.url),
        contentType: appsScriptResponse.headers.get('content-type'),
      })
      return sendJson(response, 502, {
        success: false,
        message: 'Apps Script confirmed success but did not return an enquiry ID. The save could not be verified.',
      })
    }

    return sendJson(response, 201, { success: true, enquiryId: result.enquiryId.trim() })
  } catch (error) {
    console.error('Apps Script enquiry request failed:', error instanceof Error ? error.message : 'Unknown error')
    return sendJson(response, 502, {
      success: false,
      message: 'The enquiry service could not be reached. Please try again later or contact the school.',
    })
  }
}

function getResponseHost(responseUrl) {
  try {
    return new URL(responseUrl).hostname
  } catch {
    return 'unknown'
  }
}
