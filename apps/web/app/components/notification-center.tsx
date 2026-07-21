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
        className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors bg-white border border-black/10 rounded-xl hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer shadow-sm"
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
            className="absolute right-0 mt-2 w-80 bg-white border border-black/10 rounded-2xl shadow-xl overflow-hidden z-[100]"
          >
            {/* Header */}
            <div className="p-4 border-b border-black/5 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">System Alerts</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-sky-600 font-semibold hover:underline cursor-pointer focus-visible:outline-none"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-black/5">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-mono">
                  No alerts in this session.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 flex gap-3 text-xs hover:bg-slate-50 transition-colors ${
                      !n.read ? "bg-slate-50/50" : ""
                    }`}
                  >
                    {/* Status Icon indicator */}
                    <div className="shrink-0 mt-0.5">
                      {n.type === "success" ? (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full block" />
                      ) : n.type === "warning" ? (
                        <span className="w-2 h-2 bg-rose-500 rounded-full block" />
                      ) : (
                        <span className="w-2 h-2 bg-sky-500 rounded-full block" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className={`leading-normal ${!n.read ? "text-slate-900 font-semibold" : "text-slate-600"}`}>
                        {n.message}
                      </p>
                      <span className="text-[9px] text-slate-400 block font-mono">
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
