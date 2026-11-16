import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Accordion from '../components/Accordion'
import SectionHeading from '../components/SectionHeading'
import { faqs } from '../data/siteData'

export default function FaqsPage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">FAQS</p>
          <h1>Questions families often ask.</h1>
          <p>Seedstone’s current focus is Classes 1–8. Programme, admissions, curriculum, and timings remain subject to confirmation.</p>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container">
          <SectionHeading eyebrow="Common questions" title="Helpful answers for families" description="These responses are for orientation and do not constitute live admissions or school-policy confirmation." align="center" />
          <div className="accordion-list">
            {faqs.map((faq) => <Accordion key={faq.question} title={faq.question} content={<p>{faq.answer}</p>} />)}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div>
            <p className="kicker">Need more clarity?</p>
            <h2>Ask about the current learning focus.</h2>
          </div>
          <Link to="/#enquiry" className="primary-button">Book a Demo <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  )
}
