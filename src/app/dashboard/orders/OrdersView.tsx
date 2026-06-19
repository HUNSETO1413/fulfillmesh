"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Filter, ChevronDown, Download, Plus, Calendar,
  ChevronLeft, ChevronRight, Pencil, Trash2, ChevronUp, ArrowUpDown,
  ShoppingCart, Loader, Truck, DollarSign, ArrowUpRight,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

const tabs = ["All Orders", "Processing", "In Transit", "Delivered", "Cancelled"];
const STATUSES: OrderStatus[] = ["Pending", "Processing", "In Transit", "Delivered", "Cancelled"];
const CHANNELS = ["Shopify", "Amazon", "Direct", "TikTok Shop"];

// The demo workspace anchors "today" to the end of the header range so date
// filtering stays deterministic across renders.
const REF_DATE = new Date("2025-05-18T12:00:00Z");
const DATE_RANGES = ["All time", "Last 7 days", "Last 30 days", "This quarter", "Year to date"];

function rangeStart(range: string): Date | null {
  const start = new Date(REF_DATE);
  switch (range) {
    case "Last 7 days":
      start.setUTCDate(start.getUTCDate() - 7);
      return start;
    case "Last 30 days":
      start.setUTCDate(start.getUTCDate() - 30);
      return start;
    case "This quarter":
      return new Date("2025-04-01T00:00:00Z");
    case "Year to date":
      return new Date("2025-01-01T00:00:00Z");
    default:
      return null;
  }
}

function inDateRange(iso: string | undefined, range: string): boolean {
  const start = rangeStart(range);
  if (!start) return true;
  if (!iso) return false;
  const d = new Date(`${iso}T12:00:00Z`);
  return d >= start && d <= REF_DATE;
}

type Draft = {
  customer: string;
  status: OrderStatus;
  date: string;
  total: string;
  channel: string;
  destination: string;
};

const emptyDraft: Draft = {
  customer: "", status: "Pending", date: new Date().toISOString().slice(0, 10),
  total: "", channel: "Shopify", destination: "",
};

