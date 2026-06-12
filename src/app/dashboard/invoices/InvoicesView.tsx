"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Plus,
  Search,
  ChevronDown,
  Calendar,
  SlidersHorizontal,
  MoreVertical,
  FileText,
  Download,
  Send,
  Receipt,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  Clock,
  Wallet,
} from "lucide-react";
import type { Invoice } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

const stats = [
  { title: "Total Outstanding", value: "$24,568.75", sub: "14 invoices", color: "#3B82F6", icon: DollarSign },
  { title: "Total Paid (This Year)", value: "$286,394.22", sub: "32 invoices", color: "#10B981", icon: CheckCircle2 },
  { title: "Overdue Amount", value: "$6,420.00", sub: "2 invoices", color: "#EF4444", icon: AlertTriangle },
  { title: "Due Soon", value: "$8,148.25", sub: "3 invoices", color: "#F59E0B", icon: Clock },
  { title: "Credit Balance", value: "$1,250.00", sub: "Available Credit", color: "#8B5CF6", icon: Wallet },
];

const tabs: { label: string; status: string | null }[] = [
  { label: "All Invoices", status: null },
  { label: "Draft", status: "Draft" },
  { label: "Sent", status: "Sent" },
  { label: "Paid", status: "Paid" },
  { label: "Overdue", status: "Overdue" },
  { label: "Void", status: "Void" },
];

const aging = [
  { label: "Current", value: "$10,000", pct: 41, color: "#10B981" },
  { label: "1–30 Days", value: "$6,148", pct: 25, color: "#3B82F6" },
  { label: "31–60 Days", value: "$4,000", pct: 16, color: "#F59E0B" },
  { label: "61–90 Days", value: "$2,700", pct: 11, color: "#EF4444" },
  { label: "90+ Days", value: "$1,720", pct: 7, color: "#8B5CF6" },
];

const recentPayments = [
  { id: "PAY-2025-0312", date: "May 24, 2025", amount: "$4,310.00" },
  { id: "PAY-2025-0311", date: "May 23, 2025", amount: "$3,250.75" },
  { id: "PAY-2025-0310", date: "May 21, 2025", amount: "$5,760.00" },
  { id: "PAY-2025-0308", date: "May 19, 2025", amount: "$1,560.00" },
];

const byStatus = [
  { label: "Paid", value: "32 (82%)", pct: 82, color: "#10B981" },
  { label: "Pending", value: "5 (13%)", pct: 13, color: "#3B82F6" },
  { label: "Overdue", value: "2 (5%)", pct: 5, color: "#EF4444" },
];

const statement = [
  { label: "Opening Balance (May 1, 2025)", value: "$13,240.00" },
  { label: "Invoices", value: "$38,916.25" },
  { label: "Payments", value: "−$26,868.00" },
  { label: "Credits / Adjustments", value: "−$0.00" },
];

const quickActions = [
  { label: "Make a Payment", icon: CreditCard },
  { label: "Download Statement", icon: Download },
  { label: "View Credit Notes", icon: Receipt },
  { label: "Billing Settings", icon: SlidersHorizontal },
  { label: "Request Invoice", icon: Send },
];

