import Link from "next/link";
import {
  Check,
  RefreshCw,
  Globe,
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Warehouse,
  Truck,
  Plug,
  Info,
  ArrowRight,
  Bell,
  TrendingUp,
  Shield,
  FileText,
  Scale,
} from "lucide-react";

const services = [
  { name: "Website", icon: Globe },
  { name: "Customer Dashboard", icon: LayoutDashboard },
  { name: "Order Management", icon: ShoppingCart },
  { name: "Inventory Management", icon: Boxes },
  { name: "Warehousing", icon: Warehouse },
  { name: "Shipping", icon: Truck },
  { name: "Integrations (API)", icon: Plug },
];

function Sparkline() {
  const heights = [
    78, 92, 70, 96, 84, 100, 76, 90, 82, 98, 72, 94, 86, 100, 74, 88, 80, 96,
    70, 92, 84, 100, 76, 90,
  ];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 20 }}>
      {heights.map((h, i) => (
        <span
          key={i}
          style={{ width: 2, height: `${h}%`, borderRadius: 1, background: "#00B894", display: "block" }}
        />
      ))}
    </div>
  );
}

function HeroChart() {
  return (
    <div
      className="rounded-2xl bg-white"
      style={{ width: 300, height: 170, boxShadow: "0 12px 32px rgba(3,18,46,0.1)", position: "relative" }}
    >
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border-soft">
        <span className="h-2.5 w-2.5 rounded-full bg-action-blue" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-blue" />
      </div>
      <svg width="300" height="118" viewBox="0 0 300 118" fill="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id="statusLine" x1="20" y1="0" x2="285" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0057D8" />
            <stop offset="1" stopColor="#00B894" />
          </linearGradient>
          <linearGradient id="statusFill" x1="0" y1="0" x2="0" y2="118" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00B894" stopOpacity="0.18" />
            <stop offset="1" stopColor="#00B894" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M20,92 55,82 90,88 125,58 160,66 195,38 230,46 265,18 285,26 L285,118 L20,118 Z"
          fill="url(#statusFill)"
        />
        <polyline
          points="20,92 55,82 90,88 125,58 160,66 195,38 230,46 265,18 285,26"
          fill="none"
          stroke="url(#statusLine)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{ position: "absolute", right: -14, bottom: -14, width: 48, height: 48, borderRadius: 999, background: "#00B894", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Check className="w-6 h-6 text-white" strokeWidth={3} />
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto px-5 py-10">
        {/* Hero */}
        <div className="flex items-start justify-between gap-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[32px] leading-tight font-bold text-[#1A202C] tracking-[-0.02em]">
                Status Page
              </h1>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal text-white">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </span>
            </div>
            <p className="mt-3 text-base text-[#6B7280]">
              All systems are running smoothly. No active incidents.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#9CA3AF]">
              <RefreshCw className="w-3.5 h-3.5" />
              Last updated: May 12, 2025 10:30 AM (UTC)
            </div>
          </div>
          <div className="shrink-0" style={{ display: "flex" }}>
            <HeroChart />
          </div>
        </div>

        {/* Overall banner */}
        <div className="mt-10 flex items-center gap-4 rounded-lg border border-[#10B981] bg-[#ECFDF5] px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10B981] text-white">
            <Check className="w-5 h-5" strokeWidth={3} />
          </span>
          <div>
            <p className="text-lg font-semibold text-[#059669]">All Systems Operational</p>
            <p className="text-sm text-[#6B7280]">Everything is functioning as expected. No active incidents.</p>
          </div>
        </div>

        {/* System Status */}
        <h2 className="mt-10 text-xl font-semibold text-[#1A202C]">System Status</h2>
        <div className="mt-4 rounded-lg border border-[#E5E7EB] overflow-hidden">
          {services.map((s, i) => (
            <div
              key={s.name}
              className={`flex items-center gap-3 px-5 py-3.5 ${
                i > 0 ? "border-t border-[#E5E7EB]" : ""
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded bg-[#EFF6FF] text-action-blue">
                <s.icon className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-medium text-[#374151]">{s.name}</span>
              <Info className="w-3.5 h-3.5 text-[#9CA3AF] ml-0.5" />
              <span className="ml-auto">
                <span className="inline-flex items-center rounded-full bg-[#10B981] px-2.5 py-0.5 text-xs font-medium text-white">
                  Operational
                </span>
              </span>
              <Sparkline />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="#" className="inline-flex items-center gap-1.5 font-medium text-action-blue hover:underline">
            <TrendingUp className="w-4 h-4" /> View historical uptime
          </Link>
          <span className="font-semibold text-teal">100% uptime in the last 90 days</span>
        </div>

        {/* Recent Incidents */}
        <div className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]">
              <Shield className="w-4 h-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#1A202C]">Recent Incidents</p>
              <p className="text-sm text-[#6B7280]">No incidents reported in the last 90 days.</p>
            </div>
          </div>
          <Link href="#" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
            View all incidents <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Subscribe */}
        <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] text-action-blue">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#1A202C]">Subscribe to Updates</p>
              <p className="text-sm text-[#6B7280]">Get notified about incidents and maintenance.</p>
            </div>
          </div>
          <div className="mt-3 flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF] focus:border-action-blue"
            />
            <button className="rounded-lg bg-action-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-[#E5E7EB] pt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1A202C]">Status Page</span>
            <span className="text-sm text-[#6B7280]">&copy; 2025 FulfillMesh. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/legal/terms" className="inline-flex items-center gap-1 text-sm text-action-blue hover:underline">
                <FileText className="w-3.5 h-3.5" /> Terms of Service
              </Link>
              <Link href="/legal/privacy" className="inline-flex items-center gap-1 text-sm text-action-blue hover:underline">
                <Scale className="w-3.5 h-3.5" /> Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
