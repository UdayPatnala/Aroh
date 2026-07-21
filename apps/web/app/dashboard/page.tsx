"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, MembershipLevel, formatArosBalance } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import NotificationCenter from "../components/notification-center";
import ArohLogo from "../components/aroh-logo";

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
  const [showCvv, setShowCvv] = React.useState(false);
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
    if (isRehydrated && !isAuthenticated) {
      router.push("/");
    }
  }, [isRehydrated, isAuthenticated, router]);

  React.useEffect(() => {
    if (!isRehydrated) return;
    if (isAuthenticated) {
      fetchUserTransactions();
    }
  }, [isAuthenticated, isRehydrated, fetchUserTransactions]);

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
    return {
      bg: "bg-[#fbfbfa] bg-mesh-light",
      border: "border-black/5",
      accentBorder: "border-slate-900",
      cardBg: "bg-white border border-black/5 shadow-sm",
      accentText: "text-slate-900",
      accentBg: "bg-slate-100",
      gradientText: "from-slate-900 via-slate-700 to-slate-900",
      themeLabel: `${level.toUpperCase()} TIER`,
      badgeStyle: "bg-slate-100 text-slate-800 border border-slate-200 font-mono"
    };
  };

  if (!isRehydrated || !isAuthenticated || !profile || !wallet) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] flex justify-center items-center text-slate-900">
        <span className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const theme = getTierStyles(profile.membershipLevel, activeTheme);

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-12 px-6 lg:px-12 bg-mesh-light transition-all duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header navigation bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
            <ArohLogo size={40} />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex flex-wrap items-center gap-2.5">
                Platform Dashboard
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 font-mono align-middle">
                  {profile.membershipLevel.toUpperCase()} TIER
                </span>
              </h1>
              <p className="text-slate-500 text-xs mt-1 font-normal">
                Welcome back, <strong className="text-slate-900 font-semibold">{profile.displayName}</strong>. Manage your Aros economy account.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <Button variant="primary" onClick={() => router.push("/products")} className="px-5 text-xs bg-slate-900 text-white hover:bg-slate-800">
              Console Hub
            </Button>
            <Button variant="secondary" onClick={() => router.push("/")} className="px-5 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50">
              Back to Home
            </Button>
            <Button variant="glass" onClick={() => usePlatformStore.getState().logout()} className="px-5 text-xs bg-slate-100 text-slate-800 border-slate-200">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tabs selector */}
        <div className="flex gap-2 border-b border-black/5 pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "border-slate-900 text-slate-900 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "border-slate-900 text-slate-900 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Account Settings
          </button>
          <button
            onClick={() => setActiveTab("developer")}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "developer"
                ? "border-slate-900 text-slate-900 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-900"
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
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div className="flex gap-3 items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping mt-1.5 shrink-0" />
                  <div>
                    <h2 className="text-sm font-bold text-amber-900">Verify your email address</h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Please verify your email address to unlock full access to administrative capabilities and ledger transfers.
                    </p>
                  </div>
                </div>
                <Button
                  variant="glass"
                  onClick={handleSendVerification}
                  disabled={verificationSent}
                  className="text-xs font-semibold text-amber-800 bg-white border-amber-300 hover:bg-amber-100 shrink-0 w-full sm:w-auto"
                >
                  {verificationSent ? "Verification Link Sent" : "Send Verification Email"}
                </Button>
              </div>
            )}

            {/* Overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-black/5 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 block">Account Identity</span>
                <span className="text-lg font-bold truncate text-slate-900">{user?.email}</span>
                <span className="text-xs text-slate-500 mt-4 block">Role: <strong className="text-slate-800">{user?.role.toUpperCase()}</strong></span>
              </div>

              <div className="bg-white border border-black/5 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-sm">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 block">Aros Balance</span>
                <div className="flex flex-col">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{formatArosBalance(wallet.balance, user?.role)}</span>
                  <span className="text-xs text-slate-500 mt-1">Instant ledger clearance active</span>
                </div>
                <div className="mt-4 border-t border-black/5 pt-3 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Purchase Tokens</span>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="secondary" className="py-1 px-2 text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200" onClick={() => handlePurchaseInitiate(100, "$1.00")}>
                      100 Aros
                    </Button>
                    <Button variant="secondary" className="py-1 px-2 text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200" onClick={() => handlePurchaseInitiate(500, "$5.00")}>
                      500 Aros
                    </Button>
                    <Button variant="secondary" className="py-1 px-2 text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200" onClick={() => handlePurchaseInitiate(1000, "$10.00")}>
                      1K Aros
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black/5 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 block">Membership Level</span>
                <span className="text-2xl font-extrabold uppercase text-slate-900 tracking-wide">{profile.membershipLevel}</span>
                <span className="text-xs text-slate-500 mt-4 block">Updated: {new Date(profile.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Membership tiers */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">Upgrade Platform Membership</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((t) => {
                  const isActive = profile.membershipLevel === t.level;
                  const isDowngrade = t.level === "basic" && profile.membershipLevel !== "basic";
                  return (
                    <div
                      key={t.level}
                      className={`bg-white border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm ${
                        isActive ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md" : "border-black/5"
                      }`}
                    >
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{t.name}</h3>
                        <div className="flex items-baseline gap-1 my-3">
                          <span className="text-3xl font-extrabold text-slate-900">{t.price}</span>
                          <span className="text-xs text-slate-500 font-mono">Aros tokens</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-6 font-normal">{t.description}</p>
                        <ul className="space-y-2 border-t border-black/5 pt-4 mb-6">
                          {t.features.map((feat) => (
                            <li key={feat} className="text-xs text-slate-700 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        variant={isActive ? "primary" : "secondary"}
                        disabled={isActive || isDowngrade || wallet.balance < t.price || isLoading}
                        onClick={() => handleUpgrade(t.level, t.price)}
                        className={`w-full text-xs font-semibold tracking-wide py-2.5 ${
                          isActive
                            ? "bg-slate-900 text-white hover:bg-slate-800"
                            : "bg-white text-slate-800 border-black/10 hover:bg-slate-50"
                        }`}
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
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-6">Ledger Transactions</h2>
              {transactions.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8 font-mono">No ledger entries detected on this account.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead>
                      <tr className="border-b border-black/5 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                        <th className="pb-3">Transaction ID</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Description</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 font-mono text-xs text-slate-500">{tx.id}</td>
                          <td className="py-4">
                            <span
                              className={`px-2.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                                tx.type === "reward"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : tx.type === "membership_upgrade"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-4 text-slate-900 font-medium">{tx.description}</td>
                          <td className={`py-4 font-bold ${tx.amount >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} Aros
                          </td>
                          <td className="py-4 text-right text-xs text-slate-400 font-mono">
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
            <div className="lg:col-span-2 bg-white border border-black/5 p-6 rounded-2xl space-y-6 h-fit shadow-sm">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Update Profile Settings</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label htmlFor="displayNameInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Display Name
                  </label>
                  <input
                    id="displayNameInput"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 text-xs shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="avatarUrlInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Avatar URL (Optional)
                  </label>
                  <input
                    id="avatarUrlInput"
                    type="text"
                    placeholder="https://example.com/avatar.png"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 text-xs shadow-sm"
                  />
                </div>
                <Button type="submit" variant="primary" className="px-6 py-2.5 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800">
                  Save Profile
                </Button>
              </form>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Notification Preferences */}
              <div className="bg-white border border-black/5 p-6 rounded-2xl space-y-6 shadow-sm">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Alert Settings</h2>
                <form onSubmit={handleUpdatePrefs} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="inAppAlerts"
                      type="checkbox"
                      checked={inAppPref}
                      onChange={(e) => setInAppPref(e.target.checked)}
                      className="w-4 h-4 accent-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                    <label htmlFor="inAppAlerts" className="text-xs text-slate-700 font-semibold cursor-pointer">
                      Enable In-App Notifications
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="emailAlerts"
                      type="checkbox"
                      checked={emailPref}
                      onChange={(e) => setEmailPref(e.target.checked)}
                      className="w-4 h-4 accent-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                    <label htmlFor="emailAlerts" className="text-xs text-slate-700 font-semibold cursor-pointer">
                      Enable Email Alerts
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="fcmAlerts"
                      type="checkbox"
                      checked={fcmEnabled}
                      onChange={(e) => setFcmEnabled(e.target.checked)}
                      className="w-4 h-4 accent-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                    <label htmlFor="fcmAlerts" className="text-xs text-slate-700 font-semibold cursor-pointer">
                      Enable Push Notifications (FCM)
                    </label>
                  </div>
                  <Button type="submit" variant="primary" className="w-full py-2.5 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800">
                    Update Preferences
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "developer" && (
          <div className="bg-white border border-black/5 p-6 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Developer API Portal</h2>
            {profile.membershipLevel === "basic" ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-4">
                <p className="text-sm text-slate-700">
                  The Developer API Portal is restricted to <strong>Pro</strong> and <strong>Enterprise</strong> members.
                </p>
                <Button variant="primary" onClick={() => setActiveTab("overview")} className="px-6 py-2 bg-slate-900 text-white hover:bg-slate-800">
                  Upgrade Membership
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Form to Register App */}
                <form onSubmit={handleRegisterApp} className="space-y-4 max-w-md">
                  <div>
                    <label htmlFor="newAppNameInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      New Application Name
                    </label>
                    <input
                      id="newAppNameInput"
                      type="text"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-black/10 text-slate-900 text-xs focus:outline-none focus:border-slate-900 shadow-sm"
                      placeholder="My Awesome App"
                      required
                    />
                  </div>
                  <Button type="submit" variant="primary" className="px-6 py-2.5 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800">
                    Register Application
                  </Button>
                </form>

                {/* App Registry Table */}
                <div className="border-t border-black/5 pt-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Registered Credentials</h3>
                  {registeredKeys.length === 0 ? (
                    <p className="text-slate-400 text-xs font-mono">No registered applications found.</p>
                  ) : (
                    <div className="space-y-4">
                      {registeredKeys.map((app, idx) => (
                        <div key={app.clientId} className="bg-slate-50 border border-black/5 rounded-xl p-4 flex justify-between items-center shadow-sm">
                          <div className="space-y-1 font-mono text-xs">
                            <div className="text-sm font-bold text-slate-900 font-sans">{app.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">Client ID:</span> {app.clientId}
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(app.clientId);
                                  alert("Client ID copied to clipboard!");
                                }}
                                className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-sans transition-colors cursor-pointer"
                              >
                                Copy
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">API Key:</span> {app.apiKey}
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(app.apiKey);
                                  alert("API Key copied to clipboard!");
                                }}
                                className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-sans transition-colors cursor-pointer"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                          <Button variant="danger" className="text-xs" onClick={() => handleDeleteApp(idx)}>
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
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-black/10 rounded-2xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Token Purchase</h3>
              <p className="text-slate-500 text-xs mt-1">
                You are purchasing {selectedPack.amount} Aros tokens for {selectedPack.price}.
              </p>
            </div>
            <form onSubmit={handleConfirmPurchase} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="cardholderNameInput" className="block text-[10px] uppercase font-bold text-slate-500">Cardholder Name</label>
                <input
                  id="cardholderNameInput"
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-black/10 text-slate-900 text-xs focus:outline-none focus:border-slate-900"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="cardNumberInput" className="block text-[10px] uppercase font-bold text-slate-500">Card Number</label>
                <input
                  id="cardNumberInput"
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  maxLength={19}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-black/10 text-slate-900 text-xs focus:outline-none focus:border-slate-900 font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="cardExpiryInput" className="block text-[10px] uppercase font-bold text-slate-500">Expiry (MM/YY)</label>
                  <input
                    id="cardExpiryInput"
                    type="text"
                    placeholder="12/28"
                    maxLength={5}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-black/10 text-slate-900 text-xs focus:outline-none focus:border-slate-900 font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="cardCvvInput" className="block text-[10px] uppercase font-bold text-slate-500">CVV</label>
                  <div className="relative">
                    <input
                      id="cardCvvInput"
                      type={showCvv ? "text" : "password"}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-2 pr-8 rounded-xl bg-slate-50 border border-black/10 text-slate-900 text-xs focus:outline-none focus:border-slate-900 font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer focus:outline-none"
                      aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                    >
                      {showCvv ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.88 9.88a3 3 0 104.24 4.24M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <Button type="button" variant="secondary" className="flex-1 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50" onClick={() => { setIsBuying(false); setSelectedPack(null); }} disabled={isPaymentLoading}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1 text-xs bg-slate-900 text-white hover:bg-slate-800" disabled={isPaymentLoading}>
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
