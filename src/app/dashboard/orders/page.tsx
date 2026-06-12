import type { Metadata } from "next";
import { orders } from "@/lib/repositories";
import OrdersView from "./OrdersView";

export const metadata: Metadata = { title: "Orders" };

// Server Component: loads orders from the SQLite-backed repository and hands
// them to the client view for interactive filtering, search and pagination.
export default function OrdersPage() {
  const data = orders.list();
  return <OrdersView orders={data} />;
}
