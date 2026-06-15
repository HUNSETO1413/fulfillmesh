"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileType,
  Folder,
  Settings,
  Upload,
  Search,
  SlidersHorizontal,
  MoreVertical,
  ArrowUpRight,
  CheckCircle2,
  Share2,
  Star,
  Archive,
  FolderPlus,
  FileInput,
  Link2,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Copy,
  X,
  Loader,
  Plus,
  Check,
  HardDrive,
  RotateCcw,
  Inbox,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { Drawer } from "@/components/dashboard/Drawer";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";
import type { DocumentRecord } from "@/types";

const stats = [
  { title: "Total Documents", value: "1,248", sub: "12.6% vs last 30 days", subColor: "#10B981", icon: Folder, color: "#3B82F6" },
  { title: "By Me", value: "236", sub: "18.9% of total", subColor: "#94A3B8", icon: CheckCircle2, color: "#10B981" },
  { title: "Shared with Me", value: "312", sub: "25.0% of total", subColor: "#94A3B8", icon: Share2, color: "#8B5CF6" },
  { title: "Important", value: "156", sub: "12.5% of total", subColor: "#94A3B8", icon: Star, color: "#F59E0B" },
  { title: "Archived", value: "544", sub: "43.6% of total", subColor: "#94A3B8", icon: Archive, color: "#64748B" },
];

type DocType = "PDF" | "XLSX" | "DOCX";

type DocStatus = DocumentRecord["status"];

// View model derived from the DocumentRecord API type.
interface Doc {
  id: string;
  name: string;
  desc: string;
  category: string;
  catColor: string;
  type: string;
  warehouse: string;
  uploadedBy: string;
  avatarColor: string;
  date: string;
  size: string;
  status: DocStatus;
}

const CATEGORIES = ["SOP", "Policy", "Template", "Report", "Contract", "Checklist"];
const CAT_COLORS: Record<string, string> = {
  SOP: "#3B82F6", Policy: "#F59E0B", Template: "#06B6D4", Report: "#10B981", Contract: "#EF4444", Checklist: "#8B5CF6",
};
const DOC_TYPES: DocType[] = ["PDF", "XLSX", "DOCX"];
const WAREHOUSES = ["ATL1", "DFW1", "LAX1", "MIA1", "Global"];

const AVATAR_COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#EC4899", "#F97316", "#06B6D4", "#EF4444"];

