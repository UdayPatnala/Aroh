# BRIEFING — 2026-07-07T03:55:30Z

## Mission
Investigate Scheduled CMS Alerts implementation strategy for Milestone 2.

## 🔒 My Identity
- Archetype: Teamwork explorer
- Roles: Read-only investigator
- Working directory: d:\PROJECT\AROH\.agents\explorer_m2_1
- Original parent: 4fddf5b7-c785-4342-b113-2ec8d8cc3ea2
- Milestone: Milestone 2: Scheduled CMS Alerts

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Conformance to TS rules (no unused imports, correct relative path depths)

## Current Parent
- Conversation ID: 4fddf5b7-c785-4342-b113-2ec8d8cc3ea2
- Updated: not yet

## Investigation State
- **Explored paths**: d:\PROJECT\AROH\PROJECT.md, d:\PROJECT\AROH\.agents\sub_orch_m2\SCOPE.md, d:\PROJECT\AROH\packages\asdk\src\services\firebase.ts, d:\PROJECT\AROH\apps\web\app\cms\page.tsx, d:\PROJECT\AROH\apps\web\app\page.tsx, d:\PROJECT\AROH\packages\asdk\src\schemas\index.ts, d:\PROJECT\AROH\packages\asdk\src\store\index.ts
- **Key findings**:
  - `mockCmsService.upsertAnnouncement` currently overrides the `publishedAt` field with the current timestamp (`new Date().toISOString()`), which prevents scheduling announcements.
  - `mockCmsService.getAnnouncements` lacks any logic to filter out announcements with future `publishedAt` dates.
  - `apps/web/app/cms/page.tsx` has no input fields or state to capture `publishedAt` date/time.
  - Setting up a `"Scheduled"` badge in the CMS feed list helps operators manage future announcements.
- **Unexplored areas**: None. All files scoped for Milestone 2 have been thoroughly explored.

## Key Decisions Made
- Recommend standardizing on `YYYY-MM-DDTHH:MM` format local datetime inputs and converting to UTC ISO strings when calling the store actions.
- Add a new "Scheduled" state badge in `apps/web/app/cms/page.tsx` for announcements whose `publishedAt` is in the future.
- Leverage client-side post-query filters in Firestore mode of `getAnnouncements` to avoid immediate reliance on composite Firestore indices, but still include the Firestore query filters to optimize network traffic.

## Artifact Index
- d:\PROJECT\AROH\.agents\explorer_m2_1\ORIGINAL_REQUEST.md — Original request copy
- d:\PROJECT\AROH\.agents\explorer_m2_1\BRIEFING.md — Current briefing and state index
