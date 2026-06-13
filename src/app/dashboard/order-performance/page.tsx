"use client";

import { useState, useMemo } from "react";
import { Filter, Download, ChevronDown, ChevronRight, ShoppingBag, Truck, CheckCircle2, Clock, Target, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";

/* ── deterministic series generator ── */
function seeded(seed: number, n: number, lo: number, hi: number): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 16807 + 7) % 2147483647;
    out.push(lo + (s % 1000) / 1000 * (hi - lo));
  }
  return out;
}

/* ── shared chart ── */
function MultiLine({ height = 200, series, labels, yMax, yLabels }: { height?: number; series: { color: string; pts: number[] }[]; labels: string[]; yMax: number; yLabels: string[] }) {
  const W = 460, padL = 34, padB = 22, padT = 8;
  const n = series[0].pts.length;
  const x = (i: number) => padL + (i * (W - padL - 8)) / (n - 1);
  const y = (v: number) => padT + (1 - v / yMax) * (height - padT - padB);
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full" style={{ height }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={padL} y1={padT + i * ((height - padT - padB) / 4)} x2={W - 8} y2={padT + i * ((height - padT - padB) / 4)} stroke="#F1F5F9" strokeWidth="1" />
      ))}
      {yLabels.map((l, i) => (
        <text key={i} x={padL - 6} y={padT + i * ((height - padT - padB) / 4) + 3} textAnchor="end" fontSize="9" fill="#94A3B8">{l}</text>
      ))}
      {series.map((s, si) => (
        <g key={si}>
          <polyline fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" points={s.pts.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
          {s.pts.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.3" fill={s.color} />)}
        </g>
      ))}
      {labels.map((l, i) => (
        <text key={i} x={padL + i * ((W - padL - 8) / (labels.length - 1))} y={height - 5} textAnchor="middle" fontSize="9" fill="#94A3B8">{l}</text>
      ))}
    </svg>
  );
}

function Sparkline({ pts }: { pts: number[] }) {
  return (
    <svg viewBox={`0 0 ${pts.length * 11} 20`} className="w-full h-5" preserveAspectRatio="none">
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={pts.map((y, i) => `${i * 11},${y}`).join(" ")} />
    </svg>
  );
}

/* ── data: warehouses, channels, order types, product categories, customers ── */
const warehouses = [
  { name: "ATL-1 · Atlanta", orders: 3245, shipped: 3066, onTime: 94.8, cycle: 1.62, acc: 99.3 },
  { name: "DFW-1 · Dallas", orders: 2987, shipped: 2810, onTime: 92.6, cycle: 1.78, acc: 99.0 },
  { name: "LAX-1 · Los Angeles", orders: 2438, shipped: 2321, onTime: 92.6, cycle: 1.95, acc: 99.1 },
  { name: "MIA-1 · Miami", orders: 1876, shipped: 1721, onTime: 91.4, cycle: 2.04, acc: 98.6 },
  { name: "ORD-1 · Chicago", orders: 1892, shipped: 1822, onTime: 92.0, cycle: 1.78, acc: 99.2 },
];

const channels = [
  { name: "Shopify", orders: 5678, pct: 45.6, onTime: 94.1, cycle: 1.66, color: "#3B82F6" },
  { name: "Amazon", orders: 3245, pct: 26.0, onTime: 92.8, cycle: 1.88, color: "#10B981" },
  { name: "Walmart", orders: 1866, pct: 15.0, onTime: 92.4, cycle: 1.94, color: "#F59E0B" },
  { name: "eBay", orders: 987, pct: 7.9, onTime: 91.6, cycle: 2.02, color: "#8B5CF6" },
  { name: "Other", orders: 670, pct: 5.4, onTime: 90.1, cycle: 2.12, color: "#94A3B8" },
];

const orderTypes = [
  { name: "Standard", orders: 6842, pct: 54.9, onTime: 93.8, cycle: 1.74, color: "#3B82F6" },
  { name: "Express", orders: 2987, pct: 24.0, onTime: 95.2, cycle: 1.22, color: "#10B981" },
  { name: "Economy", orders: 1564, pct: 12.6, onTime: 89.6, cycle: 2.44, color: "#F59E0B" },
  { name: "Wholesale", orders: 876, pct: 7.0, onTime: 94.0, cycle: 1.88, color: "#8B5CF6" },
  { name: "Dropship", orders: 187, pct: 1.5, onTime: 88.4, cycle: 2.66, color: "#EF4444" },
];

