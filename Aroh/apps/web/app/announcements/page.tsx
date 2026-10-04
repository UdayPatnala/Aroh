"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  getAllAnnouncements,
  getFeaturedAnnouncements,
  getTimelineAnnouncements,
  EcosystemAnnouncement,
  AnnouncementStatus,
  AnnouncementType,
  OFFICIAL_AROH_INSTAGRAM_URL,
  OFFICIAL_COMMUNITY_FEEDBACK_INFO
} from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion, AnimatePresence } from "framer-motion";
import ArohLogo from "../components/aroh-logo";

const STATUS_CONFIG: Record<
  AnnouncementStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  RELEASED: {
    label: "RELEASED",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500"
  },
  IN_DEVELOPMENT: {
    label: "IN DEVELOPMENT",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500"
  },
  ANNOUNCED: {
    label: "COMING SOON",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500"
  },
  UPCOMING: {
    label: "FUTURE DIRECTION",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500"
  },
  ARCHIVED: {
    label: "ARCHIVED",
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
    dot: "bg-slate-400"
  }
};

export default function AnnouncementsPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [activeModal, setActiveModal] = React.useState<EcosystemAnnouncement | null>(null);

  const allAnnouncements = React.useMemo(() => getAllAnnouncements(), []);
  const featuredAnnouncements = React.useMemo(() => getFeaturedAnnouncements(), []);
  const timeline = React.useMemo(() => getTimelineAnnouncements(), []);

  const filteredAnnouncements = React.useMemo(() => {
    return allAnnouncements.filter((ann) => {
      if (selectedStatus !== "all" && ann.status !== selectedStatus) return false;
      if (selectedType !== "all" && ann.type !== selectedType) return false;
      return true;
    });
  }, [allAnnouncements, selectedStatus, selectedType]);

  const handleOpenDetail = (ann: EcosystemAnnouncement) => {
    setActiveModal(ann);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-10 px-4 sm:px-6 lg:px-12 bg-mesh-light">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <ArohLogo size={36} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Future Developments & Roadmap
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  ECOSYSTEM UPDATES
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Authoritative communication on upcoming products, releases, and platform capabilities.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/")}
              className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50 cursor-pointer shadow-sm"
            >
              Home
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/explore")}
              className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50 cursor-pointer shadow-sm"
            >
              Explore Products
            </Button>
            <a
              href={OFFICIAL_AROH_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-sm hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
            >
              <span>Suggest on Instagram</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </div>

        {/* ── Featured Spotlight ── */}
        {featuredAnnouncements.length > 0 && (
          <section aria-label="Featured Developments">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Key Developments Spotlight
              </h2>
              <span className="flex-1 h-px bg-black/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredAnnouncements.slice(0, 2).map((item) => {
                const cfg = STATUS_CONFIG[item.status];
                const isFutureOnly = item.type === "FUTURE";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => handleOpenDetail(item)}
                    className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-7 shadow-lg border border-slate-800 flex flex-col justify-between cursor-pointer group hover:ring-2 hover:ring-sky-500/30 transition-all"
                  >
                    <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl" />
                    <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                          {cfg.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.targetReleaseDate || item.publishDate}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                          {item.shortDescription}
                        </p>
                      </div>

                      {isFutureOnly && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] text-slate-300">
                          <span className="font-bold text-amber-300">Future Capability Exploration:</span>{" "}
                          Subject to platform authorization and legal verification. Not currently available.
                        </div>
                      )}
                    </div>

                    <div className="relative z-10 pt-5 mt-4 border-t border-white/10 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-mono text-[10px] uppercase">
                        Type: {item.type}
                      </span>
                      <span className="text-sky-400 font-bold text-[11px] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        Read Details →
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Filter Controls ── */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-black/5 text-xs">
              {[
                { id: "all", label: "All Updates" },
                { id: "RELEASED", label: "🟢 Live / Released" },
                { id: "IN_DEVELOPMENT", label: "🟡 In Development" },
                { id: "ANNOUNCED", label: "🔵 Coming Soon" },
                { id: "UPCOMING", label: "🟣 Future Direction" }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedStatus === s.id
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Type selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-mono">Category:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-slate-400 cursor-pointer shadow-sm"
              >
                <option value="all">All Categories</option>
                <option value="PRODUCT">Products</option>
                <option value="FEATURE">Features</option>
                <option value="ECOSYSTEM">Ecosystem</option>
                <option value="FUTURE">Future Concepts</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Announcements Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map((ann) => {
            const cfg = STATUS_CONFIG[ann.status];
            const isFutureConcept = ann.type === "FUTURE";

            return (
              <motion.div
                key={ann.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleOpenDetail(ann)}
                className="bg-white border border-black/5 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{ann.publishDate}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                      {ann.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-3">
                      {ann.shortDescription}
                    </p>
                  </div>

                  {ann.targetReleaseDate && (
                    <div className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-md inline-block">
                      Timeline: <strong>{ann.targetReleaseDate}</strong>
                    </div>
                  )}

                  {isFutureConcept && (
                    <div className="text-[10px] font-sans text-amber-700 bg-amber-50/80 border border-amber-200/80 px-2.5 py-1 rounded-md">
                      ⚠️ Future exploration — not currently active
                    </div>
                  )}
                </div>

                <div className="border-t border-black/5 pt-4 mt-5 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">{ann.type}</span>
                  <span className="text-sky-600 font-bold text-[11px] group-hover:underline">
                    View Update →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Official Community Feedback / Idea Section ── */}
        <section
          aria-label="Community Suggestions"
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-700 space-y-6"
        >
          <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                OFFICIAL COMMUNITY FEEDBACK CHANNEL
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {OFFICIAL_COMMUNITY_FEEDBACK_INFO.headline}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {OFFICIAL_COMMUNITY_FEEDBACK_INFO.contextualCopy}
              </p>
              <p className="text-slate-400 text-xs italic">
                {OFFICIAL_COMMUNITY_FEEDBACK_INFO.disclosureNotice}
              </p>
            </div>

            <div className="shrink-0 flex flex-col gap-3">
              <a
                href={OFFICIAL_AROH_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-pink-500/20 transition-opacity"
              >
                <span>{OFFICIAL_COMMUNITY_FEEDBACK_INFO.ctaLabel}</span>
                <span className="text-xs">↗</span>
              </a>
              <span className="text-[10px] text-slate-400 text-center font-mono">
                @aroh.0s on Instagram
              </span>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-slate-400">
            <strong>Security & Privacy Reminder:</strong> Instagram DMs are for product ideas and general feedback. Never share passwords, payment card numbers, or session credentials.
          </div>
        </section>

        {/* ── Detail Modal ── */}
        <AnimatePresence>
          {activeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-black/10 space-y-5 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${STATUS_CONFIG[activeModal.status].bg} ${STATUS_CONFIG[activeModal.status].text} ${STATUS_CONFIG[activeModal.status].border}`}
                    >
                      {STATUS_CONFIG[activeModal.status].label}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {activeModal.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 text-lg"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p className="font-semibold text-slate-800 text-sm">
                    {activeModal.shortDescription}
                  </p>
                  <p className="whitespace-pre-wrap">{activeModal.fullDescription}</p>

                  {activeModal.type === "FUTURE" && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                      <strong>Future Architecture Status:</strong>
                      <p>
                        This concept is modeled under AROH architectural governance. No live checkout, conversion, or payment execution exists on this website.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-black/5 pt-4 flex flex-wrap justify-between items-center gap-3">
                  <div className="text-[10px] text-slate-400 font-mono">
                    Published: {activeModal.publishDate}
                    {activeModal.targetReleaseDate && ` · Target: ${activeModal.targetReleaseDate}`}
                  </div>
                  <div className="flex items-center gap-2">
                    {activeModal.cta && activeModal.ctaUrl && !activeModal.ctaUrl.startsWith("#") && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          if (activeModal.ctaUrl?.startsWith("http")) {
                            window.open(activeModal.ctaUrl, "_blank", "noopener,noreferrer");
                          } else if (activeModal.ctaUrl) {
                            router.push(activeModal.ctaUrl);
                          }
                          setActiveModal(null);
                        }}
                        className="px-4 py-2 text-xs font-bold"
                      >
                        {activeModal.cta}
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 text-xs"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
