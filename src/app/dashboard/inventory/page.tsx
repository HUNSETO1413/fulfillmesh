import type { Metadata } from "next";
import { inventory } from "@/lib/repositories";
import InventoryView from "./InventoryView";

export const metadata: Metadata = { title: "Inventory" };

// Server Component: loads inventory items from the SQLite-backed repository and
// hands them to the client view for interactive filtering, search and pagination.
export default function InventoryPage() {
  const data = inventory.list();
  return <InventoryView items={data} />;
}
