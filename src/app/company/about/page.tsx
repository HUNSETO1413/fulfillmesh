import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Globe, ShieldCheck, Users, Target, TrendingUp, Heart,
  Search, PackageCheck, Warehouse, BarChart3,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About FulfillMesh",
  description:
    "FulfillMesh is a China-powered fulfillment matching and management network for global e-commerce brands. Learn about our mission to help brands find, compare, and manage the right China fulfillment resources.",
  path: "/company/about",
  keywords: [
    "about FulfillMesh",
    "China fulfillment network",
    "e-commerce fulfillment company",
    "supply chain matching",
    "fulfillment management platform",
  ],
});

const stats = [
  { v: "1,200+", l: "Vetted Partners" },
  { v: "25K+", l: "Shipments Managed" },
  { v: "150+", l: "Countries Served" },
  { v: "98%", l: "On-Time Delivery" },
];

const pillars = [
  { icon: Search, title: "Match", desc: "We connect you with vetted suppliers and fulfillment partners tailored to your product, market and volume." },
  { icon: PackageCheck, title: "Verify", desc: "On-site quality control, packaging and labeling — checked before your goods ever ship." },
  { icon: Warehouse, title: "Fulfill", desc: "Optimized shipping routes and overseas warehousing that put inventory closer to your customers." },
  { icon: BarChart3, title: "Optimize", desc: "Real-time visibility and analytics across every order, inspection and shipment in one dashboard." },
];

const values = [
  { icon: Target, title: "Best-Fit Matching", desc: "We help clients find the most suitable fulfillment solution for their product, market, volume, and budget." },
  { icon: ShieldCheck, title: "Verified Network", desc: "Every supplier, fulfillment partner, and service provider in our network must pass our screening process." },
  { icon: TrendingUp, title: "Transparent Performance", desc: "Price, processing time, logistics speed, and service capability — all transparent, data-driven." },
  { icon: Heart, title: "Quality First", desc: "Product quality, packaging experience, and logistics stability directly impact your brand's long-term value." },
  { icon: Globe, title: "China Advantage", desc: "We believe China's supply chain speed, flexibility, and cost efficiency can help global brands scale faster." },
  { icon: Users, title: "Accountable Fulfillment", desc: "Every order, every delay, every quality issue has a cause, an owner, and a solution." },
];

const leaders = [
  { initials: "DL", name: "David Lin", role: "Co-Founder & CEO", bio: "15+ years in cross-border supply chain and e-commerce operations." },
  { initials: "SC", name: "Sarah Chen", role: "Co-Founder & COO", bio: "Former head of fulfillment at a top global DTC brand." },
  { initials: "MR", name: "Marcus Rivera", role: "VP of Partnerships", bio: "Built supplier networks across Shenzhen, Yiwu and Guangzhou." },
  { initials: "AK", name: "Aisha Khan", role: "VP of Product", bio: "Leads the platform and analytics experience end to end." },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-16 lg:pt-24 pb-16">
          <div className="max-w-[640px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/10 text-teal text-[12px] font-semibold uppercase tracking-wide">
              Our Company
            </span>
            <h1 className="mt-4 text-[40px] lg:text-[52px] font-extrabold text-deep-navy leading-[1.05] tracking-tight">
              About FulfillMesh
            </h1>
            <p className="mt-5 text-[16px] text-text-body leading-relaxed">
              FulfillMesh is a China-powered fulfillment matching and management network for global
              e-commerce brands. We help brands find, compare, and manage the right China fulfillment
              resources — from suppliers and quality control to packaging, shipping routes and overseas warehousing.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-[30px] font-bold text-navy leading-none">{s.v}</p>
                <p className="mt-2 text-[13px] text-text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[32px] font-bold text-deep-navy leading-tight">Our Story</h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed">
                FulfillMesh started with a simple frustration: sourcing and fulfilling from China was
                powerful but opaque. Brands juggled dozens of suppliers, freight forwarders and QC
                agents — with no single source of truth and no accountability when things went wrong.
              </p>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed">
                So we built a network that does the matching, vetting and management for you. Today
                FulfillMesh connects thousands of brands to verified partners and gives them one
                dashboard to run the whole operation — with the transparency and control they never had before.
              </p>
            </div>
            <div className="bg-soft-bg rounded-2xl p-8 border border-border-soft text-center">
              <p className="text-3xl font-bold gradient-text-teal">Match better.</p>
              <p className="text-3xl font-bold gradient-text-teal mt-2">Fulfill smarter.</p>
              <p className="text-3xl font-bold gradient-text-teal mt-2">Improve every node.</p>
              <p className="mt-4 text-[13px] text-text-muted">— Our Core Principle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-border-soft p-8">
              <h2 className="text-[24px] font-bold text-deep-navy leading-tight">Our Mission</h2>
              <p className="mt-3 text-[15px] text-text-body leading-relaxed">
                To help global e-commerce brands find, compare, and manage the right China-powered
                fulfillment resources with greater transparency, quality, and control.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-border-soft p-8">
              <h2 className="text-[24px] font-bold text-deep-navy leading-tight">Our Vision</h2>
              <p className="mt-3 text-[15px] text-text-body leading-relaxed">
                To become the trusted fulfillment gateway between global e-commerce brands and
                China&apos;s best supply chain resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <h2 className="text-[32px] font-bold text-deep-navy leading-tight">What we do</h2>
            <p className="mt-3 text-[15px] text-text-body leading-relaxed">
              One connected network across the four pillars of cross-border fulfillment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <div key={p.title} className="relative rounded-xl border border-border-soft bg-white p-6">
                <div className="w-11 h-11 rounded-lg bg-action-blue/10 flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-action-blue" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-teal">0{i + 1}</span>
                  <h3 className="text-[15px] font-bold text-deep-navy">{p.title}</h3>
                </div>
                <p className="mt-2 text-[13px] text-text-body leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <h2 className="text-[32px] font-bold text-deep-navy leading-tight">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border-soft bg-white p-6 hover:shadow-card hover:border-teal/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-[15px] font-bold text-deep-navy mb-2">{v.title}</h3>
                <p className="text-[13px] text-text-body leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <h2 className="text-[32px] font-bold text-deep-navy leading-tight">Leadership</h2>
            <p className="mt-3 text-[15px] text-text-body leading-relaxed">
              The team building the trusted bridge between global brands and China fulfillment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((l) => (
              <div key={l.name} className="rounded-xl border border-border-soft bg-white p-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-navy/10 text-navy text-[18px] font-bold flex items-center justify-center">
                  {l.initials}
                </div>
                <h3 className="mt-4 text-[15px] font-bold text-deep-navy">{l.name}</h3>
                <p className="text-[12px] font-medium text-teal">{l.role}</p>
                <p className="mt-2 text-[12px] text-text-body leading-relaxed">{l.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-dark-hero text-white">
        <div className="max-w-[800px] mx-auto px-6 py-20 text-center">
          <h2 className="text-[28px] font-bold">Want to join our journey?</h2>
          <p className="mt-3 text-text-on-dark-muted">Whether as a brand, partner, or team member — we&apos;d love to connect.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] border border-white/20 hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
