"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardList, CheckCircle2, Activity, CalendarClock, XCircle,
  Search, Columns3, Plus, ChevronDown, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Calendar, Eye, Play, Ban, Pencil,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Drawer, DrawerRow, DrawerSection } from "@/components/dashboard/Drawer";
import { Field, TextInput, Select } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

/* stats are now computed via useMemo from rows state */

const tabs = ["All Cycle Counts", "In Progress", "Scheduled", "Completed", "Cancelled"];

type Status = "Completed" | "In Progress" | "Scheduled" | "Cancelled";
type Row = {
  cc: string; name: string; sub: string; wh: string; whSub: string;
  status: Status; progress: number; start: string; due: string;
};

const WAREHOUSES = ["ATL-1", "DFW-1", "LAX-1", "MIA-1", "ORD-1"];
const WH_CITY: Record<string, string> = { "ATL-1": "Atlanta, GA", "DFW-1": "Dallas, TX", "LAX-1": "Los Angeles, CA", "MIA-1": "Miami, FL", "ORD-1": "Chicago, IL" };
const COUNT_TYPES = ["Routine Cycle Count", "Priority Count", "Category Count", "Full Warehouse Count", "Ad-Hoc Count"];
const STATUSES: Status[] = ["In Progress", "Scheduled", "Completed", "Cancelled"];

const byWh = [
  { wh: "ATL-1 (Atlanta, GA)", acc: "98.6%", change: "+1.8%", up: true },
  { wh: "DFW-1 (Dallas, TX)", acc: "97.9%", change: "+1.2%", up: true },
  { wh: "LAX-1 (Los Angeles, CA)", acc: "98.1%", change: "+0.9%", up: true },
  { wh: "MIA-1 (Miami, FL)", acc: "98.4%", change: "+2.1%", up: true },
  { wh: "ORD-1 (Chicago, IL)", acc: "97.6%", change: "-0.3%", up: false },
];

const upcoming = [
  { d: "02", m: "JUN", name: "Bulk Storage Area", wh: "ORD-1", time: "9:00 AM" },
  { d: "02", m: "JUN", name: "Pharma Zone", wh: "MIA-1", time: "10:00 AM" },
  { d: "03", m: "JUN", name: "FRZ-01 Freezer Zone", wh: "MIA-1", time: "9:00 AM" },
];

