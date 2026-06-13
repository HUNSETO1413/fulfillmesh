import type { Metadata } from "next";
import {
  BarChart3, DollarSign, Clock, ShieldCheck, FileSpreadsheet, Gauge,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import PlatformLayout from "@/components/PlatformLayout";

export const metadata: Metadata = pageMetadata({
  title: "Analytics & Reporting",
  description:
    "Measure landed cost, lead time, defect rate and on-time delivery per SKU, supplier and lane. FulfillMesh turns cross-border fulfillment data into reports your finance team can use.",
  path: "/platform/analytics-reporting",
  keywords: [
    "fulfillment analytics",
    "landed cost analysis",
    "supplier performance reporting",
    "logistics kpi dashboard",
    "ecommerce operations reporting",
  ],
});

const heroStats = [
  { label: "Avg. Landed Cost", value: "$6.84", delta: "-3.2%" },
  { label: "Avg. Lead Time", value: "11.2 days", delta: "-1.4 d" },
  { label: "Defect Rate", value: "0.9%", delta: "-0.3 pp" },
  { label: "On-Time Delivery", value: "97.4%", delta: "+2.1 pp" },
];

const costBreak: { l: string; pct: number; color: string }[] = [
  { l: "Goods", pct: 52, color: "#0057D8" },
  { l: "Freight", pct: 23, color: "#00B894" },
  { l: "Duties & customs", pct: 14, color: "#F59E0B" },
  { l: "QC & handling", pct: 11, color: "#94A3B8" },
];

function HeroMockup() {
  return (
    <div className="bg-white rounded-2xl border border-border-soft shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-bold text-deep-navy">Operations Overview</span>
        <span className="text-[11px] text-text-muted">Last 30 days</span>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {heroStats.map((s) => (
          <div key={s.label} className="border border-border-soft rounded-lg p-2">
            <p className="text-[7px] text-text-muted leading-tight">{s.label}</p>
            <p className="text-[13px] font-bold text-deep-navy leading-tight mt-0.5">{s.value}</p>
            <p className="text-[7px] font-medium text-teal mt-0.5">{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="border border-border-soft rounded-lg p-3 mb-3">
        <p className="text-[10px] font-semibold text-deep-navy mb-2">Landed cost trend</p>
        <svg viewBox="0 0 260 50" className="w-full h-auto">
          <polyline fill="rgba(0,184,148,0.1)" stroke="none" points="0,18 40,22 80,16 120,28 160,24 200,34 260,38 260,50 0,50" />
          <polyline fill="none" stroke="#00B894" strokeWidth="1.6" points="0,18 40,22 80,16 120,28 160,24 200,34 260,38" />
        </svg>
      </div>
      <div className="border border-border-soft rounded-lg p-3">
        <p className="text-[10px] font-semibold text-deep-navy mb-2">Landed cost breakdown</p>
        <div className="flex h-2 rounded-full overflow-hidden mb-2">
          {costBreak.map((c) => (
            <div key={c.l} style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {costBreak.map((c) => (
            <div key={c.l} className="flex items-center justify-between text-[8px]">
              <span className="flex items-center gap-1 text-text-body">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} /> {c.l}
              </span>
              <span className="text-text-muted">{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OutcomeMockup() {
  const rows: { name: string; onTime: string; defect: string; lead: string; color: string }[] = [
    { name: "Shenzhen Lumi Co.", onTime: "98.6%", defect: "0.4%", lead: "9.1 d", color: "text-teal" },
    { name: "Yiwu Brightline", onTime: "94.2%", defect: "1.8%", lead: "12.4 d", color: "text-[#F59E0B]" },
    { name: "Dongguan Forma", onTime: "89.7%", defect: "3.1%", lead: "14.8 d", color: "text-[#E11D48]" },
    { name: "Ningbo Crest", onTime: "96.9%", defect: "0.7%", lead: "10.2 d", color: "text-teal" },
  ];
  return (
    <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-bold text-deep-navy">Supplier Scorecard</p>
        <span className="text-[10px] text-text-muted">Quarter to date</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-border-soft">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-soft-bg">
              {["Supplier", "On-Time", "Defect", "Lead"].map((c) => (
                <th key={c} className="px-3 py-2 text-[9px] font-semibold text-text-muted">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-border-soft">
                <td className="px-3 py-2.5 text-[10px] font-semibold text-deep-navy">{r.name}</td>
                <td className={`px-3 py-2.5 text-[10px] font-medium ${r.color}`}>{r.onTime}</td>
                <td className="px-3 py-2.5 text-[10px] text-text-body">{r.defect}</td>
                <td className="px-3 py-2.5 text-[10px] text-text-body">{r.lead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-4 text-[11px] font-semibold text-white bg-navy rounded-md px-3 py-1.5 inline-flex items-center gap-1.5">
        <FileSpreadsheet className="w-3 h-3" /> Export to CSV
      </button>
    </div>
  );
}

export default function AnalyticsReportingPlatformPage() {
  return (
    <PlatformLayout
      eyebrow="ANALYTICS & REPORTING"
      title="The true cost of every order,"
      highlight="finally visible."
      heroDesc="FulfillMesh measures landed cost, lead time, defect rate and on-time delivery per SKU, supplier and lane — then turns it into reports your operations and finance teams actually use."
      heroPills={["Landed cost per SKU", "Supplier scorecards", "Exportable reports"]}
      mockup={<HeroMockup />}
      narrativeTitle="You cannot improve what you cannot measure"
      narrativeSubtitle="When data lives in supplier emails, carrier invoices and three spreadsheets, the numbers that matter never get calculated."
      narrative={[
        {
          problem: "Nobody can say what a unit truly costs to land after goods, freight, duties and QC.",
          solution: "Landed cost is calculated per SKU and per order, fully broken down by component.",
        },
        {
          problem: "Supplier and carrier performance is anecdotal, so renewals are based on gut feel.",
          solution: "Scorecards rank every supplier and lane on on-time rate, defect rate and lead time.",
        },
        {
          problem: "Finance asks for a report and operations spends a day rebuilding it from raw files.",
          solution: "Reports are generated on demand and exported to CSV or your BI tool in seconds.",
        },
      ]}
      capabilitiesTitle="Metrics that drive real decisions"
      capabilitiesSubtitle="Purpose-built KPIs for cross-border China-to-global fulfillment."
      capabilities={[
        { icon: DollarSign, title: "Landed Cost Analysis", desc: "Break true per-unit cost into goods, freight, duties, QC and handling — by SKU and by order." },
        { icon: Clock, title: "Lead Time Tracking", desc: "Measure end-to-end lead time per supplier and lane to set delivery promises you can keep." },
        { icon: ShieldCheck, title: "Quality Trends", desc: "Track defect and pass rates over time to spot suppliers drifting before it costs you." },
        { icon: Gauge, title: "On-Time Performance", desc: "Monitor on-time delivery by carrier and lane and flag chronic underperformers." },
        { icon: BarChart3, title: "Custom Dashboards", desc: "Build views by channel, region, product line or supplier for the team that needs them." },
        { icon: FileSpreadsheet, title: "Exports & Schedules", desc: "Export to CSV, push to your BI stack, or schedule reports to land in your inbox." },
      ]}
      outcomesTitle="Run fulfillment on numbers, not hunches"
      outcomes={[
        "Price products with confidence using true landed cost",
        "Renew and replace suppliers based on hard performance data",
        "Spot rising defect or delay trends before they hurt",
        "Give finance clean, exportable reports on demand",
      ]}
      outcomeMockup={<OutcomeMockup />}
      ctaTitle="Turn fulfillment data into decisions"
      ctaDesc="See how FulfillMesh measures cost, quality and speed across your entire supply chain."
      prevLink={{ href: "/platform/inventory-visibility", label: "Inventory Visibility" }}
    />
  );
}
