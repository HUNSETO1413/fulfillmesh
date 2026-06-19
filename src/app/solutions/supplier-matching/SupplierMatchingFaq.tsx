"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do you vet your suppliers?",
    a: "Every factory in our network is screened for verified business licenses, certifications, quality systems, production capacity, and past performance. We also run reference checks and on-site assessments before a supplier is added to your shortlist.",
  },
  {
    q: "How much does Supplier Matching cost?",
    a: "Getting matched is free to start — you only pay once you choose to move forward with sourcing. Pricing depends on your product, volume, and the level of support you need, and we share transparent quotes up front with no hidden fees.",
  },
  {
    q: "What if I don't find the right supplier?",
    a: "If none of the initial matches fit, we keep sourcing at no extra cost until we find factories that meet your specs, budget, and timeline. Our goal is the right partner, not just a fast one.",
  },
  {
    q: "Can you help with sampling and quality checks?",
    a: "Yes. We coordinate samples, facilitate quality inspections, and run due diligence so you can validate capabilities before committing — then support you through onboarding, contracts, and kickoff.",
  },
];

export default function SupplierMatchingFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid sm:grid-cols-2 gap-4 items-start">
      {faqs.map((faq, i) => (
        <div key={faq.q} className="bg-white rounded-xl border border-border-soft overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-[15px] font-semibold text-deep-navy pr-4">{faq.q}</span>
            <ChevronDown className={`w-5 h-5 text-text-muted shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <p className="px-5 pb-4 text-[14px] text-text-body leading-relaxed">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
