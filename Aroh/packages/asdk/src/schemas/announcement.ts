import { z } from "zod";

/**
 * AROH Ecosystem Announcement Types
 */
export const AnnouncementTypeSchema = z.enum([
  "PRODUCT",
  "FEATURE",
  "ECOSYSTEM",
  "AROS",
  "AI",
  "PLATFORM",
  "RELEASE",
  "COMMUNITY",
  "FUTURE"
]);
export type AnnouncementType = z.infer<typeof AnnouncementTypeSchema>;

/**
 * AROH Ecosystem Announcement Lifecycle States
 */
export const AnnouncementStatusSchema = z.enum([
  "UPCOMING",
  "IN_DEVELOPMENT",
  "ANNOUNCED",
  "RELEASED",
  "ARCHIVED"
]);
export type AnnouncementStatus = z.infer<typeof AnnouncementStatusSchema>;

/**
 * AROH Ecosystem Announcement Priority Levels
 */
export const AnnouncementPrioritySchema = z.enum([
  "NORMAL",
  "FEATURED",
  "IMPORTANT"
]);
export type AnnouncementPriority = z.infer<typeof AnnouncementPrioritySchema>;

/**
 * Reusable AROH Ecosystem Announcement Schema
 */
export const EcosystemAnnouncementSchema = z.object({
  id: z.string().min(1, "Announcement ID is required"),
  title: z.string().min(1, "Announcement title is required"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  fullDescription: z.string().min(20, "Full description must be at least 20 characters"),
  type: AnnouncementTypeSchema,
  status: AnnouncementStatusSchema,
  publishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Must be valid ISO date string (YYYY-MM-DD)"),
  targetReleaseDate: z.string().optional(),
  productId: z.string().optional(),
  visual: z.string().optional(),
  cta: z.string().optional(),
  ctaUrl: z.string().optional(),
  priority: AnnouncementPrioritySchema.default("NORMAL"),
  featured: z.boolean().default(false),
  archived: z.boolean().default(false)
});

export type EcosystemAnnouncement = z.infer<typeof EcosystemAnnouncementSchema>;
