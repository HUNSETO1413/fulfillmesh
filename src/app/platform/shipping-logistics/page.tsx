import type { Metadata } from "next";
import {
  Truck, Plane, Ship, FileText, MapPin, Coins,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import PlatformLayout from "@/components/PlatformLayout";

export const metadata: Metadata = pageMetadata({
  title: "Shipping & Logistics",
  description:
    "Compare air, sea, rail and express rates, generate labels and customs paperwork, and track every parcel from China to the last mile — all from one FulfillMesh dashboard.",
  path: "/platform/shipping-logistics",
  keywords: [
    "cross-border shipping software",
    "china freight management",
    "multi-carrier shipping rates",
    "customs documentation",
    "last-mile tracking",
  ],
});

const heroStats = [
  { label: "In Transit", value: "1,205", delta: "+7.2%" },
  { label: "On-Time Rate", value: "97.4%", delta: "+2.1 pp" },
  { label: "Avg. Transit", value: "6.4 days", delta: "-0.8 d" },
  { label: "Saved on Freight", value: "$182K", delta: "+11%" },
];

const lanes: { mode: string; route: string; rate: string; eta: string; icon: typeof Plane }[] = [
  { mode: "Air Express", route: "Shenzhen → Los Angeles", rate: "$4.20/kg", eta: "3-5 days", icon: Plane },
  { mode: "Sea FCL", route: "Yiwu → Rotterdam", rate: "$1,840/40ft", eta: "28-32 days", icon: Ship },
  { mode: "Rail", route: "Dongguan → Chicago", rate: "$2.10/kg", eta: "18-22 days", icon: Truck },
];

function HeroMockup() {
  return (
    <div className="bg-white rounded-2xl border border-border-soft shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-bold text-deep-navy">Rate Comparison</span>
        <span className="text-[11px] text-text-muted">450 kg · to US</span>
      </div>
      <div className="space-y-2 mb-4">
        {lanes.map((l) => (
          <div key={l.mode} className="flex items-center gap-3 border border-border-soft rounded-lg p-2.5">
            <div className="w-8 h-8 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0">
              <l.icon className="w-4 h-4 text-action-blue" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-deep-navy leading-tight">{l.mode}</p>
              <p className="text-[9px] text-text-muted truncate">{l.route}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] font-bold text-deep-navy">{l.rate}</p>
              <p className="text-[9px] text-teal">{l.eta}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {heroStats.map((s) => (
          <div key={s.label} className="border border-border-soft rounded-lg p-2">
            <p className="text-[7px] text-text-muted leading-tight">{s.label}</p>
            <p className="text-[12px] font-bold text-deep-navy leading-tight mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutcomeMockup() {
  const steps = [
    { l: "Picked up · Shenzhen", done: true },
    { l: "Departed origin port", done: true },
    { l: "In transit · Pacific", done: true },
    { l: "Customs clearance · LA", done: false },
    { l: "Out for delivery", done: false },
  ];
  return (
    <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] font-bold text-deep-navy">Shipment FM-90412</p>
        <span className="text-[10px] font-medium text-action-blue bg-action-blue/10 rounded-full px-2 py-0.5">In Transit</span>
      </div>
      <div className="relative pl-4">
        <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border-soft" />
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.l} className="relative flex items-center gap-3">
              <span className={`absolute -left-4 w-2.5 h-2.5 rounded-full border-2 ${s.done ? "bg-teal border-teal" : "bg-white border-border-soft"}`} />
              <span className={`text-[12px] ${s.done ? "text-deep-navy font-medium" : "text-text-muted"}`}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-border-soft grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-text-muted">Carrier</p>
          <p className="text-[12px] font-semibold text-deep-navy">FM Air Express</p>
        </div>
        <div>
          <p className="text-[10px] text-text-muted">ETA</p>
          <p className="text-[12px] font-semibold text-deep-navy">Jun 17</p>
        </div>
      </div>
    </div>
  );
}

export default function ShippingLogisticsPlatformPage() {
  return (
    <PlatformLayout
      eyebrow="SHIPPING & LOGISTICS"
      title="From a factory in China"
      highlight="to a doorstep anywhere."
      heroDesc="Compare air, sea, rail and express rates side by side, generate labels and customs paperwork in a click, and track every parcel from origin to the last mile — without leaving FulfillMesh."
      heroPills={["Multi-carrier rates", "Customs paperwork", "End-to-end tracking"]}
      mockup={<HeroMockup />}
      narrativeTitle="Cross-border freight is where margin quietly disappears"
      narrativeSubtitle="Picking the wrong lane, missing a customs form, or losing a parcel turns a profitable order into a loss."
      narrative={[
        {
          problem: "You email three forwarders for quotes and compare them in a spreadsheet days later.",
          solution: "Live rates for air, sea, rail and express appear side by side, ranked by cost and ETA.",
        },
        {
          problem: "Customs paperwork is filled out by hand, and one wrong HS code means goods sit at the border.",
          solution: "Commercial invoices, packing lists and HS codes are generated and validated automatically.",
        },
        {
          problem: "Once a shipment leaves, visibility ends until the customer complains it never arrived.",
          solution: "Every parcel is tracked across carriers with proactive alerts on delays and exceptions.",
        },
      ]}
      capabilitiesTitle="Everything to move goods worldwide"
      capabilitiesSubtitle="One logistics layer over every carrier and lane you use."
      capabilities={[
        { icon: Coins, title: "Live Rate Shopping", desc: "Compare air, sea, rail and express rates and transit times across carriers in real time." },
        { icon: Plane, title: "Multi-Modal Routing", desc: "Mix express, freight and rail per order to balance cost against the delivery promise you made." },
        { icon: FileText, title: "Customs Automation", desc: "Generate commercial invoices, packing lists and HS codes — validated before the shipment moves." },
        { icon: MapPin, title: "End-to-End Tracking", desc: "Follow each parcel from China pickup through customs to last-mile delivery on one timeline." },
        { icon: Ship, title: "Consolidation", desc: "Combine orders heading to the same region into one container or master shipment to cut cost." },
        { icon: Truck, title: "Carrier-Level Alerts", desc: "Get notified the moment a shipment is delayed, held at customs, or misrouted." },
      ]}
      outcomesTitle="Lower freight cost, fewer surprises"
      outcomes={[
        "Always ship on the cheapest lane that still hits your delivery date",
        "Clear customs faster with validated, complete paperwork",
        "Cut lost and stranded parcels with proactive exception alerts",
        "Give customers accurate tracking from origin to doorstep",
      ]}
      outcomeMockup={<OutcomeMockup />}
      ctaTitle="Take control of every shipment"
      ctaDesc="See how FulfillMesh compares rates, clears customs and tracks parcels worldwide."
      prevLink={{ href: "/platform/quality-control", label: "Quality Control" }}
      nextLink={{ href: "/platform/inventory-visibility", label: "Inventory Visibility" }}
    />
  );
}
