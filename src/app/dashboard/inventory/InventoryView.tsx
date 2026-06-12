"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package, Layers, AlertTriangle, XCircle,
  Search, Filter, Download, Calendar, Plus,
  ChevronDown, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
  Pencil, Trash2,
} from "lucide-react";
import type { InventoryItem, StockStatus } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatNumber } from "@/lib/format";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

const STOCK_STATUSES: StockStatus[] = ["In Stock", "Low Stock", "Out of Stock", "Backordered"];

type Draft = {
  sku: string;
  name: string;
  warehouse: string;
  location: string;
  onHand: string;
  reserved: string;
  available: string;
  reorderPoint: string;
  status: StockStatus;
};

const emptyDraft: Draft = {
  sku: "", name: "", warehouse: "", location: "",
  onHand: "0", reserved: "0", available: "0", reorderPoint: "0", status: "In Stock",
};

function InventoryFields({ draft, set }: { draft: Draft; set: (d: Partial<Draft>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="SKU" required>
        <TextInput value={draft.sku} onChange={(e) => set({ sku: e.target.value })} placeholder="WB-750-SLV" />
      </Field>
      <Field label="Product name" required>
        <TextInput value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="Insulated Water Bottle" />
      </Field>
      <Field label="Warehouse" required>
        <TextInput value={draft.warehouse} onChange={(e) => set({ warehouse: e.target.value })} placeholder="Los Angeles, CA" />
      </Field>
      <Field label="Location">
        <TextInput value={draft.location} onChange={(e) => set({ location: e.target.value })} placeholder="LA-A12-R04-B02" />
      </Field>
      <Field label="On hand">
        <NumberInput value={draft.onHand} onChange={(e) => set({ onHand: e.target.value })} step="1" min="0" />
      </Field>
      <Field label="Reserved">
        <NumberInput value={draft.reserved} onChange={(e) => set({ reserved: e.target.value })} step="1" min="0" />
      </Field>
      <Field label="Available">
        <NumberInput value={draft.available} onChange={(e) => set({ available: e.target.value })} step="1" min="0" />
      </Field>
      <Field label="Reorder point">
        <NumberInput value={draft.reorderPoint} onChange={(e) => set({ reorderPoint: e.target.value })} step="1" min="0" />
      </Field>
      <div className="col-span-2">
        <Field label="Status">
          <Select options={STOCK_STATUSES} value={draft.status} onChange={(e) => set({ status: e.target.value as StockStatus })} />
        </Field>
      </div>
    </div>
  );
}

const stats = [
  { title: "Total Products", value: "2,458", change: "+7.2%", note: "vs May 1", positive: true, icon: Package, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { title: "Total Stock", value: "156,782", change: "+4.6%", note: "vs May 5", positive: true, icon: Layers, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { title: "Low Stock Items", value: "128", change: "-3.7%", note: "vs May 5", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Out of Stock", value: "23", change: "+12.5%", note: "vs May 5", positive: false, icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

const statusTabs: { label: string; value: string }[] = [
  { label: "All", value: "All" },
  { label: "In Stock", value: "In Stock" },
  { label: "Low Stock", value: "Low Stock" },
  { label: "Out of Stock", value: "Out of Stock" },
  { label: "Backordered", value: "Backordered" },
];

export default function InventoryView({ items }: { items: InventoryItem[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeStatus, setActiveStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // warehouse filter dropdown
  const [warehouseFilter, setWarehouseFilter] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  // create / edit
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<InventoryItem | null>(null);

  const warehouses = useMemo(
    () => [...new Set(items.map((it) => it.warehouse))].sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const matchesStatus = activeStatus === "All" || it.status === activeStatus;
      const matchesWarehouse = !warehouseFilter || it.warehouse === warehouseFilter;
      const matchesQuery =
        !q ||
        it.id.toLowerCase().includes(q) ||
        it.name.toLowerCase().includes(q) ||
        it.sku.toLowerCase().includes(q);
      return matchesStatus && matchesWarehouse && matchesQuery;
    });
  }, [items, activeStatus, warehouseFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function selectStatus(value: string) {
    setActiveStatus(value);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(it: InventoryItem) {
    setEditing(it);
    setDraft({
      sku: it.sku,
      name: it.name,
      warehouse: it.warehouse,
      location: it.location ?? "",
      onHand: String(it.onHand),
      reserved: String(it.reserved),
      available: String(it.available),
      reorderPoint: String(it.reorderPoint),
      status: it.status,
    });
    setFormOpen(true);
  }

  async function saveItem() {
    if (!draft.sku.trim()) { toast("SKU is required", "error"); return; }
    if (!draft.name.trim()) { toast("Product name is required", "error"); return; }
    if (!draft.warehouse.trim()) { toast("Warehouse is required", "error"); return; }
    setBusy(true);
    const payload = {
      sku: draft.sku.trim(),
      name: draft.name.trim(),
      warehouse: draft.warehouse.trim(),
      location: draft.location.trim() || undefined,
      onHand: Math.round(Number(draft.onHand) || 0),
      reserved: Math.round(Number(draft.reserved) || 0),
      available: Math.round(Number(draft.available) || 0),
      reorderPoint: Math.round(Number(draft.reorderPoint) || 0),
      status: draft.status,
    };
    try {
      if (editing) {
        await api.put(`/api/inventory/${editing.id}`, payload);
        toast(`SKU ${editing.sku} updated`);
      } else {
        const created = await api.post<InventoryItem>("/api/inventory", payload);
        toast(`SKU ${created.sku} created`);
      }
      setFormOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save item", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.del(`/api/inventory/${deleting.id}`);
      toast(`SKU ${deleting.sku} deleted`);
      setDeleting(null);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete item", "error");
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    exportToCsv("inventory", filtered, [
      { key: "id", header: "Inventory ID" },
      { key: "sku", header: "SKU" },
      { key: "name", header: "Name" },
      { key: "warehouse", header: "Warehouse" },
      { key: "location", header: "Location" },
      { key: "onHand", header: "On Hand" },
      { key: "reserved", header: "Reserved" },
      { key: "available", header: "Available" },
      { key: "reorderPoint", header: "Reorder Point" },
      { key: "status", header: "Status" },
    ]);
    toast(`Exported ${filtered.length} items to CSV`);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Inventory</h1>
          <p className="text-[14px] text-[#64748B] mt-1">May 15, 2023 - May 28, 2023</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]">
            <Calendar className="w-4 h-4" />
            May 12 - May 18, 2025
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-[13px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[13px] font-medium text-white"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const Arrow = stat.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={stat.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#64748B]">{stat.title}</span>
                <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#1E293B]">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <Arrow className={`w-3.5 h-3.5 ${stat.positive ? "text-[#10B981]" : "text-[#EF4444]"}`} />
                <span className={`text-[12px] font-medium ${stat.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {stat.change}
                </span>
                <span className="text-[11px] text-[#94A3B8]">{stat.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => selectStatus(tab.value)}
            className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
              activeStatus === tab.value
                ? "bg-[#3B82F6] text-white"
                : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products..."
                className="w-full text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] bg-white border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-[13px] transition-colors ${
                  warehouseFilter ? "bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6]" : "bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                }`}
              >
                <Filter className="w-4 h-4" />
                {warehouseFilter || "Filters"}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                  <div className="absolute left-0 mt-1 z-20 w-56 max-h-72 overflow-y-auto bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-[#94A3B8] uppercase">Warehouse</p>
                    <button
                      onClick={() => { setWarehouseFilter(""); setFilterOpen(false); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${!warehouseFilter ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}
                    >
                      All warehouses
                    </button>
                    {warehouses.map((w) => (
                      <button
                        key={w}
                        onClick={() => { setWarehouseFilter(w); setFilterOpen(false); setPage(1); }}
                        className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${warehouseFilter === w ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">SKU ID</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Product Name</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Location</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Stock</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Available</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((item) => (
                <tr key={item.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#3B82F6] font-mono whitespace-nowrap">
                    <Link href={`/dashboard/inventory/${item.id}`} className="hover:underline">{item.sku}</Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-medium text-[#1E293B]">{item.name}</p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">{item.warehouse}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B] whitespace-nowrap">{item.location ?? item.warehouse}</td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B]">{formatNumber(item.onHand)}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{formatNumber(item.available)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-[#94A3B8] hover:bg-[#EFF6FF] hover:text-[#3B82F6] transition-colors"
                        aria-label={`Edit ${item.sku}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-[#94A3B8] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                        aria-label={`Delete ${item.sku}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center">
                    <p className="text-[13px] text-[#64748B]">No inventory items match your filters.</p>
                    <button onClick={openCreate} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] hover:underline">
                      <Plus className="w-4 h-4" /> Add your first item
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
          <span className="text-[13px] text-[#64748B]">
            {filtered.length === 0
              ? "Showing 0 entries"
              : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${formatNumber(filtered.length)} entries`}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium ${
                  p === currentPage
                    ? "bg-[#3B82F6] text-white"
                    : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="ml-2 text-[13px] text-[#64748B] border border-[#E2E8F0] rounded-lg px-3 py-1.5">{pageSize} / page</span>
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.sku}` : "Add Inventory Item"}
        description={editing ? "Update the stock record below." : "Add a new SKU to your inventory."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveItem} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create item"}
            </PrimaryButton>
          </>
        }
      >
        <InventoryFields draft={draft} set={(d) => setDraft((prev) => ({ ...prev, ...d }))} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete inventory item"
        message={`Are you sure you want to delete ${deleting?.name ?? ""} (${deleting?.sku ?? ""})? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
