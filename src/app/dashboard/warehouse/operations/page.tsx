"use client";

import { useState } from "react";
import {
  Package, PieChart, ArrowDownToLine, ShoppingCart, RotateCcw,
  ArrowUpRight, MapPin, ChevronDown,
} from "lucide-react";
import { useToast } from "@/components/dashboard/Toast";

const stats = [
  { title: "Total Inventory", value: "152,842", sub: "SKUs", change: "+8.6%", note: "vs last 7 days", positive: true, icon: Package, iconBg: "bg-action-blue/10", iconColor: "text-action-blue" },
  { title: "Storage Utilization", value: "72%", sub: "Capacity Used", bar: 72, icon: PieChart, iconBg: "bg-teal/10", iconColor: "text-teal" },
  { title: "Open Inbound", value: "24", sub: "Shipments", link: "View details", icon: ArrowDownToLine, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Open Orders", value: "1,386", sub: "Orders", link: "View details", icon: ShoppingCart, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Pending Returns", value: "98", sub: "Returns", link: "View details", icon: RotateCcw, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

const byWarehouse = [
  { wh: "WH1 - Los Angeles, CA", loc: "CA, USA", inv: "48,231", util: "78%", status: "Good" },
  { wh: "WH2 - Dallas, TX", loc: "Dallas, USA", inv: "37,005", util: "65%", status: "Good" },
  { wh: "WH3 - New Jersey, NJ", loc: "NJ, USA", inv: "42,318", util: "74%", status: "Good" },
  { wh: "WH4 - Chicago, IL", loc: "Chicago, USA", inv: "25,588", util: "61%", status: "Good" },
];

const topSkus = [
  { name: "Wireless Headphones", sku: "SKU: WH-100", qty: "6,421" },
  { name: "Smart Watch", sku: "SKU: WB-200", qty: "6,782" },
  { name: "Water Bottle", sku: "SKU: WB-300", qty: "5,193" },
  { name: "Yoga Mat", sku: "SKU: YM-400", qty: "4,905" },
];

const inbound = [
  { id: "INB-20976", date: "May 12, 2025", carrier: "FedEx", status: "Receiving" },
  { id: "INB-20980", date: "May 11, 2025", carrier: "UPS", status: "In Transit" },
  { id: "INB-20979", date: "May 10, 2025", carrier: "DHL", status: "Received" },
  { id: "INB-20977", date: "May 10, 2025", carrier: "FedEx", status: "Received" },
];

const activity = [
  { text: "Inbound shipment INB-20981 is being received at WH1 - Los Angeles.", color: "var(--color-action-blue)" },
  { text: "Order ORD-104583 has been picked and packed.", color: "#F59E0B" },
  { text: "Inventory for SKU WH-100 has been updated (+250 units).", color: "var(--color-teal)" },
  { text: "Return RET-98432 received at WH2 - Dallas.", color: "#EF4444" },
  { text: "Cycle count completed at WH3 - New Jersey.", color: "#7C6FF6" },
];

const mapPins = [
  { label: "WH1", pct: "78%", x: "14%", y: "62%", color: "var(--color-teal)" },
  { label: "WH2", pct: "65%", x: "44%", y: "70%", color: "var(--color-teal)" },
  { label: "WH3", pct: "74%", x: "82%", y: "40%", color: "var(--color-teal)" },
  { label: "WH4", pct: "61%", x: "60%", y: "38%", color: "var(--color-teal)" },
];

function Badge({ text }: { text: string }) {
  const styles: Record<string, string> = {
    Good: "bg-teal/10 text-teal",
    Receiving: "bg-teal/10 text-teal",
    "In Transit": "bg-action-blue/10 text-action-blue",
    Received: "bg-teal/10 text-teal",
  };
  return <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[text] || "bg-soft-bg text-text-muted"}`}>{text}</span>;
}

const card = "bg-white rounded-xl border border-border-soft shadow-soft";
const thCls = "text-left text-[11px] font-semibold text-text-light uppercase tracking-[0.05em] px-5 py-3";

const WAREHOUSE_OPTIONS = ["All Warehouses", "WH1 - Los Angeles", "WH2 - Dallas", "WH3 - New Jersey", "WH4 - Chicago"];

export default function WarehouseOperationsPage() {
  const { toast } = useToast();
  const [whScope, setWhScope] = useState("All Warehouses");
  const [whOpen, setWhOpen] = useState(false);
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl p-6 border border-border-soft" style={{ background: "linear-gradient(90deg, #EEF2FF 0%, #F8FAFF 55%, #F5F9FF 100%)" }}>
        <div className="relative z-10">
          <h1 className="text-[24px] font-bold text-text-primary">Warehouse Operations</h1>
          <p className="text-[14px] text-text-muted mt-1 max-w-md">Real-time visibility into your storage, inventory, and warehouse performance.</p>
        </div>
        {/* Isometric warehouse illustration */}
        <svg className="absolute top-0 right-0 bottom-0 my-auto h-[130px] w-[400px] hidden md:block" viewBox="0 0 340 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* ground */}
          <ellipse cx="200" cy="138" rx="150" ry="12" fill="#DBEAFE" opacity="0.6" />
          {/* trees */}
          <g>
            <rect x="312" y="92" width="4" height="14" fill="#A16207" />
            <circle cx="314" cy="86" r="14" fill="#34D399" />
            <circle cx="306" cy="92" r="10" fill="#10B981" />
          </g>
          {/* warehouse building */}
          <path d="M150 40 L235 40 L235 120 L150 120 Z" fill="#3B82F6" />
          <path d="M150 40 L192 22 L277 22 L235 40 Z" fill="#60A5FA" />
          <path d="M235 40 L277 22 L277 102 L235 120 Z" fill="#2563EB" />
          {/* roof stripes */}
          <path d="M160 47 L227 47 L227 53 L160 53 Z" fill="#1E3A8A" opacity="0.25" />
          {/* big door */}
          <rect x="170" y="68" width="46" height="52" fill="#1E293B" opacity="0.85" />
          <rect x="174" y="72" width="38" height="6" fill="#3B82F6" opacity="0.5" />
          {/* boxes */}
          <rect x="118" y="100" width="22" height="20" fill="#F59E0B" />
          <rect x="118" y="100" width="22" height="6" fill="#FBBF24" />
          <rect x="96" y="108" width="20" height="12" fill="#FCD34D" />
          {/* truck */}
          <g>
            <rect x="34" y="92" width="40" height="22" rx="2" fill="#E0E7FF" />
            <rect x="74" y="98" width="20" height="16" rx="2" fill="#3B82F6" />
            <rect x="78" y="101" width="10" height="7" fill="#BFDBFE" />
            <circle cx="48" cy="118" r="5" fill="#1E293B" />
            <circle cx="84" cy="118" r="5" fill="#1E293B" />
          </g>
          {/* forklift */}
          <g>
            <rect x="250" y="100" width="20" height="14" rx="2" fill="#F59E0B" />
            <rect x="268" y="86" width="3" height="28" fill="#92400E" />
            <rect x="271" y="108" width="12" height="3" fill="#92400E" />
            <circle cx="256" cy="116" r="4" fill="#1E293B" />
            <circle cx="266" cy="116" r="4" fill="#1E293B" />
          </g>
          {/* clouds */}
          <circle cx="120" cy="30" r="9" fill="#fff" opacity="0.9" />
          <circle cx="132" cy="30" r="11" fill="#fff" opacity="0.9" />
          <circle cx="280" cy="44" r="7" fill="#fff" opacity="0.8" />
          <circle cx="289" cy="44" r="9" fill="#fff" opacity="0.8" />
        </svg>
      </div>

      {/* Stats Cards - 5 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className={card + " p-5"}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-text-muted">{s.title}</span>
                <div className={`w-10 h-10 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[24px] font-bold text-text-primary leading-tight">
                {s.value} <span className="text-[12px] font-normal text-text-light">{s.sub}</span>
              </p>
              {s.change && (
                <div className="flex items-center gap-1.5 mt-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-teal" />
                  <span className="text-[12px] font-semibold text-teal">{s.change}</span>
                  <span className="text-[11px] text-text-light">{s.note}</span>
                </div>
              )}
              {s.bar !== undefined && (
                <div className="w-full bg-border-blue rounded-full h-2 mt-3">
                  <div className="h-2 rounded-full bg-teal" style={{ width: `${s.bar}%` }} />
                </div>
              )}
              {s.link && (
                <button onClick={() => toast(`Opening ${s.title.toLowerCase()} details`, "info")} className="text-[12px] text-action-blue hover:underline mt-2 font-medium">{s.link}</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Row: Inventory by Warehouse + Storage Utilization Trend */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.1fr 1fr" }}>
        {/* Inventory by Warehouse Table */}
        <div className={card + " overflow-hidden"}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft">
            <h3 className="text-[14px] font-semibold text-text-primary">Inventory by Warehouse</h3>
            <div className="relative">
              <button onClick={() => setWhOpen((v) => !v)} className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted bg-soft-bg px-2.5 py-1 rounded-md hover:bg-border-blue">{whScope} <ChevronDown className="w-3 h-3" /></button>
              {whOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setWhOpen(false)} />
                  <div className="absolute right-0 mt-1 z-20 w-48 bg-white rounded-lg border border-border-soft shadow-lg py-1">
                    {WAREHOUSE_OPTIONS.map((o) => (
                      <button key={o} onClick={() => { setWhScope(o); setWhOpen(false); toast(`Scoped to ${o}`, "info"); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${whScope === o ? "text-action-blue font-medium" : "text-text-primary"}`}>{o}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-soft-bg border-b border-border-soft">
                  <th className={thCls}>Warehouse</th>
                  <th className={thCls}>Location</th>
                  <th className={thCls}>Inventory</th>
                  <th className={thCls}>Utilization</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody>
                {byWarehouse.map((w) => (
                  <tr key={w.wh} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-5 py-3.5 text-[13px] font-medium text-text-primary">{w.wh}</td>
                    <td className="px-5 py-3.5 text-[13px] text-text-muted">{w.loc}</td>
                    <td className="px-5 py-3.5 text-[13px] text-text-primary font-medium">{w.inv}</td>
                    <td className="px-5 py-3.5 text-[13px] text-text-primary">{w.util}</td>
                    <td className="px-5 py-3.5"><Badge text={w.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3.5 border-t border-border-soft text-center">
            <button onClick={() => toast("Showing all warehouses", "info")} className="text-[12px] font-medium text-action-blue border border-border-soft rounded-lg px-3 py-1.5 hover:bg-soft-bg transition-colors">View all warehouses</button>
          </div>
        </div>

        {/* Storage Utilization Trend Chart */}
        <div className={card + " p-5"}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">Storage Utilization Trend</h3>
            <span className="text-[11px] font-medium text-text-muted bg-soft-bg px-2.5 py-1 rounded-md">Last 7 Days</span>
          </div>
          <div className="h-[200px]">
            <svg viewBox="0 0 420 200" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="40" y1={i * 35 + 10} x2="415" y2={i * 35 + 10} stroke="var(--color-border-blue)" strokeWidth="1" />
              ))}
              {/* Y-axis labels */}
              {["100%", "75%", "50%", "25%", "0%"].map((l, i) => (
                <text key={i} x="35" y={i * 35 + 14} textAnchor="end" fontSize="9" fill="var(--color-text-light)">{l}</text>
              ))}
              {/* Area fill gradient */}
              <defs>
                <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-action-blue)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="var(--color-action-blue)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M40,120 L102,95 L164,100 L226,75 L288,80 L350,55 L412,45 L412,150 L40,150 Z" fill="url(#utilGrad)" />
              {/* Line */}
              <polyline fill="none" stroke="var(--color-action-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points="40,120 102,95 164,100 226,75 288,80 350,55 412,45" />
              {/* Data points */}
              {[[40,120],[102,95],[164,100],[226,75],[288,80],[350,55],[412,45]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="white" stroke="var(--color-action-blue)" strokeWidth="2.5" />
              ))}
              {/* X-axis labels */}
              {["May 6","May 7","May 8","May 9","May 10","May 11","May 12"].map((l,i) => (
                <text key={i} x={40+i*62} y="172" textAnchor="middle" fontSize="9" fill="var(--color-text-light)">{l}</text>
              ))}
              {/* Percentage badge */}
              <rect x="385" y="30" width="34" height="16" rx="4" fill="var(--color-action-blue)" />
              <text x="402" y="41" textAnchor="middle" fontSize="9" fill="white" fontWeight="600">72%</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Row: Inventory Status donut + Health gauge + Top SKU + Recent Inbound */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
        {/* Inventory Status Donut */}
        <div className={card + " p-5"}>
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Inventory Status</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-[130px] h-[130px]">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-blue)" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-teal)" strokeWidth="12" strokeDasharray={`${71*2.51327} ${251.327-71*2.51327}`} strokeDashoffset="0" strokeLinecap="round" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray={`${18*2.51327} ${251.327-18*2.51327}`} strokeDashoffset={`${-71*2.51327}`} strokeLinecap="round" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray={`${11*2.51327} ${251.327-11*2.51327}`} strokeDashoffset={`${-89*2.51327}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[20px] font-bold text-text-primary">152K</p>
                  <p className="text-[10px] text-text-light">Total</p>
                </div>
              </div>
            </div>
            <div className="w-full space-y-2 mt-4">
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal shrink-0" />
                  <span className="text-text-muted">In Stock</span>
                </div>
                <span className="font-medium text-text-primary">108,478 (71%)</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
                  <span className="text-text-muted">Low Stock</span>
                </div>
                <span className="font-medium text-text-primary">26,942 (18%)</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0" />
                  <span className="text-text-muted">Out of Stock</span>
                </div>
                <span className="font-medium text-text-primary">11,470 (11%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Health Gauge */}
        <div className={card + " p-5"}>
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Inventory Health</h3>
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-[160px] h-[80px]">
              <svg viewBox="0 0 120 70" className="w-full h-full">
                <path d="M10,65 A50,50 0 0,1 110,65" fill="none" stroke="var(--color-border-blue)" strokeWidth="10" strokeLinecap="round" />
                <path d="M10,65 A50,50 0 0,1 95,30" fill="none" stroke="var(--color-teal)" strokeWidth="10" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[32px] font-bold text-text-primary -mt-2">86</p>
            <p className="text-[13px] text-text-muted mt-0.5">Score (Great)</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5 text-teal" />
              <span className="text-[12px] font-medium text-teal">12 points vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Top SKU by Inventory */}
        <div className={card + " p-5"}>
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Top SKU by Inventory</h3>
          <div className="space-y-3">
            {topSkus.map((s) => (
              <div key={s.sku} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-soft-bg flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-text-light" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary truncate">{s.name}</p>
                  <p className="text-[11px] text-text-light">{s.sku}</p>
                </div>
                <span className="text-[13px] font-semibold text-text-primary shrink-0">{s.qty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inbound Shipments */}
        <div className={card + " p-5"}>
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Recent Inbound Shipments</h3>
          <div className="space-y-3">
            {inbound.map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-[13px] font-medium text-text-primary font-mono">{s.id}</p>
                  <p className="text-[11px] text-text-light">{s.carrier} - {s.date}</p>
                </div>
                <Badge text={s.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Warehouse Activity + Map */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Warehouse Activity */}
        <div className={card + " p-5"}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">Warehouse Activity</h3>
            <button onClick={() => toast("Showing full activity log", "info")} className="text-[12px] font-medium text-action-blue hover:underline">View full activity</button>
          </div>
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: a.color }} />
                <span className="text-[12px] text-text-primary flex-1 leading-relaxed">{a.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Map */}
        <div className={card + " p-5"}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">Warehouse Map</h3>
            <button onClick={() => toast("Opening warehouse map", "info")} className="text-[12px] font-medium text-action-blue hover:underline">View all</button>
          </div>
          <div className="relative bg-soft-bg rounded-lg h-[200px] border border-border-soft overflow-hidden">
            <svg viewBox="0 0 200 110" className="w-full h-full opacity-40" preserveAspectRatio="xMidYMid meet">
              <path d="M16,34 L44,30 L70,28 L96,29 L120,27 L150,26 L168,30 L176,34 L182,40 L180,46 L184,52 L182,60 L176,66 L170,74 L162,80 L150,84 L138,82 L130,86 L120,84 L110,88 L100,86 L88,90 L78,86 L70,82 L60,84 L52,80 L44,74 L36,70 L30,62 L24,54 L20,46 Z" fill="var(--color-border-blue)" />
            </svg>
            {mapPins.map((p) => (
              <div key={p.label} className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center" style={{ left: p.x, top: p.y }}>
                <div className="bg-white rounded px-1.5 py-0.5 text-[9px] font-medium text-text-primary shadow-sm border border-border-soft whitespace-nowrap mb-0.5">{p.label} {p.pct}</div>
                <MapPin className="w-4 h-4" style={{ color: p.color }} fill={p.color} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-text-muted">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal" />Good (60%+)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />Moderate (40-60%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-action-blue" />High (80%+)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />Critical (90%+)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
