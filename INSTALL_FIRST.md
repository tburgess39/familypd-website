# FamilyPD OS 10.4 — install first

## Apps Script
Replace/add only the files in `AppsScript/`. Do not delete unrelated project files.

Then save and deploy a new version of the existing web app.

## Website
Copy the contents of `Website_Update/` into the matching paths in the GitHub Pages repository.

Open `Website_Update/assets/js/familypd-os-config.js` and replace:

`REPLACE_WITH_FAMILYPD_OS_EXEC_URL`

with the current deployed FamilyPD Apps Script URL ending in `/exec`.

Commit and push the website files. GitHub Pages must finish publishing before the changes appear.
