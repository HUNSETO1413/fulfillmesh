"use client";

import React, { useState } from "react";
import {
  Users, UserCheck, UserX, Shield, Mail,
  Search, Plus, Download, MoreHorizontal, ChevronDown, ChevronRight, ChevronLeft,
  ArrowUpRight, ArrowDownRight, CheckCircle2,
  Check, X, Minus, Edit2, UserPlus, Copy, SlidersHorizontal,
} from "lucide-react";

/* ---------------- data ---------------- */

const stats = [
  { title: "Total Users", value: "128", change: "12.3%", dir: "up", icon: Users, iconBg: "bg-[#0057D8]/10", iconColor: "text-[#0057D8]" },
  { title: "Active Users", value: "112", change: "9.8%", dir: "up", icon: UserCheck, iconBg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
  { title: "Inactive Users", value: "16", change: "5.9%", dir: "down", icon: UserX, iconBg: "bg-[#EF4444]/10", iconColor: "text-[#EF4444]" },
  { title: "Roles", value: "9", change: "", dir: "flat", icon: Shield, iconBg: "bg-[#7C6FF6]/10", iconColor: "text-[#7C6FF6]" },
  { title: "Pending Invitations", value: "5", change: "16.7%", dir: "down", icon: Mail, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]" },
];

const roleColors: Record<string, string> = {
  "Admin": "bg-[#EF4444]/10 text-[#EF4444]",
  "Operations Manager": "bg-[#0057D8]/10 text-[#0057D8]",
  "Warehouse Manager": "bg-[#7C6FF6]/10 text-[#7C6FF6]",
  "Inventory Manager": "bg-[#F59E0B]/10 text-[#F59E0B]",
  "Team Lead": "bg-[#007F8C]/10 text-[#007F8C]",
  "Operator": "bg-[#00B894]/10 text-[#00B894]",
  "Supervisor": "bg-[#EC4899]/10 text-[#EC4899]",
  "Billing Specialist": "bg-[#F97316]/10 text-[#F97316]",
  "Viewer": "bg-[#64748B]/10 text-[#64748B]",
};

const users = [
  { name: "John Smith", email: "john.smith@fulfillmesh.com", role: "Admin", wh: "All Warehouses", status: "Active", last: "May 30, 2026", time: "09:42 AM" },
  { name: "Sarah Rodriguez", email: "sarah.rodriguez@fulfillmesh.com", role: "Operations Manager", wh: "DFW1, ATL1, LAX1", status: "Active", last: "May 30, 2026", time: "08:15 AM" },
  { name: "Michael Davis", email: "michael.davis@fulfillmesh.com", role: "Warehouse Manager", wh: "DFW1 - Dallas", status: "Active", last: "May 30, 2026", time: "07:58 AM" },
  { name: "Emily Watson", email: "emily.watson@fulfillmesh.com", role: "Inventory Manager", wh: "ATL1 - Atlanta", status: "Active", last: "May 29, 2026", time: "05:21 PM" },
  { name: "Alex Chen", email: "alex.chen@fulfillmesh.com", role: "Supervisor", wh: "LAX1 - Los Angeles", status: "Active", last: "May 29, 2026", time: "03:44 PM" },
  { name: "Tyler Brown", email: "tyler.brown@fulfillmesh.com", role: "Team Lead", wh: "MIA1 - Miami", status: "Active", last: "May 29, 2026", time: "01:10 PM" },
  { name: "Lisa White", email: "lisa.white@fulfillmesh.com", role: "Operator", wh: "DFW1 - Dallas", status: "Active", last: "May 28, 2026", time: "06:30 PM" },
  { name: "Noah Garcia", email: "noah.garcia@fulfillmesh.com", role: "Operator", wh: "ATL1 - Atlanta", status: "Active", last: "May 28, 2026", time: "04:02 PM" },
  { name: "Ava Harris", email: "ava.harris@fulfillmesh.com", role: "Billing Specialist", wh: "All Warehouses", status: "Active", last: "May 28, 2026", time: "11:48 AM" },
  { name: "Robert Black", email: "robert.black@fulfillmesh.com", role: "Viewer", wh: "LAX1 - Los Angeles", status: "Inactive", last: "May 25, 2026", time: "09:15 AM" },
];

const avatarColors = ["#0057D8", "#00B894", "#F59E0B", "#7C6FF6", "#EC4899", "#007F8C", "#EF4444", "#F97316", "#84CC16", "#64748B"];

const roleDistribution = [
  { name: "Admin", count: 4, color: "#EF4444" },
  { name: "Operations Manager", count: 8, color: "#0057D8" },
  { name: "Warehouse Manager", count: 14, color: "#7C6FF6" },
  { name: "Inventory Manager", count: 18, color: "#F59E0B" },
  { name: "Operator", count: 52, color: "#00B894" },
  { name: "Supervisor", count: 16, color: "#EC4899" },
  { name: "Billing Specialist", count: 6, color: "#F97316" },
  { name: "Viewer", count: 10, color: "#64748B" },
];

const pendingInvites = [
  { name: "Kevin Lee", email: "kevin.lee@fulfillmesh.com", role: "Operator", sent: "Sent 2 days ago" },
  { name: "Rachel Green", email: "rachel.green@fulfillmesh.com", role: "Supervisor", sent: "Sent 3 days ago" },
  { name: "Daniel Kim", email: "daniel.kim@fulfillmesh.com", role: "Operator", sent: "Sent 4 days ago" },
  { name: "Sophia Martinez", email: "sophia.martinez@fulfillmesh.com", role: "Billing Specialist", sent: "Sent 5 days ago" },
];

const recentActivity = [
  { name: "John Smith", action: "Updated role for Michael Davis", time: "May 30, 2026 09:42 AM", color: "#0057D8" },
  { name: "Sarah Rodriguez", action: "Added new user Robert Black", time: "May 30, 2026 08:15 AM", color: "#00B894" },
  { name: "Emily Watson", action: "Deactivated account for Lisa White", time: "May 29, 2026 05:21 PM", color: "#F59E0B" },
  { name: "Michael Davis", action: "Created new role: Team Lead", time: "May 29, 2026 03:44 PM", color: "#7C6FF6" },
  { name: "System", action: "Sent invitation to Sophia Martinez", time: "May 28, 2026 11:48 AM", color: "#64748B" },
];

const permissionCategories = ["Dashboard & Reports", "Orders", "Inventory", "Inbound", "Outbound", "Returns", "Billing", "Users & Roles", "Integrations"];

const permLevels = ["Admin", "Ops Manager", "Warehouse Manager", "Supervisor", "Operator", "Viewer"];

type Lvl = "full" | "read" | "none" | "na";
const matrix: { cat: string; perm: string; desc: string; levels: Lvl[] }[] = [
  { cat: "Dashboard & Reports", perm: "View Dashboard", desc: "View dashboards and analytics", levels: ["full", "full", "full", "full", "read", "read"] },
  { cat: "Dashboard & Reports", perm: "Export Reports", desc: "Export reports and analytics data", levels: ["full", "full", "full", "read", "none", "none"] },
  { cat: "Orders", perm: "Manage Orders", desc: "Create, edit, and cancel orders", levels: ["full", "full", "full", "read", "read", "read"] },
  { cat: "Inventory", perm: "Manage Inventory", desc: "Adjust and transfer inventory", levels: ["full", "full", "full", "full", "read", "read"] },
  { cat: "Inbound", perm: "Manage Inbound", desc: "Manage inbound shipments", levels: ["full", "full", "full", "full", "read", "none"] },
  { cat: "Outbound", perm: "Manage Outbound", desc: "Manage outbound shipments", levels: ["full", "full", "full", "full", "read", "none"] },
  { cat: "Returns", perm: "Manage Returns", desc: "Process and approve returns", levels: ["full", "full", "full", "read", "read", "none"] },
  { cat: "Billing", perm: "Billing & Payments", desc: "Manage invoices and payments", levels: ["full", "read", "none", "none", "none", "none"] },
  { cat: "Users & Roles", perm: "Manage Users", desc: "Add, edit, and remove users", levels: ["full", "read", "none", "none", "none", "none"] },
  { cat: "Users & Roles", perm: "System Settings", desc: "Configure system settings", levels: ["full", "none", "none", "none", "none", "none"] },
  { cat: "Integrations", perm: "Integrations", desc: "Manage integrations", levels: ["full", "read", "none", "none", "none", "none"] },
];

function LevelDot({ lvl }: { lvl: Lvl }) {
  if (lvl === "full") return <span className="inline-flex w-5 h-5 rounded-full bg-[#00B894]/15 items-center justify-center"><Check className="w-3 h-3 text-[#00B894]" /></span>;
  if (lvl === "read") return <span className="inline-flex w-5 h-5 rounded-full bg-[#F59E0B]/15 items-center justify-center"><Check className="w-3 h-3 text-[#F59E0B]" /></span>;
  if (lvl === "none") return <span className="inline-flex w-5 h-5 rounded-full bg-[#EF4444]/15 items-center justify-center"><X className="w-3 h-3 text-[#EF4444]" /></span>;
  return <span className="inline-flex w-5 h-5 rounded-full bg-[#9AA8B8]/15 items-center justify-center"><Minus className="w-3 h-3 text-[#9AA8B8]" /></span>;
}

/* role detail permission rows */
const detailPerms = [
  {
    group: "Orders", count: "6 of 6 permissions",
    rows: [
      { perm: "View Orders", level: "Read & Write", desc: "View order list and details" },
      { perm: "Create Orders", level: "Read & Write", desc: "Create new orders" },
      { perm: "Edit Orders", level: "Read & Write", desc: "Edit existing orders" },
      { perm: "Cancel Orders", level: "Read & Write", desc: "Cancel and void orders" },
      { perm: "Export Orders", level: "Read Only", desc: "Export orders data" },
    ],
  },
  {
    group: "Inventory", count: "6 of 6 permissions",
    rows: [
      { perm: "View Inventory", level: "Full Access", desc: "View inventory levels and details" },
      { perm: "Adjust Inventory", level: "Full Access", desc: "Adjust inventory quantities" },
      { perm: "Transfer Inventory", level: "Full Access", desc: "Create and manage transfers" },
      { perm: "View Inventory History", level: "Read Only", desc: "Perform inventory counts" },
      { perm: "Export Inventory", level: "Read & Write", desc: "Export inventory reports" },
      { perm: "Delete Inventory", level: "Read & Write", desc: "Delete inventory records" },
    ],
  },
];

function lvlBadge(level: string) {
  if (level === "Full Access") return "bg-[#00B894]/10 text-[#00B894]";
  if (level === "Read & Write") return "bg-[#0057D8]/10 text-[#0057D8]";
  return "bg-[#F59E0B]/10 text-[#F59E0B]";
}

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

export default function UsersRolesPage() {
  const [permTab, setPermTab] = useState<"roles" | "permissions" | "groups">("permissions");
  const [showDetail, setShowDetail] = useState(false);

  const totalDist = roleDistribution.reduce((a, b) => a + b.count, 0);
  const circumference = 2 * Math.PI * 40;

  if (showDetail) return <RoleDetail onBack={() => setShowDetail(false)} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 mb-1.5 text-[12px]">
            <a href="/dashboard" className="text-text-muted hover:text-action-blue">Dashboard</a>
            <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            <span className="font-medium text-text-primary">Users &amp; Roles</span>
          </nav>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold text-text-primary">Users &amp; Roles</h1>
            <CheckCircle2 className="w-5 h-5 text-teal" />
          </div>
          <p className="text-[14px] text-text-muted mt-0.5">Manage users, roles, permissions, and access across your organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-soft bg-white text-text-body text-[13px] font-medium hover:bg-soft-bg shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Download className="w-4 h-4 text-text-light" /> Export Users
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action-blue text-white text-[13px] font-medium hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
                {s.dir === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-teal" />}
                {s.dir === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
                {s.dir === "flat" && <Minus className="w-3.5 h-3.5 text-[#9AA8B8]" />}
                {s.change && <span className={`text-[12px] font-medium ${s.dir === "up" ? "text-teal" : "text-[#EF4444]"}`}>{s.change}</span>}
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
          <input placeholder="Search users by name, email, or role..." className="w-full pl-9 pr-4 py-2 border border-border-soft rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20" />
        </div>
        <FilterButton label="All Roles" />
        <FilterButton label="All Statuses" />
        <FilterButton label="All Warehouses" />
        <FilterButton label="Filters" icon={SlidersHorizontal} />
      </div>

      {/* Main: table + sidebar */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Users table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-soft-bg border-b border-border-soft">
                  {["User", "Email", "Role", "Warehouse Access", "Status", "Last Active", ""].map((h, i) => (
                    <th key={i} className={`text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3 whitespace-nowrap ${i === 6 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.email} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0" style={{ backgroundColor: avatarColors[i % avatarColors.length] }}>
                          {u.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-[13px] font-medium text-text-primary whitespace-nowrap">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-text-body whitespace-nowrap">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-[12px] font-medium rounded-md ${roleColors[u.role]} whitespace-nowrap`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-text-body">{u.wh}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${u.status === "Active" ? "text-[#00B894]" : "text-[#9AA8B8]"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-[#00B894]" : "bg-[#9AA8B8]"}`} />{u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="text-[13px] text-text-primary">{u.last}</div>
                      <div className="text-[11px] text-text-light">{u.time}</div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-soft-bg text-text-light"><MoreHorizontal className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-border-soft">
            <p className="text-[13px] text-text-muted">Showing 1 to 10 of 128 users</p>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-light hover:bg-soft-bg"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-action-blue text-white text-[13px] font-medium">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted text-[13px] hover:bg-soft-bg">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted text-[13px] hover:bg-soft-bg">3</button>
              <span className="px-1 text-[13px] text-text-light">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted text-[13px] hover:bg-soft-bg">13</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-light hover:bg-soft-bg"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Role Distribution */}
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Role Distribution</h3>
            <div className="flex justify-center mb-5">
              <div className="relative w-[140px] h-[140px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {roleDistribution.map((r, i) => {
                    const off = roleDistribution
                      .slice(0, i)
                      .reduce((s, x) => s + (x.count / totalDist) * 100, 0);
                    const pct = (r.count / totalDist) * 100;
                    const dash = `${(pct / 100) * circumference} ${circumference - (pct / 100) * circumference}`;
                    return (
                      <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={r.color} strokeWidth="12"
                        strokeDasharray={dash} strokeDashoffset={-(off / 100) * circumference} />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[20px] font-bold text-text-primary">128</p>
                  <p className="text-[11px] text-text-light">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {roleDistribution.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="text-text-muted">{r.name}</span>
                  </div>
                  <span className="font-medium text-text-primary">{r.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* User Status */}
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">User Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5 text-[13px]">
                  <span className="text-text-muted">Active</span>
                  <span className="font-medium text-text-primary">112 (87.5%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full rounded-full bg-[#00B894]" style={{ width: "87.5%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5 text-[13px]">
                  <span className="text-text-muted">Inactive</span>
                  <span className="font-medium text-text-primary">16 (12.5%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full rounded-full bg-[#9AA8B8]" style={{ width: "12.5%" }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Pending Invitations */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Pending Invitations</h3>
              <button className="text-[12px] font-medium text-action-blue hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {pendingInvites.map((inv) => (
                <div key={inv.email} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#0057D8]/10 flex items-center justify-center text-[#0057D8] text-[10px] font-semibold shrink-0">
                    {inv.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-text-primary truncate">{inv.name}</p>
                    <p className="text-[12px] text-text-light truncate">{inv.email}</p>
                    <p className="text-[11px] text-text-light">{inv.sent}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Roles & Permissions */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 320px" }}>
        <Card>
          <div className="px-5 pt-4 border-b border-border-soft">
            <h3 className="text-[16px] font-semibold text-text-primary mb-3">Roles &amp; Permissions</h3>
            <nav className="flex gap-6">
              {([["roles", "Roles"], ["permissions", "Permissions"], ["groups", "Role Groups"]] as const).map(([k, label]) => (
                <button key={k} onClick={() => setPermTab(k)} className={`pb-3 text-[13px] font-medium border-b-2 transition-colors ${permTab === k ? "border-action-blue text-action-blue" : "border-transparent text-text-muted hover:text-text-primary"}`}>{label}</button>
              ))}
            </nav>
          </div>

          {permTab === "permissions" && (
            <div className="grid" style={{ gridTemplateColumns: "180px minmax(0,1fr)" }}>
              {/* Categories sidebar */}
              <div className="border-r border-border-soft p-3">
                <p className="text-[11px] font-medium text-text-light uppercase tracking-wider px-2 mb-2">Permission Categories</p>
                <div className="space-y-0.5">
                  {permissionCategories.map((c, i) => (
                    <button key={c} className={`w-full text-left px-2 py-1.5 rounded text-[12px] ${i === 0 ? "bg-action-blue/10 text-action-blue font-medium" : "text-text-muted hover:bg-soft-bg"}`}>{c}</button>
                  ))}
                </div>
              </div>
              {/* Matrix */}
              <div className="overflow-x-auto">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border-soft">
                  <span className="text-[13px] font-semibold text-text-primary">All Permissions</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-soft-bg border-b border-border-soft">
                      <th className="text-left text-[11px] font-semibold text-text-muted px-5 py-2.5">Permission</th>
                      <th className="text-left text-[11px] font-semibold text-text-muted px-2 py-2.5">Description</th>
                      {permLevels.map((l) => (
                        <th key={l} className="text-center text-[11px] font-semibold text-text-muted px-2 py-2.5 whitespace-nowrap">{l}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row) => (
                      <tr key={row.perm} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
                        <td className="px-5 py-2.5 text-[12px] font-medium text-text-primary whitespace-nowrap">{row.perm}</td>
                        <td className="px-2 py-2.5 text-[12px] text-text-body">{row.desc}</td>
                        {row.levels.map((lvl, i) => (
                          <td key={i} className="px-2 py-2.5 text-center"><LevelDot lvl={lvl} /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center gap-5 px-5 py-3 border-t border-border-soft text-[11px] text-text-muted">
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-[#00B894]/15 inline-flex items-center justify-center"><Check className="w-2 h-2 text-[#00B894]" /></span> Full Access</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]/15 inline-flex items-center justify-center"><Check className="w-2 h-2 text-[#F59E0B]" /></span> Read Only</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-[#EF4444]/15 inline-flex items-center justify-center"><X className="w-2 h-2 text-[#EF4444]" /></span> No Access</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-[#9AA8B8]/15 inline-flex items-center justify-center"><Minus className="w-2 h-2 text-[#9AA8B8]" /></span> Not Applicable</span>
                </div>
              </div>
            </div>
          )}

          {permTab === "roles" && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {roleDistribution.map((r) => (
                <button key={r.name} onClick={() => setShowDetail(true)} className="text-left border border-border-soft rounded-lg p-4 hover:border-action-blue hover:bg-soft-bg transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-semibold text-text-primary">{r.name}</span>
                    <span className="text-[12px] text-text-muted">{r.count} users</span>
                  </div>
                  <p className="text-[12px] text-text-muted">View and manage permissions for this role.</p>
                </button>
              ))}
            </div>
          )}

          {permTab === "groups" && (
            <div className="p-8 text-center text-[13px] text-text-light">No role groups configured.</div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card className="p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0" style={{ backgroundColor: a.color }}>
                  {a.name === "System" ? <Shield className="w-3.5 h-3.5" /> : a.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-text-primary">{a.name}</p>
                  <p className="text-[12px] text-text-muted">{a.action}</p>
                  <p className="text-[11px] text-text-light mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom CTA band */}
      <div className="bg-deep-navy rounded-xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Secure access. Stay in control.</h3>
            <p className="text-[12px] text-white/70 mt-0.5">Define roles, fine-tune permissions, and review access regularly to keep your organization secure.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-navy hover:bg-white/90 shrink-0">
          <UserPlus className="w-4 h-4" /> Manage Roles
        </button>
      </div>
    </div>
  );
}

/* ---------------- Role & Permission Detail ---------------- */

function RoleDetail({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"permissions" | "users" | "groups">("permissions");
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold text-text-primary">Role &amp; Permission Detail</h1>
            <CheckCircle2 className="w-5 h-5 text-teal" />
          </div>
          <p className="text-[14px] text-text-muted mt-0.5">View and manage permissions for this role.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-soft bg-white text-text-body text-[13px] font-medium hover:bg-soft-bg shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Copy className="w-4 h-4 text-text-light" /> Duplicate Role
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action-blue text-white text-[13px] font-medium hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Edit2 className="w-4 h-4" /> Edit Role
          </button>
        </div>
      </div>

      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-action-blue hover:underline">
        <ChevronLeft className="w-4 h-4" /> Back to Roles
      </button>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 300px" }}>
        <div className="space-y-4">
          {/* Role summary header card */}
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#7C6FF6]/10 flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-[#7C6FF6]" />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[18px] font-bold text-text-primary">Warehouse Manager</h2>
                    <span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded bg-[#00B894]/10 text-[#00B894]">Active</span>
                  </div>
                  <p className="text-[12px] text-text-muted mt-1">Manages daily warehouse operations including inventory, inbound, outbound, and warehouse staff. Cannot access billing or system settings.</p>
                </div>
                <div className="text-[12px] space-y-2">
                  <div><span className="text-text-light">Role ID</span><div className="text-text-primary font-medium">role_wh_manager</div></div>
                  <div><span className="text-text-light">Created by</span><div className="text-text-primary font-medium">John Smith</div></div>
                </div>
                <div className="text-[12px] space-y-2">
                  <div><span className="text-text-light">Created</span><div className="text-text-primary font-medium">Jan 15, 2026 03:00 PM</div></div>
                  <div><span className="text-text-light">Users Assigned</span><div className="text-text-primary font-medium">18 Users <span className="text-action-blue">· View Users</span></div></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Card>
            <div className="px-5 pt-4 border-b border-border-soft">
              <nav className="flex gap-6">
                {([["permissions", "Permissions"], ["users", "Users (18)"], ["groups", "Role Groups"]] as const).map(([k, label]) => (
                  <button key={k} onClick={() => setTab(k)} className={`pb-3 text-[13px] font-medium border-b-2 ${tab === k ? "border-action-blue text-action-blue" : "border-transparent text-text-muted hover:text-text-primary"}`}>{label}</button>
                ))}
              </nav>
            </div>

            {tab === "permissions" && (
              <>
                <div className="flex flex-wrap items-center gap-2 p-4 border-b border-border-soft">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                    <input placeholder="Search permissions..." className="w-full pl-9 pr-4 py-2 border border-border-soft rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20" />
                  </div>
                  <FilterButton label="All Resource Groups" />
                  <FilterButton label="All Access Levels" />
                  <button className="px-3 py-2 text-[13px] font-medium text-action-blue hover:underline">Expand All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-soft-bg border-b border-border-soft">
                        <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-2.5">Resource Group / Permission</th>
                        <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-2.5">Access Level</th>
                        <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-5 py-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailPerms.map((g) => (
                        <React.Fragment key={g.group}>
                          <tr className="bg-soft-bg/60 border-b border-border-soft">
                            <td className="px-5 py-2.5">
                              <div className="flex items-center gap-2">
                                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                                <span className="text-[13px] font-semibold text-text-primary">{g.group}</span>
                              </div>
                            </td>
                            <td className="px-5 py-2.5"><span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded bg-[#00B894]/10 text-[#00B894]">Full Access</span></td>
                            <td className="px-5 py-2.5 text-[11px] text-text-light">{g.count}</td>
                          </tr>
                          {g.rows.map((r) => (
                            <tr key={g.group + r.perm} className="border-b border-border-soft hover:bg-soft-bg/60 transition-colors">
                              <td className="px-5 py-2.5 pl-10 text-[12px] text-action-blue">{r.perm}</td>
                              <td className="px-5 py-2.5"><span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded ${lvlBadge(r.level)}`}>{r.level}</span></td>
                              <td className="px-5 py-2.5 text-[12px] text-text-muted">{r.desc}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {tab === "users" && <div className="p-8 text-center text-[13px] text-text-light">18 users assigned to this role.</div>}
            {tab === "groups" && <div className="p-8 text-center text-[13px] text-text-light">No role groups.</div>}
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Role Summary</h3>
            <div className="space-y-3 text-[13px]">
              {[["Total Permissions", "86"], ["Permission Groups", "9"], ["Users Assigned", "18"]].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-text-muted">{k}</span><span className="font-semibold text-text-primary">{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Status</span>
                <span className="inline-flex items-center gap-1.5 text-[#00B894] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-[#00B894]" />Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Last Updated</span><span className="font-medium text-text-primary">May 28, 2026</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Permission Overview</h3>
            <div className="flex justify-center mb-5">
              <div className="relative w-[140px] h-[140px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {(() => {
                    const segs = [{ c: "#00B894", p: 63 }, { c: "#0057D8", p: 21 }, { c: "#F59E0B", p: 9 }, { c: "#EF4444", p: 7 }];
                    let off = 0;
                    return segs.map((s, i) => {
                      const dash = `${(s.p / 100) * circumference} ${circumference - (s.p / 100) * circumference}`;
                      const c = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={s.c} strokeWidth="12" strokeDasharray={dash} strokeDashoffset={-(off / 100) * circumference} />;
                      off += s.p;
                      return c;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[20px] font-bold text-text-primary">86</p>
                  <p className="text-[11px] text-text-light">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[["Full Access", "54", "#00B894"], ["Read & Write", "18", "#0057D8"], ["Read Only", "8", "#F59E0B"], ["No Access", "6", "#EF4444"]].map(([k, v, c]) => (
                <div key={k} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c }} />
                    <span className="text-text-muted">{k}</span>
                  </div>
                  <span className="font-medium text-text-primary">{v} ({Math.round((Number(v) / 86) * 100)}%)</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {([["Edit Role", Edit2], ["Assign Users", UserPlus], ["Duplicate Role", Copy]] as [string, typeof Edit2][]).map(([label, Icon]) => (
                <button key={label} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-text-primary border border-border-soft rounded-lg hover:bg-soft-bg">
                  <Icon className="w-4 h-4 text-text-muted" /> {label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
