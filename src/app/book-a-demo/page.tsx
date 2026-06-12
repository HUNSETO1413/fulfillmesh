import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar, Check, CheckCircle, Quote,
  Warehouse, MonitorPlay, PiggyBank,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import BookDemoForm from "./BookDemoForm";

export const metadata: Metadata = pageMetadata({
  title: "Book a Demo",
  description:
    "Book a personalized FulfillMesh demo. See how we help brands in China streamline logistics, improve delivery performance, and scale with confidence.",
  path: "/book-a-demo",
  keywords: [
    "book a demo fulfillmesh",
    "fulfillment demo",
    "china fulfillment platform demo",
  ],
});

const expect = [
  { icon: Warehouse, title: "Tailored fulfillment strategy", desc: "We'll analyze your current operations and recommend the best China fulfillment setup for your goals." },
  { icon: MonitorPlay, title: "Live platform walkthrough", desc: "See how FulfillMesh simplifies supplier matching, shipping, tracking, and returns — all in one place." },
  { icon: PiggyBank, title: "Real savings, real results", desc: "We'll show you how brands like yours reduce costs, improve delivery times, and scale with confidence." },
];

const perfectFor = [
  "DTC brands and e-commerce businesses",
  "Operations and supply chain teams",
  "Founders and decision makers",
  "Brands looking to scale in or from China",
];

const stats = [
  { value: "1,200+", label: "Vetted Partners" },
  { value: "98%", label: "On-Time Delivery" },
  { value: "4.9/5", label: "Customer Rating" },
];

const brands = ["nomad", "LARQ", "BREVITÉ", "SHEIN", "ANKER"];

const testimonials = [
  { quote: "FulfillMesh transformed our logistics. Their vetting process gave us confidence, and delivery times improved by 35%.", name: "Sarah Chen", role: "Operations Director", brand: "nomad", avatar: "/images/photo-1494790108377-be9c29b29330.jpg" },
  { quote: "The dashboard gives us full visibility. We save hours every week and our customers are happier than ever.", name: "Michael Tan", role: "Co-Founder", brand: "BREVITÉ", avatar: "/images/photo-1507003211169-0a1dd7228f2d.jpg" },
  { quote: "From supplier matching to shipping, FulfillMesh handles it all. It's a true extension of our team.", name: "Emily Zhou", role: "Head of Supply Chain", brand: "LARQ", avatar: "/images/photo-1544005313-94ddf0286df2.jpg" },
];

const dashboardBullets = [
  "Track orders and shipments in real time",
  "Monitor performance and delivery metrics",
  "Manage returns, inventory, and more",
];

const dashboardStats = [
  { label: "Orders", value: "12,842", delta: "8.5%" },
  { label: "Shipments", value: "11,205", delta: "7.2%" },
  { label: "On-Time Delivery", value: "97.4%", delta: "1.1%" },
  { label: "Revenue", value: "$1.62M", delta: "10.3%" },
];

