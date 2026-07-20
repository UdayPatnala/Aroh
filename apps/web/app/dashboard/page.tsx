"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, MembershipLevel, formatArosBalance } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import NotificationCenter from "../components/notification-center";

const tiers: { level: MembershipLevel; name: string; price: number; description: string; features: string[] }[] = [
  {
    level: "basic",
    name: "Basic Access",
    price: 0,
    description: "Standard entry into the AROH platform core services",
    features: ["Read announcements", "Standard search", "Single profile"]
  },
  {
    level: "pro",
    name: "Developer Pro",
    price: 100,
    description: "Advanced API access, economy features, and elevated storage",
    features: ["Standard search + filters", "Wallet ledger audit tool", "5GB Asset Storage", "Standard support"]
  },
  {
    level: "enterprise",
    name: "Platform Enterprise",
    price: 500,
    description: "Full suite integration with developer SDK overrides and priorities",
    features: ["CMS editorial privileges", "Unlimited Asset Storage", "Priority support", "Early access features"]
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, wallet, transactions, isAuthenticated, isRehydrated, isLoading, upgradeMembership, fetchUserTransactions, sendEmailVerification, updateProfile, updateNotificationPreferences, notificationPreferences, rewardUser, addNotification } =
    usePlatformStore();

  const [activeTab, setActiveTab] = React.useState<"overview" | "settings" | "developer">("overview");
  const [verificationSent, setVerificationSent] = React.useState(false);

  // Settings State
  const [displayName, setDisplayName] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [activeTheme, setActiveTheme] = React.useState("dark");
  const [inAppPref, setInAppPref] = React.useState(true);
  const [emailPref, setEmailPref] = React.useState(true);

  // Aros purchase state
  const [isBuying, setIsBuying] = React.useState(false);
  const [selectedPack, setSelectedPack] = React.useState<{ amount: number; price: string } | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = React.useState(false);

  // App registry state
  const [newAppName, setNewAppName] = React.useState("");
  const [registeredKeys, setRegisteredKeys] = React.useState<{ name: string; clientId: string; apiKey: string }[]>([]);

  // FCM state
  const [fcmEnabled, setFcmEnabled] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("aroh_developer_apps");
      if (stored) {
        setRegisteredKeys(JSON.parse(stored));
      }
      const storedFcm = localStorage.getItem("aroh_fcm_enabled");
      setFcmEnabled(storedFcm === "true");
    }
  }, []);

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setAvatarUrl(profile.avatarUrl || "");
    }
    if (notificationPreferences) {
      setInAppPref(notificationPreferences.inApp);
      setEmailPref(notificationPreferences.email);
    }
  }, [profile, notificationPreferences]);

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification();
      setVerificationSent(true);
    } catch (err: any) {
      alert(err.message || "Failed to send verification email");
    }
  };

  React.useEffect(() => {
    if (!isRehydrated) return;
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchUserTransactions();
    }
  }, [isAuthenticated, isRehydrated, router, fetchUserTransactions]);

  const handleUpgrade = async (level: MembershipLevel, price: number) => {
    if (!profile || profile.membershipLevel === level) return;
    try {
      await upgradeMembership(level, price);
    } catch (err: any) {
      alert(err.message || "Failed to upgrade membership");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(displayName, avatarUrl);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    }
  };

  const handleUpdatePrefs = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationPreferences({ inApp: inAppPref, email: emailPref });
    localStorage.setItem("aroh_fcm_enabled", fcmEnabled.toString());
    alert("Notification preferences updated!");
  };

  const handlePurchaseInitiate = (amount: number, price: string) => {
    setSelectedPack({ amount, price });
    setIsBuying(true);
  };

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPack) return;
    setIsPaymentLoading(true);
    setTimeout(async () => {
      try {
        await rewardUser(user.id, selectedPack.amount, `Purchased Aros via Checkout Gateway`);
        setIsBuying(false);
        setSelectedPack(null);
        alert(`Success! Credited +${selectedPack.amount} Aros to your wallet.`);
      } catch (err: any) {
        alert(err.message || "Failed to complete transaction");
      } finally {
        setIsPaymentLoading(false);
      }
    }, 1500);
  };

  const handleRegisterApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;
    const newApp = {
      name: newAppName,
      clientId: "client_" + Math.random().toString(36).substr(2, 9),
      apiKey: "aroh_live_" + Math.random().toString(36).substr(2, 16) + Math.random().toString(36).substr(2, 16)
    };
    const updated = [...registeredKeys, newApp];
    setRegisteredKeys(updated);
    localStorage.setItem("aroh_developer_apps", JSON.stringify(updated));
    setNewAppName("");
    addNotification(`Registered application "${newApp.name}"`, "success");
  };

  const handleDeleteApp = (index: number) => {
    const updated = registeredKeys.filter((_, i) => i !== index);
    setRegisteredKeys(updated);
    localStorage.setItem("aroh_developer_apps", JSON.stringify(updated));
    addNotification("Application registration deleted", "info");
  };

  const getTierStyles = (level: MembershipLevel, themeName: string) => {
    if (themeName === "gold") {
      return {
        bg: "bg-gradient-to-br from-[#0c0a05] via-[#1c1505] to-[#08080a]",
        border: "border-amber-500/20",
        accentBorder: "border-amber-500",
        cardBg: "bg-white/3 backdrop-blur-xl border border-amber-500/20 shadow-2xl shadow-amber-500/5",
        accentText: "text-amber-400",
        accentBg: "bg-amber-500/10",
        gradientText: "bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500",
        themeLabel: `${level === "enterprise" ? "Enterprise" : level === "pro" ? "Pro" : "Basic"} (Cyber Gold)`,
        badgeStyle: "bg-amber-500/20 text-amber-300 border border-amber-500/30"
      };
    }
    if (themeName === "gray") {
      return {
        bg: "bg-gradient-to-br from-[#0e1013] via-[#1e2229] to-[#0c0e11]",
        border: "border-slate-400/20",
        accentBorder: "border-slate-400",
        cardBg: "bg-white/3 backdrop-blur-xl border border-slate-400/20 shadow-2xl shadow-slate-400/5",
        accentText: "text-slate-300",
        accentBg: "bg-slate-500/10",
        gradientText: "bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400",
        themeLabel: `${level === "enterprise" ? "Enterprise" : level === "pro" ? "Pro" : "Basic"} (Slate Gray)`,
        badgeStyle: "bg-slate-500/20 text-slate-300 border border-slate-500/30"
      };
    }

    switch (level) {
      case "enterprise":
        return {
          bg: "bg-gradient-to-br from-[#0a0614] via-[#0f0724] to-[#05040d]",
          border: "border-fuchsia-500/20",
          accentBorder: "border-fuchsia-500",
          cardBg: "bg-white/3 backdrop-blur-xl border border-fuchsia-500/20 shadow-2xl shadow-fuchsia-500/5",
          accentText: "text-fuchsia-400",
          accentBg: "bg-fuchsia-500/10",
          gradientText: "bg-gradient-to-r from-fuchsia-400 via-pink-200 to-indigo-400",
          themeLabel: "Enterprise Level",
          badgeStyle: "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
        };
      case "pro":
        return {
          bg: "bg-gradient-to-br from-[#0c0a05] via-[#1c1505] to-[#08080a]",
          border: "border-amber-500/20",
          accentBorder: "border-amber-500",
          cardBg: "bg-white/3 backdrop-blur-xl border border-amber-500/20 shadow-2xl shadow-amber-500/5",
          accentText: "text-amber-400",
          accentBg: "bg-amber-500/10",
          gradientText: "bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500",
          themeLabel: "Pro Level",
          badgeStyle: "bg-amber-500/20 text-amber-300 border border-amber-500/30"
        };
      case "basic":
      default:
        return {
          bg: "bg-[#070709]",
          border: "border-white/5",
          accentBorder: "border-zinc-500",
          cardBg: "bg-white/2 border border-white/5",
          accentText: "text-zinc-400",
          accentBg: "bg-zinc-800/40",
          gradientText: "bg-gradient-to-r from-zinc-300 to-zinc-500",
          themeLabel: "Basic Level",
          badgeStyle: "bg-zinc-800 text-zinc-300 border border-white/10"
        };
    }
  };

  if (!isRehydrated || !isAuthenticated || !profile || !wallet) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex justify-center items-center text-white">
        <span className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const theme = getTierStyles(profile.membershipLevel, activeTheme);

  return (
    <div className={`min-h-screen ${theme.bg} text-white py-12 px-6 lg:px-12 transition-all duration-500`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header navigation bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img src="/aroh-logo.png?v=2" alt="AROH Logo" className="h-10 w-10 object-contain rounded-lg border border-white/10 shadow-md" />
            <div>
              <h1 className={`text-3xl font-extrabold tracking-tight bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent flex flex-wrap items-center gap-2.5`}>
                Platform Dashboard
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${theme.badgeStyle} align-middle`}>
                  {theme.themeLabel}
                </span>
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Welcome back, <strong className="text-white">{profile.displayName}</strong>. Manage your Aros economy account.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <Button variant="primary" onClick={() => router.push("/products")} className="px-5">
              Console Hub
            </Button>
            <Button variant="secondary" onClick={() => router.push("/")} className="px-5">
              Back to Home
            </Button>
            <Button variant="glass" onClick={() => usePlatformStore.getState().logout()} className="px-5">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tabs selector */}
        <div className="flex gap-2 border-b border-white/5 pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? `${theme.accentBorder} ${theme.accentText}`
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "settings"
                ? `${theme.accentBorder} ${theme.accentText}`
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Account Settings
          </button>
          <button
            onClick={() => setActiveTab("developer")}
            className={`px-4 py-2 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "developer"
                ? `${theme.accentBorder} ${theme.accentText}`
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Developer Portal
          </button>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            {/* Email Verification Alert Banner */}
            {user && user.emailVerified === false && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-3 items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping mt-1.5 shrink-0" />
                  <div>
                    <h2 className="text-sm font-bold text-amber-400">Verify your email address</h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Please verify your email address to unlock full access to administrative capabilities and ledger transfers.
                    </p>
                  </div>
                </div>
                <Button
                  variant="glass"
                  onClick={handleSendVerification}
                  disabled={verificationSent}
                  className="text-xs font-semibold text-amber-500 border-amber-500/20 hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0 w-full sm:w-auto"
                >
                  {verificationSent ? "Verification Link Sent" : "Send Verification Email"}
                </Button>
              </div>
            )}

            {/* Overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${theme.cardBg} p-6 rounded-xl flex flex-col justify-between transition-all duration-500`}>
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">Account Identity</span>
                <span className="text-lg font-bold truncate text-white">{user?.email}</span>
                <span className="text-xs text-zinc-400 mt-4 block">Role: {user?.role.toUpperCase()}</span>
              </div>

              <div className={`${theme.cardBg} p-6 rounded-xl flex flex-col justify-between relative overflow-hidden transition-all duration-500`}>
                <div className={`absolute right-0 top-0 w-24 h-24 ${theme.accentBg} rounded-full blur-2xl pointer-events-none`} />
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">Aros Balance</span>
                <div className="flex flex-col">
                  <span className={`text-4xl font-extrabold ${theme.accentText} tracking-tight`}>{formatArosBalance(wallet.balance, user?.role)}</span>
                  <span className="text-xs text-zinc-400 mt-1">Instant ledger clearance active</span>
                </div>
                <div className="mt-4 border-t border-white/5 pt-3 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Purchase Tokens</span>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="glass" className="py-1 px-2 text-[10px]" onClick={() => handlePurchaseInitiate(100, "$1.00")}>
                      100 Aros
                    </Button>
                    <Button variant="glass" className="py-1 px-2 text-[10px]" onClick={() => handlePurchaseInitiate(500, "$5.00")}>
                      500 Aros
                    </Button>
                    <Button variant="glass" className="py-1 px-2 text-[10px]" onClick={() => handlePurchaseInitiate(1000, "$10.00")}>
                      1K Aros
                    </Button>
                  </div>
                </div>
              </div>

              <div className={`${theme.cardBg} p-6 rounded-xl flex flex-col justify-between transition-all duration-500`}>
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">Membership Level</span>
                <span className={`text-2xl font-extrabold uppercase ${theme.accentText} tracking-wide`}>{profile.membershipLevel}</span>
                <span className="text-xs text-zinc-400 mt-4 block">Updated: {new Date(profile.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Membership tiers */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-6">Upgrade Platform Membership</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((t) => {
                  const isActive = profile.membershipLevel === t.level;
                  const isDowngrade = t.level === "basic" && profile.membershipLevel !== "basic";
                  return (
                    <div
                      key={t.level}
                      className={`bg-white/5 backdrop-blur-md border rounded-xl p-6 flex flex-col justify-between transition-all duration-300 ${
                        isActive ? "border-amber-500/60 shadow-lg shadow-amber-500/5 bg-amber-500/2" : "border-white/10"
                      }`}
                    >
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{t.name}</h3>
                        <div className="flex items-baseline gap-1 my-3">
                          <span className="text-3xl font-extrabold text-amber-400">{t.price}</span>
                          <span className="text-xs text-zinc-400">Aros tokens</span>
                        </div>
                        <p className="text-xs text-zinc-400 mb-6">{t.description}</p>
                        <ul className="space-y-2 border-t border-white/5 pt-4 mb-6">
                          {t.features.map((feat) => (
                            <li key={feat} className="text-xs text-zinc-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        variant={isActive ? "primary" : "glass"}
                        disabled={isActive || isDowngrade || wallet.balance < t.price || isLoading}
                        onClick={() => handleUpgrade(t.level, t.price)}
                        className="w-full text-xs font-semibold tracking-wide py-2.5"
                      >
                        {isActive
                          ? "Active Tier"
                          : isDowngrade
                          ? "Downgrades Restricted"
                          : wallet.balance < t.price
                          ? "Insufficient Balance"
                          : `Upgrade for ${t.price} Aros`}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transaction History Ledger */}
            <div className="bg-white/3 border border-white/5 rounded-xl p-6">
              <h2 className="text-xl font-bold tracking-tight text-white mb-6">Ledger Transactions</h2>
              {transactions.length === 0 ? (
                <p className="text-zinc-400 text-sm text-center py-8">No ledger entries detected on this account.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-300">
                    <thead>
                      <tr className="border-b border-white/10 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                        <th className="pb-3">Transaction ID</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Description</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/2 transition-colors">
                          <td className="py-4 font-mono text-xs text-zinc-400">{tx.id}</td>
                          <td className="py-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
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
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile configuration Form */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-xl space-y-6 h-fit">
              <h2 className="text-xl font-bold tracking-tight text-white">Update Profile Settings</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label htmlFor="displayNameInput" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Display Name
                  </label>
                  <input
                    id="displayNameInput"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="avatarUrlInput" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Avatar URL (Optional)
                  </label>
                  <input
                    id="avatarUrlInput"
                    type="text"
                    placeholder="https://example.com/avatar.png"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <Button type="submit" className="px-6 py-2.5 text-xs font-semibold">
                  Save Profile
                </Button>
              </form>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Notification Preferences */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                <h2 className="text-xl font-bold tracking-tight text-white">Alert Settings</h2>
                <form onSubmit={handleUpdatePrefs} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="inAppAlerts"
                      type="checkbox"
                      checked={inAppPref}
                      onChange={(e) => setInAppPref(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="inAppAlerts" className="text-xs text-zinc-300 font-semibold cursor-pointer">
                      Enable In-App Notifications
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="emailAlerts"
                      type="checkbox"
                      checked={emailPref}
                      onChange={(e) => setEmailPref(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="emailAlerts" className="text-xs text-zinc-300 font-semibold cursor-pointer">
                      Enable Email Alerts
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="fcmAlerts"
                      type="checkbox"
                      checked={fcmEnabled}
                      onChange={(e) => setFcmEnabled(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="fcmAlerts" className="text-xs text-zinc-300 font-semibold cursor-pointer">
                      Enable Push Notifications (FCM)
                    </label>
                  </div>
                  <Button type="submit" className="w-full py-2.5 text-xs font-semibold">
                    Update Preferences
                  </Button>
                </form>
              </div>

              {/* Theme Settings */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-white">Ecosystem Styling</h2>
                <div>
                  <label htmlFor="themeSelect" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Active Appearance Theme
                  </label>
                  <select
                    id="themeSelect"
                    value={activeTheme}
                    onChange={(e) => {
                      setActiveTheme(e.target.value);
                      alert(`Theme switched to "${e.target.value}" (Simulated)`);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="dark">Sleek Dark Mode</option>
                    <option value="gray">Modern Slate Gray</option>
                    <option value="gold">Ecosystem Cyber Gold</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "developer" && (
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-white">Developer API Portal</h2>
            {profile.membershipLevel === "basic" ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 text-center space-y-4">
                <p className="text-sm text-zinc-400">
                  The Developer API Portal is restricted to <strong>Pro</strong> and <strong>Enterprise</strong> members.
                </p>
                <Button variant="primary" onClick={() => setActiveTab("overview")}>
                  Upgrade Membership
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Form to Register App */}
                <form onSubmit={handleRegisterApp} className="space-y-4 max-w-md">
                  <div>
                    <label htmlFor="newAppNameInput" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                      New Application Name
                    </label>
                    <input
                      id="newAppNameInput"
                      type="text"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm"
                      placeholder="My Awesome App"
                      required
                    />
                  </div>
                  <Button type="submit" className="px-6 py-2.5 text-xs font-semibold">
                    Register Application
                  </Button>
                </form>

                {/* App Registry Table */}
                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-sm font-bold text-white mb-4">Registered Credentials</h3>
                  {registeredKeys.length === 0 ? (
                    <p className="text-zinc-400 text-xs">No registered applications found.</p>
                  ) : (
                    <div className="space-y-4">
                      {registeredKeys.map((app, idx) => (
                        <div key={app.clientId} className="bg-white/2 border border-white/5 rounded-lg p-4 flex justify-between items-center">
                          <div className="space-y-1 font-mono text-xs">
                            <div className="text-sm font-bold text-white font-sans">{app.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-400">Client ID:</span> {app.clientId}
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(app.clientId);
                                  alert("Client ID copied to clipboard!");
                                }}
                                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-sans transition-colors cursor-pointer"
                              >
                                Copy
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-400">API Key:</span> {app.apiKey}
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(app.apiKey);
                                  alert("API Key copied to clipboard!");
                                }}
                                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-sans transition-colors cursor-pointer"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                          <Button variant="glass" className="text-rose-500 hover:text-rose-400 text-xs" onClick={() => handleDeleteApp(idx)}>
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isBuying && selectedPack && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-md w-full space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Confirm Token Purchase</h3>
              <p className="text-zinc-400 text-xs mt-1">
                You are purchasing {selectedPack.amount} Aros tokens for {selectedPack.price}.
              </p>
            </div>
            <form onSubmit={handleConfirmPurchase} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="cardholderNameInput" className="block text-[10px] uppercase font-bold text-zinc-400">Cardholder Name</label>
                <input
                  id="cardholderNameInput"
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="cardNumberInput" className="block text-[10px] uppercase font-bold text-zinc-400">Card Number</label>
                <input
                  id="cardNumberInput"
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  maxLength={19}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="cardExpiryInput" className="block text-[10px] uppercase font-bold text-zinc-400">Expiry (MM/YY)</label>
                  <input
                    id="cardExpiryInput"
                    type="text"
                    placeholder="12/28"
                    maxLength={5}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="cardCvvInput" className="block text-[10px] uppercase font-bold text-zinc-400">CVV</label>
                  <input
                    id="cardCvvInput"
                    type="password"
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <Button type="button" variant="glass" className="flex-1 text-xs" onClick={() => { setIsBuying(false); setSelectedPack(null); }} disabled={isPaymentLoading}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1 text-xs" disabled={isPaymentLoading}>
                  {isPaymentLoading ? "Processing..." : "Pay Now"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
