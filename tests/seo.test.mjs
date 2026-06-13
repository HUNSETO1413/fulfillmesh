import test from "node:test";
import assert from "node:assert/strict";
import { pageMetadata, organizationJsonLd, SITE_URL, SITE_NAME } from "../src/lib/seo.ts";

test("pageMetadata builds title, canonical and Open Graph for a content page", () => {
  const meta = pageMetadata({
    title: "Quality Control",
    description: "Inspections at the source.",
    path: "/solutions/quality-control",
    keywords: ["qc", "inspection"],
  });

  assert.deepEqual(meta.title, { absolute: `Quality Control | ${SITE_NAME}` });
  assert.equal(meta.description, "Inspections at the source.");
  assert.deepEqual(meta.keywords, ["qc", "inspection"]);
  assert.equal(meta.alternates.canonical, `${SITE_URL}/solutions/quality-control`);

  assert.equal(meta.openGraph.title, `Quality Control | ${SITE_NAME}`);
  assert.equal(meta.openGraph.url, `${SITE_URL}/solutions/quality-control`);
  assert.equal(meta.openGraph.siteName, SITE_NAME);
  assert.equal(meta.openGraph.type, "website");
  assert.deepEqual(meta.openGraph.images, [{ url: "/opengraph-image.png" }]);

  assert.equal(meta.twitter.card, "summary_large_image");
  assert.deepEqual(meta.twitter.images, ["/opengraph-image.png"]);
});

test("pageMetadata special-cases the home path '/' (no brand suffix, bare URL)", () => {
  const meta = pageMetadata({
    title: "FulfillMesh — China-powered fulfillment",
    description: "Home.",
    path: "/",
  });

  assert.deepEqual(meta.title, { absolute: "FulfillMesh — China-powered fulfillment" });
  assert.equal(meta.alternates.canonical, SITE_URL, "root canonical has no trailing path");
  assert.equal(meta.openGraph.url, SITE_URL);
});

test("pageMetadata honours custom ogImage and noindex robots", () => {
  const indexed = pageMetadata({ title: "T", description: "D", path: "/p" });
  assert.equal(indexed.robots, undefined, "default pages omit robots override");

  const hidden = pageMetadata({
    title: "Secret",
    description: "D",
    path: "/secret",
    ogImage: "/custom-og.png",
    noindex: true,
  });
  assert.deepEqual(hidden.robots, { index: false, follow: false });
  assert.deepEqual(hidden.openGraph.images, [{ url: "/custom-og.png" }]);
  assert.deepEqual(hidden.twitter.images, ["/custom-og.png"]);
});

test("organizationJsonLd emits valid schema.org Organization data", () => {
  const jsonLd = organizationJsonLd();
  assert.equal(jsonLd["@context"], "https://schema.org");
  assert.equal(jsonLd["@type"], "Organization");
  assert.equal(jsonLd.name, SITE_NAME);
  assert.equal(jsonLd.url, SITE_URL);
  assert.equal(jsonLd.logo, `${SITE_URL}/logo.png`);
  assert.ok(Array.isArray(jsonLd.sameAs) && jsonLd.sameAs.length >= 1);
});
