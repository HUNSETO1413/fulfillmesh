import { getDb } from "./db";
import type {
  Order, Product, InventoryItem, Customer, Supplier, Shipment,
  ReturnRecord, Quote, Invoice, QcInspection, User, Submission,
} from "@/types";

// Thin repository layer over the SQLite tables. Each entity exposes list/get/
// create/update/remove. Rows are mapped from snake_case columns to the
// camelCase domain types defined in `@/types`.

function genId(prefix: string): string {
  // Deterministic-enough unique id without Math.random (counter + time-ish).
  const n = Date.now().toString(36) + Math.floor(performance.now()).toString(36);
  return `${prefix}-${n}`.toUpperCase();
}

// ---------- Orders ----------
type OrderRow = Record<string, unknown>;
function mapOrder(r: OrderRow): Order {
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
  list(): Order[] {
    return getDb().prepare("SELECT * FROM orders ORDER BY date DESC, id DESC").all().map(mapOrder);
  },
  get(id: string): Order | null {
    const r = getDb().prepare("SELECT * FROM orders WHERE id = ?").get(id);
    return r ? mapOrder(r) : null;
  },
  create(o: Partial<Order>): Order {
    const id = o.id || genId("ORD");
    getDb().prepare(
      `INSERT INTO orders (id, customer, customer_id, status, date, total, channel, destination, items, tracking_number, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, o.customer ?? "", o.customerId ?? null, o.status ?? "Pending",
      o.date ?? new Date().toISOString().slice(0, 10), o.total ?? 0, o.channel ?? null,
      o.destination ?? null, o.items ? JSON.stringify(o.items) : null,
      o.trackingNumber ?? null, o.notes ?? null);
    return this.get(id)!;
  },
  update(id: string, o: Partial<Order>): Order | null {
    const existing = this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...o };
    getDb().prepare(
      `UPDATE orders SET customer=?, customer_id=?, status=?, date=?, total=?, channel=?, destination=?, items=?, tracking_number=?, notes=? WHERE id=?`,
    ).run(m.customer, m.customerId ?? null, m.status, m.date, m.total, m.channel ?? null,
      m.destination ?? null, m.items ? JSON.stringify(m.items) : null, m.trackingNumber ?? null, m.notes ?? null, id);
    return this.get(id);
  },
  remove(id: string): boolean {
    return getDb().prepare("DELETE FROM orders WHERE id = ?").run(id).changes > 0;
  },
};

// ---------- Products ----------
function mapProduct(r: OrderRow): Product {
  return {
    id: r.id as string, sku: r.sku as string, name: r.name as string,
    category: r.category as string, price: r.price as number,
    cost: (r.cost as number) ?? undefined, stock: r.stock as number,
    status: r.status as Product["status"], supplier: (r.supplier as string) ?? undefined,
    image: (r.image as string) ?? undefined, description: (r.description as string) ?? undefined,
  };
}
export const products = {
  list(): Product[] {
    return getDb().prepare("SELECT * FROM products ORDER BY name").all().map(mapProduct);
  },
  get(id: string): Product | null {
    const r = getDb().prepare("SELECT * FROM products WHERE id = ?").get(id);
    return r ? mapProduct(r) : null;
  },
  create(p: Partial<Product>): Product {
    const id = p.id || genId("PRD");
    getDb().prepare(
      `INSERT INTO products (id, sku, name, category, price, cost, stock, status, supplier, image, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, p.sku ?? "", p.name ?? "", p.category ?? "General", p.price ?? 0, p.cost ?? null,
      p.stock ?? 0, p.status ?? "In Stock", p.supplier ?? null, p.image ?? null, p.description ?? null);
    return this.get(id)!;
  },
  update(id: string, p: Partial<Product>): Product | null {
    const existing = this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...p };
    getDb().prepare(
      `UPDATE products SET sku=?, name=?, category=?, price=?, cost=?, stock=?, status=?, supplier=?, image=?, description=? WHERE id=?`,
    ).run(m.sku, m.name, m.category, m.price, m.cost ?? null, m.stock, m.status, m.supplier ?? null,
      m.image ?? null, m.description ?? null, id);
    return this.get(id);
  },
  remove(id: string): boolean {
    return getDb().prepare("DELETE FROM products WHERE id = ?").run(id).changes > 0;
  },
};

