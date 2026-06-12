import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  Share2,
  ClipboardList,
  Building2,
  Factory,
  BadgeCheck,
  ShieldCheck,
  Wallet,
  MessageCircle,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  Check,
  Calendar,
  BookOpen,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Supplier Playbooks: Vetting & Sourcing Frameworks",
  description:
    "Practical, step-by-step playbooks to vet and select reliable suppliers in China — checklists, scorecards, red flags, and questions to reduce risk and improve quality.",
  path: "/resources/supplier-playbooks",
  keywords: [
    "supplier playbooks",
    "supplier vetting checklist",
    "China sourcing",
    "supplier evaluation scorecard",
    "quality management",
  ],
});

// Social share icons using inline SVGs (matching guide detail pattern)
function FacebookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
function TwitterIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}
function LinkedinIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}

const toc = [
  "Overview",
  "Supplier Vetting Checklist",
  "Vetting Steps",
  "Red Flags",
  "Vetting Questions",
  "Supplier Evaluation Scorecard",
  "Final Recommendations",
];

const checklistCategories = [
  { icon: Building2, label: "Company Background" },
  { icon: Factory, label: "Manufacturing Capability" },
  { icon: BadgeCheck, label: "Quality Management" },
  { icon: ShieldCheck, label: "Compliance & Certifications" },
  { icon: Wallet, label: "Financial Stability" },
  { icon: MessageCircle, label: "Communication & Service" },
];

const vettingSteps = [
  { n: "01", title: "Pre-Screen", desc: "Shortlist suppliers based on basic criteria." },
  { n: "02", title: "Information Request", desc: "Collect documents and capabilities." },
  { n: "03", title: "Evaluate & Compare", desc: "Compare suppliers side by side." },
  { n: "04", title: "Sample & Test", desc: "Request samples and assess quality." },
  { n: "05", title: "Factory Verification", desc: "Verify via audit or inspection." },
  { n: "06", title: "Negotiate & Onboard", desc: "Agree terms and tighten the relationship." },
];

const redFlags = [
  "Unwilling to share company information.",
  "Prices significantly below market.",
  "Pressure to pay large deposits upfront.",
  "Poor or delayed communication.",
];

const vettingQuestions = [
  "How long have you been in business?",
  "Can you share your main product categories?",
  "What quality certifications do you hold?",
  "What is your monthly production capacity?",
  "Can you provide client references?",
];

const scorecardRows = [
  { criteria: "Product Quality", weight: "30%", a: "4/5", b: "4/5", c: "3/5" },
  { criteria: "Manufacturing Capability", weight: "20%", a: "4/5", b: "3/5", c: "4/5" },
  { criteria: "Quality Management", weight: "15%", a: "5/5", b: "4/5", c: "3/5" },
  { criteria: "Communication & Service", weight: "15%", a: "4/5", b: "5/5", c: "3/5" },
  { criteria: "Compliance & Certifications", weight: "10%", a: "5/5", b: "4/5", c: "4/5" },
  { criteria: "Financial Stability", weight: "10%", a: "4/5", b: "4/5", c: "3/5" },
];

const finalRecommendations = [
  "Build relationships and communicate clearly.",
  "Start with a trial order to test performance.",
  "Review performance regularly and document everything.",
  "Diversify your supplier base for resilience.",
];

const relatedPlaybooks = [
  { icon: ClipboardList, title: "Shipping Routes Playbook", img: "/images/photo-1494412574643-ff11b0a5c1c3.jpg" },
  { icon: ShieldCheck, title: "Customs & Compliance Playbook", img: "/images/photo-1601584115197-04ecc0da31d7.jpg" },
  { icon: FileText, title: "Demand Planning Playbook", img: "/images/photo-1578575437130-527eed3abbec.jpg" },
];

const tools = [
  "Supplier Vetting Checklist",
  "Supplier Evaluation Scorecard",
  "Sample Vetting Questions",
];

const heroImage =
  "/images/photo-1586528116311-ad8dd3c8310d.jpg";

const AUTHOR_IMG =
  "/images/photo-1573497019940-1c28c88b4f3e.jpg";

const moreResources = [
  {
    category: "Case Study",
    title: "How Peak Supplies Cut Lead Time by 40%",
    image: "/images/photo-1553413077-190dd305871c.jpg",
  },
  {
    category: "Blog",
    title: "Sustainable Fulfillment: What It Means in 2025",
    image: "/images/photo-1542601906990-b4d3fb778b09.jpg",
  },
  {
    category: "Guide",
    title: "The Ultimate Supplier Vetting Checklist",
    image: "/images/photo-1581092160562-40aa08e78837.jpg",
  },
  {
    category: "Shipping Insights",
    title: "China–US Shipping Update: Rates, Capacity & Trends",
    image: "/images/photo-1494412519320-aa613dfb7738.jpg",
  },
];

