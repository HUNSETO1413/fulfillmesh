import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart, ShieldCheck, Truck, Eye, BarChart3,
  ArrowRight, ChevronRight, CheckCircle2, TrendingUp, Globe,
  Layers, Zap, Clock,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The FulfillMesh Platform",
  description:
    "One control center for global fulfillment. FulfillMesh unifies orders, quality control, shipping, inventory, and analytics for brands moving products from China to customers worldwide.",
  path: "/platform",
  keywords: [
    "fulfillment platform",
    "china fulfillment software",
    "cross-border ecommerce platform",
    "order and inventory management",
    "global logistics dashboard",
  ],
});

const modules = [
  {
    icon: ShoppingCart,
    title: "Order Management",
    desc: "Capture every order from Shopify, Amazon, Walmart, TikTok Shop and wholesale in one inbox, then route it to the right China supplier or warehouse automatically.",
    href: "/platform/order-management",
  },
  {
    icon: ShieldCheck,
    title: "Quality Control",
    desc: "Book pre-shipment inspections, review photo and video evidence, and approve or reject lots before goods ever leave the factory floor.",
    href: "/platform/quality-control",
  },
  {
    icon: Truck,
    title: "Shipping & Logistics",
    desc: "Compare air, sea, rail and express rates, generate labels and customs paperwork, and track every parcel from Shenzhen to the last mile.",
    href: "/platform/shipping-logistics",
  },
  {
    icon: Eye,
    title: "Inventory Visibility",
    desc: "See live stock across factory floor, transit, and overseas warehouses in the US, EU and beyond — with low-stock alerts and reorder points.",
    href: "/platform/inventory-visibility",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    desc: "Landed cost, lead time, defect rate and on-time delivery — measured per SKU, per supplier and per lane, exportable to your finance team.",
    href: "/platform/analytics-reporting",
  },
];

const heroStats = [
  { v: "12,842", l: "Orders / month" },
  { v: "150+", l: "Countries served" },
  { v: "97.4%", l: "On-time delivery" },
  { v: "1,200+", l: "Vetted partners" },
];

const previewStats = [
  { label: "Open Orders", value: "1,284", delta: "+12.4%" },
  { label: "In QC", value: "186", delta: "+5.1%" },
  { label: "In Transit", value: "1,205", delta: "+7.2%" },
  { label: "On-Time Rate", value: "97.4%", delta: "+2.1%" },
];

const previewRows: { id: string; route: string; mode: string; status: string; color: string }[] = [
  { id: "FM-90412", route: "Shenzhen → Los Angeles", mode: "Air Express", status: "In Transit", color: "text-action-blue" },
  { id: "FM-90408", route: "Yiwu → Rotterdam", mode: "Sea FCL", status: "Customs", color: "text-[#F59E0B]" },
  { id: "FM-90401", route: "Dongguan → Chicago", mode: "Rail", status: "Delivered", color: "text-teal" },
  { id: "FM-90397", route: "Ningbo → Sydney", mode: "Sea LCL", status: "At Origin", color: "text-text-muted" },
];

const channels = ["Shopify", "Amazon", "Walmart", "TikTok Shop", "eBay", "WooCommerce", "BigCommerce", "Etsy"];

const pillars = [
  { icon: Layers, title: "One source of truth", desc: "Orders, inspections, shipments and stock share a single data layer — no spreadsheets, no reconciliation." },
  { icon: Globe, title: "Built for cross-border", desc: "Multi-currency landed cost, HS codes, and customs paperwork are handled for China-to-global lanes." },
  { icon: Zap, title: "Automation first", desc: "Rules route orders, trigger inspections and reorder stock so your team manages exceptions, not busywork." },
  { icon: Clock, title: "Real-time everywhere", desc: "Status updates flow back to your storefront and your customers the moment they change." },
];

