"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client";
import {
  Bell,
  Settings,
  CheckCheck,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Truck,
  AlertTriangle,
  FileText,
  Wrench,
  CreditCard,
  Mail,
  Trash2,
  Archive,
  Check,
  X,
  MoreHorizontal,
  MailOpen,
} from "lucide-react";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/Toast";

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

interface Notification {
  id: number;
  icon: typeof Truck;
  color: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  category: string;
  link?: string | null;
}

// Shape returned by /api/notifications.
interface AppNotification {
  id: string | number;
  type: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  link?: string | null;
}

const summary = [
  { label: "Orders", value: "24", pct: 19, color: "#0057D8" },
  { label: "Inventory", value: "32", pct: 25, color: "#00B894" },
  { label: "Shipments", value: "28", pct: 22, color: "#F59E0B" },
  { label: "System", value: "22", pct: 17, color: "#7C6FF6" },
  { label: "Billing", value: "10", pct: 8, color: "#EF4444" },
  { label: "Other", value: "12", pct: 9, color: "#007F8C" },
];

const preferences = [
  { label: "Order Updates", on: true },
  { label: "Inventory Alerts", on: true },
  { label: "Shipment Tracking", on: true },
  { label: "System Notices", on: false },
  { label: "Billing Reminders", on: true },
];

// Map a notification category to its icon + color (used for derived rows).
const CATEGORY_STYLE: Record<string, { icon: typeof Truck; color: string }> = {
  Orders: { icon: FileText, color: "#0057D8" },
  Inventory: { icon: AlertTriangle, color: "#F59E0B" },
  Shipments: { icon: Truck, color: "#0057D8" },
  System: { icon: Wrench, color: "#64748B" },
  Billing: { icon: CreditCard, color: "#F59E0B" },
  Other: { icon: FileText, color: "#007F8C" },
};
const DEFAULT_CATEGORY_STYLE = { icon: Bell, color: "#64748B" };

// Format an ISO timestamp into a relative label like "2h ago".
function formatRelativeTime(iso: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  if (wk < 5) return `${wk}w ago`;
  const mo = Math.round(day / 30);
  return `${mo}mo ago`;
}

const PAGE_SIZE = 10;

// Where clicking a notification of a given category takes you.
const CATEGORY_ROUTES: Record<string, string> = {
  Orders: "/dashboard/orders",
  Inventory: "/dashboard/inventory",
  Shipments: "/dashboard/shipments",
  Billing: "/dashboard/invoices",
  System: "/dashboard/system-settings",
};

