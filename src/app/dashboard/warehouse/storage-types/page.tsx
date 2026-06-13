"use client";

import { useMemo, useState } from "react";
import {
  Boxes, CheckCircle2, Gauge, AlertTriangle, XCircle,
  Search, Columns3, Plus, Download, ChevronDown, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Eye, Power, Pencil,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { Drawer, DrawerRow, DrawerSection } from "@/components/dashboard/Drawer";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, TextArea, Select } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";

/* stats and sidebar widgets are now computed from rows via useMemo */

type Status = "Active" | "Inactive";
type Row = { code: string; name: string; desc: string; suit: string; util: number; status: Status };

const initialRows: Row[] = [
  { code: "BIN", name: "Bin Location", desc: "Small item storage for fast picks", suit: "Small Items", util: 82, status: "Active" },
  { code: "SHELF", name: "Shelf Storage", desc: "General items on shelves", suit: "General", util: 74, status: "Active" },
  { code: "RACK", name: "Pallet Rack", desc: "Pallets on rack systems", suit: "Pallets", util: 68, status: "Active" },
  { code: "BULK", name: "Bulk Storage", desc: "Bulk items on floor", suit: "Bulk", util: 61, status: "Active" },
  { code: "CAGE", name: "Cage Storage", desc: "Items in security cages", suit: "High Value", util: 55, status: "Active" },
  { code: "COOL", name: "Cold Storage", desc: "Temperature controlled (2-8°C)", suit: "Perishables", util: 90, status: "Active" },
  { code: "FRZ", name: "Frozen Storage", desc: "Frozen goods (-18°C and below)", suit: "Frozen", util: 76, status: "Active" },
  { code: "HAZ", name: "Hazardous Storage", desc: "Hazardous material storage", suit: "Regulated", util: 43, status: "Active" },
];

const SUITABLE = ["Small Items", "General", "Pallets", "Bulk", "High Value", "Perishables", "Frozen", "Regulated"];
const STATUSES: Status[] = ["Active", "Inactive"];

const byCategory = [
  { name: "Standard", color: "var(--color-action-blue)" },
  { name: "Specialized", color: "var(--color-teal)" },
  { name: "Temperature Controlled", color: "#7C6FF6" },
  { name: "Security / Restricted", color: "#F59E0B" },
];

const activity = [
  { text: 'Storage type "Pick Zone" updated', info: "Configuration changed", time: "2h ago", color: "var(--color-teal)" },
  { text: 'New storage type "Mezzanine" added', info: "Created by Admin", time: "5h ago", color: "var(--color-action-blue)" },
];

/* utilBands computed dynamically */

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
          <div className="absolute right-0 mt-1 z-20 w-52 bg-white rounded-lg border border-border-soft shadow-lg py-1 max-h-64 overflow-auto">
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

type Draft = { code: string; name: string; desc: string; suit: string };
const emptyDraft: Draft = { code: "", name: "", desc: "", suit: "General" };

