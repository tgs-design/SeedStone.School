import { ArrowRight, ChevronDown, ExternalLink, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { curriculumPathways, curriculumStageDetails, curriculumResearchVerifiedOn } from '../data/curriculumResearch'
import { curriculumClasses, primaryClassBands } from '../data/siteData'

const curriculumNotice = 'These are independent curriculum references, not Seedstone programme claims. Seedstone affiliation, authorisation, curriculum mapping, examination arrangements, subjects, and admission availability are unconfirmed.'

export default function CurriculumPage() {
  const [selectedStage, setSelectedStage] = useState(curriculumStageDetails[0].id)
  const stage = curriculumStageDetails.find((item) => item.id === selectedStage) ?? curriculumStageDetails[0]

  return (
    <>
      <section className="page-section inner-hero curriculum-hero">
        <div className="container narrow-section">
          <p className="kicker">Curriculum & pathways</p>
          <h1>Compare learning pathways. Ask the right questions.</h1>
          <p>Explore broad class-stage guidance and official curriculum references. This page is for research and orientation—not an announcement that Seedstone offers or is authorised for any listed pathway.</p>
          <a className="inline-link" href="#pathway-comparison">Compare pathways <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="page-section curriculum-status-section">
        <div className="container">
          <div className="curriculum-status-note" role="note">
            <strong>Pathway and school status: awaiting confirmation</strong>
            <p>{curriculumNotice}</p>
          </div>
          <nav className="curriculum-jump-links" aria-label="Curriculum class groups">
            {primaryClassBands.map((band) => <a href={`#${band.id}`} key={band.id}>{band.title}<span>{band.classes}</span></a>)}
          </nav>
        </div>
      </section>

      <section className="page-section" id="pathway-comparison">
        <div className="container">
          <SectionHeading eyebrow="Four pathway references" title="Understand the route before choosing one" description="A high-level comparison drawn from official awarding-body and curriculum sources. Requirements vary by current session, subject, school and examination centre." />
          <div className="pathway-card-grid">
            {curriculumPathways.map((pathway) => (
              <article className="pathway-reference-card" key={pathway.id}>
                <div className="pathway-card-title">
                  <span className="feature-icon"><GraduationCap size={21} aria-hidden="true" /></span>
                  <span className="status-label">School offering: unconfirmed</span>
                </div>
                <h3>{pathway.name}</h3>
                <dl>
                  <div><dt>Stages</dt><dd>{pathway.stage}</dd></div>
                  <div><dt>Typical learner context</dt><dd>{pathway.typicalLearner}</dd></div>
                  <div><dt>Subjects & learning</dt><dd>{pathway.subjects}</dd></div>
                  <div><dt>Assessment</dt><dd>{pathway.assessment}</dd></div>
                </dl>
                <p className="pathway-overview">{pathway.overview}</p>
                <p><strong>May be worth exploring if:</strong> {pathway.suitability}</p>
                <p className="pathway-school-status">{pathway.seedstoneStatus}</p>
                <details className="official-sources">
                  <summary>Official source links <ExternalLink size={16} aria-hidden="true" /></summary>
                  <ul>
                    {pathway.sources.map((source) => (
                      <li key={source.url}>
                        <a href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={14} aria-hidden="true" /></a>
                      </li>
                    ))}
                  </ul>
                </details>
              </article>
            ))}
          </div>
          <div className="curriculum-table-wrap" role="region" aria-label="Scrollable curriculum pathway comparison table" tabIndex={0}>
            <table className="pathway-comparison-table">
              <caption>At-a-glance pathway comparison. Confirm all current requirements with the official provider.</caption>
              <thead>
                <tr>
                  <th scope="col">Reference</th>
                  {curriculumPathways.map((pathway) => <th scope="col" key={pathway.id}>{pathway.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">Typical stages</th>{curriculumPathways.map((pathway) => <td key={pathway.id}>{pathway.stage}</td>)}</tr>
                <tr><th scope="row">Learning / subject structure</th>{curriculumPathways.map((pathway) => <td key={pathway.id}>{pathway.subjects}</td>)}</tr>
                <tr><th scope="row">Assessment context</th>{curriculumPathways.map((pathway) => <td key={pathway.id}>{pathway.assessment}</td>)}</tr>
                <tr><th scope="row">Seedstone status</th>{curriculumPathways.map((pathway) => <td key={pathway.id}>{pathway.seedstoneStatus}</td>)}</tr>
              </tbody>
            </table>
          </div>
          <p className="research-note"><strong>Research note · last checked {curriculumResearchVerifiedOn}.</strong> CBSE’s curriculum archive includes session-specific publications; the curriculum landing information available for this review was labelled 2019–20, so no current class-wise CBSE syllabus is reproduced here. Current-session CBSE details, NCERT/NCF documents, NIOS Senior Secondary rules, subject specifications and local centre arrangements should be rechecked before a family makes a decision. The source list and evidence notes are maintained in <code>src/data/curriculumResearch.ts</code>.</p>
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container">
          <SectionHeading eyebrow="Explore by class stage" title="What might matter at each stage?" description="Select a stage for general planning prompts. This selector is guidance only; it is not an approved Seedstone syllabus or subject list." />
          <div className="stage-selector" role="group" aria-label="Select a class stage">
            {primaryClassBands.map((band) => (
              <button type="button" key={band.id} className={selectedStage === band.id ? 'stage-selector-button active' : 'stage-selector-button'} aria-pressed={selectedStage === band.id} onClick={() => setSelectedStage(band.id)}>
                <strong>{band.title}</strong><span>{band.classes}</span>
              </button>
            ))}
          </div>
          <article className="selected-stage-panel" aria-live="polite">
            <div className="selected-stage-heading">
              <div><p className="kicker">Planning reference · {primaryClassBands.find((band) => band.id === stage.id)?.classes}</p><h3>{primaryClassBands.find((band) => band.id === stage.id)?.title}</h3></div>
              <span className="status-label">Proposed guidance · not confirmed</span>
            </div>
            <dl className="stage-details">
              <div><dt>Possible learning priorities</dt><dd>{stage.priorities}</dd></div>
              <div><dt>Subject areas</dt><dd>{stage.subjects}</dd></div>
              <div><dt>Practice & assessment</dt><dd>{stage.assessment}</dd></div>
              <div><dt>Possible enrichment</dt><dd>{stage.enrichment}</dd></div>
              <div><dt>Reference status</dt><dd>{stage.reference}</dd></div>
            </dl>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="Class-wise orientation" title="Review the proposed class structure" description="All 12 class accordions are retained. Class-specific subjects, chapters, outcomes, assessments, teaching arrangements and admissions are awaiting confirmation." />
          {primaryClassBands.map((band) => (
            <section className="curriculum-band" id={band.id} key={band.id}>
              <div className="curriculum-band-heading">
                <div><p className="kicker">{band.title}</p><h2>{band.classes}</h2></div>
                <span className="status-label">Admissions: awaiting confirmation</span>
              </div>
              <div className="curriculum-class-list">
                {curriculumClasses.filter((item) => item.bandId === band.id).map((classItem) => (
                  <details className="curriculum-class" id={classItem.id} key={classItem.id}>
                    <summary>
                      <span><strong>{classItem.label}</strong><small>{classItem.overview}</small></span>
                      <span className="curriculum-class-status">Awaiting confirmation <ChevronDown size={18} aria-hidden="true" /></span>
                    </summary>
                    <div className="curriculum-class-content">
                      <p><strong>Class overview</strong><span>{classItem.overview}</span></p>
                      <p><strong>Subjects and chapters</strong><span>No approved class-wise subject list, syllabus, or chapter sequence is published. See the pathway references above for general context only.</span></p>
                      <p><strong>Learning objectives</strong><span>Class-specific learning objectives are awaiting academic confirmation.</span></p>
                      <p><strong>Practice and assessment</strong><span>Learning activities, assessment format, and schedule are awaiting academic confirmation.</span></p>
                      <p><strong>Projects and enrichment</strong><span>Illustrative beyond-academics ideas are available on the <Link to="/activities">activities page</Link>; no activity is confirmed as an active programme.</span></p>
                      <p><strong>Approval and admissions</strong><span>Curriculum mapping, affiliation, examination registration, certification, and class availability are unconfirmed. Do not infer approval or admission availability.</span></p>
                      <Link to="/contact" className="inline-link">Ask about {classItem.label} <ArrowRight size={16} aria-hidden="true" /></Link>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div><p className="kicker">Curriculum enquiry</p><h2>Need to ask about a pathway or class?</h2><p>Prepare a question for the Seedstone team. The form is a browser-only prototype and will not save or send your details.</p></div>
          <button type="button" className="primary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Prepare an enquiry</button>
        </div>
      </section>
    </>
  )
}
