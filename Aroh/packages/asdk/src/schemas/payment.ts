import { z } from "zod";

export const ArosTierPackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  arosAmount: z.number().int().positive(),
  priceUsdCents: z.number().int().positive(),
  description: z.string().optional(),
  popular: z.boolean().optional(),
  badge: z.string().optional()
});

export type ArosTierPackage = z.infer<typeof ArosTierPackageSchema>;

export const AROS_TIER_PACKAGES: ArosTierPackage[] = [
  {
    id: "pkg_500",
    name: "Starter Pack",
    arosAmount: 500,
    priceUsdCents: 500, // $5.00 USD
    description: "Ideal for testing models and evaluating spoke workflows.",
    badge: "Basic"
  },
  {
    id: "pkg_1500",
    name: "Developer Pro Pack",
    arosAmount: 1500,
    priceUsdCents: 1500, // $15.00 USD
    description: "Complete package for active development and automated agent tasks.",
    popular: true,
    badge: "Most Popular"
  },
  {
    id: "pkg_5000",
    name: "Ecosystem Builder",
    arosAmount: 5000,
    priceUsdCents: 5000, // $50.00 USD
    description: "Maximum bandwidth tier for high-throughput production spokes.",
    badge: "Best Value"
  }
];

export const CreateCheckoutSessionRequestSchema = z.object({
  packageId: z.string().min(1, "Package ID is required"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

export type CreateCheckoutSessionRequest = z.infer<typeof CreateCheckoutSessionRequestSchema>;

export const CheckoutSessionRecordSchema = z.object({
  id: z.string().startsWith("cs_"),
  userId: z.string(),
  packageId: z.string(),
  arosAmount: z.number().int().positive(),
  amountUsdCents: z.number().int().positive(),
  status: z.enum(["pending", "completed", "expired"]),
  checkoutUrl: z.string(),
  createdAt: z.string(),
  settledAt: z.string().optional(),
  chargeId: z.string().optional()
});

export type CheckoutSessionRecord = z.infer<typeof CheckoutSessionRecordSchema>;

export const PaymentSettlementEventSchema = z.object({
  eventId: z.string().startsWith("evt_"),
  sessionId: z.string().startsWith("cs_"),
  chargeId: z.string().startsWith("ch_"),
  userId: z.string(),
  arosAmount: z.number().int().positive(),
  amountUsdCents: z.number().int().positive(),
  timestamp: z.string()
});

export type PaymentSettlementEvent = z.infer<typeof PaymentSettlementEventSchema>;
