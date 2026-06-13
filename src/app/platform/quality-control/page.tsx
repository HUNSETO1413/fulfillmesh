import type { Metadata } from "next";
import {
  ShieldCheck, Camera, ClipboardCheck, AlertTriangle, FileCheck, Users,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import PlatformLayout from "@/components/PlatformLayout";

export const metadata: Metadata = pageMetadata({
  title: "Quality Control",
  description:
    "Book pre-shipment inspections, review photo and video evidence, and approve or reject lots before goods leave the factory in China — protecting your brand and your margins.",
  path: "/platform/quality-control",
  keywords: [
    "quality control inspection",
    "pre-shipment inspection china",
    "factory qc software",
    "product defect tracking",
    "supplier quality management",
  ],
});

const heroStats = [
  { label: "Inspections / month", value: "642", delta: "+9.3%" },
  { label: "Pass Rate", value: "96.8%", delta: "+1.4 pp" },
  { label: "Avg. Defect Rate", value: "0.9%", delta: "-0.4 pp" },
  { label: "Holds Resolved", value: "98%", delta: "+3 pp" },
];

const inspectionRows: { lot: string; supplier: string; result: string; status: string; color: string }[] = [
  { lot: "QC-3391", supplier: "Shenzhen Lumi Co.", result: "AQL 2.5", status: "Passed", color: "text-teal" },
  { lot: "QC-3390", supplier: "Yiwu Brightline", result: "AQL 4.0", status: "Minor defects", color: "text-[#F59E0B]" },
  { lot: "QC-3389", supplier: "Dongguan Forma", result: "AQL 2.5", status: "Rejected", color: "text-[#E11D48]" },
  { lot: "QC-3388", supplier: "Ningbo Crest", result: "AQL 1.5", status: "Scheduled", color: "text-text-muted" },
];

function HeroMockup() {
  return (
    <div className="bg-white rounded-2xl border border-border-soft shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-bold text-deep-navy">Inspection Queue</span>
        <span className="text-[11px] text-text-muted">Pre-shipment · this week</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {heroStats.map((s) => (
          <div key={s.label} className="border border-border-soft rounded-lg p-2.5">
            <p className="text-[9px] text-text-muted leading-none mb-1">{s.label}</p>
            <p className="text-[15px] font-bold text-deep-navy leading-tight">{s.value}</p>
            <p className={`text-[8px] font-medium mt-0.5 ${s.delta.startsWith("-") ? "text-teal" : "text-teal"}`}>{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-border-soft">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-soft-bg">
              {["Lot", "Supplier", "AQL", "Result"].map((c) => (
                <th key={c} className="px-2.5 py-2 text-[9px] font-semibold text-text-muted">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inspectionRows.map((r) => (
              <tr key={r.lot} className="border-t border-border-soft">
                <td className="px-2.5 py-2 text-[9px] font-semibold text-deep-navy">{r.lot}</td>
                <td className="px-2.5 py-2 text-[9px] text-text-body">{r.supplier}</td>
                <td className="px-2.5 py-2 text-[9px] text-text-body">{r.result}</td>
                <td className={`px-2.5 py-2 text-[9px] font-medium ${r.color}`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OutcomeMockup() {
  return (
    <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-bold text-deep-navy">Inspection Report · QC-3390</p>
        <span className="text-[10px] font-medium text-[#F59E0B] bg-[#F59E0B]/10 rounded-full px-2 py-0.5">Minor defects</span>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="aspect-square rounded-lg bg-soft-bg border border-border-soft flex items-center justify-center">
            <Camera className="w-5 h-5 text-text-light" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { l: "Critical defects", v: "0 / 0.0%", c: "text-teal" },
          { l: "Major defects", v: "2 / 0.4%", c: "text-[#F59E0B]" },
          { l: "Minor defects", v: "7 / 1.6%", c: "text-text-body" },
        ].map((d) => (
          <div key={d.l} className="flex items-center justify-between text-[11px]">
            <span className="text-text-body">{d.l}</span>
            <span className={`font-semibold ${d.c}`}>{d.v}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <span className="flex-1 text-center text-[11px] font-semibold text-white bg-navy rounded-md py-1.5">Approve with note</span>
        <span className="flex-1 text-center text-[11px] font-semibold text-deep-navy border border-border-soft rounded-md py-1.5">Request rework</span>
      </div>
    </div>
  );
}

export default function QualityControlPlatformPage() {
  return (
    <PlatformLayout
      eyebrow="QUALITY CONTROL"
      title="Catch defects in China,"
      highlight="not in returns."
      heroDesc="FulfillMesh puts a quality gate between your factory and your customer. Book inspections, review photo and video evidence, and approve or reject every lot before it ships."
      heroPills={["AQL inspections", "Photo & video evidence", "Approve before ship"]}
      mockup={<HeroMockup />}
      narrativeTitle="A bad lot found at the border is already too late"
      narrativeSubtitle="By the time defective goods reach your customers, you have paid freight, lost the sale, and damaged the brand."
      narrative={[
        {
          problem: "Factories self-report quality, and you only discover problems once products are in customers' hands.",
          solution: "Independent pre-shipment inspections happen before goods leave China, with evidence you can review.",
        },
        {
          problem: "Inspection results arrive as scattered PDFs and chat photos with no consistent standard.",
          solution: "Every inspection follows an AQL standard and lands as a structured, comparable report.",
        },
        {
          problem: "Recurring defects from the same supplier go unnoticed until they cost you real money.",
          solution: "Defect trends are tracked per supplier and per SKU so you can act before it repeats.",
        },
      ]}
      capabilitiesTitle="A complete quality workflow"
      capabilitiesSubtitle="From booking the inspection to signing off the lot."
      capabilities={[
        { icon: ClipboardCheck, title: "Inspection Scheduling", desc: "Book pre-production, during-production and pre-shipment checks against AQL sampling levels." },
        { icon: Camera, title: "Photo & Video Evidence", desc: "Inspectors upload time-stamped photos and clips of defects, packaging and labeling on site." },
        { icon: ShieldCheck, title: "Pass / Hold / Reject", desc: "Approve a lot, place it on hold pending rework, or reject it — and shipment is gated on the result." },
        { icon: AlertTriangle, title: "Defect Tracking", desc: "Classify critical, major and minor defects and watch trends build up per supplier and SKU." },
        { icon: FileCheck, title: "Shareable Reports", desc: "Export clean inspection reports for your team, your retailers or a dispute in seconds." },
        { icon: Users, title: "Supplier Scorecards", desc: "Rank suppliers on pass rate, defect rate and responsiveness to focus your sourcing." },
      ]}
      outcomesTitle="Protect your brand and your margins"
      outcomes={[
        "Stop defective lots before they ship and incur freight",
        "Cut customer returns and refund disputes",
        "Hold suppliers accountable with consistent, documented standards",
        "Build a defect history that improves sourcing decisions",
      ]}
      outcomeMockup={<OutcomeMockup />}
      ctaTitle="Make quality a gate, not a gamble"
      ctaDesc="See how FulfillMesh inspects and signs off every lot before it leaves China."
      prevLink={{ href: "/platform/order-management", label: "Order Management" }}
      nextLink={{ href: "/platform/shipping-logistics", label: "Shipping & Logistics" }}
    />
  );
}
