// Client-side helpers for talking to the REST API from dashboard components and
// for exporting table data to CSV.

// The auth probe is expected to 401 for logged-out visitors; callers handle it
// themselves, so we must NOT bounce the browser to /login for this endpoint.
const AUTH_PROBE_URL = "/api/auth/me";

// Requests that hang longer than this are aborted so the UI never spins forever
// on a stalled connection. Callers surface the thrown error via their catch.
const REQUEST_TIMEOUT_MS = 20000;

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err instanceof Error ? err : new Error("Network request failed");
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    // Global 401 handling: an expired/missing session should bounce the user to
    // the login page instead of surfacing a raw error to the UI. The auth probe
    // is exempt so logged-out callers can detect "no user" gracefully.
    if (res.status === 401 && typeof window !== "undefined" && url !== AUTH_PROBE_URL) {
      window.location.assign("/login");
    }
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(url: string) => request<T>("GET", url),
  post: <T>(url: string, body: unknown) => request<T>("POST", url, body),
  put: <T>(url: string, body: unknown) => request<T>("PUT", url, body),
  del: <T>(url: string) => request<T>("DELETE", url),
};

// ---- file downloads ----
function downloadBlob(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function exportToJson(filename: string, data: unknown): void {
  downloadBlob(
    filename.endsWith(".json") ? filename : `${filename}.json`,
    JSON.stringify(data, null, 2),
    "application/json;charset=utf-8;",
  );
}

// ---- CSV export ----
function escapeCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportToCsv<T>(
  filename: string,
  rows: T[],
  columns: { key: keyof T; header: string }[],
): void {
  const head = columns.map((c) => escapeCell(c.header)).join(",");
  const body = rows
    .map((r) => columns.map((c) => escapeCell((r as Record<string, unknown>)[c.key as string])).join(","))
    .join("\n");
  downloadBlob(
    filename.endsWith(".csv") ? filename : `${filename}.csv`,
    `${head}\n${body}`,
    "text/csv;charset=utf-8;",
  );
}
