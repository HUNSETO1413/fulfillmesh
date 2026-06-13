"use client";

import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, RefreshCw, XCircle, MoreHorizontal, HelpCircle } from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";
import { isUrl } from "@/lib/validate";

type Status = "Connected" | "Syncing" | "Available" | "Disconnected";

const ShopifyLogo = () => (
  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden>
    <rect width="48" height="48" rx="9" fill="#fff" />
    <path d="M30.4 14.7c0-.1-.1-.2-.2-.2-.1 0-1.9-.1-1.9-.1s-1.5-1.5-1.7-1.6c-.2-.2-.5-.1-.6-.1l-.8.2c-.1-.3-.3-.7-.5-1.1-.6-1.2-1.6-1.9-2.7-1.9-.1 0-.2 0-.2.1-.1-.1-.2-.2-.3-.3-.5-.5-1.1-.8-1.8-.7-1.4 0-2.7 1-3.8 2.8-.8 1.3-1.4 2.9-1.5 4.2l-2.6.8c-.8.2-.8.3-.9 1-.1.6-2.1 16.3-2.1 16.3l16.8 2.9 7.3-1.8s-2-13.9-2-14.5zm-6.7-1.6l-1.3.4c0-.7-.1-1.6-.4-2.4 1 .2 1.5 1.3 1.7 2zm-2.2.7l-2.8.9c.3-1 .8-2.1 1.4-2.7.2-.2.5-.5.9-.7.3.7.4 1.6.5 2.5zm-2-3.4c.3 0 .5.1.7.2-.3.2-.7.5-.9.8-.8.9-1.4 2.3-1.7 3.6l-2.3.7c.5-2.3 2.3-5.2 4.2-5.3z" fill="#95BF47" />
    <path d="M30.2 14.5c-.1 0-1.9-.1-1.9-.1s-1.5-1.5-1.7-1.6c-.1-.1-.1-.1-.2-.1l-1.2 26.1 7.3-1.8s-2-13.9-2-14.5c0-.1-.1-.2-.2-.2z" fill="#5E8E3E" />
    <path d="M22.1 18.4l-.8 2.8s-.9-.4-1.9-.3c-1.5.1-1.5 1-1.5 1.3.1 1.2 3.2 1.5 3.4 4.3.1 2.2-1.2 3.7-3 3.8-2.2.1-3.4-1.2-3.4-1.2l.5-2s1.2.9 2.2.8c.6 0 .9-.5.8-.9-.1-1.6-2.6-1.5-2.8-4-.1-2.1 1.3-4.3 4.4-4.5 1.1-.1 1.7.2 1.7.2z" fill="#fff" />
  </svg>
);

const WooLogo = () => (
  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden>
    <rect width="48" height="48" rx="9" fill="#fff" />
    <path d="M10 18h28c1.7 0 3 1.3 3 3v6c0 1.7-1.3 3-3 3H10c-1.7 0-3-1.3-3-3v-6c0-1.7 1.3-3 3-3z" fill="#7F54B3" />
    <path d="M12.4 21.8c.2-.3.5-.5.9-.5.7-.1 1.1.3 1.2 1 .3 2.1.6 3.9 1 5.3l2.2-4.2c.2-.4.5-.6.8-.6.5 0 .8.3.9.9.2 1.3.5 2.4.8 3.4.2-2.2.6-3.8 1.1-4.8.2-.3.4-.5.8-.6.3 0 .6.1.8.3.2.2.3.4.4.7 0 .2 0 .4-.1.6-.6 1.2-1.2 3.2-1.6 6-.1.3-.2.6-.4.8-.3.2-.5.3-.8.3-.4 0-.7-.2-1-.6-.5-.7-.9-1.7-1.2-3-.4 1-.8 1.7-1 2.2-.5.9-.9 1.3-1.3 1.4-.3 0-.6-.2-.9-.8-.6-1.6-1.3-4.7-2-9.3 0-.4 0-.7.2-.9zm26 1.4c-.4-.8-1.1-1.2-1.9-1.4-.2 0-.4-.1-.6-.1-1.1 0-2 .6-2.7 1.7-.6.9-.9 2-.9 3.1 0 .9.2 1.6.6 2.2.4.8 1.1 1.2 1.9 1.4.2 0 .4.1.6.1 1.1 0 2-.6 2.7-1.7.6-.9.9-2 .9-3.2 0-.8-.2-1.5-.6-2.1zm-1.5 3.1c-.2.8-.4 1.3-.8 1.7-.3.3-.5.4-.8.4-.2 0-.5-.2-.6-.5-.1-.3-.2-.5-.2-.8 0-.2 0-.5.1-.7.1-.4.2-.7.5-1.1.3-.5.7-.7 1-.6.2 0 .5.2.6.5.1.3.2.5.2.8 0 .3 0 .5-.1.8zm-7.1-3.1c-.4-.8-1.1-1.2-1.9-1.4-.2 0-.4-.1-.6-.1-1.1 0-2 .6-2.7 1.7-.6.9-.9 2-.9 3.1 0 .9.2 1.6.6 2.2.4.8 1.1 1.2 1.9 1.4.2 0 .4.1.6.1 1.1 0 2-.6 2.7-1.7.6-.9.9-2 .9-3.2 0-.8-.2-1.5-.6-2.1zm-1.5 3.1c-.2.8-.4 1.3-.8 1.7-.3.3-.5.4-.8.4-.2 0-.5-.2-.6-.5-.1-.3-.2-.5-.2-.8 0-.2 0-.5.1-.7.1-.4.2-.7.5-1.1.3-.5.7-.7 1-.6.2 0 .5.2.6.5.1.3.2.5.2.8 0 .3 0 .5-.1.8z" fill="#fff" />
  </svg>
);

