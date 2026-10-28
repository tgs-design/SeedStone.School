import { ArrowDownRight, ArrowRight, Award, BookOpen, Check, ChevronRight, CircleHelp, ClipboardCheck, FileText, GraduationCap, LayoutDashboard, LogOut, Menu, Search, Settings, ShieldAlert, Sparkles, Users, X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDemoState } from './useDemoState'
import { demoRoleLabels } from './demoTypes'
import type { DemoRole, EnquiryStatus } from './demoTypes'

type PortalLink = { label: string; path: string; icon: typeof LayoutDashboard }

const roleLinks: Record<DemoRole, PortalLink[]> = {
  student: [
    { label: 'My learning', path: '/', icon: LayoutDashboard },
    { label: 'Learning journey', path: '/journey', icon: ArrowDownRight },
    { label: 'Activity', path: '/activity', icon: BookOpen },
    { label: 'Achievements', path: '/achievements', icon: Award },
    { label: 'Profile', path: '/profile', icon: Users },
  ],
  parent: [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: "Child's learning", path: '/child', icon: BookOpen },
    { label: 'Progress', path: '/progress', icon: ArrowDownRight },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Support', path: '/support', icon: CircleHelp },
    { label: 'Profile', path: '/profile', icon: Users },
  ],
  teacher: [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Classes', path: '/classes', icon: GraduationCap },
    { label: 'Students', path: '/students', icon: Users },
    { label: 'Learning activities', path: '/activities', icon: BookOpen },
    { label: 'Submissions & feedback', path: '/submissions', icon: ClipboardCheck },
    { label: 'Profile', path: '/profile', icon: Users },
  ],
  counsellor: [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Enquiries', path: '/enquiries', icon: FileText },
    { label: 'Follow-ups', path: '/follow-ups', icon: ArrowDownRight },
    { label: 'Notes', path: '/notes', icon: BookOpen },
    { label: 'Profile', path: '/profile', icon: Users },
  ],
  admin: [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Users', path: '/users', icon: Users },
    { label: 'Students & parents', path: '/students-parents', icon: GraduationCap },
    { label: 'Teachers', path: '/teachers', icon: Users },
    { label: 'Classes', path: '/classes', icon: BookOpen },
    { label: 'Learning content', path: '/content', icon: FileText },
    { label: 'Enquiries', path: '/enquiries', icon: ClipboardCheck },
    { label: 'Reports', path: '/reports', icon: ArrowDownRight },
    { label: 'Settings', path: '/settings', icon: Settings },
  ],
}

const learningStages = ['Discover', 'Learn', 'Practise', 'Apply', 'Reflect']
const activityId = 'pattern-detective'
const submissions = [
  { id: 'submission-1', student: 'Aarav Mehta (sample)', activity: 'Pattern detective', answer: '32' },
  { id: 'submission-2', student: 'Ishaan Kapoor (sample)', activity: 'Pattern detective', answer: '32' },
]

function LinkButton({ to, children, secondary = false }: { to: string; children: ReactNode; secondary?: boolean }) {
  return <Link className={secondary ? 'secondary-button' : 'primary-button'} to={to}>{children}</Link>
}

function DemoNotice({ children = 'Fictional demo content. No real student, family, or school records are shown.' }: { children?: ReactNode }) {
  return <p className="portal-demo-notice"><ShieldAlert size={16} aria-hidden="true" />{children}</p>
}

function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="portal-page-title"><p className="kicker">{eyebrow}</p><h1>{title}</h1>{description ? <p>{description}</p> : null}</div>
}

function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof BookOpen }) {
  return <article className="portal-metric"><span className="portal-metric-icon"><Icon size={19} /></span><p>{label}</p><strong>{value}</strong><small>{detail}</small></article>
}

function StudentHome() {
  const { completedActivities, points, feedback, activity } = useDemoState()
  const completed = completedActivities.includes(activityId)
  return <>
    <DemoNotice />
    <PageTitle eyebrow="Student learning demo" title="A good day to get curious." description="Welcome back, Aarav. This sample learning space is designed for exploration at your own pace." />
    <div className="portal-metrics">
      <Metric label="Learning points" value={`${points}`} detail="Earned through completed activities" icon={Sparkles} />
      <Metric label="Activities completed" value={`${completedActivities.length}`} detail="Your demo learning record" icon={Check} />
      <Metric label="Journey stage" value={completed ? 'Reflect' : 'Discover'} detail="One sample activity available" icon={ArrowDownRight} />
    </div>
    <section className="portal-feature-panel student-feature-panel">
      <div>
        <p className="portal-overline">Continue learning · Sample activity</p>
        <h2>{activity.title}</h2>
        <p>{activity.instructions}</p>
        <LinkButton to="/portal/activity">{completed ? 'Review activity' : 'Start activity'} <ArrowRight size={17} /></LinkButton>
      </div>
      <div className="number-sequence" aria-label="Two, four, eight, sixteen, question mark"><span>02</span><span>04</span><span>08</span><span>16</span><span>?</span></div>
    </section>
    <section className="portal-section-block">
      <div className="portal-section-heading"><div><p className="portal-overline">Your learning path</p><h2>Small steps, thoughtful learning</h2></div><Link to="/portal/journey" className="inline-link">See the journey <ArrowRight size={16} /></Link></div>
      <JourneyProgress completed={completed} />
    </section>
    {feedback['submission-1'] ? <section className="portal-feedback-note"><p className="portal-overline">Sample teacher feedback</p><p>{feedback['submission-1']}</p><small>Fictional feedback saved in the demo browser.</small></section> : null}
    <p className="healthy-learning-note">Learning can happen in focused moments. Take a screen break whenever you need one.</p>
  </>
}