export default function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [active, setActive] = useState("All");
  const [prefs, setPrefs] = useState(preferences);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [clearOpen, setClearOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const C = 2 * Math.PI * 40;

  // Fetch notifications from the API on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: AppNotification[]; total: number }>("/api/notifications");
        if (cancelled) return;
        const mapped: Notification[] = (res.data ?? []).map((n) => {
          const style = CATEGORY_STYLE[n.type] ?? DEFAULT_CATEGORY_STYLE;
          return {
            id: Number(n.id),
            icon: style.icon,
            color: style.color,
            title: n.title ?? "",
            desc: n.description ?? "",
            time: formatRelativeTime(n.createdAt),
            unread: !n.read,
            category: n.type ?? "Other",
            link: n.link,
          };
        });
        setItems(mapped);
      } catch (err) {
        if (!cancelled) toast("Failed to load notifications", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unreadCount = items.filter((n) => n.unread).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      const matchesTab =
        active === "All" ? true :
        active === "Unread" ? n.unread :
        n.category === active;
      const matchesQuery = !q || n.title.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [items, active, query]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length, Unread: unreadCount };
    for (const t of tabs) {
      if (t.label === "All" || t.label === "Unread") continue;
      counts[t.label] = items.filter((n) => n.category === t.label).length;
    }
    return counts;
  }, [items, unreadCount]);

  function markRead(id: number) {
    const target = items.find((n) => n.id === id);
    if (!target || !target.unread) return;
    setItems((cur) => cur.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    toast("Notification marked as read");
    api.put(`/api/notifications/${id}`, { read: true }).catch(() => {
      /* fire-and-forget */
    });
  }

  function markUnread(id: number) {
    setItems((cur) => cur.map((n) => (n.id === id ? { ...n, unread: true } : n)));
    setOpenMenu(null);
    toast("Notification marked as unread");
    api.put(`/api/notifications/${id}`, { read: false }).catch(() => {
      /* fire-and-forget */
    });
  }

  // Mark read, then navigate to the notification's link (or its category route).
  function openNotification(n: Notification) {
    markRead(n.id);
    const route = n.link || CATEGORY_ROUTES[n.category];
    if (route) router.push(route);
  }

  function markAllRead() {
    if (unreadCount === 0) {
      toast("No unread notifications", "info");
      return;
    }
    setItems((cur) => cur.map((n) => ({ ...n, unread: false })));
    toast(`Marked ${unreadCount} notification${unreadCount === 1 ? "" : "s"} as read`);
    items.filter((n) => n.unread).forEach((n) => {
      api.put(`/api/notifications/${n.id}`, { read: true }).catch(() => {
        /* fire-and-forget */
      });
    });
  }

  function removeOne(id: number) {
    setItems((cur) => cur.filter((n) => n.id !== id));
    setOpenMenu(null);
    toast("Notification removed");
    api.del(`/api/notifications/${id}`).catch(() => {
      /* fire-and-forget */
    });
  }

  function archiveAllRead() {
    const readCount = items.filter((n) => !n.unread).length;
    if (readCount === 0) {
      toast("No read notifications to archive", "info");
      return;
    }
    setItems((cur) => cur.filter((n) => n.unread));
    toast(`Archived ${readCount} read notification${readCount === 1 ? "" : "s"}`);
  }

  function confirmClear() {
    items.forEach((n) => {
      api.del(`/api/notifications/${n.id}`).catch(() => {
        /* fire-and-forget */
      });
    });
    setItems([]);
    setClearOpen(false);
    toast("All notifications cleared");
  }

  const quickActions: { label: string; icon: typeof CheckCheck; onClick: () => void }[] = [
    { label: "Mark all as read", icon: CheckCheck, onClick: markAllRead },
    { label: "Email digest settings", icon: Mail, onClick: () => router.push("/dashboard/settings/notifications") },
    { label: "Archive all read", icon: Archive, onClick: archiveAllRead },
    { label: "Clear notifications", icon: Trash2, onClick: () => setClearOpen(true) },
  ];

  const shown = visible.slice(0, visibleCount);

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
          <button onClick={markAllRead} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-muted shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
          <button onClick={() => router.push("/dashboard/settings/notifications")} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-muted shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg transition-colors">
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
              onClick={() => { setActive(t.label); setVisibleCount(PAGE_SIZE); }}
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
                {tabCounts[t.label] ?? t.count}
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
                value={query}
                onChange={(e) => { setQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
                placeholder="Search notifications..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue transition-colors"
              />
            </div>
            <button onClick={() => { setActive("Unread"); setVisibleCount(PAGE_SIZE); }} className="flex items-center gap-2 px-3 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Unread only
            </button>
            <button onClick={markAllRead} className="flex items-center gap-2 px-3 py-2 bg-white border border-border-soft rounded-lg text-[13px] text-text-muted hover:bg-soft-bg transition-colors">
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          </div>

          {/* Notification rows */}
          <div>
            {shown.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => openNotification(n)}
                  className={`group flex items-start gap-4 px-5 py-4 border-b border-border-soft/50 last:border-b-0 hover:bg-soft-bg/60 transition-colors cursor-pointer ${
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

                  {/* Time + actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className="text-[12px] text-text-light whitespace-nowrap">{n.time}</span>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-action-blue" />}
                    {n.unread && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-text-light hover:text-teal hover:bg-soft-bg"
                        aria-label="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === n.id ? null : n.id); }}
                        className="p-1 rounded text-text-light hover:text-text-muted hover:bg-soft-bg"
                        aria-label="Notification actions"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                      {openMenu === n.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpenMenu(null); }} />
                          <div className="absolute right-0 mt-1 z-20 w-40 bg-white rounded-lg border border-border-soft shadow-lg py-1 text-left" onClick={(e) => e.stopPropagation()}>
                            {n.unread ? (
                              <button onClick={() => { markRead(n.id); setOpenMenu(null); }} className="w-full text-left px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg flex items-center gap-2">
                                <MailOpen className="w-3.5 h-3.5" /> Mark read
                              </button>
                            ) : (
                              <button onClick={() => markUnread(n.id)} className="w-full text-left px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> Mark unread
                              </button>
                            )}
                            <button onClick={() => { setOpenMenu(null); removeOne(n.id); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2">
                              <X className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {visible.length === 0 && (
              <div className="px-5 py-12 text-center">
                <p className="text-[13px] text-text-muted">No notifications match your filters.</p>
              </div>
            )}
          </div>

          {/* Footer: count + Load more */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-border-soft">
            <p className="text-[13px] text-text-muted">Showing {shown.length} of {visible.length} notifications</p>
            {visible.length > visibleCount && (
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-action-blue hover:bg-soft-bg transition-colors"
              >
                Load more ({visible.length - visibleCount} remaining)
              </button>
            )}
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
                    const offset = summary.slice(0, i).reduce((acc, x) => acc + x.pct, 0);
                    const dash = `${(s.pct / 100) * C} ${C - (s.pct / 100) * C}`;
                    return (
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
              <span className="text-[11px] font-semibold bg-action-blue text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
            </div>
            <div className="space-y-3">
              {items.filter((n) => n.unread).map((u) => {
                const Icon = u.icon;
                return (
                  <button
                    key={u.id}
                    onClick={() => markRead(u.id)}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-lg hover:bg-soft-bg transition-colors cursor-pointer"
                  >
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
                  </button>
                );
              })}
              {unreadCount === 0 && <p className="text-[12px] text-text-light">You&apos;re all caught up.</p>}
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
                    onClick={() => {
                      setPrefs((cur) => cur.map((x, j) => (j === i ? { ...x, on: !x.on } : x)));
                      toast(`${p.label} ${p.on ? "disabled" : "enabled"}`);
                    }}
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
                    onClick={a.onClick}
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
        <button onClick={() => router.push("/dashboard/settings/notifications")} className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg text-[14px] font-semibold text-teal hover:bg-white/90 whitespace-nowrap shrink-0 shadow-button transition-colors">
          <Settings className="w-4 h-4" /> Manage Preferences
        </button>
      </div>

      {/* Clear all confirm */}
      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={confirmClear}
        title="Clear all notifications"
        message="This will remove all notifications from your inbox. This action cannot be undone."
        confirmLabel="Clear all"
        destructive
      />
    </div>
  );
}
