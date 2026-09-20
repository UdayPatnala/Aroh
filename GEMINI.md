# UNIVERSAL VERSION CONTROLLER & CHANGE GOVERNANCE SYSTEM — AROH OPEN SOURCE

> **Authoritative Workspace Rule**: This repository operates strictly under the **Universal Version Controller + Change Governance System**, the **Three Realities Reconciliation Model**, and **Product Intent Recovery**.
> 
> **Absolute Invariant**: *THE AGENT MUST VISIT THE AUTHORITATIVE VERSION CONTROLLER (VERSION_CONTROLLER.md) BEFORE EXECUTION TO UNDERSTAND RELEVANT PREVIOUS CHANGES, AND MUST UPDATE THE VERSION CONTROLLER AFTER SUCCESSFUL IMPLEMENTATION AND VERIFICATION.*

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
* `DE` = Functional Change (01–99, `00` reserved for reset) — New feature, capability, or API endpoint.
* `F` = Minor Fix / Bug / Error (0–9) — Bug fixes, styling, small validation, or documentation corrections.

### Reset Hierarchy:
* Major Change: `A+1.00.00.0`
* Sub-Version Change: `A.BC+1.00.0`
* Functional Change: `A.BC.DE+1.0`
* Minor/Patch Change: `A.BC.DE.F+1`

---

## 3. MANDATORY MASTER EXECUTION PIPELINE

```text
┌─────────────────────────────────────────┐
│ 1. READ VERSION CONTROLLER              │
├─────────────────────────────────────────┤
│ 2. FIND RELEVANT HISTORICAL CHANGES     │
├─────────────────────────────────────────┤
│ 3. INSPECT CURRENT IMPLEMENTATION       │
├─────────────────────────────────────────┤
│ 4. UNDERSTAND USER REQUEST              │
├─────────────────────────────────────────┤
│ 5. CLASSIFY CHANGE                      │
│    MAJOR / BC / DE / F                  │
├─────────────────────────────────────────┤
│ 6. CALCULATE TARGET VERSION             │
├─────────────────────────────────────────┤
│ 7. ANALYSE RISKS / DEPENDENCIES         │
├─────────────────────────────────────────┤
│ 8. IMPLEMENT (SIMPLE WORKING MODEL)     │
├─────────────────────────────────────────┤
│ 9. TEST & VERIFY (TESTS, BUILD, LINT)   │
├─────────────────────────────────────────┤
│ 10. UPDATE VERSION METADATA             │
├─────────────────────────────────────────┤
│ 11. COMMIT IF AUTHORIZED                │
├─────────────────────────────────────────┤
│ 12. UPDATE VERSION CONTROLLER           │
├─────────────────────────────────────────┤
│ 13. FINAL CONSISTENCY CHECK             │
├─────────────────────────────────────────┤
│ 14. REPORT FINAL STATE                  │
└─────────────────────────────────────────┘
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