function JourneyProgress({ completed }: { completed: boolean }) {
  return <ol className="portal-journey-track">{learningStages.map((stage, index) => {
    const active = completed ? index < learningStages.length : index === 0
    return <li className={active ? 'portal-journey-step is-active' : 'portal-journey-step'} key={stage}><span>{active && completed && index < 4 ? <Check size={17} /> : `0${index + 1}`}</span><strong>{stage}</strong></li>
  })}</ol>
}

function StudentJourney() {
  const { completedActivities, activity } = useDemoState()
  const completed = completedActivities.includes(activityId)
  return <>
    <DemoNotice />
    <PageTitle eyebrow="Learning journey" title="Discover → Learn → Practise → Apply → Reflect" description="A sample activity gives you a chance to move through a short learning cycle. This is a product demo, not a confirmed school programme." />
    <JourneyProgress completed={completed} />
    <section className="portal-feature-panel journey-activity-panel">
      <div><p className="portal-overline">Your next activity</p><h2>{activity.title}</h2><p>{activity.instructions}</p><LinkButton to="/portal/activity">Open activity <ArrowRight size={17} /></LinkButton></div>
      <span className="activity-illustration" aria-hidden="true">2 × 2</span>
    </section>
    <p className="healthy-learning-note">After finishing, pause and reflect on how you found the pattern.</p>
  </>
}

function StudentActivity() {
  const { completedActivities, completeActivity, activity } = useDemoState()
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [answerIsCorrect, setAnswerIsCorrect] = useState(false)
  const done = completedActivities.includes(activityId)

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (answer.trim() === '32') {
      setAnswerIsCorrect(true)
      setFeedback(done ? 'That is right. The pattern doubles each time: 2, 4, 8, 16, 32. This activity is already complete.' : 'That is right. The pattern doubles each time: 2, 4, 8, 16, 32. When you are ready, mark the activity complete.')
      return
    }
    setAnswerIsCorrect(false)
    setFeedback('Not quite yet. Compare each number with the one before it. What happens each time?')
  }

  return <>
    <DemoNotice>Sample activity for demonstration only. It is not confirmed as part of Seedstone’s curriculum.</DemoNotice>
    <PageTitle eyebrow="Try a short activity" title={activity.title} description={activity.instructions} />
    <section className="portal-activity-card">
      <p className="portal-overline">Number reasoning · Sample</p>
      <div className="number-sequence activity-sequence"><span>02</span><span>04</span><span>08</span><span>16</span><span>?</span></div>
      <h2>What number comes next?</h2>
      <p>Enter your answer. Then think about how you could explain the pattern to someone else.</p>
      <form className="portal-answer-form" onSubmit={submitAnswer}>
        <label htmlFor="pattern-answer">Your answer</label>
        <input id="pattern-answer" inputMode="numeric" pattern="[0-9]*" value={answer} onChange={(event) => { setAnswer(event.target.value); setAnswerIsCorrect(false); setFeedback('') }} required aria-describedby="pattern-feedback" />
        <button className="primary-button" type="submit">{done ? 'Check answer' : 'Submit answer'}</button>
      </form>
      <p className={feedback.includes('right') ? 'portal-feedback success' : 'portal-feedback'} id="pattern-feedback" role="status">{feedback || (done ? 'Completed in your demo learning record. You can try it again.' : 'A thoughtful attempt matters more than speed.')}</p>
      {answerIsCorrect && !done ? <button className="primary-button" type="button" onClick={() => { completeActivity(activityId); setFeedback('Activity complete. You earned 20 learning points.') }}>Mark activity complete</button> : null}
      {done ? <p className="earned-badge"><Award size={18} /> Pattern finder · Earned for completing this activity</p> : null}
      <div className="portal-activity-footer"><Link to="/portal/journey" className="inline-link">Back to learning journey <ArrowRight size={16} /></Link><span>Take a short break after learning.</span></div>
    </section>
  </>
}

