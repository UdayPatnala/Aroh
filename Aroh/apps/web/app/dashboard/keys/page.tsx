"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@aroh/ads";
import { usePlatformStore, ApiKeyRecord, ApiKeyEnvironment, ApiKeyTier } from "@aroh/asdk";

export default function DeveloperKeysPage() {
  const { user } = usePlatformStore();
  const [keys, setKeys] = React.useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Key creation state
  const [keyName, setKeyName] = React.useState("");
  const [environment, setEnvironment] = React.useState<ApiKeyEnvironment>("test");
  const [tier, setTier] = React.useState<ApiKeyTier>("basic");
  const [isCreating, setIsCreating] = React.useState(false);

  // One-time raw key banner state
  const [newlyCreatedKey, setNewlyCreatedKey] = React.useState<{ name: string; rawKey: string } | null>(null);
  const [copied, setCopied] = React.useState(false);

  const fetchKeys = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/developer/keys", {
        headers: {
          "x-user-id": user?.id || "usr_developer_01"
        }
      });
      if (!res.ok) throw new Error("Failed to load developer keys");
      const data = await res.json();
      setKeys(data.keys || []);
    } catch (err: any) {
      setError(err.message || "Failed to load keys");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    try {
      setIsCreating(true);
      setError(null);
      const res = await fetch("/api/developer/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "usr_developer_01"
        },
        body: JSON.stringify({
          name: keyName.trim(),
          environment,
          tier
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create API key");

      setNewlyCreatedKey({
        name: data.apiKeyRecord.name,
        rawKey: data.rawKey
      });
      setKeyName("");
      setCopied(false);
      await fetchKeys();
    } catch (err: any) {
      setError(err.message || "Error creating key");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this API key? This action is IRREVERSIBLE and will immediately terminate all access."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/developer/keys/${keyId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user?.id || "usr_developer_01"
        }
      });
      if (!res.ok) throw new Error("Failed to revoke API key");
      await fetchKeys();
    } catch (err: any) {
      alert(err.message || "Error revoking key");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tab selection
  const [activeTab, setActiveTab] = React.useState<"keys" | "explorer">("keys");

  // API Explorer state
  const [selectedEndpoint, setSelectedEndpoint] = React.useState<string>("/api/platform/version");
  const [explorerMethod, setExplorerMethod] = React.useState<string>("GET");
  const [explorerHeaders, setExplorerHeaders] = React.useState<Record<string, string>>({
    "Accept": "application/json",
    "x-user-id": user?.id || "usr_developer_01"
  });
  const [explorerLoading, setExplorerLoading] = React.useState(false);
  const [explorerResponse, setExplorerResponse] = React.useState<{
    status: number;
    statusText: string;
    durationMs: number;
    headers: Record<string, string>;
    body: any;
  } | null>(null);

  const availableEndpoints = [
    {
      id: "/api/platform/version",
      name: "Platform Version & Capabilities",
      method: "GET",
      desc: "Fetches authoritative version metadata, release tier, build ID, and verified status."
    },
    {
      id: "/api/developer/keys",
      name: "Developer API Keys",
      method: "GET",
      desc: "Queries registered HMAC-SHA256 API key records and rate-limit allocations."
    },
    {
      id: "/api/developer/webhooks",
      name: "Webhook Endpoints",
      method: "GET",
      desc: "Lists configured webhook delivery subscriptions and event filters."
    },
    {
      id: "/api/telemetry/stream",
      name: "Telemetry Health Stream",
      method: "GET",
      desc: "Inspects live platform telemetry heartbeat and compliance monitoring status."
    }
  ];

  const handleRunExplorer = async () => {
    try {
      setExplorerLoading(true);
      setExplorerResponse(null);
      const startTime = performance.now();

      const res = await fetch(selectedEndpoint, {
        method: explorerMethod,
        headers: explorerHeaders
      });

      const durationMs = Math.round(performance.now() - startTime);
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });

      let body: any;
      const text = await res.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }

      setExplorerResponse({
        status: res.status,
        statusText: res.statusText || (res.ok ? "OK" : "Error"),
        durationMs,
        headers: resHeaders,
        body
      });
    } catch (err: any) {
      setExplorerResponse({
        status: 500,
        statusText: "Client Exception",
        durationMs: 0,
        headers: {},
        body: { error: err.message || "Failed to execute request" }
      });
    } finally {
      setExplorerLoading(false);
    }
  };

  const getCurlSnippet = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://aroh.org";
    let cmd = `curl -X ${explorerMethod} "${origin}${selectedEndpoint}" \\\n`;
    Object.entries(explorerHeaders).forEach(([k, v]) => {
      cmd += `  -H "${k}: ${v}" \\\n`;
    });
    return cmd.replace(/ \\\n$/, "");
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#737373] mb-6">
          <Link href="/dashboard" className="hover:text-[#1A1A1A] transition-colors">
            ← Back to Dashboard
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium">Developer Tools</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-[#E5E0D8] pb-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider px-2 py-1 rounded bg-[#EAE5DC] text-[#595959]">
                Phase 3.0 • Milestone 3.1
              </span>
              <h1 className="text-3xl font-semibold tracking-tight mt-2 text-[#111111]">
                Developer Tools & API Vault
              </h1>
              <p className="text-sm text-[#666666] mt-1 max-w-2xl">
                Cryptographic HMAC-SHA256 API keys with tier-gated rate limits and live interactive API explorer
                for platform testing and spoke integration.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-xs text-[#737373]">
                <div>Zero Plaintext Storage: <span className="text-emerald-700 font-semibold">Active</span></div>
                <div>Hash Standard: <span className="font-mono">SHA-256</span></div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-6 border-b border-[#E5E0D8]">
            <button
              onClick={() => setActiveTab("keys")}
              className={`pb-3 px-4 text-xs font-medium border-b-2 transition-colors ${
                activeTab === "keys"
                  ? "border-[#111111] text-[#111111] font-semibold"
                  : "border-transparent text-[#737373] hover:text-[#111111]"
              }`}
            >
              API Key Vault
            </button>
            <button
              onClick={() => setActiveTab("explorer")}
              className={`pb-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "explorer"
                  ? "border-[#111111] text-[#111111] font-semibold"
                  : "border-transparent text-[#737373] hover:text-[#111111]"
              }`}
            >
              <span>Interactive API Explorer</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Live</span>
            </button>
          </div>
        </div>

        {activeTab === "keys" ? (
          <>
            {/* One-Time Raw Key Display Banner */}
            {newlyCreatedKey && (
              <div className="mb-8 p-6 rounded-lg bg-emerald-50 border border-emerald-300 shadow-sm animate-in fade-in">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                      <h3 className="font-semibold text-emerald-950">
                        New API Key Generated: {newlyCreatedKey.name}
                      </h3>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1">
                      Please copy and store this API key in a secure location now. For your security, this raw key
                      will <strong>never be shown again</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => setNewlyCreatedKey(null)}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={newlyCreatedKey.rawKey}
                    className="w-full font-mono text-xs p-3 rounded bg-white border border-emerald-200 text-emerald-950 select-all"
                  />
                  <Button
                    variant="primary"
                    onClick={() => handleCopy(newlyCreatedKey.rawKey)}
                    className="w-full sm:w-auto shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-4 py-3"
                  >
                    {copied ? "Copied!" : "Copy Key"}
                  </Button>
                </div>
              </div>
            )}

            {/* Create API Key Form */}
            <div className="p-6 rounded-lg bg-white border border-[#E5E0D8] shadow-sm mb-8">
              <h2 className="text-lg font-medium text-[#111111] mb-4">Create New API Key</h2>

              {error && (
                <div className="mb-4 p-3 rounded text-xs bg-red-50 border border-red-200 text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#444444] mb-1">
                    Key Name / Application
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OmniStream Video Worker"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded border border-[#D1CCC4] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#444444] mb-1">
                    Environment
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as ApiKeyEnvironment)}
                    className="w-full text-sm px-3 py-2 rounded border border-[#D1CCC4] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  >
                    <option value="test">Sandbox (aroh_test_)</option>
                    <option value="live">Production (aroh_live_)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#444444] mb-1">
                    Rate Limit Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as ApiKeyTier)}
                    className="w-full text-sm px-3 py-2 rounded border border-[#D1CCC4] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  >
                    <option value="basic">Basic (60 rpm)</option>
                    <option value="pro">Developer Pro (300 rpm)</option>
                    <option value="enterprise">Enterprise (1200 rpm)</option>
                  </select>
                </div>

                <div className="md:col-span-4 flex justify-end mt-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isCreating || !keyName.trim()}
                    className="bg-[#111111] hover:bg-[#2A2A2A] text-white text-xs px-5 py-2.5 rounded"
                  >
                    {isCreating ? "Generating Cryptographic Token..." : "Generate API Key"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Existing API Keys Table */}
            <div className="rounded-lg bg-white border border-[#E5E0D8] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E0D8] flex items-center justify-between">
                <h2 className="text-base font-medium text-[#111111]">Registered API Keys</h2>
                <span className="text-xs font-mono text-[#737373]">{keys.length} total keys</span>
              </div>

              {loading ? (
                <div className="p-8 text-center text-xs text-[#737373]">
                  Loading registered cryptographic keys...
                </div>
              ) : keys.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-sm font-medium text-[#444444]">No API keys registered yet</div>
                  <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
                    Generate your first sandbox or production key above to connect external spokes and developer scripts.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#595959] font-mono uppercase tracking-wider">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Masked Token</th>
                        <th className="py-3 px-4">Environment</th>
                        <th className="py-3 px-4">Rate Limit</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Created</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE7E1]">
                      {keys.map((k) => (
                        <tr key={k.id} className="hover:bg-[#FDFBF7] transition-colors">
                          <td className="py-3.5 px-4 font-medium text-[#111111]">{k.name}</td>
                          <td className="py-3.5 px-4 font-mono text-[#444444] select-all">{k.maskedKey}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono ${
                                k.environment === "live"
                                  ? "bg-amber-100 text-amber-900 border border-amber-200"
                                  : "bg-blue-100 text-blue-900 border border-blue-200"
                              }`}
                            >
                              {k.environment}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#555555]">
                            <span className="capitalize font-medium">{k.tier}</span> ({k.rateLimitRpm} rpm)
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${
                                k.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  k.status === "active" ? "bg-emerald-500" : "bg-neutral-400"
                                }`}
                              ></span>
                              {k.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#737373]">
                            {new Date(k.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {k.status === "active" ? (
                              <button
                                onClick={() => handleRevokeKey(k.id)}
                                className="text-red-600 hover:text-red-800 font-medium text-[11px] px-2 py-1 rounded hover:bg-red-50 transition-colors"
                              >
                                Revoke
                              </button>
                            ) : (
                              <span className="text-[#999999] text-[11px] italic">Revoked</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Interactive API Explorer Tab */
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E0D8] rounded-lg p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4 mb-4">
                <div>
                  <h2 className="text-base font-medium text-[#111111]">Interactive Platform Request Runner</h2>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Send test requests directly to local and staging AROH API endpoints with live telemetry inspection.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleRunExplorer}
                  disabled={explorerLoading}
                  className="bg-[#111111] hover:bg-[#2A2A2A] text-white text-xs px-5 py-2.5 rounded shrink-0"
                >
                  {explorerLoading ? "Executing Query..." : "Execute Request →"}
                </Button>
              </div>

              {/* Endpoint selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#444444] mb-1">Target Endpoint</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-[#EAE5DC] border border-r-0 border-[#D1CCC4] rounded-l font-mono text-xs font-bold text-[#444444]">
                      {explorerMethod}
                    </span>
                    <select
                      value={selectedEndpoint}
                      onChange={(e) => {
                        const ep = availableEndpoints.find((x) => x.id === e.target.value);
                        if (ep) {
                          setSelectedEndpoint(ep.id);
                          setExplorerMethod(ep.method);
                        }
                      }}
                      className="w-full text-xs font-mono px-3 py-2 rounded-r border border-[#D1CCC4] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                    >
                      {availableEndpoints.map((ep) => (
                        <option key={ep.id} value={ep.id}>
                          {ep.id} — {ep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-[#737373] mt-1.5">
                    {availableEndpoints.find((x) => x.id === selectedEndpoint)?.desc}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#444444] mb-1">Caller Identity Header</label>
                  <input
                    type="text"
                    value={explorerHeaders["x-user-id"] || ""}
                    onChange={(e) =>
                      setExplorerHeaders((prev) => ({ ...prev, "x-user-id": e.target.value }))
                    }
                    className="w-full text-xs font-mono px-3 py-2 rounded border border-[#D1CCC4] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                    placeholder="x-user-id"
                  />
                  <span className="text-[10px] text-[#888888] mt-1 block">
                    Simulates caller authorization context
                  </span>
                </div>
              </div>

              {/* cURL Snippet */}
              <div className="mt-4 pt-4 border-t border-[#E5E0D8]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-[#555555]">Equivalent cURL Command</span>
                  <button
                    onClick={() => handleCopy(getCurlSnippet())}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-medium"
                  >
                    {copied ? "Copied!" : "Copy cURL"}
                  </button>
                </div>
                <pre className="p-3 bg-[#1E1E1E] text-emerald-400 font-mono text-[11px] rounded overflow-x-auto selection:bg-emerald-900">
                  {getCurlSnippet()}
                </pre>
              </div>
            </div>

            {/* Live Response Panel */}
            {explorerResponse && (
              <div className="bg-white border border-[#E5E0D8] rounded-lg p-6 shadow-sm animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E0D8] pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                        explorerResponse.status >= 200 && explorerResponse.status < 300
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      {explorerResponse.status} {explorerResponse.statusText}
                    </span>
                    <span className="text-xs text-[#737373]">
                      Latency: <strong className="text-[#111111]">{explorerResponse.durationMs}ms</strong>
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#888888]">
                    {selectedEndpoint}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Response Body */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-[#444444]">Response Payload (JSON)</span>
                      <button
                        onClick={() => handleCopy(JSON.stringify(explorerResponse.body, null, 2))}
                        className="text-[11px] text-[#737373] hover:text-[#111111]"
                      >
                        Copy JSON
                      </button>
                    </div>
                    <pre className="p-4 bg-[#181818] text-[#E0E0E0] rounded font-mono text-xs overflow-x-auto max-h-96">
                      {JSON.stringify(explorerResponse.body, null, 2)}
                    </pre>
                  </div>

                  {/* Response Headers */}
                  <div>
                    <span className="text-xs font-medium text-[#444444] block mb-1">Response Headers</span>
                    <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded p-3 text-[11px] font-mono text-[#555555] space-y-1">
                      {Object.entries(explorerResponse.headers).map(([hk, hv]) => (
                        <div key={hk} className="flex gap-2">
                          <span className="text-[#888888] select-none">{hk}:</span>
                          <span className="text-[#222222] select-all">{hv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

