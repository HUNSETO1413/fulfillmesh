import type { Metadata } from "next";
import { orders } from "@/lib/repositories";
import OrdersView from "./OrdersView";

export const metadata: Metadata = { title: "Orders" };

// Server Component: loads orders from the PostgreSQL-backed repository and hands
// them to the client view for interactive filtering, search and pagination.
export default async function OrdersPage() {
  const data = await orders.list();
  return <OrdersView orders={data} />;
}
