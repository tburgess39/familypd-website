# FamilyPD v7.2.0 Test Checklist

## Immediate error fix

- Open the deployed /exec link.
- Confirm the workspace loads without:
  Cannot read properties of undefined (reading 'publishedVersion')
- Confirm the published identity badge shows either a version or Not published.

## Navigation

- Confirm the menu shows:
  - Overview
  - Household Identity & Roles
  - Goals & Checkpoints
  - Meetings
  - Learning & Discussions
  - Update Packs
  - Help & Tutorials
  - Workspace
- Confirm there is no separate Roles & Profile menu item.
- Open Household Identity & Roles.
- Confirm the in-page buttons scroll to Examples, Mission & Vision, Values,
  Roles, and My Preferences.

## Household Identity examples

For every pillar:

- Health
- Relationships
- Education
- Finances
- Goals

Confirm the dropdown shows:

- 6 mission examples
- 6 vision examples
- 8 value examples

Confirm:

- Selecting a mission places it in the Mission field.
- Selecting a vision places it in the Vision field.
- Selecting a value adds it to Selected Values.
- All selected wording remains editable.
- The eight-value workspace limit is still enforced.

## Roles and preferences

- Confirm Guided Role Builder appears on the Household Identity page.
- Confirm My FamilyPD Preferences appears on the same page.
- Save a role and profile preferences.
- Reload and confirm they remain saved.
- Test the Family Member workspace and confirm published roles and personal
  preferences appear on the Household Identity page.

## Popup and language

- Clear site storage or test in a private window.
- Confirm the tutorial does not open automatically.
- Open Help & Tutorials and confirm Restart Tutorial still opens it manually.
- Switch English -> Español -> English three times.
- Confirm navigation, example dropdowns, cards, roles, and preferences fully
  return to the selected language.

## Regression

- Confirm Goals, Meetings, Learning, Update Packs, PDFs, Drive links, and the
  Quick Meeting dashboard still work.
- Confirm generated references continue to use Toni Hall / Hall, 2025.
