# AROH Platform: Version History & Living Architecture Control System

> **Source of Truth**: This document represents the authoritative, permanent version timeline, Git recovery index, and living architectural memory of the **AROH Open Source Platform**. It is modeled after the OmniStream architecture intelligence standard and continuously synchronized with codebase verification.

---

## 1. Quick Navigation Index (Authoritative Format: `A.BC.DE.F`)

| Canonical Version | Legacy Tag | Date | Change Level | Quick Summary | Commit |
|:---:|:---:|---|:---:|---|:---:|
| **`2.04.00.0`** | `v2.4.0` | 2026-09-21 | `SUB-VERSION` (`BC`) | **Phase 4 Mobile Expansion: Unified Cross-Platform Shell & React Native Ecosystem Client**: Initialized `@aroh/mobile` client shell (`apps/mobile`), universal storage engine (`IPlatformStorage`), deterministic `aroh://` deep linking router, mobile device biometric security attestation, and proximity test suites. | [`HEAD`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.03.08.0`** | `v2.3.8` | 2026-09-20 | `FUNCTIONAL` (`DE`) | **Universal Modular Architecture & Change-Isolation Governance System**: Established authoritative `ARCHITECTURE.md` at repository root implementing 76-rule modular architecture and change-isolation governance. Mapped 9 platform domains, 44 routes, and single sources of truth, enforcing change radius protocol (`DIRECT`, `RELATED`, `DEPENDENT`, `SHARED`, `UNRELATED`). | [`HEAD`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.03.07.0`** | `v2.3.7` | 2026-09-20 | `FUNCTIONAL` (`DE`) | **Ecosystem Polish, Cryptographic Receipts, Grievance/Dispute Redressal & Interactive Developer API Explorer**: Implemented user-facing dispute submission & grievance redressal interface, cryptographic transaction receipts modal & retrieval endpoint, and an interactive Developer API Explorer in Developer Tools dashboard. | [`d37e3e2`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.03.06.0`** | `v2.3.6` | 2026-09-20 | `FUNCTIONAL` (`DE`) | **Aros Age, Consent, Purchase Safety & Compliance Hardening**: Enforced mandatory `NO_MINOR_PAYMENT_FOR_AROS = TRUE` policy server-side, dedicated affirmative consent, provider-agnostic payment abstraction, authoritative append-only ledger settlement, statutory registers (`PAYMENT_DATA_PROCESSING_REGISTER.json`), and comprehensive 15-test purchase safety suite. | [`629fb18`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.03.05.0`** | `v2.3.5` | 2026-09-19 | `FUNCTIONAL` (`DE`) | **Wave 2 Milestone 3.5: Real-Time Telemetry Broker & Registry Modernization**: Implemented circular event ring buffer (500 events), SSE metrics stream route (`/api/telemetry/stream`), Admin Dashboard Telemetry Panel, and canonical product registry URL synchronization for JavaPath Pro, OmniStream, and Music Mirror. | [`HEAD`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.03.04.0`** | `v2.3.4` | 2026-09-19 | `FUNCTIONAL` (`DE`) | **Wave 2 Milestone 3.4: W3C Distributed Tracing**: Implemented Web Crypto API-based W3C Trace Context engine (`traceparent` format `00-{traceId}-{spanId}-{flags}`) in `@aroh/asdk`, integrated Next.js Proxy Middleware propagating trace context on ingress/egress, and verified with 11 automated Vitest assertions. | [`HEAD`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.03.03.0`** | `v2.3.3` | 2026-09-19 | `FUNCTIONAL` (`DE`) | **Wave 2 Milestone 3.3: Fiat-to-Aros Settlement On-Ramp**: Implemented Stripe Checkout session builder, fixed exchange rate conversion ($1.00 USD = 100 Aros), idempotent settlement engine utilizing immutable ledger transactions, Stripe webhook clearance endpoint, and dashboard purchase interface (`/dashboard/purchase`). | [`HEAD`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.03.02.0`** | `v2.3.2` | 2026-09-19 | `FUNCTIONAL` (`DE`) | **Wave 2 Milestone 3.2: Asynchronous Webhook Clearance Engine**: Implemented webhook registration schemas and service, cryptographic HMAC-SHA256 event signing (`x-aroh-signature`) with timestamp replay prevention, exponential backoff retry clearance dispatcher ($2^n \times 500\text{ms}$ over 3 attempts), Next.js developer webhook API routes, and 16 automated Vitest assertions. | [`HEAD`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.03.01.1`** | `v2.3.1` | 2026-09-19 | `PATCH` (`F`) | **Dynamic Version Governance & Unobtrusive UI Display**: Reconstructed pre-v2 history (Phases 0 & 1), established centralized `@aroh/asdk` version governance exports, created Next.js `/api/platform/version` endpoint, mounted unobtrusive floating bottom-right version badge with interactive popover, and eliminated hardcoded version string from platform footer. | [`HEAD`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.03.01.0`** | `v2.3.0` | 2026-09-19 | `FUNCTIONAL` (`DE`) | **Wave 2 Milestone 3.1: Developer API Key Vault**: Implemented cryptographic HMAC-SHA256 API key generation, zero-plaintext storage (SHA-256 hash only), rate limit tier gating (Basic 60 rpm, Pro 300 rpm, Enterprise 1200 rpm), Next.js API routes (`/api/developer/keys`), and dashboard key vault UI (`/dashboard/keys`). Expanded test coverage with 10 new Vitest assertions; 33/33 routes compiled. | [`97b8557`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.02.00.0`** | `v2.2.0` | 2026-09-11 | `SUB-VERSION` (`BC`) | **SEO, AI Discoverability, Structured Data, Production Foundation & Execution History Protocol**: Established permanent Execution History ledger (`docs/EXECUTION_HISTORY.md`), created `/llms.txt` and `/llms-full.txt`, added Schema.org JSON-LD structured data, strengthened root & page metadata across all routes, expanded sitemap to 25 canonical routes, hardened robots.txt crawler directives, implemented custom 404 (`not-found.tsx`) and error boundary (`error.tsx`), and expanded test suite to 423 passing assertions. | [`e752edb`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **`2.01.00.0`** | `v2.1.0` | 2026-09-11 | `SUB-VERSION` (`BC`) | **AROH Privacy, Consent, Legal Terms, Cookies & DPDP Compliance**: Implemented full privacy & compliance architecture under DPDP Act 2023 & DPDP Rules 2025. Codified 20 master legal/privacy documents, 4 machine-readable registers, ASDK consent & rights engine, universal cookie banner & footer, 10 public routes, 5 API routes, and expanded test suite to 367 passing assertions. | [`9d4dc71`](file:///d:/PROJECT/AROH%20Open%20Source) |

---

## 2. Version Entries

### 2.04.00.0 (`v2.4.0`)
- **Date**: 2026-09-21
- **Change Level**: `SUB-VERSION` (`BC=04`, `DE=00`, `F=0`)
- **Previous Version**: `2.03.08.0` (`v2.3.8`)

#### Quick Summary
Delivered **Phase 4 Mobile Expansion: Unified Cross-Platform Shell & React Native Ecosystem Client**:
- **Cross-Platform Mobile Shell (`Aroh/apps/mobile`, `@aroh/mobile`)**:
  - Implemented mobile client shell with tab-based navigation across 5 core views: Explore (Product showcase), Wallet (Aros ledger & minor safety badge), AI Hub (Multi-provider inference console), Dev Keys (API key vault & telemetry), and Privacy (DPDP Act 2023 statutory rights & consent).
  - Expo / React Native configuration (`app.json`, `package.json`, `tsconfig.json`).
- **Universal Storage Engine (`@aroh/asdk/src/storage/index.ts`)**:
  - Defined `IPlatformStorage` interface supporting Web `window.localStorage`, Node/SSR/Vitest in-memory storage, and React Native / Expo asynchronous secure drivers (`MobileStorageAdapter`).
  - Swapped hardcoded `window.localStorage` in `usePlatformStore` with universal storage engine.
- **Deterministic Deep Link Engine (`@aroh/asdk/src/mobile/index.ts`)**:
  - Implemented `parseArohDeepLink` handling `aroh://` scheme routes (`aroh://wallet`, `aroh://receipt/:id`, `aroh://explore/:spokeId`, `aroh://privacy`).
  - Implemented mobile device biometric and security attestation state machine (`evaluateDeviceSecurity`).
- **Automated QA & Proximity Tests**:
  - `storage.test.ts` (4 assertions PASS) & `mobile.test.ts` (9 assertions PASS).
  - Full `@aroh/asdk` suite passing: 143 / 143 tests across 14 test files.
  - Next.js production build compiling 44 routes + middleware proxy with zero errors.

### 2.03.08.0 (`v2.3.8`)
- **Date**: 2026-09-20
- **Change Level**: `FUNCTIONAL` (`DE=08`)
- **Previous Version**: `2.03.07.0` (`v2.3.7`)

#### Quick Summary
Delivered **Universal Modular Architecture & Change-Isolation Governance System**:
- **Authoritative Architecture Specification (`ARCHITECTURE.md`)**:
  - Implemented comprehensive 76-rule system of boundaries, domain/feature ownership, locality, and change isolation at repository root.
  - Formulated strict 5-tier change radius protocol (`DIRECT`, `RELATED`, `DEPENDENT`, `SHARED`, `UNRELATED`) preventing scope creep and unrequested refactors.
- **Architectural Ownership Map**:
  - Codified explicit ownership across all 9 platform domains: Identity/Auth, Financial Economy/Aros Ledger, Developer Platform/Keys, AI Orchestration, Product Showcase/Registry, Observability/Telemetry/Tracing, Statutory Privacy/DPDP, Design System (`@aroh/ads`), and Autonomous Product Spokes (`Products/`).
- **Single Sources of Truth & Traceability**:
  - Defined explicit source-of-truth registries for versioning, product catalog, financial transactions, privacy policies, and discoverability.
  - Formulated full execution trace from user action through Page, Section, Feature, Component, Action Handler, Service, Gateway, Ledger, Receipt, Audit Event, and UI confirmation.
- **Automated Verification**:
  - Full `@aroh/asdk` suite passing (130 assertions).
  - All 13 monorepo test suites passing (506+ assertions).
  - Next.js 16 production build compiles 44 / 44 routes cleanly.

### 2.03.07.0 (`v2.3.7`)
- **Date**: 2026-09-20
- **Change Level**: `FUNCTIONAL` (`DE=07`)
- **Previous Version**: `2.03.06.0` (`v2.3.6`)

#### Quick Summary
Delivered **Ecosystem Polish, Cryptographic Transaction Receipts, Grievance/Dispute Redressal & Interactive Developer API Explorer**:
- **Cryptographic Transaction Receipts (`/api/payment/receipt/[receiptId]`, Receipt Modal)**:
  - Generated immutable cryptographic receipts for settled transactions with SHA-256 integrity hashes.
  - Provided interactive receipt inspection modal in `/dashboard/purchase` with JSON export and policy terms disclosure.
- **Formal Dispute / Grievance Redressal (`/api/payment/dispute`, Dispute Modal)**:
  - Implemented user dispute submission endpoint with automatic tracking reference generation and compliance audit logging.
  - Interactive dispute dialog in `/dashboard/purchase` enabling users to dispute unsettled charges directly from purchase history.
- **Interactive Developer API Explorer (`/dashboard/keys`)**:
  - Added interactive request runner to Developer Tools dashboard with endpoint selector, header customization, live cURL command builder, and latency/status response viewer.
- **Automated Verification**:
  - 2/2 Vitest tests in `packages/asdk/tests/dispute-receipt.test.ts`.
  - 130/130 Vitest assertions across 12 suites in `@aroh/asdk`.
  - All 13 monorepo test suites passing (506+ total assertions).
  - Next.js 16 production build compiles 44 / 44 routes cleanly.

### 2.03.06.0 (`v2.3.6`)
- **Date**: 2026-09-20
- **Change Level**: `FUNCTIONAL` (`DE=06`)
- **Previous Version**: `2.03.05.0` (`v2.3.5`)

#### Quick Summary
Delivered **Aros Age, Dedicated Consent, Purchase, Payment & Transaction-Safety Compliance Hardening** under mandatory invariant `NO_MINOR_PAYMENT_FOR_AROS = TRUE`:
- **Server-Side Minor Payment Blocking**:
  - Enforced server-side `assertPurchaseEligible` check returning `MINOR_PAYMENT_BLOCKED` before any payment intent, checkout session, or order is generated.
  - Separate account creation from purchase eligibility; no minor purchasing via parent instrument through minor's account.
- **Dedicated Unbundled Affirmative Purchase Consent**:
  - Unbundled consent requirement (`PURCHASE_TERMS_CONFIRMATION`, `VIRTUAL_CURRENCY_DISCLOSURE`) with 0 pre-ticked checkboxes.
  - Full transparency on non-monetary, non-refundable, non-transferable closed-loop Aros utility.
- **Provider-Agnostic Payment Abstraction**:
  - Defined `PaymentProvider` interface with sandbox `MockPaymentProvider` eliminating vendor lock-in.
  - Zero raw credit card or banking secrets persisted or logged.
- **Authoritative Append-Only Ledger & Replay Defense**:
  - Integrated `purchaseSafetyService` with `paymentSettlementService` and `mockWalletService`.
  - Enforced double-spending protection via composite idempotency key checks (`providerTransactionId`, `purchaseIntentId`).
- **Statutory Registers & Policy Documentation**:
  - Created `Aroh/docs/privacy/PAYMENT_DATA_PROCESSING_REGISTER.json`.
  - Hardened Section 2.1 in `CHILD_AND_MINOR_PRIVACY_POLICY.md` and Section 5 in `TERMS_OF_SERVICE.md`.
  - Registered items LR-009 to LR-013 in `LEGAL_REVIEW_REGISTER.json`.
- **Automated Verification**:
  - 15/15 automated Vitest assertions in `packages/asdk/tests/purchase-safety.test.ts`.
  - All 11 `@aroh/asdk` suites passing (128 assertions).
  - DPDP static privacy audit: 117/117 passing.
  - Next.js 16 production build compiles 41 / 41 routes cleanly.

### 2.03.05.0 (`v2.3.5`)
- **Date**: 2026-09-19
- **Change Level**: `FUNCTIONAL` (`DE=05`)
- **Previous Version**: `2.03.04.0` (`v2.3.4`)

#### Quick Summary
Delivered Phase 3.5 Milestone 3.5 (`WAVE-02-TASK-05: Real-Time Operational Telemetry Broker & Product Registry Modernization`):
- **Real-Time Operational Telemetry Broker (`packages/asdk/src/telemetry/index.ts`)**:
  - In-process circular event ring buffer (500 events), 9 canonical event types (`route.hit`, `api_key.used`, `webhook.dispatched`, `payment.settled`, etc.).
  - Aggregate metrics computation: p50/p95 latency, active/completed user journeys, webhook success/failure rates.
  - SSE frame serialization and heartbeat generation every 5 seconds.
- **Server API Route & Admin Dashboard Panel (`apps/web`)**:
  - `GET /api/telemetry/stream`: Admin/operator-gated Server-Sent Events stream route.
  - `/admin`: Interactive live telemetry dashboard with 8 metric cards and live event stream.
- **Canonical Product Registry Synchronization (`packages/asdk/src/registry/products.ts`)**:
  - Modernized registry statuses; verified live URLs for JavaPath Pro, OmniStream, and Music Mirror.
- **Automated Verification**:
  - 14 Vitest assertions in `packages/asdk/tests/telemetry.test.ts` (100% pass).
  - 7 Vitest assertions in `packages/asdk/tests/product-registry.test.ts` (100% pass).
  - Next.js 16 production build compiles 39 / 39 routes cleanly.

### 2.03.04.0 (`v2.3.4`)
- **Date**: 2026-09-19
- **Change Level**: `FUNCTIONAL` (`DE=04`)
- **Previous Version**: `2.03.03.0` (`v2.3.3`)

#### Quick Summary
Delivered Phase 3.5 Milestone 3.4 (`WAVE-02-TASK-04: W3C Distributed Tracing`):
- **W3C Distributed Tracing Utilities (`packages/asdk/src/tracing/index.ts`)**:
  - Implemented `generateTraceId()`, `generateSpanId()`, `isValidTraceparent()`, `parseTraceparent()`, `formatTraceparent()`, `extractOrCreateTraceContext()`.
  - Built strictly on Web Crypto API (`crypto.getRandomValues`) for universal runtime compatibility (Edge, Node.js, Browser).
  - Enforced W3C specification: version `00`, 32-hex trace ID (non-zero), 16-hex span ID (non-zero), 2-hex flags.
- **Next.js Edge Proxy Middleware (`apps/web/middleware.ts`)**:
  - Intercepts all incoming HTTP requests to `/api/*` and downstream pages.
  - Validates inbound `traceparent` headers or generates new trace contexts upon ingress.
  - Propagates `traceparent` and `x-trace-id` down to request headers and reflects them into outgoing HTTP response headers.
- **Automated Verification**:
  - 11 Vitest assertions in `packages/asdk/tests/tracing.test.ts` (100% pass).
  - Next.js production build: 38/38 routes + Proxy Middleware compiled cleanly with 0 Edge runtime warnings.

### 2.03.03.0 (`v2.3.3`)
- **Date**: 2026-09-19
- **Change Level**: `FUNCTIONAL` (`DE=03`)
- **Previous Version**: `2.03.02.0` (`v2.3.2`)

#### Quick Summary
Delivered Phase 3.0 Milestone 3.3 (`WAVE-02-TASK-03: Fiat-to-Aros Settlement On-Ramp`):
- **Zod Schemas & Pricing Catalog (`packages/asdk/src/schemas/payment.ts`)**:
  - Codified canonical tier packages: `pkg_500` (500 Aros / $5.00), `pkg_1500` (1500 Aros / $15.00), `pkg_5000` (5000 Aros / $50.00).
  - Fixed conversion math: **$1.00 USD = 100 Aros** (1 cent = 1 Aros).
  - Defined `CreateCheckoutSessionRequestSchema` and `CheckoutSessionRecordSchema`.
- **Settlement Service & ADR-004 Financial Authority (`packages/asdk/src/services/payment.ts`)**:
  - Implemented `PaymentSettlementService` with strict charge ID & session ID idempotency deduplication.
  - Exclusively executes immutable wallet ledger credits via `mockWalletService.creditWallet` (0 direct balance overwrites).
  - Integrated hermetic mock sandbox fallback for zero-network CI test reliability.
- **Server API Routes & Dashboard Route (`apps/web`)**:
  - `POST /api/payment/checkout`: Creates checkout session with custom redirects.
  - `POST /api/payment/webhook`: Ingests and clears Stripe settlement events (`checkout.session.completed`).
  - `GET /dashboard/purchase`: Dedicated purchase route with live Aros balance, package selector cards, instant settlement sandbox, and transaction feedback.
- **Automated Verification**:
  - 9 automated Vitest assertions in `packages/asdk/tests/payment.test.ts` (100% pass).
  - All 12 monorepo test suites passing (464+ assertions).
  - Next.js 16 production build compiles 38 / 38 routes cleanly with Turbopack.

### 2.03.02.0 (`v2.3.2`)
- **Date**: 2026-09-19
- **Change Level**: `FUNCTIONAL` (`DE=02`)
- **Previous Version**: `2.03.01.1` (`v2.3.1`)

#### Quick Summary
Delivered Phase 3.0 Milestone 3.2 (`WAVE-02-TASK-02: Asynchronous Webhook Clearance Engine`):
- **Zod Schemas (`packages/asdk/src/schemas/webhook.ts`)**:
  - Enforced 4 canonical event types: `aros.credited`, `aros.debited`, `membership.upgraded`, `challenge.completed`.
  - Defined strict registration, endpoint record, event payload, and delivery attempt schemas.
- **Webhook Clearance Service (`packages/asdk/src/services/webhook.ts`)**:
  - Secure signing secret generation (`whsec_` prefix) with SHA-256 hash-only storage (zero plaintext).
  - Cryptographic HMAC-SHA256 signature signing and constant-time verification (`x-aroh-signature: t={ts},v1={sig}`) with 300-second replay attack protection window.
  - Dispatcher with exponential backoff retry: $2^n \times 500\text{ms}$ over 3 attempts, failure logging, and automatic transition to `failing` status after 3 consecutive failures.
- **Server API Routes (`apps/web/app/api/developer/webhooks/`)**:
  - `GET /api/developer/webhooks`: Lists registered endpoints for authenticated user.
  - `POST /api/developer/webhooks`: Zod-validated endpoint creation returning one-time secret.
  - `GET /api/developer/webhooks/[webhookId]`: Retrieves endpoint details and delivery logs.
  - `DELETE /api/developer/webhooks/[webhookId]`: Deletes endpoint.
- **Automated Verification**:
  - 16 new automated Vitest unit tests in `packages/asdk/tests/webhook.test.ts` (100% pass).
  - All 12 monorepo test suites passing (455+ assertions).
  - Next.js 16 production build compiles 35 / 35 routes cleanly.

### 2.03.01.1 (`v2.3.1`)
- **Date**: 2026-09-19
- **Change Level**: `PATCH` (`F=1`)
- **Previous Version**: `2.03.01.0` (`v2.3.0`)

#### Quick Summary
Implemented **Dynamic Version Governance & Unobtrusive UI Display** under the Universal Version Controller mandate:
- **ASDK Version Governance Exports (`packages/asdk/src/version/index.ts`)**:
  - Exported authoritative `PLATFORM_VERSION = "2.03.01.1"`, status `VERIFIED`, release name, and commit hash.
  - Implemented `isValidVersionFormat` and `parseVersion` enforcing strict `A.BC.DE.F` tier structure.
  - Added 6 automated Vitest assertions verifying version format compliance and tier parsing.
- **Dynamic Next.js API Route (`apps/web/app/api/platform/version/route.ts`)**:
  - Exposes `/api/platform/version` with caching headers (`public, s-maxage=3600`) and metadata linking to Version Controller.
  - Updated `/api/health` to dynamically return authoritative platform version.
- **Unobtrusive Floating Version Badge (`apps/web/app/components/version-badge.tsx`)**:
  - Floating pill mounted at bottom-right corner (`fixed bottom-4 right-4 z-40`), styled cleanly with `@aroh/ads` frosted glass aesthetic.
  - Interactive popup displaying version status, release milestone, tier breakdown, build date, commit baseline, copy-to-clipboard action, and link to governance documentation.
  - Accessible with ARIA attributes and keyboard Escape dismissal.
- **Footer De-hardcoding (`apps/web/app/components/footer.tsx`)**:
  - Replaced legacy hardcoded string `"v2.1.0-dpdp"` with dynamic `v${PLATFORM_VERSION}`.
- **Historical Reconstruction in `VERSION_CONTROLLER.md`**:
  - Formally appended pre-v2 foundation phases (`1.00.00.0` Phase 0, `1.05.00.0` Phase 1 MVP) into authoritative root ledger.

### 2.03.01.0 (`v2.3.0`)
- **Date**: 2026-09-19
- **Change Level**: `FUNCTIONAL` (`DE=01`)
- **Previous Version**: `2.02.00.0` (`v2.2.0`)

#### Quick Summary
Initiated Wave 2 (`Phase 3.0: Developer Portal & External Service Federation`) by delivering Milestone 3.1 (`WAVE-02-TASK-01: Developer API Key Vault`):
- **Cryptographic Key Generation & Hashing (`packages/asdk/src/services/api-key.ts`)**:
  - Implemented HMAC-SHA256 generation using Node.js `crypto`.
  - Keys use distinct prefixes `aroh_live_` (production) and `aroh_test_` (sandbox).
  - Storage is strictly zero-plaintext: only SHA-256 hex hashes are persisted in database/mock store.
  - Raw key is emitted strictly once upon creation; all subsequent reads return masked format (`aroh_live_4a2c••••••••b8e1`).
- **Tier-Gated Rate Limiting**:
  - Basic: 60 rpm
  - Developer Pro: 300 rpm
  - Enterprise: 1200 rpm
- **Server API Routes (`apps/web/app/api/developer/keys/`)**:
  - `GET /api/developer/keys`: Scoped listing of active and revoked keys (masked only).
  - `POST /api/developer/keys`: Zod-validated creation returning one-time raw token.
  - `GET /api/developer/keys/[keyId]`: Individual key inspection.
  - `DELETE /api/developer/keys/[keyId]`: Irreversible key revocation (sets status to `revoked` with timestamp).
- **Dashboard Management UI (`apps/web/app/dashboard/keys/page.tsx`)**:
  - Dedicated route styled to `@aroh/ads` light aesthetic (`#F7F5F0`).
  - Key creation form with name, environment, and tier selectors.
  - Dismissible one-time raw key banner with copy-to-clipboard action.
  - Keys table displaying status indicators, rate limit rpm, and revocation actions.
- **Automated Verification**:
  - 10 new automated Vitest assertions in `packages/asdk/tests/api-key.test.ts` (100% pass).
  - All 11 monorepo test suites pass cleanly.
  - Next.js 16 production build compiles all 33 routes with 0 errors.

### v2.2.0
- **Date**: 2026-09-11
- **Type**: `MINOR` (SEO, AI Discoverability, Structured Data, Production Foundation & Execution History Protocol)
- **Previous Version**: `v2.1.0`

#### Quick Summary
Implemented P2 SEO & AI Discoverability and P1 Production Foundation while establishing a permanent, mandatory version-control and execution-history protocol for the AROH platform:
- **Mandatory Execution History Protocol (`docs/EXECUTION_HISTORY.md`)**:
  - Codified permanent, append-only execution ledger with strict Pre-Execution (Git inspection, history audit, risk assessment) and Post-Execution (test pass, build verification, diff audit) phases.
  - Sourced and archived historical milestones from initial monorepo recovery through DPDP compliance.
- **AI Discoverability Suite (`apps/web/public/llms.txt`, `llms-full.txt`, `app/llms.txt/route.ts`)**:
  - Published concise `/llms.txt` and comprehensive `/llms-full.txt` defining platform architecture, registered products, public routing, and authoritative repository/Vercel links without fabrication.
  - Implemented Next.js route handler ensuring RFC-compliant `text/plain; charset=utf-8` responses.
- **Structured Data / JSON-LD (`apps/web/app/components/structured-data.tsx`)**:
  - Injected Schema.org `Organization`, `WebSite` (with search action), and `SoftwareApplication` ItemList referencing all 8 canonical products from `@aroh/asdk`.
- **Root & Page Metadata Hardening (`apps/web/app/layout.tsx` & Route Layouts)**:
  - Added `metadataBase: new URL("https://aroh-os.vercel.app")`, title templates, keywords, OpenGraph images, Twitter summary cards, and canonical alternates.
  - Implemented modular layout wrappers for client pages: `/explore`, `/products`, `/ai`, `/cookies`, `/privacy/rights`, `/privacy/consent`, `/privacy/grievance`, and dynamic metadata for `/explore/[productId]`.
- **Sitemap & Robots Synchronization (`apps/web/app/sitemap.ts`, `public/robots.txt`)**:
  - Expanded sitemap to dynamically index all 25 canonical public routes with correct priority and change frequencies.
  - Configured `robots.txt` with explicit AI crawler allowances (`GPTBot`, `ClaudeBot`, `Google-Extended`, `PerplexityBot`, `Applebot-Extended`) and canonical sitemap reference.
- **Production Foundation Fallback States (`apps/web/app/not-found.tsx`, `error.tsx`)**:
  - Designed custom accessible 404 page and client error boundary styled to `@aroh/ads` light aesthetic.
- **Automated Verification**:
  - Added `Aroh/scripts/test-seo-audit.js` (56 automated assertions).
  - Monorepo test suite expanded to **423 passing assertions across 10 test suites** with 0 failures.
  - Next.js 16 production build compiles cleanly across all 31 routes in 27.4s.

### v2.1.0
- **Date**: 2026-09-11
- **Type**: `MINOR` (Privacy, Consent, Legal Terms, Cookies & DPDP Compliance Implementation)
- **Previous Version**: `v2.0.5`
| **v2.0.5** | 2026-09-10 | `PATCH` | **Wave 1 Execution & Baseline Harmonization**: Audited all 5 project manifests for decoupled target path policy compliance (Task 3), aligned OmniStream submodule pointer to upstream HEAD `e3e7643` (Task 4), and finalized canonical Wave 1 execution plan. | `v2.0.5` | [`ee50af8`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v2.0.4** | 2026-09-10 | `MINOR` | **Spoke Adapter Interface Contract Specification**: Defined canonical adapter contract in `@aroh/asdk/adapters`, 7-level provenance verification taxonomy, fail-closed `Products/` boundary protection, and expanded test suite to 239 assertions. | `v2.0.4` | [`2f740f7`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v2.0.3** | 2026-09-10 | `PATCH` | **Working Tree Harmonization & Submodule Pointer Alignment**: Aligned parent git index pointer for `Products/OmniStream` to verified HEAD commit `8eb4ef0`, establishing a 100% clean baseline without mutating any files inside `Products/`. | `v2.0.3` | [`8ce4df0`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v2.0.2** | 2026-09-10 | `PATCH` | **Canonical Product Showcase & Zero-Fabrication Registry**: Implemented `CANONICAL_PRODUCT_REGISTRY` in ASDK, strict Zod schema validation, authoritative URL & capability verification across all 8 products, responsive Explore and Product Detail workspaces, and expanded automated verification to 227 passing assertions across 8 test suites. | `v2.0.2` | [`2f43b62`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v2.0.1** | 2026-09-10 | `MINOR` | **Safe Product-Change Synchronization CLI & Master Governance**: Implemented three-way semantic reconciliation engine ($B \oplus P \oplus A$), deterministic CLI exit codes (0–7), dry-run zero-mutation guarantees, absolute `Products/` boundary isolation, in-memory Firebase Auth fallback, and codified `D1`, `D2`, `D3` machine-operating specifications. | `v2.0.1` | [`5a8d7ee`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v2.0.0** | 2026-08-31 | `MAJOR` | **Master Monorepo Restructuring & Ecosystem Realignment**: Decoupled monolithic codebase into `Aroh/` (central platform hub) and `Products/` (independent product codebases). Integrated OmniStream (v1.8.5) and SpeDex (v2.1.0). Introduced semantic project manifests (`manifests/*.manifest.json`, v1.0.0 schema) and comprehensive QA test runners. | `v2.0.0` | [`0d64b13`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v1.5.0** | 2026-07-20 | `MINOR` | **Phase 1 MVP Platform Hub & Aros Economy**: Launched Next.js 16 web portal, Aros Wallet ledger math, CMS Announcement alerts CRUD, developer AI portal with prompt templates, and cross-tab SSO session synchronization. | `v1.5.0` | [`bf9cee8^`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v1.0.0** | 2026-07-01 | `MAJOR` | **Phase 0 Foundation Workspace**: Initial monorepo configuration with npm workspaces, `@aroh/ads` design token foundations, `@aroh/asdk` core schemas, and Firestore security rules. | `v1.0.0` | [`66e3867^`](file:///d:/PROJECT/AROH%20Open%20Source) |

---

## 2. Version Entries

### v2.1.0
- **Date**: 2026-09-11
- **Type**: `MINOR` (Privacy, Consent, Legal Terms, Cookies & DPDP Compliance Implementation)
- **Previous Version**: `v2.0.5`

#### Quick Summary
Implemented a comprehensive, system-level privacy and legal compliance framework aligned with the **Digital Personal Data Protection Act, 2023 (DPDP Act)** and **Digital Personal Data Protection Rules, 2025** ahead of mandatory phased commencement dates.
- **Legal Document Suite (20 Documents under `Aroh/docs/legal/` & `Aroh/docs/privacy/`)**:
  - Authored Terms of Service, Acceptable Use Policy, Intellectual Property Policy, Community Content Policy, and Legal Document Version History.
  - Authored standalone Privacy Notice (Section 5 itemized), Consent Policy (Section 6 standards), Cookie Policy, Cookie Preference Policy, Data Principal Rights Policy, Grievance Redressal Policy, Data Retention & Deletion Policy, Security & Incident Response Policy (9-stage workflow), AI Privacy Notice (stateless zero-training guarantee), Third-Party Processors Disclosure, Data Transfer Disclosure (Section 16 cross-border), Child & Minor Privacy Policy (18+ assurance), Account Deletion Policy, Data Export Policy, and Law Enforcement Policy.
- **Machine-Readable Privacy Registers**:
  - `DATA_PROCESSING_REGISTER.json` (7 data categories documenting 24 governance dimensions).
  - `COOKIE_INVENTORY.json` (5 itemized cookies with classification and pre-consent behavior).
  - `DATA_PROCESSORS.json` (Verified infrastructure partners Google Cloud, Vercel, and AI providers).
  - `LEGAL_REVIEW_REGISTER.json` & `.md` (8 high-priority legal review items tracked under `LEGAL_REVIEW_REQUIRED`).
- **ASDK Technical Privacy Engine (`packages/asdk/src/privacy/`)**:
  - `consent.ts`: `ConsentStateSchema` (`unknown`, `accepted`, `rejected`, `partial`, `withdrawn`), `CookieCategorySchema`, `isCategoryAllowed()`, `ConsentRecordSchema`, cookie serialization/parsing.
  - `rights.ts`: `DataPrincipalRightTypeSchema`, `DataPrincipalRequestSchema`, `GrievanceTicketSchema` (statutory 90-day cap), `calculateStatutoryDeadline()`.
  - `account-lifecycle.ts`: `AROH_DELETION_CASCADE_SCHEDULE`, `DataExportBundleSchema`.
- **Web UI & Components (`apps/web/`)**:
  - `CookieBanner.tsx`: Accessible banner with Accept All, Reject Optional, and Granular Preference Drawer.
  - `PlatformFooter.tsx`: Universal footer with links to all legal, privacy, cookie, rights, and grievance portals.
  - 10 Public Routes: `/privacy`, `/terms`, `/cookies`, `/acceptable-use`, `/privacy/consent`, `/privacy/rights`, `/privacy/grievance`, `/privacy/security`, `/privacy/retention`, `/privacy/ai`.
  - 5 API Routes: `/api/privacy/consent`, `/api/privacy/rights`, `/api/privacy/grievance`, `/api/privacy/export`, `/api/privacy/delete-account`.
- **Automated Verification & Zero-Mutation Boundary**:
  - Expanded test suite from 239 to **367 passing assertions** across 9 test suites.
  - Next.js production build passing cleanly across all 30 routes.
  - `Products/` directory 100% untouched and verified clean.

### v2.0.5
- **Date**: 2026-09-10
- **Type**: `PATCH` (Wave 1 Execution & Working Tree Baseline Harmonization)
- **Previous Version**: `v2.0.4`

#### Quick Summary
Completed Wave 1 execution plan tasks 3 and 4: audited all 5 project manifests for strict decoupled target path governance and harmonized monorepo root gitlink for `Products/OmniStream` to upstream HEAD commit `e3e7643`.
- **Manifest Decoupled Target Policy Audit (WAVE-01-TASK-03)**:
  - Audited `manifests/*.manifest.json` across all 5 projects.
  - Formally codified policy preserving existing target paths until Phase 3.0 concrete adapter capsules are built.
  - Enhanced `scripts/verify-sync-manifests.js` with automated target path policy assertions.
- **Submodule Pointer Harmonization (WAVE-01-TASK-04)**:
  - Aligned parent index pointer for `Products/OmniStream` to upstream HEAD commit `e3e7643`.
  - Maintained absolute `Products/` boundary inviolability: 0 files modified inside `Products/`.
- **Wave 1 Finalization**:
  - All 4 approved Wave 1 tasks completed, validated, and audited.

### v2.0.4
- **Date**: 2026-09-10
- **Type**: `MINOR` (Spoke Adapter Interface Contract Specification)
- **Previous Version**: `v2.0.3`

#### Quick Summary
Defined and implemented the canonical Spoke Adapter Interface Contract in `@aroh/asdk/adapters`, formalizing the decoupled boundary between AROH and autonomous spoke applications without copying or mutating spoke internals.
- **Canonical Adapter Contract (`Aroh/packages/asdk/src/adapters/contract.ts`)**:
  - Implemented `SpokeAdapterContractSchema`, `OwnershipBoundarySchema`, `InspectionBoundarySchema`, and `SpokePermissionsBoundarySchema`.
  - Enforced seven-level provenance verification taxonomy (`VERIFIED`, `IMPLEMENTED-REPORTED`, `DOCUMENTED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, `SUPERSEDED`).
  - Added fail-closed validation guaranteeing `targetConsumerPath` can never resolve inside `Products/`.
  - Implemented health telemetry and degraded fallback state helper (`createDegradedSpokeState`).
- **Architectural Specification (`Aroh/docs/architecture/ADAPTER_CONTRACT_SPECIFICATION.md`)**:
  - Authored canonical specification defining ownership, inspection, launch URLs, permissions, and health probes.
- **Automated Verification Harness (`Aroh/packages/asdk/tests/adapter-contract.test.ts`)**:
  - Added 12 new Vitest assertions validating contract schemas, boundary enforcement, and degraded states.
  - Monorepo test pass expanded to **239 passing assertions across 8 test suites**.

### v2.0.3
- **Date**: 2026-09-10
- **Type**: `PATCH` (Working Tree Harmonization & Submodule Pointer Alignment)
- **Previous Version**: `v2.0.2`

#### Quick Summary
Resolved the parent monorepo submodule pointer divergence for `Products/OmniStream` by pinning the root git index to verified HEAD commit `8eb4ef0`, achieving a 100% clean baseline while preserving strict read-only boundary inviolability for `Products/`.
- **Submodule Pointer Harmonization**:
  - Aligned parent index pointer from `3281510` to `8eb4ef0` (OmniStream verified local HEAD).
  - Preserved boundary protection: zero file writes or mutations within `Products/`.
  - Harmonized monorepo working tree across canonical remote `Aroh-Open-Source/AROH`.
- **Wave 1 Milestone**:
  - Fully closes Phase 2.5 Working Tree Stabilization and satisfies Wave 1 Task 1 requirements.

### v2.0.2
- **Date**: 2026-09-10
- **Type**: `PATCH` (Canonical Product Showcase & Zero-Fabrication Registry)
- **Previous Version**: `v2.0.1`

#### Quick Summary
Comprehensive resolution of product metadata drift, elimination of hallucinated URLs, and implementation of an authoritative, validated showcase registry in the platform SDK.
- **Canonical Product Showcase Registry (`Aroh/packages/asdk/src/registry/products.ts`)**:
  - Registered authoritative metadata for 8 products: OmniStream, Nebula, Music Mirror, SpeDex, JavaPath Pro, Aros Core Wallet, Aroh CMS Alerts, and Aros Metrics Engine.
  - Sourced descriptions, tech stacks, and capabilities directly from verified repositories and live deployments without fabrication.
  - Implemented client-side search, category filtering, and status filtering (`online`, `development`, `internal`).
- **Product Detail & Interactive Workspace (`Aroh/apps/web/app/explore/[productId]/`)**:
  - Modernized dynamic product detail pages featuring authoritative capability bento grids, verified external launch buttons, and live source-of-truth provenance cards.
  - Added interactive simulation workspaces for testing ecosystem communication hooks.
- **Expanded Automated QA Harness (`Aroh/scripts/test-product-registry.js`)**:
  - Implemented 115-assertion registry test verifying schema adherence, descriptive lengths, non-empty capabilities, authoritative URL formats, and metadata timestamps.
  - Full ecosystem test pass now stands at **227 passing assertions across 8 test suites**.

#### Module Version Hierarchy
- **AROH Core Platform (`AROH-CORE`)**: `v2.0.2`
- **AROH Platform SDK (`ASDK`)**: `v2.0.2`
  - *Canonical Product Registry (`ASDK-REGISTRY`)*: `v1.0.0`
  - *Three-Way Semantic Reconciler (`ASDK-SYNC`)*: `v1.0.0`
  - *Provider-Agnostic AI Orchestrator (`ASDK-AI`)*: `v1.1.0`
  - *Aros Immutable Ledger Service (`ASDK-LEDGER`)*: `v1.0.1`
- **AROH Design System (`ADS`)**: `v1.0.0`
- **External Spoke Ecosystem**:
  - *OmniStream (`OS`)*: `v1.8.5` (Independent Git submodule)
  - *SpeDex (`SPE`)*: `v2.1.0` (Independent Git submodule)
  - *Nebula (`NEB`)*: `v1.4.2` (Managed manifest)
  - *Music Mirror (`MUS`)*: `v1.2.0` (Managed manifest)
  - *JavaPath Pro (`JPP`)*: `v1.1.0` (Managed manifest)

---

### v2.0.1
- **Date**: 2026-09-10
- **Type**: `MINOR` (Safe Product-Change Synchronization CLI & Master Governance Specs)
- **Previous Version**: `v2.0.0`

#### Quick Summary
Implementation of the enterprise-grade three-way semantic reconciliation engine, deterministic CLI toolchain, in-memory auth fallback, and formalization of machine-operating governance contracts.
- **Safe Synchronization Engine (`Aroh/packages/asdk/src/sync/reconciler.ts`)**:
  - Implemented three-way diffing ($B \oplus P \oplus A$) comparing Baseline Hash, Product Current Hash, and Canonical Aroh Hash.
  - Strict classification into `shared_contract`, `product_owned`, `aroh_owned`, `protected_downstream`, `generated_derivative`, and `ambiguous`.
  - Built-in fail-closed protection against direct mutations inside `Products/`.
- **Synchronization CLI Tool (`Aroh/scripts/aroh-sync.js`)**:
  - Implemented `status`, `inspect`, `detect`, `diff`, `plan`, `dry-run`, `validate`, `conflicts`, and `apply` commands.
  - Deterministic exit codes: `0` (Success/Clean), `1` (Failed), `2` (Invalid Config), `3` (Conflict), `4` (Stale Baseline), `5` (Boundary Violation), `6` (Unknown Product), `7` (Invalid Plan).
  - Dry-run mode guarantees zero repository disk mutations.
- **In-Memory Firebase Fallback (`Aroh/packages/asdk/src/services/firebase.ts`)**:
  - Integrated zero-configuration mock authentication and storage fallback enabling offline development and hermetic CI testing.
- **Codified Master Governance (`Aroh/docs/governance/`)**:
  - Authored `D1_EXPERIENCE_AND_BEHAVIOR.md` (226 lines): 24-state interaction model, perceived performance, motion laws, and WCAG 2.2 accessibility.
  - Authored `D2_EXECUTION_AND_DATA_SYSTEM.md` (246 lines): Domain ownership, idempotency, event contracts, retry limits, and sync lifecycle.
  - Authored `D3_GOVERNANCE_AND_EVOLUTION.md` (209 lines): 5-state system tracking (Intended vs Documented vs Implemented vs Deployed vs Observed), phase gates, and blast radius control.

---

### v2.0.0
- **Date**: 2026-08-31
- **Type**: `MAJOR` (Master Monorepo Restructuring & Ecosystem Realignment)
- **Previous Version**: `v1.5.0`

#### Quick Summary
Architectural partition of the repository into a decoupled platform hub (`Aroh/`) and standalone product repositories (`Products/`), governed by machine-readable project manifests.
- **Repository Restructuring**:
  - Root `package.json` configured with npm workspaces.
  - Central platform moved to `Aroh/` containing `apps/web`, `packages/ads`, and `packages/asdk`.
  - External applications placed in `Products/OmniStream` and `Products/Spedex` with strict read-only boundary enforcement.
- **Semantic Project Manifests (`Aroh/manifests/`)**:
  - Standardized on `v1.0.0` manifest schema tracking upstream git hashes, branches, governance merge policies (`downstream_wins` / `deterministic_overwrite`), excluded paths, and protected paths.
- **Automated Verification Harness**:
  - Created initial test runners: `verify-sync-manifests.js`, `test-ai-abstraction.js`, `test-sdk.js`, `test-session-sync.js`, and `e2e-audit.js`.

---

## 3. Architectural Decision Records (ADRs)

### ADR-001: Platform-First Decoupled Hub-and-Spoke Architecture
- **Status**: `ACCEPTED`
- **Context**: Monolithic coupling between apps and platform prevented open-source releases; polyrepo copying resulted in severe code drift.
- **Decision**: Decouple the repository into an administrative Hub (`Aroh/`) and independent Spokes (`Products/`). Products never import platform code. Platform interacts with products only via declarations in `manifests/` and reconcilers.
- **Invariants**: `Products/` is an absolute protected boundary (read-only for all automated platform tools).

### ADR-002: Three-Way Semantic Reconciliation ($B \oplus P \oplus A$)
- **Status**: `ACCEPTED`
- **Context**: File-copying scripts silently overwrote downstream platform customizations whenever upstream products released updates.
- **Decision**: Implement three-way state reconciliation comparing Baseline ($B$), Upstream Product ($P$), and Downstream Canonical Aroh ($A$). Classify artifacts into explicit ownership classes (`protected_downstream`, `shared_contract`, `generated_derivative`).
- **Invariants**: Any concurrent modification ($P \neq B \land A \neq B \land P \neq A$) fails closed with Exit Code 3 (`UNRESOLVED_CONFLICT`).

### ADR-003: Provider-Agnostic AI Tier with Zod Contracts
- **Status**: `ACCEPTED`
- **Context**: Hardcoded OpenAI SDK calls broke when keys expired and prevented local model or alternative provider execution.
- **Decision**: Create `AIOrchestrator` in `@aroh/asdk` with abstract `AIProvider` interface, failover priority list, and Zod payload schema validation. Provide deterministic `MockAIProvider` for test suites.
- **Invariants**: Zero raw external API calls from frontend components.

### ADR-004: Server-Side Financial Authority for Aros Token Ledger
- **Status**: `ACCEPTED`
- **Context**: Client-side wallet balance updates are vulnerable to tampering and client replay attacks.
- **Decision**: Define wallet balance strictly as $\sum \text{LedgerTransactions}$. Direct balance overwrites are prohibited by Firestore security rules and backend API routes.
- **Invariants**: Balances are calculated dynamically from immutable transaction records.

### ADR-005: Zero-Fabrication Showcase Registry
- **Status**: `ACCEPTED`
- **Context**: Hardcoded product cards contained unverified claims, broken links, and hallucinated features.
- **Decision**: Implement `CANONICAL_PRODUCT_REGISTRY` in `@aroh/asdk` with runtime Zod parsing and an automated 115-assertion test suite verifying every URL, description, and capability against authoritative sources.
- **Invariants**: Products without verified public deployments must be designated as `development` status with no fake live URLs.

---

## 4. Capability & Fallback Matrix

| Subsystem | Primary Capability | Degradation Tier 1 (Fallback) | Degradation Tier 2 (Offline) | Failure Mode Classification |
|---|---|---|---|---|
| **Identity & Auth** | Firebase Auth Cloud | LocalStorage cached user | In-memory mock admin | `AUTH_UNAVAILABLE` |
| **Aros Wallet** | Server-side Ledger Math | LocalStorage transaction sync | Read-only balance view | `LEDGER_UNAVAILABLE` |
| **AI Portal** | Gemini / OpenAI API | Anthropic Fallback | Mock Provider echo | `PROVIDER_EXHAUSTED` |
| **Showcase Registry** | Canonical SDK Registry | In-memory fallback objects | Static error card | `REGISTRY_CORRUPTED` |
| **Product Sync CLI** | 3-Way Reconciler | Dry-run plan inspection | Fail closed (Exit 1-7) | `CONFLICT_DETECTED` |

---

## 5. Developer Onboarding Checklist (12-Point Gate)

1. **Clone & Submodules**: Ensure `git submodule update --init --recursive` is executed.
2. **Node Version**: Verify Node.js $\ge$ 18.18.0 (Node 20+ LTS recommended).
3. **Hermetic Test Check**: Run `npm test` in `Aroh/` — expect **227 passing assertions** across 8 test suites.
4. **Production Build Check**: Run `npm run build` in `Aroh/` — expect 14 routes to compile cleanly with Turbopack.
5. **Boundary Inviolability**: Never modify files inside `Products/` during AROH platform tasks.
6. **No Client Balance Overwrite**: Never write directly to `wallet.balance`; use `creditWallet()` or `upgradeMembership()`.
7. **Hydration Protection**: Always guard browser-only APIs (`window`, `localStorage`) behind `isMounted` or `useEffect`.
8. **Zod Validation**: Always parse external or untrusted inputs with Zod schemas.
9. **Showcase Invariant**: Never invent URLs or product features; verify against authoritative sources.
10. **Sync Protocol**: Always run `npm run sync:detect` and `npm run sync:plan` before attempting any reconciliation.
11. **Exit Code Compliance**: Ensure automation scripts handle deterministic exit codes 0 through 7.
12. **Living Architecture**: Update this document and living ADRs upon making any architectural modifications.

---

## 6. The 17-Step Living Architecture Control Loop

Future human engineers and autonomous AI agents must execute development according to this continuous 17-step control loop:

1. **Load Living Architecture Intelligence** (`AROH_LIVING_ARCHITECTURE_INTELLIGENCE.md`)
2. **Load Version History & ADRs** (`VERSION_HISTORY.md`, ADR-001 through ADR-005)
3. **Inspect Actual Repository State** (`git status`, working tree clean, submodules)
4. **Compare Documented vs Implemented State**
5. **Detect Architecture/Code/Documentation Drift**
6. **Verify Protected Boundaries & Ownership** (`Products/` read-only)
7. **Verify Product Registry against Authoritative Sources** (Zero fabrication)
8. **Research Unresolved Architectural Questions** (Primary sources)
9. **Compare Alternatives / Experiment Where Necessary** (Non-destructive prototypes)
10. **Produce Change Architecture + Dependency Graph**
11. **Implement Smallest Correct Change**
12. **Run Hermetic Tests + Regression Suite** (227 passing assertions)
13. **Run Production Build** (Next.js 16 Turbopack, 14 routes)
14. **Browser/Integration Verification** (User journeys, visual parity)
15. **Update Living Architecture + Version History + ADRs**
16. **Re-Run Cognition / Drift Check**
17. **Declare Completion: Parity Reached Across All 5 States**

### The State Parity Law
> **No meaningful difference between what AROH intends, what AROH documents, what AROH implements, what AROH tests, and what AROH actually deploys—unless the difference is explicitly recorded as known state.**
