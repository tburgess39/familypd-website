# FamilyPD Goals, Checkpoints, and Complete Bilingual Frame v5.0.0

Use this complete package as the single source of truth. Do not mix files from v3 or v4 into this project.

## What v5 adds

- Complete English/Spanish switching across the workspace frame, navigation, cards, settings, update-pack instructions, field guidance, information icons, and tutorials
- Guided household and personal goal builder
- Five-pillar goal ideas in English and Spanish
- Prepopulated, editable titles, descriptions, and steps
- Household goals for Household Lead workspaces
- Private personal goals for both roles
- Read-only imported household goals for Family Member workspaces
- Step completion tracking
- Progress checkpoints
- Barriers, support needed, and next-action fields
- Progress percentage and status
- Privacy-first goal-plan PDFs with in-text citation and References
- Shared goal steps and checkpoints in signed Household Update Packs
- Updated first-use tutorial

The goal guidance follows the Family Personal Development Guidebook’s recommendation to use a few clear goals, connect them to a timeframe, break them into small steps, revisit them in family meetings, recognize progress, and adjust the plan when needed.

## Apps Script file list

### Script files

- `Code.gs`
- `Config.gs`
- `CitationService.gs`
- `DataStoreService.gs`
- `DriveApiService.gs`
- `GoalDocumentService.gs` **new**
- `GoalsService.gs` **new**
- `GuidanceService.gs`
- `IdentityDocumentService.gs`
- `IdentityService.gs`
- `PrivacyGuardService.gs`
- `SecurityService.gs`
- `UpdatePackService.gs`
- `WorkspaceService.gs`

### HTML files

- `Index.html`
- `Scripts.html`
- `Styles.html`

### Manifest

- `appsscript.json`

The Markdown and text files are documentation only and are not added to Apps Script.

## Upgrade from v4

1. Keep the current Google Drive workspace and JSON files.
2. Replace every matching Apps Script file with the v5 version.
3. Add `GoalsService.gs` as a new Script file.
4. Add `GoalDocumentService.gs` as a new Script file.
5. Save the project.
6. Open **Deploy → Manage deployments**.
7. Edit the web-app deployment.
8. Select **New version**.
9. Deploy.
10. Open the `/exec` URL.
11. Open **Workspace → Repair FamilyPD Structure** once.

The schema migrates from v4 to v5 automatically.

## Language test

Switch to **Español** and verify that the following change:

- header controls;
- workspace heading;
- left navigation;
- overview cards;
- identity and profile instructions;
- role-builder guidance;
- Goals & Checkpoints;
- Update Packs;
- Help & Tutorials;
- Workspace settings;
- information-icon help;
- tutorial steps.

Switch back to English and verify that the entire frame returns to English without reloading.

## Privacy

Do not enter exact sensitive information into goals. Use general descriptions, progress percentages, status, steps, and non-sensitive summaries.

Personal goals are never included in Household Update Packs.
