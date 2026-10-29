import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { blogPosts } from '../data/siteData'
import EnquiryModal from './EnquiryModal'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const article = location.pathname.startsWith('/blogs/')
      ? blogPosts.find((post) => post.id === location.pathname.split('/').at(-1))
      : undefined
    const page = location.pathname === '/' ? 'Home' : ({
      '/about': 'About',
      '/learning-experience': 'Learning Experience',
      '/curriculum': 'Curriculum & Pathways',
      '/activities': 'Beyond Academics',
      '/blogs': 'Blogs',
      '/contact': 'Contact',
      '/login': 'Login & Demo Portal',
      '/policies/privacy': 'Privacy notice · Draft',
      '/policies/terms': 'Website terms · Draft',
      '/policies/refund': 'Refund and withdrawal policy · Draft',
    } as Record<string, string>)[location.pathname] ?? 'Page not found'
    const title = article ? `${article.title} | Seedstone School` : `${page} | Seedstone School`
    const descriptions: Record<string, string> = {
      '/': 'Explore Seedstone School’s proposed learning approach, class groups, curriculum references, and learning experience.',
      '/about': 'Learn about Seedstone School’s proposed learning philosophy and the details that remain subject to confirmation.',
      '/learning-experience': 'Explore Seedstone School’s proposed learning cycle, learning themes, and browser-only portal demonstration.',
      '/curriculum': 'Compare official curriculum pathway references and explore proposed class-stage guidance. Seedstone pathway availability is unconfirmed.',
      '/activities': 'Explore illustrative beyond-academics activity ideas by category and class group. No activities are confirmed as currently offered.',
      '/blogs': 'Browse Seedstone School’s sample draft articles for families and learners.',
      '/contact': 'Prepare an enquiry about Seedstone School. This frontend prototype does not save or send form submissions.',
      '/login': 'Explore the fictional, browser-only Seedstone School role-based portal demo.',
    }
    document.title = title
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) {
      description.content = article
        ? `${article.excerpt} This is an unapproved sample draft from Seedstone School.`
        : descriptions[location.pathname] ?? 'This Seedstone School page is a frontend prototype. Programme and school information remain subject to confirmation.'
    }
  }, [location.pathname])

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
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }, [location.pathname])

  return (
    <>
      <Header onOpenEnquiry={() => setIsEnquiryOpen(true)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </>
  )
}
