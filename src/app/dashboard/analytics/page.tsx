"use client";

import { useState } from "react";
import {
  ShoppingBag, DollarSign, CheckCircle2, Package,
  ArrowUpRight, ArrowDownRight, ChevronDown,
  MoreVertical, Download, RefreshCw,
} from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";

const GRANULARITIES = ["Daily", "Weekly", "Monthly"];

const stats = [
  { title: "Total Orders", value: "12,842", change: "+8.5%", positive: true, period: "vs May 5", icon: ShoppingBag, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { title: "Total Revenue", value: "$1.62M", change: "+10.3%", positive: true, period: "vs May 5", icon: DollarSign, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { title: "On-Time Delivery", value: "97.4%", change: "+1.2%", positive: true, period: "vs May 5", icon: CheckCircle2, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { title: "Total Shipments", value: "11,205", change: "+7.2%", positive: true, period: "vs May 5", icon: Package, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
];

const topProducts = [
  { name: "MeshFlex Backpack", sku: "BAG-001", orders: "1,245", revenue: "$86,750", trend: "+12.4%", up: true },
  { name: "Urban Explorer Jacket", sku: "JKT-208", orders: "987", revenue: "$148,050", trend: "+8.1%", up: true },
  { name: "Trail Runner Shoes", sku: "SHO-114", orders: "876", revenue: "$131,400", trend: "+5.2%", up: true },
  { name: "Packable Tote", sku: "BAG-009", orders: "754", revenue: "$98,020", trend: "-2.1%", up: false },
  { name: "Thermo Bottle 750ml", sku: "ACC-045", orders: "645", revenue: "$64,500", trend: "+3.8%", up: true },
];

const regions = [
  { name: "North America", pct: 40.7, color: "#3B82F6" },
  { name: "Europe", pct: 24.3, color: "#60A5FA" },
  { name: "Asia Pacific", pct: 18.9, color: "#06B6A4" },
  { name: "Middle East & Africa", pct: 12.7, color: "#8B5CF6" },
  { name: "Other", pct: 3.4, color: "#EC4899" },
];

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState("May 12 – May 18, 2025");
  const [ordersGran, setOrdersGran] = useState("Daily");
  const [revGran, setRevGran] = useState("Daily");
  const [menuOpen, setMenuOpen] = useState(false);

  function cycle(current: string, set: (v: string) => void, label: string) {
    const next = GRANULARITIES[(GRANULARITIES.indexOf(current) + 1) % GRANULARITIES.length];
    set(next);
    toast(`${label} grouped by ${next.toLowerCase()}`, "info");
  }

  function exportProducts() {
    exportToCsv("analytics-top-products", topProducts, [
      { key: "name", header: "Product" },
      { key: "sku", header: "SKU" },
      { key: "orders", header: "Orders" },
      { key: "revenue", header: "Revenue" },
      { key: "trend", header: "Trend" },
    ]);
    toast(`Exported ${topProducts.length} products to CSV`);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[#1E293B]">Analytics</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">Track performance and key metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeMenu
            value={range}
            onSelect={(r) => { setRange(r); toast(`Showing analytics for ${r}`, "info"); }}
            presets={["May 12 – May 18, 2025", "Last 7 days", "Last 30 days", "This quarter", "Year to date"]}
          />
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 z-40 w-48 bg-white rounded-lg border border-[#E2E8F0] shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-1">
                  <button
                    onClick={() => { setMenuOpen(false); exportProducts(); }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]"
                  >
                    <Download className="w-4 h-4 text-[#64748B]" /> Export data
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); toast("Analytics refreshed", "success"); }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]"
                  >
                    <RefreshCw className="w-4 h-4 text-[#64748B]" /> Refresh
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[13px] font-medium text-[#64748B]">{stat.title}</span>
                <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] leading-none font-bold text-[#1E293B]">{stat.value}</p>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[12px] font-semibold ${
                    stat.positive ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  {stat.positive
                    ? <ArrowUpRight className="w-3 h-3" />
                    : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
                <span className="text-[12px] text-[#94A3B8]">{stat.period}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Line Chart - Orders Over Time */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Orders Over Time</h3>
            <button onClick={() => cycle(ordersGran, setOrdersGran, "Orders over time")} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:bg-[#F8FAFC]">
              {ordersGran} <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>
          <div className="h-[200px]">
            <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="40" y1={i * 40 + 10} x2="490" y2={i * 40 + 10} stroke="#F1F5F9" strokeWidth="1" />
              ))}
              {/* Y-axis labels */}
              <text x="35" y="18" textAnchor="end" fontSize="9" fill="#94A3B8">8K</text>
              <text x="35" y="58" textAnchor="end" fontSize="9" fill="#94A3B8">6K</text>
              <text x="35" y="98" textAnchor="end" fontSize="9" fill="#94A3B8">4K</text>
              <text x="35" y="138" textAnchor="end" fontSize="9" fill="#94A3B8">2K</text>
              <text x="35" y="178" textAnchor="end" fontSize="9" fill="#94A3B8">0</text>
              {/* Smooth area fill */}
              <path
                d="M50,130 C84,120 96,105 130,108 C164,111 156,85 190,90 C224,95 226,72 260,75 C294,78 296,55 330,55 C364,55 376,65 410,58 C444,51 456,40 490,38 L490,180 L50,180 Z"
                fill="url(#ordersGrad)"
              />
              {/* Smooth line */}
              <path
                d="M50,130 C84,120 96,105 130,108 C164,111 156,85 190,90 C224,95 226,72 260,75 C294,78 296,55 330,55 C364,55 376,65 410,58 C444,51 456,40 490,38"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Endpoint marker */}
              <circle cx="490" cy="38" r="3.5" fill="white" stroke="#3B82F6" strokeWidth="2.5" />
              {/* X-axis labels */}
              {["May 13", "May 14", "May 15", "May 16", "May 17", "May 18"].map((label, i) => (
                <text key={i} x={50 + i * 88} y="196" textAnchor="middle" fontSize="9" fill="#94A3B8">{label}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Line Chart - Revenue Over Time */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Revenue Over Time</h3>
            <button onClick={() => cycle(revGran, setRevGran, "Revenue over time")} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:bg-[#F8FAFC]">
              {revGran} <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>
          <div className="h-[200px]">
            <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6A4" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#06B6A4" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="40" y1={i * 40 + 10} x2="490" y2={i * 40 + 10} stroke="#F1F5F9" strokeWidth="1" />
              ))}
              {/* Y-axis labels */}
              <text x="35" y="18" textAnchor="end" fontSize="9" fill="#94A3B8">$1M</text>
              <text x="35" y="58" textAnchor="end" fontSize="9" fill="#94A3B8">$750K</text>
              <text x="35" y="98" textAnchor="end" fontSize="9" fill="#94A3B8">$500K</text>
              <text x="35" y="138" textAnchor="end" fontSize="9" fill="#94A3B8">$250K</text>
              <text x="35" y="178" textAnchor="end" fontSize="9" fill="#94A3B8">$0</text>
              {/* Smooth area fill */}
              <path
                d="M50,90 C84,110 96,130 130,120 C164,110 156,70 190,80 C224,90 226,100 260,95 C294,90 296,55 330,60 C364,65 376,85 410,75 C444,65 456,50 490,55 L490,180 L50,180 Z"
                fill="url(#revGrad)"
              />
              {/* Smooth line */}
              <path
                d="M50,90 C84,110 96,130 130,120 C164,110 156,70 190,80 C224,90 226,100 260,95 C294,90 296,55 330,60 C364,65 376,85 410,75 C444,65 456,50 490,55"
                fill="none"
                stroke="#06B6A4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Endpoint marker */}
              <circle cx="490" cy="55" r="3.5" fill="white" stroke="#06B6A4" strokeWidth="2.5" />
              {/* X-axis labels */}
              {["May 13", "May 14", "May 15", "May 16", "May 17", "May 18"].map((label, i) => (
                <text key={i} x={50 + i * 88} y="196" textAnchor="middle" fontSize="9" fill="#94A3B8">{label}</text>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Products + Orders by Region */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        {/* Top Products Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Top Products</h3>
            <button onClick={exportProducts} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] border border-[#E2E8F0] rounded-lg px-3 py-1.5 hover:bg-[#F8FAFC] transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Product</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Orders</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Revenue</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.sku} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-4 h-4 text-[#94A3B8]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#1E293B]">{p.name}</p>
                          <p className="text-[11px] text-[#94A3B8]">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B] text-right">{p.orders}</td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B] text-right">{p.revenue}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center gap-0.5 text-[12px] font-semibold ${p.up ? "text-[#065F46]" : "text-[#991B1B]"}`}>
                        {p.up
                          ? <ArrowUpRight className="w-3 h-3" />
                          : <ArrowDownRight className="w-3 h-3" />}
                        {p.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders by Region Donut */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Orders by Region</h3>
          <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="relative w-[160px] h-[160px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {regions.map((r, i) => {
                  const offset = regions.slice(0, i).reduce((s, x) => s + x.pct, 0);
                  const dashArray = `${r.pct * 2.51327} ${251.327 - r.pct * 2.51327}`;
                  return (
                    <circle key={i} cx="50" cy="50" r="40" fill="none"
                      stroke={r.color} strokeWidth="12" strokeDasharray={dashArray} strokeDashoffset={-offset * 2.51327}
                      strokeLinecap="round" />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#1E293B]">12,842</p>
                  <p className="text-[10px] text-[#64748B]">Orders</p>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2.5">
              {regions.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="text-[#475569] truncate">{r.name}</span>
                  </div>
                  <span className="font-medium text-[#1E293B] shrink-0 ml-2">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
