import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft, Check, ArrowRight,
  Package, CheckCircle2, Plane, DollarSign, Download, Phone, AlertTriangle, User, Tag,
} from "lucide-react";
import { shipments as shipmentsRepo } from "@/lib/repositories";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate } from "@/lib/format";

const progress = [
  { label: "Label Created", date: "May 12, 09:14", done: true },
  { label: "Picked Up", date: "May 13, 14:32", done: true },
  { label: "In Transit", date: "May 14, 03:20", done: true },
  { label: "Customs Cleared", date: "May 15, 11:05", done: true },
  { label: "Delivered", date: "May 16, 10:42", done: true },
];

const trackingEvents = [
  { date: "May 16, 2025 10:42 AM", loc: "Los Angeles, CA, USA", event: "Delivered", eventColor: "#00B894", details: "Package delivered to recipient" },
  { date: "May 16, 2025 07:58 AM", loc: "Los Angeles, CA, USA", event: "Out for Delivery", eventColor: "#F59E0B", details: "Out for delivery with courier" },
  { date: "May 15, 2025 09:20 PM", loc: "Los Angeles, CA, USA", event: "Arrived at Facility", eventColor: "#0057D8", details: "Arrived at FedEx facility" },
  { date: "May 15, 2025 11:08 AM", loc: "Los Angeles, CA, USA", event: "Customs Cleared", eventColor: "#0057D8", details: "Clearance completed" },
  { date: "May 14, 2025 03:21 AM", loc: "Anchorage, AK, USA", event: "In Transit", eventColor: "#0057D8", details: "Departed FedEx hub" },
  { date: "May 13, 2025 14:32 PM", loc: "Shenzhen, China", event: "Picked Up", eventColor: "#0057D8", details: "Picked up by FedEx" },
  { date: "May 13, 2025 09:14 AM", loc: "Shenzhen, China", event: "Label Created", eventColor: "#7C6FF6", details: "Shipment information received" },
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Shipment ${id}` };
}

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shipment = await shipmentsRepo.get(id);
  if (!shipment) notFound();

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div>
        <Link href="/dashboard/shipments" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#66758C] hover:text-[#061A3D] mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Shipments
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#061A3D]">Shipment Detail</h1>
            <p className="text-[14px] text-[#4A5A73] mt-0.5">View real-time tracking, shipment status, and delivery information.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#0057D8] rounded-lg text-[13px] font-medium text-[#0057D8]"><Download className="w-4 h-4" /> Download Label</button>
            <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#66758C]"><Phone className="w-4 h-4" /> Contact Carrier</button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0057D8] hover:bg-[#003B7A] rounded-lg text-[13px] font-medium text-white"><AlertTriangle className="w-4 h-4" /> Report Issue</button>
          </div>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
        <div className="grid items-start" style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))", gap: "20px" }}>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Shipment ID</p>
            <p className="text-[14px] font-semibold text-[#061A3D] font-mono">{shipment.id}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Carrier</p>
            <p className="text-[14px] font-semibold text-[#061A3D]">{shipment.carrier}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Origin</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{shipment.origin}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Destination</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{shipment.destination}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Date</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{shipment.shippedDate ? formatDate(shipment.shippedDate) : "—"}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Status</p>
            <StatusBadge status={shipment.status} />
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Weight</p>
            <p className="text-[13px] font-medium text-[#061A3D]">{shipment.weight ?? "—"}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Dimensions</p>
            <p className="text-[13px] font-medium text-[#061A3D]">120 x 80 x 60 cm</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Cost</p>
            <p className="text-[14px] font-bold text-[#061A3D]">$512.48</p>
          </div>
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><Package className="w-4 h-4 text-[#0057D8]" /><span className="text-[13px] font-semibold text-[#061A3D]">Package Summary</span></div>
          <div className="grid grid-cols-4 gap-2">
            {[["12", "Total Packages"], ["48.6 kg", "Total Weight"], ["1.23 m³", "Total Volume"], ["8", "Items"]].map(([v, l]) => (
              <div key={l}><p className="text-[16px] font-bold text-[#061A3D]">{v}</p><p className="text-[10px] text-[#9AA8B8]">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><CheckCircle2 className="w-4 h-4 text-[#00B894]" /><span className="text-[13px] font-semibold text-[#061A3D]">Shipment Status</span></div>
          <p className="text-[18px] font-bold text-[#00B894]">{shipment.status}</p>
          <p className="text-[11px] text-[#9AA8B8] mt-1">Current shipment status</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><Plane className="w-4 h-4 text-[#0057D8]" /><span className="text-[13px] font-semibold text-[#061A3D]">Service Level</span></div>
          <p className="text-[18px] font-bold text-[#061A3D]">Express (Air)</p>
          <p className="text-[11px] text-[#9AA8B8] mt-1">5 – 7 business days</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center gap-2 mb-3"><DollarSign className="w-4 h-4 text-[#00B894]" /><span className="text-[13px] font-semibold text-[#061A3D]">Cost Summary</span></div>
          <p className="text-[18px] font-bold text-[#061A3D]">$512.48</p>
          <p className="text-[11px] text-[#9AA8B8] mt-1">Total Shipping Cost</p>
        </div>
      </div>

      {/* Progress + Customs + POD */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
        {/* Shipment Progress + map */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-5">Shipment Progress</h3>
          <div className="flex items-start mb-4">
            {progress.map((p, i) => (
              <div key={p.label} className="flex items-start" style={{ flex: i === progress.length - 1 ? "0 0 auto" : "1 1 0" }}>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#00B894] flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>
                  <p className="text-[11px] font-medium text-[#061A3D] mt-2 text-center whitespace-nowrap">{p.label}</p>
                  <p className="text-[10px] text-[#9AA8B8] text-center whitespace-nowrap">{p.date}</p>
                </div>
                {i < progress.length - 1 && <div className="h-0.5 flex-1 bg-[#00B894] mt-3.5" />}
              </div>
            ))}
          </div>
          {/* Route map: origin -> destination with flag markers + On Time overlay */}
          <div className="mt-4 rounded-lg h-[200px] relative overflow-hidden border border-[#E6EDF5]" style={{ background: "linear-gradient(135deg,#EFF6FF 0%,#F7FAFC 100%)" }}>
            <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              {/* simplified continents */}
              <path d="M20,70 q30,-20 70,-10 q40,10 50,40 q-10,30 -50,30 q-50,5 -70,-20 z" fill="#DCE7F4" />
              <path d="M250,60 q40,-15 90,5 q30,25 20,55 q-40,25 -90,10 q-40,-15 -20,-75 z" fill="#DCE7F4" />
              {/* route arc */}
              <path d="M70,110 Q200,30 330,95" fill="none" stroke="#0057D8" strokeWidth="2" strokeDasharray="5 4" />
              {/* plane along route */}
              <path d="M198,58 l11,5 l-11,5 l3,-5 z" fill="#0057D8" />
              {/* origin marker + flag */}
              <g transform="translate(70,110)">
                <circle r="6" fill="#EF4444" />
                <circle r="11" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.4" />
                <rect x="6" y="-20" width="14" height="10" fill="#DE2910" />
                <line x1="6" y1="-20" x2="6" y2="-2" stroke="#9AA8B8" strokeWidth="1" />
              </g>
              <text x="70" y="135" textAnchor="middle" fontSize="9" fontWeight="600" fill="#061A3D">{shipment.origin}</text>
              {/* destination marker + flag */}
              <g transform="translate(330,95)">
                <circle r="6" fill="#0057D8" />
                <circle r="11" fill="none" stroke="#0057D8" strokeWidth="1" opacity="0.4" />
                <rect x="6" y="-20" width="14" height="10" fill="#3C3B6E" />
                <line x1="6" y1="-20" x2="6" y2="-2" stroke="#9AA8B8" strokeWidth="1" />
              </g>
              <text x="330" y="120" textAnchor="middle" fontSize="9" fontWeight="600" fill="#061A3D">{shipment.destination}</text>
            </svg>
            {/* On Time / Est ETA overlay */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-lg border border-[#E6EDF5] shadow-sm px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B894]" />
                <span className="text-[12px] font-semibold text-[#00B894]">On Time</span>
              </div>
              <p className="text-[10px] text-[#9AA8B8] mt-0.5">Est. ETA {shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : "—"}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Customer Information</h3>
          {/* Customer avatar placeholder */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
              <User className="w-5 h-5 text-[#0057D8]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#061A3D]">Acme Retail</p>
              <p className="text-[11px] text-[#9AA8B8]">Customer since Jan 2024</p>
            </div>
          </div>
          <div className="space-y-2.5 text-[12px]">
            <div className="flex justify-between"><span className="text-[#66758C]">Contact Name</span><span className="font-medium text-[#061A3D]">John Smith</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Email</span><span className="font-medium text-[#061A3D]">john@acmeretail.com</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Phone</span><span className="font-medium text-[#061A3D]">+1 (310) 555-0142</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Address</span><span className="font-medium text-[#061A3D] text-right max-w-[140px]">1234 Commerce Blvd, Los Angeles, CA 90001</span></div>
          </div>
          <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Customer Profile <ArrowRight className="w-3 h-3" /></Link>
        </div>

        {/* Shipping Label */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Shipping Label</h3>
          {/* Label preview */}
          <div className="rounded-lg border border-[#E6EDF5] bg-[#F7FAFC] h-[88px] flex flex-col items-center justify-center mb-3">
            <Tag className="w-6 h-6 text-[#9AA8B8] mb-1" />
            <p className="text-[11px] text-[#9AA8B8] font-mono">{shipment.trackingNumber}</p>
          </div>
          <div className="space-y-2.5 text-[12px]">
            <div className="flex justify-between"><span className="text-[#66758C]">Label Type</span><span className="font-medium text-[#061A3D]">Master Label</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Service</span><span className="font-medium text-[#061A3D]">{shipment.carrier}</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Created</span><span className="font-medium text-[#061A3D]">{shipment.shippedDate ? formatDate(shipment.shippedDate) : "—"}</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Format</span><span className="font-medium text-[#061A3D]">PDF (4x6 in)</span></div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0057D8] rounded text-[12px] font-medium text-white hover:bg-[#003B7A]"><Download className="w-3.5 h-3.5" /> Download</button>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8]">Print Label <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>
      </div>

      {/* Tracking events + sidebar */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr" }}>
        {/* Tracking Events */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Tracking Events</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6EDF5]">
                <th className="text-left text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider pb-2">Date &amp; Time</th>
                <th className="text-left text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider pb-2">Location</th>
                <th className="text-left text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider pb-2">Status</th>
                <th className="text-left text-[11px] font-medium text-[#9AA8B8] uppercase tracking-wider pb-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {trackingEvents.map((e, i) => (
                <tr key={i} className="border-b border-[#F1F5F9] last:border-b-0">
                  <td className="py-2.5 text-[12px] text-[#66758C]">{e.date}</td>
                  <td className="py-2.5 text-[12px] text-[#061A3D]">{e.loc}</td>
                  <td className="py-2.5 text-[12px] font-medium" style={{ color: e.eventColor }}>{e.event}</td>
                  <td className="py-2.5 text-[12px] text-[#66758C]">{e.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Full Tracking History <ArrowRight className="w-3 h-3" /></Link>
        </div>

        {/* Sidebar: cost breakdown + linked order */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Shipping Cost Breakdown</h3>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="text-[#66758C]">Base Shipping Rate</span><span className="font-medium text-[#061A3D]">$420.00</span></div>
              <div className="flex justify-between"><span className="text-[#66758C]">Fuel Surcharge</span><span className="font-medium text-[#061A3D]">$42.00</span></div>
              <div className="flex justify-between"><span className="text-[#66758C]">Residential Delivery</span><span className="font-medium text-[#061A3D]">$15.00</span></div>
              <div className="flex justify-between"><span className="text-[#66758C]">Insurance</span><span className="font-medium text-[#061A3D]">$30.00</span></div>
              <div className="flex justify-between"><span className="text-[#66758C]">Other Fees</span><span className="font-medium text-[#061A3D]">$5.48</span></div>
              <div className="flex justify-between pt-2 border-t border-[#E6EDF5]"><span className="font-semibold text-[#061A3D]">Total</span><span className="font-bold text-[#061A3D]">$512.48</span></div>
            </div>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Cost Details <ArrowRight className="w-3 h-3" /></Link>
          </div>

          {shipment.orderId && (
            <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
              <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Linked Order</h3>
              <div className="flex items-center justify-between mb-3">
                <Link href={`/dashboard/orders/${shipment.orderId}`} className="text-[15px] font-bold text-[#0057D8] hover:underline">{shipment.orderId}</Link>
                <StatusBadge status={shipment.status} />
              </div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between"><span className="text-[#66758C]">Customer</span><span className="font-medium text-[#061A3D]">Acme Retail</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Order Date</span><span className="font-medium text-[#061A3D]">{shipment.shippedDate ? formatDate(shipment.shippedDate) : "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Items</span><span className="font-medium text-[#061A3D]">8 SKUs</span></div>
                <div className="flex justify-between"><span className="text-[#66758C]">Order Total</span><span className="font-medium text-[#061A3D]">$3,248.00</span></div>
              </div>
              <Link href={`/dashboard/orders/${shipment.orderId}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Order Details <ArrowRight className="w-3 h-3" /></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
