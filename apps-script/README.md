# Admission enquiry Apps Script setup

The website only confirms an enquiry after this web app returns a saved
response. No deployed endpoint or spreadsheet is currently configured.

1. Create a Google Sheet and copy its spreadsheet ID from its URL.
2. Create an Apps Script project and paste in `Code.gs`.
3. In **Project Settings → Script Properties**, add `SPREADSHEET_ID` with the
   spreadsheet ID. The script creates an `Enquiries` sheet and its header row
   on first submission.
4. Deploy as a **Web app**, executing as the spreadsheet-owning account, with
   access set to **Anyone** so the public website can submit. Review the
   spreadsheet's access policy before deployment; the URL is public.
5. Copy the deployed URL ending in `/exec` into the website's `.env.local`:

   ```sh
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   ```

6. Restart/rebuild the Vite website after setting the variable. Redeploy the
   Apps Script whenever its code changes.
7. Submit a test enquiry and confirm its row in the sheet before removing the
   not-connected notice in the homepage.

The sheet columns are: Enquiry ID, Submission Date and Time, Student Name,
Parent Name, Mobile Number, Interested Grade, City, and Lead Status. Successful
submissions receive a generated ID and `New` status. The browser uses a
same-origin message from its hidden response iframe to distinguish a confirmed
save from a failed or timed-out request.
