"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Calendar, Bell, MoreHorizontal, ChevronDown,
  Box, Lock, CheckCircle2, AlertTriangle,
  Clock, Tag, TrendingUp, Copy, FileText, Printer, SlidersHorizontal, Pencil,
} from "lucide-react";
import type { InventoryItem } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Modal } from "@/components/dashboard/Modal";
import { Field, NumberInput, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import { formatNumber, formatDate } from "@/lib/format";
import InventoryDetailActions from "./InventoryDetailActions";

const tabs = ["Overview", "Stock & Movements", "Purchase Orders", "Allocations", "Adjustments", "Forecast & Replenishment", "Activity Log"];

/* ── Seeded pseudo-random helpers ─────────────────────────────── */

/** Simple deterministic hash from a string, returns integer in [0, range). */
function seededHash(seed: string, offset: number, range: number): number {
  let h = 0;
  const s = seed + ":" + offset;
  for (const c of s) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
  return ((h % range) + range) % range;
}

/** Seeded PRNG (Mulberry32) returning a function that yields values in [0, 1). */
function mulberry32(seed: string, tag: string) {
  let h = 0;
  for (const c of seed + ":" + tag) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
  let state = h >>> 0;
  return () => {
    state |= 0; state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Deterministic data generators ────────────────────────────── */

const BRANDS = ["AquaPure", "FulfillMesh", "HydroLife", "EcoBottle", "ClearSpring", "BlueSource", "PacificEdge", "SummitGoods", "NovaPack", "Zenith Supply"];
const TAG_POOL = [
  { text: "Bestseller", cls: "bg-[#3B82F6]/10 text-[#3B82F6]" },
  { text: "Eco-Friendly", cls: "bg-[#10B981]/10 text-[#10B981]" },
  { text: "Seasonal", cls: "bg-[#F59E0B]/10 text-[#F59E0B]" },
  { text: "Clearance", cls: "bg-[#EF4444]/10 text-[#EF4444]" },
  { text: "New Arrival", cls: "bg-[#8B5CF6]/10 text-[#8B5CF6]" },
  { text: "Promoted", cls: "bg-[#EC4899]/10 text-[#EC4899]" },
  { text: "High-Margin", cls: "bg-[#6366F1]/10 text-[#6366F1]" },
  { text: "Fragile", cls: "bg-[#94A3B8]/10 text-[#94A3B8]" },
];

const WAREHOUSES = ["Los Angeles, CA", "Dallas, TX", "Chicago, IL", "Atlanta, GA", "New York, NY"];
const SUPPLIERS = ["Shenzhen Hydrate Co.", "Pacific Bottling Inc.", "Global Pack Solutions", "EastWest Logistics", "Summit Materials Ltd.", "CoreSupply Inc."];
const CUSTOMERS = ["Acme Retail", "Beta Supplies", "Gamma Corp", "Delta LLC", "Epsilon Goods", "Zeta Distribution", "Eta Wholesalers", "Theta Trading"];
const PO_STATUSES = ["In Transit", "Confirmed", "Confirmed", "Received"];
const ALLOC_STATUSES = ["Picking", "Packed", "Allocated", "Allocated"];
const ADJ_TYPES = ["Cycle Count", "Damage", "Return", "Cycle Count"];
const ADJ_REASONS = ["Cycle count recount", "Damaged in transit", "Customer return restock", "System adjustment"];
const ADJ_USERS = ["John Smith", "Maria Lopez", "John Smith", "Alex Kim"];
const LOCATIONS = ["LA-A12-R04-B02", "DAL-B03-R01-B05", "CHI-C02-R07-B01", "ATL-D05-R03-B04", "NYC-E01-R06-B03"];

function barcodeFor(id: string): string {
  let code = "";
  for (let i = 0; i < 12; i++) code += String(seededHash(id, i, 10));
  return code;
}

function brandFor(id: string): string {
  return BRANDS[seededHash(id, 100, BRANDS.length)];
}

function tagsFor(id: string): { text: string; cls: string }[] {
  const i1 = seededHash(id, 200, TAG_POOL.length);
  let i2 = seededHash(id, 201, TAG_POOL.length);
  if (i2 === i1) i2 = (i2 + 1) % TAG_POOL.length;
  return [TAG_POOL[i1], TAG_POOL[i2]];
}

function warehouseDataFor(item: InventoryItem) {
  const rng = mulberry32(item.id, "wh");
  const totalOnHand = item.onHand;
  const totalReserved = item.reserved;
  const totalAvailable = item.available;
  // Distribute across 5 warehouses with random fractions
  const fracs = Array.from({ length: 5 }, () => rng());
  const sumF = fracs.reduce((a, b) => a + b, 0);
  const entries = fracs.map((f, i) => {
    const onHand = Math.round((f / sumF) * totalOnHand);
    const reserved = Math.min(onHand, Math.round((f / sumF) * totalReserved));
    const available = Math.max(0, onHand - reserved);
    const reorder = Math.max(50, Math.round(onHand * (0.15 + rng() * 0.2)));
    const status = available < reorder ? "Watch" : "Healthy";
    return { wh: WAREHOUSES[i], onHand, reserved, available, reorder, status };
  });
  // Correct rounding drift
  const driftOnHand = totalOnHand - entries.reduce((s, e) => s + e.onHand, 0);
  const driftReserved = totalReserved - entries.reduce((s, e) => s + e.reserved, 0);
  if (entries.length > 0) {
    entries[0].onHand += driftOnHand;
    entries[0].reserved += driftReserved;
    entries[0].available = Math.max(0, entries[0].onHand - entries[0].reserved);
  }
  return entries;
}

function inboundPOsFor(id: string) {
  const rng = mulberry32(id, "po");
  const base = new Date("2026-05-15");
  return Array.from({ length: 4 }, (_, i) => {
    let h = 0; for (const c of id + ":" + i) h = ((h * 31) + c.charCodeAt(0)) % 9000;
    const poNum = `PO-2026-${String(1000 + ((h + i * 237) % 9000)).padStart(4, "0")}`;
    const supplier = SUPPLIERS[Math.floor(rng() * SUPPLIERS.length)];
    const dayOffset = Math.floor(rng() * 30) - 10 + i * 7;
    const eta = new Date(base); eta.setDate(eta.getDate() + dayOffset);
    const qty = Math.floor(rng() * 4000) + 1000;
    const status = PO_STATUSES[i];
    return { po: poNum, supplier, eta: formatDate(eta), qty: status === "Received" ? "0" : formatNumber(qty), qtyRaw: qty, status };
  });
}

function outboundAllocFor(id: string) {
  const rng = mulberry32(id, "alloc");
  const base = new Date("2026-05-22");
  return Array.from({ length: 4 }, (_, i) => {
    let h = 0; for (const c of id + ":o" + i) h = ((h * 31) + c.charCodeAt(0)) % 90000;
    const ref = `ORD-${58000 + ((h + i * 51) % 9999)}`;
    const customer = CUSTOMERS[Math.floor(rng() * CUSTOMERS.length)];
    const dayOffset = Math.floor(rng() * 7) + i;
    const ship = new Date(base); ship.setDate(ship.getDate() + dayOffset);
    const qty = Math.floor(rng() * 600) + 50;
    const status = ALLOC_STATUSES[i];
    return { ref, customer, ship: formatDate(ship), qty: formatNumber(qty), qtyRaw: qty, status };
  });
}

function adjustmentsFor(id: string) {
  const rng = mulberry32(id, "adj");
  const base = new Date("2026-05-16");
  return Array.from({ length: 4 }, (_, i) => {
    const dayOffset = i * 3;
    const date = new Date(base); date.setDate(date.getDate() - dayOffset);
    const qty = Math.floor(rng() * 30) + 1;
    const isPositive = rng() > 0.4;
    const type = ADJ_TYPES[i];
    const loc = LOCATIONS[Math.floor(rng() * LOCATIONS.length)];
    return {
      date: formatDate(date),
      type,
      qty: `${isPositive ? "+" : "-"}${qty}`,
      location: loc,
      reason: ADJ_REASONS[i],
      by: ADJ_USERS[i],
    };
  });
}

/* ── Movement data per range (seeded by item id) ──────────────── */

const RANGE_OPTIONS = ["30 Days", "90 Days"] as const;
type MovementRange = (typeof RANGE_OPTIONS)[number];

function movementDataFor(id: string, range: MovementRange) {
  const rng = mulberry32(id, "move-" + range);
  const buckets = 16;
  const bars = Array.from({ length: buckets }, () => ({
    inH: Math.floor(rng() * 40) + 15,
    outH: Math.floor(rng() * 30) + 12,
  }));
  const net = Array.from({ length: buckets }, () => Math.floor(rng() * 35) + 2);
  const scaleFactor = range === "30 Days" ? 1 : 3;
  const totalIn = Math.floor(rng() * 8000 + 6000) * scaleFactor;
  const totalOut = Math.floor(rng() * 5000 + 4000) * scaleFactor;
  const netChange = totalIn - totalOut;
  return {
    bars,
    net,
    totalIn: `${formatNumber(totalIn)} units`,
    totalOut: `${formatNumber(totalOut)} units`,
    netChange: `${netChange >= 0 ? "+" : ""}${formatNumber(netChange)} units`,
  };
}

/* ── Forecast data derived from item ──────────────────────────── */

function forecastDataFor(item: InventoryItem) {
  const rng = mulberry32(item.id, "forecast");
  const currentStock = item.onHand;
  const reorderPoint = item.reorderPoint;
  // Model: stock declines over 30 days; we compute when it hits zero
  const dailyUsage = Math.max(1, Math.round((currentStock * (0.03 + rng() * 0.04))));
  const daysToStockout = Math.max(1, Math.floor(currentStock / dailyUsage));
  const stockoutDate = new Date("2026-05-18");
  stockoutDate.setDate(stockoutDate.getDate() + daysToStockout);
  // Build forecast line (7 points over ~30 days)
  const points: [number, number][] = [];
  const svgW = 365;
  const svgH = 100;
  const marginL = 15;
  const usableW = svgW - marginL - 10;
  for (let i = 0; i < 7; i++) {
    const day = Math.round(i * (30 / 6));
    const stock = Math.max(0, currentStock - dailyUsage * day + Math.round(rng() * dailyUsage * 0.3 - dailyUsage * 0.15));
    const x = marginL + (i / 6) * usableW;
    const y = 10 + (1 - stock / currentStock) * (svgH - 20);
    points.push([x, Math.min(y, svgH - 5)]);
  }
  // Reorder point y-position
  const reorderY = 10 + (1 - reorderPoint / currentStock) * (svgH - 20);
  // Date labels (5 dates across)
  const dateLabels: string[] = [];
  const baseDate = new Date("2026-05-18");
  for (let i = 0; i < 5; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + Math.round(i * (30 / 4)));
    dateLabels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  }
  return { points, reorderY, currentStock, reorderPoint, daysToStockout, stockoutDate, dailyUsage, dateLabels, svgW, svgH, marginL };
}

/* ── Replenishment recommendation derived from item ───────────── */

function replenishmentFor(item: InventoryItem) {
  const rng = mulberry32(item.id, "replenish");
  const ratio = item.reorderPoint > 0 ? item.onHand / item.reorderPoint : 2;
  let action: string;
  let actionColor: string;
  let actionBg: string;
  let confidence: string;

  if (ratio <= 0.5) {
    action = "Urgent Reorder";
    actionColor = "text-[#EF4444]";
    actionBg = "bg-[#EF4444]/10 border-[#EF4444]/20";
    confidence = "Critical";
  } else if (ratio <= 1.0) {
    action = "Reorder Now";
    actionColor = "text-[#F59E0B]";
    actionBg = "bg-[#F59E0B]/10 border-[#F59E0B]/20";
    confidence = "High";
  } else if (ratio <= 1.5) {
    action = "Reorder";
    actionColor = "text-[#10B981]";
    actionBg = "bg-[#10B981]/10 border-[#10B981]/20";
    confidence = "High";
  } else {
    action = "Monitor";
    actionColor = "text-[#3B82F6]";
    actionBg = "bg-[#3B82F6]/10 border-[#3B82F6]/20";
    confidence = "Medium";
  }

  const dailyUsage = Math.max(1, Math.round((item.onHand * (0.03 + rng() * 0.04))));
  const daysOfSupply = Math.max(0, Math.floor(item.available / dailyUsage));
  const recQty = Math.max(item.reorderPoint * 2, 2000);
  const leadTime = 12;
  const stockoutDate = new Date("2026-05-18");
  stockoutDate.setDate(stockoutDate.getDate() + daysOfSupply);
  const arrivalDate = new Date("2026-05-18");
  arrivalDate.setDate(arrivalDate.getDate() + leadTime);

  return {
    action, actionColor, actionBg, confidence,
    recQty: formatNumber(recQty),
    arrivalDate: formatDate(arrivalDate),
    stockoutDate: formatDate(stockoutDate),
    daysOfSupply,
    isUrgent: ratio <= 0.5,
  };
}

/* ── Badge ─────────────────────────────────────────────────────── */

function Badge({ text }: { text: string }) {
  const styles: Record<string, string> = {
    Healthy: "bg-[#10B981]/10 text-[#10B981]",
    Watch: "bg-[#F59E0B]/10 text-[#F59E0B]",
    "In Transit": "bg-[#3B82F6]/10 text-[#3B82F6]",
    Confirmed: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
    Received: "bg-[#10B981]/10 text-[#10B981]",
    Picking: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Packed: "bg-[#3B82F6]/10 text-[#3B82F6]",
    Allocated: "bg-[#64748B]/10 text-[#64748B]",
    "Cycle Count": "bg-[#3B82F6]/10 text-[#3B82F6]",
    Damage: "bg-[#EF4444]/10 text-[#EF4444]",
    Return: "bg-[#10B981]/10 text-[#10B981]",
  };
  return <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-medium rounded-full ${styles[text] || "bg-[#F1F5F9] text-[#64748B]"}`}>{text}</span>;
}

const card = "bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)]";
const thCls = "text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider px-4 py-2.5";

const tabAnchors: Record<string, string> = {
  "Stock & Movements": "stock-movement",
  "Purchase Orders": "inbound-pos",
  "Allocations": "outbound-alloc",
  "Adjustments": "recent-adjustments",
  "Forecast & Replenishment": "forecast",
  "Activity Log": "recent-adjustments",
};

/** Derives a stable PO reference like PO-2026-4821 from the inventory item id. */
function poRefFor(id: string): string {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 9000;
  return `PO-2026-${String(1000 + h).padStart(4, "0")}`;
}

/* ── Main component ───────────────────────────────────────────── */

export default function InventoryDetailView({ item }: { item: InventoryItem }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  // Deterministic derived data
  const barcode = useMemo(() => barcodeFor(item.id), [item.id]);
  const brand = useMemo(() => brandFor(item.id), [item.id]);
  const tags = useMemo(() => tagsFor(item.id), [item.id]);
  const byWarehouse = useMemo(() => warehouseDataFor(item), [item]);
  const inboundPOs = useMemo(() => inboundPOsFor(item.id), [item.id]);
  const outboundAlloc = useMemo(() => outboundAllocFor(item.id), [item.id]);
  const baseAdjustments = useMemo(() => adjustmentsFor(item.id), [item.id]);
  const forecast = useMemo(() => forecastDataFor(item), [item]);
  const replenishment = useMemo(() => replenishmentFor(item), [item]);

  // Editable lead time & unit cost (seeded defaults)
  const [leadTime, setLeadTime] = useState(() => 5 + seededHash(item.id, 300, 20));
  const [unitCost, setUnitCost] = useState(() => {
    const rng = mulberry32(item.id, "cost");
    return parseFloat((2 + rng() * 18).toFixed(2));
  });
  const [editLeadTimeOpen, setEditLeadTimeOpen] = useState(false);
  const [editUnitCostOpen, setEditUnitCostOpen] = useState(false);
  const [leadTimeDraft, setLeadTimeDraft] = useState("");
  const [unitCostDraft, setUnitCostDraft] = useState("");

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

  const [movementRange, setMovementRange] = useState<MovementRange>("30 Days");
  const [rangeMenuOpen, setRangeMenuOpen] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const movement = useMemo(() => movementDataFor(item.id, movementRange), [item.id, movementRange]);

  const [poRef, setPoRef] = useState<string | null>(null);
  async function createPurchaseOrder() {
    setBusy(true);
    try {
      await api.put(`/api/inventory/${item.id}`, { status: "Low Stock" });
      const ref = poRefFor(item.id);
      setPoRef(ref);
      toast(`Purchase order ${ref} drafted for ${item.sku} (${replenishment.recQty} units)`);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not create purchase order", "error");
    } finally { setBusy(false); }
  }

  // Stock adjustments
  const [adjustmentRows, setAdjustmentRows] = useState(baseAdjustments);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustDraft, setAdjustDraft] = useState({ type: "Stock In", qty: "1", reason: "" });

  async function saveAdjustment() {
    const qty = Math.round(Number(adjustDraft.qty));
    if (!Number.isFinite(qty) || qty <= 0) { toast("Enter a quantity greater than zero", "error"); return; }
    if (!adjustDraft.reason.trim()) { toast("A reason is required", "error"); return; }
    const isIn = adjustDraft.type === "Stock In";
    const delta = isIn ? qty : -qty;
    const newOnHand = item.onHand + delta;
    const newAvailable = item.available + delta;
    if (newOnHand < 0 || newAvailable < 0) { toast("Adjustment would make stock negative", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/inventory/${item.id}`, { onHand: newOnHand, available: newAvailable });
      const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      setAdjustmentRows((prev) => [{
        date: today,
        type: "Cycle Count",
        qty: `${isIn ? "+" : "-"}${qty}`,
        location: item.location ?? item.warehouse,
        reason: adjustDraft.reason.trim(),
        by: "You",
      }, ...prev]);
      toast(`Stock adjusted ${isIn ? "+" : "-"}${qty} for ${item.sku}`);
      setAdjustOpen(false);
      setAdjustDraft({ type: "Stock In", qty: "1", reason: "" });
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not adjust stock", "error");
    } finally { setBusy(false); }
  }

  async function saveLeadTime() {
    const val = Math.round(Number(leadTimeDraft));
    if (!Number.isFinite(val) || val <= 0) { toast("Enter a lead time greater than zero", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/inventory/${item.id}`, { leadTime: val });
      setLeadTime(val);
      toast(`Lead time updated to ${val} days`);
      setEditLeadTimeOpen(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update lead time", "error");
    } finally { setBusy(false); }
  }

  async function saveUnitCost() {
    const val = parseFloat(unitCostDraft);
    if (!Number.isFinite(val) || val <= 0) { toast("Enter a unit cost greater than zero", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/inventory/${item.id}`, { unitCost: val });
      setUnitCost(parseFloat(val.toFixed(2)));
      toast(`Unit cost updated to $${val.toFixed(2)}`);
      setEditUnitCostOpen(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update unit cost", "error");
    } finally { setBusy(false); }
  }

  function copySku() {
    navigator.clipboard?.writeText(item.sku).then(
      () => toast("SKU copied to clipboard"),
      () => toast("Could not copy SKU", "error"),
    );
  }

  function exportMovements() {
    exportToCsv(`${item.sku}-movements`, adjustmentRows, [
      { key: "date", header: "Date" },
      { key: "type", header: "Type" },
      { key: "qty", header: "Qty" },
      { key: "location", header: "Location" },
      { key: "reason", header: "Reason" },
      { key: "by", header: "Adjusted By" },
    ]);
    toast("Movements exported");
  }

  // Compute totals for warehouse table
  const whTotals = useMemo(() => ({
    onHand: byWarehouse.reduce((s, w) => s + w.onHand, 0),
    reserved: byWarehouse.reduce((s, w) => s + w.reserved, 0),
    available: byWarehouse.reduce((s, w) => s + w.available, 0),
  }), [byWarehouse]);

  // Compute totals for PO and allocation tables
  const poTotalQty = useMemo(() => inboundPOs.reduce((s, p) => s + (p.status === "Received" ? 0 : p.qtyRaw), 0), [inboundPOs]);
  const allocTotalQty = useMemo(() => outboundAlloc.reduce((s, o) => s + o.qtyRaw, 0), [outboundAlloc]);

  const metrics = [
    { label: "On Hand", value: formatNumber(item.onHand), unit: "units", icon: Box, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
    { label: "Reserved", value: formatNumber(item.reserved), unit: "units", icon: Lock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
    { label: "Available", value: formatNumber(item.available), unit: "units", icon: CheckCircle2, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
    { label: "Reorder Point", value: formatNumber(item.reorderPoint), unit: "units", icon: AlertTriangle, iconBg: "bg-[#8B5CF6]/10", iconColor: "text-[#8B5CF6]" },
    { label: "Lead Time", value: String(leadTime), unit: "days", icon: Clock, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]", editable: true as const, onEdit: () => { setLeadTimeDraft(String(leadTime)); setEditLeadTimeOpen(true); } },
    { label: "Unit Cost", value: `$${unitCost.toFixed(2)}`, unit: "per unit", icon: Tag, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]", editable: true as const, onEdit: () => { setUnitCostDraft(unitCost.toFixed(2)); setEditUnitCostOpen(true); } },
  ];

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link href="/dashboard/inventory" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#1E293B] mb-3">
        <ArrowLeft className="w-4 h-4" /> Back to Inventory
      </Link>

      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Inventory SKU Detail</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">View stock levels, movements, allocations, and replenishment insights for this SKU.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setCalendarMenuOpen((v) => !v)} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC]">
              <Calendar className="w-4 h-4" /> Last {movementRange} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {calendarMenuOpen && (
              <div className="absolute right-0 mt-1 z-20 w-36 bg-white border border-[#E2E8F0] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] py-1">
                {RANGE_OPTIONS.map((opt) => (
                  <button key={opt} onClick={() => { setMovementRange(opt); setCalendarMenuOpen(false); toast(`Showing movements for the last ${opt.toLowerCase()}`); }} className={`block w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#F8FAFC] ${opt === movementRange ? "text-[#3B82F6] font-medium" : "text-[#64748B]"}`}>Last {opt}</button>
                ))}
              </div>
            )}
          </div>
          <Link href="/dashboard/notifications" aria-label="Notifications" className="w-9 h-9 flex items-center justify-center text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC]"><Bell className="w-4 h-4" /></Link>
          <div className="relative">
            <button onClick={() => setMoreOpen((v) => !v)} aria-label="More options" className="w-9 h-9 flex items-center justify-center text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC]"><MoreHorizontal className="w-4 h-4" /></button>
            {moreOpen && (
              <div className="absolute right-0 mt-1 z-20 w-48 bg-white border border-[#E2E8F0] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] py-1">
                <button onClick={() => { copySku(); setMoreOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[12px] text-[#64748B] hover:bg-[#F8FAFC]"><Copy className="w-3.5 h-3.5" /> Copy SKU</button>
                <button onClick={() => { exportMovements(); setMoreOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[12px] text-[#64748B] hover:bg-[#F8FAFC]"><FileText className="w-3.5 h-3.5" /> Export movements CSV</button>
                <button onClick={() => { setMoreOpen(false); window.print(); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-[12px] text-[#64748B] hover:bg-[#F8FAFC]"><Printer className="w-3.5 h-3.5" /> Print</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons row */}
      <InventoryDetailActions item={item} />

      {/* Hero card: Product info + Metrics */}
      <div className={`${card} p-5`}>
        <div className="flex gap-6">
          {/* Product image */}
          <div className="shrink-0 self-start">
            <div className="w-[72px] h-[96px] rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#6366F1] border border-[#E2E8F0] flex items-center justify-center overflow-hidden">
              <span className="text-[20px] font-bold text-white">FM</span>
            </div>
          </div>
          {/* Product details */}
          <div className="min-w-[260px]">
            <h2 className="text-[16px] font-semibold text-[#1E293B] mb-3">{item.name}</h2>
            <dl className="space-y-1.5 text-[12px]">
              {[
                ["SKU", item.sku],
                ["Barcode", barcode],
                ["Warehouse", item.warehouse],
                ["Location", item.location ?? "—"],
                ["Brand", brand],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="text-[#94A3B8] w-[64px] shrink-0">{k}</dt>
                  <dd className="text-[#1E293B] font-medium">{v}</dd>
                </div>
              ))}
              <div className="flex gap-3 items-center">
                <dt className="text-[#94A3B8] w-[64px] shrink-0">Status</dt>
                <dd><StatusBadge status={item.status} /></dd>
              </div>
              <div className="flex gap-3 items-center">
                <dt className="text-[#94A3B8] w-[64px] shrink-0">Tags</dt>
                <dd className="flex gap-1.5">
                  {tags.map((t) => (
                    <span key={t.text} className={`inline-flex px-2 py-0.5 text-[11px] rounded ${t.cls}`}>{t.text}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-3 flex-1" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="rounded-lg border border-[#E2E8F0] p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-[#64748B]">{m.label}</span>
                    <div className="flex items-center gap-1">
                      {m.editable && (
                        <button onClick={m.onEdit} className="w-6 h-6 rounded flex items-center justify-center text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#3B82F6]/5 transition-colors" aria-label={`Edit ${m.label}`}>
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                      <div className={`w-7 h-7 rounded-lg ${m.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-3.5 h-3.5 ${m.iconColor}`} />
                      </div>
                    </div>
                  </div>
                  <p className="text-[22px] font-bold text-[#1E293B] leading-tight">{m.value}</p>
                  <p className="text-[11px] text-[#94A3B8]">{m.unit}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] px-5">
        <div className="flex items-center gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => selectTab(t)} className={`text-[13px] py-3 whitespace-nowrap border-b-2 -mb-px font-medium ${t === activeTab ? "text-[#3B82F6] border-[#3B82F6]" : "text-[#64748B] border-transparent hover:text-[#1E293B]"}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Row: Inventory by Warehouse + Stock Movement + Replenishment */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.1fr 1.3fr 1fr" }}>
        {/* Inventory by Warehouse */}
        <div className={card}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Inventory by Warehouse</h3>
            <Link href="/dashboard/inventory" className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all warehouses</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className={thCls}>Warehouse</th>
                <th className={thCls}>On Hand</th>
                <th className={thCls}>Reserved</th>
                <th className={thCls}>Available</th>
                <th className={thCls}>Status</th>
              </tr></thead>
              <tbody>
                {byWarehouse.map((w) => (
                  <tr key={w.wh} className="border-b border-[#E2E8F0]">
                    <td className="px-4 py-2.5 text-[12px] text-[#1E293B]">{w.wh}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#1E293B] font-medium">{formatNumber(w.onHand)}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{formatNumber(w.reserved)}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#10B981] font-medium">{formatNumber(w.available)}</td>
                    <td className="px-4 py-2.5"><Badge text={w.status} /></td>
                  </tr>
                ))}
                <tr className="bg-[#F8FAFC]">
                  <td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">Total</td>
                  <td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">{formatNumber(whTotals.onHand)}</td>
                  <td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">{formatNumber(whTotals.reserved)}</td>
                  <td className="px-4 py-2.5 text-[12px] font-semibold text-[#10B981]">{formatNumber(whTotals.available)}</td>
                  <td className="px-4 py-2.5"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Movement chart */}
        <div id="stock-movement" className={`${card} p-4 scroll-mt-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Stock Movement <span className="text-[12px] font-normal text-[#94A3B8]">(Last {movementRange})</span></h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setAdjustOpen(true)} className="text-[12px] font-medium text-[#3B82F6] border border-[#E2E8F0] rounded px-2 py-1 flex items-center gap-1 hover:bg-[#F8FAFC]"><SlidersHorizontal className="w-3 h-3" /> Adjust stock</button>
              <div className="relative">
                <button onClick={() => setRangeMenuOpen((v) => !v)} className="text-[12px] text-[#64748B] border border-[#E2E8F0] rounded px-2 py-1 flex items-center gap-1 hover:bg-[#F8FAFC]">{movementRange} <ChevronDown className="w-3 h-3" /></button>
                {rangeMenuOpen && (
                  <div className="absolute right-0 mt-1 z-20 w-28 bg-white border border-[#E2E8F0] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] py-1">
                    {RANGE_OPTIONS.map((opt) => (
                      <button key={opt} onClick={() => { setMovementRange(opt); setRangeMenuOpen(false); }} className={`block w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#F8FAFC] ${opt === movementRange ? "text-[#3B82F6] font-medium" : "text-[#64748B]"}`}>{opt}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] mb-2">
            <span className="flex items-center gap-1 text-[#64748B]"><span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" /> In</span>
            <span className="flex items-center gap-1 text-[#64748B]"><span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" /> Out</span>
            <span className="flex items-center gap-1 text-[#64748B]"><span className="w-3 h-0.5 bg-[#10B981]" /> Net Change</span>
          </div>
          <svg viewBox="0 0 420 150" className="w-full h-[150px]">
            {[0, 1, 2, 3].map((i) => <line key={i} x1="30" y1={i * 35 + 10} x2="415" y2={i * 35 + 10} stroke="#F1F5F9" />)}
            {movement.bars.map((b, i) => {
              const x = 40 + i * 24;
              return (
                <g key={i}>
                  <rect x={x} y={80 - b.inH} width="6" height={b.inH} fill="#3B82F6" />
                  <rect x={x + 7} y={80} width="6" height={b.outH} fill="#EF4444" />
                </g>
              );
            })}
            <polyline fill="none" stroke="#10B981" strokeWidth="2"
              points={movement.net.map((v, i) => `${43 + i * 24},${70 - v}`).join(" ")} />
          </svg>
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            <div><p className="text-[11px] text-[#94A3B8]">Total In</p><p className="text-[13px] font-semibold text-[#3B82F6]">{movement.totalIn}</p></div>
            <div><p className="text-[11px] text-[#94A3B8]">Total Out</p><p className="text-[13px] font-semibold text-[#EF4444]">{movement.totalOut}</p></div>
            <div><p className="text-[11px] text-[#94A3B8]">Net Change</p><p className="text-[13px] font-semibold text-[#10B981]">{movement.netChange}</p></div>
          </div>
        </div>

        {/* Replenishment Recommendation */}
        <div className={`${card} p-4`}>
          <h3 className="text-[14px] font-semibold text-[#1E293B] mb-3">Replenishment Recommendation</h3>
          <div className={`${replenishment.actionBg} border rounded-lg p-3 mb-4 flex items-center gap-2`}>
            <TrendingUp className={`w-4 h-4 ${replenishment.actionColor.split(" ")[0]}`} />
            <div>
              <p className="text-[11px] text-[#64748B]">Recommended Action</p>
              <p className={`text-[13px] font-semibold ${replenishment.actionColor}`}>{replenishment.action}</p>
            </div>
          </div>
          <dl className="space-y-2.5 text-[12px]">
            {[
              ["Recommended Order Qty", `${replenishment.recQty} units`],
              ["Est. Arrival (at reorder)", replenishment.arrivalDate],
              ["Projected Stockout", replenishment.stockoutDate, replenishment.isUrgent ? "danger" : "warning"],
              ["Days of Supply Remaining", `${replenishment.daysOfSupply} days`],
              ["Confidence Level", replenishment.confidence],
            ].map(([k, v, flag]) => (
              <div key={k as string} className="flex items-center justify-between">
                <dt className="text-[#64748B]">{k}</dt>
                <dd className={`font-medium ${flag === "danger" ? "text-[#EF4444]" : flag === "warning" ? "text-[#F59E0B]" : "text-[#1E293B]"}`}>{v}</dd>
              </div>
            ))}
          </dl>
          {poRef && (
            <div className="mt-4 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0" />
              <div>
                <p className="text-[11px] text-[#64748B]">Purchase order drafted</p>
                <p className="text-[13px] font-semibold text-[#3B82F6] font-mono">{poRef}</p>
              </div>
            </div>
          )}
          <button onClick={createPurchaseOrder} disabled={busy || poRef !== null} className="w-full mt-4 text-[13px] font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg py-2 disabled:opacity-60">{poRef ? `${poRef} Pending` : "Create Purchase Order"}</button>
        </div>
      </div>

      {/* Row: Inbound POs + Outbound Allocations + Forecast */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.1fr 1.1fr 1fr" }}>
        {/* Inbound POs */}
        <div id="inbound-pos" className={`${card} scroll-mt-4`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Inbound Purchase Orders</h3>
            <Link href="/dashboard/suppliers" className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</Link>
          </div>
          <table className="w-full">
            <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className={thCls}>PO Number</th><th className={thCls}>ETA</th><th className={thCls}>Qty</th><th className={thCls}>Status</th>
            </tr></thead>
            <tbody>
              {inboundPOs.map((p) => (
                <tr key={p.po} className="border-b border-[#E2E8F0]">
                  <td className="px-4 py-2.5"><p className="text-[12px] font-medium text-[#3B82F6] font-mono">{p.po}</p><p className="text-[11px] text-[#94A3B8]">{p.supplier}</p></td>
                  <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{p.eta}</td>
                  <td className="px-4 py-2.5 text-[12px] text-[#1E293B] font-medium">{p.qty}</td>
                  <td className="px-4 py-2.5"><Badge text={p.status} /></td>
                </tr>
              ))}
              <tr className="bg-[#F8FAFC]"><td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">Total on Order</td><td></td><td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">{formatNumber(poTotalQty)} units</td><td></td></tr>
            </tbody>
          </table>
        </div>

        {/* Outbound Allocations */}
        <div id="outbound-alloc" className={`${card} scroll-mt-4`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Outbound Allocations</h3>
            <Link href="/dashboard/orders" className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</Link>
          </div>
          <table className="w-full">
            <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className={thCls}>Reference</th><th className={thCls}>Ship By</th><th className={thCls}>Qty</th><th className={thCls}>Status</th>
            </tr></thead>
            <tbody>
              {outboundAlloc.map((o) => (
                <tr key={o.ref} className="border-b border-[#E2E8F0]">
                  <td className="px-4 py-2.5"><p className="text-[12px] font-medium text-[#3B82F6] font-mono">{o.ref}</p><p className="text-[11px] text-[#94A3B8]">{o.customer}</p></td>
                  <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{o.ship}</td>
                  <td className="px-4 py-2.5 text-[12px] text-[#1E293B] font-medium">{o.qty}</td>
                  <td className="px-4 py-2.5"><Badge text={o.status} /></td>
                </tr>
              ))}
              <tr className="bg-[#F8FAFC]"><td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">Total Allocated</td><td></td><td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">{formatNumber(allocTotalQty)} units</td><td></td></tr>
            </tbody>
          </table>
        </div>

        {/* Forecast */}
        <div id="forecast" className={`${card} p-4 scroll-mt-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Forecast <span className="text-[12px] font-normal text-[#94A3B8]">(Next 30 Days)</span></h3>
          </div>
          <div className="flex items-center gap-4 text-[11px] mb-1">
            <span className="flex items-center gap-1 text-[#64748B]"><span className="w-3 h-0.5 bg-[#3B82F6]" /> Forecasted Stock</span>
            <span className="flex items-center gap-1 text-[#64748B]"><span className="w-3 h-0.5 bg-[#EF4444] border-dashed" /> Reorder Point</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-[18px] font-bold text-[#1E293B]">{formatNumber(forecast.currentStock)} <span className="text-[11px] font-normal text-[#94A3B8]">units now</span></p>
            <p className="text-[12px] text-[#EF4444] font-medium">Stockout: {formatDate(forecast.stockoutDate)}</p>
          </div>
          <svg viewBox={`0 0 ${forecast.svgW} ${forecast.svgH + 28}`} className="w-full" style={{ height: "130px" }}>
            {[0, 1, 2, 3].map((i) => <line key={i} x1={forecast.marginL} y1={i * 25 + 10} x2={forecast.svgW - 10} y2={i * 25 + 10} stroke="#F1F5F9" />)}
            <line x1={forecast.marginL} y1={forecast.reorderY} x2={forecast.svgW - 10} y2={forecast.reorderY} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" />
            <polyline fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"
              points={forecast.points.map(([x, y]) => `${x},${y}`).join(" ")} />
            {forecast.points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="white" stroke="#3B82F6" strokeWidth="2" />)}
            {forecast.dateLabels.map((l, i) => <text key={i} x={forecast.marginL + i * ((forecast.svgW - forecast.marginL - 10) / 4)} y={forecast.svgH + 24} textAnchor="middle" fontSize="8" fill="#94A3B8">{l}</text>)}
          </svg>
        </div>
      </div>

      {/* Recent Adjustments */}
      <div id="recent-adjustments" className={`${card} scroll-mt-4`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-semibold text-[#1E293B]">Recent Adjustments</h3>
          <Link href="/dashboard/audit-logs" className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all adjustments</Link>
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <th className={thCls}>Date</th><th className={thCls}>Type</th><th className={thCls}>Qty</th>
            <th className={thCls}>Location</th><th className={thCls}>Reason</th><th className={thCls}>Adjusted By</th>
          </tr></thead>
          <tbody>
            {adjustmentRows.map((a, i) => (
              <tr key={i} className="border-b border-[#E2E8F0] last:border-b-0">
                <td className="px-4 py-3 text-[12px] text-[#64748B]">{a.date}</td>
                <td className="px-4 py-3"><Badge text={a.type} /></td>
                <td className={`px-4 py-3 text-[12px] font-medium ${a.qty.startsWith("+") ? "text-[#10B981]" : "text-[#EF4444]"}`}>{a.qty}</td>
                <td className="px-4 py-3 text-[12px] text-[#64748B] font-mono">{a.location}</td>
                <td className="px-4 py-3 text-[12px] text-[#64748B]">{a.reason}</td>
                <td className="px-4 py-3 text-[12px] text-[#1E293B]">{a.by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust stock modal */}
      <Modal
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        title="Adjust Stock"
        description={`Record a manual stock adjustment for ${item.sku}.`}
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setAdjustOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveAdjustment} disabled={busy}>{busy ? "Saving…" : "Apply adjustment"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Adjustment type">
            <Select options={["Stock In", "Stock Out"]} value={adjustDraft.type} onChange={(e) => setAdjustDraft({ ...adjustDraft, type: e.target.value })} />
          </Field>
          <Field label="Quantity" required>
            <NumberInput value={adjustDraft.qty} onChange={(e) => setAdjustDraft({ ...adjustDraft, qty: e.target.value })} min="1" step="1" />
          </Field>
          <Field label="Reason" required>
            <TextInput value={adjustDraft.reason} onChange={(e) => setAdjustDraft({ ...adjustDraft, reason: e.target.value })} placeholder="e.g. Cycle count recount" />
          </Field>
        </div>
      </Modal>

      {/* Edit Lead Time modal */}
      <Modal
        open={editLeadTimeOpen}
        onClose={() => setEditLeadTimeOpen(false)}
        title="Edit Lead Time"
        description={`Update the lead time for ${item.sku}.`}
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setEditLeadTimeOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveLeadTime} disabled={busy}>{busy ? "Saving…" : "Save"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Lead Time (days)" required>
            <NumberInput value={leadTimeDraft} onChange={(e) => setLeadTimeDraft(e.target.value)} min="1" step="1" />
          </Field>
        </div>
      </Modal>

      {/* Edit Unit Cost modal */}
      <Modal
        open={editUnitCostOpen}
        onClose={() => setEditUnitCostOpen(false)}
        title="Edit Unit Cost"
        description={`Update the unit cost for ${item.sku}.`}
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setEditUnitCostOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveUnitCost} disabled={busy}>{busy ? "Saving…" : "Save"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Unit Cost ($)" required>
            <NumberInput value={unitCostDraft} onChange={(e) => setUnitCostDraft(e.target.value)} min="0.01" step="0.01" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
