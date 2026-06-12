"use client";

import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  ShieldHalf,
  TrendingUp,
  CheckCircle2,
  Headphones,
  Globe,
  Check,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inputBase =
  "w-full rounded-lg border border-border-soft bg-white px-4 py-3 text-sm text-deep-navy placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-2 focus:ring-action-blue/20 transition-colors";

const features = [
  {
    icon: ShieldCheck,
    title: "Vetted Partners",
    desc: "Work with verified factories and 3PLs across China.",
  },
  {
    icon: Eye,
    title: "Real-time Visibility",
    desc: "Track orders, shipments, and inventory from a single dashboard.",
  },
  {
    icon: ShieldHalf,
    title: "End-to-End Control",
    desc: "From quality checks to delivery, we've got you covered.",
  },
  {
    icon: TrendingUp,
    title: "Reliable Delivery",
    desc: "Optimized routes and carrier network ensure on-time delivery.",
  },
];

const trustItems = [
  { icon: ShieldCheck, title: "Secure & Private", desc: "Your data is encrypted and always protected." },
  { icon: Lock, title: "Email Verified", desc: "Reset links are secure and time-limited." },
  { icon: Headphones, title: "Need Help?", desc: "Our support team is here to assist you." },
  { icon: Globe, title: "Global Platform", desc: "Built for brands shipping from China to the world." },
];

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />

      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* ===== Left: Form ===== */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border-soft bg-white shadow-card p-8">
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-xl bg-action-blue/10 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-action-blue" />
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-deep-navy text-center">
                  Forgot your password?
                </h1>
                <p className="mt-3 text-base text-text-body text-center leading-relaxed max-w-sm mx-auto">
                  No worries! Enter your email address and we&apos;ll send you a secure link to reset your password.
                </p>

                <form className="mt-7 space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-semibold text-deep-navy mb-2">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                      <input type="email" className={inputBase + " pl-11"} placeholder="Enter your email address" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-navy text-white text-base font-semibold hover:bg-navy/90 transition-colors"
                  >
                    Send reset link
                  </button>
                  <p className="flex items-center justify-center gap-2 text-sm text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    We&apos;ll email you a secure link that expires in 1 hour.
                  </p>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-soft" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-sm text-text-muted">OR</span>
                  </div>
                </div>

                <p className="text-center text-sm text-text-body">
                  Remember your password?{" "}
                  <Link href="/login" className="font-semibold text-action-blue hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>

            {/* ===== Right: Marketing ===== */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/10 text-xs font-semibold text-teal">
                <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                Real-time visibility. End-to-end control.
              </span>
              <h2 className="mt-5 text-[40px] leading-[1.1] font-bold text-deep-navy">
                Powerful fulfillment <span className="text-teal">made simple</span>
              </h2>
              <p className="mt-5 text-base text-text-body leading-relaxed max-w-md">
                FulfillMesh helps brands in China deliver more with vetted partners, real-time tracking, and complete visibility — all in one place.
              </p>

              {/* Globe illustration */}
              <div className="relative mt-8 h-44 rounded-2xl border border-border-soft bg-white overflow-hidden">
                <svg viewBox="0 0 600 240" className="w-full h-full opacity-90">
                  {[
                    [100, 60], [130, 75], [160, 65], [190, 85], [250, 80], [290, 70], [330, 65],
                    [370, 75], [410, 70], [450, 100], [490, 85], [530, 75], [570, 95],
                    [110, 115], [170, 125], [230, 135], [290, 120], [350, 130], [410, 125],
                    [470, 115], [530, 125], [120, 165], [180, 155], [240, 160],
                    [300, 150], [360, 160], [420, 155], [480, 165], [540, 160],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="2.5" fill="#B8C7DA" />
                  ))}
                  <circle cx="300" cy="120" r="22" fill="#00B894" opacity="0.16" />
                  <circle cx="300" cy="120" r="6" fill="#00B894" />
                  <line x1="300" y1="120" x2="120" y2="65" stroke="#00B894" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4" />
                  <line x1="300" y1="120" x2="490" y2="85" stroke="#0057D8" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.35" />
                </svg>
              </div>

              {/* Feature list */}
              <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-6">
                {features.map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-action-blue/10 flex items-center justify-center">
                      <f.icon className="w-5 h-5 text-action-blue" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-deep-navy">{f.title}</p>
                      <p className="mt-0.5 text-sm text-text-body leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Join CTA card */}
              <div className="mt-8 rounded-2xl border border-border-soft bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-action-blue/10 flex items-center justify-center">
                    <ShieldHalf className="w-5 h-5 text-action-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-deep-navy">
                      Join thousands of brands shipping smarter from China.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                      {["No obligations", "No hidden fees", "Personalized matches"].map((t) => (
                        <span key={t} className="flex items-center gap-1.5 text-xs text-text-body">
                          <Check className="w-3.5 h-3.5 text-teal" /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link
                  href="/get-started"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border-blue text-deep-navy text-sm font-semibold hover:bg-soft-bg transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trusted-by strip ===== */}
      <section className="bg-white border-y border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
          <h2 className="text-xl font-bold text-deep-navy text-center">
            Trusted by growing brands worldwide
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustItems.map((t) => (
              <div key={t.title} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-action-blue/10 flex items-center justify-center">
                  <t.icon className="w-5 h-5 text-action-blue" />
                </div>
                <p className="mt-4 text-sm font-semibold text-deep-navy">{t.title}</p>
                <p className="mt-1.5 text-sm text-text-body leading-relaxed max-w-[200px] mx-auto">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA banner ===== */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
          <div className="rounded-2xl gradient-dark-hero px-8 py-10 text-center">
            <h2 className="text-2xl font-bold text-white">Ready to simplify your fulfillment?</h2>
            <p className="mt-2 text-sm text-text-on-dark-muted">
              Get matched with the right partners and see the difference.
            </p>
            <Link
              href="/get-started"
              className="mt-6 inline-flex items-center gap-1.5 px-6 py-3 rounded-lg gradient-cta text-white text-sm font-semibold hover:shadow-button transition-all"
            >
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {["Free to get started", "No obligations", "Personalized matches"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-text-on-dark-soft">
                  <Check className="w-3.5 h-3.5 text-teal" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
