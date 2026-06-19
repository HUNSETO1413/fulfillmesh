import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin, Truck, FileCheck, Radar, TrendingUp, AlertTriangle,
  CheckCircle2, Globe, Ship, Package, Boxes, Users,
  ArrowRight, ChevronRight, Calendar, Search, DollarSign, Clock, ShieldCheck,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import DottedWorldMap from "./DottedWorldMap";

export const metadata: Metadata = pageMetadata({
  title: "Shipping & Logistics for Global E-commerce",
  description:
    "Global shipping and logistics from China with vetted carriers, smart route optimization, customs clearance, and real-time tracking for fast, reliable on-time delivery.",
  path: "/solutions/shipping-logistics",
  keywords: [
    "china shipping logistics",
    "freight forwarding",
    "ecommerce shipping",
    "customs clearance",
    "international shipping carriers",
  ],
});

const heroNodes = [
  { label: "Global Carrier Network", icon: Users, top: "22%", left: "20%" },
  { label: "Smart Route Optimization", icon: MapPin, top: "18%", left: "82%" },
  { label: "Real-Time Visibility", icon: Truck, top: "82%", left: "16%" },
  { label: "On-Time Delivery", icon: Globe, top: "84%", left: "84%" },
];

const features = [
  { icon: MapPin, title: "Smart Route Planning", desc: "AI-powered route optimization that reduces transit time and shipping costs across global lanes." },
  { icon: Truck, title: "Carrier Coordination", desc: "Access to a vetted network of global carriers with negotiated rates and reliable capacity." },
  { icon: FileCheck, title: "Customs & Compliance", desc: "End-to-end customs clearance support with accurate documentation and regulatory expertise." },
  { icon: Radar, title: "Real-Time Shipment Tracking", desc: "Live visibility into every shipment with proactive alerts and milestone updates." },
  { icon: TrendingUp, title: "Delivery Optimization", desc: "Optimize delivery windows, reduce delays, and improve on-time performance." },
  { icon: AlertTriangle, title: "Exception Management", desc: "Proactive issue detection and resolution to keep your supply chain moving." },
];

const steps = [
  { num: "1", icon: Package, title: "Pickup", desc: "We pick up your goods from your location or supplier." },
  { num: "2", icon: Boxes, title: "Consolidation", desc: "Shipments are consolidated for optimal space, cost, and efficiency." },
  { num: "3", icon: FileCheck, title: "Customs Clearance", desc: "We handle documentation and clearance to keep your shipments moving." },
  { num: "4", icon: Ship, title: "Transit", desc: "Goods are shipped via the best route and carrier for your needs." },
  { num: "5", icon: Truck, title: "Final-Mile Delivery", desc: "Delivered to your destination on time, every time." },
];

const coverageBullets = [
  "Air, Ocean, Road & Rail options",
  "Cross-border & domestic coverage",
  "Door-to-door or port-to-port",
  "Duties & taxes support",
];

const kpis = [
  { value: "97.4%", label: "On-Time Delivery", delta: "2.1%", up: true, good: true },
  { value: "1.26M", label: "Shipments in Transit", delta: "10.7%", up: true, good: true },
  { value: "3.8 Days", label: "Avg. Transit Time", delta: "12%", up: false, good: true },
  { value: "$2.14M", label: "Freight Spend Saved", delta: "9.6%", up: true, good: true },
];

const networkMarkers = [
  { x: 0.14, y: 0.30, color: "#0057D8" },
  { x: 0.22, y: 0.55, color: "#7C8BF5" },
  { x: 0.30, y: 0.22, color: "#00B894" },
  { x: 0.34, y: 0.70, color: "#0057D8" },
  { x: 0.46, y: 0.40, color: "#7C8BF5" },
  { x: 0.50, y: 0.28, color: "#00B894" },
  { x: 0.58, y: 0.62, color: "#0057D8" },
  { x: 0.66, y: 0.34, color: "#7C8BF5" },
  { x: 0.74, y: 0.48, color: "#00B894" },
  { x: 0.80, y: 0.26, color: "#0057D8" },
  { x: 0.84, y: 0.66, color: "#7C8BF5" },
  { x: 0.90, y: 0.40, color: "#00B894" },
];

const networkArcs = [
  { x1: 0.14, y1: 0.30, x2: 0.50, y2: 0.28 },
  { x1: 0.50, y1: 0.28, x2: 0.80, y2: 0.26 },
  { x1: 0.34, y1: 0.70, x2: 0.58, y2: 0.62 },
  { x1: 0.66, y1: 0.34, x2: 0.90, y2: 0.40 },
];

const sourcingBullets = [
  "Live tracking & milestone visibility",
  "Proactive delay & exception alerts",
  "Centralized documents & compliance",
  "Actionable analytics & reports",
];

const navItems = ["Overview", "Shipments", "Tracking", "Orders", "Carriers", "Analytics", "Exceptions", "Documents"];

