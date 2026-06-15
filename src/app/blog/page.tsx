import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import BlogContent from "./BlogContent";

export const metadata: Metadata = pageMetadata({
  title: "Blog: Supply Chain & E-commerce Fulfillment Insights",
  description:
    "Expert analysis and practical strategies on logistics, last-mile delivery, sustainable packaging, and AI-driven supply chain visibility for e-commerce brands.",
  path: "/blog",
  keywords: [
    "supply chain blog",
    "e-commerce fulfillment",
    "last-mile delivery",
    "logistics insights",
    "sustainable packaging",
  ],
});

export default function BlogPage() {
  return <BlogContent />;
}
