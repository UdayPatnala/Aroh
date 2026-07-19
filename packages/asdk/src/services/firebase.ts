import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  runTransaction,
  deleteDoc
} from "firebase/firestore";
import type { User, Profile, Wallet, Transaction, Announcement, MembershipLevel, AnnouncementCategory } from "../schemas/index";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if we should run in mock mode
const isMock = !firebaseConfig.apiKey || process.env.NEXT_PUBLIC_AROH_ENV === "mock" || process.env.AROH_ENV === "mock" || (typeof window !== "undefined" && localStorage.getItem("aroh_force_mock") === "true");
export const isMockEnv = isMock;

// Initialize Firebase App if not mock
let app: any;
let auth: any;
let db: any;

if (!isMock) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.error("Failed to initialize Firebase SDK, falling back to mock mode:", err);
  }
}

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
    const seededUsers = {
      "admin-id": { id: "admin-id", email: "admin@aroh.co", role: "admin" as const, emailVerified: true, createdAt: new Date().toISOString(), password: "admin" },
      "operator-id": { id: "operator-id", email: "operator@aroh.co", role: "operator" as const, emailVerified: true, createdAt: new Date().toISOString(), password: "operator" },
      "user-id": { id: "user-id", email: "user@aroh.co", role: "user" as const, emailVerified: true, createdAt: new Date().toISOString(), password: "user" }
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

// Database queries
export const mockAuthService = {
  login: async (email: string, password?: string): Promise<{ user: User; profile: Profile; wallet: Wallet }> => {
    if (!isMock && auth && db) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password || "");
        const firebaseUser = userCredential.user;
        
        // Fetch custom role and profile from Firestore
        const profileRef = doc(db, "profiles", firebaseUser.uid);
        const walletRef = doc(db, "wallets", firebaseUser.uid);
        const userRef = doc(db, "users", firebaseUser.uid);
        
        const [profileSnap, walletSnap, userSnap] = await Promise.all([
          getDoc(profileRef),
          getDoc(walletRef),
          getDoc(userRef)
        ]);

        if (!profileSnap.exists() || !walletSnap.exists() || !userSnap.exists()) {
          throw new Error("User record incomplete in database.");
        }

        const profileData = profileSnap.data() as Profile;
        const walletData = walletSnap.data() as Wallet;
        const userData = userSnap.data() as User;

        return {
          user: userData,
          profile: profileData,
          wallet: walletData
        };
      } catch (err: any) {
        throw new Error(err.message || "Invalid credentials");
      }
    }

    // Mock implementation
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
    if (!isMock && auth && db) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password || "password");
        const firebaseUser = userCredential.user;
        const userId = firebaseUser.uid;

        const newUser: User = {
          id: userId,
          email,
          role: "user",
          createdAt: new Date().toISOString()
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
          balance: 500, // starting credit
          updatedAt: new Date().toISOString()
        };

        const welcomeTx: Transaction = {
          id: "t-" + Math.random().toString(36).substr(2, 9),
          userId,
          amount: 500,
          type: "reward",
          description: "Welcome credit reward",
          timestamp: new Date().toISOString()
        };

        // Write batch details to Firestore
        await setDoc(doc(db, "users", userId), newUser);
        await setDoc(doc(db, "profiles", userId), newProfile);
        await setDoc(doc(db, "wallets", userId), newWallet);
        await setDoc(doc(db, "transactions", welcomeTx.id), welcomeTx);

        return { user: newUser, profile: newProfile, wallet: newWallet };
      } catch (err: any) {
        throw new Error(err.message || "Registration failed");
      }
    }

    // Mock implementation
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
      emailVerified: false,
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

    return { user: { id: userId, email, role: "user" as const, emailVerified: false, createdAt: newUser.createdAt }, profile: newProfile, wallet: newWallet };
  },

  sendEmailVerification: async (): Promise<void> => {
    if (!isMock && auth && auth.currentUser) {
      try {
        await firebaseSendEmailVerification(auth.currentUser);
        return;
      } catch (err: any) {
        throw new Error(err.message || "Failed to send email verification");
      }
    }
    console.log("[MOCK] Verification email sent to current user");
  },

  sendPasswordReset: async (email: string): Promise<void> => {
    if (!isMock && auth) {
      try {
        await firebaseSendPasswordResetEmail(auth, email);
        return;
      } catch (err: any) {
        throw new Error(err.message || "Failed to send password reset email");
      }
    }
    initializeMockDb();
    const users = getStored<Record<string, User & { password?: string }>>(MOCK_STORAGE_KEYS.USERS, {});
    const exists = Object.values(users).some((u) => u.email === email);
    if (!exists) {
      throw new Error("Email not found");
    }
    console.log("[MOCK] Password reset link sent to:", email);
  },

  updateProfile: async (userId: string, displayName: string, avatarUrl: string): Promise<Profile> => {
    if (!isMock && db) {
      try {
        const profileRef = doc(db, "profiles", userId);
        const updatedAt = new Date().toISOString();
        const profileSnap = await getDoc(profileRef);
        if (!profileSnap.exists()) throw new Error("Profile not found");
        const profileData = profileSnap.data() as Profile;
        const updatedProfile: Profile = {
          ...profileData,
          displayName,
          avatarUrl,
          updatedAt
        };
        await setDoc(profileRef, updatedProfile);
        return updatedProfile;
      } catch (err: any) {
        throw new Error(err.message || "Failed to update profile");
      }
    }

    initializeMockDb();
    const profiles = getStored<Record<string, Profile>>(MOCK_STORAGE_KEYS.PROFILES, {});
    const profile = profiles[userId];
    if (!profile) throw new Error("Profile not found");
    
    profile.displayName = displayName;
    profile.avatarUrl = avatarUrl;
    profile.updatedAt = new Date().toISOString();
    
    setStored(MOCK_STORAGE_KEYS.PROFILES, profiles);
    return profile;
  }
};