export default function SupplierPlaybooksPage() {
  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <Link href="/resources" className="hover:text-navy transition-colors">Resources</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <Link href="/resources/supplier-playbooks" className="hover:text-navy transition-colors">Playbooks</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <span className="text-deep-navy font-medium truncate">Supplier Vetting Playbook</span>
        </div>
      </section>

      {/* Header */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <p className="inline-block text-xs font-semibold text-teal bg-teal/8 px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
            Playbook
          </p>
          <h1 className="text-4xl lg:text-[44px] font-bold text-deep-navy leading-[1.12] max-w-[760px]">
            Supplier Vetting Playbook for Growing E-commerce Brands
          </h1>
          <p className="mt-4 text-lg text-text-body leading-relaxed max-w-[720px]">
            A practical, step-by-step framework to evaluate and select reliable suppliers in China—reduce risk, improve quality, and build lasting partnerships.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image
                  src={AUTHOR_IMG}
                  alt="Sarah Johnson"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-deep-navy">Sarah Johnson</p>
                <p className="text-xs text-text-muted">Supply Chain Analyst, FulfillMesh</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-text-muted"><Calendar className="w-4 h-4" /> March 15, 2024</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-text-muted"><Clock3 className="w-4 h-4" /> 8 min read</span>
            <div className="flex items-center gap-3 text-text-muted ml-auto">
              <span className="text-sm mr-1">Share</span>
              <button className="w-8 h-8 rounded-full bg-soft-bg border border-border-soft flex items-center justify-center text-text-muted hover:text-action-blue hover:border-action-blue transition-colors"><FacebookIcon className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full bg-soft-bg border border-border-soft flex items-center justify-center text-text-muted hover:text-action-blue hover:border-action-blue transition-colors"><TwitterIcon className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full bg-soft-bg border border-border-soft flex items-center justify-center text-text-muted hover:text-action-blue hover:border-action-blue transition-colors"><LinkedinIcon className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full bg-soft-bg border border-border-soft flex items-center justify-center text-text-muted hover:text-action-blue hover:border-action-blue transition-colors"><Share2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 pb-10">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] shadow-card">
            <Image
              src={heroImage}
              alt="Hands reviewing a supplier checklist on a clipboard over shipping boxes"
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

            {/* 1 Overview */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">1. Overview</h2>
              <p className="text-text-body leading-relaxed">
                Vetting the right supplier is one of the most important decisions you&apos;ll make for your business. A strong supplier relationship leads to better quality, on-time delivery, and long-term growth—while the wrong choice can lead to delays, disputes, and costly mistakes.
              </p>
              <p className="text-text-body leading-relaxed mt-4">
                This playbook gives you a proven framework to evaluate suppliers in China with confidence.
              </p>
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-soft-bg border border-border-soft p-5">
                <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <p className="text-sm text-text-body leading-relaxed">
                  <span className="font-semibold text-deep-navy">Best Practice:</span> Always evaluate more than one supplier and compare objectively using a consistent scorecard.
                </p>
              </div>
            </div>

            {/* 2 Checklist */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">2. Supplier Vetting Checklist</h2>
              <p className="text-text-body leading-relaxed mb-6">
                Use these six categories as your evaluation framework when assessing potential suppliers.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {checklistCategories.map((c, i) => (
                  <div key={i} className="rounded-xl border border-border-soft p-5">
                    <div className="w-10 h-10 rounded-lg bg-soft-bg flex items-center justify-center mb-3">
                      <c.icon className="w-5 h-5 text-action-blue" />
                    </div>
                    <h3 className="text-sm font-bold text-deep-navy leading-tight">{c.label}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Vetting Steps */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">3. Vetting Steps</h2>
              <p className="text-text-body leading-relaxed mb-6">
                Follow this proven six-step process to evaluate and select the best suppliers for your business.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {vettingSteps.map((s, i) => (
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

            {/* 4 & 5 Red Flags & Questions */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">4. Red Flags</h2>
              <p className="text-text-body leading-relaxed mb-5">
                Watch for these warning signs that a supplier may not be reliable.
              </p>
              <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-5">
                <ul className="space-y-3">
                  {redFlags.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#991B1B]">
                      <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">5. Sample Vetting Questions</h2>
              <p className="text-text-body leading-relaxed mb-5">
                Ask these essential questions during your supplier evaluation process.
              </p>
              <div className="rounded-xl border border-border-soft overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-soft-bg border-b border-border-soft">
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">#</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Question</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vettingQuestions.map((q, i) => (
                      <tr key={i} className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                        <td className="px-5 py-3.5 text-action-blue font-semibold">{i + 1}</td>
                        <td className="px-5 py-3.5 text-text-body">{q}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6 Scorecard */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">6. Supplier Evaluation Scorecard</h2>
              <p className="text-text-body leading-relaxed mb-5">
                Use this scorecard template to objectively compare suppliers across key criteria.
              </p>
              <div className="rounded-xl border border-border-soft overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-soft-bg border-b border-border-soft">
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Criteria</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Weight</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Supplier A</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Supplier B</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Supplier C</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Your Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scorecardRows.map((r, i) => (
                      <tr key={i} className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-text-primary">{r.criteria}</td>
                        <td className="px-5 py-3.5 text-text-body">{r.weight}</td>
                        <td className="px-5 py-3.5 text-text-body">{r.a}</td>
                        <td className="px-5 py-3.5 text-text-body">{r.b}</td>
                        <td className="px-5 py-3.5 text-text-body">{r.c}</td>
                        <td className="px-5 py-3.5 text-text-light">&mdash;</td>
                      </tr>
                    ))}
                    <tr className="bg-teal/[0.08]">
                      <td className="px-5 py-3.5 font-bold text-deep-navy">Total</td>
                      <td className="px-5 py-3.5 font-bold text-deep-navy">100%</td>
                      <td className="px-5 py-3.5" colSpan={3}></td>
                      <td className="px-5 py-3.5 font-bold text-deep-navy">/100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-text-muted">
                Scores are calculated from 1 (low) to 5 (excellent). Adjust weights based on your priorities.
              </p>
            </div>

            {/* 7 Final Recommendations */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-5">7. Final Recommendations</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {finalRecommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-border-soft p-4">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-sm text-text-body">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download box */}
            <div className="rounded-2xl bg-teal/5 border border-teal/20 p-7 flex flex-col sm:flex-row sm:items-center gap-5">
              <FileText className="w-10 h-10 text-teal shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-teal uppercase tracking-wide mb-1">Free resource</p>
                <h3 className="text-lg font-bold text-deep-navy">Supplier Vetting Checklist</h3>
                <p className="text-sm text-text-body mt-1">Printable PDF &amp; editable spreadsheet to streamline your supplier vetting process.</p>
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all shrink-0">
                <Download className="w-4 h-4" /> Download Template
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
                    alt="Sarah Johnson"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-deep-navy">Sarah Johnson</p>
                  <p className="text-xs text-text-muted">Supply Chain Analyst, FulfillMesh</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-text-body leading-relaxed">
                Sarah specializes in supplier evaluation, quality assurance, and building resilient supply chains for growing e-commerce brands.
              </p>
              <Link href="/resources/supplier-playbooks" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
                View all playbooks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Related Playbooks */}
            <div className="rounded-2xl border border-border-soft p-6">
              <p className="text-sm font-bold text-deep-navy mb-4">Related playbooks</p>
              <div className="space-y-4">
                {relatedPlaybooks.map((p, i) => (
                  <Link key={i} href="/resources/supplier-playbooks" className="flex items-start gap-3 group">
                    <div className="relative w-14 h-12 rounded-lg overflow-hidden shrink-0 bg-soft-bg">
                      <Image
                        src={p.img}
                        alt={p.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-text-body group-hover:text-action-blue leading-snug transition-colors">{p.title}</span>
                  </Link>
                ))}
              </div>
              <Link href="/resources/supplier-playbooks" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
                Browse all playbooks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tools / Download Card */}
            <div className="relative rounded-2xl gradient-dark-hero text-white p-6 overflow-hidden">
              <DottedWorldMap />
              <p className="relative text-xs font-semibold text-teal uppercase tracking-wide mb-2">Free templates</p>
              <h3 className="relative text-lg font-bold">Tools for smarter sourcing</h3>
              <p className="relative mt-2 text-sm text-text-on-dark-muted">Download templates and checklists to streamline your supplier vetting process.</p>
              <ul className="relative mt-4 space-y-3">
                {tools.map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-sm text-text-on-dark-soft">
                    <Check className="w-4 h-4 text-teal shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <button className="relative mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white gradient-cta hover:shadow-button transition-all">
                <Download className="w-4 h-4" /> Download All Templates
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* More resources */}
      <section className="bg-soft-bg border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy">More resources you might find helpful</h2>
            <Link href="/resources" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all resources <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moreResources.map((r, i) => (
              <Link
                key={i}
                href="/resources"
                className="group rounded-2xl border border-border-soft bg-white overflow-hidden hover:shadow-card transition-all flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-soft-bg">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="self-start text-[11px] font-semibold text-action-blue bg-action-blue/8 px-2.5 py-1 rounded-full mb-3">{r.category}</span>
                  <h3 className="font-semibold text-deep-navy group-hover:text-action-blue leading-snug transition-colors">{r.title}</h3>
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
                placeholder="Enter your email"
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
