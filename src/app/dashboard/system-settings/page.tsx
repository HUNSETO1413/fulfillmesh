"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Settings as SettingsIcon, Download, Save, CheckCircle2, ChevronDown, ChevronRight,
  Package, Warehouse, Bell, Shield,
  Mail, FileText, Users, ScrollText, Trash2, HardDriveDownload, Loader2, RotateCcw,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api as client, exportToCsv, exportToJson } from "@/lib/client";

/* ---------------- settings definitions ---------------- */

type SettingValue = string | boolean;
type SettingDef = {
  label: string;
  kind: "toggle" | "text" | "select";
  def: SettingValue;
  options?: string[];
  hint?: string;
};

const generalDefs: SettingDef[] = [
  { label: "Company Name", kind: "text", def: "FulfillMesh Co." },
  { label: "Time Zone", kind: "select", def: "(UTC-05:00) Eastern Time", options: ["(UTC-05:00) Eastern Time", "(UTC-06:00) Central Time", "(UTC-08:00) Pacific Time", "(UTC+00:00) UTC"] },
  { label: "Date Format", kind: "select", def: "MM/DD/YYYY", options: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] },
  { label: "Time Format", kind: "select", def: "12 Hour (AM/PM)", options: ["12 Hour (AM/PM)", "24 Hour"] },
  { label: "Language", kind: "select", def: "English (US)", options: ["English (US)", "English (UK)", "Español", "Français"] },
  { label: "Currency", kind: "select", def: "USD - US Dollar ($)", options: ["USD - US Dollar ($)", "EUR - Euro (€)", "GBP - Pound (£)"] },
  { label: "Week Starts On", kind: "select", def: "Monday", options: ["Monday", "Sunday"] },
  { label: "Measurement System", kind: "select", def: "Imperial (lb, in)", options: ["Imperial (lb, in)", "Metric (kg, cm)"] },
  { label: "Enable Multi-Warehouse", kind: "toggle", def: true },
];

const warehouseDefs: SettingDef[] = [
  { label: "Default Warehouse", kind: "select", def: "DFW1 - Dallas", options: ["DFW1 - Dallas", "ATL1 - Atlanta", "LAX1 - Los Angeles", "MIA1 - Miami"] },
  { label: "Receiving Workflow", kind: "select", def: "Wave Picking", options: ["Wave Picking", "Batch Receiving", "Direct Putaway"] },
  { label: "Picking Workflow", kind: "select", def: "Single Order", options: ["Single Order", "Batch Picking", "Zone Picking"] },
  { label: "Shipping Workflow", kind: "select", def: "Standard", options: ["Standard", "Express First", "Rate Shopping"] },
  { label: "Default Package Type", kind: "select", def: "Box", options: ["Box", "Envelope", "Pallet"] },
  { label: "Require QC Before Shipping", kind: "toggle", def: true },
];

const securityDefs: SettingDef[] = [
  { label: "Password Policy", kind: "select", def: "Strong (Default)", options: ["Strong (Default)", "Medium", "Custom"] },
  { label: "Two-Factor Authentication", kind: "toggle", def: true },
  { label: "Session Timeout", kind: "select", def: "30 minutes", options: ["15 minutes", "30 minutes", "1 hour", "4 hours"] },
  { label: "IP Whitelist", kind: "toggle", def: false },
  { label: "Login Attempt Limit", kind: "text", def: "5 attempts" },
  { label: "Data Encryption", kind: "toggle", def: true },
  { label: "Audit Logging", kind: "toggle", def: true },
];

const orderDefs: SettingDef[] = [
  { label: "Auto-allocate Inventory", kind: "toggle", def: true },
  { label: "Allow Backorders", kind: "toggle", def: false },
  { label: "Backorder Handling", kind: "select", def: "Ask Before Confirming", options: ["Ask Before Confirming", "Auto-Confirm", "Reject"] },
  { label: "Low Stock Alert Threshold", kind: "text", def: "50", hint: "Minimum quantity per SKU" },
  { label: "Overstock Alert Threshold", kind: "text", def: "5000" },
  { label: "Default Order Priority", kind: "select", def: "Medium", options: ["Low", "Medium", "High"] },
  { label: "Inventory Sync Frequency", kind: "select", def: "Real-time", options: ["Real-time", "Every 15 minutes", "Hourly"] },
  { label: "SKU Duplication Check", kind: "toggle", def: true },
];

