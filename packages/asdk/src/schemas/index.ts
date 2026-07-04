import { z } from "zod";

export const UserRoleSchema = z.enum(["user", "operator", "admin"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  emailVerified: z.boolean().optional(),
  createdAt: z.string()
});
export type User = z.infer<typeof UserSchema>;

export const MembershipLevelSchema = z.enum(["basic", "pro", "enterprise"]);
export type MembershipLevel = z.infer<typeof MembershipLevelSchema>;

export const ProfileSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().url().or(z.string().length(0)),
  membershipLevel: MembershipLevelSchema,
  updatedAt: z.string()
});
export type Profile = z.infer<typeof ProfileSchema>;

export const WalletSchema = z.object({
  userId: z.string(),
  balance: z.number().nonnegative(),
  updatedAt: z.string()
});
export type Wallet = z.infer<typeof WalletSchema>;

export const TransactionTypeSchema = z.enum([
  "charge",
  "reward",
  "membership_upgrade",
  "refund"
]);
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(), // positive for credits, negative for debits
  type: TransactionTypeSchema,
  description: z.string(),
  timestamp: z.string()
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const AnnouncementCategorySchema = z.enum(["info", "promotion", "maintenance"]);
export type AnnouncementCategory = z.infer<typeof AnnouncementCategorySchema>;

export const AnnouncementSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: AnnouncementCategorySchema,
  isPublished: z.boolean(),
  publishedAt: z.string(),
  authorId: z.string()
});
export type Announcement = z.infer<typeof AnnouncementSchema>;
