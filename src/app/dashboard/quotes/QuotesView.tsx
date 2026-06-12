"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText, Users, Clock, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Search, ChevronDown, Pencil, Trash2, Plus, Calendar, Bell, SlidersHorizontal,
  ChevronLeft, ChevronRight, AlertCircle, Wallet, Download,
} from "lucide-react";
import type { Quote, QuoteStatus } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

const STATUSES: QuoteStatus[] = ["Draft", "Sent", "Accepted", "Declined", "Expired"];

type Draft = {
  customer: string;
  customerId: string;
  status: QuoteStatus;
  createdDate: string;
  validUntil: string;
  total: string;
};

const emptyDraft: Draft = {
  customer: "", customerId: "", status: "Draft",
  createdDate: new Date().toISOString().slice(0, 10), validUntil: "", total: "",
};

function QuoteFields({ draft, set }: { draft: Draft; set: (d: Partial<Draft>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Field label="Customer" required>
          <TextInput value={draft.customer} onChange={(e) => set({ customer: e.target.value })} placeholder="Acme Retail" />
        </Field>
      </div>
      <Field label="Customer ID">
        <TextInput value={draft.customerId} onChange={(e) => set({ customerId: e.target.value })} placeholder="CUS-1024" />
      </Field>
      <Field label="Status">
        <Select options={STATUSES} value={draft.status} onChange={(e) => set({ status: e.target.value as QuoteStatus })} />
      </Field>
      <Field label="Created date">
        <TextInput type="date" value={draft.createdDate} onChange={(e) => set({ createdDate: e.target.value })} />
      </Field>
      <Field label="Valid until">
        <TextInput type="date" value={draft.validUntil} onChange={(e) => set({ validUntil: e.target.value })} />
      </Field>
      <div className="col-span-2">
        <Field label="Total (USD)">
          <NumberInput value={draft.total} onChange={(e) => set({ total: e.target.value })} placeholder="0.00" step="0.01" min="0" />
        </Field>
      </div>
    </div>
  );
}

const stats = [
  { title: "Open RFQs", value: "24", change: "14.3%", positive: true, icon: FileText, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "Supplier Responses", value: "68", change: "17.6%", positive: true, icon: Users, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Avg. Turnaround Time", value: "2.6 days", change: "8.2%", positive: true, icon: Clock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Approved Quotes", value: "18", change: "20.0%", positive: true, icon: CheckCircle2, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
];

const responseLegend = [
  { name: "Excellent (≥ 75%)", count: "8", pct: "25.8%", color: "#00B894" },
  { name: "Good (50% – 74%)", count: "7", pct: "29.2%", color: "#0057D8" },
  { name: "Fair (25% – 49%)", count: "6", pct: "25.0%", color: "#F59E0B" },
  { name: "Low (< 25%)", count: "4", pct: "20.0%", color: "#EF4444" },
];

const tabs = ["All", "Draft", "Sent", "Accepted", "Declined", "Expired"];

export default function QuotesView({ items }: { items: Quote[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // create / edit
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<Quote | null>(null);

  const circumference = 2 * Math.PI * 40;
  const segs = [25.8, 29.2, 25.0, 20.0];
  const colors = ["#00B894", "#0057D8", "#F59E0B", "#EF4444"];

  const filtered = useMemo(() => {
    return items.filter((q) => {
      const matchesTab = activeTab === "All" || q.status === activeTab;
      const term = query.trim().toLowerCase();
      const matchesQuery =
        !term ||
        q.id.toLowerCase().includes(term) ||
        q.customer.toLowerCase().includes(term);
      return matchesTab && matchesQuery;
    });
  }, [items, activeTab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function selectTab(tab: string) {
    setActiveTab(tab);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(q: Quote) {
    setEditing(q);
    setDraft({
      customer: q.customer,
      customerId: q.customerId ?? "",
      status: q.status,
      createdDate: q.createdDate,
      validUntil: q.validUntil ?? "",
      total: String(q.total),
    });
    setFormOpen(true);
  }

  async function saveQuote() {
    if (!draft.customer.trim()) {
      toast("Customer is required", "error");
      return;
    }
    setBusy(true);
    const payload = {
      customer: draft.customer.trim(),
      customerId: draft.customerId.trim() || undefined,
      status: draft.status,
      createdDate: draft.createdDate,
      validUntil: draft.validUntil || undefined,
      total: Number(draft.total) || 0,
    };
    try {
      if (editing) {
        await api.put(`/api/quotes/${editing.id}`, payload);
        toast(`Quote ${editing.id} updated`);
      } else {
        const created = await api.post<Quote>("/api/quotes", payload);
        toast(`Quote ${created.id} created`);
      }
      setFormOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save quote", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.del(`/api/quotes/${deleting.id}`);
      toast(`Quote ${deleting.id} deleted`);
      setDeleting(null);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete quote", "error");
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    exportToCsv("quotes", filtered, [
      { key: "id", header: "Request ID" },
      { key: "customer", header: "Customer" },
      { key: "status", header: "Status" },
      { key: "createdDate", header: "Created Date" },
      { key: "validUntil", header: "Valid Until" },
      { key: "total", header: "Total" },
    ]);
    toast(`Exported ${filtered.length} RFQs to CSV`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Requests for Quotation</h1>
          <p className="text-[14px] text-text-body mt-1">Open RFQs with status, supplier, and response time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body hover:bg-soft-bg transition-colors">
            <Calendar className="w-4 h-4 text-text-light" /> May 1 – May 31, 2025 <ChevronDown className="w-3.5 h-3.5 text-text-light" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body hover:bg-soft-bg transition-colors"
          >
            <Download className="w-4 h-4 text-text-light" /> Export
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-[13px] font-semibold hover:bg-[#2563EB] transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
          >
            <Plus className="w-4 h-4" /> New RFQ
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-border-soft p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-text-muted font-medium">{s.title}</span>
                <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-text-primary leading-none tracking-tight">{s.value}</p>
              <div className="flex items-center gap-1.5 mt-3">
                {s.positive ? <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
                <span className={`text-[12px] font-semibold ${s.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-text-light">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-border-soft p-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search RFQs by ID, product, or supplier..."
            className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-colors"
          />
        </div>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => selectTab(t)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[13px] transition-colors ${
              activeTab === t
                ? "bg-[#3B82F6] border-[#3B82F6] text-white"
                : "bg-[#F9FAFB] border-[#E2E8F0] text-text-body hover:bg-[#F3F4F6]"
            }`}
          >
            {t}
          </button>
        ))}
        <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-[13px] text-text-body hover:bg-[#F3F4F6] transition-colors"><SlidersHorizontal className="w-3.5 h-3.5" />More Filters</button>
      </div>

      {/* Table + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Table */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-4 border-b border-border-soft">
            <h3 className="text-[16px] font-semibold text-text-primary">All RFQs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E2E8F0]">
                  {["Request ID", "Customer", "Status", "Created Date", "Valid Until", "Total", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((q) => (
                  <tr key={q.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-3"><Link href={`/dashboard/quotes/${q.id}`} className="text-[13px] font-semibold text-[#3B82F6] hover:underline font-mono">{q.id}</Link></td>
                    <td className="px-4 py-3 text-[13px] font-medium text-text-primary whitespace-nowrap">{q.customer}</td>
                    <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                    <td className="px-4 py-3 text-[13px] text-text-body whitespace-nowrap">{formatDate(q.createdDate)}</td>
                    <td className="px-4 py-3 text-[13px] text-text-body whitespace-nowrap">{q.validUntil ? formatDate(q.validUntil) : "—"}</td>
                    <td className="px-4 py-3 text-[13px] text-text-primary">{formatCurrency(q.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(q)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-text-light hover:bg-[#EFF6FF] hover:text-[#3B82F6] transition-colors"
                          aria-label={`Edit ${q.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(q)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-text-light hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                          aria-label={`Delete ${q.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center">
                      <p className="text-[13px] text-text-muted">No RFQs match your filters.</p>
                      <button onClick={openCreate} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] hover:underline">
                        <Plus className="w-4 h-4" /> Create your first RFQ
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0]">
            <p className="text-[12px] text-text-muted">
              {filtered.length === 0
                ? "Showing 0 RFQs"
                : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} RFQs`}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F9FAFB] text-text-light hover:bg-[#F3F4F6] transition-colors disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-8 h-8 px-2.5 flex items-center justify-center rounded-md text-[13px] font-medium ${
                      p === currentPage
                        ? "bg-[#3B82F6] text-white"
                        : "text-text-body hover:bg-[#F3F4F6] transition-colors"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F9FAFB] text-text-light hover:bg-[#F3F4F6] transition-colors disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F9FAFB] border border-[#E2E8F0] rounded-md text-[12px] text-text-body hover:bg-[#F3F4F6] transition-colors">
                {pageSize} / page
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* RFQ Response Overview */}
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">RFQ Response Overview</h3>
            <div className="relative w-[140px] h-[140px] mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="11" />
                {segs.map((p, i) => {
                  const len = (p / 100) * circumference;
                  const prior = segs.slice(0, i).reduce((sum, x) => sum + x, 0);
                  return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={colors[i]} strokeWidth="11" strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-(prior / 100) * circumference} />;
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[10px] text-text-light leading-tight">Avg.<br />Response Rate</p>
                  <p className="text-[20px] font-bold text-text-primary">62%</p>
                </div>
              </div>
            </div>
            <div className="space-y-2.5 mt-5">
              {responseLegend.map((l) => (
                <div key={l.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                    <span className="text-text-body truncate">{l.name}</span>
                  </div>
                  <span className="text-text-primary shrink-0 ml-2 font-medium">{l.count} <span className="text-text-light font-normal">({l.pct})</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Pending Approvals</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center shrink-0"><Clock className="w-[18px] h-[18px] text-[#F59E0B]" /></div>
                <div className="flex-1"><p className="text-[13px] text-text-primary font-medium">Awaiting Your Approval</p></div>
                <span className="text-[13px] font-semibold text-text-primary">6 RFQs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0"><AlertCircle className="w-[18px] h-[18px] text-[#EF4444]" /></div>
                <div className="flex-1"><p className="text-[13px] text-text-primary font-medium">Overdue Approvals</p></div>
                <span className="text-[13px] font-semibold text-text-primary">2 RFQs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00B894]/10 flex items-center justify-center shrink-0"><Wallet className="w-[18px] h-[18px] text-[#00B894]" /></div>
                <div className="flex-1"><p className="text-[13px] text-text-primary font-medium">Total Value in Bid</p></div>
                <span className="text-[13px] font-semibold text-text-primary">$48,620.00</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 bg-[#3B82F6] text-white rounded-lg text-[13px] font-semibold hover:bg-[#2563EB] transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.1)]">View All Approvals</button>
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.id}` : "New RFQ"}
        description={editing ? "Update the quote details below." : "Create a new request for quotation."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveQuote} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create RFQ"}
            </PrimaryButton>
          </>
        }
      >
        <QuoteFields draft={draft} set={(d) => setDraft((prev) => ({ ...prev, ...d }))} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete RFQ"
        message={`Are you sure you want to delete ${deleting?.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
