export type ActivityBand = 'primary' | 'middle'

export type EnrichmentActivity = {
  id: string
  title: string
  category: string
  bands: ActivityBand[]
  format: string
  duration: string
  materials: string
  learningOutcomes: string[]
  safety: string
}

export const activityBands: { id: ActivityBand; label: string }[] = [
  { id: 'primary', label: 'Primary · Classes 1–5' },
  { id: 'middle', label: 'Middle · Classes 6–8' },
]

export const enrichmentActivities: EnrichmentActivity[] = [
  {
    id: 'creative-arts',
    title: 'Colour, shape & story',
    category: 'Art & design',
    bands: ['primary', 'middle'],
    format: 'Individual making with a short share-back',
    duration: '30–45 minutes · illustrative',
    materials: 'Paper, crayons or washable pencils, and child-safe adhesive where needed.',
    learningOutcomes: ['Experiment with visual choices', 'Express an idea through a creative format', 'Describe one choice or change'],
    safety: 'Use age-appropriate, non-toxic materials. Adult supervision is advised; avoid sharp tools unless directly supervised.',
  },
  {
    id: 'music-rhythm',
    title: 'Rhythm & listening circle',
    category: 'Art & design',
    bands: ['primary', 'middle'],
    format: 'Small-group rhythm and listening exercise',
    duration: '20–35 minutes · illustrative',
    materials: 'Clapping, voice, or simple classroom percussion; no instrument purchase is assumed.',
    learningOutcomes: ['Notice rhythm and tempo', 'Practise listening and turn-taking', 'Create and repeat a simple pattern'],
    safety: 'Keep sound at a comfortable level and offer a quiet participation option.',
  },
  {
    id: 'movement-games',
    title: 'Movement & teamwork games',
    category: 'Movement & sports',
    bands: ['primary', 'middle'],
    format: 'Facilitated, low-contact group activity',
    duration: '25–40 minutes · illustrative',
    materials: 'Clear open space and optional soft markers such as cones or floor spots.',
    learningOutcomes: ['Practise coordination', 'Communicate during a shared challenge', 'Reflect on fair play and teamwork'],
    safety: 'Check the space and surfaces, adapt for individual access needs, provide water and rest, and follow appropriate adult supervision.',
  },
  {
    id: 'reading-circle',
    title: 'Read, wonder & retell',
    category: 'Reading & communication',
    bands: ['primary', 'middle'],
    format: 'Read-aloud, paired reading, or quiet independent reading',
    duration: '20–35 minutes · illustrative',
    materials: 'An age-appropriate story or a book already available to the learner.',
    learningOutcomes: ['Build attention and comprehension', 'Ask a question about a text', 'Retell a key idea in a chosen way'],
    safety: 'Choose age-appropriate material; provide accessible formats or a listening alternative where possible.',
  },
  {
    id: 'debate-circle',
    title: 'Make a case, hear another view',
    category: 'Reading & communication',
    bands: ['primary', 'middle'],
    format: 'Small-group structured discussion',
    duration: '30–45 minutes · illustrative',
    materials: 'A neutral prompt and paper for planning ideas.',
    learningOutcomes: ['Organise a point with a reason', 'Listen and respond respectfully', 'Practise clear spoken communication'],
    safety: 'Use age-appropriate, non-personal prompts and establish respectful discussion norms; participation should not require sharing private experiences.',
  },
  {
    id: 'stem-challenge',
    title: 'Build, test & improve',
    category: 'STEM & making',
    bands: ['primary', 'middle'],
    format: 'Small-group design challenge',
    duration: '35–50 minutes · illustrative',
    materials: 'Paper, reusable card, tape, and other simple non-powered classroom materials.',
    learningOutcomes: ['Plan a simple design', 'Observe and record what happens', 'Use results to make an improvement'],
    safety: 'Use only age-appropriate materials; exclude mains electricity, heat, chemicals, blades, and small parts that pose a choking risk. Direct adult supervision is required.',
  },
  {
    id: 'wellbeing-journal',
    title: 'Pause, notice & reflect',
    category: 'Wellbeing & life skills',
    bands: ['primary', 'middle'],
    format: 'Quiet individual reflection with an optional group check-in',
    duration: '10–20 minutes · illustrative',
    materials: 'Paper or a personal notebook; sharing is optional.',
    learningOutcomes: ['Practise noticing feelings or needs', 'Choose a simple calming or refocusing strategy', 'Reflect on a personal learning goal'],
    safety: 'This is an educational reflection, not counselling or healthcare. Do not require disclosure; follow the school’s safeguarding and wellbeing procedures.',
  },
  {
    id: 'digital-citizenship',
    title: 'Think before you share',
    category: 'Digital citizenship & AI awareness',
    bands: ['primary', 'middle'],
    format: 'Facilitated scenario discussion; no device required',
    duration: '25–40 minutes · illustrative',
    materials: 'Fictional scenarios and a board or paper for group notes.',
    learningOutcomes: ['Identify personal information in a scenario', 'Consider consent and a possible audience', 'Practise pausing and seeking help when unsure'],
    safety: 'Use fictional examples only; do not ask learners to reveal accounts, passwords, private messages, or personal online experiences.',
  },
  {
    id: 'financial-literacy',
    title: 'Plan a pretend project budget',
    category: 'Financial literacy',
    bands: ['primary', 'middle'],
    format: 'Paired or small-group planning exercise using fictional amounts',
    duration: '30–45 minutes · illustrative',
    materials: 'A fictional project brief, paper, and pencils or a basic calculator.',
    learningOutcomes: ['Sort needs from optional choices', 'Work within a simple fictional limit', 'Explain a spending trade-off'],
    safety: 'Use invented amounts only. Do not collect family financial information or present the exercise as personal financial advice.',
  },
  {
    id: 'career-exploration',
    title: 'Interests, skills & future questions',
    category: 'Career exploration',
    bands: ['middle'],
    format: 'Guided reflection on interests and community roles; online research is not required',
    duration: '30–45 minutes · illustrative',
    materials: 'A reflection sheet and, only if available and supervised, approved public career information.',
    learningOutcomes: ['Connect interests with possible fields to explore', 'Generate questions about a role or learning path', 'Identify a next step for further research'],
    safety: 'Use age-appropriate, non-stereotyped examples. Do not promise outcomes, collect sensitive personal information, or require online research.',
  },
  {
    id: 'young-enterprise',
    title: 'A helpful idea for a shared need',
    category: 'Entrepreneurship',
    bands: ['primary', 'middle'],
    format: 'Small-group idea sketch using a fictional classroom or community prompt',
    duration: '25–40 minutes · illustrative',
    materials: 'Paper and pencils; no purchase, sale, or fundraising is involved.',
    learningOutcomes: ['Notice a simple need in a fictional scenario', 'Suggest a helpful idea', 'Explain who the idea might support'],
    safety: 'Keep scenarios fictional and inclusive. Do not collect money, sell goods, ask learners to contact strangers, or make promises about real ventures.',
  },
  {
    id: 'community-care',
    title: 'Notice and care for a shared place',
    category: 'Environment & community',
    bands: ['primary', 'middle'],
    format: 'Photo-free observation, drawing, or fictional planning activity',
    duration: '20–35 minutes · illustrative',
    materials: 'Paper and pencils; an outdoor visit is not required.',
    learningOutcomes: ['Notice one feature of a shared environment', 'Suggest a small, safe way to care for it', 'Listen to different community perspectives'],
    safety: 'This idea can be completed indoors. Any real-world activity requires permission, risk assessment, adult supervision, privacy-aware documentation, and school approval.',
  },
]

