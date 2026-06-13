"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, CheckCircle2, Star,
  Zap, DollarSign, FileText, Image as ImageIcon, Download,
} from "lucide-react";
import type { Quote } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field as FormField, TextInput, TextArea, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";
import { formatCurrency, formatDate } from "@/lib/format";
import QuoteDetailActions from "./QuoteDetailActions";

const suppliers = [
  { name: "Shenzhen Topway Tech", loc: "Shenzhen, China", recommended: true },
  { name: "Ningbo Best Electronics", loc: "Ningbo, China", recommended: false },
  { name: "Guangzhou SoundMax", loc: "Guangzhou, China", recommended: false },
];

const compRows = [
  { label: "Unit Cost (USD)", vals: ["$12.45", "$12.95", "$11.80"] },
  { label: "MOQ", vals: ["1,000 units", "2,000 units", "5,000 units"] },
  { label: "Lead Time", vals: ["18 – 22 days", "15 – 20 days", "25 – 30 days"] },
  { label: "Shipping Estimate", vals: ["$0.85 / unit", "$0.74 / unit", "$0.62 / unit"] },
  { label: "QC Capability", vals: ["ISO 9001, BSCI", "ISO 9001", "None"] },
  { label: "Packaging Option", vals: ["Custom Color Box", "White Box", "Brown Box"], sub: ["+ Polybag", "+ Polybag", "+ Polybag"] },
];

const landed = ["$13.78", "$14.12", "$13.95"];
const recs = [
  { title: "Best Value", desc: "Lowest landed cost with strong QC and reliable lead time.", icon: CheckCircle2, color: "text-[#10B981]" },
  { title: "Fastest Lead Time", desc: "Slightly higher cost, but fastest production and shipping.", icon: Zap, color: "text-[#0057D8]" },
  { title: "Lowest Unit Cost", desc: "Lowest price but longer lead time and limited QC.", icon: DollarSign, color: "text-[#7C6FF6]" },
];

const costBreakdown = [
  { label: "Unit Cost", value: "$12.45", pct: "90.4%", color: "#0057D8" },
  { label: "Shipping (Sea)", value: "$0.85", pct: "6.2%", color: "#00B894" },
  { label: "Import Duties (3.1%)", value: "$0.39", pct: "2.8%", color: "#F59E0B" },
  { label: "Customs Clearance", value: "$0.06", pct: "0.4%", color: "#EF4444" },
  { label: "Local Delivery", value: "$0.03", pct: "0.2%", color: "#7C6FF6" },
];

const costDetails = [
  { label: "FOB (Unit Price)", value: "$12.45" },
  { label: "Freight to LAX (per unit)", value: "$0.85" },
  { label: "Import Duties", value: "$0.39" },
  { label: "Customs Clearance", value: "$0.06" },
  { label: "Local Delivery", value: "$0.03" },
];

const initialRequirements = [
  { label: "Product Type", value: "Wireless Bluetooth Speaker" },
  { label: "Specifications", value: "5W output, Bluetooth 5.0, IPX5" },
  { label: "Certifications", value: "FCC, CE, RoHS" },
  { label: "Packaging", value: "Retail ready, English labels" },
  { label: "Target Price", value: "≤ $15.00 landed cost / unit" },
  { label: "Target Delivery", value: "May 30, 2025" },
];

