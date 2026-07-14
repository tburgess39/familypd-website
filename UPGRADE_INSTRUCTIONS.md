# FamilyPD v7.2.2 — Role & Household-Member Dropdown Fix

Replace only these four existing files.

## Script file
- Config.gs

## HTML files
- Index.html
- Scripts.html
- Styles.html

Open each existing file, select all content, and paste the matching replacement.
Do not create duplicate files.

## Deploy
1. Replace only the four files listed above.
2. Save the Apps Script project.
3. Open Deploy > Manage deployments.
4. Edit the current web-app deployment.
5. Select New version.
6. Deploy.
7. Reopen the /exec URL.

Repair is not required.

## What this fixes
- Role-template dropdown always has English and Spanish choices.
- General role, age group, learning format, check-in rhythm, and sharing
  preference dropdowns remain populated even when an older response omits
  their option arrays.
- Household-member assignment is now a dropdown.
- General labels include Adult Member A, Young Adult Member A, Teen Member A,
  Child Member A, and similar choices.
- Custom general label reveals an optional editable field.
- Editing a saved role restores the household-member dropdown selection.
