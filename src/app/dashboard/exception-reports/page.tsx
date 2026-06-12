"use client";

import { useState } from "react";
import { Calendar, Filter, Download, ChevronDown, Search, AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert, Clock, ArrowUpRight, ArrowDownRight, MoreHorizontal, Plus, Settings, UserPlus, FileDown } from "lucide-react";

const stats = [
  { title: "Total Exceptions", value: "312", change: "-12.5%", good: true, icon: AlertTriangle, color: "#EF4444" },
  { title: "Open Exceptions", value: "128", change: "-8.3%", good: true, icon: AlertCircle, color: "#F59E0B" },
  { title: "Resolved Exceptions", value: "176", change: "+11.2%", good: true, icon: CheckCircle2, color: "#10B981" },
  { title: "SLA Breached", value: "23", change: "-15.7%", good: true, icon: ShieldAlert, color: "#8B5CF6" },
  { title: "Avg. Resolution Time", value: "6.2 hrs", change: "-9.1%", good: true, icon: Clock, color: "#3B82F6" },
];

const tabs = [
  { name: "All Exceptions", count: 312 },
  { name: "Open", count: 128 },
  { name: "SLA Breached", count: 23 },
  { name: "Resolved", count: 176 },
  { name: "Ignored", count: 8 },
];

const rows = [
  { id: "EXC-0005-0001-001", type: "Inventory", desc: "Inventory discrepancy on SKU-10023", wh: "ATL-1 · Atlanta", priority: "High", pc: "#EF4444", status: "Open", sc: "open", on: "May 31, 2025 09:42 AM" },
  { id: "EXC-0005-0001-002", type: "Shipment", desc: "Shipment delayed > 24 hr", wh: "DFW-1 · Dallas", priority: "Medium", pc: "#F59E0B", status: "Open", sc: "open", on: "May 31, 2025 08:15 AM" },
  { id: "EXC-0005-0001-003", type: "Order", desc: "Order not allocated", wh: "LAX-1 · Los Angeles", priority: "High", pc: "#EF4444", status: "Investigating", sc: "investigating", on: "May 30, 2025 06:30 PM" },
  { id: "EXC-0005-0001-004", type: "Return", desc: "Return received without RMA", wh: "MIA-1 · Miami", priority: "Low", pc: "#3B82F6", status: "Open", sc: "open", on: "May 30, 2025 04:12 PM" },
  { id: "EXC-0005-0001-005", type: "Inventory", desc: "Negative inventory count", wh: "ORD-1 · Chicago", priority: "Medium", pc: "#F59E0B", status: "Resolved", sc: "resolved", on: "May 30, 2025 02:45 PM" },
  { id: "EXC-0005-0001-006", type: "Inbound", desc: "ASN qty mismatch", wh: "DFW-1 · Dallas", priority: "Low", pc: "#3B82F6", status: "Resolved", sc: "resolved", on: "May 30, 2025 11:20 AM" },
  { id: "EXC-0005-0001-007", type: "Order", desc: "Carrier rejection", wh: "ATL-1 · Atlanta", priority: "Medium", pc: "#F59E0B", status: "Investigating", sc: "investigating", on: "May 30, 2025 09:05 AM" },
  { id: "EXC-0005-0001-008", type: "Shipment", desc: "Address verification failed", wh: "LAX-1 · Los Angeles", priority: "High", pc: "#EF4444", status: "Open", sc: "open", on: "May 29, 2025 03:50 PM" },
  { id: "EXC-0005-0001-009", type: "Transfer", desc: "Transfer delay > 48 hr", wh: "MIA-1 · Miami", priority: "Low", pc: "#3B82F6", status: "Resolved", sc: "resolved", on: "May 29, 2025 01:18 PM" },
  { id: "EXC-0005-0001-010", type: "Inventory", desc: "Cycle count variance", wh: "ORD-1 · Chicago", priority: "Medium", pc: "#F59E0B", status: "Open", sc: "open", on: "May 29, 2025 10:02 AM" },
];

const statusStyle: Record<string, string> = {
  open: "bg-[#FEF2F2] text-[#EF4444]",
  investigating: "bg-[#FFFBEB] text-[#F59E0B]",
  resolved: "bg-[#ECFDF5] text-[#10B981]",
};

const summary = [
  { name: "Inventory", pct: 38, color: "#3B82F6" },
  { name: "Shipment", pct: 24, color: "#10B981" },
  { name: "Order", pct: 18, color: "#F59E0B" },
  { name: "Return", pct: 12, color: "#8B5CF6" },
  { name: "Inbound", pct: 5, color: "#EF4444" },
  { name: "Transfer", pct: 3, color: "#94A3B8" },
];

