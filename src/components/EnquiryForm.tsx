import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { getSubmittedValues, validateForm } from './enquiryFormValidation'
import type { FormErrors, FormState } from './enquiryFormValidation'

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

type SubmissionResponse = {
  success?: unknown
  enquiryId?: unknown
  message?: unknown
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
const responseTimeoutMs = 30_000

function getSubmissionError(response: Response, result: SubmissionResponse | null) {
  if (typeof result?.message === 'string') return result.message
  if (response.status === 503) return 'The enquiry service is not configured. Please contact the school directly.'
  if (response.status >= 500) return 'The enquiry service could not save your details. Please try again later.'
  return 'We couldn’t submit your enquiry. Check your details and try again.'
}

export default function EnquiryForm() {
  const [formData, setFormData] = useState<FormState>(initialValues)
  const [otherCity, setOtherCity] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [confirmation, setConfirmation] = useState('')
  const [submissionUncertain, setSubmissionUncertain] = useState(false)
  const submittingRef = useRef(false)
  const idempotencyKeyRef = useRef('')

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    if (field === 'city' && value.trim().toLowerCase() !== 'other') setOtherCity('')
    setErrors((current) => ({ ...current, [field]: undefined }))
    idempotencyKeyRef.current = ''
    setSubmissionUncertain(false)
    setStatus('idle')
    setConfirmation('')
  }

  const handleOtherCityChange = (value: string) => {
    setOtherCity(value)
    setErrors((current) => ({ ...current, city: undefined }))
    idempotencyKeyRef.current = ''
    setSubmissionUncertain(false)
    setStatus('idle')
    setConfirmation('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current) return

    const values = getSubmittedValues(formData, otherCity)
    const nextErrors = validateForm(values)

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      if (import.meta.env.DEV) console.warn('Admission enquiry validation failed:', Object.keys(nextErrors))
      setStatus('idle')
      setConfirmation('')
      return
    }

    const payload = values

    if (!idempotencyKeyRef.current) idempotencyKeyRef.current = crypto.randomUUID()
    const idempotencyKey = idempotencyKeyRef.current
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), responseTimeoutMs)

    submittingRef.current = true
    setStatus('submitting')
    setConfirmation('Submitting your enquiry…')

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      let result: SubmissionResponse | null = null
      try {
        result = await response.json() as SubmissionResponse
      } catch {
        result = null
      }

      const enquiryId = typeof result?.enquiryId === 'string' ? result.enquiryId.trim() : ''
      if (!response.ok || result?.success !== true || !enquiryId) {
        if (response.status >= 500 || response.ok) setSubmissionUncertain(true)
        setStatus('error')
        setConfirmation(getSubmissionError(response, result))
        return
      }

      idempotencyKeyRef.current = ''
      setSubmissionUncertain(false)
      setFormData(initialValues)
      setOtherCity('')
      setErrors({})
      setStatus('success')
      setConfirmation(`Thank you. Your enquiry has been received. Reference: ${enquiryId}`)
    } catch {
      setStatus('error')
      setSubmissionUncertain(true)
      setConfirmation('We couldn’t confirm whether your enquiry was saved. Retry this same submission to safely check its status, or contact the school.')
    } finally {
      window.clearTimeout(timeoutId)
      submittingRef.current = false
    }
  }

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
          disabled={status === 'submitting' || submissionUncertain}
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
          disabled={status === 'submitting' || submissionUncertain}
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
          disabled={status === 'submitting' || submissionUncertain}
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
          disabled={status === 'submitting' || submissionUncertain}
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
          disabled={status === 'submitting' || submissionUncertain}
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
            disabled={status === 'submitting' || submissionUncertain}
            value={otherCity}
            onChange={(event) => handleOtherCityChange(event.target.value)}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? 'enquiry-other-city-error' : undefined}
          />
          {errors.city && <span id="enquiry-other-city-error" className="field-error">{errors.city}</span>}
        </div>
      )}

      <button type="submit" className="primary-button" disabled={status === 'submitting'}>
        {status === 'submitting'
          ? 'Submitting…'
          : submissionUncertain
            ? 'Retry Same Enquiry'
            : 'Submit Now'}
      </button>
      {confirmation && (
        <p className={`enquiry-feedback ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">
          {confirmation}
        </p>
      )}
    </form>
  )
}
