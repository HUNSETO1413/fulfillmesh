import Link from "next/link";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  desc: string;
}

interface Step {
  title: string;
  desc: string;
}

interface SolutionPageProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  heroDesc: string;
  features: Feature[];
  steps: Step[];
  benefits: string[];
  prevLink?: { href: string; label: string };
  nextLink?: { href: string; label: string };
}

export default function SolutionPageLayout({
  icon: Icon,
  title,
  subtitle,
  heroDesc,
  features,
  steps,
  benefits,
  prevLink,
  nextLink,
}: SolutionPageProps) {
  return (
    <>
      {/* Hero */}
      <section className="bg-soft-bg border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link href="/solutions" className="hover:text-navy transition-colors">Solutions</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">{title}</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-teal/8 flex items-center justify-center">
              <Icon className="w-7 h-7 text-teal" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-[48px] font-bold text-navy leading-tight">{title}</h1>
              <p className="mt-2 text-lg text-text-accent font-medium">{subtitle}</p>
              <p className="mt-4 text-lg text-text-body leading-relaxed max-w-[640px]">{heroDesc}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/get-started"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/book-a-demo"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-navy rounded-[10px] border border-border-soft hover:shadow-soft transition-all"
                >
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-navy">What&apos;s included</h2>
          <p className="mt-3 text-text-body max-w-[540px]">
            Comprehensive {title.toLowerCase()} capabilities designed for global e-commerce brands.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border-soft hover:shadow-soft transition-all">
                <div className="w-10 h-10 rounded-lg bg-teal/8 flex items-center justify-center mb-4">
                  <span className="text-teal font-bold text-sm">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-semibold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-sm text-text-body leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-navy">How it works</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-cta text-white font-bold">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm text-text-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy">Why brands choose this</h2>
              <div className="mt-6 space-y-4">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-text-body">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-soft-bg rounded-2xl p-8 border border-border-soft">
              <h3 className="text-xl font-semibold text-navy">Ready to get started?</h3>
              <p className="mt-3 text-text-body">
                Tell us about your products and goals. We&apos;ll recommend the best approach for your {title.toLowerCase()} needs.
              </p>
              <Link
                href="/get-started"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all"
              >
                Find My Match <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-soft-bg border-t border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-between">
          {prevLink ? (
            <Link href={prevLink.href} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-navy transition-colors">
              <ArrowLeft className="w-4 h-4" /> {prevLink.label}
            </Link>
          ) : <div />}
          {nextLink ? (
            <Link href={nextLink.href} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-navy transition-colors">
              {nextLink.label} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </div>
      </section>
    </>
  );
}
