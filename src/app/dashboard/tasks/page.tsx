"use client";

import { useState } from "react";
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  Loader,
  AlertTriangle,
  Plus,
  SlidersHorizontal,
  Columns3,
  Search,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  { title: "Total Tasks", value: "2,348", change: "15.6%", up: true, icon: CheckSquare, color: "#3B82F6" },
  { title: "Completed", value: "1,823", change: "18.3%", up: true, icon: CheckCircle2, color: "#10B981" },
  { title: "In Progress", value: "362", change: "5.2%", up: false, icon: Loader, color: "#3B82F6" },
  { title: "Pending", value: "128", change: "8.7%", up: false, icon: Clock, color: "#F59E0B" },
  { title: "Delayed", value: "35", change: "12.5%", up: false, icon: AlertTriangle, color: "#EF4444" },
];

const filterTabs = ["All Tasks", "In Progress", "Pending", "Completed", "Delayed", "Cancelled"];

const tasks = [
  { id: "TSK-000234", type: "Pick", ref: "SO-100176", warehouse: "ATL-1", assignee: "James Carter", priority: "High", status: "In Progress", created: "May 30, 2025", due: "May 31, 2025" },
  { id: "TSK-000231", type: "Pack", ref: "SO-100165", warehouse: "ATL-1", assignee: "Sophia Lee", priority: "Medium", status: "Pending", created: "May 30, 2025", due: "May 31, 2025" },
  { id: "TSK-000232", type: "Ship", ref: "SO-100154", warehouse: "DFW-1", assignee: "Michael Brown", priority: "High", status: "Pending", created: "May 30, 2025", due: "May 31, 2025" },
  { id: "TSK-000228", type: "Putaway", ref: "PO-50872", warehouse: "MIA-1", assignee: "Emily Davis", priority: "Low", status: "Completed", created: "May 30, 2025", due: "May 30, 2025" },
  { id: "TSK-000230", type: "Receive", ref: "PO-50671", warehouse: "LAX-1", assignee: "Daniel Wilson", priority: "Medium", status: "In Progress", created: "May 30, 2025", due: "May 31, 2025" },
  { id: "TSK-000229", type: "Replenish", ref: "REQ-8891", warehouse: "DFW-1", assignee: "Olivia Martinez", priority: "Low", status: "Completed", created: "May 30, 2025", due: "May 30, 2025" },
  { id: "TSK-000226", type: "Cycle Count", ref: "CC-000104", warehouse: "LAX-1", assignee: "Ethan Taylor", priority: "Medium", status: "In Progress", created: "May 30, 2025", due: "May 31, 2025" },
  { id: "TSK-000227", type: "Move", ref: "MOV-3346", warehouse: "ATL-1", assignee: "Ava Johnson", priority: "Low", status: "Completed", created: "May 30, 2025", due: "May 30, 2025" },
  { id: "TSK-000225", type: "Return Process", ref: "RMA-7788", warehouse: "MIA-1", assignee: "Liam Anderson", priority: "High", status: "Delayed", created: "May 30, 2025", due: "May 29, 2025" },
  { id: "TSK-000224", type: "QC Check", ref: "QC-4456", warehouse: "DFW-1", assignee: "Isabella White", priority: "Medium", status: "Pending", created: "May 30, 2025", due: "May 31, 2025" },
];

const statusOverview = [
  { label: "Completed", value: "1,823", pct: 77.6, color: "#10B981" },
  { label: "In Progress", value: "362", pct: 15.4, color: "#3B82F6" },
  { label: "Pending", value: "128", pct: 5.4, color: "#F59E0B" },
  { label: "Delayed", value: "35", pct: 1.5, color: "#EF4444" },
];

const tasksByType = [
  { label: "Pick", value: 92, color: "#3B82F6" },
  { label: "Pack", value: 78, color: "#10B981" },
  { label: "Ship", value: 64, color: "#F59E0B" },
  { label: "Putaway", value: 51, color: "#8B5CF6" },
  { label: "Receive", value: 38, color: "#06B6D4" },
  { label: "Count", value: 25, color: "#EF4444" },
];

