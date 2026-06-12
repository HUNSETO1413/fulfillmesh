"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2, Lock } from "lucide-react";

const inputBase =
  "w-full rounded-lg border border-border-soft bg-white px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue transition-colors";

const selectBase =
  inputBase +
  " appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239AA8B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat";

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
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
    <form onSubmit={handleSubmit} className="rounded-xl border border-border-soft p-6 shadow-soft">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Full Name <span className="text-red-500">*</span></label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className={inputBase} />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Work Email <span className="text-red-500">*</span></label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={inputBase} />
        </div>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Company <span className="text-red-500">*</span></label>
          <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company name" className={inputBase} />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Website</label>
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" className={inputBase} />
        </div>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Monthly Order Volume <span className="text-red-500">*</span></label>
          <select required value={volume} onChange={(e) => setVolume(e.target.value)} className={selectBase}>
            <option value="">Select volume</option>
            <option>Under 100</option>
            <option>100 - 500</option>
            <option>500 - 2,000</option>
            <option>2,000 - 10,000</option>
            <option>10,000+</option>
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Target Markets <span className="text-red-500">*</span></label>
          <select required value={markets} onChange={(e) => setMarkets(e.target.value)} className={selectBase}>
            <option value="">Select markets</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Asia Pacific</option>
            <option>Global</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-[13px] font-medium text-text-primary mb-1.5">Services Needed <span className="text-red-500">*</span></label>
        <select required value={services} onChange={(e) => setServices(e.target.value)} className={selectBase}>
          <option value="">Select services</option>
          <option>Sourcing &amp; Supplier Vetting</option>
          <option>Quality Control</option>
          <option>Warehousing &amp; Fulfillment</option>
          <option>Shipping &amp; Logistics</option>
          <option>Full-Service Solution</option>
        </select>
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
