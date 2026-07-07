import { create } from "zustand";
import type { User, Profile, Wallet, Transaction, Announcement, MembershipLevel, AnnouncementCategory } from "../schemas";
import { mockAuthService, mockWalletService, mockCmsService, isMockEnv, getAuthToken } from "../services/firebase";
import { signMockToken } from "../services/token";

export interface PlatformNotification {
  id: string;
  message: string;
  type: string; // 'info' | 'success' | 'warning'
  read: boolean;
  timestamp: string;
}

export interface PlatformState {
  // Auth state
  user: User | null;
  profile: Profile | null;
  wallet: Wallet | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Transactions state
  transactions: Transaction[];

  // CMS announcements state
  announcements: Announcement[];
  allAnnouncements: Announcement[];

  // In-App Notifications state
  notifications: PlatformNotification[];
  notificationPreferences: { email: boolean; inApp: boolean };

  // Actions
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, displayName: string, password?: string) => Promise<void>;
  logout: (skipNotify?: boolean) => void;
  upgradeMembership: (level: MembershipLevel, cost: number) => Promise<void>;
  rewardUser: (userId: string, amount: number, description: string) => Promise<void>;
  fetchUserTransactions: () => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  fetchAllAnnouncements: () => Promise<void>;
  upsertAnnouncement: (announcement: Partial<Announcement> & { title: string; content: string; category: AnnouncementCategory }) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  clearError: () => void;

  // New Actions for Settings & Notifications
  updateProfile: (displayName: string, avatarUrl: string) => Promise<void>;
  addNotification: (message: string, type: string) => void;
  markNotificationsAsRead: () => void;
  updateNotificationPreferences: (prefs: { email: boolean; inApp: boolean }) => void;
}

