# FamilyPD OS Property Storage Repair

## Why this happened
Google Apps Script User Properties have a small storage quota. Older FamilyPD builds stored full Family Profile versions, many projects, received shared items, suggestions, and sometimes embedded image data in that limited store. Repeated saves can eventually fill it.

## Install
Replace only:
- `Code.gs`
- `IdentityService.gs`
- `ProjectStudioService.gs`
- `SharingService.gs`

Save all files.

## Run the one-time cleanup
In Apps Script:
1. Select `fpdRepairPropertyStorageQuota` from the function dropdown.
2. Click **Run**.
3. Approve the existing permissions if prompted.
4. Confirm the execution completes successfully.
5. Deploy a new version of the existing web app.

The cleanup preserves the active Family Profile draft and published profile, personal profile, current projects, imported dashboard items, and household connection. It removes duplicate legacy aliases and trims unbounded lists.

## Verify
Run `fpdGetPropertyStorageStatus` to see current usage and the largest stored properties.
