"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/components/dashboard/Toast";
import {
  Mail, Bell, Settings, AlertTriangle, RotateCcw, CreditCard,
  Shield, FileText, ChevronDown, MessageSquare, Clock, Smartphone,
  Webhook, Package, Truck, CheckCircle2, XCircle, Pause,
} from "lucide-react";

/* ── types ── */
type Channel = "email" | "inapp" | "sms" | "slack";
type CategoryKey =
  | "orders" | "shipments" | "returns" | "inventory"
  | "billing" | "security" | "system" | "reports";

interface CategoryPref {
  label: string;
  icon: typeof Mail;
  channels: Record<Channel, boolean>;
  immediate: boolean;
  digest: "realtime" | "hourly" | "daily" | "off";
}

const CHANNEL_META: { key: Channel; label: string; icon: typeof Mail; desc: string }[] = [
  { key: "email", label: "Email", icon: Mail, desc: "Receive email notifications" },
  { key: "inapp", label: "In-App", icon: Bell, desc: "Push notifications in dashboard" },
  { key: "sms", label: "SMS", icon: Smartphone, desc: "Text messages to your phone" },
  { key: "slack", label: "Slack", icon: MessageSquare, desc: "Messages to Slack channel" },
];

const DIGEST_OPTIONS = ["realtime", "hourly", "daily", "off"] as const;

const INITIAL_CATEGORIES: Record<CategoryKey, CategoryPref> = {
  orders: {
    label: "Orders", icon: Package,
    channels: { email: true, inapp: true, sms: false, slack: true },
    immediate: true, digest: "realtime",
  },
  shipments: {
    label: "Shipments", icon: Truck,
    channels: { email: true, inapp: true, sms: true, slack: true },
    immediate: true, digest: "realtime",
  },
  returns: {
    label: "Returns", icon: RotateCcw,
    channels: { email: true, inapp: true, sms: false, slack: false },
    immediate: true, digest: "hourly",
  },
  inventory: {
    label: "Inventory", icon: AlertTriangle,
    channels: { email: true, inapp: true, sms: false, slack: true },
    immediate: true, digest: "hourly",
  },
  billing: {
    label: "Billing", icon: CreditCard,
    channels: { email: true, inapp: true, sms: true, slack: false },
    immediate: true, digest: "realtime",
  },
  security: {
    label: "Security", icon: Shield,
    channels: { email: true, inapp: true, sms: true, slack: false },
    immediate: true, digest: "realtime",
  },
  system: {
    label: "System", icon: Settings,
    channels: { email: false, inapp: true, sms: false, slack: true },
    immediate: false, digest: "daily",
  },
  reports: {
    label: "Reports", icon: FileText,
    channels: { email: true, inapp: false, sms: false, slack: false },
    immediate: false, digest: "daily",
  },
};

/* ── quiet hours presets ── */
const QUIET_PRESETS = [
  { label: "Disabled", start: "", end: "" },
  { label: "10 PM – 7 AM", start: "22:00", end: "07:00" },
  { label: "11 PM – 6 AM", start: "23:00", end: "06:00" },
  { label: "12 AM – 8 AM", start: "00:00", end: "08:00" },
  { label: "Custom", start: "", end: "" },
];

interface EmailDigest {
  enabled: boolean;
  frequency: "daily" | "weekly";
  day: string;
  time: string;
  includeSections: { summary: boolean; orders: boolean; shipments: boolean; inventory: boolean; alerts: boolean };
}

const INITIAL_DIGEST: EmailDigest = {
  enabled: true, frequency: "daily", day: "Monday", time: "08:00",
  includeSections: { summary: true, orders: true, shipments: true, inventory: true, alerts: true },
};

function Toggle({ on, onClick, size = "md" }: { on: boolean; onClick: () => void; size?: "sm" | "md" }) {
  const h = size === "sm" ? 20 : 24;
  const w = size === "sm" ? 36 : 44;
  const dot = size === "sm" ? 16 : 18;
  const tx = size === "sm" ? 19 : 23;
  return (
    <button
      onClick={onClick}
      className={`shrink-0 relative inline-flex h-[${h}px] w-[${w}px] items-center rounded-full transition-colors duration-200 ${
        on ? "bg-[#3B82F6]" : "bg-[#CBD5E1]"
      }`}
      style={{ height: h, width: w }}
    >
      <span
        className={`inline-block rounded-full bg-white shadow-sm transition-transform duration-200`}
        style={{ height: dot, width: dot, transform: on ? `translateX(${tx - 3}px)` : "translateX(3px)" }}
      />
    </button>
  );
}

