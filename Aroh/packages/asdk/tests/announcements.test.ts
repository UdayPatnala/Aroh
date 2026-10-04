import { describe, it, expect } from "vitest";
import {
  EcosystemAnnouncementSchema,
  CANONICAL_ANNOUNCEMENT_REGISTRY,
  OFFICIAL_AROH_INSTAGRAM_URL,
  OFFICIAL_COMMUNITY_FEEDBACK_INFO,
  getAllAnnouncements,
  getFeaturedAnnouncements,
  getAnnouncementById,
  getAnnouncementsByProduct,
  getTimelineAnnouncements,
  evaluateGooglePlayTopUpEligibility,
  getGooglePlayCapabilitiesStatus
} from "../src/index";

describe("Ecosystem Announcements & Future Developments Platform (@aroh/asdk)", () => {
  describe("Schema and Type Validation", () => {
    it("validates a compliant EcosystemAnnouncement", () => {
      const sample = {
        id: "test-announcement",
        title: "Test Feature Announcement",
        shortDescription: "A valid test short description for testing.",
        fullDescription: "A valid test full description that exceeds twenty characters.",
        type: "FEATURE" as const,
        status: "IN_DEVELOPMENT" as const,
        publishDate: "2026-09-30",
        priority: "NORMAL" as const,
        featured: false,
        archived: false
      };
      expect(EcosystemAnnouncementSchema.parse(sample)).toEqual(sample);
    });

    it("rejects an announcement with an invalid type or status", () => {
      const invalid = {
        id: "invalid-test",
        title: "Invalid",
        shortDescription: "Valid length description.",
        fullDescription: "Valid length full description exceeding 20 chars.",
        type: "UNSUPPORTED_TYPE",
        status: "UPCOMING",
        publishDate: "2026-09-30"
      };
      expect(() => EcosystemAnnouncementSchema.parse(invalid)).toThrow();
    });

    it("ensures every canonical announcement strictly matches EcosystemAnnouncementSchema", () => {
      expect(CANONICAL_ANNOUNCEMENT_REGISTRY.length).toBeGreaterThanOrEqual(7);
      CANONICAL_ANNOUNCEMENT_REGISTRY.forEach((ann) => {
        expect(() => EcosystemAnnouncementSchema.parse(ann)).not.toThrow();
      });
    });
  });

  describe("Google Play Billing & Points Invariants (Zero Fabrication)", () => {
    const billingAnn = getAnnouncementById("google-play-billing");
    const rewardsAnn = getAnnouncementById("google-play-rewards");

    it("Google Play Billing is documented strictly as a FUTURE exploration", () => {
      expect(billingAnn).toBeDefined();
      expect(billingAnn?.type).toBe("FUTURE");
      expect(billingAnn?.status).toBe("IN_DEVELOPMENT");
      expect(billingAnn?.ctaUrl).not.toContain("checkout");
      expect(billingAnn?.ctaUrl).not.toContain("stripe");
    });

    it("Google Play Rewards is documented as a distinct loyalty concept", () => {
      expect(rewardsAnn).toBeDefined();
      expect(rewardsAnn?.type).toBe("FUTURE");
      expect(rewardsAnn?.status).toBe("UPCOMING");
      expect(rewardsAnn?.fullDescription).toContain("Google Play Points and Google Play Billing are distinct systems");
    });

    it("server-side eligibility blocks users under 18 from any Aros top-up (NO_MINOR_PAYMENT_FOR_AROS)", () => {
      const evaluation = evaluateGooglePlayTopUpEligibility({
        userId: "user-minor-123",
        userAge: 17,
        channelType: "GOOGLE_PLAY_BILLING"
      });
      expect(evaluation.isEligible).toBe(false);
      expect(evaluation.reasonCode).toBe("BLOCKED_MINOR_AGE_POLICY");
      expect(evaluation.rejectionReason).toContain("NO_MINOR_PAYMENT_FOR_AROS");
    });

    it("server-side evaluation fails closed on adult users because capability is in exploration", () => {
      const evaluation = evaluateGooglePlayTopUpEligibility({
        userId: "user-adult-456",
        userAge: 25,
        channelType: "GOOGLE_PLAY_POINTS_REWARD"
      });
      expect(evaluation.isEligible).toBe(false);
      expect(evaluation.reasonCode).toBe("FEATURE_IN_EXPLORATION_NOT_LIVE");
    });

    it("confirms capabilities report not live in production", () => {
      const status = getGooglePlayCapabilitiesStatus();
      expect(status.isLiveInProduction).toBe(false);
      expect(status.ledgerAuthority).toBe("AROH_INTERNAL_DOUBLE_ENTRY_LEDGER");
    });
  });

  describe("Official Community Feedback Channel (Instagram)", () => {
    it("strictly declares official AROH Instagram destination URL", () => {
      expect(OFFICIAL_AROH_INSTAGRAM_URL).toBe("https://www.instagram.com/aroh.0s/");
      expect(OFFICIAL_COMMUNITY_FEEDBACK_INFO.instagramUrl).toBe("https://www.instagram.com/aroh.0s/");
    });

    it("provides clear disclosure notice that Instagram is for community feedback, not security/disputes", () => {
      expect(OFFICIAL_COMMUNITY_FEEDBACK_INFO.disclosureNotice).toContain(
        "submitting an idea does not guarantee implementation"
      );
      expect(OFFICIAL_COMMUNITY_FEEDBACK_INFO.prohibitedTopics).toContain("Passwords or secret keys");
      expect(OFFICIAL_COMMUNITY_FEEDBACK_INFO.prohibitedTopics).toContain("Credit card or payment credentials");
    });
  });

  describe("Product Ecosystem Parity & Query Functions", () => {
    it("SpeDex announcement references canonical productId and is not released", () => {
      const spedexAnn = getAnnouncementById("spedex-future-launch");
      expect(spedexAnn).toBeDefined();
      expect(spedexAnn?.productId).toBe("spedex");
      expect(spedexAnn?.status).not.toBe("RELEASED");
    });

    it("OmniStream announcement references released flagship status", () => {
      const omniAnn = getAnnouncementById("omnistream-cinemorph");
      expect(omniAnn).toBeDefined();
      expect(omniAnn?.productId).toBe("omnistream");
      expect(omniAnn?.status).toBe("RELEASED");
    });

    it("getAnnouncementsByProduct returns product-specific announcements", () => {
      const omniList = getAnnouncementsByProduct("omnistream");
      expect(omniList.length).toBeGreaterThanOrEqual(1);
      expect(omniList.every((a) => a.productId === "omnistream")).toBe(true);
    });

    it("getTimelineAnnouncements correctly partitions items across stages", () => {
      const timeline = getTimelineAnnouncements();
      expect(timeline.current.length).toBeGreaterThan(0);
      expect(timeline.inDevelopment.length).toBeGreaterThan(0);
      expect(timeline.comingSoon.length).toBeGreaterThan(0);
      expect(timeline.future.length).toBeGreaterThan(0);
    });

    it("getFeaturedAnnouncements returns only featured or important announcements", () => {
      const featured = getFeaturedAnnouncements();
      expect(featured.length).toBeGreaterThan(0);
      featured.forEach((a) => {
        expect(a.featured || a.priority === "IMPORTANT").toBe(true);
      });
    });
  });
});
