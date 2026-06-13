import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { qcInspections } from "@/lib/repositories";
import QcDetailView from "./QcDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `QC Inspection ${id}` };
}

export default async function QcInspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inspection = await qcInspections.get(id);
  if (!inspection) notFound();

  return <QcDetailView inspection={inspection} />;
}
