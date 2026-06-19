"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight, Download, Package, Plus, Upload, Trash2, Loader2, ImageOff, File as FileIcon,
  CheckCircle2, XCircle, MinusCircle, FileText, FileSpreadsheet, FileArchive,
  Clock, AlertTriangle, Send, RotateCcw, Ban, ArrowLeft, ArrowRight,
} from "lucide-react";
import type { QcInspection, QcStatus, QcChecklistItem, Attachment } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field as FormField, TextArea, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import { formatDate } from "@/lib/format";
import QcDetailActions from "./QcDetailActions";

const MAX_UPLOAD_BYTES = 3_000_000; // mirror the server's 3MB cap

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Read a File into a base64 data URL. */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Default checkpoints used only when an inspection has no persisted checklist yet.
const defaultChecklist: QcChecklistItem[] = [
  { label: "Product Appearance", result: "Pass" },
  { label: "Dimensions & Size", result: "Pass" },
  { label: "Material & Finish", result: "Pass" },
  { label: "Printing & Logo", result: "Pass" },
  { label: "Cap Functionality", result: "Pass" },
  { label: "Leak Test", result: "Pass" },
  { label: "Packaging & Labeling", result: "Pass" },
  { label: "Workmanship", result: "Pass" },
  { label: "Barcode & SKU", result: "N/A" },
  { label: "Quantity Verification", result: "Pass" },
];

/** Pick an icon + accent color for a report based on its mime / file extension. */
function reportVisual(name: string, mime: string): { icon: typeof FileText; color: string } {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (mime.includes("spreadsheet") || mime === "text/csv" || ext === "xlsx" || ext === "xls" || ext === "csv") {
    return { icon: FileSpreadsheet, color: "text-[#10B981]" };
  }
  if (mime.includes("zip") || mime.includes("compressed") || ext === "zip" || ext === "rar" || ext === "7z") {
    return { icon: FileArchive, color: "text-[#F59E0B]" };
  }
  return { icon: FileText, color: "text-[#EF4444]" };
}

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

const followups: {
  title: string; desc: string; btn: string; btnColor: string;
  icon: typeof CheckCircle2; iconColor: string; status: QcStatus; verb: string;
}[] = [
  { title: "Approve Shipment", desc: "Approve this lot for shipment despite the issues.", btn: "Approve Shipment", btnColor: "bg-[#10B981] hover:bg-[#059669]", icon: CheckCircle2, iconColor: "text-[#10B981]", status: "Passed", verb: "approved for shipment" },
  { title: "Request Re-inspection", desc: "Request the supplier to address issues and re-inspect.", btn: "Request Re-inspection", btnColor: "bg-[#F59E0B] hover:bg-[#D97706]", icon: RotateCcw, iconColor: "text-[#F59E0B]", status: "Scheduled", verb: "scheduled for re-inspection" },
  { title: "Reject & Hold Shipment", desc: "Reject this lot and place shipment on hold.", btn: "Reject & Hold", btnColor: "bg-[#EF4444] hover:bg-[#DC2626]", icon: Ban, iconColor: "text-[#EF4444]", status: "On Hold", verb: "rejected and held" },
];

function resultBadge(r: QcChecklistItem["result"]) {
  if (r === "Pass") return { cls: "bg-[#10B981]/10 text-[#10B981]", Icon: CheckCircle2 };
  if (r === "Fail") return { cls: "bg-[#EF4444]/10 text-[#EF4444]", Icon: XCircle };
  return { cls: "bg-[#9AA8B8]/10 text-[#66758C]", Icon: MinusCircle };
}

interface InspectorComment {
  author: string;
  role: string;
  date: string;
  text: string;
}

