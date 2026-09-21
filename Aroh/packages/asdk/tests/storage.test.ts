import { describe, it, expect, beforeEach } from "vitest";
import {
  MemoryStorage,
  BrowserLocalStorage,
  MobileStorageAdapter,
  getPlatformStorage,
  setPlatformStorage,
  resetPlatformStorage
} from "../src/storage/index";

describe("Universal Platform Storage Engine", () => {
  beforeEach(() => {
    resetPlatformStorage();
  });

  describe("MemoryStorage", () => {
    it("should set, get, remove, and clear keys in memory", () => {
      const storage = new MemoryStorage();
      expect(storage.type).toBe("memory");
      expect(storage.isAvailable()).toBe(true);

      storage.setItem("testKey", "testValue");
      expect(storage.getItem("testKey")).toBe("testValue");

      storage.removeItem("testKey");
      expect(storage.getItem("testKey")).toBeNull();

      storage.setItem("k1", "v1");
      storage.setItem("k2", "v2");
      storage.clear();
      expect(storage.getItem("k1")).toBeNull();
      expect(storage.getItem("k2")).toBeNull();
    });
  });

  describe("BrowserLocalStorage Fallback", () => {
    it("should gracefully degrade to memory when window is undefined", () => {
      const storage = new BrowserLocalStorage();
      expect(storage.type).toBe("browser");

      // In Vitest node environment without jsdom window.localStorage, it safely degrades
      storage.setItem("user_theme", "dark");
      expect(storage.getItem("user_theme")).toBe("dark");

      storage.removeItem("user_theme");
      expect(storage.getItem("user_theme")).toBeNull();
    });
  });

  describe("MobileStorageAdapter", () => {
    it("should integrate with native driver and support async/sync read cache", async () => {
      const nativeDriverStore = new Map<string, string>();
      const mockDriver = {
        getItem: async (key: string) => nativeDriverStore.get(key) ?? null,
        setItem: async (key: string, value: string) => {
          nativeDriverStore.set(key, value);
        },
        removeItem: async (key: string) => {
          nativeDriverStore.delete(key);
        },
        clear: async () => {
          nativeDriverStore.clear();
        }
      };

      const mobileAdapter = new MobileStorageAdapter(mockDriver);
      expect(mobileAdapter.type).toBe("mobile");
      expect(mobileAdapter.isAvailable()).toBe(true);

      await mobileAdapter.setItem("auth_token", "jwt-mobile-secret");
      expect(nativeDriverStore.get("auth_token")).toBe("jwt-mobile-secret");
      expect(mobileAdapter.getItemSync("auth_token")).toBe("jwt-mobile-secret");

      const val = await mobileAdapter.getItem("auth_token");
      expect(val).toBe("jwt-mobile-secret");

      await mobileAdapter.removeItem("auth_token");
      expect(nativeDriverStore.has("auth_token")).toBe(false);
      expect(mobileAdapter.getItemSync("auth_token")).toBeNull();
    });
  });

  describe("Global Storage Singleton Swapping", () => {
    it("should allow runtime switching of active storage engine", () => {
      const customMem = new MemoryStorage();
      setPlatformStorage(customMem);
      expect(getPlatformStorage()).toBe(customMem);

      resetPlatformStorage();
      expect(getPlatformStorage().type).toBe("browser");
    });
  });
});
