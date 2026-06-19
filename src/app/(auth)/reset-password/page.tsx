"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  ShieldCheck,
  Truck,
  BarChart3,
  KeyRound,
  BadgeCheck,
  UserCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inputBase =
  "w-full rounded-lg border border-border-soft bg-white px-4 py-3 text-sm text-deep-navy placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-2 focus:ring-action-blue/20 transition-colors";

// Each rule is a real predicate so the checklist + strength meter reflect input.
const requirements: { label: string; test: (v: string) => boolean }[] = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "Uppercase and lowercase letters", test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: "At least one number", test: (v) => /\d/.test(v) },
  { label: "At least one special character (e.g. ! @ # $)", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;

const features = [
  { icon: ShieldCheck, title: "Vetted Partners", desc: "Work with pre-vetted factories and logistics providers you can trust." },
  { icon: Eye, title: "Quality You Can Count On", desc: "On-site inspections and quality checks to ensure your standards." },
  { icon: Truck, title: "Optimized Delivery", desc: "Competitive shipping rates and reliable on-time delivery." },
  { icon: BarChart3, title: "Real-time Visibility", desc: "Track orders, shipments, and inventory from one powerful dashboard." },
];

const securityBadges = [
  { icon: Lock, label: "Data encrypted in transit & at rest" },
  { icon: BadgeCheck, label: "SOC 2 compliant" },
  { icon: UserCheck, label: "Role-based access" },
  { icon: ShieldCheck, label: "Regular security assessments" },
];

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const metRules = requirements.map((r) => r.test(password));
  const metCount = metRules.filter(Boolean).length;
  const strengthIdx = password.length === 0 ? 0 : metCount; // 0..4
  const strengthLabel = STRENGTH_LABELS[strengthIdx];
  const allMet = metCount === requirements.length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }
    // The endpoint only requires ≥8 chars; we keep the richer checklist for UX
    // but block submit on the minimum so the request always satisfies the API.
    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match. Please re-enter them.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "We couldn't reset your password. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />

      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-10 lg:py-14">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-deep-navy transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* ===== Left: Form ===== */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border-soft bg-white shadow-card p-8">
                {!token ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                        <KeyRound className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold text-deep-navy">Invalid or expired link</h1>
                    <p className="mt-3 text-base text-text-body leading-relaxed max-w-sm mx-auto">
                      This password reset link is missing or no longer valid. Request a new link to
                      continue.
                    </p>
                    <Link
                      href="/forgot-password"
                      className="mt-7 inline-flex w-full items-center justify-center py-3 rounded-lg bg-navy text-white text-base font-semibold hover:bg-navy/90 transition-colors"
                    >
                      Request a new link
                    </Link>
                    <Link
                      href="/login"
                      className="mt-3 inline-flex w-full items-center justify-center py-3 rounded-lg border border-border-blue text-deep-navy text-base font-semibold hover:bg-soft-bg transition-colors"
                    >
                      Back to sign in
                    </Link>
                  </div>
                ) : done ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-14 h-14 rounded-xl bg-teal/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-teal" />
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold text-deep-navy">Password reset</h1>
                    <p className="mt-3 text-base text-text-body leading-relaxed max-w-sm mx-auto">
                      Your password has been updated. You can now sign in with your new password.
                    </p>
                    <Link
                      href="/login"
                      className="mt-7 inline-flex w-full items-center justify-center py-3 rounded-lg bg-navy text-white text-base font-semibold hover:bg-navy/90 transition-colors"
                    >
                      Continue to sign in
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center mb-6">
                      <div className="w-14 h-14 rounded-xl bg-action-blue/10 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-action-blue" />
                      </div>
                    </div>

                    <h1 className="text-3xl font-bold text-deep-navy text-center">
                      Create a new password
                    </h1>
                    <p className="mt-3 text-base text-text-body text-center leading-relaxed max-w-sm mx-auto">
                      Your new password must be different from your previous passwords.
                    </p>

                    <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
                      <div>
                        <label className="block text-sm font-semibold text-deep-navy mb-2">New password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                          <input
                            type={show1 ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (error) setError(null);
                            }}
                            autoComplete="new-password"
                            className={inputBase + " pl-11 pr-11"}
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShow1((s) => !s)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-deep-navy"
                          >
                            {show1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-text-muted">
                          Use 8 or more characters with a mix of letters, numbers, and symbols.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-deep-navy mb-2">Confirm new password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                          <input
                            type={show2 ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => {
                              setConfirm(e.target.value);
                              if (error) setError(null);
                            }}
                            autoComplete="new-password"
                            className={inputBase + " pl-11 pr-11"}
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShow2((s) => !s)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-deep-navy"
                          >
                            {show2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {confirm.length > 0 && confirm !== password && (
                          <p className="mt-2 text-xs font-medium text-red-600">Passwords don&apos;t match.</p>
                        )}
                      </div>

                      {/* Password strength */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-deep-navy">Password strength</span>
                          <span className={`text-xs font-semibold ${allMet ? "text-teal" : strengthIdx >= 2 ? "text-action-blue" : "text-text-muted"}`}>
                            {strengthLabel}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 rounded-full transition-colors ${
                                i < strengthIdx ? (allMet ? "bg-teal" : "bg-action-blue") : "bg-border-soft"
                              }`}
                            />
                          ))}
                        </div>
                        {allMet ? (
                          <p className="mt-1.5 text-xs text-teal font-medium">Great job! This password looks strong.</p>
                        ) : (
                          <p className="mt-1.5 text-xs text-text-muted">Meet all requirements below for a strong password.</p>
                        )}
                      </div>

                      {/* Requirements checklist */}
                      <div className="rounded-lg bg-soft-bg p-4">
                        <p className="text-xs font-semibold text-deep-navy mb-2.5">Password must include:</p>
                        <ul className="space-y-2">
                          {requirements.map((r, i) => {
                            const met = metRules[i];
                            return (
                              <li key={r.label} className={`flex items-center gap-2 text-xs ${met ? "text-text-body" : "text-text-muted"}`}>
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${met ? "bg-teal" : "bg-border-soft"}`}>
                                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                </span>
                                {r.label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {error && (
                        <p className="text-sm font-medium text-red-600" role="alert">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 rounded-lg bg-navy text-white text-base font-semibold hover:bg-navy/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {submitting ? "Resetting…" : "Reset password"}
                      </button>

                      <p className="flex items-start gap-2 text-xs text-text-muted leading-relaxed">
                        <ShieldCheck className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
                        For your security, you&apos;ll be signed in on all devices after resetting your password.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* ===== Right: Marketing ===== */}
            <div>
              <h2 className="text-[40px] leading-[1.1] font-bold text-deep-navy">
                Secure access to your <span className="text-teal">fulfillment</span> operations
              </h2>
              <p className="mt-5 text-base text-text-body leading-relaxed max-w-md">
                FulfillMesh helps brands ship smarter with reliable partners across China and around the world.
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
            </div>
          </div>

          {/* ===== Security priority strip ===== */}
          <div className="mt-12 rounded-2xl border border-border-soft bg-white p-8">
            <h3 className="text-center text-base font-bold text-deep-navy flex items-center justify-center gap-2">
              <KeyRound className="w-4 h-4 text-action-blue" />
              Your security is our priority
            </h3>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityBadges.map((b) => (
                <div key={b.label} className="text-center">
                  <div className="mx-auto w-11 h-11 rounded-full bg-action-blue/10 flex items-center justify-center">
                    <b.icon className="w-5 h-5 text-action-blue" />
                  </div>
                  <p className="mt-3 text-xs font-medium text-text-body max-w-[160px] mx-auto leading-relaxed">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
