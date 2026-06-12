// Shared status pill used across every dashboard list/detail page. Centralises
// the status→color mapping that was previously duplicated inline on each page.

const STATUS_STYLES: Record<string, string> = {
  // Orders
  Delivered: "bg-[#10B981] text-white",
  "In Transit": "bg-[#0057D8] text-white",
  Processing: "bg-[#F59E0B] text-white",
  Pending: "bg-[#F59E0B] text-white",
  Cancelled: "bg-[#EF4444] text-white",
  // Shipments
  "Awaiting Pickup": "bg-[#64748B] text-white",
  Customs: "bg-[#8B5CF6] text-white",
  "Out for Delivery": "bg-[#0057D8] text-white",
  Exception: "bg-[#EF4444] text-white",
  // Returns
  Requested: "bg-[#F59E0B] text-white",
  Approved: "bg-[#10B981] text-white",
  Received: "bg-[#0057D8] text-white",
  Refunded: "bg-[#10B981] text-white",
  Rejected: "bg-[#EF4444] text-white",
  // Quotes / Invoices
  Draft: "bg-[#64748B] text-white",
  Sent: "bg-[#0057D8] text-white",
  Accepted: "bg-[#10B981] text-white",
  Declined: "bg-[#EF4444] text-white",
  Expired: "bg-[#94A3B8] text-white",
  Paid: "bg-[#10B981] text-white",
  Overdue: "bg-[#EF4444] text-white",
  Void: "bg-[#94A3B8] text-white",
  // QC
  Scheduled: "bg-[#64748B] text-white",
  "In Progress": "bg-[#F59E0B] text-white",
  Passed: "bg-[#10B981] text-white",
  Failed: "bg-[#EF4444] text-white",
  "On Hold": "bg-[#94A3B8] text-white",
  // Stock / generic
  "In Stock": "bg-[#10B981] text-white",
  "Low Stock": "bg-[#F59E0B] text-white",
  "Out of Stock": "bg-[#EF4444] text-white",
  Backordered: "bg-[#8B5CF6] text-white",
  // Customers / suppliers / users
  Active: "bg-[#10B981] text-white",
  Inactive: "bg-[#94A3B8] text-white",
  Lead: "bg-[#0057D8] text-white",
  Suspended: "bg-[#EF4444] text-white",
  Invited: "bg-[#F59E0B] text-white",
};

export function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const style = STATUS_STYLES[status] || "bg-[#64748B] text-white";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[12px] font-medium rounded-md ${style} ${className}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
