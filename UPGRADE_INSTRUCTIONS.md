# FamilyPD v9.1.0 — Accessibility & Reliability

This package contains only the Apps Script files that changed or are new.

## Replace these existing Script files

- Code.gs
- Config.gs
- GuidanceService.gs
- LearningService.gs
- NewsService.gs
- OpportunityService.gs
- ResourceVerificationService.gs

## Replace these existing HTML files

- Index.html
- LearningClient.html
- MeetingClient.html
- OpportunityClient.html
- Scripts.html
- Styles.html

## Replace the Apps Script manifest

- appsscript.json

This is the special Apps Script project manifest—not a reference JSON file.

To display it:

1. Open Apps Script.
2. Open Project Settings.
3. Select Show "appsscript.json" manifest file in editor.
4. Open the existing appsscript.json.
5. Replace all of its contents with the included file.

Do not add a second manifest.

## Add this new HTML file

- AccessibilitySupportClient.html

Create it using the Apps Script + button and choose HTML.

## Deploy

1. Replace the fourteen existing files listed above.
2. Add AccessibilitySupportClient as one new HTML file.
3. Save the project.
4. Open Deploy > Manage deployments.
5. Edit the current web-app deployment.
6. Select New version.
7. Deploy.
8. Reopen the /exec link.

Repair is not required. The stored-data schema did not change.

## What this fixes

### Language switching

- Prevents an older IdentityService from causing: IdentityService.saveInterfacePreferences is not a function.
- Changes the visible language immediately.
- Saves language preferences through a compatibility path when necessary.
- Refreshes Goals, Meetings, Learning, Opportunities, and Systems separately.
- One failed service no longer stops the rest of the Spanish interface.
- Registers newly generated page content for translation after each refresh.

### Reading and writing support

Every editable input, textarea, and dropdown inside the workspace receives a Choices / Opciones button.

The support drawer can explain the question, read the question or current answer aloud, read the visible section, show dropdown choices, and provide editable examples or starter wording. It also supports dynamically created agenda items, steps, questions, resources, checkpoints, and action items.

### Recent stories

- Uses multiple GDELT request formats and time windows.
- Does not stop the meeting planner when GDELT is unavailable.
- Shows recent Google News and Bing News search links and selected official newsrooms.
- Families can choose one current article and paste its exact HTTPS link.

### Public-link checker

The checker separately reports HTTPS format, public-domain status, certificate/page response when completed, redirects, automated-access limits, and domains outside the deployment URL allowlist. It never claims to verify nonprofit status, reputation, factual accuracy, malware safety, eligibility, or current availability.

The Apps Script manifest now allowlists GDELT, FamilyPD.org, NevadaPartners.org, Google Drive, and the official opportunity and mobility resources used by the application.

### Socioeconomic mobility

The Opportunities page now explains socioeconomic mobility in plain language and provides six pathways: skills and credentials; stable work and income; financial stability and assets; health, housing, and transportation; networks and social capital; and voice, systems, and community access.

It includes starter actions and guided cards for Opportunity Atlas, Opportunity Insights community data, Urban Institute Upward Mobility, and Census MOVS. Community data are presented as patterns—not predictions about a person or family.
