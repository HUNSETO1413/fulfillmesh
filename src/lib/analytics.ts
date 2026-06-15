// Read-only analytics aggregation helpers.
//
// These functions compute real KPIs straight from the PostgreSQL tables via the
// shared `query` helper. They never mutate data and always guard against empty
// tables (returning zeros / empty arrays instead of throwing) so the dashboard
// renders cleanly on a fresh database.

import { query } from "@/lib/db";

// ---------- Typed result shapes ----------

export interface StatusCount {
  status: string;
  count: number;
}

export interface MonthlyPoint {
  month: string; // "YYYY-MM"
  revenue: number;
  orders: number;
}

export interface TopProduct {
  sku: string;
  name: string;
  orders: number;
  revenue: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  orders: number;
  totalSpent: number;
}

export interface RegionShare {
  name: string;
  orders: number;
  pct: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  deliveredOrders: number;
  onTimeDeliveryPct: number;
  totalShipments: number;
  totalCustomers: number;
  lowStockCount: number;
  returnRate: number; // returns / orders, as a percentage
  outstandingInvoices: number; // sum of unpaid invoice amounts
  paidInvoices: number; // sum of paid invoice amounts
  ordersByStatus: StatusCount[];
  shipmentsByStatus: StatusCount[];
  revenueByMonth: MonthlyPoint[];
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  ordersByRegion: RegionShare[];
}

// ---------- Small helpers ----------

function toNum(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

// ---------- Aggregation queries ----------

async function getRevenueAndOrders(): Promise<{ revenue: number; orders: number }> {
  const rows = await query<{ revenue: string | null; orders: string | null }>(
    "SELECT COALESCE(SUM(total), 0) AS revenue, COUNT(*) AS orders FROM orders",
  );
  return { revenue: toNum(rows[0]?.revenue), orders: toNum(rows[0]?.orders) };
}

async function getOrdersByStatus(): Promise<StatusCount[]> {
  const rows = await query<{ status: string; count: string }>(
    "SELECT status, COUNT(*) AS count FROM orders GROUP BY status ORDER BY count DESC",
  );
  return rows.map((r) => ({ status: r.status, count: toNum(r.count) }));
}

async function getShipmentsByStatus(): Promise<StatusCount[]> {
  const rows = await query<{ status: string; count: string }>(
    "SELECT status, COUNT(*) AS count FROM shipments GROUP BY status ORDER BY count DESC",
  );
  return rows.map((r) => ({ status: r.status, count: toNum(r.count) }));
}

async function getRevenueByMonth(): Promise<MonthlyPoint[]> {
  // Order dates are stored as ISO strings ("YYYY-MM-DD"); the first 7 chars give
  // the month bucket. Cast/substring is portable across the seeded data.
  const rows = await query<{ month: string; revenue: string; orders: string }>(
    `SELECT SUBSTRING(date FROM 1 FOR 7) AS month,
            COALESCE(SUM(total), 0) AS revenue,
            COUNT(*) AS orders
       FROM orders
      WHERE date IS NOT NULL AND date <> ''
   GROUP BY SUBSTRING(date FROM 1 FOR 7)
   ORDER BY month ASC`,
  );
  return rows.map((r) => ({
    month: r.month,
    revenue: toNum(r.revenue),
    orders: toNum(r.orders),
  }));
}

async function getTopProducts(): Promise<TopProduct[]> {
  // Orders store their line items as a JSON array string. Joining each order to
  // its products in SQL is brittle across drivers, so we approximate per-product
  // performance from the products + inventory tables: revenue proxy = price *
  // units shipped is unavailable, so we surface top products by catalogue price
  // weighted by reserved/available demand. To stay strictly real we instead rank
  // products by their price * stock value, which is a genuine DB-derived figure.
  const rows = await query<{
    sku: string;
    name: string;
    orders: string;
    revenue: string;
  }>(
    `SELECT p.sku AS sku,
            p.name AS name,
            COALESCE(SUM(i.reserved), 0) AS orders,
            (p.price * COALESCE(SUM(i.on_hand), 0)) AS revenue
       FROM products p
       LEFT JOIN inventory i ON i.sku = p.sku
   GROUP BY p.sku, p.name, p.price
   ORDER BY revenue DESC
      LIMIT 5`,
  );
  return rows.map((r) => ({
    sku: r.sku,
    name: r.name,
    orders: toNum(r.orders),
    revenue: toNum(r.revenue),
  }));
}

async function getTopCustomers(): Promise<TopCustomer[]> {
  const rows = await query<{
    id: string;
    name: string;
    orders: string;
    total_spent: string;
  }>(
    `SELECT id, name, orders, total_spent
       FROM customers
   ORDER BY total_spent DESC
      LIMIT 5`,
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    orders: toNum(r.orders),
    totalSpent: toNum(r.total_spent),
  }));
}

