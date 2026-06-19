import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck, Microscope, FileSearch, ClipboardCheck, Camera, AlertTriangle,
  Search, FileText, Wrench, Truck, ScanLine, Tag, Lock, Star,
  CheckCircle2, ArrowRight, Quote, TrendingUp,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import QualityControlFaq from "./QualityControlFaq";

export const metadata: Metadata = pageMetadata({
  title: "Quality Control & Product Inspection Services",
  description:
    "China-based quality control with PPI, in-line (DUPRO), and final random inspections using AQL sampling. Catch defects early, cut returns, and ship with confidence.",
  path: "/solutions/quality-control",
  keywords: [
    "china quality control",
    "product inspection services",
    "pre-shipment inspection",
    "AQL inspection",
    "factory quality control",
  ],
});

const benefits = [
  { icon: ShieldCheck, title: "Catch Issues Early", desc: "Identify defects and inconsistencies before they reach your customers and become costly problems." },
  { icon: Tag, title: "Reduce Returns & Costs", desc: "Lower return rates, chargebacks, and rework costs with reliable inspections." },
  { icon: Lock, title: "Protect Your Brand", desc: "Ensure products meet your quality standards and reinforce customer trust in your brand." },
  { icon: Star, title: "Consistent Standards", desc: "Maintain high-quality benchmarks across suppliers, factories, and production runs." },
];

const features = [
  { icon: ClipboardCheck, title: "Pre-Production Inspection (PPI)", desc: "Evaluate raw materials, components, workmanship, and factory readiness before production begins." },
  { icon: ScanLine, title: "In-Line Inspection (DUPRO)", desc: "Monitor production and catch quality issues early while there's still time to correct them." },
  { icon: FileSearch, title: "Final Random Inspection (FRI)", desc: "Randomly inspect finished products against AQL standards to ensure overall quality compliance." },
  { icon: Microscope, title: "Sample Verification", desc: "Verify samples against your approved specifications, materials, and workmanship." },
  { icon: Camera, title: "Photo & Video Reports", desc: "Receive clear, timestamped photo and video evidence with detailed inspection findings." },
  { icon: AlertTriangle, title: "Issue Escalation", desc: "Critical issues are escalated in real-time with actionable recommendations and follow-up." },
];

const timeline = [
  { icon: ClipboardCheck, title: "Pre-Production", desc: "Review specs, materials, and factory readiness before production starts." },
  { icon: ScanLine, title: "In-Line Inspection", desc: "Inspect during production to identify and correct issues early." },
  { icon: Search, title: "Pre-Shipment (FRI)", desc: "Randomly inspect finished goods using AQL sampling standards." },
  { icon: FileText, title: "Report & Review", desc: "Detailed reports with photos, scores, and recommendations." },
  { icon: Wrench, title: "Corrective Action", desc: "Work with the factory to resolve issues and re-inspect if needed." },
  { icon: Truck, title: "Ship With Confidence", desc: "Approve shipment only when quality meets your standards." },
];

const reportBullets = [
  "Customizable checklists & AQL standards",
  "High-resolution photos & videos",
  "Defect classification & root cause",
  "Downloadable PDF reports",
];

const dashColumns = ["Supplier", "Type", "Date", "Status", "Score", "Defects", "AQL", "Action"];
const dashRows = [
  { cols: ["Shenzhen Precision Co.", "FRI", "Jun 10", "Pass", "98.6%", "2", "2.5", "View"] },
  { cols: ["Ningbo Bright Mfg.", "DUPRO", "Jun 8", "Pass", "96.3%", "4", "2.5", "View"] },
  { cols: ["Dongguan Textiles Ltd.", "PPI", "Jun 6", "Review", "91.2%", "7", "4.0", "View"] },
  { cols: ["Suzhou Advanced Co.", "FRI", "Jun 4", "Pass", "97.8%", "3", "2.5", "View"] },
  { cols: ["Qingdao Plastics", "DUPRO", "Jun 2", "Pass", "95.1%", "5", "4.0", "View"] },
];

const stats = [
  { value: "78%", label: "Reduction in returns within 3 months" },
  { value: "2.6x", label: "Fewer quality issues year over year" },
  { value: "98.6%", label: "Average quality score across all inspections" },
  { value: "100+", label: "Trusted by brands worldwide" },
];

