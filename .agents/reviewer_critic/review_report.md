# Quality Review & Adversarial Challenge Report

## Review Summary

**Verdict**: REQUEST_CHANGES

The AROH Phase 2 ecosystem integrations and external project adapters show solid architectural alignment, full strict TypeScript correctness, and correct Next.js layout structures. However, we found two major discrepancies:
1. **Missing Copy Action**: The Developer Portal rendering in the dashboard does not implement the requested copy actions for Client ID and API Key.
2. **Production API Mismatch**: The `/api/admin/reward` production endpoint restricts transaction amounts to strictly positive values (`z.number().positive()`), which conflicts with the adapter implementations that attempt to charge/debit Aros by passing negative numbers (e.g., `-price` or `-amount`). This will fail validation and crash in production.

---

## Quality Review findings

### [Major] Missing Copy Action in Developer Portal

- **What**: The copy action for Client ID and API Key is not implemented.
- **Where**: `d:\PROJECT\AROH\apps\web\app\dashboard\page.tsx`, lines 559–570.
- **Why**: The user request explicitly asks to verify the "copy/delete actions" in the Developer Portal. The current implementation renders the Client ID and API Key as static text and only provides a "Delete" button. This forces users to manually select and copy text, increasing configuration errors.
- **Suggestion**: Add a "Copy" button next to both the Client ID and API Key in the table, invoking `navigator.clipboard.writeText(...)` and displaying a brief toast/notification confirmation.

### [Major] Local-Only Storage for Developer Portal Apps

- **What**: Registered developer applications are persisted only in `localStorage`.
- **Where**: `d:\PROJECT\AROH\apps\web\app\dashboard\page.tsx`, lines 151–168.
- **Why**: Developer app registrations are lost when the user clears their browser cache or logs in from a different device. This defeats the purpose of a central developer ecosystem.
- **Suggestion**: Store developer application metadata in a central Firestore collection (`developer_apps`) rather than `localStorage`.

### [Minor] Local-Only FCM Push Notification Preferences

- **What**: FCM push notification checkbox settings are stored only in `localStorage`.
- **Where**: `d:\PROJECT\AROH\apps\web\app\dashboard\page.tsx`, line 121 (`localStorage.setItem("aroh_fcm_enabled", fcmEnabled.toString())`).
- **Why**: Toggling push notifications on one browser/device does not synchronize with other devices since it is not saved to the user's Firestore profile document.
- **Suggestion**: Sync FCM settings to the `profiles` collection in Firestore so that the backend can target users reliably.

---

## Verified Claims

- **Tab split (Overview, Settings, Developer)** → Verified via inspection of `apps/web/app/dashboard/page.tsx` rendering condition → **PASS**
- **Checkout Gateway & Aros Purchase** → Verified via simulation flow code analysis and alert confirmation → **PASS**
- **Developer Access Gating (Basic vs Pro/Enterprise)** → Verified via basic-tier check returning an upgrade prompt → **PASS**
- **Ecosystem Integration Guide** → Verified appended sections in `README.md` for all 4 sibling projects → **PASS**
- **Sibling Adapters correctly import `@aroh/asdk`** → Verified imports and React hooks across all 4 adapter files → **PASS**
- **Strict TypeScript compilation** → Verified via successful `npm run build` compilation (including TypeScript check) → **PASS**
- **Unused imports & relative paths (R-TS-Strict, R-NextJS-Imports, R-TS-Extensions)** → Verified via inspection and script executions → **PASS**

---

## Adversarial Challenge Report

**Overall Risk Assessment**: HIGH (due to production API mismatch failing debit/payment requests)

### [Critical] API Route Zod Validation Mismatch on Debit Transactions

- **Assumption challenged**: The adapters assume `usePlatformStore.getState().rewardUser()` can accept negative inputs to perform debit operations (e.g., Music Mirror premium song unlock and Spedex payments).
- **Attack / Failure scenario**: In a production environment (`isMockEnv === false`), `rewardUser()` submits a `POST` request to `/apps/web/app/api/admin/reward/route.ts`. The route handler validates the payload using `RewardInputSchema`, which contains `amount: z.number().positive()`. Passing a negative number (e.g., `-50`) triggers a `BAD_REQUEST` (400) error, breaking the payment/charge flow in production.
- **Blast radius**: Prevents any client from unlocking tracks (Music Mirror), executing fintech payments (Spedex), or subtracting credits for activity (Nebula) in production.
- **Mitigation**: Update the Zod schema in `/api/admin/reward/route.ts` to allow any number (`z.number()`) since the underlying transaction schema (`packages/asdk/src/schemas/index.ts`) explicitly states `amount: z.number() // positive for credits, negative for debits`.

### [High] Math.random() for Client ID & API Key Generation

- **Assumption challenged**: Client ID and API Key generated client-side using `Math.random()` are secure and unique.
- **Attack scenario**: `Math.random()` is not cryptographically secure and is predictable. An attacker could potentially predict generated keys or cause collisions. Additionally, generating API keys client-side means the private key is exposed in client memory immediately and bypassed server validation.
- **Blast radius**: Security compromise of client applications; susceptibility to key collision and hijacking.
- **Mitigation**: Perform API key and client ID generation on the server side (e.g., via a secure API route using `crypto.randomUUID()` or `crypto.randomBytes()`).

### [Medium] Weak Expiry and CVV Inputs Validation in Checkout Modal

- **Assumption challenged**: User checkout input is validated properly before simulated payment runs.
- **Attack scenario**: Form fields only check `required` and `maxLength`. A user can input "AAAA" for Card Number, "XX/XX" for Expiry, and "CVV" for CVV, and the simulated checkout will process successfully.
- **Blast radius**: Poor UX/reliability.
- **Mitigation**: Implement basic regex validations (e.g., `^\d{4}\s\d{4}\s\d{4}\s\d{4}$` for card number, `^(0[1-9]|1[0-2])\/?([0-9]{2})$` for expiry).

---

## Stress Test Results

- **Run SDK QA Integration script (`test-sdk.js`)** → Executed `npx tsx scripts/test-sdk.js` → All 17 checks passed → **PASS**
- **Run Session Sync integration script (`test-session-sync.js`)** → Executed `npx tsx scripts/test-session-sync.js` → All 16 checks passed → **PASS**
- **Verify production Next.js build compilation** → Executed `npm run build` → Compiled successfully in 6.1s, TS check finished in 5.0s → **PASS**

---

## Coverage Gaps

- **Server-side key verification** — risk level: **Medium** — recommendation: Investigate how external adapters verify the generated keys against the dashboard, as there is currently no API route for verifying client IDs or API keys.
- **Session database sync performance** — risk level: **Low** — recommendation: Accept risk (development mode).

---

## Unverified Items

- **Firebase Production Credentials connection** — reason not verified: Production environment variables (`NEXT_PUBLIC_FIREBASE_API_KEY`, etc.) are not configured in this local environment; system runs in mock mode.
