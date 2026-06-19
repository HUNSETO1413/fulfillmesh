import type { Metadata } from "next";
import Link from "next/link";
import {
  Eye, Building2, Bell, Truck, Box, BarChart3, ArrowRight, CheckCircle2,
  Users, Warehouse, MonitorCheck,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Real-Time Inventory Visibility",
  description:
    "Track stock in real time across every warehouse, supplier, and sales channel. Get multi-warehouse visibility, low-stock alerts, and SKU-level insights to prevent stockouts.",
  path: "/solutions/inventory-visibility",
  keywords: [
    "inventory visibility",
    "real-time inventory tracking",
    "multi-warehouse inventory",
    "stock level management",
    "ecommerce inventory software",
  ],
});

const heroStats = [
  { label: "Total On Hand", value: "1,245,320", delta: "+8.4%" },
  { label: "Available to Sell", value: "910,462", delta: "+7.2%" },
  { label: "In Transit", value: "245,892", delta: "+5.1%" },
  { label: "Stock Accuracy", value: "96.5%", delta: "+1.3%" },
  { label: "Reserved", value: "88,966", delta: "+4.2%" },
  { label: "Low Stock SKUs", value: "128", delta: "-6.3%" },
];

const features = [
  { icon: Eye, title: "Real-time Stock Sync", desc: "Inventory updates in real time across all sales channels, warehouses, and suppliers — always accurate, always current." },
  { icon: Building2, title: "Multi-Warehouse Visibility", desc: "View on-hand, reserved, and available inventory across every location from a single, unified dashboard." },
  { icon: Bell, title: "Low-Stock Alerts", desc: "Automated alerts notify you before stock runs low — so you can reorder and replenish without delay." },
  { icon: Truck, title: "Order Status Tracking", desc: "Track inventory as it flows from suppliers to warehouses to customers with full lifecycle visibility." },
  { icon: Box, title: "SKU-Level Insights", desc: "Drill down to SKU level for deeper visibility into stock performance, velocity, and inventory health." },
  { icon: BarChart3, title: "Demand Planning Visibility", desc: "Use historical trends and real-time data to forecast demand and plan with confidence." },
];

const works = [
  { icon: Users, title: "Suppliers", desc: "Inventory data syncs directly from suppliers and manufacturers." },
  { icon: Warehouse, title: "Warehouses", desc: "Stock updates in real time as inventory arrives, moves, and is stored." },
  { icon: Truck, title: "Orders", desc: "Orders, allocations, and shipments update instantly across all channels." },
  { icon: MonitorCheck, title: "Your Dashboard", desc: "See the full picture and make faster, smarter inventory decisions." },
];

const dashBullets = [
  "Live inventory across all locations",
  "Filter by SKU, location, or channel",
  "Spot issues early and take action",
  "Export data and share reports",
];

const outcomeBullets = [
  "Improve planning accuracy",
  "Reduce stockouts",
  "Lower excess inventory",
  "Increase fulfillment control",
];

const insightStats = [
  { label: "Stock Turnover", value: "5.6x", delta: "+0.3" },
  { label: "Sell-Through", value: "97.4%", delta: "+2.1%" },
  { label: "Stockout Rate", value: "1.2%", delta: "-0.4%" },
  { label: "Days of Supply", value: "28", delta: "-3" },
];

