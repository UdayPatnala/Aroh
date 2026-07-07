"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion } from "framer-motion";
import NotificationCenter from "./components/notification-center";

interface Product {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

const products: Product[] = [
  {
    id: "p1",
    name: "Aros Core Wallet",
    description: "Centralized financial engine. Authorizes token credits, debits, and records audited transaction logs.",
    badge: "Core Service"
  },
  {
    id: "p2",
    name: "Aroh CMS Alerts",
    description: "Unified announcement server. Enables content operators to schedule notifications and configure layouts.",
    badge: "Ecosystem Service"
  },
  {
    id: "p3",
    name: "Aros Metrics Engine",
    description: "Observation utility. Generates platform statistics, memory charts, and tracks active user journeys.",
    badge: "Analytics"
  }
];

export default function HomePage() {
  const router = useRouter();
  const { user, profile, wallet, announcements, isAuthenticated, fetchAnnouncements } = usePlatformStore();

  React.useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleNavToDashboard = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02),transparent_60%)] pointer-events-none" />

      {/* Header Bar */}
      <header className="sticky top-0 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 relative z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            onClick={() => router.push("/")}
            tabIndex={0}
            aria-label="Aroh Platform Home"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                router.push("/");
              }
            }}
          >
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-8 w-8 object-contain rounded-md border border-white/10" />
            <img src="/aroh-text.png" alt="AROH Wordmark" className="h-5 object-contain hidden sm:block" />
            <span className="font-extrabold tracking-widest text-sm bg-gradient-to-r from-amber-400 via-yellow-100 to-amber-500 bg-clip-text text-transparent sm:hidden">
              AROH
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Signed in as</span>
                  <span className="text-xs font-bold text-white">{profile?.displayName}</span>
                </div>
                <NotificationCenter />
                <div
                  onClick={() => router.push("/dashboard")}
                  className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:border-amber-500/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  tabIndex={0}
                  aria-label={`Wallet balance: ${wallet?.balance} Aros. View Dashboard.`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") router.push("/dashboard");
                  }}
                >
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-amber-400 font-mono">{wallet?.balance} Aros</span>
                </div>
                <Button
                  variant="glass"
                  onClick={handleNavToDashboard}
                  className="text-xs px-4 py-2 focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  My Account
                </Button>
                {user?.role === "admin" && (
                  <Button
                    variant="primary"
                    onClick={() => router.push("/admin")}
                    className="text-xs px-4 py-2 focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    Admin
                  </Button>
                )}
                {(user?.role === "admin" || user?.role === "operator") && (
                  <Button
                    variant="secondary"
                    onClick={() => router.push("/cms")}
                    className="text-xs px-4 py-2 focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    CMS
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => router.push("/login")}
                className="text-xs px-5 py-2 focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Sign In
              </Button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-16 space-y-16 relative z-10">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-6"
        >
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest text-amber-400">
            Phase 1 MVP Live
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            A Unified Ecosystem of Digital Services
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Configure accounts, manage digital assets, upgrade memberships, and interact with all AROH apps using our secure, ledged Aros economy.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Button
              variant="primary"
              onClick={handleNavToDashboard}
              className="px-6 py-3 font-semibold text-sm focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Enter Workspace
            </Button>
            <Button
              variant="glass"
              onClick={() => router.push("/login")}
              className="px-6 py-3 font-semibold text-sm focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Create Profile
            </Button>
          </div>
        </motion.div>

        {/* Intro Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-md p-2 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
            <video
              src="/aroh-intro.mp4"
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              aria-label="Official AROH Introduction Video"
            />
          </div>
        </motion.div>

        {/* Dynamic announcements grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-3 text-white">
            Ecosystem Announcements
          </h2>
          {announcements.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-4 bg-white/2 border border-white/5 rounded-xl">
              No live updates available.
            </p>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {announcements.map((ann) => (
                <motion.div
                  key={ann.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="bg-white/3 border border-white/5 rounded-xl p-5 hover:border-white/20 hover:bg-white/5 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] uppercase font-extrabold tracking-wider ${
                          ann.category === "maintenance"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : ann.category === "promotion"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(ann.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{ann.title}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                      {ann.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Product Catalog */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-3 text-white">
            Ecosystem Product Index
          </h2>
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {products.map((prod) => (
              <motion.div
                key={prod.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNavToDashboard}
                tabIndex={0}
                aria-label={`Open product: ${prod.name}. ${prod.description}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleNavToDashboard();
                }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/2 transition-all group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 group-hover:text-amber-400 transition-colors">
                      {prod.badge}
                    </span>
                    <span className="text-xs text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open →
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{prod.name}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{prod.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 relative z-10 text-center">
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} AROH Ecosystem. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
