"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardCheck, CheckCircle2, AlertTriangle, Clock,
  Search, ChevronDown, Pencil, Trash2, Plus, Calendar, Bell, Download,
  ChevronLeft, ChevronRight, ChevronUp, ArrowUpDown,
} from "lucide-react";
import type { AppNotification, QcInspection, QcStatus } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate } from "@/lib/format";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

const STATUSES: QcStatus[] = ["Scheduled", "In Progress", "Passed", "Failed", "On Hold"];

// The demo workspace anchors "today" to the end of the header range so date
// filtering stays deterministic across renders.
const REF_DATE = new Date("2025-05-18T12:00:00Z");
const DATE_RANGES = ["All time", "Last 7 days", "Last 30 days", "This quarter", "Year to date"];

function rangeStart(range: string): Date | null {
  const start = new Date(REF_DATE);
  switch (range) {
    case "Last 7 days":
      start.setUTCDate(start.getUTCDate() - 7);
      return start;
    case "Last 30 days":
      start.setUTCDate(start.getUTCDate() - 30);
      return start;
    case "This quarter":
      return new Date("2025-04-01T00:00:00Z");
    case "Year to date":
      return new Date("2025-01-01T00:00:00Z");
    default:
      return null;
  }
}

function inDateRange(iso: string, range: string): boolean {
  const start = rangeStart(range);
  if (!start) return true;
  const d = new Date(`${iso}T12:00:00Z`);
  return d >= start && d <= REF_DATE;
}

