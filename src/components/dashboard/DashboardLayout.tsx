"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/orders": "Orders",
  "/dashboard/shipments": "Shipments",
  "/dashboard/returns": "Returns",
  "/dashboard/products": "Products",
  "/dashboard/quotes": "Quotes",
  "/dashboard/suppliers": "Suppliers",
  "/dashboard/qc-inspections": "QC Inspections",
  "/dashboard/inventory": "Inventory",
  "/dashboard/warehouse/operations": "Warehouse Operations",
  "/dashboard/warehouse/outbound": "Outbound",
  "/dashboard/warehouse/transfers": "Transfers",
  "/dashboard/warehouse/cycle-count": "Cycle Count",
  "/dashboard/analytics": "Analytics",
  "/dashboard/reports": "Reports",
  "/dashboard/productivity": "Productivity",
  "/dashboard/order-performance": "Order Performance",
  "/dashboard/exception-reports": "Exception Reports",
  "/dashboard/tasks": "Tasks",
  "/dashboard/messages": "Messages",
  "/dashboard/documents": "Documents",
  "/dashboard/notifications": "Notifications",
  "/dashboard/invoices": "Invoices & Payments",
  "/dashboard/operational-reports": "Operational Reports",
  "/dashboard/settings": "Settings",
  "/dashboard/users-roles": "Users & Roles",
  "/dashboard/system-settings": "System Settings",
  "/dashboard/integrations": "Integrations",
  "/dashboard/audit-logs": "Audit Logs",
  "/dashboard/api-keys": "API Keys",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Exact match first, then longest matching parent (so detail routes like
  // /dashboard/orders/ORD-10458 inherit the parent's title instead of "Dashboard").
  const parentKey = Object.keys(pageTitles)
    .filter((key) => key !== "/dashboard" && pathname.startsWith(key + "/"))
    .sort((a, b) => b.length - a.length)[0];
  const pageTitle = pageTitles[pathname] || (parentKey ? pageTitles[parentKey] : "Dashboard");

  return (
    <div className="flex h-screen bg-soft-bg">
      {/* Sidebar */}
      <DashboardSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "lg:ml-[72px]" : "lg:ml-60"
        }`}
      >
        <DashboardTopbar
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
          pageTitle={pageTitle}
        />
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
