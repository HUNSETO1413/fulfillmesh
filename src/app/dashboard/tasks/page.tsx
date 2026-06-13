"use client";

import { useEffect, useMemo, useState } from "react";
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
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Trash2,
  Pencil,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

const stats = [
  { title: "Total Tasks", value: "2,348", change: "15.6%", up: true, icon: CheckSquare, color: "#3B82F6" },
  { title: "Completed", value: "1,823", change: "18.3%", up: true, icon: CheckCircle2, color: "#10B981" },
  { title: "In Progress", value: "362", change: "5.2%", up: false, icon: Loader, color: "#3B82F6" },
  { title: "Pending", value: "128", change: "8.7%", up: false, icon: Clock, color: "#F59E0B" },
  { title: "Delayed", value: "35", change: "12.5%", up: false, icon: AlertTriangle, color: "#EF4444" },
];

const filterTabs = ["All Tasks", "In Progress", "Pending", "Completed", "Delayed", "Cancelled"];

const TASK_TYPES = ["Pick", "Pack", "Ship", "Putaway", "Receive", "Replenish", "Cycle Count", "Move", "Return Process", "QC Check"];
const WAREHOUSES = ["ATL-1", "DFW-1", "LAX-1", "MIA-1"];
const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["Pending", "In Progress", "Completed", "Delayed", "Cancelled"];

interface Task {
  id: string; type: string; ref: string; warehouse: string; assignee: string;
  priority: string; status: string; created: string; due: string;
}

