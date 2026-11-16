import { ArrowRight, BookOpen, Compass, Lightbulb, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

const stages = [
  { title: 'Explore', detail: 'Make room for questions and curiosity.', icon: Compass },
  { title: 'Understand', detail: 'Focus on making sense of ideas.', icon: BookOpen },
  { title: 'Practise', detail: 'Revisit ideas and build understanding.', icon: RefreshCw },
  { title: 'Reflect', detail: 'Pause, notice, and consider what comes next.', icon: Lightbulb },
]

export default function LearningExperiencePage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">Learning experience</p>
          <h1>Learning starts with curiosity and grows through understanding.</h1>
          <p>Seedstone’s educational philosophy centres on exploring ideas, understanding them, practising, and reflecting. The current focus is Primary (Classes 1–5) and Middle (Classes 6–8).</p>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container">
          <SectionHeading eyebrow="Our learning philosophy" title="A thoughtful way to engage with ideas." description="These principles describe an educational philosophy, not a timetable or a claim about specific services." align="center" />
          <ol className="learning-cycle-grid launch-learning-grid">
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

      <section className="page-section launch-cta-section">
        <div className="container launch-cta">
          <div>
            <p className="kicker">Current focus · Classes 1–8</p>
            <h2>Have a question about Seedstone?</h2>
          </div>
          <Link to="/contact" className="primary-button">Enquire Now <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  )
}