function StudentAchievements() {
  const { points, completedActivities } = useDemoState()
  const earned = completedActivities.includes(activityId)
  return <>
    <DemoNotice />
    <PageTitle eyebrow="Achievements" title="Notice what you have learned." description="Learning points and badges celebrate meaningful effort in this demo. They are not grades or a comparison with other students." />
    <div className="portal-metrics"><Metric label="Learning points" value={`${points}`} detail="20 points for a completed activity" icon={Sparkles} /><Metric label="Badges earned" value={earned ? '1' : '0'} detail="Badges explain the action they recognise" icon={Award} /></div>
    <section className={`portal-badge-panel ${earned ? 'earned' : ''}`}><span><Award size={30} /></span><div><h2>Pattern finder</h2><p>{earned ? 'Earned by completing the Pattern detective activity.' : 'Complete the Pattern detective activity to earn this badge.'}</p></div>{!earned ? <Link to="/portal/activity" className="inline-link">Try activity <ArrowRight size={16} /></Link> : <strong>Earned</strong>}</section>
  </>
}

function ParentOverview({ route }: { route: string }) {
  const { completedActivities, feedback } = useDemoState()
  const count = completedActivities.length
  if (route === 'progress' || route === 'child') return <>
    <DemoNotice>Demo learning summary only. This is not a real student record or assessment.</DemoNotice>
    <PageTitle eyebrow="Child’s learning" title="A sample view of learning in progress." description="Use this overview to see what the prototype can display when real, approved learning data is connected." />
    <div className="portal-metrics"><Metric label="Activities completed" value={`${count}`} detail="In this browser demo" icon={Check} /><Metric label="Current journey" value={count ? 'Reflect' : 'Discover'} detail="Stage based on demo activity" icon={ArrowDownRight} /><Metric label="Demo teacher feedback" value={feedback['submission-1'] ? 'Available' : 'Not added'} detail="Fictional feedback only · no live teacher connection" icon={BookOpen} /></div>
    <section className="portal-section-block"><h2>Learning journey</h2><JourneyProgress completed={count > 0} /></section>
    <section className="portal-feature-panel"><div><p className="portal-overline">Activity summary</p><h2>Pattern detective</h2><p>{count ? 'Completed in the local demo. No real student submission was created.' : 'Available as a sample learning activity.'}</p>{feedback['submission-1'] ? <p><strong>Sample teacher feedback:</strong> {feedback['submission-1']}</p> : null}</div><Link to="/portal/reports" className="secondary-button">View sample report</Link></section>
  </>

  if (route === 'reports') return <>
    <DemoNotice>Sample report generated from local prototype activity only. Not a school report or academic assessment.</DemoNotice>
    <PageTitle eyebrow="Reports" title="A simple learning snapshot." description="This sample report illustrates a possible parent-facing summary. No grades, attendance, or real performance data are included." />
    <article className="portal-report"><p className="portal-overline">DEMO LEARNING SNAPSHOT</p><h2>Aarav Mehta <span>Sample profile</span></h2><p className="report-period">Prototype activity · Current browser session</p><dl><div><dt>Activities completed</dt><dd>{count}</dd></div><div><dt>Sample activity</dt><dd>{count ? 'Pattern detective · completed' : 'Pattern detective · available'}</dd></div><div><dt>Teacher feedback</dt><dd>Not connected</dd></div></dl><p>Next step: continue exploring a sample activity and reflect on the strategy used.</p></article>
    <button className="secondary-button" type="button" onClick={() => window.print()}>Print this sample report</button>
  </>

  if (route === 'support') return <>
    <DemoNotice />
    <PageTitle eyebrow="Support" title="Questions about Seedstone?" description="Verified contact information and a live support service are still pending confirmation." />
    <section className="portal-feature-panel"><div><h2>Prepare a question</h2><p>Use the public enquiry form to draft a question. It is not connected to a live admissions or support team.</p><LinkButton to="/contact">Open enquiry options <ArrowRight size={17} /></LinkButton></div></section>
  </>

  return <>
    <DemoNotice />
    <PageTitle eyebrow="Parent / guardian demo" title="A clear view of learning, without the noise." description="Welcome, Mira. This fictional parent workspace shows how a family overview could be organised." />
    <div className="portal-child-switcher"><div className="demo-avatar">AM</div><div><span>Selected learner · Sample profile</span><strong>Aarav Mehta</strong><small>Classes 6–8 · Illustrative demo group</small></div><button type="button" className="secondary-button" disabled aria-label="Only one fictional demo learner is available">1 sample learner</button></div>
    <div className="portal-metrics"><Metric label="Activities completed" value={`${count}`} detail="Local demo activity only" icon={Check} /><Metric label="Learning journey" value={count ? 'Reflect' : 'Discover'} detail="No grades or attendance data" icon={ArrowDownRight} /><Metric label="School messages" value="Not connected" detail="No live school communication" icon={FileText} /></div>
    <section className="portal-section-block"><div className="portal-section-heading"><div><p className="portal-overline">Learning overview</p><h2>One sample activity</h2></div><Link to="/portal/progress" className="inline-link">View learning <ArrowRight size={16} /></Link></div><div className="portal-list-row"><span className="portal-list-icon"><BookOpen size={18} /></span><div><strong>Pattern detective</strong><small>Sample number reasoning activity · {count ? 'Completed' : 'Available'}</small></div><span className="status-pill">{count ? 'Complete' : 'Ready to explore'}</span></div></section>
    <LinkButton to="/portal/support" secondary>Support and questions <ArrowRight size={16} /></LinkButton>
  </>
}

