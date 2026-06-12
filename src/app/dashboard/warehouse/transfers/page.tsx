"use client";

import { useState } from "react";
import {
  ArrowLeftRight, CheckCircle2, Truck, Clock, XCircle,
  Search, Filter, Columns3, Plus, ChevronDown, MoreHorizontal, ArrowRight,
  ArrowUpRight, ArrowDownRight, Package, Layers, Gauge, Boxes,
} from "lucide-react";

const stats = [
  { title: "Total Transfers", value: "586", change: "+14.7%", note: "vs last 30 days", positive: true, icon: ArrowLeftRight, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
  { title: "Completed", value: "512", sub: "87.4%", change: "+11.2%", note: "vs last 30 days", positive: true, icon: CheckCircle2, iconBg: "bg-teal/10", iconColor: "text-teal" },
  { title: "In Transit", value: "48", sub: "8.2%", change: "+5.6%", note: "vs last 30 days", positive: true, icon: Truck, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Pending", value: "16", sub: "2.7%", change: "-11.1%", note: "vs last 30 days", positive: false, icon: Clock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Cancelled", value: "10", sub: "1.7%", change: "-25.1%", note: "vs last 30 days", positive: false, icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

const tabs = ["All Transfers", "In Transit", "Pending", "Completed", "Cancelled"];

const rows = [
  { tr: "TR-00987", ref: "REF-78230", from: "ATL-1", fromCity: "Atlanta, GA", to: "LAX-1", toCity: "Los Angeles, CA", items: "24 SKUs", units: "1,200 units", status: "In Transit", req: "May 20, 2025", eta: "May 23, 2025" },
  { tr: "TR-00986", ref: "REF-78229", from: "DFW-1", fromCity: "Dallas, TX", to: "MIA-1", toCity: "Miami, FL", items: "15 SKUs", units: "980 units", status: "Completed", req: "May 19, 2025", eta: "May 22, 2025" },
  { tr: "TR-00985", ref: "REF-78228", from: "ORD-1", fromCity: "Chicago, IL", to: "ATL-1", toCity: "Atlanta, GA", items: "30 SKUs", units: "1,540 units", status: "In Transit", req: "May 19, 2025", eta: "May 23, 2025" },
  { tr: "TR-00984", ref: "REF-78227", from: "LAX-1", fromCity: "Los Angeles, CA", to: "SEA-1", toCity: "Seattle, WA", items: "8 SKUs", units: "420 units", status: "Pending", req: "May 18, 2025", eta: "May 24, 2025" },
  { tr: "TR-00983", ref: "REF-78226", from: "MIA-1", fromCity: "Miami, FL", to: "DFW-1", toCity: "Dallas, TX", items: "12 SKUs", units: "640 units", status: "Completed", req: "May 18, 2025", eta: "May 21, 2025" },
];

const summary = [
  { label: "Total Units Moved", value: "48,652", change: "+8.2%", up: true, icon: Boxes, color: "var(--color-action-blue)" },
  { label: "Total SKUs Moved", value: "412", change: "+9.6%", up: true, icon: Layers, color: "var(--color-teal)" },
  { label: "Avg. Transit Time", value: "2.3 days", change: "-6.7%", up: false, icon: Clock, color: "#7C6FF6" },
  { label: "On-Time Rate", value: "95.6%", change: "+3.4%", up: true, icon: Gauge, color: "#F59E0B" },
];

const routes = [
  { route: "ATL-1 → LAX-1", count: "48 transfers" },
  { route: "DFW-1 → ATL-1", count: "42 transfers" },
  { route: "ORD-1 → MIA-1", count: "37 transfers" },
  { route: "LAX-1 → ATL-1", count: "35 transfers" },
  { route: "MIA-1 → DFW-1", count: "31 transfers" },
];

const activity = [
  { text: "Transfer TR-00987 is in transit", info: "ATL-1 → LAX-1", time: "1h ago", color: "var(--color-action-blue)" },
  { text: "Transfer TR-00986 completed", info: "DFW-1 → MIA-1", time: "3h ago", color: "var(--color-teal)" },
  { text: "Transfer TR-00984 pending approval", info: "LAX-1 → SEA-1", time: "5h ago", color: "#F59E0B" },
];

function Badge({ text }: { text: string }) {
  const styles: Record<string, string> = {
    "In Transit": "bg-[#7C6FF6]/10 text-[#7C6FF6]",
    Completed: "bg-teal/10 text-teal",
    Pending: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
  };
  return <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[text] || "bg-gray-100 text-gray-600"}`}>{text}</span>;
}

const card = "bg-white rounded-xl border border-border-soft shadow-soft";
const thCls = "text-left text-[11px] font-semibold text-text-light uppercase tracking-[0.05em] px-6 py-3";

export default function StockTransfersPage() {
  const [activeTab, setActiveTab] = useState("All Transfers");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Warehouse Transfers</h1>
          <p className="text-[14px] text-text-muted mt-1">Move inventory between warehouses and locations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Filter className="w-4 h-4" /> Filters</button>
          <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Columns3 className="w-4 h-4" /> Columns</button>
          <button className="flex items-center gap-2 text-[13px] font-medium text-white bg-action-blue rounded-lg px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#004BBF]"><Plus className="w-4 h-4" /> New Transfer</button>
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
              <input placeholder="Search by transfer #, reference, or items..." className="w-full text-[13px] text-text-primary placeholder:text-text-light bg-white border border-border-soft rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
            </div>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Warehouses <ChevronDown className="w-3.5 h-3.5" /></button>
            <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Statuses <ChevronDown className="w-3.5 h-3.5" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-soft-bg border-b border-border-soft">
                <th className={thCls}>Transfer #</th><th className={thCls}>From</th><th className={thCls}>To</th>
                <th className={thCls}>Items</th><th className={thCls}>Status</th><th className={thCls}>Requested On</th><th className={thCls}>ETA</th>
                <th className={thCls + " text-right"}>Actions</th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.tr} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-soft-bg flex items-center justify-center shrink-0"><ArrowLeftRight className="w-4 h-4 text-text-light" /></div>
                        <div><p className="text-[13px] font-medium text-action-blue leading-tight font-mono">{r.tr}</p><p className="text-[11px] text-text-light leading-tight mt-0.5 font-mono">{r.ref}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.from}</p><p className="text-[11px] text-text-light mt-0.5">{r.fromCity}</p></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-text-light shrink-0" />
                        <div><p className="text-[13px] text-text-primary">{r.to}</p><p className="text-[11px] text-text-light mt-0.5">{r.toCity}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.items}</p><p className="text-[11px] text-text-light mt-0.5">{r.units}</p></td>
                    <td className="px-6 py-4"><Badge text={r.status} /></td>
                    <td className="px-6 py-4 text-[13px] text-text-muted whitespace-nowrap">{r.req}</td>
                    <td className="px-6 py-4 text-[13px] text-text-muted whitespace-nowrap">{r.eta}</td>
                    <td className="px-6 py-4 text-right"><button className="text-text-light hover:text-text-muted p-1"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-soft">
            <span className="text-[13px] text-text-muted">Showing 1-5 of 586 transfers</span>
            <div className="flex items-center gap-1">
              {["1", "2", "3", "...", "118"].map((p, i) => (
                <button key={i} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${p === "1" ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-soft-bg"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Transfer Status donut */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Transfer Status</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                  {(() => { let off = 0; const segs = [["var(--color-teal)", 87.4], ["var(--color-action-blue)", 8.2], ["#F59E0B", 2.7], ["#EF4444", 1.7]] as [string, number][]; return segs.map(([c, p], i) => {
                    const da = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                    const el = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                    off += p; return el;
                  }); })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-[17px] font-bold text-text-primary leading-none">586</p><p className="text-[10px] text-text-light mt-0.5">Total</p></div></div>
              </div>
              <div className="flex-1 space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="flex items-center gap-2 text-text-muted"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-teal)" }} />Completed</span><span className="font-medium text-text-primary">512 (87.4%)</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-2 text-text-muted"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-action-blue)" }} />In Transit</span><span className="font-medium text-text-primary">48 (8.2%)</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-2 text-text-muted"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#F59E0B" }} />Pending</span><span className="font-medium text-text-primary">16 (2.7%)</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-2 text-text-muted"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#EF4444" }} />Cancelled</span><span className="font-medium text-text-primary">10 (1.7%)</span></div>
              </div>
            </div>
          </div>

          {/* Transfer Summary */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Transfer Summary</h3><button className="text-[12px] text-action-blue hover:underline">View report</button></div>
            <div className="space-y-3">
              {summary.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + "1a" }}><Icon className="w-4 h-4" style={{ color: s.color }} /></div>
                    <span className="text-[12px] text-text-muted flex-1">{s.label}</span>
                    <span className="text-[13px] font-semibold text-text-primary">{s.value}</span>
                    <span className={`text-[11px] font-medium w-12 text-right ${s.up ? "text-teal" : "text-[#EF4444]"}`}>{s.change}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Transfer Routes */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Top Transfer Routes</h3><button className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {routes.map((r) => (
                <div key={r.route} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-soft-bg flex items-center justify-center shrink-0"><ArrowLeftRight className="w-4 h-4 text-action-blue" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-text-primary truncate">{r.route}</p><p className="text-[11px] text-text-light">{r.count}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Recent Activity</h3><button className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5"><span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.color }} /><div className="flex-1 min-w-0"><p className="text-[12px] text-text-primary">{a.text}</p><p className="text-[11px] text-text-light">{a.info}</p></div><span className="text-[11px] text-text-light shrink-0">{a.time}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA banner */}
      <div className="rounded-xl bg-action-blue px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0"><ArrowLeftRight className="w-5 h-5 text-white" /></div>
          <div>
            <p className="text-[16px] font-semibold text-white">Need to move inventory?</p>
            <p className="text-[13px] text-white/80 mt-0.5">Create a transfer to rebalance stock across your warehouses.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-[13px] font-medium text-action-blue bg-white rounded-lg px-4 py-2.5 hover:bg-white/90 shrink-0"><Plus className="w-4 h-4" /> Create Transfer</button>
      </div>
    </div>
  );
}
