# FamilyPD OS v11 Launch Hotfix

## Apps Script
Replace only `Scripts.html` with `AppsScript/Scripts.html`.
Save all files, then deploy a **new version** of the existing web app.

## Website
This package includes the complete current website tree because the shared top navigation exists on every page.
Upload/replace the files and folders inside `Website_Update` at the matching paths in the GitHub repository.

At minimum, replace:
- `/index.html`
- every section page `index.html` that displays the shared top menu
- `/assets/css/styles.css`

Do not copy the outer `Website_Update` folder into the repository. Copy its contents into the repository root.

After committing, wait for GitHub Pages deployment to finish and hard refresh with Ctrl+Shift+R.
