import { describe, it, expect } from "vitest";
import {
  parseArohDeepLink,
  evaluateDeviceSecurity,
  MobileDeviceAttestationSchema,
  PushRegistrationSchema
} from "../src/mobile/index";

describe("Mobile Architecture & Deep Link Engine", () => {
  describe("Deep Link Parser (aroh:// scheme)", () => {
    it("should parse wallet routes correctly", () => {
      const res = parseArohDeepLink("aroh://wallet");
      expect(res.isValid).toBe(true);
      expect(res.route).toBe("wallet");
    });

    it("should parse product detail routes with spokeId parameter", () => {
      const res = parseArohDeepLink("aroh://explore/omnistream");
      expect(res.isValid).toBe(true);
      expect(res.route).toBe("product_detail");
      expect(res.params.spokeId).toBe("omnistream");
    });

    it("should parse cryptographic transaction receipt route", () => {
      const res = parseArohDeepLink("aroh://receipt/rcpt_2026_abc123");
      expect(res.isValid).toBe(true);
      expect(res.route).toBe("receipt");
      expect(res.params.receiptId).toBe("rcpt_2026_abc123");
    });

    it("should parse AI portal deep link", () => {
      const res = parseArohDeepLink("aroh://ai?prompt=hello");
      expect(res.isValid).toBe(true);
      expect(res.route).toBe("ai_portal");
      expect(res.params.prompt).toBe("hello");
    });

    it("should parse DPDP statutory compliance route", () => {
      const res = parseArohDeepLink("aroh://privacy");
      expect(res.isValid).toBe(true);
      expect(res.route).toBe("privacy");
    });

    it("should fallback gracefully on empty or malformed inputs", () => {
      const resEmpty = parseArohDeepLink("");
      expect(resEmpty.isValid).toBe(false);

      const resUnknown = parseArohDeepLink("aroh://unknown-section");
      expect(resUnknown.isValid).toBe(true);
      expect(resUnknown.route).toBe("explore");
    });
  });

  describe("Device Security & Biometric Attestation", () => {
    it("should validate and accept secure mobile device attestation", () => {
      const validAttestation = {
        deviceId: "dev_iphone_15_pro",
        platform: "ios" as const,
        osVersion: "17.4",
        appVersion: "2.04.00.0",
        biometricsSupported: true,
        biometricsEnrolled: true,
        isJailbrokenOrRooted: false,
        lastAttestedAt: new Date().toISOString()
      };

      const parsed = MobileDeviceAttestationSchema.safeParse(validAttestation);
      expect(parsed.success).toBe(true);

      const evaluation = evaluateDeviceSecurity(validAttestation);
      expect(evaluation.isSecure).toBe(true);
      expect(evaluation.flags).toHaveLength(0);
    });

    it("should flag jailbroken or rooted devices", () => {
      const compromisedDevice = {
        deviceId: "dev_android_rooted",
        platform: "android" as const,
        osVersion: "14.0",
        appVersion: "2.04.00.0",
        biometricsSupported: true,
        biometricsEnrolled: true,
        isJailbrokenOrRooted: true,
        lastAttestedAt: new Date().toISOString()
      };

      const evaluation = evaluateDeviceSecurity(compromisedDevice);
      expect(evaluation.isSecure).toBe(false);
      expect(evaluation.flags).toContain("DEVICE_ROOTED_OR_JAILBROKEN");
    });
  });

  describe("Push Registration Schema", () => {
    it("should validate valid push notification registration", () => {
      const reg = {
        userId: "usr_12345",
        pushToken: "ExponentPushToken[xxxxxxxxxxxx]",
        provider: "expo" as const,
        registeredAt: new Date().toISOString()
      };

      const parsed = PushRegistrationSchema.safeParse(reg);
      expect(parsed.success).toBe(true);
    });
  });
});
