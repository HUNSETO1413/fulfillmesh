"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Plus, Search, ChevronDown, SlidersHorizontal, MapPin, Warehouse as WarehouseIcon, ArrowUpDown, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";

type Status = "Active" | "Paused";

type Warehouse = {
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
};

const initialWarehouses: Warehouse[] = [
  { name: "Shenzhen Warehouse", code: "SZX-001", location: "Shenzhen, China", zip: "518000", type: "Regional", manager: "Liu Wei", managerEmail: "liuwei@fm.co", capacity: 78, isDefault: false, status: "Active" },
  { name: "Los Angeles Warehouse", code: "LAX-002", location: "Los Angeles, CA", zip: "90025, USA", type: "Regional", manager: "Sarah Johnson", managerEmail: "sarah.j@fm.co", capacity: 62, isDefault: true, status: "Active" },
  { name: "Dallas Hub", code: "DAL-003", location: "Dallas, TX", zip: "75201, USA", type: "Hub", manager: "Michael Brown", managerEmail: "michael@fm.co", capacity: 45, isDefault: false, status: "Paused" },
  { name: "Rotterdam Warehouse", code: "RTH-004", location: "Rotterdam", zip: "3011 AA, NL", type: "Regional", manager: "Emma de Vries", managerEmail: "emma.v@fm.co", capacity: 68, isDefault: false, status: "Active" },
];

const statusStyles: Record<Status, string> = {
  "Active": "bg-[#10B981]/10 text-[#10B981]",
  "Paused": "bg-[#F59E0B]/10 text-[#F59E0B]",
};

const statusDot: Record<Status, string> = {
  "Active": "bg-[#10B981]",
  "Paused": "bg-[#F59E0B]",
};

const emptyDraft = { name: "", code: "", location: "", zip: "", type: "Regional", manager: "", managerEmail: "", capacity: "0" };

