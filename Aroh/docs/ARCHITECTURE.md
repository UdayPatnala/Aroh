# AROH Platform: Architecture & System Design Specification

> **Status**: Living Architectural Specification  
> **Platform Version**: `v2.2.0`  
> **Governance Authority**: `Universal Product Reverse-Engineering + Engineering System`, `GEMINI.md`, `D1`, `D2`, `D3`  
> **Canonical Root**: `d:\PROJECT\AROH Open Source`  
> **Golden Invariant**: *Never let the current codebase overwrite the project's historical product intent. Reconcile the code with the intent.*

---

## 1. System Overview & Decoupled Topology

The **AROH Open Source Platform** is an orchestrated multi-product ecosystem and decentralized application runtime built to eliminate fragmentation across consumer and enterprise applications. It operates on a **Decoupled Hub-and-Spoke Architecture**:

```text
                                  AROH ECOSYSTEM TOPOLOGY
                                             │
             ┌───────────────────────────────┴───────────────────────────────┐
             ▼                                                               ▼
   CANONICAL PLATFORM HUB                                           INDEPENDENT SPOKES
      [Aroh/apps/web]                                                   [Products/]
   ├── / (Landing & Dock)                                            ├── OmniStream (v1.8.5)
   ├── /dashboard (Aros Wallet & Keys)                               │   ├── U-Tube Discovery Engine
   ├── /explore (Showcase & Provenance)                              │   ├── CineMorph 3D Theater
   ├── /explore/[productId] (Product Specs)                          │   └── OMS Edge Intelligence
   ├── /cms (Announcement Feeds)                                     └── Spedex (v2.1.0)
   ├── /admin (Aros Metrics Engine)                                      ├── Spring Boot 3 Engine
   ├── /ai (AI Developer Portal)                                         ├── React Financial Dashboard
   ├── /privacy & /terms (DPDP Compliance)                               └── React Native Mobile Client
   └── /llms.txt (AI Discoverability)
```

---

## 2. The Three Realities Architecture

Every engineering cycle strictly separates and reconciles three distinct realities:

```text
1. WHAT WE INTENDED
   ↓
   motive / vision / conversations / decisions
   (Conversations tell what was wanted)

2. WHAT WE ACTUALLY BUILT
   ↓
   reverse engineering / code / files / runtime / deployment / git
   (Reverse engineering tells what exists; Git tells how it got there)

3. WHAT WE SHOULD DO NEXT
   ↓
   gap analysis / correction / simplification / implementation
   (The comparison tells what needs to happen next)
```

---

## 3. Four-Source Project Memory System

Cross-check all four sources before making decisions:

```text
SOURCE 1 — CONVERSATIONS & DISCUSSIONS
Previous user requirements, product vision, motivation, agreed features, rejected approaches.

        ↓

SOURCE 2 — PERSISTENT ENGINEERING MEMORY
Aroh/docs/VERSION_HISTORY.md
Aroh/docs/EXECUTION_HISTORY.md
Aroh/docs/PROJECT_STATUS.md
Aroh/docs/ARCHITECTURE.md
Known issues, lessons, warnings, decisions.

        ↓

SOURCE 3 — COMPLETE GIT HISTORY
Commits, branches, tags, blame, uncommitted changes.

        ↓

SOURCE 4 — CURRENT IMPLEMENTATION & RUNTIME
Codebase, dependencies, environment, build, runtime, deployment (Vercel/Render).
```

---

## 4. Core Platform Packages

### 4.1 Platform Hub (`Aroh/apps/web`)
- **Framework**: Next.js 16 with App Router, Turbopack, React Server Components.
- **Routing**: 31 compiled routes spanning marketing landing, user dashboard, product discovery, legal compliance, and AI discovery.
- **Discovery & SEO**: Schema.org JSON-LD structured data, dynamic `sitemap.ts`, crawler-optimized `robots.txt`, and standard `/llms.txt` + `/llms-full.txt`.

### 4.2 Core SDK (`@aroh/asdk`)
- **Location**: `Aroh/packages/asdk`
- **Identity & SSO**: Decentralized Firebase Auth adapter with cross-tab BroadcastChannel session synchronization and in-memory mock fallback for offline test suites.
- **Aros Financial Ledger**: Mathematically verified double-entry ledger calculation ($Balance = \sum Credits - \sum Debits$). Direct balance writes are architecturally prohibited.
- **Product Registry**: Authoritative, Zod-validated `CANONICAL_PRODUCT_REGISTRY` tracking all ecosystem products with zero synthetic claims.
- **Privacy & Consent Engine**: DPDP Act 2023 & DPDP Rules 2025 compliant consent state machine, granular category management, rights request dispatch, and grievance escalation.

### 4.3 Design System (`@aroh/ads`)
- **Location**: `Aroh/packages/ads`
- **Design Language**: Light-first editorial aesthetic (`#F7F5F0` canvas), subtle borders (`#E5E0D8`), intentional contrast ratios, and complete avoidance of generic "vibe-code" visual noise.
- **Accessibility**: 100% WCAG 2.1 AA compliant color contrast, visible focus rings, reduced-motion media queries, and semantic DOM structures.

---

## 5. Non-Negotiable Platform Invariants

1. **Reverse-Engineer Before Interpreting Next Work**:
   - Answer *"What has actually been built so far?"* before deciding *"What should we build next?"*
2. **Reconciliation over Overwriting**:
   - The code is only one representation of the product. When code conflicts with vision, reconcile the code with the intent.
3. **`Products/` Boundary Isolation**:
   - `Products/` contains autonomous product codebases. Zero mutations allowed during platform tasks.
4. **Zero Fabrication**:
   - Every product URL, statistic, test assertion, and capability claim must be verified against live deployments or canonical source repositories.
5. **Append-Only History Preservation**:
   - Update `Aroh/docs/EXECUTION_HISTORY.md` and `Aroh/docs/VERSION_HISTORY.md` truthfully after every task.
