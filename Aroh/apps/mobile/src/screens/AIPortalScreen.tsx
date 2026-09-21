import React, { useState } from "react";
import type { MobileScreenProps } from "../types";

export const AIPortalScreen: React.FC<MobileScreenProps> = () => {
  const [provider, setProvider] = useState<"gemini" | "claude" | "openai">("gemini");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setResponse(
        `[AROH Mobile AI Hub (${provider.toUpperCase()})]: Received instruction "${prompt}". Response synthesized successfully.`
      );
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <header>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "#fff" }}>
          AI Orchestration
        </h1>
        <p style={{ fontSize: "13px", color: "#a1a1aa", margin: "4px 0 0 0" }}>
          Multi-provider AI inference router
        </p>
      </header>

      {/* Provider Selector */}
      <div style={{ display: "flex", gap: "8px" }}>
        {(["gemini", "claude", "openai"] as const).map((p) => (
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
          onClick={handleSend}
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
    </div>
  );
};
