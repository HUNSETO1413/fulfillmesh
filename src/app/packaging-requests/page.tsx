import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, Calendar, ExternalLink, Check } from "lucide-react";

const steps = [
  { num: 1, label: "Request Details", active: true },
  { num: 2, label: "Packaging Specifications" },
  { num: 3, label: "Additional Information" },
  { num: 4, label: "Review & Submit" },
];

const nextSteps = [
  { title: "We review your request", desc: "Our packaging experts will review your requirements." },
  { title: "We contact you", desc: "We'll reach out to confirm details and discuss options." },
  { title: "You receive a proposal", desc: "We'll send you a customised packaging solution and quote." },
];

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[13px] font-semibold text-deep-navy mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-[10px] border border-border-soft bg-white px-4 py-2.5 text-sm text-text-body outline-none placeholder:text-text-light focus:border-teal focus:ring-1 focus:ring-teal transition-colors";

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
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            {/* Form */}
            <div className="rounded-2xl border border-border-soft bg-white p-8 shadow-soft">
              <h2 className="text-xl font-bold text-navy">Request Details</h2>
              <p className="mt-1.5 text-sm text-text-muted">Tell us about your packaging needs.</p>

              <div className="mt-8 space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <Label required>Request Name</Label>
                    <span className="text-xs text-text-light">0/100</span>
                  </div>
                  <input className={inputClass} placeholder="e.g., Product Launch Packaging" />
                </div>

                <div>
                  <Label required>Primary Contact</Label>
                  <input className={inputClass} placeholder="Full name" />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label required>Email</Label>
                    <input className={inputClass} type="email" placeholder="name@company.com" />
                  </div>
                  <div>
                    <Label required>Phone</Label>
                    <input className={inputClass} placeholder="+1 (555) 123&ndash;4567" />
                  </div>
                </div>

                <div>
                  <Label required>Company Name</Label>
                  <input className={inputClass} placeholder="Your company name" />
                </div>

                <div>
                  <Label>Brand / Store Name</Label>
                  <input className={inputClass} placeholder="Your brand or store name" />
                </div>

                <div>
                  <Label required>Estimated Monthly Volume</Label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none pr-10 text-text-light`} defaultValue="">
                      <option value="" disabled>Select estimated volume</option>
                      <option>Under 500 units</option>
                      <option>500 &ndash; 2,000 units</option>
                      <option>2,000 &ndash; 10,000 units</option>
                      <option>10,000+ units</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  </div>
                </div>

                <div>
                  <Label>Target Launch Date</Label>
                  <div className="relative">
                    <input className={`${inputClass} pl-10`} placeholder="Select date" />
                    <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="inline-flex items-center gap-2 rounded-[10px] bg-deep-navy px-7 py-3.5 text-[15px] font-semibold text-white hover:opacity-95 transition-opacity">
                    Next: Packaging Specifications <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-border-soft bg-white p-6 shadow-soft">
                <h3 className="text-[18px] font-bold text-deep-navy">What happens next?</h3>
                <div className="mt-5 space-y-0">
                  {nextSteps.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/15 text-teal shrink-0">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        {i < nextSteps.length - 1 && <span className="w-px flex-1 bg-teal/20 my-1" />}
                      </div>
                      <div className="pb-5">
                        <p className="text-[14px] font-semibold text-deep-navy">{step.title}</p>
                        <p className="mt-0.5 text-[12px] text-text-muted leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-1 rounded-xl bg-teal/8 border border-teal/15 p-4">
                  <p className="text-[14px] font-semibold text-deep-navy">Let&apos;s bring your brand to life!</p>
                  <p className="mt-1 text-[12px] text-text-muted leading-relaxed">
                    Once approved, we&apos;ll proceed with production and delivery.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border-soft bg-white p-6 shadow-soft">
                <h3 className="text-[18px] font-bold text-deep-navy">Need inspiration?</h3>
                <p className="mt-1.5 text-[14px] text-text-muted leading-relaxed">
                  Explore our packaging options and materials.
                </p>
                <Link
                  href="/solutions/packaging-labeling"
                  className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-action-blue px-5 py-2.5 text-[14px] font-semibold text-action-blue transition-colors hover:bg-action-blue hover:text-white"
                >
                  View Packaging Options
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
