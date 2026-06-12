"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight,
  Calendar, Plus, Filter, Download,
} from "lucide-react";
import type { ReturnRecord } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate } from "@/lib/format";

// Tab label -> matching ReturnRecord statuses. "Completed" groups the terminal
// fulfilled states; all other tabs map to a single status.
const tabs = ["All Returns", "Requested", "Approved", "In Transit", "Completed", "Rejected"];
const tabStatuses: Record<string, ReturnRecord["status"][]> = {
  Requested: ["Requested"],
  Approved: ["Approved"],
  "In Transit": ["In Transit"],
  Completed: ["Received", "Refunded"],
  Rejected: ["Rejected"],
};

export default function ReturnsView({ items }: { items: ReturnRecord[] }) {
  const [activeTab, setActiveTab] = useState("All Returns");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return items.filter((r) => {
      const matchesTab =
        activeTab === "All Returns" || (tabStatuses[activeTab]?.includes(r.status) ?? false);
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.orderId.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [items, activeTab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function selectTab(tab: string) {
    setActiveTab(tab);
    setPage(1);
  }

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
            onClick={() => selectTab(tab)}
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
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
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
              {pageRows.map((r) => (
                <tr key={r.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/returns/${r.id}`} className="text-[13px] font-medium text-[#061A3D] hover:underline hover:text-[#2563EB]">
                      {r.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#4A5A73]">{r.orderId}</td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-[#061A3D]">{r.customer}</p>
                    <p className="text-[12px] text-[#4A5A73]">{r.customer.toLowerCase().replace(/[^a-z]/g, "")}@example.com</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-[13px] text-[#374151]">{r.reason}</td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-[#4A5A73]">{formatDate(r.requestedDate)}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[#9CA3AF] hover:text-[#4A5A73] p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#4A5A73]">
                    No returns match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]">
          <p className="text-[13px] text-[#4A5A73]">
            {filtered.length === 0
              ? "Showing 0 results"
              : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} returns`}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium ${
                    p === currentPage
                      ? "bg-[#2563EB] text-white shadow-[0_1px_2px_rgba(37,99,246,0.4)]"
                      : "border border-[#D1D5DB] text-[#4A5A73] hover:bg-[#F9FAFB]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D1D5DB] rounded-lg text-[13px] text-[#4A5A73] hover:bg-[#F9FAFB]">
              {pageSize} / page
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
