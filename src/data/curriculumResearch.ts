export type CurriculumPathway = {
  id: string
  name: string
  stage: string
  typicalLearner: string
  subjects: string
  assessment: string
  overview: string
  suitability: string
  seedstoneStatus: string
  sources: { label: string; url: string }[]
}

export const curriculumResearchVerifiedOn = '2026-10-29'

export const curriculumPathways: CurriculumPathway[] = [
  {
    id: 'cbse-ncert',
    name: 'CBSE / NCERT-aligned learning',
    stage: 'NCF stage framework: Foundational (ages 3–8), Preparatory (8–11), Middle (11–14), and Secondary (14–18). These are broad developmental stages, not confirmation of a Seedstone grade-to-board mapping.',
    typicalLearner: 'Learners following an Indian school curriculum, with age-appropriate learning stages and applicable subject requirements set by the relevant school and current curriculum.',
    subjects: 'Learning areas can include languages, mathematics, environmental studies or science, social science, arts, and physical education. The emphasis and subject structure differ by stage; this is not a class-wise Seedstone subject offer.',
    assessment: 'Competency and learning outcomes are described in national framework and CBSE resources. Applicable assessment depends on stage, class, current session curriculum, and school model; no Seedstone examination or assessment scheme has been verified.',
    overview: 'NCERT develops national curriculum frameworks and learning resources; CBSE publishes curriculum materials for its affiliated schools. Curriculum reference or alignment does not itself establish CBSE affiliation.',
    suitability: 'Families seeking an Indian curricular context may wish to compare the current NCERT framework and relevant CBSE publications with their child’s stage and goals.',
    seedstoneStatus: 'Awaiting confirmation. Seedstone affiliation, approved curriculum mapping, delivery model, and admission availability are not verified.',
    sources: [
      { label: 'CBSE Academic — Curriculum Archive', url: 'https://cbseacademic.nic.in/curriculum_archive.html' },
      { label: 'NCERT — National Curriculum Framework', url: 'https://ncf.ncert.gov.in/' },
      { label: 'CBSE — Handbook for Teachers (learning outcomes reference)', url: 'https://www.cbse.gov.in/cbsenew/documents/Handbook_for_Teachers.pdf' },
    ],
  },
  {
    id: 'nios',
    name: 'National Institute of Open Schooling (NIOS)',
    stage: 'Secondary (equivalent to Class X) and Senior Secondary (equivalent to Class XII). NIOS is not presented here as a conventional Class 1–8 curriculum.',
    typicalLearner: 'Learners considering an open-schooling route and the subject choices and eligibility requirements for a Secondary or Senior Secondary qualification.',
    subjects: 'At Secondary, learners select from language and other subject groups. NIOS states that a pass certificate requires at least five subjects, including one or at most two languages, with up to two additional subjects permitted (maximum seven). Check the current prospectus and combination rules.',
    assessment: 'Formal qualification depends on meeting NIOS eligibility, registration, subject, examination, and certification requirements. Studying with support is not the same as registration with NIOS.',
    overview: 'NIOS is a separate open-schooling board with its own course structure, registration and examination arrangements. At Senior Secondary, the NIOS FAQ says a learner must have passed Secondary from a recognised board; it lists a minimum age of 15 for admission.',
    suitability: 'Families who want to investigate open schooling and can verify the applicable entry, subject, examination, and further-study requirements directly with NIOS.',
    seedstoneStatus: 'Awaiting confirmation. No Seedstone NIOS study centre, registration arrangement, examination centre, or certification authority has been verified.',
    sources: [
      { label: 'NIOS — Official website', url: 'https://nios.ac.in/' },
      { label: 'NIOS — Secondary course and scheme of studies', url: 'https://rcdelhi.nios.ac.in/page/secondary.html' },
      { label: 'NIOS — Official FAQ (eligibility and subject selection)', url: 'https://grs.nios.ac.in/faq' },
    ],
  },
  {
    id: 'cambridge',
    name: 'Cambridge International',
    stage: 'Cambridge Primary is typically for ages 5–11; Cambridge Lower Secondary for ages 11–14. Cambridge IGCSE is generally for ages 14–16; Cambridge International AS & A Levels are a post-16 pathway.',
    typicalLearner: 'Learners seeking a broad international programme with staged progression; the programme, subject combination, and assessment options are selected by each authorised school.',
    subjects: 'Primary and Lower Secondary offer a choice of subjects including English, mathematics, and science, with wider options including creativity, expression, and wellbeing. Cambridge AS & A Level offers a broad subject choice for specialisation or a wider combination.',
    assessment: 'Cambridge offers optional assessment at Primary and Lower Secondary. Qualification assessment and options at later stages are subject- and examination-series-specific; check the current official subject pages.',
    overview: 'Cambridge describes a four-stage Cambridge Pathway. Schools shape subject combinations and local delivery. Cambridge materials and qualifications require the relevant school and examination arrangements.',
    suitability: 'Families comparing an international staged curriculum and its subject choices, assessment options, and onward qualification requirements.',
    seedstoneStatus: 'Awaiting confirmation. Seedstone is not verified as a Cambridge International School or authorised examination centre; no Cambridge programme is confirmed.',
    sources: [
      { label: 'Cambridge — Primary and Lower Secondary overview', url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/ready-with-primary-and-lower-secondary/' },
      { label: 'Cambridge Primary — Curriculum', url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-primary/curriculum/' },
      { label: 'Cambridge Lower Secondary — Curriculum', url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/' },
      { label: 'Cambridge IGCSE', url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/' },
      { label: 'Cambridge International AS & A Levels', url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-advanced/cambridge-international-as-and-a-levels/' },
    ],
  },
  {
    id: 'pearson',
    name: 'Pearson Edexcel',
    stage: 'Pearson iPrimary: ages 3–11; iLowerSecondary: ages 11–14; International GCSE: generally ages 14–16; International AS/A Levels are post-16 qualifications.',
    typicalLearner: 'Learners following Pearson’s international programme and qualification sequence, with the specific programme and examination route arranged by an eligible school or centre.',
    subjects: 'Pearson describes iPrimary and iLowerSecondary as international teaching and learning programmes. International GCSE has a range of subject options; International AS/A Levels allow advanced subject study. Choices and current specifications vary by subject.',
    assessment: 'Pearson describes internally assessed progress tests and externally assessed achievement tests in iPrimary/iLowerSecondary. International GCSE offers linear and, for some subjects and centres, modular assessment; International AS/A Levels have a modular structure. Confirm current subject and centre arrangements.',
    overview: 'The iProgress family connects iPrimary, iLowerSecondary, International GCSE, and International Advanced Level. A curriculum programme or use of Pearson resources does not establish that Seedstone can enter learners for qualifications.',
    suitability: 'Families comparing an international school programme and progression through Pearson subject qualifications, after checking subject availability and examination arrangements.',
    seedstoneStatus: 'Awaiting confirmation. No Pearson programme subscription, approved centre status, examination entry arrangement, or qualification offering has been verified for Seedstone.',
    sources: [
      { label: 'Pearson — iPrimary', url: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-primary-curriculum.html' },
      { label: 'Pearson — iLowerSecondary', url: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-lower-secondary-curriculum.html' },
      { label: 'Pearson — International GCSE overview', url: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/about-international-gcses.html' },
      { label: 'Pearson — International GCSE subjects', url: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses.html' },
      { label: 'Pearson — International AS/A Levels', url: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels.html' },
    ],
  },
]

export const curriculumStageDetails = [
  {
    id: 'primary',
    priorities: 'Proposed focus: foundational understanding, language, number sense, curiosity, and age-appropriate exploration.',
    subjects: 'For reference only, broad learning areas may include languages, mathematics, environmental studies, arts, and physical education. No Seedstone subject list is approved.',
    assessment: 'Learning goals, observation, practice, and feedback are proposed design ideas. Any formal assessment approach is awaiting academic confirmation.',
    enrichment: 'Possible activities include reading, storytelling, nature observation, creative making, and simple supervised STEM explorations.',
    reference: 'NCF stage framework and current applicable NCERT/CBSE references; no class-level syllabus is confirmed.',
  },
  {
    id: 'middle',
    priorities: 'Proposed focus: connecting concepts, growing subject understanding, collaboration, and more independent practice.',
    subjects: 'Potential learning areas include languages, mathematics, science, social science, arts, and physical education. Exact structure depends on an approved programme.',
    assessment: 'Practice, projects, and feedback are possible approaches; no Seedstone assessment scheme or board-specific requirement is verified.',
    enrichment: 'Possible activities include design challenges, reading and communication, financial literacy exercises, and digital citizenship discussions.',
    reference: 'NCF stage framework and current applicable NCERT/CBSE references; no class-level syllabus is confirmed.',
  },
  {
    id: 'secondary',
    priorities: 'Proposed focus: deeper subject concepts, application, study habits, and exploring future academic choices.',
    subjects: 'Subject combinations vary across qualification pathways. Do not treat general subject examples as an approved Seedstone offer.',
    assessment: 'Assessment and examination formats depend on the selected, formally available programme and current subject requirements.',
    enrichment: 'Possible activities include problem-solving projects, presentations, career exploration, and portfolio reflection.',
    reference: 'Consult the current official curriculum or qualification specification for the chosen subject and year; Seedstone mapping is not confirmed.',
  },
  {
    id: 'senior-secondary',
    priorities: 'Proposed focus: subject depth, independent learning, and informed post-school planning.',
    subjects: 'Subject choice and prerequisites vary substantially by qualification route and progression goal. No Seedstone subjects or routes are approved.',
    assessment: 'Qualification-specific registration, subject combinations, assessment, examination centre, and certification requirements must be verified before enrolment.',
    enrichment: 'Possible activities include independent projects, communication, career exploration, and transition planning.',
    reference: 'Consult current official NIOS, Cambridge, Pearson, or other relevant qualification specifications; none is confirmed for Seedstone.',
  },
]
