import Accordion from '../components/Accordion'
import SectionHeading from '../components/SectionHeading'
import { curriculumAccordionStatic, curriculumModel, growthFocusCards, learningExperienceCards } from '../data/siteData'

export default function CurriculumPage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">Curriculum</p>
          <h1>A proposed learning framework, shaped around curiosity.</h1>
          <p>Programme availability, subjects, board affiliations, and qualification routes are pending confirmation. The learning examples below are illustrative.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container narrow-section">
          <SectionHeading eyebrow="A proposed learning approach" title="From understanding to application" description="These stages describe an intended educational approach, not a confirmed timetable or programme." align="center" />
          <div className="timeline-grid">
            {curriculumModel.map((item, index) => (
              <div className="timeline-step" key={item}>
                <div className="timeline-badge">0{index + 1}</div>
                <h3>{item}</h3>
                <p>{index === 0 ? 'Begin with the ideas and questions behind a topic.' : index === 1 ? 'Revisit ideas and consider how they connect.' : 'Explore how ideas might be used in new contexts.'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="Illustrative overview" title="Possible learning pathways by stage" />
          <div className="accordion-list">
            {Object.entries(curriculumAccordionStatic).map(([title, details], index) => (
              <Accordion key={title} title={title} defaultOpen={index === 0} content={
                <div className="accordion-body">
                  <p><strong>Subjects:</strong> {details.subjects}</p>
                  <p><strong>Learning approach:</strong> {details.approach}</p>
                  <p><strong>Illustrative learning focus:</strong> {details.outcomes}</p>
                </div>
              } />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container">
          <SectionHeading eyebrow="Illustrative learning elements" title="Possible parts of a learning experience" description="Specific offerings and availability are pending confirmation." align="center" />
          <div className="feature-grid five-up">
            {learningExperienceCards.map((item) => (
              <div className="feature-card" key={item}>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="Illustrative areas of interest" title="A broader learning lens" description="These themes are illustrative, not confirmed offerings." align="center" />
          <div className="value-grid">
            {growthFocusCards.map((card) => (
              <div className="value-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container narrow-section">
          <SectionHeading eyebrow="Exam preparation" title="Exam preparation details pending confirmation" />
          <p>Subjects, examination routes, and any related qualifications have not been confirmed. Please check with the school for approved programme information.</p>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div>
            <p className="kicker">Looking for the Right Learning Plan for Your Child?</p>
            <h2>Ask a question about the proposed learning approach.</h2>
          </div>
          <button type="button" className="primary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Inquire Now</button>
        </div>
      </section>
    </>
  )
}