function colorForName(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function formatUpdatedAt(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

// Map a DocumentRecord from the API into the display view model.
function toDoc(rec: DocumentRecord): Doc {
  const category = rec.category ?? "Report";
  return {
    id: rec.id,
    name: rec.name,
    desc: rec.category ? `${rec.category} · ${rec.type}` : rec.type,
    category,
    catColor: CAT_COLORS[category] ?? "#3B82F6",
    type: rec.type,
    warehouse: rec.owner,
    uploadedBy: rec.owner,
    avatarColor: colorForName(rec.owner),
    date: formatUpdatedAt(rec.updatedAt),
    size: rec.size,
    status: rec.status,
  };
}

const byCategory = [
  { label: "SOP", value: "374", pct: 30, color: "#3B82F6" },
  { label: "Policy", value: "250", pct: 20, color: "#F59E0B" },
  { label: "Template", value: "212", pct: 17, color: "#06B6D4" },
  { label: "Report", value: "187", pct: 15, color: "#10B981" },
  { label: "Contract", value: "150", pct: 12, color: "#EF4444" },
  { label: "Checklist", value: "75", pct: 6, color: "#8B5CF6" },
];

const recentUploads = [
  { name: "Inbound Shipments SOP.pdf", meta: "ATL1 · SOP", icon: FileText, color: "#EF4444" },
  { name: "Inventory Template.xlsx", meta: "Global · Template", icon: FileSpreadsheet, color: "#10B981" },
  { name: "Client Onboarding Checklist.pdf", meta: "MIA1 · Checklist", icon: FileText, color: "#EF4444" },
];

const storageUsage = [
  { label: "Documents", value: "6.2 GB", pct: 62, color: "#3B82F6" },
  { label: "Images", value: "1.5 GB", pct: 15, color: "#10B981" },
  { label: "Archives", value: "0.9 GB", pct: 9, color: "#F59E0B" },
];

function TypeIcon({ type }: { type: string }) {
  const t = type.toUpperCase();
  if (t === "XLSX" || t === "REPORT" || t === "SPREADSHEET") return <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 flex items-center justify-center shrink-0"><FileSpreadsheet className="w-4 h-4 text-[#10B981]" /></div>;
  if (t === "DOCX" || t === "CONTRACT" || t === "LABEL") return <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center shrink-0"><FileType className="w-4 h-4 text-[#3B82F6]" /></div>;
  return <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-[#EF4444]" /></div>;
}

type UploadDraft = { category: string; warehouse: string };
const emptyUpload: UploadDraft = { category: "SOP", warehouse: "ATL1" };

interface PendingFile {
  name: string;
  size: string;
  type: DocType;
}

function fileToDocType(file: File): DocType {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "xlsx" || ext === "xls" || ext === "csv" || file.type.includes("spreadsheet")) return "XLSX";
  if (ext === "docx" || ext === "doc" || file.type.includes("word")) return "DOCX";
  return "PDF";
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function stripExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}

// Parse a human-readable size string (e.g. "2.4 MB", "812 KB") into bytes.
function parseSizeToBytes(size: string): number {
  const m = size.trim().match(/^([\d.]+)\s*(KB|MB|GB|B)?$/i);
  if (!m) return 0;
  const value = parseFloat(m[1]);
  if (isNaN(value)) return 0;
  switch ((m[2] ?? "B").toUpperCase()) {
    case "GB": return value * 1024 * 1024 * 1024;
    case "MB": return value * 1024 * 1024;
    case "KB": return value * 1024;
    default: return value;
  }
}

function formatBytesLong(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function shareLinkFor(doc: Doc): string {
  const slug = doc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `https://app.fulfillmesh.com/share/${slug}-${doc.id}`;
}

export default function DocumentsPage() {
  const { toast } = useToast();
  const C = 2 * Math.PI * 40;

  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [whFilter, setWhFilter] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [upload, setUpload] = useState<UploadDraft>(emptyUpload);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<Doc | null>(null);
  const [sharing, setSharing] = useState<Doc | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Secondary panels
  const [linksOpen, setLinksOpen] = useState(false);
  const [recycleOpen, setRecycleOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [docSettingsOpen, setDocSettingsOpen] = useState(false);
  const [uploadsOpen, setUploadsOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Manage Categories modal working state
  const [catList, setCatList] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [savingCats, setSavingCats] = useState(false);

  // Document settings (default view / sort) — self-contained, persisted to settings KV.
  const [docSettings, setDocSettings] = useState({ defaultView: "List", defaultSort: "Date (newest)" });
  const [savingSettings, setSavingSettings] = useState(false);

  // Soft-delete recycle bin (client-side restore affordance).
  const [recycled, setRecycled] = useState<Doc[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: DocumentRecord[]; total: number }>("/api/documents");
        if (cancelled) return;
        setDocs((res?.data ?? []).map(toDoc));
      } catch {
        if (!cancelled) toast("Failed to load documents", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs.filter((d) => {
      const matchesQuery = !q || d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
      const matchesCat = !catFilter || d.category === catFilter;
      const matchesType = !typeFilter || d.type === typeFilter;
      const matchesWh = !whFilter || d.warehouse === whFilter;
      return matchesQuery && matchesCat && matchesType && matchesWh;
    });
  }, [docs, query, catFilter, typeFilter, whFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function openUpload() {
    fileInputRef.current?.click();
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setPendingFiles(files.map((f) => ({ name: f.name, size: formatBytes(f.size), type: fileToDocType(f) })));
    setUpload(emptyUpload);
    setUploadOpen(true);
  }

  async function saveUpload() {
    if (pendingFiles.length === 0) { toast("Select at least one file", "error"); return; }
    setBusy(true);
    const files = pendingFiles;
    try {
      const created = await Promise.all(
        files.map((f) =>
          api.post<DocumentRecord>("/api/documents", {
            name: stripExtension(f.name),
            type: f.type,
            category: upload.category,
            size: f.size,
            owner: "You",
            status: "Active",
          }),
        ),
      );
      setDocs((prev) => [...created.map(toDoc), ...prev]);
      setUploadOpen(false);
      setPendingFiles([]);
      toast(files.length === 1 ? `"${files[0].name}" uploaded` : `${files.length} documents uploaded`);
    } catch {
      toast("Failed to upload document", "error");
    } finally {
      setBusy(false);
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    const target = deleting;
    setDocs((cur) => cur.filter((d) => d.id !== target.id));
    setRecycled((cur) => [target, ...cur.filter((d) => d.id !== target.id)]);
    setDeleting(null);
    api.del(`/api/documents/${target.id}`)
      .then(() => toast(`"${target.name}" deleted`))
      .catch(() => toast(`Failed to delete "${target.name}"`, "error"));
  }

  function archiveDoc(d: Doc) {
    setOpenMenu(null);
    const next: DocStatus = d.status === "Archived" ? "Active" : "Archived";
    setDocs((cur) => cur.map((x) => (x.id === d.id ? { ...x, status: next } : x)));
    api.put<DocumentRecord>(`/api/documents/${d.id}`, { status: next })
      .then(() => toast(next === "Archived" ? `"${d.name}" archived` : `"${d.name}" restored`))
      .catch(() => {
        setDocs((cur) => cur.map((x) => (x.id === d.id ? { ...x, status: d.status } : x)));
        toast(`Failed to update "${d.name}"`, "error");
      });
  }

  function downloadDoc(d: Doc) {
    const content = [
      `FulfillMesh Document Export`,
      `===========================`,
      `Name: ${d.name}`,
      `Description: ${d.desc}`,
      `Category: ${d.category}`,
      `Type: ${d.type}`,
      `Warehouse: ${d.warehouse}`,
      `Uploaded by: ${d.uploadedBy}`,
      `Date: ${d.date}`,
      `Size: ${d.size}`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${d.name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast(`Downloaded "${d.name}"`);
  }

  async function copyShareLink() {
    if (!sharing) return;
    try {
      await navigator.clipboard.writeText(shareLinkFor(sharing));
      setCopied(true);
      toast("Share link copied to clipboard");
    } catch {
      toast("Could not copy link — copy it manually", "error");
    }
  }

  async function copyLink(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(link);
      window.setTimeout(() => setCopiedLink((c) => (c === link ? null : c)), 1500);
      toast("Share link copied to clipboard");
    } catch {
      toast("Could not copy link — copy it manually", "error");
    }
  }

  // Distinct categories currently in use across the loaded documents.
  const usedCategories = useMemo(() => {
    const set = new Set<string>();
    for (const d of docs) set.add(d.category);
    return Array.from(set).sort();
  }, [docs]);

  function openCategories() {
    setNewCat("");
    // Seed the editor with the union of used + known categories.
    setCatList(Array.from(new Set([...usedCategories, ...CATEGORIES])).sort());
    setCategoriesOpen(true);
  }

  function addCategory() {
    const name = newCat.trim();
    if (!name) return;
    if (catList.some((c) => c.toLowerCase() === name.toLowerCase())) {
      toast("That category already exists", "error");
      return;
    }
    setCatList((cur) => [...cur, name]);
    setNewCat("");
  }

  function renameCategory(index: number, value: string) {
    setCatList((cur) => cur.map((c, i) => (i === index ? value : c)));
  }

  function removeCategory(index: number) {
    setCatList((cur) => cur.filter((_, i) => i !== index));
  }

  async function saveCategories() {
    const cleaned = catList.map((c) => c.trim()).filter(Boolean);
    if (cleaned.length === 0) { toast("Add at least one category", "error"); return; }
    setSavingCats(true);
    try {
      await api.put("/api/settings", { documents: { categories: cleaned } });
      toast("Categories saved");
      setCategoriesOpen(false);
    } catch {
      toast("Failed to save categories", "error");
    } finally {
      setSavingCats(false);
    }
  }

  async function saveDocSettings() {
    setSavingSettings(true);
    try {
      await api.put("/api/settings", { documents: { defaultView: docSettings.defaultView, defaultSort: docSettings.defaultSort } });
      toast("Document settings saved");
      setDocSettingsOpen(false);
    } catch {
      toast("Failed to save settings", "error");
    } finally {
      setSavingSettings(false);
    }
  }

  function restoreFromRecycle(d: Doc) {
    setRecycled((cur) => cur.filter((x) => x.id !== d.id));
    setDocs((cur) => (cur.some((x) => x.id === d.id) ? cur : [d, ...cur]));
    toast(`"${d.name}" restored`);
  }

  // Storage usage computed from the loaded documents.
  const storageStats = useMemo(() => {
    const totalBytes = docs.reduce((sum, d) => sum + parseSizeToBytes(d.size), 0);
    const byCat = new Map<string, number>();
    const byType = new Map<string, number>();
    for (const d of docs) {
      const b = parseSizeToBytes(d.size);
      byCat.set(d.category, (byCat.get(d.category) ?? 0) + b);
      byType.set(d.type, (byType.get(d.type) ?? 0) + b);
    }
    const toRows = (m: Map<string, number>) =>
      Array.from(m.entries())
        .map(([label, bytes]) => ({ label, bytes, pct: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0 }))
        .sort((a, b) => b.bytes - a.bytes);
    return { totalBytes, byCategory: toRows(byCat), byType: toRows(byType) };
  }, [docs]);

  const activeFilters: { label: string; clear: () => void }[] = [
    ...(catFilter ? [{ label: `Category: ${catFilter}`, clear: () => { setCatFilter(""); setPage(1); } }] : []),
    ...(typeFilter ? [{ label: `Type: ${typeFilter}`, clear: () => { setTypeFilter(""); setPage(1); } }] : []),
    ...(whFilter ? [{ label: `Warehouse: ${whFilter}`, clear: () => { setWhFilter(""); setPage(1); } }] : []),
  ];

  const quickActions: { label: string; icon: typeof Upload; action: "upload" | "folder" | "request" | "links" | "recycle" }[] = [
    { label: "Upload Document", icon: Upload, action: "upload" },
    { label: "Create Folder", icon: FolderPlus, action: "folder" },
    { label: "Request Document", icon: FileInput, action: "request" },
    { label: "Shared Links", icon: Link2, action: "links" },
    { label: "Recycle Bin", icon: Trash2, action: "recycle" },
  ];

  function runQuickAction(action: typeof quickActions[number]["action"]) {
    switch (action) {
      case "upload": openUpload(); break;
      case "folder": toast("New folder created", "success"); break;
      case "request": toast("Document request sent", "info"); break;
      case "links": setLinksOpen(true); break;
      case "recycle": setRecycleOpen(true); break;
    }
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input for real uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Documents</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Store, manage, and share important documents securely.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openCategories} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]"><Folder className="w-4 h-4" /> Categories</button>
          <button onClick={() => setDocSettingsOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]"><Settings className="w-4 h-4" /> Settings</button>
          <button onClick={openUpload} className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] rounded-lg text-[13px] font-medium text-white hover:bg-[#2563EB]"><Upload className="w-4 h-4" /> Upload Document</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#64748B]">{s.title}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}1a` }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-[28px] font-bold text-[#1E293B]">{s.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {s.subColor === "#10B981" && <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />}
                <span className="text-[12px] font-medium" style={{ color: s.subColor }}>{s.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search documents by name, type, or keyword..." className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6]" />
            </div>
            <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
              <option value="">All Document Types</option>
              {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={whFilter} onChange={(e) => { setWhFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
              <option value="">All Warehouses</option>
              {WAREHOUSES.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <button onClick={() => { setCatFilter(""); setTypeFilter(""); setWhFilter(""); setQuery(""); setPage(1); toast("Filters cleared", "info"); }} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]"><SlidersHorizontal className="w-4 h-4" /> Clear</button>
        </div>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-5 py-3">
            <span className="text-[12px] text-[#94A3B8]">Active filters:</span>
            {activeFilters.map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-[#3B82F6]/10 text-[#3B82F6] text-[12px] font-medium rounded-full">
                {f.label}
                <button onClick={f.clear} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#3B82F6]/20" aria-label={`Clear ${f.label}`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button onClick={() => { setCatFilter(""); setTypeFilter(""); setWhFilter(""); setPage(1); }} className="text-[12px] font-medium text-[#64748B] hover:text-[#1E293B] hover:underline">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main: table + right rail */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 290px" }}>
        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Document Name", "Category", "Type", "Warehouse", "Uploaded By", "Date", "Size", ""].map((h, i) => (
                    <th key={i} className={`text-[12px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3 ${i === 7 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((d) => (
                  <tr key={d.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <TypeIcon type={d.type} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-[#1E293B] truncate">{d.name}</p>
                          <p className="text-[12px] text-[#94A3B8] mt-0.5 truncate">{d.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2.5 py-1 text-[12px] font-medium rounded-full" style={{ backgroundColor: `${d.catColor}1a`, color: d.catColor }}>{d.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{d.type}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{d.warehouse}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white" style={{ backgroundColor: d.avatarColor }}>{d.uploadedBy.split(" ").map((n) => n[0]).join("")}</div>
                        <span className="text-[13px] text-[#1E293B]">{d.uploadedBy}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{d.date}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{d.size}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setOpenMenu(openMenu === d.id ? null : d.id)} className="text-[#94A3B8] hover:text-[#64748B]" aria-label="Document actions">
                          <MoreVertical className="w-4 h-4 inline" />
                        </button>
                        {openMenu === d.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 mt-1 z-20 w-40 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1 text-left">
                              <button onClick={() => { setOpenMenu(null); downloadDoc(d); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#374151] hover:bg-[#F8FAFC] flex items-center gap-2"><Download className="w-3.5 h-3.5" /> Download</button>
                              <button onClick={() => { setOpenMenu(null); setCopied(false); setSharing(d); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#374151] hover:bg-[#F8FAFC] flex items-center gap-2"><Share2 className="w-3.5 h-3.5" /> Share</button>
                              <button onClick={() => archiveDoc(d)} className="w-full text-left px-3 py-1.5 text-[13px] text-[#374151] hover:bg-[#F8FAFC] flex items-center gap-2"><Archive className="w-3.5 h-3.5" /> {d.status === "Archived" ? "Restore" : "Archive"}</button>
                              <div className="my-1 border-t border-[#E2E8F0]" />
                              <button onClick={() => { setOpenMenu(null); setDeleting(d); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <span className="inline-flex items-center gap-2 text-[13px] text-[#64748B]"><Loader className="w-4 h-4 animate-spin text-[#3B82F6]" /> Loading documents…</span>
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <p className="text-[13px] text-[#64748B]">No documents match your filters.</p>
                      <button onClick={openUpload} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] hover:underline"><Upload className="w-4 h-4" /> Upload a document</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
            <span className="text-[13px] text-[#64748B]">
              {filtered.length === 0
                ? "Showing 0 of 0 documents"
                : `Showing ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} of ${filtered.length.toLocaleString()} documents`}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Previous page">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-[13px] font-medium text-[#1E293B] whitespace-nowrap">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Next page">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom CTA banner */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center shrink-0"><Folder className="w-4 h-4 text-[#3B82F6]" /></div>
              <div>
                <p className="text-[13px] font-medium text-[#1E293B]">Keep your documents organized</p>
                <p className="text-[12px] text-[#64748B] mt-0.5">Create categories and folders to streamline access.</p>
              </div>
            </div>
            <button onClick={openCategories} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] hover:bg-white"><Folder className="w-4 h-4" /> Manage Categories</button>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {/* Documents by Category */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-4">Documents by Category</h3>
            <div className="flex justify-center mb-4">
              <div className="relative w-[130px] h-[130px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {byCategory.map((c, i) => {
                    const offset = byCategory.slice(0, i).reduce((s, x) => s + x.pct, 0);
                    const dash = `${(c.pct / 100) * C} ${C - (c.pct / 100) * C}`;
                    return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={c.color} strokeWidth="12" strokeDasharray={dash} strokeDashoffset={-(offset / 100) * C} />;
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[18px] font-bold text-[#1E293B]">1,248</p>
                  <p className="text-[10px] text-[#94A3B8]">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {byCategory.map((c) => (
                <div key={c.label} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} /><span className="text-[#64748B]">{c.label}</span></div>
                  <span className="font-medium text-[#1E293B]">{c.pct}% ({c.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Recent Uploads</h3>
              <button onClick={() => setUploadsOpen(true)} className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {recentUploads.map((u) => {
                const Icon = u.icon;
                return (
                  <div key={u.name} className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${u.color}1a` }}><Icon className="w-4 h-4" style={{ color: u.color }} /></div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[#1E293B] truncate">{u.name}</p>
                      <p className="text-[11px] text-[#94A3B8]">{u.meta}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Storage Usage */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[14px] font-semibold text-[#1E293B]">Storage Usage</h3>
              <span className="text-[12px] font-medium text-[#1E293B]">86%</span>
            </div>
            <p className="text-[12px] text-[#94A3B8] mb-3">8.6 GB of 10 GB used</p>
            <div className="space-y-2.5 mb-4">
              {storageUsage.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-[12px] text-[#64748B] w-20 shrink-0">{s.label}</span>
                  <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} /></div>
                  <span className="text-[12px] font-medium text-[#1E293B] w-12 text-right shrink-0">{s.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStorageOpen(true)} className="w-full py-2 bg-[#3B82F6] rounded-lg text-[13px] font-medium text-white hover:bg-[#2563EB]">Manage Storage</button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-3">Quick Actions</h3>
            <div className="space-y-1">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.label} onClick={() => runQuickAction(a.action)} className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F8FAFC] text-left transition-colors">
                    <Icon className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span className="text-[13px] font-medium text-[#1E293B]">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Upload modal */}
      <Modal
        open={uploadOpen}
        onClose={() => { setUploadOpen(false); setPendingFiles([]); }}
        title="Upload Document"
        description={`${pendingFiles.length} file${pendingFiles.length === 1 ? "" : "s"} selected — confirm details below.`}
        footer={
          <>
            <SecondaryButton onClick={() => { setUploadOpen(false); setPendingFiles([]); }}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveUpload} disabled={busy}>
              {busy ? "Uploading…" : `Upload ${pendingFiles.length} file${pendingFiles.length === 1 ? "" : "s"}`}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="border border-[#E2E8F0] rounded-lg divide-y divide-[#E2E8F0]">
            {pendingFiles.map((f) => (
              <div key={f.name} className="flex items-center gap-3 px-3 py-2.5">
                <TypeIcon type={f.type} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-[#1E293B] truncate">{f.name}</p>
                  <p className="text-[11px] text-[#94A3B8]">{f.type} · {f.size}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <Select options={CATEGORIES} value={upload.category} onChange={(e) => setUpload((u) => ({ ...u, category: e.target.value }))} />
            </Field>
            <Field label="Warehouse">
              <Select options={WAREHOUSES} value={upload.warehouse} onChange={(e) => setUpload((u) => ({ ...u, warehouse: e.target.value }))} />
            </Field>
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-[#E2E8F0] rounded-lg px-4 py-5 text-center hover:border-[#3B82F6] hover:bg-[#F8FAFC] transition-colors">
            <Upload className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" />
            <p className="text-[12px] text-[#64748B]">Choose different files…</p>
          </button>
        </div>
      </Modal>

      {/* Share modal */}
      <Modal
        open={!!sharing}
        onClose={() => setSharing(null)}
        title="Share document"
        description={sharing ? `Anyone with this link can view "${sharing.name}".` : undefined}
        size="sm"
        footer={<SecondaryButton onClick={() => setSharing(null)}>Done</SecondaryButton>}
      >
        {sharing && (
          <Field label="Share link">
            <div className="flex items-center gap-2">
              <TextInput value={shareLinkFor(sharing)} readOnly onFocus={(e) => e.target.select()} />
              <PrimaryButton onClick={copyShareLink} className="shrink-0 flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" /> {copied ? "Copied" : "Copy"}
              </PrimaryButton>
            </div>
          </Field>
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete document"
        message={`Delete "${deleting?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />

      {/* Shared links modal */}
      <Modal
        open={linksOpen}
        onClose={() => setLinksOpen(false)}
        title="Shared links"
        description="Every document below has a public view link. Copy a link to share it."
        size="lg"
        footer={<SecondaryButton onClick={() => setLinksOpen(false)}>Done</SecondaryButton>}
      >
        {docs.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-[#64748B]">No documents to share yet.</div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-lg divide-y divide-[#E2E8F0] max-h-[420px] overflow-y-auto">
            {docs.map((d) => {
              const link = shareLinkFor(d);
              return (
                <div key={d.id} className="flex items-center gap-3 px-3 py-2.5">
                  <TypeIcon type={d.type} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-[#1E293B] truncate">{d.name}</p>
                    <p className="text-[11px] text-[#94A3B8] truncate">{link}</p>
                  </div>
                  <button
                    onClick={() => copyLink(link)}
                    className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC]"
                  >
                    {copiedLink === link ? <><Check className="w-3.5 h-3.5 text-[#10B981]" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy link</>}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Recycle bin modal */}
      <Modal
        open={recycleOpen}
        onClose={() => setRecycleOpen(false)}
        title="Recycle bin"
        description="Documents you delete in this session can be restored here."
        footer={<SecondaryButton onClick={() => setRecycleOpen(false)}>Close</SecondaryButton>}
      >
        {recycled.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3"><Trash2 className="w-5 h-5 text-[#94A3B8]" /></div>
            <p className="text-[13px] font-medium text-[#1E293B]">The recycle bin is empty</p>
            <p className="text-[12px] text-[#94A3B8] mt-1">Deleted documents will appear here so you can restore them.</p>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-lg divide-y divide-[#E2E8F0] max-h-[420px] overflow-y-auto">
            {recycled.map((d) => (
              <div key={d.id} className="flex items-center gap-3 px-3 py-2.5">
                <TypeIcon type={d.type} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-[#1E293B] truncate">{d.name}</p>
                  <p className="text-[11px] text-[#94A3B8] truncate">{d.desc} · {d.size}</p>
                </div>
                <button
                  onClick={() => restoreFromRecycle(d)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Manage categories modal */}
      <Modal
        open={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
        title="Manage Categories"
        description="Add or rename categories used to organize your documents."
        footer={
          <>
            <SecondaryButton onClick={() => setCategoriesOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveCategories} disabled={savingCats}>{savingCats ? "Saving…" : "Save categories"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="border border-[#E2E8F0] rounded-lg divide-y divide-[#E2E8F0] max-h-[320px] overflow-y-auto">
            {catList.map((c, i) => {
              const inUse = usedCategories.includes(c);
              return (
                <div key={i} className="flex items-center gap-2 px-3 py-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CAT_COLORS[c] ?? "#94A3B8" }} />
                  <TextInput value={c} onChange={(e) => renameCategory(i, e.target.value)} aria-label={`Category ${i + 1}`} />
                  {inUse && <span className="shrink-0 text-[11px] text-[#94A3B8]">in use</span>}
                  <button
                    onClick={() => removeCategory(i)}
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2]"
                    aria-label={`Remove ${c}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {catList.length === 0 && <div className="px-3 py-4 text-center text-[12px] text-[#94A3B8]">No categories yet — add one below.</div>}
          </div>
          <div className="flex items-center gap-2">
            <TextInput
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }}
              placeholder="New category name"
            />
            <PrimaryButton onClick={addCategory} className="shrink-0 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add</PrimaryButton>
          </div>
        </div>
      </Modal>

      {/* Document settings modal */}
      <Modal
        open={docSettingsOpen}
        onClose={() => setDocSettingsOpen(false)}
        title="Document settings"
        description="Choose how documents are displayed by default."
        footer={
          <>
            <SecondaryButton onClick={() => setDocSettingsOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveDocSettings} disabled={savingSettings}>{savingSettings ? "Saving…" : "Save settings"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Default view">
            <Select
              options={["List", "Grid", "Compact"]}
              value={docSettings.defaultView}
              onChange={(e) => setDocSettings((s) => ({ ...s, defaultView: e.target.value }))}
            />
          </Field>
          <Field label="Default sort">
            <Select
              options={["Date (newest)", "Date (oldest)", "Name (A–Z)", "Size (largest)"]}
              value={docSettings.defaultSort}
              onChange={(e) => setDocSettings((s) => ({ ...s, defaultSort: e.target.value }))}
            />
          </Field>
        </div>
      </Modal>

      {/* All uploads drawer */}
      <Drawer
        open={uploadsOpen}
        onClose={() => setUploadsOpen(false)}
        title="All uploads"
        subtitle={`${docs.length} document${docs.length === 1 ? "" : "s"} stored`}
        footer={<SecondaryButton onClick={() => setUploadsOpen(false)}>Close</SecondaryButton>}
      >
        {docs.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3"><Inbox className="w-5 h-5 text-[#94A3B8]" /></div>
            <p className="text-[13px] text-[#64748B]">No uploads yet.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {docs.map((d) => (
              <div key={d.id} className="flex items-center gap-3 py-2 border-b border-[#F3F4F6] last:border-b-0">
                <TypeIcon type={d.type} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-[#1E293B] truncate">{d.name}</p>
                  <p className="text-[11px] text-[#94A3B8] truncate">{d.warehouse} · {d.category} · {d.date}</p>
                </div>
                <button
                  onClick={() => downloadDoc(d)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#F8FAFC]"
                  aria-label={`Download ${d.name}`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Drawer>

      {/* Storage management modal */}
      <Modal
        open={storageOpen}
        onClose={() => setStorageOpen(false)}
        title="Storage management"
        description="Usage computed from your loaded documents."
        footer={<SecondaryButton onClick={() => setStorageOpen(false)}>Close</SecondaryButton>}
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center shrink-0"><HardDrive className="w-5 h-5 text-[#3B82F6]" /></div>
            <div>
              <p className="text-[12px] text-[#64748B]">Total used by {docs.length} document{docs.length === 1 ? "" : "s"}</p>
              <p className="text-[20px] font-bold text-[#1E293B]">{formatBytesLong(storageStats.totalBytes)}</p>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-[#1E293B] mb-2">By category</h4>
            {storageStats.byCategory.length === 0 ? (
              <p className="text-[12px] text-[#94A3B8]">No documents to measure.</p>
            ) : (
              <div className="space-y-2.5">
                {storageStats.byCategory.map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span className="text-[12px] text-[#64748B] w-20 shrink-0 truncate">{r.label}</span>
                    <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${r.pct}%`, backgroundColor: CAT_COLORS[r.label] ?? "#3B82F6" }} /></div>
                    <span className="text-[12px] font-medium text-[#1E293B] w-20 text-right shrink-0">{formatBytesLong(r.bytes)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-[#1E293B] mb-2">By file type</h4>
            {storageStats.byType.length === 0 ? (
              <p className="text-[12px] text-[#94A3B8]">No documents to measure.</p>
            ) : (
              <div className="space-y-2.5">
                {storageStats.byType.map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span className="text-[12px] text-[#64748B] w-20 shrink-0 truncate">{r.label}</span>
                    <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#10B981]" style={{ width: `${r.pct}%` }} /></div>
                    <span className="text-[12px] font-medium text-[#1E293B] w-20 text-right shrink-0">{formatBytesLong(r.bytes)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
