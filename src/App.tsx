import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
