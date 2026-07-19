# AROH Ecosystem Platform

Welcome to the **AROH Ecosystem**, a premium, unified digital platform containing multiple interconnected products sharing a centralized foundation.

---

## 🏛️ Governance & Repository Standards

This repository is governed by the **AROH Constitution** (`Doc 01`). Every feature, code change, database schema modification, and API design must align with these immutable principles.

### Immutable Core Principles
1. **Single Source of Truth (SSOT)**: Every state, business logic rule, and schema declaration must have one authoritative owner.
2. **Create Once, Use Everywhere**: Shared utilities, design system elements, and services must be centralized and reused. No duplicate code.
3. **Backend as the Authority**: Frontend is exclusively for presentation and user interaction. All validation, permissions, and transactions are enforced by the backend.
4. **Configuration over Hardcoding**: Feature flags, memberships, and layout configurations are stored in central configurations rather than hardcoded in views.
5. **Aros Economy Financial Integrity**: Balances are calculated through immutable ledger transactions. Direct balance updates are prohibited.

---

## 🛠️ Technology Stack

The platform's architecture is frozen as follows:
- **Monorepo**: npm workspaces
- **Frontend Core**: Next.js App Router (React 19), TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Database**: Firestore (Google Firebase)
- **Authentication**: Firebase Authentication
- **Asset Storage**: Firebase Storage
- **Validation**: Zod + React Hook Form
- **Animations**: Framer Motion
- **Hosting**: Vercel

---

## 📁 Scalable Ecosystem Monorepo Layout

```
d:/PROJECT/AROH/
├── apps/
│   └── web/                   # Central Next.js App Router Platform
│       ├── app/               # Main website, dashboard, operator panels
│       │   ├── api/           # Backend API route handlers
│       │   ├── admin/         # Operator controls & transaction logs
│       │   ├── cms/           # Dynamic homepage content manager
│       │   └── dashboard/     # Wallet page, membership selection
│       └── tailwind.config.js # Tailwind CSS configured with packages/ads
├── packages/
│   ├── ads/                   # Aroh Design System (ADS) - Shared UI Component Library
│   ├── asdk/                  # Aroh Software Development Kit (ASDK) - Shared State & Core services
│   └── [product]-core/        # Reusable Product Cores (Business logic, views, internal state)
├── integrations/
│   └── [product]/             # Product Integration Layers (ASDK wrappers, permissions, event listeners)
├── package.json               # Monorepo root with workspaces
└── README.md                  # Root documentation
```

---

## 🔄 Decoupled Product Integration Strategy

To prevent codebase duplication and architectural drift, AROH adopts a **Single Source of Truth** integration model:
1. **Zero Source Code Copying:** Standalone products (e.g., Spedex, Nebula) exist as independent git repositories. They import their core logic from a unified `[product]-core` workspace package.
2. **Product Core Independence:** Reusable business logic, views, and page routes live in the `[product]-core` package. The product core must never depend directly on `@aroh/asdk` or other ecosystem services.
3. **Ecosystem Integration Layers:** Ecosystem integration logic (SSO login redirection, Aros Wallet debiting, notification dispatching) is implemented entirely in the `integrations/[product]` or `packages/aroh-[product]` adapters using event composition.
4. **Event-Based Hooks:** Standalone cores expose public event hooks (e.g., `onWorkspaceCreated`, `onChallengeProgress`). The AROH ecosystem registers event listeners to reward Aros, index search keywords, or trigger notifications without modifying the product's code.

---

## 💻 Coding Guidelines

- **Naming Standards**:
  - React Components: `PascalCase`
  - Directories, non-component files: `kebab-case`
  - Variables, functions, API routes: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- **TypeScript**: Always use strict typing; `any` is prohibited. Unused imports/parameters must be cleaned up to pass strict compiler checks.
- **Folder Structure**: Separate presentation components (under `packages/ads`) from business actions, adapters, and databases.
- **Error Handling**: Use standardized response wrappers for all APIs (`{ success: boolean, data?: any, error?: { code: string, message: string } }`).
