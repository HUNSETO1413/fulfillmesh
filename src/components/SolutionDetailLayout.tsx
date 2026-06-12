import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MapNode {
  label: string;
  icon: LucideIcon;
  top: string;
  left: string;
}
interface Step {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}
interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}
interface TimelineStep {
  title: string;
  desc: string;
  icon: LucideIcon;
}
interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
}
interface Faq {
  q: string;
}
interface DashRow {
  cols: string[];
}

export interface SolutionDetailProps {
  eyebrow?: string;
  title: string;
  headline: React.ReactNode;
  heroDesc: string;
  mapNodes: MapNode[];
  worksTitle: string;
  worksSubtitle: string;
  steps: Step[];
  featuresTitle: string;
  featuresSubtitle: string;
  features: Feature[];
  timelineTitle: string;
  timelineSubtitle: string;
  timeline: TimelineStep[];
  sourcingEyebrow: string;
  sourcingTitle: React.ReactNode;
  sourcingDesc: string;
  sourcingBullets: string[];
  dashTitle: string;
  dashColumns: string[];
  dashRows: DashRow[];
  dashCta: string;
  connectedEyebrow: string;
  connectedTitle: React.ReactNode;
  connectedDesc: string;
  stats: Stat[];
  faqs: Faq[];
  ctaTitle: string;
  ctaDesc: string;
}

