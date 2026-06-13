import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Capability {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface NarrativePoint {
  problem: string;
  solution: string;
}

interface PageLink {
  href: string;
  label: string;
}

export interface PlatformPageProps {
  eyebrow: string;
  title: string;
  highlight: string;
  heroDesc: string;
  heroPills: string[];
  /** Right-hand hero mockup */
  mockup: React.ReactNode;
  narrativeTitle: string;
  narrativeSubtitle: string;
  narrative: NarrativePoint[];
  capabilitiesTitle: string;
  capabilitiesSubtitle: string;
  capabilities: Capability[];
  outcomesTitle: string;
  outcomes: string[];
  /** Secondary UI mockup shown beside the outcomes list */
  outcomeMockup: React.ReactNode;
  ctaTitle: string;
  ctaDesc: string;
  prevLink?: PageLink;
  nextLink?: PageLink;
}

export default function PlatformLayout(p: PlatformPageProps) {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="flex items-center gap-2 text-[13px] text-text-muted mb-6">
            <Link href="/platform" className="hover:text-navy transition-colors">Platform</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">{p.title}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[12px] font-semibold tracking-[0.1em] text-white bg-navy rounded-lg px-3.5 py-1.5">
                {p.eyebrow}
              </span>
              <h1 className="mt-5 text-[36px] lg:text-[46px] font-extrabold text-deep-navy leading-[1.1] tracking-tight">
                {p.title}{" "}
                <span className="gradient-text-teal">{p.highlight}</span>
              </h1>
              <p className="mt-5 text-[17px] text-text-body leading-relaxed max-w-[480px]">
                {p.heroDesc}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg gradient-cta hover:shadow-button transition-all">
                  Request a Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-lg border border-border-blue bg-white hover:shadow-soft transition-all">
                  Get Started
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {p.heroPills.map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                  </span>
                ))}
              </div>
            </div>
            {p.mockup}
          </div>
        </div>
      </section>

      {/* Problem → Solution narrative */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">{p.narrativeTitle}</h2>
            <p className="mt-3 text-[16px] text-text-body">{p.narrativeSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {p.narrative.map((n) => (
              <div key={n.problem} className="bg-white rounded-xl border border-border-soft p-6">
                <p className="text-[11px] font-bold tracking-[0.1em] text-text-muted uppercase">The problem</p>
                <p className="mt-2 text-[14px] text-text-body leading-relaxed">{n.problem}</p>
                <div className="my-4 border-t border-border-soft" />
                <p className="text-[11px] font-bold tracking-[0.1em] text-teal uppercase">With FulfillMesh</p>
                <p className="mt-2 text-[14px] text-deep-navy font-medium leading-relaxed">{n.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <h2 className="text-[30px] font-bold text-deep-navy leading-tight">{p.capabilitiesTitle}</h2>
            <p className="mt-3 text-[16px] text-text-body">{p.capabilitiesSubtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.capabilities.map((c) => (
              <div key={c.title} className="bg-white rounded-xl p-6 border border-border-soft hover:shadow-card transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-action-blue" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-deep-navy">{c.title}</h3>
                    <p className="mt-2 text-[13px] text-text-body leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes + secondary mockup */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[30px] font-bold text-deep-navy leading-tight">{p.outcomesTitle}</h2>
              <div className="mt-6 space-y-3">
                {p.outcomes.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-[14px] text-text-body">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            {p.outcomeMockup}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gradient-dark-hero rounded-2xl text-white text-center px-6 py-14">
            <h2 className="text-[30px] font-bold leading-tight">{p.ctaTitle}</h2>
            <p className="mt-3 text-[16px] text-text-on-dark-muted">{p.ctaDesc}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/book-a-demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-deep-navy rounded-lg bg-white hover:shadow-button transition-all">
                Request a Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white rounded-lg border border-white/30 hover:bg-white/10 transition-all">
                Get Started
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["No setup fees", "Cancel anytime", "Dedicated onboarding"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-[14px] text-text-on-dark-soft">
                  <CheckCircle2 className="w-4 h-4 text-teal" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prev / next */}
      <section className="bg-white border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-between">
          {p.prevLink ? (
            <Link href={p.prevLink.href} className="flex items-center gap-2 text-[14px] font-medium text-text-muted hover:text-navy transition-colors">
              <ArrowLeft className="w-4 h-4" /> {p.prevLink.label}
            </Link>
          ) : <div />}
          {p.nextLink ? (
            <Link href={p.nextLink.href} className="flex items-center gap-2 text-[14px] font-medium text-text-muted hover:text-navy transition-colors">
              {p.nextLink.label} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </div>
      </section>
    </main>
  );
}
