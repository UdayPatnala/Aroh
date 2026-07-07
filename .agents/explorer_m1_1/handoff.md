# Handoff Report: Central SDK Zustand Store SSO Sync Analysis (M1)

## 1. Observation
- **File Under Review**: `packages/asdk/src/store/index.ts`
- **Current State Definition** (lines 14-22):
  ```typescript
  export interface PlatformState {
    // Auth state
    user: User | null;
    profile: Profile | null;
    wallet: Wallet | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  ```
- **Current `logout` Action declaration** (line 38):
  ```typescript
  logout: () => void;
  ```
- **Current `logout` Action implementation** (lines 126-136):
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
- **Test Command**: `node scripts/test-sdk.js` runs a suite of QA checks for the SDK authentication/wallet services. Running this command produces:
  ```
  === Running AROH SDK QA Automation Tests ===
  ...
  === QA Test Run Finished ===
  Passed: 11 | Failed: 0
  ```

---

## 2. Logic Chain
1. To implement local SSO session synchronization, we must propagate authentication status updates (specifically logout) to other tabs.
2. The requirement states that the `logout()` action must write a unique timestamp to `localStorage` under the key `aroh_logout_event`.
3. To prevent a "logout storm" (where Tab A logging out notifies Tab B, and Tab B logging out notifies Tab A back and forth in an infinite loop), we must ensure that:
   - The store does not perform any logout operations or write events if the user is already unauthenticated (`!isAuthenticated`).
   - The logout action accepts a parameter `skipNotify` that defaults to `false`. When a tab receives the `storage` event, it invokes the local `logout(true)` action, which skips writing to `localStorage`.
4. Therefore, modifying the interface `logout: (skipNotify?: boolean) => void` and adding the conditional `localStorage.setItem` check within a check for `!skipNotify` will correctly implement the requirements while cleanly avoiding all event loops.

---

## 3. Caveats
- Since this is a read-only investigation, the proposed changes have not been written to `packages/asdk/src/store/index.ts`.
- The actual frontend `SessionSync` client component (listening to the window `storage` event) and router redirect must be implemented separately in the Next.js app layout (`apps/web/app/layout.tsx` or similar).

---

## 4. Conclusion
We propose modifying `packages/asdk/src/store/index.ts` to:
1. Accept `skipNotify?: boolean` as an optional parameter in `logout`.
2. Guard the entire function with `if (!get().isAuthenticated) return;`.
3. Write to `localStorage` key `aroh_logout_event` with a unique timestamp only if `!skipNotify` is true and `window` is defined.
A ready-to-apply diff patch file has been saved to `d:\PROJECT\AROH\.agents\explorer_m1_1\logout_sso_sync.patch`.

---

## 5. Verification Method
1. Apply the patch file: `git apply .agents/explorer_m1_1/logout_sso_sync.patch`.
2. Run the automated integration test suite: `node scripts/test-sdk.js`.
3. Verify that the SDK builds successfully under strict TypeScript configurations by running `npm run build`.
4. Verify edge cases (e.g., calling `logout()` repeatedly does not write to `localStorage` multiple times; calling `logout(true)` updates the local store but does not write to `localStorage`).
