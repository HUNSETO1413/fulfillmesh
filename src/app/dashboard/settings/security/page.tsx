"use client";

import { useState } from "react";
import {
  Lock,
  Shield,
  Monitor,
  Smartphone,
  Bell,
  History,
  MoreVertical,
  Globe,
  QrCode,
  Copy,
  Download,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, Select, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { exportToCsv } from "@/lib/client";
import { isDomain, passwordStrength, type PasswordStrength } from "@/lib/validate";

function EnabledBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 bg-teal/10 text-teal text-[11px] font-medium rounded-full">
      Enabled
    </span>
  );
}

function DisabledBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 bg-[#94A3B8]/10 text-[#64748B] text-[11px] font-medium rounded-full">
      Disabled
    </span>
  );
}

type Session = {
  id: string;
  icon: typeof Monitor;
  label: string;
  current: boolean;
  lastActive?: string;
};

const TWO_FA_SECRET = "JBSW Y3DP EHPK 3PXP K5QT 6Z2M";

const SSO_PROVIDERS = ["Okta", "Azure AD", "Google Workspace", "OneLogin"];

const loginHistory = [
  { device: "Chrome on Windows", ip: "74.125.21.46", time: "May 18, 2025 09:41 AM", status: "Success" },
  { device: "Safari on iPhone", ip: "81.92.200.14", time: "May 17, 2025 08:12 PM", status: "Success" },
  { device: "Chrome on Windows", ip: "74.125.21.46", time: "May 17, 2025 09:05 AM", status: "Success" },
  { device: "Firefox on macOS", ip: "103.21.44.108", time: "May 16, 2025 11:37 PM", status: "Failed" },
  { device: "Firefox on macOS", ip: "103.21.44.108", time: "May 16, 2025 11:36 PM", status: "Failed" },
  { device: "Chrome on Windows", ip: "74.125.21.46", time: "May 16, 2025 09:02 AM", status: "Success" },
  { device: "Safari on iPhone", ip: "81.92.200.14", time: "May 15, 2025 06:48 PM", status: "Success" },
  { device: "Edge on Windows", ip: "192.30.255.112", time: "May 14, 2025 02:21 PM", status: "Success" },
];

const strengthMeta: Record<PasswordStrength, { label: string; color: string; width: string }> = {
  weak: { label: "Weak", color: "bg-[#EF4444]", width: "w-1/3" },
  medium: { label: "Medium", color: "bg-[#F59E0B]", width: "w-2/3" },
  strong: { label: "Strong", color: "bg-[#10B981]", width: "w-full" },
};

