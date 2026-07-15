# FamilyPD OS v9.4.1 Recovery + Family AI

This package restores the visible FamilyPD OS workspace and keeps the Resource Hub and Family AI page.

## Apps Script: replace these files
- Code.gs
- Config.gs
- Index.html
- Scripts.html
- Styles.html

## Apps Script: add or replace these files
- ResourceHubClient.html
- ResourceHubService.gs
- FamilyAiClient.html

Do not delete any other existing Apps Script files.

## Redeploy
1. Save all files.
2. Deploy > Manage deployments.
3. Edit the current web-app deployment.
4. Choose New version.
5. Deploy.
6. Open the /exec URL in a private/incognito window.

## Website connection
The website file is included at:
Website_Update/app/index.html

1. Replace the public website repository's /app/index.html with this file.
2. Replace REPLACE_WITH_APPS_SCRIPT_EXEC_URL with the current FamilyPD Apps Script /exec URL.
3. Commit and publish the website.

The ZIP cannot publish to the live website by itself. The repository must be updated and deployed.
