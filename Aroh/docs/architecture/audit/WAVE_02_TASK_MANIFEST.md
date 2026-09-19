# AROH Platform: Canonical Wave 2 Task Manifest

> **Manifest Version**: `1.0.0`
> **Wave Identifier**: `WAVE_02`
> **Phase**: `Phase 3.0 / Phase 3.5: Developer Portal & External Service Federation`
> **Governance Authority**: `AROH_LIVING_ARCHITECTURE_INTELLIGENCE.md`, `STAGE_20_HANDOFF.md`, `D1`, `D2`, `D3`
> **Timestamp**: `2026-09-10T11:55:00+05:30`
> **Wave 1 Verified Starting Commit**: `869a69d85c21a39145dfa20363eb2793c065e9e0`
> **Canonical Remote**: `https://github.com/Aroh-Open-Source/AROH` (`origin/main`)
> **Canonical Branch**: `main`
> **Vercel Deployment**: `aroh-os.vercel.app` (connected to `Aroh-Open-Source/AROH/main`)

---

## 1. Wave 1 Baseline (Immutable Starting Point)

| Invariant | Verified Value |
|---|---|
| Starting Commit | `869a69d85c21a39145dfa20363eb2793c065e9e0` |
| Automated Tests | **239 / 239 passing across 8 suites** |
| Production Build | **14 routes, Turbopack, clean** |
| `Products/` Boundary | **0 file writes/mutations** |
| Working Tree | **100% clean** |
| Canonical Remote Parity | `HEAD == origin/main` |

---

## 2. Authoritative Task Sequence Table

| # | Task ID | Title | Phase | Status | Completion SHA | Validation | Products/ | Remote Parity |
|---|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | `WAVE-02-TASK-01` | Developer API Key Vault — Schema, Service & Dashboard Route | 3.0 / M3.1 | `COMPLETED_VERIFIED` | `v2.3.0` | `10/10 PASS, 33 routes` | `0 WRITES (INVIOLATE)` | `VERIFIED` |
| 2 | `WAVE-02-TASK-02` | Asynchronous Webhook Clearance Engine | 3.0 / M3.2 | `READY_FOR_EXECUTION` | `PENDING` | `NOT_RUN` | `NOT_VERIFIED` | `NOT_VERIFIED` |
| 3 | `WAVE-02-TASK-03` | Fiat-to-Aros Settlement On-Ramp (Stripe Checkout) | 3.0 / M3.3 | `NOT_STARTED` | `PENDING` | `NOT_RUN` | `NOT_VERIFIED` | `NOT_VERIFIED` |
| 4 | `WAVE-02-TASK-04` | W3C Distributed Tracing — `traceparent` Propagation | 3.5 / M3.4 | `NOT_STARTED` | `PENDING` | `NOT_RUN` | `NOT_VERIFIED` | `NOT_VERIFIED` |
| 5 | `WAVE-02-TASK-05` | Real-Time Operational Telemetry Broker (WebSocket Metrics) | 3.5 / M3.5 | `NOT_STARTED` | `PENDING` | `NOT_RUN` | `NOT_VERIFIED` | `NOT_VERIFIED` |

---

## 3. Authoritative Source Mapping

All Wave 2 tasks are derived **exclusively** from the following authoritative AROH documentation — no tasks have been invented:

| Task ID | Authoritative Source | Section |
|---|---|---|
| `WAVE-02-TASK-01` | `AROH_LIVING_ARCHITECTURE_INTELLIGENCE.md` | Section 10, Phase 3.0, **Milestone 3.1** |
| `WAVE-02-TASK-02` | `AROH_LIVING_ARCHITECTURE_INTELLIGENCE.md` | Section 10, Phase 3.0, **Milestone 3.2** |
| `WAVE-02-TASK-03` | `AROH_LIVING_ARCHITECTURE_INTELLIGENCE.md` | Section 10, Phase 3.0, **Milestone 3.3** |
| `WAVE-02-TASK-04` | `AROH_LIVING_ARCHITECTURE_INTELLIGENCE.md` | Section 10, Phase 3.5, **Milestone 3.4** |
| `WAVE-02-TASK-05` | `AROH_LIVING_ARCHITECTURE_INTELLIGENCE.md` | Section 10, Phase 3.5, **Milestone 3.5** |

