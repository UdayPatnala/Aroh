# Handoff Report - explorer_m2_1

## 1. Observation
Direct observations from the investigation:
- **`packages/asdk/src/services/firebase.ts`**:
  - `getAnnouncements` (Lines 587–607) only filters by `isPublished`:
    ```typescript
    return cms.filter((a) => a.isPublished);
    ```
  - `upsertAnnouncement` mock implementation (Lines 666 and 681) overwrites the announcement's `publishedAt` date with `new Date().toISOString()`, ignoring the user's selected publication date.
- **`apps/web/app/cms/page.tsx`**:
  - Lacks a React state hook and a `<input>` element for `publishedAt`.
  - Form save/update logic (Lines 31–53) does not pass `publishedAt` to `upsertAnnouncement`.
  - The status badge (Lines 245–253) only supports `Live` and `Draft` badges.
- **Project Verification Status**:
  - Command `node scripts/test-sdk.js` runs successfully:
    ```
    === Running AROH SDK QA Automation Tests ===
    Passed: 11 | Failed: 0
    ```
  - Monorepo build command `npm run build` compiles successfully.

---

## 2. Logic Chain
- **Future Date Filtering**: To hide future announcements from the homepage, `getAnnouncements` must check both `isPublished === true` and `new Date(publishedAt) <= new Date()`.
- **Mock Service Alignment**: `mockCmsService.upsertAnnouncement` must accept the provided `publishedAt` parameter instead of hardcoding the current timestamp, enabling simulated scheduling.
- **Form Control Addition**: Introducing a local state (`publishedAt`) and `<input type="datetime-local">` to `apps/web/app/cms/page.tsx` allows the operator to select a custom date/time.
- **SSR Compatibility**: Initializing the date state to the current local time inside `useEffect` (rather than during the initial useState declaration) prevents Next.js hydration warnings.
- **Edit and Cancel Support**: `handleEdit` must translate `publishedAt` to a local `YYYY-MM-DDTHH:MM` format to populate the input field. Resetting the form must also restore the datetime-local state back to the current time.
- **CMS Management Badge**: Operators need a clear way to verify scheduled announcements. Inspecting `new Date(ann.publishedAt) > new Date()` inside the feed list permits rendering a distinct `"Scheduled"` status badge.

---

## 3. Caveats
- **Firestore composite index**: Combining `where("isPublished", "==", true)` and `where("publishedAt", "<=", ...)` in a Firestore query requires a composite index to be created in the production Firebase console. A client-side filter is recommended inside `getAnnouncements` as a fallback to prevent runtime crashes if the index is not yet built.

---

## 4. Conclusion
The implementation strategy is completely defined and documented. By updating the two specified files (`packages/asdk/src/services/firebase.ts` and `apps/web/app/cms/page.tsx`), the Scheduled CMS Alerts milestone can be implemented with full type safety and zero typescript compilation issues.

---

## 5. Verification Method
1. **Compilation**: Run `npm run build` to verify there are no compilation errors or unused imports.
2. **Quality Check**: Run `node scripts/test-sdk.js` to ensure the authentication and ledger tests continue to pass.
3. **Manual Simulation**:
   - Create a post with a future date/time. Verify it is visible in the CMS Feed with the badge **"Scheduled"**.
   - Load the homepage hub (`/`) and verify the scheduled post does **not** appear in the Announcements list.
   - Edit the scheduled post, change its date/time to a past value, and save. Verify the post now appears in both the CMS feed (as **"Live"**) and on the homepage.
