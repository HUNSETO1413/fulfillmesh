"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronDown, Pencil, Truck } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

const STATUSES: OrderStatus[] = ["Pending", "Processing", "In Transit", "Delivered", "Cancelled"];
const CHANNELS = ["Shopify", "Amazon", "Direct", "TikTok Shop"];

export default function OrderDetailActions({ order }: { order: Order }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const [draft, setDraft] = useState({
    customer: order.customer,
    status: order.status,
    channel: order.channel ?? "Shopify",
    date: order.date,
    total: String(order.total),
    destination: order.destination ?? "",
  });

  async function saveEdit() {
    if (!draft.customer.trim()) { toast("Customer is required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/orders/${order.id}`, {
        customer: draft.customer.trim(),
        status: draft.status,
        channel: draft.channel,
        date: draft.date,
        total: Number(draft.total) || 0,
        destination: draft.destination.trim() || undefined,
      });
      toast(`Order ${order.id} updated`);
      setEditOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update order", "error");
    } finally { setBusy(false); }
  }

  async function cancelOrder() {
    setBusy(true);
    try {
      await api.put(`/api/orders/${order.id}`, { status: "Cancelled" });
      toast(`Order ${order.id} cancelled`);
      setConfirmCancel(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not cancel order", "error");
    } finally { setBusy(false); }
  }

  async function createShipment() {
    setBusy(true);
    try {
      const ship = await api.post<{ id: string }>("/api/shipments", {
        orderId: order.id,
        carrier: "DHL Express",
        trackingNumber: order.trackingNumber || `1Z${order.id}`,
        origin: "Shenzhen, CN",
        destination: order.destination || "United States",
        status: "Awaiting Pickup",
      });
      toast(`Shipment ${ship.id} created for ${order.id}`);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not create shipment", "error");
    } finally { setBusy(false); }
  }

  return (
    <div className="flex items-center gap-3">
      <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <Calendar className="w-4 h-4" /> {order.date} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setEditOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#3B82F6] rounded-lg text-[13px] font-medium text-[#3B82F6] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#EFF6FF] transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" /> Edit Order
      </button>
      <button
        onClick={() => setConfirmCancel(true)}
        disabled={order.status === "Cancelled"}
        className="px-3.5 py-2 bg-white border border-[#EF4444] rounded-lg text-[13px] font-medium text-[#EF4444] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#FEF2F2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Cancel Order
      </button>
      <button
        onClick={createShipment}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors disabled:opacity-60"
      >
        <Truck className="w-4 h-4" /> Create Shipment
      </button>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit ${order.id}`}
        description="Update the order details below."
        footer={
          <>
            <SecondaryButton onClick={() => setEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Customer" required>
              <TextInput value={draft.customer} onChange={(e) => setDraft({ ...draft, customer: e.target.value })} />
            </Field>
          </div>
          <Field label="Status">
            <Select options={STATUSES} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as OrderStatus })} />
          </Field>
          <Field label="Channel">
            <Select options={CHANNELS} value={draft.channel} onChange={(e) => setDraft({ ...draft, channel: e.target.value })} />
          </Field>
          <Field label="Order date">
            <TextInput type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
          </Field>
          <Field label="Total (USD)">
            <NumberInput value={draft.total} onChange={(e) => setDraft({ ...draft, total: e.target.value })} step="0.01" min="0" />
          </Field>
          <div className="col-span-2">
            <Field label="Destination">
              <TextInput value={draft.destination} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={cancelOrder}
        title="Cancel order"
        message={`Mark ${order.id} as cancelled? You can change the status again later.`}
        confirmLabel="Cancel order"
        destructive
        loading={busy}
      />
    </div>
  );
}
