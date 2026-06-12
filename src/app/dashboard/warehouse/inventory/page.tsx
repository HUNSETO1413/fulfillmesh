"use client";

import { useMemo, useState } from "react";
import {
  Package, Tag, DollarSign, AlertTriangle,
  Search, Download, ChevronDown, MoreHorizontal, ArrowUpRight, ArrowDownRight, Eye, SlidersHorizontal,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { Field, NumberInput } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";

const stats = [
  { title: "Total Units", value: "1,248,924", sub: "Units", change: "+12.5%", note: "vs last 30 days", positive: true, icon: Package, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
  { title: "SKUs", value: "8,742", sub: "Active", change: "+4.3%", note: "vs last 30 days", positive: true, icon: Tag, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  { title: "Total Value", value: "$24,682,330", sub: "USD", change: "+8.7%", note: "vs last 30 days", positive: true, icon: DollarSign, iconBg: "bg-[#8B5CF6]/10", iconColor: "text-[#8B5CF6]" },
  { title: "Low Stock Items", value: "134", sub: "SKUs", change: "-16.4%", note: "vs last 30 days", positive: false, icon: AlertTriangle, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
];

const tabs = ["All Inventory", "Low Stock", "Out of Stock", "Expiring Soon"];

type Status = "In Stock" | "Low Stock" | "Out of Stock";
type Row = {
  product: string; category: string; sku: string; wh: string;
  onHand: number; reserved: number; status: Status; expiring?: boolean;
};

const initialRows: Row[] = [
  { product: "Wireless Headphones", category: "Electronics", sku: "ELEC-1001", wh: "ATL-1", onHand: 2450, reserved: 320, status: "In Stock" },
  { product: "Stainless Steel Bottle", category: "Home & Kitchen", sku: "HK-2002", wh: "LAX-1", onHand: 5120, reserved: 200, status: "In Stock" },
  { product: "Cotton T-Shirt", category: "Apparel", sku: "APP-3003-M", wh: "ORD-1", onHand: 1250, reserved: 640, status: "In Stock" },
  { product: "Running Shoes", category: "Sports", sku: "FTW-4004-9", wh: "DFW-1", onHand: 320, reserved: 85, status: "Low Stock" },
  { product: "Whey Protein 1kg", category: "Health & Beauty", sku: "HB-5005", wh: "MIA-1", onHand: 0, reserved: 0, status: "Out of Stock", expiring: true },
  { product: "Travel Backpack", category: "Bags & Luggage", sku: "BAG-6006", wh: "ATL-1", onHand: 880, reserved: 120, status: "In Stock" },
  { product: "Bluetooth Speaker", category: "Electronics", sku: "ELEC-1007", wh: "LAX-1", onHand: 1640, reserved: 210, status: "In Stock" },
  { product: "Yoga Mat Premium", category: "Sports", sku: "SPT-4008", wh: "ORD-1", onHand: 410, reserved: 60, status: "Low Stock" },
  { product: "Ceramic Dinner Set", category: "Home & Kitchen", sku: "HK-2009", wh: "DFW-1", onHand: 2200, reserved: 180, status: "In Stock" },
  { product: "Vitamin C Tablets", category: "Health & Beauty", sku: "HB-5010", wh: "MIA-1", onHand: 95, reserved: 40, status: "Low Stock", expiring: true },
];

const CATEGORIES = ["Electronics", "Home & Kitchen", "Apparel", "Sports", "Health & Beauty", "Bags & Luggage"];
const WAREHOUSES = ["ATL-1", "LAX-1", "ORD-1", "DFW-1", "MIA-1"];
const STATUSES: Status[] = ["In Stock", "Low Stock", "Out of Stock"];

const categories = [
  { name: "Electronics", pct: 24, color: "#3B82F6" },
  { name: "Apparel", pct: 22, color: "#10B981" },
  { name: "Home & Kitchen", pct: 18, color: "#F59E0B" },
  { name: "Health & Beauty", pct: 14, color: "#8B5CF6" },
  { name: "Other", pct: 22, color: "#EF4444" },
];

const stockStatus = [
  { label: "In Stock", color: "#10B981", skus: "8,492 SKUs", pct: "76.3%" },
  { label: "Low Stock", color: "#F59E0B", skus: "134 SKUs", pct: "15.4%" },
  { label: "Out of Stock", color: "#EF4444", skus: "86 SKUs", pct: "5.7%" },
];

const expiring = [
  { name: "Whey Protein 1kg", info: "MIA-1 - Expires in 15 days", units: "120 units" },
  { name: "Vitamin C Tablets", info: "ORD-1 - Expires in 22 days", units: "80 units" },
  { name: "Face Cream 50ml", info: "DFW-1 - Expires in 31 days", units: "60 units" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Stock": "bg-[#10B981]/10 text-[#10B981]",
    "Low Stock": "bg-[#F59E0B]/10 text-[#F59E0B]",
    "Out of Stock": "bg-[#EF4444]/10 text-[#EF4444]",
  };
  return <span className={`inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full ${styles[status]}`}>{status}</span>;
}

const card = "bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.08)]";
const thCls = "text-left text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3";
const dropBtn = "flex items-center gap-2 text-[13px] text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC]";

function Dropdown({ label, value, options, onSelect }: { label: string; value: string; options: string[]; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className={`${dropBtn} ${value ? "text-[#3B82F6] border-[#3B82F6]" : ""}`}>
        {value || label} <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-20 w-52 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1 max-h-64 overflow-auto">
            <button onClick={() => { onSelect(""); setOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${!value ? "text-[#3B82F6] font-medium" : "text-[#1E293B]"}`}>{label}</button>
            {options.map((o) => (
              <button key={o} onClick={() => { onSelect(o); setOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${value === o ? "text-[#3B82F6] font-medium" : "text-[#1E293B]"}`}>{o}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function deriveStatus(onHand: number): Status {
  if (onHand <= 0) return "Out of Stock";
  if (onHand < 500) return "Low Stock";
  return "In Stock";
}

export default function WarehouseInventoryPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [activeTab, setActiveTabState] = useState("All Inventory");
  const [query, setQueryState] = useState("");
  const [whFilter, setWhFilterState] = useState("");
  const [catFilter, setCatFilterState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const setActiveTab = (v: string) => { setActiveTabState(v); setPage(1); };
  const setQuery = (v: string) => { setQueryState(v); setPage(1); };
  const setWhFilter = (v: string) => { setWhFilterState(v); setPage(1); };
  const setCatFilter = (v: string) => { setCatFilterState(v); setPage(1); };
  const setStatusFilter = (v: string) => { setStatusFilterState(v); setPage(1); };

  const [adjusting, setAdjusting] = useState<Row | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      let tab = true;
      if (activeTab === "Low Stock") tab = r.status === "Low Stock";
      else if (activeTab === "Out of Stock") tab = r.status === "Out of Stock";
      else if (activeTab === "Expiring Soon") tab = !!r.expiring;
      const wh = !whFilter || r.wh === whFilter;
      const cat = !catFilter || r.category === catFilter;
      const st = !statusFilter || r.status === statusFilter;
      const search = !q || r.sku.toLowerCase().includes(q) || r.product.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
      return tab && wh && cat && st && search;
    });
  }, [rows, activeTab, whFilter, catFilter, statusFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function handleExport() {
    const exportRows = filtered.map((r) => ({
      ...r, available: r.onHand - r.reserved,
    }));
    exportToCsv("warehouse-inventory", exportRows, [
      { key: "product", header: "Product" }, { key: "category", header: "Category" }, { key: "sku", header: "SKU" },
      { key: "wh", header: "Warehouse" }, { key: "onHand", header: "On Hand" }, { key: "reserved", header: "Reserved" },
      { key: "available", header: "Available" }, { key: "status", header: "Status" },
    ]);
    toast(`Exported ${filtered.length} inventory items to CSV`);
  }

  function openAdjust(r: Row) {
    setAdjusting(r);
    setAdjustQty(String(r.onHand));
    setMenuFor(null);
  }

  function saveAdjust() {
    if (!adjusting) return;
    const qty = Number(adjustQty);
    if (Number.isNaN(qty) || qty < 0) { toast("Enter a valid quantity", "error"); return; }
    setRows((prev) => prev.map((r) => (r.sku === adjusting.sku ? { ...r, onHand: qty, status: deriveStatus(qty) } : r)));
    toast(`${adjusting.sku} on-hand set to ${qty.toLocaleString("en-US")}`);
    setAdjusting(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Inventory</h1>
          <p className="text-[14px] text-[#64748B] mt-1">View and manage all inventory across your warehouses.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown label="All Warehouses (5)" value={whFilter} options={WAREHOUSES} onSelect={setWhFilter} />
          <Dropdown label="Filters" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} />
          <button onClick={handleExport} className="flex items-center gap-2 text-[13px] text-white bg-[#3B82F6] rounded-lg px-4 py-2 hover:bg-[#2563EB]"><Download className="w-4 h-4" /> Export</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const Arrow = s.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={s.title} className={card + " p-5"}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#64748B]">{s.title}</span>
                <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}><Icon className={`w-4.5 h-4.5 ${s.iconColor}`} /></div>
              </div>
              <p className="text-[24px] font-bold text-[#1E293B]">{s.value} <span className="text-[12px] font-normal text-[#94A3B8]">{s.sub}</span></p>
              <div className="flex items-center gap-1 mt-1.5">
                <Arrow className={`w-3.5 h-3.5 ${s.positive ? "text-[#10B981]" : "text-[#EF4444]"}`} />
                <span className={`text-[12px] font-medium ${s.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-[#94A3B8]">{s.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E2E8F0]">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[13px] pb-3 border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "text-[#3B82F6] border-[#3B82F6] font-medium"
                  : "text-[#64748B] border-transparent hover:text-[#1E293B]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 2.6fr) minmax(0, 1fr)" }}>
        {/* Main table card */}
        <div className={card + " overflow-hidden"}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2E8F0]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by SKU, product name or barcode..." className="w-full text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] bg-white border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30" />
            </div>
            <Dropdown label="All Categories" value={catFilter} options={CATEGORIES} onSelect={setCatFilter} />
            <Dropdown label="All Status" value={statusFilter} options={STATUSES} onSelect={setStatusFilter} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className={thCls}>Product</th>
                  <th className={thCls}>SKU</th>
                  <th className={thCls}>Warehouse</th>
                  <th className={thCls}>On Hand</th>
                  <th className={thCls}>Reserved</th>
                  <th className={thCls}>Available</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls + " text-right"}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr key={r.sku} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-[#94A3B8]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#1E293B] leading-tight">{r.product}</p>
                          <p className="text-[11px] text-[#94A3B8] leading-tight mt-0.5">{r.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-[#64748B] font-mono">{r.sku}</td>
                    <td className="px-5 py-3 text-[13px] text-[#64748B]">{r.wh}</td>
                    <td className="px-5 py-3 text-[13px] font-medium text-[#1E293B]">{r.onHand.toLocaleString("en-US")}</td>
                    <td className="px-5 py-3 text-[13px] text-[#64748B]">{r.reserved.toLocaleString("en-US")}</td>
                    <td className="px-5 py-3 text-[13px] font-medium text-[#1E293B]">{Math.max(0, r.onHand - r.reserved).toLocaleString("en-US")}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setMenuFor((v) => (v === r.sku ? null : r.sku))} className="text-[#94A3B8] hover:text-[#64748B]">
                          <MoreHorizontal className="w-4 h-4 inline" />
                        </button>
                        {menuFor === r.sku && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                            <div className="absolute right-0 mt-1 z-20 w-40 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1 text-left">
                              <button onClick={() => { setMenuFor(null); toast(`Viewing ${r.sku}`, "info"); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#1E293B] hover:bg-[#F8FAFC]"><Eye className="w-3.5 h-3.5" /> View details</button>
                              <button onClick={() => openAdjust(r)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#3B82F6] hover:bg-[#F8FAFC]"><SlidersHorizontal className="w-3.5 h-3.5" /> Adjust stock</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-[13px] text-[#64748B]">No inventory items match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#E2E8F0]">
            <span className="text-[13px] text-[#64748B]">{filtered.length === 0 ? "Showing 0 items" : `Showing ${start + 1}-${Math.min(start + pageSize, filtered.length)} of ${filtered.length} items`}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] ${p === currentPage ? "bg-[#3B82F6] text-white" : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar widgets */}
        <div className="space-y-5">
          {/* Inventory by Category */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-4">Inventory by Category</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {categories.map((c, i) => {
                    const off = categories.slice(0, i).reduce((s, x) => s + x.pct, 0);
                    const da = `${c.pct * 2.51327} ${251.327 - c.pct * 2.51327}`;
                    return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c.color} strokeWidth="12" strokeDasharray={da} strokeDashoffset={-off * 2.51327} />;
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[17px] font-bold text-[#1E293B] leading-none">1,284</p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">Total Units</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {categories.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-[#64748B]">{c.name}</span>
                    </div>
                    <span className="font-medium text-[#1E293B]">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className={card + " p-5"}>
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-3">Stock Status</h3>
            <div className="space-y-2.5">
              {stockStatus.map((s) => (
                <button key={s.label} onClick={() => { setStatusFilter(s.label); toast(`Filtered by ${s.label}`, "info"); }} className="w-full flex items-center justify-between text-[12px] hover:bg-[#F8FAFC] rounded-lg -mx-1 px-1 py-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[#64748B]">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#1E293B]">{s.skus}</span>
                    <span className="text-[#94A3B8] w-10 text-right">{s.pct}</span>
                  </div>
                </button>
              ))}
              <div className="flex items-center justify-between text-[12px] pt-2 border-t border-[#E2E8F0]">
                <span className="font-semibold text-[#1E293B]">Total</span>
                <span className="font-semibold text-[#1E293B]">8,742 SKUs</span>
              </div>
            </div>
          </div>

          {/* Expiring Soon */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Expiring Soon</h3>
              <button onClick={() => { setActiveTab("Expiring Soon"); toast("Showing expiring items", "info"); }} className="text-[12px] text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {expiring.map((e) => (
                <div key={e.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#1E293B] truncate">{e.name}</p>
                    <p className="text-[11px] text-[#94A3B8]">{e.info}</p>
                  </div>
                  <span className="text-[11px] font-medium text-[#F59E0B] shrink-0">{e.units}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setActiveTab("Expiring Soon"); toast("Showing expiring items", "info"); }} className="w-full mt-3 text-[12px] text-[#3B82F6] border border-[#E2E8F0] rounded-lg py-2 hover:bg-[#F8FAFC]">View all expiring items</button>
          </div>

          {/* Recent Activity */}
          <div className={card + " p-5"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Recent Activity</h3>
              <button onClick={() => toast("Showing full activity log", "info")} className="text-[12px] text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {[
                { text: "Inbound PO #90765 received", info: "ATL-1 - 2h ago", dot: "#10B981" },
                { text: "SKU ELEC-1001 stock adjusted", info: "ATL-1 - 4h ago", dot: "#3B82F6" },
                { text: "Cycle count completed Zone B", info: "LAX-1 - 6h ago", dot: "#8B5CF6" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.dot }} />
                  <div>
                    <p className="text-[12px] text-[#1E293B]">{a.text}</p>
                    <p className="text-[11px] text-[#94A3B8]">{a.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Adjust stock modal */}
      <Modal
        open={!!adjusting}
        onClose={() => setAdjusting(null)}
        title={adjusting ? `Adjust ${adjusting.sku}` : "Adjust stock"}
        description="Set the on-hand quantity for this SKU."
        size="sm"
        footer={
          <>
            <button onClick={() => setAdjusting(null)} className="px-4 py-2 text-[13px] font-medium text-[#374151] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">Cancel</button>
            <button onClick={saveAdjust} className="px-4 py-2 text-[13px] font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-[#2563EB]">Save adjustment</button>
          </>
        }
      >
        <Field label="On-hand quantity" hint={adjusting ? `Reserved: ${adjusting.reserved.toLocaleString("en-US")} units` : undefined}>
          <NumberInput value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} min="0" />
        </Field>
      </Modal>
    </div>
  );
}
