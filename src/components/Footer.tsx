import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand footer-brand" aria-label="Seedstone School home">
            <img src="/seedstone-logo.svg" alt="Seedstone School" className="brand-logo footer-logo" />
          </Link>
          <p className="footer-copy">Seedstone School is developing a thoughtful approach to learning, centered on understanding and each child’s growth.</p>
        </div>

        <div>
          <h3>Explore</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/curriculum">Curriculum</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/login">Login / Signup</Link></li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="footer-links">
            <li>Contact details are pending confirmation.</li>
            <li><Link to="/contact">View enquiry options</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Seedstone School. All rights reserved.</span>
      </div>
    </footer>
  )
}
