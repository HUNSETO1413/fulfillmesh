"use client";

import { useMemo, useRef, useState } from "react";
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
  BellOff,
  FileText,
  Plus,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/components/dashboard/Toast";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  color: string;
  subject: string;
  preview: string;
  time: string;
  unread: number;
}

const conversations: Conversation[] = [
  { id: "c1", name: "James Carter", avatar: "JC", color: "#0057D8", subject: "Re: PO-102876 — Shipment Update", preview: "Can you provide an update on the status...", time: "10:42 AM", unread: 2 },
  { id: "c2", name: "Sophie Lee", avatar: "SL", color: "#8B5CF6", subject: "Inventory Discrepancy", preview: "We found a mismatch in SKU-4421 count...", time: "9:18 AM", unread: 1 },
  { id: "c3", name: "Michael Brown", avatar: "MB", color: "#10B981", subject: "Pickup Schedule", preview: "The courier is confirmed for 2 PM today.", time: "Yesterday", unread: 0 },
  { id: "c4", name: "DFW1 Warehouse Team", avatar: "DF", color: "#F59E0B", subject: "Daily Ops Huddle", preview: "Good morning team, here are today's...", time: "Yesterday", unread: 0 },
  { id: "c5", name: "Ava Thomas", avatar: "AT", color: "#EC4899", subject: "QC Check — Order #4498", preview: "All items passed inspection. Photos attached.", time: "Mon", unread: 0 },
  { id: "c6", name: "LAX1 Warehouse Team", avatar: "LA", color: "#06B6D4", subject: "Weekend Maintenance", preview: "Dock 3 will be closed for repairs...", time: "Mon", unread: 0 },
  { id: "c7", name: "Ethan Taylor", avatar: "ET", color: "#7C3AED", subject: "Cycle Count — Zone B", preview: "Variance resolved and adjusted.", time: "Sun", unread: 0 },
  { id: "c8", name: "Vendor: FastShip Logistics", avatar: "FL", color: "#F97316", subject: "ASN Update", preview: "The ASN for PO-50672 is now available...", time: "Sun", unread: 0 },
  { id: "c9", name: "Returns Team", avatar: "RT", color: "#EF4444", subject: "RMA-7788 — Customer Return", preview: "Return received and inspected.", time: "May 26", unread: 0 },
  { id: "c10", name: "System Notifications", avatar: "SY", color: "#64748B", subject: "Scheduled Maintenance", preview: "System maintenance completed.", time: "May 25", unread: 0 },
];

interface Message {
  id: string;
  sender: string;
  isMe: boolean;
  time: string;
  content: string;
}

const initialMessages: Record<string, Message[]> = {
  c1: [
    { id: "m1", sender: "James Carter", isMe: false, time: "May 30, 2025 10:41 AM", content: "Can you provide an update on the status of PO-102876? We need confirmation before we schedule the pickup. Thanks!" },
    { id: "m2", sender: "You", isMe: true, time: "May 30, 2025 10:41 AM", content: "Hi James, the shipment has been received and is currently being processed. Estimated completion time is May 31, 2025 by 12:00 PM." },
    { id: "m3", sender: "You", isMe: true, time: "May 30, 2025 10:42 AM", content: "I'll keep you updated if anything changes. Best, Operations Team" },
    { id: "m4", sender: "James Carter", isMe: false, time: "May 30, 2025 10:45 AM", content: "Great, thank you! Please ensure priority handling." },
    { id: "m5", sender: "You", isMe: true, time: "May 30, 2025 10:46 AM", content: "Absolutely. We'll prioritize and keep you posted. Have a great day!" },
  ],
  c2: [
    { id: "m1", sender: "Sophie Lee", isMe: false, time: "May 30, 2025 09:12 AM", content: "We found a mismatch in SKU-4421 count during the cycle count. System shows 320 but we counted 298." },
    { id: "m2", sender: "You", isMe: true, time: "May 30, 2025 09:18 AM", content: "Thanks for flagging. Let's open an adjustment ticket and recount zone B to confirm." },
  ],
  c3: [
    { id: "m1", sender: "Michael Brown", isMe: false, time: "Yesterday 02:00 PM", content: "The courier is confirmed for 2 PM today. Dock 2 is reserved." },
  ],
  c4: [
    { id: "m1", sender: "DFW1 Warehouse Team", isMe: false, time: "Yesterday 07:30 AM", content: "Good morning team, here are today's priorities: clear the inbound backlog and prep the LAX transfer." },
  ],
  c5: [
    { id: "m1", sender: "Ava Thomas", isMe: false, time: "Mon 11:20 AM", content: "All items passed inspection for Order #4498. Photos attached for your records." },
  ],
  c6: [
    { id: "m1", sender: "LAX1 Warehouse Team", isMe: false, time: "Mon 08:45 AM", content: "Dock 3 will be closed for repairs this weekend. Please route inbound to Dock 1 and 2." },
  ],
  c7: [
    { id: "m1", sender: "Ethan Taylor", isMe: false, time: "Sun 04:10 PM", content: "Variance for Zone B resolved and adjusted in the system. No further action needed." },
  ],
  c8: [
    { id: "m1", sender: "Vendor: FastShip Logistics", isMe: false, time: "Sun 01:30 PM", content: "The ASN for PO-50672 is now available. Expected arrival is Tuesday before noon." },
  ],
  c9: [
    { id: "m1", sender: "Returns Team", isMe: false, time: "May 26 03:15 PM", content: "Return RMA-7788 received and inspected. Item is restockable; awaiting your approval to refund." },
  ],
  c10: [
    { id: "m1", sender: "System Notifications", isMe: false, time: "May 25 02:00 AM", content: "System maintenance completed successfully. All services are operational." },
  ],
};

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

