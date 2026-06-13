"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Calendar, Plus, Filter, Download, Pencil, Trash2,
  ChevronUp, ArrowUpDown,
} from "lucide-react";
import type { ReturnRecord, ReturnStatus } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate } from "@/lib/format";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

// Tab label -> matching ReturnRecord statuses. "Completed" groups the terminal
// fulfilled states; all other tabs map to a single status.
const tabs = ["All Returns", "Requested", "Approved", "In Transit", "Completed", "Rejected"];
const tabStatuses: Record<string, ReturnRecord["status"][]> = {
  Requested: ["Requested"],
  Approved: ["Approved"],
  "In Transit": ["In Transit"],
  Completed: ["Received", "Refunded"],
  Rejected: ["Rejected"],
};

const STATUSES: ReturnStatus[] = ["Requested", "Approved", "In Transit", "Received", "Refunded", "Rejected"];
const REASONS = ["Defective", "Wrong Item", "Not as Described", "Damaged in Transit", "No Longer Needed", "Other"];

type Draft = {
  orderId: string;
  customer: string;
  reason: string;
  status: ReturnStatus;
  requestedDate: string;
  items: string;
  refundAmount: string;
};

const emptyDraft: Draft = {
  orderId: "", customer: "", reason: "Defective", status: "Requested",
  requestedDate: new Date().toISOString().slice(0, 10), items: "1", refundAmount: "",
};

