import * as crypto from "crypto";
import {
  ApiKeyRecord,
  ApiKeyEnvironment,
  ApiKeyTier,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  TIER_RATE_LIMITS
} from "../schemas/api-key";

/**
 * Hash raw API key using SHA-256
 */
export function hashApiKey(rawKey: string): string {
  return crypto.createHash("sha256").update(rawKey, "utf8").digest("hex");
}

/**
 * Produce masked representation of raw API key for safe display
 */
export function maskApiKey(rawKey: string): string {
  if (rawKey.startsWith("aroh_live_")) {
    const body = rawKey.slice("aroh_live_".length);
    return `aroh_live_${body.slice(0, 4)}••••••••${body.slice(-4)}`;
  } else if (rawKey.startsWith("aroh_test_")) {
    const body = rawKey.slice("aroh_test_".length);
    return `aroh_test_${body.slice(0, 4)}••••••••${body.slice(-4)}`;
  }
  return `${rawKey.slice(0, 6)}••••••••${rawKey.slice(-4)}`;
}

/**
 * Cryptographically verify whether a raw key matches a stored SHA-256 hash
 */
export function verifyApiKeyHash(rawKey: string, storedHash: string): boolean {
  const computedHash = hashApiKey(rawKey);
  if (computedHash.length !== storedHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(storedHash, "hex"));
}

/**
 * Generate a new API key record and raw key
 */
export function generateApiKey(params: {
  userId: string;
  name: string;
  environment: ApiKeyEnvironment;
  tier?: ApiKeyTier;
}): CreateApiKeyResponse {
  const tier: ApiKeyTier = params.tier || "basic";
  const prefix = params.environment === "live" ? "aroh_live_" : "aroh_test_";
  const entropy = crypto.randomBytes(24).toString("hex");
  const rawKey = `${prefix}${entropy}`;
  const keyHash = hashApiKey(rawKey);
  const maskedKey = maskApiKey(rawKey);
  const id = `key_${crypto.randomUUID()}`;

  const apiKeyRecord: ApiKeyRecord = {
    id,
    userId: params.userId,
    name: params.name,
    keyPrefix: prefix,
    keyHash,
    maskedKey,
    tier,
    rateLimitRpm: TIER_RATE_LIMITS[tier],
    environment: params.environment,
    status: "active",
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    revokedAt: null
  };

  return {
    apiKeyRecord,
    rawKey
  };
}

/**
 * In-memory Mock Service for offline, testing, and dev workflows
 */
class MockApiKeyService {
  private keys: Map<string, ApiKeyRecord> = new Map();

  createKey(params: {
    userId: string;
    name: string;
    environment: ApiKeyEnvironment;
    tier?: ApiKeyTier;
  }): CreateApiKeyResponse {
    const result = generateApiKey(params);
    this.keys.set(result.apiKeyRecord.id, { ...result.apiKeyRecord });
    return result;
  }

  listKeysByUser(userId: string): ApiKeyRecord[] {
    return Array.from(this.keys.values()).filter((k) => k.userId === userId);
  }

  getKeyById(keyId: string): ApiKeyRecord | null {
    return this.keys.get(keyId) || null;
  }

  revokeKey(keyId: string, userId: string): ApiKeyRecord | null {
    const key = this.keys.get(keyId);
    if (!key || key.userId !== userId) {
      return null;
    }
    if (key.status === "revoked") {
      return key;
    }
    const updated: ApiKeyRecord = {
      ...key,
      status: "revoked",
      revokedAt: new Date().toISOString()
    };
    this.keys.set(keyId, updated);
    return updated;
  }

  clear(): void {
    this.keys.clear();
  }
}

export const mockApiKeyService = new MockApiKeyService();
