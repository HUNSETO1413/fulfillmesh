import { Pool, type QueryResultRow } from "pg";

// PostgreSQL data layer. A single connection pool is cached on globalThis so
// Next.js dev hot-reload does not open a new pool on every request. Schema
// creation and seeding run once, guarded by a memoized promise.

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Viewer',
  status TEXT NOT NULL DEFAULT 'Active',
  password_hash TEXT NOT NULL,
  last_active TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  customer_id TEXT,
  status TEXT NOT NULL,
  date TEXT NOT NULL,
  total DOUBLE PRECISION NOT NULL DEFAULT 0,
  channel TEXT,
  destination TEXT,
  items TEXT,
  tracking_number TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  price DOUBLE PRECISION NOT NULL DEFAULT 0,
  cost DOUBLE PRECISION,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  supplier TEXT,
  image TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  warehouse TEXT NOT NULL,
  location TEXT,
  on_hand INTEGER NOT NULL DEFAULT 0,
  reserved INTEGER NOT NULL DEFAULT 0,
  available INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  country TEXT,
  orders INTEGER NOT NULL DEFAULT 0,
  total_spent DOUBLE PRECISION NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Active',
  joined_date TEXT
);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  country TEXT NOT NULL,
  category TEXT,
  rating DOUBLE PRECISION NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Active',
  lead_time_days INTEGER,
  products_supplied INTEGER
);

CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  carrier TEXT NOT NULL,
  tracking_number TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL,
  shipped_date TEXT,
  estimated_delivery TEXT,
  weight TEXT
);

CREATE TABLE IF NOT EXISTS returns (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  customer TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL,
  requested_date TEXT NOT NULL,
  items INTEGER NOT NULL DEFAULT 1,
  refund_amount DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  customer_id TEXT,
  status TEXT NOT NULL,
  created_date TEXT NOT NULL,
  valid_until TEXT,
  total DOUBLE PRECISION NOT NULL DEFAULT 0,
  items TEXT
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  order_id TEXT,
  status TEXT NOT NULL,
  issued_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS qc_inspections (
  id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  sku TEXT,
  supplier TEXT NOT NULL,
  inspector TEXT,
  status TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  defect_rate DOUBLE PRECISION,
  sample_size INTEGER
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT,
  payload TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  prefix TEXT NOT NULL,
  scopes TEXT,
  created_at TEXT NOT NULL,
  last_used TEXT,
  status TEXT NOT NULL DEFAULT 'Active'
);
`;

type GlobalWithDb = typeof globalThis & {
  __fulfillmeshPool?: Pool;
  __fulfillmeshReady?: Promise<void>;
};

const globalForDb = globalThis as GlobalWithDb;

export function getPool(): Pool {
  if (!globalForDb.__fulfillmeshPool) {
    globalForDb.__fulfillmeshPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    });
  }
  return globalForDb.__fulfillmeshPool;
}

// Run schema creation + seeding exactly once per process.
function ready(): Promise<void> {
  if (!globalForDb.__fulfillmeshReady) {
    globalForDb.__fulfillmeshReady = (async () => {
      const pool = getPool();
      await pool.query(SCHEMA);
      const { ensureSeed } = await import("./seed");
      await ensureSeed(pool);
    })();
  }
  return globalForDb.__fulfillmeshReady;
}

// Parameterized query helper. Ensures the schema/seed are ready first, then
// runs the statement against the pool. Use $1, $2, ... placeholders.
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  await ready();
  const res = await getPool().query<T>(text, params);
  return res.rows;
}
