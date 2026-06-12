import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Static public routes. Dynamic content routes (blog posts, guides, case
// studies, help-center articles) can be appended here as the content layer grows.
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/how-it-works", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
  { path: "/solutions/supplier-matching", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/quality-control", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/packaging-labeling", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/shipping-logistics", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/overseas-warehousing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/inventory-visibility", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/returns-management", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/analytics-reporting", priority: 0.8, changeFrequency: "monthly" },
  { path: "/integrations", priority: 0.7, changeFrequency: "monthly" },
  { path: "/compare", priority: 0.7, changeFrequency: "monthly" },
  { path: "/resources", priority: 0.7, changeFrequency: "weekly" },
  { path: "/resources/case-studies", priority: 0.6, changeFrequency: "weekly" },
  { path: "/resources/guides", priority: 0.6, changeFrequency: "weekly" },
  { path: "/resources/help-center", priority: 0.6, changeFrequency: "weekly" },
  { path: "/resources/shipping-insights", priority: 0.6, changeFrequency: "weekly" },
  { path: "/resources/supplier-playbooks", priority: 0.6, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/glossary", priority: 0.5, changeFrequency: "monthly" },
  { path: "/co-build-future", priority: 0.5, changeFrequency: "monthly" },
  { path: "/company/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/company/careers", priority: 0.5, changeFrequency: "weekly" },
  { path: "/company/partners", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/book-a-demo", priority: 0.8, changeFrequency: "yearly" },
  { path: "/get-started", priority: 0.7, changeFrequency: "yearly" },
  { path: "/packaging-requests", priority: 0.5, changeFrequency: "monthly" },
  { path: "/compliance", priority: 0.5, changeFrequency: "yearly" },
  { path: "/status", priority: 0.3, changeFrequency: "daily" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/cookies", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/data-processing", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-12");
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
