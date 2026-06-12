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

function EnabledBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 bg-teal/10 text-teal text-[11px] font-medium rounded-full">
      Enabled
    </span>
  );
}

function BlueButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="shrink-0 px-3.5 py-2 text-[13px] font-medium text-white bg-action-blue rounded-lg hover:bg-action-blue/90 transition-colors">
      {children}
    </button>
  );
}

export default function SecurityPage() {
  const [loginAlerts, setLoginAlerts] = useState(true);

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
            <BlueButton>Change Password</BlueButton>
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
            <BlueButton>Manage 2FA</BlueButton>
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
            <BlueButton>Manage SSO</BlueButton>
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
            <button className="shrink-0 px-3.5 py-2 text-[13px] font-medium text-white bg-[#EF4444] rounded-lg hover:bg-[#EF4444]/90 transition-colors">
              Sign Out All Sessions
            </button>
          </div>
        </div>

        {/* Device rows */}
        <div className="px-5 pb-4 space-y-2">
          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-soft-bg">
            <div className="flex items-center gap-3">
              <Monitor className="w-4 h-4 text-text-muted shrink-0" />
              <p className="text-[13px] text-text-primary">Chrome on Windows &middot; New York, USA</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2 py-0.5 bg-action-blue/10 text-action-blue text-[11px] font-medium rounded-full">
                Current Session
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-soft-bg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-text-muted shrink-0" />
              <p className="text-[13px] text-text-primary">Safari on iPhone &middot; London, UK</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-text-light">1 day ago</span>
              <button className="text-text-light hover:text-text-muted transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
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
                <EnabledBadge />
              </div>
              <p className="text-[12px] text-text-light mt-0.5">Get notified of important activity on your account.</p>
            </div>
          </div>
          <button
            onClick={() => setLoginAlerts(!loginAlerts)}
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
          <button className="shrink-0 px-3.5 py-2 text-[13px] font-medium text-action-blue border border-action-blue rounded-lg hover:bg-action-blue/5 transition-colors">
            View History
          </button>
        </div>
      </div>
    </div>
  );
}
