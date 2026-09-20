export interface TraceContext {
  version: string;
  traceId: string;
  parentId: string;
  traceFlags: string;
  raw: string;
}

const W3C_REGEX = /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/i;
const ALL_ZEROS_TRACE = "00000000000000000000000000000000";
const ALL_ZEROS_SPAN = "0000000000000000";

function getRandomHex(byteLength: number): string {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(byteLength);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  let s = "";
  for (let i = 0; i < byteLength; i++) {
    s += Math.floor(Math.random() * 256).toString(16).padStart(2, "0");
  }
  return s;
}

export function generateTraceId(): string {
  let traceId = getRandomHex(16);
  while (traceId === ALL_ZEROS_TRACE) {
    traceId = getRandomHex(16);
  }
  return traceId;
}

export function generateSpanId(): string {
  let spanId = getRandomHex(8);
  while (spanId === ALL_ZEROS_SPAN) {
    spanId = getRandomHex(8);
  }
  return spanId;
}

export function isValidTraceparent(header?: string | null): boolean {
  if (!header || typeof header !== "string") return false;
  const trimmed = header.trim().toLowerCase();
  const match = trimmed.match(W3C_REGEX);
  if (!match) return false;

  const [, version, traceId, parentId] = match;
  if (version !== "00") return false;
  if (traceId === ALL_ZEROS_TRACE || parentId === ALL_ZEROS_SPAN) return false;

  return true;
}

export function parseTraceparent(header?: string | null): TraceContext | null {
  if (!isValidTraceparent(header)) return null;

  const trimmed = header!.trim().toLowerCase();
  const parts = trimmed.split("-");
  return {
    version: parts[0],
    traceId: parts[1],
    parentId: parts[2],
    traceFlags: parts[3],
    raw: trimmed
  };
}

export function formatTraceparent(
  traceId: string,
  parentId: string,
  traceFlags: string = "01",
  version: string = "00"
): string {
  return `${version}-${traceId}-${parentId}-${traceFlags}`;
}

export function extractOrCreateTraceContext(header?: string | null): TraceContext {
  const parsed = parseTraceparent(header);

  if (parsed) {
    // Generate a new child span while preserving the incoming traceId and flags
    const childSpanId = generateSpanId();
    const raw = formatTraceparent(parsed.traceId, childSpanId, parsed.traceFlags, parsed.version);
    return {
      version: parsed.version,
      traceId: parsed.traceId,
      parentId: childSpanId,
      traceFlags: parsed.traceFlags,
      raw
    };
  }

  // Create brand-new root trace context
  const traceId = generateTraceId();
  const parentId = generateSpanId();
  const traceFlags = "01";
  const version = "00";
  const raw = formatTraceparent(traceId, parentId, traceFlags, version);

  return {
    version,
    traceId,
    parentId,
    traceFlags,
    raw
  };
}