export default function SolutionDetailLayout(p: SolutionDetailProps) {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[12px] font-semibold tracking-[0.1em] text-white bg-navy rounded-lg px-3.5 py-1.5">
                {p.eyebrow ?? "OUR SOLUTIONS"}
              </span>
              <h1 className="mt-5 text-[36px] lg:text-[48px] font-bold text-deep-navy leading-[1.15] tracking-tight">
                {p.title}
                <br />
                {p.headline}
              </h1>
              <p className="mt-5 text-[18px] text-text-body leading-relaxed max-w-[480px]">
                {p.heroDesc}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all">
                  Find My Match <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-navy rounded-lg border-2 border-navy bg-white hover:bg-navy hover:text-white transition-all">
                  Book a Demo
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {["Vetted Partners", "End-to-End Support", "No Hidden Fees"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Network map */}
            <div className="relative hidden lg:block h-[400px]">
              <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 500 400" fill="none">
                {Array.from({ length: 180 }).map((_, i) => {
                  const x = (i * 37) % 500;
                  const y = ((i * 53) % 360) + 20;
                  return <circle key={i} cx={x} cy={y} r="1.3" fill="#B8C7DA" />;
                })}
              </svg>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 400" fill="none">
                {p.mapNodes.map((n, i) => {
                  const cx = (parseFloat(n.left) / 100) * 500;
                  const cy = (parseFloat(n.top) / 100) * 400;
                  return <line key={i} x1="250" y1="200" x2={cx} y2={cy} stroke="#00B894" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5" />;
                })}
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-2xl gradient-logo flex items-center justify-center text-white font-bold text-xl shadow-card">
                FM
              </div>
              {p.mapNodes.map((n) => (
                <div key={n.label} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5" style={{ top: n.top, left: n.left }}>
                  <div className="w-11 h-11 rounded-xl bg-white border border-border-soft shadow-soft flex items-center justify-center">
                    <n.icon className="w-5 h-5 text-navy" />
                  </div>
                  <span className="text-[11px] font-medium text-text-muted whitespace-nowrap">{n.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <h2 className="text-[32px] font-bold text-deep-navy leading-tight">{p.worksTitle}</h2>
            <p className="mt-3 text-[18px] text-text-muted">{p.worksSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {p.steps.map((s, i) => (
              <div key={s.num} className="relative">
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6 h-full">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-deep-navy text-white text-[18px] font-bold flex items-center justify-center mb-3">
                      {s.num}
                    </div>
                    <s.icon className="w-6 h-6 text-navy" />
                  </div>
                  <h3 className="text-[18px] font-semibold text-deep-navy text-center">{s.title}</h3>
                  <p className="mt-2 text-[14px] text-text-muted leading-relaxed text-center">{s.desc}</p>
                </div>
                {i < p.steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 w-4 h-4 text-border-blue" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <h2 className="text-[32px] font-bold text-deep-navy leading-tight">{p.featuresTitle}</h2>
            <p className="mt-3 text-[18px] text-text-muted">{p.featuresSubtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center shrink-0">
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-deep-navy">{f.title}</h3>
                    <p className="mt-2 text-[14px] text-text-body leading-relaxed">{f.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-navy underline">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <h2 className="text-[32px] font-bold text-deep-navy leading-tight">{p.timelineTitle}</h2>
            <p className="mt-3 text-[18px] text-text-muted">{p.timelineSubtitle}</p>
          </div>
          <div className="relative grid gap-8" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-[2px] bg-[#CBD5E1]" />
            {p.timeline.map((t, i) => (
              <div key={i} className="relative">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-navy shadow-[0_2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center mb-5 relative z-10">
                  <t.icon className="w-5 h-5 text-navy" />
                </div>
                <h3 className="text-[16px] font-semibold text-deep-navy">
                  <span className="text-[14px] font-semibold text-text-muted">Step {i + 1}:</span>{" "}
                  {t.title}
                </h3>
                <p className="mt-2 text-[14px] text-text-muted leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing partner + dashboard */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[12px] font-semibold tracking-[0.1em] text-white bg-navy rounded-lg px-3.5 py-1.5">
                {p.sourcingEyebrow}
              </span>
              <h2 className="mt-5 text-[32px] font-bold text-deep-navy leading-tight">{p.sourcingTitle}</h2>
              <p className="mt-4 text-[18px] text-text-body leading-relaxed max-w-[440px]">{p.sourcingDesc}</p>
              <div className="mt-6 space-y-3">
                {p.sourcingBullets.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
                    <span className="text-[14px] text-text-body">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB]">
                <span className="flex items-center gap-2 text-[13px] font-bold text-deep-navy">
                  <span className="w-6 h-6 rounded-md gradient-logo flex items-center justify-center text-white text-[10px] font-bold">FM</span>
                  FulfillMesh
                </span>
                <span className="text-[11px] text-text-muted">May 12 – May 18, 2025</span>
              </div>
              <div className="flex">
                <div className="w-[100px] shrink-0 border-r border-[#E5E7EB] py-3 px-3 space-y-2 hidden sm:block">
                  {["Overview", "Suppliers", "Quotes", "RFQs", "Orders", "Shipments", "Quality Control", "Warehouses", "Reports", "Settings"].map((m, i) => (
                    <p key={m} className={`text-[11px] ${i === 1 ? "text-teal font-semibold" : "text-text-muted"}`}>{m}</p>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-[13px] font-bold text-deep-navy mb-3">{p.dashTitle}</h4>
                  <div className="overflow-hidden rounded-lg border border-[#E5E7EB]">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#F9FAFB]">
                          {p.dashColumns.map((c) => (
                            <th key={c} className="px-2 py-1.5 text-[9px] font-semibold text-text-muted">{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {p.dashRows.map((r, i) => (
                          <tr key={i} className="border-t border-[#E5E7EB]">
                            {r.cols.map((c, j) => (
                              <td key={j} className={`px-2 py-1.5 text-[9px] ${j === 0 ? "font-semibold text-deep-navy" : "text-text-body"}`}>{c}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button className="mt-3 text-[11px] font-semibold text-white bg-navy border border-transparent rounded-md px-3 py-1.5 hover:bg-deep-navy transition-colors">{p.dashCta}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected platform stats */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pb-20">
          <div className="bg-deep-navy rounded-2xl p-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block text-[12px] font-semibold tracking-[0.1em] text-navy bg-white rounded-lg px-3.5 py-1.5">
                  {p.connectedEyebrow}
                </span>
                <h2 className="mt-5 text-[24px] font-bold text-white leading-tight">{p.connectedTitle}</h2>
                <p className="mt-4 text-[16px] text-text-on-dark-muted leading-relaxed max-w-[400px]">{p.connectedDesc}</p>
                <Link href="/solutions" className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-teal">
                  Learn more about our platform <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
                {p.stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <s.icon className="w-8 h-8 text-teal mx-auto mb-3" />
                    <p className="text-[48px] font-bold text-white leading-none">{s.value}</p>
                    <p className="mt-2 text-[16px] text-text-on-dark-soft">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-soft-bg">
        <div className="max-w-[800px] mx-auto px-6 py-20">
          <h2 className="text-[32px] font-bold text-deep-navy text-center mb-12">Questions? We&apos;ve got answers.</h2>
          <div className="space-y-4">
            {p.faqs.map((f) => (
              <div key={f.q} className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-4 flex items-center justify-between">
                <span className="text-[16px] font-semibold text-deep-navy pr-4">{f.q}</span>
                <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-soft-bg pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="bg-deep-navy rounded-2xl text-white text-center px-6 py-14 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-deep-navy via-navy to-[#1E3A8A] opacity-80" />
            <div className="relative z-10">
              <h2 className="text-[36px] font-bold leading-tight">{p.ctaTitle}</h2>
              <p className="mt-3 text-[18px] text-text-on-dark-muted">{p.ctaDesc}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-lg bg-white hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] transition-all">
                  Find My Match <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg border-2 border-white hover:bg-white/10 transition-all">
                  Book a Demo
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {["Free to get started", "No obligations", "Personalized matches"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-on-dark-soft">
                    <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
