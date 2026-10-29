import { ArrowRight, BookOpen, Compass, Lightbulb, RefreshCw, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { learningExperienceThemes } from '../data/siteData'

const stages = [
  { title: 'Explore', detail: 'Begin with questions, interests, and the world around you.', icon: Compass },
  { title: 'Learn', detail: 'Start with an idea and the questions behind it.', icon: BookOpen },
  { title: 'Practise', detail: 'Try, revisit, and build confidence at a considered pace.', icon: RefreshCw },
  { title: 'Reflect', detail: 'Look back on the learning and identify a next question.', icon: Lightbulb },
]

export default function LearningExperiencePage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">Learning experience</p>
          <h1>Learning is more than completing a lesson.</h1>
          <p>Seedstone’s current focus is Classes 1–8. The proposed experience is being shaped around understanding, purposeful practice, exploration, and reflection; specific services and class-wise programmes remain subject to confirmation.</p>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container">
          <SectionHeading eyebrow="A proposed learning cycle" title="Move from ideas to new questions" description="A framework for the learning experience, not a confirmed timetable or service." align="center" />
          <ol className="learning-cycle-grid">
            {stages.map(({ title, detail, icon: Icon }, index) => (
              <li className="learning-cycle-card" key={title}>
                <span className="learning-cycle-number">0{index + 1}</span>
                <span className="learning-cycle-icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="Classes 1–8 learning themes" title="Academic learning and enrichment are different things" description="The catalogue below groups proposed learning themes for the current Classes 1–8 focus. These labels do not imply that a course, tool, staff role, or partnership is currently available." />
          <div className="experience-catalogue">
            {learningExperienceThemes.map((theme, index) => (
              <article className="experience-theme-card" key={theme.title}>
                <div className="experience-theme-heading">
                  <span className="feature-icon">{index === 0 ? <BookOpen size={22} /> : index === 1 ? <RefreshCw size={22} /> : index === 2 ? <Compass size={22} /> : <Sparkles size={22} />}</span>
                  <span className="status-label">{theme.status}</span>
                </div>
                <h2>{theme.title}</h2>
                <p>{theme.description}</p>
                <ul>{theme.examples.map((example) => <li key={example}>{example}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container two-column">
          <SectionHeading eyebrow="Student and parent partnership" title="Progress should support the next conversation." />
          <div>
            <p>A student portal demonstration is available to explore an example lesson-to-feedback workflow. Its records are fictional and stored only in this browser. Parent reports, teacher feedback, timetable, and progress systems are not connected to school data.</p>
            <Link to="/login" className="inline-link">Explore the role-based portal demo <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div>
            <p className="kicker">Explore the academic structure</p>
            <h2>See the proposed class-wise curriculum.</h2>
          </div>
          <Link to="/curriculum" className="primary-button">Explore Curriculum <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  )
}
