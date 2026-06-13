"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, ShieldCheck, Star, FileText, ClipboardCheck, Award,
  MapPin, CheckCircle, TrendingDown,
} from "lucide-react";
import type { Supplier } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, NumberInput, TextArea, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";
import { formatNumber } from "@/lib/format";
import SupplierDetailActions from "./SupplierDetailActions";

const keyStrengths = [
  "High-volume production capacity",
  "ISO 9001 certified",
  "24/7 customer support",
];

const productCategories = [
  { name: "Electronics", pct: "45%" },
  { name: "Plastics", pct: "30%" },
  { name: "Metals", pct: "20%" },
  { name: "Textiles", pct: "5%" },
];

const certifications = ["ISO 9001:2015", "RoHS Compliance", "CE Mark"];

const radar = [
  { label: "Quality", value: 9 },
  { label: "Delivery", value: 8 },
  { label: "Cost", value: 7 },
  { label: "Service", value: 8 },
  { label: "Innovation", value: 7 },
];

const performanceMetrics = [
  { label: "On-Time Delivery", value: "99%", color: "text-[#10B981]" },
  { label: "Defect Rate", value: "0.5%", color: "text-[#EF4444]" },
  { label: "Lead Time", value: "7 days", color: "text-[#3B82F6]" },
  { label: "Response Time", value: "2 hours", color: "text-[#10B981]" },
];

const qualityHistory = [
  { month: "Jan", value: 1.2 },
  { month: "Feb", value: 1.0 },
  { month: "Mar", value: 1.1 },
  { month: "Apr", value: 0.9 },
  { month: "May", value: 0.8 },
  { month: "Jun", value: 0.7 },
  { month: "Jul", value: 0.8 },
  { month: "Aug", value: 0.6 },
  { month: "Sep", value: 0.7 },
  { month: "Oct", value: 0.5 },
  { month: "Nov", value: 0.6 },
  { month: "Dec", value: 0.5 },
];

const sampleHistory = [
  { date: "2024-05-10", id: "SMP-001", product: "Circuit Board", status: "Approved", result: "Pass" },
  { date: "2024-05-05", id: "SMP-002", product: "Plastic Housing", status: "Pending", result: "—" },
  { date: "2024-04-28", id: "SMP-003", product: "Metal Component", status: "Rejected", result: "Fail" },
];

const quoteHistory = [
  { date: "2024-05-12", id: "QTE-001", product: "LED Display", quantity: "500", price: "$12,500", status: "Accepted" },
  { date: "2024-05-08", id: "QTE-002", product: "Battery Pack", quantity: "1,000", price: "$25,000", status: "Pending" },
  { date: "2024-05-01", id: "QTE-003", product: "Connector", quantity: "2,000", price: "$18,000", status: "Rejected" },
];

const recentOrders = [
  { id: "ORD-001", date: "2024-05-14", product: "Smartphone Case", quantity: "1,000", status: "Shipped", total: "$8,000" },
  { id: "ORD-002", date: "2024-05-13", product: "USB Cable", quantity: "5,000", status: "Processing", total: "$15,000" },
  { id: "ORD-003", date: "2024-05-10", product: "Charger", quantity: "2,000", status: "Delivered", total: "$12,000" },
];

const recentActivities = [
  { date: "2024-05-15", activity: "Quote Request", user: "John Doe", status: "Sent" },
  { date: "2024-05-14", activity: "Order Shipment", user: "Jane Smith", status: "Completed" },
  { date: "2024-05-13", activity: "Sample Approval", user: "Mike Johnson", status: "Approved" },
];

const statusStyle: Record<string, string> = {
  Approved: "bg-[#10B981]/10 text-[#10B981]",
  Pending: "bg-[#F59E0B]/10 text-[#F59E0B]",
  Rejected: "bg-[#EF4444]/10 text-[#EF4444]",
  Accepted: "bg-[#10B981]/10 text-[#10B981]",
  Shipped: "bg-[#3B82F6]/10 text-[#3B82F6]",
  Processing: "bg-[#F59E0B]/10 text-[#F59E0B]",
  Delivered: "bg-[#10B981]/10 text-[#10B981]",
  Sent: "bg-[#3B82F6]/10 text-[#3B82F6]",
  Completed: "bg-[#10B981]/10 text-[#10B981]",
};

