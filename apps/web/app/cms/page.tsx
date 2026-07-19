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
      <div className="min-h-screen bg-[#0a0a0c] flex justify-center items-center text-white">
        <span className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col justify-center items-center text-white p-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-xl max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-sm text-zinc-400">
            Only verified Platform Operators or Administrators are authorized to update homepage announcements.
          </p>
          <Button variant="primary" onClick={() => router.push("/")} className="px-6 py-2.5">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-10 w-10 object-contain rounded-lg border border-white/10 shadow-md" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                CMS Content Manager
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Create, edit, and publish dynamic announcements for the AROH homepage hub.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <Button variant="secondary" onClick={() => router.push("/")} className="px-5">
              Back to Home
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Creation/Edit Form */}
          <div className="lg:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl h-fit space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-white">
              {isEditing ? "Modify Announcement" : "Create Announcement"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Platform Upgraded to v1.2"
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter details of announcement..."
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-sm resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="info">Info</option>
                    <option value="promotion">Promotion</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={isPublished ? "publish" : "draft"}
                    onChange={(e) => setIsPublished(e.target.value === "publish")}
                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="publish">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="publishedAt" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Publication Date & Time
                </label>
                <input
                  id="publishedAt"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 py-2.5 text-xs font-semibold">
                  {isEditing ? "Update" : "Publish"}
                </Button>
                {isEditing && (
                  <Button
                    variant="glass"
                    onClick={() => {
                      setId(undefined);
                      setTitle("");
                      setContent("");
                      setCategory("info");
                      setIsPublished(true);
                      setPublishedAt(formatForDateTimeLocal());
                      setIsEditing(false);
                    }}
                    className="py-2.5 text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Announcements list */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-white">Ecosystem Announcement Feed</h2>

            {allAnnouncements.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-zinc-400 text-sm">
                No announcements detected.
              </div>
            ) : (
              <div className="space-y-4">
                {allAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 flex justify-between items-start gap-4 hover:border-white/20 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wider ${
                            ann.category === "maintenance"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : ann.category === "promotion"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {ann.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                            ann.isPublished
                              ? mounted && new Date(ann.publishedAt) > new Date()
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                              : "bg-zinc-700/30 text-zinc-400 border border-zinc-700/20"
                          }`}
                        >
                          {ann.isPublished 
                            ? mounted && new Date(ann.publishedAt) > new Date()
                              ? "Scheduled"
                              : "Live" 
                            : "Draft"}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {mounted ? new Date(ann.publishedAt).toLocaleString() : ""}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight">{ann.title}</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl whitespace-pre-wrap">
                        {ann.content}
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 shrink-0">
                      <Button variant="glass" onClick={() => handleEdit(ann)} className="px-3 py-1.5 text-[11px]">
                        Edit
                      </Button>
                      <Button variant="secondary" onClick={() => handleDelete(ann.id)} className="px-3 py-1.5 text-[11px] hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30">
                        Delete
                      </Button>
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
