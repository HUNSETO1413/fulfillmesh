"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function StatusSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
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
        name: "Status subscriber",
        email: value,
      });
      setStatus("success");
      setFeedback("You're subscribed! We'll email you about incidents and maintenance.");
      setEmail("");
    } catch {
      setStatus("error");
      setFeedback("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-4 rounded-lg border border-[#10B981] bg-[#ECFDF5] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10B981] text-white">
            <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#059669]">Subscribed</p>
            <p className="text-sm text-[#6B7280]">{feedback}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] text-action-blue">
          <Bell className="w-4 h-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#1A202C]">Subscribe to Updates</p>
          <p className="text-sm text-[#6B7280]">Get notified about incidents and maintenance.</p>
        </div>
      </div>
      <form onSubmit={handleSubscribe} noValidate className="mt-3 flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") {
              setStatus("idle");
              setFeedback("");
            }
          }}
          placeholder="Enter your email"
          aria-invalid={status === "error"}
          aria-label="Email address"
          className={`flex-1 rounded-lg border bg-white px-4 py-3 text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF] focus:border-action-blue ${
            status === "error" ? "border-red-400" : "border-[#D1D5DB]"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-action-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2563EB] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {status === "error" && feedback && (
        <p className="mt-2 text-[12px] font-medium text-red-600" role="alert">{feedback}</p>
      )}
    </div>
  );
}
