"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, X, Minus, ArrowRight,
  Globe, DollarSign, Zap, LayoutDashboard, Link2, Headphones, Target, Tag, Box, Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FinalCTA from "@/components/FinalCTA";

const tabs = ["At a Glance", "Features", "Pricing", "Integrations", "Best For"] as const;
type Tab = (typeof tabs)[number];

const columns = ["FulfillMesh", "ShipBob", "Flexport", "Deliverr"];

type Cell = { mark?: "yes" | "no" | "partial"; text: string };
type Row = { key: string; icon: LucideIcon; name: string; desc: string; cells: Cell[] };

const rows: Row[] = [
  {
    key: "network",
    icon: Globe, name: "Global Fulfillment Network", desc: "Multiple warehouses across US, EU and Asia",
    cells: [
      { mark: "yes", text: "50+ locations" },
      { mark: "yes", text: "40+ locations" },
      { mark: "yes", text: "20+ locations" },
      { mark: "yes", text: "20+ locations" },
    ],
  },
  {
    key: "pricing-transparency",
    icon: DollarSign, name: "Transparent Pricing", desc: "Upfront rates with no hidden fees",
    cells: [
      { mark: "yes", text: "Upfront & transparent" },
      { mark: "partial", text: "Some hidden fees" },
      { mark: "partial", text: "Quote-based" },
      { mark: "yes", text: "Transparent" },
    ],
  },
  {
    key: "shipping",
    icon: Zap, name: "Fast Shipping", desc: "2-day delivery in major markets",
    cells: [
      { mark: "yes", text: "2-day express" },
      { mark: "yes", text: "2-3 days" },
      { mark: "partial", text: "Varies" },
      { mark: "yes", text: "1-2 days" },
    ],
  },
  {
    key: "technology",
    icon: LayoutDashboard, name: "Technology & Dashboard", desc: "Real-time tracking and analytics",
    cells: [
      { mark: "yes", text: "Advanced dashboard" },
      { mark: "yes", text: "Good" },
      { mark: "yes", text: "Advanced" },
      { mark: "yes", text: "Basic" },
    ],
  },
  {
    key: "integrations",
    icon: Link2, name: "Integrations", desc: "E-commerce platforms, marketplaces, and more",
    cells: [
      { mark: "yes", text: "100+ integrations" },
      { mark: "yes", text: "90+ integrations" },
      { mark: "yes", text: "100+ integrations" },
      { mark: "yes", text: "30+ integrations" },
    ],
  },
  {
    key: "support",
    icon: Headphones, name: "Customer Support", desc: "Dedicated support when you need it",
    cells: [
      { mark: "yes", text: "24/7 dedicated" },
      { mark: "yes", text: "24/7" },
      { mark: "partial", text: "Business hours" },
      { mark: "yes", text: "24/7" },
    ],
  },
  {
    key: "best-for",
    icon: Target, name: "Best For", desc: "Ideal use cases",
    cells: [
      { text: "Growing brands & enterprises" },
      { text: "DTC brands & mid-market" },
      { text: "Large enterprises & complex supply chains" },
      { text: "DTC brands looking for fast delivery" },
    ],
  },
  {
    key: "starting-price",
    icon: Tag, name: "Starting Price", desc: "Fulfillment pricing",
    cells: [
      { text: "From $0.70 / order" },
      { text: "From $0.85 / order" },
      { text: "Custom quote" },
      { text: "From $0.65 / order" },
    ],
  },
];

// Which feature rows each tab surfaces. "At a Glance" shows everything;
// the others focus the table on the rows relevant to that lens.
const tabRowKeys: Record<Tab, string[]> = {
  "At a Glance": rows.map((r) => r.key),
  Features: ["network", "shipping", "technology", "support"],
  Pricing: ["pricing-transparency", "starting-price"],
  Integrations: ["integrations", "technology"],
  "Best For": ["best-for", "support", "network"],
};

const tabBlurb: Record<Tab, string> = {
  "At a Glance": "A full side-by-side of every dimension that matters when choosing a fulfillment partner.",
  Features: "Compare the core operational capabilities — network reach, shipping speed, technology, and support.",
  Pricing: "How transparent and competitive each provider is on cost.",
  Integrations: "Connectivity with your e-commerce stack and the depth of each platform's tooling.",
  "Best For": "Who each provider is the strongest fit for.",
};

function Mark({ mark }: { mark?: "yes" | "no" | "partial" }) {
  if (!mark) return null;
  if (mark === "yes")
    return (
      <span className="inline-flex w-6 h-6 rounded-full bg-teal items-center justify-center">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </span>
    );
  if (mark === "no")
    return (
      <span className="inline-flex w-6 h-6 rounded-full bg-red-500 items-center justify-center">
        <X className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </span>
    );
  return (
    <span className="inline-flex w-6 h-6 rounded-full bg-amber-400 items-center justify-center">
      <Minus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
    </span>
  );
}

