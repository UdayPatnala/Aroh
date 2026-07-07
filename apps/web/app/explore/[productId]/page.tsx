"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { registeredProducts } from "../page";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, profile, wallet, upgradeMembership, isAuthenticated, isLoading } = usePlatformStore();
  
  const [logs, setLogs] = React.useState<string[]>([]);
  const [isLaunching, setIsLaunching] = React.useState(false);

  const productId = params.productId as string;
  const product = registeredProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-center items-center gap-4">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <Button variant="secondary" onClick={() => router.push("/explore")}>
          Return to Explorer
        </Button>
      </div>
    );
  }

  // Tier access checks
  const hasTierAccess =
    isAuthenticated &&
    profile &&
    (product.requiredTier === "basic" ||
      (product.requiredTier === "pro" && (profile.membershipLevel === "pro" || profile.membershipLevel === "enterprise")) ||
      (product.requiredTier === "enterprise" && profile.membershipLevel === "enterprise"));

  const handleLaunch = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!hasTierAccess) return;

    setIsLaunching(true);
    setLogs(["[SYSTEM] Connecting to AROH Ecosystem core...", "[SYSTEM] Verification of auth token... Verified."]);
    
    setTimeout(() => {
      setLogs((prev) => [...prev, `[INFO] Initializing ${product.name} components...`]);
    }, 800);

    setTimeout(() => {
      setLogs((prev) => [...prev, `[SUCCESS] ${product.name} initialized. Workspace ready.`]);
      setIsLaunching(false);
    }, 1800);
  };

  const handleBuyUpgrade = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      await upgradeMembership(product.requiredTier, product.price);
      alert(`Successfully upgraded to Platform ${product.requiredTier.toUpperCase()} tier.`);
    } catch (err: any) {
      alert(err.message || "Failed to upgrade membership");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation */}
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <Button variant="secondary" onClick={() => router.push("/explore")} className="px-5">
            ← Back to Explore
          </Button>
          {isAuthenticated && (
            <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-5">
              Dashboard
            </Button>
          )}
        </div>

        {/* Product Details Header */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] uppercase font-extrabold tracking-wider text-zinc-400">
                {product.badge}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white leading-none pt-2">
                {product.name}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">Required Tier</span>
              <span className="text-sm font-extrabold uppercase text-amber-400 block tracking-wider mt-1">
                {product.requiredTier}
              </span>
            </div>
          </div>

          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap pt-2 border-t border-white/5">
            {product.longDescription}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-6 text-xs text-zinc-400">
            <div>
              <span className="text-zinc-400 block">Version</span>
              <strong className="text-white block mt-1 font-mono">{product.version}</strong>
            </div>
            <div>
              <span className="text-zinc-400 block">Developer</span>
              <strong className="text-white block mt-1">{product.author}</strong>
            </div>
            <div>
              <span className="text-zinc-400 block">License</span>
              <strong className="text-white block mt-1">Ecosystem SaaS</strong>
            </div>
            <div>
              <span className="text-zinc-400 block">Wallet Price</span>
              <strong className="text-white block mt-1 font-mono text-amber-400">{product.price} Aros</strong>
            </div>
          </div>
        </div>

        {/* Activation Console Panel */}
        <div className="bg-white/3 border border-white/5 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-white">Execution Panel</h2>

          {!isAuthenticated ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center space-y-4">
              <p className="text-sm text-zinc-400">
                You must sign in to your AROH Workspace account to interact with this application.
              </p>
              <Button variant="primary" onClick={() => router.push("/login")} className="px-6 py-2.5">
                Sign In to Workspace
              </Button>
            </div>
          ) : !hasTierAccess ? (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl p-6 space-y-4">
              <h3 className="font-bold text-sm">Lacks Required Membership Level</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                This service requires **Platform {product.requiredTier.toUpperCase()}** access. 
                Your current tier is **Basic**. You can upgrade immediately by spending **{product.price} Aros** tokens from your wallet.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={handleBuyUpgrade}
                  disabled={isLoading || !!(wallet && wallet.balance < product.price)}
                  className="px-6 py-2 text-xs"
                >
                  {wallet && wallet.balance < product.price ? "Insufficient Balance" : `Purchase Upgrade (${product.price} Aros)`}
                </Button>
                <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-5 py-2 text-xs">
                  Refill Balance
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  onClick={handleLaunch}
                  disabled={isLaunching}
                  className="px-8 py-3 text-xs"
                >
                  {isLaunching ? "Launching App..." : "Launch Application"}
                </Button>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  Ecosystem License Active
                </span>
              </div>

              {logs.length > 0 && (
                <div className="bg-black/80 rounded-xl p-5 border border-white/5 font-mono text-[11px] space-y-2 text-zinc-400">
                  {logs.map((log, idx) => (
                    <div key={idx} className={log.includes("[SUCCESS]") ? "text-emerald-400" : log.includes("[SYSTEM]") ? "text-amber-400" : "text-zinc-300"}>
                      {log}
                    </div>
                  ))}
                  {isLaunching && (
                    <div className="flex items-center gap-2 text-zinc-400 pt-1">
                      <span className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Integration Instructions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white border-b border-white/10 pb-3">
            Ecosystem Integration Guides
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 font-mono text-[11px] text-zinc-400 space-y-4 whitespace-pre-wrap leading-relaxed">
            <strong className="text-white text-xs block font-sans">ASDK Client Connection Script</strong>
            {`import { usePlatformStore } from "@aroh/asdk";

const ${product.id.replace(/-/g, "")}Service = {
  initialize: () => {
    const store = usePlatformStore.getState();
    if (!store.isAuthenticated) {
      throw new Error("Ecosystem connection failed - user not authenticated.");
    }
    
    // Mount ${product.name} workspace context
    store.addNotification("Mounted ${product.name} service wrapper", "info");
    return {
      status: "ACTIVE",
      version: "${product.version}",
      userEmail: store.user.email
    };
  }
};`}
          </div>
        </div>
      </div>
    </div>
  );
}
