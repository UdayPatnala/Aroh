import { describe, it, expect, beforeEach } from "vitest";
import {
  WebhookEventTypeSchema,
  CreateWebhookEndpointRequestSchema,
  WebhookEndpointRecordSchema,
  WebhookEventPayloadSchema,
  generateWebhookSecret,
  hashWebhookSecret,
  signWebhookPayload,
  verifyWebhookSignature,
  mockWebhookService,
  WebhookTransport
} from "../src";

describe("Asynchronous Webhook Clearance Engine — @aroh/asdk Suite", () => {
  beforeEach(() => {
    mockWebhookService.clear();
  });

  describe("Zod Schema Contracts", () => {
    it("validates the 4 authoritative WebhookEventType values", () => {
      expect(WebhookEventTypeSchema.parse("aros.credited")).toBe("aros.credited");
      expect(WebhookEventTypeSchema.parse("aros.debited")).toBe("aros.debited");
      expect(WebhookEventTypeSchema.parse("membership.upgraded")).toBe(
        "membership.upgraded"
      );
      expect(WebhookEventTypeSchema.parse("challenge.completed")).toBe(
        "challenge.completed"
      );
      expect(() => WebhookEventTypeSchema.parse("unknown.event")).toThrow();
    });

    it("validates CreateWebhookEndpointRequestSchema", () => {
      const valid = CreateWebhookEndpointRequestSchema.parse({
        url: "https://api.partner.com/webhooks/aroh",
        description: "Primary webhook endpoint",
        events: ["aros.credited", "membership.upgraded"]
      });
      expect(valid.url).toBe("https://api.partner.com/webhooks/aroh");
      expect(valid.events).toHaveLength(2);

      // Invalid URL
      expect(() =>
        CreateWebhookEndpointRequestSchema.parse({
          url: "not-a-url",
          events: ["aros.credited"]
        })
      ).toThrow();

      // Empty events
      expect(() =>
        CreateWebhookEndpointRequestSchema.parse({
          url: "https://api.partner.com",
          events: []
        })
      ).toThrow();
    });

    it("validates WebhookEventPayloadSchema", () => {
      const payload = WebhookEventPayloadSchema.parse({
        id: "evt_1234567890abcdef",
        type: "aros.credited",
        timestamp: new Date().toISOString(),
        data: { userId: "usr_001", amount: 250 }
      });
      expect(payload.id.startsWith("evt_")).toBe(true);
      expect(payload.data.amount).toBe(250);
    });
  });

  describe("Cryptographic HMAC-SHA256 Signing & Verification", () => {
    const testSecret = "whsec_test_secret_key_1234567890abcdef";
    const testPayload = JSON.stringify({
      id: "evt_test123",
      type: "aros.debited",
      data: { amount: 50 }
    });

    it("generates signing secrets with prefix whsec_", () => {
      const secret = generateWebhookSecret();
      expect(secret.startsWith("whsec_")).toBe(true);
      expect(secret.length).toBeGreaterThan(20);
    });

    it("hashes webhook secrets deterministically using SHA-256", () => {
      const hash1 = hashWebhookSecret("my-secret");
      const hash2 = hashWebhookSecret("my-secret");
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });

    it("signs payload and creates valid x-aroh-signature header", () => {
      const now = Math.floor(Date.now() / 1000);
      const { signatureHeader, timestamp, signature } = signWebhookPayload(
        testPayload,
        testSecret,
        now
      );

      expect(signatureHeader).toContain(`t=${now}`);
      expect(signatureHeader).toContain(`v1=${signature}`);
      expect(timestamp).toBe(now);
    });

    it("verifies authentic signature matching payload, secret, and timestamp", () => {
      const { signatureHeader } = signWebhookPayload(testPayload, testSecret);
      const isValid = verifyWebhookSignature(
        testPayload,
        signatureHeader,
        testSecret
      );
      expect(isValid).toBe(true);
    });

    it("rejects tampered payload content", () => {
      const { signatureHeader } = signWebhookPayload(testPayload, testSecret);
      const tamperedPayload = JSON.stringify({
        id: "evt_test123",
        type: "aros.debited",
        data: { amount: 999999 } // tampered
      });

      const isValid = verifyWebhookSignature(
        tamperedPayload,
        signatureHeader,
        testSecret
      );
      expect(isValid).toBe(false);
    });

    it("rejects signature signed with a different secret", () => {
      const { signatureHeader } = signWebhookPayload(testPayload, testSecret);
      const isValid = verifyWebhookSignature(
        testPayload,
        signatureHeader,
        "whsec_wrong_secret"
      );
      expect(isValid).toBe(false);
    });

    it("rejects expired signatures beyond tolerance window (300 seconds)", () => {
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 301;
      const { signatureHeader } = signWebhookPayload(
        testPayload,
        testSecret,
        expiredTimestamp
      );

      const isValid = verifyWebhookSignature(
        testPayload,
        signatureHeader,
        testSecret,
        300
      );
      expect(isValid).toBe(false);
    });
  });

  describe("Endpoint Registration & Management", () => {
    it("registers endpoint and returns raw secret once while storing hash", () => {
      const { endpoint, secret } = mockWebhookService.registerEndpoint(
        "user_123",
        {
          url: "https://example.com/webhook",
          description: "Production webhook",
          events: ["aros.credited"]
        }
      );

      expect(endpoint.id.startsWith("wh_")).toBe(true);
      expect(endpoint.userId).toBe("user_123");
      expect(endpoint.status).toBe("active");
      expect(secret.startsWith("whsec_")).toBe(true);
      expect(endpoint.secretHash).toBe(hashWebhookSecret(secret));
      expect((endpoint as any).secret).toBeUndefined(); // Zero plaintext persistence
    });

    it("lists endpoints filtered by user ID", () => {
      mockWebhookService.registerEndpoint("user_1", {
        url: "https://u1.com",
        events: ["aros.credited"]
      });
      mockWebhookService.registerEndpoint("user_2", {
        url: "https://u2.com",
        events: ["aros.debited"]
      });

      const u1List = mockWebhookService.listEndpoints("user_1");
      expect(u1List).toHaveLength(1);
      expect(u1List[0].userId).toBe("user_1");

      const u2List = mockWebhookService.listEndpoints("user_2");
      expect(u2List).toHaveLength(1);
      expect(u2List[0].userId).toBe("user_2");
    });

    it("deletes endpoint securely by user ID", () => {
      const { endpoint } = mockWebhookService.registerEndpoint("user_1", {
        url: "https://u1.com",
        events: ["aros.credited"]
      });

      expect(mockWebhookService.getEndpoint("user_1", endpoint.id)).not.toBeNull();
      const deleted = mockWebhookService.deleteEndpoint("user_1", endpoint.id);
      expect(deleted).toBe(true);
      expect(mockWebhookService.getEndpoint("user_1", endpoint.id)).toBeNull();
    });
  });

  describe("Asynchronous Event Dispatch & Exponential Backoff Retry", () => {
    const testEvent = {
      id: "evt_dispatch_001",
      type: "aros.credited" as const,
      timestamp: new Date().toISOString(),
      data: { aros: 100 }
    };

    it("successfully clears event on initial attempt (HTTP 200)", async () => {
      const { endpoint, secret } = mockWebhookService.registerEndpoint("user_1", {
        url: "https://partner.com/wh",
        events: ["aros.credited"]
      });

      const mockTransport: WebhookTransport = async () => ({
        status: 200,
        ok: true
      });

      const log = await mockWebhookService.dispatchEvent(
        endpoint,
        testEvent,
        secret,
        { transport: mockTransport, backoffMultiplierMs: 0 }
      );

      expect(log.status).toBe("success");
      expect(log.attempts).toHaveLength(1);
      expect(log.attempts[0].statusCode).toBe(200);
      expect(log.attempts[0].success).toBe(true);

      const updatedEndpoint = mockWebhookService.getEndpoint("user_1", endpoint.id);
      expect(updatedEndpoint?.lastDeliveredAt).toBeDefined();
      expect(updatedEndpoint?.failureCount).toBe(0);
      expect(updatedEndpoint?.status).toBe("active");
    });

    it("retries with exponential backoff on intermittent errors and recovers on attempt 3", async () => {
      const { endpoint, secret } = mockWebhookService.registerEndpoint("user_1", {
        url: "https://flaky-server.com/wh",
        events: ["aros.credited"]
      });

      let attemptCounter = 0;
      const mockTransport: WebhookTransport = async () => {
        attemptCounter++;
        if (attemptCounter < 3) {
          return { status: 503, ok: false };
        }
        return { status: 200, ok: true };
      };

      const log = await mockWebhookService.dispatchEvent(
        endpoint,
        testEvent,
        secret,
        { transport: mockTransport, backoffMultiplierMs: 5 } // Fast for hermetic tests
      );

      expect(log.status).toBe("success");
      expect(log.attempts).toHaveLength(3);
      expect(log.attempts[0].statusCode).toBe(503);
      expect(log.attempts[0].success).toBe(false);
      expect(log.attempts[1].statusCode).toBe(503);
      expect(log.attempts[1].success).toBe(false);
      expect(log.attempts[2].statusCode).toBe(200);
      expect(log.attempts[2].success).toBe(true);
    });

    it("fails delivery after exhausting 3 attempts and marks endpoint failing after 3 consecutive dispatch failures", async () => {
      const { endpoint, secret } = mockWebhookService.registerEndpoint("user_1", {
        url: "https://broken-server.com/wh",
        events: ["aros.credited"]
      });

      const failingTransport: WebhookTransport = async () => ({
        status: 500,
        ok: false
      });

      // Dispatch 1
      const log1 = await mockWebhookService.dispatchEvent(
        endpoint,
        testEvent,
        secret,
        { transport: failingTransport, backoffMultiplierMs: 0 }
      );
      expect(log1.status).toBe("failed");
      expect(log1.attempts).toHaveLength(3);

      // Dispatch 2
      await mockWebhookService.dispatchEvent(
        endpoint,
        testEvent,
        secret,
        { transport: failingTransport, backoffMultiplierMs: 0 }
      );

      // Dispatch 3
      await mockWebhookService.dispatchEvent(
        endpoint,
        testEvent,
        secret,
        { transport: failingTransport, backoffMultiplierMs: 0 }
      );

      const failingEndpoint = mockWebhookService.getEndpoint("user_1", endpoint.id);
      expect(failingEndpoint?.failureCount).toBe(3);
      expect(failingEndpoint?.status).toBe("failing");
    });
  });
});
