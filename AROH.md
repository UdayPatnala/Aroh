# AROH — PROJECT MASTER KNOWLEDGE & LIVING ARCHITECTURE SPECIFICATION

> **Authoritative System Record**: This document is the **single source of truth for project knowledge** across the **AROH Open Source Platform & Application Ecosystem**. It embodies the accumulated project intent, architecture, implementation reality, operational history, security guardrails, statutory compliance registers, and future roadmap.
> 
> **Current Platform Version**: `2.03.07.0`  
> **Authoritative Version Format**: `A.BC.DE.F` (Major: 2, Sub-version: 03, Functional: 07, Patch: 0)  
> **Status**: `VERIFIED`  
> **Latest Git Commit**: `d37e3e2` (Synchronized with `main`)  
> **Associated Version Control Ledger**: [`VERSION_CONTROLLER.md`](file:///d:/PROJECT/AROH%20Open%20Source/VERSION_CONTROLLER.md)

---

## 1. Project Identity

- **Project Name**: AROH (Aroh Open Source Platform)
- **Canonical Repository**: [https://github.com/Aroh-Open-Source/AROH](https://github.com/Aroh-Open-Source/AROH)
- **Canonical Branch**: `main` (`HEAD == origin/main`)
- **Mirror / Personal Remote**: [https://github.com/UdayPatnala/Aroh](https://github.com/UdayPatnala/Aroh) (`personal/main`)
- **Production Web Deployment**: [https://aroh-os.vercel.app](https://aroh-os.vercel.app)
- **Vercel Project Configuration**: Connected to `Aroh-Open-Source/AROH`, Production Branch `main`, Root Directory `Aroh/apps/web`.
- **Project Type**: AI-native digital ecosystem platform, monorepo, decentralized application runtime, and developer infrastructure hub.
- **Core Purpose**: Provide an orchestrated ecosystem layer that unifies independent digital products around a shared design system, an immutable virtual economy (**Aros Token Ledger**), a provider-agnostic artificial intelligence tier, cross-tab single sign-on (SSO) session synchronization, real-time observability telemetry, and W3C distributed tracing, while preserving the complete code, technology, and repository independence of individual products.

---

## 2. Motive

### 2.1 The Core Problem Statement
Modern software engineering across product suites suffers from three compounding structural points of friction:
1. **Redundant Boilerplate Duplication**: Independent consumer and enterprise applications (video streaming players, campus fintech wallets, space telemetry dashboards, interactive developer coding environments) repeatedly implement authentication, billing ledgers, design tokens, telemetry pipelines, and notification buses from scratch.
2. **The Coupling vs. Divergence Dilemma**:
   - In traditional monorepos, applications become tightly bound to the parent platform's framework code and build tooling, destroying standalone portability and preventing independent open-source distribution.
   - In polyrepos or naive multi-repo structures, code is copied or forked. Downstream copies rapidly drift out of sync, lose provenance, overwrite customizations, and break platform contracts.
3. **Client-Authoritative Financial Vulnerabilities**: Distributed and client-side applications frequently manage state, credits, and permissions directly on the client, creating severe vulnerabilities to transaction forgery, balance tampering, and state desynchronization.

### 2.2 The AROH Solution & Raison d'Être
AROH establishes a **Decoupled Hub-and-Spoke Ecosystem**:
- **The Central Platform Hub (`Aroh/apps/web`)**: Serves as the single administrative and financial authority (Aros Token Ledger), identity broker, developer portal, and public discovery registry.
- **Autonomous Product Spokes (`Products/` & Standalone Repositories)**: Independent flagships (OmniStream, SpeDex, Nebula, Music Mirror, JavaPath Pro) maintain 100% decoupling from platform code. They execute their own domain logic without compile-time coupling to `@aroh/asdk`.
- **Ecosystem Adapters & Contracts (`packages/asdk`, `packages/ads`, `manifests/`)**: Connect products to the ecosystem via event hooks, declarative schemas, and three-way semantic synchronization manifests ($B \oplus P \oplus A$).

---

## 3. Vision

- **Product Vision**: A calm, intentional, fast, intelligent, and premium digital ecosystem. AROH should feel like a coherent digital world rather than an unorganized directory of links.
- **Product Philosophy**: Clean editorial aesthetics, visible focus, zero visual noise, transparent privacy disclosures, zero dark patterns, and fail-closed safety for transactions and minor protection.
- **Technical Philosophy**: 
  - Explicit contracts over implicit conventions.
  - Strict runtime validation via Zod.
  - Append-only immutable ledgers for all financial and value movements.
  - Provider-agnostic abstractions for AI and payment gateways.
  - Zero fabrication: every link, status, and claim must be backed by verifiable code or live deployments.
  - Three Realities Reconciliation: Reconciling what was intended, what was built, and what should be done next.

---

## 4. Goals

### 4.1 Current Achieved & Verified Goals (Phase 0, Phase 1, Phase 2, Wave 2, and Purchase Safety)
- [x] Phase 0 Foundation: Monorepo workspace hierarchy, TypeScript strict typing, and hermetic build harnesses.
- [x] Phase 1 MVP Hub: Next.js 16 portal, dock navigation, Aros wallet, AI portal, CMS alerts, and session sync.
- [x] Phase 2 Ecosystem Decoupling: Autonomous `Products/` spokes, 3-way semantic reconciler (`aroh-sync.js`), and canonical product registry.
- [x] DPDP Compliance Suite: Full statutory compliance under the Indian Digital Personal Data Protection Act 2023 & DPDP Rules 2025 (20 policies, 5 machine-readable registers, 10 routes).
- [x] Wave 2 Developer Platform (Phase 3.0 & 3.5):
  - [x] Milestone 3.1: Developer API Key Vault (`/dashboard/keys`, HMAC-SHA256, hash-only storage, 3 rate tiers).
  - [x] Milestone 3.2: Asynchronous Webhook Clearance Engine (`/api/developer/webhooks`, HMAC-SHA256 `x-aroh-signature`, backoff retry).
  - [x] Milestone 3.3: Fiat-to-Aros Settlement On-Ramp (`/api/payment/checkout`, `/dashboard/purchase`, Stripe sandbox, immutable ledger).
  - [x] Milestone 3.4: W3C Distributed Tracing (`traceparent` header propagation, Web Crypto API, Next.js Edge Proxy Middleware).
  - [x] Milestone 3.5: Real-Time Operational Telemetry Broker (`/api/telemetry/stream` SSE stream, circular ring buffer, Admin panel).
- [x] Aros Purchase & Payment Safety Hardening (`2.03.06.0`):
  - [x] Mandatory minor payment restriction (`NO_MINOR_PAYMENT_FOR_AROS = TRUE`) enforced server-side.
  - [x] Unbundled affirmative consent with zero pre-ticked checkboxes.
  - [x] Pluggable payment provider abstraction (`PaymentProvider` with `MockPaymentProvider`).
  - [x] Append-only ledger double-spending defense via composite idempotency keys.
  - [x] Synchronized statutory registers (`PAYMENT_DATA_PROCESSING_REGISTER.json`, `LEGAL_REVIEW_REGISTER.json` LR-009 to LR-013).

### 4.2 Long-Term Goals
- [ ] Phase 4 Mobile Client (`2.04.00.0`): Cross-platform React Native / Expo shell integrated with `@aroh/asdk`.
- [ ] Phase 5 Federated Multi-Tenant Enterprise: Cross-organization team wallets, SAML/SCIM SSO, and federated product permissions.

---

## 5. Scope

### 5.1 In Scope
- Central Platform Hub application (`Aroh/apps/web`) written in Next.js 16 App Router.
- Core Platform SDK (`Aroh/packages/asdk`) providing auth, ledger, AI, sync, tracing, telemetry, and purchase safety.
- AROH Design System (`Aroh/packages/ads`) providing design tokens, CSS variables, and motion primitives.
- Managed Project Manifests (`Aroh/manifests/*.manifest.json`) orchestrating spoke synchronization.
- Statutory Privacy, Legal, and Compliance Registers (`Aroh/docs/privacy/`, `Aroh/docs/legal/`).
- Automated QA Test Suites (504+ assertions across 13 suites in Vitest and custom test runners).

### 5.2 Out of Scope & Inviolable Boundaries
- **Strict Inviolability of `Products/`**: Under no circumstances may platform tooling, synchronization CLIs, automated agents, or scripts mutate, refactor, format, clean, or delete files inside `Products/` (0 mutations allowed).
- **No Client-Side Direct Balance Overwriting**: Client UI components never directly mutate user balances or tokens.
- **No Raw Sensitive Credential Storage**: Raw credit card numbers, CVVs, banking PINs, or UPI secrets are never persisted or logged.
- **No Automatic Inferred Parental Authorization**: A minor account cannot be granted payment capability simply because an adult's card or UPI ID is presented.
- **No Premature Phase 3 / Phase 4 Deployments**: Documented future ideas remain in documentation until explicitly gated and authorized.

---

## 6. Target Users & User Scenarios

| User Category | Description | Primary Touchpoints & Scenarios |
|---|---|---|
| **End Users** | General public exploring applications and platform content. | Visiting landing page (`/`), exploring registered products (`/explore`), reading AI discoverability index (`/llms.txt`), reviewing privacy and cookie preferences (`/privacy`, `/cookies`). |
| **Product Users** | Users actively consuming individual spoke applications. | Launching OmniStream theater (`/explore/omnistream`), running Java AST simulations on JavaPath Pro, tracking spending on SpeDex. |
| **AROH Members** | Authenticated users participating in the platform ecosystem. | Managing user profile (`/dashboard`), tracking immutable Aros token balance and history, initiating fiat-to-Aros purchases (`/dashboard/purchase`) with age gating and unbundled consent, upgrading membership tiers. |
| **AI Users** | Developers and users utilizing the platform AI assistant. | Interacting with the AI developer portal (`/ai`), leveraging multi-provider failover chains (Mock, OpenAI, Anthropic, Gemini). |
| **Developers** | Third-party engineers building against AROH services. | Generating HMAC-SHA256 API keys (`/dashboard/keys`), configuring webhooks (`/api/developer/webhooks`), inspecting W3C distributed trace spans (`traceparent`). |
| **Administrators & Operators** | Privileged platform operators. | Monitoring live SSE telemetry streams (`/admin`), inspecting p50/p95 settlement latency, reviewing security events and DPDP grievance queues (`/privacy/grievance`). |

---

## 7. Features & Implementation Status Matrix

Every platform feature is classified under an explicit status: `IMPLEMENTED`, `PARTIALLY IMPLEMENTED`, `IN DEVELOPMENT`, `PLANNED`, `PROPOSED`, `DEPRECATED`, `REMOVED`, `BLOCKED`, or `UNKNOWN`.

| Feature | Status | Package / Module | Description |
|---|:---:|---|---|
| **Core Full-Stack Web Portal** | `IMPLEMENTED` | `apps/web` | Next.js 16 (Turbopack) web hub with 41 compiled static and dynamic routes. |
| **Aros Token Ledger** | `IMPLEMENTED` | `@aroh/asdk/services` | Double-entry balance calculation ($Balance = \sum Credits - \sum Debits$) with zero direct balance writes. |
| **Aros Age & Minor Payment Restriction** | `IMPLEMENTED` | `@aroh/asdk/services` | Strict server-side `NO_MINOR_PAYMENT_FOR_AROS = TRUE` policy blocking intent and checkout for under-18 accounts. |
| **Dedicated Unbundled Purchase Consent** | `IMPLEMENTED` | `apps/web` & `@aroh/asdk` | Affirmative consent collection (`/api/payment/consent`) with zero pre-ticked checkboxes and closed-loop utility disclosure. |
| **Provider-Agnostic Payment Abstraction** | `IMPLEMENTED` | `@aroh/asdk/services` | `PaymentProvider` interface with sandbox `MockPaymentProvider` and Stripe session clearance integration. |
| **Developer API Key Vault** | `IMPLEMENTED` | `apps/web` & `@aroh/asdk` | HMAC-SHA256 key generation, SHA-256 hash-only storage (zero plaintext), and 3 rate tiers (Basic 60, Pro 300, Enterprise 1200 rpm). |
| **Asynchronous Webhook Clearance Engine** | `IMPLEMENTED` | `apps/web` & `@aroh/asdk` | Webhook registration, HMAC-SHA256 signing (`x-aroh-signature`), 300s replay window, and exponential backoff retry dispatcher. |
| **W3C Distributed Tracing Engine** | `IMPLEMENTED` | `@aroh/asdk/tracing` | Web Crypto API-based `traceparent` engine (`00-{traceId}-{spanId}-{flags}`) and Next.js Edge Proxy Middleware propagation. |
| **Real-Time Operational Telemetry Broker** | `IMPLEMENTED` | `@aroh/asdk/telemetry` | In-process circular event ring buffer (500 events), p50/p95 latency metrics, SSE stream (`/api/telemetry/stream`), and Admin panel. |
| **Provider-Agnostic AI Orchestrator** | `IMPLEMENTED` | `@aroh/asdk/ai` | Unified AI provider abstraction with priority failover chain and Zod-validated request/response payloads. |
| **SSO Cross-Tab Session Synchronization** | `IMPLEMENTED` | `apps/web/components` | BroadcastChannel and window storage listener syncing auth events and logout across browser tabs without page reloads. |
| **Three-Way Semantic Synchronization CLI** | `IMPLEMENTED` | `Aroh/scripts/aroh-sync.js` | $B \oplus P \oplus A$ state reconciler with dry-run safety, deterministic exit codes (0–7), and fail-closed boundary checks. |
| **Spoke Adapter Contract System** | `IMPLEMENTED` | `@aroh/asdk/adapters` | Declarative Zod schemas and 7-level provenance taxonomy enforcing zero coupling with independent products. |
| **Canonical Product Registry** | `IMPLEMENTED` | `@aroh/asdk/registry` | Data-driven showcase registry with zero-fabrication validation across live deployments and source repositories. |
| **DPDP Act 2023 Privacy Engine** | `IMPLEMENTED` | `apps/web` & `docs/privacy` | 20 statutory policies, 5 machine-readable registers, cookie banner/preferences, and 5 API routes for rights and grievances. |
| **CMS Announcement Alerts** | `IMPLEMENTED` | `apps/web/app/cms` | Filterable alert broadcaster supporting draft, scheduled, and active announcements. |
| **Dynamic Version Indicator Badge** | `IMPLEMENTED` | `apps/web/components` | Floating unobtrusive bottom-right badge reading live version `2.03.06.0` from `@aroh/asdk` with interactive popover. |
| **Live Payment Gateway Keys (Production)** | `BLOCKED` | `apps/web/api/payment` | Blocked pending corporate entity incorporation and GST OIDAR legal review (tracked in `LEGAL_REVIEW_REGISTER.json`). |
| **Parent/Guardian Authorized Purchasing** | `PLANNED` | Architecture | Explicit parental purchaser architecture with separate adult identity, child recipient, and dedicated consent. |
| **Cross-Platform Mobile Shell** | `PLANNED` | Phase 4 (`2.04.00.0`) | React Native / Expo cross-platform mobile client consuming `@aroh/asdk`. |
| **Team / Organization Wallets** | `PROPOSED` | Phase 3 Vision | Shared multi-user enterprise wallets with granular spending permissions. |
| **Cross-Product Aros Marketplace** | `PROPOSED` | Phase 3 Vision | Decentralized marketplace allowing cross-product item purchases using Aros. |

---

## 8. Functional Workflows

```
                               AROH SYSTEM WORKFLOWS
                                          │
       ┌────────────────────────┬─────────┴──────────────┬────────────────────────┐
       ▼                        ▼                        ▼                        ▼
  1. AUTH & SSO           2. AROS PURCHASE         3. API KEYS & HOOKS      4. OBSERVABILITY
  [Cross-Tab Sync]        [Minor Block & Consent]  [HMAC & Dispatcher]      [Tracing & SSE]
```

### 8.1 User Authentication & Cross-Tab SSO Session Sync
1. User logs in or registers via Firebase Auth adapter in `apps/web`.
2. Auth state is recorded in local memory and synchronized to `localStorage`.
3. The `SessionSync` component listens for window `storage` events; logging out in one tab emits an `aroh_logout_event` timestamp.
4. All adjacent browser tabs intercept the event, immediately terminate active user sessions, reset local store state, and redirect to `/login` without requiring manual page refreshes.

### 8.2 Aros Purchase, Server Minor Blocking, Affirmative Consent & Settlement
1. **Initiation**: User selects an Aros package (`pkg_500`, `pkg_1500`, `pkg_5000`) on `/dashboard/purchase`.
2. **Server-Side Eligibility Check (`assertPurchaseEligible`)**:
   - The server verifies user age from profile metadata.
   - If user is under 18 or marked `MINOR_PAYMENT_BLOCKED`, the request is **immediately rejected fail-closed** (HTTP 403). No payment session, checkout URL, or gateway intent is ever generated.
3. **Dedicated Affirmative Consent**:
   - Eligible adult users are presented with two unbundled, non-pre-ticked checkboxes: `PURCHASE_TERMS_CONFIRMATION` and `VIRTUAL_CURRENCY_DISCLOSURE`.
   - Affirmative consent is dispatched to `/api/payment/consent` and permanently recorded in the consent ledger.
4. **Checkout Session Creation**:
   - `createCheckoutSession` invokes `purchaseSafetyService.initiateArosPurchase` to create an immutable `payment_intent_records` entry.
   - The `PaymentProvider` abstraction (or mock sandbox) generates a secure checkout redirect URL.
5. **Idempotent Webhook Settlement**:
   - The gateway fires a settlement webhook (`checkout.session.completed`) to `/api/payment/webhook`.
   - `paymentSettlementService.settlePayment` verifies the signature and validates idempotency against both `providerTransactionId` and `purchaseIntentId`.
   - Upon confirmation, it executes an atomic credit via `mockWalletService.creditWallet`, generating an immutable ledger entry. Aros balance is recomputed dynamically.

### 8.3 Developer API Key Lifecycle & Webhook Delivery
1. **Key Generation**: Developer requests an API key via `/dashboard/keys`.
2. The service generates a 32-byte cryptographic token with prefix `aroh_live_` or `aroh_test_`, computes its SHA-256 hash, and stores *only the hash* in the database. The raw token is displayed exactly once.
3. **API Authentication**: Incoming requests present `Authorization: Bearer aroh_live_...`. Middleware hashes the bearer token and checks tier-gated rate limits (Basic 60, Pro 300, Enterprise 1200 rpm).
4. **Webhook Clearance**: When a platform event occurs (`aros.credited`, `membership.upgraded`), the `WebhookClearanceService` signs the payload with HMAC-SHA256 (`x-aroh-signature: t={ts},v1={sig}`) and dispatches it with exponential backoff retry ($2^n \times 500\text{ms}$ over 3 attempts).

### 8.4 W3C Distributed Tracing & SSE Telemetry
1. Ingress requests to `/api/*` and page routes are intercepted by Next.js Edge Proxy Middleware (`middleware.ts`).
2. The middleware validates incoming `traceparent` headers (`00-{traceId}-{spanId}-{flags}`) or generates a new root trace context via Web Crypto API.
3. The `traceparent` and `x-trace-id` headers are injected into downstream request headers and reflected in HTTP response headers.
4. Telemetry events (`route.hit`, `payment.settled`) are appended to the in-memory circular ring buffer in `@aroh/asdk/telemetry`.
5. The `/api/telemetry/stream` route pushes real-time metric snapshots and heartbeats to the `/admin` dashboard panel via Server-Sent Events.

---

## 9. Technology Stack (Explicit What, Where, and Why)

| Technology | Version / Spec | Where Used | Why It Matters & Architectural Rationale |
|---|---|---|---|
| **Next.js** | `16.2.10` | `Aroh/apps/web` | Provides App Router, React Server Components (RSC), Turbopack compilation, Edge Proxy Middleware, and static page prerendering across 41 routes. |
| **React** | `19.0.0` | `apps/web`, `packages/ads` | Core component UI library; enables declarative layout rendering, concurrent transitions, and hooks. |
| **TypeScript** | `5.4+` | Full monorepo | Enforces strict static type safety across schemas, API contracts, services, and tests. |
| **Tailwind CSS** | `3.4.1` | `apps/web`, `packages/ads` | Utility-first CSS engine driving the AROH Design System (ADS) tokens, dark/light palette, and responsive layouts. |
| **Zod** | `3.23.8` | Full monorepo (`asdk`) | Strict runtime validation for API payloads, manifests, payment records, product registry entries, and spoke adapter contracts. |
| **Vitest** | `1.6.1` | `packages/asdk`, `packages/ads` | Lightning-fast, ESM-native unit and integration test runner executing 128+ assertions across 11 test suites. |
| **Web Crypto API** | Universal W3C | `@aroh/asdk/tracing` | Provides `crypto.getRandomValues` for generating cryptographically secure trace IDs and span IDs compatible with Edge runtimes without Node.js dependencies. |
| **Node.js Crypto** | LTS standard | `@aroh/asdk/services` | Powers HMAC-SHA256 signing, SHA-256 hashing, and `crypto.timingSafeEqual` constant-time verification for developer keys and webhooks. |
| **Firebase / Firestore** | Modular SDK | `@aroh/asdk/services` | Decentralized authentication and document storage abstraction with hermetic in-memory mock fallback for zero-network testing. |
| **Server-Sent Events (SSE)** | W3C EventSource | `apps/web`, `asdk` | Delivers standard-compliant, resilient server-push telemetry metrics to `/admin` without the overhead or statefulness of external WebSocket brokers. |
| **Lucide React** | `0.344+` | `apps/web` | Consistent, accessible iconography across navigation docks, status cards, and product badges. |

---

## 10. Architecture & Decoupled Topology

```
                                  AROH ECOSYSTEM TOPOLOGY
                                             │
             ┌───────────────────────────────┴───────────────────────────────┐
             ▼                                                               ▼
   CANONICAL PLATFORM HUB                                           INDEPENDENT SPOKES
      [Aroh/apps/web]                                                   [Products/]
   ├── / (Landing & Floating Dock)                                   ├── OmniStream (v1.8.5)
   ├── /dashboard (Aros Wallet & Profile)                            │   ├── U-Tube Discovery Engine
   ├── /dashboard/purchase (Aros Purchase)                           │   ├── CineMorph 3D WebGL Theater
   ├── /dashboard/keys (API Key Vault)                               │   └── OMS Edge Intelligence
   ├── /explore (Canonical Showcase)                                 └── Spedex (v2.1.0)
   ├── /explore/[productId] (Product Specs)                              ├── Spring Boot 3 Engine
   ├── /admin (Telemetry & Metrics)                                      ├── React Financial Dashboard
   ├── /ai (AI Developer Portal)                                         └── React Native Mobile Client
   ├── /cms (Announcement Feeds)                                     
   ├── /privacy & /terms (DPDP Compliance)                           EXTERNAL SPOKES (Remote)
   ├── /llms.txt (AI Discoverability)                                ├── Nebula (v1.0.0 WebGL)
   └── /api/* (Server Authority Routes)                              ├── Music Mirror (v1.2.0 DSP)
             │                                                       └── JavaPath Pro (v1.1.0 AST)
             └───────────────────────────────┬───────────────────────────────┘
                                             │
                                             ▼
                                  PLATFORM CONTRACTS & SDK
                       ┌───────────────────────────────────────────┐
                       │ packages/asdk                             │
                       │ ├── Purchase Safety & Minor Restriction   │
                       │ ├── Payment Provider Abstraction Layer    │
                       │ ├── Aros Ledger & Wallet Engine           │
                       │ ├── Developer API Key Vault Service       │
                       │ ├── Webhook Clearance Engine              │
                       │ ├── W3C Distributed Tracing Engine        │
                       │ ├── Real-Time Telemetry Broker            │
                       │ ├── Provider-Agnostic AI Orchestrator     │
                       │ ├── Canonical Product Showcase Registry   │
                       │ ├── Spoke Adapter Contract System         │
                       │ └── Three-Way Semantic Reconciler         │
                       ├───────────────────────────────────────────┤
                       │ packages/ads                              │
                       │ └── AROH Design System Tokens & Motion    │
                       ├───────────────────────────────────────────┤
                       │ manifests/*.manifest.json                 │
                       │ └── Semantic Project Manifests (v1.0.0)   │
                       └───────────────────────────────────────────┘
```

---

## 11. Repository & File Structure

```text
d:/PROJECT/AROH Open Source/
├── AROH.md                                # Authoritative Project Master Knowledge Record (This file)
├── VERSION_CONTROLLER.md                  # Authoritative Version Controller & Ledger (v2.03.06.0)
├── GEMINI.md                              # Mandatory Agent Rules & Change Governance Protocol
├── README.md                              # Public Repository Overview & Showcase Guide
├── package.json                           # Root Monorepo Workspace Configuration
├── Aroh/                                  # Central Platform Hub Subsystem
│   ├── package.json                       # AROH Platform Workspace Manifest
│   ├── apps/
│   │   └── web/                           # Next.js 16 Full-Stack Web Portal
│   │       ├── app/                       # App Router (41 Routes + Layouts)
│   │       │   ├── api/                   # Server API Handlers (Payment, Keys, Hooks, Telemetry, Privacy)
│   │       │   ├── dashboard/             # Authenticated User Dashboard (Wallet, Keys, Purchase)
│   │       │   ├── explore/               # Canonical Product Showcase Pages
│   │       │   ├── privacy/ & /terms/     # DPDP Statutory Legal & Rights Interfaces
│   │       │   ├── admin/                 # Live Observability Telemetry Dashboard
│   │       │   ├── ai/                    # AI Developer Portal
│   │       │   ├── cms/                   # Announcement Alert Feeds
│   │       │   ├── layout.tsx             # Root Layout with StructuredData & Version Badge
│   │       │   └── sitemap.ts             # Dynamic Search Engine Sitemap Generator
│   │       ├── middleware.ts              # Next.js Edge Proxy Middleware (W3C Tracing)
│   │       └── public/                    # Static Assets, /llms.txt, robots.txt
│   ├── packages/
│   │   ├── ads/                           # AROH Design System (Tokens, CSS variables)
│   │   └── asdk/                          # Core Platform SDK
│   │       ├── src/
│   │       │   ├── schemas/               # Zod Schemas (Purchase, Keys, Hooks, Products, Adapters)
│   │       │   ├── services/              # Business Logic (PurchaseSafety, Payment, Keys, Webhooks)
│   │       │   ├── tracing/               # W3C Distributed Tracing Utilities
│   │       │   ├── telemetry/             # Circular Ring Buffer & SSE Event Stream
│   │       │   ├── registry/              # CANONICAL_PRODUCT_REGISTRY
│   │       │   ├── sync/                  # Three-Way Semantic Reconciler Engine
│   │       │   └── version/               # PLATFORM_VERSION & Governance Exports
│   │       └── tests/                     # 11 Vitest Suites (128 Automated Assertions)
│   ├── manifests/                         # Managed Project Manifests (v1.0.0)
│   ├── docs/                              # Living Architecture, Governance, Legal, and Privacy
│   │   ├── EXECUTION_HISTORY.md           # Granular Task Execution Log (HIST-001 to HIST-011)
│   │   ├── VERSION_HISTORY.md             # Detailed Version Chronology & ADR Records
│   │   ├── PROJECT_STATUS.md              # Active Status Dashboard & Milestone Tracker
│   │   ├── privacy/                       # 21 DPDP Privacy Policies & Registers (JSON)
│   │   └── legal/                         # 5 Master Terms & IP Policies
│   └── scripts/                           # QA Test Runners (Privacy, SEO, CLI Sync, Session Sync)
└── Products/                              # Independent Autonomous Spoke Codebases (Protected Boundary)
    ├── OmniStream/                        # Git Submodule: Dual-Mode Video Intelligence Platform
    └── Spedex/                            # Git Submodule: Fintech Speed & Spending Analytics Workspace
```

---

## 12. Data Model & Schema Authority

All platform data contracts are strictly defined and validated at runtime using **Zod** in `@aroh/asdk/schemas`:

### 12.1 Purchase Safety & Financial Ledger Models (`purchase-safety.ts`)
- **`PurchaseEligibilityStateSchema`**: Tracks user eligibility (`UNKNOWN`, `ADULT_ELIGIBLE`, `MINOR_PAYMENT_BLOCKED`, `AGE_VERIFICATION_REQUIRED`, `SUSPENDED`).
- **`PurchaseConsentRecordSchema`**: Stores affirmative unbundled consent records (`PURCHASE_TERMS_CONFIRMATION`, `VIRTUAL_CURRENCY_DISCLOSURE`, IP, user agent, timestamp, policy version).
- **`PaymentIntentRecordSchema`**: Ephemeral intent before gateway interaction with composite idempotency key, pricing tier, and provider reference.
- **`ArosLedgerEntrySchema`**: Immutable double-entry financial ledger entry (`entry_id`, `user_id`, `direction: "credit" | "debit"`, `amount`, `balance_after`, `idempotency_key`, `timestamp`).
- **`RefundRecordSchema` & `DisputeRecordSchema`**: Formal reversal and chargeback audit trails preventing negative balance anomalies.
- **`TransactionReceiptSchema`**: Formal receipt document detailing purchased units, platform exchange rate ($1.00 USD = 100 Aros), and tax disclosures.
- **`TransactionLimitsConfigSchema`**: Configurable velocity thresholds (min/max transaction, daily caps, monthly volume).
- **`TransactionAuditEventSchema`**: Tamper-resistant audit log for privileged financial operations.

### 12.2 Developer Infrastructure Models (`api-key.ts`, `webhook.ts`, `telemetry.ts`)
- **`ApiKeyRecordSchema`**: Stores `keyId`, `name`, `hashedKey` (SHA-256), `prefix`, `tier` (`basic`, `pro`, `enterprise`), `rateLimitRpm`, `createdAt`, `revokedAt`.
- **`WebhookEndpointRecordSchema`**: Tracks registered destination URLs, secret hash, active events (`aros.credited`, `aros.debited`, `membership.upgraded`, `challenge.completed`), and delivery health.
- **`TelemetryEventSchema`**: Observability event payloads sanitizing user identity to an 8-character hash prefix (`userIdHash`).

### 12.3 Ecosystem Contract Models (`products.ts`, `adapters.ts`)
- **`ProductShowcaseSchema`**: Canonical catalog schema enforcing verified URLs, versions, categories, and capabilities.
- **`SpokeAdapterContractSchema`**: Enforces decoupled boundary isolation, read-only tree inspection, and fail-closed target consumer paths.

---

## 13. API & Integration Layer (Compiled Routes)

The Next.js 16 App Router compiles 41 distinct production routes:

### 13.1 Core Navigation & Pages
- `GET /`: Platform Landing Page with interactive floating dock.
- `GET /explore`: Canonical Product Showcase grid.
- `GET /explore/[productId]`: Deep-dive technical specifications for individual spokes.
- `GET /dashboard`: Authenticated member hub (profile, wallet balance, transaction ledger).
- `GET /dashboard/purchase`: Aros purchase page with minor blocked banner, age attestation, and unbundled consent.
- `GET /dashboard/keys`: Developer API Key Vault management console.
- `GET /admin`: System administration console with live SSE telemetry feed.
- `GET /ai`: Provider-agnostic AI developer portal.
- `GET /cms`: Platform announcement feeds.
- `GET /llms.txt` & `/llms-full.txt`: Machine-readable AI crawler documentation.

### 13.2 Server API Routes
- **`POST /api/payment/checkout`**: Initiates payment intent; enforces server-side `assertPurchaseEligible` fail-closed check.
- **`GET/POST /api/payment/eligibility`**: Inspects user purchase eligibility and records adult attestation.
- **`POST /api/payment/consent`**: Records unbundled affirmative purchase consent before checkout.
- **`POST /api/payment/webhook`**: Ingests gateway settlement webhooks with replay attack defense and idempotency validation.
- **`GET /api/platform/version`**: Emits authoritative platform version metadata (`2.03.06.0`, commit, status).
- **`GET/POST /api/developer/keys`**: Lists and generates developer API keys (HMAC-SHA256, hash-only storage).
- **`GET/DELETE /api/developer/keys/[keyId]`**: Retrieves metadata or permanently revokes an API key.
- **`GET/POST /api/developer/webhooks`**: Registers webhook endpoints and returns one-time signing secret.
- **`GET/DELETE /api/developer/webhooks/[webhookId]`**: Inspects delivery logs or deletes endpoints.
- **`GET /api/telemetry/stream`**: Admin-gated Server-Sent Events stream pushing real-time metrics and heartbeats.
- **`GET /api/health`**: Universal platform health check emitting system uptime and version.
- **`POST /api/privacy/consent`**: Updates DPDP consent states across 4 cookie categories.
- **`POST /api/privacy/rights`**: Submits Data Principal rights requests (Access, Correction, Erasure).
- **`POST /api/privacy/grievance`**: Dispatches formal grievances to the Data Protection Officer.
- **`GET /api/privacy/export`**: Generates machine-readable JSON data portability archives.
- **`POST /api/privacy/delete-account`**: Enforces complete account erasure under DPDP standards.

---

## 14. Security Architecture & Threat Model

| Threat Vector | Platform Defense & Implementation Mechanism |
|---|---|
| **Minor Payment Bypass** | Hard server-side enforcement (`assertPurchaseEligible`) returning `MINOR_PAYMENT_BLOCKED` before any payment session, intent, or charging provider request can be created. |
| **API Key Compromise** | Zero plaintext storage; only SHA-256 hashes of API keys are persisted. Tokens are displayed exactly once upon generation. |
| **Webhook Replay & Spoofing** | HMAC-SHA256 signatures (`x-aroh-signature`), a 300-second timestamp freshness window, and constant-time signature verification (`crypto.timingSafeEqual`). |
| **Financial Double-Spending** | Composite idempotency key validation on `providerTransactionId` and `purchaseIntentId`. Re-sent webhooks return HTTP 200 without executing duplicate wallet credits. |
| **Timing Side-Channel Attacks** | Secret hashes and HMAC signatures are validated using constant-time buffers via `crypto.timingSafeEqual`. |
| **PII Leakage in Telemetry** | Observability payloads strictly hash user IDs to an 8-character SHA-256 prefix (`userIdHash`), entirely excluding emails, wallet balances, and names. |
| **Unauthorized Role Escalation** | Privilege checks gate administrative actions (e.g., `/api/telemetry/stream`, balance adjustments), logging all privileged operations to `TransactionAuditEventSchema`. |

---

## 15. Privacy & Statutory Compliance (DPDP Act 2023)

AROH implements a complete technical privacy infrastructure compliant with the **Digital Personal Data Protection Act 2023 (DPDP)** and **DPDP Rules 2025**:
1. **20 Statutory Policy Documents** maintained under `Aroh/docs/privacy/` and `Aroh/docs/legal/`:
   - `PRIVACY_NOTICE.md`, `CONSENT_POLICY.md`, `COOKIE_POLICY.md`, `CHILD_AND_MINOR_PRIVACY_POLICY.md`, `DATA_PRINCIPAL_RIGHTS_POLICY.md`, `GRIEVANCE_REDRESSAL_POLICY.md`, `TERMS_OF_SERVICE.md`, etc.
2. **5 Machine-Readable Registers**:
   - `DATA_PROCESSING_REGISTER.json`: Documents 7 platform personal data categories.
   - `PAYMENT_DATA_PROCESSING_REGISTER.json`: Documents 5 financial and transaction data categories.
   - `COOKIE_INVENTORY.json`: Tracks 5 cookie definitions across Essential and Optional tiers.
   - `DATA_PROCESSORS.json`: Identifies infrastructure and payment gateway sub-processors.
   - `LEGAL_REVIEW_REGISTER.json`: Tracks legal status of statutory items; items LR-009 to LR-013 track corporate entity incorporation, RBI PPI virtual currency status, and GST OIDAR classification as `LEGAL_REVIEW_REQUIRED`.
3. **Dedicated Affirmative Consent**:
   - Unbundled consent collection; zero pre-ticked checkboxes; instant revocability through `/privacy/consent`.

---

## 16. Performance & Reliability

- **Build Performance**: Next.js 16 compiled cleanly with Turbopack in 23.0s; 41 static and dynamic routes prerendered in 2.2s using 15 workers.
- **In-Process Telemetry Ring Buffer**: Circular 500-slot buffer in `@aroh/asdk/telemetry` provides $O(1)$ ingestion and constant-time latency percentile computation (p50/p95) with zero database overhead.
- **Webhook Clearance Dispatcher**: Exponential backoff retry ($2^n \times 500\text{ms}$) across 3 attempts; automatically transitions failing endpoints to `failing` status to prevent resource starvation.
- **Graceful Spoke Degradation**: When external spokes are unreachable, the platform degrades cleanly to showcase-only mode with informational status badges without throwing runtime exceptions.

---

## 17. Testing & Verification Suites

The AROH monorepo is validated by **504+ passing assertions across 13 test suites**:
1. **`packages/asdk/tests/purchase-safety.test.ts`** (15 tests): Minor payment blocking, fail-closed eligibility, unbundled consent, idempotent ledger crediting, refund handling, dispute logging.
2. **`packages/asdk/tests/version.test.ts`** (6 tests): Version format verification (`2.03.06.0`), tier breakdown parsing.
3. **`packages/asdk/tests/telemetry.test.ts`** (14 tests): In-process event ring buffer, p50/p95 latency math, active journey tracking, SSE frame formatting, PII sanitization.
4. **`packages/asdk/tests/tracing.test.ts`** (11 tests): W3C `traceparent` parsing, formatting, validation, Web Crypto generation.
5. **`packages/asdk/tests/payment.test.ts`** (9 tests): Stripe checkout session building, conversion math ($1 = 100 Aros), double-crediting prevention.
6. **`packages/asdk/tests/webhook.test.ts`** (16 tests): Cryptographic HMAC-SHA256 signing, replay attack protection, exponential backoff dispatcher.
7. **`packages/asdk/tests/api-key.test.ts`** (10 tests): Key generation, SHA-256 hash storage, rate tier gating.
8. **`packages/asdk/tests/product-registry.test.ts`** (7 tests): Zero fabrication verification for registered spoke URLs.
9. **`packages/ads/tests/ads.test.ts`** (7 tests): AROH Design System tokens and color contrast validation.
10. **`scripts/test-privacy-static-audit.js`** (117 tests): Validates presence and schemas of 20 legal policies and 5 machine-readable registers.
11. **`scripts/test-seo-audit.js`** (56 tests): Validates `/llms.txt`, `/robots.txt`, `sitemap.ts`, JSON-LD structured data, and error boundaries.
12. **`scripts/test-session-sync.js`** (16 tests): Validates cross-tab session invalidation on logout.
13. **`scripts/test-sync-cli.js`** (33 tests): Validates 3-way semantic reconciliation ($B \oplus P \oplus A$) and CLI exit codes (0–7).

---

## 18. Historical Error & Bug Registry

Every meaningful issue discovered during development is permanently preserved in this ledger:

| Issue ID | Date / Version | Problem & Symptoms | Root Cause | Affected Area | Fix Implemented | Verification & Regression Risk |
|---|:---:|---|---|---|---|---|
| **BUG-001** | 2026-07-15 (`v1.0.0`) | React hydration error #418 during initial page load. | Client components rendering date strings and `localStorage` state on server. | `apps/web/app` | Implemented mounting guards (`const [mounted, setMounted] = useState(false)`). | Verified clean SSR hydration; zero regression risk. |
| **BUG-002** | 2026-09-10 (`v2.0.2`) | Running `npm test` left `git status` dirty with modified manifest files. | `test-sync-cli.js` Test 14 mutated `spedex-core.manifest.json` on disk during test runs. | `scripts/test-sync-cli.js` | Refactored test harness to operate strictly against temporary isolated mock files. | Verified clean git status after full test suite execution. |
| **BUG-003** | 2026-09-10 (`v2.0.2`) | Coupling between sibling routes: `/products` imported data from `/explore`. | Route component directly imported internal models from another page route. | `apps/web/app/products` | Decoupled routes to import `CANONICAL_PRODUCT_REGISTRY` exclusively from `@aroh/asdk`. | Verified independent route compilation under Next.js App Router. |
| **BUG-004** | 2026-09-11 (`v2.2.0`) | Next.js build failed: `"use client"` page components cannot export `metadata`. | Next.js App Router restriction prohibiting metadata exports in client components. | `apps/web/app/**/page.tsx` | Extracted route-level `layout.tsx` files to serve as static metadata wrappers. | Verified all 41 routes compile cleanly with zero metadata warnings. |
| **BUG-005** | 2026-09-19 (`v2.3.4`) | Edge Middleware failed to compile: `crypto.randomBytes` is not supported. | Node.js `crypto` module is unavailable in standard Edge runtimes. | `apps/web/middleware.ts` | Refactored W3C tracing engine in `@aroh/asdk/tracing` to use Web Crypto API (`crypto.getRandomValues`). | Verified universal compatibility across Edge, Node.js, and Browser runtimes. |
| **BUG-006** | 2026-09-19 (`v2.3.0`) | Vercel deployments failing to build. | Vercel project configuration pointed to old personal repo and root `apps/web`. | Vercel project settings | Documented canonical settings: repo `Aroh-Open-Source/AROH`, root `Aroh/apps/web`. | Verified build commands execute correctly from specified root directory. |
| **BUG-007** | 2026-09-19 (`v2.3.3`) | Duplicated webhook delivery could double-credit user wallet. | Settlement handler lacked idempotency deduplication on composite keys. | `@aroh/asdk/services/payment.ts` | Implemented dual deduplication checking both `providerTransactionId` and `purchaseIntentId`. | Verified with automated duplicate-delivery test assertion in Vitest. |
| **BUG-008** | 2026-09-20 (`v2.3.6`) | Minor account could potentially initiate checkout if client UI bypassed. | Conflation of account authentication with purchase eligibility. | `apps/web/app/api/payment` | Implemented strict server-side `assertPurchaseEligible` fail-closed check returning HTTP 403. | Verified with automated test attempting API checkout with minor profile. |

---

## 19. Architectural Decisions (ADR Register)

- **ADR-001: Platform-First Decoupled Hub-and-Spoke Architecture**: Partitioned the repository into platform hub (`Aroh/`) and autonomous spokes (`Products/`). Spokes maintain their own tech stacks and git histories.
- **ADR-002: Three-Way Semantic Reconciliation ($B \oplus P \oplus A$)**: All spoke updates synchronize using three-way content hashing against baseline manifests rather than blind file copying.
- **ADR-003: Provider-Agnostic AI Tier with Zod Contracts**: AI requests flow through an orchestrator supporting Mock, OpenAI, Anthropic, Gemini, and Local models without application-level lock-in.
- **ADR-004: Server-Side Financial Authority for Aros Token Ledger**: Client code never writes to balance fields. All balance updates are strictly derived from the sum of immutable ledger transactions ($Balance = \sum Credits - \sum Debits$).
- **ADR-005: Zero-Fabrication Showcase Registry**: Product showcase entries are strictly validated against authoritative GitHub repositories and live deployments.
- **ADR-006: Cryptographic HMAC-SHA256 Developer Key Vault with Hash-Only Storage**: Developer API keys are hashed with SHA-256 upon generation; raw keys are emitted exactly once and never persisted.
- **ADR-007: Asynchronous Webhook Clearance Engine with Exponential Backoff**: Webhooks are signed with HMAC-SHA256 (`x-aroh-signature`), protected by a 300-second timestamp window, and dispatched with exponential backoff.
- **ADR-008: Server-Sent Events (SSE) for Real-Time Observability Telemetry**: Real-time metrics in `/admin` utilize SSE instead of WebSockets to maintain full compatibility with Next.js App Router serverless runtimes.
- **ADR-009: Mandatory Server-Side Minor Payment Restriction (`NO_MINOR_PAYMENT_FOR_AROS = TRUE`)**: All Aros purchases are prohibited for users under 18; enforced server-side before intent or session creation.
- **ADR-010: Provider-Agnostic Payment Abstraction Layer**: Financial settlements utilize a `PaymentProvider` interface, allowing pluggable gateway adapters (Stripe, Razorpay, Cashfree) without rewriting accounting logic.

---

## 20. Guardrails & Engineering Invariants

Future human engineers and autonomous AI agents must adhere strictly to these non-negotiable rules:
1. **Universal Version Controller Governance**:
   - Every project-changing command must visit [`VERSION_CONTROLLER.md`](file:///d:/PROJECT/AROH%20Open%20Source/VERSION_CONTROLLER.md) first to inspect previous changes, calculate target versions under `A.BC.DE.F`, and update the version ledger upon verified completion.
2. **`Products/` Boundary Inviolability**:
   - `Products/` contains autonomous spoke repositories (`Products/OmniStream`, `Products/Spedex`). Zero mutations, refactoring, or file deletions are permitted inside `Products/` during platform tasks.
3. **Zero Fabrication Policy**:
   - Never invent synthetic metrics, mock URLs, fake git commit hashes, or imaginary capabilities.
4. **Three Realities Reconciliation**:
   - Always reconcile what was intended (conversations), what was actually built (code/git), and what should be done next (gap analysis).
5. **Fail-Closed Security & Financial Safety**:
   - If an age, consent, or payment eligibility status is unknown, the system must fail closed. Minor accounts cannot purchase Aros under any circumstance.
6. **Append-Only History Preservation**:
   - Never overwrite or erase historical execution logs (`EXECUTION_HISTORY.md`) or bug records.

---

## 21. Current State & Reconciliation with ChatGPT Data Prompt

### 21.1 Cross-Check Analysis
The ChatGPT Data Prompt provided in earlier project phases represented the **Wave 1 baseline (`v2.00.05.0` / commit `869a69d`)** where:
- Tests were 239/239.
- Next.js compiled 14 routes.
- Wave 2 was documented as planned/future.
- Aros purchasing and minor restrictions were documented as conceptual requirements.

### 21.2 Concrete Reality Verification (`v2.03.07.0`)
Cross-checking against the current codebase, git history, and test runners reveals that **Wave 2, Aros Purchase Safety, Transaction Receipts, Dispute Handling, and Developer Tools have been fully implemented and verified**:

| Dimension | ChatGPT Data Prompt Baseline (Wave 1) | Concrete Verified Reality (`v2.03.07.0`) | Status |
|---|:---:|:---:|:---:|
| **Platform Version** | `2.00.05.0` (Wave 1 Baseline) | `2.03.07.0` (Wave 2 + Safety + Dispute UI & API Explorer) | Verified in `VERSION_CONTROLLER.md` |
| **Monorepo Test Pass Rate** | 239 / 239 PASS | **506+ PASS** across 13 test suites | Verified via `npm test` |
| **Next.js Compiled Routes** | 14 Routes | **44 Routes + Proxy Middleware** | Verified via Turbopack build |
| **Developer API Key Vault & Explorer** | Planned (Milestone 3.1) | **IMPLEMENTED & VERIFIED** (`/dashboard/keys`, HMAC-SHA256 & Live Explorer) | v2.03.07.0 |
| **Webhook Clearance Engine** | Planned (Milestone 3.2) | **IMPLEMENTED & VERIFIED** (`/api/developer/webhooks`) | Commit `629fb18` |
| **Fiat-to-Aros Settlement** | Planned (Milestone 3.3) | **IMPLEMENTED & VERIFIED** (`/api/payment/checkout`, sandbox) | Commit `629fb18` |
| **Cryptographic Transaction Receipts** | Planned (Purchase Safety) | **IMPLEMENTED & VERIFIED** (`/api/payment/receipt/[receiptId]`, Receipt Modal) | v2.03.07.0 |
| **Formal Dispute / Grievance Redressal** | Planned (Purchase Safety) | **IMPLEMENTED & VERIFIED** (`/api/payment/dispute`, Dispute Modal) | v2.03.07.0 |
| **W3C Distributed Tracing** | Planned (Milestone 3.4) | **IMPLEMENTED & VERIFIED** (`traceparent`, `middleware.ts`) | Commit `629fb18` |
| **Real-Time Telemetry Broker** | Planned (Milestone 3.5) | **IMPLEMENTED & VERIFIED** (`/api/telemetry/stream` SSE) | Commit `629fb18` |
| **Aros Minor Payment Block** | Documented Policy | **IMPLEMENTED & VERIFIED** (`NO_MINOR_PAYMENT_FOR_AROS = TRUE`) | Commit `629fb18` |
| **Unbundled Affirmative Consent** | Documented Requirement | **IMPLEMENTED & VERIFIED** (`/api/payment/consent`, 0 pre-ticked) | Commit `629fb18` |
| **Products Boundary Integrity** | 0 mutations | **0 mutations, 100% inviolable** | Verified via Git audit |

---

## 22. Known Limitations & Technical Debt

1. **In-Memory Mock Fallback for Local Development**: Without live Firebase configuration, `@aroh/asdk/services/firebase.ts` falls back to an in-memory mock database. Mock state resets on server restart.
2. **Payment Gateway Sandbox vs Live Keys**: The payment settlement engine is verified against sandbox mocks; live credentials (Stripe / Razorpay) are deferred pending formal corporate entity formation.
3. **Submodule Working Tree Status**: Git submodules inside `Products/` show modified/untracked content from their upstream repositories. These must remain uncommitted at the root level to respect boundary isolation.

---

## 23. Missing / Incomplete Areas

- **Statutory Legal Review Signoff**: Items LR-009 through LR-013 in `LEGAL_REVIEW_REGISTER.json` (Corporate entity incorporation, RBI PPI virtual currency exemption opinion, GST OIDAR classification) remain classified as `LEGAL_REVIEW_REQUIRED`.
- **Live Payment Gateway Credentials**: Live Stripe/Razorpay webhooks and production secret keys are not configured in repository environment files.

---

## 24. Remaining Tasks by Priority

### Priority 0 (Legal & Gateway Activation)
1. Complete formal corporate entity incorporation and legal signoff for items LR-009 through LR-013.
2. Configure production Stripe / Razorpay live webhooks and API secret keys.

### Priority 1 (Ecosystem Polish & Developer Tooling - COMPLETED)
3. **[DONE]** Implement user-facing dispute submission interface for transaction chargeback reviews (`/dashboard/purchase`, `/api/payment/dispute`).
4. **[DONE]** Expand developer API documentation with interactive OpenAPI/Swagger explorer (`/dashboard/keys`).

### Priority 2 (Phase 4 Mobile Expansion)
5. Initialize Phase 4 (`2.04.00.0`): React Native / Expo shell integrating `@aroh/asdk`.

---

## 25. Future Roadmap

- **Phase 0 (Foundation)**: COMPLETED (`1.00.00.0`)
- **Phase 1 (MVP Platform Hub & Aros Economy)**: COMPLETED (`1.05.00.0`)
- **Phase 2 (Ecosystem Decoupling & Flagship Integration)**: COMPLETED (`2.00.00.0` – `2.02.00.0`)
- **Phase 3 (Developer Platform, Tracing & Telemetry - Wave 2)**: COMPLETED (`2.03.01.0` – `2.03.05.0`)
- **Aros Age, Consent, Purchase & Payment Safety Hardening**: COMPLETED (`2.03.06.0`)
- **Ecosystem Polish, Dispute Redressal & Interactive Developer Tooling**: COMPLETED (`2.03.07.0`)
- **Phase 4 (Cross-Platform Mobile Shell)**: PLANNED (`2.04.00.0`)
- **Phase 5 (Federated Multi-Tenant Enterprise)**: PROPOSED (`3.00.00.0`)

---

## 26. Important Lessons Learned

1. **Fail-Closed Is Essential for Financial & Minor Safety**: Never assume user eligibility; if age is unknown or under 18, immediately block payment intent creation on the server side.
2. **Never Overwrite Products from Platform Scripts**: `Products/` must remain an inviolable boundary. Spoke integration must be achieved via adapters and contracts, never file mutation.
3. **Web Crypto API Over Node Crypto for Edge Middleware**: Next.js Edge Middleware cannot load Node.js built-in modules like `crypto`. All universal runtime utilities must be authored against W3C Web Crypto standards.
4. **Idempotency Must Be Dual-Keyed**: Checking only session ID or charge ID is insufficient. Protect against replay attacks and duplicate webhooks by binding both `providerTransactionId` and `purchaseIntentId`.
5. **Documentation Must Advance Concurrently with Code**: A feature is not complete until its Zod schemas, tests, execution history, and version controller entries are synchronized.

---

## 27. Release & Version Information

- **Current Version**: `2.03.07.0` (`v2.3.7`)
- **Version Tier Breakdown**:
  - Major (`A` = `2`): Master monorepo restructuring & ecosystem decoupling.
  - Sub-Version (`BC` = `03`): Developer Platform & External Service Federation (Wave 2).
  - Functional (`DE` = `07`): Ecosystem Polish, Cryptographic Receipts, Grievance/Dispute Redressal, & Developer API Explorer.
  - Patch (`F` = `0`): Baseline verified release.
- **Commit**: `d37e3e2` (synchronized via `personal/main`)
- **Authoritative Version Ledger**: [`VERSION_CONTROLLER.md`](file:///d:/PROJECT/AROH%20Open%20Source/VERSION_CONTROLLER.md)

---

## 28. Final System Summary (Onboarding Guide)

**Welcome to AROH.**

AROH is an orchestrated open-source ecosystem that connects independent applications to a unified platform hub without compromising product autonomy. 

To develop safely on AROH:
1. **Always read [`VERSION_CONTROLLER.md`](file:///d:/PROJECT/AROH%20Open%20Source/VERSION_CONTROLLER.md)** before starting work. Understand the active version (`2.03.07.0`) and calculate your target version.
2. **Never touch `Products/`**: All files in `Products/` belong to autonomous spoke repositories.
3. **Enforce Server Authority**: User balances, API keys, and purchase eligibility are strictly managed server-side. Minors are strictly prohibited from purchasing Aros (`NO_MINOR_PAYMENT_FOR_AROS = TRUE`).
4. **Validate Everything with Zod**: Every API payload, webhook event, and spoke contract must pass runtime schema validation.
5. **Run the Full Test Suite**: Verify that all 13 monorepo test suites (506+ assertions) and Next.js 16 build (44 routes) pass with zero errors before declaring completion.
6. **Update [`AROH.md`](file:///d:/PROJECT/AROH%20Open%20Source/AROH.md) and [`VERSION_CONTROLLER.md`](file:///d:/PROJECT/AROH%20Open%20Source/VERSION_CONTROLLER.md)** to keep this living institutional memory synchronized.
