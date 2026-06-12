import Link from "next/link";
import {
  Link2, ShieldCheck, Package, Truck, Warehouse, BarChart3,
  ClipboardList, Sparkles, Settings, TrendingUp,
  Eye, Layers, Globe, Star,
  ArrowRight, CheckCircle2, ChevronRight,
} from "lucide-react";
import WorldMap from "@/components/WorldMap";

/* ============ Hero ============ */
const heroStats = [
  { v: "1,200+", l: "Vetted Partners" },
  { v: "25K+", l: "Shipments Managed" },
  { v: "150+", l: "Countries Served" },
  { v: "98%", l: "On-Time Delivery" },
  { v: "4.8/5", l: "Customer Rating" },
];

function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-6">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left copy */}
          <div>
            <h1 className="text-[30px] lg:text-[38px] font-bold leading-[1.12] tracking-tight text-deep-navy">
              Find the right{" "}
              <span className="text-navy">China-powered</span>{" "}
              <span className="text-teal">fulfillment partner</span> for your brand.
            </h1>
            <p className="mt-4 text-[14px] text-text-body leading-relaxed max-w-[520px]">
              FulfillMesh connects brands with vetted fulfillment partners in China. We match
              you based on your product, volume, and goals — with end-to-end support across
              supplier matching, QC, packaging, shipping routes, and overseas warehouses.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all"
              >
                Find My Match
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/book-a-demo"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-deep-navy bg-white border border-border-blue rounded-lg hover:shadow-soft transition-all"
              >
                Book a Demo
              </Link>
            </div>
          </div>

          {/* Right — World map */}
          <div className="hidden lg:block">
            <WorldMap />
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 border-t border-border-soft pt-6">
          {heroStats.map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-[26px] font-bold text-navy leading-none">{s.v}</p>
              <p className="mt-1.5 text-[12px] text-text-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Solutions ============ */
const solutions = [
  { icon: Link2, title: "Supplier Matching", desc: "Connect with vetted manufacturers and suppliers tailored to your product and volume.", href: "/solutions/supplier-matching" },
  { icon: ShieldCheck, title: "Quality Control", desc: "On-site inspections and quality assurance before your goods ship.", href: "/solutions/quality-control" },
  { icon: Package, title: "Packaging & Labeling", desc: "Custom packaging, labeling and branding tailored to your market.", href: "/solutions/packaging-labeling" },
  { icon: Truck, title: "Shipping & Logistics", desc: "Optimized shipping routes with the best rates and trusted carriers.", href: "/solutions/shipping-logistics" },
  { icon: Warehouse, title: "Overseas Warehousing", desc: "Store inventory closer to your customers for faster local delivery.", href: "/solutions/overseas-warehousing" },
  { icon: BarChart3, title: "Analytics & Reporting", desc: "Real-time insights and data to optimize every step of fulfillment.", href: "/solutions/analytics-reporting" },
];

function SolutionsSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="text-center max-w-[560px] mx-auto">
          <h2 className="text-[26px] font-bold text-deep-navy leading-tight">
            End-to-end fulfillment solutions
          </h2>
          <p className="mt-2 text-[14px] text-text-body leading-relaxed">
            Everything you need to bring products from China to your customers — simply and reliably.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {solutions.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group bg-white rounded-xl p-5 border border-border-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center mb-3">
                <s.icon className="w-5 h-5 text-teal" />
              </div>
              <h3 className="text-[15px] font-semibold text-deep-navy">{s.title}</h3>
              <p className="mt-1.5 text-[12px] text-text-body leading-relaxed">{s.desc}</p>
              <span className="inline-flex items-center gap-1 mt-3 text-[12px] font-medium text-teal group-hover:gap-2 transition-all">
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ How it works ============ */
const steps = [
  { icon: ClipboardList, n: "1", title: "Tell us your needs", desc: "Share your product, target volume, and goals so we understand your fulfillment requirements." },
  { icon: Sparkles, n: "2", title: "Get matched", desc: "We match you with vetted suppliers and fulfillment partners that fit your brand." },
  { icon: Settings, n: "3", title: "We manage logistics", desc: "QC, packaging, shipping and warehousing — handled end-to-end on your behalf." },
  { icon: TrendingUp, n: "4", title: "Track & optimize", desc: "Monitor everything in one dashboard and optimize as your business grows." },
];

function HowItWorksSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 pb-12">
        <div className="text-center max-w-[560px] mx-auto">
          <h2 className="text-[26px] font-bold text-deep-navy leading-tight">How FulfillMesh works</h2>
          <p className="mt-2 text-[14px] text-text-body leading-relaxed">
            From first match to ongoing fulfillment in four simple steps.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div key={s.n} className="relative text-center px-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-action-blue/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-action-blue" />
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5">
                <span className="text-[12px] font-bold text-teal">{s.n}</span>
                <h3 className="text-[15px] font-semibold text-deep-navy">{s.title}</h3>
              </div>
              <p className="mt-1.5 text-[12px] text-text-body leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Dashboard Preview ============ */
function DashboardPreview() {
  return (
    <section className="bg-soft-bg">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-8 items-center">
          {/* Text */}
          <div>
            <p className="text-[12px] font-semibold text-teal uppercase tracking-wide">Real-time visibility, full control</p>
            <h2 className="mt-2 text-[26px] font-bold text-deep-navy leading-tight">
              Manage everything from one powerful dashboard
            </h2>
            <p className="mt-2 text-[14px] text-text-body leading-relaxed">
              Track orders, quality checks, shipments, and inventory in real time — all in one place.
            </p>
            <ul className="mt-4 space-y-2">
              {["Real-time order tracking & status updates", "Quality inspection reports with photos", "Shipment visibility across all carriers", "Inventory levels across all warehouses"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-text-body text-[13px]">
                  <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/book-a-demo"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all"
            >
              See Dashboard Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mockup */}
          <div className="bg-white rounded-2xl border border-border-soft shadow-card overflow-hidden">
            <div className="flex">
              {/* Mini sidebar */}
              <div className="w-10 bg-deep-navy py-2.5 flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded gradient-logo flex items-center justify-center">
                  <span className="text-white text-[7px] font-bold">FM</span>
                </div>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className={`w-4 h-4 rounded ${n === 1 ? "bg-white/20" : "bg-white/8"}`} />
                ))}
              </div>
              {/* Content */}
              <div className="flex-1 bg-soft-bg p-2.5 space-y-2">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { l: "Orders", v: "128", c: "+12%" },
                    { l: "In Transit", v: "42", c: "+5%" },
                    { l: "QC Inspections", v: "36", c: "+8%" },
                    { l: "On-Time Rate", v: "98%", c: "+2%" },
                  ].map((s) => (
                    <div key={s.l} className="bg-white rounded-lg p-2 border border-border-soft">
                      <p className="text-[8px] text-text-muted">{s.l}</p>
                      <div className="flex items-end gap-1">
                        <p className="text-[14px] font-bold text-deep-navy">{s.v}</p>
                        <span className="text-[7px] text-teal font-medium mb-0.5">{s.c}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Chart */}
                <div className="bg-white rounded-lg p-2 border border-border-soft">
                  <p className="text-[8px] font-semibold text-deep-navy mb-1">Orders Over Time</p>
                  <div className="flex">
                    <div className="flex flex-col justify-between text-[5px] text-text-muted pr-0.5 py-0.5">
                      <span>150</span>
                      <span>100</span>
                      <span>50</span>
                      <span>0</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-end justify-between gap-0.5 h-10 border-l border-b border-border-soft pl-1 pb-0.5">
                        {[40, 55, 48, 70, 62, 82, 75, 95].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-[1px] bg-action-blue/85"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[5px] text-text-muted pl-1 mt-0.5">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((m) => (
                          <span key={m} className="flex-1 text-center">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table */}
                <div className="bg-white rounded-lg p-2 border border-border-soft">
                  <p className="text-[8px] font-semibold text-deep-navy mb-1">Recent Shipments</p>
                  {[
                    { id: "FM-001", d: "US", s: "Delivered", sc: "bg-teal/10 text-teal" },
                    { id: "FM-002", d: "UK", s: "In Transit", sc: "bg-action-blue/10 text-action-blue" },
                    { id: "FM-003", d: "DE", s: "Pending", sc: "bg-amber-50 text-amber-600" },
                  ].map((r) => (
                    <div key={r.id} className="flex items-center justify-between py-0.5 text-[7px]">
                      <span className="font-medium text-deep-navy">{r.id}</span>
                      <span className="text-text-muted">{r.d}</span>
                      <span className={`px-1 py-0.5 rounded font-medium ${r.sc}`}>{r.s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Why choose ============ */
const reasons = [
  { icon: ShieldCheck, title: "Vetted & Trusted Partners", desc: "Every supplier and partner is verified and quality-checked before joining the network." },
  { icon: Eye, title: "Transparent Operations", desc: "Real-time visibility into every order, inspection and shipment — no black boxes." },
  { icon: Layers, title: "Scalable Solutions", desc: "From your first order to thousands a day, FulfillMesh scales with your growth." },
  { icon: Globe, title: "Global Reach", desc: "Ship to 150+ countries with optimized routes and overseas warehousing." },
];

function WhyChooseSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="text-center max-w-[560px] mx-auto">
          <h2 className="text-[26px] font-bold text-deep-navy leading-tight">Why brands choose FulfillMesh</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((r) => (
            <div key={r.title} className="text-center px-2">
              <div className="mx-auto w-11 h-11 rounded-lg bg-teal/10 flex items-center justify-center">
                <r.icon className="w-5 h-5 text-teal" />
              </div>
              <h3 className="mt-3 text-[15px] font-semibold text-deep-navy">{r.title}</h3>
              <p className="mt-1.5 text-[12px] text-text-body leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Trusted / testimonial ============ */
const brands = ["ZENSKA", "LUMIÈRE", "NEXORA", "BRIO", "VALTERRA"];

function TrustedSection() {
  return (
    <section className="bg-soft-bg">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
          <div>
            <p className="text-[13px] font-semibold text-text-muted">Trusted by brands growing worldwide</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
              {brands.map((b) => (
                <span key={b} className="text-[18px] font-bold tracking-wide text-deep-navy/40">{b}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-3 text-[15px] text-deep-navy leading-relaxed">
              &ldquo;FulfillMesh helped us cut fulfillment costs by 30% and ship faster than ever.
              The matched suppliers and single dashboard changed how we operate.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-navy/10 text-navy text-[12px] font-bold flex items-center justify-center">EC</div>
              <div>
                <p className="text-[13px] font-semibold text-deep-navy">Emily Chen</p>
                <p className="text-[11px] text-text-muted">Founder, Nexora Goods</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CTA ============ */
const ctaPerks = ["Free to get started", "No setup fees", "Cancel anytime"];

function CTASection() {
  return (
    <section className="bg-deep-navy">
      <div className="max-w-[760px] mx-auto px-6 py-12 text-center">
        <h2 className="text-[24px] font-bold leading-tight text-white">
          Ready to find your perfect fulfillment partner?
        </h2>
        <p className="mt-2 text-[14px] text-text-on-dark-muted">
          Join thousands of brands shipping smarter from China.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all"
          >
            Get Started Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
          {ctaPerks.map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5 text-[12px] text-text-on-dark-muted">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Page ============ */
export default function Home() {
  return (
    <>
      <HeroSection />
      <SolutionsSection />
      <HowItWorksSection />
      <DashboardPreview />
      <WhyChooseSection />
      <TrustedSection />
      <CTASection />
    </>
  );
}
