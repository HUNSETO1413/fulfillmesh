"use client";

import Link from "next/link";
import {
  ArrowLeft, Check, ArrowRight,
  Package, CheckCircle2, Plane, DollarSign, Download, Phone, AlertTriangle,
} from "lucide-react";

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

export default function ShipmentDetailPage() {
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
        <div className="grid items-start gap-6" style={{ gridTemplateColumns: "1.4fr 1fr 1.4fr 1fr 1fr" }}>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Tracking Number</p>
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-bold text-[#061A3D] font-mono">FMUS25051800123</p>
            </div>
            <span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded mt-2" style={{ backgroundColor: "#00B8941A", color: "#00B894" }}>Delivered</span>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Carrier</p>
            <p className="text-[14px] font-semibold text-[#061A3D]">FedEx Express</p>
            <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-2">Tracking via FedEx <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Route</p>
            <div className="flex items-center gap-3">
              <div className="text-[13px]">
                <p className="text-[#061A3D] font-medium">Shenzhen, CN</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#9AA8B8]" />
              <div className="text-[13px]">
                <p className="text-[#061A3D] font-medium">Los Angeles, US</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">ETA</p>
            <p className="text-[14px] font-bold text-[#00B894]">May 16, 2025</p>
            <p className="text-[11px] text-[#4A5A73] mt-1">Delivered on May 16, 2025</p>
            <p className="text-[11px] text-[#9AA8B8]">10:42 AM (PDT)</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9AA8B8] mb-1">Shipment ID</p>
            <p className="text-[14px] font-semibold text-[#061A3D]">SHP-2025-0518-00123</p>
            <p className="text-[11px] text-[#9AA8B8] mt-1">Created: May 12, 2025</p>
            <p className="text-[11px] text-[#9AA8B8]">By: System</p>
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
          <p className="text-[18px] font-bold text-[#00B894]">Delivered</p>
          <p className="text-[11px] text-[#9AA8B8] mt-1">Shipment completed successfully</p>
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
              <text x="70" y="135" textAnchor="middle" fontSize="9" fontWeight="600" fill="#061A3D">Shenzhen, CN</text>
              {/* destination marker + flag */}
              <g transform="translate(330,95)">
                <circle r="6" fill="#0057D8" />
                <circle r="11" fill="none" stroke="#0057D8" strokeWidth="1" opacity="0.4" />
                <rect x="6" y="-20" width="14" height="10" fill="#3C3B6E" />
                <line x1="6" y1="-20" x2="6" y2="-2" stroke="#9AA8B8" strokeWidth="1" />
              </g>
              <text x="330" y="120" textAnchor="middle" fontSize="9" fontWeight="600" fill="#061A3D">Los Angeles, US</text>
            </svg>
            {/* On Time / Est ETA overlay */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-lg border border-[#E6EDF5] shadow-sm px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B894]" />
                <span className="text-[12px] font-semibold text-[#00B894]">On Time</span>
              </div>
              <p className="text-[10px] text-[#9AA8B8] mt-0.5">Est. ETA May 16, 2025</p>
            </div>
          </div>
        </div>

        {/* Customs & Clearance */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Customs &amp; Clearance</h3>
          {/* region map thumbnail */}
          <div className="rounded-lg h-[88px] mb-3 relative overflow-hidden border border-[#E6EDF5]" style={{ background: "linear-gradient(135deg,#EFF6FF 0%,#F7FAFC 100%)" }}>
            <svg viewBox="0 0 240 88" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <path d="M150,18 q30,-8 55,4 q18,14 10,34 q-26,16 -56,6 q-26,-10 -9,-44 z" fill="#DCE7F4" />
              <path d="M155,30 q22,-4 40,6 q12,12 4,26" fill="none" stroke="#CBD8EA" strokeWidth="1" />
              <circle cx="186" cy="40" r="5" fill="#0057D8" />
              <circle cx="186" cy="40" r="9" fill="none" stroke="#0057D8" strokeWidth="1" opacity="0.4" />
            </svg>
            <div className="absolute bottom-2 left-2.5 bg-white/95 rounded px-2 py-0.5 text-[10px] font-medium text-[#061A3D] border border-[#E6EDF5]">Port of Los Angeles</div>
          </div>
          <div className="space-y-2.5 text-[12px]">
            <div className="flex justify-between"><span className="text-[#66758C]">Customs Status</span><span className="font-medium text-[#00B894]">Cleared</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Country of Export</span><span className="font-medium text-[#061A3D]">China</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Country of Import</span><span className="font-medium text-[#061A3D]">United States</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">HS Code</span><span className="font-medium text-[#061A3D]">8471.30.0100</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Duties &amp; Taxes</span><span className="font-medium text-[#061A3D]">$0.00</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Cleared On</span><span className="font-medium text-[#061A3D]">May 15, 2025 11:05</span></div>
          </div>
          <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Documents <ArrowRight className="w-3 h-3" /></Link>
        </div>

        {/* Proof of Delivery */}
        <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
          <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Proof of Delivery</h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded mb-2" style={{ backgroundColor: "#00B8941A", color: "#00B894" }}><Check className="w-3 h-3" /> Delivered May 16, 2025 at 10:42 AM (PDT)</span>
          <div className="mt-2 rounded-lg border border-[#E6EDF5] bg-[#F7FAFC] h-[80px] flex items-center justify-center">
            <span className="text-[11px] text-[#9AA8B8] italic" style={{ fontFamily: "cursive" }}>J. Martinez</span>
          </div>
          <div className="mt-3 space-y-1.5 text-[12px]">
            <div className="flex justify-between"><span className="text-[#66758C]">Signed by</span><span className="font-medium text-[#061A3D]">J. Martinez</span></div>
            <div className="flex justify-between"><span className="text-[#66758C]">Location</span><span className="font-medium text-[#061A3D]">Los Angeles, CA, USA</span></div>
          </div>
          <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Full POD <ArrowRight className="w-3 h-3" /></Link>
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

          <div className="bg-white rounded-xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[15px] font-semibold text-[#061A3D] mb-3">Linked Order</h3>
            <div className="flex items-center justify-between mb-3">
              <Link href="/dashboard/orders/ORD-10458" className="text-[15px] font-bold text-[#0057D8] hover:underline">ORD-10458</Link>
              <span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded" style={{ backgroundColor: "#00B8941A", color: "#00B894" }}>Delivered</span>
            </div>
            <div className="space-y-1.5 text-[12px]">
              <div className="flex justify-between"><span className="text-[#66758C]">Customer</span><span className="font-medium text-[#061A3D]">Acme Retail</span></div>
              <div className="flex justify-between"><span className="text-[#66758C]">Order Date</span><span className="font-medium text-[#061A3D]">May 12, 2025</span></div>
              <div className="flex justify-between"><span className="text-[#66758C]">Items</span><span className="font-medium text-[#061A3D]">8 SKUs</span></div>
              <div className="flex justify-between"><span className="text-[#66758C]">Order Total</span><span className="font-medium text-[#061A3D]">$3,248.00</span></div>
            </div>
            <Link href="/dashboard/orders/ORD-10458" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0057D8] mt-3">View Order Details <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
