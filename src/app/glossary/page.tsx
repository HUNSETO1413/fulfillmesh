"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Search, ChevronDown, ArrowRight,
  Boxes, ClipboardList, Box, Warehouse, ShoppingCart, Clock, MapPin, RotateCcw,
  FileText, Layers, Tag, ShieldCheck, Package, Repeat,
} from "lucide-react";

type Term = { letter: string; title: string; short: string; full: string; icon: LucideIcon };

const terms: Term[] = [
  { letter: "#", title: "3PL (Third-Party Logistics)", icon: Boxes,
    short: "A third-party logistics provider that manages storage, fulfillment, and shipping on behalf of businesses.",
    full: "FulfillMesh operates as a 3PL specializing in China-sourced products, adding sourcing, QC, and packaging on top of fulfillment." },
  { letter: "A", title: "ASN (Advanced Shipping Notice)", icon: ClipboardList,
    short: "An electronic notification sent by a supplier to inform a buyer about an upcoming shipment and its contents.",
    full: "An ASN is sent ahead of a delivery so the receiving warehouse can prepare for inbound stock, schedule dock time, and reconcile received goods against the order." },
  { letter: "S", title: "SKU (Stock Keeping Unit)", icon: Box,
    short: "A unique identifier for a specific product or variant used for inventory tracking.",
    full: "SKUs encode attributes like size, color, and packaging so inventory can be tracked precisely across locations." },
  { letter: "W", title: "WMS (Warehouse Management System)", icon: Warehouse,
    short: "Software used to manage and control warehouse operations and inventory.",
    full: "A WMS tracks inventory levels, manages storage locations, and coordinates receiving, picking, packing, and shipping." },
  { letter: "O", title: "Order Fulfillment", icon: ShoppingCart,
    short: "The end-to-end process of receiving an order, picking, packing, and shipping it to the customer.",
    full: "A smooth fulfillment flow ties inventory, warehouse operations, and carriers together to deliver accurately and on time." },
  { letter: "L", title: "Lead Time", icon: Clock,
    short: "The time between placing an order and receiving the goods.",
    full: "Lead time spans production, QC, and transit. Shorter, more predictable lead times reduce stockouts and safety-stock costs." },
  { letter: "L", title: "Last Mile Delivery", icon: MapPin,
    short: "The final step of delivery where the package is transported from a local hub to the customer's address.",
    full: "Often the most expensive leg of shipping; local warehousing brings inventory closer to customers to cut last-mile cost and time." },
  { letter: "R", title: "Reverse Logistics", icon: RotateCcw,
    short: "The process of managing returns, refunds, and the movement of goods from customers back to the seller.",
    full: "Efficient reverse logistics recovers value through restocking, refurbishment, or resale and improves customer experience." },
  { letter: "B", title: "BOL (Bill of Lading)", icon: FileText,
    short: "A legal document issued by a carrier detailing the type, quantity, and destination of goods being shipped.",
    full: "The BOL serves as a receipt of freight, a document of title, and a contract between the shipper and the carrier." },
  { letter: "D", title: "Dropshipping", icon: Repeat,
    short: "A fulfillment model where a store sells products without holding inventory; the supplier ships directly to the customer.",
    full: "FulfillMesh supports dropshipping with added quality control and custom branded packaging, so your brand experience stays consistent." },
  { letter: "F", title: "Fulfillment", icon: Package,
    short: "The complete process of receiving, processing, packaging, and shipping orders to end customers.",
    full: "Includes inventory management, pick-and-pack, labeling, and last-mile delivery coordination across one or more warehouses." },
  { letter: "M", title: "MOQ (Minimum Order Quantity)", icon: Layers,
    short: "The smallest quantity of a product that a supplier is willing to manufacture or sell in a single order.",
    full: "MOQs vary by product type, customization level, and factory size. FulfillMesh helps negotiate workable MOQs for growing brands." },
  { letter: "P", title: "Private Label", icon: Tag,
    short: "Products manufactured by one company and sold under another company's brand name.",
    full: "Allows brands to create unique products without owning factories. Pairs naturally with custom packaging and QC." },
  { letter: "Q", title: "QC (Quality Control)", icon: ShieldCheck,
    short: "The systematic inspection of products at various stages to ensure they meet specified quality standards.",
    full: "Includes pre-production, in-line, and pre-shipment inspections with photo and video documentation." },
];

