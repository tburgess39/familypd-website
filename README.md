# FamilyPD Guided Identity, Accessibility, and Bilingual Help v4.0.0

This is the complete current package and the single source of truth for the Apps Script project.

Do not combine it with the v2 or v3 ZIP files. Replace the matching project files with the files in this package and add the one new script file listed below.

## What this build adds

- Guided mission, vision, and motto generator
- Plain-language dropdown questions instead of an empty writing screen
- Three editable suggestions for each generated statement
- English and Spanish guided content
- A library of 14 selectable values with simple meanings and household examples
- Editable prepopulated value descriptions
- Custom values
- Simplified role builder with one main role dropdown
- Prepopulated, editable role responsibilities
- Custom roles and custom responsibilities
- Edit and remove controls for the household role list
- Clear message that capable teens, young adults, and other members may lead
- Information icons and short italicized guidance under fields
- First-use tutorial and restartable Help & Tutorials page
- Browser spellcheck support on writing fields
- Read-aloud button using the browser’s speech tools
- Larger-text and simple-language preferences
- Copy-ready AI brainstorming prompt with privacy warnings and step-by-step directions
- Updated official guidebook resource link
- English/Spanish structural headings in generated Household Identity PDFs
- Existing privacy-first Drive permissions and signed Update Packs

## Files to place in Apps Script

### Script files

- `Code.gs`
- `Config.gs`
- `CitationService.gs`
- `DataStoreService.gs`
- `DriveApiService.gs`
- `GuidanceService.gs` **new in v4**
- `IdentityDocumentService.gs`
- `IdentityService.gs`
- `PrivacyGuardService.gs`
- `SecurityService.gs`
- `UpdatePackService.gs`
- `WorkspaceService.gs`

### HTML files

- `Index.html`
- `Scripts.html`
- `Styles.html`

### Manifest

- `appsscript.json`

The `.md` and `.txt` files are documentation only. Do not add them to Apps Script.

## Upgrade from v3

1. Keep the current FamilyPD workspace and Drive files.
2. Replace every existing `.gs` and `.html` file with the matching file from this package.
3. Add a new Apps Script **Script** file named `GuidanceService` and paste in `GuidanceService.gs`.
4. Replace the manifest contents with `appsscript.json`.
5. Save the project.
6. Open **Deploy → Manage deployments**.
7. Edit the current web-app deployment.
8. Select **New version**.
9. Deploy and open the `/exec` URL.
10. Open **Workspace → Repair FamilyPD Structure** once.

Repair migrates the existing JSON data and source file in place. It does not create a duplicate root workspace when the saved Drive IDs are still valid.

## Permissions

This build continues to use:

- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/script.external_request`

It does not add full Drive access or Google Sheets access.

## Language behavior

- The app checks the browser language on first use.
- Users may choose **English** or **Español** in the header.
- The selected language is stored as a workspace preference.
- Menus, guided builders, values, role guidance, tutorials, AI-help instructions, and PDF structure support English and Spanish.
- User-entered mission, vision, values, responsibilities, and other custom text are not silently translated or overwritten.

## Privacy rule

FamilyPD does not require exact personal or sensitive information. Do not enter or upload passwords, account numbers, exact addresses, exact birth dates, identification numbers, medical records, confidential school records, security codes, or similar information.

Examples and sample content use generic labels only.

## Update Pack compatibility

Because v4 adds new identity fields and a new schema version, create new Update Packs after the upgrade. A v4 member workspace should import a v4 pack.
