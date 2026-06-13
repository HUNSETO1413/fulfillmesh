"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Package, Tag, DollarSign, AlertTriangle,
  Search, Download, ChevronDown, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Eye, SlidersHorizontal, Pencil, Trash2, Plus, ChevronUp, ArrowUpDown,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Drawer, DrawerRow, DrawerSection } from "@/components/dashboard/Drawer";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import type { InventoryItem } from "@/types";

const tabs = ["All Inventory", "Low Stock", "Out of Stock", "Expiring Soon"];

type Status = "In Stock" | "Low Stock" | "Out of Stock";
type Row = {
  product: string; category: string; sku: string; wh: string;
  onHand: number; reserved: number; unitCost: number; status: Status;
  expiring?: boolean; updated: string;
};

const initialRows: Row[] = [
  { product: "Wireless Headphones", category: "Electronics", sku: "ELEC-1001", wh: "ATL-1", onHand: 2450, reserved: 320, unitCost: 38.5, status: "In Stock", updated: "2025-05-12" },
  { product: "Stainless Steel Bottle", category: "Home & Kitchen", sku: "HK-2002", wh: "LAX-1", onHand: 5120, reserved: 200, unitCost: 9.2, status: "In Stock", updated: "2025-05-11" },
  { product: "Cotton T-Shirt", category: "Apparel", sku: "APP-3003-M", wh: "ORD-1", onHand: 1250, reserved: 640, unitCost: 6.4, status: "In Stock", updated: "2025-05-12" },
  { product: "Running Shoes", category: "Sports", sku: "FTW-4004-9", wh: "DFW-1", onHand: 320, reserved: 85, unitCost: 41.0, status: "Low Stock", updated: "2025-05-10" },
  { product: "Whey Protein 1kg", category: "Health & Beauty", sku: "HB-5005", wh: "MIA-1", onHand: 0, reserved: 0, unitCost: 18.7, status: "Out of Stock", expiring: true, updated: "2025-05-09" },
  { product: "Travel Backpack", category: "Bags & Luggage", sku: "BAG-6006", wh: "ATL-1", onHand: 880, reserved: 120, unitCost: 22.3, status: "In Stock", updated: "2025-05-11" },
  { product: "Bluetooth Speaker", category: "Electronics", sku: "ELEC-1007", wh: "LAX-1", onHand: 1640, reserved: 210, unitCost: 27.9, status: "In Stock", updated: "2025-05-12" },
  { product: "Yoga Mat Premium", category: "Sports", sku: "SPT-4008", wh: "ORD-1", onHand: 410, reserved: 60, unitCost: 14.5, status: "Low Stock", updated: "2025-05-10" },
  { product: "Ceramic Dinner Set", category: "Home & Kitchen", sku: "HK-2009", wh: "DFW-1", onHand: 2200, reserved: 180, unitCost: 31.6, status: "In Stock", updated: "2025-05-08" },
  { product: "Vitamin C Tablets", category: "Health & Beauty", sku: "HB-5010", wh: "MIA-1", onHand: 95, reserved: 40, unitCost: 7.8, status: "Low Stock", expiring: true, updated: "2025-05-12" },
];

