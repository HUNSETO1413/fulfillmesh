"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu, X, ChevronDown, User,
  Search, ShieldCheck, Package, Truck, Warehouse,
  RotateCcw, Eye, BarChart3, LayoutDashboard,
  Building2, Users, Handshake, Briefcase,
} from "lucide-react";

const platform = [
  { name: "Platform Overview", href: "/platform", desc: "See the FulfillMesh control center", icon: LayoutDashboard },
  { name: "Order Management", href: "/platform/order-management", desc: "Track and manage all orders", icon: LayoutDashboard },
  { name: "Quality Control", href: "/platform/quality-control", desc: "On-site inspections & quality checks", icon: ShieldCheck },
  { name: "Shipping & Logistics", href: "/platform/shipping-logistics", desc: "Optimized routes & reliable carriers", icon: Truck },
  { name: "Inventory Visibility", href: "/platform/inventory-visibility", desc: "Real-time stock tracking", icon: Eye },
  { name: "Analytics & Reporting", href: "/platform/analytics-reporting", desc: "Data-driven fulfillment insights", icon: BarChart3 },
];

const solutions = [
  { name: "Supplier Matching", href: "/solutions/supplier-matching", desc: "Find & verify the best factories", icon: Search },
  { name: "Quality Control", href: "/solutions/quality-control", desc: "On-site inspections & quality checks", icon: ShieldCheck },
  { name: "Packaging & Labeling", href: "/solutions/packaging-labeling", desc: "Custom packaging for your brand", icon: Package },
  { name: "Shipping & Logistics", href: "/solutions/shipping-logistics", desc: "Optimized routes & reliable carriers", icon: Truck },
  { name: "Overseas Warehousing", href: "/solutions/overseas-warehousing", desc: "Store closer to your customers", icon: Warehouse },
  { name: "Returns Management", href: "/solutions/returns-management", desc: "Hassle-free returns handling", icon: RotateCcw },
  { name: "Inventory Visibility", href: "/solutions/inventory-visibility", desc: "Real-time stock tracking", icon: Eye },
  { name: "Analytics & Reporting", href: "/solutions/analytics-reporting", desc: "Data-driven fulfillment insights", icon: BarChart3 },
];

const resources = [
  { name: "Guides", href: "/resources/guides" },
  { name: "Case Studies", href: "/resources/case-studies" },
  { name: "Help Center", href: "/resources/help-center" },
  { name: "API Documentation", href: "/resources/api-documentation" },
  { name: "Shipping Insights", href: "/resources/shipping-insights" },
  { name: "Supplier Playbooks", href: "/resources/supplier-playbooks" },
  { name: "Blog", href: "/blog" },
];

