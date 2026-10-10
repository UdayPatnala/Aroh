"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@aroh/ads";
import ArohLogo from "../components/aroh-logo";
import { mockDocDatabase } from "./doc-database";
import type { GenerativeUIBlock, AIServerStreamEvent } from "@aroh/asdk";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  uiBlocks?: GenerativeUIBlock[];
  timestamp: number;
}

export default function AiPortalPage() {
  const [provider, setProvider] = React.useState<"mock" | "gemini" | "claude" | "openai" | "local_ollama">("mock");
  const [messages, setMessages] = React.useState<MessageItem[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: "Welcome to the AROH Developer AI Studio. This environment demonstrates Server-Driven UI (SDUI), multi-provider failover, and type-safe Generative UI block streaming. Ask me a question or try one of the interactive prompt triggers below.",
      timestamp: Date.now()
    }
  ]);
  const [inputPrompt, setInputPrompt] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [actionNotice, setActionNotice] = React.useState<{
    text: string;
    receiptId?: string;
    receiptHash?: string;
    status?: string;
  } | null>(null);

  // Documentation search preservation
  const [docSearchQuery, setDocSearchQuery] = React.useState("");
  const [showDocPanel, setShowDocPanel] = React.useState(false);

  const filteredDocs = React.useMemo(() => {
    if (!docSearchQuery.trim()) return mockDocDatabase;
    const q = docSearchQuery.toLowerCase();
    return mockDocDatabase.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.keyword.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q)
    );
  }, [docSearchQuery]);

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isStreaming) return;

    setInputPrompt("");
    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    const newMessages: MessageItem[] = [
      ...messages,
      {
        id: userMsgId,
        role: "user",
        content: text,
        timestamp: Date.now()
      },
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        uiBlocks: [],
        timestamp: Date.now()
      }
    ];

    setMessages(newMessages);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: text }
          ]
        })
      });

      if (!response.ok || !response.body) {
        throw new Error(`AI Gateway responded with HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.replace(/^data:\s*/, "");

          try {
            const event: AIServerStreamEvent = JSON.parse(jsonStr);

            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantMsgId) return m;

                if (event.type === "text_delta") {
                  return { ...m, content: m.content + event.text };
                } else if (event.type === "ui_block") {
                  const existing = m.uiBlocks || [];
                  return { ...m, uiBlocks: [...existing, event.block] };
                }
                return m;
              })
            );
          } catch {
            // Ignore partial SSE chunks
          }
        }
      }
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "Inference stream interrupted";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: m.content + `\n\n[Gateway Notice: ${errorText}]` }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleBlockAction = async (block: GenerativeUIBlock) => {
    try {
      if (block.widgetType === "aros_transfer_preview") {
        const res = await fetch("/api/ai/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionId: `act-transfer-${Date.now()}`,
            widgetType: "aros_transfer_preview",
            userId: "usr_developer_studio_active",
            actionType: "execute_aros_transfer",
            idempotencyKey: `idem_transfer_${block.id}_${Date.now()}`,
            affirmativeAttestation: {
              purchaserIs18Attested: true,
              termsVersion: "1.0.0",
              policyVersion: "2.05.04.0",
              timestamp: Date.now()
            },
            payload: block.payload
          })
        });
        const data = await res.json();
        if (data.success) {
          setActionNotice({
            text: data.message,
            receiptId: data.receiptId,
            receiptHash: data.receiptHash,
            status: data.status
          });
        } else {
          setActionNotice({
            text: `Action rejected: ${data.message || data.error}`,
            status: "REJECTED"
          });
        }
      } else if (block.widgetType === "statutory_consent_gate") {
        const res = await fetch("/api/ai/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionId: `act-consent-${Date.now()}`,
            widgetType: "statutory_consent_gate",
            userId: "usr_developer_studio_active",
            actionType: "confirm_consent",
            idempotencyKey: `idem_consent_${block.id}_${Date.now()}`,
            affirmativeAttestation: {
              purchaserIs18Attested: true,
              termsVersion: "1.0.0",
              policyVersion: "2.05.04.0",
              timestamp: Date.now()
            },
            payload: block.payload
          })
        });
        const data = await res.json();
        setActionNotice({
          text: data.message,
          receiptId: data.receiptId,
          receiptHash: data.receiptHash,
          status: data.status
        });
      } else if (block.widgetType === "telemetry_visualizer") {
        setActionNotice({
          text: "Live Telemetry Stream Connected: Ring buffer subscription active across registered spokes.",
          status: "CONNECTED"
        });
      } else {
        setActionNotice({
          text: `Action verified for ${block.title}.`,
          status: "PROCESSED"
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Action failed";
      setActionNotice({ text: `Gateway error: ${msg}`, status: "ERROR" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <ArohLogo />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Developer AI Studio
                </h1>
                <Badge variant="neutral" size="sm">
                  Domain 4
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Stateless AI prompt workspace, multi-provider failover, and streaming Generative UI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Provider:</span>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as typeof provider)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="mock">Mock AI Orchestrator (Deterministic)</option>
              <option value="gemini">Google Gemini Pro</option>
              <option value="claude">Anthropic Claude 3.5</option>
              <option value="openai">OpenAI GPT-4o</option>
              <option value="local_ollama">Local Ollama Runtime</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDocPanel(!showDocPanel)}
            >
              {showDocPanel ? "Hide Docs" : "Ecosystem Docs"}
            </Button>
          </div>
        </header>

        {/* Global Action Notification Banner */}
        <AnimatePresence>
          {actionNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border text-xs font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${
                actionNotice.status === "REJECTED" || actionNotice.status === "ERROR"
                  ? "bg-rose-50 border-rose-200 text-rose-800"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      actionNotice.status === "REJECTED" ? "bg-rose-500" : "bg-emerald-500 animate-pulse"
                    }`}
                  />
                  <span>{actionNotice.text}</span>
                </div>
                {actionNotice.receiptId && (
                  <div className="text-[11px] font-mono text-emerald-900 flex flex-wrap gap-x-4 gap-y-0.5">
                    <span>
                      Receipt ID: <strong>{actionNotice.receiptId}</strong>
                    </span>
                    {actionNotice.receiptHash && (
                      <span className="truncate max-w-xs text-emerald-700">
                        SHA-256: {actionNotice.receiptHash.slice(0, 16)}...
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => setActionNotice(null)}
                className="text-slate-600 hover:text-slate-900 font-bold self-end sm:self-center"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Searchable Documentation Drawer (Preserved from original ai/page.tsx) */}
        {showDocPanel && (
          <Card variant="glass" className="p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ecosystem Reference Index
              </span>
              <span className="text-xs text-slate-400">{filteredDocs.length} entries</span>
            </div>
            <input
              type="text"
              value={docSearchQuery}
              onChange={(e) => setDocSearchQuery(e.target.value)}
              placeholder="Filter topics (e.g. wallet, membership, sso)..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white/90 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto pt-1">
              {filteredDocs.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-white/60 text-xs">
                  <div className="font-semibold text-slate-800 mb-0.5">{doc.title}</div>
                  <div className="text-slate-500 text-[11px] line-clamp-2">{doc.content}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick SDUI Starters */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Quick Generative UI Triggers:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "💳 Aros Transfer Preview", prompt: "Show transfer preview for 150 Aros to usr_developer_pro_42" },
              { label: "📈 Live Telemetry Sparkline", prompt: "Inspect real-time telemetry metrics and buffer capacity" },
              { label: "🚀 SpeDex Launchpad Card", prompt: "Check status of SpeDex in the canonical product registry" },
              { label: "🏢 Enterprise Team Quota", prompt: "Show enterprise quota status for org_alpha_group" },
              { label: "🗺️ Ecosystem Roadmap", prompt: "What are the upcoming roadmap announcements and developments?" },
              { label: "🛡️ DPDP Consent Gate", prompt: "Review affirmative DPDP privacy consent requirements" }
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => handleSendPrompt(btn.prompt)}
                disabled={isStreaming}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-sm disabled:opacity-50"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Conversation Stream */}
        <div className="space-y-4 min-h-[380px]">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className="text-[11px] text-slate-400 font-mono mb-1 px-1">
                {msg.role === "user" ? "You" : "AROH AI Studio"}
              </div>

              {/* Text Bubble */}
              {msg.content && (
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed max-w-2xl ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              )}

              {/* Generative UI Blocks Container */}
              {msg.uiBlocks && msg.uiBlocks.length > 0 && (
                <div className="w-full max-w-2xl mt-3 space-y-3">
                  {msg.uiBlocks.map((block) => (
                    <Card
                      key={block.id}
                      variant={block.widgetType === "aros_transfer_preview" ? "elevated" : "default"}
                      className="border-slate-200 overflow-hidden"
                    >
                      <CardHeader className="bg-slate-50/60 border-b border-slate-100 pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                block.widgetType === "aros_transfer_preview"
                                  ? "bg-emerald-500"
                                  : block.widgetType === "telemetry_visualizer"
                                  ? "bg-sky-500"
                                  : "bg-purple-500"
                              }`}
                            />
                            <CardTitle className="text-sm font-semibold">{block.title}</CardTitle>
                          </div>
                          <Badge
                            variant={block.widgetType === "aros_transfer_preview" ? "success" : "info"}
                            size="sm"
                          >
                            {block.widgetType.replace(/_/g, " ").toUpperCase()}
                          </Badge>
                        </div>
                        {block.subtitle && (
                          <CardDescription className="text-xs text-slate-500 mt-0.5">
                            {block.subtitle}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent className="pt-4 space-y-3">
                        {/* WIDGET 1: Aros Transfer Preview */}
                        {block.widgetType === "aros_transfer_preview" && (
                          <div className="space-y-3">
                            <div className="flex items-baseline justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <div>
                                <span className="text-xs text-slate-500 block">Recipient</span>
                                <span className="text-sm font-semibold font-mono text-slate-800">
                                  {String(block.payload.recipient || "")}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-slate-500 block">Transfer Value</span>
                                <span className="text-lg font-bold text-emerald-600 font-mono">
                                  {String(block.payload.amount || "")} {String(block.payload.currency || "Aros")}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-normal">
                              {String(block.payload.note || "")}
                            </p>
                          </div>
                        )}

                        {/* WIDGET 2: Telemetry Visualizer */}
                        {block.widgetType === "telemetry_visualizer" && (
                          <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div>
                              <div className="text-[11px] text-slate-500">Throughput</div>
                              <div className="text-sm font-bold font-mono text-slate-800">
                                {String(block.payload.throughputOps || "0")} ops/s
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] text-slate-500">P99 Latency</div>
                              <div className="text-sm font-bold font-mono text-emerald-600">
                                {String(block.payload.p99LatencyMs || "0")} ms
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] text-slate-500">Active Spokes</div>
                              <div className="text-sm font-bold font-mono text-slate-800">
                                {String(block.payload.activeSpokes || "0")}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* WIDGET 3: Product Launchpad */}
                        {block.widgetType === "product_launchpad" && (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-800 text-sm">
                                SpeDex Protocol
                              </span>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                                Future Launch
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">
                              {String(block.payload.governanceConstraint || "")}
                            </p>
                          </div>
                        )}

                        {/* WIDGET 4: Enterprise Quota */}
                        {block.widgetType === "enterprise_quota_card" && (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Org Monthly Spend</span>
                              <span className="font-semibold text-slate-800 font-mono">
                                {String(block.payload.usedAros)} / {String(block.payload.monthlyQuotaAros)} Aros
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-sky-600 h-full rounded-full w-[28%]" />
                            </div>
                          </div>
                        )}

                        {/* WIDGET 5: Announcement Card */}
                        {block.widgetType === "announcement_card" && (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                            <div className="font-semibold text-slate-800">
                              {String(block.payload.title || "")}
                            </div>
                            <div className="text-slate-500">
                              Status: <span className="font-mono text-sky-700">{String(block.payload.status || "")}</span>
                            </div>
                            <a
                              href={String(block.payload.officialFeedbackChannel || "https://www.instagram.com/aroh.0s/")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-600 hover:underline font-medium inline-block mt-1"
                            >
                              Official Instagram Channel →
                            </a>
                          </div>
                        )}

                        {/* WIDGET 6: Statutory Consent Gate */}
                        {block.widgetType === "statutory_consent_gate" && (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                            <div className="font-semibold text-slate-800">
                              Purpose: {String(block.payload.purpose || "")}
                            </div>
                            <p className="text-slate-500">
                              Unbundled affirmative consent under Section 6 of DPDP Act 2023. Notice Version: {String(block.payload.noticeVersion || "")}.
                            </p>
                          </div>
                        )}
                      </CardContent>

                      {block.action && (
                        <CardFooter className="bg-slate-50/40 border-t border-slate-100 justify-end pt-3">
                          <Button
                            variant={block.widgetType === "aros_transfer_preview" ? "primary" : "secondary"}
                            size="sm"
                            onClick={() => handleBlockAction(block)}
                          >
                            {block.action.label || "Confirm Action"}
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt();
          }}
          className="sticky bottom-6 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-300 shadow-lg flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isStreaming}
            placeholder={
              isStreaming
                ? "AI streaming in progress..."
                : "Ask Developer AI Studio or trigger an SDUI block..."
            }
            className="flex-1 text-sm px-4 py-2 bg-transparent text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isStreaming}
            disabled={!inputPrompt.trim() || isStreaming}
          >
            Send Prompt
          </Button>
        </form>

      </div>
    </div>
  );
}
