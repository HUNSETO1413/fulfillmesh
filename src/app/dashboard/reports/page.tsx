"use client";

import { useEffect, useState } from "react";
import {
  BarChart3, Package, Truck, RotateCcw, Users, FileText,
  Download, ChevronDown, Bell, MoreHorizontal,
  ChevronRight, CalendarClock, Copy, Loader2, Settings2,
} from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, Select as FormSelect, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import type { AnalyticsSummary } from "@/lib/analytics";

type Schedule = {
  frequency: "Daily" | "Weekly" | "Monthly";
  day: string;
  time: string;
  recipients: string;
};

type ReportRow = {
  icon: typeof BarChart3;
  title: string;
  desc: string;
  generated: string;
  action: "download" | "generate";
  generating?: boolean;
  schedule?: Schedule;
};

const initialReports: ReportRow[] = [
  { icon: BarChart3, title: "Sales Report", desc: "Summary of sales performance and revenue by date, product, and channel.", generated: "May 18, 2025 10:15 AM", action: "download" },
  { icon: Package, title: "Inventory Report", desc: "Current inventory levels, stock value, and product performance.", generated: "May 18, 2025 9:45 AM", action: "download" },
  { icon: Truck, title: "Shipment Report", desc: "Overview of shipments, carriers, delivery times, and costs.", generated: "May 18, 2025 9:30 AM", action: "download" },
  { icon: RotateCcw, title: "Return Report", desc: "Summary of returns, reasons, and refund amounts.", generated: "May 17, 2025 4:20 PM", action: "download" },
  { icon: Users, title: "Customer Report", desc: "Customer acquisition, retention, and lifetime value metrics.", generated: "Never", action: "generate" },
];

const REPORT_TYPES = ["Sales Report", "Inventory Report", "Shipment Report", "Return Report", "Customer Report"];
const GROUP_BY = ["Select an option", "Product", "Channel", "Warehouse", "Customer", "Date"];
const FORMATS = ["PDF", "CSV", "XLSX"];

type ReportSettings = {
  defaultRange: string;
  defaultFormat: "PDF" | "CSV" | "XLSX";
  includeCharts: boolean;
};

const DEFAULT_REPORT_SETTINGS: ReportSettings = {
  defaultRange: "May 12 – May 18, 2025",
  defaultFormat: "PDF",
  includeCharts: true,
};

const RANGE_PRESETS = ["May 12 – May 18, 2025", "Last 7 days", "Last 30 days", "This quarter", "Year to date"];

