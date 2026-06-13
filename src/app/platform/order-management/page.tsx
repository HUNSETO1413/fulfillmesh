import type { Metadata } from "next";
import {
  ShoppingCart, Layers, Bell, Filter, RefreshCw, Zap, TrendingUp,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import PlatformLayout from "@/components/PlatformLayout";

export const metadata: Metadata = pageMetadata({
  title: "Order Management",
  description:
    "Capture every order from Shopify, Amazon, Walmart and TikTok Shop in one inbox, route it to the right China supplier or warehouse, and keep tracking in sync across every channel.",
  path: "/platform/order-management",
  keywords: [
    "order management software",
    "multi-channel order management",
    "cross-border order fulfillment",
    "china order routing",
    "ecommerce order automation",
  ],
});

const heroStats = [
  { label: "Open Orders", value: "1,284", delta: "+12.4%" },
  { label: "Awaiting Supplier", value: "318", delta: "+4.2%" },
  { label: "Same-Day Routed", value: "94%", delta: "+5 pp" },
  { label: "Order Accuracy", value: "99.1%", delta: "+1.2 pp" },
];

const orderRows: { id: string; channel: string; dest: string; status: string; color: string }[] = [
  { id: "ORD-5821", channel: "Shopify", dest: "United States", status: "Routed", color: "text-action-blue" },
  { id: "ORD-5820", channel: "Amazon", dest: "Germany", status: "At Supplier", color: "text-[#F59E0B]" },
  { id: "ORD-5819", channel: "TikTok Shop", dest: "United Kingdom", status: "Shipped", color: "text-teal" },
  { id: "ORD-5818", channel: "Walmart", dest: "Canada", status: "New", color: "text-text-muted" },
];

function HeroMockup() {
  return (
    <div className="bg-white rounded-2xl border border-border-soft shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-bold text-deep-navy">Unified Order Inbox</span>
        <span className="text-[11px] text-text-muted">All channels</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {heroStats.map((s) => (
          <div key={s.label} className="border border-border-soft rounded-lg p-2.5">
            <p className="text-[9px] text-text-muted leading-none mb-1">{s.label}</p>
            <p className="text-[15px] font-bold text-deep-navy leading-tight">{s.value}</p>
            <p className="text-[8px] font-medium text-teal mt-0.5">{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-border-soft">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-soft-bg">
              {["Order", "Channel", "Destination", "Status"].map((c) => (
                <th key={c} className="px-2.5 py-2 text-[9px] font-semibold text-text-muted">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderRows.map((r) => (
              <tr key={r.id} className="border-t border-border-soft">
                <td className="px-2.5 py-2 text-[9px] font-semibold text-deep-navy">{r.id}</td>
                <td className="px-2.5 py-2 text-[9px] text-text-body">{r.channel}</td>
                <td className="px-2.5 py-2 text-[9px] text-text-body">{r.dest}</td>
                <td className={`px-2.5 py-2 text-[9px] font-medium ${r.color}`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const insightStats = [
  { label: "Orders / Day", value: "402", delta: "+8.9%" },
  { label: "Auto-Routed", value: "91%", delta: "+6 pp" },
  { label: "Exceptions", value: "1.4%", delta: "-0.7 pp" },
  { label: "Avg. Time to Ship", value: "1.8 days", delta: "-6.7%" },
];

function OutcomeMockup() {
  return (
    <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
      <p className="text-[13px] font-bold text-deep-navy mb-4">Fulfillment performance</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {insightStats.map((s) => (
          <div key={s.label} className="border border-border-soft rounded-lg p-3">
            <p className="text-[16px] font-bold text-deep-navy">{s.value}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
            <p className={`text-[10px] font-medium mt-0.5 ${s.delta.startsWith("-") ? "text-text-muted" : "text-teal"}`}>{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="border border-border-soft rounded-lg p-3">
        <p className="text-[10px] font-semibold text-deep-navy mb-2 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-teal" /> Orders shipped per week
        </p>
        <svg viewBox="0 0 280 50" className="w-full h-auto">
          <polyline fill="none" stroke="#0057D8" strokeWidth="1.5" points="0,40 40,32 80,35 120,22 160,26 200,14 240,18 280,8" />
        </svg>
      </div>
    </div>
  );
}

export default function OrderManagementPlatformPage() {
  return (
    <PlatformLayout
      eyebrow="ORDER MANAGEMENT"
      title="Every order, every channel."
      highlight="One inbox."
      heroDesc="FulfillMesh pulls every order from Shopify, Amazon, Walmart, TikTok Shop and wholesale into a single inbox, then routes each one to the right China supplier or overseas warehouse — automatically."
      heroPills={["Multi-channel sync", "Automated routing", "Real-time tracking"]}
      mockup={<HeroMockup />}
      narrativeTitle="Selling cross-border means orders scatter everywhere"
      narrativeSubtitle="One storefront, three marketplaces and a dozen factory WeChat groups is not a system. FulfillMesh makes it one."
      narrative={[
        {
          problem: "Orders land in five different dashboards and get re-keyed into supplier spreadsheets, where mistakes creep in.",
          solution: "Every channel syncs into one inbox with a single, authoritative order record per shipment.",
        },
        {
          problem: "Deciding which factory or overseas warehouse should fulfill each order is slow and manual at volume.",
          solution: "Routing rules assign orders by SKU, destination, stock location and cost the moment they arrive.",
        },
        {
          problem: "Customers chase you for tracking while updates sit buried in carrier portals and chat threads.",
          solution: "Status flows back to your storefront and the buyer automatically at every stage.",
        },
      ]}
      capabilitiesTitle="Everything you need to run orders at scale"
      capabilitiesSubtitle="From the moment an order lands to the moment it is delivered."
      capabilities={[
        { icon: ShoppingCart, title: "Unified Order Inbox", desc: "Shopify, Amazon, Walmart, TikTok Shop, eBay and wholesale orders in one place — no tab-switching." },
        { icon: Zap, title: "Smart Routing Rules", desc: "Assign orders to the right supplier or warehouse by destination, SKU, stock level and landed cost." },
        { icon: Bell, title: "Exception Alerts", desc: "Catch address errors, stockouts and supplier delays before they become customer complaints." },
        { icon: Filter, title: "Filter & Bulk Actions", desc: "Slice by channel, lane or status and update hundreds of orders at once — export, hold or reassign." },
        { icon: RefreshCw, title: "Returns & Reships", desc: "Handle cross-border returns, replacements and refunds with a clear, tracked approval workflow." },
        { icon: Layers, title: "Full Order History", desc: "Every status change, message and document attached to one timeline you can audit anytime." },
      ]}
      outcomesTitle="Ship faster, with fewer people"
      outcomes={[
        "Cut manual data entry between channels and suppliers to zero",
        "Route the average order to a fulfillment source in under a minute",
        "Keep buyers informed automatically at every step",
        "Scale order volume without adding headcount",
      ]}
      outcomeMockup={<OutcomeMockup />}
      ctaTitle="Bring every order into one place"
      ctaDesc="See how FulfillMesh routes and tracks orders across all your channels and China suppliers."
      nextLink={{ href: "/platform/quality-control", label: "Quality Control" }}
    />
  );
}
