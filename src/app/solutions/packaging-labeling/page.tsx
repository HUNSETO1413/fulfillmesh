import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText, Tag, Boxes, ScanLine, ShieldCheck, Sparkles,
  Send, ClipboardCheck, Layers, Package, CheckCircle2, ArrowRight, Calendar,
  Heart, Gauge, BadgeCheck,
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

const features = [
  { icon: FileText, title: "Custom Inserts", desc: "Thank you cards, product guides, promotional inserts, and more—fully customized for your brand." },
  { icon: Tag, title: "Private Labeling", desc: "Add your logo, brand colors, and messaging to packaging, stickers, inserts, and tape." },
  { icon: Boxes, title: "Packaging Sourcing", desc: "Access a network of vetted packaging suppliers for mailers, boxes, tissue, and eco-friendly options." },
  { icon: ScanLine, title: "Barcode & SKU Labeling", desc: "Accurate barcode, FNSKU, and SKU labeling for marketplaces, retail, and internal tracking." },
  { icon: ShieldCheck, title: "Compliance Labeling", desc: "Regulatory, safety, and compliance labels applied correctly to meet marketplace and industry standards." },
  { icon: Sparkles, title: "Brand Presentation", desc: "Premium unboxing experience with consistent packaging that reflects your brand values." },
];

const steps = [
  { num: "01", icon: Send, title: "Submit Your Request", desc: "Share your packaging needs, artwork, labels, and branding requirements." },
  { num: "02", icon: ClipboardCheck, title: "Review & Approve", desc: "We provide sample proofs and recommend the best materials and solutions." },
  { num: "03", icon: Layers, title: "Production & Prep", desc: "We source, print, and prepare all packaging and labels to your specifications." },
  { num: "04", icon: Package, title: "Pack & Ship", desc: "Your products are packed, labeled, and shipped—on-brand and on time, every time." },
];

const platformBenefits = [
  { icon: Sparkles, title: "Stronger Brand Consistency", desc: "Ensure every package reflects your brand identity, from colors to messaging." },
  { icon: Heart, title: "Better Customer Experience", desc: "Premium unboxing creates memorable moments and boosts repeat purchases." },
  { icon: Gauge, title: "Operational Efficiency", desc: "Pre-approved packaging and labels reduce errors, rework, and delays." },
  { icon: BadgeCheck, title: "Packaging Accuracy", desc: "Correct labels, barcodes, and packaging every time—no mistakes, no returns." },
];

const platformBullets = [
  "Submit and track packaging requests",
  "Access approved artwork and documentation",
  "Monitor production and delivery status",
  "Integrated into orders, products, and SKUs",
];

const dashStats = [
  { label: "Open Requests", value: "12", delta: "+20%" },
  { label: "In Production", value: "8", delta: "+14%" },
  { label: "Ready to Ship", value: "15", delta: "+9%" },
  { label: "Completed (30 Days)", value: "48", delta: "+18%" },
];

const dashColumns = ["Request ID", "Type", "Items", "Status", "Requested By", "ETA"];
const dashRows = [
  { cols: ["PKG-10234", "Custom Inserts", "3", "In Production", "Sarah Johnson", "May 20, 2025"] },
  { cols: ["PKG-10233", "Private Labeling", "5", "Ready to Ship", "Michael Lee", "May 21, 2025"] },
  { cols: ["PKG-10232", "Barcode Labels", "2", "In Production", "Priya Patel", "May 21, 2025"] },
  { cols: ["PKG-10231", "Custom Mailers", "4", "Completed", "James Wilson", "May 16, 2025"] },
];

const statusStyle = (s: string) => {
  if (s === "Ready to Ship") return "bg-teal/10 text-teal";
  if (s === "Completed") return "bg-action-blue/10 text-action-blue";
  return "bg-[#FEF3E2] text-[#C77700]";
};

