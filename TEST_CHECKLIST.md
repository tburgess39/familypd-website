# FamilyPD v9.1.0 Live Test Checklist

## Installation

- Confirm all replacement files were replaced, not duplicated.
- Confirm AccessibilitySupportClient was added as an HTML file.
- Confirm appsscript.json was replaced as the project manifest.
- Confirm OAuth scopes remain only drive.file and script.external_request.
- Deploy a New version and reopen the /exec link.
- Do not run Repair.

## English and Spanish

- Switch English -> Español -> English at least three times.
- Confirm no saveInterfacePreferences error appears.
- Confirm the main navigation, dynamic cards, and dropdown choices change language.
- Confirm Goals, Meetings, Learning, Opportunities, and Systems continue refreshing even when one service reports an error.
- Confirm user-written answers are preserved rather than translated.

## Quick Help and read aloud

Test representative fields in Household Identity, Roles, Goals, checkpoints, Quick Meeting, Full Meeting Planner, private meeting preparation, Learning, Opportunities, and Systems.

- Confirm a Choices / Opciones button appears beside editable fields.
- Confirm the question is explained.
- Read the question and current answer aloud.
- Select an editable starter example.
- Add a dynamic step, agenda item, question, or action and confirm the new field receives support.
- Read the visible page/section and confirm it includes headings, questions, selections, and entered answers.

## Recent stories

- Search in Quick Meeting and Full Meeting Planner.
- Confirm GDELT results appear when available.
- Confirm Google News and Bing News fallback cards appear instead of an error when GDELT does not respond.
- Choose an article and paste the exact HTTPS link.

## Link checker

Test https://familypd.org/, https://nevadapartners.org/, an official opportunity resource, a normal public HTTPS article, an HTTP-only link, localhost, a private/numeric IP, and a malformed URL.

Confirm the result distinguishes secure HTTPS format, public domain, certificate/page response when completed, limited automated checking, HTTP status, and redirects. Confirm it does not claim organization, nonprofit, content, or safety verification.

## Socioeconomic mobility

- Confirm the definition appears in English and Spanish and can be read aloud.
- Confirm all six mobility pathways appear.
- Confirm starter actions open a prepopulated editable opportunity plan.
- Open Opportunity Atlas, Opportunity Insights, Urban Upward Mobility, and Census MOVS.
- Confirm each resource includes a clear explanation, suggested family use, and the caution that community patterns do not determine an individual's potential or future.

## Regression

Confirm Identity, roles, goals, checkpoints, meetings, PDFs, learning, opportunity plans, systems, Update Packs, Drive links, and Household Lead/Family Member views still work.
