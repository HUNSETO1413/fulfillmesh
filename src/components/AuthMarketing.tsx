"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  Loader2,
  ShieldCheck,
  BarChart3,
  Globe,
  TrendingUp,
  CreditCard,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const features = [
  {
    icon: ShieldCheck,
    title: "Vetted partners",
    desc: "Work with verified factories and logistics partners you can trust.",
  },
  {
    icon: BarChart3,
    title: "Real-time visibility",
    desc: "Track orders, shipments, inventory, and QC in real time from one dashboard.",
  },
  {
    icon: Globe,
    title: "Global shipping support",
    desc: "End-to-end logistics, customs support, and on-time delivery worldwide.",
  },
  {
    icon: TrendingUp,
    title: "Scalable operations",
    desc: "Built for growing brands with flexible solutions that scale with you.",
  },
];

const brands = ["ZENSKA", "LUMIÈRE", "NEXORA", "VIVID SUPPLY", "BRIO", "ALTERRA"];

const inputBase =
  "w-full rounded-lg border border-border-soft bg-white px-4 py-3 text-sm text-deep-navy placeholder:text-text-light focus:outline-none focus:border-action-blue focus:ring-2 focus:ring-action-blue/20 transition-colors";
const labelBase = "block text-sm font-semibold text-deep-navy mb-2";

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

function ShopifyIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M15.34 3.27c-.1-.01-.2.02-.27.08-.04.04-.74.23-.74.23s-.49-.49-.55-.55c-.06-.06-.18-.04-.22-.03-.01 0-.16.05-.4.12-.24-.69-.66-1.32-1.4-1.32h-.06c-.21-.27-.47-.39-.7-.39-1.74.01-2.57 2.18-2.83 3.28-.68.21-1.16.36-1.22.38-.38.12-.39.13-.44.49-.04.27-1.03 7.97-1.03 7.97L12.65 16l4.13-.89S15.45 3.4 15.34 3.27zM12.34 2.7c-.13.04-.28.09-.44.14V2.7c0-.29-.04-.53-.11-.72.27.03.45.34.55.72zm-.97-.62c.08.2.13.49.13.88v.14c-.32.1-.66.21-1.01.32.2-.76.57-1.13.88-1.34zm-.79-.37c.06 0 .12.02.18.06-.41.19-.85.68-1.04 1.66l-.8.25C9.13 2.78 9.72 1.71 10.58 1.71z" fill="#95BF47" />
      <path d="M15.07 3.35c-.07-.01-.14 0-.2.05 0 0-.7.19-.7.19s-.49-.49-.55-.55a.15.15 0 00-.08-.04l-.6 12.11 4.13-.89s-1.33-9.05-1.34-9.13c-.01-.08-.07-.13-.14-.14a.45.45 0 00-.42.4z" fill="#5E8E3E" />
      <path d="M12.6 6.07l-.51 1.51s-.45-.24-1-.24c-.81 0-.85.51-.85.64 0 .7 1.82.97 1.82 2.6 0 1.29-.81 2.11-1.91 2.11-1.32 0-1.99-.82-1.99-.82l.35-1.17s.69.59 1.28.59c.38 0 .54-.3.54-.52 0-.91-1.49-.95-1.49-2.45 0-1.26.9-2.48 2.73-2.48.7 0 1.04.21 1.04.21z" fill="#fff" />
    </svg>
  );
}

