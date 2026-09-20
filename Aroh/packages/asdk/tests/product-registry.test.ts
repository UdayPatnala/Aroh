import { describe, it, expect } from "vitest";
import {
  CANONICAL_PRODUCT_REGISTRY,
  getAllProducts,
  getProductById,
  getProductCategories,
  ProductShowcaseSchema,
  ProductStatusSchema
} from "../src/index";

describe("Canonical Product Showcase Registry", () => {
  it("has registered products conforming to ProductShowcaseSchema", () => {
    expect(CANONICAL_PRODUCT_REGISTRY.length).toBeGreaterThan(0);
    CANONICAL_PRODUCT_REGISTRY.forEach((product) => {
      const parsed = ProductShowcaseSchema.safeParse(product);
      expect(parsed.success).toBe(true);
    });
  });

  it("includes all verified flagship products", () => {
    const ids = CANONICAL_PRODUCT_REGISTRY.map((p) => p.productId);
    expect(ids).toContain("omnistream");
    expect(ids).toContain("nebula");
    expect(ids).toContain("music-mirror");
    expect(ids).toContain("spedex");
    expect(ids).toContain("javapath-pro");
  });

  it("truthfully captures verified live URLs for active deployments", () => {
    const omni = getProductById("omnistream");
    expect(omni?.liveUrl).toBe("https://0mnistream.vercel.app/");
    expect(omni?.status).toBe("online");

    const nebula = getProductById("nebula");
    expect(nebula?.liveUrl).toBe("https://nebula-tau-nine.vercel.app/");
    expect(nebula?.status).toBe("online");

    const music = getProductById("music-mirror");
    expect(music?.liveUrl).toBe("https://music-mirror-aos.vercel.app/");
    expect(music?.status).toBe("online");

    // JavaPath Pro — verified live 2026-09-19
    const javapath = getProductById("javapath-pro");
    expect(javapath?.liveUrl).toBe("https://javapath-pro-aos.vercel.app/");
    expect(javapath?.status).toBe("online");
  });

  it("truthfully marks offline or in-development products without guessing URLs", () => {
    const spedex = getProductById("spedex");
    expect(spedex?.status).toBe("development");
    expect(spedex?.liveUrl).toBeUndefined();
    expect(spedex?.githubUrl).toBe("https://github.com/UdayPatnala/Spedex");

    // JavaPath Pro is now live — verified Vercel deployment confirmed 2026-09-19
    const javapath = getProductById("javapath-pro");
    expect(javapath?.status).toBe("online");
    expect(javapath?.liveUrl).toBe("https://javapath-pro-aos.vercel.app/");
    expect(javapath?.githubUrl).toBe("https://github.com/UdayPatnala/Java-Path");
  });

  it("filters products by category and internal flag", () => {
    const publicProducts = getAllProducts();
    const internalServices = publicProducts.filter((p) => p.internalOnly);
    expect(internalServices.length).toBe(0);

    const withInternal = getAllProducts({ includeInternal: true });
    expect(withInternal.length).toBeGreaterThan(publicProducts.length);

    const spaceProducts = getAllProducts({ category: "Space & Telemetry" });
    expect(spaceProducts.length).toBe(1);
    expect(spaceProducts[0].productId).toBe("nebula");
  });

  it("filters products by search query across name, description, and capabilities", () => {
    const telemetryMatches = getAllProducts({ searchQuery: "telemetry" });
    expect(telemetryMatches.some((p) => p.productId === "nebula")).toBe(true);

    const theaterMatches = getAllProducts({ searchQuery: "CineMorph" });
    expect(theaterMatches.some((p) => p.productId === "omnistream")).toBe(true);

    const faceMatches = getAllProducts({ searchQuery: "face-api.js" });
    expect(faceMatches.some((p) => p.productId === "music-mirror")).toBe(true);
  });

  it("returns distinct list of categories", () => {
    const categories = getProductCategories();
    expect(categories).toContain("All");
    expect(categories).toContain("Media & Streaming");
    expect(categories).toContain("Space & Telemetry");
    expect(categories).toContain("AI & Audio");
    expect(categories).toContain("Fintech & Analytics");
    expect(categories).toContain("Developer Platform");
  });
});
