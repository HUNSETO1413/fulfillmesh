"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Tag,
  AlertTriangle,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  Download,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Plus as PlusSmall,
} from "lucide-react";
import type { Product, StockStatus } from "@/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatNumber } from "@/lib/format";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";

const STOCK_STATUSES: StockStatus[] = ["In Stock", "Low Stock", "Out of Stock", "Backordered"];

type Draft = {
  sku: string;
  name: string;
  category: string;
  price: string;
  cost: string;
  stock: string;
  status: StockStatus;
  supplier: string;
};

const emptyDraft: Draft = {
  sku: "", name: "", category: "", price: "", cost: "", stock: "0", status: "In Stock", supplier: "",
};

function ProductFields({ draft, set }: { draft: Draft; set: (d: Partial<Draft>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Field label="Product name" required>
          <TextInput value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="Insulated Water Bottle" />
        </Field>
      </div>
      <Field label="SKU" required>
        <TextInput value={draft.sku} onChange={(e) => set({ sku: e.target.value })} placeholder="WB-750-SLV" />
      </Field>
      <Field label="Category" required>
        <TextInput value={draft.category} onChange={(e) => set({ category: e.target.value })} placeholder="Home & Kitchen" />
      </Field>
      <Field label="Selling price (USD)">
        <NumberInput value={draft.price} onChange={(e) => set({ price: e.target.value })} placeholder="0.00" step="0.01" min="0" />
      </Field>
      <Field label="Unit cost (USD)">
        <NumberInput value={draft.cost} onChange={(e) => set({ cost: e.target.value })} placeholder="0.00" step="0.01" min="0" />
      </Field>
      <Field label="Stock">
        <NumberInput value={draft.stock} onChange={(e) => set({ stock: e.target.value })} placeholder="0" step="1" min="0" />
      </Field>
      <Field label="Status">
        <Select options={STOCK_STATUSES} value={draft.status} onChange={(e) => set({ status: e.target.value as StockStatus })} />
      </Field>
      <div className="col-span-2">
        <Field label="Supplier">
          <TextInput value={draft.supplier} onChange={(e) => set({ supplier: e.target.value })} placeholder="Shenzhen Hydrate Co." />
        </Field>
      </div>
    </div>
  );
}

const stats = [
  { title: "Total Products", value: "5,842", change: "6.3%", positive: true, sub: "vs May 5 – May 11", icon: Package, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "Active SKUs", value: "4,968", change: "8.1%", positive: true, sub: "vs May 5 – May 11", icon: Tag, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
  { title: "Low Stock Alerts", value: "128", change: "12.4%", positive: false, sub: "vs May 5 – May 11", icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
  { title: "Avg Margin", value: "32.7%", change: "2.6pp", positive: true, sub: "vs May 5 – May 11", icon: PieIcon, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
];

const distribution = [
  { name: "Electronics", pct: 28.5, color: "#0057D8" },
  { name: "Home & Kitchen", pct: 22.3, color: "#00B894" },
  { name: "Apparel", pct: 16.9, color: "#7C6FF6" },
  { name: "Beauty", pct: 11.0, color: "#7CB7FF" },
  { name: "Sports", pct: 7.1, color: "#F59E0B" },
  { name: "Other", pct: 14.2, color: "#D9E5F2" },
];

const catStyles = [
  "bg-[#0057D8]/10 text-[#0057D8]",
  "bg-[#00B894]/10 text-[#00B894]",
  "bg-[#7C6FF6]/10 text-[#7C6FF6]",
  "bg-[#7CB7FF]/10 text-[#3B82F6]",
  "bg-[#F59E0B]/10 text-[#F59E0B]",
];

function catStyle(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  return catStyles[hash % catStyles.length];
}

function marginPct(p: Product): string {
  if (p.cost == null || p.price <= 0) return "—";
  return `${(((p.price - p.cost) / p.price) * 100).toFixed(1)}%`;
}

export default function ProductsView({ items }: { items: Product[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [activePill, setActivePill] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // status filter dropdown
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  // create / edit
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  // delete
  const [deleting, setDeleting] = useState<Product | null>(null);

  // Category pills are derived from the real catalog so counts stay accurate.
  const categoryPills = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of items) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    const pills: { name: string; count: string | null }[] = [{ name: "All", count: null }];
    for (const [name, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
      pills.push({ name, count: formatNumber(count) });
    }
    return pills;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      const matchesPill = activePill === "All" || p.category === activePill;
      const matchesStatus = !statusFilter || p.status === statusFilter;
      const matchesQuery =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.supplier?.toLowerCase().includes(q) ?? false);
      return matchesPill && matchesStatus && matchesQuery;
    });
  }, [items, activePill, statusFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function selectPill(name: string) {
    setActivePill(name);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setDraft({
      sku: p.sku,
      name: p.name,
      category: p.category,
      price: String(p.price),
      cost: p.cost != null ? String(p.cost) : "",
      stock: String(p.stock),
      status: p.status,
      supplier: p.supplier ?? "",
    });
    setFormOpen(true);
  }

  async function saveProduct() {
    if (!draft.name.trim()) { toast("Product name is required", "error"); return; }
    if (!draft.sku.trim()) { toast("SKU is required", "error"); return; }
    if (!draft.category.trim()) { toast("Category is required", "error"); return; }
    setBusy(true);
    const payload = {
      sku: draft.sku.trim(),
      name: draft.name.trim(),
      category: draft.category.trim(),
      price: Number(draft.price) || 0,
      cost: draft.cost.trim() === "" ? undefined : Number(draft.cost) || 0,
      stock: Math.round(Number(draft.stock) || 0),
      status: draft.status,
      supplier: draft.supplier.trim() || undefined,
    };
    try {
      if (editing) {
        await api.put(`/api/products/${editing.id}`, payload);
        toast(`Product ${editing.sku} updated`);
      } else {
        const created = await api.post<Product>("/api/products", payload);
        toast(`Product ${created.sku} created`);
      }
      setFormOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save product", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.del(`/api/products/${deleting.id}`);
      toast(`Product ${deleting.sku} deleted`);
      setDeleting(null);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete product", "error");
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    exportToCsv("products", filtered, [
      { key: "id", header: "Product ID" },
      { key: "sku", header: "SKU" },
      { key: "name", header: "Name" },
      { key: "category", header: "Category" },
      { key: "supplier", header: "Supplier" },
      { key: "cost", header: "Unit Cost" },
      { key: "price", header: "Selling Price" },
      { key: "stock", header: "Stock" },
      { key: "status", header: "Status" },
    ]);
    toast(`Exported ${filtered.length} products to CSV`);
  }

  // build donut segments: precompute the cumulative offset for each slice so the
  // render stays free of post-render mutation.
  const circumference = 2 * Math.PI * 40;
  const donut = distribution.reduce<{ d: (typeof distribution)[number]; offset: number }[]>(
    (acc, d) => {
      const prev = acc.length ? acc[acc.length - 1] : null;
      const offset = prev ? prev.offset + prev.d.pct : 0;
      acc.push({ d, offset });
      return acc;
    },
    [],
  );

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#061A3D]">Products</h1>
          <p className="text-[14px] text-[#4A5A73] mt-0.5">Manage your product catalog, pricing, and inventory across all channels.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F7FAFC]">
            <Calendar className="w-4 h-4" />
            May 12 – May 18, 2025
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F7FAFC]"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0057D8] hover:bg-[#003B7A] rounded-lg text-[13px] font-medium text-white"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E6EDF5] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#66758C]">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#061A3D] leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {s.positive ? <ArrowUpRight className="w-3.5 h-3.5 text-[#00B894]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
                <span className={`text-[12px] font-medium ${s.positive ? "text-[#00B894]" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-[#9AA8B8]">{s.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters + Category distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Filters card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E6EDF5] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA8B8]" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products, SKUs, or suppliers..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] text-[#061A3D] placeholder:text-[#9AA8B8] focus:outline-none focus:ring-2 focus:ring-[#0057D8]/20 focus:border-[#0057D8]"
              />
            </div>
            <button className="w-9 h-9 shrink-0 flex items-center justify-center border border-[#E6EDF5] rounded-lg text-[#66758C] hover:bg-[#F7FAFC]">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <div className="relative">
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-[13px] transition-colors ${
                  statusFilter ? "bg-[#0057D8]/10 border-[#0057D8]/30 text-[#0057D8]" : "border-[#E6EDF5] text-[#66758C] hover:bg-[#F7FAFC]"
                }`}
              >
                {statusFilter || "Status"}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                  <div className="absolute left-0 mt-1 z-20 w-48 bg-white rounded-lg border border-[#E6EDF5] shadow-lg py-1">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-[#9AA8B8] uppercase">Stock Status</p>
                    <button
                      onClick={() => { setStatusFilter(""); setFilterOpen(false); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F7FAFC] ${!statusFilter ? "text-[#0057D8] font-medium" : "text-[#4A5A73]"}`}
                    >
                      All statuses
                    </button>
                    {STOCK_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setFilterOpen(false); setPage(1); }}
                        className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F7FAFC] ${statusFilter === s ? "text-[#0057D8] font-medium" : "text-[#4A5A73]"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {categoryPills.map((p) => (
              <button
                key={p.name}
                onClick={() => selectPill(p.name)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium border transition-colors ${
                  activePill === p.name
                    ? "bg-[#0057D8]/10 border-[#0057D8]/30 text-[#0057D8]"
                    : "bg-white border-[#E6EDF5] text-[#66758C] hover:bg-[#F7FAFC]"
                }`}
              >
                {p.name}
                {p.count && <span className="text-[11px] text-[#9AA8B8] bg-[#F1F5F9] px-1.5 rounded">{p.count}</span>}
              </button>
            ))}
            <button className="w-6 h-6 flex items-center justify-center rounded-md border border-[#E6EDF5] text-[#66758C]">
              <PlusSmall className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="text-[14px] font-semibold text-[#061A3D] mb-4">Category Distribution</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-[120px] h-[120px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#D9E5F2" strokeWidth="12" />
                {donut.map(({ d, offset }, i) => {
                  const len = (d.pct / 100) * circumference;
                  const dash = `${len} ${circumference - len}`;
                  return (
                    <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={d.color} strokeWidth="12" strokeLinecap="butt" strokeDasharray={dash} strokeDashoffset={-(offset / 100) * circumference} />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[10px] text-[#9AA8B8]">Total</p>
                  <p className="text-[16px] font-bold text-[#061A3D]">5,842</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {distribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-[#66758C] truncate">{d.name}</span>
                  </div>
                  <span className="font-medium text-[#061A3D] shrink-0 ml-2">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6EDF5]">
          <h3 className="text-[14px] font-semibold text-[#061A3D]">Product Catalog</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3 py-2 border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#66758C] hover:bg-[#F7FAFC] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#0057D8] hover:bg-[#003B7A] text-white rounded-lg text-[13px] font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7FAFC] border-b border-[#E6EDF5]">
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Product</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">SKU</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Category</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Supplier</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Unit Cost</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Selling Price</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Margin</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Inventory</th>
                <th className="text-left text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Status</th>
                <th className="text-right text-[11px] font-semibold text-[#66758C] uppercase tracking-wider px-5 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((p) => (
                <tr key={p.id} className="border-b border-[#E6EDF5] last:border-b-0 hover:bg-[#F7FAFC]/60 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E6EDF5] to-[#F7FAFC] border border-[#E6EDF5] overflow-hidden shrink-0" />
                      <Link href={`/dashboard/products/${p.id}`} className="text-[13px] font-medium text-[#061A3D] hover:text-[#0057D8] leading-tight max-w-[200px]">
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-[#4A5A73] font-mono whitespace-nowrap">{p.sku}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[12px] font-medium ${catStyle(p.category)}`}>{p.category}</span>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-[#4A5A73] whitespace-nowrap">{p.supplier ?? "—"}</td>
                  <td className="px-5 py-3 text-[13px] text-[#4A5A73] whitespace-nowrap">{p.cost != null ? formatCurrency(p.cost) : "—"}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-[#061A3D] whitespace-nowrap">{formatCurrency(p.price)}</td>
                  <td className="px-5 py-3 text-[13px] font-medium text-[#00B894] whitespace-nowrap">{marginPct(p)}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="text-[13px] font-medium text-[#061A3D]">{formatNumber(p.stock)}</div>
                    <div className={`text-[11px] ${p.status === "Low Stock" ? "text-[#F59E0B] font-medium" : "text-[#9AA8B8]"}`}>{p.status}</div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-[#9AA8B8] hover:bg-[#EAF1FB] hover:text-[#0057D8] transition-colors"
                        aria-label={`Edit ${p.sku}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(p)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-[#9AA8B8] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                        aria-label={`Delete ${p.sku}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center">
                    <p className="text-[13px] text-[#66758C]">No products match your filters.</p>
                    <button onClick={openCreate} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0057D8] hover:underline">
                      <Plus className="w-4 h-4" /> Add your first product
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E6EDF5]">
          <p className="text-[12px] text-[#66758C]">
            {filtered.length === 0
              ? "Showing 0 products"
              : `Showing ${start + 1} to ${Math.min(start + pageSize, filtered.length)} of ${formatNumber(filtered.length)} products`}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E6EDF5] text-[#9AA8B8] hover:bg-[#F7FAFC] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium ${
                    p === currentPage
                      ? "bg-[#0057D8] text-white"
                      : "border border-[#E6EDF5] text-[#66758C] hover:bg-[#F7FAFC]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E6EDF5] text-[#66758C] hover:bg-[#F7FAFC] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="inline-flex items-center gap-1 px-2 py-1 border border-[#E6EDF5] rounded-md text-[12px] text-[#66758C]">
              {pageSize} / page
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.sku}` : "Add Product"}
        description={editing ? "Update the product details below." : "Add a new product to your catalog."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveProduct} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create product"}
            </PrimaryButton>
          </>
        }
      >
        <ProductFields draft={draft} set={(d) => setDraft((prev) => ({ ...prev, ...d }))} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete product"
        message={`Are you sure you want to delete ${deleting?.name ?? ""} (${deleting?.sku ?? ""})? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
