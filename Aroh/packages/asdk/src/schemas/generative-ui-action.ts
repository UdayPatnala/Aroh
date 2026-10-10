import { z } from "zod";

export const GenerativeUIWidgetTypeSchema = z.enum([
  "aros_transfer_preview",     // Token transfer breakdown, fee estimation, and confirmation CTA
  "telemetry_visualizer",      // Real-time metric sparkline / ring buffer display
  "product_launchpad",         // Spoke launch card respecting canonical showcase priority
  "enterprise_quota_card",     // Team wallet member monthly quota visualizer
  "announcement_card",         // Ecosystem roadmap card linked to announcements hub
  "statutory_consent_gate"     // DPDP affirmative consent confirmation widget
]);
export type GenerativeUIWidgetType = z.infer<typeof GenerativeUIWidgetTypeSchema>;

/**
 * AROH Open Source Platform — Generative UI Action Protocol
 * Domain: AI Orchestration & Developer Studio (Domain 4)
 * 
 * Strict Invariants:
 * 1. D2 Financial Safety: Zero direct client balance mutation.
 * 2. Mandatory Server-Side Age Attestation: NO_MINOR_PAYMENT_FOR_AROS = true.
 * 3. Cryptographic Receipting: All financial/settlement actions emit a SHA-256 verifiable receipt ID.
 * 4. Idempotency Protection: Replay attacks and duplicated clicks are rejected.
 */


export const GenerativeUIActionTypeSchema = z.enum([
  "execute_aros_transfer",
  "confirm_consent",
  "subscribe_telemetry",
  "launch_product"
]);
export type GenerativeUIActionType = z.infer<typeof GenerativeUIActionTypeSchema>;

export const AffirmativeAttestationSchema = z.object({
  purchaserIs18Attested: z.boolean(),
  termsVersion: z.string().default("1.0.0"),
  policyVersion: z.string().default("1.0.0"),
  timestamp: z.number().default(() => Date.now())
});
export type AffirmativeAttestation = z.infer<typeof AffirmativeAttestationSchema>;

export const GenerativeUIActionRequestSchema = z.object({
  actionId: z.string().min(1),
  widgetType: GenerativeUIWidgetTypeSchema,
  userId: z.string().min(1),
  actionType: GenerativeUIActionTypeSchema,
  idempotencyKey: z.string().min(8),
  affirmativeAttestation: AffirmativeAttestationSchema,
  payload: z.record(z.string(), z.unknown())
});
export type GenerativeUIActionRequest = z.infer<typeof GenerativeUIActionRequestSchema>;

export const GenerativeUIActionResponseSchema = z.object({
  success: z.boolean(),
  actionId: z.string(),
  receiptId: z.string().optional(),
  receiptHash: z.string().optional(),
  status: z.enum(["SETTLED", "PENDING", "REJECTED"]),
  message: z.string(),
  timestamp: z.number(),
  details: z.record(z.string(), z.unknown()).optional()
});
export type GenerativeUIActionResponse = z.infer<typeof GenerativeUIActionResponseSchema>;
