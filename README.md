# Seedstone School

The public website is built with React, TypeScript, and Vite. Its launch scope is Classes 1–8, with public pages for Home, About, Learning Experience, and Contact.

## Run locally

```sh
npm install
npm run dev
```

The admission form posts to the same-origin Vercel function at `/api/enquiry`.
Set `GOOGLE_APPS_SCRIPT_URL` as a server-side Vercel environment variable to
the deployed Apps Script `/exec` URL for the existing spreadsheet, including
the **Production** environment, and redeploy. The function validates the five
enquiry fields and forwards them with an idempotency key. Apps Script verifies
the appended row and returns a reference before the site reports success. Do
not expose the URL through a `VITE_` variable. See
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
- The site uses the existing Seedstone logo and displays the brand wording “Powered by PhysicsWallah.”
- Curriculum details, admission availability, contact details, and specific school services are not presented as confirmed.
- Legacy curriculum, blog, activity, login, portal, and draft-policy routes are not part of the public site and resolve to the 404 page.
- The admission enquiry form submits to the same-origin serverless function, which verifies the corresponding row in Google Sheets before confirming success.