const AmazonLogo = () => (
  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden>
    <rect width="48" height="48" rx="9" fill="#fff" />
    <path d="M30.5 31.3c-3.6 2.7-8.9 4.1-13.4 4.1-6.3 0-12-2.3-16.3-6.2-.3-.3 0-.7.4-.5 4.7 2.7 10.4 4.3 16.4 4.3 4.1 0 8.5-.8 12.6-2.6.6-.3 1.1.4.3.9z" transform="translate(8 0)" fill="#FF9900" />
    <path d="M32 29.6c-.5-.6-3.1-.3-4.3-.1-.4.1-.4-.3-.1-.5 2.1-1.5 5.6-1 6-.6.4.5-.1 4-2.1 5.7-.3.3-.6.1-.5-.2.5-1.2 1.5-3.8 1-4.3z" transform="translate(8 0)" fill="#FF9900" />
    <path d="M19.3 14.8v-1.5c0-.2.2-.4.4-.4h6.8c.2 0 .4.2.4.4v1.3c0 .2-.2.5-.5.9l-3.5 5c1.3 0 2.7.2 3.9.9.3.2.3.4.4.6v1.6c0 .2-.3.5-.5.3-2-1.1-4.7-1.2-7 0-.2.1-.5-.1-.5-.4v-1.5c0-.3 0-.7.3-1.1l4.1-5.8h-3.5c-.2 0-.4-.1-.4-.4zM11.6 23.9H9.5c-.2 0-.4-.2-.4-.4V13.4c0-.2.2-.4.4-.4h1.9c.2 0 .4.2.4.4v1.3h.1c.5-1.3 1.4-2 2.7-2 1.3 0 2.1.6 2.7 2 .5-1.3 1.6-2 2.8-2 .9 0 1.8.4 2.4 1.2.7.9.5 2.2.5 3.4v6.2c0 .2-.2.4-.4.4h-2.1c-.2 0-.4-.2-.4-.4v-5.2c0-.5 0-1.6-.1-2-.2-.7-.6-.9-1.2-.9-.5 0-1 .3-1.2.9-.2.5-.2 1.4-.2 2v5.2c0 .2-.2.4-.4.4h-2.1c-.2 0-.4-.2-.4-.4v-5.2c0-1.3.2-3.1-1.3-3.1-1.5 0-1.5 1.8-1.5 3.1v5.2c0 .2-.2.4-.4.4z" fill="#221F1F" />
  </svg>
);

