# Upgrade FamilyPD v5.0.1 to v6.0.0

This is a major feature build, not a two-file maintenance patch.

## Replace matching files

Replace the contents of every matching `.gs`, `.html`, and `appsscript.json` file from the v6 package.

## Add four new Apps Script files

Create these **Script** files:

- `MeetingService`
- `MeetingDocumentService`
- `NewsService`

Create this **HTML** file:

- `MeetingClient`

Paste the contents of the matching package files.

## Deploy

1. Save the Apps Script project.
2. Open **Deploy → Manage deployments**.
3. Edit the current deployment.
4. Choose **New version**.
5. Deploy.
6. Open the `/exec` URL.
7. Open **Workspace → Repair FamilyPD Structure** once.

Do not delete the current FamilyPD Drive folder, data file, source file, goals, or identity records.