export default function AuthMarketing({ defaultTab = "login" }: { defaultTab?: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoginError(data?.error || "Unable to log in. Please try again.");
        return;
      }
      const next = searchParams.get("next");
      router.push(next || "/dashboard");
      router.refresh();
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError(null);

    if (regPassword.length < 8) {
      setRegError("Password must be at least 8 characters.");
      return;
    }

    setRegLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName.trim(), email: regEmail, password: regPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRegError(data?.error || "Unable to create account. Please try again.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setRegError("Something went wrong. Please try again.");
    } finally {
      setRegLoading(false);
    }
  }

  return (
    <>
      <Header />

      {/* ===== Hero split: marketing (left) + auth card (right) ===== */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* ---- Left: marketing ---- */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/10 text-xs font-semibold text-teal">
                <ShieldCheck className="w-3.5 h-3.5" />
                Welcome to FulfillMesh
              </span>
              <h1 className="mt-5 text-[40px] leading-[1.1] font-bold text-deep-navy">
                Welcome back to
                <br />
                <span className="text-teal">smarter</span> fulfillment.
              </h1>
              <p className="mt-5 text-base text-text-body leading-relaxed max-w-md">
                Manage suppliers, QC, shipping, warehouses, and analytics — all from one powerful
                platform. Save time, reduce risk, and grow with confidence.
              </p>

              {/* Dashboard preview with globe backdrop */}
              <div className="relative mt-8">
                <div className="absolute inset-0 -z-0 flex items-center justify-center opacity-60">
                  <svg viewBox="0 0 400 220" className="w-full h-full" fill="none">
                    <ellipse cx="200" cy="110" rx="150" ry="100" stroke="#C7D6EA" strokeWidth="1" strokeDasharray="3 4" />
                    {[
                      [90, 70], [140, 55], [200, 50], [260, 60], [310, 80],
                      [70, 120], [130, 140], [200, 150], [270, 140], [330, 120],
                      [110, 95], [180, 100], [250, 95], [300, 105],
                    ].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="2" fill="#9AB6D8" />
                    ))}
                    <circle cx="200" cy="150" r="6" fill="#00B894" />
                    <line x1="200" y1="150" x2="90" y2="70" stroke="#00B894" strokeWidth="1" strokeDasharray="5 4" opacity="0.4" />
                    <line x1="200" y1="150" x2="310" y2="80" stroke="#0057D8" strokeWidth="1" strokeDasharray="5 4" opacity="0.35" />
                  </svg>
                </div>
                <div className="relative rounded-xl border border-border-soft bg-white shadow-card p-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-border-soft">
                    <div className="w-6 h-6 rounded-md gradient-logo flex items-center justify-center">
                      <span className="text-white font-bold text-[8px]">FM</span>
                    </div>
                    <span className="text-xs font-semibold text-deep-navy">Overview</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {[
                      { l: "Total Orders", v: "1,248" },
                      { l: "In Transit", v: "128" },
                      { l: "QC Inspections", v: "36" },
                      { l: "On-Time Delivery", v: "98%" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-lg bg-soft-bg p-2">
                        <p className="text-[8px] text-text-muted leading-tight">{s.l}</p>
                        <p className="text-sm font-bold text-deep-navy mt-0.5">{s.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature list */}
              <div className="mt-10 space-y-6 max-w-md">
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

              {/* Testimonial */}
              <div className="mt-8 max-w-md rounded-xl border border-border-soft bg-white p-5">
                <p className="text-sm italic text-text-body leading-relaxed">
                  &ldquo;FulfillMesh streamlined our sourcing and shipping. Our delivery rate improved by 30%.&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-action-blue/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-action-blue">SC</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-deep-navy">Sarah Chen</p>
                      <p className="text-xs text-text-muted">Operations Manager, BRIO</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold tracking-wider text-deep-navy">BRIO</span>
                </div>
              </div>
            </div>

            {/* ---- Right: auth card ---- */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border-soft bg-white shadow-card overflow-hidden">
                {/* Tabs */}
                <div className="grid grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className={`py-4 text-base font-semibold text-center transition-colors relative ${
                      tab === "login" ? "text-action-blue" : "text-text-muted hover:text-deep-navy"
                    }`}
                  >
                    Log in
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        tab === "login" ? "bg-action-blue" : "bg-border-soft"
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("register")}
                    className={`py-4 text-base font-semibold text-center transition-colors relative ${
                      tab === "register" ? "text-action-blue" : "text-text-muted hover:text-deep-navy"
                    }`}
                  >
                    Create account
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        tab === "register" ? "bg-action-blue" : "bg-border-soft"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-8">
                  {tab === "login" ? (
                    <>
                      <p className="text-center text-sm text-text-muted mb-6">
                        New to FulfillMesh?{" "}
                        <button
                          type="button"
                          onClick={() => setTab("register")}
                          className="font-semibold text-action-blue hover:underline"
                        >
                          Create account
                        </button>
                      </p>

                      <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                          <label className={labelBase}>Email address</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                            <input
                              type="email"
                              required
                              autoComplete="email"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className={inputBase + " pl-11"}
                              placeholder="name@company.com"
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelBase}>Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              autoComplete="current-password"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className={inputBase + " pl-11 pr-11"}
                              placeholder="Enter your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-deep-navy transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm text-text-body cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-border-soft text-action-blue focus:ring-action-blue/30" />
                            Remember me
                          </label>
                          <Link href="/forgot-password" className="text-sm font-medium text-action-blue hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        {loginError && (
                          <p className="text-sm text-red-600" role="alert">
                            {loginError}
                          </p>
                        )}
                        <button
                          type="submit"
                          disabled={loginLoading}
                          className="w-full py-3 rounded-lg bg-navy text-white text-base font-semibold hover:bg-navy/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                        >
                          {loginLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                          {loginLoading ? "Logging in…" : "Log in"}
                        </button>
                        <p className="text-center text-xs text-text-muted">
                          Try the demo account:{" "}
                          <span className="font-medium text-deep-navy">admin@fulfillmesh.com</span>{" "}
                          / <span className="font-medium text-deep-navy">demo1234</span>
                        </p>
                      </form>

                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border-soft" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 bg-white text-sm text-text-muted">or continue with</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <button type="button" className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg border border-border-soft text-sm font-medium text-deep-navy hover:bg-soft-bg transition-colors">
                          <GoogleIcon /> Continue with Google
                        </button>
                        <button type="button" className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg border border-border-soft text-sm font-medium text-deep-navy hover:bg-soft-bg transition-colors">
                          <ShopifyIcon /> Continue with Shopify
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-deep-navy">Create your account</h2>
                      <p className="mt-1 text-sm text-text-muted">
                        Join thousands of brands shipping smarter from China.
                      </p>

                      <form className="mt-6 space-y-5" onSubmit={handleRegister}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelBase}>Full name</label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                              <input
                                type="text"
                                required
                                autoComplete="name"
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                className={inputBase + " pl-11"}
                                placeholder="Your full name"
                              />
                            </div>
                          </div>
                          <div>
                            <label className={labelBase}>Work email</label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                              <input
                                type="email"
                                required
                                autoComplete="email"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                className={inputBase + " pl-11"}
                                placeholder="name@company.com"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelBase}>Company name</label>
                            <div className="relative">
                              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                              <input
                                type="text"
                                autoComplete="organization"
                                value={regCompany}
                                onChange={(e) => setRegCompany(e.target.value)}
                                className={inputBase + " pl-11"}
                                placeholder="Your company"
                              />
                            </div>
                          </div>
                          <div>
                            <label className={labelBase}>Password</label>
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                              <input
                                type={showRegPassword ? "text" : "password"}
                                required
                                autoComplete="new-password"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                className={inputBase + " pl-11 pr-11"}
                                placeholder="Create a password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowRegPassword(!showRegPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-deep-navy transition-colors"
                              >
                                {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                        {regError && (
                          <p className="text-sm text-red-600" role="alert">
                            {regError}
                          </p>
                        )}
                        <button
                          type="submit"
                          disabled={regLoading}
                          className="w-full py-3 rounded-lg gradient-cta text-white text-base font-semibold hover:shadow-button transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                        >
                          {regLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                          {regLoading ? "Creating account…" : "Create account"}
                        </button>
                        <p className="text-xs text-text-muted leading-relaxed text-center">
                          By creating an account, you agree to our{" "}
                          <Link href="/legal/terms" className="text-action-blue hover:underline">Terms of Service</Link>{" "}
                          and{" "}
                          <Link href="/legal/privacy" className="text-action-blue hover:underline">Privacy Policy</Link>.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {/* Trust badges under card */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: ShieldCheck, title: "Secure login", desc: "Your data is encrypted and always protected." },
                  { icon: CreditCard, title: "No credit card required", desc: "Start free. Upgrade when you're ready." },
                  { icon: Users, title: "Trusted by global e-commerce brands", desc: "Join 1,200+ brands worldwide." },
                ].map((b) => (
                  <div key={b.title}>
                    <b.icon className="w-5 h-5 text-action-blue" />
                    <p className="mt-2 text-xs font-semibold text-deep-navy leading-tight">{b.title}</p>
                    <p className="mt-1 text-[11px] text-text-muted leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trusted-by logo strip ===== */}
      <section className="bg-white border-y border-border-soft">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <p className="text-sm font-medium text-text-muted lg:max-w-[140px]">
              Trusted by brands growing worldwide
            </p>
            <div className="flex-1 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
              {brands.map((b) => (
                <span key={b} className="text-base font-bold tracking-wider text-text-light">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA banner ===== */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-10">
          <div className="rounded-2xl gradient-dark-hero px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-shrink-0 w-11 h-11 rounded-full border border-teal/40 items-center justify-center">
                <Check className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Ready to streamline your fulfillment?</p>
                <p className="mt-1 text-sm text-text-on-dark-muted">
                  Connect with vetted partners and manage every step in one place.
                </p>
              </div>
            </div>
            <Link
              href="/get-started"
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-3 rounded-lg gradient-cta text-white text-sm font-semibold hover:shadow-button transition-all"
            >
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
