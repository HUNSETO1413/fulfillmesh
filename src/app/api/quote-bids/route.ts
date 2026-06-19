import { NextResponse } from "next/server";
import { quoteBids } from "@/lib/repositories";

// GET /api/quote-bids?quoteId=QUO-001  → supplier bids (optionally filtered by quote)
export async function GET(request: Request) {
  const quoteId = new URL(request.url).searchParams.get("quoteId");
  const data = quoteId ? await quoteBids.listByQuote(quoteId) : await quoteBids.list();
  return NextResponse.json({ data, total: data.length });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const created = await quoteBids.create(body);
  return NextResponse.json(created, { status: 201 });
}
