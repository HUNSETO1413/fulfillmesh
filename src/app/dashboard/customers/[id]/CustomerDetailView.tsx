"use client";

import { useState, useMemo } from "react";
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
  Pencil,
  Printer,
  Mail,
  TrendingUp,
} from "lucide-react";
import type { Customer } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, Select, TextArea, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import CustomerDetailActions from "./CustomerDetailActions";

/* ---------- seeded pseudo-random helpers ---------- */

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seeded(seed: number, idx: number): number {
  // simple LCG-derived value in [0, 1)
  let v = (seed ^ (idx * 2654435761)) >>> 0;
  v = ((v * 1103515245 + 12345) & 0x7fffffff) >>> 0;
  return v / 0x7fffffff;
}

function pick<T>(arr: readonly T[], seed: number, idx: number): T {
  return arr[Math.floor(seeded(seed, idx) * arr.length)];
}

/* ---------- deterministic data generators ---------- */

function generateOrders(customerId: string) {
  const h = hashStr(customerId);
  const statuses = ["Delivered", "Delivered", "Delivered", "In Transit", "Processing"] as const;
  const orders: { id: string; date: string; status: string; total: string }[] = [];
  for (let i = 0; i < 5; i++) {
    const num = 10000 + ((h + i * 137) % 900);
    const dayOffset = i * 3 + Math.floor(seeded(h, i * 10) * 4);
    const d = new Date();
    d.setDate(d.getDate() - dayOffset);
    const cents = Math.floor(seeded(h, i * 20 + 7) * 400000) + 5000;
    orders.push({
      id: `ORD-${num}`,
      date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: pick(statuses, h, i * 3),
      total: formatCurrency(cents / 100),
    });
  }
  return orders;
}

function generateShipments(customerId: string) {
  const h = hashStr(customerId);
  const carriers = ["FedEx", "UPS", "DHL", "USPS"] as const;
  const statuses = ["Delivered", "Delivered", "In Transit", "Delivered"] as const;
  const shipments: { id: string; carrier: string; status: string; eta: string }[] = [];
  for (let i = 0; i < 4; i++) {
    const num = 2000 + ((h + i * 89) % 800);
    const seq = (Math.floor(seeded(h, i * 30 + 1) * 90) + 10).toString().padStart(2, "0");
    const dayOffset = i * 4 + Math.floor(seeded(h, i * 30 + 3) * 5);
    const d = new Date();
    d.setDate(d.getDate() + (i === 0 ? 2 : -dayOffset));
    shipments.push({
      id: `SHP-${num}-${seq}`,
      carrier: pick(carriers, h, i * 5),
      status: pick(statuses, h, i * 5 + 1),
      eta: d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    });
  }
  return shipments;
}

function generateReturns(customerId: string) {
  const h = hashStr(customerId);
  const reasons = ["Damaged", "Wrong Item", "Defective", "Not Needed", "Wrong Size"] as const;
  const statuses = ["Refunded", "Completed", "Completed"] as const;
  const returns: { id: string; date: string; reason: string; status: string }[] = [];
  for (let i = 0; i < 3; i++) {
    const num = 1000 + ((h + i * 53) % 200);
    const dayOffset = 8 + i * 6 + Math.floor(seeded(h, i * 40) * 4);
    const d = new Date();
    d.setDate(d.getDate() - dayOffset);
    returns.push({
      id: `RET-${num}`,
      date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      reason: pick(reasons, h, i * 7),
      status: pick(statuses, h, i * 7 + 1),
    });
  }
  return returns;
}

function generateSupport(customerId: string) {
  const h = hashStr(customerId);
  const subjects = [
    "Shipping delay inquiry",
    "Invoice correction",
    "Return request",
    "Order status update",
    "Address change request",
  ] as const;
  const tickets: { id: string; subject: string; status: string; date: string }[] = [];
  for (let i = 0; i < 3; i++) {
    const num = 2900 + ((h + i * 71) % 200);
    const dayOffset = 4 + i * 8 + Math.floor(seeded(h, i * 50) * 5);
    const d = new Date();
    d.setDate(d.getDate() - dayOffset);
    tickets.push({
      id: `TKT-${num}`,
      subject: pick(subjects, h, i * 9),
      status: i === 0 && seeded(h, i * 90) > 0.7 ? "Open" : "Resolved",
      date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    });
  }
  return tickets;
}

function generateSparkline(customerId: string): number[] {
  const h = hashStr(customerId);
  const points: number[] = [];
  for (let i = 0; i < 9; i++) {
    points.push(Math.floor(seeded(h, i * 13 + 100) * 50) + 10);
  }
  return points;
}

