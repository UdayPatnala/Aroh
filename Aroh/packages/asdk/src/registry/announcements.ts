import {
  EcosystemAnnouncement,
  EcosystemAnnouncementSchema,
  AnnouncementStatus,
  AnnouncementType
} from "../schemas/announcement";

/**
 * Official Verified AROH Community Feedback Channel
 * NOTE: This is exclusively a community and product-idea channel.
 * It is NOT a formal support, security, legal, or payment-dispute portal.
 */
export const OFFICIAL_AROH_INSTAGRAM_URL = "https://www.instagram.com/aroh.0s/";

export const OFFICIAL_COMMUNITY_FEEDBACK_INFO = {
  headline: "Have an idea for AROH?",
  subheadline: "Help shape what AROH builds next.",
  prompt: "Tell us what you want to see next.",
  ctaLabel: "Send suggestion on Instagram",
  instagramUrl: OFFICIAL_AROH_INSTAGRAM_URL,
  contextualCopy:
    "Use AROH's official Instagram DM to share product ideas, feature requests, and ecosystem suggestions.",
  disclosureNotice:
    "Suggestions are reviewed by the AROH team; submitting an idea does not guarantee implementation. For security concerns, use official responsible disclosure channels.",
  prohibitedTopics: [
    "Passwords or secret keys",
    "Credit card or payment credentials",
    "Authentication codes or session tokens",
    "Private personal identity documents"
  ]
};

/**
 * Canonical Ecosystem Announcements Registry
 * Single authoritative source of truth for upcoming developments, releases, and ecosystem roadmaps.
 */
export const CANONICAL_ANNOUNCEMENT_REGISTRY: EcosystemAnnouncement[] = [
  {
    id: "google-play-billing",
    title: "Google Play Billing for Aros — Future Android Top-Up Channel",
    shortDescription:
      "Architecting future Android native billing integration allowing users to top up Aros credits through Google Play.",
    fullDescription:
      "AROH is exploring an extensible Android billing channel utilizing Google Play Billing for Aros top-ups. The AROH Aros Ledger remains the sole authoritative source of truth for all balances. This capability is strictly in architectural planning and is not available for purchase on the current website or mobile application.",
    type: "FUTURE",
    status: "IN_DEVELOPMENT",
    publishDate: "2026-09-30",
    targetReleaseDate: "Future Direction",
    priority: "IMPORTANT",
    featured: true,
    archived: false,
    cta: "Learn More",
    ctaUrl: "/announcements#google-play-billing"
  },
  {
    id: "google-play-rewards",
    title: "Google Play Rewards & Points for Aros — Future Architecture Concept",
    shortDescription:
      "Conceptual framework exploring future integration with Google Play loyalty rewards, subject to official platform authorization.",
    fullDescription:
      "AROH is researching an extensible rewards integration model for Android devices. Google Play Points and Google Play Billing are distinct systems; Play Points are not directly transferable or convertible into Aros unless officially authorized and supported by Google. Any future integration will enforce server-side 18+ age restrictions, strict cryptographic idempotency, and reconciliation directly against the AROH Aros ledger.",
    type: "FUTURE",
    status: "UPCOMING",
    publishDate: "2026-09-30",
    targetReleaseDate: "Conceptual Roadmap",
    priority: "NORMAL",
    featured: false,
    archived: false,
    cta: "Architecture Details",
    ctaUrl: "/announcements#google-play-rewards"
  },
  {
    id: "omnistream-cinemorph",
    title: "OmniStream CineMorph & Edge Intelligence Upgrades",
    shortDescription:
      "Enhanced cinematic fixed-aperture theater and edge-native media processing for AROH's flagship streaming engine.",
    fullDescription:
      "OmniStream v1.8.5 continues to lead AROH as the primary flagship product, uniting ad-free video discovery with client-side edge computer vision and audio DSP transformations without server-side telemetry tracking.",
    type: "PRODUCT",
    status: "RELEASED",
    publishDate: "2026-09-19",
    productId: "omnistream",
    priority: "FEATURED",
    featured: true,
    archived: false,
    cta: "Launch OmniStream ↗",
    ctaUrl: "https://0mnistream.vercel.app/"
  },
  {
    id: "spedex-future-launch",
    title: "SpeDex Enterprise Smart Wallet — Future Launch",
    shortDescription:
      "High-frequency expense tracking, automated trip ledgers, and UPI vendor quick-pays in active development.",
    fullDescription:
      "SpeDex represents AROH's upcoming fintech and smart wallet platform. Sourced from the canonical repository, it is currently in private development and will transition to a live release following internal security and beta validation.",
    type: "PRODUCT",
    status: "ANNOUNCED",
    publishDate: "2026-09-20",
    productId: "spedex",
    targetReleaseDate: "Future Launch Stage",
    priority: "IMPORTANT",
    featured: true,
    archived: false,
    cta: "Inspect Roadmap",
    ctaUrl: "/explore/spedex"
  },
  {
    id: "javapath-pro-ide",
    title: "JavaPath Pro Sandboxed Compiler 2.0 & Cloud Workspaces",
    shortDescription:
      "Interactive Java 17 JVM sandbox with enterprise design pattern challenges and code mentoring.",
    fullDescription:
      "JavaPath Pro delivers in-browser JVM code execution, corporate backlog simulation, and automated compiler diagnostics for enterprise engineering mastery.",
    type: "PRODUCT",
    status: "IN_DEVELOPMENT",
    publishDate: "2026-09-18",
    productId: "javapath-pro",
    targetReleaseDate: "Continuous Rolling",
    priority: "FEATURED",
    featured: false,
    archived: false,
    cta: "Launch JavaPath ↗",
    ctaUrl: "https://javapath-pro-aos.vercel.app/"
  },
  {
    id: "music-mirror-mood",
    title: "Music Mirror Emotion Visualizer & Real-Time Sync",
    shortDescription:
      "Real-time edge facial emotion detection and adaptive Spotify playlist curation.",
    fullDescription:
      "Music Mirror integrates real-time emotion recognition with dynamic audio visualization and Spotify playback synchronization using zero-telemetry local inference.",
    type: "PRODUCT",
    status: "RELEASED",
    publishDate: "2026-09-15",
    productId: "music-mirror",
    priority: "NORMAL",
    featured: false,
    archived: false,
    cta: "Launch Music Mirror ↗",
    ctaUrl: "https://music-mirror-aos.vercel.app/"
  },
  {
    id: "enterprise-team-wallets",
    title: "Federated Enterprise Multi-Tenant Engine (Phase 5)",
    shortDescription:
      "Team shared wallets, monthly spending quotas, SAML 2.0 / SCIM 2.0 directory federation, and organization audit.",
    fullDescription:
      "Phase 5 multi-tenant architecture provides enterprise organizations with role-based member spending controls and directory federation without altering consumer single sign-on.",
    type: "ECOSYSTEM",
    status: "RELEASED",
    publishDate: "2026-09-27",
    priority: "FEATURED",
    featured: false,
    archived: false,
    cta: "Organization Dashboard",
    ctaUrl: "/dashboard/organization"
  }
];