Cross-referenced with:
- `STAGE_20_HANDOFF.md` — Wave 2/3/4 execution sequence confirmation
- `D2_EXECUTION_AND_DATA_SYSTEM.md` — Security, Idempotency, Event processing, API contracts
- `D3_GOVERNANCE_AND_EVOLUTION.md` — Phase governance, Definition of Done
- `ADAPTER_CONTRACT_SPECIFICATION.md` — Boundary protection

---

## 4. Detailed Task Definitions

### WAVE-02-TASK-01: Developer API Key Vault

- **Sequence**: 1 — Foundation for all developer integration
- **Phase**: 3.0, Milestone 3.1
- **Objective**: Implement cryptographic HMAC-SHA256 API key generation, storage (hash-only, never raw), and management. Keys use prefix `aroh_live_` (production) or `aroh_test_` (sandbox). Tier-gated rate limits: Basic 60 rpm, Pro 300 rpm, Enterprise 1200 rpm.
- **Allowed Scope**: `packages/asdk/src/schemas/api-key.ts`, `packages/asdk/src/services/api-key.ts`, `apps/web/app/dashboard/keys/page.tsx`, `apps/web/app/api/developer/keys/route.ts`, `apps/web/app/api/developer/keys/[keyId]/route.ts`, new test file, audit handoffs.
- **Prohibited Scope**: `Products/` files (zero writes), raw key storage, client-side key generation.
- **Security**: Store SHA-256 hash only; raw key shown exactly once on creation; HTTPS-only; user-scoped authorization.
- **Validation**: `npm test` (239+ passing), targeted `vitest run packages/asdk/tests/api-key.test.ts`, `npm run build`.
- **Rollback Checkpoint**: `git tag WAVE-02-TASK-01-START`
- **Commit**: `feat(developer): implement API key vault schema, service, and dashboard route [Wave 2 Task 1]`

---

### WAVE-02-TASK-02: Asynchronous Webhook Clearance Engine

- **Sequence**: 2 — Requires TASK-01 (API key identity layer)
- **Phase**: 3.0, Milestone 3.2
- **Objective**: Implement webhook endpoint registration, HMAC-SHA256 event signing (`x-aroh-signature` header), and event dispatch with exponential backoff retry (3 attempts, delay = 2^n × 500ms). Four initial event types: `aros.credited`, `aros.debited`, `membership.upgraded`, `challenge.completed`.
- **Allowed Scope**: `packages/asdk/src/schemas/webhook.ts`, `packages/asdk/src/services/webhook.ts`, `apps/web/app/api/developer/webhooks/route.ts`, `apps/web/app/api/developer/webhooks/[webhookId]/route.ts`, new test file, audit handoffs.
- **Prohibited Scope**: `Products/` files, real outbound HTTP calls in tests, external queue systems.
- **Security**: HTTPS-only webhook URLs; signed delivery headers; user-scoped registration; events must not contain secrets.
- **Validation**: `npm test` (all passing), targeted vitest, `npm run build`.
- **Rollback Checkpoint**: `git tag WAVE-02-TASK-02-START`
- **Commit**: `feat(developer): implement async webhook clearance engine [Wave 2 Task 2]`

---

### WAVE-02-TASK-03: Fiat-to-Aros Settlement On-Ramp

