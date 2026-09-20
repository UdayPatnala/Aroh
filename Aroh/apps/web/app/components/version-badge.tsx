"use client";

import * as React from "react";
import { PLATFORM_VERSION, PLATFORM_VERSION_INFO } from "@aroh/asdk";

export default function VersionBadge() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`v${PLATFORM_VERSION}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={popoverRef}
      className="fixed bottom-4 right-4 z-40 print:hidden select-none"
      aria-label={`Platform Version ${PLATFORM_VERSION}`}
    >
      {/* Popover Details Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Platform Version Details"
          className="absolute bottom-full right-0 mb-2 w-72 bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-4 shadow-xl text-slate-800 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-black/5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Version Governance</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200/60">
              {PLATFORM_VERSION_INFO.status}
            </span>
          </div>

          <div className="space-y-2 font-sans">
            <div className="flex items-baseline justify-between">
              <span className="text-slate-500 text-[11px]">Authoritative Version</span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                v{PLATFORM_VERSION}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-slate-500 text-[11px]">Release Milestone</span>
              <span className="font-medium text-slate-700 text-right truncate max-w-[150px]" title={PLATFORM_VERSION_INFO.releaseName}>
                {PLATFORM_VERSION_INFO.releaseName}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-slate-500 text-[11px]">Format Tier</span>
              <span className="font-mono text-slate-600 text-[11px]">
                {PLATFORM_VERSION_INFO.major}.{String(PLATFORM_VERSION_INFO.subVersion).padStart(2, "0")}.{String(PLATFORM_VERSION_INFO.functional).padStart(2, "0")}.{PLATFORM_VERSION_INFO.patch}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-slate-500 text-[11px]">Git Baseline</span>
              <span className="font-mono text-slate-600 text-[11px]">
                {PLATFORM_VERSION_INFO.commit}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-slate-500 text-[11px]">Build Date</span>
              <span className="text-slate-600 text-[11px]">
                {PLATFORM_VERSION_INFO.buildDate}
              </span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy v{PLATFORM_VERSION}</span>
                </>
              )}
            </button>

            <a
              href="/docs"
              className="text-[11px] text-sky-600 hover:text-sky-800 font-medium transition-colors"
            >
              Ledger Specs &rarr;
            </a>
          </div>
        </div>
      )}

      {/* Unobtrusive Floating Trigger Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        title={`AROH Platform v${PLATFORM_VERSION} (${PLATFORM_VERSION_INFO.status}) — Click to view details`}
        className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all duration-200 cursor-pointer shadow-xs ${
          isOpen
            ? "bg-slate-900 text-white shadow-md ring-2 ring-slate-900/20"
            : "bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-black/10 hover:border-black/20 hover:shadow-sm backdrop-blur-md"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            PLATFORM_VERSION_INFO.status === "VERIFIED"
              ? "bg-emerald-500 group-hover:animate-ping"
              : "bg-amber-500"
          }`}
        />
        <span>v{PLATFORM_VERSION}</span>
      </button>
    </div>
  );
}
