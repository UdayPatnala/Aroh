# Handoff Report — Milestone 2: Scheduled CMS Alerts

## 1. Observation
I directly observed the following components and code segments in the codebase:

1. **Announcement Interface Schema** (`packages/asdk/src/schemas/index.ts`, lines 55-63):
   ```typescript
   export const AnnouncementSchema = z.object({
     id: z.string(),
     title: z.string().min(1, "Title is required"),
     content: z.string().min(1, "Content is required"),
     category: AnnouncementCategorySchema,
     isPublished: z.boolean(),
     publishedAt: z.string(),
     authorId: z.string()
   });
   ```
   The schema expects `publishedAt` to be a string.

2. **Zustand Store Actions** (`packages/asdk/src/store/index.ts`, lines 252-270):
   ```typescript
   upsertAnnouncement: async (announcement) => {
     const user = get().user;
     if (!user) throw new Error("Not authenticated");
     set({ isLoading: true, error: null });
     try {
       await mockCmsService.upsertAnnouncement({
         ...announcement,
         authorId: user.id
       });
       ...
   ```
   This passes the full announcement object parameter to `mockCmsService.upsertAnnouncement`.

3. **Mock SDK Announcement Persistence** (`packages/asdk/src/services/firebase.ts`):
   - In `upsertAnnouncement` (mock mode, lines 660-687):
     ```typescript
     // Edit
     const updated: Announcement = {
       ...cms[idx],
       title: announcement.title,
       content: announcement.content,
       category: announcement.category,
       isPublished: announcement.isPublished ?? true,
       publishedAt: new Date().toISOString()
     };
     ...
     // Create
     const newAnn: Announcement = {
       id: "a-" + Math.random().toString(36).substr(2, 9),
       title: announcement.title,
       content: announcement.content,
       category: announcement.category,
       isPublished: announcement.isPublished ?? true,
       publishedAt: new Date().toISOString(),
       authorId: announcement.authorId
     };
     ```
     Currently, `publishedAt` is hardcoded to the current time (`new Date().toISOString()`) upon both creation and edits, ignoring any client-configured publication time.

   - In `getAnnouncements` (production & mock mode, lines 587-607):
     ```typescript
     getAnnouncements: async (): Promise<Announcement[]> => {
       if (!isMock && db) {
         try {
           const cmsRef = collection(db, "cms");
           const q = query(cmsRef, where("isPublished", "==", true), orderBy("publishedAt", "desc"));
           ...
       }
       // Mock
       return cms.filter((a) => a.isPublished);
     }
     ```
     Currently, the filter only filters by `isPublished == true`. It does not filter out future dates.

4. **CMS Form and Page** (`apps/web/app/cms/page.tsx`):
   - There is no React state tracking a publication date-time (lines 14-19).
   - In `handleSave` (lines 31-42), `publishedAt` is not passed to `upsertAnnouncement`.
   - In `handleEdit` (lines 55-62), `publishedAt` is not populated.
   - The form does not contain any date/time input field.

5. **Homepage Rendering** (`apps/web/app/page.tsx`):
   - Announcements are fetched via `fetchAnnouncements` in a `useEffect` (lines 42-44).
   - They are mapped directly onto the page without any future date check (line 228).

6. **Monorepo Build State** (`npm run build` command output):
   - Compiles successfully and generates all static pages with zero warnings.

---

## 2. Logic Chain
Based on these observations, the reasoning is as follows:

1. **Date/Time Input Addition**: Since `AnnouncementSchema` already supports `publishedAt: z.string()`, adding an `<input type="datetime-local">` to the CMS Page and converting its value to an ISO String via `new Date(publishedAt).toISOString()` is the most direct way to allow configuring a publication date/time (Observation 1 & 4).
2. **Mock SDK Storage Modification**: To preserve the user-configured date, `upsertAnnouncement` in `firebase.ts` must use `announcement.publishedAt` (relying on a fallback to `new Date().toISOString()` only if not provided) instead of always overwriting it with the current timestamp (Observation 3).
3. **Future Hide Rule (Homepage)**: Updating `getAnnouncements` in `firebase.ts` to perform a check `new Date(a.publishedAt) <= new Date()` (production query + client-side, and mock mode filter) ensures that the hub list only receives live/past announcements (Observation 3). Adding a secondary backup filter on the homepage (`apps/web/app/page.tsx`) guarantees that even cached or stale announcements are kept hidden (Observation 5).
4. **Manageable Rule (CMS Page)**: Since `getAllAnnouncements` is used by the CMS content manager to populate `allAnnouncements`, keeping `getAllAnnouncements` unfiltered ensures scheduled/future announcements remain visible and editable by operators in the CMS feed list (Observation 4).

---

## 3. Caveats
- **Firestore Composite Index**: Adding `where("publishedAt", "<=", now)` along with `where("isPublished", "==", true)` and `orderBy("publishedAt", "desc")` to the production query in `firebase.ts` may require creating a composite index in the Firestore console. Since mock mode is the default local test mode, this won't block local development, but it must be configured in production Firestore.
- **Timezone shifts**: Using `<input type="datetime-local">` captures the local timezone of the user's browser. When saving, converting it to an ISO string (`toISOString()`) sends it in UTC. This is correct, but operators must understand that scheduling is based on their browser's local time unless a timezone selector is added (out of scope).

---

## 4. Conclusion
The implementation of scheduled CMS alerts requires updating the `firebase.ts` service functions to support saving and querying by date/time, adding a local datetime state and input field to the CMS page, and adding homepage filtering. The proposed strategy is fully compliant with TypeScript, monorepo constraints, and is ready for implementation.

---

## 5. Verification Method
Verify the implementation using these steps:

1. Run the local SDK unit tests:
   ```bash
   node scripts/test-sdk.js
   ```
2. Build the project to confirm there are no TypeScript compilation errors:
   ```bash
   npm run build
   ```
3. Test locally in mock mode:
   - Run `npm run dev`.
   - Log in as `admin@aroh.co` (`admin`) or `operator@aroh.co` (`operator`).
   - Go to `/cms` and create a new announcement with a publication date set to **1 day in the future**. Verify it appears in the CMS feed.
   - Go to the homepage `/` and verify it is **NOT** visible.
   - Create a second announcement set to **1 hour in the past**. Verify it appears on both `/cms` and `/`.
