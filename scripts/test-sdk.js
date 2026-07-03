// AROH Automated Quality Assurance Integration Test

// 1. Mock Browser LocalStorage for Node.js Environment
if (typeof window === "undefined") {
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    }
  };
}

console.log("=== Running AROH SDK QA Automation Tests ===");

// 2. Import SDK Services
const { mockAuthService, mockWalletService } = require("../packages/asdk/src/services/firebase.ts");

async function runTests() {
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
    // Test 1: User Login
    console.log("\n--- Testing Authentication ---");
    const adminAuth = await mockAuthService.login("admin@aroh.co", "admin");
    assert(adminAuth.user.role === "admin", "Admin role matches 'admin'");
    assert(adminAuth.wallet.balance === 5000, "Admin wallet balance is seeded with 5000 Aros");

    const userAuth = await mockAuthService.login("user@aroh.co", "user");
    assert(userAuth.user.role === "user", "User role matches 'user'");
    assert(userAuth.wallet.balance === 500, "User wallet balance is seeded with 500 Aros");

    // Test 2: Wallet Credit
    console.log("\n--- Testing Wallet Ledger Credits ---");
    const beforeCredit = userAuth.wallet.balance;
    const creditResult = await mockWalletService.creditWallet("user-id", 200, "Test Reward credit");
    assert(creditResult.wallet.balance === beforeCredit + 200, "Credit wallet increments balance by 200");
    
    const txs = await mockWalletService.getTransactions("user-id");
    const latestTx = txs[0];
    assert(latestTx.amount === 200 && latestTx.type === "reward", "Ledger transaction recorded credit successfully");

    // Test 3: Membership Upgrade (Successful)
    console.log("\n--- Testing Membership Upgrades ---");
    const upgradeResult = await mockWalletService.upgradeMembership("user-id", "pro", 100);
    assert(upgradeResult.profile.membershipLevel === "pro", "Profile upgraded to Pro tier successfully");
    assert(upgradeResult.wallet.balance === creditResult.wallet.balance - 100, "Aros balance correctly debited by 100");

    const upgradeTxs = await mockWalletService.getTransactions("user-id");
    assert(upgradeTxs[0].type === "membership_upgrade", "Ledger transaction recorded upgrade type successfully");

    // Test 4: Membership Upgrade (Insufficient Balance Failure check)
    console.log("\n--- Testing Fraud / Insufficient Balance Prevention ---");
    let threwError = false;
    try {
      // Wallet balance is now 600. Cost of Enterprise is 500, cost of Pro was 100, remaining balance should be 600.
      // Wait, user had 500 (initial) + 200 (credit) = 700. Debited 100 (upgrade to pro), remaining = 600.
      // Trying to buy Enterprise for 700 should fail!
      await mockWalletService.upgradeMembership("user-id", "enterprise", 700);
    } catch (err) {
      threwError = true;
      assert(err.message === "Insufficient Aros balance", "Throw error on insufficient balance upgrade");
    }
    assert(threwError === true, "Insufficient balance transaction rejected as expected");

    console.log(`\n=== QA Test Run Finished ===`);
    console.log(`Passed: ${passed} | Failed: ${failed}`);

    if (failed > 0) {
      process.exit(1);
    }

  } catch (err) {
    console.error("Test execution aborted due to unhandled error:", err);
    process.exit(1);
  }
}

runTests();
