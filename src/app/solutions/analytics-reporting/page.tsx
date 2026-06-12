import Link from "next/link";
import {
  BarChart3, FileText, Target, Truck, RotateCcw, Users, ArrowRight, CheckCircle2,
  Database, LineChart, Lightbulb, Settings, TrendingUp, ShieldCheck, Zap, Globe,
} from "lucide-react";

const heroStats = [
  { label: "Total Orders", value: "12,842", delta: "+12%" },
  { label: "Shipments Tracked", value: "1,205", delta: "+5%" },
  { label: "On-Time Delivery", value: "97.4%", delta: "+2%" },
  { label: "Total Revenue", value: "$1.62M", delta: "+18%" },
];

const features = [
  { icon: BarChart3, title: "Performance Dashboards", desc: "Get a real-time overview of your key metrics with customizable dashboards built for your business." },
  { icon: FileText, title: "Custom Reports", desc: "Build and schedule custom reports tailored to your data, teams, and decision-making needs." },
  { icon: Target, title: "KPI Tracking", desc: "Track KPIs across orders, shipping, returns, and inventory to measure performance and progress." },
  { icon: Truck, title: "Shipment Insights", desc: "Analyze shipping performance, transit times, carrier reliability, and on-time delivery metrics." },
  { icon: RotateCcw, title: "Return Insights", desc: "Understand return reasons, timelines, costs, and trends to improve customer experience and reduce losses." },
  { icon: Users, title: "Supplier Performance Reporting", desc: "Evaluate supplier quality, on-time shipping, accuracy, and responsiveness with objective data." },
];

const works = [
  { icon: Database, title: "Collect", desc: "Consolidate data from orders, shipments, inventory, and suppliers." },
  { icon: LineChart, title: "Analyze", desc: "Identify trends, spot issues, and uncover opportunities across your supply chain." },
  { icon: Lightbulb, title: "Decide", desc: "Use actionable insights to make faster, smarter, and more confident decisions." },
  { icon: Settings, title: "Optimize", desc: "Improve processes, reduce costs, and enhance customer experience at every step." },
  { icon: TrendingUp, title: "Grow", desc: "Scale efficiently with data-driven strategies and continuous improvement." },
];

const dashBullets = [
  "Real-time dashboards and live data",
  "Filter by date, location, channel, and more",
  "Drill-down into detailed performance metrics",
  "Export reports and connect your tools",
];

const outcomes = [
  { icon: ShieldCheck, title: "End-to-End Visibility", desc: "See your entire fulfillment operation in real time — from order to delivery." },
  { icon: BarChart3, title: "Better Decisions", desc: "Replace guesswork with data-backed insights you can trust." },
  { icon: Zap, title: "Operational Efficiency", desc: "Identify bottlenecks, reduce delays, and improve resource allocation." },
  { icon: Globe, title: "Scale with Confidence", desc: "Leverage accurate data to support growth and meet customer demand." },
];

const shipStats = [
  { label: "Shipments", value: "15,203", delta: "+9%" },
  { label: "On-Time Delivery", value: "97.4%", delta: "+2.1%" },
  { label: "Avg. Transit Time", value: "2.6 days", delta: "-8%" },
  { label: "Late Shipments", value: "389", delta: "-12%" },
];

