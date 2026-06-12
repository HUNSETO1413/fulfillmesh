"use client";

import { useMemo, useState } from "react";
import {
  Plug, CheckCircle2, RefreshCw, AlertTriangle, Clock, Shield,
  Search, Plus, ScrollText, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, ArrowRight, ArrowLeft, ExternalLink,
  ShoppingBag, Boxes, Truck, Calculator, Bell, FileSpreadsheet,
  Store, KeyRound, Webhook, GitMerge, Download,
  ChevronRight,
} from "lucide-react";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/Toast";

/* ---------------- data ---------------- */

const stats = [
  { title: "Connected Integrations", value: "12", change: "20%", dir: "up", icon: Plug, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]", note: "vs last 30 days" },
  { title: "Active Connections", value: "11", change: "10%", dir: "up", icon: CheckCircle2, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]", note: "vs last 30 days" },
  { title: "Data Syncs (24h)", value: "1,248", change: "15%", dir: "up", icon: RefreshCw, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]", note: "vs yesterday" },
  { title: "Failed Syncs (24h)", value: "8", change: "5%", dir: "down", icon: AlertTriangle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]", note: "vs yesterday" },
  { title: "Last Sync", value: "2 min ago", change: "", dir: "flat", icon: Clock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]", note: "All systems operational" },
];

const catStyle: Record<string, string> = {
  "Sales Channel": "bg-[#0057D8]/10 text-[#0057D8]",
  "Marketplace": "bg-[#7C6FF6]/10 text-[#7C6FF6]",
  "Shipping": "bg-[#F59E0B]/10 text-[#F59E0B]",
  "Accounting": "bg-[#0891B2]/10 text-[#0891B2]",
  "ERP": "bg-[#EC4899]/10 text-[#EC4899]",
  "Communication": "bg-[#EF4444]/10 text-[#EF4444]",
  "Productivity": "bg-[#00B894]/10 text-[#00B894]",
  "Automation": "bg-[#F97316]/10 text-[#F97316]",
  "Custom": "bg-[#4B5563]/10 text-[#4B5563]",
};

interface IntegrationRow { name: string; type: string; cat: string; status: "Connected" | "Disconnected"; sync: string; iconBg: string; iconColor: string; icon: typeof Plug }

const initialRows: IntegrationRow[] = [
  { name: "Shopify", type: "E-commerce", cat: "Sales Channel", status: "Connected", sync: "2 min ago", iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]", icon: ShoppingBag },
  { name: "Amazon Seller Central", type: "Marketplace", cat: "Marketplace", status: "Connected", sync: "5 min ago", iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]", icon: Store },
  { name: "Walmart", type: "Marketplace", cat: "Marketplace", status: "Connected", sync: "10 min ago", iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]", icon: Store },
  { name: "ShipStation", type: "Shipping", cat: "Shipping", status: "Connected", sync: "1 min ago", iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]", icon: Truck },
  { name: "Shippo", type: "Shipping", cat: "Shipping", status: "Connected", sync: "3 min ago", iconBg: "bg-[#0891B2]/10", iconColor: "text-[#0891B2]", icon: Truck },
  { name: "EasyPost", type: "Shipping", cat: "Shipping", status: "Connected", sync: "5 min ago", iconBg: "bg-[#EC4899]/10", iconColor: "text-[#EC4899]", icon: Truck },
  { name: "QuickBooks Online", type: "Accounting", cat: "Accounting", status: "Connected", sync: "12 min ago", iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]", icon: Calculator },
  { name: "NetSuite", type: "ERP", cat: "ERP", status: "Connected", sync: "20 min ago", iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]", icon: Boxes },
  { name: "Slack", type: "Communication", cat: "Communication", status: "Connected", sync: "4 min ago", iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]", icon: Bell },
  { name: "Google Sheets", type: "Spreadsheet", cat: "Productivity", status: "Connected", sync: "8 min ago", iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]", icon: FileSpreadsheet },
  { name: "Zapier", type: "Automation", cat: "Automation", status: "Connected", sync: "16 min ago", iconBg: "bg-[#F97316]/10", iconColor: "text-[#F97316]", icon: GitMerge },
  { name: "Custom API", type: "Custom", cat: "Custom", status: "Connected", sync: "4 min ago", iconBg: "bg-[#4B5563]/10", iconColor: "text-[#4B5563]", icon: Webhook },
];

