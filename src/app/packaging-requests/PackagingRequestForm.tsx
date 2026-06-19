"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Calendar, Check, ExternalLink, Loader2, CheckCircle } from "lucide-react";

const nextSteps = [
  { title: "We review your request", desc: "Our packaging experts will review your requirements." },
  { title: "We contact you", desc: "We'll reach out to confirm details and discuss options." },
  { title: "You receive a proposal", desc: "We'll send you a customised packaging solution and quote." },
];

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[13px] font-semibold text-deep-navy mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-[10px] border border-border-soft bg-white px-4 py-2.5 text-sm text-text-body outline-none placeholder:text-text-light focus:border-teal focus:ring-1 focus:ring-teal transition-colors";

const errCls = "mt-1.5 text-[12px] font-medium text-red-600";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey = "requestName" | "contact" | "email" | "phone" | "company" | "volume";
type FieldErrors = Partial<Record<FieldKey, string>>;

const volumeOptions = ["Under 500 units", "500 – 2,000 units", "2,000 – 10,000 units", "10,000+ units"];

export default function PackagingRequestForm() {
  const [requestName, setRequestName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [brand, setBrand] = useState("");
  const [volume, setVolume] = useState("");
  const [launchDate, setLaunchDate] = useState("");

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
    if (!requestName.trim()) next.requestName = "Request name is required.";
    if (!contact.trim()) next.contact = "Primary contact is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address.";
    if (!phone.trim()) next.phone = "Phone is required.";
    if (!company.trim()) next.company = "Company name is required.";
    if (!volume) next.volume = "Select an estimated monthly volume.";
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
      const details = {
        requestName: requestName.trim(),
        phone: phone.trim(),
        brand: brand.trim() || undefined,
        estimatedMonthlyVolume: volume,
        targetLaunchDate: launchDate.trim() || undefined,
      };
      const messageLines = [
        `Packaging request: ${requestName.trim()}`,
        `Phone: ${phone.trim()}`,
        brand.trim() ? `Brand / Store: ${brand.trim()}` : null,
        `Estimated monthly volume: ${volume}`,
        launchDate.trim() ? `Target launch date: ${launchDate.trim()}` : null,
      ].filter(Boolean);

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: contact.trim(),
          email: email.trim(),
          company: company.trim(),
          message: messageLines.join("\n"),
          payload: JSON.stringify(details),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Unable to submit your request. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      {/* Form */}
      {success ? (
        <div className="rounded-2xl border border-border-soft bg-white p-8 shadow-soft flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-7 h-7 text-teal" />
          </div>
          <h2 className="text-xl font-bold text-navy">Request received!</h2>
          <p className="mt-2 text-sm text-text-muted max-w-[440px]">
            Thanks{contact.trim() ? `, ${contact.trim().split(" ")[0]}` : ""}! Our packaging experts have your details and
            will get back to you within 1&ndash;2 business days with a customised solution.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-border-soft bg-white p-8 shadow-soft"
        >
          <h2 className="text-xl font-bold text-navy">Request Details</h2>
          <p className="mt-1.5 text-sm text-text-muted">Tell us about your packaging needs.</p>

          <div className="mt-8 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <Label required>Request Name</Label>
                <span className="text-xs text-text-light">{requestName.length}/100</span>
              </div>
              <input
                ref={(el) => { fieldRefs.current.requestName = el; }}
                className={inputClass}
                placeholder="e.g., Product Launch Packaging"
                maxLength={100}
                value={requestName}
                onChange={(e) => { setRequestName(e.target.value); clearError("requestName"); }}
                aria-invalid={!!errors.requestName}
              />
              {errors.requestName && <p className={errCls}>{errors.requestName}</p>}
            </div>

            <div>
              <Label required>Primary Contact</Label>
              <input
                ref={(el) => { fieldRefs.current.contact = el; }}
                className={inputClass}
                placeholder="Full name"
                value={contact}
                onChange={(e) => { setContact(e.target.value); clearError("contact"); }}
                aria-invalid={!!errors.contact}
              />
              {errors.contact && <p className={errCls}>{errors.contact}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label required>Email</Label>
                <input
                  ref={(el) => { fieldRefs.current.email = el; }}
                  className={inputClass}
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className={errCls}>{errors.email}</p>}
              </div>
              <div>
                <Label required>Phone</Label>
                <input
                  ref={(el) => { fieldRefs.current.phone = el; }}
                  className={inputClass}
                  placeholder="+1 (555) 123–4567"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className={errCls}>{errors.phone}</p>}
              </div>
            </div>

            <div>
              <Label required>Company Name</Label>
              <input
                ref={(el) => { fieldRefs.current.company = el; }}
                className={inputClass}
                placeholder="Your company name"
                value={company}
                onChange={(e) => { setCompany(e.target.value); clearError("company"); }}
                aria-invalid={!!errors.company}
              />
              {errors.company && <p className={errCls}>{errors.company}</p>}
            </div>

            <div>
              <Label>Brand / Store Name</Label>
              <input
                className={inputClass}
                placeholder="Your brand or store name"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div>
              <Label required>Estimated Monthly Volume</Label>
              <div className="relative">
                <select
                  ref={(el) => { fieldRefs.current.volume = el; }}
                  className={`${inputClass} appearance-none pr-10 ${volume ? "" : "text-text-light"}`}
                  value={volume}
                  onChange={(e) => { setVolume(e.target.value); clearError("volume"); }}
                  aria-invalid={!!errors.volume}
                >
                  <option value="" disabled>Select estimated volume</option>
                  {volumeOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              </div>
              {errors.volume && <p className={errCls}>{errors.volume}</p>}
            </div>

            <div>
              <Label>Target Launch Date</Label>
              <div className="relative">
                <input
                  className={`${inputClass} pl-10`}
                  type="date"
                  placeholder="Select date"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                />
                <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-600" role="alert">{error}</p>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-[10px] bg-deep-navy px-7 py-3.5 text-[15px] font-semibold text-white hover:opacity-95 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Submitting…" : "Next: Packaging Specifications"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="rounded-2xl border border-border-soft bg-white p-6 shadow-soft">
          <h3 className="text-[18px] font-bold text-deep-navy">What happens next?</h3>
          <div className="mt-5 space-y-0">
            {nextSteps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/15 text-teal shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  {i < nextSteps.length - 1 && <span className="w-px flex-1 bg-teal/20 my-1" />}
                </div>
                <div className="pb-5">
                  <p className="text-[14px] font-semibold text-deep-navy">{step.title}</p>
                  <p className="mt-0.5 text-[12px] text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-1 rounded-xl bg-teal/8 border border-teal/15 p-4">
            <p className="text-[14px] font-semibold text-deep-navy">Let&apos;s bring your brand to life!</p>
            <p className="mt-1 text-[12px] text-text-muted leading-relaxed">
              Once approved, we&apos;ll proceed with production and delivery.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border-soft bg-white p-6 shadow-soft">
          <h3 className="text-[18px] font-bold text-deep-navy">Need inspiration?</h3>
          <p className="mt-1.5 text-[14px] text-text-muted leading-relaxed">
            Explore our packaging options and materials.
          </p>
          <Link
            href="/solutions/packaging-labeling"
            className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-action-blue px-5 py-2.5 text-[14px] font-semibold text-action-blue transition-colors hover:bg-action-blue hover:text-white"
          >
            View Packaging Options
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
