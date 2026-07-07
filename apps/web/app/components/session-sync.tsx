"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";

export default function SessionSync() {
  const router = useRouter();
  const isAuthenticated = usePlatformStore((state) => state.isAuthenticated);
  const logout = usePlatformStore((state) => state.logout);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "aroh_logout_event" && event.newValue) {
        if (isAuthenticated) {
          logout(true);
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
