import type { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./password";

// Idempotent seed. Runs once on first DB access (guarded by a global flag) and
// only inserts when a table is empty, so it is safe to call repeatedly.

const CUSTOMERS = [
  "Acme Retail", "Summit Goods", "Peak Supplies", "Blue Ridge Co.",
  "Northwind Traders", "Urban Outfitters", "Coastal Brands", "Vertex Commerce",
];
const COUNTRIES = ["United States", "Germany", "United Kingdom", "Canada", "Australia", "France"];
const ORDER_STATUSES = ["Delivered", "In Transit", "Processing", "Delivered", "Cancelled", "Pending"];

function count(db: DatabaseSync, table: string): number {
  const row = db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get<{ c: number }>();
  return row?.c ?? 0;
}

export function ensureSeed(db: DatabaseSync): void {
  seedUsers(db);
  seedOrders(db);
  seedProducts(db);
  seedInventory(db);
  seedCustomers(db);
  seedSuppliers(db);
  seedShipments(db);
  seedReturns(db);
  seedQuotes(db);
  seedInvoices(db);
  seedQc(db);
  seedApiKeys(db);
}

function seedUsers(db: DatabaseSync) {
  if (count(db, "users") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO users (id, name, email, role, status, password_hash, last_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const users = [
    ["USR-001", "Admin User", "admin@fulfillmesh.com", "Admin", "Active", "2025-05-16"],
    ["USR-002", "Sarah Chen", "sarah@fulfillmesh.com", "Manager", "Active", "2025-05-15"],
    ["USR-003", "Miguel Santos", "miguel@fulfillmesh.com", "Operator", "Active", "2025-05-14"],
    ["USR-004", "Priya Nair", "priya@fulfillmesh.com", "Viewer", "Invited", null],
  ];
  // Demo credentials: admin@fulfillmesh.com / demo1234
  const pw = hashPassword("demo1234");
  for (const [id, name, email, role, status, last] of users) {
    stmt.run(id, name, email, role, status, pw, last);
  }
}

function seedOrders(db: DatabaseSync) {
  if (count(db, "orders") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO orders (id, customer, customer_id, status, date, total, channel, destination, items, tracking_number)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (let i = 0; i < 28; i++) {
    const n = 10458 - i;
    const customer = CUSTOMERS[i % CUSTOMERS.length];
    const status = ORDER_STATUSES[i % ORDER_STATUSES.length];
    const total = Math.round((500 + ((i * 733) % 5000)) * 100) / 100;
    const items = JSON.stringify([
      { sku: `SKU-${1000 + i}`, name: "Wireless Earbuds Pro", quantity: 1 + (i % 4), unitPrice: 49.99 },
      { sku: `SKU-${2000 + i}`, name: "USB-C Charging Cable", quantity: 2 + (i % 3), unitPrice: 12.5 },
    ]);
    const date = `2025-05-${String(16 - (i % 16)).padStart(2, "0")}`;
    stmt.run(`ORD-${n}`, customer, `CUS-${(i % 8) + 1}`, status, date, total,
      ["Shopify", "Amazon", "Direct", "TikTok Shop"][i % 4],
      COUNTRIES[i % COUNTRIES.length], items, `1Z${900000 + i}`);
  }
}

function seedProducts(db: DatabaseSync) {
  if (count(db, "products") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO products (id, sku, name, category, price, cost, stock, status, supplier)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const names = [
    ["Wireless Earbuds Pro", "Electronics"], ["USB-C Charging Cable", "Accessories"],
    ["Smart Water Bottle", "Lifestyle"], ["Bamboo Cutting Board", "Home"],
    ["Yoga Mat Premium", "Fitness"], ["LED Desk Lamp", "Home"],
    ["Travel Backpack 30L", "Outdoor"], ["Ceramic Coffee Mug", "Home"],
    ["Bluetooth Speaker Mini", "Electronics"], ["Stainless Steel Straw Set", "Lifestyle"],
    ["Memory Foam Pillow", "Home"], ["Resistance Band Kit", "Fitness"],
  ];
  for (let i = 0; i < names.length; i++) {
    const [name, category] = names[i];
    const stock = (i * 137) % 500;
    const status = stock === 0 ? "Out of Stock" : stock < 50 ? "Low Stock" : "In Stock";
    const price = Math.round((9.99 + i * 7.3) * 100) / 100;
    stmt.run(`PRD-${100 + i}`, `SKU-${1000 + i}`, name, category, price,
      Math.round(price * 0.45 * 100) / 100, stock, status, CUSTOMERS[i % CUSTOMERS.length] + " Mfg");
  }
}

function seedInventory(db: DatabaseSync) {
  if (count(db, "inventory") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO inventory (id, sku, name, warehouse, location, on_hand, reserved, available, reorder_point, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const warehouses = ["Shenzhen DC", "Yiwu Hub", "LA Fulfillment", "Rotterdam EU"];
  const names = ["Wireless Earbuds Pro", "USB-C Charging Cable", "Smart Water Bottle",
    "Bamboo Cutting Board", "Yoga Mat Premium", "LED Desk Lamp", "Travel Backpack 30L", "Ceramic Coffee Mug"];
  for (let i = 0; i < 16; i++) {
    const onHand = (i * 211) % 800;
    const reserved = Math.min(onHand, (i * 37) % 120);
    const available = onHand - reserved;
    const reorder = 80;
    const status = available === 0 ? "Out of Stock" : available < reorder ? "Low Stock" : "In Stock";
    stmt.run(`INV-${200 + i}`, `SKU-${1000 + (i % names.length)}`, names[i % names.length],
      warehouses[i % warehouses.length], `A-${(i % 12) + 1}-${(i % 6) + 1}`,
      onHand, reserved, available, reorder, status);
  }
}

function seedCustomers(db: DatabaseSync) {
  if (count(db, "customers") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO customers (id, name, email, company, phone, country, orders, total_spent, status, joined_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (let i = 0; i < CUSTOMERS.length; i++) {
    const name = CUSTOMERS[i];
    const orders = 3 + ((i * 11) % 40);
    stmt.run(`CUS-${i + 1}`, name, `ops@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
      name, `+1 555 0${100 + i}`, COUNTRIES[i % COUNTRIES.length], orders,
      Math.round(orders * (820 + i * 60) * 100) / 100, i % 7 === 0 ? "Lead" : "Active",
      `2024-${String((i % 12) + 1).padStart(2, "0")}-12`);
  }
}

function seedSuppliers(db: DatabaseSync) {
  if (count(db, "suppliers") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO suppliers (id, name, contact, email, country, category, rating, status, lead_time_days, products_supplied)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const sup = [
    ["Shenzhen ElecTech", "Electronics"], ["Yiwu Lifestyle Goods", "Lifestyle"],
    ["Guangzhou Home Co.", "Home"], ["Ningbo Outdoor Gear", "Outdoor"],
    ["Dongguan Fitness Mfg", "Fitness"], ["Hangzhou Accessories", "Accessories"],
  ];
  for (let i = 0; i < sup.length; i++) {
    const [name, category] = sup[i];
    stmt.run(`SUP-${300 + i}`, name, `Contact ${i + 1}`, `sales@${name.toLowerCase().replace(/[^a-z]/g, "")}.cn`,
      "China", category, Math.round((3.8 + (i % 12) * 0.1) * 10) / 10,
      i % 5 === 0 ? "Pending" : "Active", 7 + (i % 4) * 3, 4 + (i * 3) % 20);
  }
}

function seedShipments(db: DatabaseSync) {
  if (count(db, "shipments") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO shipments (id, order_id, carrier, tracking_number, origin, destination, status, shipped_date, estimated_delivery, weight)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const carriers = ["DHL Express", "FedEx", "UPS", "SF Express"];
  const statuses = ["In Transit", "Customs", "Out for Delivery", "Delivered", "Awaiting Pickup", "Exception"];
  for (let i = 0; i < 20; i++) {
    stmt.run(`SHP-${400 + i}`, `ORD-${10458 - i}`, carriers[i % carriers.length],
      `1Z${900000 + i}`, "Shenzhen, CN", COUNTRIES[i % COUNTRIES.length],
      statuses[i % statuses.length], `2025-05-${String(10 + (i % 6)).padStart(2, "0")}`,
      `2025-05-${String(18 + (i % 8)).padStart(2, "0")}`, `${(i % 9) + 1}.${i % 10} kg`);
  }
}

function seedReturns(db: DatabaseSync) {
  if (count(db, "returns") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO returns (id, order_id, customer, reason, status, requested_date, items, refund_amount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const reasons = ["Damaged on arrival", "Wrong item", "No longer needed", "Defective", "Size issue"];
  const statuses = ["Requested", "Approved", "In Transit", "Received", "Refunded", "Rejected"];
  for (let i = 0; i < 14; i++) {
    stmt.run(`RET-${500 + i}`, `ORD-${10458 - i}`, CUSTOMERS[i % CUSTOMERS.length],
      reasons[i % reasons.length], statuses[i % statuses.length],
      `2025-05-${String(8 + (i % 8)).padStart(2, "0")}`, 1 + (i % 3),
      Math.round((50 + i * 30) * 100) / 100);
  }
}

function seedQuotes(db: DatabaseSync) {
  if (count(db, "quotes") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO quotes (id, customer, customer_id, status, created_date, valid_until, total, items)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const statuses = ["Draft", "Sent", "Accepted", "Declined", "Expired"];
  for (let i = 0; i < 12; i++) {
    stmt.run(`QUO-${600 + i}`, CUSTOMERS[i % CUSTOMERS.length], `CUS-${(i % 8) + 1}`,
      statuses[i % statuses.length], `2025-05-${String(5 + (i % 10)).padStart(2, "0")}`,
      `2025-06-${String(5 + (i % 10)).padStart(2, "0")}`,
      Math.round((1200 + i * 540) * 100) / 100,
      JSON.stringify([{ sku: `SKU-${1000 + i}`, name: "Bulk order", quantity: 100 + i * 10, unitPrice: 8.5 }]));
  }
}

function seedInvoices(db: DatabaseSync) {
  if (count(db, "invoices") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO invoices (id, customer, order_id, status, issued_date, due_date, amount)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const statuses = ["Paid", "Sent", "Overdue", "Draft", "Paid"];
  for (let i = 0; i < 16; i++) {
    stmt.run(`INV-${700 + i}`, CUSTOMERS[i % CUSTOMERS.length], `ORD-${10458 - i}`,
      statuses[i % statuses.length], `2025-05-${String(1 + (i % 14)).padStart(2, "0")}`,
      `2025-05-${String(15 + (i % 14)).padStart(2, "0")}`, Math.round((900 + i * 410) * 100) / 100);
  }
}

function seedQc(db: DatabaseSync) {
  if (count(db, "qc_inspections") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO qc_inspections (id, product, sku, supplier, inspector, status, scheduled_date, defect_rate, sample_size)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const products = ["Wireless Earbuds Pro", "Smart Water Bottle", "Yoga Mat Premium", "LED Desk Lamp", "Travel Backpack 30L"];
  const statuses = ["Scheduled", "In Progress", "Passed", "Failed", "On Hold"];
  for (let i = 0; i < 12; i++) {
    stmt.run(`QC-${800 + i}`, products[i % products.length], `SKU-${1000 + i}`,
      "Shenzhen ElecTech", `Inspector ${i % 4 + 1}`, statuses[i % statuses.length],
      `2025-05-${String(12 + (i % 10)).padStart(2, "0")}`,
      Math.round((i % 8) * 0.7 * 100) / 100, 50 + (i % 4) * 25);
  }
}

function seedApiKeys(db: DatabaseSync) {
  if (count(db, "api_keys") > 0) return;
  const stmt = db.prepare(
    `INSERT INTO api_keys (id, name, prefix, scopes, created_at, last_used, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  stmt.run("KEY-001", "Production API Key", "fm_live_8a2f", "orders:read,orders:write,inventory:read",
    "2025-04-01", "2025-05-16", "Active");
  stmt.run("KEY-002", "Staging API Key", "fm_test_4c9d", "orders:read,inventory:read",
    "2025-04-10", "2025-05-12", "Active");
}