export default function CompareContent() {
  const [activeTab, setActiveTab] = useState<Tab>("At a Glance");

  const visibleKeys = tabRowKeys[activeTab];
  const visibleRows = rows.filter((r) => visibleKeys.includes(r.key));

  return (
    <main>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-24 pb-16 lg:pt-28 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3.5 py-1 uppercase mb-5">
                Compare
              </span>
              <h1 className="text-[40px] lg:text-[48px] font-extrabold leading-[1.1] tracking-tight text-deep-navy">
                Comparison{" "}
                <span className="text-text-light">/ Alternatives</span>
              </h1>
              <p className="mt-5 text-[18px] text-text-body leading-[1.6] max-w-[520px]">
                Not sure if FulfillMesh is right for you? Compare us with other
                popular logistics and fulfillment solutions.
              </p>
            </div>

            {/* Comparison clipboard illustration */}
            <div className="hidden lg:flex items-center justify-center relative">
              {/* Decorative accents */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-soft-bg/70" aria-hidden="true" />
              <div className="absolute -bottom-2 right-8 w-16 h-16 rounded-full bg-teal/80" aria-hidden="true" />
              <span className="absolute left-8 bottom-10 text-action-blue/30 text-2xl select-none" aria-hidden="true">+</span>
              <span className="absolute right-6 top-1/2 text-action-blue/30 text-2xl select-none" aria-hidden="true">+</span>

              <div className="relative w-[380px]">
                {/* Clip */}
                <div className="absolute left-1/2 -top-3 -translate-x-1/2 w-24 h-7 rounded-md bg-action-blue z-10 flex items-center justify-center shadow-button">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/90" />
                </div>
                {/* Clipboard body */}
                <div className="rounded-2xl bg-[#EEF3FB] border border-border-soft shadow-card pt-7 pb-6 px-6">
                  <div className="rounded-xl bg-white border border-border-soft p-5">
                    {/* Column icon header */}
                    <div className="grid grid-cols-3 gap-3 pb-4 mb-1">
                      {[
                        <span key="fm" className="text-[15px] font-extrabold"><span className="text-deep-navy">F</span><span className="text-teal">M</span></span>,
                        <Box key="box" className="w-6 h-6 text-action-blue" strokeWidth={1.75} />,
                        <Truck key="truck" className="w-6 h-6 text-deep-navy" strokeWidth={1.75} />,
                      ].map((node, i) => (
                        <div key={i} className="flex justify-center">
                          <span className="w-14 h-14 rounded-xl bg-soft-bg inline-flex items-center justify-center">
                            {node}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Rows of marks */}
                    {[
                      ["yes", "yes", "yes"],
                      ["yes", "partial", "yes"],
                      ["yes", "partial", "no"],
                      ["yes", "yes", "yes"],
                    ].map((row, ri) => (
                      <div key={ri} className="grid grid-cols-3 gap-3 py-3 border-t border-border-soft/70">
                        {row.map((m, ci) => (
                          <div key={ci} className="flex justify-center text-text-muted">
                            {m === "yes" ? (
                              <Check className="w-4 h-4 text-teal" strokeWidth={3} />
                            ) : m === "partial" ? (
                              <Minus className="w-4 h-4 text-amber-400" strokeWidth={3} />
                            ) : (
                              <X className="w-4 h-4 text-text-muted" strokeWidth={3} />
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Floating teal check badge */}
                <span className="absolute -bottom-4 right-6 w-11 h-11 rounded-full bg-teal inline-flex items-center justify-center shadow-button ring-4 ring-white z-10">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + Table */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((t) => {
              const active = t === activeTab;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveTab(t)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${
                    active
                      ? "bg-deep-navy text-white"
                      : "bg-white text-text-body border border-border-soft hover:bg-white/80"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <p className="mb-10 text-[15px] text-text-muted leading-relaxed max-w-[680px]">
            {tabBlurb[activeTab]}
          </p>

          <div className="overflow-x-auto rounded-xl border border-border-soft shadow-soft bg-white">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="bg-soft-bg border-b border-border-soft">
                  <th className="text-left py-4 px-5 text-[13px] font-semibold text-text-muted w-[260px]">
                    Feature
                  </th>
                  {columns.map((c, i) => (
                    <th
                      key={c}
                      className={`text-center py-4 px-4 text-[14px] font-bold ${
                        i === 0
                          ? "text-teal bg-teal/[0.06]"
                          : "text-deep-navy"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 justify-center">
                        {i === 0 && (
                          <span className="w-5 h-5 rounded gradient-logo inline-flex items-center justify-center">
                            <span className="text-white text-[7px] font-bold">FM</span>
                          </span>
                        )}
                        {c}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, ri) => {
                  const RowIcon = row.icon;
                  return (
                    <tr
                      key={row.key}
                      className={`border-b border-border-soft last:border-b-0 ${
                        ri % 2 === 1 ? "bg-soft-bg/40" : ""
                      }`}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-start gap-3">
                          <span className="w-8 h-8 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0">
                            <RowIcon className="w-4 h-4 text-action-blue" />
                          </span>
                          <div>
                            <p className="text-[14px] font-semibold text-deep-navy leading-tight">
                              {row.name}
                            </p>
                            <p className="text-[12px] text-text-muted leading-snug mt-0.5">
                              {row.desc}
                            </p>
                          </div>
                        </div>
                      </td>
                      {row.cells.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`py-4 px-4 text-center align-middle ${
                            ci === 0 ? "bg-teal/[0.03]" : ""
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1.5">
                            <Mark mark={cell.mark} />
                            <span
                              className={`text-[12px] leading-snug ${
                                ci === 0
                                  ? "text-deep-navy font-medium"
                                  : "text-text-body"
                              }`}
                            >
                              {cell.text}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pb-24">
          <div className="rounded-2xl bg-[#EEF3F9] border border-border-soft px-10 py-12 text-center">
            <h2 className="text-[28px] font-bold text-deep-navy">
              Not what you&apos;re looking for?
            </h2>
            <p className="mt-4 text-[16px] text-text-body max-w-[480px] mx-auto leading-relaxed">
              Our team can help you find the best fulfillment solution for your business needs.
              Talk to an expert or get started for free.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy bg-white border border-border-blue rounded-[10px] hover:shadow-soft transition-all"
              >
                Talk to an Expert
              </Link>
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA
        headline="Ready to find the right fulfillment partner?"
        subtitle="Start your journey with FulfillMesh today."
        primaryText="Get Started Free"
        secondaryText="Book a Demo"
      />
    </main>
  );
}
