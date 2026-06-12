"use client";

import { useState } from "react";
import {
  Bell,
  Settings,
  CheckCheck,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Truck,
  AlertTriangle,
  PackageCheck,
  ClipboardCheck,
  FileText,
  Wrench,
  CreditCard,
  UserPlus,
  Mail,
  Trash2,
  Archive,
} from "lucide-react";

const tabs = [
  { label: "All", count: 128 },
  { label: "Unread", count: 3 },
  { label: "Orders", count: 25 },
  { label: "Inventory", count: 18 },
  { label: "Shipments", count: 28 },
  { label: "System", count: 22 },
  { label: "Billing", count: 10 },
  { label: "Other", count: 12 },
];

const notifications = [
  { icon: Truck, color: "#0057D8", title: "Shipment SO-102876 has been shipped", desc: "Order has been shipped via FedEx. Tracking #: 1Z999AA10123456784", time: "10:24 AM", unread: true },
  { icon: AlertTriangle, color: "#F59E0B", title: "Low stock alert: SKU-10023", desc: "Product \"Wireless Headphones\" is below reorder point at ATL1.", time: "09:58 AM", unread: true },
  { icon: PackageCheck, color: "#00B894", title: "Inbound receipt completed", desc: "Receipt PO-50672 has been received at DFW1.", time: "09:15 AM", unread: true },
  { icon: ClipboardCheck, color: "#7C6FF6", title: "Cycle count CC-000124 completed", desc: "Cycle count for zone B at LAX1 has been completed.", time: "Yesterday 06:45 PM", unread: false },
  { icon: FileText, color: "#0057D8", title: "Order SO-102865 placed", desc: "A new order has been placed by customer James Carter.", time: "Yesterday 04:32 PM", unread: false },
  { icon: Truck, color: "#0057D8", title: "Return RMA-7788 received", desc: "Return for order SO-100154 has been received and inspected.", time: "Yesterday 02:10 PM", unread: false },
  { icon: FileText, color: "#007F8C", title: "Document uploaded", desc: "\"Warehouse Safety Guide\" was uploaded by Michael Brown.", time: "Yesterday 11:05 AM", unread: false },
  { icon: Wrench, color: "#64748B", title: "System maintenance scheduled", desc: "Platform maintenance scheduled for Jun 5, 2025, 2:00 AM – 4:00 AM EST.", time: "May 29, 09:00 AM", unread: false },
  { icon: CreditCard, color: "#F59E0B", title: "Invoice INV-2041 generated", desc: "A new invoice has been generated for customer Acme Retail.", time: "May 29, 08:14 AM", unread: false },
  { icon: ClipboardCheck, color: "#00B894", title: "Putaway PA-00219 completed", desc: "Putaway task at MIA1 has been completed.", time: "May 28, 03:48 PM", unread: false },
  { icon: UserPlus, color: "#7C6FF6", title: "New message from James Carter", desc: "You have a new message regarding PO-102876.", time: "May 28, 01:22 PM", unread: false },
];

const summary = [
  { label: "Orders", value: "24", pct: 19, color: "#0057D8" },
  { label: "Inventory", value: "32", pct: 25, color: "#00B894" },
  { label: "Shipments", value: "28", pct: 22, color: "#F59E0B" },
  { label: "System", value: "22", pct: 17, color: "#7C6FF6" },
  { label: "Billing", value: "10", pct: 8, color: "#EF4444" },
  { label: "Other", value: "12", pct: 9, color: "#007F8C" },
];

const unread = [
  { icon: Truck, color: "#0057D8", title: "Shipment SO-102876 shipped", time: "10:24 AM" },
  { icon: AlertTriangle, color: "#F59E0B", title: "Low stock alert: SKU-10023", time: "09:58 AM" },
  { icon: PackageCheck, color: "#00B894", title: "Inbound receipt completed", time: "09:15 AM" },
];

const preferences = [
  { label: "Order Updates", on: true },
  { label: "Inventory Alerts", on: true },
  { label: "Shipment Tracking", on: true },
  { label: "System Notices", on: false },
  { label: "Billing Reminders", on: true },
];

const quickActions = [
  { label: "Mark all as read", icon: CheckCheck },
  { label: "Email digest settings", icon: Mail },
  { label: "Archive all read", icon: Archive },
  { label: "Clear notifications", icon: Trash2 },
];

