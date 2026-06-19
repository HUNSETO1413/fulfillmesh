"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Clock,
  Globe,
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Warehouse,
  Truck,
  Plug,
  Info,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";

type ProbeKey = "web" | "auth" | "orders" | "analytics";
type Health = "operational" | "degraded" | "down";

type ProbeResult = {
  health: Health;
  latency: number | null;
};

const PROBE_ENDPOINTS: Record<ProbeKey, string> = {
  web: "/sitemap.xml",
  auth: "/api/auth/me",
  orders: "/api/orders",
  analytics: "/api/analytics",
};

const services: { name: string; icon: typeof Globe; probe: ProbeKey }[] = [
  { name: "Website", icon: Globe, probe: "web" },
  { name: "Customer Dashboard", icon: LayoutDashboard, probe: "auth" },
  { name: "Order Management", icon: ShoppingCart, probe: "orders" },
  { name: "Inventory Management", icon: Boxes, probe: "orders" },
  { name: "Warehousing", icon: Warehouse, probe: "analytics" },
  { name: "Shipping", icon: Truck, probe: "orders" },
  { name: "Integrations (API)", icon: Plug, probe: "auth" },
];

// A 401 on an auth-gated probe (e.g. /api/auth/me, /api/orders) still proves the
// API tier is reachable and responding — so treat it as "up" for status purposes.
const REACHABLE_STATUSES = new Set([200, 201, 204, 301, 302, 304, 400, 401, 403, 404]);

const REFRESH_INTERVAL_MS = 60_000;
const PROBE_TIMEOUT_MS = 8_000;

async function probe(url: string): Promise<ProbeResult> {
  const start =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "*/*" },
    });
    const now =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    const latency = Math.max(0, Math.round(now - start));

    if (REACHABLE_STATUSES.has(res.status)) {
      // Up, but flag slow responses as degraded.
      return { health: latency > 2_500 ? "degraded" : "operational", latency };
    }
    // 5xx (and any other unexpected status) means the service is failing.
    return { health: "down", latency };
  } catch {
    // Network error, abort/timeout, or CORS failure — never throw.
    return { health: "down", latency: null };
  } finally {
    clearTimeout(timer);
  }
}

function healthMeta(health: Health): { label: string; bg: string; text: string } {
  switch (health) {
    case "operational":
      return { label: "Operational", bg: "#10B981", text: "#fff" };
    case "degraded":
      return { label: "Degraded", bg: "#F59E0B", text: "#fff" };
    case "down":
      return { label: "Down", bg: "#EF4444", text: "#fff" };
  }
}