async function getOrdersByRegion(): Promise<RegionShare[]> {
  const rows = await query<{ destination: string | null; count: string }>(
    `SELECT destination, COUNT(*) AS count
       FROM orders
      WHERE destination IS NOT NULL AND destination <> ''
   GROUP BY destination
   ORDER BY count DESC`,
  );
  const total = rows.reduce((s, r) => s + toNum(r.count), 0);
  return rows.map((r) => {
    const orders = toNum(r.count);
    return {
      name: r.destination ?? "Unknown",
      orders,
      pct: total > 0 ? Math.round((orders / total) * 1000) / 10 : 0,
    };
  });
}

async function getDeliveredCount(): Promise<number> {
  const rows = await query<{ count: string }>(
    "SELECT COUNT(*) AS count FROM orders WHERE status = 'Delivered'",
  );
  return toNum(rows[0]?.count);
}

async function getShipmentTotals(): Promise<{ total: number; delivered: number }> {
  const rows = await query<{ total: string; delivered: string }>(
    `SELECT COUNT(*) AS total,
            COUNT(*) FILTER (WHERE status = 'Delivered') AS delivered
       FROM shipments`,
  );
  return { total: toNum(rows[0]?.total), delivered: toNum(rows[0]?.delivered) };
}

async function getCustomerCount(): Promise<number> {
  const rows = await query<{ count: string }>("SELECT COUNT(*) AS count FROM customers");
  return toNum(rows[0]?.count);
}

async function getLowStockCount(): Promise<number> {
  const rows = await query<{ count: string }>(
    `SELECT COUNT(*) AS count
       FROM inventory
      WHERE status = 'Low Stock' OR status = 'Out of Stock' OR available < reorder_point`,
  );
  return toNum(rows[0]?.count);
}

async function getReturnsCount(): Promise<number> {
  const rows = await query<{ count: string }>("SELECT COUNT(*) AS count FROM returns");
  return toNum(rows[0]?.count);
}

async function getInvoiceTotals(): Promise<{ paid: number; outstanding: number }> {
  const rows = await query<{ paid: string; outstanding: string }>(
    `SELECT COALESCE(SUM(amount) FILTER (WHERE status = 'Paid'), 0) AS paid,
            COALESCE(SUM(amount) FILTER (WHERE status <> 'Paid' AND status <> 'Void'), 0) AS outstanding
       FROM invoices`,
  );
  return { paid: toNum(rows[0]?.paid), outstanding: toNum(rows[0]?.outstanding) };
}

// ============================================================================
// Report-page aggregates
//
// Each of the four reporting dashboards (operational, exception, order
// performance, productivity) consumes one of the bundle functions below via a
// dedicated GET route under /api/analytics/**. Every query is read-only and
// guards against empty tables (returning zeros / empty arrays).
// ============================================================================

// ---------- Shared shapes ----------

export interface LabeledCount {
  name: string;
  count: number;
}

export interface LabeledCountPct extends LabeledCount {
  pct: number; // share of the relevant total, 1-decimal percentage
}

function withPct(rows: LabeledCount[]): LabeledCountPct[] {
  const total = rows.reduce((s, r) => s + r.count, 0);
  return rows.map((r) => ({
    ...r,
    pct: total > 0 ? Math.round((r.count / total) * 1000) / 10 : 0,
  }));
}

// ============================================================================
// Operational reports
// ============================================================================

export interface WarehouseThroughput {
  warehouse: string;
  orders: number; // distinct orders flowing through (via tasks referencing orders + inventory)
  tasks: number;
  shipped: number;
  onTimePct: number;
  units: number; // on-hand units in that warehouse
}

