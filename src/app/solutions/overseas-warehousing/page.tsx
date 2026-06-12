import type { Metadata } from "next";
import Link from "next/link";
import {
  Truck, DollarSign, Box, Globe, CheckCircle2,
  Users, ShieldCheck, PieChart, FileCheck, RefreshCw, Warehouse, BarChart3,
  Package, ArrowRight, ChevronDown,
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
  { icon: Globe, title: "Store Closer to Customers", desc: "Position inventory in key markets so your products arrive faster and cheaper." },
  { icon: DollarSign, title: "Reduce Shipping Costs", desc: "Eliminate cross-border shipping for every order and lower your landed cost per unit." },
  { icon: Truck, title: "Faster Local Delivery", desc: "Leverage local carrier networks for last-mile delivery in days, not weeks." },
  { icon: BarChart3, title: "Scale Globally", desc: "Expand into new markets with confidence using vetted, reliable warehouse partners." },
];

const features = [
  { icon: Users, title: "Smart Warehouse Matching", desc: "We match you with the best overseas warehouses based on location, product type, capacity, and service level." },
  { icon: ShieldCheck, title: "Regional Storage & Bonded Options", desc: "Choose from general, bonded, and specialized storage solutions to fit your inventory needs." },
  { icon: PieChart, title: "Intelligent Stock Allocation", desc: "Allocate inventory across regions based on demand, lead time, and performance insights." },
  { icon: FileCheck, title: "SLA & Compliance Handling", desc: "We ensure SLA adherence, customs compliance, and documentation across every market." },
  { icon: Truck, title: "Last-Mile Carrier Support", desc: "Leverage local carrier networks for optimized last-mile delivery and tracking visibility." },
  { icon: RefreshCw, title: "Real-Time Inventory Sync", desc: "Stay in control with real-time inventory updates and alerts across all your warehouse locations." },
];

const timeline = [
  { icon: Users, title: "Requirement Intake", desc: "We capture your target markets, product types, volume needs, and service expectations." },
  { icon: Globe, title: "Warehouse Matching", desc: "Our team identifies and recommends vetted warehouses that fit your criteria." },
  { icon: Package, title: "Ship & Stock", desc: "You ship inventory to selected warehouses. We manage receiving and put-away." },
  { icon: ShieldCheck, title: "Fulfill & Deliver", desc: "Orders are picked, packed, and shipped locally for fast, reliable delivery." },
  { icon: BarChart3, title: "Monitor & Optimize", desc: "Track performance and inventory in real time and optimize as you grow." },
];

const sourcingBullets = [
  "Store closer to your customers",
  "Reduce cross-border shipping costs",
  "Faster local delivery times",
  "Scale with confidence globally",
];

const stats = [
  { icon: Globe, value: "45%", label: "Faster Delivery" },
  { icon: DollarSign, value: "30%", label: "Cost Savings" },
  { icon: ShieldCheck, value: "99.2%", label: "Order Accuracy" },
  { icon: Users, value: "4.8/5", label: "Satisfaction" },
];

const dashColumns = ["Warehouse", "Location", "Type", "Stock Level", "Utilization", "Orders", "Avg. Ship", "Status"];
const dashRows = [
  { cols: ["LA West Hub", "United States", "General", "32,450", "78%", "4,210", "1.8 days", "Active"] },
  { cols: ["London Central", "United Kingdom", "Bonded", "18,320", "65%", "2,890", "2.1 days", "Active"] },
  { cols: ["Frankfurt East", "Germany", "General", "14,560", "72%", "1,920", "2.3 days", "Active"] },
  { cols: ["Tokyo South", "Japan", "General", "22,180", "81%", "3,450", "1.5 days", "Active"] },
  { cols: ["Dubai Free Zone", "UAE", "Bonded", "9,870", "54%", "1,120", "2.6 days", "Active"] },
];

