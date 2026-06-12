"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Filter, ChevronDown, Download, Plus, Calendar,
  ChevronLeft, ChevronRight, Pencil, Trash2,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

const tabs = ["All Orders", "Processing", "In Transit", "Delivered", "Cancelled"];
const STATUSES: OrderStatus[] = ["Pending", "Processing", "In Transit", "Delivered", "Cancelled"];
const CHANNELS = ["Shopify", "Amazon", "Direct", "TikTok Shop"];

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
  const pageSize = 8;

  const [channelFilter, setChannelFilter] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  // create / edit
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = activeTab === "All Orders" || o.status === activeTab;
      const matchesChannel = !channelFilter || o.channel === channelFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
      return matchesTab && matchesChannel && matchesQuery;
    });
  }, [orders, activeTab, channelFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

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

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold text-[#1A1A1A]">Orders</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
            <Calendar className="w-4 h-4" />
            May 01 - May 08, 2025
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[13px] font-medium text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Order
          </button>
        </div>
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">Order ID</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">Customer</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">Status</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">Order Date</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-4 py-3">Total</th>
                <th className="text-right text-[14px] font-semibold text-[#374151] px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((order) => (
                <tr key={order.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
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
                  <td colSpan={6} className="px-4 py-12 text-center">
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
    </div>
  );
}