export const usePlatformStore = create<PlatformState>((set, get) => ({
  user: null,
  profile: null,
  wallet: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  transactions: [],
  announcements: [],
  allAnnouncements: [],
  notifications: [],
  notificationPreferences: { email: true, inApp: true },

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockAuthService.login(email, password);
      let token: string | null = null;
      if (isMockEnv) {
        token = signMockToken(data.user.id, data.user.role);
      } else {
        token = await getAuthToken();
      }
      set({
        user: data.user,
        profile: data.profile,
        wallet: data.wallet,
        token,
        isAuthenticated: true,
        isLoading: false
      });
      // Pre-fetch transactions
      await get().fetchUserTransactions();
      get().addNotification(`Successfully signed in as ${data.profile.displayName}`, "info");
    } catch (err: any) {
      set({ error: err.message || "Login failed", isLoading: false });
      throw err;
    }
  },

  register: async (email, displayName, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockAuthService.register(email, displayName, password);
      let token: string | null = null;
      if (isMockEnv) {
        token = signMockToken(data.user.id, data.user.role);
      } else {
        token = await getAuthToken();
      }
      set({
        user: data.user,
        profile: data.profile,
        wallet: data.wallet,
        token,
        isAuthenticated: true,
        isLoading: false
      });
      await get().fetchUserTransactions();
      get().addNotification("Welcome to the AROH Ecosystem Platform!", "success");
    } catch (err: any) {
      set({ error: err.message || "Registration failed", isLoading: false });
      throw err;
    }
  },

  logout: (skipNotify?: boolean) => {
    if (!get().isAuthenticated) return;
    if (!skipNotify) {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("aroh_logout_event", Date.now().toString());
      }
    }
    set({
      user: null,
      profile: null,
      wallet: null,
      token: null,
      isAuthenticated: false,
      transactions: [],
      notifications: []
    });
  },

  upgradeMembership: async (level, cost) => {
    const user = get().user;
    if (!user) throw new Error("Not authenticated");
    set({ isLoading: true, error: null });
    try {
      let data;
      if (isMockEnv) {
        data = await mockWalletService.upgradeMembership(user.id, level, cost);
      } else {
        const token = get().token;
        const res = await fetch("/api/user/upgrade", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ level, cost })
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error?.message || "Failed to upgrade membership");
        }
        data = json.data;
      }
      set({
        profile: data.profile,
        wallet: data.wallet,
        isLoading: false
      });
      // Append transaction locally
      set((state) => ({
        transactions: [data.transaction, ...state.transactions]
      }));
      get().addNotification(`Successfully upgraded to Platform ${level.toUpperCase()}`, "success");
    } catch (err: any) {
      set({ error: err.message || "Upgrade failed", isLoading: false });
      throw err;
    }
  },

  rewardUser: async (userId, amount, description) => {
    set({ isLoading: true, error: null });
    try {
      let data;
      if (isMockEnv) {
        data = await mockWalletService.creditWallet(userId, amount, description);
      } else {
        const token = get().token;
        const res = await fetch("/api/admin/reward", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ userId, amount, description })
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error?.message || "Failed to reward user");
        }
        data = json.data;
      }
      
      // If the rewarded user is the currently logged in user, update their wallet
      const currentUser = get().user;
      if (currentUser && currentUser.id === userId) {
        set({ wallet: data.wallet });
        set((state) => ({
          transactions: [data.transaction, ...state.transactions]
        }));
        get().addNotification(`Your account was credited with +${amount} Aros: "${description}"`, "success");
      }
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Reward process failed", isLoading: false });
      throw err;
    }
  },

  fetchUserTransactions: async () => {
    const user = get().user;
    if (!user) return;
    const hasData = get().transactions.length > 0;
    if (!hasData) set({ isLoading: true });
    try {
      const list = await mockWalletService.getTransactions(user.id);
      set({ transactions: list, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch transactions", isLoading: false });
    }
  },

  fetchAnnouncements: async () => {
    const hasData = get().announcements.length > 0;
    if (!hasData) set({ isLoading: true });
    try {
      const list = await mockCmsService.getAnnouncements();
      set({ announcements: list, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch announcements", isLoading: false });
    }
  },

  fetchAllAnnouncements: async () => {
    const hasData = get().allAnnouncements.length > 0;
    if (!hasData) set({ isLoading: true });
    try {
      const list = await mockCmsService.getAllAnnouncements();
      set({ allAnnouncements: list, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch all announcements", isLoading: false });
    }
  },

  upsertAnnouncement: async (announcement) => {
    const user = get().user;
    if (!user) throw new Error("Not authenticated");
    set({ isLoading: true, error: null });
    try {
      await mockCmsService.upsertAnnouncement({
        ...announcement,
        authorId: user.id
      });
      set({ isLoading: false });
      // Refresh announcements lists
      await get().fetchAnnouncements();
      await get().fetchAllAnnouncements();
      get().addNotification(`Successfully published announcement "${announcement.title}"`, "info");
    } catch (err: any) {
      set({ error: err.message || "Failed to save announcement", isLoading: false });
      throw err;
    }
  },

  deleteAnnouncement: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await mockCmsService.deleteAnnouncement(id);
      set({ isLoading: false });
      await get().fetchAnnouncements();
      await get().fetchAllAnnouncements();
      get().addNotification("Announcement deleted successfully", "info");
    } catch (err: any) {
      set({ error: err.message || "Failed to delete announcement", isLoading: false });
      throw err;
    }
  },

  sendEmailVerification: async () => {
    set({ isLoading: true, error: null });
    try {
      await mockAuthService.sendEmailVerification();
      set({ isLoading: false });
      get().addNotification("Verification email triggered", "info");
    } catch (err: any) {
      set({ error: err.message || "Failed to send verification email", isLoading: false });
      throw err;
    }
  },

  sendPasswordReset: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await mockAuthService.sendPasswordReset(email);
      set({ isLoading: false });
      get().addNotification("Password reset email sent", "info");
    } catch (err: any) {
      set({ error: err.message || "Failed to send password reset email", isLoading: false });
      throw err;
    }
  },

  updateProfile: async (displayName, avatarUrl) => {
    const user = get().user;
    if (!user) throw new Error("Not authenticated");
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await mockAuthService.updateProfile(user.id, displayName, avatarUrl);
      set({ profile: updatedProfile, isLoading: false });
      get().addNotification("Profile details updated successfully", "success");
    } catch (err: any) {
      set({ error: err.message || "Failed to update profile", isLoading: false });
      throw err;
    }
  },

  addNotification: (message, type) => {
    if (!get().notificationPreferences.inApp) return;
    const newNotif = {
      id: "n-" + Math.random().toString(36).substr(2, 9),
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications]
    }));
  },

  markNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
  },

  updateNotificationPreferences: (prefs) => {
    set({ notificationPreferences: prefs });
  }
}));