const health = [
  { name: "Connected", count: 11, pct: "91.7%", color: "#00B894" },
  { name: "Active", count: 11, pct: "91.7%", color: "#0057D8" },
  { name: "Not Connected", count: 1, pct: "8.3%", color: "#EF4444" },
];

const popular = [
  { name: "Shopify", desc: "Sync orders, inventory, and fulfillment", action: "Connect", iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]", icon: ShoppingBag },
  { name: "Amazon Seller Central", desc: "Sync orders and inventory", action: "Connect", iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]", icon: Store },
  { name: "ShipStation", desc: "Manage shipping and tracking", action: "Manage", iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]", icon: Truck },
  { name: "QuickBooks Online", desc: "Sync invoices and payments", action: "Manage", iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]", icon: Calculator },
];

const quickActions = [
  { label: "Browse Integration Marketplace", icon: Store },
  { label: "Manage API Keys", icon: KeyRound },
  { label: "View Webhooks", icon: Webhook },
  { label: "Configure Data Mapping", icon: GitMerge },
  { label: "Download Integration Guide", icon: Download },
];

/* ---------------- components ---------------- */

const CATEGORIES = ["Sales Channel", "Marketplace", "Shipping", "Accounting", "ERP", "Communication", "Productivity", "Automation", "Custom"];

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<IntegrationRow[]>(initialRows);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<IntegrationRow | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQuery = !q || r.name.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
      const matchesCat = !catFilter || r.cat === catFilter;
      const matchesStatus = !statusFilter || r.status === statusFilter;
      return matchesQuery && matchesCat && matchesStatus;
    });
  }, [rows, query, catFilter, statusFilter]);

  function setStatus(name: string, status: "Connected" | "Disconnected") {
    setRows((cur) => cur.map((r) => (r.name === name ? { ...r, status, sync: status === "Connected" ? "Just now" : "—" } : r)));
  }

  function connect(name: string) {
    setStatus(name, "Connected");
    setOpenMenu(null);
    toast(`${name} connected`);
  }

  function confirmDisconnect() {
    if (!disconnecting) return;
    setStatus(disconnecting.name, "Disconnected");
    toast(`${disconnecting.name} disconnected`);
    setDisconnecting(null);
  }

  const [detailTab, setDetailTab] = useState("Overview");

  const selectCls = "inline-flex items-center gap-2 px-3 py-2 border border-border-soft rounded-lg text-[13px] text-text-muted bg-white hover:bg-soft-bg focus:outline-none focus:ring-2 focus:ring-action-blue/20";

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 mb-1.5 text-[12px]">
            <a href="/dashboard" className="text-text-muted hover:text-action-blue">Dashboard</a>
            <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            <span className="font-medium text-text-primary">Integrations</span>
          </nav>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold text-text-primary">Integrations</h1>
            <Shield className="w-5 h-5 text-teal" />
          </div>
          <p className="text-[14px] text-text-muted mt-0.5">Connect FulfillMesh with your favorite tools and services to automate workflows and sync data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast("Opening integration logs…", "info")} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-soft bg-white text-text-body text-[13px] font-medium hover:bg-soft-bg shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <ScrollText className="w-4 h-4 text-text-light" /> View Logs
          </button>
          <button onClick={() => toast("Browse the integration marketplace", "info")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action-blue text-white text-[13px] font-medium hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Plus className="w-4 h-4" /> Add Integration
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-lg border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-text-muted">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-text-primary leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {s.dir === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-teal" />}
                {s.dir === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
                {s.change && <span className={`text-[12px] font-medium ${s.dir === "up" ? "text-teal" : "text-[#EF4444]"}`}>{s.change}</span>}
                <span className="text-[11px] text-text-light">{s.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border-soft p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search integrations..." className="w-full pl-9 pr-4 py-2 text-[13px] bg-white border border-border-soft rounded-lg text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20" />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={selectCls}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
          <option value="">All Statuses</option>
          <option value="Connected">Connected</option>
          <option value="Disconnected">Disconnected</option>
        </select>
        <button onClick={() => { setQuery(""); setCatFilter(""); setStatusFilter(""); toast("Filters cleared", "info"); }} className="inline-flex items-center gap-2 px-3 py-2 border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg">
          Clear
        </button>
      </div>

      {/* Main: table + sidebar */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr) 300px" }}>
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-soft-bg border-b border-border-soft">
                  {["Integration", "Category", "Status", "Last Sync", "Data Flow", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const RowIcon = r.icon;
                  const connected = r.status === "Connected";
                  return (
                  <tr key={r.name} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${r.iconBg} flex items-center justify-center shrink-0`}>
                          <RowIcon className={`w-4 h-4 ${r.iconColor}`} />
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-text-primary whitespace-nowrap">{r.name}</div>
                          <div className="text-[11px] text-text-light">{r.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded ${catStyle[r.cat]} whitespace-nowrap`}>{r.cat}</span></td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${connected ? "text-teal" : "text-text-light"}`}><span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-teal" : "bg-[#9AA8B8]"}`} />{r.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-text-muted whitespace-nowrap">{r.sync}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-text-light"><ArrowLeft className="w-3.5 h-3.5" /><ArrowRight className="w-3.5 h-3.5" /></div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {connected ? (
                          <button onClick={() => toast(`Configuring ${r.name}…`, "info")} className="text-[12px] font-medium text-action-blue hover:underline">Configure</button>
                        ) : (
                          <button onClick={() => connect(r.name)} className="text-[12px] font-medium text-action-blue hover:underline">Connect</button>
                        )}
                        <div className="relative inline-block">
                          <button onClick={() => setOpenMenu(openMenu === r.name ? null : r.name)} className="p-1 rounded hover:bg-soft-bg text-text-light" aria-label="Integration actions"><MoreHorizontal className="w-4 h-4" /></button>
                          {openMenu === r.name && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                              <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-border-soft shadow-lg py-1 text-left">
                                <button onClick={() => { setOpenMenu(null); toast(`Syncing ${r.name}…`); }} className="w-full text-left px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" /> Sync now</button>
                                <button onClick={() => { setOpenMenu(null); toast(`Configuring ${r.name}…`, "info"); }} className="w-full text-left px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg flex items-center gap-2"><Plug className="w-3.5 h-3.5" /> Configure</button>
                                {connected ? (
                                  <button onClick={() => { setOpenMenu(null); setDisconnecting(r); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Disconnect</button>
                                ) : (
                                  <button onClick={() => connect(r.name)} className="w-full text-left px-3 py-1.5 text-[13px] text-teal hover:bg-soft-bg flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Connect</button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[13px] text-text-muted">No integrations match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-border-soft text-[12px] text-text-muted">Showing {filtered.length} of {rows.length} integrations</div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Integration Health */}
          <div className="bg-white rounded-lg border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5">
            <h3 className="text-[16px] font-semibold text-text-primary mb-4">Integration Health</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-[120px] h-[120px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#00B894" strokeWidth="12" strokeDasharray={`${91.7 * 2.51327} ${251.327 - 91.7 * 2.51327}`} />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray={`${8.3 * 2.51327} ${251.327 - 8.3 * 2.51327}`} strokeDashoffset={-91.7 * 2.51327} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[20px] font-bold text-text-primary">12</p>
                  <p className="text-[10px] text-text-muted">Total</p>
                </div>
              </div>
              <div className="w-full mt-4 space-y-2">
                {health.map((h) => (
                  <div key={h.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }} /><span className="text-text-muted">{h.name}</span></div>
                    <span className="font-medium text-text-primary">{h.count} ({h.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Integrations */}
          <div className="bg-white rounded-lg border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5">
            <h3 className="text-[16px] font-semibold text-text-primary mb-3">Popular Integrations</h3>
            <div className="space-y-3">
              {popular.map((p) => {
                const PopIcon = p.icon;
                return (
                <div key={p.name} className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg ${p.iconBg} flex items-center justify-center shrink-0`}><PopIcon className={`w-4 h-4 ${p.iconColor}`} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-text-primary truncate">{p.name}</p>
                    <p className="text-[10px] text-text-light truncate">{p.desc}</p>
                  </div>
                  <button onClick={() => { if (p.action === "Connect") connect(p.name); else toast(`Managing ${p.name}…`, "info"); }} className="text-[12px] font-medium text-action-blue hover:underline shrink-0">{p.action}</button>
                </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5">
            <h3 className="text-[16px] font-semibold text-text-primary mb-3">Quick Actions</h3>
            <div className="space-y-0.5">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.label} onClick={() => toast(`${a.label}…`, "info")} className="w-full flex items-center gap-2.5 px-2 py-2 text-[13px] text-text-body rounded-lg hover:bg-soft-bg transition-colors">
                    <Icon className="w-4 h-4 text-text-muted shrink-0" />
                    <span className="flex-1 text-left">{a.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-text-light shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Integration CTA */}
          <div className="bg-white rounded-lg border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5">
            <h3 className="text-[15px] font-semibold text-text-primary mb-1">Need a Custom Integration?</h3>
            <p className="text-[12px] text-text-muted mb-3">Our team can build a custom integration for your business needs.</p>
            <button onClick={() => toast("Integration request submitted", "success")} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-[#0047B3]">
              Request Integration <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Integration Details */}
      <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="px-5 pt-4 border-b border-border-soft">
          <h2 className="text-[16px] font-semibold text-text-primary mb-3">Integration Details</h2>
        </div>
        <div className="grid gap-4 p-5" style={{ gridTemplateColumns: "200px minmax(0,1fr) 220px" }}>
          {/* Left: integration card */}
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#00B894]/10 flex items-center justify-center mb-2"><ShoppingBag className="w-6 h-6 text-[#00B894]" /></div>
            <h3 className="text-[15px] font-semibold text-text-primary">Shopify</h3>
            <p className="text-[11px] text-text-light mb-2">Sales Channel</p>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-teal mb-3"><span className="w-1.5 h-1.5 rounded-full bg-teal" />Connected</span>
            <div className="text-[11px] text-text-muted space-y-1 mb-3">
              <div><span className="text-text-light">Connection since</span><div>May 15, 2026 10:00 AM</div></div>
              <div><span className="text-text-light">Connected by</span><div>admin@fulfillmesh.com</div></div>
            </div>
            <button onClick={() => toast("Configuring Shopify…", "info")} className="w-full px-3 py-2 text-[13px] font-medium text-text-body border border-border-soft rounded-lg hover:bg-soft-bg transition-colors">Configure</button>
            <button onClick={() => setDisconnecting(rows.find((r) => r.name === "Shopify") ?? null)} className="w-full mt-2 px-3 py-2 text-[13px] font-medium text-[#EF4444] border border-border-soft rounded-lg hover:bg-[#FEF2F2] transition-colors">Disconnect</button>
          </div>

          {/* Middle: overview */}
          <div>
            <nav className="flex gap-6 border-b border-border-soft mb-4">
              {["Overview", "Data Sync", "Settings", "Activity Log", "Webhooks"].map((t) => (
                <button key={t} onClick={() => setDetailTab(t)} className={`pb-2.5 text-[13px] font-medium border-b-2 transition-colors ${detailTab === t ? "border-action-blue text-action-blue" : "border-transparent text-text-muted hover:text-text-primary"}`}>{t}</button>
              ))}
            </nav>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {([
                ["Orders Synced", "2,753", "#00B894"],
                ["Products Synced", "1,289", "#0057D8"],
                ["Inventory Updates", "4,621", "#7C6FF6"],
              ] as const).map(([k, v, color]) => (
                <div key={k} className="border border-border-soft rounded-lg p-3">
                  <p className="text-[11px] text-text-muted">{k}</p>
                  <p className="text-[20px] font-bold text-text-primary">{v}</p>
                  <svg viewBox="0 0 100 24" className="w-full h-6 mt-1" preserveAspectRatio="none">
                    <polyline points="0,18 16,14 32,16 48,8 64,11 80,5 100,7" fill="none" stroke={color} strokeWidth="1.5" />
                  </svg>
                  <p className="text-[10px] text-text-light mt-1">Last 7 days</p>
                </div>
              ))}
            </div>
            <h4 className="text-[13px] font-semibold text-text-primary mb-2">Recent Activity</h4>
            <div className="space-y-2">
              {[
                ["Orders synced", "May 31, 2026 09:14 AM", "Success"],
                ["Inventory updated for 35 SKUs", "May 31, 2026 09:08 AM", "Success"],
                ["Product created: Wireless Headphones", "May 31, 2026 08:42 AM", "Success"],
                ["Webhook received: order/create", "May 31, 2026 08:30 AM", "Success"],
                ["Request to Shopify API", "May 31, 2026 08:15 AM", "Success"],
              ].map(([t, time, s], i) => (
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <div><span className="text-text-primary">{t}</span><span className="text-text-light ml-2">{time}</span></div>
                  <span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded bg-[#00B894]/10 text-[#00B894]">{s}</span>
                </div>
              ))}
            </div>
            <button onClick={() => toast("Opening full activity log…", "info")} className="mt-3 text-[12px] font-medium text-action-blue hover:underline">View all activity</button>
          </div>

          {/* Right: data flow */}
          <div>
            <h4 className="text-[13px] font-semibold text-text-primary mb-3">Data Flow</h4>
            <div className="space-y-2">
              {[
                ["Inbound (To FulfillMesh)", "", true],
                ["Orders", "Every 5 min", true],
                ["Inventory", "Every 5 min", true],
                ["Outbound (From FulfillMesh)", "", false],
                ["Products", "Every 30 min", false],
                ["Fulfillments", "Real-time", false],
                ["Tracking", "Real-time", false],
              ].map(([label, freq, inbound], i) => (
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <span className={freq ? "text-text-muted" : "text-text-primary font-medium"}>{label as string}</span>
                  {freq ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-text-light">
                      {freq as string}
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${inbound ? "bg-[#00B894]/10 text-[#00B894]" : "bg-action-blue/10 text-action-blue"}`}>{inbound ? "Inbound" : "Outbound"}</span>
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <button onClick={() => toast("Opening data mapping…", "info")} className="w-full mt-4 px-3 py-2 text-[13px] font-medium text-text-body border border-border-soft rounded-lg hover:bg-soft-bg transition-colors">View Data Mapping</button>
          </div>
        </div>
      </div>

      {/* Ready to connect more? CTA banner */}
      <div className="bg-deep-navy rounded-xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Plug className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-white">Ready to connect more?</h3>
            <p className="text-[12px] text-text-on-dark-muted mt-0.5">Browse our marketplace of 200+ integrations or request a custom one tailored to your workflow.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => toast("Browse the integration marketplace", "info")} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-navy hover:bg-white/90">
            <Store className="w-4 h-4" /> Browse Marketplace
          </button>
          <button onClick={() => toast("Integration request submitted", "success")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 text-white text-[13px] font-medium hover:bg-white/10">
            Request Integration <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Disconnect confirm */}
      <ConfirmDialog
        open={!!disconnecting}
        onClose={() => setDisconnecting(null)}
        onConfirm={confirmDisconnect}
        title="Disconnect integration"
        message={`Disconnect ${disconnecting?.name}? Data syncing will stop until you reconnect.`}
        confirmLabel="Disconnect"
        destructive
      />
    </div>
  );
}
