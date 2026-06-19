"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Check, ExternalLink, ArrowRight,
  Search, Wrench, Warehouse, Truck, DollarSign, FileText,
  Edit2, Download, Package, ImageOff, Upload, Trash2, Loader2, File as FileIcon,
} from "lucide-react";
import type { ReturnRecord, Attachment } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field as FormField, TextArea, NumberInput, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import { formatCurrency, formatDate } from "@/lib/format";
import ReturnDetailActions from "./ReturnDetailActions";

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

/** Simple deterministic hash from a string to a positive integer. */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Neutral placeholder used wherever a returned-item product image would appear. */
function BottleThumb({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#F7FAFC] border border-[#E6EDF5] flex items-center justify-center ${className}`}>
      <Package className="w-1/3 h-1/3 text-[#9AA8B8]" />
    </div>
  );
}

function statusToStep(status: string): number {
  switch (status) {
    case "Requested": return 1;
    case "Approved": return 2;
    case "In Transit": return 2;
    case "Received": return 3;
    case "Refunded": return 4;
    case "Rejected": return 4;
    default: return 0;
  }
}

function buildProgress(ret: ReturnRecord) {
  const step = statusToStep(ret.status);
  const base = new Date(ret.requestedDate);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
  const labels = ["Submitted", "Inspected", "Resolved", "Closed"];
  return labels.map((label, i) => {
    const idx = i + 1;
    const done = idx < step;
    const active = idx === step;
    const date = idx <= step ? fmt(addDays(base, idx - 1)) : "Pending";
    return { label, date, done, active };
  });
}

