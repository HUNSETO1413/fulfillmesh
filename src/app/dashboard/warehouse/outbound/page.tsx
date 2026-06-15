"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Truck, PackageCheck, Navigation, AlertTriangle, XCircle,
  Search, Columns3, Plus, ChevronDown, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Eye, CheckCircle2, Ban, Pencil,
  ChevronUp, ArrowUpDown, Download, PackageOpen, Box, Loader,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Drawer, DrawerRow, DrawerSection } from "@/components/dashboard/Drawer";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import type {
  Order, Shipment, ShipmentStatus, OrderStatus,
} from "@/types";

const tabs = ["All Shipments", "Processing", "Shipped", "In Transit", "Exception", "Delivered", "Cancelled"];

type Status = "Processing" | "Shipped" | "In Transit" | "Exception" | "Delayed" | "Delivered" | "Cancelled";
type Stage = "Created" | "Picked" | "Packed" | "Shipped";
type Row = {
  // identity for persistence: a row is backed by a shipment, or (for orders with
  // no shipment yet) by the order itself.
  kind: "shipment" | "order";
  entityId: string;       // the id we PUT to for THIS row's status
  orderEntityId?: string; // order id (for cancelling a shipment-backed row)
  so: string; shp: string; recipient: string; city: string; wh: string;
  carrier: string; service: string; status: Status; stage: Stage; ship: string; eta: string;
};

const WAREHOUSES = ["ATL-1", "LAX-1", "ORD-1", "DFW-1", "MIA-1"];
const CARRIERS = ["UPS", "FedEx", "USPS", "XPO", "DHL"];
const SERVICES = ["Ground", "Express", "Priority", "2nd Day Air"];
const STATUSES: Status[] = ["Processing", "Shipped", "In Transit", "Exception", "Delayed", "Delivered", "Cancelled"];

// ---- status mapping between the UI vocabulary and the persisted entities ----
function shipmentToUiStatus(s: ShipmentStatus): Status {
  switch (s) {
    case "Awaiting Pickup": return "Processing";
    case "In Transit": return "In Transit";
    case "Customs": return "In Transit";
    case "Out for Delivery": return "In Transit";
    case "Delivered": return "Delivered";
    case "Exception": return "Exception";
    default: return "Processing";
  }
}
function orderToUiStatus(s: OrderStatus): Status {
  switch (s) {
    case "Pending": return "Processing";
    case "Processing": return "Processing";
    case "In Transit": return "In Transit";
    case "Delivered": return "Delivered";
    case "Cancelled": return "Cancelled";
    default: return "Processing";
  }
}
// UI status → persisted shipment status (Cancelled has no shipment equivalent).
function uiToShipmentStatus(s: Status): ShipmentStatus | null {
  switch (s) {
    case "Processing": return "Awaiting Pickup";
    case "Shipped": return "In Transit";
    case "In Transit": return "In Transit";
    case "Exception": return "Exception";
    case "Delayed": return "Exception";
    case "Delivered": return "Delivered";
    case "Cancelled": return null;
    default: return null;
  }
}
function uiToOrderStatus(s: Status): OrderStatus | null {
  switch (s) {
    case "Processing": return "Processing";
    case "Shipped": return "In Transit";
    case "In Transit": return "In Transit";
    case "Delivered": return "Delivered";
    case "Cancelled": return "Cancelled";
    default: return null;
  }
}

