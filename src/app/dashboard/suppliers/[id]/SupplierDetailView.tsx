"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight, ShieldCheck, Star, FileText, ClipboardCheck, Award,
  MapPin, CheckCircle, TrendingDown, MoreHorizontal, Copy, Printer, Pencil, Download, Plus, X,
} from "lucide-react";
import type { Supplier, QcInspection } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, NumberInput, TextArea, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import { formatNumber } from "@/lib/format";
import SupplierDetailActions from "./SupplierDetailActions";

type RadarAxis = { label: string; value: number };

const certifications = ["ISO 9001:2015", "RoHS Compliance", "CE Mark"];

const sampleHistorySeed = [
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
  Scheduled: "bg-[#3B82F6]/10 text-[#3B82F6]",
  Requested: "bg-[#F59E0B]/10 text-[#F59E0B]",
};

function Radar({ axes }: { axes: RadarAxis[] }) {
  const cx = 90, cy = 80, r = 55;
  const pts = axes.map((d, i) => {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    const dist = (d.value / 10) * r;
    return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 180 170" className="w-full h-[150px]">
      {[0.25, 0.5, 0.75, 1].map((scale, si) => {
        const ringPts = axes.map((_, i) => {
          const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
          return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`;
        }).join(" ");
        return <polygon key={si} points={ringPts} fill="none" stroke="#E2E8F0" strokeWidth="1" />;
      })}
      {axes.map((d, i) => {
        const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="#E2E8F0" strokeWidth="1" />;
      })}
      <polygon points={pts} fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="2" />
      {axes.map((d, i) => {
        const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
        return <text key={i} x={cx + (r + 14) * Math.cos(angle)} y={cy + (r + 14) * Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#64748B">{d.label}</text>;
      })}
    </svg>
  );
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SupplierDetailView({ supplier }: { supplier: Supplier }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // Editable key strengths
  const [strengths, setStrengths] = useState<string[]>([
    "High-volume production capacity",
    "ISO 9001 certified",
    "24/7 customer support",
  ]);
  const [strengthsOpen, setStrengthsOpen] = useState(false);
  const [newStrength, setNewStrength] = useState("");

  // Request Sample modal
  const [sampleOpen, setSampleOpen] = useState(false);
  const [sampleDraft, setSampleDraft] = useState({ type: "Product", quantity: "1", notes: "" });

  // Live recent activities — starts with seed data, new entries pushed to front
  const [activities, setActivities] = useState([
    { date: "2024-05-15", activity: "Quote Request", user: "John Doe", status: "Sent" },
    { date: "2024-05-14", activity: "Order Shipment", user: "Jane Smith", status: "Completed" },
    { date: "2024-05-13", activity: "Sample Approval", user: "Mike Johnson", status: "Approved" },
  ]);

  // Sample history — live list
  const [samples, setSamples] = useState(sampleHistorySeed);

  // Real QC inspections for this supplier (powers defect rate, pass rate, radar, quality trend)
  const [qcInspections, setQcInspections] = useState<QcInspection[] | null>(null);
  const [qcError, setQcError] = useState(false);

  useEffect(() => {
    let active = true;
    api.get<{ data: QcInspection[] }>("/api/qc-inspections")
      .then((res) => { if (active) setQcInspections(res.data ?? []); })
      .catch(() => { if (active) { setQcInspections([]); setQcError(true); } });
    return () => { active = false; };
  }, []);

  const supplierInspections = useMemo(() => {
    if (!qcInspections) return [];
    const target = supplier.name.trim().toLowerCase();
    return qcInspections.filter((q) => q.supplier.trim().toLowerCase() === target);
  }, [qcInspections, supplier.name]);

  // Derive defect rate / pass rate from real QC inspections (null when no data)
  const qcSummary = useMemo(() => {
    const withDefect = supplierInspections.filter((q) => typeof q.defectRate === "number");
    const avgDefectRate = withDefect.length
      ? withDefect.reduce((sum, q) => sum + (q.defectRate ?? 0), 0) / withDefect.length
      : null;
    const decided = supplierInspections.filter((q) => q.status === "Passed" || q.status === "Failed");
    const passRate = decided.length
      ? (decided.filter((q) => q.status === "Passed").length / decided.length) * 100
      : null;
    return { avgDefectRate, passRate, count: supplierInspections.length };
  }, [supplierInspections]);

  // Quality history — real defect rate over time, bucketed by month from QC inspections
  const qualityHistory = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const buckets = new Map<number, { sum: number; n: number }>();
    for (const q of supplierInspections) {
      if (typeof q.defectRate !== "number") continue;
      const m = new Date(q.scheduledDate).getMonth();
      if (Number.isNaN(m)) continue;
      const b = buckets.get(m) ?? { sum: 0, n: 0 };
      b.sum += q.defectRate;
      b.n += 1;
      buckets.set(m, b);
    }
    return [...buckets.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([m, b]) => ({ month: months[m], value: Math.round((b.sum / b.n) * 10) / 10 }));
  }, [supplierInspections]);

  // Real performance metrics from supplier scorecard fields + QC pass rate
  const performanceMetrics = useMemo(() => [
    { label: "On-Time Delivery", value: supplier.onTimePct != null ? `${Math.round(supplier.onTimePct)}%` : "—", color: "text-[#10B981]" },
    { label: "Defect Rate", value: qcSummary.avgDefectRate != null ? `${qcSummary.avgDefectRate.toFixed(1)}%` : "—", color: "text-[#EF4444]" },
    { label: "Lead Time", value: supplier.leadTimeDays != null ? `${supplier.leadTimeDays} days` : "—", color: "text-[#3B82F6]" },
    { label: "Response Time", value: supplier.avgResponseHours != null ? `${supplier.avgResponseHours}h` : "—", color: "text-[#10B981]" },
  ], [supplier.onTimePct, supplier.leadTimeDays, supplier.avgResponseHours, qcSummary.avgDefectRate]);

  // Radar axes mapped to REAL metrics (0-10 scale)
  const radarAxes = useMemo<RadarAxis[]>(() => {
    const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n * 10) / 10));
    // Quality: prefer QC pass rate, else invert defect rate; neutral 0 when no QC data
    const quality = qcSummary.passRate != null
      ? clamp(qcSummary.passRate / 10)
      : qcSummary.avgDefectRate != null
        ? clamp(10 - qcSummary.avgDefectRate)
        : 0;
    // On-time delivery → /10
    const delivery = supplier.onTimePct != null ? clamp(supplier.onTimePct / 10) : 0;
    // Lead time → shorter is better; 0 days→10, 30+ days→0
    const leadTime = supplier.leadTimeDays != null ? clamp(10 - (supplier.leadTimeDays / 3)) : 0;
    // Responsiveness → faster is better; 0h→10, 48h+→0
    const responsiveness = supplier.avgResponseHours != null ? clamp(10 - (supplier.avgResponseHours / 4.8)) : 0;
    // Rating (0-5) → /10
    const rating = clamp(supplier.rating * 2);
    return [
      { label: "Quality", value: quality },
      { label: "On-Time", value: delivery },
      { label: "Lead Time", value: leadTime },
      { label: "Response", value: responsiveness },
      { label: "Rating", value: rating },
    ];
  }, [qcSummary, supplier.onTimePct, supplier.leadTimeDays, supplier.avgResponseHours, supplier.rating]);

  const qcLoading = qcInspections === null;

  // Request Quote form
  const [quoteDraft, setQuoteDraft] = useState({
    product: "",
    quantity: "1",
    targetPrice: "",
    deliveryDate: "",
    notes: "",
  });

  // Schedule Audit form
  const [auditDraft, setAuditDraft] = useState({
    type: "Quality",
    date: "",
    auditor: "",
    focusAreas: "",
  });

  // Contact info edit
  const [contactOpen, setContactOpen] = useState(false);
  const [contactDraft, setContactDraft] = useState({
    contact: supplier.contact ?? "",
    email: supplier.email ?? "",
    country: supplier.country,
  });

  async function saveContact() {
    if (!contactDraft.country.trim()) { toast("Country is required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/suppliers/${supplier.id}`, {
        contact: contactDraft.contact.trim() || undefined,
        email: contactDraft.email.trim() || undefined,
        country: contactDraft.country.trim(),
      });
      toast(`Contact info updated for ${supplier.name}`);
      setContactOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update contact info", "error");
    } finally { setBusy(false); }
  }

  function copySupplierId() {
    navigator.clipboard?.writeText(supplier.id).then(
      () => toast("Supplier ID copied to clipboard"),
      () => toast("Could not copy supplier ID", "error"),
    );
  }

  function exportProfile() {
    exportToCsv(`supplier-${supplier.id}`, [supplier], [
      { key: "id", header: "Supplier ID" },
      { key: "name", header: "Name" },
      { key: "contact", header: "Contact" },
      { key: "email", header: "Email" },
      { key: "country", header: "Country" },
      { key: "category", header: "Category" },
      { key: "rating", header: "Rating" },
      { key: "status", header: "Status" },
      { key: "leadTimeDays", header: "Lead Time (days)" },
      { key: "productsSupplied", header: "Products Supplied" },
    ]);
    toast("Supplier profile exported");
  }

  function exportQuoteRow(q: (typeof quoteHistory)[number]) {
    exportToCsv(`quote-${q.id}`, [q], [
      { key: "id", header: "Quote ID" },
      { key: "date", header: "Date" },
      { key: "product", header: "Product" },
      { key: "quantity", header: "Quantity" },
      { key: "price", header: "Price" },
      { key: "status", header: "Status" },
    ]);
    toast(`Quote ${q.id} exported`);
  }

  const monogram = supplier.name.replace(/[^A-Za-z ]/g, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 4).toUpperCase() || "SUP";
  const metricCards = [
    { label: "Rating", value: `${supplier.rating.toFixed(1)}/5`, color: "text-[#3B82F6]" },
    { label: "Lead Time", value: supplier.leadTimeDays != null ? `${supplier.leadTimeDays} days` : "—", color: "text-[#10B981]" },
    { label: "Products Supplied", value: supplier.productsSupplied != null ? formatNumber(supplier.productsSupplied) : "—", color: "text-[#10B981]" },
    { label: "Status", value: supplier.status, color: "text-[#3B82F6]" },
  ];

  function submitQuote() {
    if (!quoteDraft.product.trim()) { toast("Product name is required", "error"); return; }
    if (!quoteDraft.quantity || Number(quoteDraft.quantity) < 1) { toast("Quantity must be at least 1", "error"); return; }
    const ref = `QTE-${(1000 + Math.floor(Math.random() * 9000))}`;
    toast(`Quote request ${ref} sent to ${supplier.name}`);
    setQuoteOpen(false);
    setQuoteDraft({ product: "", quantity: "1", targetPrice: "", deliveryDate: "", notes: "" });
    // Track in activities
    setActivities((prev) => [
      { date: new Date().toISOString().slice(0, 10), activity: `Quote Request (${ref})`, user: "You", status: "Sent" },
      ...prev,
    ]);
  }

  function submitAudit() {
    if (!auditDraft.date) { toast("Please choose an audit date", "error"); return; }
    if (!auditDraft.auditor.trim()) { toast("Auditor name is required", "error"); return; }
    const ref = `AUD-${(1000 + Math.floor(Math.random() * 9000))}`;
    toast(`Audit ${ref} scheduled for ${supplier.name} on ${auditDraft.date}`);
    setAuditOpen(false);
    setAuditDraft({ type: "Quality", date: "", auditor: "", focusAreas: "" });
    // Track in activities
    setActivities((prev) => [
      { date: auditDraft.date, activity: `Audit Scheduled (${ref})`, user: auditDraft.auditor, status: "Scheduled" },
      ...prev,
    ]);
  }

  function submitSample() {
    if (!sampleDraft.quantity || Number(sampleDraft.quantity) < 1) { toast("Quantity must be at least 1", "error"); return; }
    const ref = `SMP-${String(samples.length + 1).padStart(3, "0")}`;
    const now = new Date().toISOString().slice(0, 10);
    setSamples((prev) => [
      { date: now, id: ref, product: sampleDraft.type, status: "Pending", result: "—" },
      ...prev,
    ]);
    toast(`Sample request ${ref} submitted to ${supplier.name}`);
    setSampleOpen(false);
    setSampleDraft({ type: "Product", quantity: "1", notes: "" });
    // Track in activities
    setActivities((prev) => [
      { date: now, activity: `Sample Request (${ref})`, user: "You", status: "Requested" },
      ...prev,
    ]);
  }

  function addStrength() {
    const trimmed = newStrength.trim();
    if (!trimmed) return;
    if (strengths.includes(trimmed)) { toast("Strength already exists", "error"); return; }
    setStrengths((prev) => [...prev, trimmed]);
    setNewStrength("");
  }

  function removeStrength(s: string) {
    setStrengths((prev) => prev.filter((x) => x !== s));
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
          <div className="relative">
            <button onClick={() => setMoreOpen((v) => !v)} aria-label="More options" className="w-9 h-9 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
            {moreOpen && (
              <div className="absolute right-0 mt-1 z-20 w-48 bg-white border border-[#E2E8F0] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] py-1">
                <button onClick={() => { copySupplierId(); setMoreOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[12px] text-[#64748B] hover:bg-[#F8FAFC]"><Copy className="w-3.5 h-3.5" /> Copy supplier ID</button>
                <button onClick={() => { exportProfile(); setMoreOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[12px] text-[#64748B] hover:bg-[#F8FAFC]"><FileText className="w-3.5 h-3.5" /> Export profile CSV</button>
                <button onClick={() => { setMoreOpen(false); window.print(); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[12px] text-[#64748B] hover:bg-[#F8FAFC]"><Printer className="w-3.5 h-3.5" /> Print</button>
              </div>
            )}
          </div>
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
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-[13px] font-semibold text-[#1E293B]">Supplier Information</h4>
              <button onClick={() => { setContactDraft({ contact: supplier.contact ?? "", email: supplier.email ?? "", country: supplier.country }); setContactOpen(true); }} aria-label="Edit contact info" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
            </div>
            <p className="text-[13px] font-semibold text-[#1E293B]">{supplier.name}</p>
            <div className="mt-1.5 space-y-1">
              <p className="text-[12px] text-[#64748B]">Category: {supplier.category ?? "General"}</p>
              <p className="text-[12px] text-[#64748B]">Location: {supplier.country}</p>
              <p className="text-[12px] text-[#64748B]">Contact: {supplier.contact ?? "—"}</p>
              <p className="text-[12px] text-[#64748B]">Email: {supplier.email ?? "—"}</p>
            </div>
          </div>

          {/* Key Strengths — editable */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-[13px] font-semibold text-[#1E293B]">Key Strengths</h4>
              <button onClick={() => setStrengthsOpen(true)} aria-label="Edit strengths" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
            </div>
            <ul className="space-y-1.5">
              {strengths.map((s) => (
                <li key={s} className="flex items-center gap-2 text-[12px] text-[#64748B]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories — honest: only the supplier's known category + product count */}
          <div className="mb-4">
            <h4 className="text-[13px] font-semibold text-[#1E293B] mb-2">Product Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[12px] font-medium text-[#1E293B]">{supplier.category ?? "General"}</span>
                <span className="text-[11px] text-[#64748B]">
                  {supplier.productsSupplied != null ? `${formatNumber(supplier.productsSupplied)} products` : "primary"}
                </span>
              </div>
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
              onClick={() => exportToCsv(`${supplier.id}-performance`, radarAxes, [
                { key: "label", header: "Metric" },
                { key: "value", header: "Score (out of 10)" },
              ])}
              className="text-[12px] text-[#3B82F6] font-medium hover:underline"
            >
              View details
            </button>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1"><Radar axes={radarAxes} /></div>
            <div className="space-y-2 shrink-0">
              {radarAxes.map((r) => (
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
                <p className={`text-[16px] font-bold ${m.color}`}>{qcLoading && m.label === "Defect Rate" ? "…" : m.value}</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
          {qcSummary.passRate != null && (
            <p className="text-[11px] text-[#64748B] mt-3">
              Quality derived from {qcSummary.count} QC inspection{qcSummary.count === 1 ? "" : "s"} · pass rate {Math.round(qcSummary.passRate)}%
            </p>
          )}
          {!qcLoading && qcSummary.count === 0 && (
            <p className="text-[11px] text-[#94A3B8] mt-3">
              {qcError ? "Could not load QC inspection data." : "No QC inspections on record for this supplier yet."}
            </p>
          )}
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
          {qcLoading ? (
            <div className="h-[120px] flex items-center justify-center">
              <div className="h-3 w-32 rounded bg-[#E2E8F0] animate-pulse" />
            </div>
          ) : qualityHistory.length === 0 ? (
            <div className="h-[120px] flex items-center justify-center">
              <p className="text-[12px] text-[#94A3B8]">No defect-rate history yet.</p>
            </div>
          ) : (() => {
            const maxVal = Math.max(...qualityHistory.map((d) => d.value), 1);
            const step = qualityHistory.length > 1 ? 300 / (qualityHistory.length - 1) : 0;
            const y = (v: number) => 110 - (v / maxVal) * 100;
            const first = qualityHistory[0].value;
            const last = qualityHistory[qualityHistory.length - 1].value;
            const improving = last <= first;
            return (
              <>
                <div className="h-[120px]">
                  <svg viewBox="0 0 300 120" className="w-full h-full" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 1, 2, 3].map((i) => <line key={i} x1="0" y1={i * 30 + 10} x2="300" y2={i * 30 + 10} stroke="#E2E8F0" strokeWidth="1" />)}
                    {/* Defect rate line — scaled so higher defect = higher on chart */}
                    <polyline fill="none" stroke="#3B82F6" strokeWidth="2" points={qualityHistory.map((d, i) => `${i * step},${y(d.value)}`).join(" ")} />
                    {qualityHistory.map((d, i) => <circle key={i} cx={i * step} cy={y(d.value)} r="2.5" fill="white" stroke="#3B82F6" strokeWidth="1.5" />)}
                  </svg>
                </div>
                <div className="flex justify-between text-[10px] text-[#94A3B8]">{qualityHistory.map((m) => <span key={m.month}>{m.month}</span>)}</div>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingDown className={`w-3.5 h-3.5 ${improving ? "text-[#10B981]" : "text-[#EF4444] rotate-180"}`} />
                  <span className={`text-[12px] font-medium ${improving ? "text-[#10B981]" : "text-[#EF4444]"}`}>{improving ? "Improving" : "Worsening"}</span>
                </div>
              </>
            );
          })()}
        </div>

        {/* Sample History */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Sample History</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSampleOpen(true)}
                className="inline-flex items-center gap-1 text-[12px] text-white bg-[#3B82F6] font-medium hover:bg-[#2563EB] px-3 py-1 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Request new sample
              </button>
              <button
                onClick={() => exportToCsv(`${supplier.id}-sample-history`, samples, [
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
                {samples.map((s) => (
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
                  {["Date", "Quote ID", "Product", "Quantity", "Price", "Status", ""].map((h, i) => (
                    <th key={`${h}-${i}`} className="text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">{h}</th>
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
                    <td className="px-4 py-2.5">
                      <button onClick={() => exportQuoteRow(q)} aria-label={`Download quote ${q.id}`} className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><Download className="w-3.5 h-3.5" /></button>
                    </td>
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
            onClick={() => exportToCsv(`${supplier.id}-activities`, activities, [
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
              {activities.map((a, i) => (
                <tr key={i} className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC]/60">
                  <td className="px-6 py-3 text-[12px] text-[#64748B] whitespace-nowrap">{a.date}</td>
                  <td className="px-6 py-3 text-[12px] font-medium text-[#1E293B] whitespace-nowrap">{a.activity}</td>
                  <td className="px-6 py-3 text-[12px] text-[#64748B] whitespace-nowrap">{a.user}</td>
                  <td className="px-6 py-3"><span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${statusStyle[a.status] ?? "bg-[#94A3B8]/10 text-[#94A3B8]"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────── */}

      {/* Request Quote modal — full form */}
      <Modal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        title="Request Quote"
        description={`Send a quote request to ${supplier.name}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setQuoteOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={submitQuote}>Send Request</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Product Name" required>
            <TextInput value={quoteDraft.product} onChange={(e) => setQuoteDraft({ ...quoteDraft, product: e.target.value })} placeholder="e.g. LED Display" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Quantity" required>
              <NumberInput value={quoteDraft.quantity} onChange={(e) => setQuoteDraft({ ...quoteDraft, quantity: e.target.value })} min="1" step="1" />
            </Field>
            <Field label="Target Price">
              <TextInput value={quoteDraft.targetPrice} onChange={(e) => setQuoteDraft({ ...quoteDraft, targetPrice: e.target.value })} placeholder="e.g. $12.50 / unit" />
            </Field>
          </div>
          <Field label="Delivery Date">
            <TextInput type="date" value={quoteDraft.deliveryDate} onChange={(e) => setQuoteDraft({ ...quoteDraft, deliveryDate: e.target.value })} />
          </Field>
          <Field label="Notes / Requirements">
            <TextArea value={quoteDraft.notes} onChange={(e) => setQuoteDraft({ ...quoteDraft, notes: e.target.value })} placeholder="Specifications, packaging requirements, compliance standards…" />
          </Field>
        </div>
      </Modal>

      {/* Schedule Audit modal — full form */}
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
          <Field label="Audit Type">
            <Select
              options={["Quality", "Compliance", "Performance", "Full"]}
              value={auditDraft.type}
              onChange={(e) => setAuditDraft({ ...auditDraft, type: e.target.value })}
            />
          </Field>
          <Field label="Preferred Date" required>
            <TextInput type="date" value={auditDraft.date} onChange={(e) => setAuditDraft({ ...auditDraft, date: e.target.value })} />
          </Field>
          <Field label="Auditor Name" required>
            <TextInput value={auditDraft.auditor} onChange={(e) => setAuditDraft({ ...auditDraft, auditor: e.target.value })} placeholder="e.g. Sarah Chen" />
          </Field>
          <Field label="Focus Areas">
            <TextArea value={auditDraft.focusAreas} onChange={(e) => setAuditDraft({ ...auditDraft, focusAreas: e.target.value })} placeholder="Quality control processes, documentation review, facility inspection…" />
          </Field>
        </div>
      </Modal>

      {/* Edit Key Strengths modal */}
      <Modal
        open={strengthsOpen}
        onClose={() => { setStrengthsOpen(false); setNewStrength(""); }}
        title="Edit Key Strengths"
        description="Add or remove strengths for this supplier."
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => { setStrengthsOpen(false); setNewStrength(""); }}>Done</SecondaryButton>
          </>
        }
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {strengths.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#F0FDF4] text-[#16A34A]">
                {s}
                <button onClick={() => removeStrength(s)} aria-label={`Remove ${s}`} className="hover:text-[#EF4444] transition-colors"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <TextInput
              value={newStrength}
              onChange={(e) => setNewStrength(e.target.value)}
              placeholder="Add a strength…"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStrength(); } }}
              className="flex-1"
            />
            <PrimaryButton onClick={addStrength} disabled={!newStrength.trim()}>
              <Plus className="w-4 h-4" />
            </PrimaryButton>
          </div>
        </div>
      </Modal>

      {/* Request Sample modal */}
      <Modal
        open={sampleOpen}
        onClose={() => setSampleOpen(false)}
        title="Request New Sample"
        description={`Request a sample from ${supplier.name}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setSampleOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={submitSample}>Submit Request</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Sample Type">
            <Select
              options={["Product", "Material", "Color Swatch", "Prototype", "Other"]}
              value={sampleDraft.type}
              onChange={(e) => setSampleDraft({ ...sampleDraft, type: e.target.value })}
            />
          </Field>
          <Field label="Quantity" required>
            <NumberInput value={sampleDraft.quantity} onChange={(e) => setSampleDraft({ ...sampleDraft, quantity: e.target.value })} min="1" step="1" />
          </Field>
          <Field label="Notes">
            <TextArea value={sampleDraft.notes} onChange={(e) => setSampleDraft({ ...sampleDraft, notes: e.target.value })} placeholder="Specifications, color codes, dimensions…" />
          </Field>
        </div>
      </Modal>

      {/* Edit contact info modal */}
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Edit Contact Info"
        description={`Update contact details for ${supplier.name}.`}
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setContactOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveContact} disabled={busy}>{busy ? "Saving…" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Contact name / phone">
            <TextInput value={contactDraft.contact} onChange={(e) => setContactDraft({ ...contactDraft, contact: e.target.value })} placeholder="e.g. Li Wei · +86 755 1234 5678" />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={contactDraft.email} onChange={(e) => setContactDraft({ ...contactDraft, email: e.target.value })} placeholder="contact@supplier.com" />
          </Field>
          <Field label="Country / location" required>
            <TextInput value={contactDraft.country} onChange={(e) => setContactDraft({ ...contactDraft, country: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
