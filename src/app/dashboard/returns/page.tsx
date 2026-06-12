"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight,
  Calendar, Plus, Filter, Download,
} from "lucide-react";

const tabs = ["All Returns", "Requested", "Approved", "In Transit", "Completed", "Rejected"];

const returns = [
  { id: "RET-10078", orderId: "ORD-10458", customer: "Acme Retail", email: "orders@acmeretail.com", status: "Requested", reason: "Wrong Item", date: "May 18, 2025", time: "10:18 AM" },
  { id: "RET-10077", orderId: "ORD-10457", customer: "Summit Goods", email: "hello@summitgoods.com", status: "Approved", reason: "Item Defective", date: "May 18, 2025", time: "9:40 AM" },
  { id: "RET-10076", orderId: "ORD-10456", customer: "Peak Supplies", email: "info@peaksupplies.io", status: "In Transit", reason: "Changed Mind", date: "May 17, 2025", time: "4:52 PM" },
  { id: "RET-10075", orderId: "ORD-10455", customer: "Blue Ridge Co.", email: "sales@blueridgeco.com", status: "Completed", reason: "Not Eligible", date: "May 17, 2025", time: "11:08 AM" },
  { id: "RET-10074", orderId: "ORD-10454", customer: "Northwind Traders", email: "contact@northwind.com", status: "Rejected", reason: "Not Eligible", date: "May 16, 2025", time: "3:33 PM" },
  { id: "RET-10073", orderId: "ORD-10453", customer: "Urban Outfitters", email: "support@urbanoutfitters.com", status: "Requested", reason: "Wrong Size", date: "May 16, 2025", time: "8:15 AM" },
  { id: "RET-10072", orderId: "ORD-10452", customer: "Coastal Living", email: "care@coastalliving.com", status: "Approved", reason: "Item Defective", date: "May 15, 2025", time: "2:45 PM" },
  { id: "RET-10071", orderId: "ORD-10451", customer: "TechHub Solutions", email: "info@techhub.com", status: "Completed", reason: "Changed Mind", date: "May 15, 2025", time: "9:10 AM" },
  { id: "RET-10070", orderId: "ORD-10450", customer: "Greenfield Market", email: "returns@greenfield.com", status: "In Transit", reason: "Wrong Item", date: "May 14, 2025", time: "6:35 PM" },
  { id: "RET-10069", orderId: "ORD-10449", customer: "Style & Co.", email: "help@styleandco.com", status: "Rejected", reason: "Damaged by Customer", date: "May 14, 2025", time: "11:20 AM" },
];

const statusStyles: Record<string, string> = {
  "Requested": "bg-[#FEF3C7] text-[#92400E]",
  "Approved": "bg-[#DCFCE7] text-[#166534]",
  "In Transit": "bg-[#DBEAFE] text-[#1E40AF]",
  "Completed": "bg-[#F3E8FF] text-[#6B21A8]",
  "Rejected": "bg-[#FEE2E2] text-[#991B1B]",
};

function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || "bg-[#F3F4F6] text-[#374151]";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[12px] font-medium rounded-md ${style}`}>
      {status}
    </span>
  );
}

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState("All Returns");

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#061A3D]">Returns</h1>
          <p className="text-[14px] text-[#4A5A73] mt-0.5">Manage customer return requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Calendar className="w-4 h-4" />
            May 12 – May 18, 2025
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Plus className="w-4 h-4" />
            New Return
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#E5E7EB]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-1 py-2.5 text-[13px] font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? "text-[#061A3D] border-[#2563EB]"
                : "text-[#4A5A73] border-transparent hover:text-[#061A3D]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table card with integrated toolbar */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search returns by order ID, customer name..."
                className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] text-[#061A3D] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
            <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF]">
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF]">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">Return ID</th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">Order ID</th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">Customer</th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">Reason</th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">Request Date</th>
                <th className="text-right text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/returns/${r.id}`} className="text-[13px] font-medium text-[#061A3D] hover:underline hover:text-[#2563EB]">
                      {r.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#4A5A73]">{r.orderId}</td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-[#061A3D]">{r.customer}</p>
                    <p className="text-[12px] text-[#4A5A73]">{r.email}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-[13px] text-[#374151]">{r.reason}</td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-[#4A5A73]">{r.date}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[#9CA3AF] hover:text-[#4A5A73] p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]">
          <p className="text-[13px] text-[#4A5A73]">Showing 1 to 10 of 124 returns</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2563EB] text-white text-[13px] font-medium shadow-[0_1px_2px_rgba(37,99,246,0.4)]">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#4A5A73] text-[13px] font-medium hover:bg-[#F9FAFB]">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#4A5A73] text-[13px] font-medium hover:bg-[#F9FAFB]">3</button>
              <span className="px-1 text-[#9CA3AF] text-[13px]">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#4A5A73] text-[13px] font-medium hover:bg-[#F9FAFB]">13</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D1D5DB] rounded-lg text-[13px] text-[#4A5A73] hover:bg-[#F9FAFB]">
              25 / page
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
