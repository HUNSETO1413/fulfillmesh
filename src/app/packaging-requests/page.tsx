import { ChevronRight } from "lucide-react";
import PackagingRequestForm from "./PackagingRequestForm";

const steps = [
  { num: 1, label: "Request Details", active: true },
  { num: 2, label: "Packaging Specifications" },
  { num: 3, label: "Additional Information" },
  { num: 4, label: "Review & Submit" },
];

function HeroIllustration() {
  return (
    <svg width="300" height="180" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 300, height: 180, flexShrink: 0 }}>
      {/* open isometric box */}
      <path d="M42 88v44l48 25V113z" fill="#C9DBF3" />
      <path d="M138 88v44l-48 25V113z" fill="#B7CFF0" />
      {/* open interior (teal) */}
      <path d="M42 88l48-24 48 24-48 24z" fill="#10D6B0" />
      <path d="M58 80l32-16 32 16-32 16z" fill="#00B894" />
      {/* open lid flaps */}
      <path d="M42 88L8 72l46-22 36 14z" fill="#DCE8F8" />
      <path d="M8 72l34 16-6 8-34-16z" fill="#C9DBF3" />
      <path d="M138 88l34-16-46-22-36 14z" fill="#EAF2FC" />
      <path d="M172 72l-34 16 6 8 34-16z" fill="#D6E4F7" />
      {/* clipboard */}
      <rect x="180" y="48" width="86" height="104" rx="10" fill="#fff" stroke="#061A3D" strokeWidth="3" />
      <rect x="208" y="40" width="30" height="16" rx="6" fill="#0057D8" />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <path d={`M194 ${78 + r * 24}l5 5 8-9`} stroke="#0057D8" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x={218} y={76 + r * 24} width="36" height="6" rx="3" fill="#00B894" />
        </g>
      ))}
      {/* sparkle accents */}
      {[
        { x: 160, y: 38 }, { x: 280, y: 30 }, { x: 150, y: 150 }, { x: 285, y: 158 }, { x: 28, y: 120 },
      ].map((s, i) => (
        <g key={`sp${i}`} stroke="#9CC0EC" strokeWidth="2.5" strokeLinecap="round">
          <line x1={s.x - 5} y1={s.y} x2={s.x + 5} y2={s.y} />
          <line x1={s.x} y1={s.y - 5} x2={s.x} y2={s.y + 5} />
        </g>
      ))}
    </svg>
  );
}

export default function PackagingRequestsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-12">
          <div className="flex items-center justify-between gap-10">
            <div className="max-w-[560px]">
              <h1 className="text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight text-deep-navy">
                Packaging Requests
              </h1>
              <p className="mt-5 text-[16px] text-text-muted leading-relaxed">
                Request custom packaging solutions tailored to your brand. Our team will review your
                request and get back to you within 1&ndash;2 business days.
              </p>
            </div>
            <div className="shrink-0 hidden lg:flex">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Step indicator */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-x-0 gap-y-3">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      s.active
                        ? "bg-action-blue text-white"
                        : "bg-[#E2E8F0] text-text-muted"
                    }`}
                  >
                    {s.num}
                  </span>
                  <span className={`text-sm font-medium whitespace-nowrap ${s.active ? "text-action-blue" : "text-text-muted"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-text-light mx-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <PackagingRequestForm />
        </div>
      </section>
    </>
  );
}
