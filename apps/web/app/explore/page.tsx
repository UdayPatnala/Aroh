"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, MembershipLevel } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion } from "framer-motion";

export interface ProductDetails {
  id: string;
  name: string;
  badge: string; // Category
  description: string;
  longDescription: string;
  requiredTier: MembershipLevel;
  price: number;
  version: string;
  author: string;
  url?: string;
}

export const registeredProducts: ProductDetails[] = [
  {
    id: "aros-wallet",
    name: "Aros Core Wallet",
    badge: "Core Service",
    description: "Centralized financial engine. Authorizes token credits, debits, and records audited transaction logs.",
    longDescription: "The Aros Core Wallet is the financial baseline of the AROH Platform. It maintains an immutable ledger of transactions, upgrades, and administrative adjustments. Standard user registration initiates a credit of 500 Aros, which users can spend to unlock higher tiers.",
    requiredTier: "basic",
    price: 0,
    version: "v1.0.1",
    author: "AROH Core Team"
  },
  {
    id: "aroh-cms",
    name: "Aroh CMS Alerts",
    badge: "Ecosystem Service",
    description: "Unified announcement server. Enables content operators to schedule notifications and configure layouts.",
    longDescription: "Aroh CMS Alerts provides administrative editors with editorial tools to publish announcements directly to the ecosystem landing page. Features include draft states, categories sorting (info, maintenance, promotions), and scheduled publishing blocks.",
    requiredTier: "pro",
    price: 100,
    version: "v1.0.0",
    author: "AROH Content Team"
  },
  {
    id: "aros-metrics",
    name: "Aros Metrics Engine",
    badge: "Analytics",
    description: "Observation utility. Generates platform statistics, memory charts, and tracks active user journeys.",
    longDescription: "The Aros Metrics Engine aggregates CPU usage, active WebSocket connections, ledger clearance durations, and user journey analytics. Designed for operators running high-traffic SaaS suites, it renders responsive SVG charts and health statuses.",
    requiredTier: "pro",
    price: 100,
    version: "v0.9.4-beta",
    author: "AROH Devops Group"
  },
  {
    id: "aroh-notifier",
    name: "Aroh Notification Center",
    badge: "Ecosystem Service",
    description: "Multi-channel in-app and email alert router. Tracks ledger, auth, and CMS alert notifications.",
    longDescription: "Centralized notification broker for dispatching emails and real-time in-app toasts. Highly customizable through settings, allowing users to select notification streams and quiet hours.",
    requiredTier: "pro",
    price: 100,
    version: "v1.0.0",
    author: "AROH Core Team"
  },
  {
    id: "aros-console",
    name: "Aros Command Console",
    badge: "Developer Service",
    description: "Command-line override portal for system operators and developers. Supports token hooks and diagnostics.",
    longDescription: "A developer console containing standard shell commands, system overrides, database query tools, and diagnostic logs. Unlocks CLI interface controls directly in the browser dashboard.",
    requiredTier: "enterprise",
    price: 500,
    version: "v1.1.0",
    author: "AROH Security Team"
  },
  {
    id: "aroh-ai-helper",
    name: "AROH AI Doc Helper",
    badge: "AI Tools",
    description: "Documentation assistant shell. Indexes prompts and guidelines to accelerate engineer onboarding.",
    longDescription: "An AI-powered document helper indexing the AROH Constitution, engineering standards, and specialized AI prompts. Offers search and code review tips using strict ecosystem parameters.",
    requiredTier: "enterprise",
    price: 500,
    version: "v1.0.0",
    author: "AROH AI Lab"
  },
  {
    id: "nebula",
    name: "Nebula",
    badge: "Ecosystem Service",
    description: "AI-powered personal media intelligence platform for story-driven galleries.",
    longDescription: "Nebula is a personal media intelligence platform for transforming collections of photos and videos into interactive, story-driven galleries. It includes a 5-stage analysis pipeline and ambient gallery builders.",
    requiredTier: "pro",
    price: 200,
    version: "v1.2.0",
    author: "Uday Patnala",
    url: "https://github.com/UdayPatnala/nebula"
  },
  {
    id: "javapath-pro",
    name: "JavaPath Pro",
    badge: "Developer Service",
    description: "Interactive coding sandbox and AI mentor platform to master Java syntax.",
    longDescription: "An interactive full-stack learning platform designed to help junior developers master Java syntax, object-oriented concepts, and enterprise software patterns through a simulated corporate ticketing system.",
    requiredTier: "pro",
    price: 150,
    version: "v1.0.0",
    author: "Uday Patnala",
    url: "https://github.com/UdayPatnala/Java-Path"
  },
  {
    id: "spedex",
    name: "SpeDex",
    badge: "Analytics",
    description: "Fintech speed and spending analytics dashboard for budgets and tracking.",
    longDescription: "SpeDex is a fintech workspace for tracking how fast money moves and where it goes. It blends spending and budget speed indexes into one unified analytics product.",
    requiredTier: "pro",
    price: 300,
    version: "v2.0.0",
    author: "Uday Patnala",
    url: "https://github.com/UdayPatnala/Spedex"
  },
  {
    id: "music-mirror",
    name: "Music Mirror",
    badge: "AI Tools",
    description: "Facial expression mapping and mood-based music recommender player.",
    longDescription: "Emotion Music Recommender reads facial expressions in the browser using face-api.js, maps that mood to play curated tracks inside an embedded player UI.",
    requiredTier: "basic",
    price: 100,
    version: "v1.0.0",
    author: "Uday Patnala",
    url: "https://github.com/UdayPatnala/music-mirror"
  }
];

const categories = ["All", "Core Service", "Ecosystem Service", "Analytics", "Developer Service", "AI Tools"];

export default function ExplorePage() {
  const router = useRouter();
  const { profile, wallet, isAuthenticated } = usePlatformStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredProducts = registeredProducts.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prod.badge === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-10 w-10 object-contain rounded-lg border border-white/10" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                Ecosystem Explorer
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Browse, search, and configure registered applications inside the AROH Platform.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/")} className="px-5">
              Back to Home
            </Button>
            {isAuthenticated && (
              <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-5">
                Dashboard
              </Button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className="flex-1 max-w-md relative">
            <label htmlFor="productSearch" className="sr-only">Search products</label>
            <input
              id="productSearch"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
            />
          </div>

          {/* Categories select or pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-white/5 text-zinc-400 border-white/5 hover:border-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-zinc-400 text-sm">
            No products match your search or category criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const hasTierAccess =
                !isAuthenticated ||
                !profile ||
                prod.requiredTier === "basic" ||
                (prod.requiredTier === "pro" && (profile.membershipLevel === "pro" || profile.membershipLevel === "enterprise")) ||
                (prod.requiredTier === "enterprise" && profile.membershipLevel === "enterprise");

              return (
                <motion.div
                  key={prod.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => router.push(`/explore/${prod.id}`)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/2 transition-all cursor-pointer group"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 rounded text-[8px] uppercase font-extrabold tracking-wider bg-white/5 text-zinc-400 border border-white/5">
                        {prod.badge}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider ${
                          hasTierAccess
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {prod.requiredTier.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">
                      {prod.name}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                      {prod.description}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-mono">{prod.version}</span>
                    <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                      View Details →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
