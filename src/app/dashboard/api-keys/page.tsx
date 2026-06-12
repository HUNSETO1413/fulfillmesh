"use client";

import { useState } from "react";
import {
  Key, Activity, AlertTriangle, Gauge, Plus, Copy, Eye, EyeOff,
  Trash2, ExternalLink, BookOpen, Shield, CheckCircle2, Clock,
  ArrowUpRight, Search, ChevronDown, Webhook, Lock,
  ChevronRight,
} from "lucide-react";

/* ---------------- data ---------------- */

const stats = [
  { title: "Active Keys", value: "4", change: "1 expiring soon", dir: "flat" as const, icon: Key, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "Total Requests (30d)", value: "1.2M", change: "+18%", dir: "up" as const, icon: Activity, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
  { title: "Error Rate", value: "0.12%", change: "Below threshold", dir: "flat" as const, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Rate Limit Status", value: "Healthy", change: "No limits hit", dir: "flat" as const, icon: Gauge, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
];

interface ApiKey {
  id: number; name: string; env: string; key: string; full: string;
  created: string; lastUsed: string; permissions: string[]; status: "Active" | "Inactive";
}

const mockKeys: ApiKey[] = [
  { id: 1, name: "Production API Key", env: "Production", key: "fm_prod_k8x2…m9Rq", full: "fm_prod_k8x2aBcDeFgHiJkLm9Rq", created: "Apr 15, 2026", lastUsed: "May 31, 2026 09:14 AM", permissions: ["Orders", "Inventory", "Shipments"], status: "Active" },
  { id: 2, name: "Staging Environment", env: "Staging", key: "fm_stg_j4p7…n3Wx", full: "fm_stg_j4p7qRsTuVwXyZn3Wx", created: "May 01, 2026", lastUsed: "May 31, 2026 08:45 AM", permissions: ["Orders", "Products"], status: "Active" },
  { id: 3, name: "Analytics Service", env: "Production", key: "fm_anl_h6d1…k8Tz", full: "fm_anl_h6d1cDeFgHiJkLmK8Tz", created: "Mar 22, 2026", lastUsed: "May 30, 2026 05:30 PM", permissions: ["Reports", "Analytics"], status: "Active" },
  { id: 4, name: "Legacy Integration", env: "Production", key: "fm_leg_q9w5…p2Ym", full: "fm_leg_q9w5aBcDeFgHiJkLp2Ym", created: "Nov 10, 2025", lastUsed: "May 15, 2026 12:00 PM", permissions: ["Orders"], status: "Inactive" },
];

const recentRequests = [
  { method: "GET", path: "/v1/orders", status: 200, time: "09:14 AM" },
  { method: "POST", path: "/v1/shipments", status: 201, time: "09:12 AM" },
  { method: "GET", path: "/v1/inventory", status: 200, time: "09:08 AM" },
  { method: "PATCH", path: "/v1/orders/10876", status: 200, time: "09:02 AM" },
  { method: "GET", path: "/v1/products", status: 429, time: "08:55 AM" },
];

const bars = [65, 72, 58, 80, 90, 75, 85, 92, 88, 78, 95, 82, 70, 88, 93, 85, 76, 90, 87, 82, 94, 89, 78, 85, 92, 88, 95, 90, 86, 93];

/* ---------------- components ---------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] ${className}`}>{children}</div>;
}

export default function ApiKeysPage() {
  const [showKeys, setShowKeys] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div className="flex items-start justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-[12px] text-[#94A3B8] mb-1.5">
            <a href="/dashboard" className="hover:text-action-blue transition-colors">Dashboard</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#4A5A73] font-medium">API Keys</span>
          </nav>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold text-[#1E293B]">API Keys</h1>
            <Shield className="w-5 h-5 text-[#10B981]" />
          </div>
          <p className="text-[13px] text-[#64748B] mt-1">Manage API access credentials and monitor usage across your organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] text-[13px] font-medium hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <BookOpen className="w-4 h-4 text-[#94A3B8]" /> View Docs
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0057D8] text-white text-[13px] font-medium hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Plus className="w-4 h-4" /> Create New Key
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#64748B]">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#1E293B] leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {s.dir === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />}
                <span className={`text-[12px] font-medium ${s.dir === "up" ? "text-[#10B981]" : "text-[#94A3B8]"}`}>{s.change}</span>
                {s.dir === "up" && <span className="text-[11px] text-[#94A3B8]">vs last month</span>}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search keys by name or environment..."
            className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]">
          All Environments <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>
        <button className="inline-flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]">
          All Statuses <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>
      </div>

      {/* API Keys Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["Name", "Key", "Permissions", "Created", "Last Used", "Status", ""].map((h, i) => (
                  <th key={i} className={`text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-5 py-3 ${i === 6 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockKeys.map((k) => (
                <tr key={k.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#0057D8]/10 flex items-center justify-center shrink-0">
                        <Key className="w-4 h-4 text-[#0057D8]" />
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-[#1E293B] whitespace-nowrap">{k.name}</div>
                        <div className="text-[11px] text-[#94A3B8]">{k.env}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <code className="text-[12px] bg-[#F1F5F9] px-2 py-1 rounded font-mono text-[#64748B]">{showKeys[k.id] ? k.full : k.key}</code>
                      <button onClick={() => setShowKeys((p) => ({ ...p, [k.id]: !p[k.id] }))} className="p-1 rounded hover:bg-[#F8FAFC] text-[#94A3B8]">
                        {showKeys[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => { setCopied(k.id); setTimeout(() => setCopied(null), 1500); }} className="p-1 rounded hover:bg-[#F8FAFC] text-[#94A3B8]">
                        {copied === k.id ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {k.permissions.map((p) => (
                        <span key={p} className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-[#0057D8]/10 text-[#0057D8]">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B] whitespace-nowrap">{k.created}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {k.lastUsed}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 text-[12px] font-medium rounded-md ${k.status === "Active" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#94A3B8]/10 text-[#94A3B8]"}`}>
                      {k.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded hover:bg-[#F8FAFC] text-[#94A3B8] hover:text-[#1E293B]"><ExternalLink className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded hover:bg-[#EF4444]/10 text-[#94A3B8] hover:text-[#EF4444]"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
          <p className="text-[13px] text-[#64748B]">Showing 1 to 4 of 4 API keys</p>
        </div>
      </Card>

      {/* Usage chart + sidebar */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.7fr 1fr" }}>
        {/* API Usage Chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">API Usage (30 Days)</h3>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md font-medium">
              Daily <ChevronDown className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[12px] text-[#64748B] mb-3">Daily API request volume over the past 30 days</p>
          <div className="flex items-center gap-4 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0057D8]" />
              <span className="text-[12px] text-[#64748B]">Requests</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="text-[12px] text-[#64748B]">Errors</span>
            </span>
          </div>
          <div className="h-[200px] flex items-end gap-1.5">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-[#0057D8]/80 hover:bg-[#0057D8] transition-colors" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-[#94A3B8]">
            <span>May 1</span><span>May 8</span><span>May 15</span><span>May 22</span><span>May 31</span>
          </div>
        </Card>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Recent Requests */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Recent Requests</h3>
              <button className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {recentRequests.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px]">
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold font-mono ${
                    r.method === "GET" ? "bg-[#3B82F6]/10 text-[#3B82F6]" :
                    r.method === "POST" ? "bg-[#10B981]/10 text-[#10B981]" :
                    "bg-[#F59E0B]/10 text-[#F59E0B]"
                  }`}>{r.method}</span>
                  <code className="text-[11px] text-[#64748B] font-mono flex-1 truncate">{r.path}</code>
                  <span className={`text-[11px] font-medium ${r.status >= 400 ? "text-[#EF4444]" : "text-[#10B981]"}`}>{r.status}</span>
                  <span className="text-[10px] text-[#94A3B8]">{r.time}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* API Documentation card */}
          <Card className="p-5">
            <div className="w-9 h-9 rounded-lg bg-[#0057D8]/10 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5 text-[#0057D8]" />
            </div>
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-1">API Documentation</h3>
            <p className="text-[12px] text-[#64748B] mb-3">Explore endpoints, authentication, rate limits, and integration guides.</p>
            <div className="space-y-2 mb-4 text-[12px]">
              <div className="flex items-center gap-2 text-[#64748B]">
                <Lock className="w-3.5 h-3.5 text-[#10B981]" /> OAuth 2.0 &amp; API Key Auth
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <Activity className="w-3.5 h-3.5 text-[#10B981]" /> Rate Limits: 1000 req/min
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <Webhook className="w-3.5 h-3.5 text-[#10B981]" /> Webhook Support
              </div>
            </div>
            <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-medium text-white bg-[#0057D8] rounded-lg hover:bg-[#0047B3]">
              <ExternalLink className="w-4 h-4" /> View Documentation
            </button>
          </Card>
        </div>
      </div>

      {/* Security best practices CTA band */}
      <div className="bg-deep-navy rounded-xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-white">Secure your API integrations</h3>
            <p className="text-[12px] text-[#B8C7DA] mt-0.5">Follow best practices for key rotation, IP whitelisting, and access control to protect your data.</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-navy hover:bg-white/90 shrink-0">
          <BookOpen className="w-4 h-4" /> Security Guide
        </button>
      </div>
    </div>
  );
}