const productCategories = [
  { name: "Electronics", orders: 4126, pct: 33.1, onTime: 93.6, cycle: 1.68, color: "#3B82F6" },
  { name: "Apparel", orders: 2876, pct: 23.1, onTime: 94.2, cycle: 1.56, color: "#10B981" },
  { name: "Home & Garden", orders: 2145, pct: 17.2, onTime: 92.4, cycle: 1.92, color: "#F59E0B" },
  { name: "Health & Beauty", orders: 1654, pct: 13.3, onTime: 93.0, cycle: 1.76, color: "#8B5CF6" },
  { name: "Sports & Outdoors", orders: 1655, pct: 13.3, onTime: 91.8, cycle: 2.04, color: "#EF4444" },
];

const topCustomers = [
  { name: "Acme Retail Co.", orders: 1245, revenue: "$148,620", onTime: 95.2, cycle: 1.44 },
  { name: "Global Traders Inc.", orders: 986, revenue: "$96,412", onTime: 94.6, cycle: 1.52 },
  { name: "Pacific Wholesale", orders: 876, revenue: "$84,230", onTime: 93.8, cycle: 1.68 },
  { name: "Metro Distribution", orders: 724, revenue: "$72,156", onTime: 92.4, cycle: 1.82 },
  { name: "Summit Commerce", orders: 612, revenue: "$58,944", onTime: 94.0, cycle: 1.66 },
];

const summary = [
  { label: "On-Time Delivery", value: "93.2%", delta: "+4.6 pp", up: true },
  { label: "Order Accuracy", value: "99.1%", delta: "+1.2 pp", up: true },
  { label: "Avg. Cycle Time", value: "1.82 days", delta: "-6.7%", up: true },
  { label: "Orders / Day (avg)", value: "402", delta: "+8.9%", up: true },
  { label: "Peak Orders / Day", value: "1,287", delta: "", up: true },
  { label: "Low Orders / Day", value: "256", delta: "", up: true },
];

const tabs = ["Overview", "By Warehouse", "By Channel", "By Order Type", "By Product Category", "By Customer"];

/* ── format helpers ── */
const fmt = (n: number) => n.toLocaleString("en-US");
const fmtPct = (n: number) => n.toFixed(1) + "%";

