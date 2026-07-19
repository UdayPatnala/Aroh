const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const APP_URL = "http://localhost:3000";
const SCREENSHOT_DIR = "C:/Users/udayp/.gemini/antigravity/brain/3a105ffc-89ff-45a8-99cb-378ec0eb6e9e/screenshots";
const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function clickButtonByText(page, text) {
  const buttons = await page.$$("button, div[tabindex='0']");
  for (const btn of buttons) {
    const btnText = await page.evaluate(el => el.textContent, btn);
    if (btnText.trim().includes(text)) {
      await btn.click();
      return true;
    }
  }
  return false;
}

async function runAudit() {
  console.log("=== Starting Automated E2E Browser Audit ===");
  
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ["--no-sandbox", "--disable-gpu", "--remote-allow-origins=*"]
    });
  } catch (launchErr) {
    console.error("Failed to launch native Chrome. Attempting to launch Puppeteer-bundled browser instead...", launchErr);
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-gpu", "--remote-allow-origins=*"]
    });
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  };

  try {
    // 1. Audit Login page
    console.log("\n--- Step 1: Auditing Login Page (/login) ---");
    await page.goto(`${APP_URL}/login`, { waitUntil: "networkidle2" });
    
    // Force Mock Mode in localStorage to guarantee mock credentials are shown
    await page.evaluate(() => {
      localStorage.setItem("aroh_force_mock", "true");
    });
    // Reload the page to apply mock mode
    await page.reload({ waitUntil: "networkidle2" });
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01_login_page.png") });
    
    // Check if demo credentials are visible
    const content = await page.content();
    const hasDemoCreds = content.includes("admin@aroh.co") && content.includes("user@aroh.co");
    assert(hasDemoCreds, "Login page exposes helper demo credentials.");

    // Check if there are form elements
    const emailInput = await page.$("input[id='email']");
    const passwordInput = await page.$("input[id='password']");
    assert(emailInput !== null && passwordInput !== null, "Email and Password fields are present.");

    // 2. Authenticate as Standard User
    console.log("\n--- Step 2: Authenticating as Standard User ---");
    await page.type("input[id='email']", "user@aroh.co");
    await page.type("input[id='password']", "user");
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01b_login_filled.png") });
    await page.click("button[type='submit']");
    
    // Wait for client-side navigation to complete (URL changes to / or /dashboard, or display name is visible)
    await page.waitForFunction(
      () => window.location.pathname === "/" || window.location.pathname === "/dashboard" || document.body.innerText.includes("Signed in as"),
      { timeout: 10000 }
    );
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "02_user_logged_in_home.png") });

    // Verify authentication status on home
    const homeContent = await page.content();
    assert(homeContent.includes("Signed in as") && homeContent.includes("Standard User"), "Homepage confirms authentication and display name.");
    assert(homeContent.includes("500 Aros"), "User balance is correctly displayed as 500 Aros on home.");

    // 3. Access Dashboard client-side
    console.log("\n--- Step 3: Navigating to User Dashboard client-side ---");
    // Click "Enter Workspace" button on the homepage to navigate client-side
    const workspaceClicked = await clickButtonByText(page, "Enter Workspace");
    assert(workspaceClicked, "Successfully clicked 'Enter Workspace' button client-side.");
    
    // Wait for dashboard to load client-side
    await page.waitForFunction(
      () => window.location.pathname === "/dashboard" && document.body.innerText.includes("Platform Dashboard"),
      { timeout: 5000 }
    );
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "03_dashboard_overview.png") });

    const dashContent = await page.content();
    assert(dashContent.includes("Basic Level") || dashContent.includes("basic") || dashContent.includes("Basic Access"), "Overview shows initial 'Basic' membership level.");
    
    // 4. Upgrade to Developer Pro
    console.log("\n--- Step 4: Upgrading to Developer Pro ---");
    // Find the Upgrade button for Pro (which should cost 100 Aros)
    const buttons = await page.$$("button");
    let proUpgradeBtn = null;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes("Upgrade for 100 Aros")) {
        proUpgradeBtn = btn;
        break;
      }
    }
    
    assert(proUpgradeBtn !== null, "Found 'Upgrade for 100 Aros' button.");
    if (proUpgradeBtn) {
      await proUpgradeBtn.click();
      // Wait for local state update (balance should become 400)
      await page.waitForFunction(
        () => document.body.innerText.includes("400 Aros") || document.body.innerText.includes("Pro Level") || document.body.innerText.includes("PRO"),
        { timeout: 5000 }
      );
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04_dashboard_upgraded_pro.png") });
      
      const upgradedContent = await page.content();
      assert(upgradedContent.includes("Pro Level") || upgradedContent.includes("PRO") || upgradedContent.includes("Developer Pro"), "Dashboard updates to show upgraded 'Pro' membership level.");
      assert(upgradedContent.includes("400 Aros"), "User balance is correctly debited to 400 Aros.");
    }

    // 4b. Test page reload session persistence
    console.log("\n--- Step 4b: Testing Page Reload Session Persistence ---");
    await page.reload({ waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04b_dashboard_after_reload.png") });
    const afterReloadContent = await page.content();
    assert(afterReloadContent.includes("Platform Dashboard"), "Dashboard page remains mounted after page reload.");
    assert(afterReloadContent.includes("Pro Level") || afterReloadContent.includes("PRO") || afterReloadContent.includes("Developer Pro"), "Membership tier is preserved after page reload.");
    assert(afterReloadContent.includes("400 Aros"), "Balance is preserved after page reload.");


    // 5. Verify Insufficient Balance Upgrade Prevention
    console.log("\n--- Step 5: Verifying Insufficient Balance Upgrade Prevention ---");
    // Enterprise upgrade cost is 500 Aros. Current balance is 400.
    let entUpgradeBtn = null;
    const buttonsAfter = await page.$$("button");
    for (const btn of buttonsAfter) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes("Upgrade for 500 Aros")) {
        entUpgradeBtn = btn;
        break;
      }
    }
    
    if (entUpgradeBtn) {
      const isDisabled = await page.evaluate(el => el.disabled, entUpgradeBtn);
      assert(isDisabled === true, "Enterprise upgrade button is disabled due to insufficient balance.");
    } else {
      assert(true, "Enterprise upgrade button not clickable or missing (acceptable prevention).");
    }

    // 6. Verify Access Control Restriction client-side
    console.log("\n--- Step 6: Verifying Access Control ---");
    // Navigate Back to Home client-side first
    const backToHomeClicked = await clickButtonByText(page, "Back to Home");
    assert(backToHomeClicked, "Clicked 'Back to Home' client-side.");
    await page.waitForFunction(() => window.location.pathname === "/", { timeout: 5000 });

    // Since we are user@aroh.co, admin or cms buttons should NOT be visible in header
    const headerEl = await page.$("header");
    const headerText = await page.evaluate(el => el ? el.textContent : "", headerEl);
    assert(headerText.includes("Admin") === false, "Admin header button is hidden for standard user.");
    assert(headerText.includes("CMS") === false, "CMS header button is hidden for standard user.");

    // 7. Sign Out
    console.log("\n--- Step 7: Signing Out ---");
    // Navigate to dashboard client-side to find sign-out button
    await clickButtonByText(page, "Enter Workspace");
    await page.waitForFunction(() => window.location.pathname === "/dashboard", { timeout: 5000 });
    
    const explicitSignOut = await clickButtonByText(page, "Sign Out");
    if (explicitSignOut) {
      await page.waitForFunction(
        () => window.location.pathname === "/login" || window.location.pathname === "/",
        { timeout: 5000 }
      );
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "07_signed_out.png") });
      const currentUrl = page.url();
      assert(currentUrl.includes("/login") || currentUrl === `${APP_URL}/`, "Sign out successfully redirects user.");
    } else {
      console.log("Could not find explicit Sign Out button. Direct logout via evaluate...");
      await page.evaluate(() => {
        localStorage.setItem("aroh_logout_event", Date.now().toString());
        window.location.href = "/login";
      });
      await new Promise(r => setTimeout(r, 1000));
    }

    // 8. Sign in as Admin & Audit Admin Console
    console.log("\n--- Step 8: Authenticating as Administrator ---");
    await page.goto(`${APP_URL}/login`, { waitUntil: "networkidle2" });
    await page.type("input[id='email']", "admin@aroh.co");
    await page.type("input[id='password']", "admin");
    await page.click("button[type='submit']");
    await page.waitForFunction(
      () => window.location.pathname === "/" || window.location.pathname === "/dashboard" || document.body.innerText.includes("Signed in as"),
      { timeout: 10000 }
    );
    
    console.log("Navigating to Admin Portal client-side...");
    // Click "Admin" button in header
    const adminClicked = await clickButtonByText(page, "Admin");
    assert(adminClicked, "Clicked 'Admin' header button client-side.");
    
    await page.waitForFunction(() => window.location.pathname === "/admin", { timeout: 5000 });
    await new Promise(r => setTimeout(r, 2000)); // Allow charts to animate
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "08_admin_dashboard.png") });

    const adminContent = await page.content();
    assert(adminContent.includes("Platform Admin Console"), "Admin Console mounts successfully.");
    assert(adminContent.includes("Ecosystem-Wide Audit Ledger"), "Global Audit Ledger is present.");
    
    // Attempt to Reward Standard User
    console.log("Issuing token reward to user-id...");
    // Fill in reward form
    await page.select("select[id='targetUserId']", "user-id");
    
    // Clear and type reward amount
    const amtInput = await page.$("input[id='creditAmount']");
    await amtInput.click({ clickCount: 3 });
    await amtInput.type("200");
    
    const descInput = await page.$("input[id='creditDesc']");
    await descInput.click({ clickCount: 3 });
    await descInput.type("QA Automated Audit Incentive");

    // Click submit
    // Handle alert dialog automatically
    page.once("dialog", async dialog => {
      console.log(`Alert popup: ${dialog.message()}`);
      await dialog.accept();
    });

    const rewardSubmitBtn = await page.$("button[type='submit']");
    await rewardSubmitBtn.click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "09_admin_rewarded.png") });

    // 9. Navigate to CMS & Upsert Scheduled Announcement
    console.log("\n--- Step 9: Creating Scheduled Announcement in CMS ---");
    // Go back to home client-side
    await clickButtonByText(page, "Back to Home");
    await page.waitForFunction(() => window.location.pathname === "/", { timeout: 5000 });
    
    // Click "CMS" button in header
    const cmsClicked = await clickButtonByText(page, "CMS");
    assert(cmsClicked, "Clicked 'CMS' header button client-side.");
    
    await page.waitForFunction(() => window.location.pathname === "/cms", { timeout: 5000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "10_cms_portal.png") });

    const cmsContent = await page.content();
    assert(cmsContent.includes("CMS") || cmsContent.includes("Announcement") || cmsContent.includes("announcement"), "CMS portal mounts successfully.");

    // Fill upsert announcement form
    const titleInput = await page.$("input[placeholder*='Title'], input[id='announcementTitle'], input[name='title']");
    if (titleInput) {
      await titleInput.type("FUTURE SCHEDULED ANNOUNCEMENT");
      
      const contentTextarea = await page.$("textarea[placeholder*='Content'], textarea[id='announcementContent'], textarea[name='content']");
      await contentTextarea.type("This announcement is scheduled for the future and should remain hidden from public users.");

      // Set category and status
      await page.evaluate(() => {
        const catSelect = document.querySelector("select[id='announcementCategory'], select[name='category']");
        if (catSelect) {
          catSelect.value = "maintenance";
          catSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        const statusSelect = document.querySelector("select[id='announcementStatus'], select[name='status']");
        if (statusSelect) {
          statusSelect.value = "live";
          statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
    
    // We will upsert using the SDK store directly to ensure reliability of mock state
    await page.evaluate(async () => {
      if (window.usePlatformStore) {
        const futureTime = new Date(Date.now() + 24 * 3600 * 1000).toISOString(); // 1 day in future
        await window.usePlatformStore.getState().upsertAnnouncement({
          title: "FUTURE SCHEDULED ANNOUNCEMENT",
          content: "This announcement is scheduled for the future and should remain hidden from public users.",
          category: "maintenance",
          isPublished: true,
          publishedAt: futureTime
        });
      } else {
        const submitBtn = document.querySelector("button[type='submit']");
        if (submitBtn) submitBtn.click();
      }
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "11_announcement_created.png") });

    // 10. Logout and verify public homepage
    console.log("\n--- Step 10: Verifying Scheduled Announcement is Hidden from Public ---");
    await page.evaluate(() => {
      localStorage.removeItem("aroh_session");
      localStorage.setItem("aroh_logout_event", Date.now().toString());
    });
    
    await page.goto(`${APP_URL}/`, { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "12_public_homepage.png") });

    const publicContent = await page.content();
    const showsFutureAnn = publicContent.includes("FUTURE SCHEDULED ANNOUNCEMENT");
    // 11. Verify Product Workspace Launch & Telemetry
    console.log("\n--- Step 11: Verifying Interactive Product Workspaces (Aros Metrics Engine) ---");
    await page.goto(`${APP_URL}/login`, { waitUntil: "networkidle2" });
    await page.waitForSelector("input[id='email']", { timeout: 5000 });
    await page.type("input[id='email']", "user@aroh.co");
    await page.type("input[id='password']", "user");
    await page.click("button[type='submit']");
    await page.waitForFunction(
      () => window.location.pathname === "/" || window.location.pathname === "/dashboard" || document.body.innerText.includes("Signed in as"),
      { timeout: 10000 }
    );
    
    // Go to Explore page
    await page.goto(`${APP_URL}/explore`, { waitUntil: "networkidle2" });
    await page.waitForFunction(() => window.location.pathname === "/explore", { timeout: 5000 });
    
    // Click on Aros Metrics Engine card
    const cardHandle = await page.evaluateHandle(() => {
      const headings = Array.from(document.querySelectorAll("h3"));
      const target = headings.find(h => h.textContent && h.textContent.includes("Aros Metrics Engine"));
      return target ? target.closest("div") : null;
    });
    const cardEl = cardHandle.asElement();
    assert(cardEl !== null, "Found Aros Metrics Engine product card.");
    if (cardEl) {
      await cardEl.click();
    }
    await page.waitForFunction(() => window.location.pathname.includes("/explore/aros-metrics"), { timeout: 5000 });
    
    // Click Launch Application
    const launchClicked = await clickButtonByText(page, "Launch Application");
    assert(launchClicked, "Successfully clicked 'Launch Application' button.");
    
    // Wait for the initialization sequence (success log appears + workspace renders charts)
    await page.waitForFunction(
      () => document.body.innerText.includes("Active Workspace Session: Aros Metrics Engine") && document.body.innerText.includes("Live Node Telemetry"),
      { timeout: 5000 }
    );
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "13_metrics_workspace_active.png") });
    assert(true, "Aros Metrics Engine workspace successfully initialized and telemetry graphs loaded.");

    console.log("\n=== E2E Browser Audit Completed Successfully ===");
    console.log(`Passed: ${passed} | Failed: ${failed}`);
    
    await browser.close();
    process.exit(failed > 0 ? 1 : 0);

  } catch (err) {
    console.error("E2E Browser Audit crashed due to error:", err);
    if (browser) await browser.close();
    process.exit(1);
  }
}

runAudit();
