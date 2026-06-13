import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { customers as customersRepo } from "@/lib/repositories";
import CustomerDetailView from "./CustomerDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Customer ${id}` };
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await customersRepo.get(id);
  if (!customer) notFound();

  return <CustomerDetailView customer={customer} />;
}
