"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Download, Plus, ChevronDown, ChevronRight, ShoppingBag, Truck, CheckCircle2, Clock, DollarSign, ArrowUpRight, ArrowDownRight, BarChart3, Package, Ship, Warehouse, RotateCcw, Users, FileText, LineChart } from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, Select as FormSelect, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import type { OperationalReport } from "@/lib/analytics";

const WH_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#94A3B8", "#EF4444", "#06B6A4"];
const fmtInt = (n: number) => n.toLocaleString("en-US");

const reportCats = [
  { name: "Order Performance", icon: BarChart3 },
  { name: "Inventory Performance", icon: Package },
  { name: "Shipping Performance", icon: Ship },
  { name: "Warehouse Performance", icon: Warehouse },
  { name: "Returns Performance", icon: RotateCcw },
  { name: "Financial Performance", icon: DollarSign },
  { name: "Customer Performance", icon: Users },
  { name: "Custom Reports", icon: FileText },
];

const FILTER_OPTIONS: Record<string, string[]> = {
  Warehouse: ["All Warehouses", "ATL-1 · Atlanta", "DFW-1 · Dallas", "LAX-1 · Los Angeles", "MIA-1 · Miami", "ORD-1 · Chicago"],
  Channel: ["All Channels", "Shopify", "Amazon", "Walmart", "eBay", "Other"],
  "Order Type": ["All Order Types", "Standard", "Express", "Backorder", "Pre-order"],
};

const CHANNEL_NAMES = [
  { name: "Shopify", color: "#3B82F6" },
  { name: "Amazon", color: "#10B981" },
  { name: "Walmart", color: "#F59E0B" },
  { name: "eBay", color: "#8B5CF6" },
  { name: "Other", color: "#94A3B8" },
];

/* ---- deterministic datasets per category + granularity ---- */

type Gran = "Daily" | "Weekly" | "Monthly";
const GRANS: Gran[] = ["Daily", "Weekly", "Monthly"];

const GRAN_POINTS: Record<Gran, number> = { Daily: 12, Weekly: 5, Monthly: 3 };
const GRAN_XLABELS: Record<Gran, string[]> = {
  Daily: ["May 1", "May 8", "May 16", "May 24", "May 31"],
  Weekly: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
  Monthly: ["Mar", "Apr", "May"],
};
const GRAN_YLABELS: Record<Gran, string[]> = {
  Daily: ["1.2K", "0.9K", "0.6K", "0.3K", "0"],
  Weekly: ["8K", "6K", "4K", "2K", "0"],
  Monthly: ["32K", "24K", "16K", "8K", "0"],
};

const CATEGORY_SERIES: Record<string, string[]> = {
  "Order Performance": ["Orders", "Shipped", "Delivered"],
  "Inventory Performance": ["Received", "Picked", "Adjusted"],
  "Shipping Performance": ["Shipments", "On Time", "Delayed"],
  "Warehouse Performance": ["Tasks", "Completed", "Backlog"],
  "Returns Performance": ["Returns", "Processed", "Refunded"],
  "Financial Performance": ["Revenue", "Costs", "Margin"],
  "Customer Performance": ["New", "Returning", "Churned"],
  "Custom Reports": ["Metric A", "Metric B", "Metric C"],
};
const SERIES_COLORS = ["#3B82F6", "#10B981", "#8B5CF6"];

// Deterministic pseudo-random series: same key always yields the same values.
function seededSeries(key: string, n: number, min: number, max: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Array.from({ length: n }, () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5; h |= 0;
    const u = ((h >>> 0) % 1000) / 1000;
    return Math.round(min + u * (max - min));
  });
}

type ChannelRow = { name: string; color: string; orders: string; shipped: string; delivered: string; onTime: string; cycle: string };