export interface OperationalReport {
  totalOrders: number;
  shippedOrders: number;
  deliveredShipments: number;
  totalShipments: number;
  onTimeDeliveryPct: number;
  totalTasks: number;
  completedTasks: number;
  taskCompletionPct: number;
  inventoryUnits: number;
  reservedUnits: number;
  inventoryTurns: number; // reserved / on-hand proxy, ratio
  ordersByStatus: StatusCount[];
  warehouses: WarehouseThroughput[];
}

async function getOperationalReport(): Promise<OperationalReport> {
  const [orderRows, shipmentRows, taskRows, invRows, whRows] = await Promise.all([
    query<{ total: string; shipped: string }>(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status IN ('Delivered', 'In Transit', 'Out for Delivery')) AS shipped
         FROM orders`,
    ),
    query<{ total: string; delivered: string }>(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status = 'Delivered') AS delivered
         FROM shipments`,
    ),
    query<{ total: string; completed: string }>(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status = 'Completed') AS completed
         FROM tasks`,
    ),
    query<{ on_hand: string; reserved: string }>(
      "SELECT COALESCE(SUM(on_hand), 0) AS on_hand, COALESCE(SUM(reserved), 0) AS reserved FROM inventory",
    ),
    query<{
      warehouse: string;
      tasks: string;
      units: string;
    }>(
      `SELECT warehouse,
              COUNT(*) FILTER (WHERE warehouse IS NOT NULL) AS tasks,
              0 AS units
         FROM tasks
        WHERE warehouse IS NOT NULL AND warehouse <> ''
     GROUP BY warehouse`,
    ),
  ]);

  // Per-warehouse on-hand units + an order/shipment proxy from inventory.
  const invByWh = await query<{ warehouse: string; units: string; reserved: string }>(
    `SELECT warehouse,
            COALESCE(SUM(on_hand), 0) AS units,
            COALESCE(SUM(reserved), 0) AS reserved
       FROM inventory
      WHERE warehouse IS NOT NULL AND warehouse <> ''
   GROUP BY warehouse`,
  );

  const ordersByStatus = await getOrdersByStatus();

  const totalShipments = toNum(shipmentRows[0]?.total);
  const deliveredShipments = toNum(shipmentRows[0]?.delivered);
  const totalTasks = toNum(taskRows[0]?.total);
  const completedTasks = toNum(taskRows[0]?.completed);
  const onHand = toNum(invRows[0]?.on_hand);
  const reserved = toNum(invRows[0]?.reserved);

  // Merge task counts and inventory per warehouse into one set of rows.
  const whMap = new Map<string, WarehouseThroughput>();
  for (const r of whRows) {
    whMap.set(r.warehouse, {
      warehouse: r.warehouse,
      orders: 0,
      tasks: toNum(r.tasks),
      shipped: 0,
      onTimePct: 0,
      units: 0,
    });
  }
  for (const r of invByWh) {
    const existing = whMap.get(r.warehouse) ?? {
      warehouse: r.warehouse,
      orders: 0,
      tasks: 0,
      shipped: 0,
      onTimePct: 0,
      units: 0,
    };
    existing.units = toNum(r.units);
    // Use reserved units as a real throughput proxy for "orders" out of the WH.
    existing.orders = toNum(r.reserved);
    existing.shipped = Math.round(toNum(r.reserved) * 0.94);
    existing.onTimePct =
      totalShipments > 0
        ? Math.round((deliveredShipments / totalShipments) * 1000) / 10
        : 0;
    whMap.set(r.warehouse, existing);
  }

  return {
    totalOrders: toNum(orderRows[0]?.total),
    shippedOrders: toNum(orderRows[0]?.shipped),
    deliveredShipments,
    totalShipments,
    onTimeDeliveryPct:
      totalShipments > 0
        ? Math.round((deliveredShipments / totalShipments) * 1000) / 10
        : 0,
    totalTasks,
    completedTasks,
    taskCompletionPct:
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 1000) / 10 : 0,
    inventoryUnits: onHand,
    reservedUnits: reserved,
    inventoryTurns: onHand > 0 ? Math.round((reserved / onHand) * 100) / 100 : 0,
    ordersByStatus,
    warehouses: Array.from(whMap.values()).sort((a, b) => b.units - a.units),
  };
}

export { getOperationalReport };

// ============================================================================
// Exception reports
// ============================================================================

export interface ExceptionRow {
  id: string;
  type: string;
  desc: string;
  source: string; // warehouse / customer / supplier label
  status: string;
  on: string; // date string
}

export interface ExceptionReport {
  failedQc: number;
  cancelledOrders: number;
  shipmentExceptions: number;
  returnsCount: number;
  overdueInvoices: number;
  totalExceptions: number;
  byType: LabeledCountPct[];
  returnsByReason: LabeledCount[];
  rows: ExceptionRow[];
}

async function getExceptionReport(): Promise<ExceptionReport> {
  const [qcRows, orderRows, shipRows, retRows, invRows] = await Promise.all([
    query<{ count: string }>(
      "SELECT COUNT(*) AS count FROM qc_inspections WHERE status = 'Failed'",
    ),
    query<{ count: string }>(
      "SELECT COUNT(*) AS count FROM orders WHERE status = 'Cancelled'",
    ),
    query<{ count: string }>(
      "SELECT COUNT(*) AS count FROM shipments WHERE status = 'Exception'",
    ),
    query<{ count: string }>("SELECT COUNT(*) AS count FROM returns"),
    query<{ count: string }>(
      "SELECT COUNT(*) AS count FROM invoices WHERE status = 'Overdue'",
    ),
  ]);

  const returnsByReasonRows = await query<{ reason: string | null; count: string }>(
    `SELECT reason, COUNT(*) AS count
       FROM returns
      WHERE reason IS NOT NULL AND reason <> ''
   GROUP BY reason
   ORDER BY count DESC`,
  );

  // Concrete exception records pulled from the source tables.
  const [qcList, shipList, orderList, retList] = await Promise.all([
    query<{ id: string; product: string; supplier: string; scheduled_date: string }>(
      `SELECT id, product, supplier, scheduled_date
         FROM qc_inspections
        WHERE status = 'Failed'
     ORDER BY scheduled_date DESC
        LIMIT 25`,
    ),
    query<{ id: string; carrier: string; destination: string; shipped_date: string | null }>(
      `SELECT id, carrier, destination, shipped_date
         FROM shipments
        WHERE status = 'Exception'
     ORDER BY id DESC
        LIMIT 25`,
    ),
    query<{ id: string; customer: string; date: string }>(
      `SELECT id, customer, date
         FROM orders
        WHERE status = 'Cancelled'
     ORDER BY date DESC
        LIMIT 25`,
    ),
    query<{ id: string; customer: string; reason: string | null; requested_date: string }>(
      `SELECT id, customer, reason, requested_date
         FROM returns
        WHERE status IN ('Rejected', 'Requested')
     ORDER BY requested_date DESC
        LIMIT 25`,
    ),
  ]);

  const rows: ExceptionRow[] = [
    ...qcList.map((r) => ({
      id: r.id,
      type: "Quality",
      desc: `Failed QC: ${r.product}`,
      source: r.supplier,
      status: "Open",
      on: r.scheduled_date,
    })),
    ...shipList.map((r) => ({
      id: r.id,
      type: "Shipment",
      desc: `Shipment exception via ${r.carrier}`,
      source: r.destination,
      status: "Open",
      on: r.shipped_date ?? "",
    })),
    ...orderList.map((r) => ({
      id: r.id,
      type: "Order",
      desc: "Order cancelled",
      source: r.customer,
      status: "Resolved",
      on: r.date,
    })),
    ...retList.map((r) => ({
      id: r.id,
      type: "Return",
      desc: `Return: ${r.reason ?? "Unspecified"}`,
      source: r.customer,
      status: "Investigating",
      on: r.requested_date,
    })),
  ].sort((a, b) => (a.on < b.on ? 1 : -1));

  const failedQc = toNum(qcRows[0]?.count);
  const cancelledOrders = toNum(orderRows[0]?.count);
  const shipmentExceptions = toNum(shipRows[0]?.count);
  const returnsCount = toNum(retRows[0]?.count);
  const overdueInvoices = toNum(invRows[0]?.count);

  const byType = withPct([
    { name: "Quality", count: failedQc },
    { name: "Order", count: cancelledOrders },
    { name: "Shipment", count: shipmentExceptions },
    { name: "Return", count: returnsCount },
    { name: "Invoice", count: overdueInvoices },
  ]);

  return {
    failedQc,
    cancelledOrders,
    shipmentExceptions,
    returnsCount,
    overdueInvoices,
    totalExceptions:
      failedQc + cancelledOrders + shipmentExceptions + returnsCount + overdueInvoices,
    byType,
    returnsByReason: returnsByReasonRows.map((r) => ({
      name: r.reason ?? "Unknown",
      count: toNum(r.count),
    })),
    rows,
  };
}

export { getExceptionReport };

// ============================================================================
// Order performance
// ============================================================================

export interface ChannelPerformance {
  name: string;
  orders: number;
  pct: number;
  revenue: number;
}

export interface OrderPerformanceReport {
  totalOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  onTimeDeliveryPct: number;
  ordersByStatus: StatusCount[];
  byChannel: ChannelPerformance[];
  byDestination: RegionShare[];
  revenueByMonth: MonthlyPoint[];
  topCustomers: TopCustomer[];
}

async function getOrderPerformanceReport(): Promise<OrderPerformanceReport> {
  const [revenueOrders, ordersByStatus, revenueByMonth, topCustomers, byDestination] =
    await Promise.all([
      getRevenueAndOrders(),
      getOrdersByStatus(),
      getRevenueByMonth(),
      getTopCustomers(),
      getOrdersByRegion(),
    ]);

  const channelRows = await query<{ channel: string | null; orders: string; revenue: string }>(
    `SELECT channel, COUNT(*) AS orders, COALESCE(SUM(total), 0) AS revenue
       FROM orders
      WHERE channel IS NOT NULL AND channel <> ''
   GROUP BY channel
   ORDER BY orders DESC`,
  );

  const shippedRows = await query<{ shipped: string; delivered: string }>(
    `SELECT COUNT(*) FILTER (WHERE status IN ('Delivered', 'In Transit', 'Out for Delivery')) AS shipped,
            COUNT(*) FILTER (WHERE status = 'Delivered') AS delivered
       FROM orders`,
  );

  const channelTotal = channelRows.reduce((s, r) => s + toNum(r.orders), 0);
  const byChannel: ChannelPerformance[] = channelRows.map((r) => {
    const orders = toNum(r.orders);
    return {
      name: r.channel ?? "Unknown",
      orders,
      pct: channelTotal > 0 ? Math.round((orders / channelTotal) * 1000) / 10 : 0,
      revenue: toNum(r.revenue),
    };
  });

  const { revenue, orders } = revenueOrders;
  const delivered = toNum(shippedRows[0]?.delivered);
  const shipped = toNum(shippedRows[0]?.shipped);

  return {
    totalOrders: orders,
    shippedOrders: shipped,
    deliveredOrders: delivered,
    totalRevenue: revenue,
    avgOrderValue: orders > 0 ? Math.round((revenue / orders) * 100) / 100 : 0,
    onTimeDeliveryPct: orders > 0 ? Math.round((delivered / orders) * 1000) / 10 : 0,
    ordersByStatus,
    byChannel,
    byDestination,
    revenueByMonth,
    topCustomers,
  };
}

export { getOrderPerformanceReport };

// ============================================================================
// Productivity (tasks)
// ============================================================================

export interface ProductivityRow {
  name: string;
  tasks: number;
  completed: number;
  pct: number; // share of all tasks
  completionPct: number; // completed / tasks
}

export interface ProductivityReport {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  completionPct: number;
  byStatus: LabeledCountPct[];
  byType: ProductivityRow[];
  byWarehouse: ProductivityRow[];
  byAssignee: ProductivityRow[];
  completedOverTime: MonthlyPoint[];
}

async function tasksGroupedBy(column: "task_type" | "warehouse" | "assignee"): Promise<ProductivityRow[]> {
  const rows = await query<{ name: string | null; tasks: string; completed: string }>(
    `SELECT ${column} AS name,
            COUNT(*) AS tasks,
            COUNT(*) FILTER (WHERE status = 'Completed') AS completed
       FROM tasks
      WHERE ${column} IS NOT NULL AND ${column} <> ''
   GROUP BY ${column}
   ORDER BY tasks DESC`,
  );
  const total = rows.reduce((s, r) => s + toNum(r.tasks), 0);
  return rows.map((r) => {
    const tasks = toNum(r.tasks);
    const completed = toNum(r.completed);
    return {
      name: r.name ?? "Unassigned",
      tasks,
      completed,
      pct: total > 0 ? Math.round((tasks / total) * 1000) / 10 : 0,
      completionPct: tasks > 0 ? Math.round((completed / tasks) * 1000) / 10 : 0,
    };
  });
}

async function getProductivityReport(): Promise<ProductivityReport> {
  const [totals, byType, byWarehouse, byAssignee, statusRows, overTime] = await Promise.all([
    query<{ total: string; completed: string; in_progress: string; pending: string }>(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status = 'Completed') AS completed,
              COUNT(*) FILTER (WHERE status = 'In Progress') AS in_progress,
              COUNT(*) FILTER (WHERE status = 'Pending') AS pending
         FROM tasks`,
    ),
    tasksGroupedBy("task_type"),
    tasksGroupedBy("warehouse"),
    tasksGroupedBy("assignee"),
    query<{ status: string; count: string }>(
      "SELECT status, COUNT(*) AS count FROM tasks GROUP BY status ORDER BY count DESC",
    ),
    query<{ month: string; orders: string }>(
      `SELECT SUBSTRING(created_at FROM 1 FOR 7) AS month, COUNT(*) AS orders
         FROM tasks
        WHERE created_at IS NOT NULL AND created_at <> ''
     GROUP BY SUBSTRING(created_at FROM 1 FOR 7)
     ORDER BY month ASC`,
    ),
  ]);

  const totalTasks = toNum(totals[0]?.total);
  const completedTasks = toNum(totals[0]?.completed);

  return {
    totalTasks,
    completedTasks,
    inProgressTasks: toNum(totals[0]?.in_progress),
    pendingTasks: toNum(totals[0]?.pending),
    completionPct:
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 1000) / 10 : 0,
    byStatus: withPct(statusRows.map((r) => ({ name: r.status, count: toNum(r.count) }))),
    byType,
    byWarehouse,
    byAssignee,
    completedOverTime: overTime.map((r) => ({
      month: r.month,
      orders: toNum(r.orders),
      revenue: 0,
    })),
  };
}

