"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Settings,
  Edit,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  AtSign,
  Send,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  ShoppingCart,
  Share2,
  Mail,
  MailOpen,
  BellOff,
  Archive,
  Trash2,
  FileText,
  Plus,
  MessageSquare,
  Loader,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { Drawer } from "@/components/dashboard/Drawer";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, TextArea, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";
import type { Message as MessageRecord } from "@/types";

type MsgStatus = MessageRecord["status"];

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  color: string;
  subject: string;
  preview: string;
  time: string;
  channel: string;
  status: MsgStatus;
  unread: number;
}

interface Message {
  id: string;
  sender: string;
  isMe: boolean;
  time: string;
  content: string;
}

const CONVO_COLORS = ["#0057D8", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4", "#7C3AED", "#F97316", "#EF4444", "#64748B"];

function colorForName(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return CONVO_COLORS[h % CONVO_COLORS.length];
}

function initials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function relTime(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function fullTime(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// Map a Message record from the API into a left-rail conversation view model.
function toConversation(rec: MessageRecord): Conversation {
  return {
    id: rec.id,
    name: rec.sender,
    avatar: initials(rec.sender),
    color: colorForName(rec.sender),
    subject: rec.subject,
    preview: rec.preview,
    time: relTime(rec.createdAt),
    channel: rec.channel,
    status: rec.status,
    unread: rec.status === "Unread" ? 1 : 0,
  };
}

const participants = [
  { name: "James Carter", role: "Operations Manager", avatar: "JC", color: "#0057D8", online: true },
  { name: "You", role: "Operations Team", avatar: "ME", color: "#10B981", online: true },
];

const sharedFiles = [
  { name: "PO-102876_Details.pdf", meta: "PDF · 248 KB" },
  { name: "Shipment_Schedule.xlsx", meta: "XLSX · 64 KB" },
];

const quickActions = [
  { label: "Create Task", icon: CheckSquare },
  { label: "Create Order", icon: ShoppingCart },
  { label: "Share Document", icon: Share2 },
  { label: "Mark as Unread", icon: Mail },
  { label: "Mute Conversation", icon: BellOff },
];

const SIMULATED_REPLIES = [
  "Got it — thanks for the update.",
  "Noted. I'll follow up on this shortly.",
  "Thanks! That works on our end.",
  "Understood, appreciate the quick response.",
];

type ComposeDraft = { recipient: string; subject: string; body: string };

interface MessageSettings {
  defaultChannel: string;
  sendOnEnter: boolean;
  showReadReceipts: boolean;
  autoArchiveResolved: boolean;
}
const defaultMsgSettings: MessageSettings = {
  defaultChannel: "Email",
  sendOnEnter: true,
  showReadReceipts: true,
  autoArchiveResolved: false,
};

interface NotificationSettings {
  desktopAlerts: boolean;
  emailDigest: boolean;
  mentionsOnly: boolean;
  soundEnabled: boolean;
}
const defaultNotifSettings: NotificationSettings = {
  desktopAlerts: true,
  emailDigest: false,
  mentionsOnly: false,
  soundEnabled: true,
};

const MESSAGE_CHANNELS = ["Email", "SMS", "In-app", "Slack"];

// A small reusable toggle row for settings modals.
function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-text-primary">{label}</p>
        <p className="text-[12px] text-text-light">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${checked ? "bg-action-blue" : "bg-[#D1D5DB]"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
      </button>
    </div>
  );
}

export default function MessagesPage() {
  const { toast } = useToast();
  const [selected, setSelected] = useState("");
  const [tab, setTab] = useState<"All" | "Unread">("All");
  const [composeTab, setComposeTab] = useState<"Message" | "Note">("Message");
  const [query, setQuery] = useState("");
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<Conversation | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compose modal
  const [composeOpen, setComposeOpen] = useState(false);
  const [compose, setCompose] = useState<ComposeDraft>({ recipient: "", subject: "", body: "" });

  // Settings modals
  const [msgSettingsOpen, setMsgSettingsOpen] = useState(false);
  const [msgSettings, setMsgSettings] = useState<MessageSettings>(defaultMsgSettings);
  const [notifSettingsOpen, setNotifSettingsOpen] = useState(false);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(defaultNotifSettings);
  const [savingSettings, setSavingSettings] = useState(false);

  // Shared files drawer
  const [filesOpen, setFilesOpen] = useState(false);

  // Track the active thread for simulated replies, and clean up pending timers.
  const selectedRef = useRef(selected);
  useEffect(() => { selectedRef.current = selected; }, [selected]);
  const replyTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const timers = replyTimersRef.current;
    return () => { timers.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: MessageRecord[]; total: number }>("/api/messages");
        if (cancelled) return;
        const records = res?.data ?? [];
        const mapped = records.map(toConversation);
        setConvos(mapped);
        // Seed each thread with its originating message as a single inbound bubble.
        const seeded: Record<string, Message[]> = {};
        for (const rec of records) {
          seeded[rec.id] = [{ id: `${rec.id}-0`, sender: rec.sender, isMe: false, time: fullTime(rec.createdAt), content: rec.preview }];
        }
        setThreads(seeded);
        if (mapped.length > 0) setSelected(mapped[0].id);
      } catch {
        if (!cancelled) toast("Failed to load messages", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToPage(p: number) {
    if (p < 1 || p > 7) return;
    setPage(p);
    toast(`Page ${p} of 7`, "info");
  }

  const totalUnread = convos.reduce((sum, c) => sum + c.unread, 0);

  const visibleConvos = useMemo(() => {
    const q = query.trim().toLowerCase();
    return convos.filter((c) => {
      const matchesTab = tab === "All" || c.unread > 0;
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [convos, tab, query]);

  const activeConvo = convos.find((c) => c.id === selected) ?? convos[0] ?? null;
  const activeMessages = threads[selected] ?? [];

  // Auto-scroll to the latest message when a thread is opened or grows.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [selected, activeMessages.length]);

  function selectConversation(id: string) {
    setSelected(id);
    const convo = convos.find((c) => c.id === id);
    setConvos((cur) => cur.map((c) => (c.id === id ? { ...c, unread: 0, status: c.status === "Unread" ? "Read" : c.status } : c)));
    // Persist mark-as-read only when transitioning out of Unread.
    if (convo?.status === "Unread") {
      api.put<MessageRecord>(`/api/messages/${id}`, { status: "Read" }).catch(() => toast("Failed to mark as read", "error"));
    }
  }

  function setMessageStatus(id: string, status: MsgStatus, label: string) {
    setOpenMenu(null);
    const prev = convos.find((c) => c.id === id)?.status;
    setConvos((cur) => cur.map((c) => (c.id === id ? { ...c, status, unread: status === "Unread" ? 1 : 0 } : c)));
    api.put<MessageRecord>(`/api/messages/${id}`, { status })
      .then(() => toast(label))
      .catch(() => {
        if (prev) setConvos((cur) => cur.map((c) => (c.id === id ? { ...c, status: prev, unread: prev === "Unread" ? 1 : 0 } : c)));
        toast("Failed to update message", "error");
      });
  }

  function confirmDelete() {
    if (!deleting) return;
    const target = deleting;
    setDeleting(null);
    setConvos((cur) => {
      const next = cur.filter((c) => c.id !== target.id);
      if (selectedRef.current === target.id) setSelected(next[0]?.id ?? "");
      return next;
    });
    setThreads((cur) => {
      const next = { ...cur };
      delete next[target.id];
      return next;
    });
    api.del(`/api/messages/${target.id}`)
      .then(() => toast(`Conversation with ${target.name} deleted`))
      .catch(() => toast("Failed to delete conversation", "error"));
  }

  function nowStamp() {
    return new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function scheduleReply(threadId: string, senderName: string, replyIndex: number) {
    const timer = setTimeout(() => {
      const reply: Message = {
        id: `m${Date.now()}-reply`,
        sender: senderName,
        isMe: false,
        time: nowStamp(),
        content: SIMULATED_REPLIES[replyIndex % SIMULATED_REPLIES.length],
      };
      setThreads((cur) => ({ ...cur, [threadId]: [...(cur[threadId] ?? []), reply] }));
      setConvos((cur) =>
        cur.map((c) =>
          c.id === threadId
            ? {
                ...c,
                preview: reply.content,
                time: "Now",
                unread: selectedRef.current === threadId ? 0 : c.unread + 1,
              }
            : c,
        ),
      );
    }, 1500);
    replyTimersRef.current.push(timer);
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text || !activeConvo) return;
    const msg: Message = { id: `m${Date.now()}`, sender: "You", isMe: true, time: nowStamp(), content: text };
    const threadId = selected;
    const messageCount = (threads[threadId] ?? []).length;
    setThreads((cur) => ({ ...cur, [threadId]: [...(cur[threadId] ?? []), msg] }));
    setConvos((cur) => cur.map((c) => (c.id === threadId ? { ...c, preview: text, time: "Now" } : c)));
    setDraft("");
    toast(composeTab === "Note" ? "Internal note added" : "Message sent");
    if (composeTab !== "Note") {
      scheduleReply(threadId, activeConvo.name, messageCount);
    }
  }

  function openCompose() {
    setCompose({ recipient: convos[0]?.name ?? "", subject: "", body: "" });
    setComposeOpen(true);
  }

  // Compose persists a new Message record (a fresh inbound conversation thread).
  function createThread() {
    if (!compose.recipient.trim()) { toast("Choose a recipient", "error"); return; }
    if (!compose.subject.trim()) { toast("Subject is required", "error"); return; }
    if (!compose.body.trim()) { toast("Message body is required", "error"); return; }
    const recipient = compose.recipient.trim();
    const subject = compose.subject.trim();
    const body = compose.body.trim();
    setComposeOpen(false);
    api.post<MessageRecord>("/api/messages", {
      sender: recipient,
      subject,
      preview: body,
      channel: "Email",
      status: "Read",
    })
      .then((rec) => {
        const convo = toConversation(rec);
        setConvos((cur) => [convo, ...cur]);
        setThreads((cur) => ({ ...cur, [convo.id]: [{ id: `m${Date.now()}`, sender: "You", isMe: true, time: nowStamp(), content: body }] }));
        setSelected(convo.id);
        toast(`Message sent to ${recipient}`);
        scheduleReply(convo.id, recipient, 0);
      })
      .catch(() => toast("Failed to send message", "error"));
  }

  // Persist message channel preferences to the settings API.
  function saveMessageSettings() {
    setSavingSettings(true);
    api.put("/api/settings", { messages: { ...msgSettings } })
      .then(() => { toast("Message settings saved"); setMsgSettingsOpen(false); })
      .catch(() => toast("Failed to save message settings", "error"))
      .finally(() => setSavingSettings(false));
  }

  // Persist notification toggles to the settings API.
  function saveNotificationSettings() {
    setSavingSettings(true);
    api.put("/api/settings", { messages: { notifications: { ...notifSettings } } })
      .then(() => { toast("Notification settings saved"); setNotifSettingsOpen(false); })
      .catch(() => toast("Failed to save notification settings", "error"))
      .finally(() => setSavingSettings(false));
  }

  // Generate and download a small text stub for a shared file (real client download).
  function downloadSharedFile(file: { name: string; meta: string }) {
    const stub = [
      `FulfillMesh — Shared File`,
      `==========================`,
      ``,
      `File name: ${file.name}`,
      `Details:   ${file.meta}`,
      `Conversation: ${activeConvo?.name ?? "—"}${activeConvo?.subject ? ` (${activeConvo.subject})` : ""}`,
      `Generated: ${nowStamp()}`,
      ``,
      `This is a generated placeholder for the shared document.`,
      `In production this download streams the original file contents.`,
    ].join("\n");
    const base = file.name.replace(/\.[^.]+$/, "");
    const blob = new Blob([stub], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${base}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast(`Downloaded ${base}.txt`);
  }

  function handleComposerKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <nav className="flex items-center gap-1.5 mb-1.5 text-[12px]">
            <a href="/dashboard" className="text-text-muted hover:text-action-blue">Dashboard</a>
            <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            <span className="font-medium text-text-primary">Messages</span>
          </nav>
          <h1 className="text-[24px] font-semibold text-text-primary flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-action-blue" />
            Messages / Inbox
            {totalUnread > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded-full bg-action-blue text-white">{totalUnread}</span>
            )}
          </h1>
          <p className="text-[14px] text-text-body mt-1">Communicate with your team and partners in real time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setMsgSettingsOpen(true)} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-muted shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={openCompose} className="flex items-center gap-2 px-4 py-2 bg-action-blue rounded-lg text-[13px] font-medium text-white hover:bg-[#0048B5] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors">
            <Edit className="w-4 h-4" /> Compose
          </button>
        </div>
      </div>

      {/* Three-column shell */}
      <div className="bg-white rounded-xl border border-border-soft shadow-soft overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: "280px 1fr 300px", height: "calc(100vh - 300px)", minHeight: "540px" }}>
          {/* Left: conversation list */}
          <div className="border-r border-border-soft flex flex-col min-h-0 bg-white">
            <div className="p-3 border-b border-border-soft space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-9 pr-3 py-2 bg-soft-bg border border-border-soft rounded-lg text-[13px] text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue"
                  />
                </div>
                <button onClick={() => setTab(tab === "Unread" ? "All" : "Unread")} className="w-9 h-9 flex items-center justify-center bg-soft-bg border border-border-soft rounded-lg text-text-muted hover:bg-white transition-colors" aria-label="Toggle unread filter">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setTab("All")} className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${tab === "All" ? "bg-action-blue/10 text-action-blue" : "text-text-muted hover:bg-soft-bg"}`}>All</button>
                <button onClick={() => setTab("Unread")} className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${tab === "Unread" ? "bg-action-blue/10 text-action-blue" : "text-text-muted hover:bg-soft-bg"}`}>Unread ({totalUnread})</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <p className="px-4 py-8 text-center text-[12px] text-text-light"><Loader className="w-4 h-4 animate-spin text-action-blue inline-block mr-1.5" />Loading messages…</p>
              )}
              {!loading && visibleConvos.map((c) => (
                <div
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={`group relative w-full flex items-start gap-3 px-4 py-3 text-left border-b border-border-soft/50 hover:bg-soft-bg/50 transition-colors cursor-pointer ${
                    selected === c.id ? "bg-action-blue/5 border-l-2 border-l-action-blue" : "border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold text-white shrink-0 border-2 border-white shadow-sm" style={{ backgroundColor: c.color }}>{c.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[13px] truncate ${c.unread > 0 ? "font-semibold text-text-primary" : "font-medium text-text-primary"}`}>{c.name}</span>
                      <span className="text-[11px] text-text-light shrink-0 ml-2">{c.time}</span>
                    </div>
                    <p className={`text-[12px] truncate mt-0.5 ${c.unread > 0 ? "font-medium text-text-body" : "text-text-muted"}`}>{c.subject}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[12px] text-text-light truncate pr-2">{c.status === "Archived" ? "Archived · " : ""}{c.preview}</p>
                      {c.unread > 0 && (
                        <span className="shrink-0 bg-action-blue text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">{c.unread}</span>
                      )}
                    </div>
                  </div>
                  <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded text-text-light hover:bg-white transition-opacity" aria-label="Conversation actions"><SlidersHorizontal className="w-3.5 h-3.5" /></button>
                    {openMenu === c.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 mt-1 z-20 w-44 bg-white rounded-lg border border-border-soft shadow-lg py-1 text-left">
                          {c.status === "Unread" ? (
                            <button onClick={() => setMessageStatus(c.id, "Read", "Marked as read")} className="w-full text-left px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg flex items-center gap-2"><MailOpen className="w-3.5 h-3.5" /> Mark as read</button>
                          ) : (
                            <button onClick={() => setMessageStatus(c.id, "Unread", "Marked as unread")} className="w-full text-left px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Mark as unread</button>
                          )}
                          {c.status === "Archived" ? (
                            <button onClick={() => setMessageStatus(c.id, "Read", "Conversation restored")} className="w-full text-left px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg flex items-center gap-2"><Archive className="w-3.5 h-3.5" /> Unarchive</button>
                          ) : (
                            <button onClick={() => setMessageStatus(c.id, "Archived", "Conversation archived")} className="w-full text-left px-3 py-1.5 text-[13px] text-text-primary hover:bg-soft-bg flex items-center gap-2"><Archive className="w-3.5 h-3.5" /> Archive</button>
                          )}
                          <div className="my-1 border-t border-border-soft" />
                          <button onClick={() => { setOpenMenu(null); setDeleting(c); }} className="w-full text-left px-3 py-1.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {!loading && visibleConvos.length === 0 && (
                <p className="px-4 py-8 text-center text-[12px] text-text-light">No conversations found.</p>
              )}
            </div>
          </div>

          {/* Center: conversation */}
          <div className="flex flex-col min-h-0 bg-white">
            {/* Conversation header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full text-white text-[13px] font-semibold flex items-center justify-center" style={{ backgroundColor: activeConvo?.color }}>{activeConvo?.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[14px] font-semibold text-text-primary">{activeConvo?.name ?? "No conversation"}</h2>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-600">External</span>
                  </div>
                  <p className="text-[12px] text-text-light">{activeConvo?.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => activeConvo && toast(`Calling ${activeConvo.name}…`, "info")} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-soft-bg transition-colors" aria-label="Call"><Phone className="w-4 h-4" /></button>
                <button onClick={() => activeConvo && toast(`Starting video call with ${activeConvo.name}…`, "info")} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-soft-bg transition-colors" aria-label="Video call"><Video className="w-4 h-4" /></button>
                <button onClick={() => toast("Conversation details", "info")} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-soft-bg transition-colors" aria-label="Conversation info"><Info className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Subject line */}
            <div className="px-4 py-2.5 bg-soft-bg border-b border-border-soft">
              <p className="text-[13px] font-semibold text-text-primary">{activeConvo?.subject}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {activeMessages.map((m) => (
                <div key={m.id} className={`flex ${m.isMe ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[70%]">
                    <p className={`text-[11px] font-medium text-text-light mb-1 ${m.isMe ? "text-right" : "text-left"}`}>{m.sender} · {m.time.split(" ").slice(-2).join(" ")}</p>
                    <div className={`rounded-[18px] px-4 py-3 text-[13px] leading-relaxed ${m.isMe ? "bg-[#3B82F6] text-white rounded-br-sm shadow-sm" : "bg-white border border-border-soft text-text-primary rounded-bl-sm shadow-sm"}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <div className="border-t border-border-soft p-3">
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setComposeTab("Message")} className={`text-[13px] font-medium pb-1.5 border-b-2 transition-colors ${composeTab === "Message" ? "border-action-blue text-action-blue" : "border-transparent text-text-muted"}`}>Message</button>
                <button onClick={() => setComposeTab("Note")} className={`text-[13px] font-medium pb-1.5 border-b-2 transition-colors ${composeTab === "Note" ? "border-action-blue text-action-blue" : "border-transparent text-text-muted"}`}>Note</button>
              </div>
              <div className="border border-border-soft rounded-lg bg-white">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleComposerKey}
                  placeholder={composeTab === "Note" ? "Add an internal note..." : "Type your message..."}
                  rows={2}
                  className="w-full px-4 py-2.5 text-[13px] text-text-primary placeholder:text-text-light resize-none focus:outline-none rounded-t-lg"
                />
                <div className="flex items-center justify-between px-3 py-2 border-t border-border-soft bg-soft-bg rounded-b-lg">
                  <div className="flex items-center gap-3 text-text-light">
                    <button onClick={() => toast("Attach a file", "info")} className="hover:text-text-muted transition-colors" aria-label="Attach file"><Paperclip className="w-4 h-4" /></button>
                    <button onClick={() => setDraft((d) => d + " 🙂")} className="hover:text-text-muted transition-colors" aria-label="Add emoji"><Smile className="w-4 h-4" /></button>
                    <button onClick={() => setDraft((d) => d + " @")} className="hover:text-text-muted transition-colors" aria-label="Mention"><AtSign className="w-4 h-4" /></button>
                  </div>
                  <button onClick={sendMessage} disabled={!draft.trim() || !activeConvo} className="flex items-center gap-1.5 px-4 py-1.5 bg-action-blue rounded-lg text-[12px] font-medium text-white hover:bg-[#0048B5] transition-colors disabled:opacity-50">
                    Send <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: context panel */}
          <div className="border-l border-border-soft overflow-y-auto bg-soft-bg">
            {/* Conversation Details */}
            <div className="p-4 border-b border-border-soft">
              <h3 className="text-[13px] font-semibold text-text-primary mb-3">Conversation Details</h3>
              <div className="space-y-3 text-[12px]">
                <div className="flex items-center justify-between"><span className="text-text-muted">Type</span><span className="text-text-primary font-medium">Direct Message</span></div>
                <div className="flex items-center justify-between"><span className="text-text-muted">Status</span><span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full bg-teal/10 text-teal">Active</span></div>
                <div className="flex items-center justify-between"><span className="text-text-muted">Participants</span><span className="text-text-primary font-medium">2</span></div>
                <div className="flex items-center justify-between"><span className="text-text-muted">Created</span><span className="text-text-primary font-medium">May 30, 2025</span></div>
                <div className="flex items-center justify-between"><span className="text-text-muted">Last Update</span><span className="text-text-primary font-medium">May 30, 2025</span></div>
              </div>
            </div>

            {/* Participants */}
            <div className="p-4 border-b border-border-soft">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-text-primary">Participants (2)</h3>
                <button onClick={() => toast("Add a participant to this conversation", "info")} className="flex items-center gap-1 text-[11px] font-medium text-action-blue hover:underline"><Plus className="w-3 h-3" />Add</button>
              </div>
              <div className="space-y-3">
                {participants.map((p) => (
                  <div key={p.name} className="flex items-center gap-2.5">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white" style={{ backgroundColor: p.color }}>{p.avatar}</div>
                      {p.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal rounded-full border-2 border-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-text-primary truncate">{p.name}</p>
                      <p className="text-[11px] text-text-light truncate">{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Files */}
            <div className="p-4 border-b border-border-soft">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-text-primary">Shared Files (2)</h3>
                <button onClick={() => setFilesOpen(true)} className="text-[11px] font-medium text-action-blue hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {sharedFiles.map((f) => (
                  <button key={f.name} onClick={() => downloadSharedFile(f)} className="w-full text-left flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-action-blue" /></div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-text-primary truncate">{f.name}</p>
                      <p className="text-[11px] text-text-light">{f.meta}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4">
              <h3 className="text-[13px] font-semibold text-text-primary mb-3">Quick Actions</h3>
              <div className="space-y-1">
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.label}
                      onClick={() => toast(`${a.label} — done`)}
                      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] text-text-muted hover:bg-white transition-colors"
                    >
                      <Icon className="w-4 h-4 text-text-light" /> {a.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft bg-soft-bg">
          <p className="text-[12px] text-text-muted">Showing 1 to 10 of 68 conversations</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Previous page"><ChevronLeft className="w-4 h-4" /></button>
            {[1, 2, 3].map((p) => (
              <button key={p} onClick={() => goToPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-medium transition-colors ${page === p ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-white"}`}>{p}</button>
            ))}
            <span className="w-8 h-8 flex items-center justify-center text-[12px] text-text-light">…</span>
            <button onClick={() => goToPage(7)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-medium transition-colors ${page === 7 ? "bg-action-blue text-white" : "border border-border-soft text-text-muted hover:bg-white"}`}>7</button>
            <button onClick={() => goToPage(page + 1)} disabled={page === 7} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-soft text-text-muted hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Next page"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Stay connected banner */}
      <div className="rounded-xl px-6 py-5 flex items-center justify-between gap-4" style={{ background: "linear-gradient(135deg, #001B5E 0%, #003B7A 100%)" }}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white">Stay connected, stay informed</p>
            <p className="text-[12px] text-text-on-dark-muted mt-0.5">Enable notifications to never miss important updates from your team.</p>
          </div>
        </div>
        <button onClick={() => setNotifSettingsOpen(true)} className="shrink-0 px-4 py-2.5 bg-[#3B82F6] rounded-lg text-[13px] font-semibold text-white hover:bg-[#2563EB] transition-colors">
          Manage Notifications
        </button>
      </div>

      {/* Compose modal */}
      <Modal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        title="New Message"
        description="Start a new conversation with a teammate or partner."
        footer={
          <>
            <SecondaryButton onClick={() => setComposeOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={createThread}>Send message</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="To" required>
            <TextInput
              value={compose.recipient}
              onChange={(e) => setCompose((d) => ({ ...d, recipient: e.target.value }))}
              placeholder="e.g. Acme Retail"
            />
          </Field>
          <Field label="Subject" required>
            <TextInput
              value={compose.subject}
              onChange={(e) => setCompose((d) => ({ ...d, subject: e.target.value }))}
              placeholder="e.g. PO-102900 — Delivery window"
            />
          </Field>
          <Field label="Message" required>
            <TextArea
              value={compose.body}
              onChange={(e) => setCompose((d) => ({ ...d, body: e.target.value }))}
              placeholder="Type your message..."
              rows={4}
            />
          </Field>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete conversation"
        message={`Delete the conversation with ${deleting?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />

      {/* Message settings modal */}
      <Modal
        open={msgSettingsOpen}
        onClose={() => setMsgSettingsOpen(false)}
        title="Message Settings"
        description="Control how messages are composed and delivered across channels."
        footer={
          <>
            <SecondaryButton onClick={() => setMsgSettingsOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveMessageSettings} disabled={savingSettings}>{savingSettings ? "Saving…" : "Save settings"}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-2">
          <Field label="Default channel">
            <Select
              options={MESSAGE_CHANNELS}
              value={msgSettings.defaultChannel}
              onChange={(e) => setMsgSettings((s) => ({ ...s, defaultChannel: e.target.value }))}
            />
          </Field>
          <div className="pt-1 divide-y divide-border-soft">
            <ToggleRow label="Send on Enter" description="Press Enter to send; Shift+Enter for a new line." checked={msgSettings.sendOnEnter} onChange={(v) => setMsgSettings((s) => ({ ...s, sendOnEnter: v }))} />
            <ToggleRow label="Read receipts" description="Let partners see when you have read their message." checked={msgSettings.showReadReceipts} onChange={(v) => setMsgSettings((s) => ({ ...s, showReadReceipts: v }))} />
            <ToggleRow label="Auto-archive resolved" description="Archive a thread automatically once it is marked resolved." checked={msgSettings.autoArchiveResolved} onChange={(v) => setMsgSettings((s) => ({ ...s, autoArchiveResolved: v }))} />
          </div>
        </div>
      </Modal>

      {/* Notification settings modal */}
      <Modal
        open={notifSettingsOpen}
        onClose={() => setNotifSettingsOpen(false)}
        title="Notification Settings"
        description="Choose how you want to be notified about new activity."
        footer={
          <>
            <SecondaryButton onClick={() => setNotifSettingsOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveNotificationSettings} disabled={savingSettings}>{savingSettings ? "Saving…" : "Save preferences"}</PrimaryButton>
          </>
        }
      >
        <div className="divide-y divide-border-soft">
          <ToggleRow label="Desktop alerts" description="Show a browser notification for new messages." checked={notifSettings.desktopAlerts} onChange={(v) => setNotifSettings((s) => ({ ...s, desktopAlerts: v }))} />
          <ToggleRow label="Email digest" description="Receive a daily summary of unread conversations." checked={notifSettings.emailDigest} onChange={(v) => setNotifSettings((s) => ({ ...s, emailDigest: v }))} />
          <ToggleRow label="Mentions only" description="Only notify me when I'm directly mentioned." checked={notifSettings.mentionsOnly} onChange={(v) => setNotifSettings((s) => ({ ...s, mentionsOnly: v }))} />
          <ToggleRow label="Notification sound" description="Play a sound when a new message arrives." checked={notifSettings.soundEnabled} onChange={(v) => setNotifSettings((s) => ({ ...s, soundEnabled: v }))} />
        </div>
      </Modal>

      {/* Shared files drawer */}
      <Drawer
        open={filesOpen}
        onClose={() => setFilesOpen(false)}
        title="Shared Files"
        subtitle={activeConvo ? `Files in conversation with ${activeConvo.name}` : "Shared files"}
        footer={<SecondaryButton onClick={() => setFilesOpen(false)}>Close</SecondaryButton>}
      >
        <div className="space-y-2">
          {sharedFiles.map((f) => (
            <div key={f.name} className="flex items-center gap-3 p-3 rounded-lg border border-border-soft hover:bg-soft-bg transition-colors">
              <div className="w-9 h-9 rounded-lg bg-action-blue/10 flex items-center justify-center shrink-0"><FileText className="w-4.5 h-4.5 text-action-blue" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-text-primary truncate">{f.name}</p>
                <p className="text-[11px] text-text-light">{f.meta}</p>
              </div>
              <button onClick={() => downloadSharedFile(f)} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-soft text-[12px] font-medium text-action-blue hover:bg-white transition-colors">
                <FileText className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          ))}
          {sharedFiles.length === 0 && (
            <p className="text-[13px] text-text-light text-center py-8">No shared files in this conversation.</p>
          )}
        </div>
      </Drawer>
    </div>
  );
}
