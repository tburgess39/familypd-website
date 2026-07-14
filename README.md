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
- `get-involved/index.html` — Get Involved page and inquiry builder
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


## Get Involved inquiry privacy

The inquiry builder saves entries only in the visitor's browser.
The user must choose to copy the message or open it in their email application.
The website does not submit or store inquiry responses on a server.

## Google Drive workspace integration

- `workspace/index.html` — Google Drive workspace information and controls
- `privacy/index.html` — website and Google Drive integration privacy policy
- `assets/js/workspace-config.js` — one-line Apps Script deployment configuration
- `assets/js/workspace-client.js` — secure popup bridge and PDF payload builder
- `apps-script/familypd-workspace/` — complete Apps Script workspace backend


### Before the buttons work

Deploy the included Apps Script project and replace the placeholder URL in:

`assets/js/workspace-config.js`

Use the web app URL ending in `/exec`.


## Public Resource Hub & Website Launch Center

- `resources/index.html` — bilingual public resource directory
- `resources/library/` — website-ready public resource pages
- `launch-center/index.html` — browser-only public resource builder
- `assets/data/public-resources.json` — resource hub catalog
- `assets/js/resource-hub.js` — language, search, and filter controls
- `assets/js/public-resource-page.js` — bilingual starter-resource renderer
- `assets/js/resource-launch-center.js` — templates, review, preview, draft import/export, and ZIP content-kit generation

The Launch Center does not connect GitHub to a private FamilyPD Drive workspace. Publishing remains a manual review and upload process.


## FamilyPD Kids & Teens

- `kids/index.html` — public Kids & Teens hub for ages 4–18
- `kids/creator-lab/index.html` — bilingual interactive youth project generator
- `assets/data/youth-project-ideas.json` — age-, pillar-, and project-based challenge library
- `assets/js/youth-creator-lab.js` — idea generation, local saving, copying, downloading, and printing

The Creator Lab does not collect or publish children’s submissions and does not connect to Google Drive or GitHub.