function OrderFields({ draft, set }: { draft: Draft; set: (d: Partial<Draft>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Field label="Customer" required>
          <TextInput value={draft.customer} onChange={(e) => set({ customer: e.target.value })} placeholder="Acme Retail" />
        </Field>
      </div>
      <Field label="Status">
        <Select options={STATUSES} value={draft.status} onChange={(e) => set({ status: e.target.value as OrderStatus })} />
      </Field>
      <Field label="Channel">
        <Select options={CHANNELS} value={draft.channel} onChange={(e) => set({ channel: e.target.value })} />
      </Field>
      <Field label="Order date">
        <TextInput type="date" value={draft.date} onChange={(e) => set({ date: e.target.value })} />
      </Field>
      <Field label="Total (USD)">
        <NumberInput value={draft.total} onChange={(e) => set({ total: e.target.value })} placeholder="0.00" step="0.01" min="0" />
      </Field>
      <div className="col-span-2">
        <Field label="Destination">
          <TextInput value={draft.destination} onChange={(e) => set({ destination: e.target.value })} placeholder="United States" />
        </Field>
      </div>
    </div>
  );
}

export default function OrdersView({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("All Orders");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateRange, setDateRange] = useState("All time");

  const [channelFilter, setChannelFilter] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  // sorting
  type SortKey = "id" | "customer" | "status" | "date" | "total";
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // create / edit
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<Order | null>(null);

  // Close any open custom dropdown on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setDateOpen(false);
      setFilterOpen(false);
      setPageSizeOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Stat cards computed from the real order rows (excluding cancelled from
  // active-revenue figures so AOV reflects realised sales).
  const stats = useMemo(() => {
    const total = orders.length;
    const inProgress = orders.filter((o) => o.status === "Processing" || o.status === "Pending").length;
    const inTransit = orders.filter((o) => o.status === "In Transit").length;
    const revenueOrders = orders.filter((o) => o.status !== "Cancelled");
    const revenue = revenueOrders.reduce((sum, o) => sum + o.total, 0);
    const aov = revenueOrders.length > 0 ? revenue / revenueOrders.length : 0;
    return [
      { title: "Total Orders", value: formatNumber(total), sub: "all channels", icon: ShoppingCart, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
      { title: "In Progress", value: formatNumber(inProgress), sub: "pending & processing", icon: Loader, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
      { title: "In Transit", value: formatNumber(inTransit), sub: "shipments en route", icon: Truck, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
      { title: "Revenue · AOV", value: formatCurrency(revenue), sub: `${formatCurrency(aov)} avg order`, icon: DollarSign, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
    ];
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = activeTab === "All Orders" || o.status === activeTab;
      const matchesChannel = !channelFilter || o.channel === channelFilter;
      const matchesDate = inDateRange(o.date, dateRange);
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
      return matchesTab && matchesChannel && matchesDate && matchesQuery;
    });
  }, [orders, activeTab, channelFilter, dateRange, query]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "total") {
        av = a.total; bv = b.total;
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

  const pageIds = pageRows.map((o) => o.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const selectedRows = sorted.filter((o) => selected.has(o.id));

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
        await api.del(`/api/orders/${id}`);
      }
      toast(`Deleted ${selected.size} order${selected.size === 1 ? "" : "s"}`);
      setSelected(new Set());
      setBulkDeleting(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete orders", "error");
    } finally {
      setBusy(false);
    }
  }

  function exportSelected() {
    exportToCsv("orders-selected", selectedRows, [
      { key: "id", header: "Order ID" },
      { key: "customer", header: "Customer" },
      { key: "status", header: "Status" },
      { key: "date", header: "Date" },
      { key: "total", header: "Total" },
      { key: "channel", header: "Channel" },
      { key: "destination", header: "Destination" },
    ]);
    toast(`Exported ${selectedRows.length} selected orders to CSV`);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(o: Order) {
    setEditing(o);
    setDraft({
      customer: o.customer, status: o.status, date: o.date,
      total: String(o.total), channel: o.channel ?? "Shopify", destination: o.destination ?? "",
    });
    setFormOpen(true);
  }

  async function saveOrder() {
    if (!draft.customer.trim()) {
      toast("Customer is required", "error");
      return;
    }
    setBusy(true);
    const payload = {
      customer: draft.customer.trim(),
      status: draft.status,
      date: draft.date,
      total: Number(draft.total) || 0,
      channel: draft.channel,
      destination: draft.destination.trim() || undefined,
    };
    try {
      if (editing) {
        await api.put(`/api/orders/${editing.id}`, payload);
        toast(`Order ${editing.id} updated`);
      } else {
        const created = await api.post<Order>("/api/orders", payload);
        toast(`Order ${created.id} created`);
      }
      setFormOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save order", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.del(`/api/orders/${deleting.id}`);
      toast(`Order ${deleting.id} deleted`);
      setDeleting(null);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete order", "error");
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    exportToCsv("orders", filtered, [
      { key: "id", header: "Order ID" },
      { key: "customer", header: "Customer" },
      { key: "status", header: "Status" },
      { key: "date", header: "Date" },
      { key: "total", header: "Total" },
      { key: "channel", header: "Channel" },
      { key: "destination", header: "Destination" },
    ]);
    toast(`Exported ${filtered.length} orders to CSV`);
  }

  function selectTab(tab: string) {
    setActiveTab(tab);
    setPage(1);
  }

  const sortIcon = (k: SortKey) =>
    sortKey !== k
      ? <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
      : <ChevronUp className={`w-3.5 h-3.5 text-[#3B82F6] transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} />;

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold text-[#1A1A1A]">Orders</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setDateOpen((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                dateRange !== "All time" ? "text-[#3B82F6] bg-[#3B82F6]/10" : "text-[#6B7280] hover:bg-[#F3F4F6]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {dateRange === "All time" ? "All time" : dateRange}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {dateOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDateOpen(false)} />
                <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-[#E5E7EB] shadow-lg py-1">
                  {DATE_RANGES.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setDateRange(r); setPage(1); setDateOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F3F4F6] ${dateRange === r ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}
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
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[13px] font-medium text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Order
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#6B7280]">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#1A1A1A] leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#00B894]" />
                <span className="text-[11px] text-[#9CA3AF]">{s.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => selectTab(tab)}
            className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
              activeTab === tab ? "bg-[#3B82F6] text-white" : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] text-[#374151] placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-[13px] transition-colors ${
                  channelFilter ? "bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6]" : "bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]"
                }`}
              >
                <Filter className="w-4 h-4" />
                {channelFilter || "Filters"}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                  <div className="absolute left-0 mt-1 z-20 w-48 bg-white rounded-lg border border-[#E5E7EB] shadow-lg py-1">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-[#9CA3AF] uppercase">Channel</p>
                    <button
                      onClick={() => { setChannelFilter(""); setFilterOpen(false); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F3F4F6] ${!channelFilter ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}
                    >
                      All channels
                    </button>
                    {CHANNELS.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setChannelFilter(c); setFilterOpen(false); setPage(1); }}
                        className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F3F4F6] ${channelFilter === c ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
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
                className="px-2 py-1.5 text-[13px] text-[#6B7280] hover:text-[#374151]"
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
                    className="w-4 h-4 rounded border-[#D1D5DB] text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer"
                  />
                </th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">
                  <button onClick={() => toggleSort("id")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Order ID {sortIcon("id")}</button>
                </th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">
                  <button onClick={() => toggleSort("customer")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Customer {sortIcon("customer")}</button>
                </th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">
                  <button onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Status {sortIcon("status")}</button>
                </th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">
                  <button onClick={() => toggleSort("date")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Order Date {sortIcon("date")}</button>
                </th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">
                  <button onClick={() => toggleSort("total")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Total {sortIcon("total")}</button>
                </th>
                <th className="text-right text-[14px] font-semibold text-[#374151] px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((order) => (
                <tr key={order.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(order.id)}
                      onChange={() => toggleRow(order.id)}
                      aria-label={`Select ${order.id}`}
                      className="w-4 h-4 rounded border-[#D1D5DB] text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/orders/${order.id}`} className="text-[14px] font-medium text-[#374151] font-mono hover:text-[#3B82F6]">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3"><span className="text-[14px] text-[#374151]">{order.customer}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3"><span className="text-[14px] text-[#6B7280]">{formatDate(order.date)}</span></td>
                  <td className="px-4 py-3 text-[14px] text-[#374151]">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(order)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-[#6B7280] hover:bg-[#EFF6FF] hover:text-[#3B82F6] transition-colors"
                        aria-label={`Edit ${order.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(order)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                        aria-label={`Delete ${order.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-[14px] text-[#6B7280]">No orders match your filters.</p>
                    <button onClick={openCreate} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] hover:underline">
                      <Plus className="w-4 h-4" /> Create your first order
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]">
          <p className="text-[14px] text-[#6B7280]">
            {filtered.length === 0
              ? "Showing 0 results"
              : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} orders`}
          </p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setPageSizeOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#E5E7EB] rounded-md text-[13px] text-[#6B7280] hover:bg-[#F3F4F6]"
              >
                {pageSize} per page
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
                        className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F3F4F6] ${n === pageSize ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}
                      >
                        {n} per page
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`min-w-8 h-8 px-2.5 flex items-center justify-center rounded-md text-[14px] font-medium ${p === currentPage ? "bg-[#3B82F6] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.id}` : "New Order"}
        description={editing ? "Update the order details below." : "Create a new order in your workspace."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveOrder} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create order"}
            </PrimaryButton>
          </>
        }
      >
        <OrderFields draft={draft} set={(d) => setDraft((prev) => ({ ...prev, ...d }))} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete order"
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
        title="Delete selected orders"
        message={`Are you sure you want to delete ${selected.size} order${selected.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel={`Delete ${selected.size}`}
        destructive
        loading={busy}
      />
    </div>
  );
}
