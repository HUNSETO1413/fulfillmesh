"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, ShieldCheck, Package, BadgeCheck, BarChart3, Headphones,
  Percent, RefreshCw, Trophy, ClipboardCheck, Users, Box, DollarSign, ChevronDown,
  Building2, Code2, Network, Boxes,
} from "lucide-react";
import { ShopifyLogo, AmazonLogo, TikTokShopLogo, BigCommerceLogo } from "@/components/PartnerBrandLogos";

/* Page-specific dark world-map network graphic for the co-build-future hero.
   Renders a faint dotted world silhouette on a light/white hero with teal node links.
   Not shared chrome — only used by this page. */
function LightHeroMap() {
  const nodes: [number, number][] = [
    [90, 70],
    [410, 70],
    [90, 290],
    [410, 290],
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 500 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="dhm-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.4" fill="#C9D8EA" />
        </pattern>
        <clipPath id="dhm-world">
          <path d="M40 70 Q70 50 110 60 Q150 70 150 110 Q140 150 100 160 Q70 168 55 140 Q35 110 40 70 Z" />
          <path d="M120 195 Q150 185 160 215 Q165 260 140 300 Q120 320 110 290 Q105 245 120 195 Z" />
          <path d="M225 70 Q260 60 280 78 Q288 100 268 112 Q240 120 225 100 Q218 84 225 70 Z" />
          <path d="M235 130 Q280 122 300 155 Q310 205 280 255 Q255 285 240 250 Q222 195 235 130 Z" />
          <path d="M300 60 Q370 48 430 72 Q470 95 445 135 Q400 165 340 150 Q300 130 300 60 Z" />
          <path d="M405 235 Q445 225 465 255 Q470 285 435 290 Q405 285 405 235 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#dhm-world)">
        <rect x="0" y="0" width="500" height="360" fill="url(#dhm-dots)" />
      </g>

      {nodes.map(([x2, y2], i) => (
        <line
          key={i}
          x1={250}
          y1={180}
          x2={x2}
          y2={y2}
          stroke="#00B894"
          strokeWidth="1.4"
          strokeDasharray="5 5"
          opacity="0.45"
        />
      ))}
      {nodes.map(([cx, cy], i) => (
        <circle key={`n${i}`} cx={cx} cy={cy} r="4" fill="#00B894" opacity="0.75" />
      ))}
    </svg>
  );
}

/* Thin dark divider line between sections */
function SectionDivider() {
  return (
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-border-soft to-transparent" />
    </div>
  );
}

const heroBadges = ["High Commissions", "Trusted by Global Brands", "Dedicated Partner Support"];

const mapCards = [
  { icon: Building2, title: "Agencies", desc: "Deliver more value to your clients", top: "8%", left: "0%" },
  { icon: Code2, title: "Consultants", desc: "Recommend a reliable fulfillment partner", top: "8%", right: "0%" },
  { icon: Network, title: "Ecosystem Partners", desc: "Integrate and grow together", top: "70%", left: "0%" },
  { icon: Boxes, title: "Technology Partners", desc: "Build solutions that power commerce", top: "70%", right: "0%" },
];

const whyCards = [
  { icon: ShieldCheck, title: "Reliable & Scalable", desc: "Leverage a proven network of vetted factories and warehouses across China." },
  { icon: Package, title: "End-to-End Solutions", desc: "From supplier matching to delivery — a complete fulfillment solution." },
  { icon: BadgeCheck, title: "Quality & Compliance", desc: "Rigorous QC and compliance standards to protect your client's brand." },
  { icon: BarChart3, title: "Real-Time Visibility", desc: "Track orders, QC, shipments, and inventory in one dashboard." },
  { icon: Headphones, title: "Dedicated Support", desc: "A dedicated partner success manager to help you win and retain clients." },
];

const rewards = [
  { icon: Percent, value: "Up to 15%", label: "Revenue Share" },
  { icon: RefreshCw, value: "Recurring", label: "Earn on every order" },
  { icon: Trophy, value: "Performance", label: "Bonuses for top partners" },
];

const whoJoins = [
  "Marketing & growth agencies",
  "E-commerce consultants & coaches",
  "Sourcing agents & buying offices",
  "Technology platforms & integrators",
  "Logistics & service providers",
];

const steps = [
  { icon: ClipboardCheck, title: "Apply & Get Approved", desc: "Submit your application and our team will review and activate your partner account." },
  { icon: Users, title: "Refer & Onboard", desc: "Introduce FulfillMesh to your clients. We handle onboarding and fulfillment setup." },
  { icon: Box, title: "Clients Succeed", desc: "Your clients ship faster, save costs, and scale with confidence." },
  { icon: DollarSign, title: "You Earn", desc: "Earn commissions on ongoing orders and unlock features as you grow." },
];

