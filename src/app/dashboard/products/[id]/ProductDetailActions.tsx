"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Product, StockStatus } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

const STOCK_STATUSES: StockStatus[] = ["In Stock", "Low Stock", "Out of Stock", "Backordered"];

export default function ProductDetailActions({ product }: { product: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [draft, setDraft] = useState({
    sku: product.sku,
    name: product.name,
    category: product.category,
    price: String(product.price),
    cost: product.cost != null ? String(product.cost) : "",
    stock: String(product.stock),
    status: product.status,
    supplier: product.supplier ?? "",
  });

  async function saveEdit() {
    if (!draft.name.trim()) { toast("Product name is required", "error"); return; }
    if (!draft.sku.trim()) { toast("SKU is required", "error"); return; }
    if (!draft.category.trim()) { toast("Category is required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/products/${product.id}`, {
        sku: draft.sku.trim(),
        name: draft.name.trim(),
        category: draft.category.trim(),
        price: Number(draft.price) || 0,
        cost: draft.cost.trim() === "" ? undefined : Number(draft.cost) || 0,
        stock: Math.round(Number(draft.stock) || 0),
        status: draft.status,
        supplier: draft.supplier.trim() || undefined,
      });
      toast(`Product ${product.sku} updated`);
      setEditOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update product", "error");
    } finally { setBusy(false); }
  }

  async function deleteProduct() {
    setBusy(true);
    try {
      await api.del(`/api/products/${product.id}`);
      toast(`Product ${product.sku} deleted`);
      router.push("/dashboard/products");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete product", "error");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setEditOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#F8FAFC] transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" /> Edit Product
      </button>
      <button
        onClick={() => setConfirmDelete(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EF4444] rounded-lg text-[13px] font-medium text-[#EF4444] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#FEF2F2] transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
      <button onClick={() => router.push("/dashboard/suppliers")} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#2563EB] transition-colors">
        View Supplier <ExternalLink className="w-3.5 h-3.5" />
      </button>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit ${product.sku}`}
        description="Update the product details below."
        footer={
          <>
            <SecondaryButton onClick={() => setEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Product name" required>
              <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
          </div>
          <Field label="SKU" required>
            <TextInput value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} />
          </Field>
          <Field label="Category" required>
            <TextInput value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
          </Field>
          <Field label="Selling price (USD)">
            <NumberInput value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} step="0.01" min="0" />
          </Field>
          <Field label="Unit cost (USD)">
            <NumberInput value={draft.cost} onChange={(e) => setDraft({ ...draft, cost: e.target.value })} step="0.01" min="0" />
          </Field>
          <Field label="Stock">
            <NumberInput value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} step="1" min="0" />
          </Field>
          <Field label="Status">
            <Select options={STOCK_STATUSES} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as StockStatus })} />
          </Field>
          <div className="col-span-2">
            <Field label="Supplier">
              <TextInput value={draft.supplier} onChange={(e) => setDraft({ ...draft, supplier: e.target.value })} />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteProduct}
        title="Delete product"
        message={`Are you sure you want to delete ${product.name} (${product.sku})? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
