import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Copy,
  Zap,
  Search,
  MessageCircle,
  HelpCircle,
  Layers,
  Filter,
  Clock,
} from "lucide-react";

const noteIcons = [Layers, Filter, Clock];

const sidebarGroups = [
  {
    label: "Getting Started",
    items: [
      { label: "Introduction" },
      { label: "Authentication", dot: true },
      { label: "Rate Limits" },
      { label: "Errors" },
      { label: "Changelog" },
    ],
  },
  {
    label: "API Reference",
    items: [
      {
        label: "Orders",
        expanded: true,
        children: [
          { label: "List Orders", active: true },
          { label: "Create Order" },
          { label: "Retrieve Order" },
          { label: "Update Order" },
          { label: "Cancel Order" },
        ],
      },
      { label: "Shipments" },
      { label: "Warehouses" },
      { label: "Inventory" },
      { label: "Returns" },
      { label: "Webhooks" },
    ],
  },
];

const queryParams = [
  { name: "status", type: "string", required: "No", desc: "Filter by order status. Supported: pending, confirmed, in_progress, completed, cancelled." },
  { name: "created_after", type: "string (date)", required: "No", desc: "Return orders created after this date (ISO 8601)." },
  { name: "created_before", type: "string (date)", required: "No", desc: "Return orders created before this date (ISO 8601)." },
  { name: "page", type: "integer", required: "No", desc: "Page number (default: 1)." },
  { name: "page_size", type: "integer", required: "No", desc: "Results per page (default: 20, max: 100)." },
];

const methodColors: Record<string, string> = {
  GET: "bg-teal text-white",
  POST: "bg-action-blue text-white",
};

const exampleRequest = `GET /v1/orders?status=pending&page=1&page_size=20 HTTP/1.1
Authorization: Bearer YOUR_API_KEY`;

const exampleResponse = `{
  "data": [
    {
      "id": "ord_9x8k2hf3aizhqC1",
      "order_number": "FM10042851",
      "status": "pending",
      "customer": {
        "id": "cus_4x9d2",
        "name": "Acme Corp"
      },
      "total_amount": 129.99,
      "currency": "USD",
      "created_at": "2025-05-28T14:32:00Z"
    }
  ],
  "meta": {
    "total": 142,
    "page": 1,
    "page_size": 20
  }
}`;

const createRequestBody = `{
  "order_number": "PO580245",
  "customer": {
    "name": "Acme Corp",
    "email": "orders@acmecorp.com"
  },
  "items": [
    {
      "sku": "TSHIRT-BLK-M",
      "quantity": 2
    }
  ]
}`;

const createResponse = `{
  "id": "ord_3kd9a2nf8s1z",
  "order_number": "PO580245",
  "status": "pending",
  "total_amount": 129.99,
  "currency": "USD",
  "created_at": "2025-05-28T14:32:00Z",
  "items": [
    {
      "sku": "TSHIRT-BLK-M",
      "quantity": 2,
      "unit_price": 64.99
    }
  ]
}`;

const statusCodes = [
  { code: "200", color: "bg-teal/10 text-teal", meaning: "OK", desc: "Request was successful." },
  { code: "201", color: "bg-teal/10 text-teal", meaning: "Created", desc: "The resource was successfully created." },
  { code: "400", color: "bg-amber-500/10 text-amber-600", meaning: "Bad Request", desc: "The request was invalid or cannot be served." },
  { code: "401", color: "bg-red-500/10 text-red-600", meaning: "Unauthorized", desc: "Authentication failed or user does not have permissions." },
  { code: "404", color: "bg-red-500/10 text-red-600", meaning: "Not Found", desc: "The specified resource was not found." },
  { code: "429", color: "bg-red-500/10 text-red-600", meaning: "Too Many Requests", desc: "Rate limit exceeded. Please try again later." },
  { code: "500", color: "bg-red-500/10 text-red-600", meaning: "Internal Server Error", desc: "An unexpected error occurred on the server." },
];

