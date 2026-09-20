import { z } from "zod";

/**
 * AROH Purchase & Payment Safety Schemas
 *
 * Implements authoritative data contracts for:
 * - Age policy & purchase eligibility state machine
 * - Dedicated purchase consent
 * - Payment intent & payment transaction lifecycle
 * - Authoritative Aros ledger entries (with reversal & idempotency references)
 * - Refunds, disputes, chargebacks
 * - Fraud & velocity risk controls
 * - Transaction receipts
 * - Security/audit events
 * - Configurable transaction limits
 */

// ============================================================================
// 1. AGE POLICY & PURCHASE ELIGIBILITY STATE MACHINE
// ============================================================================

export const PurchaseEligibilityStateSchema = z.enum([
  "UNKNOWN",
  "AGE_REQUIRED",
  "ELIGIBILITY_REQUIRED",
  "MINOR_PAYMENT_BLOCKED",
  "ADULT_ELIGIBLE",
  "ELIGIBLE",
  "INELIGIBLE",
  "VERIFICATION_REQUIRED",
  "AGE_VERIFICATION_REQUIRED",
  "VERIFICATION_PENDING",
  "AGE_VERIFICATION_PENDING",
  "VERIFICATION_FAILED",
  "AGE_VERIFICATION_FAILED",
  "VERIFICATION_EXPIRED",
  "REVIEW_REQUIRED",
  "SUSPENDED"
]);
export type PurchaseEligibilityState = z.infer<typeof PurchaseEligibilityStateSchema>;

export const UserPurchaseEligibilitySchema = z.object({
  userId: z.string().min(1),
  accountAgeStatus: PurchaseEligibilityStateSchema,
  isAdult: z.boolean().default(false),
  verifiedAt: z.string().datetime().nullable().optional(),
  verificationMethod: z.enum([
    "self_attestation",
    "third_party_band",
    "statutory_assurance",
    "administrative_override",
    "none"
  ]).default("none"),
  verificationReference: z.string().nullable().optional(),
  suspendedReason: z.string().nullable().optional(),
  updatedAt: z.string().datetime()
});
export type UserPurchaseEligibility = z.infer<typeof UserPurchaseEligibilitySchema>;

// ============================================================================
// 2. DEDICATED PURCHASE CONSENT
// ============================================================================

export const PurchaseConsentRecordSchema = z.object({
  consent_id: z.string().min(5),
  user_id: z.string().min(1),
  package_id: z.string().min(1),
  aros_quantity: z.number().int().positive(),
  amount_usd_cents: z.number().int().positive(),
  currency: z.string().default("USD"),
  purchaser_is_18_attested: z.literal(true),
  aros_classification_acknowledged: z.literal(true), // Acknowledges closed-loop utility token, non-currency, non-cash-redeemable
  refund_policy_acknowledged: z.literal(true),
  terms_version: z.string(),
  policy_version: z.string(),
  aros_policy_version: z.string(),
  age_policy_version: z.string(),
  timestamp: z.string().datetime(),
  source: z.enum(["web_checkout", "api", "mobile_app"]),
  affirmative_action: z.string(), // e.g. "click_confirm_purchase_package"
  status: z.enum(["active", "withdrawn", "expired"]).default("active"),
  withdrawn_at: z.string().datetime().nullable().optional(),
  withdrawal_method: z.string().nullable().optional(),
  transaction_reference: z.string().nullable().optional(),
  idempotency_key: z.string().min(1)
});
export type PurchaseConsentRecord = z.infer<typeof PurchaseConsentRecordSchema>;

// ============================================================================
// 3. PAYMENT INTENT & LIFECYCLE
// ============================================================================

export const PaymentLifecycleStateSchema = z.enum([
  "PURCHASE_INTENT",
  "PAYMENT_INITIATED",
  "PAYMENT_AUTHORIZED",
  "PAYMENT_PENDING",
  "PAYMENT_REQUIRES_ACTION",
  "PAYMENT_COMPLETED",
  "PAYMENT_FAILED",
  "PAYMENT_CANCELLED",
  "PAYMENT_EXPIRED",
  "PAYMENT_DISPUTED",
  "PAYMENT_REFUNDED",
  "PAYMENT_PARTIALLY_REFUNDED"
]);
export type PaymentLifecycleState = z.infer<typeof PaymentLifecycleStateSchema>;

