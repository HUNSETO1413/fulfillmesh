"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Filter, Download, ChevronDown, ChevronLeft, ChevronRight, Search, AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert, Clock, ArrowUpRight, ArrowDownRight, MoreHorizontal, Plus, Settings, UserPlus, FileDown, X } from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import type { ExceptionReport } from "@/lib/analytics";

const TYPE_COLORS: Record<string, string> = {
  Quality: "#3B82F6",
  Shipment: "#10B981",
  Order: "#F59E0B",
  Return: "#8B5CF6",
  Invoice: "#EF4444",
  Inventory: "#06B6A4",
};

// Map a backing status to its filter bucket + display color.
function statusBucket(status: string): { sc: string; priority: string; pc: string } {
  if (status === "Resolved") return { sc: "resolved", priority: "Low", pc: "#3B82F6" };
  if (status === "Investigating") return { sc: "investigating", priority: "Medium", pc: "#F59E0B" };
  return { sc: "open", priority: "High", pc: "#EF4444" };
}

type LogEntry = { at: string; text: string };
type ExcRow = { id: string; type: string; desc: string; wh: string; priority: string; pc: string; status: string; sc: string; on: string; log: LogEntry[] };

const statusStyle: Record<string, string> = {
  open: "bg-[#FEF2F2] text-[#EF4444]",
  investigating: "bg-[#FFFBEB] text-[#F59E0B]",
  resolved: "bg-[#ECFDF5] text-[#10B981]",
  ignored: "bg-[#F1F5F9] text-[#64748B]",
  acknowledged: "bg-[#EFF6FF] text-[#3B82F6]",
};

function Sparkline({ color }: { color: string }) {
  const pts = [8, 11, 7, 13, 9, 12, 6, 10, 8, 5];
  return (
    <svg viewBox="0 0 100 18" className="w-full h-5" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts.map((y, i) => `${i * 11},${y}`).join(" ")} />
    </svg>
  );
}

