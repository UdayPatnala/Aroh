import { describe, it, expect, beforeEach } from "vitest";
import {
  purchaseSafetyService,
  PurchaseEligibilityStateSchema,
  UserPurchaseEligibilitySchema,
  PurchaseConsentRecordSchema,
  PaymentIntentRecordSchema,
  ArosLedgerEntrySchema,
  RefundRecordSchema,
  DisputeRecordSchema,
  TransactionReceiptSchema,
  TransactionLimitsConfigSchema,
  TransactionAuditEventSchema,
  MockPaymentProvider,
  initializeMockDb
} from "../src";

describe("AROH Aros Age, Consent, Purchase Safety & Compliance Hardening Suite", () => {
  beforeEach(() => {
    purchaseSafetyService.clear();
    initializeMockDb();
  });

  // ==========================================================================
  // 1. AGE & ELIGIBILITY ENFORCEMENT (FAIL-CLOSED)
  // ==========================================================================
  describe("Age & Purchase Eligibility State Machine", () => {
    it("fails closed when account age status is UNKNOWN", () => {
      const check = purchaseSafetyService.assertPurchaseEligible("unknown-user");
      expect(check.eligible).toBe(false);
      expect(check.status).toBe("UNKNOWN");
    });

    it("fails closed when account status is MINOR_PAYMENT_BLOCKED", () => {
      purchaseSafetyService.setUserEligibility("minor-user", "MINOR_PAYMENT_BLOCKED");
      const check = purchaseSafetyService.assertPurchaseEligible("minor-user");
      expect(check.eligible).toBe(false);
      expect(check.status).toBe("MINOR_PAYMENT_BLOCKED");
      expect(check.reason).toContain("persons under 18");
    });

    it("fails closed when account status is SUSPENDED", () => {
      purchaseSafetyService.setUserEligibility("suspended-user", "SUSPENDED");
      const check = purchaseSafetyService.assertPurchaseEligible("suspended-user");
      expect(check.eligible).toBe(false);
      expect(check.status).toBe("SUSPENDED");
    });

    it("fails closed when age verification is PENDING", () => {
      purchaseSafetyService.setUserEligibility("pending-user", "AGE_VERIFICATION_PENDING");
      const check = purchaseSafetyService.assertPurchaseEligible("pending-user");
      expect(check.eligible).toBe(false);
      expect(check.status).toBe("AGE_VERIFICATION_PENDING");
    });

    it("fails closed when age verification FAILED", () => {
      purchaseSafetyService.setUserEligibility("failed-user", "AGE_VERIFICATION_FAILED");
      const check = purchaseSafetyService.assertPurchaseEligible("failed-user");
      expect(check.eligible).toBe(false);
      expect(check.status).toBe("AGE_VERIFICATION_FAILED");
    });

    it("permits purchase exclusively when account is ADULT_ELIGIBLE", () => {
      purchaseSafetyService.setUserEligibility("adult-user", "ADULT_ELIGIBLE", "self_attestation");
      const check = purchaseSafetyService.assertPurchaseEligible("adult-user");
      expect(check.eligible).toBe(true);
      expect(check.status).toBe("ADULT_ELIGIBLE");
    });
  });

  // ==========================================================================
  // 2. SERVER-SIDE PURCHASE INITIATION & MINOR BLOCKING
  // ==========================================================================
  describe("Server-Side Purchase Intent Creation", () => {
    const validConsent = {
      user_id: "adult-user",
      package_id: "pkg_1500",
      aros_quantity: 1500,
      amount_usd_cents: 1500,
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
      idempotency_key: "idemp_test_001"
    };

    it("blocks minor from creating payment intent even with valid payload", async () => {
      purchaseSafetyService.setUserEligibility("minor-user", "MINOR_PAYMENT_BLOCKED");

      const res = await purchaseSafetyService.initiateArosPurchase({
        userId: "minor-user",
        packageId: "pkg_1500",
        consent: { ...validConsent, user_id: "minor-user" },
        idempotencyKey: "key_minor_001"
      });

      expect(res.success).toBe(false);
      expect(res.status).toBe("MINOR_PAYMENT_BLOCKED");
      expect(res.intent).toBeUndefined();
    });

    it("successfully creates payment intent for verified adult user", async () => {
      purchaseSafetyService.setUserEligibility("adult-user", "ADULT_ELIGIBLE");

      const res = await purchaseSafetyService.initiateArosPurchase({
        userId: "adult-user",
        packageId: "pkg_1500",
        consent: validConsent,
        idempotencyKey: "key_adult_001"
      });

      expect(res.success).toBe(true);
      expect(res.intent).toBeDefined();
      expect(res.intent?.arosAmount).toBe(1500);
      expect(res.intent?.amountUsdCents).toBe(1500);
      expect(res.intent?.status).toBe("PAYMENT_INITIATED");
    });

    it("enforces strict idempotency on duplicate purchase initiation", async () => {
      purchaseSafetyService.setUserEligibility("adult-user", "ADULT_ELIGIBLE");

      const res1 = await purchaseSafetyService.initiateArosPurchase({
        userId: "adult-user",
        packageId: "pkg_1500",
        consent: validConsent,
        idempotencyKey: "key_idemp_replay"
      });

      const res2 = await purchaseSafetyService.initiateArosPurchase({
        userId: "adult-user",
        packageId: "pkg_1500",
        consent: validConsent,
        idempotencyKey: "key_idemp_replay"
      });

      expect(res1.success).toBe(true);
      expect(res2.success).toBe(true);
      expect(res1.intent?.id).toBe(res2.intent?.id);
    });
  });

  // ==========================================================================
  // 3. ATOMIC SETTLEMENT & LEDGER INTEGRITY
  // ==========================================================================
  describe("Atomic Settlement & Authoritative Ledger", () => {
    it("credits user wallet and generates receipt on verified payment fulfillment", async () => {
      purchaseSafetyService.setUserEligibility("user-id", "ADULT_ELIGIBLE");

      const initRes = await purchaseSafetyService.initiateArosPurchase({
        userId: "user-id",
        packageId: "pkg_500",
        consent: {
          user_id: "user-id",
          package_id: "pkg_500",
          aros_quantity: 500,
          amount_usd_cents: 500,
          currency: "USD",
          purchaser_is_18_attested: true,
          aros_classification_acknowledged: true,
          refund_policy_acknowledged: true,
          terms_version: "1.0.0",
          policy_version: "1.0.0",
          aros_policy_version: "1.0.0",
          age_policy_version: "1.0.0",
          source: "web_checkout",
          affirmative_action: "click_confirm",
          status: "active",
          idempotency_key: "idemp_settle_001"
        },
        idempotencyKey: "idemp_settle_001"
      });

      const settleRes = await purchaseSafetyService.settlePaymentFulfillment(
        initRes.intent!.id,
        "ch_stripe_mock_001"
      );

      expect(settleRes.success).toBe(true);
      expect(settleRes.alreadySettled).toBe(false);
      expect(settleRes.ledgerEntry).toBeDefined();
      expect(settleRes.ledgerEntry?.quantity).toBe(500);
      expect(settleRes.ledgerEntry?.operation_type).toBe("credit_purchase");
      expect(settleRes.receipt).toBeDefined();
      expect(settleRes.receipt?.aros_quantity).toBe(500);
    });

    it("prevents double-crediting when duplicate settlement webhook is received", async () => {
      purchaseSafetyService.setUserEligibility("user-id", "ADULT_ELIGIBLE");

      const initRes = await purchaseSafetyService.initiateArosPurchase({
        userId: "user-id",
        packageId: "pkg_500",
        consent: {
          user_id: "user-id",
          package_id: "pkg_500",
          aros_quantity: 500,
          amount_usd_cents: 500,
          currency: "USD",
          purchaser_is_18_attested: true,
          aros_classification_acknowledged: true,
          refund_policy_acknowledged: true,
          terms_version: "1.0.0",
          policy_version: "1.0.0",
          aros_policy_version: "1.0.0",
          age_policy_version: "1.0.0",
          source: "web_checkout",
          affirmative_action: "click_confirm",
          status: "active",
          idempotency_key: "idemp_replay_webhook"
        },
        idempotencyKey: "idemp_replay_webhook"
      });

      const firstSettle = await purchaseSafetyService.settlePaymentFulfillment(
        initRes.intent!.id,
        "ch_dup_webhook"
      );
      expect(firstSettle.success).toBe(true);
      expect(firstSettle.alreadySettled).toBe(false);

      const secondSettle = await purchaseSafetyService.settlePaymentFulfillment(
        initRes.intent!.id,
        "ch_dup_webhook"
      );
      expect(secondSettle.success).toBe(true);
      expect(secondSettle.alreadySettled).toBe(true);
    });
  });

  // ==========================================================================
  // 4. REFUNDS & DISPUTES
  // ==========================================================================
  describe("Refunds & Disputes", () => {
    it("processes refund and reverses unconsumed Aros", async () => {
      purchaseSafetyService.setUserEligibility("user-id", "ADULT_ELIGIBLE");

      const initRes = await purchaseSafetyService.initiateArosPurchase({
        userId: "user-id",
        packageId: "pkg_500",
        consent: {
          user_id: "user-id",
          package_id: "pkg_500",
          aros_quantity: 500,
          amount_usd_cents: 500,
          currency: "USD",
          purchaser_is_18_attested: true,
          aros_classification_acknowledged: true,
          refund_policy_acknowledged: true,
          terms_version: "1.0.0",
          policy_version: "1.0.0",
          aros_policy_version: "1.0.0",
          age_policy_version: "1.0.0",
          source: "web_checkout",
          affirmative_action: "click_confirm",
          status: "active",
          idempotency_key: "idemp_refund_test"
        },
        idempotencyKey: "idemp_refund_test"
      });

      await purchaseSafetyService.settlePaymentFulfillment(initRes.intent!.id, "ch_refund_target");

      const refundRes = await purchaseSafetyService.processRefund({
        transactionId: initRes.intent!.id,
        amountCents: 500,
        reason: "duplicate_payment",
        actor: "admin_support"
      });

      expect(refundRes.success).toBe(true);
      expect(refundRes.refund?.aros_recovery_status).toBe("debited");
      expect(refundRes.refund?.status).toBe("processed");
    });

    it("records a formal transaction dispute", () => {
      const dispute = purchaseSafetyService.recordDispute("pi_mock_123", "Unauthorized card charge");
      expect(dispute.dispute_id.startsWith("disp_")).toBe(true);
      expect(dispute.state).toBe("DISPUTE_OPENED");
    });
  });

  // ==========================================================================
  // 5. VELOCITY & TRANSACTION LIMITS
  // ==========================================================================
  describe("Transaction Limits & Velocity Safeguards", () => {
    it("rejects purchases exceeding maximum single transaction limit", async () => {
      purchaseSafetyService.setUserEligibility("adult-user", "ADULT_ELIGIBLE");
      purchaseSafetyService.setLimits({ maxSinglePurchaseCents: 1000 }); // $10 cap

      const res = await purchaseSafetyService.initiateArosPurchase({
        userId: "adult-user",
        packageId: "pkg_5000", // $50 package
        consent: {
          user_id: "adult-user",
          package_id: "pkg_5000",
          aros_quantity: 5000,
          amount_usd_cents: 5000,
          currency: "USD",
          purchaser_is_18_attested: true,
          aros_classification_acknowledged: true,
          refund_policy_acknowledged: true,
          terms_version: "1.0.0",
          policy_version: "1.0.0",
          aros_policy_version: "1.0.0",
          age_policy_version: "1.0.0",
          source: "web_checkout",
          affirmative_action: "click_confirm",
          status: "active",
          idempotency_key: "idemp_cap_exceeded"
        },
        idempotencyKey: "idemp_cap_exceeded"
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Maximum single purchase");
    });
  });

  // ==========================================================================
  // 6. AUDIT TRAIL & ZERO SENSITIVE CREDENTIALS
  // ==========================================================================
  describe("Audit Trail & Zero Sensitive Credentials Logging", () => {
    it("records audit events for blocked minor attempts with zero credentials", () => {
      purchaseSafetyService.setUserEligibility("minor-user", "MINOR_PAYMENT_BLOCKED");
      purchaseSafetyService.assertPurchaseEligible("minor-user");

      const audits = purchaseSafetyService.getAuditEvents("minor-user");
      expect(audits.length).toBeGreaterThan(0);
      expect(audits[0].event_type).toBe("purchase_blocked_minor");

      const serialized = JSON.stringify(audits);
      expect(serialized).not.toContain("card");
      expect(serialized).not.toContain("cvv");
      expect(serialized).not.toContain("upi");
      expect(serialized).not.toContain("password");
    });
  });
});
