# Milestone 2 Investigation & Implementation Strategy: Scheduled CMS Alerts

This analysis report details the implementation plan for introducing scheduled publication dates for CMS announcements, ensuring they are hidden from the homepage when scheduled in the future, yet visible and manageable inside the CMS dashboard.

---

## 1. Summary of Requirements

1. **Scheduled Publication**: Enable content operators to configure a publication date/time for announcements (via `<input type="datetime-local">`) in the CMS page form.
2. **Homepage Hub List Filtering**: Announcements with a future `publishedAt` date/time must be filtered out in the homepage's announcements feed (leveraging both database/mock service query and client-side filtering).
3. **CMS Feed Visibility**: All announcements, including future/scheduled ones, must remain visible and manageable inside the CMS dashboard feed.
4. **Code Quality**: Ensure complete type safety, correct relative import depths, and clean up any unused imports.

---

## 2. Proposed Code Changes

### A. Core SDK & Services (`packages/asdk/src/services/firebase.ts`)

#### 1. Filter out future announcements in `getAnnouncements`
In both production (Firestore collection query + client-side filter) and mock mode, filter out announcements where `publishedAt` is in the future.

**Target File**: `packages/asdk/src/services/firebase.ts`
**Action**: Replace `getAnnouncements` method (Lines 587–607).

```typescript
  getAnnouncements: async (): Promise<Announcement[]> => {
    if (!isMock && db) {
      try {
        const cmsRef = collection(db, "cms");
        // Firestore query filters by isPublished and publishedAt <= current time, sorted by desc
        const q = query(
          cmsRef,
          where("isPublished", "==", true),
          where("publishedAt", "<=", new Date().toISOString()),
          orderBy("publishedAt", "desc")
        );
        const snap = await getDocs(q);
        const list: Announcement[] = [];
        snap.forEach((d) => {
          const data = d.data() as Announcement;
          // Additional client-side filter for safety / index fallback
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
```

#### 2. Support customized `publishedAt` value in mock `upsertAnnouncement`
Currently, the mock implementation of `upsertAnnouncement` overrides any user-supplied `publishedAt` field with `new Date().toISOString()`. We must preserve the provided value.

**Target File**: `packages/asdk/src/services/firebase.ts`
**Action**: Update mock implementation of `upsertAnnouncement` (Lines 657–686).

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
    cms.push(newAnn);
    setStored(MOCK_STORAGE_KEYS.CMS, cms);
    return newAnn;
```

---

### B. CMS Frontend & Forms (`apps/web/app/cms/page.tsx`)

#### 1. Add datetime formatter helper at the module level
Introduce a simple formatting function right below the imports to convert between standard ISO string representation and local datetime input string (`YYYY-MM-DDTHH:MM`).

**Target File**: `apps/web/app/cms/page.tsx`
**Action**: Insert utility function below imports.

```typescript
// Helper to format ISO date string or Date object to YYYY-MM-DDTHH:MM local format for datetime-local input
const formatToLocalDatetime = (dateString?: string) => {
  const date = dateString ? new Date(dateString) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
```

#### 2. Add React state hook for `publishedAt`
Add a state hook within the `CmsPage` component and initialize/reset it safely without triggering Next.js hydration warnings.

**Target File**: `apps/web/app/cms/page.tsx`
**Action**: Modify form states (Lines 14–20).

```typescript
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<AnnouncementCategory>("info");
  const [isPublished, setIsPublished] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [publishedAt, setPublishedAt] = React.useState("");

  // Safely initialize publishedAt on mount to avoid Next.js hydration mismatches
  React.useEffect(() => {
    if (!id && !publishedAt) {
      setPublishedAt(formatToLocalDatetime());
    }
  }, [id, publishedAt]);
```

#### 3. Update Save, Edit, and Cancel handlers
Pass the string state converted to an ISO string when saving, and populate/reset the local state correctly when editing or canceling.

**Target File**: `apps/web/app/cms/page.tsx`
**Action**: Replace `handleSave`, `handleEdit`, and cancel button handlers.

*Inside `handleSave`:*
```typescript
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      await upsertAnnouncement({
        id,
        title,
        content,
        category,
        isPublished,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()
      });
      // Reset form
      setId(undefined);
      setTitle("");
      setContent("");
      setCategory("info");
      setIsPublished(true);
      setIsEditing(false);
      setPublishedAt(formatToLocalDatetime());
    } catch (err: any) {
      alert(err.message || "Failed to save announcement");
    }
  };
```

*Inside `handleEdit`:*
```typescript
  const handleEdit = (ann: Announcement) => {
    setId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setCategory(ann.category);
    setIsPublished(ann.isPublished);
    setIsEditing(true);
    setPublishedAt(formatToLocalDatetime(ann.publishedAt));
  };
```

*Inside Cancel Button JSX (around Line 197–213):*
```typescript
                {isEditing && (
                  <Button
                    variant="glass"
                    onClick={() => {
                      setId(undefined);
                      setTitle("");
                      setContent("");
                      setCategory("info");
                      setIsPublished(true);
                      setIsEditing(false);
                      setPublishedAt(formatToLocalDatetime());
                    }}
                    className="py-2.5 text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                )}
```

#### 4. Add the date/time input to the JSX form
Add the `<input type="datetime-local">` component to the form so operators can schedule announcements.

**Target File**: `apps/web/app/cms/page.tsx`
**Action**: Insert above the category/status grid or as a separate section in the form.

```typescript
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

#### 5. Show a "Scheduled" status badge in the CMS feed list
Enhance the UI feed list to show a "Scheduled" state badge if the announcement `isPublished` is true but the date is in the future.

**Target File**: `apps/web/app/cms/page.tsx`
**Action**: Replace the Live/Draft status badge container (Lines 245–253).

```typescript
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                            !ann.isPublished
                              ? "bg-zinc-700/30 text-zinc-400 border border-zinc-700/20"
                              : new Date(ann.publishedAt) > new Date()
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                          }`}
                        >
                          {!ann.isPublished
                            ? "Draft"
                            : new Date(ann.publishedAt) > new Date()
                            ? "Scheduled"
                            : "Live"}
                        </span>
```

---

## 3. Verification Method

To verify these changes without writing code directly:

1. **Verify Builds**: Run `npm run build` from the monorepo root to ensure that TypeScript and Next.js compiler compile the project without errors or unused imports.
2. **Manual Test Case 1: Past / Immediate Announcement**:
   - Create an announcement in CMS with `isPublished` set to true and publication time set to the current time.
   - Go to Home: verify it displays immediately in the homepage announcements list.
3. **Manual Test Case 2: Future / Scheduled Announcement**:
   - Create an announcement in CMS with `isPublished` set to true and publication time set to **1 hour in the future**.
   - CMS feed list: verify it displays with the status badge **"Scheduled"**.
   - Go to Home: verify it **does not** display on the homepage announcements list.
4. **Manual Test Case 3: Editing Scheduled Announcement**:
   - Edit the scheduled announcement from Step 3: verify the input field populates with its exact scheduled future time.
   - Shift the date to a past time and click Update.
   - Go to Home: verify it now displays on the homepage hub list.
