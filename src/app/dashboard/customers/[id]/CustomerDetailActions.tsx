"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronDown, Pencil, Trash2 } from "lucide-react";
import type { Customer } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

const STATUSES: Customer["status"][] = ["Active", "Inactive", "Lead"];

export default function CustomerDetailActions({ customer }: { customer: Customer }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [draft, setDraft] = useState({
    name: customer.name,
    email: customer.email,
    company: customer.company ?? "",
    phone: customer.phone ?? "",
    country: customer.country ?? "",
    orders: String(customer.orders),
    totalSpent: String(customer.totalSpent),
    status: customer.status,
    joinedDate: customer.joinedDate ?? "",
  });

  async function saveEdit() {
    if (!draft.name.trim()) { toast("Name is required", "error"); return; }
    if (!draft.email.trim()) { toast("Email is required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/customers/${customer.id}`, {
        name: draft.name.trim(),
        email: draft.email.trim(),
        company: draft.company.trim() || undefined,
        phone: draft.phone.trim() || undefined,
        country: draft.country.trim() || undefined,
        orders: Number(draft.orders) || 0,
        totalSpent: Number(draft.totalSpent) || 0,
        status: draft.status,
        joinedDate: draft.joinedDate || undefined,
      });
      toast(`Customer ${customer.id} updated`);
      setEditOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update customer", "error");
    } finally { setBusy(false); }
  }

  async function deleteCustomer() {
    setBusy(true);
    try {
      await api.del(`/api/customers/${customer.id}`);
      toast(`Customer ${customer.id} deleted`);
      setConfirmDelete(false);
      router.push("/dashboard/customers");
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete customer", "error");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F7FAFC]">
        <Calendar className="w-4 h-4" />
        May 12 – May 18, 2025
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setEditOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E6EDF5] rounded-lg text-[13px] font-medium text-[#4A5A73] hover:bg-[#F7FAFC]"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit Customer
      </button>
      <button
        onClick={() => setConfirmDelete(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EF4444] rounded-lg text-[13px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </button>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit ${customer.id}`}
        description="Update the customer details below."
        footer={
          <>
            <SecondaryButton onClick={() => setEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" required>
            <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Email" required>
            <TextInput type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          </Field>
          <Field label="Company">
            <TextInput value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} />
          </Field>
          <Field label="Phone">
            <TextInput value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
          </Field>
          <Field label="Country">
            <TextInput value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select options={STATUSES} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Customer["status"] })} />
          </Field>
          <Field label="Orders">
            <NumberInput value={draft.orders} onChange={(e) => setDraft({ ...draft, orders: e.target.value })} min="0" step="1" />
          </Field>
          <Field label="Total Spent (USD)">
            <NumberInput value={draft.totalSpent} onChange={(e) => setDraft({ ...draft, totalSpent: e.target.value })} min="0" step="0.01" />
          </Field>
          <div className="col-span-2">
            <Field label="Joined date">
              <TextInput type="date" value={draft.joinedDate} onChange={(e) => setDraft({ ...draft, joinedDate: e.target.value })} />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteCustomer}
        title="Delete customer"
        message={`Are you sure you want to delete ${customer.name} (${customer.id})? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