export default function NotificationsPage() {
  const [active, setActive] = useState("All");
  const [prefs, setPrefs] = useState(preferences);

  let offset = 0;
  const C = 2 * Math.PI * 40;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <nav className="flex items-center gap-1.5 mb-1.5 text-[12px]">
            <a href="/dashboard" className="text-text-muted hover:text-action-blue">Dashboard</a>
            <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            <span className="font-medium text-text-primary">Notifications</span>
          </nav>
          <h1 className="text-[24px] font-semibold text-text-primary flex items-center gap-2">
            <Bell className="w-6 h-6 text-action-blue" />
            Notifications
          </h1>
          <p className="text-[14px] text-text-body mt-1">Stay updated on important alerts and activities across your operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-muted shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-muted shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg transition-colors">
            <Settings className="w-4 h-4" /> Notification Settings
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-soft">
        <div className="flex items-center" style={{ gap: "28px" }}>
          {tabs.map((t) => (
            <button
              key={t.label}
              onClick={() => setActive(t.label)}
              className={`relative flex items-center gap-1.5 pb-3 text-[14px] font-medium transition-colors whitespace-nowrap ${
                active === t.label
                  ? "text-action-blue"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {t.label}
              <span
                className={`text-[11px] font-semibold px-1.5 min-w-[20px] text-center rounded-full ${
                  active === t.label
                    ? "bg-action-blue text-white"
                    : "bg-soft-bg text-text-light"
                }`}
              >
                {t.count}
              </span>
              {active === t.label && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-action-blue rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main: list + right rail */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* List card */}
        <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          {/* Search / filter bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg transition-colors">
              Most Recent <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notification rows */}
          <div>
            {notifications.map((n, i) => {
              const Icon = n.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-4 px-5 py-4 border-b border-border-soft/50 last:border-b-0 hover:bg-soft-bg/60 transition-colors cursor-pointer ${
                    n.unread ? "bg-[#EFF6FF]" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${n.color}1A` }}
                  >
                    <Icon className="w-[18px] h-[18px]" style={{ color: n.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] leading-snug ${n.unread ? "font-semibold text-text-primary" : "font-medium text-[#334155]"}`}>
                      {n.title}
                    </p>
                    <p className="text-[12px] text-text-muted mt-1 leading-relaxed truncate">{n.desc}</p>
                  </div>

                  {/* Time + unread dot */}
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className="text-[12px] text-text-light whitespace-nowrap">{n.time}</span>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-action-blue" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-border-soft">
            <p className="text-[13px] text-text-muted">Showing 1 to 10 of 128 notifications</p>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-action-blue text-white text-[13px] font-medium">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted text-[13px] hover:bg-soft-bg transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted text-[13px] hover:bg-soft-bg transition-colors">3</button>
              <span className="px-1 text-[13px] text-text-light">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted text-[13px] hover:bg-soft-bg transition-colors">12</button>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          {/* Notification Summary */}
          <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Notification Summary</h3>
            <div className="flex justify-center mb-5">
              <div className="relative w-[140px] h-[140px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {summary.map((s, i) => {
                    const dash = `${(s.pct / 100) * C} ${C - (s.pct / 100) * C}`;
                    const el = (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={s.color}
                        strokeWidth="12"
                        strokeDasharray={dash}
                        strokeDashoffset={-(offset / 100) * C}
                      />
                    );
                    offset += s.pct;
                    return el;
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[20px] font-bold text-text-primary">128</p>
                  <p className="text-[11px] text-text-light">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {summary.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-text-muted">{s.label}</span>
                  </div>
                  <span className="font-medium text-text-primary">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unread Notifications */}
          <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Unread Notifications</h3>
              <span className="text-[11px] font-semibold bg-action-blue text-white px-2 py-0.5 rounded-full">{unread.length}</span>
            </div>
            <div className="space-y-3">
              {unread.map((u, i) => {
                const Icon = u.icon;
                return (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-soft-bg transition-colors cursor-pointer">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${u.color}1A` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: u.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-text-primary truncate">{u.title}</p>
                      <p className="text-[12px] text-text-light mt-0.5">{u.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {prefs.map((p, i) => (
                <div key={p.label} className="flex items-center justify-between">
                  <span className="text-[13px] text-text-muted">{p.label}</span>
                  <button
                    onClick={() => setPrefs((cur) => cur.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))}
                    className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${
                      p.on ? "bg-teal" : "bg-[#CBD5E1]"
                    }`}
                  >
                    <span
                      className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
                        p.on ? "left-[22px]" : "left-[3px]"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Quick Actions</h3>
            <div className="space-y-1">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-action-blue font-medium hover:bg-[#EFF6FF] transition-colors"
                  >
                    <Icon className="w-4 h-4 text-action-blue" /> {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA band */}
      <div className="gradient-cta rounded-xl px-8 py-6 flex items-center justify-between gap-6">
        <div>
          <h3 className="text-[18px] font-semibold text-white">Never miss what matters</h3>
          <p className="text-[14px] text-white/80 mt-1">
            Customize your notification preferences and stay on top of every alert across your operations.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[14px] font-semibold text-teal hover:bg-white/90 whitespace-nowrap shrink-0 shadow-button transition-colors">
          <Settings className="w-4 h-4" /> Manage Preferences
        </button>
      </div>
    </div>
  );
}
