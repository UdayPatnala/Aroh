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

## 📁 Monorepo Layout

```
d:/PROJECT/AROH/
├── apps/
│   └── web/                   # Next.js App Router Platform
│       ├── app/               # App Router pages and API routes
│       │   ├── api/           # Backend API route handlers
│       │   ├── admin/         # Operator controls & transaction logs
│       │   ├── cms/           # Dynamic homepage content manager
│       │   ├── dashboard/     # Wallet page, membership selection
│       │   └── login/         # Auth pages
│       └── tailwind.config.js # Tailwind CSS configured with packages/ads
├── packages/
│   ├── ads/                   # Aroh Design System (ADS)
│   │   ├── src/               # Shared CSS tokens, layout components
│   │   └── package.json
│   └── asdk/                  # Aroh Software Development Kit (ASDK)
│       ├── src/               # Shared state, Firestore schemas, mock DB fallback
│       └── package.json
├── package.json               # Monorepo root with workspaces
└── README.md                  # Root documentation
```

---

## 💻 Coding Guidelines

- **Naming Standards**:
  - React Components: `PascalCase`
  - Directories, non-component files: `kebab-case`
  - Variables, functions, API routes: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- **TypeScript**: Always use strict typing; `any` is prohibited.
- **Folder Structure**: Separate presentation components (under `packages/ads`) from business actions and database models (under `packages/asdk`).
- **Error Handling**: Use standardized response wrappers for all APIs (`{ success: boolean, data?: any, error?: { code: string, message: string } }`).
