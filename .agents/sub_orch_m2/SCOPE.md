# Scope: M2 - Scheduled CMS Alerts

## Architecture
- Firebase/Mock Service: `packages/asdk/src/services/firebase.ts`
- CMS Page & Form: `apps/web/app/cms/page.tsx`
- Homepage Hub list: `apps/web/app/page.tsx`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M2: Scheduled CMS Alerts | Implement publication date-time in CMS and homepage client-side/mock-side filters | None | PLANNED |

## Interface Contracts
- In `packages/asdk/src/services/firebase.ts`:
  - Update `upsertAnnouncement` to store the provided `publishedAt` date-time value in Firestore and in local storage (mock mode) rather than overriding it with the current date/time.
  - Update `getAnnouncements` (which fetches public announcements) to filter out future dates: `new Date(announcement.publishedAt) <= new Date()`. Ensure this is done for both production (Firestore query + client-side filter) and mock mode.
- In `apps/web/app/cms/page.tsx`:
  - Add a date/time input field (`<input type="datetime-local">`) to set/edit the publication date.
  - Pass the ISO string of the configured date to `upsertAnnouncement`.
  - When editing an existing announcement, populate the date field from the existing `publishedAt` property.
