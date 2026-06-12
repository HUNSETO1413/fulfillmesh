"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";

const steps = [
  { id: 1, title: "Your Business", fields: ["company", "website", "platform"] },
  { id: 2, title: "Your Products", fields: ["category", "volume", "destinations"] },
  { id: 3, title: "Your Needs", fields: ["solutions", "timeline", "budget"] },
];

const inputBase = "w-full rounded-xl border border-border-soft bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors";

const selectBase = "w-full rounded-xl border border-border-soft bg-white px-4 py-3 text-sm text-text-body focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors";

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <main>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 text-teal text-xs font-semibold uppercase tracking-wider mb-5">
            <ClipboardList className="w-3.5 h-3.5" /> Get Started
          </span>
          <h1 className="text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight text-text-primary">
            Tell us about your business
          </h1>
          <p className="mt-5 text-[17px] text-text-muted leading-relaxed max-w-[560px] mx-auto">
            Share your fulfillment needs and we&apos;ll match you with the right partners to create a personalized plan.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[800px] mx-auto px-6 py-20 lg:py-24">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-12">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
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

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 border border-border-soft shadow-soft">
            {currentStep === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-navy">Tell us about your business</h2>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Company name</label>
                  <input type="text" className={inputBase} placeholder="Your company name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Website</label>
                  <input type="url" className={inputBase} placeholder="https://yourstore.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Platform</label>
                  <select className={selectBase}>
                    <option>Select your platform</option>
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
                  <select className={selectBase}>
                    <option>Select a category</option>
                    <option>Fashion & Apparel</option>
                    <option>Electronics</option>
                    <option>Home & Garden</option>
                    <option>Beauty & Personal Care</option>
                    <option>Sports & Outdoors</option>
                    <option>Toys & Games</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Monthly order volume</label>
                  <select className={selectBase}>
                    <option>Select your volume</option>
                    <option>Less than 100</option>
                    <option>100 - 500</option>
                    <option>500 - 2,000</option>
                    <option>2,000 - 10,000</option>
                    <option>10,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Primary destinations</label>
                  <input type="text" className={inputBase} placeholder="e.g., US, UK, Germany, Australia" />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-navy">What do you need help with?</h2>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Select solutions you&apos;re interested in</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Supplier Matching", "Quality Control", "Packaging", "Shipping", "Warehousing", "Returns", "Analytics"].map((s) => (
                      <label key={s} className="flex items-center gap-2.5 p-3 rounded-xl border border-border-soft hover:border-teal cursor-pointer transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-border-soft text-teal focus:ring-teal focus:ring-offset-0 accent-teal" />
                        <span className="text-sm text-text-body">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">When do you need to start?</label>
                  <select className={selectBase}>
                    <option>Select a timeline</option>
                    <option>Immediately</option>
                    <option>Within 2 weeks</option>
                    <option>Within a month</option>
                    <option>Just exploring</option>
                  </select>
                </div>
              </div>
            )}

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
                  onClick={() => alert("Form submitted! We'll be in touch within 24 hours.")}
                  className="inline-flex items-center gap-2 px-7 py-3 text-base font-semibold text-white rounded-xl gradient-cta hover:shadow-button transition-all"
                >
                  Submit <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-text-muted">
            Prefer to talk?{" "}
            <Link href="/book-a-demo" className="font-medium text-teal hover:text-teal/80 transition-colors">Book a demo instead</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
