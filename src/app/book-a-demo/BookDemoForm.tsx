"use client";

import { useState } from "react";
import { CheckCircle, Loader2, Lock } from "lucide-react";

const inputBase =
  "w-full rounded-lg border border-border-soft bg-white px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue transition-colors";

const selectBase =
  inputBase +
  " appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239AA8B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat pr-10";

const labelBase = "block text-[13px] font-medium text-text-primary mb-1.5";
const req = <span className="text-red-500">*</span>;

export default function BookDemoForm() {
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
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border-soft p-7 shadow-soft">
      <h2 className="text-[20px] font-bold text-navy">Schedule your demo</h2>
      <p className="mt-1 text-[13px] text-text-muted mb-6">Fill out the form and we&apos;ll confirm your demo time.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>Full Name {req}</label>
          <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className={inputBase} />
        </div>
        <div>
          <label className={labelBase}>Work Email {req}</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={inputBase} />
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>Company Name {req}</label>
          <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company name" className={inputBase} />
        </div>
        <div>
          <label className={labelBase}>Store URL {req}</label>
          <input type="url" required value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} placeholder="https://yourstore.com" className={inputBase} />
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>E-commerce Platform {req}</label>
          <select required value={platform} onChange={(e) => setPlatform(e.target.value)} className={`${selectBase} ${platform ? "" : "text-text-light"}`}>
            <option value="">Select your platform</option>
            <option>Shopify</option>
            <option>WooCommerce</option>
            <option>Amazon</option>
            <option>BigCommerce</option>
            <option>Magento</option>
            <option>Custom / Other</option>
          </select>
        </div>
        <div>
          <label className={labelBase}>Average Monthly Orders {req}</label>
          <select required value={volume} onChange={(e) => setVolume(e.target.value)} className={`${selectBase} ${volume ? "" : "text-text-light"}`}>
            <option value="">Select order volume</option>
            <option>Under 100</option>
            <option>100 - 500</option>
            <option>500 - 2,000</option>
            <option>2,000 - 10,000</option>
            <option>10,000+</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>Preferred Date</label>
          <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className={`${inputBase} ${preferredDate ? "" : "text-text-light"}`} />
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
        <textarea rows={3} required value={challenge} onChange={(e) => setChallenge(e.target.value)} placeholder="Tell us your biggest challenge and goals..." className={inputBase} />
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
