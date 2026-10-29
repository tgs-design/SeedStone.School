import { useState } from 'react'
import type { FormEvent } from 'react'
import Accordion from '../components/Accordion'
import SectionHeading from '../components/SectionHeading'
import { faqs } from '../data/siteData'

type ContactFormData = {
  name: string
  mobile: string
  email: string
  classLevel: string
  city: string
  contactPreference: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    mobile: '',
    email: '',
    classLevel: '',
    city: '',
    contactPreference: 'Phone',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setSubmitted(false)
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof ContactFormData, string>> = {}

    if (!formData.name.trim()) nextErrors.name = 'Full name is required.'
    if (!formData.mobile.trim()) nextErrors.mobile = 'Mobile number is required.'
    else if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(formData.mobile.replace(/[\s()-]/g, ''))) nextErrors.mobile = 'Enter a valid Indian mobile number.'
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (!formData.classLevel.trim()) nextErrors.classLevel = 'Please select a class.'

    return nextErrors
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false)
      return
    }

    setSubmitted(true)
  }

  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">Contact us</p>
          <h1>Explore the proposed learning approach.</h1>
        </div>
      </section>

      <section className="page-section">
        <div className="container contact-grid">
          <div className="contact-intro">
            <p className="kicker">Start with a question</p>
            <h2>Tell us what you’d like to know.</h2>
            <p>Share a little context and the questions you have about the proposed approach to learning.</p>
            <p className="contact-info-note">Verified contact details are pending confirmation. This prototype does not deliver or save messages. Please do not include sensitive information.</p>
          </div>

          <div className="contact-card">
            <h3>Prepare an enquiry</h3>
            <p className="form-note">Frontend prototype only. This message will not be saved or sent to the school.</p>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label htmlFor="contact-name">Full name</label>
                <input id="contact-name" type="text" autoComplete="name" required value={formData.name} onChange={(event) => handleChange('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} />
                {errors.name ? <span id="contact-name-error" className="field-error">{errors.name}</span> : null}
              </div>
              <div className="input-group">
                <label htmlFor="contact-mobile">Mobile number</label>
                <input id="contact-mobile" type="tel" autoComplete="tel" required value={formData.mobile} onChange={(event) => handleChange('mobile', event.target.value)} aria-invalid={Boolean(errors.mobile)} aria-describedby={errors.mobile ? 'contact-mobile-error' : undefined} />
                {errors.mobile ? <span id="contact-mobile-error" className="field-error">{errors.mobile}</span> : null}
              </div>
              <div className="input-group">
                <label htmlFor="contact-email">Email (optional)</label>
                <input id="contact-email" type="email" autoComplete="email" value={formData.email} onChange={(event) => handleChange('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} />
                {errors.email ? <span id="contact-email-error" className="field-error">{errors.email}</span> : null}
              </div>
              <div className="input-group">
                <label htmlFor="contact-class">Child's class</label>
                <select id="contact-class" required value={formData.classLevel} onChange={(event) => handleChange('classLevel', event.target.value)} aria-invalid={Boolean(errors.classLevel)} aria-describedby={errors.classLevel ? 'contact-class-error' : undefined}>
                  <option value="">Select class</option>
                  {Array.from({ length: 12 }, (_, index) => <option key={index + 1}>Class {index + 1}</option>)}
                </select>
                {errors.classLevel ? <span id="contact-class-error" className="field-error">{errors.classLevel}</span> : null}
              </div>
              <div className="input-group">
                <label htmlFor="contact-city">City (optional)</label>
                <input id="contact-city" type="text" autoComplete="address-level2" value={formData.city} onChange={(event) => handleChange('city', event.target.value)} />
              </div>
              <div className="input-group">
                <label htmlFor="contact-preference">Preferred contact method</label>
                <select id="contact-preference" value={formData.contactPreference} onChange={(event) => handleChange('contactPreference', event.target.value)}>
                  <option>Phone</option>
                  <option>Email</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="contact-message">Message (optional)</label>
                <textarea id="contact-message" rows={4} value={formData.message} onChange={(event) => handleChange('message', event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} />
                {errors.message ? <span id="contact-message-error" className="field-error">{errors.message}</span> : null}
              </div>

              <button type="submit" className="primary-button">Submit message</button>
              {submitted ? <p className="success-message" role="status">Your message was checked in this browser only. It has not been saved or sent.</p> : null}
            </form>
          </div>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container">
          <SectionHeading eyebrow="Frequently asked questions" title="Helpful answers for parents" description="Programme and admissions details remain subject to confirmation." align="center" />
          <div className="accordion-list">
            {faqs.map((faq) => (
              <Accordion key={faq.question} title={faq.question} content={<p>{faq.answer}</p>} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div>
            <p className="kicker">Need more support?</p>
            <h2>Verified contact details are pending confirmation.</h2>
          </div>
          <button type="button" className="primary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Inquire Now</button>
        </div>
      </section>
    </>
  )
}
