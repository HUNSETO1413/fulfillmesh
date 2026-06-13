import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products as productsRepo } from "@/lib/repositories";
import ProductDetailView from "./ProductDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Product ${id}` };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await productsRepo.get(id);
  if (!product) notFound();
  return <ProductDetailView product={product} />;
}
