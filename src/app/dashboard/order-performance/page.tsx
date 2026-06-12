"use client";

import { useState } from "react";
import { Calendar, Filter, Download, ChevronDown, ChevronRight, ShoppingBag, Truck, CheckCircle2, Clock, Target, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";

const stats = [
  { title: "Total Orders", value: "12,456", change: "+10.8%", up: true, note: "vs Apr 30", icon: ShoppingBag, iconColor: "#3B82F6" },
  { title: "Orders Shipped", value: "11,732", change: "+11.2%", up: true, note: "vs Apr 30", icon: Truck, iconColor: "#10B981" },
  { title: "On-Time Delivery", value: "93.2%", change: "+4.6 pp", up: true, note: "vs Apr 30", icon: CheckCircle2, iconColor: "#3B82F6" },
  { title: "Avg. Order Cycle Time", value: "1.82 days", change: "-6.7%", up: true, note: "vs Apr 30", icon: Clock, iconColor: "#F59E0B" },
  { title: "Order Accuracy", value: "99.1%", change: "+1.2 pp", up: true, note: "vs Apr 30", icon: Target, iconColor: "#10B981" },
];

const tabs = ["Overview", "By Warehouse", "By Channel", "By Order Type", "By Product Category", "By Customer"];

const summary = [
  { label: "On-Time Delivery", value: "93.2%", delta: "+4.6 pp", up: true },
  { label: "Order Accuracy", value: "99.1%", delta: "+1.2 pp", up: true },
  { label: "Avg. Cycle Time", value: "1.82 days", delta: "-6.7%", up: true },
  { label: "Orders / Day (avg)", value: "402", delta: "+8.9%", up: true },
  { label: "Peak Orders / Day", value: "1,287", delta: "", up: true },
  { label: "Low Orders / Day", value: "256", delta: "", up: true },
];

const channels = [
  { name: "Shopify", orders: "5,678", pct: "45.6%", onTime: "94.1%", cycle: "1.66 days", color: "#3B82F6" },
  { name: "Amazon", orders: "3,245", pct: "26.0%", onTime: "92.8%", cycle: "1.88 days", color: "#10B981" },
  { name: "Walmart", orders: "1,866", pct: "15.0%", onTime: "92.4%", cycle: "1.94 days", color: "#F59E0B" },
  { name: "eBay", orders: "987", pct: "7.9%", onTime: "91.6%", cycle: "2.02 days", color: "#8B5CF6" },
  { name: "Other", orders: "670", pct: "5.4%", onTime: "90.1%", cycle: "2.12 days", color: "#94A3B8" },
];

const topProducts = [
  { name: "Wireless Headphones", orders: "1,256" },
  { name: "Smart Watch Series 6", orders: "1,102" },
  { name: "USB-C Hub Adapter", orders: "986" },
  { name: "Bluetooth Speaker", orders: "812" },
  { name: "Laptop Stand", orders: "744" },
];

const warehouses = [
  { name: "ATL-1 · Atlanta", orders: "3,245", shipped: "3,066", onTime: "94.8%", cycle: "1.62 days", acc: "99.3%" },
  { name: "DFW-1 · Dallas", orders: "2,987", shipped: "2,810", onTime: "92.6%", cycle: "1.78 days", acc: "99.0%" },
  { name: "LAX-1 · Los Angeles", orders: "2,438", shipped: "2,321", onTime: "92.6%", cycle: "1.95 days", acc: "99.1%" },
  { name: "MIA-1 · Miami", orders: "1,876", shipped: "1,721", onTime: "91.4%", cycle: "2.04 days", acc: "98.6%" },
  { name: "ORD-1 · Chicago", orders: "1,892", shipped: "1,822", onTime: "92.0%", cycle: "1.78 days", acc: "99.2%" },
];

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

function Sparkline({ color }: { color: string }) {
  const pts = [12, 9, 14, 7, 11, 6, 12, 8, 10, 5];
  return (
    <svg viewBox="0 0 100 18" className="w-full h-5" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts.map((y, i) => `${i * 11},${y}`).join(" ")} />
    </svg>
  );
}

const months = ["May 1", "May 6", "May 11", "May 16", "May 21", "May 26", "May 31"];

