# Project Context — AROH Phase 2 Ecosystem Expansion & Integrations

## Overview
Phase 2 follow-up expands AROH with dashboard features and external project integration:
1. **Dashboard Integrations** (`apps/web/app/dashboard/page.tsx`):
   - **Aros Purchase Panel**: Checkout gateway modal, pack selection (100, 500, 1000 Aros), reward credit transaction.
   - **Developer API Portal**: Tab for Pro & Enterprise users to manage Client IDs / API keys (persisted in local storage `aroh_developer_apps`).
   - **FCM preferences toggle**: Cloud Messaging toggle inside settings.
2. **External Project Adapters**:
   - Create `aroh-adapter.ts` in `Nebula`, `javapath-pro`, `SpeDex` (Spedex), and `Music Mirror`.
   - Adapters redirect to AROH SSO, check tokens, and query wallets.
3. **Ecosystem Guides**:
   - Update READMEs in external repos with integration guides.
4. **Verification**:
   - Next.js build verification and scripts execution (`test-sdk.js` and `test-session-sync.js`).

## Architectural Context
- **Sibling Folders**:
  - `d:\PROJECT\Nebula`
  - `d:\PROJECT\javapath-pro`
  - `d:\PROJECT\Spedex`
  - `d:\PROJECT\Music Mirror`
- **Primary Repo**:
  - `d:\PROJECT\AROH`
