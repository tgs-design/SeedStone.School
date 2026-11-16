import { ArrowDownRight, ArrowRight, BookOpen, Compass, Lightbulb, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroLearningWorld from '../components/HeroLearningWorld'
import SectionHeading from '../components/SectionHeading'
import { primaryClassBands } from '../data/siteData'

const learningPrinciples = [
  { title: 'Explore', description: 'Make room for questions and curiosity.', icon: Compass },
  { title: 'Understand', description: 'Focus on making sense of ideas.', icon: BookOpen },
  { title: 'Practise', description: 'Revisit ideas and build understanding.', icon: RefreshCw },
  { title: 'Reflect', description: 'Pause, notice, and consider what comes next.', icon: Lightbulb },
]

export default function HomePage() {
  return (
    <>
      <section className="hero-section launch-hero">
        <div className="container hero-grid launch-hero-grid">
          <div className="hero-copy">
            <p className="kicker">SEEDSTONE SCHOOL · CLASSES 1–8</p>
            <h1>A thoughtful start to lifelong learning.</h1>
            <p className="lead">An educational vision shaped around curiosity, understanding, and room to grow. Seedstone’s current focus is Primary and Middle learning.</p>
            <div className="button-row">
              <Link className="primary-button" to="/contact">Enquire Now <ArrowRight size={17} aria-hidden="true" /></Link>
              <a className="secondary-button" href="#learning-approach">Explore Seedstone <ArrowDownRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
          <HeroLearningWorld />
        </div>
      </section>

      <section className="page-section launch-why">
        <div className="container launch-two-column">
          <SectionHeading eyebrow="Why Seedstone" title="Learning with purpose, curiosity, and care." />
          <div className="launch-copy">
            <p>Seedstone’s educational vision puts understanding at the heart of learning, with space to explore ideas and reflect along the way.</p>
            <Link to="/about" className="inline-link">Get to know Seedstone <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="page-section cream-section" id="learning-approach">
        <div className="container">
          <SectionHeading eyebrow="Learning approach" title="Explore. Understand. Practise. Reflect." description="A simple expression of Seedstone’s educational philosophy—not a timetable or a promise of specific services." align="center" />
          <ol className="learning-cycle-grid launch-learning-grid">
            {learningPrinciples.map(({ title, description, icon: Icon }, index) => (
              <li className="learning-cycle-card" key={title}>
                <span className="learning-cycle-number">0{index + 1}</span>
                <span className="feature-icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-section launch-academics">
        <div className="container">
          <SectionHeading eyebrow="Academic structure" title="One clear focus: Classes 1–8." description="The current launch offering is organised across two class groups." />
          <div className="class-pathway-grid launch-class-grid">
            {primaryClassBands.map((band) => (
              <article className="class-pathway-card" key={band.id}>
                <span className="class-pathway-range">{band.classes}</span>
                <h3>{band.id === 'primary' ? 'Primary' : 'Middle'}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section launch-association">
        <div className="container launch-association-panel">
          <div>
            <p className="kicker">Our association</p>
            <h2>Seedstone School, in association with PhysicsWallah.</h2>
            <p>The current public focus is Primary (Classes 1–5) and Middle (Classes 6–8).</p>
          </div>
        </div>
      </section>

      <section className="page-section launch-cta-section">
        <div className="container launch-cta">
          <div>
            <p className="kicker">Classes 1–8</p>
            <h2>Start with a question.</h2>
            <p>Explore the current focus and prepare a general enquiry. The form does not send or save submissions.</p>
          </div>
          <Link to="/contact" className="primary-button">Enquire Now <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  )
}
