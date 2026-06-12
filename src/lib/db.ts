import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// Singleton SQLite connection backed by the built-in `node:sqlite` module
// (Node 24, zero native dependencies). The connection is cached on globalThis
// so Next.js dev hot-reload does not open a new handle on every request.

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "fulfillmesh.db");

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
  total REAL NOT NULL DEFAULT 0,
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
  price REAL NOT NULL DEFAULT 0,
  cost REAL,
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
  total_spent REAL NOT NULL DEFAULT 0,
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
  rating REAL NOT NULL DEFAULT 0,
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
  refund_amount REAL
);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  customer_id TEXT,
  status TEXT NOT NULL,
  created_date TEXT NOT NULL,
  valid_until TEXT,
  total REAL NOT NULL DEFAULT 0,
  items TEXT
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  order_id TEXT,
  status TEXT NOT NULL,
  issued_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS qc_inspections (
  id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  sku TEXT,
  supplier TEXT NOT NULL,
  inspector TEXT,
  status TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  defect_rate REAL,
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
  __fulfillmeshDb?: DatabaseSync;
  __fulfillmeshSeeded?: boolean;
};

const globalForDb = globalThis as GlobalWithDb;

export function getDb(): DatabaseSync {
  if (!globalForDb.__fulfillmeshDb) {
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
    const db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA journal_mode = WAL;");
    db.exec(SCHEMA);
    globalForDb.__fulfillmeshDb = db;
  }
  // Seed lazily on first access so the app works out of the box.
  if (!globalForDb.__fulfillmeshSeeded) {
    globalForDb.__fulfillmeshSeeded = true;
    // Imported lazily to avoid a circular dependency at module load.
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ensureSeed } = require("./seed") as typeof import("./seed");
      ensureSeed(globalForDb.__fulfillmeshDb);
    } catch {
      // Seeding is best-effort; the app still runs against an empty DB.
    }
  }
  return globalForDb.__fulfillmeshDb;
}
