# Analysis of Milestone 1 Test Environment and SSO Session Sync Test Plan

## Summary of Findings
The current AROH workspace relies on a single Node-based automated test script (`scripts/test-sdk.js`) that directly tests mock services in `packages/asdk` but does not test the Zustand store (`packages/asdk/src/store/index.ts`) or any web app logic in `apps/web`. To implement and verify the SSO Session Sync functionality, we must expand `usePlatformStore` to write to `localStorage` on logout, implement a client component `SessionSync` in `apps/web` to listen for the storage event, and introduce unit/integration tests that mock storage event broadcasting and E2E multi-tab testing.

---

## 1. Assessment of Current Test Environment

### Test Files Index
| Location | Description | Runner Command |
|---|---|---|
| `scripts/test-sdk.js` | Direct integration tests for `mockAuthService` and `mockWalletService`. | `node scripts/test-sdk.js` |
| `packages/asdk/` | Core SDK and Zustand store. No existing tests. | None configured in package.json. |
| `apps/web/` | Next.js App Router front-end. No existing tests. | None configured in package.json. |

### Current QA Automation Script (`scripts/test-sdk.js`)
The `scripts/test-sdk.js` script successfully validates user logins, balance upgrades, and transaction ledger updates in the mock database environment.
- **Mocking Strategy**: Node.js execution environment mocks `global.localStorage` with a local in-memory store object.
- **Import Strategy**: Uses Node.js experimental type-stripping support to import `.ts` files directly via CommonJS `require()`.
- **Limitation**: It only tests the lower-level service layers (`mockAuthService` and `mockWalletService`), completely bypassing the Zustand store actions (`login`, `register`, `logout`) and UI behavior.

---

## 2. Proposed SSO Session Sync Implementation Plan

### A. Zustand Store Action Update (`packages/asdk/src/store/index.ts`)
We will modify the `logout` action to handle synchronization and prevent recursive loops.

**Proposed Changes**:
```typescript
  logout: (isSync: boolean = false) => {
    // 1. Avoid redundant calls and recursive event storms
    if (!get().isAuthenticated) return;

    // 2. Write unique event to localStorage only if it's a local logout action
    if (!isSync && typeof window !== "undefined") {
      localStorage.setItem("aroh_logout_event", Date.now().toString());
    }

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

### B. Global Session Sync Component (`apps/web/app/components/session-sync.tsx`)
A new client-side component will listen to storage events and perform redirects.

**Component Code Outline**:
```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";

export default function SessionSync() {
  const router = useRouter();

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "aroh_logout_event" && event.newValue) {
        // Read authenticated state dynamically to avoid stale closures
        const { isAuthenticated, logout } = usePlatformStore.getState();
        if (isAuthenticated) {
          logout(true); // Call logout indicating it's a sync event
          router.push("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [router]);

  return null;
}
```
**Registration**:
This component will be mounted within the `RootLayout` (`apps/web/app/layout.tsx`) so that it remains active across all pages.

---

## 3. Test Plan for SSO Session Sync

### A. Zustand Store Unit & Integration Tests (Node-based)
We will create a new test file `scripts/test-session-sync.js` to run in Node.js, validating store behavior and storage event responses.

**Test Coverage**:
1. **Local Logout Event**: Verify that calling `logout()` on an authenticated store writes `aroh_logout_event` with a current timestamp to `localStorage`.
2. **Re-entry Prevention**: Verify that calling `logout()` on an unauthenticated store does not write to `localStorage` (loop prevention).
3. **Session Sync Handler Response**: Simulate receiving the `aroh_logout_event` via a mock storage event listener and verify the store gets logged out and redirects to `/login`.

### B. E2E Multi-Tab Test Setup (Playwright)
To verify correct multi-tab browser synchronization, we propose adding a Playwright integration test suite under `apps/web/tests/sso-sync.spec.ts`.

**Playwright Test Scenario**:
```typescript
import { test, expect } from "@playwright/test";

test("SSO Session Sync across tabs", async ({ context }) => {
  // 1. Open Tab 1 and log in
  const page1 = await context.newPage();
  await page1.goto("http://localhost:3000/login");
  await page1.fill('input[type="email"]', "user@aroh.co");
  await page1.fill('input[type="password"]', "user");
  await page1.click('button[type="submit"]');
  await expect(page1).toHaveURL("http://localhost:3000/dashboard");

  // 2. Open Tab 2 (should auto-login or share authentication context)
  const page2 = await context.newPage();
  await page2.goto("http://localhost:3000/dashboard");
  await expect(page2).toHaveURL("http://localhost:3000/dashboard");

  // 3. Trigger logout in Tab 1
  // Can be done via Command Palette (Ctrl+K -> Select Sign Out) or UI button click
  await page1.keyboard.press("Control+k");
  await page1.fill('input[placeholder*="Search"]', "Sign Out");
  await page1.keyboard.press("Enter");
  await expect(page1).toHaveURL("http://localhost:3000/login");

  // 4. Verify Tab 2 redirected to /login automatically
  await expect(page2).toHaveURL("http://localhost:3000/login");
});
```

---

## 4. Test Utilities to Build or Modify

To execute the unit and integration tests under Node.js without a full browser or JSDOM dependency, we must implement a mock event system in our test runner.

### Proposed Test Helper Code (`scripts/test-session-sync.js`)
```javascript
// Mock Browser Environment
const listeners = {};

global.window = {
  addEventListener: (event, callback) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  },
  removeEventListener: (event, callback) => {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter((cb) => cb !== callback);
  }
};

// Mock Storage Event Dispatcher
function dispatchMockStorageEvent(key, newValue) {
  const event = { key, newValue };
  const callbacks = listeners["storage"] || [];
  callbacks.forEach((cb) => cb(event));
}

// Router Mock
const mockRouter = {
  pushedUrl: null,
  push(url) {
    this.pushedUrl = url;
  }
};
```
These lightweight utility mocks are sufficient to execute and test the whole flow of `SessionSync` and `usePlatformStore` integration.
