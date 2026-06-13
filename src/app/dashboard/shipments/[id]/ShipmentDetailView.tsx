"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Check, ArrowRight, Plus,
  Package, CheckCircle2, Plane, DollarSign, Download, User, Tag, Truck,
} from "lucide-react";
import type { Shipment, ShipmentStatus } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, TextArea, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import { formatCurrency, formatDate } from "@/lib/format";
import ShipmentDetailActions from "./ShipmentDetailActions";

// Deterministic seeded random from a string (shipment ID)
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  // Return value between 0 and 1
  return (Math.abs(h) % 10000) / 10000;
}

function seededRange(seed: string, min: number, max: number): number {
  return min + seededRandom(seed) * (max - min);
}

// Derive package summary from shipment data
function derivePackageSummary(s: Shipment) {
  const w = s.weight ? parseFloat(s.weight) : null;
  const totalWeight = w ?? Math.round(seededRange(s.id + "-wt", 5, 120) * 10) / 10;
  const totalPackages = Math.max(1, Math.round(seededRange(s.id + "-pkg", 1, 20)));
  const totalVolume = Math.round(seededRange(s.id + "-vol", 0.2, 4.5) * 100) / 100;
  const totalItems = Math.max(1, Math.round(seededRange(s.id + "-items", 1, 30)));
  return { totalPackages, totalWeight, totalVolume, totalItems };
}

// Derive cost breakdown deterministically from shipment ID
function deriveCosts(s: Shipment) {
  const base = Math.round(seededRange(s.id + "-base", 180, 820) * 100) / 100;
  const fuel = Math.round(base * seededRange(s.id + "-fuel", 0.06, 0.14) * 100) / 100;
  const residential = Math.round(seededRange(s.id + "-res", 0, 22) * 100) / 100;
  const insurance = Math.round(seededRange(s.id + "-ins", 5, 55) * 100) / 100;
  const other = Math.round(seededRange(s.id + "-other", 0.5, 12) * 100) / 100;
  const total = Math.round((base + fuel + residential + insurance + other) * 100) / 100;
  const rows = [
    { item: "Base Shipping Rate", amount: formatCurrency(base) },
    { item: "Fuel Surcharge", amount: formatCurrency(fuel) },
    { item: "Residential Delivery", amount: formatCurrency(residential) },
    { item: "Insurance", amount: formatCurrency(insurance) },
    { item: "Other Fees", amount: formatCurrency(other) },
    { item: "Total", amount: formatCurrency(total) },
  ];
  return { rows, total };
}