export default function AnalyticsReportingPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-teal bg-teal/10 rounded-full px-3.5 py-1.5 uppercase">Analytics & Reporting</span>
              <h1 className="mt-6 text-[38px] lg:text-[48px] font-extrabold text-deep-navy leading-[1.08] tracking-tight">
                Make smarter decisions<br />with <span className="gradient-text-teal">real-time visibility</span>
              </h1>
              <p className="mt-6 text-[16px] text-text-body leading-[1.7] max-w-[480px]">
                FulfillMesh turns your fulfillment data into actionable insights. Track performance, uncover trends, and make data-driven decisions that optimize operations and accelerate growth.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-white rounded-xl gradient-cta hover:shadow-button transition-all">Book a Demo <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/get-started" className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-navy rounded-xl border border-border-soft bg-white hover:shadow-soft transition-all">Explore the Platform</Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
                {["Real-time Data", "Customizable Dashboards", "Export & Integrate"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body"><CheckCircle2 className="w-[18px] h-[18px] text-teal" /> {t}</span>
                ))}
              </div>
            </div>
            {/* Hero dashboard */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[14px] font-bold text-deep-navy">Analytics Overview</span>
                <span className="text-[12px] text-text-muted">May 1 – May 18, 2025</span>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-5">
                {heroStats.map((s) => (
                  <div key={s.label} className="bg-soft-bg rounded-xl p-3 text-center border border-border-soft">
                    <p className="text-[10px] text-text-muted leading-tight mb-1">{s.label}</p>
                    <p className="text-[18px] font-bold text-deep-navy leading-tight">{s.value}</p>
                    <p className="text-[10px] font-semibold text-teal mt-1">{s.delta}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 border border-border-soft rounded-xl p-4">
                  <p className="text-[11px] font-semibold text-deep-navy mb-3">Orders Over Time</p>
                  <svg viewBox="0 0 140 50" className="w-full h-auto">
                    <polyline fill="none" stroke="#0057D8" strokeWidth="1.5" points="0,40 20,30 40,35 60,20 80,25 100,12 120,18 140,8" />
                  </svg>
                </div>
                <div className="border border-border-soft rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                  <p className="text-[10px] font-semibold text-deep-navy self-start mb-1">Order Sources</p>
                  <div className="relative">
                    <svg viewBox="0 0 50 50" className="w-16 h-16">
                      <circle cx="25" cy="25" r="18" fill="none" stroke="#E6EDF5" strokeWidth="7" />
                      <circle cx="25" cy="25" r="18" fill="none" stroke="#00B894" strokeWidth="7" strokeDasharray="62 113" transform="rotate(-90 25 25)" />
                      <circle cx="25" cy="25" r="18" fill="none" stroke="#0057D8" strokeWidth="7" strokeDasharray="34 113" strokeDashoffset="-62" transform="rotate(-90 25 25)" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-deep-navy">58%</span>
                  </div>
                  <div className="w-full space-y-1 mt-1">
                    <p className="flex items-center gap-1.5 text-[8px] text-text-muted"><span className="w-2 h-2 rounded-full bg-teal inline-block" /> Online</p>
                    <p className="flex items-center gap-1.5 text-[8px] text-text-muted"><span className="w-2 h-2 rounded-full bg-action-blue inline-block" /> Retail</p>
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
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-teal bg-teal/10 rounded-full px-3.5 py-1.5 uppercase mb-5">Features</span>
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">Powerful analytics built for every part of your operation</h2>
            <p className="mt-4 text-[16px] text-text-body leading-relaxed">Monitor what matters, uncover opportunities, and drive continuous improvement.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-7 border border-[#E2E8F0] hover:shadow-card transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-action-blue/10 flex items-center justify-center shrink-0"><f.icon className="w-5 h-5 text-action-blue" /></div>
                  <div>
                    <h3 className="text-[16px] font-bold text-deep-navy">{f.title}</h3>
                    <p className="mt-2 text-[14px] text-text-body leading-relaxed">{f.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-action-blue group-hover:gap-2.5 transition-all">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All your data dashboard */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-teal bg-teal/10 rounded-full px-3.5 py-1.5 uppercase">Deep visibility. Real results.</span>
              <h2 className="mt-6 text-[30px] font-bold text-deep-navy leading-tight">All your data. One platform. Actionable insights.</h2>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed max-w-[440px]">FulfillMesh consolidates data from across your supply chain into one unified view — so you can spot trends, act fast, and stay ahead.</p>
              <div className="mt-7 space-y-4">
                {dashBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-teal shrink-0" /><span className="text-[15px] text-text-body">{b}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[14px] font-bold text-deep-navy">Shipments Performance</span>
                <span className="text-[12px] text-text-muted">All Carriers</span>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-5">
                {shipStats.map((s) => (
                  <div key={s.label} className="bg-soft-bg rounded-xl p-3 text-center border border-border-soft">
                    <p className="text-[16px] font-bold text-deep-navy">{s.value}</p>
                    <p className="text-[10px] text-text-muted mt-1">{s.label}</p>
                    <p className="text-[10px] text-teal font-semibold mt-0.5">{s.delta}</p>
                  </div>
                ))}
              </div>
              <div className="border border-border-soft rounded-xl p-4">
                <p className="text-[11px] font-semibold text-deep-navy mb-3">Shipments Over Time</p>
                <svg viewBox="0 0 280 50" className="w-full h-auto">
                  {[20, 35, 28, 42, 30, 48, 38, 52].map((h, i) => (
                    <rect key={i} x={i * 35 + 4} y={50 - h} width="22" height={h} rx="3" fill="#00B894" opacity="0.8" />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How teams use data */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-teal bg-teal/10 rounded-full px-3.5 py-1.5 uppercase mb-5">How It Works</span>
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">How teams use data to optimize operations</h2>
            <p className="mt-4 text-[16px] text-text-body leading-relaxed">From visibility to action — turn insights into measurable impact.</p>
          </div>
          <div className="relative grid gap-6" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {works.map((w, i) => (
              <div key={w.title} className="relative bg-soft-bg rounded-xl border border-[#E2E8F0] p-6 hover:shadow-soft transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-deep-navy text-white text-[13px] font-bold flex items-center justify-center">{i + 1}</span>
                  <w.icon className="w-5 h-5 text-teal" />
                </div>
                <h3 className="text-[15px] font-bold text-deep-navy">{w.title}</h3>
                <p className="mt-2.5 text-[13px] text-text-muted leading-relaxed">{w.desc}</p>
                {i < works.length - 1 && (<ArrowRight className="hidden lg:block absolute top-1/2 -right-5 -translate-y-1/2 w-5 h-5 text-teal/30" />)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data that drives better outcomes */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-teal bg-teal/10 rounded-full px-3.5 py-1.5 uppercase mb-5">Outcomes</span>
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">Data that drives better outcomes</h2>
            <p className="mt-4 text-[16px] text-text-body leading-relaxed">Make an impact where it matters most.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {outcomes.map((o) => (
              <div key={o.title} className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
                <div className="w-12 h-12 rounded-2xl bg-action-blue/10 flex items-center justify-center mb-5"><o.icon className="w-6 h-6 text-action-blue" /></div>
                <h3 className="text-[16px] font-bold text-deep-navy mb-2">{o.title}</h3>
                <p className="text-[14px] text-text-body leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-soft-bg pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-8 py-16">
            <h2 className="text-[32px] font-bold leading-tight">Turn your data into a competitive advantage.</h2>
            <p className="mt-4 text-[16px] text-text-on-dark-muted">Get the insights you need to optimize performance and scale smarter.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-white rounded-xl gradient-cta hover:shadow-button transition-all">Book a Demo <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/get-started" className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-white rounded-xl border border-white/25 hover:bg-white/10 transition-all">Explore the Platform</Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2">
              {["Free to get started", "No obligations", "Personalized walkthrough"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-on-dark-soft"><CheckCircle2 className="w-4 h-4 text-teal" /> {t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
