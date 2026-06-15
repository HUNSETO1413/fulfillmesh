"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, User, Settings as SettingsIcon, Shield, Search,
  Download, AlertTriangle, Smartphone, Monitor, Tablet,
  ChevronLeft, ChevronRight, SlidersHorizontal, Calendar, Loader,
} from "lucide-react";
import type { AuditLog } from "@/types";
import { api, exportToCsv } from "@/lib/client";
import { useToast } from "@/components/dashboard/Toast";
import { Modal } from "@/components/dashboard/Modal";
import { Drawer } from "@/components/dashboard/Drawer";
import { Field, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";

/* ---------------- static decorative data ---------------- */

type StatusKind = AuditLog["status"];

function statusStyle(s: StatusKind): string {
  return {
    Success: "bg-[#00B894]/10 text-[#00B894]",
    Failed: "bg-[#EF4444]/10 text-[#EF4444]",
    Warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
  }[s];
}

// Color a category chip; falls back to a neutral amber for unknown categories.
function categoryStyle(category: string): string {
  const map: Record<string, string> = {
    auth: "bg-[#007F8C]/10 text-[#007F8C]",
    data: "bg-[#0057D8]/10 text-[#0057D8]",
    billing: "bg-[#84CC16]/10 text-[#65A30D]",
    security: "bg-[#EF4444]/10 text-[#EF4444]",
    system: "bg-[#7C6FF6]/10 text-[#7C6FF6]",
    api: "bg-[#EC4899]/10 text-[#EC4899]",
  };
  return map[category.toLowerCase()] ?? "bg-[#F59E0B]/10 text-[#F59E0B]";
}

// Color the action chip by guessing intent from the verb.
function actionStyle(action: string): string {
  const a = action.toLowerCase();
  if (/(create|add|new)/.test(a)) return "bg-[#00B894]/10 text-[#00B894]";
  if (/(delete|remove|revoke)/.test(a)) return "bg-[#EF4444]/10 text-[#EF4444]";
  if (/(update|edit|change|adjust)/.test(a)) return "bg-[#0057D8]/10 text-[#0057D8]";
  if (/(view|read|scan|export)/.test(a)) return "bg-[#64748B]/10 text-[#64748B]";
  if (/(login|auth|sign)/.test(a)) return "bg-[#007F8C]/10 text-[#007F8C]";
  if (/(fail|denied)/.test(a)) return "bg-[#EF4444]/10 text-[#EF4444]";
  return "bg-[#F59E0B]/10 text-[#F59E0B]";
}

// Deterministic avatar color from the actor name.
const AVATAR_COLORS = ["#0057D8", "#00B894", "#7C6FF6", "#F59E0B", "#EC4899", "#007F8C", "#F97316", "#84CC16", "#64748B"];
function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const mobileAccess = [
  { name: "Desktop", pct: 62, count: "15,411", color: "#0057D8", icon: Monitor },
  { name: "Mobile", pct: 28, count: "6,960", color: "#00B894", icon: Smartphone },
  { name: "Tablet", pct: 10, count: "2,485", color: "#7C6FF6", icon: Tablet },
];

const DONUT_COLORS = ["#0057D8", "#7C6FF6", "#EF4444", "#00B894", "#F59E0B", "#EC4899", "#94A3B8"];

/* ---------------- components ---------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${className}`}>{children}</div>;
}

export default function AuditLogsPage() {
  const { toast } = useToast();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [actorFilter, setActorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  // ---- Retention Settings modal ----
  const RETENTION_OPTIONS = ["30", "60", "90", "180", "365", "730"];
  const [retentionOpen, setRetentionOpen] = useState(false);
  const [retentionDays, setRetentionDays] = useState("365");
  const [archiveBeforeDelete, setArchiveBeforeDelete] = useState("Yes");
  const [retentionSaving, setRetentionSaving] = useState(false);

  // ---- Full Event Types drawer ----
  const [typesOpen, setTypesOpen] = useState(false);

  // ---- All Users drawer ----
  const [usersOpen, setUsersOpen] = useState(false);

  // ---- All Security Events drawer ----
  const [allSecurityOpen, setAllSecurityOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: AuditLog[]; total: number }>("/api/audit-logs");
        if (cancelled) return;
        setLogs(res?.data ?? []);
      } catch {
        if (!cancelled) toast("Failed to load audit logs", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hydrate retention settings from the persisted "audit" settings section.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await api.get<Record<string, unknown>>("/api/settings");
        if (cancelled) return;
        const audit = (all.audit ?? {}) as { retentionDays?: number | string; archiveBeforeDelete?: boolean };
        if (audit.retentionDays != null) setRetentionDays(String(audit.retentionDays));
        if (typeof audit.archiveBeforeDelete === "boolean") {
          setArchiveBeforeDelete(audit.archiveBeforeDelete ? "Yes" : "No");
        }
      } catch {
        /* keep defaults if settings can't be loaded */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const saveRetention = async () => {
    setRetentionSaving(true);
    try {
      await api.put("/api/settings", {
        audit: {
          retentionDays: Number(retentionDays) || 0,
          archiveBeforeDelete: archiveBeforeDelete === "Yes",
        },
      });
      toast(`Audit logs will be retained for ${retentionDays} days`);
      setRetentionOpen(false);
    } catch {
      toast("Failed to save retention settings", "error");
    } finally {
      setRetentionSaving(false);
    }
  };

  // Full list of action types (not limited to the top 7 shown in the sidebar).
  const allEventTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of logs) counts.set(l.action, (counts.get(l.action) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({ name, count, color: DONUT_COLORS[i % DONUT_COLORS.length] }));
  }, [logs]);
  const allEventTypesTotal = allEventTypes.reduce((a, b) => a + b.count, 0) || 1;

  const categoryOptions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.category))).sort(),
    [logs],
  );
  const actorOptions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.actor))).sort(),
    [logs],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = fromDate ? new Date(fromDate).getTime() : null;
    const to = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;
    return logs.filter((l) => {
      const matchesQuery = !q
        || l.actor.toLowerCase().includes(q)
        || l.action.toLowerCase().includes(q)
        || (l.target ?? "").toLowerCase().includes(q)
        || l.category.toLowerCase().includes(q);
      const matchesCategory = !categoryFilter || l.category === categoryFilter;
      const matchesActor = !actorFilter || l.actor === actorFilter;
      const matchesStatus = !statusFilter || l.status === statusFilter;
      const ts = new Date(l.createdAt).getTime();
      const matchesFrom = from === null || isNaN(ts) || ts >= from;
      const matchesTo = to === null || isNaN(ts) || ts <= to;
      return matchesQuery && matchesCategory && matchesActor && matchesStatus && matchesFrom && matchesTo;
    });
  }, [logs, query, categoryFilter, actorFilter, statusFilter, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // ---- stats computed from loaded rows ----
  const totalEvents = logs.length;
  const userActions = useMemo(
    () => logs.filter((l) => ["data", "auth", "api"].includes(l.category.toLowerCase())).length,
    [logs],
  );
  const systemEvents = useMemo(
    () => logs.filter((l) => l.category.toLowerCase() === "system").length,
    [logs],
  );
  const securityCount = useMemo(
    () => logs.filter((l) => l.category.toLowerCase() === "security").length,
    [logs],
  );

  const stats = [
    { title: "Total Events", value: totalEvents.toLocaleString(), icon: Activity, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
    { title: "User Actions", value: userActions.toLocaleString(), icon: User, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
    { title: "System Events", value: systemEvents.toLocaleString(), icon: SettingsIcon, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
    { title: "Security Events", value: securityCount.toLocaleString(), icon: Shield, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
  ];

  // ---- Event Summary donut: counts grouped by category ----
  const eventSummary = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of logs) counts.set(l.category, (counts.get(l.category) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({ name, count, color: DONUT_COLORS[i % DONUT_COLORS.length] }));
  }, [logs]);
  const summaryTotal = eventSummary.reduce((a, b) => a + b.count, 0) || 1;
  const circumference = 2 * Math.PI * 40;

  // ---- Event Types: counts grouped by action ----
  const eventTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of logs) counts.set(l.action, (counts.get(l.action) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, count], i) => ({ name, count, color: DONUT_COLORS[i % DONUT_COLORS.length] }));
  }, [logs]);

  // ---- Top users by event count ----
  const topUsers = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of logs) counts.set(l.actor, (counts.get(l.actor) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, color: avatarColor(name) }));
  }, [logs]);

  // ---- All distinct actors with their event counts (for the All Users drawer) ----
  const allUsers = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of logs) counts.set(l.actor, (counts.get(l.actor) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, color: avatarColor(name) }));
  }, [logs]);

  // ---- Recent security/failed events ----
  const securityEvents = useMemo(() => {
    return logs
      .filter((l) => l.category.toLowerCase() === "security" || l.status !== "Success")
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((l) => ({
        title: l.action,
        sub: l.target ?? l.ip ?? l.actor,
        time: `${formatDate(l.createdAt)} ${formatTime(l.createdAt)}`,
      }));
  }, [logs]);

  // ---- Full list of security/failed events (for the View all drawer) ----
  const allSecurityEvents = useMemo(() => {
    return logs
      .filter((l) => l.category.toLowerCase() === "security" || l.status !== "Success")
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((l) => ({
        id: l.id,
        title: l.action,
        actor: l.actor,
        sub: l.target ?? l.ip ?? l.actor,
        status: l.status,
        time: `${formatDate(l.createdAt)} ${formatTime(l.createdAt)}`,
      }));
  }, [logs]);

  const hourBars = [4, 7, 12, 9, 15, 22, 28, 31, 26, 19, 24, 30, 35, 29, 33, 27, 21, 18, 14, 11, 8, 6, 5, 3];

  function handleExport() {
    exportToCsv("audit-logs", filtered, [
      { key: "createdAt", header: "Timestamp" },
      { key: "actor", header: "Actor" },
      { key: "action", header: "Action" },
      { key: "target", header: "Target" },
      { key: "category", header: "Category" },
      { key: "ip", header: "IP Address" },
      { key: "status", header: "Status" },
    ]);
    toast(`Exported ${filtered.length} event${filtered.length === 1 ? "" : "s"} to CSV`);
  }

  const selectCls = "inline-flex items-center gap-2 px-3 py-2 text-[13px] text-text-muted border border-border-soft rounded-lg bg-white hover:bg-soft-bg whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-action-blue/20";

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-5 h-5 animate-spin text-action-blue" />
          <span className="ml-2 text-[14px] text-text-muted">Loading audit logs…</span>
        </div>
      )}
      {!loading && (
      <>
      {/* Breadcrumb + Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 mb-1.5 text-[12px]">
            <a href="/dashboard" className="text-text-muted hover:text-action-blue">Dashboard</a>
            <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            <span className="font-medium text-text-primary">Audit Logs</span>
          </nav>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold text-text-primary">Audit Logs</h1>
            <Shield className="w-5 h-5 text-teal" />
          </div>
          <p className="text-[14px] text-text-muted mt-0.5">Track user activities and system events for security and compliance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-soft bg-white text-text-body text-[13px] font-medium hover:bg-soft-bg shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Download className="w-4 h-4 text-text-light" /> Export Logs
          </button>
          <button onClick={() => setRetentionOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action-blue text-white text-[13px] font-medium hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <SettingsIcon className="w-4 h-4" /> Retention Settings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-lg border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-text-muted">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-text-primary leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <Activity className="w-3.5 h-3.5 text-text-light" />
                <span className="text-[11px] text-text-light">events recorded</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border-soft p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search by actor, action, target, or category..." className="w-full pl-9 pr-4 py-2 border border-border-soft rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-soft rounded-lg bg-white text-[13px] text-text-muted">
          <Calendar className="w-4 h-4 text-text-light" />
          <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="text-[13px] text-text-primary bg-transparent focus:outline-none" aria-label="From date" />
          <span className="text-text-light">–</span>
          <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="text-[13px] text-text-primary bg-transparent focus:outline-none" aria-label="To date" />
        </div>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className={selectCls}>
          <option value="">All Categories</option>
          {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={actorFilter} onChange={(e) => { setActorFilter(e.target.value); setPage(1); }} className={selectCls}>
          <option value="">All Actors</option>
          {actorOptions.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={selectCls}>
          <option value="">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="Warning">Warning</option>
        </select>
        <button onClick={() => { setQuery(""); setCategoryFilter(""); setActorFilter(""); setStatusFilter(""); setFromDate(""); setToDate(""); setPage(1); toast("Filters cleared", "info"); }} className="inline-flex items-center gap-2 px-3 py-2 text-[13px] text-text-muted border border-border-soft rounded-lg bg-white hover:bg-soft-bg whitespace-nowrap">
          <SlidersHorizontal className="w-4 h-4 text-text-light" /> Clear
        </button>
      </div>

      {/* Main: table + sidebar */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Table card */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-soft-bg border-b border-border-soft">
                  {["Time", "Actor", "Category", "Action", "Target", "IP Address", "Status"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((l) => (
                  <tr key={l.id} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="text-[13px] text-text-primary">{formatDate(l.createdAt)}</div>
                      <div className="text-[11px] text-text-light">{formatTime(l.createdAt)}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0" style={{ backgroundColor: avatarColor(l.actor) }}>
                          {initials(l.actor)}
                        </div>
                        <div className="text-[13px] font-medium text-text-primary whitespace-nowrap">{l.actor}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-[12px] font-medium rounded-md ${categoryStyle(l.category)} whitespace-nowrap`}>{l.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-[12px] font-medium rounded-md ${actionStyle(l.action)} whitespace-nowrap`}>{l.action}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-[13px] text-action-blue font-medium whitespace-nowrap">{l.target ?? "—"}</div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-text-body font-mono whitespace-nowrap">{l.ip ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-[12px] font-medium rounded-md ${statusStyle(l.status)}`}>{l.status}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[13px] text-text-muted">No events match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-border-soft">
            <p className="text-[13px] text-text-muted">
              {filtered.length === 0
                ? "Showing 0 of 0 events"
                : `Showing ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} of ${filtered.length.toLocaleString()} events`}
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-light hover:bg-soft-bg disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Previous page"><ChevronLeft className="w-4 h-4" /></button>
              <span className="px-3 text-[13px] font-medium text-text-primary whitespace-nowrap">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-light hover:bg-soft-bg disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Next page"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Event Summary donut */}
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Event Summary</h3>
            <div className="flex justify-center mb-5">
              <div className="relative w-[140px] h-[140px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {eventSummary.map((e, i) => {
                    const pct = (e.count / summaryTotal) * 100;
                    const off = eventSummary.slice(0, i).reduce((s, x) => s + (x.count / summaryTotal) * 100, 0);
                    const dash = `${(pct / 100) * circumference} ${circumference - (pct / 100) * circumference}`;
                    return (
                      <circle key={e.name} cx="50" cy="50" r="40" fill="none" stroke={e.color} strokeWidth="12"
                        strokeDasharray={dash} strokeDashoffset={-(off / 100) * circumference} />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[20px] font-bold text-text-primary">{totalEvents.toLocaleString()}</p>
                  <p className="text-[11px] text-text-light">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {eventSummary.length === 0 && <p className="text-[13px] text-text-light text-center">No events yet.</p>}
              {eventSummary.map((e) => (
                <div key={e.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                    <span className="text-text-muted">{e.name}</span>
                  </div>
                  <span className="font-medium text-text-primary">{e.count.toLocaleString()} ({((e.count / summaryTotal) * 100).toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Event Types */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Event Types</h3>
              <button onClick={() => setTypesOpen(true)} className="text-[12px] font-medium text-action-blue hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {eventTypes.length === 0 && <p className="text-[13px] text-text-light">No events yet.</p>}
              {eventTypes.map((e) => (
                <div key={e.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                    <span className="text-text-muted">{e.name}</span>
                  </div>
                  <span className="font-medium text-text-primary">{e.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Users */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Top Users (by Events)</h3>
            </div>
            <div className="space-y-3">
              {topUsers.length === 0 && <p className="text-[13px] text-text-light">No events yet.</p>}
              {topUsers.map((u) => (
                <div key={u.name} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0" style={{ backgroundColor: u.color }}>
                    {initials(u.name)}
                  </div>
                  <span className="text-[13px] font-medium text-text-primary flex-1">{u.name}</span>
                  <span className="text-[13px] text-text-muted">{u.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setUsersOpen(true)} className="mt-3 text-[12px] font-medium text-action-blue hover:underline">View all users</button>
          </Card>

          {/* Recent Security Events */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Recent Security Events</h3>
              <button onClick={() => setAllSecurityOpen(true)} className="text-[12px] font-medium text-action-blue hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {securityEvents.length === 0 && <p className="text-[13px] text-text-light">No recent security events.</p>}
              {securityEvents.map((e, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-text-primary">{e.title}</p>
                    <p className="text-[12px] text-text-light mt-0.5">{e.sub}</p>
                    <p className="text-[11px] text-text-light">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mobile Access */}
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Mobile Access</h3>
            <div className="space-y-4">
              {mobileAccess.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.name}>
                    <div className="flex items-center justify-between mb-1.5 text-[13px]">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: m.color }} />
                        <span className="text-text-muted">{m.name}</span>
                      </div>
                      <span className="font-medium text-text-primary">{m.count} ({m.pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Events Over Time */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">Events Over Time</h3>
            <span className="text-[12px] text-text-muted bg-soft-bg px-2.5 py-1 rounded-md font-medium">Daily</span>
          </div>
          <div className="flex items-center gap-4 mb-3 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0057D8]" /><span className="text-text-muted">User Actions</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7C6FF6]" /><span className="text-text-muted">System Events</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /><span className="text-text-muted">Security Events</span></span>
          </div>
          <div className="h-[180px]">
            <svg viewBox="0 0 500 180" className="w-full h-full" preserveAspectRatio="none">
              {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="10" y1={i * 40 + 10} x2="490" y2={i * 40 + 10} stroke="#F1F5F9" strokeWidth="1" />)}
              <polyline fill="none" stroke="#0057D8" strokeWidth="2" points="10,120 50,110 90,115 130,95 170,100 210,80 250,85 290,65 330,70 370,55 410,60 450,45 490,50" />
              <polyline fill="none" stroke="#7C6FF6" strokeWidth="2" points="10,150 50,148 90,145 130,140 170,142 210,135 250,138 290,130 330,132 370,128 410,130 450,125 490,127" />
              <polyline fill="none" stroke="#EF4444" strokeWidth="2" points="10,168 50,166 90,167 130,164 170,165 210,162 250,163 290,160 330,161 370,159 410,160 450,158 490,159" />
            </svg>
          </div>
        </Card>

        {/* Events by Hour */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">Events by Hour (Today)</h3>
            <span className="text-[12px] text-text-muted bg-soft-bg px-2.5 py-1 rounded-md font-medium">All Events</span>
          </div>
          <div className="h-[180px] flex items-end gap-1">
            {hourBars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-teal" style={{ height: `${(h / 35) * 100}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-text-light">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
          </div>
        </Card>
      </div>

      {/* Retention Settings */}
      <Modal
        open={retentionOpen}
        onClose={() => setRetentionOpen(false)}
        title="Retention Settings"
        description="Control how long audit log events are kept before they are purged."
        size="md"
        footer={
          <>
            <SecondaryButton onClick={() => setRetentionOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveRetention} disabled={retentionSaving}>
              {retentionSaving ? "Saving…" : "Save Settings"}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Retention period (days)" required hint="Events older than this are eligible for deletion.">
            <NumberInput
              min={1}
              value={retentionDays}
              list="retention-presets"
              onChange={(e) => setRetentionDays(e.target.value)}
            />
            <datalist id="retention-presets">
              {RETENTION_OPTIONS.map((o) => <option key={o} value={o} />)}
            </datalist>
          </Field>
          <Field label="Archive before deleting" hint="Export expiring events to cold storage before they are purged.">
            <Select
              value={archiveBeforeDelete}
              options={["Yes", "No"]}
              onChange={(e) => setArchiveBeforeDelete(e.target.value)}
            />
          </Field>
        </div>
      </Modal>

      {/* All Event Types */}
      <Drawer
        open={typesOpen}
        onClose={() => setTypesOpen(false)}
        title="All Event Types"
        subtitle={`${allEventTypes.length} distinct action${allEventTypes.length === 1 ? "" : "s"} across ${totalEvents.toLocaleString()} events`}
        footer={<PrimaryButton onClick={() => setTypesOpen(false)}>Close</PrimaryButton>}
      >
        <div className="space-y-2.5">
          {allEventTypes.length === 0 && <p className="text-[13px] text-text-light">No events yet.</p>}
          {allEventTypes.map((e) => (
            <div key={e.name} className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                <span className="text-text-muted truncate">{e.name}</span>
              </div>
              <span className="font-medium text-text-primary whitespace-nowrap">
                {e.count.toLocaleString()} ({((e.count / allEventTypesTotal) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </Drawer>

      {/* All Users */}
      <Drawer
        open={usersOpen}
        onClose={() => setUsersOpen(false)}
        title="All Users"
        subtitle={`${allUsers.length} distinct actor${allUsers.length === 1 ? "" : "s"} across ${totalEvents.toLocaleString()} events`}
        footer={<PrimaryButton onClick={() => setUsersOpen(false)}>Close</PrimaryButton>}
      >
        <div className="space-y-3">
          {allUsers.length === 0 && <p className="text-[13px] text-text-light">No events yet.</p>}
          {allUsers.map((u) => (
            <div key={u.name} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0" style={{ backgroundColor: u.color }}>
                {initials(u.name)}
              </div>
              <span className="text-[13px] font-medium text-text-primary flex-1 truncate">{u.name}</span>
              <span className="text-[13px] text-text-muted whitespace-nowrap">{u.count.toLocaleString()} event{u.count === 1 ? "" : "s"}</span>
            </div>
          ))}
        </div>
      </Drawer>

      {/* All Security Events */}
      <Drawer
        open={allSecurityOpen}
        onClose={() => setAllSecurityOpen(false)}
        title="Security Events"
        subtitle={`${allSecurityEvents.length} security or failed event${allSecurityEvents.length === 1 ? "" : "s"}`}
        footer={<PrimaryButton onClick={() => setAllSecurityOpen(false)}>Close</PrimaryButton>}
      >
        <div className="space-y-4">
          {allSecurityEvents.length === 0 && <p className="text-[13px] text-text-light">No security events.</p>}
          {allSecurityEvents.map((e) => (
            <div key={e.id} className="flex items-start gap-3 border-b border-[#F3F4F6] last:border-b-0 pb-4 last:pb-0">
              <span className="w-7 h-7 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-text-primary truncate">{e.title}</p>
                  <span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-md shrink-0 ${statusStyle(e.status)}`}>{e.status}</span>
                </div>
                <p className="text-[12px] text-text-light mt-0.5 truncate">{e.actor} · {e.sub}</p>
                <p className="text-[11px] text-text-light">{e.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Drawer>
      </>
      )}
    </div>
  );
}