// ---------- Inventory ----------
function mapInventory(r: OrderRow): InventoryItem {
  return {
    id: r.id as string, sku: r.sku as string, name: r.name as string,
    warehouse: r.warehouse as string, location: (r.location as string) ?? undefined,
    onHand: r.on_hand as number, reserved: r.reserved as number, available: r.available as number,
    reorderPoint: r.reorder_point as number, status: r.status as InventoryItem["status"],
  };
}
export const inventory = {
  list(): InventoryItem[] {
    return getDb().prepare("SELECT * FROM inventory ORDER BY name").all().map(mapInventory);
  },
  get(id: string): InventoryItem | null {
    const r = getDb().prepare("SELECT * FROM inventory WHERE id = ?").get(id);
    return r ? mapInventory(r) : null;
  },
  create(it: Partial<InventoryItem>): InventoryItem {
    const id = it.id || genId("INV");
    getDb().prepare(
      `INSERT INTO inventory (id, sku, name, warehouse, location, on_hand, reserved, available, reorder_point, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, it.sku ?? "", it.name ?? "", it.warehouse ?? "", it.location ?? null,
      it.onHand ?? 0, it.reserved ?? 0, it.available ?? 0, it.reorderPoint ?? 0, it.status ?? "In Stock");
    return this.get(id)!;
  },
  update(id: string, it: Partial<InventoryItem>): InventoryItem | null {
    const existing = this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...it };
    getDb().prepare(
      `UPDATE inventory SET sku=?, name=?, warehouse=?, location=?, on_hand=?, reserved=?, available=?, reorder_point=?, status=? WHERE id=?`,
    ).run(m.sku, m.name, m.warehouse, m.location ?? null, m.onHand, m.reserved, m.available, m.reorderPoint, m.status, id);
    return this.get(id);
  },
  remove(id: string): boolean {
    return getDb().prepare("DELETE FROM inventory WHERE id = ?").run(id).changes > 0;
  },
};

// ---------- Customers ----------
function mapCustomer(r: OrderRow): Customer {
  return {
    id: r.id as string, name: r.name as string, email: r.email as string,
    company: (r.company as string) ?? undefined, phone: (r.phone as string) ?? undefined,
    country: (r.country as string) ?? undefined, orders: r.orders as number,
    totalSpent: r.total_spent as number, status: r.status as Customer["status"],
    joinedDate: (r.joined_date as string) ?? undefined,
  };
}
export const customers = {
  list(): Customer[] {
    return getDb().prepare("SELECT * FROM customers ORDER BY name").all().map(mapCustomer);
  },
  get(id: string): Customer | null {
    const r = getDb().prepare("SELECT * FROM customers WHERE id = ?").get(id);
    return r ? mapCustomer(r) : null;
  },
  create(c: Partial<Customer>): Customer {
    const id = c.id || genId("CUS");
    getDb().prepare(
      `INSERT INTO customers (id, name, email, company, phone, country, orders, total_spent, status, joined_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, c.name ?? "", c.email ?? "", c.company ?? null, c.phone ?? null, c.country ?? null,
      c.orders ?? 0, c.totalSpent ?? 0, c.status ?? "Active", c.joinedDate ?? new Date().toISOString().slice(0, 10));
    return this.get(id)!;
  },
  update(id: string, c: Partial<Customer>): Customer | null {
    const existing = this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...c };
    getDb().prepare(
      `UPDATE customers SET name=?, email=?, company=?, phone=?, country=?, orders=?, total_spent=?, status=?, joined_date=? WHERE id=?`,
    ).run(m.name, m.email, m.company ?? null, m.phone ?? null, m.country ?? null, m.orders, m.totalSpent, m.status, m.joinedDate ?? null, id);
    return this.get(id);
  },
  remove(id: string): boolean {
    return getDb().prepare("DELETE FROM customers WHERE id = ?").run(id).changes > 0;
  },
};

