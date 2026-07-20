# ADR-004: Immutable Aros Token Ledger & Backend Authority

- **Status:** Approved
- **Date:** 2026-07-20
- **Authors:** AROH System Architect & Engineering Team
- **Deciders:** Engineering Architecture Board

---

## Context & Problem Statement

Allowing client code to directly mutate user wallet balances or membership tiers creates catastrophic security risks, auditability loss, and vulnerability to transaction tampering.

---

## Decision Outcome

We establish **Backend Authority** and **Ledger Immutability** for the Aros token economy:

1. **Transaction Ledger Authority:** A user's wallet balance is defined strictly as the sum of their immutable transaction ledger entries (`TransactionSchema`). Direct updates to balance numerical fields are prohibited.
2. **Server-Side Execution:** Wallet credits/debits, tier upgrades, and reward redemptions must occur strictly inside authenticated Next.js API route handlers (`app/api/`) or Firestore security rules enforcing server context.
3. **Zod Validation:** All transaction payloads undergo schema validation prior to ledger commitment.

---

## Implementation Reference

- Transaction Schema: [`packages/asdk/src/schemas/index.ts`](file:///d:/PROJECT/AROH/packages/asdk/src/schemas/index.ts)
- Firestore Security Rules: [`firestore.rules`](file:///d:/PROJECT/AROH/firestore.rules)
