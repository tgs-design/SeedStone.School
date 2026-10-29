import { ArrowDownRight, ArrowRight, BookOpen, Compass, HeartHandshake, Lightbulb, RefreshCw, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Accordion from '../components/Accordion'
import HeroLearningWorld from '../components/HeroLearningWorld'
import SectionHeading from '../components/SectionHeading'
import { blogPosts, faqs, learningExperienceThemes, primaryClassBands } from '../data/siteData'

const learningSteps = [
  { title: 'Explore', description: 'Begin with questions, interests, and the world around you.', icon: Compass },
  { title: 'Learn', description: 'Build understanding by exploring the ideas behind a topic.', icon: BookOpen },
  { title: 'Practise', description: 'Try out new ideas and revisit them with purpose.', icon: RefreshCw },
  { title: 'Reflect', description: 'Notice what makes sense and consider a next step.', icon: Lightbulb },
]

const coreThemes = [
  { title: 'Live, Interactive Classes', description: 'A proposed format for learning together through explanation and discussion.', icon: BookOpen },
  { title: 'Individual Attention', description: 'An intended approach that recognises each learner’s questions and pace.', icon: HeartHandshake },
  { title: 'Future-Ready Skills', description: 'Potential opportunities to practise applying ideas and exploring new questions.', icon: Sparkles },
  { title: 'A Supportive Community', description: 'A guiding intention to make room for encouragement, care, and connection.', icon: Compass },
]

const admissionsSteps = [
  'Explore Seedstone and choose a class to ask about',
  'Review the proposed curriculum and prepare questions',
  'Submit an enquiry for discussion',
  'Discuss eligibility, programme details, and next steps if confirmed',
]

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="kicker">CURRENT FOCUS · CLASSES 1–8</p>
            <h1>We're Reimagining What School Can Be.</h1>
            <p className="lead">A school that gives every child room to discover their own way of learning, with a current focus on Classes 1–8.</p>
            <div className="button-row">
              <a className="primary-button" href="#learning-works">Explore Learning <ArrowDownRight size={17} /></a>
              <button type="button" className="secondary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Inquire Now</button>
            </div>
          </div>
          <HeroLearningWorld />
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="Core learning benefits" title="A thoughtful experience, built around the learner" description="These are proposed benefits and guiding intentions, not confirmation that specific services are currently available." />
          <div className="theme-grid">
            {coreThemes.map(({ title, description, icon: Icon }) => (
              <article className="theme-card" key={title}>
                <span className="feature-icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section cream-section" id="learning-works">
        <div className="container">
          <SectionHeading eyebrow="The learning experience" title="Explore, learn, practise, reflect." description="A proposed learning cycle, not a guarantee of specific services or outcomes." align="center" />
          <ol className="learning-cycle-grid">
            {learningSteps.map(({ title, description, icon: Icon }, index) => (
              <li className="learning-cycle-card" key={title}>
                <span className="learning-cycle-number">0{index + 1}</span>
                <span className="learning-cycle-icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-section class-groups-section">
        <div className="container">
          <SectionHeading eyebrow="Current class focus" title="Classes 1–8, across two learning stages" description="Seedstone is currently focused on Primary (Classes 1–5) and Middle (Classes 6–8). Subject details and class-specific admission availability are still being confirmed." />
          <div className="class-pathway-grid">
            {primaryClassBands.map((band) => (
              <Link className="class-pathway-card" to={`/curriculum#${band.id}`} key={band.id}>
                <span className="class-pathway-range">{band.classes}</span>
                <h3>{band.title}</h3>
                <p>{band.description}</p>
                <span className="status-label">Current focus · details in development</span>
                <span className="inline-link">Explore classes <ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section beyond-section">
        <div className="container">
          <SectionHeading eyebrow="Learning beyond the textbook" title="Space for interests, ideas, and practical questions" description="These themes are ideas to explore, not confirmed courses or available services." />
          <div className="interest-list">
            {learningExperienceThemes.slice(2).flatMap((theme) => theme.examples.map((example) => (
              <article className="interest-item" key={example}>
                <h3>{example}</h3>
                <p>{theme.status}. Details and availability await confirmation.</p>
              </article>
            )))}
          </div>
          <Link to="/activities" className="inline-link">Explore illustrative activity ideas <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="page-section parent-partnership-section">
        <div className="container parent-partnership">
          <span className="partnership-icon"><HeartHandshake size={26} aria-hidden="true" /></span>
          <div>
            <p className="kicker">Student progress and parent partnership</p>
            <h2>Clear communication should be part of the learning experience.</h2>
            <p>Learning goals, purposeful practice, thoughtful feedback, and regular progress reviews can help students reflect on their learning and give families a clearer basis for conversation. These systems are not connected to school data in this prototype.</p>
          </div>
          <Link to="/login" className="secondary-button">Explore the portal demo</Link>
        </div>
      </section>

      <section className="page-section journey-section">
        <div className="container">
          <SectionHeading eyebrow="Admissions journey" title="Start with a conversation, not an assumption." description="Only an enquiry prototype is available. Counselling, eligibility, demonstrations, documentation, fees, payment, batch assignment, and onboarding are awaiting confirmation." align="center" />
          <ol className="admissions-journey">
            {admissionsSteps.map((step, index) => (
              <li key={step}><span>0{index + 1}</span><p>{step}</p></li>
            ))}
          </ol>
          <p className="journey-disclaimer">No application, admission, or payment is made through this website.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-heading-row">
            <SectionHeading eyebrow="From the Seedstone journal" title="Ideas for curious families" description="These sample articles are drafts and have not been approved for publication." />
            <Link to="/blogs" className="inline-link">All articles <ArrowRight size={16} /></Link>
          </div>
          <div className="blog-grid">
            {blogPosts.slice(0, 3).map((post) => (
              <article className="blog-card" key={post.id}>
                <div className="blog-card-body">
                  <span className="blog-tag">Draft article</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-foot"><span>{post.readTime}</span><Link to={`/blogs/${post.id}`}>Read draft</Link></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section cream-section faq-section">
        <div className="container faq-layout">
          <div>
            <p className="kicker">Frequently asked questions</p>
            <h2>Clear answers, including what’s still to be confirmed.</h2>
            <p>Have another question? The enquiry form is available, though it is not connected to a live admissions system.</p>
            <button type="button" className="secondary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Ask a question</button>
          </div>
          <div className="accordion-list">
            {faqs.map((faq) => <Accordion key={faq.question} title={faq.question} content={<p>{faq.answer}</p>} />)}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section">
        <div className="container final-cta-box">
          <div>
            <p className="kicker">HAVE QUESTIONS?</p>
            <h2>Let’s start the conversation.</h2>
            <p>Share a few details and start exploring whether Seedstone is the right fit for your child. This form is a frontend prototype and does not save or send your information.</p>
          </div>
          <div className="enquiry-actions">
            <button type="button" className="primary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Inquire Now</button>
            <Link to="/curriculum" className="secondary-button">Explore the Curriculum <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