function Badge({ text }: { text: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-teal/10 text-teal",
    "In Progress": "bg-[#7C6FF6]/10 text-[#7C6FF6]",
    Scheduled: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
  };
  return <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[text] || "bg-soft-bg text-text-muted"}`}>{text}</span>;
}

function ProgressBar({ value, status }: { value: number; status: string }) {
  const colorMap: Record<string, string> = {
    Completed: "var(--color-teal)",
    "In Progress": "#7C6FF6",
    Scheduled: "#F59E0B",
    Cancelled: "#EF4444",
  };
  const barColor = colorMap[status] || "var(--color-action-blue)";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 bg-border-blue rounded-full h-1.5">
        <div className="h-1.5 rounded-full" style={{ width: `${value}%`, backgroundColor: barColor }} />
      </div>
      <span className="text-[11px] text-text-muted">{value}%</span>
    </div>
  );
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

type Draft = { name: string; type: string; wh: string; start: string; due: string };
const today = new Date().toISOString().slice(0, 10);
const emptyDraft: Draft = { name: "", type: "Routine Cycle Count", wh: "ATL-1", start: today, due: today };

export default function CycleCountPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState("All Cycle Counts");
  const [query, setQueryState] = useState("");
  const [whFilter, setWhFilterState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const setActiveTab = (v: string) => { setActiveTabState(v); setPage(1); };
  const setQuery = (v: string) => { setQueryState(v); setPage(1); };
  const setWhFilter = (v: string) => { setWhFilterState(v); setPage(1); };
  const setStatusFilter = (v: string) => { setStatusFilterState(v); setPage(1); };

  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [cancelling, setCancelling] = useState<Row | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(emptyDraft);
  const [editBusy, setEditBusy] = useState(false);
  const [detailRow, setDetailRow] = useState<Row | null>(null);
  const seq = useRef(124);

  /* ── Load rows from API on mount ── */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get<{ data: Record<string, unknown>[]; total: number }>("/api/cycle-counts");
        if (!alive) return;
        const mapped: Row[] = (res.data || []).map((c) => ({
          cc: String(c.id ?? ""),
          name: String(c.name ?? ""),
          sub: String(c.countType ?? ""),
          wh: String(c.warehouse ?? ""),
          whSub: WH_CITY[String(c.warehouse ?? "")] ?? "",
          status: (c.status as Status) ?? "Scheduled",
          progress: Number(c.progress ?? 0),
          start: fmt(String(c.startDate ?? "")),
          due: fmt(String(c.dueDate ?? "")),
        }));
        setRows(mapped);
      } catch {
        if (alive) toast("Failed to load cycle counts", "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Computed stats derived from rows ── */
  const stats = useMemo(() => {
    const total = rows.length;
    const completed = rows.filter((r) => r.status === "Completed").length;
    const inProgress = rows.filter((r) => r.status === "In Progress").length;
    const scheduled = rows.filter((r) => r.status === "Scheduled").length;
    const cancelled = rows.filter((r) => r.status === "Cancelled").length;
    const pct = (n: number) => total ? ((n / total) * 100).toFixed(1) : "0.0";
    return [
      { title: "Total Cycle Counts", value: String(total), change: "+16.3%", note: "vs last 30 days", positive: true, icon: ClipboardList, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
      { title: "Completed", value: String(completed), sub: `${pct(completed)}%`, change: "+12.7%", note: "vs last 30 days", positive: true, icon: CheckCircle2, iconBg: "bg-teal/10", iconColor: "text-teal" },
      { title: "In Progress", value: String(inProgress), sub: `${pct(inProgress)}%`, change: "+5.9%", note: "vs last 30 days", positive: true, icon: Activity, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
      { title: "Scheduled", value: String(scheduled), sub: `${pct(scheduled)}%`, change: "-14.3%", note: "vs last 30 days", positive: false, icon: CalendarClock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
      { title: "Cancelled", value: String(cancelled), sub: `${pct(cancelled)}%`, change: "-20.0%", note: "vs last 30 days", positive: false, icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
    ];
  }, [rows]);

  /* ── Donut data derived from rows ── */
  const donutSegments = useMemo(() => {
    const total = rows.length;
    const counts: [string, string, number][] = [
      ["Completed", "var(--color-teal)", rows.filter((r) => r.status === "Completed").length],
      ["In Progress", "#7C6FF6", rows.filter((r) => r.status === "In Progress").length],
      ["Scheduled", "#F59E0B", rows.filter((r) => r.status === "Scheduled").length],
      ["Cancelled", "#EF4444", rows.filter((r) => r.status === "Cancelled").length],
    ];
    return counts.map(([label, color, count]) => ({
      label, color, count, pct: total ? ((count / total) * 100).toFixed(1) : "0.0",
    }));
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const tab = activeTab === "All Cycle Counts" || r.status === activeTab;
      const wh = !whFilter || r.wh === whFilter;
      const st = !statusFilter || r.status === statusFilter;
      const search = !q || r.cc.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.wh.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q);
      return tab && wh && st && search;
    });
  }, [rows, activeTab, whFilter, statusFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function fmt(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function handleExport() {
    exportToCsv("cycle-counts", filtered, [
      { key: "cc", header: "Count #" }, { key: "name", header: "Count Name" }, { key: "sub", header: "Type" },
      { key: "wh", header: "Warehouse" }, { key: "whSub", header: "Location" },
      { key: "status", header: "Status" }, { key: "progress", header: "Progress %" },
      { key: "start", header: "Start Date" }, { key: "due", header: "Due Date" },
    ]);
    toast(`Exported ${filtered.length} cycle counts to CSV`);
  }

  async function createCount() {
    if (!draft.name.trim()) { toast("Count name is required", "error"); return; }
    setBusy(true);
    const n = ++seq.current;
    const cc = `CC-000${n}`;
    const payload = {
      id: cc,
      name: draft.name.trim(),
      countType: draft.type,
      warehouse: draft.wh,
      status: "Scheduled" as Status,
      progress: 0,
      startDate: draft.start,
      dueDate: draft.due,
    };
    const newRow: Row = {
      cc, name: draft.name.trim(), sub: draft.type, wh: draft.wh, whSub: WH_CITY[draft.wh],
      status: "Scheduled", progress: 0, start: fmt(draft.start), due: fmt(draft.due),
    };
    setRows((prev) => [newRow, ...prev]);
    try {
      await api.post("/api/cycle-counts", payload);
    } catch {
      toast("Failed to persist cycle count", "error");
    }
    setBusy(false);
    setFormOpen(false);
    setDraft(emptyDraft);
    toast(`Cycle count ${cc} created`);
  }

  function update(cc: string, patch: Partial<Row>, msg: string) {
    setRows((prev) => prev.map((r) => (r.cc === cc ? { ...r, ...patch } : r)));
    setMenuFor(null);
    toast(msg);
    const payload: Record<string, unknown> = {};
    if (patch.status !== undefined) payload.status = patch.status;
    if (patch.progress !== undefined) payload.progress = patch.progress;
    if (patch.name !== undefined) payload.name = patch.name;
    if (patch.sub !== undefined) payload.countType = patch.sub;
    if (patch.wh !== undefined) payload.warehouse = patch.wh;
    if (patch.due !== undefined) payload.dueDate = patch.due;
    api.put("/api/cycle-counts/" + encodeURIComponent(cc), payload).catch(() => {
      toast("Failed to save change", "error");
    });
  }

  function openEdit(r: Row) {
    setEditRow(r);
    setEditDraft({ name: r.name, type: r.sub, wh: r.wh, start: today, due: today });
    setMenuFor(null);
  }

  async function saveEdit() {
    if (!editRow) return;
    if (!editDraft.name.trim()) { toast("Count name is required", "error"); return; }
    setEditBusy(true);
    setRows((prev) => prev.map((r) =>
      r.cc === editRow.cc
        ? { ...r, name: editDraft.name.trim(), sub: editDraft.type, wh: editDraft.wh, whSub: WH_CITY[editDraft.wh], start: fmt(editDraft.start), due: fmt(editDraft.due) }
        : r
    ));
    try {
      await api.put("/api/cycle-counts/" + encodeURIComponent(editRow.cc), {
        name: editDraft.name.trim(),
        countType: editDraft.type,
        warehouse: editDraft.wh,
        dueDate: editDraft.due,
      });
    } catch {
      toast("Failed to save changes", "error");
    }
    setEditBusy(false);
    setEditRow(null);
    toast(`Cycle count ${editRow.cc} updated`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-2 text-[13px] text-text-muted">
          <span className="w-4 h-4 rounded-full border-2 border-action-blue border-t-transparent animate-spin" />
          Loading cycle counts…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Cycle Count</h1>
          <p className="text-[14px] text-text-muted mt-1">Plan, manage, and track cycle counts to ensure inventory accuracy.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dropdown label="Filters" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} />
          <button onClick={handleExport} className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Columns3 className="w-4 h-4" /> Export</button>
          <button onClick={() => { setDraft(emptyDraft); setFormOpen(true); }} className="flex items-center gap-2 text-[13px] font-medium text-white bg-action-blue rounded-lg px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#004BBF]"><Plus className="w-4 h-4" /> New Cycle Count</button>
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
              <p className="text-[24px] font-bold text-text-primary mt-0.5">{s.value} {s.sub && <span className="text-[12px] font-normal text-text-light">{s.sub}</span>}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Arrow className={`w-3.5 h-3.5 ${s.positive ? "text-teal" : "text-[#EF4444]"}`} />
                <span className={`text-[12px] font-medium ${s.positive ? "text-teal" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-text-light">{s.note}</span>
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
        {/* Main table */}
        <div className={card + " overflow-hidden"}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by count name, location, reference..." className="w-full text-[13px] text-text-primary placeholder:text-text-light bg-white border border-border-soft rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
            </div>
            <Dropdown label="All Warehouses" value={whFilter} options={WAREHOUSES} onSelect={setWhFilter} />
            <Dropdown label="All Statuses" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} />
            <button onClick={() => toast("Showing cycle counts for May 1 – May 31, 2025")} className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg transition-colors"><Calendar className="w-3.5 h-3.5" /> May 1 – May 31, 2025</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-soft-bg border-b border-border-soft">
                <th className={thCls}>Count #</th><th className={thCls}>Count Name</th><th className={thCls}>Warehouse / Location</th><th className={thCls}>Status</th>
                <th className={thCls}>Progress</th><th className={thCls}>Start Date</th><th className={thCls}>Due Date</th>
                <th className={thCls + " text-right"}>Actions</th>
              </tr></thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr key={r.cc} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-medium text-action-blue font-mono">{r.cc}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-medium text-text-primary">{r.name}</p>
                      <p className="text-[11px] text-text-light">{r.sub}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] text-text-primary">{r.wh}</p>
                      <p className="text-[11px] text-text-light">{r.whSub}</p>
                    </td>
                    <td className="px-6 py-4"><Badge text={r.status} /></td>
                    <td className="px-6 py-4"><ProgressBar value={r.progress} status={r.status} /></td>
                    <td className="px-6 py-4 text-[13px] text-text-muted whitespace-nowrap">{r.start}</td>
                    <td className="px-6 py-4 text-[13px] text-text-muted whitespace-nowrap">{r.due}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setMenuFor((v) => (v === r.cc ? null : r.cc))} className="text-text-light hover:text-text-muted p-1"><MoreHorizontal className="w-4 h-4" /></button>
                        {menuFor === r.cc && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                            <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-border-soft shadow-lg py-1 text-left">
                              <button onClick={() => { setMenuFor(null); setDetailRow(r); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg"><Eye className="w-3.5 h-3.5" /> View details</button>
                              {r.status !== "Completed" && r.status !== "Cancelled" && (
                                <button onClick={() => openEdit(r)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                              )}
                              {r.status === "Scheduled" && (
                                <button onClick={() => update(r.cc, { status: "In Progress", progress: 10 }, `Started ${r.cc}`)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-action-blue hover:bg-soft-bg"><Play className="w-3.5 h-3.5" /> Start count</button>
                              )}
                              {r.status === "In Progress" && (
                                <button onClick={() => update(r.cc, { status: "Completed", progress: 100 }, `Completed ${r.cc}`)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-teal hover:bg-soft-bg"><CheckCircle2 className="w-3.5 h-3.5" /> Complete</button>
                              )}
                              {r.status !== "Cancelled" && r.status !== "Completed" && (
                                <button onClick={() => { setMenuFor(null); setCancelling(r); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-soft-bg"><Ban className="w-3.5 h-3.5" /> Cancel count</button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-[13px] text-text-muted">No cycle counts match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-soft">
            <span className="text-[13px] text-text-muted">{filtered.length === 0 ? "Showing 0 cycle counts" : `Showing ${start + 1}-${Math.min(start + pageSize, filtered.length)} of ${filtered.length} cycle counts`}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${p === currentPage ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-soft-bg"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Cycle Count Status donut */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Cycle Count Status</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                  {(() => { let off = 0; return donutSegments.map((seg, i) => {
                    const p = parseFloat(seg.pct);
                    const da = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                    const el = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={seg.color} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                    off += p; return el;
                  }); })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-[17px] font-bold text-text-primary leading-none">{rows.length}</p><p className="text-[10px] text-text-light mt-0.5">Total</p></div></div>
              </div>
              <div className="flex-1 space-y-2">
                {donutSegments.map((seg) => (
                  <div key={seg.label} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} /><span className="text-text-muted">{seg.label}</span></div>
                    <span className="font-medium text-text-primary">{seg.count} ({seg.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accuracy Overview */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-2"><h3 className="text-[14px] font-semibold text-text-primary">Accuracy Overview</h3><button onClick={() => toast("Opening accuracy report", "info")} className="text-[12px] text-action-blue hover:underline">View report</button></div>
            <p className="text-[28px] font-bold text-text-primary">98.2%</p>
            <p className="text-[11px] text-text-light mb-1">Overall Accuracy</p>
            <p className="text-[11px] text-teal flex items-center gap-1 mb-3"><ArrowUpRight className="w-3 h-3" /> +1.6% vs last 30 days</p>
            <p className="text-[11px] font-semibold text-text-light uppercase tracking-[0.05em] mb-2">By Warehouse</p>
            <div className="space-y-2">
              {byWh.map((w) => (
                <div key={w.wh} className="flex items-center justify-between text-[12px]">
                  <span className="text-text-muted">{w.wh}</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <span className="text-text-primary">{w.acc}</span>
                    <span className={`flex items-center gap-0.5 ${w.up ? "text-teal" : "text-[#EF4444]"}`}>{w.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{w.change}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Cycle Counts */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Upcoming Cycle Counts</h3><button onClick={() => toast("Showing all upcoming counts", "info")} className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {upcoming.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-action-blue/10 flex flex-col items-center justify-center shrink-0"><span className="text-[13px] font-bold text-action-blue leading-none">{u.d}</span><span className="text-[8px] font-medium text-action-blue">{u.m}</span></div>
                  <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-text-primary truncate">{u.name}</p><p className="text-[11px] text-text-light">{u.wh}</p></div>
                  <span className="text-[11px] text-text-muted shrink-0">{u.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA banner */}
      <div className="rounded-xl bg-deep-navy px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[16px] font-semibold text-white">Keep your inventory accurate</h3>
          <p className="text-[13px] text-text-on-dark-muted mt-0.5">Schedule a new cycle count to maintain accuracy across all your warehouses.</p>
        </div>
        <button onClick={() => { setDraft(emptyDraft); setFormOpen(true); }} className="flex items-center gap-2 text-[13px] font-medium text-deep-navy bg-white rounded-lg px-4 py-2.5 hover:bg-white/90 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Plus className="w-4 h-4" /> New Cycle Count
        </button>
      </div>

      {/* New Cycle Count modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="New Cycle Count"
        description="Schedule a cycle count to verify inventory accuracy."
        footer={
          <>
            <button onClick={() => setFormOpen(false)} className="px-4 py-2 text-[13px] font-medium text-text-primary bg-white border border-border-soft rounded-lg hover:bg-soft-bg">Cancel</button>
            <button onClick={createCount} disabled={busy} className="px-4 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-[#004BBF] disabled:opacity-60">{busy ? "Creating…" : "Create count"}</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Count name" required><TextInput value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Aisle A01 – A10" /></Field></div>
          <Field label="Count type"><Select options={COUNT_TYPES} value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))} /></Field>
          <Field label="Warehouse"><Select options={WAREHOUSES} value={draft.wh} onChange={(e) => setDraft((d) => ({ ...d, wh: e.target.value }))} /></Field>
          <Field label="Start date"><TextInput type="date" value={draft.start} onChange={(e) => setDraft((d) => ({ ...d, start: e.target.value }))} /></Field>
          <Field label="Due date"><TextInput type="date" value={draft.due} onChange={(e) => setDraft((d) => ({ ...d, due: e.target.value }))} /></Field>
        </div>
      </Modal>

      {/* Cancel confirm */}
      <ConfirmDialog
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        onConfirm={() => { if (cancelling) { update(cancelling.cc, { status: "Cancelled", progress: 0 }, `Cancelled ${cancelling.cc}`); setCancelling(null); } }}
        title="Cancel cycle count"
        message={`Are you sure you want to cancel ${cancelling?.cc}?`}
        confirmLabel="Cancel count"
        cancelLabel="Keep"
        destructive
      />

      {/* Edit Cycle Count modal */}
      <Modal
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title="Edit Cycle Count"
        description={`Update details for ${editRow?.cc ?? ""}.`}
        footer={
          <>
            <button onClick={() => setEditRow(null)} className="px-4 py-2 text-[13px] font-medium text-text-primary bg-white border border-border-soft rounded-lg hover:bg-soft-bg">Cancel</button>
            <button onClick={saveEdit} disabled={editBusy} className="px-4 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-[#004BBF] disabled:opacity-60">{editBusy ? "Saving…" : "Save changes"}</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Count name" required><TextInput value={editDraft.name} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Aisle A01 – A10" /></Field></div>
          <Field label="Count type"><Select options={COUNT_TYPES} value={editDraft.type} onChange={(e) => setEditDraft((d) => ({ ...d, type: e.target.value }))} /></Field>
          <Field label="Warehouse"><Select options={WAREHOUSES} value={editDraft.wh} onChange={(e) => setEditDraft((d) => ({ ...d, wh: e.target.value }))} /></Field>
          <Field label="Start date"><TextInput type="date" value={editDraft.start} onChange={(e) => setEditDraft((d) => ({ ...d, start: e.target.value }))} /></Field>
          <Field label="Due date"><TextInput type="date" value={editDraft.due} onChange={(e) => setEditDraft((d) => ({ ...d, due: e.target.value }))} /></Field>
        </div>
      </Modal>

      {/* Detail drawer */}
      <Drawer
        open={!!detailRow}
        onClose={() => setDetailRow(null)}
        title={detailRow?.name ?? ""}
        subtitle={detailRow?.cc ?? ""}
        footer={
          <>
            {detailRow && detailRow.status !== "Completed" && detailRow.status !== "Cancelled" && (
              <button onClick={() => { if (detailRow) { openEdit(detailRow); setDetailRow(null); } }} className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-action-blue border border-action-blue rounded-lg hover:bg-action-blue/5"><Pencil className="w-3.5 h-3.5" /> Edit</button>
            )}
            <button onClick={() => setDetailRow(null)} className="px-4 py-2 text-[13px] font-medium text-text-primary bg-white border border-border-soft rounded-lg hover:bg-soft-bg">Close</button>
          </>
        }
      >
        {detailRow && (
          <>
            <DrawerSection title="Count Details">
              <DrawerRow label="Count #"><span className="font-mono text-action-blue">{detailRow.cc}</span></DrawerRow>
              <DrawerRow label="Name">{detailRow.name}</DrawerRow>
              <DrawerRow label="Type">{detailRow.sub}</DrawerRow>
              <DrawerRow label="Warehouse">{detailRow.wh} &mdash; {detailRow.whSub}</DrawerRow>
              <DrawerRow label="Status"><Badge text={detailRow.status} /></DrawerRow>
              <DrawerRow label="Progress"><ProgressBar value={detailRow.progress} status={detailRow.status} /></DrawerRow>
              <DrawerRow label="Start date">{detailRow.start}</DrawerRow>
              <DrawerRow label="Due date">{detailRow.due}</DrawerRow>
            </DrawerSection>

            <DrawerSection title="Count Items">
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-[12px]">
                  <thead><tr className="text-left text-[10px] font-semibold text-text-light uppercase tracking-[0.04em]">
                    <th className="pb-2 pr-3">SKU</th><th className="pb-2 pr-3">Location</th><th className="pb-2 pr-3 text-right">System Qty</th><th className="pb-2 pr-3 text-right">Counted Qty</th><th className="pb-2 text-right">Variance</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { sku: "SKU-10234", loc: "A01-03-02", sys: 120, cnt: 118, var: -2 },
                      { sku: "SKU-10567", loc: "A01-05-01", sys: 85, cnt: 85, var: 0 },
                      { sku: "SKU-10891", loc: "A02-01-04", sys: 200, cnt: 203, var: 3 },
                      { sku: "SKU-11024", loc: "A03-02-01", sys: 54, cnt: 52, var: -2 },
                      { sku: "SKU-11358", loc: "A04-01-03", sys: 310, cnt: 310, var: 0 },
                    ].map((item) => (
                      <tr key={item.sku} className="border-t border-[#F3F4F6]">
                        <td className="py-1.5 pr-3 font-medium text-text-primary font-mono">{item.sku}</td>
                        <td className="py-1.5 pr-3 text-text-muted">{item.loc}</td>
                        <td className="py-1.5 pr-3 text-right text-text-muted">{item.sys}</td>
                        <td className="py-1.5 pr-3 text-right text-text-primary font-medium">{item.cnt}</td>
                        <td className={`py-1.5 text-right font-medium ${item.var > 0 ? "text-teal" : item.var < 0 ? "text-[#EF4444]" : "text-text-light"}`}>{item.var > 0 ? `+${item.var}` : item.var}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DrawerSection>

            <DrawerSection title="Count Summary">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-soft-bg rounded-lg p-3 text-center">
                  <p className="text-[18px] font-bold text-text-primary">769</p>
                  <p className="text-[10px] text-text-light mt-0.5">Items Counted</p>
                </div>
                <div className="bg-soft-bg rounded-lg p-3 text-center">
                  <p className="text-[18px] font-bold text-teal">98.7%</p>
                  <p className="text-[10px] text-text-light mt-0.5">Accuracy</p>
                </div>
                <div className="bg-soft-bg rounded-lg p-3 text-center">
                  <p className="text-[18px] font-bold text-[#EF4444]">2</p>
                  <p className="text-[10px] text-text-light mt-0.5">Variances</p>
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="Assigned Team">
              <div className="space-y-3">
                {[
                  { name: "Sarah Chen", role: "Team Lead", initials: "SC", color: "bg-action-blue/10 text-action-blue" },
                  { name: "Marcus Johnson", role: "Counter", initials: "MJ", color: "bg-[#7C6FF6]/10 text-[#7C6FF6]" },
                  { name: "Aisha Patel", role: "Counter", initials: "AP", color: "bg-teal/10 text-teal" },
                ].map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${m.color}`}>{m.initials}</div>
                    <div><p className="text-[13px] font-medium text-text-primary">{m.name}</p><p className="text-[11px] text-text-light">{m.role}</p></div>
                  </div>
                ))}
              </div>
            </DrawerSection>
          </>
        )}
      </Drawer>
    </div>
  );
}
