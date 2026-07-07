# AROH Project Rules

### R-NextJS-Imports. Relative Import Depth in App Router
When adding import paths from nested route handlers (e.g., `app/api/[scope]/[feature]/route.ts`), calculate the exact folder nesting depth. A common mistake is using `../` (1 level up) instead of `../../` (2 levels up) when referencing a base helper file located directly under `app/api/`.

### R-TS-Strict. Unused Imports Clean Up
Under strict TypeScript configurations, unused imports will trigger build failures. Always run a quick manual cleanup or check for unused imports when editing/replacing route handler logic.
