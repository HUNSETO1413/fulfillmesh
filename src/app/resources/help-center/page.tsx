import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Search,
  BookOpen,
  Truck,
  Warehouse,
  CreditCard,
  Puzzle,
  UserCog,
  RotateCcw,
  Code2,
  Activity,
  Calculator,
  FileBadge,
  ShieldCheck,
  Sparkles,
  Headphones,
  Check,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Help Center: Guides, FAQs & Support",
  description:
    "Get answers on getting started, orders and shipments, warehousing, billing, integrations, and returns — plus how-to articles to help you scale with FulfillMesh.",
  path: "/resources/help-center",
  keywords: [
    "FulfillMesh help center",
    "fulfillment support",
    "shipping FAQ",
    "order management help",
    "integration guides",
  ],
});

const popularTags = ["Supplier Vetting", "Shipping Rates", "Customs & Compliance", "API Integration"];

const categories = [
  { icon: BookOpen, title: "Getting Started", desc: "New to FulfillMesh? Learn the basics and set up your account with confidence." },
  { icon: Truck, title: "Orders & Shipments", desc: "Manage orders, shipping methods, tracking, and delivery updates." },
  { icon: Warehouse, title: "Warehousing", desc: "Inventory storage, stock management, and fulfillment operations." },
  { icon: CreditCard, title: "Billing", desc: "Understand pricing, invoices, payments, and billing management." },
  { icon: Puzzle, title: "Integrations", desc: "Connect FulfillMesh with your store, tools, and third-party platforms." },
  { icon: UserCog, title: "Account Settings", desc: "Manage your profile, users, notification preferences." },
  { icon: RotateCcw, title: "Returns", desc: "Handle returns, refunds, and reverse logistics with ease." },
  { icon: Code2, title: "API & Developers", desc: "API documentation, guides, and references for developers and integrators." },
];

const popularArticles = [
  { category: "Shipping", title: "China–US Shipping Update: Rates, Capacity & Trends", desc: "Key updates on shipping rates, capacity constraints, and what to expect in Q2 2025.", date: "May 12, 2025", read: "6 min read", image: "/images/photo-1494412574643-ff11b0a5c1c3.jpg" },
  { category: "Guide", title: "The Ultimate Supplier Vetting Checklist", desc: "A step-by-step checklist to help you evaluate Chinese suppliers with confidence.", date: "May 8, 2025", read: "7 min read", image: "/images/photo-1450101499163-c8848c66ca85.jpg" },
  { category: "Case Study", title: "How Peak Supplies Cut Lead Time by 40%", desc: "See how Peak Supplies optimized inventory planning and shipping routes to scale faster.", date: "May 5, 2025", read: "5 min read", image: "/images/photo-1553413077-190dd305871c.jpg" },
  { category: "Blog", title: "Sustainable Fulfillment: What It Means in 2025", desc: "Practical ways e-commerce brands can reduce emissions and build resilient supply chains.", date: "Apr 30, 2025", read: "4 min read", image: "/images/photo-1542601906990-b4d3fb778b09.jpg" },
];

const faqs = [
  "How do I get started with FulfillMesh?",
  "Where are your warehouses located?",
  "How long does shipping take?",
  "How are shipping costs calculated?",
  "What payment methods do you accept?",
];

const quickLinks = [
  { icon: Activity, title: "System Status", desc: "Check uptime and incidents", badge: "Operational" },
  { icon: Calculator, title: "Shipping Rates Calculator", desc: "Estimate costs in real time" },
  { icon: FileBadge, title: "Incoterms Explained", desc: "Learn FOB, EXW, DDP & more" },
  { icon: ShieldCheck, title: "Compliance & Customs", desc: "Documents, duties, and regulations" },
  { icon: Sparkles, title: "Feature Updates", desc: "See what's new at FulfillMesh" },
];

