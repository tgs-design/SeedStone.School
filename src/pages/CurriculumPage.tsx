import { ArrowRight, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { curriculumReferenceSources, curriculumResearchVerifiedOn, curriculumStageDetails } from '../data/curriculumResearch'
import { curriculumClasses, primaryClassBands } from '../data/siteData'

const curriculumNotice = 'Seedstone’s current focus is Classes 1–8: Primary (Classes 1–5) and Middle (Classes 6–8). Class-wise subjects, syllabus, assessments, teaching model, and admissions are still being confirmed. No board affiliation or examination arrangement is claimed.'

export default function CurriculumPage() {
  const [selectedStage, setSelectedStage] = useState(curriculumStageDetails[0].id)
  const stage = curriculumStageDetails.find((item) => item.id === selectedStage) ?? curriculumStageDetails[0]
  const selectedBand = primaryClassBands.find((band) => band.id === stage.id) ?? primaryClassBands[0]

  return (
    <>
      <section className="page-section inner-hero curriculum-hero">
        <div className="container narrow-section">
          <p className="kicker">Classes 1–8 · Curriculum</p>
          <h1>A thoughtful foundation for every learning stage.</h1>
          <p>Seedstone is currently focused on Classes 1–8. Explore the Primary and Middle stages, class-wise status, and general learning-area references—without implying an unconfirmed syllabus or board affiliation.</p>
          <Link className="inline-link" to="/contact">Ask about Classes 1–8 <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="page-section curriculum-status-section">
        <div className="container">
          <div className="curriculum-status-note" role="note">
            <strong>Current focus: Classes 1–8</strong>
            <p>{curriculumNotice}</p>
          </div>
          <nav className="curriculum-jump-links" aria-label="Current class groups">
            {primaryClassBands.map((band) => <a href={`#${band.id}`} key={band.id}>{band.title}<span>{band.classes}</span></a>)}
          </nav>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container">
          <SectionHeading eyebrow="Two learning stages" title="A current focus on Primary and Middle learning" description="These are broad descriptions of the intended learning approach. They are not confirmed services, subject lists, or formal learning outcomes." />
          <div className="stage-selector" role="group" aria-label="Select a current learning stage">
            {primaryClassBands.map((band) => (
              <button type="button" key={band.id} className={selectedStage === band.id ? 'stage-selector-button active' : 'stage-selector-button'} aria-pressed={selectedStage === band.id} onClick={() => setSelectedStage(band.id)}>
                <strong>{band.title}</strong><span>{band.classes}</span>
              </button>
            ))}
          </div>
          <article className="selected-stage-panel" aria-live="polite">
            <div className="selected-stage-heading">
              <div><p className="kicker">{selectedBand.classes}</p><h3>{selectedBand.title}</h3></div>
              <span className="status-label">Current Seedstone focus · details in development</span>
            </div>
            <dl className="stage-details">
              <div><dt>Learning priorities</dt><dd>{stage.priorities}</dd></div>
              <div><dt>Learning areas</dt><dd>{stage.subjects}</dd></div>
              <div><dt>Illustrative outcomes</dt><dd>{stage.outcomes}</dd></div>
              <div><dt>Possible learning activities</dt><dd>{stage.activities}</dd></div>
            </dl>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="Class-wise exploration" title="Classes 1–8" description="The class structure below is for orientation. Subject lists, textbook chapters, assessment arrangements, and admissions details are not yet published." />
          {primaryClassBands.map((band) => (
            <section className="curriculum-band" id={band.id} key={band.id}>
              <div className="curriculum-band-heading">
                <div><p className="kicker">Current class group</p><h2>{band.title} · {band.classes}</h2></div>
                <span className="status-label">Class details: awaiting academic confirmation</span>
              </div>
              <div className="curriculum-class-list">
                {curriculumClasses.filter((item) => item.bandId === band.id).map((classItem) => (
                  <details className="curriculum-class" id={classItem.id} key={classItem.id}>
                    <summary>
                      <span><strong>{classItem.label}</strong><small>{classItem.overview}</small></span>
                      <span className="curriculum-class-status">Details in development <span aria-hidden="true">⌄</span></span>
                    </summary>
                    <div className="curriculum-class-content">
                      <p><strong>Learning approach</strong><span>Seedstone’s proposed cycle is to explore a question, build understanding, practise, and reflect. Class-specific teaching plans are awaiting academic approval.</span></p>
                      <p><strong>Subjects and chapters</strong><span>No approved class-wise subject list, prescribed textbook, syllabus, or chapter sequence is published. The general learning areas above are illustrative only.</span></p>
                      <p><strong>Learning outcomes and activities</strong><span>Class-specific outcomes, assignments, activities, and learning resources are awaiting confirmation. Browse <Link to="/activities">illustrative activity ideas</Link>, which are not confirmed as delivered programmes.</span></p>
                      <p><strong>Assessment and programme status</strong><span>Assessment format, board affiliation, examination registration, certification, and class-specific admissions availability have not been confirmed.</span></p>
                      <Link to="/contact" className="inline-link">Ask about {classItem.label} <ArrowRight size={16} aria-hidden="true" /></Link>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container two-column curriculum-references">
          <div>
            <SectionHeading eyebrow="Educational references" title="Background reading, not a Seedstone affiliation." />
            <p>These official Indian curriculum resources may help families understand broad educational frameworks. Seedstone has not claimed CBSE affiliation, NCERT approval, or a formally mapped syllabus. The linked publications may be session-specific; check the current source directly.</p>
            <p className="research-note"><strong>Links reviewed {curriculumResearchVerifiedOn}.</strong> Current class-wise curriculum details still require academic review and owner approval.</p>
          </div>
          <ul className="curriculum-reference-list">
            {curriculumReferenceSources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={15} aria-hidden="true" /></a>
                <p>{source.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div><p className="kicker">Classes 1–8 enquiry</p><h2>Have a question about the current focus?</h2><p>The form validates in this browser only. It will not save or send your details.</p></div>
          <button type="button" className="primary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Prepare an enquiry</button>
        </div>
      </section>
    </>
  )
}
