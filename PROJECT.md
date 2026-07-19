# Project: AROH Phase 2 Ecosystem Expansion & Reusable Cores Realignment

## Architecture
- **Web App**: Centralized Next.js App Router dashboard under `apps/web`.
- **Central SDK / Store**: Zustand-based state manager and Firestore database client under `packages/asdk`.
- **Visual Library**: Shared UI component library under `packages/ads`.
- **Product Cores**: Reusable business logic packages under `packages/[product]-core/`.
- **Integration Layers**: Adapters mapping product cores to AROH platform core services under `integrations/[product]/`.

## Code Layout
- Zustand Store: `packages/asdk/src/store/index.ts`
- Firebase/Mock Service: `packages/asdk/src/services/firebase.ts`
- Admin Portal Page: `apps/web/app/admin/page.tsx`
- Command Palette: `apps/web/app/components/command-palette.tsx`
- Explore Hub Page: `apps/web/app/explore/page.tsx`
- CMS Page: `apps/web/app/cms/page.tsx`
- Homepage: `apps/web/app/page.tsx`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: SSO Session Sync | Sync auth state via localStorage event, redirect to /login on logout. | None | COMPLETED |
| 2 | M2: Scheduled CMS Alerts | Configure publication date in CMS, hide future announcements on homepage. | None | COMPLETED |
| 3 | M3: Ecosystem Search | Search across CMS, products, and docs on Explore Hub & Command Palette. | M2 | COMPLETED |
| 4 | M4: Metrics Dashboard | Render 3 simulated Recharts graphs on administrative metrics panel. | None | COMPLETED |
| 5 | M5: E2E Integration | Run all tests (Tier 1-4) and verify all Phase 2 requirements pass. | M1, M2, M3, M4 | COMPLETED |
| 6 | M6: Core Realignment | Decouple products into reusable Product Cores (`packages/[product]-core`) and Standalone applications. | M5 | COMPLETED |
| 7 | M7: Event-Based Integration | Expose event hooks from Product Cores (`onWorkspaceCreated`, etc.) and register adapters to hook into ASDK. | M6 | COMPLETED |

## Interface Contracts
- **Auth Session Sync**:
  - `logout()` action must write to `localStorage` key `aroh_logout_event` with a unique timestamp.
  - Active tabs must listen to storage events, call `logout()` locally, and redirect to `/login` immediately.
- **Product Integration Contracts**:
  - Products must never call `@aroh/asdk` directly.
  - Integration must occur via composition: the ecosystem listens to product-emitted hooks/events and acts (adjusts wallet balance, logs transactions, triggers alerts).
