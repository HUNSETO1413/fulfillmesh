"use client";

// Right-side detail drawer used by dashboard list pages to show the full data
// of a row (all fields, status badge, timestamps and contextual actions).
// Mirrors the visual language of Modal.tsx.

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

const FOCUSABLE_SELECTOR =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
  );
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({ open, onClose, title, subtitle, children, footer }: DrawerProps) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    if (typeof document === "undefined") return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (dialog) {
      const focusables = getFocusable(dialog);
      (focusables[0] ?? dialog).focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialog) {
        const focusables = getFocusable(dialog);
        if (focusables.length === 0) {
          e.preventDefault();
          dialog.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === first || active === dialog || !dialog.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/40 animate-[fadeIn_0.12s_ease-out]" onClick={onClose} />
      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="absolute right-0 top-0 h-full w-full max-w-[460px] bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.18)] animate-[fadeIn_0.15s_ease-out] flex flex-col focus:outline-none"
      >
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-[#E5E7EB]">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A] truncate">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[13px] text-[#6B7280]">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
        <div className="flex-1 px-6 py-5 overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
}

/** A single label/value line inside a drawer body. */
export function DrawerRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#F3F4F6] last:border-b-0">
      <span className="shrink-0 mt-0.5 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-[0.05em]">{label}</span>
      <span className="text-[13px] text-[#1A1A1A] text-right min-w-0">{children}</span>
    </div>
  );
}

/** Section heading inside a drawer body. */
export function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-[0.05em] mb-2">{title}</h3>
      {children}
    </div>
  );
}

export default Drawer;
