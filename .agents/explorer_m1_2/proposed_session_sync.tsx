"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";

/**
 * SessionSync is a global client component that listens to the `storage` event.
 * When a logout event is detected from another tab (via the `aroh_logout_event` key),
 * it triggers the local store logout action (without rebroadcasting) and redirects
 * the current tab cleanly to `/login`.
 */
export default function SessionSync() {
  const router = useRouter();
  const { isAuthenticated, logout } = usePlatformStore();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Check for the specific logout event key and verify it has a new value
      if (event.key === "aroh_logout_event" && event.newValue) {
        // Only trigger logout and redirect if this tab is currently authenticated
        if (isAuthenticated) {
          logout(false); // pass false to prevent writing the storage key again
          router.push("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated, logout, router]);

  return null;
}
