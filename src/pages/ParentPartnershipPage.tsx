import { ArrowRight, HeartHandshake, MessageSquareText } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

const partnershipPoints = [
  'Regular progress checks and clear feedback loops',
  'Parent guidance to support learning at home',
  'A respectful, two-way communication process',
]

export default function ParentPartnershipPage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">Parent partnership</p>
          <h1>Learning grows when families and school stay connected.</h1>
          <p>Seedstone’s proposal is to make communication clear, supportive, and informed—without assuming a specific data dashboard or platform is already live.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="What partnership may include" title="Progress, communication, and confidence" description="The exact reporting and communication model still needs confirmation, but the intention is to help families feel informed and included." />
          <div className="theme-grid">
            {partnershipPoints.map((point) => (
              <article className="theme-card" key={point}>
                <span className="feature-icon"><HeartHandshake size={22} aria-hidden="true" /></span>
                <h3>Family support</h3>
                <p>{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container two-column">
          <div>
            <p className="kicker">Parent communication</p>
            <h2>Practical, respectful, and human.</h2>
            <p>Strong communication gives families a clearer idea of progress, interests, and next steps. That relationship is intended to be supportive and constructive, rather than purely transactional.</p>
          </div>
          <div className="active-card-list">
            <div className="feature-chip"><MessageSquareText size={18} aria-hidden="true" />Two-way feedback</div>
            <div className="feature-chip"><HeartHandshake size={18} aria-hidden="true" />Guidance and confidence</div>
            <div className="feature-chip"><MessageSquareText size={18} aria-hidden="true" />Clear next steps</div>
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div>
            <p className="kicker">Book a conversation</p>
            <h2>Start with your questions.</h2>
          </div>
          <Link to="/contact" className="primary-button">Book a Demo <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  )
}
