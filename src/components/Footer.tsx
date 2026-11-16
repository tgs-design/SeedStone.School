import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand footer-brand" aria-label="Seedstone School home">
            <img src="/seedstone-logo.svg" alt="Seedstone School" className="brand-logo footer-logo" />
          </Link>
          <p className="footer-copy">Seedstone School, in association with PhysicsWallah. Current focus: Classes 1–8.</p>
        </div>

        <div>
          <h3>Explore</h3>
          <ul className="footer-links">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/learning-experience">Learning Experience</Link></li>
          </ul>
        </div>

        <div>
          <h3>Admissions</h3>
          <ul className="footer-links">
            <li><Link to="/contact">Enquire Now</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Seedstone School.</span>
      </div>
    </footer>
  )
}
