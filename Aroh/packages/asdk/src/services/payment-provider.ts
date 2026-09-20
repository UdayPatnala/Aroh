import {
  PaymentLifecycleState,
  PurchaseConsentRecord,
  TransactionReceipt,
  RefundRecord
} from "../schemas/purchase-safety";

export interface CreatePaymentIntentParams {
  userId: string;
  packageId: string;
  amountCents: number;
  currency: string;
  arosAmount: number;
  consent: PurchaseConsentRecord;
  idempotencyKey: string;
}

export interface PaymentIntentResult {
  providerIntentId: string;
  providerSessionId: string;
  clientSecret?: string;
  checkoutUrl: string;
  status: PaymentLifecycleState;
  metadata: Record<string, unknown>;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: PaymentLifecycleState;
  providerChargeId?: string;
  amountCents: number;
  currency: string;
  settledAt?: string;
  failureReason?: string;
}

export interface PaymentRefundParams {
  chargeId: string;
  amountCents: number;
  reason: string;
  idempotencyKey: string;
}

export interface PaymentRefundResult {
  success: boolean;
  providerRefundId: string;
  status: "processed" | "pending" | "failed";
  amountCents: number;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  eventType?: string;
  sessionId?: string;
  chargeId?: string;
  payload?: Record<string, unknown>;
  error?: string;
}

/**
 * Pluggable Payment Provider Interface.
 * Encapsulates all payment-processor specific communication (Stripe, Razorpay, Mock).
 * Decoupled from the Aros ledger and purchase safety business rules.
 */
export interface PaymentProvider {
  readonly providerName: string;

  createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult>;

  verifyPayment(providerIntentId: string): Promise<PaymentVerificationResult>;

  refundPayment(params: PaymentRefundParams): Promise<PaymentRefundResult>;

  verifyWebhookSignature(rawBody: string | Buffer | Record<string, unknown>, signatureHeader?: string): Promise<WebhookVerificationResult>;

  reconcileTransaction(providerIntentId: string): Promise<PaymentVerificationResult>;
}

/**
 * Sandboxed In-Memory / Test Payment Provider.
 * Provides deterministic simulation of success, failure, and refunds without live secrets or real network calls.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly providerName = "mock_provider";
  private intents = new Map<string, PaymentIntentResult>();
  private settledCharges = new Map<string, { amountCents: number; refunded: boolean }>();

  clear(): void {
    this.intents.clear();
    this.settledCharges.clear();
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const id = `pi_mock_${Math.random().toString(36).substr(2, 9)}`;
    const sessionId = `cs_mock_${Math.random().toString(36).substr(2, 9)}`;
    const checkoutUrl = `https://aroh-os.vercel.app/dashboard/purchase?session_id=${sessionId}&intent_id=${id}`;

    const intent: PaymentIntentResult = {
      providerIntentId: id,
      providerSessionId: sessionId,
      clientSecret: `secret_${id}`,
      checkoutUrl,
      status: "PAYMENT_INITIATED",
      metadata: {
        userId: params.userId,
        packageId: params.packageId,
        arosAmount: params.arosAmount,
        idempotencyKey: params.idempotencyKey
      }
    };

    this.intents.set(id, intent);
    this.intents.set(sessionId, intent);
    return { ...intent };
  }

  async verifyPayment(providerIntentId: string): Promise<PaymentVerificationResult> {
    const intent = this.intents.get(providerIntentId);
    if (!intent) {
      return {
        success: false,
        status: "PAYMENT_FAILED",
        amountCents: 0,
        currency: "USD",
        failureReason: "Intent not found"
      };
    }

    const chargeId = `ch_mock_${Math.random().toString(36).substr(2, 9)}`;
    const amount = (intent.metadata.amountCents as number) || 1500;

    this.settledCharges.set(chargeId, { amountCents: amount, refunded: false });

    return {
      success: true,
      status: "PAYMENT_COMPLETED",
      providerChargeId: chargeId,
      amountCents: amount,
      currency: "USD",
      settledAt: new Date().toISOString()
    };
  }

  async refundPayment(params: PaymentRefundParams): Promise<PaymentRefundResult> {
    const charge = this.settledCharges.get(params.chargeId);
    if (charge) {
      charge.refunded = true;
    }

    return {
      success: true,
      providerRefundId: `ref_mock_${Math.random().toString(36).substr(2, 9)}`,
      status: "processed",
      amountCents: params.amountCents
    };
  }

  async verifyWebhookSignature(
    rawBody: string | Buffer | Record<string, unknown>,
    _signatureHeader?: string
  ): Promise<WebhookVerificationResult> {
    const payload = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;
    const eventType = (payload as any)?.type || "checkout.session.completed";
    const sessionId = (payload as any)?.data?.object?.id || "cs_mock_default";
    const chargeId = (payload as any)?.data?.object?.payment_intent || "ch_mock_default";

    return {
      isValid: true,
      eventType,
      sessionId,
      chargeId,
      payload: payload as Record<string, unknown>
    };
  }

  async reconcileTransaction(providerIntentId: string): Promise<PaymentVerificationResult> {
    return this.verifyPayment(providerIntentId);
  }
}