const TikTokLogo = () => (
  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden>
    <rect width="48" height="48" rx="9" fill="#010101" />
    <path d="M31.3 17.6c-1.6-1-2.7-2.7-3-4.6h-3.5v14.2c0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-1.7 1.4-3.1 3.1-3.1.3 0 .7.1 1 .2v-3.6c-.3 0-.7-.1-1-.1-3.7 0-6.7 3-6.7 6.6 0 3.7 3 6.6 6.7 6.6 3.7 0 6.6-3 6.6-6.6v-7.3c1.3.9 2.9 1.5 4.6 1.5v-3.5c-.5 0-1.1-.1-1.6-.3z" fill="#FF004F" transform="translate(-1.2 1.2)" />
    <path d="M31.3 17.6c-1.6-1-2.7-2.7-3-4.6h-3.5v14.2c0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-1.7 1.4-3.1 3.1-3.1.3 0 .7.1 1 .2v-3.6c-.3 0-.7-.1-1-.1-3.7 0-6.7 3-6.7 6.6 0 3.7 3 6.6 6.7 6.6 3.7 0 6.6-3 6.6-6.6v-7.3c1.3.9 2.9 1.5 4.6 1.5v-3.5c-.5 0-1.1-.1-1.6-.3z" fill="#00F2EA" transform="translate(1.2 -1.2)" />
    <path d="M31.3 17.6c-1.6-1-2.7-2.7-3-4.6h-3.5v14.2c0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-1.7 1.4-3.1 3.1-3.1.3 0 .7.1 1 .2v-3.6c-.3 0-.7-.1-1-.1-3.7 0-6.7 3-6.7 6.6 0 3.7 3 6.6 6.7 6.6 3.7 0 6.6-3 6.6-6.6v-7.3c1.3.9 2.9 1.5 4.6 1.5v-3.5c-.5 0-1.1-.1-1.6-.3z" fill="#fff" />
  </svg>
);

const TrackLogo = () => (
  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden>
    <rect width="48" height="48" rx="9" fill="#FF6A00" />
    <text x="24" y="30" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="16" fill="#fff">17</text>
  </svg>
);

const SlackLogo = () => (
  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden>
    <rect width="48" height="48" rx="9" fill="#fff" />
    <g transform="translate(13 13)">
      <path d="M4.4 13.6c0 1.2-1 2.2-2.2 2.2C1 15.8 0 14.8 0 13.6c0-1.2 1-2.2 2.2-2.2h2.2v2.2z" fill="#E01E5A" />
      <path d="M5.5 13.6c0-1.2 1-2.2 2.2-2.2 1.2 0 2.2 1 2.2 2.2v5.5c0 1.2-1 2.2-2.2 2.2-1.2 0-2.2-1-2.2-2.2v-5.5z" fill="#E01E5A" />
      <path d="M7.7 4.4c-1.2 0-2.2-1-2.2-2.2C5.5 1 6.5 0 7.7 0c1.2 0 2.2 1 2.2 2.2v2.2H7.7z" fill="#36C5F0" />
      <path d="M7.7 5.5c1.2 0 2.2 1 2.2 2.2 0 1.2-1 2.2-2.2 2.2H2.2C1 9.9 0 8.9 0 7.7c0-1.2 1-2.2 2.2-2.2h5.5z" fill="#36C5F0" />
      <path d="M16.9 7.7c0-1.2 1-2.2 2.2-2.2 1.2 0 2.2 1 2.2 2.2 0 1.2-1 2.2-2.2 2.2h-2.2V7.7z" fill="#2EB67D" />
      <path d="M15.8 7.7c0 1.2-1 2.2-2.2 2.2-1.2 0-2.2-1-2.2-2.2V2.2C11.4 1 12.4 0 13.6 0c1.2 0 2.2 1 2.2 2.2v5.5z" fill="#2EB67D" />
      <path d="M13.6 16.9c1.2 0 2.2 1 2.2 2.2 0 1.2-1 2.2-2.2 2.2-1.2 0-2.2-1-2.2-2.2v-2.2h2.2z" fill="#ECB22E" />
      <path d="M13.6 15.8c-1.2 0-2.2-1-2.2-2.2 0-1.2 1-2.2 2.2-2.2h5.5c1.2 0 2.2 1 2.2 2.2 0 1.2-1 2.2-2.2 2.2h-5.5z" fill="#ECB22E" />
    </g>
  </svg>
);

