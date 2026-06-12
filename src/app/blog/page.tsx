import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Search, ArrowRight, User,
} from "lucide-react";
import FinalCTA from "@/components/FinalCTA";
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

const topics = ["All", "Logistics", "Technology", "Sustainability", "Operations"];

const articles = [
  {
    category: "Fulfillment",
    title: "The Future of Last-Mile Delivery: Trends to Watch",
    desc: "Explore emerging trends in last-mile delivery, including autonomous vehicles and same-day shipping.",
    author: "Sarah Chen",
    date: "June 10, 2024",
    read: "5 min read",
    image: "/images/photo-1578575437130-527eed3abbec.jpg",
  },
  {
    category: "Technology",
    title: "How AI is Transforming Supply Chain Visibility",
    desc: "Discover how artificial intelligence is improving real-time tracking and decision-making.",
    author: "Michael Park",
    date: "June 8, 2024",
    read: "4 min read",
    image: "/images/photo-1551288049-bebda4e38f71.jpg",
  },
  {
    category: "Sustainability",
    title: "Sustainable Packaging: Balancing Cost and Eco-Friendliness",
    desc: "Learn how to adopt sustainable packaging without compromising on quality or budget.",
    author: "Emma Liu",
    date: "June 5, 2024",
    read: "6 min read",
    image: "/images/photo-1607344645866-009c320b63e0.jpg",
  },
];

export default function BlogPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-8 pt-12 pb-8">
          <div className="max-w-[640px]">
            <span className="inline-block text-[11px] font-semibold tracking-wide text-white bg-action-blue rounded-[20px] px-3 py-1 uppercase">
              Insights
            </span>
            <h1 className="mt-4 text-[32px] font-bold text-deep-navy leading-[1.2] tracking-tight">
              Insights to build a smarter supply chain
            </h1>
            <p className="mt-3 text-[15px] text-text-body leading-[1.6]">
              Discover expert analysis and practical strategies to optimize your supply chain operations
            </p>
            <div className="mt-6 flex max-w-[380px]">
              <div className="flex-1 flex items-center px-3 py-2 rounded-l-[4px] border border-border-soft bg-white">
                <Search className="w-4 h-4 text-text-light shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full bg-transparent text-[13px] text-text-body placeholder:text-text-light focus:outline-none"
                />
              </div>
              <button className="px-4 py-2 text-[13px] font-semibold text-white bg-action-blue rounded-r-[4px] hover:bg-action-blue/90 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-white border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-8 py-3 flex flex-wrap gap-2">
          {topics.map((t, i) => (
            <button
              key={t}
              className={`text-[12px] font-medium rounded-full px-4 py-2 transition-all ${
                i === 0
                  ? "bg-action-blue text-white shadow-sm"
                  : "bg-soft-bg text-text-body hover:bg-border-soft"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Article grid - 3 cards */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-bold text-deep-navy">Latest articles</h2>
            <Link href="/blog" className="text-[13px] font-medium text-action-blue hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a, i) => (
              <Link
                key={i}
                href="/blog/sample-post"
                className="group rounded-lg overflow-hidden bg-white hover:shadow-card transition-all"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover"
                  />
                  <span className="absolute top-3 right-3 z-10 text-[10px] font-semibold text-white bg-action-blue rounded-[20px] px-2.5 py-0.5 uppercase">
                    {a.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-bold text-deep-navy leading-[1.3]">{a.title}</h3>
                  <p className="mt-1.5 text-[13px] text-text-body leading-[1.5] line-clamp-2">{a.desc}</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-text-muted">
                    <span className="inline-flex items-center gap-1"><User className="w-3 h-3" />{a.author}</span>
                    <span className="w-1 h-1 rounded-full bg-text-muted/40" />
                    <span>{a.date}</span>
                    <span className="w-1 h-1 rounded-full bg-text-muted/40" />
                    <span>{a.read}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <div
            className="rounded-lg text-white p-8 text-center"
            style={{ background: "linear-gradient(135deg, #0056B3 0%, #003D7A 100%)" }}
          >
            <h3 className="text-[20px] font-bold">Stay updated with our latest insights</h3>
            <p className="mt-2 text-[14px] text-white/80 leading-[1.6] max-w-[440px] mx-auto">
              Subscribe to our newsletter and get exclusive content delivered to your inbox every week.
            </p>
            <div className="mt-5 max-w-[360px] mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-[4px] border-none bg-white px-4 py-2.5 text-[13px] text-deep-navy placeholder:text-text-muted focus:outline-none"
              />
              <button className="px-5 py-2.5 text-[13px] font-semibold bg-white text-action-blue rounded-[4px] hover:bg-soft-bg transition-all">
                Subscribe
              </button>
            </div>
            <p className="mt-3 text-[11px] text-text-on-dark-muted">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <FinalCTA
        headline="Ready to transform your supply chain?"
        subtitle="Contact our experts to learn how we can help you build a more efficient and resilient supply chain."
        primaryText="Get Started"
        secondaryText="Learn More"
      />
    </main>
  );
}
