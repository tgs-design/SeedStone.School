import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

type FormState = {
  studentName: string
  parentName: string
  mobileNumber: string
  interestedGrade: string
  city: string
  otherCity: string
}

type FormErrors = Partial<Record<keyof FormState, string>>
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

type SubmissionResponse = {
  success?: unknown
  enquiryId?: unknown
  message?: unknown
}

const initialValues: FormState = {
  studentName: '',
  parentName: '',
  mobileNumber: '',
  interestedGrade: '',
  city: '',
  otherCity: '',
}

const grades = Array.from({ length: 8 }, (_, index) => `Class ${index + 1}`)
const citySuggestions = [
  'Ahmedabad', 'Bengaluru', 'Bhopal', 'Bhubaneswar', 'Chandigarh', 'Chennai',
  'Delhi', 'Guwahati', 'Hyderabad', 'Indore', 'Jaipur', 'Kochi', 'Kolkata',
  'Lucknow', 'Mumbai', 'Nagpur', 'Patna', 'Pune', 'Ranchi', 'Surat', 'Other',
]
const responseTimeoutMs = 30_000

function isValidMobileNumber(value: string) {
  return /^(?:\+?91[\s-]?)?[6-9]\d{9}$/.test(value.trim())
}

function getSubmissionError(response: Response, result: SubmissionResponse | null) {
  if (typeof result?.message === 'string') return result.message
  if (response.status === 503) return 'The enquiry service is not configured. Please contact the school directly.'
  if (response.status >= 500) return 'The enquiry service could not save your details. Please try again later.'
  return 'We couldn’t submit your enquiry. Check your details and try again.'
}

export default function EnquiryForm() {
  const [formData, setFormData] = useState<FormState>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [confirmation, setConfirmation] = useState('')
  const [submissionUncertain, setSubmissionUncertain] = useState(false)
  const submittingRef = useRef(false)
  const idempotencyKeyRef = useRef('')

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    idempotencyKeyRef.current = ''
    setSubmissionUncertain(false)
    setStatus('idle')
    setConfirmation('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current || submissionUncertain) return

    const nextErrors: FormErrors = {}
    if (!formData.studentName.trim()) nextErrors.studentName = 'Enter the student’s name.'
    if (!formData.parentName.trim()) nextErrors.parentName = 'Enter the parent or guardian’s name.'
    if (!formData.mobileNumber.trim()) nextErrors.mobileNumber = 'Enter a mobile number.'
    else if (!isValidMobileNumber(formData.mobileNumber)) nextErrors.mobileNumber = 'Enter a valid 10-digit Indian mobile number, with or without +91.'
    if (!formData.interestedGrade) nextErrors.interestedGrade = 'Select an interested grade.'
    if (!formData.city.trim()) nextErrors.city = 'Select or enter a city.'
    if (formData.city.trim().toLowerCase() === 'other' && !formData.otherCity.trim()) nextErrors.otherCity = 'Enter your city.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      setConfirmation('')
      return
    }

    const payload = {
      studentName: formData.studentName.trim(),
      parentName: formData.parentName.trim(),
      mobile: formData.mobileNumber.trim(),
      grade: formData.interestedGrade,
      city: formData.city.trim().toLowerCase() === 'other' ? formData.otherCity.trim() : formData.city.trim(),
    }

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

      if (!response.ok || result?.success !== true || typeof result.enquiryId !== 'string' || !result.enquiryId) {
        setStatus('error')
        setConfirmation(getSubmissionError(response, result))
        return
      }

      idempotencyKeyRef.current = ''
      setSubmissionUncertain(false)
      setStatus('success')
      setConfirmation(`Thank you. Your enquiry has been received. Reference: ${result.enquiryId}`)
    } catch (error) {
      setStatus('error')
      if (error instanceof DOMException && error.name === 'AbortError') {
        setSubmissionUncertain(true)
        setConfirmation('We couldn’t confirm whether your enquiry was saved. To avoid a duplicate, please contact the school before submitting it again.')
      } else {
        setConfirmation('We couldn’t reach the enquiry service. Check your connection and try again.')
      }
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
          name="mobileNumber"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={16}
          required
          disabled={status === 'submitting' || submissionUncertain}
          value={formData.mobileNumber}
          onChange={(event) => handleChange('mobileNumber', event.target.value)}
          aria-invalid={Boolean(errors.mobileNumber)}
          aria-describedby={errors.mobileNumber ? 'enquiry-mobile-error' : 'enquiry-mobile-hint'}
        />
        {errors.mobileNumber
          ? <span id="enquiry-mobile-error" className="field-error">{errors.mobileNumber}</span>
          : <span id="enquiry-mobile-hint" className="form-note">Enter a 10-digit Indian mobile number; +91 is optional.</span>}
      </div>

      <div className="input-group">
        <label htmlFor="enquiry-grade">Interested Grade <span className="required-indicator">Required</span></label>
        <select
          id="enquiry-grade"
          name="interestedGrade"
          required
          disabled={status === 'submitting' || submissionUncertain}
          value={formData.interestedGrade}
          onChange={(event) => handleChange('interestedGrade', event.target.value)}
          aria-invalid={Boolean(errors.interestedGrade)}
          aria-describedby={errors.interestedGrade ? 'enquiry-grade-error' : undefined}
        >
          <option value="">Select a class</option>
          {grades.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
        </select>
        {errors.interestedGrade && <span id="enquiry-grade-error" className="field-error">{errors.interestedGrade}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="enquiry-city">City <span className="required-indicator">Required</span></label>
        <input
          id="enquiry-city"
          name="cityChoice"
          type="text"
          list="enquiry-city-options"
          autoComplete="address-level2"
          maxLength={80}
          required
          disabled={status === 'submitting' || submissionUncertain}
          value={formData.city}
          onChange={(event) => handleChange('city', event.target.value)}
          aria-invalid={Boolean(errors.city)}
          aria-describedby={errors.city ? 'enquiry-city-error' : undefined}
        />
        <datalist id="enquiry-city-options">
          {citySuggestions.map((city) => <option key={city} value={city} />)}
        </datalist>
        {errors.city && <span id="enquiry-city-error" className="field-error">{errors.city}</span>}
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
            value={formData.otherCity}
            onChange={(event) => handleChange('otherCity', event.target.value)}
            aria-invalid={Boolean(errors.otherCity)}
            aria-describedby={errors.otherCity ? 'enquiry-other-city-error' : undefined}
          />
          {errors.otherCity && <span id="enquiry-other-city-error" className="field-error">{errors.otherCity}</span>}
        </div>
      )}

      <button type="submit" className="primary-button" disabled={status === 'submitting' || submissionUncertain}>
        {status === 'submitting' ? 'Submitting…' : 'Submit Now'}
      </button>
      {confirmation && (
        <p className={`enquiry-feedback ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">
          {confirmation}
        </p>
      )}
    </form>
  )
}
