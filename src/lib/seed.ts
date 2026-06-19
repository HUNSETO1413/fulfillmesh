import type { Pool } from "pg";
import { hashPassword } from "./password";

// Idempotent seed. Runs once after the schema is created and only inserts when a
// table is empty, so it is safe to call repeatedly.

const CUSTOMERS = [
  "Acme Retail", "Summit Goods", "Peak Supplies", "Blue Ridge Co.",
  "Northwind Traders", "Urban Outfitters", "Coastal Brands", "Vertex Commerce",
];
const COUNTRIES = ["United States", "Germany", "United Kingdom", "Canada", "Australia", "France"];
const ORDER_STATUSES = ["Delivered", "In Transit", "Processing", "Delivered", "Cancelled", "Pending"];

async function count(db: Pool, table: string): Promise<number> {
  const res = await db.query<{ c: string }>(`SELECT COUNT(*) AS c FROM ${table}`);
  return Number(res.rows[0]?.c ?? 0);
}

export async function ensureSeed(db: Pool): Promise<void> {
  await seedUsers(db);
  await seedOrders(db);
  await seedProducts(db);
  await seedInventory(db);
  await seedCustomers(db);
  await seedSuppliers(db);
  await seedShipments(db);
  await seedReturns(db);
  await seedQuotes(db);
  await seedInvoices(db);
  await seedQc(db);
  await seedApiKeys(db);
  await seedWarehouses(db);
  await seedStorageTypes(db);
  await seedTransfers(db);
  await seedCycleCounts(db);
  await seedNotifications(db);
  await seedTasks(db);
  await seedLocations(db);
  await seedSettings(db);
  await seedAuditLogs(db);
  await seedDocuments(db);
  await seedMessages(db);
  await seedIntegrations(db);
  await seedInventoryMovements(db);
  await seedQuoteBids(db);
  await backfillSupplierMetrics(db);
  await backfillReturnCosts(db);
  await backfillQcChecklists(db);
}

async function seedUsers(db: Pool) {
  if (await count(db, "users") > 0) return;
  const sql = `INSERT INTO users (id, name, email, role, status, password_hash, last_active) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
  const users: [string, string, string, string, string, string | null][] = [
    ["USR-001", "Admin User", "admin@fulfillmesh.com", "Admin", "Active", "2025-05-16"],
    ["USR-002", "Sarah Chen", "sarah@fulfillmesh.com", "Manager", "Active", "2025-05-15"],
    ["USR-003", "Miguel Santos", "miguel@fulfillmesh.com", "Operator", "Active", "2025-05-14"],
    ["USR-004", "Priya Nair", "priya@fulfillmesh.com", "Viewer", "Invited", null],
  ];
  // Demo credentials: admin@fulfillmesh.com / demo1234
  const pw = hashPassword("demo1234");
  for (const [id, name, email, role, status, last] of users) {
    await db.query(sql, [id, name, email, role, status, pw, last]);
  }
}

async function seedOrders(db: Pool) {
  if (await count(db, "orders") > 0) return;
  const sql = `INSERT INTO orders (id, customer, customer_id, status, date, total, channel, destination, items, tracking_number)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
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
    await db.query(sql, [`ORD-${n}`, customer, `CUS-${(i % 8) + 1}`, status, date, total,
      ["Shopify", "Amazon", "Direct", "TikTok Shop"][i % 4],
      COUNTRIES[i % COUNTRIES.length], items, `1Z${900000 + i}`]);
  }
}