export default function QualityControlPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">OUR SOLUTIONS</span>
              <h1 className="mt-5 text-[36px] lg:text-[46px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                Quality Control that protects your brand and delivers{" "}
                <span className="gradient-text-teal">consistent quality.</span>
              </h1>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh provides rigorous inspections at every stage of production to reduce defects, prevent costly returns, and ensure your customers receive only the best.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] bg-deep-navy hover:bg-navy hover:shadow-button transition-all">
                  Book a Quality Check <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-[10px] border border-border-blue bg-white hover:shadow-soft transition-all">
                  Talk to an Expert
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {["Vetted Inspectors", "Global Coverage", "No Hidden Fees"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Inspection illustration */}
            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-navy to-deep-navy h-[300px] overflow-hidden relative shadow-card">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-white/15" />
              </div>
              {/* Inspection passed card */}
              <div className="absolute top-6 left-4 bg-white rounded-xl shadow-card border border-border-soft p-3 w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-deep-navy">Inspection Passed</span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-teal bg-teal/10 rounded-full px-2 py-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Pass
                  </span>
                </div>
                <p className="text-[22px] font-bold text-deep-navy leading-none">98.6%</p>
                <p className="text-[9px] text-text-muted mt-0.5 mb-2">Quality Score</p>
                <p className="text-[9px] font-semibold text-deep-navy mb-1">Top Defect Types</p>
                {[["Cosmetic", "62%"], ["Functional", "24%"], ["Packaging", "14%"]].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-[8px] text-text-muted">
                    <span>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
              {/* QC checklist card */}
              <div className="absolute bottom-6 right-4 bg-white rounded-xl shadow-card border border-border-soft p-3 w-[170px]">
                <p className="text-[10px] font-bold text-deep-navy mb-2">QC Checklist</p>
                {["Dimensions", "Workmanship", "Functionality", "Labeling", "Packaging"].map((c) => (
                  <div key={c} className="flex items-center gap-1.5 text-[9px] text-text-body mb-1">
                    <CheckCircle2 className="w-3 h-3 text-teal shrink-0" /> {c}
                  </div>
                ))}
              </div>
              {/* Quality guaranteed badge */}
              <div className="absolute -bottom-3 left-8 bg-deep-navy text-white rounded-xl shadow-card px-3 py-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal" />
                <div>
                  <p className="text-[10px] font-bold leading-none">Quality Guaranteed</p>
                  <p className="text-[8px] text-text-on-dark-soft mt-0.5">Inspection-backed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">Built to deliver confidence in every shipment</h2>
            <p className="mt-3 text-[16px] text-text-body">Our quality control solutions help you minimize risk and maximize customer satisfaction.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-xl p-6 border border-border-soft">
                <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-action-blue" />
                </div>
                <h3 className="text-[15px] font-bold text-deep-navy mb-1.5">{b.title}</h3>
                <p className="text-[13px] text-text-body leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">Comprehensive quality control services</h2>
            <p className="mt-3 text-[16px] text-text-body">Tailored inspections and quality checks across your entire supply chain.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-border-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-action-blue" />
                </div>
                <h3 className="text-[15px] font-bold text-deep-navy">{f.title}</h3>
                <p className="mt-2 text-[13px] text-text-body leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[680px] mx-auto mb-16">
            <h2 className="text-[30px] font-bold text-deep-navy">Quality control at every stage of production</h2>
            <p className="mt-3 text-[16px] text-text-body">Our proven inspection process ensures issues are caught early and resolved fast.</p>
          </div>
          <div className="relative grid md:grid-cols-6 gap-5">
            <div className="hidden md:block absolute top-7 left-[7%] right-[7%] h-px bg-teal/40" />
            {timeline.map((t, i) => (
              <div key={i} className="relative">
                <div className="w-14 h-14 rounded-full bg-white border border-border-soft shadow-soft flex items-center justify-center mb-5 relative z-10 mx-auto">
                  <t.icon className="w-6 h-6 text-action-blue" />
                </div>
                <h3 className="text-[14px] font-bold text-deep-navy text-center">
                  <span className="block text-[12px] font-semibold text-text-muted">{i + 1}.</span>
                  {t.title}
                </h3>
                <p className="mt-2 text-[12px] text-text-muted leading-relaxed text-center">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent reporting + report mockup */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">BUILT FOR GROWING BRANDS</span>
              <h2 className="mt-5 text-[30px] font-bold text-deep-navy leading-tight">
                Transparent reporting <br /> you can <span className="gradient-text-teal">trust</span>
              </h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[440px]">Clear, detailed inspection reports delivered quickly with actionable insights.</p>
              <div className="mt-6 space-y-3">
                {reportBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
                    <span className="text-[14px] text-text-body">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Report card mockup */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-soft">
                <span className="flex items-center gap-2 text-[12px] font-bold text-deep-navy">
                  <span className="w-6 h-6 rounded-md gradient-logo flex items-center justify-center text-white text-[10px] font-bold">FM</span>
                  Final Random Inspection Report
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-teal bg-teal/10 rounded-full px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Pass
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[24px] font-bold text-deep-navy leading-none">98.6%</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Overall Quality Score</p>
                  </div>
                  <div className="text-right text-[10px] text-text-muted">
                    <p>AQL 2.5 · 200 pcs</p>
                    <p>Shenzhen Precision Co.</p>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  {[["Critical defects", "0"], ["Major defects", "2"], ["Minor defects", "5"]].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-[10px]">
                      <span className="text-text-body">{k}</span>
                      <span className="font-semibold text-deep-navy">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="aspect-[4/3] rounded-md bg-soft-bg border border-border-soft flex items-center justify-center">
                      <Camera className="w-4 h-4 text-text-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manage quality dashboard */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">ONE CONNECTED PLATFORM</span>
              <h2 className="mt-5 text-[30px] font-bold text-deep-navy leading-tight">
                Manage quality with complete visibility
              </h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[440px]">
                Track inspections, scores, and issues alongside orders, shipments, and warehouse operations — all in one platform.
              </p>
              <Link href="/solutions" className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-action-blue">
                Learn more about our platform <ArrowRight className="w-4 h-4" />
              </Link>
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
                  {["Overview", "Orders", "Suppliers", "Quality Control", "Shipments", "Warehouses", "Reports", "Settings"].map((m, i) => (
                    <p key={m} className={`text-[11px] ${i === 3 ? "text-teal font-semibold" : "text-text-muted"}`}>{m}</p>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-[13px] font-bold text-deep-navy mb-2.5">QC Inspection Results</h4>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[["Avg Score", "98.6%"], ["Inspections", "128"], ["Pass Rate", "96.3%"]].map(([l, v]) => (
                      <div key={l} className="border border-border-soft rounded-lg p-2">
                        <p className="text-[8px] text-text-muted leading-tight">{l}</p>
                        <p className="text-[14px] font-bold text-deep-navy leading-tight mt-0.5">{v}</p>
                        <p className="text-[7px] text-teal mt-0.5 flex items-center gap-0.5"><TrendingUp className="w-2 h-2" /> +2.4%</p>
                      </div>
                    ))}
                  </div>
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
                              <td key={j} className={`px-2 py-1.5 text-[8px] ${j === 0 ? "font-semibold text-deep-navy" : j === 3 ? (c === "Pass" ? "font-semibold text-teal" : "font-semibold text-amber-500") : "text-text-body"}`}>{c}</td>
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

      {/* Real results */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-center">
            <div className="relative">
              <Quote className="w-8 h-8 text-teal/30 mb-3" />
              <p className="text-[14px] text-text-body leading-relaxed italic">
                FulfillMesh&apos;s QC inspections have drastically reduced our return rate and given us confidence in every shipment. Their reports are detailed, fast, and easy to act on.
              </p>
              <p className="mt-4 text-[13px] font-bold text-deep-navy">Jessica L.</p>
              <p className="text-[12px] text-text-muted">Head of Operations, UrbanTrend Co.</p>
            </div>
            <div>
              <h2 className="text-[26px] font-bold text-deep-navy mb-8">Real results from brands like yours</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-[36px] font-bold gradient-text-teal leading-none">{s.value}</p>
                    <p className="mt-2 text-[13px] text-text-muted leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="max-w-[1000px] mx-auto px-6 py-20">
          <h2 className="text-[30px] font-bold text-deep-navy text-center mb-12">Questions? We&apos;ve got answers.</h2>
          <QualityControlFaq />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14">
            <h2 className="text-[30px] font-bold leading-tight">Ensure quality. Protect your brand. Delight your customers.</h2>
            <p className="mt-3 text-[16px] text-text-on-dark-muted">Schedule an inspection today and ship with confidence.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">
                Book a Quality Check <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] border border-white/30 hover:bg-white/10 transition-all">
                Talk to an Expert
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["Free to get started", "No obligations", "Fast response"].map((t) => (
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
