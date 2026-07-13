# FamilyPD v7.1.1 MeetingService Name-Collision Fix

Replace only these two Apps Script files:

- MeetingService.gs
- Code.gs

Do not add a second MeetingService file.

## Steps

1. Open the existing MeetingService Script file.
2. Select all of its contents and replace them with the included MeetingService.gs.
3. Open the existing Code Script file.
4. Select all of its contents and replace them with the included Code.gs.
5. Save the Apps Script project.
6. Refresh the Apps Script editor.
7. Deploy a New version.
8. Reopen the /exec URL.

Repair is not required.

## What changed

The global JavaScript identifier was renamed from:

const MeetingService

to:

const FPDMeetingServiceV71

Code.gs now calls the new collision-safe identifier. This avoids a project-wide
name collision even when an older or hidden Script file still declares
MeetingService.
