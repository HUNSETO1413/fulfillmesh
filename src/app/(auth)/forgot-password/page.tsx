"use client";

import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  ShieldHalf,
  Globe,
  BarChart3,
} from "lucide-react";

const inputBase =
  "w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-deep-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-colors";

const features = [
  {
    icon: ShieldCheck,
    title: "Vetted Partners",
    desc: "Work with verified factories and logistics partners.",
  },
  {
    icon: Eye,
    title: "Real-time Visibility",
    desc: "Track orders, shipments, and inventory from one powerful dashboard.",
  },
  {
    icon: ShieldHalf,
    title: "End-to-End Control",
    desc: "From quality checks to delivery, we've got you covered.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Comprehensive reporting and actionable insights for your business.",
  },
];

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ===== Left Panel (40%) - Form ===== */}
      <div className="flex-shrink-0 lg:w-[40%] bg-[#F8FAFC] flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.07)] overflow-hidden p-6">
            {/* Lock icon */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <Lock className="w-5 h-5 text-action-blue" />
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-[#212529] text-center">
              Forgot your password?
            </h1>
            <p className="mt-3 text-base text-[#6C757D] text-center leading-relaxed">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-[#6C757D] mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="email" className={inputBase + " pl-11"} placeholder="Enter your email address" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-navy text-white text-base font-semibold hover:bg-navy/90 transition-colors"
              >
                Send reset link
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-sm text-[#6B7280]">OR</span>
              </div>
            </div>

            <p className="text-center text-sm text-[#6C757D]">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-action-blue hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ===== Right Panel (60%) - Marketing Content ===== */}
      <div className="flex-1 lg:w-[60%] bg-white flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-16">
        {/* Globe illustration */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-48 h-48 lg:w-56 lg:h-56">
            <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
              {/* Globe circle */}
              <circle cx="100" cy="100" r="90" stroke="#E0E7FF" strokeWidth="2" fill="#F0F5FF" />
              <circle cx="100" cy="100" r="90" stroke="#C7D2FE" strokeWidth="1" fill="none" strokeDasharray="4 4" />
              {/* Latitude lines */}
              <ellipse cx="100" cy="100" rx="90" ry="35" stroke="#C7D2FE" strokeWidth="1" fill="none" />
              <ellipse cx="100" cy="100" rx="90" ry="65" stroke="#C7D2FE" strokeWidth="1" fill="none" />
              {/* Longitude lines */}
              <ellipse cx="100" cy="100" rx="35" ry="90" stroke="#C7D2FE" strokeWidth="1" fill="none" />
              <ellipse cx="100" cy="100" rx="65" ry="90" stroke="#C7D2FE" strokeWidth="1" fill="none" />
              {/* Connection dots */}
              {[
                [60, 50], [140, 45], [80, 70], [130, 80], [55, 110],
                [110, 60], [145, 120], [70, 140], [100, 130], [90, 95],
                [120, 105], [50, 75], [150, 90], [65, 95],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="#0057D8" opacity="0.6" />
              ))}
              {/* Connection lines */}
              <line x1="60" y1="50" x2="110" y2="60" stroke="#0057D8" strokeWidth="0.8" opacity="0.3" />
              <line x1="110" y1="60" x2="140" y2="45" stroke="#0057D8" strokeWidth="0.8" opacity="0.3" />
              <line x1="80" y1="70" x2="130" y2="80" stroke="#0057D8" strokeWidth="0.8" opacity="0.3" />
              <line x1="55" y1="110" x2="100" y2="130" stroke="#0057D8" strokeWidth="0.8" opacity="0.3" />
              <line x1="100" y1="130" x2="145" y2="120" stroke="#00B894" strokeWidth="0.8" opacity="0.4" />
              <line x1="90" y1="95" x2="120" y2="105" stroke="#00B894" strokeWidth="0.8" opacity="0.4" />
              {/* Accent dots */}
              <circle cx="110" cy="60" r="5" fill="#0057D8" opacity="0.8" />
              <circle cx="145" cy="120" r="5" fill="#00B894" opacity="0.8" />
              <circle cx="80" cy="70" r="4" fill="#0057D8" opacity="0.7" />
              <circle cx="100" cy="130" r="4" fill="#00B894" opacity="0.7" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl lg:text-[32px] font-bold leading-tight text-navy text-center lg:text-center">
          Powerful fulfillment{" "}
          <span className="text-teal">made simple</span>
        </h2>
        <p className="mt-4 text-base text-text-body leading-relaxed text-center lg:text-center max-w-lg mx-auto">
          FulfillMesh helps brands in China deliver more with vetted partners, real-time tracking,
          and complete visibility — all in one place.
        </p>

        {/* Features */}
        <div className="mt-10 space-y-6 max-w-md mx-auto lg:mx-auto">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <f.icon className="w-5 h-5 text-action-blue" />
              </div>
              <div>
                <p className="text-base font-semibold text-navy">{f.title}</p>
                <p className="mt-0.5 text-sm text-text-body leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA card */}
        <div className="mt-10 max-w-md mx-auto w-full rounded-2xl gradient-dark-hero p-6 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-white max-w-xs">
            Join thousands of brands shipping smarter from China.
          </p>
          <Link
            href="/get-started"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg gradient-cta text-white text-sm font-semibold hover:shadow-button transition-all"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
