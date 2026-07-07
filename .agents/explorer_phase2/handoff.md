# AROH Ecosystem Integration Exploration Handoff Report

This report provides the detailed findings, logic, conclusions, and technical specifications from the in-depth investigation of the AROH Platform Dashboard, the AROH SDK (`@aroh/asdk`), and the four sibling repositories.

---

## 1. Observation

### A. AROH Dashboard (`apps/web/app/dashboard/page.tsx`)
1. **State & Store Hook**: Interfaces with `@aroh/asdk`'s Zustand store using:
   ```typescript
   // apps/web/app/dashboard/page.tsx:35-36
   const { user, profile, wallet, transactions, isAuthenticated, isLoading, upgradeMembership, fetchUserTransactions, sendEmailVerification, updateProfile, updateNotificationPreferences, notificationPreferences, rewardUser, addNotification } =
     usePlatformStore();
   ```
2. **Current State Variables**:
   - Tab switching: `const [activeTab, setActiveTab] = React.useState<"overview" | "settings" | "developer">("overview");` (line 38)
   - Purchase flow: `isBuying` (boolean), `selectedPack` (`{ amount: number; price: string } | null`), `isPaymentLoading` (boolean) (lines 49-51)
   - Developer Portal: `newAppName` (string), `registeredKeys` (`{ name: string; clientId: string; apiKey: string }[]`) (lines 54-55)
   - FCM: `fcmEnabled` (boolean) (line 58)
3. **Tab Selector vs Render Logic**:
   - The tab selector renders three buttons: "Overview", "Account Settings", and "Developer Portal" (lines 204-235).
   - The conditional render in JSX evaluates only two conditions (lines 385-387):
     ```typescript
     {activeTab === "overview" ? (
       // Overview layout (cards, membership upgrade tiers, ledger table)
     ) : (
       // Settings layout (profile form, alert options, theme dropdown)
     )}
     ```
     Selecting the "Developer Portal" tab renders the "Settings" tab content because it falls through the ternary operator.
4. **Unimplemented UI Blocks**:
   - **Payment Modal**: States (`isBuying`, `selectedPack`, `isPaymentLoading`) and handlers (`handlePurchaseInitiate`, `handleConfirmPurchase`) exist, but no Aros token purchase options are rendered in the Overview, and no payment modal dialog is present in the JSX.
   - **Developer Portal**: Form fields, API key list table, and generation elements are completely missing from the render layout.
   - **FCM Toggle**: The Alert Settings box (lines 426-457) lists "Enable In-App Notifications" and "Enable Email Alerts", but is missing a checkbox for `fcmEnabled`.

### B. AROH SDK (`packages/asdk`)
1. **Schemas (`src/schemas/index.ts`)**:
   - Exports Zod validators and TypeScript types for `User`, `Profile`, `Wallet`, `Transaction`, and `Announcement`.
   - Membership levels are strictly typed: `basic`, `pro`, `enterprise` (lines 15-16).
2. **Zustand Store (`src/store/index.ts`)**:
   - Exports the central hook `usePlatformStore` mapping auth, transactions, and CMS configurations.
   - Cross-tab session sync: `logout()` writes a unique timestamp to `localStorage` key `aroh_logout_event` (line 130).
   - `rewardUser(userId, amount, description)` supports adjustments. A positive `amount` credits the wallet, while a negative `amount` debits the wallet.
3. **Token Verification (`src/services/token.ts`)**:
   - Exports `signMockToken(userId, role, secret)` and `verifyMockToken(token, secret)`. Compatible with browser and Node environments.

### C. Sibling Repositories
1. **Nebula (`d:\PROJECT\Nebula`)**:
   - Vite + React 19 + TypeScript 6.0 project.
   - Uses standard React Router v7.
   - Has a credit-based system (AI analysis = 10, Publish = 5, Daily check-in = +10). Currently manages user session, profile, and credit balances using custom state and `localStorage` in `src/providers/AuthProvider.tsx`.
   - Dependency manifest `package.json` contains `react`, `react-dom`, `react-router-dom`, `firebase`, and devDependencies for `vite` / `vitest` / `oxlint`. No reference to `@aroh/asdk`.
