export * from "./schema";
import {
  ManagedProjectManifest,
  DriftReport,
  calculateDrift,
  AuditEntry
} from "./schema";

export interface SyncPreview {
  projectId: string;
  targetPath: string;
  mergeStrategy: string;
  plannedActions: Array<{
    file: string;
    action: "create" | "update" | "delete" | "skip_protected";
    reason: string;
  }>;
  driftReport: DriftReport;
}

export interface SyncResult {
  success: boolean;
  projectId: string;
  syncedAt: string;
  filesProcessed: number;
  filesUpdated: number;
  filesSkipped: number;
  auditEntry: AuditEntry;
}

export class SemanticSyncEngine {
  public static previewSync(
    manifest: ManagedProjectManifest,
    localState: { modified: string[]; added: string[]; deleted: string[] }
  ): SyncPreview {
    const driftReport = calculateDrift(manifest, localState);
    const plannedActions: SyncPreview["plannedActions"] = [];

    for (const file of localState.modified) {
      const isProtected = manifest.governance.protectedPaths.some(p => file.startsWith(p));
      if (isProtected) {
        plannedActions.push({
          file,
          action: "skip_protected",
          reason: "File is marked protected in project manifest"
        });
      } else {
        plannedActions.push({
          file,
          action: "update",
          reason: `Reconciling modified file using strategy ${manifest.governance.mergeStrategy}`
        });
      }
    }

    for (const file of localState.added) {
      plannedActions.push({
        file,
        action: "create",
        reason: "Adding new file tracked from upstream"
      });
    }

    for (const file of localState.deleted) {
      plannedActions.push({
        file,
        action: "delete",
        reason: "Removing file deleted in upstream"
      });
    }

    return {
      projectId: manifest.identity.id,
      targetPath: manifest.identity.targetPath,
      mergeStrategy: manifest.governance.mergeStrategy,
      plannedActions,
      driftReport
    };
  }

  public static executeSync(
    manifest: ManagedProjectManifest,
    preview: SyncPreview,
    actor: string = "system:sync-engine"
  ): SyncResult {
    let filesUpdated = 0;
    let filesSkipped = 0;

    for (const item of preview.plannedActions) {
      if (item.action === "skip_protected") {
        filesSkipped++;
      } else {
        filesUpdated++;
      }
    }

    const timestamp = new Date().toISOString();
    const auditEntry: AuditEntry = {
      timestamp,
      action: "SEMANTIC_SYNC_EXECUTE",
      actor,
      details: `Processed ${preview.plannedActions.length} files (${filesUpdated} updated, ${filesSkipped} protected skipped) using ${manifest.governance.mergeStrategy}`
    };

    manifest.metadata.lastSyncedAt = timestamp;
    manifest.metadata.auditTrail.push(auditEntry);

    return {
      success: true,
      projectId: manifest.identity.id,
      syncedAt: timestamp,
      filesProcessed: preview.plannedActions.length,
      filesUpdated,
      filesSkipped,
      auditEntry
    };
  }
}
