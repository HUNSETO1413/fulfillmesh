"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Send,
  ShieldCheck,
  Bell,
  Sparkles,
  Check,
  Mail,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN = 30; // seconds

const reasons = [
  { icon: ShieldCheck, title: "Secure Your Account", desc: "Protect your account and prevent unauthorized access." },
  { icon: Bell, title: "Stay Updated", desc: "Get order updates, shipping alerts, and important notifications." },
  { icon: Sparkles, title: "Personalized Experience", desc: "Access tailored solutions and recommendations for your business." },
];

type VerifyStatus = "idle" | "verifying" | "success" | "failed";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("hello@acmestore.com");
  const [editing, setEditing] = useState(false);
  const [draftEmail, setDraftEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resentNote, setResentNote] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [devVerifyUrl, setDevVerifyUrl] = useState<string | null>(null);

  // Token confirmation flow.
  const [status, setStatus] = useState<VerifyStatus>(token ? "verifying" : "idle");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const verifiedRef = useRef(false);

  // Tick down the resend cooldown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  // If the URL carries a token, confirm it immediately (once).
  useEffect(() => {
    if (!token || verifiedRef.current) return;
    verifiedRef.current = true;
    setStatus("verifying");
    setVerifyError(null);
    (async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
        if (!res.ok) {
          setVerifyError(data.error || "This verification link is invalid or has expired.");
          setStatus("failed");
          return;
        }
        setStatus("success");
      } catch {
        setVerifyError("Network error. Please check your connection and try again.");
        setStatus("failed");
      }
    })();
  }, [token]);

  const sendVerification = useCallback(async (target: string) => {
    setResending(true);
    setResentNote(null);
    setResendError(null);
    setDevVerifyUrl(null);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: target }),
      });
      const data: { ok?: boolean; error?: string; devVerifyUrl?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok) {
        setResendError(data.error || "We couldn't send the email. Please try again.");
        return false;
      }
      setResentNote(`Verification email sent to ${target}.`);
      setDevVerifyUrl(data.devVerifyUrl ?? null);
      setCooldown(RESEND_COOLDOWN);
      return true;
    } catch {
      setResendError("Network error. Please check your connection and try again.");
      return false;
    } finally {
      setResending(false);
    }
  }, []);

  async function handleResend() {
    if (resending || cooldown > 0) return;
    await sendVerification(email);
  }

  function startEditing() {
    setDraftEmail(email);
    setEmailError(null);
    setEditing(true);
  }

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draftEmail.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmail(trimmed);
    setEditing(false);
    await sendVerification(trimmed);
  }

  return (
    <>
      <Header />

      <div className="bg-soft-bg">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
          <div className="rounded-2xl border border-border-soft bg-white shadow-card px-6 sm:px-12 py-12 text-center">
            {/* Envelope illustration */}
            <div className="relative mx-auto w-56 h-48">
              {/* dashed orbit circle */}
              <svg viewBox="0 0 224 192" className="absolute inset-0 w-full h-full" fill="none">
                <circle cx="112" cy="96" r="86" stroke="#C7D6EA" strokeWidth="1.5" strokeDasharray="3 6" />
              </svg>
              {/* sparkle / dot accents */}
              <Sparkles className="absolute top-3 left-6 w-4 h-4 text-teal/60" strokeWidth={2} />
              <Sparkles className="absolute top-1 right-10 w-3.5 h-3.5 text-action-blue/50" strokeWidth={2} />
              <span className="absolute top-1/2 left-1 w-2 h-2 rounded-full bg-action-blue/40" />
              <span className="absolute bottom-6 right-3 w-2 h-2 rounded-full bg-teal/40" />
              <span className="absolute bottom-2 left-10 w-1.5 h-1.5 rounded-full bg-action-blue/30" />

              {/* paper plane */}
              <svg viewBox="0 0 24 24" className="absolute top-2 right-6 w-7 h-7 -rotate-12" fill="none">
                <path d="M22 2L11 13" stroke="#7CB7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22l-4-9-9-4 20-7z" fill="#7CB7FF" opacity="0.55" stroke="#7CB7FF" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>

              {/* open envelope */}
              <svg viewBox="0 0 176 144" fill="none" className="relative w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* letter */}
                <rect x="48" y="24" width="80" height="60" rx="6" fill="#fff" stroke="#E6EDF5" strokeWidth="2" />
                <rect x="58" y="38" width="60" height="5" rx="2.5" fill="#0057D8" opacity="0.85" />
                <rect x="58" y="50" width="48" height="4" rx="2" fill="#66758C" opacity="0.5" />
                <rect x="58" y="60" width="40" height="4" rx="2" fill="#66758C" opacity="0.35" />
                {/* envelope body */}
                <path d="M28 70 L88 108 L148 70 V126 a8 8 0 0 1 -8 8 H36 a8 8 0 0 1 -8 -8 Z" fill="#4A8DF0" />
                {/* front flap */}
                <path d="M28 70 L88 108 L148 70 L88 50 Z" fill="#7CB7FF" />
                <path d="M28 70 L88 108 L88 134 H36 a8 8 0 0 1 -8 -8 Z" fill="#2F6FD6" opacity="0.9" />
              </svg>

              {/* small envelope badge bottom-left */}
              <span className="absolute bottom-8 left-2 w-8 h-8 rounded-lg bg-action-blue/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-action-blue" />
              </span>

              {/* Green check badge */}
              <span className="absolute bottom-9 right-6 w-9 h-9 rounded-full bg-teal flex items-center justify-center border-4 border-white shadow-md">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-bold text-deep-navy">Check your email</h1>
            <p className="mt-3 text-base text-text-body">We&apos;ve sent a verification link to</p>
            <p className="mt-1 text-base font-semibold text-action-blue">{email}</p>
            <p className="mt-4 text-sm text-text-muted max-w-md mx-auto leading-relaxed">
              Please click the link in the email to verify your account and get started with FulfillMesh.
            </p>

            {/* Token confirmation status (only when a ?token= is present) */}
            {token && status !== "idle" && (
              <div
                className={`mt-6 rounded-xl border p-5 max-w-md mx-auto text-center ${
                  status === "success"
                    ? "border-teal/30 bg-teal/5"
                    : status === "failed"
                      ? "border-red-200 bg-red-50"
                      : "border-border-soft bg-soft-bg"
                }`}
                role="status"
                aria-live="polite"
              >
                {status === "verifying" && (
                  <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-deep-navy">
                    <Loader2 className="w-4 h-4 animate-spin text-action-blue" />
                    Verifying your email…
                  </p>
                )}
                {status === "success" && (
                  <>
                    <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-teal">
                      <CheckCircle2 className="w-4 h-4" /> Your email has been verified!
                    </p>
                    <Link
                      href="/login"
                      className="mt-4 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy/90 transition-colors"
                    >
                      Continue to sign in <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
                {status === "failed" && (
                  <p className="inline-flex items-center justify-center gap-2 text-sm font-medium text-red-600">
                    <XCircle className="w-4 h-4" />
                    {verifyError ?? "This verification link is invalid or has expired."}
                  </p>
                )}
              </div>
            )}

            {/* Resend card */}
            <div className="mt-10 rounded-xl border border-border-soft bg-soft-bg p-6 max-w-md mx-auto text-center">
              <p className="text-sm font-semibold text-deep-navy">Haven&apos;t received the email?</p>
              <p className="mt-1.5 text-sm text-text-muted leading-relaxed">
                Check your spam or junk folder. If you still can&apos;t find it, you can resend the email or use a different email address.
              </p>

              {editing ? (
                <form onSubmit={saveEmail} className="mt-5 text-left" noValidate>
                  <label className="block text-sm font-semibold text-deep-navy mb-2">New email address</label>
                  <input
                    type="email"
                    autoFocus
                    value={draftEmail}
                    onChange={(e) => {
                      setDraftEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    aria-invalid={!!emailError}
                    className="w-full rounded-lg border border-border-soft bg-white px-4 py-2.5 text-sm text-deep-navy placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-2 focus:ring-action-blue/20 transition-colors"
                    placeholder="name@company.com"
                  />
                  {emailError && <p className="mt-2 text-sm font-medium text-red-600" role="alert">{emailError}</p>}
                  <div className="mt-4 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-action-blue text-white text-sm font-medium hover:bg-[#0046B8] transition-colors"
                    >
                      Save &amp; Resend
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border-blue text-deep-navy text-sm font-medium hover:bg-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending || cooldown > 0}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-action-blue text-white text-sm font-medium hover:bg-[#0046B8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {resending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {resending
                        ? "Sending…"
                        : cooldown > 0
                          ? `Resend in ${cooldown}s`
                          : "Resend Email"}
                    </button>
                    <button
                      type="button"
                      onClick={startEditing}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border-blue text-deep-navy text-sm font-medium hover:bg-white transition-colors"
                    >
                      Change Email Address
                    </button>
                  </div>
                  {resentNote && (
                    <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-teal" role="status">
                      <CheckCircle2 className="w-4 h-4" /> {resentNote}
                    </p>
                  )}
                  {resendError && (
                    <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-red-600" role="alert">
                      <XCircle className="w-4 h-4" /> {resendError}
                    </p>
                  )}
                  {devVerifyUrl && (
                    <div className="mt-4 rounded-lg border border-dashed border-action-blue/40 bg-action-blue/5 p-3">
                      <p className="text-xs font-semibold text-text-muted">
                        Development convenience — no email is actually sent in this environment.
                      </p>
                      <Link
                        href={devVerifyUrl}
                        className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-action-blue hover:underline"
                      >
                        <ArrowRight className="w-4 h-4" /> Open verification link
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            <p className="mt-6 text-sm text-text-muted">
              Already verified?{" "}
              <Link href="/login" className="font-semibold text-action-blue hover:underline">
                Go to login
              </Link>
            </p>
          </div>

          {/* Why verify section */}
          <div className="mt-12 text-center">
            <h2 className="text-xl font-bold text-deep-navy">Why do I need to verify my email?</h2>
            <p className="mt-2 text-sm text-text-muted max-w-lg mx-auto">
              Email verification helps us keep your account secure and ensures important updates reach you.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-6">
              {reasons.map((r) => (
                <div key={r.title} className="rounded-xl border border-border-soft bg-white p-6 text-center">
                  <div className="mx-auto w-11 h-11 rounded-full bg-teal/10 flex items-center justify-center">
                    <r.icon className="w-5 h-5 text-teal" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-deep-navy">{r.title}</p>
                  <p className="mt-1.5 text-sm text-text-body leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
