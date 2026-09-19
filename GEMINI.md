# UNIVERSAL PRODUCT REVERSE-ENGINEERING + ENGINEERING SYSTEM — AROH OPEN SOURCE

> **Authoritative Workspace Rule**: This repository operates strictly under the **Universal Product Reverse-Engineering + Engineering System**, the **Three Realities Reconciliation Model**, and **Product Intent Recovery**.
> 
> **Absolute Invariant**: *Never let the current codebase overwrite the project's historical product intent. Reconcile the code with the intent.*

---

## 1. THE THREE REALITIES TO RECONCILE

Before deciding what should be built next, the agent must answer: **“What has actually been built so far?”**

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

## 2. ABSOLUTE ORDER OF OPERATIONS

```text
NEVER START BY CODING.

The mandatory order is:
A. RECOVER PRODUCT INTENT
B. REVERSE ENGINEER CURRENT PRODUCT
C. RECONCILE INTENT VS IMPLEMENTATION
D. IDENTIFY GAPS / EXCESS / RISKS / DRIFT
E. RESEARCH
F. MAKE DECISIONS
G. PLAN
H. PRESERVE SAFE VERSION
I. IMPLEMENT
J. VERIFY
K. AUDIT
L. UPDATE HISTORY
M. PRESERVE NEW KNOWN-GOOD VERSION
```

---

## 3. CORE OPERATING HIERARCHY

```text
CONVERSATIONS / DISCUSSIONS
        ↓
MOTIVE
        ↓
VISION
        ↓
PURPOSE
        ↓
PRODUCT IDENTITY
        ↓
INTENDED USER EXPERIENCE
        ↓
AGREED FEATURES + BEHAVIOR
        ↓
CONSTRAINTS + "DO NOT" DECISIONS
        ↓
CURRENT IMPLEMENTATION (REVERSE-ENGINEERED)
        ↓
GIT / VERSION HISTORY (HISTORICAL FORENSICS)
        ↓
RESEARCH (DUAL-MANDATE: TECHNICAL & PRODUCT-APPROPRIATE)
        ↓
ENGINEERING DECISIONS
        ↓
IMPLEMENTATION (SIMPLE WORKING MODEL FIRST)
        ↓
VERIFICATION (TESTS, BUILD, RUNTIME, DPDP, ACCESSIBILITY)
        ↓
UPDATED PRODUCT & HISTORY LEDGER
```

---

## 4. REVERSE-ENGINEERING CHECKLIST BEFORE CODING

Before modifying any code, reverse engineer:
1. **Structure**: Directories, applications (`apps/web`), packages (`packages/asdk`, `packages/ads`), manifests, configs.
2. **Tech Stack**: Actual runtime dependencies vs. package.json declarations.
3. **Architecture**: Server/client boundaries, routing, state flow, API boundaries, persistence, error handling.
4. **UX Flows**: Real user journeys, loading states, empty states, error states, and retries.
5. **UI Authenticity**: Component hierarchy, tokens, responsiveness, eliminating dead/fake controls and generic templates.
6. **Data & Performance**: Ledger integrity, schemas, validation, bundle size, hydration overhead, and waterfalls.
7. **Git Forensics**: Complete commit log, branches, tags, blame, merges, and previous reverts.

---

## 5. CORE PLATFORM INVARIANTS

1. **Reconciliation over Overwriting**:
   - The current code is only one representation of the product. When code conflicts with vision, reconcile the code with the intent.
2. **`Products/` Boundary Isolation**:
   - `Products/` contains independent product spokes (`Products/OmniStream`, `Products/Spedex`, etc.).
   - Modifying, refactoring, or deleting files in `Products/` during platform tasks is strictly prohibited (0 mutations allowed).
3. **Zero Fabrication**:
   - Never invent synthetic metrics, mock data, unverified URLs, or imaginary product capabilities.
4. **Continuous Audit & Ledger Update**:
   - Conclude every task by recording actual outcomes in `Aroh/docs/EXECUTION_HISTORY.md` and `Aroh/docs/VERSION_HISTORY.md`.
