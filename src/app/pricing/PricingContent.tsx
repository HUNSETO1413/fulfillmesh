"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, ChevronDown, ArrowRight,
  ShieldCheck, BadgeCheck, Lock, TrendingUp,
  Users, LayoutDashboard, ClipboardCheck, Truck, Package, BarChart3, Headphones,
  Search, Warehouse,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    subtitle: "Perfect for brands getting started with China fulfillment.",
    annualPrice: "$49",
    monthlyPrice: "$59",
    period: "/month",
    cta: "Get Started",
    href: "/get-started",
    highlighted: false,
    badge: "",
    buttonStyle: "secondary" as const,
    features: [
      "Access to vetted partners",
      "Up to 2 product categories",
      "Basic supplier matching",
      "Standard QC inspections",
      "Shipping rate comparisons",
      "Dashboard & order tracking",
      "Email support",
    ],
  },
  {
    name: "Growth",
    subtitle: "For growing brands managing higher volumes and more partners.",
    annualPrice: "$129",
    monthlyPrice: "$159",
    period: "/month",
    cta: "Get Started",
    href: "/get-started",
    highlighted: true,
    badge: "Most Popular",
    buttonStyle: "primary" as const,
    features: [
      "Everything in Starter, plus:",
      "Up to 10 product categories",
      "Advanced supplier matching",
      "Priority QC inspections",
      "Branded packaging support",
      "Inventory visibility & alerts",
      "Analytics & performance insights",
      "Priority email & chat support",
    ],
  },
  {
    name: "Enterprise",
    subtitle: "For high-volume brands with complex operations and custom needs.",
    annualPrice: "Custom",
    monthlyPrice: "Custom",
    period: "",
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
    badge: "",
    buttonStyle: "secondary" as const,
    features: [
      "Everything in Growth, plus:",
      "Unlimited product categories",
      "Dedicated account manager",
      "Custom QC workflows",
      "Kitting & assembly support",
      "Custom reporting & integrations",
      "SLA-backed support",
      "Volume-based pricing",
    ],
  },
];

const trustBadges = [
  { icon: ShieldCheck, title: "Transparent Pricing", desc: "Know exactly what you pay for." },
  { icon: BadgeCheck, title: "No Hidden Fees", desc: "What you see is what you pay." },
  { icon: Lock, title: "Cancel Anytime", desc: "No long-term commitments." },
  { icon: TrendingUp, title: "Scale with Confidence", desc: "Upgrade or downgrade anytime." },
];

const included = [
  { icon: Users, title: "Partner Matching", desc: "We connect you with vetted fulfillment partners in China that fit your needs." },
  { icon: LayoutDashboard, title: "Real-time Dashboard", desc: "Track orders, shipments, inventory, and performance from one unified dashboard." },
  { icon: ClipboardCheck, title: "QC Workflows", desc: "Standardized quality checks to ensure your products meet standards." },
  { icon: Truck, title: "Shipping Coordination", desc: "Compare rates, book shipments, and track deliveries with ease." },
  { icon: Package, title: "Packaging Support", desc: "Custom packaging, labeling, and kitting to represent your brand." },
  { icon: BarChart3, title: "Analytics & Insights", desc: "Actionable insights to optimize performance and improve decisions." },
  { icon: Headphones, title: "Onboarding & Support", desc: "Guided onboarding and responsive support every step of the way." },
];

const heroNodes = [
  { icon: Search, label: "Supplier Matching" },
  { icon: ShieldCheck, label: "Quality Control" },
  { icon: Truck, label: "Shipping & Logistics" },
  { icon: Warehouse, label: "Overseas Warehousing" },
];

