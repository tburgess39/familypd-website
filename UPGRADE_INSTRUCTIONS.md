# FamilyPD v9.3.0 — Learning & Resource Hub update

## Add these new files
- ResourceHubService.gs
- ResourceHubClient.html

## Replace these existing files
- Code.gs
- Index.html
- Styles.html

## What changed
- Adds **Learn, Grow & Find Help** inside the existing Learning panel.
- Adds a curated catalog of trusted starting resources across learning, school platforms, IEP/504 support, careers, worker rights, basic needs, finances, health, mindset/books, safety, parenting, and family legacy.
- Adds search, category filtering, free-resource filtering, direct resource links, and copy-link controls.
- Adds three copy-ready AI prompts for learning almost anything, learning school platforms, and preparing for IEP/504 meetings.
- Introduces FamilyPD's Family Operating System positioning inside the application without changing existing Drive scopes.

## Installation order
1. Add the two new files to the Apps Script project using the exact names above.
2. Replace Code.gs, Index.html, and Styles.html.
3. Save all files.
4. Deploy a new web-app version.
5. Open Learning & Discussions and verify the resource catalog loads.

## Scope note
This update uses a built-in catalog and does not add Drive, Gmail, Calendar, or external-service scopes. Opening a resource happens in the user's browser.
