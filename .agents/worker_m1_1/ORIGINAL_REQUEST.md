## 2026-07-07T03:55:27Z
You are worker_m1_1, a worker agent.
Your working directory is d:\PROJECT\AROH\.agents\worker_m1_1.
Your task is to implement and verify Milestone 1 - SSO Session Sync.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Please follow these exact implementation instructions:
1. Modify `packages/asdk/src/store/index.ts`:
   - Change `logout` type and implementation to accept an optional parameter: `logout: (skipNotify?: boolean) => void`.
   - In `logout`, check if `!get().isAuthenticated` first; if not authenticated, return immediately.
   - If `!skipNotify` is true, check if `typeof window !== "undefined" && window.localStorage` exists, and write the current timestamp to the `localStorage` key `aroh_logout_event`.
   - Update the store state (user, profile, wallet, token, isAuthenticated, transactions, notifications) accordingly.
   - Clean up any unused imports.
2. Create `apps/web/app/components/session-sync.tsx`:
   - It must be a client-side component ("use client").
   - Import `useEffect` from "react", `useRouter` from "next/navigation", and `usePlatformStore` from "@aroh/asdk".
   - Set up a window event listener for the `storage` event.
   - If `event.key === "aroh_logout_event" && event.newValue`, check if `isAuthenticated` is true. If it is, call `logout(true)` (passing `true` to skip notification loop) and call `router.push("/login")`.
   - Clean up any unused imports.
3. Modify `apps/web/app/layout.tsx`:
   - Import `SessionSync` from `./components/session-sync`.
   - Render `<SessionSync />` within the body tag (e.g. right below `<CommandPalette />`).
   - Ensure the import uses correct relative paths and clean up any unused imports.
4. Create a Node-based integration test in `scripts/test-session-sync.js`:
   - Set up global mocks for `window` and `localStorage` to simulate multiple tabs.
   - Test that calling `logout()` (default) writes to `localStorage` key `aroh_logout_event`.
   - Test that calling `logout(true)` updates the store state (setting `isAuthenticated` to false) but does NOT write to `localStorage`.
   - Test that simulating the `storage` event triggers the logout and clears the state.
5. Run verification:
   - Run the baseline tests: `node scripts/test-sdk.js`.
   - Run your new tests: `node scripts/test-session-sync.js`.
   - Verify the Next.js app builds cleanly: run a build command (like `npm run build` or `npx next build` from root / apps/web if applicable).
6. Write a detailed handoff report to `d:\PROJECT\AROH\.agents\worker_m1_1\handoff.md` summarizing the changes, the test commands, and the verification results. Then notify your parent (conversation ID: 3782e5fe-5e92-40c1-8122-0fcd1209a807).
