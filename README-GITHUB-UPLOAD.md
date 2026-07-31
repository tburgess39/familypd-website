# FamilyPD PGS Integration v10

Upload the contents of this ZIP into the root of the FamilyPD GitHub repository and replace matching files.

## Added
- `/pgs/` — FamilyPD PGS Assistant public app
- `/learning-center/pgs-contact-units/` — CCEA, Contact Units, PGS, and official-resource guide

## Updated
- `/learning-center/index.html` — adds the PGS/CU topic under Education, School, and Careers

## Important
The private Google Apps Script assistant URL is still blank in:
`/pgs/assets/js/site-config.js`

When the Apps Script web app is deployed, paste its `/exec` URL into `assistantUrl`.