export default function WarehousesPage() {
  const { toast } = useToast();
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortAsc, setSortAsc] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Warehouse | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuFor) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuFor(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuFor]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = warehouses.filter((w) => {
      const matchesQ = !q || w.name.toLowerCase().includes(q) || w.code.toLowerCase().includes(q) || w.location.toLowerCase().includes(q);
      const matchesType = typeFilter === "All Types" || w.type === typeFilter;
      const matchesStatus = statusFilter === "All Statuses" || w.status === statusFilter;
      return matchesQ && matchesType && matchesStatus;
    });
    return [...list].sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  }, [warehouses, query, typeFilter, statusFilter, sortAsc]);

  const toggleStatus = (code: string) => {
    setWarehouses((ws) => ws.map((w) => (w.code === code ? { ...w, status: w.status === "Active" ? "Paused" : "Active" } : w)));
    setMenuFor(null);
    toast("Warehouse status updated");
  };

  const setDefault = (code: string) => {
    setWarehouses((ws) => ws.map((w) => ({ ...w, isDefault: w.code === code })));
    setMenuFor(null);
    toast("Default warehouse updated");
  };

  const handleAdd = () => {
    if (!draft.name.trim() || !draft.code.trim()) {
      toast("Name and code are required", "error");
      return;
    }
    setWarehouses((ws) => [
      ...ws,
      {
        name: draft.name.trim(),
        code: draft.code.trim(),
        location: draft.location.trim() || "—",
        zip: draft.zip.trim() || "—",
        type: draft.type,
        manager: draft.manager.trim() || "—",
        managerEmail: draft.managerEmail.trim() || "—",
        capacity: Math.max(0, Math.min(100, Number(draft.capacity) || 0)),
        isDefault: false,
        status: "Active",
      },
    ]);
    setAddOpen(false);
    setDraft(emptyDraft);
    toast(`${draft.name.trim()} added`);
  };

  const handleRemove = () => {
    if (!removing) return;
    setWarehouses((ws) => ws.filter((w) => w.code !== removing.code));
    toast(`${removing.name} removed`);
    setRemoving(null);
  };

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
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-lg text-[13px] font-medium hover:bg-[#3B82F6]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Warehouse
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mt-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search warehouses..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none pl-3.5 pr-9 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
          >
            <option>All Types</option>
            <option>Regional</option>
            <option>Hub</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3.5 pr-9 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Paused</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <button
          onClick={() => {
            setQuery("");
            setTypeFilter("All Types");
            setStatusFilter("All Statuses");
            toast("Filters cleared", "info");
          }}
          className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
          aria-label="Reset filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="mt-5 border border-[#E2E8F0] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">
                <button
                  onClick={() => setSortAsc((s) => !s)}
                  className="inline-flex items-center gap-1 hover:text-[#1E293B]"
                >
                  Warehouse <ArrowUpDown className="w-3 h-3" />
                </button>
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-[#94A3B8]">
                  No warehouses match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((w) => (
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
                    <div className="relative inline-block" ref={menuFor === w.code ? menuRef : undefined}>
                      <button
                        onClick={() => setMenuFor(menuFor === w.code ? null : w.code)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuFor === w.code && (
                        <div className="absolute right-0 top-9 z-20 w-44 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 text-left">
                          <button
                            onClick={() => toggleStatus(w.code)}
                            className="block w-full text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]"
                          >
                            {w.status === "Active" ? "Pause warehouse" : "Activate warehouse"}
                          </button>
                          {!w.isDefault && (
                            <button
                              onClick={() => setDefault(w.code)}
                              className="block w-full text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]"
                            >
                              Set as default
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setMenuFor(null);
                              setRemoving(w);
                            }}
                            className="block w-full text-left px-3 py-2 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2]"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-[13px] text-[#64748B]">Showing 1 to {filtered.length} of {filtered.length} warehouses</p>
        <div className="flex items-center gap-2">
          <button disabled className="flex items-center gap-1 px-3 py-1.5 border border-[#E2E8F0] rounded-md text-[13px] text-[#94A3B8] cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button className="w-8 h-8 rounded-md bg-[#3B82F6] text-white text-[13px] font-medium">1</button>
          <button disabled className="flex items-center gap-1 px-3 py-1.5 border border-[#E2E8F0] rounded-md text-[13px] text-[#94A3B8] cursor-not-allowed">
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Warehouse Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Warehouse"
        description="Register a new fulfillment location."
        size="lg"
        footer={
          <>
            <SecondaryButton onClick={() => setAddOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleAdd}>Add Warehouse</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" required>
            <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Singapore Warehouse" />
          </Field>
          <Field label="Code" required>
            <TextInput value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} placeholder="SIN-005" />
          </Field>
          <Field label="Location">
            <TextInput value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="Singapore" />
          </Field>
          <Field label="ZIP / Postal">
            <TextInput value={draft.zip} onChange={(e) => setDraft({ ...draft, zip: e.target.value })} placeholder="486035, SG" />
          </Field>
          <Field label="Type">
            <Select options={["Regional", "Hub"]} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} />
          </Field>
          <Field label="Capacity (%)">
            <NumberInput value={draft.capacity} onChange={(e) => setDraft({ ...draft, capacity: e.target.value })} min="0" max="100" />
          </Field>
          <Field label="Manager">
            <TextInput value={draft.manager} onChange={(e) => setDraft({ ...draft, manager: e.target.value })} placeholder="Jane Tan" />
          </Field>
          <Field label="Manager email">
            <TextInput type="email" value={draft.managerEmail} onChange={(e) => setDraft({ ...draft, managerEmail: e.target.value })} placeholder="jane@fm.co" />
          </Field>
        </div>
      </Modal>

      {/* Remove Confirm */}
      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={handleRemove}
        title="Remove warehouse"
        message={`Remove "${removing?.name ?? ""}"? Inventory at this location must be transferred first.`}
        confirmLabel="Remove"
        destructive
      />
    </div>
  );
}
