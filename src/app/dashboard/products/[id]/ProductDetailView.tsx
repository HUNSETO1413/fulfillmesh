"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Package, Box, Boxes, ArrowUpRight,
  ShieldCheck, ClipboardCheck, BadgeCheck, Search as SearchIcon,
} from "lucide-react";
import type { Product } from "@/types";
import { useToast } from "@/components/dashboard/Toast";
import { formatCurrency, formatNumber } from "@/lib/format";
import ProductDetailActions from "./ProductDetailActions";

const specs: { label: string; value: string; good?: boolean; flag?: string }[] = [
  { label: "Material", value: "Stainless Steel (304)" },
  { label: "Capacity", value: "750 ml" },
  { label: "Color", value: "Matte Silver" },
  { label: "Lid Type", value: "Screw-on Sport Cap" },
  { label: "Insulation", value: "Double-Wall Vacuum" },
  { label: "BPA Free", value: "Yes", good: true },
  { label: "Dishwasher Safe", value: "Yes", good: true },
  { label: "Leak Proof", value: "Yes", good: true },
  { label: "Net Weight", value: "0.35 kg" },
  { label: "Country of Origin", value: "China", flag: "🇨🇳" },
  { label: "Manufactured In", value: "Shenzhen, CN", flag: "🇨🇳" },
  { label: "HS Code", value: "9617.00.0000" },
  { label: "Warranty", value: "12 months" },
];

const inventory = [
  { wh: "Los Angeles, CA", onHand: "3,250", committed: "450", available: "2,800" },
  { wh: "Dallas, TX", onHand: "2,150", committed: "320", available: "1,830" },
  { wh: "Chicago, IL", onHand: "1,640", committed: "210", available: "1,430" },
  { wh: "Atlanta, GA", onHand: "890", committed: "140", available: "750" },
  { wh: "New York, NY", onHand: "502", committed: "125", available: "377" },
];

const shipping = [
  { name: "Standard (Ocean)", time: "20–30 days", cost: "$1.25 / unit" },
  { name: "Express (Air)", time: "5–7 days", cost: "$3.85 / unit" },
  { name: "Air Express", time: "2–3 days", cost: "$6.45 / unit" },
  { name: "Door-to-Door", time: "7–10 days", cost: "$4.10 / unit" },
];

const packaging = [
  { name: "Default Box", per: "24 units / box", dim: "31 x 23 x 26 cm" },
  { name: "Retail Box", per: "1 unit / box", dim: "8 x 8 x 26 cm" },
  { name: "Bulk Pack", per: "48 units / box", dim: "47 x 31 x 28 cm" },
];

const quality = [
  { title: "Incoming Inspection", desc: "AQL 1.5 for critical defects", icon: SearchIcon },
  { title: "In-Process Check", desc: "Visual check every 50 units", icon: ClipboardCheck },
  { title: "Final Inspection", desc: "100% functional test", icon: ShieldCheck },
  { title: "Certifications", desc: "FDA, LFGB, BPA Free", icon: BadgeCheck },
];

const orders = [
  { id: "ORD-10458", customer: "Acme Retail", status: "Delivered", qty: "1,200", date: "May 16, 2025" },
  { id: "ORD-10457", customer: "Summit Goods", status: "In Transit", qty: "800", date: "May 16, 2025" },
  { id: "ORD-10456", customer: "Peak Supplies", status: "Processing", qty: "1,000", date: "May 15, 2025" },
  { id: "ORD-10455", customer: "Global Mart", status: "Confirmed", qty: "600", date: "May 15, 2025" },
  { id: "ORD-10454", customer: "Urban Needs", status: "Processing", qty: "500", date: "May 14, 2025" },
];

const orderStatusStyle: Record<string, { bg: string; text: string }> = {
  "Delivered": { bg: "#00B8941A", text: "#00B894" },
  "In Transit": { bg: "#0057D81A", text: "#0057D8" },
  "Processing": { bg: "#F59E0B1A", text: "#F59E0B" },
  "Confirmed": { bg: "#7C6FF61A", text: "#7C6FF6" },
};

