import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  TrendingUp,
  FileText,
  HelpCircle,
  Code2,
  Truck,
  ClipboardList,
  ArrowRight,
  Search,
  DollarSign,
  Mail,
  Check,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fulfillment Resources: Guides, Case Studies & Tools",
  description:
    "Expert guides, real customer case studies, and practical tools to help e-commerce brands streamline sourcing, quality control, and shipping from China.",
  path: "/resources",
  keywords: [
    "fulfillment resources",
    "China sourcing guides",
    "e-commerce logistics",
    "supply chain tools",
    "shipping insights",
  ],
});

const topics = [
  { icon: BookOpen, title: "Guides", desc: "Step-by-step guides to optimize every part of your supply chain.", cta: "Browse guides", href: "/resources/guides" },
  { icon: TrendingUp, title: "Case Studies", desc: "Real customer stories and proven fulfillment strategies.", cta: "View case studies", href: "/resources/case-studies" },
  { icon: FileText, title: "Blog", desc: "Latest insights on logistics, e-commerce, and growth in China.", cta: "Read blog", href: "/resources" },
  { icon: HelpCircle, title: "Help Center", desc: "Answers to common questions and how-to articles.", cta: "Visit help center", href: "/resources/help-center" },
  { icon: Code2, title: "API Documentation", desc: "Integrate FulfillMesh with your systems seamlessly.", cta: "View docs", href: "/resources/api-documentation" },
  { icon: Truck, title: "Shipping Insights", desc: "Track transit times and freight updates with confidence.", cta: "View insights", href: "/resources/shipping-insights" },
  { icon: ClipboardList, title: "Supplier Playbooks", desc: "Best practices for sourcing and quality management.", cta: "View playbooks", href: "/resources/supplier-playbooks" },
];

const popularTags = ["Supplier Vetting", "Shipping Routes", "Customs & Compliance", "Demand Planning"];

const featuredStats = [
  { icon: Truck, value: "37%", label: "Faster Delivery" },
  { icon: DollarSign, value: "22%", label: "Lower Logistics Costs" },
  { icon: TrendingUp, value: "3.4x", label: "Revenue Growth" },
];

const featuredCaseImage =
  "/images/photo-1596462502278-27bfdc403348.jpg";

const latestResources = [
  { category: "Shipping Insights", title: "China–US Shipping Update: Rates, Capacity & Trends", desc: "Key updates on shipping rates, capacity constraints, and what to expect in Q2 2025.", date: "May 12, 2025", read: "6 min read", href: "/resources/shipping-insights", image: "/images/photo-1494412574643-ff11b0a5c1c3.jpg" },
  { category: "Guide", title: "The Ultimate Supplier Vetting Checklist", desc: "A step-by-step checklist to help you evaluate Chinese suppliers with confidence.", date: "May 8, 2025", read: "7 min read", href: "/resources/guides", image: "/images/photo-1450101499163-c8848c66ca85.jpg" },
  { category: "Case Study", title: "How Peak Supplies Cut Lead Time by 40%", desc: "See how Peak Supplies optimized inventory planning and shipping routes to scale faster.", date: "May 5, 2025", read: "5 min read", href: "/resources/case-studies", image: "/images/photo-1553413077-190dd305871c.jpg" },
  { category: "Blog", title: "Sustainable Fulfillment: What It Means in 2025", desc: "Practical ways e-commerce brands can reduce emissions and build resilient supply chains.", date: "Apr 30, 2025", read: "4 min read", href: "/resources", image: "/images/photo-1542601906990-b4d3fb778b09.jpg" },
];

