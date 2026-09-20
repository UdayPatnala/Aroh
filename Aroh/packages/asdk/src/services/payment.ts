import crypto from "crypto";
import {
  AROS_TIER_PACKAGES,
  ArosTierPackage,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionRequestSchema,
  CheckoutSessionRecord,
  CheckoutSessionRecordSchema
} from "../schemas/payment";
import { mockWalletService } from "./firebase";
import { purchaseSafetyService } from "./purchase-safety";
import type { Transaction } from "../schemas";

export const AROS_PER_USD = 100; // $1.00 USD = 100 Aros (1 cent = 1 Aros)

export class PaymentSettlementService {
  private sessions: Map<string, CheckoutSessionRecord> = new Map();
  private processedCharges: Set<string> = new Set();

  clear(): void {
    this.sessions.clear();
    this.processedCharges.clear();
  }

  isLiveMode(): boolean {
    return Boolean(
      typeof process !== "undefined" &&
        process.env &&
        process.env.STRIPE_SECRET_KEY &&
        process.env.STRIPE_WEBHOOK_SECRET
    );
  }

  getPackage(packageId: string): ArosTierPackage | undefined {
    return AROS_TIER_PACKAGES.find((pkg) => pkg.id === packageId);
  }

  listPackages(): ArosTierPackage[] {
    return [...AROS_TIER_PACKAGES];
  }

  createCheckoutSession(
    userId: string,
    request: CreateCheckoutSessionRequest
  ): CheckoutSessionRecord {
    // HARD POLICY ENFORCEMENT: Block minors before creating any checkout session
    const eligibilityCheck = purchaseSafetyService.assertPurchaseEligible(userId);
    if (!eligibilityCheck.eligible) {
      throw new Error(eligibilityCheck.reason || "Account is not eligible to purchase Aros");
    }

    const validated = CreateCheckoutSessionRequestSchema.parse(request);
    const tierPackage = this.getPackage(validated.packageId);

    if (!tierPackage) {
      throw new Error(`Invalid package ID: "${validated.packageId}"`);
    }

    const sessionId = `cs_${crypto.randomBytes(12).toString("hex")}`;
    const baseUrl = validated.successUrl
      ? new URL(validated.successUrl).origin
      : "https://aroh-os.vercel.app";

    const checkoutUrl = `${baseUrl}/dashboard/purchase?session_id=${sessionId}&status=checkout_ready`;

    const record: CheckoutSessionRecord = {
      id: sessionId,
      userId,
      packageId: tierPackage.id,
      arosAmount: tierPackage.arosAmount,
      amountUsdCents: tierPackage.priceUsdCents,
      status: "pending",
      checkoutUrl,
      createdAt: new Date().toISOString()
    };

    CheckoutSessionRecordSchema.parse(record);
    this.sessions.set(sessionId, record);
    return { ...record };
  }

  getSession(sessionId: string): CheckoutSessionRecord | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    return { ...session };
  }

  async settlePayment(
    sessionId: string,
    chargeId?: string
  ): Promise<{
    success: boolean;
    alreadyProcessed: boolean;
    transaction?: Transaction;
    session?: CheckoutSessionRecord;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Checkout session not found: "${sessionId}"`);
    }

    // HARD POLICY ENFORCEMENT: Re-verify server-side eligibility at settlement boundary
    const eligibilityCheck = purchaseSafetyService.assertPurchaseEligible(session.userId);
    if (!eligibilityCheck.eligible) {
      throw new Error("Settlement rejected: account is not eligible for Aros purchase.");
    }

    const effectiveChargeId = chargeId || `ch_${crypto.randomBytes(12).toString("hex")}`;

    // Idempotency check: Charge ID or Session ID already settled
    if (
      this.processedCharges.has(sessionId) ||
      this.processedCharges.has(effectiveChargeId) ||
      session.status === "completed"
    ) {
      return {
        success: true,
        alreadyProcessed: true,
        session: { ...session }
      };
    }

    // Authoritative ledger credit
    const tierPackage = this.getPackage(session.packageId);
    const description = tierPackage
      ? `Fiat Purchase: ${session.arosAmount} Aros (${tierPackage.name})`
      : `Fiat Purchase: ${session.arosAmount} Aros`;

    const { transaction } = await mockWalletService.creditWallet(
      session.userId,
      session.arosAmount,
      description
    );

    // Mark as processed (idempotency guard)
    this.processedCharges.add(sessionId);
    this.processedCharges.add(effectiveChargeId);

    // Update session record
    session.status = "completed";
    session.settledAt = new Date().toISOString();
    session.chargeId = effectiveChargeId;
    this.sessions.set(sessionId, session);

    return {
      success: true,
      alreadyProcessed: false,
      transaction,
      session: { ...session }
    };
  }

  async handleStripeWebhook(
    payload: any,
    signatureHeader?: string
  ): Promise<{
    success: boolean;
    handled: boolean;
    session?: CheckoutSessionRecord;
    alreadyProcessed?: boolean;
    transaction?: Transaction;
  }> {
    // In live mode, verify signatureHeader using STRIPE_WEBHOOK_SECRET
    if (this.isLiveMode()) {
      if (!signatureHeader) {
        throw new Error("Missing stripe-signature header in production mode");
      }
    }

    const eventType = payload?.type;

    if (eventType === "checkout.session.completed") {
      const sessionObj = payload.data?.object;
      const sessionId = sessionObj?.id;
      const chargeId = sessionObj?.payment_intent || sessionObj?.id;

      if (!sessionId) {
        throw new Error("Missing session ID in checkout.session.completed payload");
      }

      const result = await this.settlePayment(sessionId, chargeId);
      return {
        success: true,
        handled: true,
        session: result.session,
        alreadyProcessed: result.alreadyProcessed,
        transaction: result.transaction
      };
    }

    return {
      success: true,
      handled: false
    };
  }
}

export const mockPaymentService = new PaymentSettlementService();
