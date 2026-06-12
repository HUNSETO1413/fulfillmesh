"use client";

import Link from "next/link";
import {
  ChevronRight, ShieldCheck, Star, FileText, ClipboardCheck, Award,
  MoreVertical, MapPin, ArrowUpRight, User, Mail, Phone, Globe,
} from "lucide-react";

const metricStrip = [
  { label: "Match Score", value: "92%", sub: "Excellent Match", subColor: "text-[#10B981]", ring: 92 },
  { label: "On-Time Delivery", value: "97.6%", sub: "↑ 2.3% vs last 30 days", subColor: "text-[#10B981]" },
  { label: "Quality Score", value: "4.8 / 5.0", sub: "↑ 0.4 vs last 30 days", subColor: "text-[#10B981]" },
  { label: "Total Orders", value: "128", sub: "↑ 12 vs last 30 days", subColor: "text-[#10B981]" },
  { label: "Status", value: "Active", badge: true, sub: "Since Jan 15, 2023", subColor: "text-[#94A3B8]" },
];

const companyStats = [
  { label: "Year Established", value: "2012" },
  { label: "Company Size", value: "500-1000" },
  { label: "Employee Count", value: "680" },
  { label: "Factory Area", value: "25,000 m²" },
  { label: "Ownership Type", value: "Private" },
  { label: "Business Type", value: "Manufacturer" },
];

const radar = [
  { label: "Quality", value: 4.8 },
  { label: "Delivery", value: 4.9 },
  { label: "Communication", value: 4.6 },
  { label: "Capacity", value: 4.5 },
  { label: "Compliance", value: 4.7 },
];

const productCategories = ["PCBA", "Consumer Electronics", "Power Supplies", "IoT Devices", "LED Lighting", "Cable Assembly"];
const certs = ["ISO 9001", "ISO 14001", "ISO 45001", "IATF 16949", "RoHS", "REACH"];

const contact = [
  { label: "Primary Contact", value: "Lily Chen", icon: User },
  { label: "Email", value: "lily.chen@novamfg.com", icon: Mail },
  { label: "Phone", value: "+86 755 1234 5678", icon: Phone },
  { label: "Website", value: "www.novamfg.com", icon: Globe, link: true },
  { label: "Address", value: "Building A, No.88 Innovation Road, Bao'an District, Shenzhen, Guangdong, 518102, China", icon: MapPin },
];

const samples = [
  { id: "SMP-2025-0462", product: "Smart Display Module", req: "May 15, 2025", status: "Approved" },
  { id: "SMP-2025-0418", product: "LED Driver Board", req: "Apr 18, 2025", status: "Approved" },
  { id: "SMP-2025-0387", product: "Power Supply Unit", req: "Apr 27, 2025", status: "Approved" },
  { id: "SMP-2025-0331", product: "IoT Gateway Device", req: "Mar 03, 2025", status: "Approved" },
  { id: "SMP-2025-0294", product: "Cable Assembly", req: "Feb 10, 2025", status: "Approved" },
];

const quotes = [
  { id: "QT-2025-0518", req: "May 12, 2025", product: "Smart Display Module", amount: "$21,400.00", status: "Quoted" },
  { id: "QT-2025-0499", req: "Apr 22, 2025", product: "Power Supply Unit", amount: "$18,920.00", status: "Accepted" },
  { id: "QT-2025-0453", req: "Apr 18, 2025", product: "IoT Gateway Device", amount: "$31,875.00", status: "Accepted" },
  { id: "QT-2025-0377", req: "Apr 05, 2025", product: "LED Driver Board", amount: "$12,540.00", status: "Expired" },
  { id: "QT-2025-0312", req: "Feb 26, 2025", product: "Cable Assembly", amount: "$6,430.00", status: "Declined" },
];

