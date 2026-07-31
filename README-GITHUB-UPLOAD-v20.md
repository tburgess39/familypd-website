# FamilyPD PGS Access and Apps Script Recovery v20

Upload the contents of this ZIP into the root of the FamilyPD GitHub repository and replace matching files.

## What this fixes
- Adds a visible **PGS Assistant** link to the main site navigation through `assets/js/main.js`.
- Adds a PGS Assistant card to the main Resources page.
- Restores the complete public `/pgs/` page and `/learning-center/pgs-contact-units/` guide.
- Replaces the CU placeholder mark with the official FamilyPD logo. Clicking the logo returns to `https://familypd.org/`.
- Adds the complete Google Apps Script source under `/pgs/apps-script-source/`.
- Adds a downloadable source package and visible deployment instructions on the PGS page.
- Updates the Apps Script `Index.html` to use the FamilyPD logo linked to the FamilyPD homepage.

## Important: the private app cannot run directly on GitHub Pages
The Apps Script source is included, but it still must be deployed from a Google Apps Script project. The current `pgs/assets/js/site-config.js` has an empty `assistantUrl`, because no deployed `/exec` URL was present in the uploaded files.

After deploying or recovering the Apps Script web app, edit:

`pgs/assets/js/site-config.js`

and set:

```js
window.PGS_SITE_CONFIG = {
  assistantUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
};
```

Do not use the `/dev` test URL for the public website.
