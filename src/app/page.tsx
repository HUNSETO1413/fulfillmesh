import Link from "next/link";
import {
  Warehouse, Package, Truck, RotateCcw,
  ArrowRight, CheckCircle2,
  ChevronRight, BarChart3,
} from "lucide-react";
import WorldMap from "@/components/WorldMap";

/* ============ Hero ============ */
function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-5 lg:pt-10 lg:pb-6">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Left copy */}
          <div>
            <h1 className="text-[28px] lg:text-[36px] font-bold leading-[1.15] tracking-tight text-deep-navy">
              Find the right{" "}
              <span className="text-navy">China-powered</span>{" "}
              <span className="text-teal">fulfillment partner</span> for your brand.
            </h1>
            <p className="mt-3 text-[14px] text-text-body leading-relaxed">
              Streamline your e-commerce operations with our end-to-end fulfillment services, trusted by 10,000+ brands.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all"
              >
                Get a Quote
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
      </div>
    </section>
  );
}

/* ============ Services ============ */
function ServicesSection() {
  const services = [
    { icon: Warehouse, title: "Warehousing", desc: "Secure, scalable storage with real-time inventory tracking.", href: "/solutions/overseas-warehousing" },
    { icon: Package, title: "Order Processing", desc: "Fast, accurate picking and packing for every order.", href: "/solutions/packaging-labeling" },
    { icon: Truck, title: "Shipping", desc: "Multi-carrier integration and global delivery options.", href: "/solutions/shipping-logistics" },
    { icon: RotateCcw, title: "Returns Management", desc: "Simplified reverse logistics and customer support.", href: "/solutions/returns-management" },
    { icon: BarChart3, title: "Inventory Sync", desc: "Real-time updates across all sales channels.", href: "/solutions/inventory-visibility" },
    { icon: BarChart3, title: "Analytics", desc: "Data-driven insights to optimize your fulfillment.", href: "/solutions/analytics-reporting" },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="text-center max-w-[480px] mx-auto">
          <h2 className="text-[24px] font-bold text-deep-navy leading-tight">
            End-to-end fulfillment solutions
          </h2>
          <p className="mt-2 text-[13px] text-text-body leading-relaxed">
            From warehousing to last-mile delivery, we handle every step of your supply chain.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s, i) => (
            <Link
              key={i}
              href={s.href}
              className="group bg-white rounded-xl p-4 border border-[#E5E7EB] hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center mb-2">
                <s.icon className="w-4 h-4 text-teal" />
              </div>
              <h3 className="text-[14px] font-semibold text-deep-navy">{s.title}</h3>
              <p className="mt-1 text-[11px] text-text-body leading-relaxed">{s.desc}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-teal group-hover:gap-2 transition-all">
                Learn more <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
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
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-6 items-center">
          {/* Text */}
          <div>
            <h2 className="text-[24px] font-bold text-deep-navy leading-tight">
              Manage Everything from One Powerful Platform
            </h2>
            <p className="mt-2 text-[13px] text-text-body leading-relaxed">
              Monitor inventory, track orders, and analyze performance in real time.
            </p>
            <ul className="mt-4 space-y-2">
              {["Real-time order tracking & status updates", "Quality inspection reports with photos", "Shipment visibility across all carriers", "Inventory levels across all warehouses"].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-text-body text-[12px]">
                  <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/book-a-demo"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all"
            >
              Request a Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mockup */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden">
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
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-lg p-2 border border-border-soft">
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
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between py-0.5 text-[7px]">
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

/* ============ CTA ============ */
function CTASection() {
  return (
    <section className="bg-deep-navy">
      <div className="max-w-[600px] mx-auto px-6 py-5 text-center">
        <h2 className="text-[22px] font-bold leading-tight text-white">
          Ready to find your perfect fulfillment partner?
        </h2>
        <p className="mt-1 text-[14px] text-text-on-dark-muted">
          Start your journey with FulfillMesh today.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold text-white rounded-[8px] gradient-cta hover:shadow-button transition-all"
          >
            Get a Quote
          </Link>
          <Link
            href="/book-a-demo"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold bg-white text-navy rounded-[8px] hover:shadow-soft transition-all"
          >
            Book a Demo
          </Link>
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
      <ServicesSection />
      <DashboardPreview />
      <CTASection />
    </>
  );
}
