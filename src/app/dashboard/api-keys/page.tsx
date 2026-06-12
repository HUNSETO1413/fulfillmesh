"use client";

import { useMemo, useState } from "react";
import {
  Key, Activity, AlertTriangle, Gauge, Plus, Copy, Eye, EyeOff,
  Trash2, ExternalLink, BookOpen, Shield, CheckCircle2, Clock,
  ArrowUpRight, Search, ChevronDown, Webhook, Lock,
  ChevronRight,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";

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

const initialKeys: ApiKey[] = [
  { id: 1, name: "Production API Key", env: "Production", key: "fm_prod_k8x2…m9Rq", full: "fm_prod_k8x2aBcDeFgHiJkLm9Rq", created: "Apr 15, 2026", lastUsed: "May 31, 2026 09:14 AM", permissions: ["Orders", "Inventory", "Shipments"], status: "Active" },
  { id: 2, name: "Staging Environment", env: "Staging", key: "fm_stg_j4p7…n3Wx", full: "fm_stg_j4p7qRsTuVwXyZn3Wx", created: "May 01, 2026", lastUsed: "May 31, 2026 08:45 AM", permissions: ["Orders", "Products"], status: "Active" },
  { id: 3, name: "Analytics Service", env: "Production", key: "fm_anl_h6d1…k8Tz", full: "fm_anl_h6d1cDeFgHiJkLmK8Tz", created: "Mar 22, 2026", lastUsed: "May 30, 2026 05:30 PM", permissions: ["Reports", "Analytics"], status: "Active" },
  { id: 4, name: "Legacy Integration", env: "Production", key: "fm_leg_q9w5…p2Ym", full: "fm_leg_q9w5aBcDeFgHiJkLp2Ym", created: "Nov 10, 2025", lastUsed: "May 15, 2026 12:00 PM", permissions: ["Orders"], status: "Inactive" },
];

const ENV_OPTIONS = ["Production", "Staging", "Development"];
const PERMISSION_OPTIONS = ["Orders", "Inventory", "Shipments", "Products", "Reports", "Analytics", "Returns"];

const recentRequests = [
  { method: "GET", path: "/v1/orders", status: 200, time: "09:14 AM" },
  { method: "POST", path: "/v1/shipments", status: 201, time: "09:12 AM" },
  { method: "GET", path: "/v1/inventory", status: 200, time: "09:08 AM" },
  { method: "PATCH", path: "/v1/orders/10876", status: 200, time: "09:02 AM" },
  { method: "GET", path: "/v1/products", status: 429, time: "08:55 AM" },
];

const bars = [65, 72, 58, 80, 90, 75, 85, 92, 88, 78, 95, 82, 70, 88, 93, 85, 76, 90, 87, 82, 94, 89, 78, 85, 92, 88, 95, 90, 86, 93];
const errorBars = [3, 5, 2, 4, 6, 3, 5, 8, 4, 3, 7, 5, 2, 6, 4, 3, 5, 7, 3, 4, 6, 5, 3, 4, 8, 5, 7, 6, 4, 5];

/* ---------------- helpers ---------------- */

function randomKey(env: string): string {
  const prefix = env === "Staging" ? "fm_stg" : env === "Development" ? "fm_dev" : "fm_prod";
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let body = "";
  for (let i = 0; i < 24; i++) body += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}_${body}`;
}

function maskKey(full: string): string {
  return `${full.slice(0, 11)}…${full.slice(-4)}`;
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

/* ---------------- components ---------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] ${className}`}>{children}</div>;
}

let nextId = 1000;

