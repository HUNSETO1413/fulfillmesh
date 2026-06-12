"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const steps = [
  { id: 1, title: "Your Business" },
  { id: 2, title: "Your Products" },
  { id: 3, title: "Your Needs" },
];

const inputBase =
  "w-full rounded-xl border border-border-soft bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors";
const selectBase =
  "w-full rounded-xl border border-border-soft bg-white px-4 py-3 text-sm text-text-body focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors";

const SOLUTIONS = ["Supplier Matching", "Quality Control", "Packaging", "Shipping", "Warehousing", "Returns", "Analytics"];

type FormData = {
  company: string;
  email: string;
  website: string;
  platform: string;
  category: string;
  volume: string;
  destinations: string;
  solutions: string[];
  timeline: string;
};

const initial: FormData = {
  company: "", email: "", website: "", platform: "",
  category: "", volume: "", destinations: "", solutions: [], timeline: "",
};

export default function GetStartedForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function toggleSolution(s: string) {
    setData((d) => ({
      ...d,
      solutions: d.solutions.includes(s) ? d.solutions.filter((x) => x !== s) : [...d.solutions, s],
    }));
  }

  async function submit() {
    if (!data.company.trim() || !data.email.trim()) {
      setError("Please provide your company name and email.");
      setCurrentStep(0);
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/forms/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, name: data.company }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 border border-border-soft shadow-soft text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-teal" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-deep-navy">You&apos;re all set!</h2>
        <p className="mt-2 text-sm text-text-body leading-relaxed">
          Thanks, {data.company}. We&apos;ve received your details and our team will reach out within
          24 hours with a personalized fulfillment plan.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl gradient-cta hover:shadow-button transition-all"
        >
          Back to home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-10">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-3 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
              i <= currentStep ? "gradient-cta text-white" : "bg-soft-bg text-text-muted"
            }`}>
              {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step.id}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${i <= currentStep ? "text-navy" : "text-text-muted"}`}>
              {step.title}
            </span>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border-soft" />}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl p-8 border border-border-soft shadow-soft">
        {currentStep === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-navy">Tell us about your business</h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Company name</label>
              <input type="text" className={inputBase} placeholder="Your company name" value={data.company} onChange={(e) => set("company", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Work email</label>
              <input type="email" className={inputBase} placeholder="you@company.com" value={data.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Website</label>
              <input type="url" className={inputBase} placeholder="https://yourstore.com" value={data.website} onChange={(e) => set("website", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Platform</label>
              <select className={selectBase} value={data.platform} onChange={(e) => set("platform", e.target.value)}>
                <option value="">Select your platform</option>
                <option>Shopify</option>
                <option>WooCommerce</option>
                <option>Amazon</option>
                <option>eBay</option>
                <option>BigCommerce</option>
                <option>Custom / Other</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-navy">Tell us about your products</h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Product category</label>
              <select className={selectBase} value={data.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select a category</option>
                <option>Fashion &amp; Apparel</option>
                <option>Electronics</option>
                <option>Home &amp; Garden</option>
                <option>Beauty &amp; Personal Care</option>
                <option>Sports &amp; Outdoors</option>
                <option>Toys &amp; Games</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Monthly order volume</label>
              <select className={selectBase} value={data.volume} onChange={(e) => set("volume", e.target.value)}>
                <option value="">Select your volume</option>
                <option>Less than 100</option>
                <option>100 - 500</option>
                <option>500 - 2,000</option>
                <option>2,000 - 10,000</option>
                <option>10,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Primary destinations</label>
              <input type="text" className={inputBase} placeholder="e.g., US, UK, Germany, Australia" value={data.destinations} onChange={(e) => set("destinations", e.target.value)} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-navy">What do you need help with?</h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">Select solutions you&apos;re interested in</label>
              <div className="grid grid-cols-2 gap-2">
                {SOLUTIONS.map((s) => (
                  <label key={s} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${data.solutions.includes(s) ? "border-teal bg-teal/5" : "border-border-soft hover:border-teal"}`}>
                    <input type="checkbox" checked={data.solutions.includes(s)} onChange={() => toggleSolution(s)} className="h-4 w-4 rounded border-border-soft text-teal focus:ring-teal focus:ring-offset-0 accent-teal" />
                    <span className="text-sm text-text-body">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">When do you need to start?</label>
              <select className={selectBase} value={data.timeline} onChange={(e) => set("timeline", e.target.value)}>
                <option value="">Select a timeline</option>
                <option>Immediately</option>
                <option>Within 2 weeks</option>
                <option>Within a month</option>
                <option>Just exploring</option>
              </select>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl border border-border-soft text-text-body hover:shadow-soft transition-all ${currentStep === 0 ? "invisible" : ""}`}
          >
            Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="inline-flex items-center gap-2 px-7 py-3 text-base font-semibold text-white rounded-xl gradient-cta hover:shadow-button transition-all"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 px-7 py-3 text-base font-semibold text-white rounded-xl gradient-cta hover:shadow-button transition-all disabled:opacity-60"
            >
              {status === "loading" ? "Submitting…" : "Submit"} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-text-muted">
        Prefer to talk?{" "}
        <Link href="/book-a-demo" className="font-medium text-teal hover:text-teal/80 transition-colors">Book a demo instead</Link>
      </p>
    </div>
  );
}
