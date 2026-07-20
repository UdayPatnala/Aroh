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
  const [videoMuted, setVideoMuted] = React.useState(true);

  React.useEffect(() => {
    fetchAnnouncements();
    if (typeof window !== "undefined") {
      const played = sessionStorage.getItem("aroh_intro_played");
      if (played !== "true") {
        setIntroPlaying(true);
      }
    }
  }, [fetchAnnouncements]);

  const handleSkipIntro = () => {
    setIntroPlaying(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("aroh_intro_played", "true");
    }
  };

  const handleReplayIntro = () => {
    setVideoMuted(false);
    setIntroPlaying(true);
  };

  return (
    <>
      {/* Full-Screen Immersive Intro Video Overlay */}
      <AnimatePresence>
        {introPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[99999] bg-[#050508] flex justify-center items-center overflow-hidden"
          >
            <video
              src="/aroh-intro.mp4"
              autoPlay
              playsInline
              muted={videoMuted}
              onEnded={handleSkipIntro}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            <div className="absolute bottom-8 right-8 flex items-center gap-3 z-10">
              <button
                type="button"
                onClick={() => setVideoMuted(!videoMuted)}
                className="px-4 py-2.5 bg-black/70 hover:bg-black/90 border border-white/20 hover:border-amber-400 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-400 transition-all backdrop-blur-md cursor-pointer shadow-xl"
              >
                {videoMuted ? "Unmute Sound 🔊" : "Mute Sound 🔇"}
              </button>
              <button
                type="button"
                onClick={handleSkipIntro}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 cursor-pointer"
              >
                Skip Intro ↗
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Landing Page Structure */}
      <div className="min-h-screen bg-[#08080a] text-white flex flex-col justify-between overflow-x-hidden font-sans bg-mesh-gold">
        {/* Ambient Radial Mesh Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,158,11,0.05),transparent_60%)] pointer-events-none" />

        {/* Clean Header Bar */}
        <header className="sticky top-0 bg-[#08080a]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            {/* Logo + Clean Metallic Gold Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl p-1"
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
                className="h-10 w-10 object-contain rounded-xl border border-amber-500/30 shadow-md shadow-amber-500/10"
              />
              <span className="font-extrabold tracking-[0.25em] text-xl text-gradient-gold select-none">
                AROH
              </span>
            </motion.div>

            {/* Global Search shortcut */}
            <div
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-amber-500/40 cursor-pointer text-zinc-400 transition-colors text-xs w-64 max-w-xs mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              tabIndex={0}
              aria-label="Search alerts, products, and documentation. Press Ctrl K."
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.dispatchEvent(new CustomEvent("open-command-palette"));
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="truncate">Search alerts, products, docs...</span>
              <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded font-mono border border-white/10 ml-auto text-zinc-400 shrink-0">Ctrl K</span>
            </div>

            {/* Header Right Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <button
                type="button"
                onClick={handleReplayIntro}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-amber-500/30 hover:border-amber-400 text-xs font-semibold text-amber-400 transition-colors cursor-pointer"
              >
                <span>Replay Intro</span>
                <span className="text-[10px]">🎬</span>
              </button>

              {isAuthenticated ? (
                <>
                  <NotificationCenter />
                  <div
                    onClick={() => router.push("/dashboard")}
                    className="bg-zinc-900 border border-amber-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer hover:border-amber-400 transition-colors"
                    tabIndex={0}
                    aria-label={`Wallet balance: ${formatArosBalance(wallet?.balance, user?.role)}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") router.push("/dashboard");
                    }}
                  >
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {formatArosBalance(wallet?.balance, user?.role)}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => router.push("/explore")}
                    className="text-xs px-4 py-2 font-bold"
                  >
                    Explore Hub
                  </Button>

                  {user?.role === "admin" && (
                    <Button
                      variant="glass"
                      onClick={() => router.push("/admin")}
                      className="text-xs px-3.5 py-2"
                    >
                      Admin
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => router.push("/login")}
                  className="text-xs px-6 py-2.5 font-bold"
                >
                  Sign In
                </Button>
              )}
            </motion.div>
          </div>
        </header>

        {/* Ultra-Clean Landing Page Hero (No Product Cards front clutter) */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 space-y-20 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <img
                src="/aroh-logo.png"
                alt="AROH Official Ecosystem Emblem"
                className="h-28 w-28 object-contain rounded-3xl border border-amber-500/40 shadow-2xl shadow-amber-500/20 p-2 bg-zinc-950/90 border-gold-glow"
              />
            </motion.div>

            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] uppercase font-bold tracking-widest text-amber-400">
                AI-Native Ecosystem Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
              A Unified Platform for <span className="text-gradient-gold">Digital Services</span>
            </h1>

            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Configure accounts, access registered software products, manage digital assets, and upgrade memberships under one unified identity and ledger foundation.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                onClick={() => router.push("/explore")}
                className="px-8 py-3.5 font-bold text-sm shadow-xl shadow-amber-500/20 focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Explore Ecosystem Products ↗
              </Button>
              <Button
                variant="glass"
                onClick={handleReplayIntro}
                className="px-6 py-3.5 font-bold text-sm text-amber-400 border-amber-500/30 hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Watch Intro Video 🎬
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  if (isAuthenticated) {
                    router.push("/dashboard");
                  } else {
                    router.push("/login");
                  }
                }}
                className="px-6 py-3.5 font-semibold text-sm focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                {isAuthenticated ? "My Account" : "Sign In to Workspace"}
              </Button>
            </div>
          </motion.div>

          {/* Live CMS Announcements & Updates Stream */}
          <div className="space-y-6 border-t border-white/10 pt-12">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Ecosystem Announcements & Alerts
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Live updates, maintenance notices, and platform releases.
                </p>
              </div>
            </div>

            {announcements.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-8 bg-zinc-950/60 border border-white/5 rounded-2xl">
                No live announcements available.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-zinc-950/80 border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all space-y-3 shadow-lg"
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[8px] uppercase font-extrabold tracking-wider ${
                          ann.category === "maintenance"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : ann.category === "promotion"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(ann.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{ann.title}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 px-6 py-8 relative z-10 text-center bg-zinc-950/90">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/aroh-logo.png" alt="AROH Logo" className="h-6 w-6 object-contain" />
              <span className="font-extrabold text-sm text-gradient-gold tracking-widest">AROH PLATFORM</span>
            </div>
            <p className="text-xs text-zinc-400">
              © {new Date().getFullYear()} AROH Ecosystem. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
