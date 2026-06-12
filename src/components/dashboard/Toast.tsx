"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {} };
  return ctx;
}

const STYLES: Record<ToastType, { icon: typeof CheckCircle2; ring: string; text: string }> = {
  success: { icon: CheckCircle2, ring: "border-l-[#10B981]", text: "text-[#10B981]" },
  error: { icon: AlertCircle, ring: "border-l-[#EF4444]", text: "text-[#EF4444]" },
  info: { icon: Info, ring: "border-l-[#3B82F6]", text: "text-[#3B82F6]" },
};

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++counter;
      setToasts((t) => [...t, { id, type, message }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[320px] pointer-events-none">
        {toasts.map((t) => {
          const s = STYLES[t.type];
          const Icon = s.icon;
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 bg-white rounded-lg border border-[#E5E7EB] border-l-4 ${s.ring} shadow-[0_4px_12px_rgba(0,0,0,0.12)] px-4 py-3 animate-[fadeIn_0.15s_ease-out]`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${s.text}`} />
              <p className="flex-1 text-[13px] text-[#374151] leading-snug">{t.message}</p>
              <button onClick={() => remove(t.id)} className="text-[#9CA3AF] hover:text-[#374151]">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
