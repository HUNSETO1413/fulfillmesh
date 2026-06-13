"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Plus, CheckCircle2, AlertCircle, XCircle, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

type Conn = "Connected" | "Needs Attention" | "Disabled";

type Carrier = {
  name: string;
  service: string;
  conn: Conn;
  regions: string;
  defaultStatus: string;
  tracking: boolean;
};

const initialCarriers: Carrier[] = [
  { name: "FedEx", service: "Express, Ground", conn: "Connected", regions: "240+ countries", defaultStatus: "Active", tracking: true },
  { name: "UPS", service: "Express, Ground", conn: "Connected", regions: "220+ countries", defaultStatus: "Active", tracking: true },
  { name: "DHL", service: "Express", conn: "Connected", regions: "220+ countries", defaultStatus: "Active", tracking: true },
  { name: "USPS", service: "Ground, Priority", conn: "Connected", regions: "USA", defaultStatus: "Active", tracking: true },
  { name: "YunExpress", service: "Express, Standard", conn: "Needs Attention", regions: "200+ countries", defaultStatus: "Inactive", tracking: true },
  { name: "4PX", service: "Express, Economy", conn: "Disabled", regions: "150+ countries", defaultStatus: "Inactive", tracking: false },
];

const PAGE_SIZE = 5;

const connConfig: Record<Conn, { cls: string; Icon: typeof CheckCircle2 }> = {
  "Connected": { cls: "bg-[#10B981] text-white", Icon: CheckCircle2 },
  "Needs Attention": { cls: "bg-[#F59E0B] text-white", Icon: AlertCircle },
  "Disabled": { cls: "bg-[#94A3B8] text-white", Icon: XCircle },
};

