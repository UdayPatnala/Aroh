"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, MembershipLevel } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion, AnimatePresence } from "framer-motion";
import { registeredProducts, ProductDetails } from "../explore/page";
import InteractiveWorkspace from "../explore/[productId]/interactive-workspace";
import NotificationCenter from "../components/notification-center";

const categories = ["All", "Core Service", "Ecosystem Service", "Analytics", "Developer Service", "AI Tools"];

export default function ProductsPage() {
  const router = useRouter();
  const {
    user,
    profile,
    wallet,
    isAuthenticated,
    isRehydrated,
    upgradeMembership,
    rewardUser
  } = usePlatformStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedProduct, setSelectedProduct] = React.useState<ProductDetails>(registeredProducts[0]);

  // Launch state per product
  const [launchLogs, setLaunchLogs] = React.useState<Record<string, string[]>>({});
  const [launchingStates, setLaunchingStates] = React.useState<Record<string, boolean>>({});
  const [launchedStates, setLaunchedStates] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (isRehydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isRehydrated, router]);

  const filteredProducts = registeredProducts.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prod.badge === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTierImportance = (tier: MembershipLevel): number => {
    if (tier === "enterprise") return 2;
    if (tier === "pro") return 1;
    return 0;
  };

  const userTierImportance = profile ? getTierImportance(profile.membershipLevel) : 0;
  const productTierImportance = getTierImportance(selectedProduct.requiredTier);
  const hasTierAccess = userTierImportance >= productTierImportance;

  const handleLaunch = (productId: string) => {
    if (launchingStates[productId] || launchedStates[productId]) return;

    setLaunchingStates((prev) => ({ ...prev, [productId]: true }));
    setLaunchLogs((prev) => ({
      ...prev,
      [productId]: [
        "[SYSTEM] Establishing credentials handshake with AROH Core...",
        "[SYSTEM] Verifying OAuth 2.0 Client Tokens... Succeeded."
      ]
    }));

    setTimeout(() => {
      setLaunchLogs((prev) => ({
        ...prev,
        [productId]: [...(prev[productId] || []), `[INFO] Initializing ${selectedProduct.name} application core...`]
      }));
    }, 600);

    setTimeout(() => {
      setLaunchLogs((prev) => ({
        ...prev,
        [productId]: [...(prev[productId] || []), "[SUCCESS] Workspace session instantiated. Interface ready."]
      }));
      setLaunchingStates((prev) => ({ ...prev, [productId]: false }));
      setLaunchedStates((prev) => ({ ...prev, [productId]: true }));
    }, 1500);
  };

  const handleBuyUpgrade = async () => {
    if (!wallet || wallet.balance < selectedProduct.price) {
      alert("Insufficient Aros tokens to execute upgrade.");
      return;
    }
    try {
      await upgradeMembership(selectedProduct.requiredTier, selectedProduct.price);
      alert(`Success! Upgraded membership level to ${selectedProduct.requiredTier.toUpperCase()}.`);
    } catch (err: any) {
      alert(err.message || "Failed to buy upgrade");
    }
  };

  if (!isRehydrated || !isAuthenticated || !profile || !wallet) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex justify-center items-center text-white">
        <span className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const logs = launchLogs[selectedProduct.id] || [];
  const isLaunching = launchingStates[selectedProduct.id] || false;
  const isLaunched = launchedStates[selectedProduct.id] || false;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6 lg:px-12 transition-all duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-10 w-10 object-contain rounded-lg border border-white/10" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                AROH Products Console
              </h1>
              <p className="text-zinc-400 text-sm mt-1 font-sans">
                Ecosystem Application Workspace & Unified Launcher Panel
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <div
              onClick={() => router.push("/dashboard")}
              className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:border-amber-500/50 transition-colors"
            >
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-amber-400 font-mono">{wallet.balance} Aros</span>
            </div>
            <Button variant="secondary" onClick={() => router.push("/")} className="px-5">
              Back to Home
            </Button>
          </div>
        </div>

        {/* Console Hub Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Product Selector Navigator */}
          <div className="lg:col-span-1 space-y-6 flex flex-col h-[70vh]">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Ecosystem Products</h2>
              <label htmlFor="prodConsoleFilter" className="sr-only">Filter console products</label>
              <input
                id="prodConsoleFilter"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all border ${
                    selectedCategory === cat
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : "bg-white/2 text-zinc-400 border-transparent hover:text-white hover:border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-white/5">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500 font-mono">No products found.</div>
              ) : (
                filteredProducts.map((prod) => {
                  const isActive = selectedProduct.id === prod.id;
                  const isProdLaunched = launchedStates[prod.id];
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between hover:border-amber-500/30 bg-white/3 ${
                        isActive ? "border-amber-400 shadow-md shadow-amber-500/2" : "border-white/5"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xs font-bold text-white tracking-wide">{prod.name}</h3>
                        <span className={`text-[8px] uppercase font-extrabold px-2 py-0.5 rounded ${
                          prod.requiredTier === "enterprise"
                            ? "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20"
                            : prod.requiredTier === "pro"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-800 text-zinc-400 border border-white/5"
                        }`}>
                          {prod.requiredTier}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-1 mt-1 leading-normal">{prod.description}</p>
                      
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                        <span className="text-[9px] text-zinc-500 font-mono">{prod.version}</span>
                        {isProdLaunched ? (
                          <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="text-[9px] text-zinc-500 font-semibold uppercase">LAUNCH READY</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Console Details & Interactive Sandbox */}
          <div className="lg:col-span-2 bg-white/2 border border-[#ffffff0a] p-6 rounded-2xl h-[70vh] flex flex-col overflow-y-auto scrollbar-thin">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProduct.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex flex-col h-full"
              >
                {/* Header detail */}
                <div className="flex flex-wrap justify-between items-start gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>
                      <span className="text-[9px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {selectedProduct.version}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-normal">
                      Developer: {selectedProduct.author} {selectedProduct.url && `| Sibling Bridge Connected`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Required License:</span>
                    <span className={`text-[10px] uppercase font-extrabold px-3 py-1 rounded-full ${
                      selectedProduct.requiredTier === "enterprise"
                        ? "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20"
                        : selectedProduct.requiredTier === "pro"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-zinc-800 text-zinc-400 border border-white/5"
                    }`}>
                      {selectedProduct.requiredTier.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Verification Check */}
                {!hasTierAccess ? (
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl p-6 space-y-4 my-auto max-w-lg mx-auto text-center">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider">Workspace Blocked: Premium License Required</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      This application requires a **Platform {selectedProduct.requiredTier.toUpperCase()}** license. 
                      Your current level is **{profile.membershipLevel.toUpperCase()}**. You can upgrade immediately by spending **{selectedProduct.price} Aros** tokens from your wallet.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <Button
                        variant="primary"
                        onClick={handleBuyUpgrade}
                        disabled={wallet.balance < selectedProduct.price}
                        className="px-6 py-2.5 text-xs font-semibold"
                      >
                        {wallet.balance < selectedProduct.price ? "Insufficient Balance" : `Purchase License (${selectedProduct.price} Aros)`}
                      </Button>
                      <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-5 py-2.5 text-xs font-semibold">
                        Refill Wallet Balance
                      </Button>
                    </div>
                  </div>
                ) : isLaunched ? (
                  // Active Workspace Widget
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-400">
                      <span className="text-xs font-semibold flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                        Console Workspace Session: {selectedProduct.name}
                      </span>
                      <button
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 border border-white/10 hover:border-white/20 rounded px-2.5 py-1 transition-all"
                        onClick={() => {
                          setLaunchedStates((prev) => ({ ...prev, [selectedProduct.id]: false }));
                          setLaunchLogs((prev) => ({ ...prev, [selectedProduct.id]: [] }));
                        }}
                      >
                        Disconnect Terminal
                      </button>
                    </div>
                    <InteractiveWorkspace productId={selectedProduct.id} />
                  </div>
                ) : (
                  // Welcome & launch triggers
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-white">Application Specifications</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {selectedProduct.longDescription}
                      </p>
                    </div>

                    <div className="space-y-4 mt-auto">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="primary"
                          onClick={() => handleLaunch(selectedProduct.id)}
                          disabled={isLaunching}
                          className="px-8 py-3 text-xs"
                        >
                          {isLaunching ? "Connecting Terminal..." : "Launch Application Workspace"}
                        </Button>

                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          License Active
                        </span>
                      </div>

                      {logs.length > 0 && (
                        <div className="bg-black/80 rounded-xl p-4 border border-white/5 font-mono text-[11px] space-y-2 text-zinc-400">
                          {logs.map((log, idx) => (
                            <div key={idx} className={log.includes("[SUCCESS]") ? "text-emerald-400" : log.includes("[SYSTEM]") ? "text-amber-400" : "text-zinc-300"}>
                              {log}
                            </div>
                          ))}
                          {isLaunching && (
                            <div className="flex items-center gap-2 text-zinc-400 pt-1">
                              <span className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                              Initializing Workspace...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
