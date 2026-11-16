import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

const pageMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Seedstone School',
    description: 'Discover Seedstone School’s educational vision and current focus on Primary and Middle learning: Classes 1–8.',
  },
  '/about': {
    title: 'About Seedstone School',
    description: 'Learn about Seedstone School’s vision and educational philosophy for its current Classes 1–8 focus.',
  },
  '/learning-experience': {
    title: 'Learning Experience',
    description: 'Explore Seedstone School’s learning philosophy and current focus on Classes 1–8.',
  },
  '/contact': {
    title: 'Enquire Now',
    description: 'Prepare a general question about Seedstone School’s current focus on Classes 1–8.',
  },
}

export default function Layout() {
  const location = useLocation()
  const path = location.pathname.replace(/\/+$/, '') || '/'

  useEffect(() => {
    const metadata = pageMetadata[path] ?? {
      title: 'Page not found',
      description: 'The page you are looking for could not be found.',
    }

    document.title = path === '/' ? metadata.title : `${metadata.title} | Seedstone School`
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) description.content = metadata.description
  }, [path])

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
