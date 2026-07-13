# FamilyPD Guided Meeting Planner v6.0.0

Use this complete package as the single source of truth. Do not combine older v5 files with this build.

## What v6 adds

- Guided bilingual Family Meeting Planner
- Draft, Scheduled, Completed, and Archived meeting states
- Meeting date, time, duration, format, general location note, facilitator role, and participant labels
- Any capable household role may be selected to facilitate, including a teen or young adult
- Prewritten English/Spanish topic libraries for:
  - Health
  - Relationships
  - Education
  - Finances
  - Goals
  - Household Organization
- Editable purpose, discussion questions, desired outcome, and planned time for every topic
- Custom topics
- Optional recent-news discussion search
- Article title, source, publication date, and link validation
- One-year news search window, which is newer than FamilyPD’s seven-year maximum
- Article links visible to Household Lead and Family Member workspaces
- Previous-meeting recap and carry-forward of unfinished action items
- Opening message, materials, optional meal/refreshment plan, and closing message
- Meeting notes, decisions, action items, responsible role, target date, and completion status
- Private Family Member meeting preparation
- Agenda and minutes PDFs
- Guidebook in-text citation and References
- Selected news articles listed in the meeting document References
- Structured shared meetings in signed Household Update Packs
- Updated English/Spanish tutorial and Meeting Planner quick guide

## Privacy

Use general participant and facilitator labels. FamilyPD does not require legal names, phone numbers, email addresses, exact addresses, confidential school records, medical information, account balances, passwords, or identification numbers.

Recent-news results are suggestions for discussion. FamilyPD verifies that a selected result contains basic source metadata and a usable link. It does not certify every claim made by the publisher. Users must open and review the article before using it.

## Apps Script project files

### Script files

- `CitationService.gs`
- `Code.gs`
- `Config.gs`
- `DataStoreService.gs`
- `DriveApiService.gs`
- `GoalDocumentService.gs`
- `GoalsService.gs`
- `GuidanceService.gs`
- `IdentityDocumentService.gs`
- `IdentityService.gs`
- `MeetingDocumentService.gs` **new**
- `MeetingService.gs` **new**
- `NewsService.gs` **new**
- `PrivacyGuardService.gs`
- `SecurityService.gs`
- `UpdatePackService.gs`
- `WorkspaceService.gs`

### HTML files

- `Index.html`
- `MeetingClient.html` **new**
- `Scripts.html`
- `Styles.html`

### Manifest

- `appsscript.json`

Markdown and text files are documentation only and are not added to Apps Script.

## Upgrade from v5.0.1

1. Keep the current FamilyPD Drive workspace and JSON files.
2. Replace every matching Apps Script file with the v6 version.
3. Add the four new Apps Script files:
   - `MeetingService`
   - `MeetingDocumentService`
   - `NewsService`
   - `MeetingClient` as an HTML file
4. Save.
5. Open **Deploy → Manage deployments**.
6. Edit the deployment and choose **New version**.
7. Deploy.
8. Open the `/exec` link.
9. Open **Workspace → Repair FamilyPD Structure** once.

The v5 data migrates without deleting household identity, goals, personal goals, or other saved information.
