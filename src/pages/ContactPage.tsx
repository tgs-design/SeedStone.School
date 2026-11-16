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
            <h2>This form is not connected to the admissions team.</h2>
            <p>You can check a general question in this browser, but it will not be sent or saved. Verified contact details and a live enquiry service are not available yet.</p>
            <p className="contact-info-note">Please do not enter a child’s name, contact details, health information, or other identifying details.</p>
          </div>

          <div className="contact-card">
            <h3>Prepare a general question</h3>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  )
}
