"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, PauseCircle, Edit, Trash2 } from "lucide-react";
import type { QcInspection, QcStatus } from "@/types";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, NumberInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

const STATUSES: QcStatus[] = ["Scheduled", "In Progress", "Passed", "Failed", "On Hold"];

export default function QcDetailActions({ inspection }: { inspection: QcInspection }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [draft, setDraft] = useState({
    product: inspection.product,
    sku: inspection.sku ?? "",
    supplier: inspection.supplier,
    inspector: inspection.inspector ?? "",
    status: inspection.status,
    scheduledDate: inspection.scheduledDate,
    defectRate: inspection.defectRate != null ? String(inspection.defectRate) : "",
    sampleSize: inspection.sampleSize != null ? String(inspection.sampleSize) : "",
  });

  async function setStatus(status: QcStatus, verb: string) {
    setBusy(true);
    try {
      await api.put(`/api/qc-inspections/${inspection.id}`, { status });
      toast(`Inspection ${inspection.id} marked ${verb}`);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update inspection", "error");
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit() {
    if (!draft.product.trim()) { toast("Product is required", "error"); return; }
    if (!draft.supplier.trim()) { toast("Supplier is required", "error"); return; }
    setBusy(true);
    try {
      await api.put(`/api/qc-inspections/${inspection.id}`, {
        product: draft.product.trim(),
        sku: draft.sku.trim() || undefined,
        supplier: draft.supplier.trim(),
        inspector: draft.inspector.trim() || undefined,
        status: draft.status,
        scheduledDate: draft.scheduledDate,
        defectRate: draft.defectRate === "" ? undefined : Number(draft.defectRate),
        sampleSize: draft.sampleSize === "" ? undefined : Math.trunc(Number(draft.sampleSize)),
      });
      toast(`Inspection ${inspection.id} updated`);
      setEditOpen(false);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update inspection", "error");
    } finally { setBusy(false); }
  }

  async function deleteInspection() {
    setBusy(true);
    try {
      await api.del(`/api/qc-inspections/${inspection.id}`);
      toast(`Inspection ${inspection.id} deleted`);
      router.push("/dashboard/qc-inspections");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not delete inspection", "error");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setStatus("Passed", "passed")}
        disabled={busy || inspection.status === "Passed"}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#10B981] rounded-lg text-[13px] font-medium text-[#10B981] hover:bg-[#10B981]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      >
        <CheckCircle2 className="w-4 h-4" />Pass
      </button>
      <button
        onClick={() => setStatus("Failed", "failed")}
        disabled={busy || inspection.status === "Failed"}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#EF4444] rounded-lg text-[13px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      >
        <XCircle className="w-4 h-4" />Fail
      </button>
      <button
        onClick={() => setStatus("On Hold", "on hold")}
        disabled={busy || inspection.status === "On Hold"}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#F59E0B] rounded-lg text-[13px] font-medium text-[#F59E0B] hover:bg-[#F59E0B]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      >
        <PauseCircle className="w-4 h-4" />Hold
      </button>
      <button
        onClick={() => setEditOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-body hover:bg-soft-bg transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      >
        <Edit className="w-4 h-4" />Edit Inspection
      </button>
      <button
        onClick={() => setConfirmDelete(true)}
        className="w-9 h-9 flex items-center justify-center bg-white border border-border-soft rounded-lg text-text-body hover:bg-[#FEF2F2] hover:text-[#EF4444] hover:border-[#EF4444] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        aria-label="Delete inspection"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit ${inspection.id}`}
        description="Update the inspection details below."
        footer={
          <>
            <SecondaryButton onClick={() => setEditOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Product" required>
              <TextInput value={draft.product} onChange={(e) => setDraft({ ...draft, product: e.target.value })} />
            </Field>
          </div>
          <Field label="SKU">
            <TextInput value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} />
          </Field>
          <Field label="Supplier" required>
            <TextInput value={draft.supplier} onChange={(e) => setDraft({ ...draft, supplier: e.target.value })} />
          </Field>
          <Field label="Inspector">
            <TextInput value={draft.inspector} onChange={(e) => setDraft({ ...draft, inspector: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select options={STATUSES} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as QcStatus })} />
          </Field>
          <Field label="Scheduled date">
            <TextInput type="date" value={draft.scheduledDate} onChange={(e) => setDraft({ ...draft, scheduledDate: e.target.value })} />
          </Field>
          <Field label="Sample size">
            <NumberInput value={draft.sampleSize} onChange={(e) => setDraft({ ...draft, sampleSize: e.target.value })} step="1" min="0" />
          </Field>
          <div className="col-span-2">
            <Field label="Defect rate (%)">
              <NumberInput value={draft.defectRate} onChange={(e) => setDraft({ ...draft, defectRate: e.target.value })} step="0.1" min="0" />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteInspection}
        title="Delete inspection"
        message={`Are you sure you want to delete ${inspection.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
      />
    </div>
  );
}
