import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    document.title = 'Seedstone School | Online School for Classes 1–8'
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) {
      description.content = 'Discover Seedstone School, an online school focused on Primary and Middle learning for Classes 1–8. Book a demo or call 9148177357.'
    }
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }, [location.pathname])

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
