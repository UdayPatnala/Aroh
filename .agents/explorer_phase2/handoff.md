# AROH Phase 2 Exploration Handoff Report

This report provides the detailed findings, logic, and conclusions of the AROH Phase 2 codebase exploration.

---

## 1. Observation

### A. Authentication & Session Management
- **State Store**: Managed in the Zustand store in `packages/asdk/src/store/index.ts`. The state interface definitions include:
  ```typescript
  // packages/asdk/src/store/index.ts:16-22
  user: User | null;
  profile: Profile | null;
  wallet: Wallet | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  ```
- **Login, Register, and Logout Actions**:
  - `login: (email: string, password?: string) => Promise<void>;` (defined in `packages/asdk/src/store/index.ts:36`, implemented in lines 73-98).
  - `register: (email: string, displayName: string, password?: string) => Promise<void>;` (defined in `packages/asdk/src/store/index.ts:37`, implemented in lines 100-124).
  - `logout: () => void;` (defined in `packages/asdk/src/store/index.ts:38`, implemented in lines 126-136).
- **Service Layer**: State actions interface with client-side services in `packages/asdk/src/services/firebase.ts`.
  - Environment detection: `const isMock = !firebaseConfig.apiKey || process.env.NEXT_PUBLIC_AROH_ENV === "mock" || process.env.AROH_ENV === "mock";` (line 34).
  - Local Storage Mock Seeds: Seeding defaults via `initializeMockDb` using local storage keys `aroh_mock_users`, `aroh_mock_profiles`, `aroh_mock_wallets`, and `aroh_mock_transactions` (lines 103-142).
  - Cryptographic token generation is handled in `packages/asdk/src/services/token.ts` with `signMockToken(userId, role)` (lines 15-38).

### B. CMS Announcements
- **CMS Interface**: Located at `apps/web/app/cms/page.tsx`.
- **Role Gating**: Limited to `admin` or `operator` roles:
  ```typescript
  // apps/web/app/cms/page.tsx:29
  const hasAccess = user?.role === "admin" || user?.role === "operator";
  ```
- **Firestore Collections**:
  - The announcements are saved in the `cms` collection on Firestore (in production) or `aroh_mock_cms` in local storage (in mock mode).
  - `mockCmsService.upsertAnnouncement` uses `doc(db, "cms", id)` and `setDoc(docRef, newAnn)` (lines 633-646 of `packages/asdk/src/services/firebase.ts`).
  - `mockCmsService.getAnnouncements` queries:
    ```typescript
    // packages/asdk/src/services/firebase.ts:590-591
    const cmsRef = collection(db, "cms");
    const q = query(cmsRef, where("isPublished", "==", true), orderBy("publishedAt", "desc"));
    ```
  - Announcements are retrieved on the homepage hub `apps/web/app/page.tsx` inside a `useEffect` using `fetchAnnouncements()` (lines 42-44).

### C. Ecosystem Search
- **Explore Hub Registry**: Products are statically registered in `apps/web/app/explore/page.tsx:21-88` inside the `registeredProducts` array.
- **Search Filtering**: Filtered client-side in `apps/web/app/explore/page.tsx:98-104` matching `searchQuery` and `selectedCategory` state variables.
- **Command Palette**: Located at `apps/web/app/components/command-palette.tsx`.
  - Trigger listener: `(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"` (line 26).
  - The palette imports `registeredProducts` (line 7) and adds them dynamically to the options array (lines 60-68).
  - Text filtering: `items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase()))` (lines 82-85).
- **AI Hub Documentation Search**: Page `apps/web/app/ai/page.tsx` indexes principles locally using `mockDocDatabase` (lines 16-37) and filters on query submit (lines 84-89).

### D. Metrics Dashboard & Recharts
- **Admin Portal**: Located at `apps/web/app/admin/page.tsx`. It provides controls for issuing token incentives (`rewardUser`) and viewing global transaction tables.
- **Recharts Dependency**:
  - `recharts` is listed in `apps/web/package.json` under dependencies (line 20: `"recharts": "^2.12.0"`).
  - Grep search returns NO imports or usage of `recharts` inside any `.tsx` or `.ts` file.

