import { describe, it, expect } from "vitest";
import {
  generateTraceId,
  generateSpanId,
  isValidTraceparent,
  parseTraceparent,
  formatTraceparent,
  extractOrCreateTraceContext
} from "../src";

describe("W3C Distributed Tracing — @aroh/asdk Suite", () => {
  describe("Identifier Generators", () => {
    it("generates 32-character hex trace ID with non-zero entropy", () => {
      const traceId = generateTraceId();
      expect(traceId).toHaveLength(32);
      expect(/^[0-9a-f]{32}$/.test(traceId)).toBe(true);
      expect(traceId).not.toBe("00000000000000000000000000000000");
    });

    it("generates 16-character hex span ID with non-zero entropy", () => {
      const spanId = generateSpanId();
      expect(spanId).toHaveLength(16);
      expect(/^[0-9a-f]{16}$/.test(spanId)).toBe(true);
      expect(spanId).not.toBe("0000000000000000");
    });
  });

  describe("W3C Header Validation", () => {
    it("validates compliant W3C traceparent headers", () => {
      const validHeader = "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01";
      expect(isValidTraceparent(validHeader)).toBe(true);
    });

    it("rejects non-standard version prefixes", () => {
      expect(
        isValidTraceparent("01-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01")
      ).toBe(false);
    });

    it("rejects all-zero trace IDs per W3C specification", () => {
      const allZerosTrace = "00-00000000000000000000000000000000-00f067aa0ba902b7-01";
      expect(isValidTraceparent(allZerosTrace)).toBe(false);
    });

    it("rejects all-zero parent/span IDs per W3C specification", () => {
      const allZerosSpan = "00-4bf92f3577b34da6a3ce929d0e0e4736-0000000000000000-01";
      expect(isValidTraceparent(allZerosSpan)).toBe(false);
    });

    it("rejects malformed, empty, or non-hex traceparent headers", () => {
      expect(isValidTraceparent("")).toBe(false);
      expect(isValidTraceparent(null)).toBe(false);
      expect(isValidTraceparent("invalid-trace")).toBe(false);
      expect(
        isValidTraceparent("00-4bf92f3577b34da6a3ce929d0e0e473g-00f067aa0ba902b7-01")
      ).toBe(false); // contains 'g'
    });
  });

  describe("Traceparent Parser & Formatter", () => {
    it("parses valid traceparent header into structured TraceContext components", () => {
      const header = "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01";
      const parsed = parseTraceparent(header);

      expect(parsed).not.toBeNull();
      expect(parsed?.version).toBe("00");
      expect(parsed?.traceId).toBe("4bf92f3577b34da6a3ce929d0e0e4736");
      expect(parsed?.parentId).toBe("00f067aa0ba902b7");
      expect(parsed?.traceFlags).toBe("01");
      expect(parsed?.raw).toBe(header);
    });

    it("formats trace components into authoritative W3C header string", () => {
      const formatted = formatTraceparent(
        "4bf92f3577b34da6a3ce929d0e0e4736",
        "00f067aa0ba902b7",
        "01",
        "00"
      );
      expect(formatted).toBe("00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01");
    });
  });

  describe("Ingress Propagation & Child Span Creation", () => {
    it("derives child span while preserving traceId and flags when valid header is supplied", () => {
      const incomingHeader =
        "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01";
      const childContext = extractOrCreateTraceContext(incomingHeader);

      expect(childContext.traceId).toBe("4bf92f3577b34da6a3ce929d0e0e4736"); // preserved
      expect(childContext.traceFlags).toBe("01"); // preserved
      expect(childContext.parentId).not.toBe("00f067aa0ba902b7"); // new child span
      expect(childContext.parentId).toHaveLength(16);
      expect(isValidTraceparent(childContext.raw)).toBe(true);
    });

    it("generates fresh root trace context when header is missing or malformed", () => {
      const fresh1 = extractOrCreateTraceContext(undefined);
      expect(isValidTraceparent(fresh1.raw)).toBe(true);
      expect(fresh1.traceFlags).toBe("01");

      const fresh2 = extractOrCreateTraceContext("corrupt-header");
      expect(isValidTraceparent(fresh2.raw)).toBe(true);
      expect(fresh2.traceId).not.toBe("corrupt-header");
    });
  });
});