function Badge({ text }: { text: string }) {
  const styles: Record<string, string> = {
    Processing: "bg-[#7C6FF6]/10 text-[#7C6FF6]",
    Shipped: "bg-teal/10 text-teal",
    "In Transit": "bg-action-blue/10 text-action-blue",
    Exception: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Delayed: "bg-[#EF4444]/10 text-[#EF4444]",
    Delivered: "bg-teal/10 text-teal",
    Cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
  };
  return <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[text] || "bg-soft-bg text-text-muted"}`}>{text}</span>;
}

function StageChip({ stage }: { stage: Stage }) {
  return <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full bg-soft-bg text-text-muted border border-border-soft">{stage}</span>;
}

const card = "bg-white rounded-xl border border-border-soft shadow-soft";
const thCls = "text-left text-[11px] font-semibold text-text-light uppercase tracking-[0.05em] px-6 py-3";
const dropBtn = "flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg";

function Dropdown({ label, value, options, onSelect }: { label: string; value: string; options: string[]; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className={`${dropBtn} ${value ? "text-action-blue border-action-blue" : ""}`}>
        {value || label} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-20 w-48 bg-white rounded-lg border border-border-soft shadow-lg py-1">
            <button onClick={() => { onSelect(""); setOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${!value ? "text-action-blue font-medium" : "text-text-primary"}`}>{label}</button>
            {options.map((o) => (
              <button key={o} onClick={() => { onSelect(o); setOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${value === o ? "text-action-blue font-medium" : "text-text-primary"}`}>{o}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

type Draft = { recipient: string; wh: string; carrier: string; service: string; eta: string };
const emptyDraft: Draft = { recipient: "", wh: "ATL-1", carrier: "UPS", service: "Ground", eta: new Date().toISOString().slice(0, 10) };

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const toIso = (formatted: string) => {
  const d = new Date(formatted);
  return Number.isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
};

// short city/destination code from a free-text destination
function cityCode(dest?: string): string {
  if (!dest) return "—";
  const head = dest.split(",")[0].trim();
  return head ? head.slice(0, 12) : "—";
}
// pick a warehouse code from a shipment origin, falling back to round-robin
function originToWh(origin: string | undefined, idx: number): string {
  if (origin) {
    const up = origin.toUpperCase();
    const match = WAREHOUSES.find((w) => up.includes(w) || up.includes(w.split("-")[0]));
    if (match) return match;
  }
  return WAREHOUSES[idx % WAREHOUSES.length];
}

// Tracking timeline: deterministic milestone list derived from status + stage.
const TIMELINE_STEPS: { label: string; desc: string }[] = [
  { label: "Created", desc: "Shipment created and order allocated" },
  { label: "Picked", desc: "Items picked from storage locations" },
  { label: "Packed", desc: "Order packed and label generated" },
  { label: "Shipped", desc: "Handed to carrier and dispatched" },
  { label: "Delivered", desc: "Delivered to the recipient" },
];

function reachedSteps(r: Row): number {
  if (r.status === "Delivered") return 5;
  if (r.status === "Shipped" || r.status === "In Transit" || r.status === "Exception" || r.status === "Delayed") return 4;
  const map: Record<Stage, number> = { Created: 1, Picked: 2, Packed: 3, Shipped: 4 };
  return map[r.stage];
}

type SortKey = "so" | "recipient" | "wh" | "carrier" | "status" | "ship" | "eta";

export default function OutboundShipmentsPage() {
  const { toast } = useToast();
  const tableRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState("All Shipments");
  const [query, setQueryState] = useState("");
  const [whFilter, setWhFilterState] = useState("");
  const [carrierFilter, setCarrierFilterState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const setActiveTab = (v: string) => { setActiveTabState(v); setPage(1); };
  const setQuery = (v: string) => { setQueryState(v); setPage(1); };
  const setWhFilter = (v: string) => { setWhFilterState(v); setPage(1); };
  const setCarrierFilter = (v: string) => { setCarrierFilterState(v); setPage(1); };
  const setStatusFilter = (v: string) => { setStatusFilterState(v); setPage(1); };

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>("ship");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }
  const sortIcon = (k: SortKey) =>
    sortKey !== k
      ? <ArrowUpDown className="w-3 h-3 text-text-light" />
      : <ChevronUp className={`w-3 h-3 text-action-blue transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} />;

  // bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkCancelling, setBulkCancelling] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [cancelling, setCancelling] = useState<Row | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Row | null>(null);
  const seq = useRef(9872);

  // Load orders + shipments and join into outbound rows.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [orderRes, shipRes] = await Promise.all([
          api.get<{ data: Order[]; total: number }>("/api/orders"),
          api.get<{ data: Shipment[]; total: number }>("/api/shipments"),
        ]);
        if (cancelled) return;
        const orders = orderRes?.data ?? [];
        const shipments = shipRes?.data ?? [];
        const orderById = new Map(orders.map((o) => [String(o.id), o]));

        const shipmentRows: Row[] = shipments.map((s, i) => {
          const order = s.orderId ? orderById.get(String(s.orderId)) : undefined;
          const uiStatus = shipmentToUiStatus(s.status);
          const stage: Stage = uiStatus === "Processing" ? "Created" : "Shipped";
          return {
            kind: "shipment",
            entityId: String(s.id),
            orderEntityId: s.orderId ? String(s.orderId) : undefined,
            so: order ? String(order.id) : (s.orderId ? String(s.orderId) : "—"),
            shp: String(s.id),
            recipient: order?.customer ?? s.destination ?? "—",
            city: cityCode(s.destination ?? order?.destination),
            wh: originToWh(s.origin, i),
            carrier: s.carrier || "UPS",
            service: SERVICES[i % SERVICES.length],
            status: uiStatus,
            stage,
            ship: s.shippedDate ? fmtDate(s.shippedDate) : "—",
            eta: s.estimatedDelivery ? fmtDate(s.estimatedDelivery) : "—",
          };
        });

        // Orders that are ready to ship but have no shipment yet.
        const shippedOrderIds = new Set(shipments.map((s) => (s.orderId ? String(s.orderId) : "")));
        const readyToShip: Row[] = orders
          .filter((o) => (o.status === "Pending" || o.status === "Processing") && !shippedOrderIds.has(String(o.id)))
          .map((o, i) => ({
            kind: "order",
            entityId: String(o.id),
            orderEntityId: String(o.id),
            so: String(o.id),
            shp: `order:${o.id}`,
            recipient: o.customer,
            city: cityCode(o.destination),
            wh: WAREHOUSES[i % WAREHOUSES.length],
            carrier: CARRIERS[i % CARRIERS.length],
            service: SERVICES[i % SERVICES.length],
            status: orderToUiStatus(o.status),
            stage: "Created" as Stage,
            ship: "—",
            eta: o.date ? fmtDate(o.date) : "—",
          }));

        setRows([...readyToShip, ...shipmentRows]);
      } catch {
        if (!cancelled) toast("Failed to load outbound shipments", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const tab = activeTab === "All Shipments" || r.status === activeTab;
      const wh = !whFilter || r.wh === whFilter;
      const carrier = !carrierFilter || r.carrier === carrierFilter;
      const st = !statusFilter || r.status === statusFilter;
      const search = !q || r.so.toLowerCase().includes(q) || r.shp.toLowerCase().includes(q) || r.recipient.toLowerCase().includes(q);
      return tab && wh && carrier && st && search;
    });
  }, [rows, activeTab, whFilter, carrierFilter, statusFilter, query]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "ship" || sortKey === "eta") { av = new Date(a[sortKey]).getTime(); bv = new Date(b[sortKey]).getTime(); }
      else { av = String(a[sortKey]).toLowerCase(); bv = String(b[sortKey]).toLowerCase(); }
      if (Number.isNaN(av as number) && (sortKey === "ship" || sortKey === "eta")) av = 0;
      if (Number.isNaN(bv as number) && (sortKey === "ship" || sortKey === "eta")) bv = 0;
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const pageIds = pageRows.map((r) => r.shp);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const selectedRows = sorted.filter((r) => selected.has(r.shp));

  function toggleSelectAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) for (const id of pageIds) next.delete(id);
      else for (const id of pageIds) next.add(id);
      return next;
    });
  }
  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // ---- computed stats (live from rows) ----
  const computed = useMemo(() => {
    const total = rows.length;
    const count = (fn: (r: Row) => boolean) => rows.filter(fn).length;
    const pct = (n: number) => (total ? `${((n / total) * 100).toFixed(1)}%` : "0%");
    const processing = count((r) => r.status === "Processing");
    const shipped = count((r) => r.status === "Shipped");
    const inTransit = count((r) => r.status === "In Transit");
    const exception = count((r) => r.status === "Exception" || r.status === "Delayed");
    const delivered = count((r) => r.status === "Delivered");
    const cancelled = count((r) => r.status === "Cancelled");
    const carrierNames = Array.from(new Set(rows.map((r) => r.carrier))).sort();
    const carriers = (carrierNames.length ? carrierNames : CARRIERS).map((name) => {
      const carrierRows = rows.filter((r) => r.carrier === name);
      const issues = carrierRows.filter((r) => r.status === "Exception" || r.status === "Delayed" || r.status === "Cancelled").length;
      const rate = carrierRows.length ? ((1 - issues / carrierRows.length) * 100).toFixed(1) : "—";
      return { name, count: carrierRows.length, rate };
    });
    return { total, processing, shipped, inTransit, exception, delivered, cancelled, pct, carriers };
  }, [rows]);

  const stats = [
    { title: "Total Shipments", value: computed.total, sub: "", change: "+12.4%", positive: true, icon: Truck, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
    { title: "Shipped", value: computed.shipped, sub: computed.pct(computed.shipped), change: "+9.1%", positive: true, icon: PackageCheck, iconBg: "bg-teal/10", iconColor: "text-teal" },
    { title: "In Transit", value: computed.inTransit, sub: computed.pct(computed.inTransit), change: "+15.3%", positive: true, icon: Navigation, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
    { title: "Exception", value: computed.exception, sub: computed.pct(computed.exception), change: "-18.2%", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
    { title: "Cancelled", value: computed.cancelled, sub: computed.pct(computed.cancelled), change: "-8.6%", positive: false, icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
  ];

  const donutSegments: { label: string; color: string; count: number }[] = [
    { label: "Shipped", color: "var(--color-teal)", count: computed.shipped },
    { label: "In Transit", color: "var(--color-action-blue)", count: computed.inTransit },
    { label: "Processing", color: "#7C6FF6", count: computed.processing },
    { label: "Exception", color: "#F59E0B", count: computed.exception },
    { label: "Delivered", color: "#10B981", count: computed.delivered },
    { label: "Cancelled", color: "#EF4444", count: computed.cancelled },
  ];

  function handleExport() {
    exportToCsv("outbound-shipments", sorted, [
      { key: "so", header: "Order #" }, { key: "shp", header: "Shipment #" },
      { key: "recipient", header: "Recipient" }, { key: "wh", header: "Warehouse" },
      { key: "carrier", header: "Carrier" }, { key: "service", header: "Service" },
      { key: "status", header: "Status" }, { key: "stage", header: "Stage" },
      { key: "ship", header: "Ship Date" }, { key: "eta", header: "Est. Delivery" },
    ]);
    toast(`Exported ${sorted.length} shipments to CSV`);
  }

  function exportSelected() {
    exportToCsv("outbound-shipments-selected", selectedRows, [
      { key: "so", header: "Order #" }, { key: "shp", header: "Shipment #" }, { key: "recipient", header: "Recipient" },
      { key: "wh", header: "Warehouse" }, { key: "carrier", header: "Carrier" }, { key: "status", header: "Status" },
      { key: "stage", header: "Stage" },
    ]);
    toast(`Exported ${selectedRows.length} selected shipments to CSV`);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(r: Row) {
    setEditing(r);
    setDraft({ recipient: r.recipient, wh: r.wh, carrier: r.carrier, service: r.service, eta: toIso(r.eta) });
    setMenuFor(null);
    setViewing(null);
    setFormOpen(true);
  }

  // New shipments / edits to display-only fields (recipient, carrier, service,
  // warehouse) stay local: there is no backend write path for these here.
  function saveShipment() {
    if (!draft.recipient.trim()) { toast("Recipient is required", "error"); return; }
    if (!draft.eta || Number.isNaN(new Date(draft.eta).getTime())) { toast("Enter a valid date", "error"); return; }
    setBusy(true);
    const date = fmtDate(draft.eta);
    if (editing) {
      setRows((prev) => prev.map((r) => (r.shp === editing.shp
        ? { ...r, recipient: draft.recipient.trim(), wh: draft.wh, city: draft.wh.split("-")[0], carrier: draft.carrier, service: draft.service, eta: date }
        : r)));
      toast(`Shipment ${editing.shp} updated`);
    } else {
      const n = ++seq.current;
      const shp = `SHP-00${n}`;
      const newRow: Row = {
        kind: "shipment", entityId: shp,
        so: `SO-10${2880 + (n - 9872) * 2}`, shp, recipient: draft.recipient.trim(), city: draft.wh.split("-")[0],
        wh: draft.wh, carrier: draft.carrier, service: draft.service, status: "Processing", stage: "Created", ship: date, eta: date,
      };
      setRows((prev) => [newRow, ...prev]);
      toast(`Shipment ${shp} created — ready for picking (local draft)`);
    }
    setBusy(false);
    setFormOpen(false);
    setDraft(emptyDraft);
  }

  // Apply a status change locally and persist it to the backing entity.
  function applyStatus(r: Row, status: Status, patch: Partial<Row>, msg: string) {
    setRows((prev) => prev.map((x) => (x.shp === r.shp ? { ...x, status, ...patch } : x)));
    setViewing((prev) => (prev && prev.shp === r.shp ? { ...prev, status, ...patch } : prev));
    setMenuFor(null);
    toast(msg);
    persistStatus(r, status);
  }

  function persistStatus(r: Row, status: Status) {
    // Cancelled persists to the order (no shipment "cancelled" state).
    if (status === "Cancelled") {
      const target = r.orderEntityId ?? (r.kind === "order" ? r.entityId : null);
      if (target) {
        api.put(`/api/orders/${target}`, { status: "Cancelled" satisfies OrderStatus })
          .catch(() => toast(`Failed to persist cancel for ${r.shp}`, "error"));
      }
      return;
    }
    if (r.kind === "shipment") {
      const ss = uiToShipmentStatus(status);
      if (ss) {
        api.put(`/api/shipments/${r.entityId}`, { status: ss })
          .catch(() => toast(`Failed to update ${r.shp}`, "error"));
      }
    } else {
      const os = uiToOrderStatus(status);
      if (os) {
        api.put(`/api/orders/${r.entityId}`, { status: os })
          .catch(() => toast(`Failed to update ${r.so}`, "error"));
      }
    }
  }

  // Local-only stage advance for Processing rows (Created→Picked→Packed). The
  // final "Mark shipped" transition flips status and persists.
  function advanceStage(r: Row) {
    if (r.stage === "Created") {
      setRows((prev) => prev.map((x) => (x.shp === r.shp ? { ...x, stage: "Picked" } : x)));
      setViewing((prev) => (prev && prev.shp === r.shp ? { ...prev, stage: "Picked" } : prev));
      setMenuFor(null);
      toast(`${r.shp} marked picked`);
    } else if (r.stage === "Picked") {
      setRows((prev) => prev.map((x) => (x.shp === r.shp ? { ...x, stage: "Packed" } : x)));
      setViewing((prev) => (prev && prev.shp === r.shp ? { ...prev, stage: "Packed" } : prev));
      setMenuFor(null);
      toast(`${r.shp} marked packed`);
    } else if (r.stage === "Packed") {
      applyStatus(r, "Shipped", { stage: "Shipped", ship: fmtDate(new Date().toISOString()) }, `${r.shp} marked shipped`);
    }
  }

  function bulkMarkDelivered() {
    const eligible = selectedRows.filter((r) => r.status !== "Delivered" && r.status !== "Cancelled");
    setRows((prev) => prev.map((r) => (selected.has(r.shp) && r.status !== "Delivered" && r.status !== "Cancelled" ? { ...r, status: "Delivered", stage: "Shipped" } : r)));
    eligible.forEach((r) => persistStatus(r, "Delivered"));
    toast(`Marked ${eligible.length} shipment${eligible.length === 1 ? "" : "s"} delivered`);
    setSelected(new Set());
  }

  function bulkCancel() {
    const eligible = selectedRows.filter((r) => r.status !== "Delivered" && r.status !== "Cancelled");
    setRows((prev) => prev.map((r) => (selected.has(r.shp) && r.status !== "Delivered" && r.status !== "Cancelled" ? { ...r, status: "Cancelled" } : r)));
    eligible.forEach((r) => persistStatus(r, "Cancelled"));
    toast(`Cancelled ${eligible.length} shipment${eligible.length === 1 ? "" : "s"}`);
    setSelected(new Set());
    setBulkCancelling(false);
  }

  const stageAction = (r: Row): { label: string; icon: typeof Box } | null => {
    if (r.status !== "Processing") return null;
    if (r.stage === "Created") return { label: "Mark picked", icon: PackageOpen };
    if (r.stage === "Picked") return { label: "Mark packed", icon: Box };
    if (r.stage === "Packed") return { label: "Mark shipped", icon: Truck };
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader className="w-5 h-5 animate-spin text-action-blue" />
        <span className="ml-2 text-[14px] text-text-muted">Loading outbound shipments…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Outbound Shipments</h1>
          <p className="text-[14px] text-text-muted mt-1">Manage and track all outbound shipments across your warehouses.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dropdown label="Filters" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} />
          <button onClick={handleExport} className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Columns3 className="w-4 h-4" /> Export</button>
          <button onClick={openCreate} className="flex items-center gap-2 text-[13px] font-medium text-white bg-action-blue rounded-lg px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#004BBF]"><Plus className="w-4 h-4" /> New Shipment</button>
        </div>
      </div>

      {/* Stats (computed live from rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          const Arrow = s.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={s.title} className={card + " p-5"}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${s.iconBg} flex items-center justify-center`}><Icon className={`w-5 h-5 ${s.iconColor}`} /></div>
              </div>
              <span className="text-[13px] text-text-muted">{s.title}</span>
              <p className="text-[24px] font-bold text-text-primary mt-0.5">{s.value} {s.sub && <span className="text-[12px] font-normal text-text-light">{s.sub}</span>}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Arrow className={`w-3.5 h-3.5 ${s.positive ? "text-teal" : "text-[#EF4444]"}`} />
                <span className={`text-[12px] font-medium ${s.positive ? "text-teal" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-text-light">vs last 30 days</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-border-soft">
        <div className="flex items-center" style={{ gap: "28px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-[14px] font-medium transition-colors ${
                activeTab === tab ? "text-action-blue" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-action-blue rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 2.6fr) minmax(0, 1fr)" }}>
        {/* Main table + CTA */}
        <div className="space-y-5">
          <div ref={tableRef} className={card + " overflow-hidden"}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-text-light absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by order #, tracking #, recipient..." className="w-full text-[13px] text-text-primary placeholder:text-text-light bg-white border border-border-soft rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
              </div>
              <Dropdown label="All Warehouses" value={whFilter} options={WAREHOUSES} onSelect={setWhFilter} />
              <Dropdown label="All Carrier" value={carrierFilter} options={CARRIERS} onSelect={setCarrierFilter} />
              <Dropdown label="All Statuses" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} />
            </div>

            {/* Bulk action bar */}
            {selected.size > 0 && (
              <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-[#EFF6FF] border-b border-[#BFDBFE]">
                <span className="text-[13px] font-medium text-[#1D4ED8]">{selected.size} selected</span>
                <div className="flex items-center gap-2">
                  <button onClick={exportSelected} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#BFDBFE] rounded-lg text-[13px] text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"><Download className="w-4 h-4" /> Export selected</button>
                  <button onClick={bulkMarkDelivered} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#BFDBFE] rounded-lg text-[13px] text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"><CheckCircle2 className="w-4 h-4" /> Mark delivered</button>
                  <button onClick={() => setBulkCancelling(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] rounded-lg text-[13px] font-medium text-white transition-colors"><Ban className="w-4 h-4" /> Cancel selected</button>
                  <button onClick={() => setSelected(new Set())} className="px-2 py-1.5 text-[13px] text-text-muted hover:text-text-primary">Clear</button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-soft-bg border-b border-border-soft">
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} aria-label="Select all on page" className="w-4 h-4 rounded border-border-soft text-action-blue focus:ring-action-blue cursor-pointer" />
                  </th>
                  <th className={thCls}><button onClick={() => toggleSort("so")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Order / Shipment # {sortIcon("so")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("recipient")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Recipient {sortIcon("recipient")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("wh")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Warehouse {sortIcon("wh")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("carrier")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Carrier {sortIcon("carrier")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Status {sortIcon("status")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("ship")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Ship Date {sortIcon("ship")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("eta")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Est. Delivery {sortIcon("eta")}</button></th>
                  <th className={thCls + " text-right"}>Actions</th>
                </tr></thead>
                <tbody>
                  {pageRows.map((r) => {
                    const action = stageAction(r);
                    return (
                      <tr key={r.shp} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                        <td className="px-4 py-4">
                          <input type="checkbox" checked={selected.has(r.shp)} onChange={() => toggleRow(r.shp)} aria-label={`Select ${r.shp}`} className="w-4 h-4 rounded border-border-soft text-action-blue focus:ring-action-blue cursor-pointer" />
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => setViewing(r)} className="flex items-center gap-3 text-left">
                            <div className="w-9 h-9 rounded-lg bg-soft-bg flex items-center justify-center shrink-0"><Truck className="w-4 h-4 text-text-light" /></div>
                            <div><p className="text-[13px] font-medium text-action-blue leading-tight font-mono hover:underline">{r.so}</p><p className="text-[11px] text-text-light leading-tight mt-0.5 font-mono">{r.shp}</p></div>
                          </button>
                        </td>
                        <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.recipient}</p><p className="text-[11px] text-text-light mt-0.5">{r.city}</p></td>
                        <td className="px-6 py-4 text-[13px] text-text-muted">{r.wh}</td>
                        <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.carrier}</p><p className="text-[11px] text-text-light mt-0.5">{r.service}</p></td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <Badge text={r.status} />
                            {r.status === "Processing" && <StageChip stage={r.stage} />}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-text-muted whitespace-nowrap">{r.ship}</td>
                        <td className="px-6 py-4 text-[13px] text-text-muted whitespace-nowrap">{r.eta}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block">
                            <button onClick={() => setMenuFor((v) => (v === r.shp ? null : r.shp))} className="text-text-light hover:text-text-muted p-1"><MoreHorizontal className="w-4 h-4" /></button>
                            {menuFor === r.shp && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                                <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-border-soft shadow-lg py-1 text-left">
                                  <button onClick={() => { setMenuFor(null); setViewing(r); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg"><Eye className="w-3.5 h-3.5" /> Track shipment</button>
                                  {action && (
                                    <button onClick={() => advanceStage(r)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#7C6FF6] hover:bg-soft-bg"><action.icon className="w-3.5 h-3.5" /> {action.label}</button>
                                  )}
                                  {r.status !== "Cancelled" && (
                                    <button onClick={() => openEdit(r)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg"><Pencil className="w-3.5 h-3.5" /> Edit shipment</button>
                                  )}
                                  {r.status !== "Delivered" && r.status !== "Cancelled" && r.status !== "Processing" && (
                                    <button onClick={() => applyStatus(r, "Delivered", {}, `${r.shp} marked delivered`)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-teal hover:bg-soft-bg"><CheckCircle2 className="w-3.5 h-3.5" /> Mark delivered</button>
                                  )}
                                  {r.status !== "Delivered" && r.status !== "Cancelled" && (
                                    <button onClick={() => { setMenuFor(null); setCancelling(r); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-soft-bg"><Ban className="w-3.5 h-3.5" /> Cancel shipment</button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {pageRows.length === 0 && (
                    <tr><td colSpan={9} className="px-6 py-12 text-center text-[13px] text-text-muted">{rows.length === 0 ? "No outbound shipments or orders yet." : "No shipments match your filters."}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-border-soft">
              <span className="text-[13px] text-text-muted">{sorted.length === 0 ? "Showing 0 shipments" : `Showing ${start + 1}-${Math.min(start + pageSize, sorted.length)} of ${sorted.length} shipments`}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${p === currentPage ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-soft-bg"}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA banner */}
          <div className="rounded-xl bg-action-blue px-6 py-5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0"><Truck className="w-5 h-5 text-white" /></div>
              <div>
                <p className="text-[16px] font-semibold text-white">Need to create a shipment?</p>
                <p className="text-[13px] text-white/80 mt-0.5">Generate labels, assign carriers, and dispatch orders in a few clicks.</p>
              </div>
            </div>
            <button onClick={openCreate} className="flex items-center gap-2 text-[13px] font-medium text-action-blue bg-white rounded-lg px-4 py-2.5 hover:bg-white/90 shrink-0"><Plus className="w-4 h-4" /> Create Outbound Shipment</button>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Shipment Status donut (derived from rows) */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Shipment Status</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                  {(() => {
                    let off = 0;
                    return donutSegments.filter((s) => s.count > 0).map((s) => {
                      const p = computed.total ? (s.count / computed.total) * 100 : 0;
                      const da = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                      const el = <circle key={s.label} cx="50" cy="50" r="40" fill="none" stroke={s.color} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                      off += p;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-[17px] font-bold text-text-primary leading-none">{computed.total}</p><p className="text-[10px] text-text-light mt-0.5">Total</p></div></div>
              </div>
              <div className="flex-1 space-y-2 text-[12px]">
                {donutSegments.map((s) => (
                  <div key={s.label} className="flex justify-between">
                    <span className="flex items-center gap-2 text-text-muted"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />{s.label}</span>
                    <span className="font-medium text-text-primary">{s.count} ({computed.pct(s.count)})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carrier Performance (derived from rows; sets carrier filter) */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-text-primary">Carrier Performance</h3>
              {carrierFilter && <button onClick={() => setCarrierFilter("")} className="text-[12px] text-action-blue hover:underline">Clear filter</button>}
            </div>
            <div className="space-y-3">
              {computed.carriers.map((c) => (
                <button key={c.name} onClick={() => { setCarrierFilter(c.name); tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={`w-full flex items-center gap-3 text-left hover:bg-soft-bg rounded-lg -mx-1 px-1 py-0.5 ${carrierFilter === c.name ? "bg-soft-bg" : ""}`}>
                  <div className="w-9 h-9 rounded-lg bg-soft-bg flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-text-muted">{c.name}</span></div>
                  <div className="flex-1"><p className="text-[12px] font-medium text-text-primary">{c.name}</p><p className="text-[11px] text-text-light">{c.count} shipment{c.count === 1 ? "" : "s"}</p></div>
                  <div className="text-right"><p className="text-[13px] font-semibold text-text-primary">{c.rate}{c.rate !== "—" ? "%" : ""}</p><p className="text-[11px] text-text-light">on-time</p></div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity (live from latest rows) */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {(() => {
                const meta: Record<string, { icon: typeof Truck; type: string; color: string }> = {
                  Delivered: { icon: PackageCheck, type: "Shipment delivered", color: "var(--color-teal)" },
                  Exception: { icon: AlertTriangle, type: "Delivery exception", color: "#EF4444" },
                  Delayed: { icon: AlertTriangle, type: "Delivery delayed", color: "#EF4444" },
                  "In Transit": { icon: Navigation, type: "Out for delivery", color: "var(--color-action-blue)" },
                  Shipped: { icon: Truck, type: "Shipment dispatched", color: "#7C6FF6" },
                  Processing: { icon: Box, type: "Order processing", color: "#7C6FF6" },
                  Cancelled: { icon: Ban, type: "Shipment cancelled", color: "#EF4444" },
                };
                const events = rows.slice(0, 4);
                if (events.length === 0) {
                  return <p className="text-[12px] text-text-light py-4 text-center">No recent shipment activity.</p>;
                }
                return events.map((r) => {
                  const m = meta[r.status] ?? meta.Processing;
                  const Icon = m.icon;
                  return (
                    <div key={r.shp} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: m.color + "1a" }}><Icon className="w-3.5 h-3.5" style={{ color: m.color }} /></div>
                      <div className="flex-1 min-w-0"><p className="text-[12px] text-text-primary">{m.type}</p><p className="text-[11px] text-text-light truncate">{r.shp} - {r.recipient}</p></div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* New / Edit Shipment modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.shp}` : "New Shipment"}
        description={editing ? "Update the shipment details below." : "Create an outbound shipment and assign a carrier."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveShipment} disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create shipment"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Recipient" required><TextInput value={draft.recipient} onChange={(e) => setDraft((d) => ({ ...d, recipient: e.target.value }))} placeholder="Acme Retail Co." /></Field></div>
          <Field label="Warehouse"><Select options={WAREHOUSES} value={draft.wh} onChange={(e) => setDraft((d) => ({ ...d, wh: e.target.value }))} /></Field>
          <Field label="Carrier"><Select options={CARRIERS} value={draft.carrier} onChange={(e) => setDraft((d) => ({ ...d, carrier: e.target.value }))} /></Field>
          <Field label="Service"><Select options={SERVICES} value={draft.service} onChange={(e) => setDraft((d) => ({ ...d, service: e.target.value }))} /></Field>
          <Field label={editing ? "Est. delivery" : "Ship date"}><TextInput type="date" value={draft.eta} onChange={(e) => setDraft((d) => ({ ...d, eta: e.target.value }))} /></Field>
        </div>
      </Modal>

      {/* Tracking drawer */}
      <Drawer
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `Shipment ${viewing.shp}` : ""}
        subtitle={viewing ? `Order ${viewing.so} · ${viewing.recipient}` : undefined}
        footer={
          viewing && (
            <>
              {viewing.status === "Processing" && stageAction(viewing) && (
                <SecondaryButton onClick={() => { const v = viewing; advanceStage(v); }}>{stageAction(viewing)?.label}</SecondaryButton>
              )}
              {viewing.status !== "Cancelled" && <SecondaryButton onClick={() => openEdit(viewing)}>Edit shipment</SecondaryButton>}
              {viewing.status !== "Delivered" && viewing.status !== "Cancelled" && viewing.status !== "Processing" && (
                <PrimaryButton onClick={() => applyStatus(viewing, "Delivered", {}, `${viewing.shp} marked delivered`)}>Mark delivered</PrimaryButton>
              )}
            </>
          )
        }
      >
        {viewing && (
          <>
            <div className="space-y-0">
              <DrawerRow label="Status">
                <span className="inline-flex items-center gap-2"><Badge text={viewing.status} />{viewing.status === "Processing" && <StageChip stage={viewing.stage} />}</span>
              </DrawerRow>
              <DrawerRow label="Order #"><span className="font-mono">{viewing.so}</span></DrawerRow>
              <DrawerRow label="Shipment #"><span className="font-mono">{viewing.shp}</span></DrawerRow>
              <DrawerRow label="Recipient">{viewing.recipient}</DrawerRow>
              <DrawerRow label="Destination">{viewing.city}</DrawerRow>
              <DrawerRow label="Warehouse">{viewing.wh}</DrawerRow>
              <DrawerRow label="Carrier">{viewing.carrier} · {viewing.service}</DrawerRow>
              <DrawerRow label="Ship date">{viewing.ship}</DrawerRow>
              <DrawerRow label="Est. delivery">{viewing.eta}</DrawerRow>
            </div>
            <DrawerSection title="Tracking timeline">
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const reached = i < reachedSteps(viewing);
                  const isLast = i === TIMELINE_STEPS.length - 1;
                  return (
                    <div key={step.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${reached ? "bg-[#10B981]" : "bg-[#E5E7EB]"}`}>
                          {reached ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />}
                        </div>
                        {!isLast && <div className={`w-px flex-1 min-h-[24px] ${i < reachedSteps(viewing) - 1 ? "bg-[#10B981]" : "bg-[#E5E7EB]"}`} />}
                      </div>
                      <div className="pb-4">
                        <p className={`text-[13px] font-medium ${reached ? "text-[#1A1A1A]" : "text-[#9CA3AF]"}`}>{step.label}</p>
                        <p className="text-[12px] text-[#6B7280]">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
                {viewing.status === "Cancelled" && (
                  <div className="flex gap-3 mt-1">
                    <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center shrink-0"><Ban className="w-3.5 h-3.5 text-white" /></div>
                    <p className="text-[13px] font-medium text-[#EF4444]">Shipment cancelled</p>
                  </div>
                )}
                {(viewing.status === "Exception" || viewing.status === "Delayed") && (
                  <div className="flex gap-3 mt-1">
                    <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center shrink-0"><AlertTriangle className="w-3.5 h-3.5 text-white" /></div>
                    <p className="text-[13px] font-medium text-[#F59E0B]">{viewing.status === "Delayed" ? "Delivery delayed by carrier" : "Carrier reported an exception"}</p>
                  </div>
                )}
              </div>
            </DrawerSection>
          </>
        )}
      </Drawer>

      {/* Cancel confirm */}
      <ConfirmDialog
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        onConfirm={() => { if (cancelling) { applyStatus(cancelling, "Cancelled", {}, `${cancelling.shp} cancelled`); setCancelling(null); } }}
        title="Cancel shipment"
        message={`Are you sure you want to cancel ${cancelling?.shp}?`}
        confirmLabel="Cancel shipment"
        cancelLabel="Keep"
        destructive
      />

      {/* Bulk cancel confirm */}
      <ConfirmDialog
        open={bulkCancelling}
        onClose={() => setBulkCancelling(false)}
        onConfirm={bulkCancel}
        title="Cancel selected shipments"
        message={`Cancel ${selected.size} selected shipment${selected.size === 1 ? "" : "s"}? Delivered and already-cancelled shipments are skipped.`}
        confirmLabel="Cancel shipments"
        cancelLabel="Keep"
        destructive
      />
    </div>
  );
}
