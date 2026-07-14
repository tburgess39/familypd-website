# FamilyPD v7.2.0 — Identity Hub & Navigation Fix

This package contains only the five Apps Script files that changed.

## Replace these Script files

- Config.gs
- GuidanceService.gs

## Replace these HTML files

- Index.html
- Scripts.html
- Styles.html

Do not add duplicate files. Open each existing file, select all of its content,
and replace it with the matching file from this package.

## Deploy

1. Replace only the five files listed above.
2. Save the Apps Script project.
3. Open Deploy > Manage deployments.
4. Edit the current web-app deployment.
5. Select New version.
6. Deploy.
7. Reopen the /exec URL.

Repair is not required. The stored-data schema remains 7.0.0.

## What this fixes

- Prevents the publishedVersion error when packStatus is missing from an older
  or partially updated server response.
- Removes the automatic tutorial popup. The tutorial remains available manually
  from Help & Tutorials.
- Removes the separate Roles & Profile navigation item.
- Places household roles and personal workspace preferences directly inside
  Household Identity.
- Changes the menu label to Household Identity & Roles for Household Leads.
- Keeps Overview, Goals, Meetings, Learning, Update Packs, Help, and Workspace
  directly available in the navigation menu.
- Adds an in-page Household Identity section menu for Examples, Mission & Vision,
  Values, Roles, and My Preferences.
- Adds pillar-based clickable identity examples in English and Spanish.

## Pillar example coverage

For each FamilyPD pillar—Health, Relationships, Education, Finances, and Goals—
the workspace now includes:

- 6 mission examples
- 6 vision examples
- 8 value examples

That is 20 selectable examples per pillar and 100 total examples per language.
Every selected example remains editable.

## Guidebook alignment

The interface follows The Family Personal Development Guidebook by Toni Hall:
mission explains what the household practices, vision describes the household
being built, values describe agreed behavior, and roles make responsibility
visible and shared.
