# Milestone 2 Scheduled CMS Alerts - Analysis and Recommendation Report

## Executive Summary
This report outlines the implementation strategy for **Milestone 2: Scheduled CMS Alerts**. The goal is to allow administrators and content operators to schedule announcements for a future date/time. Future announcements must remain hidden on the homepage hub list until their scheduled publication time but must be fully visible and manageable in the CMS content manager feed list. 

The strategy ensures robust filtering at both the Firebase/Mock service layer and the web app client-side display layer, while strictly adhering to TypeScript constraints.

---

## Proposed Code Changes

### 1. Central SDK Services (`packages/asdk/src/services/firebase.ts`)
We need to update:
- `upsertAnnouncement`: Modify the mock mode logic to save the user-defined `publishedAt` value rather than overwriting it with `new Date().toISOString()`.
- `getAnnouncements`: Filter out announcements whose `publishedAt` is in the future. This must be implemented for both production Firestore (via a query query filter + local filter safeguard) and mock mode.

#### Implementation Details:
```typescript
// 1. In packages/asdk/src/services/firebase.ts:

// Update getAnnouncements to filter future dates
getAnnouncements: async (): Promise<Announcement[]> => {
  if (!isMock && db) {
    try {
      const cmsRef = collection(db, "cms");
      const now = new Date().toISOString();
      const q = query(
        cmsRef, 
        where("isPublished", "==", true), 
        where("publishedAt", "<=", now),
        orderBy("publishedAt", "desc")
      );
      const snap = await getDocs(q);
      const list: Announcement[] = [];
      snap.forEach((d) => {
        const data = d.data() as Announcement;
        if (new Date(data.publishedAt) <= new Date()) {
          list.push(data);
        }
      });
      return list;
    } catch (err: any) {
      console.error("Failed to fetch announcements:", err);
    }
  }

  // Mock implementation
  initializeMockDb();
  const cms = getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
  return cms.filter((a) => a.isPublished && new Date(a.publishedAt) <= new Date());
},

// Update upsertAnnouncement to store provided publishedAt in mock mode
upsertAnnouncement: async (announcement: Partial<Announcement> & { title: string; content: string; category: AnnouncementCategory; authorId: string }): Promise<Announcement> => {
  if (!isMock && db) {
    // Production path remains unchanged as it already handles:
    // publishedAt: announcement.publishedAt || new Date().toISOString()
    ...
  }

  // Mock implementation
  initializeMockDb();
  const cms = getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);

  if (announcement.id) {
    const idx = cms.findIndex((a) => a.id === announcement.id);
    if (idx !== -1) {
      const updated: Announcement = {
        ...cms[idx],
        title: announcement.title,
        content: announcement.content,
        category: announcement.category,
        isPublished: announcement.isPublished ?? true,
        publishedAt: announcement.publishedAt || cms[idx].publishedAt || new Date().toISOString()
      };
      cms[idx] = updated;
      setStored(MOCK_STORAGE_KEYS.CMS, cms);
      return updated;
    }
  }

  // Create New
  const newAnn: Announcement = {
    id: "a-" + Math.random().toString(36).substr(2, 9),
    title: announcement.title,
    content: announcement.content,
    category: announcement.category,
    isPublished: announcement.isPublished ?? true,
    publishedAt: announcement.publishedAt || new Date().toISOString(),
    authorId: announcement.authorId
  };
  cms.push(newAnn);
  setStored(MOCK_STORAGE_KEYS.CMS, cms);
  return newAnn;
}
```

---

### 2. CMS Content Manager Page (`apps/web/app/cms/page.tsx`)
We must add a publication date/time input field (`<input type="datetime-local">`), set it up with component state, pass it to the SDK's `upsertAnnouncement` call, and handle population when editing.

#### Implementation Details:
- **Helper function** (defined outside the component to avoid recreation):
  ```typescript
  const formatToLocalDatetime = (isoString?: string) => {
    const date = isoString ? new Date(isoString) : new Date();
    if (isNaN(date.getTime())) return "";
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };
  ```
