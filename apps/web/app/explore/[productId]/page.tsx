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

  const productId = params.productId as string;
  const product = registeredProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#06070a] text-white flex flex-col justify-center items-center gap-4">
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

  const handleLaunchProductWebpage = () => {
    if (product.url) {
      window.open(product.url, "_blank", "noopener,noreferrer");
    } else {
      alert(`Launching service interface for ${product.name}.`);
    }
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
    <div className="min-h-screen bg-[#06070a] text-white py-12 px-6 lg:px-12 bg-mesh-logo">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation */}
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-8 w-8 object-contain rounded-lg border border-cyan-500/30" />
            <Button variant="secondary" onClick={() => router.push("/explore")} className="px-4 text-xs">
              ← Back to Explore
            </Button>
          </div>
          {isAuthenticated && (
            <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-4 text-xs">
              Dashboard
            </Button>
          )}
        </div>

        {/* Product Details Header */}
        <div className="bg-zinc-950/80 border border-cyan-500/20 rounded-3xl p-8 space-y-6 shadow-2xl border-logo-glow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                {product.badge}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white leading-none pt-2">
                {product.name}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">Required Access Tier</span>
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
              <span className="text-zinc-500 block">Core Version</span>
              <strong className="text-white block mt-1 font-mono">{product.version}</strong>
            </div>
            <div>
              <span className="text-zinc-500 block">Developer / Maintainer</span>
              <strong className="text-white block mt-1">{product.author}</strong>
            </div>
            <div>
              <span className="text-zinc-500 block">License Strategy</span>
              <strong className="text-white block mt-1">Ecosystem SaaS</strong>
            </div>
            <div>
              <span className="text-zinc-500 block">Tier Upgrade Cost</span>
              <strong className="text-amber-400 block mt-1 font-mono">{product.price} Aros</strong>
            </div>
          </div>
        </div>

        {/* Launch Panel */}
        <div className="bg-zinc-950/60 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-white">Product Execution Gateway</h2>

          {!isAuthenticated ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4">
              <p className="text-sm text-zinc-400">
                Sign in to your AROH Workspace account to authorize and launch this standalone application.
              </p>
              <Button variant="primary" onClick={() => router.push("/login")} className="px-6 py-2.5">
                Sign In to Workspace
              </Button>
            </div>
          ) : !hasTierAccess ? (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm">Tier Access Upgrade Required</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                This service requires **Platform {product.requiredTier.toUpperCase()}** access. 
                Upgrade immediately for **{product.price} Aros** tokens from your wallet.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={handleBuyUpgrade}
                  disabled={isLoading || !!(wallet && wallet.balance < product.price && user?.role !== "admin")}
                  className="px-6 py-2 text-xs"
                >
                  Purchase Upgrade ({product.price} Aros)
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 text-cyan-400">
                <div>
                  <h3 className="font-bold text-base text-white">Standalone Product Ready</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Click launch to open the official webpage directly.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleLaunchProductWebpage}
                  className="px-6 py-3 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Launch Product Webpage ↗
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
