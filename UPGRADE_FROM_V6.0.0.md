# FamilyPD v7.0.0 Upgrade — Changed/New Files Only

This package intentionally excludes unchanged files.

## Replace these existing Apps Script files

### Script files
- Code.gs
- Config.gs
- DataStoreService.gs
- GoalDocumentService.gs
- GoalsService.gs
- GuidanceService.gs
- IdentityDocumentService.gs
- IdentityService.gs
- MeetingDocumentService.gs
- MeetingService.gs
- PrivacyGuardService.gs
- UpdatePackService.gs

### HTML files
- Index.html
- MeetingClient.html
- Scripts.html
- Styles.html

## Add these new Apps Script files

### Add as Script files
- LearningDocumentService.gs
- LearningService.gs
- ResourceVerificationService.gs

### Add as an HTML file
- LearningClient.html

## Do not replace these unchanged files

Do not touch appsscript.json, CitationService.gs, DriveApiService.gs,
SecurityService.gs, WorkspaceService.gs, or other files not listed above.

## Deploy

1. Replace or add only the files listed above.
2. Save the Apps Script project.
3. Open Deploy > Manage deployments.
4. Edit the current web-app deployment.
5. Select New version.
6. Deploy and open the /exec URL.
7. Open Workspace > Repair FamilyPD Structure once.

Repair migrates existing data in place. It does not delete the current Drive
workspace, identity, goals, meetings, preferences, or files.

## Official guidebook correction

Repair also updates the saved source record to:

The Family Personal Development Guidebook: If charity starts at home, growth and success should too.
Author: Toni Hall
Formats: Kindle Edition & Paperback

In-text citations use Hall, 2025. Identity, goal, meeting, and learning PDFs
use Toni Hall/Hall instead of T. Carolina.
