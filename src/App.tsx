import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import ActivitiesPage from './pages/ActivitiesPage'
import BlogDetailPage from './pages/BlogDetailPage'
import BlogsPage from './pages/BlogsPage'
import ContactPage from './pages/ContactPage'
import CurriculumPage from './pages/CurriculumPage'
import HomePage from './pages/HomePage'
import LearningExperiencePage from './pages/LearningExperiencePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import PolicyDraftPage from './pages/PolicyDraftPage'
import PortalPage from './portal/PortalPage'
import { DemoStateProvider } from './portal/DemoStateProvider'
import './App.css'

function App() {
  return (
    <DemoStateProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="learning-experience" element={<LearningExperiencePage />} />
            <Route path="curriculum" element={<CurriculumPage />} />
            <Route path="activities" element={<ActivitiesPage />} />
            <Route path="blogs" element={<BlogsPage />} />
            <Route path="blogs/:slug" element={<BlogDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="policies/:slug" element={<PolicyDraftPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/portal/*" element={<PortalPage />} />
        </Routes>
      </BrowserRouter>
    </DemoStateProvider>
  )
}

export default App
