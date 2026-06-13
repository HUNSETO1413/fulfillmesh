"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Package, Box, Boxes, ArrowUpRight,
  ShieldCheck, ClipboardCheck, BadgeCheck, Search as SearchIcon, Pencil,
  Plus, Trash2,
} from "lucide-react";
import type { Product } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { Field as FormField, TextInput, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";
import { formatCurrency, formatNumber } from "@/lib/format";
import ProductDetailActions from "./ProductDetailActions";

// ---------------------------------------------------------------------------
// Deterministic helpers seeded from a product ID
// ---------------------------------------------------------------------------

/** Simple hash that produces a 32-bit integer from a string. */
function hashId(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Seeded PRNG (LCG). Returns a function that produces values in [0, 1). */
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Derive deterministic warehouse inventory from a product ID. */
function deriveInventory(productId: string) {
  const rng = seededRandom(hashId(productId + "_wh"));
  const warehouses = [
    "Los Angeles, CA",
    "Dallas, TX",
    "Chicago, IL",
    "Atlanta, GA",
    "New York, NY",
  ];
  return warehouses.map((wh) => {
    const onHand = Math.round(400 + rng() * 3600);
    const reserved = Math.round(onHand * (0.05 + rng() * 0.15));
    const available = onHand - reserved;
    let status: string;
    if (available === 0) status = "Out of Stock";
    else if (available < 400) status = "Low Stock";
    else status = "In Stock";
    return { wh, onHand, reserved, available, status };
  });
}

/** Derive deterministic recent orders from a product ID. */
function deriveOrders(productId: string) {
  const rng = seededRandom(hashId(productId + "_orders"));
  const customers = ["Acme Retail", "Summit Goods", "Peak Supplies", "Global Mart", "Urban Needs"];
  const statuses = ["Delivered", "In Transit", "Processing", "Confirmed"] as const;
  return Array.from({ length: 5 }, () => {
    const orderNum = 10000 + Math.round(rng() * 9999);
    const id = `ORD-${orderNum}`;
    const customer = customers[Math.floor(rng() * customers.length)];
    const status = statuses[Math.floor(rng() * statuses.length)];
    const qty = Math.round(200 + rng() * 1800);
    const day = Math.round(rng() * 27) + 1;
    const date = `May ${day}, 2025`;
    return { id, customer, status, qty, date };
  });
}

/** Derive deterministic performance chart data from a product ID. */
function derivePerformanceData(productId: string) {
  const rng = seededRandom(hashId(productId + "_perf"));
  const baseUnits = 30 + rng() * 30;
  const baseRevenue = 40 + rng() * 30;
  const unitsPts = Array.from({ length: 9 }, (_, i) =>
    Math.round(baseUnits + i * (2 + rng() * 4) + rng() * 15),
  );
  const revenuePts = Array.from({ length: 9 }, (_, i) =>
    Math.round(baseRevenue + i * (2 + rng() * 5) + rng() * 12),
  );
  const totalUnits = Math.round(3000 + rng() * 9000);
  const unitPrice = 8 + rng() * 15;
  const totalRevenue = Math.round(totalUnits * unitPrice);
  const unitsChange = (5 + rng() * 20).toFixed(1);
  const revenueChange = (3 + rng() * 18).toFixed(1);
  const marginPct = (35 + rng() * 30).toFixed(1);
  const marginChange = (1 + rng() * 5).toFixed(1);
  return { unitsPts, revenuePts, totalUnits, totalRevenue, unitsChange, revenueChange, marginPct, marginChange };
}

// ---------------------------------------------------------------------------
// Default specs (mutable copy used as initial state)
// ---------------------------------------------------------------------------

const defaultSpecs: { label: string; value: string; good?: boolean; flag?: string }[] = [
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

const initialShipping = [
  { name: "Standard (Ocean)", time: "20–30 days", cost: "$1.25 / unit" },
  { name: "Express (Air)", time: "5–7 days", cost: "$3.85 / unit" },
  { name: "Air Express", time: "2–3 days", cost: "$6.45 / unit" },
  { name: "Door-to-Door", time: "7–10 days", cost: "$4.10 / unit" },
  { name: "Rail Freight", time: "14–18 days", cost: "$1.95 / unit" },
  { name: "Sea + Truck (DDP)", time: "25–35 days", cost: "$1.60 / unit" },
];
const SHIPPING_VISIBLE = 4;

const initialPackaging = [
  { name: "Default Box", per: "24 units / box", dim: "31 x 23 x 26 cm" },
  { name: "Retail Box", per: "1 unit / box", dim: "8 x 8 x 26 cm" },
  { name: "Bulk Pack", per: "48 units / box", dim: "47 x 31 x 28 cm" },
  { name: "Display Carton", per: "12 units / box", dim: "40 x 30 x 28 cm" },
  { name: "Pallet Pack", per: "960 units / pallet", dim: "120 x 100 x 140 cm" },
];
const PACKAGING_VISIBLE = 3;

const defaultQuality = [
  { title: "Incoming Inspection", desc: "AQL 1.5 for critical defects", icon: SearchIcon },
  { title: "In-Process Check", desc: "Visual check every 50 units", icon: ClipboardCheck },
  { title: "Final Inspection", desc: "100% functional test", icon: ShieldCheck },
  { title: "Certifications", desc: "FDA, LFGB, BPA Free", icon: BadgeCheck },
];

const orderStatusStyle: Record<string, { bg: string; text: string }> = {
  "Delivered": { bg: "#00B8941A", text: "#00B894" },
  "In Transit": { bg: "#0057D81A", text: "#0057D8" },
  "Processing": { bg: "#F59E0B1A", text: "#F59E0B" },
  "Confirmed": { bg: "#7C6FF61A", text: "#7C6FF6" },
};

const tabs = ["Overview", "Specifications", "Inventory", "Shipping", "Packaging", "Quality", "Orders", "Performance"];

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

const warehouseStatusColor: Record<string, { bg: string; text: string }> = {
  "In Stock": { bg: "#00B8941A", text: "#00B894" },
  "Low Stock": { bg: "#F59E0B1A", text: "#F59E0B" },
  "Out of Stock": { bg: "#EF44441A", text: "#EF4444" },
};

export default function ProductDetailView({ product }: { product: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("Overview");
  const [busy, setBusy] = useState(false);

  // Pricing edit — persists via PUT (price/cost are accepted by the products API).
  const [pricingOpen, setPricingOpen] = useState(false);
  const [pricingDraft, setPricingDraft] = useState({ price: String(product.price), cost: product.cost != null ? String(product.cost) : "" });

  async function savePricing() {
    const price = Number(pricingDraft.price);
    if (!Number.isFinite(price) || price < 0) { toast("Enter a valid selling price", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/products/${product.id}`, {
        price,
        cost: pricingDraft.cost.trim() === "" ? undefined : Number(pricingDraft.cost) || 0,
      });
      toast(`Pricing updated for ${product.sku}`);
      setPricingOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update pricing", "error");
    } finally { setBusy(false); }
  }

  // ---- 1. Editable Specifications ----
  const [specs, setSpecs] = useState(defaultSpecs);
  const [specsEditOpen, setSpecsEditOpen] = useState(false);
  const [specsDraft, setSpecsDraft] = useState(specs);

  function saveSpecs() {
    if (specsDraft.some((s) => !s.label.trim())) {
      toast("Specification labels cannot be empty", "error");
      return;
    }
    setSpecs(specsDraft.map((s) => ({ ...s, label: s.label.trim(), value: s.value.trim() })));
    setSpecsEditOpen(false);
    toast("Specifications updated");
  }

  // ---- 2. Deterministic Inventory by Warehouse ----
  const inventory = useMemo(() => deriveInventory(product.id), [product.id]);
  const inventoryTotals = useMemo(() => {
    const totals = inventory.reduce(
      (acc, r) => ({ onHand: acc.onHand + r.onHand, reserved: acc.reserved + r.reserved, available: acc.available + r.available }),
      { onHand: 0, reserved: 0, available: 0 },
    );
    return totals;
  }, [inventory]);

  // ---- 3. Deterministic Recent Orders (with links) ----
  const orders = useMemo(() => deriveOrders(product.id), [product.id]);

  // ---- 4. Deterministic Performance Trends ----
  const perf = useMemo(() => derivePerformanceData(product.id), [product.id]);

  // ---- 5. Editable Quality Rules ----
  const [qualityRules, setQualityRules] = useState(defaultQuality);
  const [qualityEditOpen, setQualityEditOpen] = useState(false);
  const [qualityDraft, setQualityDraft] = useState<{ title: string; desc: string }[]>([]);
  const [qualityAddOpen, setQualityAddOpen] = useState(false);
  const [newRule, setNewRule] = useState({ title: "", desc: "" });

  function openQualityEdit() {
    setQualityDraft(qualityRules.map((q) => ({ title: q.title, desc: q.desc })));
    setQualityEditOpen(true);
  }

  function saveQualityEdit() {
    if (qualityDraft.some((q) => !q.title.trim())) {
      toast("Rule names cannot be empty", "error");
      return;
    }
    const icons = [SearchIcon, ClipboardCheck, ShieldCheck, BadgeCheck];
    setQualityRules(qualityDraft.map((q, i) => ({ ...q, icon: icons[i % icons.length] })));
    setQualityEditOpen(false);
    toast("Quality rules updated");
  }

  function addQualityRule() {
    if (!newRule.title.trim()) {
      toast("Rule name is required", "error");
      return;
    }
    const icons = [SearchIcon, ClipboardCheck, ShieldCheck, BadgeCheck];
    setQualityRules((prev) => [...prev, { title: newRule.title.trim(), desc: newRule.desc.trim(), icon: icons[prev.length % icons.length] }]);
    setNewRule({ title: "", desc: "" });
    setQualityAddOpen(false);
    toast("Quality rule added");
  }

  // Shipping & packaging options — editable, local-state (no API fields for these).
  const [shipping, setShipping] = useState(initialShipping);
  const [packaging, setPackaging] = useState(initialPackaging);
  const [showAllShipping, setShowAllShipping] = useState(false);
  const [showAllPackaging, setShowAllPackaging] = useState(false);
  const [shippingEditOpen, setShippingEditOpen] = useState(false);
  const [packagingEditOpen, setPackagingEditOpen] = useState(false);
  const [shippingDraft, setShippingDraft] = useState(initialShipping);
  const [packagingDraft, setPackagingDraft] = useState(initialPackaging);

  const visibleShipping = showAllShipping ? shipping : shipping.slice(0, SHIPPING_VISIBLE);
  const visiblePackaging = showAllPackaging ? packaging : packaging.slice(0, PACKAGING_VISIBLE);

  function saveShipping() {
    if (shippingDraft.some((s) => !s.name.trim())) { toast("Shipping option names cannot be empty", "error"); return; }
    setShipping(shippingDraft.map((s) => ({ name: s.name.trim(), time: s.time.trim(), cost: s.cost.trim() })));
    setShippingEditOpen(false);
    toast("Shipping options updated");
  }
  function savePackaging() {
    if (packagingDraft.some((p) => !p.name.trim())) { toast("Packaging option names cannot be empty", "error"); return; }
    setPackaging(packagingDraft.map((p) => ({ name: p.name.trim(), per: p.per.trim(), dim: p.dim.trim() })));
    setPackagingEditOpen(false);
    toast("Packaging options updated");
  }

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
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#94A3B8]">Pricing</span>
                    <button
                      onClick={() => { setPricingDraft({ price: String(product.price), cost: product.cost != null ? String(product.cost) : "" }); setPricingOpen(true); }}
                      aria-label="Edit pricing"
                      className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Specifications</h3>
            <button
              onClick={() => { setSpecsDraft(specs); setSpecsEditOpen(true); }}
              aria-label="Edit specifications"
              className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
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
          <div className="grid grid-cols-5 text-[11px] text-[#94A3B8] uppercase tracking-wide pb-2 border-b border-[#E2E8F0]">
            <span className="col-span-1">Warehouse</span>
            <span className="text-right">On Hand</span>
            <span className="text-right">Reserved</span>
            <span className="text-right">Available</span>
            <span className="text-right">Status</span>
          </div>
          {inventory.map((r) => (
            <div key={r.wh} className="grid grid-cols-5 text-[12px] py-2 border-b border-[#F1F5F9] items-center">
              <span className="text-[#1E293B] truncate">{r.wh}</span>
              <span className="text-right text-[#64748B]">{formatNumber(r.onHand)}</span>
              <span className="text-right text-[#64748B]">{formatNumber(r.reserved)}</span>
              <span className="text-right font-medium" style={{ color: "#00B894" }}>{formatNumber(r.available)}</span>
              <span className="text-right">
                <span
                  className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{ backgroundColor: warehouseStatusColor[r.status]?.bg ?? "#F1F5F9", color: warehouseStatusColor[r.status]?.text ?? "#64748B" }}
                >
                  {r.status}
                </span>
              </span>
            </div>
          ))}
          <div className="grid grid-cols-5 text-[12px] py-2 font-semibold">
            <span className="text-[#1E293B]">Total</span>
            <span className="text-right text-[#1E293B]">{formatNumber(inventoryTotals.onHand)}</span>
            <span className="text-right text-[#1E293B]">{formatNumber(inventoryTotals.reserved)}</span>
            <span className="text-right" style={{ color: "#00B894" }}>{formatNumber(inventoryTotals.available)}</span>
            <span />
          </div>
        </div>

        {/* Shipping + Packaging */}
        <div className="space-y-5">
          <div id="shipping" className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 scroll-mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Shipping Options</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => { setShippingDraft(shipping); setShippingEditOpen(true); }} aria-label="Edit shipping options" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setShowAllShipping((v) => !v)} className="text-[12px] text-[#3B82F6] font-medium hover:underline">{showAllShipping ? "Show fewer" : `View all (${shipping.length})`}</button>
              </div>
            </div>
            <div className="space-y-2.5">
              {visibleShipping.map((s) => (
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
              <div className="flex items-center gap-3">
                <button onClick={() => { setPackagingDraft(packaging); setPackagingEditOpen(true); }} aria-label="Edit packaging options" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setShowAllPackaging((v) => !v)} className="text-[12px] text-[#3B82F6] font-medium hover:underline">{showAllPackaging ? "Show fewer" : `View all (${packaging.length})`}</button>
              </div>
            </div>
            <div className="space-y-2.5">
              {visiblePackaging.map((p) => (
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Quality Rules</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setQualityAddOpen(true)} aria-label="Add quality rule" className="text-[#94A3B8] hover:text-[#00B894] transition-colors"><Plus className="w-3.5 h-3.5" /></button>
              <button onClick={openQualityEdit} aria-label="Edit quality rules" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className="space-y-4">
            {qualityRules.map((q) => {
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
                  style={{ backgroundColor: orderStatusStyle[o.status]?.bg ?? "#F1F5F9", color: orderStatusStyle[o.status]?.text ?? "#64748B" }}
                >
                  {o.status}
                </span>
              </div>
              <span className="col-span-2 text-right text-[#64748B]">{formatNumber(o.qty)}</span>
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
              { l: "Units Sold", v: formatNumber(perf.totalUnits), c: `+${perf.unitsChange}%` },
              { l: "Revenue", v: `$${formatNumber(perf.totalRevenue)}`, c: `+${perf.revenueChange}%` },
              { l: "Gross Margin", v: `${perf.marginPct}%`, c: `+${perf.marginChange}%` },
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
              <polygon fill="url(#perfRevenue)" points={`0,110 ${perf.revenuePts.map((v, i) => `${i * 37},${110 - v}`).join(" ")} 296,110`} />
              <polygon fill="url(#perfUnits)" points={`0,110 ${perf.unitsPts.map((v, i) => `${i * 37},${110 - v}`).join(" ")} 296,110`} />
              {/* Lines */}
              <polyline fill="none" stroke="#3B82F6" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" points={perf.revenuePts.map((v, i) => `${i * 37},${110 - v}`).join(" ")} />
              <polyline fill="none" stroke="#00B894" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" points={perf.unitsPts.map((v, i) => `${i * 37},${110 - v}`).join(" ")} />
              {perf.revenuePts.map((v, i) => <circle key={`r${i}`} cx={i * 37} cy={110 - v} r="2.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />)}
              {perf.unitsPts.map((v, i) => <circle key={`u${i}`} cx={i * 37} cy={110 - v} r="2.5" fill="#FFFFFF" stroke="#00B894" strokeWidth="1.5" />)}
            </svg>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3B82F6]" />Units Sold</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#00B894" }} />Revenue</span>
          </div>
        </div>
      </div>

      {/* ---- MODALS ---- */}

      {/* Edit pricing modal */}
      <Modal
        open={pricingOpen}
        onClose={() => setPricingOpen(false)}
        title="Edit Pricing"
        description={`Update the pricing for ${product.sku}.`}
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setPricingOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={savePricing} disabled={busy}>{busy ? "Saving…" : "Save pricing"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Selling price (USD)" required>
            <TextInput type="number" value={pricingDraft.price} onChange={(e) => setPricingDraft({ ...pricingDraft, price: e.target.value })} step="0.01" min="0" />
          </FormField>
          <FormField label="Unit cost (USD)">
            <TextInput type="number" value={pricingDraft.cost} onChange={(e) => setPricingDraft({ ...pricingDraft, cost: e.target.value })} step="0.01" min="0" />
          </FormField>
        </div>
      </Modal>

      {/* Edit Specifications modal */}
      <Modal
        open={specsEditOpen}
        onClose={() => setSpecsEditOpen(false)}
        title="Edit Specifications"
        description="Update the product specifications. You can modify key-value pairs below."
        size="lg"
        footer={
          <>
            <SecondaryButton onClick={() => setSpecsEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveSpecs}>Save specifications</PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          {specsDraft.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_32px] gap-3 items-end">
              <FormField label={i === 0 ? "Label" : ""}>
                <TextInput
                  value={s.label}
                  onChange={(e) => setSpecsDraft((prev) => prev.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  placeholder="e.g. Material"
                />
              </FormField>
              <FormField label={i === 0 ? "Value" : ""}>
                <TextInput
                  value={s.value}
                  onChange={(e) => setSpecsDraft((prev) => prev.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  placeholder="e.g. Stainless Steel"
                />
              </FormField>
              <button
                type="button"
                onClick={() => setSpecsDraft((prev) => prev.filter((_, j) => j !== i))}
                className="mb-0.5 w-8 h-[34px] flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                aria-label={`Remove ${s.label}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecsDraft((prev) => [...prev, { label: "", value: "" }])}
            className="flex items-center gap-1.5 text-[13px] text-[#3B82F6] font-medium hover:underline mt-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add specification
          </button>
        </div>
      </Modal>

      {/* Edit shipping options modal */}
      <Modal
        open={shippingEditOpen}
        onClose={() => setShippingEditOpen(false)}
        title="Edit Shipping Options"
        description="Update the shipping methods for this product."
        size="lg"
        footer={
          <>
            <SecondaryButton onClick={() => setShippingEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveShipping}>Save options</PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          {shippingDraft.map((s, i) => (
            <div key={i} className="grid grid-cols-3 gap-3">
              <FormField label={i === 0 ? "Method" : ""}>
                <TextInput value={s.name} onChange={(e) => setShippingDraft((prev) => prev.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
              </FormField>
              <FormField label={i === 0 ? "Transit time" : ""}>
                <TextInput value={s.time} onChange={(e) => setShippingDraft((prev) => prev.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))} />
              </FormField>
              <FormField label={i === 0 ? "Cost" : ""}>
                <TextInput value={s.cost} onChange={(e) => setShippingDraft((prev) => prev.map((x, j) => (j === i ? { ...x, cost: e.target.value } : x)))} />
              </FormField>
            </div>
          ))}
        </div>
      </Modal>

      {/* Edit packaging options modal */}
      <Modal
        open={packagingEditOpen}
        onClose={() => setPackagingEditOpen(false)}
        title="Edit Packaging Options"
        description="Update the packaging configurations for this product."
        size="lg"
        footer={
          <>
            <SecondaryButton onClick={() => setPackagingEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={savePackaging}>Save options</PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          {packagingDraft.map((p, i) => (
            <div key={i} className="grid grid-cols-3 gap-3">
              <FormField label={i === 0 ? "Packaging" : ""}>
                <TextInput value={p.name} onChange={(e) => setPackagingDraft((prev) => prev.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
              </FormField>
              <FormField label={i === 0 ? "Units" : ""}>
                <TextInput value={p.per} onChange={(e) => setPackagingDraft((prev) => prev.map((x, j) => (j === i ? { ...x, per: e.target.value } : x)))} />
              </FormField>
              <FormField label={i === 0 ? "Dimensions" : ""}>
                <TextInput value={p.dim} onChange={(e) => setPackagingDraft((prev) => prev.map((x, j) => (j === i ? { ...x, dim: e.target.value } : x)))} />
              </FormField>
            </div>
          ))}
        </div>
      </Modal>

      {/* Edit Quality Rules modal */}
      <Modal
        open={qualityEditOpen}
        onClose={() => setQualityEditOpen(false)}
        title="Edit Quality Rules"
        description="Modify existing quality rules for this product."
        size="lg"
        footer={
          <>
            <SecondaryButton onClick={() => setQualityEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveQualityEdit}>Save rules</PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          {qualityDraft.map((q, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_32px] gap-3 items-end">
              <FormField label={i === 0 ? "Rule name" : ""}>
                <TextInput
                  value={q.title}
                  onChange={(e) => setQualityDraft((prev) => prev.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                  placeholder="e.g. Incoming Inspection"
                />
              </FormField>
              <FormField label={i === 0 ? "Description / Condition" : ""}>
                <TextInput
                  value={q.desc}
                  onChange={(e) => setQualityDraft((prev) => prev.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)))}
                  placeholder="e.g. AQL 1.5 for critical defects"
                />
              </FormField>
              <button
                type="button"
                onClick={() => setQualityDraft((prev) => prev.filter((_, j) => j !== i))}
                className="mb-0.5 w-8 h-[34px] flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                aria-label={`Remove ${q.title}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setQualityDraft((prev) => [...prev, { title: "", desc: "" }])}
            className="flex items-center gap-1.5 text-[13px] text-[#3B82F6] font-medium hover:underline mt-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add rule
          </button>
        </div>
      </Modal>

      {/* Add Quality Rule modal (quick-add) */}
      <Modal
        open={qualityAddOpen}
        onClose={() => setQualityAddOpen(false)}
        title="Add Quality Rule"
        description="Define a new quality rule for this product."
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setQualityAddOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={addQualityRule}>Add rule</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Rule name" required>
            <TextInput
              value={newRule.title}
              onChange={(e) => setNewRule((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Dimensional Check"
            />
          </FormField>
          <FormField label="Condition / Threshold" hint="Describe the inspection criteria or pass condition">
            <TextInput
              value={newRule.desc}
              onChange={(e) => setNewRule((prev) => ({ ...prev, desc: e.target.value }))}
              placeholder="e.g. Tolerance ±0.5mm on all dimensions"
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
