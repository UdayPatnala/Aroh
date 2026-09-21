import React from "react";
import type { MobileScreenProps } from "../types";

export const KeysScreen: React.FC<MobileScreenProps> = () => {
  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <header>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "#fff" }}>
          Developer API Vault
        </h1>
        <p style={{ fontSize: "13px", color: "#a1a1aa", margin: "4px 0 0 0" }}>
          Cryptographic keys & telemetry observability
        </p>
      </header>

      {/* API Key Status */}
      <div
        style={{
          backgroundColor: "#18181b",
          border: "1px solid #27272a",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#f4f4f5" }}>
            Production Client Key
          </span>
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "999px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "#34d399",
              border: "1px solid rgba(16, 185, 129, 0.3)"
            }}
          >
            ACTIVE
          </span>
        </div>

        <div
          style={{
            fontFamily: "monospace",
            backgroundColor: "#09090b",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #27272a",
            color: "#a1a1aa",
            fontSize: "12px"
          }}
        >
          aroh_live_mob_••••••••••••39a1
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#71717a" }}>
          <span>Rate Limit: 1,000 req/min</span>
          <span>Tier: Enterprise</span>
        </div>
      </div>

      {/* Telemetry Indicator */}
      <div
        style={{
          backgroundColor: "#18181b",
          border: "1px solid #27272a",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#f4f4f5" }}>
          Observability & Tracing
        </span>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
          W3C Trace Context headers (<code>traceparent</code>) are automatically generated for all cross-platform network dispatches.
        </p>
      </div>
    </div>
  );
};
