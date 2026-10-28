import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Accordion from '../components/Accordion'
import SectionHeading from '../components/SectionHeading'
import { audienceCards, beyondTextbookAreas, faqs, seedstoneFeatures } from '../data/siteData'

const learningJourney = [
  { title: 'Explore Seedstone', description: 'Get to know the school’s vision and proposed approach.' },
  { title: 'Prepare your questions', description: 'Use the enquiry form to outline what you would like to understand.' },
  { title: 'Understand the offering', description: 'Review verified programme details as they become available.' },
  { title: 'Consider what fits', description: 'Explore whether the available offering suits your child and family.' },
]

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="kicker">A different way to think about school</p>
            <h1>We’re Reimagining What School Can Be.</h1>
            <p className="lead">A different approach to schooling, designed around how children learn, what they love, and who they want to become.</p>
            <div className="button-row">
              <button type="button" className="primary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Inquire Now</button>
              <Link to="/curriculum" className="secondary-button">Explore Our Curriculum</Link>
            </div>
          </div>
          <figure className="hero-visual">
            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80" alt="Illustrative image of children learning together; not a Seedstone classroom" fetchPriority="high" />
            <figcaption>Illustrative image</figcaption>
          </figure>
        </div>
      </section>

      <section className="page-section idea-section" id="seedstone-idea">
        <div className="container idea-layout">
          <p className="kicker">The Seedstone idea</p>
          <div>
            <h2>School can make room for more than one way to learn.</h2>
            <p>Every child brings their own questions, interests, and ambitions. Seedstone is being shaped around a simple idea: learning should help children understand the world, explore what matters to them, and imagine who they might become.</p>
            <Link to="/about" className="inline-link">Discover the Seedstone vision <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container">
          <SectionHeading eyebrow="Rethinking the learning experience" title="A thoughtful approach, in four parts" description="These are guiding ideas for the proposed approach, not guarantees of specific services or outcomes." />
          <div className="approach-list">
            {seedstoneFeatures.map((feature, index) => (
              <article className="approach-item" key={feature.title}>
                <span className="approach-number">0{index + 1}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
          <Link to="/curriculum" className="inline-link">Explore the proposed curriculum <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="page-section">
        <div className="container audience-layout">
          <div>
            <p className="kicker">Who Seedstone may be for</p>
            <h2>Different families. Different reasons to explore.</h2>
            <p className="section-intro">The proposed approach may be worth exploring for families with a range of learning needs and circumstances. Every child and family is different.</p>
          </div>
          <ul className="audience-list">
            {audienceCards.map((audience) => <li key={audience}>{audience}</li>)}
          </ul>
        </div>
      </section>

      <section className="page-section journey-section">
        <div className="container">
          <SectionHeading eyebrow="Your learning journey" title="A clear way to explore what may fit" description="Programme availability and admissions steps are not yet confirmed. An enquiry is a starting point for questions, not an application or guarantee of admission." align="center" />
          <ol className="journey-list">
            {learningJourney.map((step, index) => (
              <li className="journey-item" key={step.title}>
                <span className="approach-number">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-section beyond-section">
        <div className="container">
          <SectionHeading eyebrow="Learning beyond textbooks" title="Space for interests, ideas, and practical questions" description="These are proposed areas of interest, not a confirmed list of courses or available services." />
          <div className="interest-list">
            {beyondTextbookAreas.map((area) => (
              <article className="interest-item" key={area.title}>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section cream-section faq-section">
        <div className="container faq-layout">
          <div>
            <p className="kicker">Frequently asked questions</p>
            <h2>Clear answers, including what’s still to be confirmed.</h2>
            <p>Have another question? The enquiry form is available, though it is not connected to a live admissions system.</p>
            <button type="button" className="secondary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Ask a question</button>
          </div>
          <div className="accordion-list">
            {faqs.map((faq) => <Accordion key={faq.question} title={faq.question} content={<p>{faq.answer}</p>} />)}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section">
        <div className="container final-cta-box">
          <div>
            <p className="kicker">A conversation can be a first step</p>
            <h2>Let’s Find Out If Seedstone Is Right for Your Child.</h2>
            <p>Have questions about our approach to schooling? Use the enquiry form to prepare what you would like to ask. It does not send messages to a live team.</p>
          </div>
          <button type="button" className="primary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Make an Enquiry</button>
        </div>
      </section>
    </>
  )
}
