import type { Metadata } from "next";
import { products } from "@/lib/repositories";
import ProductsView from "./ProductsView";

export const metadata: Metadata = { title: "Products" };

// Server Component: loads products from the SQLite-backed repository and hands
// them to the client view for interactive filtering, search and pagination.
export default function ProductsPage() {
  const data = products.list();
  return <ProductsView items={data} />;
}
