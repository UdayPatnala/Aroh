# VERSION CONTROLLER & GOVERNANCE LEDGER

> **Authoritative Historical & Governance Master**: This document is the single source of truth for version history, change tracking, git commits, migration records, and release governance across the **AROH Open Source Platform**.
> 
> **Current Platform Version**: `2.05.03.0`  
> **Authoritative Version Format**: `A.BC.DE.F`  
> **Current Status**: `VERIFIED`  
> **Associated Product Master**: [`PRODUCT_MASTER.md`](file:///d:/PROJECT/AROH%20Open%20Source/PRODUCT_MASTER.md)

---

## 1. Authoritative Version Format: `A.BC.DE.F`

All project changes and releases strictly follow the 4-tier format:

`A.BC.DE.F`

Where:
* `A` = **Major Version** (0–∞) — Materially alters architecture, identity, or breaking multi-tenant contracts.
* `BC` = **Sub-Version / Release Line** (01–99, `00` reserved for reset) — Meaningful release stage or ecosystem milestone.
* `DE` = **Functional Change** (01–99, `00` reserved for reset) — New capability, domain system, service, or API endpoint.
* `F` = **Minor Fix / Bug / Patch** (0–9) — Bug fixes, styling, small validation, or documentation corrections.

### Reset Hierarchy
* Major Change: `A+1.00.00.0` (REQUIRES EXPLICIT USER CONSENT)
* Sub-Version Change: `A.BC+1.00.0`
* Functional Change: `A.BC.DE+1.0`
* Minor / Patch Change: `A.BC.DE.F+1`

### Version Authority Delegation
* **`A` (Major Version)**: **RESTRICTED — User Consent Required**. The agent MUST NEVER create or increment a new major version (`A+1.xx.xx.x`) without the user's prior, explicit consent.
* **`BC` (Sub-Version / Release Line)**: **Partial Authority** (used for meaningful release stages or phase milestones).
* **`DE` (Functional Change) & `F` (Patch / Bug Fix)**: **Full Agent Authority** to increment, manage, and verify.

---

## 2. Complete Version History Ledger

| Version | Previous | Level | Commit | Date | Summary of Release |
|---|---|---|---|---|---|
| **`2.05.03.0`** | `2.05.02.0` | `FUNCTIONAL` | `d59656c` | 2026-10-10 | **Developer AI Studio, Generative UI Engine & Mobile Contract Parity**: Implemented layout primitive family (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) in `@aroh/ads`. Established typed Server-Driven UI (SDUI) contracts (`GenerativeUIBlockSchema`, `AIServerStreamEventSchema`) in `@aroh/asdk` across 6 canonical widget types. Implemented streaming Server-Sent Events ingress at `/api/ai/chat` with W3C distributed tracing (`traceparent`), multi-provider failover, and contextual SDUI card streaming. Upgraded `/ai` into the Developer AI Studio with model selector, interactive prompt console, and live Generative UI renderer adhering to the D2 invariant (zero direct client balance mutation). Harmonized mobile shell (`@aroh/mobile`): enforced SpeDex 0-CTA Future Launch invariant in `ExploreScreen.tsx` using `resolveShowcaseHierarchy()`, mounted `AnnouncementsScreen.tsx`, and expanded deep link routes. |
| **`2.05.02.0`** | `2.05.01.0` | `FUNCTIONAL` | `113595e` | 2026-10-04 | **Ecosystem Future Developments & Announcements Platform**: Architectural implementation of typed ecosystem announcement engine (`@aroh/asdk/src/schemas/announcement.ts`, `registry/announcements.ts`), dedicated discovery hub (`/announcements`), homepage dynamic development stage rail (`CURRENT → IN DEVELOPMENT → COMING SOON → FUTURE`), contextual product detail announcement integration, and verified official community feedback bridge strictly pointing to verified Instagram (`https://www.instagram.com/aroh.0s/`). Implemented fail-closed future Google Play Billing & Google Play Points/Rewards top-up architecture (`services/google-play-points.ts`) enforcing server-side `NO_MINOR_PAYMENT_FOR_AROS = true`, strict exploration status, zero live conversion/redemption UI, and ledger primacy invariant. |
| **`2.05.01.0`** | `2.05.00.0` | `FUNCTIONAL` | `c538eb3` | 2026-09-30 | **Flagship Product Showcase Hierarchy & SpeDex Future-Launch Architecture**: Implemented canonical showcase hierarchy resolver (`showcase-priority.ts`) enforcing OmniStream as Star / Primary Flagship, JavaPath Pro as Secondary Featured, Music Mirror as Tertiary Featured, and SpeDex as Future Launch. Reclassified SpeDex across UI/schemas/tests without purchase/install CTAs, established automated promotion contract to Star Product upon verified release (`isSpedexReleased`), upgraded Explorer and Products console, and integrated Homepage featured showcase. |
| **`2.05.00.0`** | `2.04.00.0` | `SUB-VERSION` | `HEAD` | 2026-09-27 | **Phase 5 Federated Multi-Tenant Enterprise Engine**: Team Wallets, member monthly spending quotas, role-based debit authorizations, SAML 2.0 & SCIM 2.0 Directory Federation, and Organization Web Dashboard. Universal project file consolidation under two-master governance rule (`PRODUCT_MASTER.md` & `VERSION_CONTROLLER.md`). |
| **`2.04.00.0`** | `2.03.08.0` | `SUB-VERSION` | `HEAD` | 2026-09-21 | **Phase 4 Mobile Expansion**: Unified Cross-Platform Shell (`@aroh/mobile`), universal storage abstraction (`IPlatformStorage`), deterministic `aroh://` deep linking, and mobile security attestation. |
| **`2.03.08.0`** | `2.03.07.0` | `FUNCTIONAL` | `db8cebd` | 2026-09-20 | **Universal Modular Architecture & Change-Isolation Governance System**: Established 76-rule system of boundaries, domain/feature ownership, locality, and change isolation. |
| **`2.03.07.0`** | `2.03.06.0` | `FUNCTIONAL` | `d37e3e2` | 2026-09-20 | **Ecosystem Polish & Developer API Explorer**: Cryptographic Transaction Receipts (SHA-256), formal Grievance/Dispute Redressal interface, and interactive Developer API Explorer in Developer Tools. |
| **`2.03.06.0`** | `2.03.05.0` | `FUNCTIONAL` | `629fb18` | 2026-09-20 | **Aros Age, Consent & Purchase Safety Hardening**: Enforced mandatory `NO_MINOR_PAYMENT_FOR_AROS = TRUE` policy server-side, dedicated unbundled affirmative consent, pluggable payment provider abstraction, and statutory registers. |
| **`2.03.05.0`** | `2.03.04.0` | `FUNCTIONAL` | `HEAD` | 2026-09-19 | **Wave 2 Milestone 3.5: Real-Time Telemetry Broker**: Circular event ring buffer (500 events), SSE metrics stream (`/api/telemetry/stream`), and Admin Telemetry Panel. |
| **`2.03.04.0`** | `2.03.03.0` | `FUNCTIONAL` | `HEAD` | 2026-09-19 | **Wave 2 Milestone 3.4: W3C Distributed Tracing**: Web Crypto API-based `traceparent` engine (`00-{traceId}-{spanId}-{flags}`) and Next.js Edge Proxy Middleware. |
| **`2.03.03.0`** | `2.03.02.0` | `FUNCTIONAL` | `HEAD` | 2026-09-19 | **Wave 2 Milestone 3.3: Fiat-to-Aros Settlement On-Ramp**: Stripe Checkout session builder, fixed exchange rate conversion ($1.00 = 100 Aros), idempotent settlement engine, and dashboard purchase interface (`/dashboard/purchase`). |
| **`2.03.02.0`** | `2.03.01.1` | `FUNCTIONAL` | `HEAD` | 2026-09-19 | **Wave 2 Milestone 3.2: Asynchronous Webhook Clearance Engine**: HMAC-SHA256 signing (`x-aroh-signature`), exponential backoff retry clearance dispatcher ($2^n \times 500\text{ms}$), and Next.js developer webhook routes. |
| **`2.03.01.1`** | `2.03.01.0` | `PATCH` | `HEAD` | 2026-09-19 | **Dynamic Version Governance & Unobtrusive UI Display**: Reconstructed pre-v2 history, centralized `@aroh/asdk` version governance exports, mounted unobtrusive floating bottom-right version badge with interactive popover. |
| **`2.03.01.0`** | `2.02.00.0` | `FUNCTIONAL` | `97b8557` | 2026-09-19 | **Wave 2 Milestone 3.1: Developer API Key Vault**: HMAC-SHA256 key generation, SHA-256 hash-only storage (zero plaintext), 3 rate tiers, Next.js API routes (`/api/developer/keys`), and dashboard key vault UI. |
| **`2.02.00.0`** | `2.01.00.0` | `SUB-VERSION` | `e752edb` | 2026-09-11 | **SEO, AI Discoverability & Production Foundation**: Created `/llms.txt`, Schema.org JSON-LD structured data, strengthened metadata across all routes, 25-route sitemap, hardened robots.txt, custom 404 & error boundary. |
| **`2.01.00.0`** | `2.00.05.0` | `SUB-VERSION` | `9d4dc71` | 2026-09-11 | **DPDP Act 2023 & DPDP Rules 2025 Privacy Architecture**: 20 master legal/privacy policies, 5 machine-readable registers, ASDK consent & rights engine, universal cookie banner, 10 public routes, 5 API routes. |
| **`2.00.05.0`** | `2.00.04.0` | `PATCH` | `ee50af8` | 2026-09-10 | Audited manifest target path policy and aligned submodule pointers for Wave 1 baseline. |
| **`2.00.04.0`** | `2.00.03.0` | `FUNCTIONAL` | `2f740f7` | 2026-09-10 | Defined spoke adapter interface contracts and fail-closed Products boundary protection. |
| **`2.00.03.0`** | `2.00.02.0` | `PATCH` | `8ce4df0` | 2026-09-10 | Harmonized working tree baseline and aligned OmniStream submodule pointer. |
| **`2.00.02.0`** | `2.00.01.0` | `FUNCTIONAL` | `2f43b62` | 2026-09-10 | Established canonical product showcase & zero-fabrication registry in ASDK. |
| **`2.00.01.0`** | `2.00.00.0` | `FUNCTIONAL` | `5a8d7ee` | 2026-09-10 | Implemented safe product-change synchronization CLI engine (D1/D2/D3 governance). |
| **`2.00.00.0`** | `1.05.00.0` | `MAJOR` | `0d64b13` | 2026-09-10 | Master monorepo restructuring & ecosystem decoupling into Aroh hub and Products spokes. |
| **`1.05.00.0`** | `1.00.00.0` | `SUB-VERSION` | `bf9cee8^` | 2026-07-20 | Phase 1 MVP Platform Hub & Aros Economy: Aros token wallet, AI portal, product showcase, and mock services. |
| **`1.00.00.0`** | — | `MAJOR` | `66e3867^` | 2026-06-15 | Phase 0 Foundation Workspace: Initial monorepo foundation, Next.js architecture, and core UI components. |

---

## 3. Comprehensive Version Release Entries

### 2.05.00.0
- **Date**: 2026-09-27
- **Change Level**: `SUB-VERSION` (`BC=05`, `DE=00`, `F=0`)
- **Previous Version**: `2.04.00.0`
- **Scope & Features**:
  1. **Phase 5 Multi-Tenant Enterprise Engine**:
     - `TeamWalletService` (`@aroh/asdk/services/team-wallet.ts`): Organization creation, team-pooled Aros wallets with double-entry ledgers, monthly member debit quotas, role-based debit authorizations (`owner`, `admin`, `member`), and fail-closed minor funding blocking.
     - `EnterpriseDirectoryService` (`@aroh/asdk/services/saml-scim.ts`): SAML 2.0 Identity Provider metadata validation, assertion verification, and SCIM 2.0 user provisioning/deprovisioning engine.
     - Enterprise Zod Schemas (`@aroh/asdk/schemas/enterprise.ts`): `OrganizationSchema`, `OrganizationMemberSchema`, `TeamWalletSchema`, `TeamWalletTransactionSchema`, `SamlConfigSchema`, `ScimUserSchema`.
     - Proximity Test Suite (`@aroh/asdk/tests/enterprise.test.ts`): 10 Vitest assertions verifying organization lifecycle, quota enforcement, debit limits, and SAML/SCIM flows.
  2. **Enterprise Organization & Team Wallet Dashboard**:
     - Responsive full-screen dashboard (`apps/web/app/dashboard/organization/page.tsx`) with real-time team balance, member roster management, modal member invitation with quota allocation, immutable team audit log, and SAML/SCIM connection status indicator.
     - Mounted direct navigation from `/dashboard` header and overview quick-action callout.
  3. **Universal Project File Consolidation**:
     - Enforced strict two-Markdown-file governance rule (`PRODUCT_MASTER.md` and `VERSION_CONTROLLER.md`).
     - Consolidated all architectural, behavioral, and domain knowledge from `AROH.md`, `ARCHITECTURE.md`, `D1`, `D2`, `D3`, and `ADAPTER_CONTRACT_SPECIFICATION.md` into `PRODUCT_MASTER.md`.
     - Safely eliminated over 50 intermediate AI agent audit handoff files while permanently preserving all verified milestones in this ledger.
     - Preserved all operational statutory compliance policies and registers (`docs/legal/`, `docs/privacy/`, `manifests/`).
  4. **Runtime & Build Modernization**:
     - Hardened universal storage in `@aroh/asdk` against Node 22 `--localstorage-file` warnings.
     - Refactored `mockDocDatabase` into a clean modular module (`app/ai/doc-database.ts`), resolving Next.js 16 page export type check constraints.
     - Successfully compiled all 43 Next.js routes with zero errors.

### 2.04.00.0
- **Date**: 2026-09-21
- **Change Level**: `SUB-VERSION` (`BC=04`, `DE=00`, `F=0`)
- **Previous Version**: `2.03.08.0`
- **Scope & Features**:
  - Initialized `@aroh/mobile` client shell (`apps/mobile`) with tab-based navigation across 5 core views: Explore, Wallet, AI Hub, Dev Keys, Privacy.
  - Defined `IPlatformStorage` interface supporting Web, Node/SSR in-memory, and React Native / Expo secure drivers.
  - Implemented `parseArohDeepLink` (`aroh://` scheme) and device security attestation state machine.

### 2.03.08.0
- **Date**: 2026-09-20
- **Change Level**: `FUNCTIONAL` (`DE=08`)
- **Previous Version**: `2.03.07.0`
- **Scope & Features**:
  - Codified authoritative modular architecture specification (`ARCHITECTURE.md`) with 76 rules.
  - Formulated 5-tier change radius protocol (`DIRECT`, `RELATED`, `DEPENDENT`, `SHARED`, `UNRELATED`).
  - Mapped 9 explicit platform domains and single sources of truth.

### 2.03.07.0
- **Date**: 2026-09-20
- **Change Level**: `FUNCTIONAL` (`DE=07`)
- **Previous Version**: `2.03.06.0`
- **Scope & Features**:
  - Implemented cryptographic transaction receipts with SHA-256 verification hashes.
  - Built user-facing dispute submission & grievance redressal interface.
  - Added interactive Developer API Explorer to API key management console.

### 2.03.06.0
- **Date**: 2026-09-20
- **Change Level**: `FUNCTIONAL` (`DE=06`)
- **Previous Version**: `2.03.05.0`
- **Scope & Features**:
  - Mandatory server-side minor payment restriction (`NO_MINOR_PAYMENT_FOR_AROS = TRUE`).
  - Dedicated unbundled affirmative consent (`/api/payment/consent`).
  - Provider-agnostic payment abstraction (`PaymentProvider`).
  - Append-only ledger double-spending defense via composite idempotency keys.
  - Statutory registers: `PAYMENT_DATA_PROCESSING_REGISTER.json`, `LEGAL_REVIEW_REGISTER.json` (LR-009 to LR-013).

---

## 4. Governance & Anti-Destruction Rules

1. **Two-Master Governance Invariant**:
   - `PRODUCT_MASTER.md` owns all product, architectural, domain, and technical knowledge.
   - `VERSION_CONTROLLER.md` owns all versioning, release history, git commits, and governance rules.
   - No redundant architecture or history Markdown files may be created.
2. **`Products/` Boundary Protection**:
   - The `Products/` directory is strictly inviolable (0 mutations allowed).
3. **No Direct Balance Overwriting**:
   - Financial balances are calculated at runtime from immutable ledger transactions: $Balance = \sum Credits - \sum Debits$.
4. **Zero Fabrication**:
   - Every capability, link, and status must be verified against actual code or live deployments.