const tabs = ["Overview", "Specifications", "Inventory", "Shipping", "Packaging", "Quality", "Orders", "Performance"];

const unitsPts = [50, 38, 55, 48, 60, 52, 68, 58, 72];
const revenuePts = [62, 50, 66, 60, 72, 64, 78, 70, 84];

// Maps a tab to the section id it should reveal/scroll to.
const tabAnchors: Record<string, string> = {
  Specifications: "specs",
  Inventory: "inventory",
  Shipping: "shipping",
  Packaging: "packaging",
  Quality: "quality",
  Orders: "recent-orders",
  Performance: "performance",
};

function Field({ label, value, mono, link, green }: { label: string; value: string; mono?: boolean; link?: boolean; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[#94A3B8]">{label}</span>
      <span
        className={`text-[12px] font-medium ${mono ? "font-mono" : ""}`}
        style={{ color: link ? "#3B82F6" : green ? "#00B894" : "#1E293B" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function ProductDetailView({ product }: { product: Product }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("Overview");

  function selectTab(t: string) {
    setActiveTab(t);
    const anchor = tabAnchors[t];
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const margin = product.cost != null && product.price > 0
    ? `${(((product.price - product.cost) / product.price) * 100).toFixed(1)}%`
    : "—";

  const supplierHref = "/dashboard/suppliers";

  const metricCards = [
    { label: "On Hand", value: formatNumber(product.stock), unit: "units", icon: Box, color: "#0057D8", bg: "#0057D81A" },
    { label: "Reorder Point", value: "1,500", unit: "units", icon: Boxes, color: "#7C6FF6", bg: "#7C6FF61A" },
    { label: "Days of Supply", value: "28", unit: "days", icon: Package, color: "#F59E0B", bg: "#F59E0B1A" },
    { label: "Committed", value: "1,245", unit: "units", icon: Boxes, color: "#00B894", bg: "#00B8941A" },
  ];

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div>
        <Link href="/dashboard/products" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#1E293B] mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#1E293B]">Product Detail</h1>
            <p className="text-[14px] text-[#64748B] mt-0.5">View and manage product information, inventory, and performance.</p>
          </div>
          <ProductDetailActions product={product} />
        </div>
      </div>

      {/* Main info + metric cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex gap-5">
            {/* Gallery */}
            <div className="flex flex-col gap-2 shrink-0">
              {["#3B82F6", "#6366F1", "#8B5CF6"].map((color, i) => (
                <div key={i} className={`w-12 h-12 rounded-lg border flex items-center justify-center overflow-hidden ${i === 0 ? "border-[#3B82F6] ring-1 ring-[#3B82F6]/30" : "border-[#E2E8F0]"}`}>
                  <div className="w-full h-full flex items-center justify-center text-[14px] font-bold text-white" style={{ backgroundColor: color }}>FM</div>
                </div>
              ))}
            </div>
            <div className="w-28 h-32 rounded-lg border border-[#E2E8F0] flex items-center justify-center shrink-0 overflow-hidden bg-[#3B82F6]">
              <span className="text-[24px] font-bold text-white">FM</span>
            </div>
            {/* Fields */}
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-bold text-[#1E293B]">{product.name}</h2>
              <div className="grid grid-cols-2 gap-x-8 mt-4">
                <div className="space-y-2.5">
                  <Field label="SKU" value={product.sku} mono />
                  <Field label="Category" value={product.category} />
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#94A3B8]">Supplier</span>
                    <Link href={supplierHref} className="text-[12px] font-medium hover:underline" style={{ color: "#3B82F6" }}>{product.supplier ?? "—"}</Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#94A3B8]">Status</span>
                    <span className="inline-flex px-2 py-0.5 rounded text-[12px] font-medium" style={{ backgroundColor: "#00B8941A", color: "#00B894" }}>{product.status}</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Field label="Unit Cost" value={product.cost != null ? formatCurrency(product.cost) : "—"} />
                  <Field label="Selling Price" value={formatCurrency(product.price)} />
                  <Field label="Margin" value={margin} green />
                  <Field label="Weight" value="0.35 kg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric cards 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {metricCards.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-[#64748B]">{m.label}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.bg }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                  </div>
                </div>
                <p className="text-[22px] font-bold text-[#1E293B] leading-none">{m.value}</p>
                <p className="text-[11px] text-[#94A3B8] mt-1">{m.unit}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] px-5">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => selectTab(t)} className={`py-3 text-[13px] font-medium whitespace-nowrap border-b-2 ${t === activeTab ? "text-[#3B82F6] border-[#3B82F6]" : "text-[#64748B] border-transparent hover:text-[#1E293B]"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Row: Specifications / Inventory / Shipping+Packaging */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Specifications */}
        <div id="specs" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-4">
          <h3 className="text-[14px] font-semibold text-[#1E293B] mb-4">Specifications</h3>
          <div className="space-y-2.5">
            {specs.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748B]">{s.label}</span>
                {s.good ? (
                  <span className="inline-flex items-center gap-1 font-medium" style={{ color: "#00B894" }}><BadgeCheck className="w-3.5 h-3.5" />{s.value}</span>
                ) : s.flag ? (
                  <span className="inline-flex items-center gap-1.5 text-[#1E293B] font-medium"><span className="text-[13px] leading-none">{s.flag}</span>{s.value}</span>
                ) : (
                  <span className="text-[#1E293B] font-medium">{s.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Inventory by Warehouse */}
        <div id="inventory" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Inventory by Warehouse</h3>
            <Link href="/dashboard/inventory" className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-4 text-[11px] text-[#94A3B8] uppercase tracking-wide pb-2 border-b border-[#E2E8F0]">
            <span className="col-span-1">Warehouse</span>
            <span className="text-right">On Hand</span>
            <span className="text-right">Committed</span>
            <span className="text-right">Available</span>
          </div>
          {inventory.map((r) => (
            <div key={r.wh} className="grid grid-cols-4 text-[12px] py-2 border-b border-[#F1F5F9]">
              <span className="text-[#1E293B] truncate">{r.wh}</span>
              <span className="text-right text-[#64748B]">{r.onHand}</span>
              <span className="text-right text-[#64748B]">{r.committed}</span>
              <span className="text-right font-medium" style={{ color: "#00B894" }}>{r.available}</span>
            </div>
          ))}
          <div className="grid grid-cols-4 text-[12px] py-2 font-semibold">
            <span className="text-[#1E293B]">Total</span>
            <span className="text-right text-[#1E293B]">8,432</span>
            <span className="text-right text-[#1E293B]">1,245</span>
            <span className="text-right" style={{ color: "#00B894" }}>7,187</span>
          </div>
        </div>

        {/* Shipping + Packaging */}
        <div className="space-y-5">
          <div id="shipping" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Shipping Options</h3>
              <button onClick={() => toast("Showing all shipping options")} className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all</button>
            </div>
            <div className="space-y-2.5">
              {shipping.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-[12px]">
                  <span className="text-[#1E293B] font-medium">{s.name}</span>
                  <span className="text-[#94A3B8] mx-2 flex-1 text-right pr-3">{s.time}</span>
                  <span className="text-[#64748B] whitespace-nowrap">{s.cost}</span>
                </div>
              ))}
            </div>
          </div>
          <div id="packaging" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Packaging Options</h3>
              <button onClick={() => toast("Showing all packaging options")} className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all</button>
            </div>
            <div className="space-y-2.5">
              {packaging.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-[12px]">
                  <div>
                    <p className="text-[#1E293B] font-medium">{p.name}</p>
                    <p className="text-[#94A3B8]">{p.per}</p>
                  </div>
                  <span className="text-[#64748B] whitespace-nowrap">{p.dim}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row: Quality / Recent Orders / Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quality Rules */}
        <div id="quality" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-4">
          <h3 className="text-[14px] font-semibold text-[#1E293B] mb-4">Quality Rules</h3>
          <div className="space-y-4">
            {quality.map((q) => {
              const Icon = q.icon;
              return (
                <div key={q.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#1E293B]">{q.title}</p>
                    <p className="text-[12px] text-[#94A3B8]">{q.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div id="recent-orders" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-12 text-[11px] text-[#94A3B8] uppercase tracking-wide pb-2 border-b border-[#E2E8F0]">
            <span className="col-span-4">Order ID</span>
            <span className="col-span-4">Status</span>
            <span className="col-span-2 text-right">Qty</span>
            <span className="col-span-2 text-right">Date</span>
          </div>
          {orders.map((o) => (
            <Link key={o.id} href={`/dashboard/orders/${o.id}`} className="grid grid-cols-12 items-center text-[12px] py-2.5 border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC] -mx-1 px-1 rounded">
              <div className="col-span-4">
                <p className="text-[#1E293B] font-medium font-mono text-[11px]">{o.id}</p>
                <p className="text-[#94A3B8] text-[11px]">{o.customer}</p>
              </div>
              <div className="col-span-4">
                <span
                  className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium"
                  style={{ backgroundColor: orderStatusStyle[o.status].bg, color: orderStatusStyle[o.status].text }}
                >
                  {o.status}
                </span>
              </div>
              <span className="col-span-2 text-right text-[#64748B]">{o.qty}</span>
              <span className="col-span-2 text-right text-[#94A3B8] text-[11px]">{o.date}</span>
            </Link>
          ))}
        </div>

        {/* Performance Trends */}
        <div id="performance" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Performance Trends</h3>
            <span className="text-[11px] text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">Last 30 days</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { l: "Units Sold", v: "6,842", c: "+12.4%" },
              { l: "Revenue", v: "$88,941", c: "+9.8%" },
              { l: "Gross Margin", v: "58.0%", c: "+2.6%" },
            ].map((m) => (
              <div key={m.l}>
                <p className="text-[10px] text-[#94A3B8]">{m.l}</p>
                <p className="text-[15px] font-bold text-[#1E293B]">{m.v}</p>
                <p className="text-[10px] font-medium flex items-center gap-0.5" style={{ color: "#00B894" }}><ArrowUpRight className="w-3 h-3" />{m.c}</p>
              </div>
            ))}
          </div>
          <div className="h-[120px]">
            <svg viewBox="0 0 296 120" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="perfRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3B82F6" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="perfUnits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#00B894" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#00B894" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="0" y1={i * 30 + 5} x2="296" y2={i * 30 + 5} stroke="#F1F5F9" strokeWidth="1" />
              ))}
              {/* Area fills */}
              <polygon fill="url(#perfRevenue)" points={`0,110 ${revenuePts.map((v, i) => `${i * 37},${110 - v}`).join(" ")} 296,110`} />
              <polygon fill="url(#perfUnits)" points={`0,110 ${unitsPts.map((v, i) => `${i * 37},${110 - v}`).join(" ")} 296,110`} />
              {/* Lines */}
              <polyline fill="none" stroke="#3B82F6" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" points={revenuePts.map((v, i) => `${i * 37},${110 - v}`).join(" ")} />
              <polyline fill="none" stroke="#00B894" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" points={unitsPts.map((v, i) => `${i * 37},${110 - v}`).join(" ")} />
              {revenuePts.map((v, i) => <circle key={`r${i}`} cx={i * 37} cy={110 - v} r="2.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />)}
              {unitsPts.map((v, i) => <circle key={`u${i}`} cx={i * 37} cy={110 - v} r="2.5" fill="#FFFFFF" stroke="#00B894" strokeWidth="1.5" />)}
            </svg>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3B82F6]" />Units Sold</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#00B894" }} />Revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
}
