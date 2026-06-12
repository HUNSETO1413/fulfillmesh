"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, CheckCircle2, XCircle, Pencil, Trash2 } from "lucide-react";
import type { Quote, QuoteStatus } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

const STATUSES: QuoteStatus[] = ["Draft", "Sent", "Accepted", "Declined", "Expired"];

export default function QuoteDetailActions({ quote }: { quote: Quote }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [draft, setDraft] = useState({
    customer: quote.customer,
    customerId: quote.customerId ?? "",
    status: quote.status,
    createdDate: quote.createdDate,
    validUntil: quote.validUntil ?? "",
    total: String(quote.total),
  });

  async function setStatus(status: QuoteStatus, verb: string) {
    setBusy(true);
    try {
      await api.put(`/api/quotes/${quote.id}`, { status });
      toast(`Quote ${quote.id} ${verb}`);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : `Could not ${verb} quote`, "error");
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit() {
    if (!draft.customer.trim()) { toast("Customer is required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/quotes/${quote.id}`, {
        customer: draft.customer.trim(),
        customerId: draft.customerId.trim() || undefined,
        status: draft.status,
        createdDate: draft.createdDate,
        validUntil: draft.validUntil || undefined,
        total: Number(draft.total) || 0,
      });
      toast(`Quote ${quote.id} updated`);
      setEditOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update quote", "error");
    } finally { setBusy(false); }
  }

  async function deleteQuote() {
    setBusy(true);
    try {
      await api.del(`/api/quotes/${quote.id}`);
      toast(`Quote ${quote.id} deleted`);
      router.push("/dashboard/quotes");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete quote", "error");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setStatus("Sent", "sent")}
        disabled={busy || quote.status === "Sent"}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F7FAFC] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />Send Quote
      </button>
      <button
        onClick={() => setStatus("Declined", "declined")}
        disabled={busy || quote.status === "Declined"}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#EF4444] rounded-lg text-[13px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <XCircle className="w-4 h-4" />Decline
      </button>
      <button
        onClick={() => setEditOpen(true)}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#0057D8] rounded-lg text-[13px] font-medium text-[#0057D8] hover:bg-[#F0F6FF] transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />Edit
      </button>
      <button
        onClick={() => setConfirmDelete(true)}
        className="w-9 h-9 flex items-center justify-center bg-white border border-[#E6EDF5] rounded-lg text-[#4A5A73] hover:bg-[#FEF2F2] hover:text-[#EF4444] hover:border-[#EF4444] transition-colors"
        aria-label="Delete quote"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => setStatus("Accepted", "accepted")}
        disabled={busy || quote.status === "Accepted"}
        className="flex items-center gap-2 px-4 py-2 bg-[#0057D8] hover:bg-[#003B7A] rounded-lg text-[13px] font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCircle2 className="w-4 h-4" />Accept Quote
      </button>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit ${quote.id}`}
        description="Update the quote details below."
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
          <Field label="Customer ID">
            <TextInput value={draft.customerId} onChange={(e) => setDraft({ ...draft, customerId: e.target.value })} placeholder="CUS-1024" />
          </Field>
          <Field label="Status">
            <Select options={STATUSES} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as QuoteStatus })} />
          </Field>
          <Field label="Created date">
            <TextInput type="date" value={draft.createdDate} onChange={(e) => setDraft({ ...draft, createdDate: e.target.value })} />
          </Field>
          <Field label="Valid until">
            <TextInput type="date" value={draft.validUntil} onChange={(e) => setDraft({ ...draft, validUntil: e.target.value })} />
          </Field>
          <div className="col-span-2">
            <Field label="Total (USD)">
              <NumberInput value={draft.total} onChange={(e) => setDraft({ ...draft, total: e.target.value })} step="0.01" min="0" />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteQuote}
        title="Delete RFQ"
        message={`Are you sure you want to delete ${quote.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
