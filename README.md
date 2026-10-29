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

Seedstone’s current focus is Classes 1–8: Primary (Classes 1–5) and Middle (Classes 6–8). The public site includes `/learning-experience`, class-wise curriculum orientation and general Indian curriculum references at `/curriculum`, and filtered illustrative enrichment ideas at `/activities`. Class-wise subjects, syllabus details, assessment, affiliation, and admission availability remain subject to confirmation. Activity cards and the sample calendar are proposals, not confirmed programmes.

## Role-based product demo

Open `/login` and choose a demo role to explore the student, parent/guardian, teacher, counsellor/admissions, or school administrator workspace. Demo progress, sample feedback, enquiry edits, and user-name edits are stored in this browser only and can be reset from the workspace settings/profile.

The role selector and browser storage are not secure authentication or access control. All portal records are fictional. Production use requires an identity provider, server-side role enforcement, and approved school systems for student data, learning content, reporting, enquiries, and communications.

## Launch-readiness snapshot

| Area | Status | Notes |
| --- | --- | --- |
| Public website build and lint | Complete for this frontend prototype | `npm run build` and `npm run lint` pass; this does not verify deployment or visual rendering on physical devices. |
| Current class focus | Classes 1–8 | Primary (Classes 1–5) and Middle (Classes 6–8). Class-wise subjects, syllabus, assessment, affiliation, and class-specific admissions still require owner confirmation. |
| Enquiries and admissions operations | Blocked for live use | Form validation is local only; admissions ownership, eligibility, fees, payment, receipts, and approved policies are not configured. |
| Portal workflows | Demo only | Sample student activity and role-specific pages run in the browser; records are fictional and not connected to school systems. |
| Authentication, privacy, and permissions | Blocked for production | No identity provider or server-side authorization is configured; browser role selection is not access control. |
| Deployment, domain, and HTTPS | Awaiting verification | No production environment, domain, HTTPS, or end-to-end form integration was available to verify. |
