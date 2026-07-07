# Milestone 2: Scheduled CMS Alerts - Recommendation Report

## Executive Summary
This report outlines the recommended implementation strategy for Milestone 2: Scheduled CMS Alerts.
The goal is to allow administrators and content operators to schedule announcements in the CMS content manager by specifying a publication date and time. Announcements with a future publication date/time must remain hidden on the public homepage hub but remain fully visible and manageable in the CMS feed list.

After investigating `packages/asdk/src/services/firebase.ts`, `apps/web/app/cms/page.tsx`, and `apps/web/app/page.tsx`, we have identified the necessary changes to achieve this.

---

## 1. Firebase Service changes (`packages/asdk/src/services/firebase.ts`)

### Observations
- `mockCmsService.upsertAnnouncement` currently overrides `publishedAt` with the current timestamp (`new Date().toISOString()`) in both update and create branches of mock mode.
- `mockCmsService.getAnnouncements` fetches public announcements but only filters by `isPublished`, ignoring whether the publication date is in the future.

### Proposed Changes

#### A. Update `getAnnouncements` to filter future announcements
Modify both the production (Firestore query + client-side filter) and the mock implementation.

**Before:**
```typescript
  getAnnouncements: async (): Promise<Announcement[]> => {
    if (!isMock && db) {
      try {
        const cmsRef = collection(db, "cms");
        const q = query(cmsRef, where("isPublished", "==", true), orderBy("publishedAt", "desc"));
        const snap = await getDocs(q);
        const list: Announcement[] = [];
        snap.forEach((d) => {
          list.push(d.data() as Announcement);
        });
        return list;
      } catch (err: any) {
        console.error("Failed to fetch announcements:", err);
      }
    }

    // Mock implementation
    initializeMockDb();
    const cms = getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
    return cms.filter((a) => a.isPublished);
  },
```

**After:**
```typescript
  getAnnouncements: async (): Promise<Announcement[]> => {
    if (!isMock && db) {
      try {
        const cmsRef = collection(db, "cms");
        const nowStr = new Date().toISOString();
        const q = query(
          cmsRef,
          where("isPublished", "==", true),
          where("publishedAt", "<=", nowStr),
          orderBy("publishedAt", "desc")
        );
        const snap = await getDocs(q);
        const list: Announcement[] = [];
        snap.forEach((d) => {
          list.push(d.data() as Announcement);
        });
        const now = new Date();
        return list.filter((a) => new Date(a.publishedAt) <= now);
      } catch (err: any) {
        console.error("Failed to fetch announcements:", err);
      }
    }

    // Mock implementation
    initializeMockDb();
    const cms = getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
    const now = new Date();
    return cms
      .filter((a) => a.isPublished && new Date(a.publishedAt) <= now)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  },
```

#### B. Update `upsertAnnouncement` to store the provided `publishedAt` in mock mode
Modify the mock implementation to use the provided `publishedAt` instead of overriding it.

**Before:**
```typescript
    if (announcement.id) {
      const idx = cms.findIndex((a) => a.id === announcement.id);
      if (idx !== -1) {
        const updated: Announcement = {
          ...cms[idx],
          title: announcement.title,
          content: announcement.content,
          category: announcement.category,
          isPublished: announcement.isPublished ?? true,
          publishedAt: new Date().toISOString()
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
      publishedAt: new Date().toISOString(),
      authorId: announcement.authorId
    };
```

**After:**
```typescript
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
```

---

## 2. CMS Page changes (`apps/web/app/cms/page.tsx`)

### Observations
- The form currently does not have a field to set or view `publishedAt`.
- When editing, the field is not populated.
- When saving, `publishedAt` is not supplied to `upsertAnnouncement`.

### Proposed Changes

#### A. Add Helper Function
Define `formatForDateTimeLocal` at the top of the file (outside the component) to format ISO dates to a local `YYYY-MM-DDTHH:mm` format suitable for a `<input type="datetime-local">` element.

```typescript
const formatForDateTimeLocal = (dateString?: string) => {
  const date = dateString ? new Date(dateString) : new Date();
  if (isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};
```

#### B. Form State & Initialization
Introduce state for `publishedAt` and initialize it on mount to avoid Next.js SSR hydration mismatches:

```typescript
  const [publishedAt, setPublishedAt] = React.useState("");

  React.useEffect(() => {
    setPublishedAt(formatForDateTimeLocal());
  }, []);
```