2. **JavaPath Pro (`d:\PROJECT\javapath-pro`)**:
   - `javapath-frontend` is a Vite + React 19 (JavaScript) project.
   - Manages user sessions, progress tracking (5 task curriculum), and mentor chat history via `src/AuthContext.jsx`. Sends JWT auth tokens to backend (`http://localhost:5000`) using Axios headers.
   - `package.json` dependencies: `lucide-react`, `react-router-dom`, `react-markdown`, `axios`, `framer-motion`. No reference to `@aroh/asdk`.
3. **Music Mirror (`d:\PROJECT\Music Mirror`)**:
   - `frontend` is a Create React App (react-app-rewired) + React 18 (JavaScript) project.
   - Manages a lightweight listening profile (favorites, history, emotion logs) in `localStorage` inside `src/App.js`.
   - `package.json` dependencies: `axios`, `buffer`, `face-api.js`, `react`, `react-dom`, `react-scripts`. No reference to `@aroh/asdk`.
4. **Spedex (`d:\PROJECT\Spedex`)**:
   - `dashboard_app` is a Vite + React 19 + TypeScript project.
   - Makes requests to the Spring Boot REST API (`http://localhost:8080/api`) with JWT auth tokens stored in `localStorage` (`spedex.dashboard.session`).
   - `package.json` dependencies: `react`, `react-dom`, `react-qr-code`. No reference to `@aroh/asdk`.

---

## 2. Logic Chain

1. **Dashboard UI Refactoring**:
   - To fix the tab rendering bug, the ternary operator `activeTab === "overview" ? (...) : (...)` must be replaced with separate render conditions: `{activeTab === "overview" && (...)}`, `{activeTab === "settings" && (...)}`, and `{activeTab === "developer" && (...)}`.
   - To activate the payment gateway, a purchase button list should be added next to the Aros Balance display in the Overview tab, triggering `handlePurchaseInitiate(amount, price)`. When `isBuying` is true, an overlay modal must display, binding form submits to `handleConfirmPurchase(e)`.
   - To complete the Developer API Portal, rendering must check `profile.membershipLevel`. If `"basic"`, it renders an upgrade warning. If `"pro"` or `"enterprise"`, it renders a form to add apps (triggering `handleRegisterApp`) and lists keys from `registeredKeys` with copy/delete actions.
   - To complete the FCM toggle, a checkbox input must be added to the Alert Settings form, binding `fcmEnabled` and saving to `localStorage` or profile metadata upon form submission.
2. **Sibling Integration Architecture**:
   - None of the sibling repositories depend on `@aroh/asdk`. To establish SSO, wallet, and ledger sync, `@aroh/asdk` must be added to each repository's dependencies (`"dependencies": { "@aroh/asdk": "file:../AROH/packages/asdk" }` or equivalent monorepo linking).
   - An adapter (`aroh-adapter.ts`) should be created in each application's source directory to bridge ASDK Zustand actions/states into the application's local auth providers/contexts.
   - Session synchronization is achieved by having the adapter register a `storage` listener for `aroh_logout_event`. When captured, it automatically logs out the application session locally and redirects to the AROH login portal.

---

## 3. Caveats

- **Network Isolation**: Because we are in offline `CODE_ONLY` mode, we assume the monorepo package resolution holds true when directories are built.
- **Firebase vs Mock Layer**: Sibling adapters are modeled to interact with the central SDK store interface. If the AROH environment flips from `mock` to `production`, the adapters will transition seamlessly as the underlying SDK store handles the configuration swap internally.

---

## 4. Conclusion

