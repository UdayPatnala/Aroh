# AROH Open Source Platform: Product Master & Living Architecture Specification

> **Authoritative Product & Architecture Master**: This document is the single, permanent source of truth for product purpose, architecture, modular domain boundaries, change-isolation rules, experience principles, data flow, security/privacy, and technical capabilities across the **AROH Open Source Platform & Application Ecosystem**.
>
> **Platform Version**: `2.05.03.0`  
> **Authoritative Version Format**: `A.BC.DE.F` (Major: 2, Sub-version: 05, Functional: 03, Patch: 0)  
> **Status**: `VERIFIED`  
> **Canonical Repository**: [https://github.com/Aroh-Open-Source/AROH](https://github.com/Aroh-Open-Source/AROH) (`main`)  
> **Personal / Mirror Remote**: [https://github.com/UdayPatnala/Aroh](https://github.com/UdayPatnala/Aroh) (`personal/main`)  
> **Production Web Deployment**: [https://aroh-os.vercel.app](https://aroh-os.vercel.app)  
> **Associated Historical Ledger**: [`VERSION_CONTROLLER.md`](file:///d:/PROJECT/AROH%20Open%20Source/VERSION_CONTROLLER.md)  
> **Golden Invariant**: *Every page, feature, function, component, workflow, service, API, data model, button, interaction, and system capability has a clearly identifiable ownership boundary so that modifying one thing does not unnecessarily modify, overwrite, delete, or destabilize unrelated parts of the project.*

---

## 1. Product Identity & Purpose

- **Project Name**: AROH (Aroh Open Source Platform)
- **Project Type**: AI-native digital ecosystem platform, monorepo, decentralized application runtime, and developer infrastructure hub.
- **Creator & Maintainer**: Patnala Uday Kumar / AROH Open Source Contributors.
- **Core Purpose**: Provide an orchestrated ecosystem layer that unifies independent digital products around a shared design system, an immutable virtual economy (**Aros Token Ledger**), a provider-agnostic artificial intelligence tier, cross-tab single sign-on (SSO) session synchronization, real-time observability telemetry, W3C distributed tracing, multi-tenant enterprise governance, and an ecosystem announcements platform, while strictly preserving the complete code, technology, and repository independence of individual products.

---

## 2. Motive & Problem Statement

Modern software engineering across multi-product suites suffers from three compounding points of friction:
1. **Redundant Boilerplate Duplication**: Independent consumer and enterprise applications (video streaming players, campus fintech wallets, space telemetry dashboards, interactive developer sandboxes) repeatedly implement authentication, billing ledgers, design tokens, telemetry pipelines, and notification buses from scratch.
2. **The Coupling vs. Divergence Dilemma**:
   - In traditional monorepos, applications become tightly bound to parent framework code and build tooling, destroying standalone portability.
   - In polyrepos or naive multi-repo structures, code is copied or forked. Downstream copies rapidly drift out of sync, lose provenance, overwrite customizations, and break platform contracts.
3. **Client-Authoritative Financial Vulnerabilities**: Distributed applications frequently manage state, credits, and permissions directly on the client, creating severe vulnerabilities to transaction forgery, balance tampering, and state desynchronization.

### The AROH Solution
AROH establishes a **Decoupled Hub-and-Spoke Ecosystem**:
- **The Central Platform Hub (`Aroh/apps/web`)**: Serves as the single administrative and financial authority (Aros Token Ledger), identity broker, developer portal, and public discovery registry.
- **Autonomous Product Spokes (`Products/` & Standalone Repositories)**: Independent flagships (OmniStream, SpeDex, Nebula, Music Mirror, JavaPath Pro) maintain 100% decoupling from platform code. They execute their own domain logic without compile-time coupling to `@aroh/asdk`.
- **Ecosystem Adapters & Contracts (`packages/asdk`, `packages/ads`, `manifests/`)**: Connect products to the ecosystem via event hooks, declarative schemas, and three-way semantic synchronization manifests ($B \oplus P \oplus A$).

---

## 3. Vision & Core Philosophy

- **Product Vision**: A calm, intentional, fast, intelligent, and premium digital ecosystem. AROH feels like a coherent digital world rather than an unorganized directory of links.
- **Product Philosophy**: Clean editorial aesthetics, visible focus, zero visual noise, transparent privacy disclosures, zero dark patterns, and fail-closed safety for transactions and minor protection.
- **Technical Philosophy**:
   - Explicit contracts over implicit conventions.
   - Strict runtime validation via Zod schemas.
   - Append-only immutable ledgers for all financial and value movements ($Balance = \sum Credits - \sum Debits$; zero direct balance writes).
   - Provider-agnostic abstractions for AI, payment gateways, and directory services.
   - Zero fabrication: every link, status, and capability claimed is backed by verifiable code or live deployments.
   - Three Realities Reconciliation: Reconciling what was intended, what was built, and what should be done next.

---

## 4. Scope & Boundaries

### In Scope
- Central Platform Hub application (`Aroh/apps/web`) written in Next.js 16 App Router (45 compiled routes).
- Cross-Platform Mobile Shell (`Aroh/apps/mobile`, `@aroh/mobile`) built with React Native / Expo.
- Core Platform SDK (`Aroh/packages/asdk`) providing auth, ledger, enterprise team wallets, AI, sync, tracing, telemetry, purchase safety, announcements registry, and Server-Driven UI (SDUI) Generative UI schemas.
- AROH Design System (`Aroh/packages/ads`) providing design tokens, CSS variables, Card layout primitives, and motion primitives.
- Ecosystem Future Developments & Announcements Platform (`/announcements`, homepage stage rail, product roadmap modal).
- Official Community Suggestion Gateway pointing strictly to verified Instagram (`https://www.instagram.com/aroh.0s/`).
- Managed Project Manifests (`Aroh/manifests/*.manifest.json`) orchestrating spoke synchronization.
- Statutory Privacy, Legal, and Compliance Registers (`Aroh/docs/privacy/`, `Aroh/docs/legal/`).
- Automated QA Test Harnesses across all packages and apps (535+ passing assertions).

### Out of Scope & Inviolable Boundaries
- **Strict Inviolability of `Products/`**: Under no circumstances may platform tooling, synchronization CLIs, automated agents, or scripts mutate, refactor, format, clean, or delete files inside `Products/` (0 mutations allowed).
- **No Client-Side Direct Balance Overwriting**: Client UI components never directly mutate user balances or tokens.
- **No Raw Sensitive Credential Storage**: Raw credit card numbers, CVVs, banking PINs, or UPI secrets are never persisted or logged.
- **No Automatic Inferred Parental Authorization**: A minor account cannot be granted payment capability simply because an adult's card or UPI ID is presented.

---

## 5. Experience & Behavioral Principles (D1 Contract)

The platform experience adheres to explicit behavioral rules:
- **Primary Qualities**: Fast, clear, responsive, intentional, calm, intelligent, trustworthy, consistent, accessible, predictable, recoverable, premium.
- **State Model**: Every interactive element defines explicit states: `idle`, `hover`, `focus`, `pressed`, `active`, `selected`, `disabled`, `loading`, `processing`, `queued`, `syncing`, `success`, `error`, `retrying`, `offline`.
- **Interaction Contract**:
  1. Input -> Immediate visual recognition.
  2. Processing state shown if operation exceeds 100ms.
  3. Result -> Verified before state update.
  4. State Update -> Atomic.
  5. Recovery path provided on failure (never a dead end).
- **Perceived Performance**: Immediate local response with optimistic UI *only* when the system can safely reconcile failure. All financial, security, and irreversible operations use verified server state.

---

## 6. System Architecture & Modular Change-Isolation Governance

### 6.1 Architectural Hierarchy

```text
d:\PROJECT\AROH Open Source
│
├── APP / SHELL (Applications & Ingress)
│   ├── Aroh/apps/web/ (Next.js 16 App Router: 45 routes + W3C trace proxy)
│   └── Aroh/apps/mobile/ (@aroh/mobile: React Native / Expo shell)
│
├── DOMAINS (Core Capabilities & Business Logic)
│   ├── Domain 1: Identity & Authentication (@aroh/asdk/services/firebase.ts)
│   ├── Domain 2: Financial Economy & Aros Ledger (@aroh/asdk/services/wallet.ts, purchase-safety.ts)
│   ├── Domain 3: Developer Platform & API Vault (@aroh/asdk/services/api-key.ts, webhook.ts)
│   ├── Domain 4: AI Orchestration & Developer Studio (@aroh/asdk/src/ai/provider.ts, generative-ui.ts)
│   ├── Domain 5: Product Showcase & Hierarchy (@aroh/asdk/src/registry/products.ts, showcase-priority.ts)
│   ├── Domain 6: Observability, Tracing & Telemetry (@aroh/asdk/src/tracing, src/telemetry)
│   ├── Domain 7: DPDP Privacy, Consent & Statutory Rights (@aroh/asdk/services/privacy.ts)
│   ├── Domain 8: Design System (@aroh/ads)
│   ├── Domain 9: Autonomous Product Spokes (Products/ — Inviolable)
│   ├── Domain 10: Multi-Tenant Enterprise & Federated Directory (@aroh/asdk/services/team-wallet.ts, saml-scim.ts)
│   └── Domain 11: Ecosystem Future Developments & Announcements (@aroh/asdk/src/registry/announcements.ts, services/google-play-points.ts)
│
├── INFRASTRUCTURE (Platform SDK & Runtime Adapters)
│   └── Aroh/packages/asdk/ (Typed schemas, universal storage, double-entry ledger, SSE broker, SDUI contracts)
│
├── SHARED (Visual Design Tokens & UI Primitives)
│   └── Aroh/packages/ads/ (Outfit typography, WCAG 2.1 AA palette, button, badge, and card primitives)
│
├── AUTONOMOUS PRODUCT SPOKES (Read-Only Flagships)
│   └── Products/ (OmniStream, Spedex)
│
├── CONFIGURATION & TOOLING
│   ├── package.json, turbo.json, tsconfig.json
│   └── Aroh/manifests/ (Spoke synchronization manifests)
│
└── TESTING (Proximity-Driven Verification Suites)
    ├── Aroh/packages/asdk/tests/ (18 Vitest suites, 204 assertions)
    ├── Aroh/packages/ads/tests/ (Design system suite, 8 assertions)
    ├── Aroh/apps/mobile/tests/ (Mobile navigation suite, 8 assertions)
    └── Aroh/scripts/ (Sync CLI, Privacy static audit, SEO audit, Session sync, Visual surface audit)
```

### 6.2 The Three Principles of Modular Isolation
1. **Absolute Ownership**: Every file, function, route, and UI element belongs to exactly one domain. No orphaned or globally unowned files.
2. **Locality of Behavior**: Code that changes together lives together. A feature's schemas, services, API routes, and unit tests are colocated or directly indexed.
3. **Change Isolation & Radius Protocol**:
   Before modifying code, affected files are classified into:
   - `DIRECT`: Files implementing the requested behavior.
   - `RELATED`: Direct support files (schemas, types, proximity tests).
   - `DEPENDENT`: Consumers requiring contract updates (assessed for impact).
   - `SHARED`: Common primitives (`@aroh/ads`, `@aroh/asdk/src/index.ts`). Modifying shared code triggers full monorepo regression testing.
   - `UNRELATED`: All other domains and spokes. **Must remain untouched.**

---

## 7. Domain Ownership Map

| Domain | Key Responsibilities | Implementation Files | Web Routes / UI | Tests |
|---|---|---|---|---|
| **1. Identity & Auth** | Firebase authentication, session rehydration, cross-tab SSO logout sync. | `asdk/services/firebase.ts`, `asdk/store/index.ts` | `/login`, `/dashboard`, `SessionSync` | `scripts/test-session-sync.js` |
| **2. Financial Economy** | Aros double-entry ledger, server-side minor payment restriction, affirmative unbundled consent, cryptographic receipts, dispute redressal. | `asdk/services/wallet.ts`, `purchase-safety.ts`, `payment.ts`, `payment-provider.ts` | `/dashboard`, `/dashboard/purchase`, `/api/payment/*` | `tests/payment.test.ts`, `purchase-safety.test.ts`, `dispute-receipt.test.ts` |
| **3. Developer Platform** | HMAC-SHA256 API keys (hash-only storage, tier limits), Webhook clearance (HMAC signing, exponential backoff). | `asdk/services/api-key.ts`, `asdk/services/webhook.ts` | `/dashboard/keys`, `/api/developer/*` | `tests/api-key.test.ts`, `tests/webhook.test.ts` |
| **4. AI Orchestration** | Provider-agnostic AI inference, priority failover chain, streaming Server-Driven UI (SDUI) Generative UI blocks. | `asdk/src/ai/provider.ts`, `asdk/src/ai/generative-ui.ts`, `asdk/src/ai/schema.ts` | `/ai`, `/api/ai/chat` | `tests/generative-ui.test.ts`, `scripts/test-ai-abstraction.js` |
| **5. Product Showcase** | Canonical product registry, zero-fabrication metadata, spoke launch links. | `asdk/src/registry/products.ts`, `asdk/src/schemas/product.ts` | `/explore`, `/explore/[productId]`, `/products` | `tests/product-registry.test.ts`, `scripts/test-product-registry.js` |
| **6. Observability & Tracing** | W3C distributed tracing (`traceparent`), SSE live telemetry stream, circular ring buffer. | `asdk/src/tracing/index.ts`, `asdk/src/telemetry/index.ts` | `/admin`, `/api/telemetry/stream`, `/api/health`, `middleware.ts` | `tests/tracing.test.ts`, `tests/telemetry.test.ts` |
| **7. Statutory DPDP Privacy** | Indian DPDP Act 2023 compliance, consent lifecycle, data principal rights (access, erasure, nomination), grievance redressal. | `asdk/services/privacy.ts`, `docs/privacy/*`, `docs/legal/*` | `/privacy`, `/terms`, `/cookies`, `/privacy/*`, `/api/privacy/*` | `scripts/test-privacy-static-audit.js` (117 assertions) |
| **8. Design System** | Outfit typography tokens, WCAG 2.1 AA palette, button, badge, and card primitives. | `packages/ads/src/index.ts` | Global UI components, Tailwind tokens | `packages/ads/tests/ads.test.ts` |
| **9. Autonomous Spokes** | Independent flagships (OmniStream, SpeDex). Inviolable boundary. | `Products/OmniStream`, `Products/Spedex` | Standalone repositories & submodules | `scripts/test-sync-cli.js` (boundary enforcement) |
| **10. Enterprise Multi-Tenant** | Team wallets, member monthly spending quotas, role-based debits, SAML 2.0 metadata/assertions, SCIM 2.0 provisioning. | `asdk/services/team-wallet.ts`, `asdk/services/saml-scim.ts`, `asdk/schemas/enterprise.ts` | `/dashboard/organization` | `tests/enterprise.test.ts` |
| **11. Future Developments & Announcements** | Ecosystem announcement registry, stage rails, contextual product roadmap, verified Instagram community feedback bridge, fail-closed Google Play Points/Billing exploration engine. | `asdk/src/schemas/announcement.ts`, `asdk/src/registry/announcements.ts`, `asdk/src/services/google-play-points.ts` | `/announcements`, `/`, `/explore/[productId]` | `tests/announcements.test.ts` |

---

## 8. Data Architecture & Execution System (D2 Contract)

### 8.1 Single Source of Truth Register
- **Platform Version**: `VERSION_CONTROLLER.md` (authoritative) -> mirrored in `@aroh/asdk/src/version/index.ts` and `/api/platform/version`.
- **Aros User Balances**: Derived from immutable ledger transactions ($Balance = \sum Credits - \sum Debits$). Never written directly.
- **Product Registry**: `@aroh/asdk/src/registry/products.ts`, validated against upstream git repositories.
- **Statutory Legal Review**: `Aroh/docs/privacy/LEGAL_REVIEW_REGISTER.json`, tested by automated static audit.
- **AI Discoverability**: `apps/web/public/llms.txt`, verified by SEO audit.

### 8.2 Traceability Sequence: User Action to Data Layer

```text
USER INTERACTION
    ↓
PAGE / VIEW LAYER (e.g. apps/web/app/dashboard/purchase/page.tsx)
    ↓
FEATURE BOUNDARY (Purchase Settlement Dialog & Consent Attestation)
    ↓
ACTION HANDLER (handlePurchaseInitiate)
    ↓
API ROUTE INGRESS (/api/payment/checkout with traceparent header)
    ↓
SERVICE VALIDATION (purchaseSafetyService.assertPurchaseEligible -> fail-closed minor block)
    ↓
GATEWAY ABSTRACTION (PaymentProvider.createPaymentIntent)
    ↓
SETTLEMENT DISPATCHER (paymentSettlementService.settlePayment)
    ↓
FINANCIAL LEDGER (walletService.creditWallet -> append-only transaction entry)
    ↓
RECEIPT ENGINE (generateCryptographicReceipt -> SHA-256 hash)
    ↓
AUDIT BROADCAST (emitAuditEvent -> COMPLIANCE_EVENT & SSE stream)
    ↓
UI CONFIRMATION & CRYPTOGRAPHIC RECEIPT MODAL
```

---

## 9. Spoke Adapter Interface Contracts

Spoke integration uses a **zero-coupling adapter architecture**:
1. **Decoupled Hub-and-Spoke**: Spokes maintain their own independent git trees, tech stacks (Spring Boot, Expo, React, Next.js), and distribution models.
2. **Absolute `Products/` Inviolability**: Platform tooling never mutates files inside `Products/`.
3. **The 7-Level Provenance & Verification Taxonomy**:
   - `VERIFIED`: Confirmed via automated probe, git commit, or build.
   - `IMPLEMENTED-REPORTED`: Reported in code/PR but awaiting live verification.
   - `DOCUMENTED`: Described in authoritative upstream README or docs.
   - `INFERRED`: Derived logically from configuration or dependency.
   - `PROPOSED`: Planned or proposed in an approved roadmap/RFC.
   - `UNKNOWN`: Field state cannot be established; fail-closed.
   - `SUPERSEDED`: Deprecated or replaced by a subsequent version.
4. **Three-Way Semantic Reconciler ($B \oplus P \oplus A$)**:
   - Synchronizes manifests across Baseline ($B$), Product Spoke ($P$), and Platform Adapter ($A$).
   - CLI engine (`aroh-sync.js`) supports `status`, `inspect`, `detect`, `diff`, `plan`, and `apply` with dry-run protection and deterministic exit codes (0 to 7).

### 9.1 Product Showcase Hierarchy & SpeDex Future-Launch Architecture
- **Single Canonical Source**: `@aroh/asdk/src/registry/showcase-priority.ts` (`resolveShowcaseHierarchy()`).
- **Current Platform Reality (Pre-Release)**:
  1. `OmniStream` — STAR / PRIMARY FLAGSHIP: Leading live product, receives prominent hero card and leading CTA.
  2. `JavaPath Pro` — SECONDARY FEATURED: Follows OmniStream with full capability presentation.
  3. `Music Mirror` — TERTIARY FEATURED: Positioned after JavaPath Pro.
  4. `SpeDex` — FUTURE LAUNCH / COMING SOON: Visibly separated with dedicated "Future Launch" badge, roadmap milestones, and notification signup. Strictly 0 purchase/install/download buttons.
- **Post-Release Promotion Transition**:
  - Controlled by verified canonical state via `isSpedexReleased()`: Requires status `online` and verified HTTPS `liveUrl`.
  - Upon release, hierarchy automatically promotes to: `SpeDex` (STAR) → `OmniStream` (FEATURED) → `JavaPath Pro` (FEATURED) → `Music Mirror` (FEATURED) without requiring component redesigns.
  - Zero hard-coded conflicting product orders in UI components.

---

## 10. Security & Statutory Privacy Architecture

### 10.1 Minor Protection & Aros Payment Restriction
- **Policy Invariant**: `NO_MINOR_PAYMENT_FOR_AROS = TRUE`.
- Minors (under 18) are prohibited from purchasing Aros or initiating payments.
- Server-side rejection occurs at the API route layer before checkout intent generation.
- Client-side restrictions cannot be bypassed by session, device, or API manipulation.
- Parental cards cannot be used through a minor's account; parental purchasing requires an adult account with explicit child recipient assignment.

### 10.2 Dedicated Affirmative Consent
- Unbundled, dedicated consent collected at `/api/payment/consent`.
- Zero pre-ticked checkboxes. Clear disclosure of virtual currency nature and non-refundable status.

### 10.3 Cryptographic API Key Security
- API keys generated via 32-byte cryptographic randomness.
- Only the SHA-256 hash is persisted in the database; raw keys are never stored.

### 10.4 DPDP Act 2023 Compliance
- 20 master legal/privacy policies (`docs/legal/`, `docs/privacy/`).
- 5 machine-readable registers:
  - `DATA_PROCESSING_REGISTER.json` (7 data categories)
  - `COOKIE_INVENTORY.json` (essential vs. optional cookie mapping)
  - `DATA_PROCESSORS.json` (verified cloud processors)
  - `LEGAL_REVIEW_REGISTER.json` (13 statutory review items)
  - `PAYMENT_DATA_PROCESSING_REGISTER.json` (payment data protection)
### 10.5 Ecosystem Future Developments & Announcements Platform
- **Canonical Model (`EcosystemAnnouncementSchema`)**: Strongly typed announcements across 9 types (`PRODUCT`, `FEATURE`, `ECOSYSTEM`, `AROS`, `AI`, `PLATFORM`, `RELEASE`, `COMMUNITY`, `FUTURE`) and 5 lifecycle states (`CURRENT`, `IN_DEVELOPMENT`, `COMING_SOON`, `FUTURE`, `ARCHIVED`).
- **Dynamic Discovery Experiences**:
  - Dedicated Announcements Hub (`/announcements`) with category and status filtering, spotlight cards, and comprehensive modal view.
  - Homepage Ecosystem Stage Rail (`CURRENT → IN DEVELOPMENT → COMING SOON → FUTURE`).
  - Contextual Product Detail integration linking roadmap items directly to autonomous product views.
- **Verified Official Community Feedback Bridge**:
  - Official Instagram channel strictly defined as `https://www.instagram.com/aroh.0s/`.
  - Disclosures enforced across UI and metadata: Community ideas and suggestions only. Strictly disclaims use for passwords, credentials, payment disputes, legal notices, or account recovery.

### 10.6 Future-Only Google Play Points & Billing Integration Architecture
- **Fail-Closed Exploration Status**: Maintained under strict `EXPLORING_FUTURE_INTEGRATION` status. No live conversion rate, redemption flow, checkout UI, or active claims of availability.
- **System Separation**: Google Play Points / Rewards and Google Play Billing / Balance are architecturally treated as distinct external systems; Play Points are never assumed to be directly convertible into Aros unless officially authorized and verified.
- **Statutory Minor Protection Invariant**: Server-side enforcement of `NO_MINOR_PAYMENT_FOR_AROS = true` occurs unconditionally before accepting any Aros top-up, regardless of external Google account settings, family payment methods, or external Play Points eligibility. Google parental controls are never relied upon as AROH's age gate.
### 10.7 Server-Driven UI (SDUI) & Generative UI Architecture
- **Canonical Block Model (`GenerativeUIBlockSchema`)**: Type-safe SDUI blocks across 6 canonical widget types (`aros_transfer_preview`, `telemetry_visualizer`, `product_launchpad`, `enterprise_quota_card`, `announcement_card`, `statutory_consent_gate`).
- **Streaming Ingress Protocol (`/api/ai/chat`)**: Server-Sent Events (`text/event-stream`) delivered via native Web Streams API (`ReadableStream`) combining conversational text deltas, contextual UI block payloads, and W3C `traceparent` tracing headers.
- **D2 Financial Safety Invariant**: Transactional cards (such as token movements) render strictly as **read-only attestation previews**. Direct client balance manipulation is prohibited; executing operations requires affirmative user authorization dispatching signed requests to server settlement routes.
- **Cross-Platform Parity**: The same JSON block contract is consumed by Web (`apps/web/app/ai`) using `@aroh/ads` `Card` primitives and Mobile (`apps/mobile`), guaranteeing consistent rendering without contract divergence.

---

## 11. Technology Stack

| Component | Technology | Rationale |
|---|---|---|
| **Web Hub** | Next.js 16.2.10 (React 19.2.4) | Next.js App Router, React Server Components, Turbopack & Webpack builds, Edge Proxy Middleware. |
| **Mobile Client** | React Native / Expo (`@aroh/mobile`) | Unified cross-platform client shell with biometric security attestation. |
| **Platform SDK** | TypeScript (`@aroh/asdk`) | Strict Zod validation schemas, double-entry wallet ledger, enterprise team wallets, W3C tracing, SSE telemetry. |
| **Design System** | React + Tailwind CSS (`@aroh/ads`) | WCAG 2.1 AA accessible token set, Outfit typography, smooth Framer Motion primitives. |
| **Backend / DB** | Firebase / Firestore + In-Memory Fallback | Robust cloud identity and real-time database with deterministic local fallback for testing and development. |
| **Testing** | Vitest + Custom Test Runners | Proximity-driven unit tests, monorepo regression suites, static audit runners (100% automated). |
| **Build Orchestration** | Turborepo (`turbo`) + npm workspaces | Parallelized monorepo execution with hermetic caching. |

---

## 12. Deployment Architecture & Infrastructure

- **Production URL**: `https://aroh-os.vercel.app`
- **Hosting Provider**: Vercel (Edge Network + Serverless Functions).
- **Vercel Settings**:
  - Connected Git Repo: `Aroh-Open-Source/AROH`
  - Production Branch: `main`
  - Root Directory: `Aroh/apps/web`
- **SEO & AI Discoverability**:
  - Canonical sitemap: `/sitemap.xml`
  - Robots configuration: `/robots.txt`
  - AI Crawler Index: `/llms.txt` and `/llms-full.txt`
  - Structured Data: Schema.org JSON-LD (`Organization`, `WebSite`, `SoftwareApplication`).

---

## 13. Platform Governance & Change Protocol (D3 Contract)

Every change to the platform follows the **Universal Master Execution Pipeline**:
1. Read `VERSION_CONTROLLER.md`.
2. Read `PRODUCT_MASTER.md`.
3. Locate existing code & owner domain.
4. Calculate change manifest & radius (`DIRECT`, `RELATED`, `DEPENDENT`, `SHARED`, `UNRELATED`).
5. Classify version level (`MAJOR`, `SUB-VERSION`, `FUNCTIONAL`, `PATCH`).
6. Implement smallest safe change.
7. Run proximity tests and monorepo regression suite (`npm test`).
8. Verify production build (`npm run build`).
9. Update version metadata in code & system exports.
10. Update `VERSION_CONTROLLER.md` and `PRODUCT_MASTER.md`.
11. Report completion using structured format.

### Version Authority Delegation
- **`A` (Major Version)**: **RESTRICTED — User Consent Required**. The agent MUST NEVER create or increment a new major version (`A+1.xx.xx.x`) without the user's prior, explicit consent.
- **`BC` (Sub-Version / Release Line)**: **Partial Authority** (used for meaningful release stages or phase milestones).
- **`DE` (Functional Change) & `F` (Patch / Bug Fix)**: **Full Agent Authority** to increment, manage, and verify.

---

## 14. Human Readability & Navigation Quick-Reference

For new engineers joining the project:
- **Where does a page live?** `Aroh/apps/web/app/<route>/page.tsx`.
- **Where does domain business logic live?** `Aroh/packages/asdk/src/services/<domain>.ts`.
- **Where are data models and contracts?** `Aroh/packages/asdk/src/schemas/<domain>.ts`.
- **Where are UI primitives?** `Aroh/packages/ads/src/`.
- **Where is the mobile application?** `Aroh/apps/mobile/`.
- **Where are tests?** In `tests/` adjacent to the package or app being tested.
- **Where are product manifests?** `Aroh/manifests/*.manifest.json`.
- **Where is version history and governance?** `VERSION_CONTROLLER.md`.
- **Where is the product and architecture specification?** This file (`PRODUCT_MASTER.md`).