function TeacherWorkspace({ route }: { route: string }) {
  const { feedback, saveFeedback, activity, updateActivity } = useDemoState()
  const [selectedSubmission, setSelectedSubmission] = useState(submissions[0].id)
  const [draft, setDraft] = useState(feedback[submissions[0].id] ?? '')
  const [saved, setSaved] = useState(false)

  if (route === 'students') return <>
    <DemoNotice>Fictional student roster for this demonstration. No personal student data is stored.</DemoNotice>
    <PageTitle eyebrow="Students" title="Sample learning group." description="A small fictional roster for demonstrating the teacher workspace." />
    <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Student</th><th>Group</th><th>Sample submission</th></tr></thead><tbody>{submissions.map((submission) => <tr key={submission.id}><td>{submission.student}</td><td>Classes 6–8</td><td><Link to="/portal/submissions">Review activity <ArrowRight size={14} /></Link></td></tr>)}</tbody></table></div>
  </>

  if (route === 'activities') return <TeacherActivityEditor activity={activity} onSave={updateActivity} />

  if (route === 'submissions' || route === 'feedback') {
    const submission = submissions.find((item) => item.id === selectedSubmission) ?? submissions[0]
    return <>
      <DemoNotice>Fictional student responses. Feedback is saved only in this browser’s demo storage.</DemoNotice>
      <PageTitle eyebrow="Submissions & feedback" title="Review a sample response." description="Choose a fictional submission, review the response, and save prototype feedback." />
      <div className="teacher-review-layout"><nav className="submission-list" aria-label="Sample submissions">{submissions.map((item) => <button type="button" key={item.id} className={selectedSubmission === item.id ? 'submission-choice active' : 'submission-choice'} onClick={() => { setSelectedSubmission(item.id); setDraft(feedback[item.id] ?? ''); setSaved(false) }}><strong>{item.student}</strong><span>{item.activity}</span></button>)}</nav><article className="portal-review-card"><p className="portal-overline">Sample response</p><h2>{submission.student}</h2><p><strong>Activity:</strong> {submission.activity}</p><p><strong>Answer:</strong> {submission.answer}</p><label htmlFor="teacher-feedback">Feedback for this demo submission</label><textarea id="teacher-feedback" rows={4} value={draft} onChange={(event) => { setDraft(event.target.value); setSaved(false) }} placeholder="Write an encouraging, specific comment." /><button type="button" className="primary-button" disabled={!draft.trim()} onClick={() => { saveFeedback(submission.id, draft.trim()); setSaved(true) }}>Save demo feedback</button>{saved ? <p className="portal-feedback success" role="status">Feedback saved in this browser’s demo state.</p> : feedback[submission.id] ? <p className="portal-saved-note">Saved feedback: {feedback[submission.id]}</p> : null}</article></div>
    </>
  }

  if (route === 'classes') return <>
    <DemoNotice />
    <PageTitle eyebrow="Classes" title="A sample learning group." description="The class and activity below are fictional and for demonstration only." />
    <article className="portal-class-card"><span className="portal-overline">DEMO CLASS · NOT A CONFIRMED PROGRAMME</span><h2>Learning group 6–8</h2><p>2 fictional learners · 1 sample activity · No live schedule or enrolment</p><div className="portal-class-actions"><LinkButton to="/portal/students" secondary>View sample students</LinkButton><LinkButton to="/portal/submissions">Review submissions</LinkButton></div></article>
    <section className="portal-section-block"><h2>Activity in this group</h2><div className="portal-list-row"><span className="portal-list-icon"><BookOpen size={18} /></span><div><strong>Pattern detective</strong><small>Sample activity · no real student progress shown</small></div><Link to="/portal/activities">Open <ArrowRight size={16} /></Link></div></section>
  </>

  return <>
    <DemoNotice />
    <PageTitle eyebrow="Teacher workspace demo" title="Support learning, one next step at a time." description="Welcome, Riya. The class, learners, and activity in this workspace are fictional examples." />
    <div className="portal-metrics"><Metric label="Demo groups" value="1" detail="No real class assignments" icon={GraduationCap} /><Metric label="Sample learners" value="2" detail="Fictional demo records" icon={Users} /><Metric label="Responses to review" value="2" detail="Sample activity submissions" icon={ClipboardCheck} /></div>
    <section className="portal-feature-panel"><div><p className="portal-overline">Your sample class</p><h2>Learning group 6–8</h2><p>Review a sample activity, inspect fictional responses, and save feedback locally.</p><LinkButton to="/portal/classes">Open class <ArrowRight size={17} /></LinkButton></div></section>
    <Link to="/portal/submissions" className="inline-link">Go to submissions & feedback <ArrowRight size={16} /></Link>
  </>
}

