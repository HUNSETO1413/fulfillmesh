import type { Metadata } from "next";
import { inventory } from "@/lib/repositories";
import InventoryView from "./InventoryView";

export const metadata: Metadata = { title: "Inventory" };

// Server Component: loads inventory items from the SQLite-backed repository and
// hands them to the client view for interactive filtering, search and pagination.
export default async function InventoryPage() {
  const data = await inventory.list();
  return <InventoryView items={data} />;
}
