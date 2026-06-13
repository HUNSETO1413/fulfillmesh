"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Calendar,
  Plus,
  Download,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  ChevronUp,
  ArrowUpDown,
} from "lucide-react";
import type { Customer } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatNumber } from "@/lib/format";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

const tabs = ["All Customers", "Active", "Inactive", "Lead"];

const accentColor = "#0057D8";

const STATUSES: Customer["status"][] = ["Active", "Inactive", "Lead"];

// The demo workspace anchors "today" to the end of the header range so the
// joined-date filter stays deterministic.
const REF_DATE = new Date("2025-05-18T12:00:00Z");
const JOIN_RANGES = ["All Time", "This year", "Last 12 months", "Last 24 months"];

function joinRangeStart(range: string): Date | null {
  const start = new Date(REF_DATE);
  switch (range) {
    case "This year":
      return new Date("2025-01-01T00:00:00Z");
    case "Last 12 months":
      start.setUTCFullYear(start.getUTCFullYear() - 1);
      return start;
    case "Last 24 months":
      start.setUTCFullYear(start.getUTCFullYear() - 2);
      return start;
    default:
      return null;
  }
}

function joinedInRange(joined: string | undefined, range: string): boolean {
  const start = joinRangeStart(range);
  if (!start) return true;
  if (!joined) return false;
  return new Date(`${joined}T12:00:00Z`) >= start;
}

type Draft = {
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  orders: string;
  totalSpent: string;
  status: Customer["status"];
  joinedDate: string;
};

const emptyDraft: Draft = {
  name: "", email: "", company: "", phone: "", country: "",
  orders: "0", totalSpent: "0", status: "Active",
  joinedDate: new Date().toISOString().slice(0, 10),
};

