# Handoff Report - explorer_m2_2 (Scheduled CMS Alerts Analysis)

## 1. Observation
We observed the following across the target files:
- **`packages/asdk/src/services/firebase.ts`**
  - **Lines 587–607 (`getAnnouncements`)**: 
    ```typescript
    getAnnouncements: async (): Promise<Announcement[]> => {
      if (!isMock && db) { ... }
      // Mock implementation
      initializeMockDb();
      const cms = getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
      return cms.filter((a) => a.isPublished);
    }
    ```
    This function retrieves public announcements but does not filter out announcements whose publication date/time (`publishedAt`) is in the future.
  - **Lines 660–667 (editing mock announcement)**:
    ```typescript
    const updated: Announcement = {
      ...cms[idx],
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      isPublished: announcement.isPublished ?? true,
      publishedAt: new Date().toISOString()
    };
    ```
    And **Lines 675–683 (creating mock announcement)**:
    ```typescript
    const newAnn: Announcement = {
      id: "a-" + Math.random().toString(36).substr(2, 9),
      ...
      publishedAt: new Date().toISOString(),
      ...
    };
    ```
    In both branches, `publishedAt` is overwritten with `new Date().toISOString()`, completely ignoring any custom publication date specified by the operator.

- **`apps/web/app/cms/page.tsx`**
  - **Lines 31–53 (`handleSave`)**: The state and form inputs do not currently capture, modify, or send a custom `publishedAt` date-time.
  - **Lines 55–62 (`handleEdit`)**: Editing an announcement does not populate a date state field.
  - **Lines 227–273 (announcement list feed)**: Shows a generic publish date using:
    ```typescript
    {new Date(ann.publishedAt).toLocaleDateString()}
    ```
    It has no visual distinction for "Scheduled" announcements versus currently "Live" ones.

- **`apps/web/app/page.tsx`**
  - **Lines 40–44 (homepage hub fetching)**:
    ```typescript
    const { user, profile, wallet, announcements, isAuthenticated, fetchAnnouncements } = usePlatformStore();
    React.useEffect(() => {
      fetchAnnouncements();
    }, [fetchAnnouncements]);
    ```
    The homepage simply displays whatever is in the `announcements` state, which is populated by calling `getAnnouncements` from the SDK.

---

## 2. Logic Chain
- **Step 1**: To configure a publication date/time in the CMS form, we need to introduce a new state variable `publishedAt` and a corresponding `<input type="datetime-local">` field in `apps/web/app/cms/page.tsx` (supported by Observation 2).
- **Step 2**: To prevent Next.js SSR hydration mismatch errors, `publishedAt` must be initialized to an empty string on the server and updated with `formatForDateTimeLocal()` only after mounting on the client (supported by Next.js standard behavior).
- **Step 3**: To ensure future announcements are not overwritten with the current timestamp upon upsert, `packages/asdk/src/services/firebase.ts` must use the passed `announcement.publishedAt` when saving or editing rather than always calling `new Date().toISOString()` (supported by Observation 1).
- **Step 4**: To hide future announcements from the homepage hub list, `getAnnouncements` in the SDK service must filter results such that `new Date(announcement.publishedAt) <= new Date()` for both production Firestore queries and mock local storage mode (supported by Observation 1 and 3).
- **Step 5**: To ensure future announcements are still manageable and visible in the CMS feed list, `allAnnouncements` (populated by `getAllAnnouncements`, which returns all records unfiltered by date) must be displayed in `apps/web/app/cms/page.tsx` (supported by Observation 2).

---

## 3. Caveats
- Production environment: Firestore requires a composite index to search by `isPublished == true` and `publishedAt <= now` sorted by `publishedAt DESC`. The production path query update in `getAnnouncements` assumes this index is provisioned or will be created. In case it is not, a post-fetch client-side filter is also added to `getAnnouncements` as a fallback.

---

## 4. Conclusion
We recommend modifying:
1. `packages/asdk/src/services/firebase.ts`: Preserve `publishedAt` in mock `upsertAnnouncement` and filter future announcements in `getAnnouncements` (production query + client-side filter, and mock mode filter).
2. `apps/web/app/cms/page.tsx`: Add a datetime-local input, bind state, handle formatting/reset, and update the CMS feed list status indicators.
3. No changes are required in `apps/web/app/page.tsx` because filtering is handled centrally in the SDK/service layer.

---

## 5. Verification Method
- **SDK Automated Check**: Run the command `node scripts/test-sdk.js` to ensure existing authentication, credit, and upgrade flows function. (We ran this command and it successfully completed with 0 failures).
- **Manual Verification Steps**:
  1. Login as `admin@aroh.co` (password `admin`).
  2. Navigate to `/cms` and create a published announcement scheduled for the future (e.g. 1 hour from now).
  3. Verify it is visible in the CMS feed with a "Scheduled" status badge.
  4. Navigate to `/` and verify it is hidden from the public homepage announcement feed.
  5. Go back to `/cms`, edit the announcement, reschedule it to the past, and verify that it appears on the homepage hub list.
