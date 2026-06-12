import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Calendar,
  BookOpen,
  TrendingUp,
  Boxes,
  Network,
  Truck,
  Download,
  FileText,
  Lightbulb,
  Mail,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

// Humanize a URL slug into a readable, title-cased phrase for metadata.
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
    title: `${titleFromSlug(slug)} | Fulfillment Guide`,
    description:
      "A practical fulfillment guide with step-by-step strategies and a framework to reduce costs, improve delivery speed, and scale your supply chain with confidence.",
    path: `/resources/guides/${slug}`,
    keywords: ["fulfillment guide", "supply chain strategy", "logistics best practices", "e-commerce operations"],
  });
}

// Social share icons using inline SVGs (matching blog detail pattern)
function FacebookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
function TwitterIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}
function LinkedinIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}

const HERO_IMG =
  "/images/photo-1553413077-190dd305871c.jpg";
const AUTHOR_IMG =
  "/images/photo-1573497019940-1c28c88b4f3e.jpg";

const toc = [
  "Why fulfillment planning matters",
  "Key components of a smart plan",
  "Step-by-step planning framework",
  "Technology that makes a difference",
  "Common challenges (and how to solve them)",
  "Best practices to scale smarter",
  "Conclusion",
];

const pillars = [
  { icon: TrendingUp, title: "Demand forecasting", desc: "Anticipate demand and prevent costly stockouts." },
  { icon: Boxes, title: "Inventory strategy", desc: "Decide when, where, and how much to stock." },
  { icon: Network, title: "Network design", desc: "Place inventory close to your customers." },
  { icon: Truck, title: "Carrier & shipping", desc: "Select partners and methods that align with your goals." },
];

const frameworkSteps = [
  { n: "01", title: "Assess", desc: "Analyze your current operations and identify gaps." },
  { n: "02", title: "Forecast", desc: "Predict demand and build inventory plans." },
  { n: "03", title: "Design", desc: "Build your network and workflows." },
  { n: "04", title: "Optimize", desc: "Refine processes to balance cost and speed." },
  { n: "05", title: "Execute", desc: "Implement, monitor, and continuously improve." },
];

const techList = [
  "Real-time inventory visibility",
  "Automated order routing",
  "Predictive demand forecasting",
  "Analytics & scenario modeling",
];

const challenges = [
  { challenge: "Demand volatility", solve: "Use forecasting tools and monitor trends in real time." },
  { challenge: "High shipping costs", solve: "Negotiate rates, consolidate shipments, and optimize routes." },
  { challenge: "Stockouts & overstocking", solve: "Balance inventory with accurate demand signals." },
  { challenge: "Complex multi-channel ops", solve: "Centralize and automate fulfillment workflows." },
];

const bestPractices = [
  "Continuously monitor KPIs and adjust.",
  "Standardize and document processes.",
  "Invest in automation and integration.",
  "Keep the customer experience at the core.",
];

const relatedGuides = [
  { title: "The Ultimate Supplier Vetting Checklist", img: "/images/photo-1586528116311-ad8dd3c8310d.jpg" },
  { title: "Shipping Costs Calculator: Estimate & Optimize", img: "/images/photo-1578575437130-527eed3abbec.jpg" },
  { title: "Inventory Reorder Template: Never Run Out", img: "/images/photo-1601584115197-04ecc0da31d7.jpg" },
];

const moreGuides = [
  { title: "The Ultimate Supplier Vetting Checklist", img: "/images/photo-1586528116311-ad8dd3c8310d.jpg", read: "7 min read" },
  { title: "Shipping Costs Calculator: Estimate & Optimize", img: "/images/photo-1578575437130-527eed3abbec.jpg", read: "5 min read" },
  { title: "Inventory Reorder Template: Never Run Out", img: "/images/photo-1601584115197-04ecc0da31d7.jpg", read: "6 min read" },
  { title: "E-commerce Packaging Guide: Best Practices", img: "/images/photo-1607349913338-fca6f7fc42d0.jpg", read: "6 min read" },
];

