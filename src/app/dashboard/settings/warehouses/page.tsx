"use client";

import { Plus, Search, ChevronDown, SlidersHorizontal, MapPin, Warehouse as WarehouseIcon, ArrowUpDown, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

type Status = "Active" | "Paused";

const warehouses: {
  name: string;
  code: string;
  location: string;
  zip: string;
  type: string;
  manager: string;
  managerEmail: string;
  capacity: number;
  isDefault: boolean;
  status: Status;
  iconBg: string;
}[] = [
  { name: "Shenzhen Warehouse", code: "SZX-001", location: "Shenzhen, China", zip: "518000", type: "Regional", manager: "Liu Wei", managerEmail: "liuwei@fm.co", capacity: 78, isDefault: false, status: "Active", iconBg: "#3B82F6" },
  { name: "Los Angeles Warehouse", code: "LAX-002", location: "Los Angeles, CA", zip: "90025, USA", type: "Regional", manager: "Sarah Johnson", managerEmail: "sarah.j@fm.co", capacity: 62, isDefault: true, status: "Active", iconBg: "#10B981" },
  { name: "Dallas Hub", code: "DAL-003", location: "Dallas, TX", zip: "75201, USA", type: "Hub", manager: "Michael Brown", managerEmail: "michael@fm.co", capacity: 45, isDefault: false, status: "Paused", iconBg: "#F59E0B" },
  { name: "Rotterdam Warehouse", code: "RTH-004", location: "Rotterdam", zip: "3011 AA, NL", type: "Regional", manager: "Emma de Vries", managerEmail: "emma.v@fm.co", capacity: 68, isDefault: false, status: "Active", iconBg: "#8B5CF6" },
];

const statusStyles: Record<Status, string> = {
  "Active": "bg-[#10B981]/10 text-[#10B981]",
  "Paused": "bg-[#F59E0B]/10 text-[#F59E0B]",
};

const statusDot: Record<Status, string> = {
  "Active": "bg-[#10B981]",
  "Paused": "bg-[#F59E0B]",
};

export default function WarehousesPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1E293B]">Warehouses</h2>
          <p className="text-[13px] text-[#64748B] mt-1">
            Manage your warehouse locations, capacity, and operating status.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-lg text-[13px] font-medium hover:bg-[#3B82F6]/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Warehouse
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mt-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search warehouses..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
          />
        </div>
        <div className="relative">
          <select className="appearance-none pl-3.5 pr-9 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20">
            <option>All Types</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
          <select className="appearance-none pl-3.5 pr-9 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20">
            <option>All Statuses</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <button className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F8FAFC]">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="mt-5 border border-[#E2E8F0] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">
                <span className="inline-flex items-center gap-1">Warehouse <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Location</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Type</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Manager</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Capacity</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Default</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Status</th>
              <th className="text-right text-[12px] font-medium text-[#64748B] px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w.code} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#EFF6FF]">
                      <WarehouseIcon className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#1E293B]">{w.name}</p>
                      <p className="text-[12px] text-[#94A3B8]">{w.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] text-[#475569]">{w.location}</p>
                      <p className="text-[12px] text-[#94A3B8]">{w.zip}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] text-[11px] font-medium rounded">
                    {w.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[13px] text-[#475569]">{w.manager}</p>
                  <p className="text-[12px] text-[#94A3B8]">{w.managerEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 w-[120px]">
                    <span className="text-[13px] font-semibold text-[#1E293B] w-8">{w.capacity}%</span>
                    <div className="flex-1 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#3B82F6]" style={{ width: `${w.capacity}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {w.isDefault ? (
                    <span className="inline-flex px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] text-[11px] font-medium rounded">Default</span>
                  ) : (
                    <span className="text-[13px] text-[#94A3B8]">&mdash;</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded ${statusStyles[w.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[w.status]}`} />
                    {w.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
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
        <p className="text-[13px] text-[#64748B]">Showing 1 to 4 of 4 warehouses</p>
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
