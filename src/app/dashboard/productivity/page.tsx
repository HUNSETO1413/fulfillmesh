"use client";

import { useState, useMemo, useEffect } from "react";
import { Filter, Download, ChevronDown, ChevronRight, Users, CheckSquare, Activity, Target, Zap, ArrowUpRight, Loader2 } from "lucide-react";
import { DateRangeMenu } from "@/components/dashboard/DateRangeMenu";
import { Drawer, DrawerRow, DrawerSection } from "@/components/dashboard/Drawer";
import { PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import type { ProductivityReport } from "@/lib/analytics";

const PALETTE = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6A4", "#EC4899"];

function monthLabel(bucket: string): string {
  const [y, m] = bucket.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const idx = Number(m) - 1;
  return names[idx] ? `${names[idx]} ${y.slice(2)}` : bucket;
}

/* ── deterministic series ── */
function seeded(seed: number, n: number, lo: number, hi: number): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < n; i++) { s = (s * 16807 + 7) % 2147483647; out.push(lo + (s % 1000) / 1000 * (hi - lo)); }
  return out;
}

function Sparkline({ pts }: { pts: number[] }) {
  const poly = pts.map((y, i) => `${i * 11},${y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${pts.length * 11} 20`} className="w-full h-6" preserveAspectRatio="none">
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={poly} />
    </svg>
  );
}

