"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Users, UserCheck, UserX, Shield, Mail,
  Search, Plus, Download, MoreHorizontal, ChevronDown, ChevronRight, ChevronLeft,
  ArrowUpRight, ArrowDownRight, CheckCircle2,
  Check, X, Minus, Edit2, UserPlus, Copy, SlidersHorizontal, Trash2,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import type { User, UserRole } from "@/types";

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

interface UserRow {
  id: string; name: string; email: string; role: string; wh: string; status: string; last: string; time: string;
}

const ROLE_OPTIONS = ["Admin", "Operations Manager", "Warehouse Manager", "Inventory Manager", "Team Lead", "Operator", "Supervisor", "Billing Specialist", "Viewer"];
const WAREHOUSE_OPTIONS = ["All Warehouses", "DFW1 - Dallas", "ATL1 - Atlanta", "LAX1 - Los Angeles", "MIA1 - Miami"];

// The API stores a narrow role union; the UI offers richer display roles.
// Map each display role down to the closest persistable API role, and map a
// stored API role back to a sensible default display role on load.
function toApiRole(display: string): UserRole {
  if (display === "Admin") return "Admin";
  if (display === "Viewer") return "Viewer";
  if (display === "Operator") return "Operator";
  if (display.includes("Manager") || display === "Team Lead" || display === "Supervisor") return "Manager";
  return "Manager";
}

const API_ROLE_TO_DISPLAY: Record<UserRole, string> = {
  Admin: "Admin",
  Manager: "Operations Manager",
  Operator: "Operator",
  Viewer: "Viewer",
};

// The API status union differs from the table's Active/Inactive wording.
function toApiStatus(display: string): User["status"] {
  return display === "Active" ? "Active" : "Suspended";
}

function fromApiStatus(status: User["status"]): string {
  if (status === "Active") return "Active";
  if (status === "Invited") return "Invited";
  return "Inactive";
}

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

function FilterButton({ label, icon: Icon, onClick }: { label: string; icon?: React.ElementType; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 px-3 py-2 text-[13px] text-text-muted border border-border-soft rounded-lg bg-white hover:bg-soft-bg whitespace-nowrap">
      {Icon && <Icon className="w-4 h-4 text-text-light" />}
      {label} <ChevronDown className="w-3.5 h-3.5 text-[#9AA8B8]" />
    </button>
  );
}

type InviteDraft = { name: string; email: string; role: string; wh: string };
const emptyInvite: InviteDraft = { name: "", email: "", role: "Operator", wh: "All Warehouses" };

let userSeq = 1000;

function mapUser(u: User): UserRow {
  const active = u.lastActive ? new Date(u.lastActive) : null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: API_ROLE_TO_DISPLAY[u.role] ?? "Operator",
    wh: "All Warehouses",
    status: fromApiStatus(u.status),
    last: active && !isNaN(active.getTime())
      ? active.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      : u.status === "Invited" ? "Invited" : "—",
    time: active && !isNaN(active.getTime())
      ? active.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      : "—",
  };
}

