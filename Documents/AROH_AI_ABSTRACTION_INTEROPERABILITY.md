# AROH AI Abstraction & Interoperability Specification

- **Specification Version:** v1.0.0
- **Status:** Active Standard
- **Package:** `@aroh/asdk` (`src/ai/`)
- **Author:** AROH Platform Architecture Group

---

## 1. Vision & Architecture

The **AROH AI Abstraction Layer** provides a provider-agnostic interface for AI capabilities across the ecosystem. It decouples higher-level AI orchestration (contextual reasoning, prompt canvas execution, multi-agent coordination, search augmentation) from lower-level provider implementations (Google Gemini, Anthropic Claude, OpenAI, Ollama local models, or Mock testing providers).

```
 ┌───────────────────────────────────────────────────────────┐
 │               AROH Ecosystem Applications                 │
 │       (apps/web, Developer Portal, Command Palette)       │
 └─────────────────────────────┬─────────────────────────────┘
                               │
 ┌─────────────────────────────▼─────────────────────────────┐
 │                AIOrchestrator (@aroh/asdk)                │
 └──────┬──────────────────┬──────────────────┬──────────────┘
        │                  │                  │
 ┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
 │  Gemini     │    │  Claude     │    │  Mock /     │
 │  Adapter    │    │  Adapter    │    │  Local      │
 └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 2. Zod Contract Specification

All AI interactions enforce strict Zod schemas defined in `packages/asdk/src/ai/schema.ts`:

### 2.1. Request Payload Schema
```typescript
const AIRequestPayloadSchema = z.object({
  messages: z.array(AIMessageSchema).min(1),
  provider: z.enum(["gemini", "claude", "openai", "local_ollama", "mock"]).default("mock"),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(2048),
  tools: z.array(AIToolDefinitionSchema).optional(),
  systemPrompt: z.string().optional()
});
```

### 2.2. Response Payload Schema
```typescript
const AIResponsePayloadSchema = z.object({
  id: z.string(),
  provider: AIProviderTypeSchema,
  model: z.string(),
  content: z.string(),
  toolCalls: z.array(AIToolCallSchema).optional(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
    estimatedCostUsd: z.number()
  }).optional()
});
```

---

## 3. Fallback Pipeline & Multi-Agent Collaboration

### 3.1. Automatic Fallback Sequence
1. Primary Provider Request (e.g. `gemini`)
2. On rate limit (429) or downtime (5xx) -> Failover to `claude`
3. Secondary Failover -> `openai`
4. Fallback Guard -> `mock` (ensures UI stability)

### 3.2. Programmatic Usage
```typescript
import { AIOrchestrator } from "@aroh/asdk";

const orchestrator = new AIOrchestrator();

const response = await orchestrator.complete({
  messages: [
    { role: "system", content: "You are the AROH Platform AI Architect." },
    { role: "user", content: "Analyze the current ecosystem workspace status." }
  ],
  provider: "mock"
});

console.log(response.content);
```

---

## 4. Verification

Integration tests verify provider fallback and schema enforcement:
```bash
npx tsx scripts/test-ai-abstraction.js
```
