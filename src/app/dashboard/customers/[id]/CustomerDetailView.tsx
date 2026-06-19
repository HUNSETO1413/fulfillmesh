"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  ChevronDown,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  FileText,
  RotateCcw,
  AlertCircle,
  Tag,
  ArrowRight,
  Pencil,
  Printer,
  Mail,
  Package,
  Truck,
} from "lucide-react";
import type { Customer, Order, Shipment, ReturnRecord } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, Select, TextArea, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import CustomerDetailActions from "./CustomerDetailActions";

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

interface TimelineEntry {
  icon: typeof Plus;
  color: string;
  title: string;
  date: string;
  desc: string;
}

function MiniStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-[#00B894]/10 text-[#00B894]",
    "Out for Delivery": "bg-[#0057D8]/10 text-[#0057D8]",
    "In Transit": "bg-[#0057D8]/10 text-[#0057D8]",
    Processing: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Pending: "bg-[#F59E0B]/10 text-[#F59E0B]",
    "Awaiting Pickup": "bg-[#F59E0B]/10 text-[#F59E0B]",
    Customs: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Exception: "bg-[#EF4444]/10 text-[#EF4444]",
    Cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
    Rejected: "bg-[#EF4444]/10 text-[#EF4444]",
    Refunded: "bg-[#7C6FF6]/10 text-[#7C6FF6]",
    Received: "bg-[#00B894]/10 text-[#00B894]",
    Approved: "bg-[#00B894]/10 text-[#00B894]",
    Requested: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Completed: "bg-[#00B894]/10 text-[#00B894]",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded ${styles[status] || "bg-[#F1F5F9] text-[#66758C]"}`}>
      {status}
    </span>
  );
}

const tabs = ["Overview", "Orders", "Shipments", "Returns", "Notes & Activity"];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const CARD_TYPES = ["Visa", "Mastercard", "American Express", "Discover"];

/* Does an order belong to this customer? Prefer customerId, fall back to name match. */
function orderBelongsToCustomer(order: Order, customer: Customer): boolean {
  if (order.customerId) return order.customerId === customer.id;
  return order.customer.trim().toLowerCase() === customer.name.trim().toLowerCase();
}

function returnBelongsToCustomer(ret: ReturnRecord, customer: Customer, orderIds: Set<string>): boolean {
  if (ret.customer && ret.customer.trim().toLowerCase() === customer.name.trim().toLowerCase()) return true;
  return orderIds.has(ret.orderId);
}

export default function CustomerDetailView({ customer }: { customer: Customer }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(0);

  const [tags, setTags] = useState(initialTags);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tagsDraft, setTagsDraft] = useState(initialTags.join(", "));

  const [notes, setNotes] = useState<Note[]>([]);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const [extraTimeline, setExtraTimeline] = useState<TimelineEntry[]>([]);
  const [showAllRecs, setShowAllRecs] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  /* ---- real related data ---- */
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [returns, setReturns] = useState<ReturnRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  // Reference "now" captured once per load so the 90-day / weekly computations
  // stay stable across re-renders (and keep render-time memos pure).
  const [now, setNow] = useState<number>(() => Date.now());

  /* ---- fetch real orders / shipments / returns on mount ---- */
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setLoadError(null);
      setNow(Date.now());
      try {
        const [ordersRes, shipmentsRes, returnsRes] = await Promise.all([
          api.get<{ data: Order[] }>("/api/orders"),
          api.get<{ data: Shipment[] }>("/api/shipments"),
          api.get<{ data: ReturnRecord[] }>("/api/returns"),
        ]);
        if (cancelled) return;
        const myOrders = ordersRes.data.filter((o) => orderBelongsToCustomer(o, customer));
        const orderIds = new Set(myOrders.map((o) => o.id));
        const myShipments = shipmentsRes.data.filter((s) => s.orderId != null && orderIds.has(s.orderId));
        const myReturns = returnsRes.data.filter((r) => returnBelongsToCustomer(r, customer, orderIds));
        // newest first
        myOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        myReturns.sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
        setOrders(myOrders);
        setShipments(myShipments);
        setReturns(myReturns);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Could not load customer activity");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [customer]);

  const initials = customer.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  /* ---- real lifetime / order metrics computed from fetched data ---- */
  const realOrderCount = orders.length;
  const realTotalSpent = useMemo(() => orders.reduce((sum, o) => sum + (o.total ?? 0), 0), [orders]);
  // Prefer computed values once loaded; fall back to the customer record while loading.
  const orderCount = !loading && realOrderCount > 0 ? realOrderCount : customer.orders;
  const totalSpent = !loading && realOrderCount > 0 ? realTotalSpent : customer.totalSpent;
  const avgOrder = orderCount > 0 ? totalSpent / orderCount : 0;

  /* ---- last-90-day window computed from real orders ---- */
  const chartStats = useMemo(() => {
    const cutoff = now - 90 * 24 * 60 * 60 * 1000;
    const recent = orders.filter((o) => new Date(o.date).getTime() >= cutoff);
    const last90Orders = recent.length;
    const last90Spent = recent.reduce((sum, o) => sum + (o.total ?? 0), 0);
    const last90Aov = last90Orders > 0 ? Math.round(last90Spent / last90Orders) : 0;
    const sharePct = orderCount > 0 ? Math.round((last90Orders / orderCount) * 100) : 0;
    return { last90Orders, last90Spent, last90Aov, sharePct };
  }, [orders, orderCount, now]);

  /* ---- recommended actions derived honestly from real data ---- */
  const recommendedActions = useMemo(() => {
    const acts: { label: string; cta: string; note: string; icon: typeof Plus; href: string; section?: string }[] = [];
    const openReturn = returns.find((r) => r.status === "Requested" || r.status === "Approved");
    if (openReturn) {
      acts.push({
        label: `Resolve open return ${openReturn.id}`,
        cta: "View",
        note: `${openReturn.status} • ${openReturn.reason}`,
        icon: RotateCcw,
        href: `/dashboard/returns/${openReturn.id}`,
      });
    }
    const inTransit = shipments.find((s) => s.status === "In Transit" || s.status === "Out for Delivery" || s.status === "Exception");
    if (inTransit) {
      acts.push({
        label: inTransit.status === "Exception" ? `Review shipment exception ${inTransit.id}` : `Track in-flight shipment ${inTransit.id}`,
        cta: "View",
        note: `${inTransit.carrier} • ${inTransit.status}`,
        icon: inTransit.status === "Exception" ? AlertCircle : Truck,
        href: `/dashboard/shipments/${inTransit.id}`,
      });
    }
    if (orderCount > 0) {
      acts.push({
        label: "Send re-order reminder email",
        cta: "View",
        note: `${formatNumber(orderCount)} lifetime orders`,
        icon: Mail,
        href: "/dashboard/messages",
      });
    }
    if (acts.length === 0) {
      acts.push({
        label: "Create a quote for this customer",
        cta: "Create",
        note: "No open orders or returns",
        icon: Tag,
        href: "/dashboard/quotes/new",
      });
    }
    return acts;
  }, [returns, shipments, orderCount]);

  const visibleRecs = showAllRecs ? recommendedActions : recommendedActions.slice(0, 3);

  /* ---- timeline built from real orders / shipments / returns + user-added entries ---- */
  const timeline = useMemo<TimelineEntry[]>(() => {
    const entries: (TimelineEntry & { ts: number })[] = [];
    for (const o of orders) {
      entries.push({
        icon: Plus,
        color: "#0057D8",
        title: "Order Placed",
        date: formatDate(o.date),
        desc: `Order ${o.id} • ${formatCurrency(o.total ?? 0)}`,
        ts: new Date(o.date).getTime(),
      });
    }
    for (const s of shipments) {
      const when = s.estimatedDelivery ?? s.shippedDate;
      entries.push({
        icon: s.status === "Delivered" ? CheckCircle2 : Truck,
        color: s.status === "Delivered" ? "#00B894" : s.status === "Exception" ? "#EF4444" : "#0057D8",
        title: s.status === "Delivered" ? "Shipment Delivered" : "Shipment Update",
        date: when ? formatDate(when) : "—",
        desc: `${s.id} • ${s.carrier} • ${s.status}`,
        ts: when ? new Date(when).getTime() : 0,
      });
    }
    for (const r of returns) {
      entries.push({
        icon: RotateCcw,
        color: "#EF4444",
        title: r.status === "Refunded" ? "Return Refunded" : "Return Logged",
        date: formatDate(r.requestedDate),
        desc: `Return ${r.id} • ${r.reason}${r.refundAmount ? ` • ${formatCurrency(r.refundAmount)}` : ""}`,
        ts: new Date(r.requestedDate).getTime(),
      });
    }
    entries.sort((a, b) => b.ts - a.ts);
    const real: TimelineEntry[] = entries.slice(0, 6).map((e) => ({
      icon: e.icon,
      color: e.color,
      title: e.title,
      date: e.date,
      desc: e.desc,
    }));
    return [...extraTimeline, ...real];
  }, [orders, shipments, returns, extraTimeline]);

  /* ---- sparkline built from real per-period order totals (last 9 weekly buckets) ---- */
  const sparklinePts = useMemo<number[]>(() => {
    const buckets = new Array(9).fill(0);
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    for (const o of orders) {
      const ageWeeks = Math.floor((now - new Date(o.date).getTime()) / weekMs);
      if (ageWeeks >= 0 && ageWeeks < 9) {
        buckets[8 - ageWeeks] += o.total ?? 0;
      }
    }
    return buckets;
  }, [orders, now]);

  const hasSparklineData = sparklinePts.some((v) => v > 0);

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
    setExtraTimeline((prev) => [{ ...entry, date: today }, ...prev]);
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

  const tabSection: Record<number, string | null> = {
    0: null,
    1: "orders",
    2: "shipments",
    3: "returns",
    4: "notes",
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
            <p className="text-[14px] text-[#4A5A73] mt-0.5">View and manage customer information, orders, shipments, and activity.</p>
          </div>
          <CustomerDetailActions
            customer={customer}
            onChanged={(desc) => appendTimeline({ icon: CheckCircle2, color: "#00B894", title: "Customer Updated", desc })}
          />
        </div>
      </div>

      {loadError && (
        <div className="flex items-center gap-2 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/5 px-4 py-3 text-[13px] text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {loadError}
        </div>
      )}

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
          <p className="text-[26px] font-bold text-[#061A3D] mt-1">{formatCurrency(totalSpent)}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[11px] text-[#9AA8B8]">
              {chartStats.last90Orders > 0
                ? `${formatCurrency(chartStats.last90Spent)} in the last 90 days`
                : "No orders in the last 90 days"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E6EDF5]">
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Total Orders</p>
              <p className="text-[15px] font-bold text-[#061A3D] mt-0.5">{formatNumber(orderCount)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Total Spent</p>
              <p className="text-[15px] font-bold text-[#061A3D] mt-0.5">{formatCurrency(totalSpent)}</p>
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
              <span className="flex items-center gap-0.5 text-[11px] text-[#66758C]">{chartStats.sharePct}% of lifetime</span>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">Spent</p>
              <p className="text-[16px] font-bold text-[#061A3D]">{formatCurrency(chartStats.last90Spent)}</p>
              <span className="flex items-center gap-0.5 text-[11px] text-[#66758C]">last 90 days</span>
            </div>
            <div>
              <p className="text-[11px] text-[#9AA8B8]">AOV</p>
              <p className="text-[16px] font-bold text-[#061A3D]">{formatCurrency(chartStats.last90Aov)}</p>
              <span className="flex items-center gap-0.5 text-[11px] text-[#66758C]">per order</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-[80px] flex-1">
              {hasSparklineData ? (
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
              ) : (
                <div className="h-full flex items-center justify-center text-[11px] text-[#9AA8B8]">
                  {loading ? "Loading order history…" : "No recent order activity to chart"}
                </div>
              )}
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
          {loading ? (
            <p className="py-6 text-center text-[12px] text-[#9AA8B8]">Loading orders…</p>
          ) : orders.length === 0 ? (
            <div className="py-8 flex flex-col items-center text-center">
              <Package className="w-6 h-6 text-[#C7D2DE] mb-2" />
              <p className="text-[12px] text-[#9AA8B8]">No orders for this customer yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-[#F1F5F9] last:border-b-0">
                    <td className="py-2.5 text-[12px] font-medium text-[#0057D8]">
                      <Link href={`/dashboard/orders/${o.id}`} className="hover:underline">{o.id}</Link>
                    </td>
                    <td className="py-2.5 text-[12px] text-[#4A5A73]">{formatDate(o.date)}</td>
                    <td className="py-2.5"><MiniStatusBadge status={o.status} /></td>
                    <td className="py-2.5 text-[12px] font-medium text-[#061A3D] text-right">{formatCurrency(o.total ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Recent Shipments */}
        <div id="shipments" className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#061A3D]">Recent Shipments</h3>
            <Link href="/dashboard/shipments" className="text-[12px] font-medium text-[#0057D8] hover:underline">View all</Link>
          </div>
          {loading ? (
            <p className="py-6 text-center text-[12px] text-[#9AA8B8]">Loading shipments…</p>
          ) : shipments.length === 0 ? (
            <div className="py-8 flex flex-col items-center text-center">
              <Truck className="w-6 h-6 text-[#C7D2DE] mb-2" />
              <p className="text-[12px] text-[#9AA8B8]">No shipments linked to this customer&apos;s orders.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                {shipments.slice(0, 5).map((s) => (
                  <tr key={s.id} className="border-b border-[#F1F5F9] last:border-b-0">
                    <td className="py-2.5 text-[12px] font-medium text-[#0057D8]">
                      <Link href={`/dashboard/shipments/${s.id}`} className="hover:underline">{s.id}</Link>
                    </td>
                    <td className="py-2.5 text-[12px] text-[#4A5A73]">{s.carrier}</td>
                    <td className="py-2.5"><MiniStatusBadge status={s.status} /></td>
                    <td className="py-2.5 text-[12px] text-[#4A5A73] text-right">{s.estimatedDelivery ? formatDate(s.estimatedDelivery) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
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
              {notes.length === 0 ? (
                <p className="text-[12px] text-[#9AA8B8]">No notes yet. Add one to log account context.</p>
              ) : (
                notes.map((n, i) => (
                  <div key={`${n.date}-${i}`} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0057D8] mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#9AA8B8]"><span className="font-medium text-[#061A3D]">{n.date}</span> by Admin</p>
                      <p className="text-[12px] text-[#4A5A73] mt-0.5">{n.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body: row 2 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        {/* Returns History */}
        <div id="returns" className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-24">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#061A3D]">Returns History</h3>
            <Link href="/dashboard/returns" className="text-[12px] font-medium text-[#0057D8] hover:underline">View all</Link>
          </div>
          {loading ? (
            <p className="py-6 text-center text-[12px] text-[#9AA8B8]">Loading returns…</p>
          ) : returns.length === 0 ? (
            <div className="py-8 flex flex-col items-center text-center">
              <RotateCcw className="w-6 h-6 text-[#C7D2DE] mb-2" />
              <p className="text-[12px] text-[#9AA8B8]">No returns on record for this customer.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                {returns.map((r) => (
                  <tr key={r.id} className="border-b border-[#F1F5F9] last:border-b-0">
                    <td className="py-2.5 text-[12px] font-medium text-[#0057D8]">
                      <Link href={`/dashboard/returns/${r.id}`} className="hover:underline">{r.id}</Link>
                    </td>
                    <td className="py-2.5 text-[12px] text-[#4A5A73]">{formatDate(r.requestedDate)}</td>
                    <td className="py-2.5 text-[12px] text-[#061A3D]">{r.reason}</td>
                    <td className="py-2.5 text-right"><MiniStatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Recommended Next Actions */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[14px] font-semibold text-[#061A3D] mb-3">Recommended Next Actions</h3>
          <div className="space-y-3">
            {visibleRecs.map((a) => {
              const Icon = a.icon;
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
                  <Link
                    href={a.href}
                    className="px-3 py-1 text-[12px] font-medium text-[#0057D8] border border-[#E6EDF5] rounded-md hover:bg-[#F7FAFC] shrink-0"
                  >
                    {a.cta}
                  </Link>
                </div>
              );
            })}
          </div>
          {recommendedActions.length > 3 && (
            <button
              onClick={() => setShowAllRecs((v) => !v)}
              className="flex items-center gap-1 text-[12px] font-medium text-[#0057D8] hover:underline mt-3"
            >
              {showAllRecs ? "Show fewer recommendations" : `View all recommendations (${recommendedActions.length})`} <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showAllRecs ? "rotate-90" : ""}`} />
            </button>
          )}
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
        {loading ? (
          <p className="py-6 text-center text-[12px] text-[#9AA8B8]">Building activity timeline…</p>
        ) : timeline.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-[#9AA8B8]">No recorded activity for this customer yet.</p>
        ) : (
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
        )}
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
