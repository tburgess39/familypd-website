# Family Personal Development Website

Starter static website for Family Personal Development.

## Files

- `index.html` — homepage
- `about/index.html` — About page
- `approach/index.html` — Our Approach page
- `toolkit/index.html` — Family Toolkit directory
- `toolkit/meeting-planner/index.html` — selectable-topic meeting planner and print document
- `toolkit/pillar-check/index.html` — Five-Pillar Check-In
- `toolkit/mission-vision/index.html` — Mission & Vision Builder
- `toolkit/roles-responsibilities/index.html` — Roles & Responsibilities
- `toolkit/goal-planner/index.html` — Family Goal Planner
- `toolkit/news-discussion/index.html` — verified current-news discussion tool
- `assets/data/family-news.json` — curated story collection
- `programs/index.html` — Programs & Services page
- `impact/index.html` — Impact & Accountability page
- `assets/css/styles.css` — shared design system and responsive layout
- `assets/js/main.js` — mobile navigation and dynamic copyright year
- `404.html` — GitHub Pages fallback page

## Local preview

Open `index.html` in a browser.

## Publish with GitHub Pages

1. Upload these files to the root of the `familypd-website` repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`.
5. Save.
6. GitHub will provide a preview URL.

Do not point `familypd.org` to GitHub Pages until the replacement site has been reviewed.


## Toolkit privacy

Toolkit entries are saved only in the visitor's browser using `localStorage`.
The static website does not transmit or store worksheet responses on a server.


## Updating the verified news collection

Edit `assets/data/family-news.json`.

Each story must include:
- a reliable original source;
- a publication date within seven years;
- at least one Family PD pillar;
- a short factual summary;
- proactive family actions;
- discussion prompts;
- the original article URL.

The website automatically sorts stories newest-first and hides stories older than seven years.
