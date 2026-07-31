# FamilyPD quiz-protection patch

Upload the included `learning` folder into the root of the FamilyPD GitHub repository and replace matching files.

## What this fixes
- Removes plainly readable correct-answer values from HTML `data-answer` attributes.
- Uses per-page salted SHA-256 answer checks.
- Prevents the simple console command shown in the screenshot from locating and clicking every correct answer.
- Preserves feedback, scoring, reset buttons, and accessibility.

## Important limitation
A quiz running entirely on GitHub Pages is client-side. A determined user can always alter the page in Developer Tools or reverse-engineer the JavaScript. True answer secrecy requires checking answers on a server or serverless function.
