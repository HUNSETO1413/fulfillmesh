"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2, Store, BarChart3, Globe, Headphones, CheckCircle2, Check,
  ArrowRight, Bell, TrendingUp, Target, Zap, ShieldCheck, Sparkles,
  Building, User, ClipboardList, MessageSquare, ShoppingCart, LifeBuoy, X,
  Plus,
} from "lucide-react";

const steps = [
  { num: 1, icon: Building2, title: "Company Info", desc: "Basic details about your business", active: true },
  { num: 2, icon: Store, title: "Sales Channels", desc: "Where do you sell your products?" },
  { num: 3, icon: BarChart3, title: "Order Volume", desc: "Estimate your monthly order volume" },
  { num: 4, icon: Globe, title: "Markets", desc: "Where do you ship to?" },
  { num: 5, icon: Headphones, title: "Services Needed", desc: "What support do you need?" },
  { num: 6, icon: CheckCircle2, title: "Review", desc: "Confirm your details and finish" },
];

const benefits = [
  { icon: Target, title: "Tailored partner matching", desc: "We match you with suppliers that fit your needs, products, and goals." },
  { icon: Zap, title: "Faster onboarding", desc: "Complete your profile now and get matched up to 3x faster." },
  { icon: ShieldCheck, title: "Better recommendations", desc: "Get service and pricing recommendations built just for you." },
  { icon: TrendingUp, title: "Stronger results", desc: "Our customers see up to 30% faster delivery and lower fulfillment costs." },
];

const channels = ["Shopify", "WooCommerce", "Amazon", "Etsy", "TikTok Shop", "Other"];
const volumes = ["0 - 100 orders", "101 - 500 orders", "501 - 1,000 orders", "1,001 - 5,000 orders", "5,000+ orders"];
const productTypeOptions = [
  "Apparel", "Accessories", "Home & Living", "Beauty & Personal Care",
  "Electronics", "Toys & Games", "Health & Wellness", "Pet Supplies",
  "Food & Beverage", "Other",
];

const DRAFT_KEY = "fulfillmesh:onboarding-draft";

interface OnboardingDraft {
  companyName: string;
  website: string;
  businessType: string;
  companySize: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
  productTypes: string[];
  handlingNotes: string;
  volume: string;
  channels: string[];
  notes: string;
}