const notifDefs: SettingDef[] = [
  { label: "Email Notifications", kind: "toggle", def: true },
  { label: "SMS Notifications", kind: "toggle", def: false },
  { label: "Task Assignment Alerts", kind: "toggle", def: true },
  { label: "Order Status Updates", kind: "toggle", def: true },
  { label: "Inventory Alerts", kind: "toggle", def: true },
  { label: "Exception Alerts", kind: "toggle", def: true },
  { label: "Digest Frequency", kind: "select", def: "Daily", options: ["Real-time", "Daily", "Weekly"] },
];

const prefDefs: Record<string, SettingDef[]> = {
  "Pricing": [
    { label: "Default Markup", kind: "text", def: "15%" },
    { label: "Tax Calculation", kind: "select", def: "Automatic", options: ["Automatic", "Manual"] },
    { label: "Rounding Strategy", kind: "select", def: "Nearest Cent", options: ["Nearest Cent", "Round Up", "Round Down"] },
    { label: "Show Tax in Prices", kind: "toggle", def: true },
    { label: "Volume Discounts", kind: "toggle", def: true },
    { label: "Price Override", kind: "toggle", def: false },
  ],
  "Documents": [
    { label: "Invoice Numbering", kind: "select", def: "Sequential", options: ["Sequential", "Date-based"] },
    { label: "Default Paper Size", kind: "select", def: "Letter", options: ["Letter", "A4"] },
    { label: "Auto-attach Packing Slip", kind: "toggle", def: true },
    { label: "Include Branding", kind: "toggle", def: true },
  ],
  "Shipping": [
    { label: "Default Carrier", kind: "select", def: "FedEx", options: ["FedEx", "UPS", "DHL", "USPS"] },
    { label: "Rate Shopping", kind: "toggle", def: true },
    { label: "Signature Required Threshold", kind: "text", def: "$500" },
    { label: "Insurance Threshold", kind: "text", def: "$1,000" },
  ],
  "Returns": [
    { label: "Auto-approve Returns", kind: "toggle", def: false },
    { label: "Return Window", kind: "select", def: "30 days", options: ["14 days", "30 days", "60 days"] },
    { label: "Restocking Fee", kind: "text", def: "10%" },
    { label: "Require Return Photos", kind: "toggle", def: true },
  ],
  "Billing": [
    { label: "Billing Cycle", kind: "select", def: "Monthly", options: ["Monthly", "Quarterly", "Annually"] },
    { label: "Auto-pay", kind: "toggle", def: true },
    { label: "Invoice Reminders", kind: "toggle", def: true },
    { label: "Consolidated Invoicing", kind: "toggle", def: false },
  ],
  "API Settings": [
    { label: "Rate Limit", kind: "text", def: "1000 req/min" },
    { label: "Webhook Retries", kind: "select", def: "5", options: ["3", "5", "10"] },
    { label: "API Version", kind: "select", def: "2026-05", options: ["2026-05", "2026-01", "2025-09"] },
    { label: "Verbose Error Responses", kind: "toggle", def: false },
  ],
  "Advanced": [
    { label: "Debug Mode", kind: "toggle", def: false },
    { label: "Beta Features", kind: "toggle", def: false },
    { label: "Data Retention", kind: "select", def: "3 years", options: ["1 year", "3 years", "7 years"] },
  ],
};

const allDefs: SettingDef[] = [
  ...generalDefs, ...warehouseDefs, ...securityDefs, ...orderDefs, ...notifDefs,
  ...Object.values(prefDefs).flat(),
];

const DEFAULTS: Record<string, SettingValue> = Object.fromEntries(allDefs.map((d) => [d.label, d.def]));

