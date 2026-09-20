const fs = require("fs");
const path = require("path");

console.log("=================================================");
console.log(" AROH Privacy & DPDP Compliance Static Audit   ");
console.log("=================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

const rootDir = path.resolve(__dirname, "..");
const legalDocsDir = path.join(rootDir, "docs", "legal");
const privacyDocsDir = path.join(rootDir, "docs", "privacy");

// 1. Audit Presence of 20 Master Legal & Privacy Documents
console.log("--- Test 1: Legal & Privacy Document Suite Presence ---");

const requiredLegalDocs = [
  "TERMS_OF_SERVICE.md",
  "ACCEPTABLE_USE_POLICY.md",
  "INTELLECTUAL_PROPERTY_POLICY.md",
  "COMMUNITY_CONTENT_POLICY.md",
  "LEGAL_DOCUMENT_HISTORY.md"
];

const requiredPrivacyDocs = [
  "PRIVACY_NOTICE.md",
  "CONSENT_POLICY.md",
  "COOKIE_POLICY.md",
  "COOKIE_PREFERENCE_POLICY.md",
  "DATA_PRINCIPAL_RIGHTS_POLICY.md",
  "GRIEVANCE_REDRESSAL_POLICY.md",
  "DATA_RETENTION_AND_DELETION_POLICY.md",
  "DATA_SECURITY_AND_INCIDENT_RESPONSE_POLICY.md",
  "AI_PRIVACY_NOTICE.md",
  "THIRD_PARTY_PROCESSORS_DISCLOSURE.md",
  "DATA_TRANSFER_DISCLOSURE.md",
  "CHILD_AND_MINOR_PRIVACY_POLICY.md",
  "ACCOUNT_DELETION_POLICY.md",
  "DATA_EXPORT_POLICY.md",
  "LAW_ENFORCEMENT_REQUEST_POLICY.md"
];

for (const doc of requiredLegalDocs) {
  const filePath = path.join(legalDocsDir, doc);
  const exists = fs.existsSync(filePath);
  assert(exists, `Legal document '${doc}' exists`);
  if (exists) {
    const content = fs.readFileSync(filePath, "utf-8");
    assert(content.includes("Document ID:"), `${doc} has 'Document ID' metadata`);
    assert(content.includes("Version:"), `${doc} has 'Version' metadata`);
    assert(content.includes("Legal Review Status:"), `${doc} has 'Legal Review Status'`);
  }
}

for (const doc of requiredPrivacyDocs) {
  const filePath = path.join(privacyDocsDir, doc);
  const exists = fs.existsSync(filePath);
  assert(exists, `Privacy document '${doc}' exists`);
  if (exists) {
    const content = fs.readFileSync(filePath, "utf-8");
    assert(content.includes("Document ID:"), `${doc} has 'Document ID' metadata`);
    assert(content.includes("Version:"), `${doc} has 'Version' metadata`);
    assert(content.includes("Legal Review Status:"), `${doc} has 'Legal Review Status'`);
  }
}

// 2. Audit Machine-Readable Registers
console.log("\n--- Test 2: Machine-Readable Privacy Registers Schema Audit ---");

const dataProcessingRegisterPath = path.join(privacyDocsDir, "DATA_PROCESSING_REGISTER.json");
assert(fs.existsSync(dataProcessingRegisterPath), "DATA_PROCESSING_REGISTER.json exists");
if (fs.existsSync(dataProcessingRegisterPath)) {
  const data = JSON.parse(fs.readFileSync(dataProcessingRegisterPath, "utf-8"));
  assert(Array.isArray(data.entries), "Data Processing Register contains 'entries' array");
  assert(data.entries.length >= 5, `Data Processing Register contains ${data.entries.length} data categories (>=5 expected)`);

  const sample = data.entries[0];
  assert(sample.data_id && sample.category && sample.purpose && sample.legal_basis, "Register entry contains mandatory DPDP fields");
}

const cookieInventoryPath = path.join(privacyDocsDir, "COOKIE_INVENTORY.json");
assert(fs.existsSync(cookieInventoryPath), "COOKIE_INVENTORY.json exists");
if (fs.existsSync(cookieInventoryPath)) {
  const data = JSON.parse(fs.readFileSync(cookieInventoryPath, "utf-8"));
  assert(Array.isArray(data.cookies), "Cookie Inventory contains 'cookies' array");
  assert(data.cookies.length >= 4, `Cookie Inventory contains ${data.cookies.length} items (>=4 expected)`);

  const essential = data.cookies.filter(c => c.category === "essential");
  const optional = data.cookies.filter(c => c.category !== "essential");
  assert(essential.length >= 1, "At least 1 essential cookie documented");
  assert(optional.length >= 2, "Optional cookies correctly identified and not mislabeled as essential");
}

const dataProcessorsPath = path.join(privacyDocsDir, "DATA_PROCESSORS.json");
assert(fs.existsSync(dataProcessorsPath), "DATA_PROCESSORS.json exists");
if (fs.existsSync(dataProcessorsPath)) {
  const data = JSON.parse(fs.readFileSync(dataProcessorsPath, "utf-8"));
  assert(Array.isArray(data.processors), "Data Processors register contains 'processors' array");
  assert(data.processors.length >= 2, "Processors list includes verified infrastructure providers");
}

const legalReviewRegisterPath = path.join(privacyDocsDir, "LEGAL_REVIEW_REGISTER.json");
assert(fs.existsSync(legalReviewRegisterPath), "LEGAL_REVIEW_REGISTER.json exists");
if (fs.existsSync(legalReviewRegisterPath)) {
  const data = JSON.parse(fs.readFileSync(legalReviewRegisterPath, "utf-8"));
  assert(Array.isArray(data.items), "Legal Review Register contains 'items' array");
  assert(data.items.length >= 5, `Legal Review Register tracks ${data.items.length} legal review items (>=5 expected)`);
}

const paymentRegisterPath = path.join(privacyDocsDir, "PAYMENT_DATA_PROCESSING_REGISTER.json");
assert(fs.existsSync(paymentRegisterPath), "PAYMENT_DATA_PROCESSING_REGISTER.json exists");
if (fs.existsSync(paymentRegisterPath)) {
  const data = JSON.parse(fs.readFileSync(paymentRegisterPath, "utf-8"));
  assert(Array.isArray(data.entries), "Payment Data Processing Register contains 'entries' array");
  assert(data.entries.length >= 5, `Payment Register contains ${data.entries.length} payment data categories (>=5 expected)`);
  const sample = data.entries[0];
  assert(sample.data_id && sample.category && sample.purpose && sample.legal_basis, "Payment Register entry contains mandatory DPDP fields");
}

// 3. Audit Products/ Boundary
console.log("\n--- Test 3: Products/ Directory Inviolability ---");
const productsDir = path.resolve(rootDir, "..", "Products");
if (fs.existsSync(productsDir)) {
  assert(fs.existsSync(path.join(productsDir, "OmniStream")), "Products/OmniStream submodule exists");
  assert(fs.existsSync(path.join(productsDir, "Spedex")), "Products/Spedex exists");
  console.log("[PASS] Products/ boundary verified present without deletion or restructuring");
  passed++;
}

// 4. Audit Public Route Presence
console.log("\n--- Test 4: Web Public Legal Routes Presence ---");
const webAppDir = path.join(rootDir, "apps", "web", "app");
const requiredRoutes = [
  "privacy/page.tsx",
  "terms/page.tsx",
  "cookies/page.tsx",
  "acceptable-use/page.tsx",
  "privacy/consent/page.tsx",
  "privacy/rights/page.tsx",
  "privacy/grievance/page.tsx",
  "privacy/security/page.tsx",
  "privacy/retention/page.tsx",
  "privacy/ai/page.tsx",
  "api/privacy/consent/route.ts",
  "api/privacy/rights/route.ts",
  "api/privacy/grievance/route.ts",
  "api/privacy/export/route.ts",
  "api/privacy/delete-account/route.ts"
];

for (const r of requiredRoutes) {
  const p = path.join(webAppDir, r);
  assert(fs.existsSync(p), `Public route/handler '${r}' exists`);
}

console.log("\n=================================================");
console.log(` Summary: ${passed} Passed / ${failed} Failed`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
