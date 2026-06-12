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
