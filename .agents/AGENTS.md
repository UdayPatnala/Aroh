# AROH Project Rules

### R-NextJS-Imports. Relative Import Depth in App Router
When adding import paths from nested route handlers (e.g., `app/api/[scope]/[feature]/route.ts`), calculate the exact folder nesting depth. A common mistake is using `../` (1 level up) instead of `../../` (2 levels up) when referencing a base helper file located directly under `app/api/`.

### R-TS-Strict. Unused Imports Clean Up
Under strict TypeScript configurations, unused imports will trigger build failures. Always run a quick manual cleanup or check for unused imports when editing/replacing route handler logic.

### R-TS-Extensions. TypeScript Relative Import Extensions
In Next.js/TypeScript monorepos, relative imports must NOT include '.ts' or '.tsx' file extensions in import paths (e.g., use `import ... from "../services/firebase"` instead of `import ... from "../services/firebase.ts"`). Including extensions breaks Next.js production compilation.

### R-Node-Testing. TypeScript Script Execution in Node.js
When running local TypeScript scripts (e.g., quality assurance integration tests) under Node.js, execute them using `npx tsx` instead of raw `node`. The `tsx` runner transparently compiles files and resolves extensionless TS relative imports without modifications.
