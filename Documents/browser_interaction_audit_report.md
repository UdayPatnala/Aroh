# AROH Ecosystem Platform - Browser Interaction & QA Audit Report

**Audit Timestamp:** 2026-07-06T13:50:42+05:30  
**Audit Scope:** Local development server (`http://localhost:3000`) and live Vercel deployment (`https://aroh-os.vercel.app/`)  
**Methodology:** Monorepo architecture audit, page navigation flow validation, role-based client-side route checking, and interactive form analysis.

---

## 1. Executive Summary

This report documents the browser interaction pathways, user flows, authorization checks, and validation rules of the **AROH Ecosystem Platform** MVP. The audit covers the unified authentication portal, role-based dashboards, the Aros Wallet membership upgrading engine, the operator CMS announcement panel, and the administrator reward console.

Overall, the application displays a highly polished visual presentation matching its brand guidelines (zinc background, Outfit typography, gold accents, smooth framer-motion scaling). However, several logical behaviors and access management mechanisms require technical adjustments to match production-grade robustness.

---

## 2. Route Navigation & Access Matrix

The platform is designed around five primary client-side routes. Below is the access matrix mapped to roles in the central Zustand store (`@aroh/asdk`):

| Path | Name | Primary Elements | Access Authorization |
| :--- | :--- | :--- | :--- |
| `/` | Landing Hub | Intro Video, Live Announcements, Product Cards | **Unauthenticated / All Roles** |
| `/login` | Auth Gate | Sign In, Sign Up, Reset Password Forms, Demo Accounts | **Unauthenticated / All Roles** |
| `/dashboard`| User Center | Balance Card, Membership Upgrades, User Transactions | **Authenticated (All Roles)** |
| `/cms` | CMS Panel | Announcement CRUD Form, Editorial List | **Authenticated (Operator / Admin)** |
| `/admin` | Admin Console| Reward Form, Global Transaction Audit Ledger | **Authenticated (Admin Only)** |

---

## 3. Detailed Browser Interaction Walkthrough

### 3.1. Authentication Portal (`/login`)
* **Visual Elements:**
  * Floating card style utilizing glassmorphism (`bg-white/5 backdrop-blur-xl border border-white/10`).
  * Demo credentials helper box at the bottom (useful for development; should be separated or toggleable for production).
* **Interactions:**
  * **Sign In:** Takes `email` and `password`. Submitting executes `login(email, password)` via `usePlatformStore`.
  * **Create Account:** Toggles state, adding a "Display Name" field. Submitting runs `register(email, displayName, password)`. Standard users are initialized with a starting balance of `500 Aros` and role `"user"`.
  * **Reset Password:** Shows only the email input, triggering a password reset validation.
* **Navigation Flow:** On successful authentication, users are redirected back to the Landing Hub (`/`) or `/dashboard`.

### 3.2. Platform Dashboard (`/dashboard`)
* **Visual Elements:**
  * **Email Verification Banner:** Displays if the authenticated user's `emailVerified` flag is false.
  * **Identity Card:** Displays the email and current active role.
  * **Balance Card:** Highlights the user's current Aros token balance (`wallet.balance`).
  * **Upgrade Section:** Displays three cards representing the platform membership tiers (Basic Access, Developer Pro, Platform Enterprise).
  * **Transaction Table:** Displays a table of all wallet debits and credits associated with this account.
* **Interactions:**
  * **Email Verification Button:** Clicking "Send Verification Email" triggers `sendEmailVerification()`, printing a simulation warning to the console in Mock Mode.
  * **Membership Upgrade Action:**
    * Clicking "Upgrade for [Price] Aros" invokes `upgradeMembership(level, price)`.
    * **Validation Rules:** The upgrade button is dynamically disabled under the following conditions:
      * The tier is already active.
      * The action is a downgrade (downgrades are restricted).
      * The user's wallet balance is lower than the upgrade price.
      * The platform is currently loading.

### 3.3. Operator CMS Content Manager (`/cms`)
* **Visual Elements:**
  * Split layout:
    * Left: Announcement creation/editing form (Title, Content, Category, Status).
    * Right: Editorial announcement feed showing live and draft announcements.
* **Interactions:**
  * **Form Input:** Title (text), Content (textarea), Category (Info, Promotion, Maintenance dropdown), Status (Live, Draft dropdown).
  * **CRUD Operations:**
    * Submitting the form calls `upsertAnnouncement()`, executing updates if editing or writing a new announcement.
    * Edit buttons load data back into the left form inputs.
    * Delete button triggers a browser `confirm()` popup, deleting the announcement upon confirmation.

### 3.4. Platform Admin Console (`/admin`)
* **Visual Elements:**
  * Left: Token Reward form (Select target account, Amount, Description).
  * Right: Global Ecosystem-Wide Audit Ledger.
* **Interactions:**
  * **Reward Action:** Selects the target account via a dropdown menu (Standard User, CMS Operator, or Admin). Entering a positive integer and clicking "Credit Wallet" updates the account balance using `rewardUser()`.

---

## 4. Observed Technical & UX Bugs

During the simulated flow audit, the following technical issues were identified:

1. **Admin Console Pre-Load Bloat (BUG-01):**
   * **Problem:** In `apps/web/app/admin/page.tsx`, loading the console triggers a reward action with a zero amount:
     ```typescript
     const all = await usePlatformStore.getState().rewardUser("dummy", 0, "");
     ```
   * **Impact:** This results in unnecessary database operations or mock storage overhead upon opening the page.
2. **Direct Client Database Writes (SEC-01 & SEC-02):**
   * The client-side Zustand store directly communicates with Firestore client methods. This bypasses Next.js API routes (like `/api/admin/reward`), posing a security concern for wallet balance and role adjustments if rules are not strictly configured.
3. **Accessibility Gaps (WCAG 2.2 AA):**
   * UI form inputs lack matching `id` and `htmlFor` tags on labels, limiting screen reader support.
   * Text colors such as `text-zinc-500` or `text-zinc-600` on a pure black background fail the WCAG contrast minimum of 4.5:1.

---

## 5. Recommended Remediation Roadmap

1. **Transaction Integrity:** Route all wallet upgrades and reward credits through secure Next.js API endpoints (`/api/admin/reward`) with cryptographically signed Firebase ID token checks instead of direct client-side collection updates.
2. **Remove Dummy Loading:** Remove the initial dummy reward call on the admin console initialization.
3. **Accessibility (A11y) Upgrades:** Link all label elements to form inputs and improve text contrast for secondary labels.
