import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand footer-brand" aria-label="Seedstone School home">
            <img src="/seedstone-logo.svg" alt="Seedstone School" className="brand-logo footer-logo" />
          </Link>
          <p className="footer-copy">Powered by PhysicsWallah. A thoughtful learning experience with a current focus on Classes 1–8.</p>
        </div>

        <div>
          <h3>Explore</h3>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/learning-experience">Learning Experience</Link></li>
            <li><Link to="/curriculum">Curriculum</Link></li>
            <li><Link to="/activities">Beyond Academics</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
          </ul>
        </div>

        <div>
          <h3>Support</h3>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Enquire about admissions</button></li>
          </ul>
        </div>

        <div>
          <h3>Policies</h3>
          <ul className="footer-links">
            <li><Link to="/policies/privacy">Privacy policy <span>(draft)</span></Link></li>
            <li><Link to="/policies/terms">Terms and conditions <span>(draft)</span></Link></li>
            <li><Link to="/policies/refund">Refund and withdrawal policy <span>(draft)</span></Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Seedstone School.</span>
      </div>
    </footer>
  )
}
