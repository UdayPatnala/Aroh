# Analysis Report: Local SSO Session Sync

## Core Summary
Authentication state synchronization across browser tabs can be cleanly implemented via a lightweight global `SessionSync` client component rendered in `RootLayout`. This component listens to the `storage` event key `aroh_logout_event` and triggers local store logouts and redirections to `/login` without causing recursive logout loops.

---

## 1. Authentication and Layout Structure in `apps/web`
We inspected `apps/web/app/layout.tsx` and the core authentication flows.
* **Layout Organization**: Next.js App Router root layout `apps/web/app/layout.tsx` acts as the single entry point rendering on all pages. It is a Server Component and wraps the main application, rendering global client components (like `<CommandPalette />`) before closing the body tag.
* **Zustand Auth Store**: The store in `@aroh/asdk` (`packages/asdk/src/store/index.ts`) maintains the reactive state `isAuthenticated`.
* **Page-Level Protection**: Pages like `apps/web/app/dashboard/page.tsx` check `isAuthenticated` and invoke `router.push('/login')` client-side if the user is unauthenticated.

---

## 2. Window Listener Placement & Component Design
We investigated two design approaches for listening to the `storage` event:
1. **Extend `CommandPalette`**: Since `CommandPalette` is already a client component mounted in `RootLayout`, we could extend its `useEffect` to listen to the `storage` event.
   - *Downside*: Violates the Single Responsibility Principle. `CommandPalette` is an accessibility/search helper, not a session management component.
2. **Dedicated `SessionSync` Client Component**: Introduce a new, zero-UI component `SessionSync` at `apps/web/app/components/session-sync.tsx` and render it in `RootLayout`.
   - *Upside*: High cohesion, low coupling, clear separation of concerns, and easy to disable or modify independently.

Therefore, **introducing a dedicated `SessionSync` component is the recommended approach**.

---

## 3. Looping/Storm Avoidance Logic
To prevent a recursive logout loop where Tab A logs out, triggers Tab B, and Tab B's logout triggers Tab A again, we propose:
1. Modify `logout(notify?: boolean)` in `PlatformState` to accept a `notify` boolean flag (defaulting to `true`).
2. Inside `logout`:
   - Only write the `aroh_logout_event` to `localStorage` if `notify` is `true` AND the user is currently authenticated (`get().isAuthenticated === true`).
3. Inside the `storage` event listener in `SessionSync`:
   - Check if `event.key === "aroh_logout_event"` and the user is currently authenticated locally.
   - If so, call `logout(false)` to perform the local cleanup *without* writing to `localStorage` again, and redirect using `router.push('/login')`.
   - If not authenticated, do nothing to avoid redundant actions.

This design guarantees that exactly one tab updates `localStorage`, and all other tabs reactively log out and redirect without generating further events.

---

## 4. Proposed Modifications and Files
Three proposed modification files have been created in the explorer folder:
1. **`proposed_session_sync.tsx`**: New client component handling the window `storage` listener.
2. **`proposed_layout.tsx`**: Updated `apps/web/app/layout.tsx` importing and rendering `<SessionSync />`.
3. **`proposed_store.patch`**: Git patch for modifying `packages/asdk/src/store/index.ts` to support loop avoidance in the `logout()` action.

### Imports & Import Depth Verification:
* In `apps/web/app/layout.tsx`:
  - `import SessionSync from "./components/session-sync";` (Depth is correct, as `layout.tsx` is at root of `app/` and `components` is a direct child).
* In `apps/web/app/components/session-sync.tsx`:
  - `import { usePlatformStore } from "@aroh/asdk";` (Workspaces dependency resolving correctly).
