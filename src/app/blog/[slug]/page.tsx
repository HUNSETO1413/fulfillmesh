import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Clock3,
  CheckCircle2,
  ArrowRight,
  Calendar,
  ShieldCheck,
  BadgeCheck,
  Truck,
  Handshake,
  FileText,
  Mail,
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
      "Reduce risk, improve product quality, and build long-term partnerships with a proven supplier vetting process built for global brands.",
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

const heroBadges = [
  { icon: BadgeCheck, label: "Verified Capabilities" },
  { icon: CheckCircle2, label: "Quality Assured" },
  { icon: Truck, label: "On-Time Delivery" },
  { icon: Handshake, label: "Long-Term Partnership" },
];

const tocItems = [
  "Define Your Requirements",
  "Research & Shortlist Suppliers",
  "Evaluate and Verify",
  "Build Long-Term Partnerships",
  "Best Practices Checklist",
  "Final Thoughts",
];

const section1Bullets = [
  "Product specifications & materials",
  "Quality standards & certifications",
  "Order volumes & packaging requirements",
  "Timeline, Incoterms, and compliance needs",
];

const section2Bullets = [
  "B2B platforms (Alibaba, Made-in-China, Global Sources)",
  "Industry directories & trade shows",
  "Referrals from trusted partners or fulfillment experts",
];

const section3Bullets = [
  "Request business licenses, certifications, and product samples",
  "Conduct factory audits (in-person or virtual)",
  "Check references and track record with global clients",
  "Assess communication speed and professionalism",
];

const related = [
  {
    category: "Logistics",
    title: "Shipping from China: Best Practices for Global Brands",
    desc: "Learn the strategies top brands use to reduce shipping costs and transit times.",
    image: "/images/photo-1494412574643-ff11b0a5c1c3.jpg",
    date: "Apr 28, 2025",
    read: "8 min read",
  },
  {
    category: "Supply Chain",
    title: "How to Improve On-Time Delivery from China",
    desc: "Actionable tips to ensure your orders arrive when your customers need them.",
    image: "/images/photo-1565008447742-97f6f38c985c.jpg",
    date: "Apr 15, 2025",
    read: "6 min read",
  },
  {
    category: "Fulfillment",
    title: "China to US Fulfillment: What to Know in 2025",
    desc: "Key considerations for smooth customs clearance and faster delivery.",
    image: "/images/photo-1605281317010-fe5ffe798166.jpg",
    date: "Mar 30, 2025",
    read: "7 min read",
  },
];

const sidebarRelated = [
  { title: "Shipping from China: Best Practices for Global Brands", date: "Apr 28, 2025", image: "/images/photo-1494412574643-ff11b0a5c1c3.jpg" },
  { title: "How to Improve On-Time Delivery from China", date: "Apr 15, 2025", image: "/images/photo-1565008447742-97f6f38c985c.jpg" },
  { title: "China to US Fulfillment: What to Know in 2025", date: "Mar 30, 2025", image: "/images/photo-1605281317010-fe5ffe798166.jpg" },
];

