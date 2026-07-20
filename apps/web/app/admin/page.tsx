"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePlatformStore, mockWalletService, formatArosBalance } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import NotificationCenter from "../components/notification-center";

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
    if (!isRehydrated) return;
    if (!isAuthenticated) {
      router.push("/login");
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
      <div className="min-h-screen bg-[#06070a] flex justify-center items-center text-white">
        <span className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#06070a] flex flex-col justify-center items-center text-white p-6 bg-mesh-logo">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-3xl max-w-md text-center space-y-4 shadow-2xl">
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-xs text-zinc-400">
            This module contains global platform override privileges. Only official Administrators are authorized.
          </p>
          <Button variant="primary" onClick={() => router.push("/")} className="px-6 py-2.5">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070a] text-white py-12 px-6 lg:px-12 bg-mesh-logo">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img src="/aroh-logo.png?v=2" alt="AROH Logo" className="h-10 w-10 object-contain rounded-xl border border-cyan-500/30" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient-logo">
                Platform Admin Console
              </h1>
              <p className="text-zinc-400 text-xs mt-0.5">
                Global governance controls, unlimited admin Aros ledger, and transaction audits.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <Button variant="secondary" onClick={() => router.push("/")} className="px-4 text-xs">
              Home
            </Button>
            <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-4 text-xs">
              Dashboard
            </Button>
          </div>
        </div>

        {/* Live Ecosystem Metrics */}
        <AdminCharts />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issue Credit Form */}
          <div className="lg:col-span-1 bg-zinc-950/80 border border-cyan-500/20 p-6 rounded-3xl h-fit space-y-6 border-logo-glow">
            <h2 className="text-xl font-bold tracking-tight text-white">Issue Aros Incentive</h2>

            <form onSubmit={handleReward} className="space-y-4">
              <div>
                <label htmlFor="targetUserId" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Target Account ID
                </label>
                <select
                  id="targetUserId"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 text-xs"
                >
                  <option value="user-id">Standard User (user-id)</option>
                  <option value="operator-id">CMS Operator (operator-id)</option>
                  <option value="admin-id">Aroh Director (admin-id)</option>
                </select>
              </div>

              <div>
                <label htmlFor="creditAmount" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Token Amount (Aros)
                </label>
                <input
                  id="creditAmount"
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                  required
                />
              </div>

              <div>
                <label htmlFor="creditDesc" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Ledger Description
                </label>
                <input
                  id="creditDesc"
                  type="text"
                  value={creditDesc}
                  onChange={(e) => setCreditDesc(e.target.value)}
                  placeholder="Reason for crediting..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full py-3 text-xs font-bold mt-4">
                Credit Wallet
              </Button>
            </form>
          </div>

          {/* Global Audit Ledger */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight text-white">Ecosystem Audit Ledger</h2>
              <Button variant="glass" onClick={fetchGlobal} className="px-4 py-1.5 text-xs">
                Refresh Ledger
              </Button>
            </div>

            {globalTxs.length === 0 ? (
              <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-8 text-center text-zinc-400 text-sm">
                No ledger transactions found in storage.
              </div>
            ) : (
              <div className="overflow-x-auto bg-zinc-950/70 border border-white/10 rounded-2xl p-6">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">
                      <th className="pb-3">User ID</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {globalTxs.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3 font-semibold text-white">{tx.userId}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold ${
                              tx.amount > 0
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-300 font-sans">{tx.description}</td>
                        <td className={`py-3 font-bold ${tx.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Aros
                        </td>
                        <td className="py-3 text-right text-zinc-500 text-[10px]">
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