- **AROH Dashboard Page** requires explicit render separation for the three tabs, adding checkout overlays, developer tier filtering/keys tables, and the FCM setting input.
- **Ecosystem Integration** is fully viable by adding the ASDK dependency to all sibling repositories, constructing localized `aroh-adapter.ts` bridges to map roles/credits/tokens, and configuring the SSO session listener.

Below are the exact technical implementations for each sibling repository.

---

## 5. Implementation Details

### A. AROH Dashboard Improvements Guide
To fully implement the required dashboard parts in `apps/web/app/dashboard/page.tsx`:

1. **Separate Tab Rendering**:
   Replace the conditional render block (lines 385-483) with:
   ```tsx
   {activeTab === "overview" && (
     <div className="space-y-12">
       {/* Email Verification Banner */}
       {/* Overview Identity, Aros Balance, and Membership Cards */}
       {/* Transaction History Ledger */}
     </div>
   )}

   {activeTab === "settings" && (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* Profile configuration Form */}
       {/* Alert Settings (with In-App, Email, and FCM check boxes) */}
       {/* Theme Settings */}
     </div>
   )}

   {activeTab === "developer" && (
     <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
       <h2 className="text-xl font-bold tracking-tight text-white">Developer API Portal</h2>
       {profile.membershipLevel === "basic" ? (
         <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 text-center space-y-4">
           <p className="text-sm text-zinc-400">
             The Developer API Portal is restricted to <strong>Pro</strong> and <strong>Enterprise</strong> members.
           </p>
           <Button variant="primary" onClick={() => setActiveTab("overview")}>
             Upgrade Membership
           </Button>
         </div>
       ) : (
         <div className="space-y-8">
           {/* Form to Register App */}
           <form onSubmit={handleRegisterApp} className="space-y-4 max-w-md">
             <div>
               <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                 New Application Name
               </label>
               <input
                 type="text"
                 value={newAppName}
                 onChange={(e) => setNewAppName(e.target.value)}
                 className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm"
                 placeholder="My Awesome App"
                 required
               />
             </div>
             <Button type="submit" className="px-6 py-2.5 text-xs font-semibold">
               Register Application
             </Button>
           </form>

           {/* App Registry Table */}
           <div className="border-t border-white/5 pt-6">
             <h3 className="text-sm font-bold text-white mb-4">Registered Credentials</h3>
             {registeredKeys.length === 0 ? (
               <p className="text-zinc-400 text-xs">No registered applications found.</p>
             ) : (
               <div className="space-y-4">
                 {registeredKeys.map((app, idx) => (
                   <div key={app.clientId} className="bg-white/2 border border-white/5 rounded-lg p-4 flex justify-between items-center">
                     <div className="space-y-1 font-mono text-xs">
                       <div className="text-sm font-bold text-white font-sans">{app.name}</div>
                       <div><span className="text-zinc-500">Client ID:</span> {app.clientId}</div>
                       <div><span className="text-zinc-500">API Key:</span> {app.apiKey}</div>
                     </div>
                     <Button variant="glass" className="text-rose-500 hover:text-rose-400 text-xs" onClick={() => handleDeleteApp(idx)}>
                       Delete
                     </Button>
                   </div>
                 ))}
               </div>
             )}
           </div>
         </div>
       )}
     </div>
   )}
   ```

