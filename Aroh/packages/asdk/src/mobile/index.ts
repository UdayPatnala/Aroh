/**
 * AROH Open Source Platform — Mobile Client Architecture & Deep Link Engine
 * Domain: Cross-Platform Mobile Client (Domain 8)
 * 
 * Provides runtime coordination for React Native / Expo ecosystem clients:
 * - Deterministic Deep Link Routing (`aroh://` URL scheme)
 * - Mobile Biometric & Session State Machine
 * - Push Notification Registration Contracts
 * - Device Integrity & Safety Attestation
 */

import { z } from "zod";

/**
 * Supported deep-link target routes within the AROH mobile ecosystem.
 */
export const MobileRouteSchema = z.enum([
  "explore",
  "product_detail",
  "wallet",
  "receipt",
  "ai_portal",
  "developer_keys",
  "privacy",
  "auth"
]);
export type MobileRoute = z.infer<typeof MobileRouteSchema>;

/**
 * Parsed deep link payload representation.
 */
export interface ParsedDeepLink {
  route: MobileRoute;
  rawUrl: string;
  params: Record<string, string>;
  isValid: boolean;
  error?: string;
}

/**
 * Parses and validates incoming deep-link URLs (e.g., `aroh://receipt/rcpt-12345` or `https://aroh.io/explore/omnistream`).
 */
export function parseArohDeepLink(rawUrl: string): ParsedDeepLink {
  if (!rawUrl || typeof rawUrl !== "string") {
    return {
      route: "explore",
      rawUrl: rawUrl || "",
      params: {},
      isValid: false,
      error: "Empty or invalid deep link URL"
    };
  }

  try {
    // Normalize custom scheme aroh:// to standard url format for parsing
    let normalized = rawUrl.trim();
    if (normalized.startsWith("aroh://")) {
      normalized = normalized.replace("aroh://", "https://aroh.local/");
    }

    const parsed = new URL(normalized);
    const pathname = parsed.pathname.replace(/^\/+|\/+$/g, ""); // strip leading/trailing slashes
    const segments = pathname.split("/");

    const params: Record<string, string> = {};
    parsed.searchParams.forEach((val, key) => {
      params[key] = val;
    });

    const rootSegment = segments[0] || "";

    switch (rootSegment) {
      case "explore":
      case "products":
        if (segments[1]) {
          params.spokeId = segments[1];
          return { route: "product_detail", rawUrl, params, isValid: true };
        }
        return { route: "explore", rawUrl, params, isValid: true };

      case "wallet":
      case "balance":
        return { route: "wallet", rawUrl, params, isValid: true };

      case "receipt":
        if (segments[1]) {
          params.receiptId = segments[1];
          return { route: "receipt", rawUrl, params, isValid: true };
        }
        return { route: "wallet", rawUrl, params, isValid: true };

      case "ai":
      case "portal":
        return { route: "ai_portal", rawUrl, params, isValid: true };

      case "keys":
      case "developer":
        return { route: "developer_keys", rawUrl, params, isValid: true };

      case "privacy":
      case "compliance":
      case "dpdp":
        return { route: "privacy", rawUrl, params, isValid: true };

      case "auth":
      case "login":
        return { route: "auth", rawUrl, params, isValid: true };

      default:
        // Default fallback to explore showcase
        return { route: "explore", rawUrl, params, isValid: true };
    }
  } catch (err: any) {
    return {
      route: "explore",
      rawUrl,
      params: {},
      isValid: false,
      error: err?.message || "Failed to parse deep link URL"
    };
  }
}

/**
 * Mobile Device Security & Biometric Attestation Schema.
 */
export const MobileDeviceAttestationSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
  platform: z.enum(["ios", "android", "harmonyos", "mock"]),
  osVersion: z.string(),
  appVersion: z.string(),
  biometricsSupported: z.boolean().default(false),
  biometricsEnrolled: z.boolean().default(false),
  isJailbrokenOrRooted: z.boolean().default(false),
  lastAttestedAt: z.string().min(1, "Attestation timestamp is required")
});
export type MobileDeviceAttestation = z.infer<typeof MobileDeviceAttestationSchema>;

/**
 * Evaluates whether a mobile device meets high-security requirements for Aros wallet transactions.
 */
export function evaluateDeviceSecurity(attestation: MobileDeviceAttestation): {
  isSecure: boolean;
  flags: string[];
} {
  const flags: string[] = [];

  if (attestation.isJailbrokenOrRooted) {
    flags.push("DEVICE_ROOTED_OR_JAILBROKEN");
  }

  if (attestation.biometricsSupported && !attestation.biometricsEnrolled) {
    flags.push("BIOMETRICS_AVAILABLE_BUT_NOT_ENROLLED");
  }

  return {
    isSecure: flags.length === 0,
    flags
  };
}

/**
 * Push Notification Token Registration Contract.
 */
export const PushRegistrationSchema = z.object({
  userId: z.string().min(1),
  pushToken: z.string().min(1),
  provider: z.enum(["apns", "fcm", "expo"]),
  registeredAt: z.string().min(1)
});
export type PushRegistration = z.infer<typeof PushRegistrationSchema>;
