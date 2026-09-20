import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import CommandPalette from "./components/command-palette";
import SessionSync from "./components/session-sync";
import GlassDock from "./components/dock";
import CookieBanner from "./components/cookie-banner";
import PlatformFooter from "./components/footer";
import StructuredData from "./components/structured-data";
import VersionBadge from "./components/version-badge";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aroh-os.vercel.app"),
  title: {
    default: "AROH — Unified Digital Ecosystem Platform",
    template: "%s | AROH Platform"
  },
  description: "A premium, unified digital platform containing multiple interconnected products sharing a centralized foundation, design tokens, developer AI, and DPDP data protection.",
  keywords: [
    "AROH",
    "open source ecosystem",
    "monorepo platform",
    "Aros wallet",
    "developer AI",
    "DPDP Act 2023",
    "OmniStream",
    "SpeDex",
    "Nebula",
    "Music Mirror",
    "JavaPath Pro"
  ],
  authors: [{ name: "AROH Open Source Contributors", url: "https://github.com/Aroh-Open-Source/AROH" }],
  creator: "Patnala Uday Kumar",
  publisher: "AROH Open Source",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aroh-os.vercel.app",
    siteName: "AROH Platform",
    title: "AROH — Unified Digital Ecosystem Platform",
    description: "A premium, unified digital platform containing multiple interconnected products sharing a centralized foundation.",
    images: [
      {
        url: "/aroh-logo.png",
        width: 512,
        height: 512,
        alt: "AROH Platform Logo"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "AROH — Unified Digital Ecosystem Platform",
    description: "A premium, unified digital platform containing multiple interconnected products sharing a centralized foundation.",
    images: ["/aroh-logo.png"]
  },
  icons: {
    icon: [{ url: "/aroh-logo.png?v=3", type: "image/png" }],
    apple: "/aroh-logo.png"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
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
      <body className="min-h-full flex flex-col font-sans bg-[#fbfbfa] text-slate-900 relative overflow-x-hidden pb-24">
        <StructuredData />
        {/* Subtle Ambient Mesh Backdrop */}
        <div className="absolute inset-0 -z-50 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.03)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
        <main className="flex-1">{children}</main>
        <PlatformFooter />
        <CookieBanner />
        <CommandPalette />
        <SessionSync />
        <GlassDock />
        <VersionBadge />
      </body>
    </html>
  );
}
