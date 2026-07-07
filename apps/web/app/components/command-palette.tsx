"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";
import { AnimatePresence, motion } from "framer-motion";
import { registeredProducts } from "../explore/page";
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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: PaletteItem[] = React.useMemo(() => {
    const list: PaletteItem[] = [
      { id: "nav-home", name: "Go to Homepage", category: "Navigation", action: () => { router.push("/"); setIsOpen(false); } },
      { id: "nav-dash", name: "Go to Dashboard", category: "Navigation", action: () => { router.push("/dashboard"); setIsOpen(false); } },
      { id: "nav-explore", name: "Explore Product Registry", category: "Navigation", action: () => { router.push("/explore"); setIsOpen(false); } },
      { id: "nav-ai", name: "Open AROH AI Hub", category: "Navigation", action: () => { router.push("/ai"); setIsOpen(false); } },
    ];

    if (isAuthenticated && user?.role === "admin") {
      list.push({ id: "nav-admin", name: "Open Admin Console", category: "Administrative Tools", action: () => { router.push("/admin"); setIsOpen(false); } });
    }
    if (isAuthenticated && (user?.role === "admin" || user?.role === "operator")) {
      list.push({ id: "nav-cms", name: "Open CMS Alerts Manager", category: "Administrative Tools", action: () => { router.push("/cms"); setIsOpen(false); } });
    }

    // Add registered products
    registeredProducts.forEach((p) => {
      list.push({
        id: `prod-${p.id}`,
        name: `Open ${p.name}`,
        category: "Products & Documentation",
        action: () => { router.push(`/explore/${p.id}`); setIsOpen(false); }
      });
    });

    // Add CMS announcements
    announcements.forEach((ann) => {
      list.push({
        id: `ann-${ann.id}`,
        name: `Alert: ${ann.title}`,
        category: `CMS Announcements`,
        action: () => { router.push("/"); setIsOpen(false); }
      });
    });

    // Add Documentation
    mockDocDatabase.forEach((doc) => {
      list.push({
        id: `doc-${doc.keyword.replace(/\s+/g, "-")}`,
        name: `Doc: ${doc.title}`,
        category: "Ecosystem Documentation",
        action: () => { router.push(`/ai?query=${encodeURIComponent(doc.keyword)}`); setIsOpen(false); }
      });
    });

    if (isAuthenticated) {
      list.push({
        id: "nav-logout",
        name: "Sign Out of Workspace",
        category: "Account Action",
        action: () => { logout(); router.push("/login"); setIsOpen(false); }
      });
    }

    return list;
  }, [isAuthenticated, user, router, logout, announcements]);

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
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />

          {/* Palette Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-96 pointer-events-auto"
          >
            {/* Input query field */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <label htmlFor="commandPaletteInput" className="sr-only">Type a command to search</label>
              <input
                id="commandPaletteInput"
                ref={inputRef}
                type="text"
                placeholder="Search command or navigate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-0 text-white placeholder-zinc-500 focus:outline-none text-xs"
              />
              <span className="text-[9px] uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400 font-mono">
                ESC
              </span>
            </div>

            {/* Suggestions list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 text-xs font-mono">
                  No matching shortcuts found.
                </div>
              ) : (
                Object.entries(
                  filteredItems.reduce((acc, curr) => {
                    if (!acc[curr.category]) acc[curr.category] = [];
                    acc[curr.category].push(curr);
                    return acc;
                  }, {} as Record<string, PaletteItem[]>)
                ).map(([category, catItems]) => (
                  <div key={category} className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 px-3 py-2 block">
                      {category}
                    </span>
                    {catItems.map((item) => {
                      // find index in absolute filtered list
                      const absoluteIndex = filteredItems.findIndex((fi) => fi.id === item.id);
                      const isSelected = absoluteIndex === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          className={`px-3 py-2.5 rounded-lg text-xs flex justify-between items-center cursor-pointer transition-colors ${
                            isSelected ? "bg-amber-500/10 text-amber-400 font-medium" : "text-zinc-300 hover:bg-white/2"
                          }`}
                        >
                          <span>{item.name}</span>
                          {isSelected && (
                            <span className="text-[10px] text-amber-500 font-mono">⏎ ENTER</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer tips */}
            <div className="p-3 border-t border-white/5 bg-black/40 text-[9px] text-zinc-400 flex justify-between font-mono">
              <span>Use arrows ↑↓ to navigate</span>
              <span>Press ⏎ to trigger</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
