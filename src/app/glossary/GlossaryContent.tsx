"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Search, ChevronDown, Lightbulb,
  Boxes, ClipboardList, Box, Warehouse, ShoppingCart, Clock, MapPin, RotateCcw,
  FileText, Layers, Tag, ShieldCheck, Package, Repeat,
} from "lucide-react";

type Term = {
  letter: string;
  title: string;
  short: string;
  full: string;
  icon: LucideIcon;
  /** "blue" | "teal" icon tint */
  tone: "blue" | "teal";
};

const terms: Term[] = [
  { letter: "#", title: "3PL (Third-Party Logistics)", icon: Boxes, tone: "blue",
    short: "A third-party logistics provider that manages storage, fulfillment, and shipping on behalf of businesses.",
    full: "FulfillMesh operates as a 3PL specializing in China-sourced products, adding sourcing, QC, and packaging on top of fulfillment." },
  { letter: "A", title: "ASN (Advanced Shipping Notice)", icon: ClipboardList, tone: "teal",
    short: "An electronic notification sent by a supplier to inform a buyer about an upcoming shipment and its contents.",
    full: "An ASN is sent ahead of a delivery so the receiving warehouse can prepare for inbound stock, schedule dock time, and reconcile received goods against the order." },
  { letter: "S", title: "SKU (Stock Keeping Unit)", icon: Box, tone: "blue",
    short: "A unique identifier for a specific product or variant used for inventory tracking.",
    full: "SKUs encode attributes like size, color, and packaging so inventory can be tracked precisely across locations." },
  { letter: "W", title: "WMS (Warehouse Management System)", icon: Warehouse, tone: "teal",
    short: "Software used to manage and control warehouse operations and inventory.",
    full: "A WMS tracks inventory levels, manages storage locations, and coordinates receiving, picking, packing, and shipping." },
  { letter: "O", title: "Order Fulfillment", icon: ShoppingCart, tone: "blue",
    short: "The end-to-end process of receiving an order, picking, packing, and shipping it to the customer.",
    full: "A smooth fulfillment flow ties inventory, warehouse operations, and carriers together to deliver accurately and on time." },
  { letter: "L", title: "Lead Time", icon: Clock, tone: "teal",
    short: "The time between placing an order and receiving the goods.",
    full: "Lead time spans production, QC, and transit. Shorter, more predictable lead times reduce stockouts and safety-stock costs." },
  { letter: "L", title: "Last Mile Delivery", icon: MapPin, tone: "blue",
    short: "The final step of delivery where the package is transported from a local hub to the customer's address.",
    full: "Often the most expensive leg of shipping; local warehousing brings inventory closer to customers to cut last-mile cost and time." },
  { letter: "R", title: "Reverse Logistics", icon: RotateCcw, tone: "teal",
    short: "The process of managing returns, refunds, and the movement of goods from customers back to the seller.",
    full: "Efficient reverse logistics recovers value through restocking, refurbishment, or resale and improves customer experience." },
  { letter: "B", title: "BOL (Bill of Lading)", icon: FileText, tone: "blue",
    short: "A legal document issued by a carrier detailing the type, quantity, and destination of goods being shipped.",
    full: "The BOL serves as a receipt of freight, a document of title, and a contract between the shipper and the carrier." },
  { letter: "D", title: "Dropshipping", icon: Repeat, tone: "teal",
    short: "A fulfillment model where a store sells products without holding inventory; the supplier ships directly to the customer.",
    full: "FulfillMesh supports dropshipping with added quality control and custom branded packaging, so your brand experience stays consistent." },
  { letter: "F", title: "Fulfillment", icon: Package, tone: "blue",
    short: "The complete process of receiving, processing, packaging, and shipping orders to end customers.",
    full: "Includes inventory management, pick-and-pack, labeling, and last-mile delivery coordination across one or more warehouses." },
  { letter: "M", title: "MOQ (Minimum Order Quantity)", icon: Layers, tone: "teal",
    short: "The smallest quantity of a product that a supplier is willing to manufacture or sell in a single order.",
    full: "MOQs vary by product type, customization level, and factory size. FulfillMesh helps negotiate workable MOQs for growing brands." },
  { letter: "P", title: "Private Label", icon: Tag, tone: "blue",
    short: "Products manufactured by one company and sold under another company's brand name.",
    full: "Allows brands to create unique products without owning factories. Pairs naturally with custom packaging and QC." },
  { letter: "Q", title: "QC (Quality Control)", icon: ShieldCheck, tone: "teal",
    short: "The systematic inspection of products at various stages to ensure they meet specified quality standards.",
    full: "Includes pre-production, in-line, and pre-shipment inspections with photo and video documentation." },
];

const alphabet = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), "#"];

