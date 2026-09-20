import { z } from "zod";

export const WebhookEventTypeSchema = z.enum([
  "aros.credited",
  "aros.debited",
  "membership.upgraded",
  "challenge.completed"
]);

export type WebhookEventType = z.infer<typeof WebhookEventTypeSchema>;

export const WebhookEndpointStatusSchema = z.enum(["active", "disabled", "failing"]);
export type WebhookEndpointStatus = z.infer<typeof WebhookEndpointStatusSchema>;

export const WebhookDeliveryStatusSchema = z.enum(["pending", "success", "failed"]);
export type WebhookDeliveryStatus = z.infer<typeof WebhookDeliveryStatusSchema>;

export const CreateWebhookEndpointRequestSchema = z.object({
  url: z.string().url({ message: "A valid URL is required for webhook endpoint" }),
  description: z.string().max(255).optional(),
  events: z.array(WebhookEventTypeSchema).min(1, { message: "At least one event type must be subscribed" })
});

export type CreateWebhookEndpointRequest = z.infer<typeof CreateWebhookEndpointRequestSchema>;

export const WebhookEndpointRecordSchema = z.object({
  id: z.string().startsWith("wh_"),
  userId: z.string(),
  url: z.string().url(),
  description: z.string().optional(),
  events: z.array(WebhookEventTypeSchema),
  status: WebhookEndpointStatusSchema,
  secretHash: z.string(),
  createdAt: z.string(),
  failureCount: z.number().int().nonnegative().default(0),
  lastDeliveredAt: z.string().optional()
});

export type WebhookEndpointRecord = z.infer<typeof WebhookEndpointRecordSchema>;

export const WebhookEventPayloadSchema = z.object({
  id: z.string().startsWith("evt_"),
  type: WebhookEventTypeSchema,
  timestamp: z.string(),
  data: z.record(z.any())
});

export type WebhookEventPayload = z.infer<typeof WebhookEventPayloadSchema>;

export const WebhookDeliveryAttemptSchema = z.object({
  attempt: z.number().int().min(1).max(3),
  timestamp: z.string(),
  statusCode: z.number().int().optional(),
  durationMs: z.number().nonnegative(),
  success: z.boolean(),
  error: z.string().optional()
});

export type WebhookDeliveryAttempt = z.infer<typeof WebhookDeliveryAttemptSchema>;

export const WebhookDeliveryLogSchema = z.object({
  id: z.string().startsWith("dlv_"),
  eventId: z.string().startsWith("evt_"),
  endpointId: z.string().startsWith("wh_"),
  status: WebhookDeliveryStatusSchema,
  attempts: z.array(WebhookDeliveryAttemptSchema),
  createdAt: z.string()
});

export type WebhookDeliveryLog = z.infer<typeof WebhookDeliveryLogSchema>;
