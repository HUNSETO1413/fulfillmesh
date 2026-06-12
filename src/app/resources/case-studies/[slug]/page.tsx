import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Quote,
  Building2,
  Clock3,
  Truck,
  TrendingUp,
  ShieldCheck,
  Search,
  Settings2,
  Rocket,
  BarChart3,
  XCircle,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

// Humanize a URL slug (e.g. "peak-supplies") into a readable brand/title phrase.
function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({
    title: `${titleFromSlug(slug)} Case Study`,
    description:
      "See how this brand cut lead times, lowered logistics costs, and improved on-time delivery by unifying inventory, routing, and supplier management with FulfillMesh.",
    path: `/resources/case-studies/${slug}`,
    keywords: ["fulfillment case study", "supply chain results", "lead time reduction", "e-commerce logistics"],
  });
}

const meta = ["Peak Supplies", "Industrial & Manufacturing", "May 5, 2025", "5 min read"];

const heroStats = [
  { icon: Clock3, value: "40%", label: "Faster Lead Times" },
  { icon: Truck, value: "32%", label: "Lower Shipping Costs" },
  { icon: TrendingUp, value: "2.6x", label: "Increase in On-Time Delivery" },
  { icon: CheckCircle2, value: "98%", label: "Order Accuracy" },
];

const challenges = [
  "Disconnected systems led to poor inventory visibility across warehouses.",
  "Manual planning caused inefficient routing and missed delivery windows.",
  "Rising freight costs and expedited shipments impacted profitability.",
  "Limited ability to scale operations into new markets.",
];

const solutions = [
  "Unified inventory management with real-time visibility.",
  "AI-powered demand forecasting for smarter stock allocation.",
  "Automated shipping route optimization to reduce transit times and costs.",
  "Supplier vetting and performance monitoring to improve reliability.",
];

const implementation = [
  { icon: Search, title: "Discover & Analyze", desc: "Mapped workflows and identified key bottlenecks." },
  { icon: Settings2, title: "Configure & Integrate", desc: "Integrated systems and configured FulfillMesh modules." },
  { icon: Rocket, title: "Pilot & Optimize", desc: "Ran pilot, refined processes, and validated performance." },
  { icon: CheckCircle2, title: "Go Live & Scale", desc: "Rolled out globally and scaled into new markets." },
];

const resultsTable = [
  { metric: "Average Lead Time", before: "6.2 days", after: "3.7 days", improvement: "40% faster" },
  { metric: "On-Time Delivery", before: "76%", after: "98%", improvement: "2.6x improvement" },
  { metric: "Shipping Costs", before: "$1.28M / year", after: "$870K / year", improvement: "32% lower" },
  { metric: "Order Accuracy", before: "91%", after: "98%", improvement: "7 pp improvement" },
];

const companySnapshot = [
  { label: "Industry", value: "Industrial & Manufacturing" },
  { label: "Headquarters", value: "Chicago, Illinois, USA" },
  { label: "Founded", value: "2012" },
  { label: "Employees", value: "180+" },
  { label: "Markets Served", value: "North America" },
  { label: "FulfillMesh Customer Since", value: "2023" },
];

const keyResults = [
  { value: "40%", label: "Faster Lead Times" },
  { value: "32%", label: "Lower Shipping Costs" },
  { value: "2.6x", label: "Increase in On-Time Delivery" },
  { value: "98%", label: "Order Accuracy" },
];

const keyTakeaways = [
  "Visibility is the foundation for speed and accuracy.",
  "Smart automations eliminate manual work and errors.",
  "Data-driven decisions lead to lower costs and higher customer satisfaction.",
  "Scalable processes enable sustainable growth into new markets.",
];

const heroImage =
  "/images/photo-1553413077-190dd305871c.jpg";

const authorAvatar =
  "/images/photo-1507003211169-0a1dd7228f2d.jpg";

