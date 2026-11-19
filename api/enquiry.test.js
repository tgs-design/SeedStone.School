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

test('confirms valid Apps Script JSON after following its ContentService redirect', async () => {
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test-deployment/exec'
  let fetchOptions
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

  await handler(createRequest(), response)

  assert.equal(fetchOptions.redirect, 'follow')
  assert.equal(JSON.parse(fetchOptions.body).submissionKey, submissionKey)
  assert.equal(response.statusCode, 201)
  assert.deepEqual(response.body, { success: true, enquiryId: 'SS-ABC123' })
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
  globalThis.fetch = async () => ({
    status: 200,
    ok: true,
    redirected: true,
    url: 'https://script.googleusercontent.com/macros/echo',
    headers: { get: () => 'text/html' },
    text: async () => '<html>Sign in</html>',
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
