import React, { useState, useEffect } from "react";
import { parseArohDeepLink } from "@aroh/asdk";
import type { MobileTab } from "./types";
import { ExploreScreen } from "./screens/ExploreScreen";
import { WalletScreen } from "./screens/WalletScreen";
import { AIPortalScreen } from "./screens/AIPortalScreen";
import { KeysScreen } from "./screens/KeysScreen";
import { PrivacyScreen } from "./screens/PrivacyScreen";

export interface MobileAppProps {
  initialUrl?: string;
}

export const MobileApp: React.FC<MobileAppProps> = ({ initialUrl }) => {
  const [activeTab, setActiveTab] = useState<MobileTab>("explore");
  const [activeParams, setActiveParams] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialUrl) {
      handleDeepLink(initialUrl);
    }
  }, [initialUrl]);

  const handleDeepLink = (url: string) => {
    const parsed = parseArohDeepLink(url);
    if (!parsed.isValid) return;

    switch (parsed.route) {
      case "wallet":
      case "receipt":
        setActiveTab("wallet");
        break;
      case "ai_portal":
        setActiveTab("ai");
        break;
      case "developer_keys":
        setActiveTab("keys");
        break;
      case "privacy":
        setActiveTab("privacy");
        break;
      case "product_detail":
      case "explore":
      default:
        setActiveTab("explore");
        break;
    }
    setActiveParams(parsed.params);
  };

  const navigateTo = (tab: MobileTab, params?: Record<string, string>) => {
    setActiveTab(tab);
    if (params) {
      setActiveParams(params);
    }
  };

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        minHeight: "100vh",
        backgroundColor: "#09090b",
        color: "#f4f4f5",
        fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderLeft: "1px solid #27272a",
        borderRight: "1px solid #27272a"
      }}
    >
      {/* Top Mobile Status / Brand Bar */}
      <header
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #27272a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#09090b"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "6px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
              fontSize: "12px",
              color: "#fff"
            }}
          >
            A
          </div>
          <span style={{ fontWeight: "700", fontSize: "16px", letterSpacing: "-0.02em" }}>
            AROH
          </span>
        </div>
        <span
          style={{
            fontSize: "10px",
            padding: "2px 6px",
            borderRadius: "4px",
            backgroundColor: "#27272a",
            color: "#a1a1aa",
            fontWeight: "600"
          }}
        >
          v2.04.00.0
        </span>
      </header>

      {/* Screen Viewport */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "explore" && <ExploreScreen onNavigate={navigateTo} activeParams={activeParams} />}
        {activeTab === "wallet" && <WalletScreen onNavigate={navigateTo} activeParams={activeParams} />}
        {activeTab === "ai" && <AIPortalScreen onNavigate={navigateTo} activeParams={activeParams} />}
        {activeTab === "keys" && <KeysScreen onNavigate={navigateTo} activeParams={activeParams} />}
        {activeTab === "privacy" && <PrivacyScreen onNavigate={navigateTo} activeParams={activeParams} />}
      </main>

      {/* Bottom Mobile Tab Navigation */}
      <nav
        style={{
          display: "flex",
          borderTop: "1px solid #27272a",
          backgroundColor: "#09090b",
          padding: "8px 0"
        }}
      >
        {(
          [
            { id: "explore", label: "Explore" },
            { id: "wallet", label: "Wallet" },
            { id: "ai", label: "AI Hub" },
            { id: "keys", label: "Dev Keys" },
            { id: "privacy", label: "Privacy" }
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 0",
                color: isActive ? "#3b82f6" : "#71717a"
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: isActive ? "600" : "400" }}>
                {tab.label}
              </span>
              {isActive && (
                <div
                  style={{
                    width: "12px",
                    height: "2px",
                    borderRadius: "999px",
                    backgroundColor: "#3b82f6"
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileApp;