const files = [
  { name: "Product_Specs.pdf", meta: "PDF · 1.2 MB", icon: FileText, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
  { name: "Packaging_Design.ai", meta: "AI · 8.7 MB", icon: FileText, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
  { name: "Reference_Photo.jpg", meta: "JPG · 2.3 MB", icon: ImageIcon, color: "text-[#0057D8]", bg: "bg-[#0057D8]/10" },
  { name: "Certification_FCC.pdf", meta: "PDF · 640 KB", icon: FileText, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
  { name: "Label_Artwork.png", meta: "PNG · 3.1 MB", icon: ImageIcon, color: "text-[#0057D8]", bg: "bg-[#0057D8]/10" },
];
const FILES_VISIBLE = 3;

const initialNotes = [
  "Looking for best value with reliable quality.",
  "Priority on FCC certification and retail packaging.",
  "Target shelf price is $49.99.",
  "Please confirm sample availability.",
];

export default function QuoteDetailView({ quote }: { quote: Quote }) {
  const { toast } = useToast();

  const circumference = 2 * Math.PI * 35;
  const costOffsets = costBreakdown.reduce<number[]>((acc, c, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + parseFloat(costBreakdown[i - 1].pct));
    return acc;
  }, []);

  const [requirements, setRequirements] = useState(initialRequirements);
  const [notes, setNotes] = useState(initialNotes);
  const [reqOpen, setReqOpen] = useState(false);
  const [reqDraft, setReqDraft] = useState(initialRequirements);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState(initialNotes.join("\n"));
  const [confirmDiscard, setConfirmDiscard] = useState<null | "req" | "notes">(null);
  const [showAllFiles, setShowAllFiles] = useState(false);

  const reqDirty = JSON.stringify(reqDraft) !== JSON.stringify(requirements);
  const notesDirty = notesDraft !== notes.join("\n");
  const visibleFiles = showAllFiles ? files : files.slice(0, FILES_VISIBLE);

  const infoFields = [
    { label: "Request ID", value: quote.id, sub: `Created: ${formatDate(quote.createdDate)}`, mono: true },
    { label: "Customer", value: quote.customer, sub: quote.customerId ? `ID: ${quote.customerId}` : "—" },
    { label: "Total", value: formatCurrency(quote.total), sub: "Quoted amount" },
    { label: "Valid Until", value: quote.validUntil ? formatDate(quote.validUntil) : "—", sub: "Quote expiry" },
  ];

  function openReqEdit() {
    setReqDraft(requirements);
    setReqOpen(true);
  }
  function saveReq() {
    setRequirements(reqDraft);
    setReqOpen(false);
    toast("Product requirements updated");
  }

  function openNotesEdit() {
    setNotesDraft(notes.join("\n"));
    setNotesOpen(true);
  }
  function saveNotes() {
    const next = notesDraft.split("\n").map((n) => n.trim()).filter(Boolean);
    if (next.length === 0) { toast("Add at least one note", "error"); return; }
    setNotes(next);
    setNotesOpen(false);
    toast("Quote notes updated");
  }

  // Warn before closing an edit modal with unsaved changes.
  function requestCloseReq() {
    if (reqDirty) setConfirmDiscard("req");
    else setReqOpen(false);
  }
  function requestCloseNotes() {
    if (notesDirty) setConfirmDiscard("notes");
    else setNotesOpen(false);
  }
  function discardChanges() {
    if (confirmDiscard === "req") setReqOpen(false);
    else if (confirmDiscard === "notes") setNotesOpen(false);
    setConfirmDiscard(null);
  }

  function downloadFile(name: string) {
    const file = files.find((f) => f.name === name);
    const blob = new Blob([
      [
        "FulfillMesh — RFQ File Export",
        `File: ${name}`,
        file ? `Details: ${file.meta}` : "",
        `Quote: ${quote.id}`,
        `Customer: ${quote.customer}`,
      ].filter(Boolean).join("\n"),
    ], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name.replace(/\.[a-z0-9]+$/i, "")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast(`${name} downloaded`);
  }

  function exportComparison() {
    const rows = [...compRows, { label: "Total Landed Cost (USD)", vals: landed }].map((r) => ({
      metric: r.label,
      [suppliers[0].name]: r.vals[0],
      [suppliers[1].name]: r.vals[1],
      [suppliers[2].name]: r.vals[2],
    }));
    exportToCsv(`quote-comparison-${quote.id}`, rows, [
      { key: "metric", header: "Metric" },
      { key: suppliers[0].name, header: suppliers[0].name },
      { key: suppliers[1].name, header: suppliers[1].name },
      { key: suppliers[2].name, header: suppliers[2].name },
    ]);
    toast("Comparison exported");
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-[#66758C]">
        <Link href="/dashboard/quotes" className="hover:text-[#0057D8] transition-colors">Quotes</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#061A3D] font-medium font-mono">{quote.id}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#061A3D]">Quote Detail</h1>
          <p className="text-[14px] text-[#4A5A73] mt-0.5">Review and compare supplier quotes, analyze costs, and approve the best option.</p>
        </div>
        <QuoteDetailActions quote={quote} />
      </div>

      {/* Info row */}
      <div className="bg-white rounded-xl border border-[#E6EDF5] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {infoFields.map((f) => (
            <div key={f.label}>
              <p className="text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider mb-1">{f.label}</p>
              <p className={`text-[14px] font-semibold text-[#061A3D] ${f.mono ? "font-mono" : ""}`}>{f.value}</p>
              <p className="text-[12px] text-[#4A5A73] mt-1">{f.sub}</p>
            </div>
          ))}
          <div>
            <p className="text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider mb-1">Status</p>
            <StatusBadge status={quote.status} />
            <p className="text-[12px] text-[#4A5A73] mt-2">3 quotes received</p>
          </div>
        </div>
      </div>

      {/* Comparison + Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Comparison */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-[#061A3D]">Supplier Quote Comparison</h3>
              <span className="text-[12px] text-[#66758C]">3 suppliers responded</span>
            </div>
            <button onClick={exportComparison} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0057D8] hover:underline"><Download className="w-3.5 h-3.5" /> Export</button>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: "640px" }}>
                <thead>
                  <tr className="border-b border-[#E6EDF5]">
                    <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider px-3 py-2 w-[160px]">Supplier</th>
                    {suppliers.map((s) => (
                      <th key={s.name} className={`text-left px-3 py-2 ${s.recommended ? "bg-[#ECFDF5]" : ""}`}>
                        {s.recommended && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#00B894] mb-1">
                            <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" /> Recommended
                          </span>
                        )}
                        <p className="text-[13px] font-semibold text-[#061A3D]">{s.name}</p>
                        <p className="text-[11px] text-[#66758C] font-normal">{s.loc}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compRows.map((row) => (
                    <tr key={row.label} className="border-b border-[#F1F5F9]">
                      <td className="px-3 py-2.5 text-[12px] text-[#4A5A73]">{row.label}</td>
                      {row.vals.map((v, i) => (
                        <td key={i} className={`px-3 py-2.5 text-[13px] text-[#061A3D] ${i === 0 ? "bg-[#ECFDF5]" : ""}`}>
                          {v}
                          {row.sub && <span className="block text-[11px] text-[#9AA8B8]">{row.sub[i]}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Total Landed Cost */}
                  <tr className="border-b border-[#F1F5F9]">
                    <td className="px-3 py-2.5 text-[12px] text-[#4A5A73]">
                      Total Landed Cost (USD)
                      <span className="block text-[11px] text-[#9AA8B8]">(Est. per unit)</span>
                    </td>
                    {landed.map((v, i) => (
                      <td key={i} className={`px-3 py-2.5 ${i === 0 ? "bg-[#ECFDF5]" : ""}`}>
                        <span className="text-[16px] font-bold text-[#00B894]">{v}</span>
                        <span className="block text-[11px] text-[#9AA8B8]">Est. per unit</span>
                      </td>
                    ))}
                  </tr>
                  {/* Recommendation */}
                  <tr>
                    <td className="px-3 py-2.5 text-[12px] text-[#4A5A73] align-top">Recommendation</td>
                    {recs.map((r, i) => {
                      const Icon = r.icon;
                      return (
                        <td key={i} className={`px-3 py-2.5 align-top ${i === 0 ? "bg-[#ECFDF5]" : ""}`}>
                          <div className={`flex items-center gap-1.5 text-[13px] font-semibold ${r.color}`}>
                            <Icon className="w-4 h-4" />{r.title}
                          </div>
                          <p className="text-[11px] text-[#66758C] mt-1">{r.desc}</p>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Product Requirements */}
          <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
              <h3 className="text-[14px] font-semibold text-[#061A3D]">Product Requirements</h3>
              <button onClick={openReqEdit} className="text-[12px] font-medium text-[#0057D8] hover:underline">Edit</button>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {requirements.map((r) => (
                  <div key={r.label} className="flex items-start justify-between gap-3">
                    <span className="text-[12px] text-[#4A5A73] shrink-0">{r.label}</span>
                    <span className="text-[12px] text-[#061A3D] font-medium text-right">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
              <h3 className="text-[14px] font-semibold text-[#061A3D]">Uploaded Files ({files.length})</h3>
              <button onClick={() => setShowAllFiles((v) => !v)} className="text-[12px] font-medium text-[#0057D8] hover:underline">{showAllFiles ? "Show fewer" : `View all (${files.length})`}</button>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {visibleFiles.map((f) => {
                  const Icon = f.icon;
                  return (
                    <button key={f.name} onClick={() => downloadFile(f.name)} className="w-full flex items-center gap-3 text-left hover:bg-[#F7FAFC] rounded-lg -mx-1 px-1 py-1 transition-colors">
                      <div className={`w-8 h-8 rounded-lg ${f.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${f.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] text-[#061A3D] font-medium truncate">{f.name}</p>
                        <p className="text-[10px] text-[#9AA8B8]">{f.meta}</p>
                      </div>
                      <Download className="w-3.5 h-3.5 text-[#9AA8B8] shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
            <h3 className="text-[14px] font-semibold text-[#061A3D]">Cost Breakdown (Recommended Supplier)</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Donut + breakdown */}
              <div className="flex items-center gap-6">
                <div className="relative w-[140px] h-[140px] shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#F1F5F9" strokeWidth="13" />
                    {costBreakdown.map((c, i) => {
                      const p = parseFloat(c.pct);
                      const len = (p / 100) * circumference;
                      return (
                        <circle
                          key={i}
                          cx="50"
                          cy="50"
                          r="35"
                          fill="none"
                          stroke={c.color}
                          strokeWidth="13"
                          strokeDasharray={`${len} ${circumference - len}`}
                          strokeDashoffset={-(costOffsets[i] / 100) * circumference}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[18px] font-bold text-[#061A3D]">$13.78</p>
                      <p className="text-[10px] text-[#9AA8B8]">Est. per unit</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-2.5">
                  {costBreakdown.map((c) => (
                    <div key={c.label} className="flex items-center text-[12px]">
                      <span className="w-2 h-2 rounded-full shrink-0 mr-2" style={{ backgroundColor: c.color }} />
                      <span className="text-[#4A5A73] flex-1">{c.label}</span>
                      <span className="text-[#061A3D] font-medium w-14 text-right">{c.value}</span>
                      <span className="text-[#9AA8B8] w-12 text-right">{c.pct}</span>
                    </div>
                  ))}
                  <div className="flex items-center text-[12px] pt-2 mt-1 border-t border-[#E6EDF5] font-semibold">
                    <span className="text-[#061A3D] flex-1">Total Landed Cost</span>
                    <span className="text-[#061A3D] w-14 text-right">$13.78</span>
                    <span className="text-[#9AA8B8] w-12 text-right">100%</span>
                  </div>
                </div>
              </div>
              {/* Cost details */}
              <div>
                <h4 className="text-[14px] font-semibold text-[#061A3D] mb-3">Cost Details</h4>
                <div className="space-y-0">
                  {costDetails.map((d) => (
                    <div key={d.label} className="flex items-center justify-between text-[12px] py-2.5 border-b border-[#F1F5F9]">
                      <span className="text-[#4A5A73]">{d.label}</span>
                      <span className="text-[#061A3D] font-medium">{d.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-[13px] font-semibold pt-3">
                    <span className="text-[#061A3D]">Total Landed Cost</span>
                    <span className="text-[#00B894]">$13.78</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Notes */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
            <h3 className="text-[14px] font-semibold text-[#061A3D]">Quote Notes</h3>
            <button onClick={openNotesEdit} className="text-[12px] font-medium text-[#0057D8] hover:underline">Edit</button>
          </div>
          <div className="p-5">
            <ul className="space-y-2.5">
              {notes.map((note) => (
                <li key={note} className="flex items-start gap-2 text-[12px] text-[#4A5A73]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AA8B8] shrink-0 mt-1.5" />
                  {note}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-[#9AA8B8] mt-4 pt-3 border-t border-[#E6EDF5]">Updated {formatDate(quote.createdDate)} by Admin</p>
          </div>
        </div>
      </div>

      {/* Edit requirements modal */}
      <Modal
        open={reqOpen}
        onClose={requestCloseReq}
        title="Edit Product Requirements"
        description="Update the requirement values for this RFQ."
        size="md"
        footer={
          <>
            <SecondaryButton onClick={requestCloseReq}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveReq} disabled={!reqDirty}>{reqDirty ? "Save changes •" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          {reqDraft.map((r, i) => (
            <FormField key={r.label} label={r.label}>
              <TextInput
                value={r.value}
                onChange={(e) => setReqDraft((prev) => prev.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
              />
            </FormField>
          ))}
        </div>
      </Modal>

      {/* Edit notes modal */}
      <Modal
        open={notesOpen}
        onClose={requestCloseNotes}
        title="Edit Quote Notes"
        description="One note per line."
        footer={
          <>
            <SecondaryButton onClick={requestCloseNotes}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveNotes} disabled={!notesDirty}>{notesDirty ? "Save changes •" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <FormField label="Notes">
          <TextArea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={6} />
        </FormField>
      </Modal>

      {/* Unsaved changes warning */}
      <ConfirmDialog
        open={confirmDiscard !== null}
        onClose={() => setConfirmDiscard(null)}
        onConfirm={discardChanges}
        title="Discard unsaved changes?"
        message={`You have unsaved ${confirmDiscard === "req" ? "requirement" : "note"} changes. Closing will discard them.`}
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        destructive
      />
    </div>
  );
}
