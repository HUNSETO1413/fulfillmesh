import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft, Check, ExternalLink, ArrowRight,
  Search, Wrench, Warehouse, Truck, DollarSign, FileText,
  Printer, Edit2, Download, Package,
} from "lucide-react";
import { returns as returnsRepo } from "@/lib/repositories";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

/** Neutral placeholder used wherever a returned-item photo would appear. */
function BottleThumb({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#F7FAFC] border border-[#E6EDF5] flex items-center justify-center ${className}`}>
      <Package className="w-1/3 h-1/3 text-[#9AA8B8]" />
    </div>
  );
}

const SUBMITTED_PHOTOS = [0, 1, 2];

const progress = [
  { label: "Submitted", date: "May 18", done: true, active: false },
  { label: "Inspected", date: "May 18", done: false, active: true },
  { label: "Resolved", date: "Pending", done: false, active: false },
  { label: "Closed", date: "Pending", done: false, active: false },
];

const timeline = [
  { text: "Return submitted by customer", time: "May 18, 2025 10:34 AM", done: true },
  { text: "Return received at warehouse", time: "May 18, 2025 02:12 PM", done: true },
  { text: "Inspection completed", time: "May 18, 2025 03:45 PM", done: true },
  { text: "Replacement approved", time: "May 18, 2025 03:45 PM", done: true },
  { text: "Replacement shipped", time: "Pending", done: false },
];

