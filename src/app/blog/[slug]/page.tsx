import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock3,
  CheckCircle2, ArrowRight,
  Link2, Calendar,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

// Humanize a URL slug into a readable blog post title for metadata.
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
    title: titleFromSlug(slug),
    description:
      "Expert analysis on supply chain strategy and e-commerce fulfillment — a step-by-step framework to identify reliable manufacturing partners and avoid costly risks.",
    path: `/blog/${slug}`,
    keywords: ["supply chain", "supplier vetting", "e-commerce fulfillment", "logistics strategy"],
  });
}

function FacebookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
function TwitterIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}
function LinkedinIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}

const AUTHOR_IMG = "/images/photo-1573497019940-1c28c88b4f3e.jpg";

const tocItems = [
  "Why Vetting Suppliers Is Non-Negotiable",
  "Step 1: Define Your Requirements Clearly",
  "Step 2: Research and Shortlist Potential Suppliers",
  "Step 3: Conduct Due Diligence",
];

const related = [
  { category: "Supply Chain", title: "Building Resilient Supply Chains in an Uncertain World", image: "/images/photo-1494412519320-aa613dfb7738.jpg", author: "Sarah Chen", date: "Oct 10, 2024" },
  { category: "Fulfillment", title: "The Future of Last-Mile Delivery: Trends to Watch", image: "/images/photo-1578575437130-527eed3abbec.jpg", author: "James Park", date: "Oct 5, 2024" },
  { category: "Technology", title: "How AI is Transforming Supply Chain Visibility", image: "/images/photo-1551288049-bebda4e38f71.jpg", author: "Lisa Wang", date: "Sep 28, 2024" },
];