export default function GuideDetailPage() {
  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <Link href="/resources" className="hover:text-navy transition-colors">Resources</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <Link href="/resources/guides" className="hover:text-navy transition-colors">Guides</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <span className="text-text-primary font-medium truncate">The Ultimate Guide to Smarter Fulfillment Planning</span>
        </div>
      </section>

      {/* Header */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <p className="inline-block text-xs font-semibold text-teal bg-teal/8 px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
            Guide
          </p>
          <h1 className="text-4xl lg:text-[44px] font-bold text-deep-navy leading-[1.12] max-w-[760px]">
            The Ultimate Guide to Smarter Fulfillment Planning
          </h1>
          <p className="mt-4 text-lg text-text-body leading-relaxed max-w-[720px]">
            Learn how to build a fulfillment plan that reduces costs, improves delivery speed, and scales with your business. Practical strategies, real-world examples, and a step-by-step framework you can apply today.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image
                  src={AUTHOR_IMG}
                  alt="Ria Zhang"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-deep-navy">Ria Zhang</p>
                <p className="text-xs text-text-muted">Head of Content, FulfillMesh</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-text-muted"><Calendar className="w-4 h-4" /> May 8, 2025</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-text-muted"><Clock3 className="w-4 h-4" /> 8 min read</span>
            <div className="flex items-center gap-3 text-text-muted ml-auto">
              <span className="text-sm mr-1">Share</span>
              <button className="w-8 h-8 rounded-full bg-soft-bg border border-border-soft flex items-center justify-center text-text-muted hover:text-action-blue hover:border-action-blue transition-colors"><FacebookIcon className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full bg-soft-bg border border-border-soft flex items-center justify-center text-text-muted hover:text-action-blue hover:border-action-blue transition-colors"><TwitterIcon className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full bg-soft-bg border border-border-soft flex items-center justify-center text-text-muted hover:text-action-blue hover:border-action-blue transition-colors"><LinkedinIcon className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full bg-soft-bg border border-border-soft flex items-center justify-center text-text-muted hover:text-action-blue hover:border-action-blue transition-colors"><Mail className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 pb-10">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] shadow-card">
            <Image
              src={HERO_IMG}
              alt="Fulfillment planning warehouse and distribution"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Body + Sidebar */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
          {/* Main */}
          <article className="lg:col-span-2 space-y-12">

            {/* 1 */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">1. Why fulfillment planning matters</h2>
              <p className="text-text-body leading-relaxed">
                A well-planned fulfillment strategy directly impacts your bottom line and customer experience. The right plan can help you reduce logistics costs, improve delivery speed, and adapt to demand shifts without operational chaos.
              </p>
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-soft-bg border border-border-soft p-5">
                <div className="w-9 h-9 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-action-blue" />
                </div>
                <p className="text-sm text-text-body leading-relaxed">
                  <span className="font-semibold text-deep-navy">Businesses with optimized fulfillment operations see up to 25% lower logistics costs and 20% higher customer satisfaction.</span>
                  <span className="block mt-1 text-text-muted">&mdash; McKinsey &amp; Company</span>
                </p>
              </div>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">2. Key components of a smart plan</h2>
              <p className="text-text-body leading-relaxed mb-6">
                Every strong fulfillment plan is built on a few essential pillars. Get these right, and everything else becomes easier to scale.
              </p>
              <div className="grid sm:grid-cols-2 gap-5">
                {pillars.map((p, i) => (
                  <div key={i} className="rounded-xl border border-border-soft p-5">
                    <div className="w-10 h-10 rounded-lg bg-soft-bg flex items-center justify-center mb-3">
                      <p.icon className="w-5 h-5 text-action-blue" />
                    </div>
                    <h3 className="text-sm font-bold text-deep-navy mb-1">{p.title}</h3>
                    <p className="text-xs text-text-body leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">3. Step-by-step planning framework</h2>
              <p className="text-text-body leading-relaxed mb-6">
                Use this proven framework to create a fulfillment plan that grows with your business.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                {frameworkSteps.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-action-blue text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                      {s.n}
                    </div>
                    <h3 className="text-sm font-bold text-deep-navy mb-1">{s.title}</h3>
                    <p className="text-xs text-text-muted leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">4. Technology that makes a difference</h2>
              <p className="text-text-body leading-relaxed mb-5">
                The right tools can automate decisions, increase visibility, and help you respond faster.
              </p>
              <div className="grid sm:grid-cols-2 gap-8 items-center">
                <ul className="space-y-3">
                  {techList.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-text-body">
                      <CheckCircle2 className="w-5 h-5 text-teal shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl bg-action-blue/5 border border-action-blue/15 p-5">
                  <p className="text-sm text-text-body leading-relaxed">
                    FulfillMesh customers see data-driven insights cut delivery times by 37% and logistics costs by 22%.
                  </p>
                  <Link href="/how-it-works" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
                    See how it works <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">5. Common challenges (and how to solve them)</h2>
              <p className="text-text-body leading-relaxed mb-5">
                From unpredictable demand to rising shipping costs, here&apos;s how to stay ahead.
              </p>
              <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
                <div className="rounded-xl border border-border-soft overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-soft-bg border-b border-border-soft">
                        <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Challenge</th>
                        <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">How to solve it</th>
                      </tr>
                    </thead>
                    <tbody>
                      {challenges.map((c, i) => (
                        <tr key={i} className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-text-primary">{c.challenge}</td>
                          <td className="px-5 py-3.5 text-text-body">{c.solve}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="rounded-xl bg-teal/5 border border-teal/20 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-teal" />
                    <p className="text-sm font-bold text-deep-navy">Pro tip</p>
                  </div>
                  <p className="text-sm text-text-body leading-relaxed">
                    Run regular &ldquo;what-if&rdquo; scenarios to test your plan against demand spikes, supply disruptions, and seasonality.
                  </p>
                </div>
              </div>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-5">6. Best practices to scale smarter</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {bestPractices.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-border-soft p-4">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-sm text-text-body">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">7. Conclusion</h2>
              <p className="text-text-body leading-relaxed">
                A smarter fulfillment plan isn&apos;t just about moving products&mdash;it&apos;s about driving growth, building resilience, and delivering exceptional customer experiences. Start with the right strategy, leverage technology, and continuously optimize.
              </p>
            </div>

            {/* Download box */}
            <div className="rounded-2xl bg-teal/5 border border-teal/20 p-7 flex flex-col sm:flex-row sm:items-center gap-5">
              <FileText className="w-10 h-10 text-teal shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-teal uppercase tracking-wide mb-1">Free resource</p>
                <h3 className="text-lg font-bold text-deep-navy">Fulfillment Planning Checklist</h3>
                <p className="text-sm text-text-body mt-1">A step-by-step checklist to help you build a smarter fulfillment plan from start to finish.</p>
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all shrink-0">
                <Download className="w-4 h-4" /> Download the Checklist
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* On this page */}
            <div className="rounded-2xl border border-border-soft p-6 sticky top-6">
              <p className="text-sm font-bold text-deep-navy mb-4">On this page</p>
              <ol className="space-y-2">
                {toc.map((item, i) => (
                  <li key={i}>
                    <a
                      href={`#${item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                      className={`flex gap-3 text-sm py-1 border-l-2 pl-3 transition-colors ${
                        i === 0
                          ? "text-action-blue font-medium border-action-blue"
                          : "text-text-body border-transparent hover:text-action-blue hover:border-action-blue"
                      }`}
                    >
                      <span className="text-action-blue font-semibold">{String(i + 1).padStart(2, "0")}</span>
                      <span>{item}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Author */}
            <div className="rounded-2xl border border-border-soft p-6">
              <p className="text-sm font-bold text-deep-navy mb-4">About the author</p>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={AUTHOR_IMG}
                    alt="Ria Zhang"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-deep-navy">Ria Zhang</p>
                  <p className="text-xs text-text-muted">Head of Content, FulfillMesh</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-text-body leading-relaxed">
                Ria writes about logistics, supply chain strategy, and e-commerce growth. She&apos;s passionate about turning complex topics into practical insights.
              </p>
              <Link href="/resources/guides" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
                View all guides <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Related guides */}
            <div className="rounded-2xl border border-border-soft p-6">
              <p className="text-sm font-bold text-deep-navy mb-4">Related guides</p>
              <div className="space-y-4">
                {relatedGuides.map((g, i) => (
                  <Link key={i} href="/resources/guides/supplier-vetting" className="flex items-start gap-3 group">
                    <div className="relative w-14 h-12 rounded-lg overflow-hidden shrink-0 bg-soft-bg">
                      <Image
                        src={g.img}
                        alt={g.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-text-body group-hover:text-action-blue leading-snug transition-colors">{g.title}</span>
                  </Link>
                ))}
              </div>
              <Link href="/resources/guides" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
                Browse all guides <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* CTA card */}
            <div className="relative rounded-2xl gradient-dark-hero text-white p-6 overflow-hidden">
              <DottedWorldMap />
              <p className="relative text-xs font-semibold text-teal uppercase tracking-wide mb-2">Ready to scale?</p>
              <h3 className="relative text-lg font-bold">See FulfillMesh in action</h3>
              <p className="relative mt-2 text-sm text-text-on-dark-muted">Book a personalized demo and see how FulfillMesh can help you plan smarter, ship faster, and scale globally.</p>
              <Link href="/book-a-demo" className="relative mt-4 block text-center py-3 rounded-lg gradient-cta text-white text-sm font-semibold hover:shadow-button transition-all">
                Book a Demo
              </Link>
              <Link href="/how-it-works" className="relative mt-3 block text-center text-sm font-medium text-text-on-dark-soft hover:underline">
                Learn more about FulfillMesh
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* More guides */}
      <section className="bg-soft-bg border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy">More guides you might like</h2>
            <Link href="/resources/guides" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all guides <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moreGuides.map((g, i) => (
              <Link
                key={i}
                href="/resources/guides/supplier-vetting"
                className="group rounded-2xl border border-border-soft bg-white overflow-hidden hover:shadow-card transition-all flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-soft-bg">
                  <Image
                    src={g.img}
                    alt={g.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="self-start text-[11px] font-semibold text-action-blue bg-action-blue/8 px-2.5 py-1 rounded-full mb-3">Guide</span>
                  <h3 className="font-semibold text-deep-navy group-hover:text-action-blue leading-snug">{g.title}</h3>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-text-muted"><Clock3 className="w-3.5 h-3.5" /> {g.read}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter band */}
      <section className="bg-white border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="rounded-2xl bg-soft-bg border border-border-soft p-7 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-11 h-11 rounded-xl bg-white border border-border-soft flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-action-blue" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-deep-navy">Stay ahead with FulfillMesh</h3>
                <p className="mt-1 text-sm text-text-body">Get the latest insights, shipping updates, and expert tips delivered to your inbox.</p>
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your work email"
                className="flex-1 lg:w-64 px-4 py-3 rounded-lg border border-border-soft bg-white text-sm text-text-body placeholder:text-text-light focus:outline-none focus:border-action-blue"
              />
              <button className="px-6 py-3 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-deep-navy transition-colors">Subscribe</button>
            </div>
          </div>
          <p className="mt-3 text-xs text-text-muted text-center lg:text-right">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>
    </main>
  );
}

function DottedWorldMap() {
  const cols = 26;
  const rows = 11;
  const dots: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const nx = c / cols;
      const ny = r / rows;
      const americas = nx > 0.08 && nx < 0.32 && ny > 0.18 && ny < 0.92;
      const euraf = nx > 0.42 && nx < 0.72 && ny > 0.14 && ny < 0.88;
      const asiaPac = nx > 0.72 && nx < 0.96 && ny > 0.18 && ny < 0.7;
      if (americas || euraf || asiaPac) {
        dots.push({ x: 6 + c * 7, y: 6 + r * 7 });
      }
    }
  }
  return (
    <svg
      viewBox="0 0 196 84"
      className="absolute right-0 bottom-0 w-2/3 opacity-25 pointer-events-none"
      aria-hidden="true"
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.4" fill="#10D6B0" />
      ))}
    </svg>
  );
}
