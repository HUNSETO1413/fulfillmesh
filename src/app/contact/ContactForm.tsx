"use client";

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle, Loader2, Lock } from "lucide-react";

const inputBase =
  "w-full rounded-lg border border-border-soft bg-white px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue transition-colors";

const selectBase =
  inputBase +
  " appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239AA8B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value.includes("://") ? value : `https://${value}`);
    return !!u.hostname && u.hostname.includes(".");
  } catch {
    return false;
  }
}

type FieldKey = "name" | "email" | "company" | "website" | "volume" | "markets" | "services";
type FieldErrors = Partial<Record<FieldKey, string>>;

const errCls = "mt-1.5 text-[12px] font-medium text-red-600";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [volume, setVolume] = useState("");
  const [markets, setMarkets] = useState("");
  const [services, setServices] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);

  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});

  const clearError = (key: FieldKey) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Full name is required.";
    if (!email.trim()) next.email = "Work email is required.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address.";
    if (!company.trim()) next.company = "Company is required.";
    if (website.trim() && !isValidUrl(website.trim())) next.website = "Enter a valid website URL.";
    if (!volume) next.volume = "Select your monthly order volume.";
    if (!markets) next.markets = "Select your target markets.";
    if (!services) next.services = "Select the services you need.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const firstKey = (Object.keys(fieldErrors) as FieldKey[])[0];
      const el = fieldRefs.current[firstKey];
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/forms/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          website,
          monthlyOrderVolume: volume,
          targetMarkets: markets,
          servicesNeeded: services,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Unable to send your message. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border-soft p-10 shadow-soft flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-7 h-7 text-teal" />
        </div>
        <h2 className="text-[20px] font-bold text-text-primary">Thanks for reaching out!</h2>
        <p className="mt-2 text-[14px] text-text-muted max-w-[420px]">
          We&apos;ve received your message and a member of the FulfillMesh team will reply within 2 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-border-soft p-6 shadow-soft">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Full Name <span className="text-red-500">*</span></label>
          <input
            ref={(el) => { fieldRefs.current.name = el; }}
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError("name"); }}
            placeholder="Enter your full name"
            aria-invalid={!!errors.name}
            className={inputBase}
          />
          {errors.name && <p className={errCls}>{errors.name}</p>}
        </div>
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Work Email <span className="text-red-500">*</span></label>
          <input
            ref={(el) => { fieldRefs.current.email = el; }}
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
            placeholder="name@company.com"
            aria-invalid={!!errors.email}
            className={inputBase}
          />
          {errors.email && <p className={errCls}>{errors.email}</p>}
        </div>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Company <span className="text-red-500">*</span></label>
          <input
            ref={(el) => { fieldRefs.current.company = el; }}
            type="text"
            value={company}
            onChange={(e) => { setCompany(e.target.value); clearError("company"); }}
            placeholder="Your company name"
            aria-invalid={!!errors.company}
            className={inputBase}
          />
          {errors.company && <p className={errCls}>{errors.company}</p>}
        </div>
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Website</label>
          <input
            ref={(el) => { fieldRefs.current.website = el; }}
            type="url"
            value={website}
            onChange={(e) => { setWebsite(e.target.value); clearError("website"); }}
            placeholder="https://yourwebsite.com"
            aria-invalid={!!errors.website}
            className={inputBase}
          />
          {errors.website && <p className={errCls}>{errors.website}</p>}
        </div>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Monthly Order Volume <span className="text-red-500">*</span></label>
          <select
            ref={(el) => { fieldRefs.current.volume = el; }}
            value={volume}
            onChange={(e) => { setVolume(e.target.value); clearError("volume"); }}
            aria-invalid={!!errors.volume}
            className={selectBase}
          >
            <option value="">Select volume</option>
            <option>Under 100</option>
            <option>100 - 500</option>
            <option>500 - 2,000</option>
            <option>2,000 - 10,000</option>
            <option>10,000+</option>
          </select>
          {errors.volume && <p className={errCls}>{errors.volume}</p>}
        </div>
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Target Markets <span className="text-red-500">*</span></label>
          <select
            ref={(el) => { fieldRefs.current.markets = el; }}
            value={markets}
            onChange={(e) => { setMarkets(e.target.value); clearError("markets"); }}
            aria-invalid={!!errors.markets}
            className={selectBase}
          >
            <option value="">Select markets</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Asia Pacific</option>
            <option>Global</option>
          </select>
          {errors.markets && <p className={errCls}>{errors.markets}</p>}
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-[13px] font-medium text-text-primary mb-1.5">Services Needed <span className="text-red-500">*</span></label>
        <select
          ref={(el) => { fieldRefs.current.services = el; }}
          value={services}
          onChange={(e) => { setServices(e.target.value); clearError("services"); }}
          aria-invalid={!!errors.services}
          className={selectBase}
        >
          <option value="">Select services</option>
          <option>Sourcing &amp; Supplier Vetting</option>
          <option>Quality Control</option>
          <option>Warehousing &amp; Fulfillment</option>
          <option>Shipping &amp; Logistics</option>
          <option>Full-Service Solution</option>
        </select>
        {errors.services && <p className={errCls}>{errors.services}</p>}
      </div>
      <div className="mt-4">
        <label className="block text-[13px] font-medium text-text-primary mb-1.5">Tell us more about your needs</label>
        <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share details about your products, goals, timeline, or any challenges you're facing..." className={inputBase} />
      </div>
      {error && (
        <p className="mt-4 text-[13px] text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="inline-flex items-center gap-1.5 text-[12px] text-text-muted">
          <Lock className="w-3.5 h-3.5 text-teal" />
          Your information is secure and will never be shared.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 text-[14px] font-semibold text-white rounded-lg bg-navy hover:bg-deep-navy transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Sending…" : "Send Message"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
}
