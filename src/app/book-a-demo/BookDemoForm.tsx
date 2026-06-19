"use client";

import { useRef, useState } from "react";
import { CheckCircle, Loader2, Lock } from "lucide-react";

const inputBase =
  "w-full rounded-lg border border-border-soft bg-white px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue transition-colors";

const selectBase =
  inputBase +
  " appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239AA8B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat pr-10";

const labelBase = "block text-[13px] font-medium text-text-primary mb-1.5";
const req = <span className="text-red-500">*</span>;
const errCls = "mt-1.5 text-[12px] font-medium text-red-600";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value.includes("://") ? value : `https://${value}`);
    return !!u.hostname && u.hostname.includes(".");
  } catch {
    return false;
  }
}

// Local YYYY-MM-DD for today (used for the date input's min + past-date check).
function todayStr(): string {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

type FieldKey = "fullName" | "email" | "company" | "storeUrl" | "platform" | "volume" | "preferredDate" | "challenge";
type FieldErrors = Partial<Record<FieldKey, string>>;

export default function BookDemoForm() {
  const today = todayStr();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [platform, setPlatform] = useState("");
  const [volume, setVolume] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [challenge, setChallenge] = useState("");
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
    if (!fullName.trim()) next.fullName = "Full name is required.";
    if (!email.trim()) next.email = "Work email is required.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address.";
    if (!company.trim()) next.company = "Company name is required.";
    if (!storeUrl.trim()) next.storeUrl = "Store URL is required.";
    else if (!isValidUrl(storeUrl.trim())) next.storeUrl = "Enter a valid store URL.";
    if (!platform) next.platform = "Select your e-commerce platform.";
    if (!volume) next.volume = "Select your average monthly orders.";
    if (preferredDate && preferredDate < today) next.preferredDate = "Choose today or a future date.";
    if (!challenge.trim()) next.challenge = "Let us know your main fulfillment challenge.";
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
      const res = await fetch("/api/forms/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          company,
          storeUrl,
          platform,
          monthlyOrders: volume,
          preferredDate,
          preferredTime,
          message: challenge,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Unable to schedule your demo. Please try again.");
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
      <div className="rounded-2xl border border-border-soft p-10 shadow-soft flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-5">
          <CheckCircle className="w-8 h-8 text-teal" />
        </div>
        <h2 className="text-2xl font-bold text-navy">Your demo request is in!</h2>
        <p className="mt-3 text-[15px] text-text-muted max-w-[440px]">
          Thanks{fullName ? `, ${fullName.split(" ")[0]}` : ""}. A fulfillment expert will reach out within one business
          hour to confirm your demo time.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-border-soft p-7 shadow-soft">
      <h2 className="text-[20px] font-bold text-navy">Schedule your demo</h2>
      <p className="mt-1 text-[13px] text-text-muted mb-6">Fill out the form and we&apos;ll confirm your demo time.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>Full Name {req}</label>
          <input
            ref={(el) => { fieldRefs.current.fullName = el; }}
            type="text"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); clearError("fullName"); }}
            placeholder="Enter your full name"
            aria-invalid={!!errors.fullName}
            className={inputBase}
          />
          {errors.fullName && <p className={errCls}>{errors.fullName}</p>}
        </div>
        <div>
          <label className={labelBase}>Work Email {req}</label>
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
          <label className={labelBase}>Company Name {req}</label>
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
          <label className={labelBase}>Store URL {req}</label>
          <input
            ref={(el) => { fieldRefs.current.storeUrl = el; }}
            type="url"
            value={storeUrl}
            onChange={(e) => { setStoreUrl(e.target.value); clearError("storeUrl"); }}
            placeholder="https://yourstore.com"
            aria-invalid={!!errors.storeUrl}
            className={inputBase}
          />
          {errors.storeUrl && <p className={errCls}>{errors.storeUrl}</p>}
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>E-commerce Platform {req}</label>
          <select
            ref={(el) => { fieldRefs.current.platform = el; }}
            value={platform}
            onChange={(e) => { setPlatform(e.target.value); clearError("platform"); }}
            aria-invalid={!!errors.platform}
            className={`${selectBase} ${platform ? "" : "text-text-light"}`}
          >
            <option value="">Select your platform</option>
            <option>Shopify</option>
            <option>WooCommerce</option>
            <option>Amazon</option>
            <option>BigCommerce</option>
            <option>Magento</option>
            <option>Custom / Other</option>
          </select>
          {errors.platform && <p className={errCls}>{errors.platform}</p>}
        </div>
        <div>
          <label className={labelBase}>Average Monthly Orders {req}</label>
          <select
            ref={(el) => { fieldRefs.current.volume = el; }}
            value={volume}
            onChange={(e) => { setVolume(e.target.value); clearError("volume"); }}
            aria-invalid={!!errors.volume}
            className={`${selectBase} ${volume ? "" : "text-text-light"}`}
          >
            <option value="">Select order volume</option>
            <option>Under 100</option>
            <option>100 - 500</option>
            <option>500 - 2,000</option>
            <option>2,000 - 10,000</option>
            <option>10,000+</option>
          </select>
          {errors.volume && <p className={errCls}>{errors.volume}</p>}
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>Preferred Date</label>
          <input
            ref={(el) => { fieldRefs.current.preferredDate = el; }}
            type="date"
            min={today}
            value={preferredDate}
            onChange={(e) => { setPreferredDate(e.target.value); clearError("preferredDate"); }}
            aria-invalid={!!errors.preferredDate}
            className={`${inputBase} ${preferredDate ? "" : "text-text-light"}`}
          />
          {errors.preferredDate && <p className={errCls}>{errors.preferredDate}</p>}
        </div>
        <div>
          <label className={labelBase}>Preferred Time</label>
          <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className={`${selectBase} ${preferredTime ? "" : "text-text-light"}`}>
            <option value="">Select a time</option>
            <option>Morning (9 AM - 12 PM)</option>
            <option>Afternoon (12 PM - 5 PM)</option>
            <option>Evening (5 PM - 8 PM)</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className={labelBase}>What&apos;s your main fulfillment challenge? {req}</label>
        <textarea
          ref={(el) => { fieldRefs.current.challenge = el; }}
          rows={3}
          value={challenge}
          onChange={(e) => { setChallenge(e.target.value); clearError("challenge"); }}
          placeholder="Tell us your biggest challenge and goals..."
          aria-invalid={!!errors.challenge}
          className={inputBase}
        />
        {errors.challenge && <p className={errCls}>{errors.challenge}</p>}
      </div>

      {error && (
        <p className="mt-4 text-[13px] text-red-600" role="alert">
          {error}
        </p>
      )}

      <p className="mt-5 inline-flex items-center gap-1.5 text-[12px] text-text-muted">
        <Lock className="w-3.5 h-3.5 text-teal" />
        Your information is secure and will never be shared.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-8 py-3 text-[15px] font-semibold text-white rounded-lg bg-action-blue hover:bg-action-blue/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? "Sending…" : "Request Demo"}
      </button>
      <p className="mt-3 text-center text-[12px] text-text-muted">We typically respond within 1 business hour.</p>
    </form>
  );
}