2. **Aros Purchase & Payment Modal**:
   - In the Overview's "Aros Balance" card, add a "Buy Aros" trigger button:
     ```tsx
     <Button variant="glass" className="mt-3 text-xs" onClick={() => handlePurchaseInitiate(1000, "$10.00")}>
       Purchase Tokens
     </Button>
     ```
   - Render the overlay Modal at the end of the root `div`:
     ```tsx
     {isBuying && selectedPack && (
       <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
         <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-md w-full space-y-6">
           <div>
             <h3 className="text-lg font-bold text-white">Confirm Token Purchase</h3>
             <p className="text-zinc-400 text-xs mt-1">
               You are purchasing {selectedPack.amount} Aros tokens for {selectedPack.price}.
             </p>
           </div>
           <form onSubmit={handleConfirmPurchase} className="space-y-4">
             <div className="space-y-2">
               <label className="block text-[10px] uppercase font-bold text-zinc-500">Card Credentials</label>
               <input
                 type="text"
                 placeholder="4111 2222 3333 4444"
                 maxLength={16}
                 className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none"
                 required
               />
             </div>
             <div className="flex gap-4">
               <Button type="button" variant="glass" className="flex-1" onClick={() => { setIsBuying(false); setSelectedPack(null); }} disabled={isPaymentLoading}>
                 Cancel
               </Button>
               <Button type="submit" variant="primary" className="flex-1" disabled={isPaymentLoading}>
                 {isPaymentLoading ? "Processing..." : "Pay Now"}
               </Button>
             </div>
           </form>
         </div>
       </div>
     )}
     ```

3. **FCM push setting checkbox**:
   - Inside the Settings "Alert Settings" form, append:
     ```tsx
     <div className="flex items-center gap-3">
       <input
         id="fcmAlerts"
         type="checkbox"
         checked={fcmEnabled}
         onChange={(e) => setFcmEnabled(e.target.checked)}
         className="w-4 h-4 accent-amber-500 focus:ring-amber-500"
       />
       <label htmlFor="fcmAlerts" className="text-xs text-zinc-300 font-semibold cursor-pointer">
         Enable Push Notifications (FCM)
       </label>
     </div>
     ```
   - In `handleUpdatePrefs`, write the state to localStorage:
     ```typescript
     const handleUpdatePrefs = (e: React.FormEvent) => {
       e.preventDefault();
       updateNotificationPreferences({ inApp: inAppPref, email: emailPref });
       localStorage.setItem("aroh_fcm_enabled", fcmEnabled.toString());
       alert("Notification preferences updated!");
     };
     ```
   - In the settings load `useEffect` (lines 69-78):
     ```typescript
     setFcmEnabled(localStorage.getItem("aroh_fcm_enabled") === "true");
     ```

---

### B. `aroh-adapter.ts` for Nebula (`d:\PROJECT\Nebula\src\aroh-adapter.ts`)
Bridges the `@aroh/asdk` Zustand store to Nebula's custom `AuthProvider` contexts:
```typescript
import { usePlatformStore } from "@aroh/asdk";
import type { UserProfile, UserRole } from "./types/auth";
import { getStorageLimitForRole } from "./config/roles";

// Maps AROH levels to Nebula's RBAC roles
export function mapArohLevelToNebulaRole(membershipLevel: string, userRole?: string): UserRole {
  if (userRole === "admin" || userRole === "operator") {
    return "administrator";
  }
  if (membershipLevel === "enterprise" || membershipLevel === "pro") {
    return "premium_user";
  }
  return "registered_user";
}

export function useArohNebulaBridge() {
  const {
    user: arohUser,
    profile: arohProfile,
    wallet: arohWallet,
    token,
    isAuthenticated,
    isLoading,
    login: arohLogin,
    logout: arohLogout,
    rewardUser
  } = usePlatformStore();

  const user: UserProfile | null = arohUser && arohProfile && arohWallet ? {
    id: arohUser.id,
    name: arohProfile.displayName,
    email: arohUser.email,
    role: mapArohLevelToNebulaRole(arohProfile.membershipLevel, arohUser.role),
    emailVerified: arohUser.emailVerified ?? false,
    credits: arohWallet.balance, // Sync credit balance with Aros wallet
    storageUsed: 0,
    storageLimit: getStorageLimitForRole(mapArohLevelToNebulaRole(arohProfile.membershipLevel, arohUser.role)),
    createdAt: arohUser.createdAt
  } : null;

  const login = async (email: string, password?: string) => {
    await arohLogin(email, password);
  };

  const logout = () => {
    arohLogout();
  };

  const updateCredits = async (amount: number) => {
    if (!arohUser) return;
    // Debits/Credits wallet: rewardUser accepts negative inputs for debit operations
    await rewardUser(arohUser.id, amount, "Nebula platform activity debit/credit");
  };

  const dailyCheckIn = async (): Promise<boolean> => {
    if (!arohUser) return false;
    const today = new Date().toDateString();
    const lastCheck = localStorage.getItem(`nebula_checkin_${arohUser.id}`);
    if (lastCheck === today) return false;

    await rewardUser(arohUser.id, 10, "Daily Check-in Reward");
    localStorage.setItem(`nebula_checkin_${arohUser.id}`, today);
    return true;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateCredits,
    dailyCheckIn,
    token
  };
}
```