const orders = [
  { id: "ORD-10458", product: "Smart Display Module", po: "May 12, 2025", del: "May 28, 2025", total: "$24,860.00", status: "In Production" },
  { id: "ORD-10445", product: "Power Supply Unit", po: "May 03, 2025", del: "May 20, 2025", total: "$18,920.00", status: "In Production" },
  { id: "ORD-10432", product: "LED Driver Board", po: "Apr 15, 2025", del: "May 05, 2025", total: "$12,540.00", status: "Shipped" },
  { id: "ORD-10421", product: "Cable Assembly", po: "Mar 28, 2025", del: "Apr 12, 2025", total: "$6,430.00", status: "Delivered" },
];

const activities = [
  { time: "May 16, 2025 10:24 AM", activity: "Quality Inspection Completed", details: "Inspection report QI-2025-0392 completed with score 4.0/5.0", user: "Quality Team" },
  { time: "May 15, 2025 09:08 AM", activity: "Order Created", details: "Order ORD-10458 created for Smart Display Module", user: "Michael Tan" },
  { time: "May 15, 2025 02:30 PM", activity: "New Quote Requested", details: "New Quote requested for IoT Gateway Device", user: "Sarah Lee" },
  { time: "May 12, 2025 09:10 AM", activity: "Supplier Profile Updated", details: "Company information and certifications updated", user: "Admin User" },
  { time: "May 10, 2025 02:47 PM", activity: "Sample Approved", details: "Sample SMP-2025-0462 approved", user: "Jason Wu" },
];

const statusStyle: Record<string, string> = {
  Approved: "bg-[#10B981]/10 text-[#10B981]",
  Quoted: "bg-[#3B82F6]/10 text-[#3B82F6]",
  Accepted: "bg-[#10B981]/10 text-[#10B981]",
  Expired: "bg-[#94A3B8]/10 text-[#64748B]",
  Declined: "bg-[#EF4444]/10 text-[#EF4444]",
  "In Production": "bg-[#F59E0B]/10 text-[#F59E0B]",
  Shipped: "bg-[#3B82F6]/10 text-[#3B82F6]",
  Delivered: "bg-[#10B981]/10 text-[#10B981]",
};

// quality history line chart points (12 months)
const qhPts = [62, 55, 68, 60, 50, 64, 58, 70, 66, 60, 72, 78];
const qhMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function MatchRing({ pct }: { pct: number }) {
  const c = 2 * Math.PI * 18;
  const len = (pct / 100) * c;
  return (
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
        <circle cx="22" cy="22" r="18" fill="none" stroke="#E2E8F0" strokeWidth="4" />
        <circle cx="22" cy="22" r="18" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray={`${len} ${c - len}`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#1E293B]">{pct}%</span>
    </div>
  );
}

function Radar() {
  const cx = 90, cy = 80, r = 55;
  const pts = radar.map((d, i) => {
    const angle = (Math.PI * 2 * i) / radar.length - Math.PI / 2;
    const dist = (d.value / 5) * r;
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
        return <text key={i} x={cx + (r + 12) * Math.cos(angle)} y={cy + (r + 12) * Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#94A3B8">{d.label}</text>;
      })}
    </svg>
  );
}

