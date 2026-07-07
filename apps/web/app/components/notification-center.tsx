"use client";

import * as React from "react";
import { usePlatformStore } from "@aroh/asdk";
import { AnimatePresence, motion } from "framer-motion";

export default function NotificationCenter() {
  const { notifications, markNotificationsAsRead } = usePlatformStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark as read after opening or when viewing
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markNotificationsAsRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 border border-white/5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
        aria-label={`System Alerts. ${unreadCount} unread.`}
      >
        {/* Simple SVG Bell Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Floating Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-zinc-900/95 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-[100]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">System Alerts</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-amber-500 hover:underline cursor-pointer focus-visible:outline-none"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 text-xs font-mono">
                  No alerts in this session.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 flex gap-3 text-xs hover:bg-white/2 transition-colors ${
                      !n.read ? "bg-white/[0.01]" : ""
                    }`}
                  >
                    {/* Status Icon indicator */}
                    <div className="shrink-0 mt-0.5">
                      {n.type === "success" ? (
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full block" />
                      ) : n.type === "warning" ? (
                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full block" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full block" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className={`leading-normal ${!n.read ? "text-white font-medium" : "text-zinc-400"}`}>
                        {n.message}
                      </p>
                      <span className="text-[9px] text-zinc-400 block font-mono">
                        {new Date(n.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
