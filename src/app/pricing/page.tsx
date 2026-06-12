"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, ChevronDown,
  Warehouse, BarChart3, ClipboardList, Truck, Package, RotateCcw, PieChart,
} from "lucide-react";

const plansMonthly = [
  {
    name: "Starter",
    subtitle: "Perfect for small businesses",
    price: "$49",
    period: "/month",
    cta: "Get Started",
    href: "/get-started",
    highlighted: false,
    badge: "",
    buttonStyle: "secondary" as const,
    features: [
      "Up to 500 orders/month",
      "Basic inventory management",
      "Standard shipping integration",
      "24/7 chat support",
    ],
  },
  {
    name: "Growth",
    subtitle: "Ideal for growing businesses",
    price: "$129",
    period: "/month",
    cta: "Get Started",
    href: "/get-started",
    highlighted: true,
    badge: "Most Popular",
    buttonStyle: "primary" as const,
    features: [
      "Up to 5,000 orders/month",
      "Advanced inventory management",
      "Multi-carrier shipping",
      "Dedicated account manager",
    ],
  },
  {
    name: "Enterprise",
    subtitle: "Everything for enterprise needs",
    price: "$299",
    period: "/month",
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
    badge: "",
    buttonStyle: "secondary" as const,
    features: [
      "Unlimited orders/month",
      "Real-time inventory sync",
      "Custom integrations",
      "24/7 phone support",
    ],
  },
];

const plansAnnual = [
  {
    name: "Starter",
    subtitle: "Perfect for small businesses",
    price: "$490",
    period: "/year",
    cta: "Get Started",
    href: "/get-started",
    highlighted: false,
    badge: "",
    buttonStyle: "secondary" as const,
    features: [
      "Up to 500 orders/month",
      "Basic inventory management",
      "Standard shipping integration",
      "24/7 chat support",
    ],
  },
  {
    name: "Growth",
    subtitle: "Ideal for growing businesses",
    price: "$1,290",
    period: "/year",
    cta: "Get Started",
    href: "/get-started",
    highlighted: true,
    badge: "Most Popular",
    buttonStyle: "primary" as const,
    features: [
      "Up to 5,000 orders/month",
      "Advanced inventory management",
      "Multi-carrier shipping",
      "Dedicated account manager",
    ],
  },
  {
    name: "Enterprise",
    subtitle: "Everything for enterprise needs",
    price: "$2,990",
    period: "/year",
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
    badge: "",
    buttonStyle: "secondary" as const,
    features: [
      "Unlimited orders/month",
      "Real-time inventory sync",
      "Custom integrations",
      "24/7 phone support",
    ],
  },
];

const included = [
  { icon: Warehouse, title: "Warehouse Management" },
  { icon: BarChart3, title: "Real-time Inventory Sync" },
  { icon: ClipboardList, title: "Order Processing" },
  { icon: Truck, title: "Shipping Integration" },
  { icon: Package, title: "Packaging Solutions" },
  { icon: RotateCcw, title: "Returns & Exchanges" },
  { icon: PieChart, title: "Reporting & Analytics" },
];

