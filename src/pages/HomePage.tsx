import { ArrowDownRight, ArrowRight, BookOpen, Compass, Lightbulb, RefreshCw, ShieldCheck, Users } from 'lucide-react'
import HeroLearningWorld from '../components/HeroLearningWorld'
import EnquiryForm from '../components/EnquiryForm'
import SectionHeading from '../components/SectionHeading'

const schoolingPrinciples = [
  {
    title: 'Two Teachers, One Learning Journey',
    description: 'Our two-teacher model brings together subject teaching and dedicated class mentorship to support each student’s learning journey.',
    icon: Users,
  },
  {
    title: 'Freedom, with Structure',
    description: 'Children shouldn’t have to put their interests on hold to keep up with school. Our online model creates more room for sports, arts, hobbies and other ambitions while maintaining a structured academic routine.',
    icon: Compass,
  },
  {
    title: 'Safety and Support',
    description: 'A child’s learning environment should offer reassurance to parents and support to students. We aim to create a learning experience with clear expectations, responsible guidance and safeguards.',
    icon: ShieldCheck,
  },
  {
    title: 'Learning, Connection and Community',
    description: 'School should be about more than lessons. Through clubs, interactive activities and opportunities to learn with peers, students can explore interests, exchange ideas and experience the joy of learning together.',
    icon: Lightbulb,
  },
]

const learningPrinciples = [
  { title: 'Learn in Real Time', description: 'Build conceptual understanding through live, interactive lessons that encourage questions and active participation.', icon: BookOpen },
  { title: 'Practise and Apply', description: 'Strengthen understanding through handwritten work, problem-solving, activities and projects that make learning an active process.', icon: Compass },
  { title: 'Get Guided Support', description: 'Work through challenges with teachers and receive dedicated follow-up from your class mentor to address learning gaps and stay on track.', icon: RefreshCw },
  { title: 'Track Your Progress', description: 'Regular assessments, feedback and progress reports help students understand their growth and help parents see where additional support may be needed.', icon: Lightbulb },
]

const academicStages = [
  {
    classes: 'Classes 1–5',
    title: 'Primary',
    description: 'Build foundational knowledge, curiosity, and effective learning habits.',
  },
  {
    classes: 'Classes 6–8',
    title: 'Middle',
    description: 'Strengthen conceptual understanding and develop independent learning skills.',
  },
]

const beyondClassroomAreas = [
  {
    title: 'STEM and Problem-Solving',
    description: 'Explore scientific thinking, experimentation and real-world applications.',
  },
  {
    title: 'Financial Literacy',
    description: 'Develop an understanding of money, saving, budgeting and everyday financial choices.',
  },
  {
    title: 'Entrepreneurship and Innovation',
    description: 'Learn to identify problems, develop ideas and think creatively about solutions.',
  },
  {
    title: 'Future-Ready Skills',
    description: 'Build communication, critical thinking, collaboration and decision-making skills.',
  },
  {
    title: 'Clubs and Interest-Based Learning',
    description: 'Discover interests, explore new ideas and learn alongside peers beyond the regular curriculum.',
  },
]

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
            <p className="hero-class-focus">Primary (Classes 1–5) and Middle (Classes 6–8).</p>
            <div className="button-row">
              <a className="primary-button" href="#enquiry">Admissions Enquiry <ArrowRight size={17} aria-hidden="true" /></a>
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

      <section className="page-section launch-why">
        <div className="container">
          <SectionHeading
            eyebrow="Our approach"
            title="A Different Approach to Schooling."
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
          <div className="approach-association">
            Seedstone School, in association with PhysicsWallah.
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
          <p className="editorial-statement-support">A school experience that brings together structured learning, dedicated guidance and room for ambition.</p>
        </div>
      </section>

      <section className="page-section ambition-section">
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
      </section>

      <section className="page-section cream-section" id="learning-approach">
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
      </section>

      <section className="page-section launch-academics" id="academic-journey">
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
      </section>

      <section className="page-section beyond-classroom-section">
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
      </section>

      <section className="page-section enquiry-section" id="enquiry">
        <div className="container enquiry-layout">
          <div className="enquiry-intro">
            <p className="kicker">Admissions · Classes 1–8</p>
            <h2>Admission Enquiry</h2>
            <p>Interested in Seedstone School? Share your details and our admissions team can connect with you.</p>
            <p className="enquiry-safety-note">The admission enquiry service is not connected yet. Submissions are not currently saved or sent; please wait until the connection is enabled before entering personal details.</p>
          </div>
          <div className="contact-card enquiry-card">
            <EnquiryForm />
          </div>
        </div>
      </section>

      <section className="coming-soon-section" aria-labelledby="coming-soon-title">
        <div className="container">
          <div className="coming-soon-panel">
            <div>
              <p className="kicker">Coming soon</p>
              <h2 id="coming-soon-title">A new Seedstone School website is coming soon.</h2>
            </div>
            <a className="secondary-button coming-soon-button" href="#enquiry">Enquire Now <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </>
  )
}
