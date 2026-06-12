"use client";

import { CreditCard, User2, Crown, Package, Truck, HardDrive, Activity, Download, ChevronDown } from "lucide-react";

const usage = [
  { label: "Orders Processed", value: "2,450", of: "of 5,000", pct: 49, icon: Package },
  { label: "Shipments", value: "2,180", of: "of 5,000", pct: 44, icon: Truck },
  { label: "Storage Used", value: "1,250", of: "of 2,000 units", pct: 63, icon: HardDrive },
  { label: "API Requests", value: "125,300", of: "of 250,000", pct: 50, icon: Activity },
];

const invoices = [
  { id: "INV-2025-0518", date: "May 18, 2025", amount: "$299.00" },
  { id: "INV-2025-0418", date: "Apr 18, 2025", amount: "$299.00" },
  { id: "INV-2025-0318", date: "Mar 18, 2025", amount: "$299.00" },
  { id: "INV-2025-0218", date: "Feb 18, 2025", amount: "$299.00" },
  { id: "INV-2025-0118", date: "Jan 18, 2025", amount: "$299.00" },
];

export default function BillingPage() {
  return (
    <div>
      <h2 className="text-[20px] font-semibold text-text-primary">Billing &amp; Subscription</h2>
      <p className="text-[14px] text-text-body mt-1">
        Manage your account and subscription settings
      </p>

      {/* Top 3 cards */}
      <div className="grid grid-cols-3 gap-5 mt-6">
        {/* Current Plan */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[14px] font-medium text-[#6B7280]">
            <Crown className="w-5 h-5 text-[#F59E0B]" />
            Current Plan
          </div>
          <p className="text-[18px] font-bold text-[#1F2937] mt-3">Professional</p>
          <p className="text-[16px] font-semibold text-[#1F2937]">$299 / month</p>
          <div className="border-t border-[#E5E7EB] mt-3 pt-3 space-y-2">
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[#6B7280]">Billing Cycle</span>
              <span className="text-[#1F2937] font-semibold">Monthly</span>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[#6B7280]">Renewal Date</span>
              <span className="text-[#1F2937] font-semibold">June 18, 2025</span>
            </div>
          </div>
          <button className="w-full mt-4 py-2 text-[14px] font-medium text-[#374151] bg-[#F3F4F6] border border-[#D1D5DB] rounded-md hover:bg-[#E5E7EB] transition-colors">
            View Plan
          </button>
        </div>

        {/* Payment Method */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[14px] font-medium text-[#6B7280]">
            <CreditCard className="w-5 h-5 text-[#4F46E5]" />
            Payment Method
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-12 h-8 rounded bg-[#1E3A8A] flex items-center justify-center text-white text-[11px] font-bold italic tracking-wide">
              VISA
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#1F2937]">Visa ending in 4242</p>
              <p className="text-[13px] text-[#6B7280]">Expires 04/2027</p>
            </div>
          </div>
          <button className="w-full mt-[52px] py-2 text-[14px] font-medium text-white bg-[#3B82F6] rounded-md hover:bg-[#2563EB] transition-colors">
            Update Payment Method
          </button>
        </div>

        {/* Billing Contact */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[14px] font-medium text-[#6B7280]">
            <User2 className="w-5 h-5 text-[#10B981]" />
            Billing Contact
          </div>
          <div className="mt-3 text-[14px] leading-[20px]">
            <p className="font-semibold text-[#1F2937]">Sarah Johnson</p>
            <p className="text-[#6B7280]">sarah.johnson@fulfillmesh.com</p>
            <p className="text-[#6B7280]">+1 (555) 123-4567</p>
            <p className="font-semibold text-[#1F2937] mt-2">FulfillMesh Co.</p>
            <p className="text-[#6B7280]">123 Logistics Way</p>
            <p className="text-[#6B7280]">Suite 400</p>
            <p className="text-[#6B7280]">Austin, TX 78701</p>
            <p className="text-[#6B7280]">United States</p>
          </div>
          <button className="w-full mt-3 py-2 text-[14px] font-medium text-[#374151] bg-[#F3F4F6] border border-[#D1D5DB] rounded-md hover:bg-[#E5E7EB] transition-colors">
            Edit Contact
          </button>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#1F2937]">Usage Overview</h3>
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-1.5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-[14px] text-[#6B7280] font-medium focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {usage.map((u) => {
            const Icon = u.icon;
            return (
              <div key={u.label} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#6B7280]">
                  <Icon className="w-5 h-5 text-[#6366F1]" />
                  {u.label}
                </div>
                <p className="text-[28px] font-bold text-[#1F2937] mt-2">{u.value}</p>
                <p className="text-[14px] text-[#6B7280]">{u.of}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-[6px] bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-full bg-[#6366F1] rounded-full" style={{ width: `${u.pct}%` }} />
                  </div>
                  <span className="text-[14px] font-medium text-[#6B7280]">{u.pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice History */}
      <div className="mt-6">
        <h3 className="text-[16px] font-semibold text-[#1F2937] mb-4">Invoice History</h3>
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left text-[14px] font-semibold text-[#374151] px-5 py-3">Invoice #</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-5 py-3">Issue Date</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-5 py-3">Amount</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-5 py-3">Status</th>
                <th className="text-right text-[14px] font-semibold text-[#374151] px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]/50 transition-colors">
                  <td className="px-5 py-3 text-[14px] font-medium text-[#1F2937] font-mono">{inv.id}</td>
                  <td className="px-5 py-3 text-[14px] text-[#6B7280]">{inv.date}</td>
                  <td className="px-5 py-3 text-[14px] font-medium text-[#1F2937]">{inv.amount}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex px-2 py-0.5 bg-[#10B981] text-white text-[12px] font-medium rounded">Paid</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] hover:text-[#2563EB] hover:underline transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center py-3 border-t border-[#E5E7EB]">
            <a href="#" className="text-[14px] font-medium text-[#3B82F6] hover:text-[#2563EB] hover:underline">View All Invoices &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  );
}
