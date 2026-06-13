import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { quotes } from "@/lib/repositories";
import QuoteDetailView from "./QuoteDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Quote ${id}` };
}

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await quotes.get(id);
  if (!quote) notFound();

  return <QuoteDetailView quote={quote} />;
}
