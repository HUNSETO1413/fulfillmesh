"use client";

import { useEffect, useState } from "react";
import { Calendar, CalendarClock, ChevronDown } from "lucide-react";

export const DATE_RANGE_PRESETS = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "May 1 – May 31, 2025",
  "This quarter",
  "Year to date",
] as const;

/**
 * A real, switchable date-range dropdown. Pass the current value and an
 * onSelect handler; the page owns the selected-range state.
 */
export function DateRangeMenu({
  value,
  onSelect,
  presets = DATE_RANGE_PRESETS as unknown as string[],
  icon = "calendar",
  className = "",
}: {
  value: string;
  onSelect: (range: string) => void;
  presets?: string[];
  icon?: "calendar" | "clock";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const Icon = icon === "clock" ? CalendarClock : Calendar;

  useEffect(() => {
    if (!open) return;
    if (typeof document === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0 hover:bg-[#F8FAFC] transition-colors ${className}`}
      >
        <Icon className="w-4 h-4 text-[#64748B]" />
        {value}
        <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            role="menu"
            aria-label="Date range"
            className="absolute right-0 mt-1 z-40 w-56 bg-white rounded-lg border border-[#E2E8F0] shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-1"
          >
            <p className="px-3 py-1.5 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Date range</p>
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                role="menuitemradio"
                aria-checked={value === p}
                onClick={() => {
                  onSelect(p);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-[13px] hover:bg-[#F8FAFC] transition-colors ${
                  value === p ? "text-[#3B82F6] font-medium" : "text-[#374151]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DateRangeMenu;
