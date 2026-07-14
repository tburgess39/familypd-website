# FamilyPD v9.2.0 — Guided Flow, Language Refresh & Workspace Health

Replace only these existing files.

## Script files

- Code.gs
- Config.gs
- GuidanceService.gs
- UpdatePackService.gs
- WorkspaceService.gs

## HTML files

- AccessibilitySupportClient.html
- Index.html
- OpportunityClient.html
- Scripts.html
- Styles.html

Open each existing file, select all of its content, and paste the matching
replacement. Do not create duplicate files.

appsscript.json did not change and is not included.

## Deployment

1. Replace the ten files.
2. Save the Apps Script project.
3. Open Deploy > Manage deployments.
4. Edit the web-app deployment.
5. Select New version.
6. Deploy.
7. Reopen the /exec link.

Repair is not required for the upgrade. FamilyPD now performs a workspace-health
check at startup and displays Repair Workspace only when a required folder or
core file is missing, inaccessible, or in Trash.

## Improvements

- Controlled automatic refresh when switching English or Spanish
- Return to the previously open feature after the refresh
- Spanish workspace-health messages
- Navigation text wrapping for longer Spanish labels
- Seven-step Household Identity guided flow
- Five-step Opportunities guided flow
- Expanded feature tutorial with Open this feature buttons
- Question-level Help & choices with definitions and examples
- No sentence examples inserted into URL, date, time, or number fields
- Stop Reading control
- Family Sharing terminology and meaningful exported filenames
- Forced workspace setup and startup health verification