const faqs = [
  { q: "Do you charge per order or per month?", a: "We offer both monthly and per-order pricing. Starter and Growth plans are monthly, while Enterprise is custom." },
  { q: "Can I upgrade or downgrade my plan?", a: "Yes! You can upgrade/downgrade at any time. Changes take effect at the start of your next billing cycle." },
  { q: "Do you offer a free trial?", a: "Yes! Start with a 14-day free trial on any plan. No credit card required." },
  { q: "What integrations do you support?", a: "We integrate with Shopify, WooCommerce, Amazon, and 100+ other platforms." },
  { q: "How do you handle returns?", a: "Returns are processed through our dashboard. We handle labeling, tracking, and restocking." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const plans = annual ? plansAnnual : plansMonthly;

  return (
    <main>
      {/* Hero — compact */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-[32px] font-bold leading-[1.25] tracking-tight text-text-primary">
                Simple pricing for growing fulfillment operations your business.
              </h1>
              <p className="mt-3 text-[16px] leading-[1.6] text-text-body">
                Get transparent pricing for your fulfillment needs. No hidden fees, no surprises—just clear, scalable plans to grow with your business.
              </p>
            </div>

            {/* Right — network illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-[320px] h-[240px]">
                {/* Center node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-xl bg-action-blue flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-lg">FM</span>
                </div>
                {/* Top */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white rounded-lg border border-border-soft px-4 py-2 text-[12px] font-semibold text-text-primary shadow-soft">
                  Warehouse Management
                </div>
                {/* Right */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-lg border border-border-soft px-4 py-2 text-[12px] font-semibold text-text-primary shadow-soft">
                  Order Processing
                </div>
                {/* Bottom */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-lg border border-border-soft px-4 py-2 text-[12px] font-semibold text-text-primary shadow-soft">
                  Inventory Sync
                </div>
                {/* Left */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-lg border border-border-soft px-4 py-2 text-[12px] font-semibold text-text-primary shadow-soft">
                  Shipping Integration
                </div>
                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none text-border-soft" viewBox="0 0 320 240" fill="none">
                  <line x1="160" y1="38" x2="160" y2="104" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="252" y1="120" x2="200" y2="120" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="160" y1="202" x2="160" y2="136" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="68" y1="120" x2="120" y2="120" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards — compact */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-12">
          <h2 className="text-[24px] font-semibold text-text-primary text-center">
            Choose the plan that fits your needs
          </h2>

          {/* Monthly / Annual Toggle */}
          <div className="mt-6 flex items-center justify-center">
            <div className="inline-flex items-center rounded-[10px] border border-border-soft bg-white p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 text-[13px] font-semibold rounded-[8px] transition-all ${
                  !annual
                    ? "bg-action-blue text-white shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 text-[13px] font-semibold rounded-[8px] transition-all ${
                  annual
                    ? "bg-action-blue text-white shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl bg-white transition-all ${
                  plan.highlighted
                    ? "border-2 border-action-blue shadow-[0_8px_24px_rgba(0,87,216,0.15)]"
                    : "border border-border-soft shadow-soft"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-3 right-3 bg-action-blue text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-[6px]">
                    {plan.badge}
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-[18px] font-bold text-text-primary">{plan.name}</h3>
                  <p className="mt-1 text-[13px] text-text-body">{plan.subtitle}</p>

                  {annual && (
                    <div className="mt-2 inline-block bg-teal/10 text-teal text-[12px] font-semibold px-2.5 py-0.5 rounded-[6px]">
                      Save 17%
                    </div>
                  )}

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-[32px] font-extrabold text-text-primary tracking-tight">{plan.price}</span>
                    {plan.period && (
                      <span className="text-[13px] text-text-muted">{plan.period}</span>
                    )}
                  </div>

                  <Link
                    href={plan.href}
                    className={`mt-5 w-full inline-flex items-center justify-center py-2.5 rounded-lg text-[14px] font-semibold transition-all ${
                      plan.buttonStyle === "primary"
                        ? "bg-action-blue text-white hover:bg-action-blue/90"
                        : "bg-soft-bg text-text-primary hover:bg-border-soft"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Divider */}
                  <div className="mt-5 pt-5 border-t border-border-soft">
                    <p className="text-[12px] font-semibold text-text-primary mb-3">What&apos;s included:</p>
                    <ul className="space-y-2.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[13px] text-text-body">
                          <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included — compact */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <h2 className="text-[24px] font-semibold text-text-primary text-center">What&apos;s included in every plan</h2>
          <div className="mt-8 grid grid-cols-4 lg:grid-cols-7 gap-6">
            {included.map((c) => (
              <div key={c.title} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-white flex items-center justify-center shadow-soft border border-border-soft">
                  <c.icon className="w-5 h-5 text-action-blue" />
                </div>
                <p className="mt-2.5 text-[12px] font-semibold text-text-primary">{c.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — compact */}
      <section className="bg-white">
        <div className="max-w-[720px] mx-auto px-6 py-10">
          <h2 className="text-[24px] font-semibold text-text-primary text-center">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border-soft overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-3.5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="text-[14px] font-semibold text-text-primary">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-text-light shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && (
                  <p className="px-5 pb-3.5 text-[13px] text-text-muted leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — compact */}
      <section className="bg-deep-navy">
        <div className="max-w-[700px] mx-auto px-6 py-14 text-center">
          <h2 className="text-[28px] font-bold leading-tight text-white">
            Ready to simplify your fulfillment operations?
          </h2>
          <p className="mt-3 text-[15px] text-text-on-dark-muted">
            Start your journey with FulfillMesh today.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold bg-white text-navy rounded-[10px] hover:shadow-soft transition-all"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