const card = "bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06)]";
const sectionTitle = "text-[16px] font-semibold text-[#1E293B]";
const fieldLabel = "block text-[14px] font-medium text-[#1E293B] mb-1.5";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [cats, setCats] = useState<Record<CategoryKey, CategoryPref>>(() => {
    const out: Record<string, CategoryPref> = {};
    for (const [k, v] of Object.entries(INITIAL_CATEGORIES)) {
      out[k] = { ...v, channels: { ...v.channels } };
    }
    return out as Record<CategoryKey, CategoryPref>;
  });
  const [channelMaster, setChannelMaster] = useState<Record<Channel, boolean>>({
    email: true, inapp: true, sms: false, slack: true,
  });
  const [quietPreset, setQuietPreset] = useState("Disabled");
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");
  const [digest, setDigest] = useState<EmailDigest>({ ...INITIAL_DIGEST, includeSections: { ...INITIAL_DIGEST.includeSections } });
  const [slackWebhook, setSlackWebhook] = useState("https://hooks.slack.com/services/T00/B00/xxx");
  const [smsPhone, setSmsPhone] = useState("+1 (555) 123-4567");
  const [saving, setSaving] = useState(false);

  /* serialise current state to compare for dirty */
  const snapshot = useMemo(() => JSON.stringify({ cats, channelMaster, quietPreset, quietStart, quietEnd, digest, slackWebhook, smsPhone }), [cats, channelMaster, quietPreset, quietStart, quietEnd, digest, slackWebhook, smsPhone]);
  const [savedSnap, setSavedSnap] = useState(snapshot);
  const dirty = snapshot !== savedSnap;

  function toggleChannel(ch: Channel) {
    setChannelMaster((m) => ({ ...m, [ch]: !m[ch] }));
  }

  function toggleCatChannel(cat: CategoryKey, ch: Channel) {
    setCats((c) => ({
      ...c,
      [cat]: { ...c[cat], channels: { ...c[cat].channels, [ch]: !c[cat].channels[ch] } },
    }));
  }

  function toggleCatDigest(cat: CategoryKey, val: typeof DIGEST_OPTIONS[number]) {
    setCats((c) => ({ ...c, [cat]: { ...c[cat], digest: val } }));
  }

  function toggleCatImmediate(cat: CategoryKey) {
    setCats((c) => ({ ...c, [cat]: { ...c[cat], immediate: !c[cat].immediate } }));
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSnap(snapshot);
      toast("Notification preferences saved");
    }, 600);
  }

  function resetToDefaults() {
    const defaults = {} as Record<CategoryKey, CategoryPref>;
    for (const [k, v] of Object.entries(INITIAL_CATEGORIES)) {
      defaults[k as CategoryKey] = { ...v, channels: { ...v.channels } };
    }
    setCats(defaults);
    setChannelMaster({ email: true, inapp: true, sms: false, slack: true });
    setQuietPreset("Disabled");
    setDigest({ ...INITIAL_DIGEST, includeSections: { ...INITIAL_DIGEST.includeSections } });
    toast("Reset to default preferences");
  }

  const inputCls = "w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-colors";
  const selectCls = "w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] appearance-none pr-10 transition-colors cursor-pointer";

  return (
    <div className="max-w-[960px] space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-[#1E293B]">Notification Preferences</h2>
          <p className="text-[14px] text-[#64748B] mt-1">Choose how and when you want to be notified about important updates.</p>
        </div>
        <button onClick={resetToDefaults} className="flex items-center gap-2 text-[13px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2 hover:bg-[#F8FAFC]">
          <RotateCcw className="w-4 h-4" /> Reset to defaults
        </button>
      </div>

      {/* ── Section 1: Notification Channels ── */}
      <div className={card + " p-6"}>
        <h3 className={sectionTitle}>Notification Channels</h3>
        <p className="text-[13px] text-[#64748B] mt-1 mb-5">Enable or disable entire notification channels. Individual categories inherit from these master switches.</p>
        <div className="grid grid-cols-2 gap-4">
          {CHANNEL_META.map((ch) => {
            const Icon = ch.icon;
            const on = channelMaster[ch.key];
            return (
              <div key={ch.key} className="flex items-center gap-4 p-4 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${on ? "bg-[#3B82F6]/10" : "bg-[#F1F5F9]"}`}>
                  <Icon className={`w-5 h-5 ${on ? "text-[#3B82F6]" : "text-[#94A3B8]"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#1E293B]">{ch.label}</p>
                  <p className="text-[12px] text-[#64748B] mt-0.5">{ch.desc}</p>
                </div>
                <Toggle on={on} onClick={() => toggleChannel(ch.key)} />
              </div>
            );
          })}
        </div>
        {/* Channel-specific settings */}
        <div className="mt-5 pt-5 border-t border-[#E2E8F0] space-y-4">
          {channelMaster.slack && (
            <div>
              <label className={fieldLabel}>Slack Webhook URL</label>
              <input value={slackWebhook} onChange={(e) => setSlackWebhook(e.target.value)} className={inputCls} placeholder="https://hooks.slack.com/services/..." />
              <p className="text-[12px] text-[#94A3B8] mt-1.5">Incoming webhook URL for the target Slack channel.</p>
            </div>
          )}
          {channelMaster.sms && (
            <div>
              <label className={fieldLabel}>SMS Phone Number</label>
              <input value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)} className={inputCls} placeholder="+1 (555) 123-4567" />
              <p className="text-[12px] text-[#94A3B8] mt-1.5">Phone number for receiving SMS notifications.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 2: Per-Category Settings ── */}
      <div className={card + " p-6"}>
        <h3 className={sectionTitle}>Notification Categories</h3>
        <p className="text-[13px] text-[#64748B] mt-1 mb-5">Fine-tune notification behavior for each category. Each row controls which channels deliver and how quickly.</p>
        <div className="space-y-0 divide-y divide-[#E2E8F0]">
          {(Object.entries(cats) as [CategoryKey, CategoryPref][]).map(([key, cat]) => {
            const Icon = cat.icon;
            return (
              <div key={key} className="py-5 first:pt-0 last:pb-0">
                {/* Row header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-[#475569]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#1E293B]">{cat.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#64748B]">Immediate</span>
                    <Toggle on={cat.immediate} onClick={() => toggleCatImmediate(key)} size="sm" />
                  </div>
                </div>
                {/* Channel toggles */}
                <div className="ml-12 flex flex-wrap items-center gap-3 mb-3">
                  {CHANNEL_META.map((ch) => {
                    const enabled = cat.channels[ch.key] && channelMaster[ch.key];
                    return (
                      <button
                        key={ch.key}
                        onClick={() => toggleCatChannel(key, ch.key)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                          enabled
                            ? "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6]"
                            : "border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8]"
                        }`}
                      >
                        <ch.icon className="w-3 h-3" />
                        {ch.label}
                      </button>
                    );
                  })}
                </div>
                {/* Digest selector */}
                <div className="ml-12 flex items-center gap-2">
                  <span className="text-[12px] text-[#64748B]">Delivery:</span>
                  <div className="flex items-center gap-1">
                    {DIGEST_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleCatDigest(key, opt)}
                        className={`px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors ${
                          cat.digest === opt
                            ? "bg-[#3B82F6] text-white"
                            : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                        }`}
                      >
                        {opt === "realtime" ? "Real-time" : opt === "off" ? "Off" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 3: Quiet Hours ── */}
      <div className={card + " p-6"}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className={sectionTitle}>Quiet Hours</h3>
            <p className="text-[13px] text-[#64748B] mt-1">Suppress non-critical notifications during specified hours.</p>
          </div>
          <Toggle on={quietPreset !== "Disabled"} onClick={() => setQuietPreset((p) => p === "Disabled" ? "10 PM – 7 AM" : "Disabled")} />
        </div>
        {quietPreset !== "Disabled" && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={fieldLabel}>Preset</label>
              <div className="relative">
                <select value={quietPreset} onChange={(e) => setQuietPreset(e.target.value)} className={selectCls}>
                  {QUIET_PRESETS.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            {quietPreset === "Custom" && (
              <>
                <div>
                  <label className={fieldLabel}>Start Time</label>
                  <input type="time" value={quietStart} onChange={(e) => setQuietStart(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={fieldLabel}>End Time</label>
                  <input type="time" value={quietEnd} onChange={(e) => setQuietEnd(e.target.value)} className={inputCls} />
                </div>
              </>
            )}
            {quietPreset !== "Custom" && quietPreset !== "Disabled" && (
              <>
                <div>
                  <label className={fieldLabel}>From</label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B]">
                    <Clock className="w-4 h-4 text-[#64748B]" />
                    {QUIET_PRESETS.find((p) => p.label === quietPreset)?.start}
                  </div>
                </div>
                <div>
                  <label className={fieldLabel}>To</label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B]">
                    <Clock className="w-4 h-4 text-[#64748B]" />
                    {QUIET_PRESETS.find((p) => p.label === quietPreset)?.end}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {quietPreset !== "Disabled" && (
          <div className="mt-4 p-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg flex items-center gap-2.5">
            <Pause className="w-4 h-4 text-[#0369A1] shrink-0" />
            <p className="text-[13px] text-[#0369A1]">Non-critical notifications will be held and delivered as a batch when quiet hours end. Security alerts are always delivered immediately.</p>
          </div>
        )}
      </div>

      {/* ── Section 4: Email Digest ── */}
      <div className={card + " p-6"}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className={sectionTitle}>Email Digest</h3>
            <p className="text-[13px] text-[#64748B] mt-1">Receive a consolidated summary email instead of individual notifications.</p>
          </div>
          <Toggle on={digest.enabled} onClick={() => setDigest((d) => ({ ...d, enabled: !d.enabled }))} />
        </div>
        {digest.enabled && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={fieldLabel}>Frequency</label>
                <div className="relative">
                  <select
                    value={digest.frequency}
                    onChange={(e) => setDigest((d) => ({ ...d, frequency: e.target.value as "daily" | "weekly" }))}
                    className={selectCls}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              {digest.frequency === "weekly" && (
                <div>
                  <label className={fieldLabel}>Day of Week</label>
                  <div className="relative">
                    <select value={digest.day} onChange={(e) => setDigest((d) => ({ ...d, day: e.target.value }))} className={selectCls}>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}
              <div>
                <label className={fieldLabel}>Delivery Time</label>
                <input type="time" value={digest.time} onChange={(e) => setDigest((d) => ({ ...d, time: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#1E293B] mb-3">Include in digest</p>
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    { key: "summary" as const, label: "Performance Summary", icon: CheckCircle2 },
                    { key: "orders" as const, label: "Orders Update", icon: Package },
                    { key: "shipments" as const, label: "Shipment Status", icon: Truck },
                    { key: "inventory" as const, label: "Inventory Alerts", icon: AlertTriangle },
                    { key: "alerts" as const, label: "Critical Alerts", icon: XCircle },
                  ] as const
                ).map((sec) => {
                  const Icon = sec.icon;
                  const on = digest.includeSections[sec.key];
                  return (
                    <button
                      key={sec.key}
                      onClick={() => setDigest((d) => ({ ...d, includeSections: { ...d.includeSections, [sec.key]: !d.includeSections[sec.key] } }))}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium border transition-colors ${
                        on ? "border-[#3B82F6]/30 bg-[#3B82F6]/5 text-[#3B82F6]" : "border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {sec.label}
                      {on ? <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Preview */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Preview</p>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#3B82F6]" />
                <div>
                  <p className="text-[14px] font-medium text-[#1E293B]">FulfillMesh {digest.frequency === "daily" ? "Daily" : "Weekly"} Digest</p>
                  <p className="text-[12px] text-[#64748B]">
                    Delivered {digest.frequency === "daily" ? "every day" : `every ${digest.day}`} at {digest.time || "08:00"} · {
                      Object.entries(digest.includeSections).filter(([, v]) => v).length
                    } sections included
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 5: Priority Rules ── */}
      <div className={card + " p-6"}>
        <h3 className={sectionTitle}>Priority Rules</h3>
        <p className="text-[13px] text-[#64748B] mt-1 mb-5">Define which notifications bypass quiet hours and are always delivered immediately.</p>
        <div className="space-y-4">
          {[
            { label: "Security alerts (login attempts, password changes)", icon: Shield, alwaysOn: true },
            { label: "Critical inventory alerts (stockout, recall)", icon: AlertTriangle, alwaysOn: false },
            { label: "Shipment exceptions (delivery failure, lost package)", icon: Truck, alwaysOn: false },
            { label: "Billing issues (payment failed, invoice overdue)", icon: CreditCard, alwaysOn: false },
            { label: "System errors (integration failure, sync error)", icon: Settings, alwaysOn: false },
          ].map((rule) => {
            const Icon = rule.icon;
            return (
              <div key={rule.label} className="flex items-center gap-4 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#EF4444]" />
                </div>
                <p className="text-[13px] text-[#1E293B] flex-1">{rule.label}</p>
                {rule.alwaysOn ? (
                  <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#EF4444]/10 text-[#EF4444] rounded-full">Always deliver</span>
                ) : (
                  <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#10B981]/10 text-[#10B981] rounded-full">Active</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[12px] text-[#94A3B8] mt-4 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Security notifications cannot be disabled and always bypass quiet hours.
        </p>
      </div>

      {/* ── Save bar ── */}
      <div className="sticky bottom-4 bg-white border border-[#E2E8F0] rounded-xl shadow-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {dirty && !saving && (
            <span className="flex items-center gap-1.5 text-[13px] text-[#F59E0B]">
              <AlertTriangle className="w-4 h-4" /> You have unsaved changes
            </span>
          )}
          {!dirty && !saving && (
            <span className="flex items-center gap-1.5 text-[13px] text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" /> All changes saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {dirty && (
            <button onClick={resetToDefaults} className="px-4 py-2 text-[13px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">
              Discard
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="px-6 py-2.5 text-white rounded-lg text-[14px] font-semibold shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all hover:brightness-110 disabled:opacity-60"
            style={{ background: "linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)" }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
