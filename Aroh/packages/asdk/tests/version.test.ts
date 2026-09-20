import { describe, it, expect } from "vitest";
import {
  PLATFORM_VERSION,
  PLATFORM_STATUS,
  PLATFORM_RELEASE_NAME,
  PLATFORM_BUILD_DATE,
  PLATFORM_COMMIT,
  PLATFORM_VERSION_INFO,
  isValidVersionFormat,
  parseVersion,
  getPlatformVersion
} from "../src";

describe("Universal Version Governance — @aroh/asdk Suite", () => {
  describe("Format and Standard Validation", () => {
    it("validates authoritative version format A.BC.DE.F", () => {
      expect(isValidVersionFormat("2.03.01.1")).toBe(true);
      expect(isValidVersionFormat("1.00.00.0")).toBe(true);
      expect(isValidVersionFormat("2.02.00.0")).toBe(true);

      // Invalid formats
      expect(isValidVersionFormat("2.3.1")).toBe(false);
      expect(isValidVersionFormat("2.3.1.0")).toBe(false); // BC must be 2 digits
      expect(isValidVersionFormat("v2.03.01.1")).toBe(false); // No prefix
      expect(isValidVersionFormat("2.03.1.0")).toBe(false); // DE must be 2 digits
    });

    it("ensures current PLATFORM_VERSION strictly adheres to A.BC.DE.F", () => {
      expect(isValidVersionFormat(PLATFORM_VERSION)).toBe(true);
      expect(PLATFORM_VERSION).toBe("2.03.07.0");
    });

    it("parses version tiers into numerical components accurately", () => {
      const parsed = parseVersion(PLATFORM_VERSION);
      expect(parsed.major).toBe(2);
      expect(parsed.subVersion).toBe(3);
      expect(parsed.functional).toBe(7);
      expect(parsed.patch).toBe(0);
    });

    it("throws an error when parsing an invalid version string", () => {
      expect(() => parseVersion("invalid-version")).toThrow(
        /Invalid version format/
      );
      expect(() => parseVersion("1.0.0")).toThrow(
        /Invalid version format/
      );
    });
  });

  describe("Metadata and Service Integrity", () => {
    it("exports complete platform version information", () => {
      const info = getPlatformVersion();
      expect(info.version).toBe(PLATFORM_VERSION);
      expect(info.status).toBe("VERIFIED");
      expect(info.releaseName).toBe(PLATFORM_RELEASE_NAME);
      expect(info.buildDate).toBe(PLATFORM_BUILD_DATE);
      expect(info.commit).toBe(PLATFORM_COMMIT);
      expect(info.major).toBe(2);
      expect(info.subVersion).toBe(3);
      expect(info.functional).toBe(7);
      expect(info.patch).toBe(0);
    });

    it("ensures status is VERIFIED across platform exports", () => {
      expect(PLATFORM_STATUS).toBe("VERIFIED");
      expect(PLATFORM_VERSION_INFO.status).toBe("VERIFIED");
    });
  });
});