/* ── component ── */
export default function OrderPerformancePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("Overview");
  const [range, setRange] = useState("May 1 – May 31, 2025");
  const [gran, setGran] = useState<"Daily" | "Weekly" | "Monthly">("Daily");

  const n = gran === "Daily" ? 7 : gran === "Weekly" ? 5 : 4;
  const labels = gran === "Daily"
    ? ["May 1", "May 6", "May 11", "May 16", "May 21", "May 26", "May 31"]
    : gran === "Weekly"
    ? ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
    : ["Jan", "Feb", "Mar", "Apr"];

  /* chart data per granularity */
  const orderPts = useMemo(() => seeded(42, n, 50, 100), [n]);
  const shippedPts = useMemo(() => seeded(43, n, 40, 90), [n]);
  const onTimePts = useMemo(() => seeded(44, n, 70, 95), [n]);
  const cyclePts = useMemo(() => seeded(45, n, 40, 80), [n]);

  /* stats */
  const stats = useMemo(() => [
    { title: "Total Orders", value: "12,456", change: "+10.8%", up: true, note: "vs Apr 30", icon: ShoppingBag, iconColor: "#3B82F6", spark: seeded(1, 10, 4, 16) },
    { title: "Orders Shipped", value: "11,732", change: "+11.2%", up: true, note: "vs Apr 30", icon: Truck, iconColor: "#10B981", spark: seeded(2, 10, 4, 16) },
    { title: "On-Time Delivery", value: "93.2%", change: "+4.6 pp", up: true, note: "vs Apr 30", icon: CheckCircle2, iconColor: "#3B82F6", spark: seeded(3, 10, 4, 14) },
    { title: "Avg. Order Cycle Time", value: "1.82 days", change: "-6.7%", up: true, note: "vs Apr 30", icon: Clock, iconColor: "#F59E0B", spark: seeded(4, 10, 4, 16) },
    { title: "Order Accuracy", value: "99.1%", change: "+1.2 pp", up: true, note: "vs Apr 30", icon: Target, iconColor: "#10B981", spark: seeded(5, 10, 4, 14) },
  ], []);

  function cycleGran() {
    const opts: ("Daily" | "Weekly" | "Monthly")[] = ["Daily", "Weekly", "Monthly"];
    setGran(opts[(opts.indexOf(gran) + 1) % opts.length]);
  }

  /* ── tab-specific content ── */
  function renderByWarehouse() {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="px-5 py-4 border-b border-[#E2E8F0]"><h3 className="text-[16px] font-semibold text-[#1E293B]">Order Performance by Warehouse</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["Warehouse", "Orders", "Shipped", "On-Time Rate", "Avg Cycle Time", "Order Accuracy"].map((h, i) => (
                  <th key={h} className={`text-[12px] font-medium text-[#64748B] px-5 py-3 ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {warehouses.map((w) => (
                <tr key={w.name} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/70 transition-colors">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B]">{w.name}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#1E293B] text-right">{fmt(w.orders)}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{fmt(w.shipped)}</td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#10B981] text-right">{fmtPct(w.onTime)}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{w.cycle} days</td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#10B981] text-right">{fmtPct(w.acc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#E2E8F0] text-right">
          <button onClick={() => { exportToCsv("order-perf-warehouse", warehouses.map(w => ({ ...w, onTime: w.onTime + "%", acc: w.acc + "%" })), [{ key: "name", header: "Warehouse" }, { key: "orders", header: "Orders" }, { key: "shipped", header: "Shipped" }, { key: "onTime", header: "On-Time Rate" }, { key: "cycle", header: "Avg Cycle Time" }, { key: "acc", header: "Order Accuracy" }]); toast(`Exported ${warehouses.length} warehouses to CSV`); }} className="text-[13px] font-medium text-action-blue hover:underline">Export CSV →</button>
        </div>
      </div>
    );
  }

  function renderBreakdownTable(data: { name: string; orders: number; pct: number; onTime: number; cycle: number; color: string }[], title: string, filename: string) {
    return (
      <>
        <div className="grid gap-4" style={{ gridTemplateColumns: "1.9fr 1fr" }}>
          {/* Donut + table */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
            <div className="px-5 py-4 border-b border-[#E2E8F0]"><h3 className="text-[16px] font-semibold text-[#1E293B]">{title}</h3></div>
            <div className="flex items-center gap-6 p-5">
              <div className="relative w-[140px] h-[140px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="13" />
                  {data.map((c, i) => { const p = c.pct; const off = data.slice(0, i).reduce((s, x) => s + x.pct, 0); const dash = `${p * 2.51327} ${251.327 - p * 2.51327}`; return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c.color} strokeWidth="13" strokeDasharray={dash} strokeDashoffset={-off * 2.51327} />; })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[18px] font-bold text-[#1E293B]">{fmt(data.reduce((s, d) => s + d.orders, 0))}</span>
                  <span className="text-[10px] text-[#64748B]">Total Orders</span>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E2E8F0]">
                      {["Name", "Orders", "% of Total", "On-Time", "Avg Cycle"].map((h, i) => (
                        <th key={h} className={`text-[11px] font-medium text-[#64748B] py-2 ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((c) => (
                      <tr key={c.name} className="border-b border-[#F1F5F9] last:border-b-0">
                        <td className="py-2.5"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-[12px] font-medium text-[#1E293B]">{c.name}</span></div></td>
                        <td className="py-2.5 text-[12px] text-[#1E293B] text-right">{fmt(c.orders)}</td>
                        <td className="py-2.5 text-[12px] text-[#64748B] text-right">{fmtPct(c.pct)}</td>
                        <td className="py-2.5 text-[12px] text-[#10B981] font-medium text-right">{fmtPct(c.onTime)}</td>
                        <td className="py-2.5 text-[12px] text-[#64748B] text-right">{c.cycle} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Trend chart */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">On-Time Delivery Trend</h3>
            <MultiLine height={220}
              series={[{ color: "#3B82F6", pts: onTimePts }]}
              labels={labels} yMax={100} yLabels={["100%", "75%", "50%", "25%", "0"]} />
            <p className="text-[12px] text-[#94A3B8] mt-2 text-center">Grouped by {gran.toLowerCase()}</p>
          </div>
        </div>
        {/* Secondary chart */}
        <div className="mt-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
          <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Avg. Order Cycle Time Trend</h3>
          <MultiLine height={180}
            series={[{ color: "#F59E0B", pts: cyclePts }]}
            labels={labels} yMax={100} yLabels={["3 days", "2.2", "1.5", "0.7", "0"]} />
          <p className="text-[12px] text-[#94A3B8] mt-2 text-center">Grouped by {gran.toLowerCase()}</p>
        </div>
      </>
    );
  }

  function renderByCustomer() {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="px-5 py-4 border-b border-[#E2E8F0]"><h3 className="text-[16px] font-semibold text-[#1E293B]">Top Customer Performance</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["Customer", "Orders", "Revenue", "On-Time Rate", "Avg Cycle Time"].map((h, i) => (
                  <th key={h} className={`text-[12px] font-medium text-[#64748B] px-5 py-3 ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c) => (
                <tr key={c.name} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[12px] font-semibold text-[#3B82F6]">
                        {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-[13px] font-medium text-[#1E293B]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#1E293B] text-right">{fmt(c.orders)}</td>
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-[#1E293B] text-right">{c.revenue}</td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#10B981] text-right">{fmtPct(c.onTime)}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{c.cycle} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#E2E8F0] text-right">
          <button onClick={() => { exportToCsv("order-perf-customers", topCustomers.map(c => ({ ...c, onTime: c.onTime + "%" })), [{ key: "name", header: "Customer" }, { key: "orders", header: "Orders" }, { key: "revenue", header: "Revenue" }, { key: "onTime", header: "On-Time Rate" }, { key: "cycle", header: "Avg Cycle Time" }]); toast(`Exported ${topCustomers.length} customers to CSV`); }} className="text-[13px] font-medium text-action-blue hover:underline">Export CSV →</button>
        </div>
      </div>
    );
  }

  function renderOverview() {
    return (
      <>
        {/* Volume chart + Performance Summary */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "1.9fr 1fr" }}>
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-semibold text-[#1E293B]">Order Volume Over Time</h3>
              <button onClick={cycleGran} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] bg-[#F1F5F9] px-2.5 py-1.5 rounded-lg hover:bg-[#E2E8F0]">{gran} <ChevronDown className="w-3 h-3" /></button>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /><span className="text-[11px] text-[#64748B]">Orders</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /><span className="text-[11px] text-[#64748B]">Orders Shipped</span></div>
            </div>
            <MultiLine height={230}
              series={[{ color: "#3B82F6", pts: orderPts }, { color: "#10B981", pts: shippedPts }]}
              labels={labels} yMax={120} yLabels={["1.2K", "0.9K", "0.6K", "0.3K", "0"]} />
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <h3 className="text-[16px] font-semibold text-[#1E293B] mb-3">Performance Summary</h3>
            <div className="divide-y divide-[#F1F5F9]">
              {summary.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2.5">
                  <span className="text-[13px] text-[#64748B]">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#1E293B]">{s.value}</span>
                    {s.delta && <span className="text-[11px] font-medium text-[#10B981]">{s.delta}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trend charts */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[15px] font-semibold text-[#1E293B]">On-Time Delivery Trend</h3>
              <span className="text-[13px] font-bold text-[#1E293B]">93.2% <span className="text-[11px] font-medium text-[#10B981]">+4.6 pp vs Apr 30</span></span>
            </div>
            <MultiLine height={180} series={[{ color: "#3B82F6", pts: onTimePts }]} labels={labels} yMax={100} yLabels={["100%", "75%", "50%", "25%", "0"]} />
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[15px] font-semibold text-[#1E293B]">Avg. Order Cycle Time Trend</h3>
              <span className="text-[13px] font-bold text-[#1E293B]">1.82 days <span className="text-[11px] font-medium text-[#10B981]">-6.7% vs Apr 30</span></span>
            </div>
            <MultiLine height={180} series={[{ color: "#F59E0B", pts: cyclePts }]} labels={labels} yMax={100} yLabels={["3 days", "2.2", "1.5", "0.7", "0"]} />
          </div>
        </div>

        {/* Warehouse table */}
        {renderByWarehouse()}

        {/* Channel breakdown */}
        {renderBreakdownTable(channels, "Order Performance by Channel", "order-perf-channel")}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
        <a href="/dashboard/reports" className="hover:text-action-blue">Reports</a>
        <ChevronRight className="w-3 h-3" />
        <a href="/dashboard/operational-reports" className="hover:text-action-blue">Operational Reports</a>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text-muted font-medium">Order Performance</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Order Performance Report</h1>
          <p className="text-[14px] text-text-muted mt-0.5">Track order metrics and performance across your operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeMenu
            value={range}
            onSelect={(r) => { setRange(r); toast(`Order performance scoped to ${r}`, "info"); }}
            presets={["May 1 – May 31, 2025", "Last 7 days", "Last 30 days", "This quarter", "Year to date"]}
          />
          <button onClick={() => toast("Filter panel opened", "info")} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Filter className="w-4 h-4 text-[#64748B]" />Filters
          </button>
          <button onClick={() => { exportToCsv("order-performance", warehouses, [{ key: "name", header: "Warehouse" }, { key: "orders", header: "Orders" }, { key: "shipped", header: "Shipped" }, { key: "onTime", header: "On-Time" }, { key: "cycle", header: "Cycle Time" }, { key: "acc", header: "Accuracy" }]); toast("Exported to CSV"); }} className="flex items-center gap-2 px-3.5 py-2 bg-action-blue text-white rounded-lg text-[13px] font-medium hover:bg-action-blue/90 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Download className="w-4 h-4" />Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#64748B]">{s.title}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.iconColor}15` }}>
                  <Icon className="w-4 h-4" style={{ color: s.iconColor }} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#1E293B] leading-none">{s.value}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[12px] font-semibold ${s.up ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
                  {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {s.change}
                </span>
                <span className="text-[12px] text-[#94A3B8]">{s.note}</span>
              </div>
              <div className="mt-2" style={{ color: s.iconColor }}>
                <Sparkline pts={s.spark} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] overflow-x-auto">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${activeTab === t ? "border-action-blue text-action-blue" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Overview" && renderOverview()}
      {activeTab === "By Warehouse" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-semibold text-[#1E293B]">Order Volume by Warehouse</h3>
              <button onClick={cycleGran} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] bg-[#F1F5F9] px-2.5 py-1.5 rounded-lg hover:bg-[#E2E8F0]">{gran} <ChevronDown className="w-3 h-3" /></button>
            </div>
            <MultiLine height={230}
              series={[{ color: "#3B82F6", pts: orderPts }, { color: "#10B981", pts: shippedPts }]}
              labels={labels} yMax={120} yLabels={["1.2K", "0.9K", "0.6K", "0.3K", "0"]} />
          </div>
          {renderByWarehouse()}
        </div>
      )}
      {activeTab === "By Channel" && renderBreakdownTable(channels, "Order Performance by Channel", "order-perf-channel")}
      {activeTab === "By Order Type" && renderBreakdownTable(orderTypes, "Order Performance by Order Type", "order-perf-order-type")}
      {activeTab === "By Product Category" && renderBreakdownTable(productCategories, "Order Performance by Product Category", "order-perf-product-category")}
      {activeTab === "By Customer" && (
        <div className="space-y-4">
          {renderByCustomer()}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-semibold text-[#1E293B]">Customer Order Volume Trend</h3>
              <button onClick={cycleGran} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] bg-[#F1F5F9] px-2.5 py-1.5 rounded-lg hover:bg-[#E2E8F0]">{gran} <ChevronDown className="w-3 h-3" /></button>
            </div>
            <MultiLine height={230}
              series={[{ color: "#3B82F6", pts: orderPts }, { color: "#10B981", pts: shippedPts }]}
              labels={labels} yMax={120} yLabels={["1.2K", "0.9K", "0.6K", "0.3K", "0"]} />
          </div>
        </div>
      )}

      {/* Insights CTA band */}
      <div className="gradient-dark-hero rounded-xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Want deeper insights?</h3>
            <p className="text-[12px] text-white/70 mt-0.5">Unlock predictive analytics, custom dashboards, and automated alerts to stay ahead of every order.</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button onClick={() => toast("Opening predictive analytics tour", "info")} className="rounded-lg border border-white/30 px-4 py-2.5 text-[13px] font-medium text-white hover:bg-white/10 transition-colors">
            Learn more
          </button>
          <button onClick={() => toast("Redirecting to upgrade plans…", "info")} className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-navy hover:bg-white/90 transition-colors">
            Upgrade to Pro <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
