import { query } from "./db";
import type {
  Order, Product, InventoryItem, Customer, Supplier, Shipment,
  ReturnRecord, Quote, Invoice, QcInspection, User, Submission,
  Warehouse, StorageType, TransferOrder, CycleCount, AppNotification, Task,
  WarehouseLocation, ApiKey, AuditLog, DocumentRecord, Message, IntegrationRecord,
} from "@/types";

// Async repository layer over PostgreSQL. Each entity exposes list/get/create/
// update/remove. Rows are mapped from snake_case columns to the camelCase
// domain types defined in `@/types`. Statements use $1, $2, ... placeholders.

function genId(prefix: string): string {
  const n = Date.now().toString(36) + Math.floor(performance.now()).toString(36);
  return `${prefix}-${n}`.toUpperCase();
}

type Row = Record<string, unknown>;
async function one<T>(sql: string, params: unknown[], map: (r: Row) => T): Promise<T | null> {
  const rows = await query(sql, params);
  return rows[0] ? map(rows[0]) : null;
}

// ---------- Orders ----------
function mapOrder(r: Row): Order {
  return {
    id: r.id as string,
    customer: r.customer as string,
    customerId: (r.customer_id as string) ?? undefined,
    status: r.status as Order["status"],
    date: r.date as string,
    total: r.total as number,
    channel: (r.channel as string) ?? undefined,
    destination: (r.destination as string) ?? undefined,
    items: r.items ? JSON.parse(r.items as string) : undefined,
    trackingNumber: (r.tracking_number as string) ?? undefined,
    notes: (r.notes as string) ?? undefined,
  };
}
export const orders = {
  async list(): Promise<Order[]> {
    return (await query("SELECT * FROM orders ORDER BY date DESC, id DESC")).map(mapOrder);
  },
  async get(id: string): Promise<Order | null> {
    return one("SELECT * FROM orders WHERE id = $1", [id], mapOrder);
  },
  async create(o: Partial<Order>): Promise<Order> {
    const id = o.id || genId("ORD");
    await query(
      `INSERT INTO orders (id, customer, customer_id, status, date, total, channel, destination, items, tracking_number, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, o.customer ?? "", o.customerId ?? null, o.status ?? "Pending",
        o.date ?? new Date().toISOString().slice(0, 10), o.total ?? 0, o.channel ?? null,
        o.destination ?? null, o.items ? JSON.stringify(o.items) : null, o.trackingNumber ?? null, o.notes ?? null],
    );
    return (await this.get(id))!;
  },
  async update(id: string, o: Partial<Order>): Promise<Order | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...o };
    await query(
      `UPDATE orders SET customer=$1, customer_id=$2, status=$3, date=$4, total=$5, channel=$6, destination=$7, items=$8, tracking_number=$9, notes=$10 WHERE id=$11`,
      [m.customer, m.customerId ?? null, m.status, m.date, m.total, m.channel ?? null,
        m.destination ?? null, m.items ? JSON.stringify(m.items) : null, m.trackingNumber ?? null, m.notes ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM orders WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Products ----------
function mapProduct(r: Row): Product {
  return {
    id: r.id as string, sku: r.sku as string, name: r.name as string,
    category: r.category as string, price: r.price as number,
    cost: (r.cost as number) ?? undefined, stock: r.stock as number,
    status: r.status as Product["status"], supplier: (r.supplier as string) ?? undefined,
    image: (r.image as string) ?? undefined, description: (r.description as string) ?? undefined,
  };
}
export const products = {
  async list(): Promise<Product[]> {
    return (await query("SELECT * FROM products ORDER BY name")).map(mapProduct);
  },
  async get(id: string): Promise<Product | null> {
    return one("SELECT * FROM products WHERE id = $1", [id], mapProduct);
  },
  async create(p: Partial<Product>): Promise<Product> {
    const id = p.id || genId("PRD");
    await query(
      `INSERT INTO products (id, sku, name, category, price, cost, stock, status, supplier, image, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, p.sku ?? "", p.name ?? "", p.category ?? "General", p.price ?? 0, p.cost ?? null,
        p.stock ?? 0, p.status ?? "In Stock", p.supplier ?? null, p.image ?? null, p.description ?? null],
    );
    return (await this.get(id))!;
  },
  async update(id: string, p: Partial<Product>): Promise<Product | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...p };
    await query(
      `UPDATE products SET sku=$1, name=$2, category=$3, price=$4, cost=$5, stock=$6, status=$7, supplier=$8, image=$9, description=$10 WHERE id=$11`,
      [m.sku, m.name, m.category, m.price, m.cost ?? null, m.stock, m.status, m.supplier ?? null, m.image ?? null, m.description ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM products WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Inventory ----------
function mapInventory(r: Row): InventoryItem {
  return {
    id: r.id as string, sku: r.sku as string, name: r.name as string,
    warehouse: r.warehouse as string, location: (r.location as string) ?? undefined,
    onHand: r.on_hand as number, reserved: r.reserved as number, available: r.available as number,
    reorderPoint: r.reorder_point as number, status: r.status as InventoryItem["status"],
  };
}
export const inventory = {
  async list(): Promise<InventoryItem[]> {
    return (await query("SELECT * FROM inventory ORDER BY name")).map(mapInventory);
  },
  async get(id: string): Promise<InventoryItem | null> {
    return one("SELECT * FROM inventory WHERE id = $1", [id], mapInventory);
  },
  async create(it: Partial<InventoryItem>): Promise<InventoryItem> {
    const id = it.id || genId("INV");
    await query(
      `INSERT INTO inventory (id, sku, name, warehouse, location, on_hand, reserved, available, reorder_point, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, it.sku ?? "", it.name ?? "", it.warehouse ?? "", it.location ?? null,
        it.onHand ?? 0, it.reserved ?? 0, it.available ?? 0, it.reorderPoint ?? 0, it.status ?? "In Stock"],
    );
    return (await this.get(id))!;
  },
  async update(id: string, it: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...it };
    await query(
      `UPDATE inventory SET sku=$1, name=$2, warehouse=$3, location=$4, on_hand=$5, reserved=$6, available=$7, reorder_point=$8, status=$9 WHERE id=$10`,
      [m.sku, m.name, m.warehouse, m.location ?? null, m.onHand, m.reserved, m.available, m.reorderPoint, m.status, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM inventory WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Customers ----------
function mapCustomer(r: Row): Customer {
  return {
    id: r.id as string, name: r.name as string, email: r.email as string,
    company: (r.company as string) ?? undefined, phone: (r.phone as string) ?? undefined,
    country: (r.country as string) ?? undefined, orders: r.orders as number,
    totalSpent: r.total_spent as number, status: r.status as Customer["status"],
    joinedDate: (r.joined_date as string) ?? undefined,
  };
}
export const customers = {
  async list(): Promise<Customer[]> {
    return (await query("SELECT * FROM customers ORDER BY name")).map(mapCustomer);
  },
  async get(id: string): Promise<Customer | null> {
    return one("SELECT * FROM customers WHERE id = $1", [id], mapCustomer);
  },
  async create(c: Partial<Customer>): Promise<Customer> {
    const id = c.id || genId("CUS");
    await query(
      `INSERT INTO customers (id, name, email, company, phone, country, orders, total_spent, status, joined_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, c.name ?? "", c.email ?? "", c.company ?? null, c.phone ?? null, c.country ?? null,
        c.orders ?? 0, c.totalSpent ?? 0, c.status ?? "Active", c.joinedDate ?? new Date().toISOString().slice(0, 10)],
    );
    return (await this.get(id))!;
  },
  async update(id: string, c: Partial<Customer>): Promise<Customer | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...c };
    await query(
      `UPDATE customers SET name=$1, email=$2, company=$3, phone=$4, country=$5, orders=$6, total_spent=$7, status=$8, joined_date=$9 WHERE id=$10`,
      [m.name, m.email, m.company ?? null, m.phone ?? null, m.country ?? null, m.orders, m.totalSpent, m.status, m.joinedDate ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM customers WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Suppliers ----------
function mapSupplier(r: Row): Supplier {
  return {
    id: r.id as string, name: r.name as string, contact: (r.contact as string) ?? undefined,
    email: (r.email as string) ?? undefined, country: r.country as string,
    category: (r.category as string) ?? undefined, rating: r.rating as number,
    status: r.status as Supplier["status"], leadTimeDays: (r.lead_time_days as number) ?? undefined,
    productsSupplied: (r.products_supplied as number) ?? undefined,
  };
}
export const suppliers = {
  async list(): Promise<Supplier[]> {
    return (await query("SELECT * FROM suppliers ORDER BY name")).map(mapSupplier);
  },
  async get(id: string): Promise<Supplier | null> {
    return one("SELECT * FROM suppliers WHERE id = $1", [id], mapSupplier);
  },
  async create(s: Partial<Supplier>): Promise<Supplier> {
    const id = s.id || genId("SUP");
    await query(
      `INSERT INTO suppliers (id, name, contact, email, country, category, rating, status, lead_time_days, products_supplied)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, s.name ?? "", s.contact ?? null, s.email ?? null, s.country ?? "China", s.category ?? null,
        s.rating ?? 0, s.status ?? "Active", s.leadTimeDays ?? null, s.productsSupplied ?? null],
    );
    return (await this.get(id))!;
  },
  async update(id: string, s: Partial<Supplier>): Promise<Supplier | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...s };
    await query(
      `UPDATE suppliers SET name=$1, contact=$2, email=$3, country=$4, category=$5, rating=$6, status=$7, lead_time_days=$8, products_supplied=$9 WHERE id=$10`,
      [m.name, m.contact ?? null, m.email ?? null, m.country, m.category ?? null, m.rating, m.status, m.leadTimeDays ?? null, m.productsSupplied ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM suppliers WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Shipments ----------
function mapShipment(r: Row): Shipment {
  return {
    id: r.id as string, orderId: (r.order_id as string) ?? undefined, carrier: r.carrier as string,
    trackingNumber: r.tracking_number as string, origin: r.origin as string,
    destination: r.destination as string, status: r.status as Shipment["status"],
    shippedDate: (r.shipped_date as string) ?? undefined,
    estimatedDelivery: (r.estimated_delivery as string) ?? undefined, weight: (r.weight as string) ?? undefined,
  };
}
export const shipments = {
  async list(): Promise<Shipment[]> {
    return (await query("SELECT * FROM shipments ORDER BY id DESC")).map(mapShipment);
  },
  async get(id: string): Promise<Shipment | null> {
    return one("SELECT * FROM shipments WHERE id = $1", [id], mapShipment);
  },
  async create(s: Partial<Shipment>): Promise<Shipment> {
    const id = s.id || genId("SHP");
    await query(
      `INSERT INTO shipments (id, order_id, carrier, tracking_number, origin, destination, status, shipped_date, estimated_delivery, weight)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, s.orderId ?? null, s.carrier ?? "", s.trackingNumber ?? "", s.origin ?? "", s.destination ?? "",
        s.status ?? "Awaiting Pickup", s.shippedDate ?? null, s.estimatedDelivery ?? null, s.weight ?? null],
    );
    return (await this.get(id))!;
  },
  async update(id: string, s: Partial<Shipment>): Promise<Shipment | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...s };
    await query(
      `UPDATE shipments SET order_id=$1, carrier=$2, tracking_number=$3, origin=$4, destination=$5, status=$6, shipped_date=$7, estimated_delivery=$8, weight=$9 WHERE id=$10`,
      [m.orderId ?? null, m.carrier, m.trackingNumber, m.origin, m.destination, m.status, m.shippedDate ?? null, m.estimatedDelivery ?? null, m.weight ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM shipments WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Returns ----------
function mapReturn(r: Row): ReturnRecord {
  return {
    id: r.id as string, orderId: r.order_id as string, customer: r.customer as string,
    reason: r.reason as string, status: r.status as ReturnRecord["status"],
    requestedDate: r.requested_date as string, items: r.items as number,
    refundAmount: (r.refund_amount as number) ?? undefined,
  };
}
export const returns = {
  async list(): Promise<ReturnRecord[]> {
    return (await query("SELECT * FROM returns ORDER BY requested_date DESC")).map(mapReturn);
  },
  async get(id: string): Promise<ReturnRecord | null> {
    return one("SELECT * FROM returns WHERE id = $1", [id], mapReturn);
  },
  async create(r: Partial<ReturnRecord>): Promise<ReturnRecord> {
    const id = r.id || genId("RET");
    await query(
      `INSERT INTO returns (id, order_id, customer, reason, status, requested_date, items, refund_amount)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, r.orderId ?? "", r.customer ?? "", r.reason ?? null, r.status ?? "Requested",
        r.requestedDate ?? new Date().toISOString().slice(0, 10), r.items ?? 1, r.refundAmount ?? null],
    );
    return (await this.get(id))!;
  },
  async update(id: string, r: Partial<ReturnRecord>): Promise<ReturnRecord | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...r };
    await query(
      `UPDATE returns SET order_id=$1, customer=$2, reason=$3, status=$4, requested_date=$5, items=$6, refund_amount=$7 WHERE id=$8`,
      [m.orderId, m.customer, m.reason, m.status, m.requestedDate, m.items, m.refundAmount ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM returns WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Quotes ----------
function mapQuote(r: Row): Quote {
  return {
    id: r.id as string, customer: r.customer as string, customerId: (r.customer_id as string) ?? undefined,
    status: r.status as Quote["status"], createdDate: r.created_date as string,
    validUntil: (r.valid_until as string) ?? undefined, total: r.total as number,
    items: r.items ? JSON.parse(r.items as string) : undefined,
  };
}
export const quotes = {
  async list(): Promise<Quote[]> {
    return (await query("SELECT * FROM quotes ORDER BY created_date DESC")).map(mapQuote);
  },
  async get(id: string): Promise<Quote | null> {
    return one("SELECT * FROM quotes WHERE id = $1", [id], mapQuote);
  },
  async create(q: Partial<Quote>): Promise<Quote> {
    const id = q.id || genId("QUO");
    await query(
      `INSERT INTO quotes (id, customer, customer_id, status, created_date, valid_until, total, items)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, q.customer ?? "", q.customerId ?? null, q.status ?? "Draft",
        q.createdDate ?? new Date().toISOString().slice(0, 10), q.validUntil ?? null, q.total ?? 0,
        q.items ? JSON.stringify(q.items) : null],
    );
    return (await this.get(id))!;
  },
  async update(id: string, q: Partial<Quote>): Promise<Quote | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...q };
    await query(
      `UPDATE quotes SET customer=$1, customer_id=$2, status=$3, created_date=$4, valid_until=$5, total=$6, items=$7 WHERE id=$8`,
      [m.customer, m.customerId ?? null, m.status, m.createdDate, m.validUntil ?? null, m.total, m.items ? JSON.stringify(m.items) : null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM quotes WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Invoices ----------
function mapInvoice(r: Row): Invoice {
  return {
    id: r.id as string, customer: r.customer as string, orderId: (r.order_id as string) ?? undefined,
    status: r.status as Invoice["status"], issuedDate: r.issued_date as string,
    dueDate: r.due_date as string, amount: r.amount as number,
  };
}
export const invoices = {
  async list(): Promise<Invoice[]> {
    return (await query("SELECT * FROM invoices ORDER BY issued_date DESC")).map(mapInvoice);
  },
  async get(id: string): Promise<Invoice | null> {
    return one("SELECT * FROM invoices WHERE id = $1", [id], mapInvoice);
  },
  async create(v: Partial<Invoice>): Promise<Invoice> {
    const id = v.id || genId("INV");
    await query(
      `INSERT INTO invoices (id, customer, order_id, status, issued_date, due_date, amount) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, v.customer ?? "", v.orderId ?? null, v.status ?? "Draft",
        v.issuedDate ?? new Date().toISOString().slice(0, 10), v.dueDate ?? new Date().toISOString().slice(0, 10), v.amount ?? 0],
    );
    return (await this.get(id))!;
  },
  async update(id: string, v: Partial<Invoice>): Promise<Invoice | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...v };
    await query(
      `UPDATE invoices SET customer=$1, order_id=$2, status=$3, issued_date=$4, due_date=$5, amount=$6 WHERE id=$7`,
      [m.customer, m.orderId ?? null, m.status, m.issuedDate, m.dueDate, m.amount, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM invoices WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- QC Inspections ----------
function mapQc(r: Row): QcInspection {
  return {
    id: r.id as string, product: r.product as string, sku: (r.sku as string) ?? undefined,
    supplier: r.supplier as string, inspector: (r.inspector as string) ?? undefined,
    status: r.status as QcInspection["status"], scheduledDate: r.scheduled_date as string,
    defectRate: (r.defect_rate as number) ?? undefined, sampleSize: (r.sample_size as number) ?? undefined,
  };
}
export const qcInspections = {
  async list(): Promise<QcInspection[]> {
    return (await query("SELECT * FROM qc_inspections ORDER BY scheduled_date DESC")).map(mapQc);
  },
  async get(id: string): Promise<QcInspection | null> {
    return one("SELECT * FROM qc_inspections WHERE id = $1", [id], mapQc);
  },
  async create(q: Partial<QcInspection>): Promise<QcInspection> {
    const id = q.id || genId("QC");
    await query(
      `INSERT INTO qc_inspections (id, product, sku, supplier, inspector, status, scheduled_date, defect_rate, sample_size)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, q.product ?? "", q.sku ?? null, q.supplier ?? "", q.inspector ?? null,
        q.status ?? "Scheduled", q.scheduledDate ?? new Date().toISOString().slice(0, 10), q.defectRate ?? null, q.sampleSize ?? null],
    );
    return (await this.get(id))!;
  },
  async update(id: string, q: Partial<QcInspection>): Promise<QcInspection | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...q };
    await query(
      `UPDATE qc_inspections SET product=$1, sku=$2, supplier=$3, inspector=$4, status=$5, scheduled_date=$6, defect_rate=$7, sample_size=$8 WHERE id=$9`,
      [m.product, m.sku ?? null, m.supplier, m.inspector ?? null, m.status, m.scheduledDate, m.defectRate ?? null, m.sampleSize ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM qc_inspections WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Users ----------
function mapUser(r: Row, includeHash = false): User {
  const u: User = {
    id: r.id as string, name: r.name as string, email: r.email as string,
    role: r.role as User["role"], status: r.status as User["status"],
    lastActive: (r.last_active as string) ?? undefined,
  };
  if (includeHash) u.passwordHash = r.password_hash as string;
  return u;
}
export const users = {
  async list(): Promise<User[]> {
    return (await query("SELECT * FROM users ORDER BY name")).map((r) => mapUser(r));
  },
  async get(id: string): Promise<User | null> {
    return one("SELECT * FROM users WHERE id = $1", [id], (r) => mapUser(r));
  },
  async findByEmail(email: string, includeHash = false): Promise<User | null> {
    return one("SELECT * FROM users WHERE email = $1", [email.toLowerCase()], (r) => mapUser(r, includeHash));
  },
  async create(u: Partial<User> & { passwordHash: string }): Promise<User> {
    const id = u.id || genId("USR");
    await query(
      `INSERT INTO users (id, name, email, role, status, password_hash, last_active) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, u.name ?? "", (u.email ?? "").toLowerCase(), u.role ?? "Viewer", u.status ?? "Active", u.passwordHash, u.lastActive ?? null],
    );
    return (await this.get(id))!;
  },
  // Editable profile fields only — never touches password_hash here.
  async update(id: string, u: Partial<User>): Promise<User | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...u };
    await query(
      `UPDATE users SET name=$1, email=$2, role=$3, status=$4, last_active=$5 WHERE id=$6`,
      [m.name, m.email.toLowerCase(), m.role, m.status, m.lastActive ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM users WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Submissions ----------
function mapSubmission(r: Row): Submission {
  return {
    id: r.id as string, type: r.type as Submission["type"], name: r.name as string,
    email: r.email as string, company: (r.company as string) ?? undefined,
    message: (r.message as string) ?? undefined, payload: (r.payload as string) ?? undefined,
    createdAt: r.created_at as string,
  };
}
export const submissions = {
  async list(): Promise<Submission[]> {
    return (await query("SELECT * FROM submissions ORDER BY created_at DESC")).map(mapSubmission);
  },
  async create(s: Partial<Submission>): Promise<Submission> {
    const id = s.id || genId("SUB");
    const createdAt = new Date().toISOString();
    await query(
      `INSERT INTO submissions (id, type, name, email, company, message, payload, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, s.type ?? "contact", s.name ?? "", s.email ?? "", s.company ?? null, s.message ?? null, s.payload ?? null, createdAt],
    );
    return (await one("SELECT * FROM submissions WHERE id = $1", [id], mapSubmission))!;
  },
};

// ---------- Warehouses ----------
function mapWarehouse(r: Row): Warehouse {
  return {
    id: r.id as string, name: r.name as string, code: r.code as string,
    location: (r.location as string) ?? undefined, city: (r.city as string) ?? undefined,
    country: (r.country as string) ?? undefined, type: (r.type as string) ?? undefined,
    manager: (r.manager as string) ?? undefined, capacity: r.capacity as number,
    isDefault: Boolean(r.is_default), status: r.status as Warehouse["status"],
  };
}
export const warehouses = {
  async list(): Promise<Warehouse[]> {
    return (await query("SELECT * FROM warehouses ORDER BY is_default DESC, name")).map(mapWarehouse);
  },
  async get(id: string): Promise<Warehouse | null> {
    return one("SELECT * FROM warehouses WHERE id = $1", [id], mapWarehouse);
  },
  async create(w: Partial<Warehouse>): Promise<Warehouse> {
    const id = w.id || genId("WH");
    await query(
      `INSERT INTO warehouses (id, name, code, location, city, country, type, manager, capacity, is_default, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, w.name ?? "", w.code ?? "", w.location ?? null, w.city ?? null, w.country ?? null,
        w.type ?? null, w.manager ?? null, w.capacity ?? 0, w.isDefault ?? false, w.status ?? "Active"],
    );
    return (await this.get(id))!;
  },
  async update(id: string, w: Partial<Warehouse>): Promise<Warehouse | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...w };
    await query(
      `UPDATE warehouses SET name=$1, code=$2, location=$3, city=$4, country=$5, type=$6, manager=$7, capacity=$8, is_default=$9, status=$10 WHERE id=$11`,
      [m.name, m.code, m.location ?? null, m.city ?? null, m.country ?? null, m.type ?? null,
        m.manager ?? null, m.capacity, m.isDefault, m.status, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM warehouses WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Storage Types ----------
function mapStorageType(r: Row): StorageType {
  return {
    id: r.id as string, code: r.code as string, name: r.name as string,
    description: (r.description as string) ?? undefined, suitableFor: (r.suitable_for as string) ?? undefined,
    utilization: r.utilization as number, status: r.status as StorageType["status"],
  };
}
export const storageTypes = {
  async list(): Promise<StorageType[]> {
    return (await query("SELECT * FROM storage_types ORDER BY code")).map(mapStorageType);
  },
  async get(id: string): Promise<StorageType | null> {
    return one("SELECT * FROM storage_types WHERE id = $1", [id], mapStorageType);
  },
  async create(s: Partial<StorageType>): Promise<StorageType> {
    const id = s.id || genId("ST");
    await query(
      `INSERT INTO storage_types (id, code, name, description, suitable_for, utilization, status) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, (s.code ?? "").toUpperCase(), s.name ?? "", s.description ?? null, s.suitableFor ?? "General",
        s.utilization ?? 0, s.status ?? "Active"],
    );
    return (await this.get(id))!;
  },
  async update(id: string, s: Partial<StorageType>): Promise<StorageType | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...s };
    await query(
      `UPDATE storage_types SET code=$1, name=$2, description=$3, suitable_for=$4, utilization=$5, status=$6 WHERE id=$7`,
      [m.code, m.name, m.description ?? null, m.suitableFor, m.utilization, m.status, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM storage_types WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Transfer Orders ----------
function mapTransfer(r: Row): TransferOrder {
  return {
    id: r.id as string, reference: (r.reference as string) ?? undefined,
    fromWarehouse: r.from_warehouse as string, toWarehouse: r.to_warehouse as string,
    itemCount: r.item_count as number, unitCount: r.unit_count as number,
    status: r.status as TransferOrder["status"], requestedDate: r.requested_date as string,
    eta: r.eta as string,
  };
}
export const transfers = {
  async list(): Promise<TransferOrder[]> {
    return (await query("SELECT * FROM transfer_orders ORDER BY requested_date DESC, id DESC")).map(mapTransfer);
  },
  async get(id: string): Promise<TransferOrder | null> {
    return one("SELECT * FROM transfer_orders WHERE id = $1", [id], mapTransfer);
  },
  async create(t: Partial<TransferOrder>): Promise<TransferOrder> {
    const id = t.id || genId("TR");
    await query(
      `INSERT INTO transfer_orders (id, reference, from_warehouse, to_warehouse, item_count, unit_count, status, requested_date, eta) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, t.reference ?? null, t.fromWarehouse ?? "", t.toWarehouse ?? "", t.itemCount ?? 0,
        t.unitCount ?? 0, t.status ?? "Pending", t.requestedDate ?? new Date().toISOString().slice(0, 10),
        t.eta ?? new Date().toISOString().slice(0, 10)],
    );
    return (await this.get(id))!;
  },
  async update(id: string, t: Partial<TransferOrder>): Promise<TransferOrder | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...t };
    await query(
      `UPDATE transfer_orders SET reference=$1, from_warehouse=$2, to_warehouse=$3, item_count=$4, unit_count=$5, status=$6, eta=$7 WHERE id=$8`,
      [m.reference ?? null, m.fromWarehouse, m.toWarehouse, m.itemCount, m.unitCount, m.status, m.eta, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM transfer_orders WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Cycle Counts ----------
function mapCycleCount(r: Row): CycleCount {
  return {
    id: r.id as string, name: r.name as string, countType: (r.count_type as string) ?? undefined,
    warehouse: r.warehouse as string, status: r.status as CycleCount["status"],
    progress: r.progress as number, startDate: r.start_date as string, dueDate: r.due_date as string,
  };
}
export const cycleCounts = {
  async list(): Promise<CycleCount[]> {
    return (await query("SELECT * FROM cycle_counts ORDER BY start_date DESC, id DESC")).map(mapCycleCount);
  },
  async get(id: string): Promise<CycleCount | null> {
    return one("SELECT * FROM cycle_counts WHERE id = $1", [id], mapCycleCount);
  },
  async create(c: Partial<CycleCount>): Promise<CycleCount> {
    const id = c.id || genId("CC");
    await query(
      `INSERT INTO cycle_counts (id, name, count_type, warehouse, status, progress, start_date, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, c.name ?? "", c.countType ?? "Routine Cycle Count", c.warehouse ?? "", c.status ?? "Scheduled",
        c.progress ?? 0, c.startDate ?? new Date().toISOString().slice(0, 10),
        c.dueDate ?? new Date().toISOString().slice(0, 10)],
    );
    return (await this.get(id))!;
  },
  async update(id: string, c: Partial<CycleCount>): Promise<CycleCount | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...c };
    await query(
      `UPDATE cycle_counts SET name=$1, count_type=$2, warehouse=$3, status=$4, progress=$5, due_date=$6 WHERE id=$7`,
      [m.name, m.countType, m.warehouse, m.status, m.progress, m.dueDate, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM cycle_counts WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Notifications ----------
function mapNotification(r: Row): AppNotification {
  return {
    id: r.id as string, type: r.type as AppNotification["type"], title: r.title as string,
    description: (r.description as string) ?? undefined, read: Boolean(r.read),
    createdAt: r.created_at as string, link: (r.link as string) ?? undefined,
  };
}
export const notifications = {
  async list(): Promise<AppNotification[]> {
    return (await query("SELECT * FROM notifications ORDER BY created_at DESC, id DESC")).map(mapNotification);
  },
  async get(id: string): Promise<AppNotification | null> {
    return one("SELECT * FROM notifications WHERE id = $1", [id], mapNotification);
  },
  async create(n: Partial<AppNotification>): Promise<AppNotification> {
    const id = n.id || genId("NTF");
    await query(
      `INSERT INTO notifications (id, type, title, description, read, created_at, link) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, n.type ?? "system", n.title ?? "", n.description ?? null, n.read ?? false,
        n.createdAt ?? new Date().toISOString(), n.link ?? null],
    );
    return (await this.get(id))!;
  },
  async update(id: string, n: Partial<AppNotification>): Promise<AppNotification | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...n };
    await query(
      `UPDATE notifications SET type=$1, title=$2, description=$3, read=$4, link=$5 WHERE id=$6`,
      [m.type, m.title, m.description ?? null, m.read, m.link ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM notifications WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Tasks ----------
function mapTask(r: Row): Task {
  return {
    id: r.id as string, title: r.title as string, taskType: (r.task_type as string) ?? undefined,
    warehouse: (r.warehouse as string) ?? undefined, assignee: (r.assignee as string) ?? undefined,
    priority: r.priority as Task["priority"], status: r.status as Task["status"],
    createdAt: r.created_at as string, dueDate: (r.due_date as string) ?? undefined,
    reference: (r.reference as string) ?? undefined,
  };
}
export const tasks = {
  async list(): Promise<Task[]> {
    return (await query("SELECT * FROM tasks ORDER BY created_at DESC, id DESC")).map(mapTask);
  },
  async get(id: string): Promise<Task | null> {
    return one("SELECT * FROM tasks WHERE id = $1", [id], mapTask);
  },
  async create(t: Partial<Task>): Promise<Task> {
    const id = t.id || genId("TSK");
    await query(
      `INSERT INTO tasks (id, title, task_type, warehouse, assignee, priority, status, created_at, due_date, reference) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, t.title ?? "", t.taskType ?? "General", t.warehouse ?? null, t.assignee ?? null,
        t.priority ?? "Medium", t.status ?? "Pending", t.createdAt ?? new Date().toISOString().slice(0, 10),
        t.dueDate ?? null, t.reference ?? null],
    );
    return (await this.get(id))!;
  },
  async update(id: string, t: Partial<Task>): Promise<Task | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...t };
    await query(
      `UPDATE tasks SET title=$1, task_type=$2, warehouse=$3, assignee=$4, priority=$5, status=$6, due_date=$7 WHERE id=$8`,
      [m.title, m.taskType, m.warehouse ?? null, m.assignee ?? null, m.priority, m.status, m.dueDate ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM tasks WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Warehouse Locations ----------
function mapLocation(r: Row): WarehouseLocation {
  return {
    id: r.id as string, code: r.code as string, name: r.name as string,
    warehouse: r.warehouse as string, type: (r.type as string) ?? undefined,
    capacity: r.capacity as number, status: r.status as WarehouseLocation["status"],
  };
}
export const locations = {
  async list(): Promise<WarehouseLocation[]> {
    return (await query("SELECT * FROM warehouse_locations ORDER BY code")).map(mapLocation);
  },
  async get(id: string): Promise<WarehouseLocation | null> {
    return one("SELECT * FROM warehouse_locations WHERE id = $1", [id], mapLocation);
  },
  async create(l: Partial<WarehouseLocation>): Promise<WarehouseLocation> {
    const id = l.id || genId("LOC");
    await query(
      `INSERT INTO warehouse_locations (id, code, name, warehouse, type, capacity, status) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, (l.code ?? "").toUpperCase(), l.name ?? "", l.warehouse ?? "", l.type ?? "Bin",
        l.capacity ?? 0, l.status ?? "Active"],
    );
    return (await this.get(id))!;
  },
  async update(id: string, l: Partial<WarehouseLocation>): Promise<WarehouseLocation | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...l };
    await query(
      `UPDATE warehouse_locations SET code=$1, name=$2, warehouse=$3, type=$4, capacity=$5, status=$6 WHERE id=$7`,
      [m.code, m.name, m.warehouse, m.type, m.capacity, m.status, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM warehouse_locations WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- API keys ----------
function mapApiKey(r: Row): ApiKey {
  return {
    id: r.id as string,
    name: r.name as string,
    env: (r.env as string) ?? "Production",
    prefix: r.prefix as string,
    scopes: r.scopes ? JSON.parse(r.scopes as string) : [],
    createdAt: r.created_at as string,
    lastUsed: (r.last_used as string) ?? undefined,
    status: r.status as ApiKey["status"],
  };
}
export const apiKeys = {
  async list(): Promise<ApiKey[]> {
    return (await query("SELECT * FROM api_keys ORDER BY created_at DESC, id DESC")).map(mapApiKey);
  },
  async get(id: string): Promise<ApiKey | null> {
    return one("SELECT * FROM api_keys WHERE id = $1", [id], mapApiKey);
  },
  async create(k: Partial<ApiKey>): Promise<ApiKey> {
    const id = k.id || genId("KEY");
    await query(
      `INSERT INTO api_keys (id, name, env, prefix, scopes, created_at, last_used, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, k.name ?? "", k.env ?? "Production", k.prefix ?? "", JSON.stringify(k.scopes ?? []),
        k.createdAt ?? new Date().toISOString(), k.lastUsed ?? null, k.status ?? "Active"],
    );
    return (await this.get(id))!;
  },
  async update(id: string, k: Partial<ApiKey>): Promise<ApiKey | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...k };
    await query(
      `UPDATE api_keys SET name=$1, env=$2, prefix=$3, scopes=$4, last_used=$5, status=$6 WHERE id=$7`,
      [m.name, m.env, m.prefix, JSON.stringify(m.scopes), m.lastUsed ?? null, m.status, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM api_keys WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Settings (key/value store) ----------
// Not a standard entity collection: exposes getAll / setMany so the whole
// settings object round-trips in one request.
export const settings = {
  async getAll(): Promise<Record<string, unknown>> {
    const rows = await query("SELECT key, value FROM settings");
    const out: Record<string, unknown> = {};
    for (const r of rows) {
      try {
        out[r.key as string] = JSON.parse(r.value as string);
      } catch {
        out[r.key as string] = r.value;
      }
    }
    return out;
  },
  async get(key: string): Promise<unknown> {
    const rows = await query("SELECT value FROM settings WHERE key = $1", [key]);
    if (!rows[0]) return undefined;
    try {
      return JSON.parse(rows[0].value as string);
    } catch {
      return rows[0].value;
    }
  },
  async setMany(values: Record<string, unknown>): Promise<Record<string, unknown>> {
    for (const [key, value] of Object.entries(values)) {
      await query(
        `INSERT INTO settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, JSON.stringify(value)],
      );
    }
    return this.getAll();
  },
};

// ---------- Audit log (append-only) ----------
function mapAuditLog(r: Row): AuditLog {
  return {
    id: r.id as string,
    actor: r.actor as string,
    action: r.action as string,
    target: (r.target as string) ?? undefined,
    category: r.category as string,
    ip: (r.ip as string) ?? undefined,
    status: r.status as AuditLog["status"],
    createdAt: r.created_at as string,
  };
}
export const auditLogs = {
  async list(): Promise<AuditLog[]> {
    return (await query("SELECT * FROM audit_logs ORDER BY created_at DESC, id DESC")).map(mapAuditLog);
  },
  async get(id: string): Promise<AuditLog | null> {
    return one("SELECT * FROM audit_logs WHERE id = $1", [id], mapAuditLog);
  },
  async create(l: Partial<AuditLog>): Promise<AuditLog> {
    const id = l.id || genId("LOG");
    await query(
      `INSERT INTO audit_logs (id, actor, action, target, category, ip, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, l.actor ?? "system", l.action ?? "", l.target ?? null, l.category ?? "system",
        l.ip ?? null, l.status ?? "Success", l.createdAt ?? new Date().toISOString()],
    );
    return (await this.get(id))!;
  },
};

// ---------- Documents ----------
function mapDocument(r: Row): DocumentRecord {
  return {
    id: r.id as string,
    name: r.name as string,
    type: r.type as string,
    category: (r.category as string) ?? undefined,
    size: r.size as string,
    owner: r.owner as string,
    status: r.status as DocumentRecord["status"],
    url: (r.url as string) ?? undefined,
    updatedAt: r.updated_at as string,
  };
}
export const documents = {
  async list(): Promise<DocumentRecord[]> {
    return (await query("SELECT * FROM documents ORDER BY updated_at DESC, id DESC")).map(mapDocument);
  },
  async get(id: string): Promise<DocumentRecord | null> {
    return one("SELECT * FROM documents WHERE id = $1", [id], mapDocument);
  },
  async create(d: Partial<DocumentRecord>): Promise<DocumentRecord> {
    const id = d.id || genId("DOC");
    await query(
      `INSERT INTO documents (id, name, type, category, size, owner, status, url, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, d.name ?? "", d.type ?? "Other", d.category ?? null, d.size ?? "0 KB",
        d.owner ?? "Unknown", d.status ?? "Active", d.url ?? null,
        d.updatedAt ?? new Date().toISOString().slice(0, 10)],
    );
    return (await this.get(id))!;
  },
  async update(id: string, d: Partial<DocumentRecord>): Promise<DocumentRecord | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...d };
    await query(
      `UPDATE documents SET name=$1, type=$2, category=$3, size=$4, owner=$5, status=$6, url=$7, updated_at=$8 WHERE id=$9`,
      [m.name, m.type, m.category ?? null, m.size, m.owner, m.status, m.url ?? null,
        m.updatedAt ?? new Date().toISOString().slice(0, 10), id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM documents WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Messages ----------
function mapMessage(r: Row): Message {
  return {
    id: r.id as string,
    sender: r.sender as string,
    subject: r.subject as string,
    preview: (r.preview as string) ?? "",
    channel: r.channel as string,
    status: r.status as Message["status"],
    createdAt: r.created_at as string,
  };
}
export const messages = {
  async list(): Promise<Message[]> {
    return (await query("SELECT * FROM messages ORDER BY created_at DESC, id DESC")).map(mapMessage);
  },
  async get(id: string): Promise<Message | null> {
    return one("SELECT * FROM messages WHERE id = $1", [id], mapMessage);
  },
  async create(m: Partial<Message>): Promise<Message> {
    const id = m.id || genId("MSG");
    await query(
      `INSERT INTO messages (id, sender, subject, preview, channel, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, m.sender ?? "", m.subject ?? "", m.preview ?? "", m.channel ?? "Email",
        m.status ?? "Unread", m.createdAt ?? new Date().toISOString()],
    );
    return (await this.get(id))!;
  },
  async update(id: string, m: Partial<Message>): Promise<Message | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const x = { ...existing, ...m };
    await query(
      `UPDATE messages SET sender=$1, subject=$2, preview=$3, channel=$4, status=$5 WHERE id=$6`,
      [x.sender, x.subject, x.preview, x.channel, x.status, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM messages WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};

// ---------- Integrations ----------
function mapIntegration(r: Row): IntegrationRecord {
  return {
    id: r.id as string,
    name: r.name as string,
    category: r.category as string,
    status: r.status as IntegrationRecord["status"],
    description: (r.description as string) ?? undefined,
    lastSync: (r.last_sync as string) ?? undefined,
  };
}
export const integrations = {
  async list(): Promise<IntegrationRecord[]> {
    return (await query("SELECT * FROM integrations ORDER BY name")).map(mapIntegration);
  },
  async get(id: string): Promise<IntegrationRecord | null> {
    return one("SELECT * FROM integrations WHERE id = $1", [id], mapIntegration);
  },
  async create(i: Partial<IntegrationRecord>): Promise<IntegrationRecord> {
    const id = i.id || genId("INT");
    await query(
      `INSERT INTO integrations (id, name, category, status, description, last_sync)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, i.name ?? "", i.category ?? "Ecommerce", i.status ?? "Available",
        i.description ?? null, i.lastSync ?? null],
    );
    return (await this.get(id))!;
  },
  async update(id: string, i: Partial<IntegrationRecord>): Promise<IntegrationRecord | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...i };
    await query(
      `UPDATE integrations SET name=$1, category=$2, status=$3, description=$4, last_sync=$5 WHERE id=$6`,
      [m.name, m.category, m.status, m.description ?? null, m.lastSync ?? null, id],
    );
    return this.get(id);
  },
  async remove(id: string): Promise<boolean> {
    return (await query("DELETE FROM integrations WHERE id = $1 RETURNING id", [id])).length > 0;
  },
};