- **Component State**:
  ```typescript
  const [publishedAt, setPublishedAt] = React.useState(() => formatToLocalDatetime());
  ```
- **Form Submission (`handleSave`)**:
  ```typescript
  await upsertAnnouncement({
    id,
    title,
    content,
    category,
    isPublished,
    publishedAt: new Date(publishedAt).toISOString()
  });
  // Reset form
  setPublishedAt(formatToLocalDatetime());
  ```
- **Edit Announcement (`handleEdit`)**:
  ```typescript
  setPublishedAt(formatToLocalDatetime(ann.publishedAt));
  ```
- **Cancel Edit**:
  ```typescript
  setPublishedAt(formatToLocalDatetime());
  ```
- **Form UI Layout Modification**:
  Inject the field inside the creation/edit form:
  ```tsx
  <div>
    <label htmlFor="publishedAt" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
      Publication Date & Time
    </label>
    <input
      id="publishedAt"
      type="datetime-local"
      value={publishedAt}
      onChange={(e) => setPublishedAt(e.target.value)}
      className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm"
      required
    />
  </div>
  ```
- **List UI display**:
  Optionally, update `toLocaleDateString()` to `toLocaleString()` in the feed list render to display the exact hour/minute scheduled:
  ```tsx
  <span className="text-[10px] text-zinc-400">
    {new Date(ann.publishedAt).toLocaleString()}
  </span>
  ```

---

### 3. Homepage Display Page (`apps/web/app/page.tsx`)
In addition to the database/mock layer filtering, apply a secondary client-side validation guard on the homepage loop to guarantee no leakage of scheduled announcements.

#### Implementation Details:
```tsx
{announcements
  .filter((ann) => new Date(ann.publishedAt) <= new Date())
  .map((ann) => (
    <motion.div key={ann.id} ...>
      ...
      <span className="text-[10px] text-zinc-400">
        {new Date(ann.publishedAt).toLocaleString()}
      </span>
    </motion.div>
  ))
}
```

---

## TypeScript Rules & Code Constraints Compliance
- **No Unused Imports**: No external package imports are needed for these changes. We only use `React` hooks and standard browser/SDK models already imported in the files.
- **Relative Import Depth**: In `apps/web/app/cms/page.tsx`, any imports like `NotificationCenter` from `../components/notification-center` remain unmodified. No new relative imports are introduced.
- **Zod Schema Integrity**: The `AnnouncementSchema` in `packages/asdk/src/schemas/index.ts` specifies `publishedAt` as a string (`z.string()`). Passing `new Date(publishedAt).toISOString()` conforms exactly to this schema.

---

## Verification Plan

### 1. Automated Mock Engine Sanity
Run the SDK test suite to verify the mock database is completely functional:
```bash
node scripts/test-sdk.js
```

### 2. Manual Verification Protocol
1. **CMS Page Navigation**: Log in as `admin@aroh.co` or `operator@aroh.co`, and navigate to `/cms`.
2. **Draft/Scheduled Announcement Creation**:
   - Create a new announcement titled "Scheduled Future Alert".
   - Select a publication date/time set to **1 day in the future**.
   - Set status as "Published".
   - Click "Publish".
3. **Manageability Check**:
   - Verify the announcement immediately shows up in the "Ecosystem Announcement Feed" list on the right side of the CMS page.
   - Verify it displays the correct scheduled future date/time.
4. **Homepage Visibility Check**:
   - Navigate to the homepage `/`.
   - Verify that "Scheduled Future Alert" is **NOT** visible in the "Ecosystem Announcements" section.
5. **Historical Announcement Test**:
   - Create a new announcement set to **1 hour in the past**.
   - Click "Publish".
   - Verify it appears on both `/cms` feed list and the `/` homepage list.
6. **Production build check**:
   - Run `npm run build` to confirm TypeScript type-checking and bundling pass with zero warnings or errors.
