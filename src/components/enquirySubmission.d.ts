import type { FormState } from './enquiryFormValidation'

export type EnquirySubmission = {
  submissionKey: string
  payload: FormState
}

export function createEnquirySubmission(
  payload: FormState,
  generateKey?: () => string,
): EnquirySubmission
export function isSameEnquiry(first: FormState, second: FormState): boolean
export function getSubmissionForEnquiry(
  payload: FormState,
  pendingSubmissions: EnquirySubmission[],
  generateKey?: () => string,
): EnquirySubmission
export function getRetrySubmission(pendingSubmission: EnquirySubmission): EnquirySubmission
export function restoreEnquirySubmissions(storage: Storage): EnquirySubmission[]
export function addEnquirySubmission(
  submissions: EnquirySubmission[],
  submission: EnquirySubmission,
): EnquirySubmission[]
export function removeEnquirySubmission(
  submissions: EnquirySubmission[],
  submissionKey: string,
): EnquirySubmission[]
export function saveEnquirySubmissions(storage: Storage, submissions: EnquirySubmission[]): void
export function restoreCurrentEnquirySubmission(
  storage: Storage,
): EnquirySubmission | null
export function saveCurrentEnquirySubmission(
  storage: Storage,
  submission: EnquirySubmission | null,
): void
