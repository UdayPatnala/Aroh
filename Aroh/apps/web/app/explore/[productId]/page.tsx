"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  usePlatformStore,
  getProductById,
  resolveShowcaseHierarchy,
  type ProductShowcase,
  type ProductShowcaseRole,
  getAnnouncementsByProduct
} from "@aroh/asdk";
import { Button } from "@aroh/ads";
import ArohLogo from "../../components/aroh-logo";
import { motion } from "framer-motion";

// ─── Role badge ─────────────────────────────────────────────────────────────
const ROLE_LABELS: Record<ProductShowcaseRole, { label: string; style: string; dotColor: string }> = {
  star:           { label: "Current Flagship", style: "bg-sky-50 text-sky-700 border-sky-200",   dotColor: "bg-sky-500" },
  featured:       { label: "Featured Product", style: "bg-emerald-50 text-emerald-700 border-emerald-200", dotColor: "bg-emerald-500" },
  "future-launch":{ label: "Future Launch",    style: "bg-amber-50 text-amber-700 border-amber-200",       dotColor: "bg-amber-500" },
  standard:       { label: "Ecosystem App",    style: "bg-slate-100 text-slate-600 border-slate-200",      dotColor: "bg-slate-400" },
  internal:       { label: "Internal Service", style: "bg-slate-100 text-slate-500 border-slate-200",      dotColor: "bg-slate-300" }
};

