import type { Metadata } from "next";
import GlossaryContent from "./GlossaryContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Glossary: Logistics, E-commerce & Fulfillment Terms",
  description:
    "A quick reference to common terms used in logistics, e-commerce, and fulfillment — from 3PL and SKU to lead time, last-mile delivery, and reverse logistics.",
  path: "/glossary",
  keywords: [
    "logistics glossary",
    "fulfillment terms",
    "3PL",
    "SKU",
    "supply chain definitions",
  ],
});

export default function GlossaryPage() {
  return <GlossaryContent />;
}
