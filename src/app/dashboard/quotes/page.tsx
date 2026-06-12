"use client";

import {
  FileText, Users, Clock, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Search, ChevronDown, MoreVertical, Plus, Calendar, Bell, SlidersHorizontal,
  ChevronLeft, ChevronRight, AlertCircle, Wallet,
} from "lucide-react";

const stats = [
  { title: "Open RFQs", value: "24", change: "14.3%", positive: true, icon: FileText, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "Supplier Responses", value: "68", change: "17.6%", positive: true, icon: Users, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Avg. Turnaround Time", value: "2.6 days", change: "8.2%", positive: true, icon: Clock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Approved Quotes", value: "18", change: "20.0%", positive: true, icon: CheckCircle2, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
];

const rfqs = [
  { id: "RFQ-2025-0421", product: "Wireless Headphones", category: "Electronics", qty: "5,000", target: "$18.50", resp: "5 / 8", status: "Open", date: "May 18, 2025" },
  { id: "RFQ-2025-0420", product: "Stainless Steel Bottle", category: "Drinkware", qty: "1,000", target: "$4.20", resp: "3 / 6", status: "Open", date: "May 17, 2025" },
  { id: "RFQ-2025-0419", product: "Cotton T-Shirt (Unisex)", category: "Apparel", qty: "2,000", target: "$1.95", resp: "6 / 10", status: "Under Review", date: "May 16, 2025" },
  { id: "RFQ-2025-0418", product: "Yoga Mat", category: "Fitness", qty: "800", target: "$5.90", resp: "4 / 7", status: "Under Review", date: "May 16, 2025" },
  { id: "RFQ-2025-0417", product: "Bluetooth Speaker", category: "Electronics", qty: "1,200", target: "$22.00", resp: "7 / 7", status: "Awaiting Approval", date: "May 15, 2025" },
  { id: "RFQ-2025-0416", product: "Backpack (30L)", category: "Bags", qty: "600", target: "$8.50", resp: "5 / 6", status: "Awaiting Approval", date: "May 15, 2025" },
  { id: "RFQ-2025-0415", product: "LED Desk Lamp", category: "Home & Office", qty: "400", target: "$6.75", resp: "3 / 5", status: "Closed", date: "May 14, 2025" },
  { id: "RFQ-2025-0414", product: "Ceramic Mug", category: "Drinkware", qty: "1,200", target: "$2.10", resp: "5 / 5", status: "Closed", date: "May 13, 2025" },
  { id: "RFQ-2025-0413", product: "Power Bank (10000mAh)", category: "Electronics", qty: "900", target: "$9.30", resp: "6 / 8", status: "Closed", date: "May 12, 2025" },
  { id: "RFQ-2025-0412", product: "Jute Tote Bag", category: "Bags", qty: "1,500", target: "$3.40", resp: "2 / 6", status: "Draft", date: "May 9, 2025" },
];

const statusStyle: Record<string, string> = {
  "Open": "bg-[#0057D8]/10 text-[#0057D8]",
  "Under Review": "bg-[#7C6FF6]/10 text-[#7C6FF6]",
  "Awaiting Approval": "bg-[#F59E0B]/10 text-[#F59E0B]",
  "Closed": "bg-[#00B894]/10 text-[#00B894]",
  "Draft": "bg-[#9AA8B8]/10 text-[#66758C]",
};

const responseLegend = [
  { name: "Excellent (≥ 75%)", count: "8", pct: "25.8%", color: "#00B894" },
  { name: "Good (50% – 74%)", count: "7", pct: "29.2%", color: "#0057D8" },
  { name: "Fair (25% – 49%)", count: "6", pct: "25.0%", color: "#F59E0B" },
  { name: "Low (< 25%)", count: "4", pct: "20.0%", color: "#EF4444" },
];

export default function QuotesPage() {
  const circumference = 2 * Math.PI * 40;
  const segs = [25.8, 29.2, 25.0, 20.0];
  const colors = ["#00B894", "#0057D8", "#F59E0B", "#EF4444"];
  let off = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Requests for Quotation</h1>
          <p className="text-[14px] text-text-body mt-1">Open RFQs with status, supplier, and response time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body hover:bg-soft-bg transition-colors">
            <Calendar className="w-4 h-4 text-text-light" /> May 1 – May 31, 2025 <ChevronDown className="w-3.5 h-3.5 text-text-light" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-[13px] font-semibold hover:bg-[#2563EB] transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <Plus className="w-4 h-4" /> New RFQ
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-border-soft p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-text-muted font-medium">{s.title}</span>
                <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-text-primary leading-none tracking-tight">{s.value}</p>
              <div className="flex items-center gap-1.5 mt-3">
                {s.positive ? <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
                <span className={`text-[12px] font-semibold ${s.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-text-light">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-border-soft p-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input placeholder="Search RFQs by ID, product, or supplier..." className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors" />
        </div>
        {["Status: All", "Category: All", "Created By: All"].map((d) => (
          <button key={d} className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-[13px] text-text-body hover:bg-[#F3F4F6] transition-colors">{d}<ChevronDown className="w-3.5 h-3.5 text-text-light" /></button>
        ))}
        <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-[13px] text-text-body hover:bg-[#F3F4F6] transition-colors"><SlidersHorizontal className="w-3.5 h-3.5" />More Filters</button>
      </div>

      {/* Table + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Table */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-4 border-b border-border-soft">
            <h3 className="text-[16px] font-semibold text-text-primary">All RFQs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E2E8F0]">
                  {["Request ID", "Product", "Category", "Quantity", "Target Price", "Responses", "Status", "Created Date", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rfqs.map((r) => (
                  <tr key={r.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-3"><a href={`/dashboard/quotes/${r.id}`} className="text-[13px] font-semibold text-[#3B82F6] hover:underline font-mono">{r.id}</a></td>
                    <td className="px-4 py-3 text-[13px] font-medium text-text-primary whitespace-nowrap">{r.product}</td>
                    <td className="px-4 py-3 text-[13px] text-text-body whitespace-nowrap">{r.category}</td>
                    <td className="px-4 py-3 text-[13px] text-text-primary">{r.qty}</td>
                    <td className="px-4 py-3 text-[13px] text-text-primary">{r.target}</td>
                    <td className="px-4 py-3 text-[13px] text-text-body">{r.resp}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-md text-[12px] font-semibold ${statusStyle[r.status]}`}>{r.status}</span></td>
                    <td className="px-4 py-3 text-[13px] text-text-body whitespace-nowrap">{r.date}</td>
                    <td className="px-4 py-3"><button className="p-1 rounded hover:bg-[#F3F4F6] text-text-light transition-colors"><MoreVertical className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0]">
            <p className="text-[12px] text-text-muted">Showing 1 to 10 of 24 RFQs</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F9FAFB] text-text-light hover:bg-[#F3F4F6] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button className="min-w-8 h-8 px-2.5 flex items-center justify-center rounded-md bg-[#3B82F6] text-white text-[13px] font-medium">1</button>
                <button className="min-w-8 h-8 px-2.5 flex items-center justify-center rounded-md text-[13px] font-medium text-text-body hover:bg-[#F3F4F6] transition-colors">2</button>
                <button className="min-w-8 h-8 px-2.5 flex items-center justify-center rounded-md text-[13px] font-medium text-text-body hover:bg-[#F3F4F6] transition-colors">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F9FAFB] text-text-light hover:bg-[#F3F4F6] transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
              <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F9FAFB] border border-[#E2E8F0] rounded-md text-[12px] text-text-body hover:bg-[#F3F4F6] transition-colors">
                10 / page
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* RFQ Response Overview */}
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">RFQ Response Overview</h3>
            <div className="relative w-[140px] h-[140px] mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="11" />
                {segs.map((p, i) => {
                  const len = (p / 100) * circumference;
                  const el = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={colors[i]} strokeWidth="11" strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-(off / 100) * circumference} />;
                  off += p;
                  return el;
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[10px] text-text-light leading-tight">Avg.<br />Response Rate</p>
                  <p className="text-[20px] font-bold text-text-primary">62%</p>
                </div>
              </div>
            </div>
            <div className="space-y-2.5 mt-5">
              {responseLegend.map((l) => (
                <div key={l.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                    <span className="text-text-body truncate">{l.name}</span>
                  </div>
                  <span className="text-text-primary shrink-0 ml-2 font-medium">{l.count} <span className="text-text-light font-normal">({l.pct})</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Pending Approvals</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center shrink-0"><Clock className="w-[18px] h-[18px] text-[#F59E0B]" /></div>
                <div className="flex-1"><p className="text-[13px] text-text-primary font-medium">Awaiting Your Approval</p></div>
                <span className="text-[13px] font-semibold text-text-primary">6 RFQs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0"><AlertCircle className="w-[18px] h-[18px] text-[#EF4444]" /></div>
                <div className="flex-1"><p className="text-[13px] text-text-primary font-medium">Overdue Approvals</p></div>
                <span className="text-[13px] font-semibold text-text-primary">2 RFQs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00B894]/10 flex items-center justify-center shrink-0"><Wallet className="w-[18px] h-[18px] text-[#00B894]" /></div>
                <div className="flex-1"><p className="text-[13px] text-text-primary font-medium">Total Value in Bid</p></div>
                <span className="text-[13px] font-semibold text-text-primary">$48,620.00</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 bg-[#3B82F6] text-white rounded-lg text-[13px] font-semibold hover:bg-[#2563EB] transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.1)]">View All Approvals</button>
          </div>
        </div>
      </div>
    </div>
  );
}
