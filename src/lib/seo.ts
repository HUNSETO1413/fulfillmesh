import type { Metadata } from "next";

// Centralised SEO helpers. Per-page metadata is built with `pageMetadata` so
// titles, canonicals and Open Graph tags stay consistent across the marketing site.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fulfillmesh.com").replace(/\/$/, "");
export const SITE_NAME = "FulfillMesh";
export const DEFAULT_OG_IMAGE = "/opengraph-image.png";

interface PageMetaInput {
  title: string;
  description: string;
  path: string; // e.g. "/solutions/quality-control"
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  noindex,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
  return {
    // absolute bypasses the root layout's "%s | FulfillMesh" title template so
    // the brand suffix is not duplicated.
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

// JSON-LD structured data for the organization (rendered in the root layout).
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "FulfillMesh connects global e-commerce brands with China-powered fulfillment resources — suppliers, quality control, packaging, shipping routes and overseas warehousing.",
    sameAs: [
      "https://www.linkedin.com/company/fulfillmesh",
      "https://twitter.com/fulfillmesh",
    ],
  };
}
