"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How quickly can you get started?", a: "Most brands are fully onboarded within 5 to 7 business days. After a quick call to understand your products and goals, we match you with vetted partners and get your first orders moving fast." },
  { q: "Do you work with businesses of all sizes?", a: "Yes, we work with businesses of all sizes — from startups just launching their first product to established brands shipping thousands of orders per month. Our solutions are designed to scale with your growth." },
  { q: "Where are your warehouses located?", a: "Our main fulfillment centers are located in Shenzhen and Guangzhou, China, with additional partner warehouses in the US, Europe, and Southeast Asia for global distribution." },
  { q: "How do you ensure product quality?", a: "We conduct rigorous on-site inspections at every stage — from pre-production checks to final random inspections before shipping, ensuring your products meet your specifications." },
  { q: "What if I need help after onboarding?", a: "Our dedicated support team is available to assist you at every step. You can reach us via email, WhatsApp, or schedule a call with your account manager anytime." },
];

export default function ContactFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white rounded-xl border border-border-soft overflow-hidden transition-all">
          <button
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-[14px] font-medium text-text-primary">{faq.q}</span>
            <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <p className="px-5 pb-4 text-[13px] text-text-body leading-relaxed">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
