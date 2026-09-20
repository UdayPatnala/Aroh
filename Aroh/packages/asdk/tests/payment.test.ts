import { describe, it, expect, beforeEach } from "vitest";
import {
  AROS_TIER_PACKAGES,
  AROS_PER_USD,
  ArosTierPackageSchema,
  CreateCheckoutSessionRequestSchema,
  CheckoutSessionRecordSchema,
  mockPaymentService,
  mockWalletService,
  initializeMockDb,
  purchaseSafetyService
} from "../src";

describe("Fiat-to-Aros Settlement On-Ramp — @aroh/asdk Suite", () => {
  beforeEach(() => {
    mockPaymentService.clear();
    purchaseSafetyService.clear();
    initializeMockDb();
    // Default test user configured as adult eligible
    purchaseSafetyService.setUserEligibility("user-id", "ADULT_ELIGIBLE");
  });

  describe("Tier Packages & Fixed Exchange Rate Math", () => {
    it("enforces fixed conversion rate of $1.00 USD = 100 Aros", () => {
      expect(AROS_PER_USD).toBe(100);
    });

    it("validates all canonical AROS_TIER_PACKAGES schemas and pricing", () => {
      expect(AROS_TIER_PACKAGES).toHaveLength(3);

      for (const pkg of AROS_TIER_PACKAGES) {
        const validated = ArosTierPackageSchema.parse(pkg);
        expect(validated.id).toBeDefined();
        // 1 cent = 1 Aros -> priceUsdCents === arosAmount
        expect(validated.priceUsdCents).toBe(validated.arosAmount);
      }
    });

    it("verifies package catalog lookup by ID", () => {
      const pkg500 = mockPaymentService.getPackage("pkg_500");
      expect(pkg500).toBeDefined();
      expect(pkg500?.arosAmount).toBe(500);
      expect(pkg500?.priceUsdCents).toBe(500);

      const invalidPkg = mockPaymentService.getPackage("non_existent");
      expect(invalidPkg).toBeUndefined();
    });
  });

  describe("Checkout Session Creation", () => {
    it("creates valid pending checkout session with cs_ identifier", () => {
      const session = mockPaymentService.createCheckoutSession("user-id", {
        packageId: "pkg_1500",
        successUrl: "https://aroh-os.vercel.app/dashboard/purchase"
      });

      expect(session.id.startsWith("cs_")).toBe(true);
      expect(session.userId).toBe("user-id");
      expect(session.packageId).toBe("pkg_1500");
      expect(session.arosAmount).toBe(1500);
      expect(session.amountUsdCents).toBe(1500);
      expect(session.status).toBe("pending");
      expect(session.checkoutUrl).toContain(session.id);

      const validated = CheckoutSessionRecordSchema.parse(session);
      expect(validated.status).toBe("pending");
    });

    it("rejects invalid session creation payloads", () => {
      expect(() =>
        mockPaymentService.createCheckoutSession("user-id", {
          packageId: "invalid_pkg"
        })
      ).toThrow(/Invalid package ID/);

      expect(() =>
        CreateCheckoutSessionRequestSchema.parse({
          packageId: ""
        })
      ).toThrow();
    });
  });

  describe("Settlement Engine & Idempotency Guarantee", () => {
    it("credits user wallet exclusively via immutable ledger transactions", async () => {
      const session = mockPaymentService.createCheckoutSession("user-id", {
        packageId: "pkg_500"
      });

      const initialWallet = mockWalletService.getWallet("user-id");
      const initialBalance = initialWallet?.balance ?? 500;

      const result = await mockPaymentService.settlePayment(
        session.id,
        "ch_stripe_test_001"
      );

      expect(result.success).toBe(true);
      expect(result.alreadyProcessed).toBe(false);
      expect(result.transaction).toBeDefined();
      expect(result.transaction?.amount).toBe(500);
      expect(result.transaction?.type).toBe("reward"); // Authoritative credit
      expect(result.session?.status).toBe("completed");
      expect(result.session?.chargeId).toBe("ch_stripe_test_001");
      expect(result.session?.settledAt).toBeDefined();

      const updatedWallet = mockWalletService.getWallet("user-id");
      expect(updatedWallet.balance).toBe(initialBalance + 500);
    });

    it("guarantees strict idempotency: duplicate settlements do NOT double-credit", async () => {
      const session = mockPaymentService.createCheckoutSession("user-id", {
        packageId: "pkg_1500"
      });

      // First settlement
      const firstResult = await mockPaymentService.settlePayment(
        session.id,
        "ch_charge_id_replay"
      );
      expect(firstResult.success).toBe(true);
      expect(firstResult.alreadyProcessed).toBe(false);

      const balanceAfterFirst = mockWalletService.getWallet("user-id").balance;

      // Second settlement attempt (replay attack or duplicate webhook delivery)
      const secondResult = await mockPaymentService.settlePayment(
        session.id,
        "ch_charge_id_replay"
      );
      expect(secondResult.success).toBe(true);
      expect(secondResult.alreadyProcessed).toBe(true); // Flagged as duplicate

      // Verify balance did not change
      const balanceAfterSecond = mockWalletService.getWallet("user-id").balance;
      expect(balanceAfterSecond).toBe(balanceAfterFirst);
    });
  });

  describe("Stripe Webhook Processing", () => {
    it("handles checkout.session.completed event and triggers settlement", async () => {
      const session = mockPaymentService.createCheckoutSession("user-id", {
        packageId: "pkg_5000"
      });

      const webhookPayload = {
        id: "evt_stripe_webhook_001",
        type: "checkout.session.completed",
        data: {
          object: {
            id: session.id,
            payment_intent: "ch_pi_test_999",
            customer_email: "user@aroh.co"
          }
        }
      };

      const result = await mockPaymentService.handleStripeWebhook(webhookPayload);
      expect(result.success).toBe(true);
      expect(result.handled).toBe(true);
      expect(result.session?.status).toBe("completed");
      expect(result.alreadyProcessed).toBe(false);
    });

    it("safely ignores unrecognized webhook events without throwing", async () => {
      const result = await mockPaymentService.handleStripeWebhook({
        type: "customer.subscription.created"
      });
      expect(result.success).toBe(true);
      expect(result.handled).toBe(false);
    });
  });
});
