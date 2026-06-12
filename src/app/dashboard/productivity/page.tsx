"use client";

import { Calendar, Filter, Download, ChevronDown, ChevronRight, Users, CheckSquare, Activity, Target, Zap, ArrowUpRight } from "lucide-react";

const stats = [
  { title: "Total Active Users", value: "128", change: "+12.5%", note: "vs Apr 30", icon: Users, iconBg: "bg-[#3B82F6]/10", iconColor: "text-[#3B82F6]", sparkColor: "#3B82F6" },
  { title: "Tasks Completed", value: "24,568", change: "+8.3%", note: "vs Apr 30", icon: CheckSquare, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]", sparkColor: "#10B981" },
  { title: "Avg. Task / User / Day", value: "19.18", change: "+3.2%", note: "vs Apr 30", icon: Activity, iconBg: "bg-[#F59E0B]/10", iconColor: "text-[#F59E0B]", sparkColor: "#F59E0B" },
  { title: "Accuracy Rate", value: "99.35%", change: "+0.4 pp", note: "vs Apr 30", icon: Target, iconBg: "bg-[#8B5CF6]/10", iconColor: "text-[#8B5CF6]", sparkColor: "#8B5CF6" },
  { title: "Labor Efficiency", value: "1.28", change: "+5.1%", note: "vs Apr 30", icon: Zap, iconBg: "bg-[#10B981]/10", iconColor: "text-[#10B981]", sparkColor: "#10B981" },
];

const activitySeries = [
  { name: "Picking", color: "#3B82F6", pts: [50, 60, 55, 70, 65, 80, 75, 85, 80, 90] },
  { name: "Packing", color: "#10B981", pts: [40, 45, 50, 48, 55, 52, 60, 58, 62, 65] },
  { name: "Receiving", color: "#F59E0B", pts: [30, 35, 32, 40, 38, 42, 40, 45, 43, 48] },
  { name: "Putaway", color: "#8B5CF6", pts: [22, 26, 24, 30, 28, 32, 30, 34, 33, 36] },
  { name: "Cycle Count", color: "#EF4444", pts: [12, 15, 13, 18, 16, 20, 18, 22, 20, 24] },
];

const overview = [
  { name: "Picking", value: "10,256", pct: "41.7%", color: "#3B82F6" },
  { name: "Packing", value: "6,742", pct: "27.4%", color: "#10B981" },
  { name: "Receiving", value: "4,152", pct: "16.9%", color: "#F59E0B" },
  { name: "Putaway", value: "2,456", pct: "10.0%", color: "#8B5CF6" },
  { name: "Cycle Count", value: "962", pct: "3.9%", color: "#EF4444" },
];

const byActivity = [
  { name: "Picking", color: "#3B82F6", tasks: "10,256", pct: "41.7%", time: "1m 48s", acc: "99.42%" },
  { name: "Packing", color: "#10B981", tasks: "6,742", pct: "27.4%", time: "2m 14s", acc: "99.61%" },
  { name: "Receiving", color: "#F59E0B", tasks: "4,152", pct: "16.9%", time: "3m 02s", acc: "99.08%" },
  { name: "Putaway", color: "#8B5CF6", tasks: "2,456", pct: "10.0%", time: "2m 41s", acc: "99.27%" },
  { name: "Cycle Count", color: "#EF4444", tasks: "962", pct: "3.9%", time: "4m 48s", acc: "99.58%" },
];

const byWarehouse = [
  { name: "ATL-1 · Atlanta", tasks: "8,265", perUser: "21.3", acc: "99.41%", eff: "1.32" },
  { name: "DFW-1 · Dallas", tasks: "6,154", perUser: "19.8", acc: "99.28%", eff: "1.24" },
  { name: "LAX-1 · Los Angeles", tasks: "5,432", perUser: "18.7", acc: "99.52%", eff: "1.31" },
  { name: "MIA-1 · Miami", tasks: "3,568", perUser: "16.4", acc: "99.22%", eff: "1.18" },
  { name: "ORD-1 · Chicago", tasks: "1,149", perUser: "14.2", acc: "99.07%", eff: "1.12" },
];

const goals = [
  { name: "Tasks Completed", value: "103.6%", pct: 100, color: "#10B981" },
  { name: "Accuracy Rate", value: "99.35%", pct: 99, color: "#3B82F6" },
  { name: "Labor Efficiency", value: "1.28 / 1.10", pct: 96, color: "#8B5CF6" },
  { name: "On-Time Rate", value: "96.7% / 95.0%", pct: 97, color: "#F59E0B" },
];

const performers = [
  { name: "James Carter", role: "Picking", tasks: "1,285", avatar: "#3B82F6" },
  { name: "Sophie Lee", role: "Packing", tasks: "1,102", avatar: "#10B981" },
  { name: "Michael Brown", role: "Receiving", tasks: "986", avatar: "#F59E0B" },
  { name: "Olivia Martinez", role: "Putaway", tasks: "742", avatar: "#8B5CF6" },
  { name: "Daniel Wilson", role: "Cycle Count", tasks: "510", avatar: "#EF4444" },
];

