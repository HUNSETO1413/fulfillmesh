import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import IntegrationsContent from "./IntegrationsContent";

export const metadata: Metadata = pageMetadata({
  title: "Integration Marketplace",
  description:
    "Connect FulfillMesh with the tools you already use — Shopify, WooCommerce, Amazon, eBay, Salesforce, ShipStation, Slack, Zapier, and more. Sync data, automate workflows, and scale your operations.",
  path: "/integrations",
  keywords: [
    "FulfillMesh integrations",
    "Shopify fulfillment integration",
    "WooCommerce integration",
    "Amazon fulfillment integration",
    "e-commerce integrations",
  ],
});

export default function IntegrationsPage() {
  return <IntegrationsContent />;
}