// Real notification bell: opens a popover that fetches GET /api/notifications and
// lists items linking to their target, with a genuine empty state.
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [notes, setNotes] = useState<AppNotification[]>([]);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get<{ data: AppNotification[]; total: number }>("/api/notifications");
      setNotes(res.data);
      setLoaded(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    setOpen((v) => {
      const next = !v;
      if (next && !loaded) void load();
      return next;
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const unread = notes.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={toggle}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
        className="relative w-9 h-9 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg"
      >
        <Bell className="w-4 h-4" />
        {loaded && unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-[#EF4444] rounded-full text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 z-40 w-80 bg-white rounded-xl border border-border-soft shadow-lg py-1">
            <div className="px-3 py-2 border-b border-border-soft">
              <p className="text-[13px] font-semibold text-deep-navy">Notifications</p>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {loading && <p className="px-3 py-6 text-center text-[12px] text-text-light">Loading…</p>}
              {!loading && error && <p className="px-3 py-6 text-center text-[12px] text-[#EF4444]">Could not load notifications.</p>}
              {!loading && !error && notes.length === 0 && (
                <p className="px-3 py-6 text-center text-[12px] text-text-light">You&apos;re all caught up.</p>
              )}
              {!loading && !error &&
                notes.map((n) => {
                  const body = (
                    <>
                      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : "bg-action-blue"}`} />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[13px] leading-snug ${n.read ? "text-text-body" : "font-semibold text-deep-navy"}`}>{n.title}</span>
                        {n.description && <span className="block text-[12px] text-text-muted mt-0.5 line-clamp-2">{n.description}</span>}
                        <span className="block text-[11px] text-text-light mt-0.5">{formatDate(n.createdAt.slice(0, 10))}</span>
                      </span>
                    </>
                  );
                  return n.link ? (
                    <Link
                      key={n.id}
                      href={n.link}
                      onClick={() => setOpen(false)}
                      className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-soft-bg transition-colors border-b border-border-soft last:border-b-0"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div key={n.id} className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left border-b border-border-soft last:border-b-0">
                      {body}
                    </div>
                  );
                })}
            </div>
            <div className="px-3 py-2 border-t border-border-soft">
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="block w-full text-center text-[12px] font-medium text-action-blue hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

type Draft = {
  product: string;
  sku: string;
  supplier: string;
  inspector: string;
  status: QcStatus;
  scheduledDate: string;
  defectRate: string;
  sampleSize: string;
};

const emptyDraft: Draft = {
  product: "", sku: "", supplier: "", inspector: "", status: "Scheduled",
  scheduledDate: new Date().toISOString().slice(0, 10), defectRate: "", sampleSize: "",
};

type Errors = Partial<Record<"product" | "supplier" | "defectRate" | "sampleSize", string>>;

function QcFields({ draft, set, errors }: { draft: Draft; set: (d: Partial<Draft>) => void; errors: Errors }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Field label="Product" required error={errors.product}>
          <TextInput value={draft.product} onChange={(e) => set({ product: e.target.value })} placeholder="Wireless Speaker" />
        </Field>
      </div>
      <Field label="SKU">
        <TextInput value={draft.sku} onChange={(e) => set({ sku: e.target.value })} placeholder="SKU-1024" />
      </Field>
      <Field label="Supplier" required error={errors.supplier}>
        <TextInput value={draft.supplier} onChange={(e) => set({ supplier: e.target.value })} placeholder="Shenzhen Topway" />
      </Field>
      <Field label="Inspector">
        <TextInput value={draft.inspector} onChange={(e) => set({ inspector: e.target.value })} placeholder="Emily Chen" />
      </Field>
      <Field label="Status">
        <Select options={STATUSES} value={draft.status} onChange={(e) => set({ status: e.target.value as QcStatus })} />
      </Field>
      <Field label="Scheduled date">
        <TextInput type="date" value={draft.scheduledDate} onChange={(e) => set({ scheduledDate: e.target.value })} />
      </Field>
      <Field label="Sample size" error={errors.sampleSize}>
        <NumberInput value={draft.sampleSize} onChange={(e) => set({ sampleSize: e.target.value })} placeholder="800" step="1" min="0" />
      </Field>
      <div className="col-span-2">
        <Field label="Defect rate (%)" error={errors.defectRate}>
          <NumberInput value={draft.defectRate} onChange={(e) => set({ defectRate: e.target.value })} placeholder="0" step="0.1" min="0" max="100" />
        </Field>
      </div>
    </div>
  );
}

/* stats + charts computed inside component from items */

// Donut colors per QC status (drives the real results breakdown).
const RESULT_DEFS: { name: string; status: QcStatus; color: string }[] = [
  { name: "Passed", status: "Passed", color: "#00B894" },
  { name: "Failed", status: "Failed", color: "#EF4444" },
  { name: "In Progress", status: "In Progress", color: "#7C6FF6" },
  { name: "Scheduled", status: "Scheduled", color: "#0057D8" },
  { name: "On Hold", status: "On Hold", color: "#D9E5F2" },
];

const CHART_RANGES = ["This Week", "Last Week", "This Month"];

const tabs = ["All", "Scheduled", "In Progress", "Passed", "Failed", "On Hold"];

export default function QcInspectionsView({ items }: { items: QcInspection[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [dateRange, setDateRange] = useState("All time");
  const [dateRangeOpen, setDateRangeOpen] = useState(false);

  // sorting
  type SortKey = "id" | "product" | "sku" | "supplier" | "scheduledDate" | "defectRate" | "status";
  const [sortKey, setSortKey] = useState<SortKey>("scheduledDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // create / edit
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<QcInspection | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<QcInspection | null>(null);

  // computed stats from items. No historical snapshots exist, so each card shows
  // a real derived context line rather than an invented "% change".
  const stats = useMemo(() => {
    const total = items.length;
    const passed = items.filter((q) => q.status === "Passed").length;
    const failed = items.filter((q) => q.status === "Failed").length;
    const pending = items.filter((q) => q.status === "Scheduled" || q.status === "In Progress").length;
    const completed = passed + failed;
    const rate = completed > 0 ? ((passed / completed) * 100).toFixed(1) : "0";
    // Average measured defect rate across inspections that recorded one.
    const withDefect = items.filter((q) => q.defectRate != null);
    const avgDefect = withDefect.length > 0
      ? (withDefect.reduce((sum, q) => sum + (q.defectRate ?? 0), 0) / withDefect.length).toFixed(1)
      : null;
    const pct = (n: number) => (total > 0 ? `${Math.round((n / total) * 100)}% of total` : "—");
    return [
      { title: "Total Inspections", value: String(total), sub: "in workspace", icon: ClipboardCheck, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
      { title: "Pass Rate", value: `${rate}%`, sub: completed > 0 ? `${completed} completed` : "No results yet", icon: CheckCircle2, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
      { title: "Failed Inspections", value: String(failed), sub: avgDefect != null ? `${avgDefect}% avg defect` : pct(failed), icon: AlertTriangle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
      { title: "Pending Inspections", value: String(pending), sub: pct(pending), icon: Clock, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
    ];
  }, [items]);

  // stage chart range
  const [chartRange, setChartRange] = useState("This Week");
  const [chartRangeOpen, setChartRangeOpen] = useState(false);

  // Close any open custom dropdown on Escape (outside-click handled per-dropdown).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDateRangeOpen(false);
        setChartRangeOpen(false);
        setPageSizeOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const circumference = 2 * Math.PI * 40;

  // Real results breakdown by QC status drives the donut + legend.
  const resultBreakdown = useMemo(() => {
    const total = items.length;
    const rows = RESULT_DEFS.map((d) => {
      const count = items.filter((q) => q.status === d.status).length;
      const pct = total > 0 ? (count / total) * 100 : 0;
      return { ...d, count, pct };
    });
    return { rows, total };
  }, [items]);

  // "Inspections by Supplier": the range dropdown windows the real scheduledDate,
  // and bars count the top suppliers within that window — no synthetic jitter.
  const stageData = useMemo(() => {
    const refIso = REF_DATE.toISOString().slice(0, 10);
    const start = new Date(REF_DATE);
    if (chartRange === "This Week") {
      start.setUTCDate(start.getUTCDate() - 7);
    } else if (chartRange === "Last Week") {
      start.setUTCDate(start.getUTCDate() - 14);
    } else {
      start.setUTCDate(start.getUTCDate() - 30);
    }
    const startIso = start.toISOString().slice(0, 10);
    // "Last Week" = the 7-day window before the most recent 7 days.
    const endIso = chartRange === "Last Week"
      ? new Date(REF_DATE.getTime() - 7 * 86400000).toISOString().slice(0, 10)
      : refIso;

    const counts = new Map<string, number>();
    for (const it of items) {
      if (it.scheduledDate < startIso || it.scheduledDate > endIso) continue;
      counts.set(it.supplier, (counts.get(it.supplier) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [items, chartRange]);

  const maxBar = Math.max(1, ...stageData.map((s) => s.value));

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesTab = activeTab === "All" || it.status === activeTab;
      const matchesDate = inDateRange(it.scheduledDate, dateRange);
      const term = query.trim().toLowerCase();
      const matchesQuery =
        !term ||
        it.id.toLowerCase().includes(term) ||
        it.product.toLowerCase().includes(term) ||
        it.supplier.toLowerCase().includes(term) ||
        (it.sku ?? "").toLowerCase().includes(term);
      return matchesTab && matchesDate && matchesQuery;
    });
  }, [items, activeTab, query, dateRange]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "defectRate") {
        av = a.defectRate ?? 0; bv = b.defectRate ?? 0;
      } else {
        av = String(a[sortKey] ?? "").toLowerCase();
        bv = String(b[sortKey] ?? "").toLowerCase();
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const pageIds = pageRows.map((r) => r.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const selectedRows = sorted.filter((r) => selected.has(r.id));

  function toggleSelectAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        for (const id of pageIds) next.delete(id);
      } else {
        for (const id of pageIds) next.add(id);
      }
      return next;
    });
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkDelete() {
    setBusy(true);
    try {
      for (const id of selected) {
        await api.del(`/api/qc-inspections/${id}`);
      }
      toast(`Deleted ${selected.size} inspection${selected.size === 1 ? "" : "s"}`);
      setSelected(new Set());
      setBulkDeleting(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete inspections", "error");
    } finally {
      setBusy(false);
    }
  }

  function exportSelected() {
    exportToCsv("qc-inspections-selected", selectedRows, [
      { key: "id", header: "Inspection ID" },
      { key: "product", header: "Product" },
      { key: "sku", header: "SKU" },
      { key: "supplier", header: "Supplier" },
      { key: "inspector", header: "Inspector" },
      { key: "status", header: "Status" },
      { key: "scheduledDate", header: "Scheduled" },
      { key: "defectRate", header: "Defect Rate" },
      { key: "sampleSize", header: "Sample Size" },
    ]);
    toast(`Exported ${selectedRows.length} selected inspections to CSV`);
  }

  const sortIcon = (k: SortKey) =>
    sortKey !== k
      ? <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
      : <ChevronUp className={`w-3.5 h-3.5 text-[#0057D8] transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} />;

  function selectTab(tab: string) {
    setActiveTab(tab);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setErrors({});
    setFormOpen(true);
  }

  function openEdit(it: QcInspection) {
    setEditing(it);
    setErrors({});
    setDraft({
      product: it.product,
      sku: it.sku ?? "",
      supplier: it.supplier,
      inspector: it.inspector ?? "",
      status: it.status,
      scheduledDate: it.scheduledDate,
      defectRate: it.defectRate != null ? String(it.defectRate) : "",
      sampleSize: it.sampleSize != null ? String(it.sampleSize) : "",
    });
    setFormOpen(true);
  }

  async function saveInspection() {
    const nextErrors: Errors = {};
    if (!draft.product.trim()) nextErrors.product = "Product is required";
    if (!draft.supplier.trim()) nextErrors.supplier = "Supplier is required";
    if (draft.defectRate.trim() !== "") {
      const dr = Number(draft.defectRate);
      if (Number.isNaN(dr) || dr < 0 || dr > 100) nextErrors.defectRate = "Defect rate must be between 0 and 100";
    }
    if (draft.sampleSize.trim() !== "" && (Number.isNaN(Number(draft.sampleSize)) || Number(draft.sampleSize) < 0)) {
      nextErrors.sampleSize = "Sample size must be a non-negative number";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast("Please fix the highlighted fields", "error");
      return;
    }
    setErrors({});
    setBusy(true);
    const payload = {
      product: draft.product.trim(),
      sku: draft.sku.trim() || undefined,
      supplier: draft.supplier.trim(),
      inspector: draft.inspector.trim() || undefined,
      status: draft.status,
      scheduledDate: draft.scheduledDate,
      defectRate: draft.defectRate === "" ? undefined : Number(draft.defectRate),
      sampleSize: draft.sampleSize === "" ? undefined : Math.trunc(Number(draft.sampleSize)),
    };
    try {
      if (editing) {
        await api.put(`/api/qc-inspections/${editing.id}`, payload);
        toast(`Inspection ${editing.id} updated`);
      } else {
        const created = await api.post<QcInspection>("/api/qc-inspections", payload);
        toast(`Inspection ${created.id} created`);
      }
      setFormOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save inspection", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.del(`/api/qc-inspections/${deleting.id}`);
      toast(`Inspection ${deleting.id} deleted`);
      setDeleting(null);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete inspection", "error");
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    exportToCsv("qc-inspections", filtered, [
      { key: "id", header: "Inspection ID" },
      { key: "product", header: "Product" },
      { key: "sku", header: "SKU" },
      { key: "supplier", header: "Supplier" },
      { key: "inspector", header: "Inspector" },
      { key: "status", header: "Status" },
      { key: "scheduledDate", header: "Scheduled" },
      { key: "defectRate", header: "Defect Rate" },
      { key: "sampleSize", header: "Sample Size" },
    ]);
    toast(`Exported ${filtered.length} inspections to CSV`);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-deep-navy">QC Inspections</h1>
          <p className="text-[14px] text-text-body mt-0.5">Monitor product quality and ensure compliance across all stages.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setDateRangeOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body hover:bg-soft-bg"
            >
              <Calendar className="w-4 h-4" />
              {dateRange}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {dateRangeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDateRangeOpen(false)} />
                <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-border-soft shadow-lg py-1">
                  {DATE_RANGES.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setDateRange(r); setPage(1); setDateRangeOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${dateRange === r ? "text-action-blue font-medium" : "text-text-body"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <NotificationBell />
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body hover:bg-soft-bg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-action-blue hover:bg-navy rounded-lg text-[13px] font-medium text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Inspection
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-text-muted">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-deep-navy leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[11px] text-text-light">{s.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Results donut */}
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
          <h3 className="text-[14px] font-semibold text-deep-navy mb-4">Inspection Results Overview</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-[140px] h-[140px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#D9E5F2" strokeWidth="12" />
                {resultBreakdown.rows.map((r, i) => {
                  const len = (r.pct / 100) * circumference;
                  const prior = resultBreakdown.rows.slice(0, i).reduce((sum, x) => sum + x.pct, 0);
                  return (
                    <circle
                      key={r.status}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={r.color}
                      strokeWidth="12"
                      strokeLinecap="butt"
                      strokeDasharray={`${len} ${circumference - len}`}
                      strokeDashoffset={-(prior / 100) * circumference}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[10px] text-text-light">Total</p>
                  <p className="text-[20px] font-bold text-deep-navy">{resultBreakdown.total}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {resultBreakdown.rows.map((r) => (
                <div key={r.status} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="text-text-body truncate">{r.name}</span>
                  </div>
                  <span className="font-medium text-deep-navy shrink-0 ml-2">{r.count} <span className="text-text-light">({resultBreakdown.total > 0 ? r.pct.toFixed(1) : "0.0"}%)</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage bar chart */}
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-deep-navy">Inspections by Supplier</h3>
            <div className="relative">
              <button
                onClick={() => setChartRangeOpen((v) => !v)}
                className="inline-flex items-center gap-1 text-[12px] text-text-muted bg-soft-bg px-2.5 py-1 rounded-md hover:bg-[#E6EDF5] transition-colors"
              >
                {chartRange}
                <ChevronDown className="w-3 h-3" />
              </button>
              {chartRangeOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setChartRangeOpen(false)} />
                  <div className="absolute right-0 mt-1 z-20 w-36 bg-white rounded-lg border border-border-soft shadow-lg py-1">
                    {CHART_RANGES.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setChartRange(r); setChartRangeOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${chartRange === r ? "text-action-blue font-medium" : "text-text-body"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-end justify-between gap-3 h-[160px] px-2">
            {stageData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[12px] text-text-light">No inspections scheduled in this range.</span>
              </div>
            ) : (
              stageData.map((s) => (
                <div key={s.name} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-[12px] font-semibold text-deep-navy mb-1">{s.value}</span>
                  <div className="w-full bg-[#0057D8] rounded-t transition-all duration-300" style={{ height: `${(s.value / maxBar) * 100}%` }} />
                  <span className="text-[10px] text-text-light mt-2 text-center leading-tight truncate w-full" title={s.name}>{s.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-border-soft p-3 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search inspections..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-deep-navy placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue"
            />
          </div>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => selectTab(t)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[13px] transition-colors ${
                activeTab === t
                  ? "bg-action-blue border-action-blue text-white"
                  : "border-border-soft text-text-muted hover:bg-soft-bg"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border-soft shadow-soft overflow-hidden">
        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-[#EFF6FF] border-b border-[#BFDBFE]">
            <span className="text-[13px] font-medium text-[#1D4ED8]">{selected.size} selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={exportSelected}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#BFDBFE] rounded-lg text-[13px] text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"
              >
                <Download className="w-4 h-4" />
                Export selected
              </button>
              <button
                onClick={() => setBulkDeleting(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] rounded-lg text-[13px] font-medium text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete selected
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="px-2 py-1.5 text-[13px] text-text-muted hover:text-deep-navy"
              >
                Clear
              </button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "900px" }}>
            <thead>
              <tr className="bg-soft-bg border-b border-border-soft">
                <th className="w-10 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all on page"
                    className="w-4 h-4 rounded border-[#D1D5DB] text-[#0057D8] focus:ring-[#0057D8] cursor-pointer"
                  />
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("product")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Product {sortIcon("product")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("sku")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">SKU {sortIcon("sku")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("supplier")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Supplier {sortIcon("supplier")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("scheduledDate")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Scheduled {sortIcon("scheduledDate")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("defectRate")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Defect Rate {sortIcon("defectRate")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Status {sortIcon("status")}</button>
                </th>
                <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((it) => {
                const color = it.status === "Failed" ? "#EF4444" : it.status === "Passed" ? "#00B894" : "#66758C";
                return (
                  <tr key={it.id} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(it.id)}
                        onChange={() => toggleRow(it.id)}
                        aria-label={`Select ${it.id}`}
                        className="w-4 h-4 rounded border-[#D1D5DB] text-[#0057D8] focus:ring-[#0057D8] cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                          style={{
                            backgroundColor: `${color}14`,
                            color,
                            boxShadow: `inset 0 0 0 1px ${color}26`,
                          }}
                        >
                          {it.product.charAt(0)}
                        </div>
                        <div>
                          <Link href={`/dashboard/qc-inspections/${it.id}`} className="text-[13px] font-medium text-deep-navy leading-tight hover:text-action-blue">{it.product}</Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-text-body font-mono">{it.sku ?? "—"}</td>
                    <td className="px-5 py-3 text-[13px] text-text-body">{it.supplier}</td>
                    <td className="px-5 py-3 text-[13px] text-text-body whitespace-nowrap">{formatDate(it.scheduledDate)}</td>
                    <td className="px-5 py-3 text-[13px] text-text-body">{it.defectRate != null ? `${it.defectRate}%` : "—"}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={it.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(it)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-text-light hover:bg-[#EFF6FF] hover:text-action-blue transition-colors"
                          aria-label={`Edit ${it.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(it)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-text-light hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                          aria-label={`Delete ${it.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center">
                    <p className="text-[13px] text-text-muted">No inspections match your filters.</p>
                    <button onClick={openCreate} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-action-blue hover:underline">
                      <Plus className="w-4 h-4" /> Create your first inspection
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft">
          <p className="text-[12px] text-text-muted">
            {filtered.length === 0
              ? "Showing 0 inspections"
              : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} inspections`}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-light hover:bg-soft-bg disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium ${
                    p === currentPage
                      ? "bg-action-blue text-white"
                      : "border border-border-soft text-text-muted hover:bg-soft-bg"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted hover:bg-soft-bg disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setPageSizeOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-2 py-1 border border-border-soft rounded-md text-[12px] text-text-muted hover:bg-soft-bg"
              >
                {pageSize} / page
                <ChevronDown className="w-3 h-3" />
              </button>
              {pageSizeOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPageSizeOpen(false)} />
                  <div className="absolute right-0 bottom-full mb-1 z-20 w-32 bg-white rounded-lg border border-border-soft shadow-lg py-1">
                    {[8, 10, 20, 50].map((n) => (
                      <button
                        key={n}
                        onClick={() => { setPageSize(n); setPage(1); setPageSizeOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-soft-bg ${n === pageSize ? "text-[#0057D8] font-medium" : "text-text-muted"}`}
                      >
                        {n} / page
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.id}` : "New Inspection"}
        description={editing ? "Update the inspection details below." : "Schedule a new QC inspection."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveInspection} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create inspection"}
            </PrimaryButton>
          </>
        }
      >
        <QcFields draft={draft} set={(d) => setDraft((prev) => ({ ...prev, ...d }))} errors={errors} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete inspection"
        message={`Are you sure you want to delete ${deleting?.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        open={bulkDeleting}
        onClose={() => setBulkDeleting(false)}
        onConfirm={bulkDelete}
        title="Delete selected inspections"
        message={`Are you sure you want to delete ${selected.size} inspection${selected.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel={`Delete ${selected.size}`}
        destructive
        loading={busy}
      />
    </div>
  );
}