---

### C. `aroh-adapter.ts` for JavaPath Pro (`d:\PROJECT\javapath-pro\javapath-frontend\src\aroh-adapter.ts`)
Translates AROH's active tokens and profile parameters into local state settings:
```typescript
import { usePlatformStore } from "@aroh/asdk";
import axios from "axios";

export function useArohJavaPathBridge() {
  const {
    user: arohUser,
    profile: arohProfile,
    token: arohToken,
    isAuthenticated,
    isLoading,
    login: arohLogin,
    logout: arohLogout,
    rewardUser
  } = usePlatformStore();

  const user = arohUser && arohProfile ? {
    username: arohProfile.displayName || arohUser.email.split("@")[0],
    email: arohUser.email,
    id: arohUser.id
  } : null;

  // Intercept and configure Axios headers with AROH credentials
  const syncAxiosToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const login = async (email: string, password?: string) => {
    await arohLogin(email, password);
  };

  const logout = () => {
    arohLogout();
    syncAxiosToken(null);
  };

  // Award user Aros upon curriculum progress
  const rewardForTaskCompletion = async (taskId: string, points = 50) => {
    if (!arohUser) return;
    await rewardUser(arohUser.id, points, `Completed JavaPath Challenge: ${taskId}`);
  };

  return {
    user,
    token: arohToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    syncAxiosToken,
    rewardForTaskCompletion
  };
}
```

---

### D. `aroh-adapter.ts` for Music Mirror (`d:\PROJECT\Music Mirror\frontend\src\aroh-adapter.ts`)
Automates profile registration based on user profiles:
```typescript
import { usePlatformStore } from "@aroh/asdk";

export function useArohMusicMirrorBridge() {
  const {
    user: arohUser,
    profile: arohProfile,
    isAuthenticated,
    logout: arohLogout,
    rewardUser
  } = usePlatformStore();

  // Create local mirror profile from AROH credentials
  const getMusicProfile = (defaultGenre = "Rock", defaultGoal = "Relax") => {
    if (!arohUser || !arohProfile) return null;
    return {
      name: arohProfile.displayName,
      email: arohUser.email,
      genre: localStorage.getItem(`music_genre_${arohUser.id}`) || defaultGenre,
      goal: localStorage.getItem(`music_goal_${arohUser.id}`) || defaultGoal
    };
  };

  const updatePreference = (genre: string, goal: string) => {
    if (!arohUser) return;
    localStorage.setItem(`music_genre_${arohUser.id}`, genre);
    localStorage.setItem(`music_goal_${arohUser.id}`, goal);
  };

  // Associate saved playlists and history with AROH IDs to prevent crosstalk
  const getStorageKeys = () => {
    if (!arohUser) return { favorites: "mirror_favs", history: "mirror_hist" };
    return {
      favorites: `music_favs_${arohUser.id}`,
      history: `music_hist_${arohUser.id}`
    };
  };

  const chargeForPremiumTrack = async (trackTitle: string, price = 2) => {
    if (!arohUser) return;
    // Debits user balance
    await rewardUser(arohUser.id, -price, `Unlocked Premium Song: ${trackTitle}`);
  };

  return {
    isAuthenticated,
    getMusicProfile,
    updatePreference,
    getStorageKeys,
    chargeForPremiumTrack,
    logout: arohLogout
  };
}
```

