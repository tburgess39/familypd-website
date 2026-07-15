# FamilyPD OS v11 Launch Readiness — Installation

## Apps Script
Replace these files:
- `Code.gs`
- `Index.html`
- `Scripts.html`
- `Styles.html`

Add this new file:
- `SharingService.gs`

Do not delete or replace other Apps Script files. This build expects your existing `UpdatePackService.gs`, `IdentityService.gs`, `WorkspaceService.gs`, `DataStoreService.gs`, and other working services to remain installed.

After saving all files:
1. Select **Deploy → Manage deployments**.
2. Edit the existing web-app deployment.
3. Select **New version**.
4. Deploy.
5. Test the `/exec` address in an incognito window with one Household Lead account and one Family Member account.

## Website top-menu text repair
Copy:
- `Website_Update/assets/css/familypd-os-nav-fix.css`
- `Website_Update/assets/js/familypd-os-nav-fix.js`

into the matching website folders.

Then add these two lines to the `<head>` of the website's shared/root page after the existing main stylesheet:

```html
<link rel="stylesheet" href="assets/css/familypd-os-nav-fix.css">
<script defer src="assets/js/familypd-os-nav-fix.js"></script>
```

For pages inside subfolders, adjust the relative path, such as `../assets/...` or `../../assets/...`.

The script repairs an empty FamilyPD OS navigation label and the stylesheet prevents global hover/visited rules from hiding the text.
