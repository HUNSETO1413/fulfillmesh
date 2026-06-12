import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  TrendingUp,
  DollarSign,
  Truck,
  Search,
  Check,
  ChevronRight,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Case Studies: How E-commerce Brands Scale with FulfillMesh",
  description:
    "Real results from beauty, apparel, electronics, and DTC brands that cut delivery times, lowered logistics costs, and grew revenue with FulfillMesh fulfillment.",
  path: "/resources/case-studies",
  keywords: [
    "fulfillment case studies",
    "e-commerce success stories",
    "China fulfillment results",
    "supply chain ROI",
    "DTC logistics",
  ],
});

const featuredImage =
  "/images/photo-1556228578-8c89e6adf883.jpg";

const filters = ["All Industries", "Beauty", "Apparel", "Electronics", "Home", "DTC", "Enterprise"];

const caseStudies = [
  {
    industry: "Beauty",
    title: "LuxeGlow Scales Globally with FulfillMesh",
    desc: "Streamlined sourcing and logistics helped LuxeGlow expand to 12 countries and delight more customers.",
    image: "/images/photo-1596462502278-27bfdc403348.jpg",
    stats: [
      { value: "37%", label: "Faster Delivery" },
      { value: "22%", label: "Lower Costs" },
      { value: "3.4x", label: "Growth" },
    ],
    color: "from-teal/10 to-navy/5",
  },
  {
    industry: "Apparel",
    title: "Threadline Cuts Lead Times by 40%",
    desc: "Intelligent inventory planning and supplier vetting helped Threadline deliver faster.",
    image: "/images/photo-1489987707025-afc232f7ea0f.jpg",
    stats: [
      { value: "40%", label: "Faster Delivery" },
      { value: "18%", label: "Lower Costs" },
      { value: "2.1x", label: "Growth" },
    ],
    color: "from-action-blue/10 to-teal/5",
  },
  {
    industry: "Electronics",
    title: "SoundWave Improves Delivery Speed by 35%",
    desc: "FulfillMesh helped SoundWave optimize warehousing and last-mile delivery.",
    image: "/images/photo-1505740420928-5e560c06d30e.jpg",
    stats: [
      { value: "35%", label: "Faster Delivery" },
      { value: "20%", label: "Lower Costs" },
      { value: "2.7x", label: "Growth" },
    ],
    color: "from-navy/10 to-action-blue/5",
  },
  {
    industry: "Home",
    title: "CozyHaus Reduces Returns with Better Fulfillment",
    desc: "Accurate inventory and quality checks led to fewer returns and happier customers.",
    image: "/images/photo-1556228453-efd6c1ff04f6.jpg",
    stats: [
      { value: "28%", label: "Faster Delivery" },
      { value: "15%", label: "Lower Costs" },
      { value: "1.8x", label: "Growth" },
    ],
    color: "from-teal/10 to-action-blue/5",
  },
  {
    industry: "DTC",
    title: "Purely You Grows DTC Revenue 3x",
    desc: "End-to-end insights and real-time visibility empowered Purely You to scale profitably.",
    image: "/images/photo-1607082348824-0a96f2a4b9da.jpg",
    stats: [
      { value: "34%", label: "Faster Delivery" },
      { value: "24%", label: "Lower Costs" },
      { value: "3.0x", label: "Growth" },
    ],
    color: "from-action-blue/10 to-navy/5",
  },
  {
    industry: "Beauty & Cosmetics",
    title: "SkinMuse Achieves 99.4% Order Accuracy",
    desc: "Quality control and fulfillment automation drove near-perfect order accuracy.",
    image: "/images/photo-1571781926291-c477ebfd024b.jpg",
    stats: [
      { value: "99.4%", label: "Order Accuracy" },
      { value: "19%", label: "Lower Costs" },
      { value: "2.3x", label: "Growth" },
    ],
    color: "from-navy/10 to-teal/5",
  },
  {
    industry: "Electronics Accessories",
    title: "StrideFast Expands to New Markets",
    desc: "FulfillMesh ensured smooth, scalable fulfillment across 8 new regions with increased conversions.",
    image: "/images/photo-1572569511254-d8f925fe2cbb.jpg",
    stats: [
      { value: "32%", label: "Faster Delivery" },
      { value: "17%", label: "Lower Costs" },
      { value: "2.6x", label: "Growth" },
    ],
    color: "from-teal/10 to-navy/5",
  },
  {
    industry: "Enterprise",
    title: "MegaMart Optimizes Enterprise Operations",
    desc: "FulfillMesh provided scalable fulfillment and improved efficiency across the network.",
    image: "/images/photo-1553413077-190dd305871c.jpg",
    stats: [
      { value: "27%", label: "Faster Delivery" },
      { value: "23%", label: "Lower Costs" },
      { value: "2.2x", label: "Growth" },
    ],
    color: "from-action-blue/10 to-teal/5",
  },
];

