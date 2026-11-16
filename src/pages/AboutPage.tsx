import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">About Seedstone</p>
          <h1>A school shaped by a thoughtful vision for learning.</h1>
          <p>Seedstone’s current focus is Classes 1–8: Primary (Classes 1–5) and Middle (Classes 6–8).</p>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container about-vision">
          <p className="kicker">Our vision</p>
          <h2>Make room for curiosity, understanding, and individual growth.</h2>
          <p>Seedstone’s educational philosophy is centred on exploring ideas, building understanding, practising, and reflecting. The current public focus is Primary and Middle learning for Classes 1–8.</p>
        </div>
      </section>

      <section className="page-section launch-cta-section">
        <div className="container launch-cta">
          <div>
            <p className="kicker">Current focus · Classes 1–8</p>
            <h2>Want to learn more?</h2>
          </div>
          <Link to="/contact" className="primary-button">Enquire Now <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  )
}