const testimonials = [
  { name: "James Mitchell", role: "Founder, ScalePro Agency", initials: "JM", quote: "FulfillMesh has become the go-to fulfillment partner in China. Our clients love the visibility and reliability — and we love the support and commission structure." },
  { name: "Sophie Nguyen", role: "E-commerce Consultant", initials: "SN", quote: "I recommend FulfillMesh to every client sourcing from China. Their team is responsive, transparent, and the platform is incredibly easy to use." },
  { name: "Daniel Kim", role: "Partner, SupplyLink", initials: "DK", quote: "Great partner program with real value. The recurring commissions and performance bonuses make it a win-win for us and our clients." },
];

const faqs = [
  { q: "How much can I earn as a partner?", a: "Partners can earn up to 15% revenue share on referred orders. Top partners also qualify for performance bonuses and increased commission tiers." },
  { q: "Is there a minimum requirement to join?", a: "No minimum commitment is required. You can start referring clients as soon as your partner account is approved." },
  { q: "Can I integrate with my platform or tool?", a: "Yes. FulfillMesh offers a RESTful API and webhooks so you can embed fulfillment capabilities directly into your own platform or tool." },
  { q: "How are commissions calculated?", a: "Commissions are calculated as a percentage of the fulfillment fees on each order placed by your referred clients. You earn on every recurring order." },
  { q: "Can I refer international clients?", a: "Absolutely. We serve brands worldwide and welcome referrals from any region." },
  { q: "Can I co-market with FulfillMesh?", a: "Yes. We provide co-branded marketing materials, case studies, and joint campaign support to help you and your clients succeed." },
  { q: "When and how are payouts made?", a: "Payouts are made monthly via bank transfer or PayPal, with a detailed breakdown of your earnings." },
  { q: "Do you offer marketing or sales support?", a: "Yes. Partners receive dedicated sales collateral, product demos, and a partner success manager to assist with client conversations." },
  { q: "Who can I contact for support?", a: "Each partner is assigned a dedicated partner success manager. You can also reach our support team via email or the partner portal." },
];

const brands = [ShopifyLogo, AmazonLogo, TikTokShopLogo, BigCommerceLogo];

