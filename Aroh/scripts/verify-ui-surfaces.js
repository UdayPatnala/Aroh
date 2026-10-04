const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const ARTIFACT_DIR = "C:/Users/udayp/.gemini/antigravity/brain/bc4e4073-366e-4c99-b2d2-8bc718c8ac96";
const CHROME_PATH = fs.existsSync("C:/Program Files/Google/Chrome/Application/chrome.exe")
  ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
  : null;

async function runVisualAudit() {
  console.log("=== Launching Puppeteer Visual Surface Audit ===");
  
  const launchOpts = {
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--remote-allow-origins=*"]
  };
  if (CHROME_PATH) {
    launchOpts.executablePath = CHROME_PATH;
  }

  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();

  const auditResults = [];

  async function auditSurface(name, url, viewport, filename) {
    console.log(`Auditing: ${name} (${viewport.width}x${viewport.height}) -> ${url}`);
    await page.setViewport(viewport);
    
    // Set sessionStorage to bypass intro video
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      sessionStorage.setItem("aroh_intro_played", "true");
    });

    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    const status = response ? response.status() : "no-response";

    // Wait 500ms for framer motion animations to settle
    await new Promise((r) => setTimeout(r, 600));

    // Check horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const outPath = path.join(ARTIFACT_DIR, filename);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`  Saved screenshot: ${filename} (HTTP ${status}, Overflow: ${hasHorizontalOverflow})`);

    auditResults.push({
      name,
      url,
      viewport: `${viewport.width}x${viewport.height}`,
      status,
      hasHorizontalOverflow,
      screenshot: filename
    });
  }

  try {
    // 1. Desktop Surfaces (1280x900)
    const desktop = { width: 1280, height: 900 };
    await auditSurface("Desktop Homepage", "http://localhost:3000/", desktop, "audit_desktop_home.png");
    await auditSurface("Desktop Explorer", "http://localhost:3000/explore", desktop, "audit_desktop_explore.png");
    await auditSurface("Desktop Products Console", "http://localhost:3000/products", desktop, "audit_desktop_products.png");
    await auditSurface("Desktop Announcements Hub", "http://localhost:3000/announcements", desktop, "audit_desktop_announcements.png");
    await auditSurface("Desktop OmniStream Detail", "http://localhost:3000/explore/omnistream", desktop, "audit_desktop_detail_omnistream.png");
    await auditSurface("Desktop SpeDex Future Launch Detail", "http://localhost:3000/explore/spedex", desktop, "audit_desktop_detail_spedex.png");

    // 2. Mobile Surfaces (390x844 - iPhone 14)
    const mobile = { width: 390, height: 844, isMobile: true, hasTouch: true };
    await auditSurface("Mobile Homepage", "http://localhost:3000/", mobile, "audit_mobile_home.png");
    await auditSurface("Mobile Explorer", "http://localhost:3000/explore", mobile, "audit_mobile_explore.png");
    await auditSurface("Mobile Products Console", "http://localhost:3000/products", mobile, "audit_mobile_products.png");
    await auditSurface("Mobile Announcements Hub", "http://localhost:3000/announcements", mobile, "audit_mobile_announcements.png");
    await auditSurface("Mobile SpeDex Future Launch Detail", "http://localhost:3000/explore/spedex", mobile, "audit_mobile_detail_spedex.png");

    // Verify SpeDex Page semantics
    console.log("\nVerifying SpeDex Future Launch DOM invariants...");
    await page.goto("http://localhost:3000/explore/spedex", { waitUntil: "domcontentloaded", timeout: 20000 });
    const spedexText = await page.evaluate(() => document.body.innerText);
    const hasBuyButton = spedexText.includes("Purchase Upgrade") || spedexText.includes("Buy License") || spedexText.includes("Execute SpeDex Debit");
    const hasFutureLaunchText = spedexText.includes("FUTURE LAUNCH") || spedexText.includes("Notify Me on Launch") || spedexText.includes("In Development");
    
    console.log(`  SpeDex contains forbidden purchase actions: ${hasBuyButton} (Expected: false)`);
    console.log(`  SpeDex contains Future Launch indicators: ${hasFutureLaunchText} (Expected: true)`);

    if (hasBuyButton || !hasFutureLaunchText) {
      throw new Error("SpeDex UI validation failed: forbidden action detected or missing future launch text");
    }

    // Verify Announcements Hub semantics & Instagram CTA
    console.log("\nVerifying Announcements Hub DOM & Feedback Invariants...");
    await page.goto("http://localhost:3000/announcements", { waitUntil: "domcontentloaded", timeout: 20000 });
    const announcementsText = await page.evaluate(() => document.body.innerText);
    const hasGooglePlayBilling = announcementsText.includes("Google Play Billing for Aros");
    const hasGooglePlayRewards = announcementsText.includes("Google Play Rewards & Points");
    const hasFakeBuyButton = announcementsText.includes("Buy Aros") || announcementsText.includes("Redeem Play Points");
    const instagramHref = await page.evaluate(() => {
      const link = document.querySelector('a[href*="instagram.com"]');
      return link ? link.getAttribute("href") : null;
    });

    console.log(`  Announcements page documents Google Play Billing: ${hasGooglePlayBilling} (Expected: true)`);
    console.log(`  Announcements page documents Google Play Rewards: ${hasGooglePlayRewards} (Expected: true)`);
    console.log(`  Announcements page contains fake purchase/redeem button: ${hasFakeBuyButton} (Expected: false)`);
    console.log(`  Instagram destination: ${instagramHref} (Expected: https://www.instagram.com/aroh.0s/)`);

    if (!hasGooglePlayBilling || !hasGooglePlayRewards || hasFakeBuyButton || instagramHref !== "https://www.instagram.com/aroh.0s/") {
      throw new Error("Announcements DOM validation failed: invalid Google Play claims or incorrect Instagram URL");
    }

    console.log("\nAll UI surfaces verified successfully with visual screenshots captured!");
  } finally {
    await browser.close();
  }
}

runVisualAudit().catch((err) => {
  console.error("Visual audit failed:", err);
  process.exit(1);
});
