"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/client";

const footerLinks = {
  solutions: {
    title: "Solutions",
    links: [
      { name: "Supplier Matching", href: "/solutions/supplier-matching" },
      { name: "Quality Control", href: "/solutions/quality-control" },
      { name: "Packaging & Labeling", href: "/solutions/packaging-labeling" },
      { name: "Shipping & Logistics", href: "/solutions/shipping-logistics" },
      { name: "Overseas Warehousing", href: "/solutions/overseas-warehousing" },
      { name: "All Solutions", href: "/solutions" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "/company/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Partner With Us", href: "/company/partners" },
      { name: "Careers", href: "/company/careers" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Case Studies", href: "/resources/case-studies" },
      { name: "Blog", href: "/blog" },
      { name: "Help Center", href: "/resources/help-center" },
      { name: "API Documentation", href: "/resources/api-documentation" },
      { name: "Glossary", href: "/glossary" },
    ],
  },
};

function SocialIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="text-text-muted hover:text-text-primary transition-colors flex items-center justify-center"
    >
      {children}
    </a>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubscribe = async () => {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      setFeedback("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setFeedback("");
    try {
      await api.post("/api/submissions", {
        type: "contact",
        name: "Newsletter subscriber",
        email: value,
      });
      setStatus("success");
      setFeedback("You're subscribed! Watch your inbox for fulfillment insights.");
      setEmail("");
    } catch {
      setStatus("error");
      setFeedback("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="bg-white border-t border-border-soft">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Main Footer Grid */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-[14px] font-bold text-text-primary mb-4 tracking-wide">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-text-body hover:text-teal transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter / Stay in the Loop Column */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[14px] font-bold text-text-primary mb-4 tracking-wide">
              Stay in the Loop
            </h4>
            <p className="text-[13px] text-text-muted leading-relaxed mb-4">
              Get insights, updates, and tips on fulfillment and e-commerce.
            </p>
            {status === "success" ? (
              <div className="flex items-start gap-2.5 rounded-lg border border-teal/30 bg-teal/5 px-3.5 py-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-teal mt-px" />
                <p className="text-[13px] text-text-body leading-relaxed">{feedback}</p>
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSubscribe();
                }}
                noValidate
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Enter your email"
                  aria-invalid={status === "error"}
                  aria-label="Email address"
                  className="w-full rounded-lg border border-border-soft bg-soft-bg px-3.5 py-2.5 text-[14px] text-text-primary placeholder:text-text-light focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-deep-navy text-white text-[14px] font-semibold py-2.5 hover:bg-navy transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>
                {status === "error" && (
                  <p className="text-[12px] text-red-500 leading-snug" role="alert">
                    {feedback}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <SocialIcon label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </SocialIcon>
            <SocialIcon label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16h-4.267z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
            </SocialIcon>
            <SocialIcon label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </SocialIcon>
            <SocialIcon label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </SocialIcon>
          </div>

          {/* Copyright */}
          <p className="text-[13px] text-text-light">
            &copy; {new Date().getFullYear()} FulfillMesh Co. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/legal/terms"
              className="text-[13px] text-text-light hover:text-text-body transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/legal/privacy"
              className="text-[13px] text-text-light hover:text-text-body transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/cookies"
              className="text-[13px] text-text-light hover:text-text-body transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
