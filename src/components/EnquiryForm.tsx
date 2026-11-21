import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { getSubmittedValues, validateForm } from './enquiryFormValidation'
import type { FormErrors, FormState } from './enquiryFormValidation'
import {
  addEnquirySubmission,
  getSubmissionForEnquiry,
  getRetrySubmission,
  isSameEnquiry,
  removeEnquirySubmission,
  restoreEnquirySubmissions,
  saveEnquirySubmissions,
} from './enquirySubmission.js'
import type { EnquirySubmission } from './enquirySubmission.js'

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

type SubmissionResponse = {
  success?: unknown
  enquiryId?: unknown
  message?: unknown
  code?: unknown
}

const initialValues: FormState = {
  studentName: '',
  parentName: '',
  mobile: '',
  grade: '',
  city: '',
}

const grades = Array.from({ length: 8 }, (_, index) => `Class ${index + 1}`)
const citySuggestions = [
  'Ahmedabad', 'Bengaluru', 'Bhopal', 'Bhubaneswar', 'Chandigarh', 'Chennai',
  'Delhi', 'Guwahati', 'Hyderabad', 'Indore', 'Jaipur', 'Kochi', 'Kolkata',
  'Lucknow', 'Mumbai', 'Nagpur', 'Patna', 'Pune', 'Ranchi', 'Surat', 'Other',
]

function getSubmissionError(response: Response) {
  if (response.status === 503) return 'The enquiry service is not configured. Please contact the school directly.'
  if (response.status >= 500) return 'We could not confirm whether your enquiry was saved. This enquiry has been kept so you can safely check it again.'
  return 'We couldn’t submit your enquiry. Check your details and try again.'
}

function getInitialSubmissionState() {
  try {
    return {
      pendingSubmissions: restoreEnquirySubmissions(window.sessionStorage),
      restoreError: false,
    }
  } catch (error) {
    console.error('Could not restore a saved enquiry submission:', error)
    return { pendingSubmissions: [], restoreError: true }
  }
}