function CounsellorWorkspace({ route }: { route: string }) {
  const { enquiries, updateEnquiry } = useDemoState()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(enquiries[0]?.id ?? '')
  const [savedId, setSavedId] = useState('')
  const filtered = enquiries.filter((enquiry) => `${enquiry.family} ${enquiry.classGroup} ${enquiry.topic} ${enquiry.status}`.toLowerCase().includes(query.toLowerCase()))
  const selected = filtered.find((enquiry) => enquiry.id === selectedId) ?? filtered[0]

  if (route === 'follow-ups' || route === 'notes') return <>
    <DemoNotice>Demo records only. Public enquiries are not connected to this workspace.</DemoNotice>
    <PageTitle eyebrow={route === 'notes' ? 'Notes' : 'Follow-ups'} title={route === 'notes' ? 'Sample enquiry notes.' : 'Follow-up queue.'} description="All entries are fictional and stored in local browser demo state." />
    <EnquiryManager enquiries={enquiries.filter((enquiry) => route === 'notes' ? Boolean(enquiry.note) : enquiry.status === 'Follow-up')} selectedId={selectedId} setSelectedId={setSelectedId} savedId={savedId} setSavedId={setSavedId} />
  </>

  if (route === 'enquiries') return <>
    <DemoNotice>These fictional records were not received from the public enquiry form.</DemoNotice>
    <PageTitle eyebrow="Enquiries" title="A sample admissions queue." description="Search, open a demo record, and update its follow-up status or note." />
    <div className="portal-enquiry-layout"><section className="portal-enquiry-list"><label className="portal-search"><Search size={17} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search demo enquiries" /></label>{filtered.map((enquiry) => <button type="button" className={selected?.id === enquiry.id ? 'enquiry-choice active' : 'enquiry-choice'} key={enquiry.id} onClick={() => { setSelectedId(enquiry.id); setSavedId('') }}><strong>{enquiry.family}</strong><span>{enquiry.topic} · {enquiry.classGroup}</span><small>{enquiry.status}</small></button>)}{filtered.length === 0 ? <p>No demo enquiries match this search.</p> : null}</section>{selected ? <EnquiryEditor key={selected.id} enquiry={selected} onSave={(update) => { updateEnquiry(selected.id, update); setSavedId(selected.id) }} saved={savedId === selected.id} /> : <p>Select a sample enquiry to review.</p>}</div>
  </>

  return <>
    <DemoNotice>Sample admissions workflow only. This is not a live admissions CRM.</DemoNotice>
    <PageTitle eyebrow="Counsellor / admissions demo" title="A thoughtful first conversation starts with listening." description="Welcome, Dev. Explore the fictional enquiry records and update a status or note in local demo state." />
    <div className="portal-metrics"><Metric label="Sample enquiries" value={`${enquiries.length}`} detail="Not received from contact form" icon={FileText} /><Metric label="New" value={`${enquiries.filter((item) => item.status === 'New').length}`} detail="Fictional demo records" icon={Sparkles} /><Metric label="Follow-ups" value={`${enquiries.filter((item) => item.status === 'Follow-up').length}`} detail="Local prototype status" icon={ArrowDownRight} /></div>
    <section className="portal-section-block"><div className="portal-section-heading"><div><p className="portal-overline">Admissions queue</p><h2>Recent demo enquiries</h2></div><Link to="/portal/enquiries" className="inline-link">Manage enquiries <ArrowRight size={16} /></Link></div>{enquiries.slice(0, 3).map((enquiry) => <button type="button" className="portal-list-row portal-list-button" key={enquiry.id} onClick={() => { setSelectedId(enquiry.id); navigate('/portal/enquiries') }}><span className="portal-list-icon"><FileText size={18} /></span><span><strong>{enquiry.family}</strong><small>{enquiry.topic} · {enquiry.classGroup}</small></span><span className="status-pill">{enquiry.status}</span><ChevronRight size={17} /></button>)}</section>
  </>
}

function EnquiryManager({ enquiries, selectedId, setSelectedId, savedId, setSavedId }: { enquiries: ReturnType<typeof useDemoState>['enquiries']; selectedId: string; setSelectedId: (id: string) => void; savedId: string; setSavedId: (id: string) => void }) {
  const { updateEnquiry } = useDemoState()
  const selected = enquiries.find((item) => item.id === selectedId) ?? enquiries[0]
  if (!selected) return <p>No records in this view yet. Update an enquiry status to Follow-up to see it here.</p>
  return <div className="portal-enquiry-layout"><nav className="portal-enquiry-list" aria-label="Sample enquiry records">{enquiries.map((item) => <button className={item.id === selected.id ? 'enquiry-choice active' : 'enquiry-choice'} type="button" key={item.id} onClick={() => setSelectedId(item.id)}><strong>{item.family}</strong><span>{item.topic}</span><small>{item.status}</small></button>)}</nav><EnquiryEditor key={selected.id} enquiry={selected} saved={savedId === selected.id} onSave={(update) => { updateEnquiry(selected.id, update); setSavedId(selected.id) }} /></div>
}

