# ADR-003: Provider-Agnostic AI Abstraction Layer

- **Status:** Approved
- **Date:** 2026-07-20
- **Authors:** AROH System Architect & Engineering Team
- **Deciders:** Engineering Architecture Board

---

## Context & Problem Statement

Coupling AI-native workspace capabilities directly to a single provider (e.g. OpenAI, Anthropic, or Google Gemini APIs) exposes the platform to vendor lock-in, breaking API changes, downtime, and unmanaged API costs.

---

## Decision Outcome

We implement a provider-agnostic `AIOrchestrator` in `@aroh/asdk`:

1. **Decoupled Contracts:** Request and response payloads are strictly typed via Zod (`AIRequestPayloadSchema`, `AIResponsePayloadSchema`).
2. **Provider Adapter Interface:** Each AI provider (Gemini, Claude, OpenAI, Ollama, Mock) implements a standard `AIProviderAdapter` interface.
3. **Fallback Pipeline:** If the primary provider fails or rate-limits, the `AIOrchestrator` automatically fails over down the defined priority chain.
4. **Offline Mock Support:** For deterministic developer testing and CI environments, `MockAIProvider` serves as the default fallback.

---

## Implementation Reference

- AI Contracts: [`packages/asdk/src/ai/schema.ts`](file:///d:/PROJECT/AROH/packages/asdk/src/ai/schema.ts)
- AI Orchestrator: [`packages/asdk/src/ai/provider.ts`](file:///d:/PROJECT/AROH/packages/asdk/src/ai/provider.ts)
