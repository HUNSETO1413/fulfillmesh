import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList, Users, ShieldCheck, Truck, LineChart,
  ArrowRight, Check, BadgeCheck, BarChart3,
  TrendingUp, Calendar, Bell, MoreHorizontal, Star,
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

/* ============ Shared step meta (flow + timeline) ============ */
const flow = [
  { icon: ClipboardList, label: "Tell us your needs" },
  { icon: Users, label: "Get matched with partners" },
  { icon: ShieldCheck, label: "Confirm sourcing & QC" },
  { icon: Truck, label: "Launch shipping & operations" },
  { icon: LineChart, label: "Track & optimize in one dashboard" },
];

/* ============ Hero ============ */
function HeroSection() {
  return (
    <section className="bg-white border-b border-border-soft">
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-10">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
          {/* Left copy */}
          <div>
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] text-teal bg-teal/10 rounded-full px-3 py-1 uppercase">
              Our Process
            </span>
            <h1 className="mt-4 text-[34px] lg:text-[44px] font-extrabold text-deep-navy leading-[1.08] tracking-tight">
              How <span className="text-action-blue">Fulfill</span>
              <span className="text-teal">Mesh</span> works
            </h1>
            <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[460px]">
              A simple, transparent process to source, ship, and scale from China
              with confidence. We handle the complexity — you focus on growth.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/book-a-demo"
                className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-deep-navy rounded-[10px] border border-border-blue bg-white hover:shadow-soft transition-all"
              >
                Book a Demo
              </Link>
            </div>
            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              {["No Hidden Fees", "Vetted Partners", "End-to-End Support"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-body">
                  <span className="w-4 h-4 rounded-full bg-teal/15 inline-flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-teal" strokeWidth={3.5} />
                  </span>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Right: horizontal flow diagram */}
          <div className="hidden lg:block">
            <div className="relative flex items-start justify-between">
              {/* connecting line */}
              <div className="absolute top-6 left-[6%] right-[6%] h-px border-t border-dashed border-border-blue" aria-hidden="true" />
              {flow.map((s, i) => (
                <div key={i} className="relative flex flex-col items-center text-center w-1/5 px-1">
                  <div className="w-12 h-12 rounded-full bg-white border border-border-blue shadow-soft flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-action-blue" strokeWidth={1.75} />
                  </div>
                  <span className="absolute -top-1 right-[18%] w-5 h-5 rounded-full gradient-cta text-white text-[10px] font-bold flex items-center justify-center shadow-button">
                    {i + 1}
                  </span>
                  <span className="mt-3 text-[11px] font-semibold text-deep-navy leading-tight">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Step-by-step (detailed timeline) ============ */
function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-2 py-1.5 border-b border-border-soft/70 last:border-0">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="text-[11px] font-medium text-deep-navy">{value}</span>
    </div>
  );
}

/* Step 1 panel */
function ReqPanel() {
  return (
    <div className="rounded-xl border border-border-soft bg-white p-4">
      <p className="text-[12px] font-bold text-deep-navy mb-2">Share your requirements</p>
      <div className="grid grid-cols-2 gap-x-6">
        <div>
          <FieldRow label="Product Type" value="Home & Kitchen" />
          <FieldRow label="Monthly Volume" value="10,000 - 20,000" />
          <FieldRow label="Destination" value="United States" />
        </div>
        <div>
          <FieldRow label="Target Price (USD)" value="$2.00 - $5.00" />
          <FieldRow label="Timeline" value="30 - 45 days" />
        </div>
      </div>
    </div>
  );
}

/* Step 2 panel */
function PartnersPanel() {
  const partners = [
    { name: "Shenzhen Best Co.", loc: "Shenzhen", spec: "Electronics", rating: "4.9" },
    { name: "Ningbo Pro Supply", loc: "Ningbo", spec: "Home Goods", rating: "4.8" },
    { name: "Guangzhou Prime", loc: "Guangzhou", spec: "Packaging", rating: "4.7" },
  ];
  return (
    <div className="rounded-xl border border-border-soft bg-white p-4">
      <p className="text-[12px] font-bold text-deep-navy mb-2">Matched Partners</p>
      <div className="grid grid-cols-[1.4fr_1fr_1fr_auto] gap-2 text-[10px] text-text-muted pb-1.5 border-b border-border-soft">
        <span>Partner</span><span>Location</span><span>Specialty</span><span>Rating</span>
      </div>
      {partners.map((p) => (
        <div key={p.name} className="grid grid-cols-[1.4fr_1fr_1fr_auto] gap-2 items-center py-2 border-b border-border-soft/60 last:border-0">
          <span className="text-[11px] font-semibold text-deep-navy">{p.name}</span>
          <span className="text-[11px] text-text-body">{p.loc}</span>
          <span className="text-[11px] text-text-body">{p.spec}</span>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-deep-navy">
            <Star className="w-3 h-3 text-teal fill-teal" /> {p.rating}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Step 3 panel */
function QCPanel() {
  const stages = [
    { title: "Sample Approval", status: "Approved", color: "text-teal" },
    { title: "Pre-Production Inspection", status: "Passed", color: "text-teal" },
    { title: "During Production Inspection", status: "In Progress", color: "text-action-blue" },
    { title: "Final Random Inspection", status: "Scheduled", color: "text-text-muted" },
  ];
  return (
    <div className="rounded-xl border border-border-soft bg-white p-4">
      <p className="text-[12px] font-bold text-deep-navy mb-3">Quality Control</p>
      <div className="grid grid-cols-4 gap-2">
        {stages.map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-soft-bg border border-border-soft flex items-center justify-center mb-1.5">
              <ShieldCheck className="w-4 h-4 text-action-blue" strokeWidth={1.75} />
            </div>
            <span className="text-[9.5px] text-text-body leading-tight">{s.title}</span>
            <span className={`mt-1 text-[10px] font-semibold ${s.color}`}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Step 4 panel */
function ShipmentPanel() {
  const stats = [
    { label: "Shipments", value: "12" },
    { label: "In Transit", value: "8" },
    { label: "On-Time Delivery", value: "97.4%" },
    { label: "Next Delivery", value: "May 23, 2025" },
  ];
  return (
    <div className="rounded-xl border border-border-soft bg-white p-4">
      <p className="text-[12px] font-bold text-deep-navy mb-3">Shipment Overview</p>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-[10px] text-text-muted">{s.label}</p>
            <p className="text-[14px] font-bold text-deep-navy mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-border-soft">
        <span className="text-[11px] font-medium text-deep-navy">Shenzhen → Los Angeles</span>
        <span className="inline-flex items-center gap-2">
          <span className="text-[9.5px] font-semibold text-teal bg-teal/10 px-2 py-0.5 rounded-full">In Transit</span>
          <span className="text-[10px] text-text-muted">ETA May 20, 2025</span>
          <span className="text-[10px] font-semibold text-white gradient-cta px-2.5 py-1 rounded-md">Track Shipment</span>
        </span>
      </div>
    </div>
  );
}

/* Step 5 panel */
function DashStatsPanel() {
  const stats = [
    { label: "Orders", value: "12,842", change: "8.5%" },
    { label: "Shipments", value: "11,205", change: "7.2%" },
    { label: "On-Time Delivery", value: "97.4%", change: "2.1%" },
    { label: "Total Spend", value: "$1.62M", change: "10.3%" },
  ];
  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border-soft bg-white p-3.5">
          <p className="text-[10px] text-text-muted">{s.label}</p>
          <p className="text-[18px] font-bold text-deep-navy mt-0.5">{s.value}</p>
          <p className="text-[10px] font-semibold text-teal mt-0.5 inline-flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> {s.change} vs last 30 days
          </p>
        </div>
      ))}
    </div>
  );
}

const stepData = [
  {
    icon: ClipboardList,
    title: "Tell us your needs",
    desc: "Share your product details, target volume, timeline, budget, and destination. Our team learns your goals and requirements to build the right sourcing strategy.",
    panel: <ReqPanel />,
  },
  {
    icon: Users,
    title: "Get matched with vetted partners",
    desc: "We search our network of 1,200+ vetted factories and providers in China to match you with the top candidates based on quality, capacity, certifications, and price.",
    panel: <PartnersPanel />,
  },
  {
    icon: ShieldCheck,
    title: "Confirm sourcing & QC",
    desc: "Approve samples, lock in pricing, and confirm production. We oversee quality control inspections at every stage to ensure your standards are met.",
    panel: <QCPanel />,
  },
  {
    icon: Truck,
    title: "Launch shipping & operations",
    desc: "We manage packaging, documentation, customs clearance, and shipping. Your products are delivered on time and fully trackable.",
    panel: <ShipmentPanel />,
  },
  {
    icon: LineChart,
    title: "Track & optimize in one dashboard",
    desc: "Monitor orders, shipments, inventory, and performance in real time. Gain insights, identify opportunities, and optimize every order.",
    panel: <DashStatsPanel />,
  },
];

function StepsSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="text-center max-w-[560px] mx-auto mb-12">
          <h2 className="text-[28px] font-bold text-deep-navy leading-tight">
            The FulfillMesh process, step by step
          </h2>
          <p className="mt-3 text-[15px] text-text-body">
            From first conversation to ongoing optimization — we&apos;re with you at every stage.
          </p>
        </div>

        <div className="relative">
          {/* vertical timeline line */}
          <div className="absolute left-[15px] top-3 bottom-3 w-px border-l border-dashed border-border-blue hidden md:block" aria-hidden="true" />
          <div className="space-y-6">
            {stepData.map((s, i) => (
              <div key={i} className="relative md:pl-12">
                {/* number node */}
                <div className="absolute left-0 top-1 hidden md:flex w-8 h-8 rounded-full bg-deep-navy text-white text-[13px] font-bold items-center justify-center shadow-button z-10">
                  {i + 1}
                </div>
                <div className="rounded-2xl border border-border-soft bg-white shadow-soft p-6">
                  <div className="grid lg:grid-cols-[1fr_1.25fr] gap-6 items-center">
                    <div className="flex items-start gap-4">
                      <span className="w-12 h-12 rounded-xl bg-action-blue/10 flex items-center justify-center shrink-0">
                        <s.icon className="w-6 h-6 text-action-blue" strokeWidth={1.75} />
                      </span>
                      <div>
                        <h3 className="text-[18px] font-bold text-deep-navy leading-tight">{s.title}</h3>
                        <p className="mt-2 text-[13px] text-text-body leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                    <div>{s.panel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ What you can expect ============ */
const expectCards = [
  { icon: Users, color: "text-teal", bg: "bg-teal/10", title: "Expert Guidance", desc: "Dedicated support from sourcing experts who understand your market and goals." },
  { icon: BadgeCheck, color: "text-action-blue", bg: "bg-action-blue/10", title: "Vetted Network", desc: "Access to our network of 1,200+ pre-vetted factories and logistics partners." },
  { icon: ShieldCheck, color: "text-[#7C6FF6]", bg: "bg-[#7C6FF6]/10", title: "Quality Assurance", desc: "Rigorous quality control and inspections to protect your brand and customers." },
  { icon: Truck, color: "text-action-blue", bg: "bg-action-blue/10", title: "On-Time Delivery", desc: "Reliable shipping and warehousing to keep your supply chain moving." },
  { icon: BarChart3, color: "text-action-blue", bg: "bg-action-blue/10", title: "Real-Time Visibility", desc: "One dashboard for complete visibility, reporting, and performance tracking." },
  { icon: TrendingUp, color: "text-[#7C6FF6]", bg: "bg-[#7C6FF6]/10", title: "Continuous Optimization", desc: "Data-driven insights to reduce costs, improve performance, and scale with confidence." },
];

function ExpectSection() {
  return (
    <section className="bg-soft-bg">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="text-center max-w-[560px] mx-auto mb-12">
          <h2 className="text-[28px] font-bold text-deep-navy leading-tight">What you can expect at each stage</h2>
          <p className="mt-3 text-[15px] text-text-body">We make international sourcing simple, reliable, and scalable.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {expectCards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border-soft bg-white p-6 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all">
              <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
                <c.icon className={`w-5 h-5 ${c.color}`} strokeWidth={1.75} />
              </div>
              <h3 className="text-[16px] font-bold text-deep-navy mb-1.5">{c.title}</h3>
              <p className="text-[13px] text-text-body leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Everything you need / dashboard preview ============ */
function DashboardPreviewSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="rounded-3xl overflow-hidden border border-border-soft bg-gradient-to-br from-[#E8FBF5] via-[#F3FCF9] to-white">
          <div className="grid lg:grid-cols-[0.85fr_1.4fr] gap-8 items-center p-8 lg:p-10">
            {/* Left copy */}
            <div>
              <span className="text-[11px] font-bold tracking-[0.14em] text-teal uppercase">Real-Time Visibility</span>
              <h2 className="mt-3 text-[28px] font-bold text-deep-navy leading-tight">
                Everything you need,<br />all in one place
              </h2>
              <p className="mt-4 text-[14px] text-text-body leading-relaxed max-w-[360px]">
                Get real-time visibility across orders, shipments, inventory, and
                performance — so you can act faster and grow smarter.
              </p>
              <Link
                href="/book-a-demo"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
              >
                See Dashboard Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: dashboard mockup */}
            <div className="rounded-2xl border border-border-soft bg-white shadow-card overflow-hidden">
              {/* top bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-soft">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-extrabold"><span className="text-action-blue">F</span><span className="text-teal">M</span></span>
                  <div>
                    <p className="text-[13px] font-bold text-deep-navy leading-none">Overview</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Welcome back! Here&apos;s what&apos;s happening with your operations.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-text-body border border-border-soft rounded-lg px-2.5 py-1.5">
                    <Calendar className="w-3.5 h-3.5 text-text-muted" /> May 12 – May 18, 2025
                  </span>
                  <span className="w-7 h-7 rounded-lg border border-border-soft flex items-center justify-center"><Bell className="w-3.5 h-3.5 text-text-muted" /></span>
                  <span className="w-7 h-7 rounded-lg border border-border-soft flex items-center justify-center"><MoreHorizontal className="w-3.5 h-3.5 text-text-muted" /></span>
                </div>
              </div>
              {/* content */}
              <div className="p-5 bg-soft-bg/40">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Orders", value: "12,842", change: "8.5%" },
                    { label: "Shipments", value: "11,205", change: "7.2%" },
                    { label: "On-Time Delivery", value: "97.4%", change: "2.1%" },
                    { label: "Total Spend", value: "$1.62M", change: "10.3%" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border-soft bg-white p-2.5">
                      <p className="text-[9px] text-text-muted">{s.label}</p>
                      <p className="text-[14px] font-bold text-deep-navy mt-0.5">{s.value}</p>
                      <p className="text-[9px] font-semibold text-teal inline-flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" />{s.change}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-[1.6fr_1fr] gap-3">
                  {/* line chart */}
                  <div className="rounded-xl border border-border-soft bg-white p-3">
                    <p className="text-[10px] font-semibold text-deep-navy mb-2">Orders Over Time</p>
                    <svg viewBox="0 0 280 90" className="w-full h-[80px]" preserveAspectRatio="none" aria-hidden="true">
                      <polyline points="0,70 35,55 70,60 105,38 140,45 175,28 210,34 245,18 280,24" fill="none" stroke="#0057D8" strokeWidth="2" />
                      <polyline points="0,80 35,68 70,72 105,55 140,62 175,48 210,52 245,40 280,44" fill="none" stroke="#00B894" strokeWidth="2" />
                    </svg>
                  </div>
                  {/* donut */}
                  <div className="rounded-xl border border-border-soft bg-white p-3">
                    <p className="text-[10px] font-semibold text-deep-navy mb-2">Top Shipping Lanes</p>
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 36 36" className="w-16 h-16" aria-hidden="true">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#D9E5F2" strokeWidth="5" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#0057D8" strokeWidth="5" strokeDasharray="38 100" strokeDashoffset="0" transform="rotate(-90 18 18)" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#00B894" strokeWidth="5" strokeDasharray="28 100" strokeDashoffset="-38" transform="rotate(-90 18 18)" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#7C6FF6" strokeWidth="5" strokeDasharray="18 100" strokeDashoffset="-66" transform="rotate(-90 18 18)" />
                      </svg>
                      <div className="space-y-1">
                        {[
                          { c: "#0057D8", l: "Los Angeles" },
                          { c: "#00B894", l: "New York" },
                          { c: "#7C6FF6", l: "Chicago" },
                        ].map((x) => (
                          <span key={x.l} className="flex items-center gap-1.5 text-[9px] text-text-body">
                            <span className="w-2 h-2 rounded-full" style={{ background: x.c }} /> {x.l}
                          </span>
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
  );
}

/* ============ Testimonials ============ */
const testimonials = [
  { quote: "FulfillMesh helped us find the perfect factory and ship on time, every time. The dashboard gives us complete visibility and peace of mind.", name: "Amanda Lee", role: "Operations Manager, PeakHome" },
  { quote: "Their team is responsive, transparent, and truly a partner in our growth. Highly recommended for any brand sourcing from China.", name: "Jason Martinez", role: "Founder, Summit Goods" },
  { quote: "From sourcing to delivery, everything is seamless. We've reduced costs and improved quality with FulfillMesh.", name: "Priya Patel", role: "Supply Chain Director, Urban Essentials" },
];

function TestimonialsSection() {
  return (
    <section className="bg-soft-bg">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-[28px] font-bold text-deep-navy leading-tight">Trusted by brands worldwide</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border-soft bg-white p-6 shadow-soft">
              <span className="text-[40px] leading-none text-teal/30 font-serif">&ldquo;</span>
              <p className="text-[13px] text-text-body leading-relaxed -mt-3">{t.quote}</p>
              <div className="mt-4">
                <p className="text-[13px] font-bold text-deep-navy">{t.name}</p>
                <p className="text-[11px] text-text-muted">{t.role}</p>
              </div>
            </div>
          ))}
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
      <TestimonialsSection />
      <FinalCTA
        headline="Ready to streamline your sourcing and shipping?"
        subtitle="Join thousands of brands shipping smarter from China."
        primaryText="Get Started Today"
        secondaryText="Book a Demo"
      />
    </main>
  );
}
