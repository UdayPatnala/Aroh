import { describe, it, expect, beforeEach } from "vitest";
import {
  ApiKeyEnvironmentSchema,
  ApiKeyTierSchema,
  ApiKeyStatusSchema,
  ApiKeyRecordSchema,
  CreateApiKeyRequestSchema,
  TIER_RATE_LIMITS,
  generateApiKey,
  hashApiKey,
  maskApiKey,
  verifyApiKeyHash,
  mockApiKeyService
} from "../src";

describe("Developer API Key Vault — @aroh/asdk Suite", () => {
  beforeEach(() => {
    mockApiKeyService.clear();
  });

  describe("Zod Schema Contracts", () => {
    it("validates ApiKeyEnvironmentSchema", () => {
      expect(ApiKeyEnvironmentSchema.parse("live")).toBe("live");
      expect(ApiKeyEnvironmentSchema.parse("test")).toBe("test");
      expect(() => ApiKeyEnvironmentSchema.parse("prod")).toThrow();
    });

    it("validates ApiKeyTierSchema and rate limit mappings", () => {
      expect(ApiKeyTierSchema.parse("basic")).toBe("basic");
      expect(ApiKeyTierSchema.parse("pro")).toBe("pro");
      expect(ApiKeyTierSchema.parse("enterprise")).toBe("enterprise");
      expect(TIER_RATE_LIMITS.basic).toBe(60);
      expect(TIER_RATE_LIMITS.pro).toBe(300);
      expect(TIER_RATE_LIMITS.enterprise).toBe(1200);
    });

    it("validates CreateApiKeyRequestSchema requirements", () => {
      const valid = { name: "Analytics Agent Key", environment: "live", tier: "pro" };
      expect(CreateApiKeyRequestSchema.parse(valid)).toEqual(valid);

      // Name cannot be empty
      expect(() => CreateApiKeyRequestSchema.parse({ name: "", environment: "test" })).toThrow();
      // Defaults applied
      const minimal = CreateApiKeyRequestSchema.parse({ name: "Default Key" });
      expect(minimal.environment).toBe("test");
      expect(minimal.tier).toBe("basic");
    });
  });

  describe("Cryptographic Key Generation & Hashing", () => {
    it("generates production key with prefix aroh_live_", () => {
      const res = generateApiKey({
        userId: "usr_developer_01",
        name: "OmniStream Integration",
        environment: "live",
        tier: "pro"
      });

      expect(res.rawKey.startsWith("aroh_live_")).toBe(true);
      expect(res.apiKeyRecord.keyPrefix).toBe("aroh_live_");
      expect(res.apiKeyRecord.environment).toBe("live");
      expect(res.apiKeyRecord.tier).toBe("pro");
      expect(res.apiKeyRecord.rateLimitRpm).toBe(300);
      expect(res.apiKeyRecord.status).toBe("active");
      expect(res.apiKeyRecord.keyHash).toHaveLength(64); // 256-bit hex
      expect(res.apiKeyRecord.keyHash).not.toContain(res.rawKey); // Hash does not leak raw key
    });

    it("generates sandbox key with prefix aroh_test_", () => {
      const res = generateApiKey({
        userId: "usr_developer_02",
        name: "Local Test Runner",
        environment: "test",
        tier: "basic"
      });

      expect(res.rawKey.startsWith("aroh_test_")).toBe(true);
      expect(res.apiKeyRecord.keyPrefix).toBe("aroh_test_");
      expect(res.apiKeyRecord.environment).toBe("test");
      expect(res.apiKeyRecord.rateLimitRpm).toBe(60);
    });

    it("masks key safely without leaking internal entropy", () => {
      const res = generateApiKey({
        userId: "usr_developer_03",
        name: "Mask Test Key",
        environment: "live"
      });

      const masked = res.apiKeyRecord.maskedKey;
      expect(masked.startsWith("aroh_live_")).toBe(true);
      expect(masked).toContain("••••••••");
      expect(masked).not.toBe(res.rawKey);
    });

    it("verifies hash matching and rejects invalid keys", () => {
      const res = generateApiKey({
        userId: "usr_developer_04",
        name: "Hash Verifier",
        environment: "test"
      });

      expect(verifyApiKeyHash(res.rawKey, res.apiKeyRecord.keyHash)).toBe(true);
      expect(verifyApiKeyHash("aroh_test_invalidfakekey123456", res.apiKeyRecord.keyHash)).toBe(false);
    });
  });

  describe("Mock Key Service Lifecycle & Revocation", () => {
    it("creates, retrieves, and lists keys scoped to user", () => {
      const key1 = mockApiKeyService.createKey({
        userId: "user_alpha",
        name: "Key 1",
        environment: "test"
      });
      const key2 = mockApiKeyService.createKey({
        userId: "user_alpha",
        name: "Key 2",
        environment: "live"
      });
      const otherUserKey = mockApiKeyService.createKey({
        userId: "user_beta",
        name: "Other Key",
        environment: "live"
      });

      const alphaKeys = mockApiKeyService.listKeysByUser("user_alpha");
      expect(alphaKeys).toHaveLength(2);
      expect(alphaKeys.map((k) => k.id)).toContain(key1.apiKeyRecord.id);
      expect(alphaKeys.map((k) => k.id)).toContain(key2.apiKeyRecord.id);

      // Verify other user does not leak into alpha's list
      expect(alphaKeys.map((k) => k.id)).not.toContain(otherUserKey.apiKeyRecord.id);
    });

    it("enforces irreversible revocation (no undelete)", () => {
      const key = mockApiKeyService.createKey({
        userId: "user_gamma",
        name: "Revocable Key",
        environment: "live"
      });

      const revoked = mockApiKeyService.revokeKey(key.apiKeyRecord.id, "user_gamma");
      expect(revoked).not.toBeNull();
      expect(revoked?.status).toBe("revoked");
      expect(revoked?.revokedAt).toBeDefined();

      // Revoking again returns already revoked record without mutating state
      const reRevoked = mockApiKeyService.revokeKey(key.apiKeyRecord.id, "user_gamma");
      expect(reRevoked?.status).toBe("revoked");
    });

    it("prohibits revoking keys belonging to another user", () => {
      const key = mockApiKeyService.createKey({
        userId: "user_owner",
        name: "Protected Key",
        environment: "test"
      });

      const unauthorizedRevoke = mockApiKeyService.revokeKey(key.apiKeyRecord.id, "user_attacker");
      expect(unauthorizedRevoke).toBeNull();

      const unchanged = mockApiKeyService.getKeyById(key.apiKeyRecord.id);
      expect(unchanged?.status).toBe("active");
    });
  });
});
