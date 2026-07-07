# AROH Phase 2 Ecosystem Expansion & Integrations Plan

## Strategy
1. **Exploration**: Spawn a codebase Explorer agent to investigate:
   - Sibling repositories (`Nebula`, `javapath-pro`, `Spedex`, `Music Mirror`) structures, source folders, dependency maps, and how they should reference `@aroh/asdk`.
   - The current `apps/web/app/dashboard/page.tsx` implementation details, specifically how modal state, layout, tabs, and alerts are constructed, to fit the new UI features.
   - Verify the location and function of `scripts/test-sdk.js` and `scripts/test-session-sync.js`.
2. **Decomposition**: Decompose work into:
   - **Milestone 1**: Dashboard UI Integrations (Aros Purchase Panel, Developer API Portal, FCM toggle settings).
   - **Milestone 2**: Sibling Adapters Creation (Creating `aroh-adapter.ts` in all 4 external projects referencing `@aroh/asdk`).
   - **Milestone 3**: Ecosystem Integration documentation in external READMEs.
   - **Milestone 4**: Final QA Validation (building the project and running all test scripts).
3. **Execution**:
   - Dispatch workers to perform the modifications and run builds/tests.
   - Dispatch reviewers/challengers/auditors to verify changes.
4. **Verification & Audit**: Run the Forensic Auditor and the automated tests.
