/**
 * Telemetry Broker — Automated Vitest Test Suite
 * Wave 2 Milestone 3.5 (WAVE-02-TASK-05)
 *
 * 14 assertions covering:
 *   - Event emission & ring buffer integrity
 *   - SSE frame formatting
 *   - Aggregate metric computation (p50/p95, journey counts)
 *   - PII boundary validation (no wallet balances, no raw userId)
 *   - Edge/Node compatible event ID generation
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  emitTelemetryEvent,
  emitHeartbeat,
  getAllTelemetryEvents,
  getRecentTelemetryEvents,
  getTelemetrySnapshot,
  clearTelemetryBuffer,
  formatSSEFrame,
  formatSnapshotSSEFrame,
  type TelemetryEvent,
  type TelemetryMetricsSnapshot
} from "../src/telemetry/index";

describe("Real-Time Operational Telemetry Broker — @aroh/asdk Suite", () => {

  // ── Always start each suite with a clean buffer ──────────────────────────
  beforeEach(() => {
    clearTelemetryBuffer();
  });

  // ── 1. Event Emission ──────────────────────────────────────────────────────
  describe("Event Emission", () => {
    it("emits a settlement.completed event with correct structure", () => {
      const event = emitTelemetryEvent(
        "settlement.completed",
        { note: "pkg_500 settled" }
      );

      expect(event.type).toBe("settlement.completed");
      expect(event.id).toHaveLength(32);
      expect(/^[0-9a-f]{32}$/.test(event.id)).toBe(true);
      expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(event.payload.note).toBe("pkg_500 settled");
    });

    it("emits a settlement.latency event with numeric latencyMs payload", () => {
      const event = emitTelemetryEvent(
        "settlement.latency",
        { latencyMs: 342 }
      );
      expect(event.type).toBe("settlement.latency");
      expect(event.payload.latencyMs).toBe(342);
    });

    it("emits a heartbeat event via emitHeartbeat()", () => {
      const hb = emitHeartbeat("00-aabbccddeeff00112233445566778899-0011223344556677-01");
      expect(hb.type).toBe("heartbeat");
      expect(hb.payload.note).toBe("broker-liveness");
      expect(hb.traceparent).toBe("00-aabbccddeeff00112233445566778899-0011223344556677-01");
    });

    it("buffers multiple events and getAllTelemetryEvents() returns them in order", () => {
      emitTelemetryEvent("api_key.created", { apiKeyTier: "Pro" });
      emitTelemetryEvent("webhook.dispatched", { webhookEventType: "aros.credited" });
      emitTelemetryEvent("journey.started", { journeyPath: "/dashboard/purchase" });

      const all = getAllTelemetryEvents();
      expect(all).toHaveLength(3);
      expect(all[0].type).toBe("api_key.created");
      expect(all[1].type).toBe("webhook.dispatched");
      expect(all[2].type).toBe("journey.started");
    });
  });

  // ── 2. Ring Buffer & Recent Events ────────────────────────────────────────
  describe("Ring Buffer & Recent Events", () => {
    it("getRecentTelemetryEvents() returns events in descending (newest-first) order", () => {
      emitTelemetryEvent("journey.started", { journeyPath: "/ai" });
      emitTelemetryEvent("journey.completed", { journeyPath: "/ai" });
      emitTelemetryEvent("settlement.completed", { note: "done" });

      const recent = getRecentTelemetryEvents(2);
      expect(recent).toHaveLength(2);
      // Newest first
      expect(recent[0].type).toBe("settlement.completed");
      expect(recent[1].type).toBe("journey.completed");
    });

    it("clearTelemetryBuffer() drains all events from buffer", () => {
      emitTelemetryEvent("heartbeat", {});
      emitTelemetryEvent("heartbeat", {});
      clearTelemetryBuffer();
      expect(getAllTelemetryEvents()).toHaveLength(0);
    });
  });

  // ── 3. Aggregate Metric Snapshot ──────────────────────────────────────────
  describe("Aggregate Metric Computation", () => {
    it("getTelemetrySnapshot() computes correct settlement counts", () => {
      emitTelemetryEvent("settlement.completed", {});
      emitTelemetryEvent("settlement.completed", {});
      emitTelemetryEvent("webhook.dispatched", { webhookEventType: "aros.credited" });

      const snap = getTelemetrySnapshot();
      expect(snap.settlementCount).toBe(2);
      expect(snap.webhookSuccessCount).toBe(1);
      expect(snap.webhookFailureCount).toBe(0);
    });

    it("computes p50 and p95 settlement latencies correctly", () => {
      // Emit 4 latency events: [100, 200, 300, 400]
      [100, 200, 300, 400].forEach((ms) =>
        emitTelemetryEvent("settlement.latency", { latencyMs: ms })
      );
      const snap = getTelemetrySnapshot();
      // p50 of sorted [100,200,300,400] → index ceil(0.5*4)-1 = 1 → 200
      expect(snap.settlementLatencyP50Ms).toBe(200);
      // p95 of 4 items → index ceil(0.95*4)-1 = 3 → 400
      expect(snap.settlementLatencyP95Ms).toBe(400);
    });

    it("returns null for latency percentiles when no latency events are buffered", () => {
      emitTelemetryEvent("heartbeat", {});
      const snap = getTelemetrySnapshot();
      expect(snap.settlementLatencyP50Ms).toBeNull();
      expect(snap.settlementLatencyP95Ms).toBeNull();
    });

    it("correctly tracks active vs completed user journeys", () => {
      emitTelemetryEvent("journey.started", { journeyPath: "/dashboard/purchase" });
      emitTelemetryEvent("journey.started", { journeyPath: "/ai" });
      emitTelemetryEvent("journey.completed", { journeyPath: "/ai" });

      const snap = getTelemetrySnapshot();
      expect(snap.activeJourneys).toBe(1);    // 2 started - 1 completed
      expect(snap.completedJourneys).toBe(1);
    });

    it("snapshot.recentEvents contains at most 10 entries", () => {
      for (let i = 0; i < 15; i++) {
        emitTelemetryEvent("heartbeat", { note: `ping-${i}` });
      }
      const snap = getTelemetrySnapshot();
      expect(snap.recentEvents.length).toBeLessThanOrEqual(10);
    });
  });

  // ── 4. SSE Frame Formatting ────────────────────────────────────────────────
  describe("SSE Frame Formatting", () => {
    it("formatSSEFrame() emits correct SSE wire format with id/event/data fields", () => {
      const event: TelemetryEvent = {
        id: "abc123",
        timestamp: "2026-09-19T00:00:00.000Z",
        traceparent: "00-aabbccddeeff00112233445566778899-0011223344556677-01",
        type: "settlement.completed",
        payload: { note: "test" }
      };
      const frame = formatSSEFrame(event);
      expect(frame).toContain("id: abc123");
      expect(frame).toContain("event: settlement.completed");
      expect(frame).toContain("data: ");
      // Must terminate with double newline per SSE spec
      expect(frame.endsWith("\n\n")).toBe(true);
    });

    it("formatSnapshotSSEFrame() emits 'event: snapshot' frames with serialized snapshot", () => {
      emitTelemetryEvent("settlement.completed", {});
      const snap = getTelemetrySnapshot();
      const frame = formatSnapshotSSEFrame(snap);
      expect(frame).toContain("event: snapshot");
      expect(frame).toContain("settlementCount");
      expect(frame.endsWith("\n\n")).toBe(true);
    });
  });

  // ── 5. PII Boundary Enforcement ────────────────────────────────────────────
  describe("PII Boundary — No Sensitive Data in Events", () => {
    it("telemetry payload must not expose raw userId — only hashed prefix", () => {
      const event = emitTelemetryEvent("journey.started", {
        journeyPath: "/dashboard",
        userIdHash: "a1b2c3d4" // 8-char SHA-256 prefix — NOT the raw userId
      });
      // Confirm the payload does NOT contain recognisable raw user email/id forms
      const serialized = JSON.stringify(event);
      expect(serialized).not.toMatch(/@.*\./);   // no email address pattern
      expect(serialized).not.toContain("wallet"); // no wallet balance fields
      expect(event.payload.userIdHash).toHaveLength(8);
    });
  });
});
