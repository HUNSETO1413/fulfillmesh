import type { Metadata } from "next";
import {
  Eye, Warehouse, Bell, RotateCcw, Boxes, Globe2,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import PlatformLayout from "@/components/PlatformLayout";

export const metadata: Metadata = pageMetadata({
  title: "Inventory Visibility",
  description:
    "See live stock across the factory floor, transit, and overseas warehouses in the US, EU and beyond — with low-stock alerts and automated reorder points across every channel.",
  path: "/platform/inventory-visibility",
  keywords: [
    "inventory visibility software",
    "multi-warehouse inventory",
    "overseas warehouse stock tracking",
    "low stock alerts",
    "cross-border inventory management",
  ],
});

const heroStats = [
  { label: "SKUs Tracked", value: "3,418", delta: "+126" },
  { label: "On Hand (units)", value: "284K", delta: "+4.1%" },
  { label: "In Transit", value: "61K", delta: "+9.2%" },
  { label: "Low-Stock SKUs", value: "37", delta: "-12" },
];

const locations: { name: string; units: string; pct: number; color: string }[] = [
  { name: "US · Los Angeles 3PL", units: "112,400", pct: 40, color: "#0057D8" },
  { name: "EU · Rotterdam 3PL", units: "78,200", pct: 28, color: "#00B894" },
  { name: "Factory floor · Shenzhen", units: "52,600", pct: 18, color: "#F59E0B" },
  { name: "In transit", units: "40,800", pct: 14, color: "#94A3B8" },
];

function HeroMockup() {
  return (
    <div className="bg-white rounded-2xl border border-border-soft shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-bold text-deep-navy">Inventory by Location</span>
        <span className="text-[11px] text-text-muted">Live</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {heroStats.map((s) => (
          <div key={s.label} className="border border-border-soft rounded-lg p-2.5">
            <p className="text-[9px] text-text-muted leading-none mb-1">{s.label}</p>
            <p className="text-[15px] font-bold text-deep-navy leading-tight">{s.value}</p>
            <p className={`text-[8px] font-medium mt-0.5 ${s.delta.startsWith("-") ? "text-teal" : "text-teal"}`}>{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2.5">
        {locations.map((l) => (
          <div key={l.name}>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-text-body">{l.name}</span>
              <span className="font-semibold text-deep-navy">{l.units}</span>
            </div>
            <div className="h-1.5 rounded-full bg-soft-bg overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${l.pct}%`, backgroundColor: l.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutcomeMockup() {
  const rows: { sku: string; name: string; onHand: number; reorder: number }[] = [
    { sku: "LM-204-BLK", name: "Linen Tote · Black", onHand: 42, reorder: 150 },
    { sku: "GL-118-WHT", name: "Glass Tumbler · White", onHand: 88, reorder: 120 },
    { sku: "CB-330-NVY", name: "Canvas Backpack · Navy", onHand: 19, reorder: 100 },
  ];
  return (
    <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-bold text-deep-navy">Reorder Alerts</p>
        <span className="text-[10px] font-medium text-[#E11D48] bg-[#E11D48]/10 rounded-full px-2 py-0.5 flex items-center gap-1">
          <Bell className="w-2.5 h-2.5" /> 3 below point
        </span>
      </div>
      <div className="space-y-3">
        {rows.map((r) => {
          const pct = Math.min(100, Math.round((r.onHand / r.reorder) * 100));
          return (
            <div key={r.sku} className="border border-border-soft rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <p className="text-[11px] font-semibold text-deep-navy">{r.name}</p>
                  <p className="text-[9px] text-text-muted">{r.sku}</p>
                </div>
                <p className="text-[11px] font-bold text-[#E11D48]">{r.onHand} left</p>
              </div>
              <div className="h-1.5 rounded-full bg-soft-bg overflow-hidden">
                <div className="h-full rounded-full bg-[#E11D48]" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[9px] text-text-muted mt-1">Reorder point: {r.reorder} units</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function InventoryVisibilityPlatformPage() {
  return (
    <PlatformLayout
      eyebrow="INVENTORY VISIBILITY"
      title="Know exactly what you have,"
      highlight="and where it is."
      heroDesc="FulfillMesh shows live stock across the factory floor in China, goods in transit, and overseas warehouses in the US, EU and beyond — with low-stock alerts and automated reorder points."
      heroPills={["Multi-warehouse view", "Goods-in-transit", "Reorder alerts"]}
      mockup={<HeroMockup />}
      narrativeTitle="Stock spread across the world is impossible to count by hand"
      narrativeSubtitle="Inventory sitting in a Shenzhen factory, on a ship, and in two 3PLs is one number you can never trust in a spreadsheet."
      narrative={[
        {
          problem: "Each warehouse and channel reports stock differently, so your real available quantity is a guess.",
          solution: "Every location rolls up into one live, channel-aware available-to-sell number per SKU.",
        },
        {
          problem: "Goods in transit are invisible until they arrive, so you over- or under-order constantly.",
          solution: "In-transit units are counted toward incoming stock with realistic arrival dates.",
        },
        {
          problem: "You find out a bestseller is out of stock only when orders start failing.",
          solution: "Reorder points trigger alerts and draft purchase orders before you run dry.",
        },
      ]}
      capabilitiesTitle="Total visibility across your network"
      capabilitiesSubtitle="One inventory picture spanning China and every overseas warehouse."
      capabilities={[
        { icon: Globe2, title: "Multi-Location Stock", desc: "Roll up factory, transit and 3PL stock in the US, EU and Asia into one available-to-sell figure." },
        { icon: Boxes, title: "Goods-in-Transit", desc: "Count units on the water and in the air toward incoming stock with realistic ETAs per shipment." },
        { icon: Bell, title: "Low-Stock Alerts", desc: "Set reorder points per SKU and location and get alerted before bestsellers run out." },
        { icon: RotateCcw, title: "Auto Reorder Drafts", desc: "Generate draft purchase orders to the right supplier the moment stock dips below threshold." },
        { icon: Eye, title: "Channel Sync", desc: "Push accurate available quantities back to every storefront to prevent overselling." },
        { icon: Warehouse, title: "Transfers & Allocation", desc: "Move stock between warehouses and reserve units to specific channels or orders." },
      ]}
      outcomesTitle="Never oversell, never run dry"
      outcomes={[
        "Trust one accurate available-to-sell number across every channel",
        "Plan reorders with goods-in-transit factored in",
        "Cut stockouts on bestsellers with timely alerts",
        "Avoid dead stock by allocating inventory where it sells",
      ]}
      outcomeMockup={<OutcomeMockup />}
      ctaTitle="See your whole inventory in one place"
      ctaDesc="See how FulfillMesh unifies stock across China and every overseas warehouse."
      prevLink={{ href: "/platform/shipping-logistics", label: "Shipping & Logistics" }}
      nextLink={{ href: "/platform/analytics-reporting", label: "Analytics & Reporting" }}
    />
  );
}
