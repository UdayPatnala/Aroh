import { z } from "zod";

export const MergeStrategySchema = z.enum([
  "deterministic_overwrite",
  "downstream_wins",
  "upstream_wins",
  "ast_merge",
  "manual_review"
]);
export type MergeStrategy = z.infer<typeof MergeStrategySchema>;

export const SyncPolicySchema = z.enum([
  "manual",
  "on_upstream_release",
  "continuous_governed",
  "disabled"
]);
export type SyncPolicy = z.infer<typeof SyncPolicySchema>;

export const DriftTypeSchema = z.enum([
  "addition",
  "deletion",
  "rename",
  "move",
  "refactor",
  "dependency_drift",
  "config_drift",
  "doc_drift",
  "intentional_divergence"
]);
export type DriftType = z.infer<typeof DriftTypeSchema>;

export const RepositoryTypeSchema = z.enum([
  "git",
  "monorepo_package",
  "external_tarball"
]);
export type RepositoryType = z.infer<typeof RepositoryTypeSchema>;

export const ProjectIdentitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  upstreamUrl: z.string().url().or(z.string().min(1)),
  repositoryType: RepositoryTypeSchema,
  targetPath: z.string(),
  branch: z.string().default("main"),
  upstreamVersion: z.string(),
  commitHash: z.string(),
  ownership: z.string()
});
export type ProjectIdentity = z.infer<typeof ProjectIdentitySchema>;

export const ProjectGovernanceSchema = z.object({
  syncPolicy: SyncPolicySchema,
  mergeStrategy: MergeStrategySchema,
  autoSyncEnabled: z.boolean().default(false),
  excludedPaths: z.array(z.string()).default([]),
  generatedPaths: z.array(z.string()).default([]),
  protectedPaths: z.array(z.string()).default([])
});
export type ProjectGovernance = z.infer<typeof ProjectGovernanceSchema>;

export const ProjectCompatibilitySchema = z.object({
  ecosystemVersion: z.string(),
  minimumAsdkVersion: z.string(),
  dependencies: z.record(z.string(), z.string()).default({}),
  requiredPlatformServices: z.array(z.string()).default([])
});
export type ProjectCompatibility = z.infer<typeof ProjectCompatibilitySchema>;

export const MigrationEntrySchema = z.object({
  version: z.string(),
  appliedAt: z.string(),
  description: z.string()
});
export type MigrationEntry = z.infer<typeof MigrationEntrySchema>;

export const AuditEntrySchema = z.object({
  timestamp: z.string(),
  action: z.string(),
  actor: z.string(),
  details: z.string()
});
export type AuditEntry = z.infer<typeof AuditEntrySchema>;

export const ProjectMetadataSchema = z.object({
  lastSyncedAt: z.string(),
  modifiedFiles: z.array(z.string()).default([]),
  generatedFiles: z.array(z.string()).default([]),
  migrationHistory: z.array(MigrationEntrySchema).default([]),
  architecturalNotes: z.array(z.string()).default([]),
  aiAnnotations: z.record(z.string(), z.string()).default({}),
  auditTrail: z.array(AuditEntrySchema).default([])
});
export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;

export const ManagedProjectManifestSchema = z.object({
  $schemaVersion: z.string().default("v1.0.0"),
  identity: ProjectIdentitySchema,
  governance: ProjectGovernanceSchema,
  compatibility: ProjectCompatibilitySchema,
  metadata: ProjectMetadataSchema
});
export type ManagedProjectManifest = z.infer<typeof ManagedProjectManifestSchema>;

export function validateProjectManifest(data: unknown): ManagedProjectManifest {
  return ManagedProjectManifestSchema.parse(data);
}

export interface DriftReport {
  projectId: string;
  timestamp: string;
  hasDrift: boolean;
  driftItems: Array<{
    path: string;
    driftType: DriftType;
    severity: "info" | "warning" | "error";
    resolutionRecommendation: string;
  }>;
}

export function calculateDrift(
  manifest: ManagedProjectManifest,
  localState: { modified: string[]; added: string[]; deleted: string[] }
): DriftReport {
  const driftItems: DriftReport["driftItems"] = [];

  for (const file of localState.modified) {
    const isProtected = manifest.governance.protectedPaths.some(p => file.startsWith(p));
    driftItems.push({
      path: file,
      driftType: isProtected ? "intentional_divergence" : "refactor",
      severity: isProtected ? "info" : "warning",
      resolutionRecommendation: isProtected
        ? "Preserve downstream customization"
        : "Reconcile with upstream"
    });
  }

  for (const file of localState.added) {
    driftItems.push({
      path: file,
      driftType: "addition",
      severity: "info",
      resolutionRecommendation: "Track in manifest modifiedFiles"
    });
  }

  for (const file of localState.deleted) {
    driftItems.push({
      path: file,
      driftType: "deletion",
      severity: "warning",
      resolutionRecommendation: "Verify upstream removal or restore"
    });
  }

  return {
    projectId: manifest.identity.id,
    timestamp: new Date().toISOString(),
    hasDrift: driftItems.length > 0,
    driftItems
  };
}
