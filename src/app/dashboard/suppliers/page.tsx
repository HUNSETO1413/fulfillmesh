import type { Metadata } from "next";
import { suppliers } from "@/lib/repositories";
import SuppliersView from "./SuppliersView";

export const metadata: Metadata = { title: "Suppliers" };

// Server Component: loads suppliers from the SQLite-backed repository and hands
// them to the client view for interactive filtering, search and pagination.
export default function SuppliersPage() {
  return <SuppliersView items={suppliers.list()} />;
}
