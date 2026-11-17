import { ArrowDownRight, ArrowRight } from 'lucide-react'
import HeroLearningWorld from '../components/HeroLearningWorld'
import EnquiryForm from '../components/EnquiryForm'

export default function HomePage() {
  return (
    <>
      <section className="hero-section launch-hero" id="home">
        <div className="container hero-grid launch-hero-grid">
          <div className="hero-copy">
            <p className="kicker">Seedstone School · Classes 1–8</p>
            <h1>
              A Next-Gen
              <span className="hero-heading-accent">Online Global School.</span>
            </h1>
            <p className="lead">At Seedstone School, we believe a child&apos;s education should build strong academic foundations without leaving their ambitions waiting for later.</p>
            {/* <p className="hero-class-focus">Primary (Classes 1–5) and Middle (Classes 6–8).</p> */}
            <div className="button-row">
              <a className="primary-button" href="#enquiry">Book a Demo <ArrowRight size={17} aria-hidden="true" /></a>
              <a className="secondary-button" href="#learning-approach">Explore Seedstone <ArrowDownRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
          <HeroLearningWorld />
        </div>
      </section>

      <section className="page-section about-seedstone" id="about">
        <div className="container about-seedstone-layout">
          <div className="about-seedstone-intro">
            <p className="kicker">About Seedstone School</p>
            <h2>What is Seedstone School?</h2>
          </div>
          <div className="about-seedstone-copy">
            <p>Seedstone School is a next-generation online global school for Classes 1–8, spanning Primary (Classes 1–5) and Middle (Classes 6–8).</p>
            <p>Our next-gen online school combines live teaching, a dedicated class mentor, structured learning and meaningful engagement to help students make academic progress while exploring what they aspire to do beyond the classroom.</p>
            <p>A less hectic schedule, no commute, and more room to explore, practise and grow—with the guidance, discipline and support every child needs.</p>
          </div>
        </div>
      </section>

      <section className="page-section editorial-statement-section" aria-labelledby="editorial-statement-title">
        <div className="container editorial-statement">
          <ul className="editorial-reframes" aria-label="What Seedstone School is not">
            <li>Not just online classes.</li>
            <li>Not just courses.</li>
            <li>Not just another classroom.</li>
          </ul>
          <h2 id="editorial-statement-title" className="editorial-statement-heading">
            <span>We are reimagining</span>
            <span className="editorial-statement-accent">The Way Children Learn.</span>
          </h2>
          {/* <p className="editorial-statement-support">A school experience that brings together structured learning, dedicated guidance and room for ambition.</p> */}
        </div>
      </section>

      {/* <section className="page-section launch-why">
        <div className="container">
          <SectionHeading
            eyebrow="Our approach"
            title="A Different Approach to Learning."
            description="A strong education does more than cover the syllabus. It gives children the guidance to learn well, the freedom to explore and the confidence to find their own path."
          />
          <ol className="theme-grid approach-principles-grid">
            {schoolingPrinciples.map(({ title, description, icon: Icon }, index) => (
              <li className="theme-card approach-principle-card" key={title}>
                <span className="learning-cycle-number">0{index + 1}</span>
                <span className="feature-icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section> */}


      {/* <section className="page-section ambition-section">
        <div className="container ambition-layout">
          <SectionHeading eyebrow="Room to grow" title="More Room for Ambition. Structure for Success." />
          <div className="ambition-copy">
            <p>A child’s day shouldn’t be so consumed by school and commuting that their own interests are left for whatever time remains.</p>
            <p>Long school days, travel and packed schedules can leave little room for sports practice, music lessons, creative pursuits or simply exploring something new.</p>
            <p>Seedstone offers a different approach. Our online learning model is designed to create more room in a child’s day while keeping academics structured through live classes, regular practice, assessments and dedicated guidance.</p>
            <p className="ambition-emphasis">Freedom to pursue what matters. Discipline to keep moving forward.</p>
            <p>Because making room for ambition isn’t about doing less with a child’s education. It’s about making room for more in their life.</p>
          </div>
        </div>
      </section> */}

      {/* <section className="page-section cream-section" id="learning-approach">
        <div className="container">
          <SectionHeading eyebrow="Learning approach" title="Learning with Purpose at Every Step." description="A flexible school experience works best when students have a clear learning path, consistent practice and the right support along the way." />
          <ol className="learning-cycle-grid launch-learning-grid">
            {learningPrinciples.map(({ title, description, icon: Icon }, index) => (
              <li className="learning-cycle-card" key={title}>
                <span className="learning-cycle-number">0{index + 1}</span>
                <span className="feature-icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section> */}

      {/* <section className="page-section launch-academics" id="academic-journey">
        <div className="container">
          <SectionHeading eyebrow="Academic structure" title="Our Academic Journey." description="Classes 1–8, across Primary and Middle." />
          <div className="class-pathway-grid launch-class-grid">
            {academicStages.map((stage) => (
              <article className="class-pathway-card" key={stage.classes}>
                <span className="class-pathway-range">{stage.classes}</span>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>  */}


      {/* <section className="page-section beyond-classroom-section">
        <div className="container">
          <SectionHeading
            eyebrow="A wider view of learning"
            title="Preparing for Life Beyond the Classroom."
            description="Education should help children understand their subjects and develop the confidence to apply what they know in the world around them."
          />
          <div className="theme-grid beyond-classroom-grid">
            {beyondClassroomAreas.map((area) => (
              <article className="theme-card beyond-classroom-card" key={area.title}>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section> */}

      <section className="page-section enquiry-section" id="enquiry">
        <div className="container enquiry-layout">
          <div className="enquiry-intro">
            <p className="kicker">Admissions · Classes 1–8</p>
            <h2>Admission Enquiry</h2>
            <p>Interested in Seedstone School? Share your details and our admissions team can connect with you.</p>
            <p className="enquiry-safety-note">Please share only the requested details. Your enquiry is received only after this form displays a confirmation reference.</p>
          </div>
          <div className="contact-card enquiry-card">
            <EnquiryForm />
          </div>
        </div>
      </section>


<section
  id="academic-journey"
  style={{
    position: "relative",
    overflow: "hidden",
    minHeight: "360px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "90px 24px",
    background: "#FFFFFF",
    isolation: "isolate",
  }}
>
  <div
    style={{
      maxWidth: "780px",
      animation: "seedstoneFade 1s ease-out both",
    }}
  >
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 18px",
        border: "1px solid #E5E9ED",
        borderRadius: "50px",
        background: "#FFFFFF",
        color: "#10364D",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "2px",
        marginBottom: "28px",
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#C81927",
          animation: "seedstonePulse 2.2s ease-in-out infinite",
          boxShadow: "0 0 0 0 rgba(200, 25, 39, 0.4)",
        }}
      />
      GOING LIVE SOON
    </div>

    <h2
      style={{
        fontSize: "clamp(34px, 5.5vw, 62px)",
        lineHeight: 1.15,
        letterSpacing: "-2px",
        fontWeight: 800,
        color: "#10364D",
        margin: "0 0 22px",
      }}
    >
      A Smarter Way to Learn
      <br />
      <span style={{ color: "#C81927" }}>
        Is Almost Here.
      </span>
    </h2>

    <p
      style={{
        maxWidth: "580px",
        margin: "0 auto",
        fontSize: "clamp(15px, 2vw, 19px)",
        lineHeight: 1.8,
        color: "#687B89",
      }}
    >
      We’re preparing a more flexible, guided learning experience
      for children to grow, explore and thrive with confidence.
    </p>

    <div
      style={{
        width: "58px",
        height: "4px",
        borderRadius: "10px",
        background: "#C81927",
        margin: "30px auto 0",
        animation: "seedstoneLine 1.2s ease-out both",
      }}
    />
  </div>

  <style>{`
    @keyframes seedstoneFade {
      from { opacity: 0; transform: translateY(22px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes seedstonePulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.45; transform: scale(0.8); }
    }

    @keyframes seedstoneLine {
      from { width: 0; opacity: 0; }
      to { width: 58px; opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      section *, section *::before, section *::after {
        animation: none !important;
      }
    }
  `}</style>
</section>



      {/* <section className="coming-soon-section" aria-labelledby="coming-soon-title">
        <div className="container">
          <div className="coming-soon-panel">
            <div>
              <p className="kicker">Coming soon</p>
              <h1 id="coming-soon-title">Discover a school experience designed to give every child more room to learn, explore and grow..</h1>
            </div>
            <a className="secondary-button coming-soon-button" href="#enquiry">Enquire Now <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </section> */}
    </>
  )
}
