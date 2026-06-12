import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  Calendar,
  Clock,
  Truck,
  PackageCheck,
  Warehouse,
  Box,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog: Supply Chain & E-commerce Fulfillment Insights",
  description:
    "Expert analysis and practical strategies on logistics, last-mile delivery, sustainable packaging, and AI-driven supply chain visibility for e-commerce brands.",
  path: "/blog",
  keywords: [
    "supply chain blog",
    "e-commerce fulfillment",
    "last-mile delivery",
    "logistics insights",
    "sustainable packaging",
  ],
});

const filters = [
  "All Topics",
  "Supplier Vetting",
  "Shipping",
  "Warehousing",
  "Packaging",
  "QC",
  "Growth",
];

const exploreTopics = [
  { label: "Supplier Vetting", icon: ShieldCheck },
  { label: "Shipping & Logistics", icon: Truck },
  { label: "Warehousing", icon: Warehouse },
  { label: "Packaging & Labeling", icon: Box },
  { label: "Quality Control", icon: PackageCheck },
  { label: "Growth & Scaling", icon: TrendingUp },
];

const articles = [
  {
    category: "Supplier Vetting",
    title: "How to Vet Suppliers in China: A Step-by-Step Framework",
    desc: "A practical checklist to help you evaluate, qualify, and build long-term relationships with reliable manufacturers.",
    date: "May 8, 2025",
    read: "6 min read",
    image: "/images/photo-1566576721346-d4a3b4eaeb55.jpg",
  },
  {
    category: "Shipping & Logistics",
    title: "Ocean vs. Air Freight: How to Choose the Right Option",
    desc: "Compare costs, speed, and reliability to determine the best shipping strategy for your business.",
    date: "May 6, 2025",
    read: "5 min read",
    image: "/images/photo-1578575437130-527eed3abbec.jpg",
  },
  {
    category: "Warehousing",
    title: "The Ultimate Guide to 3PL Warehousing in 2025",
    desc: "Explore the benefits of 3PL warehousing and how the right partner can improve speed, accuracy, and scale.",
    date: "May 4, 2025",
    read: "7 min read",
    image: "/images/photo-1586528116311-ad8dd3c8310d.jpg",
  },
  {
    category: "Packaging & Labeling",
    title: "Packaging That Delivers: Best Practices for E-commerce Brands",
    desc: "Design packaging that protects your products, delights customers, and strengthens your brand.",
    date: "May 2, 2025",
    read: "4 min read",
    image: "/images/photo-1607344645866-009c320b63e0.jpg",
  },
  {
    category: "Quality Control",
    title: "Quality Control Checklist for Importing from China",
    desc: "Ensure product quality at every stage with this essential QC checklist used by top brands and importers.",
    date: "Apr 30, 2025",
    read: "6 min read",
    image: "/images/photo-1551288049-bebda4e38f71.jpg",
  },
  {
    category: "Growth & Scaling",
    title: "Scaling Your E-commerce Brand Without Supply Chain Bottlenecks",
    desc: "Key strategies to streamline operations, improve visibility, and scale profitably across new markets.",
    date: "Apr 28, 2025",
    read: "5 min read",
    image: "/images/photo-1602143407151-7111542de6e8.jpg",
  },
];

const ctaPerks = ["Free to get started", "No obligations", "Personalized matches"];