function TeacherActivityEditor({ activity, onSave }: { activity: { title: string; instructions: string }; onSave: (activity: { title: string; instructions: string }) => void }) {
  const [title, setTitle] = useState(activity.title)
  const [instructions, setInstructions] = useState(activity.instructions)
  const [saved, setSaved] = useState(false)
  return <>
    <DemoNotice>Draft sample activity only. Editing updates this browser’s demo content, not an official school curriculum.</DemoNotice>
    <PageTitle eyebrow="Learning activities" title="Edit the sample activity." description="Update the demo title and instructions, then preview how the change appears in the student learning space." />
    <form className="portal-review-card portal-editor-card" onSubmit={(event) => { event.preventDefault(); onSave({ title: title.trim(), instructions: instructions.trim() }); setSaved(true) }}>
      <p className="portal-overline">REASONING · DRAFT SAMPLE</p>
      <label htmlFor="demo-activity-title">Activity title</label>
      <input id="demo-activity-title" value={title} onChange={(event) => { setTitle(event.target.value); setSaved(false) }} required maxLength={70} />
      <label htmlFor="demo-activity-instructions">Student instructions</label>
      <textarea id="demo-activity-instructions" rows={4} value={instructions} onChange={(event) => { setInstructions(event.target.value); setSaved(false) }} required maxLength={300} />
      <button className="primary-button" type="submit" disabled={!title.trim() || !instructions.trim()}>Save sample activity</button>
      {saved ? <p className="portal-feedback success" role="status">Demo activity saved locally. Student and parent views use this sample content.</p> : null}
      <Link to="/portal/activity" className="inline-link">Preview student activity <ArrowRight size={16} /></Link>
    </form>
  </>
}

function EnquiryEditor({ enquiry, onSave, saved }: { enquiry: ReturnType<typeof useDemoState>['enquiries'][number]; onSave: (update: Partial<{ status: EnquiryStatus; note: string; followUp: string }>) => void; saved: boolean }) {
  const [status, setStatus] = useState(enquiry.status)
  const [note, setNote] = useState(enquiry.note)
  const [followUp, setFollowUp] = useState(enquiry.followUp)
  return <form className="portal-review-card" onSubmit={(event) => { event.preventDefault(); onSave({ status, note, followUp }) }}><p className="portal-overline">Fictional enquiry · {enquiry.id}</p><h2>{enquiry.family}</h2><p>{enquiry.classGroup} · {enquiry.topic}</p><label htmlFor="enquiry-status">Follow-up status</label><select id="enquiry-status" value={status} onChange={(event) => setStatus(event.target.value as EnquiryStatus)}><option>New</option><option>Contacted</option><option>Follow-up</option><option>Closed</option></select><label htmlFor="enquiry-follow-up">Next follow-up date (demo)</label><input id="enquiry-follow-up" type="date" value={followUp} onChange={(event) => setFollowUp(event.target.value)} /><label htmlFor="enquiry-note">Internal demo note</label><textarea id="enquiry-note" rows={4} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a non-sensitive sample note." /><button className="primary-button" type="submit">Save demo update</button>{saved ? <p className="portal-feedback success" role="status">Status and note saved locally in this demo.</p> : null}</form>
}

