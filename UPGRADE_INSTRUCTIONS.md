# FamilyPD v7.1.0 — Quick Meeting & Dashboard Update

This package contains only the eight Apps Script files that changed.

## Replace these existing Script files

- Code.gs
- Config.gs
- MeetingService.gs
- NewsService.gs
- ResourceVerificationService.gs

## Replace these existing HTML files

- Index.html
- MeetingClient.html
- Styles.html

## Do not replace anything else

Do not change appsscript.json or any file not listed above.

## Deploy

1. Replace only the eight files in this package.
2. Save the Apps Script project.
3. Open Deploy > Manage deployments.
4. Edit the current web-app deployment.
5. Select New version.
6. Deploy and reopen the /exec URL.

Repair is not required. The data schema remains v7.0.0.

## What changed

- Added a Quick Meeting form with dropdowns and suggested topics.
- Added optional recent-story selection.
- Added one-field public article link checking.
- Automatically uses the page title and domain when available.
- Added the next three scheduled meetings to the dashboard.
- Preserved the full meeting planner for detailed editing.
- Preserved Toni Hall/Hall guidebook references.
