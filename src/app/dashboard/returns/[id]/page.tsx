import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { returns as returnsRepo } from "@/lib/repositories";
import ReturnDetailView from "./ReturnDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Return ${id}` };
}

export default async function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ret = await returnsRepo.get(id);
  if (!ret) notFound();

  return <ReturnDetailView ret={ret} />;
}