const ORDER_PERFORMANCE_ROWS: ChannelRow[] = [
  { name: "Shopify", orders: "5,678", shipped: "5,352", delivered: "5,102", onTime: "94.1%", cycle: "1.64 days", color: "#3B82F6" },
  { name: "Amazon", orders: "3,245", shipped: "3,062", delivered: "2,896", onTime: "92.8%", cycle: "1.88 days", color: "#10B981" },
  { name: "Walmart", orders: "1,876", shipped: "1,761", delivered: "1,672", onTime: "91.7%", cycle: "1.94 days", color: "#F59E0B" },
  { name: "eBay", orders: "987", shipped: "911", delivered: "856", onTime: "89.6%", cycle: "2.04 days", color: "#8B5CF6" },
  { name: "Other", orders: "670", shipped: "601", delivered: "546", onTime: "90.1%", cycle: "2.12 days", color: "#94A3B8" },
];

// Deterministic channel breakdown for every report category.
function rowsForCategory(cat: string): ChannelRow[] {
  if (cat === "Order Performance") return ORDER_PERFORMANCE_ROWS;
  return CHANNEL_NAMES.map((ch) => {
    const [a, b, c, d, e] = seededSeries(`op-table-${cat}-${ch.name}`, 5, 0, 999);
    const orders = 620 + a * 5;
    const shipped = Math.round(orders * (0.9 + (b / 999) * 0.08));
    const delivered = Math.round(shipped * (0.92 + (c / 999) * 0.06));
    const onTime = (88 + (d / 999) * 8).toFixed(1);
    const cycle = (1.5 + (e / 999) * 0.7).toFixed(2);
    return {
      name: ch.name,
      color: ch.color,
      orders: orders.toLocaleString("en-US"),
      shipped: shipped.toLocaleString("en-US"),
      delivered: delivered.toLocaleString("en-US"),
      onTime: `${onTime}%`,
      cycle: `${cycle} days`,
    };
  });
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-");
}

