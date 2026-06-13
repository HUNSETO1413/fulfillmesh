"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Plus, Search, ChevronDown, SlidersHorizontal, MapPin, Warehouse as WarehouseIcon, ArrowUpDown, MoreVertical } from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

type Status = "Active" | "Paused";

type Warehouse = {
  id?: string;
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

type ApiWarehouse = {
  id: string;
  name: string;
  code: string;
  location: string;
  city?: string;
  country?: string;
  type: string;
  manager: string;
  capacity: number;
  isDefault: boolean;
  status: Status;
};

const mapApiWarehouse = (w: ApiWarehouse): Warehouse => ({
  id: w.id,
  name: w.name,
  code: w.code,
  location: w.location,
  zip: "",
  type: w.type,
  manager: w.manager,
  managerEmail: "",
  capacity: w.capacity,
  isDefault: w.isDefault,
  status: w.status,
});

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
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortAsc, setSortAsc] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [draftErrors, setDraftErrors] = useState<{ name?: string; code?: string; zip?: string; capacity?: string }>({});

  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Warehouse | null>(null);
  const [pausingDefault, setPausingDefault] = useState<Warehouse | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuFor) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuFor(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuFor]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get<{ data: ApiWarehouse[]; total: number }>("/api/warehouses");
        if (!alive) return;
        setWarehouses(res.data.map(mapApiWarehouse));
      } catch {
        if (alive) toast("Failed to load warehouses", "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    const target = warehouses.find((w) => w.code === code);
    if (!target) return;
    const nextStatus: Status = target.status === "Active" ? "Paused" : "Active";
    setWarehouses((ws) => ws.map((w) => (w.code === code ? { ...w, status: nextStatus } : w)));
    toast("Warehouse status updated");
    if (target.id) {
      api.put(`/api/warehouses/${target.id}`, { status: nextStatus }).catch(() => {
        setWarehouses((ws) => ws.map((w) => (w.code === code ? { ...w, status: target.status } : w)));
        toast("Failed to update status", "error");
      });
    }
  };

  const requestToggleStatus = (w: Warehouse) => {
    setMenuFor(null);
    if (w.isDefault && w.status === "Active") {
      // Pausing the default warehouse is disruptive — confirm first.
      setPausingDefault(w);
      return;
    }
    toggleStatus(w.code);
  };

  const requestRemove = (w: Warehouse) => {
    setMenuFor(null);
    if (w.isDefault) {
      toast("This is your default warehouse. Set another warehouse as default before removing it.", "error");
      return;
    }
    setRemoving(w);
  };

  const setDefault = (code: string) => {
    const target = warehouses.find((w) => w.code === code);
    const prevDefault = warehouses.find((w) => w.isDefault);
    setWarehouses((ws) => ws.map((w) => ({ ...w, isDefault: w.code === code })));
    setMenuFor(null);
    toast("Default warehouse updated");
    if (target?.id) {
      const updates: Promise<unknown>[] = [api.put(`/api/warehouses/${target.id}`, { isDefault: true })];
      if (prevDefault?.id && prevDefault.id !== target.id) {
        updates.push(api.put(`/api/warehouses/${prevDefault.id}`, { isDefault: false }));
      }
      Promise.all(updates).catch(() => toast("Failed to update default warehouse", "error"));
    }
  };

  const handleAdd = () => {
    const errors: { name?: string; code?: string; zip?: string; capacity?: string } = {};
    if (!draft.name.trim()) errors.name = "Name is required";
    if (!draft.code.trim()) errors.code = "Code is required";
    else if (warehouses.some((w) => w.code.toLowerCase() === draft.code.trim().toLowerCase())) errors.code = "A warehouse with this code already exists";
    if (!draft.zip.trim()) errors.zip = "Postal code is required";
    else if (!/^[A-Za-z0-9][A-Za-z0-9\s,-]{2,}$/.test(draft.zip.trim())) errors.zip = "Enter a valid postal code";
    const capacity = Number(draft.capacity);
    if (draft.capacity.trim() === "" || Number.isNaN(capacity)) errors.capacity = "Capacity must be a number";
    else if (capacity < 0 || capacity > 100) errors.capacity = "Capacity must be between 0 and 100";
    setDraftErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast("Please fix the highlighted fields", "error");
      return;
    }
    setWarehouses((ws) => [
      ...ws,
      {
        name: draft.name.trim(),
        code: draft.code.trim(),
        location: draft.location.trim() || "—",
        zip: draft.zip.trim(),
        type: draft.type,
        manager: draft.manager.trim() || "—",
        managerEmail: draft.managerEmail.trim() || "—",
        capacity,
        isDefault: false,
        status: "Active",
      },
    ]);
    api
      .post<ApiWarehouse>("/api/warehouses", {
        name: draft.name.trim(),
        code: draft.code.trim(),
        location: draft.location.trim() || "—",
        type: draft.type,
        manager: draft.manager.trim() || "—",
        capacity,
        isDefault: false,
        status: "Active",
      })
      .then((created) => {
        if (created?.id) {
          setWarehouses((ws) => ws.map((w) => (w.code === draft.code.trim() ? { ...w, id: created.id } : w)));
        }
      })
      .catch(() => toast("Failed to create warehouse on server", "error"));
    setAddOpen(false);
    setDraft(emptyDraft);
    toast(`${draft.name.trim()} added`);
  };

  const handleRemove = () => {
    if (!removing) return;
    const id = removing.id;
    setWarehouses((ws) => ws.filter((w) => w.code !== removing.code));
    toast(`${removing.name} removed`);
    setRemoving(null);
    if (id) {
      api.del(`/api/warehouses/${id}`).catch(() => toast("Failed to remove warehouse on server", "error"));
    }
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
          onClick={() => { setDraft(emptyDraft); setDraftErrors({}); setAddOpen(true); }}
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
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-[#94A3B8]">
                  Loading warehouses...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
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
                            onClick={() => requestToggleStatus(w)}
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
                            onClick={() => requestRemove(w)}
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
      <div className="mt-4">
        <p className="text-[13px] text-[#64748B]">Showing {filtered.length} of {warehouses.length} warehouses</p>
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
          <Field label="Name" required error={draftErrors.name}>
            <TextInput
              value={draft.name}
              onChange={(e) => { setDraft({ ...draft, name: e.target.value }); setDraftErrors((p) => ({ ...p, name: undefined })); }}
              placeholder="Singapore Warehouse"
            />
          </Field>
          <Field label="Code" required error={draftErrors.code}>
            <TextInput
              value={draft.code}
              onChange={(e) => { setDraft({ ...draft, code: e.target.value }); setDraftErrors((p) => ({ ...p, code: undefined })); }}
              placeholder="SIN-005"
            />
          </Field>
          <Field label="Location">
            <TextInput value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="Singapore" />
          </Field>
          <Field label="ZIP / Postal" required error={draftErrors.zip}>
            <TextInput
              value={draft.zip}
              onChange={(e) => { setDraft({ ...draft, zip: e.target.value }); setDraftErrors((p) => ({ ...p, zip: undefined })); }}
              placeholder="486035, SG"
            />
          </Field>
          <Field label="Type">
            <Select options={["Regional", "Hub"]} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} />
          </Field>
          <Field label="Capacity (%)" error={draftErrors.capacity}>
            <NumberInput
              value={draft.capacity}
              onChange={(e) => { setDraft({ ...draft, capacity: e.target.value }); setDraftErrors((p) => ({ ...p, capacity: undefined })); }}
              min="0"
              max="100"
            />
          </Field>
          <Field label="Manager">
            <TextInput value={draft.manager} onChange={(e) => setDraft({ ...draft, manager: e.target.value })} placeholder="Jane Tan" />
          </Field>
          <Field label="Manager email">
            <TextInput type="email" value={draft.managerEmail} onChange={(e) => setDraft({ ...draft, managerEmail: e.target.value })} placeholder="jane@fm.co" />
          </Field>
        </div>
      </Modal>

      {/* Pause Default Warehouse Confirm */}
      <ConfirmDialog
        open={pausingDefault !== null}
        onClose={() => setPausingDefault(null)}
        onConfirm={() => {
          if (pausingDefault) toggleStatus(pausingDefault.code);
          setPausingDefault(null);
        }}
        title="Pause default warehouse"
        message={`"${pausingDefault?.name ?? ""}" is your default warehouse. Pausing it will stop new orders from being routed here until it is reactivated. Continue?`}
        confirmLabel="Pause Warehouse"
        destructive
      />

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