async function seedProducts(db: Pool) {
  if (await count(db, "products") > 0) return;
  const sql = `INSERT INTO products (id, sku, name, category, price, cost, stock, status, supplier)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
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
    await db.query(sql, [`PRD-${100 + i}`, `SKU-${1000 + i}`, name, category, price,
      Math.round(price * 0.45 * 100) / 100, stock, status, CUSTOMERS[i % CUSTOMERS.length] + " Mfg"]);
  }
}

async function seedInventory(db: Pool) {
  if (await count(db, "inventory") > 0) return;
  const sql = `INSERT INTO inventory (id, sku, name, warehouse, location, on_hand, reserved, available, reorder_point, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
  const warehouses = ["Shenzhen DC", "Yiwu Hub", "LA Fulfillment", "Rotterdam EU"];
  const names = ["Wireless Earbuds Pro", "USB-C Charging Cable", "Smart Water Bottle",
    "Bamboo Cutting Board", "Yoga Mat Premium", "LED Desk Lamp", "Travel Backpack 30L", "Ceramic Coffee Mug"];
  for (let i = 0; i < 16; i++) {
    const onHand = (i * 211) % 800;
    const reserved = Math.min(onHand, (i * 37) % 120);
    const available = onHand - reserved;
    const reorder = 80;
    const status = available === 0 ? "Out of Stock" : available < reorder ? "Low Stock" : "In Stock";
    await db.query(sql, [`INV-${200 + i}`, `SKU-${1000 + (i % names.length)}`, names[i % names.length],
      warehouses[i % warehouses.length], `A-${(i % 12) + 1}-${(i % 6) + 1}`,
      onHand, reserved, available, reorder, status]);
  }
}

async function seedCustomers(db: Pool) {
  if (await count(db, "customers") > 0) return;
  const sql = `INSERT INTO customers (id, name, email, company, phone, country, orders, total_spent, status, joined_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
  for (let i = 0; i < CUSTOMERS.length; i++) {
    const name = CUSTOMERS[i];
    const orders = 3 + ((i * 11) % 40);
    await db.query(sql, [`CUS-${i + 1}`, name, `ops@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
      name, `+1 555 0${100 + i}`, COUNTRIES[i % COUNTRIES.length], orders,
      Math.round(orders * (820 + i * 60) * 100) / 100, i % 7 === 0 ? "Lead" : "Active",
      `2024-${String((i % 12) + 1).padStart(2, "0")}-12`]);
  }
}

async function seedSuppliers(db: Pool) {
  if (await count(db, "suppliers") > 0) return;
  const sql = `INSERT INTO suppliers (id, name, contact, email, country, category, rating, status, lead_time_days, products_supplied)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
  const sup = [
    ["Shenzhen ElecTech", "Electronics"], ["Yiwu Lifestyle Goods", "Lifestyle"],
    ["Guangzhou Home Co.", "Home"], ["Ningbo Outdoor Gear", "Outdoor"],
    ["Dongguan Fitness Mfg", "Fitness"], ["Hangzhou Accessories", "Accessories"],
  ];
  for (let i = 0; i < sup.length; i++) {
    const [name, category] = sup[i];
    await db.query(sql, [`SUP-${300 + i}`, name, `Contact ${i + 1}`, `sales@${name.toLowerCase().replace(/[^a-z]/g, "")}.cn`,
      "China", category, Math.round((3.8 + (i % 12) * 0.1) * 10) / 10,
      i % 5 === 0 ? "Pending" : "Active", 7 + (i % 4) * 3, 4 + (i * 3) % 20]);
  }
}

async function seedShipments(db: Pool) {
  if (await count(db, "shipments") > 0) return;
  const sql = `INSERT INTO shipments (id, order_id, carrier, tracking_number, origin, destination, status, shipped_date, estimated_delivery, weight)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
  const carriers = ["DHL Express", "FedEx", "UPS", "SF Express"];
  const statuses = ["In Transit", "Customs", "Out for Delivery", "Delivered", "Awaiting Pickup", "Exception"];
  for (let i = 0; i < 20; i++) {
    await db.query(sql, [`SHP-${400 + i}`, `ORD-${10458 - i}`, carriers[i % carriers.length],
      `1Z${900000 + i}`, "Shenzhen, CN", COUNTRIES[i % COUNTRIES.length],
      statuses[i % statuses.length], `2025-05-${String(10 + (i % 6)).padStart(2, "0")}`,
      `2025-05-${String(18 + (i % 8)).padStart(2, "0")}`, `${(i % 9) + 1}.${i % 10} kg`]);
  }
}

async function seedReturns(db: Pool) {
  if (await count(db, "returns") > 0) return;
  const sql = `INSERT INTO returns (id, order_id, customer, reason, status, requested_date, items, refund_amount)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
  const reasons = ["Damaged on arrival", "Wrong item", "No longer needed", "Defective", "Size issue"];
  const statuses = ["Requested", "Approved", "In Transit", "Received", "Refunded", "Rejected"];
  for (let i = 0; i < 14; i++) {
    await db.query(sql, [`RET-${500 + i}`, `ORD-${10458 - i}`, CUSTOMERS[i % CUSTOMERS.length],
      reasons[i % reasons.length], statuses[i % statuses.length],
      `2025-05-${String(8 + (i % 8)).padStart(2, "0")}`, 1 + (i % 3),
      Math.round((50 + i * 30) * 100) / 100]);
  }
}

async function seedQuotes(db: Pool) {
  if (await count(db, "quotes") > 0) return;
  const sql = `INSERT INTO quotes (id, customer, customer_id, status, created_date, valid_until, total, items)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
  const statuses = ["Draft", "Sent", "Accepted", "Declined", "Expired"];
  for (let i = 0; i < 12; i++) {
    await db.query(sql, [`QUO-${600 + i}`, CUSTOMERS[i % CUSTOMERS.length], `CUS-${(i % 8) + 1}`,
      statuses[i % statuses.length], `2025-05-${String(5 + (i % 10)).padStart(2, "0")}`,
      `2025-06-${String(5 + (i % 10)).padStart(2, "0")}`,
      Math.round((1200 + i * 540) * 100) / 100,
      JSON.stringify([{ sku: `SKU-${1000 + i}`, name: "Bulk order", quantity: 100 + i * 10, unitPrice: 8.5 }])]);
  }
}