export default function CoBuildFuturePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      {/* Hero — white background with text left, map right */}
      <section className="bg-white overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.1em] text-teal bg-teal/8 rounded-full px-4 py-1.5 uppercase">
                Partner Program
              </span>
              <h1 className="mt-6 text-[36px] lg:text-[48px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                Grow together.<br /><span className="gradient-text-teal">Win together.</span>
              </h1>
              <p className="mt-5 text-[16px] text-text-body leading-[1.7] max-w-[480px]">
                Power your clients with China&apos;s most reliable fulfillment network and grow your business.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
                {heroBadges.map((b) => (
                  <span key={b} className="inline-flex items-center gap-2 text-[14px] text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal" /> {b}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all">
                  Apply to Partner <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold text-navy rounded-lg border border-border-soft bg-white hover:bg-soft-bg transition-all">
                  Book a Demo
                </Link>
              </div>
            </div>

            {/* Map with partner cards */}
            <div className="relative hidden lg:block h-[360px]">
              <LightHeroMap />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-teal flex items-center justify-center shadow-button ring-8 ring-teal/10">
                <Network className="w-6 h-6 text-white" />
              </div>
              {mapCards.map((c) => (
                <div
                  key={c.title}
                  className="absolute w-[190px] bg-white rounded-xl border border-[#E2E8F0] shadow-soft p-3.5"
                  style={{ top: c.top, left: c.left, right: c.right }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-action-blue/10 flex items-center justify-center">
                      <c.icon className="w-4 h-4 text-action-blue" />
                    </div>
                    <span className="text-[13px] font-bold text-deep-navy">{c.title}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-text-muted leading-tight">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* Why partner — light background */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <h2 className="text-[28px] font-bold text-deep-navy leading-tight">Why partner with FulfillMesh?</h2>
            <p className="mt-4 text-[15px] text-text-body leading-relaxed">
              A trusted fulfillment partner that helps you deliver more value, increase client satisfaction, and grow recurring revenue.
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
            {whyCards.map((c) => (
              <div key={c.title} className="rounded-xl border border-[#E2E8F0] bg-white p-5 text-center hover:shadow-card hover:border-teal/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-action-blue/8 flex items-center justify-center mx-auto mb-3">
                  <c.icon className="w-5 h-5 text-action-blue" />
                </div>
                <h3 className="text-[14px] font-bold text-deep-navy mb-1.5">{c.title}</h3>
                <p className="text-[12px] text-text-body leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* Earn competitive rewards */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="rounded-2xl border border-[#E2E8F0] bg-soft-bg px-8 py-8 flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="lg:w-[38%]">
              <h2 className="text-[24px] font-bold text-deep-navy">Earn competitive rewards</h2>
              <p className="mt-2.5 text-[14px] text-text-body leading-relaxed">
                Attractive commissions for quality referrals and long-term client success.
              </p>
            </div>
            <div className="flex-1 grid sm:grid-cols-3 gap-6">
              {rewards.map((r) => (
                <div key={r.label} className="flex items-center gap-3.5 bg-white rounded-xl border border-[#E2E8F0] p-4">
                  <div className="w-10 h-10 rounded-full bg-action-blue/8 flex items-center justify-center shrink-0">
                    <r.icon className="w-5 h-5 text-action-blue" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-deep-navy">{r.value}</p>
                    <p className="text-[12px] text-text-muted">{r.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* Who should join + How the program works */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-14">
          <div>
            <h2 className="text-[24px] font-bold text-deep-navy mb-6">Who should join?</h2>
            <ul className="space-y-3.5">
              {whoJoins.map((w) => (
                <li key={w} className="flex items-center gap-3 text-[14px] text-text-body">
                  <CheckCircle2 className="w-5 h-5 text-teal shrink-0" /> {w}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-[#E2E8F0] bg-white p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-action-blue/8 flex items-center justify-center shrink-0">
                <Network className="w-5 h-5 text-action-blue" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-deep-navy">Already have clients in China?</p>
                <p className="text-[13px] text-text-body mt-1 leading-relaxed">Let&apos;s build fulfillment into your service offering — and your strategy and growth.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[24px] font-bold text-deep-navy mb-8 text-center lg:text-left">How the program works</h2>
            <div className="relative">
              {/* vertical timeline connector behind the numbered nodes */}
              <div className="absolute left-[17px] top-5 bottom-5 w-px bg-border-soft" aria-hidden="true" />
              <div className="space-y-5">
                {steps.map((s, i) => (
                  <div key={s.title} className="relative flex items-start gap-4">
                    <div className="relative z-10 shrink-0 ring-4 ring-soft-bg rounded-full">
                      <div className="w-9 h-9 rounded-full bg-action-blue text-white text-[13px] font-bold flex items-center justify-center">{i + 1}</div>
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex-1 flex items-start gap-3">
                      <s.icon className="w-5 h-5 text-action-blue shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-[14px] font-bold text-deep-navy">{s.title}</h3>
                        <p className="text-[13px] text-text-body leading-relaxed mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* Trusted by partners worldwide */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <h2 className="text-[28px] font-bold text-deep-navy text-center mb-12">Trusted by partners worldwide</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl bg-white border border-[#E2E8F0] p-5">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-full bg-action-blue/8 flex items-center justify-center">
                    <span className="text-[12px] font-bold text-action-blue">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-deep-navy">{t.name}</p>
                    <p className="text-[12px] text-text-muted">{t.role}</p>
                  </div>
                </div>
                <p className="text-[13px] text-text-body leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
            <div className="rounded-xl gradient-soft-card border border-[#E2E8F0] p-5 flex flex-col justify-center">
              <p className="text-[28px] font-extrabold text-teal leading-none">1,200+</p>
              <p className="text-[13px] text-text-muted mb-4 mt-1">Active Partners</p>
              <div className="grid grid-cols-2 gap-2.5">
                {brands.map((Logo, i) => (
                  <span key={i} className="flex items-center justify-center bg-white border border-[#E2E8F0] rounded-lg px-3 py-2">
                    <Logo className="h-4 w-auto" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* FAQ */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <h2 className="text-[28px] font-bold text-deep-navy text-center mb-10">Frequently asked questions</h2>
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between gap-3 text-left w-full px-5 py-4 hover:border-action-blue/40 transition-all"
                >
                  <span className="text-[14px] font-medium text-deep-navy">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 -mt-1">
                    <p className="text-[13px] text-text-body leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark background, only section with dark bg */}
      <section className="pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14">
            <h2 className="text-[28px] font-bold leading-tight">Ready to grow your business with FulfillMesh?</h2>
            <p className="mt-3 text-[15px] text-text-on-dark-muted">Join thousands of partners helping brands ship smarter from China.</p>
            <div className="mt-8 flex justify-center">
              <Link href="/get-started" className="inline-flex items-center gap-2 px-8 py-4 text-[14px] font-bold text-white rounded-lg gradient-cta shadow-button hover:brightness-105 transition-all">
                Apply to Partner <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["Free to join", "No obligations", "Dedicated partner support"].map((t) => (
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
