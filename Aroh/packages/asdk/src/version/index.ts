/**
 * AROH Platform - Universal Version Governance & Authoritative Version Export
 * Format: A.BC.DE.F (Major.SubVersion.Functional.Patch)
 */

export interface PlatformVersionInfo {
  version: string;
  major: number;
  subVersion: number;
  functional: number;
  patch: number;
  status: "VERIFIED" | "IN_PROGRESS" | "RELEASED" | "DEPRECATED";
  releaseName: string;
  buildDate: string;
  commit: string;
}

export const PLATFORM_VERSION = "2.03.08.0";
export const PLATFORM_STATUS = "VERIFIED";
export const PLATFORM_RELEASE_NAME = "Universal Modular Architecture & Change-Isolation Governance";
export const PLATFORM_BUILD_DATE = "2026-09-20";
export const PLATFORM_COMMIT = "HEAD";

export const PLATFORM_VERSION_INFO: PlatformVersionInfo = {
  version: PLATFORM_VERSION,
  major: 2,
  subVersion: 3,
  functional: 8,
  patch: 0,
  status: PLATFORM_STATUS,
  releaseName: PLATFORM_RELEASE_NAME,
  buildDate: PLATFORM_BUILD_DATE,
  commit: PLATFORM_COMMIT
};

/**
 * Validates whether a version string matches the strict A.BC.DE.F governance format
 */
export function isValidVersionFormat(version: string): boolean {
  const versionRegex = /^\d+\.\d{2}\.\d{2}\.\d+$/;
  return versionRegex.test(version);
}

/**
 * Parses an authoritative A.BC.DE.F version string into numerical tiers
 */
export function parseVersion(version: string): {
  major: number;
  subVersion: number;
  functional: number;
  patch: number;
} {
  if (!isValidVersionFormat(version)) {
    throw new Error(`Invalid version format: "${version}". Authoritative format is A.BC.DE.F (e.g. 2.03.01.0).`);
  }
  const parts = version.split(".").map(Number);
  return {
    major: parts[0],
    subVersion: parts[1],
    functional: parts[2],
    patch: parts[3]
  };
}

/**
 * Returns the current platform version information
 */
export function getPlatformVersion(): PlatformVersionInfo {
  return { ...PLATFORM_VERSION_INFO };
}
