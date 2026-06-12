import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe, Factory, Boxes, Ship, BarChart3,
  ArrowRight, Award, BadgeCheck, ShieldCheck,
  ClipboardList, TrendingUp, Layers, Headphones,
} from "lucide-react";
import FinalCTA from "@/components/FinalCTA";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How It Works",
  description:
    "See how FulfillMesh works — from telling us your needs and getting matched with vetted fulfillment partners to shipping, tracking, and optimizing your operations from a single dashboard.",
  path: "/how-it-works",
  keywords: [
    "how FulfillMesh works",
    "fulfillment process",
    "supplier matching",
    "order fulfillment workflow",
    "fulfillment dashboard",
  ],
});

/* ============ Hero ============ */
const heroNodes = [
  { icon: ClipboardList, label: "Sourcing", angle: -90 },
  { icon: Factory, label: "Factories", angle: -30 },
  { icon: ShieldCheck, label: "QC", angle: 30 },
  { icon: Ship, label: "Shipping", angle: 90 },
  { icon: BarChart3, label: "Analytics", angle: 150 },
  { icon: Boxes, label: "Inventory", angle: 210 },
];

function HeroSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block text-[11px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-0.5 uppercase">
              Our Process
            </span>
            <h1 className="mt-3 text-[32px] lg:text-[40px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
              How FulfillMesh works
            </h1>
            <p className="mt-3 text-[14px] text-text-body leading-relaxed max-w-[480px]">
              From initial consultation to ongoing fulfillment management — we handle the complexity so you can focus on growth.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/book-a-demo"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold text-navy rounded-lg border border-border-soft bg-white hover:shadow-soft transition-all"
              >
                Book a Demo
              </Link>
            </div>
          </div>

          {/* Globe with orbiting nodes */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[300px]">
            <div className="relative w-[300px] h-[300px]">
              <svg viewBox="0 0 420 420" className="absolute inset-0 w-full h-full" aria-hidden="true">
                <defs>
                  <radialGradient id="hwHaloGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00B894" stopOpacity="0.10" />
                    <stop offset="70%" stopColor="#00B894" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#00B894" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="210" cy="210" r="200" fill="url(#hwHaloGrad)" />
                <circle cx="210" cy="210" r="160" fill="none" stroke="#D9E5F2" strokeWidth="1.5" />
                <circle cx="210" cy="210" r="112" fill="none" stroke="#E6EDF5" strokeWidth="1.5" strokeDasharray="4 6" />
                {heroNodes.map((n, i) => {
                  const rad = (n.angle * Math.PI) / 180;
                  const x = 210 + Math.cos(rad) * 160;
                  const y = 210 + Math.sin(rad) * 160;
                  return (
                    <g key={i}>
                      <line x1="210" y1="210" x2={x} y2={y} stroke="#00B894" strokeOpacity="0.35" strokeWidth="1.6" strokeDasharray="3 4" />
                      <circle cx={x} cy={y} r="3" fill="#00B894" />
                    </g>
                  );
                })}
              </svg>

              {/* Center globe */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-action-blue flex items-center justify-center shadow-button ring-6 ring-action-blue/10">
                <Globe className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>

              {/* Orbiting service nodes */}
              {heroNodes.map((n, i) => {
                const rad = (n.angle * Math.PI) / 180;
                const x = 50 + (Math.cos(rad) * 160 / 420) * 100;
                const y = 50 + (Math.sin(rad) * 160 / 420) * 100;
                return (
                  <div
                    key={i}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-white shadow-soft border border-border-blue flex items-center justify-center">
                      <n.icon className="w-5 h-5 text-action-blue" strokeWidth={1.75} />
                    </div>
                    <span className="mt-1 text-[10px] font-semibold text-deep-navy whitespace-nowrap bg-white/80 px-1 rounded">{n.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Process Steps ============ */
const steps = [
  { num: "1", title: "Tell us your needs", desc: "Share your product, volume, destination, and requirements." },
  { num: "2", title: "Get matched", desc: "We match you with the best vetted fulfillment partner." },
  { num: "3", title: "Start shipping", desc: "We manage QC, packaging, shipping, and delivery." },
  { num: "4", title: "Track & optimize", desc: "Monitor performance in real time and keep improving." },
];

function StepsSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="text-center max-w-[540px] mx-auto mb-8">
          <h2 className="text-[24px] font-bold text-deep-navy leading-tight">The FulfillMesh process</h2>
          <p className="mt-2 text-[14px] text-text-body">Four simple steps from consultation to ongoing optimization.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-w-[720px] mx-auto">
          {steps.map((step) => (
            <div key={step.num} className="bg-white rounded-xl border border-border-blue p-4 shadow-soft flex items-start gap-3 hover:shadow-card transition-all">
              <div className="w-8 h-8 shrink-0 rounded-full gradient-cta flex items-center justify-center text-white text-[13px] font-bold shadow-button">
                {step.num}
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-deep-navy">{step.title}</h3>
                <p className="mt-1 text-[13px] text-text-body leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ What you can expect ============ */
const expectCards = [
  { icon: Award, title: "Expert Guidance", desc: "Dedicated support from sourcing experts who understand your market and goals." },
  { icon: BadgeCheck, title: "Vetted Network", desc: "Access to our network of 1,200+ pre-vetted factories and logistics partners." },
  { icon: ShieldCheck, title: "Quality Assurance", desc: "Rigorous quality control and inspections to protect your brand and customers." },
  { icon: TrendingUp, title: "Real-Time Tracking", desc: "Full visibility into every order with our intuitive dashboard and analytics." },
  { icon: Layers, title: "Scalable Operations", desc: "From small batches to large volumes — we scale with your business needs." },
  { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock assistance from our dedicated operations team." },
];

function ExpectSection() {
  return (
    <section className="bg-soft-bg">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="text-center max-w-[540px] mx-auto mb-8">
          <h2 className="text-[24px] font-bold text-deep-navy leading-tight">What you can expect</h2>
          <p className="mt-2 text-[14px] text-text-body">We make international sourcing simple, reliable, and scalable.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expectCards.map((c) => (
            <div key={c.title} className="rounded-xl border border-border-blue bg-white p-4 hover:shadow-card hover:border-teal/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-action-blue/10 flex items-center justify-center mb-3">
                <c.icon className="w-5 h-5 text-action-blue" />
              </div>
              <h3 className="text-[14px] font-bold text-deep-navy mb-1">{c.title}</h3>
              <p className="text-[12px] text-text-body leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Dashboard Preview ============ */
function DashboardPreviewSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="text-center mb-6">
          <h2 className="text-[24px] font-bold text-deep-navy leading-tight">Your operations, one dashboard</h2>
          <p className="mt-2 text-[14px] text-text-body max-w-[540px] mx-auto">
            Track orders, manage inventory, and monitor shipments — all from a single, intuitive interface.
          </p>
        </div>
        {/* Dashboard mockup */}
        <div className="relative rounded-2xl border border-border-blue shadow-card overflow-hidden bg-gradient-to-br from-soft-bg to-white">
          <div className="p-4">
            {/* Mock dashboard */}
            <div className="bg-white rounded-xl border border-border-blue overflow-hidden">
              {/* Dashboard header bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border-blue bg-soft-bg">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="text-[11px] text-text-muted font-medium">FulfillMesh Dashboard</div>
                <div className="w-12" />
              </div>
              {/* Dashboard content */}
              <div className="p-4">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Active Orders", value: "1,284", change: "+12%", color: "text-teal" },
                    { label: "In Transit", value: "847", change: "+8%", color: "text-teal" },
                    { label: "Delivered", value: "12,493", change: "+24%", color: "text-teal" },
                    { label: "On-Time Rate", value: "97.4%", change: "+2.1%", color: "text-teal" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-border-blue p-2.5 bg-white">
                      <p className="text-[10px] text-text-muted font-medium">{stat.label}</p>
                      <p className="text-[18px] font-bold text-deep-navy mt-0.5">{stat.value}</p>
                      <p className={`text-[10px] font-semibold ${stat.color}`}>{stat.change}</p>
                    </div>
                  ))}
                </div>
                {/* Chart placeholder */}
                <div className="rounded-lg border border-border-blue p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-semibold text-deep-navy">Order Volume</p>
                    <div className="flex gap-1.5">
                      <span className="text-[9px] text-text-muted bg-soft-bg px-2 py-0.5 rounded">7D</span>
                      <span className="text-[9px] text-white bg-action-blue px-2 py-0.5 rounded">30D</span>
                      <span className="text-[9px] text-text-muted bg-soft-bg px-2 py-0.5 rounded">90D</span>
                    </div>
                  </div>
                  {/* Chart bars */}
                  <div className="flex items-end gap-1 h-16">
                    {[40, 55, 35, 65, 50, 75, 60, 45, 70, 80, 55, 65, 50, 85, 70, 60, 75, 90, 65, 55, 80, 70, 85, 95, 75, 60, 80, 70, 90, 85].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: h > 80 ? 'linear-gradient(180deg, #00B894 0%, #10D6B0 100%)' : '#D9E5F2' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Page ============ */
export default function HowItWorksPage() {
  return (
    <main>
      <HeroSection />
      <StepsSection />
      <ExpectSection />
      <DashboardPreviewSection />
      <FinalCTA
        headline="Ready to streamline your sourcing and shipping?"
        subtitle="Start your journey with FulfillMesh today."
        primaryText="Get Started"
        secondaryText="Book a Demo"
      />
    </main>
  );
}
