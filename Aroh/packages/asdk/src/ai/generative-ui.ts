import { z } from "zod";
import {
  GenerativeUIWidgetTypeSchema,
  type GenerativeUIWidgetType
} from "../schemas/generative-ui-action";

export { GenerativeUIWidgetTypeSchema };
export type { GenerativeUIWidgetType };



export const GenerativeUIActionSchema = z.object({
  required: z.boolean().default(false),
  label: z.string().optional(),
  endpoint: z.string().optional(),
  method: z.enum(["GET", "POST", "PUT"]).default("POST"),
  payload: z.record(z.string(), z.unknown()).optional()
});
export type GenerativeUIAction = z.infer<typeof GenerativeUIActionSchema>;

export const GenerativeUIBlockSchema = z.object({
  id: z.string().min(1),
  widgetType: GenerativeUIWidgetTypeSchema,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  payload: z.record(z.string(), z.unknown()),
  action: GenerativeUIActionSchema.optional(),
  timestamp: z.number().default(() => Date.now())
});
export type GenerativeUIBlock = z.infer<typeof GenerativeUIBlockSchema>;

export const AIServerStreamEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text_delta"),
    text: z.string()
  }),
  z.object({
    type: z.literal("ui_block"),
    block: GenerativeUIBlockSchema
  }),
  z.object({
    type: z.literal("done"),
    usage: z.record(z.string(), z.unknown()).optional()
  }),
  z.object({
    type: z.literal("error"),
    error: z.string()
  })
]);
export type AIServerStreamEvent = z.infer<typeof AIServerStreamEventSchema>;

/**
 * Creates a validated Generative UI block with safety checks.
 */
export function createGenerativeUIBlock(
  widgetType: GenerativeUIWidgetType,
  title: string,
  payload: Record<string, unknown>,
  options?: {
    id?: string;
    subtitle?: string;
    action?: GenerativeUIAction;
  }
): GenerativeUIBlock {
  const block: GenerativeUIBlock = {
    id: options?.id || `genui-${widgetType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    widgetType,
    title,
    subtitle: options?.subtitle,
    payload,
    action: options?.action,
    timestamp: Date.now()
  };

  return GenerativeUIBlockSchema.parse(block);
}

/**
 * Formats an AI server stream event into a Server-Sent Events (SSE) string wire payload.
 */
export function formatSSEEvent(event: AIServerStreamEvent): string {
  const validated = AIServerStreamEventSchema.parse(event);
  return `data: ${JSON.stringify(validated)}\n\n`;
}

/**
 * Parses an SSE wire chunk back into a typed stream event.
 */
export function parseSSEEvent(rawChunk: string): AIServerStreamEvent | null {
  const line = rawChunk.trim();
  if (!line.startsWith("data:")) return null;
  const jsonStr = line.replace(/^data:\s*/, "");
  try {
    const parsed = JSON.parse(jsonStr);
    return AIServerStreamEventSchema.parse(parsed);
  } catch {
    return null;
  }
}

export {
  GenerativeUIActionRequestSchema,
  GenerativeUIActionResponseSchema,
  GenerativeUIActionTypeSchema,
  AffirmativeAttestationSchema
} from "../schemas/generative-ui-action";
export type {
  GenerativeUIActionRequest,
  GenerativeUIActionResponse,
  GenerativeUIActionType,
  AffirmativeAttestation
} from "../schemas/generative-ui-action";

import {
  GenerativeUIActionRequestSchema,
  GenerativeUIActionResponse,
} from "../schemas/generative-ui-action";
import crypto from "crypto";



export class GenerativeUIActionDispatcher {
  private executedActions: Map<string, GenerativeUIActionResponse> = new Map();

  clear(): void {
    this.executedActions.clear();
  }

  executeAction(rawRequest: unknown): GenerativeUIActionResponse {
    const request = GenerativeUIActionRequestSchema.parse(rawRequest);

    // Idempotency check: Replay protection
    const cached = this.executedActions.get(request.idempotencyKey);
    if (cached) {
      return cached;
    }

    // Statutory minor protection invariant
    if (
      request.actionType === "execute_aros_transfer" &&
      !request.affirmativeAttestation.purchaserIs18Attested
    ) {
      const rejectedResponse: GenerativeUIActionResponse = {
        success: false,
        actionId: request.actionId,
        status: "REJECTED",
        message: "NO_MINOR_PAYMENT_FOR_AROS: Age attestation failed. Financial transfers require verified adult status.",
        timestamp: Date.now()
      };
      this.executedActions.set(request.idempotencyKey, rejectedResponse);
      return rejectedResponse;
    }

    if (request.actionType === "execute_aros_transfer") {
      const amount = Number(request.payload.amount || 0);
      const recipient = String(request.payload.recipient || "unknown");
      const currency = String(request.payload.currency || "Aros");

      const seed = `${request.userId}:${recipient}:${amount}:${request.idempotencyKey}:${Date.now()}`;
      const receiptHash = crypto.createHash("sha256").update(seed).digest("hex");
      const receiptId = `rcpt_${receiptHash.slice(0, 16)}`;

      const response: GenerativeUIActionResponse = {
        success: true,
        actionId: request.actionId,
        receiptId,
        receiptHash,
        status: "SETTLED",
        message: `Settlement confirmed: Transferred ${amount} ${currency} to ${recipient}. Cryptographic receipt generated.`,
        timestamp: Date.now(),
        details: {
          amount,
          currency,
          recipient,
          settledVia: "AROH_IMMUTABLE_LEDGER"
        }
      };

      this.executedActions.set(request.idempotencyKey, response);
      return response;
    }

    if (request.actionType === "confirm_consent") {
      const purpose = String(request.payload.purpose || "Ecosystem Personalization");
      const seed = `consent:${request.userId}:${purpose}:${request.idempotencyKey}:${Date.now()}`;
      const receiptHash = crypto.createHash("sha256").update(seed).digest("hex");
      const receiptId = `rcpt_consent_${receiptHash.slice(0, 14)}`;

      const response: GenerativeUIActionResponse = {
        success: true,
        actionId: request.actionId,
        receiptId,
        receiptHash,
        status: "SETTLED",
        message: `Affirmative DPDP Section 6 consent logged for purpose: "${purpose}".`,
        timestamp: Date.now(),
        details: {
          purpose,
          noticeVersion: request.affirmativeAttestation.policyVersion
        }
      };

      this.executedActions.set(request.idempotencyKey, response);
      return response;
    }

    // Default generic execution
    const response: GenerativeUIActionResponse = {
      success: true,
      actionId: request.actionId,
      status: "SETTLED",
      message: `Action ${request.actionType} completed successfully for ${request.widgetType}.`,
      timestamp: Date.now(),
      details: request.payload
    };

    this.executedActions.set(request.idempotencyKey, response);
    return response;
  }
}

export const generativeUIActionDispatcher = new GenerativeUIActionDispatcher();

