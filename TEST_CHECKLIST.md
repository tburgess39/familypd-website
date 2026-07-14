# FamilyPD v9.2.0 Test Checklist

## Install

- Replace all ten files rather than adding copies.
- Deploy a New version.
- Reopen the /exec link.
- Do not run Repair unless FamilyPD displays a health warning.

## Language

- Switch English -> Español -> English.
- Confirm the page refreshes automatically.
- Confirm the same feature reopens after refresh.
- Confirm Opportunity labels and verification text translate.
- Confirm Spanish navigation text remains inside its buttons.
- Confirm user-written content remains unchanged.

## Guided flow

- In Household Identity, test all seven steps.
- Confirm only the selected major section is visible.
- In Opportunities, test Learn, Find Sources, Check a Link, Build a Plan, and
  Saved Plans.
- Confirm creating/editing opens Build a Plan and saving returns to Saved Plans.

## Help and reading

- Start Read Aloud and stop it midway.
- Confirm Stop Reading is disabled when speech is idle.
- Test Help & choices on identity, goals, meetings, learning, opportunities,
  and systems.
- Confirm dropdown choices include definitions or examples.
- Confirm the URL checker help does not insert a sentence into the URL field.
- Test a dynamically added agenda item, step, question, and action.

## Tutorial

- Confirm the tutorial covers Workspace, Identity, Roles, Goals, Meetings,
  Learning, Opportunities, Systems, Family Sharing, accessibility, privacy,
  and Help.
- Confirm applicable steps can open the related feature.

## Family Sharing

- Confirm the page says Family Sharing / Compartir con la familia.
- Create a sharing file.
- Confirm its filename starts with FamilyPD_Family_Sharing_File_.
- Import it into a Family Member workspace.
- Confirm previously signed update/sharing files remain compatible.

## Workspace health

- Confirm an account without a workspace stays in setup.
- Move an app-created test folder to Trash.
- Reload and confirm FamilyPD pauses dependent tools and offers Repair Workspace.
- Run Repair and confirm the workspace resumes.

## Regression

Test Identity, Roles, Goals, Meetings, stories, Learning, Opportunities,
Systems, PDFs, Drive links, and both workspace roles.