const initialTasks: Task[] = [
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

let taskSeq = 235;

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
    Cancelled: "bg-[#64748B]/10 text-[#64748B]",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 text-[12px] font-medium rounded-full ${styles[s] ?? "bg-[#64748B]/10 text-[#64748B]"}`}>{s}</span>;
}

type Draft = { type: string; ref: string; warehouse: string; assignee: string; priority: string; status: string; due: string };

const emptyDraft: Draft = { type: "Pick", ref: "", warehouse: "ATL-1", assignee: "", priority: "Medium", status: "Pending", due: new Date().toISOString().slice(0, 10) };

// The checkbox walks the main lifecycle; Delayed/Cancelled resume at In Progress.
const STATUS_CYCLE = ["Pending", "In Progress", "Completed"];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toInputDate(display: string): string {
  const d = new Date(display);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function toDisplayDate(input: string): string {
  const [y, m, d] = input.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  if (isNaN(date.getTime())) return input;
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function isOverdue(t: Task): boolean {
  if (t.status === "Completed" || t.status === "Cancelled") return false;
  const due = new Date(t.due);
  if (isNaN(due.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

export default function TasksPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [whFilter, setWhFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [prioFilter, setPrioFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: any[]; total: number }>("/api/tasks");
        if (cancelled) return;
        const mapped: Task[] = (res?.data ?? []).map((t: any) => ({
          id: String(t.id),
          type: t.taskType ?? "Pick",
          ref: t.reference ?? "",
          warehouse: t.warehouse ?? "",
          assignee: t.assignee ?? "",
          priority: t.priority ?? "Medium",
          status: t.status ?? "Pending",
          created: t.createdAt ?? "",
          due: t.dueDate ?? "",
        }));
        setItems(mapped);
      } catch (err) {
        if (!cancelled) toast("Failed to load tasks", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToPage(p: number) {
    if (p < 1 || p > 235) return;
    setPage(p);
    toast(`Page ${p} of 235`, "info");
  }

  // donut math
  const C = 2 * Math.PI * 40;

  const assignees = useMemo(
    () => Array.from(new Set(items.map((t) => t.assignee))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((t) => {
      const matchesTab = activeTab === "All Tasks" || t.status === activeTab;
      const matchesQuery = !q || t.id.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q);
      const matchesWh = !whFilter || t.warehouse === whFilter;
      const matchesType = !typeFilter || t.type === typeFilter;
      const matchesPrio = !prioFilter || t.priority === prioFilter;
      const matchesAssignee = !assigneeFilter || t.assignee === assigneeFilter;
      return matchesTab && matchesQuery && matchesWh && matchesType && matchesPrio && matchesAssignee;
    });
    // Overdue tasks surface to the top.
    return [...list].sort((a, b) => Number(isOverdue(b)) - Number(isOverdue(a)));
  }, [items, activeTab, query, whFilter, typeFilter, prioFilter, assigneeFilter]);

  const overdueCount = useMemo(() => items.filter(isOverdue).length, [items]);

  function cycleStatus(id: string) {
    const task = items.find((t) => t.id === id);
    if (!task) return;
    const idx = STATUS_CYCLE.indexOf(task.status);
    const next = idx === -1 ? "In Progress" : STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    setItems((cur) => cur.map((t) => (t.id === id ? { ...t, status: next } : t)));
    toast(`${id} marked ${next}`);
    api.put(`/api/tasks/${id}`, { status: next }).catch(() => toast(`Failed to update ${id}`, "error"));
  }

  function setStatus(id: string, status: string) {
    setItems((cur) => cur.map((t) => (t.id === id ? { ...t, status } : t)));
    setOpenMenu(null);
    toast(`${id} set to ${status}`);
    api.put(`/api/tasks/${id}`, { status }).catch(() => toast(`Failed to update ${id}`, "error"));
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(t: Task) {
    setEditing(t);
    setDraft({
      type: t.type, ref: t.ref, warehouse: t.warehouse, assignee: t.assignee,
      priority: t.priority, status: t.status, due: toInputDate(t.due),
    });
    setOpenMenu(null);
    setFormOpen(true);
  }

  function saveTask() {
    if (!draft.ref.trim()) { toast("Reference is required", "error"); return; }
    if (!draft.assignee.trim()) { toast("Assignee is required", "error"); return; }
    setBusy(true);
    const payload = {
      title: editing?.id ?? `TSK-${String(taskSeq++).padStart(6, "0")}`,
      taskType: draft.type,
      warehouse: draft.warehouse,
      assignee: draft.assignee.trim(),
      priority: draft.priority,
      status: draft.status,
      reference: draft.ref.trim(),
      dueDate: draft.due,
    };
    if (editing) {
      setItems((cur) => cur.map((t) => (t.id === editing.id ? {
        ...t, type: draft.type, ref: draft.ref.trim(), warehouse: draft.warehouse,
        assignee: draft.assignee.trim(), priority: draft.priority, status: draft.status,
        due: toDisplayDate(draft.due),
      } : t)));
      api.put(`/api/tasks/${editing.id}`, payload)
        .then(() => toast(`Task ${editing.id} updated`))
        .catch(() => toast(`Failed to update ${editing.id}`, "error"))
        .finally(() => { setBusy(false); setFormOpen(false); });
      return;
    }
    const localId = payload.title;
    const created: Task = {
      id: localId, type: draft.type, ref: draft.ref.trim(), warehouse: draft.warehouse,
      assignee: draft.assignee.trim(), priority: draft.priority, status: draft.status,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      due: toDisplayDate(draft.due),
    };
    setItems((prev) => [created, ...prev]);
    api.post("/api/tasks", payload)
      .then((res: any) => {
        const newId = res?.id != null ? String(res.id) : null;
        if (newId && newId !== localId) {
          setItems((prev) => prev.map((t) => (t.id === localId ? { ...t, id: newId } : t)));
          toast(`Task ${newId} created`);
        } else {
          toast(`Task ${localId} created`);
        }
      })
      .catch(() => {
        setItems((prev) => prev.filter((t) => t.id !== localId));
        toast("Failed to create task", "error");
      })
      .finally(() => { setBusy(false); setFormOpen(false); });
  }

  function confirmDelete() {
    if (!deleting) return;
    const id = deleting.id;
    setItems((cur) => cur.filter((t) => t.id !== id));
    setDeleting(null);
    api.del(`/api/tasks/${id}`)
      .then(() => toast(`Task ${id} deleted`))
      .catch(() => toast(`Failed to delete ${id}`, "error"));
  }

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-5 h-5 animate-spin text-[#3B82F6]" />
          <span className="ml-2 text-[14px] text-[#64748B]">Loading tasks…</span>
        </div>
      )}
      {!loading && (
      <>
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
          <button onClick={() => { setWhFilter(""); setTypeFilter(""); setPrioFilter(""); setAssigneeFilter(""); setActiveTab("All Tasks"); setQuery(""); toast("Filters cleared", "info"); }} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC]">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <button onClick={() => toast("Column settings", "info")} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC]">
            <Columns3 className="w-4 h-4" /> Columns
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] rounded-lg text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#2563EB]">
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by task ID, reference..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
              />
            </div>
            <select value={whFilter} onChange={(e) => setWhFilter(e.target.value)} className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
              <option value="">All Warehouses</option>
              {WAREHOUSES.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
              <option value="">All Task Types</option>
              {TASK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={prioFilter} onChange={(e) => setPrioFilter(e.target.value)} className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
              <option value="">All Priorities</option>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
              <option value="">All Assignees</option>
              {assignees.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            {overdueCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EF4444]/10 text-[#EF4444] text-[12px] font-medium rounded-full whitespace-nowrap">
                <AlertTriangle className="w-3.5 h-3.5" /> {overdueCount} overdue — shown first
              </span>
            )}
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
                {filtered.map((t) => {
                  const overdue = isOverdue(t);
                  return (
                  <tr key={t.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => cycleStatus(t.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            t.status === "Completed"
                              ? "bg-[#10B981] border-[#10B981]"
                              : t.status === "In Progress"
                                ? "border-[#3B82F6] bg-[#3B82F6]/10"
                                : "border-[#CBD5E1] hover:border-[#3B82F6]"
                          }`}
                          aria-label={`Status: ${t.status}. Click to advance.`}
                          title={`${t.status} — click to advance`}
                        >
                          {t.status === "Completed" && <Check className="w-3 h-3 text-white" />}
                          {t.status === "In Progress" && <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />}
                        </button>
                        <span className="text-[13px] font-medium text-[#3B82F6] font-mono">{t.id}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B]">{t.type}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] font-mono">{t.ref}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{t.warehouse}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B]">{t.assignee}</td>
                    <td className="px-5 py-3.5"><PriorityBadge p={t.priority} /></td>
                    <td className="px-5 py-3.5"><StatusBadge s={t.status} /></td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{t.created}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[13px] ${overdue ? "text-[#EF4444] font-medium" : "text-[#64748B]"}`}>{t.due}</span>
                        {overdue && (
                          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#EF4444]/10 text-[#EF4444]">Overdue</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)} className="text-[#94A3B8] hover:text-[#64748B]" aria-label="Task actions"><MoreVertical className="w-4 h-4 inline-block" /></button>
                        {openMenu === t.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1 text-left">
                              <button onClick={() => openEdit(t)} className="w-full text-left px-3 py-1.5 text-[13px] text-[#374151] hover:bg-[#F8FAFC] flex items-center gap-2"><Pencil className="w-3.5 h-3.5" /> Edit task</button>
                              <div className="my-1 border-t border-[#E2E8F0]" />
                              <p className="px-3 py-1.5 text-[11px] font-semibold text-[#9CA3AF] uppercase">Set status</p>
                              {STATUSES.map((s) => (
                                <button key={s} onClick={() => setStatus(t.id, s)} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F8FAFC] ${t.status === s ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}>{s}</button>
                              ))}
                              <div className="my-1 border-t border-[#E2E8F0]" />
                              <button onClick={() => { setOpenMenu(null); setDeleting(t); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete task</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-5 py-12 text-center">
                      <p className="text-[13px] text-[#64748B]">No tasks match your filters.</p>
                      <button onClick={openCreate} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] hover:underline"><Plus className="w-4 h-4" /> Create a task</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
            <p className="text-[13px] text-[#64748B]">Showing {filtered.length} of {items.length} tasks</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Previous page"><ChevronLeft className="w-4 h-4" /></button>
              {[1, 2, 3].map((p) => (
                <button key={p} onClick={() => goToPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${page === p ? "bg-[#3B82F6] text-white" : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"}`}>{p}</button>
              ))}
              <span className="px-1 text-[13px] text-[#94A3B8]">...</span>
              <button onClick={() => goToPage(235)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${page === 235 ? "bg-[#3B82F6] text-white" : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"}`}>235</button>
              <button onClick={() => goToPage(page + 1)} disabled={page === 235} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Next page"><ChevronRight className="w-4 h-4" /></button>
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
              <button onClick={() => toast("Opening productivity report…", "info")} className="text-[12px] font-medium text-[#3B82F6] hover:underline">View report</button>
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
              <button onClick={() => toast("Opening details…", "info")} className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
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
              <button onClick={() => toast("Opening details…", "info")} className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
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

      {/* Create / Edit Task modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.id}` : "Create Task"}
        description={editing ? "Update the task details below." : "Add a new warehouse task to the queue."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveTask} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create task"}
            </PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Task type">
            <Select options={TASK_TYPES} value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))} />
          </Field>
          <Field label="Warehouse">
            <Select options={WAREHOUSES} value={draft.warehouse} onChange={(e) => setDraft((d) => ({ ...d, warehouse: e.target.value }))} />
          </Field>
          <Field label="Reference" required>
            <TextInput value={draft.ref} onChange={(e) => setDraft((d) => ({ ...d, ref: e.target.value }))} placeholder="SO-100200" />
          </Field>
          <Field label="Assignee" required>
            <TextInput value={draft.assignee} onChange={(e) => setDraft((d) => ({ ...d, assignee: e.target.value }))} placeholder="Jane Doe" />
          </Field>
          <Field label="Priority">
            <Select options={PRIORITIES} value={draft.priority} onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value }))} />
          </Field>
          <Field label="Due date">
            <TextInput type="date" value={draft.due} onChange={(e) => setDraft((d) => ({ ...d, due: e.target.value }))} />
          </Field>
          {editing && (
            <Field label="Status">
              <Select options={STATUSES} value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))} />
            </Field>
          )}
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete task"
        message={`Delete ${deleting?.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
      </>
      )}
    </div>
  );
}