const alphabet = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), "#"];

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = terms.filter((t) => {
    const mq = query === "" || (t.title + t.short + t.full).toLowerCase().includes(query.toLowerCase());
    const ml = letter === "All" || t.letter.toUpperCase() === letter;
    return mq && ml;
  });

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[#E2E8F0]" style={{ background: "linear-gradient(180deg,#F4F8FF 0%,#FFFFFF 100%)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-[40px] lg:text-[48px] font-bold text-[#1A202C] leading-tight">Glossary</h1>
            <p className="mt-4 text-[16px] text-[#6B7280] max-w-[460px] leading-relaxed">
              Find definitions for key terms and concepts used in logistics, e-commerce, and fulfillment.
            </p>
            <div className="mt-6 max-w-[460px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF] pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search glossary..."
                style={{ paddingLeft: "44px" }}
                className="w-full pr-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors"
              />
            </div>
          </div>
          {/* Book + magnifier illustration */}
          <div className="relative flex items-center justify-center" style={{ flex: "0 0 360px", width: "360px", height: "240px" }}>
            <div className="absolute rounded-[28px]" style={{ width: "320px", height: "220px", background: "rgba(16,185,129,0.12)" }} />
            <svg viewBox="0 0 220 150" className="relative" style={{ width: "300px" }}>
              {/* book */}
              <path d="M110 35 C95 25 60 22 38 30 L38 120 C60 112 95 115 110 125 Z" fill="#D1FAE5" stroke="#6EE7B7" strokeWidth="2" />
              <path d="M110 35 C125 25 160 22 182 30 L182 120 C160 112 125 115 110 125 Z" fill="#ECFDF5" stroke="#6EE7B7" strokeWidth="2" />
              <line x1="110" y1="35" x2="110" y2="125" stroke="#6EE7B7" strokeWidth="2" />
              {[48, 60, 72, 84].map((y) => (
                <line key={`l${y}`} x1="52" y1={y} x2="98" y2={y - 4} stroke="#A7F3D0" strokeWidth="2" opacity="0.7" />
              ))}
              {[48, 60, 72, 84].map((y) => (
                <line key={`r${y}`} x1="122" y1={y - 4} x2="168" y2={y} stroke="#A7F3D0" strokeWidth="2" opacity="0.7" />
              ))}
              {/* green bookmark */}
              <path d="M150 24 L166 24 L166 60 L158 52 L150 60 Z" fill="#10B981" />
              {/* magnifier */}
              <circle cx="150" cy="100" r="26" fill="#fff" stroke="#10B981" strokeWidth="5" />
              <circle cx="150" cy="100" r="26" fill="#10B981" opacity="0.08" />
              <line x1="170" y1="120" x2="190" y2="140" stroke="#10B981" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* A-Z + accordion */}
      <section className="bg-white">
        <div className="max-w-[1100px] mx-auto px-6 py-14 flex gap-8">
          {/* Letter sidebar */}
          <div className="hidden lg:block shrink-0" style={{ width: "64px" }}>
            <div className="sticky top-24 flex flex-col gap-1">
              {alphabet.map((l) => (
                <button
                  key={l}
                  onClick={() => setLetter(l)}
                  className={`text-center px-2 py-1.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer ${
                    letter === l
                      ? "bg-[#10B981] text-white"
                      : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="flex-1 min-w-0 space-y-3">
            {filtered.length === 0 && (
              <p className="text-[#6B7280] py-12 text-center text-[14px]">No terms found.</p>
            )}
            {filtered.map((t, i) => {
              const Icon = t.icon;
              const isOpen = open === i;
              return (
                <div key={t.title} className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
                  <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-start gap-4 p-4 text-left bg-[#FAFBFC] hover:bg-[#F3F4F6] transition-colors cursor-pointer">
                    <span className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#10B981]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-semibold text-[#1A202C]">{t.title}</p>
                      <p className="mt-1 text-[14px] text-[#6B7280] leading-relaxed">{t.short}</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-[#9CA3AF] shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <>
                      <div className="border-t border-[#E5E7EB]" />
                      <div className="px-4 py-4 pl-[72px]">
                        <p className="text-[14px] text-[#6B7280] leading-relaxed">{t.full}</p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Suggest a term */}
      <section className="bg-white pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-semibold text-[#1A202C]">Can&apos;t find the term you&apos;re looking for?</h2>
              <p className="mt-1 text-[14px] text-[#6B7280]">Let us know and we&apos;ll add it to the glossary.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-lg bg-[#10B981] hover:bg-[#059669] transition-colors whitespace-nowrap">
              Suggest a Term <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
