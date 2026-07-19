# AROH Ecosystem Platform Architecture Guidelines

This document serves as the master architectural reference and design specification for the AROH Platform. It outlines the modular, single-source-of-truth architecture designed to support scalable, event-driven product integrations without maintaining duplicate codebases or modifying standalone product repositories.

---

## 1. High-Level Architecture

The AROH Ecosystem is structured as a hub-and-spoke model. The platform core serves as the centralized hub (managing identity, authentication, transaction auditing, and shared styling), while individual products orbit as independent spokes. 

```
┌────────────────────────────────────────────────────────┐
│                   AROH PLATFORM HUB                    │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐  │
│  │  Identity &  │ │ Aros Wallet  │ │  Aroh Design   │  │
│  │ Auth (ASDK)  │ │ Ledger (API) │ │  System (ADS)  │  │
│  └──────────────┘ └──────────────┘ └────────────────┘  │
└───────────────────────────▲────────────────────────────┘
                            │ (Event Hooks / APIs)
┌───────────────────────────┴────────────────────────────┐
│                    PRODUCT SPOKES                      │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────┐  │
│  │  Nebula Core   │ │  Spedex Core   │ │   Future   │  │
│  └────────────────┘ └────────────────┘ └────────────┘  │
└────────────────────────────────────────────────────────┘
```

The core tenet is **strict decoupling**: products exist to implement domain-specific business logic, while the platform handles cross-cutting ecosystem concerns.

---

## 2. Ecosystem Overview

The ecosystem consists of three primary components:
1. **Core Platform:** A centralized Web Dashboard (`apps/web`) hosting the landing page, global search, scheduled CMS alerts, system configurations, and the admin console.
2. **Product Cores (`[product]-core`):** Reusable npm workspace packages that hold all business logic, UI, routing, and APIs for a specific product. These cores are entirely ecosystem-agnostic.
3. **Ecosystem Integration Layers:** Code adapters (`integrations/[product]` or `packages/aroh-[product]`) that bridge product core events to platform API endpoints and state.

---

## 3. Product Interaction Model

Products interact with the platform exclusively through **asynchronous events** and **composition hooks**:
- **Ecosystem to Product:** The platform renders the product core in an iframe or imports the core views dynamically, injecting platform styling context and configurations via props.
- **Product to Ecosystem:** Product cores emit lifecycle events (e.g., `onWorkspaceCreated`, `onChallengeCompleted`). The platform's integration layer listens to these events to debit/credit Aros tokens, record transaction logs, or push user notifications.

Direct dependencies from product cores to ecosystem packages (like `@aroh/asdk`) are strictly prohibited.

---

## 4. Shared Services Architecture

Shared services are managed by the platform and consumed by products via secure API routes:
- **SSO Authentication:** Centralized token signing (JWT) and verification (`packages/asdk`). Authentication state is synchronized across active tabs client-side using storage listeners.
- **Wallet Ledger:** A transaction-audited financial system. Balance modifications are server-authoritative, logged immutably, and restricted via Firestore security rules.
- **CMS Notification Router:** An announcement feed managing publishing schedules. Future notifications are filtered client-side and database-side.

---

## 5. Monorepo Architecture

AROH uses npm workspaces to coordinate packages. Workspaces are defined in the root `package.json` under the `workspaces` array. The monorepo structure guarantees that shared dependencies (like React, TypeScript, and styling packages) are resolved from a single source, preventing version conflicts during compilation.

---

## 6. Package Architecture

To enforce separation of concerns, the package tree is divided into layer boundaries:
- **Presentation Layer (`packages/ads`):** Houses the Aroh Design System. Contains CSS tokens, layouts, buttons, and animations. Zero business logic.
- **Data & Services Layer (`packages/asdk`):** Houses the core SDK. Manages Zustand state, Firestore client methods, mock database fallbacks, and JWT decoding.
- **Product Core Layer (`packages/[product]-core`):** Contains independent product engines.
- **Integration Layer (`packages/aroh-[product]`):** Contains the event adapters linking cores to ASDK.

---

## 7. Integration Strategy

Integrating a product follows these steps:
1. **Abstract Product Logic:** Encapsulate the product's business engine and UI into a reusable `packages/[product]-core` workspace.
2. **Expose Lifecycle Events:** Expose functional hooks (e.g. `onActionTriggered(payload)`) from the core package.
3. **Write the Adapter:** Create an integration directory `integrations/[product]` inside AROH. Import the product core and wrap it, mapping the emitted events to ASDK actions (e.g. updating the Aros wallet ledger).
4. **Register in Hub:** Add the product metadata to `registeredProducts` in `apps/web/app/explore/page.tsx`.

---

## 8. Repository Structure

AROH supports two repository configurations:
- **Internal Core Monorepo:** The product core lives inside AROH monorepo (`packages/spedex-core`). The standalone product repository (`github.com/aroh/spedex`) imports this core package.
- **Decoupled Standalone Repositories:** Standalone repositories remain completely independent. The product core package is published to a private npm registry, and AROH pulls it as a standard package dependency.

This strategy ensures that updating a product core immediately updates both the standalone app and the ecosystem without copying code.

---

## 9. Folder Structure

```
aroh/                          # Monorepo Root
├── apps/
│   └── web/                   # Platform App (Next.js Dashboard)
├── packages/
│   ├── ads/                   # Design System Package (Tailwind + CSS)
│   ├── asdk/                  # Core Platform SDK Package (Zustand + Firebase)
│   └── [product]-core/        # Decoupled Product Core Package
├── integrations/
│   └── [product]/             # Ecosystem Event Adapters
└── config/                    # Global compilation & lint configs
```

---

## 10. Development Philosophy

1. **Design First:** Create clean interfaces and event boundaries before writing implementation logic.
2. **Do Not Duplicate:** Code must exist in exactly one place. If a feature is needed by multiple applications, promote it to a shared package.
3. **Developer Autonomy:** Standalone product repositories must be buildable and testable offline without running the central AROH dev server.

---

## 11. Engineering Principles

- **Single Source of Truth (SSOT):** No duplicate files, schemas, or actions.
- **Backend as Authority:** All sensitive actions (debits, upgrades, roles) must validate server-side.
- **Strict Linting & Types:** Unused variables or imports are compile-time errors. No `any` types.

---

## 12. Architecture Principles

- **Composition over Modification:** Extend product capabilities by wrapping, never editing core source code.
- **Stateless API Gates:** Next.js route handlers process incoming requests securely and write audit trails to Firestore.
- **Client Sandbox Isolation:** Mock services run entirely client-side and store sandbox state in browser `localStorage`.

---

## 13. AI Development Guidelines

When modifying files or adding features, AI agents must:
- Reference and obey all custom rules in `.agents/AGENTS.md`.
- Never copy external repository source code directly into `apps/` unless creating a decoupled adapter under `integrations/`.
- Ensure all relative import paths in Next.js App Router match the directory depth (e.g., `../../` for app/api).
- Clean up all unused imports and parameters to satisfy strict build checks.

---

## 14. Future Product Integration Strategy

Future products (like "Task Pro") will follow the same pattern:
1. Develop the core logic in `packages/task-pro-core`.
2. Emmit callback events on critical user steps (e.g. `onTaskCompleted`).
3. Set up the AROH integration layer under `integrations/task-pro` to reward the user with Aros tokens.
4. Mount the core inside AROH `apps/web/app/explore/task-pro` and leverage SSO session sync.
