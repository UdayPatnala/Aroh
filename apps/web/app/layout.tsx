import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import CommandPalette from "./components/command-palette";
import SessionSync from "./components/session-sync";
import GlassDock from "./components/dock";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "AROH Ecosystem Platform",
  description: "A premium, unified digital platform containing multiple interconnected products sharing a centralized foundation."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#0a0a0c] text-white relative overflow-x-hidden pb-24">
        {/* Visual Mesh Grid Backdrop */}
        <div className="absolute inset-0 -z-50 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
        {children}
        <CommandPalette />
        <SessionSync />
        <GlassDock />
      </body>
    </html>
  );
}
