## 2026-07-07T03:55:18Z
You are the Worker agent for Milestone 4 (Metrics Dashboard).
Your working directory is: d:\PROJECT\AROH\.agents\worker_m4
Your identity: worker_m4

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your task is to implement the Metrics Dashboard:
1. Create `apps/web/app/components/admin-charts.tsx` based on the proposed design in `d:\PROJECT\AROH\.agents\explorer_m4_3\proposed_admin-charts.tsx`. Ensure it:
   - Contains a LineChart, an AreaChart, and a BarChart using recharts.
   - Includes client-only mounting logic using `useEffect` with a `mounted` state.
   - Uses `setInterval` every 4 seconds to simulate live updates of the chart data.
   - Style the charts cleanly to match AROH's premium dark aesthetics (dark background, amber accents, custom tooltips, clear legends).
2. Update `apps/web/app/admin/page.tsx` based on the proposed patch in `d:\PROJECT\AROH\.agents\explorer_m4_3\proposed_admin-page.patch`. It must dynamically import the `AdminCharts` component with `ssr: false` to avoid SSR hydration conflicts, and render it below the Navigation and above the ledger/forms.
3. Clean up any unused imports and conform strictly to TS rules (correct relative path depths, correct folders).
4. Run `npm run build` (or building the web app workspace) to compile the project and verify it compiles without any TypeScript or Next.js build errors.
5. Run the baseline integration tests: `node scripts/test-sdk.js`.
6. Write a handoff report to `handoff.md` in your working directory containing:
   - Summary of changes.
   - Build output / verification success.
   - Baseline test execution results.

Use send_message to report back to your parent when done.