export default function QcDetailView({ inspection }: { inspection: QcInspection }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [supplierNote, setSupplierNote] = useState("");
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierModalDraft, setSupplierModalDraft] = useState("");

  // Checklist state — seeded from the inspection's persisted checklist when present.
  const [checklist, setChecklist] = useState<QcChecklistItem[]>(
    () => (inspection.checklist && inspection.checklist.length > 0 ? inspection.checklist : defaultChecklist),
  );
  const [savingChecklist, setSavingChecklist] = useState(false);

  // Photos / files state — backed by the real attachments API.
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Attachment | null>(null);
  const [deletingAttachment, setDeletingAttachment] = useState(false);
  const [uploadingReport, setUploadingReport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  // Images render as "photos"; everything else (PDFs, docs, spreadsheets, zips) as "reports".
  // Both are real attachments persisted via /api/attachments.
  const photos = useMemo(() => attachments.filter((a) => a.mime.startsWith("image/")), [attachments]);
  const reports = useMemo(() => attachments.filter((a) => !a.mime.startsWith("image/")), [attachments]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: Attachment[] }>(`/api/attachments?entityType=qc&entityId=${encodeURIComponent(inspection.id)}`);
        if (!cancelled) setAttachments(res.data);
      } catch {
        if (!cancelled) toast("Failed to load attachments", "error");
      } finally {
        if (!cancelled) setAttachmentsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [inspection.id, toast]);

  // Upload a real File to the attachments backend, recording its actual byte size.
  async function uploadFile(file: File, kind: "photo" | "report"): Promise<void> {
    if (file.size > MAX_UPLOAD_BYTES) {
      toast("File is too large (max 3MB)", "error");
      return;
    }
    const setBusyState = kind === "photo" ? setUploading : setUploadingReport;
    setBusyState(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const created = await api.post<Attachment>("/api/attachments", {
        entityType: "qc",
        entityId: inspection.id,
        name: file.name,
        mime: file.type || "application/octet-stream",
        dataUrl,
        size: file.size, // real file size in bytes — no fabrication
      });
      setAttachments((prev) => [...prev, created]);
      toast(kind === "photo" ? "Photo uploaded" : `Report "${file.name}" uploaded`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to upload file", "error");
    } finally {
      setBusyState(false);
    }
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (file) await uploadFile(file, "photo");
  }

  async function handleReportSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (file) await uploadFile(file, "report");
  }

  async function confirmDeleteAttachment() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    const prev = attachments;
    setDeletingAttachment(true);
    setAttachments((list) => list.filter((a) => a.id !== target.id)); // optimistic
    try {
      await api.del(`/api/attachments/${target.id}`);
      toast("Attachment deleted");
      setPendingDelete(null);
    } catch (err) {
      setAttachments(prev); // roll back
      toast(err instanceof Error ? err.message : "Failed to delete attachment", "error");
    } finally {
      setDeletingAttachment(false);
    }
  }

  // Inspector comments — session-local; appended via the "Add comment" modal.
  const [comments, setComments] = useState<InspectorComment[]>([{
    author: inspection.inspector ?? "Unassigned",
    role: "Lead Inspector",
    date: formatDate(inspection.scheduledDate),
    text: "Observed multiple printing defects around the logo area including misalignment and fading. Label placement is inconsistent. Product appearance passed all checks. Recommend corrective action before shipment.",
  }]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");

  function addComment() {
    if (!commentDraft.trim()) { toast("Comment cannot be empty", "error"); return; }
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setComments((prev) => [...prev, { author: "You", role: "Reviewer", date: today, text: commentDraft.trim() }]);
    setCommentDraft("");
    setCommentOpen(false);
    toast("Comment added");
  }

  // Derive defect summary from checklist items
  const defects = useMemo(() => {
    const passed = checklist.filter((c) => c.result === "Pass").length;
    const failed = checklist.filter((c) => c.result === "Fail").length;
    const na = checklist.filter((c) => c.result === "N/A").length;
    const total = passed + failed + na;
    return [
      { name: "Passed", count: passed, pct: total > 0 ? ((passed / total) * 100).toFixed(1) + "%" : "0%", color: "#10B981" },
      { name: "Failed", count: failed, pct: total > 0 ? ((failed / total) * 100).toFixed(1) + "%" : "0%", color: "#EF4444" },
      { name: "N/A", count: na, pct: total > 0 ? ((na / total) * 100).toFixed(1) + "%" : "0%", color: "#9AA8B8" },
    ];
  }, [checklist]);

  // Top defects derive from the real checklist: every failed checkpoint + its notes.
  const topDefects = useMemo(() => {
    const failed = checklist.filter((c) => c.result === "Fail");
    const total = failed.length;
    return failed.map((c, i) => ({
      rank: i + 1,
      name: c.notes?.trim() ? `${c.label} — ${c.notes.trim()}` : c.label,
      count: "1",
      pct: total > 0 ? ((1 / total) * 100).toFixed(1) + "%" : "0%",
    }));
  }, [checklist]);

  const circumference = 2 * Math.PI * 32;
  const defectOffsets = defects.reduce<number[]>((acc, d, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + parseFloat(defects[i - 1].pct));
    return acc;
  }, []);

  // Toggle a checklist item result (cycles Pass -> Fail -> N/A -> Pass)
  function toggleCheckItem(idx: number) {
    setChecklist((prev) => {
      const next = [...prev];
      const cur = next[idx].result;
      next[idx] = { ...next[idx], result: cur === "Pass" ? "Fail" : cur === "Fail" ? "N/A" : "Pass" };
      return next;
    });
  }

  // Persist the checklist to the inspection; roll back local state on failure.
  async function saveChecklist() {
    if (savingChecklist) return;
    const snapshot = checklist;
    setSavingChecklist(true);
    try {
      const updated = await api.put<QcInspection>(`/api/qc-inspections/${inspection.id}`, { checklist });
      if (updated.checklist && updated.checklist.length > 0) setChecklist(updated.checklist);
      toast("Checklist saved");
    } catch (e) {
      setChecklist(snapshot);
      toast(e instanceof Error ? e.message : "Could not save checklist", "error");
    } finally {
      setSavingChecklist(false);
    }
  }

  // Trigger a browser download for a real uploaded report from its stored data URL.
  function triggerDownload(report: Attachment) {
    const a = document.createElement("a");
    a.href = report.dataUrl;
    a.download = report.name;
    a.click();
  }

  function downloadReportAttachment(report: Attachment) {
    triggerDownload(report);
    toast(`Downloaded ${report.name}`);
  }

  function sendToSupplierModal() {
    if (!supplierModalDraft.trim()) { toast("Enter a note before sending", "error"); return; }
    toast(`Note sent to ${inspection.supplier}`);
    setSupplierModalDraft("");
    setSupplierModalOpen(false);
  }

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

  async function applyFollowup(status: QcStatus, verb: string) {
    setBusy(true);
    try {
      await api.put(`/api/qc-inspections/${inspection.id}`, { status });
      toast(`Inspection ${inspection.id} ${verb}`);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update inspection", "error");
    } finally {
      setBusy(false);
    }
  }

  function downloadReport() {
    exportToCsv(`qc-report-${inspection.id}`, checklist, [
      { key: "label", header: "Checkpoint" },
      { key: "result", header: "Result" },
      { key: "notes", header: "Notes" },
    ]);
    toast(`QC report for ${inspection.id} downloaded`);
  }

  function downloadAll() {
    if (reports.length === 0) {
      toast("No reports to download", "error");
      return;
    }
    reports.forEach(triggerDownload);
    toast(`Downloaded ${reports.length} report${reports.length === 1 ? "" : "s"}`);
  }


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
          <button onClick={downloadReport} className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg transition-colors"><Download className="w-4 h-4" />Download Report</button>
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
              <span className="px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981]">{checklist.filter((c) => c.result === "Pass").length} Passed</span>
              <span className="px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444]">{checklist.filter((c) => c.result === "Fail").length} Failed</span>
              <span className="px-1.5 py-0.5 rounded bg-[#9AA8B8]/10 text-[#66758C]">{checklist.filter((c) => c.result === "N/A").length} N/A</span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between text-[10px] text-text-light uppercase tracking-wider pb-2 border-b border-border-soft">
              <span>Checkpoint</span>
              <span>Result</span>
            </div>
            {checklist.map((c, idx) => {
              const { cls, Icon } = resultBadge(c.result);
              return (
                <div key={`${c.label}-${idx}`} className="flex items-center justify-between gap-2 py-2 border-b border-[#F1F5F9] last:border-b-0 cursor-pointer hover:bg-[#F7FAFC]/50 -mx-1 px-1 rounded" onClick={() => toggleCheckItem(idx)}>
                  <span className="text-[12px] text-text-primary flex items-center gap-2 min-w-0"><Icon className={`w-3.5 h-3.5 shrink-0 ${c.result === "Pass" ? "text-[#10B981]" : c.result === "Fail" ? "text-[#EF4444]" : "text-[#9AA8B8]"}`} /><span className="truncate">{c.label}</span></span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium shrink-0 ${cls}`}>{c.result}</span>
                </div>
              );
            })}
            <button onClick={saveChecklist} disabled={savingChecklist} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-action-blue mt-3 disabled:opacity-50 disabled:cursor-not-allowed">{savingChecklist ? "Saving…" : "Save checklist"} <CheckCircle2 className="w-3 h-3" /></button>
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
                  <div className="text-center"><p className="text-[9px] text-text-light">Checkpoints</p><p className="text-[22px] font-bold text-text-primary">{checklist.length}</p></div>
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
                  <span className="text-text-primary">Total</span><span className="text-text-primary">{checklist.length} (100%)</span>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-[#EF4444]/5 rounded-lg p-3">
              <h4 className="text-[12px] font-semibold text-text-primary mb-2">Top Defect Types</h4>
              {topDefects.length === 0 ? (
                <p className="text-[11px] text-text-light">No failed checkpoints recorded.</p>
              ) : (
                <div className="space-y-2">
                  {topDefects.map((t) => (
                    <div key={t.rank} className="flex items-center gap-2 text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[9px] font-bold shrink-0">{t.rank}</span>
                      <span className="text-text-primary flex-1">{t.name}</span>
                      <span className="text-text-muted">{t.count} ({t.pct})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Photos & Files */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-soft-bg border-b border-border-soft">
            <h3 className="text-[15px] font-semibold text-text-primary">Inspection Photos <span className="text-[11px] font-normal text-text-light">({photos.length})</span></h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-[12px] font-medium text-action-blue inline-flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              {uploading ? "Uploading…" : "Add photo"}
            </button>
          </div>
          <div className="p-5">
            {attachmentsLoading ? (
              <div className="flex flex-col items-center justify-center text-center py-6 text-text-light">
                <Loader2 className="w-5 h-5 animate-spin mb-2" />
                <p className="text-[11px]">Loading photos…</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-6 rounded-lg border border-dashed border-border-soft bg-soft-bg">
                <ImageOff className="w-6 h-6 text-text-light mb-2" />
                <p className="text-[12px] font-medium text-text-body">No photos uploaded</p>
                <p className="text-[11px] text-text-light mt-0.5">Use Add photo to attach inspection images.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((a) => {
                  return (
                    <div key={a.id} className="group relative">
                      <a href={a.dataUrl} target="_blank" rel="noopener noreferrer" className="block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={a.dataUrl} alt={a.name} className="aspect-square w-full rounded-lg object-cover border border-border-soft bg-soft-bg" />
                      </a>
                      <button
                        onClick={() => setPendingDelete(a)}
                        className="absolute top-1 right-1 rounded-md bg-white/90 p-1 text-[#EF4444] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-white"
                        aria-label={`Delete ${a.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-[9px] text-text-light mt-1 truncate text-center" title={a.name}>{formatBytes(a.size)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments / Reports / Timeline / Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Inspector Comments */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-soft-bg border-b border-border-soft">
            <h3 className="text-[15px] font-semibold text-text-primary">Inspector Comments</h3>
            <button onClick={() => { setCommentDraft(""); setCommentOpen(true); }} className="text-[12px] font-medium text-action-blue hover:underline">Add comment</button>
          </div>
          <div className="p-5">
            {comments.map((c, i) => {
              const initials = c.author.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={i} className={i > 0 ? "mt-4 pt-4 border-t border-[#F1F5F9]" : ""}>
                  <p className="text-[12px] text-text-body leading-relaxed">{c.text}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-7 h-7 rounded-full bg-action-blue/10 flex items-center justify-center text-[10px] font-bold text-action-blue">{initials}</div>
                    <div className="flex-1"><p className="text-[12px] font-medium text-text-primary">{c.author}</p><p className="text-[10px] text-text-light">{c.role}</p></div>
                    <div className="text-right"><p className="text-[10px] text-text-light">{c.date}</p>{i === 0 && <p className="text-[10px] text-[#10B981]">{inspection.status}</p>}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attached Reports */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-soft-bg border-b border-border-soft">
            <h3 className="text-[15px] font-semibold text-text-primary">Attached Reports <span className="text-[11px] font-normal text-text-light">({reports.length})</span></h3>
            <input
              ref={reportInputRef}
              type="file"
              accept="application/pdf,.doc,.docx,.xls,.xlsx,.csv,.zip,.rar,.7z,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/zip"
              className="hidden"
              onChange={handleReportSelected}
            />
            <button
              onClick={() => reportInputRef.current?.click()}
              disabled={uploadingReport}
              className="text-[12px] font-medium text-action-blue inline-flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingReport ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              {uploadingReport ? "Uploading…" : "Upload report"}
            </button>
          </div>
          <div className="p-5">
            {attachmentsLoading ? (
              <div className="flex flex-col items-center justify-center text-center py-6 text-text-light">
                <Loader2 className="w-5 h-5 animate-spin mb-2" />
                <p className="text-[11px]">Loading reports…</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-6 rounded-lg border border-dashed border-border-soft bg-soft-bg">
                <FileIcon className="w-6 h-6 text-text-light mb-2" />
                <p className="text-[12px] font-medium text-text-body">No reports attached</p>
                <p className="text-[11px] text-text-light mt-0.5">Use Upload report to attach PDFs, docs or spreadsheets.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {reports.map((r) => {
                  const { icon: Icon, color } = reportVisual(r.name, r.mime);
                  return (
                    <div key={r.id} className="group flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0"><Icon className={`w-4 h-4 ${color}`} /></div>
                      <div className="min-w-0 flex-1"><p className="text-[12px] font-medium text-text-primary truncate" title={r.name}>{r.name}</p><p className="text-[10px] text-text-muted">{formatBytes(r.size)}</p></div>
                      <button onClick={() => downloadReportAttachment(r)} className="text-text-muted hover:text-text-body shrink-0" aria-label={`Download ${r.name}`}><Download className="w-4 h-4" /></button>
                      <button onClick={() => setPendingDelete(r)} className="text-text-muted hover:text-[#EF4444] shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-label={`Delete ${r.name}`}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={downloadAll} disabled={reports.length === 0} className="w-full mt-4 py-2 border border-border-soft rounded-lg text-[12px] font-medium text-text-body inline-flex items-center justify-center gap-1.5 hover:bg-soft-bg disabled:opacity-50 disabled:cursor-not-allowed"><Download className="w-3.5 h-3.5" />Download All</button>
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
            <button onClick={() => toast("Showing full inspection timeline")} className="inline-flex items-center gap-1 text-[12px] font-medium text-action-blue mt-2">View full timeline <ArrowRight className="w-3 h-3" /></button>
          </div>
        </div>

        {/* Sample History */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-soft-bg border-b border-border-soft">
            <h3 className="text-[15px] font-semibold text-text-primary">Sample History</h3>
            <button onClick={() => toast("Showing all samples for this inspection")} className="text-[12px] font-medium text-action-blue">View All</button>
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
                  <button onClick={() => applyFollowup(f.status, f.verb)} disabled={busy} className={`w-full py-2 ${f.btnColor} text-white rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>{f.btn}</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes for Supplier */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
          <h3 className="text-[15px] font-semibold text-text-primary px-5 py-3 bg-soft-bg border-b border-border-soft">Notes for Supplier</h3>
          <div className="p-5 flex flex-col flex-1">
            <textarea value={supplierNote} onChange={(e) => setSupplierNote(e.target.value)} placeholder="Add notes or instructions for the supplier..." className="flex-1 min-h-[80px] w-full border border-border-soft rounded-lg p-2.5 text-[12px] text-text-body placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/30 resize-none" />
            <button onClick={() => { setSupplierModalDraft(supplierNote); setSupplierModalOpen(true); }} className="w-full mt-3 py-2 bg-action-blue hover:bg-[#003B7A] text-white rounded-lg text-[12px] font-medium inline-flex items-center justify-center gap-1.5 transition-colors"><Send className="w-3.5 h-3.5" />Send to Supplier</button>
          </div>
        </div>
      </div>

      {/* Add comment modal */}
      <Modal
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        title="Add Comment"
        description={`Add an inspector comment for ${inspection.id}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setCommentOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={addComment}>Add comment</PrimaryButton>
          </>
        }
      >
        <FormField label="Comment">
          <TextArea value={commentDraft} onChange={(e) => setCommentDraft(e.target.value)} rows={4} placeholder="Write your comment…" />
        </FormField>
      </Modal>

      {/* Send to Supplier modal */}
      <Modal
        open={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
        title="Send to Supplier"
        description={`Send notes and instructions to ${inspection.supplier}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setSupplierModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={sendToSupplierModal}>Send</PrimaryButton>
          </>
        }
      >
        <FormField label="Notes">
          <TextArea value={supplierModalDraft} onChange={(e) => setSupplierModalDraft(e.target.value)} rows={4} placeholder="Enter notes or instructions for the supplier…" />
        </FormField>
      </Modal>

      {/* Delete attachment confirm */}
      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => { if (!deletingAttachment) setPendingDelete(null); }}
        onConfirm={confirmDeleteAttachment}
        title="Delete attachment"
        message={`Remove "${pendingDelete?.name ?? ""}" from this inspection? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deletingAttachment}
      />
    </div>
  );
}
