"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

// A handful of segments need bespoke labels that simple title-casing can't reach.
const LABEL_OVERRIDES: Record<string, string> = {
  qc: "QC",
  api: "API",
  "qc-inspections": "QC Inspections",
  "api-keys": "API Keys",
  "users-roles": "Users & Roles",
  "system-settings": "System Settings",
  "order-performance": "Order Performance",
  "exception-reports": "Exception Reports",
  "operational-reports": "Operational Reports",
  "cycle-count": "Cycle Count",
};

// Humanize a URL segment: "warehouse-operations" -> "Warehouse Operations".
// IDs like "ORD-10458" are kept as-is so detail crumbs stay recognizable.
function humanize(segment: string): string {
  const decoded = decodeURIComponent(segment);
  const override = LABEL_OVERRIDES[decoded.toLowerCase()];
  if (override) return override;
  // Looks like an identifier (contains digits) — show it verbatim.
  if (/\d/.test(decoded)) return decoded;
  return decoded
    .split("-")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

interface Crumb {
  label: string;
  href: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  // Build a cumulative trail. Each crumb links to its own absolute path.
  const crumbs: Crumb[] = segments.map((segment, index) => ({
    label: humanize(segment),
    href: "/" + segments.slice(0, index + 1).join("/"),
  }));

  // Nothing meaningful to show on the dashboard root (just "Dashboard").
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px]">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
              )}
              {isLast ? (
                <span className="font-medium text-slate-700" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
