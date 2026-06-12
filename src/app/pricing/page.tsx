import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PricingContent from "./PricingContent";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Simple, transparent pricing for China-powered fulfillment. Flexible plans that connect you with vetted partners — no setup fees, no hidden costs, cancel anytime.",
  path: "/pricing",
  keywords: [
    "fulfillment pricing",
    "china fulfillment cost",
    "ecommerce fulfillment plans",
  ],
});

export default function PricingPage() {
  return <PricingContent />;
}