export const activityCalendar = [
  { month: 'Month 1', idea: 'Creative arts and reading', note: 'Example only; not a published calendar.' },
  { month: 'Month 2', idea: 'STEM and movement', note: 'Example only; not a published calendar.' },
  { month: 'Month 3', idea: 'Music and wellbeing', note: 'Example only; not a published calendar.' },
  { month: 'Month 4', idea: 'Digital citizenship and community care', note: 'Example only; not a published calendar.' },
]

export const activityFaqs = [
  {
    question: 'Are these activities currently offered by Seedstone?',
    answer: 'No activity, club, coach, schedule, venue, or enrolment place is confirmed here. The cards are illustrative ideas for discussion and require school confirmation.',
  },
  {
    question: 'Can I register a learner from this page?',
    answer: 'No. The activity enquiry form is a front-end demonstration and does not send or save submissions. Contact Seedstone directly to ask about confirmed offerings.',
  },
  {
    question: 'Are the suggested materials and safety notes a complete risk assessment?',
    answer: 'No. They are general planning prompts, not a substitute for an activity-specific risk assessment, safeguarding procedures, accessibility planning, qualified supervision, or applicable local requirements.',
  },
  {
    question: 'Is the four-month outline a confirmed term calendar?',
    answer: 'No. It is an illustrative sequence only. No dates, frequency, term plan, or activity delivery commitment has been published.',
  },
]
