"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Calendar,
  Bell,
  Plus,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
} from "lucide-react";

type CustomerType = "Retail" | "Wholesale" | "Distributor";
type CustomerStatus = "Active" | "Pending" | "Inactive";

const stats = [
  { title: "Total Customers", value: "124", change: "12.4%", icon: Users, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "Active Customers", value: "98", change: "8.2%", icon: CheckCircle2, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
  { title: "Pending Approval", value: "14", change: "3.1%", icon: Clock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "New This Month", value: "18", change: "15.7%", icon: ArrowUpRight, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
];

const tabs = ["All Customers", "Active", "Pending", "Inactive"];

const tabCounts: Record<string, number> = {
  "All Customers": 124,
  "Active": 98,
  "Pending": 14,
  "Inactive": 12,
};

const customers: {
  id: string;
  name: string;
  type: CustomerType;
  email: string;
  location: string;
  status: CustomerStatus;
}[] = [
  { id: "CUST-1001", name: "Acme Retail", type: "Retail", email: "orders@acmeretail.com", location: "Los Angeles, CA", status: "Active" },
  { id: "CUST-1002", name: "Summit Goods", type: "Retail", email: "hello@summitgoods.com", location: "Dallas, TX", status: "Active" },
  { id: "CUST-1003", name: "Peak Supplies", type: "Wholesale", email: "info@peaksupplies.com", location: "Chicago, IL", status: "Active" },
  { id: "CUST-1004", name: "Blue Ridge Co.", type: "Wholesale", email: "sales@blueridgeco.com", location: "Atlanta, GA", status: "Active" },
  { id: "CUST-1005", name: "Northwind Traders", type: "Distributor", email: "contact@northwind.com", location: "New York, NY", status: "Active" },
  { id: "CUST-1006", name: "Urban Outfitters", type: "Retail", email: "support@urbanoutfitters.com", location: "Philadelphia, PA", status: "Active" },
  { id: "CUST-1007", name: "Coastal Wholesale", type: "Wholesale", email: "info@coastalwholesale.com", location: "Miami, FL", status: "Pending" },
  { id: "CUST-1008", name: "Evergreen Distributors", type: "Distributor", email: "orders@evergreen.com", location: "Seattle, WA", status: "Active" },
  { id: "CUST-1009", name: "Frontier Retail", type: "Retail", email: "hello@frontierretail.com", location: "Denver, CO", status: "Inactive" },
  { id: "CUST-1010", name: "Global Supply Co.", type: "Wholesale", email: "sales@globalsupply.com", location: "Houston, TX", status: "Active" },
];

const typeColor: Record<CustomerType, string> = {
  Retail: "#0057D8",
  Wholesale: "#7C6FF6",
  Distributor: "#F59E0B",
};

function TypeBadge({ type }: { type: CustomerType }) {
  const color = typeColor[type];
  return (
    <span
      className="inline-flex px-2 py-0.5 text-[12px] font-medium rounded-md"
      style={{
        backgroundColor: `${color}14`,
        color,
        boxShadow: `inset 0 0 0 1px ${color}26`,
      }}
    >
      {type}
    </span>
  );
}

const statusStyles: Record<CustomerStatus, { bg: string; text: string; dot: string }> = {
  Active: { bg: "bg-[#00B894]/10", text: "text-[#00B894]", dot: "#00B894" },
  Pending: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", dot: "#F59E0B" },
  Inactive: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", dot: "#EF4444" },
};

function StatusBadge({ status }: { status: CustomerStatus }) {
  const s = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] font-medium rounded-md ${s.bg} ${s.text}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  );
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Customers");

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    if (activeTab !== "All Customers" && c.status !== activeTab) return false;
    return (
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-deep-navy">Customers</h1>
          <p className="text-[14px] text-text-body mt-0.5">View and manage your customers.</p>
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
              onClick={() => setActiveTab(t)}
              className={`px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                activeTab === t
                  ? "text-action-blue bg-action-blue/10"
                  : "text-text-muted hover:bg-[#F1F5F9]"
              }`}
            >
              {t}
              <span className={`ml-1.5 text-[11px] ${
                activeTab === t ? "text-action-blue/70" : "text-text-light"
              }`}>
                {tabCounts[t]}
              </span>
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
            Add Customer
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-border-soft p-3 shadow-soft">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <input
              type="text"
              placeholder="Search customers by ID, name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-deep-navy placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue"
            />
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg">
            <Filter className="w-3.5 h-3.5" />
            Filters
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg">
            All Types
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg">
            All Time
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border-soft shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "780px" }}>
            <thead>
              <tr className="bg-soft-bg border-b border-border-soft">
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Customer ID</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Customer Name</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Type</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Email</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Location</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const initialColor = typeColor[c.type];
                return (
                  <tr key={c.id} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/dashboard/customers/${c.id}`} className="text-[13px] font-semibold text-action-blue hover:underline font-mono">
                        {c.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                          style={{
                            backgroundColor: `${initialColor}14`,
                            color: initialColor,
                            boxShadow: `inset 0 0 0 1px ${initialColor}26`,
                          }}
                        >
                          {c.name.charAt(0)}
                        </div>
                        <span className="text-[13px] font-medium text-deep-navy">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3"><TypeBadge type={c.type} /></td>
                    <td className="px-5 py-3 text-[13px] text-text-body">{c.email}</td>
                    <td className="px-5 py-3 text-[13px] text-text-body">{c.location}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-text-light hover:text-text-muted p-1 rounded hover:bg-[#F1F5F9]">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft">
          <p className="text-[12px] text-text-muted">Showing 1 to 10 of 124 customers</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-light hover:bg-soft-bg">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md bg-action-blue text-white text-[12px] font-medium">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted text-[12px] hover:bg-soft-bg">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted text-[12px] hover:bg-soft-bg">3</button>
              <span className="px-1 text-text-light text-[12px]">…</span>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted text-[12px] hover:bg-soft-bg">13</button>
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
  );
}
