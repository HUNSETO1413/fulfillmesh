"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  RotateCcw,
  Box,
  FileText,
  Building2,
  Contact,
  ShieldCheck,
  Warehouse,
  BarChart3,
  ClipboardList,
  CheckSquare,
  ArrowRightLeft,
  ScanLine,
  TrendingUp,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  FolderOpen,
  Bell,
  CreditCard,
  FileBarChart,
  Settings,
  UserCog,
  Server,
  Link2,
  Shield,
  Key,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Flat navigation list matching the design's dark sidebar.
// Items listed in the same order as shown across all dashboard mockups.
const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Shipments", href: "/dashboard/shipments", icon: Truck },
  { label: "Inventory", href: "/dashboard/inventory", icon: Warehouse },
  { label: "Products", href: "/dashboard/products", icon: Box },
  { label: "Quotes", href: "/dashboard/quotes", icon: FileText },
  { label: "Suppliers", href: "/dashboard/suppliers", icon: Building2 },
  { label: "QC Inspections", href: "/dashboard/qc-inspections", icon: ShieldCheck },
  { label: "Returns", href: "/dashboard/returns", icon: RotateCcw },
  { label: "Customers", href: "/dashboard/customers", icon: Contact },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Reports", href: "/dashboard/reports", icon: PieChart },
  { label: "Productivity", href: "/dashboard/productivity", icon: Target },
  { label: "Order Performance", href: "/dashboard/order-performance", icon: TrendingUp },
  { label: "Exception Reports", href: "/dashboard/exception-reports", icon: AlertTriangle },
  { label: "Warehouse Operations", href: "/dashboard/warehouse/operations", icon: ClipboardList },
  { label: "Outbound", href: "/dashboard/warehouse/outbound", icon: CheckSquare },
  { label: "Transfers", href: "/dashboard/warehouse/transfers", icon: ArrowRightLeft },
  { label: "Cycle Count", href: "/dashboard/warehouse/cycle-count", icon: ScanLine },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckCircle },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Invoices & Payments", href: "/dashboard/invoices", icon: CreditCard },
  { label: "Operational Reports", href: "/dashboard/operational-reports", icon: FileBarChart },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Users & Roles", href: "/dashboard/users-roles", icon: UserCog },
  { label: "System Settings", href: "/dashboard/system-settings", icon: Server },
  { label: "Integrations", href: "/dashboard/integrations", icon: Link2 },
  { label: "Audit Logs", href: "/dashboard/audit-logs", icon: Shield },
  { label: "API Keys", href: "/dashboard/api-keys", icon: Key },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-[60px] shrink-0">
        <div className="w-8 h-8 rounded-lg gradient-logo flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xs">FM</span>
        </div>
        {!collapsed && (
          <span className="text-[17px] font-semibold whitespace-nowrap tracking-tight">
            <span className="text-white">Fulfill</span><span className="text-teal">Mesh</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2 space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-l-lg rounded-r-lg text-[13px] font-medium transition-colors duration-150
                ${
                  active
                    ? "bg-[#334155] text-[#60A5FA] border-l-[3px] border-l-[#3B82F6]"
                    : "text-[#CBD5E1] hover:bg-white/[0.08] hover:text-white border-l-[3px] border-l-transparent"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[#60A5FA]" : "text-[#94A3B8]"}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User profile + collapse toggle */}
      <div className="shrink-0 p-3">
        <div className={`flex items-center gap-2.5 px-2 py-2 rounded-lg ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-semibold">AD</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-white truncate">FulfillMesh Co.</p>
              <p className="text-[11px] text-[#94A3B8] truncate">Admin</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center w-full py-1.5 mt-1 rounded-lg text-[#94A3B8] hover:bg-white/[0.08] hover:text-white transition-colors duration-150"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col fixed top-0 left-0 h-full bg-[#1E293B] z-30
          transition-all duration-300
          ${collapsed ? "w-[72px]" : "w-60"}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          {/* Sidebar */}
          <aside className="relative w-60 h-full bg-[#1E293B] z-50 flex flex-col">
            {/* Close button */}
            <button
              onClick={onMobileClose}
              className="absolute top-3 right-3 text-[#94A3B8] hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
