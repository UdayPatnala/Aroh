"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePlatformStore, mockWalletService } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import NotificationCenter from "../components/notification-center";
import ArohLogo from "../components/aroh-logo";
import type { TelemetryMetricsSnapshot, TelemetryEvent } from "@aroh/asdk/src/telemetry";

// Dynamically import AdminCharts to prevent SSR conflicts (Next.js client-only mounting)
const AdminCharts = dynamic(() => import("../components/admin-charts"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="h-[350px] bg-zinc-950/60 border border-cyan-500/20 rounded-2xl animate-pulse" />
      <div className="h-[350px] bg-zinc-950/60 border border-cyan-500/20 rounded-2xl animate-pulse" />
      <div className="h-[350px] bg-zinc-950/60 border border-cyan-500/20 rounded-2xl animate-pulse" />
    </div>
  ),
});

// ─── Telemetry Panel ─────────────────────────────────────────────────────────

function TelemetryPanel() {
  const [snapshot, setSnapshot] = React.useState<TelemetryMetricsSnapshot | null>(null);
  const [connected, setConnected] = React.useState(false);
  const [recentEvents, setRecentEvents] = React.useState<TelemetryEvent[]>([]);

  React.useEffect(() => {
    // Connect to SSE stream with demo mode enabled (admin page is already role-gated)
    const eventSource = new EventSource("/api/telemetry/stream?demo=1");

    eventSource.addEventListener("heartbeat", () => {
      setConnected(true);
    });

    eventSource.addEventListener("snapshot", (e) => {
      try {
        const snap: TelemetryMetricsSnapshot = JSON.parse(e.data);
        setSnapshot(snap);
        setRecentEvents(snap.recentEvents ?? []);
        setConnected(true);
      } catch {
        // Malformed frame — ignore
      }
    });

    eventSource.onerror = () => {
      setConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const metricCard = (label: string, value: string | number | null, accent: string) => (
    <div className={`bg-white border ${accent} rounded-2xl p-5 space-y-1 shadow-sm`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 font-mono">
        {value === null ? "—" : value}
      </p>
    </div>
  );

  const eventTypeBadge = (type: string) => {
    const colours: Record<string, string> = {
      "settlement.completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "settlement.latency": "bg-blue-50 text-blue-700 border-blue-200",
      "webhook.dispatched": "bg-violet-50 text-violet-700 border-violet-200",
      "webhook.failed": "bg-rose-50 text-rose-700 border-rose-200",
      "journey.started": "bg-amber-50 text-amber-700 border-amber-200",
      "journey.completed": "bg-teal-50 text-teal-700 border-teal-200",
      "api_key.created": "bg-indigo-50 text-indigo-700 border-indigo-200",
      "heartbeat": "bg-slate-50 text-slate-500 border-slate-200",
    };
    const cls = colours[type] ?? "bg-slate-50 text-slate-500 border-slate-200";
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold border ${cls}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="bg-white border border-black/5 rounded-3xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Real-Time Telemetry Stream
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            SSE operational metrics broker — settlement latency, journeys, webhooks
          </p>
        </div>
        <span
          className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border ${
            connected
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-600 border-rose-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-rose-400"}`}
          />
          {connected ? "Live" : "Connecting…"}
        </span>
      </div>

      {/* Metric Cards */}
      {snapshot ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metricCard("Settlements", snapshot.settlementCount, "border-emerald-200/60")}
            {metricCard(
              "p50 Latency",
              snapshot.settlementLatencyP50Ms !== null ? `${snapshot.settlementLatencyP50Ms}ms` : null,
              "border-blue-200/60"
            )}
            {metricCard(
              "p95 Latency",
              snapshot.settlementLatencyP95Ms !== null ? `${snapshot.settlementLatencyP95Ms}ms` : null,
              "border-blue-200/60"
            )}
            {metricCard("Active Journeys", snapshot.activeJourneys, "border-amber-200/60")}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metricCard("Completed Journeys", snapshot.completedJourneys, "border-teal-200/60")}
            {metricCard("Webhook Success", snapshot.webhookSuccessCount, "border-violet-200/60")}
            {metricCard("Webhook Failures", snapshot.webhookFailureCount, "border-rose-200/60")}
            {metricCard("Keys Issued", snapshot.apiKeyCreatedCount, "border-indigo-200/60")}
          </div>

          {/* Recent Events Feed */}
          {recentEvents.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Recent Telemetry Events
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-black/5 text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
                      <th className="pb-2">Event</th>
                      <th className="pb-2">Trace ID</th>
                      <th className="pb-2">Details</th>
                      <th className="pb-2 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 font-mono">
                    {recentEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2">{eventTypeBadge(ev.type)}</td>
                        <td className="py-2 text-slate-400 text-[10px]">
                          {ev.traceparent.split("-")[1]?.slice(0, 8) ?? "—"}…
                        </td>
                        <td className="py-2 text-slate-600 font-sans text-[11px]">
                          {ev.payload.note ??
                            ev.payload.journeyPath ??
                            ev.payload.webhookEventType ??
                            (ev.payload.latencyMs !== undefined ? `${ev.payload.latencyMs}ms` : "—")}
                        </td>
                        <td className="py-2 text-right text-slate-400 text-[10px]">
                          {new Date(ev.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {recentEvents.length === 0 && (
            <p className="text-center text-slate-400 text-xs py-4 font-mono">
              No telemetry events yet. Events populate as the platform processes operations.
            </p>
          )}
        </>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isRehydrated, rewardUser } = usePlatformStore();

  const [targetUserId, setTargetUserId] = React.useState("user-id");
  const [creditAmount, setCreditAmount] = React.useState("500");
  const [creditDesc, setCreditDesc] = React.useState("Platform Incentive Reward");
  const [globalTxs, setGlobalTxs] = React.useState<any[]>([]);

  const fetchGlobal = React.useCallback(async () => {
    try {
      const list = await mockWalletService.getAllTransactions();
      setGlobalTxs(list);
    } catch {
      // Bypassed
    }
  }, []);

  React.useEffect(() => {
    if (isRehydrated && !isAuthenticated) {
      router.push("/");
    } else if (user?.role === "admin") {
      fetchGlobal();
    }
  }, [isAuthenticated, isRehydrated, user, router, fetchGlobal]);

  const hasAccess = user?.role === "admin";

  const handleReward = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(creditAmount);
    if (!targetUserId || isNaN(amountVal) || amountVal <= 0) return;

    try {
      await rewardUser(targetUserId, amountVal, creditDesc);
      alert(`Successfully credited ${amountVal} Aros to user "${targetUserId}".`);
      fetchGlobal();
    } catch (err: any) {
      alert(err.message || "Failed to reward user");
    }
  };

  if (!isRehydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] flex justify-center items-center text-slate-900">
        <span className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] flex flex-col justify-center items-center text-slate-900 p-6 bg-mesh-light">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-8 rounded-3xl max-w-md text-center space-y-4 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Access Denied</h1>
          <p className="text-xs text-slate-600 font-normal">
            This module contains global platform override privileges. Only official Administrators are authorized.
          </p>
          <Button variant="primary" onClick={() => router.push("/")} className="px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-12 px-6 lg:px-12 bg-mesh-light">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
            <ArohLogo size={40} />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Platform Admin Console
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-normal">
                Global governance controls, unlimited admin Aros ledger, and transaction audits.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <Button variant="secondary" onClick={() => router.push("/")} className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50">
              Home
            </Button>
            <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-4 text-xs bg-slate-100 text-slate-800 border-slate-200">
              Dashboard
            </Button>
          </div>
        </div>

        {/* Live Ecosystem Metrics */}
        <AdminCharts />

        {/* Real-Time Telemetry Broker Panel — Wave 2 Milestone 3.5 */}
        <TelemetryPanel />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issue Credit Form */}
          <div className="lg:col-span-1 bg-white border border-black/5 p-6 rounded-3xl h-fit space-y-6 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Issue Aros Incentive</h2>

            <form onSubmit={handleReward} className="space-y-4">
              <div>
                <label htmlFor="targetUserId" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Target Account ID
                </label>
                <select
                  id="targetUserId"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-black/10 text-slate-900 focus:outline-none focus:border-slate-900 text-xs shadow-sm font-mono"
                >
                  <option value="user-id">Standard User (user-id)</option>
                  <option value="operator-id">CMS Operator (operator-id)</option>
                  <option value="admin-id">Aroh Director (admin-id)</option>
                </select>
              </div>

              <div>
                <label htmlFor="creditAmount" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Token Amount (Aros)
                </label>
                <input
                  id="creditAmount"
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-xs shadow-sm font-mono"
                  required
                />
              </div>

              <div>
                <label htmlFor="creditDesc" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Ledger Description
                </label>
                <input
                  id="creditDesc"
                  type="text"
                  value={creditDesc}
                  onChange={(e) => setCreditDesc(e.target.value)}
                  placeholder="Reason for crediting..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-xs shadow-sm"
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full py-3 text-xs font-bold mt-4 bg-slate-900 text-white hover:bg-slate-800">
                Credit Wallet
              </Button>
            </form>
          </div>

          {/* Global Audit Ledger */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Ecosystem Audit Ledger</h2>
              <Button variant="glass" onClick={fetchGlobal} className="px-4 py-1.5 text-xs bg-slate-100 text-slate-800 border-slate-200">
                Refresh Ledger
              </Button>
            </div>

            {globalTxs.length === 0 ? (
              <div className="bg-white border border-black/5 rounded-2xl p-8 text-center text-slate-400 text-sm shadow-sm font-mono">
                No ledger transactions found in storage.
              </div>
            ) : (
              <div className="overflow-x-auto bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-black/5 text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
                      <th className="pb-3">User ID</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 font-mono">
                    {globalTxs.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-semibold text-slate-900">{tx.userId}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold ${
                              tx.amount > 0
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 text-slate-700 font-sans">{tx.description}</td>
                        <td className={`py-3 font-bold ${tx.amount > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Aros
                        </td>
                        <td className="py-3 text-right text-slate-400 text-[10px]">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
