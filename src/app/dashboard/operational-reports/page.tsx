"use client";

import { useState } from "react";
import { CalendarClock, Download, Plus, ChevronDown, ChevronRight, ShoppingBag, Truck, CheckCircle2, Clock, DollarSign, ArrowUpRight, ArrowDownRight, BarChart3, Package, Ship, Warehouse, RotateCcw, Users, FileText, LineChart } from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";

const stats = [
  { title: "Total Orders", value: "12,456", change: "+10.8%", up: true, icon: ShoppingBag, color: "#3B82F6" },
  { title: "Orders Shipped", value: "11,732", change: "+11.2%", up: true, icon: Truck, color: "#10B981" },
  { title: "On-Time Delivery", value: "93.2%", change: "+4.6 pp", up: true, icon: CheckCircle2, color: "#3B82F6" },
  { title: "Avg. Order Cycle", value: "1.82 days", change: "-6.7%", up: true, icon: Clock, color: "#F59E0B" },
  { title: "Fulfillment Cost / Order", value: "$2.48", change: "-4.2%", up: true, icon: DollarSign, color: "#8B5CF6" },
];

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

const channels = [
  { name: "Shopify", orders: "5,678", shipped: "5,352", delivered: "5,102", onTime: "94.1%", cycle: "1.64 days", color: "#3B82F6" },
  { name: "Amazon", orders: "3,245", shipped: "3,062", delivered: "2,896", onTime: "92.8%", cycle: "1.88 days", color: "#10B981" },
  { name: "Walmart", orders: "1,876", shipped: "1,761", delivered: "1,672", onTime: "91.7%", cycle: "1.94 days", color: "#F59E0B" },
  { name: "eBay", orders: "987", shipped: "911", delivered: "856", onTime: "89.6%", cycle: "2.04 days", color: "#8B5CF6" },
  { name: "Other", orders: "670", shipped: "601", delivered: "546", onTime: "90.1%", cycle: "2.12 days", color: "#94A3B8" },
];

const topWarehouses = [
  { name: "ATL-1 · Atlanta", pct: 26, color: "#3B82F6" },
  { name: "DFW-1 · Dallas", pct: 24, color: "#10B981" },
  { name: "LAX-1 · Los Angeles", pct: 20, color: "#F59E0B" },
  { name: "MIA-1 · Miami", pct: 15, color: "#8B5CF6" },
  { name: "ORD-1 · Chicago", pct: 15, color: "#94A3B8" },
];