export default function ApiKeysPage() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [showKeys, setShowKeys] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | null>(null);

  const [query, setQuery] = useState("");
  const [envFilter, setEnvFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [envOpen, setEnvOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftEnv, setDraftEnv] = useState("Production");
  const [draftPerm, setDraftPerm] = useState("Orders");
  const [generated, setGenerated] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<ApiKey | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return keys.filter((k) => {
      const matchesQuery = !q || k.name.toLowerCase().includes(q) || k.env.toLowerCase().includes(q);
      const matchesEnv = !envFilter || k.env === envFilter;
      const matchesStatus = !statusFilter || k.status === statusFilter;
      return matchesQuery && matchesEnv && matchesStatus;
    });
  }, [keys, query, envFilter, statusFilter]);

  function openCreate() {
    setDraftName("");
    setDraftEnv("Production");
    setDraftPerm("Orders");
    setGenerated(null);
    setCreateOpen(true);
  }

  function generateKey() {
    if (!draftName.trim()) {
      toast("Key name is required", "error");
      return;
    }
    setBusy(true);
    const full = randomKey(draftEnv);
    const created: ApiKey = {
      id: ++nextId,
      name: draftName.trim(),
      env: draftEnv,
      key: maskKey(full),
      full,
      created: todayLabel(),
      lastUsed: "Never",
      permissions: [draftPerm],
      status: "Active",
    };
    setKeys((prev) => [created, ...prev]);
    setGenerated(full);
    setShowKeys((p) => ({ ...p, [created.id]: false }));
    setBusy(false);
    toast(`API key "${created.name}" generated`);
  }

  async function copyValue(id: number, value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard may be unavailable in some contexts; still show feedback */
    }
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
    toast("API key copied to clipboard");
  }

  async function copyGenerated() {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
    } catch {
      /* noop */
    }
    toast("API key copied to clipboard");
  }

  function confirmDelete() {
    if (!deleting) return;
    setKeys((prev) => prev.filter((k) => k.id !== deleting.id));
    toast(`API key "${deleting.name}" revoked`);
    setDeleting(null);
  }

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
          <button
            onClick={() => toast("Opening API documentation…", "info")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] text-[13px] font-medium hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <BookOpen className="w-4 h-4 text-[#94A3B8]" /> View Docs
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0057D8] text-white text-[13px] font-medium hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keys by name or environment..."
            className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => { setEnvOpen((v) => !v); setStatusOpen(false); }}
            className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-[13px] ${envFilter ? "border-[#0057D8] text-[#0057D8] bg-[#0057D8]/5" : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"}`}
          >
            {envFilter || "All Environments"} <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>
          {envOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setEnvOpen(false)} />
              <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1">
                <button onClick={() => { setEnvFilter(""); setEnvOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${!envFilter ? "text-[#0057D8] font-medium" : "text-[#374151]"}`}>All Environments</button>
                {ENV_OPTIONS.map((e) => (
                  <button key={e} onClick={() => { setEnvFilter(e); setEnvOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${envFilter === e ? "text-[#0057D8] font-medium" : "text-[#374151]"}`}>{e}</button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => { setStatusOpen((v) => !v); setEnvOpen(false); }}
            className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-[13px] ${statusFilter ? "border-[#0057D8] text-[#0057D8] bg-[#0057D8]/5" : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"}`}
          >
            {statusFilter || "All Statuses"} <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>
          {statusOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
              <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1">
                <button onClick={() => { setStatusFilter(""); setStatusOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${!statusFilter ? "text-[#0057D8] font-medium" : "text-[#374151]"}`}>All Statuses</button>
                {["Active", "Inactive"].map((s) => (
                  <button key={s} onClick={() => { setStatusFilter(s); setStatusOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${statusFilter === s ? "text-[#0057D8] font-medium" : "text-[#374151]"}`}>{s}</button>
                ))}
              </div>
            </>
          )}
        </div>
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
              {filtered.map((k) => (
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
                      <button onClick={() => setShowKeys((p) => ({ ...p, [k.id]: !p[k.id] }))} className="p-1 rounded hover:bg-[#F8FAFC] text-[#94A3B8]" aria-label={showKeys[k.id] ? "Hide key" : "Reveal key"}>
                        {showKeys[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => copyValue(k.id, k.full)} className="p-1 rounded hover:bg-[#F8FAFC] text-[#94A3B8]" aria-label="Copy key">
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
                      <button onClick={() => toast(`Opening usage details for "${k.name}"…`, "info")} className="p-1.5 rounded hover:bg-[#F8FAFC] text-[#94A3B8] hover:text-[#1E293B]" aria-label="View details"><ExternalLink className="w-4 h-4" /></button>
                      <button onClick={() => setDeleting(k)} className="p-1.5 rounded hover:bg-[#EF4444]/10 text-[#94A3B8] hover:text-[#EF4444]" aria-label={`Revoke ${k.name}`}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-[13px] text-[#64748B]">No API keys match your filters.</p>
                    <button onClick={openCreate} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0057D8] hover:underline">
                      <Plus className="w-4 h-4" /> Create a new key
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
          <p className="text-[13px] text-[#64748B]">Showing {filtered.length} of {keys.length} API keys</p>
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
              <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                <div className="w-full rounded-t bg-[#0057D8]/80 hover:bg-[#0057D8] transition-colors" style={{ height: `${h}%` }} />
                <div className="w-full rounded-t bg-[#EF4444]/80 hover:bg-[#EF4444] transition-colors" style={{ height: `${errorBars[i]}%` }} />
              </div>
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
              <button onClick={() => toast("Opening full request log…", "info")} className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
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
            <button onClick={() => toast("Opening API documentation…", "info")} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-medium text-white bg-[#0057D8] rounded-lg hover:bg-[#0047B3]">
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
        <button onClick={() => toast("Opening the security guide…", "info")} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-navy hover:bg-white/90 shrink-0">
          <BookOpen className="w-4 h-4" /> Security Guide
        </button>
      </div>

      {/* Create key modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New API Key"
        description={generated ? "Your key was generated. Copy it now — you won't be able to see the full value again." : "Generate a new API key for your integrations."}
        footer={
          generated ? (
            <PrimaryButton onClick={() => setCreateOpen(false)}>Done</PrimaryButton>
          ) : (
            <>
              <SecondaryButton onClick={() => setCreateOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton onClick={generateKey} disabled={busy}>
                {busy ? "Generating…" : "Generate Key"}
              </PrimaryButton>
            </>
          )
        }
      >
        {generated ? (
          <div className="space-y-3">
            <Field label="Your new API key">
              <div className="flex items-center gap-2">
                <code className="flex-1 text-[12px] bg-[#F1F5F9] px-3 py-2 rounded font-mono text-[#1E293B] break-all">{generated}</code>
                <button onClick={copyGenerated} className="shrink-0 p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Copy generated key">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </Field>
            <div className="flex items-start gap-2 text-[12px] text-[#92400E] bg-[#FEF3C7] rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Store this key securely. For your protection, the full value is shown only once.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Key name" required>
              <TextInput value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="e.g. Production API Key" />
            </Field>
            <Field label="Environment">
              <Select options={ENV_OPTIONS} value={draftEnv} onChange={(e) => setDraftEnv(e.target.value)} />
            </Field>
            <Field label="Permission scope">
              <Select options={PERMISSION_OPTIONS} value={draftPerm} onChange={(e) => setDraftPerm(e.target.value)} />
            </Field>
          </div>
        )}
      </Modal>

      {/* Revoke confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Revoke API key"
        message={`Are you sure you want to revoke "${deleting?.name}"? Any integration using this key will immediately lose access. This cannot be undone.`}
        confirmLabel="Revoke key"
        destructive
      />
    </div>
  );
}