#### C. Update `handleSave`
Pass the ISO string format of `publishedAt` and reset it on success:

```typescript
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const pubDateIso = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();
      await upsertAnnouncement({
        id,
        title,
        content,
        category,
        isPublished,
        publishedAt: pubDateIso
      });
      // Reset form
      setId(undefined);
      setTitle("");
      setContent("");
      setCategory("info");
      setIsPublished(true);
      setPublishedAt(formatForDateTimeLocal());
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to save announcement");
    }
  };
```

#### D. Update `handleEdit` & Cancel Button
Ensure the date input is populated when entering edit mode, and reset when cancelled:

```typescript
  const handleEdit = (ann: Announcement) => {
    setId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setCategory(ann.category);
    setIsPublished(ann.isPublished);
    setPublishedAt(formatForDateTimeLocal(ann.publishedAt));
    setIsEditing(true);
  };
```

Update Cancel Button onClick:
```typescript
                  <Button
                    variant="glass"
                    onClick={() => {
                      setId(undefined);
                      setTitle("");
                      setContent("");
                      setCategory("info");
                      setIsPublished(true);
                      setPublishedAt(formatForDateTimeLocal());
                      setIsEditing(false);
                    }}
                    className="py-2.5 text-xs font-semibold"
                  >
                    Cancel
                  </Button>
```

#### E. Form UI Fields
Insert the date/time input field into the form layout just below the Category/Status grid:

```tsx
              <div>
                <label htmlFor="publishedAt" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Publication Date/Time
                </label>
                <input
                  id="publishedAt"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                />
              </div>
```

#### F. Scheduled Status Indicator in CMS Feed
Update the status badge in the CMS feed list to show "Scheduled" if the announcement is published but has a future date:

```tsx
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                            ann.isPublished
                              ? new Date(ann.publishedAt) > new Date()
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                              : "bg-zinc-700/30 text-zinc-400 border border-zinc-700/20"
                          }`}
                        >
                          {ann.isPublished 
                            ? new Date(ann.publishedAt) > new Date()
                              ? "Scheduled"
                              : "Live" 
                            : "Draft"}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(ann.publishedAt).toLocaleString()}
                        </span>
```

---

## 3. Homepage changes (`apps/web/app/page.tsx`)

### Observations
- The homepage calls `fetchAnnouncements()` which retrieves public announcements via `mockCmsService.getAnnouncements()`.
- Since `mockCmsService.getAnnouncements()` handles filtering future announcements at the service/source layer, no changes are needed in `apps/web/app/page.tsx` to hide future announcements on the homepage. This keeps the homepage client code simple and lightweight.

---

## 4. TS Rules Conformance
- No new imports are introduced in any file, ensuring there will be no unused imports under strict TS compiler options.
- No changes to relative paths are introduced.

---

## 5. Verification Plan

### Automated SDK Verification
Create a test in `scripts/test-sdk.js` or run a local integration verification script targeting the mock service directly:
1. Call `upsertAnnouncement` with a future `publishedAt` date (e.g. `now + 1 hour`).
2. Call `getAnnouncements` (public view) and verify that the future announcement is NOT present in the returned list.
3. Call `getAllAnnouncements` (CMS management view) and verify that the future announcement IS present.
4. Run the SDK verification script using:
   `node scripts/test-sdk.js`

### Manual Web UI Verification
1. Login to the platform as `admin@aroh.co` or `operator@aroh.co`.
2. Navigate to `/cms`.
3. Create a new announcement:
   - Title: "Scheduled Event Info"
   - Content: "This event is scheduled for the future."
   - Category: "info"
   - Status: "Published"
   - Publication Date/Time: Select a date/time 1 day in the future.
   - Click "Publish".
4. In the CMS Feed on the right, verify that:
   - The newly created announcement is listed.
   - The status badge displays "Scheduled".
   - The timestamp shows the future date/time.
5. Edit the newly created announcement and verify that the date input is correctly populated with the future date/time.
6. Navigate back to the homepage `/`.
7. Verify that the future announcement is NOT listed in the "Ecosystem Announcements" section.
8. Go back to `/cms` and edit the announcement to set the publication date/time to the past (e.g. 1 hour ago).
9. Navigate back to `/` and verify that the announcement now appears on the homepage hub list.