const downloads = [
  "Supplier Evaluation Checklist",
  "Shipping Cost Calculator",
  "Incoterms Cheat Sheet",
  "Inventory Reorder Template",
];

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block text-xs font-semibold text-white bg-action-blue px-3 py-1.5 rounded-lg uppercase tracking-wide mb-5">
              Resource Hub
            </p>
            <h1 className="text-[40px] lg:text-[52px] font-bold leading-[1.1] tracking-tight text-deep-navy">
              Resources to help{" "}
              <span className="text-teal">you scale smarter</span>
            </h1>
            <p className="mt-5 text-[18px] text-text-body leading-relaxed max-w-[520px]">
              Expert guides, real stories, and practical tools to help you streamline fulfillment in China and grow your business globally.
            </p>
            {/* Search */}
            <div className="mt-7 flex items-center gap-3 max-w-[520px] px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <Search className="w-5 h-5 text-text-light shrink-0" />
              <input
                type="text"
                placeholder="Search resources, topics or keywords..."
                className="w-full bg-transparent text-sm text-text-body placeholder:text-[#9CA3AF] focus:outline-none"
              />
            </div>
            {/* Popular tags */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">Popular:</span>
              {popularTags.map((tag) => (
                <span key={tag} className="text-sm font-medium text-[#4B5563] bg-[#F3F4F6] border border-[#D1D5DB] px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* World network illustration */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[320px]">
            <svg viewBox="0 0 500 320" className="w-full h-full">
              {/* faint globe wireframe */}
              <g fill="none" stroke="#003B7A" strokeWidth="0.6" opacity="0.12">
                <circle cx="250" cy="160" r="135" />
                <ellipse cx="250" cy="160" rx="135" ry="58" />
                <ellipse cx="250" cy="160" rx="88" ry="135" />
                <ellipse cx="250" cy="160" rx="42" ry="135" />
                <line x1="115" y1="160" x2="385" y2="160" />
              </g>
              {/* connecting edges radiating from the FM hub */}
              <g fill="none" stroke="#0057D8" strokeWidth="1.3" opacity="0.45">
                <line x1="250" y1="160" x2="95" y2="55" />
                <line x1="250" y1="160" x2="415" y2="75" />
                <line x1="250" y1="160" x2="70" y2="250" />
                <line x1="250" y1="160" x2="410" y2="240" />
                <line x1="250" y1="160" x2="460" y2="150" />
                <line x1="250" y1="160" x2="150" y2="40" />
                <line x1="250" y1="160" x2="335" y2="285" />
                <line x1="250" y1="160" x2="40" y2="150" />
              </g>
              {/* secondary edges linking outer nodes */}
              <g fill="none" stroke="#00B894" strokeWidth="1" strokeDasharray="3 5" opacity="0.4">
                <line x1="95" y1="55" x2="150" y2="40" />
                <line x1="415" y1="75" x2="460" y2="150" />
                <line x1="70" y1="250" x2="40" y2="150" />
                <line x1="410" y1="240" x2="335" y2="285" />
                <line x1="460" y1="150" x2="410" y2="240" />
                <line x1="40" y1="150" x2="70" y2="250" />
              </g>
              {/* node dots */}
              {[
                { x: 95, y: 55, c: "#00B894", r: 5 },
                { x: 415, y: 75, c: "#0057D8", r: 5 },
                { x: 70, y: 250, c: "#0057D8", r: 5 },
                { x: 410, y: 240, c: "#00B894", r: 5 },
                { x: 460, y: 150, c: "#00B894", r: 5 },
                { x: 150, y: 40, c: "#0057D8", r: 4 },
                { x: 335, y: 285, c: "#0057D8", r: 4 },
                { x: 40, y: 150, c: "#00B894", r: 4 },
              ].map((d, i) => (
                <g key={i}>
                  <circle cx={d.x} cy={d.y} r={d.r + 4} fill={d.c} opacity="0.15" />
                  <circle cx={d.x} cy={d.y} r={d.r} fill={d.c} />
                </g>
              ))}
            </svg>
            <div className="absolute z-10 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-card" style={{ background: "#0A2A52" }}>
              FM
            </div>
          </div>
        </div>
      </section>

      {/* Explore by topic */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[32px] font-bold text-deep-navy">Explore by topic</h2>
            <Link href="/resources" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all topics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {topics.map((t, i) => (
              <Link
                key={i}
                href={t.href}
                className="group flex flex-col items-center p-5 rounded-2xl border border-[#E5E7EB] hover:bg-[#EBF5FF] hover:border-transparent transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#EBF5FF] group-hover:bg-action-blue flex items-center justify-center mb-4 transition-colors duration-300">
                  <t.icon className="w-5 h-5 text-action-blue group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-[14px] font-semibold text-deep-navy mb-2">{t.title}</h3>
                <p className="text-[12px] text-text-body leading-relaxed flex-1">{t.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-action-blue">
                  {t.cta} <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image + Stats */}
            <div className="grid grid-cols-[1.4fr_1fr] gap-5 items-stretch">
              <div className="relative rounded-lg overflow-hidden min-h-[260px]">
                <Image
                  src={featuredCaseImage}
                  alt="LuxeGlow beauty products on a retail shelf"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-4">
                {featuredStats.map((s, i) => (
                  <div key={i} className="rounded-lg bg-white border border-[#E5E7EB] p-4">
                    <s.icon className="w-5 h-5 text-action-blue mb-2" />
                    <p className="text-2xl font-bold text-action-blue">{s.value}</p>
                    <p className="text-[12px] text-text-muted mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Content */}
            <div>
              <p className="inline-block text-[12px] font-semibold text-white bg-action-blue px-3 py-1.5 rounded-lg uppercase tracking-wide mb-5">
                Case Study
              </p>
              <h2 className="text-[28px] font-bold text-deep-navy leading-tight">
                From 3PL headaches to global scale: How LuxeGlow grew 3.4x with FulfillMesh
              </h2>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed">
                LuxeGlow, a fast-growing beauty brand, streamlined sourcing, quality control, and global shipping with FulfillMesh—cutting delivery times by 37% and saving over 22% on logistics costs.
              </p>
              <Link
                href="/resources/case-studies"
                className="mt-7 inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-action-blue rounded-lg hover:bg-[#0046B8] transition-colors"
              >
                Read Case Study <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest resources */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[32px] font-bold text-deep-navy">Latest resources</h2>
            <Link href="/resources/guides" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestResources.map((res, i) => (
              <Link
                key={i}
                href={res.href}
                className="group rounded-xl border border-[#E5E7EB] overflow-hidden bg-white hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={res.image}
                    alt={res.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="self-start text-[10px] font-bold tracking-[0.06em] text-white bg-action-blue rounded px-2 py-0.5 uppercase">
                    {res.category}
                  </span>
                  <h3 className="mt-3 text-[15px] font-bold text-deep-navy leading-snug group-hover:text-action-blue transition-colors">
                    {res.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-text-body leading-relaxed flex-1">{res.desc}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-[#9CA3AF]">
                    <span>{res.date}</span>
                    <span>{res.read}</span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-action-blue">
                    Read More <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Newsletter */}
      <section className="bg-[#F8F9FA]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Tools & templates */}
            <div className="rounded-xl bg-white border border-[#E5E7EB] p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-action-blue" />
                </div>
                <div>
                  <h3 className="text-[24px] font-bold text-deep-navy">Tools &amp; templates</h3>
                  <p className="mt-2 text-[16px] text-text-body leading-relaxed">Download ready-to-use resources to streamline your operations.</p>
                </div>
              </div>
              <ul className="mt-6 space-y-0">
                {downloads.map((d) => (
                  <li key={d} className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-b-0">
                    <span className="text-[16px] font-medium text-deep-navy">{d}</span>
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                  </li>
                ))}
              </ul>
              <Link href="/resources" className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-action-blue underline underline-offset-2 hover:text-[#0046B8]">
                View all downloads <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {/* Newsletter */}
            <div
              className="rounded-xl text-white p-8"
              style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[24px] font-bold text-white">Stay ahead with FulfillMesh</h3>
                  <p className="mt-2 text-[16px] text-white/90 leading-relaxed">Get the latest insights, shipping updates, and expert tips delivered to your inbox.</p>
                </div>
              </div>
              <div className="mt-6 flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-l-lg border border-white/30 bg-white/20 px-4 py-3 text-[14px] text-white placeholder:text-white/70 focus:outline-none focus:border-white"
                />
                <button className="px-6 py-3 text-[14px] font-semibold bg-deep-navy text-white rounded-r-lg hover:bg-[#0D2847] transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="mt-4 text-[12px] text-white/80">We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-dark-hero text-white">
        <div className="max-w-[700px] mx-auto px-6 py-24 text-center">
          <h2 className="text-[36px] font-bold leading-tight text-white">Ready to scale your fulfillment?</h2>
          <p className="mt-4 text-[17px] text-text-on-dark-muted">
            Join thousands of brands shipping smarter from China.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold bg-white text-navy rounded-lg hover:shadow-soft transition-all"
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
