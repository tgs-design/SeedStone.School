# Seedstone School

The public website is built with React, TypeScript, and Vite. Its launch scope is Classes 1–8, with public pages for Home, About, Learning Experience, and Contact.

## Run locally

```sh
npm install
npm run dev
```

The admission form posts to the same-origin Vercel function at
`/api/enquiries`. For production, enable the Google Sheets API, create a
service account, share the target spreadsheet with its email as an editor, and
set `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`,
`GOOGLE_SHEET_ID`, and `SEEDSTONE_ALLOWED_ORIGIN` in the Vercel project's
production environment. Redeploy after setting these values. The function
verifies the saved row before returning a confirmation reference. Do not put
the service-account private key in a `VITE_` variable or commit it. For local
API testing, run the project with `vercel dev` after setting these values in
your local environment.

The configured Apps Script URL currently redirects anonymous requests to
organization sign-in, so the browser cannot receive its save receipt. The
serverless route writes to the same spreadsheet using the Sheets API instead.

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
