import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart, Truck, CheckCircle2, Clock,
  ArrowRight, Bell, Filter, RefreshCw, Zap,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Order Management",
  description:
    "Manage every order end-to-end from a single dashboard. Track order status, automate fulfillment workflows, sync across channels, and deliver on time, every time.",
  path: "/solutions/order-management",
  keywords: [
    "order management",
    "order fulfillment software",
    "multi-channel order management",
    "ecommerce order tracking",
    "fulfillment workflow automation",
  ],
});

const heroStats = [
  { label: "Orders This Month", value: "12,456", delta: "+10.8%" },
  { label: "On-Time Delivery", value: "93.2%", delta: "+4.6 pp" },
  { label: "Avg. Cycle Time", value: "1.82 days", delta: "-6.7%" },
  { label: "Order Accuracy", value: "99.1%", delta: "+1.2 pp" },
  { label: "Orders Shipped", value: "11,732", delta: "+11.2%" },
  { label: "Pending", value: "724", delta: "-3.1%" },
];

const features = [
  { icon: ShoppingCart, title: "Unified Order Inbox", desc: "Every order from every channel — Shopify, Amazon, Walmart, eBay, wholesale — lands in one inbox. No more tab-switching." },
  { icon: Truck, title: "Automated Fulfillment", desc: "Orders flow automatically through pick, pack, and ship stages with status updates synced back to your storefront in real time." },
  { icon: Bell, title: "Exception Alerts", desc: "Get instant alerts on delays, stockouts, and address issues before they become customer complaints." },
  { icon: Filter, title: "Smart Filtering & Search", desc: "Slice orders by status, channel, warehouse, date, or value. Find any order in seconds, not minutes." },
  { icon: RefreshCw, title: "Returns & Refunds", desc: "Handle returns, restocking, and refunds with a clear approval workflow — all tracked end-to-end." },
  { icon: Zap, title: "Bulk Actions", desc: "Process hundreds of orders at once — export, update status, assign to warehouses, or cancel in bulk." },
];

const stages = [
  { icon: ShoppingCart, title: "Placed", desc: "Order received from any channel." },
  { icon: Clock, title: "Processing", desc: "Allocated to warehouse, picked, and packed." },
  { icon: Truck, title: "In Transit", desc: "Shipped with carrier, tracking synced." },
  { icon: CheckCircle2, title: "Delivered", desc: "Confirmed delivery, customer notified." },
];

const dashBullets = [
  "Real-time order status across all channels",
  "Bulk edit, export, and assign orders",
  "Exception tracking with smart alerts",
  "Full activity history per order",
];

const outcomeBullets = [
  "Ship faster with automated workflows",
  "Reduce errors and mis-picks",
  "Keep customers informed at every step",
  "Scale without adding headcount",
];

const insightStats = [
  { label: "Orders / Day", value: "402", delta: "+8.9%" },
  { label: "Peak Day", value: "1,287", delta: "+12%" },
  { label: "Same-Day Ship", value: "94%", delta: "+5 pp" },
  { label: "First-Attempt Delivery", value: "97.3%", delta: "+2.1%" },
];

