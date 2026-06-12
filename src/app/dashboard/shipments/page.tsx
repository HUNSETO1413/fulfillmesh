import type { Metadata } from "next";
import { shipments } from "@/lib/repositories";
import ShipmentsView from "./ShipmentsView";

export const metadata: Metadata = { title: "Shipments" };

// Server Component: loads shipments from the SQLite-backed repository and hands
// them to the client view for interactive filtering, search and pagination.
export default function ShipmentsPage() {
  return <ShipmentsView items={shipments.list()} />;
}
