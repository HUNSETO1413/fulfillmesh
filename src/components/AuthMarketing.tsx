"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Globe,
  ShieldCheck,
  BarChart3,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-time visibility",
    desc: "Track orders in real time across your supply chain.",
  },
  {
    icon: Globe,
    title: "Global support",
    desc: "24/7 support in 15+ languages.",
  },
  {
    icon: ShieldCheck,
    title: "Secure transactions",
    desc: "Bank-level encryption for data security.",
  },
];

const inputBase =
  "w-full rounded border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1A365D] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-colors";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export default function AuthMarketing({ defaultTab = "login" }: { defaultTab?: "login" | "register" }) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ===== Left Panel (~40%) - Promotional Content ===== */}
      <div className="flex-shrink-0 lg:w-[40%] bg-white flex flex-col justify-center px-8 py-12 lg:px-10 lg:py-16">
        {/* Globe / World map illustration */}
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
        <h1 className="text-2xl font-bold leading-tight text-[#1A365D] text-center">
          Welcome back to{" "}
          <span className="text-teal">smarter fulfillment.</span>
        </h1>
        <p className="mt-4 text-base text-[#4A5568] leading-relaxed text-center max-w-lg mx-auto">
          Streamline your operations with our intuitive platform.
        </p>

        {/* Features */}
        <div className="mt-10 space-y-6 max-w-md mx-auto">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#2563EB] flex items-center justify-center bg-white">
                <f.icon className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A365D]">{f.title}</p>
                <p className="mt-1 text-xs text-[#718096] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Right Panel (~60%) - Auth Card ===== */}
      <div className="flex-1 lg:w-[60%] bg-white flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-[380px]">
          {/* Auth Card */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
            {/* Underline Tabs */}
            <div className="flex border-b border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`flex-1 py-3.5 text-sm font-medium text-center transition-colors relative ${
                  tab === "login"
                    ? "text-[#1A365D]"
                    : "text-[#718096] hover:text-[#1A365D]"
                }`}
              >
                Log in
                {tab === "login" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setTab("register")}
                className={`flex-1 py-3.5 text-sm font-medium text-center transition-colors relative ${
                  tab === "register"
                    ? "text-[#1A365D]"
                    : "text-[#718096] hover:text-[#1A365D]"
                }`}
              >
                Create account
                {tab === "register" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
                )}
              </button>
            </div>

            <div className="p-8">
              {tab === "login" ? (
                <>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <div className="relative">
                        <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBD5E0]" />
                        <input type="email" className={inputBase + " pr-10"} placeholder="Email address" />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBD5E0]" />
                        <input
                          type={showPassword ? "text" : "password"}
                          className={inputBase + " pr-10"}
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E0] hover:text-[#1A365D] transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-start">
                      <Link href="/forgot-password" className="text-sm text-[#2563EB] hover:underline transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded bg-[#2563EB] text-white text-base font-medium hover:bg-[#0046B8] transition-colors"
                    >
                      Log in
                    </button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E2E8F0]" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-white text-sm text-[#A0AEC0]">or</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button type="button" className="w-full flex items-center justify-center gap-2 py-2.5 rounded border border-[#E2E8F0] text-sm font-normal text-[#1A365D] hover:bg-[#F7FAFC] transition-colors">
                      <GoogleIcon /> Continue with Google
                    </button>
                    <button type="button" className="w-full flex items-center justify-center gap-2 py-2.5 rounded border border-[#E2E8F0] text-sm font-normal text-[#1A365D] hover:bg-[#F7FAFC] transition-colors">
                      <AppleIcon /> Continue with Apple
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="relative">
                          <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBD5E0]" />
                          <input type="text" className={inputBase + " pr-10"} placeholder="First name" />
                        </div>
                      </div>
                      <div>
                        <div className="relative">
                          <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBD5E0]" />
                          <input type="text" className={inputBase + " pr-10"} placeholder="Last name" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBD5E0]" />
                        <input type="email" className={inputBase + " pr-10"} placeholder="Email" />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <Building2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBD5E0]" />
                        <input type="text" className={inputBase + " pr-10"} placeholder="Company" />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBD5E0]" />
                        <input type="tel" className={inputBase + " pr-10"} placeholder="Phone" />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBD5E0]" />
                        <input
                          type={showRegPassword ? "text" : "password"}
                          className={inputBase + " pr-10"}
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E0] hover:text-[#1A365D] transition-colors"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBD5E0]" />
                        <input type="password" className={inputBase + " pr-10"} placeholder="Confirm password" />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded bg-[#2563EB] text-white text-base font-medium hover:bg-[#0046B8] transition-colors"
                    >
                      Create account
                    </button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E2E8F0]" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-white text-sm text-[#A0AEC0]">or</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button type="button" className="w-full flex items-center justify-center gap-2 py-2.5 rounded border border-[#E2E8F0] text-sm font-normal text-[#1A365D] hover:bg-[#F7FAFC] transition-colors">
                      <GoogleIcon /> Continue with Google
                    </button>
                    <button type="button" className="w-full flex items-center justify-center gap-2 py-2.5 rounded border border-[#E2E8F0] text-sm font-normal text-[#1A365D] hover:bg-[#F7FAFC] transition-colors">
                      <AppleIcon /> Continue with Apple
                    </button>
                  </div>

                  <p className="mt-5 text-xs text-[#718096] leading-relaxed text-center">
                    By signing up, you agree to our{" "}
                    <Link href="/legal/terms" className="text-[#2563EB] hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/legal/privacy" className="text-[#2563EB] hover:underline">Privacy Policy</Link>.
                  </p>

                  <p className="mt-4 text-sm text-[#718096] text-center">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      className="text-[#2563EB] font-medium hover:underline"
                    >
                      Log in
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
