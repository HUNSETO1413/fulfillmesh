"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck, CheckCircle2, AlertTriangle, Clock,
  ArrowUpRight, ArrowDownRight,
  Search, ChevronDown, MoreVertical, Plus, Calendar, Bell,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import type { QcInspection } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate } from "@/lib/format";

const stats = [
  { title: "Total Inspections", value: "248", change: "+12%", positive: true, icon: ClipboardCheck, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "Pass Rate", value: "94.6%", change: "+2.1%", positive: true, icon: CheckCircle2, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
  { title: "Failed Inspections", value: "37", change: "-5%", positive: false, icon: AlertTriangle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
  { title: "Pending Inspections", value: "22", change: "+8%", positive: true, icon: Clock, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
];

const results = [
  { name: "Passed", count: "214", pct: "86.3%", color: "#00B894" },
  { name: "Failed", count: "22", pct: "8.9%", color: "#EF4444" },
  { name: "Re-Inspection", count: "22", pct: "8.9%", color: "#7C6FF6" },
  { name: "Cancelled", count: "6", pct: "2.4%", color: "#D9E5F2" },
];

const stages = [
  { name: "Pre-production", value: 38 },
  { name: "During Production", value: 72 },
  { name: "Pre-shipment", value: 96 },
  { name: "Container Loading", value: 24 },
  { name: "In-transit", value: 18 },
];

const tabs = ["All", "Scheduled", "In Progress", "Passed", "Failed", "On Hold"];

export default function QcInspectionsView({ items }: { items: QcInspection[] }) {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const circumference = 2 * Math.PI * 40;
  const maxBar = 100;

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesTab = activeTab === "All" || it.status === activeTab;
      const term = query.trim().toLowerCase();
      const matchesQuery =
        !term ||
        it.id.toLowerCase().includes(term) ||
        it.product.toLowerCase().includes(term) ||
        it.supplier.toLowerCase().includes(term) ||
        (it.sku ?? "").toLowerCase().includes(term);
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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-deep-navy">QC Inspections</h1>
          <p className="text-[14px] text-text-body mt-0.5">Monitor product quality and ensure compliance across all stages.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body hover:bg-soft-bg">
            <Calendar className="w-4 h-4" />
            May 12 – May 18, 2025
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg">
            <Bell className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-action-blue hover:bg-navy rounded-lg text-[13px] font-medium text-white transition-colors">
            <Plus className="w-4 h-4" />
            New Inspection
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-text-muted">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-deep-navy leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {s.positive ? (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5 text-teal" />
                    <span className="text-[12px] font-medium text-teal">{s.change}</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span className="text-[12px] font-medium text-[#EF4444]">{s.change}</span>
                  </>
                )}
                <span className="text-[11px] text-text-light">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Results donut */}
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
          <h3 className="text-[14px] font-semibold text-deep-navy mb-4">Inspection Results Overview</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-[140px] h-[140px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#D9E5F2" strokeWidth="12" />
                {results.map((r, i) => {
                  const p = parseFloat(r.pct);
                  const len = (p / 100) * circumference;
                  const prior = results.slice(0, i).reduce((sum, x) => sum + parseFloat(x.pct), 0);
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={r.color}
                      strokeWidth="12"
                      strokeLinecap="butt"
                      strokeDasharray={`${len} ${circumference - len}`}
                      strokeDashoffset={-(prior / 100) * circumference}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[10px] text-text-light">Total</p>
                  <p className="text-[20px] font-bold text-deep-navy">248</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {results.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="text-text-body truncate">{r.name}</span>
                  </div>
                  <span className="font-medium text-deep-navy shrink-0 ml-2">{r.count} <span className="text-text-light">({r.pct})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage bar chart */}
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-deep-navy">Inspections by Stage</h3>
            <span className="inline-flex items-center gap-1 text-[12px] text-text-muted bg-soft-bg px-2.5 py-1 rounded-md">
              This Week
              <ChevronDown className="w-3 h-3" />
            </span>
          </div>
          <div className="flex items-end justify-between gap-3 h-[160px] px-2">
            {stages.map((s) => (
              <div key={s.name} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[12px] font-semibold text-deep-navy mb-1">{s.value}</span>
                <div className="w-full bg-[#0057D8] rounded-t" style={{ height: `${(s.value / maxBar) * 100}%` }} />
                <span className="text-[10px] text-text-light mt-2 text-center leading-tight">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-border-soft p-3 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search inspections..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-deep-navy placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue"
            />
          </div>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => selectTab(t)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[13px] transition-colors ${
                activeTab === t
                  ? "bg-action-blue border-action-blue text-white"
                  : "border-border-soft text-text-muted hover:bg-soft-bg"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border-soft shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "900px" }}>
            <thead>
              <tr className="bg-soft-bg border-b border-border-soft">
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Product</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">SKU</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Supplier</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Scheduled</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Defect Rate</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((it) => {
                const color = it.status === "Failed" ? "#EF4444" : it.status === "Passed" ? "#00B894" : "#66758C";
                return (
                  <tr key={it.id} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                          style={{
                            backgroundColor: `${color}14`,
                            color,
                            boxShadow: `inset 0 0 0 1px ${color}26`,
                          }}
                        >
                          {it.product.charAt(0)}
                        </div>
                        <div>
                          <Link href={`/dashboard/qc-inspections/${it.id}`} className="text-[13px] font-medium text-deep-navy leading-tight hover:text-action-blue">{it.product}</Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-text-body font-mono">{it.sku ?? "—"}</td>
                    <td className="px-5 py-3 text-[13px] text-text-body">{it.supplier}</td>
                    <td className="px-5 py-3 text-[13px] text-text-body whitespace-nowrap">{formatDate(it.scheduledDate)}</td>
                    <td className="px-5 py-3 text-[13px] text-text-body">{it.defectRate != null ? `${it.defectRate}%` : "—"}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={it.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-text-light hover:text-text-muted p-1 rounded hover:bg-[#F1F5F9]">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-text-muted">No inspections match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft">
          <p className="text-[12px] text-text-muted">
            {filtered.length === 0
              ? "Showing 0 inspections"
              : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} inspections`}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-light hover:bg-soft-bg disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium ${
                    p === currentPage
                      ? "bg-action-blue text-white"
                      : "border border-border-soft text-text-muted hover:bg-soft-bg"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted hover:bg-soft-bg disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="inline-flex items-center gap-1 px-2 py-1 border border-border-soft rounded-md text-[12px] text-text-muted">
              {pageSize} / page
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
