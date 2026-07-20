import { z } from "zod";

export const AIProviderTypeSchema = z.enum([
  "gemini",
  "claude",
  "openai",
  "local_ollama",
  "mock"
]);
export type AIProviderType = z.infer<typeof AIProviderTypeSchema>;

export const AIRoleSchema = z.enum(["system", "user", "assistant", "tool"]);
export type AIRole = z.infer<typeof AIRoleSchema>;

export const AIMessageSchema = z.object({
  role: AIRoleSchema,
  content: z.string(),
  name: z.string().optional(),
  toolCallId: z.string().optional()
});
export type AIMessage = z.infer<typeof AIMessageSchema>;

export const AIToolDefinitionSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  parameters: z.record(z.string(), z.unknown())
});
export type AIToolDefinition = z.infer<typeof AIToolDefinitionSchema>;

export const AIRequestPayloadSchema = z.object({
  messages: z.array(AIMessageSchema).min(1),
  provider: AIProviderTypeSchema.default("mock"),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(2048),
  tools: z.array(AIToolDefinitionSchema).optional(),
  systemPrompt: z.string().optional()
});
export type AIRequestPayload = z.infer<typeof AIRequestPayloadSchema>;

export const AIToolCallSchema = z.object({
  id: z.string(),
  name: z.string(),
  arguments: z.record(z.string(), z.unknown())
});
export type AIToolCall = z.infer<typeof AIToolCallSchema>;

export const AIUsageSchema = z.object({
  promptTokens: z.number().nonnegative(),
  completionTokens: z.number().nonnegative(),
  totalTokens: z.number().nonnegative(),
  estimatedCostUsd: z.number().nonnegative()
});
export type AIUsage = z.infer<typeof AIUsageSchema>;

export const AIResponsePayloadSchema = z.object({
  id: z.string(),
  provider: AIProviderTypeSchema,
  model: z.string(),
  content: z.string(),
  toolCalls: z.array(AIToolCallSchema).optional(),
  usage: AIUsageSchema.optional()
});
export type AIResponsePayload = z.infer<typeof AIResponsePayloadSchema>;

export function validateAIRequest(data: unknown): AIRequestPayload {
  return AIRequestPayloadSchema.parse(data);
}