const apiNotes = [
  { title: "Pagination", desc: "Use page and page_size to paginate through large result sets." },
  { title: "Filtering", desc: "Combine filters to narrow down results. Date filters use ISO 8601 format." },
  { title: "Time Zone", desc: "All timestamps are returned in UTC (ISO 8601)." },
];

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="bg-deep-navy px-5 py-4 overflow-x-auto">
      <pre className="text-xs font-mono leading-relaxed text-text-on-dark-soft">
        {code.split("\n").map((line, i) => (
          <div key={i} className="flex">
            <span className="inline-block w-6 text-right mr-4 text-text-on-dark-muted/50 select-none">{i + 1}</span>
            <span className="whitespace-pre">{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

export default function ApiDocumentationPage() {
  return (
    <main>
      {/* Breadcrumb bar */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-xs text-text-muted flex-wrap">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/resources" className="hover:text-navy transition-colors">Resources</Link>
          <ChevronRight className="w-3 h-3" />
          <span>API Reference</span>
          <ChevronRight className="w-3 h-3" />
          <span>Orders</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary font-medium">List Orders</span>
        </div>
      </section>

      {/* Three-column docs layout */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex gap-8">

          {/* ───── Left Sidebar ───── */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-6">
              {/* Title + version */}
              <div className="flex items-center gap-2 mb-4">
                <p className="text-base font-bold text-deep-navy">API Documentation</p>
                <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">v1.0</span>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-soft bg-white mb-6">
                <Search className="w-4 h-4 text-text-light" />
                <input placeholder="Search docs..." className="w-full bg-transparent text-sm text-text-body placeholder:text-text-light focus:outline-none" />
              </div>

              {/* Navigation */}
              <nav className="space-y-5">
                {sidebarGroups.map((group, gi) => (
                  <div key={gi}>
                    <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">{group.label}</p>
                    <ul className="space-y-0.5">
                      {group.items.map((item, i) => (
                        <li key={i}>
                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg cursor-pointer ${
                              "children" in item
                                ? "text-text-primary font-semibold"
                                : "text-text-body hover:bg-soft-bg hover:text-text-primary transition-colors"
                            }`}
                          >
                            {"children" in item && <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
                            <span>{item.label}</span>
                            {"dot" in item && item.dot && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal" />}
                          </div>
                          {"children" in item && item.children && (
                            <ul className="mt-0.5 ml-5 space-y-0.5 border-l-2 border-border-soft pl-3">
                              {item.children.map((c, ci) => (
                                <li key={ci}>
                                  <span
                                    className={`block px-2 py-1 text-sm rounded-md cursor-pointer ${
                                      c.active
                                        ? "bg-action-blue/8 text-action-blue font-medium"
                                        : "text-text-body hover:text-text-primary hover:bg-soft-bg transition-colors"
                                    }`}
                                  >
                                    {c.label}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* Need help card */}
              <div className="mt-8 p-4 rounded-2xl bg-soft-bg border border-border-soft">
                <HelpCircle className="w-5 h-5 text-teal mb-2" />
                <p className="text-sm font-semibold text-text-primary mb-1">Need help?</p>
                <p className="text-xs text-text-muted leading-relaxed mb-3">Visit our Help Center or contact our support team.</p>
                <Link href="/resources/help-center" className="text-xs font-semibold text-action-blue inline-flex items-center gap-1 hover:underline">
                  Visit Help Center <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ───── Main Content ───── */}
          <main className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-[28px] font-bold text-deep-navy tracking-tight">Orders API</h1>
              <span className="text-[10px] font-bold text-teal bg-teal/10 px-2.5 py-0.5 rounded-full">v1.0</span>
              <div className="ml-auto">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all">
                  <Zap className="w-4 h-4" /> Try it out
                </button>
              </div>
            </div>
            <p className="text-sm text-text-body leading-relaxed mb-10">
              The Orders API allows you to create, retrieve, update, and manage orders across the FulfillMesh platform.
            </p>

            {/* ════════════ List Orders endpoint ════════════ */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md ${methodColors.GET}`}>GET</span>
                <code className="text-sm font-mono text-text-primary">/v1/orders</code>
                <span className="text-sm font-semibold text-deep-navy">List Orders</span>
                <span className="ml-auto text-xs text-text-light">Read operation</span>
              </div>
              <p className="text-sm text-text-body mb-6">Returns a paginated list of orders based on the provided filters.</p>

              {/* Request URL */}
              <h3 className="text-sm font-bold text-deep-navy mb-2">Request URL</h3>
              <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border-soft bg-soft-bg mb-8">
                <code className="text-sm font-mono text-text-primary">https://api.fulfillmesh.com/v1/orders</code>
                <Copy className="w-4 h-4 text-text-muted cursor-pointer hover:text-text-primary transition-colors" />
              </div>

              {/* Query Parameters table */}
              <h3 className="text-sm font-bold text-deep-navy mb-3">Query Parameters</h3>
              <div className="rounded-xl border border-border-soft overflow-hidden mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-soft-bg border-b border-border-soft">
                      <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">Parameter</th>
                      <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">Required</th>
                      <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryParams.map((p, i) => (
                      <tr key={i} className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-medium text-action-blue">{p.name}</td>
                        <td className="px-4 py-3 text-xs text-text-muted">{p.type}</td>
                        <td className="px-4 py-3 text-xs text-text-muted">{p.required}</td>
                        <td className="px-4 py-3 text-xs text-text-body leading-relaxed">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Example Request */}
              <h3 className="text-sm font-bold text-deep-navy mb-2">Example Request</h3>
              <div className="rounded-xl border border-border-soft overflow-hidden mb-8">
                <div className="flex items-center justify-between border-b border-border-soft bg-soft-bg px-4 py-2.5">
                  <span className="text-xs font-medium text-text-muted">cURL</span>
                  <Copy className="w-4 h-4 text-text-muted cursor-pointer hover:text-text-primary transition-colors" />
                </div>
                <CodeBlock code={exampleRequest} />
              </div>

              {/* Example Response */}
              <h3 className="text-sm font-bold text-deep-navy mb-2">Example Response</h3>
              <div className="rounded-xl border border-border-soft overflow-hidden">
                <div className="flex items-center justify-between border-b border-border-soft bg-soft-bg px-4 py-2.5">
                  <span className="text-xs font-bold text-teal bg-teal/10 px-2 py-0.5 rounded">200 OK</span>
                  <Copy className="w-4 h-4 text-text-muted cursor-pointer hover:text-text-primary transition-colors" />
                </div>
                <CodeBlock code={exampleResponse} />
              </div>
            </section>

            {/* ════════════ Create Order endpoint ════════════ */}
            <section className="border-t border-border-soft pt-10">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md ${methodColors.POST}`}>POST</span>
                <code className="text-sm font-mono text-text-primary">/v1/orders</code>
                <span className="text-sm font-semibold text-deep-navy">Create Order</span>
                <span className="ml-auto text-xs text-text-light">Create operation</span>
              </div>
              <p className="text-sm text-text-body mb-6">Creates a new order in the FulfillMesh system.</p>

              {/* Request Body + Example Response side by side */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-deep-navy">Request Body</h3>
                    <span className="text-[10px] font-medium text-text-muted bg-soft-bg px-2 py-0.5 rounded">application/json</span>
                  </div>
                  <div className="rounded-xl border border-border-soft overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border-soft bg-soft-bg px-4 py-2.5">
                      <span className="text-xs font-medium text-text-muted">Example Request</span>
                      <Copy className="w-4 h-4 text-text-muted cursor-pointer hover:text-text-primary transition-colors" />
                    </div>
                    <CodeBlock code={createRequestBody} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-deep-navy mb-2">Example Response</h3>
                  <div className="rounded-xl border border-border-soft overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border-soft bg-soft-bg px-4 py-2.5">
                      <span className="text-xs font-bold text-teal bg-teal/10 px-2 py-0.5 rounded">201 Created</span>
                      <Copy className="w-4 h-4 text-text-muted cursor-pointer hover:text-text-primary transition-colors" />
                    </div>
                    <CodeBlock code={createResponse} />
                  </div>
                </div>
              </div>

              {/* Status Codes + Notes side by side */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-deep-navy mb-3">Status Codes</h3>
                  <div className="rounded-xl border border-border-soft overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-soft-bg border-b border-border-soft">
                          <th className="text-left px-4 py-2.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Code</th>
                          <th className="text-left px-4 py-2.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Meaning</th>
                          <th className="text-left px-4 py-2.5 font-semibold text-text-muted text-xs uppercase tracking-wide">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statusCodes.map((s, i) => (
                          <tr key={i} className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                            <td className="px-4 py-2.5">
                              <span className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded ${s.color}`}>{s.code}</span>
                            </td>
                            <td className="px-4 py-2.5 text-xs font-medium text-text-primary">{s.meaning}</td>
                            <td className="px-4 py-2.5 text-xs text-text-body leading-relaxed">{s.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-deep-navy mb-3">Notes</h3>
                  <div className="space-y-4">
                    {apiNotes.map((n, i) => {
                      const Icon = noteIcons[i];
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-soft-bg flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-action-blue" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-deep-navy">{n.title}</p>
                            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{n.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* ───── Right Sidebar ───── */}
          <aside className="hidden xl:block w-52 shrink-0">
            <div className="sticky top-6 space-y-6">
              {/* Quick Stats */}
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Quick Stats</p>
                <div className="space-y-3">
                  <div className="rounded-lg border border-border-soft bg-white p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-wide">API Calls Today</p>
                    <p className="text-[18px] font-bold text-deep-navy mt-0.5">1,284</p>
                  </div>
                  <div className="rounded-lg border border-border-soft bg-white p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-wide">Uptime</p>
                    <p className="text-[18px] font-bold text-teal mt-0.5">99.98%</p>
                  </div>
                  <div className="rounded-lg border border-border-soft bg-white p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-wide">Avg Response Time</p>
                    <p className="text-[18px] font-bold text-deep-navy mt-0.5">142ms</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Recent Activity</p>
                <div className="space-y-2">
                  {[
                    { method: "GET", path: "/v1/orders", status: "200", time: "2 min ago" },
                    { method: "POST", path: "/v1/orders", status: "201", time: "15 min ago" },
                    { method: "GET", path: "/v1/shipments", status: "200", time: "32 min ago" },
                    { method: "GET", path: "/v1/inventory", status: "200", time: "1 hr ago" },
                    { method: "POST", path: "/v1/orders", status: "400", time: "2 hr ago" },
                  ].map((call, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] rounded-lg border border-border-soft bg-white px-3 py-2">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold text-white ${call.method === "GET" ? "bg-teal" : "bg-action-blue"}`}>{call.method}</span>
                      <span className="truncate font-mono text-text-body flex-1">{call.path}</span>
                      <span className={`shrink-0 font-mono font-semibold ${call.status.startsWith("2") ? "text-teal" : "text-red-500"}`}>{call.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* ════════════ CTA ════════════ */}
      <section className="gradient-dark-hero text-white">
        <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">Ready to scale your fulfillment?</h2>
          <p className="mt-3 text-text-on-dark-muted">
            Create your account and start integrating with the FulfillMesh API in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] border border-white/20 hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
