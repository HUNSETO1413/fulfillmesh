// Client-side helpers for talking to the REST API from dashboard components and
// for exporting table data to CSV.

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
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