const CATEGORIES = ["Electronics", "Home & Kitchen", "Apparel", "Sports", "Health & Beauty", "Bags & Luggage"];
const WAREHOUSES = ["ATL-1", "LAX-1", "ORD-1", "DFW-1", "MIA-1"];
const STATUSES: Status[] = ["In Stock", "Low Stock", "Out of Stock"];
const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "#3B82F6", Apparel: "#10B981", "Home & Kitchen": "#F59E0B",
  Sports: "#06B6D4", "Health & Beauty": "#8B5CF6", "Bags & Luggage": "#EC4899", Other: "#EF4444",
};
const STATUS_META: { label: Status; color: string }[] = [
  { label: "In Stock", color: "#10B981" },
  { label: "Low Stock", color: "#F59E0B" },
  { label: "Out of Stock", color: "#EF4444" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Stock": "bg-[#10B981]/10 text-[#10B981]",
    "Low Stock": "bg-[#F59E0B]/10 text-[#F59E0B]",
    "Out of Stock": "bg-[#EF4444]/10 text-[#EF4444]",
  };
  return <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[status]}`}>{status}</span>;
}

const card = "bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.08)]";
const thCls = "text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3";
const dropBtn = "flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]";

function Dropdown({ label, value, options, onSelect }: { label: string; value: string; options: string[]; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className={`${dropBtn} ${value ? "text-[#3B82F6] border-[#3B82F6]" : ""}`}>
        {value || label} <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-20 w-52 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1 max-h-64 overflow-auto">
            <button onClick={() => { onSelect(""); setOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${!value ? "text-[#3B82F6] font-medium" : "text-[#1E293B]"}`}>{label}</button>
            {options.map((o) => (
              <button key={o} onClick={() => { onSelect(o); setOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${value === o ? "text-[#3B82F6] font-medium" : "text-[#1E293B]"}`}>{o}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function deriveStatus(onHand: number): Status {
  if (onHand <= 0) return "Out of Stock";
  if (onHand < 500) return "Low Stock";
  return "In Stock";
}

const num = (n: number) => n.toLocaleString("en-US");
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const todayIso = () => new Date().toISOString().slice(0, 10);

type SortKey = "product" | "sku" | "wh" | "onHand" | "reserved" | "available" | "status";
type Draft = { product: string; category: string; sku: string; wh: string; onHand: string; reserved: string; unitCost: string };
const emptyDraft: Draft = { product: "", category: "Electronics", sku: "", wh: "ATL-1", onHand: "", reserved: "", unitCost: "" };

export default function WarehouseInventoryPage() {
  const { toast } = useToast();
  const tableRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: InventoryItem[]; total: number }>("/api/inventory");
        const mapped: Row[] = (res.data ?? []).map((it: InventoryItem) => ({
          product: it.name ?? "",
          category: "",
          sku: it.sku ?? "",
          wh: it.warehouse ?? "",
          onHand: Number(it.onHand ?? 0),
          reserved: Number(it.reserved ?? 0),
          unitCost: 0,
          status: (it.status as Status) ?? deriveStatus(Number(it.onHand ?? 0)),
          expiring: false,
          updated: "",
        }));
        if (!cancelled) setRows(mapped);
      } catch (e) {
        if (!cancelled) toast("Failed to load inventory", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [activeTab, setActiveTabState] = useState("All Inventory");
  const [query, setQueryState] = useState("");
  const [whFilter, setWhFilterState] = useState("");
  const [catFilter, setCatFilterState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const setActiveTab = (v: string) => { setActiveTabState(v); setPage(1); };
  const setQuery = (v: string) => { setQueryState(v); setPage(1); };
  const setWhFilter = (v: string) => { setWhFilterState(v); setPage(1); };
  const setCatFilter = (v: string) => { setCatFilterState(v); setPage(1); };
  const setStatusFilter = (v: string) => { setStatusFilterState(v); setPage(1); };

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>("product");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }
  const sortIcon = (k: SortKey) =>
    sortKey !== k
      ? <ArrowUpDown className="w-3 h-3 text-[#CBD5E1]" />
      : <ChevronUp className={`w-3 h-3 text-[#3B82F6] transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} />;

  // bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // adjust / create / edit / delete / drawer
  const [adjusting, setAdjusting] = useState<Row | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [viewing, setViewing] = useState<Row | null>(null);

  // activity log
  const [log, setLog] = useState([
    { text: "Inbound PO #90765 received", info: "ATL-1 - 2h ago", dot: "#10B981" },
    { text: "SKU ELEC-1001 stock adjusted", info: "ATL-1 - 4h ago", dot: "#3B82F6" },
    { text: "Cycle count completed Zone B", info: "LAX-1 - 6h ago", dot: "#8B5CF6" },
  ]);
  const [logExpanded, setLogExpanded] = useState(false);
  const pushLog = (text: string, wh: string, dot = "#3B82F6") =>
    setLog((prev) => [{ text, info: `${wh} - just now`, dot }, ...prev]);

  function scrollToTable() {
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      let tab = true;
      if (activeTab === "Low Stock") tab = r.status === "Low Stock";
      else if (activeTab === "Out of Stock") tab = r.status === "Out of Stock";
      else if (activeTab === "Expiring Soon") tab = !!r.expiring;
      const wh = !whFilter || r.wh === whFilter;
      const cat = !catFilter || r.category === catFilter;
      const st = !statusFilter || r.status === statusFilter;
      const search = !q || r.sku.toLowerCase().includes(q) || r.product.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
      return tab && wh && cat && st && search;
    });
  }, [rows, activeTab, whFilter, catFilter, statusFilter, query]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "onHand" || sortKey === "reserved") { av = a[sortKey]; bv = b[sortKey]; }
      else if (sortKey === "available") { av = a.onHand - a.reserved; bv = b.onHand - b.reserved; }
      else { av = String(a[sortKey]).toLowerCase(); bv = String(b[sortKey]).toLowerCase(); }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const pageIds = pageRows.map((r) => r.sku);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const selectedRows = sorted.filter((r) => selected.has(r.sku));

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
    const totalUnits = rows.reduce((s, r) => s + r.onHand, 0);
    const totalValue = rows.reduce((s, r) => s + r.onHand * r.unitCost, 0);
    const lowStock = rows.filter((r) => r.status === "Low Stock").length;
    const byStatus = STATUS_META.map((m) => {
      const count = rows.filter((r) => r.status === m.label).length;
      return { ...m, count, pct: rows.length ? (count / rows.length) * 100 : 0 };
    });
    // category share of on-hand units
    const catTotals = new Map<string, number>();
    for (const r of rows) catTotals.set(r.category, (catTotals.get(r.category) ?? 0) + r.onHand);
    const ranked = [...catTotals.entries()].sort((a, b) => b[1] - a[1]);
    const top = ranked.slice(0, 4);
    const otherUnits = ranked.slice(4).reduce((s, [, u]) => s + u, 0);
    const segments = [...top, ...(otherUnits > 0 ? ([["Other", otherUnits]] as [string, number][]) : [])].map(([name, units]) => ({
      name, units,
      pct: totalUnits ? Math.round((units / totalUnits) * 100) : 0,
      color: CATEGORY_COLORS[name] ?? CATEGORY_COLORS.Other,
    }));
    const expiringRows = rows.filter((r) => r.expiring);
    return { totalUnits, totalValue, lowStock, byStatus, segments, expiringRows };
  }, [rows]);

  const stats = [
    { title: "Total Units", value: num(computed.totalUnits), sub: "Units", change: "+12.5%", note: "vs last 30 days", positive: true, icon: Package, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
    { title: "SKUs", value: num(rows.length), sub: "Active", change: "+4.3%", note: "vs last 30 days", positive: true, icon: Tag, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
    { title: "Total Value", value: `$${num(Math.round(computed.totalValue))}`, sub: "USD", change: "+8.7%", note: "vs last 30 days", positive: true, icon: DollarSign, iconBg: "bg-[#8B5CF6]/10", iconColor: "text-[#8B5CF6]" },
    { title: "Low Stock Items", value: num(computed.lowStock), sub: "SKUs", change: "-16.4%", note: "vs last 30 days", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  ];

  function handleExport() {
    const exportRows = sorted.map((r) => ({ ...r, available: r.onHand - r.reserved }));
    exportToCsv("warehouse-inventory", exportRows, [
      { key: "product", header: "Product" }, { key: "category", header: "Category" }, { key: "sku", header: "SKU" },
      { key: "wh", header: "Warehouse" }, { key: "onHand", header: "On Hand" }, { key: "reserved", header: "Reserved" },
      { key: "available", header: "Available" }, { key: "status", header: "Status" }, { key: "updated", header: "Last Updated" },
    ]);
    toast(`Exported ${sorted.length} inventory items to CSV`);
  }

  function exportSelected() {
    const exportRows = selectedRows.map((r) => ({ ...r, available: r.onHand - r.reserved }));
    exportToCsv("warehouse-inventory-selected", exportRows, [
      { key: "product", header: "Product" }, { key: "sku", header: "SKU" }, { key: "wh", header: "Warehouse" },
      { key: "onHand", header: "On Hand" }, { key: "reserved", header: "Reserved" }, { key: "available", header: "Available" },
      { key: "status", header: "Status" },
    ]);
    toast(`Exported ${selectedRows.length} selected items to CSV`);
  }

  function bulkDelete() {
    setRows((prev) => prev.filter((r) => !selected.has(r.sku)));
    pushLog(`${selected.size} SKU${selected.size === 1 ? "" : "s"} removed`, "Bulk", "#EF4444");
    toast(`Deleted ${selected.size} item${selected.size === 1 ? "" : "s"}`);
    selected.forEach((sku) => { api.del(`/api/inventory/${sku}`).catch(() => {}); });
    setSelected(new Set());
    setBulkDeleting(false);
  }

  function openAdjust(r: Row) {
    setAdjusting(r);
    setAdjustQty(String(r.onHand));
    setMenuFor(null);
    setViewing(null);
  }

  function saveAdjust() {
    if (!adjusting) return;
    const qty = Number(adjustQty);
    if (Number.isNaN(qty) || qty < 0) { toast("Enter a valid quantity", "error"); return; }
    setRows((prev) => prev.map((r) => (r.sku === adjusting.sku ? { ...r, onHand: qty, status: deriveStatus(qty), updated: todayIso() } : r)));
    pushLog(`SKU ${adjusting.sku} stock adjusted`, adjusting.wh);
    toast(`${adjusting.sku} on-hand set to ${num(qty)}`);
    api.put(`/api/inventory/${adjusting.sku}`, { sku: adjusting.sku, name: adjusting.product, warehouse: adjusting.wh, onHand: qty, reserved: adjusting.reserved, available: qty - adjusting.reserved, reorderPoint: 0, status: deriveStatus(qty) }).catch(() => toast("Failed to save adjustment on server", "error"));
    setAdjusting(null);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(r: Row) {
    setEditing(r);
    setDraft({ product: r.product, category: r.category, sku: r.sku, wh: r.wh, onHand: String(r.onHand), reserved: String(r.reserved), unitCost: String(r.unitCost) });
    setMenuFor(null);
    setViewing(null);
    setFormOpen(true);
  }

  function saveItem() {
    if (!draft.product.trim()) { toast("Product name is required", "error"); return; }
    if (!draft.sku.trim()) { toast("SKU is required", "error"); return; }
    const sku = draft.sku.trim().toUpperCase();
    if (rows.some((r) => r.sku === sku && r.sku !== editing?.sku)) { toast("SKU already exists", "error"); return; }
    const onHand = Number(draft.onHand);
    const reserved = Number(draft.reserved) || 0;
    const unitCost = Number(draft.unitCost) || 0;
    if (Number.isNaN(onHand) || onHand < 0) { toast("On-hand must be 0 or more", "error"); return; }
    if (reserved < 0 || unitCost < 0) { toast("Reserved and unit cost must be 0 or more", "error"); return; }
    if (editing) {
      setRows((prev) => prev.map((r) => (r.sku === editing.sku
        ? { ...r, product: draft.product.trim(), category: draft.category, sku, wh: draft.wh, onHand, reserved, unitCost, status: deriveStatus(onHand), updated: todayIso() }
        : r)));
      pushLog(`SKU ${sku} updated`, draft.wh);
      toast(`${sku} updated`);
      api.put(`/api/inventory/${sku}`, { sku, name: draft.product.trim(), warehouse: draft.wh, onHand, reserved, available: onHand - reserved, reorderPoint: 0, status: deriveStatus(onHand) }).catch(() => toast("Failed to save changes on server", "error"));
    } else {
      const newRow: Row = {
        product: draft.product.trim(), category: draft.category, sku, wh: draft.wh,
        onHand, reserved, unitCost, status: deriveStatus(onHand), updated: todayIso(),
      };
      setRows((prev) => [newRow, ...prev]);
      pushLog(`SKU ${sku} added`, draft.wh, "#10B981");
      toast(`${sku} added to inventory`);
      api.post("/api/inventory", { sku, name: draft.product.trim(), warehouse: draft.wh, onHand, reserved, available: onHand - reserved, reorderPoint: 0, status: deriveStatus(onHand) }).catch(() => toast("Failed to create item on server", "error"));
    }
    setFormOpen(false);
  }

  function confirmDelete() {
    if (!deleting) return;
    setRows((prev) => prev.filter((r) => r.sku !== deleting.sku));
    setSelected((prev) => { const next = new Set(prev); next.delete(deleting.sku); return next; });
    pushLog(`SKU ${deleting.sku} removed`, deleting.wh, "#EF4444");
    toast(`${deleting.sku} deleted`);
    api.del(`/api/inventory/${deleting.sku}`).catch(() => toast("Failed to delete item on server", "error"));
    setDeleting(null);
    setViewing(null);
  }

  const visibleLog = logExpanded ? log : log.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Inventory</h1>
          <p className="text-[14px] text-[#64748B] mt-1">View and manage all inventory across your warehouses.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown label="All Warehouses (5)" value={whFilter} options={WAREHOUSES} onSelect={setWhFilter} />
          <button onClick={handleExport} className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]"><Download className="w-4 h-4" /> Export</button>
          <button onClick={openCreate} className="flex items-center gap-2 text-[13px] text-white bg-[#3B82F6] rounded-lg px-4 py-2 hover:bg-[#2563EB]"><Plus className="w-4 h-4" /> Add Item</button>
        </div>
      </div>

      {/* Stats (computed live from rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const Arrow = s.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={s.title} className={card + " p-5"}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#64748B]">{s.title}</span>
                <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}><Icon className={`w-4.5 h-4.5 ${s.iconColor}`} /></div>
              </div>
              <p className="text-[24px] font-bold text-[#1E293B]">{s.value} <span className="text-[12px] font-normal text-[#94A3B8]">{s.sub}</span></p>
              <div className="flex items-center gap-1 mt-1.5">
                <Arrow className={`w-3.5 h-3.5 ${s.positive ? "text-[#10B981]" : "text-[#EF4444]"}`} />
                <span className={`text-[12px] font-medium ${s.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-[#94A3B8]">{s.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E2E8F0]">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[13px] pb-3 border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "text-[#3B82F6] border-[#3B82F6] font-medium"
                  : "text-[#64748B] border-transparent hover:text-[#1E293B]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 2.6fr) minmax(0, 1fr)" }}>
        {/* Main table card */}
        <div ref={tableRef} className={card + " overflow-hidden self-start"}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2E8F0]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by SKU, product name or barcode..." className="w-full text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] bg-white border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30" />
            </div>
            <Dropdown label="All Categories" value={catFilter} options={CATEGORIES} onSelect={setCatFilter} />
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-[#EFF6FF] border-b border-[#BFDBFE]">
              <span className="text-[13px] font-medium text-[#1D4ED8]">{selected.size} selected</span>
              <div className="flex items-center gap-2">
                <button onClick={exportSelected} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#BFDBFE] rounded-lg text-[13px] text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"><Download className="w-4 h-4" /> Export selected</button>
                <button onClick={() => setBulkDeleting(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] rounded-lg text-[13px] font-medium text-white transition-colors"><Trash2 className="w-4 h-4" /> Delete selected</button>
                <button onClick={() => setSelected(new Set())} className="px-2 py-1.5 text-[13px] text-[#64748B] hover:text-[#1E293B]">Clear</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="w-10 px-5 py-3">
                    <input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} aria-label="Select all on page" className="w-4 h-4 rounded border-[#CBD5E1] text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer" />
                  </th>
                  <th className={thCls}><button onClick={() => toggleSort("product")} className="inline-flex items-center gap-1 uppercase hover:text-[#3B82F6]">Product {sortIcon("product")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("sku")} className="inline-flex items-center gap-1 uppercase hover:text-[#3B82F6]">SKU {sortIcon("sku")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("wh")} className="inline-flex items-center gap-1 uppercase hover:text-[#3B82F6]">Warehouse {sortIcon("wh")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("onHand")} className="inline-flex items-center gap-1 uppercase hover:text-[#3B82F6]">On Hand {sortIcon("onHand")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("reserved")} className="inline-flex items-center gap-1 uppercase hover:text-[#3B82F6]">Reserved {sortIcon("reserved")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("available")} className="inline-flex items-center gap-1 uppercase hover:text-[#3B82F6]">Available {sortIcon("available")}</button></th>
                  <th className={thCls}><button onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 uppercase hover:text-[#3B82F6]">Status {sortIcon("status")}</button></th>
                  <th className={thCls + " text-right"}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr key={r.sku} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="px-5 py-3">
                      <input type="checkbox" checked={selected.has(r.sku)} onChange={() => toggleRow(r.sku)} aria-label={`Select ${r.sku}`} className="w-4 h-4 rounded border-[#CBD5E1] text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer" />
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => setViewing(r)} className="flex items-center gap-3 text-left">
                        <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-[#94A3B8]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#1E293B] leading-tight hover:text-[#3B82F6]">{r.product}</p>
                          <p className="text-[11px] text-[#94A3B8] leading-tight mt-0.5">{r.category}</p>
                        </div>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-[#64748B] font-mono">{r.sku}</td>
                    <td className="px-5 py-3 text-[13px] text-[#64748B]">{r.wh}</td>
                    <td className="px-5 py-3 text-[13px] font-medium text-[#1E293B]">{num(r.onHand)}</td>
                    <td className="px-5 py-3 text-[13px] text-[#64748B]">{num(r.reserved)}</td>
                    <td className="px-5 py-3 text-[13px] font-medium text-[#1E293B]">{num(Math.max(0, r.onHand - r.reserved))}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setMenuFor((v) => (v === r.sku ? null : r.sku))} className="text-[#94A3B8] hover:text-[#64748B]">
                          <MoreHorizontal className="w-4 h-4 inline" />
                        </button>
                        {menuFor === r.sku && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                            <div className="absolute right-0 mt-1 z-20 w-40 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1 text-left">
                              <button onClick={() => { setMenuFor(null); setViewing(r); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#1E293B] hover:bg-[#F8FAFC]"><Eye className="w-3.5 h-3.5" /> View details</button>
                              <button onClick={() => openEdit(r)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#1E293B] hover:bg-[#F8FAFC]"><Pencil className="w-3.5 h-3.5" /> Edit item</button>
                              <button onClick={() => openAdjust(r)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#3B82F6] hover:bg-[#F8FAFC]"><SlidersHorizontal className="w-3.5 h-3.5" /> Adjust stock</button>
                              <button onClick={() => { setMenuFor(null); setDeleting(r); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-[#F8FAFC]"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={9} className="px-5 py-12 text-center text-[13px] text-[#64748B]">{loading ? "Loading inventory..." : "No inventory items match your filters."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#E2E8F0]">
            <span className="text-[13px] text-[#64748B]">{sorted.length === 0 ? "Showing 0 items" : `Showing ${start + 1}-${Math.min(start + pageSize, sorted.length)} of ${sorted.length} items`}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] ${p === currentPage ? "bg-[#3B82F6] text-white" : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar widgets */}
        <div className="space-y-5">
          {/* Inventory by Category (derived from rows) */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-4">Inventory by Category</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {computed.segments.map((c, i) => {
                    const off = computed.segments.slice(0, i).reduce((s, x) => s + x.pct, 0);
                    const da = `${c.pct * 2.51327} ${251.327 - c.pct * 2.51327}`;
                    return <circle key={c.name} cx="50" cy="50" r="40" fill="none" stroke={c.color} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[15px] font-bold text-[#1E293B] leading-none">{num(computed.totalUnits)}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">Total Units</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {computed.segments.map((c) => (
                  <button key={c.name} onClick={() => { if (c.name !== "Other") { setCatFilter(c.name); scrollToTable(); } }} className="w-full flex items-center justify-between text-[12px] hover:bg-[#F8FAFC] rounded-lg -mx-1 px-1 py-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-[#64748B]">{c.name}</span>
                    </div>
                    <span className="font-medium text-[#1E293B]">{c.pct}%</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Status (derived from rows; sets table filter) */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-3">Stock Status</h3>
            <div className="space-y-2.5">
              {computed.byStatus.map((s) => (
                <button key={s.label} onClick={() => { setStatusFilter(s.label); scrollToTable(); }} className="w-full flex items-center justify-between text-[12px] hover:bg-[#F8FAFC] rounded-lg -mx-1 px-1 py-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[#64748B]">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#1E293B]">{num(s.count)} SKUs</span>
                    <span className="text-[#94A3B8] w-10 text-right">{s.pct.toFixed(1)}%</span>
                  </div>
                </button>
              ))}
              {statusFilter && (
                <button onClick={() => setStatusFilter("")} className="w-full text-left text-[12px] text-[#3B82F6] hover:underline px-0.5">Clear status filter</button>
              )}
              <div className="flex items-center justify-between text-[12px] pt-2 border-t border-[#E2E8F0]">
                <span className="font-semibold text-[#1E293B]">Total</span>
                <span className="font-semibold text-[#1E293B]">{num(rows.length)} SKUs</span>
              </div>
            </div>
          </div>

          {/* Expiring Soon (derived from rows) */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Expiring Soon</h3>
              <button onClick={() => { setActiveTab("Expiring Soon"); scrollToTable(); }} className="text-[12px] text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {computed.expiringRows.map((r) => (
                <button key={r.sku} onClick={() => setViewing(r)} className="w-full flex items-center gap-3 text-left hover:bg-[#F8FAFC] rounded-lg -mx-1 px-1 py-0.5">
                  <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#1E293B] truncate">{r.product}</p>
                    <p className="text-[11px] text-[#94A3B8]">{r.wh} - expiring soon</p>
                  </div>
                  <span className="text-[11px] font-medium text-[#F59E0B] shrink-0">{num(r.onHand)} units</span>
                </button>
              ))}
              {computed.expiringRows.length === 0 && (
                <p className="text-[12px] text-[#94A3B8]">No items expiring soon.</p>
              )}
            </div>
            <button onClick={() => { setActiveTab("Expiring Soon"); scrollToTable(); }} className="w-full mt-3 text-[12px] text-[#3B82F6] border border-[#E2E8F0] rounded-lg py-2 hover:bg-[#F8FAFC]">View all expiring items</button>
          </div>

          {/* Recent Activity */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Recent Activity</h3>
              <button onClick={() => setLogExpanded((v) => !v)} className="text-[12px] text-[#3B82F6] hover:underline">{logExpanded ? "Show less" : "View all"}</button>
            </div>
            <div className="space-y-3">
              {visibleLog.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.dot }} />
                  <div>
                    <p className="text-[12px] text-[#1E293B]">{a.text}</p>
                    <p className="text-[11px] text-[#94A3B8]">{a.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Adjust stock modal */}
      <Modal
        open={!!adjusting}
        onClose={() => setAdjusting(null)}
        title={adjusting ? `Adjust ${adjusting.sku}` : "Adjust stock"}
        description="Set the on-hand quantity for this SKU."
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setAdjusting(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveAdjust}>Save adjustment</PrimaryButton>
          </>
        }
      >
        <Field label="On-hand quantity" hint={adjusting ? `Reserved: ${num(adjusting.reserved)} units` : undefined}>
          <NumberInput value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} min="0" />
        </Field>
      </Modal>

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.sku}` : "Add Item"}
        description={editing ? "Update the inventory item details." : "Add a new SKU to your inventory."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveItem}>{editing ? "Save changes" : "Add item"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Product name" required><TextInput value={draft.product} onChange={(e) => setDraft((d) => ({ ...d, product: e.target.value }))} placeholder="Wireless Headphones" /></Field></div>
          <Field label="SKU" required><TextInput value={draft.sku} onChange={(e) => setDraft((d) => ({ ...d, sku: e.target.value }))} placeholder="ELEC-1001" /></Field>
          <Field label="Category"><Select options={CATEGORIES} value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} /></Field>
          <Field label="Warehouse"><Select options={WAREHOUSES} value={draft.wh} onChange={(e) => setDraft((d) => ({ ...d, wh: e.target.value }))} /></Field>
          <Field label="Unit cost (USD)"><NumberInput value={draft.unitCost} onChange={(e) => setDraft((d) => ({ ...d, unitCost: e.target.value }))} placeholder="0.00" step="0.01" min="0" /></Field>
          <Field label="On hand" required><NumberInput value={draft.onHand} onChange={(e) => setDraft((d) => ({ ...d, onHand: e.target.value }))} placeholder="0" min="0" /></Field>
          <Field label="Reserved"><NumberInput value={draft.reserved} onChange={(e) => setDraft((d) => ({ ...d, reserved: e.target.value }))} placeholder="0" min="0" /></Field>
        </div>
      </Modal>

      {/* Detail drawer */}
      <Drawer
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.product ?? ""}
        subtitle={viewing ? `SKU ${viewing.sku}` : undefined}
        footer={
          viewing && (
            <>
              <SecondaryButton onClick={() => openAdjust(viewing)}>Adjust stock</SecondaryButton>
              <SecondaryButton onClick={() => openEdit(viewing)}>Edit item</SecondaryButton>
              <button onClick={() => setDeleting(viewing)} className="px-4 py-2 text-[13px] font-medium text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-lg transition-colors">Delete</button>
            </>
          )
        }
      >
        {viewing && (
          <>
            <div className="space-y-0">
              <DrawerRow label="Status"><StatusBadge status={viewing.status} /></DrawerRow>
              <DrawerRow label="Product">{viewing.product}</DrawerRow>
              <DrawerRow label="Category">{viewing.category}</DrawerRow>
              <DrawerRow label="SKU"><span className="font-mono">{viewing.sku}</span></DrawerRow>
              <DrawerRow label="Warehouse">{viewing.wh}</DrawerRow>
              <DrawerRow label="On hand">{num(viewing.onHand)} units</DrawerRow>
              <DrawerRow label="Reserved">{num(viewing.reserved)} units</DrawerRow>
              <DrawerRow label="Available">{num(Math.max(0, viewing.onHand - viewing.reserved))} units</DrawerRow>
              <DrawerRow label="Unit cost">${viewing.unitCost.toFixed(2)}</DrawerRow>
              <DrawerRow label="Stock value">${num(Math.round(viewing.onHand * viewing.unitCost))}</DrawerRow>
              <DrawerRow label="Expiring soon">{viewing.expiring ? "Yes" : "No"}</DrawerRow>
              <DrawerRow label="Last updated">{fmtDate(viewing.updated)}</DrawerRow>
            </div>
            <DrawerSection title="Availability">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#F1F5F9] rounded-full h-2">
                  <div className="h-2 rounded-full bg-[#3B82F6]" style={{ width: `${viewing.onHand > 0 ? Math.round(((viewing.onHand - viewing.reserved) / viewing.onHand) * 100) : 0}%` }} />
                </div>
                <span className="text-[12px] text-[#64748B]">{viewing.onHand > 0 ? Math.round(((viewing.onHand - viewing.reserved) / viewing.onHand) * 100) : 0}% available</span>
              </div>
            </DrawerSection>
          </>
        )}
      </Drawer>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete inventory item"
        message={`Are you sure you want to delete ${deleting?.sku}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        open={bulkDeleting}
        onClose={() => setBulkDeleting(false)}
        onConfirm={bulkDelete}
        title="Delete selected items"
        message={`Are you sure you want to delete ${selected.size} item${selected.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel={`Delete ${selected.size}`}
        destructive
      />
    </div>
  );
}
