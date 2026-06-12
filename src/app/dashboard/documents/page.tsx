"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";

const stats = [
  { title: "Total Documents", value: "1,248", sub: "12.6% vs last 30 days", subColor: "#10B981", icon: Folder, color: "#3B82F6" },
  { title: "By Me", value: "236", sub: "18.9% of total", subColor: "#94A3B8", icon: CheckCircle2, color: "#10B981" },
  { title: "Shared with Me", value: "312", sub: "25.0% of total", subColor: "#94A3B8", icon: Share2, color: "#8B5CF6" },
  { title: "Important", value: "156", sub: "12.5% of total", subColor: "#94A3B8", icon: Star, color: "#F59E0B" },
  { title: "Archived", value: "544", sub: "43.6% of total", subColor: "#94A3B8", icon: Archive, color: "#64748B" },
];

type DocType = "PDF" | "XLSX" | "DOCX";

interface Doc {
  id: number;
  name: string;
  desc: string;
  category: string;
  catColor: string;
  type: DocType;
  warehouse: string;
  uploadedBy: string;
  avatarColor: string;
  date: string;
  size: string;
}

const CATEGORIES = ["SOP", "Policy", "Template", "Report", "Contract", "Checklist"];
const CAT_COLORS: Record<string, string> = {
  SOP: "#3B82F6", Policy: "#F59E0B", Template: "#06B6D4", Report: "#10B981", Contract: "#EF4444", Checklist: "#8B5CF6",
};
const DOC_TYPES: DocType[] = ["PDF", "XLSX", "DOCX"];
const WAREHOUSES = ["ATL1", "DFW1", "LAX1", "MIA1", "Global"];

const initialDocuments: Doc[] = [
  { id: 1, name: "Inbound Shipments SOP", desc: "Standard operating procedures...", category: "SOP", catColor: "#3B82F6", type: "PDF", warehouse: "ATL1", uploadedBy: "James Carter", avatarColor: "#3B82F6", date: "May 30, 2025", size: "1.2 MB" },
  { id: 2, name: "Inventory Template", desc: "Monthly inventory tracking", category: "Template", catColor: "#06B6D4", type: "XLSX", warehouse: "Global", uploadedBy: "Sophie Lee", avatarColor: "#8B5CF6", date: "May 29, 2025", size: "85 KB" },
  { id: 3, name: "Warehouse Safety Guide", desc: "Safety guidelines and protocols", category: "Policy", catColor: "#F59E0B", type: "PDF", warehouse: "DFW1", uploadedBy: "Michael Brown", avatarColor: "#10B981", date: "May 28, 2025", size: "3.4 MB" },
  { id: 4, name: "Employee Handbook", desc: "Company policies and procedures", category: "Policy", catColor: "#F59E0B", type: "DOCX", warehouse: "Global", uploadedBy: "Ava Thomas", avatarColor: "#EC4899", date: "May 27, 2025", size: "2.1 MB" },
  { id: 5, name: "Client Onboarding Checklist", desc: "Onboarding steps for new clients", category: "Checklist", catColor: "#8B5CF6", type: "PDF", warehouse: "MIA1", uploadedBy: "Ethan Taylor", avatarColor: "#3B82F6", date: "May 26, 2025", size: "640 KB" },
  { id: 6, name: "Cycle Count Log", desc: "Quarterly cycle count records", category: "Report", catColor: "#10B981", type: "XLSX", warehouse: "LAX1", uploadedBy: "Olivia Martinez", avatarColor: "#F97316", date: "May 25, 2025", size: "1.8 MB" },
  { id: 7, name: "Returns Process Flow", desc: "RMA handling and refunds", category: "SOP", catColor: "#3B82F6", type: "PDF", warehouse: "DFW1", uploadedBy: "Daniel Wilson", avatarColor: "#06B6D4", date: "May 24, 2025", size: "920 KB" },
  { id: 8, name: "Carrier Rate Card 2025", desc: "Negotiated carrier pricing", category: "Contract", catColor: "#EF4444", type: "PDF", warehouse: "Global", uploadedBy: "Isabella White", avatarColor: "#8B5CF6", date: "May 23, 2025", size: "512 KB" },
  { id: 9, name: "Packaging Specifications", desc: "Box and label specifications", category: "Template", catColor: "#06B6D4", type: "DOCX", warehouse: "ATL1", uploadedBy: "Liam Anderson", avatarColor: "#10B981", date: "May 22, 2025", size: "1.1 MB" },
];

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

