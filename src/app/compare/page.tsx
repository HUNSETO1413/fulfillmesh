import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CompareContent from "./CompareContent";

export const metadata: Metadata = pageMetadata({
  title: "Compare FulfillMesh vs Alternatives",
  description:
    "Compare FulfillMesh with ShipBob, Flexport, and Deliverr across global network, transparent pricing, shipping speed, technology, integrations, and support to find the right fulfillment partner.",
  path: "/compare",
  keywords: [
    "FulfillMesh vs ShipBob",
    "FulfillMesh vs Flexport",
    "FulfillMesh vs Deliverr",
    "fulfillment comparison",
    "best fulfillment provider",
  ],
});

export default function ComparePage() {
  return <CompareContent />;
}
