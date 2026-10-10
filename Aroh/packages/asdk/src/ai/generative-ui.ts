import { z } from "zod";

/**
 * AROH Open Source Platform — Generative UI (Server-Driven UI / SDUI) Specification
 * Domain: AI Orchestration & Developer Studio (Domain 4)
 * 
 * Strict Invariant (D2 Contract):
 * Direct client balance mutation is prohibited. All transactional Generative UI blocks
 * render as read-only attestation previews that require explicit user signature/authorization
 * calling verified server-side settlement endpoints.
 */

export const GenerativeUIWidgetTypeSchema = z.enum([
  "aros_transfer_preview",     // Token transfer breakdown, fee estimation, and confirmation CTA
  "telemetry_visualizer",      // Real-time metric sparkline / ring buffer display
  "product_launchpad",         // Spoke launch card respecting canonical showcase priority
  "enterprise_quota_card",     // Team wallet member monthly quota visualizer
  "announcement_card",         // Ecosystem roadmap card linked to announcements hub
  "statutory_consent_gate"     // DPDP affirmative consent confirmation widget
]);
export type GenerativeUIWidgetType = z.infer<typeof GenerativeUIWidgetTypeSchema>;

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
