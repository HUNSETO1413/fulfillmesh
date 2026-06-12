import type { Metadata } from "next";
import { invoices } from "@/lib/repositories";
import InvoicesView from "./InvoicesView";

export const metadata: Metadata = { title: "Invoices" };

// Server Component: loads invoices from the SQLite-backed repository and hands
// them to the client view for interactive filtering, search and pagination.
export default async function InvoicesPage() {
  return <InvoicesView items={await invoices.list()} />;
}
