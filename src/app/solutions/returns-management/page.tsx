import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, ChevronDown,
  Users, Tag, Truck, Search, CreditCard, Box, Globe,
  RotateCcw, ShoppingCart, RefreshCw, Shirt, Cpu,
  Smile, Star, ShieldCheck, Layers, FileText,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Returns Management & Reverse Logistics",
  description:
    "Simplify returns with branded self-service portals, prepaid labels, and automated workflows. Inspect, restock, and resolve returns globally to cut costs and retain customers.",
  path: "/solutions/returns-management",
  keywords: [
    "returns management",
    "reverse logistics",
    "ecommerce returns",
    "return portal software",
    "international returns processing",
  ],
});

const benefits = [
  { icon: Smile, title: "Streamlined Returns", desc: "Reduce friction with self-service return portals, prepaid labels, and automated workflows." },
  { icon: Star, title: "Better Customer Experience", desc: "Keep customers happy with fast resolutions, clear communication, and flexible refund or exchange options." },
  { icon: ShieldCheck, title: "Inspect With Confidence", desc: "Standardized inspection rules and grading help make accurate decisions and prevent fraud." },
  { icon: Box, title: "Restock & Recover Value", desc: "Intelligent routing and restocking strategies help maximize resale value and minimize losses." },
  { icon: Globe, title: "Handle Returns Globally", desc: "Return to origin or regional processing—our network helps you optimize cost and speed across borders." },
];

const works = [
  { icon: Users, title: "Return Requested", desc: "Customer submits a return request via your branded portal." },
  { icon: Tag, title: "Label Generated", desc: "System auto-generates the return and provides a prepaid return label." },
  { icon: Truck, title: "In Transit", desc: "Customer ships the item back, you get real-time visibility." },
  { icon: Search, title: "Inspection", desc: "Item is received and inspected based on your custom rules." },
  { icon: CreditCard, title: "Resolution", desc: "Refund, exchange, store credit, or replacement is issued." },
  { icon: Box, title: "Restock / Disposition", desc: "Item is restocked, sent to be refurbished, or disposed as needed." },
];

const dashBullets = [
  "Live status tracking across the entire return journey",
  "Breakdowns by reason, product, location, and channel",
  "Aging returns and SLA monitoring",
  "Export-ready data and automated alerts",
];

const dashStats = [
  { label: "Total Returns", value: "2,498", delta: "+8.5%" },
  { label: "Received This Week", value: "612", delta: "+15.2%" },
  { label: "Pending Inspection", value: "184", delta: "+12.4%" },
  { label: "Resolved This Week", value: "538", delta: "+10.3%" },
];

const brands = [
  { icon: ShoppingCart, title: "DTC E-commerce", desc: "Provide a smooth return experience that builds loyalty and drives repeat purchases." },
  { icon: RefreshCw, title: "Subscription Brands", desc: "Handle returns and exchanges efficiently for subscription and replenishment models." },
  { icon: Shirt, title: "Apparel & Fashion", desc: "Manage size exchanges, seasonal returns, and markdown recovery with ease." },
  { icon: Cpu, title: "Electronics & Accessories", desc: "Inspect, test, and route products based on condition and warranty rules." },
  { icon: Globe, title: "Global Brands", desc: "Support cross-border returns with local processing and optimized routing." },
];

const timeline = [
  { icon: FileText, title: "Requirement Intake", desc: "Define return policies, rules, and inspection criteria for your products." },
  { icon: RotateCcw, title: "Portal Setup", desc: "Configure your branded return portal with automated workflows." },
  { icon: Truck, title: "Label & Routing", desc: "Set up carrier integrations, prepaid labels, and routing rules." },
  { icon: Search, title: "Inspection Rules", desc: "Define inspection checklists and disposition logic by product category." },
  { icon: CheckCircle2, title: "Launch & Optimize", desc: "Go live and continuously improve based on data and feedback." },
];

const stats = [
  { icon: RotateCcw, value: "98%", label: "Return Accuracy" },
  { icon: Globe, value: "40+", label: "Countries Covered" },
  { icon: Layers, value: "50+", label: "Carrier Integrations" },
  { icon: ShieldCheck, value: "4.8/5", label: "Customer Satisfaction" },
];

const faqs = [
  { q: "How does the self-service return portal work?" },
  { q: "Can I customize return rules for different products?" },
  { q: "How are refunds and exchanges handled?" },
  { q: "Do you support international returns?" },
];

