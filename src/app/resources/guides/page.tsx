import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Search,
  Users,
  Boxes,
  Truck,
  Warehouse,
  Package,
  BadgeCheck,
  BarChart3,
  Mail,
  ClipboardList,
  CheckCircle2,
  Check,
  ChevronRight,
} from "lucide-react";

const featuredImage =
  "/images/photo-1454165804606-c3d57bc86b40.jpg";

const popularTopics = ["Supplier Vetting", "Inventory", "Shipping", "Warehousing", "Packaging", "Quality Control", "Analytics"];

const categories = [
  { icon: Users, title: "Sourcing & Suppliers", desc: "Find, evaluate, and manage suppliers to build reliable, high-performing partnerships." },
  { icon: Boxes, title: "Inventory Management", desc: "Optimize stock levels, improve forecasting, and reduce inventory costs." },
  { icon: Truck, title: "Shipping & Logistics", desc: "Compare shipping options, manage carriers, and streamline deliveries." },
  { icon: Warehouse, title: "Warehousing", desc: "Improve storage, fulfillment workflows, and warehouse performance." },
  { icon: Package, title: "Packaging", desc: "Choose the right packaging to protect products and delight customers." },
  { icon: BadgeCheck, title: "Quality Control", desc: "Implement quality checks and ensure consistent product standards." },
  { icon: BarChart3, title: "Analytics & Reporting", desc: "Turn data into insights and make better decisions and drive growth." },
];

const featuredChecklist = [
  { title: "Reduce supplier risk", desc: "Vet suppliers more thoroughly and consistently." },
  { title: "Ensure compliance", desc: "Meet quality, legal, and ethical standards." },
  { title: "Save time & costs", desc: "Avoid costly mistakes and rework." },
];

const guides = [
  { category: "Shipping & Logistics", title: "China–US Shipping Update: Rates, Capacity & Trends", desc: "Key updates on shipping rates, capacity constraints, and what to expect in Q2 2025.", date: "May 12, 2025", read: "6 min read", image: "/images/photo-1494412519320-aa613dfb7738.jpg" },
  { category: "Inventory Management", title: "How to Improve Inventory Forecasting Accuracy", desc: "Proven techniques to forecast demand more accurately and reduce stockouts and overstock.", date: "May 8, 2025", read: "7 min read", image: "/images/photo-1553413077-190dd305871c.jpg" },
  { category: "Packaging", title: "Choosing the Right Packaging for Your Product", desc: "A practical guide to selecting packaging that protects your product and strengthens your brand.", date: "May 5, 2025", read: "5 min read", image: "/images/photo-1607344645866-009c320b63e0.jpg" },
  { category: "Warehousing", title: "Best Practices for Efficient Warehouse Operations", desc: "Optimize layouts, workflows, and technology to improve productivity and accuracy.", date: "Apr 30, 2025", read: "6 min read", image: "/images/photo-1586528116311-ad8dd3c8310d.jpg" },
  { category: "Quality Control", title: "A Complete Guide to Quality Control in Manufacturing", desc: "Key quality control steps, inspections, and standards to ensure consistent product quality.", date: "Apr 28, 2025", read: "8 min read", image: "/images/photo-1581092160562-40aa08e78837.jpg" },
  { category: "Analytics & Reporting", title: "Supply Chain KPIs That Drive Growth", desc: "The most important KPIs to track performance, reduce costs, and scale your business.", date: "Apr 25, 2025", read: "4 min read", image: "/images/photo-1551288049-bebda4e38f71.jpg" },
];

const downloads = [
  "Supplier Evaluation Checklist",
  "Inventory Reorder Template",
  "Shipping Cost Calculator",
  "Warehouse Layout Template",
  "Quality Inspection Checklist",
];

