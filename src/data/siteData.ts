export type NavItem = {
  label: string
  path: string
}

export const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Curriculum', path: '/curriculum' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Login / Signup', path: '/login' },
]

export const primaryClassBands = [
  { id: '1-5', title: 'Classes 1–5', description: 'An illustrative focus on curiosity, understanding, and foundational learning.' },
  { id: '6-8', title: 'Classes 6–8', description: 'An illustrative focus on concepts, guided practice, and subject connections.' },
  { id: '9-10', title: 'Classes 9–10', description: 'An illustrative focus on concept-building, revision, and thoughtful practice.' },
  { id: '11-12', title: 'Classes 11–12', description: 'An illustrative focus on sustained practice and meaningful application.' },
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
