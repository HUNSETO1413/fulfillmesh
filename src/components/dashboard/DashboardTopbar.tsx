"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, ChevronDown, Calendar } from "lucide-react";

interface DashboardTopbarProps {
  onMenuToggle: () => void;
  pageTitle: string;
}

export default function DashboardTopbar({
  onMenuToggle,
  pageTitle,
}: DashboardTopbarProps) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] h-14 flex items-center justify-between px-5">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#1E293B]">{pageTitle}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-[#F1F5F9] rounded-lg px-3 py-1.5">
          <Search className="w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] outline-none w-44"
          />
        </div>

        {/* Date range selector */}
        <button className="hidden sm:flex items-center gap-2 border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[13px] text-[#475569] hover:bg-[#F8FAFC] transition-colors">
          <Calendar className="w-4 h-4 text-[#94A3B8]" />
          <span className="whitespace-nowrap">May 12 – May 18, 2025</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center">
              <span className="text-white text-xs font-semibold">JD</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card border border-[#E2E8F0] py-1 z-50">
              <div className="px-3 py-2 border-b border-[#E2E8F0]">
                <p className="text-sm font-medium text-[#1E293B]">John Doe</p>
                <p className="text-xs text-[#94A3B8]">john@example.com</p>
              </div>
              <a
                href="/dashboard/settings"
                className="block px-3 py-2 text-sm text-[#475569] hover:bg-[#F8FAFC] transition-colors"
              >
                Settings
              </a>
              <a
                href="/login"
                className="block px-3 py-2 text-sm text-red-600 hover:bg-[#F8FAFC] transition-colors"
              >
                Log out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
