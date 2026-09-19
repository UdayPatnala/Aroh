# AROH Platform: Version History & Living Architecture Control System

> **Source of Truth**: This document represents the authoritative, permanent version timeline, Git recovery index, and living architectural memory of the **AROH Open Source Platform**. It is modeled after the OmniStream architecture intelligence standard and continuously synchronized with codebase verification.

---

## 1. Quick Navigation Index

| Version | Date | Type | Quick Summary | Git Tag | Commit |
|---|---|:---:|---|:---:|:---:|
| Version | Date | Type | Quick Summary | Git Tag | Commit |
|---|---|:---:|---|:---:|:---:|
| **v2.3.0** | 2026-09-19 | `MINOR` | **Wave 2 Milestone 3.1: Developer API Key Vault**: Implemented cryptographic HMAC-SHA256 API key generation, zero-plaintext storage (SHA-256 hash only), rate limit tier gating (Basic 60 rpm, Pro 300 rpm, Enterprise 1200 rpm), Next.js API routes (`/api/developer/keys`), and dashboard key vault UI (`/dashboard/keys`). Expanded test coverage with 10 new Vitest assertions; 33/33 routes compiled. | `v2.3.0` | [`HEAD`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v2.2.0** | 2026-09-11 | `MINOR` | **SEO, AI Discoverability, Structured Data, Production Foundation & Execution History Protocol**: Established permanent Execution History ledger (`docs/EXECUTION_HISTORY.md`), created `/llms.txt` and `/llms-full.txt`, added Schema.org JSON-LD structured data, strengthened root & page metadata across all routes, expanded sitemap to 25 canonical routes, hardened robots.txt crawler directives, implemented custom 404 (`not-found.tsx`) and error boundary (`error.tsx`), and expanded test suite to 423 passing assertions. | `v2.2.0` | [`e752edb`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v2.1.0** | 2026-09-11 | `MINOR` | **AROH Privacy, Consent, Legal Terms, Cookies & DPDP Compliance**: Implemented full privacy & compliance architecture under DPDP Act 2023 & DPDP Rules 2025. Codified 20 master legal/privacy documents, 4 machine-readable registers, ASDK consent & rights engine, universal cookie banner & footer, 10 public routes, 5 API routes, and expanded test suite to 367 passing assertions. | `v2.1.0` | [`9d4dc71`](file:///d:/PROJECT/AROH%20Open%20Source) |

---

## 2. Version Entries

### v2.3.0
- **Date**: 2026-09-19
- **Type**: `MINOR` (Developer API Key Vault — Milestone 3.1)
- **Previous Version**: `v2.2.0`

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