export default function GlossaryContent() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = terms.filter((t) => {
    const mq = query === "" || (t.title + t.short + t.full).toLowerCase().includes(query.toLowerCase());
    const ml = letter === "All" || t.letter.toUpperCase() === letter;
    return mq && ml;
  });

  return (
    <div className="bg-white">
      {/* ===== Hero ===== */}
      <section className="border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-14 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-[44px] font-bold text-deep-navy leading-tight tracking-[-0.02em]">
              Glossary
            </h1>
            <p className="mt-4 text-[16px] text-text-body max-w-[460px] leading-relaxed">
              A quick reference to common terms used in logistics, e-commerce, and
              fulfillment.
            </p>
          </div>
          {/* Book + magnifier illustration */}
          <div className="relative hidden md:flex items-center justify-center" style={{ flex: "0 0 360px", width: "360px", height: "220px" }}>
            <div className="absolute rounded-[28px]" style={{ width: "320px", height: "200px", background: "rgba(0,184,148,0.10)" }} />
            <svg viewBox="0 0 220 150" className="relative" style={{ width: "300px" }} aria-hidden>
              <path d="M110 35 C95 25 60 22 38 30 L38 120 C60 112 95 115 110 125 Z" fill="#E1ECFB" stroke="#9BC0F0" strokeWidth="2" />
              <path d="M110 35 C125 25 160 22 182 30 L182 120 C160 112 125 115 110 125 Z" fill="#F1F6FE" stroke="#9BC0F0" strokeWidth="2" />
              <line x1="110" y1="35" x2="110" y2="125" stroke="#9BC0F0" strokeWidth="2" />
              {[48, 60, 72, 84].map((y) => (
                <line key={`l${y}`} x1="52" y1={y} x2="98" y2={y - 4} stroke="#C9DBF3" strokeWidth="2" opacity="0.8" />
              ))}
              {[48, 60, 72, 84].map((y) => (
                <line key={`r${y}`} x1="122" y1={y - 4} x2="168" y2={y} stroke="#C9DBF3" strokeWidth="2" opacity="0.8" />
              ))}
              <path d="M150 24 L166 24 L166 60 L158 52 L150 60 Z" fill="#00B894" />
              <circle cx="150" cy="100" r="26" fill="#fff" stroke="#0057D8" strokeWidth="5" />
              <circle cx="150" cy="100" r="26" fill="#0057D8" opacity="0.06" />
              <line x1="170" y1="120" x2="190" y2="140" stroke="#0057D8" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== Search ===== */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-light pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terms..."
              style={{ paddingLeft: "44px" }}
              className="w-full pr-4 py-3 rounded-lg border border-border-soft bg-white text-sm text-text-body placeholder:text-text-light focus:outline-none focus:border-border-blue transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ===== A-Z + accordion ===== */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-10 flex gap-10">
          {/* Letter sidebar */}
          <div className="hidden lg:block shrink-0" style={{ width: "56px" }}>
            <div className="sticky top-24 flex flex-col gap-0.5">
              {alphabet.map((l) => (
                <button
                  key={l}
                  onClick={() => setLetter(l)}
                  className={`text-center px-2 py-1.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer ${
                    letter === l
                      ? "bg-[#EAF1FB] text-action-blue"
                      : "text-text-muted hover:bg-soft-bg hover:text-deep-navy"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="flex-1 min-w-0 divide-y divide-border-soft border-y border-border-soft">
            {filtered.length === 0 && (
              <p className="text-text-muted py-12 text-center text-[14px]">No terms found.</p>
            )}
            {filtered.map((t, i) => {
              const Icon = t.icon;
              const isOpen = open === i;
              return (
                <div key={t.title}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start gap-4 py-5 text-left hover:bg-soft-bg/60 transition-colors cursor-pointer"
                  >
                    <span
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        t.tone === "blue" ? "bg-[#EAF1FB] text-action-blue" : "bg-teal/10 text-teal"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-bold text-deep-navy">{t.title}</p>
                      <p className="mt-1 text-[14px] text-text-body leading-relaxed">{t.short}</p>
                      {isOpen && (
                        <p className="mt-3 text-[14px] text-text-muted leading-relaxed">{t.full}</p>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-text-light shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Suggest a term ===== */}
      <section className="bg-white pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="rounded-xl bg-[#EFF4FC] border border-border-blue px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-action-blue">
                <Lightbulb className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-[17px] font-bold text-deep-navy">
                  Can&apos;t find what you&apos;re looking for?
                </h2>
                <p className="mt-1 text-[14px] text-text-body">
                  If you have a term you&apos;d like us to add, please let us know.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-action-blue rounded-lg border border-border-blue bg-white hover:bg-soft-bg transition-colors whitespace-nowrap"
            >
              Suggest a Term
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
