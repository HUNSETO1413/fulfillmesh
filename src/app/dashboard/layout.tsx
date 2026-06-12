import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ToastProvider } from "@/components/dashboard/Toast";

// The dashboard is user-specific and reads from the database at request time,
// so it must never be statically prerendered (this also keeps `next build`
// from needing a live database connection).
export const dynamic = "force-dynamic";

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ToastProvider>
  );
}
