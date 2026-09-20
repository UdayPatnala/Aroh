# AROH Open Source Platform: Universal Modular Architecture & Change-Isolation Governance

> **Authoritative System Architecture & Boundary Specification**  
> **Platform Version**: `2.03.08.0`  
> **Governance Authority**: `Universal Modular Architecture & Change-Isolation Governance System`, `GEMINI.md`, `VERSION_CONTROLLER.md`  
> **Golden Invariant**: *Every page, feature, function, component, workflow, service, API, data model, button, interaction, and system capability must have a clearly identifiable ownership boundary so that modifying one thing does not unnecessarily modify, overwrite, delete, or destabilize unrelated parts of the project.*

---

## 1. Architecture is a System of Boundaries

The AROH repository is strictly organized by **domain and feature ownership**, not merely by arbitrary file types. Large global grab-bags (e.g., generic `utils/`, unowned `services/`, untraced `components/`) are structurally prohibited because they introduce hidden coupling and create orphan code.

Every engineering decision begins with the fundamental question:
> **"Which part of the system owns this behavior?"**  
> *(rather than "What type of file is this?")*

---

## 2. Architecture Hierarchy

The repository adheres to the following explicit tier hierarchy:

```text
d:\PROJECT\AROH Open Source
│
├── APP / SHELL (Platform Application & Routing)
│   └── Aroh/apps/web/
│       ├── app/ (Next.js App Router: 44 compiled routes)
│       ├── components/ (Shell navigation, header, footer, structured-data)
│       └── middleware.ts (W3C traceparent edge proxy middleware)
│
├── DOMAINS (Core Platform Capabilities & Business Logic)
│   ├── Domain 1: Identity & Authentication (@aroh/asdk/services/firebase.ts, apps/web/app/login)
│   ├── Domain 2: Financial Economy & Aros Ledger (@aroh/asdk/services/wallet.ts, purchase-safety.ts, payment.ts)
│   ├── Domain 3: Developer Platform & API Vault (@aroh/asdk/services/api-key.ts, webhook.ts)
│   ├── Domain 4: AI Orchestration (@aroh/asdk/services/ai.ts, apps/web/app/ai)
│   ├── Domain 5: Product Showcase & Registry (@aroh/asdk/src/registry/products.ts, apps/web/app/explore)
│   ├── Domain 6: Observability, Tracing & Telemetry (@aroh/asdk/src/tracing, src/telemetry, /api/telemetry/stream)
│   └── Domain 7: DPDP Privacy, Consent & Statutory Rights (@aroh/asdk/services/privacy.ts, apps/web/app/privacy)
│
├── SHARED (Universal Design Tokens & Visual Primitives)
│   └── Aroh/packages/ads/ (Outfit typography, WCAG 2.1 AA palette, button/card primitives)
│
├── INFRASTRUCTURE (Platform SDK & Runtime Utilities)
│   └── Aroh/packages/asdk/ (Typed schemas, mock DB fallback, Web Crypto tracing, SSE broker)
│
├── AUTONOMOUS PRODUCT SPOKES (Independent Decoupled Flagships)
│   └── Products/ (Inviolable read-only platform boundary)
│       ├── Products/OmniStream (Media streaming spoke, v1.8.5)
│       └── Products/Spedex (Logistics & enterprise spoke, v2.1.0)
│
├── CONFIGURATION (Centralized Environment & Tooling)
│   ├── package.json, turbo.json (Monorepo build orchestration)
│   ├── Aroh/apps/web/next.config.mjs, tsconfig.json
│   └── Aroh/packages/*/tsconfig.json
│
├── TESTING (Proximity-Driven Verification Suites)
│   ├── Aroh/packages/asdk/tests/ (12 Vitest suites, 130 assertions)
│   ├── Aroh/packages/ads/tests/ (Design system test suite, 7 assertions)
│   └── Aroh/scripts/ (test-sync-cli.js, test-privacy-static-audit.js, test-seo-audit.js)
│
└── DOCUMENTATION & GOVERNANCE (Institutional Memory Ledgers)
    ├── VERSION_CONTROLLER.md (Authoritative 4-tier version ledger)
    ├── AROH.md (Master living system specification)
    ├── ARCHITECTURE.md (Authoritative boundary & ownership map)
    └── Aroh/docs/ (EXECUTION_HISTORY.md, VERSION_HISTORY.md, PROJECT_STATUS.md, statutory registers)
```

