"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, CheckCircle2, Target, Clock, ArrowUpRight,
  Search, ChevronDown, MoreVertical, Plus, Download, Calendar, Bell,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const stats = [
  { title: "Total Suppliers", value: "487", change: "12.4%", icon: Users, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "Active Suppliers", value: "362", change: "9.7%", icon: CheckCircle2, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
  { title: "Avg Match Score", value: "82.6", change: "4.3 pts", icon: Target, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "On-Time Sample Rate", value: "95.3%", change: "2.8%", icon: Clock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
];

const tabs = ["All Suppliers", "Active", "Preferred", "Shortlisted", "Inactive"];

const suppliers = [
  { name: "Shenzhen Apex Manufacturing Co.", category: "Electronics", flag: "🇨🇳", country: "China", score: 92, moq: "500", lead: "12 days", certs: ["ISO", "BSCI", "RoHS"], perf: 96, status: "Active" },
  { name: "Ningbo Prime Goods Co., Ltd.", category: "Home & Living", flag: "🇨🇳", country: "China", score: 88, moq: "300", lead: "15 days", certs: ["ISO", "BSCI"], perf: 94, status: "Active" },
  { name: "Bangkok Supply Solutions", category: "Packaging", flag: "🇹🇭", country: "Thailand", score: 85, moq: "1,000", lead: "18 days", certs: ["ISO", "FSC"], perf: 92, status: "Active" },
  { name: "Dongguan Future Tech", category: "Electronics", flag: "🇨🇳", country: "China", score: 81, moq: "800", lead: "14 days", certs: ["ISO", "RoHS"], perf: 90, status: "Preferred" },
  { name: "Hangzhou Bright Textiles", category: "Apparel", flag: "🇨🇳", country: "China", score: 79, moq: "600", lead: "20 days", certs: ["ISO"], perf: 86, status: "Active" },
  { name: "Vietnam Pack Industries", category: "Packaging", flag: "🇻🇳", country: "Vietnam", score: 76, moq: "1,200", lead: "22 days", certs: ["FSC"], perf: 88, status: "Active" },
  { name: "Qingdao Oceanic Crafts", category: "Home & Living", flag: "🇨🇳", country: "China", score: 74, moq: "500", lead: "21 days", certs: ["ISO"], perf: 85, status: "Shortlisted" },
  { name: "Shenzhen Cleanway Logistics", category: "Logistics", flag: "🇨🇳", country: "China", score: 72, moq: "—", lead: "5 days", certs: ["ISO"], perf: 98, status: "Preferred" },
  { name: "Suzhou Greenway Materials", category: "Raw Materials", flag: "🇨🇳", country: "China", score: 68, moq: "2,000", lead: "25 days", certs: ["ISO", "RoHS"], perf: 82, status: "Inactive" },
  { name: "Jakarta Global Sourcing", category: "Home & Living", flag: "🇮🇩", country: "Indonesia", score: 65, moq: "1,500", lead: "22 days", certs: ["ISO", "BSCI"], perf: 80, status: "Shortlisted" },
];

const statusStyle: Record<string, string> = {
  "Active": "bg-[#00B894]/10 text-[#00B894]",
  "Preferred": "bg-[#0057D8]/10 text-[#0057D8]",
  "Shortlisted": "bg-[#F59E0B]/10 text-[#F59E0B]",
  "Inactive": "bg-[#9AA8B8]/10 text-[#66758C]",
};

const statusDot: Record<string, string> = {
  "Active": "#00B894",
  "Preferred": "#0057D8",
  "Shortlisted": "#F59E0B",
  "Inactive": "#9AA8B8",
};

const categoryColor: Record<string, string> = {
  "Electronics": "#0057D8",
  "Home & Living": "#00B894",
  "Packaging": "#F59E0B",
  "Apparel": "#7C6FF6",
  "Raw Materials": "#EC4899",
  "Logistics": "#06B6D4",
};

function scoreColor(score: number): string {
  if (score >= 85) return "#00B894";
  if (score >= 75) return "#0057D8";
  if (score >= 65) return "#F59E0B";
  return "#9AA8B8";
}

const categories = [
  { name: "Electronics", pct: 24.8, color: "#0057D8" },
  { name: "Home & Living", pct: 20.5, color: "#00B894" },
  { name: "Packaging", pct: 16.7, color: "#F59E0B" },
  { name: "Apparel", pct: 11.5, color: "#7C6FF6" },
  { name: "Raw Materials", pct: 11.2, color: "#EC4899" },
  { name: "Logistics", pct: 7.2, color: "#06B6D4" },
  { name: "Other", pct: 6.0, color: "#D9E5F2" },
];

const topRated = [
  { name: "Shenzhen Apex Manufacturing Co.", score: 92 },
  { name: "Ningbo Prime Goods Co., Ltd.", score: 88 },
  { name: "Bangkok Supply Solutions", score: 85 },
  { name: "Dongguan Future Tech", score: 81 },
  { name: "Hangzhou Bright Textiles", score: 79 },
];

const onTimePts = [60, 45, 62, 50, 70, 58, 75];
const onTimeDates = ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"];

function PerfRing({ pct }: { pct: number }) {
  const c = 2 * Math.PI * 14;
  const len = (pct / 100) * c;
  const stroke = pct >= 90 ? "#00B894" : pct >= 80 ? "#0057D8" : "#F59E0B";
  return (
    <div className="relative w-9 h-9">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="14" fill="none" stroke="#E6EDF5" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="14" fill="none" stroke={stroke} strokeWidth="2.5" strokeDasharray={`${len} ${c - len}`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-deep-navy">{pct}%</span>
    </div>
  );
}

export default function SuppliersPage() {
  const [tab, setTab] = useState("All Suppliers");
  const circumference = 2 * Math.PI * 38;
  let off = 0;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-deep-navy">Suppliers</h1>
          <p className="text-[14px] text-text-body mt-0.5">Discover, evaluate, and manage your vetted fulfillment partners.</p>
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
                <ArrowUpRight className="w-3.5 h-3.5 text-teal" />
                <span className="text-[12px] font-medium text-teal">{s.change}</span>
                <span className="text-[11px] text-text-light">vs May 5 – May 11</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                tab === t
                  ? "text-action-blue bg-action-blue/10"
                  : "text-text-muted hover:bg-[#F1F5F9]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-muted hover:bg-soft-bg">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-action-blue hover:bg-navy rounded-lg text-[13px] font-medium text-white transition-colors">
            <Plus className="w-4 h-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Table section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter bar */}
          <div className="bg-white rounded-xl border border-border-soft p-3 shadow-soft">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                <input placeholder="Search suppliers by name, location, category..." className="w-full pl-9 pr-4 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-deep-navy placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />
              </div>
              {["Category", "Location", "Certifications", "More Filters"].map((d) => (
                <button key={d} className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg">
                  {d}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ))}
              <button className="px-3 py-2 text-[13px] text-action-blue font-medium hover:underline">Clear</button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-border-soft shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: "880px" }}>
                <thead>
                  <tr className="bg-soft-bg border-b border-border-soft">
                    {["Supplier", "Category", "Location", "Match Score", "MOQ", "Lead Time", "Certifications", "Performance", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s) => (
                    <tr key={s.name} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                            style={{
                              backgroundColor: `${categoryColor[s.category] ?? "#9AA8B8"}14`,
                              color: categoryColor[s.category] ?? "#9AA8B8",
                              boxShadow: `inset 0 0 0 1px ${categoryColor[s.category] ?? "#9AA8B8"}26`,
                            }}
                          >
                            {s.name.charAt(0)}
                          </div>
                          <Link href="/dashboard/suppliers/SUP-001" className="text-[13px] font-medium text-deep-navy hover:text-action-blue max-w-[150px] leading-tight">
                            {s.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-text-body whitespace-nowrap">{s.category}</td>
                      <td className="px-5 py-3 text-[13px] text-deep-navy whitespace-nowrap"><span className="mr-1">{s.flag}</span>{s.country}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-deep-navy">{s.score}</span>
                          <div className="w-14 h-1.5 rounded-full bg-border-soft overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: scoreColor(s.score) }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-text-body">{s.moq}</td>
                      <td className="px-5 py-3 text-[13px] text-text-body whitespace-nowrap">{s.lead}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          {s.certs.map((c) => (
                            <span key={c} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-action-blue/10 text-action-blue">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3"><PerfRing pct={s.perf} /></td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[12px] font-medium ${statusStyle[s.status]}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusDot[s.status] }} />
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button className="text-text-light hover:text-text-muted p-1 rounded hover:bg-[#F1F5F9]">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft">
              <p className="text-[12px] text-text-muted">Showing 1 to 10 of 487 suppliers</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-light hover:bg-soft-bg">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-md bg-action-blue text-white text-[12px] font-medium">1</button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted text-[12px] hover:bg-soft-bg">2</button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted text-[12px] hover:bg-soft-bg">3</button>
                  <span className="px-1 text-text-light text-[12px]">…</span>
                  <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted text-[12px] hover:bg-soft-bg">49</button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted hover:bg-soft-bg">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <button className="inline-flex items-center gap-1 px-2 py-1 border border-border-soft rounded-md text-[12px] text-text-muted">
                  10 / page
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Categories */}
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
            <h3 className="text-[15px] font-semibold text-deep-navy mb-3">Supplier Categories</h3>
            <div className="relative w-[120px] h-[120px] mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#E6EDF5" strokeWidth="11" />
                {categories.map((c, i) => {
                  const len = (c.pct / 100) * circumference;
                  const el = <circle key={i} cx="50" cy="50" r="38" fill="none" stroke={c.color} strokeWidth="11" strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-(off / 100) * circumference} />;
                  off += c.pct;
                  return el;
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[16px] font-bold text-deep-navy">487</p>
                  <p className="text-[10px] text-text-light">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 mt-4">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-text-muted truncate">{c.name}</span>
                  </div>
                  <span className="font-medium text-deep-navy shrink-0 ml-2">{c.pct}%</span>
                </div>
              ))}
            </div>
            <button className="text-[12px] text-action-blue font-medium mt-3 hover:underline">View all categories →</button>
          </div>

          {/* Top Rated */}
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
            <h3 className="text-[15px] font-semibold text-deep-navy mb-3">Top Rated Suppliers</h3>
            <div className="space-y-3">
              {topRated.map((t, i) => (
                <div key={t.name} className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    i === 0 ? "bg-[#F59E0B]/15 text-[#F59E0B]"
                    : i === 1 ? "bg-[#9AA8B8]/20 text-[#66758C]"
                    : i === 2 ? "bg-[#B45309]/15 text-[#B45309]"
                    : "bg-[#F1F5F9] text-[#66758C]"
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-deep-navy truncate">{t.name}</p>
                    <div className="w-full h-1.5 rounded-full bg-border-soft overflow-hidden mt-1">
                      <div className="h-full rounded-full" style={{ width: `${t.score}%`, backgroundColor: scoreColor(t.score) }} />
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-deep-navy shrink-0">{t.score}</span>
                </div>
              ))}
            </div>
            <button className="text-[12px] text-action-blue font-medium mt-3 hover:underline">View all suppliers →</button>
          </div>

          {/* On-Time chart */}
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
            <h3 className="text-[15px] font-semibold text-deep-navy mb-1">Supplier On-Time Sample Rate</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[22px] font-bold text-deep-navy">95.3%</span>
              <span className="text-[11px] text-teal font-medium flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />2.8%
              </span>
              <span className="text-[11px] text-text-light">vs May 5 – May 11</span>
            </div>
            <div className="h-[90px]">
              <svg viewBox="0 0 200 90" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="otGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0057D8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0057D8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M0,${80 - onTimePts[0]} ${onTimePts.map((v, i) => `L${i * 33},${80 - v}`).join(" ")} L198,80 L0,80 Z`} fill="url(#otGrad)" />
                <polyline fill="none" stroke="#0057D8" strokeWidth="2" points={onTimePts.map((v, i) => `${i * 33},${80 - v}`).join(" ")} />
                {onTimePts.map((v, i) => <circle key={i} cx={i * 33} cy={80 - v} r="2.5" fill="white" stroke="#0057D8" strokeWidth="1.5" />)}
              </svg>
            </div>
            <div className="flex justify-between text-[9px] text-text-light mt-1">
              {onTimeDates.map((d) => <span key={d}>{d}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
