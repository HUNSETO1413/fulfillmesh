import type { Metadata } from "next";
import { Suspense } from "react";
import AuthMarketing from "@/components/AuthMarketing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Create Account",
  description:
    "Create your FulfillMesh account to connect with vetted suppliers, manage fulfillment, and ship smarter from China.",
  path: "/register",
  noindex: true,
});

/** Register page – delegates to shared AuthMarketing component.
 *  Wrapped in Suspense because AuthMarketing reads `useSearchParams()`. */
export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthMarketing defaultTab="register" />
    </Suspense>
  );
}
