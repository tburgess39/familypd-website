# Upgrade FamilyPD v4 to v5

Use only the complete v5 package.

1. Extract `FamilyPD_Goals_Checkpoints_Bilingual_v5.0.0.zip`.
2. Replace every matching `.gs`, `.html`, and `appsscript.json` file.
3. Add these new Script files:
   - `GoalsService`
   - `GoalDocumentService`
4. Save.
5. Deploy a **New version**.
6. Open the `/exec` link.
7. Run **Repair FamilyPD Structure** once.

Do not delete the current FamilyPD Drive folder or JSON data files.

The repair process updates the schema and adds the guidebook citation record for goal guidance.
