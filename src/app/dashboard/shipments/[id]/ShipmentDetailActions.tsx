"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ChevronRight, CheckCircle2 } from "lucide-react";
import type { Shipment, ShipmentStatus } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

const STATUSES: ShipmentStatus[] = [
  "Awaiting Pickup", "In Transit", "Customs", "Out for Delivery", "Delivered", "Exception",
];
const CARRIERS = ["FedEx", "UPS", "USPS", "DHL"];

// Linear progression of shipment statuses for the "advance" action.
const FLOW: ShipmentStatus[] = ["Awaiting Pickup", "In Transit", "Customs", "Out for Delivery", "Delivered"];

export default function ShipmentDetailActions({ shipment }: { shipment: Shipment }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [draft, setDraft] = useState({
    orderId: shipment.orderId ?? "",
    carrier: shipment.carrier,
    trackingNumber: shipment.trackingNumber,
    origin: shipment.origin,
    destination: shipment.destination,
    status: shipment.status,
    shippedDate: shipment.shippedDate ?? "",
    estimatedDelivery: shipment.estimatedDelivery ?? "",
    weight: shipment.weight ?? "",
  });

  const idx = FLOW.indexOf(shipment.status);
  const nextStatus = idx >= 0 && idx < FLOW.length - 1 ? FLOW[idx + 1] : null;

  async function advanceStatus() {
    if (!nextStatus) return;
    setBusy(true);
    try {
      await api.put(`/api/shipments/${shipment.id}`, { status: nextStatus });
      toast(`Shipment ${shipment.id} marked ${nextStatus}`);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update shipment", "error");
    } finally { setBusy(false); }
  }

  async function markException() {
    setBusy(true);
    try {
      await api.put(`/api/shipments/${shipment.id}`, { status: "Exception" });
      toast(`Shipment ${shipment.id} flagged as Exception`);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update shipment", "error");
    } finally { setBusy(false); }
  }

  async function saveEdit() {
    if (!draft.trackingNumber.trim()) { toast("Tracking number is required", "error"); return; }
    if (!draft.origin.trim() || !draft.destination.trim()) { toast("Origin and destination are required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/shipments/${shipment.id}`, {
        orderId: draft.orderId.trim() || undefined,
        carrier: draft.carrier,
        trackingNumber: draft.trackingNumber.trim(),
        origin: draft.origin.trim(),
        destination: draft.destination.trim(),
        status: draft.status,
        shippedDate: draft.shippedDate || undefined,
        estimatedDelivery: draft.estimatedDelivery || undefined,
        weight: draft.weight.trim() || undefined,
      });
      toast(`Shipment ${shipment.id} updated`);
      setEditOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update shipment", "error");
    } finally { setBusy(false); }
  }

  async function deleteShipment() {
    setBusy(true);
    try {
      await api.del(`/api/shipments/${shipment.id}`);
      toast(`Shipment ${shipment.id} deleted`);
      setConfirmDelete(false);
      router.push("/dashboard/shipments");
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete shipment", "error");
    } finally { setBusy(false); }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setEditOpen(true)}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#66758C] hover:bg-[#F7FAFC] transition-colors"
      >
        <Pencil className="w-4 h-4" /> Edit Shipment
      </button>
      <button
        onClick={markException}
        disabled={busy || shipment.status === "Exception"}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#EF4444] rounded-lg text-[13px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Report Issue
      </button>
      <button
        onClick={() => setConfirmDelete(true)}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#66758C] hover:bg-[#FEF2F2] hover:text-[#EF4444] hover:border-[#EF4444] transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
      {nextStatus ? (
        <button
          onClick={advanceStatus}
          disabled={busy}
          className="flex items-center gap-2 px-4 py-2 bg-[#0057D8] hover:bg-[#003B7A] rounded-lg text-[13px] font-medium text-white transition-colors disabled:opacity-60"
        >
          Mark {nextStatus} <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <span className="flex items-center gap-2 px-4 py-2 bg-[#00B894]/10 rounded-lg text-[13px] font-medium text-[#00B894]">
          <CheckCircle2 className="w-4 h-4" /> Delivered
        </span>
      )}

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit ${shipment.id}`}
        description="Update the shipment details below."
        footer={
          <>
            <SecondaryButton onClick={() => setEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Carrier">
            <Select options={CARRIERS} value={draft.carrier} onChange={(e) => setDraft({ ...draft, carrier: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select options={STATUSES} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ShipmentStatus })} />
          </Field>
          <div className="col-span-2">
            <Field label="Tracking number" required>
              <TextInput value={draft.trackingNumber} onChange={(e) => setDraft({ ...draft, trackingNumber: e.target.value })} />
            </Field>
          </div>
          <Field label="Origin" required>
            <TextInput value={draft.origin} onChange={(e) => setDraft({ ...draft, origin: e.target.value })} />
          </Field>
          <Field label="Destination" required>
            <TextInput value={draft.destination} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} />
          </Field>
          <Field label="Order ID">
            <TextInput value={draft.orderId} onChange={(e) => setDraft({ ...draft, orderId: e.target.value })} />
          </Field>
          <Field label="Weight">
            <TextInput value={draft.weight} onChange={(e) => setDraft({ ...draft, weight: e.target.value })} />
          </Field>
          <Field label="Shipped date">
            <TextInput type="date" value={draft.shippedDate} onChange={(e) => setDraft({ ...draft, shippedDate: e.target.value })} />
          </Field>
          <Field label="Estimated delivery">
            <TextInput type="date" value={draft.estimatedDelivery} onChange={(e) => setDraft({ ...draft, estimatedDelivery: e.target.value })} />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteShipment}
        title="Delete shipment"
        message={`Are you sure you want to delete ${shipment.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
