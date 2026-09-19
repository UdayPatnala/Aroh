import { z } from "zod";

/**
 * Developer API Key Environment types
 */
export const ApiKeyEnvironmentSchema = z.enum(["live", "test"]);
export type ApiKeyEnvironment = z.infer<typeof ApiKeyEnvironmentSchema>;

/**
 * Developer API Key Tier types
 */
export const ApiKeyTierSchema = z.enum(["basic", "pro", "enterprise"]);
export type ApiKeyTier = z.infer<typeof ApiKeyTierSchema>;

/**
 * Rate limit mappings (requests per minute)
 */
export const TIER_RATE_LIMITS: Record<ApiKeyTier, number> = {
  basic: 60,
  pro: 300,
  enterprise: 1200
};

/**
 * API Key lifecycle status
 */
export const ApiKeyStatusSchema = z.enum(["active", "revoked"]);
export type ApiKeyStatus = z.infer<typeof ApiKeyStatusSchema>;

/**
 * Stored API Key Record Schema (Never stores raw key)
 */
export const ApiKeyRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1).max(50),
  keyPrefix: z.string(), // "aroh_live_" or "aroh_test_"
  keyHash: z.string().length(64), // SHA-256 hex string
  maskedKey: z.string(),
  tier: ApiKeyTierSchema,
  rateLimitRpm: z.number().positive(),
  environment: ApiKeyEnvironmentSchema,
  status: ApiKeyStatusSchema,
  createdAt: z.string(),
  lastUsedAt: z.string().nullable().optional(),
  revokedAt: z.string().nullable().optional()
});
export type ApiKeyRecord = z.infer<typeof ApiKeyRecordSchema>;

/**
 * Request to create a new API key
 */
export const CreateApiKeyRequestSchema = z.object({
  name: z.string().min(1, "Key name is required").max(50, "Key name must be 50 characters or less"),
  environment: ApiKeyEnvironmentSchema.default("test"),
  tier: ApiKeyTierSchema.default("basic")
});
export type CreateApiKeyRequest = z.infer<typeof CreateApiKeyRequestSchema>;

/**
 * Response returned once upon creation containing the raw key
 */
export const CreateApiKeyResponseSchema = z.object({
  apiKeyRecord: ApiKeyRecordSchema,
  rawKey: z.string() // Shown ONLY ONCE
});
export type CreateApiKeyResponse = z.infer<typeof CreateApiKeyResponseSchema>;
