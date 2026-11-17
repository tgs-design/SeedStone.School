# Seedstone School

The public website is built with React, TypeScript, and Vite. Its launch scope is Classes 1–8, with public pages for Home, About, Learning Experience, and Contact.

## Run locally

```sh
npm install
npm run dev
```

The admission form posts to the same-origin Vercel function at `/api/enquiry`.
Set `GOOGLE_APPS_SCRIPT_URL` as a server-side Vercel environment variable to
the deployed Apps Script `/exec` URL, and redeploy. The function forwards the
five enquiry fields and reports success only after Apps Script returns
`success: true` with an enquiry ID. Do not expose this URL through a `VITE_`
variable.

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
- The site uses the existing Seedstone logo and displays the brand wording “Powered by PhysicsWallah.”
- Curriculum details, admission availability, contact details, and specific school services are not presented as confirmed.
- Legacy curriculum, blog, activity, login, portal, and draft-policy routes are not part of the public site and resolve to the 404 page.
- The admission enquiry form submits to the same-origin serverless function, which verifies the corresponding row in Google Sheets before confirming success.