// ---------- Suppliers ----------
function mapSupplier(r: OrderRow): Supplier {
  return {
    id: r.id as string, name: r.name as string, contact: (r.contact as string) ?? undefined,
    email: (r.email as string) ?? undefined, country: r.country as string,
    category: (r.category as string) ?? undefined, rating: r.rating as number,
    status: r.status as Supplier["status"], leadTimeDays: (r.lead_time_days as number) ?? undefined,
    productsSupplied: (r.products_supplied as number) ?? undefined,
  };
}
export const suppliers = {
  list(): Supplier[] {
    return getDb().prepare("SELECT * FROM suppliers ORDER BY name").all().map(mapSupplier);
  },
  get(id: string): Supplier | null {
    const r = getDb().prepare("SELECT * FROM suppliers WHERE id = ?").get(id);
    return r ? mapSupplier(r) : null;
  },
  create(s: Partial<Supplier>): Supplier {
    const id = s.id || genId("SUP");
    getDb().prepare(
      `INSERT INTO suppliers (id, name, contact, email, country, category, rating, status, lead_time_days, products_supplied)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, s.name ?? "", s.contact ?? null, s.email ?? null, s.country ?? "China", s.category ?? null,
      s.rating ?? 0, s.status ?? "Active", s.leadTimeDays ?? null, s.productsSupplied ?? null);
    return this.get(id)!;
  },
  update(id: string, s: Partial<Supplier>): Supplier | null {
    const existing = this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...s };
    getDb().prepare(
      `UPDATE suppliers SET name=?, contact=?, email=?, country=?, category=?, rating=?, status=?, lead_time_days=?, products_supplied=? WHERE id=?`,
    ).run(m.name, m.contact ?? null, m.email ?? null, m.country, m.category ?? null, m.rating, m.status, m.leadTimeDays ?? null, m.productsSupplied ?? null, id);
    return this.get(id);
  },
  remove(id: string): boolean {
    return getDb().prepare("DELETE FROM suppliers WHERE id = ?").run(id).changes > 0;
  },
};

// ---------- Shipments ----------
function mapShipment(r: OrderRow): Shipment {
  return {
    id: r.id as string, orderId: (r.order_id as string) ?? undefined, carrier: r.carrier as string,
    trackingNumber: r.tracking_number as string, origin: r.origin as string,
    destination: r.destination as string, status: r.status as Shipment["status"],
    shippedDate: (r.shipped_date as string) ?? undefined,
    estimatedDelivery: (r.estimated_delivery as string) ?? undefined, weight: (r.weight as string) ?? undefined,
  };
}
export const shipments = {
  list(): Shipment[] {
    return getDb().prepare("SELECT * FROM shipments ORDER BY id DESC").all().map(mapShipment);
  },
  get(id: string): Shipment | null {
    const r = getDb().prepare("SELECT * FROM shipments WHERE id = ?").get(id);
    return r ? mapShipment(r) : null;
  },
  create(s: Partial<Shipment>): Shipment {
    const id = s.id || genId("SHP");
    getDb().prepare(
      `INSERT INTO shipments (id, order_id, carrier, tracking_number, origin, destination, status, shipped_date, estimated_delivery, weight)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, s.orderId ?? null, s.carrier ?? "", s.trackingNumber ?? "", s.origin ?? "", s.destination ?? "",
      s.status ?? "Awaiting Pickup", s.shippedDate ?? null, s.estimatedDelivery ?? null, s.weight ?? null);
    return this.get(id)!;
  },
  update(id: string, s: Partial<Shipment>): Shipment | null {
    const existing = this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...s };
    getDb().prepare(
      `UPDATE shipments SET order_id=?, carrier=?, tracking_number=?, origin=?, destination=?, status=?, shipped_date=?, estimated_delivery=?, weight=? WHERE id=?`,
    ).run(m.orderId ?? null, m.carrier, m.trackingNumber, m.origin, m.destination, m.status, m.shippedDate ?? null, m.estimatedDelivery ?? null, m.weight ?? null, id);
    return this.get(id);
  },
  remove(id: string): boolean {
    return getDb().prepare("DELETE FROM shipments WHERE id = ?").run(id).changes > 0;
  },
};

