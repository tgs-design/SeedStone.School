import SectionHeading from '../components/SectionHeading'
import { audienceCards, seedstoneFeatures } from '../data/siteData'

export default function AboutPage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">About Seedstone School</p>
          <h1>Making space for a more thoughtful learning experience.</h1>
          <p>Seedstone’s current focus is Classes 1–8: Primary (Classes 1–5) and Middle (Classes 6–8).</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container two-column">
          <div>
            <SectionHeading eyebrow="The Seedstone idea" title="School can make room for more than one way to learn." />
          </div>
          <div>
            <p>Seedstone School is being developed around an educational vision that gives children room to understand ideas, explore their interests, and consider who they want to become. The current focus is Classes 1–8. Class-wise curriculum, teaching model, and admission availability are still being confirmed.</p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="A proposed learning philosophy" title="Ideas that can guide the learning experience" description="These themes describe the intended approach, not guaranteed services or outcomes." />
          <div className="approach-list">
            {seedstoneFeatures.map((feature, index) => (
              <article className="approach-item" key={feature.title}>
                <span className="approach-number">0{index + 1}</span>
                <div><h3>{feature.title}</h3><p>{feature.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="Who Seedstone may be for" title="Different families have different reasons to explore" description="These are possible family contexts, not a statement that Seedstone suits every child or circumstance." />
          <ul className="audience-list">
            {audienceCards.map((audience) => <li key={audience}>{audience}</li>)}
          </ul>
        </div>
      </section>

      <section className="page-section">
        <div className="container two-column">
          <SectionHeading eyebrow="The school today" title="Key details are still being confirmed." />
          <p>Educator and leadership profiles, class-wise curriculum details, admissions information, and contact details will be shared when approved. No board affiliation or examination arrangement is claimed.</p>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div>
            <p className="kicker">Explore the proposed approach</p>
            <h2>Have questions about Seedstone?</h2>
          </div>
          <button type="button" className="primary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Inquire Now</button>
        </div>
      </section>
    </>
  )
}