export default function OrderManagementPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">OUR SOLUTIONS</span>
              <h1 className="mt-5 text-[36px] lg:text-[46px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                Order Management<br />Every order, every channel.{" "}
                <span className="gradient-text-teal">All in one place.</span>
              </h1>
              <p className="mt-5 text-[16px] text-text-body leading-relaxed max-w-[480px]">
                FulfillMesh unifies your entire order lifecycle — from placement to delivery — with automated workflows, real-time tracking, and actionable insights.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">Book a Demo <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-navy rounded-[10px] border border-border-soft bg-white hover:shadow-soft transition-all">See It in Action</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {["Multi-Channel Sync", "Automated Workflows", "Real-Time Tracking"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body"><CheckCircle2 className="w-4 h-4 text-teal" /> {t}</span>
                ))}
              </div>
            </div>
            {/* Hero dashboard */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-deep-navy">Orders Overview</span>
                <span className="text-[11px] text-text-muted">May 1 – May 31, 2025</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {heroStats.map((s) => (
                  <div key={s.label} className="border border-border-soft rounded-lg p-2.5">
                    <p className="text-[9px] text-text-muted leading-none mb-1">{s.label}</p>
                    <p className="text-[14px] font-bold text-deep-navy leading-tight">{s.value}</p>
                    <p className={`text-[9px] font-medium mt-0.5 ${s.delta.startsWith("-") ? "text-text-muted" : "text-teal"}`}>{s.delta}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border-soft rounded-lg p-3">
                  <p className="text-[10px] font-semibold text-deep-navy mb-2">Order Volume</p>
                  <svg viewBox="0 0 140 50" className="w-full h-auto">
                    <polyline fill="none" stroke="#0057D8" strokeWidth="1.5" points="0,40 20,30 40,35 60,20 80,25 100,12 120,18 140,8" />
                    <polyline fill="none" stroke="#00B894" strokeWidth="1.5" points="0,45 20,38 40,40 60,28 80,32 100,20 120,24 140,14" />
                  </svg>
                </div>
                <div className="border border-border-soft rounded-lg p-3">
                  <p className="text-[10px] font-semibold text-deep-navy mb-2">By Channel</p>
                  <div className="space-y-1.5">
                    {[
                      { c: "#0057D8", l: "Shopify", v: "46%" },
                      { c: "#00B894", l: "Amazon", v: "26%" },
                      { c: "#F59E0B", l: "Walmart", v: "15%" },
                      { c: "#8B5CF6", l: "eBay", v: "8%" },
                      { c: "#94A3B8", l: "Other", v: "5%" },
                    ].map((d) => (
                      <div key={d.l} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.c }} />
                        <span className="text-[8px] text-text-muted leading-none">{d.l}</span>
                        <span className="text-[8px] text-deep-navy font-semibold leading-none ml-auto">{d.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy">Everything you need to manage orders</h2>
            <p className="mt-3 text-[16px] text-text-body">From inbox to delivery — automate the busywork and focus on growth.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-border-soft hover:shadow-card transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center shrink-0"><f.icon className="w-5 h-5 text-action-blue" /></div>
                  <div>
                    <h3 className="text-[15px] font-bold text-deep-navy">{f.title}</h3>
                    <p className="mt-2 text-[13px] text-text-body leading-relaxed">{f.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-action-blue">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One dashboard */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-bold tracking-[0.12em] text-teal bg-teal/10 rounded-full px-3 py-1">ONE CONNECTED PLATFORM</span>
              <h2 className="mt-5 text-[30px] font-bold text-deep-navy leading-tight">One dashboard. Every order under control.</h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[420px]">Track order status, manage fulfillment stages, and resolve exceptions — all from a single, powerful command center.</p>
              <div className="mt-6 space-y-3">
                {dashBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-teal shrink-0" /><span className="text-[14px] text-text-body">{b}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-deep-navy">Recent Orders</span>
                <span className="text-[11px] text-text-muted">All Channels</span>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-text-muted border-b border-border-soft">
                    <th className="pb-2 font-medium">Order ID</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Channel</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ORD-5821", "Acme Retail", "Shopify", "$1,245.80", "In Transit"],
                    ["ORD-5820", "Global Traders", "Amazon", "$896.40", "Processing"],
                    ["ORD-5819", "Pacific Wholesale", "Walmart", "$1,540.00", "Delivered"],
                    ["ORD-5818", "Metro Distribution", "Shopify", "$672.25", "Processing"],
                    ["ORD-5817", "Summit Commerce", "eBay", "$342.10", "Delivered"],
                    ["ORD-5816", "Apex Goods", "Wholesale", "$2,180.50", "Cancelled"],
                  ].map((r) => {
                    const statusColor =
                      r[4] === "Cancelled" ? "text-text-muted" : r[4] === "Delivered" ? "text-teal" : r[4] === "In Transit" ? "text-action-blue" : "text-[#F59E0B]";
                    return (
                      <tr key={r[0]} className="border-t border-border-soft text-[10px]">
                        <td className="py-2.5 font-semibold text-deep-navy">{r[0]}</td>
                        <td className="py-2.5 text-text-body">{r[1]}</td>
                        <td className="py-2.5 text-text-body">{r[2]}</td>
                        <td className="py-2.5 text-text-body">{r[3]}</td>
                        <td className={`py-2.5 font-medium ${statusColor}`}>{r[4]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - fulfillment stages */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <h2 className="text-[30px] font-bold text-deep-navy">From placed to delivered</h2>
            <p className="mt-3 text-[16px] text-text-body">Every order moves through clear, trackable stages — automatically.</p>
          </div>
          <div className="relative grid md:grid-cols-4 gap-6">
            {stages.map((w, i) => (
              <div key={w.title} className="relative bg-soft-bg rounded-xl border border-border-soft p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-action-blue/10 flex items-center justify-center shrink-0"><w.icon className="w-5 h-5 text-action-blue" /></div>
                  <h3 className="text-[15px] font-bold text-deep-navy">{w.title}</h3>
                </div>
                <p className="text-[13px] text-text-muted leading-relaxed">{w.desc}</p>
                {i < stages.length - 1 && (<ArrowRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-4 h-4 text-[#ABB9DB]" />)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Better outcomes */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[30px] font-bold text-deep-navy leading-tight">Faster fulfillment. Happier customers.</h2>
              <p className="mt-4 text-[15px] text-text-body leading-relaxed max-w-[420px]">Streamline your order operations and turn fulfillment into a competitive advantage.</p>
              <div className="mt-6 space-y-3">
                {outcomeBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-teal shrink-0" /><span className="text-[14px] text-text-body">{b}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
              <p className="text-[13px] font-bold text-deep-navy mb-4">Insights that drive results</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {insightStats.map((s) => (
                  <div key={s.label} className="border border-border-soft rounded-lg p-3">
                    <p className="text-[16px] font-bold text-deep-navy">{s.value}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
                    <p className="text-[10px] font-medium text-teal mt-0.5">{s.delta}</p>
                  </div>
                ))}
              </div>
              <div className="border border-border-soft rounded-lg p-3">
                <p className="text-[10px] font-semibold text-deep-navy mb-2">On-Time Delivery Trend</p>
                <svg viewBox="0 0 280 50" className="w-full h-auto">
                  <polyline fill="none" stroke="#00B894" strokeWidth="1.5" points="0,40 40,30 80,33 120,20 160,25 200,12 240,16 280,8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="rounded-2xl text-white text-center px-6 py-14" style={{ background: "linear-gradient(135deg, #001F5E 0%, #00216A 50%, #001B52 100%)" }}>
            <h2 className="text-[30px] font-bold leading-tight">Ready to master your orders?</h2>
            <p className="mt-3 text-[16px] text-text-on-dark-muted">Unify every channel and automate fulfillment from a single dashboard.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">Book a Demo <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-[10px] border border-white/30 hover:bg-white/10 transition-all">See It in Action</Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["Free to get started", "No obligations", "Personalized walkthroughs"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-on-dark-soft"><CheckCircle2 className="w-4 h-4 text-teal" /> {t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
