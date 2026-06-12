"use client";

import { useState } from "react";
import {
  Package, Tag, DollarSign, AlertTriangle,
  Search, Filter, Download, ChevronDown, MoreHorizontal, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const stats = [
  { title: "Total Units", value: "1,248,924", sub: "Units", change: "+12.5%", note: "vs last 30 days", positive: true, icon: Package, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { title: "SKUs", value: "8,742", sub: "Active", change: "+4.3%", note: "vs last 30 days", positive: true, icon: Tag, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { title: "Total Value", value: "$24,682,330", sub: "USD", change: "+8.7%", note: "vs last 30 days", positive: true, icon: DollarSign, iconBg: "bg-[#8B5CF6]/10", iconColor: "text-[#8B5CF6]" },
  { title: "Low Stock Items", value: "134", sub: "SKUs", change: "-16.4%", note: "vs last 30 days", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
];

const tabs = ["All Inventory", "Low Stock", "Out of Stock", "Expiring Soon"];

const rows = [
  { product: "Wireless Headphones", category: "Electronics", sku: "ELEC-1001", wh: "ATL-1", onHand: "2,450", reserved: "320", available: "2,130", status: "In Stock" },
  { product: "Stainless Steel Bottle", category: "Home & Kitchen", sku: "HK-2002", wh: "LAX-1", onHand: "5,120", reserved: "200", available: "4,920", status: "In Stock" },
  { product: "Cotton T-Shirt", category: "Apparel", sku: "APP-3003-M", wh: "ORD-1", onHand: "1,250", reserved: "640", available: "610", status: "In Stock" },
  { product: "Running Shoes", category: "Sports", sku: "FTW-4004-9", wh: "DFW-1", onHand: "320", reserved: "85", available: "235", status: "Low Stock" },
  { product: "Whey Protein 1kg", category: "Health & Beauty", sku: "HB-5005", wh: "MIA-1", onHand: "0", reserved: "0", available: "0", status: "Out of Stock" },
  { product: "Travel Backpack", category: "Bags & Luggage", sku: "BAG-6006", wh: "ATL-1", onHand: "880", reserved: "120", available: "760", status: "In Stock" },
  { product: "Bluetooth Speaker", category: "Electronics", sku: "ELEC-1007", wh: "LAX-1", onHand: "1,640", reserved: "210", available: "1,430", status: "In Stock" },
  { product: "Yoga Mat Premium", category: "Sports", sku: "SPT-4008", wh: "ORD-1", onHand: "410", reserved: "60", available: "350", status: "Low Stock" },
  { product: "Ceramic Dinner Set", category: "Home & Kitchen", sku: "HK-2009", wh: "DFW-1", onHand: "2,200", reserved: "180", available: "2,020", status: "In Stock" },
  { product: "Vitamin C Tablets", category: "Health & Beauty", sku: "HB-5010", wh: "MIA-1", onHand: "95", reserved: "40", available: "55", status: "Low Stock" },
];

const categories = [
  { name: "Electronics", pct: 24, color: "#3B82F6" },
  { name: "Apparel", pct: 22, color: "#10B981" },
  { name: "Home & Kitchen", pct: 18, color: "#F59E0B" },
  { name: "Health & Beauty", pct: 14, color: "#8B5CF6" },
  { name: "Other", pct: 22, color: "#EF4444" },
];

const stockStatus = [
  { label: "In Stock", color: "#10B981", skus: "8,492 SKUs", pct: "76.3%" },
  { label: "Low Stock", color: "#F59E0B", skus: "134 SKUs", pct: "15.4%" },
  { label: "Out of Stock", color: "#EF4444", skus: "86 SKUs", pct: "5.7%" },
];

const expiring = [
  { name: "Whey Protein 1kg", info: "MIA-1 - Expires in 15 days", units: "120 units" },
  { name: "Vitamin C Tablets", info: "ORD-1 - Expires in 22 days", units: "80 units" },
  { name: "Face Cream 50ml", info: "DFW-1 - Expires in 31 days", units: "60 units" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Stock": "bg-[#10B981]/10 text-[#10B981]",
    "Low Stock": "bg-[#F59E0B]/10 text-[#F59E0B]",
    "Out of Stock": "bg-[#EF4444]/10 text-[#EF4444]",
  };
  return <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[status]}`}>{status}</span>;
}

const card = "bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.08)]";
const thCls = "text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3";

export default function WarehouseInventoryPage() {
  const [activeTab, setActiveTab] = useState("All Inventory");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Inventory</h1>
          <p className="text-[14px] text-[#64748B] mt-1">View and manage all inventory across your warehouses.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]">All Warehouses (5) <ChevronDown className="w-4 h-4" /></button>
          <button className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]"><Filter className="w-4 h-4" /> Filters</button>
          <button className="flex items-center gap-2 text-[13px] text-white bg-[#3B82F6] rounded-lg px-4 py-2 hover:bg-[#2563EB]"><Download className="w-4 h-4" /> Export</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const Arrow = s.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={s.title} className={card + " p-5"}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#64748B]">{s.title}</span>
                <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}><Icon className={`w-4.5 h-4.5 ${s.iconColor}`} /></div>
              </div>
              <p className="text-[24px] font-bold text-[#1E293B]">{s.value} <span className="text-[12px] font-normal text-[#94A3B8]">{s.sub}</span></p>
              <div className="flex items-center gap-1 mt-1.5">
                <Arrow className={`w-3.5 h-3.5 ${s.positive ? "text-[#10B981]" : "text-[#EF4444]"}`} />
                <span className={`text-[12px] font-medium ${s.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-[#94A3B8]">{s.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E2E8F0]">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[13px] pb-3 border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "text-[#3B82F6] border-[#3B82F6] font-medium"
                  : "text-[#64748B] border-transparent hover:text-[#1E293B]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 2.6fr) minmax(0, 1fr)" }}>
        {/* Main table card */}
        <div className={card + " overflow-hidden"}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2E8F0]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input placeholder="Search by SKU, product name or barcode..." className="w-full text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] bg-white border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30" />
            </div>
            <button className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]">All Categories <ChevronDown className="w-4 h-4" /></button>
            <button className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]">All Status <ChevronDown className="w-4 h-4" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className={thCls}>Product</th>
                  <th className={thCls}>SKU</th>
                  <th className={thCls}>Warehouse</th>
                  <th className={thCls}>On Hand</th>
                  <th className={thCls}>Reserved</th>
                  <th className={thCls}>Available</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls + " text-right"}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.sku} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-[#94A3B8]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#1E293B] leading-tight">{r.product}</p>
                          <p className="text-[11px] text-[#94A3B8] leading-tight mt-0.5">{r.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-[#64748B] font-mono">{r.sku}</td>
                    <td className="px-5 py-3 text-[13px] text-[#64748B]">{r.wh}</td>
                    <td className="px-5 py-3 text-[13px] font-medium text-[#1E293B]">{r.onHand}</td>
                    <td className="px-5 py-3 text-[13px] text-[#64748B]">{r.reserved}</td>
                    <td className="px-5 py-3 text-[13px] font-medium text-[#1E293B]">{r.available}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-[#94A3B8] hover:text-[#64748B]">
                        <MoreHorizontal className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#E2E8F0]">
            <span className="text-[13px] text-[#64748B]">Showing 1-10 of 8,742 items</span>
            <div className="flex items-center gap-1">
              {["1", "2", "3", "...", "1457"].map((p, i) => (
                <button key={i} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] ${p === "1" ? "bg-[#3B82F6] text-white" : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar widgets */}
        <div className="space-y-5">
          {/* Inventory by Category */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-4">Inventory by Category</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {categories.map((c, i) => {
                    const off = categories.slice(0, i).reduce((s, x) => s + x.pct, 0);
                    const da = `${c.pct * 2.51327} ${251.327 - c.pct * 2.51327}`;
                    return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c.color} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[17px] font-bold text-[#1E293B] leading-none">1,284</p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">Total Units</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {categories.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-[#64748B]">{c.name}</span>
                    </div>
                    <span className="font-medium text-[#1E293B]">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-3">Stock Status</h3>
            <div className="space-y-2.5">
              {stockStatus.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[#64748B]">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#1E293B]">{s.skus}</span>
                    <span className="text-[#94A3B8] w-10 text-right">{s.pct}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between text-[12px] pt-2 border-t border-[#E2E8F0]">
                <span className="font-semibold text-[#1E293B]">Total</span>
                <span className="font-semibold text-[#1E293B]">8,742 SKUs</span>
              </div>
            </div>
          </div>

          {/* Expiring Soon */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Expiring Soon</h3>
              <button className="text-[12px] text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {expiring.map((e) => (
                <div key={e.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#1E293B] truncate">{e.name}</p>
                    <p className="text-[11px] text-[#94A3B8]">{e.info}</p>
                  </div>
                  <span className="text-[11px] font-medium text-[#F59E0B] shrink-0">{e.units}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-[12px] text-[#3B82F6] border border-[#E2E8F0] rounded-lg py-2 hover:bg-[#F8FAFC]">View all expiring items</button>
          </div>

          {/* Recent Activity */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Recent Activity</h3>
              <button className="text-[12px] text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {[
                { text: "Inbound PO #90765 received", info: "ATL-1 - 2h ago", dot: "#10B981" },
                { text: "SKU ELEC-1001 stock adjusted", info: "ATL-1 - 4h ago", dot: "#3B82F6" },
                { text: "Cycle count completed Zone B", info: "LAX-1 - 6h ago", dot: "#8B5CF6" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.dot }} />
                  <div>
                    <p className="text-[12px] text-[#1E293B]">{a.text}</p>
                    <p className="text-[11px] text-[#94A3B8]">{a.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
