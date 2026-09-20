import { describe, it, expect, beforeEach } from "vitest";
import { purchaseSafetyService } from "../src/services/purchase-safety";
import { initializeMockDb } from "../src";

describe("Aros Dispute & Receipt Service", () => {
  const testUserId = "user-id";

  const createValidConsent = (packageId = "pkg_1500", aros = 1500, cents = 1500) => ({
    user_id: testUserId,
    package_id: packageId,
    aros_quantity: aros,
    amount_usd_cents: cents,
    currency: "USD",
    purchaser_is_18_attested: true as const,
    aros_classification_acknowledged: true as const,
    refund_policy_acknowledged: true as const,
    terms_version: "1.0.0",
    policy_version: "1.0.0",
    aros_policy_version: "1.0.0",
    age_policy_version: "1.0.0",
    source: "web_checkout" as const,
    affirmative_action: "click_confirm",
    status: "active" as const,
    idempotency_key: `idemp_consent_${Date.now()}_${Math.random()}`
  });

  beforeEach(() => {
    purchaseSafetyService.clear();
    initializeMockDb();
    purchaseSafetyService.setUserEligibility(testUserId, "ADULT_ELIGIBLE", "self_attestation");
  });

  it("should generate, store, and retrieve cryptographic transaction receipts", async () => {
    // 1. Initiate and settle purchase
    const intentRes = await purchaseSafetyService.initiateArosPurchase({
      userId: testUserId,
      packageId: "pkg_1500",
      consent: createValidConsent("pkg_1500", 1500, 1500),
      idempotencyKey: "idem_receipt_test_01"
    });

    expect(intentRes.success).toBe(true);
    const intent = intentRes.intent!;

    const settleRes = await purchaseSafetyService.settlePaymentFulfillment(
      intent.id,
      "prov_tx_receipt_test"
    );

    expect(settleRes.success).toBe(true);
    expect(settleRes.receipt).toBeDefined();

    const receipt = settleRes.receipt!;
    expect(receipt.receipt_id).toMatch(/^rcpt_/);
    expect(receipt.transaction_id).toBe(intent.id);
    expect(receipt.user_id).toBe(testUserId);
    expect(receipt.aros_quantity).toBe(1500);
    expect(receipt.payment_amount_cents).toBe(1500);

    // 2. Query by receipt ID
    const fetchedById = purchaseSafetyService.getReceipt(receipt.receipt_id);
    expect(fetchedById).toEqual(receipt);

    // 3. Query by transaction ID
    const fetchedByTx = purchaseSafetyService.getReceiptByTransactionId(intent.id);
    expect(fetchedByTx).toEqual(receipt);

    // 4. Query user receipts
    const userReceipts = purchaseSafetyService.getUserReceipts(testUserId);
    expect(userReceipts).toHaveLength(1);
    expect(userReceipts[0].receipt_id).toBe(receipt.receipt_id);
  });

  it("should record, query, and audit user dispute submissions", async () => {
    // 1. Create a settled purchase intent
    const intentRes = await purchaseSafetyService.initiateArosPurchase({
      userId: testUserId,
      packageId: "pkg_500",
      consent: createValidConsent("pkg_500", 500, 500),
      idempotencyKey: "idem_dispute_test_01"
    });

    const intent = intentRes.intent!;
    await purchaseSafetyService.settlePaymentFulfillment(intent.id, "prov_dispute_tx");

    // 2. Record dispute
    const disputeReason = "Unauthorized transaction query for credit package";
    const dispute = purchaseSafetyService.recordDispute(intent.id, disputeReason);

    expect(dispute.dispute_id).toMatch(/^disp_/);
    expect(dispute.transaction_id).toBe(intent.id);
    expect(dispute.user_id).toBe(testUserId);
    expect(dispute.state).toBe("DISPUTE_OPENED");
    expect(dispute.reason).toBe(disputeReason);

    // 3. Query dispute by dispute_id
    const fetchedDispute = purchaseSafetyService.getDispute(dispute.dispute_id);
    expect(fetchedDispute).toEqual(dispute);

    // 4. Query user disputes
    const userDisputes = purchaseSafetyService.getUserDisputes(testUserId);
    expect(userDisputes).toHaveLength(1);
    expect(userDisputes[0].dispute_id).toBe(dispute.dispute_id);

    // 5. Verify audit event was generated
    const audits = purchaseSafetyService.getAuditEvents(testUserId);
    const disputeAudit = audits.find((a) => a.event_type === "dispute_recorded");
    expect(disputeAudit).toBeDefined();
    expect(disputeAudit?.transaction_id).toBe(intent.id);
  });
});
