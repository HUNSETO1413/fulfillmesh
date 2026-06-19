"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown, Building2, Globe, Palette, Database, Languages,
  Upload, Image as ImageIcon, RotateCcw, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/dashboard/Toast";
import { api } from "@/lib/client";

type GeneralSettings = {
  companyName: string;
  legalName: string;
  taxId: string;
  website: string;
  industry: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  numberFormat: string;
  weekStart: string;
  fiscalYearStart: string;
  dataRetention: string;
  orderPrefix: string;
  defaultWarehouse: string;
  logoUrl: string;
  emailFrom: string;
  replyTo: string;
  primaryColor: string;
};

const initialSettings: GeneralSettings = {
  companyName: "FulfillMesh Co.",
  legalName: "FulfillMesh Inc.",
  taxId: "US-12345678",
  website: "https://fulfillmesh.com",
  industry: "Logistics & Fulfillment",
  timezone: "(UTC-05:00) Eastern Time (US & Canada)",
  dateFormat: "May 18, 2025 (MMMM D, YYYY)",
  timeFormat: "12-hour (AM/PM)",
  currency: "USD - US Dollar ($)",
  language: "English",
  numberFormat: "1,234.56",
  weekStart: "Monday",
  fiscalYearStart: "January",
  dataRetention: "24 months",
  orderPrefix: "ORD-",
  defaultWarehouse: "ATL-1 (Atlanta)",
  logoUrl: "",
  emailFrom: "noreply@fulfillmesh.com",
  replyTo: "support@fulfillmesh.com",
  primaryColor: "#3B82F6",
};

const inputCls = "w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0057D8]/20 focus:border-[#0057D8] transition-colors";
const selectCls = "w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0057D8]/20 focus:border-[#0057D8] appearance-none pr-10 transition-colors cursor-pointer";
const fieldLabel = "block text-[14px] font-medium text-[#1E293B] mb-1.5";
const hintCls = "text-[12px] text-[#94A3B8] mt-1.5";
const card = "bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6";
const sectionTitle = "text-[16px] font-semibold text-[#1E293B]";

