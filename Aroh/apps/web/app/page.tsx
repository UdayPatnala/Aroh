"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  usePlatformStore,
  formatArosBalance,
  resolveShowcaseHierarchy,
  type ProductShowcase,
  getTimelineAnnouncements,
  OFFICIAL_AROH_INSTAGRAM_URL,
  OFFICIAL_COMMUNITY_FEEDBACK_INFO
} from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion, AnimatePresence } from "framer-motion";
import NotificationCenter from "./components/notification-center";
import ArohLogo from "./components/aroh-logo";

export default function HomePage() {
  const router = useRouter();
  const { user, profile, wallet, announcements, isAuthenticated, fetchAnnouncements } = usePlatformStore();

  const [introPlaying, setIntroPlaying] = React.useState(false);

  React.useEffect(() => {
    fetchAnnouncements();
    if (typeof window !== "undefined") {
      const played = sessionStorage.getItem("aroh_intro_played");
      if (played !== "true") {
        setIntroPlaying(true);
      }
    }
  }, [fetchAnnouncements]);

  const handleFinishIntro = () => {
    setIntroPlaying(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("aroh_intro_played", "true");
    }
  };

  return (
    <>
      {/* One-Time Intro Video Overlay (Vanishes completely upon end or skip) */}
      <AnimatePresence>
        {introPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[99999] bg-black flex justify-center items-center overflow-hidden"
          >
            <video
              src="/aroh-intro.mp4"
              autoPlay
              playsInline
              muted
              onEnded={handleFinishIntro}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Ultra-Clean Light Platform Layout */}
      <div className="min-h-screen bg-[#fbfbfa] text-slate-900 flex flex-col justify-between overflow-x-hidden font-sans bg-mesh-light relative">

        {/* Ambient 3D Organic Rock & Orb Elements matching official AROH logo artwork */}
        <div className="absolute top-24 left-8 md:left-24 pointer-events-none opacity-80 z-0">
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-44 rock-pebble-element border border-black/5"
          />
        </div>

        <div className="absolute top-20 right-12 md:right-28 pointer-events-none opacity-80 z-0">
          <motion.div
            animate={{ y: [0, 10, 0], scale: [1, 1.03, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 orb-sphere-element border border-black/5"
          />
        </div>

        {/* Header Bar */}
        <header className="sticky top-0 bg-[#fbfbfa]/90 backdrop-blur-xl border-b border-black/5 px-6 py-4 relative z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            {/* Logo + Sleek Slate Typography */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 cursor-pointer focus-visible:outline-none rounded-xl p-1"
              onClick={() => router.push("/")}
              tabIndex={0}
              aria-label="AROH Platform Home"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") router.push("/");
              }}
            >
              <ArohLogo size={34} />
              <span className="font-extrabold tracking-[0.25em] text-xl text-slate-900 select-none">
                AROH
              </span>
            </motion.div>

            {/* Global Search Trigger */}
            <div
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-black/10 hover:border-sky-500/40 cursor-pointer text-slate-500 transition-colors text-xs w-64 max-w-xs mx-auto shadow-sm focus-visible:outline-none"
              tabIndex={0}
              aria-label="Search alerts, products, and documentation. Press Ctrl K."
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.dispatchEvent(new CustomEvent("open-command-palette"));
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="truncate">Search products, alerts, docs...</span>
              <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded font-mono border border-slate-200 ml-auto text-slate-500 shrink-0">Ctrl K</span>
            </div>

            {/* Header Right Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              {isAuthenticated ? (
                <>
                  <NotificationCenter />
                  <div
                    onClick={() => router.push("/dashboard")}
                    className="bg-white border border-black/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
                    tabIndex={0}
                    aria-label={`Wallet balance: ${formatArosBalance(wallet?.balance, user?.role)}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") router.push("/dashboard");
                    }}
                  >
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      {formatArosBalance(wallet?.balance, user?.role)}
                    </span>
                  </div>

                  <Button
                    variant="glass"
                    onClick={() => router.push("/dashboard")}
                    className="text-xs px-4 py-2 border-slate-200 text-slate-800 hover:bg-slate-100 font-semibold"
                  >
                    Workspace Dashboard
                  </Button>

                  {user?.role === "admin" && (
                    <Button
                      variant="glass"
                      onClick={() => router.push("/admin")}
                      className="text-xs px-3.5 py-2 border-black/10 text-slate-700 hover:bg-slate-100"
                    >
                      Admin
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => router.push("/dashboard")}
                  className="text-xs px-6 py-2.5 font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                >
                  Dashboard
                </Button>
              )}
            </motion.div>
          </div>
        </header>

        {/* Ultra-Clean Light Landing Page Hero with Ambient Logo Rock/Sphere Art */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 pb-28 space-y-16 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-6 relative"
          >
            {/* Official Clean Logo Emblem */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-2 relative"
            >
              <ArohLogo size={96} />
            </motion.div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] uppercase font-bold tracking-widest text-slate-700">
                AI-Native Ecosystem Platform
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
              A Unified Platform for <span className="text-slate-700">Digital Services</span>
            </h1>

            <p className="text-slate-600 text-base leading-relaxed max-w-xl mx-auto font-normal">
              Access software products, manage user identity, check wallet balances, and explore announcements under one unified platform.
            </p>

            <div className="pt-2 pb-6 flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                onClick={() => router.push("/explore")}
                className="px-8 py-3.5 font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10"
              >
                Explore Ecosystem Products ↗
              </Button>
              <Button
                variant="glass"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3.5 font-semibold text-sm border-slate-300 text-slate-800 hover:bg-slate-100"
              >
                Workspace Dashboard
              </Button>
            </div>
          </motion.div>

          {/* ── Featured Products Showcase ── */}
          {(() => {
            const hierarchy = resolveShowcaseHierarchy();
            const { starProduct, featuredProducts, futureLaunchProducts } = hierarchy;
            const showcaseProducts: Array<{ product: ProductShowcase; isStar: boolean; isFuture: boolean }> = [
              { product: starProduct, isStar: true, isFuture: false },
              ...featuredProducts.slice(0, 2).map((p) => ({ product: p, isStar: false, isFuture: false })),
              ...futureLaunchProducts.slice(0, 1).map((p) => ({ product: p, isStar: false, isFuture: true }))
            ];

            return (
              <div className="space-y-5 pt-10 border-t border-black/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-slate-900">Ecosystem Products</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Products you can discover, explore, and use right now.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/explore")}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
                  >
                    View all products →
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Star product — full-width dark card */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => router.push(`/explore/${starProduct.productId}`)}
                    className="relative overflow-hidden bg-slate-900 text-white rounded-2xl p-6 cursor-pointer group hover:ring-2 hover:ring-sky-500/30 transition-all shadow-lg"
                  >
                    <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl" />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                            CURRENT FLAGSHIP
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{starProduct.version}</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-white tracking-tight">{starProduct.name}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-sm">{starProduct.shortDescription}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {starProduct.primaryCapabilities.slice(0, 3).map((cap, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[9px] bg-white/5 border border-white/10 text-slate-300 font-mono">
                              {cap.title}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        {starProduct.liveUrl && (
                          <a
                            href={starProduct.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-sky-50 transition-colors shadow-sm"
                          >
                            Launch App ↗
                          </a>
                        )}
                        <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                          Full details →
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Featured & Future-Launch — 2-col grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...featuredProducts.slice(0, 2), ...futureLaunchProducts.slice(0, 1)].map((prod, i) => {
                      const isFuture = prod.status === "coming-soon";
                      return (
                        <motion.div
                          key={prod.productId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
                          onClick={() => router.push(`/explore/${prod.productId}`)}
                          className={`rounded-2xl p-5 cursor-pointer border transition-all hover:shadow-md group ${
                            isFuture
                              ? "bg-gradient-to-br from-amber-50 to-orange-50/40 border-amber-200/60 hover:border-amber-300"
                              : "bg-white border-black/5 hover:border-slate-300"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                              {isFuture ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <span className="w-1 h-1 rounded-full bg-amber-500" /> FUTURE LAUNCH
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                                </span>
                              )}
                            </div>
                            <h3 className={`text-sm font-bold ${isFuture ? "text-slate-800" : "text-slate-900 group-hover:text-sky-700"} transition-colors`}>
                              {prod.name}
                            </h3>
                            <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{prod.shortDescription}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-black/5 flex justify-between items-center">
                            <span className="text-slate-400 font-mono text-[10px]">{prod.version}</span>
                            <span className={`text-[10px] font-bold ${isFuture ? "text-amber-600" : "text-sky-600"}`}>
                              {isFuture ? "Learn more →" : "Details →"}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── Future of AROH & Ecosystem Roadmap ── */}
          {(() => {
            const timeline = getTimelineAnnouncements();
            const stages = [
              { id: "current", label: "CURRENT (LIVE)", count: timeline.current.length, items: timeline.current, dot: "bg-emerald-500" },
              { id: "inDev", label: "IN DEVELOPMENT", count: timeline.inDevelopment.length, items: timeline.inDevelopment, dot: "bg-amber-500" },
              { id: "comingSoon", label: "COMING SOON", count: timeline.comingSoon.length, items: timeline.comingSoon, dot: "bg-sky-500" },
              { id: "future", label: "FUTURE DIRECTION", count: timeline.future.length, items: timeline.future, dot: "bg-purple-500" }
            ];

            return (
              <div className="space-y-8 border-t border-black/5 pt-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                        What's Coming to AROH
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500">
                      Authoritative roadmap tracking live releases, active developments, and future platform capabilities.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => router.push("/announcements")}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-black/10 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                    >
                      Explore All Updates →
                    </button>
                  </div>
                </div>

                {/* Stage Rail Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stages.map((stage) => (
                    <div key={stage.id} className="bg-white border border-black/5 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${stage.dot}`} />
                            <span className="text-[10px] font-extrabold tracking-wider font-mono text-slate-600">
                              {stage.label}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                            {stage.count}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {stage.items.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => router.push(`/announcements#${item.id}`)}
                              className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/90 border border-black/5 transition-all cursor-pointer group"
                            >
                              <div className="flex items-center justify-between gap-1 text-[9px] font-mono text-slate-400 mb-1">
                                <span className="uppercase font-semibold">{item.type}</span>
                                <span>{item.targetReleaseDate || item.publishDate}</span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {item.shortDescription}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => router.push("/announcements")}
                        className="text-[10px] text-sky-600 font-bold hover:underline pt-2 border-t border-black/5 flex items-center justify-between cursor-pointer"
                      >
                        <span>View category</span>
                        <span>→</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* ── Official Community Feedback / Idea Banner ── */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-md">
                  <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-pink-500/10 blur-2xl" />
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-mono uppercase font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          COMMUNITY IDEAS
                        </span>
                        <span className="text-[10px] text-slate-400">Official Channel</span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {OFFICIAL_COMMUNITY_FEEDBACK_INFO.headline}
                      </h3>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {OFFICIAL_COMMUNITY_FEEDBACK_INFO.contextualCopy}
                      </p>
                    </div>

                    <a
                      href={OFFICIAL_AROH_INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-xs hover:opacity-95 shadow-md shadow-pink-500/20 transition-opacity"
                    >
                      <span>Send suggestion on Instagram</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  </div>
                  <div className="relative z-10 pt-3 mt-3 border-t border-white/10 text-[10px] text-slate-400">
                    Suggestions are reviewed by the community team. Do not send passwords or payment information.
                  </div>
                </div>
              </div>
            );
          })()}
        </main>
      </div>
    </>
  );
}

