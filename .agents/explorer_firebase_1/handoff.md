# Firebase Settings & Security Rules Audit Report (M3/R3)

## 1. Observation
We observed the following configurations and code segments in the workspace:

### A. Firestore Security Rules
In `d:\PROJECT\AROH\firestore.rules` (lines 32-43):
```javascript
    // Aros wallet configurations: Read allowed by owner, write forbidden client-side
    match /wallets/{userId} {
      allow read: if isOwner(userId);
      allow write: if false;
    }

    // Transactions ledger: Read allowed by owner or by administrators, write strictly forbidden client-side
    match /transactions/{transactionId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || hasRole(['admin']));
      allow write: if false;
    }
```

### B. Firebase JSON Configuration
In `d:\PROJECT\AROH\firebase.json` (lines 1-6):
```json
{
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

### C. Environment Config
In `d:\PROJECT\AROH\apps\web\.env.local` (lines 1-11):
```
# AROH Platform Environment Configurations
# Set to 'production' or 'development'. Mock mode is used if Firebase config is missing.
AROH_ENV=production

# Firebase web credentials (Optional - fills dynamically on Vercel/Production)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCzZR6P_xDs61bh-Ic4NGyEzD3rOa40Jrk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aroh-ae2ef.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aroh-ae2ef
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aroh-ae2ef.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=218964267690
NEXT_PUBLIC_FIREBASE_APP_ID=1:218964267690:web:d4f6605d77340ba32ab6d3
```

### D. Firebase SDK Initialization & Service Operations
In `d:\PROJECT\AROH\packages\asdk\src\services\firebase.ts` (lines 24-31, 34-35, 42-50):
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
```
```typescript
const isMock = !firebaseConfig.apiKey || process.env.NEXT_PUBLIC_AROH_ENV === "mock" || process.env.AROH_ENV === "mock";
export const isMockEnv = isMock;
```
```typescript
if (!isMock) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.error("Failed to initialize Firebase SDK, falling back to mock mode:", err);
  }
}
```

### E. Automated QA Test Execution
Running `node scripts/test-sdk.js` completes successfully:
```
=== Running AROH SDK QA Automation Tests ===

--- Testing Authentication ---
[PASS] Admin role matches 'admin'
[PASS] Admin wallet balance is seeded with 5000 Aros
[PASS] User role matches 'user'
[PASS] User wallet balance is seeded with 500 Aros

--- Testing Wallet Ledger Credits ---
[PASS] Credit wallet increments balance by 200
[PASS] Ledger transaction recorded credit successfully

--- Testing Membership Upgrades ---
[PASS] Profile upgraded to Pro tier successfully
[PASS] Aros balance correctly debited by 100
[PASS] Ledger transaction recorded upgrade type successfully

--- Testing Fraud / Insufficient Balance Prevention ---
[PASS] Throw error on insufficient balance upgrade
[PASS] Insufficient balance transaction rejected as expected

=== QA Test Run Finished ===
Passed: 11 | Failed: 0
```

---

## 2. Logic Chain
1. **Security Rule Verification**: The Firestore rules file `firestore.rules` applies `allow write: if false;` to `/wallets/{userId}` and `/transactions/{transactionId}`. Since `write` encapsulates all mutation events (`create`, `update`, `delete`), Firestore strictly blocks all client-initiated mutations on these paths. This satisfies R3.1.
2. **Configuration Mapping**: The file `firebase.json` correctly binds the local rules mapping via `"firestore".rules: "firestore.rules"`. This satisfies R3.2.
3. **Real vs. Mock Database Connection Logic**:
   - `isMock` determines whether the app falls back to mock storage or connects to real Firebase.
   - `isMock` is evaluated as `true` only if `firebaseConfig.apiKey` is missing or if the environment variables are explicitly set to `"mock"`.
   - In `apps/web/.env.local`, `AROH_ENV=production` is defined and `NEXT_PUBLIC_FIREBASE_API_KEY` is present. Hence, `isMock` evaluates to `false`, and the app attempts a real database connection.
   - The connection structure correctly loads the environment variables pointing to Firebase project `aroh-ae2ef` (matches domain, bucket, and app ID).
4. **Architectural Vulnerability / Client SDK usage**:
   - The package `@aroh/asdk` uses the client-side Firebase library imports (`firebase/app`, `firebase/firestore`) to build `mockWalletService`.
   - The Next.js API routes (`/api/user/upgrade` and `/api/admin/reward`) run server-side but import and call this service directly.
   - Because `mockWalletService` uses the client SDK `db = getFirestore(app)`, any write operation performed by the server is evaluated against the Firestore rules.
   - Since rules block writes to `/wallets` and `/transactions` (`allow write: if false;`), when `isMockEnv` is set to `false`, all database write calls from the Next.js API routes will fail with authorization errors.
   - **Remediation**: The backend server must be refactored to use the Firebase Admin SDK (`firebase-admin`), which runs with administrative privileges and bypasses the rules, allowing the server to record ledger activities while keeping direct client access strictly blocked. This satisfies R3.3.

---

## 3. Caveats
- Direct connection checks against the remote live Firestore project database instance `aroh-ae2ef` were not performed, as the agent operates under a `CODE_ONLY` network restriction.
- It is assumed that the remote security rules deployed to `aroh-ae2ef` match the local `firestore.rules` file audited.

---

## 4. Conclusion
- **Firestore Security Rules**: Strictly block direct client writes to `/wallets` and `/transactions` via `allow write: if false;`.
- **firebase.json**: Correct structure mapping rules to the correct local rules file.
- **Firebase Connection Structure**: Successfully configured using environment variables mapping to the `aroh-ae2ef` Firebase project.
- **Architectural Check**: Found that backend API endpoints use client SDK services instead of `firebase-admin`, which will result in failed transaction/wallet writes when mock environment mode is disabled. This is a critical recommendation.

---

## 5. Verification Method
- Execute the quality assurance script:
  ```bash
  node scripts/test-sdk.js
  ```
- Inspect `firestore.rules` (lines 32-43) to confirm the presence of the `allow write: if false;` constraints.
- Inspect `firebase.json` to confirm standard formatting.