export default function UsersRolesPage() {
  const { toast } = useToast();
  const [permTab, setPermTab] = useState<"roles" | "permissions" | "groups">("permissions");
  const [permCategory, setPermCategory] = useState(permissionCategories[0]);
  const [showDetail, setShowDetail] = useState(false);

  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [permMatrix, setPermMatrix] = useState(matrix);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState<InviteDraft>(emptyInvite);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [editDraft, setEditDraft] = useState<InviteDraft>(emptyInvite);
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<UserRow | null>(null);

  const totalDist = roleDistribution.reduce((a, b) => a + b.count, 0);
  const circumference = 2 * Math.PI * 40;

  // Load members from the API and any persisted permission-matrix overrides.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [usersRes, settingsRes] = await Promise.all([
          api.get<{ data: User[]; total: number }>("/api/users"),
          api.get<Record<string, unknown>>("/api/settings"),
        ]);
        if (!alive) return;
        setRows((usersRes?.data ?? []).map(mapUser));
        const stored = (settingsRes?.roles as { matrix?: typeof matrix } | undefined)?.matrix;
        if (Array.isArray(stored) && stored.length > 0) setPermMatrix(stored);
      } catch {
        if (alive) toast("Failed to load users", "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((u) => {
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
      const matchesRole = !roleFilter || u.role === roleFilter;
      const matchesStatus = !statusFilter || u.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [rows, query, roleFilter, statusFilter]);

  function openInvite() {
    setInvite(emptyInvite);
    setInviteOpen(true);
  }

  // Creating a real user needs a password flow that is out of scope, so the
  // invite modal adds the member to the local list only (it does not persist).
  function saveInvite() {
    if (!invite.name.trim()) { toast("Name is required", "error"); return; }
    if (!invite.email.trim() || !invite.email.includes("@")) { toast("A valid email is required", "error"); return; }
    setBusy(true);
    const created: UserRow = {
      id: `LOCAL-${++userSeq}`,
      name: invite.name.trim(),
      email: invite.email.trim(),
      role: invite.role,
      wh: invite.wh,
      status: "Invited",
      last: "Invited",
      time: "—",
    };
    setRows((prev) => [created, ...prev]);
    setBusy(false);
    setInviteOpen(false);
    toast(`Invitation sent to ${created.email}`);
  }

  const isPersisted = (id: string) => !id.startsWith("LOCAL-");

  function openEdit(u: UserRow) {
    setEditing(u);
    setEditDraft({ name: u.name, email: u.email, role: u.role, wh: u.wh });
    setOpenMenu(null);
  }

  function saveEdit() {
    if (!editing) return;
    const id = editing.id;
    const patch = { name: editDraft.name.trim(), email: editDraft.email.trim(), role: editDraft.role, wh: editDraft.wh };
    setBusy(true);
    setRows((cur) => cur.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    setEditing(null);
    // Persist the fields the API understands (name, email, role).
    const finish = () => { setBusy(false); };
    if (isPersisted(id)) {
      api.put(`/api/users/${id}`, { name: patch.name, email: patch.email, role: toApiRole(patch.role) })
        .then(() => toast(`${patch.name} updated`))
        .catch(() => toast(`Failed to update ${patch.name}`, "error"))
        .finally(finish);
    } else {
      toast(`${patch.name} updated`);
      finish();
    }
  }

  function changeRole(id: string, role: string) {
    setRows((cur) => cur.map((u) => (u.id === id ? { ...u, role } : u)));
    setOpenMenu(null);
    if (isPersisted(id)) {
      api.put(`/api/users/${id}`, { role: toApiRole(role) })
        .then(() => toast(`Role updated to ${role}`))
        .catch(() => toast("Failed to update role", "error"));
    } else {
      toast(`Role updated to ${role}`);
    }
  }

  function toggleStatus(id: string) {
    const target = rows.find((u) => u.id === id);
    if (!target) return;
    const status = target.status === "Active" ? "Inactive" : "Active";
    setRows((cur) => cur.map((u) => (u.id === id ? { ...u, status } : u)));
    setOpenMenu(null);
    const done = () => toast(`${target.name} ${status === "Active" ? "activated" : "deactivated"}`);
    if (isPersisted(id)) {
      api.put(`/api/users/${id}`, { status: toApiStatus(status) })
        .then(done)
        .catch(() => toast(`Failed to update ${target.name}`, "error"));
    } else {
      done();
    }
  }

  function confirmRemove() {
    if (!removing) return;
    const { id, name } = removing;
    setRows((cur) => cur.filter((u) => u.id !== id));
    setRemoving(null);
    if (isPersisted(id)) {
      api.del(`/api/users/${id}`)
        .then(() => toast(`${name} removed`))
        .catch(() => toast(`Failed to remove ${name}`, "error"));
    } else {
      toast(`${name} removed`);
    }
  }

  function handleExport() {
    exportToCsv("users", filteredUsers, [
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "role", header: "Role" },
      { key: "wh", header: "Warehouse Access" },
      { key: "status", header: "Status" },
      { key: "last", header: "Last Active" },
    ]);
    toast(`Exported ${filteredUsers.length} user${filteredUsers.length === 1 ? "" : "s"} to CSV`);
  }

  const selectCls = "inline-flex items-center gap-2 px-3 py-2 text-[13px] text-text-muted border border-border-soft rounded-lg bg-white hover:bg-soft-bg whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-action-blue/20";

  if (showDetail) return <RoleDetail onBack={() => setShowDetail(false)} />;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-5 h-5 rounded-full border-2 border-action-blue/30 border-t-action-blue animate-spin" />
        <span className="ml-2 text-[14px] text-text-muted">Loading users…</span>
      </div>
    );
  }

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
          <button onClick={handleExport} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-soft bg-white text-text-body text-[13px] font-medium hover:bg-soft-bg shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Download className="w-4 h-4 text-text-light" /> Export Users
          </button>
          <button onClick={openInvite} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action-blue text-white text-[13px] font-medium hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
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
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users by name, email, or role..." className="w-full pl-9 pr-4 py-2 border border-border-soft rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={selectCls}>
          <option value="">All Roles</option>
          {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={() => { setQuery(""); setRoleFilter(""); setStatusFilter(""); toast("Filters cleared", "info"); }} className="inline-flex items-center gap-2 px-3 py-2 text-[13px] text-text-muted border border-border-soft rounded-lg bg-white hover:bg-soft-bg whitespace-nowrap">
          <SlidersHorizontal className="w-4 h-4 text-text-light" /> Clear
        </button>
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
                {filteredUsers.map((u, i) => (
                  <tr key={u.id} className="border-b border-border-soft last:border-b-0 hover:bg-soft-bg/60 transition-colors">
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
                      <button onClick={() => toggleStatus(u.id)} className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${u.status === "Active" ? "text-[#00B894]" : "text-[#9AA8B8]"}`} aria-label="Toggle status">
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-[#00B894]" : "bg-[#9AA8B8]"}`} />{u.status}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="text-[13px] text-text-primary">{u.last}</div>
                      <div className="text-[11px] text-text-light">{u.time}</div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)} className="p-1.5 rounded-lg hover:bg-soft-bg text-text-light" aria-label="User actions"><MoreHorizontal className="w-4 h-4" /></button>
                        {openMenu === u.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 mt-1 z-20 w-52 bg-white rounded-lg border border-border-soft shadow-lg py-1 text-left max-h-[280px] overflow-y-auto">
                              <button onClick={() => openEdit(u)} className="w-full text-left px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg flex items-center gap-2"><Edit2 className="w-3.5 h-3.5" /> Edit user</button>
                              <button onClick={() => toggleStatus(u.id)} className="w-full text-left px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg flex items-center gap-2">{u.status === "Active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />} {u.status === "Active" ? "Deactivate" : "Activate"}</button>
                              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-text-light uppercase">Change role</p>
                              {ROLE_OPTIONS.map((r) => (
                                <button key={r} onClick={() => changeRole(u.id, r)} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-soft-bg ${u.role === r ? "text-action-blue font-medium" : "text-text-primary"}`}>{r}</button>
                              ))}
                              <div className="my-1 border-t border-border-soft" />
                              <button onClick={() => { setOpenMenu(null); setRemoving(u); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Remove user</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <p className="text-[13px] text-text-muted">No users match your filters.</p>
                      <button onClick={openInvite} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-action-blue hover:underline"><Plus className="w-4 h-4" /> Invite a user</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-border-soft">
            <p className="text-[13px] text-text-muted">Showing {filteredUsers.length} of {rows.length} users</p>
            <div className="flex items-center gap-1.5">
              <button disabled={true} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-light hover:bg-soft-bg disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Previous page"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => toast("Page 1 of 1", "info")} className="w-8 h-8 flex items-center justify-center rounded-lg bg-action-blue text-white text-[13px] font-medium">1</button>
              <button disabled={true} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-light hover:bg-soft-bg disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Next page"><ChevronRight className="w-4 h-4" /></button>
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
              <button onClick={() => toast("Opening all invitations…", "info")} className="text-[12px] font-medium text-action-blue hover:underline">View all</button>
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
                  {permissionCategories.map((c) => (
                    <button key={c} onClick={() => setPermCategory(c)} className={`w-full text-left px-2 py-1.5 rounded text-[12px] ${permCategory === c ? "bg-action-blue/10 text-action-blue font-medium" : "text-text-muted hover:bg-soft-bg"}`}>{c}</button>
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
                    {permMatrix.map((row) => (
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
        <button onClick={() => setPermTab("roles")} className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-navy hover:bg-white/90 shrink-0">
          <UserPlus className="w-4 h-4" /> Manage Roles
        </button>
      </div>

      {/* Invite user modal */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite User"
        description="Send an invitation to add a new team member."
        footer={
          <>
            <SecondaryButton onClick={() => setInviteOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveInvite} disabled={busy}>{busy ? "Sending…" : "Send invitation"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Full name" required>
            <TextInput value={invite.name} onChange={(e) => setInvite((d) => ({ ...d, name: e.target.value }))} placeholder="Jane Doe" />
          </Field>
          <Field label="Email" required>
            <TextInput type="email" value={invite.email} onChange={(e) => setInvite((d) => ({ ...d, email: e.target.value }))} placeholder="jane.doe@fulfillmesh.com" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role">
              <Select options={ROLE_OPTIONS} value={invite.role} onChange={(e) => setInvite((d) => ({ ...d, role: e.target.value }))} />
            </Field>
            <Field label="Warehouse access">
              <Select options={WAREHOUSE_OPTIONS} value={invite.wh} onChange={(e) => setInvite((d) => ({ ...d, wh: e.target.value }))} />
            </Field>
          </div>
        </div>
      </Modal>

      {/* Edit user modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit ${editing.name}` : "Edit user"}
        description="Update this user's details and access."
        footer={
          <>
            <SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Full name" required>
            <TextInput value={editDraft.name} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} />
          </Field>
          <Field label="Email" required>
            <TextInput type="email" value={editDraft.email} onChange={(e) => setEditDraft((d) => ({ ...d, email: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role">
              <Select options={ROLE_OPTIONS} value={editDraft.role} onChange={(e) => setEditDraft((d) => ({ ...d, role: e.target.value }))} />
            </Field>
            <Field label="Warehouse access">
              <Select options={WAREHOUSE_OPTIONS} value={editDraft.wh} onChange={(e) => setEditDraft((d) => ({ ...d, wh: e.target.value }))} />
            </Field>
          </div>
        </div>
      </Modal>

      {/* Remove confirm */}
      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
        title="Remove user"
        message={`Remove ${removing?.name} from your organization? They will immediately lose access. This cannot be undone.`}
        confirmLabel="Remove"
        destructive
      />
    </div>
  );
}

/* ---------------- Role & Permission Detail ---------------- */

function RoleDetail({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();
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
          <button onClick={() => toast("Role duplicated", "success")} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-soft bg-white text-text-body text-[13px] font-medium hover:bg-soft-bg shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Copy className="w-4 h-4 text-text-light" /> Duplicate Role
          </button>
          <button onClick={() => toast("Opening role editor…", "info")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action-blue text-white text-[13px] font-medium hover:bg-[#0047B3] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
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
                  <FilterButton label="All Resource Groups" onClick={() => toast("Filter by resource group", "info")} />
                  <FilterButton label="All Access Levels" onClick={() => toast("Filter by access level", "info")} />
                  <button onClick={() => toast("All permission groups expanded", "info")} className="px-3 py-2 text-[13px] font-medium text-action-blue hover:underline">Expand All</button>
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
                <button key={label} onClick={() => toast(`${label} — done`)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-text-primary border border-border-soft rounded-lg hover:bg-soft-bg">
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
