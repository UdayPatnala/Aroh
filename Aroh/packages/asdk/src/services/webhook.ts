import crypto from "crypto";
import {
  CreateWebhookEndpointRequest,
  CreateWebhookEndpointRequestSchema,
  WebhookEndpointRecord,
  WebhookEndpointRecordSchema,
  WebhookEventPayload,
  WebhookEventPayloadSchema,
  WebhookDeliveryLog,
  WebhookDeliveryAttempt
} from "../schemas/webhook";

export interface WebhookTransport {
  (
    url: string,
    headers: Record<string, string>,
    body: string
  ): Promise<{ status: number; ok: boolean }>;
}

export function generateWebhookSecret(): string {
  const entropy = crypto.randomBytes(24).toString("hex");
  return `whsec_${entropy}`;
}

export function hashWebhookSecret(secret: string): string {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

export function signWebhookPayload(
  payloadString: string,
  secret: string,
  timestamp?: number
): { signatureHeader: string; timestamp: number; signature: string } {
  const ts = timestamp ?? Math.floor(Date.now() / 1000);
  const signedData = `${ts}.${payloadString}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signedData)
    .digest("hex");

  return {
    signatureHeader: `t=${ts},v1=${signature}`,
    timestamp: ts,
    signature
  };
}

export function verifyWebhookSignature(
  payloadString: string,
  signatureHeader: string,
  secret: string,
  toleranceSeconds: number = 300
): boolean {
  if (!signatureHeader || !secret) return false;

  const parts = signatureHeader.split(",");
  let timestampStr: string | null = null;
  let signature: string | null = null;

  for (const part of parts) {
    const [k, v] = part.split("=");
    if (k === "t") timestampStr = v;
    if (k === "v1") signature = v;
  }

  if (!timestampStr || !signature) return false;

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > toleranceSeconds) {
    return false;
  }

  const expectedSignedData = `${timestamp}.${payloadString}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(expectedSignedData)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}

export class WebhookService {
  private endpoints: Map<string, WebhookEndpointRecord> = new Map();
  private deliveryLogs: Map<string, WebhookDeliveryLog> = new Map();

  clear(): void {
    this.endpoints.clear();
    this.deliveryLogs.clear();
  }

  registerEndpoint(
    userId: string,
    request: CreateWebhookEndpointRequest
  ): { endpoint: WebhookEndpointRecord; secret: string } {
    const validated = CreateWebhookEndpointRequestSchema.parse(request);
    const id = `wh_${crypto.randomBytes(12).toString("hex")}`;
    const secret = generateWebhookSecret();
    const secretHash = hashWebhookSecret(secret);

    const record: WebhookEndpointRecord = {
      id,
      userId,
      url: validated.url,
      description: validated.description,
      events: validated.events,
      status: "active",
      secretHash,
      createdAt: new Date().toISOString(),
      failureCount: 0
    };

    WebhookEndpointRecordSchema.parse(record);
    this.endpoints.set(id, record);

    return { endpoint: { ...record }, secret };
  }

  listEndpoints(userId: string): WebhookEndpointRecord[] {
    return Array.from(this.endpoints.values()).filter(
      (ep) => ep.userId === userId
    );
  }

  getEndpoint(userId: string, endpointId: string): WebhookEndpointRecord | null {
    const ep = this.endpoints.get(endpointId);
    if (!ep || ep.userId !== userId) return null;
    return { ...ep };
  }

  deleteEndpoint(userId: string, endpointId: string): boolean {
    const ep = this.endpoints.get(endpointId);
    if (!ep || ep.userId !== userId) return false;
    return this.endpoints.delete(endpointId);
  }

  getDeliveryLogs(endpointId: string): WebhookDeliveryLog[] {
    return Array.from(this.deliveryLogs.values()).filter(
      (log) => log.endpointId === endpointId
    );
  }

  async dispatchEvent(
    endpoint: WebhookEndpointRecord,
    eventPayload: WebhookEventPayload,
    secret: string,
    options?: {
      transport?: WebhookTransport;
      maxRetries?: number;
      backoffMultiplierMs?: number;
    }
  ): Promise<WebhookDeliveryLog> {
    WebhookEventPayloadSchema.parse(eventPayload);

    const transport: WebhookTransport =
      options?.transport ??
      (async (url, headers, body) => {
        const res = await fetch(url, {
          method: "POST",
          headers,
          body
        });
        return { status: res.status, ok: res.ok };
      });

    const maxRetries = options?.maxRetries ?? 3;
    const baseDelay = options?.backoffMultiplierMs ?? 500;
    const payloadString = JSON.stringify(eventPayload);
    const { signatureHeader } = signWebhookPayload(payloadString, secret);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "AROH-Webhook-Engine/2.03.02.0",
      "x-aroh-signature": signatureHeader,
      "x-aroh-event": eventPayload.type,
      "x-aroh-delivery-id": `evt_${crypto.randomBytes(8).toString("hex")}`
    };

    const attempts: WebhookDeliveryAttempt[] = [];
    let isSuccess = false;

    for (let attemptNumber = 1; attemptNumber <= maxRetries; attemptNumber++) {
      const startTime = Date.now();
      try {
        const response = await transport(endpoint.url, headers, payloadString);
        const durationMs = Date.now() - startTime;

        if (response.ok && response.status >= 200 && response.status < 300) {
          attempts.push({
            attempt: attemptNumber,
            timestamp: new Date().toISOString(),
            statusCode: response.status,
            durationMs,
            success: true
          });
          isSuccess = true;
          break;
        } else {
          attempts.push({
            attempt: attemptNumber,
            timestamp: new Date().toISOString(),
            statusCode: response.status,
            durationMs,
            success: false,
            error: `Endpoint returned HTTP ${response.status}`
          });
        }
      } catch (err: any) {
        const durationMs = Date.now() - startTime;
        attempts.push({
          attempt: attemptNumber,
          timestamp: new Date().toISOString(),
          durationMs,
          success: false,
          error: err?.message || "Network delivery failed"
        });
      }

      // If more attempts remain, backoff delay: 2^(attempt-1) * baseDelay
      if (attemptNumber < maxRetries && !isSuccess) {
        const delay = Math.pow(2, attemptNumber - 1) * baseDelay;
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // Update endpoint delivery statistics in state
    const currentEndpoint = this.endpoints.get(endpoint.id);
    if (currentEndpoint) {
      if (isSuccess) {
        currentEndpoint.lastDeliveredAt = new Date().toISOString();
        currentEndpoint.failureCount = 0;
        currentEndpoint.status = "active";
      } else {
        currentEndpoint.failureCount = (currentEndpoint.failureCount || 0) + 1;
        if (currentEndpoint.failureCount >= 3) {
          currentEndpoint.status = "failing";
        }
      }
      this.endpoints.set(endpoint.id, currentEndpoint);
    }

    const deliveryLog: WebhookDeliveryLog = {
      id: `dlv_${crypto.randomBytes(12).toString("hex")}`,
      eventId: eventPayload.id,
      endpointId: endpoint.id,
      status: isSuccess ? "success" : "failed",
      attempts,
      createdAt: new Date().toISOString()
    };

    this.deliveryLogs.set(deliveryLog.id, deliveryLog);
    return deliveryLog;
  }
}

export const mockWebhookService = new WebhookService();