export default function InvoicesView({ items }: { items: Invoice[] }) {
  const [active, setActive] = useState("All Invoices");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const circumference = 2 * Math.PI * 40;

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const inv of items) map[inv.status] = (map[inv.status] ?? 0) + 1;
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const tab = tabs.find((t) => t.label === active);
    return items.filter((inv) => {
      const matchesTab = !tab?.status || inv.status === tab.status;
      const term = query.trim().toLowerCase();
      const matchesQuery =
        !term ||
        inv.id.toLowerCase().includes(term) ||
        inv.customer.toLowerCase().includes(term) ||
        (inv.orderId ?? "").toLowerCase().includes(term);
      return matchesTab && matchesQuery;
    });
  }, [items, active, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function selectTab(label: string) {
    setActive(label);
    setPage(1);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#1E293B]">Invoices / Payments</h1>
          <p className="text-[14px] text-[#64748B] mt-1">View, manage, and pay your invoices and track payment history.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <CreditCard className="w-4 h-4" /> Payment Methods
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-[#3B82F6] rounded-lg text-[13px] font-medium text-white hover:bg-[#2563EB] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Plus className="w-4 h-4" /> New Payment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#64748B]">{s.title}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}1A` }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-[22px] font-bold text-[#1E293B] leading-none">{s.value}</p>
              <p className="text-[12px] text-[#94A3B8] mt-1.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search invoices by invoice #, PO #, or reference..."
            className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B]">
          All Statuses <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button className="inline-flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B]">
          <Calendar className="w-4 h-4" /> May 1 – May 31, 2025 <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button className="inline-flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B]">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
        </button>
      </div>

      {/* Main: table + right rail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-4">
        {/* Table card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 border-b border-[#E2E8F0] overflow-x-auto">
            {tabs.map((t) => {
              const count = t.status === null ? items.length : counts[t.status] ?? 0;
              return (
                <button
                  key={t.label}
                  onClick={() => selectTab(t.label)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-[13px] font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                    active === t.label ? "border-[#3B82F6] text-[#3B82F6]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"
                  }`}
                >
                  {t.label}
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${active === t.label ? "bg-[#3B82F6]/10 text-[#3B82F6]" : "bg-[#F1F5F9] text-[#94A3B8]"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Invoice #", "PO / Reference", "Invoice Date", "Due Date", "Amount", "Status", "Actions"].map((h, i) => (
                    <th key={i} className={`text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 ${i === 6 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#EF4444] shrink-0" />
                        <span className="text-[13px] font-medium text-[#3B82F6] font-mono">{inv.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B] font-mono">{inv.orderId ?? "—"}</td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{formatDate(inv.issuedDate)}</td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{formatDate(inv.dueDate)}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#1E293B]">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {(inv.status === "Overdue" || inv.status === "Sent") && (
                          <button className="px-3 py-1 bg-[#3B82F6] rounded-md text-[11px] font-medium text-white hover:bg-[#2563EB]">Pay Now</button>
                        )}
                        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#64748B]">No invoices match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E2E8F0]">
            <p className="text-[12px] text-[#64748B]">
              {filtered.length === 0
                ? "Showing 0 invoices"
                : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} invoices`}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#94A3B8] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium ${
                    p === currentPage
                      ? "bg-[#3B82F6] text-white"
                      : "border border-[#E2E8F0] text-[#64748B]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#64748B] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          {/* Aging Summary */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Aging Summary</h3>
            <div className="flex justify-center mb-4">
              <div className="relative w-[140px] h-[140px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="11" />
                  {aging.map((a, i) => {
                    const len = (a.pct / 100) * circumference;
                    const prior = aging.slice(0, i).reduce((sum, x) => sum + x.pct, 0);
                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={a.color}
                        strokeWidth="11"
                        strokeDasharray={`${len} ${circumference - len}`}
                        strokeDashoffset={-(prior / 100) * circumference}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[16px] font-bold text-[#1E293B]">$24,568.75</p>
                  <p className="text-[10px] text-[#94A3B8]">Total Outstanding</p>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              {aging.map((a) => (
                <div key={a.label} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                    <span className="text-[#64748B]">{a.label}</span>
                  </div>
                  <span className="font-medium text-[#1E293B]">{a.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[#1E293B]">Recent Payments</h3>
              <button className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-[#3B82F6]">{p.id}</p>
                    <p className="text-[11px] text-[#94A3B8]">{p.date}</p>
                  </div>
                  <span className="text-[13px] font-semibold text-[#10B981]">{p.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-6 rounded bg-[#1A1F71] flex items-center justify-center text-white text-[9px] font-bold italic">VISA</div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-[#1E293B]">Visa ending in 4242</p>
                  <p className="text-[11px] text-[#94A3B8]">Expires 09/26</p>
                </div>
                <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded bg-[#10B981]/10 text-[#10B981]">Default</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-6 rounded bg-[#EB001B] flex items-center justify-center text-white text-[8px] font-bold">MC</div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-[#1E293B]">Mastercard ending in 5555</p>
                  <p className="text-[11px] text-[#94A3B8]">Expires 06/27</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: by status + statement + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-4">
        {/* Invoices by Status */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Invoices by Status</h3>
          <div className="flex items-center gap-5">
            <div className="relative w-[110px] h-[110px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="11" />
                {byStatus.map((b, i) => {
                  const len = (b.pct / 100) * circumference;
                  const prior = byStatus.slice(0, i).reduce((sum, x) => sum + x.pct, 0);
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={b.color}
                      strokeWidth="11"
                      strokeDasharray={`${len} ${circumference - len}`}
                      strokeDashoffset={-(prior / 100) * circumference}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[16px] font-bold text-[#1E293B]">39</p>
                <p className="text-[10px] text-[#94A3B8]">Total</p>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {byStatus.map((b) => (
                <div key={b.label} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                    <span className="text-[#64748B]">{b.label}</span>
                  </div>
                  <span className="font-medium text-[#1E293B]">{b.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Statement */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Account Statement</h3>
            <button className="text-[12px] font-medium text-[#3B82F6] hover:underline">View full statement</button>
          </div>
          <div className="space-y-2.5">
            {statement.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748B]">{s.label}</span>
                <span className="font-medium text-[#1E293B]">{s.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#1E293B]">Closing Balance (May 31, 2025)</span>
              <span className="text-[14px] font-bold text-[#EF4444]">$24,568.75</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Quick Actions</h3>
          <div className="space-y-1">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button key={a.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                  <Icon className="w-4 h-4 text-[#94A3B8]" /> {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AutoPay CTA band */}
      <div className="bg-[#061A3D] rounded-xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Set up Autopay and never miss a payment</h3>
            <p className="text-[12px] text-white/60 mt-0.5">Automatically pay your invoices on the due date using your default payment method.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-[#003B7A] hover:bg-white/90 shrink-0">
          <CheckCircle2 className="w-4 h-4" /> Enable AutoPay
        </button>
      </div>
    </div>
  );
}
