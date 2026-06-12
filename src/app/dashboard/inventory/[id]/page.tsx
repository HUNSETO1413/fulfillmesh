import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft, Calendar, Bell, MoreHorizontal, ChevronDown,
  Pencil, FileText, Box, Lock, CheckCircle2, AlertTriangle,
  Clock, Tag, TrendingUp,
} from "lucide-react";
import { inventory as inventoryRepo } from "@/lib/repositories";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatNumber } from "@/lib/format";

const tabs = ["Overview", "Stock & Movements", "Purchase Orders", "Allocations", "Adjustments", "Forecast & Replenishment", "Activity Log"];

const byWarehouse = [
  { wh: "Los Angeles, CA", onHand: "3,420", reserved: "450", available: "2,970", reorder: "800", status: "Healthy" },
  { wh: "Dallas, TX", onHand: "2,510", reserved: "320", available: "1,830", reorder: "600", status: "Healthy" },
  { wh: "Chicago, IL", onHand: "1,640", reserved: "210", available: "1,430", reorder: "500", status: "Healthy" },
  { wh: "Atlanta, GA", onHand: "890", reserved: "140", available: "750", reorder: "300", status: "Healthy" },
  { wh: "New York, NY", onHand: "502", reserved: "125", available: "377", reorder: "350", status: "Watch" },
];

const inboundPOs = [
  { po: "PO-2026-0091", supplier: "Shenzhen Hydrate Co.", eta: "May 28", qty: "4,000", status: "In Transit" },
  { po: "PO-2026-0089", supplier: "Shenzhen Hydrate Co.", eta: "Jun 4", qty: "2,500", status: "Confirmed" },
  { po: "PO-2026-0086", supplier: "Shenzhen Hydrate Co.", eta: "Jun 12", qty: "3,000", status: "Confirmed" },
  { po: "PO-2026-0080", supplier: "Pacific Bottling Inc.", eta: "Apr 30", qty: "0", status: "Received" },
];

const outboundAlloc = [
  { ref: "ORD-58210", customer: "Acme Retail", ship: "May 22", qty: "620", status: "Picking" },
  { ref: "ORD-58198", customer: "Beta Supplies", ship: "May 22", qty: "340", status: "Packed" },
  { ref: "ORD-58177", customer: "Gamma Corp", ship: "May 23", qty: "180", status: "Allocated" },
  { ref: "ORD-58150", customer: "Delta LLC", ship: "May 24", qty: "105", status: "Allocated" },
];

const adjustments = [
  { date: "May 16, 2026", type: "Cycle Count", qty: "+24", location: "LA-A12-R04-B02", reason: "Cycle count recount", by: "John Smith" },
  { date: "May 14, 2026", type: "Damage", qty: "-12", location: "DAL-B03-R01-B05", reason: "Damaged in transit", by: "Maria Lopez" },
  { date: "May 11, 2026", type: "Return", qty: "+8", location: "LA-A12-R04-B02", reason: "Customer return restock", by: "John Smith" },
  { date: "May 9, 2026", type: "Cycle Count", qty: "-5", location: "CHI-C02-R07-B01", reason: "System adjustment", by: "Alex Kim" },
];

