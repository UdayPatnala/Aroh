import { NextRequest, NextResponse } from "next/server";
import {
  AIOrchestrator,
  AIRequestPayloadSchema,
  createGenerativeUIBlock,
  formatSSEEvent,
  extractOrCreateTraceContext
} from "@aroh/asdk";

/**
 * AROH AI Studio Streaming SSE Ingress Route
 * Protocol: Server-Sent Events (text/event-stream)
 * Capabilities: W3C Distributed Tracing, Multi-Provider Failover, Generative UI Block Emission
 */

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const trace = extractOrCreateTraceContext(req.headers.get("traceparent"));

  try {
    const rawBody = await req.json();
    const validatedRequest = AIRequestPayloadSchema.parse(rawBody);

    const orchestrator = new AIOrchestrator();
    const lastUserMessage = validatedRequest.messages
      .slice()
      .reverse()
      .find((m) => m.role === "user")?.content || "";

    const userTextLower = lastUserMessage.toLowerCase();

    // Determine if user message triggers contextual Generative UI blocks
    const uiBlocksToEmit: ReturnType<typeof createGenerativeUIBlock>[] = [];

    if (userTextLower.includes("transfer") || userTextLower.includes("send aros") || userTextLower.includes("pay")) {
      uiBlocksToEmit.push(
        createGenerativeUIBlock(
          "aros_transfer_preview",
          "Aros Token Transfer Attestation",
          {
            amount: 150,
            recipient: "usr_developer_pro_42",
            fee: 0,
            currency: "Aros",
            note: "Authorized by affirmative biometric/passkey attestation"
          },
          {
            subtitle: "Read-Only Pre-Commit Ledger Attestation",
            action: {
              required: true,
              label: "Authorize Transfer",
              endpoint: "/api/payment/checkout",
              method: "POST",
              payload: { amount: 150, recipient: "usr_developer_pro_42" }
            }
          }
        )
      );
    } else if (userTextLower.includes("metric") || userTextLower.includes("telemetry") || userTextLower.includes("health")) {
      uiBlocksToEmit.push(
        createGenerativeUIBlock(
          "telemetry_visualizer",
          "Platform Telemetry Sparkline",
          {
            throughputOps: 48.2,
            p99LatencyMs: 16.4,
            activeSpokes: 6,
            ringBufferCapacity: 500,
            status: "HEALTHY"
          },
          {
            subtitle: "W3C Distributed Tracing Buffer",
            action: {
              required: false,
              label: "Open Telemetry Stream",
              endpoint: "/api/telemetry/stream",
              method: "GET"
            }
          }
        )
      );
    } else if (userTextLower.includes("spedex") || userTextLower.includes("omnistream") || userTextLower.includes("product")) {
      uiBlocksToEmit.push(
        createGenerativeUIBlock(
          "product_launchpad",
          "SpeDex Autonomous Logistics Spoke",
          {
            spokeId: "spedex",
            tier: "flagship",
            status: "FUTURE_LAUNCH",
            launchStage: "COMING_SOON",
            governanceConstraint: "Strictly 0 purchase/install CTAs prior to official launch"
          },
          {
            subtitle: "Showcase Hierarchy: Future Launch Product"
          }
        )
      );
    } else if (userTextLower.includes("quota") || userTextLower.includes("team") || userTextLower.includes("enterprise")) {
      uiBlocksToEmit.push(
        createGenerativeUIBlock(
          "enterprise_quota_card",
          "Enterprise Team Spending Quota",
          {
            organizationId: "org_alpha_group",
            monthlyQuotaAros: 5000,
            usedAros: 1420,
            remainingAros: 3580,
            role: "Developer Member"
          },
          {
            subtitle: "Phase 5 Multi-Tenant Directory Federation"
          }
        )
      );
    } else if (userTextLower.includes("roadmap") || userTextLower.includes("announcement") || userTextLower.includes("upcoming")) {
      uiBlocksToEmit.push(
        createGenerativeUIBlock(
          "announcement_card",
          "Ecosystem Future Developments",
          {
            featuredId: "google-play-billing",
            title: "Google Play Store Billing & Points Exploration",
            status: "EXPLORING_FUTURE_INTEGRATION",
            officialFeedbackChannel: "https://www.instagram.com/aroh.0s/"
          },
          {
            subtitle: "Canonical Ecosystem Roadmap Rail"
          }
        )
      );
    } else if (userTextLower.includes("consent") || userTextLower.includes("privacy") || userTextLower.includes("dpdp")) {
      uiBlocksToEmit.push(
        createGenerativeUIBlock(
          "statutory_consent_gate",
          "DPDP Act 2023 Affirmative Consent Gate",
          {
            purpose: "Autonomous Spoke Profile Sync",
            dataCategories: ["UserIdentifier", "SpokePreferences"],
            noticeVersion: "2026.1",
            unbundled: true
          },
          {
            subtitle: "Statutory Consent Management Architecture"
          }
        )
      );
    }

    // Initialize Web Stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // 1. Execute completion via orchestrator
          const completion = await orchestrator.complete(validatedRequest);

          // 2. Stream text deltas word by word for natural streaming experience
          const words = completion.content.split(" ");
          for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i === words.length - 1 ? "" : " ");
            const eventStr = formatSSEEvent({
              type: "text_delta",
              text: word
            });
            controller.enqueue(encoder.encode(eventStr));
            // Small pause between chunks
            await new Promise((r) => setTimeout(r, 20));
          }

          // 3. Emit contextual Generative UI blocks if triggered
          for (const block of uiBlocksToEmit) {
            const blockEventStr = formatSSEEvent({
              type: "ui_block",
              block
            });
            controller.enqueue(encoder.encode(blockEventStr));
          }

          // 4. Emit done event
          const doneEventStr = formatSSEEvent({
            type: "done",
            usage: completion.usage as unknown as Record<string, unknown>
          });
          controller.enqueue(encoder.encode(doneEventStr));
          controller.close();
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : "AI completion stream error";
          const errorEventStr = formatSSEEvent({
            type: "error",
            error: errMsg
          });
          controller.enqueue(encoder.encode(errorEventStr));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "x-trace-id": trace.traceId
      }
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Invalid AI request payload";
    return NextResponse.json(
      {
        error: errorMsg,
        traceId: trace.traceId
      },
      { status: 400 }
    );
  }
}
