"use client";

import { useState } from "react";
import { useToast } from "@/components/dashboard/Toast";
import {
  Mail,
  Bell,
  Settings,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  Shield,
  FileText,
  ChevronDown,
} from "lucide-react";

const prefs = [
  {
    key: "email",
    title: "Email Notifications",
    desc: "Receive email notifications for new orders and updates.",
    icon: Mail,
  },
  {
    key: "inapp",
    title: "In-App Alerts",
    desc: "Push notifications for important system messages.",
    icon: Bell,
  },
  {
    key: "ops",
    title: "Operational Updates",
    desc: "System maintenance and feature announcements.",
    icon: Settings,
  },
  {
    key: "shipment",
    title: "Shipment Exceptions",
    desc: "Alerts for delivery issues and delays.",
    icon: AlertTriangle,
  },
  {
    key: "returns",
    title: "Return Requests",
    desc: "Notifications for customer return submissions.",
    icon: RotateCcw,
  },
  {
    key: "billing",
    title: "Billing Alerts",
    desc: "Payment due dates and invoice updates.",
    icon: CreditCard,
  },
  {
    key: "security",
    title: "Security Notifications",
    desc: "Account security and login activity.",
    icon: Shield,
  },
  {
    key: "weekly",
    title: "Weekly Reports",
    desc: "Summary of weekly performance metrics.",
    icon: FileText,
    hasFrequency: true,
  },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 relative inline-flex h-[24px] w-[44px] items-center rounded-full transition-colors duration-200 ${
        on ? "bg-[#3B82F6]" : "bg-[#CBD5E1]"
      }`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          on ? "translate-x-[23px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(prefs.map((p) => [p.key, true]))
  );
  const [frequency, setFrequency] = useState("Every Monday");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast("Notification preferences saved");
    }, 500);
  };

  return (
    <div className="max-w-[640px]">
      <h2 className="text-[18px] font-semibold text-[#1E293B]">
        Notification Preferences
      </h2>
      <p className="text-[13px] text-[#64748B] mt-1">
        Choose how you want to be notified about important updates.
      </p>

      <div className="mt-5 divide-y divide-[#E2E8F0] border-t border-[#E2E8F0]">
        {prefs.map((p) => {
          const Icon = p.icon;
          const isOn = toggles[p.key];
          return (
            <div key={p.key} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E2E8F0]">
                    <Icon className="w-4 h-4 text-[#475569]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1E293B]">
                      {p.title}
                    </p>
                    <p className="text-[12px] text-[#64748B] mt-0.5 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
                <Toggle
                  on={isOn}
                  onClick={() =>
                    setToggles((t) => ({ ...t, [p.key]: !t[p.key] }))
                  }
                />
              </div>

              {/* Frequency dropdown for Weekly Reports */}
              {p.hasFrequency && isOn && (
                <div className="mt-3 ml-11 flex items-center gap-2">
                  <span className="text-[12px] text-[#64748B]">Frequency:</span>
                  <div className="relative">
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="appearance-none px-3 py-1.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-md text-[12px] text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] cursor-pointer pr-7"
                    >
                      <option>Every Monday</option>
                      <option>Every Friday</option>
                      <option>Every Sunday</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="mt-6 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 text-white rounded-lg text-[14px] font-semibold shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all hover:brightness-110 disabled:opacity-60"
          style={{
            background: "linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
