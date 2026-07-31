# Unofficial CCSD PGS Assistant — Performance & Permission Update

## What changed

- OAuth Drive scope reduced from full Drive access to `drive.file`.
- Spreadsheet access remains because the app stores CU records in its workbook.
- The app still runs as the user accessing it so each educator keeps a separate workspace.
- Startup no longer scans every evidence folder/file for Trash status.
- Workbook sheets, rules, formatting, and protections are rebuilt only when the app version changes or a required sheet is missing.
- Global Drive name searches were removed.
- Workspace status uses saved IDs during normal startup; the explicit health check performs full validation.
- PDF-Lib is no longer embedded in every initial page load. It loads only when a PDF feature is used.

## Replace the Apps Script project

The included `.gs`, `.html`, and `appsscript.json` files can replace the matching files in the Apps Script editor.

The optimized JSON export is also included for archival/reference.

## Deployment

Create a new deployment version after replacing the files. Existing users may see a new authorization screen because the scope changed. The new scope is narrower than the previous full-Drive permission.

## Important

Keep **Execute as: User accessing the web app** if each educator should maintain their own workbook and Drive folders. Deploying as the owner would combine user data in the owner's account and is not recommended for this app.
