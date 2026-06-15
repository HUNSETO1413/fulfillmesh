import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Static public routes. Dynamic content routes (blog posts, guides, case
// studies, help-center articles) can be appended here as the content layer grows.
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/platform", priority: 0.9, changeFrequency: "monthly" },
  { path: "/platform/order-management", priority: 0.8, changeFrequency: "monthly" },
  { path: "/platform/quality-control", priority: 0.8, changeFrequency: "monthly" },
  { path: "/platform/shipping-logistics", priority: 0.8, changeFrequency: "monthly" },
  { path: "/platform/inventory-visibility", priority: 0.8, changeFrequency: "monthly" },
  { path: "/platform/analytics-reporting", priority: 0.8, changeFrequency: "monthly" },
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

// Dynamic content slugs. The blog/resource detail pages are rendered by shared
// [slug] templates (no generateStaticParams / DB lookup), so the canonical slugs
// are the concrete ones linked from the hub and detail pages. Source files:
//   - src/app/blog/page.tsx + src/app/blog/[slug]/page.tsx (hrefs)
//   - src/app/resources/case-studies/page.tsx (caseStudies array of 8 brands)
//   - src/app/resources/case-studies/[slug]/page.tsx (href)
//   - src/app/resources/guides/page.tsx + [slug]/page.tsx (href)
//   - src/app/resources/help-center/page.tsx + [slug]/page.tsx (href)
const BLOG_SLUGS = ["sample-post", "shipping-from-china"];

// Case-study slugs derived from the 8 brands in the case-studies hub array.
const CASE_STUDY_SLUGS = [
  "luxeglow",
  "threadline",
  "soundwave",
  "cozyhaus",
  "purely-you",
  "skinmuse",
  "stridefast",
  "megamart",
];

const GUIDE_SLUGS = ["supplier-vetting"];

const HELP_CENTER_SLUGS = ["getting-started"];

const DYNAMIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  ...BLOG_SLUGS.map((slug) => ({ path: `/blog/${slug}`, priority: 0.5, changeFrequency: "monthly" as const })),
  ...CASE_STUDY_SLUGS.map((slug) => ({ path: `/resources/case-studies/${slug}`, priority: 0.5, changeFrequency: "monthly" as const })),
  ...GUIDE_SLUGS.map((slug) => ({ path: `/resources/guides/${slug}`, priority: 0.5, changeFrequency: "monthly" as const })),
  ...HELP_CENTER_SLUGS.map((slug) => ({ path: `/resources/help-center/${slug}`, priority: 0.5, changeFrequency: "monthly" as const })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-12");
  return [...ROUTES, ...DYNAMIC_ROUTES].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
