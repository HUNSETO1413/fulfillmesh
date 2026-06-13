import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics";

// GET /api/analytics → real KPI aggregates computed from the database.
export async function GET() {
  return NextResponse.json(await getAnalyticsSummary());
}
