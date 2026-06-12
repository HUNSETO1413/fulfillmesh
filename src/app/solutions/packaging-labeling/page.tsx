import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText, Tag, Boxes, ScanLine, ShieldCheck, Sparkles,
  Users, Box, Layers, Package, CheckCircle2, ArrowRight, ChevronDown,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Custom Packaging & Labeling Services",
  description:
    "Custom packaging, private labeling, and branded inserts for e-commerce brands. Accurate barcode, FNSKU, and compliance labeling plus premium unboxing — sourced and prepped for you.",
  path: "/solutions/packaging-labeling",
  keywords: [
    "custom packaging",
    "private label packaging",
    "fnsku barcode labeling",
    "branded packaging",
    "ecommerce packaging services",
  ],
});

const benefits = [
  { icon: Users, title: "Save Weeks of Time", desc: "Skip the endless search. We handle sourcing, printing, and preparation from start to finish." },
  { icon: ShieldCheck, title: "Reduce Risk", desc: "Vetted suppliers, accurate labeling, and compliance checks keep your brand protected." },
  { icon: Sparkles, title: "Better Quality", desc: "Premium packaging and labels that meet your specifications and delight your customers." },
  { icon: Boxes, title: "Scale with Confidence", desc: "From small runs to high-volume orders, we scale packaging to match your growth." },
];

const features = [
  { icon: FileText, title: "Custom Inserts", desc: "Thank you cards, product guides, promotional inserts, and more — fully customized for your brand." },
  { icon: Tag, title: "Private Labeling", desc: "Add your logo, brand colors, and messaging to packaging, stickers, inserts, and tape." },
  { icon: Boxes, title: "Packaging Sourcing", desc: "Access a network of vetted packaging suppliers for mailers, boxes, tissue, and eco-friendly options." },
  { icon: ScanLine, title: "Barcode & SKU Labeling", desc: "Accurate barcode, FNSKU, and SKU labeling for marketplaces, retail, and internal tracking." },
  { icon: ShieldCheck, title: "Compliance Labeling", desc: "Regulatory, safety, and compliance labels applied correctly to meet marketplace and industry standards." },
  { icon: Sparkles, title: "Brand Presentation", desc: "Premium unboxing experience with consistent packaging that reflects your brand values." },
];

const timeline = [
  { icon: FileText, title: "Requirement Intake", desc: "We capture your packaging specs, branding materials, and labeling requirements." },
  { icon: Users, title: "Artwork & Proofs", desc: "Our team prepares sample proofs and recommends materials and solutions." },
  { icon: Layers, title: "Sourcing & Production", desc: "We source, print, and prepare all packaging and labels to your specifications." },
  { icon: ScanLine, title: "Quality Check", desc: "Labels and packaging are verified for accuracy, compliance, and brand consistency." },
  { icon: Package, title: "Pack & Ship", desc: "Your products are packed, labeled, and shipped — on-brand and on time, every time." },
];

const sourcingBullets = [
  "Save weeks of sourcing time",
  "Reduce risk with vetted suppliers",
  "Better quality, better pricing",
  "Scale with confidence",
];

const stats = [
  { icon: Boxes, value: "50+", label: "Packaging Suppliers" },
  { icon: Package, value: "1M+", label: "Packages Shipped" },
  { icon: Sparkles, value: "200+", label: "Custom Designs" },
  { icon: ShieldCheck, value: "99.8%", label: "Label Accuracy" },
];

const dashColumns = ["Request ID", "Type", "Product", "Status", "Priority", "Due Date", "Qty", "Action"];
const dashRows = [
  { cols: ["PKG-1201", "Custom Mailer", "Wireless Headphones", "In Production", "High", "Jun 15", "5,000", "View"] },
  { cols: ["PKG-0892", "Private Label", "Smart Watch", "Approved", "Medium", "Jun 18", "2,500", "View"] },
  { cols: ["PKG-0455", "Barcode Label", "Portable Speaker", "Ready", "High", "Jun 12", "8,000", "View"] },
  { cols: ["PKG-0738", "Compliance", "USB-C Charger", "In Review", "Medium", "Jun 20", "3,200", "View"] },
  { cols: ["PKG-0612", "Custom Insert", "Fitness Tracker", "In Production", "Low", "Jun 22", "1,500", "View"] },
];

const faqs = [
  { q: "What types of packaging can you source?" },
  { q: "How do you ensure labeling accuracy?" },
  { q: "Can I use my own packaging designs?" },
  { q: "What is the turnaround time for packaging requests?" },
];