export default function MessagesPage() {
  const { toast } = useToast();
  const [selected, setSelected] = useState("c1");
  const [tab, setTab] = useState<"All" | "Unread">("All");
  const [composeTab, setComposeTab] = useState<"Message" | "Note">("Message");
  const [query, setQuery] = useState("");
  const [convos, setConvos] = useState<Conversation[]>(conversations);
  const [threads, setThreads] = useState<Record<string, Message[]>>(initialMessages);
  const [draft, setDraft] = useState("");
  const [page, setPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const activeConvo = convos.find((c) => c.id === selected) ?? convos[0];
  const activeMessages = threads[selected] ?? [];

  function selectConversation(id: string) {
    setSelected(id);
    setConvos((cur) => cur.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const msg: Message = { id: `m${Date.now()}`, sender: "You", isMe: true, time, content: text };
    setThreads((cur) => ({ ...cur, [selected]: [...(cur[selected] ?? []), msg] }));
    setConvos((cur) => cur.map((c) => (c.id === selected ? { ...c, preview: text, time: "Now" } : c)));
    setDraft("");
    toast(composeTab === "Note" ? "Internal note added" : "Message sent");
    requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }));
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
          <button onClick={() => toast("Opening message settings…", "info")} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border-soft rounded-lg text-[13px] font-medium text-text-muted shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-soft-bg transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={() => toast("Compose a new message", "info")} className="flex items-center gap-2 px-4 py-2 bg-action-blue rounded-lg text-[13px] font-medium text-white hover:bg-[#0048B5] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors">
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
              {visibleConvos.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-border-soft/50 hover:bg-soft-bg/50 transition-colors ${
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
                      <p className="text-[12px] text-text-light truncate pr-2">{c.preview}</p>
                      {c.unread > 0 && (
                        <span className="shrink-0 bg-action-blue text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">{c.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {visibleConvos.length === 0 && (
                <p className="px-4 py-8 text-center text-[12px] text-text-light">No conversations found.</p>
              )}
            </div>
          </div>

          {/* Center: conversation */}
          <div className="flex flex-col min-h-0 bg-white">
            {/* Conversation header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full text-white text-[13px] font-semibold flex items-center justify-center" style={{ backgroundColor: activeConvo.color }}>{activeConvo.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[14px] font-semibold text-text-primary">{activeConvo.name}</h2>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-600">External</span>
                  </div>
                  <p className="text-[12px] text-text-light">{activeConvo.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toast(`Calling ${activeConvo.name}…`, "info")} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-soft-bg transition-colors" aria-label="Call"><Phone className="w-4 h-4" /></button>
                <button onClick={() => toast(`Starting video call with ${activeConvo.name}…`, "info")} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-soft-bg transition-colors" aria-label="Video call"><Video className="w-4 h-4" /></button>
                <button onClick={() => toast("Conversation details", "info")} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-soft-bg transition-colors" aria-label="Conversation info"><Info className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Subject line */}
            <div className="px-4 py-2.5 bg-soft-bg border-b border-border-soft">
              <p className="text-[13px] font-semibold text-text-primary">{activeConvo.subject}</p>
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
                  <button onClick={sendMessage} disabled={!draft.trim()} className="flex items-center gap-1.5 px-4 py-1.5 bg-action-blue rounded-lg text-[12px] font-medium text-white hover:bg-[#0048B5] transition-colors disabled:opacity-50">
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
                <button onClick={() => toast("Opening shared files…", "info")} className="text-[11px] font-medium text-action-blue hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {sharedFiles.map((f) => (
                  <button key={f.name} onClick={() => toast(`Downloading ${f.name}…`)} className="w-full text-left flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors">
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
        <button onClick={() => toast("Opening notification settings…", "info")} className="shrink-0 px-4 py-2.5 bg-[#3B82F6] rounded-lg text-[13px] font-semibold text-white hover:bg-[#2563EB] transition-colors">
          Manage Notifications
        </button>
      </div>
    </div>
  );
}