const ZapierLogo = () => (
  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden>
    <rect width="48" height="48" rx="9" fill="#FF4F00" />
    <path d="M27 24c0 .9-.2 1.7-.5 2.5-.8.3-1.6.5-2.5.5s-1.7-.2-2.5-.5c-.3-.8-.5-1.6-.5-2.5s.2-1.7.5-2.5c.8-.3 1.6-.5 2.5-.5s1.7.2 2.5.5c.3.8.5 1.6.5 2.5zm9-1.8h-6.3l4.5-4.5c-.4-.5-.7-1-1.2-1.4-.4-.5-.9-.8-1.4-1.2l-4.5 4.5V13h-4.4v6.3l-4.5-4.5c-.5.4-1 .7-1.4 1.2-.5.4-.8.9-1.2 1.4l4.5 4.5H12v4.4h6.3l-4.5 4.5c.7 1 1.6 1.9 2.6 2.6l4.5-4.5V35h4.4v-6.3l4.5 4.5c.5-.4 1-.7 1.4-1.2.5-.4.8-.9 1.2-1.4l-4.5-4.5H36v-4.4z" fill="#fff" />
  </svg>
);

type Integration = {
  name: string;
  desc: string;
  Logo: () => ReactElement;
  status: Status;
  lastSync: string;
  action: "Manage" | "Connect";
};

const initialIntegrations: Integration[] = [
  { name: "Shopify", desc: "Sync orders, products, and inventory from your Shopify store.", Logo: ShopifyLogo, status: "Connected", lastSync: "May 18, 2025 9:41 AM", action: "Manage" },
  { name: "WooCommerce", desc: "Sync orders from your WooCommerce store.", Logo: WooLogo, status: "Connected", lastSync: "May 18, 2025 8:15 AM", action: "Manage" },
  { name: "Amazon", desc: "Sync orders and fulfillments from your Amazon account.", Logo: AmazonLogo, status: "Connected", lastSync: "May 18, 2025 9:37 AM", action: "Manage" },
  { name: "TikTok Shop", desc: "Sync orders and products from your TikTok Shop.", Logo: TikTokLogo, status: "Connected", lastSync: "May 18, 2025 9:10 AM", action: "Manage" },
  { name: "17TRACK", desc: "Track shipments and get real-time tracking updates.", Logo: TrackLogo, status: "Connected", lastSync: "May 18, 2025 9:05 AM", action: "Manage" },
  { name: "Slack", desc: "Get notifications and updates in your Slack channels.", Logo: SlackLogo, status: "Available", lastSync: "—", action: "Connect" },
  { name: "Zapier", desc: "Automate workflows and connect FulfillMesh with 5000+ apps.", Logo: ZapierLogo, status: "Disconnected", lastSync: "—", action: "Connect" },
];

