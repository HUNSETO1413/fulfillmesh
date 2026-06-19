"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What inspection types do you offer?",
    a: "We offer Pre-Production Inspection (PPI), In-Line Inspection (DUPRO), Final Random Inspection (FRI) using AQL sampling, and sample verification — covering every stage from raw materials to finished goods.",
  },
  {
    q: "How quickly are reports delivered?",
    a: "Detailed reports with photos, videos, and scores are typically delivered within 24 hours of the inspection. Critical issues are escalated to you in real time so you can act before shipment.",
  },
  {
    q: "Can I customize inspection checklists?",
    a: "Yes. We build inspection checklists around your specifications, AQL levels, and defect classifications, so every check reflects exactly what matters for your product and brand standards.",
  },
  {
    q: "What happens if a product fails inspection?",
    a: "If an inspection fails, we flag the defects, work with the factory on corrective action, and re-inspect once issues are resolved — so you only approve shipment when quality meets your standards.",
  },
];

export default function QualityControlFaq() {
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
