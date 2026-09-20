# UNIVERSAL VERSION CONTROLLER & MODULAR ARCHITECTURE GOVERNANCE — AROH OPEN SOURCE

> **Authoritative Workspace Rule**: This repository operates strictly under the **Universal Version Controller + Change Governance System**, the **Universal Modular Architecture & Change-Isolation Governance System** ([`ARCHITECTURE.md`](file:///d:/PROJECT/AROH%20Open%20Source/ARCHITECTURE.md)), the **Three Realities Reconciliation Model**, and **Product Intent Recovery**.
> 
> **Absolute Invariant**: *THE AGENT MUST VISIT THE AUTHORITATIVE VERSION CONTROLLER (VERSION_CONTROLLER.md) AND ARCHITECTURE SPECIFICATION (ARCHITECTURE.md) BEFORE EXECUTION TO UNDERSTAND RELEVANT PREVIOUS CHANGES, OWNERSHIP BOUNDARIES, AND MINIMUM SAFE CHANGE RADIUS, AND MUST UPDATE BOTH UPON VERIFIED COMPLETION.*

---

## 1. AUTHORITATIVE VERSION CONTROLLER: `VERSION_CONTROLLER.md`

The project maintains its primary, persistent version ledger at:
👉 **[`VERSION_CONTROLLER.md`](file:///d:/PROJECT/AROH%20Open%20Source/VERSION_CONTROLLER.md)**

It records the authoritative state:
```markdown
# VERSION CONTROLLER

## Current Version
`A.BC.DE.F`

## Current Status
VERIFIED

## Version History
| Version | Previous | Level | Commit | Change |
```

---

## 2. AUTHORITATIVE VERSION FORMAT: `A.BC.DE.F`

All project changes and releases MUST use the 4-tier format:

`A.BC.DE.F`

Where:
* `A` = Major Version (0–∞) — Materially alters architecture, identity, or breaking contract.
* `BC` = Sub-Version / Release Line (01–99, `00` reserved for reset) — Meaningful release stage or milestone.
* `DE` = Functional Change (01–99, `00` reserved for reset) — New feature, capability, architecture system, or API endpoint.
* `F` = Minor Fix / Bug / Error (0–9) — Bug fixes, styling, small validation, or documentation corrections.

### Reset Hierarchy:
* Major Change: `A+1.00.00.0`
* Sub-Version Change: `A.BC+1.00.0`
* Functional Change: `A.BC.DE+1.0`
* Minor/Patch Change: `A.BC.DE.F+1`

---

## 3. MANDATORY MASTER EXECUTION PIPELINE

```text
┌───────────────────────────────────────────────┐
│ 1. READ VERSION CONTROLLER                    │
├───────────────────────────────────────────────┤
│ 2. READ ARCHITECTURE (ARCHITECTURE.md)        │
├───────────────────────────────────────────────┤
│ 3. SEARCH PROJECT & LOCATE EXISTING CODE      │
├───────────────────────────────────────────────┤
│ 4. IDENTIFY OWNER DOMAIN & TRACE DEPENDENCIES │
├───────────────────────────────────────────────┤
│ 5. FORMULATE CHANGE MANIFEST & CHANGE RADIUS  │
│    (DIRECT / RELATED / DEPENDENT / SHARED)    │
├───────────────────────────────────────────────┤
│ 6. CLASSIFY CHANGE & CALCULATE TARGET VERSION │
│    MAJOR / BC / DE / F                        │
├───────────────────────────────────────────────┤
│ 7. IMPLEMENT SMALLEST SAFE CHANGE             │
├───────────────────────────────────────────────┤
│ 8. TEST LOCALLY & RUN FULL MONOREPO QA        │
├───────────────────────────────────────────────┤
│ 9. VERIFY BUILD (TURBOPACK) & NO REGRESSIONS  │
├───────────────────────────────────────────────┤
│ 10. UPDATE VERSION METADATA & SYSTEM EXPORTS  │
├───────────────────────────────────────────────┤
│ 11. COMMIT IF AUTHORIZED                      │
├───────────────────────────────────────────────┤
│ 12. UPDATE VERSION CONTROLLER & ARCHITECTURE  │
├───────────────────────────────────────────────┤
│ 13. FINAL CONSISTENCY CHECK                   │
├───────────────────────────────────────────────┤
│ 14. REPORT FINAL STATE                        │
└───────────────────────────────────────────────┘
```

---

## 4. MANDATORY COMPLETION REPORT FORMAT

Conclude every project-changing operation with this structured summary:

```text
CHANGE COMPLETED

Previous Version:
A.BC.DE.F

New Version:
A.BC.DE.F

Change Level:
MAJOR / SUB-VERSION / FUNCTIONAL / PATCH

Change:
<one-line description>

Verification:
<actual verification result>

Commit:
<actual commit hash OR PENDING/NOT AUTHORIZED>

Version Controller:
UPDATED / NOT UPDATED — <reason>

Status:
VERIFIED / PARTIALLY VERIFIED / BLOCKED

Known Issues:
<if any>
```

---

## 5. CORE PLATFORM INVARIANTS

1. **First-Visit & End-of-Task Logging**:
   - `VERSION_CONTROLLER.md` is visited first to discover previous fixes and constraints, and updated last with the verified result.
2. **`Products/` Boundary Isolation**:
   - `Products/` contains independent product spokes (`Products/OmniStream`, `Products/Spedex`, etc.).
   - Modifying, refactoring, or deleting files in `Products/` during platform tasks is strictly prohibited (0 mutations allowed).
3. **Zero Fabrication**:
   - Never invent synthetic metrics, mock data, unverified URLs, fake commit hashes, or imaginary capabilities.
4. **Three Realities Reconciliation**:
   - Reconcile What was Intended (conversations/vision), What was Actually Built (code/git), and What should be Done Next (gap analysis).
