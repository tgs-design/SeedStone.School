import { useState } from 'react'
import type { FormEvent } from 'react'
import { activeClassOptions } from '../data/siteData'

type EnquiryFormProps = {
  variant?: 'modal' | 'inline'
}

type FormState = {
  classLevel: string
  topic: string
  message: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const initialValues: FormState = { classLevel: '', topic: '', message: '' }
const enquiryTopics = ['Curriculum and learning', 'Activities and enrichment', 'Admissions and eligibility', 'Other question']

export default function EnquiryForm({ variant = 'modal' }: EnquiryFormProps) {
  const idPrefix = variant === 'modal' ? 'enquiry-modal' : 'enquiry-inline'
  const [formData, setFormData] = useState<FormState>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    if (!formData.classLevel) nextErrors.classLevel = 'Please select the class area for your question.'
    if (!formData.topic) nextErrors.topic = 'Please select a question topic.'
    setErrors(nextErrors)
    setValidated(Object.keys(nextErrors).length === 0)
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setValidated(false)
  }

  return (
    <form className={`enquiry-form ${variant}`} onSubmit={handleSubmit} noValidate>
      <p className="form-note">Prototype only: nothing is saved or sent. Do not enter a child’s name, contact details, health information, or other identifying details.</p>
      <div className="input-group">
        <label htmlFor={`${idPrefix}-class`}>Class area for your question <span className="required-indicator">Required</span></label>
        <select
          id={`${idPrefix}-class`}
          name="classLevel"
          required
          value={formData.classLevel}
          onChange={(event) => handleChange('classLevel', event.target.value)}
          aria-invalid={Boolean(errors.classLevel)}
          aria-describedby={errors.classLevel ? `${idPrefix}-class-error` : undefined}
        >
          <option value="">Select a class</option>
          {activeClassOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {errors.classLevel ? <span id={`${idPrefix}-class-error`} className="field-error">{errors.classLevel}</span> : null}
      </div>

      <div className="input-group">
        <label htmlFor={`${idPrefix}-topic`}>Question topic <span className="required-indicator">Required</span></label>
        <select
          id={`${idPrefix}-topic`}
          name="topic"
          required
          value={formData.topic}
          onChange={(event) => handleChange('topic', event.target.value)}
          aria-invalid={Boolean(errors.topic)}
          aria-describedby={errors.topic ? `${idPrefix}-topic-error` : undefined}
        >
          <option value="">Select a topic</option>
          {enquiryTopics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
        </select>
        {errors.topic ? <span id={`${idPrefix}-topic-error`} className="field-error">{errors.topic}</span> : null}
      </div>

      <div className="input-group">
        <label htmlFor={`${idPrefix}-message`}>Question (optional)</label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={3}
          maxLength={500}
          value={formData.message}
          onChange={(event) => handleChange('message', event.target.value)}
          aria-describedby={`${idPrefix}-message-note`}
        />
        <span id={`${idPrefix}-message-note`} className="form-note">Keep the question general. Do not include names or personal information.</span>
      </div>

      <button type="submit" className="primary-button">Check this question</button>
      {validated ? <p className="prototype-status" role="status" aria-live="polite">The form is valid in this browser only. No enquiry was created or sent.</p> : null}
    </form>
  )
}
