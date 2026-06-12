import type { Metadata } from "next";
import { Suspense } from "react";
import AuthMarketing from "@/components/AuthMarketing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Log In",
  description:
    "Log in to your FulfillMesh account to manage orders, shipments, inventory, and your China-powered fulfillment operations.",
  path: "/login",
  noindex: true,
});

/** Login page – delegates to shared AuthMarketing component.
 *  Wrapped in Suspense because AuthMarketing reads `useSearchParams()`. */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthMarketing defaultTab="login" />
    </Suspense>
  );
}
