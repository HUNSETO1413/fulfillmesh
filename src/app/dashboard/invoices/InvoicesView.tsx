"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  Plus,
  Search,
  ChevronDown,
  Calendar,
  SlidersHorizontal,
  Pencil,
  Trash2,
  FileText,
  Download,
  Send,
  Receipt,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  Clock,
  Wallet,
  ChevronUp,
  ArrowUpDown,
  MoreVertical,
  Eye,
} from "lucide-react";
import type { Invoice, InvoiceStatus } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

const STATUSES: InvoiceStatus[] = ["Draft", "Sent", "Paid", "Overdue", "Void"];

type Draft = {
  customer: string;
  orderId: string;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  amount: string;
};

const emptyDraft: Draft = {
  customer: "", orderId: "", status: "Draft",
  issuedDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date().toISOString().slice(0, 10), amount: "",
};

function InvoiceFields({ draft, set }: { draft: Draft; set: (d: Partial<Draft>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Field label="Customer" required>
          <TextInput value={draft.customer} onChange={(e) => set({ customer: e.target.value })} placeholder="Acme Retail" />
        </Field>
      </div>
      <Field label="Order / PO #">
        <TextInput value={draft.orderId} onChange={(e) => set({ orderId: e.target.value })} placeholder="ORD-1024" />
      </Field>
      <Field label="Status">
        <Select options={STATUSES} value={draft.status} onChange={(e) => set({ status: e.target.value as InvoiceStatus })} />
      </Field>
      <Field label="Issued date">
        <TextInput type="date" value={draft.issuedDate} onChange={(e) => set({ issuedDate: e.target.value })} />
      </Field>
      <Field label="Due date">
        <TextInput type="date" value={draft.dueDate} onChange={(e) => set({ dueDate: e.target.value })} />
      </Field>
      <div className="col-span-2">
        <Field label="Amount (USD)">
          <NumberInput value={draft.amount} onChange={(e) => set({ amount: e.target.value })} placeholder="0.00" step="0.01" min="0" />
        </Field>
      </div>
    </div>
  );
}

/* stats computed inside component from items */

const tabs: { label: string; status: string | null }[] = [
  { label: "All Invoices", status: null },
  { label: "Draft", status: "Draft" },
  { label: "Sent", status: "Sent" },
  { label: "Paid", status: "Paid" },
  { label: "Overdue", status: "Overdue" },
  { label: "Void", status: "Void" },
];

const aging = [
  { label: "Current", value: "$10,000", pct: 41, color: "#10B981" },
  { label: "1–30 Days", value: "$6,148", pct: 25, color: "#3B82F6" },
  { label: "31–60 Days", value: "$4,000", pct: 16, color: "#F59E0B" },
  { label: "61–90 Days", value: "$2,700", pct: 11, color: "#EF4444" },
  { label: "90+ Days", value: "$1,720", pct: 7, color: "#8B5CF6" },
];

const recentPayments = [
  { id: "PAY-2025-0312", date: "May 24, 2025", amount: "$4,310.00" },
  { id: "PAY-2025-0311", date: "May 23, 2025", amount: "$3,250.75" },
  { id: "PAY-2025-0310", date: "May 21, 2025", amount: "$5,760.00" },
  { id: "PAY-2025-0308", date: "May 19, 2025", amount: "$1,560.00" },
];

const byStatus = [
  { label: "Paid", value: "32 (82%)", pct: 82, color: "#10B981" },
  { label: "Pending", value: "5 (13%)", pct: 13, color: "#3B82F6" },
  { label: "Overdue", value: "2 (5%)", pct: 5, color: "#EF4444" },
];

const statement = [
  { label: "Opening Balance (May 1, 2025)", value: "$13,240.00" },
  { label: "Invoices", value: "$38,916.25" },
  { label: "Payments", value: "−$26,868.00" },
  { label: "Credits / Adjustments", value: "−$0.00" },
];

const quickActions = [
  { label: "Make a Payment", icon: CreditCard },
  { label: "Download Statement", icon: Download },
  { label: "View Credit Notes", icon: Receipt },
  { label: "Billing Settings", icon: SlidersHorizontal },
  { label: "Request Invoice", icon: Send },
];

const PAYMENT_METHODS = ["Visa ending in 4242", "Mastercard ending in 5555"];

const INVOICE_CSV_COLUMNS: { key: keyof Invoice; header: string }[] = [
  { key: "id", header: "Invoice #" },
  { key: "customer", header: "Customer" },
  { key: "orderId", header: "PO / Reference" },
  { key: "status", header: "Status" },
  { key: "issuedDate", header: "Invoice Date" },
  { key: "dueDate", header: "Due Date" },
  { key: "amount", header: "Amount" },
];

export default function InvoicesView({ items }: { items: Invoice[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [active, setActive] = useState("All Invoices");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  // sorting
  type SortKey = "id" | "orderId" | "status" | "issuedDate" | "dueDate" | "amount";
  const [sortKey, setSortKey] = useState<SortKey>("issuedDate");
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
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<Invoice | null>(null);

  // computed stats from items
  const stats = useMemo(() => {
    const outstanding = items.filter((i) => i.status === "Sent" || i.status === "Overdue");
    const paid = items.filter((i) => i.status === "Paid");
    const overdue = items.filter((i) => i.status === "Overdue");
    const sent = items.filter((i) => i.status === "Sent");
    const outTotal = outstanding.reduce((s, i) => s + i.amount, 0);
    const paidTotal = paid.reduce((s, i) => s + i.amount, 0);
    const overdueTotal = overdue.reduce((s, i) => s + i.amount, 0);
    const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return [
      { title: "Total Outstanding", value: fmt(outTotal), sub: `${outstanding.length} invoices`, color: "#3B82F6", icon: DollarSign },
      { title: "Total Paid (This Year)", value: fmt(paidTotal), sub: `${paid.length} invoices`, color: "#10B981", icon: CheckCircle2 },
      { title: "Overdue Amount", value: fmt(overdueTotal), sub: `${overdue.length} invoices`, color: "#EF4444", icon: AlertTriangle },
      { title: "Due Soon", value: fmt(sent.reduce((s, i) => s + i.amount, 0)), sub: `${sent.length} invoices`, color: "#F59E0B", icon: Clock },
      { title: "Credit Balance", value: "$1,250.00", sub: "Available Credit", color: "#8B5CF6", icon: Wallet },
    ];
  }, [items]);

  // per-row action menu + read-only view
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Invoice | null>(null);

  // account statement modal
  const [statementOpen, setStatementOpen] = useState(false);

  // AutoPay
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [autoPayMethod, setAutoPayMethod] = useState(PAYMENT_METHODS[0]);
  const [autoPayOpen, setAutoPayOpen] = useState(false);
  const [autoPayDraft, setAutoPayDraft] = useState(PAYMENT_METHODS[0]);

  const tableRef = useRef<HTMLDivElement | null>(null);

  const circumference = 2 * Math.PI * 40;

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const inv of items) map[inv.status] = (map[inv.status] ?? 0) + 1;
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const tab = tabs.find((t) => t.label === active);
    return items.filter((inv) => {
      const matchesTab = !tab?.status || inv.status === tab.status;
      const term = query.trim().toLowerCase();
      const matchesQuery =
        !term ||
        inv.id.toLowerCase().includes(term) ||
        inv.customer.toLowerCase().includes(term) ||
        (inv.orderId ?? "").toLowerCase().includes(term);
      return matchesTab && matchesQuery;
    });
  }, [items, active, query]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "amount") {
        av = a.amount; bv = b.amount;
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
        await api.del(`/api/invoices/${id}`);
      }
      toast(`Deleted ${selected.size} invoice${selected.size === 1 ? "" : "s"}`);
      setSelected(new Set());
      setBulkDeleting(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete invoices", "error");
    } finally {
      setBusy(false);
    }
  }

  function exportSelected() {
    exportToCsv("invoices-selected", selectedRows, INVOICE_CSV_COLUMNS);
    toast(`Exported ${selectedRows.length} selected invoices to CSV`);
  }

  const sortIcon = (k: SortKey) =>
    sortKey !== k
      ? <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
      : <ChevronUp className={`w-3.5 h-3.5 text-[#3B82F6] transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} />;

  function selectTab(label: string) {
    setActive(label);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(inv: Invoice) {
    setEditing(inv);
    setDraft({
      customer: inv.customer,
      orderId: inv.orderId ?? "",
      status: inv.status,
      issuedDate: inv.issuedDate,
      dueDate: inv.dueDate,
      amount: String(inv.amount),
    });
    setFormOpen(true);
  }

  async function saveInvoice() {
    if (!draft.customer.trim()) {
      toast("Customer is required", "error");
      return;
    }
    setBusy(true);
    const payload = {
      customer: draft.customer.trim(),
      orderId: draft.orderId.trim() || undefined,
      status: draft.status,
      issuedDate: draft.issuedDate,
      dueDate: draft.dueDate,
      amount: Number(draft.amount) || 0,
    };
    try {
      if (editing) {
        await api.put(`/api/invoices/${editing.id}`, payload);
        toast(`Invoice ${editing.id} updated`);
      } else {
        const created = await api.post<Invoice>("/api/invoices", payload);
        toast(`Invoice ${created.id} created`);
      }
      setFormOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save invoice", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.del(`/api/invoices/${deleting.id}`);
      toast(`Invoice ${deleting.id} deleted`);
      setDeleting(null);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete invoice", "error");
    } finally {
      setBusy(false);
    }
  }

  async function markPaid(inv: Invoice) {
    setBusy(true);
    try {
      await api.put(`/api/invoices/${inv.id}`, { status: "Paid" });
      toast(`Invoice ${inv.id} marked paid`);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update invoice", "error");
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    exportToCsv("invoices", filtered, INVOICE_CSV_COLUMNS);
    toast(`Exported ${filtered.length} invoices to CSV`);
  }

  function downloadInvoice(inv: Invoice) {
    exportToCsv(`invoice-${inv.id}`, [inv], INVOICE_CSV_COLUMNS);
    toast(`Invoice ${inv.id} downloaded`);
  }

  // ---- Account statement ----
  const statementRows = useMemo(
    () => [...items].sort((a, b) => a.issuedDate.localeCompare(b.issuedDate)),
    [items],
  );

  const statementTotals = useMemo(() => {
    const invoiced = items.reduce((sum, i) => sum + i.amount, 0);
    const paid = items.filter((i) => i.status === "Paid").reduce((sum, i) => sum + i.amount, 0);
    const outstanding = items
      .filter((i) => i.status === "Sent" || i.status === "Overdue")
      .reduce((sum, i) => sum + i.amount, 0);
    return { invoiced, paid, outstanding };
  }, [items]);

  function exportStatement() {
    exportToCsv("account-statement", statementRows, INVOICE_CSV_COLUMNS);
    toast(`Exported statement of ${statementRows.length} invoices to CSV`);
  }

  // Switch the main table to a status tab and bring it into view.
  function showStatusInTable(label: string) {
    selectTab(label);
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---- AutoPay ----
  function openAutoPay() {
    setAutoPayDraft(autoPayMethod);
    setAutoPayOpen(true);
  }

  function confirmAutoPay() {
    setAutoPayMethod(autoPayDraft);
    setAutoPayOpen(false);
    if (autoPayEnabled) {
      toast(`AutoPay updated — paying with ${autoPayDraft}`);
    } else {
      setAutoPayEnabled(true);
      toast(`AutoPay enabled — invoices will be paid with ${autoPayDraft}`);
    }
  }

  function disableAutoPay() {
    setAutoPayEnabled(false);
    setAutoPayOpen(false);
    toast("AutoPay disabled");
  }

  function runQuickAction(label: string) {
    switch (label) {
      case "Make a Payment":
        showStatusInTable("Overdue");
        toast("Showing invoices awaiting payment");
        break;
      case "Download Statement":
        exportStatement();
        break;
      case "View Credit Notes":
        setStatementOpen(true);
        break;
      case "Billing Settings":
        openAutoPay();
        break;
      case "Request Invoice":
        openCreate();
        break;
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#1E293B]">Invoices / Payments</h1>
          <p className="text-[14px] text-[#64748B] mt-1">View, manage, and pay your invoices and track payment history.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#3B82F6] rounded-lg text-[13px] font-medium text-white hover:bg-[#2563EB] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#64748B]">{s.title}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}1A` }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-[22px] font-bold text-[#1E293B] leading-none">{s.value}</p>
              <p className="text-[12px] text-[#94A3B8] mt-1.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search invoices by invoice #, PO #, or reference..."
            className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setStatusOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]"
          >
            {active === "All Invoices" ? "All Statuses" : active} <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {statusOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
              <div className="absolute left-0 mt-1 z-20 w-44 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1">
                {tabs.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => { selectTab(t.label); setStatusOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${active === t.label ? "text-[#3B82F6] font-medium" : "text-[#64748B]"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setDateOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]"
          >
            <Calendar className="w-4 h-4" /> May 1 – May 31, 2025 <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {dateOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDateOpen(false)} />
              <div className="absolute left-0 mt-1 z-20 w-44 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1">
                {["Last 7 days", "Last 30 days", "This quarter", "Year to date"].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setDateOpen(false); toast(`Date range: ${r}`); }}
                    className="w-full text-left px-3 py-1.5 text-[13px] text-[#64748B] hover:bg-[#F8FAFC]"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <button onClick={() => toast("More filters coming soon")} className="inline-flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
        </button>
      </div>

      {/* Main: table + right rail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-4">
        {/* Table card */}
        <div ref={tableRef} className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] scroll-mt-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 border-b border-[#E2E8F0] overflow-x-auto">
            {tabs.map((t) => {
              const count = t.status === null ? items.length : counts[t.status] ?? 0;
              return (
                <button
                  key={t.label}
                  onClick={() => selectTab(t.label)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-[13px] font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                    active === t.label ? "border-[#3B82F6] text-[#3B82F6]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"
                  }`}
                >
                  {t.label}
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${active === t.label ? "bg-[#3B82F6]/10 text-[#3B82F6]" : "bg-[#F1F5F9] text-[#94A3B8]"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {selected.size > 0 && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#EFF6FF] border-b border-[#BFDBFE]">
              <span className="text-[13px] font-medium text-[#1D4ED8]">{selected.size} selected</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportSelected}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#BFDBFE] rounded-lg text-[13px] text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export selected
                </button>
                <button
                  onClick={() => setBulkDeleting(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] rounded-lg text-[13px] font-medium text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete selected
                </button>
                <button
                  onClick={() => setSelected(new Set())}
                  className="px-2 py-1.5 text-[13px] text-[#64748B] hover:text-[#1E293B]"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all on page"
                      className="w-4 h-4 rounded border-[#D1D5DB] text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer"
                    />
                  </th>
                  <th className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 text-left">
                    <button onClick={() => toggleSort("id")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Invoice # {sortIcon("id")}</button>
                  </th>
                  <th className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 text-left">
                    <button onClick={() => toggleSort("orderId")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">PO / Reference {sortIcon("orderId")}</button>
                  </th>
                  <th className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 text-left">
                    <button onClick={() => toggleSort("issuedDate")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Invoice Date {sortIcon("issuedDate")}</button>
                  </th>
                  <th className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 text-left">
                    <button onClick={() => toggleSort("dueDate")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Due Date {sortIcon("dueDate")}</button>
                  </th>
                  <th className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 text-left">
                    <button onClick={() => toggleSort("amount")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Amount {sortIcon("amount")}</button>
                  </th>
                  <th className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 text-left">
                    <button onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 hover:text-[#3B82F6]">Status {sortIcon("status")}</button>
                  </th>
                  <th className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/60 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(inv.id)}
                        onChange={() => toggleRow(inv.id)}
                        aria-label={`Select ${inv.id}`}
                        className="w-4 h-4 rounded border-[#D1D5DB] text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#EF4444] shrink-0" />
                        <span className="text-[13px] font-medium text-[#3B82F6] font-mono">{inv.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B] font-mono">{inv.orderId ?? "—"}</td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{formatDate(inv.issuedDate)}</td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{formatDate(inv.dueDate)}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#1E293B]">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(inv)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-[#94A3B8] hover:bg-[#EFF6FF] hover:text-[#3B82F6] transition-colors"
                          aria-label={`Edit ${inv.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setMenuFor(menuFor === inv.id ? null : inv.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors"
                            aria-label={`Actions for ${inv.id}`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {menuFor === inv.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                              <div className="absolute right-0 mt-1 z-20 w-40 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1">
                                <button
                                  onClick={() => { setMenuFor(null); setViewing(inv); }}
                                  className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-[13px] text-[#1E293B] hover:bg-[#F8FAFC]"
                                >
                                  <Eye className="w-3.5 h-3.5 text-[#94A3B8]" /> View
                                </button>
                                {(inv.status === "Overdue" || inv.status === "Sent") && (
                                  <button
                                    onClick={() => { setMenuFor(null); markPaid(inv); }}
                                    disabled={busy}
                                    className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-[13px] text-[#1E293B] hover:bg-[#F8FAFC] disabled:opacity-50"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Mark Paid
                                  </button>
                                )}
                                <button
                                  onClick={() => { setMenuFor(null); downloadInvoice(inv); }}
                                  className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-[13px] text-[#1E293B] hover:bg-[#F8FAFC]"
                                >
                                  <Download className="w-3.5 h-3.5 text-[#94A3B8]" /> Download
                                </button>
                                <button
                                  onClick={() => { setMenuFor(null); setDeleting(inv); }}
                                  className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2]"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center">
                      <p className="text-[13px] text-[#64748B]">No invoices match your filters.</p>
                      <button onClick={openCreate} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] hover:underline">
                        <Plus className="w-4 h-4" /> Create your first invoice
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E2E8F0]">
            <p className="text-[12px] text-[#64748B]">
              {filtered.length === 0
                ? "Showing 0 invoices"
                : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} invoices`}
            </p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setPageSizeOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[#E2E8F0] rounded-md text-[12px] text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  {pageSize} / page
                  <ChevronDown className="w-3 h-3" />
                </button>
                {pageSizeOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setPageSizeOpen(false)} />
                    <div className="absolute right-0 bottom-full mb-1 z-20 w-32 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1">
                      {[8, 10, 20, 50].map((n) => (
                        <button
                          key={n}
                          onClick={() => { setPageSize(n); setPage(1); setPageSizeOpen(false); }}
                          className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#F8FAFC] ${n === pageSize ? "text-[#3B82F6] font-medium" : "text-[#64748B]"}`}
                        >
                          {n} / page
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#94A3B8] disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium ${
                      p === currentPage
                        ? "bg-[#3B82F6] text-white"
                        : "border border-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#64748B] disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          {/* Aging Summary */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Aging Summary</h3>
            <div className="flex justify-center mb-4">
              <div className="relative w-[140px] h-[140px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="11" />
                  {aging.map((a, i) => {
                    const len = (a.pct / 100) * circumference;
                    const prior = aging.slice(0, i).reduce((sum, x) => sum + x.pct, 0);
                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={a.color}
                        strokeWidth="11"
                        strokeDasharray={`${len} ${circumference - len}`}
                        strokeDashoffset={-(prior / 100) * circumference}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[16px] font-bold text-[#1E293B]">$24,568.75</p>
                  <p className="text-[10px] text-[#94A3B8]">Total Outstanding</p>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              {aging.map((a) => (
                <div key={a.label} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                    <span className="text-[#64748B]">{a.label}</span>
                  </div>
                  <span className="font-medium text-[#1E293B]">{a.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[#1E293B]">Recent Payments</h3>
              <button onClick={() => showStatusInTable("Paid")} className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-[#3B82F6]">{p.id}</p>
                    <p className="text-[11px] text-[#94A3B8]">{p.date}</p>
                  </div>
                  <span className="text-[13px] font-semibold text-[#10B981]">{p.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-6 rounded bg-[#1A1F71] flex items-center justify-center text-white text-[9px] font-bold italic">VISA</div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-[#1E293B]">Visa ending in 4242</p>
                  <p className="text-[11px] text-[#94A3B8]">Expires 09/26</p>
                </div>
                <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded bg-[#10B981]/10 text-[#10B981]">Default</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-6 rounded bg-[#EB001B] flex items-center justify-center text-white text-[8px] font-bold">MC</div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-[#1E293B]">Mastercard ending in 5555</p>
                  <p className="text-[11px] text-[#94A3B8]">Expires 06/27</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: by status + statement + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-4">
        {/* Invoices by Status */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Invoices by Status</h3>
          <div className="flex items-center gap-5">
            <div className="relative w-[110px] h-[110px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="11" />
                {byStatus.map((b, i) => {
                  const len = (b.pct / 100) * circumference;
                  const prior = byStatus.slice(0, i).reduce((sum, x) => sum + x.pct, 0);
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={b.color}
                      strokeWidth="11"
                      strokeDasharray={`${len} ${circumference - len}`}
                      strokeDashoffset={-(prior / 100) * circumference}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[16px] font-bold text-[#1E293B]">39</p>
                <p className="text-[10px] text-[#94A3B8]">Total</p>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {byStatus.map((b) => (
                <div key={b.label} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                    <span className="text-[#64748B]">{b.label}</span>
                  </div>
                  <span className="font-medium text-[#1E293B]">{b.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Statement */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-[#1E293B]">Account Statement</h3>
            <button onClick={() => setStatementOpen(true)} className="text-[12px] font-medium text-[#3B82F6] hover:underline">View full statement</button>
          </div>
          <div className="space-y-2.5">
            {statement.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748B]">{s.label}</span>
                <span className="font-medium text-[#1E293B]">{s.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#1E293B]">Closing Balance (May 31, 2025)</span>
              <span className="text-[14px] font-bold text-[#EF4444]">$24,568.75</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="text-[15px] font-semibold text-[#1E293B] mb-4">Quick Actions</h3>
          <div className="space-y-1">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button key={a.label} onClick={() => runQuickAction(a.label)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                  <Icon className="w-4 h-4 text-[#94A3B8]" /> {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AutoPay band */}
      <div className="bg-[#061A3D] rounded-xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${autoPayEnabled ? "bg-[#10B981]/20" : "bg-white/10"}`}>
            {autoPayEnabled ? <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> : <CreditCard className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">
              {autoPayEnabled ? "AutoPay is enabled" : "Set up Autopay and never miss a payment"}
            </h3>
            <p className="text-[12px] text-white/60 mt-0.5">
              {autoPayEnabled
                ? `Invoices are paid automatically on the due date using ${autoPayMethod}.`
                : "Automatically pay your invoices on the due date using your default payment method."}
            </p>
          </div>
        </div>
        <button onClick={openAutoPay} className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-[#003B7A] hover:bg-white/90 shrink-0">
          {autoPayEnabled ? (
            <><SlidersHorizontal className="w-4 h-4" /> Manage</>
          ) : (
            <><CheckCircle2 className="w-4 h-4" /> Enable AutoPay</>
          )}
        </button>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.id}` : "New Invoice"}
        description={editing ? "Update the invoice details below." : "Create a new invoice in your workspace."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveInvoice} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create invoice"}
            </PrimaryButton>
          </>
        }
      >
        <InvoiceFields draft={draft} set={(d) => setDraft((prev) => ({ ...prev, ...d }))} />
      </Modal>

      {/* View invoice modal */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.id ?? ""}
        description="Invoice details"
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setViewing(null)}>Close</SecondaryButton>
            <PrimaryButton onClick={() => { if (viewing) downloadInvoice(viewing); }}>Download</PrimaryButton>
          </>
        }
      >
        {viewing && (
          <div className="space-y-3">
            {[
              { label: "Customer", value: viewing.customer },
              { label: "PO / Reference", value: viewing.orderId ?? "—" },
              { label: "Invoice date", value: formatDate(viewing.issuedDate) },
              { label: "Due date", value: formatDate(viewing.dueDate) },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748B]">{row.label}</span>
                <span className="font-medium text-[#1E293B]">{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#64748B]">Status</span>
              <StatusBadge status={viewing.status} />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#1E293B]">Amount</span>
              <span className="text-[15px] font-bold text-[#1E293B]">{formatCurrency(viewing.amount)}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Account statement modal */}
      <Modal
        open={statementOpen}
        onClose={() => setStatementOpen(false)}
        title="Account Statement"
        description="All invoices on your account, including payments and credits."
        size="lg"
        footer={
          <>
            <SecondaryButton onClick={() => setStatementOpen(false)}>Close</SecondaryButton>
            <PrimaryButton onClick={exportStatement}>Export statement</PrimaryButton>
          </>
        }
      >
        <div className="space-y-1">
          {statementRows.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-[#F8FAFC] transition-colors">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[#3B82F6] font-mono">{inv.id}</p>
                <p className="text-[11px] text-[#94A3B8]">
                  {inv.customer} · issued {formatDate(inv.issuedDate)} · due {formatDate(inv.dueDate)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={inv.status} />
                <span className="text-[13px] font-semibold text-[#1E293B] w-24 text-right">{formatCurrency(inv.amount)}</span>
              </div>
            </div>
          ))}
          {statementRows.length === 0 && (
            <p className="text-[13px] text-[#64748B] text-center py-6">No invoices on this statement.</p>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#64748B]">Total invoiced</span>
            <span className="font-medium text-[#1E293B]">{formatCurrency(statementTotals.invoiced)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#64748B]">Payments received</span>
            <span className="font-medium text-[#10B981]">−{formatCurrency(statementTotals.paid)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-semibold text-[#1E293B]">Outstanding balance</span>
            <span className="font-bold text-[#EF4444]">{formatCurrency(statementTotals.outstanding)}</span>
          </div>
        </div>
      </Modal>

      {/* AutoPay modal */}
      <Modal
        open={autoPayOpen}
        onClose={() => setAutoPayOpen(false)}
        title={autoPayEnabled ? "Manage AutoPay" : "Enable AutoPay"}
        description="Invoices will be paid automatically on their due date using the selected payment method."
        size="sm"
        footer={
          <>
            {autoPayEnabled ? (
              <SecondaryButton onClick={disableAutoPay} className="text-[#EF4444] border-[#FECACA] hover:bg-[#FEF2F2]">
                Turn off AutoPay
              </SecondaryButton>
            ) : (
              <SecondaryButton onClick={() => setAutoPayOpen(false)}>Cancel</SecondaryButton>
            )}
            <PrimaryButton onClick={confirmAutoPay}>
              {autoPayEnabled ? "Save changes" : "Enable AutoPay"}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m}
              className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg cursor-pointer transition-colors ${
                autoPayDraft === m ? "border-[#3B82F6] bg-[#EFF6FF]" : "border-[#E2E8F0] hover:bg-[#F8FAFC]"
              }`}
            >
              <input
                type="radio"
                name="autopay-method"
                checked={autoPayDraft === m}
                onChange={() => setAutoPayDraft(m)}
                className="w-4 h-4 border-[#D1D5DB] text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              <CreditCard className="w-4 h-4 text-[#94A3B8]" />
              <span className="text-[13px] font-medium text-[#1E293B]">{m}</span>
            </label>
          ))}
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete invoice"
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
        title="Delete selected invoices"
        message={`Are you sure you want to delete ${selected.size} invoice${selected.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel={`Delete ${selected.size}`}
        destructive
        loading={busy}
      />
    </div>
  );
}
