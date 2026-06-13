"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag, DollarSign, CheckCircle2, Package,
  ArrowUpRight, ArrowDownRight, ChevronDown,
  MoreVertical, Download, RefreshCw, Loader2,
} from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import type { AnalyticsSummary } from "@/lib/analytics";

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

// Month bucket "YYYY-MM" → short label "Jan 2025".
function monthLabel(bucket: string): string {
  const [y, m] = bucket.split("-");
  const idx = Number(m) - 1;
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names[idx] ? `${names[idx]} ${y}` : bucket;
}

const REGION_COLORS = ["#3B82F6", "#60A5FA", "#06B6A4", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

const STAT_DEFS = [
  { key: "orders" as const, title: "Total Orders", icon: ShoppingBag, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { key: "revenue" as const, title: "Total Revenue", icon: DollarSign, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { key: "onTime" as const, title: "On-Time Delivery", icon: CheckCircle2, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { key: "shipments" as const, title: "Total Shipments", icon: Package, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
];

const RANGE_PRESETS = ["All time", "Last 7 days", "Last 30 days", "This quarter", "Year to date"];

/* ---- chart card driven entirely by props ---- */

function TrendChart({ labels, values, color, gradId, yFormat }: {
  labels: string[]; values: number[]; color: string; gradId: string; yFormat: (v: number) => string;
}) {
  const yMax = (Math.max(1, ...values)) * 1.12;
  const n = Math.max(labels.length, 1);
  const xs = values.map((_, i) => (n === 1 ? 270 : 50 + (i * 440) / (n - 1)));
  const ys = values.map((v) => 10 + (1 - v / yMax) * 160);
  const line = xs.length ? smoothPath(xs, ys) : "";
  const area = xs.length ? `${line} L${xs[xs.length - 1].toFixed(1)},180 L${xs[0].toFixed(1)},180 Z` : "";
  return (
    <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="40" y1={i * 40 + 10} x2="490" y2={i * 40 + 10} stroke="#F1F5F9" strokeWidth="1" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <text key={i} x="35" y={i * 40 + 18} textAnchor="end" fontSize="9" fill="#94A3B8">
          {yFormat(Math.round(yMax * (1 - i / 4)))}
        </text>
      ))}
      {area && <path d={area} fill={`url(#${gradId})`} />}
      {line && <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
      {xs.length > 0 && (
        <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3.5" fill="white" stroke={color} strokeWidth="2.5" />
      )}
      {labels.map((label, i) => (
        <text key={`${label}-${i}`} x={xs[i]} y="196" textAnchor="middle" fontSize="9" fill="#94A3B8">{label}</text>
      ))}
    </svg>
  );
}

type RangeStat = { value: string; change: string; positive: boolean };

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState(RANGE_PRESETS[0]);
  const [ordersGran, setOrdersGran] = useState<Gran>("Monthly");
  const [revGran, setRevGran] = useState<Gran>("Monthly");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await api.get<AnalyticsSummary>("/api/analytics");
      setSummary(data);
    } catch {
      toast("Failed to load analytics", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get<AnalyticsSummary>("/api/analytics");
        if (!cancelled) setSummary(data);
      } catch {
        if (!cancelled) toast("Failed to load analytics", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real series derived from revenue-by-month. The granularity toggle changes how
  // many of the most recent buckets we show; "Monthly" shows them all.
  const months = summary?.revenueByMonth ?? [];

  function sliceFor(gran: Gran): typeof months {
    if (gran === "Daily") return months.slice(-7);
    if (gran === "Weekly") return months.slice(-4);
    return months;
  }

  const ordersData = useMemo(() => {
    const pts = sliceFor(ordersGran);
    return { labels: pts.map((p) => monthLabel(p.month)), values: pts.map((p) => p.orders) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months, ordersGran]);

  const revenueData = useMemo(() => {
    const pts = sliceFor(revGran);
    return { labels: pts.map((p) => monthLabel(p.month)), values: pts.map((p) => p.revenue) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months, revGran]);

  const stats: Record<"orders" | "revenue" | "onTime" | "shipments", RangeStat> = {
    orders: { value: summary ? formatInt(summary.totalOrders) : "—", change: range, positive: true },
    revenue: { value: summary ? formatMoney(summary.totalRevenue) : "—", change: range, positive: true },
    onTime: { value: summary ? `${summary.onTimeDeliveryPct}%` : "—", change: range, positive: (summary?.onTimeDeliveryPct ?? 0) >= 90 },
    shipments: { value: summary ? formatInt(summary.totalShipments) : "—", change: range, positive: true },
  };

  // Top products + regions come straight from the summary.
  const topProducts = summary?.topProducts ?? [];
  const regions = (summary?.ordersByRegion ?? []).map((r, i) => ({
    name: r.name,
    pct: r.pct,
    orders: r.orders,
    color: REGION_COLORS[i % REGION_COLORS.length],
  }));

  function cycle(current: Gran, set: (v: Gran) => void) {
    set(GRANULARITIES[(GRANULARITIES.indexOf(current) + 1) % GRANULARITIES.length]);
  }

  function exportProducts() {
    exportToCsv("analytics-top-products", topProducts, [
      { key: "name", header: "Product" },
      { key: "sku", header: "SKU" },
      { key: "orders", header: "Units Reserved" },
      { key: "revenue", header: "Stock Value (USD)" },
    ]);
    toast(`Exported ${topProducts.length} products to CSV`);
  }

  function exportCurrent() {
    const seriesRows = ordersData.labels.map((label, i) => ({
      period: label,
      orders: ordersData.values[i],
      revenue: revGran === ordersGran ? revenueData.values[i] ?? "" : "",
    }));
    exportToCsv(`analytics-series-${ordersGran.toLowerCase()}`, seriesRows, [
      { key: "period", header: "Period" },
      { key: "orders", header: "Orders" },
      { key: "revenue", header: "Revenue (USD)" },
    ]);
    exportProducts();
    toast(`Exported displayed series for ${range}`);
  }

  function toggleRegion(name: string) {
    setActiveRegion((prev) => (prev === name ? null : name));
  }

  const activeRegionData = regions.find((r) => r.name === activeRegion) ?? null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[#1E293B]">Analytics</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">Track performance and key metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeMenu
            value={range}
            onSelect={(r) => setRange(r)}
            presets={RANGE_PRESETS}
          />
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 z-40 w-48 bg-white rounded-lg border border-[#E2E8F0] shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-1">
                  <button
                    onClick={() => { setMenuOpen(false); exportCurrent(); }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]"
                  >
                    <Download className="w-4 h-4 text-[#64748B]" /> Export data
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); void refresh(); toast("Analytics refreshed", "success"); }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]"
                  >
                    <RefreshCw className="w-4 h-4 text-[#64748B]" /> Refresh
                  </button>
                </div>
              </>
            )}
          </div>
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
                  {def.key === "revenue" && summary ? `AOV ${formatMoney(summary.avgOrderValue)}` : def.key === "onTime" ? "delivered" : "live"}
                </span>
                <span className="text-[12px] text-[#94A3B8]">{stat.change}</span>
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
            <button onClick={() => cycle(ordersGran, setOrdersGran)} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:bg-[#F8FAFC]">
              {ordersGran} <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>
          <div className="h-[200px]">
            {ordersData.values.length > 0 ? (
              <TrendChart labels={ordersData.labels} values={ordersData.values} color="#3B82F6" gradId="ordersGrad" yFormat={formatK} />
            ) : (
              <div className="h-full flex items-center justify-center text-[13px] text-[#94A3B8]">No order data yet</div>
            )}
          </div>
        </div>

        {/* Line Chart - Revenue Over Time */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Revenue Over Time</h3>
            <button onClick={() => cycle(revGran, setRevGran)} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:bg-[#F8FAFC]">
              {revGran} <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>
          <div className="h-[200px]">
            {revenueData.values.length > 0 ? (
              <TrendChart labels={revenueData.labels} values={revenueData.values} color="#06B6A4" gradId="revGrad" yFormat={(v) => `$${formatK(v)}`} />
            ) : (
              <div className="h-full flex items-center justify-center text-[13px] text-[#94A3B8]">No revenue data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Products + Orders by Region */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        {/* Top Products Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Top Products</h3>
            <button onClick={exportProducts} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] border border-[#E2E8F0] rounded-lg px-3 py-1.5 hover:bg-[#F8FAFC] transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Product</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Reserved</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Stock Value</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length === 0 && !loading && (
                  <tr><td colSpan={3} className="px-5 py-6 text-center text-[13px] text-[#94A3B8]">No products yet</td></tr>
                )}
                {topProducts.map((p) => (
                  <tr key={p.sku} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-4 h-4 text-[#94A3B8]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#1E293B]">{p.name}</p>
                          <p className="text-[11px] text-[#94A3B8]">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B] text-right">{formatInt(p.orders)}</td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B] text-right">{formatMoney(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders by Region Donut */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Orders by Region</h3>
          <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="relative w-[160px] h-[160px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {regions.map((r, i) => {
                  const offset = regions.slice(0, i).reduce((s, x) => s + x.pct, 0);
                  const dashArray = `${r.pct * 2.51327} ${251.327 - r.pct * 2.51327}`;
                  const dimmed = activeRegion !== null && activeRegion !== r.name;
                  return (
                    <circle key={r.name} cx="50" cy="50" r="40" fill="none"
                      stroke={r.color} strokeWidth="12" strokeDasharray={dashArray} strokeDashoffset={-offset * 2.51327}
                      strokeLinecap="round" opacity={dimmed ? 0.2 : 1}
                      className="transition-opacity cursor-pointer"
                      onClick={() => toggleRegion(r.name)} />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  {activeRegionData ? (
                    <>
                      <p className="text-[20px] font-bold" style={{ color: activeRegionData.color }}>{activeRegionData.pct}%</p>
                      <p className="text-[10px] text-[#64748B] max-w-[80px] leading-tight">{activeRegionData.name}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[20px] font-bold text-[#1E293B]">{summary ? formatInt(summary.totalOrders) : "—"}</p>
                      <p className="text-[10px] text-[#64748B]">Orders</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Legend (clickable — toggles segment highlight) */}
            <div className="flex-1 space-y-1">
              {regions.length === 0 && !loading && (
                <p className="text-[13px] text-[#94A3B8]">No regional data</p>
              )}
              {regions.map((r) => {
                const isActive = activeRegion === r.name;
                const dimmed = activeRegion !== null && !isActive;
                return (
                  <button
                    key={r.name}
                    onClick={() => toggleRegion(r.name)}
                    className={`w-full flex items-center justify-between text-[13px] px-2 py-1.5 rounded-md transition-colors ${
                      isActive ? "bg-[#F1F5F9]" : "hover:bg-[#F8FAFC]"
                    } ${dimmed ? "opacity-40" : ""}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                      <span className="text-[#475569] truncate">{r.name}</span>
                    </div>
                    <span className="font-medium text-[#1E293B] shrink-0 ml-2">{r.pct}%</span>
                  </button>
                );
              })}
              {activeRegion && (
                <button onClick={() => setActiveRegion(null)} className="text-[12px] font-medium text-[#3B82F6] hover:underline px-2 pt-1">
                  Reset highlight
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
