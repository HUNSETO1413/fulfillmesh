"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ChevronDown, Check, ArrowRight, Edit2,
  FileText, Download, Filter, MessageSquare, Trash2, Loader2,
} from "lucide-react";
import type { Order, OrderStatus, Attachment } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextArea, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";
import { formatCurrency, formatDate } from "@/lib/format";
import OrderDetailActions from "./OrderDetailActions";

// Canonical fulfillment progression. "Cancelled" is handled separately since it
// is a terminal off-ramp rather than a forward step.
const steps = ["Pending", "Processing", "In Transit", "Delivered"] as const;

/**
 * Maps a real order status to the index of the furthest-reached step.
 * Cancelled orders return the index they were cancelled-from heuristic: we surface
 * them at the "Processing" boundary but render a cancelled state in the UI.
 */
function statusToStepIndex(status: OrderStatus): number {
  switch (status) {
    case "Pending": return 0;
    case "Processing": return 1;
    case "In Transit": return 2;
    case "Delivered": return 3;
    case "Cancelled": return 1; // progressed at least to processing before cancellation
  }
}

interface TimelineEntry {
  title: string;
  time: string;
  desc: string;
  done: boolean;
}

interface ActivityEntry {
  date: string;
  user: string;
  action: string;
  details: string;
}

interface AddressData {
  lines: string[];
}

interface NoteEntry {
  label: string;
  text: string;
  time: string;
  customer?: boolean;
}

// Maximum size for an inline attachment (matches the backend's 3MB cap).
const MAX_ATTACHMENT_BYTES = 3_000_000;

/** Human-readable byte size, e.g. 245 KB or 1.2 MB. */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Reads a File into a base64 data URL via FileReader. */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/** Converts a data URL to a Blob so stored attachments can be downloaded. */
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = /data:([^;]+)/.exec(header);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Triggers a real browser download of a stored attachment's data URL. */
function downloadAttachment(att: Attachment) {
  const blob = dataUrlToBlob(att.dataUrl);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = att.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function parseNotes(raw: string): NoteEntry[] {
  return raw.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
    const idx = line.indexOf(":");
    if (idx > 0) return { label: line.slice(0, idx).trim(), text: line.slice(idx + 1).trim(), time: "" };
    return { label: "Note", text: line, time: "" };
  });
}

function serializeNotes(notes: NoteEntry[]): string {
  return notes.map((n) => `${n.label}: ${n.text}`).join("\n");
}

