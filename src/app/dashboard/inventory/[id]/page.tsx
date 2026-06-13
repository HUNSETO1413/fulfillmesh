import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inventory as inventoryRepo } from "@/lib/repositories";
import InventoryDetailView from "./InventoryDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Inventory ${id}` };
}

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await inventoryRepo.get(id);
  if (!item) notFound();
  return <InventoryDetailView item={item} />;
}
