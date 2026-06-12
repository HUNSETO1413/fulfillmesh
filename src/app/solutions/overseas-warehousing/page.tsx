import type { Metadata } from "next";
import Link from "next/link";
import {
  Truck, DollarSign, Box, Globe, CheckCircle2,
  Users, ShieldCheck, PieChart, FileCheck, RefreshCw, Warehouse, BarChart3,
  ArrowRight, Smile, Rocket, Network,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Overseas Warehousing & Global Fulfillment",
  description:
    "Store inventory closer to your customers with vetted overseas warehouses. Cut cross-border shipping costs, speed up local delivery, and scale into new global markets.",
  path: "/solutions/overseas-warehousing",
  keywords: [
    "overseas warehousing",
    "global fulfillment warehouse",
    "bonded warehouse",
    "international 3PL",
    "cross-border fulfillment",
  ],
});

const benefits = [
  { icon: Truck, title: "Faster Local Delivery", desc: "Store inventory closer to your customers and cut delivery times significantly." },
  { icon: DollarSign, title: "Lower Shipping Costs", desc: "Save on international shipping by bulk-stocking inventory in key markets." },
  { icon: Network, title: "Distributed Inventory", desc: "Reduce risk and stockouts with inventory spread across multiple regions." },
  { icon: RefreshCw, title: "Returns Convenience", desc: "Offer local returns to improve customer satisfaction and brand trust." },
  { icon: Globe, title: "Expand with Confidence", desc: "Enter new markets quickly with local storage and fulfillment support." },
];

const features = [
  { icon: Users, title: "Smart Warehouse Matching", desc: "We match you with the best overseas warehouses based on location, product type, capacity, and service level." },
  { icon: ShieldCheck, title: "Regional Storage & Bonded Options", desc: "Choose from general, bonded, and specialized storage solutions to fit your inventory needs." },
  { icon: PieChart, title: "Intelligent Stock Allocation", desc: "Allocate inventory across regions based on demand, lead time, and performance insights." },
  { icon: FileCheck, title: "SLA & Compliance Handling", desc: "We ensure SLA adherence, customs compliance, and documentation across every market." },
  { icon: Truck, title: "Last-Mile Carrier Support", desc: "Leverage local carrier networks for optimized last-mile delivery and tracking visibility." },
  { icon: RefreshCw, title: "Real-Time Inventory Sync", desc: "Stay in control with real-time inventory updates and alerts across all your warehouse locations." },
];

const steps = [
  { num: "1", icon: Users, title: "Share Your Requirements", desc: "Tell us your target markets, product types, and volume needs." },
  { num: "2", icon: Box, title: "Get Matched", desc: "We recommend the best warehouses based on your criteria and budget." },
  { num: "3", icon: Warehouse, title: "Store Inventory", desc: "Ship your inventory to the selected overseas warehouse and get it checked in." },
  { num: "4", icon: Truck, title: "Fulfill & Deliver", desc: "Orders are picked, packed, and shipped via local carriers for faster delivery." },
  { num: "5", icon: BarChart3, title: "Track & Optimize", desc: "Monitor performance and inventory in real time and optimize as you grow." },
];

const countries = [
  { flag: "🇺🇸", name: "United States", desc: "Multiple hubs across key states" },
  { flag: "🇨🇦", name: "Canada", desc: "Strategic locations nationwide" },
  { flag: "🇬🇧", name: "United Kingdom", desc: "Major import ports and hubs" },
  { flag: "🇪🇺", name: "Europe", desc: "Germany, Netherlands and more" },
  { flag: "🇨🇳", name: "China", desc: "Shenzhen, Shanghai and more" },
  { flag: "🇯🇵", name: "Japan", desc: "Tokyo, Osaka and more" },
  { flag: "🇦🇪", name: "UAE", desc: "Dubai Free Zone facilities" },
  { flag: "🇦🇺", name: "Australia", desc: "Sydney, Melbourne and more" },
];

const dashStats = [
  { label: "Total Stock", value: "125,780", delta: "+13.4%" },
  { label: "Orders Shipped", value: "18,954", delta: "+18.7%" },
  { label: "Avg. Delivery Time", value: "2.6 Days", delta: "-15%" },
  { label: "Shipping Cost Saved", value: "$48,230", delta: "+22%" },
];

const regions = [
  { c: "#0057D8", l: "North America", v: "38.2%", dash: "43 113", offset: 0 },
  { c: "#00B894", l: "Europe", v: "24.7%", dash: "28 113", offset: 43 },
  { c: "#003B7A", l: "Asia Pacific", v: "26.1%", dash: "29 113", offset: 71 },
  { c: "#B8C7DA", l: "Other", v: "11.0%", dash: "13 113", offset: 100 },
];

const topLocations = [
  { l: "Los Angeles, US", v: "28,450" },
  { l: "London, UK", v: "15,870" },
  { l: "Dubai, UAE", v: "13,210" },
  { l: "Sydney, AU", v: "11,540" },
  { l: "Tokyo, JP", v: "11,960" },
];

