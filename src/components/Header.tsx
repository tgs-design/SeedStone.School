import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navItems } from '../data/siteData'

type HeaderProps = {
  onOpenEnquiry: () => void
}

export default function Header({ onOpenEnquiry }: HeaderProps) {
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
        <Link to="/" className="brand" aria-label="Seedstone School home">
          <img src="/seedstone-logo.svg" alt="Seedstone School" className="brand-logo" />
        </Link>

        <nav id="main-navigation" className={`main-nav ${mobileOpen ? 'open' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMobileOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <div className="mobile-nav-actions">
            <Link to="/login" className="secondary-button" onClick={() => setMobileOpen(false)}>Login</Link>
            <button type="button" className="primary-button" onClick={() => { setMobileOpen(false); onOpenEnquiry() }}>Inquire Now</button>
          </div>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="login-link" onClick={() => setMobileOpen(false)}>Login</Link>
          <button type="button" className="primary-button compact-button" onClick={onOpenEnquiry}>Inquire Now</button>
          <button type="button" className="menu-toggle" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} aria-controls="main-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}
