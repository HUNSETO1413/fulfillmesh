"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users, CheckCircle2, Target, Clock, ArrowUpRight,
  Search, ChevronDown, Pencil, Trash2, Plus, Download, Calendar, Bell,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import type { Supplier, SupplierStatus } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatNumber } from "@/lib/format";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

const tabs = ["All Suppliers", "Active", "Pending", "Suspended"];

const STATUSES: SupplierStatus[] = ["Active", "Pending", "Suspended"];
const CATEGORIES = ["Electronics", "Home & Living", "Packaging", "Apparel", "Raw Materials", "Logistics"];

type Draft = {
  name: string;
  contact: string;
  email: string;
  country: string;
  category: string;
  rating: string;
  status: SupplierStatus;
  leadTimeDays: string;
  productsSupplied: string;
};

const emptyDraft: Draft = {
  name: "", contact: "", email: "", country: "", category: "Electronics",
  rating: "0", status: "Active", leadTimeDays: "", productsSupplied: "",
};

function SupplierFields({ draft, set }: { draft: Draft; set: (d: Partial<Draft>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Name" required>
        <TextInput value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="Shenzhen Components Co." />
      </Field>
      <Field label="Country" required>
        <TextInput value={draft.country} onChange={(e) => set({ country: e.target.value })} placeholder="China" />
      </Field>
      <Field label="Contact">
        <TextInput value={draft.contact} onChange={(e) => set({ contact: e.target.value })} placeholder="Li Wei" />
      </Field>
      <Field label="Email">
        <TextInput type="email" value={draft.email} onChange={(e) => set({ email: e.target.value })} placeholder="sales@supplier.com" />
      </Field>
      <Field label="Category">
        <Select options={CATEGORIES} value={draft.category} onChange={(e) => set({ category: e.target.value })} />
      </Field>
      <Field label="Status">
        <Select options={STATUSES} value={draft.status} onChange={(e) => set({ status: e.target.value as SupplierStatus })} />
      </Field>
      <Field label="Rating (0-5)">
        <NumberInput value={draft.rating} onChange={(e) => set({ rating: e.target.value })} min="0" max="5" step="0.1" />
      </Field>
      <Field label="Lead Time (days)">
        <NumberInput value={draft.leadTimeDays} onChange={(e) => set({ leadTimeDays: e.target.value })} min="0" step="1" placeholder="e.g. 7" />
      </Field>
      <div className="col-span-2">
        <Field label="Products Supplied">
          <NumberInput value={draft.productsSupplied} onChange={(e) => set({ productsSupplied: e.target.value })} min="0" step="1" placeholder="e.g. 120" />
        </Field>
      </div>
    </div>
  );
}

const categoryColor: Record<string, string> = {
  "Electronics": "#0057D8",
  "Home & Living": "#00B894",
  "Packaging": "#F59E0B",
  "Apparel": "#7C6FF6",
  "Raw Materials": "#EC4899",
  "Logistics": "#06B6D4",
};

const palette = ["#0057D8", "#00B894", "#F59E0B", "#7C6FF6", "#EC4899", "#06B6D4", "#D9E5F2"];

// Match-score derived from the 0-5 rating so the existing score visuals keep working.
function ratingScore(rating: number): number {
  return Math.round((rating / 5) * 100);
}

function scoreColor(score: number): string {
  if (score >= 85) return "#00B894";
  if (score >= 75) return "#0057D8";
  if (score >= 65) return "#F59E0B";
  return "#9AA8B8";
}

const onTimePts = [60, 45, 62, 50, 70, 58, 75];
const onTimeDates = ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"];

function PerfRing({ pct }: { pct: number }) {
  const c = 2 * Math.PI * 14;
  const len = (pct / 100) * c;
  const stroke = pct >= 90 ? "#00B894" : pct >= 80 ? "#0057D8" : "#F59E0B";
  return (
    <div className="relative w-9 h-9">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="14" fill="none" stroke="#E6EDF5" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="14" fill="none" stroke={stroke} strokeWidth="2.5" strokeDasharray={`${len} ${c - len}`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-deep-navy">{pct}%</span>
    </div>
  );
}

export default function SuppliersView({ items }: { items: Supplier[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [tab, setTab] = useState("All Suppliers");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const circumference = 2 * Math.PI * 38;

  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  // create / edit
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<Supplier | null>(null);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((s) => s.status === "Active").length;
    const avgRating = total > 0 ? items.reduce((sum, s) => sum + s.rating, 0) / total : 0;
    const avgScore = total > 0 ? Math.round(items.reduce((sum, s) => sum + ratingScore(s.rating), 0) / total) : 0;
    return [
      { title: "Total Suppliers", value: formatNumber(total), change: "all partners", icon: Users, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
      { title: "Active Suppliers", value: formatNumber(active), change: "currently active", icon: CheckCircle2, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
      { title: "Avg Match Score", value: String(avgScore), change: "from ratings", icon: Target, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
      { title: "Avg Rating", value: avgRating.toFixed(1), change: "out of 5.0", icon: Clock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
    ];
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((s) => {
      if (tab !== "All Suppliers" && s.status !== tab) return false;
      if (categoryFilter && (s.category ?? "") !== categoryFilter) return false;
      if (!q) return true;
      return (
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.email ?? "").toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        (s.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, tab, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  // Sidebar category breakdown computed from real data.
  const categories = useMemo(() => {
    const total = items.length || 1;
    const counts = new Map<string, number>();
    for (const s of items) {
      const key = s.category ?? "Other";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count], i) => ({
        name,
        pct: Math.round((count / total) * 1000) / 10,
        color: categoryColor[name] ?? palette[i % palette.length],
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [items]);

  const topRated = useMemo(
    () =>
      [...items]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)
        .map((s) => ({ name: s.name, score: ratingScore(s.rating) })),
    [items],
  );

  // Precompute the cumulative offset for each donut segment without mutating
  // a render-scoped variable (React Compiler immutability rule).
  const donutSegments = useMemo(
    () =>
      categories.map((c, i) => ({
        ...c,
        offset: categories.slice(0, i).reduce((sum, p) => sum + p.pct, 0),
      })),
    [categories],
  );

  function selectTab(t: string) {
    setTab(t);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(s: Supplier) {
    setEditing(s);
    setDraft({
      name: s.name, contact: s.contact ?? "", email: s.email ?? "", country: s.country,
      category: s.category ?? "Electronics", rating: String(s.rating), status: s.status,
      leadTimeDays: s.leadTimeDays != null ? String(s.leadTimeDays) : "",
      productsSupplied: s.productsSupplied != null ? String(s.productsSupplied) : "",
    });
    setFormOpen(true);
  }

  async function saveSupplier() {
    if (!draft.name.trim()) { toast("Name is required", "error"); return; }
    if (!draft.country.trim()) { toast("Country is required", "error"); return; }
    setBusy(true);
    const payload = {
      name: draft.name.trim(),
      contact: draft.contact.trim() || undefined,
      email: draft.email.trim() || undefined,
      country: draft.country.trim(),
      category: draft.category || undefined,
      rating: Math.min(5, Math.max(0, Number(draft.rating) || 0)),
      status: draft.status,
      leadTimeDays: draft.leadTimeDays.trim() ? Number(draft.leadTimeDays) : undefined,
      productsSupplied: draft.productsSupplied.trim() ? Number(draft.productsSupplied) : undefined,
    };
    try {
      if (editing) {
        await api.put(`/api/suppliers/${editing.id}`, payload);
        toast(`Supplier ${editing.id} updated`);
      } else {
        const created = await api.post<Supplier>("/api/suppliers", payload);
        toast(`Supplier ${created.id} created`);
      }
      setFormOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save supplier", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.del(`/api/suppliers/${deleting.id}`);
      toast(`Supplier ${deleting.id} deleted`);
      setDeleting(null);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete supplier", "error");
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    exportToCsv("suppliers", filtered, [
      { key: "id", header: "Supplier ID" },
      { key: "name", header: "Name" },
      { key: "category", header: "Category" },
      { key: "country", header: "Country" },
      { key: "contact", header: "Contact" },
      { key: "email", header: "Email" },
      { key: "rating", header: "Rating" },
      { key: "leadTimeDays", header: "Lead Time (days)" },
      { key: "productsSupplied", header: "Products Supplied" },
      { key: "status", header: "Status" },
    ]);
    toast(`Exported ${filtered.length} suppliers to CSV`);
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-deep-navy">Suppliers</h1>
          <p className="text-[14px] text-text-body mt-0.5">Discover, evaluate, and manage your vetted fulfillment partners.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body hover:bg-soft-bg">
            <Calendar className="w-4 h-4" />
            May 12 – May 18, 2025
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-muted hover:bg-soft-bg">
            <Bell className="w-4 h-4" />
          </button>
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
                <span className="text-[11px] text-text-light">{s.change}</span>
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
                tab === t
                  ? "text-action-blue bg-action-blue/10"
                  : "text-text-muted hover:bg-[#F1F5F9]"
              }`}
            >
              {t}
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
            Add Supplier
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Table section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter bar */}
          <div className="bg-white rounded-xl border border-border-soft p-3 shadow-soft">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search suppliers by name, location, category..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-deep-navy placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setFilterOpen((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[13px] transition-colors ${
                    categoryFilter ? "bg-action-blue/10 border-action-blue text-action-blue" : "border-border-soft text-text-muted hover:bg-soft-bg"
                  }`}
                >
                  {categoryFilter || "Category"}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {filterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                    <div className="absolute left-0 mt-1 z-20 w-48 bg-white rounded-lg border border-border-soft shadow-lg py-1">
                      <p className="px-3 py-1.5 text-[11px] font-semibold text-text-light uppercase">Category</p>
                      <button
                        onClick={() => { setCategoryFilter(""); setFilterOpen(false); setPage(1); }}
                        className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${!categoryFilter ? "text-action-blue font-medium" : "text-text-body"}`}
                      >
                        All categories
                      </button>
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { setCategoryFilter(cat); setFilterOpen(false); setPage(1); }}
                          className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${categoryFilter === cat ? "text-action-blue font-medium" : "text-text-body"}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {["Location", "Certifications", "More Filters"].map((d) => (
                <button key={d} className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg">
                  {d}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ))}
              <button onClick={() => { setCategoryFilter(""); setSearch(""); setPage(1); }} className="px-3 py-2 text-[13px] text-action-blue font-medium hover:underline">Clear</button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-border-soft shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: "880px" }}>
                <thead>
                  <tr className="bg-soft-bg border-b border-border-soft">
                    {["Supplier", "Category", "Location", "Match Score", "Products", "Lead Time", "Contact", "Performance", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((s) => {
                    const score = ratingScore(s.rating);
                    const accent = categoryColor[s.category ?? ""] ?? "#9AA8B8";
                    return (
                      <tr key={s.id} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                              style={{
                                backgroundColor: `${accent}14`,
                                color: accent,
                                boxShadow: `inset 0 0 0 1px ${accent}26`,
                              }}
                            >
                              {s.name.charAt(0)}
                            </div>
                            <Link href={`/dashboard/suppliers/${s.id}`} className="text-[13px] font-medium text-deep-navy hover:text-action-blue max-w-[150px] leading-tight">
                              {s.name}
                            </Link>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[13px] text-text-body whitespace-nowrap">{s.category ?? "—"}</td>
                        <td className="px-5 py-3 text-[13px] text-deep-navy whitespace-nowrap">{s.country}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-deep-navy">{score}</span>
                            <div className="w-14 h-1.5 rounded-full bg-border-soft overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: scoreColor(score) }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[13px] text-text-body">{s.productsSupplied != null ? formatNumber(s.productsSupplied) : "—"}</td>
                        <td className="px-5 py-3 text-[13px] text-text-body whitespace-nowrap">{s.leadTimeDays != null ? `${s.leadTimeDays} days` : "—"}</td>
                        <td className="px-5 py-3 text-[13px] text-text-body whitespace-nowrap">{s.contact ?? s.email ?? "—"}</td>
                        <td className="px-5 py-3"><PerfRing pct={score} /></td>
                        <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(s)}
                              className="w-8 h-8 flex items-center justify-center rounded-md text-text-light hover:bg-[#EFF6FF] hover:text-action-blue transition-colors"
                              aria-label={`Edit ${s.id}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleting(s)}
                              className="w-8 h-8 flex items-center justify-center rounded-md text-text-light hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                              aria-label={`Delete ${s.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {pageRows.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-5 py-10 text-center text-[13px] text-text-muted">
                        No suppliers match your filters.
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
                  ? "Showing 0 suppliers"
                  : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${filtered.length} suppliers`}
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
                <button className="inline-flex items-center gap-1 px-2 py-1 border border-border-soft rounded-md text-[12px] text-text-muted">
                  {pageSize} / page
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Categories */}
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
            <h3 className="text-[15px] font-semibold text-deep-navy mb-3">Supplier Categories</h3>
            <div className="relative w-[120px] h-[120px] mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#E6EDF5" strokeWidth="11" />
                {donutSegments.map((c, i) => {
                  const len = (c.pct / 100) * circumference;
                  return <circle key={i} cx="50" cy="50" r="38" fill="none" stroke={c.color} strokeWidth="11" strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-(c.offset / 100) * circumference} />;
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[16px] font-bold text-deep-navy">{items.length}</p>
                  <p className="text-[10px] text-text-light">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 mt-4">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-text-muted truncate">{c.name}</span>
                  </div>
                  <span className="font-medium text-deep-navy shrink-0 ml-2">{c.pct}%</span>
                </div>
              ))}
            </div>
            <button className="text-[12px] text-action-blue font-medium mt-3 hover:underline">View all categories →</button>
          </div>

          {/* Top Rated */}
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
            <h3 className="text-[15px] font-semibold text-deep-navy mb-3">Top Rated Suppliers</h3>
            <div className="space-y-3">
              {topRated.map((t, i) => (
                <div key={t.name} className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    i === 0 ? "bg-[#F59E0B]/15 text-[#F59E0B]"
                    : i === 1 ? "bg-[#9AA8B8]/20 text-[#66758C]"
                    : i === 2 ? "bg-[#B45309]/15 text-[#B45309]"
                    : "bg-[#F1F5F9] text-[#66758C]"
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-deep-navy truncate">{t.name}</p>
                    <div className="w-full h-1.5 rounded-full bg-border-soft overflow-hidden mt-1">
                      <div className="h-full rounded-full" style={{ width: `${t.score}%`, backgroundColor: scoreColor(t.score) }} />
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-deep-navy shrink-0">{t.score}</span>
                </div>
              ))}
            </div>
            <button className="text-[12px] text-action-blue font-medium mt-3 hover:underline">View all suppliers →</button>
          </div>

          {/* On-Time chart */}
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-soft">
            <h3 className="text-[15px] font-semibold text-deep-navy mb-1">Supplier On-Time Sample Rate</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[22px] font-bold text-deep-navy">95.3%</span>
              <span className="text-[11px] text-teal font-medium flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />2.8%
              </span>
              <span className="text-[11px] text-text-light">vs May 5 – May 11</span>
            </div>
            <div className="h-[90px]">
              <svg viewBox="0 0 200 90" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="otGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0057D8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0057D8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M0,${80 - onTimePts[0]} ${onTimePts.map((v, i) => `L${i * 33},${80 - v}`).join(" ")} L198,80 L0,80 Z`} fill="url(#otGrad)" />
                <polyline fill="none" stroke="#0057D8" strokeWidth="2" points={onTimePts.map((v, i) => `${i * 33},${80 - v}`).join(" ")} />
                {onTimePts.map((v, i) => <circle key={i} cx={i * 33} cy={80 - v} r="2.5" fill="white" stroke="#0057D8" strokeWidth="1.5" />)}
              </svg>
            </div>
            <div className="flex justify-between text-[9px] text-text-light mt-1">
              {onTimeDates.map((d) => <span key={d}>{d}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.id}` : "Add Supplier"}
        description={editing ? "Update the supplier details below." : "Add a new supplier to your network."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveSupplier} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create supplier"}
            </PrimaryButton>
          </>
        }
      >
        <SupplierFields draft={draft} set={(d) => setDraft((prev) => ({ ...prev, ...d }))} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete supplier"
        message={`Are you sure you want to delete ${deleting?.name ?? ""} (${deleting?.id ?? ""})? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
