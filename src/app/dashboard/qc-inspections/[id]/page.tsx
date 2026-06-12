import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ChevronRight, Download, Package,
  CheckCircle2, XCircle, MinusCircle, FileText, FileSpreadsheet, FileArchive,
  Clock, AlertTriangle, Send, RotateCcw, Ban, ArrowLeft, ArrowRight,
} from "lucide-react";
import { qcInspections } from "@/lib/repositories";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate } from "@/lib/format";
import QcDetailActions from "./QcDetailActions";

const checklist = [
  { item: "Product Appearance", result: "Passed" },
  { item: "Dimensions & Size", result: "Passed" },
  { item: "Material & Finish", result: "Passed" },
  { item: "Printing & Logo", result: "Failed" },
  { item: "Cap Functionality", result: "Passed" },
  { item: "Leak Test", result: "Passed" },
  { item: "Packaging & Labeling", result: "Failed" },
  { item: "Workmanship", result: "Passed" },
  { item: "Barcode & SKU", result: "N/A" },
  { item: "Quantity Verification", result: "Passed" },
];

const defects = [
  { name: "Major (Critical)", count: "10", pct: "45.8%", color: "#EF4444" },
  { name: "Minor (Major)", count: "8", pct: "36.4%", color: "#F59E0B" },
  { name: "Minor (Minor)", count: "4", pct: "18.1%", color: "#10B981" },
];

const topDefects = [
  { rank: 1, name: "Printing misalignment", count: "7", pct: "31.8%" },
  { rank: 2, name: "Logo fading / incomplete", count: "5", pct: "22.7%" },
  { rank: 3, name: "Label incorrect placement", count: "4", pct: "18.2%" },
];

const photos = [
  { label: "Overall appearance" },
  { label: "Logo misalignment" },
  { label: "Logo fading" },
  { label: "Label placement" },
  { label: "Surface scratch" },
  { label: "Outer carton" },
];

const reports = [
  { name: "QC_Report.pdf", size: "2.4 MB", icon: FileText, color: "text-[#EF4444]" },
  { name: "Inspection_Checklist.pdf", size: "1.12 MB", icon: FileText, color: "text-[#EF4444]" },
  { name: "Defect_Detail_Log.xlsx", size: "324 KB", icon: FileSpreadsheet, color: "text-[#10B981]" },
  { name: "Photo_Appendix.zip", size: "8.6 MB", icon: FileArchive, color: "text-[#F59E0B]" },
];

const timeline = [
  { title: "Inspection Created", time: "May 18, 2025 08:30 AM", user: "Emily Chen", icon: FileText, color: "bg-[#0057D8]" },
  { title: "Inspection In Progress", time: "May 18, 2025 01:00 PM", user: "John Smith", icon: Clock, color: "bg-[#0057D8]" },
  { title: "Issues Found", time: "May 18, 2025 10:15 AM", user: "John Smith", icon: AlertTriangle, color: "bg-[#F59E0B]" },
  { title: "Inspection Completed", time: "May 18, 2025 11:00 AM", user: "John Smith", icon: CheckCircle2, color: "bg-[#10B981]" },
];

const samples = [
  { name: "Sample #3 (Current)", units: "800 units", result: "Failed", date: "May 18, 2025" },
  { name: "Sample #2", units: "800 units", result: "Passed", date: "May 16, 2025" },
  { name: "Sample #1", units: "800 units", result: "Passed", date: "May 14, 2025" },
];

const followups = [
  { title: "Approve Shipment", desc: "Approve this lot for shipment despite the issues.", btn: "Approve Shipment", btnColor: "bg-[#10B981] hover:bg-[#059669]", icon: CheckCircle2, iconColor: "text-[#10B981]" },
  { title: "Request Re-inspection", desc: "Request the supplier to address issues and re-inspect.", btn: "Request Re-inspection", btnColor: "bg-[#F59E0B] hover:bg-[#D97706]", icon: RotateCcw, iconColor: "text-[#F59E0B]" },
  { title: "Reject & Hold Shipment", desc: "Reject this lot and place shipment on hold.", btn: "Reject & Hold", btnColor: "bg-[#EF4444] hover:bg-[#DC2626]", icon: Ban, iconColor: "text-[#EF4444]" },
];

