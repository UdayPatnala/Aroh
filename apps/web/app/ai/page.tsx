"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion, AnimatePresence } from "framer-motion";

interface PromptTemplate {
  name: string;
  role: string;
  description: string;
  content: string;
}

export const mockDocDatabase = [
  {
    keyword: "single source of truth",
    title: "SSOT (Single Source of Truth) Principle",
    content: "All business state, configuration declarations, and schema logic must be authored and managed in one authoritative repository layer (ASDK/Backend). Client applications must consume Zustand state slices or API endpoints, avoiding duplicate local structures to prevent drift."
  },
  {
    keyword: "ledger",
    title: "Aros Wallet Economy Ledger Rules",
    content: "All wallet balance credits and debits must be logged using immutable transaction rows. Direct overwriting of balance integer properties is prohibited. In Firestore, write access on /wallets is set to false, forcing all wallet transactions to run on Next.js server endpoints."
  },
  {
    keyword: "backend authority",
    title: "Backend as the Authority Principle",
    content: "The client-side web browser is treated as entirely untrusted. All input bounds checking, membership verification, and transactional validations must be executed on the Next.js API layer. Client routes only manage interface states."
  },
  {
    keyword: "monorepo",
    title: "Monorepo Workspace Layout",
    content: "AROH monorepo is governed via npm workspaces. Layout divides apps (e.g. apps/web) from packages. Visual design systems are bundled under packages/ads, while Firestore models and centralized state stores are isolated under packages/asdk."
  }
];

const promptTemplates: PromptTemplate[] = [
  {
    name: "Frontend Developer Prompt",
    role: "UI Engineer Specialist",
    description: "Configures visual layouts using Outfit fonts, amber/zinc tailwind palettes, and framer-motion micro-interactions.",
    content: `You are the AROH Frontend Engineer. Build interfaces using Next.js App Router and Zustand stores. Focus on rich visual aesthetics (dark zinc backdrops #0a0a0c, amber gradients, glassmorphism card modules). Maintain strict decoupling between logic (packages/asdk) and UI (packages/ads). Add appropriate htmlFor and id bindings to ensure WCAG AA compliance.`
  },
  {
    name: "Security Auditor Prompt",
    role: "Penetration tester Specialist",
    description: "Secures database scopes, validates JWT signatures, and audits RBAC permissions gates.",
    content: `You are the AROH Security Engineer. Audit all database rules and route clearances. Ensure firestore.rules blocks direct client modifications to wallets or user roles. Verify all API endpoints decode cryptographically signed Firebase ID tokens or verifyMockToken signatures before completing database mutations.`
  },
  {
    name: "Ecosystem QA Prompt",
    role: "Automation QA Specialist",
    description: "Validates integration sequences, mock DB storage, and membership tier clearances.",
    content: `You are the AROH QA Specialist. Run test pipelines to check auth states, transaction records, and upgrade restrictions. Ensure insufficient balance upgrades throw expected exceptions. Run tests using 'node scripts/test-sdk.js' to verify SDK stability.`
  }
];

export default function AiPortalPage() {
  const router = useRouter();
  const { addNotification } = usePlatformStore();
  
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
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

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    addNotification("Prompt template copied to clipboard", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img src="/aroh-logo.png?v=2" alt="AROH Logo" className="h-10 w-10 object-contain rounded-lg border border-white/10" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                AROH AI Hub
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Ecosystem AI configurations, specialized prompts, and developer documentation assistant.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/")} className="px-5">
              Back to Home
            </Button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">AI Platform Architecture</span>
            <h2 className="text-2xl font-bold text-white leading-tight">Shared AI Service Foundation</h2>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Phase 1 establishes the AI configuration standards, specialized engineering prompt libraries, and diagnostic helpers. 
              Ecosystem application templates use structured prompts to ensure new UI panels or APIs match AROH Constitution directives.
            </p>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 text-[11px] text-zinc-400 font-mono">
              [CONFIG] ShareContext = TRUE<br />
              [CONFIG] ModelFallback = GEMINI_MEDIUM<br />
              [CONFIG] StrictComplianceEnforcement = STRICT
            </div>
          </div>

          {/* Interactive Documentation Helper QA */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">Ecosystem Assistant</span>
              <h2 className="text-2xl font-bold text-white leading-tight">AI Documentation Helper</h2>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Query key technical specifications or core principles (e.g. "ledger", "monorepo", "single source of truth", "backend authority").
              </p>
            </div>

            <form onSubmit={handleDocSearch} className="flex gap-2">
              <label htmlFor="aiSearchQuery" className="sr-only">Query documentation</label>
              <input
                id="aiSearchQuery"
                type="text"
                placeholder="Query database..."
                value={docQuery}
                onChange={(e) => setDocQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-xs"
              />
              <Button type="submit" className="px-4 py-2.5 text-xs font-semibold">
                Search
              </Button>
            </form>

            <AnimatePresence mode="wait">
              {searched && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/40 rounded-xl border border-white/5 p-4 space-y-3 text-xs"
                >
                  {searchResults.length === 0 ? (
                    <p className="text-zinc-400 text-center font-mono">No matching principles found. Try "ledger" or "authority".</p>
                  ) : (
                    searchResults.map((res) => (
                      <div key={res.keyword} className="space-y-1">
                        <strong className="text-amber-400 block font-sans">{res.title}</strong>
                        <p className="text-zinc-400 text-[11px] leading-normal">{res.content}</p>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Prompts Library */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-white border-b border-white/10 pb-3">
            Specialized Prompt Engineering Library
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promptTemplates.map((pr, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/20 transition-colors">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-zinc-400">
                      {pr.role}
                    </span>
                    <Button
                      variant="glass"
                      onClick={() => handleCopy(pr.content, idx)}
                      className="px-2.5 py-1 text-[10px]"
                    >
                      {copiedIndex === idx ? "Copied" : "Copy Template"}
                    </Button>
                  </div>
                  <h3 className="text-lg font-bold text-white">{pr.name}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{pr.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 bg-black/30 rounded-lg p-3 max-h-32 overflow-y-auto font-mono text-[9px] text-zinc-400">
                  {pr.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
