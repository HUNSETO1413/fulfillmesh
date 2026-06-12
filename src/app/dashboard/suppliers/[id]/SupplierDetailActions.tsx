"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Power } from "lucide-react";
import type { Supplier, SupplierStatus } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

const STATUSES: SupplierStatus[] = ["Active", "Pending", "Suspended"];
const CATEGORIES = ["Electronics", "Home & Living", "Packaging", "Apparel", "Raw Materials", "Logistics"];

export default function SupplierDetailActions({ supplier }: { supplier: Supplier }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmSuspend, setConfirmSuspend] = useState(false);

  const suspended = supplier.status === "Suspended";

  const [draft, setDraft] = useState({
    name: supplier.name,
    contact: supplier.contact ?? "",
    email: supplier.email ?? "",
    country: supplier.country,
    category: supplier.category ?? "Electronics",
    rating: String(supplier.rating),
    status: supplier.status,
    leadTimeDays: supplier.leadTimeDays != null ? String(supplier.leadTimeDays) : "",
    productsSupplied: supplier.productsSupplied != null ? String(supplier.productsSupplied) : "",
  });

  async function saveEdit() {
    if (!draft.name.trim()) { toast("Name is required", "error"); return; }
    if (!draft.country.trim()) { toast("Country is required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/suppliers/${supplier.id}`, {
        name: draft.name.trim(),
        contact: draft.contact.trim() || undefined,
        email: draft.email.trim() || undefined,
        country: draft.country.trim(),
        category: draft.category || undefined,
        rating: Math.min(5, Math.max(0, Number(draft.rating) || 0)),
        status: draft.status,
        leadTimeDays: draft.leadTimeDays.trim() ? Number(draft.leadTimeDays) : undefined,
        productsSupplied: draft.productsSupplied.trim() ? Number(draft.productsSupplied) : undefined,
      });
      toast(`Supplier ${supplier.id} updated`);
      setEditOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update supplier", "error");
    } finally { setBusy(false); }
  }

  async function toggleSuspend() {
    setBusy(true);
    const next: SupplierStatus = suspended ? "Active" : "Suspended";
    try {
      await api.put(`/api/suppliers/${supplier.id}`, { status: next });
      toast(`Supplier ${supplier.id} ${suspended ? "reactivated" : "suspended"}`);
      setConfirmSuspend(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update supplier", "error");
    } finally { setBusy(false); }
  }

  async function deleteSupplier() {
    setBusy(true);
    try {
      await api.del(`/api/suppliers/${supplier.id}`);
      toast(`Supplier ${supplier.id} deleted`);
      setConfirmDelete(false);
      router.push("/dashboard/suppliers");
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete supplier", "error");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setEditOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#3B82F6] rounded-lg text-[14px] font-medium text-[#3B82F6] hover:bg-[#EFF6FF] transition-colors"
      >
        <Pencil className="w-4 h-4" />
        Edit
      </button>
      <button
        onClick={() => setConfirmSuspend(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[14px] font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
      >
        <Power className="w-4 h-4" />
        {suspended ? "Reactivate" : "Suspend"}
      </button>
      <button
        onClick={() => setConfirmDelete(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#EF4444] rounded-lg text-[14px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit ${supplier.id}`}
        description="Update the supplier details below."
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
          <Field label="Country" required>
            <TextInput value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
          </Field>
          <Field label="Contact">
            <TextInput value={draft.contact} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          </Field>
          <Field label="Category">
            <Select options={CATEGORIES} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select options={STATUSES} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as SupplierStatus })} />
          </Field>
          <Field label="Rating (0-5)">
            <NumberInput value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: e.target.value })} min="0" max="5" step="0.1" />
          </Field>
          <Field label="Lead Time (days)">
            <NumberInput value={draft.leadTimeDays} onChange={(e) => setDraft({ ...draft, leadTimeDays: e.target.value })} min="0" step="1" />
          </Field>
          <div className="col-span-2">
            <Field label="Products Supplied">
              <NumberInput value={draft.productsSupplied} onChange={(e) => setDraft({ ...draft, productsSupplied: e.target.value })} min="0" step="1" />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmSuspend}
        onClose={() => setConfirmSuspend(false)}
        onConfirm={toggleSuspend}
        title={suspended ? "Reactivate supplier" : "Suspend supplier"}
        message={suspended
          ? `Reactivate ${supplier.name}? They will be marked as Active again.`
          : `Suspend ${supplier.name}? They will be marked as Suspended. You can reactivate later.`}
        confirmLabel={suspended ? "Reactivate" : "Suspend"}
        destructive={!suspended}
        loading={busy}
      />

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteSupplier}
        title="Delete supplier"
        message={`Are you sure you want to delete ${supplier.name} (${supplier.id})? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
