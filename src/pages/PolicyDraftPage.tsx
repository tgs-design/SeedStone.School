import { Link, useParams } from 'react-router-dom'

const policyTitles: Record<string, string> = {
  privacy: 'Privacy notice',
  terms: 'Website terms',
}

export default function PolicyDraftPage() {
  const { slug = '' } = useParams()
  const title = policyTitles[slug]

  if (!title) {
    return (
      <section className="page-section">
        <div className="container narrow-section empty-state">
          <h1>Policy page not found</h1>
          <Link to="/" className="primary-button">Back to home</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page-section inner-hero">
      <div className="container narrow-section policy-draft-page">
        <p className="kicker">Draft · Pending approval</p>
        <h1>{title}</h1>
        <p>Seedstone School has not yet published approved {title.toLowerCase()} text. This page is a prototype placeholder, not a legal policy. Please do not rely on it as legal advice or as a description of a live service.</p>
        <Link to="/contact" className="inline-link">Return to verified website information</Link>
      </div>
    </section>
  )
}
