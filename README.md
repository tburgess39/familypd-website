# FamilyPD Household Identity & Profiles v3.0.0

This is the complete privacy-first Apps Script package. It replaces the v2.0.1 project files and upgrades an existing FamilyPD workspace in place.

## What this build adds

### Household Lead

- Draft and publish a household label, vision, mission, and optional motto
- Create three-to-five recommended household values with daily-life definitions
- Create household commitments
- Add a symbolic household image, limited to PNG, JPEG, or WebP files of 1 MB or less
- Maintain a general household role roster without names or contact information
- Designate Lead, Co-Lead, and Member responsibility labels
- Save general profile and learning preferences
- Preserve published identity version history
- Restore an earlier published version into the draft area
- Generate a print-ready household identity PDF
- Include an in-text guidebook citation and References page in the PDF
- Create signed Household Update Packs containing only published shared information

### Family Member

- Review the published household identity in read-only form
- Review published values, commitments, and general household roles
- Receive the symbolic household image through a signed update pack
- Save general profile and learning preferences
- Save private identity suggestions that are not automatically sent to the Household Lead
- Import and verify a signed Household Update Pack

## Privacy-first rules

This build does not require:

- legal names;
- family member names;
- exact ages or birth dates;
- email addresses;
- phone numbers;
- schools or employers;
- exact addresses;
- financial account information;
- medical records;
- confidential school information;
- government identification information.

A server-side privacy guard blocks common patterns that resemble email addresses, phone numbers, Social Security numbers, long financial account numbers, passwords, authentication codes, exact street addresses, and other information FamilyPD does not need.

The symbolic image feature is for a logo, icon, drawing, or other non-personal symbol. The interface tells users not to upload faces, identification, addresses, documents, or private information.

## FamilyPD guidebook alignment

The identity workspace follows the current Family Personal Development guidebook:

- vision describes where the household is going;
- mission describes what the household practices to move there;
- values describe how members agree to treat one another;
- roles make responsibilities visible and shared;
- simple, honest language is preferred over formal or complicated wording.

The app cites the guidebook in the identity guidance and includes the reference in generated identity PDFs.

## Permission model

This build continues to use:

- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/script.external_request`

It does not use:

- full Google Drive scope;
- Google Sheets scope;
- `DriveApp`;
- `SpreadsheetApp`;
- Drive-wide file searches.

Workspace records remain in FamilyPD-created JSON files.

## Complete Apps Script file list

### Script files

- `Code.gs`
- `Config.gs`
- `DriveApiService.gs`
- `DataStoreService.gs`
- `WorkspaceService.gs`
- `SecurityService.gs`
- `PrivacyGuardService.gs`
- `IdentityService.gs`
- `IdentityDocumentService.gs`
- `UpdatePackService.gs`
- `CitationService.gs`

### HTML files

- `Index.html`
- `Styles.html`
- `Scripts.html`

### Manifest

- `appsscript.json`

## Install or upgrade

1. Download and extract this package.
2. In Apps Script, replace the contents of every matching `.gs` and `.html` file.
3. Add the three new script files:
   - `PrivacyGuardService.gs`
   - `IdentityService.gs`
   - `IdentityDocumentService.gs`
4. Keep `appsscript.json` as a separate manifest file.
5. Save all files.
6. Open **Deploy → Manage deployments**.
7. Edit the current web-app deployment.
8. Select **New version**.
9. Keep **Execute as: User accessing the web app**.
10. Deploy and open the `/exec` URL.

An existing v2 workspace is migrated in place when identity data is first opened or when **Repair FamilyPD Structure** is selected. The app reuses the saved root folder, JSON data file, source file, and folder IDs instead of creating a duplicate workspace.

## Recommended testing order

1. Open the Household Lead workspace.
2. Open **Household Identity**.
3. Save the vision, mission, motto, values, commitments, and role roster separately.
4. Add an optional non-personal household symbol.
5. Publish identity version 1.
6. Generate the published identity PDF.
7. Create a Household Update Pack.
8. Open a Family Member workspace in a separate approved test account.
9. Import the update pack.
10. Confirm the member sees the published identity, roles, and symbol.
11. Confirm personal profile preferences and identity suggestions remain private.
12. Edit the lead identity and publish version 2.
13. Restore version 1 to the draft area and confirm the currently published version does not change until republished.

## Important limitation about Co-Lead

The Co-Lead setting in this build is a household responsibility designation. It does not grant another Google account direct editing access to the Household Lead workspace. True multi-account collaborative editing requires a later authenticated synchronization architecture and should not be simulated by collecting email addresses or sharing passwords.
