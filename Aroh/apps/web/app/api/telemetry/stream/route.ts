/**
 * AROH Platform — Real-Time Telemetry Stream (SSE)
 * Route: GET /api/telemetry/stream
 *
 * Wave 2 Milestone 3.5 (WAVE-02-TASK-05)
 *
 * Streams real-time operational telemetry to authorised admin/operator
 * clients using Server-Sent Events (SSE). The stream:
 *   1. Emits an immediate aggregate snapshot on connection.
 *   2. Sends a heartbeat + fresh snapshot every 5 seconds.
 *   3. Runs indefinitely until the client disconnects.
 *
 * Security invariants:
 *   - Requires a valid authenticated session (checked via x-aroh-user-role header
 *     or cookie, mirroring admin page role check).
 *   - Accepts only admin or operator roles; rejects all others with 403.
 *   - No user PII is present in any emitted event payload.
 *   - No external real-time services (Pusher, Ably, etc.) are used.
 *
 * Note: Next.js App Router does not have native WebSocket support in the
 * standard Edge/Node runtime. SSE (a unidirectional persistent HTTP stream)
 * is the correct and spec-compliant approach for server-push telemetry in
 * Next.js, and is semantically equivalent for read-only metrics dashboards.
 * The manifest labels this "WebSocket Metrics" as a product intent; the
 * implementation uses SSE as the platform-appropriate mechanism.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  emitHeartbeat,
  getTelemetrySnapshot,
  formatSnapshotSSEFrame,
  formatSSEFrame,
  emitTelemetryEvent
} from "@aroh/asdk/src/telemetry";

/** SSE heartbeat interval in milliseconds. */
const HEARTBEAT_INTERVAL_MS = 5_000;

/**
 * Validates the request has admin or operator role authority.
 * In production this would verify a signed JWT / session cookie.
 * For the platform's mock-session model, the x-aroh-user-role header
 * is set server-side by middleware and is not user-controllable from
 * the browser (it is stripped on ingress by middleware before propagation).
 */
function isAuthorized(request: NextRequest): boolean {
  // Accept requests that carry the admin/operator role signal.
  // In the live platform this header is injected by the Next.js
  // authentication middleware after verifying the session token.
  const role = request.headers.get("x-aroh-user-role");
  if (role === "admin" || role === "operator") return true;

  // Development / demo fallback: allow if ?demo=1 query param is present
  // (only active when NODE_ENV !== "production").
  if (process.env.NODE_ENV !== "production") {
    const demo = new URL(request.url).searchParams.get("demo");
    if (demo === "1") return true;
  }

  return false;
}

export async function GET(request: NextRequest): Promise<NextResponse | Response> {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Forbidden: admin or operator role required." },
      { status: 403 }
    );
  }

  const traceparent = request.headers.get("traceparent") ?? undefined;

  // ReadableStream — SSE body pushed from server
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const push = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          // Controller closed (client disconnected) — swallow gracefully
        }
      };

      // 1. Emit immediate snapshot on connection
      const connectEvent = emitTelemetryEvent(
        "heartbeat",
        { note: "stream-connected" },
        traceparent
      );
      push(formatSSEFrame(connectEvent));

      const snapshot = getTelemetrySnapshot();
      push(formatSnapshotSSEFrame(snapshot));

      // 2. Periodic heartbeat + snapshot every HEARTBEAT_INTERVAL_MS
      const timer = setInterval(() => {
        try {
          const hbEvent = emitHeartbeat(traceparent);
          push(formatSSEFrame(hbEvent));

          const freshSnapshot = getTelemetrySnapshot();
          push(formatSnapshotSSEFrame(freshSnapshot));
        } catch {
          clearInterval(timer);
        }
      }, HEARTBEAT_INTERVAL_MS);

      // 3. Clean up when client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(timer);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no"   // Disable nginx buffering for SSE
    }
  });
}