const related = [
  {
    category: "Shipping Insights",
    title: "China–US Shipping Update: Rates, Capacity & Trends",
    image: "/images/photo-1494412574643-ff11b0a5c1c3.jpg",
  },
  {
    category: "Guide",
    title: "The Ultimate Supplier Vetting Checklist",
    image: "/images/photo-1450101499163-c8848c66ca85.jpg",
  },
  {
    category: "Case Study",
    title: "LuxeGlow Grew 3.4x with FulfillMesh",
    image: "/images/photo-1556742049-0cfed4f6a45d.jpg",
  },
  {
    category: "Blog",
    title: "Sustainable Fulfillment: What It Means in 2025",
    image: "/images/photo-1542601906990-b4d3fb778b09.jpg",
  },
];

export default function CaseStudyDetailPage() {
  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/resources" className="hover:text-navy transition-colors">Resources</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <Link href="/resources/case-studies" className="hover:text-navy transition-colors">Case Studies</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <span className="text-text-primary font-medium truncate">How Peak Supplies Reduced Lead Times by 40%</span>
        </div>
      </section>

      {/* Hero Header — title left, image right */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-10 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block text-xs font-semibold text-action-blue bg-action-blue/8 px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
              Case Study
            </p>
            <h1 className="text-3xl lg:text-[40px] font-bold text-deep-navy leading-[1.14]">
              How Peak Supplies Reduced Lead Times by 40% with FulfillMesh
            </h1>
            <p className="mt-5 text-base text-text-body leading-relaxed max-w-[520px]">
              Peak Supplies optimized inventory planning and shipping routes with FulfillMesh&mdash;cutting lead times by 40% and unlocking scalable growth.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-text-muted">
              {meta.map((m, i) => (
                <span key={i} className="inline-flex items-center gap-3">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-text-light" />}
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[16/11] shadow-card">
            <Image
              src={heroImage}
              alt="Peak Supplies warehouse and distribution facility"
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-soft-bg border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="bg-white rounded-xl border border-border-soft px-6 py-6 grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-border-soft">
            {heroStats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-2 lg:px-6 first:pl-0">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-teal">{s.value}</p>
                  <p className="text-xs text-text-muted">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body + Sidebar */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview + Testimonial */}
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              <div>
                <h2 className="text-2xl font-bold text-deep-navy mb-3">Overview</h2>
                <p className="text-text-body leading-relaxed">
                  Peak Supplies is a fast-growing industrial components distributor serving OEMs and maintenance teams across North America. As demand increased, their legacy processes struggled to keep up&mdash;resulting in longer lead times, increased shipping costs, and inconsistent delivery performance.
                </p>
                <p className="mt-4 text-text-body leading-relaxed">
                  With FulfillMesh, Peak Supplies unified inventory visibility, automated routing, and optimized their supplier network to deliver faster, more reliably, and at lower cost.
                </p>
              </div>
              <div className="rounded-2xl bg-soft-bg border border-border-soft p-6">
                <Quote className="w-7 h-7 text-action-blue/30 mb-3" />
                <p className="text-[15px] text-text-body leading-relaxed">
                  &ldquo;FulfillMesh didn&apos;t just help us move faster&mdash;they transformed the way we operate. Our customers notice the difference, and so do our margins.&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src={authorAvatar} alt="Jason Miller" fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-deep-navy">Jason Miller</p>
                    <p className="text-xs text-text-muted">VP of Operations, Peak Supplies</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge */}
            <div className="rounded-2xl border border-border-soft p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-deep-navy">The Challenge</h2>
              </div>
              <ul className="space-y-2.5">
                {challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-body text-[15px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-2" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div className="rounded-2xl border border-border-soft p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-teal" />
                </div>
                <h2 className="text-xl font-bold text-deep-navy">The Solution</h2>
              </div>
              <ul className="space-y-2.5">
                {solutions.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-body text-[15px]">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Implementation — horizontal stepper */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">Implementation</h2>
              <p className="text-text-body leading-relaxed mb-7">
                Peak Supplies onboarded with FulfillMesh in just 8 weeks. Our team worked closely with their operations, IT, and logistics partners to ensure a seamless rollout.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {implementation.map((step, i) => (
                  <div key={i} className="relative">
                    {i < implementation.length - 1 && (
                      <span className="hidden lg:block absolute top-5 left-[calc(50%+24px)] right-[-12px] h-px border-t border-dashed border-border-soft" />
                    )}
                    <div className="relative z-10 w-10 h-10 rounded-full bg-action-blue text-white text-sm font-bold flex items-center justify-center mb-4">
                      {i + 1}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <step.icon className="w-4 h-4 text-action-blue shrink-0" />
                      <h3 className="text-sm font-bold text-deep-navy">{step.title}</h3>
                    </div>
                    <p className="text-xs text-text-body leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">Results</h2>
              <p className="text-text-body leading-relaxed mb-5">
                Within 90 days of going live, Peak Supplies saw measurable improvements across their supply chain operations.
              </p>
              <div className="rounded-xl border border-border-soft overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-soft-bg border-b border-border-soft">
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Metric</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Before FulfillMesh</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">After FulfillMesh</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-deep-navy text-xs uppercase tracking-wide bg-teal/[0.08]">Improvement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsTable.map((r, i) => (
                      <tr key={i} className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-text-primary">{r.metric}</td>
                        <td className="px-5 py-3.5 text-text-body">{r.before}</td>
                        <td className="px-5 py-3.5 text-text-body">{r.after}</td>
                        <td className="px-5 py-3.5 font-semibold text-teal bg-teal/[0.05]">{r.improvement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company snapshot */}
            <div className="rounded-2xl border border-border-soft p-6 bg-soft-bg">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-action-blue" />
                <h3 className="text-sm font-bold text-deep-navy">Company snapshot</h3>
              </div>
              <dl className="divide-y divide-border-soft">
                {companySnapshot.map((c, i) => (
                  <div key={i} className="flex justify-between gap-4 text-sm py-2.5 first:pt-0 last:pb-0">
                    <dt className="text-text-muted">{c.label}</dt>
                    <dd className="text-text-primary font-medium text-right">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Key results */}
            <div className="rounded-2xl border border-border-soft p-6 bg-soft-bg">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-teal" />
                <h3 className="text-sm font-bold text-deep-navy">Key results at a glance</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {keyResults.map((r, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold text-teal">{r.value}</p>
                    <p className="text-xs text-text-muted leading-tight mt-0.5">{r.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key takeaways */}
            <div className="rounded-2xl border border-border-soft p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-action-blue" />
                <h3 className="text-sm font-bold text-deep-navy">Key takeaways</h3>
              </div>
              <ul className="space-y-3">
                {keyTakeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related case studies */}
      <section className="bg-soft-bg border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy">Related case studies</h2>
            <Link href="/resources/case-studies" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all case studies <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r, i) => (
              <Link
                key={i}
                href="/resources/case-studies/luxeglow"
                className="group rounded-2xl border border-border-soft bg-white overflow-hidden hover:shadow-card transition-all flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="self-start text-[11px] font-semibold text-action-blue bg-action-blue/8 px-2.5 py-1 rounded-full mb-3">
                    {r.category}
                  </span>
                  <h3 className="font-semibold text-deep-navy group-hover:text-action-blue leading-snug flex-1">{r.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-action-blue">
                    Read case study <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-dark-hero text-white">
        <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">Ready to scale your fulfillment?</h2>
          <p className="mt-3 text-text-on-dark-muted">Join thousands of brands shipping smarter from China.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] border border-white/20 hover:bg-white/10 transition-all">
              Book a Demo
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-text-on-dark-muted">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal" /> Free to get started</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal" /> No obligations</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal" /> Personalized matches</span>
          </div>
        </div>
      </section>
    </main>
  );
}