export default function BlogDetailPage() {
  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-[13px]">
          <Link href="/" className="text-text-muted hover:text-deep-navy">Home</Link>
          <span className="text-text-light">/</span>
          <Link href="/resources" className="text-text-muted hover:text-deep-navy">Resources</Link>
          <span className="text-text-light">/</span>
          <Link href="/blog" className="text-text-muted hover:text-deep-navy">Blog</Link>
          <span className="text-text-light">/</span>
          <span className="text-text-muted truncate">The Ultimate Guide to Vetting Suppliers in China</span>
        </div>
      </section>

      {/* Article Header */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-9">
          <p className="inline-block text-[11px] font-semibold text-teal bg-teal/10 px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            Supplier Management
          </p>
          <h1 className="text-[34px] lg:text-[42px] font-bold text-deep-navy leading-[1.12] max-w-[760px]">
            The Ultimate Guide to Vetting Suppliers in China
          </h1>
          <p className="mt-4 text-[16px] text-text-body leading-relaxed max-w-[680px]">
            Reduce risk, improve product quality, and build long-term partnerships with a proven supplier vetting process built for global brands.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <span
                className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url('${AUTHOR_IMG}')` }}
              />
              <div>
                <p className="text-[14px] font-semibold text-deep-navy">Emily Zhang</p>
                <p className="text-[12px] text-text-muted">Supply Chain Expert at FulfillMesh</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-text-muted"><Calendar className="w-4 h-4" /> May 12, 2025</span>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-text-muted"><Clock3 className="w-4 h-4" /> 10 min read</span>
            <div className="flex items-center gap-2.5 text-text-muted ml-auto">
              <span className="text-[13px] mr-1">Share this article</span>
              <span className="w-8 h-8 rounded-full bg-soft-bg flex items-center justify-center text-text-muted hover:text-action-blue transition-colors cursor-pointer"><LinkedinIcon className="w-4 h-4" /></span>
              <span className="w-8 h-8 rounded-full bg-soft-bg flex items-center justify-center text-text-muted hover:text-action-blue transition-colors cursor-pointer"><TwitterIcon className="w-3.5 h-3.5" /></span>
              <span className="w-8 h-8 rounded-full bg-soft-bg flex items-center justify-center text-text-muted hover:text-action-blue transition-colors cursor-pointer"><FacebookIcon className="w-4 h-4" /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image with floating badges */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-8">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] shadow-card">
            <Image
              src="/images/photo-1581092918056-0c4c3acd3789.jpg"
              alt="Supplier vetting and quality control in China"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/40 to-transparent" />
            <div className="absolute left-6 bottom-6 flex flex-wrap gap-2.5 max-w-[460px]">
              {heroBadges.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-deep-navy shadow-sm">
                  <b.icon className="w-3.5 h-3.5 text-teal" /> {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article Body + Sidebar */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <article className="lg:col-span-2 space-y-10">
            {/* Intro */}
            <div>
              <p className="text-[15px] text-text-body leading-relaxed">
                Finding the right supplier in China can be a game-changer for your business&mdash;unlocking better margins, unique products, and faster growth. But without a structured vetting process, it can also lead to costly mistakes, delays, and quality issues.
              </p>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed">
                This guide walks you through a proven, step-by-step framework to vet suppliers in China with confidence and build partnerships that last.
              </p>
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-teal/5 border border-teal/20 p-5">
                <ShieldCheck className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                <p className="text-[14px] text-text-body leading-relaxed">
                  <span className="font-semibold text-deep-navy">Strong supplier vetting reduces risk and builds a resilient supply chain.</span>{" "}
                  According to our data, brands that follow a structured vetting process see <span className="font-semibold text-teal">47% fewer quality issues</span> and <span className="font-semibold text-teal">32% fewer delays</span>.
                </p>
              </div>
            </div>

            {/* Section 1 */}
            <div id="define-your-requirements" className="grid sm:grid-cols-[1fr_180px] gap-6 items-start">
              <div>
                <h2 className="text-[22px] font-bold text-deep-navy mb-2">1. Define Your Requirements Clearly</h2>
                <p className="text-[14px] text-text-body leading-relaxed mb-4">
                  A clear brief sets the foundation for a successful partnership. Before contacting suppliers, get specific about:
                </p>
                <ul className="space-y-2.5">
                  {section1Bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-text-body">
                      <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" /> {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[14px] text-text-body leading-relaxed">
                  The more detail you provide upfront, the easier it is to filter out suppliers who aren&apos;t the right fit.
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-square hidden sm:block">
                <Image src="/images/photo-1586528116311-ad8dd3c8310d.jpg" alt="Defining supplier requirements" fill sizes="180px" className="object-cover" />
              </div>
            </div>

            {/* Section 2 */}
            <div id="research-shortlist-suppliers" className="grid sm:grid-cols-[1fr_180px] gap-6 items-start">
              <div>
                <h2 className="text-[22px] font-bold text-deep-navy mb-2">2. Research and Shortlist Potential Suppliers</h2>
                <p className="text-[14px] text-text-body leading-relaxed mb-4">
                  Use multiple channels to build a strong supplier list:
                </p>
                <ul className="space-y-2.5">
                  {section2Bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-text-body">
                      <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" /> {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[14px] text-text-body leading-relaxed">
                  Look beyond pricing&mdash;consider experience, specialization, and export capability.
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-square hidden sm:block">
                <Image src="/images/photo-1494412574643-ff11b0a5c1c3.jpg" alt="Researching potential suppliers" fill sizes="180px" className="object-cover" />
              </div>
            </div>

            {/* Section 3 */}
            <div id="evaluate-and-verify" className="grid sm:grid-cols-[1fr_180px] gap-6 items-start">
              <div>
                <h2 className="text-[22px] font-bold text-deep-navy mb-2">3. Evaluate and Verify</h2>
                <p className="text-[14px] text-text-body leading-relaxed mb-4">
                  Dig deep into each supplier&apos;s capabilities and reliability:
                </p>
                <ul className="space-y-2.5">
                  {section3Bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-text-body">
                      <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" /> {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[14px] text-text-body leading-relaxed">
                  A thorough evaluation now prevents expensive problems later.
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-square hidden sm:block">
                <Image src="/images/photo-1565008447742-97f6f38c985c.jpg" alt="Evaluating and verifying suppliers" fill sizes="180px" className="object-cover" />
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* TOC */}
            <div className="rounded-2xl border border-border-soft p-6 sticky top-6">
              <p className="text-[12px] font-bold text-text-muted uppercase tracking-wide mb-4">On This Page</p>
              <ol className="space-y-1">
                {tocItems.map((item, i) => (
                  <li key={i}>
                    <a
                      href={`#${item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                      className={`flex gap-2.5 text-[13px] py-1.5 transition-colors ${
                        i === 0 ? "text-action-blue font-medium" : "text-text-body hover:text-action-blue"
                      }`}
                    >
                      <span className="text-action-blue font-bold w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span className="leading-snug">{item}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Author Card */}
            <div className="rounded-2xl border border-border-soft p-6">
              <p className="text-[12px] font-bold text-text-muted uppercase tracking-wide mb-4">About the Author</p>
              <div className="flex items-center gap-3">
                <span
                  className="w-11 h-11 rounded-full bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url('${AUTHOR_IMG}')` }}
                />
                <div>
                  <p className="text-[14px] font-semibold text-deep-navy">Emily Zhang</p>
                  <p className="text-[12px] text-text-muted">Supply Chain Expert</p>
                </div>
              </div>
              <p className="mt-4 text-[13px] text-text-body leading-relaxed">
                Emily helps global brands build smarter, more resilient supply chains. With 10+ years of experience in China sourcing and logistics, she shares practical insights to help businesses grow with confidence.
              </p>
              <Link href="/blog" className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-action-blue hover:underline">
                View all articles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Related Resources */}
            <div className="rounded-2xl border border-border-soft p-6">
              <p className="text-[14px] font-bold text-deep-navy mb-4">Related Resources</p>
              <div className="space-y-4">
                {sidebarRelated.map((r, i) => (
                  <Link key={i} href="/blog/shipping-from-china" className="flex items-start gap-3 group">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-soft-bg">
                      <Image src={r.image} alt={r.title} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-deep-navy group-hover:text-action-blue leading-snug transition-colors">{r.title}</p>
                      <p className="text-[11px] text-text-muted mt-1">{r.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-action-blue hover:underline">
                View all articles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pb-12">
          <div className="rounded-2xl bg-deep-navy px-8 py-7 flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[20px] font-bold text-white">Build a Smarter, Safer Supply Chain</h3>
              <p className="mt-1 text-[14px] text-white/70">FulfillMesh helps brands vet suppliers, ensure quality, and streamline fulfillment from China to the world.</p>
            </div>
            <Link href="/book-a-demo" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] gradient-cta text-white text-[14px] font-semibold hover:shadow-button transition-all shrink-0">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="bg-white border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <h2 className="text-[24px] font-bold text-deep-navy mb-6">Related Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((a, i) => (
              <Link
                key={i}
                href="/blog/shipping-from-china"
                className="group rounded-2xl border border-border-soft bg-white overflow-hidden hover:shadow-card transition-all flex flex-col"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-deep-navy">
                  <Image src={a.image} alt={a.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="self-start text-[11px] font-semibold text-action-blue uppercase tracking-wide mb-2">
                    {a.category}
                  </span>
                  <h3 className="font-bold text-deep-navy group-hover:text-action-blue leading-snug text-[16px]">{a.title}</h3>
                  <p className="mt-2 text-[13px] text-text-body leading-relaxed">{a.desc}</p>
                  <div className="mt-auto pt-4 text-[12px] text-text-muted">
                    {a.date} · {a.read}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="rounded-2xl bg-teal/5 border border-teal/20 p-7 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-11 h-11 rounded-xl bg-white border border-border-soft flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-teal" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-deep-navy">Stay ahead with insights that move your supply chain forward</h3>
                <p className="mt-1 text-[13px] text-text-body">Get expert tips, industry updates, and FulfillMesh resources delivered to your inbox.</p>
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-60 px-4 py-3 rounded-lg border border-border-soft bg-white text-[14px] placeholder:text-text-light focus:outline-none focus:border-action-blue"
              />
              <button className="px-6 py-3 rounded-lg bg-navy text-white text-[14px] font-semibold hover:bg-deep-navy transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
