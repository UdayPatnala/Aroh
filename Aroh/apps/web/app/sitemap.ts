import { MetadataRoute } from "next";
import { CANONICAL_PRODUCT_REGISTRY } from "@aroh/asdk";

const BASE_URL = "https://aroh-os.vercel.app";
const LAST_MODIFIED = new Date("2026-09-11T12:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/announcements`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/ai`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic Product Detail Pages from Canonical Showcase Registry
  const productRoutes: MetadataRoute.Sitemap = CANONICAL_PRODUCT_REGISTRY.map(
    (product) => ({
      url: `${BASE_URL}/explore/${product.productId}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  // Legal & Platform Governance Routes
  const legalRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/terms`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/acceptable-use`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Privacy, Consent & DPDP Act 2023 Compliance Routes
  const privacyRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/privacy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy/consent`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy/rights`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy/grievance`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy/security`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy/retention`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy/ai`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  return [...coreRoutes, ...productRoutes, ...legalRoutes, ...privacyRoutes];
}