export const mockWalletService = {
  upgradeMembership: async (userId: string, targetLevel: MembershipLevel, cost: number): Promise<{ profile: Profile; wallet: Wallet; transaction: Transaction }> => {
    if (!isMock && db) {
      try {
        const walletRef = doc(db, "wallets", userId);
        const profileRef = doc(db, "profiles", userId);
        const txId = "t-" + Math.random().toString(36).substr(2, 9);
        const txRef = doc(db, "transactions", txId);

        const result = await runTransaction(db, async (transaction) => {
          const walletSnap = await transaction.get(walletRef);
          if (!walletSnap.exists()) {
            throw new Error("Wallet record not found.");
          }

          const walletData = walletSnap.data() as Wallet;
          if (walletData.balance < cost) {
            throw new Error("Insufficient Aros balance");
          }

          const newBalance = walletData.balance - cost;
          const timestamp = new Date().toISOString();

          const updatedWallet: Wallet = {
            ...walletData,
            balance: newBalance,
            updatedAt: timestamp
          };

          const profileSnap = await transaction.get(profileRef);
          if (!profileSnap.exists()) {
            throw new Error("Profile record not found.");
          }

          const profileData = profileSnap.data() as Profile;
          const updatedProfile: Profile = {
            ...profileData,
            membershipLevel: targetLevel,
            updatedAt: timestamp
          };

          const newTx: Transaction = {
            id: txId,
            userId,
            amount: -cost,
            type: "membership_upgrade",
            description: `Membership upgrade to ${targetLevel.toUpperCase()}`,
            timestamp
          };

          transaction.update(walletRef, { balance: newBalance, updatedAt: timestamp });
          transaction.update(profileRef, { membershipLevel: targetLevel, updatedAt: timestamp });
          transaction.set(txRef, newTx);

          return { profile: updatedProfile, wallet: updatedWallet, transaction: newTx };
        });

        return result;
      } catch (err: any) {
        throw new Error(err.message || "Failed to upgrade membership");
      }
    }

    // Mock implementation
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
    if (!isMock && db) {
      try {
        const walletRef = doc(db, "wallets", userId);
        const txId = "t-" + Math.random().toString(36).substr(2, 9);
        const txRef = doc(db, "transactions", txId);

        const result = await runTransaction(db, async (transaction) => {
          const walletSnap = await transaction.get(walletRef);
          if (!walletSnap.exists()) {
            throw new Error("Wallet record not found.");
          }

          const walletData = walletSnap.data() as Wallet;
          const newBalance = walletData.balance + amount;
          const timestamp = new Date().toISOString();

          const updatedWallet: Wallet = {
            ...walletData,
            balance: newBalance,
            updatedAt: timestamp
          };

          const newTx: Transaction = {
            id: txId,
            userId,
            amount,
            type: "reward",
            description,
            timestamp
          };

          transaction.update(walletRef, { balance: newBalance, updatedAt: timestamp });
          transaction.set(txRef, newTx);

          return { wallet: updatedWallet, transaction: newTx };
        });

        return result;
      } catch (err: any) {
        throw new Error(err.message || "Failed to adjust balance");
      }
    }

    // Mock implementation
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
    if (!isMock && db) {
      try {
        const txsRef = collection(db, "transactions");
        const q = query(txsRef, where("userId", "==", userId), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const list: Transaction[] = [];
        snap.forEach((d) => {
          list.push(d.data() as Transaction);
        });
        return list;
      } catch (err: any) {
        console.error("Failed to query user transactions:", err);
      }
    }

    // Mock implementation
    initializeMockDb();
    const transactions = getStored<Transaction[]>(MOCK_STORAGE_KEYS.TRANSACTIONS, []);
    return transactions.filter((t) => t.userId === userId).reverse();
  },

  getAllTransactions: async (): Promise<Transaction[]> => {
    if (!isMock && db) {
      try {
        const txsRef = collection(db, "transactions");
        const q = query(txsRef, orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const list: Transaction[] = [];
        snap.forEach((d) => {
          list.push(d.data() as Transaction);
        });
        return list;
      } catch (err: any) {
        console.error("Failed to query global transactions:", err);
      }
    }

    // Mock implementation
    initializeMockDb();
    const transactions = getStored<Transaction[]>(MOCK_STORAGE_KEYS.TRANSACTIONS, []);
    return [...transactions].reverse();
  }
};

export const mockCmsService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    if (!isMock && db) {
      try {
        const cmsRef = collection(db, "cms");
        const now = new Date();
        const nowStr = now.toISOString();
        const q = query(
          cmsRef,
          where("isPublished", "==", true),
          where("publishedAt", "<=", nowStr),
          orderBy("publishedAt", "desc")
        );
        const snap = await getDocs(q);
        const list: Announcement[] = [];
        snap.forEach((d) => {
          list.push(d.data() as Announcement);
        });
        return list.filter((a) => new Date(a.publishedAt) <= now);
      } catch (err: any) {
        console.error("Failed to fetch announcements:", err);
      }
    }

    // Mock implementation
    initializeMockDb();
    const cms = getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
    const now = new Date();
    return cms
      .filter((a) => a.isPublished && new Date(a.publishedAt) <= now)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  },

  getAllAnnouncements: async (): Promise<Announcement[]> => {
    if (!isMock && db) {
      try {
        const cmsRef = collection(db, "cms");
        const q = query(cmsRef, orderBy("publishedAt", "desc"));
        const snap = await getDocs(q);
        const list: Announcement[] = [];
        snap.forEach((d) => {
          list.push(d.data() as Announcement);
        });
        return list;
      } catch (err: any) {
        console.error("Failed to fetch all announcements:", err);
      }
    }

    // Mock implementation
    initializeMockDb();
    return getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
  },

  upsertAnnouncement: async (announcement: Partial<Announcement> & { title: string; content: string; category: AnnouncementCategory; authorId: string }): Promise<Announcement> => {
    if (!isMock && db) {
      try {
        const id = announcement.id || "a-" + Math.random().toString(36).substr(2, 9);
        const docRef = doc(db, "cms", id);
        
        const newAnn: Announcement = {
          id,
          title: announcement.title,
          content: announcement.content,
          category: announcement.category,
          isPublished: announcement.isPublished ?? true,
          publishedAt: announcement.publishedAt || new Date().toISOString(),
          authorId: announcement.authorId
        };

        await setDoc(docRef, newAnn);
        return newAnn;
      } catch (err: any) {
        throw new Error(err.message || "Failed to upsert announcement");
      }
    }

    // Mock implementation
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
          publishedAt: announcement.publishedAt || cms[idx].publishedAt || new Date().toISOString()
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
      publishedAt: announcement.publishedAt || new Date().toISOString(),
      authorId: announcement.authorId
    };
    cms.push(newAnn);
    setStored(MOCK_STORAGE_KEYS.CMS, cms);
    return newAnn;
  },

  deleteAnnouncement: async (id: string): Promise<boolean> => {
    if (!isMock && db) {
      try {
        await deleteDoc(doc(db, "cms", id));
        return true;
      } catch (err: any) {
        throw new Error(err.message || "Failed to delete announcement");
      }
    }

    // Mock implementation
    initializeMockDb();
    const cms = getStored<Announcement[]>(MOCK_STORAGE_KEYS.CMS, defaultAnnouncements);
    const filtered = cms.filter((a) => a.id !== id);
    setStored(MOCK_STORAGE_KEYS.CMS, filtered);
    return true;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  if (isMock) {
    return null;
  }
  try {
    const firebaseAuth = getAuth();
    if (firebaseAuth.currentUser) {
      return await firebaseAuth.currentUser.getIdToken(true);
    }
  } catch (err) {
    console.error("Failed to get Firebase ID token:", err);
  }
  return null;
};