---

## 3. First Principle — Absolute Ownership

Every meaningful piece of code, UI element, and endpoint has an assigned owner:

| Behavior / Capability | Owning Domain | Primary Implementation File |
|---|---|---|
| User Login & SSO Broadcast | Identity & Auth | [`packages/asdk/src/services/firebase.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/firebase.ts) |
| Aros Token Double-Entry Ledger | Financial Economy | [`packages/asdk/src/services/wallet.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/wallet.ts) |
| Minor Payment Restriction (`NO_MINOR_PAYMENT`) | Financial Economy | [`packages/asdk/src/services/purchase-safety.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/purchase-safety.ts) |
| Cryptographic Transaction Receipts | Financial Economy | [`packages/asdk/src/services/purchase-safety.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/purchase-safety.ts) |
| Formal Grievance/Dispute Redressal | Financial Economy | [`packages/asdk/src/services/purchase-safety.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/purchase-safety.ts) |
| HMAC-SHA256 API Key Generation & Gating | Developer Platform | [`packages/asdk/src/services/api-key.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/api-key.ts) |
| Webhook Dispatch & Exponential Backoff | Developer Platform | [`packages/asdk/src/services/webhook.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/webhook.ts) |
| Interactive Developer API Explorer | Developer Platform | [`apps/web/app/dashboard/keys/page.tsx`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/apps/web/app/dashboard/keys/page.tsx) |
| Multi-Provider AI Inference Orchestration | AI Orchestration | [`packages/asdk/src/services/ai.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/ai.ts) |
| Canonical Product Registry | Product Showcase | [`packages/asdk/src/registry/products.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/registry/products.ts) |
| W3C Trace Context Propagation (`traceparent`) | Observability | [`packages/asdk/src/tracing/index.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/tracing/index.ts) |
| Real-Time Observability SSE Stream | Observability | [`packages/asdk/src/telemetry/index.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/telemetry/index.ts) |
| DPDP Act 2023 Consent & Rights Machine | Statutory Privacy | [`packages/asdk/src/services/privacy.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/privacy.ts) |
| Design Tokens & UI Primitives | Design System | [`packages/ads/src/index.tsx`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/ads/src/index.tsx) |
| Media Streaming Spoke Code | OmniStream Spoke | [`Products/OmniStream/`](file:///d:/PROJECT/AROH%20Open%20Source/Products/OmniStream) |
| Logistics & Campus Fintech Spoke Code | SpeDex Spoke | [`Products/Spedex/`](file:///d:/PROJECT/AROH%20Open%20Source/Products/Spedex) |

---

## 4. Second Principle — Locality of Behavior

Code that changes together lives together. A feature's types, validation schemas, business logic, and tests are colocated or directly indexed rather than scattered across unrelated global directories.

For example, the **Purchase Safety Feature**:
- **Zod Schemas**: [`packages/asdk/src/schemas/purchase-safety.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/schemas/purchase-safety.ts)
- **Service Implementation**: [`packages/asdk/src/services/purchase-safety.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/purchase-safety.ts)
- **Provider Interface**: [`packages/asdk/src/services/payment-provider.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/services/payment-provider.ts)
- **Automated Tests**: [`packages/asdk/tests/purchase-safety.test.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/tests/purchase-safety.test.ts) & [`dispute-receipt.test.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/tests/dispute-receipt.test.ts)
- **Web UI Boundaries**: [`apps/web/app/dashboard/purchase/page.tsx`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/apps/web/app/dashboard/purchase/page.tsx)
- **API Endpoints**: [`apps/web/app/api/payment/*`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/apps/web/app/api/payment)

---

## 5. Third Principle — Change Isolation & Radius

When a change is requested, the modification radius must be calculated **before touching code**.

### Classification of Files:
1. **`DIRECT`**: Files implementing the requested behavior.
2. **`RELATED`**: Direct support files (schemas, types, tests for that feature).
3. **`DEPENDENT`**: Files consuming the feature (requires impact assessment).
4. **`SHARED`**: Common infrastructure (`@aroh/ads`, `@aroh/asdk/src/index.ts`, `middleware.ts`). Changing shared code requires cross-consumer regression verification.
5. **`UNRELATED`**: All other platform domains and autonomous spokes. **UNRELATED files MUST NOT be modified.**

The default operating rule is:
> **Change the smallest possible ownership boundary. Zero scope creep.**

---

## 6. Detailed Architectural Ownership Map

```text
DOMAIN 1: IDENTITY & AUTHENTICATION
├── Pages: apps/web/app/login/page.tsx
├── APIs: apps/web/app/api/user/upgrade/route.ts
├── Services: packages/asdk/src/services/firebase.ts
├── State: packages/asdk/src/store/index.ts (user, sessionSync)
└── Tests: packages/asdk/tests/session-sync.test.ts

DOMAIN 2: FINANCIAL ECONOMY & AROS LEDGER
├── Pages: apps/web/app/dashboard/page.tsx, apps/web/app/dashboard/purchase/page.tsx
├── APIs:
│   ├── /api/payment/checkout
│   ├── /api/payment/webhook
│   ├── /api/payment/eligibility
│   ├── /api/payment/consent
│   ├── /api/payment/receipt/[receiptId]
│   └── /api/payment/dispute
├── Services:
│   ├── packages/asdk/src/services/wallet.ts (Double-entry ledger calculation)
│   ├── packages/asdk/src/services/purchase-safety.ts (Minor block, consent, receipts, disputes)
│   ├── packages/asdk/src/services/payment.ts (Stripe / checkout builder)
│   └── packages/asdk/src/services/payment-provider.ts (MockPaymentProvider)
├── Schemas: packages/asdk/src/schemas/payment.ts, purchase-safety.ts
├── Registers: docs/privacy/PAYMENT_DATA_PROCESSING_REGISTER.json
└── Tests: packages/asdk/tests/payment.test.ts, purchase-safety.test.ts, dispute-receipt.test.ts

DOMAIN 3: DEVELOPER PLATFORM & API GOVERNANCE
├── Pages: apps/web/app/dashboard/keys/page.tsx (Key Vault & Interactive API Explorer)
├── APIs:
│   ├── /api/developer/keys & /api/developer/keys/[keyId]
│   └── /api/developer/webhooks & /api/developer/webhooks/[webhookId]
├── Services:
│   ├── packages/asdk/src/services/api-key.ts (HMAC-SHA256 hash storage, tier limits)
│   └── packages/asdk/src/services/webhook.ts (Signature signing, exponential backoff)
├── Schemas: packages/asdk/src/schemas/api-key.ts, webhook.ts
└── Tests: packages/asdk/tests/api-key.test.ts, webhook.test.ts

DOMAIN 4: AI ORCHESTRATION TIER
├── Pages: apps/web/app/ai/page.tsx (Interactive developer studio)
├── Services: packages/asdk/src/services/ai.ts (Provider-agnostic multi-model orchestrator)
├── Schemas: packages/asdk/src/schemas/ai.ts
└── Tests: packages/asdk/tests/ai.test.ts

DOMAIN 5: PRODUCT SHOWCASE & CANONICAL REGISTRY
├── Pages: apps/web/app/explore/page.tsx, apps/web/app/explore/[productId]/page.tsx, apps/web/app/products/page.tsx
├── Registry: packages/asdk/src/registry/products.ts (CANONICAL_PRODUCT_REGISTRY)
├── Schemas: packages/asdk/src/schemas/product.ts
└── Tests: packages/asdk/tests/product-registry.test.ts

DOMAIN 6: OBSERVABILITY, W3C TRACING & TELEMETRY
├── Pages: apps/web/app/admin/page.tsx (Live operational dashboard)
├── Middleware: apps/web/middleware.ts (traceparent ingress/egress injection)
├── APIs: /api/telemetry/stream (SSE stream), /api/health (Liveness probe)
├── Engine:
│   ├── packages/asdk/src/tracing/index.ts (Web Crypto W3C traceparent engine)
│   └── packages/asdk/src/telemetry/index.ts (In-memory ring buffer, aggregate metrics)
└── Tests: packages/asdk/tests/tracing.test.ts, telemetry.test.ts

DOMAIN 7: STATUTORY PRIVACY, CONSENT & RIGHTS (DPDP ACT 2023)
├── Pages:
│   ├── /privacy (Itemized notice)
│   ├── /terms & /acceptable-use (Governance)
│   ├── /cookies (Granular preference center)
│   ├── /privacy/consent (Consent lifecycle)
│   ├── /privacy/rights (Access, Correction, Erasure, Nomination)
│   ├── /privacy/grievance (Section 13 redressal)
│   ├── /privacy/security (Safeguards)
│   ├── /privacy/retention (Data lifecycle)
│   └── /privacy/ai (Stateless inference notice)
├── APIs: /api/privacy/consent, /api/privacy/rights, /api/privacy/grievance, /api/privacy/export, /api/privacy/delete-account
├── Services: packages/asdk/src/services/privacy.ts
├── Registers: DATA_PROCESSING_REGISTER.json, COOKIE_INVENTORY.json, DATA_PROCESSORS.json, LEGAL_REVIEW_REGISTER.json
└── Tests: scripts/test-privacy-static-audit.js (117 assertions)

DOMAIN 8: DESIGN SYSTEM (@aroh/ads)
├── Atoms: Button, Card, Badge, Modal, Input
├── Tokens: Colors (#F7F5F0, #111111), Spacing, Typography (Outfit)
└── Tests: packages/ads/tests/ads.test.ts (7 assertions)

DOMAIN 9: AUTONOMOUS PRODUCT SPOKES (Products/)
├── OmniStream (v1.8.5): Products/OmniStream [Submodule / Read-Only]
├── SpeDex (v2.1.0): Products/Spedex [Submodule / Read-Only]
└── Invariant: 0 mutations allowed during platform development.
```

---

## 7. Traceability: User Action to Data Layer

Every user action in the platform follows a traceable execution sequence:

```text
USER ACTION
    ↓
PAGE LAYER (e.g. apps/web/app/dashboard/purchase/page.tsx)
    ↓
FEATURE BOUNDARY (Purchase Settlement Dialog & Consent Attestation)
    ↓
COMPONENT (Button: "Confirm purchase — $15.00")
    ↓
ACTION HANDLER (handlePurchase)
    ↓
API ROUTE (/api/payment/checkout)
    ↓
SERVICE LAYER (purchaseSafetyService.assertPurchaseEligible)
    ↓
GATEWAY ABSTRACTION (MockPaymentProvider.createPaymentIntent)
    ↓
SETTLEMENT ENGINE (purchaseSafetyService.settlePaymentFulfillment)
    ↓
FINANCIAL LEDGER (mockWalletService.creditWallet -> append-only transaction entry)
    ↓
RECEIPT ENGINE (generateCryptographicReceipt -> SHA-256 hash)
    ↓
AUDIT EVENT (emitAuditEvent -> COMPLIANCE_EVENT)
    ↓
UI CONFIRMATION & RECEIPT MODAL
```

---

## 8. Shared Code Governance Rules

Shared code (`packages/ads`, `@aroh/asdk/src/index.ts`, `apps/web/middleware.ts`) has a broad blast radius:

1. **High-Risk Classification**: Any modification to shared packages requires regression testing across all consuming domains (`npm test` across monorepo).
2. **Never Solve Local Problems with Shared Code**: If a feature requires specific formatting or validation, keep it inside that feature. Do not promote code to `shared` without at least three distinct domain consumers and an explicit contract.
3. **Controlled Dependency Direction**:
   ```text
   Application Shell (apps/web)
       ↓
   Domains (services/*)
       ↓
   Contracts & Schemas (schemas/*)
       ↓
   Shared Infrastructure (ads, tracing, crypto)
   ```
   **Circular dependencies between features are strictly prohibited.**

---

## 9. Single Source of Truth Register

Conflicting copies of state or truth are strictly forbidden:

| System Artifact | Single Source of Truth | Owner | Synchronization Mechanism |
|---|---|---|---|
| Platform Version | [`VERSION_CONTROLLER.md`](file:///d:/PROJECT/AROH%20Open%20Source/VERSION_CONTROLLER.md) | Universal Governance | Mirror to `@aroh/asdk/src/version/index.ts` & `/api/platform/version` |
| Product Showcase | [`packages/asdk/src/registry/products.ts`](file:///d:/PROJECT/AROH%20Open%20Source/Aroh/packages/asdk/src/registry/products.ts) | Product Domain | Validated by Zod `ProductRecordSchema` against GitHub repos |
| Aros Balances | Double-Entry Transaction Ledger (`walletService`) | Financial Domain | Derived at runtime: $\sum Credits - \sum Debits$ (0 direct balance writes) |
| Statutory Legal Status | `Aroh/docs/privacy/LEGAL_REVIEW_REGISTER.json` | Legal Domain | Static audit via `scripts/test-privacy-static-audit.js` |
| AI Discoverability Directives | `apps/web/public/llms.txt` & `llms-full.txt` | Discovery Domain | Static audit via `scripts/test-seo-audit.js` |

---

## 10. Change Manifest Protocol

Before editing any file, the engineer or agent must formulate an internal change manifest:

```text
CHANGE MANIFEST
Requested: <Exact request>
Direct Files: <Files creating the new behavior>
Related Files: <Schemas, tests, types directly supporting the change>
Dependent Files: <Consumers requiring contract awareness>
Shared Files: <Shared packages affected (triggers full regression)>
Unrelated Files: <All other files — MUST REMAIN UNTOUCHED>
Allowed Modification Radius: Direct + necessary Related
```

---

## 11. Code Preservation & Anti-Destruction Rules

1. **"Nothing Disappears" Rule**: No existing feature, API, validation check, or test may disappear because code was refactored or moved.
2. **File Replacement Protection**: Never rewrite an entire 500-line file when a targeted block edit accomplishes the goal.
3. **Dead Code Verification**: Never delete code without checking dynamic imports, routes, API consumers, and test suites.
4. **Zero Fabrication**: Never invent synthetic metrics, mock URLs, fake commit hashes, or imaginary capabilities.
5. **`Products/` Boundary Isolation**: Zero mutations to files under `Products/`.

---

## 12. Master Change Pipeline

Every modification must execute this 18-step pipeline:

```text
┌───────────────────────────────────────────┐
│ 1. READ VERSION CONTROLLER                │
├───────────────────────────────────────────┤
│ 2. READ ARCHITECTURE (ARCHITECTURE.md)    │
├───────────────────────────────────────────┤
│ 3. SEARCH PROJECT & LOCATE EXISTING CODE  │
├───────────────────────────────────────────┤
│ 4. IDENTIFY OWNER DOMAIN                  │
├───────────────────────────────────────────┤
│ 5. TRACE DEPENDENCIES                     │
├───────────────────────────────────────────┤
│ 6. CREATE CHANGE MANIFEST & RADIUS        │
├───────────────────────────────────────────┤
│ 7. CLASSIFY VERSION LEVEL (A.BC.DE.F)     │
├───────────────────────────────────────────┤
│ 8. CALCULATE TARGET VERSION               │
├───────────────────────────────────────────┤
│ 9. IMPLEMENT SMALLEST SAFE CHANGE         │
├───────────────────────────────────────────┤
│ 10. TEST LOCALLY (PROXIMITY TEST)         │
├───────────────────────────────────────────┤
│ 11. VERIFY FULL MONOREPO (REGRESSION)     │
├───────────────────────────────────────────┤
│ 12. VERIFY BUILD (NEXT.JS TURBOPACK)      │
├───────────────────────────────────────────┤
│ 13. VERIFY NO FUNCTIONALITY DISAPPEARED   │
├───────────────────────────────────────────┤
│ 14. UPDATE VERSION EXPORT IN CODE         │
├───────────────────────────────────────────┤
│ 15. UPDATE ARCHITECTURE & KNOWLEDGE DOCS  │
├───────────────────────────────────────────┤
│ 16. UPDATE VERSION CONTROLLER             │
├───────────────────────────────────────────┤
│ 17. COMMIT & PUSH TO AUTHORIZED REMOTES   │
├───────────────────────────────────────────┤
│ 18. REPORT FINAL COMPLETION STATE         │
└───────────────────────────────────────────┘
```
