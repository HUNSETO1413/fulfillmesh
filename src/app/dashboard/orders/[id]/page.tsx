import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft, Calendar, ChevronDown, Check, ArrowRight, Edit2,
  FileText, Download, Filter, MessageSquare,
} from "lucide-react";
import { orders as ordersRepo } from "@/lib/repositories";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

const steps = ["Confirmed", "Processing", "Ready", "Shipped", "Delivered"];
const currentStep = 2; // Ready

const timeline = [
  { title: "Order Confirmed", time: "May 18, 2025 11:24 AM", desc: "Order verified by customer", done: true },
  { title: "Payment Received", time: "May 18, 2025 10:42 AM", desc: "Payment was successful", done: true },
  { title: "Inventory Allocated", time: "May 18, 2025 10:24 AM", desc: "All items have been allocated", done: true },
  { title: "Order Ready to Ship", time: "May 18, 2025 09:50 AM", desc: "Awaiting carrier pickup", done: false },
];

const activity = [
  { date: "May 18, 2025 11:18 AM", user: "Sarah Johnson", action: "Status Updated", details: "Order status changed to Ready to Ship" },
  { date: "May 18, 2025 11:02 AM", user: "System", action: "Inventory Allocated", details: "Items allocated across 2 warehouses" },
  { date: "May 18, 2025 10:28 AM", user: "John Smith", action: "Payment Received", details: "Payment received via Visa **** 4242" },
  { date: "May 18, 2025 10:08 AM", user: "John Smith", action: "Order Created", details: "Order was placed via Web Store" },
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id}` };
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = ordersRepo.get(id);
  if (!order) notFound();
  const orderItems = order.items ?? [];
  const itemCount = orderItems.reduce((sum, it) => sum + it.quantity, 0);
  const skuCount = orderItems.length;
  const initials = order.customer.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div>
        <Link href="/dashboard/orders" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#1E293B] mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#1E293B]">Order Detail</h1>
            <p className="text-[14px] text-[#64748B] mt-0.5">View and manage order information, items, fulfillment, and customer details.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <Calendar className="w-4 h-4" /> May 12 – May 18, 2025 <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="px-3.5 py-2 bg-white border border-[#3B82F6] rounded-lg text-[13px] font-medium text-[#3B82F6] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">Edit Order</button>
            <button className="px-3.5 py-2 bg-white border border-[#EF4444] rounded-lg text-[13px] font-medium text-[#EF4444] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">Cancel Order</button>
            <button className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">+ Create Shipment</button>
          </div>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
        <div className="grid items-start gap-6" style={{ gridTemplateColumns: "1.1fr 1.1fr 1.1fr 1.6fr 1fr" }}>
          {/* Order ID */}
          <div>
            <p className="text-[12px] text-[#94A3B8] mb-1">Order ID</p>
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-bold text-[#1E293B]">{order.id}</p>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-[12px] text-[#64748B] mt-3"><span className="text-[#94A3B8]">Order Date</span>&nbsp;&nbsp;{formatDate(order.date)}</p>
            <p className="text-[12px] text-[#64748B] mt-1.5"><span className="text-[#94A3B8]">Source</span>&nbsp;&nbsp;{order.channel ?? "Web Store"}</p>
          </div>
          {/* Customer */}
          <div>
            <p className="text-[12px] text-[#94A3B8] mb-1">Customer</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[12px] font-bold flex items-center justify-center">{initials}</div>
              <div>
                <p className="text-[14px] font-semibold text-[#1E293B]">{order.customer}</p>
                <p className="text-[11px] text-[#94A3B8]">{order.customer.toLowerCase().replace(/[^a-z]/g, "")}@example.com</p>
              </div>
            </div>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3">View Customer <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {/* Payment Status */}
          <div>
            <p className="text-[12px] text-[#94A3B8] mb-1">Payment Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: "#10B9811A", color: "#10B981" }}>Paid</span>
            <p className="text-[12px] text-[#64748B] mt-2">Paid on {formatDate(order.date)}</p>
            <p className="text-[13px] font-semibold text-[#1E293B]">{formatCurrency(order.total)} USD</p>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-2">View Payment <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {/* Fulfillment Status */}
          <div>
            <p className="text-[12px] text-[#94A3B8] mb-1">Fulfillment Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: "#3B82F61A", color: "#3B82F6" }}>Ready to Ship</span>
            {/* Stepper */}
            <div className="mt-4 flex items-center">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center" style={{ flex: i === steps.length - 1 ? "0 0 auto" : "1 1 0" }}>
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i <= currentStep ? "bg-[#3B82F6]" : "bg-white border-2 border-[#E2E8F0]"}`}>
                      {i <= currentStep && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i < currentStep ? "bg-[#3B82F6]" : "bg-[#E2E8F0]"}`} />}
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between">
              {steps.map((s, i) => (
                <span key={s} className={`text-[10px] ${i <= currentStep ? "text-[#1E293B] font-medium" : "text-[#94A3B8]"}`}>{s}</span>
              ))}
            </div>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3">View Fulfillment <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {/* Total */}
          <div className="text-right">
            <p className="text-[12px] text-[#94A3B8] mb-1">Total Amount</p>
            <p className="text-[22px] font-bold text-[#1E293B]">{formatCurrency(order.total)} <span className="text-[12px] font-medium text-[#94A3B8]">USD</span></p>
            <p className="text-[12px] text-[#64748B] mt-1">{itemCount} items · {skuCount} SKUs</p>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3">View Summary <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>
      </div>

      {/* Items + Addresses row */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
        {/* Order Items */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[14px] font-semibold text-[#1E293B] px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">Order Items <span className="text-[12px] font-normal text-[#94A3B8]">({skuCount} SKUs, {itemCount} items)</span></h3>
          <div className="p-5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Item</th>
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">SKU</th>
                  <th className="text-right text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Unit Price</th>
                  <th className="text-right text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Qty</th>
                  <th className="text-right text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((it) => (
                  <tr key={it.sku} className="border-b border-[#F1F5F9] last:border-b-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] shrink-0 border border-[#E2E8F0]" />
                        <div>
                          <p className="text-[13px] font-medium text-[#1E293B]">{it.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[12px] text-[#64748B] font-mono">{it.sku}</td>
                    <td className="py-3 text-[13px] text-[#1E293B] text-right">{formatCurrency(it.unitPrice)}</td>
                    <td className="py-3 text-[13px] text-[#1E293B] text-right">{it.quantity}</td>
                    <td className="py-3 text-[13px] font-semibold text-[#1E293B] text-right">{formatCurrency(it.unitPrice * it.quantity)}</td>
                  </tr>
                ))}
                {orderItems.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-[12px] text-[#94A3B8]">No line items recorded for this order.</td></tr>
                )}
              </tbody>
            </table>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3">View all items <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Shipping Address</h3>
            <button className="text-[12px] font-medium text-[#3B82F6]">Edit</button>
          </div>
          <div className="text-[13px] text-[#64748B] space-y-0.5">
            <p className="font-medium text-[#1E293B]">John Smith</p>
            <p>Acme Retail</p>
            <p>742 Evergreen Terrace</p>
            <p>Springfield, IL 62704</p>
            <p>United States</p>
            <p className="pt-2">Phone: +1 (217) 555-0198</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[13px] space-y-1">
            <p><span className="text-[#94A3B8]">Shipping Method</span></p>
            <span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded bg-[#F1F5F9] text-[#64748B]">Standard (Ocean)</span>
            <p className="pt-2"><span className="text-[#94A3B8]">Estimated Delivery</span></p>
            <p className="text-[#1E293B] font-medium">May 26 – May 30, 2025</p>
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Billing Address</h3>
            <button className="text-[12px] font-medium text-[#3B82F6]">Edit</button>
          </div>
          <div className="text-[13px] text-[#64748B] space-y-0.5">
            <p className="font-medium text-[#1E293B]">Acme Retail</p>
            <p>Accounts Payable</p>
            <p>742 Evergreen Terrace</p>
            <p>Springfield, IL 62704</p>
            <p>United States</p>
            <p className="pt-2">Email: billing@acmeretail.com</p>
            <p>Phone: +1 (217) 555-0199</p>
          </div>
        </div>
      </div>

      {/* Linked Shipment / Timeline / Notes / Documents / Cost row */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}>
        {/* Linked Shipment */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[14px] font-semibold text-[#1E293B] px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">Linked Shipment</h3>
          <div className="p-5 pt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full mb-4" style={{ backgroundColor: "#F59E0B1A", color: "#F59E0B" }}>Ready to Create</span>
            <div className="text-center py-4">
              <p className="text-[12px] text-[#94A3B8] mb-3">No shipment has been created for this order yet.</p>
              <button className="w-full px-3 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[12px] font-medium text-white">Create Shipment</button>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[14px] font-semibold text-[#1E293B] px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">Order Timeline</h3>
          <div className="p-5">
            <div className="relative pl-5">
              <div className="absolute left-[6px] top-1 bottom-3 w-px bg-[#E2E8F0]" />
              {timeline.map((t, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div className={`absolute -left-5 top-0.5 w-3 h-3 rounded-full border-2 ${t.done ? "bg-[#10B981] border-[#10B981]" : "bg-white border-[#3B82F6]"}`} />
                  <p className="text-[12px] font-semibold text-[#1E293B]">{t.title}</p>
                  <p className="text-[10px] text-[#94A3B8]">{t.time}</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-2">View full timeline <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Notes</h3>
            <button className="text-[12px] font-medium text-[#3B82F6] flex items-center gap-1"><Edit2 className="w-3 h-3" /> Edit</button>
          </div>
          <div className="p-5">
            <div className="rounded-lg bg-[#FFFBEB] border border-[#FDE68A] p-3 mb-3">
              <p className="text-[11px] font-medium text-[#92400E]">Customer Note</p>
              <p className="text-[11px] text-[#78350F] mt-1">Please gift wrap all items. This is a corporate order.</p>
            </div>
            <p className="text-[10px] text-[#94A3B8]">May 18, 2025 10:24 AM</p>
            <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
              <p className="text-[11px] font-medium text-[#1E293B]">Internal Note</p>
              <p className="text-[11px] text-[#64748B] mt-1">Expedite shipping if possible. Customer has an event on May 27.</p>
            </div>
            <button className="text-[12px] font-medium text-[#3B82F6] mt-3">+ Add Note</button>
          </div>
        </div>

        {/* Attached Documents */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[14px] font-semibold text-[#1E293B] px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">Attached Documents</h3>
          <div className="p-5">
            <div className="space-y-2">
              {[
                { name: "Purchase Order.pdf", meta: "Uploaded May 18, 2025 · 245 KB" },
                { name: "Packing List.pdf", meta: "Uploaded May 18, 2025 · 98 KB" },
                { name: "Payment Receipt.pdf", meta: "Uploaded May 18, 2025 · 112 KB" },
              ].map((d) => (
                <div key={d.name} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-[#EF4444]" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#1E293B] truncate">{d.name}</p>
                    <p className="text-[10px] text-[#94A3B8] truncate">{d.meta}</p>
                  </div>
                  <button className="text-[#94A3B8] hover:text-[#64748B] shrink-0"><Download className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button className="text-[12px] font-medium text-[#3B82F6] mt-3">Upload Document</button>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[14px] font-semibold text-[#1E293B] px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">Cost Summary</h3>
          <div className="p-5">
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="text-[#64748B]">Item Subtotal</span><span className="text-[#1E293B] font-medium">$1,155.72</span></div>
              <div className="flex justify-between"><span className="text-[#64748B]">Shipping Cost</span><span className="text-[#1E293B] font-medium">$45.00</span></div>
              <div className="flex justify-between"><span className="text-[#64748B]">Tax (3.75%)</span><span className="text-[#1E293B] font-medium">$45.08</span></div>
              <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-[#E2E8F0]"><span className="text-[13px] text-[#1E293B] font-semibold">Total</span><span className="text-[15px] text-[#1E293B] font-bold">$1,245.80 <span className="text-[11px] font-medium text-[#94A3B8]">USD</span></span></div>
            </div>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3">View Cost Breakdown <ArrowRight className="w-3 h-3" /></Link>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
              <p className="text-[12px] font-medium text-[#1E293B] mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6]">Corporate Order</span>
                <span className="inline-flex px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">Gift Wrap</span>
                <span className="inline-flex px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-[#EF4444]/10 text-[#EF4444]">Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity History + Related Tickets */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr" }}>
        {/* Activity History */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Activity History</h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[12px] text-[#64748B]">All Activities <ChevronDown className="w-3 h-3" /></button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[12px] text-[#64748B]"><Filter className="w-3 h-3" /> Filters</button>
            </div>
          </div>
          <div className="p-5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Date &amp; Time</th>
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">User</th>
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Activity</th>
                  <th className="text-left text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider pb-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((a, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9] last:border-b-0">
                    <td className="py-2.5 text-[12px] text-[#64748B]">{a.date}</td>
                    <td className="py-2.5 text-[12px] text-[#1E293B] font-medium">{a.user}</td>
                    <td className="py-2.5 text-[12px] text-[#64748B]">{a.action}</td>
                    <td className="py-2.5 text-[12px] text-[#64748B]">{a.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] mt-3">View all activity <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Related Tickets & Messages */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1E293B]">Related Tickets &amp; Messages</h3>
            <button className="text-[12px] font-medium text-[#3B82F6]">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { icon: "T", color: "#3B82F6", title: "Request for expedited shipping", id: "#TKT-2025-0518-001", desc: "Customer requested if we can expedite the shipping due to event.", status: "Open", statusColor: "#10B981", date: "May 18, 2025" },
              { icon: "M", color: "#8B5CF6", title: "Re: Order confirmation", id: "", desc: "Acme Retail: Thank you for the confirmation. Please ensure...", status: "Resolved", statusColor: "#64748B", date: "May 18, 2025" },
            ].map((t, i) => (
              <div key={i} className="flex gap-3 pb-3 border-b border-[#F1F5F9] last:border-b-0 last:pb-0">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-semibold" style={{ backgroundColor: `${t.color}1A`, color: t.color }}>{t.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-semibold text-[#1E293B]">{t.title}</p>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0" style={{ backgroundColor: `${t.statusColor}1A`, color: t.statusColor }}>{t.status}</span>
                  </div>
                  {t.id && <p className="text-[10px] text-[#94A3B8]">{t.id}</p>}
                  <p className="text-[11px] text-[#64748B] mt-1">{t.desc}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="text-[12px] font-medium text-[#3B82F6] mt-3 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> New Message</button>
        </div>
      </div>
    </div>
  );
}
