"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, DollarSign, CheckCircle2, Package,
  ArrowUpRight, ArrowDownRight, ChevronDown, MoreVertical, Eye, Download, Loader2,
} from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import type { AnalyticsSummary } from "@/lib/analytics";
import type { Order } from "@/types";

type Gran = "Daily" | "Weekly" | "Monthly";
const GRANULARITIES: Gran[] = ["Daily", "Weekly", "Monthly"];

/* ---- chart helpers ---- */

function smoothPath(xs: number[], ys: number[]): string {
  let d = `M${xs[0].toFixed(1)},${ys[0].toFixed(1)}`;
  for (let i = 1; i < xs.length; i++) {
    const mx = ((xs[i - 1] + xs[i]) / 2).toFixed(1);
    d += ` C${mx},${ys[i - 1].toFixed(1)} ${mx},${ys[i].toFixed(1)} ${xs[i].toFixed(1)},${ys[i].toFixed(1)}`;
  }
  return d;
}

function formatK(v: number): string {
  if (v >= 1000) {
    const k = v / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return String(Math.round(v));
}

function formatMoney(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  return `$${Math.round(v)}`;
}

function formatInt(v: number): string {
  return v.toLocaleString("en-US");
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Month bucket "YYYY-MM" → short label "Jan 2025".
function monthLabel(bucket: string): string {
  const [y, m] = bucket.split("-");
  const idx = Number(m) - 1;
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names[idx] ? `${names[idx]} ${y}` : bucket;
}

// Friendly "x ago" from an ISO date (day-level granularity is all the data gives us).
function timeAgo(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const days = Math.round((Date.now() - d.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.round(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

const REGION_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6A4", "#EC4899", "#94A3B8"];

const STAT_DEFS = [
  { key: "orders" as const, title: "Total Orders", icon: ShoppingBag, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { key: "shipments" as const, title: "Total Shipments", icon: Package, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { key: "onTime" as const, title: "On-Time Delivery", icon: CheckCircle2, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { key: "revenue" as const, title: "Total Revenue", icon: DollarSign, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
];

const RANGE_PRESETS = ["All time", "Last 7 days", "Last 30 days", "This quarter", "Year to date"];

// How many of the most recent months a range preset keeps.
function monthsForRange(range: string): number {
  switch (range) {
    case "Last 7 days": return 1;
    case "Last 30 days": return 1;
    case "This quarter": return 3;
    case "Year to date": return 12;
    default: return Infinity; // All time
  }
}

type ActivityKind = "Orders" | "Shipments" | "System";
const ACTIVITY_FILTERS: ("All" | ActivityKind)[] = ["All", "Orders", "Shipments", "System"];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Delivered": "bg-[#D1FAE5] text-[#065F46]",
    "In Transit": "bg-[#DBEAFE] text-[#1E40AF]",
    "Out for Delivery": "bg-[#DBEAFE] text-[#1E40AF]",
    "Processing": "bg-[#EDE9FE] text-[#5B21B6]",
    "Pending": "bg-[#FEF3C7] text-[#92400E]",
    "Cancelled": "bg-[#FEE2E2] text-[#991B1B]",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[status] || "bg-[#F1F5F9] text-[#475569]"}`}>
      {status}
    </span>
  );
}

type RangeStat = { value: string; sub: string; positive: boolean };

export default function DashboardOverview() {
  const { toast } = useToast();
  const [range, setRange] = useState(RANGE_PRESETS[0]);
  const [ordersGran, setOrdersGran] = useState<Gran>("Monthly");
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<"All" | ActivityKind>("All");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [summaryData, ordersRes] = await Promise.all([
          api.get<AnalyticsSummary>("/api/analytics"),
          api.get<{ data: Order[]; total: number }>("/api/orders"),
        ]);
        if (!cancelled) {
          setSummary(summaryData);
          setOrders(ordersRes.data);
        }
      } catch {
        if (!cancelled) toast("Failed to load dashboard data", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Range-aware monthly buckets (the date selector actually re-slices) ----
  const rangedMonths = useMemo(() => {
    const months = summary?.revenueByMonth ?? [];
    const cap = monthsForRange(range);
    return cap === Infinity ? months : months.slice(-cap);
  }, [summary, range]);

  // The granularity toggle picks how many of the ranged buckets the chart shows.
  const ordersChart = useMemo(() => {
    const pts =
      ordersGran === "Daily" ? rangedMonths.slice(-7)
        : ordersGran === "Weekly" ? rangedMonths.slice(-4)
          : rangedMonths;
    return { labels: pts.map((p) => monthLabel(p.month)), values: pts.map((p) => p.orders) };
  }, [rangedMonths, ordersGran]);

  // Stat cards — real totals from the summary.
  const stats: Record<"orders" | "shipments" | "onTime" | "revenue", RangeStat> = {
    orders: { value: summary ? formatInt(summary.totalOrders) : "—", sub: "total", positive: true },
    shipments: { value: summary ? formatInt(summary.totalShipments) : "—", sub: "dispatched", positive: true },
    onTime: {
      value: summary ? `${summary.onTimeDeliveryPct}%` : "—",
      sub: "delivered on time",
      positive: (summary?.onTimeDeliveryPct ?? 0) >= 90,
    },
    revenue: {
      value: summary ? formatMoney(summary.totalRevenue) : "—",
      sub: summary ? `AOV ${formatMoney(summary.avgOrderValue)}` : "revenue",
      positive: true,
    },
  };

  // Top shipping locations donut — real ordersByRegion (destinations).
  const regions = useMemo(
    () => (summary?.ordersByRegion ?? []).slice(0, 6).map((r, i) => ({
      name: r.name,
      pct: r.pct,
      orders: r.orders,
      color: REGION_COLORS[i % REGION_COLORS.length],
    })),
    [summary],
  );
  const regionTotalOrders = regions.reduce((s, r) => s + r.orders, 0);

  // Recent orders — the latest few by date from /api/orders.
  const recentOrders = useMemo(
    () => [...orders]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, 6),
    [orders],
  );

  // Activity feed — derived from the recent orders + their real statuses.
  const activityFeed = useMemo(() => {
    return recentOrders.map((o) => {
      let kind: ActivityKind;
      let dot: string;
      let text: string;
      if (o.status === "Delivered") {
        kind = "Shipments"; dot = "bg-[#10B981]";
        text = `Order ${o.id} delivered to ${o.destination ?? o.customer}`;
      } else if (o.status === "In Transit") {
        kind = "Shipments"; dot = "bg-[#3B82F6]";
        text = `Order ${o.id} in transit to ${o.destination ?? o.customer}`;
      } else if (o.status === "Cancelled") {
        kind = "System"; dot = "bg-[#EF4444]";
        text = `Order ${o.id} cancelled (${o.customer})`;
      } else {
        kind = "Orders"; dot = "bg-[#3B82F6]";
        text = `Order ${o.id} ${o.status.toLowerCase()} for ${o.customer}`;
      }
      return { id: o.id, text, dot, kind, time: timeAgo(o.date) };
    });
  }, [recentOrders]);

  const filteredActivity = activityFilter === "All"
    ? activityFeed
    : activityFeed.filter((a) => a.kind === activityFilter);

  // ---- Chart geometry ----
  const chart = useMemo(() => {
    const { labels, values } = ordersChart;
    const yMax = Math.max(1, ...values) * 1.12;
    const n = Math.max(labels.length, 1);
    const xs = values.map((_, i) => (n === 1 ? 270 : 50 + (i * 440) / (n - 1)));
    const ys = values.map((v) => 10 + (1 - v / yMax) * 160);
    return { labels, values, yMax, xs, ys };
  }, [ordersChart]);

  const hasChart = chart.xs.length > 0;
  const linePath = hasChart ? smoothPath(chart.xs, chart.ys) : "";
  const areaPath = hasChart
    ? `${linePath} L${chart.xs[chart.xs.length - 1].toFixed(1)},180 L${chart.xs[0].toFixed(1)},180 Z`
    : "";

  function cycleOrders() {
    setOrdersGran(GRANULARITIES[(GRANULARITIES.indexOf(ordersGran) + 1) % GRANULARITIES.length]);
  }

  function exportSeries() {
    const rows = chart.labels.map((label, i) => ({ period: label, orders: chart.values[i] }));
    exportToCsv(`overview-orders-${ordersGran.toLowerCase()}`, rows, [
      { key: "period", header: "Period" },
      { key: "orders", header: "Orders" },
    ]);
    toast(`Exported ${rows.length} ${ordersGran.toLowerCase()} data points for ${range}`);
  }

  function exportRecent() {
    exportToCsv("recent-orders", recentOrders, [
      { key: "id", header: "Order ID" },
      { key: "customer", header: "Customer" },
      { key: "status", header: "Status" },
      { key: "date", header: "Order Date" },
      { key: "destination", header: "Destination" },
      { key: "total", header: "Total" },
    ]);
    toast(`Exported ${recentOrders.length} orders to CSV`);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[#1E293B]">Overview</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">Welcome back! Here&apos;s what&apos;s happening with your operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeMenu
            value={range}
            onSelect={(r) => setRange(r)}
            presets={RANGE_PRESETS}
          />
          <button
            onClick={exportSeries}
            className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0 hover:bg-[#F8FAFC] transition-colors"
          >
            <Download className="w-4 h-4 text-[#64748B]" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_DEFS.map((def) => {
          const Icon = def.icon;
          const stat = stats[def.key];
          return (
            <div key={def.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[13px] font-medium text-[#64748B]">{def.title}</span>
                <div className={`w-9 h-9 rounded-lg ${def.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${def.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] leading-none font-bold text-[#1E293B]">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-[#CBD5E1]" /> : stat.value}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[12px] font-semibold ${
                    stat.positive ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  {stat.positive
                    ? <ArrowUpRight className="w-3 h-3" />
                    : <ArrowDownRight className="w-3 h-3" />}
                  {stat.sub}
                </span>
                <span className="text-[12px] text-[#94A3B8]">{range}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Line Chart - Orders Over Time */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Orders Over Time</h3>
            <button onClick={cycleOrders} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:bg-[#F8FAFC]">
              {ordersGran} <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>
          <div className="h-[200px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#CBD5E1]" />
              </div>
            ) : hasChart ? (
              <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="40" y1={i * 40 + 10} x2="490" y2={i * 40 + 10} stroke="#F1F5F9" strokeWidth="1" />
                ))}
                {/* Y-axis labels */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <text key={i} x="35" y={i * 40 + 18} textAnchor="end" fontSize="9" fill="#94A3B8">
                    {formatK(Math.round(chart.yMax * (1 - i / 4)))}
                  </text>
                ))}
                {/* Smooth area fill */}
                <path d={areaPath} fill="url(#areaGrad)" />
                {/* Smooth line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Endpoint marker */}
                <circle cx={chart.xs[chart.xs.length - 1]} cy={chart.ys[chart.ys.length - 1]} r="3.5" fill="white" stroke="#3B82F6" strokeWidth="2.5" />
                {/* X-axis labels (selected range + granularity) */}
                {chart.labels.map((label, i) => (
                  <text key={`${label}-${i}`} x={chart.xs[i]} y="196" textAnchor="middle" fontSize="8" fill="#94A3B8">{label}</text>
                ))}
              </svg>
            ) : (
              <div className="h-full flex items-center justify-center text-[13px] text-[#94A3B8]">No order data in this range</div>
            )}
          </div>
        </div>

        {/* Donut Chart - Top Shipping Locations */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Top Shipping Locations</h3>
            <span className="text-[12px] text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md">All Time</span>
          </div>
          {loading ? (
            <div className="h-[160px] flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#CBD5E1]" />
            </div>
          ) : regions.length === 0 ? (
            <div className="h-[160px] flex items-center justify-center text-[13px] text-[#94A3B8]">No destination data yet</div>
          ) : (
            <div className="flex items-center gap-6">
              {/* Donut */}
              <div className="relative w-[160px] h-[160px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {regions.map((loc, i) => {
                    const offset = regions.slice(0, i).reduce((s, l) => s + l.pct, 0);
                    const dashArray = `${loc.pct * 2.51327} ${251.327 - loc.pct * 2.51327}`;
                    return (
                      <circle key={loc.name} cx="50" cy="50" r="40" fill="none"
                        stroke={loc.color} strokeWidth="12" strokeDasharray={dashArray} strokeDashoffset={-offset * 2.51327}
                        strokeLinecap="round" />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[20px] font-bold text-[#1E293B]">{formatInt(regionTotalOrders)}</p>
                    <p className="text-[10px] text-[#64748B]">Orders</p>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="flex-1 space-y-2.5">
                {regions.map((loc) => (
                  <div key={loc.name} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: loc.color }} />
                      <span className="text-[#475569] truncate">{loc.name}</span>
                    </div>
                    <span className="font-medium text-[#1E293B] shrink-0 ml-2">{loc.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-[16px] font-semibold text-[#1E293B]">Recent Orders</h3>
          <div className="flex items-center gap-2">
            <button onClick={exportRecent} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] border border-[#E2E8F0] rounded-lg px-3 py-1.5 hover:bg-[#F8FAFC] transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <Link href="/dashboard/orders" className="text-[13px] font-medium text-[#3B82F6] border border-[#E2E8F0] rounded-lg px-3 py-1.5 hover:bg-[#F8FAFC] transition-colors">
              View all
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Order ID</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Customer</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Status</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Order Date</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Destination</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Total</th>
                <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-5 py-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin text-[#CBD5E1] inline-block" />
                </td></tr>
              )}
              {!loading && recentOrders.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-[13px] text-[#94A3B8]">No orders yet</td></tr>
              )}
              {!loading && recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B]">
                    <Link href={`/dashboard/orders/${order.id}`} className="hover:text-[#3B82F6] transition-colors">{order.id}</Link>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#1E293B]">{order.customer}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{formatDate(order.date)}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{order.destination ?? "—"}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#1E293B] font-medium">{formatMoney(order.total)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="relative inline-block">
                      <button onClick={() => setRowMenu(rowMenu === order.id ? null : order.id)} className="text-[#94A3B8] hover:text-[#64748B]"><MoreVertical className="w-4 h-4" /></button>
                      {rowMenu === order.id && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setRowMenu(null)} />
                          <div className="absolute right-0 mt-1 z-40 w-40 bg-white rounded-lg border border-[#E2E8F0] shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-1 text-left">
                            <Link href={`/dashboard/orders/${order.id}`} onClick={() => setRowMenu(null)} className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]">
                              <Eye className="w-4 h-4 text-[#64748B]" /> View details
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-[#1E293B]">Recent Activity</h3>
          <div className="flex items-center gap-1.5">
            {ACTIVITY_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActivityFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors ${
                  activityFilter === f ? "bg-[#3B82F6] text-white" : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {loading && (
            <div className="py-6 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-[#CBD5E1]" />
            </div>
          )}
          {!loading && filteredActivity.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/orders/${item.id}`}
              className="flex items-center gap-3 py-2 -mx-2 px-2 rounded-md hover:bg-[#F8FAFC] transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${item.dot} shrink-0`} />
              <span className="text-[13px] text-[#1E293B] flex-1">{item.text}</span>
              <span className="text-[11px] font-medium text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-1.5 py-0.5 shrink-0">{item.kind}</span>
              <span className="text-[12px] text-[#94A3B8] shrink-0">{item.time}</span>
            </Link>
          ))}
          {!loading && filteredActivity.length === 0 && (
            <p className="text-[13px] text-[#64748B] py-4 text-center">No {activityFilter.toLowerCase()} activity to show.</p>
          )}
        </div>
      </div>
    </div>
  );
}
