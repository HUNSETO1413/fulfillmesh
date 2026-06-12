"use client";

import { useState } from "react";
import {
  BarChart3, Package, Truck, RotateCcw, Users, FileText,
  Download, ChevronDown, Bell, MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";

type ReportRow = {
  icon: typeof BarChart3;
  title: string;
  desc: string;
  generated: string;
  action: "download" | "generate";
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

export default function ReportsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState("May 12 – May 18, 2025");
  const [reports, setReports] = useState(initialReports);
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [type, setType] = useState("Sales Report");
  const [groupBy, setGroupBy] = useState("Select an option");
  const [format, setFormat] = useState("PDF");

  function downloadReport(r: ReportRow) {
    exportToCsv(r.title.toLowerCase().replace(/\s+/g, "-"), [
      { report: r.title, range, generated: r.generated, status: "Ready" },
    ], [
      { key: "report", header: "Report" },
      { key: "range", header: "Date Range" },
      { key: "generated", header: "Last Generated" },
      { key: "status", header: "Status" },
    ]);
    toast(`${r.title} downloaded`);
  }

  function generateReport(title: string) {
    const stamp = nowStamp();
    setReports((prev) => prev.map((r) => r.title === title ? { ...r, action: "download", generated: stamp } : r));
    toast(`${title} generated`);
  }

  function buildCustom() {
    toast(`${type} (${format}) generated${groupBy !== "Select an option" ? `, grouped by ${groupBy}` : ""}`);
  }

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
          <button onClick={() => toast("Report settings coming soon", "info")} className="w-8 h-8 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
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
                        <span className="text-[13px] font-medium text-text-primary">{r.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-text-muted max-w-[300px]">{r.desc}</td>
                    <td className="px-5 py-3.5 text-[13px] text-text-muted whitespace-nowrap">{r.generated}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {r.action === "download" ? (
                          <button onClick={() => downloadReport(r)} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-action-blue hover:underline">
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
                                <button onClick={() => { setRowMenu(null); toast(`${r.title} scheduled weekly`); }} className="w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-soft-bg">Schedule</button>
                                <button onClick={() => { setRowMenu(null); toast(`Share link for ${r.title} copied`); }} className="w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-soft-bg">Share</button>
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
        <button onClick={buildCustom} className="inline-flex items-center gap-2 px-4 py-2.5 bg-action-blue text-white text-[13px] font-medium rounded-lg hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>
    </div>
  );
}
