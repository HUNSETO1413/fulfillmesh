import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { orders as ordersRepo } from "@/lib/repositories";
import OrderDetailView from "./OrderDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id}` };
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await ordersRepo.get(id);
  if (!order) notFound();
  return <OrderDetailView order={order} />;
}
