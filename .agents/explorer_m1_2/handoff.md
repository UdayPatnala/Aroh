# Handoff Report: Local SSO Session Sync (explorer_m1_2)

## 1. Observation
We observed the following files and lines:
* **Root Layout**: In `apps/web/app/layout.tsx` (lines 27-30):
  ```typescript
  <body className="min-h-full flex flex-col font-sans bg-[#0a0a0c] text-white">
    {children}
    <CommandPalette />
  </body>
  ```
* **Zustand Store Logout Action**: In `packages/asdk/src/store/index.ts` (lines 126-136):
  ```typescript
  logout: () => {
    set({
      user: null,
      profile: null,
      wallet: null,
      token: null,
      isAuthenticated: false,
      transactions: [],
      notifications: []
    });
  },
  ```
  And in `packages/asdk/src/store/index.ts` (line 38):
  ```typescript
  logout: () => void;
  ```
* **Page-Level Protection**: In `apps/web/app/dashboard/page.tsx` (lines 69-74):
  ```typescript
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchUserTransactions();
    }
  }, [isAuthenticated, router, fetchUserTransactions]);
  ```

---

## 2. Logic Chain
1. **Layout Scope**: Since all pages in the Next.js app are children of `RootLayout` (`apps/web/app/layout.tsx`), any global listener component rendered there will be active on all pages.
2. **Cohesion**: Introducing a dedicated `SessionSync` client component (rendered at the bottom of the body tag in `RootLayout`) separates the storage events synchronization logic from other components like `CommandPalette`, preserving Single Responsibility.
3. **Loop Avoidance**: If we modify `logout` to accept a `notify` flag (defaulting to `true`), we can check `get().isAuthenticated && notify` before writing to `localStorage`. In the storage event listener, calling `logout(false)` updates the local tab state and redirects to `/login` without writing to `localStorage` again. This avoids any redundant cross-tab events or loops.
4. **Clean Redirection**: Standard routing hooks (`useRouter` from `next/navigation`) inside the client-side `SessionSync` component can cleanly redirect to `/login` immediately.

---

## 3. Caveats
* **Next.js Router Transitions**: Next.js client-side redirection via `router.push('/login')` updates the path. If complete store/memory clearing is desired, a full page load (`window.location.href = '/login'`) is an alternative, but `router.push('/login')` is generally smoother and matches the project's existing routing patterns. We proposed `router.push('/login')`.
* **Mock Environment**: If `localStorage` is used by the ASDK mock databases, the namespace of `aroh_logout_event` will not conflict with them.

---

## 4. Conclusion
We conclude that the SSO session sync is best implemented by:
1. Creating `apps/web/app/components/session-sync.tsx` containing the client-side listener.
2. Updating `apps/web/app/layout.tsx` to render `<SessionSync />` under the body tag.
3. Modifying `packages/asdk/src/store/index.ts` to accept `notify: boolean` in `logout()` and writing the storage event conditionally.

Exact implementation drafts have been written to the following files in our folder:
* `d:\PROJECT\AROH\.agents\explorer_m1_2\proposed_session_sync.tsx`
* `d:\PROJECT\AROH\.agents\explorer_m1_2\proposed_layout.tsx`
* `d:\PROJECT\AROH\.agents\explorer_m1_2\proposed_store.patch`

---

## 5. Verification Method
1. **Manual Inspection**: Verify that `apps/web/app/layout.tsx` contains `SessionSync` and that `session-sync.tsx` has correct relative import depths.
2. **Build and Test**: Run `npm run build` in root to verify Next.js builds clean and TypeScript configuration is sound.
3. **SSO Tab Test**:
   - Open two tabs of the AROH platform, log in on both tabs.
   - Click "Sign Out" in one tab.
   - Verify the second tab logs out automatically and redirects to `/login`.
   - Inspect `localStorage` in the browser console to confirm `aroh_logout_event` is set and does not loop endlessly.
