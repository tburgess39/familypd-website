# Upgrade from FamilyPD v2.0.1 to v3.0.0

## Replace these existing files

- `Code.gs`
- `Config.gs`
- `DriveApiService.gs`
- `DataStoreService.gs`
- `WorkspaceService.gs`
- `UpdatePackService.gs`
- `Index.html`
- `Styles.html`
- `Scripts.html`

The included `SecurityService.gs`, `CitationService.gs`, and `appsscript.json` should also replace the current copies so the project exactly matches the complete package.

## Add these new script files

- `PrivacyGuardService.gs`
- `IdentityService.gs`
- `IdentityDocumentService.gs`

## Do not delete the existing Drive workspace

The new code reuses the saved FamilyPD IDs and migrates the JSON structure in place. Do not delete the existing FamilyPD root folder, data file, source file, recovery key, or user properties before upgrading.

## Redeploy

After saving all files:

1. Open **Deploy → Manage deployments**.
2. Edit the web-app deployment.
3. Choose **New version**.
4. Deploy.
5. Open the `/exec` URL.
6. Select **Repair FamilyPD Structure** once after the upgrade.

## Permission screen

The manifest still uses the same narrow permissions. Google should not request access to every Drive file or to all Google Sheets.
