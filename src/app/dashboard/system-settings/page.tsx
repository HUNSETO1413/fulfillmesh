"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Settings as SettingsIcon, Download, Save, CheckCircle2, ChevronDown, ChevronRight,
  Package, Warehouse, Bell, Shield,
  Mail, FileText, Users, ScrollText, Trash2, HardDriveDownload,
} from "lucide-react";
import { useToast } from "@/components/dashboard/Toast";

/* ---------------- components ---------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-lg border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${className}`}>{children}</div>;
}

function Toggle({ on, label, name }: { on: boolean; label?: string; name?: string }) {
  const { toast } = useContext(SettingsToastCtx);
  const [enabled, setEnabled] = useState(on);
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          const next = !enabled;
          setEnabled(next);
          toast(`${name ?? "Setting"} ${next ? "enabled" : "disabled"}`);
        }}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? "bg-action-blue" : "bg-[#CBD5E1]"}`}
        aria-label={name ?? label}
      >
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${enabled ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
      </button>
      <span className={`text-xs ${enabled ? "text-text-primary" : "text-text-light"}`}>{enabled ? "Enabled" : "Disabled"}</span>
    </div>
  );
}

const SettingsToastCtx = createContext<{ toast: (m: string, t?: "success" | "error" | "info") => void }>({ toast: () => {} });

function FieldRow({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  const child = React.isValidElement(children) && (children.type === Toggle || children.type === SelectInput || children.type === TextInput)
    ? React.cloneElement(children as React.ReactElement<{ name?: string }>, { name: label })
    : children;
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <span className="text-[13px] text-text-body">{label}</span>
        {hint && <div className="text-[10px] text-text-light mt-0.5">{hint}</div>}
      </div>
      <div className="shrink-0">{child}</div>
    </div>
  );
}

function TextInput({ value, name }: { value: string; name?: string }) {
  const { toast } = useContext(SettingsToastCtx);
  return <input defaultValue={value} aria-label={name} onBlur={(e) => { if (e.target.value !== value) toast(`${name ?? "Field"} updated`); }} className="w-[200px] px-3 py-1.5 text-[13px] text-text-primary border border-border-soft rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue" />;
}

function SelectInput({ value, name, options }: { value: string; name?: string; options?: string[] }) {
  const { toast } = useContext(SettingsToastCtx);
  const opts = options && options.length ? options : [value];
  const list = opts.includes(value) ? opts : [value, ...opts];
  return (
    <div className="relative w-[200px]">
      <select
        defaultValue={value}
        aria-label={name}
        onChange={(e) => toast(`${name ?? "Setting"} set to ${e.target.value}`)}
        className="w-full appearance-none px-3 py-1.5 pr-8 text-[13px] border border-border-soft rounded-lg text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-action-blue/20"
      >
        {list.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-light pointer-events-none" />
    </div>
  );
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-1">
      <h2 className="text-[15px] font-semibold text-text-primary">{children}</h2>
      {subtitle && <p className="text-[12px] text-text-muted mt-0.5">{subtitle}</p>}
    </div>
  );
}

/* ---------------- data ---------------- */

const summaryItems = [
  { name: "General", count: "8 Configured", icon: SettingsIcon, color: "bg-action-blue/10 text-action-blue" },
  { name: "Order & Inventory", count: "7 Configured", icon: Package, color: "bg-[#8B5CF6]/10 text-[#8B5CF6]" },
  { name: "Warehouse", count: "6 Configured", icon: Warehouse, color: "bg-teal/10 text-teal" },
  { name: "Notifications", count: "7 Configured", icon: Bell, color: "bg-[#F59E0B]/10 text-[#F59E0B]" },
  { name: "Security", count: "6 Configured", icon: Shield, color: "bg-[#EF4444]/10 text-[#EF4444]" },
];

const integrationsTable = [
  { name: "Shopify", status: "Connected", sync: "May 31, 2026 09:15 AM", action: "Configure" },
  { name: "Amazon", status: "Connected", sync: "May 31, 2026 08:42 AM", action: "Configure" },
  { name: "EasyPost", status: "Connected", sync: "May 31, 2026 08:30 AM", action: "Configure" },
  { name: "ShipStation", status: "Connected", sync: "May 31, 2026 08:05 AM", action: "Configure" },
  { name: "QuickBooks", status: "Connected", sync: "May 30, 2026 11:50 PM", action: "Configure" },
  { name: "Slack", status: "Disconnected", sync: "—", action: "Connect" },
];

