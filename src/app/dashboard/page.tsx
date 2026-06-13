"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, DollarSign, CheckCircle2, Package,
  ArrowUpRight, ArrowDownRight, ChevronDown, MoreVertical, Eye, Download,
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
  orders: RangeStat; shipments: RangeStat; onTime: RangeStat; revenue: RangeStat;
  labels: Record<Gran, string[]>;
  bounds: Record<Gran, [number, number]>;
};

const RANGE_META: Record<string, RangeMeta> = {
  "May 12 – May 18, 2025": {
    period: "vs prior 7 days",
    orders: { value: "12,842", change: "+8.5%", positive: true },
    shipments: { value: "11,205", change: "+7.2%", positive: true },
    onTime: { value: "97.4%", change: "+2.1%", positive: true },
    revenue: { value: "$1.62M", change: "+10.3%", positive: true },
    labels: {
      Daily: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
      Weekly: ["Mon–Tue", "Wed–Thu", "Fri–Sun"],
      Monthly: ["Week of May 12"],
    },
    bounds: { Daily: [3200, 13400], Weekly: [7800, 13400], Monthly: [12000, 13000] },
  },
  "Last 7 days": {
    period: "vs prior 7 days",
    orders: { value: "13,107", change: "+9.1%", positive: true },
    shipments: { value: "11,562", change: "+8.0%", positive: true },
    onTime: { value: "97.6%", change: "+1.8%", positive: true },
    revenue: { value: "$1.68M", change: "+11.0%", positive: true },
    labels: {
      Daily: ["Jun 7", "Jun 8", "Jun 9", "Jun 10", "Jun 11", "Jun 12", "Jun 13"],
      Weekly: ["Sat–Sun", "Mon–Wed", "Thu–Fri"],
      Monthly: ["Week of Jun 7"],
    },
    bounds: { Daily: [3600, 13600], Weekly: [8200, 13600], Monthly: [12400, 13400] },
  },
  "Last 30 days": {
    period: "vs prior 30 days",
    orders: { value: "52,318", change: "+6.4%", positive: true },
    shipments: { value: "46,904", change: "+5.9%", positive: true },
    onTime: { value: "96.8%", change: "-0.4%", positive: false },
    revenue: { value: "$6.45M", change: "+7.8%", positive: true },
    labels: {
      Daily: ["May 15", "May 20", "May 25", "May 30", "Jun 4", "Jun 9", "Jun 13"],
      Weekly: ["Week 20", "Week 21", "Week 22", "Week 23", "Week 24"],
      Monthly: ["May", "Jun"],
    },
    bounds: { Daily: [2800, 13200], Weekly: [9000, 13800], Monthly: [10800, 13600] },
  },
  "This quarter": {
    period: "vs prior quarter",
    orders: { value: "148,225", change: "+12.2%", positive: true },
    shipments: { value: "133,610", change: "+10.6%", positive: true },
    onTime: { value: "96.2%", change: "+0.8%", positive: true },
    revenue: { value: "$18.3M", change: "+13.5%", positive: true },
    labels: {
      Daily: ["Apr 1", "Apr 15", "Apr 30", "May 15", "May 31", "Jun 13"],
      Weekly: ["Apr W1", "Apr W3", "May W1", "May W3", "Jun W1", "Jun W2"],
      Monthly: ["Apr", "May", "Jun"],
    },
    bounds: { Daily: [2400, 12800], Weekly: [7600, 13400], Monthly: [9600, 13800] },
  },
  "Year to date": {
    period: "vs same period last year",
    orders: { value: "276,480", change: "+14.6%", positive: true },
    shipments: { value: "249,973", change: "+12.9%", positive: true },
    onTime: { value: "95.9%", change: "+1.5%", positive: true },
    revenue: { value: "$34.1M", change: "+15.2%", positive: true },
    labels: {
      Daily: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      Weekly: ["W4", "W8", "W12", "W16", "W20", "W24"],
      Monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    bounds: { Daily: [1800, 12400], Weekly: [5400, 13000], Monthly: [6800, 13800] },
  },
};

const RANGE_PRESETS = Object.keys(RANGE_META);

const STAT_DEFS = [
  { key: "orders" as const, title: "Total Orders", icon: ShoppingBag, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { key: "shipments" as const, title: "Total Shipments", icon: Package, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { key: "onTime" as const, title: "On-Time Delivery", icon: CheckCircle2, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { key: "revenue" as const, title: "Total Revenue", icon: DollarSign, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
];

const recentOrders = [
  { id: "ORD-10458", customer: "Acme Retail", status: "Delivered", shipDate: "May 16, 2025", deliveryDate: "May 19, 2025", total: "$4,285.00" },
  { id: "ORD-10457", customer: "Summit Goods", status: "In Transit", shipDate: "May 16, 2025", deliveryDate: "May 20, 2025", total: "$2,150.75" },
  { id: "ORD-10456", customer: "Peak Supplies", status: "Processing", shipDate: "May 15, 2025", deliveryDate: "May 19, 2025", total: "$1,980.50" },
  { id: "ORD-10455", customer: "Beta Imports", status: "Delivered", shipDate: "May 14, 2025", deliveryDate: "May 17, 2025", total: "$3,420.00" },
  { id: "ORD-10454", customer: "Gamma Corp", status: "Pending", shipDate: "May 14, 2025", deliveryDate: "May 18, 2025", total: "$890.25" },
];

const shippingLocations = [
  { name: "Los Angeles, CA", pct: 28.4, color: "#3B82F6" },
  { name: "Chicago, IL", pct: 14.3, color: "#10B981" },
  { name: "Atlanta, GA", pct: 12.5, color: "#F59E0B" },
  { name: "New York, NY", pct: 9.8, color: "#EF4444" },
  { name: "Houston, TX", pct: 7.5, color: "#8B5CF6" },
  { name: "Other", pct: 27.5, color: "#94A3B8" },
];

type ActivityKind = "Orders" | "Shipments" | "System";
const ACTIVITY_FILTERS: ("All" | ActivityKind)[] = ["All", "Orders", "Shipments", "System"];

const activityFeed: { time: string; text: string; dot: string; kind: ActivityKind }[] = [
  { time: "2 min ago", text: "Order ORD-1006 received from Zeta Global", dot: "bg-[#3B82F6]", kind: "Orders" },
  { time: "15 min ago", text: "Shipment FM-SHIP-201 dispatched to Miami, FL", dot: "bg-[#10B981]", kind: "Shipments" },
  { time: "25 min ago", text: "Order ORD-1005 packed and staged at ATL-1", dot: "bg-[#3B82F6]", kind: "Orders" },
  { time: "1 hour ago", text: "QC inspection passed for Supplier #S-045", dot: "bg-[#10B981]", kind: "System" },
  { time: "2 hours ago", text: "Shipment FM-SHIP-198 delivered in Austin, TX", dot: "bg-[#10B981]", kind: "Shipments" },
  { time: "3 hours ago", text: "Inventory alert: SKU-8834 below reorder point", dot: "bg-[#F59E0B]", kind: "System" },
  { time: "5 hours ago", text: "New supplier Epsilon Manufacturing added to network", dot: "bg-[#8B5CF6]", kind: "System" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Delivered": "bg-[#D1FAE5] text-[#065F46]",
    "In Transit": "bg-[#DBEAFE] text-[#1E40AF]",
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

export default function DashboardOverview() {
  const { toast } = useToast();
  const [range, setRange] = useState(RANGE_PRESETS[0]);
  const [ordersGran, setOrdersGran] = useState<Gran>("Daily");
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<"All" | ActivityKind>("All");

  const meta = RANGE_META[range];

  // Current chart dataset, deterministically derived from range + granularity.
  const chart = useMemo(() => {
    const labels = meta.labels[ordersGran];
    const [min, max] = meta.bounds[ordersGran];
    const values = seededSeries(`home-orders-${range}-${ordersGran}`, labels.length, min, max);
    const yMax = Math.max(...values) * 1.12;
    const n = labels.length;
    const xs = values.map((_, i) => (n === 1 ? 270 : 50 + (i * 440) / (n - 1)));
    const ys = values.map((v) => 10 + (1 - v / yMax) * 160);
    return { labels, values, yMax, xs, ys };
  }, [meta, range, ordersGran]);

  const linePath = smoothPath(chart.xs, chart.ys);
  const areaPath = `${linePath} L${chart.xs[chart.xs.length - 1].toFixed(1)},180 L${chart.xs[0].toFixed(1)},180 Z`;

  function cycleOrders() {
    const next = GRANULARITIES[(GRANULARITIES.indexOf(ordersGran) + 1) % GRANULARITIES.length];
    setOrdersGran(next);
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
      { key: "shipDate", header: "Ship Date" },
      { key: "deliveryDate", header: "Delivery Date" },
      { key: "total", header: "Total" },
    ]);
    toast(`Exported ${recentOrders.length} orders to CSV`);
  }

  const filteredActivity = activityFilter === "All"
    ? activityFeed
    : activityFeed.filter((a) => a.kind === activityFilter);

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
            <button onClick={cycleOrders} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:bg-[#F8FAFC]">
              {ordersGran} <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>
          <div className="h-[200px]">
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
              {/* X-axis labels (selected period + granularity) */}
              {chart.labels.map((label, i) => (
                <text key={`${label}-${i}`} x={chart.xs[i]} y="196" textAnchor="middle" fontSize="8" fill="#94A3B8">{label}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Donut Chart - Top Shipping Locations */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Top Shipping Locations</h3>
            <span className="text-[12px] text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md">All Time</span>
          </div>
          <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="relative w-[160px] h-[160px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {shippingLocations.map((loc, i) => {
                  const offset = shippingLocations.slice(0, i).reduce((s, l) => s + l.pct, 0);
                  const dashArray = `${loc.pct * 2.51327} ${251.327 - loc.pct * 2.51327}`;
                  return (
                    <circle key={i} cx="50" cy="50" r="40" fill="none"
                      stroke={loc.color} strokeWidth="12" strokeDasharray={dashArray} strokeDashoffset={-offset * 2.51327}
                      strokeLinecap="round" />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#1E293B]">{meta.orders.value}</p>
                  <p className="text-[10px] text-[#64748B]">Total</p>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2.5">
              {shippingLocations.map((loc, i) => (
                <div key={i} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: loc.color }} />
                    <span className="text-[#475569] truncate">{loc.name}</span>
                  </div>
                  <span className="font-medium text-[#1E293B] shrink-0 ml-2">{loc.pct}%</span>
                </div>
              ))}
            </div>
          </div>
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
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Ship Date</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Delivery Date</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Total</th>
                <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B]">{order.id}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#1E293B]">{order.customer}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{order.shipDate}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{order.deliveryDate}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#1E293B] font-medium">{order.total}</td>
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
          {filteredActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className={`w-2 h-2 rounded-full ${item.dot} shrink-0`} />
              <span className="text-[13px] text-[#1E293B] flex-1">{item.text}</span>
              <span className="text-[11px] font-medium text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-1.5 py-0.5 shrink-0">{item.kind}</span>
              <span className="text-[12px] text-[#94A3B8] shrink-0">{item.time}</span>
            </div>
          ))}
          {filteredActivity.length === 0 && (
            <p className="text-[13px] text-[#64748B] py-4 text-center">No {activityFilter.toLowerCase()} activity in this period.</p>
          )}
        </div>
      </div>
    </div>
  );
}
