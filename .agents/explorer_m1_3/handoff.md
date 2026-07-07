# Handoff Report — explorer_m1_3

## 1. Observation
1. **Scope and Requirements**:
   - `PROJECT.md` line 30-31 states: `logout() action must write to localStorage key aroh_logout_event with a unique timestamp. Active tabs must listen to storage events, call logout() locally, and redirect to /login immediately.`
   - `SCOPE_M1.md` line 12-16 states: `logout action ... must set a localStorage key (e.g., aroh_logout_event) ... check if isAuthenticated is true before calling logout or writing the event ... Implement a global SessionSync client component ... When the logout event is captured: Call the local logout() action. Redirect the browser to /login immediately.`
2. **Current SDK Test Setup**:
   - The file `scripts/test-sdk.js` runs a headless QA test suite using Node.js. Running `node scripts/test-sdk.js` yielded:
     ```
     === Running AROH SDK QA Automation Tests ===
     ...
     === QA Test Run Finished ===
     Passed: 11 | Failed: 0
     ```
   - It mocks `localStorage` globally on lines 3-14:
     ```javascript
     if (typeof window === "undefined") {
       const store = {};
       global.localStorage = {
         getItem: (key) => store[key] || null,
         setItem: (key, value) => { store[key] = String(value); },
         removeItem: (key) => { delete store[key]; },
         clear: () => { ... }
       };
     }
     ```
3. **Current Zustand Store and Layout**:
   - `packages/asdk/src/store/index.ts` lines 126-136 defines the current `logout` action, which only clears state and has no `localStorage` triggers:
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
   - No testing frameworks (Jest, Vitest, Playwright, Cypress) are present in the package dependencies (`apps/web/package.json` or `packages/asdk/package.json`).

---

## 2. Logic Chain
1. Since the current `logout()` action does not set any `localStorage` keys (Observation 3), multi-tab synchronization is currently impossible.
2. Since we need to sync auth state across tabs, we must update the Zustand store's `logout()` action to set `localStorage.setItem("aroh_logout_event", ...)` (Observation 1).
3. To prevent a "logout storm" or infinite bounce loops across tabs (Observation 1), the store must check if the user is authenticated (`isAuthenticated`) before writing to `localStorage` or running full logout logic.
4. Because there is no existing testing framework configured in `apps/web/package.json` (Observation 3), testing must either:
   - Run in Node.js by extending the current mock runner pattern from `scripts/test-sdk.js`.
   - Require installing an E2E testing framework like Playwright, which is the standard industry method for multi-tab synchronization tests.
5. To test this programmatically under Node.js, we must mock `global.window` and event handlers to simulate storage events, as standard Node.js lacks these APIs.

---

## 3. Caveats
- Direct browser redirect tests cannot be fully run in a pure Node environment without JSDOM or Playwright; therefore, we must verify routing using mocked route transition checks.
- We assume that the user will configure the `SessionSync` component inside `RootLayout` (`apps/web/app/layout.tsx`) so that the event listener is active across all application paths.

---

## 4. Conclusion
We have a clear, actionable plan to implement and test the SSO Session Sync:
1. Update `logout()` in `packages/asdk/src/store/index.ts` to set the `aroh_logout_event` key.
2. Create a global `SessionSync` client-side component in `apps/web/app/components/session-sync.tsx` and render it in `RootLayout`.
3. Test using a new test file `scripts/test-session-sync.js` that mocks storage event listeners and simulates tab-to-tab propagation.
4. Propose a Playwright script for future E2E testing of true browser multi-tab logout.

---

## 5. Verification Method
1. **Unit/Integration Verification**:
   - Create `scripts/test-session-sync.js` with the proposed mocks.
   - Run command: `node scripts/test-session-sync.js`.
   - Invalidating Condition: The test fails if a tab does not transition to `isAuthenticated: false` upon receiving the storage event, or if a redundant storage event is set when logging out an already signed-out session.
2. **Regression Verification**:
   - Run command: `node scripts/test-sdk.js`.
   - Invalidating Condition: Any existing SDK tests fail due to modifications to the store/firebase layer.
