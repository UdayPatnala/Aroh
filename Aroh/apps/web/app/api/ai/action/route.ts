import { NextRequest, NextResponse } from "next/server";
import {
  GenerativeUIActionRequestSchema,
  generativeUIActionDispatcher,
  extractOrCreateTraceContext,
  emitTelemetryEvent
} from "@aroh/asdk";

/**
 * AROH Generative UI Action Settlement Gateway
 * Route: POST /api/ai/action
 * 
 * Strict Invariants:
 * 1. D2 Financial Safety Invariant: Zero direct client balance mutation.
 * 2. Mandatory Server-Side Age Attestation: NO_MINOR_PAYMENT_FOR_AROS = true.
 * 3. Cryptographic Receipting: Emits SHA-256 verifiable receipt ID.
 * 4. Distributed Tracing: Injects W3C traceparent headers and forwards to telemetry broker.
 */

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const trace = extractOrCreateTraceContext(req.headers.get("traceparent"));

  try {
    const rawBody = await req.json();
    const validatedRequest = GenerativeUIActionRequestSchema.parse(rawBody);

    // Execute through authoritative ASDK dispatcher
    const result = generativeUIActionDispatcher.executeAction(validatedRequest);

    // Record telemetry event for observability
    emitTelemetryEvent(
      result.success ? "settlement.completed" : "webhook.failed",
      {
        journeyPath: "/api/ai/action",
        note: `actionId=${result.actionId};status=${result.status};receiptId=${result.receiptId || "none"}`
      },
      trace.raw
    );

    const statusCode = result.success ? 200 : 403;

    return NextResponse.json(result, {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        "traceparent": trace.raw,
        "x-aroh-trace-id": trace.traceId
      }
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Invalid action payload";

    emitTelemetryEvent(
      "webhook.failed",
      {
        journeyPath: "/api/ai/action",
        note: `error=${errorMessage}`
      },
      trace.raw
    );

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        traceId: trace.traceId
      },
      {
        status: 400,
        headers: {
          "traceparent": trace.raw,
          "x-aroh-trace-id": trace.traceId
        }
      }
    );

  }
}