const faqs = [
  { q: "How do you select warehouse partners?" },
  { q: "What types of storage are available?" },
  { q: "Can I use multiple warehouses at once?" },
  { q: "How does inventory sync work across locations?" },
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
                Overseas Warehousing —{" "}
                <span className="gradient-text-teal">Store closer. Deliver faster. Grow everywhere.</span>
              </h1>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh connects you with vetted overseas warehouse partners so you can store inventory closer to your customers, reduce costs, and deliver faster across global markets.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] bg-deep-navy hover:bg-navy hover:shadow-button transition-all">
                  Find My Match <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-navy rounded-[10px] border border-border-soft bg-white hover:shadow-soft transition-all">
                  Talk to an Expert
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

      {/* Why Overseas Warehousing */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">Why brands choose our Overseas Warehousing</h2>
            <p className="mt-3 text-[16px] text-text-body">Our global warehouse network helps you deliver faster and cheaper.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-action-blue/10 flex items-center justify-center mx-auto mb-5">
                  <b.icon className="w-7 h-7 text-action-blue" />
                </div>
                <h3 className="text-[16px] font-bold text-deep-navy mb-2">{b.title}</h3>
                <p className="text-[14px] text-text-body leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">How overseas warehousing works</h2>
            <p className="mt-3 text-[16px] text-text-body">Our proven process gets you up and running in key global markets.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "1", icon: Users, title: "Share Your Requirements", desc: "Tell us your target markets, product types, and volume needs." },
              { num: "2", icon: Box, title: "Get Matched", desc: "We recommend the best warehouses based on your criteria and budget." },
              { num: "3", icon: Warehouse, title: "Store Inventory", desc: "Ship your inventory to the selected overseas warehouse and get it stocked in." },
              { num: "4", icon: Truck, title: "Fulfill & Deliver", desc: "Orders are picked, packed, and shipped using local carriers for faster delivery." },
            ].map((s, i) => (
              <div key={s.num} className="relative">
                <div className="bg-white rounded-xl border border-border-soft shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6 h-full">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-deep-navy text-white text-[18px] font-bold flex items-center justify-center mb-3">
                      {s.num}
                    </div>
                    <s.icon className="w-6 h-6 text-action-blue" />
                  </div>
                  <h3 className="text-[16px] font-bold text-deep-navy text-center">{s.title}</h3>
                  <p className="mt-2 text-[13px] text-text-muted leading-relaxed text-center">{s.desc}</p>
                </div>
                {i < 3 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 w-4 h-4 text-border-blue" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">Powerful capabilities for global growth</h2>
            <p className="mt-3 text-[16px] text-text-body">Everything you need to store, manage, and fulfill inventory worldwide.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-border-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-action-blue" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-deep-navy">{f.title}</h3>
                    <p className="mt-2 text-[13px] text-text-body leading-relaxed">{f.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-action-blue">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <h2 className="text-[30px] font-bold text-deep-navy">From requirements to reliable partnerships</h2>
            <p className="mt-3 text-[16px] text-text-body">A transparent end-to-end process designed to reduce risk and speed up fulfillment.</p>
          </div>
          <div className="relative grid md:grid-cols-5 gap-6">
            <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-px bg-border-blue" />
            {timeline.map((t, i) => (
              <div key={i} className="relative">
                <div className="w-14 h-14 rounded-full bg-white border border-border-soft shadow-soft flex items-center justify-center mb-5 relative z-10 mx-auto">
                  <t.icon className="w-6 h-6 text-action-blue" />
                </div>
                <h3 className="text-[14px] font-bold text-deep-navy text-center">
                  <span className="text-[13px] font-semibold text-text-muted">Step {i + 1}:</span>{" "}
                  {t.title}
                </h3>
                <p className="mt-2 text-[12px] text-text-muted leading-relaxed text-center">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing partner + Dashboard */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">BUILT FOR GROWING BRANDS</span>
              <h2 className="mt-5 text-[30px] font-bold text-deep-navy leading-tight">
                The warehousing partner <br /> e-commerce <span className="gradient-text-teal">brands trust</span>
              </h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[440px]">Whether you&apos;re expanding into new markets or optimizing existing operations, we help you find the right overseas warehouse partners.</p>
              <div className="mt-6 space-y-3">
                {sourcingBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
                    <span className="text-[14px] text-text-body">{b}</span>
                  </div>
                ))}
              </div>
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
                <div className="w-[100px] shrink-0 border-r border-border-soft py-3 px-3 space-y-2 hidden sm:block">
                  {["Overview", "Suppliers", "Quotes", "RFQs", "Orders", "Shipments", "Quality Control", "Warehouses", "Reports", "Settings"].map((m, i) => (
                    <p key={m} className={`text-[11px] ${i === 7 ? "text-teal font-semibold" : "text-text-muted"}`}>{m}</p>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-[13px] font-bold text-deep-navy mb-3">Warehouse Inventory</h4>
                  <div className="overflow-hidden rounded-lg border border-border-soft">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#F9FAFB]">
                          {dashColumns.map((c) => (
                            <th key={c} className="px-2 py-1.5 text-[9px] font-semibold text-text-muted">{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dashRows.map((r, i) => (
                          <tr key={i} className="border-t border-border-soft">
                            {r.cols.map((c, j) => (
                              <td key={j} className={`px-2 py-1.5 text-[9px] ${j === 0 ? "font-semibold text-deep-navy" : j === 7 ? "font-semibold text-teal" : "text-text-body"}`}>{c}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button className="mt-3 text-[11px] font-semibold text-white bg-navy border border-transparent rounded-md px-3 py-1.5 hover:bg-deep-navy transition-colors">View All Warehouses</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected platform stats */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pb-20">
          <div className="bg-deep-navy rounded-2xl p-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">ONE CONNECTED PLATFORM</span>
                <h2 className="mt-5 text-[28px] font-bold text-white leading-tight">
                  Overseas Warehousing, connected to your fulfillment operations
                </h2>
                <p className="mt-4 text-[15px] text-text-on-dark-muted leading-relaxed max-w-[400px]">
                  Seamlessly manage inventory, orders, and shipments across all your global warehouse locations in one platform.
                </p>
                <Link href="/solutions" className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-teal">
                  Learn more about our platform <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <s.icon className="w-8 h-8 text-teal mx-auto mb-3" />
                    <p className="text-[32px] font-bold text-white leading-none">{s.value}</p>
                    <p className="mt-2 text-[13px] text-text-on-dark-soft">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-soft-bg">
        <div className="max-w-[800px] mx-auto px-6 py-20">
          <h2 className="text-[30px] font-bold text-deep-navy text-center mb-12">Questions? We&apos;ve got answers.</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="bg-white rounded-xl border border-border-soft px-5 py-4 flex items-center justify-between">
                <span className="text-[15px] font-semibold text-deep-navy pr-4">{f.q}</span>
                <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
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