const featuredStats = [
  { icon: Truck, value: "37%", label: "Faster Delivery" },
  { icon: DollarSign, value: "22%", label: "Lower Logistics Costs" },
  { icon: TrendingUp, value: "3.4x", label: "Revenue Growth" },
];

// Trusted-by brand lockups: a small inline-SVG mark + wordmark, matching the design's logo strip.
const brandLogos: { name: string; mark: ReactNode }[] = [
  {
    name: "LuxeGlow",
    mark: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 6.5v11M6.5 12h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "ThriveBox",
    mark: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
        <rect x="4" y="6" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 10h16M9 6V4h6v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "CozyHaus",
    mark: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
        <path d="M4 11l8-6 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10v9h12v-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "FreshFold",
    mark: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
        <path d="M5 4h14l-2 7H7L5 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7 11l-1 9h12l-1-9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Fitloop",
    mark: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
        <path d="M5 12a7 7 0 1014 0 7 7 0 00-14 0z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "MegaMart",
    mark: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
        <path d="M4 5h2l2 11h9l2-8H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.5" cy="19" r="1.4" fill="currentColor" />
        <circle cx="16.5" cy="19" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 pt-6 pb-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-navy">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/resources" className="hover:text-navy">Resources</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary font-medium">Case Studies</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-block text-xs font-semibold text-teal bg-teal/8 px-3 py-1.5 rounded-full uppercase tracking-wide mb-5">
                Case Studies
              </p>
              <h1 className="text-4xl lg:text-[52px] font-bold leading-[1.1] text-deep-navy">
                Case studies from brands <br />
                scaling with <span className="text-teal">FulfillMesh</span>
              </h1>
              <p className="mt-5 text-lg text-text-body leading-relaxed max-w-[520px]">
                Real results from e-commerce brands that streamlined operations, reduced costs, and delivered exceptional customer experiences.
              </p>
              <div className="mt-7 flex items-center gap-3 max-w-[520px] px-5 py-4 rounded-full border border-border-soft bg-white shadow-card">
                <Search className="w-5 h-5 text-text-light shrink-0" />
                <input
                  type="text"
                  placeholder="Search case studies by brand, industry or challenge..."
                  className="w-full bg-transparent text-sm text-text-body placeholder:text-text-light focus:outline-none"
                />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {filters.map((f, i) => (
                  <span
                    key={f}
                    className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      i === 0
                        ? "bg-action-blue text-white border-action-blue shadow-button"
                        : "bg-white text-text-body border-border-soft hover:border-action-blue hover:text-action-blue"
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            {/* World map illustration */}
            <div className="relative hidden lg:flex items-center justify-center min-h-[340px]">
              <svg viewBox="0 0 500 340" className="w-full h-full" fill="none">
                {/* orbit rings */}
                <g stroke="#003B7A" strokeWidth="0.8" opacity="0.12">
                  <circle cx="250" cy="170" r="150" />
                  <ellipse cx="250" cy="170" rx="150" ry="70" />
                  <ellipse cx="250" cy="170" rx="95" ry="150" />
                </g>
                {/* connecting lines from hub to nodes */}
                <g stroke="#0057D8" strokeWidth="1" opacity="0.28">
                  <line x1="250" y1="170" x2="90" y2="60" />
                  <line x1="250" y1="170" x2="420" y2="70" />
                  <line x1="250" y1="170" x2="70" y2="190" />
                  <line x1="250" y1="170" x2="440" y2="200" />
                  <line x1="250" y1="170" x2="110" y2="290" />
                  <line x1="250" y1="170" x2="400" y2="300" />
                  <line x1="250" y1="170" x2="250" y2="40" />
                </g>
                {/* outer nodes */}
                <g>
                  <circle cx="90" cy="60" r="6" fill="#00B894" />
                  <circle cx="420" cy="70" r="6" fill="#0057D8" />
                  <circle cx="70" cy="190" r="5" fill="#0057D8" />
                  <circle cx="440" cy="200" r="6" fill="#00B894" />
                  <circle cx="110" cy="290" r="6" fill="#0057D8" />
                  <circle cx="400" cy="300" r="5" fill="#00B894" />
                  <circle cx="250" cy="40" r="5" fill="#0057D8" />
                </g>
              </svg>
              <div className="absolute z-10 w-20 h-20 rounded-full gradient-logo flex items-center justify-center text-white font-bold text-xl shadow-card">
                FM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="bg-soft-bg border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-block text-xs font-semibold text-teal bg-teal/10 px-3 py-1.5 rounded-full uppercase tracking-wide mb-5">
                Featured Case Study
              </p>
              <h2 className="text-3xl lg:text-[34px] font-bold text-deep-navy leading-tight">
                LuxeGlow scaled 3.4x with smarter fulfillment
              </h2>
              <p className="mt-5 text-text-body leading-relaxed">
                Luxury beauty brand LuxeGlow partnered with FulfillMesh to streamline sourcing, optimize inventory, and speed up delivery across key markets.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Link
                  href="/resources/case-studies/luxeglow"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
                >
                  Read the full story <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#all-case-studies" className="inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
                  View all case studies <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr_1fr] gap-5 items-stretch">
              <div className="relative rounded-2xl overflow-hidden min-h-[280px] shadow-card">
                <Image
                  src={featuredImage}
                  alt="LuxeGlow beauty and skincare product arrangement"
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-4">
                {featuredStats.map((s, i) => (
                  <div key={i} className="rounded-xl bg-white border border-border-soft p-4 shadow-soft">
                    <s.icon className="w-5 h-5 text-teal mb-2" />
                    <p className="text-2xl font-bold text-deep-navy leading-none">{s.value}</p>
                    <p className="text-xs text-text-muted mt-1">{s.label}</p>
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-3">
                  <span className="w-8 h-8 rounded-full gradient-logo flex items-center justify-center text-white text-xs font-bold shrink-0">
                    LG
                  </span>
                  <div>
                    <p className="text-sm font-bold text-deep-navy leading-none">LuxeGlow</p>
                    <p className="text-xs text-text-muted mt-1">Beauty &amp; Skincare</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All case studies */}
      <section id="all-case-studies" className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy">All case studies</h2>
            <Link href="/resources/case-studies" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all case studies <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study, i) => (
              <Link
                key={i}
                href="/resources/case-studies/luxeglow"
                className="group rounded-2xl border border-border-soft overflow-hidden hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className={`relative aspect-[16/10] bg-gradient-to-br ${study.color} overflow-hidden`}>
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="self-start text-[11px] font-semibold text-action-blue bg-action-blue/8 px-2.5 py-1 rounded-full mb-3">
                    {study.industry}
                  </span>
                  <h3 className="text-base font-bold text-deep-navy group-hover:text-action-blue leading-snug">{study.title}</h3>
                  <p className="mt-2 text-sm text-text-body leading-relaxed flex-1">{study.desc}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border-soft pt-4">
                    {study.stats.map((s, j) => (
                      <div key={j}>
                        <p className="text-base font-bold text-teal">{s.value}</p>
                        <p className="text-[11px] text-text-muted leading-tight mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Logo strip */}
      <section className="bg-soft-bg border-y border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <p className="text-center text-sm font-medium text-text-muted mb-8">Trusted by leading brands worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brandLogos.map((b) => (
              <span
                key={b.name}
                className="inline-flex items-center gap-2 text-navy/45 hover:text-navy/70 transition-colors"
              >
                {b.mark}
                <span className="text-lg font-bold tracking-tight">{b.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-dark-hero text-white">
        <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">Ready to scale your fulfillment?</h2>
          <p className="mt-3 text-text-on-dark-muted">
            Join thousands of brands shipping smarter from China.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
            >
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] border border-white/20 hover:bg-white/10 transition-all"
            >
              Book a Demo
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-text-on-dark-soft">
            <span className="inline-flex items-center gap-2"><Check className="w-4 h-4 text-teal" /> Free to get started</span>
            <span className="inline-flex items-center gap-2"><Check className="w-4 h-4 text-teal" /> No obligations</span>
            <span className="inline-flex items-center gap-2"><Check className="w-4 h-4 text-teal" /> Personalized matches</span>
          </div>
        </div>
      </section>
    </>
  );
}