export default function PackagingLabelingPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">OUR SOLUTIONS</span>
              <h1 className="mt-5 text-[36px] lg:text-[46px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                Packaging &amp; Labeling —{" "}
                <span className="gradient-text-teal">that elevates your brand and delights customers</span>
              </h1>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh delivers custom packaging, labeling, and inserts tailored to your brand and product. From concept to delivery, we ensure every package leaves the right impression — accurate, compliant, and on-brand.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] bg-deep-navy hover:bg-navy hover:shadow-button transition-all">
                  Find My Match <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-navy rounded-[10px] border border-border-soft bg-white hover:shadow-soft transition-all">
                  Talk to an Expert
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
            {/* Network map */}
            <div className="relative hidden lg:block h-[400px]">
              <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 500 400" fill="none">
                {Array.from({ length: 180 }).map((_, i) => {
                  const x = (i * 37) % 500;
                  const y = ((i * 53) % 360) + 20;
                  return <circle key={i} cx={x} cy={y} r="1.3" fill="#B8C7DA" />;
                })}
              </svg>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 400" fill="none">
                {[
                  { top: "26%", left: "30%" },
                  { top: "16%", left: "78%" },
                  { top: "76%", left: "22%" },
                  { top: "78%", left: "76%" },
                ].map((n, i) => {
                  const cx = (parseFloat(n.left) / 100) * 500;
                  const cy = (parseFloat(n.top) / 100) * 400;
                  return <line key={i} x1="250" y1="200" x2={cx} y2={cy} stroke="#00B894" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5" />;
                })}
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-2xl gradient-logo flex items-center justify-center text-white font-bold text-xl shadow-card">
                FM
              </div>
              {[
                { label: "Custom Inserts", icon: FileText, top: "26%", left: "30%" },
                { label: "Private Labeling", icon: Tag, top: "16%", left: "78%" },
                { label: "Packaging Sourcing", icon: Boxes, top: "76%", left: "22%" },
                { label: "Brand Presentation", icon: Sparkles, top: "78%", left: "76%" },
              ].map((n) => (
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

      {/* Why Packaging & Labeling */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">Why brands choose our Packaging &amp; Labeling</h2>
            <p className="mt-3 text-[16px] text-text-body">Our end-to-end service protects your products and elevates your brand.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-action-blue/10 flex items-center justify-center mx-auto mb-5">
                  <b.icon className="w-7 h-7 text-action-blue" />
                </div>
                <h3 className="text-[16px] font-bold text-deep-navy mb-2">{b.title}</h3>
                <p className="text-[14px] text-text-body leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">How packaging &amp; labeling works</h2>
            <p className="mt-3 text-[16px] text-text-body">From request to delivery — seamless and stress-free.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "1", icon: Users, title: "Submit Your Request", desc: "Share your packaging needs, artwork, labels, and branding requirements." },
              { num: "2", icon: Box, title: "Review & Approve", desc: "We provide sample proofs and recommend the best materials and solutions." },
              { num: "3", icon: Layers, title: "Production & Prep", desc: "We source, print, and prepare all packaging and labels to your specifications." },
              { num: "4", icon: Package, title: "Pack & Ship", desc: "Your products are packed, labeled, and shipped — on-brand and on time, every time." },
            ].map((s, i) => (
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
                {i < 3 && (
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
            <h2 className="text-[30px] font-bold text-deep-navy">Complete packaging &amp; labeling solutions</h2>
            <p className="mt-3 text-[16px] text-text-body">Everything you need to protect your products and build your brand.</p>
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
            <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-px bg-border-blue" />
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
                The packaging partner <br /> e-commerce <span className="gradient-text-teal">brands trust</span>
              </h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[440px]">Whether you&apos;re launching a new product or scaling your catalog, we help you create packaging and labeling that strengthens your brand and delights your customers.</p>
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
                  <h4 className="text-[13px] font-bold text-deep-navy mb-3">Packaging Requests</h4>
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
                              <td key={j} className={`px-2 py-1.5 text-[9px] ${j === 0 ? "font-semibold text-deep-navy" : "text-text-body"}`}>{c}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button className="mt-3 text-[11px] font-semibold text-white bg-navy border border-transparent rounded-md px-3 py-1.5 hover:bg-deep-navy transition-colors">View All Requests</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected platform stats */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pb-20">
          <div className="bg-deep-navy rounded-2xl p-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">ONE CONNECTED PLATFORM</span>
                <h2 className="mt-5 text-[28px] font-bold text-white leading-tight">
                  Packaging &amp; Labeling, connected to your fulfillment operations
                </h2>
                <p className="mt-4 text-[15px] text-text-on-dark-muted leading-relaxed max-w-[400px]">
                  Seamlessly manage packaging requests, labels, and inserts alongside orders, shipments, and inventory — all in one platform.
                </p>
                <Link href="/solutions" className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-teal">
                  Learn more about our platform <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <s.icon className="w-8 h-8 text-teal mx-auto mb-3" />
                    <p className="text-[32px] font-bold text-white leading-none">{s.value}</p>
                    <p className="mt-2 text-[13px] text-text-on-dark-soft">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-soft-bg">
        <div className="max-w-[800px] mx-auto px-6 py-20">
          <h2 className="text-[30px] font-bold text-deep-navy text-center mb-12">Questions? We&apos;ve got answers.</h2>
          <div className="space-y-4">
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
      <section className="bg-soft-bg pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14">
            <h2 className="text-[30px] font-bold leading-tight">Elevate your brand with packaging that stands out.</h2>
            <p className="mt-3 text-[16px] text-text-on-dark-muted">Let&apos;s create packaging and labeling solutions your customers will love.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">
                Find My Match <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] border border-white/30 hover:bg-white/10 transition-all">
                Book a Demo
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
