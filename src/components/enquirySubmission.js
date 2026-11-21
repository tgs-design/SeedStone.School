const storageKey = 'seedstone.pending-enquiry.v1'
const currentStorageKey = 'seedstone.current-enquiry.v1'
const fieldNames = ['studentName', 'parentName', 'mobile', 'grade', 'city']
const uuidPattern = /^[0-9a-f-]{36}$/i

export function createEnquirySubmission(payload, generateKey = () => crypto.randomUUID()) {
  return {
    submissionKey: generateKey(),
    payload: { ...payload },
  }
}

export function isSameEnquiry(first, second) {
  return fieldNames.every((field) => first[field] === second[field])
}

export function getSubmissionForEnquiry(payload, pendingSubmissions, generateKey) {
  const existing = pendingSubmissions.find((submission) => isSameEnquiry(payload, submission.payload))
  if (existing) return existing
  return createEnquirySubmission(payload, generateKey)
}

export function getRetrySubmission(pendingSubmission) {
  return pendingSubmission
}

function validateSubmission(submission) {
  if (
    !submission ||
    typeof submission !== 'object' ||
    typeof submission.submissionKey !== 'string' ||
    !uuidPattern.test(submission.submissionKey) ||
    !submission.payload ||
    typeof submission.payload !== 'object' ||
    fieldNames.some((field) => typeof submission.payload[field] !== 'string')
  ) {
    throw new Error('Saved enquiry submission is invalid.')
  }

  return {
    submissionKey: submission.submissionKey,
    payload: Object.fromEntries(fieldNames.map((field) => [field, submission.payload[field]])),
  }
}

export function restoreEnquirySubmissions(storage) {
  const saved = storage.getItem(storageKey)
  if (saved === null) return []

  const parsed = JSON.parse(saved)
  const submissions = Array.isArray(parsed) ? parsed : [parsed]
  const restored = submissions.map(validateSubmission)
  if (new Set(restored.map(({ submissionKey }) => submissionKey)).size !== restored.length) {
    throw new Error('Saved enquiry submissions contain duplicate keys.')
  }
  return restored
}

export function addEnquirySubmission(submissions, submission) {
  if (submissions.some(({ submissionKey }) => submissionKey === submission.submissionKey)) return submissions
  return [...submissions, submission]
}

export function removeEnquirySubmission(submissions, submissionKey) {
  return submissions.filter((submission) => submission.submissionKey !== submissionKey)
}

export function saveEnquirySubmissions(storage, submissions) {
  if (submissions.length === 0) storage.removeItem(storageKey)
  else storage.setItem(storageKey, JSON.stringify(submissions))
}

export function restoreCurrentEnquirySubmission(storage) {
  const saved = storage.getItem(currentStorageKey)
  if (saved === null) return null
  return validateSubmission(JSON.parse(saved))
}

export function saveCurrentEnquirySubmission(storage, submission) {
  if (submission === null) storage.removeItem(currentStorageKey)
  else storage.setItem(currentStorageKey, JSON.stringify(validateSubmission(submission)))
}
