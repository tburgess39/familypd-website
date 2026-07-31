# FamilyPD PGS Useful Links Hard Fix v30

The screenshot shows the website is still serving the OLD Useful Links markup:
all titles and descriptions are running together as one paragraph.

That is not the v28 layout. This package forces the corrected card layout and
also makes it easy to confirm the new page actually deployed.

Changed files only:
- pgs/index.html
- pgs/assets/css/site.css

Important upload steps:
1. Open the ZIP.
2. Upload the included `pgs` folder to the ROOT of the GitHub repository.
3. Replace both matching files:
   - pgs/index.html
   - pgs/assets/css/site.css
4. Confirm GitHub shows the updated commit.
5. Wait for GitHub Pages deployment to finish.
6. Open `https://familypd.org/pgs/?v=30` in a new private/incognito tab.

What v30 adds:
- cache-busted stylesheet reference: `site.css?v=30`;
- critical card-layout CSS embedded directly in `pgs/index.html`;
- mobile one-column cards;
- readable spacing between every link;
- three organized groups;
- financial-growth/help message;
- a version marker in the HTML source.

If the page still shows the text from the screenshot after opening `/pgs/?v=30`,
the repository is still serving the old `pgs/index.html`, meaning the replacement
did not reach the live branch or the GitHub Pages deployment did not complete.
