"use client";

import { useMemo, useState } from "react";
import {
  ShoppingBag, DollarSign, CheckCircle2, Package,
  ArrowUpRight, ArrowDownRight, ChevronDown,
  MoreVertical, Download, RefreshCw,
} from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";

type Gran = "Daily" | "Weekly" | "Monthly";
const GRANULARITIES: Gran[] = ["Daily", "Weekly", "Monthly"];

/* ---- deterministic per-range datasets ---- */

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
  return String(v);
}

type RangeStat = { value: string; change: string; positive: boolean };
type RangeMeta = {
  period: string;
  orders: RangeStat; revenue: RangeStat; onTime: RangeStat; shipments: RangeStat;
  labels: Record<Gran, string[]>;
};

const RANGE_META: Record<string, RangeMeta> = {
  "May 12 – May 18, 2025": {
    period: "vs prior 7 days",
    orders: { value: "12,842", change: "+8.5%", positive: true },
    revenue: { value: "$1.62M", change: "+10.3%", positive: true },
    onTime: { value: "97.4%", change: "+1.2%", positive: true },
    shipments: { value: "11,205", change: "+7.2%", positive: true },
    labels: {
      Daily: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
      Weekly: ["Mon–Tue", "Wed–Thu", "Fri–Sun"],
      Monthly: ["Week of May 12"],
    },
  },
  "Last 7 days": {
    period: "vs prior 7 days",
    orders: { value: "13,107", change: "+9.1%", positive: true },
    revenue: { value: "$1.68M", change: "+11.0%", positive: true },
    onTime: { value: "97.6%", change: "+0.9%", positive: true },
    shipments: { value: "11,562", change: "+8.0%", positive: true },
    labels: {
      Daily: ["Jun 7", "Jun 8", "Jun 9", "Jun 10", "Jun 11", "Jun 12", "Jun 13"],
      Weekly: ["Sat–Sun", "Mon–Wed", "Thu–Fri"],
      Monthly: ["Week of Jun 7"],
    },
  },
  "Last 30 days": {
    period: "vs prior 30 days",
    orders: { value: "52,318", change: "+6.4%", positive: true },
    revenue: { value: "$6.45M", change: "+7.8%", positive: true },
    onTime: { value: "96.8%", change: "-0.4%", positive: false },
    shipments: { value: "46,904", change: "+5.9%", positive: true },
    labels: {
      Daily: ["May 15", "May 20", "May 25", "May 30", "Jun 4", "Jun 9", "Jun 13"],
      Weekly: ["Week 20", "Week 21", "Week 22", "Week 23", "Week 24"],
      Monthly: ["May", "Jun"],
    },
  },
  "This quarter": {
    period: "vs prior quarter",
    orders: { value: "148,225", change: "+12.2%", positive: true },
    revenue: { value: "$18.3M", change: "+13.5%", positive: true },
    onTime: { value: "96.2%", change: "+0.8%", positive: true },
    shipments: { value: "133,610", change: "+10.6%", positive: true },
    labels: {
      Daily: ["Apr 1", "Apr 15", "Apr 30", "May 15", "May 31", "Jun 13"],
      Weekly: ["Apr W1", "Apr W3", "May W1", "May W3", "Jun W1", "Jun W2"],
      Monthly: ["Apr", "May", "Jun"],
    },
  },
  "Year to date": {
    period: "vs same period last year",
    orders: { value: "276,480", change: "+14.6%", positive: true },
    revenue: { value: "$34.1M", change: "+15.2%", positive: true },
    onTime: { value: "95.9%", change: "+1.5%", positive: true },
    shipments: { value: "249,973", change: "+12.9%", positive: true },
    labels: {
      Daily: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      Weekly: ["W4", "W8", "W12", "W16", "W20", "W24"],
      Monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
  },
};

const RANGE_PRESETS = Object.keys(RANGE_META);

const STAT_DEFS = [
  { key: "orders" as const, title: "Total Orders", icon: ShoppingBag, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { key: "revenue" as const, title: "Total Revenue", icon: DollarSign, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { key: "onTime" as const, title: "On-Time Delivery", icon: CheckCircle2, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { key: "shipments" as const, title: "Total Shipments", icon: Package, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
];

const topProducts = [
  { name: "MeshFlex Backpack", sku: "BAG-001", orders: "1,245", revenue: "$86,750", trend: "+12.4%", up: true },
  { name: "Urban Explorer Jacket", sku: "JKT-208", orders: "987", revenue: "$148,050", trend: "+8.1%", up: true },
  { name: "Trail Runner Shoes", sku: "SHO-114", orders: "876", revenue: "$131,400", trend: "+5.2%", up: true },
  { name: "Packable Tote", sku: "BAG-009", orders: "754", revenue: "$98,020", trend: "-2.1%", up: false },
  { name: "Thermo Bottle 750ml", sku: "ACC-045", orders: "645", revenue: "$64,500", trend: "+3.8%", up: true },
];

const regions = [
  { name: "North America", pct: 40.7, color: "#3B82F6" },
  { name: "Europe", pct: 24.3, color: "#60A5FA" },
  { name: "Asia Pacific", pct: 18.9, color: "#06B6A4" },
  { name: "Middle East & Africa", pct: 12.7, color: "#8B5CF6" },
  { name: "Other", pct: 3.4, color: "#EC4899" },
];

/* ---- chart card driven entirely by state ---- */

function TrendChart({ labels, values, color, gradId, yFormat }: {
  labels: string[]; values: number[]; color: string; gradId: string; yFormat: (v: number) => string;
}) {
  const yMax = Math.max(...values) * 1.12;
  const n = labels.length;
  const xs = values.map((_, i) => (n === 1 ? 270 : 50 + (i * 440) / (n - 1)));
  const ys = values.map((v) => 10 + (1 - v / yMax) * 160);
  const line = smoothPath(xs, ys);
  const area = `${line} L${xs[n - 1].toFixed(1)},180 L${xs[0].toFixed(1)},180 Z`;
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
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[n - 1]} cy={ys[n - 1]} r="3.5" fill="white" stroke={color} strokeWidth="2.5" />
      {labels.map((label, i) => (
        <text key={`${label}-${i}`} x={xs[i]} y="196" textAnchor="middle" fontSize="9" fill="#94A3B8">{label}</text>
      ))}
    </svg>
  );
}

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState(RANGE_PRESETS[0]);
  const [ordersGran, setOrdersGran] = useState<Gran>("Daily");
  const [revGran, setRevGran] = useState<Gran>("Daily");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const meta = RANGE_META[range];

  const ordersData = useMemo(() => {
    const labels = meta.labels[ordersGran];
    return { labels, values: seededSeries(`analytics-orders-${range}-${ordersGran}`, labels.length, 2200, 7800) };
  }, [meta, range, ordersGran]);

  const revenueData = useMemo(() => {
    const labels = meta.labels[revGran];
    return { labels, values: seededSeries(`analytics-revenue-${range}-${revGran}`, labels.length, 280000, 980000) };
  }, [meta, range, revGran]);

  function cycle(current: Gran, set: (v: Gran) => void) {
    set(GRANULARITIES[(GRANULARITIES.indexOf(current) + 1) % GRANULARITIES.length]);
  }

  function exportProducts() {
    exportToCsv("analytics-top-products", topProducts, [
      { key: "name", header: "Product" },
      { key: "sku", header: "SKU" },
      { key: "orders", header: "Orders" },
      { key: "revenue", header: "Revenue" },
      { key: "trend", header: "Trend" },
    ]);
    toast(`Exported ${topProducts.length} products to CSV`);
  }

  function exportCurrent() {
    // Export exactly what's on screen: the current chart series and the top-products view.
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
                    onClick={() => { setMenuOpen(false); toast("Analytics refreshed", "success"); }}
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
          const stat = meta[def.key];
          return (
            <div key={def.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[13px] font-medium text-[#64748B]">{def.title}</span>
                <div className={`w-9 h-9 rounded-lg ${def.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${def.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] leading-none font-bold text-[#1E293B]">{stat.value}</p>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[12px] font-semibold ${
                    stat.positive ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  {stat.positive
                    ? <ArrowUpRight className="w-3 h-3" />
                    : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
                <span className="text-[12px] text-[#94A3B8]">{meta.period}</span>
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
            <TrendChart labels={ordersData.labels} values={ordersData.values} color="#3B82F6" gradId="ordersGrad" yFormat={formatK} />
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
            <TrendChart labels={revenueData.labels} values={revenueData.values} color="#06B6A4" gradId="revGrad" yFormat={(v) => `$${formatK(v)}`} />
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
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Orders</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Revenue</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Trend</th>
                </tr>
              </thead>
              <tbody>
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
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B] text-right">{p.orders}</td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B] text-right">{p.revenue}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center gap-0.5 text-[12px] font-semibold ${p.up ? "text-[#065F46]" : "text-[#991B1B]"}`}>
                        {p.up
                          ? <ArrowUpRight className="w-3 h-3" />
                          : <ArrowDownRight className="w-3 h-3" />}
                        {p.trend}
                      </span>
                    </td>
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
                    <circle key={i} cx="50" cy="50" r="40" fill="none"
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
                      <p className="text-[20px] font-bold text-[#1E293B]">{meta.orders.value}</p>
                      <p className="text-[10px] text-[#64748B]">Orders</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Legend (clickable — toggles segment highlight) */}
            <div className="flex-1 space-y-1">
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
