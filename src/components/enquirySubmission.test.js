import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  addEnquirySubmission,
  createEnquirySubmission,
  getRetrySubmission,
  getSubmissionForEnquiry,
  removeEnquirySubmission,
  restoreEnquirySubmissions,
  saveEnquirySubmissions,
} from './enquirySubmission.js'

const firstKey = '123e4567-e89b-12d3-a456-426614174000'
const secondKey = '223e4567-e89b-12d3-a456-426614174000'
const enquiry = {
  studentName: 'Test Student',
  parentName: 'Test Parent',
  mobile: '9876543210',
  grade: 'Class 1',
  city: 'Ahmedabad',
}

function createStorage() {
  const values = new Map()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
}

test('creates and saves a key with a first-time enquiry payload', () => {
  const storage = createStorage()
  const submission = getSubmissionForEnquiry(enquiry, [], () => firstKey)

  saveEnquirySubmissions(storage, [submission])

  assert.deepEqual(restoreEnquirySubmissions(storage), [submission])
})

test('retries identical details with the saved key and payload', () => {
  const original = createEnquirySubmission(enquiry, () => firstKey)
  const retry = getSubmissionForEnquiry({ ...enquiry }, [original], () => secondKey)

  assert.equal(retry, original)
  assert.deepEqual(retry.payload, enquiry)
  assert.equal(retry.submissionKey, firstKey)
})

test('restores the original key and payload for a retry after an uncertain response', () => {
  const storage = createStorage()
  const original = createEnquirySubmission(enquiry, () => firstKey)
  saveEnquirySubmissions(storage, [original])
  const [restored] = restoreEnquirySubmissions(storage)
  const retry = getSubmissionForEnquiry(enquiry, [restored], () => secondKey)

  assert.deepEqual(retry, original)
})

test('retry uses the saved payload and key even when the form has been edited', () => {
  const original = createEnquirySubmission(enquiry, () => firstKey)
  const editedForm = { ...enquiry, city: 'Surat' }
  const retry = getRetrySubmission(original)

  assert.notDeepEqual(editedForm, retry.payload)
  assert.equal(retry.submissionKey, firstKey)
  assert.deepEqual(retry.payload, enquiry)
})

test('assigns a fresh key when details change after a failed attempt', () => {
  const original = createEnquirySubmission(enquiry, () => firstKey)
  const changedFields = {
    studentName: 'Another Student',
    parentName: 'Another Parent',
    mobile: '9123456789',
    grade: 'Class 2',
    city: 'Surat',
  }

  for (const [field, value] of Object.entries(changedFields)) {
    const edited = { ...enquiry, [field]: value }
    const next = getSubmissionForEnquiry(edited, [original], () => secondKey)
    assert.notEqual(next.submissionKey, original.submissionKey)
    assert.deepEqual(next.payload, edited)
  }
})

test('preserves an uncertain submission when an edited enquiry is submitted', () => {
  const storage = createStorage()
  const original = createEnquirySubmission(enquiry, () => firstKey)
  saveEnquirySubmissions(storage, [original])
  const nextEnquiry = { ...enquiry, studentName: 'Another Student' }
  const next = getSubmissionForEnquiry(nextEnquiry, restoreEnquirySubmissions(storage), () => secondKey)
  const pending = addEnquirySubmission(restoreEnquirySubmissions(storage), next)
  saveEnquirySubmissions(storage, pending)

  const restored = restoreEnquirySubmissions(storage)
  assert.deepEqual(restored, [original, next])
  const retry = getRetrySubmission(restored[0])
  assert.equal(retry.submissionKey, firstKey)
  assert.deepEqual(retry.payload, enquiry)
  assert.equal(restored[1].submissionKey, secondKey)
  assert.deepEqual(restored[1].payload, nextEnquiry)

  const afterNewEnquiryConfirmed = removeEnquirySubmission(restored, secondKey)
  saveEnquirySubmissions(storage, afterNewEnquiryConfirmed)
  assert.deepEqual(restoreEnquirySubmissions(storage), [original])
})