const trackingRows = [
  { num: "FM-U123456789", route: "Shanghai, CN → Los Angeles, CA, US", mode: "Air", status: "In Transit", statusColor: "bg-action-blue/10 text-action-blue", eta: "May 20, 2025" },
  { num: "FM-U987654321", route: "Hamburg, DE → Chicago, IL, US", mode: "Ocean", status: "In Transit", statusColor: "bg-action-blue/10 text-action-blue", eta: "May 22, 2025" },
  { num: "FM-U456789012", route: "Shenzhen, CN → Dallas, TX, US", mode: "Road", status: "Out for Delivery", statusColor: "bg-amber-100 text-amber-700", eta: "May 19, 2025" },
  { num: "FM-U789123456", route: "Bangkok, TH → Sydney, AU", mode: "Air", status: "Customs Clearance", statusColor: "bg-purple-100 text-purple-700", eta: "May 23, 2025" },
];

const advantages = [
  { icon: DollarSign, title: "Lower Shipping Costs", desc: "Leverage our network and technology to reduce freight costs and access better rates." },
  { icon: Clock, title: "Faster, More Reliable Delivery", desc: "Optimized routes and proactive management improve delivery speed and reliability." },
  { icon: ShieldCheck, title: "End-to-End Visibility", desc: "Complete visibility from pickup to delivery so you're always in the know." },
  { icon: TrendingUp, title: "Scalable & Flexible", desc: "Solutions built to scale with your business, from startups to global enterprises." },
];

