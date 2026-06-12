import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Users, Target, TrendingUp, Heart } from "lucide-react";
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

const values = [
  { icon: Target, title: "Best-Fit Matching", desc: "We help clients find the most suitable fulfillment solution for their product, market, volume, and budget." },
  { icon: ShieldCheck, title: "Verified Network", desc: "Every supplier, fulfillment partner, and service provider in our network must pass our screening process." },
  { icon: TrendingUp, title: "Transparent Performance", desc: "Price, processing time, logistics speed, and service capability — all transparent, data-driven." },
  { icon: Heart, title: "Quality First", desc: "Product quality, packaging experience, and logistics stability directly impact your brand's long-term value." },
  { icon: Globe, title: "China Advantage", desc: "We believe China's supply chain speed, flexibility, and cost efficiency can help global brands scale faster." },
  { icon: Users, title: "Accountable Fulfillment", desc: "Every order, every delay, every quality issue has a cause, an owner, and a solution." },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-16 lg:pt-24 pb-16">
          <div className="max-w-[640px]">
            <h1 className="text-[40px] lg:text-[52px] font-extrabold text-deep-navy leading-[1.05] tracking-tight">
              About FulfillMesh
            </h1>
            <p className="mt-5 text-[16px] text-text-body leading-relaxed">
              FulfillMesh is a China-powered fulfillment matching and management network for global e-commerce brands. We help brands find, compare, and manage the right China fulfillment resources.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[32px] font-bold text-deep-navy leading-tight">Our Mission</h2>
              <p className="mt-4 text-[16px] text-text-body leading-relaxed">
                To help global e-commerce brands find, compare, and manage the right China-powered fulfillment resources with greater transparency, quality, and control.
              </p>
              <h3 className="mt-8 text-[18px] font-bold text-deep-navy">Our Vision</h3>
              <p className="mt-3 text-[15px] text-text-body leading-relaxed">
                To become the trusted fulfillment gateway between global e-commerce brands and China&apos;s best supply chain resources.
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
