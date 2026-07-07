# Scope: M1 - Local SSO Session Sync (R4)

## Architecture
- Central SDK Zustand store: `packages/asdk/src/store/index.ts`
- Client-side Next.js layout: `apps/web/app/layout.tsx` (or a dedicated client wrapper/component rendered on all pages)

## Requirements
- Synchronize authentication state across multiple browser tabs using `localStorage` event listeners.
- Logging out in one tab must immediately trigger automatic logout and redirect to `/login` in all other active tabs.

## Interface Contracts
- The `logout` action in `packages/asdk/src/store/index.ts` must set a `localStorage` key (e.g., `aroh_logout_event`) with a new value (such as a timestamp) to notify other tabs.
- To prevent a logout storm or recursive event loops, check if `isAuthenticated` is true before calling `logout` or writing the event.
- Implement a global `SessionSync` client component (rendered in `RootLayout`) or extend `CommandPalette` to add a window listener for the `storage` event. When the logout event is captured:
  - Call the local `logout()` action.
  - Redirect the browser to `/login` immediately.