export default function SecurityPage() {
  const { toast } = useToast();
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Change password modal
  const [pwOpen, setPwOpen] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwErrors, setPwErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});
  const [pwBusy, setPwBusy] = useState(false);

  // Two-factor authentication
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [twoFAOpen, setTwoFAOpen] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<1 | 2>(1);
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAError, setTwoFAError] = useState("");
  const [disabling2FA, setDisabling2FA] = useState(false);

  // SSO
  const [sso, setSso] = useState({ configured: true, domain: "fulfillmesh.com", provider: "Okta" });
  const [ssoOpen, setSsoOpen] = useState(false);
  const [ssoDomain, setSsoDomain] = useState(sso.domain);
  const [ssoProvider, setSsoProvider] = useState(sso.provider);
  const [ssoError, setSsoError] = useState("");

  // Access history
  const [historyOpen, setHistoryOpen] = useState(false);

  // Sign out all sessions
  const [signOutAllOpen, setSignOutAllOpen] = useState(false);
  // Revoke single session
  const [revoking, setRevoking] = useState<Session | null>(null);

  const [sessions, setSessions] = useState<Session[]>([
    { id: "s1", icon: Monitor, label: "Chrome on Windows · New York, USA", current: true },
    { id: "s2", icon: Smartphone, label: "Safari on iPhone · London, UK", current: false, lastActive: "1 day ago" },
  ]);

  const strength = pwNew ? passwordStrength(pwNew) : null;

  const openPasswordModal = () => {
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
    setPwErrors({});
    setPwOpen(true);
  };

  const handleChangePassword = () => {
    const errors: { current?: string; next?: string; confirm?: string } = {};
    if (!pwCurrent) errors.current = "Current password is required";
    if (!pwNew) errors.next = "New password is required";
    else if (pwNew.length < 8) errors.next = "Password must be at least 8 characters";
    else if (pwCurrent && pwNew === pwCurrent) errors.next = "New password must be different from your current password";
    if (!pwConfirm) errors.confirm = "Please confirm your new password";
    else if (pwNew && pwNew !== pwConfirm) errors.confirm = "Passwords do not match";
    setPwErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setPwBusy(true);
    setTimeout(() => {
      setPwBusy(false);
      setPwOpen(false);
      setPwCurrent("");
      setPwNew("");
      setPwConfirm("");
      toast("Password changed successfully");
    }, 600);
  };

  const open2FASetup = () => {
    setTwoFAStep(1);
    setTwoFACode("");
    setTwoFAError("");
    setTwoFAOpen(true);
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(TWO_FA_SECRET.replace(/\s/g, ""));
    } catch {
      /* clipboard may be unavailable; still show feedback */
    }
    toast("Secret copied to clipboard");
  };

  const verify2FACode = () => {
    if (!/^\d{6}$/.test(twoFACode.trim())) {
      setTwoFAError("Enter the 6-digit code from your authenticator app");
      return;
    }
    setTwoFAEnabled(true);
    setTwoFAOpen(false);
    toast("Two-factor authentication enabled");
  };

  const handleDisable2FA = () => {
    setTwoFAEnabled(false);
    setDisabling2FA(false);
    toast("Two-factor authentication disabled");
  };

  const openSsoModal = () => {
    setSsoDomain(sso.domain);
    setSsoProvider(sso.provider);
    setSsoError("");
    setSsoOpen(true);
  };

  const handleSaveSso = () => {
    if (!ssoDomain.trim()) {
      setSsoError("Domain is required");
      return;
    }
    if (!isDomain(ssoDomain)) {
      setSsoError("Enter a valid domain (e.g. fulfillmesh.com)");
      return;
    }
    setSso({ configured: true, domain: ssoDomain.trim(), provider: ssoProvider });
    setSsoOpen(false);
    toast(`SSO configured for ${ssoDomain.trim()} via ${ssoProvider}`);
  };

  const exportHistory = () => {
    exportToCsv("login-history", loginHistory, [
      { key: "device", header: "Device" },
      { key: "ip", header: "IP Address" },
      { key: "time", header: "Time" },
      { key: "status", header: "Status" },
    ]);
    toast(`Exported ${loginHistory.length} login events to CSV`);
  };

  const handleSignOutAll = () => {
    setSessions((s) => s.filter((x) => x.current));
    setSignOutAllOpen(false);
    toast("Signed out of all other sessions");
  };

  const handleRevoke = () => {
    if (!revoking) return;
    setSessions((s) => s.filter((x) => x.id !== revoking.id));
    toast(`Session revoked`);
    setRevoking(null);
  };

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-text-primary">Security Settings</h2>
      <p className="text-[13px] text-text-body mt-1">
        Manage your password, two-factor authentication, and session activity.
      </p>

      {/* Security Settings Card */}
      <div className="mt-5 bg-white rounded-xl border border-border-soft shadow-soft">
        <div className="divide-y divide-border-soft">
          {/* Password */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Lock className="w-[18px] h-[18px] text-text-muted shrink-0" />
              <div>
                <p className="text-[14px] font-medium text-text-primary">Password</p>
                <p className="text-[12px] text-text-light mt-0.5">Last changed 2 months ago</p>
              </div>
            </div>
            <button
              onClick={openPasswordModal}
              className="shrink-0 px-3.5 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-action-blue/90 transition-colors"
            >
              Change Password
            </button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Shield className="w-[18px] h-[18px] text-text-muted shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium text-text-primary">Two-Factor Authentication</p>
                  {twoFAEnabled ? <EnabledBadge /> : <DisabledBadge />}
                </div>
                <p className="text-[12px] text-text-light mt-0.5">Enhance your account security</p>
              </div>
            </div>
            {twoFAEnabled ? (
              <button
                onClick={() => setDisabling2FA(true)}
                className="shrink-0 px-3.5 py-2 text-[13px] font-medium text-[#EF4444] border border-[#EF4444]/40 rounded-lg hover:bg-[#EF4444]/5 transition-colors"
              >
                Disable 2FA
              </button>
            ) : (
              <button
                onClick={open2FASetup}
                className="shrink-0 px-3.5 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-action-blue/90 transition-colors"
              >
                Enable 2FA
              </button>
            )}
          </div>

          {/* Single Sign-On */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Globe className="w-[18px] h-[18px] text-text-muted shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium text-text-primary">Single Sign-On (SSO)</p>
                  {sso.configured ? <EnabledBadge /> : <DisabledBadge />}
                </div>
                <p className="text-[12px] text-text-light mt-0.5">
                  {sso.configured
                    ? `${sso.provider} · ${sso.domain}`
                    : "Connect with your identity provider"}
                </p>
              </div>
            </div>
            <button
              onClick={openSsoModal}
              className="shrink-0 px-3.5 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-action-blue/90 transition-colors"
            >
              Manage SSO
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions Card */}
      <div className="mt-4 bg-white rounded-xl border border-border-soft shadow-soft">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-text-primary">Active Sessions</p>
              <p className="text-[13px] text-text-body mt-0.5">
                Manage your active sessions across devices.
              </p>
            </div>
            <button
              onClick={() => setSignOutAllOpen(true)}
              disabled={sessions.filter((s) => !s.current).length === 0}
              className="shrink-0 px-3.5 py-2 text-[13px] font-medium text-white bg-[#EF4444] rounded-lg hover:bg-[#EF4444]/90 transition-colors disabled:opacity-50"
            >
              Sign Out All Sessions
            </button>
          </div>
        </div>

        {/* Device rows */}
        <div className="px-5 pb-4 space-y-2">
          {sessions.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-soft-bg">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-text-muted shrink-0" />
                  <p className="text-[13px] text-text-primary">{s.label}</p>
                </div>
                <div className="flex items-center gap-3">
                  {s.current ? (
                    <span className="inline-flex items-center px-2 py-0.5 bg-action-blue/10 text-action-blue text-[11px] font-medium rounded-full">
                      Current Session
                    </span>
                  ) : (
                    <>
                      <span className="text-[12px] text-text-light">{s.lastActive}</span>
                      <button
                        onClick={() => setRevoking(s)}
                        className="text-text-light hover:text-[#EF4444] transition-colors"
                        aria-label="Revoke session"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Login Alerts */}
      <div className="mt-4 bg-white rounded-xl border border-border-soft shadow-soft">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Bell className="w-[18px] h-[18px] text-text-muted shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-medium text-text-primary">Login Alerts</p>
                {loginAlerts && <EnabledBadge />}
              </div>
              <p className="text-[12px] text-text-light mt-0.5">Get notified of important activity on your account.</p>
            </div>
          </div>
          <button
            onClick={() => {
              const next = !loginAlerts;
              setLoginAlerts(next);
              toast(next ? "Login alerts enabled" : "Login alerts disabled");
            }}
            className={`shrink-0 relative inline-flex h-[24px] w-[44px] items-center rounded-full transition-colors duration-200 ${
              loginAlerts ? "bg-action-blue" : "bg-[#CBD5E1]"
            }`}
          >
            <span
              className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                loginAlerts ? "translate-x-[23px]" : "translate-x-[3px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Access History */}
      <div className="mt-4 bg-white rounded-xl border border-border-soft shadow-soft">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <History className="w-[18px] h-[18px] text-text-muted shrink-0" />
            <div>
              <p className="text-[14px] font-medium text-text-primary">Access History</p>
              <p className="text-[12px] text-text-light mt-0.5">Review recent login activity and account access.</p>
            </div>
          </div>
          <button
            onClick={() => setHistoryOpen(true)}
            className="shrink-0 px-3.5 py-2 text-[13px] font-medium text-action-blue border border-action-blue rounded-lg hover:bg-action-blue/5 transition-colors"
          >
            View History
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        title="Change Password"
        description="Use a strong password you don't use elsewhere."
        footer={
          <>
            <SecondaryButton onClick={() => setPwOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleChangePassword} disabled={pwBusy}>
              {pwBusy ? "Updating…" : "Update Password"}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Current password" required error={pwErrors.current}>
            <TextInput
              type="password"
              value={pwCurrent}
              onChange={(e) => { setPwCurrent(e.target.value); setPwErrors((p) => ({ ...p, current: undefined })); }}
              placeholder="••••••••"
            />
          </Field>
          <div>
            <Field label="New password" required error={pwErrors.next}>
              <TextInput
                type="password"
                value={pwNew}
                onChange={(e) => { setPwNew(e.target.value); setPwErrors((p) => ({ ...p, next: undefined })); }}
                placeholder="••••••••"
              />
            </Field>
            {strength && (
              <div className="mt-2">
                <div className="h-1.5 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${strengthMeta[strength].color} ${strengthMeta[strength].width}`} />
                </div>
                <p className="mt-1 text-[11px] text-[#6B7280]">
                  Password strength: <span className="font-medium">{strengthMeta[strength].label}</span>
                  {strength !== "strong" && " — use 12+ characters with mixed case, numbers, and symbols"}
                </p>
              </div>
            )}
          </div>
          <Field label="Confirm new password" required error={pwErrors.confirm}>
            <TextInput
              type="password"
              value={pwConfirm}
              onChange={(e) => { setPwConfirm(e.target.value); setPwErrors((p) => ({ ...p, confirm: undefined })); }}
              placeholder="••••••••"
            />
          </Field>
        </div>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal
        open={twoFAOpen}
        onClose={() => setTwoFAOpen(false)}
        title="Set Up Two-Factor Authentication"
        description={twoFAStep === 1 ? "Step 1 of 2 — Scan the QR code with your authenticator app." : "Step 2 of 2 — Enter the 6-digit code from your app."}
        footer={
          twoFAStep === 1 ? (
            <>
              <SecondaryButton onClick={() => setTwoFAOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton onClick={() => setTwoFAStep(2)}>Continue</PrimaryButton>
            </>
          ) : (
            <>
              <SecondaryButton onClick={() => setTwoFAStep(1)}>Back</SecondaryButton>
              <PrimaryButton onClick={verify2FACode}>Verify &amp; Enable</PrimaryButton>
            </>
          )
        }
      >
        {twoFAStep === 1 ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-[160px] h-[160px] rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-center">
                <QrCode className="w-24 h-24 text-[#334155]" />
              </div>
            </div>
            <div>
              <p className="text-[12px] text-[#6B7280] mb-1.5">Can&apos;t scan? Enter this secret manually:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-[13px] bg-[#F1F5F9] px-3 py-2 rounded font-mono text-[#1E293B] tracking-wider">{TWO_FA_SECRET}</code>
                <button
                  onClick={copySecret}
                  className="shrink-0 p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                  aria-label="Copy secret"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Field label="Authentication code" required error={twoFAError} hint="Open your authenticator app and enter the current 6-digit code.">
            <TextInput
              value={twoFACode}
              onChange={(e) => { setTwoFACode(e.target.value); setTwoFAError(""); }}
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
              className="text-center tracking-[0.4em] font-mono"
            />
          </Field>
        )}
      </Modal>

      {/* Disable 2FA Confirm */}
      <ConfirmDialog
        open={disabling2FA}
        onClose={() => setDisabling2FA(false)}
        onConfirm={handleDisable2FA}
        title="Disable two-factor authentication"
        message="Disabling 2FA makes your account significantly less secure. You will only need your password to sign in. Are you sure?"
        confirmLabel="Disable 2FA"
        destructive
      />

      {/* SSO Modal */}
      <Modal
        open={ssoOpen}
        onClose={() => setSsoOpen(false)}
        title="Single Sign-On"
        description="Connect your identity provider so your team can sign in with SSO."
        size="sm"
        footer={
          <>
            <SecondaryButton onClick={() => setSsoOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSaveSso}>Save SSO Settings</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Company domain" required error={ssoError}>
            <TextInput
              value={ssoDomain}
              onChange={(e) => { setSsoDomain(e.target.value); setSsoError(""); }}
              placeholder="fulfillmesh.com"
            />
          </Field>
          <Field label="Identity provider">
            <Select options={SSO_PROVIDERS} value={ssoProvider} onChange={(e) => setSsoProvider(e.target.value)} />
          </Field>
        </div>
      </Modal>

      {/* Login History Modal */}
      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Access History"
        description="Recent login activity on your account."
        size="lg"
        footer={
          <>
            <SecondaryButton onClick={exportHistory} className="inline-flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export CSV
            </SecondaryButton>
            <PrimaryButton onClick={() => setHistoryOpen(false)}>Close</PrimaryButton>
          </>
        }
      >
        <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-2.5">Device</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-2.5">IP Address</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-2.5">Time</th>
                <th className="text-left text-[12px] font-medium text-[#64748B] px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory.map((h, i) => (
                <tr key={i} className="border-b border-[#E2E8F0] last:border-0">
                  <td className="px-4 py-2.5 text-[13px] text-[#1E293B]">{h.device}</td>
                  <td className="px-4 py-2.5 text-[13px] text-[#475569] font-mono">{h.ip}</td>
                  <td className="px-4 py-2.5 text-[13px] text-[#475569]">{h.time}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded ${
                      h.status === "Success" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"
                    }`}>
                      {h.status === "Success" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Sign Out All Sessions Confirm */}
      <ConfirmDialog
        open={signOutAllOpen}
        onClose={() => setSignOutAllOpen(false)}
        onConfirm={handleSignOutAll}
        title="Sign out all sessions"
        message="This will sign you out of all devices except this one. You'll need to sign in again on those devices."
        confirmLabel="Sign Out All"
        destructive
      />

      {/* Revoke single session Confirm */}
      <ConfirmDialog
        open={revoking !== null}
        onClose={() => setRevoking(null)}
        onConfirm={handleRevoke}
        title="Revoke session"
        message={`Revoke access for "${revoking?.label ?? ""}"? This device will be signed out immediately.`}
        confirmLabel="Revoke"
        destructive
      />
    </div>
  );
}
