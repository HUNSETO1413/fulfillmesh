"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, SlidersHorizontal, UserPlus, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";

type Member = {
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Pending Invite" | "Suspended";
  lastActive: string;
  avatar: string;
};

const face = (id: string) => `/images/${id}.jpg`;

const initialMembers: Member[] = [
  { name: "Alex Thompson", email: "alex.thompson@fulfillmesh.com", role: "Admin", department: "Executive", status: "Active", lastActive: "2 hours ago", avatar: face("photo-1500648767791-00dcc994a43e") },
  { name: "Maria Sanchez", email: "maria.sanchez@fulfillmesh.com", role: "Operations Manager", department: "Operations", status: "Active", lastActive: "1 hour ago", avatar: face("photo-1494790108377-be9c29b29330") },
  { name: "James Lee", email: "james.lee@fulfillmesh.com", role: "Warehouse Lead", department: "Warehouse", status: "Active", lastActive: "30 mins ago", avatar: face("photo-1506794778202-cad84cf45f1d") },
  { name: "Priya Patel", email: "priya.patel@fulfillmesh.com", role: "Finance", department: "Finance", status: "Active", lastActive: "5 hours ago", avatar: face("photo-1438761681033-6461ffad8d80") },
  { name: "Daniel Kim", email: "daniel.kim@fulfillmesh.com", role: "Support Specialist", department: "Customer Support", status: "Active", lastActive: "1 hour ago", avatar: face("photo-1507003211169-0a1dd7228f2d") },
  { name: "Sarah Johnson", email: "sarah.johnson@fulfillmesh.com", role: "Operations Associate", department: "Operations", status: "Pending Invite", lastActive: "—", avatar: face("photo-1544005313-94ddf0286df2") },
  { name: "Michael Brown", email: "michael.brown@fulfillmesh.com", role: "Operations Associate", department: "Operations", status: "Suspended", lastActive: "2 days ago", avatar: face("photo-1472099645785-5658abf4ff4e") },
];

const ROLES = ["Admin", "Operations Manager", "Warehouse Lead", "Finance", "Support Specialist", "Operations Associate"];
const DEPARTMENTS = ["Executive", "Operations", "Warehouse", "Finance", "Customer Support"];

const statusStyles: Record<Member["status"], string> = {
  "Active": "bg-[#ECFDF5] text-[#10B981]",
  "Pending Invite": "bg-[#FEF3C7] text-[#F59E0B]",
  "Suspended": "bg-[#FEE2E2] text-[#EF4444]",
};

const statusDot: Record<Member["status"], string> = {
  "Active": "bg-[#10B981]",
  "Pending Invite": "bg-[#F59E0B]",
  "Suspended": "bg-[#EF4444]",
};

const emptyInvite = { name: "", email: "", role: ROLES[5], department: DEPARTMENTS[1] };