function BrandLogo({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "Shopify":
      return (
        <svg viewBox="0 0 256 292" className={className} aria-hidden>
          <path fill="#95BF47" d="M223.8 57.3c-.2-1.5-1.5-2.3-2.6-2.4-1.1-.1-22.7-1.7-22.7-1.7s-15-14.9-16.7-16.5c-1.7-1.7-4.9-1.2-6.2-.8-.2.1-3.4 1-8.6 2.6-5.2-14.9-14.3-28.6-30.4-28.6h-1.4C130.4 3.6 124.7.9 119.7.9c-38.3.1-56.7 48-62.4 72.3-14.9 4.6-25.5 7.9-26.9 8.3-8.3 2.6-8.5 2.9-9.6 10.7C20 98.1.1 252.4.1 252.4l155.4 29.1 84.2-18.2S224 58.8 223.8 57.3zM150.6 39.3l-13.8 4.3c0-1 .1-1.9.1-3 0-9.6-1.3-17.4-3.5-23.5 8.6 1.1 14.4 11 17.2 22.2zM123 18.8c2.4 6 4 14.7 4 26.4v1.9l-28.5 8.8C104 35.2 115 25.4 123 18.8zM111.8 8.1c1.4 0 2.9.5 4.2 1.4-10.6 5-22 17.5-26.8 42.6l-22.6 7C72.2 36.5 87.7 8.1 111.8 8.1z"/>
          <path fill="#5E8E3E" d="M221.2 54.9c-1.1-.1-22.7-1.7-22.7-1.7s-15-14.9-16.7-16.5c-.6-.6-1.5-.9-2.3-1l-11.7 240 84.2-18.2S224 58.8 223.8 57.3c-.2-1.5-1.5-2.3-2.6-2.4z"/>
          <path fill="#FFF" d="M135.3 104.7l-10.4 30.9s-9.1-4.9-20.3-4.9c-16.4 0-17.2 10.3-17.2 12.9 0 14.1 36.8 19.5 36.8 52.6 0 26-16.5 42.8-38.8 42.8-26.7 0-40.4-16.6-40.4-16.6l7.1-23.6s14 12 25.9 12c7.8 0 11-6.1 11-10.6 0-18.4-30.2-19.2-30.2-49.5 0-25.5 18.3-50.1 55.2-50.1 14.2 0 21.3 4.1 21.3 4.1z"/>
        </svg>
      );
    case "WooCommerce":
      return (
        <svg viewBox="0 0 256 153" className={className} aria-hidden>
          <path fill="#7F54B3" d="M23.8 0h208.2c13.2 0 23.9 10.7 23.9 23.9v79.6c0 13.2-10.7 23.9-23.9 23.9H157.3l10.2 25.1-45.1-25.1H23.9C10.7 127.4 0 116.7 0 103.5V23.9C-.1 10.7 10.6 0 23.8 0z"/>
          <path fill="#FFF" d="M14.6 21.8c1.5-2 3.6-3 6.5-3.2 5.3-.4 8.3 2.1 9 7.5 3.1 20.9 6.5 38.6 10.1 53.1l21.9-41.7c2-3.8 4.5-5.8 7.5-6 4.4-.3 7.1 2.5 8.2 8.4 2.5 13.3 5.7 24.6 9.5 34.2 2.6-25.4 7-43.7 13.2-55 1.6-3 3.9-4.5 7-4.7 2.4-.2 4.6.5 6.6 2.1 2 1.6 3 3.6 3.2 6 .1 1.9-.2 3.5-1.1 5.1-3.9 7.2-7.1 19.2-9.7 35.9-2.5 16.2-3.4 28.8-2.8 37.8.2 2.5-.2 4.7-1.2 6.6-1.2 2.2-3 3.4-5.3 3.6-2.6.2-5.3-1-7.9-3.7-9.3-9.5-16.7-23.7-22.1-42.6-6.5 12.8-11.3 22.4-14.4 28.8-5.9 11.3-10.9 17.1-15.1 17.4-2.7.2-5-2.1-7-6.9-5.1-13.1-10.6-38.4-16.5-75.9-.4-2.6.2-4.9 1.7-6.9z"/>
        </svg>
      );
    case "Amazon":
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden>
          <path fill="#FF9900" d="M158.6 195.2c-14.9 11-36.5 16.8-55.1 16.8-26.1 0-49.6-9.6-67.4-25.7-1.4-1.3-.1-3 1.6-2 19.2 11.1 42.9 17.9 67.4 17.9 16.5 0 34.7-3.4 51.4-10.5 2.5-1.1 4.6 1.7 2.1 3.5z"/>
          <path fill="#FF9900" d="M164.8 188.1c-1.9-2.4-12.6-1.2-17.4-.6-1.4.2-1.7-1.1-.4-2 8.5-6 22.5-4.3 24.1-2.3 1.6 2.1-.4 16.1-8.4 22.8-1.2 1-2.4.5-1.8-.9 1.8-4.6 5.9-15 3.9-17z"/>
          <path fill="#221F1F" d="M147.8 24.9V14.2c0-1.6 1.2-2.7 2.7-2.7h47.9c1.5 0 2.8 1.1 2.8 2.7v9.2c0 1.5-1.3 3.6-3.6 6.8l-24.8 35.4c9.2-.2 19 1.2 27.4 5.9 1.9 1.1 2.4 2.6 2.5 4.2v11.4c0 1.6-1.7 3.4-3.5 2.5-14.8-7.8-34.5-8.6-50.9.1-1.7.9-3.4-.9-3.4-2.5V76.1c0-1.7 0-4.7 1.8-7.4l28.7-41.2h-25c-1.5 0-2.8-1.1-2.8-2.6z"/>
          <path fill="#221F1F" d="M51.3 96.3H36.7c-1.4-.1-2.5-1.1-2.6-2.5V14.4c0-1.5 1.3-2.7 2.8-2.7h13.6c1.4.1 2.5 1.2 2.6 2.5v10.4h.3c3.5-9.5 10.2-13.9 19.2-13.9 9.1 0 14.9 4.4 19 13.9 3.5-9.5 11.6-13.9 20.2-13.9 6.1 0 12.8 2.5 16.8 8.2 4.6 6.3 3.7 15.4 3.7 23.4v47.1c0 1.5-1.3 2.7-2.8 2.7h-14.5c-1.5-.1-2.6-1.3-2.6-2.7V53.2c0-3.2.3-11.1-.4-14.1-1.1-5-4.4-6.4-8.6-6.4-3.5 0-7.2 2.4-8.7 6.1-1.5 3.8-1.4 10.1-1.4 14.4v39.6c0 1.5-1.3 2.7-2.8 2.7H76.5c-1.5-.1-2.6-1.3-2.6-2.7l-.1-39.6c0-8.3 1.4-20.6-9-20.6-10.5 0-10.1 11.9-10.1 20.6v39.6c.1 1.5-1.2 2.7-2.7 2.7z"/>
        </svg>
      );
    case "Etsy":
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden>
          <rect width="256" height="256" rx="40" fill="#F1641E"/>
          <path fill="#FFF" d="M101.7 79.6c0-2.3.2-3.6 4.2-3.6h54.6c9.6 0 14.8 8.1 18.6 23.3l3 12.1h9.2c1.6-37.4 3.3-53.8 3.3-53.8s-25.7 2.9-40.9 2.9H93.4l-27.8-.9v9.8l9.4 1.8c6.6 1.3 8.2 2.7 8.7 8.8 0 0 .6 17.9.6 47.4s-.6 47.2-.6 47.2c0 5.4-2.1 7.4-8.7 8.7l-9.4 1.8v9.8l27.8-.9h46.6c15.4 0 51.1 1.8 51.1 1.8 .8-9.4 6-41.3 6.7-44.8h-8.7l-9.6 21.6c-7.6 17.1-18.6 18.2-30.8 18.2h-18.4c-12.2 0-18.6-4.8-18.6-15.3 0 0-.5-23.4-.5-37.9 0 0 19.6 0 26 .5 4.9.4 7.9 1.7 9.4 8.4l2.7 11.6h9.8l-.6-31.2.9-31.4h-9.8l-3 13c-1.5 6.5-2.5 8-9.4 8.5-9 .6-25.4.5-25.4.5z"/>
        </svg>
      );
    case "TikTok Shop":
      return (
        <svg viewBox="0 0 256 290" className={className} aria-hidden>
          <path fill="#FF004F" d="M189.7 104.4c18.7 13.4 41.6 21.3 66.3 21.3v-47.5c-4.7 0-9.3-.5-13.9-1.4v37.4c-24.7 0-47.6-7.9-66.3-21.3v96.9c0 48.5-39.3 87.8-87.8 87.8-18.1 0-34.9-5.5-48.9-14.8 16 16.3 38.2 26.4 62.8 26.4 48.5 0 87.9-39.3 87.9-87.8v-96.9zm17.2-47.9c-9.6-10.4-15.8-23.9-17.2-38.8v-6.1h-13.2c3.3 19 14.6 35.2 30.4 44.9zM69.9 222.5c-5.3-7-8.2-15.6-8.2-24.4 0-22.3 18.1-40.4 40.4-40.4 4.2 0 8.3.6 12.2 1.9v-48.6c-4.6-.6-9.2-.9-13.9-.8v37.8c-3.9-1.2-8-1.9-12.2-1.9-22.3 0-40.4 18.1-40.4 40.4 0 15.8 9 29.4 22.1 36z"/>
          <path fill="#000" d="M175.8 93.9c18.7 13.4 41.6 21.3 66.3 21.3V77.8c-13.8-2.9-26-10.1-35.2-20.1-15.8-9.7-27.1-25.9-30.4-44.9h-34.6v189.9c-.1 22.2-18.1 40.2-40.4 40.2-13.1 0-24.8-6.2-32.2-15.9-13.1-6.6-22.1-20.2-22.1-36 0-22.3 18.1-40.4 40.4-40.4 4.3 0 8.4.7 12.2 1.9v-37.8c-47.7 1-86 39.9-86 87.8 0 23.9 9.6 45.6 25.1 61.4 14 9.3 30.8 14.8 48.9 14.8 48.5 0 87.8-39.3 87.8-87.8V93.9z"/>
          <path fill="#00F2EA" d="M242.1 77.8v-10.1c-12.4 0-24.6-3.5-35.2-10 9.4 10.2 21.7 17.3 35.2 20.1zM176.5 12.8c-.3-1.8-.6-3.6-.7-5.4V1.3h-47.8v189.9c-.1 22.2-18.1 40.2-40.4 40.2-6.6 0-12.8-1.6-18.3-4.3 7.4 9.7 19.1 15.9 32.2 15.9 22.3 0 40.3-18 40.4-40.2V12.8h34.6zM101.9 113.9v-10.8c-4-.5-8-.8-12.1-.8C41.3 102.3 1.9 141.6 1.9 190.1c0 30.4 15.5 57.2 39 73 -15.5-15.8-25.1-37.5-25.1-61.4 0-47.9 38.3-86.8 86.1-87.8z"/>
        </svg>
      );
    default:
      return (
        <span className="text-text-muted font-bold text-lg leading-none">&middot;&middot;&middot;</span>
      );
  }
}