const recentActivity = [
  { dot: "#3B82F6", title: "Task TSK-000234 started", sub: "Pick · SO-100176" },
  { dot: "#10B981", title: "Task TSK-000228 completed", sub: "Putaway · PO-50872" },
  { dot: "#F59E0B", title: "Task TSK-000231 pending", sub: "Replenish · REQ-8891" },
  { dot: "#EF4444", title: "Task TSK-000225 delayed", sub: "Return Process · RMA-7788" },
];

function TasksHeaderArt() {
  return (
    <svg
      width="84"
      height="64"
      viewBox="0 0 84 64"
      fill="none"
      role="img"
      aria-label="Operations dashboard illustration"
      className="shrink-0"
    >
      {/* soft platform */}
      <ellipse cx="42" cy="58" rx="38" ry="4.5" fill="#003B7A" opacity="0.06" />

      {/* dashboard monitor */}
      <rect x="38" y="8" width="40" height="28" rx="3" fill="#061A3D" />
      <rect x="40.5" y="10.5" width="35" height="22" rx="1.5" fill="#0F2A52" />
      {/* mini donut on screen */}
      <circle cx="50.5" cy="21.5" r="6" fill="none" stroke="#1C3B66" strokeWidth="3" />
      <path d="M50.5 15.5 a6 6 0 0 1 5.2 9" fill="none" stroke="#00B894" strokeWidth="3" strokeLinecap="round" />
      {/* mini bars on screen */}
      <rect x="61" y="24" width="3" height="6" rx="1" fill="#0057D8" />
      <rect x="65.5" y="20" width="3" height="10" rx="1" fill="#00B894" />
      <rect x="70" y="16" width="3" height="14" rx="1" fill="#F59E0B" />
      {/* monitor stand */}
      <rect x="56" y="36" width="4" height="5" fill="#061A3D" />
      <rect x="50" y="41" width="16" height="2.5" rx="1.25" fill="#061A3D" />

      {/* operator figure */}
      {/* chair back */}
      <path d="M10 40 q-3 -10 5 -12 l2 1 q-4 3 -3 11 z" fill="#CBD8EA" />
      {/* body / torso */}
      <path d="M14 56 q-2 -16 9 -16 q11 0 9 16 z" fill="#0057D8" />
      {/* arm reaching to desk */}
      <path d="M28 47 q8 -2 11 3" stroke="#0057D8" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* head */}
      <circle cx="23" cy="33" r="6.5" fill="#F2C9A0" />
      {/* hair */}
      <path d="M16.8 31 q1.5 -8 9 -6.5 q4 1 4.5 6 q-3 -3 -7 -2.5 q-4 0.5 -6.5 3z" fill="#1F2A3D" />

      {/* floating check badge */}
      <circle cx="14" cy="20" r="6.5" fill="#00B894" />
      <path d="M11 20 l2 2.2 l4 -4.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function PriorityBadge({ p }: { p: string }) {
  const styles: Record<string, string> = {
    High: "bg-[#EF4444]/10 text-[#EF4444]",
    Medium: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Low: "bg-[#3B82F6]/10 text-[#3B82F6]",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 text-[12px] font-medium rounded-full ${styles[p]}`}>{p}</span>;
}

function StatusBadge({ s }: { s: string }) {
  const styles: Record<string, string> = {
    "In Progress": "bg-[#3B82F6]/10 text-[#3B82F6]",
    Pending: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Completed: "bg-[#10B981]/10 text-[#10B981]",
    Delayed: "bg-[#EF4444]/10 text-[#EF4444]",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 text-[12px] font-medium rounded-full ${styles[s]}`}>{s}</span>;
}

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("All Tasks");

  // donut math
  const C = 2 * Math.PI * 40;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <TasksHeaderArt />
          <div>
            <h1 className="text-[24px] font-bold text-[#1E293B] flex items-center gap-2">
              Tasks / Operations
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            </h1>
            <p className="text-[14px] text-[#64748B] mt-1">Monitor, manage, and track all warehouse tasks in real time.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC]">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC]">
            <Columns3 className="w-4 h-4" /> Columns
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] rounded-lg text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#2563EB]">
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#64748B]">{s.title}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}1A` }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#1E293B]">{s.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {s.up ? <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
                <span className={`text-[12px] font-medium ${s.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>{s.change}</span>
                <span className="text-[11px] text-[#94A3B8]">vs last 7 days</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="border-b border-[#E2E8F0]">
        <div className="flex items-center" style={{ gap: "28px" }}>
          {filterTabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`relative pb-3 text-[14px] font-medium transition-colors ${
                activeTab === t ? "text-[#3B82F6]" : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              {t}
              {activeTab === t && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#3B82F6] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main: table + right rail */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Table card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2E8F0]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search by task ID, reference..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]">All Warehouses <ChevronDown className="w-3.5 h-3.5" /></button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]">All Task Types <ChevronDown className="w-3.5 h-3.5" /></button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]">All Priorities <ChevronDown className="w-3.5 h-3.5" /></button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Task ID", "Task Type", "Reference", "Warehouse", "Assigned To", "Priority", "Status", "Created At", "Due At", ""].map((h, i) => (
                    <th key={i} className={`text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-5 py-3 ${i === 9 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/60 transition-colors">
                    <td className="px-5 py-3.5 text-[13px] font-medium text-[#3B82F6] font-mono">{t.id}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B]">{t.type}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] font-mono">{t.ref}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{t.warehouse}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B]">{t.assignee}</td>
                    <td className="px-5 py-3.5"><PriorityBadge p={t.priority} /></td>
                    <td className="px-5 py-3.5"><StatusBadge s={t.status} /></td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{t.created}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{t.due}</td>
                    <td className="px-5 py-3.5 text-right"><button className="text-[#94A3B8] hover:text-[#64748B]"><MoreVertical className="w-4 h-4 inline-block" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
            <p className="text-[13px] text-[#64748B]">Showing 1 to 10 of 2,348 tasks</p>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC]"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3B82F6] text-white text-[13px] font-medium">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] text-[13px] hover:bg-[#F8FAFC]">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] text-[13px] hover:bg-[#F8FAFC]">3</button>
              <span className="px-1 text-[13px] text-[#94A3B8]">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] text-[13px] hover:bg-[#F8FAFC]">235</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          {/* Task Status Overview */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-4">Task Status Overview</h3>
            <div className="flex justify-center mb-5">
              <div className="relative w-[140px] h-[140px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {statusOverview.map((s, i) => {
                    const offset = statusOverview.slice(0, i).reduce((acc, x) => acc + x.pct, 0);
                    const dash = `${(s.pct / 100) * C} ${C - (s.pct / 100) * C}`;
                    return (
                      <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={s.color} strokeWidth="12"
                        strokeDasharray={dash} strokeDashoffset={-(offset / 100) * C} />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[20px] font-bold text-[#1E293B]">2,348</p>
                  <p className="text-[11px] text-[#94A3B8]">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {statusOverview.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[#64748B]">{s.label}</span>
                  </div>
                  <span className="font-medium text-[#1E293B]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Productivity */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Productivity (Today)</h3>
              <button className="text-[12px] font-medium text-[#3B82F6] hover:underline">View report</button>
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B]">Tasks Completed</span>
                <span className="text-[15px] font-bold text-[#1E293B]">286</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B]">Avg. Task Time</span>
                <span className="text-[15px] font-bold text-[#1E293B]">14:32</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B]">On-Time Completion</span>
                <span className="text-[15px] font-bold text-[#10B981]">92.4%</span>
              </div>
            </div>
          </div>

          {/* Tasks by Type */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Tasks by Type (Today)</h3>
              <button className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {tasksByType.map((t) => (
                <div key={t.label} className="flex items-center gap-3">
                  <span className="text-[12px] text-[#64748B] w-16 shrink-0">{t.label}</span>
                  <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${t.value}%`, backgroundColor: t.color }} />
                  </div>
                  <span className="text-[12px] font-medium text-[#1E293B] w-7 text-right shrink-0">{t.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Recent Activity</h3>
              <button className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.dot }} />
                  <div>
                    <p className="text-[13px] font-medium text-[#1E293B]">{a.title}</p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
