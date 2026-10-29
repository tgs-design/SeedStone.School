export type NavItem = {
  label: string
  path: string
}

export const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Learning Experience', path: '/learning-experience' },
  { label: 'Curriculum', path: '/curriculum' },
  { label: 'Beyond Academics', path: '/activities' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Contact', path: '/contact' },
]

export const primaryClassBands = [
  { id: 'primary', title: 'Primary', classes: 'Classes 1–5', description: 'An opportunity to build foundations through questions, practice, and exploration.' },
  { id: 'middle', title: 'Middle', classes: 'Classes 6–8', description: 'An opportunity to connect ideas and develop independent learning habits.' },
  { id: 'secondary', title: 'Secondary', classes: 'Classes 9–10', description: 'An opportunity to deepen understanding and practise applying ideas.' },
  { id: 'senior-secondary', title: 'Senior Secondary', classes: 'Classes 11–12', description: 'An opportunity to explore subjects in greater depth and consider next steps.' },
]

const classStages = [
  { range: [1, 5], band: 'Primary', anchor: 'primary' },
  { range: [6, 8], band: 'Middle', anchor: 'middle' },
  { range: [9, 10], band: 'Secondary', anchor: 'secondary' },
  { range: [11, 12], band: 'Senior Secondary', anchor: 'senior-secondary' },
] as const

export const curriculumClasses = Array.from({ length: 12 }, (_, index) => {
  const classNumber = index + 1
  const stage = classStages.find(({ range }) => classNumber >= range[0] && classNumber <= range[1])

  return {
    id: `class-${classNumber}`,
    label: `Class ${classNumber}`,
    band: stage?.band ?? 'Class group',
    bandId: stage?.anchor ?? 'primary',
    overview: `The proposed learning experience for Class ${classNumber} is awaiting academic review and confirmation.`,
  }
})

export const learningExperienceThemes = [
  {
    title: 'Core academic learning',
    status: 'Awaiting confirmation',
    description: 'The subject catalogue, teaching model, and class-wise programme are awaiting academic approval.',
    examples: ['Concept explanations', 'Subject learning', 'Learning goals'],
  },
  {
    title: 'Practice and reflection',
    status: 'Planned',
    description: 'A proposed cycle for trying ideas, revisiting learning, and reflecting on next steps.',
    examples: ['Handwritten practice and note-taking', 'Interactive quizzes and activities', 'Feedback and reflection'],
  },
  {
    title: 'Projects and real-world skills',
    status: 'Awaiting confirmation',
    description: 'Potential enrichment areas to explore; none are confirmed as active programmes.',
    examples: ['STEM and project-based learning', 'Financial literacy', 'Entrepreneurship', 'Competitive-exam preparation'],
  },
  {
    title: 'Wellbeing and future readiness',
    status: 'Awaiting confirmation',
    description: 'Proposed themes for future consideration, subject to staffing and programme approval.',
    examples: ['Digital citizenship and responsible AI', 'Student wellbeing and mentorship', 'Career exploration', 'Collaboration and student portfolios'],
  },
]

export const seedstoneFeatures = [
  { title: 'Clear explanations', description: 'A proposed learning approach shaped around clarity, questions, and understanding.' },
  { title: 'Room to ask questions', description: 'An intention to make space for individual guidance and thoughtful discussion.' },
  { title: 'Practice with purpose', description: 'An illustrative focus on revisiting ideas and building understanding over time.' },
  { title: 'Learning at an individual pace', description: 'A child-centered aspiration that recognizes different ways of learning.' },
]

export const howItWorks = [
  'Understand concepts',
  'Practise and revisit',
  'Apply and explore',
  'Reflect on learning',
]

export const beyondTextbookAreas = [
  { title: 'STEM and Projects', description: 'A possible area for hands-on exploration, curiosity, and problem solving.' },
  { title: 'Financial Literacy', description: 'Potential life-skills content; specific topics are pending confirmation.' },
  { title: 'Entrepreneurship', description: 'A possible lens for exploring creativity and responsible problem solving.' },
  { title: 'Exam Preparation', description: 'Potential concept-focused support; exam routes and availability are pending confirmation.' },
]

export const valueThemes = [
  'Curiosity',
  'Understanding',
  'Individual growth',
  'Integrity',
  'Empathy',
  'Resilience',
  'Lifelong learning',
]