function RoleBadge({ role }: { role: ProductShowcaseRole }) {
  const cfg = ROLE_LABELS[role];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cfg.style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} ${role === "star" ? "animate-pulse" : ""}`} />
      {cfg.label.toUpperCase()}
    </span>
  );
}

// ─── Future Launch Panel ─────────────────────────────────────────────────────
function FutureLaunchPanel({ product }: { product: ProductShowcase }) {
  const [notified, setNotified] = React.useState(false);

  const handleNotify = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`aroh_notify_${product.productId}`, "true");
      setNotified(true);
    }
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setNotified(localStorage.getItem(`aroh_notify_${product.productId}`) === "true");
    }
  }, [product.productId]);

  const roadmapCapabilities = [
    { phase: "Architecture", state: "Complete",     desc: "Core data models, REST API contracts, and IDOR security architecture." },
    { phase: "Backend",      state: "In Progress",  desc: "Spring Boot REST API with JPA, multi-currency ledger, and UPI vendor registry." },
    { phase: "Frontend",     state: "In Progress",  desc: "React + Vite dashboard, trip ledger UI, and spending velocity charts." },
    { phase: "Mobile",       state: "Planned",      desc: "Kotlin Jetpack Compose companion app with real-time mobile sync." },
    { phase: "Launch",       state: "Future",       desc: "Public deployment following internal security review and beta validation." }
  ];

  const stateStyle: Record<string, string> = {
    "Complete":     "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Progress":  "bg-amber-50 text-amber-700 border-amber-200",
    "Planned":      "bg-slate-100 text-slate-600 border-slate-200",
    "Future":       "bg-slate-100 text-slate-500 border-slate-200"
  };

  return (
    <div className="space-y-8">
      {/* Status banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 rounded-3xl p-8">
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role="future-launch" />
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold text-amber-600 bg-amber-50 border border-amber-200">
              {product.category}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{product.name}</h1>
          <p className="text-slate-600 text-sm font-medium">{product.tagline}</p>
          <p className="text-slate-700 text-sm leading-relaxed max-w-prose">{product.shortDescription}</p>

          {/* Actions — only permitted Future Launch actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleNotify}
              disabled={notified}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border cursor-pointer ${
                notified
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default"
                  : "bg-amber-600 text-white hover:bg-amber-700 border-amber-600 shadow-sm"
              }`}
            >
              {notified ? "✓ You'll be notified" : "Notify Me on Launch"}
            </button>
            {product.githubUrl && (
              <a
                href={product.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                View Source Repository ↗
              </a>
            )}
            {product.docsUrl && (
              <a
                href={product.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-500 border border-slate-200 hover:text-slate-700 hover:border-slate-300 transition-colors"
              >
                Docs / README ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Roadmap & build status */}
      <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="border-b border-black/5 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Development Roadmap</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Canonical build phases derived from authoritative source repository.
          </p>
        </div>
        <div className="space-y-4">
          {roadmapCapabilities.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-2 h-2 rounded-full mt-1 ${
                  item.state === "Complete" ? "bg-emerald-500" :
                  item.state === "In Progress" ? "bg-amber-500 animate-pulse" :
                  "bg-slate-300"
                }`} />
                {i < roadmapCapabilities.length - 1 && <div className="w-px h-6 bg-slate-200" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900">{item.phase}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stateStyle[item.state]}`}>
                    {item.state}
                  </span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-5 shadow-sm">
        <div className="border-b border-black/5 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Planned Capabilities</h2>
          <p className="text-slate-400 text-xs mt-0.5 italic">
            Capabilities listed are architecturally designed and sourced from the canonical repository — not yet live.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.primaryCapabilities.map((cap, i) => (
            <div key={i} className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {cap.title}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology stack */}
      <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 border-b border-black/5 pb-4">Architecture & Stack</h2>
        <div className="p-4 rounded-xl bg-slate-50 border border-black/5">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-2">Planned Stack</span>
          <code className="text-xs text-slate-700 font-mono leading-relaxed">{product.technologySummary}</code>
        </div>
      </div>

      {/* Contextual Announcements */}
      {(() => {
        const productAnnouncements = getAnnouncementsByProduct(product.productId);
        if (productAnnouncements.length === 0) return null;
        return (
          <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-black/5 pb-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Ecosystem Announcements</h2>
                <p className="text-slate-500 text-xs mt-0.5">Authoritative development bulletins for this product.</p>
              </div>
              <a
                href="/announcements"
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
              >
                View all updates →
              </a>
            </div>
            <div className="space-y-3">
              {productAnnouncements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl bg-slate-50 border border-black/5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        {ann.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{ann.publishDate}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ann.shortDescription}</p>
                  </div>
                  <a
                    href={`/announcements#${ann.id}`}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors shadow-sm inline-block text-center"
                  >
                    Read Details →
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Available Product Panel ─────────────────────────────────────────────────
function AvailableProductPanel({
  product,
  role
}: {
  product: ProductShowcase;
  role: ProductShowcaseRole;
}) {
  const { user, profile, wallet, upgradeMembership, isAuthenticated, isLoading } = usePlatformStore();
  const router = useRouter();

  const hasTierAccess =
    isAuthenticated &&
    profile &&
    (product.requiredTier === "basic" ||
      (product.requiredTier === "pro" && (profile.membershipLevel === "pro" || profile.membershipLevel === "enterprise")) ||
      (product.requiredTier === "enterprise" && profile.membershipLevel === "enterprise") ||
      user?.role === "admin");

  const handleLaunch = () => {
    if (!product.liveUrl) return;
    if (product.liveUrl.startsWith("http")) {
      window.open(product.liveUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push(product.liveUrl);
    }
  };

  const handleGithub = () => product.githubUrl && window.open(product.githubUrl, "_blank", "noopener,noreferrer");
  const handleDocs = () => product.docsUrl && window.open(product.docsUrl, "_blank", "noopener,noreferrer");

  const handleUpgrade = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    try {
      await upgradeMembership(product.requiredTier, product.price);
      alert(`Successfully upgraded to Platform ${product.requiredTier.toUpperCase()} tier.`);
    } catch (err: any) {
      alert(err.message || "Failed to upgrade membership");
    }
  };

  const isOnline = product.status === "online";

  return (
    <div className="space-y-8">
      {/* Hero card */}
      <div className={`relative overflow-hidden rounded-3xl p-8 md:p-10 shadow-sm ${
        role === "star"
          ? "bg-slate-900 text-white border border-slate-800"
          : "bg-white border border-black/5"
      }`}>
        {role === "star" && (
          <>
            <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-slate-700/20 blur-2xl" />
          </>
        )}

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role={role} />
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold border ${
              role === "star" ? "text-slate-400 bg-slate-800 border-slate-700" : "text-slate-500 bg-slate-100 border-slate-200"
            }`}>
              {product.category}
            </span>
            {isOnline && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE DEPLOYMENT
              </span>
            )}
          </div>

          <div>
            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight leading-tight ${role === "star" ? "text-white" : "text-slate-900"}`}>
              {product.name}
            </h1>
            <p className={`text-sm font-medium mt-1.5 ${role === "star" ? "text-slate-400" : "text-slate-500"}`}>
              {product.tagline}
            </p>
          </div>

          <p className={`text-sm leading-relaxed max-w-prose ${role === "star" ? "text-slate-300" : "text-slate-700"}`}>
            {product.longDescription}
          </p>

          {/* Metadata row */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-xs ${
            role === "star" ? "border-white/10" : "border-black/5"
          }`}>
            {[
              { label: "Version", value: product.version },
              { label: "Author", value: product.author },
              { label: "Tier", value: product.requiredTier.toUpperCase() },
              { label: "Ecosystem Cost", value: product.price > 0 ? `${product.price} Aros` : "Free" }
            ].map(({ label, value }) => (
              <div key={label}>
                <span className={`block ${role === "star" ? "text-slate-500" : "text-slate-400"}`}>{label}</span>
                <strong className={`block mt-0.5 font-mono text-sm ${role === "star" ? "text-white" : "text-slate-900"}`}>{value}</strong>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className={`flex flex-wrap gap-3 pt-4 border-t ${role === "star" ? "border-white/10" : "border-black/5"}`}>
            {product.liveUrl && (
              <button
                type="button"
                onClick={handleLaunch}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm cursor-pointer ${
                  role === "star"
                    ? "bg-white text-slate-900 hover:bg-sky-50"
                    : "bg-slate-900 text-white hover:bg-sky-700"
                }`}
              >
                Launch App ↗
              </button>
            )}
            {product.githubUrl && (
              <button
                type="button"
                onClick={handleGithub}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                  role === "star"
                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                    : "bg-white text-slate-800 border border-black/10 hover:bg-slate-50"
                }`}
              >
                GitHub Source ↗
              </button>
            )}
            {product.docsUrl && (
              <button
                type="button"
                onClick={handleDocs}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                  role === "star"
                    ? "text-slate-400 hover:text-white border border-white/5 hover:border-white/20"
                    : "text-slate-500 border border-slate-200 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                Docs ↗
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-5 shadow-sm">
        <div className="border-b border-black/5 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Key Capabilities</h2>
          <p className="text-slate-500 text-xs mt-0.5">Verified from authoritative source documentation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.primaryCapabilities.map((cap, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-50/60 border border-black/5 space-y-2 hover:border-slate-300 transition-colors">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                {cap.title}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology stack */}
      <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-4 shadow-sm">
        <div className="border-b border-black/5 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Technology & Architecture</h2>
          <p className="text-slate-500 text-xs mt-0.5">Verified engineering stack.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-black/5">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Stack</span>
          <code className="text-xs text-slate-800 font-mono leading-relaxed">{product.technologySummary}</code>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {product.technologySummary.split(",").map((t, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono">
              {t.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Membership / access */}
      {isAuthenticated && (
        <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-5 shadow-sm">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Access & Membership</h2>
          {!hasTierAccess ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-amber-900">Tier Upgrade Required</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This product requires <strong>Platform {product.requiredTier.toUpperCase()}</strong> access.
                Upgrade for <strong>{product.price} Aros</strong> tokens.
              </p>
              <Button
                variant="primary"
                onClick={handleUpgrade}
                disabled={isLoading || !!(wallet && wallet.balance < product.price && user?.role !== "admin")}
                className="px-6 py-2 text-xs bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
              >
                Purchase Upgrade ({product.price} Aros)
              </Button>
            </div>
          ) : (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Access Authorized
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Your membership ({profile?.membershipLevel?.toUpperCase() || "ADMIN"}) fulfills the requirements.
                </p>
              </div>
              {product.liveUrl && (
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Launch App ↗
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Contextual Announcements */}
      {(() => {
        const productAnnouncements = getAnnouncementsByProduct(product.productId);
        if (productAnnouncements.length === 0) return null;
        return (
          <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-black/5 pb-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Ecosystem Announcements</h2>
                <p className="text-slate-500 text-xs mt-0.5">Authoritative development bulletins for this product.</p>
              </div>
              <a
                href="/announcements"
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
              >
                View all updates →
              </a>
            </div>
            <div className="space-y-3">
              {productAnnouncements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl bg-slate-50 border border-black/5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        {ann.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{ann.publishDate}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ann.shortDescription}</p>
                  </div>
                  <a
                    href={`/announcements#${ann.id}`}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors shadow-sm inline-block text-center"
                  >
                    Read Details →
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Provenance */}
      <div className="bg-slate-50 border border-black/5 rounded-2xl p-6 text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap justify-between items-center gap-2 font-mono text-[10px]">
          <span>Provenance: <strong className="text-slate-700">{product.sourceOfTruth}</strong></span>
          <span>Last Verified: <strong className="text-slate-700">{new Date(product.lastVerified).toLocaleDateString()}</strong></span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <strong>Independent Product Invariant:</strong> Products in the AROH ecosystem are independently owned
          and versioned. The AROH showcase layer presents verified metadata without mutating product source trees.
        </p>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = usePlatformStore();

  const productId = params?.productId as string;
  const product: ProductShowcase | undefined = getProductById(productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] text-slate-900 flex flex-col justify-center items-center gap-4 px-6">
        <ArohLogo size={48} />
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Not Found</h1>
        <p className="text-slate-500 text-sm text-center max-w-md">
          The requested product ID <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">{productId}</code> is not in the canonical AROH showcase registry.
        </p>
        <Button variant="secondary" onClick={() => router.push("/explore")} className="mt-2 text-xs">
          Return to Explore
        </Button>
      </div>
    );
  }

  const hierarchy = resolveShowcaseHierarchy();
  const role = hierarchy.getRole(productId);
  const isFutureLaunch = role === "future-launch";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-[#fbfbfa] text-slate-900 py-10 px-4 sm:px-6 lg:px-12 bg-mesh-light"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb nav */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={() => router.push("/")} title="AROH Home">
              <ArohLogo size={30} />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="hover:text-slate-800 cursor-pointer" onClick={() => router.push("/explore")}>
                Explorer
              </span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">{product.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/explore")}
              className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50 cursor-pointer shadow-sm"
            >
              ← Back to Explore
            </Button>
            {isAuthenticated && (
              <Button
                variant="glass"
                onClick={() => router.push("/dashboard")}
                className="px-4 text-xs bg-slate-100 text-slate-800 border-slate-200 cursor-pointer"
              >
                Dashboard
              </Button>
            )}
          </div>
        </div>

        {/* Render future launch or available product view — driven by canonical role */}
        {isFutureLaunch
          ? <FutureLaunchPanel product={product} />
          : <AvailableProductPanel product={product} role={role} />
        }
      </div>
    </motion.div>
  );
}