export const PaymentIntentRecordSchema = z.object({
  id: z.string().startsWith("pi_"),
  userId: z.string().min(1),
  packageId: z.string().min(1),
  arosAmount: z.number().int().positive(),
  amountUsdCents: z.number().int().positive(),
  currency: z.string().default("USD"),
  status: PaymentLifecycleStateSchema,
  eligibilityState: PurchaseEligibilityStateSchema,
  consentId: z.string().min(1),
  idempotencyKey: z.string().min(1),
  provider: z.string().default("mock_provider"),
  providerSessionId: z.string().optional(),
  providerChargeId: z.string().optional(),
  checkoutUrl: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  authorizedAt: z.string().datetime().optional(),
  settledAt: z.string().datetime().optional(),
  failureReason: z.string().optional()
});
export type PaymentIntentRecord = z.infer<typeof PaymentIntentRecordSchema>;

// ============================================================================
// 4. AUTHORITATIVE AROS LEDGER ENTRY
// ============================================================================

export const ArosLedgerEntrySchema = z.object({
  transaction_id: z.string().min(5),
  user_id: z.string().min(1),
  operation_type: z.enum([
    "credit_purchase",
    "credit_reward",
    "debit_usage",
    "debit_membership",
    "reversal_refund",
    "reversal_dispute",
    "admin_correction"
  ]),
  source: z.string(), // e.g. "stripe_on_ramp", "system_grant", "user_wallet"
  destination: z.string(), // e.g. "user_wallet", "platform_reserve"
  quantity: z.number(), // positive for credits, negative for debits
  unit: z.literal("AROS"),
  currency: z.string().optional(),
  payment_amount_cents: z.number().int().optional(),
  payment_reference: z.string().optional(),
  provider_reference: z.string().optional(),
  status: z.enum(["settled", "pending_reconciliation", "reversed", "quarantined"]),
  created_at: z.string().datetime(),
  completed_at: z.string().datetime().optional(),
  reversal_reference: z.string().nullable().optional(),
  idempotency_key: z.string().min(1),
  consent_reference: z.string().optional(),
  eligibility_reference: z.string().optional(),
  actor: z.string(), // "user" | "webhook" | "admin" | "reconciler"
  metadata: z.record(z.unknown()).optional(),
  audit_reference: z.string().optional()
});
export type ArosLedgerEntry = z.infer<typeof ArosLedgerEntrySchema>;

// ============================================================================
// 5. REFUNDS, DISPUTES & CHARGEBACKS
// ============================================================================

export const RefundReasonSchema = z.enum([
  "failed_fulfillment",
  "duplicate_payment",
  "fraudulent_transaction",
  "chargeback_dispute",
  "administrative_correction",
  "customer_request"
]);
export type RefundReason = z.infer<typeof RefundReasonSchema>;

export const RefundRecordSchema = z.object({
  refund_id: z.string().startsWith("ref_"),
  original_transaction_id: z.string().min(1),
  user_id: z.string().min(1),
  aros_amount: z.number().int().positive(),
  amount_cents: z.number().int().positive(),
  currency: z.string().default("USD"),
  reason: RefundReasonSchema,
  status: z.enum(["pending", "approved", "processed", "rejected", "failed"]),
  aros_recovery_status: z.enum(["debited", "uncollectible_quarantined", "waived"]),
  actor: z.string(),
  created_at: z.string().datetime(),
  completed_at: z.string().datetime().optional(),
  provider_refund_id: z.string().optional(),
  audit_reference: z.string()
});
export type RefundRecord = z.infer<typeof RefundRecordSchema>;

export const DisputeStateSchema = z.enum([
  "DISPUTE_OPENED",
  "UNDER_REVIEW",
  "PROVIDER_REVIEW",
  "USER_EVIDENCE_REQUIRED",
  "RESOLVED_FOR_USER",
  "RESOLVED_FOR_AROH",
  "REFUNDED",
  "REJECTED",
  "CLOSED"
]);
export type DisputeState = z.infer<typeof DisputeStateSchema>;

