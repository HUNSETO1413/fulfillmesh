"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown, CheckCheck } from "lucide-react";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

interface DashboardTopbarProps {
  onMenuToggle: () => void;
  pageTitle: string;
}

interface SearchRoute {
  label: string;
  href: string;
  section: string;
}

const SEARCH_INDEX: SearchRoute[] = [
  { label: "Dashboard", href: "/dashboard", section: "Overview" },
  { label: "Analytics", href: "/dashboard/analytics", section: "Overview" },
  { label: "Reports", href: "/dashboard/reports", section: "Overview" },
  { label: "Orders", href: "/dashboard/orders", section: "Orders & Sales" },
  { label: "Order Performance", href: "/dashboard/order-performance", section: "Orders & Sales" },
  { label: "Quotes", href: "/dashboard/quotes", section: "Orders & Sales" },
  { label: "Invoices", href: "/dashboard/invoices", section: "Orders & Sales" },
  { label: "Products", href: "/dashboard/products", section: "Catalog" },
  { label: "Inventory", href: "/dashboard/inventory", section: "Catalog" },
  { label: "Customers", href: "/dashboard/customers", section: "People" },
  { label: "Suppliers", href: "/dashboard/suppliers", section: "People" },
  { label: "Users & Roles", href: "/dashboard/users-roles", section: "People" },
  { label: "Shipments", href: "/dashboard/shipments", section: "Logistics" },
  { label: "Returns", href: "/dashboard/returns", section: "Logistics" },
  { label: "QC Inspections", href: "/dashboard/qc-inspections", section: "Logistics" },
  { label: "Warehouse Operations", href: "/dashboard/warehouse/operations", section: "Warehouse" },
  { label: "Warehouse Inventory", href: "/dashboard/warehouse/inventory", section: "Warehouse" },
  { label: "Outbound", href: "/dashboard/warehouse/outbound", section: "Warehouse" },
  { label: "Locations", href: "/dashboard/warehouse/locations", section: "Warehouse" },
  { label: "Storage Types", href: "/dashboard/warehouse/storage-types", section: "Warehouse" },
  { label: "Transfers", href: "/dashboard/warehouse/transfers", section: "Warehouse" },
  { label: "Cycle Count", href: "/dashboard/warehouse/cycle-count", section: "Warehouse" },
  { label: "Operational Reports", href: "/dashboard/operational-reports", section: "Reporting" },
  { label: "Exception Reports", href: "/dashboard/exception-reports", section: "Reporting" },
  { label: "Productivity", href: "/dashboard/productivity", section: "Reporting" },
  { label: "Tasks", href: "/dashboard/tasks", section: "Workspace" },
  { label: "Messages", href: "/dashboard/messages", section: "Workspace" },
  { label: "Documents", href: "/dashboard/documents", section: "Workspace" },
  { label: "Notifications", href: "/dashboard/notifications", section: "Workspace" },
  { label: "Integrations", href: "/dashboard/integrations", section: "Workspace" },
  { label: "Audit Logs", href: "/dashboard/audit-logs", section: "Workspace" },
  { label: "API Keys", href: "/dashboard/api-keys", section: "Workspace" },
  { label: "Settings", href: "/dashboard/settings", section: "Settings" },
  { label: "Notification Settings", href: "/dashboard/settings/notifications", section: "Settings" },
  { label: "Security Settings", href: "/dashboard/settings/security", section: "Settings" },
  { label: "Billing Settings", href: "/dashboard/settings/billing", section: "Settings" },
  { label: "Carrier Settings", href: "/dashboard/settings/carriers", section: "Settings" },
  { label: "Warehouse Settings", href: "/dashboard/settings/warehouses", section: "Settings" },
  { label: "User Settings", href: "/dashboard/settings/users", section: "Settings" },
  { label: "Integration Settings", href: "/dashboard/settings/integrations", section: "Settings" },
  { label: "System Settings", href: "/dashboard/system-settings", section: "Settings" },
];

interface TopbarNotification {
  id: number;
  title: string;
  time: string;
  unread: boolean;
  href?: string;
}

const initialNotifications: TopbarNotification[] = [
  { id: 1, title: "Shipment SO-102876 has been shipped", time: "10:24 AM", unread: true, href: "/dashboard/shipments" },
  { id: 2, title: "Low stock alert: SKU-10023 at ATL1", time: "09:58 AM", unread: true, href: "/dashboard/inventory" },
  { id: 3, title: "New message from James Carter", time: "09:30 AM", unread: true, href: "/dashboard/messages" },
  { id: 4, title: "Invoice INV-2041 generated", time: "Yesterday", unread: false, href: "/dashboard/invoices" },
  { id: 5, title: "System maintenance scheduled for Jun 5", time: "May 29", unread: false },
];

