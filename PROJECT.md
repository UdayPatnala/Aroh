# Project: AROH Phase 2 Ecosystem Expansion

## Architecture
- **Web App**: Next.js App Router project located in `apps/web`.
- **Central SDK / Store**: Zustand-based state manager and Firestore interface service in `packages/asdk`.
- **Visual Library**: Shared UI component library under `packages/ads`.
- **Database / Backend**: Firebase Firestore collections `cms` and `users`.

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
| 1 | M1: SSO Session Sync | Sync auth state via localStorage event, redirect to /login on logout. | None | IN_PROGRESS (Conv: 3782e5fe-5e92-40c1-8122-0fcd1209a807) |
| 2 | M2: Scheduled CMS Alerts | Configure publication date in CMS, hide future announcements on homepage. | None | IN_PROGRESS (Conv: 4fddf5b7-c785-4342-b113-2ec8d8cc3ea2) |
| 3 | M3: Ecosystem Search | Search across CMS, products, and docs on Explore Hub & Command Palette. | M2 | PLANNED |
| 4 | M4: Metrics Dashboard | Render 3 simulated Recharts graphs on administrative metrics panel. | None | IN_PROGRESS (Conv: 2edd90c2-3b26-40ac-b4ad-8c10f9135877) |
| 5 | M5: E2E Integration | Run all tests (Tier 1-4) and verify all Phase 2 requirements pass. | M1, M2, M3, M4 | PLANNED |
| 6 | M6: Adversarial Hardening | Implement Tier 5 challenger checks for edge cases and security integrity. | M5 | PLANNED |

## Interface Contracts
- **Auth Session Sync**:
  - `logout()` action must write to `localStorage` key `aroh_logout_event` with a unique timestamp.
  - Active tabs must listen to storage events, call `logout()` locally, and redirect to `/login` immediately.
- **Scheduled CMS Alerts**:
  - `Announcement` interface must support a `publishedAt` ISO string.
  - Homepage fetching filters announcements client-side or database-side to exclude future dates.
  - CMS content manager must show draft/scheduled announcements for management.
- **Ecosystem Search**:
  - Search queries check title, description, category, and keyword matching.
- **Metrics Engine**:
  - Admin dashboard page must dynamically import charts component using `next/dynamic` with `{ ssr: false }` to avoid SSR hydration conflicts.
