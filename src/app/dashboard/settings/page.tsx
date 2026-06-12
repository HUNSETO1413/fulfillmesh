"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function GeneralSettingsPage() {
  const [companyName, setCompanyName] = useState("FulfillMesh Co.");
  const [timezone, setTimezone] = useState("(UTC-05:00) Eastern Time (US & Canada)");
  const [dateFormat, setDateFormat] = useState("May 18, 2025 (MMMM D, YYYY)");
  const [currency, setCurrency] = useState("USD - US Dollar ($)");

  const inputClasses =
    "w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0057D8]/20 focus:border-[#0057D8] transition-colors";
  const selectClasses =
    "w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0057D8]/20 focus:border-[#0057D8] appearance-none pr-10 transition-colors cursor-pointer";

  return (
    <div className="max-w-[640px]">
      {/* Section Heading */}
      <h2 className="text-[20px] font-semibold text-[#1E293B]">General Settings</h2>
      <p className="text-[14px] text-[#64748B] mt-1">
        Manage your account and system settings
      </p>

      <div className="mt-5 divide-y divide-[#E2E8F0] border-t border-[#E2E8F0]">
        {/* Company Name */}
        <div className="py-5">
          <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={inputClasses}
          />
          <p className="text-[12px] text-[#94A3B8] mt-1.5">
            Your company&apos;s legal name
          </p>
        </div>

        {/* Time Zone */}
        <div className="py-5">
          <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
            Time Zone
          </label>
          <div className="relative">
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className={selectClasses}
            >
              <option>(UTC-05:00) Eastern Time (US &amp; Canada)</option>
              <option>(UTC-08:00) Pacific Time (US &amp; Canada)</option>
              <option>(UTC+00:00) London, Edinburgh</option>
              <option>(UTC+08:00) Beijing, Shanghai</option>
              <option>(UTC+09:00) Tokyo, Osaka</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[12px] text-[#94A3B8] mt-1.5">
            Select the time zone for your business
          </p>
        </div>

        {/* Date Format */}
        <div className="py-5">
          <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
            Date Format
          </label>
          <div className="relative">
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className={selectClasses}
            >
              <option>May 18, 2025 (MMMM D, YYYY)</option>
              <option>05/18/2025 (MM/DD/YYYY)</option>
              <option>18/05/2025 (DD/MM/YYYY)</option>
              <option>2025-05-18 (YYYY-MM-DD)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[12px] text-[#94A3B8] mt-1.5">
            Choose how dates are displayed (e.g., MM/DD/YYYY)
          </p>
        </div>

        {/* Currency */}
        <div className="py-5">
          <label className="block text-[14px] font-medium text-[#1E293B] mb-1.5">
            Currency
          </label>
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={selectClasses}
            >
              <option>USD - US Dollar ($)</option>
              <option>EUR - Euro (&euro;)</option>
              <option>GBP - British Pound (&pound;)</option>
              <option>CNY - Chinese Yuan (&yen;)</option>
              <option>JPY - Japanese Yen (&yen;)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[12px] text-[#94A3B8] mt-1.5">
            Set the default currency for transactions
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 pt-2">
        <button className="px-5 py-2.5 gradient-cta text-white rounded-lg text-[14px] font-medium hover:brightness-110 shadow-button transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}
