# Admission enquiry Apps Script setup

The website only confirms an enquiry after this web app returns a saved
response. The deployed endpoint configured for the site is:

```text
https://script.google.com/a/macros/penpencil.live/s/AKfycbx-8ETLH0RO9kEve5A_HzFkL8CXNszKnwqcq9ecP6B1cFHDFKHx8O4RzUskBKtVYFD8/exec
```

1. Create a Google Sheet and copy its spreadsheet ID from its URL.
2. Create an Apps Script project and paste in `Code.gs`.
3. In **Project Settings → Script Properties**, set `SPREADSHEET_ID` to
   `10y3v-kc6WEA05RdJtmdoV3H8sM0_a2EDUz01K6qRAUI`. Confirm that this
   spreadsheet contains an `Admission Enquiries` tab. The script initializes
   its existing header row if the tab is empty and verifies the row after each
   append.
4. Deploy as a **Web app**, executing as the spreadsheet-owning account, with
   access set to **Anyone** so visitors who are not signed in can submit. The
   deployed endpoint must not redirect anonymous visitors to an organization
   sign-in page. Review the spreadsheet's access policy before deployment;
   the URL is public.
5. Set `GOOGLE_APPS_SCRIPT_URL` to the deployed URL in the Vercel project's
   server-side environment variables (Production, Preview, and Development as
   needed):

   `https://script.google.com/a/macros/penpencil.live/s/AKfycbx-8ETLH0RO9kEve5A_HzFkL8CXNszKnwqcq9ecP6B1cFHDFKHx8O4RzUskBKtVYFD8/exec`

6. Redeploy the Apps Script after changing `Code.gs`. The website posts JSON
   containing exactly `studentName`, `parentName`, `mobile`, `grade`, and
   `city` to its same-origin `/api/enquiry` endpoint. That server-side route
   forwards the JSON and accepts success only when Apps Script returns
   `success: true` and a non-empty `enquiryId`.
7. Submit a test enquiry and confirm its row in the `Admission Enquiries` tab.
   The website displays success only after Apps Script confirms the saved row.

The sheet columns are: Enquiry ID, Submission Date and Time, Student Name,
Parent Name, Mobile Number, Interested Grade, City, and Lead Status. Successful
submissions receive a generated ID and `New` status.
