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

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#737373] mb-6">
          <Link href="/dashboard" className="hover:text-[#1A1A1A] transition-colors">
            ← Back to Dashboard
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium">Developer API Key Vault</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-[#E5E0D8] pb-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider px-2 py-1 rounded bg-[#EAE5DC] text-[#595959]">
                Phase 3.0 • Milestone 3.1
              </span>
              <h1 className="text-3xl font-semibold tracking-tight mt-2 text-[#111111]">
                Developer API Key Vault
              </h1>
              <p className="text-sm text-[#666666] mt-1 max-w-2xl">
                Cryptographic HMAC-SHA256 API keys with tier-gated rate limits. Raw keys are never stored
                on our servers and are displayed strictly once upon creation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-xs text-[#737373]">
                <div>Zero Plaintext Storage: <span className="text-emerald-700 font-semibold">Active</span></div>
                <div>Hash Standard: <span className="font-mono">SHA-256</span></div>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
}
