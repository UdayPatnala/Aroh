import { describe, it, expect, beforeEach } from "vitest";
import {
  UserSchema,
  ProfileSchema,
  WalletSchema,
  TransactionSchema,
  AnnouncementSchema,
  UserRoleSchema,
  MembershipLevelSchema,
  signMockToken,
  verifyMockToken,
  usePlatformStore,
  mockAuthService,
  mockWalletService,
  mockCmsService
} from "../src";

describe("@aroh/asdk Unit Test Suite", () => {
  describe("Zod Schemas", () => {
    it("validates UserRoleSchema correctly", () => {
      expect(UserRoleSchema.parse("user")).toBe("user");
      expect(UserRoleSchema.parse("operator")).toBe("operator");
      expect(UserRoleSchema.parse("admin")).toBe("admin");
      expect(() => UserRoleSchema.parse("invalid_role")).toThrow();
    });

    it("validates MembershipLevelSchema correctly", () => {
      expect(MembershipLevelSchema.parse("basic")).toBe("basic");
      expect(MembershipLevelSchema.parse("pro")).toBe("pro");
      expect(MembershipLevelSchema.parse("enterprise")).toBe("enterprise");
      expect(() => MembershipLevelSchema.parse("super")).toThrow();
    });

    it("validates UserSchema", () => {
      const validUser = {
        id: "usr-123",
        email: "user@aroh.io",
        role: "user" as const,
        emailVerified: true,
        createdAt: new Date().toISOString()
      };
      expect(UserSchema.parse(validUser)).toEqual(validUser);

      const invalidEmail = { ...validUser, email: "not-an-email" };
      expect(() => UserSchema.parse(invalidEmail)).toThrow();
    });

    it("validates ProfileSchema", () => {
      const validProfile = {
        userId: "usr-123",
        displayName: "Alex Rivers",
        avatarUrl: "https://aroh.io/avatar.png",
        membershipLevel: "pro" as const,
        updatedAt: new Date().toISOString()
      };
      expect(ProfileSchema.parse(validProfile)).toEqual(validProfile);

      const invalidProfile = { ...validProfile, avatarUrl: "invalid-url" };
      expect(() => ProfileSchema.parse(invalidProfile)).toThrow();
    });

    it("validates WalletSchema", () => {
      const validWallet = {
        userId: "usr-123",
        balance: 1500,
        updatedAt: new Date().toISOString()
      };
      expect(WalletSchema.parse(validWallet)).toEqual(validWallet);

      const negativeWallet = { ...validWallet, balance: -50 };
      expect(() => WalletSchema.parse(negativeWallet)).toThrow();
    });

    it("validates TransactionSchema", () => {
      const validTransaction = {
        id: "tx-999",
        userId: "usr-123",
        amount: 250,
        type: "reward" as const,
        description: "Community Contribution Reward",
        timestamp: new Date().toISOString()
      };
      expect(TransactionSchema.parse(validTransaction)).toEqual(validTransaction);
    });

    it("validates AnnouncementSchema", () => {
      const validAnnouncement = {
        id: "anc-001",
        title: "AROH Platform 2.0 Released",
        content: "We are thrilled to launch the updated platform suite.",
        category: "info" as const,
        isPublished: true,
        publishedAt: new Date().toISOString(),
        authorId: "admin-id"
      };
      expect(AnnouncementSchema.parse(validAnnouncement)).toEqual(validAnnouncement);

      const emptyTitle = { ...validAnnouncement, title: "" };
      expect(() => AnnouncementSchema.parse(emptyTitle)).toThrow();
    });
  });

  describe("Cryptographic Token Service", () => {
    const secret = "test-secret-key-321";

    it("signs and verifies a valid mock JWT token", () => {
      const token = signMockToken("user-456", "operator", secret);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);

      const verified = verifyMockToken(token, secret);
      expect(verified).not.toBeNull();
      expect(verified?.userId).toBe("user-456");
      expect(verified?.role).toBe("operator");
    });

    it("fails verification with an incorrect secret key", () => {
      const token = signMockToken("user-456", "operator", secret);
      const verified = verifyMockToken(token, "wrong-secret-key");
      expect(verified).toBeNull();
    });

    it("fails verification for malformed token string", () => {
      expect(verifyMockToken("invalid.token", secret)).toBeNull();
      expect(verifyMockToken("random-string-no-dots", secret)).toBeNull();
    });
  });

  describe("Mock Services Direct Integrity", () => {
    it("logs in via mockAuthService", async () => {
      const res = await mockAuthService.login("director@aroh.io", "password123");
      expect(res.user.email).toBe("director@aroh.io");
      expect(res.profile.displayName).toBe("Aroh Director");
      expect(res.wallet.balance).toBeGreaterThan(0);
    });

    it("credits wallet via mockWalletService", async () => {
      const res = await mockWalletService.creditWallet("admin-id", 500, "Bonus Reward");
      expect(res.wallet.balance).toBeGreaterThanOrEqual(50500);
      expect(res.transaction.amount).toBe(500);
      expect(res.transaction.type).toBe("reward");
    });

    it("manages announcements via mockCmsService", async () => {
      const newAnc = await mockCmsService.upsertAnnouncement({
        title: "Maintenance Window",
        content: "Scheduled downtime on Sunday 02:00 UTC",
        category: "maintenance",
        authorId: "admin-id"
      });

      expect(newAnc.id).toBeDefined();
      expect(newAnc.title).toBe("Maintenance Window");

      const all = await mockCmsService.getAllAnnouncements();
      expect(all.some((a) => a.id === newAnc.id)).toBe(true);
    });
  });

  describe("Platform Store (Zustand)", () => {
    beforeEach(() => {
      usePlatformStore.getState().logout(true);
    });

    it("initializes with unauthenticated default state", () => {
      const state = usePlatformStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.transactions).toEqual([]);
    });

    it("rehydrates default session correctly", () => {
      usePlatformStore.getState().rehydrateSession();
      const state = usePlatformStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.role).toBe("admin");
      expect(state.profile?.displayName).toBe("Aroh Director");
    });

    it("authenticates and signs in user", async () => {
      await usePlatformStore.getState().login("director@aroh.io");
      const state = usePlatformStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.email).toBe("director@aroh.io");
      expect(state.token).not.toBeNull();
    });

    it("handles notifications state", () => {
      const store = usePlatformStore.getState();
      store.addNotification("Test notification message", "info");
      
      let state = usePlatformStore.getState();
      expect(state.notifications.length).toBe(1);
      expect(state.notifications[0].read).toBe(false);

      store.markNotificationsAsRead();
      state = usePlatformStore.getState();
      expect(state.notifications[0].read).toBe(true);
    });
  });
});
