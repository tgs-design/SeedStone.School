import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="page-section">
      <div className="container narrow-section empty-state">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you’re looking for could not be found.</p>
        <Link to="/" className="primary-button">Back to home</Link>
      </div>
    </section>
  )
}
