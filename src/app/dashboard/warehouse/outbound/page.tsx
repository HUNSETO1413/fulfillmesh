"use client";

import { useState } from "react";
import {
  Truck, PackageCheck, Navigation, AlertTriangle, XCircle,
  Search, Filter, Columns3, Plus, ChevronDown, MoreHorizontal,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const stats = [
  { title: "Total Shipments", value: "1,532", change: "+12.4%", note: "vs last 30 days", positive: true, icon: Truck, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
  { title: "Shipped", value: "1,245", change: "+9.1%", note: "vs last 30 days", positive: true, sub: "81.2%", icon: PackageCheck, iconBg: "bg-teal/10", iconColor: "text-teal" },
  { title: "In Transit", value: "187", change: "+15.3%", note: "vs last 30 days", positive: true, sub: "12.2%", icon: Navigation, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Exception", value: "62", change: "-18.2%", note: "vs last 30 days", positive: false, sub: "4.0%", icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Cancelled", value: "38", change: "-8.6%", note: "vs last 30 days", positive: false, sub: "2.5%", icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

const tabs = ["All Shipments", "Shipped", "In Transit", "Exception", "Delivered", "Cancelled"];

const rows = [
  { so: "SO-102876", shp: "SHP-009870", recipient: "Acme Retail Co.", city: "ATL", wh: "ATL-1", carrier: "UPS", service: "Ground", status: "Shipped", ship: "May 20, 2025", eta: "May 23, 2025" },
  { so: "SO-102874", shp: "SHP-009869", recipient: "ShopZone Inc.", city: "LAX", wh: "LAX-1", carrier: "FedEx", service: "Express", status: "In Transit", ship: "May 20, 2025", eta: "May 22, 2025" },
  { so: "SO-102872", shp: "SHP-009868", recipient: "Roadrunner LLC", city: "ORD", wh: "ORD-1", carrier: "XPO", service: "Priority", status: "Exception", ship: "May 19, 2025", eta: "May 22, 2025" },
  { so: "SO-102870", shp: "SHP-009867", recipient: "NorthStar Supplies", city: "ORD", wh: "ORD-1", carrier: "XPO", service: "Ground", status: "Delayed", ship: "May 18, 2025", eta: "May 21, 2025" },
  { so: "SO-102868", shp: "SHP-009866", recipient: "GreenLife Market", city: "DFW", wh: "DFW-1", carrier: "USPS", service: "2nd Day Air", status: "Shipped", ship: "May 18, 2025", eta: "May 21, 2025" },
  { so: "SO-102866", shp: "SHP-009865", recipient: "Bright Home Goods", city: "ATL", wh: "ATL-1", carrier: "UPS", service: "Ground", status: "Shipped", ship: "May 17, 2025", eta: "May 20, 2025" },
  { so: "SO-102864", shp: "SHP-009864", recipient: "Coastal Traders", city: "LAX", wh: "LAX-1", carrier: "FedEx", service: "Express", status: "In Transit", ship: "May 17, 2025", eta: "May 19, 2025" },
  { so: "SO-102862", shp: "SHP-009863", recipient: "Summit Wholesale", city: "DFW", wh: "DFW-1", carrier: "USPS", service: "Ground", status: "Delivered", ship: "May 16, 2025", eta: "May 19, 2025" },
  { so: "SO-102860", shp: "SHP-009862", recipient: "Vista Distributors", city: "ORD", wh: "ORD-1", carrier: "XPO", service: "Priority", status: "Shipped", ship: "May 16, 2025", eta: "May 18, 2025" },
  { so: "SO-102858", shp: "SHP-009861", recipient: "Harbor Supply Co.", city: "ATL", wh: "ATL-1", carrier: "UPS", service: "2nd Day Air", status: "In Transit", ship: "May 15, 2025", eta: "May 18, 2025" },
  { so: "SO-102856", shp: "SHP-009860", recipient: "Pioneer Goods", city: "LAX", wh: "LAX-1", carrier: "FedEx", service: "Ground", status: "Exception", ship: "May 15, 2025", eta: "May 17, 2025" },
  { so: "SO-102854", shp: "SHP-009859", recipient: "Crestview Retail", city: "DFW", wh: "DFW-1", carrier: "USPS", service: "Express", status: "Delivered", ship: "May 14, 2025", eta: "May 17, 2025" },
];

const carriers = [
  { name: "UPS", ship: "535 shipments", rate: "98.1%", change: "+1.8%", up: true },
  { name: "FedEx", ship: "428 shipments", rate: "97.2%", change: "+2.6%", up: true },
  { name: "USPS", ship: "312 shipments", rate: "95.4%", change: "-0.9%", up: false },
  { name: "XPO", ship: "257 shipments", rate: "96.6%", change: "+1.3%", up: true },
];

const activity = [
  { icon: PackageCheck, type: "Shipment delivered", info: "SHP-009859 - Crestview Retail", time: "1h ago", color: "var(--color-teal)" },
  { icon: AlertTriangle, type: "Delivery delayed", info: "SO-102873 - NorthStar Supplies", time: "3h ago", color: "#EF4444" },
  { icon: Navigation, type: "Out for delivery", info: "SHP-009864 - Coastal Traders", time: "5h ago", color: "var(--color-action-blue)" },
  { icon: Truck, type: "Shipment dispatched", info: "SHP-009870 - Acme Retail Co.", time: "8h ago", color: "#7C6FF6" },
];

function Badge({ text }: { text: string }) {
  const styles: Record<string, string> = {
    Shipped: "bg-teal/10 text-teal",
    "In Transit": "bg-action-blue/10 text-action-blue",
    Exception: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Delayed: "bg-[#EF4444]/10 text-[#EF4444]",
    Delivered: "bg-teal/10 text-teal",
    Cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
  };
  return <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[text] || "bg-soft-bg text-text-muted"}`}>{text}</span>;
}

const card = "bg-white rounded-xl border border-border-soft shadow-soft";
const thCls = "text-left text-[11px] font-semibold text-text-light uppercase tracking-[0.05em] px-6 py-3";

export default function OutboundShipmentsPage() {
  const [activeTab, setActiveTab] = useState("All Shipments");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Outbound Shipments</h1>
          <p className="text-[14px] text-text-muted mt-1">Manage and track all outbound shipments across your warehouses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Filter className="w-4 h-4" /> Filters</button>
          <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg"><Columns3 className="w-4 h-4" /> Columns</button>
          <button className="flex items-center gap-2 text-[13px] font-medium text-white bg-action-blue rounded-lg px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#004BBF]"><Plus className="w-4 h-4" /> New Shipment</button>
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
        {/* Main table + CTA */}
        <div className="space-y-5">
          <div className={card + " overflow-hidden"}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-text-light absolute left-3 top-1/2 -translate-y-1/2" />
                <input placeholder="Search by order #, tracking #, recipient..." className="w-full text-[13px] text-text-primary placeholder:text-text-light bg-white border border-border-soft rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
              </div>
              <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Warehouses <ChevronDown className="w-3.5 h-3.5" /></button>
              <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Carrier <ChevronDown className="w-3.5 h-3.5" /></button>
              <button className="flex items-center gap-2 text-[13px] font-medium text-text-muted bg-white border border-border-soft rounded-lg px-3.5 py-2 hover:bg-soft-bg">All Statuses <ChevronDown className="w-3.5 h-3.5" /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-soft-bg border-b border-border-soft">
                  <th className={thCls}>Order / Shipment #</th><th className={thCls}>Recipient</th><th className={thCls}>Warehouse</th>
                  <th className={thCls}>Carrier</th><th className={thCls}>Status</th><th className={thCls}>Ship Date</th><th className={thCls}>Est. Delivery</th>
                  <th className={thCls + " text-right"}>Actions</th>
                </tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.shp} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-soft-bg flex items-center justify-center shrink-0"><Truck className="w-4 h-4 text-text-light" /></div>
                          <div><p className="text-[13px] font-medium text-action-blue leading-tight font-mono">{r.so}</p><p className="text-[11px] text-text-light leading-tight mt-0.5 font-mono">{r.shp}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.recipient}</p><p className="text-[11px] text-text-light mt-0.5">{r.city}</p></td>
                      <td className="px-6 py-4 text-[13px] text-text-muted">{r.wh}</td>
                      <td className="px-6 py-4"><p className="text-[13px] text-text-primary">{r.carrier}</p><p className="text-[11px] text-text-light mt-0.5">{r.service}</p></td>
                      <td className="px-6 py-4"><Badge text={r.status} /></td>
                      <td className="px-6 py-4 text-[13px] text-text-muted whitespace-nowrap">{r.ship}</td>
                      <td className="px-6 py-4 text-[13px] text-text-muted whitespace-nowrap">{r.eta}</td>
                      <td className="px-6 py-4 text-right"><button className="text-text-light hover:text-text-muted p-1"><MoreHorizontal className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-border-soft">
              <span className="text-[13px] text-text-muted">Showing 1-12 of 1,532 shipments</span>
              <div className="flex items-center gap-1">
                {["1", "2", "3", "...", "307"].map((p, i) => (
                  <button key={i} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${p === "1" ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-soft-bg"}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA banner */}
          <div className="rounded-xl bg-action-blue px-6 py-5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0"><Truck className="w-5 h-5 text-white" /></div>
              <div>
                <p className="text-[16px] font-semibold text-white">Need to create a shipment?</p>
                <p className="text-[13px] text-white/80 mt-0.5">Generate labels, assign carriers, and dispatch orders in a few clicks.</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-[13px] font-medium text-action-blue bg-white rounded-lg px-4 py-2.5 hover:bg-white/90 shrink-0"><Plus className="w-4 h-4" /> Create Outbound Shipment</button>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Shipment Status donut */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Shipment Status</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                  {(() => { let off = 0; const segs = [["var(--color-teal)", 81.2], ["var(--color-action-blue)", 12.2], ["#F59E0B", 4.0], ["#EF4444", 2.5]] as [string, number][]; return segs.map(([c, p], i) => {
                    const da = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                    const el = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                    off += p; return el;
                  }); })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-[17px] font-bold text-text-primary leading-none">1,532</p><p className="text-[10px] text-text-light mt-0.5">Total</p></div></div>
              </div>
              <div className="flex-1 space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="flex items-center gap-2 text-text-muted"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-teal)" }} />Shipped</span><span className="font-medium text-text-primary">1,245 (81.2%)</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-2 text-text-muted"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-action-blue)" }} />In Transit</span><span className="font-medium text-text-primary">187 (12.2%)</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-2 text-text-muted"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#F59E0B" }} />Exception</span><span className="font-medium text-text-primary">62 (4.0%)</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-2 text-text-muted"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#EF4444" }} />Cancelled</span><span className="font-medium text-text-primary">38 (2.5%)</span></div>
              </div>
            </div>
          </div>

          {/* Carrier Performance */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Carrier Performance</h3><button className="text-[12px] text-action-blue hover:underline">View report</button></div>
            <div className="space-y-3">
              {carriers.map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-soft-bg flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-text-muted">{c.name}</span></div>
                  <div className="flex-1"><p className="text-[12px] font-medium text-text-primary">{c.name}</p><p className="text-[11px] text-text-light">{c.ship}</p></div>
                  <div className="text-right"><p className="text-[13px] font-semibold text-text-primary">{c.rate}</p><p className={`text-[11px] font-medium ${c.up ? "text-teal" : "text-[#EF4444]"}`}>{c.change}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-semibold text-text-primary">Recent Activity</h3><button className="text-[12px] text-action-blue hover:underline">View all</button></div>
            <div className="space-y-3">
              {activity.map((e, i) => {
                const Icon = e.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: e.color + "1a" }}><Icon className="w-3.5 h-3.5" style={{ color: e.color }} /></div>
                    <div className="flex-1 min-w-0"><p className="text-[12px] text-text-primary">{e.type}</p><p className="text-[11px] text-text-light">{e.info}</p></div>
                    <span className="text-[11px] text-text-light shrink-0">{e.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
