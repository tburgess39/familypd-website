# FamilyPD Workspace Foundation v1

This is the first working Google Apps Script foundation for the FamilyPD website/workspace system.

## Included in this build

- Role-based onboarding:
  - Household Lead
  - Family Member
- Google Drive workspace creation
- Separate folder structures by role
- Separate workbook schemas by role
- Reuse and repair of existing folders/files
- Direct file-ID storage in `UserProperties`
- `UserLock` protection against duplicate workspace creation
- Lightweight startup: `doGet()` only serves the HTML shell
- Household Update Pack creation for household leads
- Household Update Pack preview/import for family members
- Personal member data is preserved during imports
- Source and citation tables
- Citation service for in-text citations and References
- Responsive starter dashboard for desktop, tablet, and phone
- Placeholders for the next FamilyPD tools

## Important citation rule

Every research-based learning item, news summary, community data story, awareness video page, report, and generated PDF must include:

1. visible in-text citations near the supported claim; and
2. a complete References section.

The app includes `Sources` and `ContentCitations` sheets in both role workbooks. See `CITATION_STANDARD.md`.

## Install in Google Apps Script

1. Create a new **standalone Google Apps Script** project.
2. Delete the starter `Code.gs` contents.
3. Add each `.gs` and `.html` file from this package using the same filename.
4. Open **Project Settings** and enable **Show `appsscript.json` manifest file in editor**.
5. Replace the manifest with the included `appsscript.json`.
6. Save all files.
7. Select **Deploy → New deployment → Web app**.
8. Set:
   - **Execute as:** User accessing the web app
   - **Who has access:** Anyone with a Google account during public testing, or your preferred tester group
9. Deploy and authorize the requested Google Drive and Sheets permissions.
10. Open the web app URL.

## Development testing

Use **Deploy → Test deployments** for the `/dev` URL. Only users with edit access to the script project can use the development URL.

## Why the app asks for Drive access

The Household Lead must be able to create, reconnect, rename, move, archive, and later trash FamilyPD folders/files in the user's own Drive. This foundation therefore uses the Google Drive and Google Sheets scopes.

## Performance choices already built in

- `doGet()` performs no Drive scan or workbook creation.
- Startup validates only saved direct IDs.
- Folder repair searches only expected parent folders.
- Sheets use batch `setValues()` calls.
- Workspace creation uses a user-scoped lock.
- Historical detail pages will be loaded only when opened.
- YouTube videos will be embedded by ID later rather than uploaded to Apps Script or Drive.

## Household Update Packs

### Household Lead

Select **Create Update Pack**. The app creates a versioned Google Sheet in:

`09 - Household Update Packs`

Only records marked as shared are exported.

### Family Member

Paste the shared Google Sheet URL or spreadsheet ID, preview it, and apply it.

The import replaces only the shared mirror tabs:

- Household Identity
- Family Values
- Family Members
- Shared Goals
- Upcoming Meetings
- Assignments
- Shared Policies
- Safety Information
- Shared Resources
- Sources
- Content Citations

It does not replace personal goals, checkpoints, reflections, saved content, or personal files.

## Data-entry values used by update packs

For lead records to appear in a pack:

- `ShareWithMembers`: enter `TRUE`, `YES`, `Y`, `1`, `SHARE`, or `SHARED`
- `Visibility`: enter `HOUSEHOLD`

The editable interfaces added in later builds will set these values automatically.

## Next build

The next build should add:

1. Household Lead Identity editor
2. Family Member household-information viewer
3. Mission/vision version history
4. Values and commitments editor
5. Household logo/image selection
6. Family-member roster
7. Household Update Pack controls integrated into identity publishing
