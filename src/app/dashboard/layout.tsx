import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
