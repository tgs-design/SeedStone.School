import { ArrowRight, Users, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

const clubs = [
  {
    title: 'STEM Club',
    description: 'Hands-on problem solving, experimentation, curiosity, and early project building.',
  },
  {
    title: 'Creative and Performing Arts',
    description: 'A space for expression, confidence, storytelling, and artistic exploration.',
  },
  {
    title: 'Leadership and Communication',
    description: 'Opportunities to collaborate, contribute, and practise thoughtful group interaction.',
  },
  {
    title: 'Wellbeing and Life Skills',
    description: 'Practices that support emotional awareness, resilience, routines, and healthy habits.',
  },
]

export default function ClubsCommunityPage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">Clubs and community</p>
          <h1>Space for students to connect, create, and grow.</h1>
          <p>Seedstone’s proposed club ecosystem would support curiosity, social connection, and confidence alongside academics. Specific programmes remain subject to confirmation.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="What students may explore" title="Purposeful participation beyond the classroom" description="Club themes and specific activities are illustrative for this prototype and are not confirmed offerings." />
          <div className="theme-grid">
            {clubs.map(({ title, description }) => (
              <article className="theme-card" key={title}>
                <span className="feature-icon"><Sparkles size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container two-column">
          <div>
            <p className="kicker">Community</p>
            <h2>Learning feels stronger when it includes community.</h2>
            <p>Peer interaction, guided reflection, and collaborative projects can help children see themselves as part of a supportive learning community.</p>
          </div>
          <div className="active-card-list">
            <div className="feature-chip"><Users size={18} aria-hidden="true" />Student participation</div>
            <div className="feature-chip"><Sparkles size={18} aria-hidden="true" />Creative expression</div>
            <div className="feature-chip"><Users size={18} aria-hidden="true" />Peer support and confidence</div>
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div>
            <p className="kicker">Explore more</p>
            <h2>See how a broader learning experience might look.</h2>
          </div>
          <Link to="/activities" className="primary-button">Explore beyond academics <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  )
}
