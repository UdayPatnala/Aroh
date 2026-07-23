import { describe, it, expect } from "vitest";
import { cn, colors, typography, spacing, accessibility } from "../src";

describe("@aroh/ads Design System Unit Test Suite", () => {
  describe("Class Name Utility (cn)", () => {
    it("merges standard class strings", () => {
      expect(cn("px-2", "py-4")).toBe("px-2 py-4");
    });

    it("resolves Tailwind conflicts using tailwind-merge", () => {
      expect(cn("px-2", "px-4")).toBe("px-4");
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("handles conditional flags and falsy values", () => {
      const isTrue = true;
      const isFalse = false;
      expect(cn("base-class", isTrue && "active-class", isFalse && "inactive-class", null, undefined)).toBe(
        "base-class active-class"
      );
    });
  });

  describe("Design System Tokens", () => {
    it("exports color palette tokens with expected structure", () => {
      expect(colors.bg.base).toBe("#fbfbfa");
      expect(colors.border.focus).toBe("#0284c7");
      expect(colors.accent.sky).toBe("#0284c7");
      expect(colors.text.primary).toBe("#0f172a");
      expect(colors.status.success).toBe("#16a34a");
    });

    it("exports typography tokens", () => {
      expect(typography.fontFamily.sans).toContain("Outfit");
      expect(typography.fontSize.base).toBe("1rem");
      expect(typography.fontSize["5xl"]).toBe("3rem");
    });

    it("exports spacing tokens", () => {
      expect(spacing.xs).toBe("0.25rem");
      expect(spacing.md).toBe("1rem");
      expect(spacing["2xl"]).toBe("3rem");
    });

    it("exports accessibility guidelines and ring classes", () => {
      expect(accessibility.focusRing).toContain("focus-visible:ring-sky-600");
      expect(accessibility.touchTarget).toContain("min-h-[44px]");
    });
  });
});
