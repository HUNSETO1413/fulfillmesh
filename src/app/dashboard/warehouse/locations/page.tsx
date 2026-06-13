"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin, CheckCircle2, Boxes, AlertTriangle, Square,
  Search, Plus, Download, ChevronDown, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Grid3X3, Eye, Power, Pencil,
  ChevronUp, ArrowUpDown, Eraser, Trash2,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Drawer, DrawerRow, DrawerSection } from "@/components/dashboard/Drawer";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

type Status = "Active" | "Inactive";
type Row = {
  code: string; name: string; wh: string; whSub: string;
  type: string; cap: number; util: number; status: Status; updated: string;
};

type WarehouseLocation = {
  id?: string;
  code: string;
  name: string;
  warehouse: string;
  type: string;
  capacity: number;
  status: Status;
};

const WAREHOUSES = ["ATL-1", "LAX-1", "DFW-1", "MIA-1", "ORD-1"];
const WH_CITY: Record<string, string> = { "ATL-1": "Atlanta, GA", "LAX-1": "Los Angeles, CA", "DFW-1": "Dallas, TX", "MIA-1": "Miami, FL", "ORD-1": "Chicago, IL" };
const TYPES = ["Zone", "Pick Zone", "Bin", "Reserve", "Bulk", "Special"];
const TYPE_COLOR: Record<string, string> = {
  Zone: "var(--color-action-blue)", "Pick Zone": "var(--color-teal)", Bin: "#7C6FF6",
  Reserve: "#F59E0B", Bulk: "#EF4444", Special: "#EC4899",
};
const STATUSES: Status[] = ["Active", "Inactive"];

const UTIL_BANDS: { label: string; color: string; match: (u: number) => boolean }[] = [
  { label: "0 - 50%", color: "var(--color-teal)", match: (u) => u < 50 },
  { label: "50 - 75%", color: "var(--color-action-blue)", match: (u) => u >= 50 && u < 75 },
  { label: "75 - 90%", color: "#F59E0B", match: (u) => u >= 75 && u < 90 },
  { label: "90 - 100%", color: "#EF4444", match: (u) => u >= 90 },
];

const card = "bg-white rounded-xl border border-border-soft shadow-soft";
const thCls = "text-left text-[11px] font-semibold text-text-light uppercase tracking-[0.05em] px-6 py-3";
const dropBtn = "flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg";

