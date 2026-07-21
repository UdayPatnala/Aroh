"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePlatformStore, mockWalletService, formatArosBalance } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import NotificationCenter from "../components/notification-center";
import ArohLogo from "../components/aroh-logo";

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