export default function BlogDetailPage() {
  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-2.5 flex items-center gap-2 text-[13px]">
          <Link href="/" className="text-text-muted hover:text-deep-navy">Home</Link>
          <span className="text-text-light">/</span>
          <Link href="/blog" className="text-text-muted hover:text-deep-navy">Blog</Link>
          <span className="text-text-light">/</span>
          <span className="text-text-muted">Supply Chain</span>
          <span className="text-text-light">/</span>
          <span className="text-deep-navy font-medium truncate">The Ultimate Guide to Vetting Suppliers in China</span>
        </div>
      </section>

      {/* Article Header */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <p className="inline-block text-[11px] font-semibold text-white bg-action-blue px-3 py-1 rounded-md uppercase tracking-wide mb-4">
            Supply Chain
          </p>
          <h1 className="text-[28px] lg:text-[34px] font-bold text-deep-navy leading-tight max-w-[720px]">
            The Ultimate Guide to Vetting Suppliers in China
          </h1>
          <p className="mt-2 text-[14px] text-text-body leading-relaxed max-w-[680px]">
            A step-by-step framework to identify reliable manufacturing partners and avoid costly supply chain risks.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className="w-9 h-9 rounded-full bg-cover bg-center shrink-0 border-2 border-border-soft"
                style={{ backgroundImage: `url('${AUTHOR_IMG}')` }}
              />
              <div>
                <p className="text-[13px] font-semibold text-deep-navy">Sarah Chen</p>
                <p className="text-[11px] text-text-muted">Supply Chain Expert</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-text-muted"><Calendar className="w-3.5 h-3.5" /> October 15, 2024</span>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-text-muted"><Clock3 className="w-3.5 h-3.5" /> 12 min read</span>
            <div className="flex items-center gap-2 text-text-light ml-auto">
              <span className="text-[13px] text-text-muted mr-1">Share</span>
              <span className="w-7 h-7 rounded-full border border-border-soft flex items-center justify-center hover:text-action-blue hover:border-action-blue transition-colors cursor-pointer"><FacebookIcon className="w-3.5 h-3.5" /></span>
              <span className="w-7 h-7 rounded-full border border-border-soft flex items-center justify-center hover:text-action-blue hover:border-action-blue transition-colors cursor-pointer"><TwitterIcon className="w-3.5 h-3.5" /></span>
              <span className="w-7 h-7 rounded-full border border-border-soft flex items-center justify-center hover:text-action-blue hover:border-action-blue transition-colors cursor-pointer"><LinkedinIcon className="w-3.5 h-3.5" /></span>
              <span className="w-7 h-7 rounded-full border border-border-soft flex items-center justify-center hover:text-action-blue hover:border-action-blue transition-colors cursor-pointer"><Link2 className="w-3.5 h-3.5" /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-6">
          <div
            className="rounded-lg bg-deep-navy bg-cover bg-center aspect-[16/8]"
            style={{ backgroundImage: "url('/images/photo-1565008447742-97f6f38c985c.jpg')" }}
          />
        </div>
      </section>

      {/* Article Body + Sidebar */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <article className="lg:col-span-2 space-y-0">
            <div className="mb-6">
              <h2 className="text-[18px] font-bold text-deep-navy mb-1.5 pb-2 border-b border-border-soft">Why Vetting Suppliers Is Non-Negotiable</h2>
              <p className="text-[14px] text-text-body leading-relaxed mt-3">
                Choosing the wrong supplier can lead to quality issues, shipment delays, and reputational damage. A rigorous vetting process minimizes risk and ensures long-term success for your supply chain operations.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-[18px] font-bold text-deep-navy mb-1.5 pb-2 border-b border-border-soft">Step 1: Define Your Requirements Clearly</h2>
              <p className="text-[14px] text-text-body leading-relaxed mt-3">
                Before approaching any supplier, document your exact requirements: product specifications, quality standards, volume expectations, lead times, and budget constraints.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-[18px] font-bold text-deep-navy mb-1.5 pb-2 border-b border-border-soft">Step 2: Research and Shortlist Potential Suppliers</h2>
              <p className="text-[14px] text-text-body leading-relaxed mt-3">
                Use industry directories, trade shows, and referrals to build an initial list. Cross-reference with online reviews and certifications to narrow down to a shortlist of 5-10 candidates.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-[18px] font-bold text-deep-navy mb-1.5 pb-2 border-b border-border-soft">Step 3: Conduct Due Diligence</h2>
              <p className="text-[14px] text-text-body leading-relaxed mt-3">
                Verify business licenses, export certifications, and financial stability. Request references from existing clients and follow up on them.
              </p>
              {/* Callout box */}
              <div className="rounded-lg bg-[#EFF6FF] border border-action-blue/20 p-4 mt-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-action-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-deep-navy mb-0.5">Pro Tip: Use a Supplier Scorecard</p>
                    <p className="text-[13px] text-text-body leading-relaxed">
                      Create a standardized scorecard to objectively compare suppliers across criteria like quality, cost, and reliability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* TOC */}
            <div className="rounded-lg border border-border-soft p-5 sticky top-6">
              <p className="text-[14px] font-semibold text-deep-navy mb-3">Table of Contents</p>
              <ol className="space-y-0">
                {tocItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-[13px] text-text-body hover:text-action-blue hover:bg-soft-bg rounded-md px-2 py-2 cursor-pointer transition-colors"
                  >
                    <span className="text-action-blue font-bold w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Author Card */}
            <div className="rounded-lg border border-border-soft p-5">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border-2 border-border-soft"
                  style={{ backgroundImage: `url('${AUTHOR_IMG}')` }}
                />
                <div>
                  <p className="text-[13px] font-semibold text-deep-navy">Sarah Chen</p>
                  <p className="text-[11px] text-text-muted">Supply Chain Expert</p>
                </div>
              </div>
              <p className="mt-3 text-[13px] text-text-body leading-relaxed">
                With 10+ years in global supply chain management, Sarah helps businesses build resilient manufacturing networks.
              </p>
              <Link href="/blog" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-action-blue hover:underline">
                View all articles <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="bg-soft-bg border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-bold text-deep-navy">You Might Also Like</h2>
            <Link href="/blog" className="inline-flex items-center gap-1 text-[13px] font-medium text-action-blue hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((a, i) => (
              <Link
                key={i}
                href="/blog/sample-post"
                className="group rounded-lg border border-border-soft bg-white overflow-hidden hover:shadow-card transition-all flex flex-col"
              >
                <div
                  className="aspect-[3/2] bg-cover bg-center bg-deep-navy"
                  style={{ backgroundImage: `url('${a.image}')` }}
                />
                <div className="p-4 flex flex-col flex-1">
                  <span className="self-start text-[10px] font-semibold text-white bg-action-blue px-2 py-0.5 rounded-md mb-2">
                    {a.category}
                  </span>
                  <h3 className="font-semibold text-deep-navy group-hover:text-action-blue leading-snug text-[14px]">{a.title}</h3>
                  <div className="mt-auto pt-2 text-[12px] text-text-muted">
                    {a.author} · {a.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="rounded-lg bg-soft-bg border border-border-soft p-5 flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div>
                <h3 className="text-[15px] font-bold text-deep-navy">Stay ahead with FulfillMesh</h3>
                <p className="mt-0.5 text-[13px] text-text-body">Get the latest insights, shipping updates, and expert tips delivered to your inbox.</p>
              </div>
            </div>
            <div className="flex gap-2.5 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-56 px-3 py-2 rounded-md border border-border-soft bg-white text-[13px] placeholder:text-text-light focus:outline-none focus:border-action-blue"
              />
              <button className="px-4 py-2 rounded-md bg-action-blue text-white text-[13px] font-semibold hover:bg-action-blue/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-text-muted text-center lg:text-right">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>
    </main>
  );
}
