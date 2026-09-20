/**
 * @aroh/asdk — Real-Time Operational Telemetry Broker
 *
 * Wave 2 Milestone 3.5 (WAVE-02-TASK-05)
 * Phase: 3.5 — External Service Federation & Observability
 *
 * Provides:
 *  - Canonical telemetry event types for the AROH platform.
 *  - In-memory circular event buffer (last N events, zero persistence).
 *  - Event emission API consumed by ledger and webhook clearance layers.
 *  - SSE (Server-Sent Events) frame formatter for the /api/telemetry/stream route.
 *  - Aggregate metric computations (latency p50/p95, active journey counts).
 *
 * Security invariants:
 *  - No user PII (name, email, phone, wallet balance) is exposed in any metric event.
 *  - Only aggregate counts, latencies (ms), and journey paths are emitted.
 *  - Buffer is volatile — process restart clears all events (no persistence surface).
 *
 * Runtime compatibility: Edge, Node.js 18+, Browser (no Node crypto dependency).
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. Canonical Telemetry Event Types
// ─────────────────────────────────────────────────────────────────────────────

export type TelemetryEventType =
  | "settlement.completed"    // Fiat-to-Aros on-ramp settlement finished
  | "settlement.latency"      // Settlement round-trip latency recorded (ms)
  | "webhook.dispatched"      // Outbound webhook delivery attempt sent
  | "webhook.failed"          // Outbound webhook delivery attempt failed
  | "journey.started"         // User entered a measurable product journey
  | "journey.completed"       // User completed a measurable product journey
  | "api_key.created"         // New developer API key provisioned
  | "api_key.revoked"         // Developer API key revoked
  | "heartbeat";              // Periodic broker liveness ping

// ─────────────────────────────────────────────────────────────────────────────
// 2. TelemetryEvent — canonical event envelope
// ─────────────────────────────────────────────────────────────────────────────

export interface TelemetryEvent {
  /** Unique event identifier (UUID v4-style hex string). */
  id: string;
  /** ISO-8601 timestamp when the event was emitted (UTC). */
  timestamp: string;
  /** W3C traceparent header value that correlates this event across services. */
  traceparent: string;
  /** Canonical event type discriminator. */
  type: TelemetryEventType;
  /**
   * Structured metric payload.
   * All values are aggregate/operational — NEVER user PII.
   */
  payload: TelemetryPayload;
}