// ---------- Returns ----------
function mapReturn(r: OrderRow): ReturnRecord {
  return {
    id: r.id as string, orderId: r.order_id as string, customer: r.customer as string,
    reason: r.reason as string, status: r.status as ReturnRecord["status"],
    requestedDate: r.requested_date as string, items: r.items as number,
    refundAmount: (r.refund_amount as number) ?? undefined,
  };
}
export const returns = {
  list(): ReturnRecord[] {
    return getDb().prepare("SELECT * FROM returns ORDER BY requested_date DESC").all().map(mapReturn);
  },
  get(id: string): ReturnRecord | null {
    const r = getDb().prepare("SELECT * FROM returns WHERE id = ?").get(id);
    return r ? mapReturn(r) : null;
  },
  create(r: Partial<ReturnRecord>): ReturnRecord {
    const id = r.id || genId("RET");
    getDb().prepare(
      `INSERT INTO returns (id, order_id, customer, reason, status, requested_date, items, refund_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, r.orderId ?? "", r.customer ?? "", r.reason ?? null, r.status ?? "Requested",
      r.requestedDate ?? new Date().toISOString().slice(0, 10), r.items ?? 1, r.refundAmount ?? null);
    return this.get(id)!;
  },
  update(id: string, r: Partial<ReturnRecord>): ReturnRecord | null {
    const existing = this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...r };
    getDb().prepare(
      `UPDATE returns SET order_id=?, customer=?, reason=?, status=?, requested_date=?, items=?, refund_amount=? WHERE id=?`,
    ).run(m.orderId, m.customer, m.reason, m.status, m.requestedDate, m.items, m.refundAmount ?? null, id);
    return this.get(id);
  },
  remove(id: string): boolean {
    return getDb().prepare("DELETE FROM returns WHERE id = ?").run(id).changes > 0;
  },
};

// ---------- Quotes ----------
function mapQuote(r: OrderRow): Quote {
  return {
    id: r.id as string, customer: r.customer as string, customerId: (r.customer_id as string) ?? undefined,
    status: r.status as Quote["status"], createdDate: r.created_date as string,
    validUntil: (r.valid_until as string) ?? undefined, total: r.total as number,
    items: r.items ? JSON.parse(r.items as string) : undefined,
  };
}
export const quotes = {
  list(): Quote[] {
    return getDb().prepare("SELECT * FROM quotes ORDER BY created_date DESC").all().map(mapQuote);
  },
  get(id: string): Quote | null {
    const r = getDb().prepare("SELECT * FROM quotes WHERE id = ?").get(id);
    return r ? mapQuote(r) : null;
  },
  create(q: Partial<Quote>): Quote {
    const id = q.id || genId("QUO");
    getDb().prepare(
      `INSERT INTO quotes (id, customer, customer_id, status, created_date, valid_until, total, items)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, q.customer ?? "", q.customerId ?? null, q.status ?? "Draft",
      q.createdDate ?? new Date().toISOString().slice(0, 10), q.validUntil ?? null, q.total ?? 0,
      q.items ? JSON.stringify(q.items) : null);
    return this.get(id)!;
  },
  update(id: string, q: Partial<Quote>): Quote | null {
    const existing = this.get(id);
    if (!existing) return null;
    const m = { ...existing, ...q };
    getDb().prepare(
      `UPDATE quotes SET customer=?, customer_id=?, status=?, created_date=?, valid_until=?, total=?, items=? WHERE id=?`,
    ).run(m.customer, m.customerId ?? null, m.status, m.createdDate, m.validUntil ?? null, m.total, m.items ? JSON.stringify(m.items) : null, id);
    return this.get(id);
  },
  remove(id: string): boolean {
    return getDb().prepare("DELETE FROM quotes WHERE id = ?").run(id).changes > 0;
  },
};

