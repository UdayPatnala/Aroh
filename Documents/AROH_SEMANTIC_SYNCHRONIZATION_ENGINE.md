# AROH Semantic Synchronization Engine Specification

- **Specification Version:** v1.0.0
- **Status:** Active Standard
- **Package:** `@aroh/asdk` (`src/sync/`)
- **Author:** AROH Platform Architecture Group

---

## 1. Overview

The **AROH Semantic Synchronization Engine** transforms product synchronization from volatile file-copy operations into a governance-driven, machine-readable artifact lifecycle. Upstream products integrated into AROH (e.g. Nebula, Spedex, Music Mirror, JavaPath Pro) are tracked via JSON manifests (`*.manifest.json`) that record provenance, checksums, merge strategies, protected paths, and audit histories.

---

## 2. Core Concepts & Manifest Architecture

Every managed product core maintains a machine-readable manifest at `manifests/[product-id].manifest.json` conforming to `ManagedProjectManifestSchema`.

### 2.1. Manifest Schema Layout
```json
{
  "$schemaVersion": "v1.0.0",
  "identity": {
    "id": "nebula-core",
    "name": "Nebula Core",
    "description": "Decoupled multi-agent workspace engine",
    "upstreamUrl": "https://github.com/UdayPatnala/nebula-core",
    "repositoryType": "monorepo_package",
    "targetPath": "packages/nebula-core",
    "branch": "main",
    "upstreamVersion": "v1.4.2",
    "commitHash": "a1b2c3d4e5f67890",
    "ownership": "team-ai-workspace"
  },
  "governance": {
    "syncPolicy": "continuous_governed",
    "mergeStrategy": "downstream_wins",
    "autoSyncEnabled": false,
    "excludedPaths": ["**/node_modules/**", "**/dist/**"],
    "generatedPaths": ["src/generated/**"],
    "protectedPaths": ["src/integrations/aroh-adapter.ts"]
  },
  "compatibility": {
    "ecosystemVersion": "v2.0.0",
    "minimumAsdkVersion": "v2.0.0",
    "dependencies": { "zod": "^3.22.4" },
    "requiredPlatformServices": ["auth", "aros-wallet", "ai-orchestrator"]
  },
  "metadata": {
    "lastSyncedAt": "2026-07-20T12:00:00Z",
    "modifiedFiles": ["src/integrations/aroh-adapter.ts"],
    "generatedFiles": [],
    "migrationHistory": [],
    "architecturalNotes": [],
    "aiAnnotations": {},
    "auditTrail": []
  }
}
```

---

## 3. Drift Classification & Merge Strategies

### 3.1. Drift Types
- **Addition (`addition`):** New upstream file detected.
- **Deletion (`deletion`):** Upstream file removed.
- **Rename/Move (`rename`, `move`):** Path change without logic rewrite.
- **Refactor (`refactor`):** Upstream content updated.
- **Dependency Drift (`dependency_drift`):** Version divergence in `package.json`.
- **Protected Divergence (`intentional_divergence`):** Downstream custom code in `protectedPaths`.

### 3.2. Merge Strategies
- **`downstream_wins`:** Preserve downstream ecosystem integrations in `protectedPaths`.
- **`deterministic_overwrite`:** Force-replace generated code paths.
- **`manual_review`:** Flag high-risk structural conflicts for developer review.

---

## 4. Programmatic API & Execution Workflow

```typescript
import { SemanticSyncEngine, validateProjectManifest } from "@aroh/asdk";
import manifestData from "../manifests/nebula-core.manifest.json";

// 1. Validate Manifest
const manifest = validateProjectManifest(manifestData);

// 2. Generate Dry-Run Preview
const preview = SemanticSyncEngine.previewSync(manifest, {
  modified: ["src/integrations/aroh-adapter.ts"],
  added: ["src/features/canvas.ts"],
  deleted: []
});

// 3. Execute Deterministic Sync
const result = SemanticSyncEngine.executeSync(manifest, preview, "operator:admin");
console.log(`Sync completed: ${result.filesUpdated} files updated, ${result.filesSkipped} protected skipped.`);
```

---

## 5. Governance Verification

Automated CLI verification is executed via:
```bash
npx tsx scripts/verify-sync-manifests.js
```
This ensures zero schema drift or unmanaged project imports exist in the monorepo.
