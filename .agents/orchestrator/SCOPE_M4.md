# Scope: M4 - Aros Metrics Engine Dashboard (R1)

## Architecture
- Administrative Console Page: `apps/web/app/admin/page.tsx`
- Charts component: `apps/web/app/components/admin-charts.tsx` (to be created)
- Dependency: `recharts` library

## Requirements
- Build an observation panel displaying simulated live ecosystem charts using `recharts`.
- Renders at least 3 distinct charts (e.g., Line, Area, or Bar charts).
- Metrics data is dynamically simulated (e.g. updating live using `setInterval`).

## Interface Contracts
- In `apps/web/app/admin/page.tsx`:
  - Dynamically import the `AdminCharts` component using Next.js `dynamic` with `{ ssr: false }` to avoid SSR hydration mismatch issues.
  - Insert the charts panel directly below the Navigation and above the ledger/forms, or in a suitable layout section on the console.
- In `apps/web/app/components/admin-charts.tsx`:
  - Build 3 distinct charts using Recharts:
    1. LineChart for System Metrics (CPU Load & Memory Usage).
    2. AreaChart for Transaction Volumes (Aros transacted over time).
    3. BarChart for User Journeys / Path Activity (views/actions across Home, Dashboard, Explore, AI, CMS, Admin).
  - Use a timer (`setInterval` every 3-5 seconds) to randomly update the chart data points to simulate live updates.
  - Style the charts cleanly to match AROH's premium dark aesthetics (dark background, amber accents, clear legends, and customized tooltips).
  - Ensure the component handles mounting safely on the client side.