export default function SupplierDetailPage() {
  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[14px]">
        <Link href="/dashboard/suppliers" className="text-[#64748B] hover:text-[#3B82F6] font-medium">Suppliers</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        <span className="text-[#64748B]">China</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        <span className="text-[#1E293B] font-medium">Shenzhen Nova Manufacturing</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[20px] font-semibold text-[#1E293B]">Shenzhen Nova Manufacturing</h1>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium bg-[#F59E0B] text-white"><ShieldCheck className="w-3.5 h-3.5" />Verified Supplier</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium bg-[#10B981] text-white"><Star className="w-3.5 h-3.5" />Preferred Partner</span>
          </div>
          <p className="text-[13px] text-[#64748B] mt-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Electronics Manufacturing · OEM/ODM · Shenzhen, Guangdong, China</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-[14px] font-medium hover:bg-[#2563EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)]"><FileText className="w-4 h-4" />Request Quote</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#3B82F6] rounded-lg text-[14px] font-medium text-[#3B82F6]"><ClipboardCheck className="w-4 h-4" />Schedule Audit</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[14px] font-medium text-[#64748B]"><Award className="w-4 h-4" />View Certificates</button>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-lg text-[#64748B]"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Metric strip */}
      <div className="bg-[#F1F5F9] rounded-xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center">
            <div className="w-16 h-16 rounded-xl border border-[#E2E8F0] bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] text-[13px] font-bold tracking-wide">NOVA</div>
          </div>
          {metricStrip.map((m) => (
            <div key={m.label} className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-[#64748B] font-medium">{m.label}</p>
                {m.ring && <MatchRing pct={m.ring} />}
              </div>
              {m.badge ? (
                <span className="inline-flex px-2 py-0.5 rounded-md text-[14px] font-semibold bg-[#10B981] text-white mt-1">{m.value}</span>
              ) : (
                <p className="text-[24px] font-bold text-[#1E293B] leading-tight mt-1">{m.value}</p>
              )}
              <p className={`text-[11px] mt-1 ${m.subColor}`}>{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 1: Overview / Performance Metrics / Categories+Certs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overview */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="text-[15px] font-semibold text-[#1E293B] mb-3">Overview</h3>
          <p className="text-[12px] text-[#64748B] leading-relaxed">Shenzhen Nova Manufacturing is a trusted OEM/ODM partner specializing in electronics assembly, PCBA, and finished goods manufacturing with strong quality control and on-time delivery.</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 pt-4 border-t border-[#E2E8F0]">
            {companyStats.map((c) => (
              <div key={c.label}>
                <p className="text-[12px] text-[#64748B] font-medium">{c.label}</p>
                <p className="text-[14px] text-[#1E293B] mt-0.5">{c.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Performance Metrics</h3>
            <button className="text-[12px] text-[#3B82F6] font-medium hover:underline">View details</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1"><Radar /></div>
            <div className="space-y-2 shrink-0">
              {radar.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-4 text-[12px]">
                  <span className="text-[#64748B]">{r.label}</span>
                  <span className="text-[#1E293B] font-medium">{r.value.toFixed(1)} / 5.0</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories + Certs */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="text-[15px] font-semibold text-[#1E293B] mb-3">Product Categories</h3>
          <div className="flex flex-wrap gap-2">
            {productCategories.map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-md text-[12px] font-medium bg-[#EFF6FF] text-[#2563EB]">{c}</span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-5 mb-3">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Certifications</h3>
            <button className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {certs.map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-md text-[12px] font-medium bg-[#F0FDF4] text-[#16A34A]">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Contact / Quality History / Sample History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contact */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Contact Information</h3>
          <div className="space-y-4">
            {contact.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-[#64748B] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[12px] text-[#64748B] font-medium">{c.label}</p>
                    <p className={`text-[14px] mt-0.5 ${c.link ? "text-[#3B82F6]" : "text-[#1E293B]"}`}>{c.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality History */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Quality History <span className="text-[12px] text-[#94A3B8] font-normal">(Last 12 Months)</span></h3>
            <button className="text-[12px] text-[#3B82F6] font-medium hover:underline">View full report</button>
          </div>
          <div className="h-[110px]">
            <svg viewBox="0 0 300 110" className="w-full h-full" preserveAspectRatio="none">
              {[0, 1, 2, 3].map((i) => <line key={i} x1="0" y1={i * 30 + 10} x2="300" y2={i * 30 + 10} stroke="#E2E8F0" strokeWidth="1" />)}
              <polyline fill="none" stroke="#3B82F6" strokeWidth="2" points={qhPts.map((v, i) => `${i * 27},${100 - v}`).join(" ")} />
              {qhPts.map((v, i) => <circle key={i} cx={i * 27} cy={100 - v} r="2.5" fill="white" stroke="#3B82F6" strokeWidth="1.5" />)}
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-[#94A3B8] mb-3">{qhMonths.map((m) => <span key={m}>{m}</span>)}</div>
          <div className="grid grid-cols-5 gap-2 pt-3 border-t border-[#E2E8F0] text-center">
            {[
              { l: "Average Score", v: "4.6 / 5.0" },
              { l: "Inspections", v: "36" },
              { l: "Passed", v: "33", s: "(91.7%)", sc: "text-[#10B981]" },
              { l: "Failed", v: "3", s: "(8.3%)", sc: "text-[#EF4444]" },
              { l: "Critical Issues", v: "1" },
            ].map((m) => (
              <div key={m.l}>
                <p className="text-[14px] font-bold text-[#1E293B]">{m.v}</p>
                {m.s && <p className={`text-[10px] ${m.sc}`}>{m.s}</p>}
                <p className="text-[10px] text-[#94A3B8] mt-0.5">{m.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sample History */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Sample History <span className="text-[12px] text-[#94A3B8] font-normal">(Last 6 Months)</span></h3>
            <button className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-12 text-[10px] text-[#64748B] uppercase tracking-wider font-medium pb-2 border-b border-[#E2E8F0]">
            <span className="col-span-4">Sample ID</span>
            <span className="col-span-4">Product</span>
            <span className="col-span-2">Requested</span>
            <span className="col-span-2 text-right">Status</span>
          </div>
          {samples.map((s) => (
            <div key={s.id} className="grid grid-cols-12 items-center text-[12px] py-2.5 border-b border-[#F1F5F9] last:border-b-0">
              <span className="col-span-4 font-mono text-[#1E293B] font-medium">{s.id}</span>
              <span className="col-span-4 text-[#64748B] truncate">{s.product}</span>
              <span className="col-span-2 text-[#94A3B8]">{s.req}</span>
              <span className="col-span-2 text-right"><span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${statusStyle[s.status]}`}>{s.status}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Quote History / Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quote History */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Quote History <span className="text-[12px] text-[#94A3B8] font-normal">(Last 6 Months)</span></h3>
            <button className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["Quote ID", "Requested", "Products", "Total Amount", "Status"].map((h) => <th key={h} className="text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">{h}</th>)}
              </tr></thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id} className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC]/60">
                    <td className="px-4 py-2.5 text-[12px] font-mono text-[#3B82F6] font-medium">{q.id}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B] whitespace-nowrap">{q.req}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#1E293B] whitespace-nowrap">{q.product}</td>
                    <td className="px-4 py-2.5 text-[12px] font-medium text-[#1E293B]">{q.amount}</td>
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
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Recent Orders / Projects</h3>
            <button className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["Order ID", "Product", "PO Date", "Delivery Date", "Total", "Status"].map((h) => <th key={h} className="text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">{h}</th>)}
              </tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC]/60">
                    <td className="px-4 py-2.5 text-[12px] font-mono text-[#3B82F6] font-medium">{o.id}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#1E293B] whitespace-nowrap">{o.product}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B] whitespace-nowrap">{o.po}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B] whitespace-nowrap">{o.del}</td>
                    <td className="px-4 py-2.5 text-[12px] font-medium text-[#1E293B]">{o.total}</td>
                    <td className="px-4 py-2.5"><span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${statusStyle[o.status]}`}>{o.status}</span></td>
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
          <button className="text-[12px] text-[#3B82F6] font-medium hover:underline">View all activities</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              {["Date & Time", "Activity", "Details", "User"].map((h) => <th key={h} className="text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-6 py-2.5 whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {activities.map((a, i) => (
                <tr key={i} className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC]/60">
                  <td className="px-6 py-3 text-[12px] text-[#64748B] whitespace-nowrap">{a.time}</td>
                  <td className="px-6 py-3 text-[12px] font-medium text-[#1E293B] whitespace-nowrap">{a.activity}</td>
                  <td className="px-6 py-3 text-[12px] text-[#64748B]">{a.details}</td>
                  <td className="px-6 py-3 text-[12px] text-[#64748B] whitespace-nowrap">{a.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
