import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Handshake, ShieldCheck, BarChart3, Globe, Users, Zap, CheckCircle2,
  TrendingUp, FileText, Sparkles, Rocket,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Partner Programs",
  description:
    "Grow your business with FulfillMesh. Join our ecosystem of technology, logistics, agency, and supplier partners with co-marketing, qualified leads, referral commissions, and dedicated support.",
  path: "/company/partners",
  keywords: [
    "FulfillMesh partners",
    "fulfillment partner program",
    "logistics partnership",
    "technology integration partner",
    "supplier partner program",
  ],
});

const programs = [
  {
    icon: Zap,
    title: "Technology Partners",
    desc: "Integrate FulfillMesh with e-commerce platforms, ERPs, and logistics tools. Build on our API and co-sell to shared customers.",
    benefits: ["API access & sandbox", "Co-marketing opportunities", "Joint customer webinars", "Technical support"],
  },
  {
    icon: Globe,
    title: "Logistics Partners",
    desc: "Join our fulfillment network as a shipping carrier, warehouse operator, or last-mile delivery provider. Grow your volume with qualified brands.",
    benefits: ["Qualified lead pipeline", "Performance dashboard", "Priority matching", "Dedicated partner manager"],
  },
  {
    icon: Users,
    title: "Agency Partners",
    desc: "Help your e-commerce clients scale with FulfillMesh. Earn referral revenue while delivering exceptional fulfillment results.",
    benefits: ["Referral commissions", "Partner certification", "Co-branded proposals", "Training resources"],
  },
  {
    icon: ShieldCheck,
    title: "Supplier Partners",
    desc: "Get access to verified global brands looking for reliable Chinese suppliers. Manage orders, QC, and performance in one platform.",
    benefits: ["Brand discovery", "Order management tools", "QC integration", "Payment protection"],
  },
];

const stats = [
  { value: "200+", label: "Active Partners" },
  { value: "45+", label: "Countries Covered" },
  { value: "98%", label: "Partner Satisfaction" },
  { value: "$50M+", label: "Partner Revenue Generated" },
];

const whyPartner = [
  { icon: TrendingUp, title: "Grow your revenue", desc: "Tap into a steady pipeline of qualified brands and earn recurring referral and revenue-share income." },
  { icon: Handshake, title: "Co-sell & co-market", desc: "Joint campaigns, webinars and case studies that put your business in front of new customers." },
  { icon: BarChart3, title: "Real-time visibility", desc: "A partner dashboard for leads, performance and payouts — fully transparent, no guesswork." },
  { icon: ShieldCheck, title: "Dedicated support", desc: "A partner manager, certification and onboarding resources to help you succeed from day one." },
];

const partnerSteps = [
  { icon: FileText, n: "1", title: "Apply", desc: "Tell us about your business and the program that fits you best." },
  { icon: Sparkles, n: "2", title: "Get onboarded", desc: "We review, approve and set you up with tools, training and your partner manager." },
  { icon: Zap, n: "3", title: "Start collaborating", desc: "Co-sell, integrate or take on matched brands and orders through the platform." },
  { icon: Rocket, n: "4", title: "Grow together", desc: "Track performance, earn payouts and scale your partnership as you deliver results." },
];

export default function PartnersPage() {
  return (
    <>
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="max-w-[640px]">
            <h1 className="text-4xl lg:text-[48px] font-bold text-navy leading-tight">Partner Programs</h1>
            <p className="mt-4 text-lg text-text-body leading-relaxed">
              Grow your business with FulfillMesh. Join our ecosystem of logistics providers, technology companies, agencies, and suppliers.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-border-soft text-center">
                <p className="text-3xl font-bold gradient-text-teal">{stat.value}</p>
                <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why partner */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <h2 className="text-3xl font-bold text-navy">Why partner with FulfillMesh</h2>
            <p className="mt-3 text-text-body">Real value for your business, your clients and the brands we serve together.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPartner.map((w) => (
              <div key={w.title} className="bg-white rounded-xl p-6 border border-border-soft hover:shadow-card transition-all text-center">
                <div className="mx-auto w-11 h-11 rounded-lg bg-teal/10 flex items-center justify-center mb-4">
                  <w.icon className="w-5 h-5 text-teal" />
                </div>
                <h3 className="font-semibold text-text-primary">{w.title}</h3>
                <p className="mt-2 text-sm text-text-body leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Programs */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <h2 className="text-3xl font-bold text-navy">Our Partner Programs</h2>
          <p className="mt-4 text-text-body">Choose the program that fits your business.</p>
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {programs.map((program, i) => (
              <div key={i} className="group bg-white p-6 rounded-xl border border-border-soft hover:shadow-card transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                    <program.icon className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary group-hover:text-navy">{program.title}</h3>
                    <p className="mt-2 text-sm text-text-body leading-relaxed">{program.desc}</p>
                    <ul className="mt-4 space-y-2">
                      {program.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-text-body">
                          <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
                          {benefit}
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

      {/* How partnership works */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <h2 className="text-3xl font-bold text-navy">How partnership works</h2>
            <p className="mt-3 text-text-body">From application to growth in four simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {partnerSteps.map((s) => (
              <div key={s.n} className="text-center px-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-action-blue/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-action-blue" />
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5">
                  <span className="text-[12px] font-bold text-teal">{s.n}</span>
                  <h3 className="text-[15px] font-semibold text-deep-navy">{s.title}</h3>
                </div>
                <p className="mt-1.5 text-[12px] text-text-body leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-dark-hero text-white">
        <div className="max-w-[800px] mx-auto px-6 py-20 lg:py-24 text-center">
          <h2 className="text-3xl font-bold">Interested in partnering?</h2>
          <p className="mt-3 text-text-on-dark-muted">Tell us about your business and how a partnership could create value for both sides.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">
              Become a Partner <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] border border-white/20 hover:bg-white/10 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
