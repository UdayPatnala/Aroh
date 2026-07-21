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
      <div className="min-h-screen bg-[#fbfbfa] flex justify-center items-center text-slate-900">
        <span className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] flex flex-col justify-center items-center text-slate-900 p-6 bg-mesh-light">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-8 rounded-3xl max-w-md text-center space-y-4 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Access Denied</h1>
          <p className="text-xs text-slate-600 font-normal">
            This module requires CMS Operator or Administrator privileges.
          </p>
          <Button variant="primary" onClick={() => router.push("/")} className="px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-12 px-6 lg:px-12 bg-mesh-light">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
            <img src="/aroh-logo.png" alt="AROH Logo" className="h-10 w-10 object-contain rounded-xl border border-black/5 shadow-sm" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                AROH CMS Editorial Hub
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-normal">
                Create, schedule, and publish announcements across the AROH Platform.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <Button variant="secondary" onClick={() => router.push("/")} className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50">
              Home
            </Button>
            <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-4 text-xs bg-slate-100 text-slate-800 border-slate-200">
              Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Announcement Editor Form */}
          <div className="lg:col-span-1 bg-white border border-black/5 p-6 rounded-3xl h-fit space-y-6 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {isEditing ? "Edit Announcement" : "Publish Announcement"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="cmsTitle" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Announcement Title
                </label>
                <input
                  id="cmsTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled System Upgrade"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 text-xs shadow-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="cmsCategory" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category
                </label>
                <select
                  id="cmsCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-black/10 text-slate-900 focus:outline-none focus:border-slate-900 text-xs shadow-sm"
                >
                  <option value="info">Info</option>
                  <option value="promotion">Promotion</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label htmlFor="cmsPublishedAt" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Publish Date & Time
                </label>
                {mounted && (
                  <input
                    id="cmsPublishedAt"
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-black/10 text-slate-900 focus:outline-none focus:border-slate-900 text-xs shadow-sm font-mono"
                  />
                )}
              </div>

              <div>
                <label htmlFor="cmsContent" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Content Body
                </label>
                <textarea
                  id="cmsContent"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write announcement content..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 text-xs shadow-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="cmsIsPublished"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 rounded border-black/10 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="cmsIsPublished" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Publish Immediately
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1 py-2.5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800">
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
                    className="px-4 py-2.5 text-xs bg-slate-100 text-slate-800 border-slate-200"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Announcement Stream */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Announcement Stream</h2>

            {allAnnouncements.length === 0 ? (
              <div className="bg-white border border-black/5 rounded-2xl p-8 text-center text-slate-400 text-sm shadow-sm font-mono">
                No announcements in database.
              </div>
            ) : (
              <div className="space-y-4">
                {allAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white border border-black/5 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-slate-300 transition-all shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider ${
                            ann.category === "maintenance"
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : ann.category === "promotion"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-sky-50 text-sky-600 border border-sky-200"
                          }`}
                        >
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(ann.publishedAt).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">{ann.content}</p>
                    </div>

                    <div className="flex justify-between items-center border-t border-black/5 pt-3">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Status: <strong className={ann.isPublished ? "text-emerald-600" : "text-amber-600"}>{ann.isPublished ? "PUBLISHED" : "DRAFT"}</strong>
                      </span>
                      <div className="flex gap-2">
                        <Button variant="glass" onClick={() => handleEdit(ann)} className="px-3 py-1 text-xs bg-slate-100 text-slate-800 border-slate-200">
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
