import { ArrowRight, BookOpen, Brush, Filter, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Accordion from '../components/Accordion'
import SectionHeading from '../components/SectionHeading'
import { activityBands, activityCalendar, activityFaqs, enrichmentActivities } from '../data/activities'

const categoryIcons: Record<string, typeof Sparkles> = {
  'Art & design': Brush,
  'STEM & making': Sparkles,
  'Reading & communication': BookOpen,
}

export default function ActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All categories')
  const [selectedBand, setSelectedBand] = useState('All class groups')
  const categories = [...new Set(enrichmentActivities.map((activity) => activity.category))]
  const filteredActivities = useMemo(() => enrichmentActivities.filter((activity) => {
    const categoryMatches = selectedCategory === 'All categories' || activity.category === selectedCategory
    const bandMatches = selectedBand === 'All class groups' || activity.bands.some((band) => band === selectedBand)
    return categoryMatches && bandMatches
  }), [selectedBand, selectedCategory])

  return (
    <>
      <section className="page-section inner-hero activities-hero">
        <div className="container narrow-section">
          <p className="kicker">Beyond academics</p>
          <h1>Make room for interests, ideas, and shared experiences.</h1>
          <p>Explore illustrative activity ideas for Seedstone’s current Classes 1–8 focus across creative, practical, and personal-development themes. Nothing on this page is a confirmed club, class, schedule, or school service.</p>
          <a className="inline-link" href="#activity-explorer">Explore activity ideas <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="page-section activity-safety-section">
        <div className="container activity-safety-note" role="note">
          <ShieldCheck size={23} aria-hidden="true" />
          <div>
            <strong>Illustrative ideas · awaiting school confirmation</strong>
            <p>Materials, duration, and outcomes below are planning prompts—not delivery commitments. They are not a complete risk assessment. Any activity needs age-appropriate adaptation, accessibility planning, suitable adult supervision, safeguarding procedures, and school approval.</p>
          </div>
        </div>
      </section>

      <section className="page-section" id="activity-explorer">
        <div className="container">
          <SectionHeading eyebrow="Activity explorer" title="Find ideas by interest and class group" description="Choose one or both filters. Every card remains a proposed idea, not a confirmed offering." />
          <div className="activity-filter-panel">
            <span className="activity-filter-icon"><Filter size={19} aria-hidden="true" /> Filter ideas</span>
            <div className="activity-filter-controls">
              <label htmlFor="activity-category">Category
                <select id="activity-category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                  <option>All categories</option>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label htmlFor="activity-band">Class group
                <select id="activity-band" value={selectedBand} onChange={(event) => setSelectedBand(event.target.value)}>
                  <option>All class groups</option>
                  {activityBands.map((band) => <option value={band.id} key={band.id}>{band.label}</option>)}
                </select>
              </label>
              <button type="button" className="secondary-button" onClick={() => { setSelectedCategory('All categories'); setSelectedBand('All class groups') }}>Clear filters</button>
            </div>
          </div>
          <p className="activity-result-count" aria-live="polite">{filteredActivities.length} illustrative {filteredActivities.length === 1 ? 'idea' : 'ideas'}</p>
          {filteredActivities.length > 0 ? (
            <div className="activity-card-grid">
              {filteredActivities.map((activity) => {
                const Icon = categoryIcons[activity.category] ?? Sparkles
                return (
                  <article className="activity-idea-card" key={activity.id}>
                    <div className="activity-card-topline">
                      <span className="feature-icon"><Icon size={20} aria-hidden="true" /></span>
                      <span className="activity-category">{activity.category}</span>
                    </div>
                    <h3>{activity.title}</h3>
                    <p className="activity-card-status">Illustrative idea · not confirmed</p>
                    <dl className="activity-meta">
                      <div><dt>For</dt><dd>{activity.bands.map((id) => activityBands.find((band) => band.id === id)?.label.replace(' · ', ', ')).join(' · ')}</dd></div>
                      <div><dt>Format</dt><dd>{activity.format}</dd></div>
                      <div><dt>Example duration</dt><dd>{activity.duration}</dd></div>
                      <div><dt>Materials</dt><dd>{activity.materials}</dd></div>
                    </dl>
                    <div className="activity-outcomes">
                      <h4>Possible learning outcomes</h4>
                      <ul>{activity.learningOutcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
                    </div>
                    <p className="activity-card-safety"><strong>Safety & access:</strong> {activity.safety}</p>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-state" role="status"><h3>No activity ideas match those filters.</h3><p>Clear one or both filters to see more ideas.</p></div>
          )}
        </div>
      </section>

      <section className="page-section cream-section">
        <div className="container">
          <SectionHeading eyebrow="Illustrative calendar" title="A sample sequence, not a school schedule" description="This four-part outline only shows one possible way to group themes. It does not confirm dates, frequency, terms, staffing, or availability." align="center" />
          <ol className="activity-calendar">
            {activityCalendar.map((item, index) => (
              <li key={item.month}>
                <span className="activity-calendar-number">0{index + 1}</span>
                <div><p className="kicker">{item.month}</p><h3>{item.idea}</h3><small>{item.note}</small></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-section">
        <div className="container activity-faq-layout">
          <SectionHeading eyebrow="Before you plan" title="Common questions" description="Details remain subject to school approval and confirmation." />
          <div className="accordion-list">
            {activityFaqs.map((faq) => <Accordion key={faq.question} title={faq.question} content={<p>{faq.answer}</p>} />)}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section small-cta">
        <div className="container final-cta-box">
          <div><p className="kicker">Ask about enrichment</p><h2>Have an activity idea or question?</h2><p>The enquiry form is a browser-only prototype and will not save or send your details.</p></div>
          <button type="button" className="primary-button" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))}>Prepare an enquiry</button>
        </div>
      </section>

      <section className="page-section">
        <div className="container two-column activity-curriculum-link">
          <SectionHeading eyebrow="Academic learning" title="Looking for class-wise curriculum references?" />
          <p>Explore the current Primary (Classes 1–5) and Middle (Classes 6–8) focus, class-wise status, and broad educational references. Specific subjects and syllabi await confirmation.<br /><Link to="/curriculum" className="inline-link">Explore Classes 1–8 curriculum <ArrowRight size={16} aria-hidden="true" /></Link></p>
        </div>
      </section>
    </>
  )
}