export default function PlatformOverviewPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[12px] font-semibold tracking-[0.1em] text-white bg-navy rounded-lg px-3.5 py-1.5">
                THE PLATFORM
              </span>
              <h1 className="mt-5 text-[36px] lg:text-[48px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                One control center for{" "}
                <span className="gradient-text-teal">global fulfillment</span>
              </h1>
              <p className="mt-5 text-[17px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh brings orders, quality control, shipping, inventory and analytics into a single platform — purpose-built for brands moving products from China to customers around the world.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all">
                  Request a Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-lg border border-border-blue bg-white hover:shadow-soft transition-all">
                  Get Started
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {heroStats.map((s) => (
                  <div key={s.l}>
                    <p className="text-[24px] font-bold text-navy leading-none">{s.v}</p>
                    <p className="mt-1.5 text-[12px] text-text-muted">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero dashboard preview */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-soft">
                <span className="flex items-center gap-2 text-[13px] font-bold text-deep-navy">
                  <span className="w-6 h-6 rounded-md gradient-logo flex items-center justify-center text-white text-[10px] font-bold">FM</span>
                  FulfillMesh
                </span>
                <span className="text-[11px] text-text-muted">Live · last 30 days</span>
              </div>
              <div className="flex">
                <div className="w-[96px] shrink-0 border-r border-border-soft py-3 px-3 space-y-2 hidden sm:block">
                  {["Overview", "Orders", "Quality", "Shipments", "Inventory", "Analytics", "Settings"].map((m, i) => (
                    <p key={m} className={`text-[11px] ${i === 0 ? "text-teal font-semibold" : "text-text-muted"}`}>{m}</p>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-[13px] font-bold text-deep-navy mb-2.5">Overview</h4>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {previewStats.map((s) => (
                      <div key={s.label} className="border border-border-soft rounded-lg p-2">
                        <p className="text-[8px] text-text-muted leading-tight">{s.label}</p>
                        <p className="text-[14px] font-bold text-deep-navy leading-tight mt-0.5">{s.value}</p>
                        <p className="text-[7px] text-teal mt-0.5 flex items-center gap-0.5">
                          <TrendingUp className="w-2 h-2" /> {s.delta}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border border-border-soft rounded-lg p-2.5">
                    <p className="text-[9px] font-semibold text-deep-navy mb-1.5">Shipments Over Time</p>
                    <svg viewBox="0 0 200 60" className="w-full h-auto">
                      <polyline fill="rgba(0,87,216,0.08)" stroke="none" points="0,48 30,40 60,44 90,26 120,32 150,16 200,10 200,60 0,60" />
                      <polyline fill="none" stroke="#0057D8" strokeWidth="1.8" points="0,48 30,40 60,44 90,26 120,32 150,16 200,10" />
                      {[[0,48],[30,40],[60,44],[90,26],[120,32],[150,16],[200,10]].map(([x,y],i)=>(
                        <circle key={i} cx={x} cy={y} r="2" fill="#0057D8" />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module grid */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">
              Five modules. One connected workflow.
            </h2>
            <p className="mt-3 text-[16px] text-text-body">
              Each module is powerful on its own and unstoppable together — sharing the same orders, suppliers, and data the moment something changes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => (
              <Link key={m.title} href={m.href} className="group bg-white rounded-xl p-6 border border-border-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center mb-4">
                  <m.icon className="w-[20px] h-[20px] text-action-blue" />
                </div>
                <h3 className="text-[16px] font-bold text-deep-navy mb-1.5">{m.title}</h3>
                <p className="text-[13px] text-text-body leading-relaxed mb-3">{m.desc}</p>
                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-action-blue group-hover:gap-2 transition-all">
                  Explore module <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
            <div className="rounded-xl p-6 bg-soft-bg border border-border-soft flex flex-col justify-center">
              <h3 className="text-[16px] font-bold text-deep-navy">See it on your own catalog</h3>
              <p className="mt-2 text-[13px] text-text-body leading-relaxed">
                Walk through the full platform with one of our cross-border specialists using your real SKUs and lanes.
              </p>
              <Link href="/book-a-demo" className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-teal group">
                Request a demo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Big dashboard preview */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-10 items-center">
            <div>
              <span className="inline-block text-[12px] font-semibold tracking-[0.1em] text-white bg-navy rounded-lg px-3.5 py-1.5">
                THE CONTROL CENTER
              </span>
              <h2 className="mt-5 text-[30px] font-bold text-deep-navy leading-tight">
                Every order, lot and shipment in one live view
              </h2>
              <p className="mt-4 text-[16px] text-text-body leading-relaxed max-w-[440px]">
                Stop stitching together WeChat threads, supplier spreadsheets and carrier portals. FulfillMesh shows the true state of your supply chain in real time — from the factory floor in Guangdong to a doorstep in Berlin.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "Route orders to suppliers and 3PLs automatically",
                  "Trigger inspections before goods ship",
                  "Track every lane with carrier-level detail",
                  "Reconcile landed cost down to the SKU",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
                    <span className="text-[14px] text-text-body">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-soft">
                <span className="flex items-center gap-2 text-[13px] font-bold text-deep-navy">
                  <span className="w-6 h-6 rounded-md gradient-logo flex items-center justify-center text-white text-[10px] font-bold">FM</span>
                  Shipments
                </span>
                <span className="text-[11px] text-text-muted">Updated just now</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {previewStats.map((s) => (
                    <div key={s.label} className="border border-border-soft rounded-lg p-2.5">
                      <p className="text-[9px] text-text-muted leading-none mb-1">{s.label}</p>
                      <p className="text-[15px] font-bold text-deep-navy leading-tight">{s.value}</p>
                      <p className="text-[8px] font-medium text-teal mt-0.5">{s.delta}</p>
                    </div>
                  ))}
                </div>
                <div className="overflow-hidden rounded-lg border border-border-soft">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-soft-bg">
                        {["Shipment", "Route", "Mode", "Status"].map((c) => (
                          <th key={c} className="px-3 py-2 text-[10px] font-semibold text-text-muted">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((r) => (
                        <tr key={r.id} className="border-t border-border-soft">
                          <td className="px-3 py-2.5 text-[10px] font-semibold text-deep-navy">{r.id}</td>
                          <td className="px-3 py-2.5 text-[10px] text-text-body">{r.route}</td>
                          <td className="px-3 py-2.5 text-[10px] text-text-body">{r.mode}</td>
                          <td className={`px-3 py-2.5 text-[10px] font-medium ${r.color}`}>{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations strip */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="text-center max-w-[560px] mx-auto mb-8">
            <h2 className="text-[24px] font-bold text-deep-navy leading-tight">Plugs into the channels you already sell on</h2>
            <p className="mt-2 text-[15px] text-text-body">
              Connect your storefronts and marketplaces in minutes — orders flow in, tracking flows back out.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {channels.map((c) => (
              <span key={c} className="text-[20px] font-bold tracking-wide text-deep-navy/35">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">Why teams run fulfillment on FulfillMesh</h2>
            <p className="mt-3 text-[16px] text-text-body">
              Built from the ground up for the realities of cross-border China-to-global ecommerce.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="bg-white rounded-xl p-6 border border-border-soft">
                <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-action-blue" />
                </div>
                <h3 className="text-[15px] font-bold text-deep-navy">{p.title}</h3>
                <p className="mt-2 text-[13px] text-text-body leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-soft-bg pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14">
            <h2 className="text-[32px] font-bold leading-tight">Run your entire China supply chain from one screen</h2>
            <p className="mt-3 text-[17px] text-text-on-dark-muted">
              See how FulfillMesh replaces a dozen tools with a single control center.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-lg bg-white hover:shadow-button transition-all">
                Request a Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg border border-white/30 hover:bg-white/10 transition-all">
                Get Started
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["No setup fees", "Cancel anytime", "Dedicated onboarding"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-on-dark-soft">
                  <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