function StatusBadge({ status }: { status: Status }) {
  const map = {
    "Connected": { cls: "bg-[#10B981]/10 text-[#10B981]", Icon: CheckCircle2 },
    "Syncing": { cls: "bg-[#3B82F6]/10 text-[#3B82F6]", Icon: RefreshCw },
    "Available": { cls: "bg-[#8B5CF6]/10 text-[#8B5CF6]", Icon: CheckCircle2 },
    "Disconnected": { cls: "bg-[#EF4444]/10 text-[#EF4444]", Icon: XCircle },
  }[status];
  const Icon = map.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-md ${map.cls}`}>
      <Icon className={`w-3.5 h-3.5 ${status === "Syncing" ? "animate-spin" : ""}`} />
      {status}
    </span>
  );
}

function nowStamp() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type IntegrationConfig = { apiKey: string; freq: string; webhook: string };

const SYNC_FREQUENCIES = ["Real-time", "Every 15 minutes", "Every hour", "Daily"];

const defaultConfig: IntegrationConfig = { apiKey: "", freq: "Every hour", webhook: "" };

// Only the serialisable per-integration state is persisted (the Logo render
// function can't be stored), keyed by integration name.
type IntegrationStatusState = { status: Status; lastSync: string; action: Integration["action"] };
type IntegrationsSection = {
  statuses: Record<string, IntegrationStatusState>;
  configs: Record<string, IntegrationConfig>;
};

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [configs, setConfigs] = useState<Record<string, IntegrationConfig>>({});
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<Integration | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Configure modal
  const [configFor, setConfigFor] = useState<Integration | null>(null);
  const [configDraft, setConfigDraft] = useState<IntegrationConfig>(defaultConfig);
  const [configErrors, setConfigErrors] = useState<{ apiKey?: string; webhook?: string }>({});

  useEffect(() => {
    if (!menuFor) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuFor(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuFor]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await api.get<Record<string, unknown>>("/api/settings");
        if (!alive) return;
        const section = all.integrations as Partial<IntegrationsSection> | undefined;
        if (!section || typeof section !== "object") return;
        if (section.statuses) {
          const statuses = section.statuses;
          // Re-attach the static Logo components to the stored status/sync state.
          setIntegrations((list) =>
            list.map((it) => (statuses[it.name] ? { ...it, ...statuses[it.name] } : it)),
          );
        }
        if (section.configs) setConfigs(section.configs);
      } catch {
        if (alive) toast("Failed to load integrations", "error");
      }
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist serialisable integration state under the `integrations` settings key.
  const persist = (nextIntegrations: Integration[], nextConfigs: Record<string, IntegrationConfig>) => {
    const statuses: Record<string, IntegrationStatusState> = {};
    for (const it of nextIntegrations) statuses[it.name] = { status: it.status, lastSync: it.lastSync, action: it.action };
    const payload: IntegrationsSection = { statuses, configs: nextConfigs };
    api.put("/api/settings", { integrations: payload }).catch(() => toast("Failed to save integrations", "error"));
  };

  const openConfig = (it: Integration) => {
    setMenuFor(null);
    setConfigFor(it);
    setConfigDraft(configs[it.name] ?? { ...defaultConfig, apiKey: it.status === "Connected" || it.status === "Syncing" ? `${it.name.toLowerCase().replace(/\s+/g, "_")}_live_4f8a2c` : "" });
    setConfigErrors({});
  };

  const saveConfig = () => {
    if (!configFor) return;
    const errors: { apiKey?: string; webhook?: string } = {};
    if (!configDraft.apiKey.trim()) errors.apiKey = "API key is required";
    if (configDraft.webhook.trim() && !isUrl(configDraft.webhook)) errors.webhook = "Enter a valid URL (https://…)";
    setConfigErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const name = configFor.name;
    const wasConnected = configFor.status === "Connected" || configFor.status === "Syncing";
    const nextConfigs = { ...configs, [name]: { ...configDraft, apiKey: configDraft.apiKey.trim(), webhook: configDraft.webhook.trim() } };
    setConfigs(nextConfigs);
    const nextIntegrations = wasConnected
      ? integrations
      : integrations.map((it) =>
          it.name === name ? { ...it, status: "Connected" as Status, action: "Manage" as const, lastSync: nowStamp() } : it,
        );
    if (!wasConnected) {
      setIntegrations(nextIntegrations);
      toast(`${name} connected`);
    } else {
      toast(`${name} settings saved`);
    }
    persist(nextIntegrations, nextConfigs);
    setConfigFor(null);
  };

  const sync = (name: string) => {
    setMenuFor(null);
    setIntegrations((list) =>
      list.map((it) => (it.name === name ? { ...it, status: "Syncing" } : it)),
    );
    // The delay animates the syncing state; the resulting status is persisted.
    setTimeout(() => {
      setIntegrations((list) => {
        const next = list.map((it) =>
          it.name === name ? { ...it, status: "Connected" as Status, action: "Manage" as const, lastSync: "Just now" } : it,
        );
        persist(next, configs);
        return next;
      });
      toast(`${name} synced`);
    }, 1000);
  };

  const handleDisconnect = () => {
    if (!disconnecting) return;
    const next = integrations.map((it) =>
      it.name === disconnecting.name
        ? { ...it, status: "Disconnected" as Status, action: "Connect" as const, lastSync: "—" }
        : it,
    );
    setIntegrations(next);
    persist(next, configs);
    toast(`${disconnecting.name} disconnected`);
    setDisconnecting(null);
  };

  return (
    <div>
      <h2 className="text-[20px] font-semibold text-text-primary">Integrations</h2>
      <p className="text-[14px] text-text-body mt-1 mb-6">Connect and manage your apps and platforms.</p>

      {/* Table */}
      <div className="border border-border-soft rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-soft-bg border-b border-border-soft">
              <th className="text-left text-[12px] font-medium text-text-muted px-5 py-3">Integration</th>
              <th className="text-left text-[12px] font-medium text-text-muted px-5 py-3">Status</th>
              <th className="text-left text-[12px] font-medium text-text-muted px-5 py-3">Last Sync</th>
              <th className="text-right text-[12px] font-medium text-text-muted px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((it) => (
              <tr key={it.name} className="border-b border-border-soft last:border-0 hover:bg-soft-bg/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="shrink-0">
                      <it.Logo />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-text-primary">{it.name}</p>
                      <p className="text-[13px] text-text-light mt-0.5">{it.desc}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4"><StatusBadge status={it.status} /></td>
                <td className="px-5 py-4 text-[13px] text-text-body">{it.lastSync}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {it.action === "Manage" ? (
                      <button
                        onClick={() => openConfig(it)}
                        className="px-3.5 py-1.5 text-[13px] font-medium text-action-blue border border-border-soft rounded-lg hover:bg-soft-bg transition-colors"
                      >
                        Manage
                      </button>
                    ) : (
                      <button
                        onClick={() => openConfig(it)}
                        className="px-3.5 py-1.5 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-action-blue/90 transition-colors"
                      >
                        Connect
                      </button>
                    )}
                    <div className="relative" ref={menuFor === it.name ? menuRef : undefined}>
                      <button
                        onClick={() => setMenuFor(menuFor === it.name ? null : it.name)}
                        className="text-text-light hover:text-text-muted transition-colors p-0.5"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuFor === it.name && (
                        <div className="absolute right-0 top-7 z-20 w-44 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 text-left">
                          {it.action === "Manage" ? (
                            <>
                              <button
                                onClick={() => sync(it.name)}
                                disabled={it.status === "Syncing"}
                                className="block w-full text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC] disabled:opacity-50"
                              >
                                {it.status === "Syncing" ? "Syncing…" : "Sync now"}
                              </button>
                              <button
                                onClick={() => openConfig(it)}
                                className="block w-full text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]"
                              >
                                Configure
                              </button>
                              <button
                                onClick={() => {
                                  setMenuFor(null);
                                  setDisconnecting(it);
                                }}
                                className="block w-full text-left px-3 py-2 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2]"
                              >
                                Disconnect
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openConfig(it)}
                              className="block w-full text-left px-3 py-2 text-[13px] text-[#374151] hover:bg-[#F8FAFC]"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="flex items-center gap-1.5 mt-5 text-[13px] text-text-body">
        <HelpCircle className="w-4 h-4 text-text-light shrink-0" />
        Don&apos;t see the integration you need?{" "}
        <button
          onClick={() => toast("Support request started — we'll be in touch.", "info")}
          className="text-action-blue hover:underline"
        >
          Contact our support team.
        </button>
      </div>

      {/* Configure / Connect Modal */}
      <Modal
        open={configFor !== null}
        onClose={() => setConfigFor(null)}
        title={configFor ? `Configure ${configFor.name}` : "Configure"}
        description={
          configFor && configFor.action === "Connect"
            ? "Enter your credentials to connect this integration."
            : "Update credentials and sync preferences for this integration."
        }
        footer={
          <>
            <SecondaryButton onClick={() => setConfigFor(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveConfig}>
              {configFor && configFor.action === "Connect" ? "Connect" : "Save settings"}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="API key" required error={configErrors.apiKey}>
            <TextInput
              value={configDraft.apiKey}
              onChange={(e) => { setConfigDraft((d) => ({ ...d, apiKey: e.target.value })); setConfigErrors((p) => ({ ...p, apiKey: undefined })); }}
              placeholder="sk_live_…"
            />
          </Field>
          <Field label="Sync frequency">
            <Select
              options={SYNC_FREQUENCIES}
              value={configDraft.freq}
              onChange={(e) => setConfigDraft((d) => ({ ...d, freq: e.target.value }))}
            />
          </Field>
          <Field label="Webhook URL" error={configErrors.webhook} hint="Optional. We'll POST sync events to this endpoint.">
            <TextInput
              value={configDraft.webhook}
              onChange={(e) => { setConfigDraft((d) => ({ ...d, webhook: e.target.value })); setConfigErrors((p) => ({ ...p, webhook: undefined })); }}
              placeholder="https://example.com/webhooks/fulfillmesh"
            />
          </Field>
        </div>
      </Modal>

      {/* Disconnect Confirm */}
      <ConfirmDialog
        open={disconnecting !== null}
        onClose={() => setDisconnecting(null)}
        onConfirm={handleDisconnect}
        title="Disconnect integration"
        message={`Disconnect ${disconnecting?.name ?? ""}? Data syncing will stop until you reconnect.`}
        confirmLabel="Disconnect"
        destructive
      />
    </div>
  );
}