function ReturnFields({ draft, set }: { draft: Draft; set: (d: Partial<Draft>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Order ID" required>
        <TextInput value={draft.orderId} onChange={(e) => set({ orderId: e.target.value })} placeholder="ORD-1024" />
      </Field>
      <Field label="Customer" required>
        <TextInput value={draft.customer} onChange={(e) => set({ customer: e.target.value })} placeholder="Acme Retail" />
      </Field>
      <Field label="Reason">
        <Select options={REASONS} value={draft.reason} onChange={(e) => set({ reason: e.target.value })} />
      </Field>
      <Field label="Status">
        <Select options={STATUSES} value={draft.status} onChange={(e) => set({ status: e.target.value as ReturnStatus })} />
      </Field>
      <Field label="Request date">
        <TextInput type="date" value={draft.requestedDate} onChange={(e) => set({ requestedDate: e.target.value })} />
      </Field>
      <Field label="Items">
        <NumberInput value={draft.items} onChange={(e) => set({ items: e.target.value })} min="1" step="1" />
      </Field>
      <div className="col-span-2">
        <Field label="Refund amount (USD)">
          <NumberInput value={draft.refundAmount} onChange={(e) => set({ refundAmount: e.target.value })} placeholder="0.00" step="0.01" min="0" />
        </Field>
      </div>
    </div>
  );
}

export default function ReturnsView({ items }: { items: ReturnRecord[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("All Returns");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  // sorting
  type SortKey = "id" | "orderId" | "customer" | "status" | "reason" | "requestedDate" | "items";
  const [sortKey, setSortKey] = useState<SortKey>("requestedDate");
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
  const [editing, setEditing] = useState<ReturnRecord | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<ReturnRecord | null>(null);

  const filtered = useMemo(() => {
    return items.filter((r) => {
      const matchesTab =
        activeTab === "All Returns" || (tabStatuses[activeTab]?.includes(r.status) ?? false);
      const matchesStatus = !statusFilter || r.status === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.orderId.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q);
      return matchesTab && matchesStatus && matchesQuery;
    });
  }, [items, activeTab, statusFilter, query]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "items") {
        av = a.items; bv = b.items;
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
        await api.del(`/api/returns/${id}`);
      }
      toast(`Deleted ${selected.size} return${selected.size === 1 ? "" : "s"}`);
      setSelected(new Set());
      setBulkDeleting(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete returns", "error");
    } finally {
      setBusy(false);
    }
  }

  function exportSelected() {
    exportToCsv("returns-selected", selectedRows, [
      { key: "id", header: "Return ID" },
      { key: "orderId", header: "Order ID" },
      { key: "customer", header: "Customer" },
      { key: "status", header: "Status" },
      { key: "reason", header: "Reason" },
      { key: "requestedDate", header: "Request Date" },
      { key: "items", header: "Items" },
      { key: "refundAmount", header: "Refund Amount" },
    ]);
    toast(`Exported ${selectedRows.length} selected returns to CSV`);
  }

  const sortIcon = (k: SortKey) =>
    sortKey !== k
      ? <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
      : <ChevronUp className={`w-3.5 h-3.5 text-[#2563EB] transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} />;

  function selectTab(tab: string) {
    setActiveTab(tab);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(r: ReturnRecord) {
    setEditing(r);
    setDraft({
      orderId: r.orderId,
      customer: r.customer,
      reason: r.reason,
      status: r.status,
      requestedDate: r.requestedDate,
      items: String(r.items),
      refundAmount: r.refundAmount != null ? String(r.refundAmount) : "",
    });
    setFormOpen(true);
  }

  async function saveReturn() {
    if (!draft.orderId.trim()) { toast("Order ID is required", "error"); return; }
    if (!draft.customer.trim()) { toast("Customer is required", "error"); return; }
    setBusy(true);
    const payload = {
      orderId: draft.orderId.trim(),
      customer: draft.customer.trim(),
      reason: draft.reason,
      status: draft.status,
      requestedDate: draft.requestedDate,
      items: Number(draft.items) || 1,
      refundAmount: draft.refundAmount.trim() ? Number(draft.refundAmount) : undefined,
    };
    try {
      if (editing) {
        await api.put(`/api/returns/${editing.id}`, payload);
        toast(`Return ${editing.id} updated`);
      } else {
        const created = await api.post<ReturnRecord>("/api/returns", payload);
        toast(`Return ${created.id} created`);
      }
      setFormOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save return", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.del(`/api/returns/${deleting.id}`);
      toast(`Return ${deleting.id} deleted`);
      setDeleting(null);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete return", "error");
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    exportToCsv("returns", filtered, [
      { key: "id", header: "Return ID" },
      { key: "orderId", header: "Order ID" },
      { key: "customer", header: "Customer" },
      { key: "status", header: "Status" },
      { key: "reason", header: "Reason" },
      { key: "requestedDate", header: "Request Date" },
      { key: "items", header: "Items" },
      { key: "refundAmount", header: "Refund Amount" },
    ]);
    toast(`Exported ${filtered.length} returns to CSV`);
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#061A3D]">Returns</h1>
          <p className="text-[14px] text-[#4A5A73] mt-0.5">Manage customer return requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setDateOpen((v) => !v)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <Calendar className="w-4 h-4" />
              May 12 – May 18, 2025
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {dateOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDateOpen(false)} />
                <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-[#E5E7EB] shadow-lg py-1">
                  {["Last 7 days", "Last 30 days", "This quarter", "Year to date"].map((r) => (
                    <button
                      key={r}
                      onClick={() => { setDateOpen(false); toast(`Date range: ${r}`); }}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-[#374151] hover:bg-[#F9FAFB]"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <Plus className="w-4 h-4" />
            New Return
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#E5E7EB]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => selectTab(tab)}
            className={`px-1 py-2.5 text-[13px] font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? "text-[#061A3D] border-[#2563EB]"
                : "text-[#4A5A73] border-transparent hover:text-[#061A3D]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table card with integrated toolbar */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search returns by order ID, customer name..."
                className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] text-[#061A3D] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[13px] font-medium transition-colors ${
                  statusFilter ? "bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]" : "bg-white border-[#D1D5DB] text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF]"
                }`}
              >
                <Filter className="w-4 h-4" />
                {statusFilter || "Filters"}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                  <div className="absolute left-0 mt-1 z-20 w-48 bg-white rounded-lg border border-[#E5E7EB] shadow-lg py-1">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-[#9CA3AF] uppercase">Status</p>
                    <button
                      onClick={() => { setStatusFilter(""); setFilterOpen(false); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F9FAFB] ${!statusFilter ? "text-[#2563EB] font-medium" : "text-[#374151]"}`}
                    >
                      All statuses
                    </button>
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setFilterOpen(false); setPage(1); }}
                        className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F9FAFB] ${statusFilter === s ? "text-[#2563EB] font-medium" : "text-[#374151]"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF]"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#EFF6FF] border-b border-[#BFDBFE]">
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
                className="px-2 py-1.5 text-[13px] text-[#4A5A73] hover:text-[#061A3D]"
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
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all on page"
                    className="w-4 h-4 rounded border-[#D1D5DB] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">
                  <button onClick={() => toggleSort("id")} className="inline-flex items-center gap-1 hover:text-[#2563EB]">Return ID {sortIcon("id")}</button>
                </th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">
                  <button onClick={() => toggleSort("orderId")} className="inline-flex items-center gap-1 hover:text-[#2563EB]">Order ID {sortIcon("orderId")}</button>
                </th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">
                  <button onClick={() => toggleSort("customer")} className="inline-flex items-center gap-1 hover:text-[#2563EB]">Customer {sortIcon("customer")}</button>
                </th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">
                  <button onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 hover:text-[#2563EB]">Status {sortIcon("status")}</button>
                </th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">
                  <button onClick={() => toggleSort("reason")} className="inline-flex items-center gap-1 hover:text-[#2563EB]">Reason {sortIcon("reason")}</button>
                </th>
                <th className="text-left text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">
                  <button onClick={() => toggleSort("requestedDate")} className="inline-flex items-center gap-1 hover:text-[#2563EB]">Request Date {sortIcon("requestedDate")}</button>
                </th>
                <th className="text-right text-[12px] font-medium text-[#374151] uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr key={r.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(r.id)}
                      onChange={() => toggleRow(r.id)}
                      aria-label={`Select ${r.id}`}
                      className="w-4 h-4 rounded border-[#D1D5DB] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/returns/${r.id}`} className="text-[13px] font-medium text-[#061A3D] hover:underline hover:text-[#2563EB]">
                      {r.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#4A5A73]">{r.orderId}</td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-[#061A3D]">{r.customer}</p>
                    <p className="text-[12px] text-[#4A5A73]">{r.customer.toLowerCase().replace(/[^a-z]/g, "")}@example.com</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-[13px] text-[#374151]">{r.reason}</td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-[#4A5A73]">{formatDate(r.requestedDate)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(r)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-[#9CA3AF] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
                        aria-label={`Edit ${r.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(r)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-[#9CA3AF] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                        aria-label={`Delete ${r.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-[#4A5A73]">
                    No returns match your filters.
                    <button onClick={openCreate} className="mt-3 mx-auto flex items-center gap-1.5 text-[13px] font-medium text-[#2563EB] hover:underline">
                      <Plus className="w-4 h-4" /> Create your first return
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]">
          <p className="text-[13px] text-[#4A5A73]">
            {sorted.length === 0
              ? "Showing 0 results"
              : `Showing ${start + 1} to ${Math.min(start + pageSize, sorted.length)} of ${sorted.length} returns`}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium ${
                    p === currentPage
                      ? "bg-[#2563EB] text-white shadow-[0_1px_2px_rgba(37,99,246,0.4)]"
                      : "border border-[#D1D5DB] text-[#4A5A73] hover:bg-[#F9FAFB]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#4A5A73] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setPageSizeOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D1D5DB] rounded-lg text-[13px] text-[#4A5A73] hover:bg-[#F9FAFB]"
              >
                {pageSize} / page
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {pageSizeOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPageSizeOpen(false)} />
                  <div className="absolute right-0 bottom-full mb-1 z-20 w-32 bg-white rounded-lg border border-[#E5E7EB] shadow-lg py-1">
                    {[8, 10, 20, 50].map((n) => (
                      <button
                        key={n}
                        onClick={() => { setPageSize(n); setPage(1); setPageSizeOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F9FAFB] ${n === pageSize ? "text-[#2563EB] font-medium" : "text-[#374151]"}`}
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
        title={editing ? `Edit ${editing.id}` : "New Return"}
        description={editing ? "Update the return details below." : "Create a new return request in your workspace."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveReturn} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create return"}
            </PrimaryButton>
          </>
        }
      >
        <ReturnFields draft={draft} set={(d) => setDraft((prev) => ({ ...prev, ...d }))} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete return"
        message={`Are you sure you want to delete ${deleting?.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        open={bulkDeleting}
        onClose={() => setBulkDeleting(false)}
        onConfirm={bulkDelete}
        title="Delete selected returns"
        message={`Are you sure you want to delete ${selected.size} return${selected.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel={`Delete ${selected.size}`}
        destructive
        loading={busy}
      />
    </div>
  );
}