export const DisputeRecordSchema = z.object({
  dispute_id: z.string().startsWith("disp_"),
  transaction_id: z.string().min(1),
  user_id: z.string().min(1),
  state: DisputeStateSchema,
  reason: z.string(),
  amount_cents: z.number().int().positive(),
  currency: z.string().default("USD"),
  opened_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  resolved_at: z.string().datetime().optional(),
  resolution_notes: z.string().optional(),
  provider_dispute_id: z.string().optional()
});
export type DisputeRecord = z.infer<typeof DisputeRecordSchema>;

// ============================================================================
// 6. FRAUD, RISK & VELOCITY CONTROLS
// ============================================================================

export const TransactionLimitsConfigSchema = z.object({
  minPurchaseCents: z.number().int().positive().default(500), // $5.00
  maxSinglePurchaseCents: z.number().int().positive().default(10000), // $100.00
  maxDailyPurchaseCents: z.number().int().positive().default(25000), // $250.00
  maxMonthlyPurchaseCents: z.number().int().positive().default(100000), // $1,000.00
  maxWalletBalanceAros: z.number().int().positive().default(500000), // 500,000 Aros
  maxPurchasesPerHour: z.number().int().positive().default(5),
  minAccountAgeHoursForPurchase: z.number().int().nonnegative().default(0)
});
export type TransactionLimitsConfig = z.infer<typeof TransactionLimitsConfigSchema>;

export const PurchaseRiskEventSchema = z.object({
  risk_event_id: z.string().startsWith("rsk_"),
  user_id: z.string().min(1),
  risk_type: z.enum([
    "velocity_limit_exceeded",
    "daily_cap_exceeded",
    "monthly_cap_exceeded",
    "wallet_cap_exceeded",
    "rapid_transactions",
    "minor_attempt_blocked",
    "suspicious_device_shift",
    "duplicate_payment_spike"
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  action_taken: z.enum(["allowed", "flagged_for_review", "blocked", "suspended"]),
  details: z.record(z.unknown()),
  timestamp: z.string().datetime()
});
export type PurchaseRiskEvent = z.infer<typeof PurchaseRiskEventSchema>;

// ============================================================================
// 7. TRANSACTION RECEIPT & AUDIT
// ============================================================================

export const TransactionReceiptSchema = z.object({
  receipt_id: z.string().startsWith("rcpt_"),
  transaction_id: z.string().min(1),
  user_id: z.string().min(1),
  purchase_timestamp: z.string().datetime(),
  aros_quantity: z.number().int().positive(),
  payment_amount_cents: z.number().int().positive(),
  currency: z.string().default("USD"),
  payment_reference: z.string(),
  payment_status: z.string(),
  refund_status: z.string().nullable().optional(),
  terms_version: z.string(),
  policy_version: z.string(),
  support_contact: z.string().default("support@aroh.in"),
  dispute_route: z.string().default("/privacy/grievance")
});
export type TransactionReceipt = z.infer<typeof TransactionReceiptSchema>;

export const TransactionAuditEventSchema = z.object({
  audit_id: z.string().startsWith("aud_"),
  event_type: z.enum([
    "purchase_intent_created",
    "purchase_blocked_minor",
    "purchase_blocked_eligibility",
    "purchase_blocked_risk",
    "payment_authorized",
    "payment_settled",
    "ledger_credited",
    "fulfillment_failed_quarantined",
    "refund_issued",
    "dispute_recorded",
    "reconciliation_anomaly_detected",
    "admin_balance_adjusted"
  ]),
  actor: z.string(),
  user_id: z.string().min(1),
  transaction_id: z.string().optional(),
  before_state: z.record(z.unknown()).optional(),
  after_state: z.record(z.unknown()).optional(),
  reason: z.string(),
  source: z.string(),
  correlation_id: z.string(),
  idempotency_key: z.string().optional(),
  policy_version: z.string().default("1.0.0"),
  timestamp: z.string().datetime()
});
export type TransactionAuditEvent = z.infer<typeof TransactionAuditEventSchema>;