export default function HelpCenterPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 pt-6 pb-14">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-navy">Home</Link>
            <ChevronRight className="w-3 h-3 text-text-light" />
            <Link href="/resources" className="hover:text-navy">Resources</Link>
            <ChevronRight className="w-3 h-3 text-text-light" />
            <span className="text-text-primary font-medium">Help Center</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl lg:text-[52px] font-bold leading-[1.1] text-deep-navy">Help Center</h1>
              <p className="mt-5 text-lg text-text-body leading-relaxed max-w-[480px]">
                Find guides, articles, and answers to help you streamline fulfillment in China and grow your business globally.
              </p>
              <div className="mt-7 flex items-center gap-3 max-w-[520px] px-5 py-4 rounded-full border border-border-soft bg-white shadow-card">
                <Search className="w-5 h-5 text-text-light shrink-0" />
                <input
                  type="text"
                  placeholder="Search help articles, topics, or keywords..."
                  className="w-full bg-transparent text-sm text-text-body placeholder:text-text-light focus:outline-none"
                />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">Popular:</span>
                {popularTags.map((t) => (
                  <span key={t} className="text-xs font-medium text-navy bg-soft-bg border border-border-soft px-3 py-1.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:flex items-center justify-center min-h-[340px]">
              <svg viewBox="0 0 500 340" className="w-full h-full" fill="none">
                {/* orbit rings */}
                <g stroke="#003B7A" strokeWidth="0.8" opacity="0.12">
                  <circle cx="250" cy="170" r="150" />
                  <ellipse cx="250" cy="170" rx="150" ry="70" />
                  <ellipse cx="250" cy="170" rx="95" ry="150" />
                </g>
                {/* connecting lines from hub to nodes */}
                <g stroke="#00B894" strokeWidth="1" opacity="0.4">
                  <line x1="250" y1="170" x2="90" y2="60" />
                  <line x1="250" y1="170" x2="420" y2="70" />
                  <line x1="250" y1="170" x2="70" y2="190" />
                  <line x1="250" y1="170" x2="440" y2="200" />
                  <line x1="250" y1="170" x2="110" y2="290" />
                  <line x1="250" y1="170" x2="400" y2="300" />
                  <line x1="250" y1="170" x2="250" y2="40" />
                </g>
                {/* inter-node links */}
                <g stroke="#0057D8" strokeWidth="0.8" opacity="0.25">
                  <line x1="90" y1="60" x2="250" y2="40" />
                  <line x1="420" y1="70" x2="440" y2="200" />
                  <line x1="70" y1="190" x2="110" y2="290" />
                  <line x1="400" y1="300" x2="110" y2="290" />
                </g>
                {/* outer nodes */}
                <g>
                  <circle cx="90" cy="60" r="6" fill="#00B894" />
                  <circle cx="420" cy="70" r="6" fill="#0057D8" />
                  <circle cx="70" cy="190" r="5" fill="#0057D8" />
                  <circle cx="440" cy="200" r="6" fill="#00B894" />
                  <circle cx="110" cy="290" r="6" fill="#0057D8" />
                  <circle cx="400" cy="300" r="5" fill="#00B894" />
                  <circle cx="250" cy="40" r="5" fill="#00B894" />
                </g>
              </svg>
              <div className="absolute z-10 w-20 h-20 rounded-full gradient-logo flex items-center justify-center text-white font-bold text-xl shadow-card">
                FM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by category */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-navy">Browse help by category</h2>
            <Link href="/resources/help-center" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((c, i) => (
              <Link
                key={i}
                href="/resources/help-center/getting-started"
                className="group flex flex-col p-6 rounded-2xl border border-border-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-soft-bg flex items-center justify-center mb-4">
                  <c.icon className="w-5 h-5 text-action-blue" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{c.title}</h3>
                <p className="text-xs text-text-body leading-relaxed flex-1">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-action-blue">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular articles */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pb-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy">Popular articles</h2>
            <Link href="/resources/help-center" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularArticles.map((a, i) => (
              <Link
                key={i}
                href="/resources/help-center/getting-started"
                className="group rounded-2xl border border-border-soft overflow-hidden hover:shadow-card transition-all flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-soft-bg">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="self-start text-[11px] font-semibold text-action-blue bg-action-blue/8 px-2.5 py-1 rounded-full mb-3">{a.category}</span>
                  <h3 className="font-semibold text-deep-navy group-hover:text-action-blue leading-snug">{a.title}</h3>
                  <p className="mt-2 text-xs text-text-body leading-relaxed flex-1">{a.desc}</p>
                  <p className="mt-4 flex items-center gap-2 text-[11px] text-text-muted">
                    <span>{a.date}</span>
                    <span className="w-1 h-1 rounded-full bg-text-light" />
                    <span>{a.read}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + Quick links + Still need help */}
      <section className="bg-soft-bg border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-14 grid lg:grid-cols-3 gap-8">
          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-navy mb-5">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqs.map((q, i) => (
                <details key={i} className="group rounded-xl border border-border-soft bg-white overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <span className="text-sm font-medium text-text-primary pr-4">{q}</span>
                    <ChevronDown className="w-4 h-4 text-text-muted shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4 -mt-1">
                    <p className="text-sm text-text-body leading-relaxed">
                      Our support team and detailed documentation cover this topic in full. Reach out anytime for personalized assistance.
                    </p>
                  </div>
                </details>
              ))}
            </div>
            <Link href="/resources/help-center" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
              View all FAQs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-xl font-bold text-navy mb-5">Quick links</h2>
            <div className="space-y-3">
              {quickLinks.map((l, i) => (
                <Link key={i} href="/resources" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border-soft hover:shadow-soft transition-all">
                  <div className="w-9 h-9 rounded-lg bg-soft-bg flex items-center justify-center shrink-0">
                    <l.icon className="w-4 h-4 text-action-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-deep-navy flex items-center gap-2">
                      {l.title}
                      {l.badge && <span className="text-[10px] font-medium text-teal bg-teal/10 px-2 py-0.5 rounded-full">{l.badge}</span>}
                    </p>
                    <p className="text-xs text-text-muted">{l.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/resources" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
              View all resources <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Still need help */}
          <div>
            <div className="rounded-2xl gradient-dark-hero text-white p-6">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Headphones className="w-5 h-5 text-teal" />
              </div>
              <h3 className="text-lg font-bold">Still need help?</h3>
              <p className="mt-2 text-sm text-text-on-dark-muted">
                Our support team is here for you. Get personalized assistance from a real person.
              </p>
              <Link href="/contact" className="mt-5 block text-center py-3 rounded-lg gradient-cta text-white text-sm font-semibold hover:shadow-button transition-all">
                Contact Support
              </Link>
              <p className="my-3 text-center text-xs text-text-on-dark-muted">or</p>
              <Link href="/book-a-demo" className="block text-center py-3 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                Book a Help Session
              </Link>
            </div>
            <ul className="mt-5 space-y-3">
              {[
                "Average response in 1–2 hours",
                "Expert support, every step of the way",
                "Available Monday–Friday, 9AM–6PM (UTC+8)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-body">
                  <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
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