export const audienceCards = [
  'Families exploring alternatives to conventional schooling',
  'Children with interests in sports or the performing arts',
  'Families in locations with limited access to suitable schooling',
  'Families whose circumstances call for greater flexibility',
]

export const blogPosts = [
  {
    id: 'helping-children-build-strong-learning-habits',
    title: 'Helping Children Build Strong Learning Habits',
    category: 'Learning Habits',
    excerpt: 'Practical ways families can support steady routines, attention, and independent learning.',
    draft: true,
    readTime: '5 min read',
  },
  {
    id: 'why-conceptual-understanding-matters',
    title: 'Why Conceptual Understanding Matters',
    category: 'Concept Learning',
    excerpt: 'Strong foundations foster confidence and make revision more meaningful over time.',
    draft: true,
    readTime: '4 min read',
  },
  {
    id: 'encouraging-curiosity-beyond-textbooks',
    title: 'Encouraging Curiosity Beyond Textbooks',
    category: 'Curiosity',
    excerpt: 'Small questions and everyday exploration can build long-term confidence in learning.',
    draft: true,
    readTime: '6 min read',
  },
  {
    id: 'how-parents-can-support-growth-at-home',
    title: 'How Parents Can Support Growth at Home',
    category: 'Parent Support',
    excerpt: 'A gentle guide to helping children stay curious, consistent, and motivated.',
    draft: true,
    readTime: '7 min read',
  },
]

export const faqs = [
  {
    question: 'What is the Seedstone approach to learning?',
    answer: 'Seedstone is being shaped around understanding, practising and applying ideas, exploring interests, and reflecting on learning. The specific curriculum and programme are still being confirmed.',
  },
  {
    question: 'Which curriculum, board, or qualification routes are available?',
    answer: 'Subjects, board affiliations, and qualification routes have not been confirmed. The enquiry form can help you prepare a question, but it does not send information to the school.',
  },
  {
    question: 'How do I learn whether Seedstone could suit my child?',
    answer: 'Use the enquiry form to prepare your questions. It is a frontend prototype and does not send your details to a live team; admissions contact details and next steps are pending confirmation.',
  },
  {
    question: 'What ages or class levels are currently available?',
    answer: 'The class groups shown on the curriculum page are illustrative. Programme availability and eligibility are pending confirmation.',
  },
  {
    question: 'Where can I find fees and admissions dates?',
    answer: 'Fees, admissions dates, and the admissions process are pending confirmation. No application or admission is made through this website; the enquiry form is not connected to a live team.',
  },
]

export const curriculumModel = [
  'Understand Concepts',
  'Practise and Reinforce',
  'Apply and Explore',
]

export const learningExperienceCards = [
  'Live Interactive Classes',
  'Handwritten Notes and Practice',
  'Activities and Quizzes',
  'Mentor Support',
  'Progress Reports',
]

export const growthFocusCards = [
  { title: 'STEM and projects', description: 'A proposed area of interest around practical exploration and problem solving.' },
  { title: 'Financial literacy', description: 'Potential practical learning themes; topics and availability are pending confirmation.' },
  { title: 'Entrepreneurship', description: 'A proposed area of interest around creativity and initiative.' },
  { title: 'Clubs and activities', description: 'Potential areas to explore; specific offerings are pending confirmation.' },
  { title: 'Digital citizenship', description: 'A proposed theme for learning about responsible participation in digital spaces.' },
]

export const curriculumAccordionStatic = {
  'Classes 1–5': {
    subjects: 'Pending confirmation.',
    approach: 'Proposed emphasis on concepts, questions, and age-aware learning activities.',
    outcomes: 'Illustrative focus: foundational ideas and curiosity-driven exploration.',
  },
  'Classes 6–8': {
    subjects: 'Pending confirmation.',
    approach: 'Proposed emphasis on connecting concepts and practising problem solving.',
    outcomes: 'Illustrative focus: subject connections and growing independence.',
  },
  'Classes 9–10': {
    subjects: 'Pending confirmation.',
    approach: 'Possible emphasis on concept-building and reviewing ideas over time.',
    outcomes: 'Illustrative focus: subject understanding and reflective practice. Exam routes are unconfirmed.',
  },
  'Classes 11–12': {
    subjects: 'Pending confirmation.',
    approach: 'Possible emphasis on sustained exploration and meaningful application.',
    outcomes: 'Illustrative focus: deeper subject questions and next-step exploration. Pathways are unconfirmed.',
  },
}
