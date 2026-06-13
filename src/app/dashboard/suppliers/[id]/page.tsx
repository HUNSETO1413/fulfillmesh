import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { suppliers as suppliersRepo } from "@/lib/repositories";
import SupplierDetailView from "./SupplierDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Supplier ${id}` };
}

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = await suppliersRepo.get(id);
  if (!supplier) notFound();

  return <SupplierDetailView supplier={supplier} />;
}