### E. Code Quality and Testing
- **Technology Stack**: Next.js 16 (`next: 16.2.10`), React 19 (`react: 19.2.4`), Zustand 5, Tailwind v4, Zod 3.
- **Project Structure**: Central workspaces defined in root `package.json` workspaces (line 5-8): `apps/*` and `packages/*`.
- **Active Tests**: The only automated QA test suite is `scripts/test-sdk.js`. Run command output:
  ```
  === Running AROH SDK QA Automation Tests ===
  ...
  === QA Test Run Finished ===
  Passed: 11 | Failed: 0
  ```

---

## 2. Logic Chain

1. **Authentication**: Because `usePlatformStore` (in `packages/asdk/src/store/index.ts`) coordinates mock vs real Firebase API states directly and exposes `login`, `register`, and `logout` actions, we conclude that auth state is managed in a client-side Zustand store. It dynamically resolves backends based on `isMock` (configured in `packages/asdk/src/services/firebase.ts`).
2. **CMS Alerts**: In `apps/web/app/cms/page.tsx`, we observe access restriction rules and calls to `upsertAnnouncement` / `deleteAnnouncement`. These map to Firestore `cms` collection mutations in `packages/asdk/src/services/firebase.ts`, while the home page hub `apps/web/app/page.tsx` queries only `isPublished == true` docs. Thus, announcements configurations and home hub renders interact through the `cms` Firestore collection.
3. **Ecosystem Search**: Examining `apps/web/app/explore/page.tsx` and `apps/web/app/components/command-palette.tsx` shows that they both reference the exact same static array `registeredProducts` declared in `explore/page.tsx`. Searching and filtering in both cases are performed entirely client-side using JavaScript `Array.prototype.filter()` against local component state.
4. **Metrics Dashboard**: Since grep search on `recharts` shows no active imports in any code file, and since the admin panel `apps/web/app/admin/page.tsx` lacks any graphics or analytics (containing only manual wallet reward fields and ledger logs), we conclude that no charts or metrics dashboard features have been built or configured yet.
5. **Testing**: Running `node scripts/test-sdk.js` successfully triggers Node.js to verify core SDK states. We conclude that this is the sole automation pipeline currently verifying the codebase health, targeting the state-and-data layer in `@aroh/asdk`.

---

## 3. Caveats

- **Firestore Configuration**: Since we are in a CODE_ONLY environment, we did not verify real live connections to a Firestore database. We assume that the production code works identically to the mock layer, relying on the environment flag checks.
- **Build Output**: We did not run `npm run build` to verify Next.js production builds since it was outside the read-only exploration scope, but we confirmed that the dependencies are cleanly set up in package config files.

---

## 4. Conclusion

- **Authentication** is centralized in the Zustand store (`packages/asdk/src/store/index.ts`), using dual Firebase client/mock storage adapters (`packages/asdk/src/services/firebase.ts`).
- **CMS Announcements** are stored in the Firestore `cms` collection (or `aroh_mock_cms` in local storage), gated by role configurations (`admin` and `operator`), and rendered dynamically on the homepage hub.
- **Ecosystem Search** operates fully client-side on both the Explore Hub page and the Ctrl+K Command Palette, querying the static registry `registeredProducts`.
- **Metrics Dashboard** does not yet exist. Recharts is installed but not imported or used.
- **Testing** resides exclusively in `scripts/test-sdk.js`, testing auth and wallet transactions locally.

---

## 5. Verification Method

- Run the automated tests to verify the baseline SDK logic:
  ```powershell
  node scripts/test-sdk.js
  ```
- Inspect file locations:
  - Zustand store: `packages/asdk/src/store/index.ts`
  - CMS page: `apps/web/app/cms/page.tsx`
  - Command palette: `apps/web/app/components/command-palette.tsx`
  - Recharts dependency: `apps/web/package.json`
