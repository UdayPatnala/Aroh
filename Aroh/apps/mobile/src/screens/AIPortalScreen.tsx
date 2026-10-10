import React, { useState } from "react";
import type { MobileScreenProps } from "../types";
import {
  GenerativeUIBlock,
  createGenerativeUIBlock,
  generativeUIActionDispatcher
} from "@aroh/asdk";

export const AIPortalScreen: React.FC<MobileScreenProps> = ({ onNavigate }) => {
  const [provider, setProvider] = useState<"gemini" | "claude" | "openai" | "mock">("gemini");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [uiBlocks, setUiBlocks] = useState<GenerativeUIBlock[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionNotice, setActionNotice] = useState<{
    text: string;
    receiptId?: string;
    status: string;
  } | null>(null);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || prompt).trim();
    if (!text) return;
    setIsProcessing(true);
    setActionNotice(null);

    const lower = text.toLowerCase();
    const blocks: GenerativeUIBlock[] = [];

    if (lower.includes("transfer") || lower.includes("pay") || lower.includes("send aros")) {
      blocks.push(
        createGenerativeUIBlock(
          "aros_transfer_preview",
          "Aros Token Transfer Attestation",
          {
            amount: 150,
            recipient: "usr_developer_pro_42",
            fee: 0,
            currency: "Aros",
            note: "Authorized by mobile biometric key attestation"
          },
          {
            subtitle: "Read-Only Pre-Commit Ledger Attestation",
            action: {
              required: true,
              label: "Authorize Transfer",
              endpoint: "/api/payment/checkout",
              method: "POST",
              payload: { amount: 150, recipient: "usr_developer_pro_42" }
            }
          }
        )
      );
    } else if (lower.includes("telemetry") || lower.includes("metric") || lower.includes("health")) {
      blocks.push(
        createGenerativeUIBlock(
          "telemetry_visualizer",
          "Mobile Telemetry Diagnostics",
          {
            throughputOps: "142",
            p99LatencyMs: "18.4",
            activeSpokes: "4",
            bufferCapacity: "500",
            status: "NOMINAL"
          },
          {
            subtitle: "W3C Distributed Tracing Buffer"
          }
        )
      );
    } else if (lower.includes("spedex") || lower.includes("launchpad") || lower.includes("product")) {
      blocks.push(
        createGenerativeUIBlock(
          "product_launchpad",
          "SpeDex Protocol",
          {
            productId: "spedex",
            status: "Future Launch",
            governanceConstraint: "Decentralized high-frequency order matching engine. Future launch milestone pending release governance."
          },
          {
            subtitle: "Spoke Invariant: 0 Active Purchase CTAs"
          }
        )
      );
    } else if (lower.includes("roadmap") || lower.includes("announcement")) {
      blocks.push(
        createGenerativeUIBlock(
          "announcement_card",
          "Google Play Points for Aros — Future Architecture",
          {
            announcementId: "ann-play-points-01",
            status: "FUTURE",
            officialFeedbackChannel: "https://www.instagram.com/aroh.0s/"
          },
          {
            subtitle: "Exploration Only — No Live Conversion"
          }
        )
      );
    }

    setTimeout(() => {
      setResponse(
        `[AROH Mobile AI Hub (${provider.toUpperCase()})]: Inference complete for instruction "${text}". Server-Driven UI card stream synthesized.`
      );
      setUiBlocks(blocks);
      setIsProcessing(false);
    }, 400);
  };

  const handleExecuteBlockAction = (block: GenerativeUIBlock) => {
    if (block.widgetType === "aros_transfer_preview") {
      const result = generativeUIActionDispatcher.executeAction({
        actionId: `act-mobile-${Date.now()}`,
        widgetType: "aros_transfer_preview",
        userId: "usr_mobile_active_session",
        actionType: "execute_aros_transfer",
        idempotencyKey: `idem_mobile_${block.id}_${Date.now()}`,
        affirmativeAttestation: {
          purchaserIs18Attested: true,
          termsVersion: "1.0.0",
          policyVersion: "2.05.04.0"
        },
        payload: block.payload
      });

      if (result.success) {
        setActionNotice({
          text: `Settlement confirmed: Transferred ${block.payload.amount} ${block.payload.currency}.`,
          receiptId: result.receiptId,
          status: "SETTLED"
        });
      } else {
        setActionNotice({
          text: result.message,
          status: "REJECTED"
        });
      }
    } else if (block.widgetType === "product_launchpad") {
      onNavigate("explore");
    } else if (block.widgetType === "announcement_card") {
      onNavigate("announcements");
    } else {
      setActionNotice({
        text: `Action verified for ${block.title}.`,
        status: "CONFIRMED"
      });
    }
  };

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <header>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "#fff" }}>
          AI Orchestration
        </h1>
        <p style={{ fontSize: "13px", color: "#a1a1aa", margin: "4px 0 0 0" }}>
          Multi-provider AI inference router & Server-Driven UI (SDUI)
        </p>
      </header>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div
          style={{
            backgroundColor: actionNotice.status === "REJECTED" ? "#450a0a" : "#064e3b",
            border: `1px solid ${actionNotice.status === "REJECTED" ? "#b91c1c" : "#059669"}`,
            borderRadius: "10px",
            padding: "12px",
            color: "#ecfdf5",
            fontSize: "12px"
          }}
        >
          <div style={{ fontWeight: "600", marginBottom: "4px" }}>
            {actionNotice.text}
          </div>
          {actionNotice.receiptId && (
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#6ee7b7" }}>
              Receipt ID: {actionNotice.receiptId}
            </div>
          )}
        </div>
      )}

      {/* Provider Selector */}
      <div style={{ display: "flex", gap: "8px" }}>
        {(["gemini", "claude", "openai", "mock"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setProvider(p)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: "8px",
              backgroundColor: provider === p ? "#2563eb" : "#18181b",
              color: provider === p ? "#fff" : "#a1a1aa",
              border: `1px solid ${provider === p ? "#3b82f6" : "#27272a"}`,
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              textTransform: "capitalize"
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Quick Prompts */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {[
          { label: "💳 Transfer Preview", text: "Show transfer preview for 150 Aros" },
          { label: "📈 Telemetry", text: "Inspect mobile telemetry diagnostics" },
          { label: "🚀 SpeDex Protocol", text: "Check status of SpeDex protocol" },
          { label: "📢 Roadmap", text: "Show future roadmap announcements" }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(item.text);
              handleSend(item.text);
            }}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              backgroundColor: "#27272a",
              color: "#e4e4e7",
              border: "1px solid #3f3f46",
              fontSize: "11px",
              cursor: "pointer"
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Prompt Input */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AROH AI anything across your ecosystem..."
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "10px",
            padding: "12px",
            color: "#f4f4f5",
            fontSize: "13px",
            resize: "none",
            outline: "none"
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isProcessing || !prompt.trim()}
          style={{
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: isProcessing ? "#4b5563" : "#2563eb",
            color: "#fff",
            border: "none",
            fontWeight: "600",
            fontSize: "13px",
            cursor: isProcessing ? "not-allowed" : "pointer"
          }}
        >
          {isProcessing ? "Synthesizing..." : "Submit Prompt"}
        </button>
      </div>

      {/* Response Display */}
      {response && (
        <div
          style={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "10px",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }}
        >
          <span style={{ fontSize: "11px", color: "#60a5fa", fontWeight: "600", textTransform: "uppercase" }}>
            Model Output
          </span>
          <p style={{ margin: 0, fontSize: "13px", color: "#e4e4e7", lineHeight: "1.5" }}>
            {response}
          </p>
        </div>
      )}

      {/* Generative UI Cards */}
      {uiBlocks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase" }}>
            Server-Driven UI Blocks ({uiBlocks.length})
          </span>

          {uiBlocks.map((block) => (
            <div
              key={block.id}
              style={{
                backgroundColor: "#18181b",
                border: "1px solid #3b82f6",
                borderRadius: "12px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div>
                <div style={{ fontWeight: "600", color: "#fff", fontSize: "14px" }}>
                  {block.title}
                </div>
                {block.subtitle && (
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                    {block.subtitle}
                  </div>
                )}
              </div>

              {/* Block Body */}
              {block.widgetType === "aros_transfer_preview" && (
                <div style={{ backgroundColor: "#27272a", padding: "10px", borderRadius: "8px", fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#e4e4e7" }}>
                    <span>Recipient:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: "600" }}>{String(block.payload.recipient)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#34d399", marginTop: "4px" }}>
                    <span>Amount:</span>
                    <span style={{ fontWeight: "700" }}>{String(block.payload.amount)} {String(block.payload.currency)}</span>
                  </div>
                </div>
              )}

              {block.widgetType === "telemetry_visualizer" && (
                <div style={{ display: "flex", gap: "8px", textAlign: "center" }}>
                  <div style={{ flex: 1, backgroundColor: "#27272a", padding: "8px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "10px", color: "#a1a1aa" }}>Throughput</div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>{String(block.payload.throughputOps)} ops/s</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: "#27272a", padding: "8px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "10px", color: "#a1a1aa" }}>P99 Latency</div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#34d399" }}>{String(block.payload.p99LatencyMs)} ms</div>
                  </div>
                </div>
              )}

              {block.widgetType === "product_launchpad" && (
                <div style={{ backgroundColor: "#27272a", padding: "10px", borderRadius: "8px", fontSize: "12px", color: "#d1d5db" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <strong style={{ color: "#fff" }}>SpeDex</strong>
                    <span style={{ color: "#fbbf24", fontWeight: "600" }}>Future Launch</span>
                  </div>
                  <div>{String(block.payload.governanceConstraint)}</div>
                </div>
              )}

              {block.widgetType === "announcement_card" && (
                <div style={{ backgroundColor: "#27272a", padding: "10px", borderRadius: "8px", fontSize: "12px", color: "#d1d5db" }}>
                  <div>Status: <span style={{ color: "#60a5fa" }}>{String(block.payload.status)}</span></div>
                  <div style={{ marginTop: "4px", fontSize: "11px", color: "#9ca3af" }}>
                    Community Feedback: instagram.com/aroh.0s
                  </div>
                </div>
              )}

              {/* Action Button */}
              {block.action && (
                <button
                  onClick={() => handleExecuteBlockAction(block)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    alignSelf: "flex-end"
                  }}
                >
                  {block.action.label || "Confirm"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
