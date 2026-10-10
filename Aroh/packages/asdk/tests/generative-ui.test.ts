import { describe, it, expect } from "vitest";
import {
  GenerativeUIWidgetTypeSchema,
  GenerativeUIBlockSchema,
  AIServerStreamEventSchema,
  createGenerativeUIBlock,
  formatSSEEvent,
  parseSSEEvent,
  MobileRouteSchema
} from "../src";

describe("Generative UI (Server-Driven UI) Specification Suite", () => {
  describe("Widget Type Schema", () => {
    it("accepts all 6 canonical widget types", () => {
      const types = [
        "aros_transfer_preview",
        "telemetry_visualizer",
        "product_launchpad",
        "enterprise_quota_card",
        "announcement_card",
        "statutory_consent_gate"
      ];

      for (const t of types) {
        expect(GenerativeUIWidgetTypeSchema.parse(t)).toBe(t);
      }
    });

    it("rejects unknown widget types", () => {
      expect(() => GenerativeUIWidgetTypeSchema.parse("invalid_widget_type")).toThrow();
    });
  });

  describe("createGenerativeUIBlock Factory", () => {
    it("creates a valid block with auto-generated ID and timestamp", () => {
      const block = createGenerativeUIBlock(
        "aros_transfer_preview",
        "Transfer Attestation",
        { amount: 100, recipient: "usr_alice", fee: 0 }
      );

      expect(block.id).toContain("genui-aros_transfer_preview-");
      expect(block.widgetType).toBe("aros_transfer_preview");
      expect(block.title).toBe("Transfer Attestation");
      expect(block.payload.amount).toBe(100);
      expect(typeof block.timestamp).toBe("number");
    });

    it("respects custom options and action definitions", () => {
      const block = createGenerativeUIBlock(
        "telemetry_visualizer",
        "Throughput Metrics",
        { throughput: 42.5, p99: 18.2 },
        {
          id: "custom-telemetry-id",
          subtitle: "Live Ring Buffer",
          action: {
            required: true,
            label: "Refresh Stream",
            endpoint: "/api/telemetry/stream",
            method: "GET"
          }
        }
      );

      expect(block.id).toBe("custom-telemetry-id");
      expect(block.subtitle).toBe("Live Ring Buffer");
      expect(block.action?.required).toBe(true);
      expect(block.action?.endpoint).toBe("/api/telemetry/stream");
    });
  });

  describe("SSE Wire Format & Streaming Events", () => {
    it("serializes and parses text_delta events", () => {
      const event = { type: "text_delta" as const, text: "Hello AROH developer!" };
      const wire = formatSSEEvent(event);
      expect(wire).toBe(`data: ${JSON.stringify(event)}\n\n`);

      const parsed = parseSSEEvent(wire);
      expect(parsed).toEqual(event);
    });

    it("serializes and parses ui_block events", () => {
      const block = createGenerativeUIBlock(
        "product_launchpad",
        "OmniStream Flagship",
        { tier: "core", status: "STAR_PRODUCT" }
      );
      const event = { type: "ui_block" as const, block };
      const wire = formatSSEEvent(event);

      const parsed = parseSSEEvent(wire);
      expect(parsed?.type).toBe("ui_block");
      if (parsed?.type === "ui_block") {
        expect(parsed.block.title).toBe("OmniStream Flagship");
        expect(parsed.block.widgetType).toBe("product_launchpad");
      }
    });

    it("returns null for non-data lines", () => {
      expect(parseSSEEvent(": heartbeat ping")).toBeNull();
      expect(parseSSEEvent("invalid stream line")).toBeNull();
    });
  });

  describe("Mobile Deep Link Route Extension", () => {
    it("validates that MobileRouteSchema includes announcements and organization", () => {
      expect(MobileRouteSchema.parse("announcements")).toBe("announcements");
      expect(MobileRouteSchema.parse("organization")).toBe("organization");
    });
  });
});
