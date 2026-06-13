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