function resultBadge(r: string) {
  if (r === "Passed") return { cls: "bg-[#10B981]/10 text-[#10B981]", Icon: CheckCircle2 };
  if (r === "Failed") return { cls: "bg-[#EF4444]/10 text-[#EF4444]", Icon: XCircle };
  return { cls: "bg-[#9AA8B8]/10 text-[#66758C]", Icon: MinusCircle };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `QC Inspection ${id}` };
}

export default async function QcInspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inspection = await qcInspections.get(id);
  if (!inspection) notFound();

  const circumference = 2 * Math.PI * 32;
  const defectOffsets = defects.reduce<number[]>((acc, d, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + parseFloat(defects[i - 1].pct));
    return acc;
  }, []);

  const headerFields = [
    { label: "Inspection ID", value: inspection.id, mono: true },
    { label: "Sample Size", value: inspection.sampleSize != null ? `${inspection.sampleSize} units` : "—" },
    { label: "Inspection Date", value: formatDate(inspection.scheduledDate) },
    { label: "Status", value: inspection.status, status: true },
  ];
  const headerFields2 = [
    { label: "Defect Rate", value: inspection.defectRate != null ? `${inspection.defectRate}%` : "—" },
    { label: "Supplier", value: inspection.supplier },
    { label: "Inspector", value: inspection.inspector ?? "Unassigned" },
    { label: "SKU", value: inspection.sku ?? "—", mono: true },
  ];

  return (
    <div className="space-y-5">
      {/* Back + Breadcrumb */}
      <div>
        <Link href="/dashboard/qc-inspections" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted hover:text-text-primary mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to QC Inspections
        </Link>
        <div className="flex items-center gap-1.5 text-[13px] text-text-light">
          <Link href="/dashboard/qc-inspections" className="hover:text-action-blue">QC Inspections</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-primary font-medium font-mono">{inspection.id}</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Inspection Detail</h1>
          <p className="text-[14px] text-text-body mt-1">Review inspection findings, photos, and actions taken.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body shadow-[0_1px_2px_rgba(0,0,0,0.05)]"><Download className="w-4 h-4" />Download Report</button>
          <QcDetailActions inspection={inspection} />
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
        <div className="flex flex-wrap gap-6">
          <div className="flex gap-4">
            <div className="w-20 h-24 rounded-lg bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] border border-border-soft overflow-hidden shrink-0" />
            <div>
              <h2 className="text-[16px] font-bold text-text-primary">{inspection.product}</h2>
              <p className="text-[11px] text-text-light mt-0.5">SKU: {inspection.sku ?? "—"}</p>
              <p className="text-[11px] text-text-light mt-2">Supplier</p>
              <p className="text-[13px] text-text-primary font-medium">{inspection.supplier}</p>
              <p className="text-[11px] text-text-light mt-2">Inspector</p>
              <p className="text-[13px] text-text-primary font-medium">{inspection.inspector ?? "Unassigned"}</p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...headerFields, ...headerFields2].map((f) => (
              <div key={f.label}>
                <p className="text-[11px] text-text-light mb-1">{f.label}</p>
                {(f as { status?: boolean }).status ? (
                  <StatusBadge status={f.value} />
                ) : (
                  <p className={`text-[14px] font-semibold text-text-primary ${(f as { mono?: boolean }).mono ? "font-mono text-[13px]" : ""}`}>{f.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checklist / Defect Summary / Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Checklist */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-soft-bg border-b border-border-soft flex-wrap gap-2">
            <h3 className="text-[15px] font-semibold text-text-primary">Inspection Checklist</h3>
            <div className="flex gap-1.5 text-[11px] font-medium">
              <span className="px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981]">7 Passed</span>
              <span className="px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444]">2 Failed</span>
              <span className="px-1.5 py-0.5 rounded bg-[#9AA8B8]/10 text-[#66758C]">1 N/A</span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between text-[10px] text-text-light uppercase tracking-wider pb-2 border-b border-border-soft">
              <span>Checkpoint</span>
              <span>Result</span>
            </div>
            {checklist.map((c) => {
              const { cls, Icon } = resultBadge(c.result);
              return (
                <div key={c.item} className="flex items-center justify-between gap-2 py-2 border-b border-[#F1F5F9] last:border-b-0">
                  <span className="text-[12px] text-text-primary flex items-center gap-2 min-w-0"><Icon className={`w-3.5 h-3.5 shrink-0 ${c.result === "Passed" ? "text-[#10B981]" : c.result === "Failed" ? "text-[#EF4444]" : "text-[#9AA8B8]"}`} /><span className="truncate">{c.item}</span></span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium shrink-0 ${cls}`}>{c.result}</span>
                </div>
              );
            })}
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-action-blue mt-3">View Full Checklist <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Defect Summary */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <h3 className="text-[15px] font-semibold text-text-primary px-5 py-3 bg-soft-bg border-b border-border-soft">Defect Summary</h3>
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="32" fill="none" stroke="#F7FAFC" strokeWidth="12" />
                  {defects.map((d, i) => {
                    const p = parseFloat(d.pct);
                    const len = (p / 100) * circumference;
                    return <circle key={i} cx="50" cy="50" r="32" fill="none" stroke={d.color} strokeWidth="12" strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-(defectOffsets[i] / 100) * circumference} />;
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center"><p className="text-[9px] text-text-light">Total Defects</p><p className="text-[22px] font-bold text-text-primary">22</p></div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {defects.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-text-muted">{d.name}</span></div>
                    <span className="text-text-primary font-medium">{d.count} <span className="text-text-light">({d.pct})</span></span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F1F5F9] font-semibold">
                  <span className="text-text-primary">Total</span><span className="text-text-primary">22 (100%)</span>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-[#EF4444]/5 rounded-lg p-3">
              <h4 className="text-[12px] font-semibold text-text-primary mb-2">Top Defect Types</h4>
              <div className="space-y-2">
                {topDefects.map((t) => (
                  <div key={t.rank} className="flex items-center gap-2 text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[9px] font-bold shrink-0">{t.rank}</span>
                    <span className="text-text-primary flex-1">{t.name}</span>
                    <span className="text-text-muted">{t.count} ({t.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-soft-bg border-b border-border-soft">
            <h3 className="text-[15px] font-semibold text-text-primary">Inspection Photos</h3>
            <button className="text-[12px] font-medium text-action-blue">View All (12)</button>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <div key={p.label}>
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] border border-border-soft overflow-hidden" />
                  <p className="text-[9px] text-text-light mt-1 truncate text-center">{p.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comments / Reports / Timeline / Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Inspector Comments */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <h3 className="text-[15px] font-semibold text-text-primary px-5 py-3 bg-soft-bg border-b border-border-soft">Inspector Comments</h3>
          <div className="p-5">
            <p className="text-[12px] text-text-body leading-relaxed">Observed multiple printing defects around the logo area including misalignment and fading. Label placement is inconsistent. Product appearance passed all checks. Recommend corrective action before shipment.</p>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#F1F5F9]">
              <div className="w-7 h-7 rounded-full bg-action-blue/10 flex items-center justify-center text-[10px] font-bold text-action-blue">JS</div>
              <div className="flex-1"><p className="text-[12px] font-medium text-text-primary">{inspection.inspector ?? "Unassigned"}</p><p className="text-[10px] text-text-light">Lead Inspector</p></div>
              <div className="text-right"><p className="text-[10px] text-text-light">{formatDate(inspection.scheduledDate)}</p><p className="text-[10px] text-[#10B981]">{inspection.status}</p></div>
            </div>
          </div>
        </div>

        {/* Attached Reports */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <h3 className="text-[15px] font-semibold text-text-primary px-5 py-3 bg-soft-bg border-b border-border-soft">Attached Reports</h3>
          <div className="p-5">
            <div className="space-y-2.5">
              {reports.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.name} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0"><Icon className={`w-4 h-4 ${r.color}`} /></div>
                    <div className="min-w-0 flex-1"><p className="text-[12px] font-medium text-text-primary truncate">{r.name}</p><p className="text-[10px] text-text-muted">{r.size}</p></div>
                    <button className="text-text-muted hover:text-text-body shrink-0"><Download className="w-4 h-4" /></button>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 py-2 border border-border-soft rounded-lg text-[12px] font-medium text-text-body inline-flex items-center justify-center gap-1.5 hover:bg-soft-bg"><Download className="w-3.5 h-3.5" />Download All</button>
          </div>
        </div>

        {/* Inspection Timeline */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <h3 className="text-[15px] font-semibold text-text-primary px-5 py-3 bg-soft-bg border-b border-border-soft">Inspection Timeline</h3>
          <div className="p-5">
            <div className="relative pl-5">
              <div className="absolute left-[6px] top-1 bottom-3 w-px bg-border-soft" />
              {timeline.map((t, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div className={`absolute -left-5 top-0.5 w-3 h-3 rounded-full border-2 ${t.color === "bg-[#10B981]" ? "bg-[#10B981] border-[#10B981]" : "bg-white border-[#0057D8]"}`} />
                  <p className="text-[12px] font-semibold text-text-primary">{t.title}</p>
                  <p className="text-[10px] text-text-muted">{t.time}</p>
                  <p className="text-[11px] text-text-body mt-0.5">{t.user}</p>
                </div>
              ))}
            </div>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-action-blue mt-2">View full timeline <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Sample History */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-soft-bg border-b border-border-soft">
            <h3 className="text-[15px] font-semibold text-text-primary">Sample History</h3>
            <button className="text-[12px] font-medium text-action-blue">View All</button>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {samples.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-soft-bg border border-border-soft flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-text-light" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-text-primary truncate">{s.name}</p><p className="text-[10px] text-text-light">{s.units}</p></div>
                  <div className="text-right">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${s.result === "Failed" ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[#10B981]/10 text-[#10B981]"}`}>{s.result}</span>
                    <p className="text-[9px] text-text-light mt-0.5">{s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Actions + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3">
          <h3 className="text-[15px] font-semibold text-text-primary mb-1">Follow-up Actions</h3>
          <p className="text-[12px] text-text-light mb-3">Choose the next steps for this inspection.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {followups.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-xl border border-border-soft p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-2 mb-2"><Icon className={`w-4 h-4 ${f.iconColor}`} /><span className="text-[13px] font-semibold text-text-primary">{f.title}</span></div>
                  <p className="text-[11px] text-text-light mb-3">{f.desc}</p>
                  <button className={`w-full py-2 ${f.btnColor} text-white rounded-lg text-[12px] font-medium`}>{f.btn}</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes for Supplier */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
          <h3 className="text-[15px] font-semibold text-text-primary px-5 py-3 bg-soft-bg border-b border-border-soft">Notes for Supplier</h3>
          <div className="p-5 flex flex-col flex-1">
            <textarea placeholder="Add notes or instructions for the supplier..." className="flex-1 min-h-[80px] w-full border border-border-soft rounded-lg p-2.5 text-[12px] text-text-body placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/30 resize-none" />
            <button className="w-full mt-3 py-2 bg-action-blue hover:bg-[#003B7A] text-white rounded-lg text-[12px] font-medium inline-flex items-center justify-center gap-1.5"><Send className="w-3.5 h-3.5" />Send to Supplier</button>
          </div>
        </div>
      </div>
    </div>
  );
}
