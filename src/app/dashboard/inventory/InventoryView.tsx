"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Package, Layers, AlertTriangle, XCircle,
  Search, Filter, Download, Calendar, MoreHorizontal,
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import type { InventoryItem } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatNumber } from "@/lib/format";

const stats = [
  { title: "Total Products", value: "2,458", change: "+7.2%", note: "vs May 1", positive: true, icon: Package, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { title: "Total Stock", value: "156,782", change: "+4.6%", note: "vs May 5", positive: true, icon: Layers, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { title: "Low Stock Items", value: "128", change: "-3.7%", note: "vs May 5", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Out of Stock", value: "23", change: "+12.5%", note: "vs May 5", positive: false, icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

const statusTabs: { label: string; value: string }[] = [
  { label: "All", value: "All" },
  { label: "In Stock", value: "In Stock" },
  { label: "Low Stock", value: "Low Stock" },
  { label: "Out of Stock", value: "Out of Stock" },
  { label: "Backordered", value: "Backordered" },
];

export default function InventoryView({ items }: { items: InventoryItem[] }) {
  const [activeStatus, setActiveStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const matchesStatus = activeStatus === "All" || it.status === activeStatus;
      const matchesQuery =
        !q ||
        it.id.toLowerCase().includes(q) ||
        it.name.toLowerCase().includes(q) ||
        it.sku.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [items, activeStatus, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function selectStatus(value: string) {
    setActiveStatus(value);
    setPage(1);
  }

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

      {/* Status tabs */}
      <div className="flex items-center gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => selectStatus(tab.value)}
            className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
              activeStatus === tab.value
                ? "bg-[#3B82F6] text-white"
                : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]"
            }`}
          >
            {tab.label}
          </button>
        ))}
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
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
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
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Available</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((item) => (
                <tr key={item.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#3B82F6] font-mono whitespace-nowrap">
                    <Link href={`/dashboard/inventory/${item.id}`} className="hover:underline">{item.sku}</Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-medium text-[#1E293B]">{item.name}</p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">{item.warehouse}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B] whitespace-nowrap">{item.location ?? item.warehouse}</td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B]">{formatNumber(item.onHand)}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{formatNumber(item.available)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-[#94A3B8] hover:text-[#64748B]">
                      <MoreHorizontal className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-[#64748B]">
                    No inventory items match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
          <span className="text-[13px] text-[#64748B]">
            {filtered.length === 0
              ? "Showing 0 entries"
              : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${formatNumber(filtered.length)} entries`}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium ${
                  p === currentPage
                    ? "bg-[#3B82F6] text-white"
                    : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="ml-2 text-[13px] text-[#64748B] border border-[#E2E8F0] rounded-lg px-3 py-1.5">{pageSize} / page</span>
          </div>
        </div>
      </div>
    </div>
  );
}
