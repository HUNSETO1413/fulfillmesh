"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

const inputBase =
  "w-full rounded-lg border border-border-soft bg-white px-4 py-3 text-[14px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue transition-colors";

export default function BookDemoForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      const res = await fetch("/api/forms/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          phone,
          companySize,
          industry,
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
          Thanks{firstName ? `, ${firstName}` : ""}. A fulfillment expert will reach out within one business
          day to schedule your personalized demo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border-soft p-8 shadow-soft">
      <h2 className="text-xl font-bold text-navy mb-6">Schedule your demo</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">First Name</label>
          <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" className={inputBase} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Last Name</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" className={inputBase} />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className={inputBase} />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-text-primary mb-1.5">Company Name</label>
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Enter your company name" className={inputBase} />
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" className={inputBase} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Company Size</label>
          <select value={companySize} onChange={(e) => setCompanySize(e.target.value)} className={`${inputBase} ${companySize ? "" : "text-text-muted"}`}>
            <option value="">Select company size</option>
            <option>1-10 employees</option>
            <option>11-50 employees</option>
            <option>51-200 employees</option>
            <option>200+ employees</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-text-primary mb-1.5">Industry</label>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={`${inputBase} ${industry ? "" : "text-text-muted"}`}>
          <option value="">Select industry</option>
          <option>E-commerce</option>
          <option>Retail</option>
          <option>Manufacturing</option>
          <option>Technology</option>
          <option>Healthcare</option>
          <option>Other</option>
        </select>
      </div>
      {error && (
        <p className="mt-4 text-[13px] text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? "Scheduling…" : "Schedule demo"}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
}
