"use client";

import Link from "next/link";
import {
  ShoppingBag, DollarSign, CheckCircle2, Package,
  ArrowUpRight, ArrowDownRight, Calendar, ChevronDown, MoreVertical,
} from "lucide-react";

const stats = [
  { title: "Total Orders", value: "12,842", change: "+8.5%", positive: true, period: "vs Last 7 days", icon: ShoppingBag, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { title: "Total Shipments", value: "11,205", change: "+7.2%", positive: true, period: "vs Last 7 days", icon: Package, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { title: "On-Time Delivery", value: "97.4%", change: "+2.1%", positive: true, period: "vs Last 7 days", icon: CheckCircle2, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { title: "Total Revenue", value: "$1.62M", change: "+10.3%", positive: true, period: "vs Last 7 days", icon: DollarSign, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
];

const recentOrders = [
  { id: "ORD-10458", customer: "Acme Retail", status: "Delivered", shipDate: "May 16, 2025", deliveryDate: "May 19, 2025", total: "$4,285.00" },
  { id: "ORD-10457", customer: "Summit Goods", status: "In Transit", shipDate: "May 16, 2025", deliveryDate: "May 20, 2025", total: "$2,150.75" },
  { id: "ORD-10456", customer: "Peak Supplies", status: "Processing", shipDate: "May 15, 2025", deliveryDate: "May 19, 2025", total: "$1,980.50" },
  { id: "ORD-10455", customer: "Beta Imports", status: "Delivered", shipDate: "May 14, 2025", deliveryDate: "May 17, 2025", total: "$3,420.00" },
  { id: "ORD-10454", customer: "Gamma Corp", status: "Pending", shipDate: "May 14, 2025", deliveryDate: "May 18, 2025", total: "$890.25" },
];

const shippingLocations = [
  { name: "Los Angeles, CA", pct: 28.4, color: "#3B82F6" },
  { name: "Chicago, IL", pct: 14.3, color: "#10B981" },
  { name: "Atlanta, GA", pct: 12.5, color: "#F59E0B" },
  { name: "New York, NY", pct: 9.8, color: "#EF4444" },
  { name: "Houston, TX", pct: 7.5, color: "#8B5CF6" },
  { name: "Other", pct: 27.5, color: "#94A3B8" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Delivered": "bg-[#D1FAE5] text-[#065F46]",
    "In Transit": "bg-[#DBEAFE] text-[#1E40AF]",
    "Processing": "bg-[#EDE9FE] text-[#5B21B6]",
    "Pending": "bg-[#FEF3C7] text-[#92400E]",
    "Cancelled": "bg-[#FEE2E2] text-[#991B1B]",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[status] || "bg-[#F1F5F9] text-[#475569]"}`}>
      {status}
    </span>
  );
}

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[#1E293B]">Overview</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">Welcome back! Here&apos;s what&apos;s happening with your operations.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0">
          <Calendar className="w-4 h-4 text-[#64748B]" />
          May 12 – May 18, 2025
          <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[13px] font-medium text-[#64748B]">{stat.title}</span>
                <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] leading-none font-bold text-[#1E293B]">{stat.value}</p>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[12px] font-semibold ${
                    stat.positive ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  {stat.positive
                    ? <ArrowUpRight className="w-3 h-3" />
                    : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
                <span className="text-[12px] text-[#94A3B8]">{stat.period}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Line Chart - Orders Over Time */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Orders Over Time</h3>
            <button className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
              Daily <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>
          <div className="h-[200px]">
            <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="40" y1={i * 40 + 10} x2="490" y2={i * 40 + 10} stroke="#F1F5F9" strokeWidth="1" />
              ))}
              {/* Y-axis labels */}
              <text x="35" y="18" textAnchor="end" className="text-[9px]" fill="#94A3B8">14K</text>
              <text x="35" y="58" textAnchor="end" className="text-[9px]" fill="#94A3B8">10.5K</text>
              <text x="35" y="98" textAnchor="end" className="text-[9px]" fill="#94A3B8">7K</text>
              <text x="35" y="138" textAnchor="end" className="text-[9px]" fill="#94A3B8">3.5K</text>
              <text x="35" y="178" textAnchor="end" className="text-[9px]" fill="#94A3B8">0</text>
              {/* Smooth area fill */}
              <path
                d="M50,138 C84,131 96,122 130,124 C164,126 156,98 190,102 C224,106 226,82 260,84 C294,86 296,62 330,62 C364,62 376,72 410,66 C444,60 456,48 490,46 L490,180 L50,180 Z"
                fill="url(#areaGrad)"
              />
              {/* Smooth line */}
              <path
                d="M50,138 C84,131 96,122 130,124 C164,126 156,98 190,102 C224,106 226,82 260,84 C294,86 296,62 330,62 C364,62 376,72 410,66 C444,60 456,48 490,46"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Endpoint marker */}
              <circle cx="490" cy="46" r="3.5" fill="white" stroke="#3B82F6" strokeWidth="2.5" />
              {/* X-axis labels (selected period) */}
              {["May 12","May 13","May 14","May 15","May 16","May 17","May 18"].map((label, i) => (
                <text key={i} x={50 + i * 73.3} y="196" textAnchor="middle" className="text-[8px]" fill="#94A3B8">{label}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Donut Chart - Top Shipping Locations */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Top Shipping Locations</h3>
            <span className="text-[12px] text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md">All Time</span>
          </div>
          <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="relative w-[160px] h-[160px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {shippingLocations.map((loc, i) => {
                  const offset = shippingLocations.slice(0, i).reduce((s, l) => s + l.pct, 0);
                  const dashArray = `${loc.pct * 2.51327} ${251.327 - loc.pct * 2.51327}`;
                  return (
                    <circle key={i} cx="50" cy="50" r="40" fill="none"
                      stroke={loc.color} strokeWidth="12" strokeDasharray={dashArray} strokeDashoffset={-offset * 2.51327}
                      strokeLinecap="round" />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#1E293B]">12,842</p>
                  <p className="text-[10px] text-[#64748B]">Total</p>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2.5">
              {shippingLocations.map((loc, i) => (
                <div key={i} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: loc.color }} />
                    <span className="text-[#475569] truncate">{loc.name}</span>
                  </div>
                  <span className="font-medium text-[#1E293B] shrink-0 ml-2">{loc.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-[16px] font-semibold text-[#1E293B]">Recent Orders</h3>
          <Link href="/dashboard/orders" className="text-[13px] font-medium text-[#3B82F6] border border-[#E2E8F0] rounded-lg px-3 py-1.5 hover:bg-[#F8FAFC] transition-colors">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Order ID</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Customer</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Status</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Ship Date</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Delivery Date</th>
                <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Total</th>
                <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B]">{order.id}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#1E293B]">{order.customer}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{order.shipDate}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{order.deliveryDate}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#1E293B] font-medium">{order.total}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-[#94A3B8] hover:text-[#64748B]"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
        <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { time: "2 min ago", text: "Order ORD-1006 received from Zeta Global", dot: "bg-[#3B82F6]" },
            { time: "15 min ago", text: "Shipment FM-SHIP-201 dispatched to Miami, FL", dot: "bg-[#10B981]" },
            { time: "1 hour ago", text: "QC inspection passed for Supplier #S-045", dot: "bg-[#10B981]" },
            { time: "3 hours ago", text: "Inventory alert: SKU-8834 below reorder point", dot: "bg-[#F59E0B]" },
            { time: "5 hours ago", text: "New supplier Epsilon Manufacturing added to network", dot: "bg-[#8B5CF6]" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className={`w-2 h-2 rounded-full ${item.dot} shrink-0`} />
              <span className="text-[13px] text-[#1E293B] flex-1">{item.text}</span>
              <span className="text-[12px] text-[#94A3B8] shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
