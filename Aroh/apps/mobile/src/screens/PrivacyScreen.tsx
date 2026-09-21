import React, { useState } from "react";
import type { MobileScreenProps } from "../types";

export const PrivacyScreen: React.FC<MobileScreenProps> = () => {
  const [telemetryConsent, setTelemetryConsent] = useState(true);

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <header>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "#fff" }}>
          Privacy & DPDP Compliance
        </h1>
        <p style={{ fontSize: "13px", color: "#a1a1aa", margin: "4px 0 0 0" }}>
          Indian Digital Personal Data Protection Act 2023 & DPDP Rules 2025
        </p>
      </header>

      {/* Compliance Overview */}
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
            Statutory Data Rights
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
            COMPLIANT
          </span>
        </div>

        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: "1.4" }}>
          AROH processes personal data under affirmative unbundled consent. You may review, withdraw consent, or request data erasure at any time.
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
          <span style={{ fontSize: "13px", color: "#f4f4f5" }}>
            Performance & Telemetry Consent
          </span>
          <input
            type="checkbox"
            checked={telemetryConsent}
            onChange={(e) => setTelemetryConsent(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "#2563eb", cursor: "pointer" }}
          />
        </div>
      </div>

      {/* Grievance Redressal */}
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
          Data Protection Officer / Grievance Officer
        </span>
        <div style={{ fontSize: "12px", color: "#9ca3af" }}>
          Email: <span style={{ color: "#60a5fa" }}>grievance@aroh.io</span>
        </div>
        <div style={{ fontSize: "11px", color: "#71717a" }}>
          Turnaround SLA: 30 calendar days under DPDP Act 2023 Section 13.
        </div>
      </div>
    </div>
  );
};
