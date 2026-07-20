"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, formatArosBalance } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion } from "framer-motion";
import NotificationCenter from "./components/notification-center";

interface FlagshipProduct {
  id: string;
  name: string;
  badge: string;
  description: string;
  url: string;
  version: string;
}

const flagshipProducts: FlagshipProduct[] = [
  {
    id: "nebula",
    name: "Nebula",
    badge: "AI Media Intelligence",
    description: "AI-powered personal media canvas for story-driven galleries and multi-stage analysis pipelines.",
    url: "https://github.com/UdayPatnala/nebula",
    version: "v1.4.2"
  },
  {
    id: "spedex",
    name: "SpeDex",
    badge: "Fintech Speed Analytics",
    description: "Real-time logistics and monetary flow engine blending spending velocity indexes into unified analytics.",
    url: "https://github.com/UdayPatnala/Spedex",
    version: "v2.1.0"
  },
  {
    id: "music-mirror",
    name: "Music Mirror",
    badge: "Facial Mood Recommender",
    description: "Facial expression mapping engine reading emotions in real-time to curate mood-based music playlists.",
    url: "https://github.com/UdayPatnala/music-mirror",
    version: "v1.2.0"
  },
  {
    id: "javapath-pro",
    name: "JavaPath Pro",
    badge: "Developer Education",
    description: "Interactive JVM sandbox and Java syntax progression engine with corporate ticketing simulations.",
    url: "https://github.com/UdayPatnala/Java-Path",
    version: "v1.1.0"
  }
];

export default function HomePage() {
  const router = useRouter();
  const { user, profile, wallet, announcements, isAuthenticated, fetchAnnouncements } = usePlatformStore();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(true);

  React.useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLaunchProduct = (url: string) => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-white flex flex-col justify-between overflow-x-hidden font-sans bg-mesh-logo">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(6,182,212,0.06),transparent_60%)] pointer-events-none" />

      {/* Header Bar */}
      <header className="sticky top-0 bg-[#06070a]/90 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4 relative z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl p-1"
            onClick={() => router.push("/")}
            tabIndex={0}
            aria-label="AROH Platform Home"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") router.push("/");
            }}
          >
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-10 w-10 object-contain rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10" />
            <span className="font-extrabold tracking-[0.25em] text-xl text-gradient-logo">
              AROH
            </span>
          </motion.div>

          {/* Global search trigger */}
          <div
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-cyan-500/40 cursor-pointer text-zinc-400 transition-colors text-xs w-64 max-w-xs mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            tabIndex={0}
            aria-label="Search alerts, products, and documentation. Press Ctrl K."
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.dispatchEvent(new CustomEvent("open-command-palette"));
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="truncate">Search products, docs, alerts...</span>
            <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded font-mono border border-white/10 ml-auto text-zinc-400 shrink-0">Ctrl K</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs uppercase select-none">
                    {profile?.displayName?.charAt(0) || "U"}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-semibold">Signed in as</span>
                    <span className="text-xs font-bold text-white leading-none">{profile?.displayName}</span>
                  </div>
                </div>

                <NotificationCenter />

                <div
                  onClick={() => router.push("/dashboard")}
                  className="bg-zinc-900/90 border border-amber-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer hover:border-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-sm"
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
                  className="text-xs px-4 py-2 font-bold focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  Explore Hub
                </Button>

                {user?.role === "admin" && (
                  <Button
                    variant="glass"
                    onClick={() => router.push("/admin")}
                    className="text-xs px-3.5 py-2 focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    Admin
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => router.push("/login")}
                className="text-xs px-6 py-2.5 font-bold focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                Sign In
              </Button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 space-y-16 relative z-10">
        
        {/* Hero Section with Official AROH Logo */}
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
            className="flex justify-center mb-4"
          >
            <img
              src="/aroh-logo.png"
              alt="AROH Official Ecosystem Logo"
              className="h-28 w-28 object-contain rounded-3xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 p-2 bg-zinc-950/80 border-logo-glow"
            />
          </motion.div>

          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] uppercase font-extrabold tracking-widest text-cyan-400">
              AI-Native Ecosystem Platform
            </span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight leading-tight text-white">
            A Unified Platform for <span className="text-gradient-logo">Digital Applications</span>
          </h1>

          <p className="text-zinc-400 text-base leading-relaxed max-w-xl mx-auto">
            Access, launch, and manage standalone software products through a centralized identity, security, and ledger foundation.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Button
              variant="primary"
              onClick={() => router.push("/explore")}
              className="px-6 py-3 font-bold text-sm focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              Explore Products ↗
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
              className="px-6 py-3 font-semibold text-sm focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {isAuthenticated ? "My Account" : "Get Started"}
            </Button>
          </div>
        </motion.div>

        {/* Seamless Video Showcase Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Ecosystem Experience Video
            </h2>
            <div className="flex gap-2">
              <button
                onClick={togglePlay}
                className="px-3 py-1 bg-zinc-900 border border-white/10 hover:border-cyan-500/40 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                {isPlaying ? "Pause Video" : "Play Video"}
              </button>
              <button
                onClick={toggleMute}
                className="px-3 py-1 bg-zinc-900 border border-white/10 hover:border-cyan-500/40 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? "Unmute Sound" : "Mute Sound"}
              </button>
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-cyan-500/20 bg-zinc-950 shadow-2xl shadow-cyan-500/10 border-logo-glow">
            <video
              ref={videoRef}
              src="/aroh-intro.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center pointer-events-none">
              <span className="text-xs font-bold text-white/80 font-mono tracking-wider">
                AROH Ecosystem Platform Introduction
              </span>
              <span className="text-[10px] bg-black/60 border border-white/10 px-2.5 py-1 rounded-full text-cyan-400 font-mono font-bold">
                1080p HD
              </span>
            </div>
          </div>
        </motion.div>

        {/* Flagship Standalone Products Catalog (Redirects directly to Product Webpages) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Flagship Products Directory
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Click any product to launch its official standalone webpage.
              </p>
            </div>
            <Button variant="glass" onClick={() => router.push("/explore")} className="text-xs px-4 py-2">
              View All Products
            </Button>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {flagshipProducts.map((prod) => (
              <motion.div
                key={prod.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleLaunchProduct(prod.url)}
                tabIndex={0}
                aria-label={`Launch product webpage for ${prod.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleLaunchProduct(prod.url);
                }}
                className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-md">
                      {prod.badge}
                    </span>
                    <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Launch Webpage ↗
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{prod.description}</p>
                </div>
                <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                  <span>Version: {prod.version}</span>
                  <span className="text-emerald-400">STATUS: ONLINE</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Live Announcements grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-3 text-white">
            Ecosystem Alerts & Announcements
          </h2>
          {announcements.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-4 bg-zinc-950/40 border border-white/5 rounded-xl">
              No live updates available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-zinc-950/50 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] uppercase font-extrabold tracking-wider ${
                        ann.category === "maintenance"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : ann.category === "promotion"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}
                    >
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-zinc-500">
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
      <footer className="border-t border-white/10 px-6 py-8 relative z-10 text-center bg-zinc-950/80">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-6 w-6 object-contain" />
            <span className="font-extrabold text-sm text-gradient-logo tracking-widest">AROH ECOSYSTEM</span>
          </div>
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} AROH Platform. All product cores owned by respective developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
