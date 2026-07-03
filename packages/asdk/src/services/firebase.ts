import type { User, Profile, Wallet, Transaction, Announcement, UserRole, MembershipLevel, AnnouncementCategory } from "../schemas/index.ts";

// In memory and localStorage mock database state
const MOCK_STORAGE_KEYS = {
  USERS: "aroh_mock_users",
  PROFILES: "aroh_mock_profiles",
  WALLETS: "aroh_mock_wallets",
  TRANSACTIONS: "aroh_mock_transactions",
  CMS: "aroh_mock_cms"
};

const defaultAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Welcome to the AROH Ecosystem Platform",
    content: "We are thrilled to launch the AROH core system dashboard. Explore the shared services including Aros Wallet and membership upgrades.",
    category: "info",
    isPublished: true,
    publishedAt: new Date().toISOString(),
    authorId: "admin-id"
  },
  {
    id: "a2",
    title: "Aros Token Distribution Reward",
    content: "All new accounts are currently credited with 500 Aros tokens for Testing Phase 1. Use Aros to upgrade your membership tier.",
    category: "promotion",
    isPublished: true,
    publishedAt: new Date().toISOString(),
    authorId: "admin-id"
  }
];

function getStored<T>(key: string, defaultValue: T): T {
  if (typeof localStorage === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// Initial Mock Database Seed
export const initializeMockDb = () => {
  if (typeof localStorage === "undefined") return;

  const users = getStored<Record<string, User & { password?: string }>>(MOCK_STORAGE_KEYS.USERS, {});
  if (Object.keys(users).length === 0) {
    // Seed Users
    const seededUsers = {
      "admin-id": { id: "admin-id", email: "admin@aroh.co", role: "admin" as const, createdAt: new Date().toISOString(), password: "admin" },
      "operator-id": { id: "operator-id", email: "operator@aroh.co", role: "operator" as const, createdAt: new Date().toISOString(), password: "operator" },
      "user-id": { id: "user-id", email: "user@aroh.co", role: "user" as const, createdAt: new Date().toISOString(), password: "user" }
    };
    setStored(MOCK_STORAGE_KEYS.USERS, seededUsers);

    // Seed Profiles
    const seededProfiles = {
      "admin-id": { userId: "admin-id", displayName: "Aroh Director", avatarUrl: "", membershipLevel: "enterprise" as const, updatedAt: new Date().toISOString() },
      "operator-id": { userId: "operator-id", displayName: "CMS Operator", avatarUrl: "", membershipLevel: "pro" as const, updatedAt: new Date().toISOString() },
      "user-id": { userId: "user-id", displayName: "Standard User", avatarUrl: "", membershipLevel: "basic" as const, updatedAt: new Date().toISOString() }
    };
    setStored(MOCK_STORAGE_KEYS.PROFILES, seededProfiles);

    // Seed Wallets
    const seededWallets = {
      "admin-id": { userId: "admin-id", balance: 5000, updatedAt: new Date().toISOString() },
      "operator-id": { userId: "operator-id", balance: 1000, updatedAt: new Date().toISOString() },
      "user-id": { userId: "user-id", balance: 500, updatedAt: new Date().toISOString() }
    };
    setStored(MOCK_STORAGE_KEYS.WALLETS, seededWallets);

    // Seed Transactions
    const seededTransactions: Transaction[] = [
      { id: "t1", userId: "admin-id", amount: 5000, type: "reward", description: "Platform Initial Allocation", timestamp: new Date().toISOString() },
      { id: "t2", userId: "operator-id", amount: 1000, type: "reward", description: "Operator Allocation", timestamp: new Date().toISOString() },
      { id: "t3", userId: "user-id", amount: 500, type: "reward", description: "Testing Account Reward", timestamp: new Date().toISOString() }
    ];
    setStored(MOCK_STORAGE_KEYS.TRANSACTIONS, seededTransactions);

    // Seed CMS announcements
    setStored(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
  }
};

// Database queries (acting asynchronously to match Firebase Web SDK calls)
export const mockAuthService = {
  login: async (email: string, password?: string): Promise<{ user: User; profile: Profile; wallet: Wallet }> => {
    initializeMockDb();
    const users = getStored<Record<string, User & { password?: string }>>(MOCK_STORAGE_KEYS.USERS, {});
    const profiles = getStored<Record<string, Profile>>(MOCK_STORAGE_KEYS.PROFILES, {});
    const wallets = getStored<Record<string, Wallet>>(MOCK_STORAGE_KEYS.WALLETS, {});

    const matchedUser = Object.values(users).find((u) => u.email === email && u.password === password);
    if (!matchedUser) {
      throw new Error("Invalid credentials");
    }

    return {
      user: { id: matchedUser.id, email: matchedUser.email, role: matchedUser.role, createdAt: matchedUser.createdAt },
      profile: profiles[matchedUser.id],
      wallet: wallets[matchedUser.id]
    };
  },

  register: async (email: string, displayName: string, password?: string): Promise<{ user: User; profile: Profile; wallet: Wallet }> => {
    initializeMockDb();
    const users = getStored<Record<string, User & { password?: string }>>(MOCK_STORAGE_KEYS.USERS, {});
    const profiles = getStored<Record<string, Profile>>(MOCK_STORAGE_KEYS.PROFILES, {});
    const wallets = getStored<Record<string, Wallet>>(MOCK_STORAGE_KEYS.WALLETS, {});
    const transactions = getStored<Transaction[]>(MOCK_STORAGE_KEYS.TRANSACTIONS, []);

    if (Object.values(users).some((u) => u.email === email)) {
      throw new Error("User already exists");
    }

    const userId = "u-" + Math.random().toString(36).substr(2, 9);
    const newUser: User & { password?: string } = {
      id: userId,
      email,
      role: "user",
      createdAt: new Date().toISOString(),
      password: password || "password"
    };

    const newProfile: Profile = {
      userId,
      displayName,
      avatarUrl: "",
      membershipLevel: "basic",
      updatedAt: new Date().toISOString()
    };

    const newWallet: Wallet = {
      userId,
      balance: 500, // starting balance for tests
      updatedAt: new Date().toISOString()
    };

    users[userId] = newUser;
    profiles[userId] = newProfile;
    wallets[userId] = newWallet;

    // Log registration transaction
    const transaction: Transaction = {
      id: "t-" + Math.random().toString(36).substr(2, 9),
      userId,
      amount: 500,
      type: "reward",
      description: "Welcome credit reward",
      timestamp: new Date().toISOString()
    };
    transactions.push(transaction);

    setStored(MOCK_STORAGE_KEYS.USERS, users);
    setStored(MOCK_STORAGE_KEYS.PROFILES, profiles);
    setStored(MOCK_STORAGE_KEYS.WALLETS, wallets);
    setStored(MOCK_STORAGE_KEYS.TRANSACTIONS, transactions);

    return { user: { id: userId, email, role: "user", createdAt: newUser.createdAt }, profile: newProfile, wallet: newWallet };
  }
};

export const mockWalletService = {
  upgradeMembership: async (userId: string, targetLevel: MembershipLevel, cost: number): Promise<{ profile: Profile; wallet: Wallet; transaction: Transaction }> => {
    initializeMockDb();
    const profiles = getStored<Record<string, Profile>>(MOCK_STORAGE_KEYS.PROFILES, {});
    const wallets = getStored<Record<string, Wallet>>(MOCK_STORAGE_KEYS.WALLETS, {});
    const transactions = getStored<Transaction[]>(MOCK_STORAGE_KEYS.TRANSACTIONS, []);

    const wallet = wallets[userId];
    if (!wallet || wallet.balance < cost) {
      throw new Error("Insufficient Aros balance");
    }

    // Process upgrade transaction
    wallet.balance -= cost;
    wallet.updatedAt = new Date().toISOString();

    const profile = profiles[userId];
    profile.membershipLevel = targetLevel;
    profile.updatedAt = new Date().toISOString();

    const newTx: Transaction = {
      id: "t-" + Math.random().toString(36).substr(2, 9),
      userId,
      amount: -cost,
      type: "membership_upgrade",
      description: `Membership upgrade to ${targetLevel.toUpperCase()}`,
      timestamp: new Date().toISOString()
    };
    transactions.push(newTx);

    setStored(MOCK_STORAGE_KEYS.PROFILES, profiles);
    setStored(MOCK_STORAGE_KEYS.WALLETS, wallets);
    setStored(MOCK_STORAGE_KEYS.TRANSACTIONS, transactions);

    return { profile, wallet, transaction: newTx };
  },

  creditWallet: async (userId: string, amount: number, description: string): Promise<{ wallet: Wallet; transaction: Transaction }> => {
    initializeMockDb();
    const wallets = getStored<Record<string, Wallet>>(MOCK_STORAGE_KEYS.WALLETS, {});
    const transactions = getStored<Transaction[]>(MOCK_STORAGE_KEYS.TRANSACTIONS, []);

    const wallet = wallets[userId];
    if (!wallet) throw new Error("Wallet not found");

    wallet.balance += amount;
    wallet.updatedAt = new Date().toISOString();

    const newTx: Transaction = {
      id: "t-" + Math.random().toString(36).substr(2, 9),
      userId,
      amount,
      type: "reward",
      description,
      timestamp: new Date().toISOString()
    };
    transactions.push(newTx);

    setStored(MOCK_STORAGE_KEYS.WALLETS, wallets);
    setStored(MOCK_STORAGE_KEYS.TRANSACTIONS, transactions);

    return { wallet, transaction: newTx };
  },

  getTransactions: async (userId: string): Promise<Transaction[]> => {
    initializeMockDb();
    const transactions = getStored<Transaction[]>(MOCK_STORAGE_KEYS.TRANSACTIONS, []);
    return transactions.filter((t) => t.userId === userId).reverse();
  },

  getAllTransactions: async (): Promise<Transaction[]> => {
    initializeMockDb();
    const transactions = getStored<Transaction[]>(MOCK_STORAGE_KEYS.TRANSACTIONS, []);
    return [...transactions].reverse();
  }
};

export const mockCmsService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    initializeMockDb();
    const cms = getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
    return cms.filter((a) => a.isPublished);
  },

  getAllAnnouncements: async (): Promise<Announcement[]> => {
    initializeMockDb();
    return getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
  },

  upsertAnnouncement: async (announcement: Partial<Announcement> & { title: string; content: string; category: AnnouncementCategory; authorId: string }): Promise<Announcement> => {
    initializeMockDb();
    const cms = getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);

    if (announcement.id) {
      const idx = cms.findIndex((a) => a.id === announcement.id);
      if (idx !== -1) {
        const updated: Announcement = {
          ...cms[idx],
          title: announcement.title,
          content: announcement.content,
          category: announcement.category,
          isPublished: announcement.isPublished ?? true,
          publishedAt: new Date().toISOString()
        };
        cms[idx] = updated;
        setStored(MOCK_STORAGE_KEYS.CMS, cms);
        return updated;
      }
    }

    // Create New
    const newAnn: Announcement = {
      id: "a-" + Math.random().toString(36).substr(2, 9),
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      isPublished: announcement.isPublished ?? true,
      publishedAt: new Date().toISOString(),
      authorId: announcement.authorId
    };
    cms.push(newAnn);
    setStored(MOCK_STORAGE_KEYS.CMS, cms);
    return newAnn;
  },

  deleteAnnouncement: async (id: string): Promise<boolean> => {
    initializeMockDb();
    const cms = getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
    const filtered = cms.filter((a) => a.id !== id);
    setStored(MOCK_STORAGE_KEYS.CMS, filtered);
    return true;
  }
};