function Badge({ text }: { text: string }) {
  const styles: Record<string, string> = {
    Healthy: "bg-[#10B981]/10 text-[#10B981]",
    Watch: "bg-[#F59E0B]/10 text-[#F59E0B]",
    "In Transit": "bg-[#3B82F6]/10 text-[#3B82F6]",
    Confirmed: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
    Received: "bg-[#10B981]/10 text-[#10B981]",
    Picking: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Packed: "bg-[#3B82F6]/10 text-[#3B82F6]",
    Allocated: "bg-[#64748B]/10 text-[#64748B]",
    "Cycle Count": "bg-[#3B82F6]/10 text-[#3B82F6]",
    Damage: "bg-[#EF4444]/10 text-[#EF4444]",
    Return: "bg-[#10B981]/10 text-[#10B981]",
  };
  return <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-medium rounded-full ${styles[text] || "bg-[#F1F5F9] text-[#64748B]"}`}>{text}</span>;
}

const card = "bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)]";
const thCls = "text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider px-4 py-2.5";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Inventory ${id}` };
}

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await inventoryRepo.get(id);
  if (!item) notFound();

  const metrics = [
    { label: "On Hand", value: formatNumber(item.onHand), unit: "units", icon: Box, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
    { label: "Reserved", value: formatNumber(item.reserved), unit: "units", icon: Lock, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
    { label: "Available", value: formatNumber(item.available), unit: "units", icon: CheckCircle2, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
    { label: "Reorder Point", value: formatNumber(item.reorderPoint), unit: "units", icon: AlertTriangle, iconBg: "bg-[#8B5CF6]/10", iconColor: "text-[#8B5CF6]" },
    { label: "Lead Time", value: "12", unit: "days", icon: Clock, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]" },
    { label: "Unit Cost", value: "$5.45", unit: "per unit", icon: Tag, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]" },
  ];

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link href="/dashboard/inventory" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#1E293B] mb-3">
        <ArrowLeft className="w-4 h-4" /> Back to Inventory
      </Link>

      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Inventory SKU Detail</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">View stock levels, movements, allocations, and replenishment insights for this SKU.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Calendar className="w-4 h-4" /> May 12 – May 18, 2025 <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC]"><Bell className="w-4 h-4" /></button>
          <button className="w-9 h-9 flex items-center justify-center text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC]"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex items-center justify-end gap-3">
        <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"><Pencil className="w-4 h-4" /> Edit SKU</button>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"><FileText className="w-4 h-4" /> Create PO</button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">More Actions <ChevronDown className="w-3.5 h-3.5" /></button>
      </div>

      {/* Hero card: Product info + Metrics */}
      <div className={`${card} p-5`}>
        <div className="flex gap-6">
          {/* Product image */}
          <div className="shrink-0 self-start">
            <div className="w-[72px] h-[96px] rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#6366F1] border border-[#E2E8F0] flex items-center justify-center overflow-hidden">
              <span className="text-[20px] font-bold text-white">FM</span>
            </div>
          </div>
          {/* Product details */}
          <div className="min-w-[260px]">
            <h2 className="text-[16px] font-semibold text-[#1E293B] mb-3">{item.name}</h2>
            <dl className="space-y-1.5 text-[12px]">
              {[
                ["SKU", item.sku],
                ["Barcode", "697541236987"],
                ["Warehouse", item.warehouse],
                ["Location", item.location ?? "—"],
                ["Brand", "FulfillMesh"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="text-[#94A3B8] w-[64px] shrink-0">{k}</dt>
                  <dd className="text-[#1E293B] font-medium">{v}</dd>
                </div>
              ))}
              <div className="flex gap-3 items-center">
                <dt className="text-[#94A3B8] w-[64px] shrink-0">Status</dt>
                <dd><StatusBadge status={item.status} /></dd>
              </div>
              <div className="flex gap-3 items-center">
                <dt className="text-[#94A3B8] w-[64px] shrink-0">Tags</dt>
                <dd className="flex gap-1.5">
                  <span className="inline-flex px-2 py-0.5 text-[11px] rounded bg-[#3B82F6]/10 text-[#3B82F6]">Bestseller</span>
                  <span className="inline-flex px-2 py-0.5 text-[11px] rounded bg-[#10B981]/10 text-[#10B981]">Eco-Friendly</span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-3 flex-1" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="rounded-lg border border-[#E2E8F0] p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-[#64748B]">{m.label}</span>
                    <div className={`w-7 h-7 rounded-lg ${m.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-3.5 h-3.5 ${m.iconColor}`} />
                    </div>
                  </div>
                  <p className="text-[22px] font-bold text-[#1E293B] leading-tight">{m.value}</p>
                  <p className="text-[11px] text-[#94A3B8]">{m.unit}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] px-5">
        <div className="flex items-center gap-6 overflow-x-auto">
          {tabs.map((t, i) => (
            <button key={t} className={`text-[13px] py-3 whitespace-nowrap border-b-2 -mb-px font-medium ${i === 0 ? "text-[#3B82F6] border-[#3B82F6]" : "text-[#64748B] border-transparent hover:text-[#1E293B]"}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Row: Inventory by Warehouse + Stock Movement + Replenishment */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.1fr 1.3fr 1fr" }}>
        {/* Inventory by Warehouse */}
        <div className={card}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Inventory by Warehouse</h3>
            <button className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all warehouses</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className={thCls}>Warehouse</th>
                <th className={thCls}>On Hand</th>
                <th className={thCls}>Reserved</th>
                <th className={thCls}>Available</th>
                <th className={thCls}>Status</th>
              </tr></thead>
              <tbody>
                {byWarehouse.map((w) => (
                  <tr key={w.wh} className="border-b border-[#E2E8F0]">
                    <td className="px-4 py-2.5 text-[12px] text-[#1E293B]">{w.wh}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#1E293B] font-medium">{w.onHand}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{w.reserved}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#10B981] font-medium">{w.available}</td>
                    <td className="px-4 py-2.5"><Badge text={w.status} /></td>
                  </tr>
                ))}
                <tr className="bg-[#F8FAFC]">
                  <td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">Total</td>
                  <td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">8,432</td>
                  <td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">1,245</td>
                  <td className="px-4 py-2.5 text-[12px] font-semibold text-[#10B981]">7,187</td>
                  <td className="px-4 py-2.5"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Movement chart */}
        <div className={`${card} p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Stock Movement <span className="text-[12px] font-normal text-[#94A3B8]">(Last 30 Days)</span></h3>
            <span className="text-[12px] text-[#64748B] border border-[#E2E8F0] rounded px-2 py-1 flex items-center gap-1">30 Days <ChevronDown className="w-3 h-3" /></span>
          </div>
          <div className="flex items-center gap-4 text-[11px] mb-2">
            <span className="flex items-center gap-1 text-[#64748B]"><span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" /> In</span>
            <span className="flex items-center gap-1 text-[#64748B]"><span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" /> Out</span>
            <span className="flex items-center gap-1 text-[#64748B]"><span className="w-3 h-0.5 bg-[#10B981]" /> Net Change</span>
          </div>
          <svg viewBox="0 0 420 150" className="w-full h-[150px]">
            {[0, 1, 2, 3].map((i) => <line key={i} x1="30" y1={i * 35 + 10} x2="415" y2={i * 35 + 10} stroke="#F1F5F9" />)}
            {Array.from({ length: 16 }).map((_, i) => {
              const x = 40 + i * 24;
              const inH = 20 + (i * 7) % 45;
              const outH = 15 + (i * 5) % 35;
              return (
                <g key={i}>
                  <rect x={x} y={80 - inH} width="6" height={inH} fill="#3B82F6" />
                  <rect x={x + 7} y={80} width="6" height={outH} fill="#EF4444" />
                </g>
              );
            })}
            <polyline fill="none" stroke="#10B981" strokeWidth="2"
              points={Array.from({ length: 16 }).map((_, i) => `${43 + i * 24},${70 - ((i * 11) % 40)}`).join(" ")} />
          </svg>
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            <div><p className="text-[11px] text-[#94A3B8]">Total In</p><p className="text-[13px] font-semibold text-[#3B82F6]">12,640 units</p></div>
            <div><p className="text-[11px] text-[#94A3B8]">Total Out</p><p className="text-[13px] font-semibold text-[#EF4444]">8,500 units</p></div>
            <div><p className="text-[11px] text-[#94A3B8]">Net Change</p><p className="text-[13px] font-semibold text-[#10B981]">+5,180 units</p></div>
          </div>
        </div>

        {/* Replenishment Recommendation */}
        <div className={`${card} p-4`}>
          <h3 className="text-[14px] font-semibold text-[#1E293B] mb-3">Replenishment Recommendation</h3>
          <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg p-3 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <div>
              <p className="text-[11px] text-[#64748B]">Recommended Action</p>
              <p className="text-[13px] font-semibold text-[#10B981]">Reorder</p>
            </div>
          </div>
          <dl className="space-y-2.5 text-[12px]">
            {[
              ["Recommended Order Qty", "4,000 units"],
              ["Est. Arrival (at reorder)", "May 28, 2026"],
              ["Projected Stockout", "Jun 7, 2026", "danger"],
              ["Days of Supply Remaining", "8 days"],
              ["Confidence Level", "High"],
            ].map(([k, v, flag]) => (
              <div key={k} className="flex items-center justify-between">
                <dt className="text-[#64748B]">{k}</dt>
                <dd className={`font-medium ${flag === "danger" ? "text-[#EF4444]" : "text-[#1E293B]"}`}>{v}</dd>
              </div>
            ))}
          </dl>
          <button className="w-full mt-4 text-[13px] font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg py-2">Create Purchase Order</button>
        </div>
      </div>

      {/* Row: Inbound POs + Outbound Allocations + Forecast */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.1fr 1.1fr 1fr" }}>
        {/* Inbound POs */}
        <div className={card}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Inbound Purchase Orders</h3>
            <button className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
          </div>
          <table className="w-full">
            <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className={thCls}>PO Number</th><th className={thCls}>ETA</th><th className={thCls}>Qty</th><th className={thCls}>Status</th>
            </tr></thead>
            <tbody>
              {inboundPOs.map((p) => (
                <tr key={p.po} className="border-b border-[#E2E8F0]">
                  <td className="px-4 py-2.5"><p className="text-[12px] font-medium text-[#3B82F6] font-mono">{p.po}</p><p className="text-[11px] text-[#94A3B8]">{p.supplier}</p></td>
                  <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{p.eta}</td>
                  <td className="px-4 py-2.5 text-[12px] text-[#1E293B] font-medium">{p.qty}</td>
                  <td className="px-4 py-2.5"><Badge text={p.status} /></td>
                </tr>
              ))}
              <tr className="bg-[#F8FAFC]"><td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">Total on Order</td><td></td><td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">9,500 units</td><td></td></tr>
            </tbody>
          </table>
        </div>

        {/* Outbound Allocations */}
        <div className={card}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Outbound Allocations</h3>
            <button className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
          </div>
          <table className="w-full">
            <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className={thCls}>Reference</th><th className={thCls}>Ship By</th><th className={thCls}>Qty</th><th className={thCls}>Status</th>
            </tr></thead>
            <tbody>
              {outboundAlloc.map((o) => (
                <tr key={o.ref} className="border-b border-[#E2E8F0]">
                  <td className="px-4 py-2.5"><p className="text-[12px] font-medium text-[#3B82F6] font-mono">{o.ref}</p><p className="text-[11px] text-[#94A3B8]">{o.customer}</p></td>
                  <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{o.ship}</td>
                  <td className="px-4 py-2.5 text-[12px] text-[#1E293B] font-medium">{o.qty}</td>
                  <td className="px-4 py-2.5"><Badge text={o.status} /></td>
                </tr>
              ))}
              <tr className="bg-[#F8FAFC]"><td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">Total Allocated</td><td></td><td className="px-4 py-2.5 text-[12px] font-semibold text-[#1E293B]">1,245 units</td><td></td></tr>
            </tbody>
          </table>
        </div>

        {/* Forecast */}
        <div className={`${card} p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Forecast <span className="text-[12px] font-normal text-[#94A3B8]">(Next 30 Days)</span></h3>
          </div>
          <div className="flex items-center gap-4 text-[11px] mb-1">
            <span className="flex items-center gap-1 text-[#64748B]"><span className="w-3 h-0.5 bg-[#3B82F6]" /> Forecasted Stock</span>
            <span className="flex items-center gap-1 text-[#64748B]"><span className="w-3 h-0.5 bg-[#EF4444] border-dashed" /> Reorder Point</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-[18px] font-bold text-[#1E293B]">6,200 <span className="text-[11px] font-normal text-[#94A3B8]">units now</span></p>
            <p className="text-[12px] text-[#EF4444] font-medium">Stockout: Jun 7, 2026</p>
          </div>
          <svg viewBox="0 0 380 130" className="w-full h-[130px]">
            {[0, 1, 2, 3].map((i) => <line key={i} x1="10" y1={i * 32 + 10} x2="375" y2={i * 32 + 10} stroke="#F1F5F9" />)}
            <line x1="10" y1="95" x2="375" y2="95" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" />
            <polyline fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"
              points="15,25 70,40 125,55 180,68 235,82 290,98 345,118" />
            {[[15,25],[70,40],[125,55],[180,68],[235,82],[290,98],[345,118]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="3" fill="white" stroke="#3B82F6" strokeWidth="2" />))}
            {["May 18","May 25","Jun 1","Jun 8","Jun 15"].map((l,i)=>(<text key={i} x={20 + i*86} y="128" textAnchor="middle" fontSize="8" fill="#94A3B8">{l}</text>))}
          </svg>
        </div>
      </div>

      {/* Recent Adjustments */}
      <div className={card}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-semibold text-[#1E293B]">Recent Adjustments</h3>
          <button className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all adjustments</button>
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <th className={thCls}>Date</th><th className={thCls}>Type</th><th className={thCls}>Qty</th>
            <th className={thCls}>Location</th><th className={thCls}>Reason</th><th className={thCls}>Adjusted By</th>
          </tr></thead>
          <tbody>
            {adjustments.map((a, i) => (
              <tr key={i} className="border-b border-[#E2E8F0] last:border-b-0">
                <td className="px-4 py-3 text-[12px] text-[#64748B]">{a.date}</td>
                <td className="px-4 py-3"><Badge text={a.type} /></td>
                <td className={`px-4 py-3 text-[12px] font-medium ${a.qty.startsWith("+") ? "text-[#10B981]" : "text-[#EF4444]"}`}>{a.qty}</td>
                <td className="px-4 py-3 text-[12px] text-[#64748B] font-mono">{a.location}</td>
                <td className="px-4 py-3 text-[12px] text-[#64748B]">{a.reason}</td>
                <td className="px-4 py-3 text-[12px] text-[#1E293B]">{a.by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
