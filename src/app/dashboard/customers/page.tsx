import type { Metadata } from "next";
import { customers } from "@/lib/repositories";
import CustomersView from "./CustomersView";

export const metadata: Metadata = { title: "Customers" };

// Server Component: loads customers from the SQLite-backed repository and hands
// them to the client view for interactive filtering, search and pagination.
export default async function CustomersPage() {
  return <CustomersView items={await customers.list()} />;
}
