import AuthMarketing from "@/components/AuthMarketing";

/** Login page – delegates to shared AuthMarketing component */
export default function LoginPage() {
  return <AuthMarketing defaultTab="login" />;
}
