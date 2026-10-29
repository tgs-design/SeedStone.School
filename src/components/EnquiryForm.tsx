import { useState } from 'react'
import type { FormEvent } from 'react'

type EnquiryFormProps = {
  variant?: 'modal' | 'inline'
}

type FormState = {
  name: string
  mobile: string
  email: string
  classLevel: string
  city: string
  contactPreference: string
  message: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const classOptions = Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`)

const initialValues: FormState = {
  name: '',
  mobile: '',
  classLevel: '',
  email: '',
  city: '',
  contactPreference: 'Phone',
  message: '',
}

export default function EnquiryForm({ variant = 'modal' }: EnquiryFormProps) {
  const idPrefix = variant === 'modal' ? 'enquiry-modal' : 'enquiry-inline'
  const [formData, setFormData] = useState<FormState>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const validate = (values: FormState) => {
    const nextErrors: FormErrors = {}

    if (!values.name.trim()) {
      nextErrors.name = 'Parent name is required.'
    }

    if (!values.mobile.trim()) {
      nextErrors.mobile = 'Mobile number is required.'
    } else if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(values.mobile.replace(/[\s()-]/g, ''))) {
      nextErrors.mobile = 'Enter a valid Indian mobile number.'
    }

    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!values.classLevel.trim()) {
      nextErrors.classLevel = 'Please select your child\'s class.'
    }

    return nextErrors
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setIsSuccess(false)
      return
    }

    setIsSuccess(true)
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setIsSuccess(false)
  }

  return (
    <form className={`enquiry-form ${variant}`} onSubmit={handleSubmit} noValidate>
      <p className="form-note">Prototype only: your details are not saved or sent. Please do not include sensitive information.</p>
      <div className="input-group">
        <label htmlFor={`${idPrefix}-name`}>Parent/guardian name <span className="required-indicator">Required</span></label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={(event) => handleChange('name', event.target.value)}
          placeholder="Enter parent name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
        />
        {errors.name ? <span id={`${idPrefix}-name-error`} className="field-error">{errors.name}</span> : null}
      </div>

      <div className="input-group">
        <label htmlFor={`${idPrefix}-email`}>Email (optional)</label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={(event) => handleChange('email', event.target.value)}
          placeholder="name@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
        />
        {errors.email ? <span id={`${idPrefix}-email-error`} className="field-error">{errors.email}</span> : null}
      </div>

      <div className="input-group">
        <label htmlFor={`${idPrefix}-mobile`}>Mobile number <span className="required-indicator">Required</span></label>
        <input
          id={`${idPrefix}-mobile`}
          type="tel"
          name="mobile"
          required
          value={formData.mobile}
          onChange={(event) => handleChange('mobile', event.target.value)}
          placeholder="e.g. 9876543210"
          aria-invalid={Boolean(errors.mobile)}
          aria-describedby={errors.mobile ? `${idPrefix}-mobile-error` : undefined}
        />
        {errors.mobile ? <span id={`${idPrefix}-mobile-error`} className="field-error">{errors.mobile}</span> : null}
      </div>

      <div className="input-group">
        <label htmlFor={`${idPrefix}-class`}>Child's class <span className="required-indicator">Required</span></label>
        <select
          id={`${idPrefix}-class`}
          name="classLevel"
          required
          value={formData.classLevel}
          onChange={(event) => handleChange('classLevel', event.target.value)}
          aria-invalid={Boolean(errors.classLevel)}
          aria-describedby={errors.classLevel ? `${idPrefix}-class-error` : undefined}
        >
          <option value="">Select class</option>
          {classOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.classLevel ? <span id={`${idPrefix}-class-error`} className="field-error">{errors.classLevel}</span> : null}
      </div>

      <div className="input-group">
        <label htmlFor={`${idPrefix}-city`}>City (optional)</label>
        <input
          id={`${idPrefix}-city`}
          type="text"
          name="city"
          autoComplete="address-level2"
          value={formData.city}
          onChange={(event) => handleChange('city', event.target.value)}
          placeholder="Enter city"
        />
      </div>

      <div className="input-group">
        <label htmlFor={`${idPrefix}-contact-preference`}>Preferred contact method</label>
        <select
          id={`${idPrefix}-contact-preference`}
          name="contactPreference"
          value={formData.contactPreference}
          onChange={(event) => handleChange('contactPreference', event.target.value)}
        >
          <option>Phone</option>
          <option>Email</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor={`${idPrefix}-message`}>What would you like to ask? (optional)</label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={3}
          maxLength={1000}
          value={formData.message}
          onChange={(event) => handleChange('message', event.target.value)}
        />
      </div>

      <button type="submit" className="primary-button">Submit enquiry</button>

      {isSuccess ? (
        <p className="success-message" role="status" aria-live="polite">
          Your enquiry was checked in this browser only. It has not been saved or sent; a live admissions connection is not available.
        </p>
      ) : null}
    </form>
  )
}
