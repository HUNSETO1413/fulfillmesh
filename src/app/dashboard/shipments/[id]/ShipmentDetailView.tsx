"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Check, ArrowRight, Plus,
  Package, CheckCircle2, Plane, DollarSign, Download, User, Tag, Truck,
} from "lucide-react";
import type { Shipment, ShipmentStatus, Order, Customer } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, TextArea, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import { formatCurrency, formatDate } from "@/lib/format";
import ShipmentDetailActions from "./ShipmentDetailActions";

const DASH = "—";

interface TrackingEvent {
  date: string;
  loc: string;
  event: string;
  eventColor: string;
  details: string;
}

const EVENT_COLORS: Record<string, string> = {
  "Label Created": "#7C6FF6",
  "Picked Up": "#0057D8",
  "In Transit": "#0057D8",
  "Arrived at Facility": "#0057D8",
  "Customs Cleared": "#0057D8",
  "Out for Delivery": "#F59E0B",
  Delivered: "#00B894",
  Exception: "#EF4444",
  "Carrier Updated": "#7C6FF6",
};

// ---------------------------------------------------------------------------
// Real, status-driven derivations. Nothing here invents history — every value
// is read from the shipment's own fields (status, shippedDate, estimatedDelivery,
// origin, destination, carrier). Sub-fields with no backing data render as "—".
// ---------------------------------------------------------------------------

// Ordered lifecycle. Each step is "done" once the shipment has progressed past it.
const PROGRESS_STEPS: { label: string; reachedBy: ShipmentStatus[] }[] = [
  { label: "Label Created", reachedBy: ["Awaiting Pickup", "In Transit", "Customs", "Out for Delivery", "Delivered"] },
  { label: "Picked Up", reachedBy: ["In Transit", "Customs", "Out for Delivery", "Delivered"] },
  { label: "In Transit", reachedBy: ["In Transit", "Customs", "Out for Delivery", "Delivered"] },
  { label: "Out for Delivery", reachedBy: ["Out for Delivery", "Delivered"] },
  { label: "Delivered", reachedBy: ["Delivered"] },
];

