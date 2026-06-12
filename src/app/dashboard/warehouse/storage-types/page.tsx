"use client";

import {
  Boxes, CheckCircle2, Gauge, AlertTriangle, XCircle,
  Search, Filter, Columns3, Plus, Download, ChevronDown, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Package, Snowflake, ShieldCheck, Layers,
} from "lucide-react";

const stats = [
  { title: "Total Storage Types", value: "18", change: "+12.5%", note: "vs last 30 days", positive: true, icon: Boxes, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
  { title: "Active Storage Types", value: "15", sub: "83.3% of total", change: "+7.1%", note: "vs last 30 days", positive: true, icon: CheckCircle2, iconBg: "bg-teal/10", iconColor: "text-teal" },
  { title: "Utilized Capacity", value: "67.8%", change: "+5.6%", note: "vs last 30 days", positive: true, icon: Gauge, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Low Utilization", value: "2", change: "-13.3%", note: "vs last 30 days", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Inactive Storage Types", value: "3", change: "-15.0%", note: "vs last 30 days", positive: false, icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

const rows = [
  { code: "BIN", name: "Bin Location", desc: "Small item storage for fast picks", suit: "Small Items", util: 82, status: "Active" },
  { code: "SHELF", name: "Shelf Storage", desc: "General items on shelves", suit: "General", util: 74, status: "Active" },
  { code: "RACK", name: "Pallet Rack", desc: "Pallets on rack systems", suit: "Pallets", util: 68, status: "Active" },
  { code: "BULK", name: "Bulk Storage", desc: "Bulk items on floor", suit: "Bulk", util: 61, status: "Active" },
  { code: "CAGE", name: "Cage Storage", desc: "Items in security cages", suit: "High Value", util: 55, status: "Active" },
  { code: "COOL", name: "Cold Storage", desc: "Temperature controlled (2-8°C)", suit: "Perishables", util: 90, status: "Active" },
  { code: "FRZ", name: "Frozen Storage", desc: "Frozen goods (-18°C and below)", suit: "Frozen", util: 76, status: "Active" },
  { code: "HAZ", name: "Hazardous Storage", desc: "Hazardous material storage", suit: "Regulated", util: 43, status: "Active" },
];

const byCategory = [
  { name: "Standard", count: "8", pct: "(44.4%)", color: "var(--color-action-blue)" },
  { name: "Specialized", count: "6", pct: "(33.3%)", color: "var(--color-teal)" },
  { name: "Temperature Controlled", count: "2", pct: "(11.1%)", color: "#7C6FF6" },
  { name: "Security / Restricted", count: "2", pct: "(11.1%)", color: "#F59E0B" },
];

const lowUtil = [
  { code: "QUAR", name: "Quarantine Storage", util: "28%" },
  { code: "TMP", name: "Temperature Buffer", util: "24%" },
];

const activity = [
  { text: 'Storage type "Pick Zone" updated', info: "Configuration changed", time: "2h ago", color: "var(--color-teal)" },
  { text: 'New storage type "Mezzanine" added', info: "Created by Admin", time: "5h ago", color: "var(--color-action-blue)" },
];

const utilBands = [
  { label: "80 - 100%", color: "var(--color-teal)", count: "8 (44.4%)" },
  { label: "50 - 79%", color: "var(--color-action-blue)", count: "6 (33.3%)" },
  { label: "20 - 49%", color: "#F59E0B", count: "2 (11.1%)" },
  { label: "0 - 19%", color: "#EF4444", count: "2 (11.1%)" },
];

const card = "bg-white rounded-xl border border-border-soft shadow-soft";
const thCls = "text-left text-[11px] font-semibold text-text-light uppercase tracking-[0.05em] px-6 py-3";

export default function StorageTypesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Storage shelving illustration */}
          <svg width="84" height="64" viewBox="0 0 84 64" className="shrink-0" aria-hidden="true">
            {/* shelving frame */}
            <rect x="4" y="6" width="76" height="52" rx="3" fill="var(--color-soft-bg)" stroke="var(--color-border-soft)" strokeWidth="2" />
            <line x1="4" y1="24" x2="80" y2="24" stroke="var(--color-border-soft)" strokeWidth="2" />
            <line x1="4" y1="41" x2="80" y2="41" stroke="var(--color-border-soft)" strokeWidth="2" />
            <line x1="29" y1="6" x2="29" y2="58" stroke="var(--color-border-soft)" strokeWidth="2" />
            <line x1="55" y1="6" x2="55" y2="58" stroke="var(--color-border-soft)" strokeWidth="2" />
            {/* top shelf boxes */}
            <rect x="9" y="12" width="14" height="9" rx="1.5" fill="var(--color-action-blue)" />
            <rect x="35" y="13" width="13" height="8" rx="1.5" fill="var(--color-teal)" />
            <rect x="61" y="11" width="13" height="10" rx="1.5" fill="#F59E0B" />
            {/* middle shelf boxes */}
            <rect x="10" y="30" width="12" height="8" rx="1.5" fill="#7C6FF6" />
            <rect x="36" y="29" width="14" height="9" rx="1.5" fill="var(--color-action-blue)" />
            <rect x="62" y="30" width="12" height="8" rx="1.5" fill="var(--color-teal)" />
            {/* bottom shelf boxes */}
            <rect x="9" y="46" width="14" height="9" rx="1.5" fill="var(--color-teal)" />
            <rect x="36" y="47" width="12" height="8" rx="1.5" fill="#F59E0B" />
            <rect x="60" y="46" width="14" height="9" rx="1.5" fill="var(--color-action-blue)" />
          </svg>
          <div>
            <h1 className="text-[24px] font-bold text-text-primary">Storage Types</h1>
            <p className="text-[14px] text-text-muted mt-1">Manage storage types to optimize space, organization, and handling.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Filter className="w-4 h-4" /> Filters</button>
          <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Columns3 className="w-4 h-4" /> Columns</button>
          <button className="flex items-center gap-2 text-[13px] font-medium text-white bg-action-blue rounded-lg px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#004BBF]"><Plus className="w-4 h-4" /> Add Storage Type</button>
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
              <p className="text-[24px] font-bold text-text-primary mt-0.5">{s.value}</p>
              {s.sub && <p className="text-[12px] text-text-light mt-0.5">{s.sub}</p>}
              <div className="flex items-center gap-1 mt-1.5">
                <Arrow className={`w-3.5 h-3.5 ${s.positive ? "text-teal" : "text-[#EF4444]"}`} />
                <span className={`text-[12px] font-medium ${s.positive ? "text-teal" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-text-light">{s.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 2.6fr) minmax(0, 1fr)" }}>
        {/* Main table */}
        <div className={card + " overflow-hidden"}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-text-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input placeholder="Search by storage type name or code..." className="w-full text-[13px] text-text-primary placeholder:text-text-light bg-white border border-border-soft rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
            </div>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Warehouses <ChevronDown className="w-3.5 h-3.5" /></button>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Statuses <ChevronDown className="w-3.5 h-3.5" /></button>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg"><Download className="w-4 h-4" /> Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-soft-bg border-b border-border-soft">
                <th className={thCls}>Storage Type Code</th><th className={thCls}>Storage Type Name</th><th className={thCls}>Description</th>
                <th className={thCls}>Suitable For</th><th className={thCls}>Utilization</th><th className={thCls}>Status</th>
                <th className={thCls + " text-right"}>Actions</th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.code} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-6 py-4 text-[13px] font-medium text-action-blue font-mono">{r.code}</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-text-primary">{r.name}</td>
                    <td className="px-6 py-4 text-[13px] text-text-muted">{r.desc}</td>
                    <td className="px-6 py-4 text-[13px] text-text-muted">{r.suit}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-border-blue rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${r.util}%`, backgroundColor: r.util >= 80 ? "var(--color-teal)" : r.util >= 50 ? "var(--color-action-blue)" : "#F59E0B" }} /></div>
                        <span className="text-[11px] text-text-muted">{r.util}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full bg-teal/10 text-teal">{r.status}</span></td>
                    <td className="px-6 py-4 text-right"><button className="text-text-light hover:text-text-muted p-1"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-soft">
            <span className="text-[13px] text-text-muted">Showing 1-8 of 18 storage types</span>
            <div className="flex items-center gap-1">
              {["1", "2", "3"].map((p, i) => (
                <button key={i} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${p === "1" ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-soft-bg"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Utilization Overview donut */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Utilization Overview</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                  {(() => { let off = 0; const segs: [string, number][] = [["var(--color-teal)", 44.4], ["var(--color-action-blue)", 33.3], ["#F59E0B", 11.1], ["#EF4444", 11.1]]; return segs.map(([c, p], i) => {
                    const da = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                    const el = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                    off += p; return el;
                  }); })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-[17px] font-bold text-text-primary leading-none">67.8%</p><p className="text-[10px] text-text-light mt-0.5">Average</p></div></div>
              </div>
              <div className="flex-1 space-y-2">
                {utilBands.map((b) => (
                  <div key={b.label} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} /><span className="text-text-muted">{b.label}</span></div>
                    <span className="font-medium text-text-primary">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Storage Types by Category */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Storage Types by Category</h3>
            <div className="space-y-2.5">
              {byCategory.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} /><span className="text-text-muted">{c.name}</span></div>
                  <div className="flex items-center gap-3"><span className="font-medium text-text-primary">{c.count}</span><span className="text-text-light w-12 text-right">{c.pct}</span></div>
                </div>
              ))}
              <div className="flex items-center justify-between text-[12px] pt-2 border-t border-border-soft"><span className="font-semibold text-text-primary">Total</span><span className="font-semibold text-text-primary">18</span></div>
            </div>
          </div>

          {/* Low Utilization Storage Types */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Low Utilization Storage Types</h3><button className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {lowUtil.map((l) => (
                <div key={l.code} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-soft-bg flex items-center justify-center shrink-0"><Gauge className="w-4 h-4 text-[#F59E0B]" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-text-primary truncate">{l.name}</p><p className="text-[11px] text-text-light font-mono">{l.code}</p></div>
                  <span className="text-[11px] font-medium text-[#F59E0B] shrink-0">{l.util}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Recent Activity</h3><button className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.color }} />
                  <div className="flex-1"><p className="text-[12px] text-text-primary">{a.text}</p><p className="text-[11px] text-text-light">{a.info}</p></div>
                  <span className="text-[11px] text-text-light shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
