# Original User Request

## Follow-up — 2026-07-07T16:45:46+05:30

Complete Phase 2 dashboard integrations (payment checkout gateway, Developer API registry, FCM settings) and make external projects (`Nebula`, `javapath-pro`, `Spedex`, `Music Mirror`) adaptable and integrated with the AROH ecosystem.

Working directory: d:\PROJECT
Integrity mode: development

## Requirements

### R1. AROH Dashboard Complete Features
- **Aros Purchase Panel**: Add a simulated checkout gateway inside `apps/web/app/dashboard/page.tsx` for purchasing Aros packages (100, 500, 1000 Aros). Add card input form fields, loading states, and reward transaction credits on confirm.
- **Developer API Portal**: Add a tab for Pro & Enterprise users in `apps/web/app/dashboard/page.tsx` to generate and delete application Client IDs and API Keys. Persist keys in `localStorage` key `aroh_developer_apps`.
- **FCM preferences toggle**: Add a checkbox toggle for Cloud Messaging alerts in dashboard settings.

### R2. External Project Adaptability
Create AROH integration adapters in the source directory of each external project to enable SSO and Wallet sync:
- **Nebula**: Create `D:\PROJECT\Nebula\src\aroh-adapter.ts`
- **JavaPath Pro**: Create `D:\PROJECT\javapath-pro\javapath-frontend\src\aroh-adapter.ts`
- **Music Mirror**: Create `D:\PROJECT\Music Mirror\frontend\src\aroh-adapter.ts`
- **SpeDex**: Create `D:\PROJECT\Spedex\dashboard_app\src\aroh-adapter.ts`

The adapter must export variables or helpers describing:
- AROH SSO Auth portal redirect URL.
- Auth token verification client wrappers.
- Wallet balance query and payment ledger transaction methods.

### R3. Documentation & Setup
- Update the `README.md` file in each external repository to include an "AROH Ecosystem Integration Guide" explaining how the app connects to AROH via `aroh-adapter.ts`.

## Acceptance Criteria

### Dashboard UI
- [ ] Overview tab shows "Purchase Aros Tokens" section with 3 package options and a modal payment form.
- [ ] Developer Portal tab is accessible and generates client IDs/API keys successfully.
- [ ] Card settings toggles FCM Push notifications preference.

### Repository Adapters
- [ ] `aroh-adapter.ts` is created and correctly references `@aroh/asdk` endpoints/configuration schemas in all 4 external projects.
- [ ] Each project's `README.md` contains an "AROH Ecosystem Integration Guide" section.

### Verification
- [ ] Next.js project builds with zero compilation or TypeScript errors.
- [ ] SDK tests pass: `npx tsx scripts/test-sdk.js` and `npx tsx scripts/test-session-sync.js`.