export default function OrderPerformancePage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
        <a href="#" className="hover:text-action-blue">Reports</a>
        <ChevronRight className="w-3 h-3" />
        <a href="#" className="hover:text-action-blue">Operational Reports</a>
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
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Calendar className="w-4 h-4 text-[#64748B]" />May 1 – May 31, 2025<ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Filter className="w-4 h-4 text-[#64748B]" />Filters
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-action-blue text-white rounded-lg text-[13px] font-medium hover:bg-action-blue/90 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
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
              <div className="mt-2">
                <Sparkline color={s.iconColor} />
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

      {/* Volume chart + Performance Summary */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.9fr 1fr" }}>
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Order Volume Over Time</h3>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] bg-[#F1F5F9] px-2.5 py-1.5 rounded-lg">Daily <ChevronDown className="w-3 h-3" /></span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /><span className="text-[11px] text-[#64748B]">Orders</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /><span className="text-[11px] text-[#64748B]">Orders Shipped</span></div>
          </div>
          <MultiLine height={230}
            series={[
              { color: "#3B82F6", pts: [60, 80, 70, 95, 78, 88, 72, 90, 76, 85, 70, 92] },
              { color: "#10B981", pts: [50, 70, 62, 82, 68, 78, 64, 80, 68, 76, 62, 84] },
            ]}
            labels={months} yMax={120} yLabels={["1.2K", "0.9K", "0.6K", "0.3K", "0"]} />
        </div>

        {/* Performance Summary */}
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
          <MultiLine height={180} series={[{ color: "#3B82F6", pts: [70, 74, 72, 80, 78, 85, 82, 88, 90, 92] }]} labels={["May 1", "May 8", "May 16", "May 24", "May 31"]} yMax={100} yLabels={["100%", "75%", "50%", "25%", "0"]} />
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Avg. Order Cycle Time Trend</h3>
            <span className="text-[13px] font-bold text-[#1E293B]">1.82 days <span className="text-[11px] font-medium text-[#10B981]">-6.7% vs Apr 30</span></span>
          </div>
          <MultiLine height={180} series={[{ color: "#F59E0B", pts: [78, 74, 80, 70, 72, 66, 64, 60, 58, 55] }]} labels={["May 1", "May 8", "May 16", "May 24", "May 31"]} yMax={100} yLabels={["3 days", "2.2", "1.5", "0.7", "0"]} />
        </div>
      </div>

      {/* Order Performance by Warehouse */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="px-5 py-4 border-b border-[#E2E8F0]"><h3 className="text-[16px] font-semibold text-[#1E293B]">Order Performance by Warehouse</h3></div>
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
                <td className="px-5 py-3.5 text-[13px] text-[#1E293B] text-right">{w.orders}</td>
                <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{w.shipped}</td>
                <td className="px-5 py-3.5 text-[13px] font-medium text-[#10B981] text-right">{w.onTime}</td>
                <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{w.cycle}</td>
                <td className="px-5 py-3.5 text-[13px] font-medium text-[#10B981] text-right">{w.acc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-[#E2E8F0] text-right"><a href="#" className="text-[13px] font-medium text-action-blue hover:underline">View full report →</a></div>
      </div>

      {/* By Channel donut+table + Top Products */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.9fr 1fr" }}>
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="px-5 py-4 border-b border-[#E2E8F0]"><h3 className="text-[16px] font-semibold text-[#1E293B]">Order Performance by Channel</h3></div>
          <div className="flex items-center gap-6 p-5">
            <div className="relative w-[140px] h-[140px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="13" />
                {channels.map((c, i) => { const p = parseFloat(c.pct); const off = channels.slice(0, i).reduce((s, x) => s + parseFloat(x.pct), 0); const dash = `${p * 2.51327} ${251.327 - p * 2.51327}`; return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c.color} strokeWidth="13" strokeDasharray={dash} strokeDashoffset={-off * 2.51327} />; })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[18px] font-bold text-[#1E293B]">12,456</span>
                <span className="text-[10px] text-[#64748B]">Total Orders</span>
              </div>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    {["Channel", "Orders", "% of Total", "On-Time Delivery", "Avg Cycle Time"].map((h, i) => (
                      <th key={h} className={`text-[11px] font-medium text-[#64748B] py-2 ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {channels.map((c) => (
                    <tr key={c.name} className="border-b border-[#F1F5F9] last:border-b-0">
                      <td className="py-2.5"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-[12px] font-medium text-[#1E293B]">{c.name}</span></div></td>
                      <td className="py-2.5 text-[12px] text-[#1E293B] text-right">{c.orders}</td>
                      <td className="py-2.5 text-[12px] text-[#64748B] text-right">{c.pct}</td>
                      <td className="py-2.5 text-[12px] text-[#10B981] font-medium text-right">{c.onTime}</td>
                      <td className="py-2.5 text-[12px] text-[#64748B] text-right">{c.cycle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="px-5 py-3 border-t border-[#E2E8F0] text-right"><a href="#" className="text-[13px] font-medium text-action-blue hover:underline">View full report →</a></div>
        </div>

        {/* Top Products by Orders */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
          <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Top Products by Orders</h3>
          <div className="flex items-center justify-between text-[11px] font-medium text-[#94A3B8] pb-2 border-b border-[#F1F5F9] mb-2">
            <span>Product</span><span>Orders</span>
          </div>
          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <span className="text-[13px] text-[#1E293B]">{p.name}</span>
                <span className="text-[13px] font-semibold text-[#1E293B]">{p.orders}</span>
              </div>
            ))}
          </div>
          <a href="#" className="inline-block mt-4 text-[13px] font-medium text-action-blue hover:underline">View full report →</a>
        </div>
      </div>

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
          <button className="rounded-lg border border-white/30 px-4 py-2.5 text-[13px] font-medium text-white hover:bg-white/10 transition-colors">
            Learn more
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-navy hover:bg-white/90 transition-colors">
            Upgrade to Pro <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
