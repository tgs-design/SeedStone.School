# Seedstone School

The Seedstone School website is a React, TypeScript, and Vite frontend prototype.

## Run locally

```sh
npm install
npm run dev
```

Create and preview a production build with:

```sh
npm run build
npm run preview
```

Run lint checks with `npm run lint`.

## Prototype status

Enquiry forms validate in the browser only; they do not save or send submissions. Login/signup is not connected to an authentication provider. Contact details and school programme information remain subject to confirmation. Curriculum detail is intentionally marked pending academic review, and blog entries are sample drafts rather than published school guidance.

The public site includes `/learning-experience`, a class-by-class curriculum structure and official pathway references at `/curriculum`, and a filtered set of illustrative enrichment ideas at `/activities`. Curriculum sources are maintained in `src/data/curriculumResearch.ts`; Seedstone affiliation, authorization, subject offerings, class availability, and qualification arrangements remain unconfirmed. Activity cards and their sample calendar are proposals, not a confirmed programme.

## Role-based product demo

Open `/login` and choose a demo role to explore the student, parent/guardian, teacher, counsellor/admissions, or school administrator workspace. Demo progress, sample feedback, enquiry edits, and user-name edits are stored in this browser only and can be reset from the workspace settings/profile.

The role selector and browser storage are not secure authentication or access control. All portal records are fictional. Production use requires an identity provider, server-side role enforcement, and approved school systems for student data, learning content, reporting, enquiries, and communications.

## Launch-readiness snapshot

| Area | Status | Notes |
| --- | --- | --- |
| Public website build and lint | Complete for this frontend prototype | `npm run build` and `npm run lint` pass; this does not verify deployment or visual rendering on physical devices. |
| Academic programme and launch classes | Awaiting confirmation | No approved academic source or class-wise syllabus was available in the project. |
| Enquiries and admissions operations | Blocked for live use | Form validation is local only; admissions ownership, eligibility, fees, payment, receipts, and approved policies are not configured. |
| Portal workflows | Demo only | Sample student activity and role-specific pages run in the browser; records are fictional and not connected to school systems. |
| Authentication, privacy, and permissions | Blocked for production | No identity provider or server-side authorization is configured; browser role selection is not access control. |
| Deployment, domain, and HTTPS | Awaiting verification | No production environment, domain, HTTPS, or end-to-end form integration was available to verify. |
