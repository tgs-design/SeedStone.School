import { Menu, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navItems } from '../data/siteData'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mobileOpen])

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <a href="#home" className="brand" aria-label="Seedstone School home" onClick={() => setMobileOpen(false)}>
          <img src="/seedstone-logo.svg" alt="Seedstone School" className="brand-logo" />
        </a>

        <nav id="main-navigation" className={`main-nav ${mobileOpen ? 'open' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.path} href={item.path} className="nav-link" onClick={() => setMobileOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="header-phone-link" href="tel:+919148177357" aria-label="Call Seedstone School at 91481 77357">
            <Phone size={15} aria-hidden="true" />
            <span>91481 77357</span>
          </a>
          <a href="/#enquiry" className="primary-button compact-button" onClick={() => setMobileOpen(false)}>Enquire Now </a>
          <button type="button" className="menu-toggle" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} aria-controls="main-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}
