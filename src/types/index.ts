// Shared domain types for FulfillMesh.
// These are the single source of truth used across the data layer (repositories),
// the REST API (route handlers) and the UI (server + client components).

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export type ShipmentStatus =
  | "Awaiting Pickup"
  | "In Transit"
  | "Customs"
  | "Out for Delivery"
  | "Delivered"
  | "Exception";

export type ReturnStatus =
  | "Requested"
  | "Approved"
  | "In Transit"
  | "Received"
  | "Refunded"
  | "Rejected";

export type QuoteStatus = "Draft" | "Sent" | "Accepted" | "Declined" | "Expired";

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue" | "Void";

export type QcStatus = "Scheduled" | "In Progress" | "Passed" | "Failed" | "On Hold";

export type SupplierStatus = "Active" | "Pending" | "Suspended";

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Backordered";

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customer: string;
  customerId?: string;
  status: OrderStatus;
  date: string; // ISO date
  total: number;
  channel?: string;
  destination?: string;
  items?: OrderItem[];
  trackingNumber?: string;
  notes?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost?: number;
  stock: number;
  status: StockStatus;
  supplier?: string;
  image?: string;
  description?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  warehouse: string;
  location?: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  status: StockStatus;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  country?: string;
  orders: number;
  totalSpent: number;
  status: "Active" | "Inactive" | "Lead";
  joinedDate?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  country: string;
  category?: string;
  rating: number;
  status: SupplierStatus;
  leadTimeDays?: number;
  productsSupplied?: number;
  // Scorecard metrics (supplier detail page)
  onTimePct?: number; // 0-100
  avgResponseHours?: number;
}

export interface Shipment {
  id: string;
  orderId?: string;
  carrier: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  shippedDate?: string;
  estimatedDelivery?: string;
  weight?: string;
}

export interface ReturnRecord {
  id: string;
  orderId: string;
  customer: string;
  reason: string;
  status: ReturnStatus;
  requestedDate: string;
  items: number;
  refundAmount?: number;
  // Cost breakdown (return detail page)
  shippingCost?: number;
  restockingFee?: number;
  recoveryValue?: number;
}

export interface Quote {
  id: string;
  customer: string;
  customerId?: string;
  status: QuoteStatus;
  createdDate: string;
  validUntil?: string;
  total: number;
  items?: OrderItem[];
}

export interface Invoice {
  id: string;
  customer: string;
  orderId?: string;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  amount: number;
}

export type QcCheckResult = "Pass" | "Fail" | "N/A";

export interface QcChecklistItem {
  label: string;
  result: QcCheckResult;
  notes?: string;
}

export interface QcInspection {
  id: string;
  product: string;
  sku?: string;
  supplier: string;
  inspector?: string;
  status: QcStatus;
  scheduledDate: string;
  defectRate?: number;
  sampleSize?: number;
  checklist?: QcChecklistItem[];
}

export type UserRole = "Admin" | "Manager" | "Operator" | "Viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Invited" | "Suspended";
  lastActive?: string;
  // never serialized to the client:
  passwordHash?: string;
}

export type SubmissionType = "contact" | "demo";

export interface Submission {
  id: string;
  type: SubmissionType;
  name: string;
  email: string;
  company?: string;
  message?: string;
  payload?: string; // JSON blob of the full form
  createdAt: string;
}

// Generic list response shape used by the REST API.
export interface ListResponse<T> {
  data: T[];
  total: number;
}

// ---------- API keys ----------

export type ApiKeyStatus = "Active" | "Inactive";

export interface ApiKey {
  id: string;
  name: string;
  env: string; // Production | Staging | Development
  prefix: string; // masked display value, e.g. "fm_prod_k8x2…m9Rq"
  scopes: string[]; // permission scopes
  createdAt: string;
  lastUsed?: string;
  status: ApiKeyStatus;
}

// ---------- Attachments (uploaded files, stored as data URLs) ----------

// Files are stored inline as base64 data URLs (no external object storage in
// this environment). Keep uploads small (images/PDFs); callers cap the size.
export interface Attachment {
  id: string;
  entityType: string; // "return" | "qc" | "order" | "product" | ...
  entityId: string;
  name: string;
  mime: string;
  dataUrl: string; // data:<mime>;base64,....
  size: number; // bytes
  uploadedBy?: string;
  createdAt: string;
}