function TrustLogo() {
  return (
    <span className="inline-flex items-center gap-1.5 opacity-70">
      <span className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14 2 9.4h7.6z" /></svg>
      </span>
      <span className="text-[14px] font-semibold text-white">logoipsum</span>
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[13px] font-medium text-deep-navy mb-1.5">{children}</label>;
}
const inputCls =
  "w-full px-4 py-2.5 rounded-[10px] border border-border-soft text-sm bg-white text-text-body focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors";

type FieldErrors = Partial<Record<keyof OnboardingDraft, string>>;

export default function OnboardingPage() {
  const router = useRouter();

  // Form state (mirrors OnboardingDraft).
  const [companyName, setCompanyName] = useState("Acme Retail");
  const [website, setWebsite] = useState("https://acmeretail.com");
  const [businessType, setBusinessType] = useState("E-commerce Brand");
  const [companySize, setCompanySize] = useState("11 – 50 employees");
  const [contactName, setContactName] = useState("Bessie Cooper");
  const [contactEmail, setContactEmail] = useState("bessie@acmeretail.com");
  const [contactPhone, setContactPhone] = useState("🇺🇸 +1 (555) 123-4567");
  const [contactRole, setContactRole] = useState("Operations Manager");
  const [productTypes, setProductTypes] = useState<string[]>(["Apparel", "Accessories", "Home & Living"]);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [handlingNotes, setHandlingNotes] = useState("");
  const [volume, setVolume] = useState("101 - 500 orders");
  const [picked, setPicked] = useState<string[]>(["Shopify", "Amazon"]);
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const productMenuRef = useRef<HTMLDivElement>(null);

  // Hydrate from a previously saved draft on mount. Reading localStorage must
  // happen client-side only (it is undefined during SSR), so this lives in an
  // effect. The setState calls are deferred via queueMicrotask so they run after
  // the effect commits rather than synchronously inside it.
  useEffect(() => {
    let raw: string | null;
    try {
      raw = localStorage.getItem(DRAFT_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    let d: Partial<OnboardingDraft>;
    try {
      d = JSON.parse(raw) as Partial<OnboardingDraft>;
    } catch {
      return; // corrupt draft — start fresh
    }
    queueMicrotask(() => {
      if (typeof d.companyName === "string") setCompanyName(d.companyName);
      if (typeof d.website === "string") setWebsite(d.website);
      if (typeof d.businessType === "string") setBusinessType(d.businessType);
      if (typeof d.companySize === "string") setCompanySize(d.companySize);
      if (typeof d.contactName === "string") setContactName(d.contactName);
      if (typeof d.contactEmail === "string") setContactEmail(d.contactEmail);
      if (typeof d.contactPhone === "string") setContactPhone(d.contactPhone);
      if (typeof d.contactRole === "string") setContactRole(d.contactRole);
      if (Array.isArray(d.productTypes)) setProductTypes(d.productTypes.filter((x): x is string => typeof x === "string"));
      if (typeof d.handlingNotes === "string") setHandlingNotes(d.handlingNotes);
      if (typeof d.volume === "string") setVolume(d.volume);
      if (Array.isArray(d.channels)) setPicked(d.channels.filter((x): x is string => typeof x === "string"));
      if (typeof d.notes === "string") setNotes(d.notes);
    });
  }, []);

  // Close the product-type dropdown on outside click.
  useEffect(() => {
    if (!productMenuOpen) return;
    function onClick(e: MouseEvent) {
      if (productMenuRef.current && !productMenuRef.current.contains(e.target as Node)) {
        setProductMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [productMenuOpen]);

  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  const toggleProductType = (n: string) =>
    setProductTypes((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  const removeProductType = (n: string) => setProductTypes((p) => p.filter((x) => x !== n));

  const collectDraft = (): OnboardingDraft => ({
    companyName, website, businessType, companySize,
    contactName, contactEmail, contactPhone, contactRole,
    productTypes, handlingNotes, volume, channels: picked, notes,
  });

  // Validate the required fields the user can fill on this page.
  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!companyName.trim()) next.companyName = "Company name is required.";
    if (!contactName.trim()) next.contactName = "Full name is required.";
    if (!contactEmail.trim()) {
      next.contactEmail = "Work email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      next.contactEmail = "Enter a valid email address.";
    }
    if (productTypes.length === 0) next.productTypes = "Select at least one product type.";
    if (picked.length === 0) next.channels = "Select at least one sales channel.";
    return next;
  };

  // "Save & Exit" — persist the in-progress form so the user can resume later.
  const handleSaveExit = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(collectDraft()));
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 3500);
    } catch {
      /* storage unavailable — surface nothing destructive */
    }
  };

  // "Continue" — validate the current step before moving on.
  const handleContinue = () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Persist progress + scroll the first error into view.
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(collectDraft()));
      } catch {
        /* ignore */
      }
      const firstKey = Object.keys(next)[0];
      // Defer so any newly-rendered error elements are in the DOM before scrolling.
      window.setTimeout(() => {
        document.getElementById(`onb-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
      return;
    }
    // Valid — persist and advance.
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(collectDraft()));
    } catch {
      /* ignore */
    }
    router.push("/get-started");
  };

  const errCls = "mt-1.5 text-[12px] font-medium text-red-600";

  return (
    <section
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px 600px at 80% -5%, rgba(0,184,148,0.06) 0%, transparent 55%), linear-gradient(180deg, #F0F6FC 0%, #F5F8FB 40%, #F7FAFC 100%)",
      }}
    >
      <div className="max-w-[1240px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-deep-navy">
            Welcome to <span className="text-navy">Fulfill</span><span className="text-teal">Mesh!</span>
          </h1>
          <p className="mt-2 text-[15px] text-text-body">Let&apos;s set up your account in a few simple steps.</p>
        </div>

        {/* Dashboard preview banner */}
        <div className="mb-8 bg-white rounded-2xl border border-border-soft shadow-card overflow-hidden">
          {/* inner header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-soft">
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="w-6 h-6" aria-hidden>
                <path d="M4 24V8l6 8 6-8v16" fill="none" stroke="#003B7A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 24V8l6 8 4-5" fill="none" stroke="#00B894" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[15px] font-bold"><span className="text-navy">Fulfill</span><span className="text-teal">Mesh</span></span>
            </span>
            <Bell className="w-4 h-4 text-text-muted" />
          </div>
          <div className="flex">
            {/* Mini sidebar */}
            <div className="hidden md:flex flex-col gap-0.5 w-[150px] shrink-0 border-r border-border-soft p-3">
              {["Overview", "Orders", "Shipments", "Quality Control", "Inventory", "Warehouses", "Partners", "Reports", "Settings"].map((m, i) => (
                <span key={m} className={`text-[11px] px-2.5 py-1.5 rounded-lg ${i === 0 ? "bg-teal/8 text-teal font-semibold" : "text-text-muted"}`}>{m}</span>
              ))}
            </div>
            {/* Main preview */}
            <div className="flex-1 p-5 min-w-0">
              <p className="text-[14px] font-bold text-deep-navy mb-3">Overview</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Orders", value: "128", delta: "12%" },
                  { label: "Shipments", value: "42", delta: "8%" },
                  { label: "On-Time Delivery", value: "98%", delta: "5%" },
                  { label: "QC Inspections", value: "36", delta: "16%" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border-soft p-3">
                    <p className="text-[11px] text-text-muted">{s.label}</p>
                    <p className="text-[22px] font-bold text-deep-navy leading-tight mt-0.5">{s.value}</p>
                    <span className="inline-flex items-center gap-0.5 mt-1.5 text-[9px] font-semibold text-teal">
                      <TrendingUp className="w-2.5 h-2.5" /> {s.delta}
                      <span className="text-text-muted font-normal ml-0.5">vs last 30 days</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-[1fr_220px] gap-4">
                {/* Recent shipments table */}
                <div className="rounded-xl border border-border-soft p-3 min-w-0">
                  <p className="text-[12px] font-semibold text-deep-navy mb-2">Recent Shipments</p>
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-x-3 gap-y-1.5 text-[10px]">
                    <span className="text-text-muted">Shipment ID</span>
                    <span className="text-text-muted">Route</span>
                    <span className="text-text-muted">Status</span>
                    {[
                      { id: "SHP-2024-0981", route: "Shenzhen → Los Angeles", status: "In Transit", tone: "bg-action-blue/10 text-action-blue" },
                      { id: "SHP-2024-0172", route: "Ningbo → New York", status: "In Transit", tone: "bg-action-blue/10 text-action-blue" },
                      { id: "SHP-2024-0965", route: "Shanghai → London", status: "Delivered", tone: "bg-teal/10 text-teal" },
                      { id: "SHP-2024-0958", route: "Guangzhou → Sydney", status: "In Transit", tone: "bg-action-blue/10 text-action-blue" },
                    ].map((r) => (
                      <div key={r.id} className="contents">
                        <span className="text-deep-navy font-medium truncate">{r.id}</span>
                        <span className="text-text-body truncate">{r.route}</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium justify-self-start ${r.tone}`}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Donut */}
                <div className="rounded-xl border border-border-soft p-3">
                  <p className="text-[12px] font-semibold text-deep-navy mb-2">Orders by Status</p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-[72px] h-[72px] shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0057D8" strokeWidth="4" strokeDasharray="44 56" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00B894" strokeWidth="4" strokeDasharray="16 84" strokeDashoffset="-44" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FF9900" strokeWidth="4" strokeDasharray="22 78" strokeDashoffset="-60" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#9AA8B8" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-82" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[14px] font-bold text-deep-navy leading-none">128</span>
                        <span className="text-[8px] text-text-muted">Total</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-[9px]">
                      {[
                        { c: "#0057D8", t: "In Production 56 (44%)" },
                        { c: "#00B894", t: "QC 20 (16%)" },
                        { c: "#FF9900", t: "In Transit 28 (22%)" },
                        { c: "#9AA8B8", t: "Delivered 70 (20%)" },
                      ].map((l) => (
                        <div key={l.t} className="flex items-center gap-1.5 text-text-body">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.c }} />{l.t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-7" style={{ gridTemplateColumns: "minmax(0,240px) minmax(0,1fr) minmax(0,260px)" }}>
          {/* Left stepper */}
          <aside className="space-y-4">
            <div>
              <p className="text-[15px] font-bold text-deep-navy mb-1">Let&apos;s set up your account</p>
              <p className="text-[12px] text-text-muted leading-relaxed">Tell us a bit about your business so we can match you with the right fulfillment partners.</p>
            </div>
            <ol className="space-y-1">
              {steps.map((s) => (
                <li key={s.title}>
                  <div className={`flex items-start gap-3 p-2.5 rounded-xl ${s.active ? "bg-action-blue/5" : ""}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold ${s.active ? "bg-action-blue text-white" : "bg-white border border-border-soft text-text-muted"}`}>
                      {s.num}
                    </span>
                    <div>
                      <p className={`text-[14px] font-semibold ${s.active ? "text-deep-navy" : "text-deep-navy"}`}>{s.title}</p>
                      <p className="text-[11px] text-text-muted leading-snug">{s.desc}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rounded-2xl border border-teal/15 p-5" style={{ background: "linear-gradient(160deg, rgba(0,184,148,0.08), rgba(0,184,148,0.02))" }}>
              <span className="inline-flex w-10 h-10 rounded-xl bg-teal/12 items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-teal" />
              </span>
              <p className="text-[15px] font-bold text-deep-navy">Almost there!</p>
              <p className="mt-1.5 text-[12px] text-text-body leading-relaxed">Complete setup and get matched with vetted fulfillment partners in minutes.</p>
            </div>
            <div className="bg-white rounded-2xl border border-border-soft p-4">
              <p className="text-[13px] font-semibold text-deep-navy mb-2">Need help?</p>
              <p className="text-[11px] text-text-muted leading-relaxed mb-3">Our team is here to help you get started.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-[12px] font-semibold text-deep-navy border border-border-soft rounded-lg px-3 py-2 hover:bg-soft-bg transition-colors">
                <LifeBuoy className="w-3.5 h-3.5" /> Contact Support
              </Link>
            </div>
          </aside>

          {/* Center form — all sections stacked */}
          <div className="space-y-6">
            {/* Company Information */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-lg bg-action-blue/8 flex items-center justify-center"><Building className="w-5 h-5 text-action-blue" /></span>
                <h2 className="text-[18px] font-bold text-deep-navy">Company Information</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <input
                    id="onb-companyName"
                    className={inputCls}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    aria-invalid={!!errors.companyName}
                  />
                  {errors.companyName && <p className={errCls}>{errors.companyName}</p>}
                </div>
                <div>
                  <Label>Website (Optional)</Label>
                  <input className={inputCls} value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <div>
                  <Label>Business Type</Label>
                  <select className={inputCls} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                    {["E-commerce Brand", "Retailer", "Wholesaler", "Manufacturer", "Other"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Company Size</Label>
                  <select className={inputCls} value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
                    {["1 – 10 employees", "11 – 50 employees", "51 – 200 employees", "200+ employees"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Primary Contact */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-lg bg-action-blue/8 flex items-center justify-center"><User className="w-5 h-5 text-action-blue" /></span>
                <h2 className="text-[18px] font-bold text-deep-navy">Primary Contact</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <input
                    id="onb-contactName"
                    className={inputCls}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    aria-invalid={!!errors.contactName}
                  />
                  {errors.contactName && <p className={errCls}>{errors.contactName}</p>}
                </div>
                <div>
                  <Label>Work Email</Label>
                  <input
                    id="onb-contactEmail"
                    type="email"
                    className={inputCls}
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    aria-invalid={!!errors.contactEmail}
                  />
                  {errors.contactEmail && <p className={errCls}>{errors.contactEmail}</p>}
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <input className={inputCls} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                </div>
                <div>
                  <Label>Role</Label>
                  <select className={inputCls} value={contactRole} onChange={(e) => setContactRole(e.target.value)}>
                    {["Operations Manager", "Founder / CEO", "Logistics Lead", "E-commerce Manager", "Other"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Tell us about your business */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-lg bg-action-blue/8 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-action-blue" /></span>
                <h2 className="text-[18px] font-bold text-deep-navy">Tell us about your business</h2>
              </div>
              <Label>What type of products do you sell?</Label>
              <div className="relative" ref={productMenuRef}>
                <div
                  id="onb-productTypes"
                  className={`flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-[10px] border bg-white ${errors.productTypes ? "border-red-400" : "border-border-soft"}`}
                >
                  {productTypes.length === 0 && (
                    <span className="text-[13px] text-text-light">Select the product types you sell…</span>
                  )}
                  {productTypes.map((p) => (
                    <span key={p} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-action-blue/8 text-[13px] font-medium text-action-blue">
                      {p}
                      <button
                        type="button"
                        onClick={() => removeProductType(p)}
                        aria-label={`Remove ${p}`}
                        className="rounded hover:bg-action-blue/15 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setProductMenuOpen((o) => !o)}
                    aria-expanded={productMenuOpen}
                    aria-label="Add product type"
                    className="ml-auto inline-flex items-center gap-1 text-[13px] font-medium text-action-blue hover:opacity-80 pr-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                {productMenuOpen && (
                  <div className="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-[10px] border border-border-soft bg-white shadow-card py-1.5">
                    {productTypeOptions.map((opt) => {
                      const on = productTypes.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleProductType(opt)}
                          className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-[13px] text-text-body hover:bg-soft-bg transition-colors"
                        >
                          {opt}
                          {on && <Check className="w-4 h-4 text-action-blue" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {errors.productTypes && <p className={errCls}>{errors.productTypes}</p>}
              <div className="mt-5">
                <Label>Any special handling or storage requirements?</Label>
                <textarea rows={3} value={handlingNotes} onChange={(e) => setHandlingNotes(e.target.value)} className="w-full px-4 py-3 rounded-[10px] border border-border-soft text-sm text-text-body focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors resize-none" placeholder="e.g., fragile items, temperature control, oversized products..." />
              </div>
            </div>

            {/* Monthly Order Volume */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-lg bg-action-blue/8 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-action-blue" /></span>
                <div>
                  <h2 className="text-[18px] font-bold text-deep-navy">Monthly Order Volume (Estimated)</h2>
                  <p className="text-[13px] text-text-muted mt-0.5">This helps us match you with the right fulfillment partners.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {volumes.map((v) => {
                  const on = volume === v;
                  return (
                    <button key={v} onClick={() => setVolume(v)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-medium border transition-colors ${on ? "bg-action-blue/8 border-action-blue text-action-blue" : "border-border-soft text-text-body hover:border-action-blue/40"}`}>
                      {on && <span className="w-4 h-4 rounded-full bg-action-blue text-white flex items-center justify-center"><Check className="w-2.5 h-2.5" strokeWidth={3} /></span>}
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anything else */}
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-lg bg-action-blue/8 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-action-blue" /></span>
                <div>
                  <h2 className="text-[18px] font-bold text-deep-navy">Anything else we should know?</h2>
                  <p className="text-[13px] text-text-muted mt-0.5">Optional details that help us provide better recommendations.</p>
                </div>
              </div>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 rounded-[10px] border border-border-soft text-sm text-text-body focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors resize-none" placeholder="Tell us about your business goals, challenges, or any specific needs..." />
            </div>
          </div>

          {/* Right tips */}
          <aside>
            <div className="bg-white rounded-2xl border border-border-soft shadow-card p-5 sticky top-24">
              <p className="text-[14px] font-bold text-deep-navy mb-4">Why set up your profile?</p>
              <div className="space-y-4">
                {benefits.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.title} className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-teal" />
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-deep-navy">{b.title}</p>
                        <p className="text-[12px] text-text-muted leading-snug mt-0.5">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* Sales channels — full width */}
        <div className="mt-6 bg-white rounded-2xl border border-border-soft shadow-card p-7">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-9 h-9 rounded-lg bg-action-blue/8 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-action-blue" /></span>
            <h2 className="text-[18px] font-bold text-deep-navy">Select your sales channels</h2>
          </div>
          <p className="text-[13px] text-text-muted mb-5 pl-12">Choose all the channels where you sell your products.</p>
          {errors.channels && <p id="onb-channels" className={`${errCls} pl-12 mb-3`}>{errors.channels}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {channels.map((c) => {
              const on = picked.includes(c);
              return (
                <button key={c} onClick={() => toggle(c)}
                  className={`relative flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border transition-all ${on ? "border-action-blue bg-action-blue/4 ring-1 ring-action-blue/30" : "border-border-soft hover:border-action-blue/40"}`}>
                  {on && <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-action-blue text-white flex items-center justify-center"><Check className="w-2.5 h-2.5" strokeWidth={3} /></span>}
                  <BrandLogo name={c} className="w-8 h-8" />
                  <span className="text-[13px] font-medium text-deep-navy">{c}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer nav */}
        <div className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveExit}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] text-sm font-semibold text-deep-navy border border-border-soft bg-white hover:bg-soft-bg transition-colors"
            >
              Save &amp; Exit
            </button>
            {savedAt !== null && (
              <span role="status" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-teal animate-[fadeIn_0.15s_ease-out]">
                <CheckCircle2 className="w-4 h-4" /> Draft saved
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white rounded-[10px] bg-action-blue hover:opacity-95 transition-opacity"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom trust bar */}
      <div className="mt-12 bg-deep-navy">
        <div className="max-w-[1240px] mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <p className="text-[18px] font-bold text-white">Thousands of brands trust <span className="text-white">FulfillMesh</span> for smarter fulfillment.</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/70">
                {["Vetted Partners", "End-to-End Support", "No Hidden Fees"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal" strokeWidth={3} /> {t}</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-white/60 mb-3">Trusted by leading brands worldwide</p>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3 justify-end">
                {[0, 1, 2].map((i) => <TrustLogo key={i} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
