"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, formatArosBalance } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion, AnimatePresence } from "framer-motion";
import NotificationCenter from "./components/notification-center";

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
              onEnded={handleFinishIntro}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

            <div className="absolute bottom-8 right-8 z-10">
              <button
                type="button"
                onClick={handleFinishIntro}
                className="px-6 py-2 bg-white text-slate-950 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xl hover:bg-slate-100 cursor-pointer"
              >
                Skip Intro ↗
              </button>
            </div>
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
              <img
                src="/aroh-logo.png"
                alt="AROH Official Logo"
                className="h-10 w-10 object-contain rounded-xl shadow-sm border border-black/5"
              />
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
                    variant="primary"
                    onClick={() => router.push("/explore")}
                    className="text-xs px-4 py-2 font-bold bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Explore Hub
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
                  onClick={() => router.push("/login")}
                  className="text-xs px-6 py-2.5 font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                >
                  Sign In
                </Button>
              )}
            </motion.div>
          </div>
        </header>

        {/* Ultra-Clean Light Landing Page Hero with Ambient Logo Rock/Sphere Art */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 space-y-16 relative z-10">
          
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
              className="flex justify-center mb-4 relative"
            >
              <img
                src="/aroh-logo.png"
                alt="AROH Minimalist Geometric Logo"
                className="h-36 w-36 object-contain rounded-3xl p-1 shadow-md bg-white border border-black/5 relative z-10"
              />
            </motion.div>

            <div className="flex items-center justify-center gap-2">
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

            <div className="pt-2 flex justify-center gap-4">
              <Button
                variant="primary"
                onClick={() => router.push("/explore")}
                className="px-8 py-3.5 font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10"
              >
                Explore Ecosystem Products ↗
              </Button>
              <Button
                variant="glass"
                onClick={() => {
                  if (isAuthenticated) {
                    router.push("/dashboard");
                  } else {
                    router.push("/login");
                  }
                }}
                className="px-6 py-3.5 font-semibold text-sm border-slate-300 text-slate-800 hover:bg-slate-100"
              >
                {isAuthenticated ? "My Account" : "Sign In to Workspace"}
              </Button>
            </div>
          </motion.div>

          {/* Live Ecosystem Announcements Stream */}
          <div className="space-y-6 border-t border-black/5 pt-12">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Ecosystem Announcements & Alerts
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Platform updates, scheduled maintenance, and releases.
                </p>
              </div>
            </div>

            {announcements.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-8 bg-white border border-black/5 rounded-2xl shadow-sm">
                No live announcements available.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white border border-black/5 rounded-2xl p-6 hover:border-slate-300 transition-all space-y-3 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[8px] uppercase font-extrabold tracking-wider ${
                          ann.category === "maintenance"
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : ann.category === "promotion"
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : "bg-sky-50 text-sky-600 border border-sky-200"
                        }`}
                      >
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(ann.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Clean Footer */}
        <footer className="border-t border-black/5 px-6 py-8 relative z-10 text-center bg-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/aroh-logo.png" alt="AROH Logo" className="h-6 w-6 object-contain" />
              <span className="font-extrabold text-sm text-slate-900 tracking-widest">AROH PLATFORM</span>
            </div>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} AROH Ecosystem. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