export default function PackagingLabelingPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">OUR SOLUTIONS</span>
              <h1 className="mt-5 text-[40px] lg:text-[44px] font-extrabold text-deep-navy leading-[1.12] tracking-tight">
                Packaging &amp; Labeling that <span className="gradient-text-teal">elevates your brand</span> and delights customers
              </h1>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed max-w-[490px]">
                FulfillMesh delivers custom packaging, labeling, and inserts tailored to your brand and product. From concept to delivery, we ensure every package leaves the right impression—accurate, compliant, and on-brand.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] bg-deep-navy hover:bg-navy hover:shadow-button transition-all">
                  Request Packaging Quote
                </Link>
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-[10px] border border-border-blue bg-white hover:shadow-soft transition-all">
                  <Calendar className="w-4 h-4" /> Book a Demo
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {["Vetted Packaging Partners", "End-to-End Support", "No Hidden Fees"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Packaging illustration */}
            <div className="relative hidden lg:block h-[420px]">
              {/* Navy mailer box */}
              <div className="absolute top-0 right-6 w-[300px]">
                <div className="h-7 bg-navy rounded-t-xl skew-x-0" />
                <div className="bg-deep-navy rounded-b-xl rounded-tr-xl p-6 shadow-card relative h-[180px]">
                  <p className="text-white text-[16px] font-semibold leading-snug">Good things<br />inside.</p>
                  <p className="text-text-on-dark-muted text-[10px] mt-2">Thanks for choosing us.</p>
                  <div className="absolute bottom-5 left-6 w-8 h-8 rounded-md gradient-logo flex items-center justify-center text-white text-[11px] font-bold">FM</div>
                </div>
              </div>

              {/* Small white box */}
              <div className="absolute top-[150px] left-2 w-[110px] h-[110px] bg-white rounded-xl border border-border-soft shadow-card flex items-center justify-center">
                <span className="text-navy font-bold text-[15px]">Fulfill<span className="text-teal">Mesh</span></span>
              </div>

              {/* Shipping label */}
              <div className="absolute top-[110px] right-0 w-[140px] bg-white rounded-lg border border-border-soft shadow-card p-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 bg-deep-navy text-white text-[14px] font-bold rounded flex items-center justify-center">P</span>
                  <span className="text-[7px] font-bold text-deep-navy">PRIORITY MAIL 2-DAY</span>
                </div>
                <div className="mt-2 flex gap-[2px] h-8 items-end">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span key={i} className="bg-deep-navy" style={{ width: 2, height: `${(i % 3) * 30 + 40}%` }} />
                  ))}
                </div>
                <p className="mt-1 text-[6px] text-text-muted">USPS TRACKING #</p>
                <div className="mt-1 space-y-[2px]">
                  <div className="h-1 bg-border-soft rounded w-full" />
                  <div className="h-1 bg-border-soft rounded w-3/4" />
                </div>
              </div>

              {/* Thank you card */}
              <div className="absolute bottom-6 left-[70px] w-[185px] bg-white rounded-xl border border-border-soft shadow-card p-4">
                <p className="text-deep-navy font-bold text-[15px]">Thank you!</p>
                <p className="text-text-muted text-[9px] mt-1 leading-relaxed">We appreciate your order and the trust you put in us.</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    <span className="w-4 h-4 rounded bg-action-blue/20" />
                    <span className="w-4 h-4 rounded bg-teal/20" />
                  </div>
                  <span className="text-[8px] text-text-muted">fulfillmesh.com</span>
                </div>
              </div>

              {/* Label sticker roll */}
              <div className="absolute bottom-0 right-2 w-[120px] h-[120px] rounded-full bg-deep-navy shadow-card flex items-center justify-center">
                <div className="w-[78px] h-[78px] rounded-full bg-white flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full gradient-logo flex items-center justify-center text-white text-[11px] font-bold">FM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete packaging & labeling solutions */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">Complete packaging &amp; labeling solutions</h2>
            <p className="mt-3 text-[16px] text-text-body">Everything you need to protect your products and build your brand.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-border-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-action-blue" />
                </div>
                <h3 className="text-[16px] font-bold text-deep-navy">{f.title}</h3>
                <p className="mt-2 text-[13px] text-text-body leading-relaxed">{f.desc}</p>
                <Link href="/get-started" className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-action-blue">Learn more <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packaging that represents your brand */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">Packaging that represents your brand</h2>
            <p className="mt-3 text-[16px] text-text-body">High-quality materials. On-brand details. Memorable unboxing experiences.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Navy mailer with thank you */}
            <div className="aspect-square rounded-2xl bg-deep-navy shadow-card p-5 flex flex-col justify-end">
              <p className="text-white font-bold text-[16px]">Thank you!</p>
              <p className="text-text-on-dark-muted text-[9px] mt-1 leading-relaxed">We appreciate your order and the trust you put in us.</p>
              <div className="mt-3 w-7 h-7 rounded-md gradient-logo flex items-center justify-center text-white text-[10px] font-bold">FM</div>
            </div>
            {/* FM-branded mailer */}
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#EAF0F8] to-[#D9E5F2] shadow-card flex items-center justify-center">
              <span className="text-navy font-bold text-[22px]">Fulfill<span className="text-teal">Mesh</span></span>
            </div>
            {/* Kraft box with sticker roll */}
            <div className="aspect-square rounded-2xl bg-[#C9A877] shadow-card relative flex items-center justify-center">
              <div className="w-16 h-16 rounded bg-[#B8946A] border border-[#a07f55]" />
              <div className="absolute bottom-5 right-5 w-12 h-12 rounded-full bg-deep-navy flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[8px] font-bold text-navy">FM</div>
              </div>
            </div>
            {/* Shipping label */}
            <div className="aspect-square rounded-2xl bg-white border border-border-soft shadow-card p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 bg-deep-navy text-white text-[15px] font-bold rounded flex items-center justify-center">P</span>
                <span className="text-[8px] font-bold text-deep-navy text-right">PRIORITY<br />MAIL 2-DAY</span>
              </div>
              <div className="mt-3 flex gap-[2px] h-10 items-end">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span key={i} className="bg-deep-navy" style={{ width: 2, height: `${(i % 4) * 22 + 34}%` }} />
                ))}
              </div>
              <p className="mt-2 text-[7px] text-text-muted">USPS TRACKING #</p>
              <div className="mt-auto space-y-[3px]">
                <div className="h-1.5 bg-border-soft rounded w-full" />
                <div className="h-1.5 bg-border-soft rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How packaging & labeling works */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">How packaging &amp; labeling works</h2>
            <p className="mt-3 text-[16px] text-text-body">From request to delivery—seamless and stress-free.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                <div className="bg-white rounded-xl border border-border-soft shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-action-blue" />
                    </div>
                    <span className="text-[20px] font-extrabold text-border-blue">{s.num}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-deep-navy">{s.title}</h3>
                  <p className="mt-2 text-[13px] text-text-muted leading-relaxed">{s.desc}</p>
                </div>
                {i < 3 && (
                  <ArrowRight className="hidden lg:block absolute top-[42px] -right-4 -translate-y-1/2 w-4 h-4 text-border-blue z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The benefits of great packaging */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">The benefits of great packaging</h2>
            <p className="mt-3 text-[16px] text-text-body">Great packaging does more than protect—it drives loyalty and growth.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformBenefits.map((b) => (
              <div key={b.title} className="bg-white rounded-xl p-6 border border-border-soft text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-[15px] font-bold text-deep-navy mb-2">{b.title}</h3>
                <p className="text-[13px] text-text-body leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packaging requests. Seamlessly integrated. */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">ONE CONNECTED PLATFORM</span>
              <h2 className="mt-5 text-[30px] font-bold text-deep-navy leading-tight">
                Packaging requests.<br />Seamlessly integrated.
              </h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[440px]">
                Manage all your packaging and labeling tasks in one place—designed to keep your operations aligned and your supply chain moving.
              </p>
              <div className="mt-6 space-y-3">
                {platformBullets.map((b) => (
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
                <span className="flex items-center gap-1.5 text-[10px] text-text-muted">
                  <Calendar className="w-3 h-3" /> May 12 – May 18, 2025
                </span>
              </div>
              <div className="flex">
                <div className="w-[96px] shrink-0 border-r border-border-soft py-3 px-3 space-y-2 hidden sm:block">
                  {["Overview", "Orders", "Shipments", "Inventory", "Packaging", "Quality Control", "Warehouses", "Reports", "Settings"].map((m) => (
                    <p key={m} className={`text-[10px] ${m === "Packaging" ? "text-teal font-semibold" : "text-text-muted"}`}>{m}</p>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-[13px] font-bold text-deep-navy mb-3">Packaging</h4>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {dashStats.map((s) => (
                      <div key={s.label} className="rounded-lg border border-border-soft p-2">
                        <p className="text-[8px] text-text-muted leading-tight">{s.label}</p>
                        <p className="text-[15px] font-bold text-deep-navy mt-1">{s.value}</p>
                        <p className="text-[7px] text-teal font-semibold mt-0.5">{s.delta} vs last 30 days</p>
                      </div>
                    ))}
                  </div>
                  <h5 className="text-[11px] font-bold text-deep-navy mb-2">Recent Packaging Requests</h5>
                  <div className="overflow-hidden rounded-lg border border-border-soft">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#F9FAFB]">
                          {dashColumns.map((c) => (
                            <th key={c} className="px-2 py-1.5 text-[8px] font-semibold text-text-muted">{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dashRows.map((r, i) => (
                          <tr key={i} className="border-t border-border-soft">
                            {r.cols.map((c, j) => (
                              <td key={j} className="px-2 py-1.5 text-[8px]">
                                {j === 3 ? (
                                  <span className={`inline-block rounded px-1.5 py-0.5 font-semibold ${statusStyle(c)}`}>{c}</span>
                                ) : (
                                  <span className={j === 0 ? "font-semibold text-deep-navy" : "text-text-body"}>{c}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white pb-20 pt-0">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14">
            <h2 className="text-[30px] font-bold leading-tight">Elevate your brand with packaging that stands out.</h2>
            <p className="mt-3 text-[16px] text-text-on-dark-muted">Let&apos;s create packaging and labeling solutions your customers will love.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">
                Request Packaging Quote
              </Link>
              <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] border border-white/30 hover:bg-white/10 transition-all">
                <Calendar className="w-4 h-4" /> Book a Demo
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["Vetted Packaging Partners", "No Obligation", "Fast, Transparent Quotes"].map((t) => (
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
