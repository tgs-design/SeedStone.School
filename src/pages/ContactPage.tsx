import EnquiryForm from '../components/EnquiryForm'

export default function ContactPage() {
  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">Admissions · Classes 1–8</p>
          <h1>Start with a question.</h1>
          <p>Choose a class area and a topic to prepare a general enquiry about Seedstone School.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container contact-grid">
          <div className="contact-intro">
            <p className="kicker">A note before you begin</p>
            <h2>Share your admission enquiry.</h2>
            <p>Submit the requested details and wait for a confirmation reference before considering your enquiry received. A reference appears only after the form receives a saved response.</p>
            <p className="contact-info-note">Please do not include sensitive information beyond the details requested in the form.</p>
          </div>

          <div className="contact-card">
            <h3>Admission enquiry</h3>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  )
}
