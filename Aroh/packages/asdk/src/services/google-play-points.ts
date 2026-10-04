/**
 * AROH Platform - Google Play Billing & Points Architecture Contract
 *
 * ARCHITECTURAL SPECIFICATION: FUTURE CAPABILITY ONLY
 * Google Play Billing (purchases) and Google Play Points (rewards) are distinct external systems.
 * Neither mechanism is currently active, authorized, or released in production.
 *
 * INVARIANTS:
 * 1. AROH Aros Ledger is the sole authoritative source of truth.
 * 2. NO_MINOR_PAYMENT_FOR_AROS = true: Users under 18 cannot initiate or receive top-ups.
 * 3. Never rely on Google parental controls as AROH's age verification.
 * 4. Zero live conversion or redemption UI on the web platform.
 */

import { z } from "zod";

export const GooglePlayIntegrationStatusSchema = z.enum([
  "CONCEPTUAL_EXPLORATION",
  "ARCHITECTURAL_DESIGN",
  "PENDING_PLATFORM_AUTHORIZATION",
  "DISABLED",
  "PRODUCTION_VERIFIED"
]);
export type GooglePlayIntegrationStatus = z.infer<typeof GooglePlayIntegrationStatusSchema>;

export const GooglePlayChannelTypeSchema = z.enum([
  "GOOGLE_PLAY_BILLING",       // Android in-app digital purchase
  "GOOGLE_PLAY_POINTS_REWARD"  // External loyalty rewards conversion
]);
export type GooglePlayChannelType = z.infer<typeof GooglePlayChannelTypeSchema>;

/**
 * Top-up Request Verification Contract (Architecture Model)
 */
export const GooglePlayTopUpRequestSchema = z.object({
  idempotencyKey: z.string().uuid("Idempotency key must be a valid UUID"),
  userId: z.string().min(1, "User ID is required"),
  channelType: GooglePlayChannelTypeSchema,
  googleTransactionId: z.string().min(1, "Google transaction reference is required"),
  googlePurchaseToken: z.string().min(1, "Google purchase token is required"),
  packageId: z.string().default("com.aroh.app"),
  requestedArosUnits: z.number().int().positive("Aros amount must be positive integer"),
  userAgeAtVerification: z.number().int().nonnegative(),
  isMinorRestricted: z.boolean(),
  clientTimestamp: z.string(),
  status: GooglePlayIntegrationStatusSchema
});

export type GooglePlayTopUpRequest = z.infer<typeof GooglePlayTopUpRequestSchema>;

export interface TopUpEligibilityEvaluation {
  isEligible: boolean;
  reasonCode:
    | "ELIGIBLE"
    | "BLOCKED_MINOR_AGE_POLICY"
    | "FEATURE_IN_EXPLORATION_NOT_LIVE"
    | "UNAUTHORIZED_CHANNEL"
    | "IDEMPOTENCY_COLLISION";
  rejectionReason?: string;
  sourceOfTruth: "AROH_LEDGER_POLICY";
}

/**
 * Evaluates whether a proposed Google Play top-up request is permissible.
 * Enforces server-side age policy and fail-closed architecture on unreleased features.
 */
export function evaluateGooglePlayTopUpEligibility(params: {
  userId: string;
  userAge: number;
  channelType: GooglePlayChannelType;
}): TopUpEligibilityEvaluation {
  // 1. Strict Server-Side 18+ Age Invariant
  if (params.userAge < 18) {
    return {
      isEligible: false,
      reasonCode: "BLOCKED_MINOR_AGE_POLICY",
      rejectionReason:
        "Statutory minor protection invariant: NO_MINOR_PAYMENT_FOR_AROS is active. Accounts under 18 cannot initiate Aros top-ups.",
      sourceOfTruth: "AROH_LEDGER_POLICY"
    };
  }

  // 2. Feature Release Invariant: Google Play channels are strictly in exploration
  return {
    isEligible: false,
    reasonCode: "FEATURE_IN_EXPLORATION_NOT_LIVE",
    rejectionReason:
      "Google Play integrations are currently in architectural exploration and are not enabled for live balance top-up.",
    sourceOfTruth: "AROH_LEDGER_POLICY"
  };
}

/**
 * Returns the verified canonical status of Google Play top-up capabilities
 */
export function getGooglePlayCapabilitiesStatus(): {
  billingStatus: GooglePlayIntegrationStatus;
  pointsStatus: GooglePlayIntegrationStatus;
  isLiveInProduction: boolean;
  ledgerAuthority: string;
} {
  return {
    billingStatus: "ARCHITECTURAL_DESIGN",
    pointsStatus: "CONCEPTUAL_EXPLORATION",
    isLiveInProduction: false,
    ledgerAuthority: "AROH_INTERNAL_DOUBLE_ENTRY_LEDGER"
  };
}