export default function ReturnsManagementPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="flex items-center gap-2 text-[13px] text-text-muted mb-8">
            <Link href="/" className="hover:text-navy transition-colors">Home</Link><span>/</span>
            <Link href="/solutions" className="hover:text-navy transition-colors">Solutions</Link><span>/</span>
            <span className="text-deep-navy font-medium">Returns Management</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">OUR SOLUTIONS</span>
              <h1 className="mt-5 text-[36px] lg:text-[48px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                Returns Management<br />Simplify returns. Delight customers.{" "}
                <span className="gradient-text-teal">Protect your bottom line.</span>
              </h1>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh makes reverse logistics effortless with automated workflows, real-time visibility, and flexible return options that turn returns into a competitive advantage.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all">Book a Demo <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-navy rounded-lg border-2 border-navy bg-white hover:bg-navy hover:text-white transition-all">See It in Action</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {["Vetted Partners", "End-to-End Support", "No Hidden Fees"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body"><CheckCircle2 className="w-4 h-4 text-teal" /> {t}</span>
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
                <circle cx="250" cy="200" r="120" stroke="#CBD8E8" strokeWidth="1" strokeDasharray="3 5" />
                {[
                  [130, 94],
                  [400, 86],
                  [110, 281],
                  [420, 198],
                  [300, 295],
                ].map(([x, y], i) => (
                  <line key={i} x1="250" y1="200" x2={x} y2={y} stroke="#00B894" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />
                ))}
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-2xl gradient-logo flex items-center justify-center text-white font-bold text-lg shadow-card">FM</div>
              {[
                { label: "Customer Returns", icon: Users, top: "24%", left: "26%" },
                { label: "Inspection & QA", icon: Search, top: "22%", left: "80%" },
                { label: "Reverse Logistics", icon: Truck, top: "70%", left: "22%" },
                { label: "Refunds & Exchanges", icon: CreditCard, top: "50%", left: "84%" },
                { label: "Restock & Resale", icon: Box, top: "74%", left: "60%" },
              ].map((n) => (
                <div key={n.label} className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5" style={{ top: n.top, left: n.left }}>
                  <div className="w-11 h-11 rounded-xl bg-white border border-border-soft shadow-soft flex items-center justify-center"><n.icon className="w-5 h-5 text-navy" /></div>
                  <span className="text-[11px] font-medium text-text-muted whitespace-nowrap">{n.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Built for seamless returns */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[32px] font-bold text-deep-navy leading-tight">Built for a seamless returns experience</h2>
            <p className="mt-3 text-[18px] text-text-muted">From the first return request to the final resolution, we streamline every step.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-xl p-6 border border-border-soft text-center hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-action-blue/10 flex items-center justify-center mx-auto mb-4"><b.icon className="w-6 h-6 text-action-blue" /></div>
                <h3 className="text-[14px] font-bold text-deep-navy mb-2">{b.title}</h3>
                <p className="text-[12px] text-text-body leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How returns flow */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <h2 className="text-[32px] font-bold text-deep-navy leading-tight">How returns flow with FulfillMesh</h2>
            <p className="mt-3 text-[18px] text-text-muted">A transparent, automated process designed for speed and control.</p>
          </div>
          <div className="relative grid gap-6" style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}>
            {works.map((w, i) => (
              <div key={i} className="relative bg-white rounded-xl border border-border-soft p-4 text-center">
                <span className="w-7 h-7 rounded-full bg-deep-navy text-white text-[12px] font-bold flex items-center justify-center mx-auto mb-3">{i + 1}</span>
                <w.icon className="w-6 h-6 text-action-blue mx-auto mb-2" />
                <h3 className="text-[13px] font-bold text-deep-navy">{w.title}</h3>
                <p className="mt-2 text-[11px] text-text-muted leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time visibility dashboard */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">COMPLETE VISIBILITY</span>
              <h2 className="mt-5 text-[32px] font-bold text-deep-navy leading-tight">Real-time reverse logistics visibility</h2>
              <p className="mt-4 text-[18px] text-text-body leading-relaxed max-w-[440px]">Track every return across locations, statuses, and outcomes — so you can act fast and reduce costs.</p>
              <div className="mt-6 space-y-3">
                {dashBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-teal shrink-0" /><span className="text-[14px] text-text-body">{b}</span></div>
                ))}
              </div>
              <Link href="/book-a-demo" className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all">Request a Demo</Link>
            </div>
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-2 text-[13px] font-bold text-deep-navy">
                  <span className="w-6 h-6 rounded-md gradient-logo flex items-center justify-center text-white text-[10px] font-bold">FM</span>FulfillMesh
                </span>
                <span className="text-[11px] text-text-muted">May 12 – May 18, 2025</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {dashStats.map((s) => (
                  <div key={s.label} className="border border-border-soft rounded-lg p-3">
                    <p className="text-[10px] text-text-muted">{s.label}</p>
                    <p className="text-[18px] font-bold text-deep-navy">{s.value}</p>
                    <p className="text-[9px] text-teal">{s.delta}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border-soft rounded-lg p-3 flex items-center gap-3">
                  <svg viewBox="0 0 50 50" className="w-16 h-16 shrink-0">
                    <circle cx="25" cy="25" r="18" fill="none" stroke="#E6EDF5" strokeWidth="7" />
                    <circle cx="25" cy="25" r="18" fill="none" stroke="#0057D8" strokeWidth="7" strokeDasharray="45 68" strokeDashoffset="0" transform="rotate(-90 25 25)" />
                    <circle cx="25" cy="25" r="18" fill="none" stroke="#00B894" strokeWidth="7" strokeDasharray="34 79" strokeDashoffset="-45" transform="rotate(-90 25 25)" />
                    <circle cx="25" cy="25" r="18" fill="none" stroke="#003B7A" strokeWidth="7" strokeDasharray="22 91" strokeDashoffset="-79" transform="rotate(-90 25 25)" />
                    <circle cx="25" cy="25" r="18" fill="none" stroke="#B8C7DA" strokeWidth="7" strokeDasharray="12 101" strokeDashoffset="-101" transform="rotate(-90 25 25)" />
                  </svg>
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-deep-navy mb-1">Returns by Status</p>
                    {[
                      { c: "#0057D8", l: "Received" },
                      { c: "#00B894", l: "Inspected" },
                      { c: "#003B7A", l: "Resolved" },
                      { c: "#B8C7DA", l: "Pending" },
                    ].map((it) => (
                      <span key={it.l} className="flex items-center gap-1.5 text-[8px] text-text-muted">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: it.c }} />{it.l}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border border-border-soft rounded-lg p-3">
                  <p className="text-[10px] font-semibold text-deep-navy mb-2">Returns Over Time</p>
                  <svg viewBox="0 0 120 40" className="w-full h-auto">
                    <polyline fill="none" stroke="#0057D8" strokeWidth="1.5" points="0,32 20,24 40,28 60,16 80,20 100,10 120,14" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect for brands */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[32px] font-bold text-deep-navy leading-tight">Perfect for modern DTC and global brands</h2>
            <p className="mt-3 text-[18px] text-text-muted">Flexible returns that scale with your business model and customer expectations.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {brands.map((b) => (
              <div key={b.title} className="bg-white rounded-xl p-6 border border-border-soft hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center mb-4"><b.icon className="w-5 h-5 text-action-blue" /></div>
                <h3 className="text-[14px] font-bold text-deep-navy mb-2">{b.title}</h3>
                <p className="text-[12px] text-text-body leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <h2 className="text-[32px] font-bold text-deep-navy leading-tight">From setup to seamless returns</h2>
            <p className="mt-3 text-[18px] text-text-muted">A transparent process to get your returns operation running smoothly.</p>
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

      {/* Connected platform stats */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pb-20">
          <div className="bg-deep-navy rounded-2xl p-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">ONE CONNECTED PLATFORM</span>
                <h2 className="mt-5 text-[28px] font-bold text-white leading-tight">
                  Returns Management, connected to your fulfillment operations
                </h2>
                <p className="mt-4 text-[15px] text-text-on-dark-muted leading-relaxed max-w-[400px]">
                  Seamlessly manage returns alongside orders, inventory, and warehouse operations — all in one platform.
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
          <h2 className="text-[32px] font-bold text-deep-navy text-center mb-12">Questions? We&apos;ve got answers.</h2>
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
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-deep-navy via-navy to-[#1E3A8A] opacity-80" />
            <div className="relative z-10">
              <h2 className="text-[36px] font-bold leading-tight">Turn returns into a growth opportunity</h2>
              <p className="mt-3 text-[18px] text-text-on-dark-muted">Reduce costs, improve retention, and uncover value in every return.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-lg bg-white hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] transition-all">Find My Match <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg border-2 border-white hover:bg-white/10 transition-all">Book a Demo</Link>
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {["Free to get started", "No obligations", "Personalized matches"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-on-dark-soft"><CheckCircle2 className="w-4 h-4 text-teal" /> {t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
