"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";
import { AnimatePresence, motion } from "framer-motion";
import { registeredProducts, launchProductWebpage } from "../explore/page";
import { mockDocDatabase } from "../ai/page";

interface PaletteItem {
  id: string;
  name: string;
  category: string;
  action: () => void;
}

export default function CommandPalette() {
  const router = useRouter();
  const { user, isAuthenticated, logout, announcements, fetchAnnouncements } = usePlatformStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      fetchAnnouncements();
    }
  }, [isOpen, fetchAnnouncements]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenEvent);
    };
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const isAdmin = isAuthenticated && user?.role === "admin";
  const isOperator = isAuthenticated && (user?.role === "admin" || user?.role === "operator");

  const items: PaletteItem[] = React.useMemo(() => {
    const list: PaletteItem[] = [
      { id: "nav-home", name: "Go to Homepage", category: "Navigation", action: () => { router.push("/"); setIsOpen(false); } },
      { id: "nav-explore", name: "Explore Product Registry", category: "Navigation", action: () => { router.push("/explore"); setIsOpen(false); } },
    ];

    if (isAuthenticated) {
      list.push({ id: "nav-dash", name: "Go to Dashboard", category: "Navigation", action: () => { router.push("/dashboard"); setIsOpen(false); } });
      list.push({ id: "nav-products", name: "Products Workspace", category: "Navigation", action: () => { router.push("/products"); setIsOpen(false); } });
    }

    // Admin & Operator routes — ONLY added for privileged accounts, completely invisible otherwise
    if (isAdmin) {
      list.push({ id: "nav-admin", name: "Admin Console", category: "Platform Management", action: () => { router.push("/admin"); setIsOpen(false); } });
    }
    if (isOperator) {
      list.push({ id: "nav-cms", name: "CMS Alerts Manager", category: "Platform Management", action: () => { router.push("/cms"); setIsOpen(false); } });
    }

    // Products — internal-only products hidden from standard users
    registeredProducts.forEach((p) => {
      if (p.internalOnly && !isOperator) return;
      list.push({
        id: `prod-${p.id}`,
        name: p.name,
        category: "Products",
        action: () => {
          launchProductWebpage(p, router);
          setIsOpen(false);
        }
      });
    });

    // Announcements — visible to all
    announcements.forEach((ann) => {
      list.push({
        id: `ann-${ann.id}`,
        name: ann.title,
        category: "Announcements",
        action: () => { router.push("/"); setIsOpen(false); }
      });
    });

    // Documentation
    mockDocDatabase.forEach((doc) => {
      list.push({
        id: `doc-${doc.keyword.replace(/\s+/g, "-")}`,
        name: doc.title,
        category: "Documentation",
        action: () => { router.push(`/ai?query=${encodeURIComponent(doc.keyword)}`); setIsOpen(false); }
      });
    });

    if (isAuthenticated) {
      list.push({
        id: "nav-logout",
        name: "Sign Out",
        category: "Account",
        action: () => { logout(); router.push("/"); setIsOpen(false); }
      });
    }

    return list;
  }, [isAuthenticated, isAdmin, isOperator, user, router, logout, announcements]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm pointer-events-auto"
          />

          {/* Palette Box — light theme */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg bg-white border border-black/8 rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden flex flex-col h-80 pointer-events-auto"
          >
            {/* Input */}
            <div className="p-4 border-b border-black/5 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <label htmlFor="commandPaletteInput" className="sr-only">Search or navigate</label>
              <input
                id="commandPaletteInput"
                ref={inputRef}
                type="text"
                placeholder="Search products, announcements, pages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-0 text-slate-900 placeholder-slate-400 focus:outline-none text-xs"
              />
              <span className="text-[9px] uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-500 font-mono shrink-0">
                ESC
              </span>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No results found.
                </div>
              ) : (
                Object.entries(
                  filteredItems.reduce((acc, curr) => {
                    if (!acc[curr.category]) acc[curr.category] = [];
                    acc[curr.category].push(curr);
                    return acc;
                  }, {} as Record<string, PaletteItem[]>)
                ).map(([category, catItems]) => (
                  <div key={category} className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
                      {category}
                    </span>
                    {catItems.map((item) => {
                      const absoluteIndex = filteredItems.findIndex((fi) => fi.id === item.id);
                      const isSelected = absoluteIndex === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          className={`px-3 py-2 rounded-lg text-xs flex justify-between items-center cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-slate-900 text-white font-semibold"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>{item.name}</span>
                          {isSelected && (
                            <span className="text-[10px] text-white/60 font-mono">⏎</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-black/5 bg-slate-50 text-[9px] text-slate-400 flex justify-between font-mono">
              <span>↑↓ navigate</span>
              <span>⏎ select · ESC close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