const company = [
  { name: "About Us", href: "/company/about", desc: "Our mission and story", icon: Building2 },
  { name: "Careers", href: "/company/careers", desc: "Join our growing team", icon: Briefcase },
  { name: "Partners", href: "/company/partners", desc: "Partner with FulfillMesh", icon: Handshake },
  { name: "Contact", href: "/contact", desc: "Get in touch with us", icon: Users },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-soft">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg gradient-logo flex items-center justify-center">
            <span className="text-white font-bold text-xs">FM</span>
          </div>
          <span className="text-lg font-medium text-text-primary tracking-[0.5px]">
            FulfillMesh
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {/* Platform */}
          <div className="relative">
            <button
              className="flex items-center gap-1 text-[16px] font-normal text-text-primary hover:text-teal transition-colors"
              onMouseEnter={() => setOpenDropdown("platform")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              Platform <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {openDropdown === "platform" && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[420px] bg-white rounded-lg shadow-card p-5"
                onMouseEnter={() => setOpenDropdown("platform")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border-soft">
                  <LayoutDashboard className="w-4 h-4 text-teal" />
                  <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Platform</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {platform.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-soft-bg transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal/8 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-teal" />
                      </div>
                      <div>
                        <span className="text-[13px] font-semibold text-text-primary">{item.name}</span>
                        <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Solutions */}
          <div className="relative">
            <button
              className="flex items-center gap-1 text-[16px] font-normal text-text-primary hover:text-teal transition-colors"
              onMouseEnter={() => setOpenDropdown("solutions")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              Solutions <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {openDropdown === "solutions" && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[560px] bg-white rounded-lg shadow-card p-5 grid grid-cols-2 gap-2"
                onMouseEnter={() => setOpenDropdown("solutions")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="col-span-2 flex items-center gap-2 mb-2 pb-2 border-b border-border-soft">
                  <Search className="w-4 h-4 text-teal" />
                  <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Solutions</span>
                </div>
                {solutions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-soft-bg transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal/8 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-teal" />
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold text-text-primary">{item.name}</span>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Resources */}
          <div className="relative">
            <button
              className="flex items-center gap-1 text-[16px] font-normal text-text-primary hover:text-teal transition-colors"
              onMouseEnter={() => setOpenDropdown("resources")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              Resources <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {openDropdown === "resources" && (
              <div
                className="absolute top-full left-0 pt-2 w-[260px] bg-white rounded-lg shadow-card p-4"
                onMouseEnter={() => setOpenDropdown("resources")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {resources.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 rounded-md hover:bg-soft-bg transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <span className="text-[14px] font-normal text-text-primary">{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Company */}
          <div className="relative">
            <button
              className="flex items-center gap-1 text-[16px] font-normal text-text-primary hover:text-teal transition-colors"
              onMouseEnter={() => setOpenDropdown("company")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              Company <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {openDropdown === "company" && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[320px] bg-white rounded-lg shadow-card p-4"
                onMouseEnter={() => setOpenDropdown("company")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {company.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-soft-bg transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal/8 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-teal" />
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold text-text-primary">{item.name}</span>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <Link
            href="/pricing"
            className="text-[16px] font-normal text-text-primary hover:text-teal transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-label="Account menu"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-deep-navy flex items-center justify-center hover:brightness-110 transition-all"
            >
              <User className="w-4 h-4 text-white" />
            </button>
            {userMenuOpen && (
              <div
                role="menu"
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-card p-2"
              >
                <Link
                  href="/login"
                  role="menuitem"
                  className="block px-3 py-2 rounded-md text-[14px] font-normal text-text-primary hover:bg-soft-bg transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/get-started"
                  role="menuitem"
                  className="block px-3 py-2 rounded-md text-[14px] font-semibold text-teal hover:bg-soft-bg transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/book-a-demo"
            className="px-5 py-2.5 text-[14px] font-medium text-white gradient-cta rounded-lg hover:brightness-110 transition-all"
          >
            Request a Demo
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border-soft shadow-lg">
          <div className="max-w-[1200px] mx-auto px-6 py-4 space-y-1">
            {/* Platform */}
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 text-[16px] font-normal text-text-primary"
              onClick={() => toggleDropdown("m-platform")}
            >
              Platform <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "m-platform" && (
              <div className="pl-4 space-y-1">
                {platform.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-3 py-2 text-[14px] text-text-muted"
                    onClick={() => { setMobileOpen(false); setOpenDropdown(null); }}>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Solutions */}
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 text-[16px] font-normal text-text-primary"
              onClick={() => toggleDropdown("m-solutions")}
            >
              Solutions <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "m-solutions" && (
              <div className="pl-4 space-y-1">
                {solutions.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-3 py-2 text-[14px] text-text-muted"
                    onClick={() => { setMobileOpen(false); setOpenDropdown(null); }}>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Resources */}
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 text-[16px] font-normal text-text-primary"
              onClick={() => toggleDropdown("m-resources")}
            >
              Resources <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "m-resources" && (
              <div className="pl-4 space-y-1">
                {resources.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-3 py-2 text-[14px] text-text-muted"
                    onClick={() => { setMobileOpen(false); setOpenDropdown(null); }}>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Company */}
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 text-[16px] font-normal text-text-primary"
              onClick={() => toggleDropdown("m-company")}
            >
              Company <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "m-company" && (
              <div className="pl-4 space-y-1">
                {company.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-3 py-2 text-[14px] text-text-muted"
                    onClick={() => { setMobileOpen(false); setOpenDropdown(null); }}>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <Link href="/pricing" className="block px-3 py-2.5 text-[16px] font-normal text-text-primary"
              onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>

            <div className="pt-4 border-t border-border-soft space-y-2">
              <Link href="/login"
                className="block px-3 py-2.5 text-[14px] font-normal text-text-body hover:text-teal transition-colors"
                onClick={() => setMobileOpen(false)}>
                Log in
              </Link>
              <Link href="/book-a-demo"
                className="block px-4 py-2.5 text-[14px] font-medium text-white text-center gradient-cta rounded-lg"
                onClick={() => setMobileOpen(false)}>
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