export default function DashboardTopbar({
  onMenuToggle,
  pageTitle,
}: DashboardTopbarProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Global search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<TopbarNotification[]>(initialNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  // Logout
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter(
      (r) => r.label.toLowerCase().includes(q) || r.section.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const groupedResults = useMemo(() => {
    const groups: { section: string; items: { route: SearchRoute; index: number }[] }[] = [];
    results.forEach((route, index) => {
      const last = groups[groups.length - 1];
      if (last && last.section === route.section) {
        last.items.push({ route, index });
      } else {
        groups.push({ section: route.section, items: [{ route, index }] });
      }
    });
    return groups;
  }, [results]);

  function navigateTo(route: SearchRoute) {
    setSearchOpen(false);
    setSearchQuery("");
    setActiveIndex(0);
    router.push(route.href);
  }

  function handleSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!searchOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const route = results[activeIndex];
      if (route) navigateTo(route);
    } else if (e.key === "Escape") {
      setSearchOpen(false);
    }
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  function openNotification(n: TopbarNotification) {
    setNotifications((cur) => cur.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
    if (n.href) {
      setNotifOpen(false);
      router.push(n.href);
    }
  }

  function markAllNotificationsRead() {
    if (unreadCount === 0) return;
    setNotifications((cur) => cur.map((n) => ({ ...n, unread: false })));
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await api.post("/api/auth/logout", {});
      setLogoutConfirmOpen(false);
      router.push("/login");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not log out", "error");
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] h-14 flex items-center justify-between px-5">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#1E293B]">{pageTitle}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Global search */}
        <div className="hidden md:block relative" ref={searchRef}>
          <div className="flex items-center gap-2 bg-[#F1F5F9] rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(e.target.value.trim().length > 0);
                setActiveIndex(0);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setSearchOpen(true);
              }}
              onKeyDown={handleSearchKey}
              placeholder="Search..."
              aria-label="Search dashboard pages"
              className="bg-transparent text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] outline-none w-44"
            />
          </div>
          {searchOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-card border border-[#E2E8F0] py-1 z-50 max-h-[360px] overflow-y-auto">
              {groupedResults.length === 0 ? (
                <p className="px-3 py-4 text-[13px] text-[#94A3B8] text-center">
                  No pages match &ldquo;{searchQuery.trim()}&rdquo;
                </p>
              ) : (
                groupedResults.map((group) => (
                  <div key={group.section}>
                    <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
                      {group.section}
                    </p>
                    {group.items.map(({ route, index }) => (
                      <button
                        key={route.href}
                        onClick={() => navigateTo(route)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`w-full text-left px-3 py-2 text-[13px] transition-colors ${
                          index === activeIndex
                            ? "bg-[#EFF6FF] text-[#3B82F6]"
                            : "text-[#475569] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        {route.label}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 rounded-full text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-card border border-[#E2E8F0] py-1 z-50">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#E2E8F0]">
                <p className="text-sm font-medium text-[#1E293B]">Notifications</p>
                <button
                  onClick={markAllNotificationsRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1 text-[12px] font-medium text-[#3B82F6] hover:underline disabled:text-[#94A3B8] disabled:no-underline"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => openNotification(n)}
                    className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-b-0"
                  >
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                        n.unread ? "bg-[#3B82F6]" : "bg-transparent"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[13px] leading-snug truncate ${
                          n.unread ? "font-semibold text-[#1E293B]" : "text-[#475569]"
                        }`}
                      >
                        {n.title}
                      </span>
                      <span className="block text-[11px] text-[#94A3B8] mt-0.5">{n.time}</span>
                    </span>
                  </button>
                ))}
                {notifications.length === 0 && (
                  <p className="px-3 py-6 text-center text-[12px] text-[#94A3B8]">You&apos;re all caught up.</p>
                )}
              </div>
              <div className="px-3 py-2 border-t border-[#E2E8F0]">
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    router.push("/dashboard/notifications");
                  }}
                  className="w-full text-center text-[12px] font-medium text-[#3B82F6] hover:underline"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center">
              <span className="text-white text-xs font-semibold">JD</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card border border-[#E2E8F0] py-1 z-50">
              <div className="px-3 py-2 border-b border-[#E2E8F0]">
                <p className="text-sm font-medium text-[#1E293B]">John Doe</p>
                <p className="text-xs text-[#94A3B8]">john@example.com</p>
              </div>
              <a
                href="/dashboard/settings"
                className="block px-3 py-2 text-sm text-[#475569] hover:bg-[#F8FAFC] transition-colors"
              >
                Settings
              </a>
              <button
                onClick={() => {
                  setUserDropdownOpen(false);
                  setLogoutConfirmOpen(true);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-[#F8FAFC] transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout confirm */}
      <ConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Log out"
        message="Are you sure you want to log out of your FulfillMesh account?"
        confirmLabel="Log out"
        destructive
        loading={loggingOut}
      />
    </header>
  );
}