/* ---------------- components ---------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-lg border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${className}`}>{children}</div>;
}

function FieldRow({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <span className="text-[13px] text-text-body">{label}</span>
        {hint && <div className="text-[10px] text-text-light mt-0.5">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
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

type SettingsApi = { values: Record<string, SettingValue>; set: (key: string, value: SettingValue) => void };

function SettingControl({ def, api }: { def: SettingDef; api: SettingsApi }) {
  const value = api.values[def.label];
  if (def.kind === "toggle") {
    const enabled = value === true;
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => api.set(def.label, !enabled)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? "bg-action-blue" : "bg-[#CBD5E1]"}`}
          aria-label={def.label}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${enabled ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
        </button>
        <span className={`text-xs ${enabled ? "text-text-primary" : "text-text-light"}`}>{enabled ? "Enabled" : "Disabled"}</span>
      </div>
    );
  }
  if (def.kind === "select") {
    return (
      <div className="relative w-[200px]">
        <select
          value={String(value)}
          aria-label={def.label}
          onChange={(e) => api.set(def.label, e.target.value)}
          className="w-full appearance-none px-3 py-1.5 pr-8 text-[13px] border border-border-soft rounded-lg text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-action-blue/20"
        >
          {(def.options ?? [String(def.def)]).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-light pointer-events-none" />
      </div>
    );
  }
  return (
    <input
      value={String(value)}
      aria-label={def.label}
      onChange={(e) => api.set(def.label, e.target.value)}
      className="w-[200px] px-3 py-1.5 text-[13px] text-text-primary border border-border-soft rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue"
    />
  );
}

function SettingRows({ defs, api }: { defs: SettingDef[]; api: SettingsApi }) {
  return (
    <div className="divide-y divide-border-soft/60">
      {defs.map((d) => (
        <FieldRow key={d.label} label={d.label} hint={d.hint}>
          <SettingControl def={d} api={api} />
        </FieldRow>
      ))}
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
  { name: "Shopify", status: "Connected", sync: "May 31, 2026 09:15 AM" },
  { name: "Amazon", status: "Connected", sync: "May 31, 2026 08:42 AM" },
  { name: "EasyPost", status: "Connected", sync: "May 31, 2026 08:30 AM" },
  { name: "ShipStation", status: "Connected", sync: "May 31, 2026 08:05 AM" },
  { name: "QuickBooks", status: "Connected", sync: "May 30, 2026 11:50 PM" },
  { name: "Slack", status: "Disconnected", sync: "—" },
];

const quickActions = [
  { label: "Manage Email Templates", icon: Mail, color: "bg-action-blue/10 text-action-blue", done: "Email templates synced — 12 templates up to date" },
  { label: "Configure SLA Rules", icon: FileText, color: "bg-teal/10 text-teal", done: "SLA rules validated — 8 rules active, no conflicts found" },
  { label: "Manage System Users", icon: Users, color: "bg-[#8B5CF6]/10 text-[#8B5CF6]", done: "User directory refreshed — 128 accounts in sync" },
  { label: "View Audit Logs", icon: ScrollText, color: "bg-[#F59E0B]/10 text-[#F59E0B]", done: "" },
  { label: "Clear System Cache", icon: Trash2, color: "bg-[#EF4444]/10 text-[#EF4444]", done: "System cache cleared — 1.2 GB freed" },
  { label: "Download System Config", icon: HardDriveDownload, color: "bg-[#06B6D4]/10 text-[#06B6D4]", done: "System configuration downloaded" },
];

type IntegrationRow = { name: string; status: string; sync: string };
type AutomationRule = { name: string; active: boolean };

const initialAutomationRules: AutomationRule[] = [
  { name: "Low Stock Alert", active: true },
  { name: "Order Auto-Confirm", active: true },
  { name: "Stale Order Reassign", active: true },
  { name: "Inventory Reconciliation", active: true },
  { name: "Return Auto-Approval", active: true },
];

// Shape of the persisted "system" settings section.
type SystemSettings = {
  values: Record<string, SettingValue>;
  integrations: IntegrationRow[];
  automationRules: AutomationRule[];
};

const systemLogs = [
  { time: "May 31, 2026 09:15:22", level: "Info", message: "Shopify sync completed — 248 orders imported" },
  { time: "May 31, 2026 09:02:10", level: "Info", message: "Wave picking batch #4821 released to DFW1" },
  { time: "May 31, 2026 08:42:55", level: "Warning", message: "Amazon API rate limit at 85% of quota" },
  { time: "May 31, 2026 08:30:04", level: "Info", message: "EasyPost label purchase succeeded (32 labels)" },
  { time: "May 31, 2026 07:58:41", level: "Error", message: "Webhook delivery failed: https://hooks.acme.io/fm (timeout)" },
  { time: "May 31, 2026 07:58:39", level: "Warning", message: "Webhook retry scheduled (attempt 2 of 5)" },
  { time: "May 31, 2026 06:30:00", level: "Info", message: "Inventory reconciliation completed — 0 discrepancies" },
  { time: "May 31, 2026 04:12:18", level: "Info", message: "Session cleanup removed 14 expired sessions" },
  { time: "May 31, 2026 02:00:01", level: "Info", message: "Nightly backup completed (4.8 GB)" },
  { time: "May 30, 2026 11:50:12", level: "Warning", message: "QuickBooks token expires in 7 days" },
  { time: "May 30, 2026 10:22:47", level: "Error", message: "SKU import row 112 rejected: duplicate SKU 'WID-2210'" },
  { time: "May 30, 2026 09:00:33", level: "Info", message: "SLA monitor: all shipments within target windows" },
];

const LOG_LEVELS = ["All Levels", "Info", "Warning", "Error"];

const prefTabs = ["Pricing", "Documents", "Shipping", "Returns", "Billing", "API Settings", "Advanced"];

/* ---------------- page ---------------- */

