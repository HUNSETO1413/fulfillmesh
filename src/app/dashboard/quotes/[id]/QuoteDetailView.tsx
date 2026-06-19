"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight, Star, Plus, Trash2, Loader2,
  FileText, Image as ImageIcon, Download,
} from "lucide-react";
import type { Quote, QuoteBid } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field as FormField, TextInput, NumberInput, TextArea, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import QuoteDetailActions from "./QuoteDetailActions";

// Colors cycled through the cost-breakdown donut so each segment is distinct.
const COST_COLORS = ["#0057D8", "#00B894", "#F59E0B", "#EF4444", "#7C6FF6"];

interface BidForm {
  supplier: string;
  unitPrice: string;
  leadTimeDays: string;
  moq: string;
  landedCost: string;
  notes: string;
}

const emptyBidForm: BidForm = {
  supplier: "",
  unitPrice: "",
  leadTimeDays: "",
  moq: "",
  landedCost: "",
  notes: "",
};

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

  // ---- real supplier bids ----
  const [bids, setBids] = useState<QuoteBid[]>([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [bidsError, setBidsError] = useState(false);

  // Fetch the real supplier bids for this quote; reused by mount + retry.
  const loadBids = useCallback(async () => {
    setBidsLoading(true);
    setBidsError(false);
    try {
      const { data } = await api.get<{ data: QuoteBid[] }>(`/api/quote-bids?quoteId=${encodeURIComponent(quote.id)}`);
      setBids(data);
    } catch {
      setBidsError(true);
    } finally {
      setBidsLoading(false);
    }
  }, [quote.id]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setBidsError(false);
      try {
        const { data } = await api.get<{ data: QuoteBid[] }>(`/api/quote-bids?quoteId=${encodeURIComponent(quote.id)}`);
        if (!cancelled) setBids(data);
      } catch {
        if (!cancelled) setBidsError(true);
      } finally {
        if (!cancelled) setBidsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [quote.id]);

  // The recommended bid drives the cost breakdown; fall back to lowest landed cost.
  const recommendedBid = useMemo(() => {
    if (bids.length === 0) return null;
    return (
      bids.find((b) => b.recommended) ??
      [...bids].sort((a, b) => a.landedCost - b.landedCost)[0]
    );
  }, [bids]);

  // ---- add / edit bid state ----
  const [addOpen, setAddOpen] = useState(false);
  const [bidForm, setBidForm] = useState<BidForm>(emptyBidForm);
  const [savingBid, setSavingBid] = useState(false);
  const [pendingBidId, setPendingBidId] = useState<string | null>(null);
  const [confirmDeleteBid, setConfirmDeleteBid] = useState<QuoteBid | null>(null);

  const bidFormValid =
    bidForm.supplier.trim().length > 0 &&
    bidForm.unitPrice.trim() !== "" &&
    bidForm.landedCost.trim() !== "";

  function setBidField<K extends keyof BidForm>(key: K, value: BidForm[K]) {
    setBidForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitBid() {
    if (!bidFormValid || savingBid) return;
    setSavingBid(true);
    try {
      const created = await api.post<QuoteBid>("/api/quote-bids", {
        quoteId: quote.id,
        supplier: bidForm.supplier.trim(),
        unitPrice: Number(bidForm.unitPrice) || 0,
        leadTimeDays: Number(bidForm.leadTimeDays) || 0,
        moq: Number(bidForm.moq) || 0,
        landedCost: Number(bidForm.landedCost) || 0,
        recommended: false,
        notes: bidForm.notes.trim() || undefined,
      });
      setBids((prev) => [...prev, created]);
      setAddOpen(false);
      setBidForm(emptyBidForm);
      toast("Supplier bid added");
    } catch {
      toast("Could not add supplier bid", "error");
    } finally {
      setSavingBid(false);
    }
  }

  // Mark one bid recommended; optimistically flip the flag and roll back on failure.
  async function markRecommended(bid: QuoteBid) {
    if (pendingBidId || bid.recommended) return;
    const prev = bids;
    setPendingBidId(bid.id);
    setBids((curr) => curr.map((b) => ({ ...b, recommended: b.id === bid.id })));
    try {
      await api.put<QuoteBid>(`/api/quote-bids/${bid.id}`, { ...bid, recommended: true });
      toast(`${bid.supplier} marked recommended`);
    } catch {
      setBids(prev);
      toast("Could not update recommendation", "error");
    } finally {
      setPendingBidId(null);
    }
  }

  async function deleteBid(bid: QuoteBid) {
    const prev = bids;
    setPendingBidId(bid.id);
    setBids((curr) => curr.filter((b) => b.id !== bid.id));
    try {
      await api.del(`/api/quote-bids/${bid.id}`);
      toast(`${bid.supplier} bid removed`);
    } catch {
      setBids(prev);
      toast("Could not remove bid", "error");
    } finally {
      setPendingBidId(null);
      setConfirmDeleteBid(null);
    }
  }

  // ---- cost breakdown derived from the recommended/selected bid ----
  const costBreakdown = useMemo(() => {
    if (!recommendedBid) return [];
    const unit = recommendedBid.unitPrice;
    const total = recommendedBid.landedCost;
    const overhead = Math.max(total - unit, 0);
    // Split the non-unit overhead across typical landed-cost line items.
    const rows = [
      { label: "Unit Cost", value: unit, color: COST_COLORS[0] },
      { label: "Shipping (Sea)", value: overhead * 0.55, color: COST_COLORS[1] },
      { label: "Import Duties", value: overhead * 0.28, color: COST_COLORS[2] },
      { label: "Customs Clearance", value: overhead * 0.12, color: COST_COLORS[3] },
      { label: "Local Delivery", value: overhead * 0.05, color: COST_COLORS[4] },
    ];
    return rows.map((r) => ({
      ...r,
      pct: total > 0 ? (r.value / total) * 100 : 0,
    }));
  }, [recommendedBid]);

  const circumference = 2 * Math.PI * 35;
  const costOffsets = useMemo(
    () =>
      costBreakdown.reduce<number[]>((acc, _c, i) => {
        acc.push(i === 0 ? 0 : acc[i - 1] + costBreakdown[i - 1].pct);
        return acc;
      }, []),
    [costBreakdown],
  );

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
    if (bids.length === 0) { toast("No supplier bids to export", "error"); return; }
    const rows = bids.map((b) => ({
      supplier: b.supplier,
      unitPrice: formatCurrency(b.unitPrice),
      moq: formatNumber(b.moq),
      leadTimeDays: `${b.leadTimeDays} days`,
      landedCost: formatCurrency(b.landedCost),
      recommended: (b.id === recommendedBid?.id) ? "Yes" : "No",
    }));
    exportToCsv(`quote-comparison-${quote.id}`, rows, [
      { key: "supplier", header: "Supplier" },
      { key: "unitPrice", header: "Unit Cost (USD)" },
      { key: "moq", header: "MOQ" },
      { key: "leadTimeDays", header: "Lead Time" },
      { key: "landedCost", header: "Total Landed Cost (USD)" },
      { key: "recommended", header: "Recommended" },
    ]);
    toast("Comparison exported");
  }

  // Metric rows rendered per supplier in the comparison table.
  const compRows: { label: string; render: (b: QuoteBid) => string }[] = [
    { label: "Unit Cost (USD)", render: (b) => formatCurrency(b.unitPrice) },
    { label: "MOQ", render: (b) => `${formatNumber(b.moq)} units` },
    { label: "Lead Time", render: (b) => `${b.leadTimeDays} days` },
    { label: "Notes", render: (b) => b.notes ?? "—" },
  ];

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
            <p className="text-[12px] text-[#4A5A73] mt-2">
              {bidsLoading ? "Loading quotes…" : `${bids.length} quote${bids.length === 1 ? "" : "s"} received`}
            </p>
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
              <span className="text-[12px] text-[#66758C]">
                {bidsLoading ? "Loading…" : `${bids.length} supplier${bids.length === 1 ? "" : "s"} responded`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setBidForm(emptyBidForm); setAddOpen(true); }} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0057D8] hover:underline"><Plus className="w-3.5 h-3.5" /> Add supplier bid</button>
              <button onClick={exportComparison} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0057D8] hover:underline"><Download className="w-3.5 h-3.5" /> Export</button>
            </div>
          </div>
          <div className="p-5">
            {bidsLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-[13px] text-[#66758C]">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading supplier bids…
              </div>
            ) : bidsError ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-[13px] text-[#66758C]">Could not load supplier bids.</p>
                <SecondaryButton onClick={() => void loadBids()}>Retry</SecondaryButton>
              </div>
            ) : bids.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-[13px] font-medium text-[#061A3D]">No supplier bids yet</p>
                <p className="text-[12px] text-[#66758C]">Add a supplier bid to start comparing landed costs.</p>
                <PrimaryButton onClick={() => { setBidForm(emptyBidForm); setAddOpen(true); }}>
                  <span className="inline-flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add supplier bid</span>
                </PrimaryButton>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth: "640px" }}>
                  <thead>
                    <tr className="border-b border-[#E6EDF5]">
                      <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider px-3 py-2 w-[160px]">Supplier</th>
                      {bids.map((b) => {
                        const isRec = b.id === recommendedBid?.id;
                        return (
                          <th key={b.id} className={`text-left px-3 py-2 ${isRec ? "bg-[#ECFDF5]" : ""}`}>
                            {isRec && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#00B894] mb-1">
                                <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" /> Recommended
                              </span>
                            )}
                            <p className="text-[13px] font-semibold text-[#061A3D]">{b.supplier}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {!isRec && (
                                <button
                                  onClick={() => void markRecommended(b)}
                                  disabled={pendingBidId !== null}
                                  className="text-[10px] font-medium text-[#0057D8] hover:underline disabled:opacity-50"
                                >
                                  Mark recommended
                                </button>
                              )}
                              <button
                                onClick={() => setConfirmDeleteBid(b)}
                                disabled={pendingBidId !== null}
                                className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#EF4444] hover:underline disabled:opacity-50"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {compRows.map((row) => (
                      <tr key={row.label} className="border-b border-[#F1F5F9]">
                        <td className="px-3 py-2.5 text-[12px] text-[#4A5A73]">{row.label}</td>
                        {bids.map((b) => {
                          const isRec = b.id === recommendedBid?.id;
                          return (
                            <td key={b.id} className={`px-3 py-2.5 text-[13px] text-[#061A3D] ${isRec ? "bg-[#ECFDF5]" : ""}`}>
                              {row.render(b)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {/* Total Landed Cost */}
                    <tr className="border-b border-[#F1F5F9]">
                      <td className="px-3 py-2.5 text-[12px] text-[#4A5A73]">
                        Total Landed Cost (USD)
                        <span className="block text-[11px] text-[#9AA8B8]">(Est. per unit)</span>
                      </td>
                      {bids.map((b) => {
                        const isRec = b.id === recommendedBid?.id;
                        return (
                          <td key={b.id} className={`px-3 py-2.5 ${isRec ? "bg-[#ECFDF5]" : ""}`}>
                            <span className="text-[16px] font-bold text-[#00B894]">{formatCurrency(b.landedCost)}</span>
                            <span className="block text-[11px] text-[#9AA8B8]">Est. per unit</span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
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
            <h3 className="text-[14px] font-semibold text-[#061A3D]">
              Cost Breakdown {recommendedBid ? `(${recommendedBid.supplier})` : "(Recommended Supplier)"}
            </h3>
          </div>
          <div className="p-5">
            {!recommendedBid ? (
              <div className="py-10 text-center text-[13px] text-[#66758C]">
                {bidsLoading ? "Loading cost breakdown…" : "Add a supplier bid to see the landed-cost breakdown."}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Donut + breakdown */}
                <div className="flex items-center gap-6">
                  <div className="relative w-[140px] h-[140px] shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="35" fill="none" stroke="#F1F5F9" strokeWidth="13" />
                      {costBreakdown.map((c, i) => {
                        const len = (c.pct / 100) * circumference;
                        return (
                          <circle
                            key={c.label}
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
                        <p className="text-[18px] font-bold text-[#061A3D]">{formatCurrency(recommendedBid.landedCost)}</p>
                        <p className="text-[10px] text-[#9AA8B8]">Est. per unit</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {costBreakdown.map((c) => (
                      <div key={c.label} className="flex items-center text-[12px]">
                        <span className="w-2 h-2 rounded-full shrink-0 mr-2" style={{ backgroundColor: c.color }} />
                        <span className="text-[#4A5A73] flex-1">{c.label}</span>
                        <span className="text-[#061A3D] font-medium w-14 text-right">{formatCurrency(c.value)}</span>
                        <span className="text-[#9AA8B8] w-12 text-right">{c.pct.toFixed(1)}%</span>
                      </div>
                    ))}
                    <div className="flex items-center text-[12px] pt-2 mt-1 border-t border-[#E6EDF5] font-semibold">
                      <span className="text-[#061A3D] flex-1">Total Landed Cost</span>
                      <span className="text-[#061A3D] w-14 text-right">{formatCurrency(recommendedBid.landedCost)}</span>
                      <span className="text-[#9AA8B8] w-12 text-right">100%</span>
                    </div>
                  </div>
                </div>
                {/* Cost details */}
                <div>
                  <h4 className="text-[14px] font-semibold text-[#061A3D] mb-3">Cost Details</h4>
                  <div className="space-y-0">
                    {costBreakdown.map((c) => (
                      <div key={c.label} className="flex items-center justify-between text-[12px] py-2.5 border-b border-[#F1F5F9]">
                        <span className="text-[#4A5A73]">{c.label}</span>
                        <span className="text-[#061A3D] font-medium">{formatCurrency(c.value)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-[12px] py-2.5 border-b border-[#F1F5F9]">
                      <span className="text-[#4A5A73]">MOQ</span>
                      <span className="text-[#061A3D] font-medium">{formatNumber(recommendedBid.moq)} units</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px] py-2.5 border-b border-[#F1F5F9]">
                      <span className="text-[#4A5A73]">Lead Time</span>
                      <span className="text-[#061A3D] font-medium">{recommendedBid.leadTimeDays} days</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px] font-semibold pt-3">
                      <span className="text-[#061A3D]">Total Landed Cost</span>
                      <span className="text-[#00B894]">{formatCurrency(recommendedBid.landedCost)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

      {/* Add supplier bid modal */}
      <Modal
        open={addOpen}
        onClose={() => { if (!savingBid) setAddOpen(false); }}
        title="Add supplier bid"
        description="Record a new supplier quote for this RFQ."
        size="md"
        footer={
          <>
            <SecondaryButton onClick={() => setAddOpen(false)} disabled={savingBid}>Cancel</SecondaryButton>
            <PrimaryButton onClick={() => void submitBid()} disabled={!bidFormValid || savingBid}>
              {savingBid ? "Adding…" : "Add bid"}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          <FormField label="Supplier" required>
            <TextInput
              value={bidForm.supplier}
              onChange={(e) => setBidField("supplier", e.target.value)}
              placeholder="e.g. Shenzhen Topway Tech"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Unit Price (USD)" required>
              <NumberInput
                min={0}
                step="0.01"
                value={bidForm.unitPrice}
                onChange={(e) => setBidField("unitPrice", e.target.value)}
                placeholder="12.45"
              />
            </FormField>
            <FormField label="Landed Cost (USD)" required>
              <NumberInput
                min={0}
                step="0.01"
                value={bidForm.landedCost}
                onChange={(e) => setBidField("landedCost", e.target.value)}
                placeholder="13.78"
              />
            </FormField>
            <FormField label="Lead Time (days)">
              <NumberInput
                min={0}
                value={bidForm.leadTimeDays}
                onChange={(e) => setBidField("leadTimeDays", e.target.value)}
                placeholder="20"
              />
            </FormField>
            <FormField label="MOQ (units)">
              <NumberInput
                min={0}
                value={bidForm.moq}
                onChange={(e) => setBidField("moq", e.target.value)}
                placeholder="1000"
              />
            </FormField>
          </div>
          <FormField label="Notes">
            <TextArea
              value={bidForm.notes}
              onChange={(e) => setBidField("notes", e.target.value)}
              rows={3}
              placeholder="QC capability, packaging, certifications…"
            />
          </FormField>
        </div>
      </Modal>

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

      {/* Remove bid confirmation */}
      <ConfirmDialog
        open={confirmDeleteBid !== null}
        onClose={() => setConfirmDeleteBid(null)}
        onConfirm={() => { if (confirmDeleteBid) void deleteBid(confirmDeleteBid); }}
        title="Remove supplier bid?"
        message={`This will remove the bid from ${confirmDeleteBid?.supplier ?? "this supplier"}. This cannot be undone.`}
        confirmLabel="Remove bid"
        cancelLabel="Keep bid"
        destructive
      />

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
