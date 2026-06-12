"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Auth screens render their own split layout (AuthLayout) — no marketing chrome.
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dashboard provides its own sidebar + topbar chrome.
  if (pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }

  // Auth screens: no marketing header/footer.
  if (AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return <>{children}</>;
  }

  // Onboarding: minimal top bar (logo + avatar), no marketing nav or footer.
  if (pathname.startsWith("/onboarding")) {
    return (
      <>
        <header className="sticky top-0 z-50 bg-white border-b border-border-soft">
          <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-logo flex items-center justify-center">
                <span className="text-white font-bold text-xs">FM</span>
              </div>
              <span className="text-lg font-medium text-text-primary tracking-[0.5px]">
                FulfillMesh
              </span>
            </Link>
            <div className="w-9 h-9 rounded-full bg-action-blue flex items-center justify-center">
              <span className="text-white text-xs font-semibold">AD</span>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
