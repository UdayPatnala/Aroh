## 2026-07-07T03:55:26Z
You are teamwork_preview_worker.
Your identity: worker_m2
Your working directory is: d:\PROJECT\AROH\.agents\worker_m2

You are tasked to implement Milestone 2: Scheduled CMS Alerts.
Please read the project layout: d:\PROJECT\AROH\PROJECT.md
Read the scope document: d:\PROJECT\AROH\.agents\sub_orch_m2\SCOPE.md
Read the analysis from Explorer 2: d:\PROJECT\AROH\.agents\explorer_m2_2\analysis.md
Read the analysis from Explorer 3: d:\PROJECT\AROH\.agents\explorer_m2_3\analysis.md

Your task:
1. Implement the service-side changes in `packages/asdk/src/services/firebase.ts`. Specifically:
   - Update `getAnnouncements` to filter out announcements whose `publishedAt` date-time is in the future relative to the current local/system time: `new Date(a.publishedAt) <= new Date()`.
   - Update `upsertAnnouncement` mock implementation to save the provided `publishedAt` value rather than overwriting it with `new Date().toISOString()`.
2. Implement the frontend-side changes in `apps/web/app/cms/page.tsx`. Specifically:
   - Add a date/time input field (`<input type="datetime-local">`) to set/edit the publication date.
   - Initialize/populate the input correctly when editing or creating.
   - Pass the ISO string of the configured date to `upsertAnnouncement`.
   - Ensure the CMS feed list displays "Scheduled" status badge and timestamp for future announcements.
3. Keep code changes clean and compliant with rules:
   - TypeScript compliance (no unused imports, correct relative path depths).
   - Ensure no hydration mismatches or SSR errors on CMS page when accessing date/time properties (consider mounting hook or state initialization on mount).
4. Run the baseline tests `node scripts/test-sdk.js` to ensure you haven't broken the ASDK library. Add new test coverage in ASDK or write unit/integration tests to verify scheduled CMS alerts if appropriate.
5. Provide a detailed report of changes, build output, and test execution results in your working directory as `handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
