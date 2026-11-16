import { ArrowRight, BookOpen, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

const teacherRoles = [
  {
    title: 'Learning Guide',
    summary: 'Supports daily teaching, concept clarity, and classroom conversation.',
    points: ['Explains concepts clearly', 'Guides questions in real time', 'Builds confidence through regular support'],
  },
  {
    title: 'Progress Mentor',
    summary: 'Focuses on reflection, feedback, and individual growth beyond the lesson.',
    points: ['Tracks understanding and practice', 'Provides guidance for progress', 'Connects learning goals to next steps'],
  },
]

export default function TwoTeacherModelPage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">Teaching model</p>
          <h1>The Two-Teacher Model</h1>
          <p>Seedstone’s model is designed around a strengthened learning partnership: one teacher leads concept learning while another supports individual guidance, continuity, and progress.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="How it works" title="Two roles, one learning experience" description="This approach is intended to give students deeper support in class and clearer follow-through outside it. Exact programme design remains subject to confirmation." />
          <div className="theme-grid">
            {teacherRoles.map(({ title, summary, points }) => (
              <article className="theme-card" key={title}>
                <span className="feature-icon"><Users size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{summary}</p>
                <ul className="check-list">
                  {points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container two-column">
          <div>
            <p className="kicker">Why it matters</p>
            <h2>More support, more attention, more clarity.</h2>
            <p>In a learning experience designed for younger students and growing learners, the goal is to create more space for explanation, feedback, and encouragement without slowing down understanding.</p>
          </div>
          <div className="active-card-list">
            <div className="feature-chip"><BookOpen size={18} aria-hidden="true" />Clearer concept explanations</div>
            <div className="feature-chip"><Users size={18} aria-hidden="true" />More guided student support</div>
            <div className="feature-chip"><BookOpen size={18} aria-hidden="true" />Improved practice and follow-up</div>
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div>
            <p className="kicker">Explore the learning journey</p>
            <h2>Understand how Seedstone may support daily learning.</h2>
          </div>
          <Link to="/learning-experience" className="primary-button">Explore learning <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  )
}