function ConnBadge({ conn }: { conn: Conn }) {
  const { cls, Icon } = connConfig[conn];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md ${cls}`}>
      <Icon className="w-3 h-3" />
      {conn}
    </span>
  );
}

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        enabled ? "bg-[#10B981]" : "bg-[#E2E8F0]"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

type Draft = { name: string; service: string; regions: string; conn: Conn; defaultStatus: string };
const emptyDraft: Draft = { name: "", service: "", regions: "", conn: "Connected", defaultStatus: "Active" };

export default function CarriersPage() {
  const { toast } = useToast();
  const [carriers, setCarriers] = useState<Carrier[]>(initialCarriers);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await api.get<Record<string, unknown>>("/api/settings");
        if (!alive) return;
        const stored = all.carriers as Carrier[] | undefined;
        if (Array.isArray(stored)) setCarriers(stored);
      } catch {
        if (alive) toast("Failed to load carrier settings", "error");
      }
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist the full carrier list and update local state together.
  const commit = (next: Carrier[]) => {
    setCarriers(next);
    api.put("/api/settings", { carriers: next }).catch(() => toast("Failed to save carrier settings", "error"));
  };

  // add / edit modal — `editing` holds the original carrier name when editing
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [nameError, setNameError] = useState("");

  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Carrier | null>(null);
  const [disabling, setDisabling] = useState<Carrier | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuFor) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuFor(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuFor]);

  const totalPages = Math.max(1, Math.ceil(carriers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = useMemo(() => carriers.slice(start, start + PAGE_SIZE), [carriers, start]);

  const toggleTracking = (name: string) => {
    const c = carriers.find((x) => x.name === name);
    commit(carriers.map((x) => (x.name === name ? { ...x, tracking: !x.tracking } : x)));
    toast(`${name} tracking sync ${c && !c.tracking ? "enabled" : "disabled"}`);
  };

  const setStatus = (name: string, status: string) => {
    commit(carriers.map((c) => (c.name === name ? { ...c, defaultStatus: status } : c)));
    toast(`${name} set to ${status.toLowerCase()}`);
  };

  const requestToggleStatus = (c: Carrier) => {
    setMenuFor(null);
    if (c.defaultStatus === "Active") {
      // Disabling an active (default) carrier is destructive — confirm first.
      setDisabling(c);
    } else {
      setStatus(c.name, "Active");
    }
  };

  const openAdd = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setNameError("");
    setFormOpen(true);
  };

  const openEdit = (c: Carrier) => {
    setMenuFor(null);
    setEditing(c.name);
    setDraft({ name: c.name, service: c.service, regions: c.regions, conn: c.conn, defaultStatus: c.defaultStatus });
    setNameError("");
    setFormOpen(true);
  };

  const handleSave = () => {
    const name = draft.name.trim();
    if (!name) {
      setNameError("Carrier name is required");
      return;
    }
    const duplicate = carriers.some((c) => c.name.toLowerCase() === name.toLowerCase() && c.name !== editing);
    if (duplicate) {
      setNameError("A carrier with this name already exists");
      return;
    }
    if (editing) {
      commit(
        carriers.map((c) =>
          c.name === editing
            ? { ...c, name, service: draft.service.trim() || "Standard", regions: draft.regions.trim() || "—", conn: draft.conn, defaultStatus: draft.defaultStatus }
            : c,
        ),
      );
      toast(`${name} updated`);
    } else {
      commit([
        ...carriers,
        {
          name,
          service: draft.service.trim() || "Standard",
          regions: draft.regions.trim() || "—",
          conn: draft.conn,
          defaultStatus: draft.defaultStatus,
          tracking: true,
        },
      ]);
      toast(`${name} added`);
    }
    setFormOpen(false);
    setDraft(emptyDraft);
    setEditing(null);
  };

  const handleRemove = () => {
    if (!removing) return;
    commit(carriers.filter((c) => c.name !== removing.name));
    toast(`${removing.name} removed`);
    setRemoving(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1E293B]">Carrier Settings</h2>
          <p className="text-[13px] text-[#64748B] mt-1">
            Manage your carriers, API connections, services, and regions.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-lg text-[13px] font-medium hover:bg-[#3B82F6]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Carrier
        </button>
      </div>

      {/* Table */}
      <div className="mt-5 border border-[#E2E8F0] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Carrier</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Service Type</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">API Type</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Regions</th>
              <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-3">Default Status</th>
              <th className="text-center text-[12px] font-medium text-[#64748B] px-4 py-3">Tracking Sync</th>
              <th className="text-right text-[12px] font-medium text-[#64748B] px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((c) => (
              <tr key={c.name} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]/50 transition-colors">
                <td className="px-4 py-3.5 text-[13px] font-medium text-[#1E293B]">{c.name}</td>
                <td className="px-4 py-3.5 text-[13px] text-[#475569]">{c.service}</td>
                <td className="px-4 py-3.5"><ConnBadge conn={c.conn} /></td>
                <td className="px-4 py-3.5 text-[13px] text-[#475569]">{c.regions}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded ${
                    c.defaultStatus === "Active"
                      ? "bg-[#3B82F6]/10 text-[#3B82F6]"
                      : "bg-[#94A3B8]/10 text-[#94A3B8]"
                  }`}>
                    {c.defaultStatus}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <ToggleSwitch enabled={c.tracking} onClick={() => toggleTracking(c.name)} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="relative inline-block" ref={menuFor === c.name ? menuRef : undefined}>
                    <button
                      onClick={() => setMenuFor(menuFor === c.name ? null : c.name)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuFor === c.name && (
                      <div className="absolute right-0 top-9 z-20 w-44 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 text-left">
                        <button
                          onClick={() => requestToggleStatus(c)}
                          className="block w-full text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]"
                        >
                          {c.defaultStatus === "Active" ? "Set Inactive" : "Set Active"}
                        </button>
                        <button
                          onClick={() => openEdit(c)}
                          className="block w-full text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]"
                        >
                          Edit Carrier
                        </button>
                        <button
                          onClick={() => {
                            setMenuFor(null);
                            setRemoving(c);
                          }}
                          className="block w-full text-left px-3 py-2 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-[13px] text-[#64748B]">
          Showing {carriers.length === 0 ? 0 : start + 1} to {Math.min(start + PAGE_SIZE, carriers.length)} of {carriers.length} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 border border-[#E2E8F0] rounded-md text-[13px] text-[#64748B] hover:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-md text-[13px] font-medium ${
                p === currentPage ? "bg-[#3B82F6] text-white" : "text-[#64748B] hover:bg-[#F1F5F9]"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 border border-[#E2E8F0] rounded-md text-[13px] text-[#64748B] hover:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add / Edit Carrier Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing}` : "Add Carrier"}
        description={editing ? "Update this carrier's connection and service details." : "Connect a new shipping carrier to your account."}
        footer={
          <>
            <SecondaryButton onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSave}>{editing ? "Save changes" : "Add Carrier"}</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Carrier name" required error={nameError}>
              <TextInput
                value={draft.name}
                onChange={(e) => { setDraft({ ...draft, name: e.target.value }); if (e.target.value.trim()) setNameError(""); }}
                placeholder="e.g. Aramex"
              />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Service type">
              <TextInput value={draft.service} onChange={(e) => setDraft({ ...draft, service: e.target.value })} placeholder="Express, Ground" />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Regions">
              <TextInput value={draft.regions} onChange={(e) => setDraft({ ...draft, regions: e.target.value })} placeholder="200+ countries" />
            </Field>
          </div>
          <Field label="Connection">
            <Select
              options={["Connected", "Needs Attention", "Disabled"]}
              value={draft.conn}
              onChange={(e) => setDraft({ ...draft, conn: e.target.value as Conn })}
            />
          </Field>
          <Field label="Default status">
            <Select
              options={["Active", "Inactive"]}
              value={draft.defaultStatus}
              onChange={(e) => setDraft({ ...draft, defaultStatus: e.target.value })}
            />
          </Field>
        </div>
      </Modal>

      {/* Disable (set inactive) Confirm */}
      <ConfirmDialog
        open={disabling !== null}
        onClose={() => setDisabling(null)}
        onConfirm={() => {
          if (disabling) setStatus(disabling.name, "Inactive");
          setDisabling(null);
        }}
        title="Set carrier inactive"
        message={`Set "${disabling?.name ?? ""}" to inactive? New shipments will no longer be assigned to this carrier by default.`}
        confirmLabel="Set Inactive"
        destructive
      />

      {/* Remove Confirm */}
      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={handleRemove}
        title="Remove carrier"
        message={`Remove "${removing?.name ?? ""}"? Shipments using this carrier will need to be reassigned.`}
        confirmLabel="Remove"
        destructive
      />
    </div>
  );
}
