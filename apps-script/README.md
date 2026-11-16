# Admission enquiry Apps Script setup

The website only confirms an enquiry after this web app returns a saved
response. The deployed endpoint configured for the site is:

```text
https://script.google.com/a/macros/penpencil.live/s/AKfycbx-8ETLH0RO9kEve5A_HzFkL8CXNszKnwqcq9ecP6B1cFHDFKHx8O4RzUskBKtVYFD8/exec
```

1. Create a Google Sheet and copy its spreadsheet ID from its URL.
2. Create an Apps Script project and paste in `Code.gs`.
3. In **Project Settings → Script Properties**, add `SPREADSHEET_ID` with the
   spreadsheet ID. The script creates an `Enquiries` sheet and its header row
   on first submission.
4. Deploy as a **Web app**, executing as the spreadsheet-owning account, with
   access set to **Anyone** so visitors who are not signed in can submit. The
   deployed endpoint must not redirect anonymous visitors to an organization
   sign-in page. Review the spreadsheet's access policy before deployment;
   the URL is public.
5. Set `VITE_GOOGLE_APPS_SCRIPT_URL` to the deployed URL in `.env.local` for
   local development and in the Vercel project's production environment:

   ```sh
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/a/macros/penpencil.live/s/AKfycbx-8ETLH0RO9kEve5A_HzFkL8CXNszKnwqcq9ecP6B1cFHDFKHx8O4RzUskBKtVYFD8/exec
   ```

6. Restart/rebuild the Vite website after setting the variable. Redeploy the
   Apps Script whenever its code changes. The handler accepts the exact form
   fields `studentName`, `parentName`, `mobile`, `grade`, and `city`.
7. Submit a test enquiry and confirm its row in the sheet. The browser submits
   through a hidden iframe, so Google redirects and CORS do not require
   `no-cors`; success is shown only when the iframe receives the script's
   `saved` response with an enquiry ID.

The sheet columns are: Enquiry ID, Submission Date and Time, Student Name,
Parent Name, Mobile Number, Interested Grade, City, and Lead Status. Successful
submissions receive a generated ID and `New` status. The browser uses a
same-origin message from its hidden response iframe to distinguish a confirmed
save from a failed or timed-out request.
