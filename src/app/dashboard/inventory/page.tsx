"use client";

import Link from "next/link";
import {
  Package, Layers, AlertTriangle, XCircle,
  Search, Filter, Download, Calendar, MoreHorizontal,
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const stats = [
  { title: "Total Products", value: "2,458", change: "+7.2%", note: "vs May 1", positive: true, icon: Package, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { title: "Total Stock", value: "156,782", change: "+4.6%", note: "vs May 5", positive: true, icon: Layers, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { title: "Low Stock Items", value: "128", change: "-3.7%", note: "vs May 5", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Out of Stock", value: "23", change: "+12.5%", note: "vs May 5", positive: false, icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

const items = [
  { sku: "SKU-001", name: "Wireless Headphones", category: "Electronics", location: "Los Angeles, CA", stock: "1,245", price: "$89", status: "In Stock" },
  { sku: "SKU-002", name: "Bluetooth Speaker", category: "Electronics", location: "Dallas, TX", stock: "320", price: "$45", status: "In Stock" },
  { sku: "SKU-003", name: "Coffee Maker", category: "Home & Kitchen", location: "Chicago, IL", stock: "78", price: "$129", status: "Low Stock" },
  { sku: "SKU-004", name: "Yoga Mat", category: "Sports & Outdoors", location: "Atlanta, GA", stock: "0", price: "$29", status: "Out of Stock" },
  { sku: "SKU-005", name: "Stainless Steel Water Bottle", category: "Drinkware", location: "New York, NY", stock: "1,560", price: "$25", status: "In Stock" },
  { sku: "SKU-006", name: "LED Desk Lamp", category: "Home & Kitchen", location: "Los Angeles, CA", stock: "230", price: "$59", status: "In Stock" },
  { sku: "SKU-007", name: "Resistance Bands Set", category: "Sports & Outdoors", location: "Dallas, TX", stock: "440", price: "$35", status: "In Stock" },
  { sku: "SKU-008", name: "Smart Watch", category: "Electronics", location: "Seattle, WA", stock: "67", price: "$199", status: "Low Stock" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Stock": "bg-[#10B981]/10 text-[#10B981]",
    "Low Stock": "bg-[#F59E0B]/10 text-[#F59E0B]",
    "Out of Stock": "bg-[#EF4444]/10 text-[#EF4444]",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Inventory</h1>
          <p className="text-[14px] text-[#64748B] mt-1">May 15, 2023 - May 28, 2023</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]">
            <Calendar className="w-4 h-4" />
            May 12 - May 18, 2025
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const Arrow = stat.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={stat.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#64748B]">{stat.title}</span>
                <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#1E293B]">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <Arrow className={`w-3.5 h-3.5 ${stat.positive ? "text-[#10B981]" : "text-[#EF4444]"}`} />
                <span className={`text-[12px] font-medium ${stat.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {stat.change}
                </span>
                <span className="text-[11px] text-[#94A3B8]">{stat.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] bg-white border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
              />
            </div>
            <button className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          <button className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">SKU ID</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Product Name</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Location</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Stock</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Price</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.sku} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#3B82F6] font-mono whitespace-nowrap">
                    <Link href={`/dashboard/inventory/${item.sku}`} className="hover:underline">{item.sku}</Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-medium text-[#1E293B]">{item.name}</p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">{item.category}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B] whitespace-nowrap">{item.location}</td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B]">{item.stock}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{item.price}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-[#94A3B8] hover:text-[#64748B]">
                      <MoreHorizontal className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
          <span className="text-[13px] text-[#64748B]">Showing 1 to 8 of 1,234 entries</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3B82F6] text-white text-[13px] font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] text-[13px] hover:bg-[#F8FAFC]">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] text-[13px] hover:bg-[#F8FAFC]">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] text-[13px] hover:bg-[#F8FAFC]">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] text-[13px] hover:bg-[#F8FAFC]">5</button>
            <span className="px-1 text-[#94A3B8] text-[13px]">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] text-[13px] hover:bg-[#F8FAFC]">155</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]">
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="ml-2 text-[13px] text-[#64748B] border border-[#E2E8F0] rounded-lg px-3 py-1.5">8 / page</span>
          </div>
        </div>
      </div>
    </div>
  );
}
