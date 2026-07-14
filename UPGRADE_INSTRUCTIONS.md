# FamilyPD v9.0.0 — Opportunities & Socioeconomic Mobility

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

- OpportunityService.gs
- OpportunityDocumentService.gs

## Add this new HTML file

- OpportunityClient.html

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

Repair creates the Opportunities and Mobility Drive folder and adds the current
official-source records and guidebook citation. It does not delete identity,
roles, goals, meetings, learning plans, systems, Update Packs, preferences, or
existing generated files.

## Build 9 features

- Opportunities & Mobility in the main navigation
- Quick official-source finder with only category and audience required
- Optional keyword and general location
- Fourteen official or government-sponsored starting-point tools
- Direct public HTTPS link checking
- Career, job, training, credential, apprenticeship, scholarship, financial
  aid, college, workforce, benefits, small-business, and service categories
- Shared household and private personal opportunity records
- Requirements, questions, next action, action steps, due dates, and status
- Dashboard counts and upcoming deadlines
- Personal copies of read-only shared opportunities
- Bilingual PDFs with Hall, 2025 citations and References
- Signed Update Pack sharing for shared household opportunities

## Important limitation

FamilyPD opens official search tools and checks public links. It does not scrape
private accounts, guarantee that a listing remains open, determine eligibility,
or submit applications. Confirm deadlines, cost, eligibility, availability, and
application instructions on the current provider page.

## Privacy

Do not enter Social Security numbers, identification numbers, account details,
passwords, uploaded documents, medical information, exact addresses, or other
confidential application information in FamilyPD.
