import { ProductShowcase, ProductShowcaseSchema } from "../schemas/product";

export const CANONICAL_PRODUCT_REGISTRY: ProductShowcase[] = [
  {
    productId: "omnistream",
    name: "OmniStream",
    tagline: "Personal Media Experience Platform",
    shortDescription: "Uniting ad-free web discovery (U-TUBE) with a cinematic fixed-aperture theater experience (CineMorph), orchestrated by the browser-native OmniStream Intelligence System.",
    longDescription: "OmniStream is a personal media experience platform that unites ad-free web video discovery with a cinematic fixed-aperture theater experience. CineMorph features CSS3D curved screens, velvet curtains, dynamic ambient lighting, fixed aspect ratios (1.43:1 IMAX GT, 1.90:1 Digital IMAX, Original, and 4:3), and a real-time Web Audio parametric DSP studio. The OmniStream Intelligence System (OMS) provides a 100% free, browser-native edge intelligence runtime executing on Canvas CV heuristics, Web Audio DSP, and Web Workers without server telemetry.",
    category: "Media & Streaming",
    badge: "AI Media",
    status: "online",
    requiredTier: "basic",
    price: 150,
    version: "v1.8.5",
    author: "Patnala Uday Kumar",
    githubUrl: "https://github.com/UdayPatnala/OmniStream",
    liveUrl: "https://0mnistream.vercel.app/",
    docsUrl: "https://github.com/UdayPatnala/OmniStream#architectural-documentation--intelligence",
    primaryCapabilities: [
      {
        title: "U-Tube Discovery Engine",
        description: "Lightweight, ad-free YouTube discovery engine with dynamic search, cached subscriptions, and client-side keyword recommendations."
      },
      {
        title: "CineMorph Theater",
        description: "Fixed-aperture theater supporting 1.43:1 (IMAX GT), 1.90:1 (Digital IMAX), Original, and 4:3 with CSS3D curved screens and ambient lighting."
      },
      {
        title: "OmniStream Intelligence (OMS)",
        description: "100% client-side edge runtime executing Canvas CV heuristics, Web Audio DSP, and off-thread Web Workers with progressive multi-tier fallback."
      }
    ],
    technologySummary: "TypeScript, React, Next.js / Vite, CSS3D, Web Audio Parametric DSP, Web Workers, Canvas CV",
    sourceOfTruth: "Authoritative GitHub repo (UdayPatnala/OmniStream) & verified Vercel deployment (0mnistream.vercel.app)",
    lastVerified: "2026-09-19T13:30:00Z",
    metadataVersion: "1.0.0"
  },
  {
    productId: "nebula",
    name: "Nebula",
    tagline: "Planet Intelligence Dashboard & Space Telemetry",
    shortDescription: "Live telemetry from Earth and space — astronomy, rocket launches, earthquakes, and solar weather, read from the sources that measure them.",
    longDescription: "Nebula is a planet intelligence dashboard delivering real-time telemetry from Earth and space. Acting as mission control for the curious, Nebula aggregates six live observation feeds into a unified dashboard: real-time space news, live ISS orbital tracking, seismic earth events, orbital rocket launch countdowns, daily NASA space imagery, and solar geomagnetic weather feeds.",
    category: "Space & Telemetry",
    badge: "Planet Intelligence",
    status: "online",
    requiredTier: "pro",
    price: 200,
    version: "v1.4.2",
    author: "Patnala Uday Kumar",
    githubUrl: "https://github.com/UdayPatnala/nebula",
    liveUrl: "https://nebula-tau-nine.vercel.app/",
    primaryCapabilities: [
      {
        title: "Live ISS Orbital Tracking",
        description: "Real-time orbital coordinates, velocity, and visual pass prediction for the International Space Station."
      },
      {
        title: "Seismic Earth Events",
        description: "Real-time global earthquake feeds and tectonic impact tracking read directly from scientific measurement sources."
      },
      {
        title: "Orbital Launch Cadence",
        description: "Live countdowns, launch pad telemetry, and mission profiles for global orbital rocket launches."
      },
      {
        title: "Solar Weather Telemetry",
        description: "Geomagnetic activity, solar flare monitoring, and space weather advisories."
      },
      {
        title: "NASA Space Imagery",
        description: "High-resolution daily astronomical photography and deep-space observations."
      }
    ],
    technologySummary: "React 19, TypeScript, Vite, Tailwind CSS, Space APIs (NASA, USGS, ISS telemetry)",
    sourceOfTruth: "Authoritative GitHub repo (UdayPatnala/nebula) & verified Vercel deployment (nebula-tau-nine.vercel.app)",
    lastVerified: "2026-09-10T04:12:00Z",
    metadataVersion: "1.0.0"
  },
  {
    productId: "music-mirror",
    name: "Music Mirror",
    tagline: "Emotion-Aware AI Music Player",
    shortDescription: "Real-time facial emotion detection driving adaptive music playback with 100% in-browser edge neural net inference.",
    longDescription: "Music Mirror is an emotion-aware AI music player where your face is the remote control. Using your webcam, Music Mirror detects facial expressions in real-time (happy, sad, calm, energetic) to automatically select and adapt music matching or enhancing your mood. All AI inference runs 100% client-side in the browser via face-api.js—no camera feed or biometric data ever leaves your device. Architecture features a 4-layer orchestration pipeline: EmotionLayer → IntentLayer → DiscoveryLayer → PlaybackLayer.",
    category: "AI & Audio",
    badge: "Emotion AI",
    status: "online",
    requiredTier: "basic",
    price: 100,
    version: "v1.2.0",
    author: "Patnala Uday Kumar",
    githubUrl: "https://github.com/UdayPatnala/Music-Mirror",
    liveUrl: "https://music-mirror-aos.vercel.app/",
    docsUrl: "https://github.com/UdayPatnala/Music-Mirror#architecture",
    primaryCapabilities: [
      {
        title: "Edge Emotion Detection",
        description: "100% in-browser neural network inference using face-api.js with zero server telemetry or camera data transmission."
      },
      {
        title: "Adaptive Mood Curation",
        description: "Dynamic intent mapping and playlist recommendations reacting to emotional state transitions."
      },
      {
        title: "Layered Audio Orchestration",
        description: "Clean 4-stage pipeline: EmotionLayer → IntentLayer → DiscoveryLayer → PlaybackLayer."
      }
    ],
    technologySummary: "React 19, TypeScript, Vite, face-api.js (TensorFlow.js edge), Zustand with localStorage persist",
    sourceOfTruth: "Authoritative GitHub repo (UdayPatnala/Music-Mirror) & verified Vercel deployment (music-mirror-aos.vercel.app)",
    lastVerified: "2026-09-19T13:30:00Z",
    metadataVersion: "1.0.0"
  },
  {
    productId: "spedex",
    name: "SpeDex",
    tagline: "Enterprise Smart Wallet & Financial Intelligence Platform",
    shortDescription: "High-frequency transaction tracking, automated trip ledgers, UPI vendor quick-pays, and spending velocity analytics inspired by INR currency aesthetics.",
    longDescription: "SpeDex (blending Speed Index and Spending Index) is an enterprise-grade smart wallet and financial intelligence platform. Designed for high-frequency expense logging and multi-currency budgeting, SpeDex features automated trip ledgers (with cash vs online splits), UPI vendor quick-pays, an interactive companion mobile sync simulator, IDOR-protected security architecture, and a curated aesthetic inspired by Indian Rupee currency notes paired with Cormorant Garamond and Sora typography.",
    category: "Fintech & Analytics",
    badge: "Smart Wallet",
    status: "development",
    requiredTier: "pro",
    price: 300,
    version: "v2.1.0",
    author: "Patnala Uday Kumar",
    githubUrl: "https://github.com/UdayPatnala/Spedex",
    docsUrl: "https://github.com/UdayPatnala/Spedex#readme",
    primaryCapabilities: [
      {
        title: "Automated Trip Ledger",
        description: "Session-based expense logging with cash vs card categorization, auto-close, and settlement breakdown summaries."
      },
      {
        title: "UPI Vendor Quick-Pay",
        description: "Instant vendor directory management, payment tracking, and one-tap payment routing."
      },
      {
        title: "Spending Velocity Analytics",
        description: "Multi-currency budget progress bars, category breakdowns, and real-time spending velocity charts."
      },
      {
        title: "Mobile Sync Simulator",
        description: "Embedded companion simulator in the web dashboard for real-time cross-platform mobile sync testing."
      },
      {
        title: "IDOR Enterprise Security",
        description: "Strict resource-ownership validation across all REST endpoints returning 403 Forbidden on unauthorized attempts."
      }
    ],
    technologySummary: "Java 17 / Spring Boot REST API (JPA, H2/PostgreSQL), React + Vite + TypeScript, Expo React Native, Kotlin Jetpack Compose",
    sourceOfTruth: "Authoritative GitHub repo (UdayPatnala/Spedex) & local repository README.md",
    lastVerified: "2026-09-10T04:12:00Z",
    metadataVersion: "1.0.0"
  },
  {
    productId: "javapath-pro",
    name: "JavaPath Pro",
    tagline: "Interactive Enterprise Java Learning Engine & Sandboxed Compilation Platform",
    shortDescription: "Master modern Java 17 LTS, design patterns, and enterprise workflows with an in-browser IDE, real-time compiler diagnostics, and AI Staff Code Mentor.",
    longDescription: "JavaPath Pro is a full-stack learning platform designed to train software engineers in modern Java (Java 17 LTS), architectural design patterns, and enterprise software engineering workflows. It emulates real corporate environments through an in-browser interactive IDE, real-time static compiler diagnostics (bracket matching, syntax hygiene), remote sandboxed Java execution, corporate backlog simulation tickets, and an intelligent Staff Code Mentor evaluating standard vs production-grade patterns.",
    category: "Developer Platform",
    badge: "Interactive Sandbox",
    status: "online",
    requiredTier: "pro",
    price: 150,
    version: "v1.1.0",
    author: "Patnala Uday Kumar",
    githubUrl: "https://github.com/UdayPatnala/Java-Path",
    liveUrl: "https://javapath-pro-aos.vercel.app/",
    docsUrl: "https://github.com/UdayPatnala/Java-Path#readme",
    primaryCapabilities: [
      {
        title: "In-Browser Interactive IDE",
        description: "Full code editor with syntax highlighting, auto-formatting, and diagnostic error overlays."
      },
      {
        title: "Static Compiler Diagnostics",
        description: "Pre-execution static parser evaluating bracket matching, semicolon hygiene, and syntax integrity."
      },
      {
        title: "Sandboxed Java 17 Runtime",
        description: "Remote sandbox execution compiling and running Java 17 programs with instant stdout/stderr return."
      },
      {
        title: "Corporate Backlog Simulation",
        description: "Guided engineering tickets simulating enterprise problems (Encapsulation, Auth Routers, Transaction Aggregators)."
      },
      {
        title: "Staff Code Mentor",
        description: "Contextual AI staff engineer evaluating submissions against standard vs production-grade architectural patterns."
      }
    ],
    technologySummary: "JavaScript / React, Java 17 LTS, AST Static Diagnostics, Remote Sandbox Execution",
    sourceOfTruth: "Authoritative GitHub repo (UdayPatnala/Java-Path) & verified Vercel deployment (javapath-pro-aos.vercel.app)",
    lastVerified: "2026-09-19T13:30:00Z",
    metadataVersion: "1.0.0"
  },
  {
    productId: "aros-wallet",
    name: "Aros Core Wallet",
    tagline: "Centralized Ecosystem Financial Engine",
    shortDescription: "Authorizes token credits and debits, provides tamper-evident audit ledgers, and powers cross-product transactions.",
    longDescription: "The Aros Core Wallet is the financial baseline of the AROH Platform. It maintains an immutable ledger of transactions, tier upgrades, and administrative adjustments across all interconnected applications.",
    category: "Core Service",
    badge: "Core Service",
    status: "internal",
    requiredTier: "basic",
    price: 0,
    version: "v1.0.1",
    author: "AROH Core Architecture Group",
    liveUrl: "/dashboard",
    primaryCapabilities: [
      {
        title: "Audited Ledger",
        description: "Cryptographic transaction ledger ensuring non-repudiation and immutable transaction records."
      },
      {
        title: "Membership Upgrades",
        description: "Instant access tier adjustments powered by Aros token settlements."
      }
    ],
    technologySummary: "TypeScript, Web Crypto API, Zustand Store, LocalStorage Event Bus",
    sourceOfTruth: "Aroh monorepo packages/asdk/src/services/firebase.ts & store",
    lastVerified: "2026-09-10T04:12:00Z",
    metadataVersion: "1.0.0"
  },
  {
    productId: "aroh-cms",
    name: "Aroh CMS Alerts",
    tagline: "Unified Announcement & Layout Engine",
    shortDescription: "Enables operators to schedule notifications, publish critical ecosystem banners, and configure public broadcasts.",
    longDescription: "Aroh CMS Alerts provides administrative editors with scheduled editorial tools to publish announcements directly to the ecosystem landing page and notification centers.",
    category: "Ecosystem Service",
    badge: "Ecosystem Service",
    status: "internal",
    requiredTier: "pro",
    price: 100,
    version: "v1.0.0",
    author: "AROH Content Team",
    liveUrl: "/cms",
    internalOnly: true,
    primaryCapabilities: [
      {
        title: "Scheduled Alerts",
        description: "Publish past, present, and future time-gated announcements."
      },
      {
        title: "Public Broadcast Banner",
        description: "High-priority warning and maintenance message routing across apps."
      }
    ],
    technologySummary: "TypeScript, Next.js Server Components, Zod Schema Validation",
    sourceOfTruth: "Aroh monorepo apps/web/app/cms",
    lastVerified: "2026-09-10T04:12:00Z",
    metadataVersion: "1.0.0"
  },
  {
    productId: "aros-metrics",
    name: "Aros Metrics Engine",
    tagline: "Ecosystem Telemetry & Journey Analytics",
    shortDescription: "Aggregates platform statistics, memory charts, ledger clearance times, and tracks active user journeys.",
    longDescription: "The Aros Metrics Engine provides platform operators with real-time operational visibility, tracking CPU load, active WebSocket sessions, ledger clearance latency, and conversion flows.",
    category: "Analytics",
    badge: "Analytics",
    status: "internal",
    requiredTier: "pro",
    price: 100,
    version: "v0.9.4-beta",
    author: "AROH DevOps Group",
    liveUrl: "/admin",
    internalOnly: true,
    primaryCapabilities: [
      {
        title: "Operational Telemetry",
        description: "Real-time telemetry and memory diagnostics across ecosystem services."
      },
      {
        title: "Ledger Performance",
        description: "Settlement latency and throughput analytics for token operations."
      }
    ],
    technologySummary: "TypeScript, Chart.js / SVG, Next.js API Routes",
    sourceOfTruth: "Aroh monorepo apps/web/app/admin",
    lastVerified: "2026-09-10T04:12:00Z",
    metadataVersion: "1.0.0"
  }
];

