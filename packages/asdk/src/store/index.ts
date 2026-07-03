import { create } from "zustand";
import { User, Profile, Wallet, Transaction, Announcement, MembershipLevel, AnnouncementCategory } from "../schemas";
import { mockAuthService, mockWalletService, mockCmsService } from "../services/firebase";

export interface PlatformState {
  // Auth state
  user: User | null;
  profile: Profile | null;
  wallet: Wallet | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Transactions state
  transactions: Transaction[];

  // CMS announcements state
  announcements: Announcement[];
  allAnnouncements: Announcement[];

  // Actions
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, displayName: string, password?: string) => Promise<void>;
  logout: () => void;
  upgradeMembership: (level: MembershipLevel, cost: number) => Promise<void>;
  rewardUser: (userId: string, amount: number, description: string) => Promise<void>;
  fetchUserTransactions: () => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  fetchAllAnnouncements: () => Promise<void>;
  upsertAnnouncement: (announcement: Partial<Announcement> & { title: string; content: string; category: AnnouncementCategory }) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  clearError: () => void;
}

export const usePlatformStore = create<PlatformState>((set, get) => ({
  user: null,
  profile: null,
  wallet: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  transactions: [],
  announcements: [],
  allAnnouncements: [],

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockAuthService.login(email, password);
      set({
        user: data.user,
        profile: data.profile,
        wallet: data.wallet,
        isAuthenticated: true,
        isLoading: false
      });
      // Pre-fetch transactions
      await get().fetchUserTransactions();
    } catch (err: any) {
      set({ error: err.message || "Login failed", isLoading: false });
      throw err;
    }
  },

  register: async (email, displayName, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockAuthService.register(email, displayName, password);
      set({
        user: data.user,
        profile: data.profile,
        wallet: data.wallet,
        isAuthenticated: true,
        isLoading: false
      });
      await get().fetchUserTransactions();
    } catch (err: any) {
      set({ error: err.message || "Registration failed", isLoading: false });
      throw err;
    }
  },

  logout: () => {
    set({
      user: null,
      profile: null,
      wallet: null,
      isAuthenticated: false,
      transactions: []
    });
  },

  upgradeMembership: async (level, cost) => {
    const user = get().user;
    if (!user) throw new Error("Not authenticated");
    set({ isLoading: true, error: null });
    try {
      const data = await mockWalletService.upgradeMembership(user.id, level, cost);
      set({
        profile: data.profile,
        wallet: data.wallet,
        isLoading: false
      });
      // Append transaction locally
      set((state) => ({
        transactions: [data.transaction, ...state.transactions]
      }));
    } catch (err: any) {
      set({ error: err.message || "Upgrade failed", isLoading: false });
      throw err;
    }
  },

  rewardUser: async (userId, amount, description) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockWalletService.creditWallet(userId, amount, description);
      
      // If the rewarded user is the currently logged in user, update their wallet
      const currentUser = get().user;
      if (currentUser && currentUser.id === userId) {
        set({ wallet: data.wallet });
        set((state) => ({
          transactions: [data.transaction, ...state.transactions]
        }));
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
    } catch (err: any) {
      set({ error: err.message || "Failed to delete announcement", isLoading: false });
      throw err;
    }
  }
}));