export default function OrderDetailView({ order }: { order: Order }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const orderItems = order.items ?? [];
  const itemCount = orderItems.reduce((sum, it) => sum + it.quantity, 0);
  const skuCount = orderItems.length;
  const initials = order.customer.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const customerHref = order.customerId
    ? `/dashboard/customers/${order.customerId}`
    : "/dashboard/customers";

  // ---- Status-derived fulfillment progress, timeline & activity ----
  const currentStep = useMemo(() => statusToStepIndex(order.status), [order.status]);
  const isCancelled = order.status === "Cancelled";

  // Human-readable order date/time anchor used across the derived timeline.
  const orderDateLabel = useMemo(() => formatDate(order.date), [order.date]);

  // Fulfillment badge derived from the real status.
  const fulfillment = useMemo(() => {
    switch (order.status) {
      case "Pending": return { label: "Pending", bg: "#F59E0B1A", color: "#F59E0B" };
      case "Processing": return { label: "Processing", bg: "#3B82F61A", color: "#3B82F6" };
      case "In Transit": return { label: "In Transit", bg: "#3B82F61A", color: "#3B82F6" };
      case "Delivered": return { label: "Delivered", bg: "#10B9811A", color: "#10B981" };
      case "Cancelled": return { label: "Cancelled", bg: "#EF44441A", color: "#EF4444" };
    }
  }, [order.status]);

  // Timeline built from the real order: the placed event always happened; the
  // remaining milestones light up based on how far the real status has advanced.
  const timeline = useMemo<TimelineEntry[]>(() => {
    const idx = currentStep;
    const entries: TimelineEntry[] = [
      {
        title: "Order Placed",
        time: orderDateLabel,
        desc: `Order ${order.id} created via ${order.channel ?? "Web Store"}`,
        done: true,
      },
      {
        title: "Processing",
        time: idx >= 1 ? orderDateLabel : "",
        desc: idx >= 1 ? "Items allocated and prepared for fulfillment" : "Awaiting processing",
        done: idx >= 1,
      },
      {
        title: "In Transit",
        time: idx >= 2 ? orderDateLabel : "",
        desc: order.trackingNumber
          ? `Shipped with tracking ${order.trackingNumber}`
          : idx >= 2 ? "Handed to carrier" : "Awaiting carrier pickup",
        done: idx >= 2,
      },
      {
        title: "Delivered",
        time: idx >= 3 ? orderDateLabel : "",
        desc: idx >= 3 ? `Delivered to ${order.destination ?? "destination"}` : "Out for delivery",
        done: idx >= 3,
      },
    ];
    if (isCancelled) {
      entries.push({
        title: "Order Cancelled",
        time: orderDateLabel,
        desc: "This order was cancelled",
        done: true,
      });
    }
    return entries;
  }, [currentStep, isCancelled, orderDateLabel, order.id, order.channel, order.trackingNumber, order.destination]);

  // Address state + editing
  const [shipping, setShipping] = useState<AddressData>({
    lines: ["John Smith", "Acme Retail", "742 Evergreen Terrace", "Springfield, IL 62704", "United States", "Phone: +1 (217) 555-0198"],
  });
  const [billing, setBilling] = useState<AddressData>({
    lines: ["Acme Retail", "Accounts Payable", "742 Evergreen Terrace", "Springfield, IL 62704", "United States", "Email: billing@acmeretail.com", "Phone: +1 (217) 555-0199"],
  });
  const [addrEdit, setAddrEdit] = useState<null | "shipping" | "billing">(null);
  const [addrDraft, setAddrDraft] = useState("");

  function openAddrEdit(which: "shipping" | "billing") {
    setAddrDraft((which === "shipping" ? shipping : billing).lines.join("\n"));
    setAddrEdit(which);
  }
  async function saveAddr() {
    const lines = addrDraft.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) { toast("Address cannot be empty", "error"); return; }
    const which = addrEdit;
    if (which === "shipping") {
      // The order model stores a single destination string; derive it from the
      // city/country lines and persist it alongside the local display lines.
      const destination = lines
        .filter((l) => !/^(phone|email)/i.test(l))
        .slice(-2)
        .join(", ");
      const prev = shipping;
      // Optimistic update — apply immediately, roll back on API failure.
      setShipping({ lines });
      setAddrEdit(null);
      setBusy(true);
      try {
        await api.put(`/api/orders/${order.id}`, { destination });
        toast("Shipping address updated");
        router.refresh();
      } catch (e) {
        setShipping(prev); // rollback
        setAddrEdit("shipping");
        setAddrDraft(lines.join("\n"));
        toast(e instanceof Error ? e.message : "Could not update shipping address", "error");
      } finally { setBusy(false); }
    } else {
      // Billing is local-only (no order field) — apply directly.
      setBilling({ lines });
      toast("Billing address updated");
      setAddrEdit(null);
    }
  }

  // Linked shipment
  const [shipmentCreated, setShipmentCreated] = useState(false);
  async function createLinkedShipment() {
    setBusy(true);
    try {
      const ship = await api.post<{ id: string }>("/api/shipments", {
        orderId: order.id,
        carrier: "DHL Express",
        trackingNumber: order.trackingNumber || `1Z${order.id}`,
        origin: "Shenzhen, CN",
        destination: order.destination || "United States",
        status: "Awaiting Pickup",
      });
      toast(`Shipment ${ship.id} created for ${order.id}`);
      setShipmentCreated(true);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not create shipment", "error");
    } finally { setBusy(false); }
  }

  // Notes — backed by the order's `notes` field, persisted via PUT.
  const [notes, setNotes] = useState<NoteEntry[]>(() => (
    order.notes
      ? parseNotes(order.notes)
      : [
        { label: "Customer Note", text: "Please gift wrap all items. This is a corporate order.", time: "May 18, 2025 10:24 AM", customer: true },
        { label: "Internal Note", text: "Expedite shipping if possible. Customer has an event on May 27.", time: "" },
      ]
  ));
  const [notesEdit, setNotesEdit] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  async function persistNotes(next: NoteEntry[], successMsg: string): Promise<boolean> {
    const prev = notes;
    // Optimistic update — show the new notes immediately, roll back on failure.
    setNotes(next);
    setBusy(true);
    try {
      await api.put(`/api/orders/${order.id}`, { notes: serializeNotes(next) });
      toast(successMsg);
      router.refresh();
      return true;
    } catch (e) {
      setNotes(prev); // rollback
      toast(e instanceof Error ? e.message : "Could not save notes", "error");
      return false;
    } finally { setBusy(false); }
  }

  function openNotesEdit() {
    setNotesDraft(notes.map((n) => `${n.label}: ${n.text}`).join("\n"));
    setNotesEdit(true);
  }
  async function saveNotesEdit() {
    const parsed = notesDraft.split("\n").map((l) => l.trim()).filter(Boolean).map((line, i) => {
      const idx = line.indexOf(":");
      if (idx > 0) return { label: line.slice(0, idx).trim(), text: line.slice(idx + 1).trim(), time: notes[i]?.time ?? "", customer: notes[i]?.customer };
      return { label: notes[i]?.label ?? "Note", text: line, time: notes[i]?.time ?? "", customer: notes[i]?.customer };
    });
    if (await persistNotes(parsed, "Notes updated")) setNotesEdit(false);
  }
  async function addNote() {
    const text = newNote.trim();
    if (!text) { toast("Note cannot be empty", "error"); return; }
    const next = [...notes, { label: "Internal Note", text, time: "Just now" }];
    if (await persistNotes(next, "Note added")) {
      setNewNote("");
      setAddNoteOpen(false);
    }
  }

  // Documents — backed by the real attachments API (base64 data-URL storage).
  const [docs, setDocs] = useState<Attachment[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load this order's attachments on mount. `docsLoading` starts true so the
  // loading state shows immediately without a synchronous setState here.
  useEffect(() => {
    let active = true;
    api.get<{ data: Attachment[] }>(`/api/attachments?entityType=order&entityId=${encodeURIComponent(order.id)}`)
      .then((res) => { if (active) setDocs(res.data); })
      .catch((e) => { if (active) toast(e instanceof Error ? e.message : "Could not load documents", "error"); })
      .finally(() => { if (active) setDocsLoading(false); });
    return () => { active = false; };
  }, [order.id, toast]);

  function onFilePicked(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_ATTACHMENT_BYTES) {
      toast(`"${file.name}" is too large (max 3MB)`, "error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setUploadFile(file);
  }

  async function uploadDoc() {
    const file = uploadFile;
    if (!file) { toast("Choose a file to upload", "error"); return; }
    if (file.size > MAX_ATTACHMENT_BYTES) { toast(`"${file.name}" is too large (max 3MB)`, "error"); return; }
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const created = await api.post<Attachment>("/api/attachments", {
        entityType: "order",
        entityId: order.id,
        name: file.name,
        mime: file.type || "application/octet-stream",
        dataUrl,
        size: file.size,
      });
      setDocs((prev) => [...prev, created]);
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploadOpen(false);
      toast(`${created.name} uploaded`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not upload document", "error");
    } finally {
      setUploading(false);
    }
  }

  async function deleteDoc(att: Attachment) {
    const prev = docs;
    // Optimistic removal — restore on failure.
    setDocs((list) => list.filter((d) => d.id !== att.id));
    setDeletingId(att.id);
    try {
      await api.del(`/api/attachments/${att.id}`);
      toast(`${att.name} deleted`);
    } catch (e) {
      setDocs(prev); // rollback
      toast(e instanceof Error ? e.message : "Could not delete document", "error");
    } finally {
      setDeletingId(null);
    }
  }

  function closeUpload() {
    setUploadFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploadOpen(false);
  }

  // Activity history — derived from the real order's fields & current status.
  const activity = useMemo<ActivityEntry[]>(() => {
    const idx = currentStep;
    const list: ActivityEntry[] = [
      {
        date: orderDateLabel,
        user: "System",
        action: "Order Created",
        details: `Order placed via ${order.channel ?? "Web Store"}`,
      },
    ];
    if (idx >= 1) {
      list.push({ date: orderDateLabel, user: "System", action: "Processing", details: "Order moved into processing" });
    }
    if (order.trackingNumber) {
      list.push({ date: orderDateLabel, user: "System", action: "Tracking Added", details: `Tracking number ${order.trackingNumber} assigned` });
    }
    if (idx >= 2) {
      list.push({ date: orderDateLabel, user: "System", action: "Shipped", details: `In transit to ${order.destination ?? "destination"}` });
    }
    if (idx >= 3) {
      list.push({ date: orderDateLabel, user: "System", action: "Delivered", details: `Delivered to ${order.destination ?? "destination"}` });
    }
    if (isCancelled) {
      list.push({ date: orderDateLabel, user: "System", action: "Cancelled", details: "Order was cancelled" });
    }
    if (order.notes) {
      list.push({ date: orderDateLabel, user: "Staff", action: "Note Added", details: "Notes updated on this order" });
    }
    return list;
  }, [currentStep, isCancelled, orderDateLabel, order.channel, order.trackingNumber, order.destination, order.notes]);

  const [activityFilter, setActivityFilter] = useState<string>("All Activities");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const filterOptions = useMemo(
    () => ["All Activities", ...Array.from(new Set(activity.map((a) => a.action)))],
    [activity],
  );
  const visibleActivity = activityFilter === "All Activities"
    ? activity
    : activity.filter((a) => a.action === activityFilter);

  // Close the activity-filter dropdown on Escape or outside-click.
  useEffect(() => {
    if (!filterMenuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFilterMenuOpen(false);
    }
    function onPointer(e: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setFilterMenuOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [filterMenuOpen]);

  // Tickets / messages
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  function sendMessage() {
    if (!messageDraft.trim()) { toast("Message cannot be empty", "error"); return; }
    toast("Message sent");
    setMessageDraft("");
    setNewMessageOpen(false);
  }

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div>
        <Link href="/dashboard/orders" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#1E293B] mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#1E293B]">Order Detail</h1>
            <p className="text-[14px] text-[#64748B] mt-0.5">View and manage order information, items, fulfillment, and customer details.</p>
          </div>
          <OrderDetailActions order={order} />
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
        <div className="grid items-start gap-6" style={{ gridTemplateColumns: "1.1fr 1.1fr 1.1fr 1.6fr 1fr" }}>
          {/* Order ID */}
          <div>
            <p className="text-[12px] text-[#94A3B8] mb-1">Order ID</p>
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-bold text-[#1E293B]">{order.id}</p>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-[12px] text-[#64748B] mt-3"><span className="text-[#94A3B8]">Order Date</span>&nbsp;&nbsp;{formatDate(order.date)}</p>
            <p className="text-[12px] text-[#64748B] mt-1.5"><span className="text-[#94A3B8]">Source</span>&nbsp;&nbsp;{order.channel ?? "Web Store"}</p>
          </div>
          {/* Customer */}
          <div>
            <p className="text-[12px] text-[#94A3B8] mb-1">Customer</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[12px] font-bold flex items-center justify-center">{initials}</div>
              <div>
                <p className="text-[14px] font-semibold text-[#1E293B]">{order.customer}</p>
                <p className="text-[11px] text-[#94A3B8]">{order.customer.toLowerCase().replace(/[^a-z]/g, "")}@example.com</p>
              </div>
            </div>
            <Link href={customerHref} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3 hover:underline">View Customer <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {/* Payment Status */}
          <div>
            <p className="text-[12px] text-[#94A3B8] mb-1">Payment Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: "#10B9811A", color: "#10B981" }}>Paid</span>
            <p className="text-[12px] text-[#64748B] mt-2">Paid on {formatDate(order.date)}</p>
            <p className="text-[13px] font-semibold text-[#1E293B]">{formatCurrency(order.total)} USD</p>
            <a href="#cost-summary" onClick={(e) => { e.preventDefault(); scrollToId("cost-summary"); }} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-2 hover:underline">View Payment <ArrowRight className="w-3 h-3" /></a>
          </div>
          {/* Fulfillment Status */}
          <div>
            <p className="text-[12px] text-[#94A3B8] mb-1">Fulfillment Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: fulfillment.bg, color: fulfillment.color }}>{fulfillment.label}</span>
            {/* Stepper */}
            <div className="mt-4 flex items-center">
              {steps.map((s, i) => {
                const reached = i <= currentStep;
                const dotColor = isCancelled ? "bg-[#EF4444]" : "bg-[#3B82F6]";
                const lineColor = isCancelled ? "bg-[#EF4444]" : "bg-[#3B82F6]";
                return (
                  <div key={s} className="flex items-center" style={{ flex: i === steps.length - 1 ? "0 0 auto" : "1 1 0" }}>
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${reached ? dotColor : "bg-white border-2 border-[#E2E8F0]"}`}>
                        {reached && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i < currentStep ? lineColor : "bg-[#E2E8F0]"}`} />}
                  </div>
                );
              })}
            </div>
            <div className="mt-1.5 flex justify-between">
              {steps.map((s, i) => (
                <span key={s} className={`text-[10px] ${i <= currentStep ? "text-[#1E293B] font-medium" : "text-[#94A3B8]"}`}>{s}</span>
              ))}
            </div>
            <a href="#linked-shipment" onClick={(e) => { e.preventDefault(); scrollToId("linked-shipment"); }} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3 hover:underline">View Fulfillment <ArrowRight className="w-3 h-3" /></a>
          </div>
          {/* Total */}
          <div className="text-right">
            <p className="text-[12px] text-[#94A3B8] mb-1">Total Amount</p>
            <p className="text-[22px] font-bold text-[#1E293B]">{formatCurrency(order.total)} <span className="text-[12px] font-medium text-[#94A3B8]">USD</span></p>
            <p className="text-[12px] text-[#64748B] mt-1">{itemCount} items · {skuCount} SKUs</p>
            <a href="#cost-summary" onClick={(e) => { e.preventDefault(); scrollToId("cost-summary"); }} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3 hover:underline justify-end">View Summary <ArrowRight className="w-3 h-3" /></a>
          </div>
        </div>
      </div>

      {/* Items + Addresses row */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
        {/* Order Items */}
        <div id="items" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden scroll-mt-4">
          <h3 className="text-[14px] font-semibold text-[#1E293B] px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">Order Items <span className="text-[12px] font-normal text-[#94A3B8]">({skuCount} SKUs, {itemCount} items)</span></h3>
          <div className="p-5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Item</th>
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">SKU</th>
                  <th className="text-right text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Unit Price</th>
                  <th className="text-right text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Qty</th>
                  <th className="text-right text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((it) => (
                  <tr key={it.sku} className="border-b border-[#F1F5F9] last:border-b-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] shrink-0 border border-[#E2E8F0]" />
                        <div>
                          <p className="text-[13px] font-medium text-[#1E293B]">{it.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[12px] text-[#64748B] font-mono">{it.sku}</td>
                    <td className="py-3 text-[13px] text-[#1E293B] text-right">{formatCurrency(it.unitPrice)}</td>
                    <td className="py-3 text-[13px] text-[#1E293B] text-right">{it.quantity}</td>
                    <td className="py-3 text-[13px] font-semibold text-[#1E293B] text-right">{formatCurrency(it.unitPrice * it.quantity)}</td>
                  </tr>
                ))}
                {orderItems.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-[12px] text-[#94A3B8]">No line items recorded for this order.</td></tr>
                )}
              </tbody>
            </table>
            <a href="#items" onClick={(e) => { e.preventDefault(); scrollToId("items"); }} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3 hover:underline">View all items <ArrowRight className="w-3 h-3" /></a>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Shipping Address</h3>
            <button onClick={() => openAddrEdit("shipping")} className="text-[12px] font-medium text-[#3B82F6] hover:underline">Edit</button>
          </div>
          <div className="text-[13px] text-[#64748B] space-y-0.5">
            {shipping.lines.map((l, i) => (
              <p key={i} className={i === 0 ? "font-medium text-[#1E293B]" : l.startsWith("Phone") || l.startsWith("Email") ? "pt-2" : ""}>{l}</p>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[13px] space-y-1">
            <p><span className="text-[#94A3B8]">Shipping Method</span></p>
            <span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded bg-[#F1F5F9] text-[#64748B]">Standard (Ocean)</span>
            <p className="pt-2"><span className="text-[#94A3B8]">Estimated Delivery</span></p>
            <p className="text-[#1E293B] font-medium">May 26 – May 30, 2025</p>
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Billing Address</h3>
            <button onClick={() => openAddrEdit("billing")} className="text-[12px] font-medium text-[#3B82F6] hover:underline">Edit</button>
          </div>
          <div className="text-[13px] text-[#64748B] space-y-0.5">
            {billing.lines.map((l, i) => (
              <p key={i} className={i === 0 ? "font-medium text-[#1E293B]" : l.startsWith("Phone") || l.startsWith("Email") ? "pt-2" : ""}>{l}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Linked Shipment / Timeline / Notes / Documents / Cost row */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}>
        {/* Linked Shipment */}
        <div id="linked-shipment" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden scroll-mt-4">
          <h3 className="text-[14px] font-semibold text-[#1E293B] px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">Linked Shipment</h3>
          <div className="p-5 pt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full mb-4" style={{ backgroundColor: shipmentCreated ? "#10B9811A" : "#F59E0B1A", color: shipmentCreated ? "#10B981" : "#F59E0B" }}>{shipmentCreated ? "Shipment Created" : "Ready to Create"}</span>
            <div className="text-center py-4">
              <p className="text-[12px] text-[#94A3B8] mb-3">{shipmentCreated ? "A shipment has been created for this order." : "No shipment has been created for this order yet."}</p>
              <button onClick={createLinkedShipment} disabled={busy || shipmentCreated} className="w-full px-3 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[12px] font-medium text-white disabled:opacity-60">{shipmentCreated ? "Shipment Created" : "Create Shipment"}</button>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div id="timeline" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden scroll-mt-4">
          <h3 className="text-[14px] font-semibold text-[#1E293B] px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">Order Timeline</h3>
          <div className="p-5">
            <div className="relative pl-5">
              <div className="absolute left-[6px] top-1 bottom-3 w-px bg-[#E2E8F0]" />
              {timeline.map((t, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div className={`absolute -left-5 top-0.5 w-3 h-3 rounded-full border-2 ${t.done ? "bg-[#10B981] border-[#10B981]" : "bg-white border-[#3B82F6]"}`} />
                  <p className="text-[12px] font-semibold text-[#1E293B]">{t.title}</p>
                  <p className="text-[10px] text-[#94A3B8]">{t.time}</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>
            <a href="#activity-history" onClick={(e) => { e.preventDefault(); scrollToId("activity-history"); }} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-2 hover:underline">View full timeline <ArrowRight className="w-3 h-3" /></a>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Notes</h3>
            <button onClick={openNotesEdit} className="text-[12px] font-medium text-[#3B82F6] flex items-center gap-1 hover:underline"><Edit2 className="w-3 h-3" /> Edit</button>
          </div>
          <div className="p-5">
            {notes.map((n, i) => (
              n.customer ? (
                <div key={i}>
                  <div className="rounded-lg bg-[#FFFBEB] border border-[#FDE68A] p-3 mb-3">
                    <p className="text-[11px] font-medium text-[#92400E]">{n.label}</p>
                    <p className="text-[11px] text-[#78350F] mt-1">{n.text}</p>
                  </div>
                  {n.time && <p className="text-[10px] text-[#94A3B8]">{n.time}</p>}
                </div>
              ) : (
                <div key={i} className="mt-3 pt-3 border-t border-[#E2E8F0] first:mt-0 first:pt-0 first:border-t-0">
                  <p className="text-[11px] font-medium text-[#1E293B]">{n.label}</p>
                  <p className="text-[11px] text-[#64748B] mt-1">{n.text}</p>
                  {n.time && <p className="text-[10px] text-[#94A3B8] mt-1">{n.time}</p>}
                </div>
              )
            ))}
            <button onClick={() => setAddNoteOpen(true)} className="text-[12px] font-medium text-[#3B82F6] mt-3 hover:underline">+ Add Note</button>
          </div>
        </div>

        {/* Attached Documents */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[14px] font-semibold text-[#1E293B] px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">Attached Documents</h3>
          <div className="p-5">
            {docsLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-[12px] text-[#94A3B8]">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading documents…
              </div>
            ) : docs.length === 0 ? (
              <div className="py-6 text-center">
                <FileText className="w-7 h-7 text-[#CBD5E1] mx-auto mb-2" />
                <p className="text-[12px] text-[#94A3B8]">No documents attached to this order yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {docs.map((d) => {
                  const isImage = d.mime.startsWith("image/");
                  return (
                    <div key={d.id} className="flex items-center gap-2.5">
                      {isImage ? (
                        <a href={d.dataUrl} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${d.name}`} className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={d.dataUrl} alt={d.name} className="w-full h-full object-cover" />
                        </a>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-[#EF4444]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-[#1E293B] truncate">{d.name}</p>
                        <p className="text-[10px] text-[#94A3B8] truncate">{formatBytes(d.size)} · {formatDate(d.createdAt.slice(0, 10))}</p>
                      </div>
                      <button onClick={() => downloadAttachment(d)} aria-label={`Download ${d.name}`} className="text-[#94A3B8] hover:text-[#64748B] shrink-0"><Download className="w-4 h-4" /></button>
                      <button onClick={() => deleteDoc(d)} disabled={deletingId === d.id} aria-label={`Delete ${d.name}`} className="text-[#94A3B8] hover:text-[#EF4444] shrink-0 disabled:opacity-50">
                        {deletingId === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={() => setUploadOpen(true)} className="text-[12px] font-medium text-[#3B82F6] mt-3 hover:underline">Upload Document</button>
          </div>
        </div>

        {/* Cost Summary */}
        <div id="cost-summary" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden scroll-mt-4">
          <h3 className="text-[14px] font-semibold text-[#1E293B] px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">Cost Summary</h3>
          <div className="p-5">
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="text-[#64748B]">Item Subtotal</span><span className="text-[#1E293B] font-medium">$1,155.72</span></div>
              <div className="flex justify-between"><span className="text-[#64748B]">Shipping Cost</span><span className="text-[#1E293B] font-medium">$45.00</span></div>
              <div className="flex justify-between"><span className="text-[#64748B]">Tax (3.75%)</span><span className="text-[#1E293B] font-medium">$45.08</span></div>
              <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-[#E2E8F0]"><span className="text-[13px] text-[#1E293B] font-semibold">Total</span><span className="text-[15px] text-[#1E293B] font-bold">$1,245.80 <span className="text-[11px] font-medium text-[#94A3B8]">USD</span></span></div>
            </div>
            <a href="#items" onClick={(e) => { e.preventDefault(); scrollToId("items"); }} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3 hover:underline">View Cost Breakdown <ArrowRight className="w-3 h-3" /></a>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
              <p className="text-[12px] font-medium text-[#1E293B] mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6]">Corporate Order</span>
                <span className="inline-flex px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">Gift Wrap</span>
                <span className="inline-flex px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-[#EF4444]/10 text-[#EF4444]">Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity History + Related Tickets */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr" }}>
        {/* Activity History */}
        <div id="activity-history" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden scroll-mt-4">
          <div className="flex items-center justify-between px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Activity History</h3>
            <div className="flex items-center gap-2">
              <div className="relative" ref={filterMenuRef}>
                <button onClick={() => setFilterMenuOpen((v) => !v)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[12px] text-[#64748B] hover:bg-[#F8FAFC]">{activityFilter} <ChevronDown className="w-3 h-3" /></button>
                {filterMenuOpen && (
                  <div className="absolute right-0 mt-1 z-20 w-44 bg-white border border-[#E2E8F0] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] py-1">
                    {filterOptions.map((opt) => (
                      <button key={opt} onClick={() => { setActivityFilter(opt); setFilterMenuOpen(false); }} className={`block w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#F8FAFC] ${opt === activityFilter ? "text-[#3B82F6] font-medium" : "text-[#64748B]"}`}>{opt}</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => { setActivityFilter("All Activities"); toast("Filters reset"); }} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[12px] text-[#64748B] hover:bg-[#F8FAFC]"><Filter className="w-3 h-3" /> Filters</button>
            </div>
          </div>
          <div className="p-5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Date &amp; Time</th>
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">User</th>
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Activity</th>
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {visibleActivity.map((a, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9] last:border-b-0">
                    <td className="py-2.5 text-[12px] text-[#64748B]">{a.date}</td>
                    <td className="py-2.5 text-[12px] text-[#1E293B] font-medium">{a.user}</td>
                    <td className="py-2.5 text-[12px] text-[#64748B]">{a.action}</td>
                    <td className="py-2.5 text-[12px] text-[#64748B]">{a.details}</td>
                  </tr>
                ))}
                {visibleActivity.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-[12px] text-[#94A3B8]">No activity matches this filter.</td></tr>
                )}
              </tbody>
            </table>
            <a href="#timeline" onClick={(e) => { e.preventDefault(); scrollToId("timeline"); }} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3 hover:underline">View all activity <ArrowRight className="w-3 h-3" /></a>
          </div>
        </div>

        {/* Related Tickets & Messages */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Related Tickets &amp; Messages</h3>
            <Link href="/dashboard/messages" className="text-[12px] font-medium text-[#3B82F6] hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {[
              { icon: "T", color: "#3B82F6", title: "Request for expedited shipping", id: "#TKT-2025-0518-001", desc: "Customer requested if we can expedite the shipping due to event.", status: "Open", statusColor: "#10B981", date: "May 18, 2025" },
              { icon: "M", color: "#8B5CF6", title: "Re: Order confirmation", id: "", desc: "Acme Retail: Thank you for the confirmation. Please ensure...", status: "Resolved", statusColor: "#64748B", date: "May 18, 2025" },
            ].map((t, i) => (
              <div key={i} className="flex gap-3 pb-3 border-b border-[#F1F5F9] last:border-b-0 last:pb-0">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-semibold" style={{ backgroundColor: `${t.color}1A`, color: t.color }}>{t.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-semibold text-[#1E293B]">{t.title}</p>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0" style={{ backgroundColor: `${t.statusColor}1A`, color: t.statusColor }}>{t.status}</span>
                  </div>
                  {t.id && <p className="text-[10px] text-[#94A3B8]">{t.id}</p>}
                  <p className="text-[11px] text-[#64748B] mt-1">{t.desc}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setNewMessageOpen(true)} className="text-[12px] font-medium text-[#3B82F6] mt-3 flex items-center gap-1 hover:underline"><MessageSquare className="w-3 h-3" /> New Message</button>
        </div>
      </div>

      {/* ---- Modals ---- */}
      <Modal
        open={addrEdit !== null}
        onClose={() => setAddrEdit(null)}
        title={`Edit ${addrEdit === "billing" ? "Billing" : "Shipping"} Address`}
        description="One line per row."
        footer={<>
          <SecondaryButton onClick={() => setAddrEdit(null)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={saveAddr} disabled={busy}>{busy ? "Saving…" : "Save address"}</PrimaryButton>
        </>}
      >
        <Field label="Address">
          <TextArea value={addrDraft} onChange={(e) => setAddrDraft(e.target.value)} rows={7} className="min-h-[160px]" />
        </Field>
      </Modal>

      <Modal
        open={notesEdit}
        onClose={() => setNotesEdit(false)}
        title="Edit Notes"
        description="Format: Label: text (one per line)."
        footer={<>
          <SecondaryButton onClick={() => setNotesEdit(false)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={saveNotesEdit} disabled={busy}>{busy ? "Saving…" : "Save notes"}</PrimaryButton>
        </>}
      >
        <Field label="Notes">
          <TextArea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={5} className="min-h-[120px]" />
        </Field>
      </Modal>

      <Modal
        open={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        title="Add Note"
        footer={<>
          <SecondaryButton onClick={() => setAddNoteOpen(false)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={addNote} disabled={busy}>{busy ? "Saving…" : "Add note"}</PrimaryButton>
        </>}
      >
        <Field label="Internal note">
          <TextArea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Write a note for this order…" />
        </Field>
      </Modal>

      <Modal
        open={uploadOpen}
        onClose={closeUpload}
        title="Upload Document"
        description="Attach a document to this order (max 3MB)."
        footer={<>
          <SecondaryButton onClick={closeUpload}>Cancel</SecondaryButton>
          <PrimaryButton onClick={uploadDoc} disabled={uploading || !uploadFile}>{uploading ? "Uploading…" : "Upload"}</PrimaryButton>
        </>}
      >
        <Field label="Choose file" hint={uploadFile ? `${uploadFile.name} · ${formatBytes(uploadFile.size)}` : "PDF, image, or any file up to 3MB."}>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => onFilePicked(e.target.files?.[0])}
            className="w-full text-[13px] text-[#374151] file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border file:border-[#E5E7EB] file:bg-white file:text-[13px] file:font-medium file:text-[#374151] hover:file:bg-[#F3F4F6] file:cursor-pointer"
          />
        </Field>
      </Modal>

      <Modal
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
        title="New Message"
        description={`Send a message about ${order.id}.`}
        footer={<>
          <SecondaryButton onClick={() => setNewMessageOpen(false)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={sendMessage}>Send</PrimaryButton>
        </>}
      >
        <Field label="Message">
          <TextArea value={messageDraft} onChange={(e) => setMessageDraft(e.target.value)} placeholder="Type your message…" />
        </Field>
      </Modal>
    </div>
  );
}