const priorities = [
  { name: "High", value: "98 (31.4%)", pct: 31, color: "#EF4444" },
  { name: "Medium", value: "146 (46.8%)", pct: 47, color: "#F59E0B" },
  { name: "Low", value: "68 (21.8%)", pct: 22, color: "#3B82F6" },
];

const topWh = [
  { name: "DFW-1 · Dallas", count: 78 },
  { name: "ATL-1 · Atlanta", count: 62 },
  { name: "LAX-1 · Los Angeles", count: 54 },
  { name: "MIA-1 · Miami", count: 41 },
  { name: "ORD-1 · Chicago", count: 38 },
];

const topTypes = [
  { type: "Inventory", count: 112, pct: "35.9%" },
  { type: "Shipment", count: 76, pct: "24.4%" },
  { type: "Order", count: 56, pct: "17.9%" },
  { type: "Return", count: 32, pct: "10.3%" },
  { type: "Inbound", count: 22, pct: "7.1%" },
  { type: "Transfer", count: 14, pct: "4.5%" },
];

const resByType = [
  { type: "Inventory", hrs: 8.7, color: "#3B82F6", w: 100 },
  { type: "Shipment", hrs: 5.2, color: "#10B981", w: 60 },
  { type: "Order", hrs: 4.1, color: "#F59E0B", w: 47 },
  { type: "Return", hrs: 3.6, color: "#8B5CF6", w: 41 },
  { type: "Inbound", hrs: 2.8, color: "#EF4444", w: 32 },
  { type: "Transfer", hrs: 1.6, color: "#94A3B8", w: 18 },
];

function Sparkline({ color }: { color: string }) {
  const pts = [8, 11, 7, 13, 9, 12, 6, 10, 8, 5];
  return (
    <svg viewBox="0 0 100 18" className="w-full h-5" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts.map((y, i) => `${i * 11},${y}`).join(" ")} />
    </svg>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-border-soft rounded-lg text-[12px] font-medium text-text-primary hover:bg-soft-bg transition-colors">
      {label}
      <ChevronDown className="w-3 h-3 text-text-light" />
    </button>
  );
}