function Sparkline({ color }: { color: string }) {
  const pts = [14, 10, 16, 8, 12, 6, 13, 7, 10, 4];
  const poly = pts.map((y, i) => `${i * 11},${y}`).join(" ");
  return (
    <svg viewBox="0 0 100 20" className="w-full h-6" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={poly} />
    </svg>
  );
}

export default function ProductivityPage() {
  // multi-line chart geometry
  const W = 760, H = 220, padL = 30, padB = 24, padT = 10;
  const max = 95;
  const x = (i: number) => padL + (i * (W - padL - 10)) / 9;
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);

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
          <button className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0 hover:bg-[#F8FAFC] transition-colors">
            <Calendar className="w-4 h-4 text-[#64748B]" />
            May 1 – May 31, 2025
            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
          </button>
          <button className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0 hover:bg-[#F8FAFC] transition-colors">
            <Filter className="w-4 h-4 text-[#64748B]" />
            Filters
          </button>
          <button className="inline-flex items-center gap-2 bg-[#1E293B] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:bg-[#334155] shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Row (5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[13px] font-medium text-[#64748B]">{s.title}</span>
                <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-[28px] leading-none font-bold text-[#1E293B]">{s.value}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[12px] font-semibold bg-[#D1FAE5] text-[#065F46]">
                  <ArrowUpRight className="w-3 h-3" />
                  {s.change}
                </span>
                <span className="text-[12px] text-[#94A3B8]">{s.note}</span>
              </div>
              <div className="mt-3">
                <Sparkline color={s.sparkColor} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Overview */}
      <div className="grid lg:grid-cols-[1.9fr_1fr] gap-4">
        {/* Multi-line chart */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Tasks Completed Over Time</h3>
            <button className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B] border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
              Daily <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            {activitySeries.map((s) => (
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
              {[95, 71, 48, 24, 0].map((v, i) => (
                <text key={i} x={padL - 6} y={padT + i * ((H - padT - padB) / 4) + 3} textAnchor="end" fontSize="9" fill="#94A3B8">{v}</text>
              ))}
              {activitySeries.map((s) => (
                <g key={s.name}>
                  <polyline fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" points={s.pts.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
                  {s.pts.map((v, i) => (
                    <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill={s.color} />
                  ))}
                </g>
              ))}
              {["May 1", "May 5", "May 11", "May 16", "May 20", "May 26", "May 31"].map((l, i) => (
                <text key={i} x={padL + i * ((W - padL - 10) / 6)} y={H - 6} textAnchor="middle" fontSize="9" fill="#94A3B8">{l}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Productivity Overview donut */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <h3 className="text-[16px] font-semibold text-[#1E293B] mb-4">Productivity Overview</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-[160px] h-[160px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {overview.map((o, i) => {
                  const p = parseFloat(o.pct);
                  const off = overview.slice(0, i).reduce((s, x) => s + parseFloat(x.pct), 0);
                  const dash = `${p * 2.51327} ${251.327 - p * 2.51327}`;
                  return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={o.color} strokeWidth="12" strokeDasharray={dash} strokeDashoffset={-off * 2.51327} />;
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-[20px] font-bold text-[#1E293B]">24,568</span>
                  <span className="block text-[10px] text-[#64748B]">Tasks Completed</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {overview.map((o) => (
                <div key={o.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: o.color }} />
                    <span className="text-[#475569] truncate">{o.name}</span>
                  </div>
                  <span className="font-medium text-[#1E293B] shrink-0 ml-2">{o.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity table + sidebar */}
      <div className="grid lg:grid-cols-[1.9fr_1fr] gap-4">
        {/* Productivity by Activity */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Productivity by Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Activity</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Tasks Completed</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">% of Total</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Avg. Time / Task</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Accuracy Rate</th>
                </tr>
              </thead>
              <tbody>
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
            <a href="#" className="text-[13px] font-medium text-[#3B82F6] hover:underline">View all activities</a>
          </div>
        </div>

        {/* Right column */}
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
              <a href="#" className="text-[13px] font-medium text-[#3B82F6] hover:underline">View all</a>
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
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-[16px] font-semibold text-[#1E293B]">Productivity by Warehouse</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Warehouse</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Tasks Completed</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Tasks / User / Day</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Accuracy Rate</th>
                  <th className="text-right text-[12px] font-semibold text-[#475569] px-5 py-3 uppercase tracking-wide">Labor Efficiency</th>
                </tr>
              </thead>
              <tbody>
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
            <a href="#" className="text-[13px] font-medium text-[#3B82F6] hover:underline">View all warehouses</a>
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
          <a href="#" className="inline-block mt-4 text-[13px] font-medium text-[#3B82F6] hover:underline">View all insights →</a>
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
        <button className="inline-flex items-center gap-2 gradient-cta text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:brightness-110 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all">
          <Calendar className="w-4 h-4" />
          Schedule Report
        </button>
      </div>
    </div>
  );
}
