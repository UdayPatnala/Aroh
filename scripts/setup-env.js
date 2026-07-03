const fs = require("fs");
const path = require("path");

console.log("=== AROH DevOps Environment Setup Tool ===");

// 1. Validate Node.js Version
const nodeVersion = process.versions.node;
const majorVersion = parseInt(nodeVersion.split(".")[0]);
if (majorVersion < 18) {
  console.error(`[ERROR] Node.js version 18+ is required. Current version is ${nodeVersion}.`);
  process.exit(1);
} else {
  console.log(`[PASS] Node.js version check passed (Current: ${nodeVersion}).`);
}

// 2. Setup env file for apps/web if missing
const envPath = path.join(__dirname, "..", "apps", "web", ".env.local");
const envTemplate = `# AROH Platform Environment Configurations
# Set to 'production' or 'development'. Mock mode is used if Firebase config is missing.
AROH_ENV=mock

# Firebase web credentials (Optional - fills dynamically on Vercel/Production)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
`;

if (!fs.existsSync(envPath)) {
  try {
    fs.writeFileSync(envPath, envTemplate, "utf8");
    console.log(`[INFO] Created default environment config at: ${envPath}`);
  } catch (err) {
    console.error(`[ERROR] Failed to write environment config file:`, err);
  }
} else {
  console.log("[PASS] Environment config file (.env.local) already exists.");
}

console.log("=== Setup completed successfully. ===");