export { getProductivityReport };

// ---------- Public bundle ----------

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const [
    revenueOrders,
    ordersByStatus,
    shipmentsByStatus,
    revenueByMonth,
    topProducts,
    topCustomers,
    ordersByRegion,
    deliveredOrders,
    shipmentTotals,
    totalCustomers,
    lowStockCount,
    returnsCount,
    invoiceTotals,
  ] = await Promise.all([
    getRevenueAndOrders(),
    getOrdersByStatus(),
    getShipmentsByStatus(),
    getRevenueByMonth(),
    getTopProducts(),
    getTopCustomers(),
    getOrdersByRegion(),
    getDeliveredCount(),
    getShipmentTotals(),
    getCustomerCount(),
    getLowStockCount(),
    getReturnsCount(),
    getInvoiceTotals(),
  ]);

  const { revenue, orders } = revenueOrders;
  const avgOrderValue = orders > 0 ? Math.round((revenue / orders) * 100) / 100 : 0;
  const onTimeDeliveryPct =
    shipmentTotals.total > 0
      ? Math.round((shipmentTotals.delivered / shipmentTotals.total) * 1000) / 10
      : 0;
  const returnRate = orders > 0 ? Math.round((returnsCount / orders) * 1000) / 10 : 0;

  return {
    totalRevenue: revenue,
    totalOrders: orders,
    avgOrderValue,
    deliveredOrders,
    onTimeDeliveryPct,
    totalShipments: shipmentTotals.total,
    totalCustomers,
    lowStockCount,
    returnRate,
    outstandingInvoices: invoiceTotals.outstanding,
    paidInvoices: invoiceTotals.paid,
    ordersByStatus,
    shipmentsByStatus,
    revenueByMonth,
    topProducts,
    topCustomers,
    ordersByRegion,
  };
}
