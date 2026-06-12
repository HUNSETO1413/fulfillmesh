"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, FileText, Trash2 } from "lucide-react";
import type { InventoryItem, StockStatus } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

const STOCK_STATUSES: StockStatus[] = ["In Stock", "Low Stock", "Out of Stock", "Backordered"];

export default function InventoryDetailActions({ item }: { item: InventoryItem }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [draft, setDraft] = useState({
    sku: item.sku,
    name: item.name,
    warehouse: item.warehouse,
    location: item.location ?? "",
    onHand: String(item.onHand),
    reserved: String(item.reserved),
    available: String(item.available),
    reorderPoint: String(item.reorderPoint),
    status: item.status,
  });

  async function saveEdit() {
    if (!draft.sku.trim()) { toast("SKU is required", "error"); return; }
    if (!draft.name.trim()) { toast("Product name is required", "error"); return; }
    if (!draft.warehouse.trim()) { toast("Warehouse is required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/inventory/${item.id}`, {
        sku: draft.sku.trim(),
        name: draft.name.trim(),
        warehouse: draft.warehouse.trim(),
        location: draft.location.trim() || undefined,
        onHand: Math.round(Number(draft.onHand) || 0),
        reserved: Math.round(Number(draft.reserved) || 0),
        available: Math.round(Number(draft.available) || 0),
        reorderPoint: Math.round(Number(draft.reorderPoint) || 0),
        status: draft.status,
      });
      toast(`SKU ${item.sku} updated`);
      setEditOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update item", "error");
    } finally { setBusy(false); }
  }

  async function markReorder() {
    setBusy(true);
    try {
      await api.put(`/api/inventory/${item.id}`, { status: "Low Stock" });
      toast(`SKU ${item.sku} flagged for reorder`);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update item", "error");
    } finally { setBusy(false); }
  }

  async function deleteItem() {
    setBusy(true);
    try {
      await api.del(`/api/inventory/${item.id}`);
      toast(`SKU ${item.sku} deleted`);
      router.push("/dashboard/inventory");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete item", "error");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        onClick={() => setEditOpen(true)}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC] transition-colors"
      >
        <Pencil className="w-4 h-4" /> Edit SKU
      </button>
      <button
        onClick={() => setConfirmDelete(true)}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#EF4444] rounded-lg text-[13px] font-medium text-[#EF4444] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#FEF2F2] transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
      <button
        onClick={markReorder}
        disabled={busy}
        className="flex items-center gap-1.5 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors disabled:opacity-60"
      >
        <FileText className="w-4 h-4" /> Flag Reorder
      </button>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit ${item.sku}`}
        description="Update the stock record below."
        footer={
          <>
            <SecondaryButton onClick={() => setEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="SKU" required>
            <TextInput value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} />
          </Field>
          <Field label="Product name" required>
            <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Warehouse" required>
            <TextInput value={draft.warehouse} onChange={(e) => setDraft({ ...draft, warehouse: e.target.value })} />
          </Field>
          <Field label="Location">
            <TextInput value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
          </Field>
          <Field label="On hand">
            <NumberInput value={draft.onHand} onChange={(e) => setDraft({ ...draft, onHand: e.target.value })} step="1" min="0" />
          </Field>
          <Field label="Reserved">
            <NumberInput value={draft.reserved} onChange={(e) => setDraft({ ...draft, reserved: e.target.value })} step="1" min="0" />
          </Field>
          <Field label="Available">
            <NumberInput value={draft.available} onChange={(e) => setDraft({ ...draft, available: e.target.value })} step="1" min="0" />
          </Field>
          <Field label="Reorder point">
            <NumberInput value={draft.reorderPoint} onChange={(e) => setDraft({ ...draft, reorderPoint: e.target.value })} step="1" min="0" />
          </Field>
          <div className="col-span-2">
            <Field label="Status">
              <Select options={STOCK_STATUSES} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as StockStatus })} />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteItem}
        title="Delete inventory item"
        message={`Are you sure you want to delete ${item.name} (${item.sku})? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
