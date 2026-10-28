import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import EnquiryModal from './EnquiryModal'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEnquiryOpen(false)
      }
    }

    const handleOpenEnquiry = () => setIsEnquiryOpen(true)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-enquiry', handleOpenEnquiry)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-enquiry', handleOpenEnquiry)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <>
      <Header onOpenEnquiry={() => setIsEnquiryOpen(true)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <button type="button" className="floating-enquiry" onClick={() => setIsEnquiryOpen(true)}>
        Inquire Now
      </button>
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </>
  )
}
