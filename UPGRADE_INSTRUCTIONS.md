# FamilyPD v9.4.0 — Reliability, Family AI UI, and Website Connection

## Replace these Apps Script files
- `Code.gs`
- `Config.gs`
- `Index.html`
- `Scripts.html`
- `Styles.html`

## Add these Apps Script files
- `FamilyAiClient.html`

## Optional backend connector template
- `FamilyAiBackendConnector.example.html`

Your son can rename the template to `FamilyAiBackendConnector.html`, replace the endpoint, and include it immediately before `FamilyAiClient` in `Index.html`.

## Website connection file
- Replace the website's `app/index.html` with `website-app-index.html`.
- In that file, replace `REPLACE_WITH_APPS_SCRIPT_EXEC_URL` with the deployed `/exec` URL for the FamilyPD Apps Script web app.
- Commit and publish the website update. The public FamilyPD App page will then open the working private workspace.
- Later, `app.familypd.org` can be configured as a branded redirect or gateway to the same deployment.

## Important
Do not replace unchanged service files. This package is intentionally changed/new files only.