export default function GuidesPage() {
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
            <span className="text-text-primary font-medium">Guides</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-block text-xs font-semibold text-teal bg-teal/8 px-3 py-1.5 rounded-full uppercase tracking-wide mb-5">
                Resource Hub
              </p>
              <h1 className="text-4xl lg:text-[52px] font-bold leading-[1.1] text-deep-navy">
                Guides to help you <br />
                operate <span className="text-teal">smarter</span>
              </h1>
              <p className="mt-5 text-lg text-text-body leading-relaxed max-w-[520px]">
                Step-by-step guides, best practices, and expert advice to optimise your supply chain and grow with confidence.
              </p>
              <div className="mt-7 flex items-center gap-3 max-w-[520px] px-5 py-4 rounded-full border border-border-soft bg-white shadow-card">
                <Search className="w-5 h-5 text-text-light shrink-0" />
                <input
                  type="text"
                  placeholder="Search guides, topics or keywords..."
                  className="w-full bg-transparent text-sm text-text-body placeholder:text-text-light focus:outline-none"
                />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">Popular:</span>
                {popularTopics.map((t) => (
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

      {/* Browse guides by category */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-navy">Browse guides by category</h2>
            <Link href="/resources/guides" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((c, i) => (
              <Link
                key={i}
                href="/resources/guides/supplier-vetting"
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

      {/* Featured Guide */}
      <section className="bg-soft-bg border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-block text-xs font-semibold text-teal bg-teal/10 px-3 py-1.5 rounded-full uppercase tracking-wide mb-5">
                Featured Guide
              </p>
              <h2 className="text-3xl lg:text-[34px] font-bold text-deep-navy leading-tight">
                The Ultimate Supplier Vetting Checklist
              </h2>
              <p className="mt-5 text-text-body leading-relaxed">
                A step-by-step checklist to help you evaluate Chinese suppliers with confidence. Reduce risk, ensure compliance, and build stronger partnerships.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Link
                  href="/resources/guides/supplier-vetting"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
                >
                  Read the full guide <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/resources/guides" className="inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
                  View all sourcing &amp; suppliers guides <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-[1.7fr_1fr] gap-5 items-stretch">
              <div className="relative rounded-2xl overflow-hidden min-h-[280px] shadow-card">
                <Image
                  src={featuredImage}
                  alt="The Ultimate Supplier Vetting Checklist"
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="object-cover"
                />
              </div>
              <div className="rounded-2xl bg-white border border-border-soft p-5 shadow-soft flex flex-col justify-center">
                <div className="divide-y divide-border-soft">
                  {featuredChecklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-3 first:pt-0">
                      <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-deep-navy">{item.title}</p>
                        <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All guides */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy">All guides</h2>
            <Link href="/resources/guides" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all guides <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((g, i) => (
              <Link
                key={i}
                href="/resources/guides/supplier-vetting"
                className="group rounded-2xl border border-border-soft overflow-hidden hover:shadow-card transition-all flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-soft-bg">
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="self-start text-[11px] font-semibold text-action-blue bg-action-blue/8 px-2.5 py-1 rounded-full mb-3">
                    {g.category}
                  </span>
                  <h3 className="font-semibold text-deep-navy group-hover:text-action-blue leading-snug">{g.title}</h3>
                  <p className="mt-2 text-xs text-text-body leading-relaxed flex-1">{g.desc}</p>
                  <p className="mt-4 flex items-center gap-2 text-[11px] text-text-muted">
                    <span>{g.date}</span>
                    <span className="w-1 h-1 rounded-full bg-text-light" />
                    <span>{g.read}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Newsletter */}
      <section className="bg-white border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Tools & templates */}
            <div className="rounded-2xl bg-soft-bg border border-border-soft p-7">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-border-soft flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-deep-navy">Tools &amp; templates</h3>
                  <p className="mt-1 text-sm text-text-body">Download ready-to-use resources to streamline your operations.</p>
                </div>
              </div>
              <ul className="mt-5 grid sm:grid-cols-2 gap-3">
                {downloads.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
              <Link href="/resources" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
                View all downloads <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {/* Newsletter */}
            <div className="rounded-2xl bg-soft-bg border border-border-soft p-7">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-border-soft flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-action-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-deep-navy">Stay ahead with insights</h3>
                  <p className="mt-1 text-sm text-text-body">Get the latest guides, expert tips, and industry updates delivered straight to your inbox.</p>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-border-soft bg-white text-sm text-text-body placeholder:text-text-light focus:outline-none focus:border-action-blue"
                />
                <button className="px-6 py-3 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-deep-navy transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="mt-3 text-xs text-text-muted">We respect your privacy. Unsubscribe anytime.</p>
            </div>
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
