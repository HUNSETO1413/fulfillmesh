"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package, Layers, AlertTriangle, XCircle,
  Search, Filter, Download, Plus,
  ChevronDown, ChevronLeft, ChevronRight,
  Pencil, Trash2, ChevronUp, ArrowUpDown,
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

type DraftErrors = Partial<Record<keyof Draft, string>>;

function InventoryFields({ draft, set, errors }: { draft: Draft; set: (d: Partial<Draft>) => void; errors: DraftErrors }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="SKU" required error={errors.sku}>
        <TextInput value={draft.sku} onChange={(e) => set({ sku: e.target.value })} placeholder="WB-750-SLV" />
      </Field>
      <Field label="Product name" required error={errors.name}>
        <TextInput value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="Insulated Water Bottle" />
      </Field>
      <Field label="Warehouse" required error={errors.warehouse}>
        <TextInput value={draft.warehouse} onChange={(e) => set({ warehouse: e.target.value })} placeholder="Los Angeles, CA" />
      </Field>
      <Field label="Location">
        <TextInput value={draft.location} onChange={(e) => set({ location: e.target.value })} placeholder="LA-A12-R04-B02" />
      </Field>
      <Field label="On hand" error={errors.onHand}>
        <NumberInput value={draft.onHand} onChange={(e) => set({ onHand: e.target.value })} step="1" min="0" />
      </Field>
      <Field label="Reserved" error={errors.reserved}>
        <NumberInput value={draft.reserved} onChange={(e) => set({ reserved: e.target.value })} step="1" min="0" />
      </Field>
      <Field label="Available" error={errors.available}>
        <NumberInput value={draft.available} onChange={(e) => set({ available: e.target.value })} step="1" min="0" />
      </Field>
      <Field label="Reorder point" error={errors.reorderPoint}>
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
  const [pageSize, setPageSize] = useState(8);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  // warehouse filter dropdown
  const [warehouseFilter, setWarehouseFilter] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  // sorting
  type SortKey = "sku" | "name" | "location" | "onHand" | "available" | "status";
  const [sortKey, setSortKey] = useState<SortKey>("sku");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // create / edit
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [formErrors, setFormErrors] = useState<DraftErrors>({});
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<InventoryItem | null>(null);

  // Close any open custom dropdown when Escape is pressed.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFilterOpen(false);
        setPageSizeOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const warehouses = useMemo(
    () => [...new Set(items.map((it) => it.warehouse))].sort(),
    [items],
  );

  // Stat cards computed from the real inventory rows: total SKUs, total on-hand
  // units across all warehouses, low-stock count, and out-of-stock count.
  const stats = useMemo(() => {
    const totalSkus = items.length;
    const totalStock = items.reduce((s, it) => s + it.onHand, 0);
    const lowStock = items.filter((it) => it.status === "Low Stock").length;
    const outOfStock = items.filter((it) => it.status === "Out of Stock").length;
    return [
      { title: "Total SKUs", value: formatNumber(totalSkus), icon: Package, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
      { title: "Total Stock", value: formatNumber(totalStock), icon: Layers, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
      { title: "Low Stock Items", value: formatNumber(lowStock), icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
      { title: "Out of Stock", value: formatNumber(outOfStock), icon: XCircle, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
    ];
  }, [items]);

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

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const numericKeys: SortKey[] = ["onHand", "available"];
    return [...filtered].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (numericKeys.includes(sortKey)) {
        av = Number(a[sortKey] ?? 0);
        bv = Number(b[sortKey] ?? 0);
      } else {
        av = String(a[sortKey] ?? "").toLowerCase();
        bv = String(b[sortKey] ?? "").toLowerCase();
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const pageIds = pageRows.map((r) => r.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const selectedRows = sorted.filter((r) => selected.has(r.id));

  function toggleSelectAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        for (const id of pageIds) next.delete(id);
      } else {
        for (const id of pageIds) next.add(id);
      }
      return next;
    });
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkDelete() {
    setBusy(true);
    try {
      for (const id of selected) {
        await api.del(`/api/inventory/${id}`);
      }
      toast(`Deleted ${selected.size} item${selected.size === 1 ? "" : "s"}`);
      setSelected(new Set());
      setBulkDeleting(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete items", "error");
    } finally {
      setBusy(false);
    }
  }

  function exportSelected() {
    exportToCsv("inventory-selected", selectedRows, [
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
    toast(`Exported ${selectedRows.length} selected items to CSV`);
  }

  const sortIcon = (k: SortKey) =>
    sortKey !== k
      ? <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
      : <ChevronUp className={`w-3.5 h-3.5 text-[#3B82F6] transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} />;

  function selectStatus(value: string) {
    setActiveStatus(value);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setFormErrors({});
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(it: InventoryItem) {
    setEditing(it);
    setFormErrors({});
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

  function validateDraft(): DraftErrors {
    const errs: DraftErrors = {};
    if (!draft.sku.trim()) errs.sku = "SKU is required";
    if (!draft.name.trim()) errs.name = "Product name is required";
    if (!draft.warehouse.trim()) errs.warehouse = "Warehouse is required";
    const numKeys: (keyof Draft)[] = ["onHand", "reserved", "available", "reorderPoint"];
    for (const key of numKeys) {
      const raw = String(draft[key]);
      if (raw.trim() === "") continue;
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0) errs[key] = "Enter a valid non-negative number";
    }
    return errs;
  }

  async function saveItem() {
    const errs = validateDraft();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast("Please fix the highlighted fields", "error");
      return;
    }
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
                <span className="text-[11px] text-[#94A3B8]">Across all warehouses</span>
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

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-[#EFF6FF] border-b border-[#BFDBFE]">
            <span className="text-[13px] font-medium text-[#1D4ED8]">{selected.size} selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={exportSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#BFDBFE] rounded-lg text-[13px] text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"
              >
                <Download className="w-4 h-4" />
                Export selected
              </button>
              <button
                onClick={() => setBulkDeleting(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] rounded-lg text-[13px] font-medium text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete selected
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="px-2 py-1.5 text-[13px] text-[#64748B] hover:text-[#374151]"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="w-10 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all on page"
                    className="w-4 h-4 rounded border-[#D1D5DB] text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer"
                  />
                </th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("sku")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">SKU ID {sortIcon("sku")}</button>
                </th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("name")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Product Name {sortIcon("name")}</button>
                </th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("location")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Location {sortIcon("location")}</button>
                </th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("onHand")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Stock {sortIcon("onHand")}</button>
                </th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("available")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Available {sortIcon("available")}</button>
                </th>
                <th className="text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Status {sortIcon("status")}</button>
                </th>
                <th className="text-right text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((item) => (
                <tr key={item.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleRow(item.id)}
                      aria-label={`Select ${item.sku}`}
                      className="w-4 h-4 rounded border-[#D1D5DB] text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer"
                    />
                  </td>
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
                  <td colSpan={8} className="px-5 py-10 text-center">
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
            <div className="relative ml-2">
              <button
                onClick={() => setPageSizeOpen((v) => !v)}
                className="inline-flex items-center gap-1 text-[13px] text-[#64748B] border border-[#E2E8F0] rounded-lg px-3 py-1.5 hover:bg-[#F8FAFC]"
              >
                {pageSize} / page
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {pageSizeOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPageSizeOpen(false)} />
                  <div className="absolute right-0 bottom-full mb-1 z-20 w-28 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1">
                    {[8, 10, 20, 50].map((n) => (
                      <button
                        key={n}
                        onClick={() => { setPageSize(n); setPage(1); setPageSizeOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${n === pageSize ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}
                      >
                        {n} / page
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
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
        <InventoryFields draft={draft} set={(d) => setDraft((prev) => ({ ...prev, ...d }))} errors={formErrors} />
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

      {/* Bulk delete confirm */}
      <ConfirmDialog
        open={bulkDeleting}
        onClose={() => setBulkDeleting(false)}
        onConfirm={bulkDelete}
        title="Delete selected items"
        message={`Are you sure you want to delete ${selected.size} item${selected.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel={`Delete ${selected.size}`}
        destructive
        loading={busy}
      />
    </div>
  );
}
