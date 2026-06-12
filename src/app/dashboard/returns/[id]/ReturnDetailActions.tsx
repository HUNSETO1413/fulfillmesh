"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Pencil, Trash2 } from "lucide-react";
import type { ReturnRecord, ReturnStatus } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

const STATUSES: ReturnStatus[] = ["Requested", "Approved", "In Transit", "Received", "Refunded", "Rejected"];
const REASONS = ["Defective", "Wrong Item", "Not as Described", "Damaged in Transit", "No Longer Needed", "Other"];

export default function ReturnDetailActions({ ret }: { ret: ReturnRecord }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [draft, setDraft] = useState({
    orderId: ret.orderId,
    customer: ret.customer,
    reason: ret.reason,
    status: ret.status,
    requestedDate: ret.requestedDate,
    items: String(ret.items),
    refundAmount: ret.refundAmount != null ? String(ret.refundAmount) : "",
  });

  const decided = ret.status === "Rejected" || ret.status === "Refunded";

  async function setStatus(status: ReturnStatus, label: string) {
    setBusy(true);
    try {
      await api.put(`/api/returns/${ret.id}`, { status });
      toast(`Return ${ret.id} ${label}`);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update return", "error");
    } finally { setBusy(false); }
  }

  async function saveEdit() {
    if (!draft.orderId.trim()) { toast("Order ID is required", "error"); return; }
    if (!draft.customer.trim()) { toast("Customer is required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/returns/${ret.id}`, {
        orderId: draft.orderId.trim(),
        customer: draft.customer.trim(),
        reason: draft.reason,
        status: draft.status,
        requestedDate: draft.requestedDate,
        items: Number(draft.items) || 1,
        refundAmount: draft.refundAmount.trim() ? Number(draft.refundAmount) : undefined,
      });
      toast(`Return ${ret.id} updated`);
      setEditOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update return", "error");
    } finally { setBusy(false); }
  }

  async function deleteReturn() {
    setBusy(true);
    try {
      await api.del(`/api/returns/${ret.id}`);
      toast(`Return ${ret.id} deleted`);
      setConfirmDelete(false);
      router.push("/dashboard/returns");
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete return", "error");
    } finally { setBusy(false); }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setEditOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F7FAFC] transition-colors"
      >
        <Pencil className="w-4 h-4" /> Edit Return
      </button>
      <button
        onClick={() => setConfirmDelete(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#FEF2F2] hover:text-[#EF4444] hover:border-[#EF4444] transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
      <button
        onClick={() => setStatus("Rejected", "rejected")}
        disabled={busy || decided}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#EF4444] rounded-lg text-[13px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <X className="w-4 h-4" /> Reject
      </button>
      <button
        onClick={() => setStatus("Approved", "approved")}
        disabled={busy || decided || ret.status === "Approved"}
        className="inline-flex items-center gap-1 px-4 py-2 bg-[#0057D8] hover:bg-[#003B7A] rounded-lg text-[13px] font-medium text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Check className="w-4 h-4" /> Approve
      </button>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit ${ret.id}`}
        description="Update the return details below."
        footer={
          <>
            <SecondaryButton onClick={() => setEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Order ID" required>
            <TextInput value={draft.orderId} onChange={(e) => setDraft({ ...draft, orderId: e.target.value })} />
          </Field>
          <Field label="Customer" required>
            <TextInput value={draft.customer} onChange={(e) => setDraft({ ...draft, customer: e.target.value })} />
          </Field>
          <Field label="Reason">
            <Select options={REASONS} value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select options={STATUSES} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ReturnStatus })} />
          </Field>
          <Field label="Request date">
            <TextInput type="date" value={draft.requestedDate} onChange={(e) => setDraft({ ...draft, requestedDate: e.target.value })} />
          </Field>
          <Field label="Items">
            <NumberInput value={draft.items} onChange={(e) => setDraft({ ...draft, items: e.target.value })} min="1" step="1" />
          </Field>
          <div className="col-span-2">
            <Field label="Refund amount (USD)">
              <NumberInput value={draft.refundAmount} onChange={(e) => setDraft({ ...draft, refundAmount: e.target.value })} step="0.01" min="0" />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteReturn}
        title="Delete return"
        message={`Are you sure you want to delete ${ret.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