export default function StorageTypesPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [query, setQueryState] = useState("");
  const [suitFilter, setSuitFilterState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const setQuery = (v: string) => { setQueryState(v); setPage(1); };
  const setSuitFilter = (v: string) => { setSuitFilterState(v); setPage(1); };
  const setStatusFilter = (v: string) => { setStatusFilterState(v); setPage(1); };

  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [deactivating, setDeactivating] = useState<Row | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [drawerRow, setDrawerRow] = useState<Row | null>(null);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(emptyDraft);

  /* ---- Computed stats from rows ---- */
  const stats = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => r.status === "Active").length;
    const inactive = rows.filter((r) => r.status === "Inactive").length;
    const avgUtil = total > 0 ? rows.reduce((s, r) => s + r.util, 0) / total : 0;
    const lowUtilCount = rows.filter((r) => r.util < 40).length;
    return [
      { title: "Total Storage Types", value: String(total), sub: undefined as string | undefined, change: "+12.5%", note: "vs last 30 days", positive: true, icon: Boxes, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
      { title: "Active Storage Types", value: String(active), sub: total > 0 ? `${((active / total) * 100).toFixed(1)}% of total` : undefined, change: "+7.1%", note: "vs last 30 days", positive: true, icon: CheckCircle2, iconBg: "bg-teal/10", iconColor: "text-teal" },
      { title: "Avg Utilization", value: `${avgUtil.toFixed(1)}%`, sub: undefined, change: "+5.6%", note: "vs last 30 days", positive: true, icon: Gauge, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
      { title: "Low Utilization", value: String(lowUtilCount), sub: undefined, change: "-13.3%", note: "vs last 30 days", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
      { title: "Inactive Storage Types", value: String(inactive), sub: undefined, change: "-15.0%", note: "vs last 30 days", positive: false, icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
    ];
  }, [rows]);

  /* ---- Sidebar: Utilization bands from rows ---- */
  const utilBands = useMemo(() => {
    const total = rows.length || 1;
    const hi = rows.filter((r) => r.util >= 80).length;
    const mid = rows.filter((r) => r.util >= 50 && r.util < 80).length;
    const lo = rows.filter((r) => r.util >= 20 && r.util < 50).length;
    const vl = rows.filter((r) => r.util < 20).length;
    return [
      { label: "80 - 100%", color: "var(--color-teal)", count: `${hi} (${((hi / total) * 100).toFixed(1)}%)` },
      { label: "50 - 79%", color: "var(--color-action-blue)", count: `${mid} (${((mid / total) * 100).toFixed(1)}%)` },
      { label: "20 - 49%", color: "#F59E0B", count: `${lo} (${((lo / total) * 100).toFixed(1)}%)` },
      { label: "0 - 19%", color: "#EF4444", count: `${vl} (${((vl / total) * 100).toFixed(1)}%)` },
    ];
  }, [rows]);

  /* ---- Sidebar: Average util for donut center ---- */
  const avgUtil = useMemo(() => {
    const total = rows.length;
    return total > 0 ? rows.reduce((s, r) => s + r.util, 0) / total : 0;
  }, [rows]);

  /* ---- Sidebar: byCategory from rows ---- */
  const byCategoryDynamic = useMemo(() => {
    const catMap: Record<string, string[]> = {
      Standard: ["Small Items", "General"],
      Specialized: ["Pallets", "Bulk"],
      "Temperature Controlled": ["Perishables", "Frozen"],
      "Security / Restricted": ["High Value", "Regulated"],
    };
    return byCategory.map((c) => {
      const count = rows.filter((r) => catMap[c.name]?.includes(r.suit)).length;
      const total = rows.length || 1;
      return { ...c, count: String(count), pct: `(${((count / total) * 100).toFixed(1)}%)` };
    });
  }, [rows]);

  /* ---- Sidebar: Low utilization from rows ---- */
  const lowUtilDynamic = useMemo(() => {
    return rows.filter((r) => r.util < 40).map((r) => ({ code: r.code, name: r.name, util: `${r.util}%` }));
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const suit = !suitFilter || r.suit === suitFilter;
      const st = !statusFilter || r.status === statusFilter;
      const search = !q || r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
      return suit && st && search;
    });
  }, [rows, suitFilter, statusFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function handleExport() {
    exportToCsv("storage-types", filtered, [
      { key: "code", header: "Code" }, { key: "name", header: "Name" }, { key: "desc", header: "Description" },
      { key: "suit", header: "Suitable For" }, { key: "util", header: "Utilization %" }, { key: "status", header: "Status" },
    ]);
    toast(`Exported ${filtered.length} storage types to CSV`);
  }

  function createType() {
    if (!draft.code.trim()) { toast("Code is required", "error"); return; }
    if (!draft.name.trim()) { toast("Name is required", "error"); return; }
    if (rows.some((r) => r.code.toUpperCase() === draft.code.trim().toUpperCase())) { toast("Code already exists", "error"); return; }
    setBusy(true);
    const newRow: Row = {
      code: draft.code.trim().toUpperCase(), name: draft.name.trim(),
      desc: draft.desc.trim() || "—", suit: draft.suit, util: 0, status: "Active",
    };
    setRows((prev) => [newRow, ...prev]);
    setBusy(false);
    setFormOpen(false);
    setDraft(emptyDraft);
    toast(`Storage type ${newRow.code} added`);
  }

  function setStatus(code: string, status: Status, msg: string) {
    setRows((prev) => prev.map((r) => (r.code === code ? { ...r, status } : r)));
    setMenuFor(null);
    toast(msg);
  }

  function openDetails(r: Row) {
    setDrawerRow(r);
    setMenuFor(null);
  }

  function openEdit(r: Row) {
    setEditRow(r);
    setEditDraft({ code: r.code, name: r.name, desc: r.desc, suit: r.suit });
    setMenuFor(null);
  }

  function saveEdit() {
    if (!editRow) return;
    if (!editDraft.name.trim()) { toast("Name is required", "error"); return; }
    setRows((prev) => prev.map((r) =>
      r.code === editRow.code ? { ...r, name: editDraft.name.trim(), desc: editDraft.desc.trim() || "—", suit: editDraft.suit } : r
    ));
    setEditRow(null);
    setEditDraft(emptyDraft);
    toast(`${editRow.code} updated`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Storage shelving illustration */}
          <svg width="84" height="64" viewBox="0 0 84 64" className="shrink-0" aria-hidden="true">
            <rect x="4" y="6" width="76" height="52" rx="3" fill="var(--color-soft-bg)" stroke="var(--color-border-soft)" strokeWidth="2" />
            <line x1="4" y1="24" x2="80" y2="24" stroke="var(--color-border-soft)" strokeWidth="2" />
            <line x1="4" y1="41" x2="80" y2="41" stroke="var(--color-border-soft)" strokeWidth="2" />
            <line x1="29" y1="6" x2="29" y2="58" stroke="var(--color-border-soft)" strokeWidth="2" />
            <line x1="55" y1="6" x2="55" y2="58" stroke="var(--color-border-soft)" strokeWidth="2" />
            <rect x="9" y="12" width="14" height="9" rx="1.5" fill="var(--color-action-blue)" />
            <rect x="35" y="13" width="13" height="8" rx="1.5" fill="var(--color-teal)" />
            <rect x="61" y="11" width="13" height="10" rx="1.5" fill="#F59E0B" />
            <rect x="10" y="30" width="12" height="8" rx="1.5" fill="#7C6FF6" />
            <rect x="36" y="29" width="14" height="9" rx="1.5" fill="var(--color-action-blue)" />
            <rect x="62" y="30" width="12" height="8" rx="1.5" fill="var(--color-teal)" />
            <rect x="9" y="46" width="14" height="9" rx="1.5" fill="var(--color-teal)" />
            <rect x="36" y="47" width="12" height="8" rx="1.5" fill="#F59E0B" />
            <rect x="60" y="46" width="14" height="9" rx="1.5" fill="var(--color-action-blue)" />
          </svg>
          <div>
            <h1 className="text-[24px] font-bold text-text-primary">Storage Types</h1>
            <p className="text-[14px] text-text-muted mt-1">Manage storage types to optimize space, organization, and handling.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Dropdown label="Filters" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} shadow />
          <button onClick={handleExport} className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Columns3 className="w-4 h-4" /> Export</button>
          <button onClick={() => { setDraft(emptyDraft); setFormOpen(true); }} className="flex items-center gap-2 text-[13px] font-medium text-white bg-action-blue rounded-lg px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#004BBF]"><Plus className="w-4 h-4" /> Add Storage Type</button>
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
              <p className="text-[24px] font-bold text-text-primary mt-0.5">{s.value}</p>
              {s.sub && <p className="text-[12px] text-text-light mt-0.5">{s.sub}</p>}
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
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-text-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by storage type name or code..." className="w-full text-[13px] text-text-primary placeholder:text-text-light bg-white border border-border-soft rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
            </div>
            <Dropdown label="All Suitable For" value={suitFilter} options={SUITABLE} onSelect={setSuitFilter} />
            <Dropdown label="All Statuses" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} />
            <button onClick={handleExport} className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg"><Download className="w-4 h-4" /> Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-soft-bg border-b border-border-soft">
                <th className={thCls}>Storage Type Code</th><th className={thCls}>Storage Type Name</th><th className={thCls}>Description</th>
                <th className={thCls}>Suitable For</th><th className={thCls}>Utilization</th><th className={thCls}>Status</th>
                <th className={thCls + " text-right"}>Actions</th>
              </tr></thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr key={r.code} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-6 py-4 text-[13px] font-medium text-action-blue font-mono">{r.code}</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-text-primary">{r.name}</td>
                    <td className="px-6 py-4 text-[13px] text-text-muted">{r.desc}</td>
                    <td className="px-6 py-4 text-[13px] text-text-muted">{r.suit}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-border-blue rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${r.util}%`, backgroundColor: r.util >= 80 ? "var(--color-teal)" : r.util >= 50 ? "var(--color-action-blue)" : "#F59E0B" }} /></div>
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
                              <button onClick={() => openDetails(r)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg"><Eye className="w-3.5 h-3.5" /> View details</button>
                              <button onClick={() => openEdit(r)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg"><Pencil className="w-3.5 h-3.5" /> Edit</button>
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
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-[13px] text-text-muted">No storage types match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-soft">
            <span className="text-[13px] text-text-muted">{filtered.length === 0 ? "Showing 0 storage types" : `Showing ${start + 1}-${Math.min(start + pageSize, filtered.length)} of ${filtered.length} storage types`}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${p === currentPage ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-soft-bg"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Utilization Overview donut */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Utilization Overview</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                  {(() => { let off = 0; const segs: [string, number][] = [["var(--color-teal)", 44.4], ["var(--color-action-blue)", 33.3], ["#F59E0B", 11.1], ["#EF4444", 11.1]]; return segs.map(([c, p], i) => {
                    const da = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                    const el = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                    off += p; return el;
                  }); })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-[17px] font-bold text-text-primary leading-none">{avgUtil.toFixed(1)}%</p><p className="text-[10px] text-text-light mt-0.5">Average</p></div></div>
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

          {/* Storage Types by Category */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Storage Types by Category</h3>
            <div className="space-y-2.5">
              {byCategoryDynamic.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} /><span className="text-text-muted">{c.name}</span></div>
                  <div className="flex items-center gap-3"><span className="font-medium text-text-primary">{c.count}</span><span className="text-text-light w-12 text-right">{c.pct}</span></div>
                </div>
              ))}
              <div className="flex items-center justify-between text-[12px] pt-2 border-t border-border-soft"><span className="font-semibold text-text-primary">Total</span><span className="font-semibold text-text-primary">{rows.length}</span></div>
            </div>
          </div>

          {/* Low Utilization Storage Types */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Low Utilization Storage Types</h3><button onClick={() => toast("Showing all low-utilization types", "info")} className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {lowUtilDynamic.length === 0 && <p className="text-[12px] text-text-muted">No low-utilization types.</p>}
              {lowUtilDynamic.map((l) => (
                <div key={l.code} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-soft-bg flex items-center justify-center shrink-0"><Gauge className="w-4 h-4 text-[#F59E0B]" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-text-primary truncate">{l.name}</p><p className="text-[11px] text-text-light font-mono">{l.code}</p></div>
                  <span className="text-[11px] font-medium text-[#F59E0B] shrink-0">{l.util}</span>
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

      {/* Add Storage Type modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Add Storage Type"
        description="Define a new storage type for your warehouses."
        footer={
          <>
            <button onClick={() => setFormOpen(false)} className="px-4 py-2 text-[13px] font-medium text-text-primary bg-white border border-border-soft rounded-lg hover:bg-soft-bg">Cancel</button>
            <button onClick={createType} disabled={busy} className="px-4 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-[#004BBF] disabled:opacity-60">{busy ? "Adding…" : "Add storage type"}</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Code" required><TextInput value={draft.code} onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))} placeholder="MEZZ" /></Field>
          <Field label="Suitable for"><Select options={SUITABLE} value={draft.suit} onChange={(e) => setDraft((d) => ({ ...d, suit: e.target.value }))} /></Field>
          <div className="col-span-2"><Field label="Name" required><TextInput value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Mezzanine Storage" /></Field></div>
          <div className="col-span-2"><Field label="Description"><TextArea value={draft.desc} onChange={(e) => setDraft((d) => ({ ...d, desc: e.target.value }))} placeholder="Elevated platform storage for overflow stock" /></Field></div>
        </div>
      </Modal>

      {/* Edit Storage Type modal */}
      <Modal
        open={!!editRow}
        onClose={() => { setEditRow(null); setEditDraft(emptyDraft); }}
        title="Edit Storage Type"
        description={`Editing ${editRow?.code}`}
        footer={
          <>
            <button onClick={() => { setEditRow(null); setEditDraft(emptyDraft); }} className="px-4 py-2 text-[13px] font-medium text-text-primary bg-white border border-border-soft rounded-lg hover:bg-soft-bg">Cancel</button>
            <button onClick={saveEdit} className="px-4 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-[#004BBF]">Save changes</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Code" hint="Cannot be changed"><TextInput value={editDraft.code} readOnly className="bg-[#F9FAFB] text-text-light cursor-not-allowed" /></Field>
          <Field label="Suitable for"><Select options={SUITABLE} value={editDraft.suit} onChange={(e) => setEditDraft((d) => ({ ...d, suit: e.target.value }))} /></Field>
          <div className="col-span-2"><Field label="Name" required><TextInput value={editDraft.name} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Storage type name" /></Field></div>
          <div className="col-span-2"><Field label="Description"><TextArea value={editDraft.desc} onChange={(e) => setEditDraft((d) => ({ ...d, desc: e.target.value }))} placeholder="Description" /></Field></div>
        </div>
      </Modal>

      {/* Detail drawer */}
      <Drawer
        open={!!drawerRow}
        onClose={() => setDrawerRow(null)}
        title={drawerRow?.name ?? "Storage Type"}
        subtitle={drawerRow?.code}
        footer={
          <>
            <button onClick={() => { if (drawerRow) { openEdit(drawerRow); setDrawerRow(null); } }} className="px-4 py-2 text-[13px] font-medium text-action-blue bg-action-blue/10 rounded-lg hover:bg-action-blue/20">Edit</button>
            <button onClick={() => setDrawerRow(null)} className="px-4 py-2 text-[13px] font-medium text-text-primary bg-white border border-border-soft rounded-lg hover:bg-soft-bg">Close</button>
          </>
        }
      >
        {drawerRow && (
          <>
            <DrawerSection title="General">
              <DrawerRow label="Code"><span className="font-mono">{drawerRow.code}</span></DrawerRow>
              <DrawerRow label="Name">{drawerRow.name}</DrawerRow>
              <DrawerRow label="Description">{drawerRow.desc}</DrawerRow>
              <DrawerRow label="Suitable For">{drawerRow.suit}</DrawerRow>
            </DrawerSection>

            <DrawerSection title="Utilization">
              <DrawerRow label="Current">
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-border-blue rounded-full h-2">
                    <div className="h-2 rounded-full" style={{
                      width: `${drawerRow.util}%`,
                      backgroundColor: drawerRow.util >= 80 ? "var(--color-teal)" : drawerRow.util >= 50 ? "var(--color-action-blue)" : drawerRow.util >= 40 ? "#F59E0B" : "#EF4444",
                    }} />
                  </div>
                  <span className="text-[13px] font-medium">{drawerRow.util}%</span>
                </div>
              </DrawerRow>
              <DrawerRow label="Status">
                <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${drawerRow.status === "Active" ? "bg-teal/10 text-teal" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>{drawerRow.status}</span>
              </DrawerRow>
            </DrawerSection>

            <DrawerSection title="Recent Activity">
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "var(--color-teal)" }} />
                  <div className="flex-1">
                    <p className="text-[12px] text-text-primary">Utilization updated to {drawerRow.util}%</p>
                    <p className="text-[11px] text-text-light">System • 1h ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "var(--color-action-blue)" }} />
                  <div className="flex-1">
                    <p className="text-[12px] text-text-primary">Configuration modified</p>
                    <p className="text-[11px] text-text-light">Admin • 3h ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "#F59E0B" }} />
                  <div className="flex-1">
                    <p className="text-[12px] text-text-primary">Status changed to {drawerRow.status}</p>
                    <p className="text-[11px] text-text-light">Admin • 2d ago</p>
                  </div>
                </div>
              </div>
            </DrawerSection>
          </>
        )}
      </Drawer>

      {/* Deactivate confirm */}
      <ConfirmDialog
        open={!!deactivating}
        onClose={() => setDeactivating(null)}
        onConfirm={() => { if (deactivating) { setStatus(deactivating.code, "Inactive", `${deactivating.code} deactivated`); setDeactivating(null); } }}
        title="Deactivate storage type"
        message={`Are you sure you want to deactivate ${deactivating?.code}?`}
        confirmLabel="Deactivate"
        cancelLabel="Keep active"
        destructive
      />
    </div>
  );
}
