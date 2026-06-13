"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  ChevronDown,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  CheckCircle2,
  FileText,
  RotateCcw,
  AlertCircle,
  Tag,
  ArrowRight,
} from "lucide-react";
import type { Customer } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, TextArea, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import CustomerDetailActions from "./CustomerDetailActions";

const recentOrders = [
  { id: "ORD-10468", date: "May 16, 2025", status: "Delivered", total: "$1,248.00" },
  { id: "ORD-10457", date: "May 16, 2025", status: "In Transit", total: "$2,156.75" },
  { id: "ORD-10441", date: "May 14, 2025", status: "Processing", total: "$890.00" },
  { id: "ORD-10422", date: "May 12, 2025", status: "Delivered", total: "$3,420.50" },
  { id: "ORD-10398", date: "May 09, 2025", status: "Delivered", total: "$567.25" },
];

const recentShipments = [
  { id: "SHP-2014-0091", carrier: "FedEx", status: "In Transit", eta: "May 20, 2025" },
  { id: "SHP-2024-0079", carrier: "UPS", status: "Delivered", eta: "May 16, 2025" },
  { id: "SHP-2024-0061", carrier: "DHL", status: "Delivered", eta: "May 12, 2025" },
  { id: "SHP-2024-0048", carrier: "FedEx", status: "Delivered", eta: "May 09, 2025" },
];

const returnsHistory = [
  { id: "RET-1102", date: "May 10, 2025", reason: "Damaged", status: "Refunded" },
  { id: "RET-1089", date: "May 04, 2025", reason: "Wrong Item", status: "Completed" },
  { id: "RET-1067", date: "Apr 28, 2025", reason: "Defective", status: "Completed" },
];

const supportActivity = [
  { id: "TKT-3041", subject: "Shipping delay inquiry", status: "Resolved", date: "May 16, 2025" },
  { id: "TKT-2998", subject: "Invoice correction", status: "Resolved", date: "May 11, 2025" },
  { id: "TKT-2954", subject: "Return request", status: "Resolved", date: "Apr 28, 2025" },
];

const initialTags = ["Wholesale", "Priority", "Repeat Buyer", "High AOV", "West Coast"];

interface Note {
  date: string;
  text: string;
}

const initialNotes: Note[] = [
  { date: "May 16, 2025", text: "Requested faster shipping for upcoming order." },
  { date: "Apr 28, 2025", text: "Prefers email updates over SMS." },
];

const recommendedActions = [
  { label: "Follow up on pending invoice", cta: "View", note: "Due in 2 days", icon: AlertCircle, href: "/dashboard/invoices" },
  { label: "Offer bulk discount for next order", cta: "Create", note: "Based on purchase history", icon: Tag, href: "/dashboard/quotes/new" },
  { label: "Check in on recent support ticket", cta: "View", note: "Last updated 3 days ago", icon: FileText, href: "#support" },
];

const timeline = [
  { icon: Plus, color: "#0057D8", title: "Order Created", date: "May 16, 2025", desc: "Order ORD-10468 placed via portal" },
  { icon: CheckCircle2, color: "#00B894", title: "Shipment Delivered", date: "May 16, 2025", desc: "SHP-2024-0079 delivered to dock" },
  { icon: FileText, color: "#7C6FF6", title: "Support Ticket Closed", date: "May 16, 2025", desc: "Ticket TKT-3041 marked resolved" },
  { icon: ArrowDownRight, color: "#F59E0B", title: "Payment Received", date: "May 13, 2025", desc: "Invoice INV-2038 paid in full" },
  { icon: RotateCcw, color: "#EF4444", title: "Return Completed", date: "May 10, 2025", desc: "Return RET-1102 refunded $148.00" },
  { icon: Phone, color: "#00B894", title: "Customer Note Added", date: "May 14, 2025", desc: "Account manager logged a call" },
];

function MiniStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-[#00B894]/10 text-[#00B894]",
    "In Transit": "bg-[#0057D8]/10 text-[#0057D8]",
    Processing: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Refunded: "bg-[#7C6FF6]/10 text-[#7C6FF6]",
    Completed: "bg-[#00B894]/10 text-[#00B894]",
    Resolved: "bg-[#00B894]/10 text-[#00B894]",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded ${styles[status] || "bg-[#F1F5F9] text-[#66758C]"}`}>
      {status}
    </span>
  );
}

const tabs = ["Overview", "Orders", "Shipments", "Returns", "Support", "Notes & Activity"];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CustomerDetailView({ customer }: { customer: Customer }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(0);

  const [tags, setTags] = useState(initialTags);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tagsDraft, setTagsDraft] = useState(initialTags.join(", "));

  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const initials = customer.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const avgOrder = customer.orders > 0 ? customer.totalSpent / customer.orders : 0;

  function copyText(value: string, label: string) {
    navigator.clipboard?.writeText(value).then(
      () => toast(`${label} copied to clipboard`),
      () => toast(`Could not copy ${label.toLowerCase()}`, "error"),
    );
  }

  function saveTags() {
    const next = tagsDraft.split(",").map((t) => t.trim()).filter(Boolean);
    setTags(next);
    setTagsOpen(false);
    toast("Customer tags updated");
  }

  function saveNote() {
    if (!noteDraft.trim()) { toast("Note cannot be empty", "error"); return; }
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    setNotes([{ date: today, text: noteDraft.trim() }, ...notes]);
    setNoteDraft("");
    setNoteOpen(false);
    toast("Note added");
  }

  const tabSection: Record<number, string | null> = {
    0: null,
    1: "orders",
    2: "shipments",
    3: "returns",
    4: "support",
    5: "notes",
  };

  function selectTab(i: number) {
    setActiveTab(i);
    const target = tabSection[i];
    if (target) scrollToSection(target);
  }

  return (
    <div className="space-y-5">
      {/* Back link + header buttons */}
      <div>
        <Link href="/dashboard/customers" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4A5A73] hover:text-[#061A3D] mb-3">
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#061A3D]">Customer Detail</h1>
            <p className="text-[14px] text-[#4A5A73] mt-0.5">View and manage customer information, orders, shipments, and support activity.</p>
          </div>
          <CustomerDetailActions customer={customer} />
        </div>
      </div>

      {/* Header cards row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.2fr 0.9fr 1.4fr" }}>
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-[#0057D8]/10 flex items-center justify-center shrink-0">
              <span className="text-[18px] font-bold text-[#0057D8]">{initials}</span>
            </div>
            <div className="min-w-0">
              <span className="mb-1 inline-block"><StatusBadge status={customer.status} /></span>
              <h2 className="text-[18px] font-bold text-[#061A3D]">{customer.name}</h2>
              <button
                type="button"
                onClick={() => copyText(customer.email, "Email")}
                className="flex items-center gap-1.5 text-[12px] text-[#4A5A73] mt-1 hover:text-[#061A3D]"
              >
                {customer.email} <Copy className="w-3 h-3 text-[#9AA8B8]" />
              </button>
              <button
                type="button"
                onClick={() => customer.phone ? copyText(customer.phone, "Phone") : undefined}
                className="flex items-center gap-1.5 text-[12px] text-[#4A5A73] mt-0.5 hover:text-[#061A3D]"
              >
                {customer.phone ?? "—"} <Copy className="w-3 h-3 text-[#9AA8B8]" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E6EDF5]">
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Customer ID</p>
              <p className="text-[12px] font-medium text-[#061A3D] mt-0.5 font-mono">{customer.id}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Joined</p>
              <p className="text-[12px] font-medium text-[#061A3D] mt-0.5">{customer.joinedDate ? formatDate(customer.joinedDate) : "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Country</p>
              <p className="text-[12px] font-medium text-[#061A3D] mt-0.5">{customer.country ?? "—"}</p>
            </div>
          </div>
        </div>

        {/* Lifetime value card */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <p className="text-[13px] text-[#66758C]">Lifetime Value</p>
          <p className="text-[26px] font-bold text-[#061A3D] mt-1">{formatCurrency(customer.totalSpent)}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00B894]" />
            <span className="text-[12px] font-medium text-[#00B894]">18.4%</span>
            <span className="text-[11px] text-[#9AA8B8]">vs last 90 days</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E6EDF5]">
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Total Orders</p>
              <p className="text-[15px] font-bold text-[#061A3D] mt-0.5">{formatNumber(customer.orders)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Total Spent</p>
              <p className="text-[15px] font-bold text-[#061A3D] mt-0.5">{formatCurrency(customer.totalSpent)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Avg Order</p>
              <p className="text-[15px] font-bold text-[#061A3D] mt-0.5">{formatCurrency(avgOrder)}</p>
            </div>
          </div>
        </div>

        {/* Order Performance chart card */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#061A3D]">Order Performance (Last 90 Days)</h3>
            <span className="flex items-center gap-1 text-[11px] text-[#66758C] bg-[#F7FAFC] px-2 py-1 rounded">Last 90 days <ChevronDown className="w-3 h-3" /></span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Orders</p>
              <p className="text-[16px] font-bold text-[#061A3D]">12</p>
              <span className="flex items-center gap-0.5 text-[11px] text-[#00B894]"><ArrowUpRight className="w-3 h-3" />20%</span>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Spent</p>
              <p className="text-[16px] font-bold text-[#061A3D]">$24,680</p>
              <span className="flex items-center gap-0.5 text-[11px] text-[#00B894]"><ArrowUpRight className="w-3 h-3" />16%</span>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">AOV</p>
              <p className="text-[16px] font-bold text-[#061A3D]">$2,056</p>
              <span className="flex items-center gap-0.5 text-[11px] text-[#EF4444]"><ArrowDownRight className="w-3 h-3" />3%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col justify-between text-[9px] text-[#9AA8B8] py-1 shrink-0">
              <span>$3K</span>
              <span>$2K</span>
              <span>$1K</span>
            </div>
            <div className="h-[80px] flex-1">
              <svg viewBox="0 0 320 80" className="w-full h-full">
                <defs>
                  <linearGradient id="cdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0057D8" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0057D8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M5,52 L45,40 L85,58 L125,30 L165,46 L205,22 L245,40 L285,18 L315,30 L315,78 L5,78 Z" fill="url(#cdGrad)" />
                <polyline fill="none" stroke="#0057D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  points="5,52 45,40 85,58 125,30 165,46 205,22 245,40 285,18 315,30" />
                {[[5,52],[45,40],[85,58],[125,30],[165,46],[205,22],[245,40],[285,18],[315,30]].map(([x,y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#fff" stroke="#0057D8" strokeWidth="1.5" />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E6EDF5]">
        <div className="flex items-center gap-6">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => selectTab(i)}
              className={`pb-3 text-[13px] font-medium border-b-2 -mb-px ${
                i === activeTab ? "border-[#0057D8] text-[#0057D8]" : "border-transparent text-[#66758C] hover:text-[#061A3D]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Body: 4 columns row 1 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1.3fr 1.3fr 1fr" }}>
        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[14px] font-semibold text-[#061A3D] mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider mb-1">Billing Address</p>
              <p className="text-[12px] text-[#061A3D]">{customer.name}</p>
              <p className="text-[12px] text-[#4A5A73]">123 Market Street, Suite 400</p>
              <p className="text-[12px] text-[#4A5A73]">San Francisco, CA 94103</p>
              <p className="text-[12px] text-[#4A5A73]">{customer.country ?? "United States"}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider mb-1">Shipping Address</p>
              <p className="text-[12px] text-[#061A3D]">{customer.name}</p>
              <p className="text-[12px] text-[#4A5A73]">88 Industrial Way, Dock 12</p>
              <p className="text-[12px] text-[#4A5A73]">Oakland, CA 94607</p>
              <p className="text-[12px] text-[#4A5A73]">{customer.country ?? "United States"}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider mb-1">Payment Method</p>
              <p className="text-[12px] text-[#061A3D]">Visa ending in 4242</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider mb-1">Tax Exempt</p>
              <p className="text-[12px] text-[#061A3D]">No</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div id="orders" className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#061A3D]">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-[12px] font-medium text-[#0057D8] hover:underline">View all</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6EDF5]">
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Order ID</th>
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Order Date</th>
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Status</th>
                <th className="text-right text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-[#F1F5F9] last:border-b-0">
                  <td className="py-2.5 text-[12px] font-medium text-[#0057D8]">
                    <Link href={`/dashboard/orders/${o.id}`} className="hover:underline">{o.id}</Link>
                  </td>
                  <td className="py-2.5 text-[12px] text-[#4A5A73]">{o.date}</td>
                  <td className="py-2.5"><MiniStatusBadge status={o.status} /></td>
                  <td className="py-2.5 text-[12px] font-medium text-[#061A3D] text-right">{o.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Shipments */}
        <div id="shipments" className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#061A3D]">Recent Shipments</h3>
            <Link href="/dashboard/shipments" className="text-[12px] font-medium text-[#0057D8] hover:underline">View all</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6EDF5]">
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Shipment ID</th>
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Carrier</th>
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Status</th>
                <th className="text-right text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">ETA</th>
              </tr>
            </thead>
            <tbody>
              {recentShipments.map((s) => (
                <tr key={s.id} className="border-b border-[#F1F5F9] last:border-b-0">
                  <td className="py-2.5 text-[12px] font-medium text-[#0057D8]">
                    <Link href={`/dashboard/shipments/${s.id}`} className="hover:underline">{s.id}</Link>
                  </td>
                  <td className="py-2.5 text-[12px] text-[#4A5A73]">{s.carrier}</td>
                  <td className="py-2.5"><MiniStatusBadge status={s.status} /></td>
                  <td className="py-2.5 text-[12px] text-[#4A5A73] text-right">{s.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customer Tags */}
        <div id="notes" className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#061A3D]">Customer Tags</h3>
            <button onClick={() => { setTagsDraft(tags.join(", ")); setTagsOpen(true); }} className="text-[12px] font-medium text-[#0057D8] hover:underline">Edit</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="inline-flex px-2.5 py-1 text-[11px] font-medium rounded-full bg-[#0057D8]/10 text-[#0057D8]">{t}</span>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[#E6EDF5]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#061A3D]">Notes</h3>
              <button onClick={() => setNoteOpen(true)} className="text-[12px] font-medium text-[#0057D8] hover:underline">Add Note</button>
            </div>
            <div className="space-y-3">
              {notes.map((n, i) => (
                <div key={`${n.date}-${i}`} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0057D8] mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#9AA8B8]"><span className="font-medium text-[#061A3D]">{n.date}</span> by Admin</p>
                    <p className="text-[12px] text-[#4A5A73] mt-0.5">{n.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body: row 2 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.3fr 1.3fr 1fr" }}>
        {/* Returns History */}
        <div id="returns" className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#061A3D]">Returns History</h3>
            <Link href="/dashboard/returns" className="text-[12px] font-medium text-[#0057D8] hover:underline">View all</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6EDF5]">
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Return ID</th>
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Date</th>
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Reason</th>
                <th className="text-right text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {returnsHistory.map((r) => (
                <tr key={r.id} className="border-b border-[#F1F5F9] last:border-b-0">
                  <td className="py-2.5 text-[12px] font-medium text-[#0057D8]">
                    <Link href={`/dashboard/returns/${r.id}`} className="hover:underline">{r.id}</Link>
                  </td>
                  <td className="py-2.5 text-[12px] text-[#4A5A73]">{r.date}</td>
                  <td className="py-2.5 text-[12px] text-[#061A3D]">{r.reason}</td>
                  <td className="py-2.5 text-right"><MiniStatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Support Activity */}
        <div id="support" className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#061A3D]">Support Activity</h3>
            <Link href="/dashboard/notifications" className="text-[12px] font-medium text-[#0057D8] hover:underline">View all</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6EDF5]">
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Ticket ID</th>
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Subject</th>
                <th className="text-left text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Status</th>
                <th className="text-right text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {supportActivity.map((t) => (
                <tr key={t.id} className="border-b border-[#F1F5F9] last:border-b-0">
                  <td className="py-2.5 text-[12px] font-medium text-[#0057D8]">{t.id}</td>
                  <td className="py-2.5 text-[12px] text-[#061A3D]">{t.subject}</td>
                  <td className="py-2.5"><MiniStatusBadge status={t.status} /></td>
                  <td className="py-2.5 text-[12px] text-[#4A5A73] text-right">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommended Next Actions */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[14px] font-semibold text-[#061A3D] mb-3">Recommended Next Actions</h3>
          <div className="space-y-3">
            {recommendedActions.map((a) => {
              const Icon = a.icon;
              const isAnchor = a.href.startsWith("#");
              return (
                <div key={a.label} className="flex items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9] last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#0057D8]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#0057D8]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-[#061A3D]">{a.label}</p>
                      <p className="text-[11px] text-[#9AA8B8] mt-0.5">{a.note}</p>
                    </div>
                  </div>
                  {isAnchor ? (
                    <button
                      onClick={() => scrollToSection(a.href.slice(1))}
                      className="px-3 py-1 text-[12px] font-medium text-[#0057D8] border border-[#E6EDF5] rounded-md hover:bg-[#F7FAFC] shrink-0"
                    >
                      {a.cta}
                    </button>
                  ) : (
                    <Link
                      href={a.href}
                      className="px-3 py-1 text-[12px] font-medium text-[#0057D8] border border-[#E6EDF5] rounded-md hover:bg-[#F7FAFC] shrink-0"
                    >
                      {a.cta}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={() => toast("All recommendations are shown above")}
            className="flex items-center gap-1 text-[12px] font-medium text-[#0057D8] hover:underline mt-3"
          >
            View all recommendations <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Customer Timeline */}
      <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-[#061A3D]">Customer Timeline</h3>
          <button onClick={() => toast("Showing full customer timeline")} className="text-[#9AA8B8] hover:text-[#66758C]"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          {timeline.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${t.color}1a` }}>
                  <Icon className="w-4 h-4" style={{ color: t.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[#061A3D]">{t.title}</p>
                  <p className="text-[11px] text-[#9AA8B8]">{t.date}</p>
                  <p className="text-[12px] text-[#4A5A73] mt-0.5">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit tags modal */}
      <Modal
        open={tagsOpen}
        onClose={() => setTagsOpen(false)}
        title="Edit customer tags"
        description="Separate tags with commas."
        footer={
          <>
            <SecondaryButton onClick={() => setTagsOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveTags}>Save tags</PrimaryButton>
          </>
        }
      >
        <Field label="Tags">
          <TextInput value={tagsDraft} onChange={(e) => setTagsDraft(e.target.value)} placeholder="Wholesale, Priority, …" />
        </Field>
      </Modal>

      {/* Add note modal */}
      <Modal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        title="Add note"
        description={`Log a note for ${customer.name}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setNoteOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveNote}>Add note</PrimaryButton>
          </>
        }
      >
        <Field label="Note">
          <TextArea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Write a note…" />
        </Field>
      </Modal>
    </div>
  );
}