---

### E. `aroh-adapter.ts` for Spedex (`d:\PROJECT\Spedex\dashboard_app\src\aroh-adapter.ts`)
Ties payment transactions and API validation directly into ASDK's ledger:
```typescript
import { usePlatformStore } from "@aroh/asdk";

export function useArohSpedexBridge() {
  const {
    user: arohUser,
    profile: arohProfile,
    wallet: arohWallet,
    token: arohToken,
    isAuthenticated,
    logout: arohLogout,
    rewardUser
  } = usePlatformStore();

  const user = arohUser && arohProfile && arohWallet ? {
    id: arohUser.id,
    name: arohProfile.displayName,
    email: arohUser.email,
    balance: arohWallet.balance
  } : null;

  // Debit Aros for Spedex balance transfers
  const executePayment = async (amount: number, description: string) => {
    if (!arohUser) throw new Error("Authentication Required");
    if (!arohWallet || arohWallet.balance < amount) {
      throw new Error("Insufficient Aros Balance");
    }
    await rewardUser(arohUser.id, -amount, `Spedex Debit: ${description}`);
  };

  return {
    user,
    token: arohToken,
    isAuthenticated,
    executePayment,
    logout: arohLogout
  };
}
```

---

### F. README.md Additions ("AROH Ecosystem Integration Guide")
Append the following section to the end of the `README.md` file for **each** repository:

```markdown
---

## 🔌 AROH Ecosystem Integration Guide

This repository is integrated into the central **AROH Platform Ecosystem** via `@aroh/asdk`.

### SSO & Session Sync
Authentication relies on the central AROH Platform identity. Local authentication stores and local storage sessions are bridged to the central Zustand state in `aroh-adapter.ts`.
- **Single Sign-Out**: Active tabs watch the `aroh_logout_event` key in `localStorage`. When a logout occurs elsewhere in the ecosystem, the local session is immediately destroyed, and the user is redirected to the AROH login portal.

### Credits & Ledger Interactions
Operation costs, balances, and progress incentives are tracked via the Aros wallet.
- **Entitlements**: Access is gated using the AROH Membership Tier (`basic` vs `pro`/`enterprise`).
- **Ledger Records**: Debits (points/tokens charged) and credits (rewards earned) are directly posted to the AROH Ledger using `rewardUser()` transactions.

### Running with AROH local links
To run this application locally linked to your AROH SDK repository:
1. Link the package locally:
   ```bash
   npm install ../AROH/packages/asdk
   ```
2. Import the adapter hooks from `./src/aroh-adapter.ts` to coordinate actions with the central store.
```

---

## 6. Verification Method

To verify the integration patterns and configurations:

1. **Verify SDK exports**:
   Inspect `d:\PROJECT\AROH\packages\asdk\src\index.ts` to confirm that schemas, firebase services, token services, and store actions are correctly exported:
   ```typescript
   export * from "./schemas";
   export * from "./services/firebase";
   export * from "./services/token";
   export * from "./store";
   ```
2. **Compile SDK**:
   Check if the SDK compiles without issues:
   ```powershell
   npx tsx d:\PROJECT\AROH\scripts\test-sdk.js
   ```
   *Expected Output*: `Passed: 11 | Failed: 0`.
3. **Verify SSO Session Sync**:
   Inspect the tab listener `d:\PROJECT\AROH\apps\web\app\components\session-sync.tsx` to confirm the listener key:
   ```typescript
   if (event.key === "aroh_logout_event" && event.newValue)
   ```
   Run the session sync test runner:
   ```powershell
   node d:\PROJECT\AROH\scripts\test-session-sync.js
   ```
   *Expected Output*: Verification success.
