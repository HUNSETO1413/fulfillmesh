"use client";

import { useState } from "react";
import {
  Package,
  Tag,
  AlertTriangle,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  SlidersHorizontal,
  ChevronDown,
  MoreVertical,
  Plus,
  Upload,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Plus as PlusSmall,
} from "lucide-react";

const stats = [
  { title: "Total Products", value: "5,842", change: "6.3%", positive: true, sub: "vs May 5 – May 11", icon: Package, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "Active SKUs", value: "4,968", change: "8.1%", positive: true, sub: "vs May 5 – May 11", icon: Tag, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
  { title: "Low Stock Alerts", value: "128", change: "12.4%", positive: false, sub: "vs May 5 – May 11", icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Avg Margin", value: "32.7%", change: "2.6pp", positive: true, sub: "vs May 5 – May 11", icon: PieIcon, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
];

const categoryPills = [
  { name: "All", count: null },
  { name: "Electronics", count: "1,245" },
  { name: "Home & Kitchen", count: "1,032" },
  { name: "Apparel", count: "987" },
  { name: "Beauty", count: "642" },
  { name: "Sports", count: "413" },
];

const distribution = [
  { name: "Electronics", pct: 28.5, color: "#0057D8" },
  { name: "Home & Kitchen", pct: 22.3, color: "#00B894" },
  { name: "Apparel", pct: 16.9, color: "#7C6FF6" },
  { name: "Beauty", pct: 11.0, color: "#7CB7FF" },
  { name: "Sports", pct: 7.1, color: "#F59E0B" },
  { name: "Other", pct: 14.2, color: "#D9E5F2" },
];

const products = [
  { name: "Wireless Noise Cancelling Headphones", sku: "ELEC-WH-1001", category: "Electronics", catColor: "blue", supplier: "Shenzhen Tech Co.", cost: "$45.20", price: "$99.99", margin: "54.8%", inv: "324", invStatus: "In Stock", img: "/images/photo-1505740420928-5e560c06d30e.jpg" },
  { name: "Smart Countertop Blender", sku: "HOME-BL-2002", category: "Home & Kitchen", catColor: "green", supplier: "Ningbo Homeware", cost: "$28.50", price: "$69.99", margin: "59.2%", inv: "156", invStatus: "In Stock", img: "/images/photo-1570222094114-d054a817e56b.jpg" },
  { name: "Men's Performance Hoodie", sku: "APP-MH-3003", category: "Apparel", catColor: "indigo", supplier: "Guangzhou Apparel", cost: "$14.75", price: "$39.99", margin: "63.1%", inv: "89", invStatus: "Low Stock", img: "/images/photo-1556821840-3a63f95609a7.jpg" },
  { name: "Vitamin C Brightening Serum", sku: "BEAU-VC-4004", category: "Beauty", catColor: "purple", supplier: "Korean Beauty Co.", cost: "$8.90", price: "$24.99", margin: "64.3%", inv: "42", invStatus: "Low Stock", img: "/images/photo-1620916566398-39f1143ab7be.jpg" },
  { name: "Gym Duffle Bag Water Resistant", sku: "SPRT-DB-5005", category: "Sports", catColor: "orange", supplier: "Yiwu Sports Ltd.", cost: "$11.20", price: "$29.99", margin: "62.7%", inv: "215", invStatus: "In Stock", img: "/images/photo-1553062407-98eeb64c6a62.jpg" },
  { name: "Adjustable Phone Stand", sku: "ACCS-PS-6006", category: "Electronics", catColor: "blue", supplier: "Shenzhen Tech Co.", cost: "$3.60", price: "$12.99", margin: "72.3%", inv: "678", invStatus: "In Stock", img: "/images/photo-1583394838336-acd977736f90.jpg" },
  { name: "Stainless Steel Water Bottle", sku: "HOME-WB-7007", category: "Home & Kitchen", catColor: "green", supplier: "Ningbo Homeware", cost: "$6.10", price: "$16.99", margin: "64.1%", inv: "312", invStatus: "In Stock", img: "/images/photo-1602143407151-7111542de6e8.jpg" },
];

const catStyles: Record<string, string> = {
  blue: "bg-[#0057D8]/10 text-[#0057D8]",
  green: "bg-[#00B894]/10 text-[#00B894]",
  indigo: "bg-[#7C6FF6]/10 text-[#7C6FF6]",
  purple: "bg-[#7CB7FF]/10 text-[#3B82F6]",
  orange: "bg-[#F59E0B]/10 text-[#F59E0B]",
};

export default function ProductsPage() {
  const [activePill, setActivePill] = useState("All");

  // build donut segments
  let offset = 0;
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#061A3D]">Products</h1>
          <p className="text-[14px] text-[#4A5A73] mt-0.5">Manage your product catalog, pricing, and inventory across all channels.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F7FAFC]">
            <Calendar className="w-4 h-4" />
            May 12 – May 18, 2025
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-[#E6EDF5] rounded-lg text-[#66758C] hover:bg-[#F7FAFC]">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#0057D8] hover:bg-[#003B7A] rounded-lg text-[13px] font-medium text-white">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E6EDF5] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#66758C]">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#061A3D] leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {s.positive ? <ArrowUpRight className="w-3.5 h-3.5 text-[#00B894]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
                <span className={`text-[12px] font-medium ${s.positive ? "text-[#00B894]" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-[#9AA8B8]">{s.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters + Category distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Filters card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E6EDF5] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA8B8]" />
              <input
                placeholder="Search products, SKUs, or suppliers..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] text-[#061A3D] placeholder:text-[#9AA8B8] focus:outline-none focus:ring-2 focus:ring-[#0057D8]/20 focus:border-[#0057D8]"
              />
            </div>
            <button className="w-9 h-9 shrink-0 flex items-center justify-center border border-[#E6EDF5] rounded-lg text-[#66758C] hover:bg-[#F7FAFC]">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {["All Categories", "All Suppliers", "Status"].map((d) => (
              <button key={d} className="inline-flex items-center gap-2 px-3 py-2 border border-[#E6EDF5] rounded-lg text-[13px] text-[#66758C] hover:bg-[#F7FAFC]">
                {d}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            ))}
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-[#E6EDF5] rounded-lg text-[13px] text-[#66758C] hover:bg-[#F7FAFC]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              More Filters
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {categoryPills.map((p) => (
              <button
                key={p.name}
                onClick={() => setActivePill(p.name)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium border transition-colors ${
                  activePill === p.name
                    ? "bg-[#0057D8]/10 border-[#0057D8]/30 text-[#0057D8]"
                    : "bg-white border-[#E6EDF5] text-[#66758C] hover:bg-[#F7FAFC]"
                }`}
              >
                {p.name}
                {p.count && <span className="text-[11px] text-[#9AA8B8] bg-[#F1F5F9] px-1.5 rounded">{p.count}</span>}
              </button>
            ))}
            <button className="w-6 h-6 flex items-center justify-center rounded-md border border-[#E6EDF5] text-[#66758C]">
              <PlusSmall className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="text-[14px] font-semibold text-[#061A3D] mb-4">Category Distribution</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-[120px] h-[120px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#D9E5F2" strokeWidth="12" />
                {distribution.map((d, i) => {
                  const len = (d.pct / 100) * circumference;
                  const dash = `${len} ${circumference - len}`;
                  const el = (
                    <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={d.color} strokeWidth="12" strokeLinecap="butt" strokeDasharray={dash} strokeDashoffset={-(offset / 100) * circumference} />
                  );
                  offset += d.pct;
                  return el;
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[10px] text-[#9AA8B8]">Total</p>
                  <p className="text-[16px] font-bold text-[#061A3D]">5,842</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {distribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-[#66758C] truncate">{d.name}</span>
                  </div>
                  <span className="font-medium text-[#061A3D] shrink-0 ml-2">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6EDF5]">
          <h3 className="text-[14px] font-semibold text-[#061A3D]">Product Catalog</h3>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#66758C] hover:bg-[#F7FAFC] transition-colors">
              <Upload className="w-4 h-4" />
              Import Catalog
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 bg-[#0057D8] hover:bg-[#003B7A] text-white rounded-lg text-[13px] font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7FAFC] border-b border-[#E6EDF5]">
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Product</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">SKU</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Category</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Supplier</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Unit Cost</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Selling Price</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Margin</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Inventory</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Status</th>
                <th className="text-right text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.sku} className="border-b border-[#E6EDF5] last:border-b-0 hover:bg-[#F7FAFC]/60 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F7FAFC] border border-[#E6EDF5] overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <a href="/dashboard/products/PRD-001" className="text-[13px] font-medium text-[#061A3D] hover:text-[#0057D8] leading-tight max-w-[200px]">
                        {p.name}
                      </a>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-[#4A5A73] font-mono whitespace-nowrap">{p.sku}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[12px] font-medium ${catStyles[p.catColor]}`}>{p.category}</span>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-[#4A5A73] whitespace-nowrap">{p.supplier}</td>
                  <td className="px-5 py-3 text-[13px] text-[#4A5A73] whitespace-nowrap">{p.cost}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-[#061A3D] whitespace-nowrap">{p.price}</td>
                  <td className="px-5 py-3 text-[13px] font-medium text-[#00B894] whitespace-nowrap">{p.margin}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="text-[13px] font-medium text-[#061A3D]">{p.inv}</div>
                    <div className={`text-[11px] ${p.invStatus === "Low Stock" ? "text-[#F59E0B] font-medium" : "text-[#9AA8B8]"}`}>{p.invStatus}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] font-medium rounded-md bg-[#00B894]/10 text-[#00B894]">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-[#9AA8B8] hover:text-[#66758C] p-1 rounded hover:bg-[#F1F5F9]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E6EDF5]">
          <p className="text-[12px] text-[#66758C]">Showing 1 to 7 of 5,842 products</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E6EDF5] text-[#9AA8B8] hover:bg-[#F7FAFC]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md bg-[#0057D8] text-white text-[12px] font-medium">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E6EDF5] text-[#66758C] text-[12px] hover:bg-[#F7FAFC]">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E6EDF5] text-[#66758C] text-[12px] hover:bg-[#F7FAFC]">3</button>
              <span className="px-1 text-[#9AA8B8] text-[12px]">…</span>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E6EDF5] text-[#66758C] text-[12px] hover:bg-[#F7FAFC]">835</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E6EDF5] text-[#66758C] hover:bg-[#F7FAFC]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="inline-flex items-center gap-1 px-2 py-1 border border-[#E6EDF5] rounded-md text-[12px] text-[#66758C]">
              10 / page
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