export default function GeneralSettingsPage() {
  const { toast } = useToast();
  const [saved, setSaved] = useState<GeneralSettings>(initialSettings);
  const [form, setForm] = useState<GeneralSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await api.get<Record<string, unknown>>("/api/settings");
        if (!alive) return;
        const section = (all.general ?? {}) as Partial<GeneralSettings>;
        // Merge the stored section over the defaults so any missing field
        // falls back sensibly and extra fields round-trip.
        const next: GeneralSettings = { ...initialSettings, ...section };
        setForm(next);
        setSaved(next);
        if (next.logoUrl && next.logoUrl.startsWith("data:")) setLogoPreview(next.logoUrl);
      } catch {
        if (alive) toast("Failed to load settings", "error");
      }
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = Object.keys(form).some((k) => form[k as keyof GeneralSettings] !== saved[k as keyof GeneralSettings]);

  const set = (patch: Partial<GeneralSettings>) => {
    setForm((f) => ({ ...f, ...patch }));
    // clear errors for changed fields
    setErrors((e) => {
      const next = { ...e };
      for (const k of Object.keys(patch)) delete next[k];
      return next;
    });
  };

  function handleLogoUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { toast("Logo must be under 2MB", "error"); return; }
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
        set({ logoUrl: file.name });
        toast("Logo uploaded");
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.companyName.trim()) errs.companyName = "Company name is required";
    if (!form.emailFrom.trim()) errs.emailFrom = "Sender email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailFrom)) errs.emailFrom = "Invalid email address";
    if (!form.replyTo.trim()) errs.replyTo = "Reply-to email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.replyTo)) errs.replyTo = "Invalid email address";
    if (form.website && !form.website.match(/^https?:\/\/.+/)) errs.website = "Must start with http:// or https://";
    setErrors(errs);
    if (Object.keys(errs).length > 0) toast("Please fix the errors before saving", "error");
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    setSaving(true);
    api.put("/api/settings", { general: { ...form } })
      .then(() => {
        setSaved({ ...form });
        toast("General settings saved");
      })
      .catch(() => toast("Failed to save settings", "error"))
      .finally(() => setSaving(false));
  }

  function handleReset() {
    setForm({ ...saved });
    setErrors({});
    toast("Changes discarded");
  }

  return (
    <div className="max-w-[960px] space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-[#1E293B]">General Settings</h2>
          <p className="text-[14px] text-[#64748B] mt-1">Manage your company profile, regional preferences, and system defaults.</p>
        </div>
        {dirty && (
          <button onClick={handleReset} className="flex items-center gap-2 text-[13px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2 hover:bg-[#F8FAFC]">
            <RotateCcw className="w-4 h-4" /> Discard changes
          </button>
        )}
      </div>

      {/* ── Section 1: Company Information ── */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-[#3B82F6]" /></div>
          <div><h3 className={sectionTitle}>Company Information</h3><p className="text-[12px] text-[#64748B]">Your company&apos;s identity and contact details.</p></div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {/* Logo */}
          <div className="col-span-2">
            <label className={fieldLabel}>Company Logo</label>
            <div className="flex items-center gap-4 mt-1">
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-[#E2E8F0] flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- logo is a client-side data-URL preview, not a static asset for next/image
                  <img src={logoPreview} alt="Company logo preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#94A3B8]" />
                )}
              </div>
              <div>
                <button onClick={handleLogoUpload} className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-[#3B82F6] bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-lg hover:bg-[#3B82F6]/10">
                  <Upload className="w-4 h-4" /> Upload logo
                </button>
                <p className={hintCls}>PNG, JPG or SVG. Max 2MB. Recommended 200×200px.</p>
              </div>
            </div>
          </div>
          <div>
            <label className={fieldLabel}>Company Name <span className="text-[#EF4444]">*</span></label>
            <input value={form.companyName} onChange={(e) => set({ companyName: e.target.value })} className={`${inputCls} ${errors.companyName ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20" : ""}`} />
            {errors.companyName ? <p className="text-[12px] text-[#EF4444] mt-1.5">{errors.companyName}</p> : <p className={hintCls}>Your company&apos;s display name</p>}
          </div>
          <div>
            <label className={fieldLabel}>Legal Name</label>
            <input value={form.legalName} onChange={(e) => set({ legalName: e.target.value })} className={inputCls} />
            <p className={hintCls}>Registered legal entity name</p>
          </div>
          <div>
            <label className={fieldLabel}>Tax ID / VAT Number</label>
            <input value={form.taxId} onChange={(e) => set({ taxId: e.target.value })} className={inputCls} placeholder="US-12345678" />
          </div>
          <div>
            <label className={fieldLabel}>Website</label>
            <input value={form.website} onChange={(e) => set({ website: e.target.value })} className={`${inputCls} ${errors.website ? "border-[#EF4444]" : ""}`} placeholder="https://example.com" />
            {errors.website && <p className="text-[12px] text-[#EF4444] mt-1.5">{errors.website}</p>}
          </div>
          <div>
            <label className={fieldLabel}>Industry</label>
            <div className="relative">
              <select value={form.industry} onChange={(e) => set({ industry: e.target.value })} className={selectCls}>
                <option>Logistics & Fulfillment</option>
                <option>E-commerce</option>
                <option>Manufacturing</option>
                <option>Wholesale / Distribution</option>
                <option>Retail</option>
                <option>Technology</option>
                <option>Other</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Regional Settings ── */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 flex items-center justify-center"><Globe className="w-5 h-5 text-[#10B981]" /></div>
          <div><h3 className={sectionTitle}>Regional Settings</h3><p className="text-[12px] text-[#64748B]">Time zone, language, and formatting preferences.</p></div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={fieldLabel}>Time Zone</label>
            <div className="relative">
              <select value={form.timezone} onChange={(e) => set({ timezone: e.target.value })} className={selectCls}>
                <option>(UTC-05:00) Eastern Time (US &amp; Canada)</option>
                <option>(UTC-08:00) Pacific Time (US &amp; Canada)</option>
                <option>(UTC-07:00) Mountain Time (US &amp; Canada)</option>
                <option>(UTC-06:00) Central Time (US &amp; Canada)</option>
                <option>(UTC+00:00) London, Edinburgh</option>
                <option>(UTC+01:00) Paris, Berlin, Rome</option>
                <option>(UTC+08:00) Beijing, Shanghai, Singapore</option>
                <option>(UTC+09:00) Tokyo, Osaka, Seoul</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className={hintCls}>Affects all timestamps displayed in the system</p>
          </div>
          <div>
            <label className={fieldLabel}>Date Format</label>
            <div className="relative">
              <select value={form.dateFormat} onChange={(e) => set({ dateFormat: e.target.value })} className={selectCls}>
                <option>May 18, 2025 (MMMM D, YYYY)</option>
                <option>05/18/2025 (MM/DD/YYYY)</option>
                <option>18/05/2025 (DD/MM/YYYY)</option>
                <option>2025-05-18 (YYYY-MM-DD)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={fieldLabel}>Time Format</label>
            <div className="relative">
              <select value={form.timeFormat} onChange={(e) => set({ timeFormat: e.target.value })} className={selectCls}>
                <option>12-hour (AM/PM)</option>
                <option>24-hour</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={fieldLabel}>Currency</label>
            <div className="relative">
              <select value={form.currency} onChange={(e) => set({ currency: e.target.value })} className={selectCls}>
                <option>USD - US Dollar ($)</option>
                <option>EUR - Euro (&euro;)</option>
                <option>GBP - British Pound (&pound;)</option>
                <option>CNY - Chinese Yuan (&yen;)</option>
                <option>JPY - Japanese Yen (&yen;)</option>
                <option>CAD - Canadian Dollar (C$)</option>
                <option>AUD - Australian Dollar (A$)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={fieldLabel}>Language</label>
            <div className="relative">
              <select value={form.language} onChange={(e) => set({ language: e.target.value })} className={selectCls}>
                <option>English</option>
                <option>中文 (Chinese)</option>
                <option>日本語 (Japanese)</option>
                <option>Español (Spanish)</option>
                <option>Français (French)</option>
                <option>Deutsch (German)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={fieldLabel}>Number Format</label>
            <div className="relative">
              <select value={form.numberFormat} onChange={(e) => set({ numberFormat: e.target.value })} className={selectCls}>
                <option>1,234.56</option>
                <option>1.234,56</option>
                <option>1 234.56</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={fieldLabel}>Week Starts On</label>
            <div className="relative">
              <select value={form.weekStart} onChange={(e) => set({ weekStart: e.target.value })} className={selectCls}>
                <option>Monday</option>
                <option>Sunday</option>
                <option>Saturday</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={fieldLabel}>Fiscal Year Start</label>
            <div className="relative">
              <select value={form.fiscalYearStart} onChange={(e) => set({ fiscalYearStart: e.target.value })} className={selectCls}>
                {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Defaults ── */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#7C6FF6]/10 flex items-center justify-center"><Database className="w-5 h-5 text-[#7C6FF6]" /></div>
          <div><h3 className={sectionTitle}>System Defaults</h3><p className="text-[12px] text-[#64748B]">Default behaviors and operational preferences.</p></div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={fieldLabel}>Order ID Prefix</label>
            <input value={form.orderPrefix} onChange={(e) => set({ orderPrefix: e.target.value })} className={inputCls} placeholder="ORD-" />
            <p className={hintCls}>Auto-prepended to all new order IDs</p>
          </div>
          <div>
            <label className={fieldLabel}>Default Warehouse</label>
            <div className="relative">
              <select value={form.defaultWarehouse} onChange={(e) => set({ defaultWarehouse: e.target.value })} className={selectCls}>
                <option>ATL-1 (Atlanta)</option>
                <option>LAX-1 (Los Angeles)</option>
                <option>DFW-1 (Dallas)</option>
                <option>MIA-1 (Miami)</option>
                <option>ORD-1 (Chicago)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={fieldLabel}>Data Retention</label>
            <div className="relative">
              <select value={form.dataRetention} onChange={(e) => set({ dataRetention: e.target.value })} className={selectCls}>
                <option>12 months</option>
                <option>18 months</option>
                <option>24 months</option>
                <option>36 months</option>
                <option>Indefinite</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className={hintCls}>How long historical data is kept before archival</p>
          </div>
        </div>
      </div>

      {/* ── Section 4: Communication ── */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center"><Languages className="w-5 h-5 text-[#F59E0B]" /></div>
          <div><h3 className={sectionTitle}>Communication Defaults</h3><p className="text-[12px] text-[#64748B]">Email sender settings for automated messages.</p></div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={fieldLabel}>Sender Email <span className="text-[#EF4444]">*</span></label>
            <input value={form.emailFrom} onChange={(e) => set({ emailFrom: e.target.value })} className={`${inputCls} ${errors.emailFrom ? "border-[#EF4444]" : ""}`} />
            {errors.emailFrom ? <p className="text-[12px] text-[#EF4444] mt-1.5">{errors.emailFrom}</p> : <p className={hintCls}>The &quot;From&quot; address for system emails</p>}
          </div>
          <div>
            <label className={fieldLabel}>Reply-To Email <span className="text-[#EF4444]">*</span></label>
            <input value={form.replyTo} onChange={(e) => set({ replyTo: e.target.value })} className={`${inputCls} ${errors.replyTo ? "border-[#EF4444]" : ""}`} />
            {errors.replyTo ? <p className="text-[12px] text-[#EF4444] mt-1.5">{errors.replyTo}</p> : <p className={hintCls}>Where customer replies are sent</p>}
          </div>
        </div>
      </div>

      {/* ── Section 5: Appearance ── */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#EC4899]/10 flex items-center justify-center"><Palette className="w-5 h-5 text-[#EC4899]" /></div>
          <div><h3 className={sectionTitle}>Appearance</h3><p className="text-[12px] text-[#64748B]">Customize the look of your dashboard and customer-facing pages.</p></div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={fieldLabel}>Primary Brand Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.primaryColor} onChange={(e) => set({ primaryColor: e.target.value })} className="w-10 h-10 rounded-lg border border-[#E2E8F0] cursor-pointer" />
              <input value={form.primaryColor} onChange={(e) => set({ primaryColor: e.target.value })} className={inputCls + " flex-1 font-mono"} maxLength={7} />
            </div>
            <p className={hintCls}>Used for buttons, links, and accents throughout the platform</p>
          </div>
        </div>
        {/* Color preview */}
        <div className="mt-5 p-4 rounded-lg border border-[#E2E8F0] flex items-center gap-4">
          <div className="w-24 h-10 rounded-lg flex items-center justify-center text-white text-[13px] font-semibold" style={{ backgroundColor: form.primaryColor }}>
            Primary
          </div>
          <div className="w-24 h-10 rounded-lg flex items-center justify-center text-[13px] font-semibold border" style={{ color: form.primaryColor, borderColor: form.primaryColor + "40", backgroundColor: form.primaryColor + "10" }}>
            Secondary
          </div>
          <div className="w-24 h-10 rounded-lg flex items-center justify-center bg-[#10B981] text-white text-[13px] font-semibold">
            Success
          </div>
          <div className="w-24 h-10 rounded-lg flex items-center justify-center bg-[#EF4444] text-white text-[13px] font-semibold">
            Danger
          </div>
        </div>
      </div>

      {/* ── Sticky Save Bar ── */}
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
            <button onClick={handleReset} className="px-4 py-2 text-[13px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]">
              Discard
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="px-6 py-2.5 text-white rounded-lg text-[14px] font-semibold shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all hover:brightness-110 disabled:opacity-60"
            style={{ background: `linear-gradient(90deg, ${form.primaryColor} 0%, ${form.primaryColor}dd 100%)` }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
