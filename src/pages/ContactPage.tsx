import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Accordion from '../components/Accordion'
import EnquiryForm from '../components/EnquiryForm'
import SectionHeading from '../components/SectionHeading'
import { faqs } from '../data/siteData'

export default function ContactPage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">Contact and enquiries · Classes 1–8</p>
          <h1>Start with a question about Seedstone’s current focus.</h1>
          <p>Prepare a general question about Primary (Classes 1–5) or Middle (Classes 6–8). Verified contact details and a live enquiry service are not yet available.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container contact-grid">
          <div className="contact-intro">
            <p className="kicker">Enquiry prototype</p>
            <h2>Choose a class area and a topic.</h2>
            <p>This browser-only form helps check the shape of an enquiry. It cannot reach the Seedstone team.</p>
            <p className="contact-info-note">Do not enter a child’s name, contact details, health information, or other identifying details. Nothing is saved or sent.</p>
            <Link to="/curriculum" className="inline-link">Review the Classes 1–8 curriculum overview <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>

          <div className="contact-card">
            <h3>Prepare a question</h3>
            <EnquiryForm variant="inline" />
          </div>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container">
          <SectionHeading eyebrow="Frequently asked questions" title="Helpful answers for families" description="Seedstone’s current focus is Classes 1–8. Programme and admissions details remain subject to confirmation." align="center" />
          <div className="accordion-list">
            {faqs.map((faq) => <Accordion key={faq.question} title={faq.question} content={<p>{faq.answer}</p>} />)}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div><p className="kicker">Current class focus</p><h2>Explore Primary and Middle learning.</h2></div>
          <Link to="/curriculum" className="primary-button">Explore Classes 1–8 <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  )
}
