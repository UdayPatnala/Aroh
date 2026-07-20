"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, Announcement, AnnouncementCategory } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import NotificationCenter from "../components/notification-center";

const formatForDateTimeLocal = (dateString?: string) => {
  const date = dateString ? new Date(dateString) : new Date();
  if (isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

export default function CmsPage() {
  const router = useRouter();
  const { user, allAnnouncements, fetchAllAnnouncements, upsertAnnouncement, deleteAnnouncement, isAuthenticated, isRehydrated } =
    usePlatformStore();

  const [id, setId] = React.useState<string | undefined>(undefined);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<AnnouncementCategory>("info");
  const [isPublished, setIsPublished] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [publishedAt, setPublishedAt] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setPublishedAt(formatForDateTimeLocal());
  }, []);

  React.useEffect(() => {
    if (!isRehydrated) return;
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchAllAnnouncements();
    }
  }, [isAuthenticated, isRehydrated, router, fetchAllAnnouncements]);

  const hasAccess = user?.role === "admin" || user?.role === "operator";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const pubDateIso = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();
      await upsertAnnouncement({
        id,
        title,
        content,
        category,
        isPublished,
        publishedAt: pubDateIso
      });
      // Reset form
      setId(undefined);
      setTitle("");
      setContent("");
      setCategory("info");
      setIsPublished(true);
      setPublishedAt(formatForDateTimeLocal());
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to save announcement");
    }
  };

  const handleEdit = (ann: Announcement) => {
    setId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setCategory(ann.category);
    setIsPublished(ann.isPublished);
    setPublishedAt(formatForDateTimeLocal(ann.publishedAt));
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await deleteAnnouncement(id);
    } catch (err: any) {
      alert(err.message || "Failed to delete announcement");
    }
  };

  if (!isRehydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06070a] flex justify-center items-center text-white">
        <span className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#06070a] flex flex-col justify-center items-center text-white p-6 bg-mesh-logo">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-3xl max-w-md text-center space-y-4 shadow-2xl">
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-xs text-zinc-400">
            This module requires CMS Operator or Administrator privileges.
          </p>
          <Button variant="primary" onClick={() => router.push("/")} className="px-6 py-2.5">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070a] text-white py-12 px-6 lg:px-12 bg-mesh-logo">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-10 w-10 object-contain rounded-xl border border-cyan-500/30" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient-logo">
                AROH CMS Editorial Hub
              </h1>
              <p className="text-zinc-400 text-xs mt-0.5">
                Create, schedule, and publish announcements across the AROH Platform.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <Button variant="secondary" onClick={() => router.push("/")} className="px-4 text-xs">
              Home
            </Button>
            <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-4 text-xs">
              Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Announcement Editor Form */}
          <div className="lg:col-span-1 bg-zinc-950/80 border border-cyan-500/20 p-6 rounded-3xl h-fit space-y-6 border-logo-glow">
            <h2 className="text-xl font-bold tracking-tight text-white">
              {isEditing ? "Edit Announcement" : "Publish Announcement"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="cmsTitle" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Announcement Title
                </label>
                <input
                  id="cmsTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled System Upgrade"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 text-xs"
                  required
                />
              </div>

              <div>
                <label htmlFor="cmsCategory" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Category
                </label>
                <select
                  id="cmsCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 text-xs"
                >
                  <option value="info">Info</option>
                  <option value="promotion">Promotion</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label htmlFor="cmsPublishedAt" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Publish Date & Time
                </label>
                {mounted && (
                  <input
                    id="cmsPublishedAt"
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                )}
              </div>

              <div>
                <label htmlFor="cmsContent" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Content Body
                </label>
                <textarea
                  id="cmsContent"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write announcement content..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 text-xs"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="cmsIsPublished"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded border-white/10 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="cmsIsPublished" className="text-xs text-zinc-300 font-semibold cursor-pointer">
                  Publish Immediately
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1 py-2.5 text-xs font-bold">
                  {isEditing ? "Update Alert" : "Save Announcement"}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    variant="glass"
                    onClick={() => {
                      setId(undefined);
                      setTitle("");
                      setContent("");
                      setCategory("info");
                      setIsPublished(true);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2.5 text-xs"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Announcement List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-white">Announcement Stream</h2>

            {allAnnouncements.length === 0 ? (
              <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-8 text-center text-zinc-400 text-sm">
                No announcements in database.
              </div>
            ) : (
              <div className="space-y-4">
                {allAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-zinc-950/70 border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider ${
                            ann.category === "maintenance"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : ann.category === "promotion"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          }`}
                        >
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(ann.publishedAt).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{ann.title}</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed">{ann.content}</p>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-3">
                      <span className="text-[10px] text-zinc-500">
                        Status: <strong className={ann.isPublished ? "text-emerald-400" : "text-amber-400"}>{ann.isPublished ? "PUBLISHED" : "DRAFT"}</strong>
                      </span>
                      <div className="flex gap-2">
                        <Button variant="glass" onClick={() => handleEdit(ann)} className="px-3 py-1 text-xs">
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(ann.id)} className="px-3 py-1 text-xs">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
