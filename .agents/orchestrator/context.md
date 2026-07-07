# Project Context — AROH Phase 2

## Overview
Phase 2 focuses on expanding the AROH Ecosystem Platform foundation with:
1. R1: Aros Metrics Engine Dashboard (using `recharts` for simulated live admin charts).
2. R2: Ecosystem-Wide Search (interactive search across products, CMS announcements, and documentation on Explore Hub and Command Palette).
3. R3: Scheduled CMS Alerts (configure publication dates for announcements, hidden on homepage until scheduled time).
4. R4: Local SSO Session Sync (synchronize auth state using localStorage events across tabs, redirecting to /login).

## Architectural Foundations
- **Web App**: Next.js App Router project in `apps/web`.
- **Packages**: Shared packages under `packages/` (e.g., `@aroh/asdk` for SDK services, `@aroh/ads` for advertisement components).
- **Database**: Firebase Firestore is used for backend services, with rules defined in `firestore.rules`.
- **Dependencies**: React 19, Next.js 16, recharts 2.12.0, zustand 5.0.0, zod, firebase-admin.

## Constraints & Requirements
- Strictly follow DISPATCH-ONLY rules: Orchestrator plans and coordinates, delegates code modifications and verification to specialist agents.
- Ensure strict TypeScript compliance, unused import cleanups, and App Router relative import depth checks.
