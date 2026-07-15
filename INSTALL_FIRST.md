# FamilyPD OS v10.2 Identity PDF Guard

Replace only `Code.gs` with the included file.

This fixes `ReferenceError: IdentityDocumentService is not defined`.

The IdentityDocumentService is an optional PDF-export service. Saving and publishing the Family Profile will now complete even when that optional service is not installed. The app returns a non-fatal notice instead of crashing.

After replacement:
1. Save all Apps Script files.
2. Deploy a new version of the existing web app.
3. Test save and publish through the `/exec` deployment.
