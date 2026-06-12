"use client";

import {
  ClipboardCheck, CheckCircle2, AlertTriangle, Clock,
  ArrowUpRight, ArrowDownRight,
  Search, ChevronDown, MoreVertical, Plus, Calendar, Bell,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const stats = [
  { title: "Total Inspections", value: "248", change: "+12%", positive: true, icon: ClipboardCheck, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "Pass Rate", value: "94.6%", change: "+2.1%", positive: true, icon: CheckCircle2, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
  { title: "Failed Inspections", value: "37", change: "-5%", positive: false, icon: AlertTriangle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
  { title: "Pending Inspections", value: "22", change: "+8%", positive: true, icon: Clock, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
];

const results = [
  { name: "Passed", count: "214", pct: "86.3%", color: "#00B894" },
  { name: "Failed", count: "22", pct: "8.9%", color: "#EF4444" },
  { name: "Re-Inspection", count: "22", pct: "8.9%", color: "#7C6FF6" },
  { name: "Cancelled", count: "6", pct: "2.4%", color: "#D9E5F2" },
];

const stages = [
  { name: "Pre-production", value: 38 },
  { name: "During Production", value: 72 },
  { name: "Pre-shipment", value: 96 },
  { name: "Container Loading", value: 24 },
  { name: "In-transit", value: 18 },
];

const inspections = [
  { id: "QC-2025-0518-001", product: "Wireless Earbuds", sku: "WE-1001", supplier: "Shenzhen Tech Co.", inspector: "John Smith", stage: "Pre-shipment", date: "May 18, 2025", result: "Passed", score: "95%", status: "Completed" },
  { id: "QC-2025-0518-002", product: "Stainless Water Bottle", sku: "WB-2002", supplier: "Ningbo CleanLife", inspector: "Emily Chen", stage: "During Production", date: "May 18, 2025", result: "Failed", score: "72%", status: "Completed" },
  { id: "QC-2025-0517-015", product: "Yoga Mat", sku: "YM-3003", supplier: "Hangzhou Fitness", inspector: "Michael Lee", stage: "Pre-production", date: "May 17, 2025", result: "Passed", score: "91%", status: "Completed" },
  { id: "QC-2025-0517-014", product: "Bluetooth Speaker", sku: "BS-4004", supplier: "Shenzhen SoundTech", inspector: "Sarah Johnson", stage: "Pre-shipment", date: "May 17, 2025", result: "Re-inspection", score: "88%", status: "In Progress" },
  { id: "QC-2025-0516-009", product: "Cotton T-Shirt", sku: "CT-5005", supplier: "Guangzhou Apparel", inspector: "David Wang", stage: "During Production", date: "May 16, 2025", result: "Passed", score: "93%", status: "Completed" },
  { id: "QC-2025-0516-008", product: "Phone Case", sku: "PC-6006", supplier: "Shenzhen Accessory", inspector: "Jessica Li", stage: "Pre-shipment", date: "May 16, 2025", result: "Failed", score: "68%", status: "Completed" },
  { id: "QC-2025-0515-007", product: "LED Desk Lamp", sku: "LD-7007", supplier: "Zhongshan Lighting", inspector: "Thomas Brown", stage: "Container Loading", date: "May 15, 2025", result: "Passed", score: "97%", status: "Completed" },
  { id: "QC-2025-0515-006", product: "Travel Backpack", sku: "TB-8008", supplier: "Guangzhou Bags Co.", inspector: "Anna Zhang", stage: "In-transit", date: "May 15, 2025", result: "Re-inspection", score: "85%", status: "Pending" },
];

const stageColor: Record<string, string> = {
  "Pre-shipment": "#0057D8",
  "During Production": "#F59E0B",
  "Pre-production": "#7C6FF6",
  "Container Loading": "#F59E0B",
  "In-transit": "#007F8C",
};

const resultColor: Record<string, string> = {
  "Passed": "#00B894",
  "Failed": "#EF4444",
  "Re-inspection": "#7C6FF6",
};

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "Completed": { bg: "bg-[#00B894]/10", text: "text-[#00B894]", dot: "#00B894" },
  "In Progress": { bg: "bg-[#0057D8]/10", text: "text-[#0057D8]", dot: "#0057D8" },
  "Pending": { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", dot: "#F59E0B" },
};

function StageBadge({ stage }: { stage: string }) {
  const color = stageColor[stage];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] font-medium rounded-md"
      style={{
        backgroundColor: `${color}14`,
        color,
        boxShadow: `inset 0 0 0 1px ${color}26`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {stage}
    </span>
  );
}

function ResultBadge({ result }: { result: string }) {
  const color = resultColor[result];
  if (!color) return <span className="text-[13px] text-text-body">{result}</span>;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] font-medium rounded-md"
      style={{
        backgroundColor: `${color}14`,
        color,
        boxShadow: `inset 0 0 0 1px ${color}26`,
      }}
    >
      {result}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = statusConfig[status];
  if (!s) return <span className="text-[13px] text-text-body">{status}</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] font-medium rounded-md ${s.bg} ${s.text}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  );
}

export default function QCInspectionsPage() {
  const circumference = 2 * Math.PI * 40;
  const maxBar = 100;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-deep-navy">QC Inspections</h1>
          <p className="text-[14px] text-text-body mt-0.5">Monitor product quality and ensure compliance across all stages.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body hover:bg-soft-bg">
            <Calendar className="w-4 h-4" />
            May 12 – May 18, 2025
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg">
            <Bell className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-action-blue hover:bg-navy rounded-lg text-[13px] font-medium text-white transition-colors">
            <Plus className="w-4 h-4" />
            New Inspection
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-text-muted">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-deep-navy leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {s.positive ? (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5 text-teal" />
                    <span className="text-[12px] font-medium text-teal">{s.change}</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span className="text-[12px] font-medium text-[#EF4444]">{s.change}</span>
                  </>
                )}
                <span className="text-[11px] text-text-light">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Results donut */}
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
          <h3 className="text-[14px] font-semibold text-deep-navy mb-4">Inspection Results Overview</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-[140px] h-[140px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#D9E5F2" strokeWidth="12" />
                {(() => {
                  let innerOff = 0;
                  return results.map((r, i) => {
                    const p = parseFloat(r.pct);
                    const len = (p / 100) * circumference;
                    const el = (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={r.color}
                        strokeWidth="12"
                        strokeLinecap="butt"
                        strokeDasharray={`${len} ${circumference - len}`}
                        strokeDashoffset={-(innerOff / 100) * circumference}
                      />
                    );
                    innerOff += p;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[10px] text-text-light">Total</p>
                  <p className="text-[20px] font-bold text-deep-navy">248</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {results.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="text-text-body truncate">{r.name}</span>
                  </div>
                  <span className="font-medium text-deep-navy shrink-0 ml-2">{r.count} <span className="text-text-light">({r.pct})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage bar chart */}
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-deep-navy">Inspections by Stage</h3>
            <span className="inline-flex items-center gap-1 text-[12px] text-text-muted bg-soft-bg px-2.5 py-1 rounded-md">
              This Week
              <ChevronDown className="w-3 h-3" />
            </span>
          </div>
          <div className="flex items-end justify-between gap-3 h-[160px] px-2">
            {stages.map((s) => (
              <div key={s.name} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[12px] font-semibold text-deep-navy mb-1">{s.value}</span>
                <div className="w-full bg-[#0057D8] rounded-t" style={{ height: `${(s.value / maxBar) * 100}%` }} />
                <span className="text-[10px] text-text-light mt-2 text-center leading-tight">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-border-soft p-3 shadow-soft">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <input
              placeholder="Search inspections..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-deep-navy placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue"
            />
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg">
            Date Range
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg">
            Status
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg">
            Result
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border-soft shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "900px" }}>
            <thead>
              <tr className="bg-soft-bg border-b border-border-soft">
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Product</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">SKU</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Stage</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Result</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((it) => {
                const color = resultColor[it.result] || "#66758C";
                return (
                  <tr key={it.id} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                          style={{
                            backgroundColor: `${color}14`,
                            color,
                            boxShadow: `inset 0 0 0 1px ${color}26`,
                          }}
                        >
                          {it.product.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-deep-navy leading-tight">{it.product}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-text-body font-mono">{it.sku}</td>
                    <td className="px-5 py-3">
                      <StageBadge stage={it.stage} />
                    </td>
                    <td className="px-5 py-3">
                      <ResultBadge result={it.result} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={it.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-text-light hover:text-text-muted p-1 rounded hover:bg-[#F1F5F9]">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft">
          <p className="text-[12px] text-text-muted">Showing 1 to 10 of 248 inspections</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-light hover:bg-soft-bg">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md bg-action-blue text-white text-[12px] font-medium">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted text-[12px] hover:bg-soft-bg">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted text-[12px] hover:bg-soft-bg">3</button>
              <span className="px-1 text-text-light text-[12px]">…</span>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted text-[12px] hover:bg-soft-bg">25</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted hover:bg-soft-bg">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="inline-flex items-center gap-1 px-2 py-1 border border-border-soft rounded-md text-[12px] text-text-muted">
              10 / page
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