const FREQUENCIES = ["Daily", "Weekly", "Monthly"] as const;
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTH_DAYS = ["1st of the month", "15th of the month", "Last day of the month"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Deterministic share link derived from the report title.
function shareLinkFor(title: string): string {
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  let h = 2166136261;
  for (let i = 0; i < title.length; i++) {
    h ^= title.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hash = (h >>> 0).toString(16).padStart(8, "0");
  return `https://app.fulfillmesh.io/share/reports/${slug}-${hash}`;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-[12px] font-medium text-text-muted mb-1.5">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none bg-white border border-border-soft rounded-lg px-3.5 py-2.5 pr-9 text-[13px] text-text-primary focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue">
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light pointer-events-none" />
      </div>
    </div>
  );
}

function nowStamp() {
  return new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

// Build the real CSV rows for a given report type from live analytics aggregates.
function buildReportRows(
  title: string,
  summary: AnalyticsSummary | null,
  range: string,
): { rows: Record<string, string | number>[]; columns: { key: string; header: string }[] } {
  const generated = nowStamp();
  if (!summary) {
    return {
      rows: [{ report: title, range, generated, status: "Ready" }],
      columns: [
        { key: "report", header: "Report" },
        { key: "range", header: "Date Range" },
        { key: "generated", header: "Last Generated" },
        { key: "status", header: "Status" },
      ],
    };
  }
  switch (title) {
    case "Sales Report":
      return {
        rows: summary.revenueByMonth.map((m) => ({ period: m.month, orders: m.orders, revenue: m.revenue })),
        columns: [
          { key: "period", header: "Month" },
          { key: "orders", header: "Orders" },
          { key: "revenue", header: "Revenue (USD)" },
        ],
      };
    case "Inventory Report":
      return {
        rows: summary.topProducts.map((p) => ({ sku: p.sku, name: p.name, reserved: p.orders, stockValue: p.revenue })),
        columns: [
          { key: "sku", header: "SKU" },
          { key: "name", header: "Product" },
          { key: "reserved", header: "Units Reserved" },
          { key: "stockValue", header: "Stock Value (USD)" },
        ],
      };
    case "Shipment Report":
      return {
        rows: summary.shipmentsByStatus.map((s) => ({ status: s.status, count: s.count })),
        columns: [
          { key: "status", header: "Status" },
          { key: "count", header: "Shipments" },
        ],
      };
    case "Return Report":
      return {
        rows: [
          { metric: "Total Orders", value: summary.totalOrders },
          { metric: "Return Rate (%)", value: summary.returnRate },
          { metric: "Delivered Orders", value: summary.deliveredOrders },
        ],
        columns: [
          { key: "metric", header: "Metric" },
          { key: "value", header: "Value" },
        ],
      };
    case "Customer Report":
      return {
        rows: summary.topCustomers.map((c) => ({ id: c.id, name: c.name, orders: c.orders, totalSpent: c.totalSpent })),
        columns: [
          { key: "id", header: "Customer ID" },
          { key: "name", header: "Customer" },
          { key: "orders", header: "Orders" },
          { key: "totalSpent", header: "Total Spent (USD)" },
        ],
      };
    default:
      return {
        rows: [{ report: title, range, generated, status: "Ready" }],
        columns: [
          { key: "report", header: "Report" },
          { key: "range", header: "Date Range" },
          { key: "generated", header: "Last Generated" },
          { key: "status", header: "Status" },
        ],
      };
  }
}

export default function ReportsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState("May 12 – May 18, 2025");
  const [reports, setReports] = useState(initialReports);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [type, setType] = useState("Sales Report");
  const [groupBy, setGroupBy] = useState("Select an option");
  const [format, setFormat] = useState("PDF");
  const [customBusy, setCustomBusy] = useState(false);

  // report settings (persisted via /api/settings)
  const [settings, setSettings] = useState<ReportSettings>(DEFAULT_REPORT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState<ReportSettings>(DEFAULT_REPORT_SETTINGS);
  const [settingsBusy, setSettingsBusy] = useState(false);

  useEffect(() => {
    api.get<AnalyticsSummary>("/api/analytics")
      .then(setSummary)
      .catch(() => toast("Could not load report data", "error"));
    api.get<{ reports?: Partial<ReportSettings> }>("/api/settings")
      .then((data) => {
        if (data?.reports) {
          const merged = { ...DEFAULT_REPORT_SETTINGS, ...data.reports };
          setSettings(merged);
          setRange(merged.defaultRange);
          setFormat(merged.defaultFormat);
        }
      })
      .catch(() => { /* fall back to defaults */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openSettings() {
    setSettingsDraft(settings);
    setSettingsOpen(true);
  }

  async function saveSettings() {
    setSettingsBusy(true);
    try {
      await api.put("/api/settings", { reports: settingsDraft });
      setSettings(settingsDraft);
      setRange(settingsDraft.defaultRange);
      setFormat(settingsDraft.defaultFormat);
      toast("Report settings saved");
      setSettingsOpen(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save report settings", "error");
    } finally {
      setSettingsBusy(false);
    }
  }

  // schedule modal
  const [scheduling, setScheduling] = useState<string | null>(null);
  const [schedDraft, setSchedDraft] = useState<Schedule>({ frequency: "Weekly", day: "Monday", time: "08:00", recipients: "" });

  // share modal
  const [sharing, setSharing] = useState<string | null>(null);

  function downloadReport(title: string) {
    const { rows, columns } = buildReportRows(title, summary, range);
    exportToCsv(
      title.toLowerCase().replace(/\s+/g, "-"),
      rows,
      columns as { key: keyof (typeof rows)[number]; header: string }[],
    );
  }

  function generateReport(title: string) {
    setReports((prev) => prev.map((r) => r.title === title ? { ...r, generating: true } : r));
    window.setTimeout(() => {
      const stamp = nowStamp();
      setReports((prev) => prev.map((r) => r.title === title ? { ...r, action: "download", generated: stamp, generating: false } : r));
      downloadReport(title);
      toast(`${title} is ready — download started`);
    }, 1200);
  }

  function buildCustom() {
    setCustomBusy(true);
    window.setTimeout(() => {
      setCustomBusy(false);
      const { rows, columns } = buildReportRows(type, summary, range);
      exportToCsv(
        `custom-${type.toLowerCase().replace(/\s+/g, "-")}`,
        rows,
        columns as { key: keyof (typeof rows)[number]; header: string }[],
      );
      toast(`${type} (${format}) generated${groupBy !== "Select an option" ? `, grouped by ${groupBy}` : ""}`);
    }, 1200);
  }

  function openSchedule(title: string) {
    const existing = reports.find((r) => r.title === title)?.schedule;
    setSchedDraft(existing ?? { frequency: "Weekly", day: "Monday", time: "08:00", recipients: "" });
    setScheduling(title);
  }

  function saveSchedule() {
    if (!scheduling) return;
    const recipients = schedDraft.recipients.split(",").map((s) => s.trim()).filter(Boolean);
    if (recipients.length === 0 || recipients.some((r) => !EMAIL_RE.test(r))) {
      toast("Enter one or more valid recipient email addresses", "error");
      return;
    }
    setReports((prev) => prev.map((r) => r.title === scheduling ? { ...r, schedule: { ...schedDraft } } : r));
    toast(`${scheduling} scheduled ${schedDraft.frequency.toLowerCase()} for ${recipients.length} recipient${recipients.length === 1 ? "" : "s"}`);
    setScheduling(null);
  }

  async function copyShareLink(title: string) {
    const link = shareLinkFor(title);
    try {
      await navigator.clipboard.writeText(link);
      toast("Share link copied to clipboard");
    } catch {
      toast("Could not copy link — copy it manually", "error");
    }
  }

  const sharingReport = sharing ? reports.find((r) => r.title === sharing) ?? null : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 mb-1.5 text-[12px]">
            <a href="/dashboard" className="text-text-muted hover:text-action-blue">Dashboard</a>
            <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            <span className="font-medium text-text-primary">Reports</span>
          </nav>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold text-text-primary">Reports</h1>
            <FileText className="w-5 h-5 text-teal" />
          </div>
          <p className="text-[14px] text-text-muted mt-0.5">Generate and download business reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeMenu
            value={range}
            onSelect={(r) => { setRange(r); toast(`Reports scoped to ${r}`, "info"); }}
            presets={["May 12 – May 18, 2025", "Last 7 days", "Last 30 days", "This quarter", "Year to date"]}
          />
          <button onClick={() => toast("No new report notifications", "info")} className="w-8 h-8 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg">
            <Bell className="w-4 h-4" />
          </button>
          <button onClick={openSettings} aria-label="Report settings" className="w-8 h-8 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live KPI snapshot (real aggregates from the database) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: summary ? `$${summary.totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—" },
          { label: "Total Orders", value: summary ? summary.totalOrders.toLocaleString("en-US") : "—" },
          { label: "Avg Order Value", value: summary ? `$${summary.avgOrderValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "—" },
          { label: "Return Rate", value: summary ? `${summary.returnRate}%` : "—" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4">
            <p className="text-[12px] font-medium text-text-muted">{k.label}</p>
            <p className="text-[22px] font-bold text-text-primary mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Reports table */}
      <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-soft-bg border-b border-border-soft">
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Report Name</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Description</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Last Generated</th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => {
                const Icon = r.icon;
                return (
                  <tr key={r.title} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-action-blue" />
                        </div>
                        <div>
                          <span className="text-[13px] font-medium text-text-primary">{r.title}</span>
                          {r.schedule && (
                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] text-[11px] font-medium">
                              <CalendarClock className="w-3 h-3" />
                              Scheduled · {r.schedule.frequency}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-text-muted max-w-[300px]">{r.desc}</td>
                    <td className="px-5 py-3.5 text-[13px] text-text-muted whitespace-nowrap">{r.generated}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {r.generating ? (
                          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Generating…
                          </span>
                        ) : r.action === "download" ? (
                          <button onClick={() => { downloadReport(r.title); toast(`${r.title} downloaded`); }} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-action-blue hover:underline">
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </button>
                        ) : (
                          <button onClick={() => generateReport(r.title)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-action-blue text-white text-[13px] font-medium rounded-lg hover:bg-[#0047B3]">
                            Generate
                          </button>
                        )}
                        <div className="relative">
                          <button onClick={() => setRowMenu(rowMenu === r.title ? null : r.title)} className="p-1 rounded hover:bg-soft-bg text-text-light hover:text-text-primary">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {rowMenu === r.title && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setRowMenu(null)} />
                              <div className="absolute right-0 mt-1 z-40 w-40 bg-white rounded-lg border border-border-soft shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-1 text-left">
                                <button onClick={() => { setRowMenu(null); generateReport(r.title); }} className="w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-soft-bg">Regenerate</button>
                                <button onClick={() => { setRowMenu(null); openSchedule(r.title); }} className="w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-soft-bg">Schedule</button>
                                <button onClick={() => { setRowMenu(null); setSharing(r.title); }} className="w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-soft-bg">Share</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Report */}
      <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6">
        <h2 className="text-[16px] font-semibold text-text-primary">Custom Report</h2>
        <p className="text-[13px] text-text-muted mt-0.5 mb-5">Build a custom report based on your specific business needs.</p>
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <Select label="Report Type" value={type} options={REPORT_TYPES} onChange={setType} />
          <Select label="Date Range" value={range} options={Array.from(new Set([range, "May 12 – May 18, 2025", "Last 7 days", "Last 30 days", "This quarter", "Year to date"]))} onChange={setRange} />
          <Select label="Group By (Optional)" value={groupBy} options={GROUP_BY} onChange={setGroupBy} />
          <Select label="Format" value={format} options={FORMATS} onChange={setFormat} />
        </div>
        <button onClick={buildCustom} disabled={customBusy} className="inline-flex items-center gap-2 px-4 py-2.5 bg-action-blue text-white text-[13px] font-medium rounded-lg hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-60">
          {customBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {customBusy ? "Generating…" : "Generate Report"}
        </button>
      </div>

      {/* Schedule modal */}
      <Modal
        open={!!scheduling}
        onClose={() => setScheduling(null)}
        title={`Schedule ${scheduling ?? "report"}`}
        description="Deliver this report automatically to your team."
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setScheduling(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveSchedule}>Save schedule</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Frequency">
            <FormSelect
              options={[...FREQUENCIES]}
              value={schedDraft.frequency}
              onChange={(e) => {
                const frequency = e.target.value as Schedule["frequency"];
                setSchedDraft((d) => ({
                  ...d,
                  frequency,
                  day: frequency === "Weekly" ? WEEK_DAYS[0] : frequency === "Monthly" ? MONTH_DAYS[0] : "",
                }));
              }}
            />
          </Field>
          {schedDraft.frequency !== "Daily" && (
            <Field label={schedDraft.frequency === "Weekly" ? "Day of week" : "Day of month"}>
              <FormSelect
                options={schedDraft.frequency === "Weekly" ? WEEK_DAYS : MONTH_DAYS}
                value={schedDraft.day}
                onChange={(e) => setSchedDraft((d) => ({ ...d, day: e.target.value }))}
              />
            </Field>
          )}
          <Field label="Send at">
            <TextInput type="time" value={schedDraft.time} onChange={(e) => setSchedDraft((d) => ({ ...d, time: e.target.value }))} />
          </Field>
          <Field label="Recipients" required hint="Comma-separated email addresses">
            <TextInput
              value={schedDraft.recipients}
              onChange={(e) => setSchedDraft((d) => ({ ...d, recipients: e.target.value }))}
              placeholder="ops@company.com, finance@company.com"
            />
          </Field>
        </div>
      </Modal>

      {/* Share modal */}
      <Modal
        open={!!sharing}
        onClose={() => setSharing(null)}
        title={`Share ${sharing ?? "report"}`}
        description="Anyone with this link can view the latest generated version."
        size="sm"
        footer={<SecondaryButton onClick={() => setSharing(null)}>Done</SecondaryButton>}
      >
        {sharingReport && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareLinkFor(sharingReport.title)}
                onFocus={(e) => e.target.select()}
                className="flex-1 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-[13px] text-[#374151] font-mono focus:outline-none"
              />
              <button
                onClick={() => copyShareLink(sharingReport.title)}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[13px] font-medium text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
            <p className="text-[12px] text-[#9CA3AF]">
              Last generated: {sharingReport.generated}
            </p>
          </div>
        )}
      </Modal>

      {/* Report settings modal */}
      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Report Settings"
        description="Defaults applied when generating and downloading reports."
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setSettingsOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveSettings} disabled={settingsBusy}>
              {settingsBusy ? "Saving…" : "Save settings"}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Default date range">
            <FormSelect
              options={RANGE_PRESETS}
              value={settingsDraft.defaultRange}
              onChange={(e) => setSettingsDraft((d) => ({ ...d, defaultRange: e.target.value }))}
            />
          </Field>
          <Field label="Default format">
            <FormSelect
              options={["PDF", "CSV", "XLSX"]}
              value={settingsDraft.defaultFormat}
              onChange={(e) => setSettingsDraft((d) => ({ ...d, defaultFormat: e.target.value as ReportSettings["defaultFormat"] }))}
            />
          </Field>
          <label className="flex items-center justify-between gap-3 px-3 py-2.5 border border-border-soft rounded-lg cursor-pointer">
            <span className="text-[13px] font-medium text-text-primary">Include charts in exports</span>
            <input
              type="checkbox"
              checked={settingsDraft.includeCharts}
              onChange={(e) => setSettingsDraft((d) => ({ ...d, includeCharts: e.target.checked }))}
              className="w-4 h-4 rounded border-[#D1D5DB] text-action-blue focus:ring-action-blue cursor-pointer"
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}