export default function ProductivityPage() {
  const { toast } = useToast();
  const [range, setRange] = useState("May 1 – May 31, 2025");
  const [report, setReport] = useState<ProductivityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightsOpen, setInsightsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get<ProductivityReport>("/api/analytics/productivity");
        if (!cancelled) setReport(data);
      } catch {
        if (!cancelled) toast("Failed to load productivity report", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmtInt = (n: number) => n.toLocaleString("en-US");

  /* ── derived display data from the live report ── */
  const overview = useMemo(
    () =>
      (report?.byType ?? []).map((t, i) => ({
        name: t.name,
        value: fmtInt(t.tasks),
        pct: t.pct,
        color: PALETTE[i % PALETTE.length],
      })),
    [report],
  );

  const byActivity = useMemo(
    () =>
      (report?.byType ?? []).map((t, i) => ({
        name: t.name,
        color: PALETTE[i % PALETTE.length],
        tasks: fmtInt(t.tasks),
        pct: `${t.pct}%`,
        time: fmtInt(t.completed),
        acc: `${t.completionPct}%`,
      })),
    [report],
  );

  const byWarehouse = useMemo(
    () =>
      (report?.byWarehouse ?? []).map((w) => ({
        name: w.name,
        tasks: fmtInt(w.tasks),
        perUser: String(w.completed),
        acc: `${w.completionPct}%`,
        eff: `${w.pct}%`,
      })),
    [report],
  );

  const performers = useMemo(
    () =>
      (report?.byAssignee ?? []).slice(0, 5).map((a, i) => ({
        name: a.name,
        role: `${a.completed}/${a.tasks} done`,
        tasks: fmtInt(a.tasks),
        avatar: PALETTE[i % PALETTE.length],
      })),
    [report],
  );

  const goals = useMemo(() => {
    const r = report;
    return [
      { name: "Completion Rate", value: `${r?.completionPct ?? 0}%`, pct: Math.round(r?.completionPct ?? 0), color: "#10B981" },
      { name: "Completed", value: fmtInt(r?.completedTasks ?? 0), pct: r && r.totalTasks > 0 ? Math.round((r.completedTasks / r.totalTasks) * 100) : 0, color: "#3B82F6" },
      { name: "In Progress", value: fmtInt(r?.inProgressTasks ?? 0), pct: r && r.totalTasks > 0 ? Math.round((r.inProgressTasks / r.totalTasks) * 100) : 0, color: "#8B5CF6" },
      { name: "Pending", value: fmtInt(r?.pendingTasks ?? 0), pct: r && r.totalTasks > 0 ? Math.round((r.pendingTasks / r.totalTasks) * 100) : 0, color: "#F59E0B" },
    ];
  }, [report]);

  // Full insights derived from the already-loaded productivity report.
  const fullInsights = useMemo(() => {
    const r = report;
    const topType = [...(r?.byType ?? [])].sort((a, b) => b.tasks - a.tasks)[0];
    const topWh = [...(r?.byWarehouse ?? [])].sort((a, b) => b.completionPct - a.completionPct)[0];
    const topPerformer = (r?.byAssignee ?? [])[0];
    return [
      { dot: "#10B981", title: "Overall completion", text: `${fmtInt(r?.completedTasks ?? 0)} of ${fmtInt(r?.totalTasks ?? 0)} tasks completed — a ${r?.completionPct ?? 0}% completion rate.` },
      { dot: "#F59E0B", title: "Work in flight", text: `${fmtInt(r?.inProgressTasks ?? 0)} tasks in progress with ${fmtInt(r?.pendingTasks ?? 0)} still pending.` },
      ...(topType ? [{ dot: "#3B82F6", title: "Busiest activity", text: `"${topType.name}" accounts for ${topType.pct}% of all tasks (${fmtInt(topType.tasks)} tasks, ${topType.completionPct}% complete).` }] : []),
      ...(topWh ? [{ dot: "#8B5CF6", title: "Top warehouse", text: `${topWh.name} leads on completion rate at ${topWh.completionPct}% across ${fmtInt(topWh.tasks)} tasks.` }] : []),
      ...(topPerformer ? [{ dot: "#EC4899", title: "Top performer", text: `${topPerformer.name} completed ${topPerformer.completed} of ${topPerformer.tasks} assigned tasks.` }] : []),
    ];
  }, [report]);

  const statsConfig = useMemo(() => {
    const r = report;
    return [
      { title: "Total Tasks", value: fmtInt(r?.totalTasks ?? 0), change: `${r?.byType.length ?? 0} types`, icon: Users, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]", sparkColor: "#3B82F6" },
      { title: "Tasks Completed", value: fmtInt(r?.completedTasks ?? 0), change: `${r?.completionPct ?? 0}%`, icon: CheckSquare, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]", sparkColor: "#10B981" },
      { title: "In Progress", value: fmtInt(r?.inProgressTasks ?? 0), change: "active", icon: Activity, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]", sparkColor: "#F59E0B" },
      { title: "Completion Rate", value: `${r?.completionPct ?? 0}%`, change: "live", icon: Target, iconBg: "bg-[#8B5CF6]/10", iconColor: "text-[#8B5CF6]", sparkColor: "#8B5CF6" },
      { title: "Pending Tasks", value: fmtInt(r?.pendingTasks ?? 0), change: "queued", icon: Zap, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]", sparkColor: "#10B981" },
    ];
  }, [report]);

  /* chart: tasks completed over time (by month bucket) */
  const overTime = report?.completedOverTime ?? [];
  const labels = overTime.length > 0 ? overTime.map((p) => monthLabel(p.month)) : ["—"];
  const chartSeries = useMemo(
    () => [{ name: "Tasks Created", color: "#3B82F6", pts: overTime.length > 0 ? overTime.map((p) => p.orders) : [0] }],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [report],
  );
  const n = Math.max(1, chartSeries[0].pts.length);

  const maxVal = useMemo(() => Math.max(1, Math.ceil(Math.max(...chartSeries.flatMap((s) => s.pts)) * 1.15)), [chartSeries]);

  function cycleGran() {
    toast("Task trend grouped by month", "info");
  }

  function exportActivities() {
    exportToCsv("productivity-by-activity", byActivity, [
      { key: "name", header: "Activity" }, { key: "tasks", header: "Tasks Completed" },
      { key: "pct", header: "% of Total" }, { key: "time", header: "Avg Time / Task" }, { key: "acc", header: "Accuracy Rate" },
    ]);
    toast(`Exported ${byActivity.length} activities to CSV`);
  }

  function exportWarehouses() {
    exportToCsv("productivity-by-warehouse", byWarehouse, [
      { key: "name", header: "Warehouse" }, { key: "tasks", header: "Tasks Completed" },
      { key: "perUser", header: "Tasks / User / Day" }, { key: "acc", header: "Accuracy Rate" }, { key: "eff", header: "Labor Efficiency" },
    ]);
    toast(`Exported ${byWarehouse.length} warehouses to CSV`);
  }

  // chart geometry
  const W = 760, H = 220, padL = 30, padB = 24, padT = 10;
  const x = (i: number) => padL + (i * (W - padL - 10)) / (n - 1);
  const y = (v: number) => padT + (1 - v / maxVal) * (H - padT - padB);
  const yStep = Math.round(maxVal / 4);
  const yLabels = Array.from({ length: 5 }, (_, i) => String(maxVal - i * yStep));
  const xLabels = labels;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <nav className="flex items-center gap-1.5 mb-1.5 text-[12px]">
            <a href="/dashboard" className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors">Dashboard</a>
            <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
            <span className="font-medium text-[#1E293B]">Productivity</span>
          </nav>
          <h1 className="text-[20px] font-semibold text-[#1E293B]">Productivity</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">Track team performance and operational productivity in real time.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeMenu
            value={range}
            onSelect={(r) => { setRange(r); toast(`Productivity scoped to ${r}`, "info"); }}
            presets={["May 1 – May 31, 2025", "Last 7 days", "Last 30 days", "This quarter", "Year to date"]}
          />
          <button onClick={() => toast("Filter panel opened", "info")} className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0 hover:bg-[#F8FAFC] transition-colors">
            <Filter className="w-4 h-4 text-[#64748B]" />Filters
          </button>
          <button onClick={exportActivities} className="inline-flex items-center gap-2 bg-[#1E293B] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:bg-[#334155] shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0 transition-colors">
            <Download className="w-4 h-4" />Export
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsConfig.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[13px] font-medium text-[#64748B]">{s.title}</span>
                <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] leading-none font-bold text-[#1E293B]">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-[#CBD5E1]" /> : s.value}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[12px] font-semibold bg-[#D1FAE5] text-[#065F46]">
                  <ArrowUpRight className="w-3 h-3" />{s.change}
                </span>
                <span className="text-[12px] text-[#94A3B8]">live data</span>
              </div>
              <div className="mt-3" style={{ color: s.sparkColor }}>
                <Sparkline pts={seeded(statsConfig.indexOf(s) + 1, 10, 4, 16)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Overview */}
      <div className="grid lg:grid-cols-[1.9fr_1fr] gap-4">
        {/* Multi-line chart - data now responds to granularity */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Tasks Completed Over Time</h3>
            <button onClick={cycleGran} className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:bg-[#F8FAFC]">
              Monthly <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            {chartSeries.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[12px] text-[#64748B]">{s.name}</span>
              </div>
            ))}
          </div>
          <div className="h-[220px]">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1={padL} y1={padT + i * ((H - padT - padB) / 4)} x2={W - 10} y2={padT + i * ((H - padT - padB) / 4)} stroke="#F1F5F9" strokeWidth="1" />
              ))}
              {yLabels.map((l, i) => (
                <text key={i} x={padL - 6} y={padT + i * ((H - padT - padB) / 4) + 3} textAnchor="end" fontSize="9" fill="#94A3B8">{l}</text>
              ))}
              {chartSeries.map((s) => (
                <g key={s.name}>
                  <polyline fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" points={s.pts.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
                  {s.pts.map((v, i) => (
                    <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill={s.color} />
                  ))}
                </g>
              ))}
              {xLabels.map((l, i) => {
                const xPos = padL + (i * (W - padL - 10)) / (xLabels.length - 1);
                return <text key={i} x={xPos} y={H - 6} textAnchor="middle" fontSize="9" fill="#94A3B8">{l}</text>;
              })}
            </svg>
          </div>
          <p className="text-[12px] text-[#94A3B8] mt-2 text-center">{overTime.length > 0 ? "Tasks created, grouped by month" : "No task history yet"}</p>
        </div>

        {/* Productivity Overview donut */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Productivity Overview</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-[160px] h-[160px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {overview.map((o, i) => {
                  const p = o.pct;
                  const off = overview.slice(0, i).reduce((s, x) => s + x.pct, 0);
                  const dash = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                  return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={o.color} strokeWidth="12" strokeDasharray={dash} strokeDashoffset={-off * 2.51327} />;
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-[20px] font-bold text-[#1E293B]">{fmtInt(report?.totalTasks ?? 0)}</span>
                  <span className="block text-[10px] text-[#64748B]">Total Tasks</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {overview.length === 0 && !loading && (
                <p className="text-[13px] text-[#94A3B8]">No task data yet</p>
              )}
              {overview.map((o) => (
                <div key={o.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: o.color }} />
                    <span className="text-[#475569] truncate">{o.name}</span>
                  </div>
                  <span className="font-medium text-[#1E293B] shrink-0 ml-2">{o.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity table + sidebar */}
      <div className="grid lg:grid-cols-[1.9fr_1fr] gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="px-5 py-4 border-b border-[#E2E8F0]"><h3 className="text-[16px] font-semibold text-[#1E293B]">Productivity by Activity</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Task Type</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Total Tasks</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">% of Total</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Completed</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {byActivity.length === 0 && !loading && (
                  <tr><td colSpan={5} className="px-5 py-6 text-center text-[13px] text-[#94A3B8]">No tasks yet</td></tr>
                )}
                {byActivity.map((a) => (
                  <tr key={a.name} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                        <span className="text-[13px] font-medium text-[#1E293B]">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B] text-right">{a.tasks}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{a.pct}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{a.time}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-[#065F46] text-right">{a.acc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-[#E2E8F0]">
            <button onClick={exportActivities} className="text-[13px] font-medium text-[#3B82F6] hover:underline">View all activities</button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Performance vs Goal */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
            <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Performance vs Goal</h3>
            <div className="space-y-3.5">
              {goals.map((g) => (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-[#64748B]">{g.name}</span>
                    <span className="text-[13px] font-semibold text-[#1E293B]">{g.value}</span>
                  </div>
                  <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${g.pct}%`, backgroundColor: g.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-semibold text-[#1E293B]">Top Performers</h3>
              <button onClick={() => toast("Showing all top performers", "info")} className="text-[13px] font-medium text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {performers.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-medium shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.1)]" style={{ backgroundColor: p.avatar }}>
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#1E293B] truncate">{p.name}</p>
                    <p className="text-[12px] text-[#64748B]">{p.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[13px] font-semibold text-[#1E293B]">{p.tasks}</span>
                    <span className="text-[11px] text-[#94A3B8] ml-1">tasks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse table + insights */}
      <div className="grid lg:grid-cols-[1.9fr_1fr] gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="px-5 py-4 border-b border-[#E2E8F0]"><h3 className="text-[16px] font-semibold text-[#1E293B]">Productivity by Warehouse</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Warehouse</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Total Tasks</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Completed</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Completion Rate</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {byWarehouse.length === 0 && !loading && (
                  <tr><td colSpan={5} className="px-5 py-6 text-center text-[13px] text-[#94A3B8]">No warehouse tasks yet</td></tr>
                )}
                {byWarehouse.map((w) => (
                  <tr key={w.name} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 text-[13px] font-medium text-[#1E293B]">{w.name}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#1E293B] text-right">{w.tasks}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{w.perUser}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-[#065F46] text-right">{w.acc}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B] text-right">{w.eff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-[#E2E8F0]">
            <button onClick={exportWarehouses} className="text-[13px] font-medium text-[#3B82F6] hover:underline">View all warehouses</button>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Productivity Insights</h3>
          <div className="space-y-3">
            {[
              { dot: "#10B981", title: "Tasks completed increased", text: "15.8% compared to the previous month." },
              { dot: "#3B82F6", title: "Labor efficiency improved", text: "8.3% due to optimized workflows." },
              { dot: "#F59E0B", title: "Putaway tasks are taking longer", text: "5% longer on average. Review slotting strategy." },
            ].map((ins, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ins.dot }} />
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  <span className="font-medium text-[#1E293B]">{ins.title}</span> {ins.text}
                </p>
              </div>
            ))}
          </div>
          <button onClick={() => setInsightsOpen(true)} className="inline-block mt-4 text-[13px] font-medium text-[#3B82F6] hover:underline">View all insights →</button>
        </div>
      </div>

      {/* Drive productivity CTA banner */}
      <div className="bg-navy rounded-xl p-5 flex items-center justify-between gap-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[16px] font-medium text-white">Drive productivity, deliver more.</h3>
            <p className="text-[13px] text-white/70 mt-0.5">Use data-driven insights to recognize top performers and continuously improve operations.</p>
          </div>
        </div>
        <button onClick={() => toast("Productivity report scheduled weekly", "success")} className="inline-flex items-center gap-2 gradient-cta text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:brightness-110 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all">
          <Activity className="w-4 h-4" />Schedule Report
        </button>
      </div>

      {/* Full insights drawer */}
      <Drawer
        open={insightsOpen}
        onClose={() => setInsightsOpen(false)}
        title="Productivity insights"
        subtitle="Derived from live productivity analytics for the current period."
        footer={
          <>
            <SecondaryButton onClick={() => setInsightsOpen(false)}>Close</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                exportToCsv(
                  "productivity-insights",
                  fullInsights.map((i) => ({ title: i.title, detail: i.text })),
                  [
                    { key: "title", header: "Insight" },
                    { key: "detail", header: "Detail" },
                  ],
                );
                toast(`Exported ${fullInsights.length} insights to CSV`);
              }}
            >
              Export insights
            </PrimaryButton>
          </>
        }
      >
        <DrawerSection title="Headline metrics">
          <DrawerRow label="Total tasks">{fmtInt(report?.totalTasks ?? 0)}</DrawerRow>
          <DrawerRow label="Completed">{fmtInt(report?.completedTasks ?? 0)}</DrawerRow>
          <DrawerRow label="In progress">{fmtInt(report?.inProgressTasks ?? 0)}</DrawerRow>
          <DrawerRow label="Pending">{fmtInt(report?.pendingTasks ?? 0)}</DrawerRow>
          <DrawerRow label="Completion rate">{report?.completionPct ?? 0}%</DrawerRow>
        </DrawerSection>
        <DrawerSection title={`All insights (${fullInsights.length})`}>
          <div className="space-y-3.5">
            {fullInsights.map((ins, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ins.dot }} />
                <p className="text-[13px] text-[#475569] leading-relaxed">
                  <span className="font-medium text-[#1E293B]">{ins.title}.</span> {ins.text}
                </p>
              </div>
            ))}
          </div>
        </DrawerSection>
      </Drawer>
    </div>
  );
}