function CustomerFields({ draft, set }: { draft: Draft; set: (d: Partial<Draft>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Name" required>
        <TextInput value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="Jane Doe" />
      </Field>
      <Field label="Email" required>
        <TextInput type="email" value={draft.email} onChange={(e) => set({ email: e.target.value })} placeholder="jane@acme.com" />
      </Field>
      <Field label="Company">
        <TextInput value={draft.company} onChange={(e) => set({ company: e.target.value })} placeholder="Acme Retail" />
      </Field>
      <Field label="Phone">
        <TextInput value={draft.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+1 (555) 010-0199" />
      </Field>
      <Field label="Country">
        <TextInput value={draft.country} onChange={(e) => set({ country: e.target.value })} placeholder="United States" />
      </Field>
      <Field label="Status">
        <Select options={STATUSES} value={draft.status} onChange={(e) => set({ status: e.target.value as Customer["status"] })} />
      </Field>
      <Field label="Orders">
        <NumberInput value={draft.orders} onChange={(e) => set({ orders: e.target.value })} min="0" step="1" />
      </Field>
      <Field label="Total Spent (USD)">
        <NumberInput value={draft.totalSpent} onChange={(e) => set({ totalSpent: e.target.value })} min="0" step="0.01" />
      </Field>
      <div className="col-span-2">
        <Field label="Joined date">
          <TextInput type="date" value={draft.joinedDate} onChange={(e) => set({ joinedDate: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}

export default function CustomersView({ items }: { items: Customer[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Customers");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [joinRange, setJoinRange] = useState("All Time");

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  // sorting
  type SortKey = "id" | "name" | "company" | "email" | "orders" | "totalSpent" | "status";
  const [sortKey, setSortKey] = useState<SortKey>("name");
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
  const [editing, setEditing] = useState<Customer | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<Customer | null>(null);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((c) => c.status === "Active").length;
    const leads = items.filter((c) => c.status === "Lead").length;
    const inactive = items.filter((c) => c.status === "Inactive").length;
    return [
      { title: "Total Customers", value: formatNumber(total), icon: Users, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
      { title: "Active Customers", value: formatNumber(active), icon: CheckCircle2, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
      { title: "Leads", value: formatNumber(leads), icon: Clock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
      { title: "Inactive", value: formatNumber(inactive), icon: ArrowUpRight, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
    ];
  }, [items]);

  const tabCounts = useMemo<Record<string, number>>(() => ({
    "All Customers": items.length,
    Active: items.filter((c) => c.status === "Active").length,
    Inactive: items.filter((c) => c.status === "Inactive").length,
    Lead: items.filter((c) => c.status === "Lead").length,
  }), [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((c) => {
      if (activeTab !== "All Customers" && c.status !== activeTab) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (!joinedInRange(c.joinedDate, joinRange)) return false;
      if (!q) return true;
      return (
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search, activeTab, statusFilter, joinRange]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const numericKeys: SortKey[] = ["orders", "totalSpent"];
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
        await api.del(`/api/customers/${id}`);
      }
      toast(`Deleted ${selected.size} customer${selected.size === 1 ? "" : "s"}`);
      setSelected(new Set());
      setBulkDeleting(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete customers", "error");
    } finally {
      setBusy(false);
    }
  }

  function exportSelected() {
    exportToCsv("customers-selected", selectedRows, [
      { key: "id", header: "Customer ID" },
      { key: "name", header: "Name" },
      { key: "company", header: "Company" },
      { key: "email", header: "Email" },
      { key: "phone", header: "Phone" },
      { key: "country", header: "Country" },
      { key: "orders", header: "Orders" },
      { key: "totalSpent", header: "Total Spent" },
      { key: "status", header: "Status" },
    ]);
    toast(`Exported ${selectedRows.length} selected customers to CSV`);
  }

  const sortIcon = (k: SortKey) =>
    sortKey !== k
      ? <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
      : <ChevronUp className={`w-3.5 h-3.5 text-[#0057D8] transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} />;

  function selectTab(tab: string) {
    setActiveTab(tab);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(c: Customer) {
    setEditing(c);
    setDraft({
      name: c.name, email: c.email, company: c.company ?? "", phone: c.phone ?? "",
      country: c.country ?? "", orders: String(c.orders), totalSpent: String(c.totalSpent),
      status: c.status, joinedDate: c.joinedDate ?? "",
    });
    setFormOpen(true);
  }

  async function saveCustomer() {
    if (!draft.name.trim()) { toast("Name is required", "error"); return; }
    if (!draft.email.trim()) { toast("Email is required", "error"); return; }
    setBusy(true);
    const payload = {
      name: draft.name.trim(),
      email: draft.email.trim(),
      company: draft.company.trim() || undefined,
      phone: draft.phone.trim() || undefined,
      country: draft.country.trim() || undefined,
      orders: Number(draft.orders) || 0,
      totalSpent: Number(draft.totalSpent) || 0,
      status: draft.status,
      joinedDate: draft.joinedDate || undefined,
    };
    try {
      if (editing) {
        await api.put(`/api/customers/${editing.id}`, payload);
        toast(`Customer ${editing.id} updated`);
      } else {
        const created = await api.post<Customer>("/api/customers", payload);
        toast(`Customer ${created.id} created`);
      }
      setFormOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save customer", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.del(`/api/customers/${deleting.id}`);
      toast(`Customer ${deleting.id} deleted`);
      setDeleting(null);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete customer", "error");
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    exportToCsv("customers", filtered, [
      { key: "id", header: "Customer ID" },
      { key: "name", header: "Name" },
      { key: "company", header: "Company" },
      { key: "email", header: "Email" },
      { key: "phone", header: "Phone" },
      { key: "country", header: "Country" },
      { key: "orders", header: "Orders" },
      { key: "totalSpent", header: "Total Spent" },
      { key: "status", header: "Status" },
    ]);
    toast(`Exported ${filtered.length} customers to CSV`);
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-deep-navy">Customers</h1>
          <p className="text-[14px] text-text-body mt-0.5">View and manage your customers.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setDateOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body hover:bg-soft-bg"
            >
              <Calendar className="w-4 h-4" />
              May 12 – May 18, 2025
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {dateOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDateOpen(false)} />
                <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-border-soft shadow-lg py-1">
                  {["Last 7 days", "Last 30 days", "This quarter", "Year to date"].map((r) => (
                    <button
                      key={r}
                      onClick={() => { setDateOpen(false); toast(`Date range: ${r}`); }}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-text-body hover:bg-soft-bg"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-text-muted">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-deep-navy leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5 text-teal" />
                <span className="text-[11px] text-text-light">across all customers</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => selectTab(t)}
              className={`px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                activeTab === t
                  ? "text-action-blue bg-action-blue/10"
                  : "text-text-muted hover:bg-[#F1F5F9]"
              }`}
            >
              {t}
              <span className={`ml-1.5 text-[11px] ${
                activeTab === t ? "text-action-blue/70" : "text-text-light"
              }`}>
                {tabCounts[t]}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-muted hover:bg-soft-bg">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-action-blue hover:bg-navy rounded-lg text-[13px] font-medium text-white transition-colors">
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-border-soft p-3 shadow-soft">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <input
              type="text"
              placeholder="Search customers by ID, name, or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-deep-navy placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[13px] transition-colors ${
                statusFilter ? "bg-action-blue/10 border-action-blue text-action-blue" : "border-border-soft text-text-muted hover:bg-soft-bg"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {statusFilter || "Filters"}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {filterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-border-soft shadow-lg py-1">
                  <p className="px-3 py-1.5 text-[11px] font-semibold text-text-light uppercase">Status</p>
                  <button
                    onClick={() => { setStatusFilter(""); setFilterOpen(false); setPage(1); }}
                    className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${!statusFilter ? "text-action-blue font-medium" : "text-text-body"}`}
                  >
                    All statuses
                  </button>
                  {STATUSES.map((st) => (
                    <button
                      key={st}
                      onClick={() => { setStatusFilter(st); setFilterOpen(false); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${statusFilter === st ? "text-action-blue font-medium" : "text-text-body"}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setRangeOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[13px] transition-colors ${
                joinRange !== "All Time" ? "bg-action-blue/10 border-action-blue text-action-blue" : "border-border-soft text-text-muted hover:bg-soft-bg"
              }`}
            >
              {joinRange}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {rangeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setRangeOpen(false)} />
                <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-border-soft shadow-lg py-1">
                  <p className="px-3 py-1.5 text-[11px] font-semibold text-text-light uppercase">Joined</p>
                  {JOIN_RANGES.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setJoinRange(r); setRangeOpen(false); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${joinRange === r ? "text-action-blue font-medium" : "text-text-body"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border-soft shadow-soft overflow-hidden">
        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-action-blue/10 border-b border-action-blue/20">
            <span className="text-[13px] font-medium text-action-blue">{selected.size} selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={exportSelected}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-action-blue/30 rounded-lg text-[13px] text-action-blue hover:bg-action-blue/5 transition-colors"
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
                className="px-2 py-1.5 text-[13px] text-text-muted hover:text-text-body"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "780px" }}>
            <thead>
              <tr className="bg-soft-bg border-b border-border-soft">
                <th className="w-10 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all on page"
                    className="w-4 h-4 rounded border-[#D1D5DB] text-[#0057D8] focus:ring-[#0057D8] cursor-pointer"
                  />
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("id")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Customer ID {sortIcon("id")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("name")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Customer Name {sortIcon("name")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("company")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Company {sortIcon("company")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("email")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Email {sortIcon("email")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("orders")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Orders {sortIcon("orders")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("totalSpent")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Total Spent {sortIcon("totalSpent")}</button>
                </th>
                <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  <button onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 hover:text-[#0057D8]">Status {sortIcon("status")}</button>
                </th>
                <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((c) => (
                <tr key={c.id} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleRow(c.id)}
                      aria-label={`Select ${c.id}`}
                      className="w-4 h-4 rounded border-[#D1D5DB] text-[#0057D8] focus:ring-[#0057D8] cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/customers/${c.id}`} className="text-[13px] font-semibold text-action-blue hover:underline font-mono">
                      {c.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                        style={{
                          backgroundColor: `${accentColor}14`,
                          color: accentColor,
                          boxShadow: `inset 0 0 0 1px ${accentColor}26`,
                        }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <span className="text-[13px] font-medium text-deep-navy">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-text-body">{c.company ?? "—"}</td>
                  <td className="px-5 py-3 text-[13px] text-text-body">{c.email}</td>
                  <td className="px-5 py-3 text-[13px] text-text-body">{formatNumber(c.orders)}</td>
                  <td className="px-5 py-3 text-[13px] text-deep-navy">{formatCurrency(c.totalSpent)}</td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-text-light hover:bg-[#EFF6FF] hover:text-action-blue transition-colors"
                        aria-label={`Edit ${c.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(c)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-text-light hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                        aria-label={`Delete ${c.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-[13px] text-text-muted">
                    No customers match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft">
          <p className="text-[12px] text-text-muted">
            {filtered.length === 0
              ? "Showing 0 customers"
              : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} customers`}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-light hover:bg-soft-bg disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium ${
                    p === currentPage
                      ? "bg-action-blue text-white"
                      : "border border-border-soft text-text-muted hover:bg-soft-bg"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-border-soft text-text-muted hover:bg-soft-bg disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setPageSizeOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-2 py-1 border border-border-soft rounded-md text-[12px] text-text-muted hover:bg-soft-bg"
              >
                {pageSize} / page
                <ChevronDown className="w-3 h-3" />
              </button>
              {pageSizeOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPageSizeOpen(false)} />
                  <div className="absolute right-0 bottom-full mb-1 z-20 w-28 bg-white rounded-lg border border-border-soft shadow-lg py-1">
                    {[8, 10, 20, 50].map((n) => (
                      <button
                        key={n}
                        onClick={() => { setPageSize(n); setPage(1); setPageSizeOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-soft-bg ${n === pageSize ? "text-action-blue font-medium" : "text-text-body"}`}
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
        title={editing ? `Edit ${editing.id}` : "Add Customer"}
        description={editing ? "Update the customer details below." : "Create a new customer in your workspace."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveCustomer} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create customer"}
            </PrimaryButton>
          </>
        }
      >
        <CustomerFields draft={draft} set={(d) => setDraft((prev) => ({ ...prev, ...d }))} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete customer"
        message={`Are you sure you want to delete ${deleting?.name ?? ""} (${deleting?.id ?? ""})? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        open={bulkDeleting}
        onClose={() => setBulkDeleting(false)}
        onConfirm={bulkDelete}
        title="Delete selected customers"
        message={`Are you sure you want to delete ${selected.size} customer${selected.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel={`Delete ${selected.size}`}
        destructive
        loading={busy}
      />
    </div>
  );
}
