import type { Metadata } from "next";
import { quotes } from "@/lib/repositories";
import QuotesView from "./QuotesView";

export const metadata: Metadata = { title: "Quotes" };

// Server Component: loads quotes from the SQLite-backed repository and hands
// them to the client view for interactive filtering, search and pagination.
export default async function QuotesPage() {
  return <QuotesView items={await quotes.list()} />;
}