// Derive customer info from shipment data deterministically
function deriveCustomer(s: Shipment) {
  const companies = ["Acme Retail", "Globex Inc.", "TechNova", "Summit Goods", "BlueLine Logistics", "Pinnacle Wholesale", "Horizon Trade", "Meridian Supply"];
  const firstNames = ["John", "Sarah", "Mike", "Emily", "David", "Lisa", "James", "Anna"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
  const domains = ["acmeretail.com", "globex.com", "technova.io", "summitgoods.com", "blueline.com", "pinnacle.co", "horizontrade.com", "meridian.com"];
  const areaCodes = ["310", "212", "415", "602", "303", "512", "617", "206"];
  const idx = Math.round(seededRange(s.id + "-cust", 0, 1) * (companies.length - 1));
  const company = companies[idx];
  const fn = firstNames[idx];
  const ln = lastNames[idx];
  const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@${domains[idx]}`;
  const phone = `+1 (${areaCodes[idx]}) 555-0${(100 + idx * 37).toString().slice(0, 3)}`;
  const address = s.destination || "Unknown Address";
  const since = ["Jan 2024", "Mar 2023", "Jun 2024", "Sep 2022", "Nov 2023"][idx % 5];
  return { company, contact: `${fn} ${ln}`, email, phone, address, since };
}

// Derive progress stepper from shipment status
function deriveProgress(s: Shipment) {
  const allSteps: { label: string; statusSet: ShipmentStatus[] }[] = [
    { label: "Label Created", statusSet: ["Awaiting Pickup", "In Transit", "Customs", "Out for Delivery", "Delivered"] },
    { label: "Picked Up", statusSet: ["In Transit", "Customs", "Out for Delivery", "Delivered"] },
    { label: "In Transit", statusSet: ["In Transit", "Customs", "Out for Delivery", "Delivered"] },
    { label: "Out for Delivery", statusSet: ["Out for Delivery", "Delivered"] },
    { label: "Delivered", statusSet: ["Delivered"] },
  ];
  const completed = allSteps.filter((st) => st.statusSet.includes(s.status));
  // Generate dates stepping backward from shippedDate
  const baseDate = s.shippedDate ? new Date(s.shippedDate) : new Date("2025-05-12");
  return allSteps.map((step, i) => {
    const done = i < completed.length;
    const current = i === completed.length && s.status !== "Exception";
    const stepDate = new Date(baseDate);
    stepDate.setDate(stepDate.getDate() + i);
    const dateStr = stepDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const hour = 8 + Math.round(seededRandom(s.id + "-step" + i) * 10);
    const min = Math.round(seededRandom(s.id + "-min" + i) * 59);
    return { label: step.label, date: `${dateStr}, ${hour}:${min.toString().padStart(2, "0")}`, done, current };
  });
}

// Derive tracking events from shipment status and origin/destination
function deriveTrackingEvents(s: Shipment) {
  const baseDate = s.shippedDate ? new Date(s.shippedDate) : new Date("2025-05-12");
  const events: { date: string; loc: string; event: string; eventColor: string; details: string }[] = [];

  const addEvent = (dayOffset: number, hour: number, min: number, loc: string, event: string, color: string, details: string) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + dayOffset);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    events.push({ date: `${dateStr} ${hour}:${min.toString().padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`, loc, event, eventColor: color, details });
  };

  // Always have label created and picked up
  addEvent(0, 9, 14, s.origin, "Label Created", "#7C6FF6", "Shipment information received");
  addEvent(0, 14, 32, s.origin, "Picked Up", "#0057D8", `Picked up by ${s.carrier}`);

  if (s.status === "In Transit" || s.status === "Customs" || s.status === "Out for Delivery" || s.status === "Delivered") {
    addEvent(1, 3, 21, "In Transit", "In Transit", "#0057D8", `Departed origin facility`);
  }

  if (s.status === "Customs" || s.status === "Out for Delivery" || s.status === "Delivered") {
    addEvent(2, 11, 8, s.destination, "Customs Cleared", "#0057D8", "Clearance completed");
  }

  if (s.status === "Out for Delivery" || s.status === "Delivered") {
    addEvent(3, 9, 20, s.destination, "Arrived at Facility", "#0057D8", `Arrived at ${s.carrier} facility`);
    addEvent(3, 7, 58, s.destination, "Out for Delivery", "#F59E0B", "Out for delivery with courier");
  }

  if (s.status === "Delivered") {
    addEvent(3, 10, 42, s.destination, "Delivered", "#00B894", "Package delivered to recipient");
  }

  return events.reverse(); // newest first
}

// Derive service level deterministically
function deriveServiceLevel(s: Shipment) {
  const levels = ["Express (Air)", "Standard (Ground)", "Economy (Sea)", "Priority (Air)", "Next Day Air"];
  const idx = Math.round(seededRange(s.id + "-svc", 0, 1) * (levels.length - 1));
  const days = ["5 - 7 business days", "7 - 10 business days", "15 - 25 business days", "2 - 3 business days", "1 business day"];
  return { name: levels[idx], eta: days[idx] };
}

// Derive dimensions deterministically
function deriveDimensions(s: Shipment) {
  const w = Math.round(seededRange(s.id + "-dw", 30, 180));
  const h = Math.round(seededRange(s.id + "-dh", 20, 120));
  const d = Math.round(seededRange(s.id + "-dd", 15, 100));
  return `${w} x ${h} x ${d} cm`;
}

// Derive linked order details deterministically
function deriveLinkedOrder(s: Shipment) {
  const total = Math.round(seededRange(s.id + "-ototal", 800, 12000) * 100) / 100;
  const skuCount = Math.max(1, Math.round(seededRange(s.id + "-oskus", 1, 15)));
  const statuses: Array<"Pending" | "Processing" | "In Transit" | "Delivered" | "Cancelled"> = ["Pending", "Processing", "In Transit", "Delivered", "Cancelled"];
  const stIdx = Math.round(seededRange(s.id + "-ost", 0, 1) * (statuses.length - 1));
  return { total, skuCount, status: statuses[stIdx] };
}

const CARRIERS = ["FedEx", "UPS", "USPS", "DHL", "DHL Express"];

export default function ShipmentDetailView({ shipment }: { shipment: Shipment }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [costOpen, setCostOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [addEventDraft, setAddEventDraft] = useState({ location: "", status: "In Transit", notes: "" });

  // Derive all dynamic data from the shipment
  const packages = useMemo(() => derivePackageSummary(shipment), [shipment]);
  const costs = useMemo(() => deriveCosts(shipment), [shipment]);
  const customer = useMemo(() => deriveCustomer(shipment), [shipment]);
  const progressSteps = useMemo(() => deriveProgress(shipment), [shipment]);
  const serviceLevel = useMemo(() => deriveServiceLevel(shipment), [shipment]);
  const dimensions = useMemo(() => deriveDimensions(shipment), [shipment]);
  const linkedOrder = useMemo(() => deriveLinkedOrder(shipment), [shipment]);

  // Update carrier — carrier/trackingNumber persist via the shipments API;
  // the tracking-history entry is appended locally for this session.
  const [trackingEvents, setTrackingEvents] = useState(() => deriveTrackingEvents(shipment));
  const [carrierOpen, setCarrierOpen] = useState(false);
  const [carrierDraft, setCarrierDraft] = useState({
    carrier: CARRIERS.includes(shipment.carrier) ? shipment.carrier : CARRIERS[0],
    trackingNumber: shipment.trackingNumber,
  });

  async function saveCarrier() {
    if (!carrierDraft.trackingNumber.trim()) { toast("Tracking number is required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/shipments/${shipment.id}`, {
        carrier: carrierDraft.carrier,
        trackingNumber: carrierDraft.trackingNumber.trim(),
      });
      const now = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
      setTrackingEvents((prev) => [{
        date: now,
        loc: shipment.origin,
        event: "Carrier Updated",
        eventColor: "#7C6FF6",
        details: `Carrier set to ${carrierDraft.carrier} · Tracking ${carrierDraft.trackingNumber.trim()}`,
      }, ...prev]);
      toast(`Carrier updated to ${carrierDraft.carrier}`);
      setCarrierOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update carrier", "error");
    } finally { setBusy(false); }
  }

  async function addTrackingEvent() {
    if (!addEventDraft.location.trim()) { toast("Location is required", "error"); return; }
    setBusy(true);
    try {
      const now = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
      const colorMap: Record<string, string> = {
        "Label Created": "#7C6FF6", "Picked Up": "#0057D8", "In Transit": "#0057D8",
        "Arrived at Facility": "#0057D8", "Customs Cleared": "#0057D8",
        "Out for Delivery": "#F59E0B", "Delivered": "#00B894", "Exception": "#EF4444",
      };
      setTrackingEvents((prev) => [{
        date: now,
        loc: addEventDraft.location.trim(),
        event: addEventDraft.status,
        eventColor: colorMap[addEventDraft.status] || "#0057D8",
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
            <p className="text-[13px] font-medium text-[#061A3D]">{shipment.shippedDate ? formatDate(shipment.shippedDate) : "—"}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Status</p>
            <StatusBadge status={shipment.status} />
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Weight</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{shipment.weight ?? "—"}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Dimensions</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{dimensions}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Cost</p>
            <p className="text-[14px] font-bold text-[#061A3D]">{formatCurrency(costs.total)}</p>
          </div>
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><Package className="w-4 h-4 text-[#0057D8]" /><span className="text-[13px] font-semibold text-[#061A3D]">Package Summary</span></div>
          <div className="grid grid-cols-4 gap-2">
            {[
              [String(packages.totalPackages), "Total Packages"],
              [`${packages.totalWeight} kg`, "Total Weight"],
              [`${packages.totalVolume} m³`, "Total Volume"],
              [String(packages.totalItems), "Items"],
            ].map(([v, l]) => (
              <div key={l}><p className="text-[16px] font-bold text-[#061A3D]">{v}</p><p className="text-[10px] text-[#9AA8B8]">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><CheckCircle2 className="w-4 h-4 text-[#00B894]" /><span className="text-[13px] font-semibold text-[#061A3D]">Shipment Status</span></div>
          <p className={`text-[18px] font-bold ${shipment.status === "Exception" ? "text-[#EF4444]" : "text-[#00B894]"}`}>{shipment.status}</p>
          <p className="text-[11px] text-[#9AA8B8] mt-1">Current shipment status</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><Plane className="w-4 h-4 text-[#0057D8]" /><span className="text-[13px] font-semibold text-[#061A3D]">Service Level</span></div>
          <p className="text-[18px] font-bold text-[#061A3D]">{serviceLevel.name}</p>
          <p className="text-[11px] text-[#9AA8B8] mt-1">{serviceLevel.eta}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><DollarSign className="w-4 h-4 text-[#00B894]" /><span className="text-[13px] font-semibold text-[#061A3D]">Cost Summary</span></div>
          <p className="text-[18px] font-bold text-[#061A3D]">{formatCurrency(costs.total)}</p>
          <p className="text-[11px] text-[#9AA8B8] mt-1">Total Shipping Cost</p>
        </div>
      </div>

      {/* Progress + Customs + POD */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
        {/* Shipment Progress + map */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-5">Shipment Progress</h3>
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
                  <p className={`text-[10px] text-center whitespace-nowrap ${p.done ? "text-[#9AA8B8]" : "text-[#C4CDD5]"}`}>{p.date}</p>
                </div>
                {i < progressSteps.length - 1 && (
                  <div className={`h-0.5 flex-1 mt-3.5 ${p.done ? "bg-[#00B894]" : "bg-[#E6EDF5]"}`} />
                )}
              </div>
            ))}
          </div>
          {/* Route map: origin -> destination with flag markers + On Time overlay */}
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
            {/* On Time / Est ETA overlay */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-lg border border-[#E6EDF5] shadow-sm px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B894]" />
                <span className="text-[12px] font-semibold text-[#00B894]">On Time</span>
              </div>
              <p className="text-[10px] text-[#9AA8B8] mt-0.5">Est. ETA {shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : "—"}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Customer Information</h3>
          {/* Customer avatar placeholder */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
              <User className="w-5 h-5 text-[#0057D8]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#061A3D]">{customer.company}</p>
              <p className="text-[11px] text-[#9AA8B8]">Customer since {customer.since}</p>
            </div>
          </div>
          <div className="space-y-2.5 text-[12px]">
            <div className="flex justify-between"><span className="text-[#66758C]">Contact Name</span><span className="font-medium text-[#061A3D]">{customer.contact}</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Email</span><span className="font-medium text-[#061A3D]">{customer.email}</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Phone</span><span className="font-medium text-[#061A3D]">{customer.phone}</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Address</span><span className="font-medium text-[#061A3D] text-right max-w-[140px]">{customer.address}</span></div>
          </div>
          <Link href="/dashboard/customers" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Customer Profile <ArrowRight className="w-3 h-3" /></Link>
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
            <div className="flex justify-between"><span className="text-[#66758C]">Label Type</span><span className="font-medium text-[#061A3D]">Master Label</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Service</span><span className="font-medium text-[#061A3D]">{shipment.carrier}</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Created</span><span className="font-medium text-[#061A3D]">{shipment.shippedDate ? formatDate(shipment.shippedDate) : "—"}</span></div>
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
            View Full Tracking History <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Sidebar: cost breakdown + linked order */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Shipping Cost Breakdown</h3>
            <div className="space-y-2 text-[12px]">
              {costs.rows.map((r) => (
                <div key={r.item} className={`flex justify-between ${r.item === "Total" ? "pt-2 border-t border-[#E6EDF5]" : ""}`}>
                  <span className={r.item === "Total" ? "font-semibold text-[#061A3D]" : "text-[#66758C]"}>{r.item}</span>
                  <span className={r.item === "Total" ? "font-bold text-[#061A3D]" : "font-medium text-[#061A3D]"}>{r.amount}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setCostOpen(true)} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Cost Details <ArrowRight className="w-3 h-3" /></button>
          </div>

          {shipment.orderId && (
            <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
              <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Linked Order</h3>
              <div className="flex items-center justify-between mb-3">
                <Link href={`/dashboard/orders/${shipment.orderId}`} className="text-[15px] font-bold text-[#0057D8] hover:underline">{shipment.orderId}</Link>
                <StatusBadge status={linkedOrder.status} />
              </div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between"><span className="text-[#66758C]">Customer</span><span className="font-medium text-[#061A3D]">{customer.company}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Order Date</span><span className="font-medium text-[#061A3D]">{shipment.shippedDate ? formatDate(shipment.shippedDate) : "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Items</span><span className="font-medium text-[#061A3D]">{linkedOrder.skuCount} SKU{linkedOrder.skuCount !== 1 ? "s" : ""}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Order Total</span><span className="font-medium text-[#061A3D]">{formatCurrency(linkedOrder.total)}</span></div>
              </div>
              <Link href={`/dashboard/orders/${shipment.orderId}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Order Details <ArrowRight className="w-3 h-3" /></Link>
            </div>
          )}
        </div>
      </div>

      {/* Cost details modal */}
      <Modal
        open={costOpen}
        onClose={() => setCostOpen(false)}
        title="Shipping Cost Details"
        description={`Full cost breakdown for ${shipment.id}.`}
        footer={
          <>
            <SecondaryButton onClick={() => setCostOpen(false)}>Close</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                exportToCsv(`${shipment.id}-cost-breakdown`, costs.rows, [
                  { key: "item", header: "Item" },
                  { key: "amount", header: "Amount" },
                ]);
                toast("Cost breakdown exported");
              }}
            >
              Export CSV
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-2 text-[13px]">
          {costs.rows.map((c) => (
            <div key={c.item} className={`flex justify-between ${c.item === "Total" ? "pt-2 border-t border-[#E5E7EB] font-semibold text-[#061A3D]" : "text-[#4A5A73]"}`}>
              <span>{c.item}</span>
              <span className={c.item === "Total" ? "font-bold text-[#061A3D]" : "font-medium text-[#061A3D]"}>{c.amount}</span>
            </div>
          ))}
        </div>
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