const faqs = [
  { q: "Do you charge setup or onboarding fees?", a: "No. There are no setup or onboarding fees on any plan. You only pay your monthly subscription, and our team helps you get started at no extra cost." },
  { q: "Can I change plans or cancel anytime?", a: "Yes. You can upgrade, downgrade, or cancel at any time with no long-term commitment. Changes take effect at the start of your next billing cycle." },
  { q: "Are there any additional fees?", a: "Your plan covers platform access and support. Fulfillment costs — such as storage, picking, packing, and shipping — are billed transparently based on actual usage with no hidden markups." },
  { q: "Do you offer volume discounts?", a: "Yes. High-volume brands on our Enterprise plan receive volume-based pricing tailored to their order volume and operational needs. Contact our team for a custom quote." },
  { q: "How is billing handled?", a: "Subscriptions are billed annually for the best rate, with monthly options available. Fulfillment usage is invoiced monthly so you always have a clear view of your costs." },
];

export default function PricingContent() {
  const [annual, setAnnual] = useState(true);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-action-blue/10 text-action-blue text-[11px] font-bold tracking-wider uppercase mb-5">
                Pricing
              </span>
              <h1 className="text-[40px] lg:text-[46px] font-bold leading-[1.12] tracking-tight text-text-primary">
                Simple pricing for growing fulfillment{" "}
                <span className="text-teal">operations</span>.
              </h1>
              <p className="mt-5 text-[16px] leading-[1.6] text-text-body max-w-[480px]">
                Flexible plans built to connect you with vetted fulfillment partners in China. Pay only for what you need — with transparent pricing and no hidden fees.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                {["No Setup Fees", "No Hidden Fees", "Cancel Anytime"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-body">
                    <span className="w-4 h-4 rounded-full bg-teal flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — network illustration */}
            <div className="hidden lg:block">
              <div className="relative w-full h-[280px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-action-blue flex items-center justify-center shadow-soft z-10">
                  <span className="text-white font-bold text-lg">FM</span>
                </div>
                {heroNodes.map((node, i) => {
                  const pos = [
                    "top-0 left-8",
                    "top-0 right-8",
                    "bottom-0 left-8",
                    "bottom-0 right-8",
                  ][i];
                  return (
                    <div
                      key={node.label}
                      className={`absolute ${pos} bg-white rounded-xl border border-border-soft px-4 py-3 shadow-soft flex flex-col items-center gap-1.5 w-[140px]`}
                    >
                      <node.icon className="w-5 h-5 text-action-blue" />
                      <span className="text-[11px] font-semibold text-text-primary text-center leading-tight">{node.label}</span>
                    </div>
                  );
                })}
                <svg className="absolute inset-0 w-full h-full pointer-events-none text-border-blue" fill="none" preserveAspectRatio="none" viewBox="0 0 400 280">
                  <line x1="120" y1="40" x2="200" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="290" y1="40" x2="200" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="120" y1="240" x2="200" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="290" y1="240" x2="200" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-12">
          {/* Toggle + all prices note */}
          <div className="relative flex items-center justify-center">
            <div className="inline-flex items-center rounded-xl border border-border-soft bg-white p-1.5 shadow-soft">
              <button
                onClick={() => setAnnual(false)}
                className={`px-6 py-2 text-[14px] font-semibold rounded-lg transition-all leading-tight ${
                  !annual ? "bg-action-blue text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                }`}
              >
                <span className="block">Monthly</span>
                <span className={`block text-[10px] font-normal ${!annual ? "text-white/80" : "text-text-light"}`}>Pay monthly</span>
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-6 py-2 text-[14px] font-semibold rounded-lg transition-all leading-tight ${
                  annual ? "bg-action-blue text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                }`}
              >
                <span className="block">Annual</span>
                <span className={`block text-[10px] font-normal ${annual ? "text-white/80" : "text-text-light"}`}>Save up to 20%</span>
              </button>
            </div>
            <span className="hidden lg:block absolute right-0 text-[12px] text-text-light">All prices in USD</span>
          </div>
          <p className="mt-3 text-center text-[12px] font-medium text-teal h-4 transition-opacity" aria-live="polite">
            {annual ? "You're saving 20% with annual billing." : ""}
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3 items-start">
            {plans.map((plan) => {
              const isCustom = plan.annualPrice === plan.monthlyPrice;
              const price = annual ? plan.annualPrice : plan.monthlyPrice;
              const note = isCustom
                ? "Tailored to your needs"
                : annual
                  ? "Billed annually · save 20%"
                  : "Billed monthly";
              return (
              <div
                key={plan.name}
                className={`relative rounded-2xl bg-white ${
                  plan.highlighted
                    ? "border-2 border-action-blue shadow-[0_12px_32px_rgba(0,87,216,0.16)] lg:-mt-3"
                    : "border border-border-soft shadow-soft"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-px left-0 right-0 bg-action-blue text-white text-[11px] font-bold tracking-wide text-center py-1.5 rounded-t-2xl uppercase">
                    {plan.badge}
                  </div>
                )}

                <div className={`p-7 ${plan.badge ? "pt-12" : ""}`}>
                  <h3 className="text-[20px] font-bold text-text-primary">{plan.name}</h3>
                  <p className="mt-2 text-[13px] text-text-muted leading-relaxed min-h-[36px]">{plan.subtitle}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-[34px] font-extrabold text-text-primary tracking-tight">{price}</span>
                    {plan.period && <span className="text-[14px] text-text-muted">{plan.period}</span>}
                  </div>
                  <p className="mt-1 text-[12px] text-text-light">{note}</p>

                  <Link
                    href={plan.href}
                    className={`mt-5 w-full inline-flex items-center justify-center py-3 rounded-lg text-[14px] font-semibold transition-all ${
                      plan.buttonStyle === "primary"
                        ? "bg-navy text-white hover:bg-deep-navy"
                        : "bg-white border border-border-blue text-deep-navy hover:bg-soft-bg"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f, idx) => (
                      <li key={f} className={`flex items-start gap-2.5 text-[13px] ${idx === 0 ? "font-semibold text-text-primary" : "text-text-body"}`}>
                        <span className="w-4 h-4 rounded-full bg-teal/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-teal" strokeWidth={3} />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="#whats-included" scroll className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-action-blue hover:gap-2.5 transition-all">
                    See all features <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              );
            })}
          </div>

          {/* Trust badges */}
          <div className="mt-10 rounded-2xl border border-border-soft shadow-soft p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustBadges.map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                    <b.icon className="w-4.5 h-4.5 text-teal" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-text-primary">{b.title}</p>
                    <p className="text-[12px] text-text-muted mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section id="whats-included" className="bg-white scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 pb-14">
          <div className="text-center">
            <h2 className="text-[28px] font-bold text-text-primary">What&apos;s included in every plan</h2>
            <p className="mt-2 text-[15px] text-text-muted">Powerful platform access and expert support to help your business grow.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5">
            {included.map((c) => (
              <div key={c.title} className="rounded-xl border border-border-soft p-4 text-center shadow-soft">
                <div className="w-11 h-11 mx-auto rounded-xl bg-action-blue/10 flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-action-blue" />
                </div>
                <p className="mt-3 text-[13px] font-bold text-text-primary leading-tight">{c.title}</p>
                <p className="mt-1.5 text-[11px] text-text-muted leading-snug">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="max-w-[820px] mx-auto px-6 pb-14">
          <h2 className="text-[28px] font-bold text-text-primary text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border-soft overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="text-[14px] font-semibold text-text-primary">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-text-light shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && (
                  <p className="px-5 pb-4 text-[13px] text-text-body leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white pb-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl bg-deep-navy px-6 py-12 text-center">
            <h2 className="text-[28px] font-bold leading-tight text-white">
              Ready to simplify your fulfillment operations?
            </h2>
            <p className="mt-3 text-[15px] text-text-on-dark-muted max-w-[520px] mx-auto">
              Join thousands of brands shipping smarter from China with FulfillMesh.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
              >
                Get Started Today
              </Link>
              <Link
                href="/book-a-demo"
                className="inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold text-white rounded-[10px] border border-white/30 hover:bg-white/10 transition-all"
              >
                Book a Demo
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
              {["Free to get started", "No obligations", "Personalized matches"].map((t) => (
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
