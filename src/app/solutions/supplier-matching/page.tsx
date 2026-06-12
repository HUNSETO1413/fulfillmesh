import type { Metadata } from "next";
import Link from "next/link";
import {
  Search, Building2, Globe, ShieldCheck, FileText, Headphones, BarChart3,
  Users, Box, ClipboardCheck, CheckCircle2, Layers, ArrowRight, ChevronDown,
  Calendar,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import DottedWorldMap from "../shipping-logistics/DottedWorldMap";

export const metadata: Metadata = pageMetadata({
  title: "Supplier Matching & China Sourcing",
  description:
    "Get matched with pre-vetted factories in China, Vietnam, India, and 60+ countries. Compare quotes, MOQs, and lead times to source the right manufacturing partner faster.",
  path: "/solutions/supplier-matching",
  keywords: [
    "china sourcing",
    "supplier matching",
    "find manufacturers",
    "vetted factories",
    "product sourcing agent",
  ],
});

const steps = [
  { num: "1", icon: FileText, title: "Share Your Requirements", desc: "Tell us about your product, volume, materials, and quality standards." },
  { num: "2", icon: Search, title: "We Source & Match", desc: "Our team searches our vetted network to find the best-fit factories." },
  { num: "3", icon: Users, title: "Review Shortlist & Quotes", desc: "Compare factory profiles, capabilities, and quotes side by side." },
  { num: "4", icon: ShieldCheck, title: "Select & Partner", desc: "Choose your partner and we help you onboard with confidence." },
];

const features = [
  { icon: Users, title: "Vetted Factory Discovery", desc: "Access a curated network of pre-vetted factories with verified licenses, certifications, and performance history." },
  { icon: Box, title: "Category Expertise", desc: "We match you with factories that have proven experience in your product category and materials." },
  { icon: ShieldCheck, title: "Requirement Matching", desc: "Advanced matching engine considers your specs, volume, target price, lead time, and compliance requirements." },
  { icon: BarChart3, title: "Quote Comparison", desc: "Receive competitive quotes and compare pricing, MOQs, lead times, and capabilities in one place." },
  { icon: ClipboardCheck, title: "Qualification Checks", desc: "We verify quality systems, capacity, past performance, and reference checks before shortlisting." },
  { icon: Headphones, title: "Onboarding Support", desc: "From sample coordination to contract support, we guide you through every step of onboarding." },
];

const timeline = [
  { icon: FileText, title: "Requirement Intake", desc: "We capture your technical specs, materials, volumes, compliance needs, and target timelines." },
  { icon: Globe, title: "Global Sourcing", desc: "Our team searches our global network and industry databases to find best-fit factories." },
  { icon: Users, title: "Shortlist & Share", desc: "You receive a curated shortlist with factory profiles and indicative quotes." },
  { icon: ShieldCheck, title: "Validate & Sample", desc: "We facilitate samples, quality checks, and due diligence to validate capabilities." },
  { icon: CheckCircle2, title: "Partner Selection", desc: "Select your preferred partner. We support contract, planning, and kickoff." },
];

const sourcingBullets = [
  "Save weeks of sourcing time",
  "Reduce risk with vetted suppliers",
  "Better quality, better pricing",
  "Scale with confidence",
];

const stats = [
  { icon: Users, value: "12,000+", label: "Vetted Factories" },
  { icon: Globe, value: "60+", label: "Countries Covered" },
  { icon: Layers, value: "26+", label: "Product Categories" },
  { icon: ShieldCheck, value: "98%", label: "Supplier On-Time Rate" },
];

const dashColumns = ["Supplier", "Location", "Category", "Match Score", "Capabilities", "Lead Time", "MOQ", "Quote"];
const dashRows = [
  { cols: ["Shenzhen Precision Co.", "China", "Electronics", "98%", "OEM, ODM", "18 days", "500", "$2.10"] },
  { cols: ["Ningbo Bright Manufacturing", "China", "Home Goods", "96%", "ODM", "20 days", "1,000", "$0.90"] },
  { cols: ["Suzhou Advanced Textiles", "China", "Apparel", "94%", "OEM", "18 days", "800", "$3.40"] },
  { cols: ["Qingdao Excellent Plastics", "China", "Plastic", "93%", "OEM, ODM", "16 days", "1,000", "$1.88"] },
  { cols: ["Vietnam Apparel Works", "Vietnam", "Apparel", "92%", "OEM", "22 days", "1,000", "$2.48"] },
];

const faqs = [
  { q: "How do you vet your suppliers?" },
  { q: "How much does Supplier Matching cost?" },
  { q: "What if I don't find the right supplier?" },
  { q: "Can you help with sampling and quality checks?" },
];

const heroNodes = [
  { label: "Vetted Factories", icon: Building2, top: "20%", left: "16%" },
  { label: "Product Expertise", icon: Box, top: "16%", left: "82%" },
  { label: "Quality Assured", icon: ShieldCheck, top: "82%", left: "14%" },
  { label: "Competitive Quotes", icon: BarChart3, top: "84%", left: "84%" },
];

export default function SupplierMatchingPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">OUR SOLUTIONS</span>
              <h1 className="mt-5 text-[36px] lg:text-[46px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                Supplier Matching
                <br />
                <span className="gradient-text-teal">Find the right factories.</span>
                <br />
                Faster and with confidence.
              </h1>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh matches you with pre-vetted suppliers in China and worldwide based on your product, specifications, and goals — saving you time, reducing risk, and helping you build better products.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] bg-deep-navy hover:bg-navy hover:shadow-button transition-all">
                  Find My Match <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-[10px] border border-border-blue bg-white hover:shadow-soft transition-all">
                  <Calendar className="w-4 h-4" /> Book a Demo
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {["Vetted Partners", "End-to-End Support", "No Hidden Fees"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                  </span>
                ))}
              </div>
            </div>
            {/* Dotted world map */}
            <div className="relative hidden lg:block h-[360px]">
              <DottedWorldMap
                width={500}
                height={360}
                className="absolute inset-0 w-full h-full"
                hubX={0.5}
                hubY={0.5}
                markers={[
                  { x: 0.16, y: 0.2, color: "#00B894" },
                  { x: 0.82, y: 0.16, color: "#00B894" },
                  { x: 0.14, y: 0.82, color: "#00B894" },
                  { x: 0.84, y: 0.84, color: "#00B894" },
                ]}
                arcs={[
                  { x1: 0.16, y1: 0.2, x2: 0.5, y2: 0.5 },
                  { x1: 0.82, y1: 0.16, x2: 0.5, y2: 0.5 },
                  { x1: 0.14, y1: 0.82, x2: 0.5, y2: 0.5 },
                  { x1: 0.84, y1: 0.84, x2: 0.5, y2: 0.5 },
                ]}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-2xl gradient-logo flex items-center justify-center text-white font-bold text-xl shadow-card">
                FM
              </div>
              {heroNodes.map((n) => (
                <div key={n.label} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5" style={{ top: n.top, left: n.left }}>
                  <div className="w-11 h-11 rounded-xl bg-white border border-border-soft shadow-soft flex items-center justify-center">
                    <n.icon className="w-5 h-5 text-navy" />
                  </div>
                  <span className="text-[11px] font-medium text-text-muted whitespace-nowrap">{n.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">How Supplier Matching works</h2>
            <p className="mt-3 text-[16px] text-text-body">Our proven process connects you with the ideal manufacturing partners.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                <div className="bg-white rounded-xl border border-border-soft shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6 h-full">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-deep-navy text-white text-[18px] font-bold flex items-center justify-center mb-3">
                      {s.num}
                    </div>
                    <s.icon className="w-6 h-6 text-action-blue" />
                  </div>
                  <h3 className="text-[16px] font-bold text-deep-navy text-center">{s.title}</h3>
                  <p className="mt-2 text-[13px] text-text-muted leading-relaxed text-center">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 w-4 h-4 text-border-blue" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">Powerful matching. Real supplier relationships.</h2>
            <p className="mt-3 text-[16px] text-text-body">Everything you need to find and partner with the right factory.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-border-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-action-blue" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-deep-navy">{f.title}</h3>
                    <p className="mt-2 text-[13px] text-text-body leading-relaxed">{f.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-action-blue">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <h2 className="text-[30px] font-bold text-deep-navy">From requirements to reliable partnerships</h2>
            <p className="mt-3 text-[16px] text-text-body">A transparent end-to-end process designed to reduce risk and speed up sourcing.</p>
          </div>
          <div className="relative grid md:grid-cols-5 gap-6">
            <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-px bg-teal/40" />
            {timeline.map((t, i) => (
              <div key={i} className="relative">
                <div className="w-14 h-14 rounded-full bg-white border border-border-soft shadow-soft flex items-center justify-center mb-5 relative z-10 mx-auto">
                  <t.icon className="w-6 h-6 text-action-blue" />
                </div>
                <h3 className="text-[14px] font-bold text-deep-navy text-center">
                  <span className="text-[13px] font-semibold text-text-muted">Step {i + 1}:</span>{" "}
                  {t.title}
                </h3>
                <p className="mt-2 text-[12px] text-text-muted leading-relaxed text-center">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing partner + Dashboard */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">BUILT FOR GROWING BRANDS</span>
              <h2 className="mt-5 text-[30px] font-bold text-deep-navy leading-tight">
                The sourcing partner <br /> e-commerce <span className="gradient-text-teal">brands trust</span>
              </h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[440px]">Whether you&apos;re launching a new product or scaling your catalog, we help you find manufacturing partners you can rely on.</p>
              <div className="mt-6 space-y-3">
                {sourcingBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
                    <span className="text-[14px] text-text-body">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-soft">
                <span className="flex items-center gap-2 text-[13px] font-bold text-deep-navy">
                  <span className="w-6 h-6 rounded-md gradient-logo flex items-center justify-center text-white text-[10px] font-bold">FM</span>
                  FulfillMesh
                </span>
                <span className="text-[11px] text-text-muted">May 12 – May 18, 2025</span>
              </div>
              <div className="flex">
                <div className="w-[100px] shrink-0 border-r border-border-soft py-3 px-3 space-y-2 hidden sm:block">
                  {["Overview", "Suppliers", "Quotes", "RFQs", "Orders", "Shipments", "Quality Control", "Warehouses", "Reports", "Settings"].map((m, i) => (
                    <p key={m} className={`text-[11px] ${i === 1 ? "text-teal font-semibold" : "text-text-muted"}`}>{m}</p>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-[13px] font-bold text-deep-navy mb-3">Supplier Matches</h4>
                  <div className="overflow-hidden rounded-lg border border-border-soft">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#F9FAFB]">
                          {dashColumns.map((c) => (
                            <th key={c} className="px-2 py-1.5 text-[9px] font-semibold text-text-muted">{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dashRows.map((r, i) => (
                          <tr key={i} className="border-t border-border-soft">
                            {r.cols.map((c, j) => (
                              <td key={j} className={`px-2 py-1.5 text-[9px] ${j === 0 ? "font-semibold text-deep-navy" : j === 3 ? "font-semibold text-teal" : "text-text-body"}`}>{c}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button className="mt-3 text-[11px] font-semibold text-white bg-navy border border-transparent rounded-md px-3 py-1.5 hover:bg-deep-navy transition-colors">View Full Shortlist</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected platform stats (light) */}
      <section className="gradient-soft-card">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">ONE CONNECTED PLATFORM</span>
              <h2 className="mt-5 text-[28px] font-bold text-deep-navy leading-tight">
                Supplier Matching, connected to your fulfillment operations
              </h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[420px]">
                Seamlessly move from supplier selection to orders, quality checks, shipments, and warehouse management — all in one platform.
              </p>
              <Link href="/solutions" className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-action-blue">
                Learn more about our platform <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon className="w-8 h-8 text-navy mx-auto mb-3" />
                  <p className="text-[32px] font-bold text-deep-navy leading-none">{s.value}</p>
                  <p className="mt-2 text-[13px] text-text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="max-w-[1000px] mx-auto px-6 py-20">
          <h2 className="text-[30px] font-bold text-deep-navy text-center mb-12">Questions? We&apos;ve got answers.</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map((f) => (
              <div key={f.q} className="bg-white rounded-xl border border-border-soft px-5 py-4 flex items-center justify-between">
                <span className="text-[15px] font-semibold text-deep-navy pr-4">{f.q}</span>
                <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14">
            <h2 className="text-[30px] font-bold leading-tight">Ready to find the right manufacturing partner?</h2>
            <p className="mt-3 text-[16px] text-text-on-dark-muted">Tell us about your product and we&apos;ll find the best-fit suppliers for you.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">
                Find My Match <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] border border-white/30 hover:bg-white/10 transition-all">
                <Calendar className="w-4 h-4" /> Book a Demo
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["Free to get started", "No obligations", "Personalized matches"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-on-dark-soft">
                  <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
