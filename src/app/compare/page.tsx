import Link from "next/link";
import {
  Check, X, Minus, ArrowRight,
  Globe, DollarSign, Zap, LayoutDashboard, Link2, Headphones, Target, Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FinalCTA from "@/components/FinalCTA";

const tabs = ["All e-Brands", "Features", "Pricing", "Integrations", "Best For"];
const columns = ["FulfillMesh", "ShipBob", "Flexport", "Deliverr"];

type Cell = { mark?: "yes" | "no" | "partial"; text: string };
type Row = { icon: LucideIcon; name: string; desc: string; cells: Cell[] };

const rows: Row[] = [
  {
    icon: Globe, name: "Global Fulfillment Network", desc: "Vetted suppliers across China, US, EU & Asia",
    cells: [
      { mark: "yes", text: "60+ locations" },
      { mark: "yes", text: "40+ locations" },
      { mark: "yes", text: "Global freight" },
      { mark: "partial", text: "US-focused" },
    ],
  },
  {
    icon: DollarSign, name: "Transparent Pricing", desc: "Upfront pricing with no hidden fees",
    cells: [
      { mark: "yes", text: "Upfront & transparent" },
      { mark: "partial", text: "Some hidden fees" },
      { mark: "no", text: "Quote-based" },
      { mark: "yes", text: "Flat-rate" },
    ],
  },
  {
    icon: Zap, name: "Fast Shipping", desc: "2-day delivery or less",
    cells: [
      { mark: "yes", text: "2-day or less" },
      { mark: "yes", text: "2-day" },
      { mark: "no", text: "Freight timelines" },
      { mark: "yes", text: "2-day" },
    ],
  },
  {
    icon: LayoutDashboard, name: "Technology & Dashboard", desc: "Real-time tracking and analytics",
    cells: [
      { mark: "yes", text: "Advanced dashboard" },
      { mark: "yes", text: "Standard" },
      { mark: "yes", text: "Advanced" },
      { mark: "partial", text: "Basic" },
    ],
  },
  {
    icon: Link2, name: "Integrations", desc: "Connect with your store and tools",
    cells: [
      { mark: "yes", text: "100+ integrations" },
      { mark: "yes", text: "80+ integrations" },
      { mark: "yes", text: "60+ integrations" },
      { mark: "yes", text: "40+ integrations" },
    ],
  },
  {
    icon: Headphones, name: "Customer Support", desc: "Dedicated support when you need it",
    cells: [
      { mark: "yes", text: "24/7 dedicated" },
      { mark: "yes", text: "24/7" },
      { mark: "partial", text: "Business hours" },
      { mark: "partial", text: "Business hours" },
    ],
  },
  {
    icon: Target, name: "Best For", desc: "Who each platform fits best",
    cells: [
      { text: "Growing brands & enterprises" },
      { text: "SMB & mid-market" },
      { text: "Enterprise & freight" },
      { text: "SMB & startups" },
    ],
  },
  {
    icon: Tag, name: "Starting Price", desc: "Entry cost to get started",
    cells: [
      { text: "From $0.10 / order" },
      { text: "From $0.85 / order" },
      { text: "Custom quote" },
      { text: "From $0.95 / order" },
    ],
  },
];

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

export default function ComparePage() {
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

            {/* Comparison illustration card */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-[360px] bg-white rounded-2xl shadow-card border border-[#E2E8F0] p-6">
                {/* Column icon header */}
                <div className="grid grid-cols-4 gap-4 pb-4 border-b border-border-soft">
                  <div className="flex justify-center">
                    <span className="w-11 h-11 rounded-xl gradient-logo inline-flex items-center justify-center shadow-sm">
                      <span className="text-white text-[12px] font-bold">FM</span>
                    </span>
                  </div>
                  {["SB", "FP", "DL"].map((c, i) => (
                    <div key={i} className="flex justify-center">
                      <span className="w-11 h-11 rounded-xl bg-soft-bg border border-border-soft inline-flex items-center justify-center">
                        <span className="text-[12px] font-bold text-text-muted">{c}</span>
                      </span>
                    </div>
                  ))}
                </div>
                {/* Rows of marks */}
                {[
                  ["yes", "yes", "partial", "no"],
                  ["yes", "partial", "no", "yes"],
                  ["yes", "yes", "no", "yes"],
                  ["yes", "partial", "partial", "no"],
                ].map((row, ri) => (
                  <div key={ri} className="grid grid-cols-4 gap-4 py-4 border-b border-border-soft/50 last:border-0">
                    {row.map((m, ci) => (
                      <div key={ci} className="flex justify-center">
                        <Mark mark={m as "yes" | "no" | "partial"} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + Table */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {tabs.map((t, i) => (
              <span
                key={t}
                className={`px-5 py-2.5 rounded-full text-[13px] font-semibold cursor-default transition-colors ${
                  i === 0
                    ? "bg-deep-navy text-white"
                    : "bg-white text-text-body border border-border-soft hover:bg-white/80"
                }`}
              >
                {t}
              </span>
            ))}
          </div>

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
                {rows.map((row, ri) => {
                  const RowIcon = row.icon;
                  return (
                    <tr
                      key={ri}
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