type Schedule = { frequency: "Daily" | "Weekly" | "Monthly"; day: string; time: string; recipients: string };
const FREQUENCIES = ["Daily", "Weekly", "Monthly"] as const;
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTH_DAYS = ["1st of the month", "15th of the month", "Last day of the month"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Sparkline({ color }: { color: string }) {
  const pts = [12, 9, 14, 7, 11, 6, 12, 8, 10, 5];
  return <svg viewBox="0 0 100 18" className="w-full h-5" preserveAspectRatio="none"><polyline fill="none" stroke={color} strokeWidth="1.5" points={pts.map((y, i) => `${i * 11},${y}`).join(" ")} /></svg>;
}

function FilterPill({ value, options, onSelect }: { value: string; options: string[]; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[12px] font-medium text-[#1E293B] hover:bg-[#F8FAFC]">
        {value}<ChevronDown className="w-3 h-3 text-[#94A3B8]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1 z-40 w-52 bg-white rounded-lg border border-[#E2E8F0] shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-1">
            {options.map((o) => (
              <button key={o} onClick={() => { onSelect(o); setOpen(false); }} className={`w-full text-left px-3 py-2 text-[12px] hover:bg-[#F8FAFC] ${value === o ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}>{o}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OperationalReportsPage() {
  const { toast } = useToast();
  const [report, setReport] = useState<OperationalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("May 1 – May 31, 2025");
  const [activeCat, setActiveCat] = useState("Order Performance");
  const [gran, setGran] = useState<Gran>("Daily");
  const [whFilter, setWhFilter] = useState("All Warehouses");
  const [chFilter, setChFilter] = useState("All Channels");
  const [otFilter, setOtFilter] = useState("All Order Types");

  // schedule modal
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [schedDraft, setSchedDraft] = useState<Schedule>({ frequency: "Weekly", day: "Monday", time: "08:00", recipients: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get<OperationalReport>("/api/analytics/operational");
        if (!cancelled) setReport(data);
      } catch {
        if (!cancelled) toast("Failed to load operational report", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real stat cards derived from the live report.
  const stats = useMemo(() => {
    const r = report;
    return [
      { title: "Total Orders", value: fmtInt(r?.totalOrders ?? 0), change: `${r?.ordersByStatus.length ?? 0} statuses`, up: true, icon: ShoppingBag, color: "#3B82F6" },
      { title: "Orders Shipped", value: fmtInt(r?.shippedOrders ?? 0), change: "in transit+", up: true, icon: Truck, color: "#10B981" },
      { title: "On-Time Delivery", value: `${r?.onTimeDeliveryPct ?? 0}%`, change: "delivered", up: (r?.onTimeDeliveryPct ?? 0) >= 50, icon: CheckCircle2, color: "#3B82F6" },
      { title: "Task Completion", value: `${r?.taskCompletionPct ?? 0}%`, change: `${fmtInt(r?.completedTasks ?? 0)} done`, up: true, icon: Clock, color: "#F59E0B" },
      { title: "Inventory Turns", value: String(r?.inventoryTurns ?? 0), change: `${fmtInt(r?.reservedUnits ?? 0)} reserved`, up: true, icon: DollarSign, color: "#8B5CF6" },
    ];
  }, [report]);

  // Top warehouses by units (share of total) for the donut.
  const topWarehouses = useMemo(() => {
    const whs = report?.warehouses ?? [];
    const total = whs.reduce((s, w) => s + w.units, 0);
    return whs.slice(0, 6).map((w, i) => ({
      name: w.warehouse,
      pct: total > 0 ? Math.round((w.units / total) * 1000) / 10 : 0,
      color: WH_COLORS[i % WH_COLORS.length],
    }));
  }, [report]);

  const totalWhUnits = useMemo(
    () => (report?.warehouses ?? []).reduce((s, w) => s + w.units, 0),
    [report],
  );

  // Warehouse performance summary table.
  const whSummary = useMemo(
    () =>
      (report?.warehouses ?? []).map((w) => ({
        name: w.warehouse,
        orders: fmtInt(w.orders),
        shipped: fmtInt(w.shipped),
        onTime: `${w.onTimePct}%`,
        cycle: `${w.tasks} tasks`,
        perDay: fmtInt(w.units),
      })),
    [report],
  );

  function cycleGran() {
    setGran(GRANS[(GRANS.indexOf(gran) + 1) % GRANS.length]);
  }

  const W = 760, H = 230, padL = 30, padB = 24, padT = 10, yMax = 120;

  // Current chart dataset, deterministically derived from category + granularity.
  const series = useMemo(() => {
    const n = GRAN_POINTS[gran];
    return CATEGORY_SERIES[activeCat].map((name, i) => ({
      name,
      color: SERIES_COLORS[i],
      pts: seededSeries(`op-chart-${activeCat}-${gran}-${name}`, n, 30 - i * 8, 110 - i * 12),
    }));
  }, [activeCat, gran]);

  const tableRows = useMemo(() => rowsForCategory(activeCat), [activeCat]);

  const nPts = GRAN_POINTS[gran];
  const x = (i: number) => padL + (i * (W - padL - 10)) / Math.max(1, nPts - 1);
  const y = (v: number) => padT + (1 - v / yMax) * (H - padT - padB);

  function exportCurrent() {
    exportToCsv(`${slugify(activeCat)}-by-channel`, tableRows, [
      { key: "name", header: "Channel" },
      { key: "orders", header: "Orders" },
      { key: "shipped", header: "Shipped" },
      { key: "delivered", header: "Delivered" },
      { key: "onTime", header: "On-Time Delivery" },
      { key: "cycle", header: "Avg Cycle Time" },
    ]);
    toast(`Exported ${activeCat} (${tableRows.length} channels) to CSV`);
  }

  function exportSeries() {
    const rows = Array.from({ length: nPts }, (_, i) => {
      const row: Record<string, string | number> = { point: `${gran} ${i + 1}` };
      for (const s of series) row[s.name] = s.pts[i];
      return row;
    });
    exportToCsv(`${slugify(activeCat)}-${gran.toLowerCase()}-series`, rows, [
      { key: "point", header: "Period" },
      ...series.map((s) => ({ key: s.name, header: s.name })),
    ]);
    toast(`Exported displayed ${gran.toLowerCase()} series for ${activeCat}`);
  }

  function openSchedule() {
    setSchedDraft(schedule ?? { frequency: "Weekly", day: "Monday", time: "08:00", recipients: "" });
    setScheduleOpen(true);
  }

  function saveSchedule() {
    const recipients = schedDraft.recipients.split(",").map((s) => s.trim()).filter(Boolean);
    if (recipients.length === 0 || recipients.some((r) => !EMAIL_RE.test(r))) {
      toast("Enter one or more valid recipient email addresses", "error");
      return;
    }
    setSchedule({ ...schedDraft });
    setScheduleOpen(false);
    toast(`${activeCat} report scheduled ${schedDraft.frequency.toLowerCase()}`);
  }

  const chartTitle = activeCat === "Order Performance" ? "Order Volume Over Time" : `${activeCat} Over Time`;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-text-light">
        <a href="/dashboard" className="hover:text-action-blue">Dashboard</a>
        <ChevronRight className="w-3 h-3" />
        <a href="/dashboard/reports" className="hover:text-action-blue">Reports</a>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text-muted font-medium">Operational Reports</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0">
              <LineChart className="w-[18px] h-[18px] text-action-blue" />
            </span>
            <h1 className="text-[24px] font-bold text-text-primary leading-none">Operational Reports</h1>
            {schedule && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] text-[11px] font-medium">
                <CalendarClock className="w-3 h-3" />
                Scheduled · {schedule.frequency}
              </span>
            )}
          </div>
          <p className="text-[14px] text-text-muted mt-1">Gain visibility into your operations and make data-driven decisions.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeMenu
            value={range}
            icon="clock"
            onSelect={(r) => { setRange(r); toast(`Operational reports scoped to ${r}`, "info"); }}
            presets={["May 1 – May 31, 2025", "Last 7 days", "Last 30 days", "This quarter", "Year to date"]}
          />
          <button onClick={openSchedule} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <CalendarClock className="w-4 h-4 text-[#64748B]" />Schedule Report
          </button>
          <button onClick={exportCurrent} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Download className="w-4 h-4 text-[#64748B]" />Export
          </button>
          <button onClick={() => toast("Custom report builder opened", "info")} className="flex items-center gap-2 px-3.5 py-2 bg-action-blue text-white rounded-lg text-[13px] font-medium hover:bg-action-blue/90 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Plus className="w-4 h-4" />Create Custom Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-[#64748B]">{s.title}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                  <Icon className="w-[18px] h-[18px]" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#1E293B] leading-none">{loading ? "—" : s.value}</p>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[12px] font-semibold ${
                    s.up ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {s.change}
                </span>
                <span className="text-[12px] text-[#94A3B8]">vs last 30 days</span>
              </div>
              <div className="mt-2">
                <Sparkline color={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterPill value={whFilter} options={FILTER_OPTIONS.Warehouse} onSelect={(v) => { setWhFilter(v); toast(`Warehouse: ${v}`, "info"); }} />
        <FilterPill value={chFilter} options={FILTER_OPTIONS.Channel} onSelect={(v) => { setChFilter(v); toast(`Channel: ${v}`, "info"); }} />
        <FilterPill value={otFilter} options={FILTER_OPTIONS["Order Type"]} onSelect={(v) => { setOtFilter(v); toast(`Order type: ${v}`, "info"); }} />
      </div>

      {/* Volume chart + Report Categories */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.9fr 1fr" }}>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">{chartTitle}</h3>
            <div className="flex items-center gap-2">
              <button onClick={exportSeries} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:bg-[#F8FAFC]"><Download className="w-3.5 h-3.5 text-[#94A3B8]" />Export</button>
              <button onClick={cycleGran} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:bg-[#F8FAFC]">{gran} <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" /></button>
            </div>
          </div>
          <div className="flex items-center gap-5 mb-3">
            {series.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-[11px] text-[#64748B]">{s.name}</span></div>
            ))}
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 230 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={padL} y1={padT + i * ((H - padT - padB) / 4)} x2={W - 10} y2={padT + i * ((H - padT - padB) / 4)} stroke="#F1F5F9" strokeWidth="1" />
            ))}
            {GRAN_YLABELS[gran].map((l, i) => (
              <text key={i} x={padL - 6} y={padT + i * ((H - padT - padB) / 4) + 3} textAnchor="end" fontSize="9" fill="#94A3B8">{l}</text>
            ))}
            {series.map((s, si) => (
              <g key={si}>
                <polyline fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={s.pts.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
                {s.pts.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="white" stroke={s.color} strokeWidth="1.5" />)}
              </g>
            ))}
            {GRAN_XLABELS[gran].map((l, i) => (
              <text key={i} x={padL + i * ((W - padL - 10) / Math.max(1, GRAN_XLABELS[gran].length - 1))} y={H - 6} textAnchor="middle" fontSize="9" fill="#94A3B8">{l}</text>
            ))}
          </svg>
        </div>

        {/* Report Categories */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] font-semibold text-[#1E293B] mb-3">Report Categories</h3>
          <div className="space-y-1">
            {reportCats.map((c) => {
              const Icon = c.icon;
              const active = activeCat === c.name;
              return (
                <button key={c.name} onClick={() => setActiveCat(c.name)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${active ? "bg-action-blue/10 text-action-blue" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}>
                  <Icon className="w-4 h-4" />{c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Channel table + Top Warehouses donut */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.9fr 1fr" }}>
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="px-5 py-4 border-b border-[#E2E8F0]"><h3 className="text-[16px] font-semibold text-[#1E293B]">{activeCat} by Channel</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Channel", "Orders", "Shipped", "Delivered", "On-Time Delivery", "Avg. Cycle Time"].map((h, i) => (
                    <th key={h} className={`text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((c) => (
                  <tr key={c.name} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-[13px] font-medium text-[#1E293B]">{c.name}</span></div></td>
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B] text-right">{c.orders}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{c.shipped}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{c.delivered}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-[#065F46] text-right">{c.onTime}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{c.cycle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-[#E2E8F0] text-right"><button onClick={exportCurrent} className="text-[13px] font-medium text-action-blue hover:underline">View full report →</button></div>
        </div>

        {/* Top Warehouses donut */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Top Warehouses by Units</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-[160px] h-[160px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {topWarehouses.map((w, i) => { const off = topWarehouses.slice(0, i).reduce((s, x) => s + x.pct, 0); const dash = `${w.pct * 2.51327} ${251.327 - w.pct * 2.51327}`; return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={w.color} strokeWidth="12" strokeDasharray={dash} strokeDashoffset={-off * 2.51327} strokeLinecap="round" />; })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#1E293B]">{fmtInt(totalWhUnits)}</p>
                  <p className="text-[10px] text-[#64748B]">Units</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {topWarehouses.length === 0 && !loading && (
                <p className="text-[13px] text-[#94A3B8]">No warehouse data</p>
              )}
              {topWarehouses.map((w) => (
                <div key={w.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: w.color }} />
                    <span className="text-[#475569] truncate">{w.name}</span>
                  </div>
                  <span className="font-medium text-[#1E293B] shrink-0 ml-2">{w.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Performance Summary + On-Time Trend / Insights */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.9fr 1fr" }}>
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="px-5 py-4 border-b border-[#E2E8F0]"><h3 className="text-[16px] font-semibold text-[#1E293B]">Warehouse Performance Summary</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Warehouse", "Orders", "Shipped", "On-Time Delivery", "Open Tasks", "On-Hand Units"].map((h, i) => (
                    <th key={h} className={`text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {whSummary.length === 0 && !loading && (
                  <tr><td colSpan={6} className="px-5 py-6 text-center text-[13px] text-[#94A3B8]">No warehouse activity yet</td></tr>
                )}
                {whSummary.map((w) => (
                  <tr key={w.name} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B]">{w.name}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B] text-right">{w.orders}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{w.shipped}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-[#065F46] text-right">{w.onTime}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{w.cycle}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{w.perDay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-[#E2E8F0] text-right"><button onClick={() => { exportToCsv("warehouse-performance-summary", whSummary, [{ key: "name", header: "Warehouse" }, { key: "orders", header: "Orders" }, { key: "shipped", header: "Shipped" }, { key: "onTime", header: "On-Time Delivery" }, { key: "cycle", header: "Avg Cycle Time" }, { key: "perDay", header: "Orders / Day" }]); toast(`Exported ${whSummary.length} warehouses to CSV`); }} className="text-[13px] font-medium text-action-blue hover:underline">View full report →</button></div>
        </div>

        {/* right column */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[15px] font-semibold text-[#1E293B]">On-Time Delivery Trend</h3>
              <span className="text-[13px] font-bold text-[#1E293B]">93.2% <span className="text-[11px] font-medium text-[#10B981]">+4.6 pp</span></span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mb-3">vs Apr 1 – Apr 30</p>
            <svg viewBox="0 0 360 150" className="w-full" style={{ height: 150 }}>
              {[0, 1, 2, 3, 4].map((i) => (<line key={i} x1="30" y1={8 + i * 28} x2="352" y2={8 + i * 28} stroke="#F1F5F9" strokeWidth="1" />))}
              {["100%", "75%", "50%", "25%", "0"].map((l, i) => (<text key={i} x="26" y={11 + i * 28} textAnchor="end" fontSize="8" fill="#94A3B8">{l}</text>))}
              <polyline fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={[78, 74, 76, 70, 72, 64, 60, 56, 50, 44].map((v, i) => `${30 + i * 35.7},${8 + (v / 100) * 112}`).join(" ")} />
              {[78, 74, 76, 70, 72, 64, 60, 56, 50, 44].map((v, i) => <circle key={i} cx={30 + i * 35.7} cy={8 + (v / 100) * 112} r="2.5" fill="white" stroke="#3B82F6" strokeWidth="1.5" />)}
              {["May 1", "May 11", "May 21", "May 31"].map((l, i) => (<text key={i} x={30 + i * 107} y="146" textAnchor="middle" fontSize="8" fill="#94A3B8">{l}</text>))}
            </svg>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
            <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Report Insights</h3>
            <div className="space-y-3">
              {[
                { dot: "#3B82F6", text: "Order volume increased by 10.8% compared to the previous 30 days." },
                { dot: "#10B981", text: "On-time delivery improved by 4.6 pp after route optimization." },
                { dot: "#F59E0B", text: "Fulfillment cost per order decreased by 4.2% with batch processing." },
              ].map((ins, i) => (
                <div key={i} className="flex gap-3"><span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ins.dot }} /><p className="text-[13px] text-[#475569] leading-relaxed">{ins.text}</p></div>
              ))}
            </div>
            <button onClick={() => toast("Opening full insights report", "info")} className="inline-block mt-4 text-[13px] font-medium text-action-blue hover:underline">View all insights →</button>
          </div>
        </div>
      </div>

      {/* Schedule modal */}
      <Modal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule report"
        description={`Deliver the ${activeCat} report automatically to your team.`}
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setScheduleOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveSchedule}>Save schedule</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Frequency">
            <FormSelect
              options={[...FREQUENCIES]}
              value={schedDraft.frequency}
              onChange={(e) => {
                const frequency = e.target.value as Schedule["frequency"];
                setSchedDraft((d) => ({
                  ...d,
                  frequency,
                  day: frequency === "Weekly" ? WEEK_DAYS[0] : frequency === "Monthly" ? MONTH_DAYS[0] : "",
                }));
              }}
            />
          </Field>
          {schedDraft.frequency !== "Daily" && (
            <Field label={schedDraft.frequency === "Weekly" ? "Day of week" : "Day of month"}>
              <FormSelect
                options={schedDraft.frequency === "Weekly" ? WEEK_DAYS : MONTH_DAYS}
                value={schedDraft.day}
                onChange={(e) => setSchedDraft((d) => ({ ...d, day: e.target.value }))}
              />
            </Field>
          )}
          <Field label="Send at">
            <TextInput type="time" value={schedDraft.time} onChange={(e) => setSchedDraft((d) => ({ ...d, time: e.target.value }))} />
          </Field>
          <Field label="Recipients" required hint="Comma-separated email addresses">
            <TextInput
              value={schedDraft.recipients}
              onChange={(e) => setSchedDraft((d) => ({ ...d, recipients: e.target.value }))}
              placeholder="ops@company.com, finance@company.com"
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