/* ---------- contact info defaults ---------- */

interface Address {
  name: string;
  street1: string;
  street2: string;
  cityStateZip: string;
  country: string;
}

interface PaymentMethod {
  type: string;
  last4: string;
}

function defaultBilling(name: string, country?: string): Address {
  return { name, street1: "123 Market Street, Suite 400", street2: "", cityStateZip: "San Francisco, CA 94103", country: country ?? "United States" };
}

function defaultShipping(name: string, country?: string): Address {
  return { name, street1: "88 Industrial Way, Dock 12", street2: "", cityStateZip: "Oakland, CA 94607", country: country ?? "United States" };
}

const defaultPayment: PaymentMethod = { type: "Visa", last4: "4242" };

/* ---------- static data ---------- */

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

const extraRecommendedActions = [
  { label: "Send re-order reminder email", cta: "View", note: "Last order 4 weeks ago", icon: Mail, href: "/dashboard/messages" },
  { label: "Review shipment exceptions", cta: "View", note: "1 shipment flagged this month", icon: AlertCircle, href: "#shipments" },
  { label: "Upgrade to priority fulfillment tier", cta: "View", note: "Spend qualifies for tier upgrade", icon: TrendingUp, href: "#orders" },
];

interface TimelineEntry {
  icon: typeof Plus;
  color: string;
  title: string;
  date: string;
  desc: string;
}