export default function BlogPage() {
  return (
    <main className="bg-white">
      {/* ===== Hero ===== */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-10 flex items-center justify-between gap-10">
          <div className="max-w-[560px]">
            <span className="text-[12px] font-semibold tracking-[0.08em] text-teal uppercase">
              Resource Center
            </span>
            <h1 className="mt-3 text-[42px] font-bold text-deep-navy leading-[1.15] tracking-[-0.02em]">
              Insights to build a <br className="hidden sm:block" />smarter{" "}
              <span className="text-teal">supply chain</span>
            </h1>
            <p className="mt-4 text-[17px] text-text-body leading-[1.6]">
              Expert guidance, industry trends, and practical strategies to help
              you source better, ship faster, and grow with confidence.
            </p>
          </div>
          {/* World-map illustration */}
          <div className="hidden md:block shrink-0 relative w-[360px] h-[200px]">
            <svg
              viewBox="0 0 360 200"
              fill="none"
              className="w-full h-full"
              aria-hidden
            >
              <g stroke="#D9E5F2" strokeWidth="1.2">
                <path d="M30 70 Q60 50 90 68 T150 72" />
                <path d="M170 40 Q210 30 250 52 T330 50" />
                <path d="M40 120 Q90 100 140 124 T240 118" />
                <path d="M210 150 Q260 140 300 158 T350 150" />
              </g>
              <g fill="#D9E5F2">
                <circle cx="60" cy="58" r="3" />
                <circle cx="120" cy="72" r="3" />
                <circle cx="210" cy="40" r="3" />
                <circle cx="300" cy="54" r="3" />
                <circle cx="90" cy="110" r="3" />
                <circle cx="250" cy="120" r="3" />
                <circle cx="310" cy="156" r="3" />
              </g>
              <g stroke="#0057D8" strokeWidth="1.4" strokeDasharray="4 4" fill="none">
                <path d="M180 100 C140 70 100 60 60 58" />
                <path d="M180 100 C220 60 270 56 300 54" />
                <path d="M180 100 C150 140 120 150 90 110" />
                <path d="M180 100 C230 130 280 150 310 156" />
              </g>
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full gradient-logo flex items-center justify-center shadow-button">
              <span className="text-white font-bold text-base">FM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Search + filter pills ===== */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center w-full rounded-full border border-border-soft bg-white px-5 py-3 shadow-soft">
            <Search className="w-4 h-4 text-text-light shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              className="w-full bg-transparent text-[14px] text-text-body placeholder:text-text-light focus:outline-none"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {filters.map((f, i) => (
              <button
                key={f}
                className={`text-[13px] font-medium rounded-full px-4 py-2 transition-all ${
                  i === 0
                    ? "bg-deep-navy text-white"
                    : "bg-white border border-border-soft text-text-body hover:border-border-blue hover:text-deep-navy"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Featured + sidebar ===== */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-10 flex flex-col lg:flex-row gap-6">
          {/* Featured card */}
          <article className="flex-1 min-w-0 rounded-xl border border-border-soft bg-white shadow-card overflow-hidden flex flex-col sm:flex-row">
            <div className="relative sm:w-[44%] aspect-[16/10] sm:aspect-auto sm:min-h-[260px]">
              <Image
                src="/images/photo-1494412574643-ff11b0a5c1c3.jpg"
                alt="Building resilient supply chains"
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover"
              />
              <span className="absolute top-4 left-4 text-[10px] font-semibold tracking-wide text-deep-navy bg-white/90 rounded-full px-3 py-1 uppercase">
                Featured
              </span>
            </div>
            <div className="p-7 flex flex-col justify-center sm:w-[56%]">
              <span className="text-[11px] font-semibold tracking-[0.06em] text-action-blue uppercase">
                Supply Chain Strategy
              </span>
              <h2 className="mt-2 text-[22px] font-bold text-deep-navy leading-[1.25]">
                Building Resilient Supply Chains in an Uncertain World
              </h2>
              <p className="mt-3 text-[14px] text-text-body leading-[1.6]">
                From geopolitical shifts to demand volatility, learn how leading
                brands are building resilient, agile supply chains that can adapt
                and thrive in any environment.
              </p>
              <div className="mt-4 flex items-center gap-4 text-[12px] text-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> May 10, 2025
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 8 min read
                </span>
              </div>
              <Link
                href="/blog/sample-post"
                className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-action-blue hover:gap-2.5 transition-all"
              >
                Read full article <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* Right column: Explore Topics + Newsletter */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="rounded-xl border border-border-soft bg-white shadow-card p-6">
              <h3 className="text-[16px] font-bold text-deep-navy">Explore Topics</h3>
              <ul className="mt-4 divide-y divide-border-soft">
                {exploreTopics.map(({ label, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href="/blog"
                      className="group flex items-center justify-between py-3 text-[14px] text-text-body hover:text-deep-navy transition-colors"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-action-blue" />
                        {label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-light group-hover:text-action-blue group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-action-blue hover:gap-2.5 transition-all"
              >
                View all topics <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="rounded-xl border border-border-soft bg-white shadow-card p-6">
              <h3 className="text-[16px] font-bold text-deep-navy">Stay in the loop</h3>
              <p className="mt-2 text-[13px] text-text-body leading-[1.55]">
                Get the latest insights, updates, and tips on fulfillment and
                e-commerce.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-4 w-full rounded-lg border border-border-soft bg-white px-3.5 py-2.5 text-[13px] text-deep-navy placeholder:text-text-light focus:outline-none focus:border-border-blue"
              />
              <button className="mt-3 w-full rounded-lg bg-deep-navy px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-navy transition-colors">
                Subscribe
              </button>
              <p className="mt-2.5 text-[11px] text-text-light text-center">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ===== Article grid ===== */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a, i) => (
              <Link
                key={i}
                href="/blog/sample-post"
                className="group rounded-xl border border-border-soft bg-white overflow-hidden hover:shadow-card transition-all"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 380px"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-semibold tracking-[0.06em] text-action-blue uppercase">
                    {a.category}
                  </span>
                  <h3 className="mt-2 text-[16px] font-bold text-deep-navy leading-[1.3]">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-text-body leading-[1.55] line-clamp-2">
                    {a.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-[12px] text-text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {a.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {a.read}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button className="rounded-lg border border-border-blue bg-white px-6 py-2.5 text-[14px] font-semibold text-deep-navy hover:bg-soft-bg transition-colors">
              Load more articles
            </button>
          </div>
        </div>
      </section>

      {/* ===== CTA banner ===== */}
      <section className="bg-white pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="rounded-2xl bg-deep-navy px-8 py-12 text-center">
            <h2 className="text-[26px] font-bold text-white leading-[1.25]">
              Ready to streamline your fulfillment operations?
            </h2>
            <p className="mt-2 text-[15px] text-text-on-dark-muted">
              Let&apos;s build a smarter, more reliable supply chain together.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all"
              >
                Find My Match <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/book-a-demo"
                className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold bg-white text-deep-navy rounded-lg hover:shadow-soft transition-all"
              >
                Book a Demo
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
              {ctaPerks.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 text-[12px] text-text-on-dark-muted"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
