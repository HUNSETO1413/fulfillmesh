import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { shipments as shipmentsRepo } from "@/lib/repositories";
import ShipmentDetailView from "./ShipmentDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Shipment ${id}` };
}

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shipment = await shipmentsRepo.get(id);
  if (!shipment) notFound();

  return <ShipmentDetailView shipment={shipment} />;
}
