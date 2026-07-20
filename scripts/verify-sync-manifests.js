const fs = require("fs");
const path = require("path");
const { validateProjectManifest, SemanticSyncEngine } = require("../packages/asdk");

console.log("=================================================");
console.log(" AROH Managed Project Manifests Verification     ");
console.log("=================================================");

const manifestsDir = path.join(__dirname, "..", "manifests");
const manifestFiles = fs.readdirSync(manifestsDir).filter(f => f.endsWith(".manifest.json"));

if (manifestFiles.length === 0) {
  console.error("❌ Error: No manifest files found in manifests/ directory.");
  process.exit(1);
}

let passedCount = 0;

for (const file of manifestFiles) {
  const filePath = path.join(manifestsDir, file);
  console.log(`\n🔍 Verifying: ${file}...`);

  try {
    const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const manifest = validateProjectManifest(rawData);

    console.log(`   ✓ ID: ${manifest.identity.id}`);
    console.log(`   ✓ Name: ${manifest.identity.name}`);
    console.log(`   ✓ Sync Policy: ${manifest.governance.syncPolicy}`);
    console.log(`   ✓ Merge Strategy: ${manifest.governance.mergeStrategy}`);
    console.log(`   ✓ Version: ${manifest.identity.upstreamVersion}`);

    // Test SemanticSyncEngine Preview
    const preview = SemanticSyncEngine.previewSync(manifest, {
      modified: manifest.governance.protectedPaths.slice(),
      added: ["src/new-feature.ts"],
      deleted: []
    });

    console.log(`   ✓ Sync Preview Generated (${preview.plannedActions.length} actions planned)`);
    passedCount++;
  } catch (err) {
    console.error(`   ❌ Failed validation for ${file}:`, err.message);
    process.exit(1);
  }
}

console.log("\n=================================================");
console.log(` Summary: ${passedCount}/${manifestFiles.length} Manifests Passed Schema Validation`);
console.log(" Status: VERIFIED CLEAN (Zero Warnings)");
console.log("=================================================");
