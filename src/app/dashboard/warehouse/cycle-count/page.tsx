"use client";

import { useState } from "react";
import {
  ClipboardList, CheckCircle2, Activity, CalendarClock, XCircle,
  Search, Filter, Columns3, Plus, ChevronDown, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Calendar,
} from "lucide-react";

const stats = [
  { title: "Total Cycle Counts", value: "124", change: "+16.3%", note: "vs last 30 days", positive: true, icon: ClipboardList, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
  { title: "Completed", value: "98", sub: "79.0%", change: "+12.7%", note: "vs last 30 days", positive: true, icon: CheckCircle2, iconBg: "bg-teal/10", iconColor: "text-teal" },
  { title: "In Progress", value: "18", sub: "14.5%", change: "+5.9%", note: "vs last 30 days", positive: true, icon: Activity, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Scheduled", value: "6", sub: "4.8%", change: "-14.3%", note: "vs last 30 days", positive: false, icon: CalendarClock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Cancelled", value: "2", sub: "1.6%", change: "-20.0%", note: "vs last 30 days", positive: false, icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

const tabs = ["All Cycle Counts", "In Progress", "Scheduled", "Completed", "Cancelled"];

const rows = [
  { cc: "CC-000124", name: "Aisle A01 – A10", sub: "Routine Cycle Count", wh: "ATL-1", whSub: "Atlanta, GA", status: "Completed", progress: 100, start: "May 30, 2025", due: "May 30, 2025" },
  { cc: "CC-000123", name: "High Value Items", sub: "Priority Count", wh: "DFW-1", whSub: "Dallas, TX", status: "In Progress", progress: 65, start: "May 31, 2025", due: "Jun 2, 2025" },
  { cc: "CC-000122", name: "Zone B – Shelves 1-20", sub: "Routine Cycle Count", wh: "LAX-1", whSub: "Los Angeles, CA", status: "In Progress", progress: 40, start: "May 31, 2025", due: "Jun 1, 2025" },
  { cc: "CC-000121", name: "FRZ-01 Freezer Zone", sub: "Temperature Sensitive", wh: "MIA-1", whSub: "Miami, FL", status: "Scheduled", progress: 0, start: "Jun 2, 2025", due: "Jun 3, 2025" },
  { cc: "CC-000120", name: "Bulk Storage Area", sub: "Full Warehouse Count", wh: "ORD-1", whSub: "Chicago, IL", status: "Scheduled", progress: 0, start: "Jun 2, 2025", due: "Jun 5, 2025" },
  { cc: "CC-000119", name: "Electronics Category", sub: "Category Count", wh: "ATL-1", whSub: "Atlanta, GA", status: "Completed", progress: 100, start: "May 29, 2025", due: "May 29, 2025" },
  { cc: "CC-000118", name: "Damaged Inventory", sub: "Ad-Hoc Count", wh: "DFW-1", whSub: "Dallas, TX", status: "Completed", progress: 100, start: "May 28, 2025", due: "May 28, 2025" },
  { cc: "CC-000117", name: "Seasonal Items", sub: "Category Count", wh: "LAX-1", whSub: "Los Angeles, CA", status: "Cancelled", progress: 0, start: "May 27, 2025", due: "May 27, 2025" },
];

const byWh = [
  { wh: "ATL-1 (Atlanta, GA)", acc: "98.6%", change: "+1.8%", up: true },
  { wh: "DFW-1 (Dallas, TX)", acc: "97.9%", change: "+1.2%", up: true },
  { wh: "LAX-1 (Los Angeles, CA)", acc: "98.1%", change: "+0.9%", up: true },
  { wh: "MIA-1 (Miami, FL)", acc: "98.4%", change: "+2.1%", up: true },
  { wh: "ORD-1 (Chicago, IL)", acc: "97.6%", change: "-0.3%", up: false },
];

const upcoming = [
  { d: "02", m: "JUN", name: "Bulk Storage Area", wh: "ORD-1", time: "9:00 AM" },
  { d: "02", m: "JUN", name: "Pharma Zone", wh: "MIA-1", time: "10:00 AM" },
  { d: "03", m: "JUN", name: "FRZ-01 Freezer Zone", wh: "MIA-1", time: "9:00 AM" },
];

function Badge({ text }: { text: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-teal/10 text-teal",
    "In Progress": "bg-[#7C6FF6]/10 text-[#7C6FF6]",
    Scheduled: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
  };
  return <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[text] || "bg-soft-bg text-text-muted"}`}>{text}</span>;
}

function ProgressBar({ value, status }: { value: number; status: string }) {
  const colorMap: Record<string, string> = {
    Completed: "var(--color-teal)",
    "In Progress": "#7C6FF6",
    Scheduled: "#F59E0B",
    Cancelled: "#EF4444",
  };
  const barColor = colorMap[status] || "var(--color-action-blue)";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 bg-border-blue rounded-full h-1.5">
        <div className="h-1.5 rounded-full" style={{ width: `${value}%`, backgroundColor: barColor }} />
      </div>
      <span className="text-[11px] text-text-muted">{value}%</span>
    </div>
  );
}

const card = "bg-white rounded-xl border border-border-soft shadow-soft";
const thCls = "text-left text-[11px] font-semibold text-text-light uppercase tracking-[0.05em] px-6 py-3";

export default function CycleCountPage() {
  const [activeTab, setActiveTab] = useState("All Cycle Counts");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Cycle Count</h1>
          <p className="text-[14px] text-text-muted mt-1">Plan, manage, and track cycle counts to ensure inventory accuracy.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Filter className="w-4 h-4" /> Filters</button>
          <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Columns3 className="w-4 h-4" /> Columns</button>
          <button className="flex items-center gap-2 text-[13px] font-medium text-white bg-action-blue rounded-lg px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#004BBF]"><Plus className="w-4 h-4" /> New Cycle Count</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          const Arrow = s.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={s.title} className={card + " p-5"}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${s.iconBg} flex items-center justify-center`}><Icon className={`w-5 h-5 ${s.iconColor}`} /></div>
              </div>
              <span className="text-[13px] text-text-muted">{s.title}</span>
              <p className="text-[24px] font-bold text-text-primary mt-0.5">{s.value} {s.sub && <span className="text-[12px] font-normal text-text-light">{s.sub}</span>}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Arrow className={`w-3.5 h-3.5 ${s.positive ? "text-teal" : "text-[#EF4444]"}`} />
                <span className={`text-[12px] font-medium ${s.positive ? "text-teal" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-text-light">{s.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-border-soft">
        <div className="flex items-center" style={{ gap: "28px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-[14px] font-medium transition-colors ${
                activeTab === tab ? "text-action-blue" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-action-blue rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 2.6fr) minmax(0, 1fr)" }}>
        {/* Main table */}
        <div className={card + " overflow-hidden"}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input placeholder="Search by count name, location, reference..." className="w-full text-[13px] text-text-primary placeholder:text-text-light bg-white border border-border-soft rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
            </div>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Warehouses <ChevronDown className="w-3.5 h-3.5" /></button>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Statuses <ChevronDown className="w-3.5 h-3.5" /></button>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg"><Calendar className="w-3.5 h-3.5" /> May 1 – May 31, 2025</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-soft-bg border-b border-border-soft">
                <th className={thCls}>Count #</th><th className={thCls}>Count Name</th><th className={thCls}>Warehouse / Location</th><th className={thCls}>Status</th>
                <th className={thCls}>Progress</th><th className={thCls}>Start Date</th><th className={thCls}>Due Date</th>
                <th className={thCls + " text-right"}>Actions</th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.cc} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-medium text-action-blue font-mono">{r.cc}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-medium text-text-primary">{r.name}</p>
                      <p className="text-[11px] text-text-light">{r.sub}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] text-text-primary">{r.wh}</p>
                      <p className="text-[11px] text-text-light">{r.whSub}</p>
                    </td>
                    <td className="px-6 py-4"><Badge text={r.status} /></td>
                    <td className="px-6 py-4"><ProgressBar value={r.progress} status={r.status} /></td>
                    <td className="px-6 py-4 text-[13px] text-text-muted whitespace-nowrap">{r.start}</td>
                    <td className="px-6 py-4 text-[13px] text-text-muted whitespace-nowrap">{r.due}</td>
                    <td className="px-6 py-4 text-right"><button className="text-text-light hover:text-text-muted p-1"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-soft">
            <span className="text-[13px] text-text-muted">Showing 1-8 of 124 cycle counts</span>
            <div className="flex items-center gap-1">
              {["1", "2", "3", "...", "16"].map((p, i) => (
                <button key={i} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${p === "1" ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-soft-bg"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Cycle Count Status donut */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Cycle Count Status</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                  {(() => { let off = 0; const segs = [["var(--color-teal)", 79.0], ["#7C6FF6", 14.5], ["#F59E0B", 4.8], ["#EF4444", 1.6]] as [string, number][]; return segs.map(([c, p], i) => {
                    const da = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                    const el = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                    off += p; return el;
                  }); })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-[17px] font-bold text-text-primary leading-none">124</p><p className="text-[10px] text-text-light mt-0.5">Total</p></div></div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between text-[12px]"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-teal)" }} /><span className="text-text-muted">Completed</span></div><span className="font-medium text-text-primary">98 (79.0%)</span></div>
                <div className="flex items-center justify-between text-[12px]"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#7C6FF6" }} /><span className="text-text-muted">In Progress</span></div><span className="font-medium text-text-primary">18 (14.5%)</span></div>
                <div className="flex items-center justify-between text-[12px]"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#F59E0B" }} /><span className="text-text-muted">Scheduled</span></div><span className="font-medium text-text-primary">6 (4.8%)</span></div>
                <div className="flex items-center justify-between text-[12px]"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#EF4444" }} /><span className="text-text-muted">Cancelled</span></div><span className="font-medium text-text-primary">2 (1.6%)</span></div>
              </div>
            </div>
          </div>

          {/* Accuracy Overview */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-2"><h3 className="text-[14px] font-semibold text-text-primary">Accuracy Overview</h3><button className="text-[12px] text-action-blue hover:underline">View report</button></div>
            <p className="text-[28px] font-bold text-text-primary">98.2%</p>
            <p className="text-[11px] text-text-light mb-1">Overall Accuracy</p>
            <p className="text-[11px] text-teal flex items-center gap-1 mb-3"><ArrowUpRight className="w-3 h-3" /> +1.6% vs last 30 days</p>
            <p className="text-[11px] font-semibold text-text-light uppercase tracking-[0.05em] mb-2">By Warehouse</p>
            <div className="space-y-2">
              {byWh.map((w) => (
                <div key={w.wh} className="flex items-center justify-between text-[12px]">
                  <span className="text-text-muted">{w.wh}</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <span className="text-text-primary">{w.acc}</span>
                    <span className={`flex items-center gap-0.5 ${w.up ? "text-teal" : "text-[#EF4444]"}`}>{w.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{w.change}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Cycle Counts */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Upcoming Cycle Counts</h3><button className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {upcoming.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-action-blue/10 flex flex-col items-center justify-center shrink-0"><span className="text-[13px] font-bold text-action-blue leading-none">{u.d}</span><span className="text-[8px] font-medium text-action-blue">{u.m}</span></div>
                  <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-text-primary truncate">{u.name}</p><p className="text-[11px] text-text-light">{u.wh}</p></div>
                  <span className="text-[11px] text-text-muted shrink-0">{u.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA banner */}
      <div className="rounded-xl bg-deep-navy px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[16px] font-semibold text-white">Keep your inventory accurate</h3>
          <p className="text-[13px] text-text-on-dark-muted mt-0.5">Schedule a new cycle count to maintain accuracy across all your warehouses.</p>
        </div>
        <button className="flex items-center gap-2 text-[13px] font-medium text-deep-navy bg-white rounded-lg px-4 py-2.5 hover:bg-white/90 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Plus className="w-4 h-4" /> New Cycle Count
        </button>
      </div>
    </div>
  );
}
