"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Settings,
  Users,
  Warehouse,
  Truck,
  Bell,
  CreditCard,
  Plug,
  Shield,
  MoreVertical,
  Download,
  Loader2,
} from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToJson } from "@/lib/client";

const settingsNav = [
  { label: "General", icon: Settings, href: "/dashboard/settings" },
  { label: "Users", icon: Users, href: "/dashboard/settings/users" },
  { label: "Warehouses", icon: Warehouse, href: "/dashboard/settings/warehouses" },
  { label: "Carriers", icon: Truck, href: "/dashboard/settings/carriers" },
  { label: "Notifications", icon: Bell, href: "/dashboard/settings/notifications" },
  { label: "Billing", icon: CreditCard, href: "/dashboard/settings/billing" },
  { label: "Integrations", icon: Plug, href: "/dashboard/settings/integrations" },
  { label: "Security", icon: Shield, href: "/dashboard/settings/security" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [range, setRange] = useState("May 12 - May 18, 2025");

  // "More options" dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  async function exportAllSettings() {
    setExporting(true);
    try {
      const data = await api.get<Record<string, unknown>>("/api/settings");
      exportToJson("fulfillmesh-settings", data);
      toast("Settings exported as JSON");
      setMenuOpen(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not export settings", "error");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Settings</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Manage your account and system settings.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <DateRangeMenu
            value={range}
            presets={["May 12 - May 18, 2025", "Last 7 days", "Last 30 days", "This quarter", "Year to date"]}
            onSelect={(r) => { setRange(r); toast(`Range set to ${r}`, "info"); }}
          />
          <button onClick={() => toast("No new settings notifications", "info")} className="flex items-center justify-center w-9 h-9 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors" aria-label="Notifications">
            <Bell className="w-[18px] h-[18px]" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={`flex items-center justify-center w-9 h-9 bg-white border rounded-lg transition-colors ${
                menuOpen ? "border-[#0057D8] text-[#0057D8]" : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
              }`}
              aria-label="More options"
            >
              <MoreVertical className="w-[18px] h-[18px]" />
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 mt-1 z-20 w-56 bg-white rounded-lg border border-[#E2E8F0] shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-1">
                <button
                  role="menuitem"
                  onClick={exportAllSettings}
                  disabled={exporting}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 text-[13px] text-[#1E293B] hover:bg-[#F8FAFC] disabled:opacity-60"
                >
                  {exporting ? <Loader2 className="w-4 h-4 animate-spin text-[#94A3B8]" /> : <Download className="w-4 h-4 text-[#94A3B8]" />}
                  {exporting ? "Exporting…" : "Export all settings"}
                </button>
                <a
                  role="menuitem"
                  href="/dashboard/settings/security"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 text-[13px] text-[#1E293B] hover:bg-[#F8FAFC]"
                >
                  <Shield className="w-4 h-4 text-[#94A3B8]" />
                  Security settings
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Shell Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex">
        {/* Left Sub Nav */}
        <div className="w-[220px] shrink-0 border-r border-[#E2E8F0] p-4">
          <nav className="space-y-1">
            {settingsNav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                    active
                      ? "bg-[#0057D8]/10 text-[#0057D8] font-medium"
                      : "text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1 min-w-0 p-6">{children}</div>
      </div>
    </div>
  );
}
