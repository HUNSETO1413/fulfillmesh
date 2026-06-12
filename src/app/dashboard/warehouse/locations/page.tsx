"use client";

import {
  MapPin, CheckCircle2, Boxes, AlertTriangle, Square,
  Search, Filter, Plus, Download, ChevronDown, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Grid3X3,
} from "lucide-react";

const stats = [
  { title: "Total Locations", value: "128", change: "+8.0%", note: "vs last 30 days", positive: true, icon: MapPin, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
  { title: "Active Locations", value: "112", sub: "87.5% of total", change: "+6.3%", note: "vs last 30 days", positive: true, icon: CheckCircle2, iconBg: "bg-teal/10", iconColor: "text-teal" },
  { title: "Bin Locations", value: "1,842", change: "+12.1%", note: "vs last 30 days", positive: true, icon: Boxes, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Low Stock Locations", value: "7", change: "-12.5%", note: "vs last 30 days", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Empty Locations", value: "9", change: "-16.2%", note: "vs last 30 days", positive: false, icon: Square, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

const rows = [
  { code: "ATL1-A01-01", name: "Receiving Area", wh: "ATL-1", whSub: "Atlanta, GA", type: "Zone", typeColor: "var(--color-action-blue)", cap: "5,000", capSub: "cubic ft", util: 42, status: "Active" },
  { code: "ATL1-B02-05", name: "Pick Zone B02", wh: "ATL-1", whSub: "Atlanta, GA", type: "Pick Zone", typeColor: "var(--color-teal)", cap: "1,200", capSub: "cubic ft", util: 78, status: "Active" },
  { code: "ATL1-B02-06", name: "Pick Zone B02-06", wh: "ATL-1", whSub: "Atlanta, GA", type: "Bin", typeColor: "#7C6FF6", cap: "300", capSub: "cubic ft", util: 65, status: "Active" },
  { code: "LAX1-C03-01", name: "Reserve Storage", wh: "LAX-1", whSub: "Los Angeles, CA", type: "Reserve", typeColor: "#F59E0B", cap: "8,000", capSub: "cubic ft", util: 91, status: "Active" },
  { code: "LAX1-D04-12", name: "Bulk Storage D04", wh: "LAX-1", whSub: "Los Angeles, CA", type: "Bulk", typeColor: "#EF4444", cap: "20,000", capSub: "cubic ft", util: 56, status: "Active" },
  { code: "DFW1-A01-01", name: "Receiving Area", wh: "DFW-1", whSub: "Dallas, TX", type: "Zone", typeColor: "var(--color-action-blue)", cap: "5,000", capSub: "cubic ft", util: 33, status: "Active" },
];

const byType = [
  { name: "Pick Zone", count: "54", color: "var(--color-teal)" },
  { name: "Bin", count: "62", color: "var(--color-action-blue)" },
  { name: "Zone", count: "18", color: "#F59E0B" },
  { name: "Bulk", count: "10", color: "#7C6FF6" },
  { name: "Reserve", count: "8", color: "#EF4444" },
  { name: "Special", count: "6", color: "#EC4899" },
];

const lowStock = [
  { code: "ATL1-D04-12", name: "Bulk Storage D04", skus: "12 SKUs" },
  { code: "DFW1-B05-03", name: "Pick Zone B05", skus: "8 SKUs" },
  { code: "LAX1-D07-08", name: "Pick Zone D07", skus: "6 SKUs" },
  { code: "ORD1-C03-01", name: "High Value Storage", skus: "5 SKUs" },
];

const activity = [
  { text: "Location ATL1-B02-06 updated", info: "Capacity changed to 500 cubic ft", time: "2h ago", color: "var(--color-action-blue)" },
  { text: "New location MIA1-D05-02 added", info: "Pick Zone created", time: "5h ago", color: "var(--color-teal)" },
];

const utilBands = [
  { label: "0 - 50%", color: "var(--color-teal)", count: "46 (35.2%)" },
  { label: "50 - 75%", color: "var(--color-action-blue)", count: "53 (41.4%)" },
  { label: "75 - 90%", color: "#F59E0B", count: "18 (14.1%)" },
  { label: "90 - 100%", color: "#EF4444", count: "11 (8.6%)" },
];

const card = "bg-white rounded-xl border border-border-soft shadow-soft";
const thCls = "text-left text-[11px] font-semibold text-text-light uppercase tracking-[0.05em] px-6 py-3";

export default function WarehouseLocationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Locations</h1>
          <p className="text-[14px] text-text-muted mt-1">View and manage all warehouse locations and their inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg">All Warehouses (5) <ChevronDown className="w-3.5 h-3.5" /></button>
          <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Filter className="w-4 h-4" /> Filters</button>
          <button className="flex items-center gap-2 text-[13px] font-medium text-white bg-action-blue rounded-lg px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#004BBF]"><Plus className="w-4 h-4" /> Add Location</button>
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
              <p className="text-[24px] font-bold text-text-primary mt-0.5">{s.value}{s.sub && <span className="text-[12px] font-normal text-text-light ml-1">{s.sub}</span>}</p>
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
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input placeholder="Search by location name, code or warehouse..." className="w-full text-[13px] text-text-primary placeholder:text-text-light bg-white border border-border-soft rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
            </div>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Types <ChevronDown className="w-3.5 h-3.5" /></button>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Statuses <ChevronDown className="w-3.5 h-3.5" /></button>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg"><Download className="w-4 h-4" /> Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-soft-bg border-b border-border-soft">
                <th className={thCls}>Location Code</th><th className={thCls}>Location Name</th><th className={thCls}>Warehouse</th>
                <th className={thCls}>Type</th><th className={thCls}>Capacity</th><th className={thCls}>Utilization</th><th className={thCls}>Status</th>
                <th className={thCls + " text-right"}>Actions</th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.code} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-6 py-4 text-[13px] font-medium text-action-blue font-mono">{r.code}</td>
                    <td className="px-6 py-4 text-[13px] text-text-primary">{r.name}</td>
                    <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.wh}</p><p className="text-[11px] text-text-light">{r.whSub}</p></td>
                    <td className="px-6 py-4"><span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: r.typeColor + "1a", color: r.typeColor }}>{r.type}</span></td>
                    <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.cap}</p><p className="text-[11px] text-text-light">{r.capSub}</p></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-border-blue rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${r.util}%`, backgroundColor: r.util >= 90 ? "#EF4444" : r.util >= 75 ? "#F59E0B" : "var(--color-teal)" }} /></div>
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
            <span className="text-[13px] text-text-muted">Showing 1-6 of 128 locations</span>
            <div className="flex items-center gap-1">
              {["1", "2", "3", "...", "22"].map((p, i) => (
                <button key={i} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${p === "1" ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-soft-bg"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Location Utilization donut */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Location Utilization</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                  {(() => { let off = 0; const segs: [string, number][] = [["var(--color-teal)", 35.2], ["var(--color-action-blue)", 41.4], ["#F59E0B", 14.1], ["#EF4444", 8.6]]; return segs.map(([c, p], i) => {
                    const da = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                    const el = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                    off += p; return el;
                  }); })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-[17px] font-bold text-text-primary leading-none">67%</p><p className="text-[10px] text-text-light mt-0.5">Average</p></div></div>
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

          {/* Locations by Type */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Locations by Type</h3>
            <div className="space-y-2.5">
              {byType.map((t) => (
                <div key={t.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-soft-bg"><Grid3X3 className="w-4 h-4 text-text-light" style={{ color: t.color }} /></div>
                  <span className="text-[12px] text-text-muted flex-1">{t.name}</span>
                  <span className="text-[13px] font-semibold text-text-primary">{t.count}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-[12px] pt-2 border-t border-border-soft"><span className="font-semibold text-text-primary">Total</span><span className="font-semibold text-text-primary">128</span></div>
            </div>
          </div>

          {/* Low Stock Locations */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Low Stock Locations</h3><button className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {lowStock.map((l) => (
                <div key={l.code} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0"><AlertTriangle className="w-4 h-4 text-[#EF4444]" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-text-primary font-mono">{l.code}</p><p className="text-[11px] text-text-light">{l.name}</p></div>
                  <span className="text-[11px] font-medium text-[#EF4444] shrink-0">{l.skus}</span>
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

      {/* Bottom CTA banner */}
      <div className="rounded-xl bg-deep-navy px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-[16px] font-semibold text-white">Organize your warehouse better</h3>
          <p className="text-[13px] text-text-on-dark-muted mt-0.5">Add new locations to improve picking efficiency and inventory accuracy.</p>
        </div>
        <button className="flex items-center gap-2 text-[13px] font-medium text-deep-navy bg-white rounded-lg px-4 py-2.5 hover:bg-white/90 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Plus className="w-4 h-4" /> Add Location
        </button>
      </div>
    </div>
  );
}
