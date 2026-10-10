import React from "react";
import { resolveShowcaseHierarchy } from "@aroh/asdk";
import type { MobileScreenProps } from "../types";

export const ExploreScreen: React.FC<MobileScreenProps> = ({ onNavigate }) => {
  const { orderedProducts } = resolveShowcaseHierarchy();

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <header>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "#fff" }}>
          AROH Ecosystem
        </h1>
        <p style={{ fontSize: "13px", color: "#a1a1aa", margin: "4px 0 0 0" }}>
          Autonomous flagship applications & decentralized services
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {orderedProducts.map((product) => {
          const isFutureLaunch = product.status === "FUTURE_LAUNCH" || product.id === "spedex";

          return (
            <div
              key={product.id}
              style={{
                backgroundColor: "#18181b",
                border: isFutureLaunch ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid #27272a",
                borderRadius: "12px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "#f4f4f5", fontSize: "15px" }}>
                  {product.name}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    backgroundColor: isFutureLaunch
                      ? "rgba(245, 158, 11, 0.15)"
                      : "rgba(59, 130, 246, 0.15)",
                    color: isFutureLaunch ? "#fbbf24" : "#60a5fa",
                    border: isFutureLaunch
                      ? "1px solid rgba(245, 158, 11, 0.3)"
                      : "1px solid rgba(59, 130, 246, 0.3)"
                  }}
                >
                  {isFutureLaunch ? "FUTURE LAUNCH" : product.tier.toUpperCase()}
                </span>
              </div>

              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: "1.4" }}>
                {product.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "11px", color: "#71717a" }}>
                  {product.capabilities.length} capabilities
                </span>

                {isFutureLaunch ? (
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                      color: "#fbbf24",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                      fontWeight: "500"
                    }}
                  >
                    Coming Soon
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate("wallet", { ref: product.id })}
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    Open Spoke
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
