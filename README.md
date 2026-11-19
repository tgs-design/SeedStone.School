# Seedstone School

The public website is built with React, TypeScript, and Vite. Its public home page introduces Seedstone School, the learning approach, Classes 1–8, and a confirmed enquiry/demo flow.

## Run locally

```sh
npm install
npm run dev
```

The admission form posts to the same-origin Vercel function at `/api/enquiry`.
Set `GOOGLE_APPS_SCRIPT_URL` as a server-side Vercel environment variable to
the current Apps Script `/exec` URL in `.env.example`, including the
**Production** environment, and redeploy. The function validates the five
enquiry fields and forwards them with the same idempotency key. It reports
success only after Apps Script returns a successful HTTP response with JSON
`success: true` and a non-empty `enquiryId`. Do not expose the URL through a
`VITE_` variable. See
[`apps-script/README.md`](./apps-script/README.md) for deployment steps.

Create and preview a production build with:

```sh
npm run build
npm run preview
```

Run lint checks with:

```sh
npm run lint
```

## Public-site scope

- The academic focus is Primary (Classes 1–5) and Middle (Classes 6–8).
- The site uses the existing Seedstone logo and the confirmed school contact number 9148177357.
- No curriculum details, admission availability, physical address, or additional contact channels are invented.
- The home page contains the About, Learning, Classes 1–8, and enquiry sections.
- The admission enquiry form submits to the existing Apps Script and confirms only after receiving its success response and enquiry ID.
- `/api/enquiries` remains available as a compatibility alias to the same integration; it does not use a separate spreadsheet or database.
