import { query } from "./db";
import type {
  Order, Product, InventoryItem, Customer, Supplier, Shipment,
  ReturnRecord, Quote, Invoice, QcInspection, User, Submission,
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
