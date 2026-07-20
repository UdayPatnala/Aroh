"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, MembershipLevel, formatArosBalance } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion } from "framer-motion";

export interface ProductDetails {
  id: string;
  name: string;
  badge: string;
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
    id: "nebula",
    name: "Nebula",
    badge: "Ecosystem Service",
    description: "AI-powered personal media intelligence platform for story-driven galleries.",
    longDescription: "Nebula is a personal media intelligence platform for transforming collections of photos and videos into interactive, story-driven galleries. It includes a 5-stage analysis pipeline and ambient gallery builders.",
    requiredTier: "pro",
    price: 200,
    version: "v1.4.2",
    author: "Uday Patnala",
    url: "https://github.com/UdayPatnala/nebula"
  },
  {
    id: "spedex",
    name: "SpeDex",
    badge: "Analytics",
    description: "Fintech speed and spending analytics dashboard for budgets and tracking.",
    longDescription: "SpeDex is a fintech workspace for tracking how fast money moves and where it goes. It blends spending and budget speed indexes into one unified analytics product.",
    requiredTier: "pro",
    price: 300,
    version: "v2.1.0",
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
    version: "v1.2.0",
    author: "Uday Patnala",
    url: "https://github.com/UdayPatnala/music-mirror"
  },
  {
    id: "javapath-pro",
    name: "JavaPath Pro",
    badge: "Developer Service",
    description: "Interactive coding sandbox and AI mentor platform to master Java syntax.",
    longDescription: "An interactive full-stack learning platform designed to help junior developers master Java syntax, object-oriented concepts, and enterprise software patterns through a simulated corporate ticketing system.",
    requiredTier: "pro",
    price: 150,
    version: "v1.1.0",
    author: "Uday Patnala",
    url: "https://github.com/UdayPatnala/Java-Path"
  },
  {
    id: "aros-wallet",
    name: "Aros Core Wallet",
    badge: "Core Service",
    description: "Centralized financial engine. Authorizes token credits, debits, and records audited transaction logs.",
    longDescription: "The Aros Core Wallet is the financial baseline of the AROH Platform. It maintains an immutable ledger of transactions, upgrades, and administrative adjustments.",
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
    longDescription: "Aroh CMS Alerts provides administrative editors with editorial tools to publish announcements directly to the ecosystem landing page.",
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
    longDescription: "The Aros Metrics Engine aggregates CPU usage, active WebSocket connections, ledger clearance durations, and user journey analytics.",
    requiredTier: "pro",
    price: 100,
    version: "v0.9.4-beta",
    author: "AROH Devops Group"
  }
];

const categories = ["All", "Core Service", "Ecosystem Service", "Analytics", "Developer Service", "AI Tools"];

export default function ExplorePage() {
  const router = useRouter();
  const { user, wallet, isAuthenticated } = usePlatformStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredProducts = registeredProducts.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prod.badge === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLaunchProduct = (prod: ProductDetails) => {
    if (prod.url) {
      window.open(prod.url, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/explore/${prod.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-12 px-6 lg:px-12 bg-mesh-light">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Navigation bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-4">
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-10 w-10 object-contain rounded-xl shadow-sm border border-black/5" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Ecosystem Explorer
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Discover registered applications and platform services in the AROH Ecosystem.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.push("/")} className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50">
              Home
            </Button>
            {isAuthenticated && (
              <div className="bg-white border border-black/10 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-800 shadow-sm">
                {formatArosBalance(wallet?.balance, user?.role)}
              </div>
            )}
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex-1 max-w-md relative">
            <label htmlFor="productSearch" className="sr-only">Search products</label>
            <input
              id="productSearch"
              type="text"
              placeholder="Search products by name or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors text-xs shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white border-slate-900 font-bold"
                    : "bg-white text-slate-600 border-black/5 hover:border-slate-300 hover:text-slate-900 shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-black/5 rounded-2xl p-12 text-center text-slate-400 text-sm shadow-sm">
            No products match your search or category criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleLaunchProduct(prod)}
                className="bg-white border border-black/5 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {prod.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                      {prod.requiredTier.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                    {prod.name}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 font-normal">
                    {prod.description}
                  </p>
                </div>

                <div className="border-t border-black/5 pt-4 mt-6 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">{prod.version}</span>
                  <span className="text-slate-900 group-hover:translate-x-0.5 transition-transform font-bold text-xs">
                    {prod.url ? "Launch Webpage ↗" : "Details →"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
