# AROH Project Rules

### R-NextJS-Imports. Relative Import Depth in App Router
When adding import paths from nested route handlers (e.g., `app/api/[scope]/[feature]/route.ts`), calculate the exact folder nesting depth. A common mistake is using `../` (1 level up) instead of `../../` (2 levels up) when referencing a base helper file located directly under `app/api/`.

### R-TS-Strict. Unused Imports Clean Up
Under strict TypeScript configurations, unused imports will trigger build failures. Always run a quick manual cleanup or check for unused imports when editing/replacing route handler logic.

### R-TS-Extensions. TypeScript Relative Import Extensions
In Next.js/TypeScript monorepos, relative imports must NOT include '.ts' or '.tsx' file extensions in import paths (e.g., use `import ... from "../services/firebase"` instead of `import ... from "../services/firebase.ts"`). Including extensions breaks Next.js production compilation.

### R-Node-Testing. TypeScript Script Execution in Node.js
When running local TypeScript scripts (e.g., quality assurance integration tests) under Node.js, execute them using `npx tsx` instead of raw `node`. The `tsx` runner transparently compiles files and resolves extensionless TS relative imports without modifications.

---

### R-Ecosystem-Architecture. Permanent Design Rules

All future ecosystem expansions and third-party product integrations must comply with the following 10 rules:
1. **Single Source of Truth:** Every product has exactly one implementation. AROH does not maintain modified copies of products.
2. **Product Core Independence:** Business logic, views, internal state, and routing belong inside a reusable `[product]-core` package which has zero dependencies on ASDK or AROH ecosystem services.
3. **No Code Duplication:** There must be zero source code duplication between standalone products and AROH integrations.
4. **Composition over Modification:** Enhance product logic inside decoupled integration layers (`integrations/[product]` or `packages/aroh-[product]`) without modifying the product core itself.
5. **Decoupled Interfaces:** Products must remain ecosystem-independent and communicate via standard hooks, callbacks, or events.
6. **Ecosystem Dependency Direction:** The ecosystem depends on products; products must never depend on the ecosystem.
7. **Event-Based Integration:** Integrations must occur through public APIs, hooks, or events (e.g., `onWorkspaceCreated()`, `onChallengeProgress()`) rather than source code edits.
8. **Shared Packages Placement:** Centralized helper services (auth, wallet, ui, notifications) belong in shared monorepo packages (e.g., `packages/asdk`, `packages/ads`).
9. **Zero Maintenance synchronization:** Updating a standalone product should automatically benefit the ecosystem without manual synchronization or code copying.
10. **Backend Authority enforcement:** All integration tasks (wallet credits/debits, access control checks) must be validated and executed server-side in API routes.