function AdminWorkspace({ route }: { route: string }) {
  const { users, updateUser, enquiries, resetDemo, activity } = useDemoState()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(users[0]?.id ?? '')
  const [saved, setSaved] = useState(false)
  const visibleUsers = users.filter((user) => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesRole && `${user.name} ${user.group}`.toLowerCase().includes(query.toLowerCase())
  })

  if (!route) return <>
    <DemoNotice />
    <PageTitle eyebrow="School administrator demo" title="A clear overview of the prototype." description="Welcome, Samira. Explore sample records and see how a future school workspace could be organised." />
    <div className="portal-metrics"><Metric label="Demo users" value={`${users.length}`} detail="Fictional role records" icon={Users} /><Metric label="Sample class groups" value="1" detail="Not a confirmed programme" icon={GraduationCap} /><Metric label="Demo enquiries" value={`${enquiries.length}`} detail="Not connected to public form" icon={FileText} /></div>
    <section className="portal-section-block"><div className="portal-section-heading"><div><p className="portal-overline">Explore prototype records</p><h2>Operations demo</h2></div></div><div className="portal-admin-shortcuts"><Link to="/portal/users"><Users size={20} /><strong>Search and edit users</strong><span>Sample roles and fictional records</span></Link><Link to="/portal/classes"><BookOpen size={20} /><strong>Open sample class</strong><span>Illustrative class and activity</span></Link><Link to="/portal/enquiries"><ClipboardCheck size={20} /><strong>View enquiries</strong><span>Fictional admissions records</span></Link></div></section>
  </>

  if (route === 'users' || route === 'students-parents' || route === 'teachers') {
    const scopedUsers = route === 'students-parents' ? users.filter((user) => user.role === 'student' || user.role === 'parent') : route === 'teachers' ? users.filter((user) => user.role === 'teacher') : visibleUsers
    const selected = scopedUsers.find((user) => user.id === selectedId) ?? scopedUsers[0]
    return <>
      <DemoNotice>Fictional directory only. Editing changes this browser’s prototype data and does not create or change real accounts.</DemoNotice>
      <PageTitle eyebrow={route === 'users' ? 'User management' : route === 'teachers' ? 'Teacher records' : 'Students & parents'} title={route === 'users' ? 'Explore demo users.' : route === 'teachers' ? 'Sample educator directory.' : 'Sample learner and guardian records.'} description="Search and filter fictional records. Select a record to edit its display name." />
      <div className="admin-user-tools"><label className="portal-search"><Search size={17} /><input value={query} onChange={(event) => { setQuery(event.target.value); setSaved(false) }} placeholder="Search demo users" /></label>{route === 'users' ? <label className="portal-filter-label">Role <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setSaved(false) }}><option value="all">All roles</option>{Object.entries(demoRoleLabels).map(([role, label]) => <option value={role} key={role}>{label}</option>)}</select></label> : null}</div>
      <div className="admin-users-layout"><div className="admin-user-list">{scopedUsers.map((user) => <button type="button" key={user.id} className={selected?.id === user.id ? 'admin-user-choice active' : 'admin-user-choice'} onClick={() => { setSelectedId(user.id); setSaved(false) }}><strong>{user.name}</strong><span>{demoRoleLabels[user.role]} · {user.group}</span></button>)}</div>{selected ? <AdminUserEditor key={selected.id} user={selected} onSave={(name) => { updateUser(selected.id, name); setSaved(true) }} saved={saved} /> : <p>No demo users match your search.</p>}</div>
    </>
  }

  if (route === 'classes') return <>
    <DemoNotice />
    <PageTitle eyebrow="Class management" title="One sample class group." description="This is an illustrative class record. It does not represent confirmed enrolment or a live timetable." />
    <article className="portal-class-card"><span className="portal-overline">SAMPLE CLASS · NOT AN ACTIVE CLASS</span><h2>Learning group 6–8</h2><p>2 fictional student profiles · 1 draft sample activity</p><div className="portal-class-actions"><LinkButton to="/portal/students-parents" secondary>View sample learners</LinkButton><LinkButton to="/portal/content">View learning content</LinkButton></div></article>
  </>

  const adminTitles: Record<string, [string, string]> = {
    content: ['Learning content', 'Sample content is illustrative and not an approved school curriculum.'],
    enquiries: ['Admissions enquiries', 'Public enquiry forms are not connected to this sample workspace.'],
    reports: ['Activity summaries', 'No real student performance or operational data is available.'],
    settings: ['Prototype settings', 'Role switching and local storage do not provide production access control.'],
  }
  const [title, description] = adminTitles[route] ?? adminTitles.settings
  return <>
    <DemoNotice />
    <PageTitle eyebrow={title} title={title === 'Learning content' ? 'A small sample content library.' : title === 'Admissions enquiries' ? 'Fictional enquiry records.' : title} description={description} />
    {route === 'content' ? <div className="portal-list-row"><span className="portal-list-icon"><BookOpen size={18} /></span><div><strong>{activity.title}</strong><small>Draft sample · not confirmed curriculum</small></div><Link to="/portal/activities">Review content <ArrowRight size={16} /></Link></div> : null}
    {route === 'enquiries' ? enquiries.map((item) => <div className="portal-list-row" key={item.id}><span className="portal-list-icon"><FileText size={18} /></span><div><strong>{item.family}</strong><small>{item.topic} · {item.classGroup}</small></div><span className="status-pill">{item.status}</span></div>) : null}
    {route === 'reports' ? <div className="portal-metrics"><Metric label="Demo users" value={`${users.length}`} detail="Fictional records only" icon={Users} /><Metric label="Sample enquiry records" value={`${enquiries.length}`} detail="Not connected to admissions" icon={FileText} /></div> : null}
    {route === 'settings' ? <section className="portal-review-card"><h2>Reset this demo</h2><p>Reset sample progress, saved feedback, enquiry updates, and edited demo names in this browser.</p><button className="secondary-button" type="button" onClick={() => { if (window.confirm('Reset all Seedstone demo data in this browser?')) { resetDemo(); navigate('/login') } }}>Reset local demo data</button><p className="portal-security-note">A real deployment needs an identity provider and server-side role permissions. The role selector and browser storage are for demo exploration only.</p></section> : null}
  </>
}

