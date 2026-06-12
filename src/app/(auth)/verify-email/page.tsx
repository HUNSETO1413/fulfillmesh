"use client";

import Link from "next/link";
import { Send, ShieldCheck, Bell, Sparkles, Check } from "lucide-react";

const reasons = [
  { icon: ShieldCheck, title: "Secure Your Account", desc: "Verifying confirms it's really you and protects your account from unauthorized access." },
  { icon: Bell, title: "Stay Updated", desc: "Get order updates, shipping alerts, and important notifications straight to your inbox." },
  { icon: Sparkles, title: "Personalized Experience", desc: "Unlock tailored recommendations and insights for your business." },
];

export default function VerifyEmailPage() {
  return (
    <div className="bg-soft-bg">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-14 lg:py-20 text-center">
        {/* Envelope illustration */}
        <div className="relative mx-auto w-44 h-36">
          {/* Sparkle / dot accents */}
          <Sparkles className="absolute -top-1 left-2 w-5 h-5 text-teal/70" strokeWidth={2} />
          <Sparkles className="absolute top-3 right-1 w-4 h-4 text-action-blue/60" strokeWidth={2} />
          <span className="absolute top-8 -left-1 w-2 h-2 rounded-full bg-action-blue/40" />
          <span className="absolute -top-2 right-12 w-1.5 h-1.5 rounded-full bg-teal/50" />
          <span className="absolute bottom-2 -right-1 w-2.5 h-2.5 rounded-full bg-teal/30" />
          <span className="absolute bottom-0 left-4 w-1.5 h-1.5 rounded-full bg-action-blue/30" />

          {/* Envelope */}
          <svg
            viewBox="0 0 176 144"
            fill="none"
            className="relative w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* envelope back / body */}
            <rect x="28" y="44" width="120" height="84" rx="10" fill="#fff" stroke="#E6EDF5" strokeWidth="3" />
            {/* letter */}
            <rect x="44" y="30" width="88" height="64" rx="6" fill="#F7FAFC" stroke="#E6EDF5" strokeWidth="2.5" />
            <rect x="56" y="46" width="64" height="5" rx="2.5" fill="#0057D8" opacity="0.85" />
            <rect x="56" y="58" width="52" height="4" rx="2" fill="#66758C" opacity="0.55" />
            <rect x="56" y="68" width="44" height="4" rx="2" fill="#66758C" opacity="0.4" />
            {/* envelope flap / front */}
            <path d="M28 60 L82 96 a10 10 0 0 0 12 0 L148 60 V118 a10 10 0 0 1 -10 10 H38 a10 10 0 0 1 -10 -10 Z" fill="#fff" stroke="#E6EDF5" strokeWidth="3" />
            <path d="M30 62 L84 98 a8 8 0 0 0 8 0 L146 62" stroke="#0057D8" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          </svg>

          {/* Green check badge */}
          <span className="absolute bottom-2 right-3 w-11 h-11 rounded-full bg-teal flex items-center justify-center border-4 border-white shadow-md">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </span>
        </div>

        <h1 className="mt-8 text-3xl font-bold text-deep-navy">Check your email</h1>
        <p className="mt-3 text-base text-text-body">
          We&apos;ve sent a verification link to
        </p>
        <p className="mt-1 text-base font-semibold text-action-blue">hello@acmestore.com</p>
        <p className="mt-4 text-sm text-text-muted max-w-md mx-auto leading-relaxed">
          Please click the link in the email to verify your account and get started with FulfillMesh.
        </p>

        {/* Resend card */}
        <div className="mt-10 rounded-xl border border-border-soft bg-white p-6 max-w-md mx-auto">
          <p className="text-sm font-medium text-deep-navy">Haven&apos;t received the email?</p>
          <p className="mt-1.5 text-sm text-text-muted leading-relaxed">
            Check your spam or junk folder. If you still can&apos;t find it, you can resend the email or
            use a different email address.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-action-blue text-white text-sm font-medium hover:bg-[#0046B8] transition-colors"
            >
              <Send className="w-4 h-4" /> Resend Email
            </button>
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border-soft text-deep-navy text-sm font-medium hover:bg-soft-bg transition-colors"
            >
              Change Email Address
            </button>
          </div>
        </div>

        <p className="mt-6 text-sm text-text-muted">
          Already verified?{" "}
          <Link href="/login" className="font-medium text-action-blue hover:underline">
            Go to login
          </Link>
        </p>

        {/* Why verify section */}
        <div className="mt-16">
          <h2 className="text-lg font-bold text-deep-navy">Why do I need to verify my email?</h2>
          <p className="mt-2 text-sm text-text-muted max-w-lg mx-auto">
            Email verification helps us keep your account secure and ensures important updates reach you.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-6 text-left">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-xl bg-white p-5">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
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
  );
}
