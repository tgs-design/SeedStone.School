import { useEffect, useRef, useState } from 'react'
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
const appsScriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL?.trim() ?? ''
const responseTimeoutMs = 30_000

function isValidMobileNumber(value: string) {
  return /^(?:\+?91[\s-]?)?[6-9]\d{9}$/.test(value.trim())
}

function getAppsScriptEndpoint() {
  try {
    const url = new URL(appsScriptUrl)
    if (url.protocol === 'https:' && url.hostname === 'script.google.com' && /^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)) {
      return url.toString()
    }
  } catch {
    return ''
  }

  return ''
}

export default function EnquiryForm() {
  const [formData, setFormData] = useState<FormState>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [confirmation, setConfirmation] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const submittingRef = useRef(false)

  useEffect(() => {
    const receiveSubmissionResult = (event: MessageEvent<unknown>) => {
      if (event.source !== iframeRef.current?.contentWindow || typeof event.data !== 'object' || event.data === null) return

      const result = event.data as { type?: unknown; status?: unknown; enquiryId?: unknown }
      if (result.type !== 'seedstone-enquiry-result' || status !== 'submitting') return

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      submittingRef.current = false

      if (result.status === 'saved' && typeof result.enquiryId === 'string') {
        setStatus('success')
        setConfirmation(`Thank you. Your enquiry has been received. Reference: ${result.enquiryId}`)
      } else {
        setStatus('error')
        setConfirmation('We couldn’t save your enquiry. Please try again later.')
      }
    }

    window.addEventListener('message', receiveSubmissionResult)
    return () => {
      window.removeEventListener('message', receiveSubmissionResult)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [status])

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    submittingRef.current = false
    setStatus('idle')
    setConfirmation('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current) return

    const nextErrors: FormErrors = {}
    if (!formData.studentName.trim()) nextErrors.studentName = 'Enter the student’s name.'
    if (!formData.parentName.trim()) nextErrors.parentName = 'Enter the parent or guardian’s name.'
    if (!formData.mobileNumber.trim()) nextErrors.mobileNumber = 'Enter a mobile number.'
    else if (!isValidMobileNumber(formData.mobileNumber)) nextErrors.mobileNumber = 'Enter a valid 10-digit Indian mobile number, with or without +91.'
    if (!formData.interestedGrade) nextErrors.interestedGrade = 'Select an interested grade.'
    if (!formData.city) nextErrors.city = 'Select or enter a city.'
    if (formData.city === 'Other' && !formData.otherCity.trim()) nextErrors.otherCity = 'Enter your city.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      setConfirmation('')
      return
    }

    const endpoint = getAppsScriptEndpoint()
    if (!endpoint) {
      setStatus('error')
      setConfirmation('Admission enquiries are not available yet because the secure submission service has not been configured.')
      return
    }

    const payload = {
      studentName: formData.studentName.trim(),
      parentName: formData.parentName.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      interestedGrade: formData.interestedGrade,
      city: formData.city === 'Other' ? formData.otherCity.trim() : formData.city,
    }

    const submissionForm = document.createElement('form')
    submissionForm.method = 'POST'
    submissionForm.action = endpoint
    submissionForm.target = 'seedstone-enquiry-response'
    submissionForm.hidden = true
    Object.entries(payload).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value
      submissionForm.append(input)
    })

    document.body.append(submissionForm)
    submittingRef.current = true
    setStatus('submitting')
    setConfirmation('Submitting your enquiry…')
    timeoutRef.current = setTimeout(() => {
      submittingRef.current = false
      setStatus('error')
      setConfirmation('We haven’t received confirmation that your enquiry was saved. Please try again later.')
      timeoutRef.current = null
    }, responseTimeoutMs)
    submissionForm.submit()
    submissionForm.remove()
  }

  return (
    <>
      <iframe
        ref={iframeRef}
        name="seedstone-enquiry-response"
        title="Admission enquiry submission response"
        className="enquiry-response-frame"
        tabIndex={-1}
        aria-hidden="true"
      />
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

        {formData.city === 'Other' && (
          <div className="input-group">
            <label htmlFor="enquiry-other-city">Enter City <span className="required-indicator">Required</span></label>
            <input
              id="enquiry-other-city"
              name="otherCity"
              type="text"
              autoComplete="address-level2"
              maxLength={80}
              required
              value={formData.otherCity}
              onChange={(event) => handleChange('otherCity', event.target.value)}
              aria-invalid={Boolean(errors.otherCity)}
              aria-describedby={errors.otherCity ? 'enquiry-other-city-error' : undefined}
            />
            {errors.otherCity && <span id="enquiry-other-city-error" className="field-error">{errors.otherCity}</span>}
          </div>
        )}

        <button type="submit" className="primary-button" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit Admission Enquiry'}
        </button>
        {confirmation && (
          <p className={`enquiry-feedback ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">
            {confirmation}
          </p>
        )}
      </form>
    </>
  )
}