function Field({ label, value, link }: { label: string; value: string; link?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-[#66758C]">{label}</span>
      {link ? (
        <Link href="#" className="font-medium text-[#0057D8] hover:underline">{value}</Link>
      ) : (
        <span className="font-medium text-[#061A3D]">{value}</span>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Return ${id}` };
}

export default async function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ret = await returnsRepo.get(id);
  if (!ret) notFound();

  const refund = ret.refundAmount ?? 0;
  const email = `${ret.customer.toLowerCase().replace(/[^a-z]/g, "")}@example.com`;

  return (
    <div className="space-y-5">
      {/* Back + Breadcrumb */}
      <div>
        <Link href="/dashboard/returns" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4A5A73] hover:text-[#061A3D] mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Returns
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#061A3D]">Return Detail</h1>
          <p className="text-[14px] text-[#4A5A73] mt-0.5">View and manage return request, inspection, and resolution.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#4A5A73]"><Printer className="w-4 h-4" /> Print Label</button>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#4A5A73]"><Edit2 className="w-4 h-4" /> Edit Return</button>
          <button className="inline-flex items-center gap-1 px-4 py-2 bg-[#0057D8] hover:bg-[#003B7A] rounded-lg text-[13px] font-medium text-white"><Check className="w-4 h-4" /> Approve Replacement</button>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
        <div className="grid items-start gap-6" style={{ gridTemplateColumns: "auto 1.6fr 1fr 1.4fr" }}>
          {/* Image */}
          <BottleThumb className="w-20 h-20 rounded-lg shrink-0" />
          {/* ID + fields */}
          <div>
            <p className="text-[11px] text-[#9AA8B8] mb-1">Return ID</p>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[15px] font-bold text-[#061A3D] font-mono">{ret.id}</p>
              <StatusBadge status={ret.status} />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <Field label="Return Date" value={formatDate(ret.requestedDate)} />
              <Field label="Customer" value={ret.customer} />
              <Field label="Order ID" value={ret.orderId} link />
              <Field label="Customer Email" value={email} />
              <Field label="RMA Type" value="Customer Return" />
              <Field label="Customer Location" value="Los Angeles, CA, USA" />
              <Field label="Channel" value="DTC Website" />
              <Field label="Return Source" value="Online Portal" />
            </div>
          </div>
          {/* Summary */}
          <div>
            <p className="text-[11px] font-semibold text-[#061A3D] mb-2">Summary</p>
            <div className="space-y-2">
              <Field label="Items Returned" value={String(ret.items)} />
              <Field label="Refund Amount" value={formatCurrency(refund)} />
              <Field label="Resolution" value="Replacement" />
              <Field label="Status" value={ret.status} />
            </div>
          </div>
          {/* Return Progress */}
          <div>
            <p className="text-[11px] font-semibold text-[#061A3D] mb-3">Return Progress</p>
            <div className="flex items-start">
              {progress.map((p, i) => (
                <div key={p.label} className="flex items-start" style={{ flex: i === progress.length - 1 ? "0 0 auto" : "1 1 0" }}>
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      p.done ? "bg-[#00B894]" : p.active ? "bg-[#0057D8]" : "bg-white border-2 border-[#E6EDF5]"
                    }`}>
                      {p.done ? <Check className="w-3.5 h-3.5 text-white" /> : p.active ? <span className="w-2 h-2 rounded-full bg-white" /> : null}
                    </div>
                    <p className={`text-[10px] mt-1.5 ${p.done || p.active ? "text-[#061A3D] font-medium" : "text-[#9AA8B8]"}`}>{p.label}</p>
                    <p className="text-[9px] text-[#9AA8B8]">{p.date}</p>
                  </div>
                  {i < progress.length - 1 && <div className={`h-0.5 flex-1 mt-3 ${p.done ? "bg-[#00B894]" : "bg-[#E6EDF5]"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Returned Item / Return Reason / Submitted Photos */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.3fr 1.3fr 1fr" }}>
        {/* Returned Item */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[15px] font-semibold text-[#061A3D] px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">Returned Item</h3>
          <div className="p-5">
            <div className="flex gap-3">
              <BottleThumb className="w-14 h-14 rounded-lg shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-[#061A3D]">FM Stainless Steel Water Bottle – 750ml</p>
                  <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#00B894]/10 text-[#00B894]">Good · Light Wear</span>
                </div>
                <p className="text-[11px] text-[#9AA8B8] mt-0.5">SKU: FM-BTL-750-STL</p>
                <div className="grid grid-cols-3 gap-2 mt-3 text-[12px]">
                  <div><p className="text-[#9AA8B8]">Category</p><p className="font-medium text-[#061A3D]">Drinkware</p></div>
                  <div><p className="text-[#9AA8B8]">Usage Period</p><p className="font-medium text-[#061A3D]">~2 weeks</p></div>
                  <div></div>
                  <div><p className="text-[#9AA8B8]">Unit Price</p><p className="font-medium text-[#061A3D]">{formatCurrency(refund)}</p></div>
                  <div><p className="text-[#9AA8B8]">Qty</p><p className="font-medium text-[#061A3D]">{ret.items}</p></div>
                  <div><p className="text-[#9AA8B8]">Total</p><p className="font-medium text-[#061A3D]">{formatCurrency(refund)}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return Reason */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[15px] font-semibold text-[#061A3D] px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">Return Reason</h3>
          <div className="p-5 space-y-2.5 text-[12px]">
            <Field label="Selected Reason" value={ret.reason} />
            <div>
              <p className="text-[#9AA8B8] mb-1">Customer Description</p>
              <p className="text-[#4A5A73] leading-relaxed">Leakage from the cap when filled. Water leaks out of the cap when I tilt it in my bag.</p>
            </div>
            <div>
              <p className="text-[#9AA8B8] mb-1">Additional Comments</p>
              <p className="text-[#4A5A73]">This bottle leaks a little when I fill it.</p>
            </div>
          </div>
        </div>

        {/* Submitted Photos */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
            <h3 className="text-[15px] font-semibold text-[#061A3D]">Submitted Photos <span className="text-[11px] font-normal text-[#9AA8B8]">(3)</span></h3>
            <button className="text-[12px] font-medium text-[#0057D8]">View all</button>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-2">
              {SUBMITTED_PHOTOS.map((n) => (
                <BottleThumb key={n} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Issue Classification / Inspection / Resolution / Warehouse */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
        {/* Issue Classification */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><Search className="w-4 h-4 text-[#7C6FF6]" /><h3 className="text-[14px] font-semibold text-[#061A3D]">Issue Classification</h3></div>
          <div className="space-y-2">
            <Field label="Issue Category" value="Quality / Defect" />
            <Field label="Issue Type" value="Leakage" />
            <div className="flex items-center justify-between text-[12px]"><span className="text-[#66758C]">Severity</span><span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F59E0B]/10 text-[#F59E0B]">Medium</span></div>
            <Field label="Affects Multiple Units?" value="No" />
            <Field label="Corrective Action" value="Inspect supplier" />
          </div>
        </div>

        {/* Inspection Results */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#F59E0B]" /><h3 className="text-[14px] font-semibold text-[#061A3D]">Inspection Results</h3></div>
            <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EF4444]/10 text-[#EF4444]">Failed</span>
          </div>
          <div className="space-y-2">
            <Field label="Inspection Date" value="May 18, 2025" />
            <Field label="Inspected By" value="Emily Chen" />
            <Field label="Inspection Type" value="Physical Inspection" />
            <Field label="Checks Performed" value="8" />
            <Field label="Checks Passed" value="6" />
          </div>
        </div>

        {/* Resolution */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Wrench className="w-4 h-4 text-[#00B894]" /><h3 className="text-[14px] font-semibold text-[#061A3D]">Resolution</h3></div>
            <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#00B894]/10 text-[#00B894]">Replacement Approved</span>
          </div>
          <div className="space-y-2">
            <Field label="Resolution Type" value="Replacement" />
            <Field label="Replacement Item" value="FM Water Bottle" />
            <Field label="Replacement SKU" value="FM-BTL-750-STL" />
            <Field label="Replacement Qty" value="1" />
            <Field label="Approved By" value="Emily Chen" />
          </div>
        </div>

        {/* Warehouse / Restock */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><Warehouse className="w-4 h-4 text-[#0057D8]" /><h3 className="text-[14px] font-semibold text-[#061A3D]">Warehouse / Restock</h3></div>
          <div className="space-y-2">
            <Field label="Return Received At" value="Los Angeles, CA" />
            <Field label="Received Date" value="May 18, 2025" />
            <div className="flex items-center justify-between text-[12px]"><span className="text-[#66758C]">Condition (Warehouse)</span><span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EF4444]/10 text-[#EF4444]">Used – Not Resalable</span></div>
            <Field label="Restock Location" value="Quarantine" />
            <Field label="Disposition" value="Pending" />
          </div>
        </div>
      </div>

      {/* Shipping & Return Label / Timeline / Financial Impact / Notes */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.3fr 1.3fr 1fr 1fr" }}>
        {/* Shipping & Return Label */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
            <Truck className="w-4 h-4 text-[#0057D8]" />
            <h3 className="text-[15px] font-semibold text-[#061A3D]">Shipping &amp; Return Label</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
              <Field label="Return Carrier" value="UPS" />
              <Field label="Shipping Method" value="UPS Ground" />
              <div className="flex items-center justify-between text-[12px] col-span-2">
                <span className="text-[#66758C]">Tracking</span>
                <Link href="#" className="font-medium text-[#0057D8] flex items-center gap-1 hover:underline">1Z999AA10123456784 <ExternalLink className="w-3 h-3" /></Link>
              </div>
              <Field label="Label Created" value="May 18, 2025" />
              <Field label="Estimated Delivery" value="May 21, 2025" />
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[12px] font-medium text-[#4A5A73] hover:bg-[#F7FAFC]"><Download className="w-4 h-4" /> Download Label</button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <h3 className="text-[15px] font-semibold text-[#061A3D] px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">Timeline</h3>
          <div className="p-5">
            <div className="relative pl-5">
              <div className="absolute left-[6px] top-1 bottom-3 w-px bg-[#E6EDF5]" />
              {timeline.map((t, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div className={`absolute -left-5 top-0.5 w-3 h-3 rounded-full border-2 ${t.done ? "bg-[#00B894] border-[#00B894]" : "bg-white border-[#9AA8B8]"}`} />
                  <p className="text-[12px] font-semibold text-[#061A3D]">{t.text}</p>
                  <p className="text-[10px] text-[#9AA8B8]">{t.time}</p>
                </div>
              ))}
            </div>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-2">View full timeline <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Financial Impact */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
            <DollarSign className="w-4 h-4 text-[#00B894]" />
            <h3 className="text-[15px] font-semibold text-[#061A3D]">Financial Impact</h3>
          </div>
          <div className="p-5">
            <div className="space-y-2.5 text-[12px]">
              <div><p className="text-[#9AA8B8]">Refund Amount</p><p className="font-bold text-[#061A3D]">{formatCurrency(refund)}</p></div>
              <div><p className="text-[#9AA8B8]">Return Shipping Cost</p><p className="font-bold text-[#EF4444]">$4.80</p></div>
              <div><p className="text-[#9AA8B8]">Net Impact</p><p className="font-bold text-[#EF4444]">{formatCurrency(refund + 4.8)}</p></div>
              <div><p className="text-[#9AA8B8]">Recovery Value</p><p className="font-bold text-[#061A3D]">$0.00</p></div>
              <div><p className="text-[#9AA8B8]">Restocking Fee</p><p className="font-bold text-[#061A3D]">$0.00</p></div>
              <div className="pt-2 border-t border-[#E6EDF5]"><p className="text-[#9AA8B8]">Total Impact</p><p className="font-bold text-[#EF4444]">{formatCurrency(refund + 4.8)}</p></div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#F7FAFC] border-b border-[#E6EDF5]">
            <h3 className="text-[15px] font-semibold text-[#061A3D]">Notes</h3>
            <button className="text-[12px] font-medium text-[#0057D8] flex items-center gap-1"><Edit2 className="w-3 h-3" /> Edit Note</button>
          </div>
          <div className="p-5">
            <p className="text-[10px] text-[#9AA8B8]">May 18, 2025 03:45 PM · Emily Chen</p>
            <p className="text-[12px] text-[#4A5A73] mt-2 leading-relaxed">Customer reported leakage issue. Inspection confirmed defective cap seal. Replacement approved.</p>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">Add Note <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
