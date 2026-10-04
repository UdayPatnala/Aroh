/**
 * AROH SEO, Structured Data & AI Discoverability Static Audit
 *
 * Verifies that llms.txt, robots.txt, sitemap.ts, structured data,
 * and page metadata conform to AROH's canonical discovery standards.
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const WEB_DIR = path.join(ROOT_DIR, "apps", "web");

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

console.log("=================================================");
console.log(" AROH SEO & AI Discoverability Static Audit      ");
console.log("=================================================\n");

// --- Test 1: llms.txt & llms-full.txt Validation ---
console.log("--- Test 1: llms.txt & AI Discovery Files ---");
const llmsPath = path.join(WEB_DIR, "public", "llms.txt");
const llmsFullPath = path.join(WEB_DIR, "public", "llms-full.txt");
const llmsRoutePath = path.join(WEB_DIR, "app", "llms.txt", "route.ts");

assert(fs.existsSync(llmsPath), "public/llms.txt exists");
assert(fs.existsSync(llmsFullPath), "public/llms-full.txt exists");
assert(fs.existsSync(llmsRoutePath), "app/llms.txt/route.ts route handler exists");

if (fs.existsSync(llmsPath)) {
  const llmsContent = fs.readFileSync(llmsPath, "utf-8");
  assert(llmsContent.includes("# AROH Platform"), "llms.txt has canonical H1 title");
  assert(llmsContent.includes("https://aroh-os.vercel.app"), "llms.txt declares canonical Vercel URL");
  assert(llmsContent.includes("https://github.com/Aroh-Open-Source/AROH"), "llms.txt declares canonical GitHub repository");
  assert(llmsContent.includes("DPDP Act 2023"), "llms.txt declares DPDP Act 2023 compliance");

  // Verify showcase products are documented
  assert(llmsContent.includes("OmniStream"), "llms.txt documents OmniStream");
  assert(llmsContent.includes("SpeDex"), "llms.txt documents SpeDex");
  assert(llmsContent.includes("Nebula"), "llms.txt documents Nebula");
  assert(llmsContent.includes("Music Mirror"), "llms.txt documents Music Mirror");
  assert(llmsContent.includes("JavaPath Pro"), "llms.txt documents JavaPath Pro");
  assert(llmsContent.includes("Aros Wallet"), "llms.txt documents Aros Wallet");
}

// --- Test 2: robots.txt Directives ---
console.log("\n--- Test 2: robots.txt Crawler Directives ---");
const robotsPath = path.join(WEB_DIR, "public", "robots.txt");
assert(fs.existsSync(robotsPath), "public/robots.txt exists");

if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, "utf-8");
  assert(robotsContent.includes("User-agent: *"), "robots.txt contains wild-card User-agent");
  assert(robotsContent.includes("Allow: /llms.txt"), "robots.txt explicitly allows /llms.txt");
  assert(robotsContent.includes("Disallow: /admin"), "robots.txt disallows /admin");
  assert(robotsContent.includes("Disallow: /dashboard"), "robots.txt disallows /dashboard");
  assert(robotsContent.includes("Disallow: /cms"), "robots.txt disallows /cms");
  assert(robotsContent.includes("Disallow: /api/"), "robots.txt disallows /api/");
  assert(robotsContent.includes("User-agent: GPTBot"), "robots.txt includes GPTBot configuration");
  assert(robotsContent.includes("User-agent: ClaudeBot"), "robots.txt includes ClaudeBot configuration");
  assert(robotsContent.includes("Sitemap: https://aroh-os.vercel.app/sitemap.xml"), "robots.txt declares canonical sitemap.xml");
}

// --- Test 3: sitemap.ts Structure & Route Coverage ---
console.log("\n--- Test 3: sitemap.ts Structure & Coverage ---");
const sitemapPath = path.join(WEB_DIR, "app", "sitemap.ts");
assert(fs.existsSync(sitemapPath), "app/sitemap.ts exists");

if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
  assert(sitemapContent.includes("https://aroh-os.vercel.app"), "sitemap.ts uses canonical BASE_URL");
  assert(sitemapContent.includes("CANONICAL_PRODUCT_REGISTRY"), "sitemap.ts dynamically maps CANONICAL_PRODUCT_REGISTRY");
  assert(sitemapContent.includes("/terms"), "sitemap.ts indexes /terms");
  assert(sitemapContent.includes("/privacy"), "sitemap.ts indexes /privacy");
  assert(sitemapContent.includes("/cookies"), "sitemap.ts indexes /cookies");
  assert(sitemapContent.includes("/privacy/consent"), "sitemap.ts indexes /privacy/consent");
  assert(sitemapContent.includes("/privacy/rights"), "sitemap.ts indexes /privacy/rights");
  assert(sitemapContent.includes("/privacy/grievance"), "sitemap.ts indexes /privacy/grievance");
  assert(sitemapContent.includes("/products"), "sitemap.ts indexes /products");
  assert(sitemapContent.includes("/announcements"), "sitemap.ts indexes /announcements");
  assert(sitemapContent.includes("/ai"), "sitemap.ts indexes /ai");
}

// --- Test 4: Structured Data & Schema.org Markup ---
console.log("\n--- Test 4: Structured Data Component ---");
const structDataPath = path.join(WEB_DIR, "app", "components", "structured-data.tsx");
assert(fs.existsSync(structDataPath), "app/components/structured-data.tsx exists");

if (fs.existsSync(structDataPath)) {
  const structDataContent = fs.readFileSync(structDataPath, "utf-8");
  assert(structDataContent.includes('"@type": "Organization"'), "StructuredData defines Organization schema");
  assert(structDataContent.includes('"@type": "WebSite"'), "StructuredData defines WebSite schema");
  assert(structDataContent.includes('"@type": "SoftwareApplication"'), "StructuredData defines SoftwareApplication schema");
  assert(structDataContent.includes("application/ld+json"), "StructuredData injects application/ld+json script tags");
}

// --- Test 5: Root Layout Metadata & Discovery ---
console.log("\n--- Test 5: Root Layout Metadata ---");
const layoutPath = path.join(WEB_DIR, "app", "layout.tsx");
assert(fs.existsSync(layoutPath), "app/layout.tsx exists");

if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");
  assert(layoutContent.includes('metadataBase: new URL("https://aroh-os.vercel.app")'), "layout.tsx defines metadataBase");
  assert(layoutContent.includes("openGraph:"), "layout.tsx defines OpenGraph metadata");
  assert(layoutContent.includes("twitter:"), "layout.tsx defines Twitter card metadata");
  assert(layoutContent.includes("robots:"), "layout.tsx defines crawler robots metadata");
  assert(layoutContent.includes("index: true"), "layout.tsx explicitly allows indexing");
  assert(!layoutContent.includes("noindex: true"), "layout.tsx contains zero accidental noindex");
  assert(layoutContent.includes("<StructuredData />"), "layout.tsx mounts StructuredData component");
}

// --- Test 6: Production Foundation & Fallback States ---
console.log("\n--- Test 6: Production Foundation & Fallback States ---");
const notFoundPath = path.join(WEB_DIR, "app", "not-found.tsx");
const errorPath = path.join(WEB_DIR, "app", "error.tsx");

assert(fs.existsSync(notFoundPath), "app/not-found.tsx exists");
assert(fs.existsSync(errorPath), "app/error.tsx exists");

if (fs.existsSync(notFoundPath)) {
  const notFoundContent = fs.readFileSync(notFoundPath, "utf-8");
  assert(notFoundContent.includes("HTTP 404"), "not-found.tsx declares HTTP 404 badge");
  assert(notFoundContent.includes('href="/explore"'), "not-found.tsx provides Explore link");
  assert(notFoundContent.includes('href="/"'), "not-found.tsx provides Home link");
}

if (fs.existsSync(errorPath)) {
  const errorContent = fs.readFileSync(errorPath, "utf-8");
  assert(errorContent.includes('"use client"'), "error.tsx is client boundary component");
  assert(errorContent.includes("reset()"), "error.tsx provides reset retry handler");
}

// --- Test 7: Submodule Inviolability Guarantee ---
console.log("\n--- Test 7: Protected Products/ Submodule Boundary ---");
assert(fs.existsSync(path.join(ROOT_DIR, "..", "Products", "OmniStream")), "Products/OmniStream exists");
assert(fs.existsSync(path.join(ROOT_DIR, "..", "Products", "Spedex")), "Products/Spedex exists");

console.log("\n=================================================");
console.log(` Summary: ${passed} Passed / ${failed} Failed`);
console.log("=================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
