# Central SDK Zustand Store Analysis — Local SSO Session Sync

## 1. Current Authentication and Logout Logic

### Store Details
- **File Path**: `packages/asdk/src/store/index.ts`
- **State Representation of Auth**:
  - `user: User | null` (stores active user details).
  - `profile: Profile | null` (stores user profile).
  - `wallet: Wallet | null` (stores wallet details/credits).
  - `token: string | null` (stores the active JWT auth token).
  - `isAuthenticated: boolean` (a boolean flag representing whether the user is successfully authenticated).
- **How Login/Register Work**:
  - The `login` and `register` actions update the state, setting `isAuthenticated: true` and populating the user, profile, wallet, and token fields.
- **How Logout Works**:
  - The `logout` action currently clears authentication state synchronously. It sets `user`, `profile`, `wallet`, and `token` to `null`, `isAuthenticated` to `false`, and clears the `transactions` and `notifications` arrays:
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
    }
    ```
  - Currently, the `logout` action has no side-effects or interactions with external storages (like `localStorage`) and does not notify other browser tabs.

---

## 2. Proposed Changes to Zustand Store

To support synchronization across browser tabs and prevent recursive event loops (logout storms), we propose adding a `skipNotify` optional parameter to the `logout` action.

### Modified Interface Contract
Update `PlatformState` in `packages/asdk/src/store/index.ts` to support the optional parameter:
```typescript
export interface PlatformState {
  // ... (other properties)
  logout: (skipNotify?: boolean) => void;
  // ... (other properties)
}
```

### Modified Implementation
Modify the `logout` action implementation to:
1. Verify if the user is currently authenticated (checking `get().isAuthenticated`) to avoid duplicate processing.
2. If `skipNotify` is `false` (default) and running in a browser environment (`window` is defined), write a unique timestamp to `localStorage` key `aroh_logout_event`.
3. Set the state to unauthenticated.

```typescript
  logout: (skipNotify = false) => {
    // 1. Guard check to prevent redundant operations and potential event loops
    if (!get().isAuthenticated) return;

    // 2. Write to localStorage to notify other tabs if skipNotify is false
    if (!skipNotify && typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("aroh_logout_event", Date.now().toString());
    }

    // 3. Clear auth state
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

---

## 3. Prevention of Recursive Event Loops

### Scenario Analysis
1. **Direct Logout**: The user logs out in Tab A.
   - Tab A calls `logout()`.
   - `get().isAuthenticated` is `true`. `skipNotify` defaults to `false`.
   - Tab A writes the current timestamp to `localStorage` key `aroh_logout_event`.
   - Tab A updates its local state (`isAuthenticated` becomes `false`).
2. **SSO Sync Notification**:
   - Tab B (and other active tabs) receives the `storage` event for `aroh_logout_event`.
   - The storage event listener in Tab B checks if its local store `isAuthenticated` is `true`.
   - If `true`, it calls `logout(true)` (passing `true` to skip notifying other tabs) and redirects to `/login`.
   - Since `skipNotify` is `true`, Tab B's `logout` implementation **does not** write to `localStorage`.
   - Tab B updates its local state to unauthenticated.
   - No additional `storage` events are dispatched back to Tab A or other tabs, resolving the event loop / logout storm completely.

---

## 4. TypeScript Rules Compliance

- **No Unused Imports**: No additional import packages are required. Globally defined constructs like `window` and `Date` are used.
- **Relative Path Depths**: No relative imports are introduced or modified within the Zustand store.