function buildTimeline(ret: ReturnRecord) {
  const base = new Date(ret.requestedDate);
  const fmt = (d: Date, h: number, m: number) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    ` ${h > 12 ? h - 12 : h}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
  const step = statusToStep(ret.status);
  const entries = [
    { text: "Return submitted by customer", time: fmt(base, 10, 34), done: step >= 1 },
    { text: "Return received at warehouse", time: fmt(addDays(base, 0), 14, 12), done: step >= 2 },
    { text: "Inspection completed", time: fmt(addDays(base, 1), 9, 45), done: step >= 3 },
    { text: "Replacement approved", time: fmt(addDays(base, 1), 10, 15), done: step >= 3 },
    { text: "Replacement shipped", time: step >= 4 ? fmt(addDays(base, 2), 11, 30) : "Pending", done: step >= 4 },
  ];
  return entries;
}

const extraTimelineEntries = [
  { text: "Customer notified of resolution", time: "Auto-generated", done: true },
  { text: "Return label created via carrier", time: "Auto-generated", done: true },
  { text: "Refund processed by finance", time: "Auto-generated", done: true },
];

interface NoteEntry {
  meta: string;
  body: string;
}

function Field({ label, value, link, href }: { label: string; value: string; link?: boolean; href?: string }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-[#66758C]">{label}</span>
      {link ? (
        <Link href={href ?? "#"} className="font-medium text-[#0057D8] hover:underline">{value}</Link>
      ) : (
        <span className="font-medium text-[#061A3D]">{value}</span>
      )}
    </div>
  );
}

export default function ReturnDetailView({ ret }: { ret: ReturnRecord }) {
  const { toast } = useToast();

  const refund = ret.refundAmount ?? 0;
  const email = `${ret.customer.toLowerCase().replace(/[^a-z]/g, "")}@example.com`;

  // Hash retained only for the qualitative customer comment below.
  const h = useMemo(() => hashStr(ret.id), [ret.id]);

  // Real, persisted cost breakdown (defaults to 0 when not yet recorded).
  const [costs, setCosts] = useState({
    shippingCost: ret.shippingCost ?? 0,
    restockingFee: ret.restockingFee ?? 0,
    recoveryValue: ret.recoveryValue ?? 0,
  });
  const { shippingCost, restockingFee, recoveryValue } = costs;
  const netCost = refund + shippingCost + restockingFee - recoveryValue;

  const progress = useMemo(() => buildProgress(ret), [ret]);
  const timelineEntries = useMemo(() => buildTimeline(ret), [ret]);

  const [showFullTimeline, setShowFullTimeline] = useState(false);

  // Edit-costs modal state
  const [costsOpen, setCostsOpen] = useState(false);
  const [costsSaving, setCostsSaving] = useState(false);
  const [costDraft, setCostDraft] = useState({ shippingCost: "", restockingFee: "", recoveryValue: "" });

  function openEditCosts() {
    setCostDraft({
      shippingCost: String(shippingCost),
      restockingFee: String(restockingFee),
      recoveryValue: String(recoveryValue),
    });
    setCostsOpen(true);
  }

  async function saveCosts() {
    const parsed = {
      shippingCost: Number(costDraft.shippingCost),
      restockingFee: Number(costDraft.restockingFee),
      recoveryValue: Number(costDraft.recoveryValue),
    };
    const values = Object.values(parsed);
    if (values.some((v) => !Number.isFinite(v) || v < 0)) {
      toast("Enter non-negative numbers for all cost fields", "error");
      return;
    }
    const prev = costs;
    setCosts(parsed); // optimistic
    setCostsSaving(true);
    try {
      const updated = await api.put<ReturnRecord>(`/api/returns/${ret.id}`, parsed);
      setCosts({
        shippingCost: updated.shippingCost ?? parsed.shippingCost,
        restockingFee: updated.restockingFee ?? parsed.restockingFee,
        recoveryValue: updated.recoveryValue ?? parsed.recoveryValue,
      });
      setCostsOpen(false);
      toast("Cost breakdown updated");
    } catch {
      setCosts(prev); // roll back
      toast("Failed to save costs", "error");
    } finally {
      setCostsSaving(false);
    }
  }

  // Deterministic customer description from return ID
  const customerDescription = useMemo(() => {
    const reasons = ret.reason.toLowerCase();
    if (reasons.includes("damage")) return "Item arrived with visible damage to the exterior. The packaging was crushed and the product inside was dented.";
    if (reasons.includes("defect")) return "Found a manufacturing defect after unboxing. The seal on the cap does not close properly and leaks under pressure.";
    if (reasons.includes("wrong")) return "Received the wrong item. The product does not match the description or SKU on the order confirmation.";
    if (reasons.includes("quality")) return "Product quality is significantly below expectations. Material feels cheap and the finish is uneven.";
    return `The product experienced issues consistent with "${ret.reason}". After initial use, problems became apparent and a return was requested.`;
  }, [ret.reason]);

  const additionalComment = useMemo(() => {
    const idx = h % 3;
    const comments = [
      "I expected better quality for the price.",
      "This happened within the first week of use.",
      "I would like a replacement if possible.",
    ];
    return comments[idx];
  }, [h]);

  const [notes, setNotes] = useState<NoteEntry[]>([
    {
      meta: "May 18, 2025 03:45 PM · Emily Chen",
      body: "Customer reported leakage issue. Inspection confirmed defective cap seal. Replacement approved.",
    },
  ]);
  const [editOpen, setEditOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [editDraft, setEditDraft] = useState("");
  const [addDraft, setAddDraft] = useState("");

  function openEditNote(idx: number) {
    setEditIdx(idx);
    setEditDraft(notes[idx]?.body ?? "");
    setEditOpen(true);
  }

  function saveEditNote() {
    if (!editDraft.trim()) { toast("Note cannot be empty", "error"); return; }
    setNotes((prev) => prev.map((n, i) => (i === editIdx ? { ...n, body: editDraft.trim() } : n)));
    setEditOpen(false);
    toast("Note updated");
  }

  function saveAddNote() {
    if (!addDraft.trim()) { toast("Note cannot be empty", "error"); return; }
    const now = new Date();
    const meta = `${now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })} · You`;
    setNotes((prev) => [...prev, { meta, body: addDraft.trim() }]);
    setAddDraft("");
    setAddOpen(false);
    toast("Note added");
  }

  function downloadLabel() {
    exportToCsv(`return-label-${ret.id}`, [
      { field: "Return Carrier", value: "UPS" },
      { field: "Shipping Method", value: "UPS Ground" },
      { field: "Tracking", value: "1Z999AA10123456784" },
      { field: "Label Created", value: "May 18, 2025" },
      { field: "Estimated Delivery", value: "May 21, 2025" },
    ], [{ key: "field", header: "Field" }, { key: "value", header: "Value" }]);
    toast(`Return label for ${ret.id} downloaded`);
  }

  // ---- Attachments (real photo/file feature) ----
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Attachment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: Attachment[] }>(`/api/attachments?entityType=return&entityId=${encodeURIComponent(ret.id)}`);
        if (!cancelled) setAttachments(res.data);
      } catch {
        if (!cancelled) toast("Failed to load attachments", "error");
      } finally {
        if (!cancelled) setAttachmentsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ret.id, toast]);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast("File is too large (max 3MB)", "error");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const created = await api.post<Attachment>("/api/attachments", {
        entityType: "return",
        entityId: ret.id,
        name: file.name,
        mime: file.type || "application/octet-stream",
        dataUrl,
        size: file.size,
      });
      setAttachments((prev) => [...prev, created]);
      toast("File uploaded");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to upload file", "error");
    } finally {
      setUploading(false);
    }
  }

  async function confirmDeleteAttachment() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    const prev = attachments;
    setDeleting(true);
    setAttachments((list) => list.filter((a) => a.id !== target.id)); // optimistic
    try {
      await api.del(`/api/attachments/${target.id}`);
      toast("Attachment deleted");
      setPendingDelete(null);
    } catch (err) {
      setAttachments(prev); // roll back
      toast(err instanceof Error ? err.message : "Failed to delete attachment", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Back + Breadcrumb */}
      <div>
        <Link href="/dashboard/returns" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4A5A73] hover:text-[#061A3D] mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Returns
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#061A3D]">Return Detail</h1>
          <p className="text-[14px] text-[#4A5A73] mt-0.5">View and manage return request, inspection, and resolution.</p>
        </div>
        <ReturnDetailActions ret={ret} />
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
        <div className="grid items-start gap-6" style={{ gridTemplateColumns: "auto 1.6fr 1fr 1.4fr" }}>
          {/* Image */}
          <BottleThumb className="w-20 h-20 rounded-lg shrink-0" />
          {/* ID + fields */}
          <div>
            <p className="text-[11px] text-[#9AA8B8] mb-1">Return ID</p>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[15px] font-bold text-[#061A3D] font-mono">{ret.id}</p>
              <StatusBadge status={ret.status} />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <Field label="Return Date" value={formatDate(ret.requestedDate)} />
              <Field label="Customer" value={ret.customer} />
              <Field label="Order ID" value={ret.orderId} link href={`/dashboard/orders/${ret.orderId}`} />
              <Field label="Customer Email" value={email} />
              <Field label="RMA Type" value="Customer Return" />
              <Field label="Customer Location" value="Los Angeles, CA, USA" />
              <Field label="Channel" value="DTC Website" />
              <Field label="Return Source" value="Online Portal" />
            </div>
          </div>
          {/* Summary */}
          <div>
            <p className="text-[11px] font-semibold text-[#061A3D] mb-2">Summary</p>
            <div className="space-y-2">
              <Field label="Items Returned" value={String(ret.items)} />
              <Field label="Refund Amount" value={formatCurrency(refund)} />
              <Field label="Resolution" value="Replacement" />
              <Field label="Status" value={ret.status} />
            </div>
          </div>
          {/* Return Progress */}
          <div>
            <p className="text-[11px] font-semibold text-[#061A3D] mb-3">Return Progress</p>
            <div className="flex items-start">
              {progress.map((p, i) => (
                <div key={p.label} className="flex items-start" style={{ flex: i === progress.length - 1 ? "0 0 auto" : "1 1 0" }}>
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      p.done ? "bg-[#00B894]" : p.active ? "bg-[#0057D8]" : "bg-white border-2 border-[#E6EDF5]"
                    }`}>
                      {p.done ? <Check className="w-3.5 h-3.5 text-white" /> : p.active ? <span className="w-2 h-2 rounded-full bg-white" /> : null}
                    </div>
                    <p className={`text-[10px] mt-1.5 ${p.done || p.active ? "text-[#061A3D] font-medium" : "text-[#9AA8B8]"}`}>{p.label}</p>
                    <p className="text-[9px] text-[#9AA8B8]">{p.date}</p>
                  </div>
                  {i < progress.length - 1 && <div className={`h-0.5 flex-1 mt-3 ${p.done ? "bg-[#00B894]" : "bg-[#E6EDF5]"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Returned Item / Return Reason / Submitted Photos */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.3fr 1.3fr 1fr" }}>
        {/* Returned Item */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[15px] font-semibold text-[#061A3D] px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">Returned Item</h3>
          <div className="p-5">
            <div className="flex gap-3">
              <BottleThumb className="w-14 h-14 rounded-lg shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-[#061A3D]">FM Stainless Steel Water Bottle – 750ml</p>
                  <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#00B894]/10 text-[#00B894]">Good · Light Wear</span>
                </div>
                <p className="text-[11px] text-[#9AA8B8] mt-0.5">SKU: FM-BTL-750-STL</p>
                <div className="grid grid-cols-3 gap-2 mt-3 text-[12px]">
                  <div><p className="text-[#9AA8B8]">Category</p><p className="font-medium text-[#061A3D]">Drinkware</p></div>
                  <div><p className="text-[#9AA8B8]">Usage Period</p><p className="font-medium text-[#061A3D]">~2 weeks</p></div>
                  <div></div>
                  <div><p className="text-[#9AA8B8]">Unit Price</p><p className="font-medium text-[#061A3D]">{formatCurrency(refund)}</p></div>
                  <div><p className="text-[#9AA8B8]">Qty</p><p className="font-medium text-[#061A3D]">{ret.items}</p></div>
                  <div><p className="text-[#9AA8B8]">Total</p><p className="font-medium text-[#061A3D]">{formatCurrency(refund)}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return Reason */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[15px] font-semibold text-[#061A3D] px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">Return Reason</h3>
          <div className="p-5 space-y-2.5 text-[12px]">
            <Field label="Selected Reason" value={ret.reason} />
            <div>
              <p className="text-[#9AA8B8] mb-1">Customer Description</p>
              <p className="text-[#4A5A73] leading-relaxed">{customerDescription}</p>
            </div>
            <div>
              <p className="text-[#9AA8B8] mb-1">Additional Comments</p>
              <p className="text-[#4A5A73]">{additionalComment}</p>
            </div>
          </div>
        </div>

        {/* Submitted Photos & Files */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
            <h3 className="text-[15px] font-semibold text-[#061A3D]">Submitted Photos &amp; Files <span className="text-[11px] font-normal text-[#9AA8B8]">({attachments.length})</span></h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileSelected}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-[12px] font-medium text-[#0057D8] inline-flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
          <div className="p-5">
            {attachmentsLoading ? (
              <div className="flex flex-col items-center justify-center text-center py-6 text-[#9AA8B8]">
                <Loader2 className="w-5 h-5 animate-spin mb-2" />
                <p className="text-[11px]">Loading attachments…</p>
              </div>
            ) : attachments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-6 rounded-lg border border-dashed border-[#E6EDF5] bg-[#F7FAFC]">
                <ImageOff className="w-6 h-6 text-[#9AA8B8] mb-2" />
                <p className="text-[12px] font-medium text-[#4A5A73]">No photos uploaded</p>
                <p className="text-[11px] text-[#9AA8B8] mt-0.5">Use Upload to attach images or PDFs to this return.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {attachments.map((a) => {
                  const isImage = a.mime.startsWith("image/");
                  return (
                    <div key={a.id} className="group relative">
                      {isImage ? (
                        <a href={a.dataUrl} target="_blank" rel="noopener noreferrer" className="block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={a.dataUrl} alt={a.name} className="aspect-square w-full rounded-lg object-cover border border-[#E6EDF5] bg-[#F7FAFC]" />
                        </a>
                      ) : (
                        <a href={a.dataUrl} target="_blank" rel="noopener noreferrer" className="flex aspect-square w-full flex-col items-center justify-center rounded-lg border border-[#E6EDF5] bg-[#F7FAFC] p-1 text-center">
                          <FileIcon className="w-6 h-6 text-[#9AA8B8] mb-1" />
                          <span className="text-[9px] text-[#66758C] truncate w-full px-0.5">{a.name}</span>
                        </a>
                      )}
                      <button
                        onClick={() => setPendingDelete(a)}
                        className="absolute top-1 right-1 rounded-md bg-white/90 p-1 text-[#EF4444] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-white"
                        aria-label={`Delete ${a.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-[9px] text-[#9AA8B8] mt-1 truncate text-center" title={a.name}>{formatBytes(a.size)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Issue Classification / Inspection / Resolution / Warehouse */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
        {/* Issue Classification */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><Search className="w-4 h-4 text-[#7C6FF6]" /><h3 className="text-[14px] font-semibold text-[#061A3D]">Issue Classification</h3></div>
          <div className="space-y-2">
            <Field label="Issue Category" value="Quality / Defect" />
            <Field label="Issue Type" value="Leakage" />
            <div className="flex items-center justify-between text-[12px]"><span className="text-[#66758C]">Severity</span><span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F59E0B]/10 text-[#F59E0B]">Medium</span></div>
            <Field label="Affects Multiple Units?" value="No" />
            <Field label="Corrective Action" value="Inspect supplier" />
          </div>
        </div>

        {/* Inspection Results */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#F59E0B]" /><h3 className="text-[14px] font-semibold text-[#061A3D]">Inspection Results</h3></div>
            <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EF4444]/10 text-[#EF4444]">Failed</span>
          </div>
          <div className="space-y-2">
            <Field label="Inspection Date" value="May 18, 2025" />
            <Field label="Inspected By" value="Emily Chen" />
            <Field label="Inspection Type" value="Physical Inspection" />
            <Field label="Checks Performed" value="8" />
            <Field label="Checks Passed" value="6" />
          </div>
        </div>

        {/* Resolution */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Wrench className="w-4 h-4 text-[#00B894]" /><h3 className="text-[14px] font-semibold text-[#061A3D]">Resolution</h3></div>
            <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#00B894]/10 text-[#00B894]">Replacement Approved</span>
          </div>
          <div className="space-y-2">
            <Field label="Resolution Type" value="Replacement" />
            <Field label="Replacement Item" value="FM Water Bottle" />
            <Field label="Replacement SKU" value="FM-BTL-750-STL" />
            <Field label="Replacement Qty" value="1" />
            <Field label="Approved By" value="Emily Chen" />
          </div>
        </div>

        {/* Warehouse / Restock */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><Warehouse className="w-4 h-4 text-[#0057D8]" /><h3 className="text-[14px] font-semibold text-[#061A3D]">Warehouse / Restock</h3></div>
          <div className="space-y-2">
            <Field label="Return Received At" value="Los Angeles, CA" />
            <Field label="Received Date" value="May 18, 2025" />
            <div className="flex items-center justify-between text-[12px]"><span className="text-[#66758C]">Condition (Warehouse)</span><span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EF4444]/10 text-[#EF4444]">Used – Not Resalable</span></div>
            <Field label="Restock Location" value="Quarantine" />
            <Field label="Disposition" value="Pending" />
          </div>
        </div>
      </div>

      {/* Shipping & Return Label / Timeline / Financial Impact / Notes */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.3fr 1.3fr 1fr 1fr" }}>
        {/* Shipping & Return Label */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
            <Truck className="w-4 h-4 text-[#0057D8]" />
            <h3 className="text-[15px] font-semibold text-[#061A3D]">Shipping &amp; Return Label</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
              <Field label="Return Carrier" value="UPS" />
              <Field label="Shipping Method" value="UPS Ground" />
              <div className="flex items-center justify-between text-[12px] col-span-2">
                <span className="text-[#66758C]">Tracking</span>
                <a href="https://www.ups.com/track?tracknum=1Z999AA10123456784" target="_blank" rel="noopener noreferrer" className="font-medium text-[#0057D8] flex items-center gap-1 hover:underline">1Z999AA10123456784 <ExternalLink className="w-3 h-3" /></a>
              </div>
              <Field label="Label Created" value="May 18, 2025" />
              <Field label="Estimated Delivery" value="May 21, 2025" />
            </div>
            <button onClick={downloadLabel} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[12px] font-medium text-[#4A5A73] hover:bg-[#F7FAFC]"><Download className="w-4 h-4" /> Download Label</button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[15px] font-semibold text-[#061A3D] px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">Timeline</h3>
          <div className="p-5">
            <div className="relative pl-5">
              <div className="absolute left-[6px] top-1 bottom-3 w-px bg-[#E6EDF5]" />
              {timelineEntries.map((t, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div className={`absolute -left-5 top-0.5 w-3 h-3 rounded-full border-2 ${t.done ? "bg-[#00B894] border-[#00B894]" : "bg-white border-[#9AA8B8]"}`} />
                  <p className="text-[12px] font-semibold text-[#061A3D]">{t.text}</p>
                  <p className="text-[10px] text-[#9AA8B8]">{t.time}</p>
                </div>
              ))}
              {showFullTimeline && extraTimelineEntries.map((t, i) => (
                <div key={`extra-${i}`} className="relative mb-4 last:mb-0">
                  <div className="absolute -left-5 top-0.5 w-3 h-3 rounded-full border-2 bg-[#00B894] border-[#00B894]" />
                  <p className="text-[12px] font-semibold text-[#061A3D]">{t.text}</p>
                  <p className="text-[10px] text-[#9AA8B8]">{t.time}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowFullTimeline((v) => !v)} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-2">{showFullTimeline ? "Show less" : "View full timeline"} <ArrowRight className={`w-3 h-3 transition-transform ${showFullTimeline ? "rotate-90" : ""}`} /></button>
          </div>
        </div>

        {/* Financial Impact */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#00B894]" />
              <h3 className="text-[15px] font-semibold text-[#061A3D]">Financial Impact</h3>
            </div>
            <button onClick={openEditCosts} className="text-[12px] font-medium text-[#0057D8] flex items-center gap-1 hover:underline"><Edit2 className="w-3 h-3" /> Edit costs</button>
          </div>
          <div className="p-5">
            <div className="space-y-2.5 text-[12px]">
              <div><p className="text-[#9AA8B8]">Refund Amount</p><p className="font-bold text-[#061A3D]">{formatCurrency(refund)}</p></div>
              <div><p className="text-[#9AA8B8]">Return Shipping Cost</p><p className="font-bold text-[#EF4444]">{formatCurrency(shippingCost)}</p></div>
              <div><p className="text-[#9AA8B8]">Restocking Fee</p><p className="font-bold text-[#061A3D]">{formatCurrency(restockingFee)}</p></div>
              <div><p className="text-[#9AA8B8]">Recovery Value</p><p className="font-bold text-[#00B894]">−{formatCurrency(recoveryValue)}</p></div>
              <div className="pt-2 border-t border-[#E6EDF5]"><p className="text-[#9AA8B8]">Net Cost</p><p className="font-bold text-[#EF4444]">{formatCurrency(netCost)}</p></div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
            <h3 className="text-[15px] font-semibold text-[#061A3D]">Notes</h3>
            <button onClick={() => openEditNote(notes.length - 1)} className="text-[12px] font-medium text-[#0057D8] flex items-center gap-1"><Edit2 className="w-3 h-3" /> Edit Note</button>
          </div>
          <div className="p-5">
            {notes.map((n, i) => (
              <div key={i} className={i > 0 ? "mt-4 pt-4 border-t border-[#E6EDF5]" : ""}>
                <p className="text-[10px] text-[#9AA8B8]">{n.meta}</p>
                <p className="text-[12px] text-[#4A5A73] mt-2 leading-relaxed">{n.body}</p>
              </div>
            ))}
            <button onClick={() => { setAddDraft(""); setAddOpen(true); }} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">Add Note <ArrowRight className="w-3 h-3" /></button>
          </div>
        </div>
      </div>

      {/* Edit note modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Note"
        description="Update the latest note for this return."
        footer={
          <>
            <SecondaryButton onClick={() => setEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveEditNote}>Save changes</PrimaryButton>
          </>
        }
      >
        <FormField label="Note">
          <TextArea value={editDraft} onChange={(e) => setEditDraft(e.target.value)} rows={4} />
        </FormField>
      </Modal>

      {/* Add note modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Note"
        description="Record a new note for this return."
        footer={
          <>
            <SecondaryButton onClick={() => setAddOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveAddNote}>Add note</PrimaryButton>
          </>
        }
      >
        <FormField label="Note">
          <TextArea value={addDraft} onChange={(e) => setAddDraft(e.target.value)} rows={4} placeholder="Type your note…" />
        </FormField>
      </Modal>

      {/* Edit costs modal */}
      <Modal
        open={costsOpen}
        onClose={() => { if (!costsSaving) setCostsOpen(false); }}
        title="Edit Costs"
        description="Update the cost breakdown for this return. Net cost = refund + shipping + restocking − recovery."
        footer={
          <>
            <SecondaryButton onClick={() => setCostsOpen(false)} disabled={costsSaving}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveCosts} disabled={costsSaving}>{costsSaving ? "Saving…" : "Save costs"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          <FormField label="Return Shipping Cost ($)">
            <NumberInput
              min={0}
              step="0.01"
              value={costDraft.shippingCost}
              onChange={(e) => setCostDraft((d) => ({ ...d, shippingCost: e.target.value }))}
            />
          </FormField>
          <FormField label="Restocking Fee ($)">
            <NumberInput
              min={0}
              step="0.01"
              value={costDraft.restockingFee}
              onChange={(e) => setCostDraft((d) => ({ ...d, restockingFee: e.target.value }))}
            />
          </FormField>
          <FormField label="Recovery Value ($)">
            <NumberInput
              min={0}
              step="0.01"
              value={costDraft.recoveryValue}
              onChange={(e) => setCostDraft((d) => ({ ...d, recoveryValue: e.target.value }))}
            />
          </FormField>
        </div>
      </Modal>

      {/* Delete attachment confirm */}
      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => { if (!deleting) setPendingDelete(null); }}
        onConfirm={confirmDeleteAttachment}
        title="Delete attachment"
        message={`Remove "${pendingDelete?.name ?? ""}" from this return? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
      />
    </div>
  );
}