// ---------- Inventory movements (stock ledger) ----------

export type MovementType = "Inbound" | "Outbound" | "Adjustment";

export interface InventoryMovement {
  id: string;
  sku: string;
  name?: string;
  warehouse?: string;
  type: MovementType;
  quantity: number; // signed: positive in, negative out
  reason?: string;
  reference?: string;
  date: string;
}

// ---------- Quote supplier bids (multi-supplier comparison) ----------

export interface QuoteBid {
  id: string;
  quoteId: string;
  supplier: string;
  unitPrice: number;
  leadTimeDays: number;
  moq: number; // minimum order quantity
  landedCost: number;
  recommended: boolean;
  notes?: string;
}

// ---------- Auth tokens (password reset / email verification) ----------

export type AuthTokenKind = "reset" | "verify";

export interface AuthToken {
  id: string;
  userId: string;
  kind: AuthTokenKind;
  token: string;
  expiresAt: string; // ISO
  used: boolean;
  createdAt: string;
}

// ---------- Settings (key/value store) ----------

// Each row is a single setting. `value` is a JSON-encoded blob so a setting can
// hold a string, number, boolean or nested object.
export interface AppSetting {
  key: string;
  value: string; // JSON string
}

// ---------- Audit log (append-only) ----------

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target?: string;
  category: string; // auth | data | billing | security | system | api
  ip?: string;
  status: "Success" | "Failed" | "Warning";
  createdAt: string;
}

// ---------- Documents ----------

export type DocumentStatus = "Active" | "Archived" | "Draft";

export interface DocumentRecord {
  id: string;
  name: string;
  type: string; // PDF | Invoice | Contract | Label | Report | Image | Other
  category?: string;
  size: string; // human-readable, e.g. "2.4 MB"
  owner: string;
  status: DocumentStatus;
  url?: string;
  updatedAt: string;
}

// ---------- Messages ----------

export type MessageStatus = "Unread" | "Read" | "Archived";

export interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  channel: string; // Email | Chat | System | Support
  status: MessageStatus;
  createdAt: string;
}

// ---------- Integrations ----------

export type IntegrationStatus = "Connected" | "Available" | "Error";

export interface IntegrationRecord {
  id: string;
  name: string;
  category: string; // Ecommerce | Marketplace | Shipping | Accounting | Marketing
  status: IntegrationStatus;
  description?: string;
  lastSync?: string;
}

// ---------- Warehouse management ----------

export type WarehouseStatus = "Active" | "Paused" | "Inactive";

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location?: string;
  city?: string;
  country?: string;
  type?: string;
  manager?: string;
  capacity: number; // 0-100 percent utilization
  isDefault: boolean;
  status: WarehouseStatus;
}

export type StorageTypeStatus = "Active" | "Inactive";

export interface StorageType {
  id: string;
  code: string;
  name: string;
  description?: string;
  suitableFor?: string;
  utilization: number;
  status: StorageTypeStatus;
}

export type TransferStatus = "Pending" | "In Transit" | "Completed" | "Cancelled";

export interface TransferOrder {
  id: string;
  reference?: string;
  fromWarehouse: string;
  toWarehouse: string;
  itemCount: number;
  unitCount: number;
  status: TransferStatus;
  requestedDate: string;
  eta: string;
}

export type CycleCountStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled";

export interface CycleCount {
  id: string;
  name: string;
  countType?: string;
  warehouse: string;
  status: CycleCountStatus;
  progress: number;
  startDate: string;
  dueDate: string;
}

// ---------- Activity & collaboration ----------

export type NotificationType =
  | "order" | "shipment" | "inventory" | "return"
  | "billing" | "security" | "system" | "report";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export interface Task {
  id: string;
  title: string;
  taskType?: string;
  warehouse?: string;
  assignee?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  dueDate?: string;
  reference?: string;
}

// ---------- Warehouse locations ----------

export type LocationStatus = "Active" | "Inactive";

export interface WarehouseLocation {
  id: string;
  code: string;
  name: string;
  warehouse: string;
  type?: string;
  capacity: number; // 0-100 percent utilization
  status: LocationStatus;
}