export interface TelemetryPayload {
  /** Settlement latency in milliseconds (present for settlement.latency events). */
  latencyMs?: number;
  /** Journey route path (e.g. "/dashboard/purchase"). No query strings. */
  journeyPath?: string;
  /** Opaque userId hash (SHA-256 prefix, 8 chars) — NOT the raw userId. */
  userIdHash?: string;
  /** Webhook event type that was dispatched / failed. */
  webhookEventType?: string;
  /** HTTP status code returned by webhook target (if available). */
  webhookStatusCode?: number;
  /** Number of retry attempts made before this outcome. */
  retryAttempt?: number;
  /** Developer API key tier (Basic | Pro | Enterprise). NOT the raw key. */
  apiKeyTier?: "Basic" | "Pro" | "Enterprise";
  /** Freeform operational note (non-PII). */
  note?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Aggregate Metrics Snapshot
// ─────────────────────────────────────────────────────────────────────────────

export interface TelemetryMetricsSnapshot {
  /** ISO-8601 snapshot timestamp. */
  snapshotAt: string;
  /** Total events in the in-memory buffer. */
  bufferSize: number;
  /** Count of settlement events in the buffer. */
  settlementCount: number;
  /** p50 settlement latency (ms) across all settlement.latency events. */
  settlementLatencyP50Ms: number | null;
  /** p95 settlement latency (ms) across all settlement.latency events. */
  settlementLatencyP95Ms: number | null;
  /** Count of active user journeys (started but not yet completed). */
  activeJourneys: number;
  /** Count of completed user journeys. */
  completedJourneys: number;
  /** Count of webhook dispatch successes. */
  webhookSuccessCount: number;
  /** Count of webhook dispatch failures. */
  webhookFailureCount: number;
  /** Count of API key creation events. */
  apiKeyCreatedCount: number;
  /** Most recent 10 events (descending order). */
  recentEvents: TelemetryEvent[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. In-Memory Circular Ring Buffer
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_BUFFER_CAPACITY = 500;

class TelemetryRingBuffer {
  private readonly buffer: TelemetryEvent[];
  private readonly capacity: number;
  private head = 0;
  private size = 0;

  constructor(capacity = DEFAULT_BUFFER_CAPACITY) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  push(event: TelemetryEvent): void {
    this.buffer[this.head] = event;
    this.head = (this.head + 1) % this.capacity;
    if (this.size < this.capacity) {
      this.size++;
    }
  }

  /**
   * Returns all events in chronological insertion order.
   */
  all(): TelemetryEvent[] {
    if (this.size === 0) return [];
    if (this.size < this.capacity) {
      return this.buffer.slice(0, this.size);
    }
    // Buffer has wrapped — reconstruct chronological order
    const tail = this.head;
    return [
      ...this.buffer.slice(tail, this.capacity),
      ...this.buffer.slice(0, tail)
    ];
  }

  length(): number {
    return this.size;
  }

  clear(): void {
    this.head = 0;
    this.size = 0;
  }
}

// Singleton ring buffer — shared across all imports in a Node.js process.
const _ringBuffer = new TelemetryRingBuffer(DEFAULT_BUFFER_CAPACITY);

// ─────────────────────────────────────────────────────────────────────────────
// 5. Event ID Generation (Web Crypto API — Edge/Node compatible)
// ─────────────────────────────────────────────────────────────────────────────

function generateEventId(): string {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback: Math.random (deterministic tests or unsupported environments)
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Public Emission API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Emits a telemetry event into the in-memory ring buffer.
 * Called by ledger, webhook clearance engine, API key service, etc.
 *
 * @param type    - Canonical event type.
 * @param payload - Non-PII structured metric payload.
 * @param traceparent - W3C traceparent from the originating request (optional).
 * @returns       The fully constructed TelemetryEvent that was buffered.
 */
export function emitTelemetryEvent(
  type: TelemetryEventType,
  payload: TelemetryPayload,
  traceparent = "00-00000000000000000000000000000001-0000000000000001-01"
): TelemetryEvent {
  const event: TelemetryEvent = {
    id: generateEventId(),
    timestamp: new Date().toISOString(),
    traceparent,
    type,
    payload
  };
  _ringBuffer.push(event);
  return event;
}

/**
 * Emits a broker heartbeat event. Called periodically by the SSE stream route.
 */
export function emitHeartbeat(traceparent?: string): TelemetryEvent {
  return emitTelemetryEvent(
    "heartbeat",
    { note: "broker-liveness" },
    traceparent
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Metric Query API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all events currently in the ring buffer (chronological order).
 */
export function getAllTelemetryEvents(): TelemetryEvent[] {
  return _ringBuffer.all();
}

/**
 * Returns the last N events in descending order (newest first).
 */
export function getRecentTelemetryEvents(limit = 10): TelemetryEvent[] {
  const all = _ringBuffer.all();
  return all.slice(-Math.min(limit, all.length)).reverse();
}

/**
 * Computes and returns an aggregate metrics snapshot from the current buffer.
 */
export function getTelemetrySnapshot(): TelemetryMetricsSnapshot {
  const events = _ringBuffer.all();

  const latencies = events
    .filter((e) => e.type === "settlement.latency" && typeof e.payload.latencyMs === "number")
    .map((e) => e.payload.latencyMs as number)
    .sort((a, b) => a - b);

  const journeysStarted = events.filter((e) => e.type === "journey.started").length;
  const journeysCompleted = events.filter((e) => e.type === "journey.completed").length;

  return {
    snapshotAt: new Date().toISOString(),
    bufferSize: _ringBuffer.length(),
    settlementCount: events.filter((e) => e.type === "settlement.completed").length,
    settlementLatencyP50Ms: computePercentile(latencies, 50),
    settlementLatencyP95Ms: computePercentile(latencies, 95),
    activeJourneys: Math.max(0, journeysStarted - journeysCompleted),
    completedJourneys: journeysCompleted,
    webhookSuccessCount: events.filter((e) => e.type === "webhook.dispatched").length,
    webhookFailureCount: events.filter((e) => e.type === "webhook.failed").length,
    apiKeyCreatedCount: events.filter((e) => e.type === "api_key.created").length,
    recentEvents: getRecentTelemetryEvents(10)
  };
}

/**
 * Clears the in-memory ring buffer. Used only in test environments.
 */
export function clearTelemetryBuffer(): void {
  _ringBuffer.clear();
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. SSE Frame Formatter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats a TelemetryEvent as a Server-Sent Events frame.
 *
 * Format:
 *   id: <event.id>
 *   event: <event.type>
 *   data: <JSON payload>
 *   \n\n
 */
export function formatSSEFrame(event: TelemetryEvent): string {
  return [
    `id: ${event.id}`,
    `event: ${event.type}`,
    `data: ${JSON.stringify(event)}`,
    "",
    ""
  ].join("\n");
}

/**
 * Formats an aggregate snapshot as an SSE frame.
 */
export function formatSnapshotSSEFrame(snapshot: TelemetryMetricsSnapshot): string {
  const syntheticEvent: TelemetryEvent = {
    id: generateEventId(),
    timestamp: snapshot.snapshotAt,
    traceparent: "00-00000000000000000000000000000001-0000000000000001-00",
    type: "heartbeat",
    payload: { note: "snapshot" }
  };
  return [
    `id: ${syntheticEvent.id}`,
    "event: snapshot",
    `data: ${JSON.stringify(snapshot)}`,
    "",
    ""
  ].join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Utility — Percentile Computation
// ─────────────────────────────────────────────────────────────────────────────

function computePercentile(sorted: number[], p: number): number | null {
  if (sorted.length === 0) return null;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}
