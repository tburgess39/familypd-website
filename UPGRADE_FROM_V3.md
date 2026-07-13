# Upgrade FamilyPD v3 to v4

Use only the complete v4 package.

## Replace

Replace all matching `.gs` and `.html` files and replace the manifest contents.

## Add

Create one new Apps Script **Script** file:

`GuidanceService`

Paste the contents of `GuidanceService.gs` into it.

## Deploy

Save, deploy a **New version**, open the `/exec` link, and run **Repair FamilyPD Structure** once.

## Keep

Do not delete the existing Drive workspace, JSON data file, Sources file, folders, or prior identity versions.

## Retest

Test the language selector, generator, value library, role builder, tutorial, PDF, and Update Pack after deployment.
