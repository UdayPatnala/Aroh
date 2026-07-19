"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";

export default function SessionSync() {
  const router = useRouter();
  const isAuthenticated = usePlatformStore((state) => state.isAuthenticated);
  const logout = usePlatformStore((state) => state.logout);
  const rehydrateSession = usePlatformStore((state) => state.rehydrateSession);

  useEffect(() => {
    rehydrateSession();
  }, [rehydrateSession]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "aroh_logout_event" && event.newValue) {
        if (isAuthenticated) {
          logout(true);
          router.push("/login");
        }
      }
      if (event.key === "aroh_session") {
        if (event.newValue) {
          // Sync login/profile state instantly in this tab
          rehydrateSession();
        } else if (isAuthenticated) {
          // If session was cleared elsewhere, log out in this tab
          logout(true);
          router.push("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated, logout, rehydrateSession, router]);

  return null;
}