function Radar() {
  const cx = 90, cy = 80, r = 55;
  const pts = radar.map((d, i) => {
    const angle = (Math.PI * 2 * i) / radar.length - Math.PI / 2;
    const dist = (d.value / 10) * r;
    return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 180 170" className="w-full h-[150px]">
      {[0.25, 0.5, 0.75, 1].map((scale, si) => {
        const ringPts = radar.map((_, i) => {
          const angle = (Math.PI * 2 * i) / radar.length - Math.PI / 2;
          return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`;
        }).join(" ");
        return <polygon key={si} points={ringPts} fill="none" stroke="#E2E8F0" strokeWidth="1" />;
      })}
      {radar.map((d, i) => {
        const angle = (Math.PI * 2 * i) / radar.length - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="#E2E8F0" strokeWidth="1" />;
      })}
      <polygon points={pts} fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="2" />
      {radar.map((d, i) => {
        const angle = (Math.PI * 2 * i) / radar.length - Math.PI / 2;
        return <text key={i} x={cx + (r + 14) * Math.cos(angle)} y={cy + (r + 14) * Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#64748B">{d.label}</text>;
      })}
    </svg>
  );
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SupplierDetailView({ supplier }: { supplier: Supplier }) {
  const { toast } = useToast();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  const [quoteDraft, setQuoteDraft] = useState({ product: "", quantity: "1", notes: "" });
  const [auditDraft, setAuditDraft] = useState({ date: "", type: "On-Site Quality Audit", notes: "" });

  const monogram = supplier.name.replace(/[^A-Za-z ]/g, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 4).toUpperCase() || "SUP";
  const metricCards = [
    { label: "Rating", value: `${supplier.rating.toFixed(1)}/5`, color: "text-[#3B82F6]" },
    { label: "Lead Time", value: supplier.leadTimeDays != null ? `${supplier.leadTimeDays} days` : "—", color: "text-[#10B981]" },
    { label: "Products Supplied", value: supplier.productsSupplied != null ? formatNumber(supplier.productsSupplied) : "—", color: "text-[#10B981]" },
    { label: "Status", value: supplier.status, color: "text-[#3B82F6]" },
  ];

  function submitQuote() {
    if (!quoteDraft.product.trim()) { toast("Product is required", "error"); return; }
    toast(`Quote request sent to ${supplier.name}`);
    setQuoteOpen(false);
    setQuoteDraft({ product: "", quantity: "1", notes: "" });
  }

  function submitAudit() {
    if (!auditDraft.date) { toast("Please choose an audit date", "error"); return; }
    toast(`Audit scheduled for ${supplier.name} on ${auditDraft.date}`);
    setAuditOpen(false);
    setAuditDraft({ date: "", type: "On-Site Quality Audit", notes: "" });
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[14px]">
        <Link href="/dashboard/suppliers" className="text-[#64748B] hover:text-[#3B82F6] font-medium">Suppliers</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        <span className="text-[#64748B]">{supplier.country}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        <span className="text-[#1E293B] font-medium">{supplier.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[20px] font-semibold text-[#1E293B]">{supplier.name}</h1>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium bg-[#F59E0B] text-white"><ShieldCheck className="w-3.5 h-3.5" />Verified Supplier</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium bg-[#10B981] text-white"><Star className="w-3.5 h-3.5" />Preferred Partner</span>
          </div>
          <p className="text-[13px] text-[#64748B] mt-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{supplier.category ?? "General"} · OEM/ODM · {supplier.country}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setQuoteOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-[14px] font-medium hover:bg-[#2563EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)]"><FileText className="w-4 h-4" />Request Quote</button>
          <button onClick={() => setAuditOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#3B82F6] rounded-lg text-[14px] font-medium text-[#3B82F6]"><ClipboardCheck className="w-4 h-4" />Schedule Audit</button>
          <button onClick={() => scrollToSection("certifications")} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[14px] font-medium text-[#64748B]"><Award className="w-4 h-4" />View Certificates</button>
          <SupplierDetailActions supplier={supplier} />
        </div>
      </div>

      {/* Metric strip */}
      <div className="bg-[#F1F5F9] rounded-xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center">
            <div className="w-16 h-16 rounded-xl border border-[#E2E8F0] bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] text-[13px] font-bold tracking-wide">{monogram}</div>
          </div>
          {metricCards.map((m) => (
            <div key={m.label} className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <p className="text-[12px] text-[#64748B] font-medium">{m.label}</p>
              <p className={`text-[24px] font-bold ${m.color} leading-tight mt-1`}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 1: Overview / Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Overview */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Overview</h3>

          {/* Supplier Information */}
          <div className="mb-4">
            <h4 className="text-[13px] font-semibold text-[#1E293B] mb-2">Supplier Information</h4>
            <p className="text-[13px] font-semibold text-[#1E293B]">{supplier.name}</p>
            <div className="mt-1.5 space-y-1">
              <p className="text-[12px] text-[#64748B]">Category: {supplier.category ?? "General"}</p>
              <p className="text-[12px] text-[#64748B]">Location: {supplier.country}</p>
              <p className="text-[12px] text-[#64748B]">Contact: {supplier.contact ?? supplier.email ?? "—"}</p>
            </div>
          </div>

          {/* Key Strengths */}
          <div className="mb-4">
            <h4 className="text-[13px] font-semibold text-[#1E293B] mb-2">Key Strengths</h4>
            <ul className="space-y-1.5">
              {keyStrengths.map((s) => (
                <li key={s} className="flex items-center gap-2 text-[12px] text-[#64748B]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div className="mb-4">
            <h4 className="text-[13px] font-semibold text-[#1E293B] mb-2">Product Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {productCategories.map((c) => (
                <div key={c.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[12px] font-medium text-[#1E293B]">{c.name}</span>
                  <span className="text-[11px] text-[#64748B]">{c.pct} of revenue</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div id="certifications" className="scroll-mt-24">
            <h4 className="text-[13px] font-semibold text-[#1E293B] mb-2">Certifications</h4>
            <div className="flex flex-wrap gap-2">
              {certifications.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-[#F0FDF4] text-[#16A34A]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Performance Metrics</h3>
            <button
              onClick={() => exportToCsv(`${supplier.id}-performance`, radar, [
                { key: "label", header: "Metric" },
                { key: "value", header: "Score (out of 10)" },
              ])}
              className="text-[12px] text-[#3B82F6] font-medium hover:underline"
            >
              View details
            </button>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1"><Radar /></div>
            <div className="space-y-2 shrink-0">
              {radar.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-6 text-[12px]">
                  <span className="text-[#64748B]">{r.label}</span>
                  <span className="text-[#1E293B] font-medium">{r.value} / 10</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics sub-grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E2E8F0]">
            {performanceMetrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className={`text-[16px] font-bold ${m.color}`}>{m.value}</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Quality History / Sample History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quality History */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Quality History</h3>
            <button
              onClick={() => exportToCsv(`${supplier.id}-quality-history`, qualityHistory, [
                { key: "month", header: "Month" },
                { key: "value", header: "Defect Rate (%)" },
              ])}
              className="text-[12px] text-[#3B82F6] font-medium hover:underline"
            >
              View full report
            </button>
          </div>
          <div className="h-[120px]">
            <svg viewBox="0 0 300 120" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 1, 2, 3].map((i) => <line key={i} x1="0" y1={i * 30 + 10} x2="300" y2={i * 30 + 10} stroke="#E2E8F0" strokeWidth="1" />)}
              {/* Defect rate line - higher values = worse, so we invert: map 0-1.5 range to 110-10 */}
              <polyline fill="none" stroke="#3B82F6" strokeWidth="2" points={qualityHistory.map((d, i) => `${i * 27},${110 - (d.value / 1.5) * 100}`).join(" ")} />
              {qualityHistory.map((d, i) => <circle key={i} cx={i * 27} cy={110 - (d.value / 1.5) * 100} r="2.5" fill="white" stroke="#3B82F6" strokeWidth="1.5" />)}
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-[#94A3B8]">{qualityHistory.map((m) => <span key={m.month}>{m.month}</span>)}</div>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingDown className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[12px] text-[#10B981] font-medium">Improving</span>
          </div>
        </div>

        {/* Sample History */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Sample History</h3>
            <button
              onClick={() => exportToCsv(`${supplier.id}-sample-history`, sampleHistory, [
                { key: "date", header: "Date" },
                { key: "id", header: "Sample ID" },
                { key: "product", header: "Product" },
                { key: "status", header: "Status" },
                { key: "result", header: "Result" },
              ])}
              className="text-[12px] text-[#3B82F6] font-medium hover:underline"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  {["Date", "Sample ID", "Product", "Status", "Result"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleHistory.map((s) => (
                  <tr key={s.id} className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC]/60">
                    <td className="px-3 py-2.5 text-[12px] text-[#64748B] whitespace-nowrap">{s.date}</td>
                    <td className="px-3 py-2.5 text-[12px] font-mono text-[#3B82F6] font-medium">{s.id}</td>
                    <td className="px-3 py-2.5 text-[12px] text-[#1E293B] whitespace-nowrap">{s.product}</td>
                    <td className="px-3 py-2.5"><span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${statusStyle[s.status]}`}>{s.status}</span></td>
                    <td className={`px-3 py-2.5 text-[12px] font-medium ${s.result === "Pass" ? "text-[#10B981]" : s.result === "Fail" ? "text-[#EF4444]" : "text-[#94A3B8]"}`}>{s.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3: Quote History / Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quote History */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Quote History</h3>
            <Link href="/dashboard/quotes" className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Date", "Quote ID", "Product", "Quantity", "Price", "Status"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quoteHistory.map((q) => (
                  <tr key={q.id} className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC]/60">
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B] whitespace-nowrap">{q.date}</td>
                    <td className="px-4 py-2.5 text-[12px] font-mono text-[#3B82F6] font-medium">
                      <Link href={`/dashboard/quotes/${q.id}`} className="hover:underline">{q.id}</Link>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#1E293B] whitespace-nowrap">{q.product}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{q.quantity}</td>
                    <td className="px-4 py-2.5 text-[12px] font-medium text-[#1E293B]">{q.price}</td>
                    <td className="px-4 py-2.5"><span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${statusStyle[q.status]}`}>{q.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Order ID", "Date", "Product", "Quantity", "Status", "Total"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC]/60">
                    <td className="px-4 py-2.5 text-[12px] font-mono text-[#3B82F6] font-medium">
                      <Link href={`/dashboard/orders/${o.id}`} className="hover:underline">{o.id}</Link>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B] whitespace-nowrap">{o.date}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#1E293B] whitespace-nowrap">{o.product}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{o.quantity}</td>
                    <td className="px-4 py-2.5"><span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${statusStyle[o.status]}`}>{o.status}</span></td>
                    <td className="px-4 py-2.5 text-[12px] font-medium text-[#1E293B]">{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-[15px] font-semibold text-[#1E293B]">Recent Activities</h3>
          <button
            onClick={() => exportToCsv(`${supplier.id}-activities`, recentActivities, [
              { key: "date", header: "Date" },
              { key: "activity", header: "Activity" },
              { key: "user", header: "User" },
              { key: "status", header: "Status" },
            ])}
            className="text-[12px] text-[#3B82F6] font-medium hover:underline"
          >
            View all activities
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["Date", "Activity", "User", "Status"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-6 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((a, i) => (
                <tr key={i} className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC]/60">
                  <td className="px-6 py-3 text-[12px] text-[#64748B] whitespace-nowrap">{a.date}</td>
                  <td className="px-6 py-3 text-[12px] font-medium text-[#1E293B] whitespace-nowrap">{a.activity}</td>
                  <td className="px-6 py-3 text-[12px] text-[#64748B] whitespace-nowrap">{a.user}</td>
                  <td className="px-6 py-3"><span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${statusStyle[a.status]}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Quote modal */}
      <Modal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        title="Request Quote"
        description={`Send a quote request to ${supplier.name}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setQuoteOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={submitQuote}>Send request</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Product" required>
            <TextInput value={quoteDraft.product} onChange={(e) => setQuoteDraft({ ...quoteDraft, product: e.target.value })} placeholder="e.g. LED Display" />
          </Field>
          <Field label="Quantity">
            <NumberInput value={quoteDraft.quantity} onChange={(e) => setQuoteDraft({ ...quoteDraft, quantity: e.target.value })} min="1" step="1" />
          </Field>
          <Field label="Notes">
            <TextArea value={quoteDraft.notes} onChange={(e) => setQuoteDraft({ ...quoteDraft, notes: e.target.value })} placeholder="Specifications, target price, …" />
          </Field>
        </div>
      </Modal>

      {/* Schedule Audit modal */}
      <Modal
        open={auditOpen}
        onClose={() => setAuditOpen(false)}
        title="Schedule Audit"
        description={`Schedule a quality audit with ${supplier.name}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setAuditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={submitAudit}>Schedule</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Audit date" required>
            <TextInput type="date" value={auditDraft.date} onChange={(e) => setAuditDraft({ ...auditDraft, date: e.target.value })} />
          </Field>
          <Field label="Audit type">
            <TextInput value={auditDraft.type} onChange={(e) => setAuditDraft({ ...auditDraft, type: e.target.value })} />
          </Field>
          <Field label="Notes">
            <TextArea value={auditDraft.notes} onChange={(e) => setAuditDraft({ ...auditDraft, notes: e.target.value })} placeholder="Scope, focus areas, …" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