export default function BookDemoPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-action-blue/10 text-action-blue text-xs font-semibold mb-5">
            <Calendar className="w-3.5 h-3.5" /> Book a Demo
          </span>
          <h1 className="text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight text-text-primary">
            Book your fulfillment <span className="text-teal">strategy</span> demo
          </h1>
          <p className="mt-5 text-[17px] text-text-muted leading-relaxed max-w-[600px] mx-auto">
            See how FulfillMesh helps brands in China streamline logistics, improve delivery performance, and scale with confidence.
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section id="demo-form" className="bg-white scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Form */}
            <BookDemoForm />

            {/* Sidebar */}
            <div className="space-y-6">
              {/* What to expect */}
              <div>
                <h3 className="text-[18px] font-bold text-text-primary mb-4">What to expect in your demo</h3>
                <div className="space-y-5">
                  {expect.map((item) => (
                    <div key={item.title} className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-action-blue" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-text-primary">{item.title}</p>
                        <p className="mt-1 text-[13px] text-text-muted leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* This demo is perfect for */}
              <div className="rounded-xl border border-border-soft p-5 shadow-soft">
                <h3 className="text-[15px] font-bold text-text-primary mb-3">This demo is perfect for</h3>
                <ul className="space-y-2.5">
                  {perfectFor.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[13px] text-text-body">
                      <CheckCircle className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="rounded-xl border border-border-soft p-5 shadow-soft">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-[20px] font-extrabold text-action-blue">{s.value}</p>
                      <p className="mt-1 text-[11px] text-text-muted leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trusted by */}
              <div className="text-center">
                <p className="text-[12px] text-text-muted mb-3">Trusted by 1,000+ brands worldwide</p>
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  {brands.map((b) => (
                    <span key={b} className="text-[13px] font-bold tracking-wide text-text-light">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[28px] font-bold text-text-primary text-center mb-10">What brands say about FulfillMesh</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-border-soft p-6 shadow-soft">
                <Quote className="w-6 h-6 text-border-blue" />
                <p className="mt-3 text-[14px] text-text-body leading-relaxed">{t.quote}</p>
                <div className="mt-5 pt-4 border-t border-border-soft flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border-2 border-border-blue"
                    />
                    <div>
                      <p className="text-[14px] font-bold text-text-primary">{t.name}</p>
                      <p className="text-[12px] text-text-muted">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-bold tracking-wide text-text-light">{t.brand}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="w-6 h-1.5 rounded-full bg-action-blue" />
            <span className="w-1.5 h-1.5 rounded-full bg-border-blue" />
            <span className="w-1.5 h-1.5 rounded-full bg-border-blue" />
          </div>
        </div>
      </section>

      {/* See FulfillMesh in action */}
      <section className="bg-soft-bg py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-action-blue/10 text-action-blue text-[11px] font-bold tracking-wider uppercase mb-4">
                See FulfillMesh in action
              </span>
              <h2 className="text-[32px] font-bold leading-[1.15] text-text-primary">
                Smarter fulfillment, all in one dashboard
              </h2>
              <p className="mt-4 text-[16px] text-text-muted leading-relaxed">
                Get end-to-end visibility across orders, shipments, warehouses, and performance — in real time.
              </p>
              <ul className="mt-6 space-y-3">
                {dashboardBullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-teal" strokeWidth={3} />
                    </span>
                    <span className="text-[14px] text-text-body">{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="mt-7 inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-deep-navy bg-white border border-border-blue rounded-lg hover:bg-soft-bg transition-all"
              >
                See Dashboard Demo
              </Link>
            </div>

            {/* Dashboard mockup */}
            <div className="rounded-2xl border border-border-soft bg-white shadow-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border-soft bg-soft-bg">
                <span className="w-2.5 h-2.5 rounded-full bg-border-blue" />
                <span className="w-2.5 h-2.5 rounded-full bg-border-blue" />
                <span className="w-2.5 h-2.5 rounded-full bg-border-blue" />
                <span className="ml-2 text-[12px] font-semibold text-text-primary">Overview</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {dashboardStats.map((s) => (
                    <div key={s.label} className="rounded-lg border border-border-soft p-3">
                      <p className="text-[11px] text-text-muted">{s.label}</p>
                      <p className="mt-1 text-[18px] font-extrabold text-text-primary">{s.value}</p>
                      <p className="text-[10px] font-semibold text-teal">▲ {s.delta} last 30 days</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg border border-border-soft p-3">
                  <p className="text-[11px] font-semibold text-text-primary mb-2">Orders Over Time</p>
                  <svg viewBox="0 0 260 70" className="w-full h-[70px]">
                    <polyline
                      points="0,55 35,40 70,48 105,28 140,38 175,18 210,30 245,12"
                      fill="none"
                      stroke="#0057D8"
                      strokeWidth="2"
                    />
                    {[[0,55],[35,40],[70,48],[105,28],[140,38],[175,18],[210,30],[245,12]].map(([x,y],i)=>(
                      <circle key={i} cx={x} cy={y} r="2.5" fill="#0057D8" />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="rounded-2xl bg-deep-navy px-6 py-12 text-center">
            <h2 className="text-[30px] font-bold leading-tight text-white">
              Ready to streamline your fulfillment?
            </h2>
            <p className="mt-3 text-[16px] text-text-on-dark-muted">
              Join thousands of brands shipping smarter from China.
            </p>
            <div className="mt-7 flex items-center justify-center">
              <Link
                href="#demo-form"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
              >
                Book Your Demo
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-6">
              {["No pressure, just insights", "Custom to your business", "100% Free"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-[13px] text-text-on-dark-soft">
                  <Check className="w-4 h-4 text-teal" strokeWidth={3} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
