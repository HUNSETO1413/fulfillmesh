"use client";

import {
  Activity, User, Settings as SettingsIcon, Shield, Search, ChevronDown,
  Download, ArrowUpRight, ArrowDownRight, AlertTriangle, Smartphone, Monitor, Tablet,
  ChevronLeft, ChevronRight, SlidersHorizontal, Calendar,
} from "lucide-react";

/* ---------------- data ---------------- */

const stats = [
  { title: "Total Events", value: "24,856", change: "18.6%", dir: "up", icon: Activity, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "User Actions", value: "18,742", change: "15.3%", dir: "up", icon: User, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
  { title: "System Events", value: "5,213", change: "22.7%", dir: "up", icon: SettingsIcon, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Security Events", value: "601", change: "3.2%", dir: "down", icon: Shield, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
];

type EvType = "User Action" | "System Event" | "Security Event";
const evTypeStyle: Record<EvType, string> = {
  "User Action": "bg-[#0057D8]/10 text-[#0057D8]",
  "System Event": "bg-[#7C6FF6]/10 text-[#7C6FF6]",
  "Security Event": "bg-[#EF4444]/10 text-[#EF4444]",
};

type ActStyle = "create" | "update" | "delete" | "view" | "login" | "fail" | "default";
function actionStyle(s: ActStyle) {
  return {
    create: "bg-[#00B894]/10 text-[#00B894]",
    update: "bg-[#0057D8]/10 text-[#0057D8]",
    delete: "bg-[#EF4444]/10 text-[#EF4444]",
    view: "bg-[#64748B]/10 text-[#64748B]",
    login: "bg-[#007F8C]/10 text-[#007F8C]",
    fail: "bg-[#EF4444]/10 text-[#EF4444]",
    default: "bg-[#F59E0B]/10 text-[#F59E0B]",
  }[s];
}

const logs: {
  date: string; time: string; user: string; role: string; avatar: string;
  type: EvType; action: string; act: ActStyle; resource: string; resSub: string;
  details: string; ip: string; status: "Success" | "Failed";
}[] = [
  { date: "May 31, 2026", time: "09:42:18 AM", user: "John Smith", role: "Admin", avatar: "#0057D8", type: "User Action", action: "Updated", act: "update", resource: "Order #ISO-10876", resSub: "Order", details: "Updated order status from Processing to Shipped", ip: "192.168.1.45", status: "Success" },
  { date: "May 31, 2026", time: "09:12:46 AM", user: "Sarah Rodriguez", role: "Operations Manager", avatar: "#00B894", type: "User Action", action: "Created", act: "create", resource: "Inbound #IB-3421", resSub: "Inbound", details: "Created new inbound shipment", ip: "192.168.1.62", status: "Success" },
  { date: "May 31, 2026", time: "08:51:02 AM", user: "Michael Davis", role: "Warehouse Manager", avatar: "#7C6FF6", type: "User Action", action: "Updated", act: "update", resource: "Inventory Item SKU-10920", resSub: "Inventory", details: "Adjusted quantity from 240 to 218", ip: "192.168.1.81", status: "Success" },
  { date: "May 31, 2026", time: "08:33:55 AM", user: "Emily Watson", role: "Inventory Manager", avatar: "#F59E0B", type: "User Action", action: "Created", act: "create", resource: "Inventory Item SKU-11203", resSub: "Inventory", details: "Created new inventory item", ip: "192.168.1.90", status: "Success" },
  { date: "May 31, 2026", time: "08:05:47 AM", user: "Alex Chen", role: "Supervisor", avatar: "#EC4899", type: "User Action", action: "Assigned", act: "default", resource: "Task #TSK-3040", resSub: "Task", details: "Assigned task to Tyler Brown", ip: "192.168.1.33", status: "Success" },
  { date: "May 31, 2026", time: "07:48:12 AM", user: "System", role: "Team Lead", avatar: "#64748B", type: "System Event", action: "Login", act: "login", resource: "Auth", resSub: "System", details: "User login successful", ip: "192.168.1.20", status: "Success" },
  { date: "May 31, 2026", time: "07:30:09 AM", user: "John Smith", role: "Admin", avatar: "#0057D8", type: "System Event", action: "Export", act: "default", resource: "Report Orders Summary", resSub: "Report", details: "Exported report to CSV", ip: "192.168.1.45", status: "Success" },
  { date: "May 31, 2026", time: "06:00:00 AM", user: "System", role: "System", avatar: "#64748B", type: "System Event", action: "Backup", act: "default", resource: "Database Backup", resSub: "System", details: "Scheduled backup completed", ip: "10.0.0.1", status: "Success" },
  { date: "May 31, 2026", time: "05:42:31 AM", user: "System", role: "System", avatar: "#64748B", type: "Security Event", action: "Failed Login", act: "fail", resource: "User Login", resSub: "Auth", details: "Failed login attempt", ip: "203.0.113.42", status: "Failed" },
  { date: "May 30, 2026", time: "11:58:20 PM", user: "Lisa White", role: "Operator", avatar: "#007F8C", type: "User Action", action: "Scanned", act: "view", resource: "Outbound #OB-5502", resSub: "Outbound", details: "Scanned tracking number", ip: "192.168.1.48", status: "Success" },
  { date: "May 30, 2026", time: "11:30:14 PM", user: "Noah Garcia", role: "Operator", avatar: "#F97316", type: "User Action", action: "Updated", act: "update", resource: "Location A11-02-B", resSub: "Location", details: "Updated bin location", ip: "192.168.1.51", status: "Success" },
  { date: "May 30, 2026", time: "10:15:08 PM", user: "Ava Harris", role: "Billing Specialist", avatar: "#84CC16", type: "Security Event", action: "Permission Change", act: "delete", resource: "Role: Operator", resSub: "Security", details: "Permission updated", ip: "192.168.1.71", status: "Success" },
  { date: "May 30, 2026", time: "09:48:55 PM", user: "System", role: "System", avatar: "#64748B", type: "System Event", action: "Config", act: "default", resource: "System Settings", resSub: "System", details: "Configuration updated", ip: "10.0.0.1", status: "Success" },
  { date: "May 30, 2026", time: "09:12:40 PM", user: "Robert Black", role: "Viewer", avatar: "#64748B", type: "User Action", action: "Viewed", act: "view", resource: "Dashboard SOP", resSub: "Report", details: "Viewed document", ip: "192.168.1.95", status: "Success" },
];

const eventSummary = [
  { name: "User Actions", count: 18742, color: "#0057D8" },
  { name: "System Events", count: 5213, color: "#7C6FF6" },
  { name: "Security Events", count: 601, color: "#EF4444" },
  { name: "Other Events", count: 300, color: "#94A3B8" },
];

const eventTypes = [
  { name: "Created", count: "6,243", color: "#00B894" },
  { name: "Updated", count: "9,801", color: "#0057D8" },
  { name: "Deleted", count: "1,066", color: "#EF4444" },
  { name: "Viewed", count: "3,890", color: "#64748B" },
  { name: "Exported", count: "1,204", color: "#F59E0B" },
  { name: "Login", count: "2,150", color: "#007F8C" },
  { name: "Failed Login", count: "502", color: "#F97316" },
];

const topUsers = [
  { name: "John Smith", count: "3,240", color: "#0057D8" },
  { name: "Michael Davis", count: "2,118", color: "#7C6FF6" },
  { name: "Sarah Rodriguez", count: "1,902", color: "#00B894" },
  { name: "Emily Watson", count: "1,455", color: "#F59E0B" },
  { name: "Alex Chen", count: "1,201", color: "#EC4899" },
];

const securityEvents = [
  { title: "Failed login attempt", sub: "203.0.113.42", time: "May 31, 2026 05:42 AM" },
  { title: "Failed login attempt", sub: "198.51.100.7", time: "May 30, 2026 11:18 PM" },
  { title: "Permission change", sub: "Administrator role updated", time: "May 30, 2026 10:15 PM" },
];

const mobileAccess = [
  { name: "Desktop", pct: 62, count: "15,411", color: "#0057D8", icon: Monitor },
  { name: "Mobile", pct: 28, count: "6,960", color: "#00B894", icon: Smartphone },
  { name: "Tablet", pct: 10, count: "2,485", color: "#7C6FF6", icon: Tablet },
];

/* ---------------- components ---------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${className}`}>{children}</div>;
}

function FilterButton({ label, icon: Icon }: { label: string; icon?: React.ElementType }) {
  return (
    <button className="inline-flex items-center gap-2 px-3 py-2 text-[13px] text-text-muted border border-border-soft rounded-lg bg-white hover:bg-soft-bg whitespace-nowrap">
      {Icon && <Icon className="w-4 h-4 text-text-light" />}
      {label} <ChevronDown className="w-3.5 h-3.5 text-[#9AA8B8]" />
    </button>
  );
}

export default function AuditLogsPage() {
  const total = eventSummary.reduce((a, b) => a + b.count, 0);
  const hourBars = [4, 7, 12, 9, 15, 22, 28, 31, 26, 19, 24, 30, 35, 29, 33, 27, 21, 18, 14, 11, 8, 6, 5, 3];
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 mb-1.5 text-[12px]">
            <a href="/dashboard" className="text-text-muted hover:text-action-blue">Dashboard</a>
            <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            <span className="font-medium text-text-primary">Audit Logs</span>
          </nav>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold text-text-primary">Audit Logs</h1>
            <Shield className="w-5 h-5 text-teal" />
          </div>
          <p className="text-[14px] text-text-muted mt-0.5">Track user activities and system events for security and compliance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-soft bg-white text-text-body text-[13px] font-medium hover:bg-soft-bg shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Download className="w-4 h-4 text-text-light" /> Export Logs
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action-blue text-white text-[13px] font-medium hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <SettingsIcon className="w-4 h-4" /> Retention Settings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-lg border border-border-soft shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-text-muted">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-text-primary leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {s.dir === "up" ? <ArrowUpRight className="w-3.5 h-3.5 text-teal" /> : <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
                <span className={`text-[12px] font-medium ${s.dir === "up" ? "text-teal" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-text-light">vs last 30 days</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border-soft p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input placeholder="Search by user, action, resource, or details..." className="w-full pl-9 pr-4 py-2 border border-border-soft rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20" />
        </div>
        <FilterButton label="May 1 – May 31, 2026" icon={Calendar} />
        <FilterButton label="All Event Types" />
        <FilterButton label="All Users" />
        <FilterButton label="All Statuses" />
        <FilterButton label="Filters" icon={SlidersHorizontal} />
      </div>

      {/* Main: table + sidebar */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Table card */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-soft-bg border-b border-border-soft">
                  {["Time", "User", "Event Type", "Action", "Resource", "Details", "IP Address", "Status"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((l, i) => (
                  <tr key={i} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="text-[13px] text-text-primary">{l.date}</div>
                      <div className="text-[11px] text-text-light">{l.time}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0" style={{ backgroundColor: l.avatar }}>
                          {l.user.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-text-primary whitespace-nowrap">{l.user}</div>
                          <div className="text-[11px] text-text-light">{l.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-[12px] font-medium rounded-md ${evTypeStyle[l.type]} whitespace-nowrap`}>{l.type}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-[12px] font-medium rounded-md ${actionStyle(l.act)} whitespace-nowrap`}>{l.action}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-[13px] text-action-blue font-medium whitespace-nowrap">{l.resource}</div>
                      <div className="text-[11px] text-text-light">{l.resSub}</div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-text-body max-w-[200px]">{l.details}</td>
                    <td className="px-5 py-3.5 text-[13px] text-text-body font-mono whitespace-nowrap">{l.ip}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-[12px] font-medium rounded-md ${l.status === "Success" ? "bg-[#00B894]/10 text-[#00B894]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>{l.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-border-soft">
            <p className="text-[13px] text-text-muted">Showing 1 to 15 of 24,856 events</p>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-light hover:bg-soft-bg"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-action-blue text-white text-[13px] font-medium">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted text-[13px] hover:bg-soft-bg">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted text-[13px] hover:bg-soft-bg">3</button>
              <span className="px-1 text-[13px] text-text-light">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted text-[13px] hover:bg-soft-bg">1658</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-light hover:bg-soft-bg"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Event Summary donut */}
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Event Summary</h3>
            <div className="flex justify-center mb-5">
              <div className="relative w-[140px] h-[140px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {(() => {
                    let off = 0;
                    return eventSummary.map((e, i) => {
                      const pct = (e.count / total) * 100;
                      const dash = `${(pct / 100) * circumference} ${circumference - (pct / 100) * circumference}`;
                      const el = (
                        <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={e.color} strokeWidth="12"
                          strokeDasharray={dash} strokeDashoffset={-(off / 100) * circumference} />
                      );
                      off += pct;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[20px] font-bold text-text-primary">24,856</p>
                  <p className="text-[11px] text-text-light">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {eventSummary.map((e) => (
                <div key={e.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                    <span className="text-text-muted">{e.name}</span>
                  </div>
                  <span className="font-medium text-text-primary">{e.count.toLocaleString()} ({((e.count / total) * 100).toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Event Types */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Event Types</h3>
              <button className="text-[12px] font-medium text-action-blue hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {eventTypes.map((e) => (
                <div key={e.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                    <span className="text-text-muted">{e.name}</span>
                  </div>
                  <span className="font-medium text-text-primary">{e.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Users */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Top Users (by Events)</h3>
            </div>
            <div className="space-y-3">
              {topUsers.map((u) => (
                <div key={u.name} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0" style={{ backgroundColor: u.color }}>
                    {u.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className="text-[13px] font-medium text-text-primary flex-1">{u.name}</span>
                  <span className="text-[13px] text-text-muted">{u.count}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 text-[12px] font-medium text-action-blue hover:underline">View all users</button>
          </Card>

          {/* Recent Security Events */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Recent Security Events</h3>
              <button className="text-[12px] font-medium text-action-blue hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {securityEvents.map((e, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-text-primary">{e.title}</p>
                    <p className="text-[12px] text-text-light mt-0.5">{e.sub}</p>
                    <p className="text-[11px] text-text-light">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mobile Access */}
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Mobile Access</h3>
            <div className="space-y-4">
              {mobileAccess.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.name}>
                    <div className="flex items-center justify-between mb-1.5 text-[13px]">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: m.color }} />
                        <span className="text-text-muted">{m.name}</span>
                      </div>
                      <span className="font-medium text-text-primary">{m.count} ({m.pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Events Over Time */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">Events Over Time</h3>
            <span className="text-[12px] text-text-muted bg-soft-bg px-2.5 py-1 rounded-md font-medium">Daily</span>
          </div>
          <div className="flex items-center gap-4 mb-3 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0057D8]" /><span className="text-text-muted">User Actions</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7C6FF6]" /><span className="text-text-muted">System Events</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /><span className="text-text-muted">Security Events</span></span>
          </div>
          <div className="h-[180px]">
            <svg viewBox="0 0 500 180" className="w-full h-full" preserveAspectRatio="none">
              {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="10" y1={i * 40 + 10} x2="490" y2={i * 40 + 10} stroke="#F1F5F9" strokeWidth="1" />)}
              <polyline fill="none" stroke="#0057D8" strokeWidth="2" points="10,120 50,110 90,115 130,95 170,100 210,80 250,85 290,65 330,70 370,55 410,60 450,45 490,50" />
              <polyline fill="none" stroke="#7C6FF6" strokeWidth="2" points="10,150 50,148 90,145 130,140 170,142 210,135 250,138 290,130 330,132 370,128 410,130 450,125 490,127" />
              <polyline fill="none" stroke="#EF4444" strokeWidth="2" points="10,168 50,166 90,167 130,164 170,165 210,162 250,163 290,160 330,161 370,159 410,160 450,158 490,159" />
            </svg>
          </div>
        </Card>

        {/* Events by Hour */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">Events by Hour (Today)</h3>
            <span className="text-[12px] text-text-muted bg-soft-bg px-2.5 py-1 rounded-md font-medium">All Events</span>
          </div>
          <div className="h-[180px] flex items-end gap-1">
            {hourBars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-teal" style={{ height: `${(h / 35) * 100}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-text-light">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
