# ADR-001: Platform-First Decoupled Architecture

- **Status:** Approved
- **Date:** 2026-07-20
- **Authors:** AROH System Architect & Engineering Team
- **Deciders:** Engineering Architecture Board

---

## Context & Problem Statement

Historically, software applications built under monorepo environments tend to tightly couple their UI views, internal state managers, and business logic to parent ecosystem services. This causes severe technical debt:
1. Applications cannot be deployed or distributed independently.
2. Updating product logic risks breaking platform services.
3. Third-party or open-source products cannot be integrated without copying and modifying source code, leading to code duplication and synchronization divergence.

---

## Decision Drivers

- **Single Source of Truth (SSOT):** Every product must have exactly one implementation.
- **Zero Duplication:** No modified copies of product code inside the ecosystem.
- **Product Independence:** Products must run standalone without AROH SDK dependencies.
- **Backend Authority:** Sensitive platform operations (credits, auth, roles) must be enforced server-side.

---

## Decision Outcome

We adopt a **Decoupled Hub-and-Spoke Architecture** governed by 10 permanent rules:

1. **Single Source of Truth:** Every product has exactly one implementation.
2. **Product Core Independence:** Business logic, views, and routing live in a reusable `[product]-core` package with zero dependencies on `@aroh/asdk`.
3. **No Code Duplication:** Zero source duplication between standalone products and AROH integrations.
4. **Composition over Modification:** Enhance product logic inside decoupled integration layers (`integrations/[product]` or adapter components) without modifying product core source.
5. **Decoupled Interfaces:** Products communicate via standard hooks, callbacks, or events (`onWorkspaceCreated`, `onChallengeCompleted`).
6. **Ecosystem Dependency Direction:** The ecosystem depends on products; products NEVER depend on the ecosystem.
7. **Event-Based Integration:** Integrations occur through public events and API callbacks.
8. **Shared Packages Placement:** Centralized helper services (auth, wallet, ui, notifications) belong in shared monorepo packages (`@aroh/asdk`, `@aroh/ads`).
9. **Zero Maintenance Synchronization:** Managed project manifests track upstream releases, enabling automatic semantic synchronization.
10. **Backend Authority Enforcement:** All financial transactions, role updates, and access controls are validated and executed server-side.

---

## Consequences & Trade-offs

### Positive
- Product cores can be published and used independently outside AROH.
- Updating product cores automatically benefits the AROH platform without manual code edits.
- Architecture remains clean, modular, and scalable.

### Negative / Mitigations
- Requires explicit adapter mapping layers (`integrations/[product]`) in `apps/web`.
- Event handling must be carefully typed using Zod schemas.
