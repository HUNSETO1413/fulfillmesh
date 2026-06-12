import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Calendar,
  Clock3,
  TrendingDown,
  TrendingUp,
  Clock,
  Boxes,
  Layers,
  Ship,
  CheckCircle2,
  Lightbulb,
  Check,
  Mail,
} from "lucide-react";

// Social share icons using inline SVGs (matching blog/guide detail pattern)
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
  "Market overview",
  "Freight rates trends",
  "Capacity & supply availability",
  "Transit time performance",
  "Key takeaways",
  "What to expect next",
  "Implications for shippers",
];

const heroStats = [
  { icon: Clock, label: "Avg. Transit Time", value: "18.6 days" },
  { icon: Boxes, label: "Capacity (TEU)", value: "642,000", sub: "↑ 8%" },
  { icon: Layers, label: "Space Availability", value: "Moderate" },
  { icon: Ship, label: "Blank Sailings", value: "23", sub: "in May" },
];

const capacityStats = [
  { value: "642K", label: "Total Capacity (May 2025)", sub: "↑ 8%", up: true },
  { value: "Moderate", label: "Space Availability", sub: "Improving", up: true },
  { value: "23", label: "Blank Sailings (May 2025)", sub: "" },
  { value: "85%", label: "Load Factor", sub: "Down from 92%", up: false },
];

const keyTakeaways = [
  "Rates continue to soften with ample capacity and reduced demand.",
  "Space availability is improving, giving shippers more flexibility.",
  "Transit times have improved, but monitor potential port labor and weather risks.",
  "Shippers should lock in rates selectively while the market remains favorable.",
];

const HERO_IMG =
  "/images/photo-1605281317010-fe5ffe798166.jpg";

const relatedArticles = [
  {
    title: "U.S. West Coast Port Update: May 2025",
    img: "/images/photo-1494412574643-ff11b0a5c1c3.jpg",
  },
  {
    title: "Intermodal vs Ocean Freight: When to Use Which",
    img: "/images/photo-1601584115197-04ecc0da31d7.jpg",
  },
  {
    title: "Peak Season Preparedness Checklist",
    img: "/images/photo-1578575437130-527eed3abbec.jpg",
  },
  {
    title: "How 3PLs Help You Navigate Volatile Markets",
    img: "/images/photo-1566576721346-d4a3b4eaeb55.jpg",
  },
];

const moreInsights = [
  {
    title: "Global Container Shipping Market Outlook 2025",
    img: "/images/photo-1494412574643-ff11b0a5c1c3.jpg",
  },
  {
    title: "Asia–Europe Shipping Update: Rates & Capacity Trends",
    img: "/images/photo-1577563908411-5077b6dc7624.jpg",
  },
  {
    title: "Port Congestion Watch: Key Hotspots Worldwide",
    img: "/images/photo-1581092918056-0c4c3acd3789.jpg",
  },
  {
    title: "Warehouse to Port: Optimizing Inland Transportation",
    img: "/images/photo-1586528116311-ad8dd3c8310d.jpg",
  },
];