export default function SystemSettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [prefTab, setPrefTab] = useState("Pricing");
  const [integrations, setIntegrations] = useState<IntegrationRow[]>(integrationsTable);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules);

  const [values, setValues] = useState<Record<string, SettingValue>>(DEFAULTS);
  const [saved, setSaved] = useState<Record<string, SettingValue>>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  const [logsOpen, setLogsOpen] = useState(false);
  const [logLevel, setLogLevel] = useState("All Levels");
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [confirmCache, setConfirmCache] = useState(false);

  const dirty = useMemo(
    () => Object.keys(DEFAULTS).some((k) => values[k] !== saved[k]),
    [values, saved],
  );

  const api: SettingsApi = {
    values,
    set: (key, value) => setValues((v) => ({ ...v, [key]: value })),
  };

  // Hydrate from the persisted "system" settings section on mount.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await client.get<Record<string, unknown>>("/api/settings");
        if (!alive) return;
        const section = (all.system ?? {}) as Partial<SystemSettings>;
        if (section.values) {
          // Merge stored values over the defaults so missing fields fall back.
          const next = { ...DEFAULTS, ...section.values };
          setValues(next);
          setSaved(next);
        }
        if (Array.isArray(section.integrations) && section.integrations.length > 0) {
          setIntegrations(section.integrations);
        }
        if (Array.isArray(section.automationRules) && section.automationRules.length > 0) {
          setAutomationRules(section.automationRules);
        }
      } catch {
        if (alive) toast("Failed to load system settings", "error");
      }
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const persistSystem = (patch: Partial<SystemSettings>) =>
    client.put("/api/settings", {
      system: { values, integrations, automationRules, ...patch },
    });

  const handleSave = () => {
    setSaving(true);
    persistSystem({ values })
      .then(() => {
        setSaved(values);
        toast("All changes saved");
      })
      .catch(() => toast("Failed to save settings", "error"))
      .finally(() => setSaving(false));
  };

  const handleDiscard = () => {
    setValues(saved);
    toast("Changes discarded", "info");
  };

  const handleExport = () => {
    exportToJson("system-settings", values);
    toast("Settings exported to system-settings.json");
  };

  const runQuickAction = (label: string) => {
    if (busyAction) return;
    if (label === "View Audit Logs") {
      router.push("/dashboard/audit-logs");
      return;
    }
    if (label === "Download System Config") {
      // Generate a real file download of the current configuration.
      exportToJson("system-config", {
        settings: values,
        integrations,
        automationRules,
        exportedAt: new Date().toISOString(),
      });
      toast("System configuration downloaded");
      return;
    }
    if (label === "Clear System Cache") {
      setConfirmCache(true);
      return;
    }
    startAction(label);
  };

  const startAction = (label: string) => {
    const action = quickActions.find((a) => a.label === label);
    if (!action) return;
    setBusyAction(label);
    setTimeout(() => {
      setBusyAction(null);
      toast(action.done);
    }, 1000);
  };

  const toggleIntegration = (name: string) => {
    const next = integrations.map((r) => {
      if (r.name !== name) return r;
      const connecting = r.status !== "Connected";
      return connecting
        ? { ...r, status: "Connected", sync: "Just now" }
        : { ...r, status: "Disconnected", sync: "—" };
    });
    const target = next.find((r) => r.name === name);
    setIntegrations(next);
    toast(`${name} ${target?.status === "Connected" ? "connected" : "disconnected"}`);
    persistSystem({ integrations: next }).catch(() => toast("Failed to update integration", "error"));
  };

  const toggleRule = (name: string) => {
    const next = automationRules.map((r) => (r.name === name ? { ...r, active: !r.active } : r));
    const target = next.find((r) => r.name === name);
    setAutomationRules(next);
    toast(`"${name}" ${target?.active ? "activated" : "paused"}`);
    persistSystem({ automationRules: next }).catch(() => toast("Failed to update rule", "error"));
  };

  const filteredLogs = logLevel === "All Levels" ? systemLogs : systemLogs.filter((l) => l.level === logLevel);

  const exportLogs = () => {
    exportToCsv("system-logs", filteredLogs, [
      { key: "time", header: "Timestamp" },
      { key: "level", header: "Level" },
      { key: "message", header: "Message" },
    ]);
    toast(`Exported ${filteredLogs.length} log entries to CSV`);
  };

  const logLevelCls = (level: string) =>
    level === "Error" ? "bg-[#EF4444]/10 text-[#EF4444]"
      : level === "Warning" ? "bg-[#F59E0B]/10 text-[#F59E0B]"
        : "bg-action-blue/10 text-action-blue";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-[12px] text-text-light mb-1.5">
            <a href="/dashboard" className="hover:text-action-blue cursor-pointer transition-colors">Dashboard</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/dashboard/settings" className="hover:text-action-blue cursor-pointer transition-colors">Settings</a>
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
          {dirty && !saving && (
            <span className="text-[12px] font-medium text-[#F59E0B]">Unsaved changes</span>
          )}
          {dirty && (
            <button onClick={handleDiscard} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-soft bg-white text-text-primary text-[13px] font-medium hover:bg-soft-bg transition-colors">
              <RotateCcw className="w-4 h-4" /> Discard changes
            </button>
          )}
          <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-soft bg-white text-text-primary text-[13px] font-medium hover:bg-soft-bg transition-colors">
            <Download className="w-4 h-4" /> Export Settings
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action-blue text-white text-[13px] font-medium hover:bg-[#2563EB] transition-colors shadow-sm disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* 3-column main */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) 300px" }}>
        {/* Column 1: General + Warehouse + Security */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle subtitle="Configure basic system preferences">General Settings</SectionTitle>
            <SettingRows defs={generalDefs} api={api} />
          </Card>

          <Card className="p-5">
            <SectionTitle subtitle="Manage warehouse operations defaults">Warehouse Settings</SectionTitle>
            <SettingRows defs={warehouseDefs} api={api} />
          </Card>

          <Card className="p-5">
            <SectionTitle subtitle="Manage authentication and access controls">Security Settings</SectionTitle>
            <SettingRows defs={securityDefs} api={api} />
          </Card>
        </div>

        {/* Column 2: Order & Inventory + Notifications + Integrations */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle subtitle="Configure order processing and inventory rules">Order &amp; Inventory Settings</SectionTitle>
            <SettingRows defs={orderDefs} api={api} />
          </Card>

          <Card className="p-5">
            <SectionTitle subtitle="Configure alert preferences">Notification Settings</SectionTitle>
            <SettingRows defs={notifDefs} api={api} />
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
                      <td className="px-5 py-2.5">
                        <button
                          onClick={() => toggleIntegration(r.name)}
                          className={`text-[12px] font-medium hover:underline ${r.status === "Connected" ? "text-[#EF4444]" : "text-action-blue"}`}
                        >
                          {r.status === "Connected" ? "Disconnect" : "Connect"}
                        </button>
                      </td>
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
            <button onClick={() => setLogsOpen(true)} className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-medium text-action-blue border border-border-soft rounded-lg hover:bg-soft-bg transition-colors">
              <ScrollText className="w-4 h-4" /> View System Logs
            </button>
          </Card>

          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Quick Actions</h3>
            <div className="space-y-0.5">
              {quickActions.map((a) => {
                const Icon = a.icon;
                const busy = busyAction === a.label;
                return (
                  <button
                    key={a.label}
                    onClick={() => runQuickAction(a.label)}
                    disabled={busyAction !== null && !busy}
                    className="w-full flex items-center justify-between px-2 py-2 text-[13px] text-text-primary rounded-lg hover:bg-soft-bg transition-colors disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${a.color}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      {a.label}
                    </span>
                    {busy
                      ? <Loader2 className="w-3.5 h-3.5 text-action-blue animate-spin" />
                      : <ChevronDown className="w-3.5 h-3.5 text-text-light -rotate-90" />}
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
                  <span className={`text-[13px] ${r.active ? "text-text-primary" : "text-text-light"}`}>{r.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[12px] font-medium ${r.active ? "text-teal" : "text-text-light"}`}>{r.active ? "Active" : "Paused"}</span>
                    <button
                      onClick={() => toggleRule(r.name)}
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${r.active ? "bg-teal" : "bg-[#CBD5E1]"}`}
                      aria-label={`Toggle ${r.name}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm ${r.active ? "translate-x-[14px]" : "translate-x-[2px]"}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Help &amp; Resources</h3>
            <div className="space-y-2 text-[13px]">
              <Link href="/resources/guides" className="block text-action-blue hover:underline cursor-pointer">Configuration Guide</Link>
              <Link href="/resources/api-documentation" className="block text-action-blue hover:underline cursor-pointer">API Documentation</Link>
              <Link href="/contact" className="block text-action-blue hover:underline cursor-pointer">Contact Support</Link>
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
          <SettingRows defs={(prefDefs[prefTab] ?? []).filter((_, i) => i % 2 === 0)} api={api} />
          <SettingRows defs={(prefDefs[prefTab] ?? []).filter((_, i) => i % 2 === 1)} api={api} />
        </div>
      </Card>

      {/* System Logs Modal */}
      <Modal
        open={logsOpen}
        onClose={() => setLogsOpen(false)}
        title="System Logs"
        description="Recent system activity, warnings, and errors."
        size="lg"
        footer={
          <>
            <SecondaryButton onClick={exportLogs} className="inline-flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export CSV
            </SecondaryButton>
            <PrimaryButton onClick={() => setLogsOpen(false)}>Close</PrimaryButton>
          </>
        }
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] text-text-muted">{filteredLogs.length} entries</span>
          <div className="relative">
            <select
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-[12px] border border-border-soft rounded-lg text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-action-blue/20"
            >
              {LOG_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-light pointer-events-none" />
          </div>
        </div>
        <div className="border border-border-soft rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-soft-bg border-b border-border-soft">
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">Timestamp</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-2.5">Level</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-2.5">Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((l, i) => (
                <tr key={i} className="border-b border-border-soft last:border-b-0">
                  <td className="px-4 py-2 text-[12px] text-text-muted font-mono whitespace-nowrap">{l.time}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded ${logLevelCls(l.level)}`}>{l.level}</span>
                  </td>
                  <td className="px-4 py-2 text-[12px] text-text-body">{l.message}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-[12px] text-text-light">No log entries for this level.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Clear Cache Confirm */}
      <ConfirmDialog
        open={confirmCache}
        onClose={() => setConfirmCache(false)}
        onConfirm={() => {
          setConfirmCache(false);
          startAction("Clear System Cache");
        }}
        title="Clear system cache"
        message="Clearing the system cache may temporarily slow down dashboards and reports while caches rebuild. Continue?"
        confirmLabel="Clear Cache"
        destructive
      />
    </div>
  );
}
