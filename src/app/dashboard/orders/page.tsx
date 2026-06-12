"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Filter, ChevronDown, Download, Plus, Calendar,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const tabs = ["All Orders", "Processing", "In Transit", "Delivered", "Cancelled"];

const orders = [
  { id: "ORD-10458", customer: "Acme Retail", status: "Delivered", date: "May 16, 2025", total: "$4,285.00" },
  { id: "ORD-10457", customer: "Summit Goods", status: "In Transit", date: "May 16, 2025", total: "$2,150.75" },
  { id: "ORD-10456", customer: "Peak Supplies", status: "Processing", date: "May 15, 2025", total: "$1,980.50" },
  { id: "ORD-10455", customer: "Blue Ridge Co.", status: "Delivered", date: "May 15, 2025", total: "$3,675.25" },
  { id: "ORD-10454", customer: "Northwind Traders", status: "Cancelled", date: "May 14, 2025", total: "$850.00" },
  { id: "ORD-10453", customer: "Urban Outfitters", status: "In Transit", date: "May 14, 2025", total: "$1,245.99" },
];

const statusStyles: Record<string, string> = {
  "Delivered": "bg-[#10B981] text-white",
  "In Transit": "bg-[#0057D8] text-white",
  "Processing": "bg-[#F59E0B] text-white",
  "Pending": "bg-[#F59E0B] text-white",
  "Cancelled": "bg-[#EF4444] text-white",
};

function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || "bg-[#64748B] text-white";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[12px] font-medium rounded-md ${style}`}>
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All Orders");

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold text-[#1A1A1A]">Orders</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
            <Calendar className="w-4 h-4" />
            May 01 - May 08, 2025
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[13px] font-medium text-white transition-colors">
            <Plus className="w-4 h-4" />
            New Order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
              activeTab === tab
                ? "bg-[#3B82F6] text-white"
                : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table card with integrated toolbar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] text-[#374151] placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">Order ID</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">Customer</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">Status</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">Order Date</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/orders/${order.id}`} className="text-[14px] font-medium text-[#374151] font-mono hover:text-[#3B82F6]">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[14px] text-[#374151]">{order.customer}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3">
                    <span className="text-[14px] text-[#6B7280]">{order.date}</span>
                  </td>
                  <td className="px-4 py-3 text-[14px] text-[#374151]">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]">
          <p className="text-[14px] text-[#6B7280]">Showing 1 to 6 of 24 orders</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {["1", "2", "3"].map((p, i) => (
                <button
                  key={i}
                  className={`min-w-8 h-8 px-2.5 flex items-center justify-center rounded-md text-[14px] font-medium ${
                    p === "1"
                      ? "bg-[#3B82F6] text-white"
                      : "text-[#6B7280] hover:bg-[#F3F4F6]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[14px] text-[#6B7280] hover:bg-[#F3F4F6]">
              6 per page
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
