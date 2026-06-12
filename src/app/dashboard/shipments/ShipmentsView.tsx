"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, Filter, ChevronDown, Download, Plus, Calendar,
  MoreVertical, ChevronLeft, ChevronRight, ArrowUpDown,
  Package, Truck, CheckCircle2, AlertTriangle,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import type { Shipment } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate, formatNumber } from "@/lib/format";

const tabs = ["All Shipments", "In Transit", "Out for Delivery", "Delivered", "Exception"];

const carrierColors: Record<string, string> = {
  FedEx: "#4D148C",
  UPS: "#7B5B2E",
  USPS: "#1A3668",
  DHL: "#D40511",
};

function CarrierLogo({ carrier }: { carrier: string }) {
  const c = carrierColors[carrier] || "#66758C";
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-7 rounded-md bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
        <span className="text-[10px] font-extrabold tracking-tight" style={{ color: c }}>{carrier}</span>
      </div>
      <div>
        <p className="text-[13px] font-medium text-[#1E293B]">{carrier}</p>
        <p className="text-[11px] text-[#94A3B8]">Standard</p>
      </div>
    </div>
  );
}

export default function ShipmentsView({ items }: { items: Shipment[] }) {
  const [activeTab, setActiveTab] = useState("All Shipments");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const stats = useMemo(() => {
    const total = items.length;
    const inTransit = items.filter((s) => s.status === "In Transit").length;
    const delivered = items.filter((s) => s.status === "Delivered").length;
    const exceptions = items.filter((s) => s.status === "Exception").length;
    return [
      { title: "Total Shipments", value: formatNumber(total), change: "8.2%", positive: true, sub: "vs last week", icon: Package, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
      { title: "In Transit", value: formatNumber(inTransit), change: "3.1%", positive: true, sub: "vs last week", icon: Truck, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
      { title: "Delivered", value: formatNumber(delivered), change: "12.5%", positive: true, sub: "vs last week", icon: CheckCircle2, iconBg: "bg-[#8B5CF6]/10", iconColor: "text-[#8B5CF6]" },
      { title: "Exceptions", value: formatNumber(exceptions), change: "4.7%", positive: false, sub: "vs last week", icon: AlertTriangle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
    ];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((s) => {
      const matchesTab = activeTab === "All Shipments" || s.status === activeTab;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        s.id.toLowerCase().includes(q) ||
        s.trackingNumber.toLowerCase().includes(q) ||
        (s.orderId?.toLowerCase().includes(q) ?? false);
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
          <h1 className="text-[24px] font-bold text-[#1E293B]">Shipments</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">Track and manage all outgoing shipments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#475569] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Calendar className="w-4 h-4" /> May 12 – May 18, 2025 <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Plus className="w-4 h-4" /> New Shipment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#64748B]">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#1E293B] leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {s.positive ? <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
                <span className={`text-[12px] font-medium ${s.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-[#94A3B8]">{s.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E2E8F0]">
        <div className="flex items-center" style={{ gap: "28px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={`relative pb-3 text-[14px] font-medium transition-colors ${
                activeTab === tab ? "text-[#3B82F6]" : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#3B82F6] rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search shipments by ID, order ID, or tracking number..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
            />
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B]">
            <Filter className="w-4 h-4" /> Filters <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B]">
          <Download className="w-4 h-4" /> Export <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-6 py-3">Shipment ID</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-6 py-3">Order ID</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-6 py-3">Carrier</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-6 py-3">Origin</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-6 py-3">Destination</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-6 py-3">
                  <span className="inline-flex items-center gap-1">ETA <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-right text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((s) => (
                <tr key={s.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/60 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/shipments/${s.id}`} className="text-[13px] font-medium text-[#3B82F6] font-mono hover:underline">{s.id}</Link>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#64748B]">{s.orderId ?? "—"}</td>
                  <td className="px-6 py-4"><CarrierLogo carrier={s.carrier} /></td>
                  <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                  <td className="px-6 py-4 text-[13px] text-[#1E293B]">{s.origin}</td>
                  <td className="px-6 py-4 text-[13px] text-[#1E293B]">{s.destination}</td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] text-[#1E293B]">{s.estimatedDelivery ? formatDate(s.estimatedDelivery) : "—"}</p>
                    <p className="text-[12px] text-[#94A3B8]">{s.weight ?? ""}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#94A3B8] hover:text-[#64748B] p-1"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[13px] text-[#64748B]">
                    No shipments match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0]">
          <p className="text-[13px] text-[#64748B]">
            {filtered.length === 0
              ? "Showing 0 results"
              : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} shipments`}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
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
                  className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-medium ${
                    p === currentPage
                      ? "bg-[#3B82F6] text-white shadow-[0_1px_2px_rgba(59,130,246,0.4)]"
                      : "text-[#64748B] hover:bg-[#F8FAFC] border border-transparent"
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
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B]">{pageSize} / page <ChevronDown className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
