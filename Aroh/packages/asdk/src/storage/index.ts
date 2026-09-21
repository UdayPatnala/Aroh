/**
 * AROH Open Source Platform — Universal Storage Engine
 * Domain: Cross-Platform Infrastructure & Client Storage (Domain 8)
 * 
 * Provides a unified, platform-agnostic storage abstraction supporting:
 * - Web Browsers (`window.localStorage`)
 * - Node.js / SSR / Vitest runtimes (In-memory fallback)
 * - Mobile runtimes (React Native / Expo SecureStore / AsyncStorage)
 */

export interface IPlatformStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
  clear(): void | Promise<void>;
  isAvailable(): boolean;
  readonly type: "browser" | "memory" | "mobile";
}

/**
 * In-memory storage implementation for Node.js, SSR, and headless test harnesses.
 */
export class MemoryStorage implements IPlatformStorage {
  public readonly type = "memory" as const;
  private store: Map<string, string> = new Map();

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }

  public isAvailable(): boolean {
    return true;
  }
}

/**
 * Web browser localStorage implementation with fail-safe SSR degradation.
 */
export class BrowserLocalStorage implements IPlatformStorage {
  public readonly type = "browser" as const;
  private fallback: MemoryStorage = new MemoryStorage();

  public isAvailable(): boolean {
    try {
      return typeof window !== "undefined" && typeof window.localStorage !== "undefined" && window.localStorage !== null;
    } catch {
      return false;
    }
  }

  public getItem(key: string): string | null {
    if (this.isAvailable()) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return this.fallback.getItem(key);
      }
    }
    return this.fallback.getItem(key);
  }

  public setItem(key: string, value: string): void {
    if (this.isAvailable()) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // Fallback on QuotaExceededError or private browsing restrictions
        this.fallback.setItem(key, value);
        return;
      }
    }
    this.fallback.setItem(key, value);
  }

  public removeItem(key: string): void {
    if (this.isAvailable()) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch {
        this.fallback.removeItem(key);
        return;
      }
    }
    this.fallback.removeItem(key);
  }

  public clear(): void {
    if (this.isAvailable()) {
      try {
        window.localStorage.clear();
        return;
      } catch {
        this.fallback.clear();
        return;
      }
    }
    this.fallback.clear();
  }
}

/**
 * Mobile storage adapter designed for React Native AsyncStorage or Expo SecureStore.
 */
export interface MobileStorageDriver {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear?: () => Promise<void>;
}

export class MobileStorageAdapter implements IPlatformStorage {
  public readonly type = "mobile" as const;
  private driver: MobileStorageDriver;
  private syncCache: Map<string, string> = new Map();

  constructor(driver: MobileStorageDriver) {
    this.driver = driver;
  }

  public isAvailable(): boolean {
    return typeof this.driver?.getItem === "function";
  }

  public async getItem(key: string): Promise<string | null> {
    try {
      const val = await this.driver.getItem(key);
      if (val !== null) {
        this.syncCache.set(key, val);
      } else {
        this.syncCache.delete(key);
      }
      return val;
    } catch {
      return this.syncCache.get(key) ?? null;
    }
  }

  public getItemSync(key: string): string | null {
    return this.syncCache.get(key) ?? null;
  }

  public async setItem(key: string, value: string): Promise<void> {
    this.syncCache.set(key, value);
    try {
      await this.driver.setItem(key, value);
    } catch (e) {
      console.warn("[MobileStorageAdapter] Failed to persist to native driver:", e);
    }
  }

  public async removeItem(key: string): Promise<void> {
    this.syncCache.delete(key);
    try {
      await this.driver.removeItem(key);
    } catch (e) {
      console.warn("[MobileStorageAdapter] Failed to delete from native driver:", e);
    }
  }

  public async clear(): Promise<void> {
    this.syncCache.clear();
    if (typeof this.driver.clear === "function") {
      try {
        await this.driver.clear();
      } catch (e) {
        console.warn("[MobileStorageAdapter] Failed to clear native driver:", e);
      }
    }
  }
}

// Global active storage singleton
let activeStorage: IPlatformStorage = new BrowserLocalStorage();

/**
 * Retrieves the currently active platform storage instance.
 */
export function getPlatformStorage(): IPlatformStorage {
  return activeStorage;
}

/**
 * Sets a custom platform storage engine (e.g., MobileStorageAdapter in React Native).
 */
export function setPlatformStorage(storage: IPlatformStorage): void {
  activeStorage = storage;
}

/**
 * Resets the storage engine back to the default Browser/Memory storage.
 */
export function resetPlatformStorage(): void {
  activeStorage = new BrowserLocalStorage();
}