function FilterPill({ value, options, onSelect }: { value: string; options: string[]; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-border-soft rounded-lg text-[12px] font-medium text-text-primary hover:bg-soft-bg transition-colors">
        {value}
        <ChevronDown className="w-3 h-3 text-text-light" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1 z-40 w-48 bg-white rounded-lg border border-border-soft shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-1">
            {options.map((o) => (
              <button key={o} onClick={() => { onSelect(o); setOpen(false); }} className={`w-full text-left px-3 py-2 text-[12px] hover:bg-soft-bg ${value === o ? "text-action-blue font-medium" : "text-text-primary"}`}>{o}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const TYPE_FILTER = ["All Types", "Quality", "Shipment", "Order", "Return", "Invoice"];
const PRIORITY_FILTER = ["All Priorities", "High", "Medium", "Low"];

const PAGE_SIZE = 5;

function nowStamp() {
  return new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function dayOf(on: string): string {
  // "May 31, 2025 09:42 AM" -> "May 31, 2025"
  return on.split(" ").slice(0, 3).join(" ");
}

export default function ExceptionReportsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("All Exceptions");
  const [range, setRange] = useState("May 1 – May 31, 2025");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [whFilter, setWhFilter] = useState("All Sources");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [report, setReport] = useState<ExceptionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ExcRow[]>([]);
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get<ExceptionReport>("/api/analytics/exceptions");
        if (cancelled) return;
        setReport(data);
        setRows(
          data.rows.map((r) => {
            const b = statusBucket(r.status);
            return {
              id: r.id,
              type: r.type,
              desc: r.desc,
              wh: r.source,
              priority: b.priority,
              pc: b.pc,
              status: r.status,
              sc: b.sc,
              on: r.on,
              log: [],
            };
          }),
        );
      } catch {
        if (!cancelled) toast("Failed to load exception report", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Source (warehouse/customer/supplier) filter options derived from the rows.
  const WH_FILTER = useMemo(
    () => ["All Sources", ...Array.from(new Set(rows.map((r) => r.wh).filter(Boolean)))],
    [rows],
  );

  const tabFilter: Record<string, (r: ExcRow) => boolean> = {
    "All Exceptions": () => true,
    Open: (r) => r.sc === "open",
    "SLA Breached": (r) => r.priority === "High",
    Resolved: (r) => r.sc === "resolved",
    Ignored: (r) => r.sc === "ignored",
  };

  // Live counts for the stat cards, tabs, donut, priorities and top types.
  const openCount = rows.filter((r) => r.sc === "open").length;
  const resolvedCount = rows.filter((r) => r.sc === "resolved").length;
  const investigatingCount = rows.filter((r) => r.sc === "investigating").length;

  const stats = [
    { title: "Total Exceptions", value: String(report?.totalExceptions ?? rows.length), change: "live", good: true, icon: AlertTriangle, color: "#EF4444" },
    { title: "Open Exceptions", value: String(openCount), change: "live", good: true, icon: AlertCircle, color: "#F59E0B" },
    { title: "Resolved Exceptions", value: String(resolvedCount), change: "live", good: true, icon: CheckCircle2, color: "#10B981" },
    { title: "Failed QC", value: String(report?.failedQc ?? 0), change: "live", good: true, icon: ShieldAlert, color: "#8B5CF6" },
    { title: "Overdue Invoices", value: String(report?.overdueInvoices ?? 0), change: "live", good: true, icon: Clock, color: "#3B82F6" },
  ];

  const tabs = [
    { name: "All Exceptions", count: rows.length },
    { name: "Open", count: openCount },
    { name: "SLA Breached", count: rows.filter((r) => r.priority === "High").length },
    { name: "Resolved", count: resolvedCount },
    { name: "Ignored", count: rows.filter((r) => r.sc === "ignored").length },
  ];

  const summary = (report?.byType ?? []).filter((t) => t.count > 0).map((t) => ({
    name: t.name,
    pct: t.pct,
    color: TYPE_COLORS[t.name] ?? "#94A3B8",
  }));

  const priorities = [
    { name: "High", count: openCount, color: "#EF4444" },
    { name: "Medium", count: investigatingCount, color: "#F59E0B" },
    { name: "Low", count: resolvedCount, color: "#3B82F6" },
  ].map((p) => {
    const total = rows.length || 1;
    const pct = Math.round((p.count / total) * 100);
    return { name: p.name, value: `${p.count} (${pct}%)`, pct, color: p.color };
  });

  const topTypes = (report?.byType ?? []).filter((t) => t.count > 0).map((t) => ({
    type: t.name,
    count: t.count,
    pct: `${t.pct}%`,
  }));

  // Top sources by exception count.
  const topWh = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rows) counts.set(r.wh, (counts.get(r.wh) ?? 0) + 1);
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [rows]);

  // Returns by reason → reuse the resolution-time bar block as a real breakdown.
  const resByType = (report?.returnsByReason ?? []).map((r, i) => {
    const max = Math.max(1, ...(report?.returnsByReason ?? []).map((x) => x.count));
    return {
      type: r.name,
      hrs: r.count,
      color: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#94A3B8"][i % 6],
      w: Math.round((r.count / max) * 100),
    };
  });

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) =>
      (tabFilter[activeTab] ?? (() => true))(r) &&
      (typeFilter === "All Types" || r.type === typeFilter) &&
      (whFilter === "All Sources" || r.wh === whFilter) &&
      (priorityFilter === "All Priorities" || r.priority === priorityFilter) &&
      (!q || r.id.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, activeTab, typeFilter, whFilter, priorityFilter, query]);

  // real pagination over the filtered rows
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filteredRows.slice(start, start + PAGE_SIZE);

  function setStatus(id: string, status: string, sc: string, verb: string) {
    const stamp = nowStamp();
    setRows((prev) => prev.map((r) => r.id === id
      ? { ...r, status, sc, log: [...r.log, { at: stamp, text: `Status changed to ${status}` }] }
      : r));
    setRowMenu(null);
    toast(`${id} ${verb}`);
  }

  function exportExceptions() {
    exportToCsv("exception-reports", filteredRows, [
      { key: "id", header: "Exception ID" },
      { key: "type", header: "Type" },
      { key: "desc", header: "Description" },
      { key: "wh", header: "Warehouse" },
      { key: "priority", header: "Priority" },
      { key: "status", header: "Status" },
      { key: "on", header: "Detected On" },
    ]);
    toast(`Exported ${filteredRows.length} exceptions to CSV`);
  }

  // active-filter chips
  const activeFilters: { label: string; clear: () => void }[] = [];
  if (query.trim()) activeFilters.push({ label: `Search: “${query.trim()}”`, clear: () => { setQuery(""); setPage(1); } });
  if (typeFilter !== "All Types") activeFilters.push({ label: `Type: ${typeFilter}`, clear: () => { setTypeFilter("All Types"); setPage(1); } });
  if (whFilter !== "All Sources") activeFilters.push({ label: `Source: ${whFilter}`, clear: () => { setWhFilter("All Sources"); setPage(1); } });
  if (priorityFilter !== "All Priorities") activeFilters.push({ label: `Priority: ${priorityFilter}`, clear: () => { setPriorityFilter("All Priorities"); setPage(1); } });

  function clearAllFilters() {
    setQuery("");
    setTypeFilter("All Types");
    setWhFilter("All Sources");
    setPriorityFilter("All Priorities");
    setPage(1);
  }

  // exceptions over time chart — recomputed from the FILTERED rows, grouped by day
  const chartData = useMemo(() => {
    const days = Array.from(new Set(filteredRows.map((r) => dayOf(r.on))))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const counts = days.map((d) => {
      const dayRows = filteredRows.filter((r) => dayOf(r.on) === d);
      return {
        total: dayRows.length,
        open: dayRows.filter((r) => r.sc === "open").length,
        resolved: dayRows.filter((r) => r.sc === "resolved").length,
        sla: dayRows.filter((r) => r.priority === "High").length,
      };
    });
    const yMax = Math.max(4, ...counts.map((c) => c.total));
    return {
      days,
      yMax,
      series: [
        { name: "Total Exceptions", color: "#0057D8", pts: counts.map((c) => c.total) },
        { name: "Open", color: "#F59E0B", pts: counts.map((c) => c.open) },
        { name: "Resolved", color: "#10B981", pts: counts.map((c) => c.resolved) },
        { name: "SLA Breached", color: "#EF4444", pts: counts.map((c) => c.sla) },
      ],
    };
  }, [filteredRows]);

  const W = 760, H = 200, padL = 28, padB = 22, padT = 8;
  const nDays = chartData.days.length;
  const cx = (i: number) => padL + (i * (W - padL - 10)) / Math.max(1, nDays - 1);
  const cy = (v: number) => padT + (1 - v / chartData.yMax) * (H - padT - padB);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Exception Reports</h1>
          <p className="text-[14px] text-text-muted mt-1">Identify, track and resolve exceptions that impact your operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeMenu
            value={range}
            onSelect={(r) => { setRange(r); toast(`Exceptions scoped to ${r}`, "info"); }}
            presets={["May 1 – May 31, 2025", "Last 7 days", "Last 30 days", "This quarter", "Year to date"]}
          />
          <button onClick={() => toast("Use the search and filter pills above the table", "info")} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-primary hover:bg-soft-bg transition-colors">
            <Filter className="w-4 h-4 text-text-muted" />
            Filters
          </button>
          <button onClick={exportExceptions} className="flex items-center gap-2 px-4 py-2 bg-action-blue text-white rounded-lg text-[13px] font-semibold hover:bg-action-blue/90 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-border-soft p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-text-muted">{s.title}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                  <Icon className="w-[18px] h-[18px]" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-text-primary leading-none tracking-tight">{s.value}</p>
              <div className="flex items-center gap-1.5 mt-2">
                {s.change.startsWith("+") ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                )}
                <span className="text-[12px] font-semibold text-[#10B981]">{s.change}</span>
                <span className="text-[11px] text-text-light">vs Apr 30</span>
              </div>
              <div className="mt-3">
                <Sparkline color={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border-soft overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.name}
            onClick={() => { setActiveTab(t.name); setPage(1); }}
            className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === t.name
                ? "border-action-blue text-action-blue"
                : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            {t.name} <span className="ml-0.5">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Table + sidebar */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "2.1fr 1fr" }}>
        {/* Left: filters + table */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search exceptions..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue/40 transition-colors"
              />
            </div>
            <FilterPill value={typeFilter} options={TYPE_FILTER} onSelect={(v) => { setTypeFilter(v); setPage(1); }} />
            <FilterPill value={whFilter} options={WH_FILTER} onSelect={(v) => { setWhFilter(v); setPage(1); }} />
            <FilterPill value={priorityFilter} options={PRIORITY_FILTER} onSelect={(v) => { setPriorityFilter(v); setPage(1); }} />
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {activeFilters.map((f) => (
                <span key={f.label} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-action-blue/10 text-action-blue rounded-full text-[12px] font-medium">
                  {f.label}
                  <button onClick={f.clear} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-action-blue/20" aria-label={`Clear ${f.label}`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button onClick={clearAllFilters} className="text-[12px] font-medium text-text-muted hover:text-text-primary underline-offset-2 hover:underline">
                Clear all
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-border-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-soft-bg border-b border-border-soft">
                    {["Exception ID", "Type", "Description", "Warehouse", "Priority", "Status", "Detected On", "Actions"].map((h) => (
                      <th key={h} className="text-left text-[12px] font-semibold text-text-muted px-4 py-3 whitespace-nowrap uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => (
                    <Fragment key={r.id}>
                    <tr
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      className="border-b border-border-soft/60 last:border-b-0 hover:bg-soft-bg/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 text-[13px] font-semibold text-action-blue font-mono whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <ChevronRight className={`w-3.5 h-3.5 text-text-light transition-transform ${expandedId === r.id ? "rotate-90" : ""}`} />
                          {r.id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-muted font-medium">{r.type}</td>
                      <td className="px-4 py-3 text-[13px] text-text-primary max-w-[180px] truncate">{r.desc}</td>
                      <td className="px-4 py-3 text-[13px] text-text-muted whitespace-nowrap">{r.wh}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-md" style={{ backgroundColor: `${r.pc}12`, color: r.pc }}>
                          {r.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-md ${statusStyle[r.sc] ?? statusStyle.open}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-muted whitespace-nowrap">{r.on}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <button onClick={() => setRowMenu(rowMenu === r.id ? null : r.id)} className="text-text-light hover:text-text-muted transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {rowMenu === r.id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setRowMenu(null)} />
                              <div className="absolute right-0 mt-1 z-40 w-44 bg-white rounded-lg border border-border-soft shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-1 text-left">
                                <button onClick={() => setStatus(r.id, "Acknowledged", "acknowledged", "acknowledged")} className="w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-soft-bg">Acknowledge</button>
                                <button onClick={() => setStatus(r.id, "Investigating", "investigating", "marked investigating")} className="w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-soft-bg">Investigate</button>
                                <button onClick={() => setStatus(r.id, "Resolved", "resolved", "resolved")} className="w-full text-left px-3 py-2 text-[13px] text-[#10B981] hover:bg-soft-bg">Resolve</button>
                                <button onClick={() => setStatus(r.id, "Ignored", "ignored", "ignored")} className="w-full text-left px-3 py-2 text-[13px] text-text-muted hover:bg-soft-bg">Ignore</button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === r.id && (
                      <tr className="border-b border-border-soft/60 last:border-b-0 bg-soft-bg/40">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
                            <div className="space-y-2">
                              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Details</p>
                              <p className="text-[13px] text-text-primary">{r.desc}</p>
                              <p className="text-[12px] text-text-muted">Warehouse: <span className="text-text-primary font-medium">{r.wh}</span></p>
                              <p className="text-[12px] text-text-muted">Priority: <span className="font-medium" style={{ color: r.pc }}>{r.priority}</span></p>
                              <p className="text-[12px] text-text-muted">Current status: <span className="text-text-primary font-medium">{r.status}</span></p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">Activity timeline</p>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] mt-1.5 shrink-0" />
                                  <div>
                                    <p className="text-[13px] text-text-primary">Exception detected</p>
                                    <p className="text-[11px] text-text-light">{r.on}</p>
                                  </div>
                                </div>
                                {r.log.map((entry, i) => (
                                  <div key={i} className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-action-blue mt-1.5 shrink-0" />
                                    <div>
                                      <p className="text-[13px] text-text-primary">{entry.text}</p>
                                      <p className="text-[11px] text-text-light">{entry.at}</p>
                                    </div>
                                  </div>
                                ))}
                                {r.log.length === 0 && (
                                  <p className="text-[12px] text-text-light">No status changes yet.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  ))}
                  {pageRows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-text-muted">No exceptions match your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border-soft">
              <span className="text-[12px] text-text-muted">
                {filteredRows.length === 0
                  ? "Showing 0 exceptions"
                  : `Showing ${start + 1} to ${Math.min(start + PAGE_SIZE, filteredRows.length)} of ${filteredRows.length} exceptions`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted hover:bg-soft-bg disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[28px] h-7 px-2 rounded-md text-[12px] font-medium transition-colors ${
                      p === currentPage ? "bg-action-blue text-white" : "text-text-muted hover:bg-soft-bg"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted hover:bg-soft-bg disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Exception Summary donut */}
          <div className="bg-white rounded-xl border border-border-soft p-5">
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">Exception Summary</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[120px] h-[120px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E6EDF5" strokeWidth="13" />
                  {summary.map((s, i) => {
                    const off = summary.slice(0, i).reduce((acc, x) => acc + x.pct, 0);
                    const dash = `${s.pct * 2.51327} ${251.327 - s.pct * 2.51327}`;
                    return (
                      <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={s.color} strokeWidth="13" strokeDasharray={dash} strokeDashoffset={-off * 2.51327} />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[20px] font-bold text-text-primary leading-none">{report?.totalExceptions ?? 0}</span>
                  <span className="text-[10px] font-medium text-text-muted mt-0.5">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {summary.length === 0 && !loading && (
                  <p className="text-[12px] text-text-muted">No exceptions</p>
                )}
                {summary.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-text-muted">{s.name}</span>
                    </div>
                    <span className="font-semibold text-text-primary">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exceptions by Priority */}
          <div className="bg-white rounded-xl border border-border-soft p-5">
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">Exceptions by Priority</h3>
            <div className="space-y-3">
              {priorities.map((p) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-medium text-text-muted">{p.name}</span>
                    <span className="text-[12px] font-semibold text-text-primary">{p.value}</span>
                  </div>
                  <div className="h-2 bg-border-blue/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Breach Trend */}
          <div className="bg-white rounded-xl border border-border-soft p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[15px] font-semibold text-text-primary">SLA Breach Trend</h3>
              <span className="text-[14px] font-bold text-text-primary">
                23 <span className="text-[11px] font-semibold text-[#10B981]">-15.7%</span>
              </span>
            </div>
            <p className="text-[11px] text-text-light mb-3">vs Apr 1 – Apr 30</p>
            <svg viewBox="0 0 320 110" className="w-full" style={{ height: 110 }}>
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="6" y1={6 + i * 28} x2="314" y2={6 + i * 28} stroke="#E6EDF5" strokeWidth="1" />
              ))}
              <polyline
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={[60, 40, 70, 35, 55, 30, 65, 38, 50, 28, 45, 32].map((v, i) => `${6 + i * 28},${6 + (v / 80) * 90}`).join(" ")}
              />
              {[60, 40, 70, 35, 55, 30, 65, 38, 50, 28, 45, 32].map((v, i) => (
                <circle key={i} cx={6 + i * 28} cy={6 + (v / 80) * 90} r="2.5" fill="white" stroke="#EF4444" strokeWidth="1.5" />
              ))}
            </svg>
          </div>

          {/* Top Sources by Exceptions */}
          <div className="bg-white rounded-xl border border-border-soft p-5">
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">Top Sources by Exceptions</h3>
            <div className="space-y-3">
              {topWh.length === 0 && !loading && (
                <p className="text-[13px] text-text-muted">No exception sources</p>
              )}
              {topWh.map((w, i) => (
                <div key={w.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-soft-bg flex items-center justify-center text-[10px] font-bold text-text-muted">{i + 1}</span>
                    <span className="text-[13px] text-text-primary font-medium">{w.name}</span>
                  </div>
                  <span className="text-[13px] font-bold text-text-primary">{w.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border-soft/60">
              <button onClick={exportExceptions} className="text-[13px] font-medium text-action-blue hover:underline">View full report →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Exceptions Over Time — driven by the filtered rows */}
      <div className="bg-white rounded-xl border border-border-soft p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-text-primary">Exceptions Over Time</h3>
          <span className="text-[12px] font-medium text-text-muted bg-soft-bg px-2.5 py-1.5 rounded-lg">
            {filteredRows.length} matching exception{filteredRows.length === 1 ? "" : "s"} · grouped by day
          </span>
        </div>
        <div className="flex items-center gap-5 mb-4">
          {chartData.series.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[11px] font-medium text-text-muted">{s.name}</span>
            </div>
          ))}
        </div>
        {nDays === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-[13px] text-text-muted">
            No exceptions match the current filters.
          </div>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={padL} y1={padT + i * ((H - padT - padB) / 4)} x2={W - 10} y2={padT + i * ((H - padT - padB) / 4)} stroke="#E6EDF5" strokeWidth="1" />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <text key={i} x={padL - 5} y={padT + i * ((H - padT - padB) / 4) + 3} textAnchor="end" fontSize="9" fill="#9AA8B8">
                {Math.round(chartData.yMax * (1 - i / 4))}
              </text>
            ))}
            {chartData.series.map((s, si) => (
              <g key={si}>
                <polyline fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={s.pts.map((v, i) => `${cx(i)},${cy(v)}`).join(" ")} />
                {s.pts.map((v, i) => (
                  <circle key={i} cx={cx(i)} cy={cy(v)} r="2.5" fill="white" stroke={s.color} strokeWidth="1.5" />
                ))}
              </g>
            ))}
            {chartData.days.map((l, i) => (
              <text key={l} x={cx(i)} y={H - 5} textAnchor="middle" fontSize="9" fill="#9AA8B8">{l.replace(", 2025", "")}</text>
            ))}
          </svg>
        )}
        <div className="text-right mt-2">
          <button onClick={exportExceptions} className="text-[13px] font-medium text-action-blue hover:underline">View full report →</button>
        </div>
      </div>

      {/* Bottom: Top Types + Resolution time + Quick Actions */}
      <div className="grid gap-4 grid-cols-3">
        {/* Top Exception Types */}
        <div className="bg-white rounded-xl border border-border-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-border-soft">
            <h3 className="text-[15px] font-semibold text-text-primary">Top Exception Types</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-soft-bg border-b border-border-soft">
                <th className="text-left text-[12px] font-semibold text-text-muted px-5 py-3 uppercase tracking-wide">Type</th>
                <th className="text-right text-[12px] font-semibold text-text-muted px-5 py-3 uppercase tracking-wide">Exceptions</th>
                <th className="text-right text-[12px] font-semibold text-text-muted px-5 py-3 uppercase tracking-wide">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {topTypes.length === 0 && !loading && (
                <tr><td colSpan={3} className="px-5 py-6 text-center text-[13px] text-text-muted">No exceptions yet</td></tr>
              )}
              {topTypes.map((t) => (
                <tr key={t.type} className="border-b border-border-soft/60 last:border-b-0 hover:bg-soft-bg/50 transition-colors">
                  <td className="px-5 py-3 text-[13px] font-semibold text-text-primary">{t.type}</td>
                  <td className="px-5 py-3 text-[13px] font-medium text-text-primary text-right">{t.count}</td>
                  <td className="px-5 py-3 text-[13px] text-text-muted text-right">{t.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-border-soft text-right">
            <button onClick={exportExceptions} className="text-[13px] font-medium text-action-blue hover:underline">View full report →</button>
          </div>
        </div>

        {/* Returns by Reason */}
        <div className="bg-white rounded-xl border border-border-soft p-5">
          <h3 className="text-[15px] font-semibold text-text-primary mb-5">Returns by Reason</h3>
          <div className="space-y-3">
            {resByType.length === 0 && !loading && (
              <p className="text-[12px] text-text-muted">No returns yet</p>
            )}
            {resByType.map((r) => (
              <div key={r.type} className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-text-muted w-[68px] shrink-0">{r.type}</span>
                <div className="flex-1 h-2.5 bg-border-blue/40 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.w}%`, backgroundColor: r.color }} />
                </div>
                <span className="text-[12px] font-bold text-text-primary w-8 text-right">{r.hrs}</span>
              </div>
            ))}
          </div>
          <div className="text-right mt-5 pt-3 border-t border-border-soft/60">
            <button onClick={exportExceptions} className="text-[13px] font-medium text-action-blue hover:underline">View full report →</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-border-soft p-5">
          <h3 className="text-[15px] font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Create Exception", icon: Plus, onClick: () => toast("New exception form opened", "info") },
              { label: "Manage SLAs", icon: ShieldAlert, onClick: () => toast("SLA rules opened", "info") },
              { label: "Assign to Team", icon: UserPlus, onClick: () => toast("Assignment dialog opened", "info") },
              { label: "Exception Settings", icon: Settings, onClick: () => toast("Exception settings opened", "info") },
              { label: "Download Report", icon: FileDown, onClick: exportExceptions },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button key={a.label} onClick={a.onClick} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-soft-bg border border-border-soft rounded-lg text-[13px] font-medium text-text-primary hover:bg-border-blue/30 transition-colors">
                  <Icon className="w-4 h-4 text-text-muted" />
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA band */}
      <div className="gradient-dark-hero rounded-xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Resolve faster. Operate better.</h3>
            <p className="text-[12px] text-text-on-dark-muted mt-0.5">Set up automated exception rules and SLA alerts to catch issues before they impact your customers.</p>
          </div>
        </div>
        <button onClick={() => toast("Automation rules builder opened", "info")} className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-navy hover:bg-white/90 shrink-0 transition-colors">
          <Settings className="w-4 h-4" /> Configure Automation
        </button>
      </div>
    </div>
  );
}
