"use client";

import { Plus, CheckCircle2, AlertCircle, XCircle, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

type Conn = "Connected" | "Needs Attention" | "Disabled";

const carriers: {
  name: string;
  service: string;
  conn: Conn;
  regions: string;
  defaultStatus: string;
  tracking: boolean;
}[] = [
  { name: "FedEx", service: "Express, Ground", conn: "Connected", regions: "240+ countries", defaultStatus: "Active", tracking: true },
  { name: "UPS", service: "Express, Ground", conn: "Connected", regions: "220+ countries", defaultStatus: "Active", tracking: true },
  { name: "DHL", service: "Express", conn: "Connected", regions: "220+ countries", defaultStatus: "Active", tracking: true },
  { name: "USPS", service: "Ground, Priority", conn: "Connected", regions: "USA", defaultStatus: "Active", tracking: true },
  { name: "YunExpress", service: "Express, Standard", conn: "Needs Attention", regions: "200+ countries", defaultStatus: "Inactive", tracking: true },
  { name: "4PX", service: "Express, Economy", conn: "Disabled", regions: "150+ countries", defaultStatus: "Inactive", tracking: false },
];

const connConfig: Record<Conn, { cls: string; Icon: typeof CheckCircle2 }> = {
  "Connected": { cls: "bg-[#10B981] text-white", Icon: CheckCircle2 },
  "Needs Attention": { cls: "bg-[#F59E0B] text-white", Icon: AlertCircle },
  "Disabled": { cls: "bg-[#94A3B8] text-white", Icon: XCircle },
};

function ConnBadge({ conn }: { conn: Conn }) {
  const { cls, Icon } = connConfig[conn];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md ${cls}`}>
      <Icon className="w-3 h-3" />
      {conn}
    </span>
  );
}

function ToggleSwitch({ enabled }: { enabled: boolean }) {
  return (
    <button
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        enabled ? "bg-[#10B981]" : "bg-[#E2E8F0]"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export default function CarriersPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1E293B]">Carrier Settings</h2>
          <p className="text-[13px] text-[#64748B] mt-1">
            Manage your carriers, API connections, services, and regions.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-lg text-[13px] font-medium hover:bg-[#3B82F6]/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Carrier
        </button>
      </div>

      {/* Table */}
      <div className="mt-5 border border-[#E2E8F0] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Carrier</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Service Type</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">API Type</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Regions</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Default Status</th>
              <th className="text-center text-[12px] font-medium text-[#64748B] px-4 py-3">Tracking Sync</th>
              <th className="text-right text-[12px] font-medium text-[#64748B] px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {carriers.map((c) => (
              <tr key={c.name} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]/50 transition-colors">
                <td className="px-4 py-3.5 text-[13px] font-medium text-[#1E293B]">{c.name}</td>
                <td className="px-4 py-3.5 text-[13px] text-[#475569]">{c.service}</td>
                <td className="px-4 py-3.5"><ConnBadge conn={c.conn} /></td>
                <td className="px-4 py-3.5 text-[13px] text-[#475569]">{c.regions}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded ${
                    c.defaultStatus === "Active"
                      ? "bg-[#3B82F6]/10 text-[#3B82F6]"
                      : "bg-[#94A3B8]/10 text-[#94A3B8]"
                  }`}>
                    {c.defaultStatus}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <ToggleSwitch enabled={c.tracking} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-[13px] text-[#64748B]">Showing 1 to 6 of 6 entries</p>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 border border-[#E2E8F0] rounded-md text-[13px] text-[#94A3B8] hover:bg-[#F8FAFC]">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button className="w-8 h-8 rounded-md bg-[#3B82F6] text-white text-[13px] font-medium">1</button>
          <button className="flex items-center gap-1 px-3 py-1.5 border border-[#E2E8F0] rounded-md text-[13px] text-[#64748B] hover:bg-[#F8FAFC]">
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
