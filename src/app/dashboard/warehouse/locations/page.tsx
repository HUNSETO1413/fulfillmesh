"use client";

import { useMemo, useRef, useState } from "react";
import {
  MapPin, CheckCircle2, Boxes, AlertTriangle, Square,
  Search, Plus, Download, ChevronDown, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Grid3X3, Eye, Power,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";

const stats = [
  { title: "Total Locations", value: "128", change: "+8.0%", note: "vs last 30 days", positive: true, icon: MapPin, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
  { title: "Active Locations", value: "112", sub: "87.5% of total", change: "+6.3%", note: "vs last 30 days", positive: true, icon: CheckCircle2, iconBg: "bg-teal/10", iconColor: "text-teal" },
  { title: "Bin Locations", value: "1,842", change: "+12.1%", note: "vs last 30 days", positive: true, icon: Boxes, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Low Stock Locations", value: "7", change: "-12.5%", note: "vs last 30 days", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Empty Locations", value: "9", change: "-16.2%", note: "vs last 30 days", positive: false, icon: Square, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

type Status = "Active" | "Inactive";
type Row = {
  code: string; name: string; wh: string; whSub: string;
  type: string; typeColor: string; cap: string; capSub: string; util: number; status: Status;
};

const initialRows: Row[] = [
  { code: "ATL1-A01-01", name: "Receiving Area", wh: "ATL-1", whSub: "Atlanta, GA", type: "Zone", typeColor: "var(--color-action-blue)", cap: "5,000", capSub: "cubic ft", util: 42, status: "Active" },
  { code: "ATL1-B02-05", name: "Pick Zone B02", wh: "ATL-1", whSub: "Atlanta, GA", type: "Pick Zone", typeColor: "var(--color-teal)", cap: "1,200", capSub: "cubic ft", util: 78, status: "Active" },
  { code: "ATL1-B02-06", name: "Pick Zone B02-06", wh: "ATL-1", whSub: "Atlanta, GA", type: "Bin", typeColor: "#7C6FF6", cap: "300", capSub: "cubic ft", util: 65, status: "Active" },
  { code: "LAX1-C03-01", name: "Reserve Storage", wh: "LAX-1", whSub: "Los Angeles, CA", type: "Reserve", typeColor: "#F59E0B", cap: "8,000", capSub: "cubic ft", util: 91, status: "Active" },
  { code: "LAX1-D04-12", name: "Bulk Storage D04", wh: "LAX-1", whSub: "Los Angeles, CA", type: "Bulk", typeColor: "#EF4444", cap: "20,000", capSub: "cubic ft", util: 56, status: "Active" },
  { code: "DFW1-A01-01", name: "Receiving Area", wh: "DFW-1", whSub: "Dallas, TX", type: "Zone", typeColor: "var(--color-action-blue)", cap: "5,000", capSub: "cubic ft", util: 33, status: "Active" },
];

const WAREHOUSES = ["ATL-1", "LAX-1", "DFW-1", "MIA-1", "ORD-1"];
const WH_CITY: Record<string, string> = { "ATL-1": "Atlanta, GA", "LAX-1": "Los Angeles, CA", "DFW-1": "Dallas, TX", "MIA-1": "Miami, FL", "ORD-1": "Chicago, IL" };
const TYPES = ["Zone", "Pick Zone", "Bin", "Reserve", "Bulk", "Special"];
const TYPE_COLOR: Record<string, string> = {
  Zone: "var(--color-action-blue)", "Pick Zone": "var(--color-teal)", Bin: "#7C6FF6",
  Reserve: "#F59E0B", Bulk: "#EF4444", Special: "#EC4899",
};
const STATUSES: Status[] = ["Active", "Inactive"];

const byType = [
  { name: "Pick Zone", count: "54", color: "var(--color-teal)" },
  { name: "Bin", count: "62", color: "var(--color-action-blue)" },
  { name: "Zone", count: "18", color: "#F59E0B" },
  { name: "Bulk", count: "10", color: "#7C6FF6" },
  { name: "Reserve", count: "8", color: "#EF4444" },
  { name: "Special", count: "6", color: "#EC4899" },
];

const lowStock = [
  { code: "ATL1-D04-12", name: "Bulk Storage D04", skus: "12 SKUs" },
  { code: "DFW1-B05-03", name: "Pick Zone B05", skus: "8 SKUs" },
  { code: "LAX1-D07-08", name: "Pick Zone D07", skus: "6 SKUs" },
  { code: "ORD1-C03-01", name: "High Value Storage", skus: "5 SKUs" },
];

const activity = [
  { text: "Location ATL1-B02-06 updated", info: "Capacity changed to 500 cubic ft", time: "2h ago", color: "var(--color-action-blue)" },
  { text: "New location MIA1-D05-02 added", info: "Pick Zone created", time: "5h ago", color: "var(--color-teal)" },
];

const utilBands = [
  { label: "0 - 50%", color: "var(--color-teal)", count: "46 (35.2%)" },
  { label: "50 - 75%", color: "var(--color-action-blue)", count: "53 (41.4%)" },
  { label: "75 - 90%", color: "#F59E0B", count: "18 (14.1%)" },
  { label: "90 - 100%", color: "#EF4444", count: "11 (8.6%)" },
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

type Draft = { name: string; wh: string; type: string; cap: string };
const emptyDraft: Draft = { name: "", wh: "ATL-1", type: "Bin", cap: "" };

export default function WarehouseLocationsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>(initialRows);
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

  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [deactivating, setDeactivating] = useState<Row | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function handleExport() {
    exportToCsv("warehouse-locations", filtered, [
      { key: "code", header: "Location Code" }, { key: "name", header: "Location Name" },
      { key: "wh", header: "Warehouse" }, { key: "whSub", header: "City" },
      { key: "type", header: "Type" }, { key: "cap", header: "Capacity" },
      { key: "util", header: "Utilization %" }, { key: "status", header: "Status" },
    ]);
    toast(`Exported ${filtered.length} locations to CSV`);
  }

  function createLocation() {
    if (!draft.name.trim()) { toast("Location name is required", "error"); return; }
    if (!draft.cap.trim()) { toast("Capacity is required", "error"); return; }
    setBusy(true);
    const n = ++seq.current;
    const code = `${draft.wh.replace("-", "")}-N${n}`;
    const newRow: Row = {
      code, name: draft.name.trim(), wh: draft.wh, whSub: WH_CITY[draft.wh],
      type: draft.type, typeColor: TYPE_COLOR[draft.type] || "var(--color-action-blue)",
      cap: Number(draft.cap).toLocaleString("en-US"), capSub: "cubic ft", util: 0, status: "Active",
    };
    setRows((prev) => [newRow, ...prev]);
    setBusy(false);
    setFormOpen(false);
    setDraft(emptyDraft);
    toast(`Location ${code} added`);
  }

  function setStatus(code: string, status: Status, msg: string) {
    setRows((prev) => prev.map((r) => (r.code === code ? { ...r, status } : r)));
    setMenuFor(null);
    toast(msg);
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
          <button onClick={() => { setDraft(emptyDraft); setFormOpen(true); }} className="flex items-center gap-2 text-[13px] font-medium text-white bg-action-blue rounded-lg px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#004BBF]"><Plus className="w-4 h-4" /> Add Location</button>
        </div>
      </div>

      {/* Stats */}
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
                <span className="text-[11px] text-text-light">{s.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 2.6fr) minmax(0, 1fr)" }}>
        {/* Main table */}
        <div className={card + " overflow-hidden"}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by location name, code or warehouse..." className="w-full text-[13px] text-text-primary placeholder:text-text-light bg-white border border-border-soft rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
            </div>
            <Dropdown label="All Types" value={typeFilter} options={TYPES} onSelect={setTypeFilter} />
            <Dropdown label="All Statuses" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} />
            <button onClick={handleExport} className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg"><Download className="w-4 h-4" /> Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-soft-bg border-b border-border-soft">
                <th className={thCls}>Location Code</th><th className={thCls}>Location Name</th><th className={thCls}>Warehouse</th>
                <th className={thCls}>Type</th><th className={thCls}>Capacity</th><th className={thCls}>Utilization</th><th className={thCls}>Status</th>
                <th className={thCls + " text-right"}>Actions</th>
              </tr></thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr key={r.code} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-6 py-4 text-[13px] font-medium text-action-blue font-mono">{r.code}</td>
                    <td className="px-6 py-4 text-[13px] text-text-primary">{r.name}</td>
                    <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.wh}</p><p className="text-[11px] text-text-light">{r.whSub}</p></td>
                    <td className="px-6 py-4"><span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: r.typeColor + "1a", color: r.typeColor }}>{r.type}</span></td>
                    <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.cap}</p><p className="text-[11px] text-text-light">{r.capSub}</p></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-border-blue rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${r.util}%`, backgroundColor: r.util >= 90 ? "#EF4444" : r.util >= 75 ? "#F59E0B" : "var(--color-teal)" }} /></div>
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
                              <button onClick={() => { setMenuFor(null); toast(`Viewing ${r.code}`, "info"); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg"><Eye className="w-3.5 h-3.5" /> View details</button>
                              {r.status === "Active" ? (
                                <button onClick={() => { setMenuFor(null); setDeactivating(r); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-soft-bg"><Power className="w-3.5 h-3.5" /> Deactivate</button>
                              ) : (
                                <button onClick={() => setStatus(r.code, "Active", `${r.code} activated`)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-teal hover:bg-soft-bg"><Power className="w-3.5 h-3.5" /> Activate</button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-[13px] text-text-muted">No locations match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-soft">
            <span className="text-[13px] text-text-muted">{filtered.length === 0 ? "Showing 0 locations" : `Showing ${start + 1}-${Math.min(start + pageSize, filtered.length)} of ${filtered.length} locations`}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${p === currentPage ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-soft-bg"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Location Utilization donut */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Location Utilization</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                  {(() => { let off = 0; const segs: [string, number][] = [["var(--color-teal)", 35.2], ["var(--color-action-blue)", 41.4], ["#F59E0B", 14.1], ["#EF4444", 8.6]]; return segs.map(([c, p], i) => {
                    const da = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                    const el = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                    off += p; return el;
                  }); })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-[17px] font-bold text-text-primary leading-none">67%</p><p className="text-[10px] text-text-light mt-0.5">Average</p></div></div>
              </div>
              <div className="flex-1 space-y-2">
                {utilBands.map((b) => (
                  <div key={b.label} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} /><span className="text-text-muted">{b.label}</span></div>
                    <span className="font-medium text-text-primary">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Locations by Type */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Locations by Type</h3>
            <div className="space-y-2.5">
              {byType.map((t) => (
                <button key={t.name} onClick={() => { setTypeFilter(t.name); toast(`Filtered by ${t.name}`, "info"); }} className="w-full flex items-center gap-3 text-left hover:bg-soft-bg rounded-lg -mx-1 px-1 py-0.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-soft-bg"><Grid3X3 className="w-4 h-4 text-text-light" style={{ color: t.color }} /></div>
                  <span className="text-[12px] text-text-muted flex-1">{t.name}</span>
                  <span className="text-[13px] font-semibold text-text-primary">{t.count}</span>
                </button>
              ))}
              <div className="flex items-center justify-between text-[12px] pt-2 border-t border-border-soft"><span className="font-semibold text-text-primary">Total</span><span className="font-semibold text-text-primary">128</span></div>
            </div>
          </div>

          {/* Low Stock Locations */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Low Stock Locations</h3><button onClick={() => toast("Showing all low stock locations", "info")} className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {lowStock.map((l) => (
                <div key={l.code} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0"><AlertTriangle className="w-4 h-4 text-[#EF4444]" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-text-primary font-mono">{l.code}</p><p className="text-[11px] text-text-light">{l.name}</p></div>
                  <span className="text-[11px] font-medium text-[#EF4444] shrink-0">{l.skus}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Recent Activity</h3><button onClick={() => toast("Showing full activity log", "info")} className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.color }} />
                  <div className="flex-1"><p className="text-[12px] text-text-primary">{a.text}</p><p className="text-[11px] text-text-light">{a.info}</p></div>
                  <span className="text-[11px] text-text-light shrink-0">{a.time}</span>
                </div>
              ))}
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
        <button onClick={() => { setDraft(emptyDraft); setFormOpen(true); }} className="flex items-center gap-2 text-[13px] font-medium text-deep-navy bg-white rounded-lg px-4 py-2.5 hover:bg-white/90 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Plus className="w-4 h-4" /> Add Location
        </button>
      </div>

      {/* Add Location modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Add Location"
        description="Create a new warehouse storage location."
        footer={
          <>
            <button onClick={() => setFormOpen(false)} className="px-4 py-2 text-[13px] font-medium text-text-primary bg-white border border-border-soft rounded-lg hover:bg-soft-bg">Cancel</button>
            <button onClick={createLocation} disabled={busy} className="px-4 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-[#004BBF] disabled:opacity-60">{busy ? "Adding…" : "Add location"}</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Location name" required><TextInput value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Pick Zone B05" /></Field></div>
          <Field label="Warehouse"><Select options={WAREHOUSES} value={draft.wh} onChange={(e) => setDraft((d) => ({ ...d, wh: e.target.value }))} /></Field>
          <Field label="Type"><Select options={TYPES} value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))} /></Field>
          <div className="col-span-2"><Field label="Capacity (cubic ft)" required><NumberInput value={draft.cap} onChange={(e) => setDraft((d) => ({ ...d, cap: e.target.value }))} placeholder="1200" min="0" /></Field></div>
        </div>
      </Modal>

      {/* Deactivate confirm */}
      <ConfirmDialog
        open={!!deactivating}
        onClose={() => setDeactivating(null)}
        onConfirm={() => { if (deactivating) { setStatus(deactivating.code, "Inactive", `${deactivating.code} deactivated`); setDeactivating(null); } }}
        title="Deactivate location"
        message={`Are you sure you want to deactivate ${deactivating?.code}? It will no longer accept inventory.`}
        confirmLabel="Deactivate"
        cancelLabel="Keep active"
        destructive
      />
    </div>
  );
}