export default function ShippingLogisticsPage() {
  return (
    <main className="overflow-hidden">
      {/* 1. Hero */}
      <section className="bg-white border-b border-border-soft overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-teal/10 text-teal rounded-full px-3 py-1 text-[12px] font-bold tracking-[0.12em]">
                OUR SOLUTIONS
              </span>
              <h1 className="mt-5 text-[36px] lg:text-[44px] font-extrabold text-deep-navy leading-[1.12] tracking-tight">
                Shipping &amp; Logistics{" "}
                <span className="gradient-text-teal">that moves your business forward</span>
              </h1>
              <p className="mt-5 text-[17px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh optimizes global shipping and logistics with the best carriers, smarter routes, and real-time visibility&mdash;so your products arrive on time, every time.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] bg-deep-navy hover:bg-navy hover:shadow-button transition-all">
                  Find My Match <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-[10px] border border-border-blue bg-white hover:shadow-soft transition-all">
                  <Calendar className="w-4 h-4" /> Book a Demo
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {["Vetted Carriers", "Global Coverage", "No Hidden Fees"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Dotted world map with nodes */}
            <div className="relative hidden lg:block h-[380px]">
              <DottedWorldMap
                width={500}
                height={380}
                className="absolute inset-0 w-full h-full"
                hubX={0.5}
                hubY={0.5}
                markers={[
                  { x: 0.2, y: 0.22, color: "#00B894" },
                  { x: 0.82, y: 0.18, color: "#00B894" },
                  { x: 0.16, y: 0.82, color: "#00B894" },
                  { x: 0.84, y: 0.84, color: "#00B894" },
                ]}
                arcs={[
                  { x1: 0.2, y1: 0.22, x2: 0.5, y2: 0.5 },
                  { x1: 0.82, y1: 0.18, x2: 0.5, y2: 0.5 },
                  { x1: 0.16, y1: 0.82, x2: 0.5, y2: 0.5 },
                  { x1: 0.84, y1: 0.84, x2: 0.5, y2: 0.5 },
                ]}
              />
              {/* center FM logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl gradient-logo flex items-center justify-center text-white font-bold text-lg shadow-card">
                FM
              </div>
              {/* corner nodes */}
              {heroNodes.map((n) => (
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

      {/* 2. Comprehensive solutions */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">
              Comprehensive shipping &amp; logistics solutions
            </h2>
            <p className="mt-3 text-[16px] text-text-body">Every shipment. Every mile. Fully optimized.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border-soft p-6 hover:shadow-card transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-action-blue" />
                </div>
                <h3 className="text-[16px] font-bold text-deep-navy mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-text-body leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Process */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">Our shipping &amp; logistics process</h2>
            <p className="mt-3 text-[16px] text-text-body">A streamlined process built for speed, reliability, and scale.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative bg-white rounded-xl border border-border-soft shadow-soft p-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-deep-navy text-white text-[15px] font-bold flex items-center justify-center mb-3">
                    {s.num}
                  </div>
                  <s.icon className="w-6 h-6 text-teal mb-3" />
                </div>
                <h3 className="text-[15px] font-bold text-deep-navy">{s.title}</h3>
                <p className="mt-2 text-[12px] text-text-muted leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <span className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-teal text-lg leading-none">···</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Three-column row */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* a) Global reach */}
            <div>
              <h2 className="text-[24px] font-bold text-deep-navy leading-tight">Global reach. Local expertise.</h2>
              <p className="mt-3 text-[15px] text-text-body leading-relaxed">
                Ship to 220+ countries and territories with our trusted carrier network.
              </p>
              <div className="mt-5 space-y-3">
                {coverageBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
                    <span className="text-[14px] text-text-body">{b}</span>
                  </div>
                ))}
              </div>
              <Link href="/solutions" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-deep-navy rounded-lg border border-border-blue hover:shadow-soft transition-all">
                Explore Coverage <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* b) KPIs */}
            <div>
              <h2 className="text-[24px] font-bold text-deep-navy leading-tight mb-5">Key performance indicators</h2>
              <div className="rounded-xl border border-border-soft p-5">
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  {kpis.map((k) => (
                    <div key={k.label}>
                      <p className="text-[26px] font-bold text-deep-navy leading-none">{k.value}</p>
                      <p className="mt-1.5 text-[13px] text-text-muted">{k.label}</p>
                      <p className="mt-1 text-[11px] text-teal flex items-center gap-0.5">
                        <TrendingUp className={`w-3 h-3 ${k.up ? "" : "rotate-180"}`} /> {k.up ? "↑" : "↓"}{k.delta} vs last 30 days
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* c) Global network map */}
            <div>
              <h2 className="text-[24px] font-bold text-deep-navy leading-tight mb-5">Our global shipping network</h2>
              <div className="rounded-xl border border-border-soft p-4">
                <DottedWorldMap
                  width={500}
                  height={260}
                  className="w-full h-auto"
                  markers={networkMarkers}
                  arcs={networkArcs}
                />
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {[
                    { label: "Air Freight", color: "#0057D8" },
                    { label: "Ocean Freight", color: "#7C8BF5" },
                    { label: "Road Freight", color: "#00B894" },
                  ].map((l) => (
                    <span key={l.label} className="inline-flex items-center gap-1.5 text-[12px] text-text-muted">
                      <span className="w-2 h-2 rounded-full" style={{ background: l.color }} /> {l.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Real-time visibility + dashboard */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-teal/10 text-teal rounded-full px-3 py-1 text-[12px] font-bold tracking-[0.12em]">
                ONE CONNECTED PLATFORM
              </span>
              <h2 className="mt-5 text-[30px] font-bold text-deep-navy leading-tight">
                Real-time visibility you can act on.
              </h2>
              <p className="mt-4 text-[16px] text-text-body leading-relaxed max-w-[440px]">
                Track shipments, monitor performance, and manage exceptions from a single, intuitive dashboard.
              </p>
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
                <span className="text-[10px] text-text-muted">May 12 – May 18, 2025</span>
              </div>
              <div className="flex">
                <div className="w-[92px] shrink-0 border-r border-border-soft py-3 px-3 space-y-2 hidden sm:block">
                  {navItems.map((m, i) => (
                    <p key={m} className={`text-[10px] ${i === 1 ? "text-teal font-semibold" : "text-text-muted"}`}>{m}</p>
                  ))}
                </div>
                <div className="flex-1 p-4 min-w-0">
                  <h4 className="text-[13px] font-bold text-deep-navy mb-2.5">Shipment Tracking</h4>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="flex-1 inline-flex items-center gap-1.5 rounded-md border border-border-soft px-2 py-1.5 text-[8px] text-text-muted">
                      <Search className="w-2.5 h-2.5" /> Search by tracking number, order ID or reference
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-border-soft px-2 py-1.5 text-[8px] text-text-muted">
                      All Modes <ChevronRight className="w-2 h-2 rotate-90" />
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border-soft">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-soft-bg">
                          {["Tracking Number", "Origin → Destination", "Mode", "Status", "Estimated Delivery"].map((c) => (
                            <th key={c} className="px-2 py-1.5 text-[8px] font-semibold text-text-muted whitespace-nowrap">{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {trackingRows.map((r) => (
                          <tr key={r.num} className="border-t border-border-soft">
                            <td className="px-2 py-1.5 text-[8px] font-semibold text-action-blue whitespace-nowrap">{r.num}</td>
                            <td className="px-2 py-1.5 text-[8px] text-text-body whitespace-nowrap">{r.route}</td>
                            <td className="px-2 py-1.5 text-[8px] text-text-body">{r.mode}</td>
                            <td className="px-2 py-1.5">
                              <span className={`inline-block rounded-full px-1.5 py-0.5 text-[8px] font-medium whitespace-nowrap ${r.statusColor}`}>{r.status}</span>
                            </td>
                            <td className="px-2 py-1.5 text-[8px] text-text-body whitespace-nowrap">{r.eta}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Link href="/solutions" className="mt-3 inline-flex items-center gap-1 text-[9px] font-semibold text-action-blue">
                    View all shipments <ChevronRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FulfillMesh advantage */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">The FulfillMesh advantage for your business</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a) => (
              <div key={a.title} className="rounded-xl border border-border-soft p-6">
                <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                  <a.icon className="w-5 h-5 text-teal" />
                </div>
                <h3 className="text-[15px] font-bold text-deep-navy">{a.title}</h3>
                <p className="mt-2 text-[13px] text-text-body leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="bg-white pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14">
            <h2 className="text-[32px] font-bold leading-tight">Ready to streamline your shipping &amp; logistics?</h2>
            <p className="mt-3 text-[17px] text-text-on-dark-muted">
              Let&apos;s build a smarter, more reliable supply chain together.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">
                Find My Match <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] border border-white/30 hover:bg-white/10 transition-all">
                <Calendar className="w-4 h-4" /> Book a Demo
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