function Sparkline({ health }: { health: Health }) {
  const heights = [
    78, 92, 70, 96, 84, 100, 76, 90, 82, 98, 72, 94, 86, 100, 74, 88, 80, 96,
    70, 92, 84, 100, 76, 90,
  ];
  const color =
    health === "down" ? "#EF4444" : health === "degraded" ? "#F59E0B" : "#00B894";
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 20 }}>
      {heights.map((h, i) => (
        <span
          key={i}
          style={{ width: 2, height: `${h}%`, borderRadius: 1, background: color, display: "block" }}
        />
      ))}
    </div>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export default function StatusBoard() {
  const [results, setResults] = useState<Record<ProbeKey, ProbeResult> | null>(
    null,
  );
  const [checking, setChecking] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  const runChecks = useCallback(async () => {
    if (mountedRef.current) setChecking(true);
    const keys = Object.keys(PROBE_ENDPOINTS) as ProbeKey[];
    const settled = await Promise.all(
      keys.map(async (key) => [key, await probe(PROBE_ENDPOINTS[key])] as const),
    );
    if (!mountedRef.current) return;
    const next = settled.reduce(
      (acc, [key, result]) => {
        acc[key] = result;
        return acc;
      },
      {} as Record<ProbeKey, ProbeResult>,
    );
    setResults(next);
    setLastUpdated(new Date());
    setChecking(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void runChecks();
    const interval = setInterval(() => {
      void runChecks();
    }, REFRESH_INTERVAL_MS);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [runChecks]);

  const serviceHealth = (probeKey: ProbeKey): Health =>
    results ? results[probeKey].health : "operational";

  const probedHealths = results
    ? services.map((s) => serviceHealth(s.probe))
    : [];
  const anyDown = probedHealths.some((h) => h === "down");
  const anyDegraded = probedHealths.some((h) => h === "degraded");

  const overall: Health = anyDown
    ? "down"
    : anyDegraded
      ? "degraded"
      : "operational";

  const banner =
    !results
      ? {
          border: "#BFDBFE",
          bg: "#EFF6FF",
          dot: "#2563EB",
          title: "#1D4ED8",
          title_text: "Checking system status…",
          body: "Running live health checks on FulfillMesh services.",
        }
      : overall === "operational"
        ? {
            border: "#10B981",
            bg: "#ECFDF5",
            dot: "#10B981",
            title: "#059669",
            title_text: "All Systems Operational",
            body: "Everything is functioning as expected. No active incidents.",
          }
        : overall === "degraded"
          ? {
              border: "#F59E0B",
              bg: "#FFFBEB",
              dot: "#F59E0B",
              title: "#B45309",
              title_text: "Degraded Performance",
              body: "Some services are responding slowly. We're keeping an eye on it.",
            }
          : {
              border: "#EF4444",
              bg: "#FEF2F2",
              dot: "#EF4444",
              title: "#B91C1C",
              title_text: "Service Disruption Detected",
              body: "One or more services are currently unreachable.",
            };

  return (
    <>
      {/* Last updated + refresh */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-text-light">
        <span className="inline-flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          Last updated: {lastUpdated ? formatTime(lastUpdated) : "checking…"}
        </span>
        {checking && (
          <span className="inline-flex items-center gap-1.5 text-action-blue">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> checking…
          </span>
        )}
        <button
          type="button"
          onClick={() => void runChecks()}
          disabled={checking}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#D1D5DB] bg-white px-2.5 py-1 font-medium text-[#374151] transition-colors hover:border-action-blue hover:text-action-blue disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Overall banner */}
      <div
        className="mt-10 flex items-center gap-4 rounded-lg border px-5 py-4"
        style={{ borderColor: banner.border, background: banner.bg }}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-white"
          style={{ background: banner.dot }}
        >
          {!results ? (
            <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
          ) : overall === "operational" ? (
            <Check className="w-5 h-5" strokeWidth={3} />
          ) : (
            <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
          )}
        </span>
        <div>
          <p className="text-lg font-semibold" style={{ color: banner.title }}>
            {banner.title_text}
          </p>
          <p className="text-sm text-[#6B7280]">{banner.body}</p>
        </div>
      </div>

      {/* System Status */}
      <h2 className="mt-10 text-xl font-semibold text-[#1A202C]">System Status</h2>
      <div className="mt-4 rounded-lg border border-[#E5E7EB] overflow-hidden">
        {services.map((s, i) => {
          const health = serviceHealth(s.probe);
          const meta = healthMeta(health);
          const result = results?.[s.probe];
          return (
            <div
              key={s.name}
              className={`flex items-center gap-3 px-5 py-3.5 ${
                i > 0 ? "border-t border-[#E5E7EB]" : ""
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded bg-[#EFF6FF] text-action-blue">
                <s.icon className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-medium text-[#374151]">{s.name}</span>
              <Info className="w-3.5 h-3.5 text-[#9CA3AF] ml-0.5" />
              {result?.latency != null && (
                <span className="text-[11px] tabular-nums text-text-light">
                  {result.latency}ms
                </span>
              )}
              <span className="ml-auto">
                {checking && !results ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-medium text-action-blue">
                    <Loader2 className="w-3 h-3 animate-spin" /> Checking…
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: meta.bg, color: meta.text }}
                  >
                    {meta.label}
                  </span>
                )}
              </span>
              <Sparkline health={health} />
            </div>
          );
        })}
      </div>
    </>
  );
}
