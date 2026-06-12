import type { Metadata } from "next";
import { ClipboardList, Search, FileCheck, Rocket, ShieldCheck, Clock, BadgeDollarSign } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import GetStartedForm from "./GetStartedForm";

export const metadata: Metadata = pageMetadata({
  title: "Get Started",
  description:
    "Tell us about your business and we'll match you with the right China-powered fulfillment partners and build a personalized plan. Free to get started, no obligations.",
  path: "/get-started",
  keywords: [
    "get started fulfillment",
    "fulfillment matching",
    "china fulfillment quote",
    "find fulfillment partner",
  ],
});

const next = [
  { icon: Search, title: "We review your needs", desc: "Our team analyzes your products, volume and goals to understand the best fit." },
  { icon: FileCheck, title: "Get matched partners", desc: "Within 24 hours you'll receive vetted suppliers and fulfillment partners." },
  { icon: Rocket, title: "Launch with confidence", desc: "Onboard, connect your store and start shipping smarter from China." },
];

const perks = [
  { icon: BadgeDollarSign, label: "Free to get started" },
  { icon: ShieldCheck, label: "No obligations" },
  { icon: Clock, label: "Reply within 24 hours" },
];

export default function GetStartedPage() {
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

      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-10 items-start">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24">
              <h2 className="text-[22px] font-bold text-deep-navy leading-tight">What happens next</h2>
              <p className="mt-2 text-[14px] text-text-body leading-relaxed">
                Three simple steps from your details to a fulfillment plan built around your brand.
              </p>
              <ul className="mt-6 space-y-5">
                {next.map((n, i) => (
                  <li key={n.title} className="flex gap-4">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-action-blue/10 flex items-center justify-center">
                        <n.icon className="w-5 h-5 text-action-blue" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-teal">Step {i + 1}</span>
                        <h3 className="text-[15px] font-semibold text-deep-navy">{n.title}</h3>
                      </div>
                      <p className="mt-1 text-[13px] text-text-body leading-relaxed">{n.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {perks.map((p) => (
                  <span key={p.label} className="inline-flex items-center gap-1.5 text-[12px] text-text-body">
                    <p.icon className="w-3.5 h-3.5 text-teal" /> {p.label}
                  </span>
                ))}
              </div>
            </aside>

            {/* Form */}
            <div>
              <GetStartedForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