- **Sequence**: 3 — Requires TASK-01 and TASK-02
- **Phase**: 3.0, Milestone 3.3
- **Objective**: Implement Stripe Checkout session builder via Next.js server actions. Conversion: $1.00 USD = 100 Aros. Settlement must use the immutable Aros ledger (no direct balance writes). Stripe webhook events processed via D2 Aros Execution flow.
- **Allowed Scope**: `packages/asdk/src/schemas/payment.ts`, `packages/asdk/src/services/payment.ts`, `apps/web/app/api/payment/checkout/route.ts`, `apps/web/app/api/payment/webhook/route.ts`, `apps/web/app/dashboard/purchase/page.tsx`, new test file, audit handoffs.
- **Prohibited Scope**: `Products/` files, direct balance writes, Stripe key hardcoding, real Stripe calls in tests.
- **External Dependency**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` env vars required. If absent → classified `EXTERNAL_DEPENDENCY_MISSING` → BLOCKED handoff created, Task 04 executed independently.
- **Security**: Server-side only Stripe secrets; idempotency via Stripe charge ID deduplication; D2 Aros Execution flow enforced.
- **Validation**: `npm test` (all passing), targeted vitest, `npm run build`.
- **Rollback Checkpoint**: `git tag WAVE-02-TASK-03-START`
- **Commit**: `feat(payment): implement fiat-to-aros settlement on-ramp via Stripe Checkout [Wave 2 Task 3]`

---

### WAVE-02-TASK-04: W3C Distributed Tracing — traceparent Propagation

- **Sequence**: 4 — Independent of TASK-03. Requires TASK-01 and TASK-02.
- **Phase**: 3.5, Milestone 3.4
- **Objective**: Propagate W3C `traceparent` headers across all AROH Next.js API routes and spoke adapter integrations. Implement lightweight tracing utility in `@aroh/asdk`. Middleware extracts or generates `traceparent` on ingress and attaches to all outbound requests.
- **Allowed Scope**: `packages/asdk/src/tracing/index.ts`, `apps/web/middleware.ts`, new test file, audit handoffs.
- **Prohibited Scope**: `Products/` files, external observability vendor SDKs, modifying core business logic.
- **Security**: Malformed `traceparent` values must be replaced (not propagated); trace IDs must not carry PII.
- **Validation**: `npm test` (all passing), targeted vitest, `npm run build`.
- **Rollback Checkpoint**: `git tag WAVE-02-TASK-04-START`
- **Commit**: `feat(observability): implement W3C traceparent propagation across API routes [Wave 2 Task 4]`

---

### WAVE-02-TASK-05: Real-Time Operational Telemetry Broker (WebSocket)

- **Sequence**: 5 — Requires TASK-01, TASK-02, and TASK-04
- **Phase**: 3.5, Milestone 3.5
- **Objective**: Implement WebSocket-based real-time operational metrics stream in `/admin`, displaying settlement latency and active user journeys. Metrics broker consumes events from the Aros ledger and Webhook Clearance Engine dispatcher, correlated via W3C tracing from TASK-04.
- **Allowed Scope**: `packages/asdk/src/telemetry/index.ts`, `apps/web/app/api/telemetry/stream/route.ts`, extend `apps/web/app/admin/page.tsx`, new test file, audit handoffs.
- **Prohibited Scope**: `Products/` files, external real-time services (Pusher, Ably), modifying core ledger logic, starting Phase 4.
- **Security**: WebSocket endpoint requires authenticated session; admin/operator role enforced; no user PII in metrics stream.
- **Validation**: `npm test` (all passing), targeted vitest, `npm run build`.
- **Rollback Checkpoint**: `git tag WAVE-02-TASK-05-START`
- **Commit**: `feat(telemetry): implement real-time WebSocket operational metrics broker [Wave 2 Task 5]`

---

## 5. Dependency Graph

```
WAVE-02-TASK-01 (API Key Vault)
        │
        ├──► WAVE-02-TASK-02 (Webhook Engine)
        │           │
        │           ├──► WAVE-02-TASK-03 (Stripe On-Ramp)  ← External dep: STRIPE_*
        │           │
        │           └──► WAVE-02-TASK-04 (W3C Tracing)  ← Independent of Task 03
        │                       │
        │                       └──► WAVE-02-TASK-05 (WebSocket Telemetry)
        │
        └── (all tasks require Task 01 as identity foundation)
```

---

## 6. Completion Summary

- **Total Approved Tasks**: 5
- **Completed**: 0
- **Blocked**: 0
- **Requires Review**: 0
- **Not Started**: 5

---

## 7. Wave 2 Stop Boundary

After `WAVE-02-TASK-05` is committed, pushed, and verified:
1. Run complete `npm test`
2. Run complete `npm run build`
3. Verify `git status` clean
4. Verify `Products/` unchanged/inviolate
5. Verify `HEAD == origin/main`
6. Create `WAVE_02_FINAL_HANDOFF.md` and `.json`
7. **STOP. Do not begin Phase 4 / Wave 3.**