const results = [
  { icon: Rocket, value: "45%", label: "Faster Delivery", desc: "Average reduction in delivery time across key markets." },
  { icon: DollarSign, value: "30%", label: "Lower Shipping Costs", desc: "Average savings by storing inventory closer to customers." },
  { icon: Box, value: "99.2%", label: "Order Accuracy", desc: "Consistently high accuracy across our warehouse network." },
  { icon: Smile, value: "4.8/5", label: "Customer Satisfaction", desc: "Brands love the reliability and speed of our global network." },
];

export default function OverseasWarehousingPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">OUR SOLUTIONS</span>
              <h1 className="mt-5 text-[36px] lg:text-[46px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                Overseas Warehousing<br />
                Store closer. Deliver faster.<br />
                <span className="gradient-text-teal">Grow everywhere.</span>
              </h1>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh connects you with vetted overseas warehouse partners so you can store inventory closer to your customers, reduce costs, and deliver faster across global markets.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] bg-deep-navy hover:bg-navy hover:shadow-button transition-all">
                  Find My Match <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-navy rounded-[10px] border border-border-soft bg-white hover:shadow-soft transition-all">
                  Book a Demo
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {["Vetted Partners", "End-to-End Support", "No Hidden Fees"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                  </span>
                ))}
              </div>
            </div>
            {/* Network map */}
            <div className="relative hidden lg:block h-[400px]">
              <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 500 400" fill="none">
                {Array.from({ length: 180 }).map((_, i) => {
                  const x = (i * 37) % 500;
                  const y = ((i * 53) % 360) + 20;
                  return <circle key={i} cx={x} cy={y} r="1.3" fill="#B8C7DA" />;
                })}
              </svg>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 400" fill="none">
                {[
                  { top: "33%", left: "22%" },
                  { top: "26%", left: "48%" },
                  { top: "28%", left: "52%" },
                  { top: "30%", left: "80%" },
                  { top: "76%", left: "82%" },
                  { top: "50%", left: "58%" },
                ].map((n, i) => {
                  const cx = (parseFloat(n.left) / 100) * 500;
                  const cy = (parseFloat(n.top) / 100) * 400;
                  return <line key={i} x1="250" y1="200" x2={cx} y2={cy} stroke="#00B894" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5" />;
                })}
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-2xl gradient-logo flex items-center justify-center text-white font-bold text-xl shadow-card">
                FM
              </div>
              {[
                { label: "United States", icon: Warehouse, top: "33%", left: "22%" },
                { label: "United Kingdom", icon: Warehouse, top: "26%", left: "48%" },
                { label: "Germany", icon: Warehouse, top: "28%", left: "52%" },
                { label: "Japan", icon: Warehouse, top: "30%", left: "80%" },
                { label: "Australia", icon: Warehouse, top: "76%", left: "82%" },
                { label: "UAE", icon: Warehouse, top: "50%", left: "58%" },
              ].map((n) => (
                <div key={n.label} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5" style={{ top: n.top, left: n.left }}>
                  <div className="w-11 h-11 rounded-xl bg-white border border-border-soft shadow-soft flex items-center justify-center">
                    <n.icon className="w-5 h-5 text-navy" />
                  </div>
                  <span className="text-[11px] font-medium text-text-muted whitespace-nowrap">{n.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why brands choose */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[32px] font-bold text-deep-navy">Why brands choose overseas warehousing with FulfillMesh</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {benefits.map((b) => (
              <div key={b.title}>
                <div className="w-12 h-12 rounded-xl bg-action-blue/10 flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-action-blue" />
                </div>
                <h3 className="text-[16px] font-bold text-deep-navy mb-2">{b.title}</h3>
                <p className="text-[14px] text-text-body leading-relaxed">{b.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-action-blue">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powerful capabilities */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[32px] font-bold text-deep-navy">Powerful capabilities for global growth</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-10">
            {features.map((f) => (
              <div key={f.title}>
                <div className="w-12 h-12 rounded-xl bg-action-blue/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-action-blue" />
                </div>
                <h3 className="text-[16px] font-bold text-deep-navy">{f.title}</h3>
                <p className="mt-2 text-[14px] text-text-body leading-relaxed max-w-[300px]">{f.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-action-blue">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <h2 className="text-[32px] font-bold text-deep-navy">How overseas warehousing works</h2>
            <p className="mt-3 text-[16px] text-text-body">Our proven process gets you up and running in key global markets.</p>
          </div>
          <div className="relative grid gap-6" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center px-1">
                <div className="w-8 h-8 rounded-full bg-teal text-white text-[14px] font-bold flex items-center justify-center mx-auto mb-3">{s.num}</div>
                <s.icon className="w-7 h-7 text-action-blue mx-auto mb-3" />
                <h3 className="text-[15px] font-bold text-deep-navy">{s.title}</h3>
                <p className="mt-2 text-[12px] text-text-muted leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-4 -right-3 w-4 h-4 text-border-blue" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global warehouse network + dashboard */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-[28px] font-bold text-deep-navy leading-tight">Global warehouse network</h2>
              <p className="mt-3 text-[15px] text-text-body">Access trusted warehouses in high-demand markets worldwide.</p>
              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {countries.map((c) => (
                  <div key={c.name} className="bg-white rounded-xl border border-border-soft p-3">
                    <span className="text-[20px] leading-none">{c.flag}</span>
                    <p className="mt-2 text-[13px] font-bold text-deep-navy leading-tight">{c.name}</p>
                    <p className="mt-1 text-[11px] text-text-muted leading-snug">{c.desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-1 text-[14px] font-semibold text-action-blue">
                View all warehouse locations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Dashboard mockup */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-soft">
                <span className="flex items-center gap-2 text-[13px] font-bold text-deep-navy">
                  <span className="w-6 h-6 rounded-md gradient-logo flex items-center justify-center text-white text-[10px] font-bold">FM</span>
                  FulfillMesh
                </span>
                <span className="text-[11px] text-text-muted">May 12 – May 18, 2025</span>
              </div>
              <div className="flex">
                <div className="w-[90px] shrink-0 border-r border-border-soft py-3 px-3 space-y-2 hidden sm:block">
                  {["Overview", "Orders", "Shipments", "Inventory", "Warehouses", "Returns", "Reports", "Settings"].map((m, i) => (
                    <p key={m} className={`text-[11px] ${i === 0 ? "text-teal font-semibold" : "text-text-muted"}`}>{m}</p>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-[14px] font-bold text-deep-navy mb-1">Manage everything in one platform</h4>
                  <p className="text-[11px] text-text-muted mb-4">Full visibility and control over your overseas warehousing and fulfillment operations.</p>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {dashStats.map((s) => (
                      <div key={s.label} className="border border-border-soft rounded-lg p-2">
                        <p className="text-[8px] text-text-muted leading-none mb-1">{s.label}</p>
                        <p className="text-[13px] font-bold text-deep-navy leading-tight">{s.value}</p>
                        <p className="text-[8px] font-medium text-teal mt-0.5">{s.delta} <span className="text-text-muted">vs last 30 days</span></p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-border-soft rounded-lg p-3">
                      <p className="text-[10px] font-semibold text-deep-navy mb-2">Inventory by Region</p>
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <svg viewBox="0 0 50 50" className="w-14 h-14">
                            <circle cx="25" cy="25" r="18" fill="none" stroke="#E6EDF5" strokeWidth="7" />
                            {regions.map((r) => (
                              <circle key={r.l} cx="25" cy="25" r="18" fill="none" stroke={r.c} strokeWidth="7" strokeDasharray={r.dash} strokeDashoffset={-r.offset} transform="rotate(-90 25 25)" />
                            ))}
                          </svg>
                          <span className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[7px] text-text-muted leading-none">Total Stock</span>
                            <span className="text-[8px] font-bold text-deep-navy leading-none">125,780</span>
                          </span>
                        </div>
                        <div className="space-y-1">
                          {regions.map((r) => (
                            <div key={r.l} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.c }} />
                              <span className="text-[8px] text-text-muted leading-none">{r.l}</span>
                              <span className="text-[8px] text-deep-navy font-semibold leading-none ml-auto">{r.v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="border border-border-soft rounded-lg p-3">
                      <p className="text-[10px] font-semibold text-deep-navy mb-2">Top 5 Locations by Stock</p>
                      <div className="space-y-1.5">
                        {topLocations.map((t) => (
                          <div key={t.l} className="flex items-center justify-between">
                            <span className="text-[8px] text-text-muted">{t.l}</span>
                            <span className="text-[8px] font-semibold text-deep-navy">{t.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-action-blue">
                    View full dashboard <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real results */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[32px] font-bold text-deep-navy">Real results from global brands</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {results.map((r) => (
              <div key={r.label}>
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                  <r.icon className="w-6 h-6 text-teal" />
                </div>
                <p className="text-[36px] font-extrabold gradient-text-teal leading-none">{r.value}</p>
                <h3 className="mt-3 text-[16px] font-bold text-deep-navy">{r.label}</h3>
                <p className="mt-2 text-[13px] text-text-body leading-relaxed max-w-[240px]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-soft-bg pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14">
            <h2 className="text-[30px] font-bold leading-tight">Ready to expand globally with confidence?</h2>
            <p className="mt-3 text-[16px] text-text-on-dark-muted">Let&apos;s find the right overseas warehouse partners for your business.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">
                Find My Match <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] border border-white/30 hover:bg-white/10 transition-all">
                Book a Demo
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["Free to get started", "No obligations", "Personalized matches"].map((t) => (
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
