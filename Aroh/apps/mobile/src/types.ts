export type MobileTab = "explore" | "wallet" | "ai" | "keys" | "privacy" | "announcements";

export interface MobileScreenProps {
  onNavigate: (tab: MobileTab, params?: Record<string, string>) => void;
  activeParams?: Record<string, string>;
}