// Validate all registry entries at load time using Zod
CANONICAL_PRODUCT_REGISTRY.forEach((product) => {
  ProductShowcaseSchema.parse(product);
});

export interface ProductFilterOptions {
  category?: string;
  includeInternal?: boolean;
  searchQuery?: string;
}

export function getAllProducts(options?: ProductFilterOptions): ProductShowcase[] {
  return CANONICAL_PRODUCT_REGISTRY.filter((prod) => {
    if (prod.internalOnly && !options?.includeInternal) {
      return false;
    }
    if (options?.category && options.category !== "All" && prod.category !== options.category && prod.badge !== options.category) {
      return false;
    }
    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      const inName = prod.name.toLowerCase().includes(q);
      const inDesc = prod.shortDescription.toLowerCase().includes(q) || prod.longDescription.toLowerCase().includes(q);
      const inTech = prod.technologySummary.toLowerCase().includes(q);
      const inCaps = prod.primaryCapabilities.some(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
      if (!inName && !inDesc && !inTech && !inCaps) {
        return false;
      }
    }
    return true;
  });
}

export function getProductById(productId: string): ProductShowcase | undefined {
  return CANONICAL_PRODUCT_REGISTRY.find((p) => p.productId === productId);
}

export function getProductCategories(): string[] {
  const cats = new Set<string>();
  cats.add("All");
  CANONICAL_PRODUCT_REGISTRY.forEach((p) => {
    cats.add(p.category);
  });
  return Array.from(cats);
}

export type ProductDetails = ProductShowcase & {
  id: string;
  description: string;
  url?: string;
};

export const registeredProducts: ProductDetails[] = CANONICAL_PRODUCT_REGISTRY.map((p) => ({
  ...p,
  id: p.productId,
  description: p.shortDescription,
  url: p.liveUrl || p.githubUrl
}));

export function launchProductWebpage(
  prod: ProductShowcase | ProductDetails,
  router: { push: (url: string) => void }
): void {
  const targetUrl = prod.liveUrl || ("url" in prod ? prod.url : undefined);
  if (!targetUrl) {
    router.push(`/explore/${prod.productId || ("id" in prod ? prod.id : "")}`);
    return;
  }
  if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  } else {
    router.push(targetUrl);
  }
}

