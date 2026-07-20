"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";
import { motion, AnimatePresence } from "framer-motion";

interface DockItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  visible: boolean;
}

export default function GlassDock() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isRehydrated } = usePlatformStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isRehydrated) return null;

  const isAdmin = user?.role === "admin";
  const isOperator = user?.role === "admin" || user?.role === "operator";

  const items: DockItem[] = [
    {
      id: "home",
      label: "Home",
      path: "/",
      visible: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: "explore",
      label: "Explore",
      path: "/explore",
      visible: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      )
    },
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      visible: isAuthenticated,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: "console",
      label: "Console",
      path: "/products",
      visible: isAuthenticated,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      id: "cms",
      label: "CMS",
      path: "/cms",
      visible: isAuthenticated && isOperator,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      id: "admin",
      label: "Admin",
      path: "/admin",
      visible: isAuthenticated && isAdmin,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: "login",
      label: "Sign In",
      path: "/login",
      visible: !isAuthenticated,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      )
    }
  ];

  const visibleItems = items.filter((item) => item.visible);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="bg-white/90 backdrop-blur-2xl border border-black/10 px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5"
      >
        {visibleItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <div key={item.id} className="relative group">
              <button
                type="button"
                onClick={() => router.push(item.path)}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                aria-label={item.label}
              >
                {item.icon}
              </button>

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                {item.label}
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
