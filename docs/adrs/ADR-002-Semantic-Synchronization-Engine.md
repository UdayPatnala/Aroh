# ADR-002: Semantic Synchronization Engine over File Copying

- **Status:** Approved
- **Date:** 2026-07-20
- **Authors:** AROH System Architect & Engineering Team
- **Deciders:** Engineering Architecture Board

---

## Context & Problem Statement

In multi-product ecosystems, imported external repositories or core packages often drift out of sync over time. Naive file-copying scripts silently overwrite local modifications, destroy downstream customizations, lose version provenance, and lack audit history.

---

## Decision Outcome

We reject file-copying and implement a **Semantic Synchronization Engine** powered by machine-readable **Managed Project Manifests** (`*.manifest.json`):

1. **Manifest Provenance:** Every imported product core maintains a manifest detailing upstream URL, git commit hash, version history, ownership, and protected path rules.
2. **Drift Classification:** Synchronization explicitly classifies changes into additions, deletions, renames, dependency drift, config drift, doc drift, and intentional divergence.
3. **Protected Path Guards:** Local ecosystem adapters and configuration overrides residing in protected paths are preserved automatically during sync operations.
4. **Dry-Run Previews & Audit Trail:** Every sync run produces a preview summary before execution, and logs an immutable audit entry to `metadata.auditTrail`.

---

## Implementation Reference

- Manifest Schema: [`packages/asdk/src/sync/schema.ts`](file:///d:/PROJECT/AROH/packages/asdk/src/sync/schema.ts)
- Sync Engine Runner: [`packages/asdk/src/sync/index.ts`](file:///d:/PROJECT/AROH/packages/asdk/src/sync/index.ts)
- Product Manifests: [`manifests/*.manifest.json`](file:///d:/PROJECT/AROH/manifests/)
