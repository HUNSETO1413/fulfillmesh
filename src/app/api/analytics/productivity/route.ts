import { NextResponse } from "next/server";
import { getProductivityReport } from "@/lib/analytics";

// GET /api/analytics/productivity → real task productivity aggregates.
export async function GET() {
  return NextResponse.json(await getProductivityReport());
}