export default function ExceptionReportsPage() {
  const [activeTab, setActiveTab] = useState("All Exceptions");

  // exceptions over time chart
  const W = 760, H = 200, padL = 28, padB = 22, padT = 8, yMax = 60;
  const otSeries = [
    { name: "Total Exceptions", color: "#0057D8", pts: [40, 48, 42, 52, 45, 50, 44, 54, 46, 50] },
    { name: "Open", color: "#F59E0B", pts: [22, 26, 20, 28, 24, 27, 22, 30, 25, 27] },
    { name: "Resolved", color: "#10B981", pts: [16, 20, 18, 22, 19, 21, 18, 23, 20, 22] },
    { name: "SLA Breached", color: "#EF4444", pts: [4, 6, 5, 8, 6, 7, 5, 9, 6, 7] },
  ];
  const cx = (i: number) => padL + (i * (W - padL - 10)) / 9;
  const cy = (v: number) => padT + (1 - v / yMax) * (H - padT - padB);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Exception Reports</h1>
          <p className="text-[14px] text-text-muted mt-1">Identify, track and resolve exceptions that impact your operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-primary hover:bg-soft-bg transition-colors">
            <Calendar className="w-4 h-4 text-text-muted" />
            May 1 – May 31, 2025
            <ChevronDown className="w-3.5 h-3.5 text-text-light" />
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-primary hover:bg-soft-bg transition-colors">
            <Filter className="w-4 h-4 text-text-muted" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-action-blue text-white rounded-lg text-[13px] font-semibold hover:bg-action-blue/90 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-border-soft p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-text-muted">{s.title}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                  <Icon className="w-[18px] h-[18px]" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-text-primary leading-none tracking-tight">{s.value}</p>
              <div className="flex items-center gap-1.5 mt-2">
                {s.change.startsWith("+") ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                )}
                <span className="text-[12px] font-semibold text-[#10B981]">{s.change}</span>
                <span className="text-[11px] text-text-light">vs Apr 30</span>
              </div>
              <div className="mt-3">
                <Sparkline color={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border-soft overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.name}
            onClick={() => setActiveTab(t.name)}
            className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === t.name
                ? "border-action-blue text-action-blue"
                : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            {t.name} <span className="ml-0.5">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Table + sidebar */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "2.1fr 1fr" }}>
        {/* Left: filters + table */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
              <input
                placeholder="Search exceptions..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue/40 transition-colors"
              />
            </div>
            <FilterPill label="All Types" />
            <FilterPill label="All Warehouses" />
            <FilterPill label="All Priorities" />
            <FilterPill label="More Filters" />
          </div>

          <div className="bg-white rounded-xl border border-border-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-soft-bg border-b border-border-soft">
                    {["Exception ID", "Type", "Description", "Warehouse", "Priority", "Status", "Detected On", "Actions"].map((h) => (
                      <th key={h} className="text-left text-[12px] font-semibold text-text-muted px-4 py-3 whitespace-nowrap uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border-soft/60 last:border-b-0 hover:bg-soft-bg/50 transition-colors">
                      <td className="px-4 py-3 text-[13px] font-semibold text-action-blue font-mono whitespace-nowrap">{r.id}</td>
                      <td className="px-4 py-3 text-[13px] text-text-muted font-medium">{r.type}</td>
                      <td className="px-4 py-3 text-[13px] text-text-primary max-w-[180px] truncate">{r.desc}</td>
                      <td className="px-4 py-3 text-[13px] text-text-muted whitespace-nowrap">{r.wh}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-md" style={{ backgroundColor: `${r.pc}12`, color: r.pc }}>
                          {r.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-md ${statusStyle[r.sc]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-muted whitespace-nowrap">{r.on}</td>
                      <td className="px-4 py-3">
                        <button className="text-text-light hover:text-text-muted transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border-soft">
              <span className="text-[12px] text-text-muted">Showing 1 to 10 of 312 exceptions</span>
              <div className="flex items-center gap-1">
                {["1", "2", "3", "4", "5", "…", "32"].map((p, i) => (
                  <button
                    key={i}
                    className={`min-w-[28px] h-7 px-2 rounded-md text-[12px] font-medium transition-colors ${
                      p === "1" ? "bg-action-blue text-white" : "text-text-muted hover:bg-soft-bg"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Exception Summary donut */}
          <div className="bg-white rounded-xl border border-border-soft p-5">
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">Exception Summary</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[120px] h-[120px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E6EDF5" strokeWidth="13" />
                  {summary.map((s, i) => {
                    const off = summary.slice(0, i).reduce((acc, x) => acc + x.pct, 0);
                    const dash = `${s.pct * 2.51327} ${251.327 - s.pct * 2.51327}`;
                    return (
                      <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={s.color} strokeWidth="13" strokeDasharray={dash} strokeDashoffset={-off * 2.51327} />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[20px] font-bold text-text-primary leading-none">312</span>
                  <span className="text-[10px] font-medium text-text-muted mt-0.5">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {summary.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-text-muted">{s.name}</span>
                    </div>
                    <span className="font-semibold text-text-primary">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exceptions by Priority */}
          <div className="bg-white rounded-xl border border-border-soft p-5">
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">Exceptions by Priority</h3>
            <div className="space-y-3">
              {priorities.map((p) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-medium text-text-muted">{p.name}</span>
                    <span className="text-[12px] font-semibold text-text-primary">{p.value}</span>
                  </div>
                  <div className="h-2 bg-border-blue/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Breach Trend */}
          <div className="bg-white rounded-xl border border-border-soft p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[15px] font-semibold text-text-primary">SLA Breach Trend</h3>
              <span className="text-[14px] font-bold text-text-primary">
                23 <span className="text-[11px] font-semibold text-[#10B981]">-15.7%</span>
              </span>
            </div>
            <p className="text-[11px] text-text-light mb-3">vs Apr 1 – Apr 30</p>
            <svg viewBox="0 0 320 110" className="w-full" style={{ height: 110 }}>
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="6" y1={6 + i * 28} x2="314" y2={6 + i * 28} stroke="#E6EDF5" strokeWidth="1" />
              ))}
              <polyline
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={[60, 40, 70, 35, 55, 30, 65, 38, 50, 28, 45, 32].map((v, i) => `${6 + i * 28},${6 + (v / 80) * 90}`).join(" ")}
              />
              {[60, 40, 70, 35, 55, 30, 65, 38, 50, 28, 45, 32].map((v, i) => (
                <circle key={i} cx={6 + i * 28} cy={6 + (v / 80) * 90} r="2.5" fill="white" stroke="#EF4444" strokeWidth="1.5" />
              ))}
            </svg>
          </div>

          {/* Top Warehouses by Exceptions */}
          <div className="bg-white rounded-xl border border-border-soft p-5">
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">Top Warehouses by Exceptions</h3>
            <div className="space-y-3">
              {topWh.map((w, i) => (
                <div key={w.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-soft-bg flex items-center justify-center text-[10px] font-bold text-text-muted">{i + 1}</span>
                    <span className="text-[13px] text-text-primary font-medium">{w.name}</span>
                  </div>
                  <span className="text-[13px] font-bold text-text-primary">{w.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border-soft/60">
              <a href="#" className="text-[13px] font-medium text-action-blue hover:underline">View full report →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Exceptions Over Time */}
      <div className="bg-white rounded-xl border border-border-soft p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-text-primary">Exceptions Over Time</h3>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-muted bg-soft-bg px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-border-soft transition-colors">
            Daily <ChevronDown className="w-3 h-3" />
          </span>
        </div>
        <div className="flex items-center gap-5 mb-4">
          {otSeries.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[11px] font-medium text-text-muted">{s.name}</span>
            </div>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={padL} y1={padT + i * ((H - padT - padB) / 4)} x2={W - 10} y2={padT + i * ((H - padT - padB) / 4)} stroke="#E6EDF5" strokeWidth="1" />
          ))}
          {["60", "45", "30", "15", "0"].map((l, i) => (
            <text key={i} x={padL - 5} y={padT + i * ((H - padT - padB) / 4) + 3} textAnchor="end" fontSize="9" fill="#9AA8B8">{l}</text>
          ))}
          {otSeries.map((s, si) => (
            <g key={si}>
              <polyline fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={s.pts.map((v, i) => `${cx(i)},${cy(v)}`).join(" ")} />
              {s.pts.map((v, i) => (
                <circle key={i} cx={cx(i)} cy={cy(v)} r="2.5" fill="white" stroke={s.color} strokeWidth="1.5" />
              ))}
            </g>
          ))}
          {["May 1", "May 5", "May 11", "May 16", "May 21", "May 26", "May 31"].map((l, i) => (
            <text key={i} x={padL + i * ((W - padL - 10) / 6)} y={H - 5} textAnchor="middle" fontSize="9" fill="#9AA8B8">{l}</text>
          ))}
        </svg>
        <div className="text-right mt-2">
          <a href="#" className="text-[13px] font-medium text-action-blue hover:underline">View full report →</a>
        </div>
      </div>

      {/* Bottom: Top Types + Resolution time + Quick Actions */}
      <div className="grid gap-4 grid-cols-3">
        {/* Top Exception Types */}
        <div className="bg-white rounded-xl border border-border-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-border-soft">
            <h3 className="text-[15px] font-semibold text-text-primary">Top Exception Types</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-soft-bg border-b border-border-soft">
                <th className="text-left text-[12px] font-semibold text-text-muted px-5 py-3 uppercase tracking-wide">Type</th>
                <th className="text-right text-[12px] font-semibold text-text-muted px-5 py-3 uppercase tracking-wide">Exceptions</th>
                <th className="text-right text-[12px] font-semibold text-text-muted px-5 py-3 uppercase tracking-wide">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {topTypes.map((t) => (
                <tr key={t.type} className="border-b border-border-soft/60 last:border-b-0 hover:bg-soft-bg/50 transition-colors">
                  <td className="px-5 py-3 text-[13px] font-semibold text-text-primary">{t.type}</td>
                  <td className="px-5 py-3 text-[13px] font-medium text-text-primary text-right">{t.count}</td>
                  <td className="px-5 py-3 text-[13px] text-text-muted text-right">{t.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-border-soft text-right">
            <a href="#" className="text-[13px] font-medium text-action-blue hover:underline">View full report →</a>
          </div>
        </div>

        {/* Average Resolution Time by Type */}
        <div className="bg-white rounded-xl border border-border-soft p-5">
          <h3 className="text-[15px] font-semibold text-text-primary mb-5">Average Resolution Time by Type (hrs)</h3>
          <div className="space-y-3">
            {resByType.map((r) => (
              <div key={r.type} className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-text-muted w-[68px] shrink-0">{r.type}</span>
                <div className="flex-1 h-2.5 bg-border-blue/40 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.w}%`, backgroundColor: r.color }} />
                </div>
                <span className="text-[12px] font-bold text-text-primary w-8 text-right">{r.hrs}</span>
              </div>
            ))}
          </div>
          <div className="text-right mt-5 pt-3 border-t border-border-soft/60">
            <a href="#" className="text-[13px] font-medium text-action-blue hover:underline">View full report →</a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-border-soft p-5">
          <h3 className="text-[15px] font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Create Exception", icon: Plus },
              { label: "Manage SLAs", icon: ShieldAlert },
              { label: "Assign to Team", icon: UserPlus },
              { label: "Exception Settings", icon: Settings },
              { label: "Download Report", icon: FileDown },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button key={a.label} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-soft-bg border border-border-soft rounded-lg text-[13px] font-medium text-text-primary hover:bg-border-blue/30 transition-colors">
                  <Icon className="w-4 h-4 text-text-muted" />
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA band */}
      <div className="gradient-dark-hero rounded-xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Resolve faster. Operate better.</h3>
            <p className="text-[12px] text-text-on-dark-muted mt-0.5">Set up automated exception rules and SLA alerts to catch issues before they impact your customers.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-navy hover:bg-white/90 shrink-0 transition-colors">
          <Settings className="w-4 h-4" /> Configure Automation
        </button>
      </div>
    </div>
  );
}
