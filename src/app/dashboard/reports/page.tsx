"use client";

import {
  BarChart3, Package, Truck, RotateCcw, Users, FileText,
  Download, ChevronDown, Calendar, Bell, MoreHorizontal,
  ChevronRight,
} from "lucide-react";

const reports = [
  { icon: BarChart3, title: "Sales Report", desc: "Summary of sales performance and revenue by date, product, and channel.", generated: "May 18, 2025 10:15 AM", action: "download" },
  { icon: Package, title: "Inventory Report", desc: "Current inventory levels, stock value, and product performance.", generated: "May 18, 2025 9:45 AM", action: "download" },
  { icon: Truck, title: "Shipment Report", desc: "Overview of shipments, carriers, delivery times, and costs.", generated: "May 18, 2025 9:30 AM", action: "download" },
  { icon: RotateCcw, title: "Return Report", desc: "Summary of returns, reasons, and refund amounts.", generated: "May 17, 2025 4:20 PM", action: "download" },
  { icon: Users, title: "Customer Report", desc: "Customer acquisition, retention, and lifetime value metrics.", generated: "Never", action: "generate" },
];

function Select({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-[12px] font-medium text-text-muted mb-1.5">{label}</label>
      <div className="relative">
        <select defaultValue={value} className="w-full appearance-none bg-white border border-border-soft rounded-lg px-3.5 py-2.5 pr-9 text-[13px] text-text-primary focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue">
          <option>{value}</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light pointer-events-none" />
      </div>
    </div>
  );
}

export default function ReportsPage() {
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
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-soft bg-white text-text-body text-[13px] font-medium hover:bg-soft-bg shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Calendar className="w-4 h-4 text-text-light" />
            May 12 – May 18, 2025
            <ChevronDown className="w-3.5 h-3.5 text-text-light" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg">
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
                          <button className="inline-flex items-center gap-1.5 text-[13px] font-medium text-action-blue hover:underline">
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </button>
                        ) : (
                          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-action-blue text-white text-[13px] font-medium rounded-lg hover:bg-[#0047B3]">
                            Generate
                          </button>
                        )}
                        <button className="p-1 rounded hover:bg-soft-bg text-text-light hover:text-text-primary">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
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
          <Select label="Report Type" value="Sales Report" />
          <Select label="Date Range" value="May 12 – May 18, 2025" />
          <Select label="Group By (Optional)" value="Select an option" />
          <Select label="Format" value="PDF" />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-action-blue text-white text-[13px] font-medium rounded-lg hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>
    </div>
  );
}
