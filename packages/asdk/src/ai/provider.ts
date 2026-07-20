export * from "./schema";
import {
  AIProviderType,
  AIRequestPayload,
  AIResponsePayload,
  validateAIRequest
} from "./schema";

export interface AIProviderAdapter {
  providerType: AIProviderType;
  execute(payload: AIRequestPayload): Promise<AIResponsePayload>;
}

export class MockAIProvider implements AIProviderAdapter {
  public providerType: AIProviderType = "mock";

  public async execute(payload: AIRequestPayload): Promise<AIResponsePayload> {
    const lastUserMsg = payload.messages
      .slice()
      .reverse()
      .find(m => m.role === "user")?.content || "No message provided";

    return {
      id: `mock-resp-${Date.now()}`,
      provider: "mock",
      model: payload.model || "mock-v1.0",
      content: `[Mock AI Orchestrator Response] Echo / Contextual response to: "${lastUserMsg}". AROH ecosystem provider abstraction layer validated successfully.`,
      usage: {
        promptTokens: 42,
        completionTokens: 28,
        totalTokens: 70,
        estimatedCostUsd: 0.0001
      }
    };
  }
}

export class AIOrchestrator {
  private adapters: Map<AIProviderType, AIProviderAdapter> = new Map();
  private fallbackOrder: AIProviderType[] = ["gemini", "claude", "openai", "local_ollama", "mock"];

  constructor() {
    this.registerAdapter(new MockAIProvider());
  }

  public registerAdapter(adapter: AIProviderAdapter): void {
    this.adapters.set(adapter.providerType, adapter);
  }

  public setFallbackOrder(order: AIProviderType[]): void {
    this.fallbackOrder = order;
  }

  public async complete(request: unknown): Promise<AIResponsePayload> {
    const validatedPayload = validateAIRequest(request);
    const primaryProvider = validatedPayload.provider || "mock";

    const attempts = [
      primaryProvider,
      ...this.fallbackOrder.filter(p => p !== primaryProvider)
    ];

    let lastError: Error | null = null;

    for (const provider of attempts) {
      const adapter = this.adapters.get(provider);
      if (!adapter) {
        continue;
      }

      try {
        const response = await adapter.execute(validatedPayload);
        return response;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[AIOrchestrator] Provider '${provider}' failed. Trying fallback...`, err);
      }
    }

    throw new Error(
      `[AIOrchestrator] All providers failed. Last error: ${lastError?.message || "No adapter available"}`
    );
  }
}