const whSummary = [
  { name: "ATL-1 · Atlanta", orders: "3,245", shipped: "3,056", onTime: "94.8%", cycle: "1.52 days", perDay: "105" },
  { name: "DFW-1 · Dallas", orders: "2,987", shipped: "2,810", onTime: "92.6%", cycle: "1.78 days", perDay: "100" },
  { name: "LAX-1 · Los Angeles", orders: "2,438", shipped: "2,321", onTime: "92.6%", cycle: "1.95 days", perDay: "82" },
  { name: "MIA-1 · Miami", orders: "1,876", shipped: "1,721", onTime: "91.4%", cycle: "2.04 days", perDay: "63" },
  { name: "ORD-1 · Chicago", orders: "1,892", shipped: "1,822", onTime: "92.0%", cycle: "1.78 days", perDay: "63" },
];

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
  const [range, setRange] = useState("May 1 – May 31, 2025");
  const [activeCat, setActiveCat] = useState("Order Performance");
  const [gran, setGran] = useState("Daily");
  const [whFilter, setWhFilter] = useState("All Warehouses");
  const [chFilter, setChFilter] = useState("All Channels");
  const [otFilter, setOtFilter] = useState("All Order Types");

  function cycleGran() {
    const opts = ["Daily", "Weekly", "Monthly"];
    const next = opts[(opts.indexOf(gran) + 1) % opts.length];
    setGran(next);
    toast(`Order volume grouped by ${next.toLowerCase()}`, "info");
  }

  function exportChannels() {
    exportToCsv("order-performance-by-channel", channels, [
      { key: "name", header: "Channel" },
      { key: "orders", header: "Orders" },
      { key: "shipped", header: "Shipped" },
      { key: "delivered", header: "Delivered" },
      { key: "onTime", header: "On-Time Delivery" },
      { key: "cycle", header: "Avg Cycle Time" },
    ]);
    toast(`Exported ${channels.length} channels to CSV`);
  }

  const W = 760, H = 230, padL = 30, padB = 24, padT = 10, yMax = 120;
  const series = [
    { name: "Orders", color: "#3B82F6", pts: [60, 80, 70, 95, 78, 88, 72, 90, 76, 85, 70, 92] },
    { name: "Shipped", color: "#10B981", pts: [52, 72, 62, 86, 70, 80, 64, 82, 68, 78, 62, 84] },
    { name: "Delivered", color: "#8B5CF6", pts: [44, 64, 54, 76, 60, 70, 56, 72, 60, 68, 54, 74] },
  ];
  const x = (i: number) => padL + (i * (W - padL - 10)) / 11;
  const y = (v: number) => padT + (1 - v / yMax) * (H - padT - padB);

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
          <button onClick={() => toast("Report scheduled to run weekly", "success")} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <CalendarClock className="w-4 h-4 text-[#64748B]" />Schedule Report
          </button>
          <button onClick={exportChannels} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
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
              <p className="text-[28px] font-bold text-[#1E293B] leading-none">{s.value}</p>
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
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Order Volume Over Time</h3>
            <button onClick={cycleGran} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:bg-[#F8FAFC]">{gran} <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" /></button>
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
            {["1.2K", "0.9K", "0.6K", "0.3K", "0"].map((l, i) => (
              <text key={i} x={padL - 6} y={padT + i * ((H - padT - padB) / 4) + 3} textAnchor="end" fontSize="9" fill="#94A3B8">{l}</text>
            ))}
            {series.map((s, si) => (
              <g key={si}>
                <polyline fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={s.pts.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
                {s.pts.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="white" stroke={s.color} strokeWidth="1.5" />)}
              </g>
            ))}
            {["May 1", "May 8", "May 16", "May 24", "May 31"].map((l, i) => (
              <text key={i} x={padL + i * ((W - padL - 10) / 4)} y={H - 6} textAnchor="middle" fontSize="9" fill="#94A3B8">{l}</text>
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
                <button key={c.name} onClick={() => { setActiveCat(c.name); toast(`Viewing ${c.name}`, "info"); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${active ? "bg-action-blue/10 text-action-blue" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}>
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
          <div className="px-5 py-4 border-b border-[#E2E8F0]"><h3 className="text-[16px] font-semibold text-[#1E293B]">Order Performance by Channel</h3></div>
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
                {channels.map((c) => (
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
          <div className="px-5 py-3 border-t border-[#E2E8F0] text-right"><button onClick={exportChannels} className="text-[13px] font-medium text-action-blue hover:underline">View full report →</button></div>
        </div>

        {/* Top Warehouses donut */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Top Warehouses by Orders</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-[160px] h-[160px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {topWarehouses.map((w, i) => { const off = topWarehouses.slice(0, i).reduce((s, x) => s + x.pct, 0); const dash = `${w.pct * 2.51327} ${251.327 - w.pct * 2.51327}`; return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={w.color} strokeWidth="12" strokeDasharray={dash} strokeDashoffset={-off * 2.51327} strokeLinecap="round" />; })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#1E293B]">12,456</p>
                  <p className="text-[10px] text-[#64748B]">Orders</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
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
                  {["Warehouse", "Orders", "Shipped", "On-Time Delivery", "Avg. Cycle Time", "Orders / Day"].map((h, i) => (
                    <th key={h} className={`text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
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
    </div>
  );
}