function AdminUserEditor({ user, onSave, saved }: { user: { id: string; name: string; role: DemoRole; group: string }; onSave: (name: string) => void; saved: boolean }) {
  const [name, setName] = useState(user.name)
  return <form className="portal-review-card" onSubmit={(event) => { event.preventDefault(); onSave(name.trim()) }}><p className="portal-overline">DEMO RECORD</p><h2>{user.name}</h2><p>{demoRoleLabels[user.role]} · {user.group}</p><label htmlFor={`edit-demo-user-${user.id}`}>Display name</label><input id={`edit-demo-user-${user.id}`} value={name} onChange={(event) => setName(event.target.value)} required /><button className="primary-button" type="submit" disabled={!name.trim()}>Save demo record</button>{saved ? <p className="portal-feedback success" role="status">Display name updated in local demo state.</p> : null}</form>
}

function ProfilePage({ role }: { role: DemoRole }) {
  const { signOut, resetDemo, persistenceAvailable } = useDemoState()
  const navigate = useNavigate()
  return <>
    <DemoNotice />
    <PageTitle eyebrow="Profile & settings" title="Your demo workspace." description="This profile represents a fictional role used to explore the prototype." />
    <section className="portal-profile-card"><div className="demo-avatar">{demoRoleLabels[role].slice(0, 1)}</div><div><p className="portal-overline">CURRENT DEMO ROLE</p><h2>{demoRoleLabels[role]}</h2><p>Authentication and permissions are not connected to a production service.</p></div></section>
    <p className={persistenceAvailable === false ? 'portal-storage-status is-warning' : 'portal-storage-status'}>{persistenceAvailable === true ? 'Demo changes are saved in this browser only.' : persistenceAvailable === false ? 'Browser storage is unavailable. Changes may not persist after reloading.' : 'Checking local demo storage…'}</p>
    <div className="portal-profile-actions"><button type="button" className="secondary-button" onClick={() => { resetDemo(); navigate('/') }}>Reset demo and sign out</button><button type="button" className="primary-button" onClick={() => { signOut(); navigate('/login') }}><LogOut size={16} /> Sign out</button></div>
  </>
}

export default function PortalPage() {
  const { session, signOut } = useDemoState()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  const currentPath = location.pathname.replace(/^\/portal\/?/, '')
  const route = currentPath.split('/')[0] || ''
  const nav = roleLinks[session]
  const allowed = nav.some((item) => item.path.replace(/^\//, '') === route)
  if (route && !allowed) return <Navigate to="/portal" replace />
  const activeItem = nav.find((item) => item.path.replace(/^\//, '') === route) ?? nav[0]

  const renderWorkspace = () => {
    if (route === 'profile') return <ProfilePage role={session} />
    if (session === 'student') {
      if (route === 'journey') return <StudentJourney />
      if (route === 'activity') return <StudentActivity />
      if (route === 'achievements') return <StudentAchievements />
      return <StudentHome />
    }
    if (session === 'parent') return <ParentOverview route={route} />
    if (session === 'teacher') return <TeacherWorkspace route={route} />
    if (session === 'counsellor') return <CounsellorWorkspace route={route} />
    return <AdminWorkspace route={route} />
  }

  return <div className={`portal-app portal-role-${session}`}>
    <header className="portal-topbar"><Link to="/" className="portal-brand"><img src="/seedstone-logo.svg" alt="Seedstone School" /><span>Learning demo</span></Link><button type="button" className="portal-mobile-menu" aria-label={menuOpen ? 'Close portal navigation' : 'Open portal navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button><div className="portal-topbar-right"><span className="portal-role-pill">{demoRoleLabels[session]}</span><button className="portal-logout" type="button" onClick={() => { signOut(); navigate('/login') }}><LogOut size={16} /> Sign out</button></div></header>
    <div className="portal-layout"><aside className={menuOpen ? 'portal-sidebar open' : 'portal-sidebar'}><div className="portal-sidebar-label">WORKSPACE</div><nav aria-label={`${demoRoleLabels[session]} navigation`}>{nav.map((item) => { const Icon = item.icon; const selected = item === activeItem; return <Link to={`/portal${item.path}`} key={`${item.label}-${item.path}`} className={selected ? 'portal-nav-link active' : 'portal-nav-link'} onClick={() => setMenuOpen(false)} aria-current={selected ? 'page' : undefined}><Icon size={18} /><span>{item.label}</span></Link> })}</nav><div className="portal-sidebar-foot"><span className="portal-demo-dot" /> Demo data · this browser only</div></aside><main className="portal-main"><div className="portal-content">{renderWorkspace()}<footer className="portal-footer">Prototype workspace · Not connected to live school systems <Link to="/">Return to public website</Link></footer></div></main></div>
  </div>
}