export default function EnquiryForm() {
  const [initialSubmissionState] = useState(getInitialSubmissionState)
  const [formData, setFormData] = useState<FormState>(initialValues)
  const [otherCity, setOtherCity] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>(
    initialSubmissionState.restoreError || initialSubmissionState.pendingSubmissions.length > 0 ? 'error' : 'idle',
  )
  const [confirmation, setConfirmation] = useState(
    initialSubmissionState.restoreError
      ? 'A previous enquiry could not be restored safely. Please contact the school before submitting again.'
      : initialSubmissionState.pendingSubmissions.length > 0
        ? 'A previous enquiry may still be processing. Retry the same enquiry to safely check its status, or submit a new enquiry with your current details.'
        : '',
  )
  const [pendingSubmissions, setPendingSubmissions] = useState<EnquirySubmission[]>(
    initialSubmissionState.pendingSubmissions,
  )
  const submissionRestoreFailed = initialSubmissionState.restoreError
  const submittingRef = useRef(false)
  const pendingSubmissionsRef = useRef<EnquirySubmission[]>(initialSubmissionState.pendingSubmissions)

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    if (field === 'city' && value.trim().toLowerCase() !== 'other') setOtherCity('')
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('idle')
    setConfirmation('')
  }

  const handleOtherCityChange = (value: string) => {
    setOtherCity(value)
    setErrors((current) => ({ ...current, city: undefined }))
    setStatus('idle')
    setConfirmation('')
  }

  const sendSubmission = async (submission: EnquirySubmission) => {
    submittingRef.current = true
    setStatus('submitting')
    setConfirmation('Submitting your enquiry…')

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': submission.submissionKey,
        },
        body: JSON.stringify(submission.payload),
        signal: AbortSignal.timeout(60_000),
      })

      let result: SubmissionResponse | null = null
      let validJson = false
      try {
        result = await response.json() as SubmissionResponse
        validJson = true
      } catch {
        console.error('Enquiry API returned a non-JSON response:', {
          status: response.status,
          contentType: response.headers.get('content-type'),
        })
      }

      if (!validJson) {
        setStatus('error')
        setConfirmation('We could not confirm whether your enquiry was saved. It has been kept safely for you to check again.')
        return
      }

      const enquiryId = typeof result?.enquiryId === 'string' ? result.enquiryId.trim() : ''
      if (!response.ok || result?.success !== true || !enquiryId) {
        console.error('Enquiry API returned an error:', {
          status: response.status,
          code: typeof result?.code === 'string' ? result.code : 'missing',
          hasMessage: typeof result?.message === 'string',
          success: result?.success === true
            ? true
            : result?.success === false
              ? false
              : typeof result?.success === 'string' && /^(true|false)$/i.test(result.success)
                ? result.success
                : 'other-or-missing',
          enquiryIdExists: Boolean(
            result &&
            typeof result === 'object' &&
            Object.prototype.hasOwnProperty.call(result, 'enquiryId'),
          ),
        })
        setStatus('error')
        setConfirmation(getSubmissionError(response))
        return
      }

      let cleanupWarning = ''
      let remainingSubmissions = pendingSubmissionsRef.current
      try {
        const nextSubmissions = removeEnquirySubmission(remainingSubmissions, submission.submissionKey)
        saveEnquirySubmissions(window.sessionStorage, nextSubmissions)
        remainingSubmissions = nextSubmissions
      } catch (error) {
        console.error('Could not clear the confirmed enquiry from session storage:', error)
        cleanupWarning = ' Your browser could not clear the saved retry details.'
      }
      pendingSubmissionsRef.current = remainingSubmissions
      setPendingSubmissions(remainingSubmissions)
      const currentValues = getSubmittedValues(formData, otherCity)
      if (isSameEnquiry(currentValues, submission.payload)) {
        setFormData(initialValues)
        setOtherCity('')
        setErrors({})
      }
      setStatus('success')
      setConfirmation(`Thank you. Your enquiry has been received. Reference: ${enquiryId}${cleanupWarning}`)
    } catch (error) {
      const errorName = error instanceof Error ? error.name : 'UnknownError'
      console.error('Enquiry request failed before an API response:', { errorName })
      setStatus('error')
      setConfirmation('We couldn’t confirm whether your enquiry was received. Retry this same submission to safely check its status, or contact the school.')
    } finally {
      submittingRef.current = false
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current || submissionRestoreFailed) return

    const payload = getSubmittedValues(formData, otherCity)
    const nextErrors = validateForm(payload)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      if (import.meta.env.DEV) console.warn('Admission enquiry validation failed:', Object.keys(nextErrors))
      setStatus('idle')
      setConfirmation('')
      return
    }

    let submission: EnquirySubmission
    try {
      submission = getSubmissionForEnquiry(
        payload,
        pendingSubmissionsRef.current,
        () => crypto.randomUUID(),
      )
      if (!pendingSubmissionsRef.current.some(({ submissionKey }) => submissionKey === submission.submissionKey)) {
        const nextPendingSubmissions = addEnquirySubmission(pendingSubmissionsRef.current, submission)
        saveEnquirySubmissions(window.sessionStorage, nextPendingSubmissions)
        pendingSubmissionsRef.current = nextPendingSubmissions
        setPendingSubmissions(nextPendingSubmissions)
      }
    } catch (error) {
      console.error('Could not save an enquiry retry safely:', error)
      setStatus('error')
      setConfirmation('Your enquiry was not sent because its retry details could not be saved safely. Please try again or contact the school.')
      return
    }

    await sendSubmission(submission)
  }

  const handleRetrySavedSubmission = async (submission: EnquirySubmission) => {
    if (submittingRef.current) return
    await sendSubmission(getRetrySubmission(submission))
  }

  const currentValues = getSubmittedValues(formData, otherCity)
  const matchingPendingSubmission = pendingSubmissions.find(
    (submission) => isSameEnquiry(currentValues, submission.payload),
  )

  return (
    <form className="enquiry-form inline admission-enquiry-form" onSubmit={handleSubmit} noValidate aria-busy={status === 'submitting'}>
      <div className="input-group">
        <label htmlFor="enquiry-student-name">Student Name <span className="required-indicator">Required</span></label>
        <input
          id="enquiry-student-name"
          name="studentName"
          type="text"
          autoComplete="name"
          maxLength={100}
          required
          disabled={status === 'submitting'}
          value={formData.studentName}
          onChange={(event) => handleChange('studentName', event.target.value)}
          aria-invalid={Boolean(errors.studentName)}
          aria-describedby={errors.studentName ? 'enquiry-student-name-error' : undefined}
        />
        {errors.studentName && <span id="enquiry-student-name-error" className="field-error">{errors.studentName}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="enquiry-parent-name">Parent Name <span className="required-indicator">Required</span></label>
        <input
          id="enquiry-parent-name"
          name="parentName"
          type="text"
          autoComplete="name"
          maxLength={100}
          required
          disabled={status === 'submitting'}
          value={formData.parentName}
          onChange={(event) => handleChange('parentName', event.target.value)}
          aria-invalid={Boolean(errors.parentName)}
          aria-describedby={errors.parentName ? 'enquiry-parent-name-error' : undefined}
        />
        {errors.parentName && <span id="enquiry-parent-name-error" className="field-error">{errors.parentName}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="enquiry-mobile">Mobile Number <span className="required-indicator">Required</span></label>
        <input
          id="enquiry-mobile"
          name="mobile"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={16}
          required
          disabled={status === 'submitting'}
          value={formData.mobile}
          onChange={(event) => handleChange('mobile', event.target.value)}
          aria-invalid={Boolean(errors.mobile)}
          aria-describedby={errors.mobile ? 'enquiry-mobile-error' : 'enquiry-mobile-hint'}
        />
        {errors.mobile
          ? <span id="enquiry-mobile-error" className="field-error">{errors.mobile}</span>
          : <span id="enquiry-mobile-hint" className="form-note">Enter a 10-digit Indian mobile number; +91 is optional.</span>}
      </div>

      <div className="input-group">
        <label htmlFor="enquiry-grade">Interested Grade <span className="required-indicator">Required</span></label>
        <select
          id="enquiry-grade"
          name="grade"
          required
          disabled={status === 'submitting'}
          value={formData.grade}
          onChange={(event) => handleChange('grade', event.target.value)}
          aria-invalid={Boolean(errors.grade)}
          aria-describedby={errors.grade ? 'enquiry-grade-error' : undefined}
        >
          <option value="">Select a class</option>
          {grades.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
        </select>
        {errors.grade && <span id="enquiry-grade-error" className="field-error">{errors.grade}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="enquiry-city">City <span className="required-indicator">Required</span></label>
        <input
          id="enquiry-city"
          name="city"
          type="text"
          list="enquiry-city-options"
          autoComplete="address-level2"
          maxLength={80}
          required
          disabled={status === 'submitting'}
          value={formData.city}
          onChange={(event) => handleChange('city', event.target.value)}
          aria-invalid={Boolean(errors.city) && formData.city.trim().toLowerCase() !== 'other'}
          aria-describedby={errors.city && formData.city.trim().toLowerCase() !== 'other' ? 'enquiry-city-error' : undefined}
        />
        <datalist id="enquiry-city-options">
          {citySuggestions.map((city) => <option key={city} value={city} />)}
        </datalist>
        {errors.city && formData.city.trim().toLowerCase() !== 'other' && (
          <span id="enquiry-city-error" className="field-error">{errors.city}</span>
        )}
      </div>

      {formData.city.trim().toLowerCase() === 'other' && (
        <div className="input-group">
          <label htmlFor="enquiry-other-city">Enter City <span className="required-indicator">Required</span></label>
          <input
            id="enquiry-other-city"
            name="otherCity"
            type="text"
            autoComplete="address-level2"
            maxLength={80}
            required
            disabled={status === 'submitting'}
            value={otherCity}
            onChange={(event) => handleOtherCityChange(event.target.value)}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? 'enquiry-other-city-error' : undefined}
          />
          {errors.city && <span id="enquiry-other-city-error" className="field-error">{errors.city}</span>}
        </div>
      )}

      <button
        type="submit"
        className="primary-button"
        disabled={status === 'submitting' || submissionRestoreFailed}
      >
        {status === 'submitting'
          ? 'Submitting…'
          : matchingPendingSubmission
            ? 'Retry Same Enquiry'
            : pendingSubmissions.length > 0
              ? 'Submit New Enquiry'
              : 'Submit Now'}
      </button>
      {pendingSubmissions.map((submission, index) => (
        <div key={submission.submissionKey} className="pending-enquiry-recovery">
          {index === 0 && <p>Earlier enquiry still needs to be checked.</p>}
          <button
            type="button"
            className="secondary-button"
            disabled={status === 'submitting'}
            onClick={() => handleRetrySavedSubmission(submission)}
          >
            Check earlier enquiry
          </button>
        </div>
      ))}
      {confirmation && (
        <p className={`enquiry-feedback ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">
          {confirmation}
        </p>
      )}
    </form>
  )
}