const initialTimeline: TimelineEntry[] = [
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
    Open: "bg-[#F59E0B]/10 text-[#F59E0B]",
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

const CARD_TYPES = ["Visa", "Mastercard", "American Express", "Discover"];

export default function CustomerDetailView({ customer }: { customer: Customer }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(0);

  const [tags, setTags] = useState(initialTags);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tagsDraft, setTagsDraft] = useState(initialTags.join(", "));

  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const [timeline, setTimeline] = useState<TimelineEntry[]>(initialTimeline);
  const [showAllRecs, setShowAllRecs] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  /* ---- contact info state ---- */
  const [billing, setBilling] = useState<Address>(defaultBilling(customer.name, customer.country));
  const [shipping, setShipping] = useState<Address>(defaultShipping(customer.name, customer.country));
  const [payment, setPayment] = useState<PaymentMethod>(defaultPayment);

  const [billingOpen, setBillingOpen] = useState(false);
  const [billingDraft, setBillingDraft] = useState<Address>(billing);

  const [shippingOpen, setShippingOpen] = useState(false);
  const [shippingDraft, setShippingDraft] = useState<Address>(shipping);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentDraft, setPaymentDraft] = useState<PaymentMethod>(payment);

  /* ---- deterministic derived data ---- */
  const recentOrders = useMemo(() => generateOrders(customer.id), [customer.id]);
  const recentShipments = useMemo(() => generateShipments(customer.id), [customer.id]);
  const returnsHistory = useMemo(() => generateReturns(customer.id), [customer.id]);
  const supportActivity = useMemo(() => generateSupport(customer.id), [customer.id]);
  const sparklinePts = useMemo(() => generateSparkline(customer.id), [customer.id]);

  const initials = customer.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const avgOrder = customer.orders > 0 ? customer.totalSpent / customer.orders : 0;
  const visibleRecs = showAllRecs ? [...recommendedActions, ...extraRecommendedActions] : recommendedActions;

  /* ---- computed lifetime trend ---- */
  const lifetimeTrendPct = useMemo(() => {
    // Derive a percentage from totalSpent so different customers show different trends
    if (customer.totalSpent <= 0) return 0;
    // Use the hash to vary direction slightly, scale 5–35%
    const h = hashStr(customer.id);
    const raw = 5 + (h % 30);
    return raw;
  }, [customer.id, customer.totalSpent]);

  /* ---- computed chart stats ---- */
  const chartStats = useMemo(() => {
    const h = hashStr(customer.id);
    const last90Orders = Math.max(1, Math.floor(customer.orders * (0.2 + seeded(h, 500) * 0.15)));
    const last90Spent = Math.floor(customer.totalSpent * (0.18 + seeded(h, 501) * 0.12));
    const last90Aov = last90Orders > 0 ? Math.round(last90Spent / last90Orders) : 0;
    const ordersPct = Math.floor(seeded(h, 510) * 25) + 5;
    const spentPct = Math.floor(seeded(h, 511) * 20) + 5;
    const aovPct = seeded(h, 512) > 0.5 ? -Math.floor(seeded(h, 513) * 8) - 1 : Math.floor(seeded(h, 513) * 10) + 2;
    return { last90Orders, last90Spent, last90Aov, ordersPct, spentPct, aovPct };
  }, [customer.id, customer.orders, customer.totalSpent]);

  /* ---- sparkline SVG path ---- */
  const { areaPath, linePoints, dotCoords } = useMemo(() => {
    const n = sparklinePts.length;
    const w = 310;
    const h = 70;
    const pad = 5;
    const maxVal = Math.max(...sparklinePts, 1);
    const step = (w - pad * 2) / (n - 1);
    const coords = sparklinePts.map((v, i) => {
      const x = pad + i * step;
      const y = pad + h - (v / maxVal) * (h - pad * 2);
      return [x, y] as [number, number];
    });
    const lineStr = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const areaStr = `${coords.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} L${coords[n - 1][0].toFixed(1)},${(h + pad).toFixed(1)} L${coords[0][0].toFixed(1)},${(h + pad).toFixed(1)} Z`;
    return { areaPath: `M${coords[0][0].toFixed(1)},${coords[0][1].toFixed(1)} ${areaStr}`, linePoints: lineStr, dotCoords: coords };
  }, [sparklinePts]);

  function copyText(value: string, label: string) {
    navigator.clipboard?.writeText(value).then(
      () => toast(`${label} copied to clipboard`),
      () => toast(`Could not copy ${label.toLowerCase()}`, "error"),
    );
  }

  function appendTimeline(entry: Omit<TimelineEntry, "date">) {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    setTimeline((prev) => [{ ...entry, date: today }, ...prev]);
  }

  function exportProfile() {
    exportToCsv(`customer-${customer.id}`, [customer], [
      { key: "id", header: "Customer ID" },
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "company", header: "Company" },
      { key: "phone", header: "Phone" },
      { key: "country", header: "Country" },
      { key: "orders", header: "Orders" },
      { key: "totalSpent", header: "Total Spent (USD)" },
      { key: "status", header: "Status" },
      { key: "joinedDate", header: "Joined" },
    ]);
    toast("Customer profile exported");
  }

  function saveTags() {
    const next = tagsDraft.split(",").map((t) => t.trim()).filter(Boolean);
    setTags(next);
    setTagsOpen(false);
    appendTimeline({ icon: Tag, color: "#7C6FF6", title: "Tags Updated", desc: next.length ? `Tags set to: ${next.join(", ")}` : "All tags removed" });
    toast("Customer tags updated");
  }

  function saveNote() {
    if (!noteDraft.trim()) { toast("Note cannot be empty", "error"); return; }
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const text = noteDraft.trim();
    setNotes([{ date: today, text }, ...notes]);
    setNoteDraft("");
    setNoteOpen(false);
    appendTimeline({ icon: Pencil, color: "#0057D8", title: "Note Added", desc: text.length > 60 ? `${text.slice(0, 60)}…` : text });
    toast("Note added");
  }

  /* ---- contact info save handlers ---- */
  async function saveBilling() {
    setBillingDraft((d) => d); // just to validate
    if (!billingDraft.street1.trim()) { toast("Street address is required", "error"); return; }
    try {
      await api.put(`/api/customers/${customer.id}`, { billingAddress: billingDraft });
      setBilling(billingDraft);
      setBillingOpen(false);
      appendTimeline({ icon: Pencil, color: "#0057D8", title: "Billing Address Updated", desc: billingDraft.street1 });
      toast("Billing address updated");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update billing address", "error");
    }
  }

  async function saveShipping() {
    if (!shippingDraft.street1.trim()) { toast("Street address is required", "error"); return; }
    try {
      await api.put(`/api/customers/${customer.id}`, { shippingAddress: shippingDraft });
      setShipping(shippingDraft);
      setShippingOpen(false);
      appendTimeline({ icon: Pencil, color: "#0057D8", title: "Shipping Address Updated", desc: shippingDraft.street1 });
      toast("Shipping address updated");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update shipping address", "error");
    }
  }

  async function savePayment() {
    if (!paymentDraft.last4.trim() || paymentDraft.last4.length < 4) { toast("Last 4 digits are required", "error"); return; }
    try {
      await api.put(`/api/customers/${customer.id}`, { paymentMethod: paymentDraft });
      setPayment(paymentDraft);
      setPaymentOpen(false);
      appendTimeline({ icon: Pencil, color: "#0057D8", title: "Payment Method Updated", desc: `${paymentDraft.type} ending in ${paymentDraft.last4}` });
      toast("Payment method updated");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update payment method", "error");
    }
  }

  function showTicketDetails(t: { id: string; subject: string; status: string; date: string }) {
    toast(`Ticket ${t.id}: ${t.subject} — ${t.status} (${t.date})`);
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
          <CustomerDetailActions
            customer={customer}
            onChanged={(desc) => appendTimeline({ icon: CheckCircle2, color: "#00B894", title: "Customer Updated", desc })}
          />
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
            {lifetimeTrendPct >= 0 ? (
              <>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#00B894]" />
                <span className="text-[12px] font-medium text-[#00B894]">{lifetimeTrendPct.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />
                <span className="text-[12px] font-medium text-[#EF4444]">{Math.abs(lifetimeTrendPct).toFixed(1)}%</span>
              </>
            )}
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
              <p className="text-[16px] font-bold text-[#061A3D]">{chartStats.last90Orders}</p>
              <span className="flex items-center gap-0.5 text-[11px] text-[#00B894]"><ArrowUpRight className="w-3 h-3" />{chartStats.ordersPct}%</span>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Spent</p>
              <p className="text-[16px] font-bold text-[#061A3D]">{formatCurrency(chartStats.last90Spent)}</p>
              <span className="flex items-center gap-0.5 text-[11px] text-[#00B894]"><ArrowUpRight className="w-3 h-3" />{chartStats.spentPct}%</span>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">AOV</p>
              <p className="text-[16px] font-bold text-[#061A3D]">{formatCurrency(chartStats.last90Aov)}</p>
              <span className={`flex items-center gap-0.5 text-[11px] ${chartStats.aovPct >= 0 ? "text-[#00B894]" : "text-[#EF4444]"}`}>
                {chartStats.aovPct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(chartStats.aovPct)}%
              </span>
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
                <path d={areaPath} fill="url(#cdGrad)" />
                <polyline fill="none" stroke="#0057D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={linePoints} />
                {dotCoords.map(([x, y]) => (
                  <circle key={`${x.toFixed(1)}-${y.toFixed(1)}`} cx={x} cy={y} r="2.5" fill="#fff" stroke="#0057D8" strokeWidth="1.5" />
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
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider">Billing Address</p>
                <button onClick={() => { setBillingDraft(billing); setBillingOpen(true); }} className="text-[11px] text-[#0057D8] hover:underline">Edit</button>
              </div>
              <p className="text-[12px] text-[#061A3D]">{billing.name}</p>
              <p className="text-[12px] text-[#4A5A73]">{billing.street1}</p>
              <p className="text-[12px] text-[#4A5A73]">{billing.cityStateZip}</p>
              <p className="text-[12px] text-[#4A5A73]">{billing.country}</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider">Shipping Address</p>
                <button onClick={() => { setShippingDraft(shipping); setShippingOpen(true); }} className="text-[11px] text-[#0057D8] hover:underline">Edit</button>
              </div>
              <p className="text-[12px] text-[#061A3D]">{shipping.name}</p>
              <p className="text-[12px] text-[#4A5A73]">{shipping.street1}</p>
              <p className="text-[12px] text-[#4A5A73]">{shipping.cityStateZip}</p>
              <p className="text-[12px] text-[#4A5A73]">{shipping.country}</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider">Payment Method</p>
                <button onClick={() => { setPaymentDraft(payment); setPaymentOpen(true); }} className="text-[11px] text-[#0057D8] hover:underline">Edit</button>
              </div>
              <p className="text-[12px] text-[#061A3D]">{payment.type} ending in {payment.last4}</p>
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
                <th className="text-right text-[10px] font-medium text-[#66758C] uppercase tracking-wider pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supportActivity.map((t) => (
                <tr key={t.id} className="border-b border-[#F1F5F9] last:border-b-0">
                  <td className="py-2.5 text-[12px] font-medium text-[#0057D8]">
                    <button
                      type="button"
                      onClick={() => showTicketDetails(t)}
                      className="hover:underline text-left"
                    >
                      {t.id}
                    </button>
                  </td>
                  <td className="py-2.5 text-[12px] text-[#061A3D]">{t.subject}</td>
                  <td className="py-2.5"><MiniStatusBadge status={t.status} /></td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => showTicketDetails(t)}
                      className="px-2 py-0.5 text-[11px] font-medium text-[#0057D8] border border-[#E6EDF5] rounded hover:bg-[#F7FAFC]"
                    >
                      View ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommended Next Actions */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[14px] font-semibold text-[#061A3D] mb-3">Recommended Next Actions</h3>
          <div className="space-y-3">
            {visibleRecs.map((a) => {
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
            onClick={() => setShowAllRecs((v) => !v)}
            className="flex items-center gap-1 text-[12px] font-medium text-[#0057D8] hover:underline mt-3"
          >
            {showAllRecs ? "Show fewer recommendations" : `View all recommendations (${recommendedActions.length + extraRecommendedActions.length})`} <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showAllRecs ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>

      {/* Customer Timeline */}
      <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-[#061A3D]">Customer Timeline</h3>
          <div className="relative">
            <button onClick={() => setMoreOpen((v) => !v)} aria-label="More options" className="text-[#9AA8B8] hover:text-[#66758C]"><MoreHorizontal className="w-4 h-4" /></button>
            {moreOpen && (
              <div className="absolute right-0 mt-1 z-20 w-48 bg-white border border-[#E6EDF5] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] py-1">
                <button onClick={() => { copyText(customer.id, "Customer ID"); setMoreOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[12px] text-[#4A5A73] hover:bg-[#F7FAFC]"><Copy className="w-3.5 h-3.5" /> Copy customer ID</button>
                <button onClick={() => { exportProfile(); setMoreOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[12px] text-[#4A5A73] hover:bg-[#F7FAFC]"><FileText className="w-3.5 h-3.5" /> Export profile CSV</button>
                <button onClick={() => { setMoreOpen(false); window.print(); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[12px] text-[#4A5A73] hover:bg-[#F7FAFC]"><Printer className="w-3.5 h-3.5" /> Print</button>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          {timeline.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={`${t.title}-${i}`} className="flex items-start gap-3">
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

      {/* Edit billing address modal */}
      <Modal
        open={billingOpen}
        onClose={() => setBillingOpen(false)}
        title="Edit billing address"
        description={`Update billing address for ${customer.name}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setBillingOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveBilling}>Save address</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name">
            <TextInput value={billingDraft.name} onChange={(e) => setBillingDraft({ ...billingDraft, name: e.target.value })} />
          </Field>
          <Field label="Street Address" required>
            <TextInput value={billingDraft.street1} onChange={(e) => setBillingDraft({ ...billingDraft, street1: e.target.value })} />
          </Field>
          <Field label="Apartment / Suite">
            <TextInput value={billingDraft.street2} onChange={(e) => setBillingDraft({ ...billingDraft, street2: e.target.value })} />
          </Field>
          <Field label="City, State ZIP">
            <TextInput value={billingDraft.cityStateZip} onChange={(e) => setBillingDraft({ ...billingDraft, cityStateZip: e.target.value })} />
          </Field>
          <Field label="Country">
            <TextInput value={billingDraft.country} onChange={(e) => setBillingDraft({ ...billingDraft, country: e.target.value })} />
          </Field>
        </div>
      </Modal>

      {/* Edit shipping address modal */}
      <Modal
        open={shippingOpen}
        onClose={() => setShippingOpen(false)}
        title="Edit shipping address"
        description={`Update shipping address for ${customer.name}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setShippingOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveShipping}>Save address</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name">
            <TextInput value={shippingDraft.name} onChange={(e) => setShippingDraft({ ...shippingDraft, name: e.target.value })} />
          </Field>
          <Field label="Street Address" required>
            <TextInput value={shippingDraft.street1} onChange={(e) => setShippingDraft({ ...shippingDraft, street1: e.target.value })} />
          </Field>
          <Field label="Apartment / Suite">
            <TextInput value={shippingDraft.street2} onChange={(e) => setShippingDraft({ ...shippingDraft, street2: e.target.value })} />
          </Field>
          <Field label="City, State ZIP">
            <TextInput value={shippingDraft.cityStateZip} onChange={(e) => setShippingDraft({ ...shippingDraft, cityStateZip: e.target.value })} />
          </Field>
          <Field label="Country">
            <TextInput value={shippingDraft.country} onChange={(e) => setShippingDraft({ ...shippingDraft, country: e.target.value })} />
          </Field>
        </div>
      </Modal>

      {/* Edit payment method modal */}
      <Modal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title="Edit payment method"
        description={`Update payment method for ${customer.name}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setPaymentOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={savePayment}>Save payment</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Card Type">
            <Select options={CARD_TYPES} value={paymentDraft.type} onChange={(e) => setPaymentDraft({ ...paymentDraft, type: e.target.value })} />
          </Field>
          <Field label="Last 4 Digits" required>
            <TextInput value={paymentDraft.last4} onChange={(e) => setPaymentDraft({ ...paymentDraft, last4: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="4242" maxLength={4} />
          </Field>
        </div>
      </Modal>

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