export default function ShippingInsightsPage() {
  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <Link href="/resources" className="hover:text-navy transition-colors">Resources</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <Link href="/resources/shipping-insights" className="hover:text-navy transition-colors">Shipping Insights</Link>
          <ChevronRight className="w-3 h-3 text-text-light" />
          <span className="text-text-primary font-medium truncate">China–US Shipping Update</span>
        </div>
      </section>

      {/* Full-width Hero with Background Image */}
      <section
        className="relative bg-deep-navy bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMG}')` }}
      >
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/80 to-deep-navy/50" />

        <div className="relative max-w-[1200px] mx-auto px-6 pt-14 pb-12">
          {/* Badge */}
          <p className="inline-block text-xs font-semibold text-teal bg-teal/15 px-3 py-1.5 rounded-full uppercase tracking-wide mb-5">
            Shipping Insights
          </p>

          {/* Title + Description */}
          <h1 className="text-4xl lg:text-[42px] font-bold text-white leading-[1.15] max-w-[780px]">
            China–US Shipping Update: Rates, Capacity &amp; Transit Trends
          </h1>
          <p className="mt-4 text-lg text-text-on-dark-soft leading-relaxed max-w-[680px]">
            A data-driven look at the latest ocean freight market conditions between China and the US—including rate movements, capacity shifts, and transit time trends—and what they mean for shippers in 2025.
          </p>

          {/* Author + Meta row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-teal/15 flex items-center justify-center">
                <span className="text-xs font-bold text-teal">HZ</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Helen Zhao</p>
                <p className="text-xs text-text-on-dark-muted">Market Analyst, FulfillMesh</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-text-on-dark-muted"><Calendar className="w-4 h-4" /> May 12, 2025</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-text-on-dark-muted"><Clock3 className="w-4 h-4" /> 6 min read</span>
            <div className="flex items-center gap-2 text-text-on-dark-muted ml-auto">
              <span className="text-sm mr-1">Share</span>
              <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:text-white hover:border-white/40 transition-colors"><FacebookIcon className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:text-white hover:border-white/40 transition-colors"><TwitterIcon className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:text-white hover:border-white/40 transition-colors"><LinkedinIcon className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:text-white hover:border-white/40 transition-colors"><Mail className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Hero Stats Cards - overlaid on image */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {heroStats.map((s, i) => (
              <div key={i} className="rounded-xl border border-white/12 bg-white/[0.08] backdrop-blur-sm px-4 py-3.5">
                <s.icon className="w-5 h-5 text-teal mb-2" />
                <p className="text-lg font-bold text-white">{s.value} {s.sub && <span className="text-xs font-medium text-teal">{s.sub}</span>}</p>
                <p className="text-xs text-text-on-dark-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body + Sidebar */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <article className="lg:col-span-2 space-y-12">

            {/* Market overview */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">Market overview</h2>
              <p className="text-text-body leading-relaxed">
                Ocean freight between China and the U.S. continues to normalize in May 2025. Rates have declined for a third consecutive month as capacity improves and demand moderates post-peak season.
              </p>
            </div>

            {/* Freight rates trends */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">Freight rates trends</h2>
              <p className="text-text-body leading-relaxed mb-5">
                Spot rates from Shanghai (CNSHA) to Los Angeles (USLAX) have fallen 12% month-over-month, driven by improved vessel capacity and fewer blank sailings.
              </p>
              <div className="rounded-2xl border border-border-soft bg-white p-6">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-deep-navy">$2,185</p>
                    <p className="text-xs text-text-muted mt-0.5">Current Rate (May 2025)</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal"><TrendingDown className="w-4 h-4" /> 12%</span>
                </div>
                <svg viewBox="0 0 640 160" className="w-full" fill="none" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="freightArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B894" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#00B894" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map((i) => (
                    <line key={i} x1="0" y1={20 + i * 40} x2="640" y2={20 + i * 40} stroke="#E6EDF5" strokeWidth="1" />
                  ))}
                  <polygon points="0,40 128,55 256,75 384,90 512,110 640,125 640,160 0,160" fill="url(#freightArea)" />
                  <polyline points="0,40 128,55 256,75 384,90 512,110 640,125" stroke="#00B894" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {[[0,40],[128,55],[256,75],[384,90],[512,110],[640,125]].map(([x,y],i) => (
                    <circle key={i} cx={x} cy={y} r="4.5" fill="white" stroke="#00B894" strokeWidth="2.5" />
                  ))}
                </svg>
                <div className="flex justify-between text-[10px] text-text-muted mt-2">
                  {["Dec '24", "Jan", "Feb", "Mar", "Apr", "May"].map((m) => <span key={m}>{m}</span>)}
                </div>
              </div>
              <p className="mt-3 text-sm text-text-muted">
                Rates are <span className="font-semibold text-deep-navy">26% lower vs. Dec 2024</span>, but still 34% higher than pre–Red Sea disruption levels.
              </p>
            </div>

            {/* Capacity & space availability */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">Capacity &amp; space availability</h2>
              <p className="text-text-body leading-relaxed mb-5">
                Global carriers have added capacity on the Transpacific, with improved space availability across major trade lanes.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {capacityStats.map((s, i) => (
                  <div key={i} className="rounded-xl border border-border-soft bg-white p-4">
                    <p className="text-xl font-bold text-deep-navy">{s.value}</p>
                    <p className="text-xs text-text-muted mt-1">{s.label}</p>
                    {s.sub && (
                      <p className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${s.up ? "text-teal" : "text-text-muted"}`}>
                        {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {s.sub}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Transit time performance */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">Transit time performance</h2>
              <p className="text-text-body leading-relaxed mb-5">
                Average transit times have improved slightly as port congestion eases and vessel schedules stabilize.
              </p>
              <div className="rounded-xl border border-border-soft overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-soft-bg border-b border-border-soft">
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Route</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Apr 2025</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-text-muted text-xs uppercase tracking-wide">May 2025</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-deep-navy text-xs uppercase tracking-wide bg-teal/[0.08]">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-text-primary">Shanghai → Los Angeles</td>
                      <td className="px-5 py-3.5 text-text-body">19.8</td>
                      <td className="px-5 py-3.5 text-text-body">18.6</td>
                      <td className="px-5 py-3.5 font-semibold text-teal bg-teal/[0.05]">-1.2 days</td>
                    </tr>
                    <tr className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-text-primary">Shenzhen → Long Beach</td>
                      <td className="px-5 py-3.5 text-text-body">20.1</td>
                      <td className="px-5 py-3.5 text-text-body">18.9</td>
                      <td className="px-5 py-3.5 font-semibold text-teal bg-teal/[0.05]">-1.2 days</td>
                    </tr>
                    <tr className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-text-primary">Ningbo → Savannah</td>
                      <td className="px-5 py-3.5 text-text-body">32.5</td>
                      <td className="px-5 py-3.5 text-text-body">31.0</td>
                      <td className="px-5 py-3.5 font-semibold text-teal bg-teal/[0.05]">-1.5 days</td>
                    </tr>
                    <tr className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-text-primary">Qingdao → New York</td>
                      <td className="px-5 py-3.5 text-text-body">34.2</td>
                      <td className="px-5 py-3.5 text-text-body">33.0</td>
                      <td className="px-5 py-3.5 font-semibold text-teal bg-teal/[0.05]">-1.2 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key takeaways */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-4">Key takeaways</h2>
              <ul className="space-y-3">
                {keyTakeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-body">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-sm">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to expect next */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">What to expect next</h2>
              <p className="text-text-body leading-relaxed">
                Rates are expected to continue their downward trajectory through Q3 2025 as new vessel deliveries outpace demand growth. However, potential disruptions from geopolitical tensions, port labor negotiations, and the approaching typhoon season could create localized spikes.
              </p>
              <p className="mt-4 text-text-body leading-relaxed">
                Carriers may adjust blank sailing schedules to stabilize rates, particularly on the Transpacific Eastbound lane. Shippers should monitor weekly rate indices and be prepared to act quickly if signs of a reversal emerge.
              </p>
            </div>

            {/* Implications for shippers */}
            <div>
              <h2 className="text-2xl font-bold text-deep-navy mb-3">Implications for shippers</h2>
              <p className="text-text-body leading-relaxed mb-4">
                With the current softening market, shippers have a window of opportunity to:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-text-body">
                  <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <span className="text-sm">Lock in favorable contract rates for H2 2025 and early 2026.</span>
                </li>
                <li className="flex items-start gap-3 text-text-body">
                  <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <span className="text-sm">Diversify carrier relationships to maintain flexibility.</span>
                </li>
                <li className="flex items-start gap-3 text-text-body">
                  <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <span className="text-sm">Build buffer inventory ahead of potential Q4 disruptions.</span>
                </li>
                <li className="flex items-start gap-3 text-text-body">
                  <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <span className="text-sm">Leverage real-time visibility tools to respond to schedule changes.</span>
                </li>
              </ul>
              <div className="mt-6 rounded-xl bg-teal/5 border border-teal/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-teal" />
                  <p className="text-sm font-bold text-deep-navy">Pro tip</p>
                </div>
                <p className="text-sm text-text-body leading-relaxed">
                  Rates are highly sensitive to capacity, regional, and seasonal demand—monitor weekly and lock in contracts ahead of the next peak.
                </p>
                <Link href="#" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
                  Get personalized recommendations <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Table of Contents */}
            <div className="rounded-2xl border border-border-soft bg-white p-6 sticky top-6">
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

            {/* Related shipping articles */}
            <div className="rounded-2xl border border-border-soft bg-white p-6">
              <p className="text-sm font-bold text-deep-navy mb-4">Related shipping articles</p>
              <div className="space-y-4">
                {relatedArticles.map((a, i) => (
                  <Link key={i} href="/resources/shipping-insights" className="flex items-start gap-3 group">
                    <span
                      className="w-14 h-12 rounded-lg bg-cover bg-center bg-soft-bg shrink-0"
                      style={{ backgroundImage: `url('${a.img}')` }}
                    />
                    <span className="text-sm text-text-body group-hover:text-action-blue leading-snug transition-colors">{a.title}</span>
                  </Link>
                ))}
              </div>
              <Link href="/resources/shipping-insights" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-action-blue hover:underline">
                Browse all articles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Subscribe Card */}
            <div className="rounded-2xl border border-border-soft bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-teal" />
                </div>
                <h3 className="text-base font-bold text-deep-navy">Stay ahead with Shipping Insights</h3>
              </div>
              <p className="text-sm text-text-body leading-relaxed">Get the latest shipping market updates and expert analysis delivered to your inbox.</p>
              <input
                type="email"
                placeholder="Enter your work email"
                className="mt-3 w-full px-4 py-2.5 rounded-lg border border-border-soft bg-white text-sm text-text-body placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue/30 transition-colors"
              />
              <button className="mt-2.5 w-full py-2.5 rounded-lg gradient-cta text-white text-sm font-semibold hover:shadow-button transition-all">
                Subscribe
              </button>
              <p className="mt-2.5 text-xs text-text-muted">We respect your privacy. Unsubscribe anytime.</p>
            </div>

            {/* CTA card */}
            <div className="relative rounded-2xl gradient-dark-hero text-white p-6 overflow-hidden">
              <DottedWorldMap />
              <p className="relative text-xs font-semibold text-teal uppercase tracking-wide mb-2">Ready to optimize?</p>
              <h3 className="relative text-lg font-bold">See FulfillMesh in action</h3>
              <p className="relative mt-2 text-sm text-text-on-dark-muted">Book a personalized demo and see how FulfillMesh can help you ship smarter and save on logistics costs.</p>
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

      {/* CTA */}
      <section className="gradient-dark-hero text-white">
        <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">Ready to optimize your shipping strategy?</h2>
          <p className="mt-3 text-text-on-dark-muted">
            Work with FulfillMesh experts to secure capacity, reduce costs, and improve delivery performance.
          </p>
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

      {/* More shipping insights */}
      <section className="bg-soft-bg border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy">More shipping insights you&apos;ll like</h2>
            <Link href="/resources/shipping-insights" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
              View all articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moreInsights.map((item, i) => (
              <Link key={i} href="/resources/shipping-insights" className="group rounded-2xl border border-border-soft bg-white overflow-hidden hover:shadow-card transition-all flex flex-col">
                <div
                  className="aspect-[16/10] bg-cover bg-center bg-deep-navy"
                  style={{ backgroundImage: `url('${item.img}')` }}
                />
                <div className="p-5 flex flex-col flex-1">
                  <span className="self-start text-[11px] font-semibold text-teal bg-teal/8 px-2.5 py-1 rounded-full mb-3">Shipping Insights</span>
                  <h3 className="font-semibold text-deep-navy group-hover:text-action-blue leading-snug flex-1">{item.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-action-blue">
                    Read article <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
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
