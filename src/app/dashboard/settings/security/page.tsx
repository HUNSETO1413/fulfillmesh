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
} from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, TextInput, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";

function EnabledBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 bg-teal/10 text-teal text-[11px] font-medium rounded-full">
      Enabled
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

export default function SecurityPage() {
  const { toast } = useToast();
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Change password modal
  const [pwOpen, setPwOpen] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  // Sign out all sessions
  const [signOutAllOpen, setSignOutAllOpen] = useState(false);
  // Revoke single session
  const [revoking, setRevoking] = useState<Session | null>(null);

  const [sessions, setSessions] = useState<Session[]>([
    { id: "s1", icon: Monitor, label: "Chrome on Windows · New York, USA", current: true },
    { id: "s2", icon: Smartphone, label: "Safari on iPhone · London, UK", current: false, lastActive: "1 day ago" },
  ]);

  const handleChangePassword = () => {
    if (!pwCurrent || !pwNew || !pwConfirm) {
      toast("Please fill in all password fields", "error");
      return;
    }
    if (pwNew !== pwConfirm) {
      toast("New passwords do not match", "error");
      return;
    }
    setPwOpen(false);
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
    toast("Password changed successfully");
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
              onClick={() => setPwOpen(true)}
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
                  <EnabledBadge />
                </div>
                <p className="text-[12px] text-text-light mt-0.5">Enhance your account security</p>
              </div>
            </div>
            <button
              onClick={() => toast("Two-factor authentication settings opened")}
              className="shrink-0 px-3.5 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-action-blue/90 transition-colors"
            >
              Manage 2FA
            </button>
          </div>

          {/* Single Sign-On */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Globe className="w-[18px] h-[18px] text-text-muted shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium text-text-primary">Single Sign-On (SSO)</p>
                  <EnabledBadge />
                </div>
                <p className="text-[12px] text-text-light mt-0.5">Connect with your identity provider</p>
              </div>
            </div>
            <button
              onClick={() => toast("Single Sign-On settings opened")}
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
            onClick={() => toast("Loading access history…", "info")}
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
            <PrimaryButton onClick={handleChangePassword}>Update Password</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Current password" required>
            <TextInput type="password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} placeholder="••••••••" />
          </Field>
          <Field label="New password" required>
            <TextInput type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} placeholder="••••••••" />
          </Field>
          <Field label="Confirm new password" required>
            <TextInput type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} placeholder="••••••••" />
          </Field>
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