async function seedInvoices(db: Pool) {
  if (await count(db, "invoices") > 0) return;
  const sql = `INSERT INTO invoices (id, customer, order_id, status, issued_date, due_date, amount)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`;
  const statuses = ["Paid", "Sent", "Overdue", "Draft", "Paid"];
  for (let i = 0; i < 16; i++) {
    await db.query(sql, [`INV-${700 + i}`, CUSTOMERS[i % CUSTOMERS.length], `ORD-${10458 - i}`,
      statuses[i % statuses.length], `2025-05-${String(1 + (i % 14)).padStart(2, "0")}`,
      `2025-05-${String(15 + (i % 14)).padStart(2, "0")}`, Math.round((900 + i * 410) * 100) / 100]);
  }
}

async function seedQc(db: Pool) {
  if (await count(db, "qc_inspections") > 0) return;
  const sql = `INSERT INTO qc_inspections (id, product, sku, supplier, inspector, status, scheduled_date, defect_rate, sample_size)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
  const products = ["Wireless Earbuds Pro", "Smart Water Bottle", "Yoga Mat Premium", "LED Desk Lamp", "Travel Backpack 30L"];
  const statuses = ["Scheduled", "In Progress", "Passed", "Failed", "On Hold"];
  for (let i = 0; i < 12; i++) {
    await db.query(sql, [`QC-${800 + i}`, products[i % products.length], `SKU-${1000 + i}`,
      "Shenzhen ElecTech", `Inspector ${i % 4 + 1}`, statuses[i % statuses.length],
      `2025-05-${String(12 + (i % 10)).padStart(2, "0")}`,
      Math.round((i % 8) * 0.7 * 100) / 100, 50 + (i % 4) * 25]);
  }
}

async function seedApiKeys(db: Pool) {
  if (await count(db, "api_keys") > 0) return;
  // scopes stored as a JSON array so the repository can JSON.parse() them.
  const sql = `INSERT INTO api_keys (id, name, env, prefix, scopes, created_at, last_used, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
  const rows: [string, string, string, string, string[], string, string | null, string][] = [
    ["KEY-001", "Production API Key", "Production", "fm_prod_8a2f…m9Rq", ["Orders", "Inventory", "Shipments"], "2025-04-01", "2025-05-16", "Active"],
    ["KEY-002", "Staging Environment", "Staging", "fm_stg_4c9d…n3Wx", ["Orders", "Products"], "2025-04-10", "2025-05-12", "Active"],
    ["KEY-003", "Analytics Service", "Production", "fm_anl_h6d1…k8Tz", ["Reports", "Analytics"], "2025-03-22", "2025-05-15", "Active"],
    ["KEY-004", "Legacy Integration", "Production", "fm_leg_q9w5…p2Ym", ["Orders"], "2024-11-10", "2025-04-15", "Inactive"],
  ];
  for (const [id, name, env, prefix, scopes, created, last, status] of rows) {
    await db.query(sql, [id, name, env, prefix, JSON.stringify(scopes), created, last, status]);
  }
}

async function seedWarehouses(db: Pool) {
  if (await count(db, "warehouses") > 0) return;
  const sql = `INSERT INTO warehouses (id, name, code, location, city, country, type, manager, capacity, is_default, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;
  const whs: [string, string, string, string, string, string, string, string, number, boolean, string][] = [
    ["WH-001", "Shenzhen Main Hub", "SZX-1", "Bao'an District", "Shenzhen", "China", "Standard", "Li Wei", 88, true, "Active"],
    ["WH-002", "Los Angeles DC", "LAX-1", "Compton", "Los Angeles", "USA", "Standard", "John Carter", 74, false, "Active"],
    ["WH-003", "Dallas Fulfillment", "DFW-1", "Coppell", "Dallas", "USA", "Standard", "Maria Lopez", 68, false, "Active"],
    ["WH-004", "Rotterdam EU Hub", "RTM-1", "Port Area", "Rotterdam", "Netherlands", "Bonded", "Hans Müller", 61, false, "Active"],
    ["WH-005", "Miami Cold Chain", "MIA-1", "Doral", "Miami", "USA", "Cold Storage", "Carlos Vega", 90, false, "Active"],
    ["WH-006", "Tokyo Express", "NRT-1", "Narita", "Tokyo", "Japan", "Express", "Yuki Tanaka", 55, false, "Paused"],
  ];
  for (const w of whs) await db.query(sql, w);
}

async function seedStorageTypes(db: Pool) {
  if (await count(db, "storage_types") > 0) return;
  const sql = `INSERT INTO storage_types (id, code, name, description, suitable_for, utilization, status) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
  const sts: [string, string, string, string, string, number, string][] = [
    ["ST-001", "BIN", "Bin Location", "Small item storage for fast picks", "Small Items", 82, "Active"],
    ["ST-002", "SHELF", "Shelf Storage", "General items on shelves", "General", 74, "Active"],
    ["ST-003", "RACK", "Pallet Rack", "Pallets on rack systems", "Pallets", 68, "Active"],
    ["ST-004", "BULK", "Bulk Storage", "Bulk items on floor", "Bulk", 61, "Active"],
    ["ST-005", "CAGE", "Cage Storage", "Items in security cages", "High Value", 55, "Active"],
    ["ST-006", "COOL", "Cold Storage", "Temperature controlled (2-8°C)", "Perishables", 90, "Active"],
    ["ST-007", "FRZ", "Frozen Storage", "Frozen goods (-18°C and below)", "Frozen", 76, "Active"],
    ["ST-008", "HAZ", "Hazardous Storage", "Hazardous material storage", "Regulated", 43, "Active"],
  ];
  for (const s of sts) await db.query(sql, s);
}

async function seedTransfers(db: Pool) {
  if (await count(db, "transfer_orders") > 0) return;
  const sql = `INSERT INTO transfer_orders (id, reference, from_warehouse, to_warehouse, item_count, unit_count, status, requested_date, eta) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
  const trs: [string, string, string, string, number, number, string, string, string][] = [
    ["TR-00987", "REF-78230", "LAX-1", "DFW-1", 24, 1200, "In Transit", "2025-05-20", "2025-05-23"],
    ["TR-00986", "REF-78229", "DFW-1", "MIA-1", 15, 980, "Completed", "2025-05-19", "2025-05-22"],
    ["TR-00985", "REF-78228", "RTM-1", "LAX-1", 30, 1540, "In Transit", "2025-05-19", "2025-05-26"],
    ["TR-00984", "REF-78227", "LAX-1", "NRT-1", 8, 420, "Pending", "2025-05-18", "2025-05-24"],
    ["TR-00983", "REF-78226", "MIA-1", "DFW-1", 12, 640, "Completed", "2025-05-18", "2025-05-21"],
    ["TR-00982", "REF-78225", "SZX-1", "RTM-1", 18, 890, "Pending", "2025-05-17", "2025-06-02"],
  ];
  for (const t of trs) await db.query(sql, t);
}

async function seedCycleCounts(db: Pool) {
  if (await count(db, "cycle_counts") > 0) return;
  const sql = `INSERT INTO cycle_counts (id, name, count_type, warehouse, status, progress, start_date, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
  const ccs: [string, string, string, string, string, number, string, string][] = [
    ["CC-000124", "Aisle A01 – A10", "Routine Cycle Count", "LAX-1", "Completed", 100, "2025-05-30", "2025-05-30"],
    ["CC-000123", "High Value Items", "Priority Count", "DFW-1", "In Progress", 65, "2025-05-31", "2025-06-02"],
    ["CC-000122", "Zone B – Shelves 1-20", "Routine Cycle Count", "LAX-1", "In Progress", 40, "2025-05-31", "2025-06-01"],
    ["CC-000121", "FRZ-01 Freezer Zone", "Temperature Sensitive", "MIA-1", "Scheduled", 0, "2025-06-02", "2025-06-03"],
    ["CC-000120", "Bulk Storage Area", "Full Warehouse Count", "DFW-1", "Scheduled", 0, "2025-06-02", "2025-06-05"],
    ["CC-000119", "Electronics Category", "Category Count", "LAX-1", "Completed", 100, "2025-05-29", "2025-05-29"],
  ];
  for (const c of ccs) await db.query(sql, c);
}

async function seedNotifications(db: Pool) {
  if (await count(db, "notifications") > 0) return;
  const sql = `INSERT INTO notifications (id, type, title, description, read, created_at, link) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
  const ntfs: [string, string, string, string, boolean, string, string | null][] = [
    ["NTF-001", "order", "New order received", "Order ORD-5821 from Acme Retail ($1,245.80)", false, "2025-05-18T09:30:00Z", "/dashboard/orders"],
    ["NTF-002", "inventory", "Low stock alert", "SKU-0612 Fitness Tracker below reorder point", false, "2025-05-18T08:15:00Z", "/dashboard/inventory"],
    ["NTF-003", "shipment", "Shipment delivered", "Shipment SHP-3214 delivered to customer", true, "2025-05-17T16:42:00Z", "/dashboard/shipments"],
    ["NTF-004", "return", "Return request submitted", "Customer requested return for order ORD-5801", false, "2025-05-17T14:20:00Z", "/dashboard/returns"],
    ["NTF-005", "billing", "Invoice overdue", "Invoice INV-712 payment is 3 days overdue", true, "2025-05-17T10:00:00Z", "/dashboard/invoices"],
    ["NTF-006", "system", "Scheduled maintenance", "System maintenance window May 20, 2-4 AM UTC", true, "2025-05-16T18:00:00Z", null],
    ["NTF-007", "security", "New login detected", "Login from new device in Miami, FL", false, "2025-05-16T11:33:00Z", "/dashboard/settings/security"],
    ["NTF-008", "inventory", "Stockout risk", "SKU-0310 Laptop Stand will stockout in 2 days", false, "2025-05-16T09:12:00Z", "/dashboard/inventory"],
  ];
  for (const n of ntfs) await db.query(sql, n);
}

async function seedTasks(db: Pool) {
  if (await count(db, "tasks") > 0) return;
  const sql = `INSERT INTO tasks (id, title, task_type, warehouse, assignee, priority, status, created_at, due_date, reference) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
  const tsks: [string, string, string, string, string, string, string, string, string, string | null][] = [
    ["TSK-0401", "Restock SKU-0612 Fitness Tracker", "Replenishment", "DFW-1", "Maria Lopez", "High", "In Progress", "2025-05-17", "2025-05-20", "INV-0612"],
    ["TSK-0402", "Pick order ORD-5821", "Picking", "LAX-1", "James Carter", "Urgent", "Pending", "2025-05-18", "2025-05-18", "ORD-5821"],
    ["TSK-0403", "Pack shipment SHP-3220", "Packing", "LAX-1", "Sophie Lee", "Medium", "Pending", "2025-05-18", "2025-05-19", "SHP-3220"],
    ["TSK-0404", "Cycle count Aisle C", "Cycle Count", "LAX-1", "Olivia Martinez", "Low", "Completed", "2025-05-16", "2025-05-17", "CC-000124"],
    ["TSK-0405", "QC inspection QC-0812", "Quality Check", "SZX-1", "Emily Chen", "High", "In Progress", "2025-05-17", "2025-05-19", "QC-0812"],
    ["TSK-0406", "Process return RTN-0234", "Return Processing", "DFW-1", "Michael Brown", "Medium", "Pending", "2025-05-17", "2025-05-21", "RTN-0234"],
    ["TSK-0407", "Restock SKU-0738 USB-C Charger", "Replenishment", "RTM-1", "Hans Müller", "Medium", "Pending", "2025-05-16", "2025-05-22", "INV-0738"],
    ["TSK-0408", "Transfer TR-00987 receiving", "Receiving", "DFW-1", "Maria Lopez", "Medium", "Completed", "2025-05-15", "2025-05-23", "TR-00987"],
  ];
  for (const t of tsks) await db.query(sql, t);
}

async function seedLocations(db: Pool) {
  if (await count(db, "warehouse_locations") > 0) return;
  const sql = `INSERT INTO warehouse_locations (id, code, name, warehouse, type, capacity, status) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
  const locs: [string, string, string, string, string, number, string][] = [
    ["LOC-001", "A01-01-01", "Aisle A Bin 1", "LAX-1", "Bin", 88, "Active"],
    ["LOC-002", "A01-01-02", "Aisle A Bin 2", "LAX-1", "Bin", 72, "Active"],
    ["LOC-003", "B02-03-01", "Shelf B2 Row 3", "LAX-1", "Shelf", 64, "Active"],
    ["LOC-004", "R01-PAL-01", "Rack 1 Pallet", "DFW-1", "Rack", 91, "Active"],
    ["LOC-005", "R01-PAL-02", "Rack 2 Pallet", "DFW-1", "Rack", 45, "Active"],
    ["LOC-006", "BLK-01-01", "Bulk Floor 1", "DFW-1", "Bulk", 58, "Active"],
    ["LOC-007", "CG-01-01", "Security Cage 1", "DFW-1", "Cage", 33, "Active"],
    ["LOC-008", "CL-01-01", "Cold Zone 1", "MIA-1", "Cold", 90, "Active"],
    ["LOC-009", "FZ-01-01", "Freezer Zone 1", "MIA-1", "Frozen", 76, "Active"],
    ["LOC-010", "HZ-01-01", "Hazmat Cabinet", "RTM-1", "Hazmat", 28, "Inactive"],
  ];
  for (const l of locs) await db.query(sql, l);
}

async function seedSettings(db: Pool) {
  if (await count(db, "settings") > 0) return;
  const sql = `INSERT INTO settings (key, value) VALUES ($1, $2)`;
  const entries: [string, unknown][] = [
    ["general", {
      companyName: "FulfillMesh",
      supportEmail: "support@fulfillmesh.com",
      timezone: "America/New_York",
      currency: "USD",
      dateFormat: "MMM DD, YYYY",
      language: "English",
    }],
    ["notifications", {
      orderUpdates: true,
      shipmentAlerts: true,
      inventoryWarnings: true,
      billingReminders: true,
      weeklyDigest: false,
      productNews: true,
    }],
    ["security", {
      twoFactorRequired: true,
      sessionTimeoutMinutes: 30,
      passwordRotationDays: 90,
      ipAllowlistEnabled: false,
    }],
    ["billing", {
      plan: "Growth",
      seats: 12,
      billingCycle: "Monthly",
      autoRenew: true,
    }],
  ];
  for (const [key, value] of entries) await db.query(sql, [key, JSON.stringify(value)]);
}

async function seedAuditLogs(db: Pool) {
  if (await count(db, "audit_logs") > 0) return;
  const sql = `INSERT INTO audit_logs (id, actor, action, target, category, ip, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
  const rows: [string, string, string, string, string, string, string, string][] = [
    ["LOG-0001", "admin@fulfillmesh.com", "Logged in", "Session", "auth", "203.0.113.24", "Success", "2025-05-16T09:14:00Z"],
    ["LOG-0002", "sarah@fulfillmesh.com", "Updated order ORD-5821", "ORD-5821", "data", "203.0.113.51", "Success", "2025-05-16T08:42:00Z"],
    ["LOG-0003", "admin@fulfillmesh.com", "Created API key", "KEY-003", "api", "203.0.113.24", "Success", "2025-05-15T17:30:00Z"],
    ["LOG-0004", "miguel@fulfillmesh.com", "Failed login attempt", "Session", "auth", "198.51.100.7", "Failed", "2025-05-15T14:05:00Z"],
    ["LOG-0005", "sarah@fulfillmesh.com", "Exported customer report", "Report", "data", "203.0.113.51", "Success", "2025-05-15T11:20:00Z"],
    ["LOG-0006", "admin@fulfillmesh.com", "Changed billing plan to Growth", "Billing", "billing", "203.0.113.24", "Success", "2025-05-14T16:48:00Z"],
    ["LOG-0007", "system", "Inventory sync completed", "Inventory", "system", "—", "Success", "2025-05-14T03:00:00Z"],
    ["LOG-0008", "priya@fulfillmesh.com", "Updated security settings", "Settings", "security", "203.0.113.88", "Warning", "2025-05-13T10:12:00Z"],
    ["LOG-0009", "miguel@fulfillmesh.com", "Deleted product PRD-0231", "PRD-0231", "data", "203.0.113.51", "Success", "2025-05-13T09:30:00Z"],
    ["LOG-0010", "admin@fulfillmesh.com", "Revoked API key KEY-004", "KEY-004", "api", "203.0.113.24", "Success", "2025-05-12T15:00:00Z"],
  ];
  for (const r of rows) await db.query(sql, r);
}

async function seedDocuments(db: Pool) {
  if (await count(db, "documents") > 0) return;
  const sql = `INSERT INTO documents (id, name, type, category, size, owner, status, url, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
  const rows: [string, string, string, string, string, string, string, string | null, string][] = [
    ["DOC-001", "Q1 2025 Fulfillment Report.pdf", "Report", "Reports", "2.4 MB", "Sarah Chen", "Active", null, "2025-05-12"],
    ["DOC-002", "Supplier Agreement — Shenzhen Tech.pdf", "Contract", "Legal", "1.1 MB", "Admin User", "Active", null, "2025-05-10"],
    ["DOC-003", "Invoice INV-2025-0481.pdf", "Invoice", "Billing", "320 KB", "Admin User", "Active", null, "2025-05-09"],
    ["DOC-004", "Shipping Label Batch — May.zip", "Label", "Shipping", "8.7 MB", "Miguel Santos", "Active", null, "2025-05-08"],
    ["DOC-005", "Brand Packaging Guidelines.pdf", "PDF", "Branding", "5.2 MB", "Sarah Chen", "Active", null, "2025-05-05"],
    ["DOC-006", "2024 Annual Customs Summary.xlsx", "Report", "Compliance", "640 KB", "Admin User", "Archived", null, "2025-01-31"],
    ["DOC-007", "Warehouse Floor Plan — LAX-1.png", "Image", "Operations", "1.8 MB", "Miguel Santos", "Active", null, "2025-04-22"],
    ["DOC-008", "Returns Policy Draft.docx", "PDF", "Legal", "210 KB", "Priya Nair", "Draft", null, "2025-05-14"],
  ];
  for (const r of rows) await db.query(sql, r);
}

async function seedMessages(db: Pool) {
  if (await count(db, "messages") > 0) return;
  const sql = `INSERT INTO messages (id, sender, subject, preview, channel, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
  const rows: [string, string, string, string, string, string, string][] = [
    ["MSG-001", "Shenzhen Tech Co.", "Re: PO-50872 production update", "Production is on schedule, units ready for QC on May 20…", "Email", "Unread", "2025-05-16T08:30:00Z"],
    ["MSG-002", "Acme Retail", "Question about order ORD-5821", "Hi, can you confirm the tracking number for our latest shipment?", "Support", "Unread", "2025-05-16T07:55:00Z"],
    ["MSG-003", "FulfillMesh System", "Low stock alert: SKU-0612", "Fitness Tracker has dropped below its reorder point at DFW-1.", "System", "Read", "2025-05-15T22:10:00Z"],
    ["MSG-004", "Maria Lopez", "Cycle count CC-000124 complete", "Aisle C cycle count finished with no discrepancies.", "Chat", "Read", "2025-05-15T16:40:00Z"],
    ["MSG-005", "Summit Goods", "Invoice INV-2025-0481 received", "Thanks — payment has been scheduled for net-30.", "Email", "Read", "2025-05-14T13:05:00Z"],
    ["MSG-006", "Carrier — DHL Express", "Customs hold on SHP-3220", "Shipment requires additional documentation to clear customs.", "System", "Unread", "2025-05-14T09:18:00Z"],
  ];
  for (const r of rows) await db.query(sql, r);
}

// Deterministic small int from a string, for stable seeded variety.
function hashInt(s: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % mod;
}

async function seedInventoryMovements(db: Pool) {
  if (await count(db, "inventory_movements") > 0) return;
  const inv = await db.query<{ sku: string; name: string; warehouse: string; on_hand: number }>(
    "SELECT sku, name, warehouse, on_hand FROM inventory",
  );
  const sql = `INSERT INTO inventory_movements (id, sku, name, warehouse, type, quantity, reason, reference, date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
  let n = 1;
  for (const it of inv.rows) {
    const base = it.on_hand || 100;
    const rows: [string, number, string, string, string][] = [
      ["Inbound", Math.max(20, Math.round(base * 0.6)), "Purchase order receipt", "PO-" + (50000 + hashInt(it.sku, 900)), "2025-05-02"],
      ["Outbound", -Math.max(5, Math.round(base * 0.15)), "Order fulfillment", "ORD-" + (5000 + hashInt(it.sku + "o", 900)), "2025-05-09"],
      ["Outbound", -Math.max(3, Math.round(base * 0.1)), "Order fulfillment", "ORD-" + (5000 + hashInt(it.sku + "p", 900)), "2025-05-14"],
      ["Adjustment", (hashInt(it.sku, 2) === 0 ? -1 : 1) * (1 + hashInt(it.sku, 5)), "Cycle count correction", "CC-" + (100 + hashInt(it.sku, 90)), "2025-05-16"],
    ];
    for (const [type, qty, reason, ref, date] of rows) {
      await db.query(sql, [`MOV-${String(n).padStart(4, "0")}`, it.sku, it.name, it.warehouse, type, qty, reason, ref, date]);
      n++;
    }
  }
}

async function seedQuoteBids(db: Pool) {
  if (await count(db, "quote_bids") > 0) return;
  const quotes = await db.query<{ id: string; total: number }>("SELECT id, total FROM quotes");
  const supplierPool = ["Shenzhen Tech Co.", "Guangzhou Manufacturing", "Dongguan Precision", "Ningbo Export Group", "Yiwu Trading Ltd."];
  const sql = `INSERT INTO quote_bids (id, quote_id, supplier, unit_price, lead_time_days, moq, landed_cost, recommended, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
  let n = 1;
  for (const q of quotes.rows) {
    const baseUnit = Math.max(2, (q.total || 1000) / 500);
    const bids = [0, 1, 2].map((i) => {
      const supplier = supplierPool[(hashInt(q.id + i, supplierPool.length))];
      const unit = +(baseUnit * (1 + (i - 1) * 0.12 + hashInt(q.id + i, 7) / 100)).toFixed(2);
      const lead = 12 + i * 4 + hashInt(q.id + i, 6);
      const moq = 500 + i * 250;
      const landed = +(unit * 1.18 + i * 0.4).toFixed(2);
      return { supplier, unit, lead, moq, landed };
    });
    // de-dupe suppliers
    const seen = new Set<string>();
    const uniq = bids.filter((b) => (seen.has(b.supplier) ? false : (seen.add(b.supplier), true)));
    const best = uniq.reduce((a, b) => (b.landed < a.landed ? b : a), uniq[0]);
    for (const b of uniq) {
      await db.query(sql, [`BID-${String(n).padStart(4, "0")}`, q.id, b.supplier, b.unit, b.lead, b.moq, b.landed, b === best, null]);
      n++;
    }
  }
}

async function backfillSupplierMetrics(db: Pool) {
  const rows = await db.query<{ id: string; rating: number }>("SELECT id, rating FROM suppliers WHERE on_time_pct IS NULL");
  for (const s of rows.rows) {
    const onTime = Math.min(99.5, 88 + (s.rating ?? 4) * 2 + hashInt(s.id, 30) / 10);
    const resp = 2 + hashInt(s.id, 20);
    await db.query("UPDATE suppliers SET on_time_pct = $1, avg_response_hours = $2 WHERE id = $3",
      [+onTime.toFixed(1), resp, s.id]);
  }
}

async function backfillReturnCosts(db: Pool) {
  const rows = await db.query<{ id: string; refund_amount: number; items: number }>(
    "SELECT id, refund_amount, items FROM returns WHERE shipping_cost IS NULL",
  );
  for (const r of rows.rows) {
    const refund = r.refund_amount ?? 50;
    const shipping = +(8 + (r.items ?? 1) * 2.5 + hashInt(r.id, 12)).toFixed(2);
    const restock = +(refund * 0.1).toFixed(2);
    const recovery = +(refund * (0.4 + hashInt(r.id, 30) / 100)).toFixed(2);
    await db.query("UPDATE returns SET shipping_cost = $1, restocking_fee = $2, recovery_value = $3 WHERE id = $4",
      [shipping, restock, recovery, r.id]);
  }
}

async function backfillQcChecklists(db: Pool) {
  const rows = await db.query<{ id: string; status: string }>("SELECT id, status FROM qc_inspections WHERE checklist IS NULL");
  const labels = [
    "Dimensions within tolerance",
    "Material matches spec",
    "Color/finish consistent",
    "Functional test passed",
    "Packaging integrity",
    "Labeling & barcodes correct",
  ];
  for (const q of rows.rows) {
    const items = labels.map((label, i) => {
      let result: "Pass" | "Fail" | "N/A" = "Pass";
      if (q.status === "Failed" && hashInt(q.id + i, 3) === 0) result = "Fail";
      else if (q.status === "Scheduled" || q.status === "In Progress") result = hashInt(q.id + i, 4) === 0 ? "N/A" : "Pass";
      return { label, result, notes: result === "Fail" ? "Out of tolerance — flagged for rework" : undefined };
    });
    await db.query("UPDATE qc_inspections SET checklist = $1 WHERE id = $2", [JSON.stringify(items), q.id]);
  }
}

async function seedIntegrations(db: Pool) {
  if (await count(db, "integrations") > 0) return;
  const sql = `INSERT INTO integrations (id, name, category, status, description, last_sync) VALUES ($1,$2,$3,$4,$5,$6)`;
  const rows: [string, string, string, string, string, string | null][] = [
    ["INT-001", "Shopify", "Ecommerce", "Connected", "Sync orders, products and inventory with your Shopify store.", "2025-05-16T08:00:00Z"],
    ["INT-002", "Amazon Seller Central", "Marketplace", "Connected", "Import FBA and FBM orders and push tracking back to Amazon.", "2025-05-16T07:30:00Z"],
    ["INT-003", "WooCommerce", "Ecommerce", "Available", "Connect your WordPress store for two-way order sync.", null],
    ["INT-004", "DHL Express", "Shipping", "Connected", "Generate labels and pull live tracking for DHL shipments.", "2025-05-16T06:45:00Z"],
    ["INT-005", "QuickBooks", "Accounting", "Available", "Sync invoices and payments to your QuickBooks ledger.", null],
    ["INT-006", "Klaviyo", "Marketing", "Error", "Push fulfillment events to Klaviyo flows. Re-authentication required.", "2025-05-10T12:00:00Z"],
    ["INT-007", "TikTok Shop", "Marketplace", "Available", "Fulfill TikTok Shop orders through FulfillMesh.", null],
    ["INT-008", "Stripe", "Accounting", "Connected", "Reconcile payouts and invoice payments via Stripe.", "2025-05-15T20:15:00Z"],
  ];
  for (const r of rows) await db.query(sql, r);
}
