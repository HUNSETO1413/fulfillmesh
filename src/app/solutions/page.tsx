import type { Metadata } from "next";
import Link from "next/link";
import {
  Warehouse, Package, Truck, RotateCcw, BarChart3,
  ShieldCheck, ArrowRight, ChevronRight, Search, Eye, Layers,
  CheckCircle2, TrendingUp,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

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
  { icon: Search, title: "Supplier Matching", desc: "Find vetted factories and suppliers matched to your product specs and quality standards.", href: "/solutions/supplier-matching" },
  { icon: Truck, title: "Shipping & Logistics", desc: "Partner with top carriers for fast, reliable delivery across global lanes.", href: "/solutions/shipping-logistics" },
  { icon: Warehouse, title: "Overseas Warehousing", desc: "Store inventory closer to your customers with strategic global warehouse locations.", href: "/solutions/overseas-warehousing" },
  { icon: Eye, title: "Inventory Visibility", desc: "Real-time tracking of stock levels, movements, and availability across all locations.", href: "/solutions/inventory-visibility" },
  { icon: ShieldCheck, title: "Quality Control", desc: "Ensure accuracy and consistency in every order with rigorous inspection processes.", href: "/solutions/quality-control" },
  { icon: Layers, title: "Packaging & Labeling", desc: "Custom packaging, private labeling, and branded unboxing experiences.", href: "/solutions/packaging-labeling" },
  { icon: RotateCcw, title: "Returns Management", desc: "Simplify returns processing and improve customer satisfaction.", href: "/solutions/returns-management" },
  { icon: BarChart3, title: "Analytics & Reporting", desc: "Gain actionable insights into your fulfillment performance and operations.", href: "/solutions/analytics-reporting" },
];

const connectedItems = [
  "Centralize orders, shipments, and inventory",
  "Monitor QC, shipping, and delivery in real time",
  "Collaborate with suppliers and 3PLs seamlessly",
  "Make data-driven decisions with built-in analytics",
];

const mapNodes = [
  { label: "Supplier Matching", icon: Search, top: "26%", left: "30%" },
  { label: "Packaging & QC", icon: Package, top: "16%", left: "78%" },
  { label: "Shipping & Logistics", icon: Truck, top: "76%", left: "20%" },
  { label: "Overseas Warehousing", icon: Warehouse, top: "78%", left: "76%" },
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

export default function SolutionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-[36px] lg:text-[44px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                End-to-end fulfillment solutions for{" "}
                <span className="gradient-text-teal">global e-commerce brands</span>
              </h1>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[460px]">
                Streamline your operations, scale your business, and delight your customers with our integrated fulfillment platform.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-lg bg-action-blue hover:bg-action-blue/90 transition-all">
                  Book a Demo
                </Link>
              </div>
            </div>

            {/* Network map illustration */}
            <div className="relative hidden lg:block h-[320px]">
              <svg className="absolute inset-0 w-full h-full opacity-[0.5]" viewBox="0 0 500 400" fill="none">
                {Array.from({ length: 200 }).map((_, i) => {
                  const x = (i * 37) % 500;
                  const y = ((i * 53) % 360) + 20;
                  return <circle key={i} cx={x} cy={y} r="1.3" fill="#B8C7DA" />;
                })}
              </svg>
              {/* connecting lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 400" fill="none">
                {[[250,200,150,104],[250,200,390,64],[250,200,100,304],[250,200,380,312]].map(([x1,y1,x2,y2],i)=>(
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00B894" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5" />
                ))}
              </svg>
              {/* center logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-xl gradient-logo flex items-center justify-center text-white font-bold text-lg shadow-card">
                FM
              </div>
              {/* nodes */}
              {mapNodes.map((n) => (
                <div key={n.label} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1" style={{ top: n.top, left: n.left }}>
                  <div className="w-10 h-10 rounded-lg bg-white border border-border-soft shadow-soft flex items-center justify-center">
                    <n.icon className="w-[18px] h-[18px] text-navy" />
                  </div>
                  <span className="text-[10px] font-medium text-text-muted whitespace-nowrap">{n.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="text-center max-w-[580px] mx-auto mb-8">
            <h2 className="text-[24px] font-bold text-deep-navy leading-tight">
              Comprehensive solutions for every step of fulfillment
            </h2>
            <p className="mt-3 text-[14px] text-text-body">
              From inventory management to last-mile delivery, our platform covers every aspect of your fulfillment process.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {solutions.map((s, i) => (
              <Link key={i} href={s.href} className="group bg-white rounded-xl p-5 border border-border-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-action-blue/10 flex items-center justify-center mb-3">
                  <s.icon className="w-[18px] h-[18px] text-action-blue" />
                </div>
                <h3 className="text-[14px] font-bold text-deep-navy mb-1">{s.title}</h3>
                <p className="text-[12px] text-text-body leading-relaxed mb-2">{s.desc}</p>
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-navy group-hover:gap-2 transition-all">
                  Learn more <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Everything connected */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-[26px] font-bold text-deep-navy leading-tight">
                Everything connected. Everything tracked.
              </h2>
              <p className="mt-3 text-[14px] text-text-body leading-relaxed max-w-[420px]">
                Integrate with your favorite e-commerce platforms, marketplaces, and tools for seamless workflow.
              </p>
              <div className="mt-5 space-y-2.5">
                {connectedItems.map((c) => (
                  <div key={c} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-[18px] h-[18px] text-teal shrink-0" />
                    <span className="text-[14px] text-text-body">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card overflow-hidden">
              <div className="p-4">
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
      </section>
    </>
  );
}
