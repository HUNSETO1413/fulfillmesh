import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ResourcesContent from "./ResourcesContent";

export const metadata: Metadata = pageMetadata({
  title: "Fulfillment Resources: Guides, Case Studies & Tools",
  description:
    "Expert guides, real customer case studies, and practical tools to help e-commerce brands streamline sourcing, quality control, and shipping from China.",
  path: "/resources",
  keywords: [
    "fulfillment resources",
    "China sourcing guides",
    "e-commerce logistics",
    "supply chain tools",
    "shipping insights",
  ],
});

export default function ResourcesPage() {
  return <ResourcesContent />;
}