// ---------- Invoices ----------
function mapInvoice(r: OrderRow): Invoice {
  return {
    id: r.id as string, customer: r.customer as string, orderId: (r.order_id as string) ?? undefined,
    status: r.status as Invoice["status"], issuedDate: r.issued_date as string,
    dueDate: r.due_date as string, amount: r.amount as number,
  };
}
export const invoices = {
  list(): Invoice[] {
    return getDb().prepare("SELECT * FROM invoices ORDER BY issued_date DESC").all().map(mapInvoice);
  },
  get(id: string): Invoice | null {
    const r = getDb().prepare("SELECT * FROM invoices WHERE id = ?").get(id);
    return r ? mapInvoice(r) : null;
  },
  create(v: Partial<Invoice>): Invoice {
    const id = v.id || genId("INV");
    getDb().prepare(
      `INSERT INTO invoices (id, customer, order_id, status, issued_date, due_date, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, v.customer ?? "", v.orderId ?? null, v.status ?? "Draft",
      v.issuedDate ?? new Date().toISOString().slice(0, 10), v.dueDate ?? new Date().toISOString().slice(0, 10), v.amount ?? 0);
    return this.get(id)!;
  },
  remove(id: string): boolean {
    return getDb().prepare("DELETE FROM invoices WHERE id = ?").run(id).changes > 0;
  },
};

// ---------- QC Inspections ----------
function mapQc(r: OrderRow): QcInspection {
  return {
    id: r.id as string, product: r.product as string, sku: (r.sku as string) ?? undefined,
    supplier: r.supplier as string, inspector: (r.inspector as string) ?? undefined,
    status: r.status as QcInspection["status"], scheduledDate: r.scheduled_date as string,
    defectRate: (r.defect_rate as number) ?? undefined, sampleSize: (r.sample_size as number) ?? undefined,
  };
}
export const qcInspections = {
  list(): QcInspection[] {
    return getDb().prepare("SELECT * FROM qc_inspections ORDER BY scheduled_date DESC").all().map(mapQc);
  },
  get(id: string): QcInspection | null {
    const r = getDb().prepare("SELECT * FROM qc_inspections WHERE id = ?").get(id);
    return r ? mapQc(r) : null;
  },
  create(q: Partial<QcInspection>): QcInspection {
    const id = q.id || genId("QC");
    getDb().prepare(
      `INSERT INTO qc_inspections (id, product, sku, supplier, inspector, status, scheduled_date, defect_rate, sample_size)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, q.product ?? "", q.sku ?? null, q.supplier ?? "", q.inspector ?? null,
      q.status ?? "Scheduled", q.scheduledDate ?? new Date().toISOString().slice(0, 10), q.defectRate ?? null, q.sampleSize ?? null);
    return this.get(id)!;
  },
  remove(id: string): boolean {
    return getDb().prepare("DELETE FROM qc_inspections WHERE id = ?").run(id).changes > 0;
  },
};

// ---------- Users ----------
function mapUser(r: OrderRow, includeHash = false): User {
  const u: User = {
    id: r.id as string, name: r.name as string, email: r.email as string,
    role: r.role as User["role"], status: r.status as User["status"],
    lastActive: (r.last_active as string) ?? undefined,
  };
  if (includeHash) u.passwordHash = r.password_hash as string;
  return u;
}
export const users = {
  list(): User[] {
    return getDb().prepare("SELECT * FROM users ORDER BY name").all().map((r) => mapUser(r));
  },
  get(id: string): User | null {
    const r = getDb().prepare("SELECT * FROM users WHERE id = ?").get(id);
    return r ? mapUser(r) : null;
  },
  findByEmail(email: string, includeHash = false): User | null {
    const r = getDb().prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
    return r ? mapUser(r, includeHash) : null;
  },
  create(u: Partial<User> & { passwordHash: string }): User {
    const id = u.id || genId("USR");
    getDb().prepare(
      `INSERT INTO users (id, name, email, role, status, password_hash, last_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, u.name ?? "", (u.email ?? "").toLowerCase(), u.role ?? "Viewer", u.status ?? "Active", u.passwordHash, u.lastActive ?? null);
    return this.get(id)!;
  },
};

// ---------- Submissions ----------
function mapSubmission(r: OrderRow): Submission {
  return {
    id: r.id as string, type: r.type as Submission["type"], name: r.name as string,
    email: r.email as string, company: (r.company as string) ?? undefined,
    message: (r.message as string) ?? undefined, payload: (r.payload as string) ?? undefined,
    createdAt: r.created_at as string,
  };
}
export const submissions = {
  list(): Submission[] {
    return getDb().prepare("SELECT * FROM submissions ORDER BY created_at DESC").all().map(mapSubmission);
  },
  create(s: Partial<Submission>): Submission {
    const id = s.id || genId("SUB");
    const createdAt = new Date().toISOString();
    getDb().prepare(
      `INSERT INTO submissions (id, type, name, email, company, message, payload, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, s.type ?? "contact", s.name ?? "", s.email ?? "", s.company ?? null, s.message ?? null, s.payload ?? null, createdAt);
    return mapSubmission(getDb().prepare("SELECT * FROM submissions WHERE id = ?").get(id)!);
  },
};