const quickActions = [
  { label: "Manage Email Templates", icon: Mail, color: "bg-action-blue/10 text-action-blue" },
  { label: "Configure SLA Rules", icon: FileText, color: "bg-teal/10 text-teal" },
  { label: "Manage System Users", icon: Users, color: "bg-[#8B5CF6]/10 text-[#8B5CF6]" },
  { label: "View Audit Logs", icon: ScrollText, color: "bg-[#F59E0B]/10 text-[#F59E0B]" },
  { label: "Clear System Cache", icon: Trash2, color: "bg-[#EF4444]/10 text-[#EF4444]" },
  { label: "Download System Config", icon: HardDriveDownload, color: "bg-[#06B6D4]/10 text-[#06B6D4]" },
];

const automationRules = [
  { name: "Low Stock Alert", status: "Active" },
  { name: "Order Auto-Confirm", status: "Active" },
  { name: "Stale Order Reassign", status: "Active" },
  { name: "Inventory Reconciliation", status: "Active" },
  { name: "Return Auto-Approval", status: "Active" },
];

const prefTabs = ["Pricing", "Documents", "Shipping", "Returns", "Billing", "API Settings", "Advanced"];

export default function SystemSettingsPage() {
  const { toast } = useToast();
  const [prefTab, setPrefTab] = useState("Pricing");
  const [integrations, setIntegrations] = useState(integrationsTable);

  function toggleIntegration(name: string) {
    setIntegrations((cur) => cur.map((r) => {
      if (r.name !== name) return r;
      const connected = r.status !== "Connected";
      toast(`${name} ${connected ? "connected" : "configured"}`);
      return connected
        ? { ...r, status: "Connected", action: "Configure", sync: "Just now" }
        : r;
    }));
  }

  return (
    <SettingsToastCtx.Provider value={{ toast }}>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-[12px] text-text-light mb-1.5">
            <a className="hover:text-action-blue cursor-pointer transition-colors">Dashboard</a>
            <ChevronRight className="w-3 h-3" />
            <a className="hover:text-action-blue cursor-pointer transition-colors">Settings</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-body font-medium">System Settings</span>
          </nav>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold text-text-primary">System Settings</h1>
            <CheckCircle2 className="w-5 h-5 text-teal" />
          </div>
          <p className="text-[13px] text-text-body mt-1">Configure system preferences, integrations, security, and operational rules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast("Settings exported", "success")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-soft bg-white text-text-primary text-[13px] font-medium hover:bg-soft-bg transition-colors">
            <Download className="w-4 h-4" /> Export Settings
          </button>
          <button onClick={() => toast("All changes saved")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action-blue text-white text-[13px] font-medium hover:bg-[#2563EB] transition-colors shadow-sm">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* 3-column main */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) 300px" }}>
        {/* Column 1: General + Warehouse + Security */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle subtitle="Configure basic system preferences">General Settings</SectionTitle>
            <div className="divide-y divide-border-soft/60">
              <FieldRow label="Company Name"><TextInput value="FulfillMesh Co." /></FieldRow>
              <FieldRow label="Time Zone"><SelectInput value="(UTC-05:00) Eastern Time" options={["(UTC-05:00) Eastern Time", "(UTC-06:00) Central Time", "(UTC-08:00) Pacific Time", "(UTC+00:00) UTC"]} /></FieldRow>
              <FieldRow label="Date Format"><SelectInput value="MM/DD/YYYY" options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]} /></FieldRow>
              <FieldRow label="Time Format"><SelectInput value="12 Hour (AM/PM)" options={["12 Hour (AM/PM)", "24 Hour"]} /></FieldRow>
              <FieldRow label="Language"><SelectInput value="English (US)" options={["English (US)", "English (UK)", "Español", "Français"]} /></FieldRow>
              <FieldRow label="Currency"><SelectInput value="USD - US Dollar ($)" options={["USD - US Dollar ($)", "EUR - Euro (€)", "GBP - Pound (£)"]} /></FieldRow>
              <FieldRow label="Week Starts On"><SelectInput value="Monday" options={["Monday", "Sunday"]} /></FieldRow>
              <FieldRow label="Measurement System"><SelectInput value="Imperial (lb, in)" options={["Imperial (lb, in)", "Metric (kg, cm)"]} /></FieldRow>
              <FieldRow label="Enable Multi-Warehouse"><Toggle on label="Enabled" /></FieldRow>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle subtitle="Manage warehouse operations defaults">Warehouse Settings</SectionTitle>
            <div className="divide-y divide-border-soft/60">
              <FieldRow label="Default Warehouse"><SelectInput value="DFW1 - Dallas" /></FieldRow>
              <FieldRow label="Receiving Workflow"><SelectInput value="Wave Picking" /></FieldRow>
              <FieldRow label="Picking Workflow"><SelectInput value="Single Order" /></FieldRow>
              <FieldRow label="Shipping Workflow"><SelectInput value="Standard" /></FieldRow>
              <FieldRow label="Default Package Type"><SelectInput value="Box" /></FieldRow>
              <FieldRow label="Require QC Before Shipping"><Toggle on label="Enabled" /></FieldRow>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle subtitle="Manage authentication and access controls">Security Settings</SectionTitle>
            <div className="divide-y divide-border-soft/60">
              <FieldRow label="Password Policy"><SelectInput value="Strong (Default)" /></FieldRow>
              <FieldRow label="Two-Factor Authentication"><Toggle on label="Enabled" /></FieldRow>
              <FieldRow label="Session Timeout"><SelectInput value="30 minutes" /></FieldRow>
              <FieldRow label="IP Whitelist"><Toggle on={false} label="Disabled" /></FieldRow>
              <FieldRow label="Login Attempt Limit"><TextInput value="5 attempts" /></FieldRow>
              <FieldRow label="Data Encryption"><Toggle on label="Enabled" /></FieldRow>
              <FieldRow label="Audit Logging"><Toggle on label="Enabled" /></FieldRow>
            </div>
          </Card>
        </div>

        {/* Column 2: Order & Inventory + Notifications + Integrations */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle subtitle="Configure order processing and inventory rules">Order &amp; Inventory Settings</SectionTitle>
            <div className="divide-y divide-border-soft/60">
              <FieldRow label="Auto-allocate Inventory"><Toggle on label="Enabled" /></FieldRow>
              <FieldRow label="Allow Backorders"><Toggle on={false} label="Disabled" /></FieldRow>
              <FieldRow label="Backorder Handling"><SelectInput value="Ask Before Confirming" /></FieldRow>
              <FieldRow label="Low Stock Alert Threshold" hint="Minimum quantity per SKU"><TextInput value="50" /></FieldRow>
              <FieldRow label="Overstock Alert Threshold"><TextInput value="5000" /></FieldRow>
              <FieldRow label="Default Order Priority"><SelectInput value="Medium" /></FieldRow>
              <FieldRow label="Inventory Sync Frequency"><SelectInput value="Real-time" /></FieldRow>
              <FieldRow label="SKU Duplication Check"><Toggle on label="Enabled" /></FieldRow>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle subtitle="Configure alert preferences">Notification Settings</SectionTitle>
            <div className="divide-y divide-border-soft/60">
              <FieldRow label="Email Notifications"><Toggle on label="Enabled" /></FieldRow>
              <FieldRow label="SMS Notifications"><Toggle on={false} label="Disabled" /></FieldRow>
              <FieldRow label="Task Assignment Alerts"><Toggle on label="Enabled" /></FieldRow>
              <FieldRow label="Order Status Updates"><Toggle on label="Enabled" /></FieldRow>
              <FieldRow label="Inventory Alerts"><Toggle on label="Enabled" /></FieldRow>
              <FieldRow label="Exception Alerts"><Toggle on label="Enabled" /></FieldRow>
              <FieldRow label="Digest Frequency"><SelectInput value="Daily" /></FieldRow>
            </div>
          </Card>

          <Card>
            <div className="p-5 pb-3">
              <SectionTitle subtitle="Connect with third-party services">Integrations</SectionTitle>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy">
                    {["Integration", "Status", "Last Sync", "Action"].map((h) => (
                      <th key={h} className="text-left text-[11px] font-medium text-white/90 uppercase tracking-wider px-5 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {integrations.map((r, i) => (
                    <tr key={r.name} className={`border-b border-border-soft/60 last:border-b-0 ${i % 2 === 1 ? "bg-soft-bg/50" : "bg-white"}`}>
                      <td className="px-5 py-2.5 text-[12px] font-medium text-text-primary">{r.name}</td>
                      <td className="px-5 py-2.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${r.status === "Connected" ? "bg-teal/10 text-teal" : "bg-[#94A3B8]/10 text-text-light"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-[11px] text-text-muted">{r.sync}</td>
                      <td className="px-5 py-2.5"><button onClick={() => toggleIntegration(r.name)} className="text-[12px] font-medium text-action-blue hover:underline">{r.action}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Column 3: Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Settings Summary</h3>
            <div className="space-y-1">
              {summaryItems.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.name} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[13px] text-text-primary">{s.name}</span>
                    </div>
                    <span className="text-[12px] text-text-light">{s.count}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">System Health</h3>
            <div className="space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Last Backup</span>
                <span className="text-text-primary font-medium">May 31, 2026 02:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Uptime</span>
                <span className="text-teal font-medium">99.99%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Database Status</span>
                <span className="inline-flex items-center gap-1.5 text-teal font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" />Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">System Status</span>
                <span className="text-teal font-medium">All Systems Operational</span>
              </div>
            </div>
            <button onClick={() => toast("Opening system logs…", "info")} className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-medium text-action-blue border border-border-soft rounded-lg hover:bg-soft-bg transition-colors">
              <ScrollText className="w-4 h-4" /> View System Logs
            </button>
          </Card>

          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Quick Actions</h3>
            <div className="space-y-0.5">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.label} onClick={() => toast(`${a.label}…`, "info")} className="w-full flex items-center justify-between px-2 py-2 text-[13px] text-text-primary rounded-lg hover:bg-soft-bg transition-colors">
                    <span className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${a.color}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      {a.label}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-text-light -rotate-90" />
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Automation Rules</h3>
            <div className="space-y-2.5">
              {automationRules.map((r) => (
                <div key={r.name} className="flex items-center justify-between">
                  <span className="text-[13px] text-text-primary">{r.name}</span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                    <span className="text-teal">{r.status}</span>
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => toast("Opening automation rules…", "info")} className="mt-4 w-full px-3 py-2 text-[13px] font-medium text-action-blue border border-border-soft rounded-lg hover:bg-soft-bg transition-colors">Manage Automation Rules</button>
          </Card>

          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Help &amp; Resources</h3>
            <div className="space-y-2 text-[13px]">
              <button onClick={() => toast("Opening configuration guide…", "info")} className="block text-action-blue hover:underline cursor-pointer">Configuration Guide</button>
              <button onClick={() => toast("Opening API documentation…", "info")} className="block text-action-blue hover:underline cursor-pointer">API Documentation</button>
              <button onClick={() => toast("Opening support…", "info")} className="block text-action-blue hover:underline cursor-pointer">Contact Support</button>
            </div>
          </Card>
        </div>
      </div>

      {/* Additional Preferences */}
      <Card>
        <div className="px-5 pt-4 pb-0">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3">Additional Preferences</h2>
          <nav className="flex flex-wrap gap-0 border-b border-border-soft">
            {prefTabs.map((t) => (
              <button
                key={t}
                onClick={() => setPrefTab(t)}
                className={`px-4 pb-3 text-[13px] font-medium border-b-2 transition-colors ${prefTab === t ? "border-action-blue text-action-blue" : "border-transparent text-text-muted hover:text-text-primary"}`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div className="divide-y divide-border-soft/60">
            <FieldRow label="Default Markup"><TextInput value="15%" /></FieldRow>
            <FieldRow label="Tax Calculation"><SelectInput value="Automatic" /></FieldRow>
            <FieldRow label="Rounding Strategy"><SelectInput value="Nearest Cent" /></FieldRow>
          </div>
          <div className="divide-y divide-border-soft/60">
            <FieldRow label="Show Tax in Prices"><Toggle on label="Enabled" /></FieldRow>
            <FieldRow label="Volume Discounts"><Toggle on label="Enabled" /></FieldRow>
            <FieldRow label="Price Override"><Toggle on={false} label="Disabled" /></FieldRow>
          </div>
        </div>
      </Card>
    </div>
    </SettingsToastCtx.Provider>
  );
}
