# FamilyPD Cybersecurity Family Practice Contrast Fix v26

The earlier fix targeted the older cybersecurity callout. The screenshot shows
that the current page uses a different dark Family Practice section and dark
inner cards, so the old selector did not reach that text.

This patch fixes the exact section headed:

“Strengthen one part of your family’s digital safety system.”

It:
- makes the main heading and card headings white;
- makes paragraph text inside the dark cards a readable light blue-white;
- makes the FAMILY PRACTICE label light orange;
- applies the correction through both the site stylesheet and cybersecurity stylesheet;
- includes a small markup-independent JavaScript safeguard so the fix continues
  to work if the section's class names change.

Changed files only:
- assets/css/styles.css
- assets/js/main.js
- learning/familypd-cyber-assets/familypd-cyber.css

Upload the included folders to the repository root and replace the matching files.
After GitHub Pages redeploys, use Ctrl+Shift+R or Command+Shift+R.
