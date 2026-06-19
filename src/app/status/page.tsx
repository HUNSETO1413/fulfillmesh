import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  TrendingUp,
  Shield,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import StatusBoard from "./StatusBoard";
import StatusSubscribe from "./StatusSubscribe";

export const metadata: Metadata = pageMetadata({
  title: "System Status",
  description:
    "Check the real-time operational status of FulfillMesh services including the website, customer dashboard, order management, inventory, warehousing, shipping, and API integrations.",
  path: "/status",
  keywords: [
    "FulfillMesh status",
    "system status",
    "service uptime",
    "platform status",
    "incident history",
  ],
});

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
              <h1 className="text-[40px] leading-[1.1] font-bold text-deep-navy tracking-[-0.02em]">
                Status Page
              </h1>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal text-teal">
                <Check className="w-4 h-4" strokeWidth={3} />
              </span>
            </div>
            <p className="mt-3 text-[16px] text-text-body">
              Real-time updates on the status of FulfillMesh services.
            </p>
          </div>
          <div className="shrink-0 hidden md:flex">
            <HeroChart />
          </div>
        </div>

        {/* Live status: last-updated, overall banner, and per-service health */}
        <StatusBoard />

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/resources/help-center" className="inline-flex items-center gap-1.5 font-medium text-action-blue hover:underline">
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
          <Link href="/resources/help-center" className="inline-flex items-center gap-1 text-sm font-medium text-action-blue hover:underline">
            View all incidents <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Subscribe */}
        <StatusSubscribe />
      </div>
    </div>
  );
}
