# Admission enquiry Apps Script deployment

The website only confirms an enquiry after this web app returns a saved
response. The deployed endpoint configured for the site is:

```text
https://script.google.com/macros/s/AKfycbx-8ETLH0RO9kEve5A_HzFkL8CXNszKnwqcq9ecP6B1cFHDFKHx8O4RzUskBKtVYFD8/exec
```

1. Use the existing spreadsheet
   `10y3v-kc6WEA05RdJtmdoV3H8sM0_a2EDUz01K6qRAUI`. In **Project Settings →
   Script Properties**, set `SEEDSTONE_SPREADSHEET_ID` to that existing ID. Confirm that
   the spreadsheet contains an `Admission Enquiries` tab. The script initializes
   headers if the tab is empty, adds a `Submission Key` column without
   overwriting existing cells, and verifies each newly appended row.
2. Deploy the Apps Script project containing `Code.gs` as a **Web app**,
   executing as the spreadsheet-owning account, with
   access set to **Anyone** so visitors who are not signed in can submit. The
   deployed endpoint must not redirect anonymous visitors to an organization
   sign-in page. Review the spreadsheet's access policy before deployment;
   the URL is public.
3. Set `GOOGLE_APPS_SCRIPT_URL` to the deployed URL in the Vercel project's
   server-side **Production** environment variables (and Preview/Development
   if those deployments need to submit):

   `https://script.google.com/macros/s/AKfycbx-8ETLH0RO9kEve5A_HzFkL8CXNszKnwqcq9ecP6B1cFHDFKHx8O4RzUskBKtVYFD8/exec`

4. Redeploy the Apps Script after changing `Code.gs`, and redeploy the website
   after changing its Vercel environment variable. The website posts JSON
   containing `studentName`, `parentName`, `mobile`, `grade`, `city`, and an
   idempotency key to its same-origin `/api/enquiry` endpoint. That server-side
   route forwards the request and accepts success only when Apps Script returns
   `success: true` and a non-empty `enquiryId`. Repeated requests with the same
   key return the original reference rather than appending another row.
5. Submit a test enquiry and confirm its row in the `Admission Enquiries` tab.
   The website displays success only after Apps Script confirms the saved row.

The sheet columns are: Enquiry ID, Submission Date and Time, Student Name,
Parent Name, Mobile Number, Interested Grade, City, and Lead Status. Successful
submissions receive a generated ID and `New` status. The idempotency key is
stored in an additional `Submission Key` column.
