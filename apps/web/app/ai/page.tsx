"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@aroh/ads";

// Internal doc DB — exported for command palette search only
export const mockDocDatabase = [
  {
    keyword: "wallet",
    title: "AROS Wallet",
    content: "Your AROS wallet holds your platform credits. Credits can be earned through platform activity and used to access premium features and services within the AROH ecosystem."
  },
  {
    keyword: "products",
    title: "Ecosystem Products",
    content: "AROH hosts a curated suite of digital products and services. Visit the Explore section to discover available products and their access requirements."
  },
  {
    keyword: "membership",
    title: "Membership Tiers",
    content: "AROH offers tiered membership plans. Higher tiers unlock additional products, higher wallet limits, and priority support. Upgrade from your Dashboard."
  },
  {
    keyword: "announcements",
    title: "Platform Announcements",
    content: "Stay up to date with the latest platform news, product launches, and maintenance notifications on your home feed."
  },
  {
    keyword: "dashboard",
    title: "Your Dashboard",
    content: "The Dashboard gives you a complete view of your account — wallet balance, membership tier, transaction history, and active product access."
  }
];

export default function AiPortalPage() {
  const router = useRouter();
  const [docQuery, setDocQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<typeof mockDocDatabase>([]);
  const [searched, setSearched] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get("query");
      if (queryParam) {
        setDocQuery(queryParam);
        const results = mockDocDatabase.filter((doc) =>
          doc.keyword.includes(queryParam.toLowerCase()) ||
          doc.title.toLowerCase().includes(queryParam.toLowerCase()) ||
          doc.content.toLowerCase().includes(queryParam.toLowerCase())
        );
        setSearchResults(results);
        setSearched(true);
      }
    }
  }, []);

  const handleDocSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docQuery.trim()) {
      setSearchResults([]);
      setSearched(false);
      return;
    }
    const term = docQuery.toLowerCase();
    const results = mockDocDatabase.filter((doc) =>
      doc.keyword.includes(term) ||
      doc.title.toLowerCase().includes(term) ||
      doc.content.toLowerCase().includes(term)
    );
    setSearchResults(results);
    setSearched(true);
  };

  const faqs = [
    { q: "How do I earn AROS credits?", a: "Credits are awarded through platform participation, product usage milestones, and special promotional events." },
    { q: "How do I upgrade my membership?", a: "Go to your Dashboard and tap 'Upgrade Membership'. Select a tier and confirm — the upgrade applies instantly." },
    { q: "Which products are available to me?", a: "Visit the Explore page. Products you can access are clearly marked. Some require a higher membership tier." },
    { q: "How do I check my wallet balance?", a: "Your balance is visible at the top of your Dashboard. All transactions are logged in the transaction history below." },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-12 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-10 w-10 object-contain rounded-xl shadow-sm border border-black/5" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Help & Information</h1>
              <p className="text-slate-500 text-xs mt-0.5">Search platform info, FAQs, and guides</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => router.push("/")} className="px-5 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50">
            ← Back to Home
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Search Platform Help</h2>
          <form onSubmit={handleDocSearch} className="flex gap-2">
            <label htmlFor="aiSearchQuery" className="sr-only">Search help topics</label>
            <input
              id="aiSearchQuery"
              type="text"
              placeholder="e.g. wallet, membership, products..."
              value={docQuery}
              onChange={(e) => setDocQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-black/8 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 text-sm transition-colors"
            />
            <Button type="submit" variant="primary" className="px-5">
              Search
            </Button>
          </form>

          <AnimatePresence mode="wait">
            {searched && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="space-y-3 pt-2"
              >
                {searchResults.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4">No results found. Try "wallet" or "membership".</p>
                ) : (
                  searchResults.map((res) => (
                    <div key={res.keyword} className="bg-slate-50 border border-black/5 rounded-xl p-4 space-y-1">
                      <strong className="text-slate-800 text-sm block">{res.title}</strong>
                      <p className="text-slate-500 text-xs leading-relaxed">{res.content}</p>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm space-y-2"
              >
                <p className="text-sm font-semibold text-slate-800">{faq.q}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 pb-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
            My Dashboard →
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push("/explore")}>
            Explore Products →
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            Home Feed →
          </Button>
        </div>

      </div>
    </div>
  );
}
