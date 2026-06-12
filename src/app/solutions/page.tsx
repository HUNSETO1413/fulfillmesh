import type { Metadata } from "next";
import Link from "next/link";
import {
  Users, ShieldCheck, Box, Truck, Warehouse, Eye, RotateCcw, BarChart3,
  Package, Search, CheckCircle2, TrendingUp, ArrowRight, ChevronRight,
  Globe,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import DottedWorldMap from "./shipping-logistics/DottedWorldMap";

export const metadata: Metadata = pageMetadata({
  title: "End-to-End Fulfillment Solutions",
  description:
    "Explore FulfillMesh's China-powered fulfillment solutions — supplier matching, quality control, packaging, shipping, overseas warehousing, returns, and analytics for global e-commerce brands.",
  path: "/solutions",
  keywords: [
    "china fulfillment solutions",
    "ecommerce fulfillment platform",
    "supplier matching",
    "overseas warehousing",
    "order fulfillment services",
  ],
});

const solutions = [
  { icon: Users, title: "Supplier Matching", desc: "We match you with the best factories in China based on your product, volume, and goals.", href: "/solutions/supplier-matching" },
  { icon: ShieldCheck, title: "Quality Control", desc: "On-site inspections and quality checks at every stage to protect your brand and your customers.", href: "/solutions/quality-control" },
  { icon: Box, title: "Packaging & Labeling", desc: "Custom packaging, labeling, and branding tailored to your market requirements.", href: "/solutions/packaging-labeling" },
  { icon: Truck, title: "Shipping & Logistics", desc: "Optimized shipping routes with the best rates and reliable global carriers.", href: "/solutions/shipping-logistics" },
  { icon: Warehouse, title: "Overseas Warehousing", desc: "Store closer to your customers for faster delivery and lower shipping costs.", href: "/solutions/overseas-warehousing" },
  { icon: Eye, title: "Inventory Visibility", desc: "Real-time tracking of inventory, shipments, and orders across your supply chain.", href: "/solutions/inventory-visibility" },
  { icon: RotateCcw, title: "Returns Management", desc: "Streamlined returns and exchanges to keep your customers happy.", href: "/solutions/returns-management" },
  { icon: BarChart3, title: "Analytics & Reporting", desc: "Actionable insights and custom reports to help you make smarter decisions.", href: "/solutions/analytics-reporting" },
];

const connectedItems = [
  "Centralize orders, shipments, and inventory",
  "Monitor QC, shipping, and delivery in real time",
  "Collaborate with suppliers and 3PLs seamlessly",
  "Make data-driven decisions with built-in analytics",
];

const mapNodes = [
  { label: "Supplier Matching", icon: Search, top: "20%", left: "16%" },
  { label: "Packaging & QC", icon: Package, top: "16%", left: "82%" },
  { label: "Shipping & Logistics", icon: Truck, top: "82%", left: "14%" },
  { label: "Overseas Warehousing", icon: Warehouse, top: "84%", left: "84%" },
];

const dashStats = [
  { label: "Total Orders", value: "12,842", delta: "+13.5%", sub: "vs last 30 days" },
  { label: "Shipments in Transit", value: "1,205", delta: "+7.2%", sub: "vs last 30 days" },
  { label: "On-Time Delivery", value: "97.4%", delta: "+2.1%", sub: "vs last 30 days" },
  { label: "Total Revenue", value: "$1.62M", delta: "+10.3%", sub: "vs last 30 days" },
];

const shippingLocations = [
  { label: "Los Angeles, CA", pct: "22.1%", color: "#003B7A" },
  { label: "Dallas, TX", pct: "17.8%", color: "#00B894" },
  { label: "Chicago, IL", pct: "14.3%", color: "#0057D8" },
  { label: "Atlanta, GA", pct: "9.7%", color: "#7C8BF5" },
  { label: "New York, NY", pct: "8.6%", color: "#A9B4FF" },
  { label: "Other", pct: "27.5%", color: "#E0E7F1" },
];

const growthPillars = [
  { icon: ShieldCheck, title: "Vetted & Trusted Partners", desc: "Work with pre-vetted factories and logistics providers you can count on." },
  { icon: Eye, title: "Transparent Operations", desc: "Full visibility and clear communication at every step of the way." },
  { icon: TrendingUp, title: "Scalable Solutions", desc: "Flexible services that grow with your brand and adapt to your needs." },
  { icon: Globe, title: "Global Reach", desc: "Extensive network across China and worldwide destinations." },
];

export default function SolutionsPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-white border-b border-border-soft overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[12px] font-semibold tracking-[0.1em] text-white bg-navy rounded-lg px-3.5 py-1.5">
                OUR SOLUTIONS
              </span>
              <h1 className="mt-5 text-[36px] lg:text-[48px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                End-to-end fulfillment solutions for{" "}
                <span className="gradient-text-teal">global e-commerce brands</span>
              </h1>
              <p className="mt-5 text-[17px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh connects you with vetted suppliers in China and gives you the tools to manage quality, packaging, shipping routes, and overseas warehousing — all in one streamlined platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg bg-deep-navy hover:bg-navy hover:shadow-button transition-all">
                  Find My Match <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-lg border border-border-blue bg-white hover:shadow-soft transition-all">
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

            {/* Dotted world map with nodes */}
            <div className="relative hidden lg:block h-[360px]">
              <DottedWorldMap
                width={500}
                height={360}
                className="absolute inset-0 w-full h-full"
                hubX={0.5}
                hubY={0.5}
                markers={[
                  { x: 0.16, y: 0.2, color: "#00B894" },
                  { x: 0.82, y: 0.16, color: "#00B894" },
                  { x: 0.14, y: 0.82, color: "#00B894" },
                  { x: 0.84, y: 0.84, color: "#00B894" },
                ]}
                arcs={[
                  { x1: 0.16, y1: 0.2, x2: 0.5, y2: 0.5 },
                  { x1: 0.82, y1: 0.16, x2: 0.5, y2: 0.5 },
                  { x1: 0.14, y1: 0.82, x2: 0.5, y2: 0.5 },
                  { x1: 0.84, y1: 0.84, x2: 0.5, y2: 0.5 },
                ]}
              />
              {/* center logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl gradient-logo flex items-center justify-center text-white font-bold text-lg shadow-card">
                FM
              </div>
              {/* nodes */}
              {mapNodes.map((n) => (
                <div key={n.label} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5" style={{ top: n.top, left: n.left }}>
                  <div className="w-11 h-11 rounded-xl bg-white border border-border-soft shadow-soft flex items-center justify-center">
                    <n.icon className="w-5 h-5 text-navy" />
                  </div>
                  <span className="text-[11px] font-medium text-text-muted whitespace-nowrap text-center">{n.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">
              Comprehensive solutions for every step of fulfillment
            </h2>
            <p className="mt-3 text-[16px] text-text-body">
              From supplier sourcing to final delivery, our solutions are designed to help you scale with confidence.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((s) => (
              <Link key={s.title} href={s.href} className="group bg-white rounded-xl p-6 border border-border-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center mb-4">
                  <s.icon className="w-[20px] h-[20px] text-action-blue" />
                </div>
                <h3 className="text-[15px] font-bold text-deep-navy mb-1.5">{s.title}</h3>
                <p className="text-[13px] text-text-body leading-relaxed mb-3">{s.desc}</p>
                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-action-blue group-hover:gap-2 transition-all">
                  Learn more <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Everything connected */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-semibold tracking-[0.1em] text-white bg-navy rounded-lg px-3.5 py-1.5">
                ONE CONNECTED PLATFORM
              </span>
              <h2 className="mt-5 text-[30px] font-bold text-deep-navy leading-tight">
                Everything connected. Everything in sync.
              </h2>
              <p className="mt-4 text-[16px] text-text-body leading-relaxed max-w-[440px]">
                FulfillMesh brings all your fulfillment operations together in one platform — so your data stays aligned and your supply chain keeps moving.
              </p>
              <div className="mt-6 space-y-3">
                {connectedItems.map((c) => (
                  <div key={c} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
                    <span className="text-[14px] text-text-body">{c}</span>
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
                  {["Overview", "Orders", "Suppliers", "Quality Control", "Shipments", "Warehouses", "Reports", "Settings"].map((m, i) => (
                    <p key={m} className={`text-[11px] ${i === 0 ? "text-teal font-semibold" : "text-text-muted"}`}>{m}</p>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-[13px] font-bold text-deep-navy mb-2.5">Overview</h4>

                  {/* Stat tiles */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                    {dashStats.map((s) => (
                      <div key={s.label} className="border border-border-soft rounded-lg p-2">
                        <p className="text-[8px] text-text-muted leading-tight">{s.label}</p>
                        <p className="text-[14px] font-bold text-deep-navy leading-tight mt-0.5">{s.value}</p>
                        <p className="text-[7px] text-teal mt-0.5 flex items-center gap-0.5">
                          <TrendingUp className="w-2 h-2" /> {s.delta} <span className="text-text-muted">{s.sub}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Charts row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Line chart */}
                    <div className="border border-border-soft rounded-lg p-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[9px] font-semibold text-deep-navy">Orders Over Time</p>
                        <span className="inline-flex items-center gap-0.5 rounded-md border border-border-soft px-1 py-0.5 text-[7px] text-text-muted">
                          Daily <ChevronRight className="w-2 h-2" />
                        </span>
                      </div>
                      <svg viewBox="0 0 200 70" className="w-full h-auto">
                        <polyline fill="none" stroke="#0057D8" strokeWidth="1.8" points="0,55 30,45 60,50 90,30 120,38 150,18 200,12" />
                        <polyline fill="rgba(0,87,216,0.08)" stroke="none" points="0,55 30,45 60,50 90,30 120,38 150,18 200,12 200,70 0,70" />
                        {[[0,55],[30,45],[60,50],[90,30],[120,38],[150,18],[200,12]].map(([x,y],i)=>(
                          <circle key={i} cx={x} cy={y} r="2" fill="#0057D8" />
                        ))}
                      </svg>
                    </div>

                    {/* Donut chart */}
                    <div className="border border-border-soft rounded-lg p-2.5">
                      <p className="text-[9px] font-semibold text-deep-navy mb-1.5">Top Shipping Locations</p>
                      <div className="flex items-center gap-2.5">
                        <svg viewBox="0 0 64 64" className="w-[56px] h-[56px] shrink-0 -rotate-90">
                          {(() => {
                            const C = 2 * Math.PI * 26;
                            return shippingLocations.map((l, i) => {
                              const seg = (parseFloat(l.pct) / 100) * C;
                              const offset = shippingLocations
                                .slice(0, i)
                                .reduce((sum, prev) => sum + (parseFloat(prev.pct) / 100) * C, 0);
                              return (
                                <circle
                                  key={l.label}
                                  cx="32" cy="32" r="26"
                                  fill="none"
                                  stroke={l.color}
                                  strokeWidth="9"
                                  strokeDasharray={`${seg} ${C - seg}`}
                                  strokeDashoffset={-offset}
                                />
                              );
                            });
                          })()}
                          <text x="32" y="30" textAnchor="middle" transform="rotate(90 32 32)" fontSize="5" fill="#66758C">Orders</text>
                          <text x="32" y="37" textAnchor="middle" transform="rotate(90 32 32)" fontSize="7" fontWeight="700" fill="#061A3D">12,842</text>
                        </svg>
                        <div className="flex-1 space-y-0.5">
                          {shippingLocations.map((l) => (
                            <div key={l.label} className="flex items-center justify-between text-[7px]">
                              <span className="flex items-center gap-1 text-text-body">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
                                {l.label}
                              </span>
                              <span className="text-text-muted">{l.pct}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built to support your growth */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">Built to support your growth</h2>
            <p className="mt-3 text-[16px] text-text-body">
              Our platform and partner network are designed to scale with your business.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthPillars.map((g) => (
              <div key={g.title} className="bg-white rounded-xl p-6 border border-border-soft">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center shrink-0">
                    <g.icon className="w-5 h-5 text-action-blue" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-deep-navy">{g.title}</h3>
                    <p className="mt-2 text-[13px] text-text-body leading-relaxed">{g.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14">
            <h2 className="text-[32px] font-bold leading-tight">Ready to streamline your fulfillment operations?</h2>
            <p className="mt-3 text-[17px] text-text-on-dark-muted">
              Let&apos;s build a smarter, more reliable supply chain together.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-lg bg-white hover:shadow-button transition-all">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg border border-white/30 hover:bg-white/10 transition-all">
                Book a Demo
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["No setup fees", "Cancel anytime", "Dedicated support"].map((t) => (
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
