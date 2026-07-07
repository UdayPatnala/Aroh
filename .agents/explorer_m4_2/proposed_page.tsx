"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePlatformStore, mockWalletService } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import NotificationCenter from "../components/notification-center";

// Dynamically import AdminCharts with ssr: false to prevent hydration errors
const AdminCharts = dynamic(() => import("../components/admin-charts"), {
  ssr: false,
});

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, rewardUser } = usePlatformStore();

  const [targetUserId, setTargetUserId] = React.useState("user-id");
  const [creditAmount, setCreditAmount] = React.useState("100");
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
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role === "admin") {
      fetchGlobal();
    }
  }, [isAuthenticated, user, router, fetchGlobal]);

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex justify-center items-center text-white">
        <span className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col justify-center items-center text-white p-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-xl max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-sm text-zinc-400">
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
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-10 w-10 object-contain rounded-lg border border-white/10 shadow-md" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                Platform Admin Console
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Global governance controls, wallet adjustments, and transaction ledger audits.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <Button variant="secondary" onClick={() => router.push("/")} className="px-5">
              Back to Home
            </Button>
          </div>
        </div>

        {/* Simulated Live Metrics Dashboard */}
        <AdminCharts />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issue Credit Form */}
          <div className="lg:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl h-fit space-y-6">
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
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-500 text-sm"
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
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
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
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                  required
                />
              </div>

              <Button type="submit" className="w-full py-2.5 text-xs font-semibold mt-4">
                Credit Wallet
              </Button>
            </form>
          </div>

          {/* Global Audit Ledger */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight text-white">Ecosystem-Wide Audit Ledger</h2>
              <Button variant="glass" onClick={fetchGlobal} className="px-3 py-1 text-xs">
                Refresh Ledger
              </Button>
            </div>

            {globalTxs.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-zinc-400 text-sm">
                No ledger transactions found in storage.
              </div>
            ) : (
              <div className="overflow-x-auto bg-white/3 border border-white/5 rounded-xl p-6">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                      <th className="pb-3">User ID</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {globalTxs.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-4 font-mono text-xs text-zinc-400">{tx.userId}</td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                              tx.type === "reward"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : tx.type === "membership_upgrade"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 text-white font-medium">{tx.description}</td>
                        <td className={`py-4 font-bold ${tx.amount >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} Aros
                        </td>
                        <td className="py-4 text-right text-xs text-zinc-400">
                          {new Date(tx.timestamp).toLocaleString()}
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