export default function InventoryVisibilityPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">OUR SOLUTIONS</span>
              <h1 className="mt-5 text-[36px] lg:text-[46px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                Inventory Visibility<br />See every stock movement.{" "}
                <span className="gradient-text-teal">Make every decision count.</span>
              </h1>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh gives you real-time visibility across all warehouses, suppliers, and channels — so you always know what you have, where it is, and what&apos;s next.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">Book a Demo <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-navy rounded-[10px] border border-border-soft bg-white hover:shadow-soft transition-all">See It in Action</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {["Real-time Data", "Multi-Warehouse", "Accurate & Actionable"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body"><CheckCircle2 className="w-4 h-4 text-teal" /> {t}</span>
                ))}
              </div>
            </div>
            {/* Hero dashboard */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-deep-navy">Inventory Overview</span>
                <span className="text-[11px] text-text-muted">May 1 – May 18, 2025</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {heroStats.map((s) => (
                  <div key={s.label} className="border border-border-soft rounded-lg p-2.5">
                    <p className="text-[9px] text-text-muted leading-none mb-1">{s.label}</p>
                    <p className="text-[14px] font-bold text-deep-navy leading-tight">{s.value}</p>
                    <p className={`text-[9px] font-medium mt-0.5 ${s.delta.startsWith("-") ? "text-text-muted" : "text-teal"}`}>{s.delta}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border-soft rounded-lg p-3">
                  <p className="text-[10px] font-semibold text-deep-navy mb-2">Inventory Trend</p>
                  <svg viewBox="0 0 140 50" className="w-full h-auto">
                    <polyline fill="none" stroke="#0057D8" strokeWidth="1.5" points="0,40 20,30 40,35 60,20 80,25 100,12 120,18 140,8" />
                  </svg>
                </div>
                <div className="border border-border-soft rounded-lg p-3 flex items-center gap-3">
                  <svg viewBox="0 0 50 50" className="w-14 h-14 shrink-0">
                    {/* total circumference for r=18 ≈ 113 */}
                    <circle cx="25" cy="25" r="18" fill="none" stroke="#00B894" strokeWidth="7" strokeDasharray="45 68" transform="rotate(-90 25 25)" />
                    <circle cx="25" cy="25" r="18" fill="none" stroke="#0057D8" strokeWidth="7" strokeDasharray="34 79" strokeDashoffset="-45" transform="rotate(-90 25 25)" />
                    <circle cx="25" cy="25" r="18" fill="none" stroke="#003B7A" strokeWidth="7" strokeDasharray="22 91" strokeDashoffset="-79" transform="rotate(-90 25 25)" />
                    <circle cx="25" cy="25" r="18" fill="none" stroke="#E6EDF5" strokeWidth="7" strokeDasharray="12 101" strokeDashoffset="-101" transform="rotate(-90 25 25)" />
                  </svg>
                  <div className="space-y-1">
                    <p className="text-[9px] font-semibold text-deep-navy mb-0.5">By Location</p>
                    {[
                      { c: "#00B894", l: "Los Angeles", v: "40%" },
                      { c: "#0057D8", l: "Dallas", v: "30%" },
                      { c: "#003B7A", l: "Newark", v: "19%" },
                      { c: "#E6EDF5", l: "Chicago", v: "11%" },
                    ].map((d) => (
                      <div key={d.l} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.c }} />
                        <span className="text-[8px] text-text-muted leading-none">{d.l}</span>
                        <span className="text-[8px] text-deep-navy font-semibold leading-none ml-auto">{d.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">Complete visibility across your inventory</h2>
            <p className="mt-3 text-[16px] text-text-body">Powerful features to help you see more, act faster, and avoid costly stockouts.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-border-soft hover:shadow-card transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center shrink-0"><f.icon className="w-5 h-5 text-action-blue" /></div>
                  <div>
                    <h3 className="text-[15px] font-bold text-deep-navy">{f.title}</h3>
                    <p className="mt-2 text-[13px] text-text-body leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One dashboard */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">ONE CONNECTED PLATFORM</span>
              <h2 className="mt-5 text-[30px] font-bold text-deep-navy leading-tight">One dashboard. Total inventory clarity.</h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[420px]">Monitor inventory in real time across your entire supply chain. Filter by location, channel, or SKU and act on insights instantly.</p>
              <div className="mt-6 space-y-3">
                {dashBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-teal shrink-0" /><span className="text-[14px] text-text-body">{b}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-deep-navy">Inventory</span>
                <span className="text-[11px] text-text-muted">All Channels</span>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-text-muted border-b border-border-soft">
                    <th className="pb-2 font-medium">SKU</th>
                    <th className="pb-2 font-medium">Product</th>
                    <th className="pb-2 font-medium">Location</th>
                    <th className="pb-2 font-medium">On Hand</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["SKU-1201", "Wireless Headphones", "Los Angeles, CA", "5,420", "In Stock"],
                    ["SKU-0892", "Smart Watch", "Dallas, TX", "1,210", "Low Stock"],
                    ["SKU-0455", "Portable Speaker", "Chicago, IL", "3,470", "In Stock"],
                    ["SKU-0738", "USB-C Charger", "Newark, NJ", "8,940", "In Stock"],
                    ["SKU-0612", "Fitness Tracker", "Dallas, TX", "640", "Low Stock"],
                    ["SKU-0310", "Laptop Stand", "Newark, NJ", "0", "Out of Stock"],
                  ].map((r) => {
                    const statusColor =
                      r[4] === "Out of Stock" ? "text-text-muted" : r[4] === "Low Stock" ? "text-action-blue" : "text-teal";
                    return (
                      <tr key={r[0]} className="border-t border-border-soft text-[10px]">
                        <td className="py-2.5 font-semibold text-deep-navy">{r[0]}</td>
                        <td className="py-2.5 text-text-body">{r[1]}</td>
                        <td className="py-2.5 text-text-body">{r[2]}</td>
                        <td className="py-2.5 text-text-body">{r[3]}</td>
                        <td className={`py-2.5 font-medium ${statusColor}`}>{r[4]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <h2 className="text-[30px] font-bold text-deep-navy">How inventory visibility works</h2>
            <p className="mt-3 text-[16px] text-text-body">Real-time data flows across your supply chain — so you always know what&apos;s happening.</p>
          </div>
          <div className="relative grid md:grid-cols-4 gap-6">
            {works.map((w, i) => (
              <div key={w.title} className="relative bg-soft-bg rounded-xl border border-border-soft p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-action-blue/10 flex items-center justify-center shrink-0"><w.icon className="w-5 h-5 text-action-blue" /></div>
                  <h3 className="text-[15px] font-bold text-deep-navy">{w.title}</h3>
                </div>
                <p className="text-[13px] text-text-muted leading-relaxed">{w.desc}</p>
                {i < works.length - 1 && (<ArrowRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-4 h-4 text-[#ABB9DB]" />)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Better outcomes */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[30px] font-bold text-deep-navy leading-tight">Better visibility. Better outcomes.</h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[420px]">Inventory visibility empowers your team to plan better, reduce risk, and deliver more.</p>
              <div className="mt-6 space-y-3">
                {outcomeBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-teal shrink-0" /><span className="text-[14px] text-text-body">{b}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
              <p className="text-[13px] font-bold text-deep-navy mb-4">Insights that drive results</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {insightStats.map((s) => (
                  <div key={s.label} className="border border-border-soft rounded-lg p-3">
                    <p className="text-[16px] font-bold text-deep-navy">{s.value}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
                    <p className="text-[10px] font-medium text-teal mt-0.5">{s.delta}</p>
                  </div>
                ))}
              </div>
              <div className="border border-border-soft rounded-lg p-3">
                <p className="text-[10px] font-semibold text-deep-navy mb-2">Inventory Value Over Time</p>
                <svg viewBox="0 0 280 50" className="w-full h-auto">
                  <polyline fill="none" stroke="#0057D8" strokeWidth="1.5" points="0,40 40,30 80,33 120,20 160,25 200,12 240,16 280,8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="rounded-2xl text-white text-center px-6 py-14" style={{ background: "linear-gradient(135deg, #001F5E 0%, #00216A 50%, #001B52 100%)" }}>
            <h2 className="text-[30px] font-bold leading-tight">Ready to gain total inventory visibility?</h2>
            <p className="mt-3 text-[16px] text-text-on-dark-muted">Get real-time clarity across every warehouse, SKU, and channel.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">Book a Demo <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] border border-white/30 hover:bg-white/10 transition-all">See It in Action</Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["Free to get started", "No obligations", "Personalized walkthroughs"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-on-dark-soft"><CheckCircle2 className="w-4 h-4 text-teal" /> {t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
