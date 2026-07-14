# FamilyPD v8.0.0 — Systems, Policies & Safety

This package contains only the Apps Script files that changed or are new.

## Replace these existing Script files

- Code.gs
- Config.gs
- DataStoreService.gs
- GuidanceService.gs
- UpdatePackService.gs

## Replace these existing HTML files

- Index.html
- Scripts.html
- Styles.html

## Add these new Script files

- SystemsService.gs
- SystemsDocumentService.gs

## Add this new HTML file

- SystemsClient.html

Do not replace appsscript.json or any file not listed above.

## Deployment

1. Replace the eight existing files listed above.
2. Add the two new Script files and one new HTML file.
3. Save the Apps Script project.
4. Open Deploy > Manage deployments.
5. Edit the current web-app deployment.
6. Select New version.
7. Deploy and reopen the /exec URL.
8. Open Workspace and run Repair FamilyPD Structure once.

Repair creates the new Systems Policies and Safety Drive folder and migrates
the new guidebook citation. It does not delete existing identity, roles, goals,
meetings, learning plans, Update Packs, preferences, or files.

## Build 8 features

- Systems, Policies & Safety in the main navigation
- 30 English templates and 30 matching Spanish templates
- Five templates for Health, Relationships, Education, Finances, Goals, and
  Household Organization
- Policy, System, Checklist, and Safety Plan record types
- General role assignments and participant labels
- Editable purpose, agreement, steps, review frequency, dates, and notes
- Dashboard counts and upcoming reviews
- Mark Reviewed action with automatic next-review calculation
- Bilingual PDFs with Hall, 2025 citations and References
- Read-only Family Member access through signed Update Packs
- General safety reminders without emergency contacts or other sensitive data

## Safety and privacy

FamilyPD safety templates are general planning reminders. They do not replace
official guidance, emergency services, medical care, legal advice, financial
professionals, or qualified safety professionals.

Do not enter exact addresses, emergency contacts, diagnoses, medical details,
account numbers, passwords, identification documents, or details revealing
when a home is empty.