// Validate that every registered announcement adheres to the strict Zod schema
CANONICAL_ANNOUNCEMENT_REGISTRY.forEach((ann) => {
  EcosystemAnnouncementSchema.parse(ann);
});

/**
 * Returns all announcements matching optional filter parameters
 */
export function getAllAnnouncements(filters?: {
  type?: AnnouncementType;
  status?: AnnouncementStatus;
  productId?: string;
  includeArchived?: boolean;
}): EcosystemAnnouncement[] {
  return CANONICAL_ANNOUNCEMENT_REGISTRY.filter((ann) => {
    if (!filters?.includeArchived && ann.archived) return false;
    if (filters?.type && ann.type !== filters.type) return false;
    if (filters?.status && ann.status !== filters.status) return false;
    if (filters?.productId && ann.productId !== filters.productId) return false;
    return true;
  });
}

/**
 * Returns featured announcements for high-visibility showcase surfaces
 */
export function getFeaturedAnnouncements(): EcosystemAnnouncement[] {
  return CANONICAL_ANNOUNCEMENT_REGISTRY.filter(
    (ann) => !ann.archived && (ann.featured || ann.priority === "IMPORTANT")
  );
}

/**
 * Returns an announcement by its unique identifier
 */
export function getAnnouncementById(id: string): EcosystemAnnouncement | undefined {
  return CANONICAL_ANNOUNCEMENT_REGISTRY.find((ann) => ann.id === id);
}

/**
 * Returns announcements linked to a specific canonical product
 */
export function getAnnouncementsByProduct(productId: string): EcosystemAnnouncement[] {
  return CANONICAL_ANNOUNCEMENT_REGISTRY.filter(
    (ann) => !ann.archived && ann.productId === productId
  );
}

/**
 * Returns announcements grouped into timeline stages: CURRENT, IN_DEVELOPMENT, COMING_SOON, FUTURE
 */
export function getTimelineAnnouncements(): {
  current: EcosystemAnnouncement[];
  inDevelopment: EcosystemAnnouncement[];
  comingSoon: EcosystemAnnouncement[];
  future: EcosystemAnnouncement[];
} {
  return {
    current: CANONICAL_ANNOUNCEMENT_REGISTRY.filter(
      (a) => !a.archived && a.status === "RELEASED"
    ),
    inDevelopment: CANONICAL_ANNOUNCEMENT_REGISTRY.filter(
      (a) => !a.archived && a.status === "IN_DEVELOPMENT"
    ),
    comingSoon: CANONICAL_ANNOUNCEMENT_REGISTRY.filter(
      (a) => !a.archived && a.status === "ANNOUNCED"
    ),
    future: CANONICAL_ANNOUNCEMENT_REGISTRY.filter(
      (a) => !a.archived && a.status === "UPCOMING"
    )
  };
}
