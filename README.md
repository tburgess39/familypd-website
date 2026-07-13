# FamilyPD Privacy-First Foundation v2

This package replaces the earlier broad-permission prototype.

## Critical permission correction

This version does **not** use:

- `DriveApp`
- `SpreadsheetApp`
- `https://www.googleapis.com/auth/drive`
- `https://www.googleapis.com/auth/spreadsheets`

It uses:

- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/script.external_request`

FamilyPD therefore uses the Drive REST API only for files it creates for the workspace or files a user explicitly shares with the app.

## Replace the earlier project files

Replace every earlier FamilyPD `.gs`, `.html`, and `appsscript.json` file with the files in this package.

Final Apps Script file list:

### Script files

- `Code.gs`
- `Config.gs`
- `DriveApiService.gs`
- `DataStoreService.gs`
- `WorkspaceService.gs`
- `SecurityService.gs`
- `UpdatePackService.gs`
- `CitationService.gs`

### HTML files

- `Index.html`
- `Styles.html`
- `Scripts.html`

### Manifest

- `appsscript.json`

Do not combine `appsscript.json` with `Code.gs`.

## Redeploy

1. Save every file.
2. Open **Deploy → Manage deployments**.
3. Edit the web app deployment.
4. Choose **New version**.
5. Execute as **User accessing the web app**.
6. Set access to the signed-in users you are testing with.
7. Deploy.
8. Use the `/exec` URL.

## Remove the old broad authorization before testing

Changing the code does not always make an old permission grant disappear from the Google Account connection list.

Before testing the new consent screen:

1. Open the Google Account security settings for the testing account.
2. Open connections to third-party apps and services.
3. Find the earlier FamilyPD Apps Script connection.
4. Remove its access.
5. Open the new `/exec` deployment URL and authorize again.

The new authorization should not request access to everything in Google Drive or all Google Sheets.

## Data architecture

The workspace now stores its records in two app-created JSON files:

- `FamilyPD_Data.json`
- `FamilyPD_Sources.json`

The Sources file supports:

- source metadata;
- in-text citations;
- References sections;
- data years;
- verification dates;
- citation requirements for research, learning, news, community data, videos, and reports.

## Privacy rule

FamilyPD is for non-sensitive planning information.

Do not enter or upload:

- passwords or authentication codes;
- Social Security or government identification numbers;
- bank, card, routing, or account numbers;
- exact home addresses;
- exact birth dates;
- medical records or diagnoses;
- confidential school records or student identifiers;
- tax records;
- security-system codes;
- detailed legal records;
- information that could be used for identity theft.

The system should be redesigned rather than adding a field that requires exact sensitive information.

## Names and examples

Templates, examples, test records, screenshots, and demonstrations must use generic labels only:

- Household Lead
- Co-Lead
- Family Member
- Adult Member
- Young Adult Member
- Teen Member
- Child Member
- Older Adult Member
- Sample Household

Do not use the developer's name or any family member's name in examples.

## Household Update Packs

Household Update Packs are now signed CSV files.

Why CSV:

- It opens in Google Sheets and Excel.
- It can be downloaded and shared without granting FamilyPD access to all spreadsheets.
- Members select the file from their device.
- FamilyPD verifies the pack before applying it.
- The import replaces only shared household mirrors.
- Personal goals, reflections, progress, and files remain separate.

## Security and authenticity

The app now:

- requires HTTPS;
- allows only exact approved FamilyPD or Google Apps Script prototype hosts;
- blocks workspace actions on an unrecognized hostname;
- shows a first-use security verification modal;
- clearly labels the current Apps Script version as a prototype;
- reminds users to start from `familypd.org`;
- reminds users that Google passwords are never entered into a FamilyPD form;
- signs Household Update Packs and rejects altered or unverified packs;
- retains the default Apps Script framing protection instead of allowing unrestricted embedding.

A popup alone cannot prove authenticity. The hostname and official FamilyPD entry point remain the primary user check.

## Current prototype versus public launch

The Apps Script prototype is expected to run on:

- `script.google.com`
- `script.googleusercontent.com`

The public website should send users to the authorized prototype link during testing.

For the eventual public application, the production host should be:

- `app.familypd.org`

The production app should add server-side CSP, HSTS, secure cookies, CSRF protection, rate limiting, audit logging, and phishing-resistant authentication.