function deriveProgress(s: Shipment) {
  const completedCount = PROGRESS_STEPS.filter((step) => step.reachedBy.includes(s.status)).length;
  const shipped = s.shippedDate ? new Date(s.shippedDate) : null;
  const delivered = s.estimatedDelivery ? new Date(s.estimatedDelivery) : null;

  return PROGRESS_STEPS.map((step, i) => {
    const done = i < completedCount;
    const current = i === completedCount && s.status !== "Exception";
    // Honest dates: first steps anchor on shippedDate, the delivered step on
    // the (estimated) delivery date. Steps with no anchor show no date.
    let date = "";
    if (step.label === "Delivered" && done && delivered) {
      date = delivered.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (done && shipped) {
      date = shipped.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return { label: step.label, date, done, current };
  });
}

// Build the tracking feed from the shipment's real status + dates only.
function deriveTrackingEvents(s: Shipment): TrackingEvent[] {
  const events: TrackingEvent[] = [];
  const shippedStr = s.shippedDate
    ? new Date(s.shippedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Date pending";
  const etaStr = s.estimatedDelivery
    ? new Date(s.estimatedDelivery).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : shippedStr;

  const push = (date: string, loc: string, event: string, details: string) =>
    events.push({ date, loc, event, eventColor: EVENT_COLORS[event] ?? "#0057D8", details });

  push(shippedStr, s.origin, "Label Created", "Shipment information received");

  if (s.status === "Exception") {
    push(shippedStr, s.origin, "Exception", "A delivery exception was reported for this shipment");
    return events.reverse();
  }

  const isPast = (set: ShipmentStatus[]) => set.includes(s.status);

  if (isPast(["In Transit", "Customs", "Out for Delivery", "Delivered"])) {
    push(shippedStr, s.origin, "Picked Up", `Picked up by ${s.carrier}`);
    push(shippedStr, s.origin, "In Transit", "Departed origin facility");
  }
  if (isPast(["Customs", "Out for Delivery", "Delivered"])) {
    push(etaStr, s.destination, "Customs Cleared", "Customs clearance completed");
  }
  if (isPast(["Out for Delivery", "Delivered"])) {
    push(etaStr, s.destination, "Out for Delivery", `Out for delivery with ${s.carrier}`);
  }
  if (s.status === "Delivered") {
    push(etaStr, s.destination, "Delivered", "Package delivered to recipient");
  }

  return events.reverse(); // newest first
}

const CARRIERS = ["FedEx", "UPS", "USPS", "DHL", "DHL Express"];

export default function ShipmentDetailView({ shipment }: { shipment: Shipment }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [costOpen, setCostOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [addEventDraft, setAddEventDraft] = useState({ location: "", status: "In Transit", notes: "" });

  // ---- Real linked order + customer, fetched on mount ----
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orderLoading, setOrderLoading] = useState<boolean>(!!shipment.orderId);

  useEffect(() => {
    const orderId = shipment.orderId;
    if (!orderId) return; // initial state already reflects "no linked order".
    let cancelled = false;
    // All state updates below run inside async callbacks, never synchronously
    // in the effect body, so the linked order/customer load on mount.
    (async () => {
      try {
        const o = await api.get<Order>(`/api/orders/${orderId}`);
        if (cancelled) return;
        setOrder(o);
        if (o.customerId) {
          try {
            const c = await api.get<Customer>(`/api/customers/${o.customerId}`);
            if (!cancelled) setCustomer(c);
          } catch {
            // Customer not resolvable — fall back to the order's plain name.
            if (!cancelled) setCustomer(null);
          }
        }
      } catch {
        if (!cancelled) {
          setOrder(null);
          setCustomer(null);
        }
      } finally {
        if (!cancelled) setOrderLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [shipment.orderId]);

  // Real package summary: weight from the shipment field; item count from the
  // linked order's real line items. No backing data for packages/volume → "—".
  const itemCount = useMemo(
    () => order?.items?.reduce((sum, it) => sum + it.quantity, 0) ?? null,
    [order],
  );
  const skuCount = order?.items?.length ?? null;

  // Real cost: the linked order total is the authoritative monetary figure for
  // this shipment. With no order, there is no real cost to show.
  const orderTotal = order?.total ?? null;

  const progressSteps = useMemo(() => deriveProgress(shipment), [shipment]);

  // Tracking feed is derived from the real status/dates, but stays editable so
  // manual events and carrier-update entries can be appended this session.
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>(() => deriveTrackingEvents(shipment));

  const [carrierOpen, setCarrierOpen] = useState(false);
  const [carrierDraft, setCarrierDraft] = useState({
    carrier: CARRIERS.includes(shipment.carrier) ? shipment.carrier : CARRIERS[0],
    trackingNumber: shipment.trackingNumber,
  });

  // Customer fields, resolved from the real customer record, then the order's
  // plain customer name, then an honest fallback.
  const customerName = customer?.company || customer?.name || order?.customer || null;
  const customerContact = customer?.name || order?.customer || null;
  const customerEmail = customer?.email || null;
  const customerPhone = customer?.phone || null;
  const customerAddress = order?.destination || shipment.destination || null;
  const customerSince = customer?.joinedDate ? formatDate(customer.joinedDate) : null;

  // The shipment is "delivered" when status says so; otherwise treat ETA as the
  // real on-time signal (overdue if the estimate is already in the past). The
  // wall-clock read happens once on mount to keep render pure.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // Defer the wall-clock read off the effect body so render stays pure and
    // there is no synchronous cascading re-render.
    const id = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);
  const isOverdue = useMemo(() => {
    if (now == null || !shipment.estimatedDelivery || shipment.status === "Delivered") return false;
    return new Date(shipment.estimatedDelivery).getTime() < now;
  }, [now, shipment.estimatedDelivery, shipment.status]);

  async function saveCarrier() {
    if (!carrierDraft.trackingNumber.trim()) { toast("Tracking number is required", "error"); return; }
    setBusy(true);
    const now = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
    const optimisticEvent: TrackingEvent = {
      date: now,
      loc: shipment.origin,
      event: "Carrier Updated",
      eventColor: EVENT_COLORS["Carrier Updated"],
      details: `Carrier set to ${carrierDraft.carrier} · Tracking ${carrierDraft.trackingNumber.trim()}`,
    };
    // Optimistically prepend; roll back if the API call fails.
    setTrackingEvents((prev) => [optimisticEvent, ...prev]);
    try {
      await api.put(`/api/shipments/${shipment.id}`, {
        carrier: carrierDraft.carrier,
        trackingNumber: carrierDraft.trackingNumber.trim(),
      });
      toast(`Carrier updated to ${carrierDraft.carrier}`);
      setCarrierOpen(false);
      router.refresh();
    } catch (e) {
      // Roll back the optimistic tracking entry.
      setTrackingEvents((prev) => prev.filter((ev) => ev !== optimisticEvent));
      toast(e instanceof Error ? e.message : "Could not update carrier", "error");
    } finally { setBusy(false); }
  }

  function addTrackingEvent() {
    if (!addEventDraft.location.trim()) { toast("Location is required", "error"); return; }
    setBusy(true);
    try {
      const now = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
      setTrackingEvents((prev) => [{
        date: now,
        loc: addEventDraft.location.trim(),
        event: addEventDraft.status,
        eventColor: EVENT_COLORS[addEventDraft.status] || "#0057D8",
        details: addEventDraft.notes.trim() || `Status updated to ${addEventDraft.status}`,
      }, ...prev]);
      toast("Tracking event added");
      setAddEventOpen(false);
      setAddEventDraft({ location: "", status: "In Transit", notes: "" });
    } finally { setBusy(false); }
  }

  function downloadLabel() {
    exportToCsv(`${shipment.id}-label`, [
      { field: "Tracking Number", value: shipment.trackingNumber },
      { field: "Carrier", value: shipment.carrier },
      { field: "Origin", value: shipment.origin },
      { field: "Destination", value: shipment.destination },
      { field: "Status", value: shipment.status },
    ], [
      { key: "field", header: "Field" },
      { key: "value", header: "Value" },
    ]);
    toast("Shipping label exported");
  }

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div>
        <Link href="/dashboard/shipments" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#66758C] hover:text-[#061A3D] mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Shipments
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#061A3D]">Shipment Detail</h1>
            <p className="text-[14px] text-[#4A5A73] mt-0.5">View real-time tracking, shipment status, and delivery information.</p>
          </div>
          <ShipmentDetailActions shipment={shipment} />
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
        <div className="grid items-start" style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))", gap: "20px" }}>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Shipment ID</p>
            <p className="text-[14px] font-semibold text-[#061A3D] font-mono">{shipment.id}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Carrier</p>
            <p className="text-[14px] font-semibold text-[#061A3D]">{shipment.carrier}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Origin</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{shipment.origin}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Destination</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{shipment.destination}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Date</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{shipment.shippedDate ? formatDate(shipment.shippedDate) : DASH}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Status</p>
            <StatusBadge status={shipment.status} />
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Weight</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{shipment.weight ?? DASH}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Dimensions</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{DASH}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Order Total</p>
            <p className="text-[14px] font-bold text-[#061A3D]">{orderTotal != null ? formatCurrency(orderTotal) : DASH}</p>
          </div>
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><Package className="w-4 h-4 text-[#0057D8]" /><span className="text-[13px] font-semibold text-[#061A3D]">Package Summary</span></div>
          <div className="grid grid-cols-4 gap-2">
            {[
              [shipment.weight ?? DASH, "Weight"],
              [skuCount != null ? String(skuCount) : DASH, "SKUs"],
              [itemCount != null ? String(itemCount) : DASH, "Items"],
              [orderTotal != null ? formatCurrency(orderTotal) : DASH, "Order Value"],
            ].map(([v, l]) => (
              <div key={l}><p className="text-[16px] font-bold text-[#061A3D] truncate">{v}</p><p className="text-[10px] text-[#9AA8B8]">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><CheckCircle2 className="w-4 h-4 text-[#00B894]" /><span className="text-[13px] font-semibold text-[#061A3D]">Shipment Status</span></div>
          <p className={`text-[18px] font-bold ${shipment.status === "Exception" ? "text-[#EF4444]" : "text-[#00B894]"}`}>{shipment.status}</p>
          <p className="text-[11px] text-[#9AA8B8] mt-1">Current shipment status</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><Plane className="w-4 h-4 text-[#0057D8]" /><span className="text-[13px] font-semibold text-[#061A3D]">Estimated Delivery</span></div>
          <p className="text-[18px] font-bold text-[#061A3D]">{shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : DASH}</p>
          <p className="text-[11px] text-[#9AA8B8] mt-1">{shipment.shippedDate ? `Shipped ${formatDate(shipment.shippedDate)}` : "Awaiting dispatch"}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><DollarSign className="w-4 h-4 text-[#00B894]" /><span className="text-[13px] font-semibold text-[#061A3D]">Order Value</span></div>
          <p className="text-[18px] font-bold text-[#061A3D]">{orderTotal != null ? formatCurrency(orderTotal) : DASH}</p>
          <p className="text-[11px] text-[#9AA8B8] mt-1">{order ? `Linked order ${order.id}` : "No linked order"}</p>
        </div>
      </div>

      {/* Progress + Customs + POD */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
        {/* Shipment Progress + map */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-5">Shipment Progress</h3>
          {shipment.status === "Exception" ? (
            <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 mb-4">
              <p className="text-[13px] font-semibold text-[#EF4444]">Delivery Exception</p>
              <p className="text-[12px] text-[#9A3412] mt-0.5">This shipment hit an exception in transit and is not progressing normally.</p>
            </div>
          ) : (
            <div className="flex items-start mb-4">
              {progressSteps.map((p, i) => (
                <div key={p.label} className="flex items-start" style={{ flex: i === progressSteps.length - 1 ? "0 0 auto" : "1 1 0" }}>
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      p.done ? "bg-[#00B894]" : p.current ? "bg-[#0057D8] ring-4 ring-[#0057D8]/20" : "bg-[#E6EDF5]"
                    }`}>
                      {p.done ? <Check className="w-4 h-4 text-white" /> : p.current ? <div className="w-2 h-2 rounded-full bg-white" /> : null}
                    </div>
                    <p className={`text-[11px] mt-2 text-center whitespace-nowrap ${p.done || p.current ? "font-medium text-[#061A3D]" : "text-[#9AA8B8]"}`}>{p.label}</p>
                    <p className={`text-[10px] text-center whitespace-nowrap ${p.done ? "text-[#9AA8B8]" : "text-[#C4CDD5]"}`}>{p.date || DASH}</p>
                  </div>
                  {i < progressSteps.length - 1 && (
                    <div className={`h-0.5 flex-1 mt-3.5 ${p.done ? "bg-[#00B894]" : "bg-[#E6EDF5]"}`} />
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Route map: origin -> destination with flag markers + status overlay */}
          <div className="mt-4 rounded-lg h-[200px] relative overflow-hidden border border-[#E6EDF5]" style={{ background: "linear-gradient(135deg,#EFF6FF 0%,#F7FAFC 100%)" }}>
            <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              {/* simplified continents */}
              <path d="M20,70 q30,-20 70,-10 q40,10 50,40 q-10,30 -50,30 q-50,5 -70,-20 z" fill="#DCE7F4" />
              <path d="M250,60 q40,-15 90,5 q30,25 20,55 q-40,25 -90,10 q-40,-15 -20,-75 z" fill="#DCE7F4" />
              {/* route arc */}
              <path d="M70,110 Q200,30 330,95" fill="none" stroke="#0057D8" strokeWidth="2" strokeDasharray="5 4" />
              {/* plane along route */}
              <path d="M198,58 l11,5 l-11,5 l3,-5 z" fill="#0057D8" />
              {/* origin marker + flag */}
              <g transform="translate(70,110)">
                <circle r="6" fill="#EF4444" />
                <circle r="11" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.4" />
                <rect x="6" y="-20" width="14" height="10" fill="#DE2910" />
                <line x1="6" y1="-20" x2="6" y2="-2" stroke="#9AA8B8" strokeWidth="1" />
              </g>
              <text x="70" y="135" textAnchor="middle" fontSize="9" fontWeight="600" fill="#061A3D">{shipment.origin}</text>
              {/* destination marker + flag */}
              <g transform="translate(330,95)">
                <circle r="6" fill="#0057D8" />
                <circle r="11" fill="none" stroke="#0057D8" strokeWidth="1" opacity="0.4" />
                <rect x="6" y="-20" width="14" height="10" fill="#3C3B6E" />
                <line x1="6" y1="-20" x2="6" y2="-2" stroke="#9AA8B8" strokeWidth="1" />
              </g>
              <text x="330" y="120" textAnchor="middle" fontSize="9" fontWeight="600" fill="#061A3D">{shipment.destination}</text>
            </svg>
            {/* Status / Est ETA overlay — reflects the shipment's real state */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-lg border border-[#E6EDF5] shadow-sm px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${shipment.status === "Exception" || isOverdue ? "bg-[#EF4444]" : shipment.status === "Delivered" ? "bg-[#00B894]" : "bg-[#0057D8]"}`} />
                <span className={`text-[12px] font-semibold ${shipment.status === "Exception" || isOverdue ? "text-[#EF4444]" : shipment.status === "Delivered" ? "text-[#00B894]" : "text-[#0057D8]"}`}>
                  {shipment.status === "Exception" ? "Exception" : shipment.status === "Delivered" ? "Delivered" : isOverdue ? "Overdue" : "In Progress"}
                </span>
              </div>
              <p className="text-[10px] text-[#9AA8B8] mt-0.5">Est. ETA {shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : DASH}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Customer Information</h3>
          {orderLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF]" />
                <div className="flex-1 space-y-1.5"><div className="h-3 w-2/3 bg-[#EEF2F7] rounded" /><div className="h-2.5 w-1/2 bg-[#EEF2F7] rounded" /></div>
              </div>
              <div className="h-2.5 w-full bg-[#EEF2F7] rounded" />
              <div className="h-2.5 w-5/6 bg-[#EEF2F7] rounded" />
              <div className="h-2.5 w-3/4 bg-[#EEF2F7] rounded" />
            </div>
          ) : customerName ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#0057D8]" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#061A3D]">{customerName}</p>
                  <p className="text-[11px] text-[#9AA8B8]">{customerSince ? `Customer since ${customerSince}` : "Linked customer"}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-[12px]">
                <div className="flex justify-between"><span className="text-[#66758C]">Contact Name</span><span className="font-medium text-[#061A3D]">{customerContact ?? DASH}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Email</span><span className="font-medium text-[#061A3D]">{customerEmail ?? DASH}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Phone</span><span className="font-medium text-[#061A3D]">{customerPhone ?? DASH}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Address</span><span className="font-medium text-[#061A3D] text-right max-w-[140px]">{customerAddress ?? DASH}</span></div>
              </div>
              <Link
                href={customer ? `/dashboard/customers/${customer.id}` : "/dashboard/customers"}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3"
              >
                View Customer Profile <ArrowRight className="w-3 h-3" />
              </Link>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-2">
                <User className="w-5 h-5 text-[#9AA8B8]" />
              </div>
              <p className="text-[13px] text-[#66758C]">No customer linked</p>
              <p className="text-[11px] text-[#9AA8B8] mt-0.5">This shipment has no associated order.</p>
            </div>
          )}
        </div>

        {/* Shipping Label */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Shipping Label</h3>
          {/* Label preview */}
          <div className="rounded-lg border border-[#E6EDF5] bg-[#F7FAFC] h-[88px] flex flex-col items-center justify-center mb-3">
            <Tag className="w-6 h-6 text-[#9AA8B8] mb-1" />
            <p className="text-[11px] text-[#9AA8B8] font-mono">{shipment.trackingNumber}</p>
          </div>
          <div className="space-y-2.5 text-[12px]">
            <div className="flex justify-between"><span className="text-[#66758C]">Tracking No.</span><span className="font-medium text-[#061A3D] font-mono">{shipment.trackingNumber}</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Carrier</span><span className="font-medium text-[#061A3D]">{shipment.carrier}</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Created</span><span className="font-medium text-[#061A3D]">{shipment.shippedDate ? formatDate(shipment.shippedDate) : DASH}</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Format</span><span className="font-medium text-[#061A3D]">PDF (4x6 in)</span></div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button onClick={downloadLabel} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0057D8] rounded text-[12px] font-medium text-white hover:bg-[#003B7A]"><Download className="w-3.5 h-3.5" /> Download</button>
            <button onClick={() => { window.print(); toast("Sent shipping label to print"); }} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8]">Print Label <ArrowRight className="w-3 h-3" /></button>
          </div>
        </div>
      </div>

      {/* Tracking events + sidebar */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr" }}>
        {/* Tracking Events */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-[#061A3D]">Tracking Events</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAddEventOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0057D8] rounded-lg text-[12px] font-medium text-white hover:bg-[#003B7A] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add event
              </button>
              <button
                onClick={() => { setCarrierDraft({ carrier: CARRIERS.includes(shipment.carrier) ? shipment.carrier : CARRIERS[0], trackingNumber: shipment.trackingNumber }); setCarrierOpen(true); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E6EDF5] rounded-lg text-[12px] font-medium text-[#0057D8] hover:bg-[#F7FAFC] transition-colors"
              >
                <Truck className="w-3.5 h-3.5" /> Update carrier
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6EDF5]">
                <th className="text-left text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider pb-2">Date &amp; Time</th>
                <th className="text-left text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider pb-2">Location</th>
                <th className="text-left text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider pb-2">Status</th>
                <th className="text-left text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider pb-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {trackingEvents.map((e, i) => (
                <tr key={i} className="border-b border-[#F1F5F9] last:border-b-0">
                  <td className="py-2.5 text-[12px] text-[#66758C]">{e.date}</td>
                  <td className="py-2.5 text-[12px] text-[#061A3D]">{e.loc}</td>
                  <td className="py-2.5 text-[12px] font-medium" style={{ color: e.eventColor }}>{e.event}</td>
                  <td className="py-2.5 text-[12px] text-[#66758C]">{e.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => exportToCsv(`${shipment.id}-tracking-history`, trackingEvents, [
              { key: "date", header: "Date & Time" },
              { key: "loc", header: "Location" },
              { key: "event", header: "Status" },
              { key: "details", header: "Details" },
            ])}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3"
          >
            Export Tracking History <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Sidebar: order line items + linked order */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Order Items</h3>
            {orderLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-2.5 w-full bg-[#EEF2F7] rounded" />
                <div className="h-2.5 w-5/6 bg-[#EEF2F7] rounded" />
                <div className="h-2.5 w-2/3 bg-[#EEF2F7] rounded" />
              </div>
            ) : order?.items && order.items.length > 0 ? (
              <>
                <div className="space-y-2 text-[12px]">
                  {order.items.map((it) => (
                    <div key={it.sku} className="flex justify-between gap-2">
                      <span className="text-[#66758C] truncate">{it.name} <span className="text-[#9AA8B8]">×{it.quantity}</span></span>
                      <span className="font-medium text-[#061A3D] whitespace-nowrap">{formatCurrency(it.unitPrice * it.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-[#E6EDF5]">
                    <span className="font-semibold text-[#061A3D]">Order Total</span>
                    <span className="font-bold text-[#061A3D]">{orderTotal != null ? formatCurrency(orderTotal) : DASH}</span>
                  </div>
                </div>
                <button onClick={() => setCostOpen(true)} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Order Items <ArrowRight className="w-3 h-3" /></button>
              </>
            ) : (
              <p className="text-[12px] text-[#9AA8B8] py-2">{order ? "This order has no itemized lines." : "No linked order to itemize."}</p>
            )}
          </div>

          {shipment.orderId && (
            <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
              <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Linked Order</h3>
              <div className="flex items-center justify-between mb-3">
                <Link href={`/dashboard/orders/${shipment.orderId}`} className="text-[15px] font-bold text-[#0057D8] hover:underline">{shipment.orderId}</Link>
                {order ? <StatusBadge status={order.status} /> : orderLoading ? <span className="h-4 w-16 bg-[#EEF2F7] rounded animate-pulse" /> : null}
              </div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between"><span className="text-[#66758C]">Customer</span><span className="font-medium text-[#061A3D]">{customerName ?? (orderLoading ? "…" : DASH)}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Order Date</span><span className="font-medium text-[#061A3D]">{order?.date ? formatDate(order.date) : (shipment.shippedDate ? formatDate(shipment.shippedDate) : DASH)}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Destination</span><span className="font-medium text-[#061A3D] text-right max-w-[140px]">{order?.destination ?? shipment.destination}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Items</span><span className="font-medium text-[#061A3D]">{skuCount != null ? `${skuCount} SKU${skuCount !== 1 ? "s" : ""}` : DASH}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Order Total</span><span className="font-medium text-[#061A3D]">{orderTotal != null ? formatCurrency(orderTotal) : DASH}</span></div>
              </div>
              <Link href={`/dashboard/orders/${shipment.orderId}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Order Details <ArrowRight className="w-3 h-3" /></Link>
            </div>
          )}
        </div>
      </div>

      {/* Order items modal */}
      <Modal
        open={costOpen}
        onClose={() => setCostOpen(false)}
        title="Order Items"
        description={order ? `Line items for order ${order.id}.` : `Items for ${shipment.id}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setCostOpen(false)}>Close</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                exportToCsv(`${shipment.id}-order-items`, order?.items ?? [], [
                  { key: "sku", header: "SKU" },
                  { key: "name", header: "Name" },
                  { key: "quantity", header: "Quantity" },
                  { key: "unitPrice", header: "Unit Price" },
                ]);
                toast("Order items exported");
              }}
            >
              Export CSV
            </PrimaryButton>
          </>
        }
      >
        {order?.items && order.items.length > 0 ? (
          <div className="space-y-2 text-[13px]">
            {order.items.map((it) => (
              <div key={it.sku} className="flex justify-between gap-3">
                <span className="text-[#4A5A73]">{it.name} <span className="text-[#9AA8B8] font-mono text-[11px]">{it.sku}</span> ×{it.quantity}</span>
                <span className="font-medium text-[#061A3D] whitespace-nowrap">{formatCurrency(it.unitPrice * it.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold text-[#061A3D]">
              <span>Total</span>
              <span className="font-bold">{orderTotal != null ? formatCurrency(orderTotal) : DASH}</span>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-[#9AA8B8]">No itemized lines are available for this order.</p>
        )}
      </Modal>

      {/* Add tracking event modal */}
      <Modal
        open={addEventOpen}
        onClose={() => { setAddEventOpen(false); setAddEventDraft({ location: "", status: "In Transit", notes: "" }); }}
        title="Add Tracking Event"
        description={`Manually add a tracking event for ${shipment.id}.`}
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => { setAddEventOpen(false); setAddEventDraft({ location: "", status: "In Transit", notes: "" }); }}>Cancel</SecondaryButton>
            <PrimaryButton onClick={addTrackingEvent} disabled={busy}>{busy ? "Adding…" : "Add event"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Location" required>
            <TextInput placeholder="e.g. Los Angeles, CA, USA" value={addEventDraft.location} onChange={(e) => setAddEventDraft({ ...addEventDraft, location: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select
              options={["Label Created", "Picked Up", "In Transit", "Arrived at Facility", "Customs Cleared", "Out for Delivery", "Delivered", "Exception"]}
              value={addEventDraft.status}
              onChange={(e) => setAddEventDraft({ ...addEventDraft, status: e.target.value })}
            />
          </Field>
          <Field label="Notes">
            <TextArea placeholder="Optional details about this event" value={addEventDraft.notes} onChange={(e) => setAddEventDraft({ ...addEventDraft, notes: e.target.value })} />
          </Field>
        </div>
      </Modal>

      {/* Update carrier modal */}
      <Modal
        open={carrierOpen}
        onClose={() => setCarrierOpen(false)}
        title="Update Carrier"
        description={`Change the carrier or tracking number for ${shipment.id}.`}
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setCarrierOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveCarrier} disabled={busy}>{busy ? "Saving…" : "Update carrier"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Carrier">
            <Select options={CARRIERS} value={carrierDraft.carrier} onChange={(e) => setCarrierDraft({ ...carrierDraft, carrier: e.target.value })} />
          </Field>
          <Field label="Tracking number" required>
            <TextInput value={carrierDraft.trackingNumber} onChange={(e) => setCarrierDraft({ ...carrierDraft, trackingNumber: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
