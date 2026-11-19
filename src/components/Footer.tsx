import { navItems } from '../data/siteData'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <a href="#home" className="brand footer-brand" aria-label="Seedstone School home">
            <img src="/seedstone-logo.svg" alt="Seedstone School" className="brand-logo footer-logo" />
          </a>
          <p className="footer-copy">A Next-Gen Online Global School for Classes 1–8. </p>
        </div>

        <div>
          <h3>On this page</h3>
          <ul className="footer-links">
            {navItems.map((item) => (
              <li key={item.path}><a href={item.path}>{item.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Admissions</h3>
          <ul className="footer-links">
            <li><a href="/#enquiry">Book a Demo</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Seedstone School.</span>
      </div>
    </footer>
  )
}