export default function UsersPage() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState(emptyInvite);

  const [editing, setEditing] = useState<Member | null>(null);
  const [editDraft, setEditDraft] = useState({ role: "", department: "", status: "Active" as Member["status"] });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchesQ = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "All Roles" || m.role === roleFilter;
      const matchesStatus = statusFilter === "All Statuses" || m.status === statusFilter;
      return matchesQ && matchesRole && matchesStatus;
    });
  }, [members, query, roleFilter, statusFilter]);

  const handleInvite = () => {
    if (!invite.name.trim() || !invite.email.trim()) {
      toast("Name and email are required", "error");
      return;
    }
    setMembers((m) => [
      ...m,
      {
        name: invite.name.trim(),
        email: invite.email.trim(),
        role: invite.role,
        department: invite.department,
        status: "Pending Invite",
        lastActive: "—",
        avatar: "/images/photo-1544005313-94ddf0286df2.jpg",
      },
    ]);
    setInviteOpen(false);
    setInvite(emptyInvite);
    toast(`Invite sent to ${invite.email.trim()}`);
  };

  const openEdit = (m: Member) => {
    setEditing(m);
    setEditDraft({ role: m.role, department: m.department, status: m.status });
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    setMembers((list) =>
      list.map((m) =>
        m.email === editing.email
          ? { ...m, role: editDraft.role, department: editDraft.department, status: editDraft.status }
          : m,
      ),
    );
    toast(`${editing.name} updated`);
    setEditing(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-[#111827]">User Management</h2>
          <p className="text-[14px] text-[#6B7280] mt-1">Manage users, roles, and permissions.</p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-md text-[14px] font-medium hover:bg-[#2563EB] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mt-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none pl-3 pr-9 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-[14px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
          >
            <option>All Roles</option>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-9 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-[14px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Pending Invite</option>
            <option>Suspended</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <button
          onClick={() => {
            setQuery("");
            setRoleFilter("All Roles");
            setStatusFilter("All Statuses");
            toast("Filters cleared", "info");
          }}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-[14px] text-[#374151] hover:bg-[#F9FAFB]"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="mt-5 bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="text-left text-[14px] font-medium text-[#6B7280] px-4 py-3">Name</th>
              <th className="text-left text-[14px] font-medium text-[#6B7280] px-4 py-3">Role</th>
              <th className="text-left text-[14px] font-medium text-[#6B7280] px-4 py-3">Department</th>
              <th className="text-left text-[14px] font-medium text-[#6B7280] px-4 py-3">Status</th>
              <th className="text-left text-[14px] font-medium text-[#6B7280] px-4 py-3">Last Active</th>
              <th className="text-right text-[14px] font-medium text-[#6B7280] px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[14px] text-[#9CA3AF]">
                  No users match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.email} className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-[#E5E7EB]"
                      />
                      <div>
                        <p className="text-[14px] font-medium text-[#111827]">{m.name}</p>
                        <p className="text-[12px] text-[#6B7280]">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[12px] font-medium text-[#4B5563]">{m.role}</td>
                  <td className="px-4 py-4 text-[12px] text-[#6B7280]">{m.department}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] font-medium rounded ${statusStyles[m.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[m.status]}`} />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[12px] text-[#6B7280]">{m.lastActive}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => openEdit(m)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[12px] font-medium text-[#3B82F6] bg-[#EFF6FF] rounded hover:bg-[#DBEAFE] transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E7EB]">
          <p className="text-[12px] text-[#6B7280]">Showing 1 to {filtered.length} of {filtered.length} users</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button disabled={true} className="w-8 h-8 flex items-center justify-center rounded-md border border-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => toast("Page 1 of 1", "info")} className="w-8 h-8 flex items-center justify-center rounded-md bg-[#3B82F6] text-white text-[12px] font-medium">1</button>
              <button disabled={true} className="w-8 h-8 flex items-center justify-center rounded-md border border-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative ml-2">
              <select className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-[#D1D5DB] rounded-md text-[12px] text-[#6B7280] focus:outline-none">
                <option>10 / page</option>
                <option>25 / page</option>
                <option>50 / page</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#6B7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Invite User Modal */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite User"
        description="Send an invitation to join your workspace."
        footer={
          <>
            <SecondaryButton onClick={() => setInviteOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleInvite}>Send Invite</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Full name" required>
              <TextInput value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} placeholder="Jordan Avery" />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Email" required>
              <TextInput type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder="jordan@fulfillmesh.com" />
            </Field>
          </div>
          <Field label="Role">
            <Select options={ROLES} value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })} />
          </Field>
          <Field label="Department">
            <Select options={DEPARTMENTS} value={invite.department} onChange={(e) => setInvite({ ...invite, department: e.target.value })} />
          </Field>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? `Edit ${editing.name}` : "Edit User"}
        description={editing?.email}
        footer={
          <>
            <SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSaveEdit}>Save Changes</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Role">
            <Select options={ROLES} value={editDraft.role} onChange={(e) => setEditDraft({ ...editDraft, role: e.target.value })} />
          </Field>
          <Field label="Department">
            <Select options={DEPARTMENTS} value={editDraft.department} onChange={(e) => setEditDraft({ ...editDraft, department: e.target.value })} />
          </Field>
          <div className="col-span-2">
            <Field label="Status">
              <Select
                options={["Active", "Pending Invite", "Suspended"]}
                value={editDraft.status}
                onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value as Member["status"] })}
              />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