function TypeIcon({ type }: { type: DocType }) {
  if (type === "XLSX") return <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 flex items-center justify-center shrink-0"><FileSpreadsheet className="w-4 h-4 text-[#10B981]" /></div>;
  if (type === "DOCX") return <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center shrink-0"><FileType className="w-4 h-4 text-[#3B82F6]" /></div>;
  return <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-[#EF4444]" /></div>;
}

type UploadDraft = { name: string; category: string; type: DocType; warehouse: string };
const emptyUpload: UploadDraft = { name: "", category: "SOP", type: "PDF", warehouse: "ATL1" };

let docSeq = 1000;

export default function DocumentsPage() {
  const { toast } = useToast();
  const C = 2 * Math.PI * 40;

  const [docs, setDocs] = useState<Doc[]>(initialDocuments);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [whFilter, setWhFilter] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [upload, setUpload] = useState<UploadDraft>(emptyUpload);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<Doc | null>(null);

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

  function openUpload() {
    setUpload(emptyUpload);
    setUploadOpen(true);
  }

  function saveUpload() {
    if (!upload.name.trim()) { toast("Document name is required", "error"); return; }
    setBusy(true);
    const ext = upload.type.toLowerCase();
    const name = upload.name.trim();
    const created: Doc = {
      id: ++docSeq,
      name,
      desc: `Uploaded ${upload.category.toLowerCase()} document`,
      category: upload.category,
      catColor: CAT_COLORS[upload.category] ?? "#3B82F6",
      type: upload.type,
      warehouse: upload.warehouse,
      uploadedBy: "You",
      avatarColor: "#3B82F6",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      size: `${(Math.random() * 2 + 0.2).toFixed(1)} MB`,
    };
    setDocs((prev) => [created, ...prev]);
    setBusy(false);
    setUploadOpen(false);
    toast(`"${name}.${ext}" uploaded`);
  }

  function confirmDelete() {
    if (!deleting) return;
    setDocs((cur) => cur.filter((d) => d.id !== deleting.id));
    toast(`"${deleting.name}" deleted`);
    setDeleting(null);
  }

  const quickActions: { label: string; icon: typeof Upload; onClick: () => void }[] = [
    { label: "Upload Document", icon: Upload, onClick: openUpload },
    { label: "Create Folder", icon: FolderPlus, onClick: () => toast("New folder created", "success") },
    { label: "Request Document", icon: FileInput, onClick: () => toast("Document request sent", "info") },
    { label: "Shared Links", icon: Link2, onClick: () => toast("Opening shared links…", "info") },
    { label: "Recycle Bin", icon: Trash2, onClick: () => toast("Opening recycle bin…", "info") },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Documents</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Store, manage, and share important documents securely.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast("Managing categories…", "info")} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]"><Folder className="w-4 h-4" /> Categories</button>
          <button onClick={() => toast("Opening document settings…", "info")} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]"><Settings className="w-4 h-4" /> Settings</button>
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
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents by name, type, or keyword..." className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6]" />
            </div>
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
              <option value="">All Document Types</option>
              {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={whFilter} onChange={(e) => setWhFilter(e.target.value)} className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
              <option value="">All Warehouses</option>
              {WAREHOUSES.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <button onClick={() => { setCatFilter(""); setTypeFilter(""); setWhFilter(""); setQuery(""); toast("Filters cleared", "info"); }} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8FAFC]"><SlidersHorizontal className="w-4 h-4" /> Clear</button>
        </div>
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
                {filtered.map((d) => (
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
                              <button onClick={() => { setOpenMenu(null); toast(`Downloading "${d.name}"…`); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#374151] hover:bg-[#F8FAFC] flex items-center gap-2"><Download className="w-3.5 h-3.5" /> Download</button>
                              <button onClick={() => { setOpenMenu(null); toast(`Share link copied for "${d.name}"`); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#374151] hover:bg-[#F8FAFC] flex items-center gap-2"><Share2 className="w-3.5 h-3.5" /> Share</button>
                              <div className="my-1 border-t border-[#E2E8F0]" />
                              <button onClick={() => { setOpenMenu(null); setDeleting(d); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
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
            <span className="text-[13px] text-[#64748B]">Showing {filtered.length} of {docs.length} documents</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC]" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3B82F6] text-white text-[13px] font-medium">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC]" disabled>
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
            <button onClick={() => toast("Managing categories…", "info")} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#64748B] hover:bg-white"><Folder className="w-4 h-4" /> Manage Categories</button>
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
              <button onClick={() => toast("Opening all uploads…", "info")} className="text-[12px] font-medium text-[#3B82F6] hover:underline">View all</button>
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
            <button onClick={() => toast("Opening storage management…", "info")} className="w-full py-2 bg-[#3B82F6] rounded-lg text-[13px] font-medium text-white hover:bg-[#2563EB]">Manage Storage</button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
            <h3 className="text-[14px] font-semibold text-[#1E293B] mb-3">Quick Actions</h3>
            <div className="space-y-1">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.label} onClick={a.onClick} className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F8FAFC] text-left transition-colors">
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
        onClose={() => setUploadOpen(false)}
        title="Upload Document"
        description="Add a new document to your workspace."
        footer={
          <>
            <SecondaryButton onClick={() => setUploadOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveUpload} disabled={busy}>{busy ? "Uploading…" : "Upload"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Document name" required>
            <TextInput value={upload.name} onChange={(e) => setUpload((u) => ({ ...u, name: e.target.value }))} placeholder="e.g. Q3 Inventory Report" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <Select options={CATEGORIES} value={upload.category} onChange={(e) => setUpload((u) => ({ ...u, category: e.target.value }))} />
            </Field>
            <Field label="File type">
              <Select options={DOC_TYPES} value={upload.type} onChange={(e) => setUpload((u) => ({ ...u, type: e.target.value as DocType }))} />
            </Field>
          </div>
          <Field label="Warehouse">
            <Select options={WAREHOUSES} value={upload.warehouse} onChange={(e) => setUpload((u) => ({ ...u, warehouse: e.target.value }))} />
          </Field>
          <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg px-4 py-6 text-center">
            <Upload className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" />
            <p className="text-[12px] text-[#64748B]">Drag &amp; drop a file here, or it will be simulated on upload.</p>
          </div>
        </div>
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
    </div>
  );
}