function Dropdown({ label, value, options, onSelect, shadow }: { label: string; value: string; options: string[]; onSelect: (v: string) => void; shadow?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className={`${dropBtn} ${shadow ? "shadow-[0_1px_2px_rgba(0,0,0,0.05)]" : ""} ${value ? "text-action-blue border-action-blue" : ""}`}>
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

type Draft = { name: string; wh: string; type: string; cap: string; util: string };
const emptyDraft: Draft = { name: "", wh: "ATL-1", type: "Bin", cap: "", util: "0" };

type SortKey = "code" | "name" | "wh" | "type" | "cap" | "util" | "status";

const num = (n: number) => n.toLocaleString("en-US");
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const todayIso = () => new Date().toISOString().slice(0, 10);
const utilColor = (u: number) => (u >= 90 ? "#EF4444" : u >= 75 ? "#F59E0B" : "var(--color-teal)");
// "Low stock" locations: active, holding inventory but under-utilized.
const isLowStock = (r: Row) => r.status === "Active" && r.util > 0 && r.util < 50;

export default function WarehouseLocationsPage() {
  const { toast } = useToast();
  const tableRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get<{ data: WarehouseLocation[]; total: number }>("/api/locations");
        if (!alive) return;
        const mapped: Row[] = (res.data ?? []).map((l) => ({
          code: l.code,
          name: l.name,
          wh: l.warehouse,
          whSub: WH_CITY[l.warehouse] ?? l.warehouse,
          type: l.type,
          cap: l.capacity,
          util: l.capacity,
          status: l.status,
          updated: "",
        }));
        setRows(mapped);
      } catch (err) {
        if (alive) toast(`Failed to load locations: ${(err as Error).message}`, "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [query, setQueryState] = useState("");
  const [whFilter, setWhFilterState] = useState("");
  const [typeFilter, setTypeFilterState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const setQuery = (v: string) => { setQueryState(v); setPage(1); };
  const setWhFilter = (v: string) => { setWhFilterState(v); setPage(1); };
  const setTypeFilter = (v: string) => { setTypeFilterState(v); setPage(1); };
  const setStatusFilter = (v: string) => { setStatusFilterState(v); setPage(1); };

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
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
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [deactivating, setDeactivating] = useState<Row | null>(null);
  const [emptying, setEmptying] = useState<Row | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Row | null>(null);
  const seq = useRef(99);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const wh = !whFilter || r.wh === whFilter;
      const type = !typeFilter || r.type === typeFilter;
      const st = !statusFilter || r.status === statusFilter;
      const search = !q || r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.wh.toLowerCase().includes(q);
      return wh && type && st && search;
    });
  }, [rows, whFilter, typeFilter, statusFilter, query]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "cap" || sortKey === "util") { av = a[sortKey]; bv = b[sortKey]; }
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

  const pageIds = pageRows.map((r) => r.code);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const selectedRows = sorted.filter((r) => selected.has(r.code));

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

  // ---- computed stats & widgets (live from rows) ----
  const computed = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => r.status === "Active").length;
    const bins = rows.filter((r) => r.type === "Bin").length;
    const lowStock = rows.filter(isLowStock);
    const empty = rows.filter((r) => r.util === 0).length;
    const avgUtil = total ? Math.round(rows.reduce((s, r) => s + r.util, 0) / total) : 0;
    const bands = UTIL_BANDS.map((b) => {
      const count = rows.filter((r) => b.match(r.util)).length;
      return { ...b, count, pct: total ? ((count / total) * 100).toFixed(1) : "0.0" };
    });
    const byType = TYPES.map((name) => ({
      name, color: TYPE_COLOR[name],
      count: rows.filter((r) => r.type === name).length,
    })).filter((t) => t.count > 0);
    return { total, active, bins, lowStock, empty, avgUtil, bands, byType };
  }, [rows]);

  const stats = [
    { title: "Total Locations", value: num(computed.total), sub: "", change: "+8.0%", positive: true, icon: MapPin, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
    { title: "Active Locations", value: num(computed.active), sub: computed.total ? `${((computed.active / computed.total) * 100).toFixed(1)}% of total` : "", change: "+6.3%", positive: true, icon: CheckCircle2, iconBg: "bg-teal/10", iconColor: "text-teal" },
    { title: "Bin Locations", value: num(computed.bins), sub: "", change: "+12.1%", positive: true, icon: Boxes, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
    { title: "Low Stock Locations", value: num(computed.lowStock.length), sub: "", change: "-12.5%", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
    { title: "Empty Locations", value: num(computed.empty), sub: "", change: "-16.2%", positive: false, icon: Square, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
  ];

  function scrollToTable() {
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleExport() {
    exportToCsv("warehouse-locations", sorted, [
      { key: "code", header: "Location Code" }, { key: "name", header: "Location Name" },
      { key: "wh", header: "Warehouse" }, { key: "whSub", header: "City" },
      { key: "type", header: "Type" }, { key: "cap", header: "Capacity (cubic ft)" },
      { key: "util", header: "Utilization %" }, { key: "status", header: "Status" }, { key: "updated", header: "Last Updated" },
    ]);
    toast(`Exported ${sorted.length} locations to CSV`);
  }

  function exportSelected() {
    exportToCsv("warehouse-locations-selected", selectedRows, [
      { key: "code", header: "Location Code" }, { key: "name", header: "Location Name" }, { key: "wh", header: "Warehouse" },
      { key: "type", header: "Type" }, { key: "cap", header: "Capacity (cubic ft)" }, { key: "util", header: "Utilization %" },
      { key: "status", header: "Status" },
    ]);
    toast(`Exported ${selectedRows.length} selected locations to CSV`);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(r: Row) {
    setEditing(r);
    setDraft({ name: r.name, wh: r.wh, type: r.type, cap: String(r.cap), util: String(r.util) });
    setMenuFor(null);
    setViewing(null);
    setFormOpen(true);
  }

  async function saveLocation() {
    if (!draft.name.trim()) { toast("Location name is required", "error"); return; }
    const cap = Number(draft.cap);
    if (!draft.cap.trim() || Number.isNaN(cap) || cap <= 0) { toast("Capacity must be a number greater than 0", "error"); return; }
    const util = Number(draft.util);
    if (Number.isNaN(util) || util < 0 || util > 100) { toast("Utilization must be between 0 and 100", "error"); return; }
    setBusy(true);
    try {
      if (editing) {
        const patch = {
          name: draft.name.trim(),
          warehouse: draft.wh,
          type: draft.type,
          capacity: cap,
          status: editing.status,
        };
        await api.put(`/api/locations/${editing.code}`, patch);
        setRows((prev) => prev.map((r) => (r.code === editing.code
          ? { ...r, name: draft.name.trim(), wh: draft.wh, whSub: WH_CITY[draft.wh] ?? draft.wh, type: draft.type, cap, util, updated: todayIso() }
          : r)));
        toast(`Location ${editing.code} updated`);
      } else {
        const created = await api.post<WarehouseLocation>("/api/locations", {
          code: draft.name.trim().toUpperCase().replace(/\s+/g, "-").slice(0, 8) || `LOC-${++seq.current}`,
          name: draft.name.trim(),
          warehouse: draft.wh,
          type: draft.type,
          capacity: cap,
          status: "Active" as Status,
        });
        const code = created?.code ?? `LOC-${seq.current}`;
        const newRow: Row = {
          code, name: draft.name.trim(), wh: draft.wh, whSub: WH_CITY[draft.wh] ?? draft.wh,
          type: draft.type, cap, util, status: "Active", updated: todayIso(),
        };
        setRows((prev) => [newRow, ...prev]);
        toast(`Location ${code} added`);
      }
    } catch (err) {
      toast(`Failed to save location: ${(err as Error).message}`, "error");
    } finally {
      setBusy(false);
    }
    setFormOpen(false);
    setDraft(emptyDraft);
  }

  function patchRow(code: string, patch: Partial<Row>, msg: string) {
    const mapped: Partial<WarehouseLocation> = {};
    if (patch.name !== undefined) mapped.name = patch.name;
    if (patch.wh !== undefined) mapped.warehouse = patch.wh;
    if (patch.type !== undefined) mapped.type = patch.type;
    if (patch.cap !== undefined) mapped.capacity = patch.cap;
    if (patch.util !== undefined) mapped.capacity = patch.util;
    if (patch.status !== undefined) mapped.status = patch.status;
    api.put(`/api/locations/${code}`, mapped).catch((err) => toast(`Failed to update: ${(err as Error).message}`, "error"));
    setRows((prev) => prev.map((r) => (r.code === code ? { ...r, ...patch, updated: todayIso() } : r)));
    setViewing((prev) => (prev && prev.code === code ? { ...prev, ...patch, updated: todayIso() } : prev));
    setMenuFor(null);
    toast(msg);
  }

  function bulkSetStatus(status: Status) {
    setRows((prev) => prev.map((r) => (selected.has(r.code) ? { ...r, status, updated: todayIso() } : r)));
    toast(`${status === "Active" ? "Activated" : "Deactivated"} ${selected.size} location${selected.size === 1 ? "" : "s"}`);
    setSelected(new Set());
  }

  function bulkDelete() {
    const codes = Array.from(selected);
    Promise.all(codes.map((code) => api.del(`/api/locations/${code}`)))
      .catch((err) => toast(`Some deletions failed: ${(err as Error).message}`, "error"));
    setRows((prev) => prev.filter((r) => !selected.has(r.code)));
    toast(`Deleted ${selected.size} location${selected.size === 1 ? "" : "s"}`);
    setSelected(new Set());
    setBulkDeleting(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Locations</h1>
          <p className="text-[14px] text-text-muted mt-1">View and manage all warehouse locations and their inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dropdown label="All Warehouses (5)" value={whFilter} options={WAREHOUSES} onSelect={setWhFilter} shadow />
          <Dropdown label="Filters" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} shadow />
          <button onClick={openCreate} className="flex items-center gap-2 text-[13px] font-medium text-white bg-action-blue rounded-lg px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#004BBF]"><Plus className="w-4 h-4" /> Add Location</button>
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
              <p className="text-[24px] font-bold text-text-primary mt-0.5">{s.value}{s.sub && <span className="text-[12px] font-normal text-text-light ml-1">{s.sub}</span>}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Arrow className={`w-3.5 h-3.5 ${s.positive ? "text-teal" : "text-[#EF4444]"}`} />
                <span className={`text-[12px] font-medium ${s.positive ? "text-teal" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-text-light">vs last 30 days</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 2.6fr) minmax(0, 1fr)" }}>
        {/* Main table */}
        <div ref={tableRef} className={card + " overflow-hidden self-start"}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by location name, code or warehouse..." className="w-full text-[13px] text-text-primary placeholder:text-text-light bg-white border border-border-soft rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
            </div>
            <Dropdown label="All Types" value={typeFilter} options={TYPES} onSelect={setTypeFilter} />
            <Dropdown label="All Statuses" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} />
            <button onClick={handleExport} className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg"><Download className="w-4 h-4" /> Export</button>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-[#EFF6FF] border-b border-[#BFDBFE]">
              <span className="text-[13px] font-medium text-[#1D4ED8]">{selected.size} selected</span>
              <div className="flex items-center gap-2">
                <button onClick={exportSelected} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#BFDBFE] rounded-lg text-[13px] text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"><Download className="w-4 h-4" /> Export</button>
                <button onClick={() => bulkSetStatus("Active")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#BFDBFE] rounded-lg text-[13px] text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"><Power className="w-4 h-4" /> Activate</button>
                <button onClick={() => bulkSetStatus("Inactive")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#BFDBFE] rounded-lg text-[13px] text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"><Power className="w-4 h-4" /> Deactivate</button>
                <button onClick={() => setBulkDeleting(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] rounded-lg text-[13px] font-medium text-white transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
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
                <th className={thCls}><button onClick={() => toggleSort("code")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Location Code {sortIcon("code")}</button></th>
                <th className={thCls}><button onClick={() => toggleSort("name")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Location Name {sortIcon("name")}</button></th>
                <th className={thCls}><button onClick={() => toggleSort("wh")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Warehouse {sortIcon("wh")}</button></th>
                <th className={thCls}><button onClick={() => toggleSort("type")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Type {sortIcon("type")}</button></th>
                <th className={thCls}><button onClick={() => toggleSort("cap")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Capacity {sortIcon("cap")}</button></th>
                <th className={thCls}><button onClick={() => toggleSort("util")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Utilization {sortIcon("util")}</button></th>
                <th className={thCls}><button onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 uppercase hover:text-action-blue">Status {sortIcon("status")}</button></th>
                <th className={thCls + " text-right"}>Actions</th>
              </tr></thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr key={r.code} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-4 py-4">
                      <input type="checkbox" checked={selected.has(r.code)} onChange={() => toggleRow(r.code)} aria-label={`Select ${r.code}`} className="w-4 h-4 rounded border-border-soft text-action-blue focus:ring-action-blue cursor-pointer" />
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setViewing(r)} className="text-[13px] font-medium text-action-blue font-mono hover:underline">{r.code}</button>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-text-primary">{r.name}</td>
                    <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.wh}</p><p className="text-[11px] text-text-light">{r.whSub}</p></td>
                    <td className="px-6 py-4"><span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: (TYPE_COLOR[r.type] || "var(--color-action-blue)") + "1a", color: TYPE_COLOR[r.type] || "var(--color-action-blue)" }}>{r.type}</span></td>
                    <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{num(r.cap)}</p><p className="text-[11px] text-text-light">cubic ft</p></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-border-blue rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${r.util}%`, backgroundColor: utilColor(r.util) }} /></div>
                        <span className="text-[11px] text-text-muted">{r.util}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${r.status === "Active" ? "bg-teal/10 text-teal" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>{r.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setMenuFor((v) => (v === r.code ? null : r.code))} className="text-text-light hover:text-text-muted p-1"><MoreHorizontal className="w-4 h-4" /></button>
                        {menuFor === r.code && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                            <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-border-soft shadow-lg py-1 text-left">
                              <button onClick={() => { setMenuFor(null); setViewing(r); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg"><Eye className="w-3.5 h-3.5" /> View details</button>
                              <button onClick={() => openEdit(r)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg"><Pencil className="w-3.5 h-3.5" /> Edit location</button>
                              {r.status === "Active" ? (
                                <button onClick={() => { setMenuFor(null); setDeactivating(r); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-soft-bg"><Power className="w-3.5 h-3.5" /> Deactivate</button>
                              ) : (
                                <button onClick={() => patchRow(r.code, { status: "Active" }, `${r.code} activated`)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-teal hover:bg-soft-bg"><Power className="w-3.5 h-3.5" /> Activate</button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-[13px] text-text-muted">{loading ? "Loading locations…" : "No locations match your filters."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-soft">
            <span className="text-[13px] text-text-muted">{sorted.length === 0 ? "Showing 0 locations" : `Showing ${start + 1}-${Math.min(start + pageSize, sorted.length)} of ${sorted.length} locations`}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${p === currentPage ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-soft-bg"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Location Utilization donut (derived from rows) */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Location Utilization</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                  {(() => {
                    let off = 0;
                    return computed.bands.filter((b) => b.count > 0).map((b) => {
                      const p = computed.total ? (b.count / computed.total) * 100 : 0;
                      const da = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                      const el = <circle key={b.label} cx="50" cy="50" r="40" fill="none" stroke={b.color} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                      off += p;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-[17px] font-bold text-text-primary leading-none">{computed.avgUtil}%</p><p className="text-[10px] text-text-light mt-0.5">Average</p></div></div>
              </div>
              <div className="flex-1 space-y-2">
                {computed.bands.map((b) => (
                  <div key={b.label} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} /><span className="text-text-muted">{b.label}</span></div>
                    <span className="font-medium text-text-primary">{b.count} ({b.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Locations by Type (derived; sets table filter) */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-text-primary">Locations by Type</h3>
              {typeFilter && <button onClick={() => setTypeFilter("")} className="text-[12px] text-action-blue hover:underline">Clear filter</button>}
            </div>
            <div className="space-y-2.5">
              {computed.byType.map((t) => (
                <button key={t.name} onClick={() => { setTypeFilter(t.name); scrollToTable(); }} className={`w-full flex items-center gap-3 text-left hover:bg-soft-bg rounded-lg -mx-1 px-1 py-0.5 ${typeFilter === t.name ? "bg-soft-bg" : ""}`}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-soft-bg"><Grid3X3 className="w-4 h-4" style={{ color: t.color }} /></div>
                  <span className="text-[12px] text-text-muted flex-1">{t.name}</span>
                  <span className="text-[13px] font-semibold text-text-primary">{t.count}</span>
                </button>
              ))}
              <div className="flex items-center justify-between text-[12px] pt-2 border-t border-border-soft"><span className="font-semibold text-text-primary">Total</span><span className="font-semibold text-text-primary">{computed.total}</span></div>
            </div>
          </div>

          {/* Low Stock Locations (derived from rows) */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-text-primary">Low Stock Locations</h3>
              <button onClick={() => { setSortKey("util"); setSortDir("asc"); setStatusFilter("Active"); scrollToTable(); }} className="text-[12px] text-action-blue hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {computed.lowStock.map((l) => (
                <button key={l.code} onClick={() => setViewing(l)} className="w-full flex items-center gap-3 text-left hover:bg-soft-bg rounded-lg -mx-1 px-1 py-0.5">
                  <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0"><AlertTriangle className="w-4 h-4 text-[#EF4444]" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-text-primary font-mono">{l.code}</p><p className="text-[11px] text-text-light">{l.name}</p></div>
                  <span className="text-[11px] font-medium text-[#EF4444] shrink-0">{l.util}% util</span>
                </button>
              ))}
              {computed.lowStock.length === 0 && (
                <p className="text-[12px] text-text-light">No low stock locations right now.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA banner */}
      <div className="rounded-xl bg-deep-navy px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[16px] font-semibold text-white">Organize your warehouse better</h3>
          <p className="text-[13px] text-text-on-dark-muted mt-0.5">Add new locations to improve picking efficiency and inventory accuracy.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 text-[13px] font-medium text-deep-navy bg-white rounded-lg px-4 py-2.5 hover:bg-white/90 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Plus className="w-4 h-4" /> Add Location
        </button>
      </div>

      {/* Add / Edit Location modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.code}` : "Add Location"}
        description={editing ? "Update this storage location." : "Create a new warehouse storage location."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveLocation} disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Add location"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Location name" required><TextInput value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Pick Zone B05" /></Field></div>
          <Field label="Warehouse"><Select options={WAREHOUSES} value={draft.wh} onChange={(e) => setDraft((d) => ({ ...d, wh: e.target.value }))} /></Field>
          <Field label="Type"><Select options={TYPES} value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))} /></Field>
          <Field label="Capacity (cubic ft)" required><NumberInput value={draft.cap} onChange={(e) => setDraft((d) => ({ ...d, cap: e.target.value }))} placeholder="1200" min="1" /></Field>
          <Field label="Utilization (%)" hint="Between 0 and 100"><NumberInput value={draft.util} onChange={(e) => setDraft((d) => ({ ...d, util: e.target.value }))} placeholder="0" min="0" max="100" /></Field>
        </div>
      </Modal>

      {/* Detail drawer */}
      <Drawer
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.code ?? ""}
        subtitle={viewing ? viewing.name : undefined}
        footer={
          viewing && (
            <>
              <button onClick={() => setEmptying(viewing)} className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors"><Eraser className="w-4 h-4" /> Empty location</button>
              <SecondaryButton onClick={() => openEdit(viewing)}>Edit</SecondaryButton>
              {viewing.status === "Active" ? (
                <button onClick={() => setDeactivating(viewing)} className="px-4 py-2 text-[13px] font-medium text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-lg transition-colors">Deactivate</button>
              ) : (
                <PrimaryButton onClick={() => patchRow(viewing.code, { status: "Active" }, `${viewing.code} activated`)}>Activate</PrimaryButton>
              )}
            </>
          )
        }
      >
        {viewing && (
          <>
            <div className="space-y-0">
              <DrawerRow label="Status"><span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${viewing.status === "Active" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>{viewing.status}</span></DrawerRow>
              <DrawerRow label="Location code"><span className="font-mono">{viewing.code}</span></DrawerRow>
              <DrawerRow label="Name">{viewing.name}</DrawerRow>
              <DrawerRow label="Warehouse">{viewing.wh} · {viewing.whSub}</DrawerRow>
              <DrawerRow label="Type">{viewing.type}</DrawerRow>
              <DrawerRow label="Capacity">{num(viewing.cap)} cubic ft</DrawerRow>
              <DrawerRow label="Utilization">{viewing.util}%</DrawerRow>
              <DrawerRow label="Used space">{num(Math.round((viewing.util / 100) * viewing.cap))} cubic ft</DrawerRow>
              <DrawerRow label="Last updated">{fmtDate(viewing.updated)}</DrawerRow>
            </div>
            <DrawerSection title="Capacity usage">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#F1F5F9] rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${viewing.util}%`, backgroundColor: utilColor(viewing.util) }} />
                </div>
                <span className="text-[12px] text-[#64748B]">{viewing.util}% used</span>
              </div>
            </DrawerSection>
          </>
        )}
      </Drawer>

      {/* Deactivate confirm */}
      <ConfirmDialog
        open={!!deactivating}
        onClose={() => setDeactivating(null)}
        onConfirm={() => { if (deactivating) { patchRow(deactivating.code, { status: "Inactive" }, `${deactivating.code} deactivated`); setDeactivating(null); } }}
        title="Deactivate location"
        message={`Are you sure you want to deactivate ${deactivating?.code}? It will no longer accept inventory.`}
        confirmLabel="Deactivate"
        cancelLabel="Keep active"
        destructive
      />

      {/* Empty location confirm */}
      <ConfirmDialog
        open={!!emptying}
        onClose={() => setEmptying(null)}
        onConfirm={() => { if (emptying) { patchRow(emptying.code, { util: 0 }, `${emptying.code} emptied — inventory reassigned`); setEmptying(null); } }}
        title="Empty location"
        message={`Reassign all inventory out of ${emptying?.code} and set its utilization to 0%?`}
        confirmLabel="Empty location"
        cancelLabel="Keep"
        destructive
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        open={bulkDeleting}
        onClose={() => setBulkDeleting(false)}
        onConfirm={bulkDelete}
        title="Delete selected locations"
        message={`Are you sure you want to delete ${selected.size} location${selected.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel={`Delete ${selected.size}`}
        destructive
      />
    </div>
  );
}
